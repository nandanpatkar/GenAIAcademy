# Obtain credentials - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/obtain-credentials.html

---

# Obtain credentials

AgentCore Identity uses a workload access token to authorize agent access to credentials stored in the vault, and this token contains both the identity of the agent and the identity of the end user on whose behalf the agent is working. AgentCore Runtime will automatically provide a token when invoking an agent that it is hosting. Agents hosted on other systems can retrieve their agent token using the AgentCore SDK.

###### Topics

  * [Get workload access token](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./get-workload-access-token.html>)

  * [Obtain OAuth 2.0 access token](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-authentication.html>)

  * [OAuth 2.0 authorization URL session binding](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./oauth2-authorization-url-session-binding.html>)

  * [Scope down access to credential providers by workload identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./scope-credential-provider-access.html>)

  * [Obtain API key](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./obtain-api-key.html>)



