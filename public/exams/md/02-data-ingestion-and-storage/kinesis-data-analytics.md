## When To Use

- Use this only to recognize old documentation or exam wording.
- Use Amazon Managed Service for Apache Flink for current service naming and implementation details.

## Core Concepts

- Amazon Kinesis Data Analytics was renamed to Amazon Managed Service for Apache Flink.
- Kinesis Data Analytics for SQL is in full shutdown as of January 27, 2026.
- Current stream processing study should use Managed Service for Apache Flink and Flink Studio naming.

## AWS Services And Features

- Amazon Managed Service for Apache Flink
- Managed Service for Apache Flink Studio

## Implementation Patterns

- Old reference -> map to current service name -> study [Amazon Managed Service For Apache Flink](ex:02-data-ingestion-and-storage/managed-service-for-apache-flink).

## Tradeoffs And Pitfalls

- Do not create new notes or diagrams that use Kinesis Data Analytics as the primary current name.
- Kinesis Data Analytics for SQL shutdown is distinct from current Managed Service for Apache Flink.

## Decision Triggers

- Kinesis Data Analytics wording points to Managed Service for Apache Flink.
- Kinesis Data Analytics for SQL points to shutdown/migration caveat.

## Related Notes

```ex-cards
[{"title": "Amazon Managed Service For Apache Flink", "href": "ex:02-data-ingestion-and-storage/managed-service-for-apache-flink", "body": ""}, {"title": "Kinesis Data Streams", "href": "ex:02-data-ingestion-and-storage/kinesis-data-streams", "body": ""}, {"title": "Kinesis Data Firehose", "href": "ex:02-data-ingestion-and-storage/kinesis-data-firehose", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://aws.amazon.com/about-aws/whats-new/2023/08/amazon-managed-service-apache-flink/", "href": "https://aws.amazon.com/about-aws/whats-new/2023/08/amazon-managed-service-apache-flink/"}, {"title": "https://docs.aws.amazon.com/managed-flink/latest/java/what-is.html", "href": "https://docs.aws.amazon.com/managed-flink/latest/java/what-is.html"}, {"title": "https://docs.aws.amazon.com/general/latest/gr/full_shutdown_services.html", "href": "https://docs.aws.amazon.com/general/latest/gr/full_shutdown_services.html"}]
```
