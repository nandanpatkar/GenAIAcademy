# Amazon Bedrock AgentCore Gateway: A secure AI gateway for agents, tools, and models - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html

---

# Amazon Bedrock AgentCore Gateway: A secure AI gateway for agents, tools, and models

Amazon Bedrock AgentCore Gateway is a fully managed AI gateway that provides a single, secure entry point for agentic traffic—connecting agents to tools, to other agents, and to large language models (LLMs). Rather than serving only as an MCP tool gateway, Gateway routes and secures any agentic traffic through one endpoint: it converts APIs, Lambda functions, and existing services into Model Context Protocol (MCP)-compatible tools; fronts other agents and HTTP services through passthrough targets (including Agent-to-Agent (A2A) traffic); and routes inference requests across multiple model providers through a unified, model-based routing endpoint. Gateway supports OpenAPI, Smithy, and Lambda as tool input types, and is the only solution that provides both comprehensive ingress authentication and egress authentication in a fully managed service. Gateway also provides 1-click integration with several popular tools such as Salesforce, Slack, Jira, Asana, and Zendesk. Gateway eliminates weeks of custom code development, infrastructure provisioning, and security implementation so developers can focus on building innovative agent applications.

###### Topics

  * Key benefits

  * Key capabilities

  * [Get started with AgentCore Gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-quick-start.html>)

  * [Core concepts for Amazon Bedrock AgentCore Gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-core-concepts.html>)

  * [Amazon Bedrock AgentCore Gateway features](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-features.html>)

  * [Supported targets for Amazon Bedrock AgentCore gateways](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-supported-targets.html>)

  * [Prerequisites for using the Amazon Bedrock AgentCore gateway service](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-prerequisites.html>)

  * [Set up an Amazon Bedrock AgentCore gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-building.html>)

  * [Use an AgentCore gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-using.html>)

  * [Add rules to a gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-rules.html>)

  * [Fine-grained access control for Amazon Bedrock AgentCore Gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-fine-grained-access-control.html>)

  * [Debug and assess your gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-building-debug.html>)

  * [Advanced features and topics for Amazon Bedrock AgentCore Gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-advanced.html>)


## Key benefits

**Simplify tool development and integration**
    

Transform existing enterprise resources into agent-ready tools in just a few lines of code. Instead of spending months writing custom integration code and managing infrastructure, developers can focus on building differentiated agent capabilities while Gateway handles the undifferentiated heavy lifting of tool management and security at enterprise scale. Gateway also provides 1-click integration with several popular tools such as Salesforce, Slack, Jira, Asana, and Zendesk.

**Accelerate agent development through unified access**
    

Enable your agents to discover and reach tools, other agents, and models through a single, secure endpoint. By combining multiple sources—from APIs and Lambda functions to other agents and model providers—into one unified interface, developers can build and scale agent workflows faster without managing multiple connections or reimplementing integrations.

**Scale with confidence through intelligent tool discovery**
    

As your tool collection grows, help your agents find and use the right tools through contextual search. Built-in semantic search capabilities help agents effectively use available tools based on their task context, improving agent performance and reducing development complexity at scale.

**Comprehensive authentication**
    

Manage both inbound authentication (verifying agent identity) and outbound authentication (connecting to tools) in a single service. Handle OAuth flows, token refresh, and secure credential storage for third-party services.

**Framework compatibility**
    

Work with popular open-source frameworks including CrewAI, LangGraph, LlamaIndex, and Strands Agents. Integrate with any model while maintaining enterprise-grade security and reliability.

**Serverless infrastructure**
    

Eliminate infrastructure management with a fully managed service that automatically scales based on demand. Built-in observability and auditing capabilities simplify monitoring and troubleshooting.

## Key capabilities

Gateway provides the following key capabilities:

  * **Security Guard** \- Manages OAuth authorization to ensure only valid users and agents can access tools and resources.

  * **Translation** \- Converts agent requests using protocols like Model Context Protocol (MCP) into API requests and Lambda invocations, eliminating the need to manage protocol integration or version support.

  * **Composition** \- Combines multiple APIs, functions, tools, agents, and model providers behind a single endpoint for streamlined agent access, including model-based routing of inference traffic across providers.

  * **Secure Credential Exchange** \- Handles credential injection for each tool, enabling agents to use tools with different authentication requirements seamlessly.

  * **Semantic Tool Selection** \- Enables agents to search across available tools to find the most appropriate ones for specific contexts, allowing agents to use thousands of tools while minimizing prompt size and reducing latency.

  * **Infrastructure Manager** \- Provides a serverless solution with built-in observability and auditing, eliminating infrastructure management overhead.



