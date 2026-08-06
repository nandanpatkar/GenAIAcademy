# Session management - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-session-characteristics.html

---

# Session management

The AgentCore Code Interpreter sessions have the following characteristics:

Session timeout
    

Default: 900 seconds (15 minutes)

Configurable: Can be adjusted when creating sessions, up to 8 hours

Session persistence
    

Files and data created during a session are available throughout the session’s lifetime. When the session is terminated, the session no longer persists and the data is cleaned up.

Automatic termination
    

Sessions automatically terminate after the configured timeout period

Multiple sessions
    

Multiple sessions can be active simultaneously for a single code interpreter. Each session maintains its own state and environment

Retention policy
    

The time to live (TTL) retention policy for the session data is 30 days.

###### Topics

  * Using isolated sessions

  * [Starting a AgentCore Code Interpreter session](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-interpreter-start-session.html>)

  * [Executing code](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-interpreter-execute-code.html>)

  * [Runtime selection](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-interpreter-runtime-selection.html>)

  * [Stopping a AgentCore Code Interpreter session](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-interpreter-stop-session.html>)


## Using isolated sessions

AgentCore Tools enable isolation of each user session to ensure secure and consistent reuse of context across multiple tool invocations. Session isolation is especially important for AI agent workloads due to their dynamic and multi-step execution patterns.

Each tool session runs in a dedicated microVM with isolated CPU, memory, and filesystem resources. This architecture guarantees that one user’s tool invocation cannot access data from another user’s session. Upon session completion, the microVM is fully terminated, and its memory is sanitized, thereby eliminating any risk of cross-session data leakage.

