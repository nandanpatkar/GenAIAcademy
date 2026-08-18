## When To Use

- Use for operational notifications in Slack, Microsoft Teams, or Amazon Chime.
- Use when teams need to respond to CloudWatch alarms, budgets, or security events from chat.
- Use with SNS topics as notification sources.

## Core Concepts

- AWS Chatbot is now Amazon Q Developer in chat applications.
- Uses SNS topics to forward events and alarms to chat channels.
- Supports IAM permission templates, guardrails, custom actions, and AWS CLI commands.

## AWS Services And Features

- Amazon Q Developer in chat applications
- Amazon SNS
- Amazon CloudWatch
- AWS Budgets

## Implementation Patterns

- CloudWatch alarm -> SNS topic -> Q Developer chat channel notification.
- Budget threshold -> SNS -> chat notification -> operator command/action.

## Tradeoffs And Pitfalls

- Channel IAM role and guardrail policies control command permissions.
- ChatOps does not replace incident management or observability data.
- Use SNS for the notification fanout layer.

## Decision Triggers

- AWS Chatbot wording should map to Amazon Q Developer in chat applications.
- Notifications from SNS to Slack/Teams point here.

## Related Notes

```ex-cards
[{"title": "Amazon Q", "href": "ex:01-ai-services/amazon-q", "body": ""}, {"title": "Amazon SNS", "href": "ex:09-machine-learning-operations/sns", "body": ""}, {"title": "Amazon CloudWatch", "href": "ex:10-security-identity-and-compliance/cloudwatch", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/chatbot/latest/adminguide/what-is.html", "href": "https://docs.aws.amazon.com/chatbot/latest/adminguide/what-is.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html"}]
```
