# Memory record streaming - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-record-streaming.html

---

# Memory record streaming

Memory record streaming in Amazon Bedrock AgentCore Memory delivers real-time notifications when memory records are created, updated, or deleted. Instead of polling APIs to detect changes, you receive push-based events to a Kinesis Data Stream in your account, enabling event-driven architectures that react to memory record lifecycle changes as they occur.

With memory record streaming, you can:

  * Receive real-time events for memory record creation, updates, and deletion

  * Build event-driven architectures without polling APIs

  * Stream memory record data into data lakes for consolidation and profile management

  * Trigger downstream workflows when new insights are extracted

  * Track memory record state changes across agents and sessions


###### Topics

  * How it works

  * Stream event types

  * Event schema

  * Prerequisites

  * Set up streaming

  * Configure event content level

  * Test your implementation

  * Manage streaming configuration

  * Observability


## How it works

Memory record streaming uses a push-based delivery model. When memory records change, events are automatically published to your Kinesis Data Stream.

Events are triggered by the following operations:

  1. **Creation** – Asynchronous extraction from short-term memory events (via `CreateEvent` and memory strategies), or direct creation via `BatchCreateMemoryRecords` API

  2. **Updates** – Direct modification via `BatchUpdateMemoryRecords` API

  3. **Deletion** – Consolidation workflows (de-duplication/superseding), `DeleteMemoryRecord` API, or `BatchDeleteMemoryRecords` API


## Stream event types

The following table describes the supported stream event types and when they are triggered.

Operation | Stream event type | Triggered by  
---|---|---  
Create |  `MemoryRecordCreated` |  Long term memory extraction/consolidation, `BatchCreateMemoryRecords` API  
Update |  `MemoryRecordUpdated` |  `BatchUpdateMemoryRecords` API  
Delete |  `MemoryRecordDeleted` |  `BatchDeleteMemoryRecords` , `DeleteMemoryRecord` API, long term memory consolidation  
  
## Event schema

### MemoryRecordCreated / MemoryRecordUpdated

`MemoryRecordCreated` and `MemoryRecordUpdated` events share the same schema.

```json
{
  "memoryStreamEvent": {
    "eventType": "<MemoryRecordCreated, MemoryRecordUpdated>",
    "eventTime": "2026-03-06T16:45:00.000Z",
    "memoryId": "<memory-id>",
    "memoryRecordId": "<memory-record-id>",
    "namespaces": ["<namespace>"],
    "createdAt": 1736622300000,
    "memoryStrategyId": "<memory-strategy-id>",
    "memoryStrategyType": "<memory-strategy-type>",
    "metadata": {<metadata>},
    "memoryRecordText": "<memory-record-text>"
  }
}
```
The `memoryRecordText` field is only included when the content level on the stream delivery configuration is set to `FULL_CONTENT` . See Configure event content level for additional details.

### MemoryRecordDeleted

```json
{
  "memoryStreamEvent": {
    "eventType": "MemoryRecordDeleted",
    "eventTime": "2026-02-16T00:13:54.912530116Z",
    "memoryId": "<memory-id>",
    "memoryRecordId": "<memory-record-id>"
  }
}
```
Deletion events contain only the memory and record identifiers, regardless of the configured content level.

## Prerequisites

Before setting up memory record streaming, verify you have:

  * An AWS account with appropriate permissions

  * Amazon Bedrock AgentCore access

  * Basic understanding of AWS IAM and Amazon Kinesis Data Streams


## Set up streaming

### Step 1: Create a Kinesis Data Stream

Create a Kinesis Data Stream in your account where Amazon Bedrock AgentCore will publish memory record lifecycle events.

You can create the stream using the AWS Console, CDK, CloudFormation, or the AWS CLI. If you enable Kinesis server-side encryption, note the KMS key ARN — you’ll need it for the IAM role permissions.

### Step 2: Set up a consumer

Set up a consumer to process events from your Kinesis Data Stream.

Grant your consumer `AmazonKinesisReadOnlyAccess` (or equivalent permissions) and add the Kinesis Data Stream as a trigger.

### Step 3: Create an IAM role

