## Overview

[Graph RAG](https://datastax.github.io/graph-rag/) provides a retriever interface
that combines **unstructured** similarity search on vectors with **structured**
traversal of metadata properties. This enables graph-based retrieval over **existing**
vector stores.

## Installation and setup

```lc-tabs
[
 {
  "label": "pip",
  "lang": "bash",
  "code": "pip install langchain-graph-retriever"
 },
 {
  "label": "uv",
  "lang": "bash",
  "code": "uv add langchain-graph-retriever"
 }
]
```

## Retrievers

```python
from langchain_graph_retriever import GraphRetriever
```

For more information, see the [Graph RAG Integration Guide](lc:oss/python/integrations/retrievers/graph_rag).
