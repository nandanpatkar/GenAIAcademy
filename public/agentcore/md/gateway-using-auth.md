# Authorize and authenticate to an AgentCore gateway and gateway target - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-using-auth.html

---

# Authorize and authenticate to an AgentCore gateway and gateway target

To invoke your gateway and gateway target, you’ll need to make sure that the following credentials that you set up while fulfilling the [prerequisites](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-prerequisites.html>) are recognized during gateway invocation:

  * [Inbound authorization](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-inbound-auth.html>) – Authorization and authentication to the gateway.

  * [Outbound authorization](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-outbound-auth.html>) – Authorization and authentication to the gateway target.


To learn how to obtain and configure credentials, review the provider documentation for the methods that you choose.

The following sectiions provide examples of obtaining and configuring credentials for different use cases.

###### Topics

  * [Example: Authorization for the default gateway and target created by the AgentCore CLI](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-using-auth-ex-starter.html>)

  * [Example: Authentication with an authorization code grant when invoking a gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-using-auth-ex-3lo.html>)



