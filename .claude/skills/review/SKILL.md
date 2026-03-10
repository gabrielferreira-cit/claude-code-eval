---
description: Review code for correctness, types, tests, consistency, and safety
user-invocable: true
---

# Code Review

Review the code in the current working directory (or the files specified in $ARGUMENTS).

For each changed or targeted file, evaluate the following dimensions:

## 1. Correctness

- Does the logic match the intent?
- Are there off-by-one errors, wrong HTTP status codes, missing null checks, or unhandled promise rejections?
- Do error branches return appropriate status codes? (See `.claude/rules/api-design.md` for the contract.)

## 2. Type Safety

- Are TypeScript types precise? Flag any use of `any`.
- Do Python functions have return type annotations on all parameters and the return value?

## 3. Test Coverage

- Is every new code path tested?
- Are error paths tested (not just the happy path)?
- Flag any public function or route handler with no corresponding test.

## 4. Consistency

- Does the code follow the patterns in adjacent files?
- Check: imports, naming conventions, error response shape, file structure.

## 5. Safety

- Are SQL queries parameterized? (No string concatenation into SQL.)
- Is user input validated before use?

## Output Format

Use this format for each finding:

```
[MUST] <file>:<line> — <description of issue and how to fix it>
[SHOULD] <file>:<line> — <strong suggestion>
[NIT] <file>:<line> — <style preference, non-blocking>
```

End with a one-line verdict:
- `Approve`
- `Approve with minor fixes`
- `Request changes`
