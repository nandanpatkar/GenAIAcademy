# Using AgentCore Browser with Nova Act - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-quickstart-nova-act.html

---

# Using AgentCore Browser with Nova Act

You can build a browser agent using Nova Act to automate web interactions:

**Step 1: Install dependencies**

Create a project folder (if you have not already):

```bash
mkdir agentcore-browser-quickstart
cd agentcore-browser-quickstart
python3 -m venv .venv
source .venv/bin/activate
```
###### Note

On Windows, use: `.venv\Scripts\activate`

Install the required packages:

```bash
pip install bedrock-agentcore nova-act rich boto3
```
These packages provide:

  * `bedrock-agentcore` : The SDK for Amazon Bedrock AgentCore tools including AgentCore Browser

  * `nova-act` : The SDK for Nova Act which includes the model and orchestrator for browser automation

  * `rich` : Library for rich text and beautiful formatting in the terminal

  * `boto3` : AWS SDK for Python (Boto3) to create, configure, and manage AWS services


**Step 2: Get Nova Act API Key**

Navigate to [Nova Act](<https://nova.amazon.com/act>) page and generate an API key using your amazon.com credentials. (Note this currently works only for US based amazon.com accounts)

Create a file named `nova_act_browser_agent.py` and add the following code:

**Write a browser agent using Nova Act**

The following Python code shows how to write a browser agent using Nova Act. For information about obtaining the API key for Nova Act, see [Amazon Nova Act documentation](<https://nova.amazon.com/act>).

```python
from bedrock_agentcore.tools.browser_client import browser_session
from nova_act import NovaAct
from rich.console import Console
import argparse
import json
import boto3

console = Console()

from boto3.session import Session

boto_session = Session()
region = boto_session.region_name
print("using region", region)

def browser_with_nova_act(prompt, starting_page, nova_act_key, region="us-west-2"):
    result = None
    with browser_session(region) as client:
        ws_url, headers = client.generate_ws_headers()
        try:
            with NovaAct(
                cdp_endpoint_url=ws_url,
                cdp_headers=headers,
                nova_act_api_key=nova_act_key,
                starting_page=starting_page,
            ) as nova_act:
                result = nova_act.act(prompt)
        except Exception as e:
            console.print(f"NovaAct error: {e}")
        finally:
            return result

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--prompt", required=True, help="Browser Search instruction")
    parser.add_argument("--starting-page", required=True, help="Starting URL")
    parser.add_argument("--nova-act-key", required=True, help="Nova Act API key")
    parser.add_argument("--region", default="us-west-2", help="AWS region")
    args = parser.parse_args()

    result = browser_with_nova_act(
        args.prompt, args.starting_page, args.nova_act_key, args.region
    )
    console.print(f"\n[cyan] Response[/cyan] {result.response}")
    console.print(f"\n[bold green]Nova Act Result:[/bold green] {result}")
```
**Step 3: Run the agent**

Execute the script (Replace with your Nova Act API key in the command):

```text
python nova_act_browser_agent.py --prompt "What are the common usecases of Bedrock AgentCore?" --starting-page "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html" --nova-act-key "your-nova-act-API-key"
```
**Expected output**

You should see the agent’s response containing details of the common usecases of Amazon Bedrock AgentCore. The agent navigates the website, performs the search, and extracts the requested information.

If you encounter errors, verify:

  * Your IAM role/user has the correct permissions

  * Your Nova Act API key is correct

  * Your AWS credentials are properly configured


**Step 4: View the browser session live**

While your browser script is running, you can view the session in real-time through the AWS Console:

  1. Open the [Amazon Bedrock AgentCore Browser Console](<https://us-west-2.console.aws.amazon.com/bedrock-agentcore/builtInTools>)

  2. Navigate to **Built-in tools** in the left navigation

  3. Select the Browser tool (for example, `AgentCore Browser Tool` , or your custom browser)

  4. In the **Browser sessions** section, find your active session with status **Ready**

  5. In the **Live view / recording** column, click the provided "View live session" URL

  6. The live view opens in a new browser window, displaying the real-time browser session


The live view interface provides:

  * Real-time video stream of the browser session

  * Interactive controls to take over or release control from automation

  * Ability to terminate the session



