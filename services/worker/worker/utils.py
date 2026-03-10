"""Notification utilities for the task worker."""

import datetime


def send_notification(task_id: int, message: str, channel: str = "email") -> dict:
    """Send a task completion notification."""
    timestamp = datetime.datetime.utcnow().isoformat()
    payload = {
        "task_id": task_id,
        "type": "notification",
        "message": message,
        "channel": channel,
        "timestamp": timestamp,
        "retries": 0,
    }
    # In production this would call an external notification service.
    print(f"[NOTIFY] {payload}")
    return payload


def send_reminder(task_id: int, message: str, channel: str = "email") -> dict:
    """Send a task reminder."""
    timestamp = datetime.datetime.utcnow().isoformat()
    payload = {
        "task_id": task_id,
        "type": "reminder",
        "message": message,
        "channel": channel,
        "timestamp": timestamp,
        "retries": 0,
    }
    # In production this would call an external notification service.
    print(f"[REMIND] {payload}")
    return payload
