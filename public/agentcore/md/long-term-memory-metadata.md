# Structured metadata for long-term memories - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/long-term-memory-metadata.html

---

# Structured metadata for long-term memories

Metadata filtering in Amazon Bedrock AgentCore Memory lets you add structured attributes to your long-term memory records. You can use those attributes to narrow which records are returned during retrieval. Namespaces already isolate memories by primary entity (user, tenant, patient, client). However, within a single namespace, a broad semantic search returns everything that’s close in meaning. With metadata filtering, you can retrieve only results that match specific attribute values. For example, you can retrieve only high-priority records, only records from a particular department, or only records created within a given time range.

With metadata filtering, you can:

  * Scope retrieval by business dimensions (priority, department, channel, time range) within a namespace

  * Attach structured metadata to events and memory records at creation time

  * Have the large language model (LLM) automatically extract metadata from conversational content during memory ingestion

  * Constrain LLM-extracted values to specific values for consistent filtering

  * Combine up to 5 filters per query on `RetrieveMemoryRecords` or `ListMemoryRecords`, applied with `AND` logic

  * Filter on system-generated timestamps (`x-amz-agentcore-memory-createdAt`, `x-amz-agentcore-memory-updatedAt`) without declaring additional indexed keys


###### Topics

  * Getting started

  * Key concepts

  * Prerequisites

  * Step 1: Create a memory with indexed keys and a metadata schema

  * Step 2: Verify the configuration

  * Step 3: Ingest data with metadata

  * Step 4: Query with metadata filters

  * Step 5: Evolve your metadata schema

  * Quotas

  * Best practices


## Getting started

Setting up metadata filtering involves five steps:

  1. **Create your memory with indexed keys and a metadata schema** —

     * **Indexed keys** — Use `CreateMemory` (or `UpdateMemory`) to declare the metadata keys you want to filter on (for example, `priority`, `channel`, `tags`). You can declare up to 10 indexed keys per memory. Indexed keys define which attributes are queryable in filter expressions. Once an indexed key is added, it cannot be removed.

     * **Metadata schema** — Define a `metadataSchema` on a strategy to control how the LLM extracts values from conversations. The schema specifies which keys to extract, how to resolve conflicts across events, and what validation constraints to apply. A metadata schema is optional — strategies without one do not perform metadata extraction.

  2. **Verify the configuration** — Use `GetMemory` to confirm your indexed keys and strategy metadata schemas are set up correctly.

  3. **Ingest data with metadata** — Send events using `CreateEvent` with optional metadata, or supply metadata directly on records using `BatchCreateMemoryRecords`. For event-driven ingestion, the LLM automatically extracts and populates metadata on the resulting memory records. This extraction is based on the strategy’s metadata schema and conversation content, even when no metadata is attached to the events.

  4. **Query with metadata filters** — Use `metadataFilters` on `RetrieveMemoryRecords` (semantic search with pre-filtering) or `ListMemoryRecords` (metadata-only filtering) to scope results.

  5. **Evolve your schema over time** — Add new indexed keys or modify strategy metadata schemas as your filtering needs grow.


The subsequent sections walk through each step in detail.

## Key concepts

### Indexed metadata keys

**Indexed keys** are declared at the memory resource level in `CreateMemory` (or added later via `UpdateMemory`). Indexed keys are stored in a format optimized for fast query filtering. Only indexed keys are queryable in `metadataFilters` on `ListMemoryRecords` and `RetrieveMemoryRecords`.

The following example declares two indexed keys:

```json
{
  "indexedKeys": [
    { "key": "priority", "type": "STRING" },
    { "key": "tags",     "type": "STRINGLIST" }
  ]
}
```
Supported `type` values: `STRING`, `STRINGLIST`, `NUMBER`.

Keys must match `^[a-zA-Z0-9\s._:/=+@-]*$` (max 128 characters).

Adding an indexed key does not backfill existing records. Only records created or updated after the key is declared are indexed for that key. For more details on evolving your schema over time, see Step 5: Evolve your metadata schema.

### Metadata schema (per strategy)

Memory Strategy can optionally have a **metadata schema** declared in `memoryRecordSchema.metadataSchema`. The metadata schema tells the LLM what metadata to extract from conversational content when generating memory records. Only keys defined in the strategy’s metadata schema are populated on the resulting memory records during event-driven extraction.

