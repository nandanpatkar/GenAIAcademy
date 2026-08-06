# AgentCore generate memory observability data - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-memory-metrics.html

---

# AgentCore generate memory observability data

For the AgentCore memory resource type, AgentCore outputs metrics to Amazon CloudWatch by default. AgentCore also outputs a default set of spans and logs, if you enable these. See [Enabling observability for AgentCore runtime, memory, gateway, built-in tools, and identity resources](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-configure.html#observability-configure-cloudwatch>) to learn more about enabling spans and logs.

Refer to the following sections to learn more about the provided observability data for your agent memory stores.

## Provided memory metrics

The AgentCore memory resource type provides the following metrics by default.

Latency
    

The total time elapsed between receiving the request and sending the final response token. Represents complete end-to-end processing of the request.

Invocations
    

The total number of API requests made to the data plane and control plane. This metric also tracks the number of memory ingestion events.

System Errors
    

Number of invocations that result in AWS server-side errors.

User Errors
    

Number of invocations that result in client-side errors.

Errors
    

Total number of errors that occur while processing API requests in the data plane and control plane. This metric also tracks the total errors that occur during memory ingestion.

Throttles
    

Number of invocations that the system throttled. Throttled requests count as invocations, errors, and user errors.

Creation Count
    

Counts the number of created memory events and memory records.

## Provided span data

To enhance observability, AgentCore provides structured spans that trace the relationship between events and the memories they generate or access. To enable this span data, you need to instrument your agent code. See [Add observability to your Amazon Bedrock AgentCore resources](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-configure.html>) to learn more.

This span data is available in full in CloudWatch Logs and CloudWatch Application Signals. To learn more about viewing observability data, see [View observability data for your Amazon Bedrock AgentCore agents](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-view.html>).

The following table defines the operations for which spans are created and the attributes for each captured span.

Operation name | Span attributes | Description  
---|---|---  
`CreateEvent` |  `memory.id` , `session.id` , `event.id` , `actor.id` , `throttled` , `error` , `fault` |  Creates a new event within a memory session  
`GetEvent` |  `memory.id` , `session.id` , `event.id` , `actor.id` , `throttled` , `error` , `fault` |  Retrieves an existing memory event  
`ListEvents` |  `memory.id` , `session.id` , `event.id` , `actor.id` , `throttled` , `error` , `fault` |  Lists events within a session  
DeleteEvent |  `memory.id` , `session.id` , `event.id` , `actor.id` , `throttled` , `error` , `fault` |  Deletes an event from memory  
RetrieveMemoryRecords |  `memory.id` , `namespace` , `throttled` , `error` , `fault` |  Retrieves memory records for a given namespace  
ListMemoryRecords |  `memory.id` , `namespace` , `throttled` , `error` , `fault` |  Lists available memory records  
  
## Provided log data

AgentCore provides structured logs that help you monitor and troubleshoot key AgentCore Memory resource processes. To enable this log data, you need to instrument your agent code. See [Add observability to your Amazon Bedrock AgentCore resources](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-configure.html>) to learn more.

AgentCore can output logs to CloudWatch Logs, Amazon S3, or Firehose stream. If you use a CloudWatch Logs destination, these logs are stored under the default log group `/aws/vendedlogs/bedrock-agentcore/memory/APPLICATION_LOGS/{memory_id}` or under a custom log group starting with `/aws/vendedlogs/` . See [Enabling observability for AgentCore runtime, memory, gateway, built-in tools, and identity resources](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-configure.html#observability-configure-cloudwatch>) to learn more.

When the `DeleteMemory` operation is called, logs are generated for the start and completion of the deletion process. Any corresponding deletion error logs will be provided with insights into why the call failed.

We also provide logs for various stages in the long-term memory creation process, namely extraction and consolidation. When new short term memory events are provided, AgentCore extracts key concepts from responses to begin the formation of new long-term memory records. Once these have been created, they are integrated with existing memory records to create a unified store of distinct memories.

See the following breakdown to learn how each workflow helps you monitor the formation of new memories:

**Extraction logs**

  * Start and completion of extraction processing

  * Number of memories successfully extracted

  * Any errors in deserializing or processing input events


**Consolidation logs:**

  * Start and completion of consolidation processing

  * Number of memories requiring consolidation

  * Success/failure of memory additions and updates

  * Related memory retrieval status


The following table provides a more detailed breakdown of how different memory resource workflows use log fields alongside the log body itself to provide request-specific information.

Workflow name | Log fields | Description  
---|---|---  
Extraction |  resource_arn, event_timestamp, memory_strategy_id, namespace, actor_id, session_id, event_id, requestId, isError |  Analyzes incoming conversations to generate new memories  
Consolidation |  resource_arn, event_timestamp, memory_strategy_id, namespace, session_id, requestId, isError |  Combines extracted memories with existing memories

