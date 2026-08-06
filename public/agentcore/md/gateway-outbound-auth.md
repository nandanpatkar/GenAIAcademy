# Set up outbound authorization for your gateway - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-outbound-auth.html

---

# Set up outbound authorization for your gateway

Outbound authorization lets Amazon Bedrock AgentCore gateways securely access gateway targets on behalf of users that were authenticated and authorized during inbound authorization.

AgentCore Gateway supports the following types of outbound authorization:

  * **No authorization (not recommended)** – Some target types provide you the option to bypass outbound authorization. This less secure option is not recommended.

  * **IAM-based outbound authorization** – Use the [gateway service role](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-prerequisites-permissions.html#gateway-service-role-permissions>) to authenticate access to the gateway target with [AWS Signature Version 4 (Sig V4)](<https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html>).

  * **Caller IAM credentials** – The gateway uses the caller’s IAM credentials to sign requests to the target. The gateway assumes a role on behalf of the caller using the Federated Access Service (FAS) and signs the outbound request with the caller’s identity. This is useful when the target service needs to authorize based on the original caller’s identity rather than the gateway service role.

  * **OAuth** – An open authorization framework that allows a client application to access resources. You can use OAuth with a [built-in identity provider](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idps.html>) or with a custom one. For more information, see [OAuth 2.0](<https://oauth.net/2/>) . You can use the following types of OAuth authorization grants:

    * **Client credentials grant** – Machine-to-machine authentication (also known as 2-legged OAuth). The client application accesses resources on the application’s behalf, rather than on behalf of the user.

    * **Authorization code grant** – User-delegated access (also known as 3-legged OAuth). The user provides consent for the client application to access resources on behalf of the user.

    * **Token exchange grant (On-behalf-of)** – The gateway exchanges the inbound user’s access token for a new, scoped access token that targets a downstream resource. The exchanged token carries both the user’s identity and the agent’s identity, enabling downstream services to enforce fine-grained authorization at every hop without triggering additional consent flows. For more information, see [On-behalf-of token exchange](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./on-behalf-of-token-exchange.html>).

  * **Token passthrough** – The gateway passes the inbound authorization token directly to the target without modification. The target service is responsible for validating the token. This requires the gateway to use `AUTHENTICATE_ONLY` inbound authorization so that the token is validated but preserved for forwarding.

  * **API key** – Use the AgentCore service to generate an API key to authenticate access to the gateway target.


The type of outbound authorization that you can set up is dependent on the gateway target type to which you authorize access:

Target type | No authorization | Gateway service role | Caller IAM credentials | OAuth (client credentials) | OAuth (authorization code) | OAuth (token exchange) | Token passthrough | API key  
---|---|---|---|---|---|---|---|---  
API Gateway stage |  Yes |  Yes |  No |  No |  No |  No |  No |  Yes  
Lambda function |  No |  Yes |  No |  No |  No |  No |  No |  No  
MCP server |  Yes |  Yes |  No |  Yes |  Yes |  Yes |  No |  Yes  
OpenAPI schema |  Yes |  Yes |  No |  Yes |  Yes |  Yes |  No |  Yes  
Smithy schema |  No |  Yes |  No |  Yes |  No |  No |  No |  No  
AgentCore Runtime (HTTP) |  No |  Yes |  Yes |  Yes |  No |  No |  Yes |  No  
  
###### Note

If you use an integration provider template as a target, review the supported authorization types for different templates at [Built-in templates from integration providers as targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-target-integrations.html>).

Before adding a target to your gateway, you must set up authorization for it through one of the supported methods.

###### Note

You can skip this prerequisite if you plan to use the AWS Management Console or AgentCore CLI to create your gateway. If you use either of these tools, you can let AgentCore automatically create a service role for you with the necessary permissions to access the target. Each time you add a target, the necessary permissions will be automatically attached to your service role.

Select a topic to learn how to set up that type of authorization:

###### Topics

  * Set up IAM-based outbound authorization with a gateway service role

  * Set up outbound authorization with an OAuth client

  * Set up outbound authorization with an API key


## Set up IAM-based outbound authorization with a gateway service role

IAM-based outbound authorization lets you use the gateway service role’s IAM credentials to authorize with [AWS Signature Version 4 (Sig V4)](<https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html>) . This option lets the Amazon Bedrock AgentCore service authenticate to gateway targets on your gateway callers' behalf.

If you use this option, verify that the gateway service role has `bedrock-agentcore:InvokeGateway` permissions. The gateway uses the service role credentials for authentication during invocation.

**Additional configuration for MCP server and OpenAPI targets**

When you use IAM-based outbound authorization with an MCP server or OpenAPI target, you must provide additional configuration for SigV4 signing. In the `credentialProviderConfigurations` , include an `iamCredentialProvider` with the following fields:

  * **service** (required) – The AWS service name used for SigV4 signing. For example, `bedrock-agentcore` for MCP servers hosted on Amazon Bedrock AgentCore.

  * **region** (optional) – The AWS Region for SigV4 signing. If you don’t specify a Region, the gateway uses its own Region.


For Lambda, API Gateway, and Smithy targets, do not include the `iamCredentialProvider` field. These target types only support the basic `GATEWAY_IAM_ROLE` configuration with `credentialProviderType` only. For more information about specifying the credential provider configuration, see [AgentCore Gateway service role (IAM) authorization](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-building-adding-targets-authorization.html#gateway-building-adding-targets-authorization-service-role>).

### Security best practices for IAM-based outbound authorization

The gateway execution role is shared across all targets configured with `GATEWAY_IAM_ROLE`. Its permissions are the upper bound for what any authorized caller can exercise through the gateway. Follow these best practices to limit exposure:

  * **Scope the execution role to minimum permissions** – Grant only the permissions needed across all configured targets. Avoid broad `Action` or `Resource` wildcards.

  * **Use separate gateways for different trust boundaries** – If targets have different sensitivity levels or serve different workloads, deploy them behind separate gateways with distinct execution roles.

  * **Use the policy engine to restrict caller access** – On shared gateways, use the [policy engine](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./policy-getting-started.html>) to control which callers can invoke which targets, limiting the blast radius of any single caller’s permissions.


## Set up outbound authorization with an OAuth client

To set up outbound authorization with an OAuth client, you use the AgentCore Identity service and specify client credentials that you receive from creating a client in either a built-in identity provider (see [Provider setup and configuration](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idps.html>) or a custom identity provider.

**To set up outbound authorization with an OAuth client**

  1. Register your client application with a supported third-party provider.

  2. You’ll receive a client ID, client secret, and possibly other values that you’ll reference when you set up the outbound authorization.

  3. Follow one of the steps below, depending on your requirements:

     * To configure outbound authorization in the console using a built-in identity provider, follow the steps at [Add OAuth client using included provider](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-add-oauth-client-included.html>).

     * To configure outbound authorization in the console using a custom identity provider, follow the steps at [Add OAuth client using custom provider](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-add-oauth-client-custom.html>).

     * To configure outbound authorization using the API, send a [CreateOauth2CredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateOauth2CredentialProvider.html>) with one of the [AgentCore control plane endpoints](<https://docs.aws.amazon.com/general/latest/gr/bedrock_agentcore.html#bedrock_agentcore_cp>) . For examples, see Examples for setting OAuth client authorization.

###### Note

The shape of the JSON object that the `oauth2ProviderConfigInput` field maps to depends on the provider that you use and must be congruent with the `credentialProviderVendor` value that you specify. To see examples of different configurations for different credential providers, see the outbound authorization examples in your credential provider of choice at [Provider setup and configuration](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idps.html>).

  4. Take note of the generated credential ARN ( `credentialProviderArn` in the API) and the AWS Secrets Manager secret ARN ( `secretArn` in the API). You’ll use these values when you create your gateway target.

  5. (If you’re using a custom gateway service role) Attach the following identity-based policy to your gateway service role:

```json
{
"Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "GetWorkloadAccessToken",
        "Effect": "Allow",
        "Action": [
            "bedrock-agentcore:GetWorkloadAccessToken",
        ],
        "Resource": [
            "arn:aws:bedrock-agentcore:us-east-1:123456789012:workload-identity-directory/default",
            "arn:aws:bedrock-agentcore:us-east-1:123456789012:workload-identity-directory/default/workload-identity/GatewayName-*"
        ]
      },
      {
        "Sid": "GetResourceOauth2Token",
        "Effect": "Allow",
        "Action": [
            "bedrock-agentcore:GetResourceOauth2Token",
        ],
        "Resource": [
            "arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/TokenVaultId/oauth2credentialprovider/CredentialName"
        ]
      },
      {
        "Sid": "GetSecretValue",
        "Effect": "Allow",
        "Action": [
            "secretsmanager:GetSecretValue",
        ],
        "Resource": [
            "arn:aws:secretsmanager:us-east-1:123456789012:secret:SecretId"
        ]
      }
    ]
}
```
Replace the values of the following fields:

     * In the `GetWorkloadAccessToken` statement, replace the `GatewayName` in the `Resource` list with the name of your gateway.

     * In the `GetResourceOauth2Token` statement, replace the value in the `Resource` list with the ARN of the credential that you just generated.

     * In the `GetSecretValue` statement, replace the value in the `Resource` list with the ARN of the AWS secret returned in the response when you generated the credential.


### Examples for setting OAuth client authorization

The following examples show you how to set authorization through an OAuth client for your gateway target:

###### Example

AgentCore CLI
    

  1. The AgentCore CLI credential commands must be run inside an existing agentcore project. If you don’t have one yet, create a project first with `agentcore create`.

```bash
agentcore add credential \
  --name oauth-credential-provider \
  --type oauth \
  --discovery-url <DiscoveryUrl> \
  --client-id <ClientId> \
  --client-secret <ClientSecret>
agentcore deploy
```
AWS CLI
    

  1. 
```bash
aws bedrock-agentcore-control create-oauth2-credential-provider \
  --name oauth-credential-provider \
  --credential-provider-vendor CustomOAuth2 \
  --oauth2-provider-config-input '{
    "customOAuth2ProviderConfig": {
      "oauthDiscovery": {
        "discoveryUrl": "<DiscoveryUrl>"
      },
      "clientId": "<ClientId>",
      "clientSecret": "<ClientSecret>"
    }
  }'
```
 


Boto3
    

  1. 
```python
import boto3

client = boto3.client("bedrock-agentcore-control")

client.create_oauth2_credential_provider(
  name="oauth-credential-provider",
  credentialProviderVendor="CustomOAuth2",
  oauth2ProviderConfigInput={
    "oauthDiscovery": {
      "discoveryUrl": "<DiscoveryUrl>"
    },
    "clientId": "<ClientId>",
    "clientSecret": "<ClientSecret>"
  }
)
```
 


## Set up outbound authorization with an API key

To set up outbound authorization with an API key, you use the AgentCore Identity service and specify an API key that you receive from a supported identity provider.

**To set up outbound authorization with an OAuth client**

  1. Register your client application with a supported third-party provider.

  2. Set up an API key for the provider’s service. Take note of the following values, which you’ll specify when you add the gateway target:

     * **Credential location** – Whether the API key should be placed in the header or as a query parameter.

     * **Credential prefix** – The prefix for the credential (ex. Bearer).

  3. Follow one of the steps below, depending on your requirements:

     * To create an API key in the AgentCore console, follow the steps at [Add API key](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-add-api-key.html>) and specify the value of the API key.

     * To create an API key using the AgentCore API, send a [CreateApiKeyCredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateApiKeyCredentialProvider.html>) request with one of the [AgentCore control plane endpoints](<https://docs.aws.amazon.com/general/latest/gr/bedrock_agentcore.html#bedrock_agentcore_cp>) and specify the value of the API key in the `apiKey` field. For examples, see Examples for setting an API key.

  4. Take note of the following values, which you’ll specify when you add the gateway target:

     * **Credential provider ARN** – An Amazon Resource Name (ARN) generated for the credential provider.

     * **Name** – The name you gave to the API key.

     * **Secret ARN** – An AWS Secrets Manager secret ARN generated for the API key.

  5. (If you’re using a custom gateway service role) Attach the following identity-based policy to your gateway service role:

```json
{
"Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "GetWorkloadAccessToken",
        "Effect": "Allow",
        "Action": [
            "bedrock-agentcore:GetWorkloadAccessToken",
        ],
        "Resource": [
            "arn:aws:bedrock-agentcore:us-east-1:123456789012:workload-identity-directory/default",
            "arn:aws:bedrock-agentcore:us-east-1:123456789012:workload-identity-directory/default/workload-identity/GatewayName-*"
        ]
      },
      {
        "Sid": "GetResourceApiKey",
        "Effect": "Allow",
        "Action": [
            "bedrock-agentcore:GetResourceApiKey",
        ],
        "Resource": [
            "arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/TokenVaultId/apikeycredentialprovider/Name"
        ]
      },
      {
        "Sid": "GetSecretValue",
        "Effect": "Allow",
        "Action": [
            "secretsmanager:GetSecretValue",
        ],
        "Resource": [
            "arn:aws:secretsmanager:us-east-1:123456789012:secret:SecretId"
        ]
      }
    ]
}
```
Replace the values of the following fields:

     * In the `GetWorkloadAccessToken` statement, replace the `GatewayName` in the `Resource` list with the name of your gateway.

     * In the `GetResourceApiKey` statement, replace the value in the `Resource` list with the ARN of the credential that you just generated.

     * In the `GetSecretValue` statement, replace the value in the `Resource` list with the ARN of the AWS secret returned in the response when you generated the credential.


### Examples for setting an API key

The following examples show you how to set an API key for your gateway target:

###### Example

AgentCore CLI
    

  1. The AgentCore CLI credential commands must be run inside an existing agentcore project. If you don’t have one yet, create a project first with `agentcore create`.

```bash
agentcore add credential \
  --name api-key-credential-provider \
  --type api-key \
  --api-key <API_KEY_VALUE>
agentcore deploy
```
AWS CLI
    

  1. 
```bash
aws bedrock-agentcore-control create-api-key-credential-provider \
  --name api-key-credential-provider \
  --api-key <API_KEY_VALUE>
```
 


Boto3
    

  1. 
```python
import boto3

client = boto3.client("bedrock-agentcore-control")

client.create_api_key_credential_provider(
  name="api-key-credential-provider",
  apiKey="<API_KEY_VALUE>"
)
```
 



