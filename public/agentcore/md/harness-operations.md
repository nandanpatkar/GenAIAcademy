# Observability and cost controls - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-operations.html

---

# Observability and cost controls

This page covers monitoring your harness, controlling execution costs, and managing resource tags.

## Observability

Every harness invocation automatically generates traces, logs, and metrics through [AgentCore Observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability.html>) in CloudWatch. Model calls, tool invocations, memory operations, shell commands: each step appears with timing and payload details. No extra configuration. Traces are available from the first invocation.

###### Example

AWS CLI/boto3
    

Traces, logs, and metrics flow to CloudWatch through the harness execution role. View them in the [AgentCore Observability dashboard](<https://us-west-2.console.aws.amazon.com/cloudwatch/home?region=us-west-2#/gen-ai-observability/agent-core/agents>), or query programmatically through the CloudWatch Logs and X-Ray APIs.

Before you see traces, [enable Transaction Search in CloudWatch](<https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Enable-Lambda-TransactionSearch.html>) (one-time per account). See [AgentCore Observability getting started](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-get-started.html>) for setup details.

AgentCore CLI
     ```bash
     # Stream logs
     agentcore logs --harness research-agent

     # Filter
     agentcore logs --harness research-agent --since 1h --level error

     # List recent traces
     agentcore traces list --harness research-agent

     # Get a specific trace
     agentcore traces get <trace-id> --harness research-agent
     ```
Learn more: [Observability overview](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability.html>) · [metrics](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-runtime-metrics.html>) · [telemetry](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-telemetry.html>)

## CloudTrail

Harness operations are logged to AWS CloudTrail as management events (control plane) and data events (data plane). In CloudTrail, harness resources appear under the `AWS::BedrockAgentCore::Runtime` resource type rather than a harness-specific type. Harness is a managed abstraction over AgentCore Runtime, and CloudTrail events reflect the underlying runtime resource for consistency.

All harness CloudTrail events use `resources.type` = `AWS::BedrockAgentCore::Runtime`. The event names are:

  * `CreateHarness`, `UpdateHarness`, `DeleteHarness`, `GetHarness`, `ListHarnesses` (management events)

  * `InvokeAgentRuntime`, `InvokeAgentRuntimeCommand` (data events)


###### Note

Data plane operations appear as `InvokeAgentRuntime` and `InvokeAgentRuntimeCommand` in CloudTrail, matching the underlying Runtime API. The `resources.ARN` field contains the harness ARN for control plane events and the runtime ARN for data plane events.

## Understand harness costs

There is no additional charge for the harness itself. You pay standard rates for the underlying capabilities that the harness uses. For current rates, see [Amazon Bedrock AgentCore pricing](<https://aws.amazon.com/bedrock/agentcore/pricing/>) and the pricing page for your model provider.

The following table describes the capabilities that can incur charges when you use the harness.

Capability | When charges apply | What determines usage  
---|---|---  
AgentCore Runtime |  AgentCore Runtime starts a microVM for every harness session. |  AgentCore Runtime bills for actual CPU consumed and peak memory consumed each second from microVM startup through termination, including system overhead. CPU charges don’t apply during model or tool I/O wait if no background process uses CPU. Memory remains billable while the session runs.  
Model inference |  The model provider bills each time the agent calls the configured model. One harness invocation can make multiple model calls. |  The provider calculates charges from input and output tokens. Input includes the system prompt, conversation history, retrieved memory, skill instructions, and definitions for allowed tools. For tool-definition overhead, see [Tools](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-tools.html>).  
AgentCore Memory |  AgentCore Memory bills when the harness writes events or retrieves records. Managed Memory is enabled by default; charges also apply to attached Memory. |  AgentCore Memory meters new short-term events, stored long-term memory records, and long-term memory retrieval requests.  
AgentCore Browser and Code Interpreter |  Browser and Code Interpreter bill when the agent uses these configured tools. |  Each service meters active CPU and memory consumption for its sessions. Their tool definitions can still add model input tokens when allowed, even if the agent doesn’t call them.  
AgentCore Gateway and Web Search |  Gateway bills when the harness discovers or invokes tools, performs searches, or uses indexed tools. Web Search bills when the harness submits a query. |  Gateway meters API operations, search queries, and indexed tools, as applicable. Web Search meters its queries separately.  
Observability |  CloudWatch bills for the traces, logs, and metrics that every invocation emits. |  CloudWatch meters ingestion, storage, and query usage.  
Storage and network |  Storage and network services bill when you use a custom container, persistent filesystems, or data transfer. |  Amazon ECR meters image storage. Amazon S3 and EFS meter resource usage. Standard data transfer rates apply to network traffic.  
  
### Estimate Runtime cost

Runtime billing uses per-second active consumption rather than provisioned instance time:

```text
CPU cost = consumed vCPU-seconds / 3,600 * vCPU-hour rate
Memory cost = sum of peak GB consumed in each second / 3,600 * GB-hour rate
```
Don’t estimate CPU cost from wall-clock invocation or session duration alone. Model and tool I/O waits don’t incur CPU charges when no other process uses CPU. However, memory consumption remains billable. A shorter `idleRuntimeSessionTimeout` can reduce how long memory remains billable after the last invocation, at the cost of more frequent cold starts.

### Measure and attribute usage

  * Read `metadata` events in the invocation stream for model token usage.

  * Use AgentCore Observability traces and `agentcore logs --harness <name>` to identify model calls, tool calls, memory operations, and their duration. Observability explains activity but is not a billing report.

  * Use AWS Cost Explorer or the AWS Cost and Usage Report for billed usage. Activate your harness tags as cost allocation tags to filter supported charges.


Harness tags propagate to the managed Runtime, Runtime endpoint, and managed Memory created for the harness. Tag separately created resources, such as Gateway, EFS, S3, or a bring-your-own Memory resource, independently.

## Control cost with limits

Set hard caps so a runaway agent can’t burn through resources:

  * **`maxIterations` ** \- reasoning/action cycles per invocation. Default 75.

  * **`timeoutSeconds` ** \- wall-clock timeout for a single invocation. Default 3600.

  * **`maxTokens` ** \- token budget per invocation. Default N/A.

  * **`idleRuntimeSessionTimeout` ** \- how long an idle microVM stays warm. Default 900.

  * **`maxLifetime` ** \- maximum lifetime of a microVM session. Default 28800.


All limits are optional; omit them to use service defaults. Because harness is backed by AgentCore Runtime, harness invocations are also subject to Runtime service quotas. For more information, see [AgentCore harness Service Quotas](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/bedrock-agentcore-limits.html#harness-service-limits>) and [AgentCore Runtime Service Quotas](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/bedrock-agentcore-limits.html#runtime-service-limits>).

###### Example

AWS CLI/boto3
     ```bash
     aws bedrock-agentcore-control update-harness \
       --harness-id "MyHarness-UuFdkQoXSL" \
       --max-iterations 50 \
       --timeout-seconds 1800 \
       --max-tokens 8192
     ```
Or override on a single invocation by passing `maxIterations`, `timeoutSeconds`, or `maxTokens` in `invoke_harness`.

AgentCore CLI
    

Set defaults:

```bash
agentcore add harness --name bounded-agent \
  --max-iterations 50 --timeout 1800 --max-tokens 8192 \
  --truncation-strategy sliding_window \
  --idle-timeout 600 --max-lifetime 14400
agentcore deploy
```
The `--truncation-strategy` flag accepts `sliding_window` or `summarization`. The `--idle-timeout` and `--max-lifetime` flags set lifecycle limits in seconds.

Override on a single call:

```bash
agentcore invoke --harness bounded-agent --max-iterations 20 --harness-timeout 600 \
  "Quick lookup: what's the weather in Seattle?"
```
## Tags

Apply tags to your harness for cost allocation and access control.

###### Example

AWS CLI/boto3
     ```bash
     aws bedrock-agentcore-control create-harness \
       --harness-name "MyHarness" \
       --execution-role-arn "arn:aws:iam::123456789012:role/MyHarnessRole" \
       --tags '{"team": "platform", "environment": "staging"}'
     ```
AgentCore CLI
    

Set tags in `harness.json`:

```json
{
  "tags": {
    "team": "platform",
    "environment": "staging"
  }
}
```
Run `agentcore deploy` to apply.

Harness tags propagate to the managed Runtime, Runtime endpoint, and managed Memory created for the harness. Separately created resources retain their own tags.

### Related topics

  * [Memory](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-memory.html>) \- memory persists conversation context across sessions

  * [Environment and filesystem](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-environment.html>) \- environment variables and custom containers

  * [Security and access controls](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-security.html>) \- execution role policy and IAM permissions

  * [API Documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-get-started.html#api-documentation>)



