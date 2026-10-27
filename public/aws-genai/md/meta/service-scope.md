> **Verified 2026-10-23** from the official lists:
> [In-scope](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/aip-01-in-scope-services.html) ·
> [Out-of-scope](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/aip-01-out-of-scope-services.html).
> AWS states both lists are "non-exhaustive and subject to change".

## In scope (study these)

| Category | Services |
|---|---|
| Analytics | Athena · EMR · Glue · Kinesis · OpenSearch Service · Quick Sight · MSK |
| Application Integration | AppFlow · AppConfig · EventBridge · SNS · SQS · Step Functions |
| Compute | App Runner · EC2 · Lambda · Lambda@Edge · Outposts · Wavelength |
| Containers | ECR · ECS · EKS · Fargate |
| Customer Engagement | Amazon Connect |
| Database | Aurora · DocumentDB · DynamoDB · DynamoDB Streams · ElastiCache · Neptune · RDS |
| Developer Tools | Amplify · CDK · CLI · CloudFormation · CodeArtifact · CodeBuild · CodeDeploy · CodePipeline · **Kiro** · AWS Tools & SDKs · X-Ray |
| Machine Learning | Augmented AI · **Bedrock** · **Bedrock AgentCore** · **Bedrock Knowledge Bases** · **Bedrock Prompt Management** · **Bedrock Prompt Flows** · Comprehend · Kendra · Lex · Q Business · Q Business Apps · Q Developer · **Amazon Quick** · Rekognition · **SageMaker AI** · SageMaker Clarify · Data Wrangler · Ground Truth · JumpStart · Model Monitor · Model Registry · Neo · Processing · Unified Studio · Textract · Titan · Transcribe |
| Management & Governance | Auto Scaling · Chatbot · CloudTrail · CloudWatch · CloudWatch Logs · CloudWatch Synthetics · Cost Anomaly Detection · Cost Explorer · Managed Grafana · Service Catalog · Systems Manager · Well-Architected Tool |
| Migration & Transfer | DataSync · Transfer Family |
| Networking & Content Delivery | API Gateway · AppSync · CloudFront · ELB · Global Accelerator · PrivateLink · Route 53 · VPC |
| Security, Identity, Compliance | Cognito · **AWS Encryption SDK** · IAM · **IAM Access Analyzer** · IAM Identity Center · KMS · Macie · Secrets Manager · WAF |
| Storage | EBS · EFS · S3 · S3 Intelligent-Tiering · S3 Lifecycle policies · S3 Cross-Region Replication |

### Things the course does not (or barely) teach but the list names
Bold or notable gaps versus the Udemy outline: **Kiro**, **AWS Encryption SDK**, **IAM Access Analyzer**, **CloudWatch Synthetics**, **AWS Service Catalog**, **AWS Chatbot**, **AWS App Runner**, **Lambda@Edge**, **ECR/Fargate**, **DynamoDB Streams**, **Amazon Q Business**. These are **not** syllabus lessons and are still not covered in `09-other-services` (module 09 follows lessons 235–298 only); add short notes later if wanted. Lambda@Edge is mentioned in [09/08](aip:09-other-services/08-networking-and-delivery-cloudfront-elb-global-accelerator-and-route-53) as a CloudFront trigger only.

## Out of scope (do not spend time on)

| Category | Services |
|---|---|
| Application Integration | Amazon MQ |
| Analytics | Clean Rooms · Data Exchange · DataZone · FinSpace |
| Cloud Financial Management | **AWS Budgets** · Cost and Usage Report · RI reports · Savings Plans |
| Compute | Batch · EC2 Image Builder · ECS Anywhere · EKS Anywhere · Elastic Beanstalk · Lightsail · Local Zones · Serverless Application Repository |
| Database | Keyspaces · QLDB · **Redshift** · Timestream |
| Developer Tools | Cloud9 · CloudShell · CodeGuru · CodeStar · Corretto |
| Networking | App Mesh · Cloud Map · **Direct Connect** · Private 5G · **Transit Gateway** · **VPN** |
| Management & Governance | Console Mobile · Health Dashboard · License Manager · Proton · **Trusted Advisor** |
| Machine Learning | DeepComposer · DeepRacer · DevOps Guru · Forecast · Fraud Detector · HealthLake · Lookout (Equipment/Metrics/Vision) · Monitron · Panorama |
| Other | Blockchain, Business apps, End-user computing, Game dev, IoT (all), Media services (all), Quantum, Robotics, Satellite, Snow Family, Migration Hub, SES, Pinpoint, Location Service |

The lists above are grouped abbreviations; open the official page for the full item-by-item list.

## How to use this file
- Anything **in scope** gets at least a one-page "what/why/when" note.
- **Out-of-scope** services may still appear *as distractors* in answer options (for example "use AWS Direct Connect"). Know the one-line purpose so you can eliminate them confidently.
