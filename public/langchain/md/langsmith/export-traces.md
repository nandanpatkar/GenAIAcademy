The recommended way to query [runs](lc:langsmith/observability-concepts#runs) (the span data in LangSmith traces) is to use the `list_runs` method in the [SDK](https://reference.langchain.com/python/langsmith/) or `/runs/query` endpoint in the [API](lc:langsmith/smith-api-ref). LangSmith stores traces in a simple format that is specified in the [Run (span) data format](lc:langsmith/run-data-format).

This page covers:

- [Use filter arguments](#use-filter-arguments): keyword-based filtering using SDK parameters.
- [Use filter query language](#use-filter-query-language): complex queries using LangSmith's filter syntax.
- [Query trace trees with child-run predicates](#query-trace-trees-with-child-run-predicates): combine server-side narrowing with local child-run traversal.
- [Rate limits](#rate-limits): per-tenant limits and best practices for staying within them.


> [!NOTE]
>
> If you are looking to export a large volume of traces, we recommend that you use the [Bulk Data Export](lc:langsmith/data-export) functionality, as it will better handle large data volumes and will support automatic retries and parallelization across partitions.


## Use filter arguments

For simple queries, you don't have to rely on our query syntax. You can use the filter arguments specified in the [filter arguments reference](lc:langsmith/trace-query-syntax#filter-arguments).


> [!WARNING]
>
> **Prerequisites**
>
> Initialize the client before running the below code snippets.


```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "from langsmith import Client\n\nclient = Client()"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "LangsmithClient client = LangsmithOkHttpClient.fromEnv();"
 }
]
```

Below are some examples of ways to list runs using keyword arguments:

### List all runs in a project

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "project_runs = client.list_runs(project_name=\"<your_project>\")"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "RunQueryParams projectRuns = RunQueryParams.builder()\n    .addSession(\"<your_project>\")\n    .build();"
 }
]
```

### List LLM and chat runs in the last 24 hours

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "todays_llm_runs = client.list_runs(\n    project_name=\"<your_project>\",\n    start_time=datetime.now() - timedelta(days=1),\n    run_type=\"llm\",\n)"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "OffsetDateTime now = OffsetDateTime.now();\nOffsetDateTime twentyFourHoursAgo = now.minus(24, ChronoUnit.HOURS);\n\nRunQueryParams todaysLlmRuns = RunQueryParams.builder()\n    .runType(RunQueryParams.RunType.LLM)\n    .startTime(twentyFourHoursAgo)\n    .addSession(\"<your_project>\")\n    .limit(50L)\n    .build();"
 }
]
```

### List root runs in a project

Root runs are runs that have no parents. These are assigned a value of `True` for `is_root`. You can use this to filter for root runs.

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "root_runs = client.list_runs(\n    project_name=\"<your_project>\",\n    is_root=True\n)"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "RunQueryParams rootRuns = RunQueryParams.builder()\n    .addSession(\"<your_project>\")\n    .isRoot(true)\n    .build();"
 }
]
```

### List runs without errors

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "correct_runs = client.list_runs(project_name=\"<your_project>\", error=False)"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "RunQueryParams noErrorRuns = RunQueryParams.builder()\n    .addSession(\"<your_project>\")\n    .error(false)\n    .build();"
 }
]
```

### List runs by run ID


> [!WARNING]
>
> **Ignores Other Arguments**
>
> If you provide a list of run IDs in the way described above, it will ignore all other filtering arguments like `project_name`, `run_type`, etc. and directly return the runs matching the given IDs.


If you have a list of run IDs, you can list them directly:

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "run_ids = ['a36092d2-4ad5-4fb4-9c0d-0dba9a2ed836','9398e6be-964f-4aa4-8ae9-ad78cd4b7074']\nselected_runs = client.list_runs(id=run_ids)"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "RunQueryParams runIdsRuns = RunQueryParams.builder()\n    .addSession(\"<your_project>\")\n    .id(runIds)\n    .build();"
 }
]
```

### Fetch a single run by ID

To fetch a single run (trace) by its ID, use the `read_run` method. This is useful when you have a specific trace ID (for example, from a LangSmith share link like `https://smith.langchain.com/public/<trace-id>/r`) and want to retrieve its full data.

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "run_id = \"a36092d2-4ad5-4fb4-9c0d-0dba9a2ed836\"\nrun = client.read_run(run_id)\n\n# Access run data\nprint(run.inputs)\nprint(run.outputs)\nprint(run.name)"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "RunQueryParams runIdRun = RunQueryParams.builder()\n    .addSession(\"<your_project>\")\n    .addId(runId)\n    .build();"
 }
]
```


> [!TIP]
>
> **Replay traces locally with LangGraph**
>
>     If you're using LangGraph with checkpointing, you can fetch a trace from LangSmith and replay it locally for debugging. See [LangGraph's time travel and replay documentation](lc:oss/python/langgraph/use-time-travel) for details on resuming execution from checkpoints.


## Use filter query language

For more complex queries, you can use the filter query language. The following examples cover the most common patterns. For the full operator and field reference, including all comparators, filterable fields, value formatting rules, and a quick-reference example table, refer to [Trace query syntax: filter query language](lc:langsmith/trace-query-syntax#filter-query-language).

### List all root runs in a conversational thread

This is the way to fetch runs in a conversational thread. For more information on setting up threads, refer to our [how-to guide on setting up threads](lc:langsmith/threads).
Threads are grouped by setting a shared thread ID. The LangSmith UI lets you use either of the following metadata keys: `session_id` or `thread_id`. The session ID is also known as the tracing project ID. The following query matches on either of them.

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "group_key = \"<your_thread_id>\"\nfilter_string = f'and(in(metadata_key, [\"session_id\",\"thread_id\"]), eq(metadata_value, \"{group_key}\"))'\nthread_runs = client.list_runs(\n    project_name=\"<your_project>\",\n    filter=filter_string,\n    is_root=True\n)"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "String groupKey = \"<your_thread_id>\";\n\nString filterString = String.format(\n    \"and(in(metadata_key, [\\\"session_id\\\",\\\"thread_id\\\"]), eq(metadata_value, \\\"%s\\\"))\",\n    groupKey\n);\n\nRunQueryParams threadRuns = RunQueryParams.builder()\n    .addSession(\"<your_project>\")\n    .filter(filterString)\n    .build();"
 }
]
```

