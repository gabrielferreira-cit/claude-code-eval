"""Entry point: poll for pending tasks every 5 seconds."""

import time
import signal
import sys

from .processor import run_once

POLL_INTERVAL = 5  # seconds

_running = True


def _handle_sigterm(signum: int, frame: object) -> None:
    global _running
    print("\n[worker] Shutting down...")
    _running = False


def main() -> None:
    signal.signal(signal.SIGTERM, _handle_sigterm)
    signal.signal(signal.SIGINT, _handle_sigterm)

    print("[worker] Started. Polling every 5 seconds. Press Ctrl+C to stop.")

    while _running:
        processed = run_once()
        if processed:
            print(f"[worker] Processed {processed} task(s).")
        time.sleep(POLL_INTERVAL)

    sys.exit(0)


if __name__ == "__main__":
    main()
