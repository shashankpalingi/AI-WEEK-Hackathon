import os
from google import genai
from extractor import extract_text

def generate_cluster_label(files):
    """
    Generates a concise semantic label for a group of files.
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("Naming Error: GOOGLE_API_KEY not found in environment.")
        return "Uncategorized"

    client = genai.Client(api_key=api_key)
    GEN_MODEL = "gemini-3-flash-preview"

    if not files:
        return "Empty_Cluster"

    # Gather snippets from the first few files for context
    context_samples = []
    for file_path in files[:3]:
        name = os.path.basename(file_path)
        content = extract_text(file_path)
        snippet = (content[:500] if content else "no content")
        context_samples.append(f"File: {name}\nContent Snippet: {snippet}")

    context_str = "\n\n".join(context_samples)

    prompt = f"""
Analyze these files and provide a SINGLE, CONCISE semantic folder name (1-3 words, underscores instead of spaces).
Avoid generic names like "Documents" or "Files" if possible. Be specific to the content.

Files:
{context_str}

Semantic Folder Name:
"""

    try:
        response = client.models.generate_content(
            model=GEN_MODEL,
            contents=prompt,
            config={"temperature": 0.1}
        )
        if response and response.text:
            label = response.text.strip().replace(" ", "_").replace("/", "-")
            label = "".join(c for c in label if c.isalnum() or c in ("_", "-"))
            print(f"SEFS: AI named cluster -> {label}")
            return label or "Miscellaneous"
        else:
            print("Naming Error: AI returned empty response.")
    except Exception as e:
        print(f"Naming Error for {files[0]}: {e}")
    
    return "Refining_Label"
