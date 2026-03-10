# Testing Rules

## Structure

- Tests live in a `tests/` directory co-located with the service, **never** inside `src/`.
- TypeScript test files mirror source names: `tasks.ts` → `tasks.test.ts`.
- Python test files mirror source names: `processor.py` → `test_processor.py`.

## Isolation

- API tests must use an in-memory SQLite database (`createDb(':memory:')`), never the real `data/tasks.db`.
- Python tests must mock DB connections with `unittest.mock.patch` — no real file I/O.
- No test may rely on network calls. Mock everything external.

## Coverage

- Every exported function or route handler must have at least one test.
- **Error paths are mandatory** — a test that only covers the happy path is incomplete.
  - For API routes: test `400` (bad input) and `404` (not found) in addition to `200`/`201`.
  - For Python functions: test exception handling and empty input cases.

## Conventions

- Use `beforeEach` or `beforeAll` to reset state (truncate tables or recreate the DB).
- No `.skip` or `.only` in committed code.
- `make test` must exit `0` with no skipped tests.

## TypeScript (vitest + supertest)

```ts
// Pattern for route tests
describe('PATCH /tasks/:id', () => {
  it('returns 200 when task is found', async () => { ... });
  it('returns 404 when task does not exist', async () => { ... });
  it('returns 400 when id is not an integer', async () => { ... });
});
```

## Python (pytest)

```python
# Use parametrize for multiple input variations
@pytest.mark.parametrize("status", ["pending", "done", "failed"])
def test_get_tasks_filters_by_status(conn, status):
    ...
```
