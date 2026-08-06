# AgentCore harness - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness.html

---

# AgentCore harness

Every agent has an orchestration layer: a loop that calls the model, picks tools, passes results back, manages context, and handles failures. Running it in production takes real infrastructure underneath: compute, a sandbox, secure tool connections, filesystem, memory, identity, and observability. Together, they form the **agent harness** , the system that lets an agent actually run.

Standing one up locally is fast. Production is where the work explodes, and the moment it has to serve more than one user, a whole new layer shows up: concurrency, isolation, identity, state, scaling. Until now, every team did that work themselves.

The managed agent harness in AgentCore turns that work into configuration. You declare what your agent does (model, tools, skills, instructions); AgentCore handles the **environment, compute, memory, identity, networking, and observability** that turn the config into a running agent. Trying a different model or adding a new tool is a config change, not a code rewrite.

![AgentCore harness architecture](/agentcore/images/harness-architecture.png)

Every harness session is stateful by default and runs in a secure, **isolated microVM per session** (backed by AgentCore runtime). The agent has its own **filesystem and shell** , so it can write code, execute it, and can persist **short-term and long-term memories** and files across sessions, even when the underlying microVM session has expired and is replaced by a new one. Agents can use **any model** provided by Amazon Bedrock, OpenAI, Google Gemini, or any LiteLLM-compatible provider, and can **switch providers mid-session** without losing context, so you can plan with one model and execute with another, or swap providers for a price-performance test without rebuilding the conversation. Agents can connect to tools through **[AgentCore gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html>), [MCP servers](<https://modelcontextprotocol.io/>), or use the built-in [browser](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-tool.html>) or [code interpreter](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-tool.html>) **. You can attach **AWS skills from Git, S3, or the curated AWS skills** catalog with a single toggle, so the agent picks up domain expertise on demand instead of improvising. When you need a custom environment with your own dependencies, you can **bring your own container.** You can also **mount S3 Files or EFS** to share data across sessions and harnesses with full S3 durability and history. **Every action is traced automatically** through AgentCore observability, with a unified view that surfaces what the agent did across every capability in one place, so you stop hopping between log groups to piece together what happened.

You can iterate on real traffic with AgentCore evaluations and optimization to **score behavior, get prompt and tool-description recommendations, and run A/B tests with statistical significance** reporting per session. Then, roll out changes safely with **immutable versions and named endpoints** , and roll back instantly by pointing an endpoint at an earlier version. You can drop a harness into a larger pipeline through the AgentCore InvokeHarness state in AWS Step Functions, or export to Strands code (Claude Agent SDK coming soon) and run it on AgentCore runtime when configuration isn’t enough. Everything you need to build, run, and operate production agents, without managing infrastructure. The harness is powered by [Strands Agents](<https://strandsagents.com/>), the open-source agent framework from AWS.

There is no separate harness charge. You pay only for the underlying AgentCore capabilities you use. For details, see the [AgentCore pricing page](<https://aws.amazon.com/bedrock/agentcore/pricing/>).

**AgentCore harness is available in GA across all regions shown[here](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-regions.html>).**

###### Topics

  * [Get started](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-get-started.html>)

  * [Models and instructions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-models.html>)

  * [Tools](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-tools.html>)

  * [Skills](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-skills.html>)

  * [Memory](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-memory.html>)

  * [Environment and filesystem](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-environment.html>)

  * [Observability and cost controls](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-operations.html>)

  * [AgentCore harness versioning and endpoints](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-versioning.html>)

  * [Export harness to code](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-export.html>)

  * [Security and access controls](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-security.html>)

  * [AgentCore harness vs. Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-vs-runtime.html>)



