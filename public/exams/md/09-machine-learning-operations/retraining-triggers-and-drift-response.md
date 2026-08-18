## When To Use

- Trigger retraining from scheduled cadence, drift threshold breach, new labeled data, or business KPI degradation.
- Use EventBridge, Step Functions, and SageMaker Pipelines to automate response.
- Use human approval for high-risk model promotions.

## Core Concepts

- Data drift means input distribution changes.
- Model quality drift means prediction performance changes against labels.
- Bias drift means fairness metrics shift.
- Retraining should include validation and approval before deployment.

## AWS Services And Features

- SageMaker Model Monitor
- SageMaker Clarify
- Amazon EventBridge
- AWS Step Functions
- SageMaker Pipelines

## Implementation Patterns

- Model Monitor violation -> EventBridge -> Step Functions/SageMaker Pipeline -> retrain -> evaluate -> Model Registry approval -> deploy.

## Tradeoffs And Pitfalls

- Retraining without fresh labels may not improve model quality.
- Automated promotion can be risky in regulated workflows.
- Need baselines and thresholds before alerts are meaningful.

## Decision Triggers

- Drift threshold breach and automated retraining point to Model Monitor plus EventBridge/Pipelines.
- Bias drift points to Clarify.

## Related Notes

```ex-cards
[{"title": "SageMaker Model Monitor", "href": "ex:05-sagemaker-ai/sagemaker-model-monitor", "body": ""}, {"title": "SageMaker Clarify", "href": "ex:05-sagemaker-ai/sagemaker-clarify", "body": ""}, {"title": "SageMaker Pipelines", "href": "ex:05-sagemaker-ai/sagemaker-pipelines", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html"}, {"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/model-monitor.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/model-monitor.html"}, {"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/clarify-configure-processing-jobs.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/clarify-configure-processing-jobs.html"}]
```
