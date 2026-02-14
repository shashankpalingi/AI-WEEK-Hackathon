import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import os
import shutil
from storage import load_storage, save_storage
from naming_engine import generate_cluster_label
import time

SIMILARITY_THRESHOLD = 0.45  # Increased to be more selective

file_embeddings = {}
clusters = {}

# 3️⃣ Load storage FIRST
storage = load_storage()
# Rebuild clusters from storage on startup
if storage:
    for cluster_id, cluster_data in storage.items():
        cid = int(cluster_id)
        clusters[cid] = list(cluster_data["files"].keys())
        for f, emb in cluster_data["files"].items():
            file_embeddings[f] = np.array(emb)

def add_file(file_path, embedding, skip_naming=False):
    global file_embeddings, clusters, storage

    file_path = os.path.abspath(file_path)
    embedding = np.array(embedding)
    file_embeddings[file_path] = embedding

    # FIRST FILE → CREATE FIRST CLUSTER
    if not clusters:
        label = generate_cluster_label([file_path]) if not skip_naming else "Refining_Label"
        clusters[0] = [file_path]

        storage["0"] = {
            "label": label,
            "centroid": embedding.tolist(),
            "files": {
                file_path: embedding.tolist()
            }
        }

        save_storage(storage)
        return

    # CHECK EXISTING CLUSTERS
    for cluster_id, files in clusters.items():
        existing_embeddings = [file_embeddings[f] for f in files if f in file_embeddings]
        if not existing_embeddings: continue

        similarity_scores = cosine_similarity(
            [embedding],
            existing_embeddings
        )

        max_similarity = np.max(similarity_scores)

        print("Max similarity with cluster", cluster_id, "=", max_similarity)

        if max_similarity >= SIMILARITY_THRESHOLD:
            clusters[cluster_id].append(file_path)

            # 🔥 ADD FILE TO STORAGE
            storage[str(cluster_id)]["files"][file_path] = embedding.tolist()

            # 🔥 UPDATE CENTROID
            file_vectors = list(storage[str(cluster_id)]["files"].values())
            centroid = np.mean(file_vectors, axis=0)
            storage[str(cluster_id)]["centroid"] = centroid.tolist()

            # Optional: Refresh label if cluster grows significantly
            if len(storage[str(cluster_id)]["files"]) == 5:
                storage[str(cluster_id)]["label"] = generate_cluster_label(list(storage[str(cluster_id)]["files"].keys()))

            save_storage(storage)
            return

    # NO MATCH → CREATE NEW CLUSTER
    new_cluster_id = len(clusters)
    label = generate_cluster_label([file_path]) if not skip_naming else "Refining_Label"
    clusters[new_cluster_id] = [file_path]

    storage[str(new_cluster_id)] = {
        "label": label,
        "centroid": embedding.tolist(),
        "files": {
            file_path: embedding.tolist()
        }
    }

    save_storage(storage)


def _heal_paths(root_path):
    """Reconcile storage paths with physical file locations if they go missing."""
    global storage
    changed = False
    
    # Map filenames to their actual locations on disk
    physical_map = {}
    for root, _, files in os.walk(root_path):
        for f in files:
            if not f.startswith("."):
                physical_map[f] = os.path.join(root, f)

    for cluster_id, cluster_data in storage.items():
        updates = {}
        for old_path in list(cluster_data["files"].keys()):
            if not os.path.exists(old_path):
                filename = os.path.basename(old_path)
                if filename in physical_map:
                    new_path = physical_map[filename]
                    print(f"SEFS: Healing path for {filename}: {old_path} -> {new_path}")
                    updates[old_path] = new_path
                    changed = True
        
        for old, new in updates.items():
            emb = cluster_data["files"].pop(old)
            cluster_data["files"][new] = emb
            
    if changed:
        save_storage(storage)
    return changed

