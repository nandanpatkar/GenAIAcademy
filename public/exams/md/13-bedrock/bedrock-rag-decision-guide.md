## When To Use

- Use RAG when answers must be grounded in private or frequently changing knowledge.
- Use Knowledge Bases for managed ingestion/retrieval/generation workflows.
- Use custom RAG when retrieval, orchestration, or ranking needs exceed managed defaults.

## Core Concepts

- RAG quality depends on source documents, chunking, embedding model, vector store, filters, prompts, citations, and evaluation.
- S3 Vectors can integrate with Bedrock Knowledge Bases as an S3-native vector store option.
- Pre-retrieval filtering narrows candidate context before retrieval/generation.

## AWS Services And Features

- Bedrock Knowledge Bases
- Amazon S3 Vectors
- OpenSearch Service
- Aurora PostgreSQL pgvector
- Bedrock Evaluations

## Implementation Patterns

- Documents -> chunking -> embeddings/vector store -> retrieval/filtering -> generation -> citation/evaluation.

## Tradeoffs And Pitfalls

- RAG does not guarantee correctness.
- Poor chunking or missing metadata reduces retrieval quality.
- Evaluate faithfulness, citation coverage, correctness, and harmfulness.

## Decision Triggers

- Private corpus Q&A points to RAG.
- Need managed retrieval/generation points to Bedrock Knowledge Bases.
- Need exact unchanged repeated prompt prefix points to prompt caching, not RAG.

## Related Notes

```ex-cards
[{"title": "Amazon Bedrock Knowledge Bases (deep dive notes)", "href": "ex:13-bedrock/bedrock-knowledge-base", "body": ""}, {"title": "Chunking strategies for RAG (deep dive notes)", "href": "ex:13-bedrock/chunking-strategies", "body": ""}, {"title": "Pre Retrieval Knowledge Base", "href": "ex:13-bedrock/pre-retrieval-knowledge-base", "body": ""}, {"title": "Optimizing Vector Store And Embeddings", "href": "ex:13-bedrock/optimizing-vector-store-and-embeddings", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html", "href": "https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html"}, {"title": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-bedrock-kb.html", "href": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-bedrock-kb.html"}, {"title": "https://docs.aws.amazon.com/bedrock/latest/userguide/evaluation.html", "href": "https://docs.aws.amazon.com/bedrock/latest/userguide/evaluation.html"}]
```
