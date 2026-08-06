# AgentCore generated built-in tools observability data - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-tool-metrics.html

---

# AgentCore generated built-in tools observability data  
  
###### Topics

  * Observability tools metrics

  * Resource usage metrics and logs

  * Provided span data

  * Application log data


## Observability tools metrics

AgentCore provides the following built-in metrics for the code interpreter and browser tools. Built-in tool metrics are batched at one minute intervals. To learn more about AgentCore tools, see [Execute code and analyze data using Amazon Bedrock AgentCore Code Interpreter](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-interpreter-tool.html>) and [Interact with web applications using Amazon Bedrock AgentCore Browser](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-tool.html>).

**Invoke tool:**

Invocations
    

The total number of requests made to the Data Plane API. Each API call counts as one invocation, regardless of the request payload size or response status.

Throttles
    

The number of requests throttled by the service due to exceeding allowed TPS (Transactions Per Second) or quota limits. These requests return ThrottlingException with HTTP status code 429.

SystemErrors
    

The number of server-side errors encountered during request processing.

UserErrors
    

The number of client-side errors resulting from invalid requests. This require user action in order to resolve.

Latency
    

The time elapsed between when the service receives the request and when it begins sending the first response token. Important for measuring initial response time.

**Create tool session:**

Invocations
    

The total number of requests made to the Data Plane API. Each API call counts as one invocation, regardless of the request payload size or response status.

Throttles
    

The number of requests throttled by the service due to exceeding allowed TPS (Transactions Per Second) or quota limits. These requests return ThrottlingException with HTTP status code 429.

SystemErrors
    

The number of server-side errors encountered during request processing.

UserErrors
    

The number of client-side errors resulting from invalid requests. This require user action in order to resolve.

Latency
    

The time elapsed between when the service receives the request and when it begins sending the first response token. Important for measuring initial response time.

Duration
    

The duration of tool session (Operation becomes CodeInterpreterSession/BrowserSession).

**Browser user takeover:**

TakerOverCount
    

The total number of user taking over

TakerOverReleaseCount
    

The total number of user releasing control

TakerOverDuration
    

The duration of user taking over

## Resource usage metrics and logs

Amazon Bedrock AgentCore Built-in Tools provides comprehensive resource usage telemetry, including CPU and memory consumption metrics for your runtime resources.

###### Note

Resource usage data may be delayed by up to 60 minutes and precision might differ across metrics.

**Vended metrics**

By default, Bedrock AgentCore Built-in Tools vends metrics for Account level and Tool level at 1-minute resolution. Amazon CloudWatch aggregation and metric data retention follow standard Amazon CloudWatch data retention polices. For more information, see <https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Metric>.

Name | Dimensions | Description  
---|---|---  
CPUUsed-vCPUHours |  Service; Service, Resource |  The total amount of virtual CPU consumed in vCPU-Hours unit, available at the resource and account level. Useful for resource tracking and estimated billing visibility.  
MemoryUsed-GBHours |  Service; Service, Resource |  The total amount of memory consumed in GB-Hours unit, available at the resource and account levels. Useful for resource tracking and estimated billing visibility.  
  
Dimension explanation

  * **Service** \- AgentCore.CodeInterpreter or AgentCore.Browser

  * **Resource** \- Built-in tool Id


Account level metrics are available in the Amazon CloudWatch Bedrock AgentCore Observability Console under **Built-in Tools** tab. The dashboard on the console will contain a Memory usage graph and a CPU usage graph generated from the usage metrics. These graphs represent the total resource usage across all tools of the selected tool type in the account in the region.

Tool level metrics are available in **Tools** page of the Amazon CloudWatch Bedrock AgentCore Observability Console. The dashboard on the console will contain a Memory usage graph and a CPU usage graph generated from the usage metrics. The graphs represent the total resource usage across all sessions of the selected tool.

###### Note

Telemetry data is provided for monitoring purposes. Actual billing is calculated based on metered usage data and may differ from telemetry values due to aggregation timing, reconciliation processes, and measurement precision. Refer to your AWS billing statement for authoritative charges.

**Vended Logs**

Amazon Bedrock AgentCore Built-in Tools provides the ability to enabled vended logs for session level usage telemetry at 1-second granularity. Each log record contains 1 second Resource Usage datum. Currently supported metrics include:

  * Code Interprefer codeInterpreter.vcpu.hours.used and codeInterpreter.memory.gb_hours.used

  * Browser browser.vcpu.hours.used and browser.memory.gb_hours.used


Each resource usage datum will use the following schema in the log record.

**Code Interpreter**

Log type | Log fields | Description  
---|---|---  
USAGE_LOGS |  event_timestamp, resource_arn, service.name, cloud.provider, cloud.region, account.id, region, resource.id, session.id, elapsed_time_seconds, codeInterpreter.vcpu.hours.used, codeInterpreter.memory.gb_hours.used |  Resource Usage Logs for session-level resource tracking.  
  
