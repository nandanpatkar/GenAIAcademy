## When To Use

- Use for dashboards, reports, and interactive analysis over analytics datasets.
- Use when non-ML users need visual access to ML or operational insights.
- Use SPICE or direct query choices based on freshness and latency needs.

## Core Concepts

- Amazon Quick Sight is now documented under Amazon Quick/Quick Suite.
- Connects to data sources and supports analyses, dashboards, and reports.
- Can integrate with Amazon Q for generative BI scenarios.

## AWS Services And Features

- Amazon Quick Sight
- Amazon Quick Suite
- Amazon Q Business
- Athena
- Redshift
- S3

## Implementation Patterns

- Curated S3/Athena/Redshift data -> Quick Sight dataset -> analysis -> dashboard/report.
- Model monitoring export -> analytics table -> Quick Sight operational dashboard.

## Tradeoffs And Pitfalls

- Quick Sight is not a data validation or ML training service.
- Dashboard sharing needs user/group governance.
- Know the current Quick Suite naming but expect exam wording may still say QuickSight.

## Decision Triggers

- Dashboards and BI visualizations point to Quick Sight.
- Natural-language BI inside dashboards points to Quick Sight with Amazon Q.

## Related Notes

```ex-cards
[{"title": "Amazon Athena", "href": "ex:03-data-transformation-integrity-and-feature-engineering/athena", "body": ""}, {"title": "Amazon Redshift, Redshift ML, Redshift Serverless, and Redshift Data API", "href": "ex:02-data-ingestion-and-storage/redshift", "body": ""}, {"title": "AWS Cost Management For ML", "href": "ex:09-machine-learning-operations/aws-cost-management-for-ml", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/quick/latest/userguide/quick-bi.html", "href": "https://docs.aws.amazon.com/quick/latest/userguide/quick-bi.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html"}]
```
