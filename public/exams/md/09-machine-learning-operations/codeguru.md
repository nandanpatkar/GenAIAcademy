## When To Use

- Use CodeGuru Reviewer/Security context for code recommendations and vulnerability/secrets detection.
- Use CodeGuru Profiler context for identifying expensive or slow code paths.
- Use as developer-tooling context, not as an ML modeling service.

## Core Concepts

- CodeGuru uses machine learning and automated reasoning to help improve code quality and performance.
- Profiler highlights expensive lines and runtime behavior.
- Reviewer/Security analyze code for defects, security concerns, and secrets.

## AWS Services And Features

- Amazon CodeGuru Reviewer
- Amazon CodeGuru Profiler
- Amazon CodeGuru Security

## Implementation Patterns

- Repository association -> code review findings -> remediation.
- Runtime profiling group -> performance insights -> optimize hot paths.

## Tradeoffs And Pitfalls

- CodeGuru is not a replacement for unit tests, static analysis policy, or runtime monitoring.
- For request tracing, use X-Ray; for application metrics, use CloudWatch.

## Decision Triggers

- ML-powered code review/profiling points to CodeGuru.
- Distributed request trace map points to X-Ray.

## Related Notes

```ex-cards
[{"title": "AWS X-Ray", "href": "ex:09-machine-learning-operations/x-ray", "body": ""}, {"title": "Code Build", "href": "ex:09-machine-learning-operations/code-build", "body": ""}, {"title": "Code Pipeline", "href": "ex:09-machine-learning-operations/code-pipeline", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://aws.amazon.com/documentation-overview/codeguru/", "href": "https://aws.amazon.com/documentation-overview/codeguru/"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html"}]
```
