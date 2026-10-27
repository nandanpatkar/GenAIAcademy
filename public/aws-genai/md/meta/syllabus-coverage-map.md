**Source:** `AWS SYLLABUS.txt` (Udemy course *AWS Certified Generative AI Developer – Professional*, Frank Kane; 25 h; "last updated October 2026" per the course page).

> **Note on the source file.** On 2026-10-23 the file on disk read as **0 bytes** (likely an unsynced OneDrive placeholder). This map was built from the full 1,342-line text selected in the editor, which contains lessons 1–312, 17 quizzes and 2 practice tests. **Re-diffed on 2026-10-26 after the file synced (21,397 bytes, 1,341 lines):** all lessons 1–312 are present in the file and every one of them is covered by a row in this map, with no extra rows; 17 quizzes are listed (Quiz 7–17 are still to come).

## How to read this map

- **Type**: `T` technical · `L` hands-on lab/demo · `A` administrative (no technical content) · `Q` quiz/test · `B` bonus (course says not on exam).
- **Target file**: where the content lives. Status: ✅ written · 🟡 planned.
- Lesson numbers match the syllabus exactly. Titles are paraphrased only where marked.
- **Nothing is omitted.** Administrative lessons are listed so coverage can be audited.

Completion statuses ("Completed / Not completed") in the syllabus describe *your Udemy progress*, not content; they are ignored here.

---

## Section 0 — Course start (lessons 1–6)

| # | Title | Type | Target |
|---|---|---|---|
| 1 | Optimizing Your Learning Environment with Udemy | A | – |
| 2 | Course Overview | A | README |
| 3 | Get the Course Materials | A | – |
| 4 | Heads up! Choose the correct signup experience in AWS | A/T | ✅ [00-foundations/01](aip:00-foundations/01-aws-account-iam-and-cli-setup) |
| 5 | Setting Up an AWS Billing Alarm | L | ✅ 00-foundations/01 |
| 6 | Section Intro | A | – |

## Section 1 — Bedrock and GenAI Fundamentals (lessons 7–36 + Quiz 1)

