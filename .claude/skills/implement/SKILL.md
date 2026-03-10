---
description: Implement a new feature end-to-end across the monorepo
argument-hint: "[feature description]"
user-invocable: true
---

# Implement Feature — $ARGUMENTS

You are implementing a new feature end-to-end. Follow these steps **in order**:

## Step 1: Types First

Open `packages/shared/src/types.ts` first. Add or modify the types the feature requires.

- This is the contract; all services derive from it.
- Do not write any route handler, DB migration, or UI code before the types are settled.
- If TypeScript compilation fails after your type changes, fix the errors before moving on.

## Step 2: Update the Database (if needed)

Modify `services/api/src/db.ts`:

- Use `ALTER TABLE ... ADD COLUMN` with a default value to keep migrations backward-compatible.
- Wrap schema changes in a guard (e.g. check if the column already exists before adding it).

## Step 3: Update the API

Modify `services/api/src/routes/tasks.ts`:

- Apply the new types from `@claude-eval/shared`.
- Update INSERT and UPDATE statements to include new columns.
- Add query parameter handling if filtering is required.
- Follow the response shape in `.claude/rules/api-design.md`.

## Step 4: Update the Worker (if applicable)

If the feature affects how tasks are processed, update `services/worker/worker/processor.py`.

## Step 5: Update the UI (if applicable)

Update `apps/web/src/api.ts` types and any components that display the new field.

## Step 6: Write Tests

- Add tests in `services/api/tests/tasks.test.ts` covering the new behavior.
- Add tests in `services/worker/tests/test_processor.py` if the worker was modified.
- Cover at least one success path and one validation error path.

## Step 7: Verify

Run `make test` — all tests must pass before declaring done.
