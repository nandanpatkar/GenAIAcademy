# Obtain OAuth 2.0 access token - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-authentication.html

---

# Obtain OAuth 2.0 access token

AgentCore Identity enables developers to obtain OAuth tokens for either user-delegated access or machine-to-machine authentication based on the configured OAuth 2.0 credential providers. The service will orchestrate the authentication process between the user or application to the downstream authorization server, and it will retrieve and store the resulting token. Once the token is available in the AgentCore Identity vault, authorized agents can retrieve it and use it to authorize calls to resource servers. For example, the sample code below will retrieve a token to interact with Google Drive on behalf of an end user. For more information, see [Integrate with Google Drive using OAuth2](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-getting-started-google.html>) for the complete example.

```bash
# Injects Google Access Token
@requires_access_token(
    # Uses the same credential provider name created above
    provider_name= "google-provider",
    # Requires Google OAuth2 scope to access Google Drive
    scopes= ["https://www.googleapis.com/auth/drive.metadata.readonly"],
    # Sets to OAuth 2.0 Authorization Code flow
    auth_flow= "USER_FEDERATION",
    # Prints authorization URL to console
    on_auth_url= lambda x: print("\nPlease copy and paste this URL in your browser:\n" + x),
    # If false, caches obtained access token
    force_authentication= False,
    callback_url='insert_oauth2_callback_url_for_session_binding',
)
async def write_to_google_drive(*, access_token: str):
    # Use the token to call Google Drive
    pass

# To invoke:
# asyncio.run(write_to_google_drive())
```
The process is similar to obtain a token for machine-to-machine calls, as shown in the following example:

```python
import asyncio
from bedrock_agentcore.identity.auth import requires_access_token, requires_api_key

@requires_access_token(
    provider_name= "my-api-key-provider", # replace with your own credential provider name
    scopes= [],
    auth_flow= 'M2M',
)
async def need_token_2LO_async(*, access_token: str):
    # Use the access token
    pass

# To invoke:
# asyncio.run(need_token_2LO_async())
```
###### Topics

  * Automatic refresh token storage and usage

  * Streaming authorization URLs to application callers

  * Resource indicators in AgentCore OAuth2 flows


## Automatic refresh token storage and usage

AgentCore automatically stores and uses refresh tokens when available from OAuth2 providers, reducing the frequency of user reauthorization prompts. When users initially grant consent through a standard OAuth2 authorization code flow, the system stores both access tokens and refresh tokens (if provided) in the secure token vault. This enables agents to obtain fresh access tokens automatically when the original tokens expire, improving user experience by minimizing repeated consent requests.

###### Important

Access tokens returned by AgentCore are not guaranteed to be valid. Tokens can be revoked by customers on the federated provider side, which AgentCore cannot detect. If a token is invalid, use `forceAuthentication: true` to force a new authentication flow and obtain a valid access token.

Refresh tokens typically have longer lifespans than access tokens, with a default validity period of approximately 30 days compared to the shorter lifespan of access tokens (often 1-2 hours). When an access token expires, AgentCore automatically uses the stored refresh token to request a new access token from the provider. **If a valid refresh token is stored, AgentCore skips the user federation flow and directly returns a new access token** . If the refresh token is also expired or invalid, the system falls back to prompting the user for full reauthorization.

This feature requires no configuration within AgentCore - it operates automatically when refresh tokens are present in the OAuth2 provider’s token response. However, you must configure your OAuth2 provider to include refresh tokens in the authorization flow. The specific configuration depends on your provider:

Provider | Configuration Required  
---|---  
**Google** |  Include `access_type=offline` in `customParameters` when calling `GetResourceOauth2Token` 
```text
"customParameters": { "access_type": "offline" }
```
   
**Microsoft** |  Include `offline_access` in `scopes` parameter when calling `GetResourceOauth2Token` 
```text
"scopes": ["openid", "profile", "offline_access"]
```
   
**Salesforce** |  Include `refresh_token` in `scopes` parameter when calling `GetResourceOauth2Token` 
```text
"scopes": ["api", "refresh_token"]
```
   
**Atlassian** |  Include `offline_access` in `scopes` parameter when calling `GetResourceOauth2Token` 
```text
"scopes": ["read:jira-user", "offline_access"]
```
   
**GitHub** |  No extra AgentCore configuration required. Enable User-to-server token expiration feature in your GitHub app settings. Refresh tokens are stored automatically when this feature is enabled.  
**Slack** |  No extra AgentCore configuration required. Enable "token rotation" feature in your Slack app settings. Refresh tokens are returned automatically when this feature is enabled.  
**LinkedIn** |  No extra AgentCore configuration required. Enable refresh token settings in your LinkedIn app configuration.  
**Other providers** |  Some providers require configuration in their provider settings rather than API parameters. Consult your provider’s documentation for refresh token requirements.  
  
If your provider supports refresh tokens and is properly configured, AgentCore will automatically store and manage them without additional setup. To clear stored refresh tokens and force users to reauthenticate, set `forceAuthentication=true` when calling GetResourceOauth2Token. This clears the refresh token and forces a complete federation flow. For information about configuring OAuth2 providers, see [Provider setup and configuration](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idps.html>).

