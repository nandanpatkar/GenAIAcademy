# Bidirectional streaming with WebRTC - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-webrtc.html

---

# Bidirectional streaming with WebRTC

With Amazon Bedrock AgentCore Runtime, you can use WebRTC (Web Real-Time Communication) to enable real-time media streaming between clients and agents. WebRTC is useful when building voice agents for browser and mobile applications, where clients use the browser-native WebRTC API or mobile WebRTC SDKs for real-time media. For more information about WebRTC, see [WebRTC API](<https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API>) in the MDN Web Docs.

###### Topics

  * Using WebRTC on AgentCore Runtime

  * TURN streaming options

  * [Tutorial: WebRTC with TURN relaying using Amazon Kinesis Video Streams](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-webrtc-get-started-kvs.html>)


## Using WebRTC on AgentCore Runtime

WebRTC on AgentCore Runtime requires:

  * **VPC network mode** – Your AgentCore Runtime must be configured with VPC network mode. For more information, see [Configure Amazon Bedrock AgentCore Runtime and tools for VPC](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./agentcore-vpc.html>).

  * **TURN relay** – TURN relay is required for media traffic between the client and the agent. The VPC must support outbound UDP traffic to your TURN endpoints.


## TURN streaming options

The following TURN server options are available for WebRTC on AgentCore Runtime:

Amazon Kinesis Video Streams managed TURN Relay
    

KVS provides managed TURN servers through the `GetIceServerConfig` API. This option requires no TURN infrastructure management and integrates natively with AWS IAM for authentication. A KVS signaling channel resource is required to obtain TURN credentials. For WebRTC signaling itself (exchanging ICE candidates and session descriptions), you can use either the AgentCore Runtime invoke API or the KVS signaling channel. To get started, see [Tutorial: WebRTC with TURN relaying using Amazon Kinesis Video Streams](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-webrtc-get-started-kvs.html>).

Third-party managed TURN
    

You can use a third-party managed TURN provider.

Self-hosted TURN
    

You can host and operate your own TURN infrastructure using open-source software such as coturn on Amazon EC2 or Amazon ECS.

