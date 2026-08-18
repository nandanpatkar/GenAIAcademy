## When To Use

- Use this note only when reviewing edge deployment tradeoffs.
- For current MLA-C01 focus, connect edge optimization back to SageMaker Neo/model optimization and deployment constraints.

## Core Concepts

- SageMaker Edge Manager is EOL and no longer accessible.
- AWS IoT Greengrass V2 can be a replacement context for edge application management but is out-of-scope for MLA-C01.
- ONNX and runtime-specific optimization matter for edge portability.

## AWS Services And Features

- SageMaker Neo
- AWS IoT Greengrass V2
- ONNX

## Implementation Patterns

- Historical Edge Manager flow -> replace with device/runtime-specific deployment pattern and Greengrass V2 where appropriate.

## Tradeoffs And Pitfalls

- Do not spend primary exam time on Greengrass.
- Do not describe Edge Manager as active.
- Edge constraints include memory, CPU/GPU, connectivity, update, and security model.

## Decision Triggers

- Edge Manager term should trigger EOL caveat.
- Greengrass term should trigger out-of-scope caveat.

## Related Notes

```ex-cards
[{"title": "SageMaker Neo", "href": "ex:05-sagemaker-ai/sagemaker-neo", "body": ""}, {"title": "AWS IoT Greengrass", "href": "ex:09-machine-learning-operations/greengrass", "body": ""}, {"title": "MLA-C01 Out-Of-Scope Services", "href": "ex:00-exam-guide/out-of-scope-services", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/edge-eol.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/edge-eol.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-out-of-scope-services.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-out-of-scope-services.html"}]
```
