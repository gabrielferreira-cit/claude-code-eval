"""Tests for worker/processor.py"""

import sqlite3
from unittest.mock import patch

import pytest

from worker.processor import get_pending_tasks, process_task, run_once


@pytest.fixture
def conn() -> sqlite3.Connection:
    """In-memory SQLite database seeded with the tasks schema."""
    c = sqlite3.connect(":memory:")
    c.execute("""
        CREATE TABLE tasks (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            title       TEXT NOT NULL,
            description TEXT,
            status      TEXT NOT NULL DEFAULT 'pending',
            created_at  TEXT NOT NULL DEFAULT (datetime('now')),
            updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
        )
    """)
    c.commit()
    return c


def test_get_pending_tasks_returns_only_pending(conn: sqlite3.Connection) -> None:
    conn.execute("INSERT INTO tasks (title, status) VALUES ('A', 'pending')")
    conn.execute("INSERT INTO tasks (title, status) VALUES ('B', 'done')")
    conn.execute("INSERT INTO tasks (title, status) VALUES ('C', 'processing')")
    conn.commit()

    tasks = get_pending_tasks(conn)
    assert len(tasks) == 1
    assert tasks[0]["title"] == "A"


def test_get_pending_tasks_empty_queue(conn: sqlite3.Connection) -> None:
    tasks = get_pending_tasks(conn)
    assert tasks == []


def test_process_task_transitions_to_done(conn: sqlite3.Connection) -> None:
    conn.execute("INSERT INTO tasks (title) VALUES ('Test task')")
    conn.commit()

    task = get_pending_tasks(conn)[0]

    with patch("worker.processor.send_notification") as mock_notify:
        process_task(conn, task)
        mock_notify.assert_called_once()

    conn.row_factory = sqlite3.Row
    row = conn.execute("SELECT status FROM tasks WHERE id = ?", (task["id"],)).fetchone()
    assert row["status"] == "done"