| # | Title | Type | Target |
|---|---|---|---|
| 7 | Amazon Bedrock Overview | T | ✅ [01/01 Bedrock overview & Converse](aip:01-bedrock-genai-fundamentals/01-bedrock-overview-and-converse-api) |
| *(note)* | Files marked ✅ above were written under the topic template, including a Practice-questions section. | | |
| 8 | A quick note on model access | T | ✅ 01/01 (verified, see [verification-log](aip:meta/verification-log) §4) |
| 9 | Hands-On with the Bedrock Playground (practice lab) | L | ✅ 01/01 |
| 10 | More Depth on the Bedrock Converse API | T | ✅ 01/01 |
| 11 | Fine-Tuning Foundation Models in Bedrock | T | ✅ [01/02 customization](aip:01-bedrock-genai-fundamentals/02-model-customization-finetuning-and-lora) |
| 12 | Low-Rank Adaptation (LoRA) – How Fine-Tuning Works | T | ✅ 01/02 |
| 13 | Retrieval-Augmented Generation (RAG) | T | ✅ [01/03 RAG](aip:01-bedrock-genai-fundamentals/03-retrieval-augmented-generation-rag) |
| 14 | Vector Stores and Semantic Search | T | ✅ [00-foundations/03](aip:00-foundations/03-embeddings-vectors-semantic-search) + 01/03 (store choices deepen in 02-data-management) |
| 15 | Bedrock Knowledge Bases | T | ✅ [01/04 Knowledge Bases](aip:01-bedrock-genai-fundamentals/04-bedrock-knowledge-bases) |
| 16 | Hands-On with Knowledge Bases (practice lab) | L | ✅ 01/04 (managed-KB lab) |
| 17 | Really, don't leave OpenSearch up and running for long! | A/T (cost warning) | ✅ 01/04 §5.8 |
| 18 | Pre-Retrieval and Chunking Strategies | T | ✅ [01/05](aip:01-bedrock-genai-fundamentals/05-chunking-embeddings-reranking-and-rag-evaluation) |
| 19 | Managing Chunking Strategies with Bedrock | T | ✅ 01/05 |
| 20 | Optimizing your Vector Store and Embeddings | T | ✅ 01/05 (embedding/vector-type choices); index tuning (OpenSearch/HNSW) continues in 02-data-management 🟡 |
| 21 | Evaluating RAG Performance | T | ✅ 01/05 §5.6 (Bedrock RAG evaluation); LLM-as-judge depth continues in 07-governance-qa 🟡 |
| 22 | Multimodal Models and Pipelines with Bedrock | T | ✅ [01/06](aip:01-bedrock-genai-fundamentals/06-multimodal-models-and-pipelines) |
| 23 | Bedrock Guardrails | T | ✅ [01/07](aip:01-bedrock-genai-fundamentals/07-bedrock-guardrails) |
| 24 | Bedrock Guardrails Automated Reasoning Checks | T | ✅ 01/07 §5.7 |
| 25 | Hands-On with Bedrock Guardrails (practice lab) | L | ✅ 01/07 §8 |
| 26 | Token-Level Redaction | T | ✅ 01/07 §5.8 (no built-in feature of that name found; see verification log §14) |
| 27 | Amazon Bedrock Prompt Management | T | ✅ [01/08](aip:01-bedrock-genai-fundamentals/08-prompt-management-flows-and-structured-output) |
| 28 | Bedrock Prompt Flows | T | ✅ 01/08 §5.2 |
| 29 | Enforcing Use of Structured Data | T | ✅ 01/08 §5.3 (Bedrock structured outputs / JSON Schema) |
| 30 | Intro to Prompt Engineering | T | ✅ [01/09](aip:01-bedrock-genai-fundamentals/09-prompt-engineering-misuse-and-bias) |
| 31 | Anatomy of a Prompt | T | ✅ 01/09 §5.1 |
| 32 | Prompt Best Practices | T | ✅ 01/09 §5.3 |
| 33 | Types of Prompts | T | ✅ 01/09 §5.2 |
| 34 | Prompt Misuse and Mitigating Bias | T | ✅ 01/09 §5.4–5.5 |
| 35 | Enterprise Integration | T | ✅ [01/10](aip:01-bedrock-genai-fundamentals/10-enterprise-integration-and-generative-ai-lens) (built from exam Task 2.3; lesson content not available) |
| 36 | AWS Well-Architected Tool Generative AI Lens | T | ✅ 01/10 §5.8 |
| Quiz 1 | Bedrock and GenAI Fundamentals | Q | ✅ covered by the Practice-questions sections of 01/01–01/10 (original questions) |

## Section 2 — Managing Data for GenAI (lessons 37–96 + Quiz 2)

