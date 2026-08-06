# Authenticate and authorize with Inbound Auth and Outbound Auth - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-oauth.html

---

# Authenticate and authorize with Inbound Auth and Outbound Auth

This section shows you how to implement authentication and authorization for your agent runtime using OAuth and JWT bearer tokens with [AgentCore Identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity.html>) . You’ll learn how to set up Cognito user pools, configure your agent runtime for JWT authentication (Inbound Auth), and implement OAuth-based access to third-party resources (outbound Auth).

For a complete example, see [https://github.com/awslabs/amazon-bedrock-agentcore-samples/](<https://github.com/awslabs/amazon-bedrock-agentcore-samples/>).

For information about using OAuth with an MCP server, see [Deploy MCP servers in AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-mcp.html>).

Amazon Bedrock AgentCore runtime provides two authentication mechanisms for hosted agents:

**IAM SigV4 Authentication**
    

The default authentication and authorization mechanism that works automatically without additional configuration, similar to other AWS APIs.

**X-Amzn-Bedrock-AgentCore-Runtime-User-Id Header**

If your solution requires the hosted agent to retrieve OAuth tokens on behalf of end users (using Authorization Code Grant), you can specify the user identifier by including the `X-Amzn-Bedrock-AgentCore-Runtime-User-Id` header in your requests. This header uses the `GetWorkloadAccessTokenForUserId` path internally.

###### Note

Invoking InvokeAgentRuntime with the `X-Amzn-Bedrock-AgentCore-Runtime-User-Id header` will require a new IAM action: `bedrock-agentcore:InvokeAgentRuntimeForUser` , in addition to the existing `bedrock-agentcore:InvokeAgentRuntime` action.

**When to use this header versus JWT Bearer Token authentication**

This header is designed for the following use cases:

  * **Enterprise customers with customer-managed user identifiers** — Organizations that maintain their own user identity strings and need to pass them through to AgentCore Identity for credential binding.

  * **Development and quickstart scenarios** — Builders who don’t yet have an IdP token available and need a fast path to test user-scoped credential flows.

For production deployments where you have an identity provider configured, use JWT Bearer Token authentication instead. The JWT path (`GetWorkloadAccessTokenForJWT`) validates the token’s issuer, signature, and expiry, providing cryptographic proof of the user’s identity. The `X-Amzn-Bedrock-AgentCore-Runtime-User-Id` header path does not verify the userId against an authenticated end-user identity — it relies on the calling workload to pass the correct value and on your IAM policies to restrict who can supply it.

**Security Best Practices for X-Amzn-Bedrock-AgentCore-Runtime-User-Id Header**

###### Tip

For a consolidated view of all Runtime security recommendations, see [Security best practices for AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-security-best-practices.html>).

Because AgentCore treats the header value as an opaque identifier without verifying it against an authenticated identity, you must apply the following controls to maintain the security boundary:

  * **Restrict the IAM permission** — Only trusted principals should have the `bedrock-agentcore:InvokeAgentRuntimeForUser` permission. Scope this permission to specific runtime resources using IAM resource conditions. Do not grant it broadly via managed policies or wildcard resource statements.

  * **Derive user-id from the authenticated principal** — The user-id value should be derived from the authenticated principal’s context (for example, IAM caller identity or user token claims) rather than accepting arbitrary client-supplied values. This prevents an authenticated user from impersonating another user by manually specifying a different `user-id` .

  * **Implement audit logging** — Log the relationship between the authenticated IAM principal (from SigV4 context) and the `user-id` value being passed. Use AWS CloudTrail to monitor `InvokeAgentRuntime` calls that include the `runtimeUserId` parameter.

  * **Deny the header in untrusted contexts** — For runtimes where user-id delegation is not needed, explicitly deny the `bedrock-agentcore:InvokeAgentRuntimeForUser` action in IAM policies to prevent the header from being accepted:

```json
{
   "Statement": [
      {
         "Sid": "DenyUserIdDelegation",
         "Effect": "Deny",
         "Action": "bedrock-agentcore:InvokeAgentRuntimeForUser",
         "Resource": "arn:aws:bedrock-agentcore:REGION:ACCOUNT_ID:runtime/*"
      }
   ]
}
```
**JWT Bearer Token Authentication**
    

You can configure your agent runtime to accept JWT bearer tokens by providing authorizer configuration during agent creation.

This configuration includes:

  * Discovery URL - A string that must match the pattern `^.+/\.well-known/openid-configuration$` for OpenID Connect discovery URLs

  * Allowed audiences - A list of permitted audiences that will be validated against the aud claim in the JWT token

  * Allowed clients - A list of permitted client identifiers that will be validated against the client_id claim in the JWT token

  * Allowed scopes - A list of permitted scopes that will be validated against the scope claim in the JWT token. The `allowedScopes` authorization field will be configured as a list of strings.

  * Required custom claims - A list of required claims that will be validated against the claim name and value contained in the incoming JWT token. For details on configuring the authorizer, see [Configure inbound JWT authorizer](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./inbound-jwt-authorizer.html>)


###### Note

An AgentCore Runtime can support either IAM SigV4 or JWT Bearer Token based inbound auth, but not both simultaneously. You can always create different versions of your AgentCore Runtime and configure them for different inbound authorization types. When you create a runtime with Amazon Bedrock AgentCore, a Workload Identity is created automatically for your runtime with AgentCore Identity service.

###### Topics

  * Restrict IAM (SigV4) inbound invocation to your gateway

  * JWT inbound authorization and OAuth outbound access sample

  * Prerequisites

  * Step 1: Create your agent project

  * Step 2: Set up AWS Cognito user pool and add a user

  * Step 3 (Optional): Front your runtime with an AgentCore Gateway

  * Step 4: Deploy your agent

  * Step 5: Use bearer token to invoke your agent

  * OAuth Error Responses

  * Step 6: Set up your agent to access tools using OAuth

  * Step 7: (Optional) Propagate a JWT token to AgentCore Runtime

  * Troubleshooting


## Restrict IAM (SigV4) inbound invocation to your gateway

You can front your AgentCore Runtime with an AgentCore Gateway so that the gateway becomes the single, governed entry point to the runtime — giving you policy-based authorization, Amazon Bedrock Guardrails, request and response interceptors, and unified observability, all applied outside the agent’s own environment. For the full rationale and how to set this up, see [Front your runtime with an AgentCore Gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-security-best-practices.html#security-bp-front-with-gateway>).

But this is only useful if callers can’t reach the runtime directly bypassing the gateway. If your runtime uses the default IAM (SigV4) inbound authorization, you can restrict invocation to the gateway so that traffic reaches the runtime only through it. To achieve this, attach a resource-based policy to the runtime that restricts invocation to your gateway’s execution role. The gateway assumes its service role to sign requests to the runtime, so the gateway role is the principal that invokes the runtime. Allow that role, and add an explicit `Deny` for every other principal so that no other identity can invoke the runtime even with a permissive identity-based policy. For more information about resource-based policies on runtimes, see [Resource-based policies for Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./resource-based-policies.html>).

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowOnlyGatewayRole",
            "Effect": "Allow",
            "Principal": { "AWS": "arn:aws:iam::111122223333:role/MyGatewayExecutionRole" },
            "Action": "bedrock-agentcore:InvokeAgentRuntime",
            "Resource": "arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/RUNTIME_ID"
        },
        {
            "Sid": "DenyOtherPrincipals",
            "Effect": "Deny",
            "Principal": { "AWS": "*" },
            "Action": "bedrock-agentcore:InvokeAgentRuntime",
            "Resource": "arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/RUNTIME_ID",
            "Condition": {
                "ArnNotEquals": {
                    "aws:PrincipalArn": "arn:aws:iam::111122223333:role/MyGatewayExecutionRole"
                }
            }
        }
    ]
}
```
###### Tip

An explicit `Deny` always overrides any `Allow`, including identity-based policies in the same account. Keying the `Deny` on `aws:PrincipalArn` ensures that only your gateway’s execution role can invoke the runtime, regardless of what other permissions exist in your account.

###### Important

Restricting the runtime to the gateway’s execution role is only as strong as the controls on who can assume that role. Any principal that can assume the gateway execution role can invoke the runtime as if it were the gateway. Lock the role down by adding `aws:SourceArn` and `aws:SourceAccount` conditions to the **gateway execution role’s** trust policy so that only your gateway can assume it. The [Confused deputy prevention](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-security-best-practices.html#security-bp-confused-deputy>) guidance shows the same technique applied to a runtime’s execution role; apply the same pattern here, but set the trust policy on the gateway execution role and scope `aws:SourceArn` to your gateway ARN.

## JWT inbound authorization and OAuth outbound access sample

This guide walks you through the process of setting up your agent runtime to be invoked with an OAuth compliant access token using JWT format. The sample agent will be authorized using AWS Cognito access tokens. Later, you’ll also learn how the agent code can fetch Google tokens on behalf of the user to check Google Drive and fetch contents.

**What you’ll learn**

In this guide, you’ll learn how to:

  * Set up Cognito user pool, add a user, and get a bearer token for the user

  * Set up your agent runtime to use the Cognito user pool for authorization

  * Set up your agent code to fetch OAuth tokens on behalf of the user to call tools


## Prerequisites

Before you begin, make sure you have:

  * An AWS account with appropriate permissions

  * Basic understanding of Python programming

  * Familiarity with Docker containers (for advanced deployment)

  * Set up a basic agent with runtime successfully

  * The latest AWS CLI and `jq` installed

  * Basic understanding of OAuth authorization, mainly JWT bearer tokens, claims, and the various grant flows


## Step 1: Create your agent project

Use the `agentcore create` command to set up a skeleton agent project with the framework of your choice:

```bash
agentcore create
```
The command will prompt you to:

  * Choose a framework (choose Strands Agents for this tutorial)

  * Provide a project name

  * Configure additional options


This generates:

  * Agent code with your selected framework

  * `agentcore/agentcore.json` configuration file

  * `requirements.txt` with necessary dependencies


###### Note

The generated agent code will serve as the foundation for implementing OAuth authentication in the following steps.

## Step 2: Set up AWS Cognito user pool and add a user

To set up a Cognito user pool and create a user, you’ll use a shell script that automates the process.

For more information, see [Step 2: Import Identity and Auth modules](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-getting-started-google.html#identity-getting-started-step2>).

**To set up Cognito user pool and create a user**

  * Create a file named `setup_cognito.sh` with the following content:

```typescript
#!/bin/bash

