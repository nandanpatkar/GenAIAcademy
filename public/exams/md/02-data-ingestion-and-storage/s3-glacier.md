## When To Use

- Use S3 Glacier Instant Retrieval, Flexible Retrieval, or Deep Archive for low-cost archival storage.
- Use lifecycle policies to move old data to colder storage.
- Use when access latency requirements tolerate archival retrieval behavior.

## Core Concepts

- S3 Glacier storage classes are part of Amazon S3.
- Standalone Amazon Glacier vault service no longer accepts new customers.
- Lifecycle rules automate transitions between S3 storage classes.

## AWS Services And Features

- Amazon S3
- Amazon S3 Glacier Instant Retrieval
- Amazon S3 Glacier Flexible Retrieval
- Amazon S3 Glacier Deep Archive

## Implementation Patterns

- Raw training data in S3 Standard -> lifecycle transition to S3 Glacier after retention window.
- Compliance/archive dataset -> Deep Archive with retrieval planning.

## Tradeoffs And Pitfalls

- Do not confuse current S3 Glacier storage classes with standalone Amazon Glacier vault APIs.
- Retrieval time and retrieval cost matter.
- Archived data is usually not suitable for immediate training without restoration.

## Decision Triggers

- Low-cost long-term archive points to S3 Glacier storage classes.
- Fast active training data points to S3 Standard/EFS/FSx depending on access pattern.

## Related Notes

```ex-cards
[{"title": "S3", "href": "ex:02-data-ingestion-and-storage/s3", "body": ""}, {"title": "AWS Storage Gateway", "href": "ex:02-data-ingestion-and-storage/storage-gateway", "body": ""}, {"title": "Amazon FSx", "href": "ex:02-data-ingestion-and-storage/fsx", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/amazonglacier/latest/dev/introduction.html", "href": "https://docs.aws.amazon.com/amazonglacier/latest/dev/introduction.html"}, {"title": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html", "href": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain1.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain1.html"}]
```
