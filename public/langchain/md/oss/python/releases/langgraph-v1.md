**LangGraph v1 is a stability-focused release for the agent runtime.** It keeps the core graph APIs and execution model unchanged, while refining type safety, docs, and developer ergonomics.

It's designed to work hand-in-hand with [LangChain v1](lc:oss/python/releases/langchain-v1) (whose `create_agent` is built on LangGraph) so you can start high-level and drop down to granular control when needed.

    ### [Stable core APIs](#)
Graph primitives (state, nodes, edges) and the execution/runtime model are unchanged, making upgrades straightforward.

    ### [Reliability, by default](#)
Durable execution with checkpointing, persistence, streaming, and human-in-the-loop continues to be first-class.

    ### [Seamless with LangChain v1](#)
LangChain's `create_agent` runs on LangGraph. Use LangChain for a fast start; drop to LangGraph for custom orchestration.

To upgrade,

```lc-tabs
[
 {
  "label": "pip",
  "lang": "bash",
  "code": "pip install -U langgraph"
 },
 {
  "label": "uv",
  "lang": "bash",
  "code": "uv add langgraph"
 }
]
```

## Deprecation of `create_react_agent`

The LangGraph `create_react_agent` prebuilt has been deprecated in favor of LangChain's `create_agent`. It provides a simpler interface, and offers greater customization potential through the introduction of middleware.

* For information on the new `create_agent` API, see the [LangChain v1 release notes](lc:oss/python/releases/langchain-v1#create_agent).
* For information on migrating from `create_react_agent` to `create_agent`, see the [LangChain v1 migration guide](lc:oss/python/migrate/langchain-v1#migrate-to-create_agent).

## Reporting issues

Please report any issues discovered with 1.0 on [GitHub](https://github.com/langchain-ai/langgraph/issues) using the [`'v1'` label](https://github.com/langchain-ai/langgraph/issues?q=state%3Aopen%20label%3Av1).

## Additional resources

    ### [LangGraph 1.0](#)
Read the announcement

    ### [Overview](#)
What LangGraph is and when to use it

    ### [Graph API](#)
Build graphs with state, nodes, and edges

    ### [LangChain Agents](#)
High-level agents built on LangGraph

    ### [Migration guide](#)
How to migrate to LangGraph v1

    ### [GitHub](#)
Report issues or contribute

## See also

- [Versioning](lc:oss/python/versioning) – Understanding version numbers
- [Release policy](lc:oss/python/release-policy) – Detailed release policies