## Streaming authorization URLs to application callers

For three-legged OAuth (3LO) flows, your agent needs to provide the authorization URL to the calling application so users can complete the consent flow. While the examples above show printing the URL to the console, production applications require streaming the URL back to the caller through your application’s response mechanism.

**Common implementation patterns**

**Streaming response pattern** – For applications that support streaming responses, you can send the authorization URL as part of the response stream:

```python
import asyncio
from bedrock_agentcore.identity.auth import requires_access_token

@requires_access_token(
    provider_name="google-provider",
    scopes=["https://www.googleapis.com/auth/drive.metadata.readonly"],
    auth_flow="USER_FEDERATION",
    # Stream URL back to caller instead of printing
    on_auth_url=lambda url: stream_to_caller({
        "type": "authorization_required",
        "authorization_url": url,
        "message": "Please visit this URL to authorize access"
    }),
    force_authentication=False,
    callback_url='insert_oauth2_callback_url_for_session_binding'
)
async def agent_with_streaming_auth(*, access_token: str):
    # Agent logic continues after user completes authorization
    return {"status": "success", "token_received": True}

def stream_to_caller(data):
    # Implementation depends on your streaming mechanism
    # Examples: WebSocket, Server-Sent Events, HTTP chunked response
    response_stream.send(json.dumps(data))
```
**Callback pattern** – For applications using callbacks or webhooks, store the authorization URL and notify the caller:

```python
import asyncio
from bedrock_agentcore.identity.auth import requires_access_token

@requires_access_token(
    provider_name="google-provider",
    scopes=["https://www.googleapis.com/auth/drive.metadata.readonly"],
    auth_flow="USER_FEDERATION",
    # Store URL and trigger callback
    on_auth_url=lambda url: handle_auth_callback(url),
    force_authentication=False,
    callback_url='insert_oauth2_callback_url_for_session_binding'
)
async def agent_with_callback_auth(*, access_token: str):
    return {"status": "success", "data": "processed"}

def handle_auth_callback(authorization_url):
    # Store the URL associated with the request
    auth_store.save(request_id, {
        "authorization_url": authorization_url,
        "status": "pending_authorization"
    })

    # Notify the calling application
    callback_service.notify(callback_url, {
        "request_id": request_id,
        "authorization_url": authorization_url,
        "action_required": "user_authorization"
    })
```
**Polling pattern** – For applications that prefer polling, store the authorization URL in a retrievable location:

```python
import asyncio
from bedrock_agentcore.identity.auth import requires_access_token

@requires_access_token(
    provider_name="google-provider",
    scopes=["https://www.googleapis.com/auth/drive.metadata.readonly"],
    auth_flow="USER_FEDERATION",
    # Store URL for polling retrieval
    on_auth_url=lambda url: store_auth_url_for_polling(url),
    force_authentication=False,
    callback_url='insert_oauth2_callback_url_for_session_binding'
)
async def agent_with_polling_auth(*, access_token: str):
    return {"status": "success", "data": "processed"}

def store_auth_url_for_polling(authorization_url):
    # Store in database, cache, or session store
    session_store.set(f"auth_url:{session_id}", {
        "authorization_url": authorization_url,
        "created_at": datetime.utcnow(),
        "status": "pending"
    }, ttl=300)  # 5 minute expiration
```
Choose the pattern that best fits your application architecture. Streaming responses provide the best user experience for real-time applications, while callback and polling patterns work well for asynchronous or batch processing scenarios.

## Resource indicators in AgentCore OAuth2 flows

Resource indicators provide a standardized way to specify which resource server should accept an OAuth2 access token. AgentCore uses Cognito as its authentication provider, which supports RFC 8707-compliant resource indicators that allow you to specify the intended resource server during token requests. To use resource indicators, you must first configure the authorization server to recognize specific resource servers using Cognito’s CreateResourceServer API. Once configured, when you specify a resource indicator in your token request, Cognito includes the corresponding resource server identifier in the aud claim of the resulting token, enabling the resource server to verify that the token is intended for its specific use. This provides several important benefits: resource servers can validate that tokens are specifically intended for them (principle of least privilege), improved auditability by clearly identifying which resource server each token targets, and reduced risk of token misuse across different services within your application environment.

Through Cognito’s [RFC 8707](<https://www.rfc-editor.org/rfc/rfc8707.html>) implementation, AgentCore enables clients to specify a resource server directly in authorization and token requests, overriding the default audience parameter. In Cognito, the 'resource indicator' referred to in the RFC corresponds to the [ResourceServer’s](<https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_CreateResourceServer.html>) 'identifier' value. Resource indicators are particularly important for Model Context Protocol (MCP) implementations, where they help mitigate specific security risks outlined in the MCP authorization specification. The resource indicator corresponds to the RFC 9728 resource parameter, ensuring proper token scoping for MCP server interactions. Note that the current implementation supports single-resource binding, meaning you can specify one resource server per token request.

Use resource indicators when your agents need to access resource servers with specific security requirements, or when you need fine-grained control over token audience validation. Resource indicators are particularly useful for multi-tenant applications where tokens should be restricted to specific customer resources.

