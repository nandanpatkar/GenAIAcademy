## When To Use

- Use schema checks, completeness checks, uniqueness checks, referential checks, and range checks before model training.
- Use Glue Data Quality for rules and scores.
- Use DataBrew for visual profiling and cleanup.

## Core Concepts

- Validation catches invalid, missing, duplicated, out-of-range, and inconsistent data.
- Quality rules should align with feature contracts and model assumptions.
- Quality results can trigger quarantine, alerts, or retraining workflows.

## AWS Services And Features

- AWS Glue Data Quality
- AWS Glue DataBrew
- Amazon EventBridge
- Amazon CloudWatch

## Implementation Patterns

- Raw dataset -> profiling -> ruleset -> fail/quarantine bad records -> only validated data enters training.

## Tradeoffs And Pitfalls

- Passing schema validation does not guarantee useful features.
- Rules should be versioned with the pipeline.
- Bad validation thresholds can block valid data or permit silent drift.

## Decision Triggers

- DQDL and ruleset point to Glue Data Quality.
- Visual profiling/no-code cleanup points to DataBrew.
- Data integrity before modeling points to Domain 1.

## Related Notes

```ex-cards
[{"title": "AWS Glue Data Quality", "href": "ex:03-data-transformation-integrity-and-feature-engineering/glue-data-quality", "body": ""}, {"title": "AWS Glue DataBrew", "href": "ex:02-data-ingestion-and-storage/glue-databrew", "body": ""}, {"title": "Feature Engineering", "href": "ex:03-data-transformation-integrity-and-feature-engineering/feature-engineering", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/glue/latest/dg/glue-data-quality.html", "href": "https://docs.aws.amazon.com/glue/latest/dg/glue-data-quality.html"}, {"title": "https://docs.aws.amazon.com/databrew/latest/dg/what-is.html", "href": "https://docs.aws.amazon.com/databrew/latest/dg/what-is.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain1.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain1.html"}]
```
