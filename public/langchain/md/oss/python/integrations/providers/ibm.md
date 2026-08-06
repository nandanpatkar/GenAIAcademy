LangChain integrations related to IBM technologies, including the
[IBM watsonx.ai](https://www.ibm.com/products/watsonx-ai) platform and DB2 database.

## Watsonx AI

IBM® watsonx.ai™ AI studio is part of the IBM [watsonx](https://www.ibm.com/watsonx)™ AI and data platform, bringing together new generative
AI capabilities powered by [foundation models](https://www.ibm.com/products/watsonx-ai/foundation-models) and traditional machine learning (ML)
into a powerful studio spanning the AI lifecycle. Tune and guide models with your enterprise data to meet your needs with easy-to-use tools for
building and refining performant prompts. With watsonx.ai, you can build AI applications in a fraction of the time and with a fraction of the data.
Watsonx.ai offers:

- **Multi-model variety and flexibility:** Choose from IBM-developed, open-source and third-party models, or build your own model.
- **Differentiated client protection:** IBM stands behind IBM-developed models and indemnifies the client against third-party IP claims.
- **End-to-end AI governance:** Enterprises can scale and accelerate the impact of AI with trusted data across the business, using data wherever it resides.
- **Hybrid, multi-cloud deployments:** IBM provides the flexibility to integrate and deploy your AI workloads into your hybrid-cloud stack of choice.

### Model interfaces


### [ChatWatsonx](lc:oss/python/integrations/chat/ibm_watsonx)
IBM watsonx.ai chat models.

    ### [WatsonxLLM](lc:oss/python/integrations/llms/ibm_watsonx)
(Legacy) IBM watsonx.ai text completion models.

    ### [WatsonxEmbeddings](lc:oss/python/integrations/embeddings/ibm_watsonx)
IBM watsonx.ai embedding models.


### Tools and toolkits


### [WatsonxToolkit](lc:oss/python/integrations/tools/ibm_watsonx)
IBM watsonx.ai toolkit.

    ### [WatsonxSQLDatabaseToolkit](lc:oss/python/integrations/tools/ibm_watsonx_sql)
IBM watsonx.ai SQL Database toolkit.


### Retrievers


### [WatsonxRerank](lc:oss/python/integrations/retrievers/ibm_watsonx_ranker)
IBM watsonx.ai document retriever.


## DB2

The IBM DB2 relational database v12.1.2 and above offers the abilities of vector store
and vector search. Installation of `langchain-db2` package will give LangChain users
the support of DB2 vector store and vector search.


> [!NOTE]
>
> `langchain-db2` is a separate package for Vector Store feature only, and can be run without the `langchain-ibm` package.


### Vector stores


### [DB2VS](https://github.com/langchain-ai/langchain-ibm/tree/main/libs/langchain-db2)
IBM DB2 Vector Store and Vector Search
