<!-- Inlined Snippet: runs-query-list-all-before-py.mdx -->
```python Before
from langsmith import Client

client = Client()
runs = client.list_runs(project_name="default")
```

<!-- Inlined Snippet: runs-query-list-all-after-py.mdx -->
```python After
from langsmith import Client

async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    runs = client.runs.query(project_ids=[str(project.id)])

asyncio.run(main())
```

<!-- Inlined Snippet: runs-query-selecting-fields-before-py.mdx -->
```python Before
from langsmith import Client

client = Client()
# returns a default set of fields; no explicit selection needed
runs = client.list_runs(project_name="default")
for run in runs:
    print(run.id, run.name, run.run_type, run.status, run.start_time, run.inputs, run.error)
```

<!-- Inlined Snippet: runs-query-selecting-fields-after-py.mdx -->
```python After
from langsmith import Client

async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    # must explicitly list every field needed; default returns only id
    async for run in client.runs.query(
        project_ids=[str(project.id)],
        selects=["ID", "NAME", "RUN_TYPE", "STATUS", "START_TIME", "INPUTS", "ERROR"],
    ):
        print(run.id, run.name, run.run_type, run.status, run.start_time, run.inputs, run.error)

asyncio.run(main())
```

<!-- Inlined Snippet: runs-query-filter-time-range-before-py.mdx -->
```python Before
from datetime import datetime, timedelta

from langsmith import Client

client = Client()
runs = client.list_runs(
    project_name="default",
    start_time=datetime.now() - timedelta(days=1),
    run_type="llm",
)
```

<!-- Inlined Snippet: runs-query-filter-time-range-after-py.mdx -->
```python After
from datetime import datetime, timedelta

from langsmith import Client

async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    runs = client.runs.query(
        project_ids=[str(project.id)],
        min_start_time=datetime.now() - timedelta(days=1),
        run_type="LLM",
    )

asyncio.run(main())
```

<!-- Inlined Snippet: runs-query-filter-root-before-py.mdx -->
```python Before
from langsmith import Client

client = Client()
runs = client.list_runs(project_name="default", is_root=True)
```

<!-- Inlined Snippet: runs-query-filter-root-after-py.mdx -->
```python After
from langsmith import Client

async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    runs = client.runs.query(project_ids=[str(project.id)], is_root=True)

asyncio.run(main())
```

<!-- Inlined Snippet: runs-query-fetch-by-id-before-py.mdx -->
```python Before
from langsmith import Client

client = Client()
runs = client.list_runs(id=["<run-id-1>", "<run-id-2>"])
```

<!-- Inlined Snippet: runs-query-fetch-by-id-after-py.mdx -->
```python After
from langsmith import Client

async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    runs = client.runs.query(
        project_ids=[str(project.id)],
        ids=["<run-id-1>", "<run-id-2>"],
    )

asyncio.run(main())
```

<!-- Inlined Snippet: runs-query-pagination-before-py.mdx -->
```python Before
from langsmith import Client

client = Client()
runs = client.list_runs(project_name="default", limit=150)
```

<!-- Inlined Snippet: runs-query-pagination-after-py.mdx -->
```python After
from langsmith import Client

async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    runs = []
    async for run in client.runs.query(
        project_ids=[str(project.id)],
    ):
        runs.append(run)
        if len(runs) >= 150:
            break

asyncio.run(main())
```

<!-- Inlined Snippet: runs-query-filter-errors-before-py.mdx -->
```python Before
from langsmith import Client

client = Client()
runs = client.list_runs(project_name="default", error=True)
```

<!-- Inlined Snippet: runs-query-filter-errors-after-py.mdx -->
```python After
from langsmith import Client

async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    runs = client.runs.query(project_ids=[str(project.id)], has_error=True)

asyncio.run(main())
```

<!-- Inlined Snippet: runs-query-filter-metadata-before-py.mdx -->
```python Before
from langsmith import Client

client = Client()
filter_str = 'and(eq(metadata_key, "user_id"), eq(metadata_value, "u_123"))'
runs = client.list_runs(project_name="default", filter=filter_str)
```

<!-- Inlined Snippet: runs-query-filter-metadata-after-py.mdx -->
```python After
from langsmith import Client

async def main():
    client = Client()
    filter_str = 'and(eq(metadata_key, "user_id"), eq(metadata_value, "u_123"))'
    project = await client.aread_project(project_name="default")
    runs = client.runs.query(project_ids=[str(project.id)], filter=filter_str)

asyncio.run(main())
```

<!-- Inlined Snippet: runs-query-boolean-filters-before-py.mdx -->
```python Before
from langsmith import Client

client = Client()
filter_str = (
    'and(gt(start_time, "2023-07-15T12:34:56Z"),'
    ' or(neq(status, "error"),'
    '    and(eq(feedback_key, "Correctness"), eq(feedback_score, 0.0))))'
)
runs = client.list_runs(project_name="default", filter=filter_str)
```

<!-- Inlined Snippet: runs-query-boolean-filters-after-py.mdx -->
```python After
from langsmith import Client

async def main():
    client = Client()
    filter_str = (
        'and(gt(start_time, "2023-07-15T12:34:56Z"),'
        ' or(neq(status, "error"),'
        '    and(eq(feedback_key, "Correctness"), eq(feedback_score, 0.0))))'
    )
    project = await client.aread_project(project_name="default")
    runs = client.runs.query(project_ids=[str(project.id)], filter=filter_str)

asyncio.run(main())
```

<!-- Inlined Snippet: runs-query-scoped-filters-before-py.mdx -->
```python Before
from langsmith import Client

client = Client()
runs = client.list_runs(
    project_name="default",
    filter='eq(name, "RetrieveDocs")',
    trace_filter='and(eq(feedback_key, "user_score"), eq(feedback_score, 1))',
    tree_filter='eq(name, "ExpandQuery")',
)
```

<!-- Inlined Snippet: runs-query-scoped-filters-after-py.mdx -->
```python After
from langsmith import Client

async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    runs = client.runs.query(
        project_ids=[str(project.id)],
        filter='eq(name, "RetrieveDocs")',
        trace_filter='and(eq(feedback_key, "user_score"), eq(feedback_score, 1))',
        tree_filter='eq(name, "ExpandQuery")',
    )

asyncio.run(main())
```

<!-- Inlined Snippet: runs-query-list-all-before-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

curl -X POST "https://api.smith.langchain.com/api/v1/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" '{"session": [$pid]}')"
```

<!-- Inlined Snippet: runs-query-list-all-after-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

curl -X POST "https://api.smith.langchain.com/api/v2/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" '{"project_ids": [$pid]}')"
```

<!-- Inlined Snippet: runs-query-selecting-fields-before-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

curl -X POST "https://api.smith.langchain.com/api/v1/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" '{"session": [$pid]}')"
```

<!-- Inlined Snippet: runs-query-selecting-fields-after-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

curl -X POST "https://api.smith.langchain.com/api/v2/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" '{"project_ids": [$pid], "selects": ["ID", "NAME", "RUN_TYPE", "STATUS", "START_TIME", "INPUTS", "ERROR"]}')"
```

<!-- Inlined Snippet: runs-query-filter-time-range-before-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

curl -X POST "https://api.smith.langchain.com/api/v1/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" '{"session": [$pid], "run_type": "llm", "start_time": "2025-01-01T00:00:00Z"}')"
```

<!-- Inlined Snippet: runs-query-filter-time-range-after-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

curl -X POST "https://api.smith.langchain.com/api/v2/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" '{"project_ids": [$pid], "run_type": "LLM", "min_start_time": "2025-01-01T00:00:00Z"}')"
```

<!-- Inlined Snippet: runs-query-filter-root-before-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

curl -X POST "https://api.smith.langchain.com/api/v1/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" '{"session": [$pid], "is_root": true}')"
```

<!-- Inlined Snippet: runs-query-filter-root-after-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

curl -X POST "https://api.smith.langchain.com/api/v2/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" '{"project_ids": [$pid], "is_root": true}')"
```

<!-- Inlined Snippet: runs-query-fetch-by-id-before-sh.mdx -->
```bash
RUN_ID_1="<run-id-1>"
RUN_ID_2="<run-id-2>"

curl -X POST "https://api.smith.langchain.com/api/v1/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg r1 "$RUN_ID_1" --arg r2 "$RUN_ID_2" '{"id": [$r1, $r2]}')"
```

<!-- Inlined Snippet: runs-query-fetch-by-id-after-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

RUN_ID_1="<run-id-1>"
RUN_ID_2="<run-id-2>"

curl -X POST "https://api.smith.langchain.com/api/v2/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" --arg r1 "$RUN_ID_1" --arg r2 "$RUN_ID_2" '{"project_ids": [$pid], "ids": [$r1, $r2]}')"
```

<!-- Inlined Snippet: runs-query-pagination-before-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

curl -X POST "https://api.smith.langchain.com/api/v1/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" '{"session": [$pid], "limit": 150}')"
```

<!-- Inlined Snippet: runs-query-pagination-after-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

# Fetch pages, passing the cursor from each response's next_cursor field
# to fetch the next page, until 150 runs are collected or pages run out.
TOTAL=0
CURSOR=""
while :; do
  BODY=$(jq -n --arg pid "$PROJECT_ID" --arg cursor "$CURSOR" \
    'if $cursor == "" then {"project_ids": [$pid]} else {"project_ids": [$pid], "cursor": $cursor} end')
  RESPONSE=$(curl -s -X POST "https://api.smith.langchain.com/api/v2/runs/query" \
    -H "x-api-key: $LANGSMITH_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$BODY")
  TOTAL=$((TOTAL + $(echo "$RESPONSE" | jq '.items | length')))
  CURSOR=$(echo "$RESPONSE" | jq -r '.next_cursor // empty')
  [ "$TOTAL" -lt 150 ] && [ -n "$CURSOR" ] || break
done
```

<!-- Inlined Snippet: runs-query-filter-errors-before-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

curl -X POST "https://api.smith.langchain.com/api/v1/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" '{"session": [$pid], "error": true}')"
```

<!-- Inlined Snippet: runs-query-filter-errors-after-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

curl -X POST "https://api.smith.langchain.com/api/v2/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" '{"project_ids": [$pid], "has_error": true}')"
```

<!-- Inlined Snippet: runs-query-filter-metadata-before-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

FILTER='and(eq(metadata_key, "user_id"), eq(metadata_value, "u_123"))'

curl -X POST "https://api.smith.langchain.com/api/v1/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" --arg f "$FILTER" '{"session": [$pid], "filter": $f}')"
```

<!-- Inlined Snippet: runs-query-filter-metadata-after-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

FILTER='and(eq(metadata_key, "user_id"), eq(metadata_value, "u_123"))'

curl -X POST "https://api.smith.langchain.com/api/v2/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" --arg f "$FILTER" '{"project_ids": [$pid], "filter": $f}')"
```

<!-- Inlined Snippet: runs-query-boolean-filters-before-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

FILTER='and(gt(start_time, "2023-07-15T12:34:56Z"), or(neq(status, "error"), and(eq(feedback_key, "Correctness"), eq(feedback_score, 0.0))))'

curl -X POST "https://api.smith.langchain.com/api/v1/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" --arg f "$FILTER" '{"session": [$pid], "filter": $f}')"
```

<!-- Inlined Snippet: runs-query-boolean-filters-after-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

FILTER='and(gt(start_time, "2023-07-15T12:34:56Z"), or(neq(status, "error"), and(eq(feedback_key, "Correctness"), eq(feedback_score, 0.0))))'

curl -X POST "https://api.smith.langchain.com/api/v2/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" --arg f "$FILTER" '{"project_ids": [$pid], "filter": $f}')"
```

<!-- Inlined Snippet: runs-query-scoped-filters-before-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

FILTER='eq(name, "RetrieveDocs")'
TRACE_FILTER='and(eq(feedback_key, "user_score"), eq(feedback_score, 1))'
TREE_FILTER='eq(name, "ExpandQuery")'

curl -X POST "https://api.smith.langchain.com/api/v1/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n \
    --arg pid "$PROJECT_ID" \
    --arg f "$FILTER" \
    --arg tf "$TRACE_FILTER" \
    --arg treef "$TREE_FILTER" \
    '{"session": [$pid], "filter": $f, "trace_filter": $tf, "tree_filter": $treef}')"
```

<!-- Inlined Snippet: runs-query-scoped-filters-after-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

FILTER='eq(name, "RetrieveDocs")'
TRACE_FILTER='and(eq(feedback_key, "user_score"), eq(feedback_score, 1))'
TREE_FILTER='eq(name, "ExpandQuery")'

curl -X POST "https://api.smith.langchain.com/api/v2/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n \
    --arg pid "$PROJECT_ID" \
    --arg f "$FILTER" \
    --arg tf "$TRACE_FILTER" \
    --arg treef "$TREE_FILTER" \
    '{"project_ids": [$pid], "filter": $f, "trace_filter": $tf, "tree_filter": $treef}')"
