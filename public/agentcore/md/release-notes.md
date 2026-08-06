# Release notes for Amazon Bedrock AgentCore - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html

---

# Release notes for Amazon Bedrock AgentCore  
  
We recommend subscribing to the RSS feed so updates to these notes are delivered to your Inbox.

## July 2026

### Gateway: Web Search connector version 1.2.0 adds request-level filters and target-level include list

The AgentCore Gateway Web Search Tool connector adds version `1.2.0`. At the target level, users can now configure a domain include list to restrict searches to a chosen set of domains, in addition to the existing exclude list. Both target-level lists now support up to 100 domains, expanded from the previous limit of 20 on the exclude list. At the request level, agents can pass an optional `filters` object on each `tools/call` request: `domainFilter.include` and `domainFilter.exclude` (up to 100 domains per list), and a `publishedDateFilter` with `from` and `to` bounds (ISO-8601 UTC, inclusive). Request-level filters compose with the target-level exclude and include lists, which remain enforced on every request. See [Web Search Tool](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-connector-web-search-tool.html>).

### Identity: Private Key JWT client authentication

With Amazon Bedrock AgentCore Identity, your agents can now use Private Key JWT client authentication. Instead of a shared OAuth 2.0 client secret, your agents authenticate to a downstream identity provider’s token endpoint using a signed JSON Web Token (JWT) client assertion.

You register a public key with your identity provider while the corresponding private key stays in AWS Key Management Service (KMS). AgentCore Identity calls AWS KMS to sign each assertion, so the private key never leaves KMS and every signing operation is recorded in AWS CloudTrail.

Private Key JWT authentication works across all three grant flows—machine-to-machine (M2M), on-behalf-of (OBO), and user-delegated access—and supports the RS256, PS256, and ES256 signing algorithms. To get started, choose Private Key JWT as the client authentication method when you add an OAuth client in the Amazon Bedrock AgentCore console. See [Private Key JWT client authentication](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/private-key-jwt.html>).

### Amazon Bedrock AgentCore Harness: InvokeHarness now streams MCP tool result metadata

Amazon Bedrock AgentCore harness now surfaces metadata attached to MCP tool results, streaming it in the InvokeHarness response. Previously, Amazon Bedrock AgentCore harness dropped metadata that was included on a tool result before it reached the client. When an MCP tool result includes metadata, you receive it on a dedicated toolResultMetadata delta channel in the InvokeHarness response stream. Amazon Bedrock AgentCore harness automatically splits large metadata into ordered fragments so it streams reliably regardless of size. To consume the metadata, concatenate the toolResultMetadata fragments in the order received and parse the combined result as JSON to recover the original metadata object.

### Runtime: Unified span destination for agents

Amazon Bedrock AgentCore runtime agents can now deliver spans to the agent’s own Amazon CloudWatch log group (`/aws/bedrock-agentcore/runtimes/<agent_id>-<endpoint_name>`), in the `spans` log stream, instead of the shared `aws/spans` log group. Spans arrive alongside the agent’s structured logs and standard output. With all telemetry in one log group, you can scope access control and encryption to an individual agent and export from a single location.

Set `UNIFIED_TRACES_DESTINATION_ENABLED=true` on an agent runtime to deliver its spans to the agent’s log group, or `=false` to use the shared `aws/spans` log group. Starting July 20, 2026, newly created agents in supported AWS Regions use the agent’s log group by default. Agents created before this date keep the shared `aws/spans` log group unless you opt them in.

This feature requires CloudWatch Transaction Search with trace segments sent to CloudWatch Logs, `logs:PutResourcePolicy` on the agent’s execution role, and ADOT version 0.18.0 or later. See [Add observability to your Amazon Bedrock AgentCore resources](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html>).

### Amazon Bedrock AgentCore Evaluations and Optimizations: AWS PrivateLink support

With Amazon Bedrock AgentCore Evaluations and Optimizations, you can now call APIs over AWS PrivateLink without traversing the public internet. This covers batch evaluations, online evaluations, recommendations, A/B testing, and configuration bundles. Create a VPC interface endpoint using the service name `com.amazonaws.region.bedrock-agentcore`. Attach endpoint policies to control which principals, actions, and resources are allowed. This feature is available in all commercial AWS Regions where Amazon Bedrock AgentCore Evaluations and Optimizations is available.

### Evaluations: Expanded agent framework support

Amazon Bedrock AgentCore Evaluations now evaluates agents built with OpenAI Agents, LlamaIndex, Google ADK, and Claude Agent SDK, in addition to Strands Agents and LangGraph. Each framework is supported through its OpenTelemetry or OpenInference instrumentation library, and the documentation lists the scope name and recommended version for each combination.

Evaluations also adds generic framework support, which evaluates agents beyond the frameworks listed above. Configure your framework or your own custom instrumentation to emit telemetry in the OpenTelemetry generative AI semantic conventions or the OpenInference semantic conventions, and Evaluations classifies your spans and extracts the values that evaluators need. The documentation lists the scope names, identifying attributes, and content attributes to set.

