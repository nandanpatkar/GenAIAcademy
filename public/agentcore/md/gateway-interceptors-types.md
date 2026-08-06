# Types of interceptors - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-interceptors-types.html

---

# Types of interceptors

There are two types of interceptors that you can configure on your gateway: REQUEST interceptors and RESPONSE interceptors. The interceptor payload structure depends on the target type configured on your gateway.

This topic covers the interceptor contracts for both MCP targets and HTTP targets (such as Amazon Bedrock AgentCore Runtime).

## Request interceptors

The REQUEST interceptor gets invoked before gateway makes a call to the target configured on the gateway. You can use the REQUEST interceptor to perform any custom validations or authorizations.

### Request interceptor input payload example

The following example shows the input payload structure that a request interceptor Lambda function receives:

```json
{
  "interceptorInputVersion": "1.0",
  "mcp": {
    "rawGatewayRequest": {
        "body": "<raw_request_body>"
    },
    "gatewayRequest" : {
        "path": "/mcp",
        "httpMethod": "POST",
        "headers": {
            "Accept": "application/json",
            "Authorization": "<bearer_token>",
            "SomeHeader": "headerValue1",
            "Mcp-Session-Id": "<session_id>",
            "User-Agent": "<client_user_agent>"
        },
        "body": {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/list"
        }
    }
  }
}
```
###### Note

The `headers` field is only included if `passRequestHeaders` is set to `true` in the interceptor configuration. The `gatewayResponse` field is not present for request interceptors since the response has not been generated yet.

### Request interceptor output payload example

The following example shows the output payload structure that a request interceptor Lambda function should return:

```json
{
  "interceptorOutputVersion": "1.0",
  "mcp": {
    "transformedGatewayRequest" : {
        "body": {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/list"
        }
    },
    "transformedGatewayResponse" : {
        "statusCode": 200,
        "body": {
            "jsonrpc": "2.0",
            "id": 1,
            "result": {
                "<result_content>": "<result_value>"
            }
        }
    }
  }
}
```
###### Important

Important notes about request interceptor output: * The `interceptorOutputVersion` must be set to `"1.0"` . * If the interceptor output contains a `transformedGatewayResponse` , the gateway will respond with that content immediately, even if `transformedGatewayRequest` is also provided. * If both REQUEST and RESPONSE interceptors are configured and the REQUEST interceptor output contains a `transformedGatewayResponse` , the RESPONSE interceptor will still be invoked.

## Response interceptors

The RESPONSE interceptor gets invoked before the gateway responds to the caller. You can use the RESPONSE interceptor to perform any custom redactions or additions to the response back to the caller.

### Response interceptor input payload example

The following example shows the input payload structure that a response interceptor Lambda function receives:

```json
{
  "interceptorInputVersion": "1.0",
  "mcp": {
    "rawGatewayRequest": {
        "body": "<raw_request_body>"
    },
    "gatewayRequest" : {
        "path": "/mcp",
        "httpMethod": "POST",
        "headers": {
            "Accept": "application/json",
            "Authorization": "<bearer_token>",
            "SomeHeader": "headerValue1",
            "Mcp-Session-Id": "<session_id>",
            "User-Agent": "<client_user_agent>"
        },
        "body": {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/list"
        }
    },
    "gatewayResponse" : {
        "statusCode": 200,
        "headers": {
            "SomeHeader": "headerValue1",
            "Mcp-Session-Id": "<session_id>"
        },
        "body": {
            "jsonrpc": "2.0",
            "id": 1,
            "result": {
                "tools": []
            }
        }
    }
  }
}
```
###### Note

The `headers` field in `gatewayRequest` is only included if `passRequestHeaders` is set to `true` in the interceptor configuration. Response interceptors receive both the original request and the gateway’s response, allowing you to modify the response before it’s returned to the caller.

### Response interceptor output payload example

The following example shows the output payload structure that a response interceptor Lambda function should return:

```json
{
  "interceptorOutputVersion": "1.0",
  "mcp": {
    "transformedGatewayRequest" : {
        "body": {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/list"
        }
    },
    "transformedGatewayResponse" : {
        "statusCode": 200,
        "body": {
            "jsonrpc": "2.0",
            "id": 1,
            "result": {
                "<result_content>": "<result_value>"
            }
        }
    }
  }
}
```
###### Important

Important notes about response interceptor output: * The `interceptorOutputVersion` must be set to `"1.0"` . * If the interceptor output contains a `transformedGatewayResponse` , the gateway will respond with that content immediately, even if `transformedGatewayRequest` is also provided. * If both REQUEST and RESPONSE interceptors are configured and the REQUEST interceptor output contains a `transformedGatewayResponse` , the RESPONSE interceptor will still be invoked.

