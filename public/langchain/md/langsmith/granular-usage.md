> [!NOTE]
>
> **Trace usage:** For LangSmith [Cloud](lc:langsmith/cloud), granular billable trace data collection started on January 5, 2026. Data is not available for traces ingested before this date.
>
> For [Self-hosted](lc:langsmith/self-hosted) instances, trace data collection begins when the feature is enabled via the following environment variables, or after [upgrading to a version with it enabled by default](lc:langsmith/self-hosted-changelog#langsmith-0-13-12).
>
> ```env
> DEFAULT_ORG_FEATURE_ENABLE_GRANULAR_USAGE_REPORTING=true
> GRANULAR_USAGE_TABLE_ENABLED=true
> ```
>
> Starting with self-hosted version 0.16.0, long-lived trace usage is no longer tracked for [Self-hosted](lc:langsmith/self-hosted) deployments. The **Long-lived only** retention filter always shows zero results for these deployments.
>
> **LangSmith Deployment usage** uses a separate data source. For more details, refer to the [LangSmith Deployment section](lc:langsmith/granular-usage#langsmith-deployment-usage-kind%3Dlangsmith_deployments).


LangSmith provides granular billable usage APIs that let you retrieve detailed usage data broken down by workspace, project, user, or API key. Two billable domains are supported by the same endpoint, selected via a `kind` query parameter:

- **Trace usage** (`kind=traces`, default): number of traces ingested.
- **LangSmith Deployment usage** (`kind=langsmith_deployments`): nodes executed, agent runs, and agent uptime for [LangSmith Deployment](lc:langsmith/billing).

Both kinds share the same query parameters (time range, workspace filter, grouping dimension) and return the same time-bucketed shape. The data sources are separate, so a record returned by one kind will not appear in the other.

These APIs enable you to:

- Track usage across different teams or [workspaces](lc:langsmith/administration-overview).
- Identify which users or [API keys](lc:langsmith/create-account-api-key#api-keys) are consuming the most traces or running the most agents.
- Analyze usage patterns over time.
- Export usage data for internal reporting.

## Prerequisites

- You must have the [`organization:read` permission](lc:langsmith/organization-workspace-operations) to access granular usage data.
- You can only view usage for workspaces you have read access to.

## View in the UI

You can also view granular usage data in the [LangSmith UI](https://smith.langchain.com):

1. Navigate to **Settings** > **Billing and Usage**
2. Select the **Granular Usage** tab
3. Switch between the **LangSmith Traces** and **LangSmith Deployments** sub-tabs to view each domain. The active sub-tab is reflected in the URL (`?tab=traces` or `?tab=deployments`) so you can bookmark the page to land on the same view.
4. Use the controls to:
   - Select a time range (Last 7 days, 30 days, 3 months, 6 months, 1 year, or custom)
   - Group by workspace, project, user, or API key
   - Filter to specific workspaces
   - On the **LangSmith Traces** tab, optionally filter by retention tier (`All Retention` / `Long-lived only` / `Short-lived only`)
5. Click **Export CSV** to download the data for the active tab.

Time range and workspace filters are shared across both sub-tabs, switching tabs preserves what you've selected. The **LangSmith Deployments** tab shows three stat cards (Total Nodes Executed / Total Agent Runs / Total Agent Uptime (seconds)) and one chart per metric stacked vertically, since the three metrics use different units.

## Query parameters

The granular usage endpoint accepts the following query parameters:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `start_time` | datetime | Yes | Start of the time range (ISO 8601 format). |
| `end_time` | datetime | Yes | End of the time range. Must be after `start_time`. |
| `workspace_ids` | array of UUIDs | Yes | Filter results to specific workspaces. |
| `kind` | string | No | `traces` (default) or `langsmith_deployments`. Selects the billable domain. |
| `group_by` | string | No | Dimension to group by. One of: `workspace`, `project`, `user`, `api_key`. Default: `workspace`. |
| `trace_tier` | string | No | Trace-only retention filter: `longlived` or `shortlived`. Omit for all retention. Ignored when `kind=langsmith_deployments`. |

### Day-granular contract

Usage data is aggregated at day granularity. The endpoint normalizes the window to whole days at the API layer:

- `start_time` is rounded down to its day's UTC midnight.
- `end_time` is rounded up to the next UTC midnight (no-op when already at midnight).
- Any day overlapping the requested window is included in full.

A 24-hour window from `2026-01-01T12:00:00Z` to `2026-01-02T12:00:00Z` therefore returns usage for the full Jan 1 and Jan 2 buckets.

### Stride

The `stride` field in each response indicates the time bucket size used for aggregation, calculated from the requested time range. Daily is the minimum. Sub-day windows still bucket at one day.

| Time range | Aggregation | Stride |
|------------|-------------|--------|
| Up to 31 days | Daily | `days: 1` |
| 32–93 days (~3 months) | Weekly | `days: 7` |
| 94–366 days (~1 year) | Monthly | `days: 30` |
| More than 366 days | Yearly | `days: 365` |

### Compatibility

`kind=langsmith_deployments` combined with `group_by=trace_tier` returns `400 Bad Request`. Retention tiers only apply to traces.

## API endpoint

```
GET /api/v1/orgs/current/billing/granular-usage
```

Existing callers that omit `kind` continue to get trace usage with the same response shape they always did.

### Trace usage (`kind=traces`)

#### Response

```json
{
  "stride": {
    "days": 1,
    "hours": 0
  },
  "usage": [
    {
      "time_bucket": "2026-01-15T00:00:00Z",
      "dimensions": {
        "workspace_id": "uuid",
        "workspace_name": "My Workspace"
      },
      "traces": 1500
    }
  ]
}
```

#### Example: Get trace usage by workspace

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "from datetime import datetime, timedelta, timezone\n\nclient = httpx.Client(\n    base_url=\"https://api.smith.langchain.com\",\n    headers={\"x-api-key\": \"<your-api-key>\"}\n)\n\nend_time = datetime.now(timezone.utc)\nstart_time = end_time - timedelta(days=30)\n\nresponse = client.get(\n    \"/api/v1/orgs/current/billing/granular-usage\",\n    params={\n        \"start_time\": start_time.isoformat(),\n        \"end_time\": end_time.isoformat(),\n        \"workspace_ids\": [\"<workspace-id>\"],\n        \"group_by\": \"workspace\",\n    },\n)\n\ndata = response.json()\nfor record in data[\"usage\"]:\n    print(f\"{record['time_bucket']}: {record['traces']} traces\")"
 },
 {
  "label": "cURL",
  "lang": "bash",
  "code": "curl -X GET \"https://api.smith.langchain.com/api/v1/orgs/current/billing/granular-usage?\\\nstart_time=2026-01-01T00:00:00Z&\\\nend_time=2026-01-15T00:00:00Z&\\\nworkspace_ids=<workspace-id>&\\\ngroup_by=workspace\" \\\n  -H \"x-api-key: <your-api-key>\""
 }
]
```

#### Example: Get trace usage by user, filtered to long-lived retention only

```python Python
response = client.get(
    "/api/v1/orgs/current/billing/granular-usage",
    params={
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat(),
        "workspace_ids": ["<workspace-id>"],
        "group_by": "user",
        "trace_tier": "longlived",
    },
)

data = response.json()
for record in data["usage"]:
    user_email = record["dimensions"].get("user_email", "Unknown")
    print(f"{user_email}: {record['traces']} long-lived traces")
```

### LangSmith Deployment usage (`kind=langsmith_deployments`)

Each record carries three metrics together so a single fetch powers the whole Deployment view.


> [!NOTE]
>
> **LangSmith Deployment usage** is sourced separately from trace usage and is available for the full retention window of your deployment usage.
>
> For self-hosted instances, the Deployment usage endpoint is opt-in. Enable it via:
>
> ```env
> REMOTE_METRICS_ROLLUP_ENABLED=true
> ```
>
> Or upgrade to a LangSmith version that enables it by default (see [self-hosted changelog](lc:langsmith/self-hosted-changelog)).


#### Response

```json
{
  "stride": {
    "days": 1,
    "hours": 0
  },
  "usage": [
    {
      "time_bucket": "2026-01-15T00:00:00Z",
      "dimensions": {
        "workspace_id": "uuid",
        "workspace_name": "My Workspace"
      },
      "nodes_executed": 12500,
      "agent_runs": 320,
      "agent_uptime_seconds": 86400
    }
  ]
}
```

| Field | Description |
|-------|-------------|
| `nodes_executed` | Total LangGraph nodes executed in the time bucket. |
| `agent_runs` | Total agent runs (graph invocations) in the time bucket. |
| `agent_uptime_seconds` | Total replica uptime, in seconds, summed across deployment replicas. The deduplicated standby minutes used for invoicing is computed separately by the billing pipeline; this field is the raw sum surfaced for breakdown and analysis. |

#### Example: Get Deployment usage by workspace

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "response = client.get(\n    \"/api/v1/orgs/current/billing/granular-usage\",\n    params={\n        \"kind\": \"langsmith_deployments\",\n        \"start_time\": start_time.isoformat(),\n        \"end_time\": end_time.isoformat(),\n        \"workspace_ids\": [\"<workspace-id>\"],\n        \"group_by\": \"workspace\",\n    },\n)\n\ndata = response.json()\nfor record in data[\"usage\"]:\n    print(\n        f\"{record['time_bucket']}: \"\n        f\"{record['nodes_executed']} nodes, \"\n        f\"{record['agent_runs']} runs, \"\n        f\"{record['agent_uptime_seconds']}s uptime\"\n    )"
 },
 {
  "label": "cURL",
  "lang": "bash",
  "code": "curl -X GET \"https://api.smith.langchain.com/api/v1/orgs/current/billing/granular-usage?\\\nkind=langsmith_deployments&\\\nstart_time=2026-01-01T00:00:00Z&\\\nend_time=2026-01-15T00:00:00Z&\\\nworkspace_ids=<workspace-id>&\\\ngroup_by=workspace\" \\\n  -H \"x-api-key: <your-api-key>\""
 }
]
```

## CSV export

```
GET /api/v1/orgs/current/billing/granular-usage/export
```

Same query parameters as the data endpoint, including `kind`. Returns a CSV file with one row per (time bucket, dimension) tuple. All dimension columns are always present; only the columns matching the selected `group_by` are populated.

For `kind=traces`, the value column is `Traces`. For `kind=langsmith_deployments`, the value columns are `Nodes Executed`, `Agent Runs`, and `Agent Uptime (seconds)`.

| Column | Present when |
|--------|--------------|
| Time Bucket Start | Always |
| Time Bucket End | Always |
| Workspace ID / Name | Always (populated when `group_by=workspace`) |
| Project ID / Name | Always (populated when `group_by=project`) |
| User ID / Email | Always (populated when `group_by=user`) |
| API Key Short Key | Always (populated when `group_by=api_key`) |
| Traces | `kind=traces` |
| Nodes Executed / Agent Runs / Agent Uptime (seconds) | `kind=langsmith_deployments` |

Cells whose value would start with `=`, `+`, `-`, `@`, tab, or carriage-return are tab-prefixed to neutralize spreadsheet formula evaluation in Excel / Google Sheets / LibreOffice.

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "response = client.get(\n    \"/api/v1/orgs/current/billing/granular-usage/export\",\n    params={\n        \"kind\": \"langsmith_deployments\",\n        \"start_time\": start_time.isoformat(),\n        \"end_time\": end_time.isoformat(),\n        \"workspace_ids\": [\"<workspace-id>\"],\n        \"group_by\": \"workspace\",\n    },\n)\n\nwith open(\"deployment_usage_report.csv\", \"wb\") as f:\n    f.write(response.content)"
 },
 {
  "label": "cURL",
  "lang": "bash",
  "code": "curl -X GET \"https://api.smith.langchain.com/api/v1/orgs/current/billing/granular-usage/export?\\\nkind=langsmith_deployments&\\\nstart_time=2026-01-01T00:00:00Z&\\\nend_time=2026-01-15T00:00:00Z&\\\nworkspace_ids=<workspace-id>&\\\ngroup_by=workspace\" \\\n  -H \"x-api-key: <your-api-key>\" \\\n  -o deployment_usage_report.csv"
 }
]
```

## Grouping options

The `group_by` parameter determines how usage data is aggregated:

| Value | Description | Dimensions returned | Available for |
|-------|-------------|---------------------|---------------|
| `workspace` | Group by workspace | `workspace_id`, `workspace_name` | Both kinds |
| `project` | Group by project | `project_id`, `project_name` | Both kinds |
| `user` | Group by user | `user_id`, `user_email` | Both kinds |
| `api_key` | Group by API key | `api_key_short_key` | Both kinds |

For trace usage, "project" refers to the [LangSmith tracer session](lc:langsmith/observability-concepts). For Deployment usage, "project" refers to the LangSmith Deployment project (a deployed agent).

## Related resources

- [Manage billing in your account](lc:langsmith/billing)
- [Organization and workspace operations](lc:langsmith/organization-workspace-operations)
