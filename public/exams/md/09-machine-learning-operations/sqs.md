## When To Use

- Use when producers and consumers need to be decoupled.
- Use to buffer batch jobs, inference requests, or post-processing tasks.
- Use dead-letter queues for failures that require investigation.

## Core Concepts

- Standard queues provide at-least-once delivery and high throughput.
- FIFO queues support ordering and exactly-once processing semantics.
- Visibility timeout hides a message while a consumer processes it.

## AWS Services And Features

- Amazon SQS
- Amazon SNS
- AWS Lambda
- AWS KMS

## Implementation Patterns

- EventBridge or SNS -> SQS queue -> Lambda or container worker -> SageMaker endpoint/batch transform.
- Failed processing -> dead-letter queue -> operator review.

## Tradeoffs And Pitfalls

- At-least-once delivery means consumers should be idempotent.
- Visibility timeout must exceed normal processing time.
- SQS is pull-based; SNS is push/fanout.

## Decision Triggers

- Queue, visibility timeout, DLQ, and decoupling point to SQS.
- Multiple subscribers receiving the same event point to SNS fanout.

## Related Notes

```ex-cards
[{"title": "Amazon SNS", "href": "ex:09-machine-learning-operations/sns", "body": ""}, {"title": "AWS Lambda For ML Workflows", "href": "ex:09-machine-learning-operations/lambda-for-ml-workflows", "body": ""}, {"title": "Event Bridge", "href": "ex:09-machine-learning-operations/event-bridge", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html", "href": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain3.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain3.html"}]
```
