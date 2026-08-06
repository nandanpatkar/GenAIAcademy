# Web Search Tool - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-connector-web-search-tool.html

---

# Web Search Tool

AI agents are transforming how organizations interact with information, but they face a fundamental limitation: their knowledge is frozen at training time. When a user asks about today’s stock prices or a software release that shipped an hour ago, an agent relying solely on its training data cannot provide accurate answers.

Building custom web search integrations to solve this is costly — procuring third-party search APIs, managing keys and quotas and rate limits, parsing inconsistent result formats across providers, building snippet extraction logic so models get relevant passages instead of raw HTML, reasoning about where customer queries travel and how data might be retained, and maintaining freshness and coverage over time. Each of these is a project in itself.

Web Search Tool on Amazon Bedrock AgentCore eliminates that complexity. It is a fully managed, MCP-compliant web search capability that lets your agents retrieve information from the web without any infrastructure overhead. It is available as a managed connector that you connect to your AgentCore Gateway. Agents discover it with a standard `tools/list` call and invoke it like any other Model Context Protocol tool. There are no search APIs to provision, no outbound credentials to manage, and no result-parsing glue to maintain.

The following sections walk through the key capabilities, the architecture of the purpose-built web index, privacy guarantees, use cases, and how to set up Web Search Tool.

###### Topics

  * Key capabilities

  * Purpose-built web index

  * Private by design

  * How it works

  * Use cases

  * Set up Web Search Tool

  * Use with a harness

  * Configure domain filtering

  * Configure the Gateway Service Role

  * Input schema

  * Response format

  * Availability

  * Acceptable use


## Key capabilities

  * **Up-to-date information access** — Retrieve current web results with titles, URLs, snippets, and publication dates to ground agent responses in up-to-date information.

  * **Zero infrastructure management** — No third-party search APIs to provision or scaling to configure. The Gateway exposes web search as a standard MCP tool automatically.

  * **Framework agnostic** — Works with Strands Agents, LangChain, LangGraph, CrewAI, or any MCP-compatible client through the standard Model Context Protocol.

  * **Domain and date filtering** — Restrict searches with a target-level domain exclude list. In connector version `1.2.0` and later, targets also support a domain include list, and agents can pass per-request domain include and exclude lists and published-date bounds.

  * **Purpose-built web index** — Backed by an Amazon-operated web index spanning tens of billions of documents.

  * **Knowledge graph for high-confidence facts** — Grounds entities and their relationships to provide factual answers rather than leaving the model to infer them from extracted page text.

  * **Semantic snippet extraction** — Pulls semantically relevant passages from each web page, optimized for a model’s context window, rather than returning raw HTML or full pages.


## Purpose-built web index

Many solutions that add web search to an agent are wrappers over a third-party search engine. Web Search Tool on Amazon Bedrock AgentCore is different — it is backed by a web index that Amazon builds and operates directly.

**Broad coverage**
    

The index spans tens of billions of documents. That scale matters for coverage — long-tail questions about niche libraries or obscure product specifications can be more effectively answered when the index is broad rather than limited to the most popular pages.

**Continuously updated**
    

Amazon refreshes the index on an ongoing basis, reflecting new and changed content within minutes. For agents answering questions about price movements, or just-published announcements, that recency window is the difference between a grounded answer and a confidently wrong one. When your agent searches for "what happened today," the results reflect what actually happened today.

**Knowledge graph for high-confidence facts**
    

Web Search Tool includes a built-in knowledge graph that grounds entities and their relationships. For factual questions — such as who holds a role or when something was founded — the knowledge graph provides high-confidence answers rather than leaving the model to infer them from extracted page text. This reduces the kind of subtle factual drift that can occur when an agent stitches together an answer from snippets alone.

**Semantic snippet extraction optimized for model context**
    

Rather than handing the model a raw HTML dump or a full page, the tool performs semantically relevant snippet extraction. It pulls the passages from each web page that actually bear on the query and returns them in a form optimized for a model’s context window. The result is denser, more relevant context per token — the model sees the parts that matter and spends fewer tokens on boilerplate and navigation chrome, which helps improve the precision of cited answers.