def sync_folders(root_path):
    """
    Create semantic folders and move files accordingly.
    Storage is the source of truth for labels.
    """
    # 0. Heal paths first so we know where files really are
    _heal_paths(root_path)

    for cluster_id, cluster_data in storage.items():
        # 1. Detect Manual Rename: If files moved to a different folder manually
        # Find actual current folder by looking at first file
        existing_files = [f for f in cluster_data["files"].keys() if os.path.exists(f)]
        if existing_files:
            actual_parent = os.path.basename(os.path.dirname(existing_files[0]))
            stored_label = cluster_data.get("label", "")
            
            # If disk folder != stored label AND it's not a generic name, assume manual override
            if (actual_parent != stored_label and 
                not actual_parent.startswith("Refining_Label") and 
                not actual_parent.startswith("cluster_")):
                print(f"SEFS: Detected manual rename for cluster {cluster_id}: {stored_label} -> {actual_parent}")
                cluster_data["label"] = actual_parent
                save_storage(storage)
                continue # Skip refinement if manually renamed

        # 2. BACKFILL OR REFRESH FALLBACK LABELS
        current_label = cluster_data.get("label", "")
        is_fallback = (
            not current_label or 
            current_label in ("New_Cluster", "Uncategorized", "Miscellaneous") or 
            current_label.startswith("Refining_Label") or 
            current_label.startswith("cluster_")
        )
        
        if is_fallback:
            print(f"SEFS: Refining semantic label for cluster {cluster_id}...")
            files = list(cluster_data["files"].keys())
            
            # Simple retry with backoff for 429
            new_label = None
            for attempt in range(3):
                new_label = generate_cluster_label(files)
                if "429" not in str(new_label) and new_label != "Refining_Label":
                    break
                
                wait_time = (attempt + 1) * 20  # increased backoff
                print(f"SEFS: Rate limited, waiting {wait_time}s to retry cluster {cluster_id}...")
                time.sleep(wait_time)

            # Mandatory small delay between DIFFERENT clusters to avoid hitting burst limits
            time.sleep(2)

            if new_label and new_label != current_label and not new_label.startswith("Refining_Label"):
                # Rename folder if it already exists
                old_folder = os.path.join(root_path, current_label) if current_label else None
                cluster_data["label"] = new_label
                
                if old_folder and os.path.exists(old_folder):
                    new_folder = os.path.join(root_path, new_label)
                    if not os.path.exists(new_folder):
                        print(f"SEFS: Renaming folder {current_label} -> {new_label}")
                        os.rename(old_folder, new_folder)

        label = cluster_data.get("label", f"cluster_{cluster_id}")
        
        # Ensure unique folder name even if labels collide
        cluster_folder = os.path.join(root_path, label)
        
        # If this folder is already used by a DIFFERENT cluster, append ID
        used_folders = {c_data.get("label"): c_id for c_id, c_data in storage.items() if c_id != cluster_id}
        if label in used_folders:
             label = f"{label}_{cluster_id}"
             cluster_folder = os.path.join(root_path, label)

        os.makedirs(cluster_folder, exist_ok=True)

        updates = {}
        for file_path, embedding_list in cluster_data["files"].items():
            if not os.path.exists(file_path):
                continue
                
            filename = os.path.basename(file_path)
            destination = os.path.join(cluster_folder, filename)

            # Move if not already in the correct folder
            if os.path.abspath(file_path) != os.path.abspath(destination):
                print(f"SEFS: Organizing {filename} -> {label}")
                try:
                    shutil.move(file_path, destination)
                    updates[file_path] = destination
                except Exception as e:
                    print(f"Move Error: {e}")

        # Update storage with new paths
        for old_path, new_path in updates.items():
            emb = cluster_data["files"].pop(old_path)
            cluster_data["files"][new_path] = emb
    
    save_storage(storage)

    # 3. Prune empty folders to keep root clean
    for item in os.listdir(root_path):
        item_path = os.path.join(root_path, item)
        if os.path.isdir(item_path):
            if not os.listdir(item_path):
                print(f"SEFS: Pruning empty folder: {item}")
                try:
                    os.rmdir(item_path)
                except Exception:
                    pass
