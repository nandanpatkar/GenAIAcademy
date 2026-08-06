# Basic Browser tool usage with Browser-Use SDK

## Overview

In this tutorial we will learn how to use the open source Browser-Use SDK with Amazon Bedrock Agentcore Browser tool. We will provide examples of using the browser tool headless and view the browser live.


### Tutorial Details


| Information         | Details                                                                                   |
|:--------------------|:-------------------------------------------------------------------------------------------        
| Tutorial type       | Conversational                                                                            |
| Agent type          | Single                                                                                    |
| Agentic Framework   | Browser-Use                                                                               |
| LLM model           | Anthropic Claude 3.7 Sonnet                                                               |
| Tutorial components | Using Browser-Use SDK to interact with Bedrock Agentcore browser tool in a headless way   |
| Tutorial vertical   | Cross-vertical                                                                            |
| Example complexity  | Easy                                                                                      |
| SDK used            | Amazon BedrockAgentCore Python SDK, Browser-Use                                           |

### Tutorial Architecture

In this tutorial we will describe how to use Browser-Use SDK with Agentcore browser tool.  

In our example we will send natural language instructions to Browser-Use agent to perform tasks on the Bedrock Agentcore browser in a headless way.


### Tutorial Key Features

* Using browser tool in a headless way
* Using Browser-Use with browser tool

## Prerequisites

To execute this tutorial you will need:
* Python 3.11+
* AWS credentials
* Amazon Bedrock AgentCore SDK
* Browser-Use SDK

## How it works

A browser tool sandbox is a secure execution environment that enables AI agents to safely interact with web browsers. When a user makes a request, the Large Language Model (LLM) selects appropriate tools and translates commands. These commands are executed within a controlled sandbox environment containing a headless browser and hosted library server (using tools like Playwright). The sandbox provides isolation and security by containing web interactions within a restricted space, preventing unauthorized system access. The agent receives feedback through screenshots and can perform automated tasks while maintaining system security. 

![architecture local](../images/browser-tool.png)

## 1. Setting Up the Environment

#### Please run the script below to fix the authorization headers issue and make it compatible with Amazon Bedrock AgentCore Browser

### 1.1 Install the Pre-Requisites Libraries

First, let's install libraries required for the browser tool sandbox client.

```python
!pip install --force-reinstall -U -r requirements.txt --quiet
```

### 1.2 Patch Script for browser-use

```python
%%writefile patch_browser_use.py

#!/usr/bin/env python3
"""Auto-detect and patch browser_use session.py"""

import os
import shutil
import sys
from pathlib import Path

def find_browser_use_path():
    """Automatically find the browser_use installation path"""
    try:
        import browser_use
        browser_use_path = Path(browser_use.__file__).parent
        session_file = browser_use_path / "browser" / "session.py"
        return str(session_file)
    except ImportError:
        print("❌ browser_use not installed. Install with: pip install browser-use")
        return None

def patch_browser_use():
    # Auto-detect file path
    file_path = find_browser_use_path()
    if not file_path:
        return False
    
    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        return False
    
    print(f"📁 Found browser_use at: {file_path}")
    
    # Create backup
    backup_path = file_path + ".backup"
    if not os.path.exists(backup_path):
        shutil.copy2(file_path, backup_path)
        print(f"💾 Created backup: {backup_path}")
    else:
        print(f"📋 Backup already exists: {backup_path}")
    
    # Read file
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Replacement 1: Add headers check after cdp_url check
    old1 = "if not cdp_url:\n\t\t\tprofile_kwargs['is_local'] = True"
    new1 = "if not cdp_url:\n\t\t\tprofile_kwargs['is_local'] = True\n\n\t\tif headers:\n\t\t\tprofile_kwargs['headers'] = headers"
    
    if old1 in content and "if headers:\n\t\t\tprofile_kwargs['headers'] = headers" not in content:
        content = content.replace(old1, new1)
        print("✅ Added headers check")
    elif "if headers:\n\t\t\tprofile_kwargs['headers'] = headers" in content:
        print("✅ Headers check already exists")
    else:
        print("⚠️ Headers check pattern not found")
    
    # Replacement 2: Add headers to CDPClient
    old2 = "self._cdp_client_root = CDPClient(self.cdp_url)"
    new2 = "self._cdp_client_root = CDPClient(self.cdp_url,  additional_headers=self.browser_profile.headers)"
    
    if old2 in content:
        content = content.replace(old2, new2)
        print("✅ Added headers to CDPClient")
    elif "additional_headers=self.browser_profile.headers" in content:
        print("✅ CDPClient headers already exists")
    else:
        print("⚠️ CDPClient pattern not found")
    
    # Write back
    with open(file_path, 'w') as f:
        f.write(content)
    
    print("🎉 Patching complete!")
    return True

if __name__ == "__main__":
    success = patch_browser_use()
    sys.exit(0 if success else 1)
```

