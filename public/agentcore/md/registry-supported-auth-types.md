# Supported Inbound Authorization types - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-supported-auth-types.html

---

# Supported Inbound Authorization types

###### Upcoming namespace migration

AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry, you must update your endpoints, IAM policies, SDK clients, CLI scripts, and registry data. For more information about migrating from public preview, see [Comprehensive registry migration guide](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-faq.html>).

Inbound authorization allows registry administrators to control which users can search for records in the registry (via AWS CLI, SDK, console, or MCP server). Administrators can configure inbound authorization using IAM or JWT.

## IAM-based authorization

IAM-based authorization uses the caller’s AWS IAM credentials (SigV4 signing) for authorization. Use this option if your consumers already have AWS IAM access.

### To set up IAM-based authorization

  1. Create or use an existing IAM identity for your registry consumers.

  2. Create an identity-based IAM policy with the following permissions:

     1. `bedrock-agentcore:SearchRegistryRecords`

     2. `bedrock-agentcore:InvokeRegistryMcp`

     3. You can optionally scope the IAM Permissions to the specific Registry Resource if you want to limit which registry a particular consumer can search in

  3. Attach the policy to the consumer identity (IAM User or Role).


### Example policy

```json
{
"Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "bedrock-agentcore:SearchRegistryRecords",
      "bedrock-agentcore:InvokeRegistryMcp"
    ],
    "Resource": "arn:aws:bedrock-agentcore:us-east-1:123456789012:registry/<YOUR_REGISTRY_ID>"
  }]
}
```
## JWT-based authorization

JSON Web Token (JWT) authorization lets consumers authorize using tokens from your organization’s identity provider — such as Amazon Cognito, Okta, Microsoft Azure AD, Auth0, or any OAuth 2.0-compatible provider. This is useful when you want to make the registry accessible to a broad set of users through existing corporate credentials, without provisioning individual IAM access.

### Set up a default JWT with Amazon Cognito

When you create a registry through the console and select JWT authorization, you can choose the quick create option. AWS Agent Registry creates an Amazon Cognito user pool and configures the JWT authorization automatically. No additional setup is required.

### Set up a JWT manually with your own identity provider

If you have an existing identity provider, configure JWT authorization manually. You need:

  * **Discovery URL** (required) — The OpenID Connect discovery URL from your identity provider (for example, `https://cognito-idp.us-east-1.amazonaws.com/YOUR_POOL_ID/.well-known/openid-configuration` ). AWS Agent Registry uses this URL to fetch the login, token, and verification settings.


You must also configure at least one of the following JWT authorization rules:

  * **Allowed audiences** — Permitted values for the `aud` claim. An audience claim specifies which resource server the token is intended for, preventing token reuse across different APIs.

  * **Allowed clients** — Permitted values for the `client_id` claim. A client ID is a unique identifier for the application requesting access tokens.

  * **Allowed scopes** — Required permission scopes. At least one scope in the incoming token must match one of the configured values.

  * **Custom claims** — Rules that match specific claims in the incoming token against predefined values. For each rule, specify the claim name, value type (STRING or STRING_ARRAY), and the required match value.


If you configure more than one authorization rule, AWS Agent Registry verifies all of them.

## Changing Authorization type

You cannot change authorization Type after a Registry has been created. Additionally, for registries setup with JWT based authorization, the Discovery URL cannot be edited after the Registry has been created.

## Authorization scope

The authorization type you configure only affects the data plane APIs — SearchRegistryRecords and InvokeRegistryMcp. All control plane APIs (CreateRegistry, CreateRegistryRecord, UpdateRegistryRecordStatus, and others) always require IAM authorization, regardless of the registry’s authorization setting.

