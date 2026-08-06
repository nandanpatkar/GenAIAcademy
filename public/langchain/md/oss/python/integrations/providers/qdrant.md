>[Qdrant](https://qdrant.tech/documentation/) (read: quadrant) is a vector similarity search engine.
> It provides a production-ready service with a convenient API to store, search, and manage
> points - vectors with an additional payload. `Qdrant` is tailored to extended filtering support.

## Installation and setup

Install the Python partner package:

```lc-tabs
[
 {
  "label": "pip",
  "lang": "bash",
  "code": "pip install langchain-qdrant"
 },
 {
  "label": "uv",
  "lang": "bash",
  "code": "uv add langchain-qdrant"
 }
]
```

## Embedding models

### FastEmbedSparse

```python
from langchain_qdrant import FastEmbedSparse
```

### SparseEmbeddings

```python
from langchain_qdrant import SparseEmbeddings
```

## Vector store

There exists a wrapper around `Qdrant` indexes, allowing you to use it as a vectorstore,
whether for semantic search or example selection.

To import this vectorstore:
```python
from langchain_qdrant import QdrantVectorStore
```

For a more detailed walkthrough of the Qdrant wrapper, see [this notebook](lc:oss/python/integrations/vectorstores/qdrant)
