## When To Use

- Use to define DQDL rules over Data Catalog tables or Glue ETL jobs.
- Use to catch bad records before loading a training or inference dataset.
- Use with EventBridge and CloudWatch for automated data quality response.

## Core Concepts

- DQDL defines data quality rules.
- Rulesets group rules and receive data quality scores.
- Data Catalog quality checks evaluate stored datasets; Glue ETL checks can identify failed records in pipelines.

## AWS Services And Features

- AWS Glue Data Quality
- AWS Glue Data Catalog
- AWS Glue ETL
- Amazon EventBridge
- Amazon CloudWatch

## Implementation Patterns

- Catalog table -> recommended or authored ruleset -> scheduled evaluation -> score/result in Glue.
- Glue ETL job -> DQDL transform -> route failed records to quarantine and publish metrics.

## Tradeoffs And Pitfalls

- Nested/list data types have support limitations.
- Catalog checks are useful for stewardship; ETL checks are better for pipeline enforcement.
- Rules should match the ML feature contract, not just table schema.

## Decision Triggers

- DQDL, data quality score, and rulesets point to Glue Data Quality.
- Bad records need quarantining before model training points to Glue ETL with Data Quality.
- Ongoing monitoring of data quality points to Domain 4.

## Related Notes

```ex-cards
[{"title": "Glue", "href": "ex:03-data-transformation-integrity-and-feature-engineering/glue", "body": ""}, {"title": "Data Quality Validation", "href": "ex:03-data-transformation-integrity-and-feature-engineering/data-quality-validation", "body": ""}, {"title": "Retraining Triggers And Drift Response", "href": "ex:09-machine-learning-operations/retraining-triggers-and-drift-response", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/glue/latest/dg/glue-data-quality.html", "href": "https://docs.aws.amazon.com/glue/latest/dg/glue-data-quality.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain1.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain1.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html"}]
```
