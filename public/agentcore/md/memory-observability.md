# Observability - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-observability.html

---

# Observability

You can monitor usage metrics for your memory in CloudWatch metrics. Some of the critical metrics are displayed in AgentCore Memory console.

![AgentCore Memory observability](/agentcore/images/memory-obs.png)

**CloudWatch metrics** : AgentCore Memory emits metrics to CloudWatch under the `Bedrock-AgentCore` namespace. The metrics contains:

  * Data plane usage statistics: CreateEvent/RetrieveMemoryRecord `Invocations` , `Latency` , `Errors` , etc

  * Ingestion metrics: `Invocations` , `Latency` , `Errors` `NumberOfMemoryRecords` for extraction/consolidation step during ingestion in each memory resource.


![AgentCore Memory observability](/agentcore/images/memory-logs.png)

In addition to CloudWatch metrics, customer can monitor the memory extraction process via CloudWatch logs if they enabled log delivery. Application logs during ingestion will be published to a log group in customer account. Customer can use the application logs to debug any errors encountered during asynchronous ingestion process.

For more information, see [Observe your agent applications on Amazon Bedrock AgentCore Observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability.html>).