# Create User Pool and capture Pool ID directly
export POOL_ID=$(aws cognito-idp create-user-pool \
  --pool-name "MyUserPool" \
  --policies '{"PasswordPolicy":{"MinimumLength":8}}' \
  --region $REGION | jq -r '.UserPool.Id')

# Create App Client and capture Client ID directly
export CLIENT_ID=$(aws cognito-idp create-user-pool-client \
  --user-pool-id $POOL_ID \
  --client-name "MyClient" \
  --no-generate-secret \
  --explicit-auth-flows "ALLOW_USER_PASSWORD_AUTH" "ALLOW_REFRESH_TOKEN_AUTH" \
  --region $REGION | jq -r '.UserPoolClient.ClientId')

# Create User
aws cognito-idp admin-create-user \
  --user-pool-id $POOL_ID \
  --username $USERNAME \
  --region $REGION \
  --message-action SUPPRESS > /dev/null

# Set Permanent Password
aws cognito-idp admin-set-user-password \
  --user-pool-id $POOL_ID \
  --username $USERNAME \
  --password $PASSWORD \
  --region $REGION \
  --permanent > /dev/null

# Authenticate User and capture Access Token
export BEARER_TOKEN=$(aws cognito-idp initiate-auth \
  --client-id "$CLIENT_ID" \
  --auth-flow USER_PASSWORD_AUTH \
  --auth-parameters USERNAME=$USERNAME,PASSWORD=$PASSWORD \
  --region $REGION | jq -r '.AuthenticationResult.AccessToken')