```python
# Run the python script to apply the patch for browser-use
!python patch_browser_use.py
```

```python
# Restart the Kernal
import IPython

IPython.Application.instance().kernel.do_shutdown(True)
```

### 1.3 Imports

 import the necessary libraries to initialize the browser tool sandbox client.

```python
from bedrock_agentcore.tools.browser_client import BrowserClient
from browser_use.llm import ChatAnthropicBedrock
from browser_use import Agent
from browser_use import Browser, BrowserProfile
from rich.console import Console
from contextlib import suppress
```

```python
console = Console()
```

## 2. Setup the browser client
We will setup the browser client and wait for it to be ready. Then, we will generate web-socket url and headers

```python
from boto3.session import Session

boto_session = Session()
region = boto_session.region_name

client = BrowserClient(region)
client.start()

# Extract ws_url and headers
ws_url, headers = client.generate_ws_headers()
```

## 4. Helper function to run browser task
Run a browser automation task using browser-use Agent

```python
async def run_browser_task(browser_session: Browser, bedrock_chat: ChatAnthropicBedrock, task: str) -> None:
    """
    Run a browser automation task using browser_use

    Args:
        browser_session: Existing browser session to reuse
        bedrock_chat: Bedrock chat model instance
        task: Natural language task for the agent
    """
    try:
        # Show task execution
        console.print(f"\n[bold blue]🤖 Executing task:[/bold blue] {task}")

        # Create and run the agent
        agent = Agent(task=task, llm=bedrock_chat, browser_session=browser_session)

        # Run with progress indicator
        with console.status("[bold green]Running browser automation...[/bold green]", spinner="dots"):
            await agent.run()

        console.print("[bold green]✅ Task completed successfully![/bold green]")

    except Exception as e:
        console.print(f"[bold red]❌ Error during task execution:[/bold red] {str(e)}")
        import traceback

        if console.is_terminal:
            traceback.print_exc()
```

## 5. Invoke the browser task using Browser-use profile
Create a persistent browser session using CDP WebSocket connection and initialize Bedrock Claude model for automated web tasks. Handle session lifecycle with proper cleanup and execute browser automation tasks via AI-driven commands.

```python
# Create persistent browser session and model
browser_session = None
bedrock_chat = None

try:
    # Create browser profile with headers and timeout
    browser_profile = BrowserProfile(
        headers=headers,
        timeout=1500000,  # 150 seconds timeout
    )

    # Create a browser session with CDP URL and keep_alive=True for persistence
    browser_session = Browser(cdp_url=ws_url, browser_profile=browser_profile, keep_alive=True)

    # Initialize the browser session
    console.print("[cyan]🔄 Initializing browser session...[/cyan]")
    await browser_session.start()

    # Create ChatBedrockConverse once
    bedrock_chat = ChatAnthropicBedrock(model="global.anthropic.claude-haiku-4-5-20251001-v1:0", aws_region="us-west-2")

    console.print("[green]✅ Browser session initialized and ready for tasks[/green]\n")

    task = "Search for a coffee maker on amazon.com and extract details of the first one"  ## Modify the task to run other tasks

    await run_browser_task(browser_session, bedrock_chat, task)

finally:
    # Close the browser session
    if browser_session:
        console.print("\n[yellow]🔌 Closing browser session...[/yellow]")
        with suppress(Exception):
            await browser_session.close()
        console.print("[green]✅ Browser session closed[/green]")
```

## 6. Cleanup
Stop the browser session if it hasn't been

```python
client.stop()
print("Browser session stopped successfully!")
```
