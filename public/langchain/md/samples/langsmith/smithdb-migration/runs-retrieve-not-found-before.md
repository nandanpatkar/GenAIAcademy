```bash runs-retrieve-not-found-before.sh
#!/usr/bin/env bash
set -euo pipefail

RUN_ID="<run-id>"
RUN_ID=$(uuidgen)

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  "https://api.smith.langchain.com/api/v1/runs/$RUN_ID" \
  -H "x-api-key: $LANGSMITH_API_KEY")

if [ "$HTTP_STATUS" = "404" ]; then
  echo "Run $RUN_ID not found"
fi
```
