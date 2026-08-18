## When To Use

- Use for rightsizing recommendations and resource optimization.
- Use with cost reviews for EC2, Auto Scaling groups, EBS, Lambda, ECS/Fargate, and other supported resources.
- Use alongside Cost Explorer and Trusted Advisor.

## Core Concepts

- Analyzes resource configuration and utilization metrics.
- Produces recommendations for over-provisioned or under-provisioned resources.
- Helps balance cost and performance.

## AWS Services And Features

- AWS Compute Optimizer
- Amazon CloudWatch
- AWS Cost Management

## Implementation Patterns

- Enable Compute Optimizer -> collect metrics -> review recommendations -> resize resource or adjust scaling.

## Tradeoffs And Pitfalls

- Recommendations are only as good as the observed metric history and supported resource types.
- SageMaker endpoint-specific autoscaling still uses SageMaker/Application Auto Scaling decisions.

## Decision Triggers

- Rightsizing compute resources points to Compute Optimizer.
- Broad support-plan check categories point to Trusted Advisor.

## Related Notes

```ex-cards
[{"title": "AWS Cost Management For ML", "href": "ex:09-machine-learning-operations/aws-cost-management-for-ml", "body": ""}, {"title": "AWS Trusted Advisor", "href": "ex:09-machine-learning-operations/trusted-advisor", "body": ""}, {"title": "AWS Auto Scaling For ML Workloads", "href": "ex:09-machine-learning-operations/aws-auto-scaling", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is.html", "href": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html"}]
```
