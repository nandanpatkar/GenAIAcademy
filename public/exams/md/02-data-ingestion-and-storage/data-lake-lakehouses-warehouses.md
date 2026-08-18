## When To Use

- Use S3-based data lakes for flexible, durable raw/curated data storage.
- Use Lake Formation for governance over data lake permissions.
- Use Athena for serverless SQL over S3 and Redshift for managed warehouse workloads.
- Use Apache Iceberg/Hudi/Delta-style table formats for lakehouse-style transactional tables where supported.

## Core Concepts

- Data lakes store raw/curated data, often in S3.
- Warehouses optimize structured analytics.
- Lakehouses add table/transaction/governance features over lake storage.
- Glue Elastic Views should not be treated as current exam material; use Glue, Lake Formation, Athena, Redshift, and table formats instead.

## AWS Services And Features

- Amazon S3
- AWS Glue
- AWS Lake Formation
- Amazon Athena
- Amazon Redshift

## Implementation Patterns

- Raw zone -> curated zone -> catalog with Glue -> governed access with Lake Formation -> Athena/Redshift/SageMaker consumption.

## Tradeoffs And Pitfalls

- Data lake flexibility can lead to schema/governance sprawl without catalog and quality controls.
- Warehouse performance comes with modeling and cost tradeoffs.
- Do not rely on stale Glue Elastic Views references.

## Decision Triggers

- S3 data lake and governance point to S3 + Glue Catalog + Lake Formation.
- Warehouse analytics at scale points to Redshift.
- Serverless query over S3 points to Athena.

## Related Notes

```ex-cards
[{"title": "S3", "href": "ex:02-data-ingestion-and-storage/s3", "body": ""}, {"title": "Glue", "href": "ex:03-data-transformation-integrity-and-feature-engineering/glue", "body": ""}, {"title": "Lake Formation", "href": "ex:09-machine-learning-operations/lake-formation", "body": ""}, {"title": "Amazon Athena", "href": "ex:03-data-transformation-integrity-and-feature-engineering/athena", "body": ""}, {"title": "Amazon Redshift, Redshift ML, Redshift Serverless, and Redshift Data API", "href": "ex:02-data-ingestion-and-storage/redshift", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html", "href": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html"}, {"title": "https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html", "href": "https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html"}, {"title": "https://docs.aws.amazon.com/athena/latest/ug/what-is.html", "href": "https://docs.aws.amazon.com/athena/latest/ug/what-is.html"}, {"title": "https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html", "href": "https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain1.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain1.html"}]
```