### List all runs called "extractor" whose root of the trace was assigned feedback "user_score" score of 1

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "client.list_runs(\n    project_name=\"<your_project>\",\n    filter='eq(name, \"extractor\")',\n    trace_filter='and(eq(feedback_key, \"user_score\"), eq(feedback_score, 1))'\n)"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "RunQueryParams extractorRuns = RunQueryParams.builder()\n    .addSession(\"<your_project>\")\n    .filter(\"eq(name, \\\"extractor\\\")\")\n    .traceFilter(\"and(eq(feedback_key, \\\"user_score\\\"), eq(feedback_score, 1))\")\n    .build();"
 }
]
```

### List runs with "star_rating" key whose score is greater than 4

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "client.list_runs(\n    project_name=\"<your_project>\",\n    filter='and(eq(feedback_key, \"star_rating\"), gt(feedback_score, 4))'\n)"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "RunQueryParams runs = RunQueryParams.builder()\n    .addSession(\"<your_project>\")\n    .filter(\"and(eq(feedback_key, \\\"star_rating\\\"), gt(feedback_score, 4))\")\n    .build();"
 }
]
```

### List runs that took longer than 5 seconds to complete

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "client.list_runs(project_name=\"<your_project>\", filter='gt(latency, \"5s\")')"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "RunQueryParams runs = RunQueryParams.builder()\n    .addSession(\"<your_project>\")\n    .filter(\"gt(latency, \\\"5s\\\")\")\n    .build();"
 }
]
```

### List all runs where status is not "error"

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "client.list_runs(project_name=\"<your_project>\", filter='neq(status, \"error\")')"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "RunQueryParams runs = RunQueryParams.builder()\n    .addSession(\"<your_project>\")\n    .filter(\"neq(status, \\\"error\\\")\")\n    .build();"
 }
]
```

