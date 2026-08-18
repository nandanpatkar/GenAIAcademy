## When To Use

- Use unit tests for transforms and training utilities.
- Use data validation tests for schema and feature contracts.
- Use integration tests for pipelines, containers, permissions, and endpoints.
- Use smoke/canary tests before full rollout.

## Core Concepts

- ML CI/CD must test code, data, model behavior, infrastructure, and deployment safety.
- Different test stages belong in CodeBuild, SageMaker Pipelines, deployment guardrails, or monitoring workflows.

## AWS Services And Features

- AWS CodeBuild
- AWS CodePipeline
- SageMaker Pipelines
- SageMaker Model Registry

## Implementation Patterns

- Commit -> CodePipeline -> CodeBuild unit/data tests -> SageMaker pipeline -> model evaluation -> registry approval -> deployment guardrail.

## Tradeoffs And Pitfalls

- Model accuracy tests alone are insufficient.
- Non-determinism requires tolerances and seeded/reproducible runs where possible.
- Production deployment needs rollback and monitoring.

## Decision Triggers

- CI/CD tests, model approval, and pipeline validation point to MLOps testing.
- Shadow/canary wording points to deployment guardrails.

## Related Notes

```ex-cards
[{"title": "Code Build", "href": "ex:09-machine-learning-operations/code-build", "body": ""}, {"title": "Code Pipeline", "href": "ex:09-machine-learning-operations/code-pipeline", "body": ""}, {"title": "SageMaker Pipelines", "href": "ex:05-sagemaker-ai/sagemaker-pipelines", "body": ""}, {"title": "Deployment Guardrails And Shadow Test", "href": "ex:09-machine-learning-operations/deployment-guardrails-and-shadow-test", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain3.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain3.html"}, {"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/pipelines.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/pipelines.html"}]
```
