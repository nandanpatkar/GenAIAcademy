# Starting a AgentCore Code Interpreter session - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-start-session.html

---

# Starting a AgentCore Code Interpreter session

After creating a Code Interpreter, you can start a session to execute code.

###### Example

AWS CLI
    

  1. To start a Code Interpreter session using the AWS CLI, use the `start-code-interpreter-session` command:

```bash
aws bedrock-agentcore start-code-interpreter-session \
  --region <Region> \
  --code-interpreter-id "<your-code-interpreter-id>" \
  --name "my-code-session" \
  --description "My Code Interpreter session for data analysis" \
  --session-timeout-seconds 900
```
Boto3
    

  1. To start a Code Interpreter session using the AWS SDK for Python, use the `start_code_interpreter_session` method:

```python
import boto3

# Initialize the boto3 client
dp_client = boto3.client(
    'bedrock-agentcore',
    region_name="<Region>",
    endpoint_url="https://bedrock-agentcore.<Region>.amazonaws.com"
)

# Start a Code Interpreter session
response = dp_client.start_code_interpreter_session(
    codeInterpreterIdentifier="aws.codeinterpreter.v1",
    name="sandbox-session-1",
    sessionTimeoutSeconds=3600
)

# Print the session ID
session_id = response["sessionId"]
print(f"Session created: {session_id}")
```
API
    

  1. To start a new Code Interpreter session using the API, use the following call:

```bash
# Using awscurl
awscurl -X PUT \
  "https://bedrock-agentcore.<Region>.amazonaws.com/code-interpreters/aws.codeinterpreter.v1/sessions/start" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  --service bedrock-agentcore \
  --region <Region> \
  -d '{
    "name": "code-session-abc12345",
    "description": "code sandbox session",
    "sessionTimeoutSeconds": 900
  }'
```
###### Note

You can use the managed resource ID `aws.codeinterpreter.v1` or a resource ID you get by creating a code interpreter with `CreateCodeInterpreter`.



