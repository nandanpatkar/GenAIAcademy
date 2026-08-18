## When To Use

- Use invocations per instance or concurrency metrics for target tracking.
- Use latency and error metrics as health signals, not blindly as scaling triggers.
- Use scheduled scaling when traffic patterns are predictable.

## Core Concepts

- Endpoint variants are scalable targets.
- Target tracking aims to maintain a metric target.
- CloudWatch supplies endpoint metrics and alarms.

## AWS Services And Features

- Amazon SageMaker AI
- Application Auto Scaling
- Amazon CloudWatch

## Implementation Patterns

- Register endpoint variant as scalable target -> configure target tracking policy -> monitor latency/errors/cost.

## Tradeoffs And Pitfalls

- Scaling out cannot fix slow model code or insufficient instance memory.
- Aggressive scaling can increase cost without improving bottlenecks.
- Need load testing to set realistic targets.

## Decision Triggers

- Invocations per instance and target tracking point to endpoint autoscaling.
- Known traffic spike points to scheduled scaling.

## Related Notes

```ex-cards
[{"title": "AWS Auto Scaling For ML Workloads", "href": "ex:09-machine-learning-operations/aws-auto-scaling", "body": ""}, {"title": "SageMaker Model Endpoints", "href": "ex:05-sagemaker-ai/sagemaker-model-endpoints", "body": ""}, {"title": "Amazon CloudWatch", "href": "ex:10-security-identity-and-compliance/cloudwatch", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/autoscaling/application/userguide/what-is-application-auto-scaling.html", "href": "https://docs.aws.amazon.com/autoscaling/application/userguide/what-is-application-auto-scaling.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html"}]
```