Each entry in the schema defines:

  * **`key` ** — The metadata key name. If this key is also declared as an indexed key, the extracted value is filterable. If it is not an indexed key, the value is still populated on the record and visible in `GetMemoryRecord` and `ListMemoryRecords` responses, but it cannot be used in filter expressions.

  * **`type` ** — The value type (`STRING`, `STRINGLIST`, `NUMBER`).

  * **`definition` ** (required) — A natural-language description of what the field represents. Be specific — instead of _"The priority,"_ write _"Issue priority level based on customer impact. Values range from critical (most severe) to low (least severe)."_

  * **`llmExtractionInstruction` ** (optional) — Additional guidance for how the LLM should extract or resolve values. You can use the built-in `LATEST_VALUE` (keeps the most recent value) or provide custom natural-language instructions like _"Classify based on business impact: use`critical` for service outages affecting production, `high` for degraded performance, `medium` for feature requests, `low` for documentation or cosmetic issues."_

  * **`validation` ** (optional) — Constrains the LLM’s output to a controlled set of values. Without validation, the LLM may produce `"High"`, `"high"`, or `"HIGH"` for the same concept, breaking filter matching.


The following example shows a metadata schema entry with validation:

```json
{
  "metadataSchema": [
    {
      "key": "priority",
      "type": "STRING",
      "extractionConfig": {
        "llmExtractionConfig": {
          "definition": "Issue priority level based on customer impact. Values range from critical (most severe) to low (least severe).",
          "llmExtractionInstruction": "LATEST_VALUE",
          "validation": {
            "stringValidation": {
              "allowedValues": ["critical", "high", "medium", "low"]
            }
          }
        }
      }
    }
  ]
}
```
Validation options by type:

Type | Validation | Description  
---|---|---  
`STRING` |  `stringValidation.allowedValues` |  Constrain to a fixed set (max 10 values, each max 256 characters, matching `^[a-zA-Z0-9\s._:/=+@-]*$`)  
`STRINGLIST` |  `stringListValidation.allowedValues` |  Constrain list members to a fixed set (max 10 values, each max 256 characters, matching `^[a-zA-Z0-9\s._:/=+@-]*$`)  
`STRINGLIST` |  `stringListValidation.maxItems` |  Max items in the list (1–5)  
`NUMBER` |  `numberValidation.minValue` |  Minimum allowed value  
`NUMBER` |  `numberValidation.maxValue` |  Maximum allowed value  
  
### Deterministic metadata (STRICTLY_CONSISTENT extraction type)

Deterministic metadata keys contain values that your application already knows when creating an event. These values are copied exactly to the resulting memory records without modification. Organizational classifiers like `department`, `compliance_level`, or `agent_id` should not be inferred by the LLM. LLM inference introduces variability. For example, the same conversation can produce `"eng"` on one record and `"Engineering"` on another.

For these keys, set `extractionType` to `STRICTLY_CONSISTENT` in the metadata schema entry. The value supplied on the event propagates unchanged through extraction and consolidation. The LLM is not consulted for that key.

The following JSON shows a metadata schema with both `STRICTLY_CONSISTENT` and `LLM_INFERRED` extraction types:

```json
{
  "metadataSchema": [
    {
      "key": "department",
      "type": "STRING",
      "extractionType": "STRICTLY_CONSISTENT"
    },
    {
      "key": "compliance_level",
      "type": "STRING",
      "extractionType": "STRICTLY_CONSISTENT"
    },
    {
      "key": "topic",
      "type": "STRING",
      "extractionType": "LLM_INFERRED",
      "extractionConfig": {
        "llmExtractionConfig": {
          "definition": "Primary topic of the conversation",
          "llmExtractionInstruction": "Identify the main topic discussed"
        }
      }
    }
  ]
}
```
When you omit `extractionType`, the default is `LLM_INFERRED`.

#### Extraction and consolidation isolation

`STRICTLY_CONSISTENT` keys do more than skip LLM inference. They group events by their deterministic values during extraction. Events with different values are processed separately. Consolidation follows the same rule. Records from one value group never merge with records from another group.

The following Python example shows a support session with two deterministic keys (`department` and `priority`):