## Private by design

For many enterprises, the question that stalls a web search rollout isn’t "does it work" — it’s "where do my users' queries go, and what happens to them?" Web Search Tool is built so those answers are straightforward.

**Queries never leave AWS**
    

When your agent issues a search, the query is served entirely within AWS infrastructure. Customer queries are not sent to a third-party search engine or routed outside AWS. The Gateway authenticates to the AWS-owned connector and routes the request internally, so the data path stays inside AWS end to end. For teams with data egress concerns, this removes an entire category of review.

## How it works

The Web Search Tool is a built-in **connector**. The Gateway handles schema management, parameter governance, endpoint resolution, and service authentication.

  1. **Gateway setup** — Create a Gateway and add a Web Search Tool target using `connectorId: "web-search"`. The Gateway snapshots the tool schema and provisions the integration.

  2. **Tool discovery** — Your agent calls `tools/list` on the Gateway endpoint and discovers the `WebSearch` tool with its input schema.

  3. **Search invocation** — Your agent calls `tools/call` with a natural language query (up to 200 characters) and, in connector version `1.2.0` and later, optional request-level filters for domains and published dates. The Gateway authenticates to the backend and routes the request internally within AWS.

  4. **Structured results** — The tool returns results with semantically relevant text snippets, URLs, titles, and publication dates in both text and structured JSON formats.

  5. **Grounded response** — Your agent uses the results to compose a response with cited sources.


## Use cases

  * **Up-to-date research** — Answer questions about current events, stock prices, or recent announcements by searching the web and synthesizing results with source citations.

  * **Fact-checking** — Verify claims in documents by searching for primary sources and confirming or correcting figures using knowledge graph-backed factual answers.

  * **Competitive intelligence** — Monitor competitor announcements, product launches, or pricing changes from public web sources.

  * **Stale knowledge elimination** — Give agents access to information published after their training cutoff, such as new software releases, policy changes, or breaking developments.


## Set up Web Search Tool