# Output the required values
echo "Pool id: $POOL_ID"
echo "Discovery URL: https://cognito-idp.$REGION.amazonaws.com/$POOL_ID/.well-known/openid-configuration"
echo "Client ID: $CLIENT_ID"
echo "Bearer Token: $BEARER_TOKEN"
```
Open a terminal window and set the following environment variables:

    * `REGION` – the AWS Region that you want to use

    * `USERNAME` – the user name for the new user

    * `PASSWORD` – the password for the new user

```bash
export REGION=us-east-1 // set your desired Region
export USERNAME=USER NAME
export PASSWORD=PASSWORD
```
In the terminal window, run the script:

```bash
source setup_cognito.sh
```
Note the output from the script. You’ll need these values in the next steps.


This script creates a Cognito user pool, a user pool client, adds a user, and generates a bearer token for the user. The token is valid for 60 minutes by default.

## Step 3 (Optional): Front your runtime with an AgentCore Gateway

You can front your AgentCore Runtime with an AgentCore Gateway so that the gateway becomes the single, governed entry point to the runtime — giving you policy-based authorization, Amazon Bedrock Guardrails, request and response interceptors, and unified observability, all applied outside the agent’s own environment. For the full rationale and how to set this up, see [Front your runtime with an AgentCore Gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-security-best-practices.html#security-bp-front-with-gateway>).

If you want to front this runtime, [create the gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-create.html>) now, before you deploy the runtime in the next step. After you deploy, you’ll [add the runtime as a gateway target](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-target-http-runtime.html>).

To make sure callers can’t bypass the gateway, restrict the runtime to accept invocations only from that gateway. You configure this in the next step, as part of the authorizer, using `allowedWorkloadConfiguration` (see allowedWorkloadConfiguration: restrict invocation to your gateway).

## Step 4: Deploy your agent

###### Important

Starting **October 13, 2025** , Amazon Bedrock AgentCore uses a Service-Linked Role (SLR) for workload identity permissions instead of requiring manual IAM policy configuration for new agents.

The Service-Linked Role details:

  * **Name:** `AWSServiceRoleForBedrockAgentCoreRuntimeIdentity`

  * **Service Principal:** `runtime-identity.bedrock-agentcore.amazonaws.com`

  * **Purpose:** Manages workload identity access tokens and OAuth credentials


Ensure the role you use to invoke AgentCore Control APIs has permission to create the Service-Linked Role:

```json
{
    "Sid": "CreateBedrockAgentCoreIdentityServiceLinkedRolePermissions",
    "Effect": "Allow",
    "Action": "iam:CreateServiceLinkedRole",
    "Resource": "arn:aws:iam::*:role/aws-service-role/runtime-identity.bedrock-agentcore.amazonaws.com/AWSServiceRoleForBedrockAgentCoreRuntimeIdentity",
    "Condition": {
        "StringEquals": {
            "iam:AWSServiceName": "runtime-identity.bedrock-agentcore.amazonaws.com"
        }
    }
}
```
**Benefit** : The Service-Linked Role automatically provides the necessary permissions for workload identity access without requiring manual policy configuration.

For detailed information about the service-linked role, see [Identity service-linked role](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./service-linked-roles.html#identity-service-linked-role>).

Now you’ll deploy your agent with JWT authorization using the Cognito user pool you created. You will need to create an agent with authorizer configuration. The following table represents the various authorizer configuration parameters and how we use them to validate the incoming token.

authorizer_configuration | claim in decoded token | Notes  
---|---|---  
discovery url → issuer |  iss |  The discovery url should point to an issuer url. This should match the iss claim in the decoded token.  
allowedClients |  client_id |  client_id in the token should match one of the allowed clients specified in the authorizer  
allowedAudience |  aud |  One of the values in aud claim from the token should match one of the allowed audience specified in the authorizer  
allowedWorkloadConfiguration |  `internal` |  Optional. At launch, used to allow only your AgentCore Gateway to invoke the runtime. See Restrict invocation to your gateway.  
  
If both client_id and aud is provided, the agent runtime authorizer will verify both.

### allowedWorkloadConfiguration: restrict invocation to your gateway

The `allowedWorkloadConfiguration` field on the `customJWTAuthorizer` restricts which workloads in the request’s identity chain are allowed to invoke the runtime. Set the allowed workload to your gateway so that the runtime accepts a request only when its identity chain includes that gateway — this is how an OAuth (JWT) runtime enforces that traffic arrives only through the gateway you set up in Step 3.

You provide the allowed workloads using either of the following fields. You can specify one or both — a request is accepted if its identity chain matches an entry in **either** field, so you don’t need to provide both.

  * **hostingEnvironments** – A list of hosting environments whose workloads are allowed to invoke the target. Each entry is an object with an `arn`. At launch, the only supported hosting environment is AgentCore Gateway, so each `arn` must be an AgentCore Gateway ARN.

  * **workloadIdentities** – A list of workload identity names that are allowed to invoke the target. A workload identity name is **not** an ARN. It is the final segment of the gateway’s workload identity ARN, which you can find in the `workloadIdentityDetails` field of the `GetGateway` response. For example, if `workloadIdentityDetails.workloadIdentityArn` is `arn:aws:bedrock-agentcore:us-east-1:111122223333:workload-identity-directory/default/workload-identity/my-gateway-workload-identity`, then the workload identity name is `my-gateway-workload-identity`.


The following example creates an agent runtime that restricts invocation to a specific AgentCore Gateway by its ARN. Specifying `hostingEnvironments` alone is the simplest way to allow a gateway:

```json
{
    "authorizerConfiguration": {
        "customJWTAuthorizer": {
            "discoveryUrl": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_example/.well-known/openid-configuration",
            "allowedClients": ["your-client-id"],
            "allowedWorkloadConfiguration": {
                "hostingEnvironments": [
                    {
                        "arn": "arn:aws:bedrock-agentcore:us-east-1:111122223333:gateway/my-gateway-id"
                    }
                ]
            }
        }
    }
}
```
Alternatively, you can identify the gateway by its workload identity name, or specify both fields. When both are present, a request is allowed if it matches an entry in either field. The following `allowedWorkloadConfiguration` snippet allows two different gateways — one identified by its ARN and one by its workload identity name:

```text
"allowedWorkloadConfiguration": {
    "hostingEnvironments": [
        {
            "arn": "arn:aws:bedrock-agentcore:us-east-1:111122223333:gateway/my-gateway-1-id"
        }
    ],
    "workloadIdentities": [
        "my-gateway-2-workload-identity"
    ]
}
```
###### Note

At launch, `allowedWorkloadConfiguration` is supported only for AgentCore Runtime targets, and the allowed workloads are AgentCore Gateways.

### Create and deploy the agent runtime

With your authorizer configuration ready, create and deploy the agent runtime. The following examples show how to do this with the AgentCore CLI or the AWS SDK for Python (Boto3). Note the agent runtime ARN from the output — you’ll need it to invoke the agent in the next step.

###### Example

AgentCore CLI
    

**To configure and deploy your agent**

  1. Create your agent project with the AgentCore CLI:

```bash
agentcore create
```
When prompted, choose your framework (choose Strands Agents for this tutorial).

  2. Deploy your agent:

```bash
agentcore deploy
```
  3. Note the agent runtime ARN from the output. You’ll need this in the next step.

###### Tip

You can also run the `agentcore create` command without flags for a fully interactive experience that guides you through project setup.


Python
    

  1. 
```python
import boto3

