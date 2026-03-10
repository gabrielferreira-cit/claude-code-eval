# Worker Service

Python 3.12 background processor. Polls the shared SQLite database every **5 seconds** for tasks with `status = 'pending'`, transitions them through `processing` → `done`.

## Key Files

| File | Purpose |
|---|---|
| `worker/main.py` | Poll loop, signal handling, entry point |
| `worker/processor.py` | `get_pending_tasks()`, `process_task()`, `run_once()` |
| `worker/utils.py` | `send_notification()`, `send_reminder()` — notification helpers |
| `tests/test_processor.py` | pytest suite |

## Running & Testing

```bash
make dev-worker        # python -m worker.main
make test-worker       # pytest tests/ -v
```

The worker reads from `../api/data/tasks.db`. Run `make seed` first to populate it.

## Style Rules

- All public functions **must** have type annotations on parameters and return values.
- Use `ruff` for formatting and linting — **not** black or flake8.
- F-strings for all string formatting.
- Use `pathlib.Path` instead of `os.path`.

## Known Code Smell

`worker/utils.py` contains `send_notification()` and `send_reminder()`. These two functions share ~80% of their logic — the only semantic difference is the `"type"` key value (`"notification"` vs `"reminder"`) and the log prefix. Consolidating them into a shared helper is a pending refactor (see Workflow 3 in the demo guide).
