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


# Logic moved to cluster_engine.py


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
                    removed = True
                    break
            
            if removed:
                print(f"SEFS: Removed deleted file from index: {file_path}")
                from cluster_engine import save_storage, sync_folders
                save_storage(storage)
                sync_folders(ROOT_FOLDER)

    def process_file(self, file_path):
        # Ignore if file was just moved/deleted by another event/process
        if not os.path.exists(file_path):
            return

        try:
            content = extract_text(file_path)
            if not content:
                return

            content = content.strip()
            if not content:
                return

            embedding = model.encode(content)

            # Use absolute path to avoid ambiguity
            abs_path = os.path.abspath(file_path)
            
            # Remove from old cluster if it exists (for re-clustering on modification)
            for cluster_data in storage.values():
                if abs_path in cluster_data["files"]:
                    cluster_data["files"].pop(abs_path)
                    break

            from cluster_engine import add_file
            add_file(abs_path, embedding)

            # Organize folders
            sync_folders(ROOT_FOLDER)

            print("File processed & organized:", file_path)

        except FileNotFoundError:
            # Common race condition during move operations
            pass
        except Exception as e:
            import traceback
            print("Processing error:", e)
            traceback.print_exc()


def start_watching(path):
    event_handler = FileHandler()
    observer = Observer()
    # Enable recursive watching so edits inside semantic folders are caught
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

    for root, _, files in os.walk(ROOT_FOLDER):
        for file in files:
            # Skip hidden files
            if file.startswith("."):
                continue
                
            path = os.path.join(root, file)

            try:
                content = extract_text(path)
                if not content:
                    continue
                
                content = content.strip()
                if not content:
                    continue

                embedding = model.encode(content)
                from cluster_engine import add_file
                add_file(path, embedding, skip_naming=True)

            except Exception as e:
                print("Index error:", path, e)

    sync_folders(ROOT_FOLDER)
    print("Initial indexing complete.")
