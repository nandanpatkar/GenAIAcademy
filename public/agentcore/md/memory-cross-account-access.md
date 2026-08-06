# Cross-account memory access - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-cross-account-access.html

---

# Cross-account memory access  
  
Amazon Bedrock AgentCore Memory supports cross-account access, enabling you to build multi-account architectures where memory resources and consuming agents span multiple AWS accounts. Cross-account access covers two scenarios:

  * **Data plane operations from another account** — Principals in Account B can call memory data plane APIs (create events, write records, retrieve records) against a memory resource in Account A. This is configured by attaching a resource-based policy to the memory resource.

High-level steps:

    1. Configure your memory resource to allow cross-account access by attaching a resource-based policy.

    2. Reference the memory ARN in your data plane API calls from Account B.

  * **Delivery destinations in another account** — Your memory resource in Account A can deliver payloads and stream events to Amazon S3 buckets, Amazon SNS topics, and Amazon Kinesis Data Streams that reside in Account B. This is configured at memory creation time through the memory execution role and resource policies on the target resources.

High-level steps:

    1. Create a memory execution role in Account A with permissions to access the target resources.

    2. Add resource-based policies to the destination resources in Account B to allow the execution role.

    3. Create the memory in Account A, referencing the execution role and cross-account resource ARNs.


###### Topics

  * Prerequisites

  * Cross-account data plane access

  * Cross-account delivery destinations

  * Best practices


## Prerequisites

Before configuring cross-account memory access, verify you have:

  * A memory resource created in the resource owner account (Account A)

  * The full ARN of the memory resource (for example, `arn:aws:bedrock-agentcore:us-east-1:<account-id>:memory/<memory-id>`)

  * For data plane access: an IAM role or user in Account B with identity-based permissions that allow the desired `bedrock-agentcore` actions

  * For delivery destinations: the target S3 bucket, SNS topic, or Kinesis Data Stream created in Account B


## Cross-account data plane access

You can allow principals in another account to call memory data plane APIs directly against your memory resource. This is configured by attaching a resource-based policy to the memory using the `PutResourcePolicy` API. For more information about resource-based policies, see [Resource-based policies for Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./resource-based-policies.html>).

### How it works

  1. Account A creates a memory resource.

  2. Account A attaches a resource-based policy to the memory resource using the `PutResourcePolicy` API, granting specific actions to a principal in Account B.

  3. A principal in Account B calls memory data plane APIs, specifying the full ARN of the memory resource in Account A as the `memory-id`.

  4. AWS evaluates both the resource-based policy on the memory and the identity-based policy attached to the Account B principal. If both allow the action (and no policy explicitly denies it), the request succeeds.


### Supported actions

You can grant cross-account access for any memory data plane action. The following table lists the available actions:

Action | Description  
---|---  
`bedrock-agentcore:CreateEvent` |  Create a short-term memory event  
`bedrock-agentcore:GetEvent` |  Retrieve a specific event  
`bedrock-agentcore:DeleteEvent` |  Delete a specific event  
`bedrock-agentcore:ListEvents` |  List events in a session  
`bedrock-agentcore:ListActors` |  List actors in a memory  
`bedrock-agentcore:ListSessions` |  List sessions for an actor  
`bedrock-agentcore:GetMemoryRecord` |  Retrieve a specific memory record  
`bedrock-agentcore:ListMemoryRecords` |  List memory records in a namespace  
`bedrock-agentcore:RetrieveMemoryRecords` |  Semantically search memory records  
`bedrock-agentcore:DeleteMemoryRecord` |  Delete a specific memory record  
`bedrock-agentcore:BatchCreateMemoryRecords` |  Create multiple memory records  
`bedrock-agentcore:BatchUpdateMemoryRecords` |  Update multiple memory records  
`bedrock-agentcore:BatchDeleteMemoryRecords` |  Delete multiple memory records  
`bedrock-agentcore:ListMemoryExtractionJobs` |  List extraction jobs for a memory  
`bedrock-agentcore:StartMemoryExtractionJobs` |  Restart failed extraction jobs  
  
### Attach a resource-based policy to a memory

#### Grant a single action to another account

The following example grants Account B (`<account-B-id>`) permission to call `BatchCreateMemoryRecords` on a memory resource in Account A (`<account-A-id>`):

```bash
aws bedrock-agentcore-control put-resource-policy \
    --region us-east-1 \
    --resource-arn "arn:aws:bedrock-agentcore:us-east-1:<account-A-id>:memory/<memory-id>" \
    --policy '{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "AllowCrossAccountBatchCreate",
                "Effect": "Allow",
                "Principal": {
                    "AWS": "arn:aws:iam::<account-B-id>:root"
                },
                "Action": "bedrock-agentcore:BatchCreateMemoryRecords",
                "Resource": "arn:aws:bedrock-agentcore:us-east-1:<account-A-id>:memory/<memory-id>"
            }
        ]
    }'
```
#### Grant multiple actions to another account

