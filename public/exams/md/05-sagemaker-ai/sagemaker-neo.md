## When To Use

- Use Neo when optimizing trained models for supported target hardware/runtime environments.
- Use for model compilation/optimization context before deployment to target devices or instances.
- Use Edge Manager only as historical/EOL context.

## Core Concepts

- Neo optimizes model artifacts for target deployment environments.
- SageMaker Edge Manager was no longer accessible after April 26, 2024.
- For edge deployment context, consider ONNX/runtime-specific optimization and AWS IoT Greengrass V2, noting Greengrass is out-of-scope for MLA-C01.

## AWS Services And Features

- SageMaker Neo
- Amazon SageMaker AI
- ONNX
- AWS IoT Greengrass V2 (out-of-scope edge context)

## Implementation Patterns

- Train model -> Neo compile/optimize for target -> deploy to target runtime.

## Tradeoffs And Pitfalls

- Do not describe Edge Manager as an active service.
- Edge deployment detail is supplemental for MLA-C01 unless tied to deployment optimization.
- Validate model framework/operator support before relying on compilation.

## Decision Triggers

- Compile model for target hardware points to Neo.
- Edge Manager wording points to EOL caveat.

## Related Notes

```ex-cards
[{"title": "SageMaker On The Edge", "href": "ex:09-machine-learning-operations/sagemaker-on-the-edge", "body": ""}, {"title": "Deployment Mode Decision Guide", "href": "ex:09-machine-learning-operations/deployment-mode-decision-guide", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/neo.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/neo.html"}, {"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/edge-eol.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/edge-eol.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain3.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain3.html"}]
```
