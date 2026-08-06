# Create and deploy your agent - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/create-deploy-agent.html

---

# Create and deploy your agent

If you have an agent already up and running in AgentCore Runtime, you can skip the following steps

###### Topics

  * Pick a supported framework

  * Create and deploy your agent


## Pick a supported framework

AgentCore Evaluations currently supports the following agentic frameworks and instrumentation libraries

  * Strands Agent

  * LangGraph configured with one of the following instrumentation libraries

    * `opentelemetry-instrumentation-langchain`

    * `openinference-instrumentation-langchain`


## Create and deploy your agent

Create and deploy your agent by following the [Get Started guide for AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-getting-started.html>) . Setup observability using [Get started with AgentCore Observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-get-started.html>) . You can find additional examples in the [AgentCore Evaluations Samples](<https://github.com/awslabs/amazon-bedrock-agentcore-samples/tree/main/01-features/06-observe-evaluate-optimize-your-agent/02-evaluate>).

