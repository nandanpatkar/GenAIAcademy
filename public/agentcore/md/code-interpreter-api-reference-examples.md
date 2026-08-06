# Code Interpreter API Reference Examples - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-api-reference-examples.html

---

# Code Interpreter API Reference Examples

This section provides reference examples for common Code Interpreter operations using different approaches. Each example shows how to perform the same operation using AWS CLI, Boto3 SDK, and direct API calls.

## Code Execution

These examples demonstrate how to execute code in a Code Interpreter session.

###### Example

Boto3
    

  1. 
```python
params = {
      "language": "python",
      "code": "print(\"Hello, world!\")"
    }

client.invoke_code_interpreter(
    **{
        "codeInterpreterIdentifier": "aws.codeinterpreter.v1",
        "sessionId": "<your-session-id>",
        "name": "executeCode",
        "arguments": params
    })
```
 


API
    

  1. 
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
    "name": "executeCode",
    "arguments": {
      "language": "python",
      "code": "print(\"Hello, world!\")"
    }
  }'
```
 


## Terminal Commands

These examples demonstrate how to execute terminal commands in a Code Interpreter session.

### Execute Command

###### Example

Boto3
    

  1. 
```text
params = {
      "command": "ls -l"
    }

client.invoke_code_interpreter(
    **{
        "codeInterpreterIdentifier": "aws.codeinterpreter.v1",
        "sessionId": "<your-session-id>",
        "name": "executeCommand",
        "arguments": params
    })
```
 


API
    

  1. 
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
    "name": "executeCommand",
    "arguments": {
      "command": "ls -l"
    }
  }'
```
 


### Start Command Execution

###### Example

Boto3
    

  1. 
```text
params = {
      "command": "sleep 15 && echo Task completed successfully"
    }

client.invoke_code_interpreter(
    **{
        "codeInterpreterIdentifier": "aws.codeinterpreter.v1",
        "sessionId": "<your-session-id>",
        "name": "startCommandExecution",
        "arguments": params
    })
```
 


API
    

  1. 
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
    "name": "startCommandExecution",
    "arguments": {
      "command": "sleep 15 && echo Task completed successfully"
    }
  }'
```
 


### Get Task

###### Example

Boto3
    

  1. 
```text
params = {
      "taskId": "<your-task-id>"
    }

client.invoke_code_interpreter(
    **{
        "codeInterpreterIdentifier": "aws.codeinterpreter.v1",
        "sessionId": "<your-session-id>",
        "name": "getTask",
        "arguments": params
    })
```
 


API
    

  1. 
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
    "name": "getTask",
    "arguments": {
      "taskId": "<your-task-id>"
    }
  }'
```
 


### Stop Command Execution Task

###### Example

Boto3
    

  1. 
```text
params = {
      "taskId": "<your-task-id>"
    }

client.invoke_code_interpreter(
    **{
        "codeInterpreterIdentifier": "aws.codeinterpreter.v1",
        "sessionId": "<your-session-id>",
        "name": "stopTask",
        "arguments": params
    })
```
 


API
    

  1. 
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
    "name": "stopTask",
    "arguments": {
      "taskId": "<your-task-id>"
    }
  }'
```
 


## File Management

These examples demonstrate how to manage files in a Code Interpreter session.

### Write Files

###### Example

Boto3
    

  1. 
```text
params = {
        "content": [{"path": "dir1/samename.txt", "text": "File in dir1"}]
    }

client.invoke_code_interpreter(
    **{
        "codeInterpreterIdentifier": "aws.codeinterpreter.v1",
        "sessionId": "<your-session-id>",
        "name": "writeFiles",
        "arguments": params
    })
```
 


API
    

  1. 
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
    "name": "writeFiles",
    "arguments": {
      "content": [{"path": "dir1/samename.txt", "text": "File in dir1"}]
    }
  }'
```
 


### Read Files

###### Example

Boto3
    

  1. 
```text
params = {
      "paths": ["tmp.txt"]
    }

client.invoke_code_interpreter(
    **{
        "codeInterpreterIdentifier": "aws.codeinterpreter.v1",
        "sessionId": "<your-session-id>",
        "name": "readFiles",
        "arguments": params
    })
```
 


API
    

  1. 
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
    "name": "readFiles",
    "arguments": {
      "paths": ["tmp.txt"]
    }
  }'
```
 


### Remove Files

###### Example

Boto3
    

  1. 
```text
params = {
      "paths": ["tmp.txt"]
    }

client.invoke_code_interpreter(
    **{
        "codeInterpreterIdentifier": "aws.codeinterpreter.v1",
        "sessionId": "<your-session-id>",
        "name": "removeFiles",
        "arguments": params
    })
```
 


API
    

  1. 
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
    "name": "removeFiles",
    "arguments": {
      "paths": ["tmp.txt"]
    }
  }'
```
 


### List Files

###### Example

Boto3
    

  1. 
```text
params = {
      "directoryPath": ""
    }

client.invoke_code_interpreter(
    **{
        "codeInterpreterIdentifier": "aws.codeinterpreter.v1",
        "sessionId": "<your-session-id>",
        "name": "listFiles",
        "arguments": params
    })
```
 


API
    

  1. 
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
    "name": "listFiles",
    "arguments": {
      "directoryPath": ""
    }
  }'
```
 



