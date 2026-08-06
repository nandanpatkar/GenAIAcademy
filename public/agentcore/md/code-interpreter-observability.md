# Observability - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-observability.html

---

# Observability

The AgentCore Code Interpreter provides the following observability features:

Execution logs
    

Code interpreter execution console logs are not available in CloudWatch, but stdout/stderr details are directly available in each invocation.

Metrics
    

You can view the following metrics in Amazon CloudWatch:

  * Session counts: The number of sessions that Code Interpreter session has been requested

  * Duration: The duration of sessions that Code Interpreter is running

  * Invocations: The total number of times for each tool has been invoked

  * Request latency: The latency of each request

  * Throttles: The number of times requests to the tool have been throttled due to exceeding limits, with percentage change compared to the previous week

  * User errors/system errors: The number of times requests failed due to either user error or system error


These metrics can be used to monitor the usage and performance of your code interpreter sessions, set up alarms for abnormal behavior, and optimize your resource allocation.

For more information, see [AgentCore generated built-in tools observability data](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-tool-metrics.html>).

