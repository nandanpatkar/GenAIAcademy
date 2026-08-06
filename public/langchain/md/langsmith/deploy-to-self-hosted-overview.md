Self-hosted LangSmith Deployment runs the [Agent Server](lc:langsmith/agent-server), control plane, data plane, and supporting databases inside infrastructure that you operate.

LangChain ships the container images, Helm charts, and license; you provide the Kubernetes cluster (or Docker host), PostgreSQL, Redis, and the networking and observability tooling that fit your environment. Self-hosted is the best deployment option when you have data residency, regulatory constraints, custom networking, or air-gapped requirements.

> 
Self-hosted deployments require an [Enterprise plan](https://www.langchain.com/pricing) and the LangSmith license key delivered with that plan. For a setup guide, see [Self-hosted LangSmith](lc:langsmith/self-hosted).

## Topologies

LangSmith supports three self-hosted topologies that trade off setup complexity against control-plane features. Reference pages for [platform features](lc:langsmith/self-hosted-platform-features), [Agent Server metrics](lc:langsmith/self-hosted-agent-server-metrics), and [diagnostics](lc:langsmith/diagnostics-self-hosted) apply to all three.

### [Full self-hosted platform](#)
The complete LangSmith platform—[control plane](lc:langsmith/control-plane) UI and APIs, [data plane](lc:langsmith/data-plane) listener, observability, evaluation, and agent deployment management. Best for teams that want the LangSmith product experience inside their own network.

### [Hybrid](#)
LangChain-hosted control plane with the data plane (Agent Servers and databases) in your infrastructure. Best when you want managed deployment workflows but need agent workloads and customer data to stay inside your VPC.

### [Standalone server](#)
The lightest option—Agent Server containers (API + queue workers) with your own PostgreSQL and Redis. No control plane, no managed UI. Best for embedding the runtime into existing infrastructure or running air-gapped.

### [Platform features](#)
Reference for self-hosted-only platform behavior: custom Postgres and Redis, listeners, and resource customization.

### [Agent Server metrics](#)
Prometheus and Datadog export for Agent Server, including Deployment UI metrics and internal metrics.

### [Diagnostics](#)
Collect logs, inspect state, and troubleshoot a self-hosted installation.

## Who manages what

Self-hosted shifts ownership of infrastructure operations from LangChain to your team, which provides flexibility and control over how you configure and operate is layer:

|                                              | **Who manages it** | **Where it runs**           |
|----------------------------------------------|--------------------|-----------------------------|
| LangSmith platform (UI, APIs, datastores)    | You                | Your infrastructure         |
| Agent Server runtime                         | You                | Your infrastructure         |
| PostgreSQL and Redis                         | You                | Your infrastructure         |
| CI/CD for your apps                          | You                | Your CI environment         |
| Upgrades, scaling, and backups               | You                | Your infrastructure         |

In return, you can integrate with your own [Postgres](lc:langsmith/self-hosted-platform-features#custom-postgresql) and [Redis](lc:langsmith/self-hosted-platform-features#custom-redis), size [CPU and memory](lc:langsmith/self-hosted-platform-features#resource-customization) for your workload, and operate inside your existing network and observability stack. For the corresponding Cloud-managed model, see [Deploy to Cloud](lc:langsmith/deploy-to-cloud-overview).

## Next steps

### [Pick a topology](#)
Compare standalone server, full platform, and hybrid to find the right fit.

### [Install the full platform](#)
Deploy LangSmith on Kubernetes with the control plane and data plane.
