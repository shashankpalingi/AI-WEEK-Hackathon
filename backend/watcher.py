import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from cluster_engine import storage, sync_folders
from cluster_sync import sync_clusters_to_disk # Keep if used else rely on sync_folders
from extractor import extract_text
import os

model = SentenceTransformer("all-MiniLM-L6-v2")
ROOT_FOLDER = os.path.join(os.path.dirname(__file__), "root_files")

SIMILARITY_THRESHOLD = 0.3


# Cache to skip re-processing unchanged files
# format: {abs_path: last_mtime}
file_mtime_cache = {}

class FileHandler(FileSystemEventHandler):

    def on_created(self, event):
        if not event.is_directory:
            self.process_file(event.src_path)

    def on_modified(self, event):
        if not event.is_directory:
            self.process_file(event.src_path)

    def on_deleted(self, event):
        if not event.is_directory:
            file_path = os.path.abspath(event.src_path)
            removed = False
            for cluster_data in storage.values():
                if file_path in cluster_data["files"]:
                    cluster_data["files"].pop(file_path)
                    if "metadata" in cluster_data and file_path in cluster_data["metadata"]:
                        cluster_data["metadata"].pop(file_path)
                    removed = True
                    break
            
            if removed:
                print(f"SEFS: Removed deleted file from index: {file_path}")
                from cluster_engine import save_storage, sync_folders
                save_storage(storage)
                sync_folders(ROOT_FOLDER)

    def process_file(self, file_path):
        if not os.path.exists(file_path):
            return

        abs_path = os.path.abspath(file_path)
        
        # Check mtime to skip unchanged files (Feature 6)
        try:
            mtime = os.path.getmtime(abs_path)
            if file_mtime_cache.get(abs_path) == mtime:
                return
            file_mtime_cache[abs_path] = mtime
        except Exception:
            pass

        try:
            from extractor import extract_text, chunk_text, extract_metadata
            
            content = extract_text(abs_path)
            if not content:
                print(f"SEFS: Skipping empty or unreadable file: {file_path}")
                return

            # Feature 1: Semantic Chunking
            chunks = chunk_text(content, chunk_size=500, overlap=100)
            
            # Feature 6: Limit chunks per file (max 20)
            if len(chunks) > 20:
                print(f"SEFS: Truncating {file_path} to 20 chunks")
                chunks = chunks[:20]

            if not chunks:
                return

            # Feature 6: Batch embedding (using model.encode(list))
            print(f"SEFS: Embedding {len(chunks)} chunks for {os.path.basename(file_path)}...")
            embeddings = model.encode(chunks)
            
            chunks_data = []
            for text, emb in zip(chunks, embeddings):
                chunks_data.append({
                    "text": text,
                    "embedding": emb.tolist()
                })

            # Feature 3: Metadata extraction
            metadata = extract_metadata(abs_path)

            # Re-clustering: Remove from old cluster if it exists
            for cluster_data in storage.values():
                if abs_path in cluster_data["files"]:
                    cluster_data["files"].pop(abs_path)
                    if "metadata" in cluster_data and abs_path in cluster_data["metadata"]:
                        cluster_data["metadata"].pop(abs_path)
                    break

            from cluster_engine import add_file
            add_file(abs_path, chunks_data, metadata)

            # Organize folders
            sync_folders(ROOT_FOLDER)
            print("File processed & organized:", file_path)

        except FileNotFoundError:
            pass
        except Exception as e:
            import traceback
            print("Processing error:", e)
            traceback.print_exc()


def start_watching(path):
    event_handler = FileHandler()
    observer = Observer()
    observer.schedule(event_handler, path=path, recursive=True)
    observer.start()
    print(f"Watching folder (recursive): {path}")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()

def index_existing_files():
    print("Indexing existing files...")
    handler = FileHandler()
    for root, _, files in os.walk(ROOT_FOLDER):
        for file in files:
            if file.startswith("."):
                continue
                
            path = os.path.join(root, file)
            handler.process_file(path)

    sync_folders(ROOT_FOLDER)
    print("Initial indexing complete.")
