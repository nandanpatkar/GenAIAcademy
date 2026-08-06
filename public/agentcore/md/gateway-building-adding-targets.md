# Add targets to an existing AgentCore gateway - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-building-adding-targets.html

---

# Add targets to an existing AgentCore gateway

After creating a gateway, you can add targets, which define the tools that your gateway will host. AgentCore Gateway supports multiple target type that are detailed in the following topics. Each target can have its own credential provider attached, enabling you to securely control access targets. By adding targets, your gateway becomes a single MCP URL that enables access to all of the relevant tools for an agent.

When you add a target, you provide the following required fields:

  * The ID of the gateway to which to add the target.

  * A name for the gateway target. To understand how the target name affects tool names, see [Understand how AgentCore Gateway tools are named](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-tool-naming.html>).

  * A target configuration. The configuration differs depending on the gateway protocol type and your gateway target type. For more information, see [TargetConfiguration](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_TargetConfiguration.html>) and its daughter pages.

  * A credential provider configuration. The configuration depends on the [outbound authorization](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-outbound-auth.html>).


You can optionally provide the following fields:

  * A description of the gateway target.

  * A client token value to ensure that a request completes no more than once. If you don’t include this token, one is randomly generated for you. If you don’t include a value, one is randomly generated for you. For more information, see [Ensuring idempotency](<https://docs.aws.amazon.com/ec2/latest/devguide/ec2-api-idempotency.html>).


Select a topic to learn how to add a target to an existing gateway using that method:

###### Topics

  * [Add a target using the AWS Management Console](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-add-target-console.html>)

  * [Add a target using the CLI](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-add-target-cli.html>)

  * [Add a target using the API](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-add-target-api.html>)



