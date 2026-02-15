from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import threading
import os

from watcher import start_watching, index_existing_files
from cluster_engine import storage
from extractor import extract_text

from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

from google import genai

# -----------------------------
# MODEL SETUP
# -----------------------------

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

client = genai.Client(
    api_key=os.getenv("GOOGLE_API_KEY")
)

GEN_MODEL = "gemini-3-flash-preview"

# -----------------------------
# PATH CONFIG
# -----------------------------

ROOT_FOLDER = os.path.join(os.path.dirname(__file__), "root_files")

# -----------------------------
# FILE READER (ROBUST)
# -----------------------------

def read_file_content(file_path):
    try:
        # If only filename stored → search inside root_files
        if not os.path.exists(file_path):
            found = False
            for root, _, files in os.walk(ROOT_FOLDER):
                if os.path.basename(file_path) in files:
                    file_path = os.path.join(root, os.path.basename(file_path))
                    found = True
                    break
            if not found:
                print("FILE NOT FOUND IN ROOT:", file_path)
                return ""

        content = extract_text(file_path)
        if content:
            print(f"READ FILE: {file_path} LEN: {len(content)}")
            return content.strip()
        return ""

    except Exception as e:
        print("FILE READ ERROR:", file_path, e)
        return ""

# -----------------------------
# FASTAPI SETUP
# -----------------------------

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

@app.get("/status")
def system_status():
    return {
        "status": "running",
        "clusters": len(storage),
        "files": sum(len(c["files"]) for c in storage.values())
    }

@app.get("/clusters")
def get_clusters():
    return storage

# -----------------------------
# SEARCH ENDPOINT
# -----------------------------

@app.post("/search")
def search_files(request: SearchRequest):

    query_embedding = embedding_model.encode(request.query)
    results = []

    for cluster_id, cluster_data in storage.items():
        for file_path, file_embedding in cluster_data["files"].items():

            similarity = cosine_similarity(
                [query_embedding],
                [file_embedding]
            )[0][0]

            results.append({
                "file": file_path,
                "similarity": float(similarity),
                "cluster_label": cluster_data.get("label", cluster_id)
            })

    results.sort(key=lambda x: x["similarity"], reverse=True)

    return {"results": results[:5]}

# -----------------------------
# RAG QA ENDPOINT
# -----------------------------

@app.post("/ask")
def rag_answer(request: SearchRequest):

    query_embedding = embedding_model.encode(request.query)
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

    MAX_CONTEXT_CHARS = 4000
    context = ""

    for file_path, _ in top_files:
        text = read_file_content(file_path)
        
        if len(context) + len(text) > MAX_CONTEXT_CHARS:
            remaining = MAX_CONTEXT_CHARS - len(context)
            # Find the last space within the remaining limit to avoid cutting mid-word
            trunc_index = text[:remaining].rfind(" ")
            if trunc_index == -1:
                trunc_index = remaining
            
            context += text[:trunc_index] + " [TRUNCATED]..."
            break
        else:
            context += text + "\n---\n"

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
{request.query}

Answer:
"""

    try:
        # Configuration for safety and timeout
        config = {
            "max_output_tokens": 1024,
            "temperature": 0.1,
        }

        response = client.models.generate_content(
            model=GEN_MODEL,
            contents=prompt,
            config=config
        )

        if not response or not response.text:
            answer = "AI returned an empty response. Please try again."
        else:
            answer = response.text.strip()

    except Exception as e:
        print("LLM ERROR:", e)
        if "429" in str(e):
            answer = "API Rate limit exceeded. Please wait a moment."
        elif "timeout" in str(e).lower():
            answer = "Request timed out. The context might be too large or the service is slow."
        else:
            answer = "AI service temporarily unavailable or encountered an error."

    return {
        "answer": answer,
        "sources": [f[0] for f in top_files],
        "confidence": "high" if context else "low"
    }

# -----------------------------
# WATCHER THREAD
# -----------------------------

def run_watcher():
    print("Indexing existing files...")
    index_existing_files()
    print("Watching for new files...")
    start_watching(ROOT_FOLDER)

threading.Thread(target=run_watcher, daemon=True).start()
