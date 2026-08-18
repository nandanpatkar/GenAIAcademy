## When To Use

- Use one-hot encoding for low-cardinality nominal categories.
- Use label/ordinal encoding only when order is meaningful or model can handle integer-coded categories safely.
- Use tokenization/embedding approaches for text.

## Core Concepts

- Encoding changes representation, not ground truth.
- High-cardinality features can explode dimensionality.
- Tree algorithms and deep models tolerate different encodings differently.

## AWS Services And Features

- SageMaker Data Wrangler
- AWS Glue
- Amazon SageMaker AI

## Implementation Patterns

- Raw categorical column -> profile cardinality -> choose encoding -> validate train/test consistency.
- Text column -> tokenize/vectorize/embedding -> model training.

## Tradeoffs And Pitfalls

- Never fit encoders separately on train and test sets.
- Label encoding can create false ordinal relationships.
- One-hot encoding can create sparse high-dimensional data.

## Decision Triggers

- Categorical variables and one-hot/label/binary encoding point to encoding.
- Text preprocessing points to tokenization or embeddings.

## Related Notes

```ex-cards
[{"title": "Feature Engineering", "href": "ex:03-data-transformation-integrity-and-feature-engineering/feature-engineering", "body": ""}, {"title": "Tf Idf", "href": "ex:03-data-transformation-integrity-and-feature-engineering/tf-idf", "body": ""}, {"title": "Sparse Data", "href": "ex:common/sparse-data", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain1.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain1.html"}, {"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/data-wrangler-data-preparation.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/data-wrangler-data-preparation.html"}]
```
