---
description: Fix a bug in the codebase using a test-first approach
argument-hint: "[description of the bug]"
user-invocable: true
---

# Fix Bug — $ARGUMENTS

You are performing a focused bug fix. Follow these steps **in order**:

## Step 1: Reproduce First

Before touching any production code, write (or identify) the test that demonstrates the bug.

- If no test file exists for the affected code, create one.
- Run the test and **confirm it fails** with the expected error.
- Do not proceed until you have a failing test.

## Step 2: Locate the Defect

Use the available tools to investigate:

- Use `get_schema` (MCP) to understand the database structure.
- Use `query_tasks` (MCP) to inspect live data if the bug is data-related.
- Read the affected source file and identify the root cause.
- **State the root cause in one sentence** before writing any fix.

## Step 3: Fix Minimally

- Change only what is necessary to fix the bug.
- Do not refactor adjacent code unless it is the direct cause of the bug.
- Do not introduce new abstractions.

## Step 4: Verify

- Run the test suite for the affected service only:
  - TypeScript: `make test-api`
  - Python: `make test-worker`
- All tests must pass before declaring done.

## Step 5: Summarize

Output a short summary (3–5 sentences):
- What was wrong
- Why it happened
- What changed

Format it as a conventional commit message body (past tense, imperative mood).
