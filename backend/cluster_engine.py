import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import os
import shutil
from storage import load_storage, save_storage

SIMILARITY_THRESHOLD = 0.7

file_embeddings = {}
clusters = {}

storage = load_storage()
# Rebuild clusters from storage on startup
if storage:
    for cluster_id, cluster_data in storage.items():
        cid = int(cluster_id)
        clusters[cid] = []

        for file_path, embedding in cluster_data["files"].items():
            clusters[cid].append(file_path)
            file_embeddings[file_path] = np.array(embedding)


# Store embeddings in memory


def add_file(file_path, embedding):
    global file_embeddings, clusters, storage

    embedding = np.array(embedding)
    file_embeddings[file_path] = embedding

    # FIRST FILE → CREATE FIRST CLUSTER
    if not clusters:
        clusters[0] = [file_path]

        storage["0"] = {
            "centroid": embedding.tolist(),
            "files": {
                file_path: embedding.tolist()
            }
        }

        save_storage(storage)
        return

    # CHECK EXISTING CLUSTERS
    for cluster_id, files in clusters.items():
        existing_embeddings = [file_embeddings[f] for f in files]

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

            # 🔥 UPDATE CENTROID (THIS IS YOUR STEP 3 LOCATION)
            file_vectors = list(storage[str(cluster_id)]["files"].values())
            centroid = np.mean(file_vectors, axis=0)
            storage[str(cluster_id)]["centroid"] = centroid.tolist()

            save_storage(storage)
            return

    # NO MATCH → CREATE NEW CLUSTER
    new_cluster_id = len(clusters)
    clusters[new_cluster_id] = [file_path]

    storage[str(new_cluster_id)] = {
        "centroid": embedding.tolist(),
        "files": {
            file_path: embedding.tolist()
        }
    }

    save_storage(storage)



def print_clusters():
    print("\n=== Current Semantic Clusters ===")
    for cid, files in clusters.items():
        print(f"\nCluster {cid}:")
        for f in files:
            print(f" - {f}")
    print("=" * 50)


def sync_folders(root_path):
    """
    Create semantic folders and move files accordingly
    """

    # Create new cluster folders
    for cluster_id, files in clusters.items():
        cluster_folder = os.path.join(root_path, f"cluster_{cluster_id}")
        os.makedirs(cluster_folder, exist_ok=True)

        for file_path in files:
            if os.path.exists(file_path):
                filename = os.path.basename(file_path)
                new_path = os.path.join(cluster_folder, filename)

                # Move file if not already there
                if not os.path.exists(new_path):
                    shutil.move(file_path, new_path)

print("Restored Clusters:", clusters)

