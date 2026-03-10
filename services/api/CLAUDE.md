# API Service

Express REST API — Node.js 22 + TypeScript. Port **3001**. SQLite database at `./data/tasks.db`.

## Key Files

| File | Purpose |
|---|---|
| `src/db.ts` | Schema definition, `createDb()`, `getDb()` singleton |
| `src/seed.ts` | Inserts fixture rows (idempotent) |
| `src/routes/tasks.ts` | All 5 CRUD handlers |
| `src/middleware/errorHandler.ts` | Express error boundary |
| `tests/tasks.test.ts` | Vitest + supertest suite |

## API Contract

Every response is JSON. Successes use `{ "data": <payload> }`, errors use `{ "error": "<message>" }`.

| Method | Path | Success | Errors |
|---|---|---|---|
| `POST` | `/tasks` | `201` | `400` (missing/invalid title) |
| `GET` | `/tasks` | `200` | — |
| `GET` | `/tasks/:id` | `200` | `400` (non-integer id), **`404`** (not found) |
| `PATCH` | `/tasks/:id` | `200` | `400` (invalid fields), **`404`** (not found) |
| `DELETE` | `/tasks/:id` | `204` (no body) | `400` (non-integer id), **`404`** (not found) |

## Running & Testing

```bash
make dev-api       # start with tsx watch
make test-api      # run vitest suite
make seed          # populate fixture data
make reset-db      # wipe + reseed
```

## Rules

- Import all types from `@claude-eval/shared` — never redefine `Task`, `TaskStatus`, etc. locally.
- Tests go in `tests/` (not `src/`). Use an in-memory DB (`createDb(':memory:')`) for test isolation.
- Both success and **error paths** must be tested for every route handler.
- `PATCH` accepts partial updates — fields absent from the body are not modified.