### List all runs where start_time is greater than a specific timestamp

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "client.list_runs(project_name=\"<your_project>\", filter='gt(start_time, \"2023-07-15T12:34:56Z\")')"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "RunQueryParams runs = RunQueryParams.builder()\n    .addSession(\"<your_project>\")\n    .filter(\"gt(start_time, \\\"2023-07-15T12:34:56Z\\\")\")\n    .build();"
 }
]
```

### List all runs that contain the string "substring"

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "client.list_runs(project_name=\"<your_project>\", filter='search(\"substring\")')"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "RunQueryParams runs = RunQueryParams.builder()\n    .addSession(\"<your_project>\")\n    .filter(\"search(\\\"substring\\\")\")\n    .build();"
 }
]
```

### List all runs that are tagged with the git hash "2aa1cf4"

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "client.list_runs(project_name=\"<your_project>\", filter='has(tags, \"2aa1cf4\")')"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "RunQueryParams runs = RunQueryParams.builder()\n    .addSession(\"<your_project>\")\n    .filter(\"has(tags, \\\"2aa1cf4\\\")\")\n    .build();"
 }
]
```

### List all runs that started after a specific timestamp and either have a non-error status or a "Correctness" feedback score equal to 0

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "client.list_runs(\n  project_name=\"<your_project>\",\n  filter='and(gt(start_time, \"2023-07-15T12:34:56Z\"), or(neq(status, \"error\"), and(eq(feedback_key, \"Correctness\"), eq(feedback_score, 0.0))))'\n)"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "RunQueryParams runs = RunQueryParams.builder()\n    .addSession(\"<your_project>\")\n    .filter(\"and(gt(start_time, \\\"2023-07-15T12:34:56Z\\\"), or(neq(status, \\\"error\\\"), and(eq(feedback_key, \\\"Correctness\\\"), eq(feedback_score, 0.0))))\")\n    .build();"
 }
]
```

### Complex query: List all runs where tags include "experimental" or "beta" and latency is greater than 2 seconds

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "client.list_runs(\n  project_name=\"<your_project>\",\n  filter='and(or(has(tags, \"experimental\"), has(tags, \"beta\")), gt(latency, 2))'\n)"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "RunQueryParams runs = RunQueryParams.builder()\n    .addSession(\"<your_project>\")\n    .filter(\"and(or(has(tags, 'experimental'), has(tags, 'beta')), gt(latency, 2))\")\n    .build();"
 }
]
```

### Search trace trees by full text

You can use the `search()` function without any specific field to do a full text search across all string fields in a run. This allows you to quickly find traces that match a search term.

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "client.list_runs(\n  project_name=\"<your_project>\",\n  filter='search(\"image classification\")'\n)"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "RunQueryParams runs = RunQueryParams.builder()\n    .addSession(\"<your_project>\")\n    .filter(\"search(\\\"image classification\\\")\")\n    .build();"
 }
]
```

### Check for presence of metadata

If you want to check for the presence of metadata, you can use the `eq` operator, optionally with an `and` statement to match by value. This is useful if you want to log more structured information about your runs.

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "to_search = {\n    \"user_id\": \"\"\n}\n\n# Check for any run with the \"user_id\" metadata key\nclient.list_runs(\n  project_name=\"default\",\n  filter=\"eq(metadata_key, 'user_id')\"\n)\n# Check for runs with user_id=4070f233-f61e-44eb-bff1-da3c163895a3\nclient.list_runs(\n  project_name=\"default\",\n  filter=\"and(eq(metadata_key, 'user_id'), eq(metadata_value, '4070f233-f61e-44eb-bff1-da3c163895a3'))\"\n)"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "RunQueryParams runs = RunQueryParams.builder()\n    .addSession(\"<your_project>\")\n    .filter(\"eq(metadata_key, 'user_id')\")\n    .build();\n\nRunQueryParams runs = RunQueryParams.builder()\n    .addSession(\"<your_project>\")\n    .filter(\"and(eq(metadata_key, 'user_id'), eq(metadata_value, '4070f233-f61e-44eb-bff1-da3c163895a3'))\")\n    .build();"
 }
]
```

### Check for environment details in metadata

A common pattern is to add environment information to your traces via metadata. If you want to filter for runs containing environment metadata, you can use the same pattern as above:

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "client.list_runs(\n  project_name=\"default\",\n  filter=\"and(eq(metadata_key, 'environment'), eq(metadata_value, 'production'))\"\n)"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "RunQueryParams runs = RunQueryParams.builder()\n    .addSession(\"<your_project>\")\n    .filter(\"and(eq(metadata_key, 'environment'), eq(metadata_value, 'production'))\")\n    .build();"
 }
]
```

