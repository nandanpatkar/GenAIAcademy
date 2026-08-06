A collection of sample implementations to help you get started with Strands Agents. From simple agents to complex multi-agent systems, each example illustrates key concepts and patterns you can adapt for your own projects.

## Getting Started

1.  Set up the SDK for your language:
    -   [Python quickstart](lc:user-guide/quickstart/python) (Python 3.10+, pip)
    -   [TypeScript quickstart](https://strandsagents.com/docs/user-guide/quickstart/typescript/) (Node.js 20+, npm)
2.  Configure AWS credentials for Amazon Bedrock (covered in both quickstart guides above), or set up an [alternative model provider](lc:user-guide/concepts/model-providers)
3.  Clone the examples:
    
    ```bash
    git clone https://github.com/strands-agents/harness-sdk.git
    cd harness-sdk/site/docs/examples
    ```
    
4.  Browse the examples below and follow the instructions in each one

## Agent Examples

| Example | Description | Python | TypeScript |
| --- | --- | --- | --- |
| [Structured Output](lc:examples/structured_output) | Type-safe, validated responses | ✅ | ✅ |
| [Agents Workflows](lc:examples/python/agents_workflows) | Sequential agent workflow pattern | ✅ |  |
| [File Operations](lc:examples/python/file_operations) | File manipulation capabilities | ✅ |  |
| [Graph Loops](lc:examples/python/graph_loops_example) | Graph orchestration with loops | ✅ |  |
| [Knowledge Base Agent](lc:examples/python/knowledge_base_agent) | Knowledge base retrieval | ✅ |  |
| [MCP Calculator](lc:examples/python/mcp_calculator) | Model Context Protocol capabilities | ✅ |  |
| [Memory Agent](lc:examples/python/memory_agent) | Persistent memory | ✅ |  |
| [Meta Tooling](lc:examples/python/meta_tooling) | Meta tooling capabilities | ✅ |  |
| [Multi-Agent Example](lc:examples/python/multi_agent_example/multi_agent_example) | Multi-agent system | ✅ |  |
| [Multimodal](lc:examples/python/multimodal) | Multimodal capabilities | ✅ |  |
| [Weather Forecaster](lc:examples/python/weather_forecaster) | Weather forecasting agent | ✅ |  |

## Deployment Examples

Also see [Operating Agents in Production](lc:user-guide/deploy/operating-agents-in-production) for best practices on security, monitoring, and scaling.

| Guide | Description | Python | TypeScript |
| --- | --- | --- | --- |
| [Bedrock AgentCore](lc:user-guide/deploy/deploy_to_bedrock_agentcore) | Serverless agent runtime | ✅ | ✅ |
| [Docker](lc:user-guide/deploy/deploy_to_docker) | Containerized deployment | ✅ | ✅ |
| [AWS Lambda](lc:user-guide/deploy/deploy_to_aws_lambda) | Serverless compute | ✅ |  |
| [AWS Fargate](lc:user-guide/deploy/deploy_to_aws_fargate) | Serverless containers | ✅ |  |
| [AWS App Runner](lc:user-guide/deploy/deploy_to_aws_apprunner) | Managed web applications | ✅ |  |
| [Amazon EC2](lc:user-guide/deploy/deploy_to_amazon_ec2) | Virtual machines | ✅ |  |
| [Amazon EKS](lc:user-guide/deploy/deploy_to_amazon_eks) | Managed Kubernetes | ✅ |  |
| [Kubernetes](lc:user-guide/deploy/deploy_to_kubernetes) | Self-managed Kubernetes | ✅ |  |
