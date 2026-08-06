# Session Recording and Replay - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-session-recording.html

---

# Session Recording and Replay

Browser session recording and replay provides comprehensive observability for debugging, auditing, or training purposes. When you create a browser with session recording enabled, Amazon Bedrock AgentCore automatically captures browser interactions and stores them in your specified Amazon S3 bucket for later analysis.

Session replay captures comprehensive browser interaction data that enables you to view replays and understand the actions that occurred during browser sessions. This functionality helps you resolve errors and improve future invocations by providing detailed insights into browser behavior.

Information collected during session replay includes:

  * Session DOM changes and mutations

  * User actions including clicks, scrolls, and form interactions

  * Console logs and error messages

  * Chrome DevTools Protocol (CDP) events

  * Network events and HTTP requests


## Prerequisites for session recording

To enable session recording, you need:

  * An Amazon S3 bucket to store recording data

  * An IAM execution role with permissions to write to your Amazon S3 bucket

  * A custom browser tool configured with recording enabled


## Configure IAM role for recording

To enable session recording, you need an IAM execution role with permissions to write recording data to Amazon S3 and log activity to CloudWatch. For detailed instructions on setting up permissions, see [Permissions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-resource-session-management.html#browser-permissions>).

The execution role requires additional permissions beyond the standard browser permissions:

```json
{
    "Sid": "S3Permissions",
    "Effect": "Allow",
    "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket",
        "s3:ListMultipartUploadParts",
        "s3:AbortMultipartUpload"
    ],
    "Resource": [
        "arn:aws:s3:::your-recording-bucket",
        "arn:aws:s3:::your-recording-bucket/*"
    ]
},
{
    "Sid": "CloudWatchLogsPermissions",
    "Effect": "Allow",
    "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogStreams"
    ],
    "Resource": "*"
}
```
Replace `your-recording-bucket` with your actual Amazon S3 bucket name.

## Step 1: Create a browser tool with recording

Create a custom browser tool with recording enabled. For detailed instructions on creating browser tools, see [Creating an AgentCore Browser](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-using-tool.html#browser-create>).

When creating your browser tool, ensure you:

  * Enable session recording in the configuration

  * Specify your Amazon S3 bucket and prefix for storing recordings

  * Use the IAM execution role from Step 1


Example using Python SDK:

```python
import boto3
import uuid

region = "us-west-2"
bucket = "your-recording-bucket"

client = boto3.client("bedrock-agentcore-control", region_name=region)

response = client.create_browser(
    name="MyRecordingBrowser",
    description="Browser with session recording enabled",
    networkConfiguration={"networkMode": "PUBLIC"},
    executionRoleArn="arn:aws:iam::123456789012:role/AgentCoreBrowserRecordingRole",
    clientToken=str(uuid.uuid4()),
    recording={
        "enabled": True,
        "s3Location": {
            "bucket": bucket,
            "prefix": "browser-recordings"
        }
    }
)

browser_identifier = response.get("browserId") or response.get("browserIdentifier")
print(f"Created browser with recording: {browser_identifier}")
print(f"Recordings will be stored at: s3://{bucket}/browser-recordings/")
```
## Step 2: Use the recording-enabled browser

Use your recording-enabled browser with any automation framework. All browser interactions will be automatically recorded. Example using Strands:

```python
from strands import Agent
from strands_tools.browser import AgentCoreBrowser

# Use the browser created with recording
browser_identifier = "your-browser-identifier"
region = "us-west-2"
browser_tool = AgentCoreBrowser(region=region, identifier=browser_identifier)

agent = Agent(tools=[browser_tool.browser])
prompt = (
    "Navigate to https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html "
    "and summarize the key features of AgentCore."
)

response = agent(prompt)
print("Agent Response:")
print(response.message["content"][0]["text"])
```
All interactions during this session will be automatically recorded and uploaded to your Amazon S3 bucket when the session ends.

## Step 3: Monitor live sessions and replay recordings

The AWS Console provides comprehensive tools for both real-time monitoring and recorded session analysis.

### Live view monitoring

Monitor browser sessions in real-time and interact with active sessions:

**To access live view in the console**

  1. Open the Amazon Bedrock AgentCore console and navigate to **Built-in tools**

  2. Select your browser tool from the list (for example, `MyRecordingBrowser` )

  3. In the **Browser sessions** section, locate an active session with status **Ready** or **In progress**

  4. In the **Live view / recording** column, click the provided "View live session" URL

  5. The live view opens in a new browser window, displaying the real-time browser session


The live view interface provides:

  * Real-time video stream of the browser session

  * Interactive controls to take over or release control from automation

  * Session status indicators and connection information

  * Ability to interact directly with the browser when control is enabled


### Session replay and analysis

Access detailed session recordings and analysis through the console replay interface:

**To access session replay in the console**

  1. Navigate to your browser tool and select a completed session with **Terminated** status

  2. Click **View Recording** for the session you want to analyze

  3. The session replay page displays with comprehensive analysis tools


**Session analysis features**

The console provides multiple analysis tools:

  * **Video Player** : Interactive playback with timeline scrubber for navigation

  * **Pages Navigation** : Panel showing all visited pages with time ranges

  * **User Actions** : All user interactions with timestamps, methods, and details

  * **Page DOM** : DOM structure and HTML content for each page

  * **Console Logs** : Browser console output, errors, and log messages

  * **CDP Events** : Chrome DevTools Protocol events with parameters and results

  * **Network Events** : HTTP requests, responses, status codes, and timing


**Navigate recordings**

Use these methods to navigate through recordings:

  * Click on pages in the Pages panel to jump to specific moments

  * Click on user actions to see where they occurred in the timeline

  * Use the video timeline scrubber for precise navigation

  * Choose **View recording** links in action tables to jump to specific interactions


## Step 4: Access recordings programmatically

Access live view and recording insights programmatically using the Amazon Bedrock AgentCore SDK and APIs for custom integration and automated analysis.

### Programmatic live view access

Connect to live browser sessions using the browser client and viewer server:

```python
import time
from rich.console import Console
from bedrock_agentcore.tools.browser_client import browser_session
from browser_viewer import BrowserViewerServer

console = Console()

def main():
    try:
        # Create browser session
        with browser_session('us-west-2') as client:
            print("✅ Browser ready!")
            ws_url, headers = client.generate_ws_headers()

            # Start viewer server
            console.print("[cyan]Starting viewer server...[/cyan]")
            viewer = BrowserViewerServer(client, port=8005)
            viewer_url = viewer.start(open_browser=True)

            # Keep running
            while True:
                time.sleep(1)

    except KeyboardInterrupt:
        console.print("[yellow]Shutting down...[/yellow]")
        if 'client' in locals():
            client.stop()
            console.print("✅ Browser session terminated")

if __name__ == "__main__":
    main()
```
### Programmatic recording access

Access recording data directly from Amazon S3 for custom analysis workflows:

```python
import boto3

s3_client = boto3.client('s3', region_name='us-west-2')

# List recordings in your bucket
bucket_name = "your-recording-bucket"
prefix = "browser-recordings/"

response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=prefix)

print(f"Recordings in s3://{bucket_name}/{prefix}:")
for obj in response.get('Contents', []):
    print(f"  {obj['Key']} ({obj['Size']} bytes)")
    print(f"    Last Modified: {obj['LastModified']}")
    print()
```
Recording data structure:

```text
s3://your-recording-bucket/browser-recordings/
  └── session-id/
      ├── batch_1.ndjson.gz
      ├── batch_2.ndjson.gz
      └── batch_3.ndjson.gz
```
Each session creates a folder with the session ID, and recording data is uploaded in chunks as the session progresses.

## Session replay programmatic examples

For advanced use cases, you can build custom session replay viewers and integrate recording data into your own analysis workflows.

The following GitHub examples show a standalone session replay viewer and what the complete browser experience looks like when using the browser session replay feature.

For additional examples, see [AgentCore Browser examples on GitHub](<https://github.com/awslabs/amazon-bedrock-agentcore-samples/tree/main/01-features/03-connect-your-agent-to-anything/02-browser>).

The standalone session replay viewer is a separate tool for viewing recorded browser sessions directly from Amazon S3 without creating a new browser.

  * Connect directly to S3 to view recordings

  * View any past recording by specifying its session ID

  * Display error messages when artifacts are missing from S3, with console replay URLs specific to session ID

  * Interactive video playback interface with timeline navigation

  * Action markers on timeline showing form fills, clicks, and navigation events

  * Observability table displaying pages traveled with duration and URL details

  * Console events, CDP logs, and network logs for each page interaction

  * Session duration tracking integrated at page level

  * Real-time action verification with visual correlation between video and action data


For reference, see [AgentCore Browser observability samples on GitHub](<https://github.com/awslabs/amazon-bedrock-agentcore-samples/tree/main/01-features/03-connect-your-agent-to-anything/02-browser/03-observability>).

A comprehensive tool for creating browser sessions with recording capabilities and advanced replay features.

  * Create browser sessions with automatic recording to S3

  * Live view with interactive control (take/release)

  * Adjust display resolution on the fly

  * Automatic session recording to S3

  * Integrated session replay viewer with video player interface

  * Timeline scrubbing with precise action location tracking

  * Page-by-page analysis with navigation timeline and URL copying

  * Form filling action verification with click location details

  * Session duration tracking integrated at page level

  * Real-time action verification with visual correlation between video and action data


For reference, see [AgentCore Browser samples on GitHub](<https://github.com/awslabs/amazon-bedrock-agentcore-samples/tree/main/01-features/03-connect-your-agent-to-anything/02-browser>).