```bash
# Event 1: high-priority billing inquiry
agentcore_client.create_event(
    memoryId="mem-support-abc123",
    actorId="customer-123",
    sessionId="session-escalation-001",
    payload=[{"conversational": {"role": "USER",
        "content": {"text": "I'm seeing duplicate charges on my invoice and it's blocking our deployment."}}}],
    metadata={
        "department": {"stringValue": "billing"},
        "priority": {"stringValue": "high"}
    }
)

# Event 2: also high-priority billing (same deterministic values as Event 1)
agentcore_client.create_event(
    memoryId="mem-support-abc123",
    actorId="customer-123",
    sessionId="session-escalation-001",
    payload=[{"conversational": {"role": "USER",
        "content": {"text": "The charges appeared after we upgraded from standard to enterprise tier last week."}}}],
    metadata={
        "department": {"stringValue": "billing"},
        "priority": {"stringValue": "high"}
    }
)

# Event 3: high-priority engineering (same priority, different department)
agentcore_client.create_event(
    memoryId="mem-support-abc123",
    actorId="customer-123",
    sessionId="session-escalation-001",
    payload=[{"conversational": {"role": "USER",
        "content": {"text": "Your team found a provisioning bug that triggered the duplicate charge."}}}],
    metadata={
        "department": {"stringValue": "engineering"},
        "priority": {"stringValue": "high"}
    }
)

# Event 4: low-priority billing (same department as Events 1-2, different priority)
agentcore_client.create_event(
    memoryId="mem-support-abc123",
    actorId="customer-123",
    sessionId="session-escalation-001",
    payload=[{"conversational": {"role": "USER",
        "content": {"text": "Also, can you update the billing contact email on file when you get a chance?"}}}],
    metadata={
        "department": {"stringValue": "billing"},
        "priority": {"stringValue": "low"}
    }
)
```
The system groups events by the exact combination of all deterministic key values:

  * Events 1 and 2 share `department=billing, priority=high`. They are extracted together.

  * Event 3 differs in `department`. It is extracted separately, despite sharing `priority=high`.

  * Event 4 differs in `priority`. It is extracted separately, despite sharing `department=billing`.


All deterministic key values must match for events to be grouped. A query with `department=billing` AND `priority=high` returns only the urgent duplicate charge facts. The other events are in separate partitions. Records from different value combinations never merge during consolidation.

#### Constraints

Constraint | Detail  
---|---  
Maximum deterministic keys per strategy |  3  
Key type |  Must be `STRING`  
Must be indexed |  The key must also be declared in the memory’s `indexedKeys`  
No `extractionConfig` |  `STRICTLY_CONSISTENT` keys cannot have an `extractionConfig`. The value comes from the event, not the LLM.  
Supported strategies |  Semantic, user preference, and episodic strategies (including custom overrides). Not supported on summary strategies.  
Missing values |  If an event arrives without a value for a deterministic key, the key is omitted from the grouping for that event and absent on the resulting record.  
  
###### Important

Changing which keys are configured as `STRICTLY_CONSISTENT` changes the grouping used for extraction and consolidation. Records created under the previous configuration become isolated from records created under the new configuration. Plan your deterministic key configuration before ingesting events.

### How indexed keys and schema keys interact

The relationship between indexed keys and schema keys determines how metadata behaves:

  * **Indexed + in schema** — The key is populated on extracted records by the LLM _and_ is filterable in query expressions. This is the most common configuration for keys you want to both extract and filter on.

  * **Indexed + not in schema** — The key is _not_ populated on records during event-driven extraction. Filters on this key return no results for extracted records. To populate these keys, use the Batch APIs (`BatchCreateMemoryRecords` or `BatchUpdateMemoryRecords`).

  * **In schema + not indexed** — The LLM extracts and populates the value on records, and it is visible in `GetMemoryRecord` and `ListMemoryRecords` responses. However, it cannot be used in filter expressions. This is useful for context enrichment — metadata like `sentiment` or `summary_notes` that enriches the record for downstream consumption without consuming your indexed key budget.


### How metadata flows from events to memory records

Event metadata accepts only `stringValue` entries. Memory records support `stringValue`, `stringListValue`, and `numberValue` types — populated by the LLM during extraction or supplied directly via the Batch APIs. The `dateTimeValue` type is reserved for system-generated fields (`x-amz-agentcore-memory-createdAt` and `x-amz-agentcore-memory-updatedAt`). Only keys defined in the strategy’s `metadataSchema` are populated on extracted records — event metadata keys not in the schema are ignored. For entry limits, see Quotas.

### System-generated metadata

Every memory record carries these system fields, queryable with the same filter operators:

Field | Type | Description  
---|---|---  
`x-amz-agentcore-memory-recordType` |  `stringValue` |  The type of the memory record  
`x-amz-agentcore-memory-createdAt` |  `dateTimeValue` |  Record creation timestamp  
`x-amz-agentcore-memory-updatedAt` |  `dateTimeValue` |  Record last-update timestamp  
  
