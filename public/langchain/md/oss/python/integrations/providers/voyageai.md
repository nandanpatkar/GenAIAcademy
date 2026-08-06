All functionality related to VoyageAI

>[VoyageAI](https://www.voyageai.com/) Voyage AI builds embedding models, customized for your domain and company, for better retrieval quality.

## Installation and setup

Install the integration package with

```lc-tabs
[
 {
  "label": "pip",
  "lang": "bash",
  "code": "pip install langchain-voyageai"
 },
 {
  "label": "uv",
  "lang": "bash",
  "code": "uv add langchain-voyageai"
 }
]
```

Get a VoyageAI API key and set it as an environment variable (`VOYAGE_API_KEY`)

## Text embedding model

See a [usage example](lc:oss/python/integrations/embeddings/voyageai).

```python
from langchain_voyageai import VoyageAIEmbeddings
```

## Reranking

See a [usage example](lc:oss/python/integrations/document_transformers/voyageai-reranker).

```python
from langchain_voyageai import VoyageAIRerank
```