Each framework has its own page covering how to instrument your agent, how spans are identified, how the service extracts the values it needs, and example spans. See [Supported agent frameworks](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/supported-frameworks.html>).

### Runtime and Built-in Tools: ActiveSessionCount Metric

AgentCore runtime and built-in tools now publish an `ActiveSessionCount` metric directly to your AWS account in the `AWS/Bedrock-AgentCore` CloudWatch namespace. This real-time gauge shows how many sessions are currently active, published once per minute per service type. Use the `Service` dimension — with values `AgentCore.Runtime`, `AgentCore.CodeInterpreter`, or `AgentCore.Browser` — to filter by workload type. Use this metric to monitor capacity utilization, set CloudWatch alarms for unexpected usage spikes, and understand your session quota consumption. Available in all AWS Regions where AgentCore runtime is available. See [AgentCore runtime metrics](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-runtime-metrics.html>).

## June 2026

### Runtime: Increased Default Service Quotas

AgentCore Runtime default service quotas have been increased to support higher-scale workloads. Active session workloads per account are now 5,000 in US East (N. Virginia) and US West (Oregon), and 2,500 in other AWS Regions (previously 1,000 and 500 respectively). The InvokeAgentRuntime API rate has increased from 25 TPS to 200 TPS per agent, per account. The new session creation rate for container deployments has increased from 100 TPM to 400 TPM per endpoint. The new session creation rate for direct code deployments remains at 25 TPS per endpoint. These updated defaults apply automatically to all accounts. See [Service quotas and limits](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/bedrock-agentcore-limits.html>).

### Web Search Tool is now Generally Available

Web Search is a fully managed tool that enables agents to ground responses in current, accurate web knowledge while keeping data residency within your secured AWS environment with zero data egress. Built on Amazon’s search infrastructure, it combines a proprietary web index with structured knowledge graph data. The tool is exposed as a built-in connector target on AgentCore gateway using the Model Context Protocol (MCP), returning ranked results with relevant snippets, source URLs, titles, and publication dates optimized for agentic retrieval. See [Web Search documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/web-search.html>).

### AgentCore Policy Now Supports Bedrock Guardrails

AgentCore now supports Bedrock Guardrails in policy, giving enterprises deeper safety and security controls as they scale AI agents in production. Guardrails evaluates outputs from authorized agent actions and inputs to gateway targets for prompt injection attempts, harmful content, and sensitive data exposure. These checks run at the gateway layer, outside the agent’s code, where the agent cannot reason around them. Because every tool and context source routes through the gateway, every new agent capability is automatically governed by the same security layer. Policies can be authored using natural language or policy-as-code formats. See [Guardrails integration documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-guardrails.html>).

### AgentCore Harness is now Generally Available

The managed AgentCore harness is now generally available in all AWS Regions where AgentCore is supported. You can define an agent with CreateHarness and run it with InvokeHarness, with no orchestration code and no container to build. GA adds built-in memory by default, or bring your own, more model providers through LiteLLM and Bedrock Mantle (which unlocks OpenAI GPT-5.5 and GPT-5.4 and others on Bedrock), the AWS-curated skills catalog with a one-toggle setup, evaluations and optimization, unified observability across capabilities, versioning and endpoints, and export to Strands code. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness.html>).

### Recommendations is now Generally Available

The agent performance loop capabilities enable teams to continuously improve agent quality using real production data. The recommendations capabilities in AgentCore analyze production traces and evaluation outputs to suggest specific improvements to system prompts and tool descriptions, grounded in how the agent actually behaves. This capability works regardless of where agents run: on AgentCore runtime, AWS Lambda, Amazon EKS, or non-AWS environments. See [Optimization documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/optimization.html>).

### Batch Evaluations is now Generally Available

As part of the agent performance loop, batch evaluation tests recommended changes against a defined test dataset and reports aggregate scores, catching regressions before changes reach production. Teams can validate prompt and tool description improvements with confidence before rolling them out to live traffic. See [Batch Evaluations documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/batch-evaluations-getting-started.html>).

### A/B Testing is now Generally Available

A/B testing is the validation step in the agent performance loop. The A/B testing capabilities in AgentCore run a controlled comparison between agent versions by splitting live production traffic, providing real evidence that a change works under production conditions before customers commit to it. This capability works regardless of where agents run: on AgentCore runtime, AWS Lambda, Amazon EKS, or non-AWS environments. See [A/B Testing documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/optimization-ab-testing.html>).

### Amazon Bedrock Managed Knowledge Base is now Generally Available

Developers can now build production-ready AI agents grounded in enterprise data with Managed Knowledge Bases in AgentCore. Managed Knowledge Base provides a fully managed retrieval-augmented generation (RAG) pipeline that agents can query through the gateway, eliminating the need to build and maintain custom retrieval infrastructure. Six native connectors (Amazon S3, SharePoint, Confluence, Google Drive, OneDrive, and Web Crawler) handle data ingestion with automatic syncing and managed vector storage. The service supports hybrid search, document ranking, and advanced retrieval orchestration for complex queries, and handles text, video, audio, and image content. See [Managed Knowledge Base documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/knowledge-base.html>).