The following example grants Account B full read and write access to memory records and events:

```bash
aws bedrock-agentcore-control put-resource-policy \
    --region us-east-1 \
    --resource-arn "arn:aws:bedrock-agentcore:us-east-1:<account-A-id>:memory/<memory-id>" \
    --policy '{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "AllowCrossAccountMemoryReadWrite",
                "Effect": "Allow",
                "Principal": {
                    "AWS": "arn:aws:iam::<account-B-id>:root"
                },
                "Action": [
                    "bedrock-agentcore:CreateEvent",
                    "bedrock-agentcore:GetEvent",
                    "bedrock-agentcore:ListEvents",
                    "bedrock-agentcore:ListActors",
                    "bedrock-agentcore:ListSessions",
                    "bedrock-agentcore:BatchCreateMemoryRecords",
                    "bedrock-agentcore:BatchUpdateMemoryRecords",
                    "bedrock-agentcore:BatchDeleteMemoryRecords",
                    "bedrock-agentcore:ListMemoryRecords",
                    "bedrock-agentcore:RetrieveMemoryRecords",
                    "bedrock-agentcore:GetMemoryRecord",
                    "bedrock-agentcore:DeleteMemoryRecord"
                ],
                "Resource": "arn:aws:bedrock-agentcore:us-east-1:<account-A-id>:memory/<memory-id>"
            }
        ]
    }'
```
#### Grant access to a specific IAM role

To follow the principle of least privilege, grant access to a specific role rather than the entire account:

```bash
aws bedrock-agentcore-control put-resource-policy \
    --region us-east-1 \
    --resource-arn "arn:aws:bedrock-agentcore:us-east-1:<account-A-id>:memory/<memory-id>" \
    --policy '{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "AllowSpecificRoleReadAccess",
                "Effect": "Allow",
                "Principal": {
                    "AWS": "arn:aws:iam::<account-B-id>:role/AgentMemoryReaderRole"
                },
                "Action": [
                    "bedrock-agentcore:RetrieveMemoryRecords",
                    "bedrock-agentcore:ListMemoryRecords",
                    "bedrock-agentcore:GetMemoryRecord"
                ],
                "Resource": "arn:aws:bedrock-agentcore:us-east-1:<account-A-id>:memory/<memory-id>"
            }
        ]
    }'
```
### Remove a resource-based policy

To revoke cross-account data plane access, delete the resource-based policy:

```bash
aws bedrock-agentcore-control delete-resource-policy \
    --region us-east-1 \
    --resource-arn "arn:aws:bedrock-agentcore:us-east-1:<account-A-id>:memory/<memory-id>"
```
After deleting the policy, any subsequent cross-account requests return an `AccessDeniedException`.

### Call data plane APIs from Account B

Once the resource-based policy is attached, a principal in Account B can call data plane APIs by specifying the full memory ARN as the `memory-id`.

Create memory records from Account B:

```bash
aws bedrock-agentcore batch-create-memory-records \
    --region us-east-1 \
    --memory-id "arn:aws:bedrock-agentcore:us-east-1:<account-A-id>:memory/<memory-id>" \
    --records '[
      {
        "requestIdentifier": "rec-001",
        "content": {"text": "User prefers morning meeting times before 10 AM"},
        "namespaces": ["preferences/user-123"],
        "timestamp": "1729525989"
      }
    ]'
```
Retrieve memory records from Account B:

```bash
aws bedrock-agentcore retrieve-memory-records \
    --region us-east-1 \
    --memory-id "arn:aws:bedrock-agentcore:us-east-1:<account-A-id>:memory/<memory-id>" \
    --namespace "preferences/user-123" \
    --search-criteria '{"searchQuery": "meeting preferences"}' \
    --max-results 10
```
Create events from Account B:

```bash
aws bedrock-agentcore create-event \
    --region us-east-1 \
    --memory-id "arn:aws:bedrock-agentcore:us-east-1:<account-A-id>:memory/<memory-id>" \
    --actor-id "agent-in-account-b" \
    --session-id "cross-account-session-1" \
    --event-timestamp "$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")" \
    --payload '[
      {
        "conversational": {
          "content": {"text": "Schedule my standup for 9 AM tomorrow"},
          "role": "USER"
        }
      }
    ]'
```
## Cross-account delivery destinations

When you create a memory with a custom (self-managed) strategy or stream delivery configuration, Amazon Bedrock AgentCore uses a memory execution role to deliver payloads to your destination resources. When those resources reside in a different account, you must configure both sides: the execution role in Account A needs permissions to access the resources, and the resources in Account B need policies that allow access from Account A.

### How it works

  1. You create destination resources (S3 bucket, SNS topic, or Kinesis Data Stream) in Account B with resource-based policies that allow the memory execution role in Account A.

  2. You create a memory execution role in Account A with a trust policy for Amazon Bedrock AgentCore and a permissions policy that grants access to the cross-account resources in Account B.

  3. You create the memory in Account A, referencing the execution role and the cross-account resource ARNs.

  4. Amazon Bedrock AgentCore assumes the execution role and uses it to deliver payloads or stream events to the resources in Account B.


