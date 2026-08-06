# Invoke an AgentCore Runtime agent - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-invoke-agent.html

---

# Invoke an AgentCore Runtime agent

The [InvokeAgentRuntime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_InvokeAgentRuntime.html>) operation lets you send requests to specific AgentCore Runtime endpoints identified by their Amazon Resource Name (ARN) and receive streaming responses containing the agent’s output. The API supports session management through session identifiers, enabling you to maintain conversation context across multiple interactions. You can target specific agent endpoints using optional qualifiers.

To call `InvokeAgentRuntime` , you need `bedrock-agentcore:InvokeAgentRuntime` permissions. In the call you can also pass a bearer token that the agent can use for user authentication.

The `InvokeAgentRuntime` operation accepts your request payload as binary data up to 100 MB in size and returns a streaming response that delivers chunks of data in real-time as the agent processes your request. This streaming approach allows you to receive partial results immediately rather than waiting for the complete response, making it ideal for interactive applications.

To execute shell commands (such as running tests, git operations, or environment setup) in the same session, use the [Execute shell commands in AgentCore Runtime sessions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-execute-command.html>) operation. Both operations work on the same agent runtime and session.

If you plan on integrating your agent with OAuth, you can’t use the AWS SDK to call `InvokeAgentRuntime` . Instead, make a HTTPS request to InvokeAgentRuntime. For more information, see [Authenticate and authorize with Inbound Auth and Outbound Auth](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-oauth.html>).

## Invoke streaming agents

The following example shows how to use boto3 to invoke an agent runtime:

```python
import boto3
import json

# Initialize the Bedrock AgentCore client
agent_core_client = boto3.client('bedrock-agentcore')

# Prepare the payload
payload = json.dumps({"prompt": prompt}).encode()

# Invoke the agent
response = agent_core_client.invoke_agent_runtime(
    agentRuntimeArn=agent_arn,
    runtimeSessionId=session_id,
    payload=payload
)

# Process and print the response
if "text/event-stream" in response.get("contentType", ""):

    # Handle streaming response
    content = []
    for line in response["response"].iter_lines(chunk_size=10):
        if line:
            line = line.decode("utf-8")
            if line.startswith("data: "):
                line = line[6:]
                print(line)
                content.append(line)
    print("\nComplete response:", "\n".join(content))

elif response.get("contentType") == "application/json":
    # Handle standard JSON response
    content = []
    for chunk in response.get("response", []):
        content.append(chunk.decode('utf-8'))
    print(json.loads(''.join(content)))

else:
    # Print raw response for other content types
    print(response)
```
## Invoke multi-modal agents

You can use the `InvokeAgentRuntime` operation to send multi-modal requests that include both text and images. The following example shows how to invoke a multi-modal agent:

```python
import boto3
import json
import base64

# Read and encode image
with open("image.jpg", "rb") as image_file:
    image_data = base64.b64encode(image_file.read()).decode('utf-8')

# Prepare multi-modal payload
payload = json.dumps({
    "prompt": "Describe what you see in this image",
    "media": {
        "type": "image",
        "format": "jpeg",
        "data": image_data
 }
}).encode()

# Invoke the agent
response = agent_core_client.invoke_agent_runtime(
    agentRuntimeArn=agent_arn,
    runtimeSessionId=session_id,
    payload=payload
)
```
## Session management

The `InvokeAgentRuntime` operation supports session management through the `runtimeSessionId` parameter. By providing the same session identifier across multiple requests, you can maintain conversation context, allowing the agent to reference previous interactions.

To start a new conversation, generate a unique session identifier. To continue an existing conversation, use the same session identifier from previous requests. This approach enables you to build interactive applications that maintain context over time.

###### Tip

For best results, use a UUID or other unique identifier for your session IDs to avoid collisions between different users or conversations.

## Error handling

When using the `InvokeAgentRuntime` operation, you might encounter various errors. Here are some common errors and how to handle them:

**ValidationException**
    

Occurs when the request parameters are invalid. Check that your agent ARN, session ID, and payload are correctly formatted.

**ResourceNotFoundException**
    

Occurs when the specified agent runtime cannot be found. Verify that the agent ARN is correct and that the agent exists in your AWS account.

**AccessDeniedException**
    

Occurs when you don’t have the necessary permissions. Ensure that your IAM policy includes the `bedrock-agentcore:InvokeAgentRuntime` permission.

**ThrottlingException**
    

Occurs when you exceed the request rate limits. Implement exponential backoff and retry logic in your application.

**RetryableConflictException**
    

Occurs (HTTP 409) when a second operation targets a session while the service is provisioning or tearing down that session. The message is `Session operation in progress, please retry`. This condition is transient and retryable. The window is brief and already-running sessions are not affected. Retry with short exponential backoff. The AWS SDKs auto-retry this exception when default retries are enabled. If you disabled retries or call the API directly, retry it yourself.

Implement proper error handling in your application to provide a better user experience and to troubleshoot issues effectively.

## Best practices

Follow these best practices when using the `InvokeAgentRuntime` operation:

  * **Validate the prompt field is a string in your agent entrypoint** —The payload arrives as parsed JSON, so the `prompt` field can be any JSON type (string, list, object). If a non-string value containing a `toolUse` content block reaches your agent framework, the framework might execute the named tool directly. Model reasoning and guardrail evaluation are bypassed. Always enforce `isinstance(prompt, str)` before passing input to the agent. For more information, see [Security best practices for AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-security-best-practices.html>).

  * Use session management to maintain conversation context for a better user experience.

  * Process streaming responses incrementally to provide real-time feedback to users.

  * Implement proper error handling and retry logic for a robust application.

  * Consider payload size limitations (100 MB) when sending requests, especially for multi-modal content.

  * Use appropriate qualifiers to target specific agent versions or endpoints.

  * Implement authentication mechanisms when necessary using bearer tokens.

  * Use `InvokeAgentRuntimeCommand` for deterministic operations (tests, git, builds) instead of routing them through the agent’s LLM. See [Execute shell commands in AgentCore Runtime sessions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-execute-command.html>).