# Create the client
client = boto3.client('bedrock-agentcore-control', region_name="us-east-1")

# Call the CreateAgentRuntime operation
response = client.create_agent_runtime(
    agentRuntimeName='HelloAgent',
    agentRuntimeArtifact={
        'containerConfiguration': {
            'containerUri': '111122223333.dkr.ecr.us-east-1.amazonaws.com/my-agent:latest'
        }
    },
    authorizerConfiguration={
        "customJWTAuthorizer": {
            "discoveryUrl": 'COGNITO_DISCOVERY_URL',
            "allowedClients": ['COGNITO_CLIENT_ID']
        }
    },
    networkConfiguration={"networkMode":"PUBLIC"},
    roleArn='arn:aws:iam::111122223333:role/AgentRuntimeRole',
    lifecycleConfiguration={
        'idleRuntimeSessionTimeout': 300,  # 5 min, configurable
        'maxLifetime': 1800                # 30 minutes, configurable
    },
)
```
 


## Step 5: Use bearer token to invoke your agent

Now that your agent is deployed with JWT authorization, you can invoke it using the bearer token.

###### Note

If you fronted your runtime with a gateway in Step 3, add the deployed runtime as a gateway target before you invoke — see [AgentCore Runtime targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-target-http-runtime.html>) — and then invoke through the gateway endpoint shown in the examples that follow, rather than the runtime endpoint.

###### Important

**Important for existing users** : Agents created **before October 13, 2025** will continue to use the agent execution role for identity permissions and **require** the preceding policy to be attached to the agent’s execution role.

**New agents** : For agents created **on or after October 13, 2025** , this policy is **not required** as permissions are handled automatically by the Service-Linked Role.

```json
{
    "Sid": "GetAgentAccessToken",
    "Effect": "Allow",
    "Action": [
        "bedrock-agentcore:GetWorkloadAccessToken",
        "bedrock-agentcore:GetWorkloadAccessTokenForJWT",
        "bedrock-agentcore:GetWorkloadAccessTokenForUserId"
    ],
    # point to the workload identity for the runtime; the workload identity can be found in
    # the GetAgentRuntime response and has your agent name in it.
    "Resource": [
        "arn:aws:bedrock-agentcore:region:account-id:workload-identity-directory/default",
        "arn:aws:bedrock-agentcore:region:account-id:workload-identity-directory/default/workload-identity/agentname-*"
    ]
}
```
**Invoke the agent**

Fetch a bearer token for the user you created with Amazon Cognito.

```bash
# use the password and other details used when you created the cognito user

