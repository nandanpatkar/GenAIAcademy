## When To Use

- Use when creating SageMaker execution roles for common ML personas and activities.
- Use to reduce over-permissive IAM roles in SageMaker environments.
- Use with least privilege, VPC, KMS, S3, and service-specific policies.

## Core Concepts

- Role Manager helps generate IAM roles for SageMaker personas.
- Activities define access to resources such as training, processing, notebooks, pipelines, and model registry.
- The generated role still needs review against organizational policy.

## AWS Services And Features

- Amazon SageMaker Role Manager
- IAM
- Amazon S3
- AWS KMS

## Implementation Patterns

- Choose persona/activity -> Role Manager generates role -> review permissions -> attach to SageMaker user/job/domain.

## Tradeoffs And Pitfalls

- Generated roles are a starting point, not a substitute for security review.
- Least privilege requires narrowing data buckets, KMS keys, and network access.
- Separate user roles from execution roles.

## Decision Triggers

- SageMaker persona-based IAM role creation points to Role Manager.
- Generic cross-account governance points to IAM/Organizations/SCPs.

## Related Notes

```ex-cards
[{"title": "IAM", "href": "ex:10-security-identity-and-compliance/IAM", "body": ""}, {"title": "SageMaker Domains", "href": "ex:05-sagemaker-ai/sagemaker-domains", "body": ""}, {"title": "Private ML Networking", "href": "ex:10-security-identity-and-compliance/private-ml-networking", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/role-manager.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/role-manager.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html"}]
```
