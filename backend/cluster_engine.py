import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import os
import shutil


# Store embeddings in memory
file_embeddings = {}
clusters = {}

SIMILARITY_THRESHOLD = 0.7


def add_file(file_path, embedding):
    global file_embeddings, clusters

    file_embeddings[file_path] = np.array(embedding)

    # If first file, create first cluster
    if not clusters:
        clusters[0] = [file_path]
        return

    # Compare with existing clusters
    for cluster_id, files in clusters.items():
        existing_embeddings = [file_embeddings[f] for f in files]

        similarity_scores = cosine_similarity(
            [embedding],
            existing_embeddings
        )

        max_similarity = np.max(similarity_scores)

        if max_similarity >= SIMILARITY_THRESHOLD:
            clusters[cluster_id].append(file_path)
            return

    # If no cluster matched → create new cluster
    new_cluster_id = len(clusters)
    clusters[new_cluster_id] = [file_path]


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
