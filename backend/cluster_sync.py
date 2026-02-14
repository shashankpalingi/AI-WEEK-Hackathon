import os
import shutil

def sync_clusters_to_disk(ROOT_FOLDER, storage):
    for cluster_id, cluster_data in storage.items():
        cluster_folder = os.path.join(ROOT_FOLDER, f"cluster_{cluster_id}")
        os.makedirs(cluster_folder, exist_ok=True)

        # We need to track moves to update storage keys
        updates = {}
        for file_path, embedding in cluster_data["files"].items():
            filename = os.path.basename(file_path)
            destination = os.path.join(cluster_folder, filename)

            # ✅ Skip if already in correct place
            if os.path.abspath(file_path) == os.path.abspath(destination):
                continue

            # ✅ If file exists somewhere else → move instead of copy
            if os.path.exists(file_path):
                print(f"Moving {file_path} -> {destination}")
                shutil.move(file_path, destination)
                updates[file_path] = destination
        
        # Apply updates to this cluster's files
        for old_path, new_path in updates.items():
            embedding = cluster_data["files"].pop(old_path)
            cluster_data["files"][new_path] = embedding