### Failure Insights is now in Public Preview

New capabilities can now turn production traces into continuous improvement for agents. The failure insights capabilities in AgentCore discover recurring failure patterns across hundreds of agent sessions, including silent behavioral failures that produce no error signal, explain the root cause of each, and rank them by how widespread they are. Customers can enable continuous monitoring with daily or weekly reports, or run a targeted investigation after a deployment or a spike in complaints, with results in minutes. See [Failure Insights documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/optimization-insights.html>).

### Gateway: AgentCore Runtime targets are now generally available

You can add an Amazon Bedrock AgentCore Runtime agent as a target on your gateway. Your gateway sends traffic directly to the runtime agent without aggregation or protocol translation. This integration is now generally available (GA). As part of GA, you can provide an API schema for the runtime target so that the gateway policy engine applies guardrails. You can also use request and response interceptor Lambda functions to inspect or transform traffic, and enforce that the runtime accepts invocations only when they originate from your gateway. See [AgentCore Runtime targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-http-runtime.html>).

### Gateway: HTTP passthrough targets

AgentCore Gateway now supports HTTP passthrough targets. These targets route traffic through your gateway to any HTTP endpoint without protocol translation. Passthrough targets are ideal for fronting agent URLs, external APIs, application-to-application (A2A) agents, external Model Context Protocol (MCP) servers, or custom inference endpoints. They provide a single gateway endpoint with unified authentication, policy enforcement, and observability. You can provide an API schema to enable policy engine features such as guardrails. You can also configure session stickiness so that weighted routing rules keep a session on the same target. See [HTTP passthrough targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-http-passthrough.html>).

### Gateway: Inference targets

AgentCore Gateway now supports inference targets for fronting model providers. Inference connector targets provide a preconfigured setup for supported providers. Your gateway automatically handles operations, model discovery, model ID translation, and path rewriting. Inference provider targets give you explicit control over the endpoint, model mappings, per-model token limits, operations, and path rewriting. This includes providers that do not have a built-in connector. See [Inference connector targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-inference-connector.html>) and [Inference provider targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-inference-provider.html>).

### Gateway: Enforce inbound traffic from the gateway

You can now configure an Amazon Bedrock AgentCore Runtime to accept invocations only when they originate from your gateway. This prevents callers from bypassing the gateway and reaching the runtime directly. Source validation works across both inbound authorization types. For IAM (Signature Version 4, or SigV4) runtimes, use a resource-based policy that enforces the `aws:SourceArn` condition key. For OAuth (JSON Web Token, or JWT) runtimes, use `allowedWorkloadConfiguration` to restrict the allowed workload to your gateway. See [AgentCore Runtime targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-http-runtime.html>).

### AgentCore achieves SOC compliance

