>The `hkunlp/instructor-*` family introduced instruction-tuned sentence embeddings. They have been broadly superseded by modern instruction-aware models, but the original models are still available on Hugging Face and usable via the legacy `HuggingFaceInstructEmbeddings` class.

For new projects, prefer `HuggingFaceEmbeddings` from [`langchain-huggingface`](lc:oss/python/integrations/embeddings/sentence_transformers) with a current instruction-aware model such as `intfloat/e5-large-v2`, `Qwen/Qwen3-Embedding-0.6B`, or `BAAI/bge-m3`. Pass query and document prompts via `encode_kwargs` and `query_encode_kwargs`:

```python
from langchain_huggingface import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(
    model_name="intfloat/e5-large-v2",
    encode_kwargs={"prompt": "passage: "},
    query_encode_kwargs={"prompt": "query: "},
)
```

## Legacy Instructor usage

```shell
pip install -qU langchain-community InstructorEmbedding sentence-transformers
```


> [!WARNING]
>
> The `langchain-community` package is no longer maintained. Examples that import from `langchain_community` may be outdated or broken. Use with caution.


```python
from langchain_community.embeddings import HuggingFaceInstructEmbeddings

embeddings = HuggingFaceInstructEmbeddings(
    query_instruction="Represent the query for retrieval: "
)

query_result = embeddings.embed_query("This is a test document.")
```
