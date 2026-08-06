# AgentCore generated runtime observability data - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-runtime-metrics.html

---

# AgentCore generated runtime observability data

The runtime metrics provided by AgentCore give you visibility into your agent execution activity levels, processing latency, resource utilization, and error rates. AgentCore also provides aggregated metrics for total invocations and sessions.

###### Topics

  * Observability runtime metrics

  * Resource usage metrics and logs

  * Provided span data

  * Application log data

  * Error types


## Observability runtime metrics

The following list describes the runtime metrics provided by AgentCore. Runtime metrics are batched at one minute intervals. To learn more about viewing runtime metrics, see [View observability data for your Amazon Bedrock AgentCore agents](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-view.html>).

Invocations
    

Shows the total number of requests made to the Data Plane API. Each API call counts as one invocation, regardless of the request payload size or response status.

Invocations (aggregated)
    

Shows the total number of invocations across all resources

Throttles
    

Displays the number of requests throttled by the service due to exceeding allowed TPS (Transactions Per Second) or quota limits. These requests return ThrottlingException with HTTP status code 429. Monitor this metric to determine if you need to review your service quotas or optimize request patterns.

System Errors
    

Shows the number of server-side errors encountered by AgentCore during request processing. High levels of server-side errors can indicate potential infrastructure or service issues that require investigation. See Error types for a list of possible error codes.

User Errors
    

Represents the number of client-side errors resulting from invalid requests. These require user action to resolve. High levels of client-side errors can indicate issues with request formatting or permissions that need to be addressed. See Error types for a list of possible error codes.

Latency
    

The total time elapsed between receiving the request and sending the final response token. Represents complete end-to-end processing time of the request.

Total Errors
    

The total number of system and user errors. In the Amazon Bedrock AgentCore console, this metric displays the number of errors as a percentage of the total number of invocations.

Session Count
    

Shows the number of new agent sessions created within the reporting period. Each session is counted once at creation time; subsequent invocations to the same session do not increment this metric. This is a cumulative counter, not a gauge of currently active sessions. Useful for monitoring overall platform usage, trending session creation rates, and understanding user engagement patterns.

Sessions (aggregated)
    

Shows the total number of new sessions created across all resources within the reporting period.

ActiveSessionCount
    

Shows the number of currently active sessions for your account. Unlike the `SessionCount` metric (a cumulative counter), this metric is a real-time gauge showing how many sessions are running at any given moment. Amazon Bedrock AgentCore publishes this metric once per minute per service type. Use it to monitor current capacity utilization, set alarms for unexpected usage spikes, and understand your session quota consumption. Use the `Service` dimension — with values `AgentCore.Runtime`, `AgentCore.CodeInterpreter`, or `AgentCore.Browser` — to filter this metric by workload type. Amazon Bedrock AgentCore publishes this metric directly to your AWS account in the `AWS/Bedrock-AgentCore` namespace.

ActiveStreamingConnections
    

**(WebSocket only)** Shows the current number of active WebSocket connections per agent. Monitor this metric to understand connection usage and detect connection drops or spikes for capacity planning. The only meaningful statistic is a 1-minute sum.

InboundStreamingBytesProcessed
    

**(WebSocket only)** Displays the total number of bytes successfully processed in WebSocket frames received from clients to agent containers. Use this metric to monitor data throughput and identify usage patterns.

OutboundStreamingBytesProcessed
    

**(WebSocket only)** Shows the total number of bytes successfully processed in WebSocket frames sent from agent containers to clients. Monitor this metric to understand agent response patterns and ensure successful data transmission.

## Resource usage metrics and logs

Amazon Bedrock AgentCore runtime provides comprehensive resource usage telemetry, including CPU and memory consumption metrics for your runtime resources.

###### Note

Resource usage data may be delayed by up to 60 minutes and precision might differ across metrics.

**Vended metrics**

Amazon Bedrock AgentCore runtime automatically provides resource usage metrics at account, agent runtime, and agent endpoint levels. These metrics are published at 1-minute resolution. Amazon CloudWatch aggregation and metric data retention will follow standard Amazon CloudWatch data retention polices. For more information, see <https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Metric>.

Here are the dimension sets and metrics available for monitoring your resources:

Name | Dimensions | Description  
---|---|---  
CPUUsed-vCPUHours |  Service; Service, Resource; Service, Resource, Name |  The total amount of virtual CPU consumed in vCPU-Hours unit, available at the resource and account levels. Useful for resource tracking and estimated billing visibility.  
MemoryUsed-GBHours |  Service; Service, Resource; Service, Resource, Name |  The total amount of memory consumed in GB-Hours unit, available at the resource and account levels. Useful for resource tracking and estimated billing visibility.  
  
Dimension explanation

  * **Service** \- AgentCore.Runtime

  * **Resource** \- Agent Arn

  * **Name** \- Agent Endpoint name, in the format of AgentName::EndpointName


Account level metrics are available in Amazon CloudWatch Bedrock AgentCore Observability Console under the **Runtime** tab. The dashboard displays Memory and CPU usage graphs generated from these metrics, representing total resource usage across all agents in your account within the region.