AgentCore is now System and Organization Controls (SOC) compliant and in scope for SOC 1, 2, and 3 reports. The service is officially listed on the [AWS Compliant Services in Scope](<https://aws.amazon.com/compliance/services-in-scope/SOC/>) page.

### Identity: Reference Existing Secrets in AWS Secrets Manager

Amazon Bedrock AgentCore Identity now allows you to reference existing AWS Secrets Manager secret ARNs directly in AgentCore Identity Credential Providers. You can create and manage your secrets in AWS Secrets Manager using your own governance and compliance policies. These policies include custom CMKs, tagging strategies, automatic rotation, and resource policies. You can then reference the existing secret ARN when you configure a Credential Provider in AgentCore Identity. This gives you full ownership of how your secrets are created, classified, and governed, without changing how AgentCore Identity uses them at runtime.

### AgentCore CLI and CDK: Payments Support

The AgentCore CLI (v0.19.0) and CDK constructs (v0.1.0-alpha.36) now include the Payments feature. The `agentcore add payment-manager` and `agentcore add payment-connector` commands create a Payment Manager and Payment Connector via CloudFormation, automatically connected to your Strands agent through the AgentCore SDK’s `AgentCorePaymentsPlugin`. After deploying with `agentcore deploy`, invoke your payments-eligible agent by passing `--payment-instrument-id` and `--payment-user-id` as flags through `agentcore invoke`, along with `--auto-session` to create or reuse a budget-limited session. The CLI also supports interactive TUI wizards for payment setup and `agentcore remove` commands for teardown. Requires CLI version 0.19.0 or later. See the [Payments quick start](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-getting-started.html>) for both SDK and CLI paths.

### Runtime: Interactive Shells (Terminals)

AgentCore Runtime now supports interactive shell sessions, giving agents persistent terminal access to their sandboxed environment. Unlike one-shot command execution, interactive shells maintain state across commands — environment variables, working directories, and running processes persist for the lifetime of the session. Each runtime session supports up to 10 concurrent shell sessions. See [Interactive Shells (Terminals)](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-get-started-command-shell.html>).

### Step Functions integration with AgentCore harness

AWS Step Functions now integrates natively with AgentCore harness, enabling teams to embed agent reasoning steps directly into production workflows. Within a workflow, run multiple harnesses in parallel or sequence, and wrap them with human approval, error handling, or conditional routing steps. Create a new harness inline from the Step Functions visual builder, or reference an existing one with per-invocation overrides to model, system prompt, and tools. Available in all AWS Regions where AgentCore harness is supported. See [Invoke Amazon Bedrock AgentCore harness with Step Functions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-step-functions.html>).

## May 2026

### AWS CDK: AgentCore Constructs Graduate to Stable

The aws-bedrockagentcore L2 constructs have graduated from alpha to stable in aws-cdk-lib. Customers can now define AgentCore resources (runtime, memory, gateway, identity, and more) using CDK with full backward-compatibility guarantees, no separate -alpha package required. The Policy submodule remains in alpha. See [CDK release notes](<https://github.com/aws/aws-cdk/releases/tag/v2.255.0>).

### Gateway: MCP Sessions

AgentCore gateway can now maintain stateful sessions with MCP clients, allowing them to receive a unique Mcp-Session-Id on initialize and track session state (including downstream MCP target sessions, and pending elicitation or sampling request interactions). Sessions are scoped per authenticated user with configurable timeouts (default 1 hour, up to 8 hours). MCP Sessions serves as the foundation for all interactive MCP features below. See [Use MCP sessions with your AgentCore gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-sessions.html>).

### Gateway: Response Streaming

AgentCore Gateway now supports Server-Sent-Events (SSE), delivering multiple JSON-RPC messages on a single connection. Previously, the gateway buffered the entire target response and returned only the final result. Now, events from MCP server targets are delivered as they’re produced, enabling the real-time capabilities below.

### Gateway: Elicitation Pass-Through

MCP servers targets on AgentCore Gateway can now request input from end users mid-tool-execution. The gateway proxies these elicitation requests to the client and routes responses back to the correct downstream server. Supported modes: Form mode — Server sends a structured form (for example, "Confirm you want to proceed with this refund?"), user responds, server continues. URL mode — Server directs the user to a URL (for example, an OAuth consent page), then completes processing once the user finishes. This enables interactive, human-in-the-loop workflows through a managed gateway — no custom infrastructure required. See [Use elicitation with your AgentCore gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-mcp-elicitation.html>).

### Gateway: Sampling Messages

MCP servers can now request LLM completions from the client during tool execution. The gateway transparently relays these server-initiated requests, enabling patterns where tools augment their behavior with model reasoning mid-flight. See [Use sampling with your AgentCore gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-mcp-sampling.html>).

### Gateway: Progress Notifications & Logging Notifications

Clients now receive real-time progress updates and structured log messages from tools as they execute. Previously, the gateway returned only the final result. Now, long-running operations can report incremental progress and emit diagnostic logs that stream directly to the caller. See documentation for [progress notifications](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-mcp-progress.html>) and [logging messages](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-mcp-logging.html>).

### Harness: Bring-Your-Own File System (Amazon S3 Files and Amazon EFS)

AgentCore harnesses now support Amazon S3 Files and Amazon EFS access points alongside managed session storage. Attach access points at `CreateHarness` or `UpdateHarness` time and the harness mounts them into every session at a path you specify. Use S3 Files for round-trip with an S3 bucket, EFS for low-latency shared storage, or combine up to five mounts on a single harness. See [Filesystem](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-memory.html#harness-filesystem>).

### Runtime: Bring-Your-Own File System (Amazon S3 Files and Amazon EFS)

Developers can now attach Amazon S3 Files and Amazon EFS access points directly to agent runtimes. AgentCore Runtime mounts the file system into every session at a path you specify, and your agent reads and writes using standard file operations — no custom mount code, no privileged containers, and no download orchestration required. Mount an S3 Files file system for automatic synchronization between file operations and the S3 bucket, or an EFS access point for a shared NFS file system with sub-millisecond latency. This enables agents to load shared skills, prompt templates, or datasets at session start without re-downloading, persist intermediate results across sessions, and collaborate on the same data across multiple agents. Available across all 15 AWS Regions where AgentCore Runtime is supported. See [File system configurations in AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-filesystem-configurations.html>).

### Agent Performance Loop: Optimization, Batch Evaluation, and User Simulation

Three new capabilities close the observe-evaluate-optimize-deploy loop, enabling teams to continuously improve agent quality using real production data. Optimization analyzes production traces and evaluator outputs to recommend targeted updates to system prompts and tool descriptions, with built-in A/B testing to validate changes before rollout. Batch evaluation replays curated or historical sessions to compare pre/post scores and catch regressions before changes reach end users. User simulation generates realistic, multi-turn conversations using LLM-backed actors to reveal behaviors beyond scripted test cases. See [Optimization](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/optimization.html>), [Batch Evaluations](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/batch-evaluations-getting-started.html>), and [User Simulation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/user-simulation.html>).

### AgentCore is generally available in AWS GovCloud (US-West)

Enterprise-grade agentic AI capabilities are now available for workloads with elevated compliance needs. With AgentCore, organizations can accelerate agents from prototype to production using any framework and any model, while maintaining the security and compliance controls required for government and regulated workloads. For details about AgentCore in AWS GovCloud (US), visit the [GovCloud Documentation](<https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/govcloud-bedrock-agentcore.html>).

### Amazon Bedrock AgentCore payments is now in Preview

Teams can now enable AI agents to autonomously access and pay for APIs, MCP servers, web content, and other agents. Built in partnership with Coinbase and Stripe, AgentCore payments is the first managed payment capabilities purpose-built for autonomous agents, handling the full payment lifecycle from wallet authentication through transaction execution to spending governance and observability. As AI agents become more capable and services shift to pay-per-use models built for machine consumption, developers need infrastructure that lets their agents transact without building bespoke billing integrations, credential management, orchestration logic, budgeting, and observability from scratch. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments.html>).

### Runtime: Custom Header Passthrough

AgentCore now supports passing arbitrary custom headers through to agents, aligned with Gateway’s header propagation model. Previously restricted to `Authorization` and `X-Amzn-Bedrock-AgentCore-Runtime-Custom-*` headers only, customers can now forward headers like transitive authentication tokens and webhook signatures without modification. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-header-allowlist.html>).

## April 2026

### Identity, Gateway, and Runtime: VPC Egress Support

Identity, Gateway, and Runtime now support secure egress to resources within customer VPCs, available in managed and self-managed configurations. Enables agents to invoke private resources (for example, EKS-hosted MCP servers) directly through Gateway and connect to Identity Providers operating within customer VPCs. Includes private DNS resolution for managed VPC egress. See documentation for more details: [Gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-quick-start.html>) | [Identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-private-idp.html>).

### Runtime: Node.js Direct Code Deployment

AgentCore now supports Node.js as a managed language runtime for direct code deployment, alongside existing Python support. Developers can package their Node.js-based agents into a .zip archive without building or managing container images. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-get-started-code-deploy-node.html>).

