# Live View - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-dcv-integration.html

---

# Live View

Amazon Bedrock AgentCore’s Live View is powered by [AWS DCV](<https://docs.aws.amazon.com/dcv/>). Each browser session launches a dedicated DCV server that streams the browser interface and enables real-time user interaction.

To embed the Live View into your web application, use the BrowserLiveView React component from the [Amazon Bedrock AgentCore TypeScript SDK](<https://github.com/aws/bedrock-agentcore-sdk-typescript>). The component wraps the [AWS DCV Web Client](<https://docs.aws.amazon.com/dcv/latest/websdkguide/what-is.html>) internally and handles connection setup, SigV4 authentication, and video rendering, so you can integrate a live browser stream with minimal code while retaining full control over your UI.

## Using the BrowserLiveView component

The BrowserLiveView component requires a SigV4-presigned Live View URL. After starting a browser session (see [Managing browser sessions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-managing-sessions.html>)), generate the presigned URL using the [generateLiveViewUrl](<https://github.com/aws/bedrock-agentcore-sdk-typescript/blob/main/src/tools/browser/client.ts#L380>) method from the TypeScript SDK’s Browser class. The method signs the Live View stream endpoint with SigV4 credentials and returns a time-limited URL that you pass to the BrowserLiveView component.

Install the Amazon Bedrock AgentCore TypeScript SDK:

```bash
npm install bedrock-agentcore
```
Import the BrowserLiveView component and render it with the presigned URL. The component handles WebSocket connection, DCV protocol negotiation, video stream decoding, and frame rendering. It auto-scales to fit its parent container while preserving aspect ratio.

```python
import { BrowserLiveView }
  from 'bedrock-agentcore/browser/live-view'

<BrowserLiveView
  signedUrl={presignedUrl}
  remoteWidth={1920}
  remoteHeight={1080}
/>
```
The remoteWidth and remoteHeight must match the viewport configured for the browser session. Mismatched values cause cropping or black bars.

The Live View begins streaming as soon as the presigned URL is valid and the browser session is active. If the container remains empty, verify that the presigned URL has not expired and that the browser session is still running.

For a complete walkthrough including a sample React application, see [Embed a live AI browser agent in your React app with Amazon Bedrock AgentCore](<https://aws.amazon.com/blogs/machine-learning/embed-a-live-ai-browser-agent-in-your-react-app-with-amazon-bedrock-agentcore/>).