export TOKEN=$(aws cognito-idp initiate-auth \
    --client-id "$CLIENT_ID" \
    --auth-flow USER_PASSWORD_AUTH \
    --auth-parameters USERNAME='testuser',PASSWORD='PASSWORD' \
    --region us-east-1 | jq -r '.AuthenticationResult.AccessToken')
```
Proceed to invoke the agent with the rest of the following instructions.

Invoke the agent with OAuth.

###### Example

Use cURL
    

  1. 
```typescript
// Invoke with OAuth token
export PAYLOAD='{"prompt": "hello what is 1+1?"}'

export BEDROCK_AGENT_CORE_ENDPOINT_URL="https://bedrock-agentcore.us-east-1.amazonaws.com"
# If you fronted the runtime with a gateway (Step 3), the core endpoint URL is now your gateway URL
# export BEDROCK_AGENT_CORE_ENDPOINT_URL="https://${GATEWAY_ID}.gateway.bedrock-agentcore.us-east-1.amazonaws.com/${TARGET_NAME}"

export INVOKE_URL="${BEDROCK_AGENT_CORE_ENDPOINT_URL}/runtimes/${ESCAPED_AGENT_ARN}/invocations?qualifier=DEFAULT"
# If you fronted the runtime with a gateway (Step 3), the preceding URL works but there is also a simpler alternative:
# export INVOKE_URL="${BEDROCK_AGENT_CORE_ENDPOINT_URL}/invocations"

