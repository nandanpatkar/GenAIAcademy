# Self-managed strategy - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-self-managed-strategies.html

---

# Self-managed strategy

A self-managed strategy in Amazon Bedrock AgentCore Memory gives you complete control over your memory extraction and consolidation pipelines. With a self-managed strategy, you can build custom memory processing workflows while leveraging Amazon Bedrock AgentCore for storage and retrieval.

A self-managed strategy in combination with the batch operations ( [BatchCreateMemoryRecords](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_BatchCreateMemoryRecords.html>) , [BatchUpdateMemoryRecords](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_BatchUpdateMemoryRecords.html>) , [BatchDeleteMemoryRecords](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_BatchDeleteMemoryRecords.html>) ), let you directly ingest these extracted records into Amazon Bedrock AgentCore memory for search capabilities.

With self-managed strategies, you can:

  * Control pipeline invocation through configurable triggers

  * Integrate with external processing systems

  * Implement custom extraction and consolidation algorithms

  * Invoke any preferred model for extraction and consolidation

  * Define custom memory record schemas, namespaces, and so on.

  * Ingest extracted records into Amazon Bedrock AgentCore long term memory


###### Topics

  * Create and use a self-managed strategy

  * Prerequisites

  * Set up the infrastructure

  * Create a self-managed strategy

  * Understanding payload delivery

  * Build your custom pipeline

  * Test your implementation

  * Best practices


## Create and use a self-managed strategy

Self-managed strategies follow a five-step process from trigger configuration to memory record storage.

  1. **Configure triggers** : Define trigger conditions (message count, idle timeout, token count) that invoke your pipeline based on short-term memory events

  2. **Receive notifications and payload delivery** : Amazon Bedrock AgentCore publishes notifications to your SNS topic and delivers conversation data to your S3 bucket when trigger conditions are met

  3. **Extract memory records** : Your custom pipeline retrieves the payload and applies extraction logic to identify relevant memories

  4. **Consolidate memory records** : Process extracted memories to remove duplicates and resolve conflicts with existing records

  5. **Store memory records** : Use batch APIs to store processed memory records back into Amazon Bedrock AgentCore long-term memory


## Prerequisites

Before setting up self-managed strategies, verify you have:

  * An AWS account with appropriate permissions

  * Amazon Bedrock AgentCore access

  * Basic understanding of AWS IAM, Amazon S3, and Amazon SNS


## Set up the infrastructure

Create the required AWS resources including S3 bucket, SNS topic, and IAM role that Amazon Bedrock AgentCore needs to access your resources.

### Step 1: Create an S3 bucket

Create an S3 bucket in your account where Amazon Bedrock AgentCore will deliver batched event payloads.

###### Important

Configure a lifecycle policy to automatically delete objects after processing to control costs.

### Step 2: Create an SNS topic

Create an SNS topic for job notifications. Use FIFO topics if processing order within sessions is important for your use case.

### Step 3: Create an IAM role

Create an IAM role that Amazon Bedrock AgentCore can assume to access your resources.

**Trust policy**

Use the following trust policy:

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
                    "aws:SourceArn": "arn:aws:bedrock-agentcore:<region>:<account-id>:memory/*"
                }
            }
        }
    ]
}
```
**Permissions policy**

Use the following permissions policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "S3PayloadDelivery",
            "Effect": "Allow",
            "Action": [
                "s3:GetBucketLocation",
                "s3:PutObject"
            ],
            "Resource": [
                "arn:aws:s3:::your-agentcore-payloads-bucket",
                "arn:aws:s3:::your-agentcore-payloads-bucket/*"
            ]
        },
        {
            "Sid": "SNSNotifications",
            "Effect": "Allow",
            "Action": [
                "sns:GetTopicAttributes",
                "sns:Publish"
            ],
            "Resource": "arn:aws:sns:us-east-1:123456789012:agentcore-memory-jobs"
        }
    ]
}
```
**Additional KMS permissions (if using encrypted resources)**

If you use encrypted resources, add the following KMS permissions:

```json
{
    "Sid": "KMSPermissions",
    "Effect": "Allow",
    "Action": [
        "kms:GenerateDataKey",
        "kms:Decrypt"
    ],
    "Resource": "arn:aws:kms:us-east-1:123456789012:key/your-key-id"
}
```
## Create a self-managed strategy

Use the Amazon Bedrock AgentCore control plane APIs to create or update an AgentCore Memory with self-managed strategies.

### Required permissions

Your IAM user or role needs:

  * bedrock-agentcore:* permissions

  * `iam:PassRole` permission for the execution role


### Create an AgentCore Memory with a self-managed strategy

Use the AWS SDK `CreateMemory` operation to create AgentCore Memory that has a self-managed strategy.

```bash
aws bedrock-agentcore-control create-memory \
  --name "MyCustomMemory" \
  --description "Memory with self-managed extraction strategy" \
  --memory-execution-role-arn "arn:aws:iam::123456789012:role/AgentCoreMemoryRole" \
  --event-expiry-duration 90 \
  --memory-strategies '[
    {
      "customMemoryStrategy": {
        "name": "SelfManagedExtraction",
        "description": "Custom extraction strategy",
        "configuration": {
          "selfManagedConfiguration": {
            "triggerConditions": [
              {
                "messageBasedTrigger": {
                  "messageCount": 6
                }
              },
              {
                "tokenBasedTrigger": {
                  "tokenCount": 1000
                }
              },
              {
                "timeBasedTrigger": {
                  "idleSessionTimeout": 30
                }
              }
            ],
            "historicalContextWindowSize": 2,
            "invocationConfiguration": {
              "payloadDeliveryBucketName": "your-agentcore-payloads-bucket",
              "topicArn": "arn:aws:sns:us-east-1:123456789012:agentcore-memory-jobs"
            }
          }
        }
      }
    }
  ]'
```
## Understanding payload delivery