For instructions on how to create a Gateway Target with the Web Search Tool connector configuration, including setup examples using the Python SDK and CLI, see [Set up Web Search Tool](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-add-target-api-target-config.html#gateway-add-target-api-connector-web-search-setup>) in the target configuration guide.

## Use with a harness

To give an [AgentCore harness](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness.html>) web search capability, attach the gateway that you created in Set up Web Search Tool to the harness as an `agentcore_gateway` tool. The harness execution role requires the `bedrock-agentcore:InvokeGateway` permission on the gateway ARN. For the end-to-end walkthrough, see [Tools](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-tools.html>) in the harness documentation.

## Configure domain filtering

Web Search Tool supports 2 layers of filtering that compose on every request:

  * **Target-level domain exclude list and include list.** When setting up the target, the administrator configures lists of domains that the target excludes from or restricts every search to. Both lists are hidden from the calling agent and applied to every request that flows through the target.

  * **Request-level filters (connector version`1.2.0` and later).** The calling agent can pass an optional `filters` object with each `tools/call` request:

    * `domainFilter` — `include` and `exclude` lists, up to 100 domains per list. Web Search Tool returns results only from domains on the `include` list and drops any result whose domain appears on the `exclude` list.

    * `publishedDateFilter` — `from` and `to` bounds, inclusive, ISO-8601 UTC. Web Search Tool returns only results with a published date that falls on or between the `from` and `to` dates.


Request-level filters compose with the target-level exclude list and include list:

  * A domain is dropped from results if it appears on either the target-level exclude list or the request-level exclude list.

  * A domain is returned only if it appears on every include list that is set. If only the target-level include list or only the request-level include list is set, that list is honored. If both are set, only domains present in both are returned. If the two share no domains, no results are returned.


Request-level filters cannot override the target-level exclude list or expand results beyond the target-level include list.

For configuration examples and details, see [Configure domain filtering](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-add-target-api-target-config.html#gateway-add-target-api-connector-web-search-domain-filtering>) in the target configuration guide.

## Configure the Gateway Service Role

The Gateway needs a service role that allows the AgentCore service to perform actions on your behalf. For the required IAM permissions and policy configuration, see [Configure the Gateway Service Role](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-add-target-api-target-config.html#gateway-add-target-api-connector-web-search-service-role>) in the target configuration guide.

## Input schema

The Web Search Tool accepts the following input schema when invoked through `tools/call`. The `filters` field is available only when the target is pinned to connector version `1.2.0` or later. On earlier versions, the schema exposes only `query` and `maxResults`.

```json
{
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": {
        "description": "The search query string",
        "type": "string"
      },
      "maxResults": {
        "description": "Maximum number of results to return. Valid range: 1-25. Defaults to 10.",
        "type": "integer"
      },
      "filters": {
        "description": "Optional request-level filters (connector version 1.2.0+). Applied on top of the target-level exclude list and include list.",
        "type": "object",
        "properties": {
          "domainFilter": {
            "description": "Per-call domain filter. Include and exclude lists each hold up to 100 domains. Root domain matches subdomains.",
            "type": "object",
            "properties": {
              "include": {
                "description": "Restrict results to these domains.",
                "type": "array",
                "items": {"type": "string"}
              },
              "exclude": {
                "description": "Drop results from these domains.",
                "type": "array",
                "items": {"type": "string"}
              }
            }
          },
          "publishedDateFilter": {
            "description": "Per-call published-date filter. Bounds inclusive, ISO-8601 UTC. Applies to web results only.",
            "type": "object",
            "properties": {
              "from": {
                "description": "Earliest publication date (ISO-8601 UTC).",
                "type": "string"
              },
              "to": {
                "description": "Latest publication date (ISO-8601 UTC).",
                "type": "string"
              }
            }
          }
        }
      }
    },
    "required": ["query"]
  }
}
```
Field | Type | Required | Description  
---|---|---|---  
`query` |  string |  Yes |  The search query string. Must be 200 characters or fewer.  
`maxResults` |  integer |  No |  Maximum number of results to return. Valid range: 1-25. Defaults to 10.  
`filters` |  object |  No |  Optional request-level filters. Available in connector version `1.2.0` and later.  
`filters.domainFilter.include` |  array of strings |  No |  Domains to include. Up to 100 entries.  
`filters.domainFilter.exclude` |  array of strings |  No |  Domains to exclude. Up to 100 entries.  
`filters.publishedDateFilter.from` |  string |  No |  Earliest publication date, ISO-8601 UTC.  
`filters.publishedDateFilter.to` |  string |  No |  Latest publication date, ISO-8601 UTC.  
  
## Response format

The Web Search Tool returns results in the following MCP-compliant format:

```json
{
  "isError": false,
  "content": [
    {
      "type": "text",
      "text": "{\"id\":\"824f89d0\",\"results\":[{\"text\":\"Python 3.13 was released on October 7, 2024, featuring improvements to the interactive interpreter, experimental free-threaded mode, and a preliminary JIT compiler...\",\"publishedDate\":\"2024-10-07\",\"url\":\"https://example.com/python/releases/3.13\",\"title\":\"Python 3.13 Release Highlights\"}]}"
    }
  ]
}
```
Field | Type | Required | Description  
---|---|---|---  
`text` |  string |  Yes |  Text content or snippet of the search result  
`url` |  string |  No |  URL of the source webpage  
`title` |  string |  No |  Title of the source webpage  
`publishedDate` |  string |  No |  Publication date of the result  
  
## Availability

The Web Search Tool connector is available in the US East (N. Virginia) `us-east-1` Region.

Because Amazon operates the full search stack, improvements to freshness, coverage, relevance, and snippet quality flow to your agents automatically through the same managed connector. No version upgrades or migrations are needed on your side.

## Acceptable use

If you use Web Search Tool, you are responsible for your use, and any use by your end users, of content retrieved from Web Search Tool ("Search Results"). You must retain and display the source citations and links provided with each Search Result in any output you surface to your end users that uses the Search Result. You may not use Web Search Tool to (a) extract, store, or reproduce content from Search Results in bulk, or (b) build or populate a competing index or database.

