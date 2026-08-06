>[Chroma](https://docs.trychroma.com/getting-started) is a database for building AI applications with embeddings.

## Installation and setup

```lc-tabs
[
 {
  "label": "pip",
  "lang": "bash",
  "code": "pip install langchain-chroma"
 },
 {
  "label": "uv",
  "lang": "bash",
  "code": "uv add langchain-chroma"
 }
]
```

## VectorStore

There exists a wrapper around Chroma vector databases, allowing you to use it as a vectorstore,
whether for semantic search or example selection.

```python
from langchain_chroma import Chroma
```

For a more detailed walkthrough of the Chroma wrapper, see [this notebook](lc:oss/python/integrations/vectorstores/chroma).

## Retriever

```python
from langchain_classic.retrievers import SelfQueryRetriever
```