You do not need to declare these as indexed keys — they are always available for filtering. These system-generated `dateTimeValue` fields support `BEFORE` and `AFTER` operators, enabling time-range queries without requiring you to declare datetime indexed keys.

## Prerequisites

Before configuring metadata filtering, verify you have:

  * An AWS account with permissions to call `CreateMemory`, `UpdateMemory`, `CreateEvent`, `ListMemoryRecords`, `RetrieveMemoryRecords`, `BatchCreateMemoryRecords`, and `BatchUpdateMemoryRecords`

  * Amazon Bedrock AgentCore access

  * A clear view of the 3–5 filter dimensions your agent most needs (department, priority, region, project, and so on)


## Step 1: Create a memory with indexed keys and a metadata schema

The following creates a customer-support memory with five indexed keys and a metadata schema. `priority`, `agent_type`, and `sentiment` are defined in the strategy’s metadata schema — the LLM extracts their values from conversation content. Notice that `sentiment` is in the schema but _not_ declared as an indexed key: the LLM derives its value from conversations and populates it on records, but it cannot be used in filter expressions. `tags` (`STRINGLIST`), `channel` (`STRING`), and `ticket_id` (`STRING`) are declared as indexed keys but are not in the schema — they are not populated during event-driven extraction but can be supplied via the Batch APIs.

```bash
aws bedrock-agentcore-control create-memory \
  --name "CustomerSupportMemory" \
  --event-expiry-duration 30 \
  --indexed-keys '[
    {"key": "priority",   "type": "STRING"},
    {"key": "agent_type", "type": "STRING"},
    {"key": "tags",       "type": "STRINGLIST"},
    {"key": "channel",    "type": "STRING"},
    {"key": "ticket_id",  "type": "STRING"}
  ]' \
  --memory-strategies '[
    {
      "semanticMemoryStrategy": {
        "name": "SupportSemanticStrategy",
        "description": "Captures support interaction details",
        "namespaceTemplates": ["support/{actorId}"],
        "memoryRecordSchema": {
          "metadataSchema": [
            {
              "key": "priority",
              "type": "STRING",
              "extractionConfig": {
                "llmExtractionConfig": {
                  "definition": "Issue priority level based on customer impact. Values range from critical (most severe) to low (least severe).",
                  "llmExtractionInstruction": "LATEST_VALUE",
                  "validation": {
                    "stringValidation": {
                      "allowedValues": ["critical", "high", "medium", "low"]
                    }
                  }
                }
              }
            },
            {
              "key": "agent_type",
              "type": "STRING",
              "extractionConfig": {
                "llmExtractionConfig": {
                  "definition": "Support agent classification.",
                  "llmExtractionInstruction": "Prefer the most specialized agent type. Hierarchy: specialist > tier3 > tier2 > tier1 > bot."
                }
              }
            },
            {
              "key": "sentiment",
              "type": "STRING",
              "extractionConfig": {
                "llmExtractionConfig": {
                  "definition": "Customer sentiment during the interaction.",
                  "llmExtractionInstruction": "LATEST_VALUE",
                  "validation": {
                    "stringValidation": {
                      "allowedValues": ["positive", "neutral", "negative", "frustrated"]
                    }
                  }
                }
              }
            }
          ]
        }
      }
    }
  ]'
```
## Step 2: Verify the configuration

Use `GetMemory` to confirm that the indexed keys and metadata schema were accepted:

```bash
aws bedrock-agentcore-control get-memory --memory-id "<memory-id>"
```
## Step 3: Ingest data with metadata

There are two pathways for getting metadata onto memory records.

### Event-driven ingestion

Attach `stringValue` metadata to events at creation time. The LLM uses the strategy’s metadata schema to extract and populate metadata on the resulting memory records. Only keys defined in the strategy’s `metadataSchema` are populated on the resulting records — event metadata keys not in the schema are ignored during extraction.

```bash
aws bedrock-agentcore create-event \
  --memory-id "<memory-id>" \
  --actor-id "customer-123" \
  --session-id "session-001" \
  --event-timestamp "$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")" \
  --metadata '{
    "priority":  {"stringValue": "high"},
    "channel":   {"stringValue": "email"},
    "ticket_id": {"stringValue": "TKT-5001"}
  }' \
  --payload '[
    {"conversational": {"role": "USER",      "content": {"text": "I have a billing issue that is blocking my production deployment"}}},
    {"conversational": {"role": "ASSISTANT", "content": {"text": "I understand this is urgent. Let me escalate to our billing specialist team."}}}
  ]'
```
In this example, `priority` is in the strategy’s `metadataSchema`, so its value propagates to the memory record. `channel` and `ticket_id` are not in the schema, so they are ignored during extraction. The LLM also infers `agent_type` (likely `"specialist"` based on the escalation) and `sentiment` (likely `"frustrated"`) from the conversation content — these schema keys are populated even though they were not provided as event metadata.

