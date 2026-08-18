## When To Use

- Use only for existing Elastic Inference environments.
- For current endpoint cost/performance decisions, use instance selection, accelerator instances, serverless/async/batch modes, and Inference Recommender.

## Core Concepts

- Elastic Inference let customers attach fractional GPU acceleration to endpoints in older patterns.
- The current study emphasis should be SageMaker Inference Recommender, endpoint modes, Application Auto Scaling, and modern accelerator instances.

## AWS Services And Features

- Amazon Elastic Inference
- Amazon SageMaker AI
- SageMaker Inference Recommender

## Implementation Patterns

- Historical: endpoint + EI accelerator.
- Current: benchmark with Inference Recommender -> choose endpoint instance/mode -> autoscale.

## Tradeoffs And Pitfalls

- No new customer onboarding after April 15, 2023.
- Do not select EI for greenfield current architecture questions.

## Decision Triggers

- Elastic Inference wording should trigger legacy caveat.
- Cost/performance endpoint recommendation points to Inference Recommender.

## Related Notes

```ex-cards
[{"title": "SageMaker Inference Recommender", "href": "ex:09-machine-learning-operations/sagemaker-inference-recommender", "body": ""}, {"title": "Deployment Mode Decision Guide", "href": "ex:09-machine-learning-operations/deployment-mode-decision-guide", "body": ""}, {"title": "Endpoint Autoscaling Metrics", "href": "ex:09-machine-learning-operations/endpoint-autoscaling-metrics", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/sdk-for-go/api/service/elasticinference/", "href": "https://docs.aws.amazon.com/sdk-for-go/api/service/elasticinference/"}, {"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/inference-recommender.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/inference-recommender.html"}]
```
