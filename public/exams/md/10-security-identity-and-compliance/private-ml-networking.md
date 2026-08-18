## When To Use

- Use VPC subnets/security groups for SageMaker jobs/endpoints that access private resources.
- Use VPC endpoints/PrivateLink for private access to supported AWS services.
- Use Direct Connect or VPN for hybrid private connectivity.

## Core Concepts

- Private subnets reduce direct internet exposure.
- Interface endpoints use PrivateLink; gateway endpoints support services such as S3/DynamoDB.
- Security groups and endpoint policies control traffic boundaries.

## AWS Services And Features

- Amazon VPC
- AWS PrivateLink
- Amazon SageMaker AI
- Amazon S3 VPC endpoints
- AWS Direct Connect

## Implementation Patterns

- SageMaker training job in VPC -> S3 VPC endpoint -> private bucket access.
- On-prem data center -> Direct Connect/VPN -> VPC -> SageMaker processing/training.

## Tradeoffs And Pitfalls

- Private networking can break dependency downloads unless endpoints/NAT are planned.
- Endpoint policies and bucket policies should align.
- Direct Connect is not encryption by itself.

## Decision Triggers

- Private access to S3/SageMaker without internet points to VPC endpoints/PrivateLink.
- Dedicated on-prem connection points to Direct Connect.

## Related Notes

```ex-cards
[{"title": "Define a training job with VPC configuration", "href": "ex:10-security-identity-and-compliance/vpc", "body": ""}, {"title": "AWS Direct Connect", "href": "ex:10-security-identity-and-compliance/direct-connect", "body": ""}, {"title": "Amazon SageMaker Role Manager", "href": "ex:10-security-identity-and-compliance/sagemaker-role-manager", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/train-vpc.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/train-vpc.html"}, {"title": "https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html", "href": "https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html"}]
```
