[LangSmith Cloud](lc:langsmith/cloud) is a **managed platform for deploying your agents**. LangChain hosts and operates the [control plane](lc:langsmith/control-plane), [data plane](lc:langsmith/data-plane), [Agent Server](lc:langsmith/agent-server) runtime, and supporting databases on AWS and GCP. Push code to a connected GitHub repository or invoke the `langgraph deploy` CLI, and the platform handles build, provisioning, scaling, and ongoing operations. Deployments come in two types: Serverless, a lightweight, fully managed option that scales to zero after a period of inactivity, and Dedicated, always-on infrastructure for production workloads. For details, see [Deployment types](lc:langsmith/cloud-platform-features#deployment-types).

> 
Agent deployments running on Cloud require a [Plus plan or above](https://www.langchain.com/pricing). Before creating your first agent deployment, verify that your application runs locally with `langgraph dev`. Refer to [Local development and testing](lc:langsmith/local-dev-testing).

### [Deploy on Cloud](#)
Step-by-step setup guide for creating, configuring, and managing Cloud deployments from the LangSmith UI or the `langgraph deploy` CLI.

### [Cloud platform features](#)
Reference for Cloud-only platform behavior: data regions, static IPs, payload limits, deployment types, and managed database provisioning.

### [Quickstart](#)
Deploy your first LangGraph application to Cloud in a few minutes.

To deploy a code-first Deep Agent without standing up your own Agent Server, [Managed Deep Agents](lc:langsmith/managed-deep-agents-overview) offers a CLI-first managed runtime in private beta.

## Next steps

### [Run the quickstart](#)
Deploy a starter LangGraph application end-to-end.

### [Read the full deploy guide](#)
Configure environment variables, secrets, revisions, and deployment settings.
