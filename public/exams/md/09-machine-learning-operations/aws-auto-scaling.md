## When To Use

- Use Application Auto Scaling for SageMaker AI endpoint variants, inference components, and serverless provisioned concurrency.
- Use target tracking when a metric target such as invocations per instance should stay near a value.
- Use scheduled scaling for known traffic patterns.

## Core Concepts

- Application Auto Scaling supports resources beyond EC2 Auto Scaling groups.
- Scaling policies can be target tracking, step, scheduled, or predictive where supported.
- CloudWatch metrics drive most scaling decisions.

## AWS Services And Features

- Application Auto Scaling
- Amazon SageMaker AI
- Amazon CloudWatch

## Implementation Patterns

- Endpoint variant -> scalable target -> target tracking policy on invocation metric.
- Known traffic spike -> scheduled scaling before the event -> scale down afterward.

## Tradeoffs And Pitfalls

- Scaling policy cannot fix a poorly chosen model/container bottleneck by itself.
- Cold starts and provisioned concurrency matter for serverless inference.
- Cost and latency objectives must be balanced.

## Decision Triggers

- Endpoint variant autoscaling points to Application Auto Scaling.
- Metric-based scaling policy plus CloudWatch points to Application Auto Scaling.

## Related Notes

```ex-cards
[{"title": "Endpoint Autoscaling Metrics", "href": "ex:09-machine-learning-operations/endpoint-autoscaling-metrics", "body": ""}, {"title": "SageMaker Model Endpoints", "href": "ex:05-sagemaker-ai/sagemaker-model-endpoints", "body": ""}, {"title": "Amazon CloudWatch", "href": "ex:10-security-identity-and-compliance/cloudwatch", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/autoscaling/application/userguide/what-is-application-auto-scaling.html", "href": "https://docs.aws.amazon.com/autoscaling/application/userguide/what-is-application-auto-scaling.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html"}]
```
