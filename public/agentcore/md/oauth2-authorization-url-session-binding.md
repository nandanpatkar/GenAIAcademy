# OAuth 2.0 authorization URL session binding - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/oauth2-authorization-url-session-binding.html

---

# OAuth 2.0 authorization URL session binding

AgentCore Identity provides OAuth 2.0 access token retrievals for your agent applications to access third-party application vendors or resources protected by identity providers / authorization servers. If an application or a resource requires a user to authorize explicitly with an OAuth authorization code flow, AgentCore Identity generates an authorization URL for the user to navigate to and consent access. Then, upon user giving consent, AgentCore Identity fetches the access token from the application or resource on behalf of users, and stores it in the AgentCore Identity Token Vault.

However, since a user may accidentally send the authorization URL to another user and gain access to that user’s application or resource, your application must verify that the user who initiates an authorization request is still the same as the user who has granted consent to the application or resource. To do that, you need to register a publicly available HTTPS application endpoint with AgentCore Identity that handles user verification.

## How session binding works

The following flow diagram and corresponding steps show the OAuth 2.0 authorization URL session binding process:

![OAuth 2.0 authorization URL session binding flow diagram](/agentcore/images/identity-session-binding.png)

  1. **Invoke agent** – Your agent code invokes `GetResourceOauth2Token` API to retrieve an authorization URL, when an originating agent user wants to access some application or resource that he/she owns.

  2. **Generate authorization URL** – AgentCore Identity generates an authorization URL and session URI for the user to navigate to and consent access.

  3. **Authorize and obtain access token** – The user navigates to the authorization URL and grants consent for your agent to access his/her resource. After that, AgentCore Identity redirects the user’s browser to your HTTPS application endpoint with information containing the originating user of the authorization request. At this point, your HTTPS application endpoint determines if the originating agent user is still the same as the currently logged in user of your application. If they match, your application endpoint invokes `CompleteResourceTokenAuth` so that AgentCore Identity can fetch and store the access token.

  4. **Re-invoke agent to obtain access token** – Once the application returns a valid response, your agent application will be able to retrieve the OAuth2.0 access tokens that were originally requested for the user. If the users do not match, your application simply does nothing or logs the attempt.


By allowing your application endpoint to verify the user identity, AgentCore Identity allows your agent application to ensure that it is always the same user who initiated the authorization request and the one who consented access.

## Implementation details

The following steps walk you through setting up the workload identity, the OAuth 2.0 credential provider, and the OAuth 2.0 application client from the resource provider for retrieving an OAuth 2.0 access token for your agent application.

