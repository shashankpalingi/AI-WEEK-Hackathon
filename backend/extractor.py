import fitz  # PyMuPDF
import os

def chunk_text(text, chunk_size=500, overlap=100):
    """
    Splits text into overlapping chunks.
    """
    if not text:
        return []
    
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += (chunk_size - overlap)
        
    return chunks

def extract_metadata(file_path):
    """
    Extracts metadata for TXT and PDF files.
    """
    try:
        stats = os.stat(file_path)
        metadata = {
            "size": stats.st_size,
            "created": stats.st_ctime,
            "filename": os.path.basename(file_path)
        }

        ext = os.path.splitext(file_path)[1].lower()
        if ext == ".txt":
            content = extract_txt(file_path)
            metadata["type"] = "txt"
            metadata["words"] = len(content.split()) if content else 0
        elif ext == ".pdf":
            doc = fitz.open(file_path)
            metadata["type"] = "pdf"
            metadata["pages"] = len(doc)
            
            # Extract basic title if exists
            metadata["title"] = doc.metadata.get("title") or os.path.basename(file_path)
            
            # Word count summary
            total_words = 0
            for page in doc:
                total_words += len(page.get_text().split())
            metadata["words"] = total_words
            doc.close()
        
        return metadata
    except Exception as e:
        print(f"Metadata Extraction Error for {file_path}: {e}")
        return {}

def extract_text(file_path):
    try:
        if not os.path.exists(file_path):
            return ""
            
        ext = os.path.splitext(file_path)[1].lower()

        if ext == ".txt":
            return extract_txt(file_path) or ""
        elif ext == ".pdf":
            return extract_pdf(file_path) or ""
        else:
            return ""
    except Exception:
        return ""


def extract_txt(path):
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    except Exception as e:
        print(f"Error reading txt {path}: {e}")
        return None


def extract_pdf(path):
    try:
        doc = fitz.open(path)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text
    except Exception as e:
        print(f"Error reading pdf {path}: {e}")
        return None
