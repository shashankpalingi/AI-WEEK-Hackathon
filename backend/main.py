from fastapi import FastAPI, WebSocket, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import threading
import os
import shutil

from watcher import start_watching, index_existing_files, FileHandler
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

GEN_MODEL = "gemini-2.5-flash"

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

@app.get("/files")
def list_files_with_metadata():
    """
    Returns list of files with metadata + cluster id.
    """
    all_files = []
    for cluster_id, cluster_data in storage.items():
        metadata_map = cluster_data.get("metadata", {})
        for file_path in cluster_data["files"]:
            all_files.append({
                "file": file_path,
                "cluster_id": cluster_id,
                "cluster_label": cluster_data.get("label", "Unknown"),
                "metadata": metadata_map.get(file_path, {})
            })
    return all_files

# -----------------------------
# UPLOAD ENDPOINT
# -----------------------------

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Accepts a file upload, saves it to root_files/,
    and triggers processing (embed + cluster + sync).
    """
    try:
        # Validate file type
        allowed_extensions = {".txt", ".pdf"}
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in allowed_extensions:
            return {"error": f"Unsupported file type: {ext}. Only .txt and .pdf are allowed."}

        # Save file to root_files/
        dest_path = os.path.join(ROOT_FOLDER, file.filename)
        with open(dest_path, "wb") as f:
            content = await file.read()
            f.write(content)

        print(f"UPLOAD: Saved {file.filename} to {dest_path}")

        # Process in background thread (extract, embed, cluster, sync)
        handler = FileHandler()
        thread = threading.Thread(target=handler.process_file, args=(dest_path,), daemon=True)
        thread.start()

        return {"status": "success", "filename": file.filename, "path": dest_path}

    except Exception as e:
        print(f"UPLOAD ERROR: {e}")
        return {"error": str(e)}

# -----------------------------
# SEARCH ENDPOINT
# -----------------------------

@app.post("/search")
def search_files(request: SearchRequest):
    try:
        query_embedding = embedding_model.encode(request.query)
        results = []

        for cluster_id, cluster_data in storage.items():
            for file_path, chunks in cluster_data["files"].items():
                # Search against chunks (Feature 1)
                max_sim = -1.0
                best_chunk = ""
                
                for chunk in chunks:
                    sim = cosine_similarity(
                        [query_embedding],
                        [chunk["embedding"]]
                    )[0][0]
                    
                    if sim > max_sim:
                        max_sim = sim
                        best_chunk = chunk["text"]

                results.append({
                    "file": file_path,
                    "similarity": float(max_sim),
                    "snippet": best_chunk[:200] + "...",
                    "cluster_label": cluster_data.get("label", cluster_id)
                })

        results.sort(key=lambda x: x["similarity"], reverse=True)
        return {"results": results[:5]}
    except Exception as e:
        print("SEARCH ERROR:", e)
        return {"results": [], "error": str(e)}

# -----------------------------
# RAG QA ENDPOINT
# -----------------------------

@app.post("/ask")
def rag_answer(request: SearchRequest):
    try:
        query_embedding = embedding_model.encode(request.query)
        all_chunks = []

        for cluster_id, cluster_data in storage.items():
            for file_path, chunks in cluster_data["files"].items():
                for chunk in chunks:
                    similarity = cosine_similarity(
                        [query_embedding],
                        [chunk["embedding"]]
                    )[0][0]
                    
                    all_chunks.append({
                        "file": file_path,
                        "text": chunk["text"],
                        "similarity": similarity
                    })

        # Sort by similarity and take top N (Feature 2)
        all_chunks.sort(key=lambda x: x["similarity"], reverse=True)
        top_chunks = all_chunks[:10]  # Take top 10 chunks to filter down

        if not top_chunks:
            return {
                "answer": "No relevant documents found in knowledge base.",
                "sources": [],
                "confidence": 0.0
            }

        # CALCULATE CONFIDENCE (Feature 4: average similarity of retrieved chunks)
        # We'll take the top 3 chunks for confidence Calculation
        confidence = sum(c["similarity"] for c in top_chunks[:3]) / min(3, len(top_chunks))

        # SMART CONTEXT BUILDER (Feature 2)
        MAX_CONTEXT_CHARS = 4000
        context_parts = []
        chars_used = 0
        sources = set()
        seen_chunks = set()

        for chunk in top_chunks:
            # deduplicate (Feature 2)
            if chunk["text"] in seen_chunks:
                continue
            seen_chunks.add(chunk["text"])

            header = f"[File: {os.path.basename(chunk['file'])}]\n"
            content = f"{chunk['text']}\n\n"
            
            if chars_used + len(header) + len(content) > MAX_CONTEXT_CHARS:
                break
                
            context_parts.append(header + content)
            chars_used += len(header) + len(content)
            sources.add(chunk["file"])

        context = "".join(context_parts)

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

        # Gemini Generation
        config = {
            "max_output_tokens": 1024,
            "temperature": 0.1,
        }

        response = client.models.generate_content(
            model=GEN_MODEL,
            contents=prompt,
            config=config
        )

        answer = response.text.strip() if response and response.text else "AI returned an empty response."

        return {
            "answer": answer,
            "sources": list(sources),
            "confidence": float(confidence)
        }

    except Exception as e:
        print("RAG ERROR:", e)
        # Robust Error Handling (Feature 5)
        error_msg = "AI service encountered an error."
        if "429" in str(e):
            error_msg = "API Rate limit exceeded."
        return {
            "answer": error_msg,
            "sources": [],
            "confidence": 0.0,
            "error": str(e)
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
