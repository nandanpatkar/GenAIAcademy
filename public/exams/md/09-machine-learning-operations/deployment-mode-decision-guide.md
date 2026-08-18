## When To Use

- Use real-time endpoints for low-latency synchronous inference.
- Use async inference for large payloads or longer processing with queued responses.
- Use batch transform for offline batch inference.
- Use serverless inference for intermittent traffic.
- Use multi-model endpoints for many related models with shared serving infrastructure.

## Core Concepts

- Deployment mode depends on latency, throughput, payload size, traffic shape, cost, and response pattern.
- Application Auto Scaling supports endpoint variants and inference components.
- CloudWatch metrics and Model Monitor support operations after deployment.

## AWS Services And Features

- SageMaker real-time endpoints
- SageMaker asynchronous inference
- SageMaker batch transform
- SageMaker serverless inference
- SageMaker multi-model endpoints

## Implementation Patterns

- Request/response API -> real-time endpoint.
- Large request with callback/polling -> async endpoint.
- Nightly scoring job -> batch transform.
- Low intermittent usage -> serverless inference.

## Tradeoffs And Pitfalls

- Keeping idle real-time endpoints can be expensive.
- Serverless cold starts may affect latency.
- Batch transform is not interactive.
- MLOps needs rollback, monitoring, and automation regardless of mode.

## Decision Triggers

- Low latency synchronous inference points to real-time endpoint.
- Large payload or long-running inference points to async inference.
- Offline scoring points to batch transform.

## Related Notes

```ex-cards
[{"title": "SageMaker Deployment Modes", "href": "ex:05-sagemaker-ai/sagemaker-deployment-modes", "body": ""}, {"title": "SageMaker Model Endpoints", "href": "ex:05-sagemaker-ai/sagemaker-model-endpoints", "body": ""}, {"title": "Endpoint Autoscaling Metrics", "href": "ex:09-machine-learning-operations/endpoint-autoscaling-metrics", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain3.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain3.html"}, {"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/deploy-model.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/deploy-model.html"}]
```