```

## Runs: query

Query runs from a project with optional filtering and field projection. Returns a paginated result set.

### Main changes

#### Method name

  #### Tab: Python

    | Before | After |
    |--------|-------|
    | `client.list_runs()` | `client.runs.query()` |

    

> [!NOTE]
>
> `client.runs.query()` is now async. Call it with `await`.


    See the [reference](https://reference.langchain.com/python/langsmith/_openapi_client/resources/runs/RunsResource/query_v2) for the full parameter and field list.
  
  #### Tab: TypeScript

    | Before | After |
    |--------|-------|
    | `client.listRuns()` | `client.runs.query()` |

    See the [reference](https://reference.langchain.com/javascript/langsmith/_openapi_client/Langsmith/Runs/queryV2) for the full parameter and field list.
  
  #### Tab: Java

    | Before | After |
    |--------|-------|
    | `client.runs().query()` | `client.runs().queryV2()` |

    See the [reference](https://javadoc.io/doc/com.langchain.smith/langsmith-java/latest/com/langchain/smith/services/blocking/RunService.html) for the full parameter list.
  
  #### Tab: Go

    | Before | After |
    |--------|-------|
    | `client.Runs.Query()` | `client.Runs.QueryV2()` |

    See the [reference](https://pkg.go.dev/github.com/langchain-ai/langsmith-go#RunService.QueryV2AutoPaging) for the full parameter list.
  
  #### Tab: cURL

    | Before | After |
    |--------|-------|
    | `POST /api/v1/runs/query` | `POST /api/v2/runs/query` |

    See the [API doc](https://docs.langchain.com/langsmith/smith-api/runs/query-runs) for the full parameter and field list.
  

#### Query parameters

  #### Tab: Python

    

> [!WARNING]
>
> `project_name` is not supported in `runs.query`. Pass `project_ids` with the project UUID instead. To look up a UUID by name, use `client.read_project(project_name="my-project")`, or `await client.aread_project(project_name="my-project")` in async code.


    

> [!WARNING]
>
> `min_start_time` defaults to **1 day ago** when omitted. `list_runs` with no `start_time` returned all historical runs; `runs.query` without `min_start_time` silently scopes the query to the last 24 hours. Pass an explicit `min_start_time` if you need a wider window.


    | Before (`list_runs`) | After (`runs.query`) | Notes |
    |---|---|---|
    | `project_name` | *(removed)* | Use `project_ids` with UUID(s)—see warning above |
    | `project_id` | `project_ids` | Now takes a list; mutually exclusive with `reference_dataset_id` |
    | `run_type` | `run_type` | Values must now be uppercase: `"LLM"`, `"CHAIN"`, `"TOOL"`, `"RETRIEVER"`, `"EMBEDDING"`, `"PROMPT"`, `"PARSER"` |
    | `trace_id` | `trace_id` | Unchanged |
    | `reference_example_id` | `reference_examples` | Now takes a list of UUIDs |
    | `query` | *(removed)* | No equivalent |
    | `filter` | `filter` | Syntax unchanged |
    | `trace_filter` | `trace_filter` | Unchanged |
    | `tree_filter` | `tree_filter` | Unchanged |
    | `is_root` | `is_root` | Unchanged |
    | `parent_run_id` | *(removed)* | No equivalent |
    | `start_time` | `min_start_time` | Renamed; defaults to 1 day ago—see warning above |
    | `error` | `has_error` | Renamed |
    | `run_ids` | `ids` | Renamed |
    | `select` | `selects` | Field names are now uppercase (`"NAME"`, `"STATUS"`, etc.) |
    | `limit` | *(removed)* | Use `page_size` for per-request batch size |
    | *(not available)* | `max_start_time` | Upper bound for `start_time`; defaults to now |
    | *(not available)* | `page_size` | Per-request result count (default 100, max 1000) |
    | *(not available)* | `reference_dataset_id` | Alternative to `project_ids`; mutually exclusive |
    | *(not available)* | `cursor` | Pass `next_cursor` from previous response to fetch next page |
  
  #### Tab: TypeScript

    

> [!WARNING]
>
> `projectName` is not supported in `client.runs.query`. Pass `project_ids` with the project UUID instead. To look up a UUID by name, use `client.readProject({ projectName: "my-project" })`.


    

> [!WARNING]
>
> `min_start_time` defaults to **1 day ago** when omitted. `listRuns` with no `startTime` returned all historical runs; `client.runs.query` without `min_start_time` silently scopes the query to the last 24 hours. Pass an explicit `min_start_time` if you need a wider window.


    | Before (`listRuns`) | After (`client.runs.query`) | Notes |
    |---|---|---|
    | `projectName` | *(removed)* | Use `project_ids` with UUID(s)—see warning above |
    | `projectId` | `project_ids` | Renamed to `snake_case`; now takes a list; mutually exclusive with `reference_dataset_id` |
    | `runType` | `run_type` | Renamed to `snake_case`; values must now be uppercase: `"LLM"`, `"CHAIN"`, `"TOOL"`, `"RETRIEVER"`, `"EMBEDDING"`, `"PROMPT"`, `"PARSER"` |
    | `traceId` | `trace_id` | Renamed to `snake_case` |
    | `referenceExampleId` | `reference_examples` | Renamed to `snake_case`; now takes a list of UUIDs |
    | `query` | *(removed)* | No equivalent |
    | `filter` | `filter` | Syntax unchanged |
    | `traceFilter` | `trace_filter` | Renamed to `snake_case` |
    | `treeFilter` | `tree_filter` | Renamed to `snake_case` |
    | `isRoot` | `is_root` | Renamed to `snake_case` |
    | `parentRunId` | *(removed)* | No equivalent |
    | `startTime` | `min_start_time` | Renamed to `snake_case`; defaults to 1 day ago—see warning above |
    | `error` | `has_error` | Renamed |
    | `id` | `ids` | Renamed |
    | `select` | `selects` | Field names are now uppercase (`"NAME"`, `"STATUS"`, etc.) |
    | `limit` | *(removed)* | Use `page_size` for per-request batch size |
    | `order` | *(removed)* | No equivalent |
    | `executionOrder` | *(removed)* | No equivalent |
    | *(not available)* | `max_start_time` | Upper bound for `start_time`; defaults to now |
    | *(not available)* | `page_size` | Per-request result count (default 100, max 1000) |
    | *(not available)* | `reference_dataset_id` | Alternative to `project_ids`; mutually exclusive |
    | *(not available)* | `cursor` | Pass `next_cursor` from previous response to fetch next page |
  
  #### Tab: Java

    

> [!WARNING]
>
> `minStartTime()` defaults to **1 day ago** when omitted. `query()` with no `startTime()` returned all historical runs; `queryV2()` without `minStartTime()` silently scopes the query to the last 24 hours. Pass an explicit `minStartTime()` if you need a wider window.


    | Before (`RunQueryParams`) | After (`RunQueryV2Params`) | Notes |
    |---|---|---|
    | `session()` | `projectIds()` | Renamed; now takes explicit project UUIDs |
    | `runType()` | `runType()` | Values must now be uppercase |
    | `trace()` | `traceId()` | Renamed |
    | `referenceExample()` | `referenceExamples()` | Renamed to plural |
    | `query()` | *(removed)* | No equivalent |
    | `filter()` | `filter()` | Syntax unchanged |
    | `traceFilter()` | `traceFilter()` | Unchanged |
    | `treeFilter()` | `treeFilter()` | Unchanged |
    | `isRoot()` | `isRoot()` | Unchanged |
    | `parentRun()` | *(removed)* | No equivalent |
    | `startTime()` | `minStartTime()` | Renamed; defaults to 1 day ago—see warning above |
    | `error()` | `hasError()` | Renamed |
    | `id()` | `ids()` | Renamed |
    | `select()` | `selects()` | Field names are now uppercase |
    | `limit()` | *(removed)* | Use `pageSize()` |
    | `order()` | *(removed)* | No equivalent |
    | `executionOrder()` | *(removed)* | No equivalent |
    | `cursor()` | `cursor()` | Unchanged |
    | *(not available)* | `maxStartTime()` | Upper bound for start time; defaults to now |
    | *(not available)* | `pageSize()` | Per-request result count (default 100, max 1000) |
    | *(not available)* | `referenceDatasetId()` | Alternative to `projectIds()` |
  
  #### Tab: Go

    

> [!WARNING]
>
> `MinStartTime` defaults to **1 day ago** when omitted. `Query()` with no `StartTime` returned all historical runs; `QueryV2()` without `MinStartTime` silently scopes the query to the last 24 hours. Pass an explicit `MinStartTime` if you need a wider window.


    | Before (`RunQueryParams`) | After (`RunQueryV2Params`) | Notes |
    |---|---|---|
    | `Session` | `ProjectIDs` | Renamed; now takes explicit project UUIDs |
    | `RunType` | `RunType` | Values must now be uppercase: `RunQueryV2ParamsRunTypeLLM`, `RunQueryV2ParamsRunTypeChain`, etc. |
    | `Trace` | `TraceID` | Renamed |
    | `ReferenceExample` | `ReferenceExamples` | Renamed to plural |
    | `Query` | *(removed)* | No equivalent |
    | `Filter` | `Filter` | Unchanged |
    | `TraceFilter` | `TraceFilter` | Unchanged |
    | `TreeFilter` | `TreeFilter` | Unchanged |
    | `IsRoot` | `IsRoot` | Unchanged |
    | `ParentRun` | *(removed)* | No equivalent |
    | `StartTime` | `MinStartTime` | Renamed; defaults to 1 day ago—see warning above |
    | `Error` | `HasError` | Renamed |
    | `ID` | `IDs` | Renamed |
    | `Select` | `Selects` | Field name constants are now uppercase (e.g., `RunQueryV2ParamsSelectName`) |
    | `Limit` | *(removed)* | Use `PageSize` |
    | `Order` | *(removed)* | No equivalent |
    | `ExecutionOrder` | *(removed)* | No equivalent |
    | `Cursor` | `Cursor` | Unchanged |
    | *(not available)* | `MaxStartTime` | Upper bound for start time; defaults to now |
    | *(not available)* | `PageSize` | Per-request result count (default 100, max 1000) |
    | *(not available)* | `ReferenceDatasetID` | Alternative to `ProjectIDs` |
  
  #### Tab: cURL

    

> [!WARNING]
>
> `min_start_time` defaults to **1 day ago** when omitted. `POST /api/v1/runs/query` with no `start_time` returned all historical runs; `POST /api/v2/runs/query` without `min_start_time` silently scopes the query to the last 24 hours. Pass an explicit `min_start_time` if you need a wider window.


    | Before (v1 `POST /api/v1/runs/query` body field) | After (v2 `POST /api/v2/runs/query` body field) | Notes |
    |---|---|---|
    | `session` | `project_ids` | Renamed; both take an array of project UUIDs. `project_ids` is mutually exclusive with `reference_dataset_id` |
    | `run_type` | `run_type` | Values must now be uppercase: `"LLM"`, `"CHAIN"`, `"TOOL"`, `"RETRIEVER"`, `"EMBEDDING"`, `"PROMPT"`, `"PARSER"` |
    | `trace` | `trace_id` | Renamed |
    | `reference_example` | `reference_examples` | Renamed to plural; now takes an array of UUIDs |
    | `query` | *(removed)* | No equivalent |
    | `filter` | `filter` | Syntax unchanged |
    | `trace_filter` | `trace_filter` | Unchanged |
    | `tree_filter` | `tree_filter` | Unchanged |
    | `is_root` | `is_root` | Unchanged |
    | `parent_run` | *(removed)* | No equivalent |
    | `start_time` | `min_start_time` | Renamed; defaults to 1 day ago—see warning above |
    | `error` | `has_error` | Renamed |
    | `id` | `ids` | Renamed to plural |
    | `select` | `selects` | Field names are now uppercase (`"NAME"`, `"STATUS"`, etc.) |
    | `limit` | *(removed)* | Use `page_size` for per-request batch size |
    | *(not available)* | `max_start_time` | Upper bound for `start_time`; defaults to now |
    | *(not available)* | `page_size` | Per-request result count (default 100, max 1000) |
    | *(not available)* | `reference_dataset_id` | Alternative to `project_ids`; mutually exclusive |
    | *(not available)* | `cursor` | Pass `next_cursor` from previous response to fetch next page |
  

#### Response fields

  #### Tab: Python

    Pass SCREAMING_SNAKE_CASE strings to `selects` (eg. `"ID"`, `"NAME"`, `"STATUS"`) to control which fields are populated on each `Run`; only selected fields are non-`None`. Default `selects` contains only `"ID"`.

    | Before (v1 `Run` attribute) | After (v2 `Run` attribute) | Notes |
    |---|---|---|
    | `run.id` | `run.id` | Unchanged; returned by default when `selects` is omitted |
    | `run.name` | `run.name` | Unchanged |
    | `run.run_type` | `run.run_type` | Values are now uppercase Literals: `"LLM"`, `"CHAIN"`, etc. |
    | `run.status` | `run.status` | Values: `"SUCCESS"`, `"ERROR"`, `"PENDING"` |
    | `run.start_time` | `run.start_time` | Unchanged |
    | `run.end_time` | `run.end_time` | Unchanged |
    | `run.error` | `run.error` | Unchanged |
    | `run.inputs` | `run.inputs` | Unchanged |
    | `run.outputs` | `run.outputs` | Unchanged |
    | `run.tags` | `run.tags` | Unchanged |
    | `run.extra` | `run.extra` | Unchanged |
    | `run.metadata` | `run.metadata` | Unchanged |
    | `run.events` | `run.events` | Unchanged |
    | `run.reference_example_id` | `run.reference_example_id` | Unchanged |
    | `run.trace_id` | `run.trace_id` | Unchanged |
    | `run.dotted_order` | `run.dotted_order` | Unchanged |
    | `run.parent_run_id` | *(removed)* | Use `run.parent_run_ids` (list of all ancestor UUIDs, root first) |
    | `run.parent_run_ids` | `run.parent_run_ids` | Unchanged |
    | `run.session_id` | `run.project_id` | Renamed; `session_id` was the project UUID |
    | `run.feedback_stats` | `run.feedback_stats` | Unchanged |
    | `run.app_path` | `run.app_path` | Unchanged |
    | `run.attachments` | `run.attachments` | v2 returns pre-signed download URLs instead of raw bytes |
    | `run.total_tokens` | `run.total_tokens` | Unchanged |
    | `run.prompt_tokens` | `run.prompt_tokens` | Unchanged |
    | `run.completion_tokens` | `run.completion_tokens` | Unchanged |
    | `run.total_cost` | `run.total_cost` | Unchanged |
    | `run.prompt_cost` | `run.prompt_cost` | Unchanged |
    | `run.completion_cost` | `run.completion_cost` | Unchanged |
    | `run.first_token_time` | `run.first_token_time` | Unchanged |
    | `run.latency` (property) | `run.latency_seconds` | Renamed; was a computed `timedelta` property, now a native `float` field |
    | `run.in_dataset` | `run.is_in_dataset` | Renamed |
    | `run.child_run_ids` | *(removed)* | No equivalent |
    | `run.child_runs` | *(removed)* | No equivalent |
    | `run.serialized` | *(removed)* | Use `run.manifest` |
    | `run.manifest_id` | *(removed)* | Use `run.manifest` |
    | *(not available)* | `run.is_root` | New |
    | *(not available)* | `run.manifest` | New: full manifest object (replaces `serialized` and `manifest_id`) |
    | *(not available)* | `run.error_preview` | New: truncated error snippet |
    | *(not available)* | `run.inputs_preview` | New: truncated inputs preview |
    | *(not available)* | `run.outputs_preview` | New: truncated outputs preview |
    | *(not available)* | `run.thread_id` | New: conversation thread UUID |
    | *(not available)* | `run.reference_dataset_id` | New: dataset UUID for the reference example |
    | *(not available)* | `run.share_url` | New: public share URL (only set when the run has been shared) |
    | `run.prompt_token_details` | `run.prompt_token_details.raw` | Field now wraps the dict; access `.raw` to get `dict[str, int]` (element type unchanged) |
    | `run.completion_token_details` | `run.completion_token_details.raw` | Field now wraps the dict; access `.raw` to get `dict[str, int]` (element type unchanged) |
    | `run.prompt_cost_details` | `run.prompt_cost_details.raw` | Field now wraps the dict; access `.raw` to get `dict[str, float]` (was `dict[str, Decimal]`) |
    | `run.completion_cost_details` | `run.completion_cost_details.raw` | Field now wraps the dict; access `.raw` to get `dict[str, float]` (was `dict[str, Decimal]`) |
  
  #### Tab: TypeScript

    Pass SCREAMING_SNAKE_CASE strings to `selects` (eg. `"ID"`, `"NAME"`, `"STATUS"`) to control which fields are populated on each `Run`. Default `selects` contains only `"ID"`.

    | Before (v1 `Run` property) | After (v2 `Run` property) | Notes |
    |---|---|---|
    | `run.id` | `run.id` | Unchanged |
    | `run.name` | `run.name` | Unchanged |
    | `run.runType` | `run.run_type` | Renamed to `snake_case`; values are now uppercase: `"LLM"`, `"CHAIN"`, etc. |
    | `run.status` | `run.status` | Values: `"SUCCESS"`, `"ERROR"`, `"PENDING"` |
    | `run.startTime` | `run.start_time` | Renamed to `snake_case` |
    | `run.endTime` | `run.end_time` | Renamed to `snake_case` |
    | `run.error` | `run.error` | Unchanged |
    | `run.inputs` | `run.inputs` | Unchanged |
    | `run.outputs` | `run.outputs` | Unchanged |
    | `run.tags` | `run.tags` | Unchanged |
    | `run.extra` | `run.extra` | Unchanged |
    | *(not available)* | `run.metadata` | New: previously accessed via `run.extra.metadata` |
    | `run.events` | `run.events` | Unchanged |
    | `run.referenceExampleId` | `run.reference_example_id` | Renamed to `snake_case` |
    | `run.traceId` | `run.trace_id` | Renamed to `snake_case` |
    | `run.dottedOrder` | `run.dotted_order` | Renamed to `snake_case` |
    | `run.parentRunId` | *(removed)* | Use `run.parent_run_ids` (list of all ancestor UUIDs, root first) |
    | `run.parentRunIds` | `run.parent_run_ids` | Renamed to `snake_case` |
    | `run.sessionId` | `run.project_id` | Renamed; `sessionId` was the project UUID |
    | `run.feedbackStats` | `run.feedback_stats` | Renamed to `snake_case` |
    | `run.appPath` | `run.app_path` | Renamed to `snake_case` |
    | `run.attachments` | `run.attachments` | v2 returns pre-signed download URLs instead of raw bytes |
    | `run.totalTokens` | `run.total_tokens` | Renamed to `snake_case` |
    | `run.promptTokens` | `run.prompt_tokens` | Renamed to `snake_case` |
    | `run.completionTokens` | `run.completion_tokens` | Renamed to `snake_case` |
    | `run.totalCost` | `run.total_cost` | Renamed to `snake_case` |
    | `run.promptCost` | `run.prompt_cost` | Renamed to `snake_case` |
    | `run.completionCost` | `run.completion_cost` | Renamed to `snake_case` |
    | `run.firstTokenTime` | `run.first_token_time` | Renamed to `snake_case` |
    | `run.latency` | `run.latency_seconds` | Renamed; was a computed property, now a native `number` field (seconds) |
    | `run.inDataset` | `run.is_in_dataset` | Renamed |
    | `run.childRunIds` | *(removed)* | No equivalent |
    | `run.childRuns` | *(removed)* | No equivalent |
    | `run.serialized` | *(removed)* | Use `run.manifest` |
    | `run.manifestId` | *(removed)* | Use `run.manifest` |
    | `run.shareToken` | *(removed)* | Use `run.share_url` (full URL, only set when the run has been shared) |
    | *(not available)* | `run.is_root` | New |
    | *(not available)* | `run.manifest` | New: full manifest object (replaces `serialized` and `manifestId`) |
    | *(not available)* | `run.error_preview` | New: truncated error snippet |
    | *(not available)* | `run.inputs_preview` | New: truncated inputs preview |
    | *(not available)* | `run.outputs_preview` | New: truncated outputs preview |
    | *(not available)* | `run.thread_id` | New: conversation thread UUID |
    | *(not available)* | `run.reference_dataset_id` | New: dataset UUID for the reference example |
    | *(not available)* | `run.share_url` | New: public share URL (only set when the run has been shared) |
    | *(not available)* | `run.prompt_token_details` | New: per-category prompt token breakdown |
    | *(not available)* | `run.completion_token_details` | New: per-category completion token breakdown |
    | *(not available)* | `run.prompt_cost_details` | New: per-category prompt cost breakdown |
    | *(not available)* | `run.completion_cost_details` | New: per-category completion cost breakdown |
  
  #### Tab: Java

    Add `RunQueryV2Params.Select` values (eg. `Select.NAME`, `Select.STATUS`) via `.addSelect(...)` to control which fields are populated; unselected fields return empty `Optional` values. `selects()` defaults to `ID` only.

    | Before (`RunSchema` method) | After (`Run` method) | Notes |
    |---|---|---|
    | `run.id()` | `run.id()` | Unchanged |
    | `run.name()` | `run.name()` | Unchanged |
    | `run.runType()` | `run.runType()` | Values are now uppercase: `"LLM"`, `"CHAIN"`, etc. |
    | `run.status()` | `run.status()` | Values: `"SUCCESS"`, `"ERROR"`, `"PENDING"` |
    | `run.startTime()` | `run.startTime()` | Unchanged |
    | `run.endTime()` | `run.endTime()` | Unchanged |
    | `run.error()` | `run.error()` | Unchanged |
    | `run.inputs()` | `run.inputs()` | Unchanged |
    | `run.outputs()` | `run.outputs()` | Unchanged |
    | `run.tags()` | `run.tags()` | Unchanged |
    | `run.extra()` | `run.extra()` | Unchanged |
    | `run.events()` | `run.events()` | Unchanged |
    | `run.feedbackStats()` | `run.feedbackStats()` | Unchanged |
    | `run.inputsPreview()` | `run.inputsPreview()` | Unchanged |
    | `run.outputsPreview()` | `run.outputsPreview()` | Unchanged |
    | `run.referenceExampleId()` | `run.referenceExampleId()` | Unchanged |
    | `run.traceId()` | `run.traceId()` | Unchanged |
    | `run.dottedOrder()` | `run.dottedOrder()` | Unchanged |
    | `run.parentRunId()` | *(removed)* | Use `run.parentRunIds()` (list of all ancestor UUIDs, root first) |
    | `run.parentRunIds()` | `run.parentRunIds()` | Unchanged |
    | `run.sessionId()` | `run.projectId()` | Renamed; `sessionId()` returned the project UUID |
    | `run.appPath()` | `run.appPath()` | Unchanged |
    | `run.firstTokenTime()` | `run.firstTokenTime()` | Unchanged |
    | `run.totalTokens()` | `run.totalTokens()` | Unchanged |
    | `run.promptTokens()` | `run.promptTokens()` | Unchanged |
    | `run.completionTokens()` | `run.completionTokens()` | Unchanged |
    | `run.totalCost()` | `run.totalCost()` | Return type changed from `Optional<String>` to `Optional<Double>` |
    | `run.promptCost()` | `run.promptCost()` | Return type changed from `Optional<String>` to `Optional<Double>` |
    | `run.completionCost()` | `run.completionCost()` | Return type changed from `Optional<String>` to `Optional<Double>` |
    | `run.promptTokenDetails()` | `run.promptTokenDetails()` | Unchanged |
    | `run.completionTokenDetails()` | `run.completionTokenDetails()` | Unchanged |
    | `run.promptCostDetails()` | `run.promptCostDetails()` | Unchanged |
    | `run.completionCostDetails()` | `run.completionCostDetails()` | Unchanged |
    | `run.priceModelId()` | `run.priceModelId()` | Unchanged |
    | `run.inDataset()` | `run.isInDataset()` | Renamed |
    | `run.referenceDatasetId()` | `run.referenceDatasetId()` | Unchanged |
    | `run.threadId()` | `run.threadId()` | Unchanged |
    | `run.shareToken()` | *(removed)* | Use `run.shareUrl()` (full URL, only set when the run has been shared) |
    | `run.childRunIds()` | *(removed)* | No equivalent |
    | `run.directChildRunIds()` | *(removed)* | No equivalent |
    | `run.serialized()` | *(removed)* | Use `run.manifest()` |
    | `run.manifestId()` | *(removed)* | Use `run.manifest()` |
    | `run.messages()` | *(removed)* | No equivalent |
    | `run.executionOrder()` | *(removed)* | No equivalent |
    | `run.lastQueuedAt()` | *(removed)* | No equivalent |
    | `run.traceFirstReceivedAt()` | *(removed)* | No equivalent |
    | `run.traceMaxStartTime()` | *(removed)* | No equivalent |
    | `run.traceMinStartTime()` | *(removed)* | No equivalent |
    | `run.traceTier()` | *(removed)* | No equivalent |
    | `run.traceUpgrade()` | *(removed)* | No equivalent |
    | `run.ttlSeconds()` | *(removed)* | No equivalent |
    | *(not available)* | `run.attachments()` | New: pre-signed download URLs for attachments (replaces S3 URL fields) |
    | *(not available)* | `run.latencySeconds()` | New: wall-clock duration in seconds |
    | *(not available)* | `run.isRoot()` | New |
    | *(not available)* | `run.errorPreview()` | New: truncated error snippet |
    | *(not available)* | `run.manifest()` | New: full manifest, typed as `Optional<Manifest>` (replaces `serialized()` and `manifestId()`) |
    | *(not available)* | `run.metadata()` | New: metadata, typed as `Optional<Metadata>` (was derived from `extra.metadata`) |
    | *(not available)* | `run.shareUrl()` | New: public share URL (only set when the run has been shared) |
    | *(not available)* | `run.threadEvaluationTime()` | New |
  
  #### Tab: Go

    Pass `RunQueryV2ParamsSelect` constants (eg. `RunQueryV2ParamsSelectName`, `RunQueryV2ParamsSelectStatus`) to `Selects` to control which fields are populated; unselected fields are zero-valued on the returned struct. `Selects` defaults to `ID` only.

    | Before (`RunSchema` field) | After (`Run` field) | Notes |
    |---|---|---|
    | `run.ID` | `run.ID` | Unchanged |
    | `run.Name` | `run.Name` | Unchanged |
    | `run.RunType` | `run.RunType` | Values changed to uppercase: `"LLM"`, `"CHAIN"`, etc. |
    | `run.Status` | `run.Status` | Values: `"SUCCESS"`, `"ERROR"`, `"PENDING"` |
    | `run.TraceID` | `run.TraceID` | Unchanged |
    | `run.DottedOrder` | `run.DottedOrder` | Unchanged |
    | `run.AppPath` | `run.AppPath` | Unchanged |
    | `run.StartTime` | `run.StartTime` | Unchanged |
    | `run.EndTime` | `run.EndTime` | Unchanged |
    | `run.Error` | `run.Error` | Unchanged |
    | `run.Events` | `run.Events` | Unchanged; element type is now `RunEvent` (was `map[string]interface{}`) |
    | `run.Extra` | `run.Extra` | Unchanged; type is now `interface{}` (was `map[string]interface{}`) |
    | `run.FeedbackStats` | `run.FeedbackStats` | Unchanged; element type is now `RunFeedbackStat` |
    | `run.FirstTokenTime` | `run.FirstTokenTime` | Unchanged |
    | `run.Inputs` | `run.Inputs` | Unchanged; type is now `interface{}` (was `map[string]interface{}`) |
    | `run.InputsPreview` | `run.InputsPreview` | Unchanged |
    | `run.Outputs` | `run.Outputs` | Unchanged; type is now `interface{}` (was `map[string]interface{}`) |
    | `run.OutputsPreview` | `run.OutputsPreview` | Unchanged |
    | `run.ParentRunIDs` | `run.ParentRunIDs` | Unchanged |
    | `run.PriceModelID` | `run.PriceModelID` | Unchanged |
    | `run.PromptCost` | `run.PromptCost` | Unchanged |
    | `run.PromptCostDetails` | `run.PromptCostDetails.Raw` | Field now wraps the map; access `.Raw` to get `map[string]float64` (was `map[string]string`) |
    | `run.PromptTokenDetails` | `run.PromptTokenDetails.Raw` | Field now wraps the map; access `.Raw` to get `map[string]int64` (element type unchanged) |
    | `run.PromptTokens` | `run.PromptTokens` | Unchanged |
    | `run.CompletionCost` | `run.CompletionCost` | Unchanged |
    | `run.CompletionCostDetails` | `run.CompletionCostDetails.Raw` | Field now wraps the map; access `.Raw` to get `map[string]float64` (was `map[string]string`) |
    | `run.CompletionTokenDetails` | `run.CompletionTokenDetails.Raw` | Field now wraps the map; access `.Raw` to get `map[string]int64` (element type unchanged) |
    | `run.CompletionTokens` | `run.CompletionTokens` | Unchanged |
    | `run.TotalCost` | `run.TotalCost` | Unchanged |
    | `run.TotalTokens` | `run.TotalTokens` | Unchanged |
    | `run.ReferenceDatasetID` | `run.ReferenceDatasetID` | Unchanged |
    | `run.ReferenceExampleID` | `run.ReferenceExampleID` | Unchanged |
    | `run.Tags` | `run.Tags` | Unchanged |
    | `run.ThreadID` | `run.ThreadID` | Unchanged |
    | `run.SessionID` | `run.ProjectID` | Renamed |
    | `run.InDataset` | `run.IsInDataset` | Renamed |
    | `run.ChildRunIDs` | *(removed)* | No equivalent |
    | `run.DirectChildRunIDs` | *(removed)* | No equivalent |
    | `run.ExecutionOrder` | *(removed)* | No equivalent |
    | `run.InputsS3URLs` | *(removed)* | Internal storage URL; not exposed in v2 |
    | `run.LastQueuedAt` | *(removed)* | No equivalent |
    | `run.ManifestID` | *(removed)* | Use `run.Manifest` |
    | `run.ManifestS3ID` | *(removed)* | Internal storage URL; not exposed in v2 |
    | `run.Messages` | *(removed)* | No equivalent |
    | `run.OutputsS3URLs` | *(removed)* | Internal storage URL; not exposed in v2 |
    | `run.ParentRunID` | *(removed)* | Use `run.ParentRunIDs` |
    | `run.S3URLs` | *(removed)* | Internal storage URL; not exposed in v2 |
    | `run.Serialized` | *(removed)* | Use `run.Manifest` |
    | `run.ShareToken` | *(removed)* | Use `run.ShareURL` |
    | `run.TraceFirstReceivedAt` | *(removed)* | No equivalent |
    | `run.TraceMaxStartTime` | *(removed)* | No equivalent |
    | `run.TraceMinStartTime` | *(removed)* | No equivalent |
    | `run.TraceTier` | *(removed)* | No equivalent |
    | `run.TraceUpgrade` | *(removed)* | No equivalent |
    | `run.TtlSeconds` | *(removed)* | No equivalent |
    | *(not available)* | `run.Attachments` | New: maps attachment filename to pre-signed download URL |
    | *(not available)* | `run.ErrorPreview` | New: truncated error snippet |
    | *(not available)* | `run.IsRoot` | New |
    | *(not available)* | `run.LatencySeconds` | New: wall-clock duration in seconds |
    | *(not available)* | `run.Manifest` | New: full manifest object (replaces `Serialized` and `ManifestID`) |
    | *(not available)* | `run.Metadata` | New: arbitrary user-defined JSON metadata |
    | *(not available)* | `run.ShareURL` | New: public share URL (only set when the run has been shared) |
    | *(not available)* | `run.ThreadEvaluationTime` | New |
  
  #### Tab: cURL

    Field names in the JSON response use `snake_case`.

    Pass SCREAMING_SNAKE_CASE strings in the `selects` JSON array (eg. `"ID"`, `"NAME"`, `"STATUS"`) to control which fields are populated. Default `selects` contains only `"ID"`.

    | Before (v1 response field) | After (v2 response field) | Notes |
    |---|---|---|
    | `id` | `id` | Unchanged |
    | `name` | `name` | Unchanged |
    | `run_type` | `run_type` | Values changed to uppercase: `"LLM"`, `"CHAIN"`, etc. |
    | `status` | `status` | Values: `"SUCCESS"`, `"ERROR"`, `"PENDING"` |
    | `trace_id` | `trace_id` | Unchanged |
    | `dotted_order` | `dotted_order` | Unchanged |
    | `app_path` | `app_path` | Unchanged |
    | `start_time` | `start_time` | Unchanged |
    | `end_time` | `end_time` | Unchanged |
    | `error` | `error` | Unchanged |
    | `events` | `events` | Unchanged |
    | `extra` | `extra` | Unchanged |
    | `feedback_stats` | `feedback_stats` | Unchanged |
    | `first_token_time` | `first_token_time` | Unchanged |
    | `inputs` | `inputs` | Unchanged |
    | `inputs_preview` | `inputs_preview` | Unchanged |
    | `outputs` | `outputs` | Unchanged |
    | `outputs_preview` | `outputs_preview` | Unchanged |
    | `parent_run_ids` | `parent_run_ids` | Unchanged |
    | `price_model_id` | `price_model_id` | Unchanged |
    | `prompt_cost` | `prompt_cost` | Unchanged |
    | `prompt_cost_details` | `prompt_cost_details.raw` | Field now wraps the object; read `.raw` for the same `{category: cost}` mapping, now with numeric values (was strings) |
    | `prompt_token_details` | `prompt_token_details.raw` | Field now wraps the object; read `.raw` for the same `{category: count}` mapping (values unchanged) |
    | `prompt_tokens` | `prompt_tokens` | Unchanged |
    | `completion_cost` | `completion_cost` | Unchanged |
    | `completion_cost_details` | `completion_cost_details.raw` | Field now wraps the object; read `.raw` for the same `{category: cost}` mapping, now with numeric values (was strings) |
    | `completion_token_details` | `completion_token_details.raw` | Field now wraps the object; read `.raw` for the same `{category: count}` mapping (values unchanged) |
    | `completion_tokens` | `completion_tokens` | Unchanged |
    | `total_cost` | `total_cost` | Unchanged |
    | `total_tokens` | `total_tokens` | Unchanged |
    | `reference_dataset_id` | `reference_dataset_id` | Unchanged |
    | `reference_example_id` | `reference_example_id` | Unchanged |
    | `tags` | `tags` | Unchanged |
    | `thread_id` | `thread_id` | Unchanged |
    | `session_id` | `project_id` | Renamed |
    | `in_dataset` | `is_in_dataset` | Renamed |
    | `child_run_ids` | *(removed)* | No equivalent |
    | `direct_child_run_ids` | *(removed)* | No equivalent |
    | `execution_order` | *(removed)* | No equivalent |
    | `inputs_s3_urls` | *(removed)* | Internal storage URL; not exposed in v2 |
    | `last_queued_at` | *(removed)* | No equivalent |
    | `manifest_id` | *(removed)* | Use `manifest` |
    | `manifest_s3_id` | *(removed)* | Internal storage URL; not exposed in v2 |
    | `messages` | *(removed)* | No equivalent |
    | `outputs_s3_urls` | *(removed)* | Internal storage URL; not exposed in v2 |
    | `parent_run_id` | *(removed)* | Use `parent_run_ids` |
    | `s3_urls` | *(removed)* | Internal storage URL; not exposed in v2 |
    | `serialized` | *(removed)* | Use `manifest` |
    | `share_token` | *(removed)* | Use `share_url` |
    | `trace_first_received_at` | *(removed)* | No equivalent |
    | `trace_max_start_time` | *(removed)* | No equivalent |
    | `trace_min_start_time` | *(removed)* | No equivalent |
    | `trace_tier` | *(removed)* | No equivalent |
    | `trace_upgrade` | *(removed)* | No equivalent |
    | `ttl_seconds` | *(removed)* | No equivalent |
    | *(not available)* | `attachments` | New: maps attachment filename to pre-signed download URL |
    | *(not available)* | `error_preview` | New: truncated error snippet |
    | *(not available)* | `is_root` | New |
    | *(not available)* | `latency_seconds` | New: wall-clock duration in seconds |
    | *(not available)* | `manifest` | New: full manifest object (replaces `serialized` and `manifest_id`) |
    | *(not available)* | `metadata` | New: previously nested under `extra.metadata` |
    | *(not available)* | `share_url` | New: public share URL (only set when the run has been shared) |
    | *(not available)* | `thread_evaluation_time` | New |
  

### Examples

#### List all runs in a project

  #### Tab: Python

    `runs.query` does not accept a project name directly. Resolve the project UUID with `client.aread_project()` first, then pass it as a string in `project_ids`.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: TypeScript

    `client.runs.query` does not accept a project name directly. Resolve the project UUID with `client.readProject()` first, then pass it as a string in `project_ids`.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Java

    `queryV2()` does not accept a project name directly. Resolve the project UUID with `client.sessions().list()` first, then pass it as a string in `projectIds()`.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Go

    `QueryV2()` does not accept a project name directly. Resolve the project UUID with `client.Sessions.List()` first, then pass it as a string in `ProjectIDs`.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: cURL

    `POST /api/v2/runs/query` does not accept a project name directly. Resolve the project UUID with a `GET /api/v1/sessions` request first, then pass it as a string in `project_ids`.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  

#### Selecting fields

  #### Tab: Python

    `list_runs` returns a default set of fields with no selection needed. `runs.query` returns only `id` by default—pass `selects=[...]` to request more. Field names are now uppercase (`"name"` → `"NAME"`).

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: TypeScript

    `listRuns` returns a default set of fields with no selection needed. `client.runs.query` returns only `id` by default—pass `selects: [...]` to request more. Field names are now uppercase (`"name"` → `"NAME"`).

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Java

    `query()` returns a default set of fields with no selection needed. `queryV2()` returns only `id` by default—call `.addSelect(RunQueryV2Params.Select.X)` for each field you need.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Go

    `Query` returns a default set of fields with no selection needed. `QueryV2` returns only `ID` by default—pass `Selects` with the uppercase field constants you need (e.g. `RunQueryV2ParamsSelectName`).

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: cURL

    `POST /api/v1/runs/query` returns a default set of fields with no selection needed. `POST /api/v2/runs/query` returns only `id` by default—pass `selects` with the uppercase field names you need (e.g. `"NAME"`).

  #### Tab: Before

    
  
  #### Tab: After

    
  

  

#### Filter by run type and time range

  #### Tab: Python

    `start_time` is renamed to `min_start_time`, and `run_type` values are now uppercase (`"llm"` → `"LLM"`).

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: TypeScript

    `startTime` (camelCase) becomes `min_start_time` (snake_case, matching the v2 request body), and `runType` values are now uppercase (`"llm"` → `"LLM"`).

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Java

    `.startTime()` is renamed to `.minStartTime()`, and `.runType()` now takes the new `RunQueryV2Params.RunType` enum instead of `RunTypeEnum`.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Go

    `StartTime` is renamed to `MinStartTime`, and `RunType` now takes the new `RunQueryV2ParamsRunType` enum instead of `RunTypeEnum`.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: cURL

    `start_time` is renamed to `min_start_time`, and `run_type` values are now uppercase (`"llm"` → `"LLM"`).

  #### Tab: Before

    
  
  #### Tab: After

    
  

  

#### Filter root runs only

  #### Tab: Python

    `is_root` is unchanged.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: TypeScript

    `isRoot` (camelCase) becomes `is_root` (snake_case, matching the v2 request body).

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Java

    `.isRoot()` is unchanged.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Go

    `IsRoot` is unchanged.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: cURL

    `is_root` is unchanged.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  


> [!NOTE]
>
> To enumerate traces specifically, use `traces.query` instead of `is_root=True`. See [Traces: query](lc:langsmith/smithdb-sdk-migration#traces-query): it also exposes trace-wide `total_tokens`/`total_cost` via `trace_aggregates`.


#### Fetch runs by ID list

  #### Tab: Python

    `id=[...]` is renamed to `ids=[...]`. `project_ids` is now required even when filtering by run IDs—v1 allowed omitting the project context.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: TypeScript

    `id: [...]` is renamed to `ids: [...]`. `project_ids` is now required even when filtering by run IDs—v1 allowed omitting the project context.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Java

    `.addId(...)` is unchanged—call it once per run ID. `.addProjectId(...)` is now required even when filtering by run IDs—v1 allowed omitting the project context.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Go

    `ID: [...]` is renamed to `IDs: [...]`. `ProjectIDs` is now required even when filtering by run IDs—v1 allowed omitting the project context.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: cURL

    `id` is renamed to `ids`. `project_ids` is now required in the request body even when filtering by run IDs—v1 allowed omitting the project context.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  

#### Iterate through runs

  #### Tab: Python

    `list_runs` auto-paginates transparently, fetching up to 100 runs per API call and stopping once `limit` results are returned. `runs.query` does not accept a total `limit`; iterate with `async for` and `break` once you have enough, or use the returned page's `has_next_page()`/`get_next_page()` for manual page-by-page control.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: TypeScript

    `listRuns` auto-paginates transparently. `client.runs.query` returns an async iterable of individual runs—use `for await` and `break` once you have enough.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Java

    `.autoPager()` is used the same way on both `query()` and `queryV2()`—break out of the loop once you have enough runs.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Go

    `QueryAutoPaging` is renamed to `QueryV2AutoPaging`; both use the same `iter.Next()`/`iter.Current()` pattern—break out of the loop once you have enough runs.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: cURL

    The v1 API returns all matching runs in one response with no cursor. The v2 API paginates—pass the `cursor` from a response's `next_cursor` field to fetch the next page.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  

#### Filter runs with errors

  #### Tab: Python

    `error=True/False` is renamed to `has_error=True/False`.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: TypeScript

    `error: true/false` is renamed to `has_error: true/false`.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Java

    `.error(true/false)` is renamed to `.hasError(true/false)`.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Go

    `Error` is renamed to `HasError`.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: cURL

    `error` is renamed to `has_error`.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  

#### Filter by metadata

  #### Tab: Python

    The `filter` string syntax is unchanged: `eq(metadata_key, ...)` checks for key presence, combined with `eq(metadata_value, ...)` to match a specific value.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: TypeScript

    The `filter` string syntax is unchanged: `eq(metadata_key, ...)` checks for key presence, combined with `eq(metadata_value, ...)` to match a specific value.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Java

    The `.filter(...)` string syntax is unchanged: `eq(metadata_key, ...)` checks for key presence, combined with `eq(metadata_value, ...)` to match a specific value.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Go

    The `Filter` string syntax is unchanged: `eq(metadata_key, ...)` checks for key presence, combined with `eq(metadata_value, ...)` to match a specific value.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: cURL

    The `filter` string syntax is unchanged: `eq(metadata_key, ...)` checks for key presence, combined with `eq(metadata_value, ...)` to match a specific value.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  

#### Complex boolean filters

  #### Tab: Python

    Nested `and()` / `or()` filter expressions are unchanged.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: TypeScript

    Nested `and()` / `or()` filter expressions are unchanged.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Java

    Nested `and()` / `or()` filter expressions are unchanged.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Go

    Nested `and()` / `or()` filter expressions are unchanged.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: cURL

    Nested `and()` / `or()` filter expressions are unchanged.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  

#### Scoped filters: filter, trace_filter, tree_filter

  #### Tab: Python

    `filter`, `trace_filter`, and `tree_filter` are unchanged. `filter` applies to the matched run, `trace_filter` to the root of its trace, and `tree_filter` to other runs in the trace tree (siblings and children).

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: TypeScript

    `filter`, `trace_filter`, and `tree_filter` are unchanged. `filter` applies to the matched run, `trace_filter` to the root of its trace, and `tree_filter` to other runs in the trace tree (siblings and children).

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Java

    `.filter()`, `.traceFilter()`, and `.treeFilter()` are unchanged. `filter` applies to the matched run, `traceFilter` to the root of its trace, and `treeFilter` to other runs in the trace tree (siblings and children).

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Go

    `Filter`, `TraceFilter`, and `TreeFilter` are unchanged. `Filter` applies to the matched run, `TraceFilter` to the root of its trace, and `TreeFilter` to other runs in the trace tree (siblings and children).

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: cURL

    `filter`, `trace_filter`, and `tree_filter` are unchanged. `filter` applies to the matched run, `trace_filter` to the root of its trace, and `tree_filter` to other runs in the trace tree (siblings and children).

  #### Tab: Before

    
  
  #### Tab: After

    

  

  


<!-- Inlined Snippet: runs-retrieve-basic-after-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

RUN_ID="<run-id>"
START_TIME="2026-06-01T12:00:00Z"

curl "https://api.smith.langchain.com/api/v2/runs/$RUN_ID?project_id=$PROJECT_ID&start_time=$START_TIME&selects=NAME&selects=STATUS&selects=TOTAL_TOKENS" \
  -H "x-api-key: $LANGSMITH_API_KEY"
```

