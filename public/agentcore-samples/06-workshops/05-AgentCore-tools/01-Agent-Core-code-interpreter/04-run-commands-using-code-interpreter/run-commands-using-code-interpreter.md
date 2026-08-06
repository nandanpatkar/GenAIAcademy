# Running Commands on Amazon Bedrock AgentCore Code Interpreter - Tutorial

This tutorial demonstrates how to use Amazon Bedrock AgentCore Code Interpreter to run commands (shell and AWS CLI). We will interact with AWS services, specifically focusing on S3 operations. We'll walk through:

1. Creating a code interpreter
2. Start code interpreter session
3. Run Commands(shell and AWS CLI)
5. Performing S3 operations(create bucket, copy objects, list bucket objects)
6. Cleanup (stop session and delete code interpreter)



## Prerequisites
- AWS account with Bedrock AgentCore Code Interpreter access
- You have the necessary IAM permissions to create and manage code interpreter resources
- YOu have the necessary IAM permissions to perform s3 operations
- Required Python packages installed(including boto3 & bedrock-agentcore)


## Your IAM execution role should have the following IAM policy attached

~~~ {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock-agentcore:CreateCodeInterpreter",
                "bedrock-agentcore:StartCodeInterpreterSession",
                "bedrock-agentcore:InvokeCodeInterpreter",
                "bedrock-agentcore:StopCodeInterpreterSession",
                "bedrock-agentcore:DeleteCodeInterpreter",
                "bedrock-agentcore:ListCodeInterpreters",
                "bedrock-agentcore:GetCodeInterpreter"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:*:*:log-group:/aws/bedrock-agentcore/code-interpreter*"
        }
    ]
}

#### The IAM execution role should also have the following trust policy attached. By including bedrock-agentcore.amazonaws.com in the trust policy, you're allowing the Bedrock Agent service itself to assume this IAM role and perform actions on your behalf(such as Amazon S3)

```{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::<account_id>:root",
                "Service": [
                    "bedrock-agentcore.amazonaws.com"
                ]
            },
            "Action": "sts:AssumeRole",
            "Condition": {}
        }
    ]
}

Additionally, you need to attach the AmazonS3FullAccess IAM policy to the IAM Execution role to perform the s3 operations described in this tutorial

## How it works

The code execution sandbox enables agents to safely process user queries by creating an isolated environment with a code interpreter, shell, and file system. After a Large Language Model helps with tool selection, code is executed within this session, before being returned to the user or Agent for synthesis.

![architecture local](code-interpreter.png)

## 1. Setting Up the Environment

First, let's import the necessary libraries

```python
!pip install --upgrade -r requirements.txt
```

```python
import json
import boto3
from bedrock_agentcore._utils import endpoints
import time
from typing import Dict, Any
```

## 2. Configuration Variables

Set up the necessary configuration variables for code interpreter and S3 operations. We also provide an IAM execution role to pass to the code interpreter,so that it can assume it to access other AWS resources. This role needs S3 permissions, as discussed above

```python
# Configuration setup
execution_role_arn = "<execution-role-arn>"
unique_bucket_name = f"amzn-bucket-{int(time.time())}"
s3_path = f"s3://{unique_bucket_name}"

region = "us-west-2"

# local file that we will upload to Code interpreter and then to an S3 bucket
local_file = "samples/stats.py"
```

## 3. Setting up endpoints

We need to configure both data plane and control plane endpoints to create the boto3 clients.

```python
# Configure endpoints
data_plane_endpoint = endpoints.get_data_plane_endpoint(region)
control_plane_endpoint = endpoints.get_control_plane_endpoint(region)
```

## 4. Creating AWS Clients

Initialize boto3 clients for both control plane and data plane operations.

```python
# Create boto3 clients
cp_client = boto3.client("bedrock-agentcore-control", region_name=region, endpoint_url=control_plane_endpoint)

