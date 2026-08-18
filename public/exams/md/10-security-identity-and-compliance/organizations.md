## When To Use

- Use to centrally manage accounts, organizational units, policies, and consolidated billing.
- Use service control policies for guardrails across accounts/OUs.
- Use with CloudTrail, Config, Macie, and Cost Explorer for central governance.

## Core Concepts

- Accounts are natural boundaries for permissions, security, costs, and workloads.
- OUs group accounts.
- SCPs restrict maximum available permissions.
- Consolidated billing gives one bill across accounts.

## AWS Services And Features

- AWS Organizations
- Service Control Policies
- AWS Cost Explorer
- AWS Config
- AWS CloudTrail

## Implementation Patterns

- Security OU + workload OUs -> SCP guardrails -> central logging/security/cost accounts.
- Consolidated billing -> Cost Explorer views grouped by linked accounts and tags.

## Tradeoffs And Pitfalls

- SCPs do not grant permissions; they set guardrails.
- Management account should be protected and used sparingly.
- Separate workload accounts reduce blast radius.

## Decision Triggers

- Multi-account governance, OUs, SCPs, and consolidated billing point to Organizations.
- Approved product catalog points to Service Catalog.

## Related Notes

```ex-cards
[{"title": "AWS Config", "href": "ex:10-security-identity-and-compliance/aws-config", "body": ""}, {"title": "AWS Service Catalog", "href": "ex:10-security-identity-and-compliance/service-catalog", "body": ""}, {"title": "AWS Cost Management For ML", "href": "ex:09-machine-learning-operations/aws-cost-management-for-ml", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html", "href": "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html"}]
```