<!-- Inlined Snippet: runs-retrieve-by-id-after-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

RUN_ID="<run-id>"
START_TIME="2025-01-01T12:00:00Z" # Optional, but speeds up retrieval

curl "https://api.smith.langchain.com/api/v2/runs/$RUN_ID?project_id=$PROJECT_ID&start_time=$START_TIME" \
  -H "x-api-key: $LANGSMITH_API_KEY"
```

<!-- Inlined Snippet: runs-retrieve-not-found-before-py.mdx -->
```python Before
from langsmith import Client
from langsmith.utils import LangSmithNotFoundError

client = Client()
run_id = "<run-id>"

try:
    run = client.read_run(run_id)
except LangSmithNotFoundError:
    print(f"Run {run_id} not found")
```

<!-- Inlined Snippet: runs-retrieve-not-found-after-py.mdx -->
```python After
from langsmith import Client
from langsmith import NotFoundError

async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    run_id = "<run-id>"
    start_time = "2026-06-01T12:00:00Z"

    try:
        run = await client.runs.retrieve(
            run_id=run_id,
            project_id=str(project.id),
            start_time=start_time,
        )
    except NotFoundError:
        print(f"Run {run_id} not found")

asyncio.run(main())
```

<!-- Inlined Snippet: runs-retrieve-not-found-before-sh.mdx -->
```bash
RUN_ID="<run-id>"

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  "https://api.smith.langchain.com/api/v1/runs/$RUN_ID" \
  -H "x-api-key: $LANGSMITH_API_KEY")

if [ "$HTTP_STATUS" = "404" ]; then
  echo "Run $RUN_ID not found"
fi
```

<!-- Inlined Snippet: runs-retrieve-not-found-after-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

RUN_ID="<run-id>"
START_TIME="2025-01-01T12:00:00Z"

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  "https://api.smith.langchain.com/api/v2/runs/$RUN_ID?project_id=$PROJECT_ID&start_time=$START_TIME" \
  -H "x-api-key: $LANGSMITH_API_KEY")

if [ "$HTTP_STATUS" = "404" ]; then
  echo "Run $RUN_ID not found"
fi
```

<!-- Inlined Snippet: runs-retrieve-child-runs-before-py.mdx -->
```python Before
from langsmith import Client

client = Client()
run_id = "<run-id>"

run = client.read_run(run_id, load_child_runs=True)

# `child_runs` holds the direct children, each with its own nested `child_runs`.
# `child_run_ids` holds every descendant, at any depth.
for child in run.child_runs or []:
    print(child.name, child.run_type, len(child.child_runs or []))
print(len(run.child_run_ids or []), "descendants")
```

<!-- Inlined Snippet: runs-retrieve-child-runs-after-py.mdx -->
```python After
from collections import defaultdict

from langsmith import Client

async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    # A root run is its own trace, so `trace_id` is also the run ID.
    trace_id = "<trace-id>"

    trace_runs = await client.traces.list_runs(
        trace_id,
        project_id=str(project.id),
        selects=["ID", "NAME", "RUN_TYPE", "PARENT_RUN_IDS", "START_TIME", "END_TIME"],
    )

    # `parent_run_ids` is the full ancestor chain, root first, closest parent
    # last. A run is a descendant of any ID in that chain, at any depth, not
    # only of the immediate parent. This flat list replaces `child_run_ids`.
    descendants = [
        run for run in (trace_runs.items or []) if trace_id in (run.parent_run_ids or [])
    ]
    print(len(descendants), "descendants")

    # Optional: rebuild the nested `child_runs` shape instead of a flat list.
    by_parent = defaultdict(list)
    for run in trace_runs.items or []:
        if run.parent_run_ids:
            # The last ancestor is the immediate parent.
            by_parent[run.parent_run_ids[-1]].append(run)

    def attach(run):
        run.child_runs = by_parent.get(run.id, [])
        for child in run.child_runs:
            attach(child)

    for run in trace_runs.items or []:
        attach(run)

    children = by_parent.get(trace_id, [])
    for child in children:
        print(child.name, child.run_type, len(child.child_runs))

asyncio.run(main())
```

## Runs: retrieve

Fetch a single run by ID. Returns only the run ID by default—specify a field selection list to retrieve additional data.

### Main changes

#### Method name

  #### Tab: Python

    | Before | After |
    |--------|-------|
    | `client.read_run()` | `client.runs.retrieve()` |

    

