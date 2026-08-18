## When To Use

- Use for healthcare data stores that need FHIR R4 support.
- Use when clinical notes and structured healthcare data need secure search and analytics.
- Use with Lake Formation, Athena, IAM, CloudTrail, and PrivateLink for governed healthcare analytics.

## Core Concepts

- HIPAA eligible service for FHIR R4 health data.
- Supports import/export and FHIR APIs.
- Can transform unstructured medical data using integrated medical NLP into FHIR resources.

## AWS Services And Features

- AWS HealthLake
- Amazon S3
- Amazon Athena
- AWS Lake Formation
- AWS CloudTrail
- AWS PrivateLink

## Implementation Patterns

- FHIR data in S3 -> HealthLake import -> searchable FHIR data store -> Athena/Lake Formation analytics.
- Healthcare app -> FHIR API -> HealthLake with IAM and audit controls.

## Tradeoffs And Pitfalls

- Not a substitute for clinical judgment.
- Healthcare workflows require PHI/PII protection, encryption, access control, and audit.
- Know the difference between HealthLake data storage and Comprehend Medical text extraction.

## Decision Triggers

- FHIR R4, healthcare interoperability, and health data store point to HealthLake.
- Clinical text entity extraction points to Comprehend Medical.

## Related Notes

```ex-cards
[{"title": "Amazon Comprehend Medical", "href": "ex:01-ai-services/comprehend-medical", "body": ""}, {"title": "Data Classification, PII, PHI, And Data Residency", "href": "ex:10-security-identity-and-compliance/data-classification-pii-phi-data-residency", "body": ""}, {"title": "Lake Formation", "href": "ex:09-machine-learning-operations/lake-formation", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/healthlake/latest/devguide/what-is.html", "href": "https://docs.aws.amazon.com/healthlake/latest/devguide/what-is.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html"}]
```
