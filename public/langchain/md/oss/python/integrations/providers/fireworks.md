[Fireworks AI](https://fireworks.ai/) hosts open and proprietary language models with fast inference. The `langchain-fireworks` package implements LangChain chat and embedding interfaces for the Fireworks API.

## Installation and setup

```lc-tabs
[
 {
  "label": "pip",
  "lang": "bash",
  "code": "pip install langchain-fireworks"
 },
 {
  "label": "uv",
  "lang": "bash",
  "code": "uv add langchain-fireworks"
 }
]
```

Get an API key from [fireworks.ai](https://app.fireworks.ai/login) and set the `FIREWORKS_API_KEY` environment variable.

## Model interfaces


### [ChatFireworks](lc:oss/python/integrations/chat/fireworks)
Interface to chat models hosted on Fireworks AI.

    ### [FireworksEmbeddings](lc:oss/python/integrations/embeddings/fireworks)
Embedding models served by Fireworks AI.