### Implicit metadata extraction from conversation content

Event metadata is not required for schema keys to produce values. When a schema key has no matching metadata on the originating events, the LLM derives the value entirely from conversation content. It uses the key’s `definition` and `llmExtractionInstruction` to determine the value. This is useful for dimensions that only exist in the conversation itself — without requiring callers to supply them at event creation time.

Using the same customer support memory from Step 1, the following event has no metadata at all:

```bash
aws bedrock-agentcore create-event \
  --memory-id "<memory-id>" \
  --actor-id "customer-789" \
  --session-id "session-002" \
  --event-timestamp "$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")" \
  --payload '[
    {"conversational": {"role": "USER",      "content": {"text": "My production deployment is down because of a billing hold on our account"}}},
    {"conversational": {"role": "ASSISTANT", "content": {"text": "I understand the urgency. Let me connect you with our billing specialist team right away."}}}
  ]'
```
The LLM analyzes the conversation content and populates all three schema keys on the extracted memory record — `priority`, `agent_type`, and `sentiment` — even though none were provided as event metadata:

```json
{
  "content": {"text": "Customer reported a production outage caused by a billing hold. Escalated to billing specialist."},
  "metadata": {
    "priority":   {"stringValue": "critical"},
    "agent_type": {"stringValue": "specialist"},
    "sentiment":  {"stringValue": "frustrated"}
  }
}
```
Validation rules still apply — the LLM’s output is constrained to your specified allowed values regardless of whether the value came from event metadata or content inference.

### How the LLM resolves conflicts across events

When multiple events in a session carry different values for the same metadata key, the LLM uses the `llmExtractionInstruction`. This determines which value to keep on the resulting memory record.

For example, consider a support session where the first event has `priority: "low"` and a later event escalates to `priority: "critical"`. The LLM resolves this based on the instruction:

  * **`LATEST_VALUE` ** (built-in) — The LLM keeps the most recent value. In this case, the memory record gets `priority: "critical"`.

  * **Custom instructions** — You can express domain-specific logic. For example, _"Keep the highest severity reported during the session"_ would also produce `"critical"`, but for a different reason — it’s the highest severity, not just the latest.


Another example: for `agent_type` with the instruction _"Prefer the most specialized agent type. Hierarchy: specialist > tier3 > tier2 > tier1 > bot"_, if a session starts with a bot and escalates to a tier2 agent, the memory record gets `agent_type: "tier2"`.

### Deterministic metadata ingestion

Keys configured as `STRICTLY_CONSISTENT` follow a different ingestion path. The value you supply on the event is the value that lands on the resulting record. There is no LLM inference and no conflict resolution.

AgentCore Memory groups events by their deterministic key values before extraction. For example, events tagged `department: "engineering"` are processed separately from events tagged `department: "finance"`.

Consolidation operates within these groups. A record with `compliance_level: "hipaa"` never merges with a record labeled `compliance_level: "standard"`. This makes deterministic keys ideal for:

  * **Compliance isolation** \- Records with different compliance levels never co-mingle.

  * **Organizational routing** \- Department-scoped retrieval without cross-contamination.

  * **Multi-tenant sub-filtering** \- Tenant-specific attributes preserved exactly as supplied.


If an event has no value for a deterministic key, the key is absent on the resulting record.

The direct-write paths (`BatchCreateMemoryRecords` and `BatchUpdateMemoryRecords`) bypass extraction. The `STRICTLY_CONSISTENT` extraction type has no effect on them. Supply metadata directly as you already do for those APIs.

### Direct record creation with Batch APIs

For knowledge-base imports, self-managed strategies, or pre-processed content, use `BatchCreateMemoryRecords` (or `BatchUpdateMemoryRecords`) to supply metadata explicitly. This bypasses LLM extraction entirely — the caller controls the metadata values.

How metadata is handled on batch-created records depends on whether you provide a `memoryStrategyId`:

  * **With`memoryStrategyId` ** — The service filters the input metadata against that strategy’s `memoryRecordSchema`. Only keys defined in the schema are stored on the record. All other keys — including indexed keys not in the schema — are silently dropped. This gives you schema-enforced consistency, ensuring batch-created records have the same metadata shape as records produced by event-driven extraction.

  * **Without`memoryStrategyId` ** — The service stores all metadata keys in the payload as-is on the record. This includes keys that are indexed, keys that are in a strategy schema, and keys that are neither. However, only indexed keys are filterable — attempting to filter on a non-indexed key returns a `ValidationException`. Non-indexed keys are still visible in `GetMemoryRecord` and `ListMemoryRecords` responses.