### Agent Optimization Loop capabilities in Public Preview

AgentCore launches recommendations and two validation methods (batch evaluations and A/B tests), completing the observe-evaluate-improve loop for production agents. Developers can now act on evaluation findings through systematic, validated improvements rather than manual intervention. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/optimization.html>).

### Identity: On-Behalf-Of (OBO) Token Exchange

AgentCore Identity now supports OBO token exchange, enabling agents to securely access protected resources on behalf of authenticated users without requiring multiple consent flows. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/on-behalf-of-token-exchange.html>).

### Region Expansion: São Paulo and Canada Central

AgentCore Identity, Runtime, Code Interpreter, Browser Tool, Gateway, Policy, and Observability are now generally available in São Paulo (GRU). Policy launched in Canada Central (YUL).

### Memory: Structured Metadata Filtering on Long-Term Memory

Teams can now attach structured attributes to memory records and narrow retrieval to only results that match specific values, like priority, department, tags, or time range. Indexed keys can be declared when creating a memory (and cannot be removed once created), metadata schemas can be configured on strategies for automatic LLM extraction from conversations, and metadata filters can be applied when retrieving or listing memory records. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/long-term-memory-metadata.html>).

### Observability: Trace Latency Improvements

Put-to-get latency for complete traces (spans and logs) reduced to under 10 seconds. Previous release had reduced latency to 10 seconds for spans and 30 seconds for logs separately.

### AgentCore harness is now in Public Preview

Teams can now deploy production-ready AI agents without building infrastructure from scratch. The managed harness provides tools, environment management, context systems, memory, identity controls, and observability — all configurable through three API calls. Supports any model provider (Bedrock, Anthropic, OpenAI, Gemini) and runs agents in secure isolated microVMs with persistent memory. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness.html>).

### AgentCore MCP Server in awslabs/mcp

Your coding agent can now spin up an AgentCore agent, cloud browser, run code in a Code Interpreter sandbox, or stand up a Memory resource from any MCP-compatible client (Kiro, Claude Code, Cursor, and others) — without writing a single boto3 call. The official AgentCore MCP server in [awslabs/mcp](<https://github.com/awslabs/mcp>) covers Runtime, Memory, Browser, and Code Interpreter, and authenticates through your default AWS credential chain. See [documentation](<https://github.com/awslabs/mcp/blob/main/src/amazon-bedrock-agentcore-mcp-server/README.md>) for installation notes.

### AgentCore CLI: Agent Inspector

Developers running `agentcore dev` now get a browser-based UI for chatting with agents, inspecting token usage and tool calls, viewing execution traces on a timeline, and browsing deployed AgentCore Memory — all locally before pushing to the cloud. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-get-started-cli.html>).

### Observability: UI Enhancements for Trace and Trajectory

Trace tree details now bundle repeated spans, add visual span icons, and implement default agent span filters to reduce infrastructure noise. Trajectory diagrams eliminate repeated nodes and align layout with industry standards. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-view.html>).

