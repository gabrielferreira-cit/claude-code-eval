# Web App

React 18 + TypeScript + Vite. Runs on port **5173**. Proxies `/tasks` requests to the API on port 3001.

## Key Files

| File | Purpose |
|---|---|
| `src/api.ts` | Typed wrappers around the REST API |
| `src/App.tsx` | Root component: state + handlers |
| `src/components/TaskList.tsx` | Renders the task list |
| `src/components/TaskForm.tsx` | Create-task form |

## Running & Testing

```bash
make dev-web       # vite dev server → http://localhost:5173
make test-web      # vitest (jsdom)
```

Requires the API to be running (`make dev-api`) to function.

## Rules

- Import types from `@claude-eval/shared`, not from the API source.
- No `any`. Use proper React prop types.
- Keep components small. Logic goes in `App.tsx`; components receive data via props.
