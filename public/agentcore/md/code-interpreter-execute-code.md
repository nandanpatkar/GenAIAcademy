# Executing code - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-execute-code.html

---

# Executing code

Once you have started a Code Interpreter session, you can execute code in the session.

###### Example

Boto3
    

  1. To execute code using the AWS SDK for Python, use the `invoke_code_interpreter` method:

```python
import boto3
import json

# Initialize the boto3 client
dp_client = boto3.client(
    'bedrock-agentcore',
    region_name="<Region>",
    endpoint_url="https://bedrock-agentcore.<Region>.amazonaws.com"
)

# Execute code in the Code Interpreter session
response = dp_client.invoke_code_interpreter(
    codeInterpreterIdentifier="aws.codeinterpreter.v1",
    sessionId="<your-session-id>",
    name="executeCode",
    arguments={
        "language": "python",
        "code": 'print("Hello World!!!")'
    }
)

# Process the event stream
for event in response["stream"]:
    if "result" in event:
        result = event["result"]
        if "content" in result:
            for content_item in result["content"]:
                if content_item["type"] == "text":
                    print(content_item["text"])
```
API
    

  1. To execute code in a code interpreter session using the API, use the following call:

```bash
# Using awscurl
awscurl -X POST \
  "https://bedrock-agentcore.<Region>.amazonaws.com/code-interpreters/aws.codeinterpreter.v1/tools/invoke" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "x-amzn-code-interpreter-session-id: your-session-id" \
  --service bedrock-agentcore \
  --region <Region> \
  -d '{
    "id": "1",
    "name": "executeCode",
    "arguments": {
      "language": "python",
      "code": "print(\"Hello, world!\")"
    }
  }'
```
