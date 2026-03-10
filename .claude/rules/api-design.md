# API Design Rules

## Response Shape

All responses are `application/json`.

- **Success**: `{ "data": <payload> }`
- **Error**: `{ "error": "<human-readable message>" }` — single string, no stack traces, no nested objects.

## Status Codes

| Situation | Code |
|---|---|
| Resource created | `201` |
| Read or partial update success | `200` |
| Deleted (no body) | `204` |
| Invalid input / validation error | `400` |
| Resource not found | `404` |
| Unexpected server error | `500` |

Using `200` for an error response (e.g. `200 { "error": "Not found" }`) is **always wrong**.

## Routes

- `PATCH` accepts **partial updates** — fields absent from the body are not modified.
- IDs in URL parameters are integers. Return `400` (not `404`) if the ID cannot be parsed as an integer.
- No `/v1/` versioning prefix needed for this PoC.

## Query Parameters

- Filter parameters are optional. Return all records when no filter is provided.
- Invalid enum values in query parameters return `400` with a clear message.

## Types

- Import all types from `@claude-eval/shared`. Never redefine `Task`, `TaskStatus`, etc. in the API service.
