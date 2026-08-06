# Understanding Amazon Bedrock AgentCore Gateway CloudTrail events - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/understanding-gateway-cloudtrail-log-entries.html

---

# Understanding Amazon Bedrock AgentCore Gateway CloudTrail events

A trail is a configuration that enables delivery of events as log files to an Amazon S3 bucket that you specify. CloudTrail log files contain one or more log entries. An event represents a single request from any source and includes information such as the requested action, the date and time of the action, and request parameters.

###### Note

The contents of the requests and responses for data events are redacted, and the JSON Web Token (JWT) claims have HTML entities sanitized for security purposes.

###### Note

For management events, only request parameters that are defined by the Gateway API are eligible for redaction. Any additional fields that you include in a request that are not part of the API are recorded in CloudTrail exactly as you sent them and are not redacted. Do not include passwords or other sensitive information in fields that are not part of the API.

The following sections show examples of CloudTrail events:

###### Topics

  * InvokeGateway data event with authentication error

  * Successful InvokeGateway data event

  * Management Event


## InvokeGateway data event with authentication error

The following example shows a CloudTrail log entry that demonstrates the `InvokeGateway` action with an authentication error. The authentication error can be seen in the `body` field of the `responseElements`.

```json
{
  "eventVersion": "1.11",
  "userIdentity": {
    "type": "AWSAccount",
    "principalId": "",
    "accountId": "anonymous"
  },
  "eventTime": "2025-07-14T02:14:42Z",
  "eventSource": "bedrock-agentcore.amazonaws.com",
  "eventName": "InvokeGateway",
  "awsRegion": "us-west-2",
  "sourceIPAddress": "34.XXX.XXX.206",
  "userAgent": "python-httpx/0.28.1",
  "requestParameters": {
    "body": {
      "id": 0,
      "method": "initialize",
      "params": {
        "clientInfo": {
          "name": "mcp",
          "version": "0.1.0"
        },
        "protocolVersion": "2025-06-18",
        "capabilities": {}
      },
      "jsonrpc": "2.0"
    }
  },
  "responseElements": {
    "body": {
      "jsonrpc": "2.0",
      "id": 0,
      "error": {
        "code": -32001,
        "message": "Invalid Bearer token"
      }
    },
    "contentType": "application/json",
    "statusCode": 401
  },
  "requestID": "1234abcd-12ab-34cd-56ef-1234567890ab",
  "eventID": "12345678-1234-5678-9abc-123456789012",
  "readOnly": false,
  "resources": [
    {
      "accountId": "XXXXXXXXXX",
      "type": "AWS::BedrockAgentCore::Gateway",
      "ARN": "arn:aws:bedrock-agentcore:us-west-2:XXXXXXXXXX:gateway/test-openapi-gateway-b24f8c26-u9p3rjw8qw"
    }
  ],
  "eventType": "AwsApiCall",
  "managementEvent": false,
  "recipientAccountId": "XXXXXXXXXX",
  "sharedEventID": "12345678-xxxx-xxxx-xxxx-123456789012",
  "eventCategory": "Data",
  "tlsDetails": {
    "tlsVersion": "TLSv1.2",
    "cipherSuite": "ECDHE-RSA-AES128-GCM-SHA256",
    "clientProvidedHostHeader": "test-openapi-gateway-xxxxxxx-u9p3rjw8qw.gateway.bedrock-agentcore.us-west-2.amazonaws.com"
  }
}
```
## Successful InvokeGateway data event

The following example shows a CloudTrail log entry for a successful `InvokeGateway` action:

```json
{
      "eventVersion": "1.11",
      "userIdentity": {
        "type": "AWSAccount",
        "principalId": "",
        "accountId": "anonymous"
      },
      "eventTime": "2025-07-14T02:14:42Z",
      "eventSource": "bedrock-agentcore.amazonaws.com",
      "eventName": "InvokeGateway",
      "awsRegion": "us-west-2",
      "sourceIPAddress": "35.88.103.184",
      "userAgent": "python-httpx/0.28.1",
      "requestParameters": {
        "body": {
          "id": 1,
          "method": "tools/call",
          "params": {
            "name": "SmithyTarget___ListTables",
            "arguments": "REDACTED"
          },
          "jsonrpc": "2.0"
        }
      },
      "responseElements": {
        "body": {
          "jsonrpc": "2.0",
          "id": 1,
          "result": {
            "isError": false,
            "content": "REDACTED"
          }
        },
        "contentType": "application/json",
        "statusCode": 200
      },
      "additionalEventData": {
        "targetId": "0JTXXX4YMA",
        "jwt": {
          "headers": {
            "kid": "hGrcJwz5MX6hNeuL6jdXE4hjK7sT6oj+yN7kN+arRv4=",
            "alg": "RS256"
          },
          "claims": {
            "sub": "4ammgxxxxxxxxxxxm3b8c",
            "token_use": "access",
            "scope": "python-cognito-resource-server-id/write python-cognito-resource-server-id/read",
            "auth_time": 1752459276,
            "iss": "https://cognito-idp.us-west-2.amazonaws.com/us-west-2_Fxxxxxhtq",
            "exp": 1752462876,
            "iat": 1752459276,
            "version": 2,
            "jti": "1234abcd-12ab-34cd-56ef-1234567890ab"
          },
          "type": "JWS"
        },
        "downstreamRequestIds": [
          "H3RDH6T03DG10996U0M2P1V1IFVV4KQNSO5AEMVJF66Q9ASUAAJG"
        ]
      },
      "requestID": "1234abcd-12ab-34cd-56ef-1234567890ab",
      "eventID": "12345678-1234-5678-9abc-123456789012",
      "readOnly": false,
      "resources": [
        {
          "accountId": "XXXXXXXXXX",
          "type": "AWS::BedrockAgentCore::Gateway",
          "ARN": "arn:aws:bedrock-agentcore:us-west-2:XXXXXXXXXX:gateway/test-gateway-65129e91-mtzoadyihf"
        }
      ],
      "eventType": "AwsApiCall",
      "managementEvent": false,
      "recipientAccountId": "XXXXXXXXXX",
      "sharedEventID": "1234abcd-12ab-34cd-56ef-1234567890ab",
      "eventCategory": "Data",
      "tlsDetails": {
        "tlsVersion": "TLSv1.2",
        "cipherSuite": "ECDHE-RSA-AES128-GCM-SHA256",
        "clientProvidedHostHeader": "test-gateway-65129e91-xxxxxxxx.gateway.bedrock-agentcore.us-west-2.amazonaws.com"
      }
    }
```
## Management Event

