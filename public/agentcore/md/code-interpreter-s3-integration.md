# Using Terminal Commands with an execution role - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-s3-integration.html

---

# Using Terminal Commands with an execution role

You can create a custom Code Interpreter tool with an execution role to upload/download files from Amazon S3. This allows your code to interact with S3 buckets for storing and retrieving data.

## Prerequisites

Before creating a custom Code Interpreter with S3 access, you need to:

  1. Create an S3 bucket (e.g., `DOC-EXAMPLE-BUCKET` )

  2. Create a folder within the bucket (e.g., `output_artifacts` )

  3. Create an IAM role with the following trust policy:

```json
{
"Version":"2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "bedrock-agentcore.amazonaws.com"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "aws:SourceAccount": "111122223333"
        }
      }
    }
  ]
}
```
  4. Add the following permissions to the role:

```json
{
"Version":"2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::DOC-EXAMPLE-BUCKET/*",
      "Condition": {
          "StringEquals": {
              "s3:ResourceAccount": "${aws:PrincipalAccount}"
          }
      }
    }
  ]
}
```
## Sample Python code

You can implement S3 integration using boto3 (AWS SDK for Python). The following example uses boto3 to create a custom Code Interpreter with an execution role that can upload files to or download files from Amazon S3.

###### Note

Before running this code, make sure to replace `REGION` and `<awsaccountid>` with your AWS Region and AWS account number.

```python
import boto3
import json
import time

REGION = "<Region>"
CP_ENDPOINT_URL = f"https://bedrock-agentcore-control.{REGION}.amazonaws.com"
DP_ENDPOINT_URL = f"https://bedrock-agentcore.{REGION}.amazonaws.com"

# Update the accountId to reflect the correct S3 path.
S3_BUCKET_NAME = "DOC-EXAMPLE-BUCKET"

bedrock_agentcore_control_client = boto3.client(
    'bedrock-agentcore-control',
    region_name=REGION,
    endpoint_url=CP_ENDPOINT_URL
)
bedrock_agentcore_client = boto3.client(
    'bedrock-agentcore',
    region_name=REGION,
    endpoint_url=DP_ENDPOINT_URL
)

unique_name = f"s3InteractionEnv_{int(time.time())}"
create_response = bedrock_agentcore_control_client.create_code_interpreter(
    name=unique_name,
    description="Combined test code sandbox",
    executionRoleArn="arn:aws:iam::123456789012:role/S3InteractionRole",
    networkConfiguration={
        "networkMode": "SANDBOX"
    }
)
code_interpreter_id = create_response['codeInterpreterId']
print(f"Created custom interpreter ID: {code_interpreter_id}")

session_response = bedrock_agentcore_client.start_code_interpreter_session(
    codeInterpreterIdentifier=code_interpreter_id,
    name="combined-test-session",
    sessionTimeoutSeconds=1800
)
session_id = session_response['sessionId']
print(f"Created session ID: {session_id}")

print(f"Downloading CSV generation script from S3")
command_to_execute = f"aws s3 cp s3://{S3_BUCKET_NAME}/generate_csv.py ."
response = bedrock_agentcore_client.invoke_code_interpreter(
    codeInterpreterIdentifier=code_interpreter_id,
    sessionId=session_id,
    name="executeCommand",
    arguments={
        "command": command_to_execute
    }
)

for event in response["stream"]:
    print(json.dumps(event["result"], default=str, indent=2))

print(f"Executing the CSV generation script")
response = bedrock_agentcore_client.invoke_code_interpreter(
    codeInterpreterIdentifier=code_interpreter_id,
    sessionId=session_id,
    name="executeCommand",
    arguments={
        "command": "python generate_csv.py 5 10"
    }
)

for event in response["stream"]:
    print(json.dumps(event["result"], default=str, indent=2))

print(f"Uploading generated artifact to S3")
command_to_execute = f"aws s3 cp generated_data.csv s3://{S3_BUCKET_NAME}/output_artifacts/"
response = bedrock_agentcore_client.invoke_code_interpreter(
    codeInterpreterIdentifier=code_interpreter_id,
    sessionId=session_id,
    name="executeCommand",
    arguments={
        "command": command_to_execute
    }
)

for event in response["stream"]:
    print(json.dumps(event["result"], default=str, indent=2))

print(f"Stopping the code interpreter session")
stop_response = bedrock_agentcore_client.stop_code_interpreter_session(
    codeInterpreterIdentifier=code_interpreter_id,
    sessionId=session_id
)

print(f"Deleting the code interpreter")
delete_response = bedrock_agentcore_control_client.delete_code_interpreter(
    codeInterpreterId=code_interpreter_id
)
print(f"Code interpreter status from response: {delete_response['status']}")
print(f"Clean up completed, script run successful")
```
This example shows you how to:

  * Create a custom Code Interpreter with an execution role

  * Configure network access - Choose PUBLIC mode if your Code Interpreter needs to connect to the public internet. If your Code Interpreter needs access limited to Amazon S3, choose SANDBOX mode.

  * Upload and download files between the Code Interpreter environment and S3

  * Execute commands and scripts within the Code Interpreter environment

  * Clean up resources when finished



