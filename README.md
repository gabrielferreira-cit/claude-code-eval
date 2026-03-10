# Claude Code Eval — Polyglot Monorepo PoC

A proof-of-concept to evaluate Claude Code team configuration features.

## Prerequisites

- Node.js 22+ with pnpm (`npm i -g pnpm`)
- Python 3.12+
- `ruff` (`pip install ruff`)

## Quick Start

```bash
make install   # install all dependencies
make seed      # populate the database
make dev       # see per-service start commands
```

## Run Tests

```bash
make test        # all services
make test-api    # TypeScript only
make test-worker # Python only
```

## Demo Workflows

Open this repo in Claude Code and use these slash commands:

| Command | Scenario |
|---|---|
| `/fix-bug PATCH /tasks/:id returns 200 instead of 404` | Bug investigation & fix |
| `/implement Add a priority field (low/medium/high) to tasks` | Feature implementation |
| `/review` | Code review & refactor (targets utils.py duplication) |
| `/test services/api/src/routes/tasks.ts` | Missing test coverage |

> Tip: Workflow 4 (`/test`) will organically discover the bug from Workflow 1.
