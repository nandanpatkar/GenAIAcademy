## When To Use

- Use warm pools to reduce repeated job startup overhead when repeated jobs can reuse infrastructure.
- Use managed spot training for interruption-tolerant jobs with checkpoints.
- Use distributed data parallelism for data-parallel multi-GPU/multi-node training.
- Use model parallelism for models too large for one accelerator.
- Use mixed precision when supported by framework/model/hardware.

## Core Concepts

- Training Compiler is legacy; do not pair it with SMDDP as a current best-practice path.
- Checkpointing is required for reliable spot-interruption recovery.
- Distributed training choice depends on data parallel vs model memory bottleneck.

## AWS Services And Features

- SageMaker Training
- SageMaker Distributed Data Parallel
- SageMaker Model Parallelism
- Managed Spot Training
- Warm Pools
- CheckpointConfig

## Implementation Patterns

- Large dataset -> distributed data parallel.
- Huge model cannot fit in memory -> model parallelism.
- Repeated experiments -> warm pool.
- Cost-sensitive interruption-tolerant job -> spot training with checkpoints.

## Tradeoffs And Pitfalls

- Spot training can take longer due to interruption.
- Warm pools continue billing during keep-alive.
- Distributed training adds communication overhead and configuration complexity.
- Training Compiler is legacy/no-new-release and should not be emphasized.

## Decision Triggers

- Cost savings plus interruptions points to managed spot training.
- Repeated startup overhead points to warm pools.
- Model too large for one GPU points to model parallelism.
- Training Compiler wording points to legacy caveat.

## Related Notes

```ex-cards
[{"title": "SageMaker Training Compiler", "href": "ex:05-sagemaker-ai/sagemaker-training-compiler", "body": ""}, {"title": "Distributed Training in SageMaker", "href": "ex:05-sagemaker-ai/sagemaker-model-parallelism", "body": ""}, {"title": "SageMaker Spot Training", "href": "ex:05-sagemaker-ai/sagemaker-spot-training", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel.html"}, {"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel.html"}, {"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/model-managed-spot-training.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/model-managed-spot-training.html"}, {"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/train-warm-pools.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/train-warm-pools.html"}, {"title": "https://docs.aws.amazon.com/sagemaker/latest/dg/training-compiler-enable.html", "href": "https://docs.aws.amazon.com/sagemaker/latest/dg/training-compiler-enable.html"}]
```
