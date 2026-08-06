# Understand the available interfaces for using Amazon Bedrock AgentCore - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/develop-agents.html

---

# Understand the available interfaces for using Amazon Bedrock AgentCore

Amazon Bedrock AgentCore supports various interfaces for developing and deploying your agent code. The simplest approach is to use the AgentCore Python SDK to create your agent code and use the AgentCore CLI to deploy your agent.

The AgentCore CLI and AgentCore Python SDK don’t support all AgentCore operations that the AWS SDK supplies. If they don’t support a specific AgentCore operation, use the AWS SDK.

###### Topics

  * AgentCore CLI

  * AgentCore Python SDK

  * Amazon Bedrock AgentCore MCP server

  * AWS SDK

  * Amazon Bedrock AgentCore console

  * AWS Command Line Interface


## AgentCore CLI

The [AgentCore CLI](<https://github.com/aws/agentcore-cli>) is a Node.js command-line tool for creating, configuring, deploying, and managing agents on Amazon Bedrock AgentCore. It requires Node.js 20 or later.

Install the AgentCore CLI globally with npm:

```bash
npm install -g @aws/agentcore
```
The AgentCore CLI provides the following key commands:

  * _agentcore create_ : Set up a new agent project with your preferred framework and model provider

  * _agentcore deploy_ : Deploy your agent to AWS infrastructure

  * _agentcore dev_ : Run your agent locally for development and testing

  * _agentcore invoke_ : Invoke a deployed agent for testing

  * _agentcore status_ : Check the status of a deployed agent


Configuration is managed through JSON files in the `agentcore/` directory of your project. These files include `agentcore.json` for project settings and `aws-targets.json` for AWS deployment targets.

Under the hood, the AgentCore CLI uses AWS CDK constructs from the `@aws/agentcore-cdk` package to provision and manage AWS resources.

For step-by-step instructions, see [Get started with Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./agentcore-get-started-cli.html>).

## AgentCore Python SDK

The [AgentCore Python SDK](<https://github.com/aws/bedrock-agentcore-sdk-python>) provides Python primitives for agent development with built-in support for:

  * _Runtime_ : Lightweight wrapper over the AgentCore operations in the AWS SDK that lets you easily write Python code for an agent.

  * _Memory_ : Persistent storage for conversation history and agent context

  * _Tools_ : Built-in clients for code interpretation and browser automation

  * _Identity_ : Secure authentication and access management

  * _AgentCore Evaluations_ : Automated assessment tools for measuring agent performance


The AgentCore Python SDK supports multiple frameworks, such as Strands Agents and LangGraph. If you are using other AWS services, you’ll need to use the AWS SDK to integrate those services into your agent, alongside your AgentCore Python SDK code.

## Amazon Bedrock AgentCore MCP server

The AgentCore Model Context Protocol (MCP) server helps you transform, deploy, and test AgentCore-compatible agents directly from your preferred development environment. With built-in support for runtime integration, gateway connectivity, and agent lifecycle management, the MCP server simplifies moving from local development to production deployment on AgentCore services.

The MCP server works with popular MCP clients including Kiro, Cursor, Claude Code, and Amazon Q CLI, providing conversational commands to automate complex agent development workflows.

For more information, see [Amazon Bedrock AgentCore MCP Server: Vibe coding with your coding assistant](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./mcp-getting-started.html>).

## AWS SDK

You can use the AWS SDK to achieve the same results as the AgentCore Python SDK, as well as other tasks that the AgentCore Python SDK doesn’t support. You’ll need to use the AWS SDK to interact with other AWS services such as AWS Lambda and Amazon S3. You’ll also need to the AWS SDK if you aren’t using Python as your coding language.

To configure and deploy an agent, you use the [AgentCore control plane API](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/Welcome.html>) . For example, you can create an AgentCore Runtime or create an AgentCore Memory.

At runtime, you use the [AgentCore data plane API](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/Welcome.html>) for tasks such as adding a memory event to an AgentCore Memory. The client code that calls your agent uses the `InvokeAgentRuntime` data plane operation to invoke an agent that you have hosted in an AgentCore Runtime.

## Amazon Bedrock AgentCore console

You can use the AgentCore console to create and manage the AgentCore services that your agent code uses. You can get code snippets that show to call an agent hosted in an AgentCore Runtime. You can also test your agent in the agent sandbox. Open the console at [https://console.aws.amazon.com/bedrock-agentcore/home#](<https://console.aws.amazon.com/bedrock-agentcore/home#>).

## AWS Command Line Interface

You can use the AWS CLI with the AgentCore services that you use. Use [control plane api](<https://docs.aws.amazon.com/cli/latest/reference/bedrock-agentcore-control/>) to create and manage services. For example you can create an AgentCore Memory or update the endpoint for an AgentCore Runtime. You can also perform runtime actions with the [data plane API](<https://docs.aws.amazon.com/cli/latest/reference/bedrock-agentcore/>) , which can be useful for testing an agent.

