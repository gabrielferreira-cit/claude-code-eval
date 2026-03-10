# Code Style Rules

## TypeScript

- **No `any`**. Use `unknown` + a type guard if the type is genuinely unknown.
- Use `interface` for object shapes, `type` for unions and primitives.
- All `async` functions must handle errors with `try/catch` or `.catch()`. Unhandled promise rejections are bugs.
- Import order: external packages → internal packages (`@claude-eval/*`) → relative imports. One blank line between groups.
- Formatter: `prettier` (config in `.prettierrc`). The PostToolUse hook runs it automatically after every edit.

## Python

- **Type annotations are required** on all public functions (parameters and return value).
- Use `pathlib.Path` instead of `os.path`.
- F-strings for all string formatting — no `%` or `.format()`.
- Formatter and linter: **`ruff` only** — do not introduce `black`, `flake8`, or `isort`.
- The PostToolUse hook runs `ruff format` automatically after every edit.

## Both

- Files must end with a single newline.
- No trailing whitespace.
- No commented-out code in committed files.
