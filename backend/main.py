from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import threading
from watcher import start_watching
from cluster_engine import storage
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


model = SentenceTransformer("all-MiniLM-L6-v2")

import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
generator = genai.GenerativeModel("gemini-3-flash-preview")


ROOT_FOLDER = os.path.join(os.path.dirname(__file__), "root_files")

def read_file_content(file_path):
    try:
        # If storage saved only filename → search inside clusters
        if not os.path.exists(file_path):
            for root, _, files in os.walk(ROOT_FOLDER):
                if os.path.basename(file_path) in files:
                    file_path = os.path.join(root, os.path.basename(file_path))
                    break

        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read().strip()
            print("READ FILE:", file_path, "LEN:", len(content))
            return content

    except Exception as e:
        print("FILE READ ERROR:", file_path, e)
        return ""


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

@app.post("/ask")
def rag_answer(request: SearchRequest):
    query_text = request.query
    query_embedding = model.encode(query_text)

    scored_files = []

    for cluster_data in storage.values():
        for file_path, file_embedding in cluster_data["files"].items():
            similarity = cosine_similarity(
                [query_embedding],
                [file_embedding]
            )[0][0]
            scored_files.append((file_path, similarity))

    scored_files.sort(key=lambda x: x[1], reverse=True)
    top_files = scored_files[:2]

    context = ""
    for file_path, _ in top_files:
        context += read_file_content(file_path) + "\n"

    # 🚨 VERY IMPORTANT SAFETY CHECK
    if context.strip() == "":
        return {
            "answer": "No relevant documents found in knowledge base.",
            "sources": []
        }

    prompt = f"""
You are an AI assistant for document-based question answering.

Rules:
- Use ONLY the provided context
- If answer not present → say "Information not found in knowledge base"
- Be concise and factual

Context:
{context}

Question:
{query_text}

Answer:
"""

    response = generator.generate_content(prompt)

    answer = response.text if response.text else "Model could not generate an answer."

    return {
        "answer": answer,
        "sources": [
            {"file": f[0], "score": float(f[1])}
            for f in top_files
        ]
    }





# Start watcher in background thread

def run_watcher():
    start_watching(ROOT_FOLDER)

threading.Thread(target=run_watcher, daemon=True).start()


