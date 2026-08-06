**Integrations are a core component of LangChain.**

LangChain provides standard interfaces for several different components (language models, vector stores, etc) that are crucial when building LLM applications. Implementing a new integration helps expand LangChain's ecosystem and makes your service discoverable to millions of developers.


> [!WARNING]
>
> New integrations are **not accepted as PRs** to any `langchain-ai` repository. All new integrations must be published as independent packages to PyPI (e.g., `langchain-yourprovider`). The only PR you should open to a `langchain-ai` repo is to list your published package in the docs: either a YAML row for the download table, or a hosted guide if you meet the [eligibility criteria](lc:oss/python/contributing/publish-langchain#eligibility-for-hosted-guides).


## Why implement a LangChain integration?

### [Discoverability](#)
LangChain is the most used framework for building LLM applications, with over 200 million monthly downloads.

### [Interoperability](#)
LangChain components expose a standard interface, allowing developers to easily swap them for each other. If you implement a LangChain integration, any developer using a different component will easily be able to swap yours in.

### [Best Practices](#)
Through their standard interface, LangChain components encourage and facilitate best practices (streaming, async, etc.) that improve developer experience and application performance.

## Components to integrate

While any component can be integrated into LangChain, there are specific types of integrations we encourage more:

**Integrate these ✅**:

- [**Chat Models**](lc:oss/python/integrations/chat/index): Most actively used component type
- [**Tools/Toolkits**](lc:oss/python/integrations/tools/index): Enable agent capabilities
- [**Retrievers**](lc:oss/python/integrations/retrievers/index): Core to RAG applications
- [**Embedding Models**](lc:oss/python/integrations/embeddings/index): Foundation for vector operations
- [**Vector Stores**](lc:oss/python/integrations/vectorstores/index): Essential for semantic search
- [**Middleware**](lc:oss/python/integrations/middleware/index): Extend agent behavior with hooks
- [**Sandboxes**](lc:oss/python/deepagents/sandboxes): Run code safely with Deep Agents

**Not these ❌**:

- **LLMs (Text-Completion Models)**: Deprecated in favor of [Chat Models](lc:oss/python/integrations/chat/index)
- [**Document Loaders**](lc:oss/python/integrations/document_loaders/index): High maintenance burden
- [**Key-Value Stores**](lc:oss/python/integrations/stores/index): Limited usage
- **Document Transformers**: Niche use cases
- **Model Caches**: Infrastructure concerns
- **Graphs**: Complex abstractions
- **Message Histories**: Storage abstractions
- **Callbacks**: System-level components
- **Chat Loaders**: Limited demand
- **Adapters**: Edge case utilities

## How to contribute an integration

    #### Step: Implement your package

        
    

    #### Step: Pass standard tests

        If applicable, implement support for LangChain's [standard test](lc:oss/python/contributing/standard-tests-langchain) suite for your integration and successfully run them.
    

    #### Step: Publish integration

        
    

    #### Step: List your integration

        Open a PR in the LangChain [docs repo](https://github.com/langchain-ai/docs) so users can find your package. Hosted guides are limited; most integrations are listed via YAML.

        ### How listing works

            **Default (under 50,000 monthly downloads, not featured):** Add a row to [`scripts/data/integration_external_docs.yaml`](https://github.com/langchain-ai/docs/blob/main/scripts/data/integration_external_docs.yaml). The name column links to your `docs_url` (partner docs preferred, then GitHub, then PyPI or npm). Do not add a new MDX page.

            **Hosted guide (50,000+ monthly downloads, or featured by maintainers):** Create a page under `src/oss/python/integrations/<component_type>/` from a template:

            - [Chat models](https://github.com/langchain-ai/docs/blob/main/src/oss/python/integrations/chat/TEMPLATE.mdx)
            - [Tools and toolkits](https://github.com/langchain-ai/docs/blob/main/src/oss/python/integrations/tools/TEMPLATE.mdx)
            - [Middleware](https://github.com/langchain-ai/docs/blob/main/src/oss/python/integrations/middleware/TEMPLATE.mdx)
            - [Vector stores](https://github.com/langchain-ai/docs/blob/main/src/oss/python/integrations/vectorstores/TEMPLATE.mdx)

            For full steps, eligibility details, and rejection criteria, see [Publish an integration](lc:oss/python/contributing/publish-langchain#make-your-integration-discoverable).
        
    

    #### Step: Co-marketing

        (Optional) Engage with the LangChain team for joint [co-marketing](lc:oss/python/contributing/comarketing).