The following example shows a CloudTrail log entry for a management event:

```json
{
  "eventVersion": "1.09",
  "userIdentity": {
    "type": "AssumedRole",
    "principalId": "AROXXXXXXXXXXXXNRD7D:xxxxx",
    "arn": "arn:aws:sts::XXXXXXXXXXXX:assumed-role/HydraInvocationRole-xxxxxxxxx/xxxx",
    "accountId": "XXXXXXXXXXXX",
    "accessKeyId": "xxxxxxxxx",
    "sessionContext": {
      "sessionIssuer": {
        "type": "Role",
        "principalId": "xxxxxxxx",
        "arn": "arn:aws:iam::XXXXXXXXXXXX:role/HydraInvocationRole-xxx",
        "accountId": "XXXXXXXXXXXX",
        "userName": "HydraInvocationRole-xxxxx"
      },
      "attributes": {
        "creationDate": "2025-07-14T02:42:43Z",
        "mfaAuthenticated": "false"
      }
    },
    "invokedBy": "bedrock-agentcore.amazonaws.com"
  },
  "eventTime": "2025-07-14T02:47:38Z",
  "eventSource": "bedrock-agentcore.amazonaws.com",
  "eventName": "CreateGateway",
  "awsRegion": "us-west-2",
  "sourceIPAddress": "bedrock-agentcore.amazonaws.com",
  "userAgent": "bedrock-agentcore.amazonaws.com",
  "requestParameters": {
    "roleArn": "arn:aws:iam::XXXXXXXXXXXX:role/PythonGenesisTestGatewayRole",
    "name": "***",
    "authorizerConfiguration": {
      "customJWTAuthorizer": {
        "allowedClients": [
          "xxxxxxxxx"
        ],
        "discoveryUrl": "https://cognito-idp.us-west-2.amazonaws.com/us-west-2_xxxxx/.well-known/openid-configuration"
      }
    },
    "description": "***",
    "protocolType": "MCP",
    "authorizerType": "CUSTOM_JWT"
  },
  "responseElements": {
    "authorizerConfiguration": {
      "customJWTAuthorizer": {
        "allowedClients": [
          "xxxxxxxxxxxxxxx"
        ],
        "discoveryUrl": "https://cognito-idp.us-west-2.amazonaws.com/us-west-2_xxxxxx/.well-known/openid-configuration"
      }
    },
    "description": "***",
    "protocolType": "MCP",
    "gatewayArn": "arn:aws:bedrock-agentcore:us-west-2:XXXXXXXXXXXX:gateway/test-openapi-gateway-xxxxxxx-xxxxxx",
    "workloadIdentityDetails": {
      "workloadIdentityArn": "arn:aws:bedrock-agentcore:us-west-2:XXXXXXXXXXXX:workload-identity-directory/default/workload-identity/test-openapi-gateway-xxxxxx-xxxxx"
    },
    "createdAt": "2025-07-14T02:47:38.302834063Z",
    "gatewayUrl": "https://test-openapi-gateway-xxxxxxx-8fb4mo6pqx.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp",
    "roleArn": "arn:aws:iam::XXXXXXXXXXXX:role/PythonGenesisTestGatewayRole",
    "name": "***",
    "authorizerType": "CUSTOM_JWT",
    "gatewayId": "test-openapi-gateway-9c8f7109-8fb4mo6pqx",
    "status": "CREATING",
    "updatedAt": "2025-07-14T02:47:38.302845797Z"
  },
  "requestID": "0fb99b0b-a4d1-xxxx-8aee-c703adaa6bd9",
  "eventID": "b12bf859-xxxx-48d7-952a-d5c6ec00fb68",
  "readOnly": false,
  "resources": [
    {
      "accountId": "XXXXXXXXXXXX",
      "type": "AWS::BedrockAgentCore::Gateway",
      "ARN": "arn:aws:bedrock-agentcore:us-west-2:XXXXXXXXXXXX:gateway/test-openapi-gateway-xxxxxxx-8fb4mo6pqx"
    }
  ],
  "eventType": "AwsApiCall",
  "managementEvent": true,
  "recipientAccountId": "XXXXXXXXXXXX",
  "eventCategory": "Management"
}
```
