# Tutorial: WebRTC with TURN relaying using Amazon Kinesis Video Streams - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-webrtc-get-started-kvs.html

---

# Tutorial: WebRTC with TURN relaying using Amazon Kinesis Video Streams

In this tutorial, you build a WebRTC voice connection between a browser client and an agent running on AgentCore Runtime, using Amazon Kinesis Video Streams (KVS) managed TURN for media relaying. The agent processes audio in real-time using an Amazon Bedrock foundation model for speech-to-speech conversation.

When complete, you will have a working WebRTC connection where audio streams bidirectionally between the browser and your agent.

This tutorial requires a VPC with internet egress for connectivity to KVS TURN endpoints. For more information, see [Internet access considerations](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./agentcore-vpc.html#agentcore-internet-access>) . All other prerequisites are handled by the sample application. The sample uses the AgentCore CLI for deployment to AgentCore Runtime.

For the complete sample application, see [WebRTC Voice Agent with KVS TURN](<https://github.com/awslabs/amazon-bedrock-agentcore-samples/tree/main/01-features/02-host-your-agent/01-runtime/03-advanced/03-bidirectional-streaming/05-bidirectional-streaming-webrtc>) on GitHub.

## Architecture

![Architecture diagram showing WebRTC on AgentCore Runtime with KVS TURN relaying through a VPC.](/agentcore/images/runtime-webrtc-architecture.png)

Browser client
    

A web page that captures microphone audio using the browser WebRTC API and plays the agent’s audio response.

AgentCore Runtime
    

Hosts the agent and attaches to the user’s VPC via an elastic network interface (ENI) in a private subnet.

Agent
    

A Python application deployed to AgentCore Runtime that handles WebRTC signaling and TURN credential management through the `/invocations` endpoint, and streams audio between the client and a foundation model.

User VPC with internet egress
    

Provides network connectivity from the agent to the KVS TURN relay server. Traffic routes from the ENI in the private subnet through a NAT gateway and internet gateway to reach the TURN endpoints.

KVS TURN relay server
    

Relays media traffic between the browser client and the agent. The agent obtains temporary TURN credentials from KVS using the [GetIceServerConfig](<https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/API_signaling_GetIceServerConfig.html>) API.

## How it works

  1. The client invokes the agent to fetch KVS TURN credentials and ICE server configuration.

  2. The client creates a WebRTC offer and sends it to the agent. The agent creates a peer connection configured with KVS TURN servers and returns an answer.

  3. The client and agent exchange ICE candidates to establish connectivity through the TURN server.

  4. Once connected, the client streams microphone audio to the agent over WebRTC. The agent forwards the audio to an Amazon Bedrock foundation model and streams the model’s spoken response back to the client.



