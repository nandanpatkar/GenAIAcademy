## When To Use

- Use only to understand historical exam/service references.
- For current anomaly detection, prefer CloudWatch anomaly detection, SageMaker AI, or custom time-series models.

## Core Concepts

- Was an ML service for detecting anomalies in business and operational metrics.
- No longer available or supported in any capacity after full shutdown.

## AWS Services And Features

- Amazon Lookout for Metrics
- Amazon CloudWatch
- Amazon SageMaker AI

## Implementation Patterns

- Historical: metrics source -> detector -> anomaly alerts.
- Current: CloudWatch metric math/anomaly detection or SageMaker model for custom time-series monitoring.

## Tradeoffs And Pitfalls

- Full shutdown means it should not be selected as a current implementation choice.
- If an exam item uses it, read for legacy context and choose current alternatives when offered.

## Decision Triggers

- Metric anomaly detection with no-current-service caveat points away from Lookout for Metrics.
- CloudWatch anomaly detection or custom SageMaker time-series model is the current direction.

## Related Notes

```ex-cards
[{"title": "Amazon CloudWatch", "href": "ex:10-security-identity-and-compliance/cloudwatch", "body": ""}, {"title": "Random Cut Forest", "href": "ex:06-sagemaker-built-in-algorithms/random-cut-forest", "body": ""}, {"title": "Concept Drift in Machine Learning", "href": "ex:common/concept-drift", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/general/latest/gr/full_shutdown_services.html", "href": "https://docs.aws.amazon.com/general/latest/gr/full_shutdown_services.html"}, {"title": "https://docs.aws.amazon.com/lookoutmetrics/latest/api/Welcome.html", "href": "https://docs.aws.amazon.com/lookoutmetrics/latest/api/Welcome.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html"}]
```