### Gateway and Policy: Full Availability Zone Coverage

Gateway and Policy services are now available across all availability zones within launched regions.

### AgentCore Registry is now in Public Preview

AWS Agent Registry for centralized agent discovery and governance launched in Preview. Customers can create a private, governed catalog and discovery layer for agents, tools, skills, MCP servers, and custom resources. Accessible via Console UI, APIs, or as an MCP server queryable from IDEs. Supports IAM and OAuth (Custom JWT) based access. See [blog](<https://aws.amazon.com/blogs/machine-learning/the-future-of-managing-agents-at-scale-aws-agent-registry-now-in-preview/>) and [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry.html>).

### Observability: Cross-Account Monitoring

AgentCore launched cross-account observability. Customers can monitor logs, metrics, traces, and Evaluations results from a centralized monitoring account by linking multiple source accounts. Each monitoring account can link up to 100,000 log groups across source accounts, and each source account can share data with up to five monitoring accounts. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-cross-account.html>).

### AgentCore CLI: Resource Import and Bash Commands

CLI now supports importing existing AgentCore resources (evaluator and online evaluation config) from your account, executing bash commands within the agent’s Runtime or locally within its container, BYO Dockerfile for Runtime, and Memory streaming. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-get-started-cli.html>).

### Browser: OS-Level Interaction Capabilities

AgentCore Browser launched OS-level interaction capabilities, enabling automation of workflows requiring direct operating system control beyond Chrome DevTools Protocol — including mouse operations, print dialogs, native system alerts, and keyboard shortcuts. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-tool.html>).

### Gateway: 3LO Support for MCP Targets is now GA

Three-legged OAuth (3LO) support for MCP servers reached general availability. Gateways with MCP targets can now obtain user-specific tokens for different end users, enabling access to user-specific data from external services that require explicit user consent. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-MCPservers.html>).

### Observability: Unlimited X-Ray Policy Limits

X-Ray policy limits expanded from 1,200 AgentCore resources to unlimited through wildcard support in resource policies. Removes scaling constraints for enterprise deployments with large agent portfolios.

### Integrations: LangChain Deep Agents Partnership

AgentCore Code Interpreter is now the first AWS-native sandbox provider in LangChain’s Deep Agents framework. New PyPI package `langchain-agentcore-codeinterpreter` published under the LangChain org with documentation live on the LangChain site. Native CLI support via `--sandbox agentcore`.

### Integrations: AG-UI Partnership with CopilotKit

CopilotKit published a joint blog announcing AgentCore as the recommended deployment target for AG-UI agents. AgentCore is now listed as a first-party deployment platform in the [AG-UI GitHub repository](<https://github.com/ag-ui-protocol/ag-ui>).

## March 2026

### AgentCore Evaluations is now Generally Available

AgentCore Evaluations became generally available, providing automated quality assessment for AI agents. Teams can evaluate using 13 built-in evaluators for response quality, safety, task completion, and tool usage. Ground Truth support measures agent performance against reference answers, behavioral assertions, and expected tool execution sequences. Custom evaluators support LLM-based or code-based (Lambda) evaluation logic. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations.html>).

### Observability: One-Click Enablement for Memory and Gateway

One-click observability enablement launched for Memory and Gateway. Customers can now enable logging and tracing for these resource types individually as a one-time effort. This capability was already available for Runtime, Browser Tool, and Code Interpreter. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html>).

### Runtime: Additional IAM Condition Keys

Support deployed for `bedrock-agentcore:RuntimeAuthorizerType` (mandate specific authorization mechanisms) and `aws:VpceOrgID` (restrict invocations to organization-owned VPC endpoints). Essential for OAuth runtimes where principal-based keys are not applicable. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/security_iam_service-with-iam.html>).

### AgentCore CLI is now Generally Available

AgentCore CLI reached GA (v0.4.0), providing a comprehensive command-line tool for building and deploying AI agents in minutes. Streamlines the full lifecycle — scaffolding projects with multiple frameworks (Strands, LangChain, Google ADK, OpenAI Agents), local development with hot reload, adding capabilities like memory and credentials, and deploying to production with full infrastructure management. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-get-started-cli.html>).

### Browser and Code Interpreter: Chrome Policies and Custom Root CA Support

AgentCore launched Chrome Enterprise policies (100+ configurable policies for browser behavior) and custom root CA certificates for both Browser and Code Interpreter. Enables agents to connect to internal services using organization-signed SSL certificates. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-tool.html>).

### Runtime: Managed Session Storage in Public Preview

AgentCore Runtime now offers managed session storage, enabling agents to persist filesystem state across stop and resume cycles. Supports standard Linux filesystem operations with up to 1 GB per session and 14-day retention. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-persistent-filesystems.html>).

### Control Plane Private Link Support for Gateway and Evaluations

AWS PrivateLink support launched for control plane operations for Gateway and Evaluations. AgentCore now has PLE support for all control plane and data plane operations except Identity control plane. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/vpc-interface-endpoints.html>).

### Code Interpreter: Node.js Support