| # | Title | Type | Target |
|---|---|---|---|
| 37 | Section Intro | A | – |
| 38 | Dealing with Structured Data | T | ✅ [02/01](aip:02-data-management/01-structured-data-and-bedrock-data-automation) (lesson content not available; built from exam skills + AWS pages) |
| 39 | Amazon Bedrock Data Automation | T | ✅ 02/01 |
| 40 | SageMaker Data Wrangler | T | ✅ [02/02](aip:02-data-management/02-sagemaker-data-wrangler-and-data-preparation) |
| 41 | NOTICE: Data Wrangler can be hard to find | A | ✅ 02/02 (it moved into SageMaker Canvas) |
| 42 | Demo: SageMaker Studio, Canvas, and Data Wrangler | L | ✅ 02/02 (offline cleaning lab + optional Canvas steps, not run) |
| 43–45 | AWS Glue · Glue Studio · Glue Data Quality | T | ✅ [02/03](aip:02-data-management/03-aws-glue-data-quality-and-cloudwatch-metrics) |
| 46 | CloudWatch Metrics | T | ✅ 02/03 (+07 observability 🟡 for alarms/logs) |
| 47–48 | AWS Transcribe (+ hands on) | T/L | ✅ [02/04](aip:02-data-management/04-transcribe-comprehend-and-comprehend-medical) (offline post-processing lab; live steps not run) |
| 49–52 | Comprehend · hands on · with Lambda & Bedrock · Comprehend Medical | T/L | ✅ 02/04 |
| 53–59 | Intro to OpenSearch in GenAI · OpenSearch Service pt 1 & 2 · Index Management & Stability · Performance · Serverless · Vector store tuning | T | ✅ [02/05](aip:02-data-management/05-amazon-opensearch-for-genai) |
| 60–61 | Amazon S3 Vectors (+ hands on) | T/L | ✅ [02/06](aip:02-data-management/06-s3-vectors-and-keeping-vector-stores-current) |
| 62 | Note on the following supplemental video | A | – |
| 63 | S3 Vectors with Claude Code and Agent Toolkit for AWS **[BONUS – NOT ON EXAM]** | B | ✅ 02/06 §5.6 (not described: no official AWS page found) |
| 64–66 | RDS · hands on · RDS with S3 document repositories | T/L | ✅ [02/07](aip:02-data-management/07-rds-aurora-and-pgvector) |
| 67–69 | Aurora · hands on · Aurora + pgvector | T/L | ✅ 02/07 |
| 70–79 | DynamoDB: intro · hands on · WCU/RCU (+hands on) · basic APIs (+hands on) · DAX (+hands on) · TTL · DynamoDB and GenAI | T/L | ✅ [02/08](aip:02-data-management/08-amazon-dynamodb-for-genai) |
| 80 | Keeping your Vector Store Up to Date | T | ✅ 02/06 §5.4 |
| 81 | Re-Ranker Modules in Bedrock | T | ✅ covered in [01/05 §5.5](aip:01-bedrock-genai-fundamentals/05-chunking-embeddings-reranking-and-rag-evaluation) |
| 82–85 | S3 Storage Classes (+hands on) · Lifecycle Rules (+hands on) | T/L | ✅ [02/09](aip:02-data-management/09-amazon-s3-storage-lifecycle-replication-and-security) |
| 86 | A note about S3 regional namespaces | A/T | ✅ 02/09 §5.3 (account regional namespace) |
| 87–89 | S3 Replication · notes · hands on | T/L | ✅ 02/09 §5.4 |
| 90–93 | S3 Encryption · About DSSE-KMS · hands on · Default Encryption | T/L | ✅ 02/09 §5.5 |
| 94–96 | S3 Access Logs (+hands on) · Access Points | T/L | ✅ 02/09 §5.6–5.7 |
| Quiz 2 | Managing Data for Generative AI | Q | ✅ covered by the Practice-questions sections of 02/01–02/09 (original questions) |

## Section 3 — Agentic AI (lessons 97–125 + Quiz 3)

| # | Title | Type | Target |
|---|---|---|---|
| 97 | Section Intro | A | – |
| 98 | NOTE: Amazon is deprecating Bedrock Agents | A/T | ✅ [verification-log §1](aip:meta/verification-log) |
| 99–101 | LLM Agents in Bedrock · Hands On: Agents Classic · WARNING: delete OpenSearch Serverless | T/L | ✅ [03/01](aip:03-agentic-ai/01-llm-agents-and-bedrock-agents-classic) (offline loop lab; AWS console steps not run) |
| 102–103 | Multi-Agent Workflows · Short and Long-Term Agent Memory | T | ✅ [03/02](aip:03-agentic-ai/02-multi-agent-workflows-and-agent-memory) |
| 104–105 | Strands Agents · Agent Squad | T | ✅ [03/03](aip:03-agentic-ai/03-strands-agents-and-agent-squad) |
| 106–110 | AgentCore: Introduction · Memory and Tools · Import/Gateway/Identity · Policies · Evaluators | T | ✅ [03/04](aip:03-agentic-ai/04-agentcore-runtime-memory-gateway-identity-policy-evaluations) (CLI import syntax ❌ unverified) |
| 111 | Note on the following lab for EU users | A | ✅ [03/05](aip:03-agentic-ai/05-labs-strands-agentcore-agent-squad-and-harness) §5.4 (lesson text not available; reconstructed from the Region table) |
| 112–113 | Labs: Strands + AgentCore + Agent Squad · AgentCore Harnesses | L | ✅ 03/05 (AWS steps from official Get-started pages, not run) |
| 114–116 | MCP · OpenAPI and Tool Usage · Humans in the Loop | T | ✅ [03/06](aip:03-agentic-ai/06-mcp-openapi-tools-and-human-in-the-loop) |
| 117–118 | Amazon Q Apps (+hands on) | T/L | ✅ [03/07](aip:03-agentic-ai/07-amazon-q-apps-and-amazon-quick) (official Q Apps docs page not fetched; 🟡) |
| 119–125 | Amazon Quick: intro · Chat and Agents · Grounding · Flows and Automate · Research and Apps · Security/Pricing/Limits · Hands-On | T/L | ✅ 03/07 |
| Quiz 3 | Agentic AI | Q | ✅ covered by the Practice-questions sections of 03/01–03/07 (original) plus the mixed review in 03/07 §7c |

