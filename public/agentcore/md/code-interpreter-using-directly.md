# Using AgentCore Code Interpreter directly - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-using-directly.html

---

# Using AgentCore Code Interpreter directly

The following sections show you how to use the Amazon Bedrock AgentCore Code Interpreter directly without an agent framework. This is especially useful when you want to execute specific code snippets programmatically. Before you go through the examples in this section, see [Prerequisites](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-interpreter-getting-started.html#code-interpreter-prerequisites>).

###### Topics

  * Step 1: Choose your approach and install dependencies

  * Step 2: Execute code


## Step 1: Choose your approach and install dependencies

Amazon Bedrock AgentCore provides two ways to interact with AgentCore Code Interpreter: using the high-level SDK client or using boto3 directly.

  * **SDK Client** : The `bedrock_agentcore` SDK provides a simplified interface that handles session management details. Use this approach for most applications.

  * **Boto3 Client** : The AWS SDK gives you direct access to the AgentCore Code Interpreter API operations. Use this approach when you need fine-grained control over session configuration or want to integrate with existing boto3-based applications.


Create a project folder (if you didn’t create one before) and install the required packages:

```bash
mkdir agentcore-tools-quickstart
cd agentcore-tools-quickstart
python3 -m venv .venv
source .venv/bin/activate
```
On Windows, use: `.venv\Scripts\activate`

Install the required packages:

```bash
pip install bedrock-agentcore boto3
```
These packages provide:

  * `bedrock-agentcore` : The SDK for Amazon Bedrock AgentCore tools including AgentCore Code Interpreter

  * `boto3` : AWS SDK for Python (Boto3) to create, configure, and manage AWS services


## Step 2: Execute code

Choose one of the following approaches to execute code with AgentCore Code Interpreter:

###### Note

Replace `<Region>` with your actual AWS Region (for example, `us-east-1` or `us-west-2` ).

###### Example

SDK Client
    

  1. Create a file named `direct_code_execution_sdk.py` and add the following code:

```python
from bedrock_agentcore.tools.code_interpreter_client import CodeInterpreter
import json

# Initialize the Code Interpreter client for your region
code_client = CodeInterpreter('<Region>')

# Start a Code Interpreter session
code_client.start()

try:
    # Execute Python code
    response = code_client.invoke("executeCode", {
        "language": "python",
        "code": 'print("Hello World!!!")'
    })

    # Process and print the response
    for event in response["stream"]:
        print(json.dumps(event["result"], indent=2))

finally:
    # Always clean up the session
    code_client.stop()
```
This code:

     * Creates a AgentCore Code Interpreter client for your region

     * Starts a session (required before executing code)

     * Executes Python code and streams the results with full event details

     * Stops the session to clean up resources

**Run the script**

Execute the following command:

```text
python direct_code_execution_sdk.py
```
**Expected output**

You should see a JSON response containing the execution result with `Hello World!!!` in the output content.


Boto3
    

  1. Create a file named `direct_code_execution_boto3.py` and add the following code:

```python
import boto3
import json

# Code to execute
code_to_execute = """
print("Hello World!!!")
"""

# Initialize the bedrock-agentcore client
client = boto3.client(
    "bedrock-agentcore",
    region_name="<Region>"
)

# Start a Code Interpreter session
session_response = client.start_code_interpreter_session(
    codeInterpreterIdentifier="aws.codeinterpreter.v1",
    name="my-code-session",
    sessionTimeoutSeconds=900
)
session_id = session_response["sessionId"]

print(f"Started session: {session_id}\n\n")

try:
    # Execute code in the session
    execute_response = client.invoke_code_interpreter(
        codeInterpreterIdentifier="aws.codeinterpreter.v1",
        sessionId=session_id,
        name="executeCode",
        arguments={
            "language": "python",
            "code": code_to_execute
        }
    )

    # Extract and print the text output from the stream
    for event in execute_response['stream']:
        if 'result' in event:
            result = event['result']
            if 'content' in result:
                for content_item in result['content']:
                    if content_item['type'] == 'text':
                        print(content_item['text'])

finally:
    # Stop the session when done
    client.stop_code_interpreter_session(
        codeInterpreterIdentifier="aws.codeinterpreter.v1",
        sessionId=session_id
    )
    print(f"\n\nStopped session: {session_id}")
```
This code:

     * Creates a boto3 client for the bedrock-agentcore service

     * Starts a AgentCore Code Interpreter session with a 900-second timeout

     * Executes Python code using the session ID

     * Parses the streaming response to extract text output

     * Properly stops the session to release resources

The boto3 approach requires explicit session management. You must call `start_code_interpreter_session` before executing code and `stop_code_interpreter_session` when finished.

**Run the script**

Execute the following command:

```text
python direct_code_execution_boto3.py
```
**Expected output**

You should see `Hello World!!!` printed as the result of the code execution, along with the session ID information.



