## When To Use

- Use to publish one event to multiple subscribers.
- Use for alarms, notifications, and fanout to SQS, Lambda, HTTP endpoints, email, or Firehose.
- Use with CloudWatch alarms or EventBridge workflows for operational notification.

## Core Concepts

- Topics are logical channels for publishers.
- Subscriptions deliver topic messages to endpoint types.
- Fanout copies one event to multiple processing paths.

## AWS Services And Features

- Amazon SNS
- Amazon SQS
- AWS Lambda
- Amazon Data Firehose
- Amazon CloudWatch

## Implementation Patterns

- Training failure alarm -> SNS topic -> email/Slack/Lambda remediation.
- New prediction object -> SNS topic -> multiple SQS queues for independent downstream processing.

## Tradeoffs And Pitfalls

- SNS is pub/sub, not a durable work queue by itself.
- Use SQS subscriptions when subscribers need buffering and retries.
- Avoid sending sensitive production data to test subscribers without controls.

## Decision Triggers

- Fanout to multiple consumers points to SNS.
- Durable decoupled queue with visibility timeout points to SQS.
- Operational notification from an alarm often uses SNS.

## Related Notes

```ex-cards
[{"title": "Amazon SQS", "href": "ex:09-machine-learning-operations/sqs", "body": ""}, {"title": "Event Bridge", "href": "ex:09-machine-learning-operations/event-bridge", "body": ""}, {"title": "Amazon CloudWatch", "href": "ex:10-security-identity-and-compliance/cloudwatch", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/sns/latest/dg/welcome.html", "href": "https://docs.aws.amazon.com/sns/latest/dg/welcome.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain3.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain3.html"}]
```
