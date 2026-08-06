# How it works - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-how-it-works.html

---

# How it works

The Amazon Bedrock AgentCore Runtime handles scaling, session management, security isolation, and infrastructure management, allowing you to focus on building intelligent agent experiences rather than operational complexity. By leveraging the features and capabilities described here, you can build, deploy, and manage sophisticated AI agents that deliver value to your users while helping to maintain enterprise-grade security and reliability.

###### Topics

  * Key components

  * Authentication and security

  * Additional features

  * Implementation overview


## Key components

### AgentCore Runtime

An AgentCore Runtime is the foundational component that hosts your AI agent or tool code. It represents a containerized application that processes user inputs, maintains context, and executes actions using AI capabilities. When you create an agent, you define its behavior, capabilities, and the tools it can access. For example, a customer support agent might answer product questions, process returns, and escalate complex issues to human representatives.

You can build and deploy agents to AgentCore Runtime using the [AgentCore CLI](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./develop-agents.html#agentcore-cli-configure-deploy>) , the [AgentCore Python SDK](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./develop-agents.html#develop-agents-bedroock-agentcore-sdk>) or directly through [AWS SDKs](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./develop-agents.html#develop-agents-bedrock-agentcore-aws-sdk>) . With the AgentCore Python SDK, you can define your agent using [popular frameworks](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./using-any-agent-framework.html>) like LangGraph, CrewAI, or Strands Agents. The SDK handles infrastructure complexities, allowing you to focus on the agent’s logic and capabilities.

Each AgentCore Runtime:

  * Has a unique identity

  * Is versioned to support controlled deployment and updates


### Versions

Each AgentCore Runtime maintains immutable [versions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./agent-runtime-versioning.html>) that capture a complete snapshot of the configuration at a specific point in time:

  * When you create an AgentCore Runtime, Version 1 (V1) is automatically created

  * Each update to configuration (container image, protocol settings, network settings) creates a new version

  * Each version contains all necessary configuration needed for execution


This versioning system provides reliable deployment history and rollback capabilities.

### Endpoints

[Endpoints](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./agent-runtime-versioning.html>) provide addressable access points to specific versions of your AgentCore Runtime. Each endpoint:

  * Has a unique ARN for invocation

  * References a specific version of your Agent Runtime

  * Provides stable access to your agent even as you update implementations


Key endpoint details:

  * The "DEFAULT" endpoint is automatically created when you call [CreateAgentRuntime](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateAgentRuntime.html>) and points to the latest version

  * When you update your AgentCore Runtime, a new version is created but the `DEFAULT` endpoint automatically updates to reference it

  * You can create custom endpoints with the [CreateAgentRuntimeEndpoint](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateAgentRuntimeEndpoint.html>) operation for different environments (dev, test, prod)

  * When a user makes a request to an endpoint, the request is resolved to the specific agent version referenced by that endpoint


Endpoints have distinct lifecycle states:

  * `CREATING` \- Initial state during endpoint creation

  * `CREATE_FAILED` \- Indicates creation failure due to permissions or other issues

  * `READY` \- Endpoint is operational and accepting requests

  * `UPDATING` \- Endpoint is being modified to reference a new version

  * `UPDATE_FAILED` \- Indicates update operation failure


You can update endpoints without downtime, allowing for seamless version transitions and rollbacks.

### Sessions

[Sessions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-sessions.html>) represent individual interaction contexts between users and your AgentCore Runtime. Each session:

  * Is identified by a unique `runtimeSessionId` provided by your application, or by the Runtime itself in the first invocation if the `runtimeSessionId` is left empty

  * Runs in a dedicated microVM with completely isolated CPU, memory, and filesystem resources

  * Preserves context across multiple interactions within the same conversation

  * Can persist for up to 8 hours of total runtime


Session states include:

  * **Active** \- Currently processing a request or executing background tasks

  * **Idle** \- Not processing any requests but maintaining context while waiting for next interaction

  * **Terminated** \- Session ended due to inactivity (15 minutes), reaching maximum lifetime (8 hours), or being deemed unhealthy


Important session characteristics:

  * After session termination, the entire microVM is terminated and memory is sanitized

  * A subsequent request with the same `runtimeSessionId` after termination will create a new execution environment

  * Session isolation prevents cross-session data contamination and ensures security

  * Session state is ephemeral and should not be used for long-term durability (use AgentCore Memory for context durability)


This complete isolation between sessions is crucial for enterprise security, particularly when dealing with non-deterministic AI processes.

## Authentication and security

Inbound authentication controls who can access your agents through AWS Identity and Access Management or OAuth 2.0, validating bearer tokens from identity providers before allowing requests to proceed. Outbound authentication enables your agents to securely access third-party services using OAuth or API keys, with AgentCore Identity managing credentials in either user-delegated or autonomous modes. For more information, see [Authenticate and authorize with Inbound Auth and Outbound Auth](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-oauth.html>).

### Inbound authentication

Inbound Auth, powered by AgentCore Identity, controls who can access and invoke your agents or tools in AgentCore Runtime.

#### Authentication methods

  * **AWS IAM** (SigV4): Uses AWS credentials for identity verification

  * **OAuth 2.0** : Integrates with external identity providers


#### OAuth configuration options

  * **Discovery URL** : Your identity provider’s OpenID Connect discovery endpoint

  * **Allowed Audiences** : List of valid audience values your tokens should contain

  * **Allowed Clients** : List of client identifiers that can access this agent


#### Authentication flow

  1. End users authenticate with your identity provider (Amazon Cognito, Okta, Microsoft Entra ID)

  2. Your client application receives a bearer token after successful authentication

  3. The client passes this token in the authorization header when invoking the agent

  4. AgentCore Runtime validates the token with the authorization server

  5. If valid, the request is processed; if invalid, it’s rejected


This ensures only authenticated users with proper authorization can access your agents.

### Outbound authentication

Outbound Auth, powered by Amazon Bedrock AgentCore Identity, lets your agents hosted on AgentCore Runtime securely access third-party services:

#### Authentication methods

  * **OAuth** : For services supporting OAuth flows

  * **API Keys** : For services using key-based authentication


#### Authentication modes

  * **User-delegated** : Acting on behalf of the end user with their credentials

  * **Autonomous** : Acting independently with service-level credentials


#### Supported services

  * Enterprise systems such as Slack, Zoom, and GitHub

  * AWS services

  * Custom APIs and data sources


AgentCore Identity manages these credentials securely, preventing credential exposure in your agent code or logs.

## Additional features

### Asynchronous processing

AgentCore Runtime supports long-running workloads through:

  * Background task handling for operations that exceed request/response cycles

  * Automatic status tracking via the `/ping` endpoint

  * Support for operations up to 8 hours in duration


For more information, see [Handle asynchronous and long running agents with Amazon Bedrock AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-long-run.html>).

### Streaming responses

Agents can stream partial results as they become available rather than waiting for complete processing. This lets you provide a more responsive user experience, especially for operations that generate large amounts of content or take significant time to complete. For more information, see [Stream agent responses](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./response-streaming.html>).

### WebSocket API

The AgentCore Runtime provides [WebSocket](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-http-protocol-contract.html#ws-endpoint>) support for real-time bidirectional streaming connections for interactive agent communication. This enables more responsive and interactive agent experiences. For more information, see [Get started with bidirectional streaming using WebSocket](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-get-started-websocket.html>).

### Protocol support

AgentCore Runtime supports multiple communication protocols:

  * [HTTP](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-http-protocol-contract.html>) : Direct REST API endpoints for traditional request/response patterns. For more information, see [Get started with the AgentCore CLI](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-get-started-cli.html>).

  * [MCP](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-mcp-protocol-contract.html>) : Model Context Protocol for tools and agent servers. For more information, see [Deploy MCP servers in AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-mcp.html>).

  * [A2A](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-a2a-protocol-contract.html>) : Agent-to-Agent protocol for multi-agent communication and discovery. For more information, see [Deploy A2A servers in AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-a2a.html>).


## Implementation overview

Here’s how to get started with the AgentCore Runtime. For the complete example, see [Get started with the AgentCore CLI](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-get-started-cli.html>).

### Prepare your agent or tool code

  * Define your agent logic using any AI framework or custom code

  * Add the required HTTP endpoints using the AgentCore SDK or custom implementation

  * Package dependencies in a requirements.txt file


### Deploy your agent or tool

  * Build and push a container image to Amazon ECR directly or via the AgentCore SDK

  * Create an AgentCore Runtime using the container image

  * The initial version (V1) and DEFAULT endpoint are created automatically


### Invoke your agent or tool

  * Generate a unique session ID for each user conversation

  * Call the [InvokeAgentRuntime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_InvokeAgentRuntime.html>) or [InvokeAgentRuntimeWithWebSocketStream](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-get-started-websocket.html>) operation with your agent’s ARN and session ID

  * Pass user input in the request payload


### Manage and observe sessions, and make updates

  * Use the same session ID for follow-up interactions to maintain context

  * Review logs, traces, and observability metrics

  * Deploy updates by modifying your AgentCore Runtime (creates new versions)

  * Control rollout by updating endpoints to point to new versions



