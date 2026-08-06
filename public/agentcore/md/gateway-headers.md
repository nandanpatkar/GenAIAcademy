# Header propagation with Gateway - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-headers.html

---

# Header propagation with Gateway

## What is header and query parameter propagation

Header propagation refers to the systematic forwarding of selective HTTP headers from incoming requests through your gateway to configured targets, and selective forwarding of response headers back to the client. Similar to header propagation, query parameter propagation enables forwarding of URL query parameters from incoming requests to configured targets. This feature can be used for use cases where you need to exchange context, authentication, tracing, and other critical information between client and targets. The pre-allowlisted headers provided in the invoke tool call to gateway or sent from custom interceptor lambda, will be forwarded to the specific targets.

This feature operates as a shared responsibility model:

  * AWS responsibility is to securely pass the headers and query parameters which you have allowlisted for your targets.

  * Your responsibility is to exercise caution and **only allowlist those headers for propagation which are essential to the targets** , ensuring they meet your security and functional requirements.


### Header restrictions

To maintain security and prevent exposure of sensitive information, the following headers are restricted and cannot be configured for propagation:

Authorization*  
---  
Proxy-Authorization  
WWW-Authenticate  
Accept  
Accept-Charset  
Accept-Encoding  
Accept-Language  
Content-Type  
Content-Length  
Content-Encoding  
Content-Language  
Content-Location  
Content-Range  
Cache-Control  
ETag  
Expires  
If-Match  
If-Modified-Since  
If-None-Match  
If-Range  
If-Unmodified-Since  
Last-Modified  
Pragma  
Vary  
Connection  
Keep-Alive  
Proxy-Connection  
Upgrade  
Host  
User-Agent  
Referer  
From  
Range  
Accept-Ranges  
Transfer-Encoding  
TE  
Trailer  
Server  
Date  
Location  
Retry-After  
Set-Cookie  
Cookie  
Content-Security-Policy  
Content-Security-Policy-Report-Only  
Strict-Transport-Security  
X-Content-Type-Options  
X-Frame-Options  
X-XSS-Protection  
Referrer-Policy  
Permissions-Policy  
Cross-Origin-Embedder-Policy  
Cross-Origin-Opener-Policy  
Cross-Origin-Resource-Policy  
Access-Control-Allow-Origin  
Access-Control-Allow-Methods  
Access-Control-Allow-Headers  
Access-Control-Allow-Credentials  
Access-Control-Expose-Headers  
Access-Control-Max-Age  
Access-Control-Request-Method  
Access-Control-Request-Headers  
Origin  
Accept-CH  
Accept-CH-Lifetime  
DPR  
Width  
Viewport-Width  
Downlink  
ECT  
RTT  
Save-Data  
Clear-Site-Data  
Feature-Policy  
Expect-CT  
Public-Key-Pins  
Public-Key-Pins-Report-Only  
X-Forwarded-For  
X-Forwarded-Host  
X-Forwarded-Proto  
X-Real-IP  
X-Requested-With  
X-CSRF-Token  
CF-Ray  
CF-Connecting-IP  
X-Amz-Cf-Id  
X-Cache  
X-Served-By  
:method  
:path  
:scheme  
:authority  
:status  
Link  
Sec-WebSocket-Key  
Sec-WebSocket-Accept  
Sec-WebSocket-Version  
Sec-WebSocket-Protocol  
Sec-WebSocket-Extensions  
  
  * Authorization header cannot be allowlisted during target creation. However it will be forwarded to the target when provided by an interceptor lambda. See Header propagation from interceptor lambda for details.


###### Important

In addition to restricted headers mentioned above, headers provided in API keys and REST API schema cannot be configured for header propagation.

Additional validation rules apply to allowed headers:

  * Maximum of 10 request headers, 10 response headers, and 10 query parameters per target to prevent abuse and maintain performance

  * Header names must contain only alphanumeric characters, hyphens, and underscores (regex: `^[a-zA-Z0-9_-]+$` )

  * Header values are limited to 4KB maximum to prevent memory exhaustion

  * Header values must contain only printable ASCII characters

  * Headers starting with `X-Amzn-` are prohibited (except for X-Amzn-Bedrock-AgentCore-Runtime-Custom-* headers)


## Configuring header and query parameter propagation

You can configure header and query parameters at the target level when creating or updating gateway targets. Headers and query parameters are specified per target, ensuring that each target receives only the headers it needs.

### Target-level configuration

Configure header propagation by adding `allowedRequestHeaders` , `allowedResponseHeaders` , and `allowedQueryParameters` fields to your target’s `metadataConfiguration` :

```json
{
    "name": "my-target",
    "description": "my target description",
    "credentialProviderConfigurations": [{
        "credentialProviderType": "OAUTH",
        "credentialProvider": {
            "oauthCredentialProvider": {
                "providerArn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:credential-provider/example",
                "scopes": []
            }
        }
    }],
    "targetConfiguration": {
        "mcp": {
            "mcpServer": {
                "endpoint": "https://example.com/mcp"
            }
        }
    },
    "metadataConfiguration": {
        "allowedRequestHeaders": [
            "request-header"
        ],
        "allowedResponseHeaders": [
            "response-header"
        ],
        "allowedQueryParameters": [
            "query-param"
        ]
    }
}
```
Using the Python SDK:

