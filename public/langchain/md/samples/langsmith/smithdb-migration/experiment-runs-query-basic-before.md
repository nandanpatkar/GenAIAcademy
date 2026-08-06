```bash experiment-runs-query-basic-before.sh
#!/usr/bin/env bash
set -euo pipefail

if false; then
curl -X POST "https://api.smith.langchain.com/api/v1/datasets/$DATASET_ID/runs" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg eid "$EXPERIMENT_ID" '{
    "session_ids": [$eid],
    "limit": 20,
    "preview": true
  }')"
fi
```
