"""Task processor: fetches pending tasks and marks them done."""

import sqlite3
from pathlib import Path

from .utils import send_notification

DEFAULT_DB_PATH = Path(__file__).parent.parent.parent / "api" / "data" / "tasks.db"


def get_pending_tasks(conn: sqlite3.Connection) -> list[dict]:
    """Return all tasks with status 'pending'."""
    conn.row_factory = sqlite3.Row
    cur = conn.execute(
        "SELECT * FROM tasks WHERE status = 'pending' ORDER BY created_at"
    )
    return [dict(row) for row in cur.fetchall()]


def process_task(conn: sqlite3.Connection, task: dict) -> None:
    """Transition a task from pending → processing → done."""
    task_id = task["id"]

    conn.execute(
        "UPDATE tasks SET status = 'processing', updated_at = datetime('now') WHERE id = ?",
        (task_id,),
    )
    conn.commit()

    # Simulate work
    print(f"[worker] Processing task {task_id}: {task['title']!r}")

    conn.execute(
        "UPDATE tasks SET status = 'done', updated_at = datetime('now') WHERE id = ?",
        (task_id,),
    )
    conn.commit()

    send_notification(task_id, f"Task '{task['title']}' completed successfully.")
    print(f"[worker] Task {task_id} done.")


def run_once(db_path: Path = DEFAULT_DB_PATH) -> int:
    """Process all pending tasks once. Returns the number of tasks processed."""
    if not db_path.exists():
        print(f"[worker] Database not found at {db_path}. Nothing to process.")
        return 0

    with sqlite3.connect(db_path) as conn:
        tasks = get_pending_tasks(conn)
        for task in tasks:
            process_task(conn, task)
        return len(tasks)
