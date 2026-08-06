# Configuration - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-interceptors-configuration.html

---

# Configuration  
  
Interceptors can be configured with an input parameter called `passRequestHeaders`

## Interceptor input configuration

When configuring interceptors, you can specify whether request headers should be passed to the interceptor function using the `passRequestHeaders` field:

**passRequestHeaders**
    

A boolean value that determines whether request headers are included in the interceptor input payload. When set to `true` , all request headers will be passed to your interceptor Lambda function. When set to `false` (default), headers are not included.

###### Warning

Use caution when setting this to `true` as request headers may contain sensitive information such as authentication tokens and credentials.

**payloadFilter**
    

For HTTP targets (AgentCore Runtime and passthrough) and inference targets, which share the `http` interceptor payload shape, an optional filter that excludes fields from the interceptor input payload. Lambda synchronous invocation has a 6 MB limit for the request and response combined, so excluding a large response body keeps the payload within that limit. To exclude the response body, set `payloadFilter.exclude` to a list containing the `RESPONSE_BODY` field:

```json
{
  "inputConfiguration": {
    "passRequestHeaders": false,
    "payloadFilter": {
      "exclude": [{ "field": "RESPONSE_BODY" }]
    }
  }
}
```
###### Note

`passRequestHeaders` is required in `inputConfiguration`. Include it (for example, `"passRequestHeaders": false`) alongside `payloadFilter`.

When the response body is excluded, the `body` field in the response interceptor input payload is `null`. Your function can still inspect the `statusCode`, `contentType`, and `headers`, and can inject headers or override the status code. If your function returns `body: null`, the gateway uses the original response body.

## Configuring interceptors during gateway creation

The following examples show how to create a gateway with interceptors that have `passRequestHeaders` set to `true` :

###### Example

AgentCore CLI
    

  1. With the AgentCore CLI, first create and deploy the gateway, then configure interceptors using the AWS CLI or AWS Python SDK (Boto3).

Create the gateway:

```bash
agentcore add gateway \
  --name my-gateway-with-headers \
  --authorizer-type CUSTOM_JWT \
  --discovery-url "https://cognito-idp.us-west-2.amazonaws.com/some-user-pool/.well-known/openid-configuration" \
  --allowed-audience "api.example.com"
agentcore deploy
```
After deployment, configure interceptors on the gateway using the AWS CLI `update-gateway` command or the AWS Python SDK (Boto3) as shown in the other tabs.


AWS CLI
    

  1. Use the following AWS CLI command to create a gateway with interceptors configured to pass request headers:

```bash
aws bedrock-agentcore-control create-gateway \
  --name my-gateway-with-headers \
  --role-arn arn:aws:iam::123456789012:role/my-gateway-service-role \
  --protocol-type MCP \
  --authorizer-type CUSTOM_JWT \
  --authorizer-configuration '{
    "customJWTAuthorizer": {
      "discoveryUrl": "https://cognito-idp.us-west-2.amazonaws.com/some-user-pool/.well-known/openid-configuration",
      "allowedClients": ["clientId"]
    }
  }' \
  --interceptor-configurations '[{
      "interceptor": {
          "lambda": {
            "arn":"arn:aws:lambda:us-west-2:123456789012:function:my-interceptor-lambda"
          }
      },
      "interceptionPoints": ["REQUEST", "RESPONSE"],
      "inputConfiguration": {
        "passRequestHeaders": true
      }
  }]'
```
AWS Python SDK (Boto3)
    

  1. Use the following Python code with the AWS Python SDK (Boto3) to create a gateway with interceptors configured to pass request headers:

```python
import boto3

# Initialize the AgentCore client
client = boto3.client('bedrock-agentcore-control')

# Create a gateway
gateway = client.create_gateway(
  name="my-gateway-with-headers",
  roleArn="arn:aws:iam::123456789012:role/my-gateway-service-role",
  protocolType="MCP",
  authorizerType="CUSTOM_JWT",
  authorizerConfiguration={
      "customJWTAuthorizer": {
          "discoveryUrl": "https://cognito-idp.us-west-2.amazonaws.com/some-user-pool/.well-known/openid-configuration",
          "allowedClients": ["clientId"]
      }
  },
  interceptorConfigurations=[{
      "interceptor": {
          "lambda": {
            "arn":"arn:aws:lambda:us-west-2:123456789012:function:my-interceptor-lambda"
          }
      },
      "interceptionPoints": ["REQUEST", "RESPONSE"],
      "inputConfiguration": {
        "passRequestHeaders": True
      }
  }]
)

print(f"MCP Endpoint: {gateway['gatewayUrl']}")
```
## Updating interceptor configurations

You can update existing gateway interceptor configurations to modify the `passRequestHeaders` setting or other parameters using the update gateway API operations.