### Check for thread ID in metadata

A common way to associate traces in the same conversation is by using a shared thread ID. If you want to filter runs based on a thread ID in this way, you can search for that ID in the metadata.

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "client.list_runs(\n  project_name=\"default\",\n  filter=\"and(eq(metadata_key, 'thread_id'), eq(metadata_value, 'a1b2c3d4-e5f6-7890'))\"\n)"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "RunQueryParams runs = RunQueryParams.builder()\n    .addSession(\"<your_project>\")\n    .filter(\"and(eq(metadata_key, 'thread_id'), eq(metadata_value, 'a1b2c3d4-e5f6-7890'))\")\n    .build();"
 }
]
```

### Negative filtering on key-value pairs

You can use negative filtering on metadata, input, and output key-value pairs to exclude specific runs from your results. Here are some examples for metadata key-value pairs but the same logic applies to input and output key-value pairs.

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "# Find all runs where the metadata does not contain a \"thread_id\" key\nclient.list_runs(\n  project_name=\"default\",\n  filter=\"and(neq(metadata_key, 'thread_id'))\"\n)\n\n# Find all runs where the thread_id in metadata is not \"a1b2c3d4-e5f6-7890\"\nclient.list_runs(\n  project_name=\"default\",\n  filter=\"and(eq(metadata_key, 'thread_id'), neq(metadata_value, 'a1b2c3d4-e5f6-7890'))\"\n)\n\n# Find all runs where there is no \"thread_id\" metadata key and the \"a1b2c3d4-e5f6-7890\" value is not present\nclient.list_runs(\n  project_name=\"default\",\n  filter=\"and(neq(metadata_key, 'thread_id'), neq(metadata_value, 'a1b2c3d4-e5f6-7890'))\"\n)\n\n# Find all runs where the thread_id metadata key is not present but the \"a1b2c3d4-e5f6-7890\" value is present\nclient.list_runs(\n  project_name=\"default\",\n  filter=\"and(neq(metadata_key, 'thread_id'), eq(metadata_value, 'a1b2c3d4-e5f6-7890'))\"\n)"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "// Find all runs where the metadata does not contain a \"thread_id\" key\nRunQueryParams runs = RunQueryParams.builder()\n    .addSession(\"default\")\n    .filter(\"and(neq(metadata_key, 'thread_id'))\")\n    .build();\n\n// Find all runs where the thread_id in metadata is not \"a1b2c3d4-e5f6-7890\"\nRunQueryParams runs = RunQueryParams.builder()\n    .addSession(\"default\")\n    .filter(\"and(eq(metadata_key, 'thread_id'), neq(metadata_value, 'a1b2c3d4-e5f6-7890'))\")\n    .build();\n\n// Find all runs where there is no \"thread_id\" metadata key and the \"a1b2c3d4-e5f6-7890\" value is not present\nRunQueryParams runs = RunQueryParams.builder()\n    .addSession(\"default\")\n    .filter(\"and(neq(metadata_key, 'thread_id'), neq(metadata_value, 'a1b2c3d4-e5f6-7890'))\")\n    .build();\n\n// Find all runs where the thread_id metadata key is not present but the \"a1b2c3d4-e5f6-7890\" value is present\nRunQueryParams runs = RunQueryParams.builder()\n    .addSession(\"default\")\n    .filter(\"and(neq(metadata_key, 'thread_id'), eq(metadata_value, 'a1b2c3d4-e5f6-7890'))\")\n    .build();"
 }
]
```