## Response interceptors with streaming enabled

###### Note

If response streaming is enabled on your gateway, your response interceptor Lambda function must check the `isStreamingResponse` field in `gatewayResponse` to distinguish between streaming and non-streaming responses. For streaming responses, handle multiple invocations per request — one per eligible event — and note that only the first invocation can override `headers` and `statusCode`.

When [response streaming](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-mcp-streaming.html>) is enabled on your gateway, the response interceptor behavior changes. The interceptor is invoked multiple times during a streaming response — once per eligible event — instead of once with the complete response.

### When the response interceptor is invoked

The response interceptor is invoked for events that contain a JSON-RPC `id` field:

  * **First event** — The first JSON-RPC response or server-initiated request on the stream (e.g., the tool result, or an `elicitation/create` / `sampling/createMessage` request).

  * **Subsequent events** — Any additional JSON-RPC responses or server-initiated requests (e.g., the final tool result after an elicitation is fulfilled).


The response interceptor is **not** invoked for:

  * `notifications/progress` — Progress updates are forwarded directly to the client.

  * `notifications/message` — Log messages are forwarded directly to the client.

  * Pings — Keep-alive signals are forwarded directly to the client.


### Streaming response interceptor input payload

The input payload includes a new `isStreamingResponse` field set to `true`. The `gatewayResponse.body` field contains the current event body.

**First event** — The interceptor receives `headers`, `statusCode`, and `body`:

```json
{
  "interceptorInputVersion": "1.0",
  "mcp": {
    "rawGatewayRequest": {
        "body": "<raw_request_body>"
    },
    "gatewayRequest" : {
        "path": "/mcp",
        "httpMethod": "POST",
        "body": {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/call",
            "params": {
                "name": "myTool",
                "arguments": {}
            }
        }
    },
    "gatewayResponse" : {
        "statusCode": 200,
        "headers": {
            "Mcp-Session-Id": "<session_id>"
        },
        "isStreamingResponse": true,
        "body": {
            "jsonrpc": "2.0",
            "id": "elicit-1",
            "method": "elicitation/create",
            "params": {
                "message": "Confirm this action?",
                "requestedSchema": {}
            }
        }
    }
  }
}
```
**Subsequent events** — The interceptor receives only `body` (headers and status code have already been sent to the client):

```json
{
  "interceptorInputVersion": "1.0",
  "mcp": {
    "rawGatewayRequest": {
        "body": "<raw_request_body>"
    },
    "gatewayRequest" : {
        "path": "/mcp",
        "httpMethod": "POST",
        "body": {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/call",
            "params": {
                "name": "myTool",
                "arguments": {}
            }
        }
    },
    "gatewayResponse" : {
        "isStreamingResponse": true,
        "body": {
            "jsonrpc": "2.0",
            "id": 1,
            "result": {
                "content": [{"type": "text", "text": "Tool result"}]
            }
        }
    }
  }
}
```
### Streaming response interceptor output payload

What the interceptor can override depends on whether it is the first or a subsequent event:

Event | Can override | Ignored if returned  
---|---|---  
First event |  `headers`, `statusCode`, `body` |  N/A  
Subsequent events |  `body` only |  `headers`, `statusCode` (already sent to client)  
Non-streaming (unchanged) |  `headers`, `statusCode`, `body` |  N/A  
  
## Interceptors for HTTP targets

HTTP targets use a different interceptor payload structure than MCP targets. HTTP targets (AgentCore Runtime and passthrough) and inference targets all use this `http` payload structure. Inference is a separate target type that happens to share the HTTP interceptor payload shape. The payload uses an `http` key instead of an `mcp` key. Request and response bodies are base64-encoded strings rather than parsed JSON objects.

HTTP targets support both REQUEST and RESPONSE interceptors in buffered mode, in which the gateway buffers the full response before invoking the response interceptor. Interceptors are not yet supported in streaming mode.

The following list summarizes the key behaviors for HTTP target interceptors:

  * The `httpMethod` field is read-only.

  * The request and response `body` fields are base64-encoded strings.

  * The `headers` field is included in the request payload only when `passRequestHeaders` is set to `true` in the interceptor configuration.

  * If `transformedGatewayResponse` is present in a REQUEST interceptor’s output, the gateway returns that response immediately without calling the target (a short-circuit). The RESPONSE interceptor does not run after a short-circuit.


### Request interceptor input payload example

The following JSON example shows the structure of the input payload that your request interceptor Lambda function receives when processing an HTTP target request:

```json
{
  "interceptorInputVersion": "1.0",
  "http": {
    "gatewayRequest": {
      "path": "/my-target-name/invocations",
      "httpMethod": "POST",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "<bearer_token>"
      },
      "body": "<base64_encoded_body>"
    }
  }
}
```
###### Note

Note the following about the input payload:

  * The `headers` field is included only if `passRequestHeaders` is set to `true` in the interceptor configuration.

  * The `body` field is a base64-encoded string that represents the raw HTTP request body.

  * The `httpMethod` field is included for informational purposes but is read-only. The interceptor cannot change it.


### Request interceptor output payload example

The following JSON example shows the structure of the output payload that your request interceptor Lambda function must return when transforming an HTTP target request:

```json
{
  "interceptorOutputVersion": "1.0",
  "http": {
    "transformedGatewayRequest": {
      "headers": {
        "Content-Type": "application/json",
        "X-Custom-Header": "custom-value"
      },
      "body": "<base64_encoded_body>"
    },
    "transformedGatewayResponse": {
      "contentType": "application/json",
      "statusCode": 200,
      "headers": {
        "X-Custom-Header": "custom-value"
      },
      "body": "<base64_encoded_body>"
    }
  }
}
```
###### Important

Important notes about HTTP request interceptor output:

  * The `interceptorOutputVersion` must be set to `"1.0"`.

  * If the output contains a `transformedGatewayResponse`, the gateway returns that response immediately without calling the target.

  * The `body` field must be a base64-encoded string.

  * The `httpMethod` is not included in the output because it cannot be modified.


### Response interceptor input payload example

When you configure a RESPONSE interceptor for an HTTP target, the gateway buffers the target response and passes it to your Lambda function. The following JSON example shows the structure of the input payload:

```json
{
  "interceptorInputVersion": "1.0",
  "http": {
    "gatewayRequest": null,
    "gatewayResponse": {
      "statusCode": 200,
      "headers": null,
      "body": "<base64_encoded_body>",
      "contentType": "application/json"
    }
  }
}
```
###### Note

Note the following about the response input payload:

  * The `body` field is a base64-encoded string that represents the raw HTTP response body.

  * The `body` field is `null` if you exclude the response body with a payload filter. For more information, see Handle large response payloads.


### Response interceptor output payload example

The following JSON example shows the structure of the output payload that your response interceptor Lambda function returns when transforming an HTTP target response:

```json
{
  "interceptorOutputVersion": "1.0",
  "http": {
    "transformedGatewayResponse": {
      "statusCode": 200,
      "headers": {
        "X-Custom-Header": "custom-value"
      },
      "body": "<base64_encoded_body>",
      "contentType": "application/json"
    }
  }
}
```
###### Important

Important notes about HTTP response interceptor output:

  * The `interceptorOutputVersion` must be set to `"1.0"`.

  * The `statusCode`, `body`, and `contentType` fields each override the original response value. If you omit a field (or set it to `null`), the gateway uses the original value.

  * The `body` field must be a base64-encoded string.

  * To pass the response through unchanged, return an empty `http` object: `{"interceptorOutputVersion": "1.0", "http": {}}`.


### Handle large response payloads

Lambda synchronous invocation has a 6 MB payload limit for the request and response combined. If a target returns a large body — which is common with inference models — the base64-encoded payload can exceed this limit and cause an error.

To avoid this, exclude the response body from the interceptor input by configuring a payload filter that excludes the `RESPONSE_BODY` field. Your interceptor can still inspect the `statusCode`, `contentType`, and `headers`, and can inject headers or override the status code. When the response body is excluded, the `body` field in the input payload is `null`, and if your function returns `body: null`, the gateway uses the original (unmodified) response body.

### Client context

For HTTP targets, the gateway passes request metadata to your Lambda function through the invocation’s client context. Your function can read the following custom values: `GATEWAY_ARN`, `GATEWAY_ACCOUNT_ID`, `REQUEST_ID`, and `SOURCE_IP`. The `GATEWAY_ARN`, `GATEWAY_ACCOUNT_ID`, and `REQUEST_ID` values are always present. The `SOURCE_IP` value is included only when a source IP is available, so your function should treat it as optional.

### Key differences between MCP and HTTP interceptor payloads

The following table summarizes the differences between MCP and HTTP target interceptor payloads.

Field | MCP target | HTTP target  
---|---|---  
Body format |  Map<String, Object> (parsed JSON) |  String (base64-encoded)  
Path |  Always "/mcp" |  Actual HTTP path (for example, "/my-target-name/invocations")  
httpMethod |  Immutable |  Immutable  
rawGatewayRequest |  Included |  Not included  
Response interceptor |  Supported |  Supported in buffered mode (not yet supported in streaming mode)

