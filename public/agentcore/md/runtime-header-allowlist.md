# Pass custom headers to Amazon Bedrock AgentCore Runtime - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-header-allowlist.html

---

# Pass custom headers to Amazon Bedrock AgentCore Runtime

Custom headers let you pass contextual information from your application directly to your agent code without cluttering the main request payload. You can pass any valid HTTP header that is not in the restricted headers list, including webhook signatures like `X-Custom-Signature`, API keys like `X-Api-Key`, trace context, or session identifiers. You can also pass the `Authorization` header for JWT-based authentication when your agent is configured with a custom JWT authorizer. Headers prefixed with `X-Amzn-Bedrock-AgentCore-Runtime-Custom-` continue to be supported for backward compatibility. Up to 20 headers can be configured per runtime, and each header value is limited to 4KB.

Amazon Bedrock AgentCore Runtime lets you pass headers in a request to your agent code provided the headers meet the following criteria:

  * Header name is a valid HTTP header (alphanumeric characters, hyphens, and underscores) and is not in the restricted headers list.

  * Headers starting with `x-amz-` are not allowed (these are reserved for AWS SigV4 signing).

  * Headers starting with `x-amzn-` are not allowed, except for headers prefixed with `X-Amzn-Bedrock-AgentCore-Runtime-Custom-` .

  * The `Authorization` header requires the agent runtime to be configured with a `customJWTAuthorizer` for OAuth-based inbound access.

  * Header value is not greater than 4KB in size.

  * Up to 20 headers can be configured per runtime.

  * Header names are case-insensitive and duplicates (by case-insensitive comparison) are not allowed.


## Restricted headers

To maintain security and prevent exposure of sensitive information, the following headers are restricted and cannot be configured for propagation:

Category | Headers  
---|---  
Authentication & Authorization |  Proxy-Authorization, WWW-Authenticate  
Content Negotiation |  Accept, Accept-Charset, Accept-Encoding, Accept-Language, Content-Type, Content-Length, Content-Encoding, Content-Language, Content-Location, Content-Range  
Caching |  Cache-Control, ETag, Expires, If-Match, If-Modified-Since, If-None-Match, If-Range, If-Unmodified-Since, Last-Modified, Pragma, Vary  
Connection Management |  Connection, Keep-Alive, Proxy-Connection, Upgrade  
Request Context |  Host, User-Agent, Referer, From  
Range / Transfer |  Range, Accept-Ranges, Transfer-Encoding, TE, Trailer  
Server Information |  Server, Date, Location, Retry-After  
Cookies |  Set-Cookie, Cookie  
Security |  Content-Security-Policy, Content-Security-Policy-Report-Only, Strict-Transport-Security, X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy, Cross-Origin-Embedder-Policy, Cross-Origin-Opener-Policy, Cross-Origin-Resource-Policy  
CORS |  Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Allow-Credentials, Access-Control-Expose-Headers, Access-Control-Max-Age, Access-Control-Request-Method, Access-Control-Request-Headers, Origin  
Client Hints |  Accept-CH, Accept-CH-Lifetime, DPR, Width, Viewport-Width, Downlink, ECT, RTT, Save-Data  
Experimental / Proposed |  Clear-Site-Data, Feature-Policy, Expect-CT, Public-Key-Pins, Public-Key-Pins-Report-Only  
Proxy |  Via, Forwarded, X-Forwarded-For, X-Forwarded-Host, X-Forwarded-Proto, X-Real-IP, X-Requested-With, X-CSRF-Token  
IP Spoofing / URL Manipulation |  True-Client-IP, X-Client-IP, X-Cluster-Client-IP, X-Originating-IP, X-Source-IP, X-Original-URL, X-Original-Host, X-Rewrite-URL  
CDN / Proxy |  CF-Ray, CF-Connecting-IP, X-Amz-Cf-Id, X-Cache, X-Served-By  
HTTP/2 Pseudo Headers |  :method, :path, :scheme, :authority, :status  
Server Push |  Link  
WebSocket |  Sec-WebSocket-Key, Sec-WebSocket-Accept, Sec-WebSocket-Version, Sec-WebSocket-Protocol, Sec-WebSocket-Extensions  
  
In addition to the restricted headers listed above:

  * All headers starting with `x-amz-` are restricted (for example, `x-amz-security-token` , `x-amz-date` , `x-amz-content-sha256` ). These are reserved for AWS request signing.

  * All headers starting with `x-amzn-` are restricted, except for headers prefixed with `X-Amzn-Bedrock-AgentCore-Runtime-Custom-` .


## Step 1: Create your agent

Create an AgentCore project using the AgentCore CLI:

```bash
agentcore create --name MyHeaderAgent
cd MyHeaderAgent
```
Update your agent’s entrypoint file to access the custom headers from the request context:

```python
import json
from bedrock_agentcore import BedrockAgentCoreApp, RequestContext
from strands import Agent

app = BedrockAgentCoreApp()
agent = Agent()

@app.entrypoint
def agent_invocation(payload, context: RequestContext):
    """Handler for agent invocation"""
    user_message = payload.get("prompt", "")
    if not isinstance(user_message, str) or not user_message.strip():
        return {"error": "Invalid input: 'prompt' must be a non-empty string"}
    app.logger.info("invoking agent with user message: %s", payload)
    response = agent(user_message)

    # access request headers here
    request_headers = context.request_headers
    app.logger.info("Headers: %s", json.dumps(request_headers))
    return response

app.run()
```
## Step 2: Configure and deploy your agent with custom headers

