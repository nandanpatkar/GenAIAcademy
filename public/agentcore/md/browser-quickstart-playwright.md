# Using AgentCore Browser with Playwright - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-quickstart-playwright.html

---

# Using AgentCore Browser with Playwright

You can use the Playwright automation framework with the Browser Tool:

**Step 1: Install dependencies**

Create a project folder (if you didn’t create one before) and install the required packages:

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
pip install bedrock-agentcore playwright boto3 nest-asyncio
```
These packages provide:

  * `bedrock-agentcore` : The SDK for Amazon Bedrock AgentCore tools including AgentCore Browser

  * `playwright` : Python library for browser automation

  * `boto3` : AWS SDK for Python (Boto3) to create, configure, and manage AWS services

  * `nest-asyncio` : Allows running asyncio event loops within existing event loops


**Step 2: Control browser with Playwright**

You can use Browser directly without an agent framework or an LLM. This is useful when you want programmatic control over browser automation. Amazon Bedrock AgentCore provides integration with Playwright for browser automation.

**Async Playwright example**

Create a file named `direct_browser_playwright.py` and add the following code:

```python
from playwright.async_api import async_playwright, Playwright, BrowserType
from bedrock_agentcore.tools.browser_client import browser_session
import asyncio

async def run(playwright: Playwright):
    # Create and maintain a browser session
    with browser_session('us-west-2') as client:
        # Get WebSocket URL and authentication headers
        ws_url, headers = client.generate_ws_headers()

        # Connect to the remote browser
        chromium: BrowserType = playwright.chromium
        browser = await chromium.connect_over_cdp(
            ws_url,
            headers=headers
        )

        # Get the browser context and page
        context = browser.contexts[0]
        page = context.pages[0]

        try:
            # Navigate to a website
            await page.goto("https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html")

            # Print the page title
            title = await page.title()
            print(f"Page title: {title}")

            # Keep the session alive for 2 minutes to allow viewing
            print("\n\nBrowser session is active. Check the AWS Console for live view.")
            await asyncio.sleep(120)

        finally:
            # Clean up resources
            await page.close()
            await browser.close()

async def main():
    async with async_playwright() as playwright:
        await run(playwright)

# Run the async function
if __name__ == "__main__":
    asyncio.run(main())
```
**Sync Playwright example with live view**

Alternatively, you can use the sync API with integrated live view server:

```python
from playwright.sync_api import sync_playwright, Playwright, BrowserType
from bedrock_agentcore.tools.browser_client import browser_session
from browser_viewer import BrowserViewerServer
import time

def run(playwright: Playwright):
    # Create the browser session and keep it alive
    with browser_session('us-west-2') as client:
        ws_url, headers = client.generate_ws_headers()

        # Start viewer server
        viewer = BrowserViewerServer(client, port=8005)
        viewer_url = viewer.start(open_browser=True)

        # Connect using headers
        chromium: BrowserType = playwright.chromium
        browser = chromium.connect_over_cdp(
            ws_url,
            headers=headers
        )

        context = browser.contexts[0]
        page = context.pages[0]

        try:
            page.goto("https://amazon.com/")
            print(page.title())
            time.sleep(120)
        finally:
            page.close()
            browser.close()

with sync_playwright() as playwright:
    run(playwright)
```
**Run the script**

Execute either script:

```text
python direct_browser_playwright.py
```
**Expected output**

You should see the page title printed (for example, `Page title: What is Amazon Bedrock AgentCore? - Amazon Bedrock AgentCore` ). The script keeps the browser session active for 2 minutes before closing.

Both examples:

  * Create a managed browser session using Amazon Bedrock AgentCore Browser

  * Connect to the remote Chrome browser using Playwright’s Chrome DevTools Protocol (CDP)

  * Navigate to AgentCore documentation and print the page title

  * Keep the session alive for 2 minutes, allowing you to view it in the AWS Console

  * Properly close the browser and clean up resources



