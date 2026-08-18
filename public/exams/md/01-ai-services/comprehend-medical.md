## When To Use

- Use for medical entity extraction, PHI detection, and ontology linking from clinical text.
- Use when healthcare text is in English and needs healthcare-specific NLP.
- Use human review for clinical decision support scenarios.

## Core Concepts

- Detects medical entities, relationships, traits, and PHI.
- Can link entities to standardized knowledge bases such as RxNorm and ICD-10-CM.
- Provides confidence scores that must be thresholded for the use case.

## AWS Services And Features

- Amazon Comprehend Medical
- Amazon S3
- AWS Lambda
- AWS KMS

## Implementation Patterns

- Clinical notes in S3 -> Comprehend Medical batch analysis -> structured entities -> downstream review/analytics.
- API call from Lambda for real-time extraction in an application workflow.

## Tradeoffs And Pitfalls

- Not a substitute for professional medical advice.
- Only supports medical entity detection in US English text.
- PHI workflows need encryption, IAM, audit, and human review.

## Decision Triggers

- Medical text, PHI, RxNorm, ICD-10-CM, and clinical entity extraction point to Comprehend Medical.
- General sentiment/key phrases/language detection points to Amazon Comprehend.

## Related Notes

```ex-cards
[{"title": "Amazon Comprehend", "href": "ex:01-ai-services/comprehend", "body": ""}, {"title": "AWS HealthLake", "href": "ex:01-ai-services/healthlake", "body": ""}, {"title": "Data Classification, PII, PHI, And Data Residency", "href": "ex:10-security-identity-and-compliance/data-classification-pii-phi-data-residency", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/comprehend-medical/latest/dev/comprehendmedical-welcome.html", "href": "https://docs.aws.amazon.com/comprehend-medical/latest/dev/comprehendmedical-welcome.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/mla-01-in-scope-services.html"}]
```