curl -v -X POST "${INVOKE_URL}" \
-H "Authorization: Bearer ${TOKEN}" \
-H "X-Amzn-Trace-Id: your-trace-id" \
-H "Content-Type: application/json" \
-H "X-Amzn-Bedrock-AgentCore-Runtime-Session-Id: your-session-id" \
-d ${PAYLOAD}
```
 


Use Python
    

  1. Since boto3 doesn’t support invocation with bearer tokens, you’ll need to use an HTTP client like the requests library in Python.

**To invoke your agent with a bearer token**

  2. Create a Python script named `invoke_agent.py` with the following content:

```python
import requests
import urllib.parse
import json
import os

# Configuration Constants
REGION_NAME = "AWS_REGION"

# === Agent Invocation Demo ===
invoke_agent_arn = "YOUR_AGENT_ARN_HERE"
auth_token = os.environ.get('TOKEN')
print(f"Using Agent ARN from environment: {invoke_agent_arn}")

# URL encode the agent ARN
escaped_agent_arn = urllib.parse.quote(invoke_agent_arn, safe='')

# Construct the URL — invoke the runtime directly
url = f"https://bedrock-agentcore.{REGION_NAME}.amazonaws.com/runtimes/{escaped_agent_arn}/invocations?qualifier=DEFAULT"

# If you are fronting the runtime with a gateway (see Step 3), invoke through
# the gateway target instead (replace GATEWAY_ID and my-target):
# url = f"https://GATEWAY_ID.gateway.bedrock-agentcore.{REGION_NAME}.amazonaws.com/my-target/invocations"

# Set up headers
headers = {
    "Authorization": f"Bearer {auth_token}",
    "X-Amzn-Trace-Id": "your-trace-id",
    "Content-Type": "application/json",
    "X-Amzn-Bedrock-AgentCore-Runtime-Session-Id": "testsession123"
}

# Enable verbose logging for requests
import logging
logging.basicConfig(level=logging.DEBUG)
logging.getLogger("urllib3.connectionpool").setLevel(logging.DEBUG)

invoke_response = requests.post(
    url,
    headers=headers,
    data=json.dumps({"prompt": "Hello what is 1+1?"})
)

# Print response in a safe manner
print(f"Status Code: {invoke_response.status_code}")
print(f"Response Headers: {dict(invoke_response.headers)}")

# Handle response based on status code
if invoke_response.status_code == 200:
    response_data = invoke_response.json()
    print("Response JSON:")
    print(json.dumps(response_data, indent=2))
elif invoke_response.status_code >= 400:
    print(f"Error Response ({invoke_response.status_code}):")
    error_data = invoke_response.json()
    print(json.dumps(error_data, indent=2))

else:
    print(f"Unexpected status code: {invoke_response.status_code}")
    print("Response text:")
    print(invoke_response.text[:500])
