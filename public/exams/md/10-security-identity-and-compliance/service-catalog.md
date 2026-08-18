## When To Use

- Use when teams need to launch approved infrastructure without direct broad permissions.
- Use for standardized ML environments, notebooks, or pipeline templates.
- Use portfolios, products, constraints, and IAM access to govern launches.

## Core Concepts

- Administrators create portfolios and products.
- End users launch provisioned products they are allowed to access.
- Constraints standardize regions, instance types, tags, and other controls.

## AWS Services And Features

- AWS Service Catalog
- AWS CloudFormation
- IAM
- AWS Organizations

## Implementation Patterns

- Admin publishes SageMaker project/environment template -> grants portfolio access -> data scientist launches approved product.

## Tradeoffs And Pitfalls

- Service Catalog governs infrastructure templates; it does not run ML jobs by itself.
- Product versions and constraints need lifecycle management.

## Decision Triggers

- Approved IT service catalog, self-service with guardrails, and provisioned products point to Service Catalog.
- Infrastructure as code template alone points to CloudFormation/CDK.

## Related Notes

```ex-cards
[{"title": "Cloud Formation", "href": "ex:09-machine-learning-operations/cloud-formation", "body": ""}, {"title": "Cloud Development Kit", "href": "ex:09-machine-learning-operations/cloud-development-kit", "body": ""}, {"title": "AWS Organizations", "href": "ex:10-security-identity-and-compliance/organizations", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/servicecatalog/latest/adminguide/introduction.html", "href": "https://docs.aws.amazon.com/servicecatalog/latest/adminguide/introduction.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html"}]
```
