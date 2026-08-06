# Bidirectional streaming - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-bidirectional-streaming.html

---

# Bidirectional streaming

Amazon Bedrock AgentCore Runtime supports bidirectional streaming, enabling real-time, two-way communication between clients and agents. This is essential for interactive applications such as conversational voice agents where both the client and agent need to send and receive data simultaneously.

AgentCore Runtime supports two protocols for bidirectional streaming:

WebSocket
    

A persistent, full-duplex connection over TCP. WebSocket supports text-based streaming, structured message exchange, and audio streaming with no additional infrastructure required. Clients connect to the AgentCore Runtime WebSocket endpoint using SigV4 or OAuth 2.0 authentication.

WebRTC
    

A protocol optimized for real-time audio and video with low latency. WebRTC is well-suited for voice agents in browser and mobile applications, using UDP-based transport for real-time media delivery.

###### Topics

  * [Bidirectional streaming with WebSocket](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-bidirectional-streaming-websocket.html>)

  * [Bidirectional streaming with WebRTC](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-webrtc.html>)

  * [Code examples](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-bidirectional-streaming-examples.html>)