Agent Endpoint level metrics are available in AgentEndpoint page of Amazon CloudWatch Bedrock AgentCore Observability Console. The dashboard displays Memory and CPU usage graphs generated from these metrics, representing total resource usage across all sessions invoked by the specified Agent Endpoint.

###### Note

Telemetry data is provided for monitoring purposes. Actual billing is calculated based on metered usage data and may differ from telemetry values due to aggregation timing, reconciliation processes, and measurement precision. Refer to your AWS billing statement for authoritative charges.

**Vended logs**

Bedrock AgentCore Runtime provides vended logs for session-level usage metrics at 1-second granularity. Each log record contains resource consumption data including CPU usage (agent.runtime.vcpu.hours.used) and memory consumption (agent.runtime.memory.gb_hours.used).

Each log record will have following schema:

Log type | Log fields | Description  
---|---|---  
USAGE_LOGS |  event_timestamp, resource_arn, service.name, cloud.provider, cloud.region, account.id, region, resource.id, session.id, agent.name, elapsed_time_seconds, agent.runtime.vcpu.hours.used, agent.runtime.memory.gb_hours.used |  Resource Usage Logs for session-level resource tracking.  
  
To enable USAGE_LOG log type for your agents, see [Add observability to your Amazon Bedrock AgentCore resources](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-configure.html>) . The logs are then displayed in the configured destination (AWS LogGroup, Amazon S3 or Amazon Kinesis Firehose) as configured.

In the Agent Session page of the Amazon CloudWatch Bedrock AgentCore Observability Console, you can see resource usage metrics generated from these logs. To optimize your metric viewing experience, select your desired time range using the selector in the top right to focus on specific CPU and Memory Usage data.

###### Note

Telemetry data is provided for monitoring purposes. Actual billing is calculated based on metered usage data and may differ from telemetry values due to aggregation timing, reconciliation processes, and measurement precision. Refer to your AWS billing statement for authoritative charges.

## Provided span data

To enhance observability, AgentCore provides structured spans that provide visibility into agent runtime invocations. To enable this span data, you need to enable observability on your agent resource. See [Add observability to your Amazon Bedrock AgentCore resources](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-configure.html>) for steps and details. This span data is available in Amazon CloudWatch Logs. Spans appear in the agent’s log group (`/aws/bedrock-agentcore/runtimes/<agent_id>-<endpoint_name>`), or in the `aws/spans` log group for agents that use the shared span destination. For more information, see [Span destination for agents hosted in Amazon Bedrock AgentCore runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-configure.html#observability-configure-unified-traces>). The following table defines the operation for which spans are created and the attributes for each captured span.

Operation name | Span attributes | Description  
---|---|---  
InvokeAgentRuntime |  aws.operation.name, aws.resource.arn, aws.request_id, aws.agent.id, aws.endpoint.name, aws.account.id, session.id, latency_ms, error_type, aws.resource.type, aws.xray.origin, aws.region |  Invokes the agent runtime.  
  
  * aws.operation.name - the operation name (InvokeAgentRuntime)

  * aws.resource.arn - the Amazon resource name for the agent runtime

  * aws.request_id - request ID for the invocation

  * aws.agent.id - the unique identifier for the agent runtime

  * aws.endpoint.name - the name of the endpoint used to invoke the agent runtime

  * aws.account.id - customer’s account id

  * session.id - the session ID for the invocation

  * latency_ms - the latency of the request in milliseconds

  * error_type - either throttle, system, or user (only present if error)

  * aws.resource.type - the CFN resource type

  * aws.xray.origin - the CFN resource type used by x-ray to identify the service

  * aws.region - the region the customer resource exists in


## Application log data

AgentCore provides structured Application logs that help you gain visibility into your agent runtime invocations and session-level resource consumption. This log data is provided when enabling observability on your agent resource. See [Add observability to your Amazon Bedrock AgentCore resources](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-configure.html>) for steps and details. AgentCore can output logs to CloudWatch Logs, Amazon S3, or Firehose stream. If you use a CloudWatch Logs destination, these logs are stored under your agent’s application logs or under your own custom log group.

Log type | Log fields | Description  
---|---|---  
APPLICATION_LOGS |  timestamp, resource_arn, event_timestamp, account_id, request_id, session_id, trace_id, span_id, service_name, operation, request_payload, response_payload |  Application logs for InvokeRuntimeOperation with tracing fields, request, and response payloads  
  
  * request_payload - the request payload of the agent invocation

  * response_payload - the response from the agent invocation


## Error types

The following list defines the possible error types for user, system, and throttling errors.

**User error codes**

  * `InvocationError.Validation` \- Client provided invalid input (400)

  * `InvocationError.ResourceNotFound` \- Requested resource doesn’t exist (404)

  * `InvocationError.AccessDenied` \- Client lacks permissions (403)

  * `InvocationError.Conflict` \- Resource conflict (409)


**System error codes**

  * `InvocationError.Internal` \- Internal server error (500)


**Throttling error codes**

  * `InvocationError.Throttling` \- Rate limiting (429)

  * `InvocationError.ServiceQuota` \- Service-side quota/limit reached (402)



