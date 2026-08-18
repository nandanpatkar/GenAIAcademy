## When To Use

- Use a baseline to verify that a model beats simple heuristics or prior models.
- Use learning curves to identify underfitting, overfitting, or training instability.
- Use early stopping when validation metrics stop improving.

## Core Concepts

- Baseline can be naive rule, majority class, previous production model, or simple algorithm.
- Convergence means objective/metric changes become small or stable.
- Non-convergence can come from learning rate, data scaling, bad features, or insufficient training.

## AWS Services And Features

- Amazon SageMaker AI
- Automatic Model Tuning
- SageMaker Experiments

## Implementation Patterns

- Train baseline -> train candidate -> compare validation/test metric -> inspect learning curves -> tune or stop.

## Tradeoffs And Pitfalls

- A complex model that does not beat a baseline is not ready.
- Training loss improving while validation worsens suggests overfitting.
- Unstable loss can indicate learning-rate or data quality issues.

## Decision Triggers

- Baseline comparison and convergence detected point to Domain 2 performance analysis.
- Early stopping/tuning objective point to AMT.

## Related Notes

```ex-cards
[{"title": "Model Metrics", "href": "ex:04-model-training-tuning-and-evaluation/model-metrics", "body": ""}, {"title": "📗 **AWS Automatic Model Tuning (AMT) & Hyperparameter Tuning**", "href": "ex:04-model-training-tuning-and-evaluation/automatic-model-tuning-and-hyperparameter-tuning", "body": ""}, {"title": "Preventing Overfitting", "href": "ex:common/preventing-overfitting", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain2.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain2.html"}, {"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/automatic-model-tuning-how-it-works.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/automatic-model-tuning-how-it-works.html"}]
```