You can refer to sample code as an example of a working application: [OAuth 2.0 callback server implementation](<https://github.com/awslabs/amazon-bedrock-agentcore-samples/blob/main/01-features/05-authenticate-and-authorize/02-outbound-auth/02-outbound-auth-3lo/oauth2_callback_server.py>).

###### Important

When you are using the AgentCore CLI with `agentcore dev` in a local environment, to simplify your local development and testing, the CLI hosts the callback endpoint and calls the `CompleteResourceTokenAuth` API on your behalf to verify the user session to get OAuth 2.0 access tokens so you can skip steps 1, 2 and 4 in the following setup. However, when deploying your agent code to AgentCore Runtime, your web application that connects to the agent runtime must host a publicly accessible HTTPS callback endpoint itself, the callback endpoint must be registered against the workload identity as an `AllowedResourceOAuth2ReturnUrl` by calling `UpdateWorkloadIdentity` using the agent ID provided by AgentCore Runtime, and then call the `CompleteResourceTokenAuth` API after verifying the current user’s browser session to secure your OAuth 2.0 authorization flows.

**To implement OAuth 2.0 authorization URL session binding**

  1. **Create an application URL** – For your user-facing browser application, create and host a new URL that is accessible from the user browser and can accept requests from browser redirects. This page should either redirect to an application page that your user can continue with their agent session OR render some basic web page instructing your users to return their currently active agent session. In later parts of the implementation, this page is used for validation of the current user’s active session, so this page should also be able to access and maintain your application user session data.

As an example, your application may have its users interact with an agent at a primary application page like `https://myagentapp.com/assistant` . You’ll want to expose a new URL like `https://myagentapp.com/callback` that for now will redirect to the primary application page. The actual code logic in your `/callback` endpoint will be updated later when following this guide.

  2. **Update workload identity with application URL** – (Can be skipped if testing locally via AgentCore CLI) Once you have created and hosted an application URL for AgentCore Identity to redirect to, update your workload identity so that the application URL is registered as an `AllowedResourceOauth2ReturnUrl` . Make sure that the IAM credentials used have permissions to call `CreateWorkloadIdentity` or `UpdateWorkloadIdentity` depending on whether you’re creating a new workload identity or updating an existing one.

###### Note

For workload identities created on your behalf by AgentCore Runtime or Gateway, the workload identity name will correspond to the runtime ID or gateway ID that is issued by the services.

Sample `UpdateWorkloadIdentity` API call:

```bash
aws bedrock-agentcore-control update-workload-identity --name GoogleCalendarAgent \
--allowed-resource-oauth2-return-urls https://myagentapp.com/callback
```
  3. **Create OAuth 2.0 credential provider in AgentCore Identity** – To register the OAuth 2.0 credential provider fully, you need permissions to call `CreateOauth2CredentialProvider` and `UpdateOauth2CredentialProvider` . Follow these steps:

     * Call `CreateOauth2CredentialProvider` with placeholders for client ID and client secret.

     * API response will contain an OAuth callback (redirect) URL like: `https://bedrock-agentcore.amazonaws.com/identities/callback/123-456-7890`

Record this value as it’s specific for each provider that is created and will be needed later by the OAuth 2.0 resource provider.

     * Go to your resource provider (for example, Google or GitHub) and create an OAuth 2.0 application client. Provide the callback URL issued by the service from the `CreateOauth2CredentialProvider` call to the resource provider as an allowed OAuth 2.0 callback URL.

     * Once the OAuth 2.0 application client has been created, record the client ID and client secret assigned to your app client as you need to update the OAuth 2.0 Credential Provider with these values.

     * Call `UpdateOauth2CredentialProvider` and provide the client ID and client secret provided by the resource provider, replacing the placeholder values that were provided when creating the credential provider.

  4. **Add code handler for calling CompleteResourceTokenAuth** – Once you have created your OAuth 2.0 credential provider, add code and the IAM permissions to call the `CompleteResourceTokenAuth` API in your application URL handler. When calling the `CompleteResourceTokenAuth` API, your application must present the original inbound identity provider OAuth token or `user_id` String that was used to generate the workload access token to represent the user and the agent application involved in the OAuth 2.0 authorization flow. This information should be fetched from the active application session on the user’s browser (typically through a browser cookie or in browser local storage) and should NOT be pulled from any remote session cache.

Additionally, each authorization URL that gets generated by AgentCore Identity is uniquely identified with its own session URI. This session URI must also be presented alongside the user identifier to bind the session with the intended user.

###### Important

Prior to your application calling the `CompleteResourceTokenAuth` API, your application must verify that the current user has an active, valid session with your application. By doing so your application can associate the intended user with the Authorization session. Furthermore, if you have a backend service that your application depends on, you can move the code that calls `CompleteResourceTokenAuth` API to your backend, and have your application forward the inbound identity provider OAuth token or `user_id` to your backend.

Sample application code:

```python
def _handle_3lo_callback(self, request: Request) -> JSONResponse:
    session_id = request.query_params.get("session_id")

    if not session_id:
        console.print("Missing session_id in OAuth2 3LO callback")
        return JSONResponse(status_code=400, content={"message": "missing session_id query parameter"})

    session_details = validate_session_cookies(request.cookies.get('my-application-cookie'))

    user_id = None
    if oauth2_config:
        user_id = session_details.get(USER_ID)

    if not user_id:
        console.print(f"Missing {USER_ID} in session_details")
        return JSONResponse(status_code=500, content={"message": "Internal Server Error"})

    console.print(f"Handling 3LO callback for workload_user_id={user_id} | session_id={session_id}", soft_wrap=True)

    region = agent_config.aws.region
    if not region:
        console.print("AWS Region not configured")
        return JSONResponse(status_code=500, content={"message": "Internal Server Error"})

    identity_client = IdentityClient(region)
    identity_client.complete_resource_token_auth(
        session_uri=session_id, user_identifier=UserIdIdentifier(user_id=user_id)
    )

    return JSONResponse(status_code=200, content={"message": "OAuth2 3LO flow completed successfully"})
```
  5. **Test** – Once you have completed the setup, you are ready to test the integration. Start by calling `GetResourceOauth2Token` and in your browser go to the Authorization URL that is returned. After completing the authorization at the OAuth 2.0 resource provider, you should see the browser redirect back to your application URL and invoke the `CompleteResourceTokenAuth` API. Once the application returns a valid response, your agent application will be able to retrieve the OAuth 2.0 access tokens that were originally requested for the user. These tokens can be fetched by calling the `GetResourceOauth2Token` API.


## Additional considerations

When implementing OAuth 2.0 authorization URL session binding, keep the following considerations in mind:

  * Each authorization URL and its corresponding session identifier are only valid for 10 minutes.

  * To secure your application callback endpoint against CSRF attacks, we highly recommend that you generate an opaque state to include in your API call to `GetResourceOAuth2Token` . Your application should be able to parse this value to ensure it’s serving requests that were initiated by your agent application.



