This page covers all LangChain integrations with [Google Gemini](https://ai.google.dev/gemini-api/docs), [Google Cloud](https://cloud.google.com/), and other Google products (such as Google Maps, YouTube, and [more](#other-google-products)).


> [!NOTE]
>
> **Unified SDK & package consolidation**
>
>     As of `langchain-google-genai` 4.0.0, this package uses the consolidated [`google-genai`](https://googleapis.github.io/python-genai/) SDK and now supports **both the Gemini Developer API and Vertex AI** backends.
>
>     The `langchain-google-vertexai` package remains supported for Vertex AI platform-specific features (Model Garden, Vector Search, evaluation services, etc.).
>
>     Read the [full announcement and migration guide](https://github.com/langchain-ai/langchain-google/discussions/1422).


Not sure which package to use?

    ### Google Generative AI (Gemini API & Vertex AI)

        Access Google Gemini models via the **[Gemini Developer API](https://ai.google.dev/)** or **[Vertex AI](https://cloud.google.com/vertex-ai)**. The backend is selected automatically based on your configuration.

        - **Gemini Developer API**: Quick setup with API key, ideal for individual developers and rapid prototyping
        - **Vertex AI**: Enterprise features with Google Cloud integration (requires GCP project)

        Use the `langchain-google-genai` package for chat models, LLMs, and embeddings.

        [See integrations.](#google-generative-ai)
    
    ### Google Cloud (Vertex AI Platform Services)

        Access Vertex AI platform-specific services beyond Gemini models: Model Garden (Llama, Mistral, Anthropic), evaluation services, and specialized vision models.

        Use the `langchain-google-vertexai` package for platform services and specific packages (e.g., `langchain-google-community`, `langchain-google-cloud-sql-pg`) for other cloud services like databases and storage.

        [See integrations.](#google-cloud)
    

See Google's guide on [migrating from the Gemini API to Vertex AI](https://ai.google.dev/gemini-api/docs/migrate-to-cloud) for more details on the differences.

---

## Google Generative AI

Access Google Gemini models via the [Gemini Developer API](https://ai.google.dev/gemini-api/docs) or [Vertex AI](https://cloud.google.com/vertex-ai) using the unified `langchain-google-genai` package.

### Chat models


### [ChatGoogleGenerativeAI](lc:oss/python/integrations/chat/google_generative_ai)
Google Gemini chat models via **Gemini Developer API** or **Vertex AI**.


### LLMs


### [GoogleGenerativeAI](lc:oss/python/integrations/llms/google_generative_ai)
Gemini models using the (legacy) LLM text completion interface.


### Embedding models


### [GoogleGenerativeAIEmbeddings](lc:oss/python/integrations/embeddings/google_generative_ai)
Gemini embedding models via **Gemini Developer API** or **Vertex AI**.


---

## Google Cloud

Access Vertex AI platform-specific services including Model Garden (Llama, Mistral, Anthropic), Vector Search, evaluation services, and specialized vision models.


> [!NOTE]
>
> **For Gemini models**, use [`ChatGoogleGenerativeAI`](lc:oss/python/integrations/chat/google_generative_ai) from `langchain-google-genai`. The classes below focus on **Vertex AI platform services** not available in the consolidated SDK.


### Chat models


### [ChatAnthropicVertex](#)
Anthropic on Vertex AI Model Garden


    ### ChatVertexAI (deprecated)

        **Deprecated**—Use [`ChatGoogleGenerativeAI`](lc:oss/python/integrations/chat/google_generative_ai) for Gemini models instead.

        ```python wrap
        from langchain_google_vertexai import ChatVertexAI
        ```
    
    ### VertexModelGardenLlama

        Llama on Vertex AI Model Garden

        ```python wrap
        from langchain_google_vertexai.model_garden_maas.llama import VertexModelGardenLlama
        ```
    
    ### VertexModelGardenMistral

        Mistral on Vertex AI Model Garden

        ```python wrap
        from langchain_google_vertexai.model_garden_maas.mistral import VertexModelGardenMistral
        ```
    
    ### GemmaChatLocalHF

        Local Gemma model loaded from HuggingFace.

        ```python wrap
        from langchain_google_vertexai.gemma import GemmaChatLocalHF
        ```
    
    ### GemmaChatLocalKaggle

        Local Gemma model loaded from Kaggle.

        ```python wrap
        from langchain_google_vertexai.gemma import GemmaChatLocalKaggle
        ```
    
    ### GemmaChatVertexAIModelGarden

        Gemma on Vertex AI Model Garden

        ```python wrap
        from langchain_google_vertexai.gemma import GemmaChatVertexAIModelGarden
        ```
    
    ### VertexAIImageCaptioningChat

        Image captioning model as a chat interface.

        ```python wrap
        from langchain_google_vertexai.vision_models import VertexAIImageCaptioningChat
        ```
    
    ### VertexAIImageEditorChat

        Edit images given a prompt. Currently supports mask-free editing only.

        ```python wrap
        from langchain_google_vertexai.vision_models import VertexAIImageEditorChat
        ```
    
    ### VertexAIImageGeneratorChat

        Generate images from a prompt.

        ```python wrap
        from langchain_google_vertexai.vision_models import VertexAIImageGeneratorChat
        ```
    
    ### VertexAIVisualQnAChat

        Visual question answering model as a chat interface.

        ```python wrap
        from langchain_google_vertexai.vision_models import VertexAIVisualQnAChat
        ```
    

### LLMs

(Legacy) string-in, string-out LLM interface.


### [VertexAIModelGarden](#)
Hundreds of OSS models via Vertex AI Model Garden.


    ### VertexAI (deprecated)

        **Deprecated**—Use [`GoogleGenerativeAI`](lc:oss/python/integrations/llms/google_generative_ai) for Gemini models instead.

        ```python wrap
        from langchain_google_vertexai import VertexAI
        ```
    
    ### Gemma local from Hugging Face

        Local Gemma model loaded from HuggingFace.

        ```python wrap
        from langchain_google_vertexai.gemma import GemmaLocalHF
        ```
    
    ### Gemma local from Kaggle

        Local Gemma model loaded from Kaggle.

        ```python wrap
        from langchain_google_vertexai.gemma import GemmaLocalKaggle
        ```
    
    ### Gemma on Vertex AI Model Garden

        ```python wrap
        from langchain_google_vertexai.gemma import GemmaVertexAIModelGarden
        ```
    
    ### Vertex AI image captioning

        Image captioning model as an LLM interface.

        ```python wrap
        from langchain_google_vertexai.vision_models import VertexAIImageCaptioning
        ```
    

### Embedding models

    ### VertexAIEmbeddings (deprecated)

        **Deprecated**—Use [`GoogleGenerativeAIEmbeddings`](lc:oss/python/integrations/embeddings/google_generative_ai) instead.

        ```python wrap
        from langchain_google_vertexai import VertexAIEmbeddings
        ```
    

### Document loaders


### [AlloyDB for PostgreSQL](lc:oss/python/integrations/document_loaders/google_alloydb)
PostgreSQL-compatible database on Google Cloud.

    ### [BigQuery](lc:oss/python/integrations/document_loaders/google_bigquery)
Serverless data warehouse.

    ### [Bigtable](lc:oss/python/integrations/document_loaders/google_bigtable)
Key-value and wide-column store for structured and semi-structured data.

    ### [Cloud SQL for MySQL](lc:oss/python/integrations/document_loaders/google_cloud_sql_mysql)
Managed MySQL database.

    ### [Cloud SQL for SQL Server](lc:oss/python/integrations/document_loaders/google_cloud_sql_mssql)
Managed SQL Server database.

    ### [Cloud SQL for PostgreSQL](https://cloud.google.com/sql/docs/postgres)
Managed PostgreSQL database.

    ### [Cloud Storage (directory)](lc:oss/python/integrations/document_loaders/google_cloud_storage_directory)
Load documents from a GCS bucket directory.

    ### [Cloud Storage (file)](lc:oss/python/integrations/document_loaders/google_cloud_storage_file)
Load a single document from GCS.

    ### [El Carro for Oracle Workloads](https://github.com/googleapis/langchain-google-el-carro-python/)
Oracle databases on Kubernetes via El Carro.

    ### [Firestore (Native Mode)](lc:oss/python/integrations/document_loaders/google_firestore)
NoSQL document database.

    ### [Firestore (Datastore Mode)](lc:oss/python/integrations/document_loaders/google_datastore)
Firestore in Datastore mode.

    ### [Memorystore for Redis](lc:oss/python/integrations/document_loaders/google_memorystore_redis)
Managed Redis service.

    ### [Spanner](lc:oss/python/integrations/document_loaders/google_spanner)
Globally distributed relational database.

    ### [Speech-to-Text](lc:oss/python/integrations/document_loaders/google_speech_to_text)
Transcribe audio files.


### Cloud Vision loader

    Load data using Google Cloud Vision API.

    ```python
    from langchain_google_community.vision import CloudVisionLoader
    ```

### Document transformers


### [Document AI](lc:oss/python/integrations/document_transformers/google_docai)
Extract structured data from unstructured documents.

    ### [Google Translate](lc:oss/python/integrations/document_transformers/google_translate)
Translate text and HTML via Cloud Translation API.


### Vector stores

Store and search vectors using Google Cloud databases and Vertex AI Vector Search.


### [AlloyDB for PostgreSQL](lc:oss/python/integrations/vectorstores/google_alloydb)
PostgreSQL-compatible vector store on AlloyDB.

    ### [BigQuery Vector Search](lc:oss/python/integrations/vectorstores/google_bigquery_vector_search)
Semantic search using GoogleSQL with vector indexes.

    ### [Memorystore for Redis](lc:oss/python/integrations/vectorstores/google_memorystore_redis)
Vector store on Memorystore for Redis.

    ### [Spanner](lc:oss/python/integrations/vectorstores/google_spanner)
Vector store on Cloud Spanner.

    ### [Bigtable](https://cloud.google.com/bigtable)
Vector store on Cloud Bigtable.

    ### [Firestore (Native Mode)](lc:oss/python/integrations/vectorstores/google_firestore)
Vector store on Firestore.

    ### [Cloud SQL for MySQL](lc:oss/python/integrations/vectorstores/google_cloud_sql_mysql)
Vector store on Cloud SQL for MySQL.

    ### [Cloud SQL for PostgreSQL](lc:oss/python/integrations/vectorstores/google_cloud_sql_pg)
Vector store on Cloud SQL for PostgreSQL.

    ### [Vertex AI Vector Search](lc:oss/python/integrations/vectorstores/google_vertex_ai_vector_search)
Formerly known as Vertex AI Matching Engine, provides a low latency vector database. These vector databases are commonly referred to as vector similarity-matching or an approximate nearest neighbor (ANN) service.

    ### [Vertex AI Vector Search + Datastore](lc:oss/python/integrations/vectorstores/google_vertex_ai_vector_search#optional--you-can-also-create-vector-and-store-chunks-in-a-datastore)
Vector search with Datastore for document storage.


### Retrievers


### [Vertex AI Search](#)
Generative AI powered search via Vertex AI Search.

    ### [Document AI Warehouse](#)
Search, store, and manage documents using Document AI Warehouse.


```python Other retrievers
from langchain_google_community import VertexAIMultiTurnSearchRetriever
from langchain_google_community import VertexAISearchRetriever
from langchain_google_community import VertexAISearchSummaryTool
```

### Tools

Integrate agents with various Google Cloud services.


### [Text-to-Speech](#)
Synthesize natural-sounding speech with 100+ voices.


### Callbacks

Track LLM/Chat model usage.

    ### Vertex AI callback handler

        Track `VertexAI` usage info.

        ```python wrap
        from langchain_google_vertexai.callbacks import VertexAICallbackHandler
        ```
    
    ### Google BigQuery

        See the [documentation](lc:oss/python/integrations/callbacks/google_bigquery) for more details.

        ```python wrap
        from langchain_google_community.callbacks.bigquery_callback import BigQueryCallbackHandler
        ```
    

### Evaluators

Evaluate model outputs using Vertex AI.

    ### VertexPairWiseStringEvaluator

        Pair-wise evaluation using Vertex AI models.

        ```python wrap
        from langchain_google_vertexai.evaluators.evaluation import VertexPairWiseStringEvaluator
        ```
    
    ### VertexStringEvaluator

        Single prediction evaluation using Vertex AI models.

        ```python wrap
        from langchain_google_vertexai.evaluators.evaluation import VertexStringEvaluator
        ```
    

---

## Other Google products

Integrations with various Google services beyond the core Cloud Platform.

### Document loaders


### [Google Drive](lc:oss/python/integrations/document_loaders/google_drive)
Load files from Google Drive. Currently supports Google Docs.


### Retrievers


### [Google Drive](lc:oss/python/integrations/retrievers/google_drive)
Retrieve documents from Google Drive.


### Tools


### [Google Search](lc:oss/python/integrations/tools/google_search)
Web search via Google Custom Search Engine (CSE).

    ### [Google Drive](lc:oss/python/integrations/tools/google_drive)
Interact with Google Drive.


### MCP


### [MCP Toolbox](lc:oss/python/integrations/tools/mcp_toolbox)
Connect to databases including Cloud SQL and AlloyDB.


### Toolkits


### [Gmail](#)
Create, search, and send emails via the Gmail API.


---

## 3rd party integrations

Access Google services via unofficial third-party APIs.

### Search


### [cloro](#)
Google Search results with AI Overview support.