Configure the request header allowlist on your agent runtime so that custom headers are forwarded to your agent code at invocation time.

###### Example

AgentCore CLI
    

  1. Add the `requestHeaderAllowlist` field to your agent configuration in `agentcore/agentcore.json` :

```json
{
  "agents": [
    {
      "name": "MyHeaderAgent",
      "requestHeaderAllowlist": [
        "X-Custom-Signature",
        "X-Api-Key",
        "X-Amzn-Bedrock-AgentCore-Runtime-Custom-UserId"
      ]
    }
  ]
}
```
Deploy your agent:

```bash
agentcore deploy
```
Note the agent runtime ARN from the output. You need it if you plan to invoke using the AWS SDK.


AWS SDK
    

  1. After deploying your agent, update the runtime configuration using the AWS SDK:

```python
import boto3

client = boto3.client('bedrock-agentcore-control', region_name='us-west-2')

client.update_agent_runtime(
    agentRuntimeId='your-runtime-id',
    roleArn='arn:aws:iam::123456789012:role/YourAgentRole',
    agentRuntimeArtifact={'containerConfiguration': {'containerUri': 'your-container-uri'}},
    networkConfiguration={'networkMode': 'PUBLIC'},
    requestHeaderConfiguration={
        'requestHeaderAllowlist': [
            'X-Custom-Signature',
            'X-Api-Key'
        ]
    }
)
```
###### Note

`update_agent_runtime` is a full PUT operation. You must include all required fields (`roleArn` , `agentRuntimeArtifact` , `networkConfiguration`) even if they haven’t changed.

You can find your runtime ID by running `agentcore status`.


## Step 3: Invoke your agent with custom headers

Pass custom headers when invoking your agent so that your agent code can access them through the request context.

###### Example

AgentCore CLI
    

  1. Use the `-H` flag to pass custom headers with `agentcore invoke` :

```bash
agentcore invoke "Tell me a joke" \
  -H "X-Custom-Signature: sha256=abc123def456"
```
You can pass multiple headers by repeating the `-H` flag:

```bash
agentcore invoke "Tell me a joke" \
  -H "X-Custom-Signature: sha256=abc123def456" \
  -H "X-Api-Key: my-api-key" \
  -H "X-Amzn-Bedrock-AgentCore-Runtime-Custom-UserId: user-123"
```
AWS SDK
    

  1. Use boto3 with event handlers to add custom headers to your agent invocation. For more details on botocore events, see [botocore events documentation](<https://botocore.amazonaws.com/v1/documentation/api/latest/topics/events.html>).

```python
import json
import boto3

agent_arn = 'YOUR_AGENT_ARN_HERE'
prompt = "Tell me a joke"

agent_core_client = boto3.client('bedrock-agentcore', region_name='us-west-2')
event_system = agent_core_client.meta.events

EVENT_NAME = 'before-sign.bedrock-agentcore.InvokeAgentRuntime'
CUSTOM_HEADER_NAME = 'X-Custom-Signature'
CUSTOM_HEADER_VALUE = 'sha256=abc123def456'

def add_custom_runtime_header(request, **kwargs):
    request.headers.add_header(CUSTOM_HEADER_NAME, CUSTOM_HEADER_VALUE)

handler = event_system.register_first(EVENT_NAME, add_custom_runtime_header)

payload = json.dumps({"prompt": prompt}).encode()
response = agent_core_client.invoke_agent_runtime(
    agentRuntimeArn=agent_arn,
    payload=payload
)

event_system.unregister(EVENT_NAME, handler)

content = []
for chunk in response.get("response", []):
    content.append(chunk.decode('utf-8'))
print(json.loads(''.join(content)))
```
## Step 4: (Optional) Configure inbound JWT authentication

To pass the JWT token used for OAuth-based inbound access to your agent, configure `authorizerType` and `authorizerConfiguration` in your agent configuration.

###### Example

AgentCore CLI
    

  1. Add the authorizer configuration to your agent in `agentcore/agentcore.json` :

```json
{
  "agents": [
    {
      "name": "MyHeaderAgent",
      "authorizerType": "CUSTOM_JWT",
      "authorizerConfiguration": {
        "customJwtAuthorizer": {
          "discoveryUrl": "https://cognito-idp.us-east-1.amazonaws.com/user-pool-id/.well-known/openid-configuration",
          "allowedAudience": ["your-client-id"],
          "allowedClients": ["your-client-id"]
        }
      },
      "requestHeaderAllowlist": [
        "Authorization"
      ]
    }
  ]
}
```
Deploy to apply the configuration:

```bash
agentcore deploy
```
With this configuration, the `Authorization` header from incoming requests is validated against your OIDC provider and forwarded to your agent code.


AWS SDK
    

  1. For information about setting up an agent with OAuth inbound access using the AWS SDK, see [Authenticate and authorize with Inbound Auth and Outbound Auth](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-oauth.html>).