### Combine multiple filters

If you want to combine multiple conditions to refine your search, you can use the `and` operator along with other filtering functions. Here's how you can search for runs named "ChatOpenAI" that also have a specific `thread_id` in their metadata:

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "client.list_runs(\n  project_name=\"default\",\n  filter=\"and(eq(name, 'ChatOpenAI'), eq(metadata_key, 'thread_id'), eq(metadata_value, '69b12c91-b1e2-46ce-91de-794c077e8151'))\"\n)"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "RunQueryParams runs = RunQueryParams.builder()\n    .addSession(\"<your_project>\")\n    .filter(\"and(eq(name, 'ChatOpenAI'), eq(metadata_key, 'thread_id'), eq(metadata_value, '69b12c91-b1e2-46ce-91de-794c077e8151'))\")\n    .build();"
 }
]
```

### Tree filter

List all runs named "RetrieveDocs" whose root run has a "user_score" feedback of 1 and any run in the full trace is named "ExpandQuery".

This type of query is useful if you want to extract a specific run conditional on various states or steps being reached within the trace.

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "client.list_runs(\n    project_name=\"<your_project>\",\n    filter='eq(name, \"RetrieveDocs\")',\n    trace_filter='and(eq(feedback_key, \"user_score\"), eq(feedback_score, 1))',\n    tree_filter='eq(name, \"ExpandQuery\")'\n)"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "RunQueryParams runs = RunQueryParams.builder()\n    .addSession(\"<your_project>\")\n    .filter(\"eq(name, \\\"RetrieveDocs\\\")\")\n    .traceFilter(\"and(eq(feedback_key, 'user_score'), eq(feedback_score, 1))\")\n    .treeFilter(\"eq(name, 'ExpandQuery')\")\n    .build();"
 }
]
```

## Query trace trees with child-run predicates

Use `trace_filter` to match fields on the root run and `tree_filter` to match supported searchable fields on any run in the trace tree. For predicates over arbitrary returned child-run fields, such as nested `inputs`, `outputs`, or `extra` payloads, use the steps below:

