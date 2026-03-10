.PHONY: install dev dev-api dev-worker dev-web \
        test test-api test-worker test-web \
        fmt fmt-ts fmt-py lint \
        mcp-dev seed reset-db clean

# ── Bootstrap ────────────────────────────────────────────────────────────────
install:
	pnpm install
	cd services/worker && pip install -e ".[dev]" --quiet

# ── Dev servers ───────────────────────────────────────────────────────────────
dev-api:
	pnpm --filter @claude-eval/api dev

dev-worker:
	cd services/worker && python -m worker.main

dev-web:
	pnpm --filter @claude-eval/web dev

dev: install seed
	@echo ""
	@echo "Start each service in a separate terminal:"
	@echo "  make dev-api     → http://localhost:3001"
	@echo "  make dev-worker  → background task processor"
	@echo "  make dev-web     → http://localhost:5173"
	@echo ""

# ── Testing ───────────────────────────────────────────────────────────────────
test-api:
	pnpm --filter @claude-eval/api test

test-worker:
	cd services/worker && pytest tests/ -v

test-web:
	pnpm --filter @claude-eval/web test --run

test: test-api test-worker test-web

# ── Formatting ────────────────────────────────────────────────────────────────
fmt-ts:
	pnpm prettier --write \
		"packages/shared/src/**/*.ts" \
		"services/api/src/**/*.ts" \
		"services/api/tests/**/*.ts" \
		"apps/web/src/**/*.{ts,tsx}" \
		"mcp-server/src/**/*.ts"

fmt-py:
	ruff format services/worker/
	ruff check --fix services/worker/ --silent || true

fmt: fmt-ts fmt-py

# ── Linting ───────────────────────────────────────────────────────────────────
lint:
	pnpm tsc --noEmit -p services/api/tsconfig.json
	pnpm tsc --noEmit -p apps/web/tsconfig.json
	ruff check services/worker/

# ── MCP server (manual testing) ───────────────────────────────────────────────
mcp-dev:
	npx tsx mcp-server/src/index.ts

# ── Database ──────────────────────────────────────────────────────────────────
seed:
	pnpm --filter @claude-eval/api seed

reset-db:
	rm -f services/api/data/tasks.db
	$(MAKE) seed

# ── Clean ─────────────────────────────────────────────────────────────────────
clean:
	find . -type d -name node_modules -prune -exec rm -rf {} +
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type d -name dist -prune -exec rm -rf {} +
	find . -name "*.pyc" -delete
	rm -f services/api/data/tasks.db
