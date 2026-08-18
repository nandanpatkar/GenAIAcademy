## When To Use

- Use Studio as the web-based ML development environment for SageMaker AI resources.
- Use it to access notebooks, training, pipelines, experiments, model registry, feature store, Canvas/Data Wrangler-style experiences where available, and deployment workflows.
- Use Studio Classic only as legacy context for existing domains/workloads.

## Core Concepts

- All new SageMaker domains use updated Studio; treat Studio Classic as legacy context.
- Studio Classic is the previous experience and has lifecycle/maintenance caveats.
- Next-generation SageMaker includes SageMaker Unified Studio and access to SageMaker AI.

## AWS Services And Features

- Amazon SageMaker Studio
- SageMaker Studio Classic (legacy context)
- SageMaker Unified Studio
- Amazon SageMaker AI
- IAM Identity Center/IAM

## Implementation Patterns

- Create/enter SageMaker domain -> launch Studio -> build/process/train/tune/deploy/monitor ML assets.
- Use project/pipeline/model registry workflows for MLOps rather than one-off notebook-only deployments.

## Tradeoffs And Pitfalls

- Do not use old Studio Classic-only screenshots or terminology as current default behavior.
- Studio is a workspace; execution roles, domain settings, VPC/KMS/S3 permissions still control access.
- Idle apps and instances can create cost.

## Decision Triggers

- Current Studio vs Studio Classic legacy distinction points to this note.
- Unified data/AI development wording can point to next-generation SageMaker.
- Notebook-only workflow without MLOps is usually incomplete for production.

## Related Notes

```ex-cards
[{"title": "SageMaker AI Current Capabilities", "href": "ex:05-sagemaker-ai/sagemaker-ai-current-capabilities", "body": ""}, {"title": "SageMaker Domains", "href": "ex:05-sagemaker-ai/sagemaker-domains", "body": ""}, {"title": "SageMaker Pipelines", "href": "ex:05-sagemaker-ai/sagemaker-pipelines", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/studio.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/studio.html"}, {"title": "https://docs.aws.amazon.com/sagemaker/", "href": "https://docs.aws.amazon.com/sagemaker/"}, {"title": "https://docs.aws.amazon.com/next-generation-sagemaker/latest/userguide/what-is-sagemaker.html", "href": "https://docs.aws.amazon.com/next-generation-sagemaker/latest/userguide/what-is-sagemaker.html"}]
```
