---
description: Identify and write missing tests for a source file
argument-hint: "[path to source file]"
user-invocable: true
---

# Write Missing Tests — $ARGUMENTS

You are writing tests for existing code. **Do not modify production code.**

## Step 1: Gap Analysis

Read both the source file and its existing test file. List every:

- Exported function or route handler with no test at all.
- Code path that has only a happy-path test and is missing error/edge-case coverage.

Report this list before writing any code.

## Step 2: Write the Tests

### For TypeScript API routes (vitest + supertest)

```ts
describe('<METHOD> /path/:param', () => {
  it('returns <success code> on success', async () => { ... });
  it('returns 404 when resource does not exist', async () => { ... });
  it('returns 400 when :param is not an integer', async () => { ... });
});
```

- Use `createDb(':memory:')` for test isolation — never the real database.
- Import types from `@claude-eval/shared`.

### For Python worker code (pytest)

```python
# Mock the DB connection — never use a real file
@patch('worker.processor.sqlite3.connect')
def test_something(mock_connect):
    ...

# Use parametrize for multiple input variations
@pytest.mark.parametrize("status", ["pending", "done", "failed"])
def test_filter_by_status(conn, status):
    ...
```

## Step 3: Run

Execute only the affected test file (not the full suite):

- TypeScript: `npx vitest run tests/<file>.test.ts`
- Python: `pytest tests/test_<file>.py -v`

Fix any failures before completing.

## Step 4: Report

List every new test case added with a one-line description of what it covers.
If any test **fails on existing code** (not a test error), flag it as a potential bug and do not fix it here — report it for a separate `/fix-bug` session.
