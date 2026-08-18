## When To Use

- Use Amazon Q Business for permissions-aware enterprise assistant use cases over organizational data.
- Use Amazon Q Developer for AWS development, operations, code assistance, security scanning, and IDE/chat workflows.
- Use Amazon Q Developer in chat applications for ChatOps notifications and commands.

## Core Concepts

- Amazon Q Business is built on Bedrock and answers from configured enterprise data with citations.
- Amazon Q Developer helps understand, build, extend, and operate AWS applications.
- AWS Chatbot is now documented as Amazon Q Developer in chat applications.

## AWS Services And Features

- Amazon Q Business
- Amazon Q Developer
- Amazon Q Developer in chat applications
- Amazon Bedrock
- IAM Identity Center

## Implementation Patterns

- Enterprise docs/connectors -> Q Business index/application -> permissions-aware answers.
- AWS event/SNS topic -> Q Developer in chat applications -> Slack/Teams operational action.

## Tradeoffs And Pitfalls

- Do not treat Amazon Q as a general FM hosting API; Bedrock is the managed FM API layer.
- Data permissions and identity setup are central for Q Business.
- Some IDE plugin lifecycle changes affect specific plugins, not Amazon Q Developer overall.

## Decision Triggers

- Enterprise assistant with citations and permissions points to Q Business.
- AWS coding and operational assistant points to Q Developer.
- ChatOps replacement for AWS Chatbot points to Q Developer in chat applications.

## Related Notes

```ex-cards
[{"title": "Amazon Bedrock (deep dive notes)", "href": "ex:13-bedrock/amazon-bedrock", "body": ""}, {"title": "Amazon Q Developer In Chat Applications", "href": "ex:09-machine-learning-operations/aws-chatbot", "body": ""}, {"title": "Bedrock Guardrails", "href": "ex:13-bedrock/bedrock-guardrails", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/amazonq/latest/qbusiness-ug/what-is.html", "href": "https://docs.aws.amazon.com/amazonq/latest/qbusiness-ug/what-is.html"}, {"title": "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/what-is.html", "href": "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/what-is.html"}, {"title": "https://docs.aws.amazon.com/chatbot/latest/adminguide/what-is.html", "href": "https://docs.aws.amazon.com/chatbot/latest/adminguide/what-is.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html"}]
```
