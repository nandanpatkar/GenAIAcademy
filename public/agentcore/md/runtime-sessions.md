# Use isolated sessions for agents - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-sessions.html

---

# Use isolated sessions for agents

Amazon Bedrock AgentCore Runtime lets you isolate each user session and safely reuse context across multiple invocations in a user session. Session isolation is critical for AI agent workloads due to their unique operational characteristics:

  * **Complete execution environment separation** : Each user session in AgentCore Runtime receives its own dedicated microVM with isolated Compute, memory, and filesystem resources. This prevents one user’s agent from accessing another user’s data. After session completion, the entire microVM is terminated and memory is sanitized to remove all session data, eliminating cross-session contamination risks.

  * **Stateful reasoning processes** : Unlike stateless functions, AI agents maintain complex contextual state throughout their execution cycle, beyond simple message history for multi-turn conversations. AgentCore Runtime preserves this state securely within a session while ensuring complete isolation between different users, enabling personalized agent experiences without compromising data boundaries.

  * **Privileged tool operations** : AI agents perform privileged operations on users' behalf through integrated tools accessing various resources. AgentCore Runtime’s isolation model ensures these tool operations maintain proper security contexts and prevents credential sharing or permission escalation between different user sessions.

  * **Deterministic security for non-deterministic processes** : AI agent behavior can be non-deterministic due to the probabilistic nature of foundation models. AgentCore Runtime provides consistent, deterministic isolation boundaries regardless of agent execution patterns, delivering the predictable security properties required for enterprise deployments.


###### Note

AgentCore does not enforce session-to-user mappings - your client backend should maintain the relationship between users and their session IDs. Additionally, your client backend should implement logic for user to session lifecycle management like maximum number of sessions per user. For complete session isolation guidance, see [Security best practices for AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-security-best-practices.html>).

###### Topics

  * Understanding ephemeral context

  * Extended conversations and multi-step workflows

  * AgentCore Runtime session lifecycle

  * How to use sessions

  * Session headers by protocol

  * [Configure Amazon Bedrock AgentCore lifecycle settings](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-lifecycle-settings.html>)

  * [Stop a running session](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-stop-session.html>)


## Understanding ephemeral context

By default, the compute (microVM) associated with a session is ephemeral. Any data stored in memory or written to disk persists only for the compute lifecycle. This includes conversation history, user preferences, intermediate calculation results, and any other state information your agent maintains.

To persist filesystem data across session stop/resume cycles, configure **session storage** — a persistent directory that survives compute termination. See [File system configurations for AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-filesystem-configurations.html>).

For structured data that needs to be retained beyond the session lifetime (such as user conversation history, learned preferences, or important insights), use AgentCore Memory. This service provides purpose-built persistent storage designed specifically for agent workloads, with both short-term and long-term memory capabilities.

## Extended conversations and multi-step workflows

Unlike traditional serverless functions that terminate after each request, AgentCore supports isolated sessions backed by ephemeral computes lasting up to 8 hours per lifecycle. This simplifies building multi-step agentic workflows as you can make multiple calls to the same environment, with each invocation building upon the context established by previous interactions. You can use both `InvokeAgentRuntime` for agent reasoning and `InvokeAgentRuntimeCommand` for deterministic shell command execution within the same session.

## AgentCore Runtime session lifecycle

**Session creation**

A new session is created on the first invoke with a unique runtimeSessionId provided by your application. AgentCore Runtime provisions a dedicated execution environment (microVM) for each session. Context is preserved between invocations to the same session. Both `InvokeAgentRuntime` and `InvokeAgentRuntimeCommand` operate on the same session — a command sees the same container, filesystem, and environment as the agent.

**Session states**

Session state is determined by the compute lifecycle and can be one of the following:

  * **Active** : Either processing a sync request, executing a command, or doing background tasks. Sync invocation and command execution activity is automatically tracked based on invocations to a runtime session. Background tasks are communicated by the agent code by responding with "HealthyBusy" status in pings.

  * **Idle** : When not processing any requests or background tasks. The session has completed processing but remains available for future invocations.

  * **Stopped** : The compute (microVM) provisioned for the session has been terminated and the session is stopped. This can occur due to inactivity (default 15 minutes), reaching max compute lifetime (default 8 hours), an explicit stop by invoking the [StopRuntimeSession](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_StopRuntimeSession.html>) API, or if the compute is deemed unhealthy based on health checks. The session transitions back to Active on the next invocation and a new compute is provisioned, with the same lifecycle configuration (i.e. idleRuntimeSessionTimeout and maxLifetime that can be up to another 8 hours). The session itself remains valid until the AgentCore Runtime ARN is deleted. If the runtime is configured with session storage, filesystem data at the configured mount path persists across stop/resume cycles. See [File system configurations for AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-filesystem-configurations.html>).


###### Note

While the service provisions or tears down a session, a second operation targeting that same session returns a retryable HTTP 409 `RetryableConflictException` (`Session operation in progress, please retry`). This window is brief. Already-running sessions are not affected. Retry with short exponential backoff.

## How to use sessions

To use sessions effectively:

  * Generate a unique session ID for each user or conversation with at least 33 characters

  * Pass the same session ID for all related invocations

  * Use different session IDs for different users or conversations


**Example Using sessions for a conversation**

```bash
# First message in a conversation

response1 = agent_core_client.InvokeAgentRuntime(
   agentRuntimeArn=agent_arn,
   runtimeSessionId="user-123456-conversation-12345678", # or uuid.uuid4()
   payload=json.dumps({"prompt": "Tell me about AWS"}).encode()
)

# Follow-up message in the same conversation reuses the runtimeSessionId.

response2 = agent_core_client.InvokeAgentRuntime(
   agentRuntimeArn=agent_arn,
   runtimeSessionId="user-123456-conversation-12345678", # or uuid.uuid4()
   payload=json.dumps({"prompt": "How does it compare to other cloud providers"}).encode()
)
```
By using the same runtimeSessionId for related invocations, you ensure that context is maintained across the conversation, allowing your agent to provide coherent responses that build on previous interactions.

## Session headers by protocol

When invoking agents, include the appropriate session header to ensure requests are routed to the same microVM. The header depends on your agent’s configured protocol:

Protocol | Session Header  
---|---  
MCP |  `Mcp-Session-Id`  
HTTP |  `X-Amzn-Bedrock-AgentCore-Runtime-Session-Id`  
A2A |  `X-Amzn-Bedrock-AgentCore-Runtime-Session-Id`  
AG-UI |  `X-Amzn-Bedrock-AgentCore-Runtime-Session-Id`  
  
**MicroVM stickiness** : Amazon Bedrock AgentCore uses the session header to route requests to the same microVM instance. Clients must capture the session ID returned in the response and include it in all subsequent requests to ensure session affinity. Without a consistent session ID, each request may be routed to a new microVM, which may result in additional latency due to cold starts.

For MCP protocol specifics including stateless and stateful modes, see [MCP session management and microVM stickiness](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-mcp-protocol-contract.html#mcp-session-management>).