The following example creates a record without `memoryStrategyId`, storing all provided metadata:

```bash
aws bedrock-agentcore batch-create-memory-records \
  --memory-id "<memory-id>" \
  --records '[{
    "requestIdentifier": "import-001",
    "namespaces": ["support/customer-456"],
    "content": {"text": "Customer prefers phone support for urgent billing issues"},
    "timestamp": "2026-01-15T10:00:00Z",
    "metadata": {
      "priority":   {"stringValue": "high"},
      "agent_type": {"stringValue": "billing_agent"},
      "channel":    {"stringValue": "phone"},
      "ticket_id":  {"stringValue": "TKT-7890"}
    }
  }]'
```
To enforce schema consistency, include the `memoryStrategyId`. In this case, only keys present in that strategy’s `memoryRecordSchema` are retained:

```bash
aws bedrock-agentcore batch-create-memory-records \
  --memory-id "<memory-id>" \
  --records '[{
    "requestIdentifier": "import-002",
    "namespaces": ["support/customer-456"],
    "memoryStrategyId": "<strategy-id>",
    "content": {"text": "Billing dispute resolved after account credit applied"},
    "timestamp": "2026-01-16T14:00:00Z",
    "metadata": {
      "priority":   {"stringValue": "medium"},
      "agent_type": {"stringValue": "billing_agent"},
      "channel":    {"stringValue": "phone"}
    }
  }]'
```
In the second example, if the strategy’s schema only defines `priority`, `agent_type`, and `sentiment`, then `channel` is silently dropped from the stored record.

### Updating records with BatchUpdateMemoryRecords

`BatchUpdateMemoryRecords` follows the same `memoryStrategyId` metadata filtering behavior as `BatchCreateMemoryRecords`. The following example updates an existing record’s content and metadata:

```bash
aws bedrock-agentcore batch-update-memory-records \
  --memory-id "<memory-id>" \
  --records '[{
    "memoryRecordId": "<record-id>",
    "namespaces": ["support/customer-456"],
    "content": {"text": "Customer prefers phone support for urgent billing issues. Account credit applied."},
    "metadata": {
      "priority":   {"stringValue": "critical"},
      "agent_type": {"stringValue": "billing_agent"},
      "channel":    {"stringValue": "phone"}
    }
  }]'
```
## Step 4: Query with metadata filters

Metadata filters are applied _before_ the vector similarity search runs (pre-filtering). This reduces the candidate set first. As a result, the K-nearest neighbor (KNN) search operates on a smaller, more relevant subset.

### Filter structure

Every filter is a `{ left, operator, right }` expression:

```json
{
  "left":     { "metadataKey": "priority" },
  "operator": "EQUALS_TO",
  "right":    { "metadataValue": { "stringValue": "high" } }
}
```
Up to **5 filters** can be combined per query. Multiple filters are applied with `AND` logic.

### Supported operators

Operator | Right value required | Works with | Description  
---|---|---|---  
`EQUALS_TO` |  Yes |  STRING, NUMBER |  Exact match.  
`CONTAINS` |  Yes |  STRINGLIST |  Returns records where any element in the STRINGLIST contains the given string as an exact match.  
`EXISTS` |  No |  All types |  Key is present on the record  
`NOT_EXISTS` |  No |  All types |  Key is absent from the record  
`GREATER_THAN` |  Yes (`numberValue`) |  NUMBER |  Numeric greater-than comparison  
`GREATER_THAN_OR_EQUALS` |  Yes (`numberValue`) |  NUMBER |  Numeric greater-than-or-equal comparison  
`LESS_THAN` |  Yes (`numberValue`) |  NUMBER |  Numeric less-than comparison  
`LESS_THAN_OR_EQUALS` |  Yes (`numberValue`) |  NUMBER |  Numeric less-than-or-equal comparison  
`BEFORE` |  Yes (`dateTimeValue`) |  dateTimeValue |  Timestamp is before the given value  
`AFTER` |  Yes (`dateTimeValue`) |  dateTimeValue |  Timestamp is after the given value  
  
Note: Event metadata filters on `ListEvents` support only `EXISTS`, `NOT_EXISTS`, and `EQUALS_TO`, and only `stringValue`.

