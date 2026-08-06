# Basic Browser tool usage with Amazon Nova Act SDK

## Overview

In this tutorial we will learn how to use Nova Act SDK to use with Amazon Bedrock Agentcore Browser tool. We will provide examples of using the browser tool headless and view the browser live.


### Tutorial Details


| Information         | Details                                                                          |
|:--------------------|:---------------------------------------------------------------------------------|
| Tutorial type       | Conversational                                                                   |
| Agent type          | Single                                                                           |
| Agentic Framework   | Nova Act                                                                         |
| LLM model           | Amazon Nova Act model                                                            |
| Tutorial components | Using NovaAct to interact with browser tool in a headless way                    |
| Tutorial vertical   | vertical                                                                         |
| Example complexity  | Easy                                                                             |
| SDK used            | Amazon BedrockAgentCore Python SDK, Nova Act                                     |

### Tutorial Architecture

In this tutorial we will describe how to use Nova Act with browser tool.  

In our example we will send natural language instructions to the Nova Act agent to perform tasks on the Bedrock Agentcore browser in a headless way.

### Tutorial Key Features

* Using browser tool in a headless way
* Using Nova Act with browser tool

## Prerequisites

To execute this tutorial you will need:
* Python 3.10+
* AWS credentials. Your IAM role/user should have these permissions https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-onboarding.html#browser-credentials-config
* Amazon Bedrock AgentCore SDK
* Nova Act SDK and API key

```python
!pip install --force-reinstall -U -r requirements.txt --quiet
```

## Using NovaAct with Bedrock Agentcore Browser tool
We will create a python script that can be run locally. In the script, Nova Act will use the browser session's CDP endpoint to connect to it and perform playwright actuations.

```python
%%writefile basic_browser_with_nova_act.py
"""Browser automation script using Amazon Bedrock AgentCore and Nova Act.

This script demonstrates AI-powered web automation by:
- Initializing a browser session through Amazon Bedrock AgentCore
- Connecting to Nova Act for natural language web interactions
- Performing automated searches and data extraction using browser
"""

from bedrock_agentcore.tools.browser_client import browser_session
from nova_act import NovaAct
from rich.console import Console
import argparse
import json

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
                preview={"playwright_actuation": True},
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

#### Running the script
Paste your Nova Act API key below before running the script.

```python
NOVA_ACT_KEY = ""  ### Paste your Nova Act Key here
```

```python
!python basic_browser_with_nova_act.py --prompt "Search for macbooks and extract the details of the first one" --starting-page "https://www.amazon.com/" --nova-act-key {NOVA_ACT_KEY}
```

```python
!python basic_browser_with_nova_act.py --prompt "Extract and return Amazon revenue for the last 4 years" --starting-page "https://stockanalysis.com/stocks/amzn/financials/" --nova-act-key {NOVA_ACT_KEY}
```

## What happened behind the scenes?

* When you used `browser_session` to instantiate a browser client, it created a Browser client and started a session
* Then you configured Nova Act to point to that browser session using the `cdp_endpoint_url` and `cdp_headers` 
* Nova ACT SDK now took your natural language instructions and created Playwright actuations on the browser.

# Congratulations!
