## When To Use

- Use transformers for language, text classification, summarization, translation, code assistance, embeddings, and multimodal foundation model tasks.
- Use Bedrock for managed foundation model access and Amazon Q Developer for AWS/code assistant workflows.

## Core Concepts

- Transformers use self-attention to model token relationships.
- Encoder, decoder, and encoder-decoder variants suit different tasks.
- CodeWhisperer capabilities were renamed/moved into Amazon Q Developer.

## AWS Services And Features

- Amazon Bedrock
- Amazon Q Developer
- Amazon SageMaker AI

## Implementation Patterns

- Application need -> choose FM/API/service -> apply prompt/RAG/fine-tuning/evaluation pattern.

## Tradeoffs And Pitfalls

- Do not use old CodeWhisperer naming as the current service name.
- Transformers are architecture concepts; Bedrock/Q/SageMaker are AWS service surfaces.

## Decision Triggers

- AWS coding assistant now points to Amazon Q Developer.
- Foundation model hosting/API points to Bedrock.

## Related Notes

```ex-cards
[{"title": "Amazon Q", "href": "ex:01-ai-services/amazon-q", "body": ""}, {"title": "Amazon Bedrock (deep dive notes)", "href": "ex:13-bedrock/amazon-bedrock", "body": ""}, {"title": "Transformer Architecture", "href": "ex:07-generative-ai-model-fundamentals/transformer-architecture", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/service-rename.html", "href": "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/service-rename.html"}, {"title": "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/what-is.html", "href": "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/what-is.html"}, {"title": "https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html", "href": "https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html"}]
```
