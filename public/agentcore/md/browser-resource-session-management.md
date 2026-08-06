# Fundamentals - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-resource-session-management.html

---

# Fundamentals

The following topics show how the Amazon Bedrock AgentCore Browser works and how you can create the resources and manage sessions.

###### Topics

  * Creating a Browser Tool and starting a session

  * Resource management

  * [Using Browser Tool](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-using-tool.html>)

  * [Managing Browser Sessions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-managing-sessions.html>)


## Creating a Browser Tool and starting a session

  1. **Create a Browser Tool**

When configuring a Browser Tool, choose the public network setting, recording configuration for session replay, and permissions through an IAM runtime role that defines what AWS resources the Browser Tool can access.

  2. **Start a session**

The Browser Tool uses a session-based model. After creating a Browser Tool, you start a session with a configurable timeout period (default is 15 minutes). Sessions automatically terminate after the timeout period. Multiple sessions can be active simultaneously for a single Browser Tool, with each session maintaining its own state and environment.

  3. **Interact with the browser**

Once a session is started, you can interact with the browser using WebSocket-based streaming APIs. The Automation endpoint enables your agent to perform browser actions such as navigating to websites, clicking elements, filling out forms, taking screenshots, and more. Libraries like browser-use or Playwright can be used to simplify these interactions.

Meanwhile, the Live View endpoint allows an end user to watch the browser session in real time and interact with it directly through the live stream.

  4. **Stop the session**

When you’re finished using the browser session, you should stop it to release resources and avoid unnecessary charges. Sessions can be stopped manually or will automatically terminate after the configured timeout period.


### Permissions

To use the Amazon Bedrock AgentCore Browser, you need the following permissions in your IAM policy:

```json
{
"Version":"2012-10-17",
    "Statement": [
        {
            "Sid": "BedrockAgentCoreInBuiltToolsFullAccess",
            "Effect": "Allow",
            "Action": [
                "bedrock-agentcore:CreateBrowser",
                "bedrock-agentcore:ListBrowsers",
                "bedrock-agentcore:GetBrowser",
                "bedrock-agentcore:DeleteBrowser",
                "bedrock-agentcore:StartBrowserSession",
                "bedrock-agentcore:ListBrowserSessions",
                "bedrock-agentcore:GetBrowserSession",
                "bedrock-agentcore:StopBrowserSession",
                "bedrock-agentcore:UpdateBrowserStream",
                "bedrock-agentcore:ConnectBrowserAutomationStream",
                "bedrock-agentcore:ConnectBrowserLiveViewStream"
            ],
            "Resource": "arn:aws:bedrock-agentcore:us-east-1:111122223333:browser/*"
        }
    ]
}
```
If you’re using session recording with S3, the execution role you provide when creating a browser needs the following permissions:

```json
{
    "Sid": "BedrockAgentCoreBuiltInToolsS3Policy",
    "Effect": "Allow",
    "Action": [
        "s3:PutObject",
        "s3:ListMultipartUploadParts",
        "s3:AbortMultipartUpload"
    ],
    "Resource": "arn:aws:s3:::example-s3-bucket/example-prefix/*",
    "Condition": {
        "StringEquals": {
            "aws:ResourceAccount": "{{accountId}}"
        }
    }
}
```
You should also add the following trust policy to the execution role:

```json
{
"Version":"2012-10-17",
    "Statement": [{
        "Sid": "BedrockAgentCoreBuiltInTools",
        "Effect": "Allow",
        "Principal": {
            "Service": "bedrock-agentcore.amazonaws.com"
        },
        "Action": "sts:AssumeRole",
        "Condition": {
            "StringEquals": {
                "aws:SourceAccount": "111122223333"
            },
            "ArnLike": {
                "aws:SourceArn": "arn:aws:bedrock-agentcore:us-east-1:111122223333:*"
            }
        }
    }]
}
```
### Browser setup for API operations

Run the following commands to set up your Browser Tool that is common to all control plane and data plane API operations.

```python
import boto3
import uuid

REGION = "<Region>"
CP_ENDPOINT_URL = f"https://bedrock-agentcore-control.{REGION}.amazonaws.com"
DP_ENDPOINT_URL = f"https://bedrock-agentcore.{REGION}.amazonaws.com"

cp_client = boto3.client(
    'bedrock-agentcore-control',
    region_name=REGION,
    endpoint_url=CP_ENDPOINT_URL
)

dp_client = boto3.client(
    'bedrock-agentcore',
    region_name=REGION,
    endpoint_url=DP_ENDPOINT_URL
)
```
## Resource management

The AgentCore Browser provides two types of resources:

System ARNs
    

System ARNs are default resources pre-created for ease of use. These ARNs have default configuration with the most restrictive options and are available for all regions where Amazon Bedrock AgentCore is available.

Field | Value  
---|---  
ID |  aws.browser.v1  
ARN |  arn:aws:bedrock-agentcore:us-east-1:aws:browser/aws.browser.v1  
Name |  Amazon Bedrock AgentCore Browser Tool  
Description |  AWS built-in browser for secure web browsing  
Status |  READY  
  
Custom ARNs
    

Custom ARNs allow you to configure a browser tool with your own settings. You can choose the public network setting, recording configuration, security settings, and permissions through an IAM runtime role that defines what AWS resources the browser tool can access.

### Network settings

The AgentCore Browser supports the public network mode. This mode allows the tool to access public internet resources. This option enables integration with external APIs and services.

### Session management

The AgentCore Browser sessions have the following characteristics:

Session timeout
    

Default: 900 seconds (15 minutes)

Configurable: Can be adjusted when creating sessions, up to 8 hours

Session recording
    

Browser sessions can be recorded for later review

Recordings include network traffic and console logs

Recordings are stored in an S3 bucket specified during browser creation

Live view
    

Sessions can be viewed in real-time using the live view feature

Live view is available at: /browser-streams/aws.browser.v1/sessions/ { session_id}/live-view

Automatic termination
    

Sessions automatically terminate after the configured timeout period

Multiple sessions
    

Multiple sessions can be active simultaneously for a single browser tool. Each session maintains its own state and environment. There can be up to a maximum of 500 sessions.

Retention policy
    

The time to live (TTL) retention policy for the session data is 30 days.

#### Using isolated sessions

AgentCore Tools enable isolation of each user session to ensure secure and consistent reuse of context across multiple tool invocations. Session isolation is especially important for AI agent workloads due to their dynamic and multi-step execution patterns.

Each tool session runs in a dedicated microVM with isolated CPU, memory, and filesystem resources. This architecture guarantees that one user’s tool invocation cannot access data from another user’s session. Upon session completion, the microVM is fully terminated, and its memory is sanitized, thereby eliminating any risk of cross-session data leakage.

