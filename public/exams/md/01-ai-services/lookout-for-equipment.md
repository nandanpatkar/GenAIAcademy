## When To Use

- Use only for existing Lookout for Equipment workloads before migration.
- For new predictive maintenance, prefer SageMaker AI, domain-specific feature engineering, and custom anomaly detection models.

## Core Concepts

- Monitors industrial equipment sensor data for abnormal behavior and potential failures.
- Trains models from historical equipment data stored in S3.
- Targets fixed/stationary industrial equipment such as pumps, compressors, and turbines.

## AWS Services And Features

- Amazon Lookout for Equipment
- Amazon S3
- Amazon SageMaker AI

## Implementation Patterns

- Historical SCADA/sensor data -> S3 -> dataset/model -> scheduled inference for anomaly alerts.
- Migration path: S3/IOT data -> feature pipeline -> SageMaker model or time-series anomaly detection workflow.

## Tradeoffs And Pitfalls

- AWS will discontinue support on October 7, 2026.
- Treat as lifecycle caveat even if listed in exam scope.
- Do not use as a preferred greenfield service answer after the sunset announcement.

## Decision Triggers

- Industrial equipment anomaly detection with sunset caveat points to Lookout for Equipment.
- New custom predictive maintenance points to SageMaker AI.

## Related Notes

```ex-cards
[{"title": "SageMaker AI Current Capabilities", "href": "ex:05-sagemaker-ai/sagemaker-ai-current-capabilities", "body": ""}, {"title": "Random Cut Forest", "href": "ex:06-sagemaker-built-in-algorithms/random-cut-forest", "body": ""}, {"title": "Concept Drift in Machine Learning", "href": "ex:common/concept-drift", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/lookout-for-equipment/latest/ug/what-is.html", "href": "https://docs.aws.amazon.com/lookout-for-equipment/latest/ug/what-is.html"}, {"title": "https://docs.aws.amazon.com/general/latest/gr/sunset_services.html", "href": "https://docs.aws.amazon.com/general/latest/gr/sunset_services.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html"}]
```
