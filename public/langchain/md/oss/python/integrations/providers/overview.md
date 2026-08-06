{/* File generated automatically by pipeline/tools/partner_pkg_table.py */}
{/* Do not manually edit */}

LangChain offers an extensive ecosystem with 1000+ integrations across chat & embedding models, tools & toolkits, document loaders, vector stores, and more.

A **provider** is a company or platform that hosts AI models and exposes them through an API (e.g., OpenAI, Anthropic, Google). Many providers have a dedicated `langchain-<provider>` package that implements one or more of LangChain's standard interfaces—chat models, embedding models, vector stores, and more—giving you a consistent API regardless of the underlying provider. Install the package, pick a model name, and swap providers without changing your code.


To see a full list of integrations by component type, refer to the categories in the sidebar.


> [!TIP]
>
> For a conceptual overview of how providers and models work in LangChain, including how to find model names, use new models immediately, and work with routers—see [Providers and models](lc:oss/python/concepts/providers-and-models).


## Popular providers

| Provider | Package | Downloads | Latest version | JS/TS support |
| :--- | :--- | :--- | :--- | :--- |
| [OpenAI](lc:oss/python/integrations/providers/openai) | [`langchain-openai`](https://reference.langchain.com/python/integrations/langchain_openai/) | <a href="https://pypi.org/project/langchain-openai/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-openai/month)
</a> | <a href="https://pypi.org/project/langchain-openai/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-openai?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/openai) |
| [Google (Vertex AI)](lc:oss/python/integrations/providers/google) | [`langchain-google-vertexai`](https://reference.langchain.com/python/integrations/langchain_google_vertexai/) | <a href="https://pypi.org/project/langchain-google-vertexai/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-google-vertexai/month)
</a> | <a href="https://pypi.org/project/langchain-google-vertexai/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-google-vertexai?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/google-vertexai) |
| [Anthropic (Claude)](lc:oss/python/integrations/providers/anthropic) | [`langchain-anthropic`](https://reference.langchain.com/python/integrations/langchain_anthropic/) | <a href="https://pypi.org/project/langchain-anthropic/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-anthropic/month)
</a> | <a href="https://pypi.org/project/langchain-anthropic/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-anthropic?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/anthropic) |
| [Google (GenAI)](lc:oss/python/integrations/providers/google) | [`langchain-google-genai`](https://reference.langchain.com/python/integrations/langchain_google_genai/) | <a href="https://pypi.org/project/langchain-google-genai/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-google-genai/month)
</a> | <a href="https://pypi.org/project/langchain-google-genai/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-google-genai?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/google-genai) |
| [AWS](lc:oss/python/integrations/providers/aws) | [`langchain-aws`](https://reference.langchain.com/python/integrations/langchain_aws/) | <a href="https://pypi.org/project/langchain-aws/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-aws/month)
</a> | <a href="https://pypi.org/project/langchain-aws/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-aws?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/aws) |
| [LiteLLM](lc:oss/python/integrations/providers/litellm) | [`langchain-litellm`](https://reference.langchain.com/python/integrations/langchain_litellm/) | <a href="https://pypi.org/project/langchain-litellm/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-litellm/month)
</a> | <a href="https://pypi.org/project/langchain-litellm/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-litellm?style=flat-square&label=%20)
</a> | N/A |
| [Ollama](lc:oss/python/integrations/providers/ollama) | [`langchain-ollama`](https://reference.langchain.com/python/integrations/langchain_ollama/) | <a href="https://pypi.org/project/langchain-ollama/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-ollama/month)
</a> | <a href="https://pypi.org/project/langchain-ollama/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-ollama?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/ollama) |
| [Databricks](lc:oss/python/integrations/providers/databricks) | [`databricks-langchain`](https://pypi.org/project/databricks-langchain/) | <a href="https://pypi.org/project/databricks-langchain/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/databricks-langchain/month)
</a> | <a href="https://pypi.org/project/databricks-langchain/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/databricks-langchain?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/community) |
| [Chroma](lc:oss/python/integrations/providers/chroma) | [`langchain-chroma`](https://reference.langchain.com/python/integrations/langchain_chroma/) | <a href="https://pypi.org/project/langchain-chroma/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-chroma/month)
</a> | <a href="https://pypi.org/project/langchain-chroma/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-chroma?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/community) |
| [Groq](lc:oss/python/integrations/providers/groq) | [`langchain-groq`](https://reference.langchain.com/python/integrations/langchain_groq/) | <a href="https://pypi.org/project/langchain-groq/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-groq/month)
</a> | <a href="https://pypi.org/project/langchain-groq/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-groq?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/groq) |
| [Huggingface](lc:oss/python/integrations/providers/huggingface) | [`langchain-huggingface`](https://reference.langchain.com/python/integrations/langchain_huggingface/) | <a href="https://pypi.org/project/langchain-huggingface/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-huggingface/month)
</a> | <a href="https://pypi.org/project/langchain-huggingface/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-huggingface?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/community) |
| [Fireworks](lc:oss/python/integrations/providers/fireworks) | [`langchain-fireworks`](https://reference.langchain.com/python/integrations/langchain_fireworks/) | <a href="https://pypi.org/project/langchain-fireworks/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-fireworks/month)
</a> | <a href="https://pypi.org/project/langchain-fireworks/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-fireworks?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/community) |
| [MistralAI](lc:oss/python/integrations/providers/mistralai) | [`langchain-mistralai`](https://reference.langchain.com/python/integrations/langchain_mistralai/) | <a href="https://pypi.org/project/langchain-mistralai/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-mistralai/month)
</a> | <a href="https://pypi.org/project/langchain-mistralai/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-mistralai?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/mistralai) |
| [xAI (Grok)](lc:oss/python/integrations/providers/xai) | [`langchain-xai`](https://reference.langchain.com/python/integrations/langchain_xai/) | <a href="https://pypi.org/project/langchain-xai/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-xai/month)
</a> | <a href="https://pypi.org/project/langchain-xai/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-xai?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/xai) |
| [Pinecone](lc:oss/python/integrations/providers/pinecone) | [`langchain-pinecone`](https://reference.langchain.com/python/integrations/langchain_pinecone/) | <a href="https://pypi.org/project/langchain-pinecone/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-pinecone/month)
</a> | <a href="https://pypi.org/project/langchain-pinecone/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-pinecone?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/pinecone) |
| [MongoDB](lc:oss/python/integrations/providers/mongodb_atlas) | [`langchain-mongodb`](https://reference.langchain.com/python/integrations/langchain_mongodb/) | <a href="https://pypi.org/project/langchain-mongodb/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-mongodb/month)
</a> | <a href="https://pypi.org/project/langchain-mongodb/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-mongodb?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/mongodb) |
| [Cohere](lc:oss/python/integrations/providers/cohere) | [`langchain-cohere`](https://reference.langchain.com/python/integrations/langchain_cohere/) | <a href="https://pypi.org/project/langchain-cohere/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-cohere/month)
</a> | <a href="https://pypi.org/project/langchain-cohere/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-cohere?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/cohere) |
| [Qdrant](lc:oss/python/integrations/providers/qdrant) | [`langchain-qdrant`](https://reference.langchain.com/python/integrations/langchain_qdrant/) | <a href="https://pypi.org/project/langchain-qdrant/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-qdrant/month)
</a> | <a href="https://pypi.org/project/langchain-qdrant/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-qdrant?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/qdrant) |
| [DeepSeek](lc:oss/python/integrations/providers/deepseek) | [`langchain-deepseek`](https://reference.langchain.com/python/integrations/langchain_deepseek/) | <a href="https://pypi.org/project/langchain-deepseek/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-deepseek/month)
</a> | <a href="https://pypi.org/project/langchain-deepseek/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-deepseek?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/deepseek) |
| [Azure AI](lc:oss/python/integrations/providers/azure_ai) | [`langchain-azure-ai`](https://reference.langchain.com/python/integrations/langchain_azure_ai/) | <a href="https://pypi.org/project/langchain-azure-ai/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-azure-ai/month)
</a> | <a href="https://pypi.org/project/langchain-azure-ai/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-azure-ai?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/openai) |
| [Tavily](lc:oss/python/integrations/providers/tavily) | [`langchain-tavily`](https://reference.langchain.com/python/integrations/langchain_tavily/) | <a href="https://pypi.org/project/langchain-tavily/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-tavily/month)
</a> | <a href="https://pypi.org/project/langchain-tavily/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-tavily?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/tavily) |
| [Nvidia AI Endpoints](lc:oss/python/integrations/providers/nvidia) | [`langchain-nvidia-ai-endpoints`](https://reference.langchain.com/python/integrations/langchain_nvidia_ai_endpoints/) | <a href="https://pypi.org/project/langchain-nvidia-ai-endpoints/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-nvidia-ai-endpoints/month)
</a> | <a href="https://pypi.org/project/langchain-nvidia-ai-endpoints/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-nvidia-ai-endpoints?style=flat-square&label=%20)
</a> | ❌ |
| [IBM](lc:oss/python/integrations/providers/ibm) | [`langchain-ibm`](https://reference.langchain.com/python/integrations/langchain_ibm/) | <a href="https://pypi.org/project/langchain-ibm/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-ibm/month)
</a> | <a href="https://pypi.org/project/langchain-ibm/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-ibm?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/ibm) |
| [Milvus](lc:oss/python/integrations/providers/milvus) | [`langchain-milvus`](https://reference.langchain.com/python/integrations/langchain_milvus/) | <a href="https://pypi.org/project/langchain-milvus/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-milvus/month)
</a> | <a href="https://pypi.org/project/langchain-milvus/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-milvus?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/community) |
| [OpenRouter](lc:oss/python/integrations/providers/openrouter) | [`langchain-openrouter`](https://reference.langchain.com/python/integrations/langchain_openrouter/) | <a href="https://pypi.org/project/langchain-openrouter/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-openrouter/month)
</a> | <a href="https://pypi.org/project/langchain-openrouter/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-openrouter?style=flat-square&label=%20)
</a> | ❌ |
| [Perplexity](lc:oss/python/integrations/providers/perplexity) | [`langchain-perplexity`](https://reference.langchain.com/python/integrations/langchain_perplexity/) | <a href="https://pypi.org/project/langchain-perplexity/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-perplexity/month)
</a> | <a href="https://pypi.org/project/langchain-perplexity/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-perplexity?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/community) |
| [Elasticsearch](lc:oss/python/integrations/providers/elasticsearch) | [`langchain-elasticsearch`](https://reference.langchain.com/python/integrations/langchain_elasticsearch/) | <a href="https://pypi.org/project/langchain-elasticsearch/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-elasticsearch/month)
</a> | <a href="https://pypi.org/project/langchain-elasticsearch/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-elasticsearch?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/community) |
| [DataStax Astra DB](lc:oss/python/integrations/providers/astradb) | [`langchain-astradb`](https://reference.langchain.com/python/integrations/langchain_astradb/) | <a href="https://pypi.org/project/langchain-astradb/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-astradb/month)
</a> | <a href="https://pypi.org/project/langchain-astradb/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-astradb?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/community) |
| [Redis](lc:oss/python/integrations/providers/redis) | [`langchain-redis`](https://reference.langchain.com/python/integrations/langchain_redis/) | <a href="https://pypi.org/project/langchain-redis/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-redis/month)
</a> | <a href="https://pypi.org/project/langchain-redis/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-redis?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/redis) |
| [Together](lc:oss/python/integrations/providers/together) | [`langchain-together`](https://reference.langchain.com/python/integrations/langchain_together/) | <a href="https://pypi.org/project/langchain-together/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-together/month)
</a> | <a href="https://pypi.org/project/langchain-together/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-together?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/community) |
| [MCP Toolbox (Google)](lc:oss/python/integrations/providers/toolbox) | [`toolbox-langchain`](https://pypi.org/project/toolbox-langchain/) | <a href="https://pypi.org/project/toolbox-langchain/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/toolbox-langchain/month)
</a> | <a href="https://pypi.org/project/toolbox-langchain/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/toolbox-langchain?style=flat-square&label=%20)
</a> | ❌ |
| [Google (Community)](lc:oss/python/integrations/providers/google) | [`langchain-google-community`](https://reference.langchain.com/python/integrations/langchain_google_community/) | <a href="https://pypi.org/project/langchain-google-community/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-google-community/month)
</a> | <a href="https://pypi.org/project/langchain-google-community/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-google-community?style=flat-square&label=%20)
</a> | ❌ |
| [Weaviate](lc:oss/python/integrations/providers/weaviate) | [`langchain-weaviate`](https://reference.langchain.com/python/integrations/langchain_weaviate/) | <a href="https://pypi.org/project/langchain-weaviate/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-weaviate/month)
</a> | <a href="https://pypi.org/project/langchain-weaviate/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-weaviate?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/weaviate) |
| [Unstructured](lc:oss/python/integrations/providers/unstructured) | [`langchain-unstructured`](https://reference.langchain.com/python/integrations/langchain_unstructured/) | <a href="https://pypi.org/project/langchain-unstructured/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-unstructured/month)
</a> | <a href="https://pypi.org/project/langchain-unstructured/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-unstructured?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/community) |
| [Neo4J](lc:oss/python/integrations/providers/neo4j) | [`langchain-neo4j`](https://reference.langchain.com/python/integrations/langchain_neo4j/) | <a href="https://pypi.org/project/langchain-neo4j/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-neo4j/month)
</a> | <a href="https://pypi.org/project/langchain-neo4j/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-neo4j?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/community) |
| [Exa](lc:oss/python/integrations/providers/exa_search) | [`langchain-exa`](https://reference.langchain.com/python/integrations/langchain_exa/) | <a href="https://pypi.org/project/langchain-exa/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-exa/month)
</a> | <a href="https://pypi.org/project/langchain-exa/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-exa?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/exa) |
| [Graph RAG](lc:oss/python/integrations/providers/graph_rag) | [`langchain-graph-retriever`](https://pypi.org/project/langchain-graph-retriever/) | <a href="https://pypi.org/project/langchain-graph-retriever/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-graph-retriever/month)
</a> | <a href="https://pypi.org/project/langchain-graph-retriever/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-graph-retriever?style=flat-square&label=%20)
</a> | ❌ |
| [Sambanova](lc:oss/python/integrations/providers/sambanova) | [`langchain-sambanova`](https://pypi.org/project/langchain-sambanova/) | <a href="https://pypi.org/project/langchain-sambanova/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-sambanova/month)
</a> | <a href="https://pypi.org/project/langchain-sambanova/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-sambanova?style=flat-square&label=%20)
</a> | ❌ |
| [Oracle AI Vector Search](lc:oss/python/integrations/providers/oracleai) | [`langchain-oracledb`](https://pypi.org/project/langchain-oracledb/) | <a href="https://pypi.org/project/langchain-oracledb/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-oracledb/month)
</a> | <a href="https://pypi.org/project/langchain-oracledb/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-oracledb?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@oracle/langchain-oracledb) |
| [Cerebras](lc:oss/python/integrations/providers/cerebras) | [`langchain-cerebras`](https://reference.langchain.com/python/integrations/langchain_cerebras/) | <a href="https://pypi.org/project/langchain-cerebras/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-cerebras/month)
</a> | <a href="https://pypi.org/project/langchain-cerebras/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-cerebras?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/cerebras) |
| [Docling](lc:oss/python/integrations/providers/docling) | [`langchain-docling`](https://pypi.org/project/langchain-docling/) | <a href="https://pypi.org/project/langchain-docling/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-docling/month)
</a> | <a href="https://pypi.org/project/langchain-docling/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-docling?style=flat-square&label=%20)
</a> | ❌ |
| [Oracle Cloud Infrastructure (OCI)](lc:oss/python/integrations/providers/oci) | [`langchain-oci`](https://pypi.org/project/langchain-oci/) | <a href="https://pypi.org/project/langchain-oci/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-oci/month)
</a> | <a href="https://pypi.org/project/langchain-oci/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-oci?style=flat-square&label=%20)
</a> | ❌ |
| [Azure Dynamic Sessions](lc:oss/python/integrations/providers/microsoft) | [`langchain-azure-dynamic-sessions`](https://reference.langchain.com/python/integrations/langchain_azure_dynamic_sessions/) | <a href="https://pypi.org/project/langchain-azure-dynamic-sessions/" target="_blank">
![Downloads per month](https://static.pepy.tech/badge/langchain-azure-dynamic-sessions/month)
</a> | <a href="https://pypi.org/project/langchain-azure-dynamic-sessions/" target="_blank">
![PyPI - Latest version](https://img.shields.io/pypi/v/langchain-azure-dynamic-sessions?style=flat-square&label=%20)
</a> | [✅](https://www.npmjs.com/package/@langchain/azure-dynamic-sessions) |

## All providers

[See all providers](lc:oss/python/integrations/providers/all_providers) or search for a provider using the search field.


> [!NOTE]
>
> If you'd like to contribute an integration, see the [contributing guide](lc:oss/python/contributing/overview).
