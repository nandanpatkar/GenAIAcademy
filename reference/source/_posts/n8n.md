---
title: n8n
date: 2026-06-12 00:00:00
background: bg-rose-600
tags:
  - automation
  - workflow
  - nocode
  - lowcode
categories:
  - Other
intro: A quick reference for n8n workflow automation, covering expressions, built-in variables, core nodes, Code node patterns, error handling, and the CLI.
---

## Getting Started

### Installation {.col-span-2}

#### npm (global)

```bash
npm install n8n -g
n8n start
# Open http://localhost:5678
```

#### Docker

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

#### Docker Compose

```yaml
version: '3'
services:
  n8n:
    image: n8nio/n8n
    restart: always
    ports:
      - '5678:5678'
    volumes:
      - ~/.n8n:/home/node/.n8n
    environment:
      - GENERIC_TIMEZONE=Asia/Kolkata
      - WEBHOOK_URL=https://your-domain.com/
```

### Core Concepts

| Term           | Description                                    |
| -------------- | ---------------------------------------------- |
| **Workflow**   | A collection of connected nodes                |
| **Node**       | A single step or action                        |
| **Trigger**    | Node that starts a workflow                    |
| **Execution**  | One run of a workflow                          |
| **Item**       | A single JSON data object passed between nodes |
| **Connection** | Link between two nodes                         |
| **Credential** | Stored auth config for a service               |
| **Expression** | Dynamic value using `{{ }}` syntax             |

{.show-header}

## Expressions {.cols-2}

### Syntax Basics

Access current item fields:

```js
{
  {
    $json.fieldName;
  }
}
{
  {
    $json['field-name'];
  }
}
{
  {
    $json.nested.field;
  }
}
{
  {
    $json.array[0];
  }
}
```

Math and string:

```js
{
  {
    $json.price * 1.2;
  }
}
{
  {
    $json.first + ' ' + $json.last;
  }
}
{
  {
    $json.name.toUpperCase();
  }
}
{
  {
    $json.tags.join(', ');
  }
}
```

Ternary conditional:

```js
{
  {
    $json.age >= 18 ? 'adult' : 'minor';
  }
}
{
  {
    $json.status === 'active' ? true : false;
  }
}
```

### Reference Other Nodes

Get a specific node's output:

```js
{
  {
    $node['NodeName'].json.field;
  }
}
{
  {
    $node['NodeName'].json['key'];
  }
}
```

Get all items from a node:

```js
{
  {
    $items('NodeName');
  }
}
{
  {
    $items('NodeName')[0].json.field;
  }
}
```

Check item count:

```js
{
  {
    $items('NodeName').length;
  }
}
```

## Built-in Variables

### Execution & Workflow {.col-span-2}

| Variable               | Type    | Description                       |
| ---------------------- | ------- | --------------------------------- |
| `$execution.id`        | string  | Current execution ID              |
| `$execution.mode`      | string  | `manual`, `trigger`, or `webhook` |
| `$execution.resumeUrl` | string  | URL to resume a waiting execution |
| `$workflow.id`         | string  | Workflow ID                       |
| `$workflow.name`       | string  | Workflow name                     |
| `$workflow.active`     | boolean | Whether the workflow is active    |
| `$runIndex`            | number  | Loop iteration index (0-based)    |
| `$itemIndex`           | number  | Current item index in the batch   |

{.show-header}

### Date & Time (Luxon)

```js
// Current datetime as Luxon object
{
  {
    $now;
  }
}
{
  {
    $now.toISO();
  }
}
{
  {
    $now.toFormat('yyyy-MM-dd HH:mm');
  }
}

// Today at midnight
{
  {
    $today;
  }
}
{
  {
    $today.plus({ days: 7 }).toISO();
  }
}
{
  {
    $today.minus({ months: 1 }).startOf('month').toISO();
  }
}

// Parse from string or timestamp
{
  {
    DateTime.fromISO($json.dateStr).toFormat('dd MMM yyyy');
  }
}
{
  {
    DateTime.fromMillis($json.ts).toISO();
  }
}
```

### Environment & Secrets

```js
// Environment variables (set in .env or n8n settings)
{
  {
    $env.MY_API_KEY;
  }
}
{
  {
    $env.BASE_URL;
  }
}

// Workflow variables (n8n Cloud / Enterprise)
{
  {
    $vars.myVariable;
  }
}

// External secrets (n8n Cloud)
{
  {
    $secrets.myVault.mySecret;
  }
}
```

## Built-in Methods {.cols-2}

### Logic & Validation

```js
// Conditional value
{
  {
    $if($json.score > 50, 'pass', 'fail');
  }
}

// Null coalescing
{
  {
    $json.name ?? 'Unknown';
  }
}

// Emptiness checks (methods on the value, not global functions)
{
  {
    $json.field.isEmpty();
  }
}
{
  {
    $json.field.isNotEmpty();
  }
}
```

