# Amazon Bedrock Managed Knowledge Bases as Connector Target - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-connector-managed-kb.html

---

# Amazon Bedrock Managed Knowledge Bases as Connector Target

Amazon Bedrock Managed Knowledge Bases provides fully managed retrieval-augmented generation (RAG): Amazon Bedrock handles the vector store, data ingestion, and retrieval optimization, so there is no retrieval infrastructure for you to provision or operate. Amazon Bedrock AgentCore exposes a managed knowledge base as a native Gateway connector — you attach it to your AgentCore Gateway and your agents discover and query it with standard Model Context Protocol (MCP) calls, with no custom retrieval integration to build. For details on creating and managing a managed knowledge base, see [Knowledge bases for Amazon Bedrock](<https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html>) in the _Amazon Bedrock User Guide_.

The connector exposes two tools. The first one is `AgenticRetrieveStream`. Instead of a single lookup, it plans a retrieval strategy, runs multiple retrieval steps across your managed knowledge bases, optionally expands to full documents, and streams back both the supporting results and a synthesized, citation-backed answer. `Retrieve` performs a single hybrid search and returns the most relevant passages.

###### Note

This connector is supported only for Amazon Bedrock Managed Knowledge Bases.

The following sections walk through how the connector works, agentic retrieval in depth, common use cases, how to set up a target, and the input and response schemas for both tools.

###### Topics

  * How it works

  * Agentic retrieval

  * Use cases

  * Set up a managed knowledge base

  * Configure the Gateway Service Role

  * Invoke the tools

  * AgenticRetrieveStream input schema

  * AgenticRetrieveStream response format

  * Retrieve input schema

  * Retrieve response format

  * Configuration reference

  * Access control filtering


## How it works

Amazon Bedrock AgentCore provides a built-in connector to Amazon Bedrock Managed Knowledge Bases. The Gateway handles schema management, endpoint resolution, and service authentication. The connector exposes two tools, which your agent discovers with `tools/list`:

  * `AgenticRetrieveStream` — a multi-step, streaming agentic retrieval that returns results, planning and retrieval trace events, and a synthesized answer with citations (returned by default; disable with `generateResponse: false`).

  * `Retrieve` — a single hybrid search that returns the most relevant passages with source references.


A single `Retrieve` invocation follows this flow:

  1. **Gateway setup** — Create a Gateway and add an Amazon Bedrock Managed Knowledge Bases target, referencing the managed knowledge base you want to expose. The Gateway snapshots the tool schema and provisions the integration.

  2. **Tool discovery** — Your agent calls `tools/list` on the Gateway endpoint and discovers the retrieval tool with its input schema.

  3. **Retrieval invocation** — Your agent calls `tools/call` with a natural language query. The Gateway authenticates to the backend and routes the request to the managed knowledge base, which runs hybrid search across your ingested content.

  4. **Results** — The tool returns the most relevant passages with source references as JSON inside the tool result’s text content.

  5. **Grounded response** — Your agent uses the results to compose a response with cited sources.


For the agentic retrieval flow, see Agentic retrieval.

## Agentic retrieval

`AgenticRetrieveStream` treats a question as a task: instead of the single hybrid search that `Retrieve` runs for one query, it plans a retrieval strategy, runs multiple retrieval steps across your managed knowledge bases, and streams back the supporting results and a synthesized, citation-backed answer — all in one tool call. The synthesized answer is returned by default; set `generateResponse` to `false` to return results only.

Your agent invokes it with a conversation (`messages`). The retrievers it queries — each pointing at a managed knowledge base — are configured by the administrator on the target, not supplied by the agent. Planning and retrieval progress streams over MCP as `notifications/message`, and the results and answer are returned in the tool result.

For more about how agentic retrieval works, see [Knowledge bases for Amazon Bedrock](<https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html>) in the _Amazon Bedrock User Guide_.

For the request and event schema, see AgenticRetrieveStream input schema and AgenticRetrieveStream response format.

