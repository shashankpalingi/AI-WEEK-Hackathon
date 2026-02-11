import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class FileHandler(FileSystemEventHandler):

    def on_created(self, event):
        if not event.is_directory:
            print(f"File created: {event.src_path}")

    def on_modified(self, event):
        if not event.is_directory:
            print(f"File modified: {event.src_path}")

    def on_deleted(self, event):
        if not event.is_directory:
            print(f"File deleted: {event.src_path}")


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
