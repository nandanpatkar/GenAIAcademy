## When To Use

- Use when analysts need visual data preparation without writing Spark code.
- Use for profiling, cleaning, normalizing, and recipe-based transformations.
- Use before data lands in curated S3, Athena, Redshift, or SageMaker training datasets.

## Core Concepts

- Projects connect to datasets and show a grid-like preparation workspace.
- Recipes capture reusable transformation steps.
- Jobs apply recipes and usually write prepared output to Amazon S3.

## AWS Services And Features

- AWS Glue DataBrew
- Amazon S3
- AWS Glue Data Catalog

## Implementation Patterns

- Raw data in S3 -> DataBrew project -> recipe -> DataBrew job -> prepared S3 dataset.
- Use DataBrew for no-code exploratory cleanup; use Glue ETL when engineering-controlled Spark jobs are required.

## Tradeoffs And Pitfalls

- DataBrew is not a model-training service.
- Prefer Glue ETL or Glue Data Quality for automated production enforcement when code-first control is needed.
- Validate output schema before using the prepared dataset for training.

## Decision Triggers

- Visual/no-code data preparation points to DataBrew.
- Recipe-based transformations and profiling point to DataBrew.
- Code-first ETL or distributed Spark transformations point to AWS Glue ETL instead.

## Related Notes

```ex-cards
[{"title": "Glue", "href": "ex:03-data-transformation-integrity-and-feature-engineering/glue", "body": ""}, {"title": "AWS Glue Data Quality", "href": "ex:03-data-transformation-integrity-and-feature-engineering/glue-data-quality", "body": ""}, {"title": "Data Quality Validation", "href": "ex:03-data-transformation-integrity-and-feature-engineering/data-quality-validation", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/databrew/latest/dg/what-is.html", "href": "https://docs.aws.amazon.com/databrew/latest/dg/what-is.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain1.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain1.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html"}]
```
