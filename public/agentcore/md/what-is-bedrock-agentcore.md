# Overview - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html

---

# Overview

## What is Amazon Bedrock AgentCore?

Amazon Bedrock AgentCore is an agentic platform for building, deploying, and operating highly effective agents securely at scale using any framework and foundation model. With AgentCore, you can enable agents to take actions across tools and data with the right permissions and governance, run agents securely at scale, and monitor agent performance and quality in production - all without any infrastructure management. AgentCore services work together or independently with any open-source framework such as CrewAI, LangGraph, LlamaIndex, and Strands Agents and with any foundation model, so you don’t have to choose between open-source flexibility and enterprise-grade security and reliability.

![What is AgentCore?](/agentcore/images/agentcore_all_components_final.png)

## Core services in Amazon Bedrock AgentCore

Amazon Bedrock AgentCore includes the following modular services and capabilities that you can use together or independently:

Service | Description | Integrations  
---|---|---  
[Harness](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness.html>) |  A managed agent loop that lets you define and invoke AI agents with a single API call. Specify a model, system prompt, and tools inline. Harness handles orchestration, tool execution, memory management, and response generation. Each session runs in an isolated microVM with filesystem and shell access, supporting use cases like code generation, data analysis, and deep research. Bring your own container image for custom environments with additional dependencies. |  AgentCore Harness works with Amazon Bedrock, OpenAI, Google Gemini, and any OpenAI-compatible model provider. Integrates with AgentCore Memory, Gateway, Browser, Code Interpreter, and Observability. Supports remote MCP servers, inline functions, and custom container environments.  
[Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./agents-tools-runtime.html>) |  A secure, serverless runtime environment purpose-built for deploying and scaling dynamic AI agents and tools. Runtime provides fast cold starts for real-time interactions, extended runtime support for asynchronous agents, true session isolation, built-in identity, and support for multi-modal and multi-agent agentic workloads. |  AgentCore Runtime works with custom frameworks and any open-source framework, including CrewAI, LangGraph, LlamaIndex, Google ADK, OpenAI Agents SDK, and Strands Agents, any foundation model in or outside of Amazon Bedrock including OpenAI, Google’s Gemini, Anthropic’s Claude, Amazon Nova, Meta Llama, and Mistral models, and popular protocols like MCP and A2A.  
[Memory](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory.html>) |  A way to build context-aware agents with complete control over what the agent remembers and learns. Supports for both short-term memory for multi-turn conversations and long-term memory that persists across sessions, with the ability to not only share memory stores across agents but also learn from experiences. |  AgentCore Memory works with LangGraph, LangChain, Strands, LlamaIndex  
[Gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway.html>) |  A secure way to convert your APIs, Lambda functions, and existing services into Model Context Protocol (MCP)-compatible tools and also connect to pre-existing MCP servers, making them available to AI agents through Gateway endpoints with just a few lines of code. |  Any APIs, MCP tools, Lambda, and popular integrations including Salesforce, Zoom, JIRA, Slack etc.  
[Identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity.html>) |  A secure, scalable agent identity, access and authentication management service which is compatible with existing identity providers, eliminating needs for user migration or rebuilding authentication flows. |  Any IdP and credential providers such as Amazon Cognito, Okta, Microsoft Azure Entra ID, Auth0 etc.  
[Code Interpreter](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-interpreter-tool.html>) |  An isolated sandbox environment for agents to execute code enhancing their accuracy and expanding their ability to solve complex end-to-end tasks. |  Multiple languages including Python, JavaScript and TypeScript  
[Browser](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-tool.html>) |  A fast and secure cloud-based browser runtime environment to enable AI agents to interact with web applications, fill forms, navigate websites, and extract information in a fully managed environment. |  Any foundation model or popular browser automation frameworks including Playwright and BrowserUse  
[Observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability.html>) |  A unified view to trace, debug and monitor agent performance in production. It offers detailed visualizations of each step in the agent workflow, enabling you to inspect an agent’s execution path, audit intermediate outputs, and debug performance bottlenecks and failures. |  Any monitoring and observability stack that integrate with telemetry data emitted in standardized OpenTelemetry (OTEL)-compatible format  
[Payments](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments.html>) |  A fully managed service that enables microtransaction payments for AI agents to access paid APIs, MCP servers, and content using the x402 protocol. Payments provides wallet integration, configurable spending limits, and end-to-end observability for agent payment operations. |  AgentCore payments supports Coinbase CDP and Stripe (Privy) wallet providers, AgentCore Gateway, Strands Agents, any x402-compatible endpoint, AgentCore Identity and AgentCore Observability powered by Amazon CloudWatch for unified monitoring.  
[Evaluations](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./evaluations.html>) |  A purpose-built evaluation service for automated, consistent, and data-driven agent assessment. AgentCore Evaluations measures how well your agents and tools execute tasks, handle edge cases, and maintain output reliability across diverse inputs and contexts. Evaluations provides measurable quality signals, helps teams optimize performance using structured insights, and ensures your agent meets functional and behavioral standards before and after deployment. |  AgentCore Evaluations supports evaluations on sessions, traces, and spans generated from Strands Agent or LangGraph frameworks, and instrumented using OpenTelemetry or OpenInference. All results integrated into AgentCore Observability powered by Amazon CloudWatch for unified monitoring.  
[Optimization](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./optimization.html>) |  A continuous improvement service that uses AI-generated recommendations, versioned configuration bundles, and A/B testing to improve agent performance through data-driven configuration changes. Instead of manual, guesswork-driven optimization, you point the service at agent traces to generate improvements and validate them with controlled experiments. |  AgentCore optimization builds on AgentCore Evaluations and works with agents instrumented using OpenTelemetry via AgentCore Observability. Supports system prompt and tool description optimization with traffic splitting through AgentCore Gateway for A/B testing.  
[Policy](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./policy.html>) |  A capability that provides deterministic control to ensure agents operate within defined boundaries and business rules without slowing them down. Easily author fine-grained rules using natural language or [Cedar](<https://www.cedarpolicy.com/en>) (AWS's open-source policy language). |  Integrates with AgentCore Gateway, to intercept every tool call before execution. You can define which tools agents can access, what actions they can perform, and under what conditions.  
[Registry](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry.html>) |  A centralized catalog for discovering and managing agents, MCP servers, tools, skills and custom resources across your organization. Registry provides a governed workflow for publishing, reviewing, and approving resources, with hybrid semantic and keyword search so that agents and developers can find the right tools. |  AgentCore Registry works with any MCP Server, Agent, Skill or Custom Resource, deployed on AWS, On-Prem or on any other Cloud environment.  
  
## What can you build with Amazon Bedrock AgentCore?

With Amazon Bedrock AgentCore, developers can accelerate AI agents into production with the scale, reliability, and security, critical to real-world deployment. Some common use cases for which you must consider leveraging AgentCore are:

  * **Agents**

Build autonomous AI apps that reason, use tools, and maintain context. Deploy agents for customer support, workflow automation, data analysis, or coding assistance. Your agent runs serverless with isolated sessions, persistent memory, and built-in observability.

  * **Tools and Model Context Protocol (MCP) Servers**

Transform existing APIs, databases, or services into tools that any MCP-compatible agent can use. Deploy a gateway that wraps your Lambda functions or OpenAPI specs making your backend instantly accessible to agents without rewriting code.

  * **Agent Platforms**

Provide your internal developers or customers with a paved path to build and deploy agents using approved tools, shared memory stores, and governed access to enterprise services. Centralize observability, authentication, and compliance while enabling teams to ship agent-powered features faster.


## Pricing for Amazon Bedrock AgentCore

AgentCore offers flexible, consumption-based pricing with no upfront commitments or minimum fees. For more information, see [AgentCore pricing](<https://aws.amazon.com/bedrock/agentcore/pricing/>) . AgentCore may use and store your content to improve your service experience or performance. Such improvements would be for your use of AgentCore and not for other customers.

## Next Steps

If you are a first-time user of Amazon Bedrock AgentCore, we recommend that you begin by reading the following sections:

  * [Get started with Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./agentcore-get-started-cli.html>)

  * [Understand the available interfaces for using Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./develop-agents.html>)



