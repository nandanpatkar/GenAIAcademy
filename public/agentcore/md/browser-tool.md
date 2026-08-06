# Interact with web applications using Amazon Bedrock AgentCore Browser - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-tool.html

---

# Interact with web applications using Amazon Bedrock AgentCore Browser

The Amazon Bedrock AgentCore Browser provides a secure, isolated browser environment for your agents to interact with web applications. It runs in a containerized environment, keeping web activity separate from your system. It includes security features such as session isolation, built-in observability through live viewing, CloudTrail logging, and session replay capabilities.

![Architecture showing the built-in tools offering and Browser and CI tools.](/agentcore/images/browser-tool.png)

The Amazon Bedrock AgentCore Browser provides session-based web browsing with comprehensive observability. The workflow consists of four key steps:

  1. **Create a Browser Tool**

You start by creating a Browser Tool enabling web browsing capabilities for your agent to interact with web applications, fill forms, navigate websites, and extract information in a fully managed environment. You can choose between the AWS managed Browser (aws.browser.v1) for quick setup, or create a custom browser with advanced features like session recording, custom network settings, and specific IAM execution roles.

  2. **Start a browser session**

Launch isolated sessions with configurable timeouts (default: 15 minutes, maximum: 8 hours). Run multiple sessions simultaneously.

  3. **Interact with the browser**

Once a session is started, you can interact with the browser using WebSocket-based streaming APIs. The Automation endpoint enables your agent to perform browser actions such as navigating to websites, clicking elements, filling out forms, taking screenshots, and more. Libraries like Strands, Nova Act, or Playwright can be used to simplify these interactions. Meanwhile, the Live View endpoint allows an end user to watch the browser session in real time and interact with it directly through the live stream.

  4. **Monitor and record sessions**

All browser sessions provide built-in observability which includes Live View for real-time monitoring, Session recording (available for custom browsers), and CloudWatch metrics for real-time performance insights. Session recording captures DOM changes, user actions, console logs, and network events. Recorded sessions are stored in your Amazon S3 bucket and can be replayed through the AWS Console for detailed analysis capabilities including video playback, timeline navigation, user action tracking, and comprehensive logs for troubleshooting and optimization.


**Why use remote browsers for agent development?**

A remote browser runs in a separate environment rather than on the local machine. For agent development, remote browsers allow AI agents to interact with the web as humans do. Key capabilities include:

  * Navigate websites, fill forms, click buttons, parse dynamic content

  * Serverless infrastructure that scales automatically

  * Visual understanding through screenshots

  * Human intervention with live interactive view

  * Session isolation for security

  * Complex web application navigation

  * Comprehensive audit capabilities


**Security Features**

The Browser Tool includes several security features to help protect your environment:

  * Isolation: Containerized environment separate from your system

  * Ephemeral sessions: Temporary sessions that reset after each use

  * Automatic termination when time-to-live expires


###### Topics

  * [Get started with AgentCore Browser](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-quickstart.html>)

  * [Fundamentals](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-resource-session-management.html>)

  * [Observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-observability.html>)

  * [Features](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-features.html>)

  * [File system configurations for AgentCore Browser](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-filesystem-configurations.html>)

  * [Troubleshoot AgentCore Browser](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-tool-troubleshooting.html>)