1. Narrow candidate root traces server-side with `filter`, `trace_filter`, `tree_filter`, `run_type`, metadata filters, `parent_run_id`, and the `ls_run_depth` [system metadata key](lc:langsmith/ls-metadata-parameters#ls_run_depth).
2. Hydrate each candidate root trace with child runs by calling `read_run(..., load_child_runs=True)` in Python or `readRun(..., { loadChildRuns: true })` in TypeScript.
3. Traverse the hydrated `child_runs` tree locally and apply your predicate to the fields that are not available as server-side filter fields.

The following example (Python 0.8 and JS 0.7) returns root traces that contain a tool run whose output contains a specific value. The server-side `tree_filter` narrows candidates to traces that contain the relevant tool run, and the local predicate checks the hydrated `outputs` payload.

```python Python
from datetime import datetime, timedelta

from langsmith import Client

client = Client()
project_name = "<your_project>"

def iter_runs(run):
    yield run
    for child in run.child_runs or []:
        yield from iter_runs(child)

candidate_roots = client.list_runs(
    project_name=project_name,
    is_root=True,
    start_time=datetime.now() - timedelta(days=7),
    tree_filter='and(eq(run_type, "tool"), eq(name, "<tool_name>"))',
    select=["id"],
)

matching_roots = []
for candidate in candidate_roots:
    root = client.read_run(candidate.id, load_child_runs=True)
    has_matching_child = any(
        child.id != root.id
        and child.run_type == "tool"
        and child.name == "<tool_name>"
        and "<expected_value>" in str(child.outputs or {})
        for child in iter_runs(root)
    )
    if has_matching_child:
        matching_roots.append(root)
```

### Advanced: export flattened trace view with child tool usage

The following Python example demonstrates how to export a flattened view of traces, including information on the tools (from nested runs) used by the agent within each trace.
This can be used to analyze the behavior of your agents across multiple traces.

This example queries all tool runs within a specified number of days and groups them by their parent (root) run ID. It then fetches the relevant information for each root run, such as the run name, inputs, outputs, and combines that information with the child run information.

To optimize the query, the example:

1. Selects only the necessary fields when querying tool runs to reduce query time.
2. Fetches root runs in batches while processing tool runs concurrently.

```python Python
from collections import defaultdict
from concurrent.futures import Future, ThreadPoolExecutor
from datetime import datetime, timedelta

from langsmith import Client
from tqdm.auto import tqdm

client = Client()
project_name = "my-project"
num_days = 30

# List all tool runs
tool_runs = client.list_runs(
    project_name=project_name,
    start_time=datetime.now() - timedelta(days=num_days),
    run_type="tool",
    # We don't need to fetch inputs, outputs, and other values that # may increase the query time
    select=["trace_id", "name", "run_type"],
)

data = []
futures: list[Future] = []
trace_cursor = 0
trace_batch_size = 50

tool_runs_by_parent = defaultdict(lambda: defaultdict(set))
# Do not exceed rate limit
with ThreadPoolExecutor(max_workers=2) as executor:
    # Group tool runs by parent run ID
    for run in tqdm(tool_runs):
        # Collect all tools invoked within a given trace
        tool_runs_by_parent[run.trace_id]["tools_involved"].add(run.name)
        # maybe send a batch of parent run IDs to the server
        # this lets us query for the root runs in batches
        # while still processing the tool runs
        if len(tool_runs_by_parent) % trace_batch_size == 0:
            if this_batch := list(tool_runs_by_parent.keys())[
                trace_cursor : trace_cursor + trace_batch_size
            ]:
                trace_cursor += trace_batch_size
                futures.append(
                    executor.submit(
                        client.list_runs,
                        project_name=project_name,
                        run_ids=this_batch,
                        select=["name", "inputs", "outputs", "run_type"],
                    )
                )
    if this_batch := list(tool_runs_by_parent.keys())[trace_cursor:]:
        futures.append(
            executor.submit(
                client.list_runs,
                project_name=project_name,
                run_ids=this_batch,
                select=["name", "inputs", "outputs", "run_type"],
            )
        )

for future in tqdm(futures):
    root_runs = future.result()
    for root_run in root_runs:
        root_data = tool_runs_by_parent[root_run.id]
        data.append(
            {
                "run_id": root_run.id,
                "run_name": root_run.name,
                "run_type": root_run.run_type,
                "inputs": root_run.inputs,
                "outputs": root_run.outputs,
                "tools_involved": list(root_data["tools_involved"]),
            }
        )

# (Optional): Convert to a pandas DataFrame

df = pd.DataFrame(data)
df.head()
```

### Advanced: export retriever IO for traces with feedback

This query is useful if you want to fine-tune embeddings or diagnose end-to-end system performance issues based on retriever behavior.
The following Python example demonstrates how to export retriever inputs and outputs within traces that have a specific feedback score.

```python Python
from collections import defaultdict
from concurrent.futures import Future, ThreadPoolExecutor
from datetime import datetime, timedelta

from langsmith import Client
from tqdm.auto import tqdm

client = Client()
project_name = "your-project-name"
num_days = 1

# List all tool runs
retriever_runs = client.list_runs(
    project_name=project_name,
    start_time=datetime.now() - timedelta(days=num_days),
    run_type="retriever",
    # This time we do want to fetch the inputs and outputs, since they
    # may be adjusted by query expansion steps.
    select=["trace_id", "name", "run_type", "inputs", "outputs"],
    trace_filter='eq(feedback_key, "user_score")',
)

data = []
futures: list[Future] = []
trace_cursor = 0
trace_batch_size = 50

retriever_runs_by_parent = defaultdict(lambda: defaultdict(list))
# Do not exceed rate limit
with ThreadPoolExecutor(max_workers=2) as executor:
    # Group retriever runs by parent run ID
    for run in tqdm(retriever_runs):
        # Collect all retriever calls invoked within a given trace
        for k, v in run.inputs.items():
            retriever_runs_by_parent[run.trace_id][f"retriever.inputs.{k}"].append(v)
        for k, v in (run.outputs or {}).items():
            # Extend the docs
            retriever_runs_by_parent[run.trace_id][f"retriever.outputs.{k}"].extend(v)
        # maybe send a batch of parent run IDs to the server
        # this lets us query for the root runs in batches
        # while still processing the retriever runs
        if len(retriever_runs_by_parent) % trace_batch_size == 0:
            if this_batch := list(retriever_runs_by_parent.keys())[
                trace_cursor : trace_cursor + trace_batch_size
            ]:
                trace_cursor += trace_batch_size
                futures.append(
                    executor.submit(
                        client.list_runs,
                        project_name=project_name,
                        run_ids=this_batch,
                        select=[
                            "name",
                            "inputs",
                            "outputs",
                            "run_type",
                            "feedback_stats",
                        ],
                    )
                )
    if this_batch := list(retriever_runs_by_parent.keys())[trace_cursor:]:
        futures.append(
            executor.submit(
                client.list_runs,
                project_name=project_name,
                run_ids=this_batch,
                select=["name", "inputs", "outputs", "run_type"],
            )
        )

for future in tqdm(futures):
    root_runs = future.result()
    for root_run in root_runs:
        root_data = retriever_runs_by_parent[root_run.id]
        feedback = {
            f"feedback.{k}": v.get("avg")
            for k, v in (root_run.feedback_stats or {}).items()
        }
        inputs = {f"inputs.{k}": v for k, v in root_run.inputs.items()}
        outputs = {f"outputs.{k}": v for k, v in (root_run.outputs or {}).items()}
        data.append(
            {
                "run_id": root_run.id,
                "run_name": root_run.name,
                **inputs,
                **outputs,
                **feedback,
                **root_data,
            }
        )

# (Optional): Convert to a pandas DataFrame

df = pd.DataFrame(data)
df.head()
```

## Rate limits

The [`POST /runs/query`](https://docs.langchain.com/langsmith/smith-api/run/query-runs) endpoint ([`list_runs`](https://reference.langchain.com/python/langsmith/client/Client/list_runs) in Python, [`listRuns`](https://reference.langchain.com/javascript/langsmith/client/Client/listRuns) in JavaScript) has per-tenant rate limits that vary based on query parameters:

| **Query type** | **Limit** | **Window** |
|---|---|---|
| Short time window (≤ 7 days) | 10 requests | 10 seconds |
| Large time window (> 7 days) | 3 requests | 10 seconds |
| Full-text search, short time window (≤ 7 days) | 3 requests | 10 seconds |
| Full-text search, large time window (> 7 days) | 1 request | 10 seconds |
| Select `child_run_ids`, short time window (≤ 7 days) | 3 requests | 10 seconds |
| Select `child_run_ids`, large time window (> 7 days) | 1 request | 10 seconds |

The time window is determined by `end_time - start_time`. If `end_time` is not provided, LangSmith will use the current time. Queries without a `start_time` are treated as large time window queries.

### Best practices

To avoid hitting rate limits and reduce query time, especially for runs with large inputs/outputs:

- **Set `start_time`**: omitting it triggers the large time window rate limit tier (3 requests per 10 seconds instead of 10). Use a window of 7 days or less when possible.
- **Use `select`**: by default all fields are returned. Specifying only the fields you need (e.g., `select=["inputs", "outputs"]`) substantially reduces response size and query time, especially for runs with large inputs/outputs.
- **Set `limit`**: cap the number of results if you don't need to paginate through everything.
- **Avoid full-text search**: `filter='search("...")'` has the strictest rate limits; use structured filters (e.g., `eq()`, `has()`) when possible.
- **Avoid selecting `child_run_ids`**: this also triggers a stricter rate limit tier.

When you exceed these limits, the API returns a `429 Too Many Requests` response. For general rate limit information, refer to [Administration overview](lc:langsmith/usage-and-billing#rate-limits).