### Retrieve with metadata filters (semantic search + pre-filter)

On `RetrieveMemoryRecords`, `metadataFilters` is nested inside `searchCriteria`. The following example scopes results to high-priority records from the current year before semantic search matches against "billing issues":

```bash
aws bedrock-agentcore retrieve-memory-records \
  --memory-id "<memory-id>" \
  --namespace "support/customer-123" \
  --search-criteria '{
    "searchQuery": "billing issues",
    "topK": 10,
    "metadataFilters": [
      {
        "left":     {"metadataKey": "priority"},
        "operator": "EQUALS_TO",
        "right":    {"metadataValue": {"stringValue": "high"}}
      },
      {
        "left":     {"metadataKey": "x-amz-agentcore-memory-createdAt"},
        "operator": "AFTER",
        "right":    {"metadataValue": {"dateTimeValue": "2026-01-01T00:00:00Z"}}
      }
    ]
  }'
```
Combining a custom metadata filter with a system-generated timestamp compacts the candidate set along two dimensions — business priority and recency — before similarity search runs.

### List with metadata filters (no semantic search)

`ListMemoryRecords` provides metadata filtering without semantic search. This is useful when you need to enumerate records matching specific metadata criteria — for example, listing all high-priority records for a customer, or pulling all records created after a specific date.

On `ListMemoryRecords`, `metadataFilters` is a top-level parameter:

```bash
aws bedrock-agentcore list-memory-records \
  --memory-id "<memory-id>" \
  --namespace "support/customer-123" \
  --metadata-filters '[
    {
      "left":     {"metadataKey": "priority"},
      "operator": "EQUALS_TO",
      "right":    {"metadataValue": {"stringValue": "high"}}
    },
    {
      "left":     {"metadataKey": "x-amz-agentcore-memory-createdAt"},
      "operator": "AFTER",
      "right":    {"metadataValue": {"dateTimeValue": "2026-01-20T00:00:00Z"}}
    }
  ]'
```
### Combining multiple filters

This query scopes retrieval to Q3 2026 equities discussions within a specific client namespace:

```json
{
  "searchQuery": "portfolio rebalancing strategy",
  "topK": 10,
  "metadataFilters": [
    {
      "left":     {"metadataKey": "asset_class"},
      "operator": "EQUALS_TO",
      "right":    {"metadataValue": {"stringValue": "equities"}}
    },
    {
      "left":     {"metadataKey": "x-amz-agentcore-memory-createdAt"},
      "operator": "AFTER",
      "right":    {"metadataValue": {"dateTimeValue": "2026-07-01T00:00:00Z"}}
    },
    {
      "left":     {"metadataKey": "x-amz-agentcore-memory-createdAt"},
      "operator": "BEFORE",
      "right":    {"metadataValue": {"dateTimeValue": "2026-09-30T23:59:59Z"}}
    }
  ]
}
```
Filter values for timestamps must be in UTC (ISO 8601 format). The service normalizes all stored timestamps to UTC before comparison, so always express filter values in UTC.

## Step 5: Evolve your metadata schema

AgentCore Memory supports schema evolution so you can adapt your metadata configuration as your needs change.

### Add indexed keys

You can add new indexed keys to a memory at any time:

```bash
aws bedrock-agentcore-control update-memory \
  --memory-id "<memory-id>" \
  --add-indexed-keys '[
    {"key": "customer_segment", "type": "STRING"}
  ]'
```
New keys become immediately available for incoming events and memory records. Existing records are not backfilled — only new or updated records carry the new key. You cannot remove a previously indexed key, which prevents accidental loss of filtering capability on existing data.

### Modify a strategy’s metadata schema

You can freely add, remove, or update entries in a strategy’s metadata schema. This controls what metadata the LLM extracts from conversations going forward.

For example, to add a new `resolution_type` field to an existing strategy:

```bash
aws bedrock-agentcore-control update-memory \
  --memory-id "<memory-id>" \
  --memory-strategies '{
    "modifyMemoryStrategies": [
      {
        "memoryStrategyId": "<strategy-id>",
        "memoryRecordSchema": {
          "metadataSchema": [
            {
              "key": "resolution_type",
              "type": "STRING",
              "extractionConfig": {
                "llmExtractionConfig": {
                  "definition": "How the customer support issue was resolved",
                  "validation": {
                    "stringValidation": {
                      "allowedValues": ["refund", "replacement", "escalation", "self-resolved"]
                    }
                  }
                }
              }
            }
          ]
        }
      }
    ]
  }'
```
You can also remove a key from a strategy’s metadata schema if you no longer want the LLM to extract that field. Removing a schema entry stops extraction for new records but does not affect metadata already on existing records.