AgentCore Code Interpreter launched Node.js runtime support for JavaScript and TypeScript with pre-installed libraries available immediately. Removes a critical barrier for enterprise customers with substantial Node.js investments. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-runtime-selection.html>).

### Memory: Resource-Based Policies (RBP)

Resource-Based Policy support launched for Memory resources. Customers can attach policies directly to memory resources for granular access control without updating caller IAM roles for every new principal. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/resource-based-policies.html>).

### Runtime: Execute Shell Commands (InvokeAgentRuntimeCommand)

AgentCore Runtime introduced a new API enabling customers to execute shell commands directly within running microVM sessions with real-time HTTP/2 streaming output. Allows organizations to delegate deterministic operations — testing, version control, builds, deployments — to direct execution while preserving agent resources for reasoning. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-execute-command.html>).

### Runtime: OAuth Authentication for WebSocket Connections

AgentCore Runtime now supports OAuth authentication for browser-based WebSocket connections. Browser JavaScript clients can authenticate directly with AgentCore Runtime using an OAuth bearer token without requiring a proxy or server-side relay. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-get-started-websocket.html>).

### Memory: Record Streaming

Developers can now receive push-based notifications whenever memory records are created, updated, or deleted — eliminating polling. Enables event-driven architectures that react to memory record lifecycle changes including triggering downstream workflows and tracking state changes across agents and sessions. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-record-streaming.html>).

### Runtime: AG-UI Protocol Support

AgentCore Runtime launched native support for the AG-UI (Agent User Interface) protocol, enabling real-time streaming of text chunks, reasoning steps, tool calls, and results to frontends; state synchronization for UI elements; structured tool call visualization; and bidirectional WebSocket transport. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-agui-protocol-contract.html>).

### Control Plane Private Link Support for Runtime, Memory, and Built-in Tools

AWS PrivateLink launched for control plane operations across Runtime, Memory, and Built-in Tools. Customers can now create, update, and delete these resources from within their VPC using the new endpoint `com.amazonaws.region.bedrock-agentcore-control`. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/vpc-interface-endpoints.html>).

### AgentCore Policy is now Generally Available

Developers can now use AgentCore Policy in production across thirteen AWS Regions worldwide. Policy gives organizations centralized, fine-grained control over agent-tool interactions by defining exactly what tools an agent can access and under what conditions. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy.html>).

### Stateful MCP Support in Runtime

MCP servers running in AgentCore Runtime can now maintain session context across interactions. When configured in stateful mode, servers unlock advanced capabilities including elicitation (collect user input mid-workflow), sampling (server-initiated LLM calls from within tool execution), and real-time progress notifications (stream updates during long-running tasks). See the [Stateful MCP Server guide](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/mcp-stateful-features.html>).

### Python 3.14 Support in Runtime

AgentCore Runtime now supports [Python 3.14 for Direct Code Deploy](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-get-started-code-deploy-python.html>). Build and deploy agents using the latest Python release and take advantage of its performance improvements and new language features without custom containers.

### AgentCore CLI: Additional Features

AgentCore CLI integrates with AgentCore Gateway and introduces logs/traces commands. New and updated commands: `agentcore add` (incorporate Gateways and Gateway Targets into your project), `agentcore logs` (view logs for deployed agents), `agentcore traces` (view traces for deployed agents). Individual memory resources can now be deployed independently. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-get-started-cli.html>).

### Latency Improvements in Runtime

Sequential calls within a session are now 25-35% faster. AgentCore Runtime now caches authentication tokens for their full 30-minute validity window, eliminating redundant token fetches on every invocation. Platform overhead TM99 decreased 35% in PDX and 25% in IAD, with other regions seeing 12-18% improvements.

## February 2026

### Latency Improvements in Evaluations

Evaluation scores now arrive approximately 50% faster. AgentCore Evaluations moved to incremental state management in the evaluation pipeline, replacing a previous approach that rescanned logs every 5 minutes. P90 end-to-end processing time decreased 37-50% by region. Log query volume is down 70-90% and log query costs down 60-80%.

### AgentCore is now ISO and CSA STAR Certified

