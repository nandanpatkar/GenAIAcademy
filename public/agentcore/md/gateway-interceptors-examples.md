# Examples - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-interceptors-examples.html

---

# Examples

The following example shows a Python Lambda function that can handle both REQUEST and RESPONSE interceptor types. The REQUEST interceptor logs the MCP method and passes the request through unchanged, while the RESPONSE interceptor passes the response through unchanged.

## Pass-through interceptor

This example demonstrates a simple interceptor that logs the MCP method for REQUEST interceptors and passes all requests and responses through unchanged:

```python
import json
import logging

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    """
    Lambda function that handles both REQUEST and RESPONSE interceptor types.

    For REQUEST interceptors: logs the MCP method and passes request through unchanged
    For RESPONSE interceptors: passes response through unchanged
    """
    # Extract the MCP data from the event
    mcp_data = event.get('mcp', {})

    # Check if this is a REQUEST or RESPONSE interceptor based on presence of gatewayResponse
    if 'gatewayResponse' in mcp_data and mcp_data['gatewayResponse'] != None:
        # This is a RESPONSE interceptor
        logger.info("Processing RESPONSE interceptor - passing through unchanged")

        # Pass through the original request and response unchanged
        response = {
          "interceptorOutputVersion": "1.0",
          "mcp": {
              "transformedGatewayResponse": {
                  "body": mcp_data.get('gatewayResponse', {}).get('body', {}),
                  "statusCode": mcp_data.get('gatewayResponse', {}).get('statusCode', 200)
              }
          }
        }
    else:
        # This is a REQUEST interceptor
        gateway_request = mcp_data.get('gatewayRequest', {})
        request_body = gateway_request.get('body', {})
        mcp_method = request_body.get('method', 'unknown')

        # Log the MCP method
        logger.info(f"Processing REQUEST interceptor - MCP method: {mcp_method}")

        # Pass through the original request unchanged
        response = {
          "interceptorOutputVersion": "1.0",
          "mcp": {
              "transformedGatewayRequest": {
                  "body": request_body,
              }
          }
        }

    return response
```
This Lambda function can be configured as both a REQUEST and RESPONSE interceptor. When configured as a REQUEST interceptor, it will log the MCP method from the incoming request. When configured as a RESPONSE interceptor, it will simply pass the response through unchanged. Both interceptor types return the original data without modification, making this a "pass-through" interceptor.

