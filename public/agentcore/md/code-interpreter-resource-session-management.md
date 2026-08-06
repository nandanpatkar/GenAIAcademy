# Resource and session management - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-resource-session-management.html

---

# Resource and session management

The following topics show how the Amazon Bedrock AgentCore Code Interpreter works and how you can create the resources and manage sessions.

###### Topics

  * IAM permissions

  * How it works

  * Creating a Code Interpreter and starting a session

  * [Resource management](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-interpreter-resource-management.html>)

  * [Session management](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-interpreter-session-characteristics.html>)


## IAM permissions

The following IAM policy provides the necessary permissions for using the AgentCore Code Interpreter:

```json
{
"Version":"2012-10-17",
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
                "bedrock-agentcore:GetCodeInterpreter",
                "bedrock-agentcore:GetCodeInterpreterSession",
                "bedrock-agentcore:ListCodeInterpreterSessions"
            ],
            "Resource": "arn:aws:bedrock-agentcore:us-east-1:111122223333:code-interpreter/*"
        }
    ]
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
## How it works

  1. **Create a Code Interpreter**

Build your own Code Interpreter or use the System Code Interpreter to enable capabilities such as writing and running code or performing complex calculations. The Code Interpreter allows you to augment your agent runtime to securely execute code in a fully managed environment with low latency.

  2. **Integrate it within an agent to invoke**

Copy the built-in tool resource ID into your runtime agent code to invoke it as part of your session. For Code Interpreter tools, you can execute code and view the results in real-time.

  3. **Assess performance using observability**

Monitor key metrics for each tool in CloudWatch to get real-time performance insights.


## Creating a Code Interpreter and starting a session

  1. **Create a Code Interpreter**

When configuring a Code Interpreter, you can choose network settings (Sandbox or Public), and the execution role role that defines what AWS resources the Code Interpreter can access.

  2. **Start a session**

The Code Interpreter uses a session-based model. After creating a Code Interpreter, you start a session with a configurable timeout period (default is 15 minutes). Sessions automatically terminate after the timeout period. Multiple sessions can be active simultaneously for a single Code Interpreter, with each session maintaining its own state and environment.

  3. **Execute code**

Within an active session, you can execute code in supported languages (Python, JavaScript, TypeScript), and maintain state between executions. You can also perform file upload/download operations, and use the support provided for the shell commands and AWS CLI commands.

  4. **Stop session and clean up**

When you’re finished using a session, you should stop it to release resources and avoid unnecessary charges. You can also delete the Code Interpreter if you no longer intend to use it.



