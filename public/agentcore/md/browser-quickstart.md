# Get started with AgentCore Browser - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-quickstart.html

---

# Get started with AgentCore Browser

AgentCore Browser enables your agents to interact with web pages through a managed Chrome browser. In this guide, you’ll create an AI agent that navigates a website and extracts information — in under 5 minutes.

###### Topics

  * Prerequisites

  * Step 1: Install dependencies

  * Step 2: Create your agent

  * Step 3: Run the agent

  * Step 4: View the browser session live

  * Find your resources

  * Next steps

  * [Using AgentCore Browser with Nova Act](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-quickstart-nova-act.html>)

  * [Using AgentCore Browser with Playwright](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-quickstart-playwright.html>)


## Prerequisites

Before you start, ensure you have:

  * Python 3.10 or newer ( [python.org/downloads](<https://www.python.org/downloads/>) )

  * Boto3 installed ( [Boto3 documentation](<https://boto3.amazonaws.com/v1/documentation/api/latest/guide/quickstart.html>) )

  * AWS credentials configured — verify with:

```bash
aws sts get-caller-identity
```
If this command fails, see [Configuration and credential file settings](<https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html>) in the AWS CLI documentation.

  * Anthropic Claude Sonnet 4.0 model access [enabled](<https://docs.aws.amazon.com/bedrock/latest/userguide/model-access-modify.html>) in the Amazon Bedrock console

  * AWS Region where Amazon Bedrock AgentCore is available (see [Supported AWS Regions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./agentcore-regions.html>) )


**IAM permissions**

Attach this policy to your IAM identity. In the IAM Console, find your user or role, choose **Add permissions** > **Create inline policy** , switch to JSON view, and paste:

```json
{
"Version":"2012-10-17",
    "Statement": [
        {
            "Sid": "BedrockAgentCoreBrowserFullAccess",
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
            "Resource": "arn:aws:bedrock-agentcore:<Region>:++<account_id>++:browser/*"
        },
        {
            "Sid": "BedrockModelAccess",
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel",
                "bedrock:InvokeModelWithResponseStream"
            ],
            "Resource": [
                "*"
            ]
        }
    ]
}
```
###### Note

Replace `<Region>` with your actual AWS Region and `<account_id>` with your AWS account ID.

## Step 1: Install dependencies

```bash
pip install bedrock-agentcore strands-agents strands-agents-tools playwright nest-asyncio
```
## Step 2: Create your agent

Create a file named `browser_agent.py` :

###### Note

Replace `<Region>` with your AWS Region (for example, `us-west-2` ).

```python
from strands import Agent
from strands_tools.browser import AgentCoreBrowser

# Initialize the Browser tool
browser_tool = AgentCoreBrowser(region="<Region>")

# Create an agent with the Browser tool
agent = Agent(tools=[browser_tool.browser])

# Test the agent with a web search prompt
prompt = "what are the services offered by Bedrock AgentCore? Use the documentation link if needed: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html"
print(f"\n\nPrompt: {prompt}\n\n")

response = agent(prompt)
print("\n\nAgent Response:")
print(response.message["content"][0]["text"])
```
## Step 3: Run the agent

```text
python browser_agent.py
```
You should see the agent navigate the website and return details about AgentCore services. If you encounter errors, verify your IAM permissions, model access, and AWS credentials.

## Step 4: View the browser session live

While your agent is running, you can watch it in real-time through the AWS Console:

  1. Open the [AgentCore Browser Console](<https://us-west-2.console.aws.amazon.com/bedrock-agentcore/builtInTools>)

  2. Navigate to **Built-in tools** in the left navigation

  3. Select the Browser tool (for example, `AgentCore Browser Tool` , or your custom browser)

  4. In the **Browser sessions** section, find your active session with status **Ready**

  5. In the **Live view / recording** column, click the provided "View live session" URL


The live view provides a real-time video stream with interactive controls to take over or release control from automation.

## Find your resources

After using AgentCore Browser, view your resources in the AWS Console:

# | Resource | Location  
---|---|---  
1 |  Live View |  Browser Console > Tool Name > **View live session**  
2 |  Session Recordings and Replay |  Browser Console > Tool Name > **View recording**  
3 |  Browser Logs |  **CloudWatch** > **Log groups** > `/aws/bedrock-agentcore/browser/`  
4 |  Recording Files |  **S3** > Your bucket > `browser-recordings/` prefix  
5 |  Custom Browsers |  **AgentCore Console** > **Built-in tools** > Your custom browser  
6 |  IAM Roles |  **IAM** > **Roles** > Search for your execution role  
  
## Next steps

Now that you have AgentCore Browser working, explore these advanced features:

  * [Session Recording and Replay](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-session-recording.html>) \- Record and replay sessions for debugging

  * [Using AgentCore Browser with Nova Act](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-quickstart-nova-act.html>) and [Using AgentCore Browser with Playwright](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-quickstart-playwright.html>) \- Use other frameworks like Nova Act or Playwright

  * [Fundamentals](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-resource-session-management.html>) \- Learn about API operations and custom browsers