## Section 4 — Operational Efficiency (lessons 126–136 + Quiz 4)

| # | Title | Type | Target |
|---|---|---|---|
| 126 | Section Intro | A | – (summarised in 04/01 §1) |
| 127 | Token Efficiency | T | ✅ [04/01](aip:04-operational-efficiency/01-token-efficiency-and-cost-effective-model-selection) |
| 128 | Cost-Effective Model Selection | T | ✅ 04/01 |
| 129 | Maximizing Resource Utilization and Throughput | T | ✅ [04/02](aip:04-operational-efficiency/02-throughput-utilization-and-intelligent-caching) |
| 130 | Intelligent Caching Systems for GenAI | T | ✅ 04/02 |
| 131 | Building Responsive AI Systems | T | ✅ [04/03](aip:04-operational-efficiency/03-responsive-systems-retrieval-and-fm-performance) |
| 132 | Optimizing Retrieval Performance | T | ✅ 04/03 |
| 133 | Optimizing for Specific Use Cases | T | ✅ 04/03 |
| 134 | Optimizing Foundation Model System Performance | T | ✅ 04/03 |
| 135 | Exponential Backoff and Connection Pooling | T | ✅ [04/04](aip:04-operational-efficiency/04-backoff-connection-pooling-and-cross-region-inference) |
| 136 | Amazon Bedrock Cross-Region Inference | T | ✅ 04/04 |
| Quiz 4 | Operational Efficiency and Optimization | Q | ✅ covered by the Practice-questions sections of 04/01–04/04 (original) plus the mixed review in 04/04 §7c |

## Section 5 — SageMaker AI (lessons 137–151 + Quiz 5)

| # | Title | Type | Target |
|---|---|---|---|
| 137 | Section Intro | A | – (summarised in 05/01 §1) |
| 138–141 | Intro to SageMaker AI · Data Processing/Training/Deployment · Deployment Safeguards · Optimizing FM Deployments | T | ✅ [05/01](aip:05-sagemaker/01-sagemaker-ai-deployment-guardrails-and-fm-optimization) (training-job specifics ❌ not read) |
| 142 | NOTE: Amazon is deprecating SageMaker Ground Truth, Model Monitor, and Clarify | A/T | ✅ [verification-log §3](aip:meta/verification-log) |
| 143–144 | Ground Truth · Model Monitor and Clarify | T | ✅ [05/02](aip:05-sagemaker/02-ground-truth-model-monitor-and-clarify) |
| 145–147 | Model Registry · Lineage Tracking · Cross-Account Lineage | T | ✅ [05/03](aip:05-sagemaker/03-model-registry-and-lineage-tracking) |
| 148–150 | Neo (edge) · Unified Studio · Pipelines | T | ✅ [05/04](aip:05-sagemaker/04-neo-unified-studio-pipelines-and-jumpstart) |
| 151 | Hands On: SageMaker JumpStart | L | ✅ 05/04 (console steps; JumpStart overview page unread, 🟡) |
| Quiz 5 | Managing Models with SageMaker AI | Q | ✅ covered by the Practice-questions sections of 05/01–05/04 (original) plus the mixed review in 05/04 §7c |

## Section 6 — More Tools for Building AI Applications (lessons 152–187 + Quiz 6)

