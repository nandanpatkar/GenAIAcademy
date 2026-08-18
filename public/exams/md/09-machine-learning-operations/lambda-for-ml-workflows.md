## When To Use

- Use for event-triggered preprocessing, routing, notification, and small integration tasks.
- Use to invoke SageMaker endpoints or start Step Functions, Glue, or Batch jobs.
- Use when automatic scaling and pay-per-use are more important than custom infrastructure.

## Core Concepts

- Lambda runs code without server management and scales automatically.
- Event sources can include S3, EventBridge, SQS, API Gateway, and streams.
- Functions use IAM execution roles and CloudWatch logs.

## AWS Services And Features

- AWS Lambda
- Amazon S3
- Amazon SQS
- Amazon EventBridge
- Amazon API Gateway
- AWS Step Functions

## Implementation Patterns

- S3 object created -> Lambda validates metadata -> starts SageMaker Pipeline.
- API Gateway -> Lambda -> SageMaker endpoint invocation.
- CloudWatch alarm -> SNS/EventBridge -> Lambda remediation.

## Tradeoffs And Pitfalls

- Lambda has runtime, package, memory, concurrency, and timeout constraints.
- Large training jobs belong in SageMaker Training, AWS Batch, EMR, or Glue, not Lambda.
- Use VPC configuration carefully because networking choices affect access and latency.

## Decision Triggers

- Small event-driven integration points to Lambda.
- Long-running ML training does not point to Lambda.
- Serverless API wrapper around endpoint often uses API Gateway plus Lambda.

## Related Notes

```ex-cards
[{"title": "Amazon API Gateway", "href": "ex:09-machine-learning-operations/api-gateway", "body": ""}, {"title": "Amazon SQS", "href": "ex:09-machine-learning-operations/sqs", "body": ""}, {"title": "Step Functions", "href": "ex:09-machine-learning-operations/step-functions", "body": ""}, {"title": "SageMaker Pipelines", "href": "ex:05-sagemaker-ai/sagemaker-pipelines", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html", "href": "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain3.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain3.html"}]
```