### Array Helpers

```js
// Aggregate methods — called ON the array
{
  {
    $json.prices.min();
  }
}
{
  {
    $json.prices.max();
  }
}
{
  {
    $json.prices.sum();
  }
}
{
  {
    $json.prices.average();
  }
}

// JMESPath query on objects/arrays
{
  {
    $jmespath($json, 'users[?age > `18`].name');
  }
}

// Native array methods
{
  {
    $json.items.filter((i) => i.active).length;
  }
}
{
  {
    $json.items.map((i) => i.name);
  }
}
```

## Triggers {.cols-3}

### Schedule Trigger

Configure via UI with:

- Interval: every N minutes/hours/days
- Custom cron expression

Common cron patterns:

```
*/15 * * * *    Every 15 minutes
0 9 * * 1-5     Weekdays at 9 AM
0 0 * * *       Daily at midnight
0 0 1 * *       1st of each month
0 8,17 * * *    At 8 AM and 5 PM
```

### Webhook Trigger

```
# Test URL (manual execution only)
https://your-n8n.com/webhook-test/{id}

# Production URL (active workflow)
https://your-n8n.com/webhook/{id}
```

Supports `GET`, `POST`, `PUT`, `PATCH`, `DELETE`. Access data via:

- Body → `$json`
- Query params → `$json.query`
- Headers → `$request.headers`

### App / Event Triggers

Common instant triggers:

- Gmail / Outlook — new email
- Slack — new message
- GitHub — push, PR, issue event
- Airtable — new/updated record
- Typeform — new submission
- Stripe — payment event

Use **polling** (interval-based) or **instant** triggers where the service pushes via webhook.

## Core Nodes {.cols-3}

### HTTP Request

Send requests to any REST API.

Key settings:

- **Method**: GET, POST, PUT, PATCH, DELETE
- **URL**: supports `{{ }}` expressions
- **Authentication**: None, Bearer, Basic, OAuth2, API Key
- **Body**: JSON, Form Data, Raw, Binary

```js
// Dynamic URL
https://api.example.com/users/{{ $json.userId }}

// Dynamic header
Authorization: Bearer {{ $env.API_TOKEN }}
```

### IF Node

Routes items to a `true` or `false` output branch based on a condition.

Supported types:

- String: equals, contains, starts/ends with, regex
- Number: =, ≠, >, <, ≥, ≤
- Boolean: is true/false
- Array: contains item
- DateTime: before/after

Combine with **AND** / **OR** logic.

### Switch Node

Routes items to one of multiple named branches based on a value. Use when you need more than 2 paths.

```
Value:    {{ $json.status }}

Case 0  → "pending"
Case 1  → "active"
Case 2  → "closed"
Default → (anything else)
```

### Set Node

Add, modify, or remove fields on items.

```js
// Add or overwrite a field
Field name:  status
Value:       {{ $json.active ? "on" : "off" }}

// Rename a field
Field name:  userId
Value:       {{ $json.id }}

// Enable "Keep Only Set" to strip all other fields
```

### Merge Node

Combines items from two input branches.

| Mode                | Description                             |
| ------------------- | --------------------------------------- |
| Append              | All items from both branches            |
| Combine by Position | Merge item[0]+item[0], etc.             |
| Combine by Fields   | Join on a shared key (like SQL JOIN)    |
| Keep Matches        | Inner join — only matching items        |
| Keep Non-Matches    | Items with no match in the other branch |

{.show-header}

### Split in Batches

Process a large item list in chunks to avoid timeouts.

```
Batch Size: 10
```

The node loops back automatically. Use `$runIndex` to track which batch you're on. Connect the `done` output to continue after all batches.

## Code Node {.cols-2}

### Run Once per Item

Executes once for each incoming item. Return one item object:

```js
// Modify and return current item
const item = $input.item;
item.json.fullName = item.json.first + ' ' + item.json.last;
item.json.ts = new Date().toISOString();
return item;
```

Return a completely new item:

```js
return {
  json: {
    id: $input.item.json.id,
    name: $input.item.json.name.trim(),
    processed: true
  }
};
```

### Run Once for All Items

Executes once with the full list. Return an array:

```js
// Transform all items
return $input.all().map((item) => ({
  json: {
    id: item.json.id,
    name: item.json.name.toUpperCase()
  }
}));
```

Filter items:

```js
return $input.all().filter((item) => item.json.score >= 50);
```

### Common Code Patterns {.col-span-2}

Group items by a field:

```js
const groups = {};
for (const item of $input.all()) {
  const key = item.json.category;
  if (!groups[key]) groups[key] = [];
  groups[key].push(item.json);
}
return Object.entries(groups).map(([key, items]) => ({
  json: { category: key, count: items.length, items }
}));
```

