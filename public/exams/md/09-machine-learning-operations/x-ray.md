## When To Use

- Use to trace latency and errors across APIs, Lambda functions, services, and downstream AWS resources.
- Use when a production ML application needs bottleneck analysis beyond metrics and logs.
- Use with CloudWatch and structured logs for full observability.

## Core Concepts

- Traces describe request paths.
- Segments and subsegments record work performed by services and downstream calls.
- Trace maps expose latency spikes and error paths.

## AWS Services And Features

- AWS X-Ray
- AWS Lambda
- Amazon API Gateway
- Amazon CloudWatch

## Implementation Patterns

- API Gateway -> Lambda -> SageMaker endpoint -> downstream service with traces enabled.
- Use X-Ray to identify whether latency is in app code, endpoint invocation, or a dependency.

## Tradeoffs And Pitfalls

- X-Ray does not replace CloudWatch metrics, alarms, or logs.
- Instrumentation and sampling choices affect visibility and cost.
- Model quality drift is handled by Model Monitor/Clarify, not X-Ray.

## Decision Triggers

- Distributed tracing, trace map, and request bottleneck point to X-Ray.
- Metric alarm and dashboard point to CloudWatch.

## Related Notes

```ex-cards
[{"title": "Amazon CloudWatch", "href": "ex:10-security-identity-and-compliance/cloudwatch", "body": ""}, {"title": "Amazon API Gateway", "href": "ex:09-machine-learning-operations/api-gateway", "body": ""}, {"title": "AWS Lambda For ML Workflows", "href": "ex:09-machine-learning-operations/lambda-for-ml-workflows", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html", "href": "https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html"}]
```
