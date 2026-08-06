# Get workload access token - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/get-workload-access-token.html

---

# Get workload access token

Understanding what workload access tokens are, how to obtain them, and the security aspects of working with them is essential for building secure agent applications. This section covers the key concepts and implementation patterns you need to know.

###### Topics

  * What is a workload access token?

  * How Runtime and Gateway automatically obtain tokens

  * How to manually retrieve workload access tokens

  * Security controls for GetWorkloadAccessTokenForUserId API


## What is a workload access token?

A workload access token is an AWS-signed opaque access token that enables agents to access first-party AgentCore services, such as outbound credential providers. Runtime automatically delivers workload access tokens to agent execution instances as payload headers, eliminating the need for manual token management in most scenarios.

**Key characteristics**

  * **First-party services only** – Workload access tokens are exclusively for accessing AWS first-party AgentCore services and cannot be used for external services

  * **Automatic delivery** – Runtime and Gateway automatically provide these tokens to agents during execution

  * **Security by design** – Runtime-managed agent identities cannot retrieve workload access tokens directly, preventing token extraction and misuse

  * **User and agent identity binding** – Tokens contain both user identity and agent identity information for secure credential access


## How Runtime and Gateway automatically obtain tokens

When an agent is invoked through AgentCore Runtime or Gateway with inbound authentication, the service automatically handles workload access token generation:

  1. Runtime validates the inbound identity provider OAuth token (issuer, signature)

  2. Runtime extracts issuer and sub claims from the OAuth token representing user identity

  3. Runtime fetches the associated workload identity of the agent

  4. Runtime invokes `GetWorkloadAccessTokenForJWT` with both user identity and agent workload identity

  5. Runtime passes the workload access token to agent code as part of the invocation payload header


This automatic process ensures agents receive properly scoped tokens without manual intervention.

## How to manually retrieve workload access tokens

There are two patterns to use to retrieve the workload access token depending on how you are able to identify the end user of the agent:

### Pattern 1: JWT-based identification (recommended for production)

If the agent’s caller has a JWT issued by an identity provider for the end user, request a workload access token using `GetWorkloadAccessTokenForJWT`. When you provide a JWT, AgentCore Identity validates the token to ensure it is correctly signed and unexpired, and uses its “iss” and “sub” claims to uniquely identify the user. Credentials stored by the agent on behalf of the user are associated with this cryptographically verified identity, and future retrievals require a valid workload access token carrying the same identity.

**Use this pattern when:**

  * Your application integrates with an identity provider (Cognito, Auth0, Okta, etc.)

  * You need cryptographic proof of the end user’s identity

  * You are deploying to production


### Pattern 2: UserId-based identification

If the agent’s caller does not have a JWT identifying the end user, request a workload access token using `GetWorkloadAccessTokenForUserId` with a unique string identifying the user.

**Use this pattern when:**

  * Your application manages its own user identifiers and you need to pass customer-managed userId strings to AgentCore Identity

  * You are in a development or quickstart scenario where an IdP token is not yet available

  * Your enterprise architecture resolves user identity upstream and passes a trusted identifier to the agent workload


**Tradeoff:** The platform treats the userId as an opaque string and cannot verify it against an authenticated end-user identity. The security binding relies on the calling workload passing the correct userId and on IAM policies being scoped appropriately. See Security controls for GetWorkloadAccessTokenForUserId API for recommended controls.

### Code examples

The examples below illustrate using the AgentCore SDK to retrieve a workload access token using these two methods:

```python
from bedrock_agentcore.services.identity import IdentityClient

identity_client= IdentityClient(“us-east-1”)# Pattern 1 (recommended): Obtain a token using a JWT containing the identity of the end user.
# AgentCore Identity validates the JWT signature, issuer, and expiry.
workload_access_token= identity_client.get_workload_access_token(workload_name= “my-demo-agent”, user_token= “insert-jwt-here”)# Pattern 2: Obtain a token using a string representing the identity of the end user.
# Use this when a JWT is not available. The platform does not verify this string.
workload_access_token= identity_client.get_workload_access_token(workload_name= “my-demo-agent”, user_id= “insert-user-name-or-identifier”)
```
## Security controls for `GetWorkloadAccessTokenForUserId` API

