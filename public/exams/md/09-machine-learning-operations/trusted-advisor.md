## When To Use

- Use to review AWS account-level recommendations.
- Use for cost, security, performance, service quota, resiliency, and operational checks.
- Use with support-plan awareness because check availability can vary.

## Core Concepts

- Trusted Advisor provides recommendation categories and affected-resource details.
- Can show potential monthly savings for cost checks.
- Supports organizational views for broader account review.

## AWS Services And Features

- AWS Trusted Advisor
- AWS Support
- IAM
- AWS Organizations

## Implementation Patterns

- Open recommendations -> filter by category -> inspect affected resources -> remediate or exclude.
- Review cost optimization checks alongside Cost Explorer and Compute Optimizer.

## Tradeoffs And Pitfalls

- Some recommendations depend on support plan and refresh cadence.
- Trusted Advisor is advisory; remediation still requires operator action.
- Use Config for compliance rule state and history.

## Decision Triggers

- Best-practice checks across cost, performance, security, fault tolerance, limits point to Trusted Advisor.
- Configuration compliance over time points to AWS Config.

## Related Notes

```ex-cards
[{"title": "AWS Cost Management For ML", "href": "ex:09-machine-learning-operations/aws-cost-management-for-ml", "body": ""}, {"title": "AWS Compute Optimizer", "href": "ex:09-machine-learning-operations/compute-optimizer", "body": ""}, {"title": "AWS Config", "href": "ex:10-security-identity-and-compliance/aws-config", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/awssupport/latest/user/get-started-with-aws-trusted-advisor.html", "href": "https://docs.aws.amazon.com/awssupport/latest/user/get-started-with-aws-trusted-advisor.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html"}]
```
