# Code examples - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-bidirectional-streaming-examples.html

---

# Code examples

The following sample applications demonstrate bidirectional streaming on Amazon Bedrock AgentCore Runtime.

## WebSocket examples

Bidirectional WebSocket samples (Sonic, Strands, Echo)
    

Three WebSocket examples for AgentCore Runtime: a native Amazon Nova Sonic implementation with direct event handling and a web client, a Strands Agents SDK voice agent using the Strands WebSocket transport, and a minimal echo server for testing bidirectional streaming. See [Bidirectional WebSocket samples](<https://github.com/awslabs/amazon-bedrock-agentcore-samples/tree/main/01-features/02-host-your-agent/01-runtime/03-advanced/03-bidirectional-streaming>) on GitHub.

Pipecat voice agent with WebSocket
    

Deploys a Pipecat voice agent to AgentCore Runtime using WebSocket for bidirectional audio streaming. The pipeline orchestrates Deepgram (speech-to-text), Amazon Nova (LLM), and Cartesia (text-to-speech). See [Pipecat on AgentCore with WebSocket](<https://github.com/pipecat-ai/pipecat-examples/tree/main/deployment/aws-agentcore-websocket>) on GitHub.

Serverless telephony with Vonage and Amazon Nova Sonic
    

A serverless contact center agent that handles phone calls through the Vonage Voice API, processing audio in real-time with Amazon Nova Sonic over AgentCore Runtime WebSocket connections. Uses a Lambda function to generate presigned WebSocket URLs for Vonage. See [Serverless telephony with Sonic and AgentCore Runtime](<https://github.com/aws-samples/sample-vonage-serverless-sonic>) on GitHub.

## WebRTC examples

WebRTC voice agent with KVS TURN
    

A minimal WebRTC voice agent using Amazon Kinesis Video Streams for TURN relaying and an Amazon Bedrock foundation model for speech-to-speech conversation. See [WebRTC voice agent with KVS TURN](<https://github.com/awslabs/amazon-bedrock-agentcore-samples/tree/main/01-features/02-host-your-agent/01-runtime/03-advanced/03-bidirectional-streaming/05-bidirectional-streaming-webrtc>) on GitHub.

Pipecat voice agent with WebRTC
    

Deploys a Pipecat voice agent to AgentCore Runtime using SmallWebRTC as a lightweight WebRTC transport. The pipeline orchestrates Deepgram (speech-to-text), Amazon Nova (LLM), and Cartesia (text-to-speech). See [Pipecat on AgentCore with WebRTC](<https://github.com/pipecat-ai/pipecat-examples/tree/main/deployment/aws-agentcore-webrtc>) on GitHub.

Pipecat voice agent with Daily
    

Deploys a Pipecat voice agent to AgentCore Runtime using Daily as the WebRTC transport. Users join by visiting a Daily room URL in their browser. The pipeline orchestrates Deepgram (speech-to-text), Amazon Nova (LLM), and Cartesia (text-to-speech). See [Pipecat on AgentCore with Daily](<https://github.com/pipecat-ai/pipecat-examples/tree/main/deployment/aws-agentcore-daily>) on GitHub.

LiveKit voice agent on AgentCore Runtime
    

Deploys a LiveKit voice agent to AgentCore Runtime with KVS managed TURN or third-party TURN for WebRTC NAT traversal. See [LiveKit on AgentCore Runtime](<https://github.com/livekit-examples/agent-deployment/tree/main/bedrock-agentcore>) on GitHub.

