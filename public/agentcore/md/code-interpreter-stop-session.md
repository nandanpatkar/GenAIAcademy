# Stopping a AgentCore Code Interpreter session - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-stop-session.html

---

# Stopping a AgentCore Code Interpreter session

When you are finished using a Code Interpreter session, you should stop it to release resources and avoid unnecessary charges.

###### Example

AWS CLI
    

  1. To stop a code interpreter session using the AWS CLI, use the `stop-code-interpreter-session` command:

```bash
aws bedrock-agentcore stop-code-interpreter-session \
  --region <Region> \
  --code-interpreter-id "<your-code-interpreter-id>" \
  --session-id "<your-session-id>"
```
Boto3
    

  1. To stop a Code Interpreter session using the AWS SDK for Python, use the `stop_code_interpreter_session` method:

```python
import boto3

# Initialize the boto3 client
dp_client = boto3.client(
    'bedrock-agentcore',
    region_name="<Region>",
    endpoint_url="https://bedrock-agentcore.<Region>.amazonaws.com"
)

# Stop the Code Interpreter session
response = dp_client.stop_code_interpreter_session(
    codeInterpreterIdentifier="aws.codeinterpreter.v1",
    sessionId="<your-session-id>"
)

print("Session stopped successfully")
```
API
    

  1. To stop a code interpreter session using the API, use the following call:

```bash
# Using awscurl
awscurl -X PUT \
  "https://bedrock-agentcore.<Region>.amazonaws.com/code-interpreters/aws.codeinterpreter.v1/sessions/stop?sessionId=<your-session-id>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  --service bedrock-agentcore \
  --region <Region>
```