```
  3. Replace `AWS_REGION` with the AWS Region that you are using. from Step 3.

  4. Replace `YOUR_AGENT_ARN_HERE` with your actual agent runtime ARN from Step 3.

  5. Run the script:

```text
python invoke_agent.py
```
## OAuth Error Responses

OAuth-configured agents follow [RFC 6749 (OAuth 2.0)](<https://datatracker.ietf.org/doc/html/rfc6749>) authentication standards. When authentication is missing, the service returns a 401 Unauthorized response with a WWW-Authenticate header (per [RFC 7235](<https://datatracker.ietf.org/doc/html/rfc7235>) ), enabling clients to discover the authorization server endpoints through the GetRuntimeProtectedResourceMetadata API.

### 401 Unauthorized - Missing Authentication

When no Bearer token is provided in the Authorization header, the response is:

```text
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer resource_metadata="https://bedrock-agentcore.{region}.amazonaws.com/runtimes/{ESCAPED_ARN}/invocations/.well-known/oauth-protected-resource?qualifier={QUALIFIER}"
```
The `resource_metadata` URL in the WWW-Authenticate header points to the Protected Resource Metadata (PRM) API. The PRM API enables clients to discover which authorization servers protect this agent and their OAuth endpoint URLs.

###### Note

You must pre-register your OAuth client in Cognito (via AWS Console or CLI) to obtain a `client_id` before using the discovered endpoints. Amazon Cognito does not support Dynamic Client Registration (RFC 7591).

## Step 6: Set up your agent to access tools using OAuth

In this section, you’ll learn how to connect your agent code with AgentCore Credential Providers for secure access to external resources using OAuth2 authentication.

The following example demonstrates how your agent running in Agent Runtime can request OAuth consent from users, enabling them to authenticate with their Google account and authorize the agent to access their Google Drive contents.

For more information about setting up identity, see [Get started with AgentCore Identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-getting-started.html>).

### Step 6.1: Set up Credential Providers

To set up a Google Credential Provider, you need to:

  1. Register your application with Google to obtain client ID and client secret

  2. Create an OAuth credential provider using the AWS CLI. Replace `your-client-id` and `your-client-secret` with your actual Google OAuth2 client ID and client secret:

```text
OAUTH2_CREDENTIAL_PROVIDER_RESPONSE=$(aws bedrock-agentcore-control create-oauth2-credential-provider \
  --name "google-provider" \
  --credential-provider-vendor "GoogleOauth2" \
  --oauth2-provider-config-input '{
      "googleOauth2ProviderConfig": {
        "clientId": "your-client-id",
        "clientSecret": "your-client-secret"
      }
    }' \
--output json)

OAUTH2_CALLBACK_URL=$(echo $OAUTH2_CREDENTIAL_PROVIDER_RESPONSE | jq -r '.callbackUrl')

echo "OAuth2 Callback URL: $OAUTH2_CALLBACK_URL"
```
###### Note

Obtain the `callbackUrl` from the [CreateOauth2CredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateOauth2CredentialProvider.html>) response and add the URI to your Google application’s redirect URI list. The callback URL should look like: https://bedrock-agentcore.us-east-1.amazonaws.com/identities/oauth2/callback/********-****-****-****-************


Make sure your invocation role has the necessary permissions for accessing the credential provider.

### Step 6.2: Enable agent to read Google Drive contents

Create a tool with agent core SDK annotations as shown in the following example to automatically initiate the three-legged OAuth process. When your agent invokes this tool, users will be prompted to open the authorization URL in their browser and grant consent for the agent to access their Google Drive.

```python
import asyncio
from bedrock_agentcore.identity.auth import requires_access_token, requires_api_key

# This annotation helps agent developer to obtain access tokens from external applications
@requires_access_token(
    provider_name="google-provider",
    scopes=["https://www.googleapis.com/auth/drive.metadata.readonly"], # Google OAuth2 scopes
    auth_flow="USER_FEDERATION", # 3LO flow
    on_auth_url=lambda x: print("Copy and paste this authorization url to your browser: ", x), # prints authorization URL to console
    force_authentication=True,
    callback_url='insert_oauth2_callback_url_for_session_binding'
)
async def read_from_google_drive(*, access_token: str):
    print(access_token) #You can see the access_token
    # Make API calls...
    main(access_token)

