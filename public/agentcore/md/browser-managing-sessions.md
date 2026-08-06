# Managing Browser Sessions - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-managing-sessions.html

---

# Managing Browser Sessions

## Starting a browser session

After creating a browser, you can start a session to interact with web applications.

###### Example

AWS CLI
    

  1. To start a Browser session using the AWS CLI, use the `start-browser-session` command:

```bash
 aws bedrock-agentcore start-browser-session \
  --region <Region> \
  --browser-identifier "my-browser" \
  --name "my-browser-session" \
  --session-timeout-seconds 900 \
  --view-port width=1456,height=819
```
Boto3
    

  1. To start a Browser session using the AWS SDK for Python (Boto3), use the `start_browser_session` method:

**Request Syntax**

The following shows the request syntax:

```text
response = dp_client.start_browser_session(
    browserIdentifier="aws.browser.v1",
    name="browser-session-1",
    sessionTimeoutSeconds=3600,
    viewPort={
        'height': 819,
        'width': 1456
    }
)
```
BrowserClient
    

  1. To start a browser session using the BrowserClient class for more control over the session lifecycle:

```python
from bedrock_agentcore.tools.browser_client import BrowserClient

# Create a browser client
client = BrowserClient(region="us-west-2")

# Start a browser session
client.start()
print(f"Session ID: {client.session_id}")

try:
    # Generate WebSocket URL and headers
    url, headers = client.generate_ws_headers()

    # Perform browser operations with your preferred automation tool

finally:
    # Always close the session when done
    client.stop()
```
API
    

  1. To create a new browser session using the API, use the following call:

```bash
# Using awscurl
awscurl -X PUT \
  "https://bedrock-agentcore.<Region>.amazonaws.com/browsers/aws.browser.v1/sessions/start" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  --service bedrock-agentcore \
  --region <Region> \
  -d '{
    "name": "browser-session-abc12345",
    "description": "browser sandbox session",
    "sessionTimeoutSeconds": 300,
    "viewPort": {
       "height": 819,
       "width": 1456
    }
  }'
```
## Get Browser session

You can get information about a browser session that you have created.

###### Example

AWS CLI
    

  1. To get information about a browser session using the AWS CLI, use the `get-browser-session` command:

```bash
aws bedrock-agentcore get-browser-session \
  --region <Region> \
  --browser-identifier "aws.browser.v1" \
  --session-id "<your-session-id>"
```
Boto3
    

  1. To get information about a browser session using the AWS SDK for Python (Boto3), use the `get_browser_session` method:

**Request Syntax**

The following shows the request syntax:

```text
response = dp_client.get_browser_session(
    browserIdentifier="aws.browser.v1",
    sessionId="<your-session-id>"
)
```
API
    

  1. To get information about a browser session using the API, use the following call:

```bash
# Using awscurl
awscurl -X GET \
  "https://bedrock-agentcore.<Region>.amazonaws.com/browsers/aws.browser.v1/sessions/get?sessionId=<your-session-id>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  --service bedrock-agentcore \
  --region <Region>

{
  "browserIdentifier": "aws.browser.v1",
  "createdAt": "2025-07-14T22:16:40.713152248Z",
  "lastUpdatedAt": "2025-07-14T22:16:40.713152248Z",
  "name": "testBrowserSession1752531400",
  "sessionId": "<your-session-id>",
  "sessionReplayArtifact": null,
  "sessionTimeoutSeconds": 900,
  "status": "TERMINATED",
  "streams": {
    "automationStream": {
      "streamEndpoint": "wss://bedrock-agentcore.<Region>.amazonaws.com/browser-streams/aws.browser.v1/sessions/<your-session-id>/automation",
      "streamStatus": "ENABLED"
    },
    "liveViewStream": {
      "streamEndpoint": "https://bedrock-agentcore.<Region>.amazonaws.com/browser-streams/aws.browser.v1/sessions/<your-session-id>/live-view"
    }
  },
  "viewPort": {
    "height": 819,
    "width": 1456
  }
}
```
## Interacting with a browser session

Once you have started a Browser session, you can interact with it using the WebSocket API. You can also use the InvokeBrowser API for direct operating system-level control, including mouse clicks, keyboard input, and full-screen screenshots. For more information, see [Browser OS action](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-invoke.html>).

###### Example

Console
    

  1. ====== To interact with a Browser session using the console

  2. Navigate to your active Browser session.

  3. Use the browser interface to navigate to websites, interact with web elements, and perform other browser actions.

  4. You can view the browser activity in real-time through the live view feature.


SDK
    

  1. To interact with a Browser session programmatically, use the WebSocket-based streaming API with the following URL format:

```text
https://bedrock-agentcore.<Region>.amazonaws.com/browser-streams/{browser_id}/sessions/{session_id}/automation
```
You can use libraries like Playwright to establish a connection with the WebSocket and control the browser. Here’s an example:

```python
from playwright.sync_api import sync_playwright, Playwright, BrowserType
import os
import base64
from bedrock_agentcore.tools.browser_client import browser_session

def main(playwright: Playwright):
    # Keep browser session alive during usage
    with browser_session('us-west-2') as client:

        # Generate CDP endpoint and headers
        ws_url, headers = client.generate_ws_headers()

        # Connect to browser using headers
        chromium: BrowserType = playwright.chromium
        browser = chromium.connect_over_cdp(ws_url, headers=headers)

        # Use the first available context or create one
        context = browser.contexts[0] if browser.contexts else browser.new_context()
        page = context.pages[0] if context.pages else context.new_page()

        page.goto("https://amazon.com/")
        print("Navigated to Amazon")

        # Create CDP session for screenshot
        cdp_client = context.new_cdp_session(page)
        screenshot_data = cdp_client.send("Page.captureScreenshot", {
            "format": "jpeg",
            "quality": 80,
            "captureBeyondViewport": True
        })

        # Decode and save screenshot
        image_data = base64.b64decode(screenshot_data['data'])
        with open("screenshot.jpeg", "wb") as f:
            f.write(image_data)

        print("✅ Screenshot saved as screenshot.jpeg")
        page.close()
        browser.close()

with sync_playwright() as p:
    main(p)
```
The following example code shows how you can perform live view using the WebSocket-based streaming API.

