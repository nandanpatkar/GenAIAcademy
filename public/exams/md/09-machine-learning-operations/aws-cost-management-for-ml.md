## When To Use

- Use Cost Explorer to analyze usage and forecast costs.
- Use Budgets for thresholds and notifications.
- Use cost allocation tags and cost categories to attribute ML spend.

## Core Concepts

- Billing and Cost Management covers billing, cost analysis, cost organization, budgeting, and savings/commitments.
- Cost Explorer supports grouped and filtered cost/usage analysis.
- Budgets sends alerts when costs or usage exceed thresholds.

## AWS Services And Features

- AWS Billing and Cost Management
- AWS Cost Explorer
- AWS Budgets
- AWS Cost Anomaly Detection
- AWS Organizations

## Implementation Patterns

- Tag SageMaker endpoints/training jobs/S3 buckets -> analyze in Cost Explorer -> budget alerts through SNS.
- Use right-sizing and endpoint autoscaling before moving to larger instance classes.

## Tradeoffs And Pitfalls

- Tags must be activated for cost allocation.
- Idle endpoints and Studio apps can create avoidable cost.
- Spot training saves cost but requires checkpointing and interruption tolerance.

## Decision Triggers

- Cost forecast, budget alert, chargeback/showback, and unused resources point to AWS Cost Management.
- Right-sizing recommendation points to Compute Optimizer or Trusted Advisor depending on wording.

## Related Notes

```ex-cards
[{"title": "AWS Compute Optimizer", "href": "ex:09-machine-learning-operations/compute-optimizer", "body": ""}, {"title": "AWS Trusted Advisor", "href": "ex:09-machine-learning-operations/trusted-advisor", "body": ""}, {"title": "SageMaker Spot Training", "href": "ex:05-sagemaker-ai/sagemaker-spot-training", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/cost-management/latest/userguide/what-is-costmanagement.html", "href": "https://docs.aws.amazon.com/cost-management/latest/userguide/what-is-costmanagement.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html"}]
```