| # | Title | Type | Target |
|---|---|---|---|
| 152 | Section Intro | A | – (summarised in 06/01 §1) |
| 153–156 | Lambda · Integration Patterns pt 1 & 2 · Lambda with Bedrock | T | ✅ [06/01](aip:06-app-building-tools/01-lambda-integration-patterns-and-lambda-with-bedrock) (the course's two "integration patterns" lessons are covered as sync / async / event-source-mapping styles, with the SQS/SNS/EventBridge patterns in 06/08) |
| 157–159 | API Gateway · hands-on lab · API Gateway & GenAI apps | T/L | ✅ [06/02](aip:06-app-building-tools/02-api-gateway-and-genai-applications) (streaming transfer-mode field names ❌) |
| 160–161 | AppConfig · Dynamic FM Selection with AppConfig | T | ✅ [06/03](aip:06-app-building-tools/03-appconfig-and-dynamic-foundation-model-selection) (profile/validator and quota pages ❌) |
| 162–165 | Step Functions · States · Circuit Breaker & AI integration · Lab: Prompt chaining | T/L | ✅ [06/04](aip:06-app-building-tools/04-step-functions-states-circuit-breaker-and-prompt-chaining) |
| 166–168 | CodePipeline (+prereqs, hands on) | T/L | ✅ [06/05](aip:06-app-building-tools/05-codepipeline-codebuild-and-codedeploy) |
| 169–171 | CodeBuild (+hands on 1 & 2) | T/L | ✅ 06/05 |
| 172–173 | CodeDeploy (+hands on) | T/L | ✅ 06/05 |
| 174 | MLflow for LLM Experimentation | T | ✅ [06/06](aip:06-app-building-tools/06-mlflow-appsync-and-amplify) |
| 175 | AWS AppSync and GenAI | T | ✅ 06/06 |
| 176–179 | Outposts · Outposts & GenAI · Wavelength · Wavelength & GenAI | T | ✅ [06/07](aip:06-app-building-tools/07-outposts-and-wavelength-for-genai) (no official Bedrock-at-the-edge page found ❌) |
| 180–181 | SQS (+hands on) | T/L | ✅ [06/08](aip:06-app-building-tools/08-sqs-eventbridge-sns-and-appflow) |
| 182 | Amplify | T | ✅ 06/06 |
| 183–184 | EventBridge (+hands on) | T/L | ✅ 06/08 |
| 185–186 | SNS (+hands on) | T/L | ✅ 06/08 |
| 187 | AppFlow | T | ✅ 06/08 |
| Quiz 6 | More Tools for Building AI Applications | Q | ✅ covered by the Practice-questions sections of 06/01–06/08 (original) plus the mixed review in 06/08 §7c |

## Section 7 — Governance and QA (lessons 188–207 + Quiz 7)

| # | Title | Type | Target |
|---|---|---|---|
| 188 | Section Intro | A | – |
| 189 | Bedrock Agent Tracing | T | ✅ [07/01](aip:07-governance-qa/01-agent-tracing-evaluation-metrics-and-bedrock-model-evaluations) |
| 190–193 | Evaluation Techniques · ROUGE/BLEU/BERTScore · Bedrock Model Evaluations · Deployment Validation | T | ✅ 07/01 (ROUGE/BLEU definitions 🟡: standard, papers not fetched; evaluation IAM and nested job fields ❌) |
| 194 | Principles of Responsible AI | T | ✅ [07/02](aip:07-governance-qa/02-principles-of-responsible-ai-and-fairness-evaluation) |
| 195–200 | CloudWatch Logs (+hands on) · Alarms (+hands on) · RUM · CloudWatch & GenAI | T/L | ✅ [07/03](aip:07-governance-qa/03-cloudwatch-logs-alarms-rum-and-genai-observability) (vector-store metric names, prices ❌) |
| 201–204 | CloudTrail · hands on · CloudTrail & GenAI · Clarification on CloudTrail + Bedrock | T/L/A | ✅ [07/04](aip:07-governance-qa/04-cloudtrail-and-x-ray-for-genai) |
| 205–206 | X-Ray (+hands on) | T/L | ✅ 07/04 (sampling-rule matching ❌) |
| 207 | Lake Formation | T | ✅ [07/05](aip:07-governance-qa/05-lake-formation-and-mixed-review-for-quiz-7) (LF-Tag multi-key expression semantics ❌) |
| Quiz 7 | Governance and QA | Q | ✅ covered by the Practice-questions sections of 07/01–07/05 (original) plus the mixed review in 07/05 §7c |

## Section 8 — Security, Identity, Compliance (lessons 208–234 + Quiz 8)

| # | Title | Type | Target |
|---|---|---|---|
| 208 | Section Intro | A | – |
| 209–210 | Least Privilege · Data Masking and Key Salting | T | ✅ [08/01](aip:08-security/01-least-privilege-iam-identity-center-and-data-masking) (lesson-210 course text unavailable; techniques 🟡) |
| 211–220 | IAM: users/groups/policies (+hands on) · console sign-in · policies (+hands on) · MFA (+hands on) · roles (+hands on) · Identity Center | T/L | ✅ 08/01 (basics also in 00-foundations/01; console multi-session 🟡) |
| 221 | Control Tower | T | ✅ [08/02](aip:08-security/02-control-tower-organizations-and-governance-guardrails) (control mechanisms 🟡) |
| 222–224 | Encryption 101 · KMS · KMS hands on | T/L | ✅ [08/03](aip:08-security/03-kms-secrets-manager-macie-and-bedrock-data-protection) (grants, quotas ❌) |
| 225 | Macie | T | ✅ 08/03 |
| 226–227 | Secrets Manager (+hands on lab) | T/L | ✅ 08/03 (version labels 🟡) |
| 228 | Cognito | T | ✅ [08/04](aip:08-security/04-cognito-and-aws-waf) (token claims 🟡) |
| 229 | WAF | T | ✅ 08/04 (rule actions, managed groups ❌) |
| 230–233 | VPC subnets/IGW/NAT · NACL/SG/Flow Logs · Peering/Endpoints/VPN/Direct Connect · Cheat sheet | T | ✅ [08/05](aip:08-security/05-vpc-privatelink-and-network-security) |
| 234 | PrivateLink | T | ✅ 08/05 |
| Quiz 8 | Security, Identity, and Compliance | Q | ✅ covered by the Practice-questions sections of 08/01–08/05 (original) plus the mixed review in 08/05 §7c |

## Section 9 — Other services you should know (lessons 235–298 + Quizzes 9–17)

| # | Title | Type | Target |
|---|---|---|---|
| 235 | Intro: Other Services You Should Know | A | ✅ 09/01 (module opener; each file covers its group) |
| 236–241 | Analytics: Athena · EMR · Quicksight · Kinesis Data Streams (+lab) · MSK | T/L | ✅ [09/01](aip:09-other-services/01-analytics-athena-emr-quick-sight-kinesis-and-msk) + Quiz 9 §7c |
| 242–249 | Compute/containers: EC2 (+lab) · ECS (+cluster, service) · EKS (+hands on) · Lex + Connect | T/L | ✅ [09/02](aip:09-other-services/02-compute-containers-ec2-ecs-eks-lex-and-connect) + Quiz 10 §7c |
| 250–255 | Databases: DocumentDB · ElastiCache (+lab) · Valkey/MemoryDB · Neptune · Neptune Analytics & vector search | T/L | ✅ [09/03](aip:09-other-services/03-databases-documentdb-elasticache-memorydb-and-neptune) + Quiz 11 §7c |
| 256–266 | Developer tools: CDK (+hands on) · Access keys/CLI/SDK · CLI setup Win/Mac/Linux · CLI hands on · CloudFormation (+lab) · CodeArtifact (+hands on) | T/L | ✅ [09/04](aip:09-other-services/04-developer-tools-cdk-cli-sdk-cloudformation-and-codeartifact) (CLI setup also in 00-foundations/01) + Quiz 12 §7c |
| 267 | NOTE: Amazon is deprecating Augmented AI and Kendra | A/T | ✅ [verification-log §2](aip:meta/verification-log) and §25; A2I now ✅ official notice |
| 268–276 | ML services: Augmented AI (+hands on) · Kendra · Lex (+hands on) · Rekognition (+hands on) · Textract (+hands on) | T/L | ✅ [09/05](aip:09-other-services/05-ml-services-augmented-ai-kendra-lex-rekognition-and-textract) + Quiz 13 §7c |
| 277–284 | Mgmt: Auto Scaling (+hands on) · Cost Anomaly Detection · Cost Explorer · Managed Grafana · Systems Manager (+Session Manager, Parameter Store) | T/L | ✅ [09/06](aip:09-other-services/06-management-and-governance-auto-scaling-cost-tools-grafana-and-systems-manager) + Quiz 14 §7c |
| 285–286 | DataSync · Transfer Family | T | ✅ [09/07](aip:09-other-services/07-migration-and-transfer-datasync-and-transfer-family) + Quiz 15 §7c |
| 287–293 | CloudFront (+hands on) · ELB (+hands on) · Global Accelerator (+hands on) · Route 53 | T/L | ✅ [09/08](aip:09-other-services/08-networking-and-delivery-cloudfront-elb-global-accelerator-and-route-53) + Quiz 16 §7c |
| 294–298 | EBS (+hands on) · EFS (+hands on) · EFS vs EBS | T/L | ✅ [09/09](aip:09-other-services/09-storage-ebs-efs-and-choosing-between-them) + Quiz 17 §7c |
| Quizzes 9–17 | Analytics · Compute/Container/CS · Database · Developer Tools · ML · Mgmt & Governance · Migration · Networking · Storage | Q | 🟡 |

## Section 10 — Architecture capstone (lessons 299–302)

| # | Title | Type | Target |
|---|---|---|---|
| 299 | A Complete GenAI User-Facing System | T | 🟡 10/01 |
| 300 | Choosing a Vector Store | T | 🟡 10/02 |
| 301 | Orchestration: When to Use Step Functions | T | 🟡 10/03 |
| 302 | Simplified Internal and User-Facing Architectures | T | 🟡 10/04 |

## Section 11 — Practice and exam preparation (lessons 303–312)

| Item | Title | Type | Target |
|---|---|---|---|
| Practice Test 1 | Full Practice Exam #1 (75 questions per course page) | Q | 🟡 11 (original practice questions will be written; the course's questions are not reproduced) |
| Practice Test 2 | Full Practice Exam #2 | Q | 🟡 |
| 303 | Check out the AWS Skill Builder practice exam too | A | ✅ [11-exam-prep note, planned] |
| 304 | Intro: Getting Ready for the Exam | A | 🟡 11/01 |
| 305 | More Preparation Resources and the Exam Guide | T/A | ✅ [exam-guide-map](aip:meta/exam-guide-map) |
| 306 | Additional Prep from the Community | A | 🟡 11/01 |
| 307 | Test-Taking Tips | A | 🟡 11/02 |
| 308 | Exam Walkthrough and Signup | A | 🟡 11/01 |
| 309 | Save 50% on your AWS Exam Cost! | A | 🟡 11/01 (verify offer before repeating) |
| 310 | Get an Extra 30 Minutes … Non Native English Speakers | A | 🟡 11/01 (verify before repeating) |
| 311 | Congratulations! | A | – |
| 312 | Bonus Lecture | A | – |

---

## Coverage audit

| Check | Result |
|---|---|
| Lessons 1–312 all listed | Yes. Ranges were grouped, never skipped. |
| Quizzes (17) | Listed per section. |
| Course topics **not** on the official in-scope list | Direct Connect, VPN (inside lesson 232), Quicksight depth, EMR depth, Valkey/MemoryDB. Kept as lower-priority notes. |
| Official in-scope services **not** in the course | Kiro, AWS Encryption SDK, IAM Access Analyzer, CloudWatch Synthetics, Service Catalog, AWS Chatbot, App Runner, Lambda@Edge, ECR/Fargate, DynamoDB Streams, Q Business. Added to 09-other-services plan. |
| Bonus lesson 63 | Marked "not on exam" by the course. Kept as an appendix. |