The `GetWorkloadAccessTokenForUserId` API accepts a caller-supplied user identifier string and issues a workload access token scoped to that user-agent pair. This API is designed to support enterprise customers who need to pass customer-managed userId strings and builders who don’t have Identity Provider (IdP) tokens available during development.

###### Important

When you use `GetWorkloadAccessTokenForUserId`, the platform treats the `userId` value as an opaque string and does not verify it against an authenticated end-user identity. The security binding relies entirely on the calling workload passing the correct userId and on your IAM policies being scoped appropriately. If your application has access to a JWT identifying the end user, use `GetWorkloadAccessTokenForJWT` instead, which validates the token’s issuer, signature, and expiry before issuing a workload access token.

The `GetWorkloadAccessTokenForUserId` API implements several security controls to prevent unauthorized access:

  * **Workload identity validation** – The API verifies that the requesting identity has permission to act on behalf of the specified workload identity

  * **Service-managed identity restriction** – Runtime-managed and Gateway-managed workload identities cannot retrieve tokens directly. This prevents agents from extracting tokens for misuse

  * **IAM permission requirements** – Callers must have appropriate IAM permissions including `GetWorkloadAccessToken` , `GetWorkloadAccessTokenForUserId` , and `GetWorkloadAccessTokenForJWT`

  * **Token scoping** – Tokens are scoped to the specific user-agent pair, ensuring credentials stored under one user cannot be accessed by another

  * **User ID partitioning for multiple identity providers** – When using multiple identity providers, partition your user IDs using the pattern `provider_id+user_id` to prevent user collisions between different providers. For example, use `cognito+user123` and `auth0+user123` to distinguish users with the same identifier across different identity providers


### Recommended security controls

Because the platform cannot verify the userId string, you are responsible for ensuring the integrity of the value passed to this API. Apply the following controls:

  * **Prefer`GetWorkloadAccessTokenForJWT` when a JWT is available** – The JWT-based path validates the token’s issuer and signature, providing cryptographic proof of the user’s identity. Use `GetWorkloadAccessTokenForUserId` only when a JWT is unavailable.

  * **Derive the userId from a trusted source** – The userId value should be derived from the authenticated principal’s context (for example, IAM caller identity, session attributes, or an upstream identity resolution layer) rather than accepting arbitrary client-supplied values. This prevents an authenticated caller from impersonating another user.

  * **Restrict the IAM permission** – Only trusted principals should have the `bedrock-agentcore:GetWorkloadAccessTokenForUserId` permission. Scope this permission to specific workload identity resources. Do not grant it broadly via managed policies or wildcard resource statements.

  * **Deny`GetWorkloadAccessTokenForUserId` where it is not needed** – For workloads that always have a JWT available, explicitly deny the action in IAM policies to prevent the userId path from being used:

```json
{
   "Statement": [
      {
         "Sid": "DenyForUserIdAccess",
         "Effect": "Deny",
         "Action": "bedrock-agentcore:GetWorkloadAccessTokenForUserId",
         "Resource": "arn:aws:bedrock-agentcore:REGION:ACCOUNT_ID:workload-identity-directory/default"
      }
   ]
}
```
  * **Implement audit logging** – Log the relationship between the authenticated IAM principal and the userId value being passed. Use AWS CloudTrail to monitor `GetWorkloadAccessTokenForUserId` calls and detect unexpected userId values.


If you encounter the error "WorkloadIdentity is linked to a service and cannot retrieve an access token by the caller," this indicates the workload identity is managed by Runtime or Gateway and cannot retrieve tokens directly. This restriction helps maintain security boundaries and prevents unauthorized token access.

For additional security controls, you can implement fine-grained access policies to restrict which workload identities can access specific credential providers. For more information, see [Scope down access to credential providers by workload identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./scope-credential-provider-access.html>).

