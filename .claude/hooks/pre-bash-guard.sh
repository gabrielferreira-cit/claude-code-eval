#!/usr/bin/env bash
# PreToolUse hook: block dangerous shell commands before they execute.
# Exit code 2 = block with error message. Exit code 0 = allow.

set -euo pipefail

CMD=$(echo "${CLAUDE_TOOL_INPUT:-{\}}" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(d.get('command', ''))
" 2>/dev/null || echo "")

DANGEROUS_PATTERN='(rm -rf /|rm -rf \.|DROP TABLE|DROP DATABASE|git push --force origin main|git push -f origin main|truncate /dev|mkfs)'

if echo "$CMD" | grep -qE "$DANGEROUS_PATTERN"; then
  echo "BLOCKED: command matches dangerous pattern. Review before running manually." >&2
  exit 2
fi

exit 0
