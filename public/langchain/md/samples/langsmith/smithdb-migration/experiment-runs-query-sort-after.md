```bash experiment-runs-query-sort-after.sh
#!/usr/bin/env bash
set -euo pipefail

if false; then
curl -X POST "https://api.smith.langchain.com/api/v2/datasets/$DATASET_ID/experiment-runs" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg eid "$EXPERIMENT_ID" '{
    "experiment_ids": [$eid],
    "sort": {
      "by": "feedback.correctness",
      "order": "ASC"
    }
  }')"
fi
```
