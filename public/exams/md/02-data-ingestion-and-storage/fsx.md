## When To Use

- Use FSx for Lustre for high-throughput, low-latency file access during training.
- Use when training jobs need POSIX file semantics and fast reads over large datasets.
- Use S3 data repository integration to present S3 objects as files.

## Core Concepts

- FSx for Lustre is fully managed and POSIX-compliant.
- Designed for ML, HPC, video processing, and other speed-sensitive workloads.
- Can link to S3 repositories and write results back to S3.

## AWS Services And Features

- Amazon FSx for Lustre
- Amazon S3
- Amazon EC2
- Amazon ECS
- Amazon EKS
- Amazon SageMaker AI

## Implementation Patterns

- S3 training dataset -> FSx for Lustre linked file system -> SageMaker/EC2 training -> output back to S3.

## Tradeoffs And Pitfalls

- FSx is not object storage; S3 remains the durable data lake default.
- Scratch vs persistent deployment choices affect durability and cost.
- Choose storage class based on throughput/latency/cost needs.

## Decision Triggers

- High-performance POSIX training file system points to FSx for Lustre.
- Durable object data lake points to S3.

## Related Notes

```ex-cards
[{"title": "S3", "href": "ex:02-data-ingestion-and-storage/s3", "body": ""}, {"title": "Amazon Elastic File System (EFS)", "href": "ex:02-data-ingestion-and-storage/elastic-file-system", "body": ""}, {"title": "SageMaker Input Modes", "href": "ex:05-sagemaker-ai/sagemaker-input-modes", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/fsx/latest/LustreGuide/what-is.html", "href": "https://docs.aws.amazon.com/fsx/latest/LustreGuide/what-is.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain1.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain1.html"}]
```
