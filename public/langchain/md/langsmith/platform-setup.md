## Set up LangSmith

        Set up **LangSmith** for [observability](lc:langsmith/observability), [evaluation](lc:langsmith/evaluation), and [prompt engineering](lc:langsmith/prompt-context-hub#prompts). LangSmith offers two hosting models: fully managed Cloud, or Self-hosted (Enterprise) for full control.

        If you also want to deploy agents in production, you can use [**LangSmith Deployment**](lc:langsmith/deployment) with either hosting model.

        

        ### [Cloud](#)
Fully managed observability, evaluation, and prompt engineering.

        ### [Self-hosted](#)
**(Enterprise)** Full control with observability, evaluation, and prompt engineering in your infrastructure.

        

        > 
        Self-hosted is available on the [Enterprise plan](lc:langsmith/pricing-plans). [Get a demo](https://www.langchain.com/contact-sales) to learn more.
        

        ## Compare Cloud and Self-hosted

        | Feature | **Cloud** | **Self-hosted** |
        |---------|-----------|-----------------|
        | **Infrastructure location** | LangChain's cloud | Your infrastructure |
        | **Who manages updates** | LangChain | You |
        | **Observability data location** | LangChain cloud | Your infrastructure |
        | **Pairs with LangSmith Deployment** | Yes | When you enable LangSmith Deployment |
        | **[Pricing](https://www.langchain.com/pricing)** | Plus tier | Enterprise |
        | **Best for** | Quick setup, managed infrastructure | Full control, data isolation |

        Both hosting models support [LangSmith Deployment](lc:langsmith/deployment) for agent workloads. Refer to the [LangSmith Deployment overview](lc:langsmith/deployment) to pick a topology (Cloud managed, Hybrid, self-hosted with control plane, or standalone).

        ## Common setups

        - **Fastest to start, managed everything.** [LangSmith Cloud](lc:langsmith/cloud) paired with [LangSmith Deployment](lc:langsmith/deployment) on Cloud. LangChain hosts the platform, and, when you use LangSmith Deployment, also hosts your [Agent Servers](lc:langsmith/agent-server).
        - **Observability data must stay in your infrastructure.** Self-hosted LangSmith, paired with any LangSmith Deployment topology, including [self-hosted LangSmith Deployment](lc:langsmith/deploy-with-control-plane) for agent workloads.
        - **Managed observability, agents in your VPC.** LangSmith Cloud paired with [Hybrid](lc:langsmith/hybrid) LangSmith Deployment. Traces and evaluations stay on SaaS while agent workloads stay in your infrastructure.
        - **Observability only, no agent hosting.** LangSmith Cloud or self-hosted, without LangSmith Deployment. Run your agents wherever you already run apps and send traces to LangSmith.

        ## Related

        

        ### [Account setup](#)
Create an account, manage API keys, and choose a pricing tier.

        ### [Plans and pricing](#)
Compare LangSmith plans and tiers.

        ### [Observability](#)
Trace and monitor your LLM applications.