## Use cases

  * **Enterprise knowledge assistants** — Ground agent responses in internal wikis, runbooks, and policy documents that have been ingested into a managed knowledge base.

  * **Document Q &A** — Answer questions over large document collections without building or operating a vector store.

  * **Multi-source RAG** — Query across content from multiple data sources combined into a single managed knowledge base in one retrieval call.

  * **Multi-step planning** — Use `AgenticRetrieveStream` to answer multi-part or ambiguous questions that require planning and several retrieval steps, returning a synthesized, citation-backed answer in one call.

  * **Tool-augmented agents** — Combine managed knowledge base retrieval with your other Gateway tools so an agent can both look up grounded facts and take actions.


## Set up a managed knowledge base

For instructions on how to create a Gateway Target with the Amazon Bedrock Managed Knowledge Bases connector configuration, including setup examples using the Python SDK and CLI, see [Set up a managed knowledge base](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-add-target-api-target-config.html#gateway-add-target-api-connector-managed-kb-setup>) in the target configuration guide.

## Configure the Gateway Service Role

The Gateway needs a service role that allows the AgentCore service to perform retrieval actions on the managed knowledge base on your behalf. For the required IAM permissions and policy configuration, see [Configure the Gateway Service Role](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-add-target-api-target-config.html#gateway-add-target-api-connector-managed-kb-service-role>) in the target configuration guide.

## Invoke the tools

After you create the target, your agent discovers the tools with `tools/list` and calls them with `tools/call`. Each tool name is prefixed with the target name, in the form `<target-name>__ <tool-name>__AgenticRetrieveStream` or `managed-kb___Retrieve`).

For `AgenticRetrieveStream`, your agent passes only the conversation. The retrievers are configured on the target by the administrator, so the agent does not send knowledge base IDs:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "managed-kb___AgenticRetrieveStream",
    "arguments": {
      "messages": [
        { "role": "user", "content": { "text": "How do I configure a knowledge base target?" } }
      ]
    }
  }
}
```
For `Retrieve`, the managed knowledge base identifier is bound to the target, so your agent passes only the query:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "managed-kb___Retrieve",
    "arguments": {
      "retrievalQuery": { "text": "What is Amazon Bedrock AgentCore?" }
    }
  }
}
```
If you exposed retrieval parameters to the agent (see [Control which parameters the agent can set](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-add-target-api-target-config.html#gateway-add-target-api-connector-managed-kb-parameters>)), the agent can override the administrator-configured defaults at call time:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "managed-kb___Retrieve",
    "arguments": {
      "retrievalQuery": { "text": "insurance benefits" },
      "retrievalConfiguration": {
        "managedSearchConfiguration": { "numberOfResults": 2 }
      }
    }
  }
}
```
## AgenticRetrieveStream input schema

The schema returned by `tools/list` is the set of fields your agent can set when it calls `AgenticRetrieveStream`. By default, the only agent-visible field is `messages`. The retrievers to query and all retrieval configuration are administrator-set on the target — see [Set up a managed knowledge base](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-add-target-api-target-config.html#gateway-add-target-api-connector-managed-kb-setup>). To expose more fields to the agent, configure `parameterOverrides` on the target — see [Control which parameters the agent can set](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-add-target-api-target-config.html#gateway-add-target-api-connector-managed-kb-parameters>).

```json
{
  "type": "object",
  "properties": {
    "messages": {
      "description": "The messages for the agentic retrieval conversation. Contains the user query and conversation history.",
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "role": {
            "description": "The role of the message sender (user or assistant).",
            "type": "string",
            "enum": ["user", "assistant"]
          },
          "content": {
            "description": "The content of the message.",
            "type": "object",
            "properties": {
              "text": {
                "description": "The text content of the message.",
                "type": "string"
              }
            }
          }
        },
        "required": ["content", "role"]
      }
    }
  },
  "required": ["messages"]
}
```
Field | Type | Required | Description  
---|---|---|---  
`messages` |  array |  Yes |  The agentic retrieval conversation. Each message has a `role` (`user` or `assistant`) and `content.text`.  
  
For the administrator-set fields — `retrievers`, `agenticRetrieveConfiguration` (foundation model, reranking, `maxAgentIteration`, and guardrails through `policyConfiguration`), and `generateResponse` — see [Set up a managed knowledge base](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-add-target-api-target-config.html#gateway-add-target-api-connector-managed-kb-setup>) and Configuration reference.

## AgenticRetrieveStream response format

`AgenticRetrieveStream` streams a sequence of events. Over MCP, trace events are delivered as `notifications/message` for real-time progress, and the retrieval results and synthesized answer are delivered in the tool result. The stream emits the following event types:

Event | Description  
---|---  
`traceEvent` |  A planning or retrieval step, with a `step` (`Planning`, `Retrieval`, `SpeculativeRetrieval`, or `FullDocumentExpansion`), a `status` (`IN_PROGRESS`, `SUCCEEDED`, or `FAILED`), a human-readable `message`, the `actions` taken, and any `warnings` or `failures`.  
`responseEvent` |  A chunk of the generated answer text. Emitted by default; suppressed only when `generateResponse` is set to `false`.  
`result` |  The retrieval `results` and, unless `generateResponse` is set to `false`, the final `generatedResponse` with the answer and citations.  
  
A `result` event has the following structure:

```json
{
  "result": {
    "results": [
      {
        "content": {
          "text": "Amazon Bedrock AgentCore manages the storage, indexing, and retrieval infrastructure for a managed knowledge base...",
          "mimeType": "text/plain"
        },
        "sourceRetriever": { "identifier": "kb-retriever-1" },
        "metadata": { "x-amz-bedrock-kb-source-uri": "s3://example-bucket/docs/overview.pdf" }
      }
    ],
    "generatedResponse": {
      "answer": "A managed knowledge base lets Amazon Bedrock AgentCore handle the vector store, ingestion, and retrieval for you.",
      "citations": [
        {
          "startIndex": 0,
          "endIndex": 98,
          "references": [ { "..." : "references to supporting results" } ]
        }
      ]
    }
  }
}
```
Field | Type | Required | Description  
---|---|---|---  
`results` |  array |  Yes |  The retrieval results. Each item has `content` (with `text` or `byteContent` and a `mimeType`), the `sourceRetriever` that produced it, and optional `metadata`.  
`generatedResponse` |  object |  No |  Present by default. Omitted only when `generateResponse` is set to `false`. Contains the synthesized `answer` and `citations` that map answer spans (`startIndex`, `endIndex`) to the supporting results.  
`nextToken` |  string |  No |  A token to retrieve the next set of results, if any.  
  
## Retrieve input schema

The schema returned by `tools/list` is the set of fields your agent can set when it calls `Retrieve`. By default, the only agent-visible field is `retrievalQuery.text`. The managed knowledge base identifier and all retrieval settings are administrator-set on the target. To expose retrieval settings such as `numberOfResults` or a metadata `filter` to the agent, configure `parameterOverrides` on the target — see [Control which parameters the agent can set](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-add-target-api-target-config.html#gateway-add-target-api-connector-managed-kb-parameters>).

```json
{
  "type": "object",
  "properties": {
    "retrievalQuery": {
      "description": "Contains the query to send the managed knowledge base.",
      "type": "object",
      "properties": {
        "text": {
          "description": "The text of the query made to the managed knowledge base.",
          "type": "string"
        }
      }
    }
  },
  "required": ["retrievalQuery"]
}
```
Field | Type | Required | Description  
---|---|---|---  
`retrievalQuery` |  object |  Yes |  The query to send to the managed knowledge base.  
`retrievalQuery.text` |  string |  Yes |  The text of the query.  
  
For the administrator-set and overridable fields — `numberOfResults`, a metadata `filter`, `overrideSearchType`, reranking, and multimodal image queries — see Configuration reference.

## Retrieve response format

The `Retrieve` tool returns an MCP `tools/call` result wrapped in a JSON-RPC envelope. The `isError` and `content` fields are inside `result`, and the `text` field contains the serialized `retrievalResults` payload:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "isError": false,
    "content": [
      {
        "type": "text",
        "text": "{\"retrievalResults\":[{\"content\":{\"type\":\"TEXT\",\"text\":\"Amazon Bedrock AgentCore manages the storage, indexing, and retrieval infrastructure for a managed knowledge base...\"},\"location\":{\"type\":\"S3\",\"s3Location\":{\"uri\":\"s3://example-bucket/docs/overview.pdf\"}},\"score\":0.87,\"metadata\":{\"x-amz-bedrock-kb-source-uri\":\"s3://example-bucket/docs/overview.pdf\"}}]}"
      }
    ]
  }
}
```
Each item in `retrievalResults` has the following structure:

