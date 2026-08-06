Configure and build applications on the [Agent Server](lc:langsmith/agent-server) runtime. Once deployed, agents work with three primitives: [**assistants**](lc:langsmith/assistants) for configuration, [**threads**](lc:langsmith/use-threads) for state, and [**runs**](lc:langsmith/runs) for workloads. The pages in this tab cover the capabilities Agent Server provides, how to [structure your application](lc:langsmith/application-structure), and how to [secure](lc:langsmith/auth) and [customize](lc:langsmith/custom-routes) the server.

## Capabilities

### [Develop your application](#)
Structure your app, configure dependencies for Python, JavaScript, and monorepos, and connect agents with RemoteGraph, semantic search, TTLs, and CI/CD.

### [Agent Server runtime](#)
Work with assistants, threads, runs, and cron jobs. Stream to users, pause for human review, handle concurrent input, and connect via MCP and A2A.

### [Auth & access control](#)
Authenticate users, enforce resource-level access, and connect external OAuth2 identity providers.

### [Server customization](#)
Add caching, custom stores and checkpointers, lifespan hooks, middleware, custom routes, encryption, and configurable headers and logs.

## Tutorials

- [Collect user feedback for Agent Server runs](lc:langsmith/agent-server-feedback): Attach end-user feedback to runs and traces
- [Deploy other frameworks (e.g., Strands, CrewAI)](lc:langsmith/deploy-other-frameworks): Wrap existing agents with Functional API and deploy
- [Implement generative user interfaces with LangGraph](lc:langsmith/generative-ui-react): Stream UI elements to a React client
- [Implement a CI/CD pipeline](lc:langsmith/cicd-pipeline-example): Automate tests, evaluations, and deployments with GitHub Actions

## Securing and customizing your server

- [Custom auth](lc:langsmith/auth): Authentication and multi-tenant access control
- [Server customization](lc:langsmith/custom-routes): Custom routes, [middleware](lc:langsmith/custom-middleware), [lifespan hooks](lc:langsmith/custom-lifespan), [encryption](lc:langsmith/encryption)

## Operations

- [CI/CD pipelines](lc:langsmith/cicd-pipeline-example)
- [TTL configuration](lc:langsmith/configure-ttl) for state and thread management
- [Semantic search](lc:langsmith/semantic-search)