AgentCore achieved ISO and CSA STAR compliance standards. The service is now officially listed on the [AWS compliant services page](<https://aws.amazon.com/compliance/services-in-scope/>).

### AgentCore CLI: Public Preview Launch

[AgentCore CLI](<https://github.com/aws/agentcore-cli>) launched in public preview. Developers can create, develop locally, and deploy AI agents using popular frameworks (Strands, LangChain, AutoGen, Google ADK, OpenAI Agents). Manages the full lifecycle from project creation to teardown, with support for memory and identity.

### Browser: Proxy Configuration, Browser Profiles, and Browser Extensions

AgentCore Browser now supports three new capabilities: proxy configuration for IP stability and corporate network integration; browser profiles for persisting cookies and local storage across sessions; and browser extensions for loading Chrome extensions (ad blocking, auth helpers, custom routing). See docs: [Proxies](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-proxies.html>) | [Profiles](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-profiles.html>) | [Extensions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-extensions.html>).

## January 2026

### Runtime, Tools, and Observability: Region Expansion

AgentCore Runtime and Tools (Browser, Code Interpreter) launched in 5 new regions — Europe (Stockholm, Paris, London), Asia Pacific (Seoul), and Canada (Central) — followed by Observability. This brings the full AgentCore capability set to these regions.

### Runtime: VPC Condition Keys Support

AgentCore launched IAM policy condition key support for VPC configurations across Runtime, Browser, and Code Interpreter. Two new condition keys — `bedrock-agentcore:Subnets` and `bedrock-agentcore:SecurityGroups` — enable enterprises to enforce organizational network policies, mandate VPC-connected deployments, and restrict to approved subnets and security groups. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-vpc.html>).

## December 2025

### Policy in Amazon Bedrock AgentCore

Added documentation for the Policy in AgentCore feature, which enables policy-based governance and control for agent interactions. This feature provides policy evaluation, monitoring, and enforcement capabilities for agent workflows.

### Episodic memory strategy

Added documentation for using the episodic memory strategy in AgentCore Memory. See [Episodic memory strategy](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/episodic-memory-strategy.html>).

### Custom claims value support for AgentCore Gateway authentication

Added documentation for specifying custom claims values in AgentCore Gateway authentication. See [The authorization configuration](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-create-api.html>).

### Bidirectional streaming

Added documentation for bidirectional streaming with AgentCore Runtime, which enables real-time, full-duplex communication between clients and agents using WebSocket protocol for interactive agent experiences. See [Bidirectional streaming with AgentCore Runtime](<https://docs.aws.amazon.com//bedrock-agentcore/latest/devguide/runtime-bidirectional-streaming.html>).

### Authentication token support for AgentCore Gateway

Added documentation for setting up authentication tokens for AgentCore Gateway gateways. See [OAuth authorization](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-building-adding-targets-authorization.html>).

### Amazon Bedrock AgentCore Evaluations

Added documentation for Amazon Bedrock AgentCore Evaluations, a comprehensive suite of capabilities for measuring and monitoring the performance, accuracy, and reliability of your agent or tools in both development and production environments. See [Evaluate agent performance with Amazon Bedrock AgentCore Evaluations](<https://docs.aws.amazon.com//bedrock-agentcore/latest/devguide/evaluation/evaluation.html>).

### API gateways as gateway targets

Added documentation for adding an Amazon API Gateway gateway as a target. See [Amazon API Gateway REST API stages as targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-api-gateway.html>).

## November 2025

### Direct code deployment

Added documentation for direct code deployment, which enables you to deploy Python agents to Amazon Bedrock AgentCore Runtime using ZIP file archives for faster development and simpler packaging. See [Get started with direct code deployment](<https://docs.aws.amazon.com//bedrock-agentcore/latest/devguide/runtime-get-started-code-deploy.html>).

## October 2025

### General Availability

Amazon Bedrock AgentCore is now generally available across nine AWS Regions: US East (N. Virginia), US East (Ohio), US West (Oregon), Europe (Frankfurt), Europe (Ireland), Asia Pacific (Mumbai), Asia Pacific (Singapore), Asia Pacific (Sydney), and Asia Pacific (Tokyo). The platform enables building, deploying, and operating agents securely at scale using any framework and any foundation model.

### Web Bot Auth (Preview)

Added documentation for Browser Web Bot Auth feature, which enables AI agents to cryptographically sign HTTP requests to reduce CAPTCHA challenges when browsing websites.

### Runtime identity service-linked role

Added documentation for the new runtime identity service-linked role that manages workload identity access tokens and OAuth credentials. Updated BedrockAgentCoreFullAccess policy to include permission for creating the Amazon Bedrock AgentCore runtime identity service-linked role.

### Model Context Protocol (MCP) servers as Gateway targets

Added documentation for the Model Context Protocol (MCP) servers as Gateway targets and using synchronization operations.

### Model Context Protocol (MCP) server support

Added documentation for the Model Context Protocol (MCP) server that helps you transform, deploy, and test AgentCore-compatible agents directly from your development environment. The MCP server works with popular MCP clients including Kiro, Cursor, Claude Code, and Amazon Q CLI.

## September 2025

### Runtime and Memory: VPC Support

AgentCore Runtime and Memory now support deployment within customer VPCs, enabling secure connectivity to private resources such as databases, internal APIs, and services that are not publicly accessible. Agents running in VPC-connected runtimes can access resources in private subnets while maintaining the same managed infrastructure experience. See [documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-vpc.html>).

### Tagging and AWS CloudFormation Support

AgentCore resources now support tagging for cost allocation, access control, and organizational tracking. Additionally, AWS CloudFormation support enables infrastructure-as-code provisioning and management of AgentCore Runtime and Memory resources, allowing teams to define, version, and deploy agent infrastructure through standard CloudFormation templates. See [Tagging](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/tagging.html>).

## July 2025

### Initial release (preview)

Initial release of the Amazon Bedrock AgentCore Developer Guide.

