from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import threading
import os
from watcher import start_watching
from cluster_engine import storage
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("all-MiniLM-L6-v2")

class SearchRequest(BaseModel):
    query: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

connected_clients = []

@app.get("/")
def read_root():
    return {"message": "SEFS Backend Running"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    print("Client connected")

    try:
        while True:
            await asyncio.sleep(1)
    except:
        connected_clients.remove(websocket)
        print("Client disconnected")

@app.post("/search")
def search_files(request: SearchRequest):

    query_text = request.query
    query_embedding = model.encode(query_text)

    results = []

    for cluster_id, cluster_data in storage.items():
        for file_path, file_embedding in cluster_data["files"].items():

            similarity = cosine_similarity(
                [query_embedding],
                [file_embedding]
            )[0][0]

            results.append({
                "file": file_path,
                "similarity": float(similarity)
            })

    results = sorted(results, key=lambda x: x["similarity"], reverse=True)

    return {"results": results[:5]}




# Start watcher in background thread
ROOT_FOLDER = os.path.join(os.path.dirname(__file__), "root_files")

def run_watcher():
    start_watching(ROOT_FOLDER)

threading.Thread(target=run_watcher, daemon=True).start()

