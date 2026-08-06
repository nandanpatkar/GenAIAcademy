>Memgraph is a high-performance, in-memory graph database that is optimized for real-time queries and analytics.
>Get started with Memgraph by visiting [their website](https://memgraph.com/).

## Installation and setup

- Install the Python SDK with `pip install langchain-memgraph`

## MemgraphQAChain

There exists a wrapper around Memgraph database that allows you to generate Cypher statements based on the user input
and use them to retrieve relevant information from the database.

```python
from langchain_memgraph.chains.graph_qa import MemgraphQAChain
from langchain_memgraph.graphs.memgraph import MemgraphLangChain
```

See a [usage example](lc:oss/python/integrations/graphs/memgraph)

## Constructing a knowledge graph from unstructured data

You can use the integration to construct a knowledge graph from unstructured data.


> [!WARNING]
>
> The `langchain-experimental` package is no longer maintained. Examples that import from `langchain_experimental` may be outdated or broken. Use with caution.


```python
from langchain_memgraph.graphs.memgraph import MemgraphLangChain
from langchain_neo4j import LLMGraphTransformer
```

See a [usage example](lc:oss/python/integrations/graphs/memgraph)

## Memgraph tools and toolkit

Memgraph also provides a toolkit that allows you to interact with the Memgraph database.
See a [usage example](https://github.com/memgraph/langchain-memgraph).

```python
from langchain_memgraph import MemgraphToolkit
```
