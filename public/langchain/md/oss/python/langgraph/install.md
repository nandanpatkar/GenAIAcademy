To install the base LangGraph package:


```lc-tabs
[
 {
  "label": "pip",
  "lang": "bash",
  "code": "pip install -U langgraph"
 },
 {
  "label": "uv",
  "lang": "bash",
  "code": "uv add langgraph"
 }
]
```


To use LangGraph you will usually want to access LLMs and define tools.
You can do this however you see fit.

One way to do this (which we will use in the docs) is to use [LangChain](lc:oss/python/langchain/overview).

Install LangChain with:


```lc-tabs
[
 {
  "label": "pip",
  "lang": "bash",
  "code": "pip install -U langchain\n# Requires Python 3.10+"
 },
 {
  "label": "uv",
  "lang": "bash",
  "code": "uv add langchain\n# Requires Python 3.10+"
 }
]
```


To work with specific LLM provider packages, you will need install them separately.

Refer to the [integrations](lc:oss/python/integrations/providers/overview) page for provider-specific installation instructions.
