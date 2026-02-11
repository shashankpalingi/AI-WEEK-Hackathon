import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from extractor import extract_text

class FileHandler(FileSystemEventHandler):

    def on_created(self, event):
        self.process_file(event)

    def on_modified(self, event):
        self.process_file(event)

    def on_deleted(self, event):
        if not event.is_directory:
            print(f"File deleted: {event.src_path}")

    def process_file(self, event):
        if not event.is_directory:
            print(f"Processing file: {event.src_path}")
            content = extract_text(event.src_path)
            if content:
                print("Extracted Content Preview:")
                print(content[:300])
                print("-" * 40)


def start_watching(path):
    event_handler = FileHandler()
    observer = Observer()
    observer.schedule(event_handler, path=path, recursive=False)
    observer.start()
    print(f"Watching folder: {path}")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()