**Browser**

Log type | Log fields | Description  
---|---|---  
USAGE_LOGS |  event_timestamp, resource_arn, service.name, cloud.provider, cloud.region, account.id, region, resource.id, session.id, elapsed_time_seconds, browser.vcpu.hours.used, browser.memory.gb_hours.used |  Resource Usage Logs for session-level resource tracking.  
  
For more information about enabling logs, see [Add observability to your Amazon Bedrock AgentCore resources](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-configure.html>) . These logs are theyn displayed in the destination as configured (AWS LogGroup, Amazon S3, or Amazon Kinesis Firehose.

In the Built-in Tools Session page of the Amazon CloudWatch Bedrock AgentCore Observability Console, you can see resource usage metrics generated from these logs. To optimize your metric viewing experience, select your desired time range using the selector in the top right to focus on specific CPU and Memory Usage data.

###### Note

Telemetry data is provided for monitoring purposes. Actual billing is calculated based on metered usage data and may differ from telemetry values due to aggregation timing, reconciliation processes, and measurement precision. Refer to your AWS billing statement for authoritative charges.

## Provided span data

To enhance observability, AgentCore provides structured spans that provide visibility into built-in tools APIs. To enable this span data, you need to enable observability on your built-in tool resource. See [Add observability to your Amazon Bedrock AgentCore resources](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-configure.html>) for steps and details. This span data is available in full in AWS CloudWatch Logs in the aws/spans log group. The following table defines the operation for which spans are created and the attributes for each captured span.

**Code interpreter**

Operation name | Span attributes | Description  
---|---|---  
StartCodeInterpreterSession |  aws.operation.name, aws.resource.arn, aws.request.id, aws.account.id, toolsession.id, aws.xray.origin, aws.resource.type, aws.region, latency_ms, error_type |  Starts a code interpreter session.  
StopCodeInterpreterSession |  aws.operation.name, aws.resource.arn, aws.request.id, aws.account.id, toolsession.id, aws.xray.origin, aws.resource.type, aws.region, latency_ms, error_type, session_duration_s |  Stops a code interpreter session.  
InvokeCodeInterpreter |  aws.operation.name, aws.resource.arn, aws.request.id, aws.account.id, toolsession.id, aws.xray.origin, aws.resource.type, aws.region, latency_ms, error_type |  Invokes a code interpreter with input code.  
CodeInterpreterSessionExpire |  aws.operation.name, aws.resource.arn, aws.request.id, aws.account.id, toolsession.id, aws.xray.origin, aws.resource.type, aws.region, latency_ms, error_type, session_duration_s |  Expires a code interpreter session if StopCodeInterpreterSession is not called and the session times out.  
  
  * toolsession.id - the id of the tool session

  * session_duration_s - the duration of the session in seconds before it ended


**Browser**

Operation name | Span attributes | Description  
---|---|---  
StartBrowserSession |  aws.operation.name, aws.resource.arn, aws.request.id, aws.account.id, toolsession.id, aws.xray.origin, aws.resource.type, aws.region, latency_ms, error_type |  Starts a browser session.  
StopBrowserSession |  aws.operation.name, aws.resource.arn, aws.request.id, aws.account.id, toolsession.id, aws.xray.origin, aws.resource.type, aws.region, latency_ms, error_type, session_duration_s |  Stops a browsersession.  
ConnectBrowserAutomationStream |  aws.operation.name, aws.resource.arn, aws.request.id, aws.account.id, toolsession.id, aws.xray.origin, aws.resource.type, aws.region, latency_ms, error_type |  Connect to a browser automation stream.  
BrowserSessionExpire |  aws.operation.name, aws.resource.arn, aws.request.id, aws.account.id, toolsession.id, aws.xray.origin, aws.resource.type, aws.region, latency_ms, error_type, session_duration_s |  Expires a code interpreter session if StopBrowserSession is not called and the session times out.  
  
## Application log data

AgentCore provides structured Application logs that help you gain visibility into your agent runtime invocations and session-level resource consumption. This log data is provided when enabling observability on your agent resource. See [Add observability to your Amazon Bedrock AgentCore resources](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-configure.html>) for steps and details. AgentCore can output logs to CloudWatch Logs, Amazon S3, or Firehose stream. If you use a CloudWatch Logs destination, these logs are stored under your agent’s application logs or under your own custom log group.

Log type | Log fields | Description  
---|---|---  
APPLICATION_LOGS |  timestamp, resource_arn, event_timestamp, account_id, request_id, session_id, trace_id, span_id, service_name, operation, request_payload, response_payload |  Application logs for InvokeCodeInterpreter with tracing fields, request, and response payloads

