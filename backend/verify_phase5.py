import requests
import json
import os
import time

BASE_URL = "http://localhost:8000"

def test_status():
    print("\n--- Testing /status ---")
    response = requests.get(f"{BASE_URL}/status")
    print(response.json())

def test_files():
    print("\n--- Testing /files (Metadata) ---")
    response = requests.get(f"{BASE_URL}/files")
    print(json.dumps(response.json(), indent=2))

def test_search(query):
    print(f"\n--- Testing /search with query: '{query}' ---")
    response = requests.post(f"{BASE_URL}/search", json={"query": query})
    print(json.dumps(response.json(), indent=2))

def test_ask(query):
    print(f"\n--- Testing /ask with query: '{query}' ---")
    response = requests.post(f"{BASE_URL}/ask", json={"query": query})
    print(json.dumps(response.json(), indent=2))

if __name__ == "__main__":
    # Wait for server to be ready if needed
    try:
        test_status()
        test_files()
        test_search("database concepts")
        test_ask("What are the core concepts of SQL?")
    except Exception as e:
        print(f"Error during verification: {e}")
