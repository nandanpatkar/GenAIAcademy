# AWS CloudTrail integration - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-cloudtrail-integration.html

---

# AWS CloudTrail integration

###### Upcoming namespace migration

AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry, you must update your endpoints, IAM policies, SDK clients, CLI scripts, and registry data. For more information about migrating from public preview, see [Comprehensive registry migration guide](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-faq.html>).

## Event types

**Management events (logged by default):** CreateRegistry, GetRegistry, UpdateRegistry, DeleteRegistry, ListRegistries, CreateRegistryRecord, GetRegistryRecord, UpdateRegistryRecord, DeleteRegistryRecord, ListRegistryRecords, SubmitRegistryRecordForApproval, UpdateRegistryRecordStatus

## Sample CloudTrail log for CreateRegistryRecord API

```json
{
    "eventVersion": "1.09",
    "userIdentity": {
        "type": "AssumedRole",
        "principalId": "<REDACTED>",
        "arn": "arn:aws:sts::<REDACTED>",
        "accountId": "<REDACTED>",
        "accessKeyId": "<REDACTED>",
        "sessionContext": {
            "sessionIssuer": {
                "type": "Role",
                "principalId": "<REDACTED>",
                "arn": "<REDACTED>",
                "accountId": "<REDACTED>",
                "userName": "Admin"
            },
            "attributes": {
                "creationDate": "2026-04-08T00:59:33Z",
                "mfaAuthenticated": "false"
            }
        }
    },
    "eventTime": "2026-04-08T01:33:24Z",
    "eventSource": "bedrock-agentcore.amazonaws.com",
    "eventName": "CreateRegistryRecord",
    "awsRegion": "us-east-1",
    "sourceIPAddress": "<REDACTED>",
    "userAgent": "<REDACTED>",
    "requestParameters": {
        "descriptors": {
            "mcp": {
                "server": {
                    "schemaVersion": "2025-12-11",
                    "inlineContent": "{\n  \"name\": \"io.example/my-server\",\n  \"description\": \"Brief description of server functionality\",\n  \"version\": \"1.0.0\"\n} "
                }
            }
        },
        "recordVersion": "1.0.0",
        "clientToken": "<REDACTED>",
        "name": "record_gk0xk",
        "registryId": "jzjXulIwVksK",
        "descriptorType": "MCP"
    },
    "responseElements": {
        "Access-Control-Expose-Headers": "x-amzn-RequestId,x-amzn-ErrorType,x-amzn-Trace-id,x-amzn-Apigw-id,x-amzn-ErrorMessage,Date",
        "recordArn": "arn:aws:bedrock-agentcore:us-east-1:123456789012:registry/jzjXulIwVksK/record/QamdREmPPkNr",
        "status": "CREATING"
    },
    "requestID": "12345678-1234-1234-1234-123456789012",
    "eventID": "12345678-1234-5678-9abc-123456789012",
    "readOnly": false,
    "eventType": "AwsApiCall",
    "managementEvent": true,
    "recipientAccountId": "123456789012",
    "eventCategory": "Management",
    "sessionCredentialFromConsole": "true"
}
```
