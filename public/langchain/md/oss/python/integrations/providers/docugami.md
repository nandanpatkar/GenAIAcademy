>[Docugami](https://docugami.com) converts business documents into a Document XML Knowledge Graph, generating forests
> of XML semantic trees representing entire documents. This is a rich representation that includes the semantic and
> structural characteristics of various chunks in the document as an XML tree.

## Installation and setup

```lc-tabs
[
 {
  "label": "pip",
  "lang": "bash",
  "code": "pip install dgml-utils\npip install docugami-langchain"
 },
 {
  "label": "uv",
  "lang": "bash",
  "code": "uv add dgml-utils\nuv add docugami-langchain"
 }
]
```

## Document loader

See a [usage example](lc:oss/python/integrations/document_loaders/docugami).

```python
from docugami_langchain.document_loaders import DocugamiLoader
```