Create an IAM role that Amazon Bedrock AgentCore can assume to publish events to your Kinesis Data Stream.

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
          "aws:SourceArn": "arn:aws:bedrock-agentcore:<region>:<account-id>:memory/*"
        }
      }
    }
  ]
}
```
Permissions policy:

For built-in memory strategies, the permissions policy looks like the following:

```json
{
"Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "kinesis:PutRecords",
        "kinesis:DescribeStream"
      ],
      "Resource": "arn:aws:kinesis:<region>:<account-id>:stream/<stream-name>"
    }
  ]
}
```
For custom memory strategies, the permissions policy looks like the following:

```json
{
"Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "kinesis:PutRecords",
        "kinesis:DescribeStream"
      ],
      "Resource": "arn:aws:kinesis:<region>:<account-id>:stream/<stream-name>"
    },
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": [
        "arn:aws:bedrock:*::foundation-model/*",
        "arn:aws:bedrock:*:*:inference-profile/*"
      ],
      "Condition": {
        "StringEquals": {
          "aws:ResourceAccount": "${aws:PrincipalAccount}"
        }
      }
    }
  ]
}
```
If your Kinesis Data Stream uses server-side encryption, add the following to the permissions policy:

```json
{
  "Sid": "KMSPermissions",
  "Effect": "Allow",
  "Action": "kms:GenerateDataKey",
  "Resource": "arn:aws:kms:<region>:<account-id>:key/your-kinesis-data-stream-key-id"
}
```
### Step 4: Create a memory with streaming enabled

Use the `CreateMemory` API to create an Amazon Bedrock AgentCore Memory with a stream delivery resource. You must provide the `memoryExecutionRoleArn` when specifying a stream delivery resource.

```bash
aws bedrock-agentcore-control create-memory \
  --name "MyStreamingMemory" \
  --description "Memory with long term memory record streaming enabled" \
  --event-expiry-duration 30 \
  --memory-execution-role-arn "arn:aws:iam::<account-id>:role/AgentCoreMemoryRole" \
  --stream-delivery-resources '{
    "resources": [
      {
        "kinesis": {
          "dataStreamArn": "arn:aws:kinesis:<region>:<account-id>:stream/<stream-name>",
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
### Step 5: Verify your streaming integration

When you create a memory with streaming enabled, Amazon Bedrock AgentCore Memory validates the configuration and permissions. Upon successful validation, a `StreamingEnabled` event is published to your Kinesis Data Stream.

Check your consumer for a validation event in the following format:

```json
{
  "memoryStreamEvent": {
    "eventType": "StreamingEnabled",
    "eventTime": "2026-03-03T19:27:08.344082626Z",
    "memoryId": "<memory-id>",
    "message": "Streaming enabled for memory resource: <memory-id>"
  }
}
```
## Configure event content level

The `contentConfigurations` field controls what data is included in each event. You can choose between two content levels:

  * **METADATA_ONLY** : Stream events only include metadata fields ( `memoryId` , `memoryRecordId` , `namespaces` , `strategyId` , timestamps, and so on). Requires an API call to retrieve the full memory record content.

  * **FULL_CONTENT** : Stream events include all metadata fields plus the `memoryRecordText` field containing the memory record content.


Use `METADATA_ONLY` for lightweight event notifications where you only need to know that a change occurred. Use `FULL_CONTENT` when your downstream processing needs the memory record text without making additional API calls.

## Test your implementation

### Step 1: Create test events

Use the Data Plane APIs to generate memory record lifecycle events and verify they appear in your consumer.

Create events via short-term memory (triggers asynchronous extraction):

```bash
aws bedrock-agentcore create-event \
  --memory-id "<memory-id>" \
  --actor-id "test-user" \
  --session-id "test-session-1" \
  --event-timestamp "$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")" \
  --payload '[
    {
      "conversational": {
        "content": {"text": "I prefer Italian restaurants with outdoor seating"},
        "role": "USER"
      }
    },
    {
      "conversational": {
        "content": {"text": "Noted! I will remember your preference for Italian restaurants with outdoor seating."},
        "role": "ASSISTANT"
      }
    }
  ]'
```
Create records directly:

```bash
aws bedrock-agentcore batch-create-memory-records \
  --memory-id "<memory-id>" \
  --records '[
    {
      "requestIdentifier": "test-1",
      "content": {"text": "User prefers window seats on flights"},
      "namespaces": ["travel/test-user"],
      "timestamp": "1729525989"
    }
  ]'
```
### Step 2: Verify delivery

Check your consumer to confirm events are being received. You should see `MemoryRecordCreated` events for records created through either method.

You can also monitor delivery health using Metrics and Logs.

You can use the `ListMemoryRecords` API to cross-reference:

```bash
aws bedrock-agentcore list-memory-records \
  --memory-id "<memory-id>" \
  --namespace "<namespace>"
```
## Manage streaming configuration

### Update streaming configuration

Use the `UpdateMemory` API to modify or remove the stream delivery resource.

Remove streaming:

```bash
aws bedrock-agentcore-control update-memory \
  --region us-east-1 \
  --memory-id "<memory-id>" \
  --stream-delivery-resources '{"resources": []}'
```
### Change content level

```bash
aws bedrock-agentcore-control update-memory \
  --memory-id "<memory-id>" \
  --stream-delivery-resources '{
    "resources": [
      {
        "kinesis": {
          "dataStreamArn": "arn:aws:kinesis:us-east-1:<account-id>:stream/<stream-name>",
          "contentConfigurations": [
            {
              "type": "MEMORY_RECORDS",
              "level": "METADATA_ONLY"
            }
          ]
        }
      }
    ]
  }'
```
## Observability

Amazon Bedrock AgentCore Memory vends CloudWatch metrics and logs to your AWS account, giving you visibility into the health and status of memory record stream delivery.

### Metrics

Metrics are published to your account under the `AWS/Bedrock-AgentCore` namespace.

Metric | Description  
---|---  
`StreamPublishingSuccess` |  The number of memory record events successfully published to your Kinesis Data Stream.  
`StreamPublishingFailure` |  The number of memory record events that failed to publish to your Kinesis Data Stream.  
`StreamUserError` |  The number of events that failed due to customer-side configuration issues, such as missing IAM permissions or an invalid KMS key state.  
  
All metrics are emitted as `Count` units with the following dimensions:

Dimension | Value | Description  
---|---|---  
Operation |  `MemoryStreamEvent` |  The streaming operation type.  
Resource |  Memory ARN |  The ARN of the memory resource (for example, `arn:aws:bedrock-agentcore:us-east-1:123456789012:memory/memory-123` ).  
  
### Logs

Amazon Bedrock AgentCore Memory vends logs to your account when terminal (non-retryable) publishing failures occur.

Field | Description  
---|---  
`log` |  Error message describing the failure.  
`streamArn` |  The target Kinesis Data Stream ARN.  
`errorCode` |  The specific error code.  
`errorMessage` |  A human-readable description of the error.  
`eventType` |  The stream event type ( `MemoryRecordCreated` , `MemoryRecordUpdated` , or `MemoryRecordDeleted` ).  
`memoryRecordId` |  The identifier of the affected memory record.