> [!NOTE]
>
> `client.runs.retrieve()` is now async. Call it with `await`.


    See the [reference](https://reference.langchain.com/python/langsmith/_openapi_client/resources/runs/RunsResource/retrieve_v2) for the full parameter and field list.
  
  #### Tab: TypeScript

    | Before | After |
    |--------|-------|
    | `client.readRun()` | `client.runs.retrieve()` |

    See the [reference](https://reference.langchain.com/javascript/langsmith/_openapi_client/Langsmith/Runs/retrieveV2) for the full parameter and field list.
  
  #### Tab: Java

    | Before | After |
    |--------|-------|
    | `client.runs().retrieve()` | `client.runs().retrieveV2()` |

    See the [reference](https://javadoc.io/doc/com.langchain.smith/langsmith-java/latest/com/langchain/smith/services/blocking/RunService.html) for the full parameter list.
  
  #### Tab: Go

    | Before | After |
    |--------|-------|
    | `client.Runs.Get()` | `client.Runs.GetV2()` |

    See the [reference](https://pkg.go.dev/github.com/langchain-ai/langsmith-go#RunService.GetV2) for the full parameter list.
  
  #### Tab: cURL

    | Before | After |
    |--------|-------|
    | `GET /api/v1/runs/{run_id}` | `GET /api/v2/runs/{run_id}` |

    See the [API doc](https://docs.langchain.com/langsmith/smith-api/runs/get-a-single-run) for the full parameter and field list.
  

#### Query parameters

  #### Tab: Python

    

> [!WARNING]
>
> `runs.retrieve` requires a new `project_id` field that `read_run` did not need. It also accepts an optional `start_time`—providing it speeds up retrieval but is not required.


    | Before (`read_run`) | After (`runs.retrieve`) | Notes |
    |---|---|---|
    | `run_id` | `run_id` | Unchanged |
    | `load_child_runs` | *(removed)* | Fetch the trace's runs with `traces.list_runs` and filter by `parent_run_ids`. See [Load a run's child runs](#load-a-runs-child-runs) |
    | *(not available)* | `project_id` | **Required**—UUID of the project that owns the run |
    | *(not available)* | `start_time` | Optional—run's start time (RFC3339); providing it speeds up retrieval |
    | *(all fields returned by default)* | `selects` | Field projection; defaults to `["ID"]` only; field names are uppercase |
  
  #### Tab: TypeScript

    

> [!WARNING]
>
> `client.runs.retrieve` requires a new `project_id` field that `readRun` did not need. It also accepts an optional `start_time`—providing it speeds up retrieval but is not required.


    | Before (`readRun`) | After (`client.runs.retrieve`) | Notes |
    |---|---|---|
    | `runId` | `runId` | Unchanged (positional parameter) |
    | `options.loadChildRuns` | *(removed)* | Fetch the trace's runs with `client.traces.listRuns` and filter by `parent_run_ids`. See [Load a run's child runs](#load-a-runs-child-runs) |
    | *(not available)* | `project_id` | **Required**—`snake_case`; UUID of the project that owns the run |
    | *(not available)* | `start_time` | Optional—`snake_case`; run's start time (RFC3339); providing it speeds up retrieval |
    | *(all fields returned by default)* | `selects` | Field projection; defaults to `["ID"]` only; field names are uppercase |
  
  #### Tab: Java

    

> [!WARNING]
>
> `retrieveV2()` requires `projectId()`, which replaces the removed `sessionId()`. `startTime()` remains optional—providing it speeds up retrieval but is not required.


    | Before (`RunRetrieveParams`) | After (`RunRetrieveV2Params`) | Notes |
    |---|---|---|
    | `runId()` | `runId()` | Unchanged |
    | `sessionId()` | *(removed)* | Replaced by `projectId()` |
    | `startTime()` | `startTime()` | Still optional; providing it speeds up retrieval |
    | `excludeS3StoredAttributes()` | *(removed)* | No equivalent |
    | `excludeSerialized()` | *(removed)* | No equivalent |
    | `includeMessages()` | *(removed)* | No equivalent |
    | *(not available)* | `projectId()` | **Required**—UUID of the project that owns the run |
    | *(all fields returned by default)* | `selects()` | Field projection; defaults to `["ID"]` only; field names are uppercase |
  
  #### Tab: Go

    

> [!WARNING]
>
> `GetV2()` requires `ProjectID`, which replaces the removed `SessionID`. `StartTime` remains optional—providing it speeds up retrieval but is not required.


    | Before (`RunGetParams`) | After (`RunGetV2Params`) | Notes |
    |---|---|---|
    | `runID` (positional) | `runID` (positional) | Unchanged |
    | `ExcludeS3StoredAttributes` | *(removed)* | No equivalent |
    | `ExcludeSerialized` | *(removed)* | No equivalent |
    | `IncludeMessages` | *(removed)* | No equivalent |
    | `SessionID` | *(removed)* | Replaced by `ProjectID` |
    | `StartTime` | `StartTime` | Still optional; providing it speeds up retrieval |
    | *(not available)* | `ProjectID` | **Required**—UUID of the project that owns the run |
    | *(all fields returned by default)* | `Selects` | Field projection; defaults to `["ID"]` only; field name constants are uppercase (e.g., `RunGetV2ParamsSelectName`) |
  
  #### Tab: cURL

    `run_id` remains in the URL path. All other parameters are query string values with `snake_case` names.

    

> [!WARNING]
>
> `GET /api/v2/runs/{run_id}` requires a new `project_id` query param. `start_time` remains optional—providing it speeds up retrieval but is not required.


    | Before (`GET /api/v1/runs/{run_id}` param) | After (`GET /api/v2/runs/{run_id}` param) | Notes |
    |---|---|---|
    | `run_id` (path) | `run_id` (path) | Unchanged |
    | *(not available)* | `project_id` (query) | **Required**—UUID of the project that owns the run |
    | `start_time` (query) | `start_time` (query) | Still optional; providing it speeds up retrieval |
    | *(all fields returned by default)* | `selects` (query, repeatable) | Field projection; defaults to `["ID"]` only; field names are uppercase |
  

#### Response fields

  #### Tab: Python

    Pass SCREAMING_SNAKE_CASE strings to `selects` (eg. `"ID"`, `"NAME"`, `"STATUS"`) to control which fields are populated on the returned `Run`; only selected fields are non-`None`. Default `selects` contains only `"ID"`.

    | Before (v1 `Run` attribute) | After (v2 `Run` attribute) | Notes |
    |---|---|---|
    | `run.id` | `run.id` | Unchanged; returned by default when `selects` is omitted |
    | `run.name` | `run.name` | Unchanged |
    | `run.run_type` | `run.run_type` | Values are now uppercase Literals: `"LLM"`, `"CHAIN"`, etc. |
    | `run.status` | `run.status` | Values: `"SUCCESS"`, `"ERROR"`, `"PENDING"` |
    | `run.start_time` | `run.start_time` | Unchanged |
    | `run.end_time` | `run.end_time` | Unchanged |
    | `run.error` | `run.error` | Unchanged |
    | `run.inputs` | `run.inputs` | Unchanged |
    | `run.outputs` | `run.outputs` | Unchanged |
    | `run.tags` | `run.tags` | Unchanged |
    | `run.extra` | `run.extra` | Unchanged |
    | `run.metadata` | `run.metadata` | Unchanged |
    | `run.events` | `run.events` | Unchanged |
    | `run.reference_example_id` | `run.reference_example_id` | Unchanged |
    | `run.trace_id` | `run.trace_id` | Unchanged |
    | `run.dotted_order` | `run.dotted_order` | Unchanged |
    | `run.parent_run_id` | *(removed)* | Use `run.parent_run_ids` (list of all ancestor UUIDs, root first) |
    | `run.parent_run_ids` | `run.parent_run_ids` | Unchanged |
    | `run.session_id` | `run.project_id` | Renamed; `session_id` was the project UUID |
    | `run.feedback_stats` | `run.feedback_stats` | Unchanged |
    | `run.app_path` | `run.app_path` | Unchanged |
    | `run.attachments` | `run.attachments` | v2 returns pre-signed download URLs instead of raw bytes |
    | `run.total_tokens` | `run.total_tokens` | Unchanged |
    | `run.prompt_tokens` | `run.prompt_tokens` | Unchanged |
    | `run.completion_tokens` | `run.completion_tokens` | Unchanged |
    | `run.total_cost` | `run.total_cost` | Unchanged |
    | `run.prompt_cost` | `run.prompt_cost` | Unchanged |
    | `run.completion_cost` | `run.completion_cost` | Unchanged |
    | `run.first_token_time` | `run.first_token_time` | Unchanged |
    | `run.latency` (property) | `run.latency_seconds` | Renamed; was a computed `timedelta` property, now a native `float` field |
    | `run.in_dataset` | `run.is_in_dataset` | Renamed |
    | `run.child_run_ids` | *(removed)* | Filter the trace's runs on `parent_run_ids`. See [Load a run's child runs](#load-a-runs-child-runs) |
    | `run.child_runs` | *(removed)* | Group the trace's runs by the last entry in `parent_run_ids`. See [Load a run's child runs](#load-a-runs-child-runs) |
    | `run.serialized` | *(removed)* | Use `run.manifest` |
    | `run.manifest_id` | *(removed)* | Use `run.manifest` |
    | *(not available)* | `run.is_root` | New |
    | *(not available)* | `run.manifest` | New: full manifest object (replaces `serialized` and `manifest_id`) |
    | *(not available)* | `run.error_preview` | New: truncated error snippet |
    | *(not available)* | `run.inputs_preview` | New: truncated inputs preview |
    | *(not available)* | `run.outputs_preview` | New: truncated outputs preview |
    | *(not available)* | `run.thread_id` | New: conversation thread UUID |
    | *(not available)* | `run.reference_dataset_id` | New: dataset UUID for the reference example |
    | *(not available)* | `run.share_url` | New: public share URL (only set when the run has been shared) |
    | `run.prompt_token_details` | `run.prompt_token_details.raw` | Field now wraps the dict; access `.raw` to get `dict[str, int]` (element type unchanged) |
    | `run.completion_token_details` | `run.completion_token_details.raw` | Field now wraps the dict; access `.raw` to get `dict[str, int]` (element type unchanged) |
    | `run.prompt_cost_details` | `run.prompt_cost_details.raw` | Field now wraps the dict; access `.raw` to get `dict[str, float]` (was `dict[str, Decimal]`) |
    | `run.completion_cost_details` | `run.completion_cost_details.raw` | Field now wraps the dict; access `.raw` to get `dict[str, float]` (was `dict[str, Decimal]`) |
  
  #### Tab: TypeScript

    Pass SCREAMING_SNAKE_CASE strings to `selects` (eg. `"ID"`, `"NAME"`, `"STATUS"`) to control which fields are populated on the returned `Run`. Default `selects` contains only `"ID"`.

    | Before (v1 `Run` property) | After (v2 `Run` property) | Notes |
    |---|---|---|
    | `run.id` | `run.id` | Unchanged |
    | `run.name` | `run.name` | Unchanged |
    | `run.runType` | `run.run_type` | Renamed to `snake_case`; values are now uppercase: `"LLM"`, `"CHAIN"`, etc. |
    | `run.status` | `run.status` | Values: `"SUCCESS"`, `"ERROR"`, `"PENDING"` |
    | `run.startTime` | `run.start_time` | Renamed to `snake_case` |
    | `run.endTime` | `run.end_time` | Renamed to `snake_case` |
    | `run.error` | `run.error` | Unchanged |
    | `run.inputs` | `run.inputs` | Unchanged |
    | `run.outputs` | `run.outputs` | Unchanged |
    | `run.tags` | `run.tags` | Unchanged |
    | `run.extra` | `run.extra` | Unchanged |
    | *(not available)* | `run.metadata` | New: previously accessed via `run.extra.metadata` |
    | `run.events` | `run.events` | Unchanged |
    | `run.referenceExampleId` | `run.reference_example_id` | Renamed to `snake_case` |
    | `run.traceId` | `run.trace_id` | Renamed to `snake_case` |
    | `run.dottedOrder` | `run.dotted_order` | Renamed to `snake_case` |
    | `run.parentRunId` | *(removed)* | Use `run.parent_run_ids` (list of all ancestor UUIDs, root first) |
    | `run.parentRunIds` | `run.parent_run_ids` | Renamed to `snake_case` |
    | `run.sessionId` | `run.project_id` | Renamed; `sessionId` was the project UUID |
    | `run.feedbackStats` | `run.feedback_stats` | Renamed to `snake_case` |
    | `run.appPath` | `run.app_path` | Renamed to `snake_case` |
    | `run.attachments` | `run.attachments` | v2 returns pre-signed download URLs instead of raw bytes |
    | `run.totalTokens` | `run.total_tokens` | Renamed to `snake_case` |
    | `run.promptTokens` | `run.prompt_tokens` | Renamed to `snake_case` |
    | `run.completionTokens` | `run.completion_tokens` | Renamed to `snake_case` |
    | `run.totalCost` | `run.total_cost` | Renamed to `snake_case` |
    | `run.promptCost` | `run.prompt_cost` | Renamed to `snake_case` |
    | `run.completionCost` | `run.completion_cost` | Renamed to `snake_case` |
    | `run.firstTokenTime` | `run.first_token_time` | Renamed to `snake_case` |
    | `run.latency` | `run.latency_seconds` | Renamed; was a computed property, now a native `number` field (seconds) |
    | `run.inDataset` | `run.is_in_dataset` | Renamed |
    | `run.child_run_ids` | *(removed)* | Filter the trace's runs on `parent_run_ids`. See [Load a run's child runs](#load-a-runs-child-runs) |
    | `run.child_runs` | *(removed)* | Group the trace's runs by the last entry in `parent_run_ids`. See [Load a run's child runs](#load-a-runs-child-runs) |
    | `run.serialized` | *(removed)* | Use `run.manifest` |
    | `run.manifestId` | *(removed)* | Use `run.manifest` |
    | `run.shareToken` | *(removed)* | Use `run.share_url` (full URL, only set when the run has been shared) |
    | *(not available)* | `run.is_root` | New |
    | *(not available)* | `run.manifest` | New: full manifest object (replaces `serialized` and `manifestId`) |
    | *(not available)* | `run.error_preview` | New: truncated error snippet |
    | *(not available)* | `run.inputs_preview` | New: truncated inputs preview |
    | *(not available)* | `run.outputs_preview` | New: truncated outputs preview |
    | *(not available)* | `run.thread_id` | New: conversation thread UUID |
    | *(not available)* | `run.reference_dataset_id` | New: dataset UUID for the reference example |
    | *(not available)* | `run.share_url` | New: public share URL (only set when the run has been shared) |
    | *(not available)* | `run.prompt_token_details` | New: per-category prompt token breakdown |
    | *(not available)* | `run.completion_token_details` | New: per-category completion token breakdown |
    | *(not available)* | `run.prompt_cost_details` | New: per-category prompt cost breakdown |
    | *(not available)* | `run.completion_cost_details` | New: per-category completion cost breakdown |
  
  #### Tab: Java

    Add `RunRetrieveV2Params.Select` values (eg. `Select.NAME`, `Select.STATUS`) via `.addSelect(...)` to control which fields are populated; unselected fields return empty `Optional` values. `selects()` defaults to `ID` only.

    | Before (`RunSchema` method) | After (`Run` method) | Notes |
    |---|---|---|
    | `run.id()` | `run.id()` | Unchanged |
    | `run.name()` | `run.name()` | Unchanged |
    | `run.runType()` | `run.runType()` | Values are now uppercase: `"LLM"`, `"CHAIN"`, etc. |
    | `run.status()` | `run.status()` | Values: `"SUCCESS"`, `"ERROR"`, `"PENDING"` |
    | `run.startTime()` | `run.startTime()` | Unchanged |
    | `run.endTime()` | `run.endTime()` | Unchanged |
    | `run.error()` | `run.error()` | Unchanged |
    | `run.inputs()` | `run.inputs()` | Unchanged |
    | `run.outputs()` | `run.outputs()` | Unchanged |
    | `run.tags()` | `run.tags()` | Unchanged |
    | `run.extra()` | `run.extra()` | Unchanged |
    | `run.events()` | `run.events()` | Unchanged |
    | `run.feedbackStats()` | `run.feedbackStats()` | Unchanged |
    | `run.inputsPreview()` | `run.inputsPreview()` | Unchanged |
    | `run.outputsPreview()` | `run.outputsPreview()` | Unchanged |
    | `run.referenceExampleId()` | `run.referenceExampleId()` | Unchanged |
    | `run.traceId()` | `run.traceId()` | Unchanged |
    | `run.dottedOrder()` | `run.dottedOrder()` | Unchanged |
    | `run.parentRunId()` | *(removed)* | Use `run.parentRunIds()` (list of all ancestor UUIDs, root first) |
    | `run.parentRunIds()` | `run.parentRunIds()` | Unchanged |
    | `run.sessionId()` | `run.projectId()` | Renamed; `sessionId()` returned the project UUID |
    | `run.appPath()` | `run.appPath()` | Unchanged |
    | `run.firstTokenTime()` | `run.firstTokenTime()` | Unchanged |
    | `run.totalTokens()` | `run.totalTokens()` | Unchanged |
    | `run.promptTokens()` | `run.promptTokens()` | Unchanged |
    | `run.completionTokens()` | `run.completionTokens()` | Unchanged |
    | `run.totalCost()` | `run.totalCost()` | Return type changed from `Optional<String>` to `Optional<Double>` |
    | `run.promptCost()` | `run.promptCost()` | Return type changed from `Optional<String>` to `Optional<Double>` |
    | `run.completionCost()` | `run.completionCost()` | Return type changed from `Optional<String>` to `Optional<Double>` |
    | `run.promptTokenDetails()` | `run.promptTokenDetails()` | Unchanged |
    | `run.completionTokenDetails()` | `run.completionTokenDetails()` | Unchanged |
    | `run.promptCostDetails()` | `run.promptCostDetails()` | Unchanged |
    | `run.completionCostDetails()` | `run.completionCostDetails()` | Unchanged |
    | `run.priceModelId()` | `run.priceModelId()` | Unchanged |
    | `run.inDataset()` | `run.isInDataset()` | Renamed |
    | `run.referenceDatasetId()` | `run.referenceDatasetId()` | Unchanged |
    | `run.threadId()` | `run.threadId()` | Unchanged |
    | `run.shareToken()` | *(removed)* | Use `run.shareUrl()` (full URL, only set when the run has been shared) |
    | `run.childRunIds()` | *(removed)* | No equivalent |
    | `run.directChildRunIds()` | *(removed)* | No equivalent |
    | `run.serialized()` | *(removed)* | Use `run.manifest()` |
    | `run.manifestId()` | *(removed)* | Use `run.manifest()` |
    | `run.messages()` | *(removed)* | No equivalent |
    | `run.executionOrder()` | *(removed)* | No equivalent |
    | `run.lastQueuedAt()` | *(removed)* | No equivalent |
    | `run.traceFirstReceivedAt()` | *(removed)* | No equivalent |
    | `run.traceMaxStartTime()` | *(removed)* | No equivalent |
    | `run.traceMinStartTime()` | *(removed)* | No equivalent |
    | `run.traceTier()` | *(removed)* | No equivalent |
    | `run.traceUpgrade()` | *(removed)* | No equivalent |
    | `run.ttlSeconds()` | *(removed)* | No equivalent |
    | *(not available)* | `run.attachments()` | New: pre-signed download URLs for attachments (replaces S3 URL fields) |
    | *(not available)* | `run.latencySeconds()` | New: wall-clock duration in seconds |
    | *(not available)* | `run.isRoot()` | New |
    | *(not available)* | `run.errorPreview()` | New: truncated error snippet |
    | *(not available)* | `run.manifest()` | New: full manifest, typed as `Optional<Manifest>` (replaces `serialized()` and `manifestId()`) |
    | *(not available)* | `run.metadata()` | New: metadata, typed as `Optional<Metadata>` (was derived from `extra.metadata`) |
    | *(not available)* | `run.shareUrl()` | New: public share URL (only set when the run has been shared) |
    | *(not available)* | `run.threadEvaluationTime()` | New |
  
  #### Tab: Go

    Pass `RunGetV2ParamsSelect` constants (eg. `RunGetV2ParamsSelectName`, `RunGetV2ParamsSelectStatus`) to `Selects` to control which fields are populated; unselected fields are zero-valued on the returned struct. `Selects` defaults to `ID` only.

    | Before (`RunSchema` field) | After (`Run` field) | Notes |
    |---|---|---|
    | `run.ID` | `run.ID` | Unchanged |
    | `run.Name` | `run.Name` | Unchanged |
    | `run.RunType` | `run.RunType` | Values changed to uppercase: `"LLM"`, `"CHAIN"`, etc. |
    | `run.Status` | `run.Status` | Values: `"SUCCESS"`, `"ERROR"`, `"PENDING"` |
    | `run.TraceID` | `run.TraceID` | Unchanged |
    | `run.DottedOrder` | `run.DottedOrder` | Unchanged |
    | `run.AppPath` | `run.AppPath` | Unchanged |
    | `run.StartTime` | `run.StartTime` | Unchanged |
    | `run.EndTime` | `run.EndTime` | Unchanged |
    | `run.Error` | `run.Error` | Unchanged |
    | `run.Events` | `run.Events` | Unchanged; element type is now `RunEvent` (was `map[string]interface{}`) |
    | `run.Extra` | `run.Extra` | Unchanged; type is now `interface{}` (was `map[string]interface{}`) |
    | `run.FeedbackStats` | `run.FeedbackStats` | Unchanged; element type is now `RunFeedbackStat` |
    | `run.FirstTokenTime` | `run.FirstTokenTime` | Unchanged |
    | `run.Inputs` | `run.Inputs` | Unchanged; type is now `interface{}` (was `map[string]interface{}`) |
    | `run.InputsPreview` | `run.InputsPreview` | Unchanged |
    | `run.Outputs` | `run.Outputs` | Unchanged; type is now `interface{}` (was `map[string]interface{}`) |
    | `run.OutputsPreview` | `run.OutputsPreview` | Unchanged |
    | `run.ParentRunIDs` | `run.ParentRunIDs` | Unchanged |
    | `run.PriceModelID` | `run.PriceModelID` | Unchanged |
    | `run.PromptCost` | `run.PromptCost` | Unchanged |
    | `run.PromptCostDetails` | `run.PromptCostDetails.Raw` | Field now wraps the map; access `.Raw` to get `map[string]float64` (was `map[string]string`) |
    | `run.PromptTokenDetails` | `run.PromptTokenDetails.Raw` | Field now wraps the map; access `.Raw` to get `map[string]int64` (element type unchanged) |
    | `run.PromptTokens` | `run.PromptTokens` | Unchanged |
    | `run.CompletionCost` | `run.CompletionCost` | Unchanged |
    | `run.CompletionCostDetails` | `run.CompletionCostDetails.Raw` | Field now wraps the map; access `.Raw` to get `map[string]float64` (was `map[string]string`) |
    | `run.CompletionTokenDetails` | `run.CompletionTokenDetails.Raw` | Field now wraps the map; access `.Raw` to get `map[string]int64` (element type unchanged) |
    | `run.CompletionTokens` | `run.CompletionTokens` | Unchanged |
    | `run.TotalCost` | `run.TotalCost` | Unchanged |
    | `run.TotalTokens` | `run.TotalTokens` | Unchanged |
    | `run.ReferenceDatasetID` | `run.ReferenceDatasetID` | Unchanged |
    | `run.ReferenceExampleID` | `run.ReferenceExampleID` | Unchanged |
    | `run.Tags` | `run.Tags` | Unchanged |
    | `run.ThreadID` | `run.ThreadID` | Unchanged |
    | `run.SessionID` | `run.ProjectID` | Renamed |
    | `run.InDataset` | `run.IsInDataset` | Renamed |
    | `run.ChildRunIDs` | *(removed)* | No equivalent |
    | `run.DirectChildRunIDs` | *(removed)* | No equivalent |
    | `run.ExecutionOrder` | *(removed)* | No equivalent |
    | `run.InputsS3URLs` | *(removed)* | Internal storage URL; not exposed in v2 |
    | `run.LastQueuedAt` | *(removed)* | No equivalent |
    | `run.ManifestID` | *(removed)* | Use `run.Manifest` |
    | `run.ManifestS3ID` | *(removed)* | Internal storage URL; not exposed in v2 |
    | `run.Messages` | *(removed)* | No equivalent |
    | `run.OutputsS3URLs` | *(removed)* | Internal storage URL; not exposed in v2 |
    | `run.ParentRunID` | *(removed)* | Use `run.ParentRunIDs` |
    | `run.S3URLs` | *(removed)* | Internal storage URL; not exposed in v2 |
    | `run.Serialized` | *(removed)* | Use `run.Manifest` |
    | `run.ShareToken` | *(removed)* | Use `run.ShareURL` |
    | `run.TraceFirstReceivedAt` | *(removed)* | No equivalent |
    | `run.TraceMaxStartTime` | *(removed)* | No equivalent |
    | `run.TraceMinStartTime` | *(removed)* | No equivalent |
    | `run.TraceTier` | *(removed)* | No equivalent |
    | `run.TraceUpgrade` | *(removed)* | No equivalent |
    | `run.TtlSeconds` | *(removed)* | No equivalent |
    | *(not available)* | `run.Attachments` | New: maps attachment filename to pre-signed download URL |
    | *(not available)* | `run.ErrorPreview` | New: truncated error snippet |
    | *(not available)* | `run.IsRoot` | New |
    | *(not available)* | `run.LatencySeconds` | New: wall-clock duration in seconds |
    | *(not available)* | `run.Manifest` | New: full manifest object (replaces `Serialized` and `ManifestID`) |
    | *(not available)* | `run.Metadata` | New: arbitrary user-defined JSON metadata |
    | *(not available)* | `run.ShareURL` | New: public share URL (only set when the run has been shared) |
    | *(not available)* | `run.ThreadEvaluationTime` | New |
  
  #### Tab: cURL

    Pass SCREAMING_SNAKE_CASE strings as repeated `selects` query parameters (eg. `selects=NAME&selects=STATUS`) to control which fields are populated. Default `selects` contains only `"ID"`.

    | Before (v1 response field) | After (v2 response field) | Notes |
    |---|---|---|
    | `id` | `id` | Unchanged |
    | `name` | `name` | Unchanged |
    | `run_type` | `run_type` | Values changed to uppercase: `"LLM"`, `"CHAIN"`, etc. |
    | `status` | `status` | Values: `"SUCCESS"`, `"ERROR"`, `"PENDING"` |
    | `trace_id` | `trace_id` | Unchanged |
    | `dotted_order` | `dotted_order` | Unchanged |
    | `app_path` | `app_path` | Unchanged |
    | `start_time` | `start_time` | Unchanged |
    | `end_time` | `end_time` | Unchanged |
    | `error` | `error` | Unchanged |
    | `events` | `events` | Unchanged |
    | `extra` | `extra` | Unchanged |
    | `feedback_stats` | `feedback_stats` | Unchanged |
    | `first_token_time` | `first_token_time` | Unchanged |
    | `inputs` | `inputs` | Unchanged |
    | `inputs_preview` | `inputs_preview` | Unchanged |
    | `outputs` | `outputs` | Unchanged |
    | `outputs_preview` | `outputs_preview` | Unchanged |
    | `parent_run_ids` | `parent_run_ids` | Unchanged |
    | `price_model_id` | `price_model_id` | Unchanged |
    | `prompt_cost` | `prompt_cost` | Unchanged |
    | `prompt_cost_details` | `prompt_cost_details.raw` | Field now wraps the object; read `.raw` for the same `{category: cost}` mapping, now with numeric values (was strings) |
    | `prompt_token_details` | `prompt_token_details.raw` | Field now wraps the object; read `.raw` for the same `{category: count}` mapping (values unchanged) |
    | `prompt_tokens` | `prompt_tokens` | Unchanged |
    | `completion_cost` | `completion_cost` | Unchanged |
    | `completion_cost_details` | `completion_cost_details.raw` | Field now wraps the object; read `.raw` for the same `{category: cost}` mapping, now with numeric values (was strings) |
    | `completion_token_details` | `completion_token_details.raw` | Field now wraps the object; read `.raw` for the same `{category: count}` mapping (values unchanged) |
    | `completion_tokens` | `completion_tokens` | Unchanged |
    | `total_cost` | `total_cost` | Unchanged |
    | `total_tokens` | `total_tokens` | Unchanged |
    | `reference_dataset_id` | `reference_dataset_id` | Unchanged |
    | `reference_example_id` | `reference_example_id` | Unchanged |
    | `tags` | `tags` | Unchanged |
    | `thread_id` | `thread_id` | Unchanged |
    | `session_id` | `project_id` | Renamed |
    | `in_dataset` | `is_in_dataset` | Renamed |
    | `child_run_ids` | *(removed)* | No equivalent |
    | `direct_child_run_ids` | *(removed)* | No equivalent |
    | `execution_order` | *(removed)* | No equivalent |
    | `inputs_s3_urls` | *(removed)* | Internal storage URL; not exposed in v2 |
    | `last_queued_at` | *(removed)* | No equivalent |
    | `manifest_id` | *(removed)* | Use `manifest` |
    | `manifest_s3_id` | *(removed)* | Internal storage URL; not exposed in v2 |
    | `messages` | *(removed)* | No equivalent |
    | `outputs_s3_urls` | *(removed)* | Internal storage URL; not exposed in v2 |
    | `parent_run_id` | *(removed)* | Use `parent_run_ids` |
    | `s3_urls` | *(removed)* | Internal storage URL; not exposed in v2 |
    | `serialized` | *(removed)* | Use `manifest` |
    | `share_token` | *(removed)* | Use `share_url` |
    | `trace_first_received_at` | *(removed)* | No equivalent |
    | `trace_max_start_time` | *(removed)* | No equivalent |
    | `trace_min_start_time` | *(removed)* | No equivalent |
    | `trace_tier` | *(removed)* | No equivalent |
    | `trace_upgrade` | *(removed)* | No equivalent |
    | `ttl_seconds` | *(removed)* | No equivalent |
    | *(not available)* | `attachments` | New: maps attachment filename to pre-signed download URL |
    | *(not available)* | `error_preview` | New: truncated error snippet |
    | *(not available)* | `is_root` | New |
    | *(not available)* | `latency_seconds` | New: wall-clock duration in seconds |
    | *(not available)* | `manifest` | New: full manifest object (replaces `serialized` and `manifest_id`) |
    | *(not available)* | `metadata` | New: previously nested under `extra.metadata` |
    | *(not available)* | `share_url` | New: public share URL (only set when the run has been shared) |
    | *(not available)* | `thread_evaluation_time` | New |
  

### Examples

#### Fetch a single run by ID

  #### Tab: Python

    `runs.retrieve` requires an additional `project_id` (UUID) parameter that `read_run` did not need. It also accepts an optional `start_time`—providing it speeds up retrieval but is not required. Resolve the project UUID via `client.aread_project()` first.

  #### Tab: Before

```python Before
from langsmith import Client

client = Client()
run_id = "<run-id>"
run = client.read_run(run_id)
```

  
  #### Tab: After

```python After
from langsmith import Client

async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    run_id = "<run-id>"
    start_time = "2026-06-01T12:00:00Z"  # Optional, but speeds up retrieval
    run = await client.runs.retrieve(
        run_id=run_id,
        project_id=str(project.id),
        start_time=start_time,
    )

asyncio.run(main())
```

  

  
  #### Tab: TypeScript

    `client.runs.retrieve` requires an additional `project_id` (UUID) parameter that `readRun` did not need. It also accepts an optional `start_time`—providing it speeds up retrieval but is not required. Resolve the project UUID via `client.readProject()` first.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Java

    `retrieveV2()` requires an additional `projectId()` (UUID) parameter that `client.runs().retrieve()` did not need. It also accepts an optional `startTime()`—providing it speeds up retrieval but is not required. Resolve the project UUID via `client.sessions().list()` first.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Go

    `GetV2()` requires an additional `ProjectID` (UUID) parameter that `client.Runs.Get()` did not need. It also accepts an optional `StartTime`—providing it speeds up retrieval but is not required. Resolve the project UUID via `client.Sessions.List()` first.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: cURL

    `GET /api/v2/runs/{run_id}` requires an additional `project_id` (UUID) query parameter that `GET /api/v1/runs/{run_id}` did not need. It also accepts an optional `start_time`—providing it speeds up retrieval but is not required. Resolve the project UUID via a `GET /api/v1/sessions` request first.

  #### Tab: Before

```bash
RUN_ID="<run-id>"

curl "https://api.smith.langchain.com/api/v1/runs/$RUN_ID" \
  -H "x-api-key: $LANGSMITH_API_KEY"
```
  
  #### Tab: After

    
  

  

#### Selecting fields

  #### Tab: Python

    `read_run` returns a full run object with no selection needed. `runs.retrieve` returns only `id` by default—pass `selects=[...]` to request more.

    
      #### Tab: Before

```python Before
from langsmith import Client

client = Client()
run_id = "<run-id>"
run = client.read_run(run_id=run_id)
print(run.name, run.status, run.total_tokens)
```

      
      #### Tab: After

```python After
from langsmith import Client

async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    run_id = "<run-id>"
    start_time = "2026-06-01T12:00:00Z"  # Optional, but speeds up retrieval
    run = await client.runs.retrieve(
        run_id=run_id,
        project_id=str(project.id),
        start_time=start_time,
        selects=["NAME", "STATUS", "TOTAL_TOKENS"],
    )
    print(run.name, run.status, run.total_tokens)

asyncio.run(main())
```

      
    
  
  #### Tab: TypeScript

    `readRun` returns a full run object with no selection needed. `client.runs.retrieve` returns only `id` by default—pass `selects: [...]` to request more.

    
      #### Tab: Before

        
      
      #### Tab: After

        
      
    
  
  #### Tab: Java

    `.retrieve()` returns a full run object with no selection needed. `.retrieveV2()` returns only `id` by default—call `.addSelect(...)` for each field you need.

    
      #### Tab: Before

        
      
      #### Tab: After

        
      
    
  
  #### Tab: Go

    `Get` returns a full run struct with no selection needed. `GetV2` returns only `ID` by default—pass `Selects` with the fields you need.

    
      #### Tab: Before

        
      
      #### Tab: After

        
      
    
  
  #### Tab: cURL

    `GET /api/v1/runs/{run_id}` returns a full run object with no selection needed. `GET /api/v2/runs/{run_id}` returns only `id` by default—pass `selects` query parameters for the fields you need.

    
      #### Tab: Before

```bash
RUN_ID="<run-id>"

curl "https://api.smith.langchain.com/api/v1/runs/$RUN_ID" \
  -H "x-api-key: $LANGSMITH_API_KEY"
```
      
      #### Tab: After

        
      
    
  

#### Handle a not-found run

  #### Tab: Python

    `read_run` raised `LangSmithNotFoundError` from `langsmith.utils` for a missing run. `runs.retrieve` raises `NotFoundError` from `langsmith` instead.

    
      #### Tab: Before

        
      
      #### Tab: After

        
      
    
  
  #### Tab: TypeScript

    `client.runs.retrieve` raises `NotFoundError` for a missing run.

    
      #### Tab: Before

        
      
      #### Tab: After

        
      
    
  
  #### Tab: Java

    `.retrieve()` and `.retrieveV2()` both raise `com.langchain.smith.errors.NotFoundException`—unchanged, since the Java SDK was already Stainless-generated before SmithDB.

    
      #### Tab: Before

        
      
      #### Tab: After

        
      
    
  
  #### Tab: Go

    `Get` and `GetV2` both return a `*langsmith.Error` you can inspect with `errors.As`—unchanged, since the Go SDK was already Stainless-generated before SmithDB. Check `StatusCode` for `404`.

    
      #### Tab: Before

        
      
      #### Tab: After

        
      
    
  
  #### Tab: cURL

    Both `GET /api/v1/runs/{run_id}` and `GET /api/v2/runs/{run_id}` return HTTP 404 for a missing run. Check the response status code.

    
      #### Tab: Before

        
      
      #### Tab: After

        
      
    
  

#### Load a run's child runs

The `load_child_runs` flag and the nested `child_runs` field are removed. Fetch every run in the trace with `traces.list_runs`, then filter on `parent_run_ids`, which holds each run's full ancestor chain, root first and closest parent last.

  #### Tab: Python

    Replace `read_run(run_id, load_child_runs=True)` with `client.traces.list_runs`.

    
      #### Tab: Before

        
      
      #### Tab: After

        
      
    
  
  #### Tab: TypeScript

    Replace the `loadChildRuns` option with `client.traces.listRuns`.

    
      #### Tab: Before

        
      
      #### Tab: After

        
      
    
  
  #### Tab: Java

    Nothing to migrate: the Java SDK never loaded child runs in one call, so use `client.traces().listRuns()` to walk a trace's runs.
  
  #### Tab: Go

    Nothing to migrate: the Go SDK never loaded child runs in one call, so use `client.Traces.ListRuns()` to walk a trace's runs.
  
  #### Tab: cURL

    Nothing to migrate: `GET /api/v1/runs/{run_id}` never returned child runs, so use `GET /api/v2/traces/{trace_id}/runs` to walk a trace's runs.

  


<!-- Inlined Snippet: runs-geturl-before-py.mdx -->
```python Before
from langsmith import Client

client = Client()
run_id = "<run-id>"
run = client.read_run(run_id)
url = client.get_run_url(run=run)
print(url)
```

<!-- Inlined Snippet: runs-geturl-after-py.mdx -->
```python After
from langsmith import Client

async def main():
    client = Client()
    run_id = "<run-id>"
    run = client.read_run(run_id)
    response = await client.runs.get_url(
        run.id,
        project_id=str(run.session_id),
        trace_id=str(run.trace_id),
        start_time=run.start_time.isoformat(),  # Optional, but speeds up retrieval
    )
    print(response.url)

asyncio.run(main())
```

<!-- Inlined Snippet: runs-geturl-after-sh.mdx -->
```bash
RUN_ID="<run-id>"

RUN=$(curl -s "https://api.smith.langchain.com/api/v1/runs/$RUN_ID" \
  -H "x-api-key: $LANGSMITH_API_KEY")
PROJECT_ID=$(echo "$RUN" | jq -r '.session_id')
TRACE_ID=$(echo "$RUN" | jq -r '.trace_id')
START_TIME=$(echo "$RUN" | jq -r '.start_time') # Optional, but speeds up retrieval

curl "https://api.smith.langchain.com/api/v2/runs/$RUN_ID/url?project_id=$PROJECT_ID&trace_id=$TRACE_ID&start_time=$START_TIME" \
  -H "x-api-key: $LANGSMITH_API_KEY"
```

## Runs: get URL

Get the LangSmith UI URL for a run.

### Main changes

#### Method name

  #### Tab: Python

    | Before | After |
    |--------|-------|
    | `client.get_run_url()` | `client.runs.get_url()` |

    

> [!NOTE]
>
> `client.runs.get_url()` is now async. Call it with `await`.


    See the [reference](https://reference.langchain.com/python/langsmith/_openapi_client/resources/runs/RunsResource/get_url) for the full parameter list.
  
  #### Tab: TypeScript

    | Before | After |
    |--------|-------|
    | `client.getRunUrl()` | `client.runs.getURL()` |

    See the [reference](https://reference.langchain.com/javascript/langsmith/_openapi_client/Langsmith/Runs/getURL) for the full parameter list.
  
  #### Tab: Java

    

> [!NOTE]
>
> The Java SDK has no legacy equivalent for retrieving a run's UI URL.


    | Before | After |
    |--------|-------|
    | *(no legacy method)* | `client.runs().getUrl()` |

    See the [reference](https://javadoc.io/doc/com.langchain.smith/langsmith-java/latest/com/langchain/smith/services/blocking/RunService.html) for the full parameter list.
  
  #### Tab: Go

    

> [!NOTE]
>
> The Go SDK has no legacy equivalent for retrieving a run's UI URL.


    | Before | After |
    |--------|-------|
    | *(no legacy method)* | `client.Runs.GetURL()` |

    See the [reference](https://pkg.go.dev/github.com/langchain-ai/langsmith-go#RunService.GetURL) for the full parameter list.
  
  #### Tab: cURL

    

> [!NOTE]
>
> The REST API has no legacy equivalent for retrieving a run's UI URL.


    | Before | After |
    |--------|-------|
    | *(no legacy endpoint)* | `GET /api/v2/runs/{run_id}/url` |
  

#### Parameters

  #### Tab: Python

    

> [!WARNING]
>
> `runs.get_url` needs the run's `project_id` and `trace_id` passed directly, instead of resolving them from a `run` object or a `project_name`/`project_id` fallback.


    | Before (`get_run_url`) | After (`runs.get_url`) | Notes |
    |---|---|---|
    | `run` (`RunBase`) | *(removed)* | No full run object needed; pass its identifying fields individually |
    | `project_name` | *(removed)* | No equivalent; resolve the project UUID yourself if you only have its name |
    | `project_id` | `project_id` | **Required**; still the project (session) UUID |
    | *(not available)* | `run_id` | **Required** (positional); the run's ID, previously read from `run.id` |
    | *(not available)* | `trace_id` | **Required**; the run's trace UUID, previously read from `run` internally |
    | *(not available)* | `start_time` | Optional; run's start time (RFC3339); omit if unknown |
  
  #### Tab: TypeScript

    

> [!WARNING]
>
> `client.runs.getURL` needs the run's `project_id` and `trace_id` passed directly, instead of resolving them from a `run` object or a `runId` fallback.


    | Before (`getRunUrl`) | After (`getURL`) | Notes |
    |---|---|---|
    | `run` (`Run`) | *(removed)* | No full run object needed; pass its identifying fields individually |
    | `runId` | `runID` (positional) | Unchanged purpose; now the first positional argument instead of a named option |
    | `projectOpts` | *(removed)* | No equivalent; resolve the project UUID yourself |
    | *(not available)* | `project_id` | **Required**; `snake_case`; the project (session) UUID |
    | *(not available)* | `trace_id` | **Required**; `snake_case`; the run's trace UUID |
    | *(not available)* | `start_time` | Optional; `snake_case`; run's start time (RFC3339); omit if unknown |
  
  #### Tab: Java

    | Before | After (`RunGetUrlParams`) | Notes |
    |---|---|---|
    | *(no legacy method)* | `runId` | **Required** (positional); the run's ID |
    | *(no legacy method)* | `projectId()` | **Required**; the project (session) UUID |
    | *(no legacy method)* | `traceId()` | **Required**; the run's trace UUID |
    | *(no legacy method)* | `startTime()` | Optional; run's start time (RFC3339); omit if unknown |
  
  #### Tab: Go

    | Before | After (`RunGetURLParams`) | Notes |
    |---|---|---|
    | *(no legacy method)* | `runID` (positional) | **Required**; the run's ID |
    | *(no legacy method)* | `ProjectID` | **Required**; the project (session) UUID |
    | *(no legacy method)* | `TraceID` | **Required**; the run's trace UUID |
    | *(no legacy method)* | `StartTime` | Optional; run's start time (RFC3339); omit if unknown |
  
  #### Tab: cURL

    | Before | After (`GET /api/v2/runs/{run_id}/url`) | Notes |
    |---|---|---|
    | *(no legacy endpoint)* | `run_id` (path) | **Required** |
    | *(no legacy endpoint)* | `project_id` (query) | **Required**; the project (session) UUID |
    | *(no legacy endpoint)* | `trace_id` (query) | **Required**; the run's trace UUID |
    | *(no legacy endpoint)* | `start_time` (query) | Optional; run's start time (RFC3339); omit if unknown |
  

#### Response

  #### Tab: Python

    | Before | After | Notes |
    |---|---|---|
    | `str` (the URL) | `RunGetURLResponse.url` | Response is now wrapped in an object; read the `.url` attribute |
  
  #### Tab: TypeScript

    | Before | After | Notes |
    |---|---|---|
    | `string` (the URL) | `RunGetURLResponse.url` | Response is now wrapped in an object; read the `.url` property |
  
  #### Tab: Java

    | Before | After | Notes |
    |---|---|---|
    | *(no legacy method)* | `RunGetUrlResponse.url`() | Returns `Optional<String>` |
  
  #### Tab: Go

    | Before | After | Notes |
    |---|---|---|
    | *(no legacy method)* | `RunGetURLResponse.URL` | Returns a `string` |
  
  #### Tab: cURL

    | Before | After | Notes |
    |---|---|---|
    | *(no legacy endpoint)* | `{"url": "..."}` | JSON object with a single `url` field |
  

### Examples

#### Get a run's URL

  #### Tab: Python

    `get_run_url` accepts a full run object. `runs.get_url` is async and needs the run's `project_id` (its `session_id` under the old v1 schema) and `trace_id` passed individually, with `start_time` optional.

    
      #### Tab: Before

        
      
      #### Tab: After

        
      
    
  
  #### Tab: TypeScript

    `getRunUrl` accepts a full run object. `runs.getURL` needs the run's `project_id` (its `session_id` under the old v1 schema) and `trace_id` passed individually, with `start_time` optional.

    
      #### Tab: Before

        
      
      #### Tab: After

        
      
    
  
  #### Tab: Java

    The Java SDK has no legacy equivalent. `runs().getUrl` needs the run's `projectId()` and `traceId()`, with `startTime()` optional.

    
  
  #### Tab: Go

    The Go SDK has no legacy equivalent. `Runs.GetURL` needs the run's `ProjectID` and `TraceID`, with `StartTime` optional.

    
  
  #### Tab: cURL

    The REST API has no legacy equivalent. `GET /api/v2/runs/{run_id}/url` needs the run's `project_id` and `trace_id` query parameters, with `start_time` optional.

    

  


<!-- Inlined Snippet: runs-add-to-queue-before-py.mdx -->
```python Before
from langsmith import Client

client = Client()
queue_id = "<queue-id>"
runs = list(client.list_runs(project_name="default", limit=5))
client.add_runs_to_annotation_queue(queue_id, run_ids=[run.id for run in runs])
```

<!-- Inlined Snippet: runs-add-to-queue-after-py.mdx -->
```python After
from langsmith import Client

client = Client()
queue_id = "<queue-id>"
runs = list(client.list_runs(project_name="default", limit=5))
client.add_runs_to_annotation_queue(
    queue_id,
    runs=[
        {
            "run_id": run.id,
            "session_id": run.session_id,
            "start_time": run.start_time,
        }
        for run in runs
    ],
)
```

<!-- Inlined Snippet: runs-add-to-queue-before-sh.mdx -->
```bash
QUEUE_ID="<queue-id>"
RUN_ID="<run-id>"

curl -X POST "https://api.smith.langchain.com/api/v1/annotation-queues/$QUEUE_ID/runs" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "[\"$RUN_ID\"]"
```

<!-- Inlined Snippet: runs-add-to-queue-after-sh.mdx -->
```bash
QUEUE_ID="<queue-id>"
RUN_ID="<run-id>"
PROJECT_ID="<project-id>"
START_TIME="2026-06-01T12:00:00Z"

curl -X POST "https://api.smith.langchain.com/api/v1/annotation-queues/$QUEUE_ID/runs/by-key" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "[{\"run_id\": \"$RUN_ID\", \"session_id\": \"$PROJECT_ID\", \"start_time\": \"$START_TIME\"}]"
```

## Annotation queues: add runs

Add runs to an annotation queue. The SmithDB-backed path takes each run's full lookup key—its ID plus the `session_id` (project UUID) and `start_time` partition keys—so the run can be located directly instead of scanned for.


> [!NOTE]
>
> This method stays on the existing client, not the new `runs` v2 client, so the [Exceptions](lc:langsmith/smithdb-sdk-migration#exceptions) table above does not apply—error handling is unchanged.


### Main changes

#### Method name

  #### Tab: Python

    No change—`client.add_runs_to_annotation_queue()`. The SmithDB path is selected by the parameters you pass (see Inputs below).

    See the [reference](https://reference.langchain.com/python/langsmith/client/Client/add_runs_to_annotation_queue) for the full parameter list.
  
  #### Tab: TypeScript

    No change—`client.addRunsToAnnotationQueue()`. The SmithDB path is selected by the argument you pass (see Inputs below).

    See the [reference](https://reference.langchain.com/javascript/langsmith/client/Client/addRunsToAnnotationQueue) for the full parameter list.
  
  #### Tab: Java

    | Before | After |
    |--------|-------|
    | `client.annotationQueues().runs().create()` | `client.annotationQueues().runs().createByKey()` |

    See the [reference](https://javadoc.io/doc/com.langchain.smith/langsmith-java/latest/com/langchain/smith/services/blocking/annotationqueues/RunService.html) for the full parameter list.
  
  #### Tab: Go

    | Before | After |
    |--------|-------|
    | `client.AnnotationQueues.Runs.New()` | `client.AnnotationQueues.Runs.NewByKey()` |

    See the [reference](https://pkg.go.dev/github.com/langchain-ai/langsmith-go#AnnotationQueueRunService.NewByKey) for the full parameter list.
  
  #### Tab: cURL

    | Before | After |
    |--------|-------|
    | `POST /api/v1/annotation-queues/{queue_id}/runs` | `POST /api/v1/annotation-queues/{queue_id}/runs/by-key` |

    See the [API doc](https://docs.langchain.com/langsmith/smith-api/annotation-queues/add-runs-to-annotation-queue-by-key) for the full parameter list.
  

#### Inputs

  #### Tab: Python

    

> [!WARNING]
>
> The SmithDB path needs each run's `session_id` (project UUID) and `start_time` in addition to its `run_id`. These are already present on the run objects you fetch (for example from `client.list_runs()`).


    | Before (`run_ids`) | After (`runs`) | Notes |
    |---|---|---|
    | `run_ids: list[UUID \| str]` | *(deprecated)* | Legacy path. Still works and hits `/runs`, resolving each run server-side. Will be removed in a future release |
    | *(not available)* | `runs: Sequence[RunKey]` | **New preferred.** Each `RunKey` is a `TypedDict` with `run_id`, `session_id`, and `start_time` |

    Provide exactly one of `runs` or `run_ids`; passing both raises a `LangSmithUserError`.
  
  #### Tab: TypeScript

    

> [!WARNING]
>
> The SmithDB path needs each run's `sessionId` (project UUID) and `startTime` in addition to its `runId`. These are already present on the run objects you fetch (for example from `client.listRuns()`).


    | Before (`string[]`) | After (`RunKey[]`) | Notes |
    |---|---|---|
    | `runs: string[]` | *(deprecated)* | Legacy path (array of run-ID strings). Still works and hits `/runs`. Will be removed in a future release |
    | *(not available)* | `runs: RunKey[]` | **New preferred.** Each `RunKey` is `{ runId, sessionId, startTime }`; `startTime` accepts a `Date`, epoch ms, or ISO string |

    Both shapes are the same positional second argument; the SDK selects the SmithDB path when you pass `RunKey[]`.
  
  #### Tab: Java

    | Before (`RunCreateParams`) | After (`RunCreateByKeyParams`) | Notes |
    |---|---|---|
    | `.bodyOfRunsUuidArray(List<String>)` | *(removed)* | Legacy body; run IDs only |
    | *(not available)* | `.addBody(RunCreateByKeyParams.Body)` | Each `Body` has `runId`, `sessionId`, and `startTime` |
    | `.queueId(String)` | `.queueId(String)` | Unchanged |
    | `.extendTraceRetention(Boolean)` | `.extendTraceRetention(Boolean)` | Unchanged optional query param |
  
  #### Tab: Go

    | Before (`AnnotationQueueRunNewParams`) | After (`AnnotationQueueRunNewByKeyParams`) | Notes |
    |---|---|---|
    | `Body: AnnotationQueueRunNewParamsBodyRunsUuidArray` (`[]string`) | *(removed)* | Legacy body; run IDs only |
    | *(not available)* | `Body: []AnnotationQueueRunNewByKeyParamsBody` | Each has `RunID`, `SessionID`, and `StartTime` |
    | *(not available)* | `ExtendTraceRetention` | Optional query param |
  
  #### Tab: cURL

    

> [!WARNING]
>
> The `/runs/by-key` request body is an array of objects, not an array of ID strings. Each object needs `run_id`, `session_id` (project UUID), and `start_time` (RFC3339).


    | Before (`POST /runs` body) | After (`POST /runs/by-key` body) | Notes |
    |---|---|---|
    | `["<run-id>", ...]` | `[{"run_id", "session_id", "start_time"}]` | `session_id` is the project UUID; `start_time` is RFC3339 |
    | `?extend_trace_retention` (query) | `?extend_trace_retention` (query) | Unchanged optional query param |
  

#### Response

  #### Tab: Python

    No change. Both `run_ids=` and `runs=` return `None`.
  
  #### Tab: TypeScript

    No change. Both shapes resolve to `void`.
  
  #### Tab: Java

    `createByKey()` returns `List<RunCreateByKeyResponse>`—the same shape `create()` returned, with `id()`, `queueId()`, `runId()`, `addedAt()`, and `lastReviewedTime()`.
  
  #### Tab: Go

    `NewByKey()` returns `*[]AnnotationQueueRunNewByKeyResponse`—the same shape `New()` returned, with `ID`, `QueueID`, `RunID`, `AddedAt`, and `LastReviewedTime`.
  
  #### Tab: cURL

    No change. `POST /runs/by-key` returns the array of created queue-run records (`id`, `queue_id`, `run_id`, `added_at`, `last_reviewed_time`), the same shape as `POST /runs`.
  

### Examples

#### Add runs to a queue

  #### Tab: Python

    `run_ids=` takes a plain list of run IDs. `runs=` takes each run's full lookup key—read `run_id`, `session_id`, and `start_time` off the run objects you already have.

    
      #### Tab: Before

        
      
      #### Tab: After

        
      
    
  
  #### Tab: TypeScript

    Pass an array of run-ID strings for the legacy path, or an array of `RunKey` objects (`runId`, `sessionId`, `startTime`) built from the run objects you already have.

    
      #### Tab: Before

        
      
      #### Tab: After

        
      
    
  
  #### Tab: Java

    `create()` takes run IDs via `bodyOfRunsUuidArray`. `createByKey()` takes a `Body` per run with `runId`, `sessionId`, and `startTime`.

    
      #### Tab: Before

        
      
      #### Tab: After

        
      
    
  
  #### Tab: Go

    `New()` takes run IDs via `AnnotationQueueRunNewParamsBodyRunsUuidArray`. `NewByKey()` takes an `AnnotationQueueRunNewByKeyParamsBody` per run with `RunID`, `SessionID`, and `StartTime`.

    
      #### Tab: Before

        
      
      #### Tab: After

        
      
    
  
  #### Tab: cURL

    `POST /runs` takes an array of run-ID strings. `POST /runs/by-key` takes an array of objects, each with `run_id`, `session_id`, and `start_time`.

    
      #### Tab: Before

        
      
      #### Tab: After

        

      
    
  


<!-- Inlined Snippet: public-runs-before-py.mdx -->
```python
# Share a trace.
share_url = client.share_run(run_id)

# Read the shared runs and one specific run.
runs = list(client.list_shared_runs(share_token))
run = client.read_shared_run(share_token, run_id=run_id)

# Check whether the run is shared.
share_url = client.read_run_shared_link(run_id)

# Remove public access.
client.unshare_run(run_id)
```

<!-- Inlined Snippet: public-runs-after-py.mdx -->
```python
PUBLIC_RUN_SELECTS = ["ID", "NAME", "RUN_TYPE", "STATUS", "START_TIME"]

# Share a trace.
share = await client.runs.share.create(
    run_id,
    session_id=project_id,
    trace_id=trace_id,
)
if not share.share_token:
    raise RuntimeError("The server did not return a share token")
share_token = share.share_token

# Query the public trace and use its stored start time for a point read.
response = await client.public.runs.query(
    share_token,
    selects=PUBLIC_RUN_SELECTS,
)
runs = response.items
item = next(run for run in runs if str(run.id) == run_id)
run = await client.public.runs.retrieve(
    run_id,
    share_token=share_token,
    selects=PUBLIC_RUN_SELECTS,
    start_time=item.start_time,
)

# Retrieve the deployment-aware public URL for an authenticated run.
authenticated_run = await client.runs.retrieve(
    run_id,
    project_id=project_id,
    start_time=item.start_time,
    selects=["SHARE_URL"],
)
share_url = authenticated_run.share_url

# Remove public access by root trace ID.
await client.runs.share.delete(trace_id, session_id=project_id)
```

<!-- Inlined Snippet: public-runs-before-sh.mdx -->
```bash
# Share a run.
curl --request PUT \
  "$API_URL/api/v1/runs/$RUN_ID/share" \
  --header "X-API-Key: $LANGSMITH_API_KEY"

# Query the public trace and retrieve one public run.
curl --request POST \
  "$API_URL/api/v1/public/$SHARE_TOKEN/runs/query" \
  --header "Content-Type: application/json" \
  --data '{}'
curl "$API_URL/api/v1/public/$SHARE_TOKEN/run/$RUN_ID"

# Read the share state, then remove public access.
curl "$API_URL/api/v1/runs/$RUN_ID/share" \
  --header "X-API-Key: $LANGSMITH_API_KEY"
curl --request DELETE \
  "$API_URL/api/v1/runs/$RUN_ID/share" \
  --header "X-API-Key: $LANGSMITH_API_KEY"
```

<!-- Inlined Snippet: public-runs-after-sh.mdx -->
```bash
# Share a trace.
curl --request POST \
  "$API_URL/api/v2/runs/$RUN_ID/share" \
  --header "X-API-Key: $LANGSMITH_API_KEY" \
  --header "Content-Type: application/json" \
  --data "{\"session_id\":\"$PROJECT_ID\",\"trace_id\":\"$TRACE_ID\"}"

# Query the public trace.
curl --request POST \
  "$API_URL/api/v2/public/$SHARE_TOKEN/runs/query" \
  --header "Content-Type: application/json" \
  --data '{"selects":["ID","NAME","RUN_TYPE","STATUS","START_TIME"]}'

# Retrieve one public run using its exact start time from the query response.
curl --get "$API_URL/api/v2/public/$SHARE_TOKEN/run/$RUN_ID" \
  --data-urlencode "start_time=$START_TIME" \
  --data-urlencode "selects=ID" \
  --data-urlencode "selects=NAME" \
  --data-urlencode "selects=RUN_TYPE" \
  --data-urlencode "selects=STATUS" \
  --data-urlencode "selects=START_TIME"

# Retrieve the deployment-aware public URL for an authenticated run.
curl --get "$API_URL/api/v2/runs/$RUN_ID" \
  --header "X-API-Key: $LANGSMITH_API_KEY" \
  --data-urlencode "project_id=$PROJECT_ID" \
  --data-urlencode "start_time=$START_TIME" \
  --data-urlencode "selects=SHARE_URL"

# Remove public access by root trace ID.
curl --request DELETE \
  "$API_URL/api/v2/runs/$TRACE_ID/share" \
  --header "X-API-Key: $LANGSMITH_API_KEY" \
  --header "Content-Type: application/json" \
  --data "{\"session_id\":\"$PROJECT_ID\"}"
```

## Share and read public runs

Share a trace, remove its public access, or read the runs in a publicly shared trace. The v2 methods use explicit SmithDB coordinates and return select-driven run objects.

Public read methods do not require a LangSmith API key. Treat the share token as a secret because anyone with the token can read the shared trace.

### Main changes

#### Method names

  #### Tab: Python

    | Before | After |
    |---|---|
    | `client.share_run()` | `client.runs.share.create()` |
    | `client.unshare_run()` | `client.runs.share.delete()` |
    | `client.list_shared_runs()` | `client.public.runs.query()` |
    | `client.read_shared_run()` | `client.public.runs.retrieve()` |
    | `client.read_run_shared_link()` | `client.runs.retrieve(selects=["SHARE_URL"])` |

    

> [!NOTE]
>
> The v2 resource methods are async. Call them with `await`.


  
  #### Tab: TypeScript

    | Before | After |
    |---|---|
    | `client.shareRun()` | `client.runs.share.create()` |
    | `client.unshareRun()` | `client.runs.share.delete()` |
    | `client.listSharedRuns()` | `client.public.runs.query()` |
    | `client.listSharedRuns({ runIds: [...] })` | `client.public.runs.retrieve()` |
    | `client.readRunSharedLink()` | `client.runs.retrieve({ selects: ["SHARE_URL"] })` |

    TypeScript did not have a direct equivalent of Python's `read_shared_run`. Filtered `listSharedRuns` calls migrate to the point-read method.
  
  #### Tab: Java

    The Java SDK has no legacy convenience methods to migrate. Use [`ShareService`](https://javadoc.io/doc/com.langchain.smith/langsmith-java/latest/com/langchain/smith/services/blocking/runs/ShareService.html) and the public [`RunService`](https://javadoc.io/doc/com.langchain.smith/langsmith-java/latest/com/langchain/smith/services/blocking/public_/RunService.html) for v2 access. Kotlin uses the Java SDK; there is no separate Kotlin reference site.
  
  #### Tab: Go

    The Go SDK has no legacy convenience methods to migrate. Use [`RunShareService`](https://pkg.go.dev/github.com/langchain-ai/langsmith-go#RunShareService) and [`PublicRunService`](https://pkg.go.dev/github.com/langchain-ai/langsmith-go#PublicRunService) for v2 access.
  
  #### Tab: cURL

    | Operation | Before | After |
    |---|---|---|
    | Share | `PUT /api/v1/runs/{run_id}/share` | `POST /api/v2/runs/{run_id}/share` |
    | Unshare | `DELETE /api/v1/runs/{run_id}/share` | `DELETE /api/v2/runs/{trace_id}/share` |
    | Query public runs | `POST /api/v1/public/{share_token}/runs/query` | `POST /api/v2/public/{share_token}/runs/query` |
    | Retrieve a public run | `GET /api/v1/public/{share_token}/run/{run_id}` | `GET /api/v2/public/{share_token}/run/{run_id}` |
    | Read share state | `GET /api/v1/runs/{run_id}/share` | `GET /api/v2/runs/{run_id}?selects=SHARE_URL` |

    The legacy `GET /api/v1/public/{share_token}/run` endpoint without a run ID has no direct v2 equivalent.
  

#### Share and unshare parameters

  #### Tab: Python

    - `runs.share.create` takes the run ID as its positional argument. Pass `session_id` (the tracing project UUID) and `trace_id` (the root trace UUID).
    - `runs.share.delete` takes the root trace ID, not an arbitrary child run ID. Pass the tracing project UUID as `session_id`.
    - `share_id` is removed. The server generates the share token.
  
  #### Tab: TypeScript

    - `runs.share.create` takes the run ID as its positional argument. Pass `session_id` and the root `trace_id` in the options object.
    - `runs.share.delete` takes the root trace ID and an options object containing `session_id`.
    - `shareId` is removed. The server generates the share token.
  
  #### Tab: cURL

    - The v2 share request body contains `session_id` and `trace_id`.
    - The v2 unshare path identifies the root trace. Its request body contains `session_id`.
    - The v2 unshare operation is idempotent and returns `204 No Content`.
  

Although generated parameter types may mark these coordinates as optional, provide `session_id` and `trace_id` when sharing, and provide `session_id` when unsharing. SmithDB uses these coordinates for the lookup.

#### Public read parameters

- `public.runs.query` takes the share token and a `selects` list. The token scopes the query to the complete shared trace. The legacy run-ID filter and cursor response are removed.
- `public.runs.retrieve` requires the run ID, share token, exact run `start_time`, and a `selects` list. Obtain the exact stored start time from `public.runs.query`.
- The public point read returns only selected fields. Use `ID`, `NAME`, `RUN_TYPE`, `STATUS`, and `START_TIME` for the examples below.
- To retrieve the public URL for an authenticated run, call `runs.retrieve` with `selects=["SHARE_URL"]`, then read `run.share_url`. Supplying `start_time` gives SmithDB the most efficient lookup.

Do not construct the public URL from the API origin. Retrieving `share_url` uses the deployment's configured application origin and works for both Cloud and self-hosted deployments.

#### Responses

| Operation | Before | After |
|---|---|---|
| Share | Run ID, shared trace ID, and share token | `share_token` |
| Unshare | `{"message": "Run unshared"}` | `204 No Content` |
| Query public runs | `runs` and `cursors` | `items` |
| Retrieve a public run | Full legacy run | Select-driven run object |
| Read share state | Share-state object or `null` | Run object with `share_url` when shared |

### Examples

The examples query the public trace before the point read because `public.runs.retrieve` requires the run's exact stored `start_time`.

  #### Tab: Python

    
      #### Tab: Before

        
      
      #### Tab: After

        
      
    
  
  #### Tab: TypeScript

    
      #### Tab: Before

        
      
      #### Tab: After

        
      
    
  
  #### Tab: cURL

    
      #### Tab: Before

        
      
      #### Tab: After

        

      
    
  


<!-- Inlined Snippet: feedback-create-before-py.mdx -->
```python Before
from langsmith import Client

client = Client()
run_id = "<run-id>"
client.create_feedback(
    run_id=run_id,
    key="user_feedback",
    score=1,
)
```

<!-- Inlined Snippet: feedback-create-after-py.mdx -->
```python After
from langsmith import Client

client = Client()
run_id = "<run-id>"
session_id = "<session-id>"
client.create_feedback(
    run_id=run_id,
    key="user_feedback",
    score=1,
    session_id=session_id,
)
```

<!-- Inlined Snippet: feedback-create-before-sh.mdx -->
```bash
RUN_ID="<run-id>"

curl -X POST "https://api.smith.langchain.com/api/v1/feedback" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg run "$RUN_ID" '{"run_id": $run, "key": "user_feedback", "score": 1}')"
```

<!-- Inlined Snippet: feedback-create-after-sh.mdx -->
```bash
RUN_ID="<run-id>"
SESSION_ID="<session-id>"

curl -X POST "https://api.smith.langchain.com/api/v1/feedback" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg run "$RUN_ID" --arg session "$SESSION_ID" '{"run_id": $run, "key": "user_feedback", "score": 1, "session_id": $session}')"
```

## Feedback: create

Create feedback (a score, correction, or comment) for a run.

### Main changes

#### Required parameter

The method name and endpoint are unchanged. Only the session (project) ID requirement changes.

  #### Tab: Python

    

> [!WARNING]
>
> `create_feedback` now requires `session_id`, the UUID of the project (session) that owns the run. It was previously optional.


    | Before | After | Notes |
    |---|---|---|
    | `session_id` (optional) | `session_id` (**required**) | UUID of the project that owns the run; resolve it with `client.read_project()` if you do not already have it |
  
  #### Tab: TypeScript

    

> [!WARNING]
>
> `client.createFeedback` now requires `sessionId`, the UUID of the project (session) that owns the run. It was previously optional.


    | Before | After | Notes |
    |---|---|---|
    | `sessionId` (optional) | `sessionId` (**required**) | UUID of the project that owns the run; resolve it with `client.readProject()` if you do not already have it |
  
  #### Tab: Java

    

> [!WARNING]
>
> `FeedbackCreateSchema.sessionId()` is now required. It was previously optional.


    | Before | After | Notes |
    |---|---|---|
    | `sessionId()` (optional) | `sessionId()` (**required**) | UUID of the project that owns the run; resolve it with `client.sessions().list()` if you do not already have it |
  
  #### Tab: Go

    

> [!WARNING]
>
> `FeedbackCreateSchemaParam.SessionID` is now required. It was previously optional.


    | Before | After | Notes |
    |---|---|---|
    | `SessionID` (optional) | `SessionID` (**required**) | UUID of the project that owns the run; resolve it with `client.Sessions.List()` if you do not already have it |
  
  #### Tab: cURL

    

> [!WARNING]
>
> `POST /api/v1/feedback` now requires a `session_id` field in the request body. It was previously optional.


    | Before | After | Notes |
    |---|---|---|
    | `session_id` (optional) | `session_id` (**required**) | UUID of the project that owns the run; resolve it with `GET /api/v1/sessions` if you do not already have it |
  

### Examples

#### Provide `session_id` when creating feedback

  #### Tab: Python

    `create_feedback` now requires `session_id` in addition to `run_id`.

    
      #### Tab: Before

        
      
      #### Tab: After

        
      
    
  
  #### Tab: TypeScript

    `client.createFeedback` now requires `sessionId` in addition to `runId`.

    
      #### Tab: Before

        
      
      #### Tab: After

        
      
    
  
  #### Tab: Java

    `.create()` now requires `.sessionId()` in addition to `.runId()`.

    
      #### Tab: Before

        
      
      #### Tab: After

        
      
    
  
  #### Tab: Go

    `Feedback.New` now requires `SessionID` in addition to `RunID`.

    
      #### Tab: Before

        
      
      #### Tab: After

        
      
    
  
  #### Tab: cURL

    `POST /api/v1/feedback` now requires a `session_id` field in addition to `run_id`.

    
      #### Tab: Before

        
      
      #### Tab: After

        

      
    
  


<!-- Inlined Snippet: threads-query-list-all-before-py.mdx -->
```python Before
from langsmith import Client

client = Client()
threads = client.list_threads(project_name="default")
for thread in threads:
    print(thread["thread_id"], thread["count"])
```

<!-- Inlined Snippet: threads-query-list-all-after-py.mdx -->
```python After
from langsmith import Client

async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    async for thread in client.threads.query(
        project_id=str(project.id),
        min_start_time="2026-07-01T00:00:00Z",
        max_start_time="2026-07-31T23:59:59Z",
    ):
        print(thread.thread_id, thread.count)

asyncio.run(main())
```

<!-- Inlined Snippet: threads-query-list-all-before-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

curl -s -X POST "https://api.smith.langchain.com/api/v1/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" '{"session": [$pid], "is_root": true}')" \
  | jq '[(.runs // [])[] | select(.extra.metadata.thread_id != null)] | group_by(.extra.metadata.thread_id) | map({
      thread_id: .[0].extra.metadata.thread_id,
      count: length
    })'
```

<!-- Inlined Snippet: threads-query-list-all-after-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

curl -X POST "https://api.smith.langchain.com/api/v2/threads/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" '{
    "project_id": $pid,
    "min_start_time": "2026-07-01T00:00:00Z",
    "max_start_time": "2026-07-31T23:59:59Z"
  }')"
```

<!-- Inlined Snippet: threads-query-filter-status-before-py.mdx -->
```python Before
from langsmith import Client

client = Client()
threads = client.list_threads(project_name="default", filter='eq(status, "error")')
for thread in threads:
    print(thread["thread_id"])
```

<!-- Inlined Snippet: threads-query-filter-status-after-py.mdx -->
```python After
from langsmith import Client

async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    async for thread in client.threads.query(
        project_id=str(project.id),
        min_start_time="2026-07-01T00:00:00Z",
        max_start_time="2026-07-31T23:59:59Z",
        filter='eq(status, "error")',
    ):
        print(thread.thread_id, thread.last_error)

asyncio.run(main())
```

<!-- Inlined Snippet: threads-query-filter-status-before-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

curl -s -X POST "https://api.smith.langchain.com/api/v1/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" '{"session": [$pid], "is_root": true, "filter": "eq(status, \"error\")"}')" \
  | jq -r '[(.runs // [])[].extra.metadata.thread_id] | unique | .[]'
```

<!-- Inlined Snippet: threads-query-filter-status-after-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

curl -X POST "https://api.smith.langchain.com/api/v2/threads/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" '{
    "project_id": $pid,
    "min_start_time": "2026-07-01T00:00:00Z",
    "max_start_time": "2026-07-31T23:59:59Z",
    "filter": "eq(status, \"error\")"
  }')"
```

## Threads: query

Query threads within a project, with cursor-based pagination. Returns threads matching the given time range and optional filter.

### Main changes

#### Method name

  #### Tab: Python

    | Before | After |
    |--------|-------|
    | `client.list_threads()` | `client.threads.query()` |

    

> [!NOTE]
>
> `client.threads.query()` is now async. Call it with `await`.


    See the [reference](https://reference.langchain.com/python/langsmith/_openapi_client/resources/threads/ThreadsResource/query) for the full parameter and field list.
  
  #### Tab: TypeScript

    | Before | After |
    |--------|-------|
    | `client.listThreads()` | `client.threads.query()` |

    See the [reference](https://reference.langchain.com/javascript/langsmith/_openapi_client/Langsmith/Threads/query) for the full parameter and field list.
  
  #### Tab: Java

    

> [!NOTE]
>
> Java never had a dedicated thread-listing method. The closest legacy equivalent is the generic run query, manually grouped by the `thread_id` metadata convention.


    | Before | After |
    |--------|-------|
    | `client.runs().query()` (generic, grouped client-side) | `client.threads().query()` |

    See the [reference](https://javadoc.io/doc/com.langchain.smith/langsmith-java/latest/com/langchain/smith/services/blocking/ThreadService.html) for the full parameter list.
  
  #### Tab: Go

    

> [!NOTE]
>
> Go never had a dedicated thread-listing method. The closest legacy equivalent is the generic run query, manually grouped by the `thread_id` metadata convention.


    | Before | After |
    |--------|-------|
    | `client.Runs.Query()` (generic, grouped client-side) | `client.Threads.Query()` |

    See the [reference](https://pkg.go.dev/github.com/langchain-ai/langsmith-go#ThreadService.QueryAutoPaging) for the full parameter list.
  
  #### Tab: cURL

    | Before | After |
    |--------|-------|
    | `POST /api/v1/runs/query` (`is_root=true`, grouped client-side) | `POST /api/v2/threads/query` |

    See the [API doc](https://docs.langchain.com/langsmith/smith-api/threads/query-threads) for the full parameter and field list.
  

#### Query parameters

  #### Tab: Python

    | Before (`list_threads`) | After (`threads.query`) | Notes |
    |---|---|---|
    | `project_id` XOR `project_name` | `project_id` | the new method takes only the UUID; resolve a name via `aread_project()` first, same pattern as `Runs: query` |
    | `start_time` (defaults to 1 day ago) | `min_start_time` + `max_start_time` | Optional; default to a 1-day window ending now, same as `start_time` |
    | `offset` + `limit` | `cursor` + `page_size` | Offset pagination replaced by cursor pagination |
    | `filter` (evaluated against runs) | `filter` | Same syntax; now evaluated against each thread's root run |
  
  #### Tab: TypeScript

    | Before (`listThreads`) | After (`threads.query`) | Notes |
    |---|---|---|
    | `projectId` XOR `projectName` | `project_id` | the new method takes only the UUID; resolve a name via `readProject()` first |
    | `startTime` (defaults to 1 day ago) | `min_start_time` + `max_start_time` | Optional; default to a 1-day window ending now, same as `startTime` |
    | `offset` + `limit` | `cursor` + `page_size` | Offset pagination replaced by cursor pagination |
    | `filter` | `filter` | Same syntax; now evaluated against each thread's root run |
  
  #### Tab: Java

    No query parameters to map. There was no dedicated method. The old approach used the generic run query (`is_root=true`, manual grouping by `thread_id` metadata). `threads().query()` takes `projectId`, `minStartTime`, `maxStartTime` (both optional, defaulting to a 1-day window ending now), `filter`, `pageSize`, `cursor`.
  
  #### Tab: Go

    No query parameters to map. There was no dedicated method. The old approach used the generic run query (`IsRoot: true`, manual grouping by `thread_id` metadata). `Threads.Query()` takes `ProjectID`, `MinStartTime`, `MaxStartTime` (both optional, defaulting to a 1-day window ending now), `Filter`, `PageSize`, `Cursor`.
  
  #### Tab: cURL

    `POST /api/v2/threads/query` body fields: `project_id`, `min_start_time` (optional), `max_start_time` (optional), `filter`, `page_size`, `cursor` (all `snake_case`). `min_start_time`/`max_start_time` default to a 1-day window ending now when omitted.
  

#### Response fields

  #### Tab: Python

    Python's legacy `ListThreadsItem` only has `thread_id`, `runs` (full embedded `Run[]`), `count`, `min_start_time`, `max_start_time`. It has no token/cost/latency/feedback fields at all.

    The new `Thread` never embeds the full run list (that is what `threads.list_traces` is for) but adds real `feedback_stats`, `latency_p50`/`latency_p99`, cost/token sums with per-category `_details`, `first_trace_id`/`last_trace_id`, `first_inputs`/`last_outputs` previews, `last_error`, `num_errored_turns`.

    | Before (legacy `ListThreadsItem`) | After (new `Thread`) | Notes |
    |---|---|---|
    | `thread_id` | `thread_id` | Unchanged |
    | `runs` (full embedded `Run[]`) | *(not available)* | Use `threads.list_traces` for per-trace detail |
    | `count` | `count` | Unchanged |
    | `min_start_time` | `min_start_time` | Unchanged |
    | `max_start_time` | `max_start_time` | Unchanged |
    | *(not available)* | `start_time` | New: a reference start time for this row, for example for sorting |
    | *(not available)* | `trace_id` | New: a representative root trace UUID, for example for deep links |
    | *(not available)* | `first_trace_id`, `last_trace_id` | New: chronologically first/last trace UUID in the query window |
    | *(not available)* | `first_inputs`, `last_outputs` | New: truncated previews from the first/last trace |
    | *(not available)* | `last_error` | New |
    | *(not available)* | `num_errored_turns` | New |
    | *(not available)* | `latency_p50`, `latency_p99` | New |
    | *(not available)* | `total_tokens`, `total_cost` | New |
    | *(not available)* | `total_token_details`, `total_cost_details` | New: per-category dicts, unlike `threads.list_traces` these are not wrapped in `.raw` |
    | *(not available)* | `feedback_stats` | New |
  
  #### Tab: TypeScript

    | Before (legacy `ListThreadsItem`) | After (new `Thread`) | Notes |
    |---|---|---|
    | `thread_id` | `thread_id` | Unchanged |
    | `runs` (full embedded `Run[]`) | *(not available)* | Use `threads.listTraces` for per-trace detail |
    | `count` | `count` | Unchanged |
    | `min_start_time` | `min_start_time` | Unchanged |
    | `max_start_time` | `max_start_time` | Unchanged |
    | `total_tokens` | `total_tokens` | Unchanged |
    | `total_cost` | `total_cost` | Unchanged |
    | `latency_p50`, `latency_p99` | `latency_p50`, `latency_p99` | Unchanged |
    | `feedback_stats` | `feedback_stats` | Unchanged |
    | `first_inputs`, `last_outputs` | `first_inputs`, `last_outputs` | Unchanged |
    | `last_error` | `last_error` | Unchanged |
    | *(not available)* | `start_time` | New: a reference start time for this row, for example for sorting |
    | *(not available)* | `trace_id` | New: a representative root trace UUID, for example for deep links |
    | *(not available)* | `first_trace_id`, `last_trace_id` | New: chronologically first/last trace UUID in the query window |
    | *(not available)* | `num_errored_turns` | New |
    | *(not available)* | `total_token_details`, `total_cost_details` | New: per-category dicts, unlike `threads.listTraces` these are not wrapped in `.raw` |
  
  #### Tab: Java

    `Thread` has 19 fields: `threadId`, `count`, `feedbackStats`, `firstInputs`, `firstTraceId`, `lastError`, `lastOutputs`, `lastTraceId`, `latencyP50`, `latencyP99`, `maxStartTime`, `minStartTime`, `numErroredTurns`, `startTime`, `totalCost`, `totalCostDetails`, `totalTokenDetails`, `totalTokens`, `traceId` (all `Optional`).

    The legacy SDK never had a typed response for this. Java's closest equivalent grouped raw `runs().query()` results by the `thread_id` metadata client-side. Every field below is new.

    | New `Thread` method | Notes |
    |---|---|
    | `threadId()` | |
    | `count()` | |
    | `minStartTime()`, `maxStartTime()`, `startTime()` | |
    | `firstTraceId()`, `lastTraceId()`, `traceId()` | `traceId()` is a representative root trace UUID, for example for deep links, in addition to the first/last trace UUIDs |
    | `firstInputs()`, `lastOutputs()` | Truncated previews from the first/last trace |
    | `lastError()` | |
    | `numErroredTurns()` | |
    | `latencyP50()`, `latencyP99()` | |
    | `totalTokens()`, `totalCost()` | |
    | `totalTokenDetails()`, `totalCostDetails()` | Per-category maps |
    | `feedbackStats()` | |
  
  #### Tab: Go

    `Thread` has 19 fields, in `PascalCase` Go struct form (e.g. `ThreadID`, `Count`, `LatencyP50`).

    The legacy SDK never had a typed response for this. Go's closest equivalent grouped raw `Runs.Query()` results by the `thread_id` metadata client-side. Every field below is new.

    | New `Thread` field | Notes |
    |---|---|
    | `ThreadID` | |
    | `Count` | |
    | `MinStartTime`, `MaxStartTime`, `StartTime` | |
    | `FirstTraceID`, `LastTraceID`, `TraceID` | `TraceID` is a representative root trace UUID, for example for deep links, in addition to the first/last trace UUIDs |
    | `FirstInputs`, `LastOutputs` | Truncated previews from the first/last trace |
    | `LastError` | |
    | `NumErroredTurns` | |
    | `LatencyP50`, `LatencyP99` | |
    | `TotalTokens`, `TotalCost` | |
    | `TotalTokenDetails`, `TotalCostDetails` | Per-category maps |
    | `FeedbackStats` | |
  
  #### Tab: cURL

    JSON response fields use `snake_case`: `thread_id`, `count`, `feedback_stats`, `first_inputs`, `first_trace_id`, `last_error`, `last_outputs`, `last_trace_id`, `latency_p50`, `latency_p99`, `max_start_time`, `min_start_time`, `num_errored_turns`, `start_time`, `total_cost`, `total_cost_details`, `total_token_details`, `total_tokens`, `trace_id`.

    The legacy API never had a dedicated threads endpoint. The closest equivalent was `POST /api/v1/runs/query`, grouped client-side by the `thread_id` metadata. Every field below is new.

    | New `threads.query` response field | Notes |
    |---|---|
    | `thread_id` | |
    | `count` | |
    | `min_start_time`, `max_start_time`, `start_time` | |
    | `first_trace_id`, `last_trace_id`, `trace_id` | `trace_id` is a representative root trace UUID, for example for deep links, in addition to the first/last trace UUIDs |
    | `first_inputs`, `last_outputs` | Truncated previews from the first/last trace |
    | `last_error` | |
    | `num_errored_turns` | |
    | `latency_p50`, `latency_p99` | |
    | `total_tokens`, `total_cost` | |
    | `total_token_details`, `total_cost_details` | Per-category dicts |
    | `feedback_stats` | |
  

### Examples

#### List threads in a project

Fetch every thread with activity in a project during a time range.

  #### Tab: Python

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: TypeScript

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Java

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Go

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: cURL

  #### Tab: Before

    
  
  #### Tab: After

    
  

  

#### Find threads with errors

Find threads that had a turn end in an error.

  #### Tab: Python

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: TypeScript

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Java

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Go

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: cURL

  #### Tab: Before

    
  
  #### Tab: After

    

  

  


<!-- Inlined Snippet: threads-list-traces-basic-before-py.mdx -->
```python Before
from langsmith import Client

client = Client()
thread_id = "<thread-id>"
for run in client.read_thread(thread_id=thread_id, project_name="default"):
    print(run.id, run.start_time)
```

<!-- Inlined Snippet: threads-list-traces-basic-after-py.mdx -->
```python After
from langsmith import Client

async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    thread_id = "<thread-id>"
    async for trace in client.threads.list_traces(
        thread_id, project_id=str(project.id), selects=["START_TIME"]
    ):
        print(trace.trace_id, trace.start_time)

asyncio.run(main())
```

<!-- Inlined Snippet: threads-list-traces-basic-before-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')
THREAD_ID="<thread-id>"

curl -s -X POST "https://api.smith.langchain.com/api/v1/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" --arg tid "$THREAD_ID" '{"session": [$pid], "is_root": true, "filter": ("eq(thread_id, \"" + $tid + "\")")}')" \
  | jq '.runs // []'
```

<!-- Inlined Snippet: threads-list-traces-basic-after-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')
THREAD_ID="<thread-id>"

curl -G "https://api.smith.langchain.com/api/v2/threads/$THREAD_ID/traces" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  --data-urlencode "project_id=$PROJECT_ID" \
  --data-urlencode "selects=START_TIME"
```

<!-- Inlined Snippet: threads-list-traces-selecting-fields-before-py.mdx -->
```python Before
from langsmith import Client

client = Client()
thread_id = "<thread-id>"
for run in client.read_thread(
    thread_id=thread_id,
    project_name="default",
    select=["id", "total_tokens", "total_cost"],
):
    print(run.id, run.total_tokens, run.total_cost)
```

<!-- Inlined Snippet: threads-list-traces-selecting-fields-after-py.mdx -->
```python After
from langsmith import Client

async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    thread_id = "<thread-id>"
    async for trace in client.threads.list_traces(
        thread_id,
        project_id=str(project.id),
        selects=["TRACE_ID", "TOTAL_TOKENS", "TOTAL_COST"],
    ):
        print(trace.trace_id, trace.total_tokens, trace.total_cost)

asyncio.run(main())
```

<!-- Inlined Snippet: threads-list-traces-selecting-fields-before-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')
THREAD_ID="<thread-id>"

curl -s -X POST "https://api.smith.langchain.com/api/v1/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" --arg tid "$THREAD_ID" '{"session": [$pid], "is_root": true, "filter": ("eq(thread_id, \"" + $tid + "\")"), "select": ["id", "total_tokens", "total_cost"]}')" \
  | jq '.runs // []'
```

<!-- Inlined Snippet: threads-list-traces-selecting-fields-after-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')
THREAD_ID="<thread-id>"

curl -G "https://api.smith.langchain.com/api/v2/threads/$THREAD_ID/traces" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  --data-urlencode "project_id=$PROJECT_ID" \
  --data-urlencode "selects=TRACE_ID" \
  --data-urlencode "selects=TOTAL_TOKENS" \
  --data-urlencode "selects=TOTAL_COST"
```

## Threads: list traces

Retrieve all traces belonging to a specific thread within a project.

### Main changes

#### Method name

  #### Tab: Python

    | Before | After |
    |--------|-------|
    | `client.read_thread()` | `client.threads.list_traces()` |

    

> [!NOTE]
>
> `client.threads.list_traces()` is now async. Call it with `await`.


    See the [reference](https://reference.langchain.com/python/langsmith/_openapi_client/resources/threads/ThreadsResource/list_traces) for the full parameter and field list.
  
  #### Tab: TypeScript

    | Before | After |
    |--------|-------|
    | `client.readThread()` | `client.threads.listTraces()` |

    See the [reference](https://reference.langchain.com/javascript/langsmith/_openapi_client/Langsmith/Threads/listTraces) for the full parameter and field list.
  
  #### Tab: Java

    

> [!NOTE]
>
> Java never had a dedicated per-thread method. The closest legacy equivalent is the generic run query filtered by the `thread_id` metadata convention.


    | Before | After |
    |--------|-------|
    | `client.runs().query()` (filtered by `thread_id`) | `client.threads().listTraces()` |

    See the [reference](https://javadoc.io/doc/com.langchain.smith/langsmith-java/latest/com/langchain/smith/services/blocking/ThreadService.html) for the full parameter list.
  
  #### Tab: Go

    

> [!NOTE]
>
> Go never had a dedicated per-thread method. The closest legacy equivalent is the generic run query filtered by the `thread_id` metadata convention.


    | Before | After |
    |--------|-------|
    | `client.Runs.Query()` (filtered by `thread_id`) | `client.Threads.ListTraces()` |

    See the [reference](https://pkg.go.dev/github.com/langchain-ai/langsmith-go#ThreadService.ListTracesAutoPaging) for the full parameter list.
  
  #### Tab: cURL

    | Before | After |
    |--------|-------|
    | `POST /api/v1/runs/query` (`filter=eq(thread_id, ...)`) | `GET /api/v2/threads/{thread_id}/traces` |

    See the [API doc](https://docs.langchain.com/langsmith/smith-api/threads/query-thread-traces) for the full parameter and field list.
  

#### Query parameters

  #### Tab: Python

    `read_thread`'s `is_root` has no new equivalent. `list_traces` always returns traces (root runs) only, matching its name. `read_thread`'s `order` (asc/desc) also has no new equivalent: results are always sorted by `start_time` ascending, a fixed server-side order.

    | Before (`read_thread`) | After (`list_traces`) | Notes |
    |---|---|---|
    | `thread_id` | `thread_id` (path param) | Unchanged |
    | `project_id` XOR `project_name` | `project_id` | The new method takes only the UUID |
    | `is_root` | *(not available)* | The new method always returns traces (root runs) only |
    | `order` | *(not available)* | No sort/order field on the new method |
    | `filter` | `filter` | Same syntax, now evaluated against each root trace run |
    | `select` (arbitrary run field list) | `selects` | The new method uses `ThreadTraceSelectField`, a 24-value uppercase enum |
    | *(not available)* | `page_size` + `cursor` | The new method adds cursor pagination |
  
  #### Tab: TypeScript

    `readThread`'s `isRoot` has no new equivalent. `listTraces` always returns traces (root runs) only, matching its name. `readThread`'s `order` (asc/desc) also has no new equivalent: results are always sorted by `start_time` ascending, a fixed server-side order.

    | Before (`readThread`) | After (`listTraces`) | Notes |
    |---|---|---|
    | `threadId` | `threadId` (path param) | Unchanged |
    | `projectId` XOR `projectName` | `project_id` | The new method takes only the UUID |
    | `isRoot` | *(not available)* | The new method always returns traces (root runs) only |
    | `order` | *(not available)* | No sort/order field on the new method |
    | `filter` | `filter` | Same syntax, now evaluated against each root trace run |
    | `select` (arbitrary run field list) | `selects` | The new method uses a 24-value uppercase enum |
    | *(not available)* | `page_size` + `cursor` | The new method adds cursor pagination |
  
  #### Tab: Java

    No query parameters to map. There was no dedicated method. `listTraces(threadId, params)` takes `projectId`, `filter`, `pageSize`, `cursor`, `selects` (24-value enum). Results are always sorted by `startTime` ascending, a fixed server-side order.
  
  #### Tab: Go

    No query parameters to map. There was no dedicated method. `ListTraces(ctx, threadID, params)` takes `ProjectID`, `Filter`, `PageSize`, `Cursor`, `Selects` (24-value enum). Results are always sorted by `StartTime` ascending, a fixed server-side order.
  
  #### Tab: cURL

    `GET /api/v2/threads/{thread_id}/traces` query params: `project_id`, `filter`, `page_size`, `cursor`, `selects` (repeatable), all `snake_case`. Results are always sorted by `start_time` ascending, a fixed server-side order.
  

#### Response fields

  #### Tab: Python

    The legacy `read_thread` returns full `Run` objects (a generator). The new `ThreadTrace` is lightweight: preview fields (`inputs_preview`/`outputs_preview`) instead of full `inputs`/`outputs`, no embedded child runs. `selects` controls what's populated, the same as `traces.query`.

    | Before (legacy `Run` field, via `read_thread`) | After (new `ThreadTrace` field) | Notes |
    |---|---|---|
    | `id` | *(not available)* | the legacy root run `id` and `trace_id` were identical; the new API exposes only `trace_id` |
    | `trace_id` | `trace_id` | Returned by default when `selects` is omitted |
    | `name` | `name` | Omitted unless included in `selects` |
    | `start_time` | `start_time` | Omitted unless included in `selects` |
    | `end_time` | `end_time` | Omitted unless included in `selects` |
    | `run_type` | `op` | Renamed; encoded as a number instead of a string |
    | `inputs` | `inputs_preview`, or `inputs` for the untruncated payload | Truncated preview by default; select `INPUTS` for the full payload |
    | `outputs` | `outputs_preview`, or `outputs` for the untruncated payload | Truncated preview by default; select `OUTPUTS` for the full payload |
    | `error` | `error_preview`, or `error` for the full message | Truncated summary by default; select `ERROR` for the full error message |
    | `latency` (property) | `latency` | Native field instead of a computed `timedelta` property |
    | `total_tokens`, `prompt_tokens`, `completion_tokens` | `total_tokens`, `prompt_tokens`, `completion_tokens` | Unchanged |
    | `total_cost`, `prompt_cost`, `completion_cost` | `total_cost`, `prompt_cost`, `completion_cost` | Unchanged |
    | `prompt_token_details`, `completion_token_details` | `prompt_token_details`, `completion_token_details` | Field now wraps the dict; access `.raw` |
    | `prompt_cost_details`, `completion_cost_details` | `prompt_cost_details`, `completion_cost_details` | Field now wraps the dict; access `.raw` |
    | `first_token_time` | `first_token_time` | Omitted unless included in `selects` |
    | *(not available)* | `thread_id` | New: the thread UUID this trace belongs to |
    | `child_runs`, `child_run_ids` | *(not available)* | No embedded child runs; use `traces.list_runs` for descendant runs |
  
  #### Tab: TypeScript

    The legacy `readThread` returns full `Run` objects (an async generator). The new `ThreadTrace` is lightweight: preview fields (`inputs_preview`/`outputs_preview`) instead of full `inputs`/`outputs`, no embedded child runs. `selects` controls what is populated, the same as `traces.query`.

    | Before (legacy `Run` field, via `readThread`) | After (new `ThreadTrace` field) | Notes |
    |---|---|---|
    | `id` | *(not available)* | the legacy root run `id` and `trace_id` were identical; the new API exposes only `trace_id` |
    | `trace_id` | `trace_id` | Returned by default when `selects` is omitted |
    | `name` | `name` | Omitted unless included in `selects` |
    | `start_time` | `start_time` | Omitted unless included in `selects` |
    | `end_time` | `end_time` | Omitted unless included in `selects` |
    | `run_type` | `op` | Renamed; encoded as a number instead of a string |
    | `inputs` | `inputs_preview`, or `inputs` for the untruncated payload | Truncated preview by default; select `INPUTS` for the full payload |
    | `outputs` | `outputs_preview`, or `outputs` for the untruncated payload | Truncated preview by default; select `OUTPUTS` for the full payload |
    | `error` | `error_preview`, or `error` for the full message | Truncated summary by default; select `ERROR` for the full error message |
    | `latency` | `latency` | Native field on the new type |
    | `total_tokens`, `prompt_tokens`, `completion_tokens` | `total_tokens`, `prompt_tokens`, `completion_tokens` | Unchanged |
    | `total_cost`, `prompt_cost`, `completion_cost` | `total_cost`, `prompt_cost`, `completion_cost` | Unchanged |
    | `prompt_token_details`, `completion_token_details` | `prompt_token_details`, `completion_token_details` | Unchanged |
    | `prompt_cost_details`, `completion_cost_details` | `prompt_cost_details`, `completion_cost_details` | Unchanged |
    | `first_token_time` | `first_token_time` | Omitted unless included in `selects` |
    | *(not available)* | `thread_id` | New: the thread UUID this trace belongs to |
    | `child_runs`, `child_run_ids` | *(not available)* | No embedded child runs; use `traces.listRuns` for descendant runs |
  
  #### Tab: Java

    `ThreadTrace` has 24 `Optional` fields: `traceId`, `threadId`, `name`, `startTime`, `endTime`, `latency`, `op`, token/cost fields with per-category `_details`, `inputsPreview`/`outputsPreview`/`inputs`/`outputs`, `errorPreview`/`error`, `firstTokenTime`.

    | Before (legacy `RunSchema` method) | After (new `ThreadTrace` method) | Notes |
    |---|---|---|
    | `id()` | *(not available)* | the legacy root run `id()` and `traceId()` were identical; the new API exposes only `traceId()` |
    | `traceId()` | `traceId()` | Returned by default when `selects` is omitted |
    | `name()` | `name()` | Omitted unless included in `selects` |
    | `startTime()` | `startTime()` | Omitted unless included in `selects` |
    | `endTime()` | `endTime()` | Omitted unless included in `selects` |
    | `runType()` | `op()` | Renamed; encoded as a number instead of a string |
    | `inputs()` | `inputsPreview()`, or `inputs()` for the untruncated payload | Truncated preview by default; select `INPUTS` for the full payload |
    | `outputs()` | `outputsPreview()`, or `outputs()` for the untruncated payload | Truncated preview by default; select `OUTPUTS` for the full payload |
    | `error()` | `errorPreview()`, or `error()` for the full message | Truncated summary by default; select `ERROR` for the full error message |
    | `latency()` | `latency()` | Unchanged |
    | `totalTokens()`, `promptTokens()`, `completionTokens()` | `totalTokens()`, `promptTokens()`, `completionTokens()` | Unchanged |
    | `totalCost()`, `promptCost()`, `completionCost()` | `totalCost()`, `promptCost()`, `completionCost()` | Unchanged |
    | `promptTokenDetails()`, `completionTokenDetails()` | `promptTokenDetails()`, `completionTokenDetails()` | Unchanged |
    | `promptCostDetails()`, `completionCostDetails()` | `promptCostDetails()`, `completionCostDetails()` | Unchanged |
    | `firstTokenTime()` | `firstTokenTime()` | Omitted unless included in `selects` |
    | *(not available)* | `threadId()` | New: the thread UUID this trace belongs to |
    | `childRuns()`, `childRunIds()` | *(not available)* | No embedded child runs; use `traces().listRuns()` for descendant runs |
  
  #### Tab: Go

    `ThreadTrace` has 24 fields, in `PascalCase` Go struct form.

    | Before (legacy root `Run` field) | After (new `ThreadTrace` field) | Notes |
    |---|---|---|
    | `ID` | *(not available)* | the legacy root run `ID` and `TraceID` were identical; the new API exposes only `TraceID` |
    | `TraceID` | `TraceID` | Returned by default when `Selects` is omitted |
    | `Name` | `Name` | Omitted unless included in `Selects` |
    | `StartTime` | `StartTime` | Omitted unless included in `Selects` |
    | `EndTime` | `EndTime` | Omitted unless included in `Selects` |
    | `RunType` | `Op` | Renamed; encoded as a number instead of a string |
    | `Inputs` | `InputsPreview`, or `Inputs` for the untruncated payload | Truncated preview by default; select `INPUTS` for the full payload |
    | `Outputs` | `OutputsPreview`, or `Outputs` for the untruncated payload | Truncated preview by default; select `OUTPUTS` for the full payload |
    | `Error` | `ErrorPreview`, or `Error` for the full message | Truncated summary by default; select `ERROR` for the full error message |
    | `Latency` | `Latency` | Unchanged |
    | `TotalTokens`, `PromptTokens`, `CompletionTokens` | `TotalTokens`, `PromptTokens`, `CompletionTokens` | Unchanged |
    | `TotalCost`, `PromptCost`, `CompletionCost` | `TotalCost`, `PromptCost`, `CompletionCost` | Unchanged |
    | `PromptTokenDetails`, `CompletionTokenDetails` | `PromptTokenDetails`, `CompletionTokenDetails` | Unchanged |
    | `PromptCostDetails`, `CompletionCostDetails` | `PromptCostDetails`, `CompletionCostDetails` | Unchanged |
    | `FirstTokenTime` | `FirstTokenTime` | Omitted unless included in `Selects` |
    | *(not available)* | `ThreadID` | New: the thread UUID this trace belongs to |
    | `ChildRuns`, `ChildRunIDs` | *(not available)* | No embedded child runs; use `Traces.ListRuns` for descendant runs |
  
  #### Tab: cURL

    JSON response fields use `snake_case`, matching the table below.

    | Before (legacy root run field) | After (new `ThreadTrace` field) | Notes |
    |---|---|---|
    | `id` | *(not available)* | the legacy root run `id` and `trace_id` were identical; the new API exposes only `trace_id` |
    | `trace_id` | `trace_id` | Returned by default when `selects` is omitted |
    | `name` | `name` | Omitted unless included in `selects` |
    | `start_time` | `start_time` | Omitted unless included in `selects` |
    | `end_time` | `end_time` | Omitted unless included in `selects` |
    | `run_type` | `op` | Renamed; encoded as a number instead of a string |
    | `inputs` | `inputs_preview`, or `inputs` for the untruncated payload | Truncated preview by default; select `INPUTS` for the full payload |
    | `outputs` | `outputs_preview`, or `outputs` for the untruncated payload | Truncated preview by default; select `OUTPUTS` for the full payload |
    | `error` | `error_preview`, or `error` for the full message | Truncated summary by default; select `ERROR` for the full error message |
    | `latency` | `latency` | Unchanged |
    | `total_tokens`, `prompt_tokens`, `completion_tokens` | `total_tokens`, `prompt_tokens`, `completion_tokens` | Unchanged |
    | `total_cost`, `prompt_cost`, `completion_cost` | `total_cost`, `prompt_cost`, `completion_cost` | Unchanged |
    | `prompt_token_details`, `completion_token_details` | `prompt_token_details`, `completion_token_details` | Unchanged |
    | `prompt_cost_details`, `completion_cost_details` | `prompt_cost_details`, `completion_cost_details` | Unchanged |
    | `first_token_time` | `first_token_time` | Omitted unless included in `selects` |
    | *(not available)* | `thread_id` | New: the thread UUID this trace belongs to |
    | `child_runs`, `child_run_ids` | *(not available)* | No embedded child runs; use `traces.list_runs` for descendant runs |
  

### Examples

#### List every trace (turn) in a thread

Fetch all the traces (conversation turns) that belong to one thread.

  #### Tab: Python

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: TypeScript

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Java

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Go

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: cURL

  #### Tab: Before

    
  
  #### Tab: After

    
  

  

#### Select specific trace's fields

Request just the fields you need instead of every field, to reduce response size.

  #### Tab: Python

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: TypeScript

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Java

    

> [!NOTE]
>
> The Before example omits `total_cost` here. Selecting it on the legacy `RunSchema` type triggers a known deserialization bug in the current Java binding (it expects a string, the API returns a number).


  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Go

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: cURL

  #### Tab: Before

    
  
  #### Tab: After

    

  

  


<!-- Inlined Snippet: experiment-runs-query-basic-before-py.mdx -->
```python Before
from langsmith import Client

client = Client()
experiment_id = client.read_project(project_name=experiment_name).id
results = client.get_experiment_results(
    project_id=experiment_id,
    limit=20,
    preview=True,
)
examples_with_runs = list(results["examples_with_runs"])
```

<!-- Inlined Snippet: experiment-runs-query-basic-after-py.mdx -->
```python After
from langsmith import Client

async def main():
    client = Client()
    experiment_id = client.read_project(project_name=experiment_name).id
    page = await client.datasets.experiment_runs.query(
        str(dataset_id),
        experiment_ids=[str(experiment_id)],
        page_size=20,
        selects=["ID", "NAME", "STATUS", "INPUTS_PREVIEW", "OUTPUTS_PREVIEW"],
    )
    return page.items

examples_with_runs = asyncio.run(main())
```

<!-- Inlined Snippet: experiment-runs-query-basic-before-sh.mdx -->
```bash Before
curl -X POST "https://api.smith.langchain.com/api/v1/datasets/$DATASET_ID/runs" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg eid "$EXPERIMENT_ID" '{
    "session_ids": [$eid],
    "limit": 20,
    "preview": true
  }')"
```

<!-- Inlined Snippet: experiment-runs-query-basic-after-sh.mdx -->
```bash After
curl -X POST "https://api.smith.langchain.com/api/v2/datasets/$DATASET_ID/experiment-runs" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg eid "$EXPERIMENT_ID" '{
    "experiment_ids": [$eid],
    "page_size": 20,
    "selects": ["ID", "NAME", "STATUS", "INPUTS_PREVIEW", "OUTPUTS_PREVIEW"]
  }')"
```

<!-- Inlined Snippet: experiment-runs-query-pagination-before-sh.mdx -->
```bash Before
curl -X POST "https://api.smith.langchain.com/api/v1/datasets/$DATASET_ID/runs" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg eid "$EXPERIMENT_ID" '{
    "session_ids": [$eid],
    "limit": 20,
    "offset": 20
  }')"
```

<!-- Inlined Snippet: experiment-runs-query-pagination-after-sh.mdx -->
```bash After
curl -X POST "https://api.smith.langchain.com/api/v2/datasets/$DATASET_ID/experiment-runs" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg eid "$EXPERIMENT_ID" --arg cursor "$NEXT_CURSOR" '{
    "experiment_ids": [$eid],
    "page_size": 20,
    "cursor": $cursor
  }')"
```

<!-- Inlined Snippet: experiment-runs-query-pagination-before-py.mdx -->
```python Before
from langsmith import Client

client = Client()
experiment_id = client.read_project(project_name=experiment_name).id
# get_experiment_results paginated internally; increase `limit` to fetch
# more results in a single call. There is no cursor to pass in manually.
results = client.get_experiment_results(
    project_id=experiment_id,
    limit=100,
)
examples_with_runs = list(results["examples_with_runs"])
```

<!-- Inlined Snippet: experiment-runs-query-pagination-after-py.mdx -->
```python After
from langsmith import Client

async def main():
    client = Client()
    experiment_id = client.read_project(project_name=experiment_name).id
    page = await client.datasets.experiment_runs.query(
        str(dataset_id),
        experiment_ids=[str(experiment_id)],
        page_size=1,
    )
    runs = []
    async for run in page:
        runs.append(run)
        if len(runs) >= 100:
            break
    return runs

examples_with_runs = asyncio.run(main())
```

<!-- Inlined Snippet: experiment-runs-query-sort-before-sh.mdx -->
```bash Before
curl -X POST "https://api.smith.langchain.com/api/v1/datasets/$DATASET_ID/runs" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg eid "$EXPERIMENT_ID" '{
    "session_ids": [$eid],
    "sort_params": {
      "sort_by": "correctness",
      "sort_order": "ASC"
    }
  }')"
```

<!-- Inlined Snippet: experiment-runs-query-sort-after-sh.mdx -->
```bash After
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
```

<!-- Inlined Snippet: experiment-runs-query-sort-before-py.mdx -->
```python
# get_experiment_results did not support sorting results by feedback score.
```

<!-- Inlined Snippet: experiment-runs-query-sort-after-py.mdx -->
```python After
from langsmith import Client

async def main():
    client = Client()
    experiment_id = client.read_project(project_name=experiment_name).id
    page = await client.datasets.experiment_runs.query(
        str(dataset_id),
        experiment_ids=[str(experiment_id)],
        sort={"by": "feedback.correctness", "order": "ASC"},
    )
    return page.items

examples_with_runs = asyncio.run(main())
```

## Dataset experiment runs: query

Query dataset examples together with the experiment runs recorded against each example. Accepts one or more `experiment_ids` so you can view runs from multiple experiments side by side; results are returned as a cursor-paginated page.

### Main changes

#### Method name

  #### Tab: Python

    | Before | After |
    |--------|-------|
    | `client.get_experiment_results()` | `client.datasets.experiment_runs.query()` |

    

> [!NOTE]
>
> `client.datasets.experiment_runs.query()` is now async. Call it with `await`.


    See the [reference](https://reference.langchain.com/python/langsmith/_openapi_client/resources/datasets/experiment_runs/ExperimentRunsResource/query) for the full parameter and field list.
  
  #### Tab: TypeScript

    | Before | After |
    |--------|-------|
    | *(no legacy public `Client` method)* | `client.datasets.experimentRuns.query()` |

    See the [reference](https://reference.langchain.com/javascript/langsmith/_openapi_client/resources/Datasets/ExperimentRuns/query) for the full parameter and field list.
  
  #### Tab: Java

    | Before | After |
    |--------|-------|
    | `client.datasets().runs().query()` | `client.datasets().experimentRuns().query()` |

    See the [reference](https://javadoc.io/doc/com.langchain.smith/langsmith-java/latest/com/langchain/smith/services/blocking/datasets/ExperimentRunService.html) for the full parameter list.
  
  #### Tab: Go

    | Before | After |
    |--------|-------|
    | `client.Datasets.Runs.Query()` | `client.Datasets.ExperimentRuns.Query()` |

    See the [reference](https://pkg.go.dev/github.com/langchain-ai/langsmith-go#DatasetExperimentRunService.Query) for the full parameter list.
  
  #### Tab: cURL

    | Before | After |
    |--------|-------|
    | `POST /api/v1/datasets/{dataset_id}/runs` | `POST /api/v2/datasets/{dataset_id}/experiment-runs` |

    See the [API doc](https://docs.langchain.com/langsmith/smith-api/datasets/fetch-experiment-runs-for-dataset-examples) for the full parameter and field list.
  

#### Query parameters

  #### Tab: Python

    

> [!WARNING]
>
> `experiment_ids` is required and replaces `session_ids`. Values are still experiment tracing-project UUIDs—if you only know the experiment's name, resolve it first: `client.read_project(project_name="my-experiment").id`, or `await client.aread_project(project_name="my-experiment")` in async code.


    | Before (`get_experiment_results`) | After (`datasets.experiment_runs.query`) | Notes |
    |---|---|---|
    | `project_id` | `experiment_ids` | `get_experiment_results` accepted one project/experiment; the new method accepts a required non-empty list |
    | `limit` | *(removed)* | Use `page_size` for per-request batch size |
    | *(not available)* | `page_size` | Per-request result count (default 20, max 100) |
    | *(handled internally)* | `cursor` | Pass the previous page's `next_cursor` to fetch the next page |
    | `preview` | `selects` | Omitted `selects` returns only run IDs; use `INPUTS_PREVIEW` and `OUTPUTS_PREVIEW` for previews, or `INPUTS` and `OUTPUTS` for full payloads |
    | *(not exposed)* | `sort` | Use `{by, order}` for feedback-score sorting |
    | `filters` | `filters` | Unchanged; maps experiment UUID strings to filter expressions |
    | `comparative_experiment_id` | `comparative_experiment_id` | Unchanged |
    | *(not exposed)* | `example_ids` | Optional example UUID filter, max 1000 |
  
  #### Tab: TypeScript

    

> [!WARNING]
>
> `experiment_ids` is required and replaces `session_ids`. Values are still experiment tracing-project UUIDs—if you only know the experiment's name, resolve it first: `(await client.readProject({ projectName: "my-experiment" })).id`.


    | Before | After (`datasets.experimentRuns.query`) | Notes |
    |---|---|---|
    | *(no legacy public `Client` method)* | `experiment_ids` | Required and non-empty |
    | *(no legacy public `Client` method)* | `page_size` | Defaults to 20, max 100 |
    | *(no legacy public `Client` method)* | `cursor` | Pass the previous page's `next_cursor` instead of a numeric offset |
    | *(no legacy public `Client` method)* | `selects` | Omitted `selects` returns only run IDs; use `INPUTS_PREVIEW` and `OUTPUTS_PREVIEW` for previews, or `INPUTS` and `OUTPUTS` for full payloads |
    | *(no legacy public `Client` method)* | `sort` | Use `{ by, order }` for feedback-score sorting |
    | *(no legacy public `Client` method)* | `filters` | Maps experiment UUID strings to filter expressions |
    | *(no legacy public `Client` method)* | `comparative_experiment_id` | Scopes pairwise-annotation feedback |
    | *(no legacy public `Client` method)* | `example_ids` | Optional example UUID filter, max 1000 |
  
  #### Tab: Java

    

> [!WARNING]
>
> `experimentIds()` is required and replaces `sessionIds()`. Values are still experiment tracing-project UUIDs—if you only know the experiment's name, resolve it first: `client.sessions().list(SessionListParams.builder().name("my-experiment").build()).items().first().id()`.


    | Before (`RunQueryParams`) | After (`ExperimentRunQueryParams`) | Notes |
    |---|---|---|
    | `sessionIds()` | `experimentIds()` | Renamed; required and non-empty |
    | `limit()` | *(removed)* | Use `pageSize()` for per-request batch size |
    | *(not available)* | `pageSize()` | Per-request result count (default 20, max 100) |
    | `offset()` | `cursor()` | Pass the previous page's `nextCursor()` instead of a numeric offset |
    | `preview()` | `selects()` | Omitted selects return only run IDs; add `Select.INPUTS_PREVIEW` and `Select.OUTPUTS_PREVIEW` for previews |
    | `sortParams()` | `sort()` | Shape changed from `sortBy()` / `sortOrder()` to `by()` / `order()` |
    | `filters()` | `filters()` | Unchanged |
    | `comparativeExperimentId()` | `comparativeExperimentId()` | Unchanged |
    | `exampleIds()` | `exampleIds()` | Unchanged, max 1000 |
    | `format()` | *(removed)* | The new endpoint returns JSON only |
    | `includeAnnotatorDetail()` | *(removed)* | No new JSON equivalent |
  
  #### Tab: Go

    

> [!WARNING]
>
> `ExperimentIDs` is required and replaces `SessionIDs`. Values are still experiment tracing-project UUIDs—if you only know the experiment's name, resolve it first: list sessions filtered by `Name` and take the first result's `ID`.


    | Before (`DatasetRunQueryParams`) | After (`DatasetExperimentRunQueryParams`) | Notes |
    |---|---|---|
    | `SessionIDs` | `ExperimentIDs` | Renamed; required and non-empty |
    | `Limit` | *(removed)* | Use `PageSize` for per-request batch size |
    | *(not available)* | `PageSize` | Per-request result count (default 20, max 100) |
    | `Offset` | `Cursor` | Pass the previous page's `NextCursor` instead of a numeric offset |
    | `Preview` | `Selects` | Omitted selects return only run IDs; use `InputsPreview` and `OutputsPreview` select constants for previews |
    | `SortParams` | `Sort` | Shape changed from `SortBy` / `SortOrder` to `By` / `Order` |
    | `Filters` | `Filters` | Unchanged |
    | `ComparativeExperimentID` | `ComparativeExperimentID` | Unchanged |
    | `ExampleIDs` | `ExampleIDs` | Unchanged, max 1000 |
    | `Format` | *(removed)* | The new endpoint returns JSON only |
    | `IncludeAnnotatorDetail` | *(removed)* | No new JSON equivalent |
  
  #### Tab: cURL

    

> [!WARNING]
>
> `experiment_ids` is required and replaces `session_ids`. Values are still experiment tracing-project UUIDs—if you only know the experiment's name, resolve it first: `GET /api/v1/sessions?name=my-experiment` and take `.[0].id`.


    | Before (`POST /api/v1/datasets/{dataset_id}/runs` body) | After (`POST /api/v2/datasets/{dataset_id}/experiment-runs` body) | Notes |
    |---|---|---|
    | `session_ids` | `experiment_ids` | Renamed; required and non-empty |
    | `limit` | *(removed)* | Use `page_size` for per-request batch size |
    | *(not available)* | `page_size` | Per-request result count (default 20, max 100) |
    | `offset` | `cursor` | Pass the previous page's `next_cursor` instead of a numeric offset |
    | `preview` | `selects` | Omitted `selects` returns only run IDs; use `INPUTS_PREVIEW` and `OUTPUTS_PREVIEW` for previews, or `INPUTS` and `OUTPUTS` for full payloads |
    | `sort_params` | `sort` | Shape changed from `{sort_by, sort_order}` to `{by, order}` |
    | `filters` | `filters` | Unchanged; maps experiment UUID strings to filter expressions |
    | `comparative_experiment_id` | `comparative_experiment_id` | Unchanged |
    | `example_ids` | `example_ids` | Unchanged, max 1000 |
    | `format=csv` | *(removed)* | The new endpoint returns JSON only |
    | `include_annotator_detail` | *(removed)* | No new JSON equivalent |
  

#### Response fields

Each page item is a dataset example paired with the runs produced for it—not a bare `Run`. Its `runs` field holds the same `Run` objects returned by [Querying runs](#response-fields); see that section for the per-run fields. The tables below describe the rest of the item: the example fields alongside `runs`.

  #### Tab: Python

    `get_experiment_results` returned experiment results with an `examples_with_runs` iterator. `datasets.experiment_runs.query` returns a paginated page object (`page.items`, `page.next_cursor`); each item has:

    | Field | Notes |
    |---|---|
    | `id` | Dataset example UUID |
    | `dataset_id` | Parent dataset UUID |
    | `name` | Example name, if set |
    | `created_at` / `modified_at` | Example timestamps |
    | `inputs` / `outputs` | Example input and reference-output payloads |
    | `metadata` | Example metadata |
    | `source_run_id` | Run UUID the example was created from, if any |
    | `attachment_urls` | Pre-signed download URL per attachment name |
    | `runs` | This example's runs—see [Querying runs](#response-fields) |
  
  #### Tab: TypeScript

    The legacy dataset runs endpoint was not exposed on the public TypeScript `Client`. `datasets.experimentRuns.query` returns a paginated page (`page.getPaginatedItems()`, `page.next_cursor`); each item has:

    | Field | Notes |
    |---|---|
    | `id` | Dataset example UUID |
    | `dataset_id` | Parent dataset UUID |
    | `name` | Example name, if set |
    | `created_at` / `modified_at` | Example timestamps |
    | `inputs` / `outputs` | Example input and reference-output payloads |
    | `metadata` | Example metadata |
    | `source_run_id` | Run UUID the example was created from, if any |
    | `attachment_urls` | Pre-signed download URL per attachment name |
    | `runs` | This example's runs—see [Querying runs](#response-fields) |
  
  #### Tab: Java

    `runs().query` returned an optional list. `experimentRuns().query` returns a page object (`items()`, `nextCursor()`); each item has:

    | Field | Notes |
    |---|---|
    | `id()` | Dataset example UUID |
    | `datasetId()` | Parent dataset UUID |
    | `name()` | Example name, if set |
    | `createdAt()` / `modifiedAt()` | Example timestamps |
    | `inputs()` / `outputs()` | Example input and reference-output payloads |
    | `metadata()` | Example metadata |
    | `sourceRunId()` | Run UUID the example was created from, if any |
    | `attachmentUrls()` | Pre-signed download URL per attachment name |
    | `runs()` | This example's runs—see [Querying runs](#response-fields) |
  
  #### Tab: Go

    `Datasets.Runs.Query` returned a slice pointer. `Datasets.ExperimentRuns.Query` returns an `ItemsCursorPostPagination` (`Items`, `NextCursor`); each item has:

    | Field | Notes |
    |---|---|
    | `ID` | Dataset example UUID |
    | `DatasetID` | Parent dataset UUID |
    | `Name` | Example name, if set |
    | `CreatedAt` / `ModifiedAt` | Example timestamps |
    | `Inputs` / `Outputs` | Example input and reference-output payloads |
    | `Metadata` | Example metadata |
    | `SourceRunID` | Run UUID the example was created from, if any |
    | `AttachmentURLs` | Pre-signed download URL per attachment name |
    | `Runs` | This example's runs—see [Querying runs](#response-fields) |
  
  #### Tab: cURL

    `POST /api/v1/datasets/{dataset_id}/runs` returned a JSON array. `POST /api/v2/datasets/{dataset_id}/experiment-runs` returns `{ "items": [...], "next_cursor": "..." }`; each item has:

    | Field | Notes |
    |---|---|
    | `id` | Dataset example UUID |
    | `dataset_id` | Parent dataset UUID |
    | `name` | Example name, if set |
    | `created_at` / `modified_at` | Example timestamps |
    | `inputs` / `outputs` | Example input and reference-output payloads |
    | `metadata` | Example metadata |
    | `source_run_id` | Run UUID the example was created from, if any |
    | `attachment_urls` | Pre-signed download URL per attachment name |
    | `runs` | This example's runs—see [Querying runs](#response-fields) |
  

### Examples

#### Query experiment runs and request preview fields

  #### Tab: Python

    `preview=True` returned truncated inputs/outputs automatically. In the new API, request that explicitly: pass `INPUTS_PREVIEW` and `OUTPUTS_PREVIEW` in `selects` for the same truncated shape, or `INPUTS`/`OUTPUTS` for the untruncated values. Omitting `selects` returns only `id`.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: TypeScript

    The new TypeScript SDK method exposes the experiment-runs query endpoint. The legacy direct endpoint request shape is shown in the cURL tab. Pass `INPUTS_PREVIEW` and `OUTPUTS_PREVIEW` in `selects` for truncated inputs/outputs, or `INPUTS`/`OUTPUTS` for the untruncated values. Omitting `selects` returns only `id`.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Java

    `preview(true)` returned truncated inputs/outputs automatically. In the new API, request that explicitly: add `Select.INPUTS_PREVIEW` and `Select.OUTPUTS_PREVIEW` for the same truncated shape, or `Select.INPUTS`/`Select.OUTPUTS` for the untruncated values. Omitting selects returns only `id`.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Go

    `Preview: true` returned truncated inputs/outputs automatically. In the new API, request that explicitly: add the `InputsPreview` and `OutputsPreview` select constants for the same truncated shape, or `Inputs`/`Outputs` for the untruncated values. Omitting selects returns only `ID`.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: cURL

    `preview: true` returned truncated inputs/outputs automatically. In the new API, request that explicitly: pass `INPUTS_PREVIEW` and `OUTPUTS_PREVIEW` in `selects` for the same truncated shape, or `INPUTS`/`OUTPUTS` for the untruncated values. Omitting `selects` returns only `id`.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  

#### Page through results

Both examples below fetch up to 100 results across as many pages as that takes, then stop—so the two are comparable operations, not "one page" vs. "everything." Adjust the `100`/`page_size` values for your own use case.

  #### Tab: Python

    `get_experiment_results` paginates internally and stops once `limit` total results are returned. `datasets.experiment_runs.query` has no total-count `limit`; iterate the returned page with `async for` and `break` once you have enough.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: TypeScript

    The legacy dataset runs endpoint wasn't exposed on the public TypeScript `Client`. `client.datasets.experimentRuns.query(...)` returns an async iterable—use `for await...of` (no extra `await` needed) and `break` once you have enough.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Java

    The legacy endpoint returns one page per call with no auto-pager—loop manually, incrementing `offset`, and stop once you have enough. `.experimentRuns().query(...).autoPager()` walks pages for you—break out of the loop once you have enough runs.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Go

    The legacy endpoint returns one page per call with no auto-pager—loop manually, incrementing `Offset`, and stop once you have enough. On the new endpoint, paginate manually by setting `Cursor` on the request from the previous response's `NextCursor` and stopping once you have enough; avoid `QueryAutoPaging` here—it sends the cursor as a query parameter, which this POST endpoint doesn't read, so it silently refetches the first page forever.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: cURL

    Raw HTTP has no auto-pagination helper: pass the previous response's `next_cursor` back in as `cursor` to fetch the next page.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  

#### Sort by feedback score

Sort dataset examples by a feedback score, supported only when you query a single experiment. In Go and Java, this replaces the legacy `sort_params.sort_by`/`sort_params.sort_order` (now `sort.by`/`sort.order`); Python and TypeScript gain sorting for the first time in the new API.

  #### Tab: Python

    `get_experiment_results` did not support sorting by feedback score.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: TypeScript

    The legacy dataset runs endpoint was not exposed on the public TypeScript `Client`, so there was no way to sort by feedback score before the new API.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Java

    `sortParams()` is replaced by `sort()`, with `sortBy()`/`sortOrder()` renamed to `by()`/`order()`.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Go

    `SortParams` is replaced by `Sort`, with `SortBy`/`SortOrder` renamed to `By`/`Order`.

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: cURL

  #### Tab: Before

    
  
  #### Tab: After

    

  

  


<!-- Inlined Snippet: runs-query-list-root-as-traces-before-py.mdx -->
```python Before
from langsmith import Client

client = Client()
project = client.read_project(project_name="default")

root_runs = list(client.list_runs(project_id=project.id, is_root=True, limit=5))
for root_run in root_runs:
    print(root_run.trace_id, root_run.name)
```

<!-- Inlined Snippet: runs-query-list-root-as-traces-after-py.mdx -->
```python After
from langsmith import Client

async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    count = 0
    async for trace in client.traces.query(
        project_id=str(project.id),
        min_start_time="2026-07-01T00:00:00Z",
        max_start_time="2026-07-31T23:59:59Z",
        selects=["NAME"],
    ):
        print(trace.root_run.trace_id, trace.root_run.name)
        count += 1
        if count >= 5:
            break

asyncio.run(main())
```

<!-- Inlined Snippet: runs-query-list-root-as-traces-before-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

curl -s -X POST "https://api.smith.langchain.com/api/v1/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" '{"session": [$pid], "is_root": true, "limit": 5}')" \
  | jq '(.runs // []) | map({trace_id: .trace_id, name: .name})'
```

<!-- Inlined Snippet: runs-query-list-root-as-traces-after-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

curl -X POST "https://api.smith.langchain.com/api/v2/traces/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" '{
    "project_id": $pid,
    "min_start_time": "2026-07-01T00:00:00Z",
    "max_start_time": "2026-07-31T23:59:59Z",
    "page_size": 5,
    "selects": ["NAME"]
  }')" | jq '.items | map({trace_id: .root_run.trace_id, name: .root_run.name})'
```

<!-- Inlined Snippet: traces-query-totals-before-py.mdx -->
```python Before
from langsmith import Client

client = Client()
project = client.read_project(project_name="default")

root_runs = list(client.list_runs(project_id=project.id, is_root=True, limit=5))

for root_run in root_runs:
    print(root_run.trace_id, root_run.total_tokens, root_run.total_cost)
```

<!-- Inlined Snippet: traces-query-totals-after-py.mdx -->
```python After
from langsmith import Client

async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    count = 0
    async for trace in client.traces.query(
        project_id=str(project.id),
        min_start_time="2026-07-01T00:00:00Z",
        max_start_time="2026-07-31T23:59:59Z",
        selects=["NAME", "TOTAL_TOKENS", "TOTAL_COST"],
    ):
        count += 1
        if trace.trace_aggregates is not None:
            print(
                trace.root_run.name,
                trace.trace_aggregates.total_tokens,
                trace.trace_aggregates.total_cost,
            )
        if count >= 5:
            break

asyncio.run(main())
```

<!-- Inlined Snippet: traces-query-totals-before-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

curl -s -X POST "https://api.smith.langchain.com/api/v1/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" '{"session": [$pid], "is_root": true, "limit": 5}')" \
  | jq '.runs[] | {trace_id, total_tokens, total_cost}'
```

<!-- Inlined Snippet: traces-query-totals-after-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

curl -X POST "https://api.smith.langchain.com/api/v2/traces/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" '{
    "project_id": $pid,
    "min_start_time": "2026-07-01T00:00:00Z",
    "max_start_time": "2026-07-31T23:59:59Z",
    "page_size": 5,
    "selects": ["NAME", "TOTAL_TOKENS", "TOTAL_COST"]
  }')"
```

<!-- Inlined Snippet: traces-query-filters-before-py.mdx -->
```python Before
from langsmith import Client

client = Client()
project = client.read_project(project_name="default")

# v1 has no root-run-only filter concept — is_root plus a regular filter is
# the closest equivalent, still scanning every run to match.
error_traces = client.list_runs(
    project_id=project.id,
    is_root=True,
    filter='eq(status, "error")',
    limit=5,
)
for run in error_traces:
    print(run.trace_id)
```

<!-- Inlined Snippet: traces-query-filters-after-py.mdx -->
```python After
from langsmith import Client

async def main():
    client = Client()
    project = await client.aread_project(project_name="default")

    # trace_filter is implicitly root-run-only — no is_root needed.
    count = 0
    async for trace in client.traces.query(
        project_id=str(project.id),
        min_start_time="2026-07-01T00:00:00Z",
        max_start_time="2026-07-31T23:59:59Z",
        trace_filter='eq(status, "error")',
    ):
        print(trace.root_run.trace_id)
        count += 1
        if count >= 5:
            break

    # trace_ids is a fast-path when you already know which traces you want.
    trace_id = "<trace-id>"
    async for trace in client.traces.query(
        project_id=str(project.id),
        min_start_time="2026-07-01T00:00:00Z",
        max_start_time="2026-07-31T23:59:59Z",
        trace_ids=[trace_id],
    ):
        print(trace.root_run.trace_id)

asyncio.run(main())
```

<!-- Inlined Snippet: traces-query-filters-before-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

# v1 has no root-run-only filter concept — is_root plus a regular filter is
# the closest equivalent, still scanning every run to match.
curl -s -X POST "https://api.smith.langchain.com/api/v1/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" '{"session": [$pid], "is_root": true, "filter": "eq(status, \"error\")", "limit": 5}')" \
  | jq '(.runs // []) | map(.trace_id)'
```

<!-- Inlined Snippet: traces-query-filters-after-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')

# trace_filter is implicitly root-run-only — no is_root needed.
curl -s -X POST "https://api.smith.langchain.com/api/v2/traces/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" '{
    "project_id": $pid,
    "min_start_time": "2026-07-01T00:00:00Z",
    "max_start_time": "2026-07-31T23:59:59Z",
    "page_size": 5,
    "trace_filter": "eq(status, \"error\")"
  }')" | jq '.items | map(.root_run.trace_id)'

# trace_ids is a fast-path when you already know which traces you want.
TRACE_ID="<trace-id>"
curl -s -X POST "https://api.smith.langchain.com/api/v2/traces/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" --arg tid "$TRACE_ID" '{
    "project_id": $pid,
    "min_start_time": "2026-07-01T00:00:00Z",
    "max_start_time": "2026-07-31T23:59:59Z",
    "trace_ids": [$tid]
  }')" | jq '.items | map(.root_run.trace_id)'
```

## Traces: query

Returns a list of traces (root runs) for a single tracing project. Each item carries the trace's root run plus optional trace-wide aggregates (`total_tokens`, `total_cost`, `first_token_time`) under `trace_aggregates`, so clients never have to merge by `trace_id`.

Traces are scanned within a `start_time` window: `min_start_time` defaults to 24 hours before the request, `max_start_time` defaults to the request time. Set either explicitly to widen or narrow the window.

Supports filters (`trace_filter`, `tree_filter`) and field projection (`selects`).

### Main changes

#### Method name

  #### Tab: Python

    | Before | After |
    |--------|-------|
    | `client.list_runs(is_root=True)` (generic) | `client.traces.query()` |

    

> [!NOTE]
>
> `client.traces.query()` is now async. Call it with `await`.


    See the [reference](https://reference.langchain.com/python/langsmith/_openapi_client/resources/traces/TracesResource/query) for the full parameter and field list.
  
  #### Tab: TypeScript

    | Before | After |
    |--------|-------|
    | `client.listRuns({ isRoot: true })` (generic) | `client.traces.query()` |

    See the [reference](https://reference.langchain.com/javascript/langsmith/_openapi_client/Langsmith/Traces/query) for the full parameter and field list.
  
  #### Tab: Java

    | Before | After |
    |--------|-------|
    | `client.runs().query()` (generic, `isRoot(true)`) | `client.traces().query()` |

    See the [reference](https://javadoc.io/doc/com.langchain.smith/langsmith-java/latest/com/langchain/smith/services/blocking/TraceService.html) for the full parameter list.
  
  #### Tab: Go

    | Before | After |
    |--------|-------|
    | `client.Runs.Query()` (generic, `IsRoot: true`) | `client.Traces.Query()` |

    See the [reference](https://pkg.go.dev/github.com/langchain-ai/langsmith-go#TraceService.QueryAutoPaging) for the full parameter list.
  
  #### Tab: cURL

    | Before | After |
    |--------|-------|
    | `POST /api/v1/runs/query` (`is_root=true`) | `POST /api/v2/traces/query` |
  

#### Query parameters

  #### Tab: Python

    - `session` (a list of project UUIDs) becomes `project_id`, a single UUID; `traces.query` scopes to exactly one project per call.
    - `is_root` is removed: `traces.query` is always scoped to root runs implicitly.
    - The generic `filter` (evaluated against any run) has no direct equivalent; use `trace_filter` or `tree_filter` instead.
    - `trace_filter` and `tree_filter` carry over unchanged; both already existed on `list_runs`.
    - `trace_ids` is new: a fast-path restriction to a known set of trace UUIDs, more efficient at scale than an equivalent `trace_filter`.
    - `start_time` (no default) becomes `min_start_time`, which defaults to 24 hours ago when omitted.
    - `max_start_time` is new, defaulting to the request time; `list_runs`'s `end_time` filtered by a run's own end timestamp, not a scan-window bound.
    - `select` is renamed `selects`; entries route to `trace_aggregates` (`total_tokens`, `total_cost`, `first_token_time`) or `root_run` (everything else).
  
  #### Tab: TypeScript

    - `session` (a list of project UUIDs) becomes `project_id`, a single UUID; `traces.query` scopes to exactly one project per call.
    - `isRoot` is removed: `traces.query` is always scoped to root runs implicitly.
    - The generic `filter` (evaluated against any run) has no direct equivalent; use `trace_filter` or `tree_filter` instead.
    - `traceFilter` and `treeFilter` carry over as `trace_filter`/`tree_filter`; both already existed on `listRuns`. Note the v1 method took camelCase options (`traceFilter`); the v2 resource method takes the wire-format `snake_case` keys directly.
    - `trace_ids` is new: a fast-path restriction to a known set of trace UUIDs, more efficient at scale than an equivalent `trace_filter`.
    - `startTime` (no default) becomes `min_start_time`, which defaults to 24 hours ago when omitted.
    - `max_start_time` is new, defaulting to the request time; `listRuns`'s `endTime` filtered by a run's own end timestamp, not a scan-window bound.
    - `select` is renamed `selects`; entries route to `trace_aggregates` (`total_tokens`, `total_cost`, `first_token_time`) or `root_run` (everything else).
  
  #### Tab: Java

    - `session` (`List<String>` of project UUIDs) becomes `projectId`, a single UUID; `traces().query()` scopes to exactly one project per call.
    - `isRoot` is removed: `traces().query()` is always scoped to root runs implicitly.
    - The generic `filter` (evaluated against any run) has no direct equivalent; use `traceFilter` or `treeFilter` instead.
    - `traceFilter` and `treeFilter` carry over unchanged; both already existed on `RunQueryParams`.
    - `traceIds` is new: a fast-path restriction to a known set of trace UUIDs, more efficient at scale than an equivalent `traceFilter`.
    - `startTime` (no default) becomes `minStartTime`, which defaults to 24 hours ago when omitted.
    - `maxStartTime` is new, defaulting to the request time; `RunQueryParams`'s `endTime` filtered by a run's own end timestamp, not a scan-window bound.
    - `select` is renamed `selects`; entries route to `traceAggregates` (`totalTokens`, `totalCost`, `firstTokenTime`) or `rootRun` (everything else).
  
  #### Tab: Go

    - `Session` (`[]string` of project UUIDs) becomes `ProjectID`, a single UUID; `Traces.Query()` scopes to exactly one project per call.
    - `IsRoot` is removed: `Traces.Query()` is always scoped to root runs implicitly.
    - The generic `Filter` (evaluated against any run) has no direct equivalent; use `TraceFilter` or `TreeFilter` instead.
    - `TraceFilter` and `TreeFilter` carry over unchanged; both already existed on `RunQueryParams`.
    - `TraceIDs` is new: a fast-path restriction to a known set of trace UUIDs, more efficient at scale than an equivalent `TraceFilter`.
    - `StartTime` (no default) becomes `MinStartTime`, which defaults to 24 hours ago when omitted.
    - `MaxStartTime` is new, defaulting to the request time; `RunQueryParams`'s `EndTime` filtered by a run's own end timestamp, not a scan-window bound.
    - `Select` is renamed `Selects`; entries route to `TraceAggregates` (`TotalTokens`, `TotalCost`, `FirstTokenTime`) or `RootRun` (everything else).
  
  #### Tab: cURL

    - `session` (a list of project UUIDs) becomes `project_id`, a single UUID.
    - `is_root` is removed: the endpoint is always scoped to root runs implicitly.
    - The generic `filter` has no direct equivalent; use `trace_filter` or `tree_filter` instead. Both already existed on `POST /api/v1/runs/query`.
    - `trace_ids` is new: a fast-path restriction to a known set of trace UUIDs.
    - `start_time` (no default) becomes `min_start_time`, which defaults to 24 hours ago when omitted.
    - `max_start_time` is new, defaulting to the request time.
    - `select` is renamed `selects`.
  

#### Response fields

  #### Tab: Python

    - `root_run` carries the same `Run` shape as Runs: query (`id`, `name`, `run_type`, `status`, and so on), gated by `selects`.
    - `total_tokens`/`total_cost` move off `root_run` onto `trace_aggregates`, summed across every run in the trace instead of just the root run. `trace_aggregates` is omitted entirely from the response when no aggregate field was selected.
    - `trace_aggregates.first_token_time` is new
  
  #### Tab: TypeScript

    - `root_run` carries the same `Run` shape as Runs: query (`id`, `name`, `run_type`, `status`, and so on), gated by `selects`.
    - `total_tokens`/`total_cost` move off `root_run` onto `trace_aggregates`, summed across every run in the trace instead of just the root run. `trace_aggregates` is omitted entirely from the response when no aggregate field was selected.
    - `trace_aggregates.first_token_time` is new
  
  #### Tab: Java

    - `rootRun()` carries the same `RunSchema` shape as Runs: query (`totalTokens()`, `name()`, `runType()`, `status()`, and so on), gated by `selects`.
    - `totalTokens()`/`totalCost()` move off `rootRun()` onto `traceAggregates()`, summed across every run in the trace instead of just the root run.
    - `traceAggregates().firstTokenTime()` is new
  
  #### Tab: Go

    - `RootRun` carries the same `Run` shape as Runs: query, gated by `Selects`.
    - `TotalTokens`/`TotalCost` move off `RootRun` onto `TraceAggregates`, summed across every run in the trace instead of just the root run. Check for an absent `TraceAggregates` via `trace.TraceAggregates.JSON.RawJSON() == ""`, since it is a value type, not a pointer.
    - `TraceAggregates.FirstTokenTime` is new
  
  #### Tab: cURL

    JSON response fields use `snake_case`, matching the bullets below.

    - `root_run` carries the same shape as Runs: query, gated by `selects`.
    - `total_tokens`/`total_cost` move off `root_run` onto `trace_aggregates`, summed across every run in the trace instead of just the root run.
    - `trace_aggregates.first_token_time` is new
  

### Examples

#### List traces (root runs)

Fetch every trace (root run) in a project, replacing `list_runs(is_root=True)`.

  #### Tab: Python

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: TypeScript

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Java

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Go

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: cURL

  #### Tab: Before

    
  
  #### Tab: After

    
  

  

#### Get a trace's total tokens and cost

Read a trace's token and cost totals from `trace_aggregates` instead of the root run, where v1 kept them.

  #### Tab: Python

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: TypeScript

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Java

    

> [!NOTE]
>
> The Before example reads `totalTokens` only. `totalCost` is omitted because reading it on the v1 `RunSchema` type triggers a known deserialization bug in the current Java binding (it expects a string, the API returns a number).


  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Go

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: cURL

  #### Tab: Before

    
  
  #### Tab: After

    
  

  

#### Find traces by status, or fetch traces by ID

Filter traces by status (for example, errored) with `trace_filter`, or skip filtering and fetch known traces directly and faster with `trace_ids`.

  #### Tab: Python

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: TypeScript

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Java

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Go

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: cURL

  #### Tab: Before

    
  
  #### Tab: After

    

  

  


<!-- Inlined Snippet: traces-list-runs-basic-before-py.mdx -->
```python Before
from langsmith import Client

client = Client()
project = client.read_project(project_name="default")
trace_id = "<trace-id>"
runs = list(client.list_runs(project_id=project.id, trace_id=trace_id))
for run in runs:
    print(run.name, run.run_type, run.status)
```

<!-- Inlined Snippet: traces-list-runs-basic-after-py.mdx -->
```python After
from langsmith import Client

async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    trace_id = "<trace-id>"
    response = await client.traces.list_runs(
        trace_id,
        project_id=str(project.id),
        selects=["NAME", "RUN_TYPE", "STATUS"],
    )
    for run in response.items:
        print(run.name, run.run_type, run.status)

asyncio.run(main())
```

<!-- Inlined Snippet: traces-list-runs-basic-before-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')
TRACE_ID="<trace-id>"

curl -s -X POST "https://api.smith.langchain.com/api/v1/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" --arg tid "$TRACE_ID" '{"session": [$pid], "trace": $tid}')" \
  | jq '.runs // []'
```

<!-- Inlined Snippet: traces-list-runs-basic-after-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')
TRACE_ID="<trace-id>"

curl -G "https://api.smith.langchain.com/api/v2/traces/$TRACE_ID/runs" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  --data-urlencode "project_id=$PROJECT_ID" \
  --data-urlencode "selects=NAME" \
  --data-urlencode "selects=RUN_TYPE" \
  --data-urlencode "selects=STATUS"
```

<!-- Inlined Snippet: traces-list-runs-filter-before-py.mdx -->
```python Before
from langsmith import Client

client = Client()
project = client.read_project(project_name="default")
trace_id = "<trace-id>"
llm_runs = list(
    client.list_runs(
        project_id=project.id,
        trace_id=trace_id,
        filter='eq(run_type, "llm")',
    )
)
```

<!-- Inlined Snippet: traces-list-runs-filter-after-py.mdx -->
```python After
from langsmith import Client

async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    trace_id = "<trace-id>"
    response = await client.traces.list_runs(
        trace_id,
        project_id=str(project.id),
        filter='eq(run_type, "llm")',
        selects=["NAME", "STATUS"],
    )
    llm_runs = response.items

asyncio.run(main())
```

<!-- Inlined Snippet: traces-list-runs-filter-before-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')
TRACE_ID="<trace-id>"

curl -s -X POST "https://api.smith.langchain.com/api/v1/runs/query" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg pid "$PROJECT_ID" --arg tid "$TRACE_ID" '{"session": [$pid], "trace": $tid, "filter": "eq(run_type, \"llm\")"}')" \
  | jq '.runs // []'
```

<!-- Inlined Snippet: traces-list-runs-filter-after-sh.mdx -->
```bash
PROJECT_ID=$(curl -s "https://api.smith.langchain.com/api/v1/sessions?name=default&limit=1" \
  -H "x-api-key: $LANGSMITH_API_KEY" | jq -r '.[0].id')
TRACE_ID="<trace-id>"

curl -G "https://api.smith.langchain.com/api/v2/traces/$TRACE_ID/runs" \
  -H "x-api-key: $LANGSMITH_API_KEY" \
  --data-urlencode "project_id=$PROJECT_ID" \
  --data-urlencode "filter=eq(run_type, \"llm\")" \
  --data-urlencode "selects=NAME" \
  --data-urlencode "selects=STATUS"
```

## Traces: list runs

Returns runs for a trace ID within min/max start time. Optional `filter`; repeatable `selects` to select fields to return.

### Main changes

#### Method name

  #### Tab: Python

    | Before | After |
    |--------|-------|
    | `client.list_runs(trace_id=...)` (generic) | `client.traces.list_runs()` |

    

> [!NOTE]
>
> `client.traces.list_runs()` is now async. Call it with `await`.


    See the [reference](https://reference.langchain.com/python/langsmith/_openapi_client/resources/traces/TracesResource/list_runs) for the full parameter and field list.
  
  #### Tab: TypeScript

    | Before | After |
    |--------|-------|
    | `client.listRuns({ traceId })` (generic) | `client.traces.listRuns()` |

    See the [reference](https://reference.langchain.com/javascript/langsmith/_openapi_client/Langsmith/Traces/listRuns) for the full parameter and field list.
  
  #### Tab: Java

    | Before | After |
    |--------|-------|
    | `client.runs().query()` (generic, `.trace(traceId)`) | `client.traces().listRuns()` |

    See the [reference](https://javadoc.io/doc/com.langchain.smith/langsmith-java/latest/com/langchain/smith/services/blocking/TraceService.html) for the full parameter list.
  
  #### Tab: Go

    | Before | After |
    |--------|-------|
    | `client.Runs.Query()` (generic, `Trace: traceID`) | `client.Traces.ListRuns()` |

    See the [reference](https://pkg.go.dev/github.com/langchain-ai/langsmith-go#TraceService.ListRuns) for the full parameter list.
  
  #### Tab: cURL

    | Before | After |
    |--------|-------|
    | `POST /api/v1/runs/query` (`trace` field) | `GET /api/v2/traces/{trace_id}/runs` |
  

#### Query parameters

  #### Tab: Python

    - `trace_id`/`trace` moves from a query param to a path param.
    - `project_id` is new and **required** (the SmithDB partition key); `list_runs(trace_id=...)` did not need it.
    - `filter` is unchanged.
    - `min_start_time`/`max_start_time` are new. Unlike `traces.query`, neither has a default: omit both and runs are not filtered by time at all. They are individually optional but must be passed together if either is set.
    - `select` is renamed `selects`, using the same 44-value enum as `traces.query`.
  
  #### Tab: TypeScript

    - `traceId`/`trace` moves from a query param to a path param.
    - `project_id` is new and **required** (the SmithDB partition key); `listRuns({ traceId })` did not need it.
    - `filter` is unchanged.
    - `min_start_time`/`max_start_time` are new. Unlike `traces.query`, neither has a default: omit both and runs are not filtered by time at all. They are individually optional but must be passed together if either is set.
    - `select` is renamed `selects`, using the same 44-value enum as `traces.query`.
  
  #### Tab: Java

    - `traceId` moves from a query param (`.trace(traceId)`) to a positional path param.
    - `projectId` is new and **required** (the SmithDB partition key); the generic `runs().query()` did not need it.
    - `filter` is unchanged.
    - `minStartTime`/`maxStartTime` are new. Unlike `traces().query()`, neither has a default: omit both and runs are not filtered by time at all. They are individually optional but must be passed together if either is set.
    - `select` is renamed `selects` (44-value enum).
  
  #### Tab: Go

    - `traceID` moves from a query param (`Trace: traceID`) to a positional path param.
    - `ProjectID` is new and **required** (the SmithDB partition key); the generic `Runs.Query()` did not need it.
    - `Filter` is unchanged.
    - `MinStartTime`/`MaxStartTime` are new. Unlike `Traces.Query()`, neither has a default: omit both and runs are not filtered by time at all. They are individually optional but must be passed together if either is set.
    - `Select` is renamed `Selects`.
  
  #### Tab: cURL

    - `trace` moves from a body field to a path segment, `{trace_id}`.
    - `project_id` is new and **required** (the SmithDB partition key); `POST /api/v1/runs/query` did not need it.
    - `filter` is unchanged.
    - `min_start_time`/`max_start_time` are new. Unlike `traces.query`, neither has a default: omit both and runs are not filtered by time at all. They are individually optional but must be passed together if either is set.
    - `select` is renamed `selects`.
  

#### Response fields

  #### Tab: Python

    The response has a single `items` field: a list of `Run` objects in `start_time` order, same shape as the [Runs: query](lc:langsmith/smithdb-sdk-migration#runs-query) response above.
  
  #### Tab: TypeScript

    The response has a single `items` field: an array of `Run` objects in `start_time` order, same shape as the [Runs: query](lc:langsmith/smithdb-sdk-migration#runs-query) response above.
  
  #### Tab: Java

    The response has a single `items()` method, returning `Optional<List<Run>>`: the trace's runs in `start_time` order, same shape as the [Runs: query](lc:langsmith/smithdb-sdk-migration#runs-query) response above.
  
  #### Tab: Go

    The response has a single `Items` field, typed `[]Run`: the trace's runs in `start_time` order, same shape as the [Runs: query](lc:langsmith/smithdb-sdk-migration#runs-query) response above.
  
  #### Tab: cURL

    The JSON response has a single `items` array field: the trace's runs in `start_time` order, same shape as the [Runs: query](lc:langsmith/smithdb-sdk-migration#runs-query) response above.
  

### Examples

#### List every run in a trace

Fetch all the runs that belong to one trace, given its trace ID.

  #### Tab: Python

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: TypeScript

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Java

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Go

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: cURL

  #### Tab: Before

    
  
  #### Tab: After

    
  

  

#### Get only the LLM calls in a trace

Narrow a trace's runs down to a specific run type, for example just the LLM calls.

  #### Tab: Python

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: TypeScript

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Java

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: Go

  #### Tab: Before

    
  
  #### Tab: After

    
  

  
  #### Tab: cURL

  #### Tab: Before

    
  
  #### Tab: After

    

  

  

## Context
In May 2026, we released [SmithDB](https://www.langchain.com/blog/introducing-smithdb?utm_source=docs), a new observability database built for modern AI agents. SmithDB delivers industry-leading performance across every key observability workload, making core LangSmith experiences dramatically faster.

New SDK methods are required to query your traces with SmithDB. This guide helps you migrate your codebase.

## Deprecation and removal

Each SDK method and its underlying endpoint share the same deprecation date.

| Deployment | Deprecation | Removal |
|---|---|---|
| All Cloud regions | End of July 2026 | 31 Jan 2027 |
| Self-Hosted | `v0.16` | `v0.18` |

For details on how LangSmith deprecates and removes API endpoints and SDK methods, see [API and SDK deprecation policy](lc:langsmith/endpoint-deprecation).

## Minimum SDK version

The new SDK methods are available starting at these SDK versions:

| Language | Package | Minimum version |
|---|---|---|
| Python | `langsmith` | `>=0.10.15` |
| TypeScript | `langsmith` | `>=0.8.9` |
| Java | `langsmith-java` | `0.1.0-beta.22` |
| Go | `langsmith-go` | `v0.25.4` |
| CLI | `langsmith-cli` | `v0.2.44` |

The [LangSmith CLI](lc:langsmith/langsmith-cli) queries the same SmithDB-backed endpoints and requires `v0.2.44` or later.

## About self-hosted

- The new methods documented in this guide require `>=0.16` self-hosted version, independent of the data store used.
- The deprecated methods stop working once ClickHouse is disabled.
- Where possible, the SDK raises a warning or error identifying the version to upgrade to, instead of failing without explanation.

## Migrate with an AI agent

This guide is written to be fetched and applied directly by an AI coding agent. Copy the following prompt into your agent to migrate your codebase to the SmithDB-backed methods.

```text
Migrate this codebase's LangSmith SDK usage to the new SmithDB-backed methods.

Fetch https://docs.langchain.com/langsmith/smithdb-sdk-migration.md and treat it
as the source of truth for what changed, including which methods and
parameters are affected, what replaces them, and deployment support.

1. Check the installed LangSmith SDK version against the minimum version
   required for the SmithDB-backed methods per the guide, and upgrade the
   dependency if it does not meet that minimum.
2. Identify every call site in this codebase that uses a method the guide
   marks as migrated, in whichever language(s) this codebase uses.
3. For each call site, apply the corresponding before/after change from the
   guide, including any added, removed, or renamed parameters.

If a call site or parameter is not covered by the guide, stop and ask rather
than guessing.
```


## Exceptions

  #### Tab: Python

    The SmithDB-backed methods raise new exception classes instead of the legacy `langsmith.utils` exception classes.

    | Before (`langsmith.utils`) | After (`langsmith`) | Notes |
    |---|---|---|
    | `LangSmithError` | `LangsmithError` | Base exception class for the SDK; casing changed |
    | `LangSmithAPIError` | `InternalServerError` | 5xx |
    | `LangSmithRequestTimeout` | `APITimeoutError` | Raised when a request times out |
    | `LangSmithUserError` | *(removed)* | No direct equivalent. The 403 org-scoped-key case now raises `PermissionDeniedError`; client-side argument validation now raises a standard `ValueError` or `TypeError` |
    | `LangSmithRateLimitError` | `RateLimitError` | 429; unchanged name |
    | `LangSmithAuthError` | `AuthenticationError` | 401 |
    | `LangSmithNotFoundError` | `NotFoundError` | 404; unchanged name |
    | `LangSmithConflictError` | `ConflictError` | 409; unchanged name |
    | `LangSmithConnectionError` | `APIConnectionError` | Raised when the client cannot connect to the API |
    | `LangSmithExceptionGroup` | *(removed)* | No equivalent |
    | *(not available)* | `APIError` | New: base class for all API-related errors, with `message`, `request`, and `body` attributes |
    | *(not available)* | `APIStatusError` | New: base class for all 4xx/5xx status errors |
    | *(not available)* | `BadRequestError` | New: 400 |
    | *(not available)* | `PermissionDeniedError` | New: 403 |
    | *(not available)* | `UnprocessableEntityError` | New: 422 |
    | *(not available)* | `APIResponseValidationError` | New: raised when a response does not match the expected schema |
  
  #### Tab: TypeScript

    The SmithDB-backed methods raise new exception classes instead of plain `Error`.

    | Before (plain `Error`) | After (`langsmith`) | Notes |
    |---|---|---|
    | *(not available)* | `LangsmithError` | base class for all SDK errors |
    | *(not available)* | `InternalServerError` | 5xx |
    | *(not available)* | `APIConnectionTimeoutError` | Raised when a request times out |
    | *(not available)* | `RateLimitError` | 429 |
    | *(not available)* | `AuthenticationError` | 401 |
    | *(not available)* | `NotFoundError` | 404 |
    | *(not available)* | `ConflictError` | 409 |
    | *(not available)* | `APIConnectionError` | Raised when the client cannot connect to the API |
    | *(not available)* | `APIError` | base class for all API-related errors, with `status`, `headers`, and `error` properties |
    | *(not available)* | `BadRequestError` | 400 |
    | *(not available)* | `PermissionDeniedError` | 403 |
    | *(not available)* | `UnprocessableEntityError` | 422 |
    | *(not available)* | `APIUserAbortError` | Raised when a request is aborted via an `AbortController` |
  
  #### Tab: Java

    No change. Error handling is unaffected by this migration.
  
  #### Tab: Go

    No change. Error handling is unaffected by this migration.
  
  #### Tab: cURL

    No change. Error handling is unaffected by this migration.
  

## Discontinued

The following methods are discontinued. They call the retired `/feedback/formulas` endpoints, which return `410 Gone` on composite-feedback v2 and are scheduled for removal on 2026-08-20. Composite scores are now managed as [composite evaluators](lc:langsmith/composite-evaluators-ui), which implement a composite score as a code evaluator plus a run rule. There is no SDK replacement.

### Feedback formula methods

| Python | TypeScript |
|---|---|
| [`list_feedback_formulas`](https://reference.langchain.com/python/langsmith/client/Client/list_feedback_formulas) | NA |
| [`get_feedback_formula_by_id`](https://reference.langchain.com/python/langsmith/client/Client/get_feedback_formula_by_id) | NA |
| [`create_feedback_formula`](https://reference.langchain.com/python/langsmith/client/Client/create_feedback_formula) | NA |
| [`update_feedback_formula`](https://reference.langchain.com/python/langsmith/client/Client/update_feedback_formula) | NA |
| [`delete_feedback_formula`](https://reference.langchain.com/python/langsmith/client/Client/delete_feedback_formula) | NA |