Field | Type | Required | Description  
---|---|---|---  
`content` |  object |  Yes |  The content of the retrieved chunk. Includes a `type` (`TEXT`, `IMAGE`, `ROW`, `AUDIO`, or `VIDEO`) and the corresponding content, such as `text` for textual chunks.  
`location` |  object |  No |  The location of the source data. Includes a `type` (`S3`, `WEB`, `CONFLUENCE`, `SHAREPOINT`, `CUSTOM`, etc.) and the matching location object, such as `s3Location.uri`.  
`score` |  number |  No |  The relevance of the result to the query.  
`metadata` |  object |  No |  Metadata attributes and their values for the source file in the data source.  
  
## Configuration reference

The following fields are set by the administrator in `parameterValues`, or exposed to the agent with `parameterOverrides`, when you create the target. For where to set them, see [Set up a managed knowledge base](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-add-target-api-target-config.html#gateway-add-target-api-connector-managed-kb-setup>) and [Control which parameters the agent can set](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-add-target-api-target-config.html#gateway-add-target-api-connector-managed-kb-parameters>).

**`AgenticRetrieveStream` — `agenticRetrieveConfiguration` **

Field | Valid values | Notes  
---|---|---  
`foundationModelType` |  `MANAGED`, `CUSTOM` |  `MANAGED` uses the service-managed model (default). `CUSTOM` uses a Bedrock model ARN you supply.  
`rerankingModelType` |  `MANAGED`, `CUSTOM`, `NONE` |  `MANAGED` uses the service-managed reranker (default). `CUSTOM` uses your own. `NONE` disables reranking.  
`foundationModelConfiguration.type` |  `BEDROCK_FOUNDATION_MODEL` |  Required when `foundationModelType` is `CUSTOM`.  
`maxAgentIteration` |  integer |  Caps the number of planning and retrieval iterations.  
`policyConfiguration.guardrailConfiguration` |  `guardrailId`, `guardrailVersion` |  Attaches an Amazon Bedrock guardrail.  
  
**`Retrieve` — `managedSearchConfiguration` **

Field | Valid values | Notes  
---|---|---  
`numberOfResults` |  integer (1–100) |  Number of source chunks to retrieve.  
`overrideSearchType` |  `HYBRID`, `SEMANTIC` |  `HYBRID` combines keyword and vector search. `SEMANTIC` uses vector search only.  
`rerankingModelType` |  `MANAGED`, `CUSTOM`, `NONE` |  Same as for `AgenticRetrieveStream`.  
`rerankingConfiguration.type` |  `BEDROCK_RERANKING_MODEL` |  Required when using custom reranking.  
`rerankingConfiguration.bedrockRerankingConfiguration.metadataConfiguration.selectionMode` |  `SELECTIVE`, `ALL` |  Controls which metadata fields are passed to the reranker.  
`filter` |  `equals`, `notEquals`, `greaterThan`, `greaterThanOrEquals`, `lessThan`, `lessThanOrEquals`, `in`, `notIn`, `startsWith`, `listContains`, `stringContains`, `andAll`, `orAll` |  Metadata filter. Provide exactly one operator.  
  
## Access control filtering

If your managed knowledge base uses access control to filter results per user or group, the calling application must pass a `userContext` with the request. The Gateway passes `userContext` through to the knowledge base, which applies access-control filtering based on it. The Gateway does not populate `userContext` from the caller’s IAM identity — your application must supply it explicitly.

To use it:

  1. Expose `$.userContext` to the agent by configuring `parameterOverrides` on the target — see [Control which parameters the agent can set](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-add-target-api-target-config.html#gateway-add-target-api-connector-managed-kb-parameters>).

  2. Have the calling application (not the model) include `userContext` in the `tools/call` arguments:


```json
{
  "arguments": {
    "retrievalQuery": { "text": "insurance benefits" },
    "userContext": {
      "userId": "user@example.com"
    }
  }
}
```
