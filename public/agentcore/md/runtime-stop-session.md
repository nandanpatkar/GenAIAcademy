# Stop a running session - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-stop-session.html

---

# Stop a running session  
  
The `StopRuntimeSession` operation lets you immediately terminate active agent AgentCore Runtime sessions for proper resource cleanup and session lifecycle management.

When called, this operation instantly terminates the specified session and stops any ongoing streaming responses. This lets system resources be properly released and prevents accumulation of orphaned sessions.

Use `StopRuntimeSession` in these scenarios:

  * **User-initiated end** : When users explicitly conclude their conversation

  * **Application shutdown** : Proactive cleanup before application termination

  * **Error handling** : Force termination of unresponsive or stalled sessions

  * **Quota management** : Stay within session limits by closing unused sessions

  * **Timeout handling** : Clean up sessions that exceed expected duration


## Prerequisites

To use [StopRuntimeSession](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_StopRuntimeSession.html>) , you need:

  * `bedrock-agentcore:StopRuntimeSession` IAM permission

  * A valid agent AgentCore Runtime ARN

  * The ID of an active session to terminate


###### Example

AWS SDK
    

  1. You can use the AWS SDK to stop AgentCore Runtime sessions programmatically.

Python example using boto3 to stop a AgentCore Runtime session.

```python
import boto3

# Initialize the AgentCore client
client = boto3.client('bedrock-agentcore', region_name='us-west-2')

try:
    # Stop the runtime session
    response = client.stop_runtime_session(
        agentRuntimeArn='arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/my-agent',
        runtimeSessionId='your-session-id',
        qualifier='DEFAULT'  # Optional: endpoint name
    )

    print(f"Session terminated successfully")
    print(f"Request ID: {response['ResponseMetadata']['RequestId']}")

except client.exceptions.ResourceNotFoundException:
    print("Session not found or already terminated")
except client.exceptions.AccessDeniedException:
    print("Insufficient permissions to stop session")
except Exception as e:
    print(f"Error stopping session: {str(e)}")
```
HTTPS request
    

  1. For applications using OAuth authentication, make direct HTTPS requests:

```python
import requests
import urllib.parse

def stop_session_with_oauth(agent_arn, session_id, bearer_token, qualifier="DEFAULT"):
    # URL encode the agent ARN
    encoded_arn = agent_arn.replace(':', '%3A').replace('/', '%2F')

    # Construct the endpoint URL
    url = f"https://bedrock-agentcore.us-west-2.amazonaws.com/runtimes/{encoded_arn}/stopruntimesession?qualifier={qualifier}"

    headers = {
        "Authorization": f"Bearer {bearer_token}",
        "Content-Type": "application/json",
        "X-Amzn-Bedrock-AgentCore-Runtime-Session-Id": session_id
    }

    try:
        response = requests.post(url, headers=headers)
        response.raise_for_status()

        print(f"Session {session_id} terminated successfully")
        return response.json()

    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            print("Session not found or already terminated")
        elif e.response.status_code == 403:
            print("Insufficient permissions or invalid token")
        else:
            print(f"HTTP error: {e.response.status_code}")
        raise
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {str(e)}")
        raise

# Usage
stop_session_with_oauth(
    agent_arn="arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/my-agent",
    session_id="your-session-id",
    bearer_token="your-oauth-token"
)
```
## Response format

Expected response format for successful `StopRuntimeSession` operations.

```json
{
    "ResponseMetadata": {
        "RequestId": "12345678-1234-1234-1234-123456789012",
        "HTTPStatusCode": 200
    }
}
```
## Error handling

Common error responses:

Status Code | Error | Description  
---|---|---  
404 |  ResourceNotFoundException |  Session not found or already terminated  
403 |  AccessDeniedException |  Insufficient permissions  
400 |  ValidationException |  Invalid parameters  
409 |  RetryableConflictException |  Session operation in progress, please retry  
500 |  InternalServerException |  Service error  
  
The service returns `RetryableConflictException` (HTTP 409) when your `StopRuntimeSession` call arrives while the service is still provisioning or tearing down the session. This condition is transient and retryable. Retry with short exponential backoff instead of treating it as a terminal failure. The AWS SDKs auto-retry this exception when default retries are enabled. If you disabled retries or call the API directly without an AWS SDK (for example, the HTTPS request shown earlier), retry it yourself.

## Best practices

### Session lifecycle management

```python
class SessionManager:
    def __init__(self, client, agent_arn):
        self.client = client
        self.agent_arn = agent_arn
        self.active_sessions = set()

    def invoke_agent(self, session_id, payload):
        """Invoke agent and track session"""
        try:
            response = self.client.invoke_agent_runtime(
                agentRuntimeArn=self.agent_arn,
                runtimeSessionId=session_id,
                payload=payload
            )
            self.active_sessions.add(session_id)
            return response
        except Exception as e:
            print(f"Failed to invoke agent: {e}")
            raise

    def stop_session(self, session_id):
        """Stop session and remove from tracking"""
        try:
            self.client.stop_runtime_session(
                agentRuntimeArn=self.agent_arn,
                runtimeSessionId=session_id,
                qualifier=endpoint_name
            )
            self.active_sessions.discard(session_id)
            print(f"Session {session_id} stopped")
        except Exception as e:
            print(f"Failed to stop session {session_id}: {e}")

    def cleanup_all_sessions(self):
        """Stop all tracked sessions"""
        for session_id in list(self.active_sessions):
            self.stop_session(session_id)
```
### Recommendations

  * **Always handle exceptions** when stopping sessions

  * **Track active sessions** in your application for cleanup

  * **Set timeouts** for stop requests to avoid hanging

  * **Log session terminations** for debugging and monitoring

  * **Use session managers** for complex applications with multiple sessions