### Set up the memory execution role

Create the memory execution role in Account A. The role requires a trust policy that allows Amazon Bedrock AgentCore to assume it, and a permissions policy that grants access to the target resources in Account B.

Trust policy:

```json
{
"Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "bedrock-agentcore.amazonaws.com"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "ArnLike": {
          "aws:SourceArn": "arn:aws:bedrock-agentcore:<region>:<account-A-id>:memory/*"
        }
      }
    }
  ]
}
```
Permissions policy (include only the statements relevant to the resources you are using):

```json
{
"Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3Access",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::<bucket-name-in-account-B>/*"
    },
    {
      "Sid": "AllowSNSPublish",
      "Effect": "Allow",
      "Action": "sns:Publish",
      "Resource": "arn:aws:sns:<region>:<account-B-id>:<topic-name>"
    },
    {
      "Sid": "AllowKinesisAccess",
      "Effect": "Allow",
      "Action": [
        "kinesis:PutRecords",
        "kinesis:DescribeStream"
      ],
      "Resource": "arn:aws:kinesis:<region>:<account-B-id>:stream/<stream-name>"
    }
  ]
}
```
### Configure the S3 bucket policy in Account B

Add the following resource-based policy to the S3 bucket in Account B to allow the memory execution role in Account A to deliver payloads:

```json
{
"Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowMemoryExecutionRoleAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::<account-A-id>:role/<memory-execution-role-name>"
      },
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::<bucket-name>/*"
    }
  ]
}
```
### Configure the SNS topic policy in Account B

Add the following resource-based policy to the SNS topic in Account B to allow the memory execution role in Account A to publish notifications:

```json
{
"Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowMemoryExecutionRolePublish",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::<account-A-id>:role/<memory-execution-role-name>"
      },
      "Action": "sns:Publish",
      "Resource": "arn:aws:sns:<region>:<account-B-id>:<topic-name>"
    }
  ]
}
```
### Configure the Kinesis Data Stream policy in Account B

Add the following resource-based policy to the Kinesis Data Stream in Account B to allow the memory execution role in Account A to stream events:

```json
{
"Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowMemoryExecutionRolePutRecords",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::<account-A-id>:role/<memory-execution-role-name>"
      },
      "Action": [
        "kinesis:PutRecords",
        "kinesis:DescribeStream"
      ],
      "Resource": "arn:aws:kinesis:<region>:<account-B-id>:stream/<stream-name>"
    }
  ]
}
```
### Create a memory with cross-account S3 and SNS

After configuring the execution role and resource policies, create a memory in Account A that references the cross-account resources in Account B:

```bash
aws bedrock-agentcore-control create-memory \
    --region us-east-1 \
    --name "cross-account-memory" \
    --description "Memory with cross-account S3 and SNS delivery" \
    --event-expiry-duration 30 \
    --memory-execution-role-arn "arn:aws:iam::<account-A-id>:role/MemoryCrossAccountRole" \
    --memory-strategies '[
      {
        "customMemoryStrategy": {
          "name": "cross_account_strategy",
          "configuration": {
            "selfManagedConfiguration": {
              "triggerConditions": [
                {"messageBasedTrigger": {"messageCount": 5}}
              ],
              "invocationConfiguration": {
                "topicArn": "arn:aws:sns:us-east-1:<account-B-id>:memory-notifications",
                "payloadDeliveryBucketName": "<bucket-name>"
              },
              "historicalContextWindowSize": 10
            }
          }
        }
      }
    ]'
```
### Create a memory with cross-account Kinesis streaming

```bash
aws bedrock-agentcore-control create-memory \
    --region us-east-1 \
    --name "cross-account-streaming-memory" \
    --description "Memory with cross-account Kinesis streaming" \
    --event-expiry-duration 30 \
    --memory-execution-role-arn "arn:aws:iam::<account-A-id>:role/MemoryCrossAccountRole" \
    --stream-delivery-resources '{
      "resources": [
        {
          "kinesis": {
            "dataStreamArn": "arn:aws:kinesis:us-east-1:<account-B-id>:stream/memory-record-stream",
            "contentConfigurations": [
              {
                "type": "MEMORY_RECORDS",
                "level": "FULL_CONTENT"
              }
            ]
          }
        }
      ]
    }'
```
## Best practices

  * **Grant least privilege** — Only grant the specific actions needed by the cross-account principal.

  * **Use specific principals** — Grant access to specific IAM roles rather than the entire account root to limit blast radius.

  * **Audit cross-account access** — Use AWS CloudTrail to monitor cross-account API calls to your memory resources.

  * **Separate read and write access** — Create separate policy statements for read-only consumers and read-write producers.

  * **Validate before removing policies** — Before removing a resource-based policy, verify that no active workloads in other accounts depend on the access.