When trigger conditions are met, Amazon Bedrock AgentCore sends notifications and payloads using specific schemas.

### SNS notification message

```json
{
  "jobId": "unique-job-identifier",
  "s3PayloadLocation": "s3://bucket/path/to/payload.json",
  "memoryId": "your-memory-id",
  "strategyId": "your-strategy-id"
}
```
### S3 payload structure

```json
{
  "requestId": "request-identifier",
  "accountId": "123456789012",
  "memoryId": "your-memory-id",
  "actorId": "user-or-agent-id",
  "sessionId": "conversation-session-id",
  "strategyId": "your-strategy-id",
  "startingTimestamp": 1634567890,
  "endingTimestamp": 1634567920,
  "currentContext": [
    {
      "role": "USER",
      "content": {
        "text": "User message content"
      }
    },
    {
      "role": "ASSISTANT",
      "content": {
        "text": "Assistant response"
      }
    }
  ],
  "historicalContext": [
    {
      "role": "USER",
      "content": {
        "text": "User message content"
      }
    },
    {
      "role": "ASSISTANT",
      "content": {
        "text": "Previous assistant response"
      }
    },
    {
      "blob": "{}",
    }
  ]
}
```
## Build your custom pipeline

This section demonstrates one approach to building a self-managed memory processing pipeline using AWS Lambda and SQS. This is just one example - you can implement your pipeline using any compute platform (EC2, ECS, Fargate), logic and processing framework that meets your requirements.

### Step 1: Set up compute

  1. Create an SQS queue and subscribe it to your SNS topic

  2. Create an AWS Lambda function to process notifications

  3. Configure Lambda execution role permissions


### Step 2: Process the pipeline

The following example pipeline consists of four main components:

  1. Notification handling - Processing SNS notifications and downloading S3 payloads

  2. Memory extraction - Using bedrock models to extract relevant information from conversations

  3. Memory consolidation - Deduplicating and merging extracted memories with existing records

  4. Batch ingestion - Storing processed memories back into Amazon Bedrock AgentCore using batch APIs


## Test your implementation

  1. **Create events** : Use the Amazon Bedrock AgentCore APIs to create conversation events ( `CreateEvent` )

  2. **Monitor notifications** : Verify that your SNS topic receives notifications when triggers are met

  3. **Validate processing** : Check that your Lambda function processes payloads correctly and extracts memory records

  4. **Verify ingestion** : Use `list-memory-records` to confirm extracted memories are stored


### Example: Creating test events

```bash
aws bedrock-agentcore create-event \
  --memory-id "your-memory-id" \
  --actor-id "test-user" \
  --session-id "test-session-1" \
  --event-timestamp "2024-01-15T10:00:00Z" \
  --payload '[{
    "conversational": {
      "content": {"text": "I prefer Italian restaurants with outdoor seating"},
      "role": "USER"
    }
  }]'
```
### Example: Retrieving memory records

```bash
# List records belonging to a specific namespace
aws bedrock-agentcore list-memory-records \
  --memory-id "your-memory-id" \
  --namespace "/actor/Jane/" # lists all records present in the given namespace

# List records belonging to a particular namespace hierarchy
aws bedrock-agentcore list-memory-records \
  --memory-id "your-memory-id" \
  --namespace-path "/" # lists all records present under the namespace hierarchy
```
## Best practices

Follow these best practices for performance, reliability, cost optimization, and security when implementing self-managed strategies.

### Performance and reliability

  * **SLA sharing** : Long-term memory record generation SLA is shared between Amazon Bedrock AgentCore and your self-managed pipeline

  * **Error handling** : Implement proper retry logic and dead letter queues for failed processing

  * **Monitoring** : Set up CloudWatch logs, metrics, alarms for debugging and processing failures and latency. Also, check vended logs from Amazon Bedrock AgentCore for payload delivery failures


### Cost optimization

  * **S3 lifecycle policies** : Configure automatic deletion of processed payloads to control storage costs

  * **Right-sizing** : Choose appropriate compute memory and timeout settings based on your processing requirements


### Processing considerations

  * **Trigger optimization** : Configure trigger conditions based on your use case requirements - balance between processing efficiency and memory freshness by considering your application’s tolerance for latency versus processing costs.

  * **FIFO topics** : Use FIFO SNS topics when session ordering is critical (e.g., for summarization workflows)

  * **Memory consolidation** : Implement deduplication logic to prevent storing redundant or conflicting memory records, which reduces storage costs and improves retrieval accuracy

  * **Memory record organization** : Always include meaningful namespaces and strategy IDs when ingesting records to enable efficient categorization, filtering, and retrieval of memory records


### Security

  * **Least privilege** : Grant minimal required permissions to all IAM roles

  * **Encryption** : Use KMS encryption for S3 buckets and SNS topics containing sensitive data



