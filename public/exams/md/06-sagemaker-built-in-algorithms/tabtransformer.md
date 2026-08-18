## When To Use

- Use when the data/task matches the algorithm family and a managed SageMaker built-in container is preferred.
- Use to avoid maintaining custom training code when built-in input formats and hyperparameters fit.

## Core Concepts

- TabTransformer is a self-attention-based architecture for tabular data, supports CSV input, and is useful when categorical feature interactions are important.
- Check required input channels, content types, and instance recommendations before training.
- Compare against XGBoost/LightGBM/Linear Learner or custom training depending on task and constraints.

## AWS Services And Features

- Amazon SageMaker AI built-in algorithms
- SageMaker Training
- SageMaker Automatic Model Tuning

## Implementation Patterns

- S3 training data -> built-in algorithm container -> training job -> model artifact -> endpoint or batch transform.

## Tradeoffs And Pitfalls

- Built-in algorithms still require correct input format and feature engineering.
- Use the algorithm cheat sheet to avoid choosing image/text/tabular algorithms interchangeably.
- Not every algorithm is parallelizable or GPU-appropriate.

## Decision Triggers

- Managed built-in algorithm with matching data type points to SageMaker AI.
- Need full architecture control points to custom training.

## Related Notes

```ex-cards
[{"title": "SageMaker Built-In Algorithms Cheat Sheet", "href": "ex:06-sagemaker-built-in-algorithms/sagemaker-built-in-algorithms-cheat-sheet", "body": ""}, {"title": "Model Selection Decision Guide", "href": "ex:04-model-training-tuning-and-evaluation/model-selection-decision-guide", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/algorithms-tabular.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/algorithms-tabular.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain2.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain2.html"}]
```
