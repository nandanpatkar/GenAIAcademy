## When To Use

- Use when one class is underrepresented and accuracy may hide poor minority-class performance.
- Use resampling, class weights, threshold tuning, or anomaly detection framing depending on the problem.
- Use Clarify CI when measuring facet imbalance for bias/fairness.

## Core Concepts

- Class imbalance affects metrics, training dynamics, and fairness.
- Oversampling duplicates/synthesizes minority examples; undersampling reduces majority examples.
- Clarify Class Imbalance ranges from -1 to +1 for facet representation imbalance.

## AWS Services And Features

- Amazon SageMaker Clarify
- SageMaker Training
- SageMaker Model Monitor

## Implementation Patterns

- Stratified split -> train with class weights or resampling -> evaluate precision/recall/F1/AUC-PR -> monitor minority-class performance.

## Tradeoffs And Pitfalls

- Accuracy is misleading under severe imbalance.
- Oversampling can overfit; undersampling can discard information.
- Choose the metric that matches false-positive/false-negative cost.

## Decision Triggers

- Rare positive class, skewed labels, or minority recall points to imbalance handling.
- Facet representation imbalance points to Clarify Class Imbalance.

## Related Notes

```ex-cards
[{"title": "Bias Metrics: CI And DPL", "href": "ex:common/bias-metrics-ci-dpl", "body": ""}, {"title": "Model Metrics", "href": "ex:04-model-training-tuning-and-evaluation/model-metrics", "body": ""}, {"title": "SageMaker Clarify", "href": "ex:05-sagemaker-ai/sagemaker-clarify", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/clarify-measure-data-bias.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/clarify-measure-data-bias.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain1.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain1.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain2.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain2.html"}]
```