asyncio.run(read_from_google_drive(access_token=""))
```
###### Note

For a sample local callback server implementation to handle [session binding](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/oauth2-authorization-url-session-binding.html>) , refer to [oauth2_callback_server.py on GitHub](<https://github.com/awslabs/amazon-bedrock-agentcore-samples/blob/main/01-features/05-authenticate-and-authorize/02-outbound-auth/02-outbound-auth-3lo/oauth2_callback_server.py>)

**What happens behind the scenes**

When this code runs, the following process occurs:

  1. Agent Runtime authorizes the inbound token according to the configured authorizer.

  2. Agent Runtime exchanges this token for a Workload Access Token via `bedrock-agentcore:GetWorkloadAccessTokenForJWT` API and delivers it to your agent code via the payload header `WorkloadAccessToken`.

  3. During tool invocation, your agent uses this Workload Access Token to call Token Vault API `bedrock-agentcore:GetResourceOauth2Token` and generate a 3LO authentication URL.

  4. Your agent sends this URL to the client application as specified in the `on_auth_url` method.

  5. The client application presents this URL to the user, who grants consent for the agent to access their Google Drive.

  6. AgentCore Identity service securely receives and caches the Google access token until it expires, enabling subsequent requests from the user to use this token without needing the user to provide consent for every request.


###### Note

AgentCore Identity Service stores the Google access token in the AgentCore Token Vault using the agent workload identity and user ID (from the inbound JWT token, such as AWS Cognito token) as the binding key, eliminating repeated consent requests until the Google token expires.

## Step 7: (Optional) Propagate a JWT token to AgentCore Runtime

Optionally, you can pass an Authorization header to an AgentCore Runtime to extract claims. This can be done by using the request header allowlist configuration. For more information, see [RequestHeaderConfiguration](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_RequestHeaderConfiguration.html>).

### Step 7.1: Modify your agent code to read headers

In this step you make changes to your agent code so that you can decode and extract claims from a JWT token using PyJWT library.

**requirements.txt**

Add PyJWT dependency to the `requirements.txt` file in your generated project.

```text
PyJWT
```
**Update your agent code**

Modify the main agent file in your generated project (typically `src/main.py` or similar, depending on your framework choice) as shown in the following code. You can skip validating the token signature here since it has already been validated by AgentCore Runtime when the inbound authorization was done.

```python
import jwt
import json
....

@app.entrypoint
def invoke(payload, context):
    auth_header = context.request_headers.get('Authorization')
    if not auth_header:
        return None

    # Remove "Bearer " prefix if present
    token = auth_header.replace('Bearer ', '') if auth_header.startswith('Bearer ') else auth_header
    try:
        # Skip signature validation as agent runtime has validated the token already.
        claims = jwt.decode(token, options={"verify_signature": False})
        app.logger.info("Claims: %s", json.dumps(claims))
    except jwt.InvalidTokenError as e:
        app.logger.exception("Invalid JWT token: %s", e)

    .....
```
### Step 7.2: Create the agent with request header allowlist

Use the AgentCore CLI to configure the agent with request header allowlist. Navigate to your generated project directory and run:

```bash
agentcore create --name HelloAgent --framework Strands --model-provider Bedrock --memory none

# Now deploy the agent runtime
agentcore deploy
```
###### Note

The AgentCore CLI creates the project structure and configuration files. Adjust the agent configuration in `agentcore/agentcore.json` as needed for your framework choice.

### Step 7.3: Invoke your agent

Invoke your agent using OAuth and you should see the claims in your agent logs in CloudWatch Logs.

## Troubleshooting

### How to debug token related issues

If you encounter issues with token authentication, you can decode the token to inspect its contents:

```bash
echo "$TOKEN" | cut -d '.' -f2 | tr '_-' '/+' | awk '{ l=4 - length($0)%4; if (l<4) printf "%s", $0; for (i=0; i<l; i++) printf "="; print "" }' | base64 -D | jq
```
This will output the token’s payload, which looks similar to:

```json
{
    "sub": "subid",
    "iss": "https://cognito-idp.us-east-1.amazonaws.com/userpoolid",
    "client_id": "clientid",
    "origin_jti": "originjti",
    "event_id": "eventid",
    "token_use": "access",
    "scope": "aws.cognito.signin.user.admin",
    "auth_time": 1752275688,
    "exp": 1752279288,
    "iat": 1752275688,
    "jti": "jti",
    "username": "username"
}
```
When troubleshooting token issues, check the following:

  * Issuer url pointed to by the discovery url in the agent authorizer should match the issuer claim in the token. Do the following to confirm they match:

    * Select the discovery url you provided in the authorizer configuration when you created the agent, for example: `https://cognito-idp.us-east-1.amazonaws.com/us-east-1_nnnnnnnnn/.well-known/openid-configuration`

      * Check the issuer url - `"issuer": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_12345566"` . This should match the iss claim value in the token.

  * `client_id` claim in the token must match one of the authorizer allowedClients entries if provided

    * Note the client id you provided when you created the agent

    * Confirm this matches the client_id claim in the decoded token

  * `aud` claim in the token must match one of the authorizer `allowedAudience` entries, if provided

    * Note the audience list you provided when you created the agent

    * Confirm this matches the `aud` claim in the decoded token

  * Tokens are only valid for several minutes (the default Amazon Cognito expiry is 60 minutes). Fetch a new token as needed.



