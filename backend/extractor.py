import fitz  # PyMuPDF
import os

def extract_text(file_path):
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".txt":
        return extract_txt(file_path)
    elif ext == ".pdf":
        return extract_pdf(file_path)
    else:
        return None


def extract_txt(path):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        print(f"Error reading txt: {e}")
        return None


def extract_pdf(path):
    try:
        doc = fitz.open(path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        print(f"Error reading pdf: {e}")
        return None
