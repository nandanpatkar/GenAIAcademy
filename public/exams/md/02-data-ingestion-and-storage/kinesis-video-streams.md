## When To Use

- Use for live video ingestion from devices into AWS.
- Use when applications need real-time or batch-oriented video analytics.
- Use with Rekognition Video or custom ML processing when video frames need analysis.

## Core Concepts

- Fully managed service for live video streams.
- Stores and encrypts media data for configured retention.
- Supports real-time frame access and historical processing.

## AWS Services And Features

- Amazon Kinesis Video Streams
- Amazon Rekognition
- Amazon S3
- Amazon EC2

## Implementation Patterns

- Camera/device -> Kinesis Video Stream -> consumer application -> Rekognition/custom model -> alert or storage.

## Tradeoffs And Pitfalls

- Kinesis Video Streams is source-agnostic but application logic still owns downstream analytics.
- Do not confuse with Kinesis Data Streams for generic records.

## Decision Triggers

- Live video stream ingestion points to Kinesis Video Streams.
- Generic event stream processing points to Kinesis Data Streams or Flink.

## Related Notes

```ex-cards
[{"title": "Amazon Rekognition", "href": "ex:01-ai-services/rekognition", "body": ""}, {"title": "Kinesis Data Streams", "href": "ex:02-data-ingestion-and-storage/kinesis-data-streams", "body": ""}, {"title": "Amazon Managed Service For Apache Flink", "href": "ex:02-data-ingestion-and-storage/managed-service-for-apache-flink", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/what-is-kinesis-video.html", "href": "https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/what-is-kinesis-video.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html"}]
```
