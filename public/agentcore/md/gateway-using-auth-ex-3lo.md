# Example: Authentication with an authorization code grant when invoking a gateway - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-using-auth-ex-3lo.html

---

# Example: Authentication with an authorization code grant when invoking a gateway

If you set up your gateway target with an authorization code grant (for more information, see [OAuth authorization](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-building-adding-targets-authorization.html#gateway-building-adding-targets-authorization-oauth>) ), the `defaultReturnUrl` that you specified when creating the gateway will be the link that the user’s browser redirects to after authentication.

You can use the `_meta` field in the `params` object of the request body to modify default configurations. With 3LO authentication, you map the `_meta` field to the following object:

```json
{
    "aws.bedrock-agentcore.gateway/credentialProviderConfiguration": {
        "oauthcredentialProvider": {
            "returnUrl": "string",
            "forceAuthentication": bool
        }
    }
}
```
You can do the following:

  * To override the default return URL with a different one, specify a new `returnUrl`.

  * To remove the previous authentication from the token vault and return a new authorization URL when the request is made, set the `forceAuthentication` value to `true`.


For example, the following request would call the `LinkedIn3LO___gateUserInfo` tool through the gateway target, force the user to authenticate with a new authorization URL, and redirect the user to `https://your-public-domain.com/callback` after authentication:

```json
{
  "jsonrpc": "2.0",
  "id": 24,
  "method": "tools/call",
  "params": {
    "name": "LinkedIn3LO___getUserInfo",
    "arguments": {},
    "_meta": {
        "aws.bedrock-agentcore.gateway/credentialProviderConfiguration": {
            "oauthCredentialProvider": {
                "returnUrl": "https://your-public-domain.com/callback",
                "forceAuthentication": true
            }
        }
    }
  }
}
```
