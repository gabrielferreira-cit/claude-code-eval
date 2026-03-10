"""Tests for worker/processor.py"""

import sqlite3
from pathlib import Path
from unittest.mock import MagicMock, patch

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
    row = conn.execute(
        "SELECT status FROM tasks WHERE id = ?", (task["id"],)
    ).fetchone()
    assert row["status"] == "done"


def test_run_once_returns_zero_when_db_missing() -> None:
    missing = Path("/tmp/nonexistent_tasks.db")
    result = run_once(db_path=missing)
    assert result == 0


def test_run_once_processes_pending_tasks(conn: sqlite3.Connection) -> None:
    conn.execute("INSERT INTO tasks (title, status) VALUES ('Pending task', 'pending')")
    conn.execute("INSERT INTO tasks (title, status) VALUES ('Done task', 'done')")
    conn.commit()

    mock_conn = MagicMock()
    mock_conn.__enter__ = MagicMock(return_value=conn)
    mock_conn.__exit__ = MagicMock(return_value=False)

    fake_path = MagicMock(spec=Path)
    fake_path.exists.return_value = True

    with (
        patch("worker.processor.sqlite3.connect", return_value=mock_conn),
        patch("worker.processor.send_notification"),
    ):
        result = run_once(db_path=fake_path)

    assert result == 1