```text
https://bedrock-agentcore.<Region>.amazonaws.com/browser-streams/{browser_id}/sessions/{session_id}/live-view
```
Below is the code.

```python
import time
from rich.console import Console
from bedrock_agentcore.tools.browser_client import browser_session
from browser_viewer import BrowserViewerServer

console = Console()

def main():
    try:
         # Step 1: Create browser session
        with browser_session('us-west-2') as client:
            print("\r   ✅ Browser ready!                    ")
            ws_url, headers = client.generate_ws_headers()

            # Step 2: Start viewer server
            console.print("\n[cyan]Step 3: Starting viewer server...[/cyan]")
            viewer = BrowserViewerServer(client, port=8005)
            viewer_url = viewer.start(open_browser=True)

            # Keep running
            while True:
                time.sleep(1)

    except KeyboardInterrupt:
        console.print("\n\n[yellow]Shutting down...[/yellow]")
        if 'client' in locals():
            client.stop()
            console.print("✅ Browser session terminated")
    except Exception as e:
        console.print(f"\n[red]Error: {e}[/red]")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
```
## Listing browser sessions

You can list all active browser sessions to monitor and manage your resources. This is useful for tracking active sessions, identifying long-running sessions, or finding sessions that need to be stopped.

###### Example

AWS CLI
    

  1. To list Browser sessions using the AWS CLI, use the `list-browser-sessions` command:

```bash
aws bedrock-agentcore list-browser-sessions \
  --region <Region> \
  --browser-id "<your-browser-id>" \
  --max-results 10
```
You can also filter sessions by status:

```bash
aws bedrock-agentcore list-browser-sessions \
  --region <Region> \
  --browser-id "<your-browser-id>" \
  --status "READY"
```
Boto3
    

  1. To list Browser sessions using the AWS SDK for Python (Boto3), use the `list_browser_sessions` method:

**Request Syntax**

The following shows the request syntax:

```text
response = dp_client.list_browser_sessions(
    browserIdentifier="aws.browser.v1"
)
```
You can also filter sessions by status:

```bash
# List only active sessions
filtered_response = dp_client.list_browser_sessions(
    browserIdentifier="aws.browser.v1",
    status="READY"
)

# Print filtered session information
for session in filtered_response['items']:
    print(f"Ready Session ID: {session['sessionId']}")
    print(f"Name: {session['name']}")
    print("---")
```
API
    

  1. To list browser sessions using the API, use the following call:

```bash
# Using awscurl
awscurl -X POST \
  "https://bedrock-agentcore.<Region>.amazonaws.com/browsers/<your-browser-id>/sessions/list" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  --service bedrock-agentcore \
  --region <Region> \
  -d '{
    "maxResults": 10
  }'
```
You can also filter sessions by status:

```bash
# Using awscurl
awscurl -X POST \
  "https://bedrock-agentcore.<Region>.amazonaws.com/browsers/aws.browser.v1/sessions/list" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  --service bedrock-agentcore \
  --region <Region> \
  -d '{
    "maxResults": 10,
    "status": "READY"
  }'
```
## Stopping a browser session

When you are finished using a Browser session, you should stop it to release resources and avoid unnecessary charges.

###### Example

AWS CLI
    

  1. To stop a Browser session using the AWS CLI, use the `stop-browser-session` command:

```bash
aws bedrock-agentcore stop-browser-session \
  --region <Region> \
  --browser-id "<your-browser-id>" \
  --session-id "<your-session-id>"
```
Boto3
    

  1. To stop a Browser session using the AWS SDK for Python (Boto3), use the `stop_browser_session` method:

**Request Syntax**

The following shows the request syntax:

```text
response = dp_client.stop_browser_session(
        browserIdentifier="aws.browser.v1",
        sessionId="<your-session-id>",
    )
```
API
    

  1. To stop a browser session using the API, use the following call:

```bash
# Using awscurl
awscurl -X PUT \
  "https://bedrock-agentcore.<Region>.amazonaws.com/browsers/aws.browser.v1/sessions/stop?sessionId=<your-session-id>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  --service bedrock-agentcore \
  --region <Region>
```
## Updating browser streams

You can update browser streams to enable or disable automation. This is useful when you need to enter sensitive information like login credentials that you don’t want the agent to see.

###### Example

Boto3
    

  1. 
```text
response = dp_client.update_browser_stream(
    browserIdentifier="aws.browser.v1",
    sessionId="<your-session-id>",
    streamUpdate={
        "automationStreamUpdate": {
            "streamStatus": "DISABLED"  # or "ENABLED"
        }
    }
)
```
 


API
    

  1. 
```text
awscurl -X PUT \
  "https://bedrock-agentcore.<Region>.amazonaws.com/browsers/aws.browser.v1/sessions/streams/update?sessionId=<your-session-id>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  --service bedrock-agentcore \
  --region <Region> \
  -d '{
    "streamUpdate": {
            "automationStreamUpdate": {
              "streamStatus": "ENABLED"
            }
          }
  }'
```
 


CLI
    

  1. 
```bash
aws bedrock-agentcore update-browser-stream \
  --region <Region> \
  --browser-id "<your-browser-id>" \
  --session-id "<your-session-id>" \
  --stream-update automationStreamUpdate={streamStatus=ENABLED}
```
 



