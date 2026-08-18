## When To Use

- Use only for historical context or existing customers.
- For current forecasting study, prefer SageMaker built-in algorithms such as DeepAR or custom time-series models.

## Core Concepts

- Forecast was a managed time-series forecasting service.
- New customers should use current alternatives.
- SageMaker DeepAR remains a key exam-relevant forecasting algorithm.

## AWS Services And Features

- Amazon Forecast
- Amazon SageMaker AI
- DeepAR

## Implementation Patterns

- Historical: time-series dataset -> Forecast predictor -> forecast.
- Current: time-series data -> DeepAR/SageMaker training or custom model -> endpoint/batch forecast.

## Tradeoffs And Pitfalls

- No new customers; avoid as a preferred current answer.
- Still useful to recognize old service wording.

## Decision Triggers

- Forecast service wording should trigger lifecycle caveat.
- DeepAR points to SageMaker built-in forecasting.

## Related Notes

```ex-cards
[{"title": "Deep Ar", "href": "ex:06-sagemaker-built-in-algorithms/deep-ar", "body": ""}, {"title": "Model Selection Decision Guide", "href": "ex:04-model-training-tuning-and-evaluation/model-selection-decision-guide", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/forecast/latest/dg/API_ListForecasts.html", "href": "https://docs.aws.amazon.com/forecast/latest/dg/API_ListForecasts.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html"}]
```
