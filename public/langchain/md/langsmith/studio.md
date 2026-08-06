> [!NOTE]
>
> **Prerequisites**
> * [LangSmith](lc:langsmith/observability)
> * [Agent Server](lc:langsmith/agent-server)
> * [LangGraph CLI](lc:langsmith/cli)


Studio is a specialized agent IDE that enables visualization, interaction, and debugging of agentic systems that implement the Agent Server API protocol. Studio also integrates with [tracing](lc:langsmith/observability-concepts), [evaluation](lc:langsmith/evaluation), and [prompt engineering](lc:langsmith/prompt-context-hub#prompts).

## Features

Key features of Studio:

* Visualize your graph architecture
* [Run and interact with your agent](lc:langsmith/use-studio#run-application)
* [Manage assistants](lc:langsmith/use-studio#manage-assistants)
* [Manage threads](lc:langsmith/use-studio#manage-threads)
* [Iterate on prompts](lc:langsmith/observability-studio)
* [Run experiments over a dataset](lc:langsmith/observability-studio#run-experiments-over-a-dataset)
* Manage [long term memory](lc:oss/python/concepts/memory)
* Debug agent state via [time travel](lc:oss/python/langgraph/use-time-travel)
* 1 Click deploy to LangSmith Cloud.

```mermaid actions={false}
flowchart
    subgraph LangSmith Deployment
        A[LangGraph CLI] -->|creates| B(Agent Server deployment)
        B <--> D[Studio]
        B <--> E[SDKs]
        B <--> F[RemoteGraph]
    end

    classDef process fill:#E5F4FF,stroke:#006DDD,stroke-width:2px,color:#030710

    class A,B,D,E,F process
```

Studio works for graphs that are deployed on [LangSmith](lc:langsmith/deployment-quickstart) or for graphs that are running locally via the [Agent Server](lc:langsmith/local-dev-testing).

Studio supports two modes:

### Graph mode

Graph mode exposes the full feature-set and is useful when you would like as many details about the execution of your agent, including the nodes traversed, intermediate states, and LangSmith integrations (such as adding to datasets and playground).

### Chat mode

Chat mode is a simpler UI for iterating on and testing chat-specific agents. It is useful for business users and those who want to test overall agent behavior. Chat mode is only supported for graph's whose state includes or extends [`MessagesState`](lc:oss/python/langgraph/use-graph-api#messagesstate).

## Deploy from Studio

Go from [testing graphs locally](lc:langsmith/local-dev-testing) in Studio to deploying them on Langsmith Cloud in 1 Click, directly from Studio. You can use this to create a brand new deployment for quick prototyping or to redeploy an existing deployment.

## Learn more

* See this guide on how to [get started](lc:langsmith/quick-start-studio) with Studio.

## Video guide
<iframe
  className="w-full aspect-video rounded-xl"
  src="https://www.youtube.com/embed/Mi1gSlHwZLM?si=oWCeHQ640zPHoLwn"
  title="YouTube video player"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>