```python
import boto3

# Initialize the client
client = boto3.client('bedrock-agentcore', region_name='us-west-2')

# Create target with header propagation
response = client.create_gateway_target(
    gatewayId='gateway-123',
    name='mcp-target-with-headers',
    description='MCP target with header propagation',
    targetConfiguration={
        'mcp': {
            'mcpServer': {
                'endpoint': 'https://example.com/mcp'
            }
        }
    },
    metadataConfiguration={
        'allowedRequestHeaders': ['x-correlation-id', 'x-tenant-id'],
        'allowedResponseHeaders': ['x-rate-limit-remaining'],
        'allowedQueryParameters': ['version']
    }
)
```
## Header propagation from interceptor lambda

When using custom interceptor lambdas with your gateway, you can dynamically control header propagation by including headers in your interceptor lambda response.

### How interceptor header propagation works

Interceptor lambdas can influence header propagation in the following ways:

  * **Authorization header override:** The `Authorization` header from the interceptor lambda response is automatically propagated to the target. While the `Authorization` header cannot be configured in the target’s allowlist, it will be forwarded to the target when provided by an interceptor lambda.

For example, if you have added a credential provider to the target which provides an authorization token like `Authorization: Bearer client-token` and the interceptor lambda provides `Authorization: Bearer refreshed-token` , the value `Bearer refreshed-token` from the interceptor lambda will be forwarded to the target.

  * **Custom header injection:** Additional headers from the interceptor lambda response are merged with the configured target header allowlist.

  * **Header precedence:** Interceptor lambda-provided headers take precedence over client-provided headers in case of conflicts.

For example, if you allowlist header `x-tenant-id` in the target configuration, and the incoming request provides `x-tenant-id: tenant-123` while the interceptor lambda provides `x-tenant-id: tenant-456` , the value `tenant-456` from the interceptor lambda will be forwarded to the target.

  * **Security validation:** All lambda-provided headers are subject to the same validation rules as configured headers. Except for Authorization header, all other headers must be allowlisted during target creation for them to be forwarded to the targets.


### Implementing header propagation in interceptors

Configure your interceptor lambda to return headers that should be propagated to the target:

```python
import json
import boto3

def lambda_handler(event, context):
    # Extract request context
    request_context = event.get('requestContext', {})
    user_identity = request_context.get('identity', {})

    # Fetch credentials from secure store (example)
    credentials_client = boto3.client('secretsmanager')
    secret = credentials_client.get_secret_value(
        SecretId=f"mcp-credentials/{user_identity.get('userId')}"
    )

    credentials = json.loads(secret['SecretString'])

    # Return response with headers to propagate
    return {
        "interceptorOutputVersion": "1.0",
        "mcp": {
            "transformedGatewayRequest": {
                "headers": {
                    # Authorization header will be propagated automatically
                    "Authorization": f"Bearer {credentials['access_token']}",
                    # Custom headers (must be in target allowlist)
                    "x-tenant-id": user_identity.get('tenantId'),
                    "x-correlation-id": request_context.get('requestId')
                },
                "body": event['mcp']['gatewayRequest']['body']
            }
        }
    }
```
**Common use cases for interceptor header propagation include:**

**Credential fetching**
    

Retrieve short-lived tokens from secure vaults and inject them as Authorization headers, preventing credential exposure in client applications.

**Context injection**
    

Add tenant identifiers, organization context, or user attributes derived from authenticated user claims rather than trusting client-provided values.

**Header transformation**
    

Transform or sanitize headers based on business logic, compliance requirements, or security policies before they reach the target.

**Dynamic routing**
    

Inject routing hints, feature flags, or A/B testing headers based on real-time analysis of user attributes or system state.

### Security considerations

When implementing header propagation with interceptor lambdas, follow these security best practices:

  * **Validate header sources:** Only propagate headers that are explicitly configured in your target allowlist or returned by trusted interceptor lambdas

  * **Sanitize sensitive data:** Remove or mask PII and sensitive information before forwarding headers to external MCP servers

  * **Use least privilege:** Configure interceptor lambda IAM roles with minimal permissions required for credential fetching and context retrieval

  * **Implement audit logging:** Log header transformations and credential fetching activities for security monitoring and compliance

  * **Validate header content:** Ensure that lambda-generated headers meet the same validation rules as configured headers


## Best practices

Follow these best practices when implementing header propagation:

**Use target-specific configuration**
    

Configure headers per target rather than globally. Different targets may require different headers, and target-specific configuration provides better security isolation.

**Minimize header count**
    

Only propagate headers that are actually needed by the target. Excessive headers increase request size and processing overhead.

**Use semantic header names**
    

Choose descriptive header names that clearly indicate their purpose, such as `x-correlation-id` for tracing or `x-tenant-id` for multi-tenancy.

**Implement proper error handling**
    

Handle cases where required headers are missing or invalid. Consider whether to fail the request or provide default values.

**Monitor header usage**
    

Use gateway observability features to monitor which headers are being propagated and identify any issues with header validation or processing.

**Test header propagation**
    

Verify that headers are correctly propagated to your targets during development and testing. Use tools like request logging or debugging endpoints to validate header flow.

