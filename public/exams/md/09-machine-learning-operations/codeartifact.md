## When To Use

- Use to store private Python, npm, Maven, NuGet, or other supported packages.
- Use to proxy public repositories and reduce dependency availability risk.
- Use in CodeBuild/CodePipeline workflows for controlled dependency retrieval.

## Core Concepts

- Domains contain repositories.
- Repositories store packages and can use upstream repositories and external connections.
- Authentication tokens are required; packages cannot be made publicly available from CodeArtifact.

## AWS Services And Features

- AWS CodeArtifact
- AWS CodeBuild
- AWS CodePipeline
- IAM

## Implementation Patterns

- Private ML preprocessing package -> CodeArtifact -> CodeBuild training image build.
- Proxy PyPI/npm through CodeArtifact for reproducible CI/CD dependencies.

## Tradeoffs And Pitfalls

- CodeArtifact is for software packages, not model artifacts.
- Repository permissions and token lifetime affect CI/CD reliability.
- Pin package versions for reproducible ML pipelines.

## Decision Triggers

- Package dependency repository points to CodeArtifact.
- Model artifact registry points to SageMaker Model Registry or S3.

## Related Notes

```ex-cards
[{"title": "Code Build", "href": "ex:09-machine-learning-operations/code-build", "body": ""}, {"title": "Code Pipeline", "href": "ex:09-machine-learning-operations/code-pipeline", "body": ""}, {"title": "SageMaker Model Registry", "href": "ex:05-sagemaker-ai/sagemaker-model-registry", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/codeartifact/latest/ug/welcome.html", "href": "https://docs.aws.amazon.com/codeartifact/latest/ug/welcome.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain3.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain3.html"}]
```