Flatten nested array into separate items:

```js
const result = [];
for (const item of $input.all()) {
  for (const row of item.json.rows) {
    result.push({ json: row });
  }
}
return result;
```

HTTP call inside Code node:

```js
const response = await $http.request({
  method: 'GET',
  url: `https://api.example.com/users/${$input.item.json.id}`
});
return [{ json: response }];
```

## Error Handling {.cols-2}

### Node-level: Continue on Error

On any node → **Settings** → **On Error**

| Option                    | Behavior                               |
| ------------------------- | -------------------------------------- |
| Stop Workflow             | Default — halts on error               |
| Continue (regular output) | Passes error info as item to next node |
| Continue (error output)   | Routes error to a separate branch      |

{.show-header}

Access error details downstream:

```js
{
  {
    $json.error.message;
  }
}
{
  {
    $json.error.name;
  }
}
{
  {
    $json.error.stack;
  }
}
```

### Workflow-level: Error Workflow

1. Create a dedicated "Error Handler" workflow
2. Use **Error Trigger** as the first node
3. In your main workflow → **Settings** → **Error Workflow** → select it

Available variables in the error workflow:

```js
{
  {
    $json.workflow.id;
  }
}
{
  {
    $json.workflow.name;
  }
}
{
  {
    $json.execution.id;
  }
}
{
  {
    $json.execution.url;
  }
}
{
  {
    $json.error.message;
  }
}
{
  {
    $json.error.stack;
  }
}
```

Use this to send Slack alerts, log to a DB, or create a Jira ticket on failure.

## CLI Reference {.cols-2}

### Common Commands

```bash
# Start n8n
n8n start

# Start with public tunnel (for webhook testing)
n8n start --tunnel

# Start on a custom port
n8n start --port=5679

# Execute a workflow by ID (non-interactively)
n8n execute --id=<workflow-id>

# Export all workflows to JSON files
n8n export:workflow --all --output=./backups/

# Export a single workflow
n8n export:workflow --id=<id> --output=./wf.json

# Import workflow from file
n8n import:workflow --input=./workflow.json

# Export credentials (encrypted)
n8n export:credentials --all --output=./creds/

# Import credentials
n8n import:credentials --input=./creds/
```

### Key Environment Variables

```bash
# Server
N8N_HOST=0.0.0.0
N8N_PORT=5678
N8N_PROTOCOL=https
WEBHOOK_URL=https://your-domain.com/

# Timezone
GENERIC_TIMEZONE=Asia/Kolkata

# Database (default: SQLite)
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=localhost
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n
DB_POSTGRESDB_PASSWORD=password

# Auth
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=secret

# Disable telemetry
N8N_DIAGNOSTICS_ENABLED=false
```

## Advanced Workflows {.cols-2}

### Sub-Workflows

Break large processes into reusable components using the **Execute Workflow** node.

- **Parent**: Sends items to the sub-workflow.
- **Child**: Starts with an **Execute Workflow Trigger**.
- **Return**: Data from the child's final node is sent back to the parent.

### Community Nodes

Extend n8n with community-built nodes directly from the UI.

1. Go to **Settings** → **Community Nodes**.
2. Enter the npm package name (e.g., `n8n-nodes-browserless`).
3. Click **Install**.

### Pagination

Many API nodes have built-in pagination. For custom HTTP requests:

1. Enable **Pagination** in the HTTP Request node settings.
2. Select the strategy (e.g., Header Link, Response body, Offset/Limit).
3. n8n will automatically fetch all pages and output a single stream of items.

## Keyboard Shortcuts {.cols-2}

### Canvas Actions

| Shortcut            | Action                 |
| ------------------- | ---------------------- |
| `Ctrl` `S`          | Save workflow          |
| `Ctrl` `Enter`      | Execute workflow       |
| `Ctrl` `Z`          | Undo                   |
| `Ctrl` `Shift` `Z`  | Redo                   |
| `Ctrl` `A`          | Select all nodes       |
| `Ctrl` `C`          | Copy selected node(s)  |
| `Ctrl` `V`          | Paste node(s)          |
| `Del` / `Backspace` | Delete selected node   |
| `F2`                | Rename node            |
| `Esc`               | Deselect / close panel |

{.shortcuts}

### Navigation

| Shortcut           | Action                   |
| ------------------ | ------------------------ |
| `Ctrl` `+`         | Zoom in                  |
| `Ctrl` `-`         | Zoom out                 |
| `Ctrl` `0`         | Reset zoom to 100%       |
| `Ctrl` `Shift` `F` | Fit workflow to screen   |
| `Ctrl` `F`         | Search / find node       |
| `Tab`              | Open node selector panel |
| `Space` `+` drag   | Pan the canvas           |

{.shortcuts}
