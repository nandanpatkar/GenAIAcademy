# Supported agent frameworks - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/supported-frameworks.html

---

# Supported agent frameworks

Amazon Bedrock AgentCore Evaluations evaluates agents built with several agent frameworks. What an agent emits as telemetry, and how that telemetry is structured, depends on the **agent framework** you build with and the **instrumentation library** you use to record it.

For each supported framework, this section describes:

  * The instrumentation libraries you can use.

  * How to instrument your agent.

  * What the resulting spans and event records look like.

  * How the evaluation service locates the values it needs, such as the user prompt, the agent response, and tool calls.


AgentCore Evaluations supports the following frameworks and instrumentation libraries. It supports only the Python versions of these libraries.

Agent framework | Instrumentation library | Scope name | Recommended version  
---|---|---|---  
Strands Agents |  Built-in (Strands Agents SDK) |  `strands.telemetry.tracer` |  Latest  
LangGraph |  OpenTelemetry (`opentelemetry-instrumentation-langchain`) |  `opentelemetry.instrumentation.langchain` |  `>= 0.55.0`  
LangGraph |  OpenInference (`openinference-instrumentation-langchain`) |  `openinference.instrumentation.langchain` |  `>= 0.1.62`  
OpenAI Agents |  OpenTelemetry (`opentelemetry-instrumentation-openai-agents`) |  `opentelemetry.instrumentation.openai_agents` |  `>= 0.61.0`  
OpenAI Agents |  OpenInference (`openinference-instrumentation-openai-agents`) |  `openinference.instrumentation.openai_agents` |  `>= 1.5.0`  
LlamaIndex |  OpenTelemetry (`opentelemetry-instrumentation-llamaindex`) |  `opentelemetry.instrumentation.llamaindex` |  `>= 0.61.0`  
LlamaIndex |  OpenInference (`openinference-instrumentation-llama-index`) |  `openinference.instrumentation.llama_index` |  `>= 4.4.1`  
Google ADK |  OpenInference (`openinference-instrumentation-google-adk`) |  `openinference.instrumentation.google_adk` |  `>= 0.1.13`  
Claude Agent SDK |  OpenInference (`openinference-instrumentation-claude-agent-sdk`) |  `openinference.instrumentation.claude_agent_sdk` |  `>= 0.1.3`  
  
Each span your agent emits carries a **scope name** , which identifies the instrumentation library that produced it. The evaluation service reads this name to tell which library it is dealing with, and therefore whether it can process the span and which attributes to look for. The scope name is the value of the `scope.name` field on each span and event record.

The attribute names and the location of the conversation content differ by framework and instrumentation library. For the attributes and example spans of a single framework, see that framework’s page.

###### Note

Instrumenting your agent is only one part of producing telemetry that the evaluation service can read. Your agent must also have observability enabled, so that it exports its telemetry to Amazon CloudWatch.

For how AgentCore delivers that telemetry, where the service finds the values it needs, and the setup steps for your hosting option, see [Telemetry setup and delivery](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./supported-frameworks-telemetry.html>).

## Sample agents

The following examples show how to instrument a Strands agent hosted outside Amazon Bedrock AgentCore Runtime to export telemetry to Amazon CloudWatch using ADOT. They focus on observability setup rather than the evaluation API. The examples use Strands, but the same hosting and telemetry-export pattern applies to other supported frameworks, such as LangGraph.

  * **Amazon EKS:** [Observability for an EKS-hosted agent](<https://github.com/awslabs/agentcore-samples/tree/main/06-workshops/06-AgentCore-observability/06-Agentcore-observability-for-eks-hosted-agent>) and [Strands agent on Amazon EKS](<https://github.com/awslabs/agentcore-samples/tree/main/03-integrations/agents-hosted-outside-runtime/agents-on-eks>), both on the GitHub website.

  * **Amazon ECS:** [Strands agent on Amazon ECS](<https://github.com/awslabs/agentcore-samples/tree/main/03-integrations/agents-hosted-outside-runtime/agents-on-ecs>) on the GitHub website.

  * **AWS Lambda:** [Strands agent in AWS Lambda](<https://github.com/awslabs/agentcore-samples/tree/main/03-integrations/agents-hosted-outside-runtime/agents-on-aws-lambda/02-agent-in-lambda>) on the GitHub website.


###### Topics



