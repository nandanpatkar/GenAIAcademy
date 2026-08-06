# Core concepts for Amazon Bedrock AgentCore Gateway - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-core-concepts.html

---

# Core concepts for Amazon Bedrock AgentCore Gateway

Amazon Bedrock AgentCore Gateway provides a standardized, secure entry point for agentic traffic, letting AI agents discover and interact with tools, other agents, and large language models (LLMs). Understanding the core concepts of Gateway will help you design and implement effective integration strategies for your AI agents.

## Key concepts

**Gateway**
    

An AgentCore Gateway provides a single, secure access point for an agent to reach tools, other agents, and models. A gateway can have multiple targets across three categories—MCP, HTTP, and inference. For MCP targets, the gateway operates in aggregation mode, acting as an MCP server that combines the capabilities of all its MCP targets into a unified virtual MCP server. For HTTP targets, the gateway sends traffic directly to the target (for example, another agent or an A2A service) without aggregation or protocol translation. For inference targets, the gateway routes LLM requests to one or more model providers through a unified, model-based routing endpoint.

**Gateway Target**
    

A target defines the backend that a gateway connects to. There are three categories of targets. MCP targets define APIs, Lambda functions, MCP servers, or tool definitions that the gateway aggregates into a unified MCP server. HTTP targets define HTTP-based services, such as AgentCore Runtime agents and other agents, that the gateway proxies requests to directly. Inference targets route LLM traffic to one or more model providers through a unified endpoint, selecting the destination based on the requested model.

**AgentCore Gateway Authorizer**
    

Each gateway must have an inbound authorization configuration to control client access. The gateway supports the following inbound authorization types: OAuth (JWT) for token-based authorization, IAM (AWS Signature Version 4) for AWS identity-based authorization, authenticate only for validating tokens while delegating authorization to the target, and no authorization for development and testing scenarios. You can configure the authorizer when you create or update a gateway.

**AgentCore Credential Provider**
    

When Gateway makes calls to your APIs or Lambda function it must use some credentials to access those functionalities. When you create a Smithy or Lambda target, Gateway uses the attached execution role to make calls to those targets. When you create an OpenAPI or MCP server target, you can attach an AgentCore credential provider which stores the API Key or OAuth credentials, configure IAM-based authorization with SigV4 signing, or use no authorization for publicly accessible endpoints.

## Target types

Gateway supports three categories of targets:

**MCP target**
    

MCP targets operate in aggregation mode. The gateway combines the capabilities of all MCP targets into a single unified virtual MCP server. Clients see one consolidated `tools/list` response that includes tools from all attached MCP targets. MCP targets support capability synchronization, semantic tool search, and three-legged OAuth (3LO) at the target level. MCP target types include Lambda functions, API Gateway REST APIs, OpenAPI specifications, Smithy models, MCP servers, built-in integration provider templates and built-in connectors to tools.

**HTTP target**
    

HTTP targets send traffic directly to the target without aggregation or protocol translation. HTTP targets do not support capability synchronization or semantic tool search. Clients address each target individually through path-based routing. HTTP target types include Amazon Bedrock AgentCore Runtime agents, other agents (including Agent-to-Agent (A2A) services), external MCP servers, and any HTTP endpoint reached through a passthrough target.

**Inference target**
    

Inference targets route large language model (LLM) traffic to one or more model providers through a unified endpoint. The gateway selects the destination provider based on the `model` field in the request, giving agents a single, consistent interface across providers such as Amazon Bedrock, OpenAI, and Anthropic.

## MCP tool types

Gateway supports several types of MCP tools and integration methods:

**OpenAPI specifications**
    

Transform existing REST APIs into MCP-compatible tools by providing an OpenAPI specification. The gateway automatically handles the translation between MCP and REST formats.

**Lambda functions**
    

Connect Lambda functions as tools, allowing you to implement custom business logic in your preferred programming language. The gateway invokes the Lambda function and translates the response into the MCP format.

**Smithy models**
    

Use Smithy models to define your API interfaces and generate MCP-compatible tools. Smithy is a language for defining services and SDKs that can be used with AWS services. The gateway can use Smithy models to generate tools that interact with AWS services or custom APIs.

**MCP servers**
    

Use remote MCP servers to connect tools, prompts, and resources to your agent runtime. Gateway supports MCP tools, prompts, and resources capabilities. Tools are required; prompts and resources are optional. Prompts provide reusable prompt templates with arguments. Resources provide contextual data identified by URIs. During synchronization, the gateway discovers all capabilities that the MCP server advertises.

**Integrations**
    

Use pre-configured templates from integration providers.

**Connectors**
    

Use built-in connectors to tools.

