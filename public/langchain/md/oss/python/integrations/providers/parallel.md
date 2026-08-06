This page covers all LangChain integrations with [Parallel](https://platform.parallel.ai/).

## Installation and setup

The `Parallel` integration lives in its own [partner package](https://pypi.org/project/langchain-parallel/):

    ```lc-tabs
    [
     {
      "label": "pip",
      "lang": "bash",
      "code": "pip install -U langchain-parallel"
     },
     {
      "label": "uv",
      "lang": "bash",
      "code": "uv add langchain-parallel"
     }
    ]
    ```

Set the `PARALLEL_API_KEY` environment variable to your Parallel API key. Sign up at [platform.parallel.ai](https://platform.parallel.ai) to obtain one.

## Chat models


### [ChatParallel](lc:oss/python/integrations/chat/parallel)
OpenAI-compatible chat model with optional web research and per-field citations on the research tiers.


## Tools


### [ParallelSearchTool](lc:oss/python/integrations/tools/parallel_search)
Search the web and get structured, LLM-optimized excerpts back.

    ### [ParallelExtractTool](lc:oss/python/integrations/tools/parallel_extract)
Extract clean markdown content from a list of URLs.

    ### [ParallelFindAllTool](lc:oss/python/integrations/tools/parallel_findall)
Discover entities that satisfy a set of boolean match conditions.

    ### [Task API](lc:oss/python/integrations/tools/parallel_task)
Run research-grade tasks: single ad-hoc, deep research, batch enrichment. `ParallelTaskRunTool`, `ParallelDeepResearch`, `ParallelTaskGroup`, `ParallelEnrichment`.

    ### [ParallelMonitor](lc:oss/python/integrations/tools/parallel_monitor)
Schedule a query on a recurring cadence and receive events when relevant new content shows up.


## Retrievers


### [ParallelSearchRetriever](lc:oss/python/integrations/retrievers/parallel)
`BaseRetriever` over Parallel Search. Returns `list[Document]` for drop-in use in any RAG pipeline.
