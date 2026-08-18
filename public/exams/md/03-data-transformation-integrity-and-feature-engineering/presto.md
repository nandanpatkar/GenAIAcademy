## Key Features

- **Distributed Architecture:**  
  Presto can scale out to hundreds of nodes, enabling high-performance querying on petabyte-scale data.
- **Separation of Storage and Compute:**  
  Presto queries data where it lives, without requiring data movement or duplication.
- **ANSI SQL Support:**  
  Provides full support for standard SQL, making it accessible to analysts and data scientists.
- **Connector Ecosystem:**  
  Integrates with a wide range of data sources, including S3, Hive, Cassandra, MySQL, PostgreSQL, and more.

## Relevance to Machine Learning

- **Data Exploration and Analysis:**  
  Presto is often used to quickly explore and aggregate large datasets before ML model training.
- **Feature Engineering:**  
  Enables complex SQL-based feature extraction and transformation at scale.
- **Integration with AWS:**  
  Available as Amazon Athena (a serverless Presto service) and as a supported engine on Amazon EMR, making it easy to use in AWS-based ML workflows.

## Typical Use Cases

- Interactive analytics on data lakes (e.g., querying S3 data with Athena).
- Ad hoc reporting and dashboarding.
- Preprocessing and aggregating data for ML pipelines.

**References:**  
- [Presto Documentation](https://prestodb.io/docs/current/)
- [Amazon Athena Documentation](https://docs.aws.amazon.com/athena/latest/ug/what-is.html)

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain1.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain1.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html"}]
```