dp_client = boto3.client("bedrock-agentcore", region_name=region, endpoint_url=data_plane_endpoint)
```

## 5. Creating a Code Interpreter

Create a code interpreter instance with specific configuration parameters.

When configuring a code interpreter, you can choose network settings (Sandbox, Public, or VPC), dependencies configuration, security settings, and permissions through an IAM runtime role that defines what AWS resources the code interpreter can access.

```python
# Create code interpreter
unique_name = f"s3InteractionEnv_{int(time.time())}"
interpreter_response = cp_client.create_code_interpreter(
    name=unique_name,
    description="Environment for S3 file operations",
    executionRoleArn=execution_role_arn,
    networkConfiguration={"networkMode": "PUBLIC"},
)
interpreter_id = interpreter_response["codeInterpreterId"]
print(f"Created interpreter: {interpreter_id}")
```

## 6. Starting a Session

Create a session within the code interpreter to execute code.

```python
# Start session
session_response = dp_client.start_code_interpreter_session(
    codeInterpreterIdentifier=interpreter_id,
    name="s3InteractionSession",
    sessionTimeoutSeconds=900,
)
session_id = session_response["sessionId"]
print(f"Created session: {session_id}")
```

## 7. Helper Function for Tool Execution

Define a utility function to simplify code interpreter tool invocation

```python
def call_tool(tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
    response = dp_client.invoke_code_interpreter(
        codeInterpreterIdentifier=interpreter_id,
        sessionId=session_id,
        name=tool_name,
        arguments=arguments,
    )
    for event in response["stream"]:
        return json.dumps(event["result"], indent=2)
```

## 8. Test Code Execution

### 8.1 Test the code interpreter with a simple Hello World example.

```python
# Test code execution
# S3 Operations
print("executing shell command \n")
command_response = call_tool("executeCommand", {"command": "echo 'Hello World'"})
print(f"command result: {command_response}")

# Parse and display results
command_results = json.loads(command_response)
print(command_results["structuredContent"]["stdout"])
```

### 8.2 Next, lets install boto3 using PIP in to the sandbox

```python
# Test code execution
# S3 Operations
print("executing shell command \n")
command_response = call_tool("executeCommand", {"command": "pip install boto3"})

# Parse and display results
command_results = json.loads(command_response)
print(command_results["structuredContent"]["stdout"])
```

## 9. File Operations and S3 Interaction by runninng commands

#### 9.1 Write local file to sandbox

```python
# Write file to sandbox
print("Writing file to sandbox")
try:
    with open(local_file, "r", encoding="utf-8") as local_file_content:
        local_file_content = local_file_content.read()
except FileNotFoundError:
    print(f"Error: The file '{local_file}' was not found.")
except Exception as e:
    print(f"An error occurred: {e}")

files_to_create = [{"path": "stats.py", "text": local_file_content}]
write_files_response = call_tool("writeFiles", {"content": files_to_create})
print(f"write files result: {write_files_response}")
```

#### 9.2 Create a S3 Bucket via code interpreter

```python
# S3 Operations
print("\nCreating S3 bucket")
create_s3_response = call_tool("executeCommand", {"command": f"aws s3 mb {s3_path} --region {region}"})
print(f"create result: {create_s3_response}")
```

#### 9.3 Upload file from code interpreter by running command to the S3 Bucket(created above)

```python
print("\nUploading file to S3")
upload_to_s3_response = call_tool("executeCommand", {"command": f"aws s3 cp {files_to_create[0]['path']} {s3_path}"})
print(f"upload result: {upload_to_s3_response}")
```

#### 9.4 List files from the S3 bucket by running a command in the code interpreter

```python
print("\nListing files in S3")
list_s3_response = call_tool("executeCommand", {"command": f"aws s3 ls {s3_path}"})
print(f"list result: {list_s3_response}")
```

## 10. Cleanup

Clean up resources by stopping the session and deleting the interpreter.

```python
# Cleanup
print("Cleaning up session and interpreter")
dp_client.stop_code_interpreter_session(codeInterpreterIdentifier=interpreter_id, sessionId=session_id)
print("Session stopped successfully")

cp_client.delete_code_interpreter(codeInterpreterId=interpreter_id)
print("Interpreter deleted successfully")
```
