# Claude Code Eval — Polyglot Monorepo

A proof-of-concept monorepo for evaluating Claude Code team configurations. It simulates a real-world task-manager product: a REST API, a Python background worker, and a React frontend — all sharing a SQLite database. Pre-seeded with intentional bugs and smells to practice the four core developer workflows.

## Repo Layout

| Directory | Language | Role |
|---|---|---|
| `packages/shared/` | TypeScript | Shared types (`Task`, `TaskStatus`, etc.) |
| `services/api/` | TypeScript/Express | REST API on port 3001 |
| `services/worker/` | Python 3.12 | Background task processor |
| `apps/web/` | React/TypeScript | Frontend UI on port 5173 |
| `mcp-server/` | TypeScript | MCP server exposing DB tools to Claude |

## Development Commands

All orchestration goes through `make`. Run `make` without arguments to see all targets.

```bash
make install     # install all dependencies
make dev         # print per-service start instructions
make test        # run all test suites
make fmt         # format all files (prettier + ruff)
make seed        # populate the database with fixture tasks
make reset-db    # wipe and reseed the database
```

## Cross-Cutting Rules

1. **Never commit directly to `main`** — always branch and open a PR.
2. **Types first** — all API changes must update `packages/shared/src/types.ts` before touching any service code.
3. **Format before done** — run `make fmt` before marking any task complete.

## Where to Find Things

| What | Where |
|---|---|
| Shared types | `packages/shared/src/types.ts` |
| API routes | `services/api/src/routes/tasks.ts` |
| DB schema | `services/api/src/db.ts` |
| Worker logic | `services/worker/worker/processor.py` |
| Notification helpers | `services/worker/worker/utils.py` |
| MCP tools | `mcp-server/src/tools/` |

## Demo Workflows

See `.claude/skills/` for the four slash commands: `/fix-bug`, `/implement`, `/review`, `/test`.
Each corresponds to a pre-seeded scenario in this codebase.
