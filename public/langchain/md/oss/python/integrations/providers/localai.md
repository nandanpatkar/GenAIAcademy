>[LocalAI](https://localai.io/) is the free, Open Source OpenAI alternative.
> `LocalAI` act as a drop-in replacement REST API that’s compatible with OpenAI API
> specifications for local inferencing. It allows you to run LLMs, generate images,
> audio (and not only) locally or on-prem with consumer grade hardware,
> supporting multiple model families and architectures.


> [!NOTE]
>
> `langchain-localai` is a 3rd party integration package for LocalAI. It provides a simple way to use LocalAI services in LangChain.
> The source code is available on [GitHub](https://github.com/mkhludnev/langchain-localai)


## Installation and setup

```lc-tabs
[
 {
  "label": "pip",
  "lang": "bash",
  "code": "pip install langchain-localai"
 },
 {
  "label": "uv",
  "lang": "bash",
  "code": "uv add langchain-localai"
 }
]
```

## Embedding models

See a [usage example](https://localai.io/features/embeddings/index.html).

## Reranker

See a [usage example](lc:oss/python/integrations/document_transformers/localai_rerank).
