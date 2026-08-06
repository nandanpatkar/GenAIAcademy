# AgentCore generated gateway observability data - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-gateway-metrics.html

---

# AgentCore generated gateway observability data

The following sections describe the gateway metrics, logs, and spans output by AgentCore to Amazon CloudWatch. These metrics aren’t available on the CloudWatch generative AI observability page. Gateway metrics are batched at one minute intervals. To learn more about viewing gateway metrics, see [View observability data for your Amazon Bedrock AgentCore agents](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-view.html>).

###### Note

To enable service-provided logs for AgentCore gateways, you need to configure the necessary CloudWatch resources. See [Enabling observability for AgentCore runtime, memory, gateway, built-in tools, and identity resources](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-configure.html#observability-configure-cloudwatch>) to learn more.

###### Topics

  * Provided metrics

  * Provided log data

  * Provided spans


## Provided metrics

Gateway publishes invocation and usage metrics to CloudWatch. You can view these metrics and also set up alarms to alert you when certain metrics exceed thresholds. To learn more, select a topic:

###### Topics

  * Invocation metrics

  * Usage metrics

  * View gateway CloudWatch metrics

  * Setting up CloudWatch alarms


### Invocation metrics

These metrics provide information about API invocations, performance, and errors.

For these metrics, the following dimensions are used:

  * **Operation** – The name of the API operation (ex. InvokeGateway).

  * **Protocol** – The name of the protocol (ex. MCP).

  * **Method** – Represents the MCP operation being invoked (ex. tools/list).

  * **Resource** – Represents the identifier of the resource (ex. gateway ARN).

  * **Name** – Represents the name of the tool.


Metric | Description | Statistics | Units  
---|---|---|---  
Invocations |  The total number of requests made to each Data Plane API. Each API call counts as one invocation regardless of the response status. |  Sum |  Count  
Throttles |  The number of requests throttled (status code 429) by the service. |  Sum |  Count  
SystemErrors |  The number of requests which failed with 5xx status code. |  Sum |  Count  
UserErrors |  The number of requests which failed with 4xx status code except 429. |  Sum |  Count  
Latency |  The time elapsed between when the service receives the request and when it begins sending the first response token. In other words, initial response time. |  Average, Minimum, Maximum, p50, p90, p99 |  Milliseconds  
Duration |  The total time elapsed between receiving the request and sending the final response token. Represents complete end-to-end processing time of the request. |  Average, Minimum, Maximum, p50, p90, p99 |  Milliseconds  
TargetExecutionTime |  The total time taken to execute the target over Lambda / OpenAPI / etc. This helps determine the contribution of the target to the total Latency. |  Average, Minimum, Maximum, p50, p90, p99 |  Milliseconds  
  
### Usage metrics

These metrics provide information about how your gateway is being used.

Metric | Description | Statistics | Units  
---|---|---|---  
TargetType |  The total number of requests served by each type of target (MCP, Lambda, OpenAPI). |  Sum |  Count  
  
### View gateway CloudWatch metrics

For more information about viewing CloudWatch metrics, see [View available metrics](<https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/viewing_metrics_with_cloudwatch.html>) in the [Amazon CloudWatch User Guide](<https://docs.aws.amazon.com/AmazonCloudWatch/latest/DeveloperGuide/>) . The following procedure shows you how to view metrics for your gateways:

**To view gateway metrics in the console**

  1. Open the CloudWatch console at [https://console.aws.amazon.com/cloudwatch/](<https://console.aws.amazon.com/cloudwatch/>).

  2. In the left navigation pane, choose **All metrics** under the **Metrics** section.

  3. Under **Browse** , from the dropdown menu that displays the current AWS Region, select the Region for which you want metrics.

  4. Choose the **AWS/Bedrock-AgentCore** namespace.

  5. Choose a dimension (ex. **Operation** ) or combination of dimensions (ex. **Method, Operation, Protocol** ) to view the metrics for it.

  6. To add a metric to the CloudWatch graph, select the checkbox next to it.


### Setting up CloudWatch alarms

You can use the [PutMetricAlarm](<https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutMetricAlarm.html>) API operation to set up CloudWatch alarms to alert you when certain metrics exceed thresholds. For example, you might want to be notified when the error rate exceeds 5% or when the latency exceeds 1 second.

The following example shows you how to create an alarm for high error rates using the AWS CLI:

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "HighErrorRate" \
  --alarm-description "Alarm when error rate exceeds 5%" \
  --metric-name "SystemErrors" \
  --namespace "AWS/Bedrock-AgentCore" \
  --statistic "Sum" \
  --dimensions "Name=Resource,Value=my-gateway-arn" \
  --period 300 \
  --evaluation-periods 1 \
  --threshold 5 \
  --comparison-operator "GreaterThanThreshold" \
  --alarm-actions "arn:aws:sns:us-west-2:123456789012:my-topic"
```
This alarm will trigger when the number of system errors exceeds 5 in a 5-minute period. When the alarm triggers, it will send a notification to the specified SNS topic.

## Provided log data

AgentCore provides logs that help you monitor and troubleshoot key AgentCore gateway resource processes. To enable this log data, you need to create a log destination.

AgentCore can output logs to CloudWatch Logs, Amazon S3, or Firehose stream. If you use a CloudWatch Logs destination, these logs are stored under the default log group `/aws/vendedlogs/bedrock-agentcore/gateway/APPLICATION_LOGS/{gateway_id}` or under a custom log group starting with `/aws/vendedlogs/` . See [Enabling observability for AgentCore runtime, memory, gateway, built-in tools, and identity resources](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-configure.html#observability-configure-cloudwatch>) to learn more.

AgentCore logs the following information for gateway resources:

  * Start and completion of gateway requests processing

  * Error messages for Target configurations

  * MCP Requests with missing or incorrect authorization headers

  * MCP Requests with incorrect request parameters (tools, method)


You can also see request and response bodies as part of your Vended Logs integration when any of the MCP Operations are performed on the Gateway. They can do further analysis on these logs, using the `span_id` and `trace_id` fields to connect the vended spans and logs being emitted. For more information about encrypting your gateways with customer-managed KMS keys, see [Advanced features and topics for Amazon Bedrock AgentCore Gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-advanced.html>).

Sample log:

```json
{
    "resource_arn": "arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/<gatewayid>",
    "event_timestamp": 1759370851622,
    "body": {
        "isError": false,
        "log": "Started processing request with requestId: 1",
        "requestBody": "{id=1, jsonrpc=2.0, method=tools/call, params={name=target-quick-start-f9scus___LocationTool, arguments={location=seattle}}}",
        "id": "1"
    },
    "account_id": "123456789012",
    "request_id": "12345678-1234-1234-1234-123456789012",
    "trace_id": "160fc209c3befef4857ab1007d041db0",
    "span_id": "81346de89c725310"
}
```
Sample log with response body:

```json
{
    "resource_arn": "arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/<gatewayid>",
    "event_timestamp": 1759370853807,
    "body": {
        "isError": false,
        "responseBody": "{jsonrpc=2.0, id=1, result={isError=false, content=[{type=text, text=\"good\"}]}}",
        "log": "Successfully processed request with requestId: 2",
        "id": "1"
    },
    "account_id": "123456789012",
    "request_id": "12345678-1234-1234-1234-123456789012",
    "trace_id": "160fc209c3befef4857ab1007d041db0",
    "span_id": "81346de89c725310"
}
```
## Provided spans

AgentCore supports OTEL compliant vended spans that you can use to track invocations across different primitives that are being used.

Sample vended Spans for Tool Invocation:

  * `kind:SERVER` \- tracks the overall execution details, tool invoked, gateway details, AWS request ID, trace and span ID.

  * `kind:CLIENT` \- covers the specific target that was invoked and details around it like target type, target execution time, target execution start and end times, etc.


For other MCP method invocations, only the `kind:SERVER` span is emitted.

While these spans emit metrics, to investigate why a failure occurred for a specific span, a Gateway user must check the logs that are vended. Various fields, for example, `spanId` or `aws.request.id` can help in stitching these spans and logs together.

Operation | Span attributes | Description  
---|---|---  
List Tools |  aws.operation.name, aws.resource.arn, aws.request.id, aws.account.id, gateway.id, aws.xray.origin, aws.resource.type, aws.region, latency_ms, error_type, jsonrpc.error.code, http.method, http.response.status_code, gateway.name, url.path, overhead_latency_ms |  List tools attached to a gateway  
Call Tool |  aws.operation.name, aws.resource.arn, aws.request.id, aws.account.id, gateway.id, aws.xray.origin, aws.resource.type, aws.region, latency_ms, error_type, jsonrpc.error.code, http.method, http.response.status_code, gateway.name, url.path, overhead_latency_ms, tool.name |  Call a specific tool. Two spans are emmited: 1. `kind:SERVER` which tracks the overall execution details (success / not) , tool invoked, gateway details, AWS request ID, trace and span ID. 2. `kind:CLIENT` which covers the specific target that was invoked and details around it like target type, target execution time, target execution start and end times, etc.  
Search Tools |  aws.operation.name, aws.resource.arn, aws.request.id, aws.account.id, gateway.id, aws.xray.origin, aws.resource.type, aws.region, latency_ms, error_type, jsonrpc.error.code, http.method, http.response.status_code, gateway.name, url.path, overhead_latency_ms, tool.name |  Search for ten most relevant tools given an input query

