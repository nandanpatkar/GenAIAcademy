## When To Use

- Use to audit configuration history and relationships for AWS resources.
- Use Config rules to detect noncompliant resources.
- Use in multi-account governance with Organizations and aggregators.

## Core Concepts

- Configuration recorder captures supported resource configuration changes.
- Rules evaluate resource configuration against desired conditions.
- Snapshots/history support audit and troubleshooting.

## AWS Services And Features

- AWS Config
- AWS Organizations
- Amazon S3
- Amazon SNS

## Implementation Patterns

- Enable recorder -> store history/snapshots in S3 -> evaluate managed/custom rules -> notify via SNS/EventBridge.
- Organization aggregator -> central compliance view across accounts.

## Tradeoffs And Pitfalls

- Config is not a real-time metrics service.
- You need S3/SNS/IAM setup for recording and notifications.
- Not all resource types support every relationship or rule pattern.

## Decision Triggers

- Configuration drift, compliance rule, resource history, and audit evidence point to AWS Config.
- API call history points to CloudTrail.

## Related Notes

```ex-cards
[{"title": "Cloudtrail", "href": "ex:10-security-identity-and-compliance/cloudtrail", "body": ""}, {"title": "AWS Organizations", "href": "ex:10-security-identity-and-compliance/organizations", "body": ""}, {"title": "AWS Service Catalog", "href": "ex:10-security-identity-and-compliance/service-catalog", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html", "href": "https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html"}]
```
