#!/usr/bin/env bash
# PostToolUse hook: auto-format the file that was just written/edited.
# Claude Code sets CLAUDE_TOOL_INPUT as a JSON string with tool arguments.

set -euo pipefail

FILE=$(echo "${CLAUDE_TOOL_INPUT:-{\}}" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(d.get('file_path') or d.get('new_file') or d.get('path') or '')
" 2>/dev/null || echo "")

if [[ -z "$FILE" || ! -f "$FILE" ]]; then
  exit 0
fi

if [[ "$FILE" == *.ts || "$FILE" == *.tsx ]]; then
  npx prettier --write "$FILE" --log-level silent 2>/dev/null || true
elif [[ "$FILE" == *.py ]]; then
  ruff format "$FILE" --quiet 2>/dev/null || true
fi

exit 0
