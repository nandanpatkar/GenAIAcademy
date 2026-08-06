**LangSmith Deployment** is a workflow orchestration runtime purpose-built for agent workloads. It provides the managed infrastructure agents need to run reliably in production at scale, supporting the full lifecycle from local development to deployment.


> [!NOTE]
>
> This page covers how your **agents** run in production with **LangSmith Deployment**.
>
> Where you run LangSmith for observability, evaluation, and prompt engineering is separate; refer to [Platform setup](lc:langsmith/platform-setup) for details.


## Deployable products

LangSmith Deployment is framework-agnostic which means you can deploy agents built with:

### [LangGraph (and LangChain)](#)
Use the LangGraph CLI and app templates to deploy an application to LangSmith.

### [Google ADK](#)
Deploy Google Agent Development Kit (ADK) agent as a LangGraph with the `deployments-wrap-sdk` package.

### [Other frameworks](#)
Deploy Claude Agent SDK, Strands, CrewAI, AutoGen, and other agent frameworks with the Functional API or `deployments-wrap-sdk`.

A managed runtime for deploying code-first Deep Agents is available in private beta; see [Managed Deep Agents](lc:langsmith/managed-deep-agents-overview).

## LangSmith Deployment environments

Pick an environment based on where you want the [control plane](lc:langsmith/control-plane) and [data plane](lc:langsmith/data-plane) (Agent Servers and their databases) to run. All infrastructure types use the same [Agent Server](lc:langsmith/agent-server) runtime.

### [Cloud](#)
Fully managed by LangChain on AWS and GCP. Create deployments from GitHub in the LangSmith UI or with [`langgraph deploy`](lc:langsmith/cli#deploy). Requires a [Plus plan or above](https://www.langchain.com/pricing).

### [Self-hosted with control plane](#)
Run the LangSmith Deployment control plane and Agent Servers in your own Kubernetes cluster, alongside self-hosted LangSmith. Requires the [Enterprise plan](https://www.langchain.com/pricing) with LangSmith Deployment enabled.

### [Hybrid](#)
LangChain-managed control plane with Agent Servers and their data plane in your infrastructure. Traces flow to LangSmith Cloud or self-hosted LangSmith.

### [Standalone server](#)
Deploy Agent Server with Docker, Compose, or Kubernetes. Bring your own PostgreSQL, Redis, and LangSmith license; no control plane. Optional [LangSmith tracing](lc:langsmith/observability) to Cloud or a self-hosted instance.

## Common setups

- **Managed hosting for your agents.** LangSmith Deployment on [Cloud](lc:langsmith/deploy-to-cloud-overview). LangChain hosts the control plane, data plane, and databases. Pairs with LangSmith Cloud.
- **Agents in your VPC, control plane managed.** LangSmith Deployment via [Hybrid](lc:langsmith/hybrid). LangChain hosts the control plane; you host Agent Servers and their data plane. Pairs with LangSmith Cloud or self-hosted LangSmith.
- **Full data residency or air-gapped.** [Self-hosted LangSmith Deployment](lc:langsmith/deploy-with-control-plane). You host the control plane and Agent Servers in your own infrastructure alongside self-hosted LangSmith.
- **Agent runtime only, no control plane.** [Standalone Agent Server](lc:langsmith/deploy-standalone-server). Run Agent Server containers with Docker or Kubernetes without a control plane, optionally sending traces to LangSmith Cloud or self-hosted.

For where the LangSmith platform runs, see [Platform setup](lc:langsmith/platform-setup).

## After deployment

Once deployed, agents work with [Agent Server](lc:langsmith/assistants)'s execution model: **assistants** for configuration, **threads** for state, and **runs** for workloads. For capabilities, tutorials, server customization, and operations, see [Agent Server](https://docs.langchain.com/langsmith/develop-agents-overview).

### [Update prompts and contexts without redeploying](#)
Manage the prompts and versioned contexts your deployed agents pull at runtime, so you can change behavior without a full deploy.

### [Interact with your deployment using RemoteGraph](#)
Call your deployed graph from client code as if it were a local compiled graph.

### [Find and fix failures with Engine](#)
Once agents are in production, use LangSmith Engine to detect recurring failures in their traces, diagnose root causes, and resolve them.

## Full-stack web apps

Ship a LangChain.js agent and chat UI together as a single web app. The Vite example uses LangSmith Deployment as the agent backend behind a separate UI. Other examples embed the agent inside the web framework's route handlers and ship to the host platform.


### [Full-stack web apps](#)
Ship a LangChain.js chat app: embed the agent in Next.js, SvelteKit, Nuxt, Cloudflare Workers, or Deno Deploy (no Agent Server required), or pair LangSmith Deployment with a Vite + React UI.

  <span className="inline-flex h-8 w-8 items-center justify-center">
    
![LangSmith](/langchain/images/images/providers/light/langchain.svg)

  </span>
  <span className="inline-flex h-8 w-8 items-center justify-center">
    
![Next.js](/langchain/images/images/providers/light/nextjs.svg)

  </span>
  <span className="inline-flex h-8 w-8 items-center justify-center">
    
![SvelteKit](/langchain/images/images/providers/light/svelte.svg)

  </span>
  <span className="inline-flex h-8 w-8 items-center justify-center">
    
![Nuxt](/langchain/images/images/providers/light/nuxt.svg)

  </span>
  <span className="inline-flex h-8 w-8 items-center justify-center">
    
![Cloudflare Workers](/langchain/images/images/providers/light/cloudflare.svg)

  </span>
  <span className="inline-flex h-8 w-8 items-center justify-center">
    
![Deno Deploy](/langchain/images/images/providers/light/deno.svg)

  </span>
