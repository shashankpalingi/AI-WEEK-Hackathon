from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import threading
import os
from watcher import start_watching

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


# Start watcher in background thread
ROOT_FOLDER = os.path.join(os.path.dirname(__file__), "root_files")

def run_watcher():
    start_watching(ROOT_FOLDER)

threading.Thread(target=run_watcher, daemon=True).start()
