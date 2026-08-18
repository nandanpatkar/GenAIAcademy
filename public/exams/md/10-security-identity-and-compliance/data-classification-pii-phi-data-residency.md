## When To Use

- Use Macie for sensitive data discovery in S3.
- Use Comprehend Medical for PHI extraction from clinical text.
- Use regional controls, encryption, IAM, and VPC endpoints for residency and privacy requirements.

## Core Concepts

- PII identifies individuals; PHI is health information protected by healthcare privacy rules.
- Data classification drives masking, encryption, retention, access, and residency controls.
- Residency requires keeping data in allowed Regions and controlling cross-region replication/processing.

## AWS Services And Features

- Amazon Macie
- Amazon Comprehend Medical
- AWS HealthLake
- AWS KMS
- IAM
- Amazon VPC

## Implementation Patterns

- S3 data lake -> Macie discovery -> classify sensitive objects -> restrict IAM/KMS and mask/quarantine before training.
- Clinical text -> Comprehend Medical PHI detection -> human review/masking -> governed data store.

## Tradeoffs And Pitfalls

- Do not move training data across Regions if residency restrictions prohibit it.
- Encryption alone does not solve access governance.
- De-identification and human review may be required before model training.

## Decision Triggers

- PII in S3 points to Macie.
- PHI in clinical text points to Comprehend Medical.
- Regional compliance and private access point to KMS/IAM/VPC endpoint controls.

## Related Notes

```ex-cards
[{"title": "🔍 Amazon Macie", "href": "ex:10-security-identity-and-compliance/macie", "body": ""}, {"title": "Amazon Comprehend Medical", "href": "ex:01-ai-services/comprehend-medical", "body": ""}, {"title": "AWS HealthLake", "href": "ex:01-ai-services/healthlake", "body": ""}, {"title": "Private ML Networking", "href": "ex:10-security-identity-and-compliance/private-ml-networking", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html", "href": "https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html"}, {"title": "https://docs.aws.amazon.com/comprehend-medical/latest/dev/comprehendmedical-welcome.html", "href": "https://docs.aws.amazon.com/comprehend-medical/latest/dev/comprehendmedical-welcome.html"}, {"title": "https://docs.aws.amazon.com/healthlake/latest/devguide/what-is.html", "href": "https://docs.aws.amazon.com/healthlake/latest/devguide/what-is.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain1.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain1.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html"}]
```