Existing memory records do not retroactively receive new LLM-extracted fields. However, when older memories are consolidated with newer ones during the normal memory lifecycle, the consolidated record is re-extracted using the current schema and will include the new metadata fields.

## Quotas

Resource | Limit  
---|---  
Indexed keys per memory |  10  
STRICTLY_CONSISTENT keys per strategy |  3  
Metadata schema entries per strategy |  20  
Memory record metadata entries (user-supplied) |  20  
Filters per query |  5  
`allowedValues` per validation rule |  10  
`maxItems` for `STRINGLIST` validation |  5  
`definition` / `llmExtractionInstruction` length |  1000 characters each  
Metadata key length |  128 characters  
`stringValue` length |  256 characters  
length for `STRINGLIST` members |  64 characters  
  
## Best practices

  * **Start with 3–5 filter dimensions that directly impact retrieval quality.** Each indexed field consumes storage infrastructure capacity, and the 10-key limit reflects this. Begin with three to five keys that directly impact retrieval quality, and add more as concrete needs arise.

  * **Write clear, specific`definition` strings.** The `definition` describes what the field represents. Instead of _"The priority of the ticket,"_ write _"Issue priority level based on customer impact. Values range from critical (most severe) to low (least severe)."_ Use `llmExtractionInstruction` for detailed extraction logic.

  * **Constrain LLM output with`validation.allowedValues`.** Without validation, the LLM may produce `"High"`, `"high"`, or `"HIGH"` for the same concept, breaking filter matching.

  * **Choose conflict-resolution rules that match domain semantics.** `LATEST_VALUE` is a safe default, but for fields like `agent_type` in an escalation workflow, a custom instruction that retains the most senior value is more correct.

  * **Prefer the event-driven pathway for conversational content.** Let the LLM handle extraction and conflict resolution. Reserve the Batch APIs for bulk imports where you already know the correct metadata values.

  * **Plan schemas at the strategy level.** Each strategy can have its own `metadataSchema`, allowing different strategies to extract and handle the same keys differently. A semantic strategy might use custom extraction instructions to classify priority from conversation context, while a summary strategy might use a different definition tuned for summarization-specific metadata.

  * **Be intentional with`memoryStrategyId` on batch-created records.** When you include `memoryStrategyId`, the service filters input metadata to only keys in that strategy’s schema — all other keys are silently dropped. When you omit it, all metadata in the payload is stored as-is. Choose based on your use case: schema-enforced consistency for records that should match extraction-produced records, or full control for bulk imports where you manage metadata externally.

  * **Use non-indexed schema keys for context enrichment.** Not every metadata key needs to be filterable. Schema keys that are not declared as indexed keys are still populated on extracted records and visible in get/list responses — they just cannot be used in filter expressions. This is useful for metadata like `sentiment` or `summary_notes` that enriches the record for downstream consumption without consuming your indexed key budget.

  * **Use deterministic extraction for values you already know.** Some keys represent fixed organizational attributes like `department`, `tenant_tier`, or `compliance_scope`. If the application has these values at event creation time, configure them as `STRICTLY_CONSISTENT`. Supply the value on every event. This guarantees exact values on records and removes inconsistent representations (such as `"eng"` vs. `"Engineering"`) that LLM extraction can introduce. Reserve `LLM_INFERRED` for dimensions that must be inferred from conversation content, like sentiment or topic.

  * **Plan deterministic key slots early.** Each `STRICTLY_CONSISTENT` key uses one of the 10 indexed-key slots. Indexed keys cannot be removed once added. Reserve slots if you plan to use deterministic metadata.


### Anti-patterns to avoid

  * **Don’t index high-cardinality free-text fields** like descriptions or full names — they bloat the index without providing useful filter boundaries.

  * **Don’t use metadata for values that change on every interaction** — metadata is most effective for stable or slowly-changing attributes.

  * **Don’t rely on metadata alone for tenant isolation.** A `tenant_id` metadata field without namespace isolation is a security-through-convention model that breaks on any missed filter. Use namespaces for the `who`, and metadata for the `what`, `when`, and `how urgent`.

  * **Don’t use LLM extraction for values that must be exact.** If a key must carry a specific, known value (like `department` or `ticket_id`), use `STRICTLY_CONSISTENT` extraction or supply it via the Batch APIs. LLM extraction may produce variations of the same concept.



