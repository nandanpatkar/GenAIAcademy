>[Mistral AI](https://docs.mistral.ai/api/) is a platform that offers hosting for their powerful open source models.

## Installation and setup

A valid [API key](https://console.mistral.ai/users/api-keys/) is needed to communicate with the API.

You will also need the `langchain-mistralai` package:

```lc-tabs
[
 {
  "label": "pip",
  "lang": "bash",
  "code": "pip install langchain-mistralai"
 },
 {
  "label": "uv",
  "lang": "bash",
  "code": "uv add langchain-mistralai"
 }
]
```

## Chat models

### ChatMistralAI

See a [usage example](lc:oss/python/integrations/chat/mistralai).

```python
from langchain_mistralai.chat_models import ChatMistralAI
```

## Embedding models

### MistralAIEmbeddings

See a [usage example](lc:oss/python/integrations/embeddings/mistralai).

```python
from langchain_mistralai import MistralAIEmbeddings
```
