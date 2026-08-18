## When To Use

- Use CI to measure imbalance in member counts between facet values.
- Use DPL to measure imbalance of positive outcome proportions across facets.
- Use before training to detect raw data bias.

## Core Concepts

- Facet is a column/attribute used for bias measurement.
- CI asks whether one facet has more samples than another.
- DPL asks whether one facet has a higher positive label proportion.

## AWS Services And Features

- Amazon SageMaker Clarify

## Implementation Patterns

- Select facet and label -> run Clarify pre-training bias analysis -> review CI/DPL -> mitigate before training.

## Tradeoffs And Pitfalls

- Metrics are model-agnostic before training; they do not prove legal fairness.
- Interpretation depends on the application and definition of positive outcome.
- Bias mitigation should involve product, policy, legal, and domain stakeholders.

## Decision Triggers

- CI means class/facet imbalance.
- DPL means difference in positive label proportions.
- Pre-training bias metric wording points to Clarify.

## Related Notes

```ex-cards
[{"title": "SageMaker Clarify", "href": "ex:05-sagemaker-ai/sagemaker-clarify", "body": ""}, {"title": "Class Imbalance And Resampling", "href": "ex:common/class-imbalance-and-resampling", "body": ""}, {"title": "Conditional Demographic Disparity (CDD)", "href": "ex:common/conditional-demographic-disparity", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/clarify-measure-data-bias.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/clarify-measure-data-bias.html"}, {"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/clarify-detect-data-bias.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/clarify-detect-data-bias.html"}]
```
