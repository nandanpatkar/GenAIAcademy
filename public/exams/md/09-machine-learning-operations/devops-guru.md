## When To Use

- Use to identify operational issues and risks from metrics/events.
- Use for reactive and proactive insights about application health.
- Use as an operations signal alongside CloudWatch, X-Ray, and Trusted Advisor.

## Core Concepts

- Applies ML to operational data, application metrics, and events.
- Creates reactive insights for current issues and proactive insights for future risks.
- Provides recommendations to address detected operational problems.

## AWS Services And Features

- Amazon DevOps Guru
- Amazon CloudWatch
- AWS CloudFormation
- AWS Systems Manager

## Implementation Patterns

- Enable resource analysis coverage -> DevOps Guru analyzes telemetry -> insight and recommendation -> operator remediation.

## Tradeoffs And Pitfalls

- DevOps Guru improves operational diagnosis; it does not retrain ML models.
- Disable or scope coverage to avoid unwanted charges.
- Use Model Monitor/Clarify for model/data drift, not DevOps Guru.

## Decision Triggers

- Operational issue/risk with ML-generated recommendation points to DevOps Guru.
- Model drift or bias points to SageMaker Model Monitor or Clarify.

## Related Notes

```ex-cards
[{"title": "Amazon CloudWatch", "href": "ex:10-security-identity-and-compliance/cloudwatch", "body": ""}, {"title": "AWS X-Ray", "href": "ex:09-machine-learning-operations/x-ray", "body": ""}, {"title": "AWS Trusted Advisor", "href": "ex:09-machine-learning-operations/trusted-advisor", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/devops-guru/latest/userguide/welcome.html", "href": "https://docs.aws.amazon.com/devops-guru/latest/userguide/welcome.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html"}]
```
