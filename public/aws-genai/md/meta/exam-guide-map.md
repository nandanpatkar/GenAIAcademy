```figure
domain-weights
```

> **Verified against the official exam guide on 2026-10-23.**
> Source: <https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html>
> Domain pages: [Domain 1](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01-domain1.html) ·
> [Domain 2](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01-domain2.html) ·
> [Domain 3](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01-domain3.html) ·
> [Domain 4](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01-domain4.html) ·
> [Domain 5](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01-domain5.html)
>
> The guide itself says it "does not provide a comprehensive list of the content on the exam". Treat this map as the *minimum*, not the maximum.

## 1. Exam facts (from the official guide)

| Item | Value |
|---|---|
| Scored questions | 65 |
| Unscored (pilot) questions | 10 (not identified on the exam) |
| Question types | Multiple choice (1 correct of 4) and multiple response (2+ correct of 5+). You must pick **all** correct answers for credit. |
| Wrong/blank answers | Blank = incorrect. **No penalty for guessing.** |
| Scoring | Scaled 100–1,000. **Passing score: 750.** |
| Scoring model | Compensatory: you do *not* have to pass each domain, only the whole exam. |
| Target candidate | 2+ years building production apps on AWS (or open source), AI/ML or data-engineering background, 1+ year hands-on GenAI. |
| Out of scope for the candidate | Model development/training, advanced ML techniques, data & feature engineering. |

**What "out of scope: model training" means for you:** you must know *how to deploy and manage* customized models (SageMaker endpoints, Model Registry, LoRA adapters) but you will not be asked to design a training algorithm.

## 2. Domains and weights

| # | Domain | Weight | Approx. scored questions* |
|---|---|---|---|
| 1 | Foundation Model Integration, Data Management, and Compliance | 31% | ~20 |
| 2 | Implementation and Integration | 26% | ~17 |
| 3 | AI Safety, Security, and Governance | 20% | ~13 |
| 4 | Operational Efficiency and Optimization for GenAI Applications | 12% | ~8 |
| 5 | Testing, Validation, and Troubleshooting | 11% | ~7 |

\*Approximation = weight × 65, rounded. AWS does not promise exact counts.

## 3. Task → skill → where it is taught in this repo

Legend: ✅ file written · 🟡 planned (see README for order) .
Module folders are relative to the repo root. Skill text is **paraphrased** from the official guide; open the domain page for exact wording.

### Domain 1 — Foundation Model Integration, Data Management, and Compliance (31%)

| Task | Skill (short) | Services named in the guide | Taught in |
|---|---|---|---|
| **1.1** Analyze requirements and design GenAI solutions | 1.1.1 architecture aligned to business + technical constraints | Bedrock, integration patterns | 10-architecture-capstone 🟡 |
| | 1.1.2 proof-of-concept to validate feasibility | Bedrock | 01 Bedrock overview ✅ |
| | 1.1.3 standardized components | Well-Architected Framework, WA Tool **Generative AI Lens** | 01 (lesson 36) 🟡 |
| **1.2** Select and configure FMs | 1.2.1 assess/choose FMs (benchmarks, limitations) | Bedrock | 01 Bedrock overview ✅, 04 model selection 🟡 |
| | 1.2.2 dynamic model selection / provider switching without code changes | Lambda, API Gateway, **AppConfig** | [06/03](aip:06-app-building-tools/03-appconfig-and-dynamic-foundation-model-selection) ✅ (with [06/01](aip:06-app-building-tools/01-lambda-integration-patterns-and-lambda-with-bedrock), [06/02](aip:06-app-building-tools/02-api-gateway-and-genai-applications)) |
| | 1.2.3 resilient AI: circuit breaker, **Cross-Region Inference**, graceful degradation | Step Functions, Bedrock CRIS | [04/04](aip:04-operational-efficiency/04-backoff-connection-pooling-and-cross-region-inference) ✅, [06/04](aip:06-app-building-tools/04-step-functions-states-circuit-breaker-and-prompt-chaining) ✅ |
| | 1.2.4 customization deployment & lifecycle (LoRA, adapters, Model Registry, rollback) | SageMaker AI, Model Registry | 05 SageMaker ✅ ([05/01](aip:05-sagemaker/01-sagemaker-ai-deployment-guardrails-and-fm-optimization), [05/03](aip:05-sagemaker/03-model-registry-and-lineage-tracking)) |
| **1.3** Data validation & processing pipelines for FM consumption | 1.3.1 data validation workflows | Glue Data Quality, Data Wrangler, Lambda, CloudWatch | 02/03 ✅ |
| | 1.3.2 text/image/audio/tabular processing | Bedrock multimodal, SageMaker Processing, Transcribe | 02/01, 02/04 ✅ |
| | 1.3.3 format input per model requirements | Bedrock JSON requests, conversation formatting | 01 Bedrock overview ✅ |
| | 1.3.4 enhance input data quality | Bedrock, Comprehend, Lambda | 02/04 ✅ |
| **1.4** Vector store solutions | 1.4.1 advanced vector architectures | KB, **OpenSearch + Neural plugin**, RDS + S3, DynamoDB | 00 embeddings ✅, 02/05–02/08 ✅ |
| | 1.4.2 metadata frameworks | S3 metadata, tags | 02/06, 02/07 ✅ |
| | 1.4.3 high-performance vector DB (sharding, multi-index, hierarchical) | OpenSearch | 02/05 ✅ |
| | 1.4.4 integration components (document mgmt, wikis) | various | 01/04 connectors ✅ |
| | 1.4.5 data maintenance (incremental updates, change detection, sync) | various | 02/06 ✅ |
| **1.5** Retrieval mechanisms | 1.5.1 chunking | Bedrock chunking, Lambda | 01 chunking 🟡 |
| | 1.5.2 embedding selection | Titan embeddings | 00 embeddings ✅ |
| | 1.5.3 vector search deployment | OpenSearch, Aurora **pgvector**, KB | 02/05, 02/07 ✅ |
| | 1.5.4 hybrid search + **reranker** | OpenSearch, Bedrock reranker | 02/05 ✅ |
| | 1.5.5 query handling (expansion, decomposition) | Bedrock, Lambda, Step Functions | 01 RAG ✅ |
| | 1.5.6 consistent access (function calling, **MCP** clients) | MCP | [03/06](aip:03-agentic-ai/06-mcp-openapi-tools-and-human-in-the-loop) ✅ |
| **1.6** Prompt engineering & governance | 1.6.1–1.6.6 | **Prompt Management**, **Guardrails**, **Prompt Flows**, CloudTrail, CloudWatch Logs, DynamoDB, Comprehend | 01 prompts 🟡 |

### Domain 2 — Implementation and Integration (26%)

| Task | Skills (short) | Taught in |
|---|---|---|
| **2.1** Agentic AI & tool integrations | 2.1.1 memory/state, **Strands Agents**, **Agent Squad**, MCP · 2.1.2 ReAct / CoT with Step Functions · 2.1.3 safeguards (stop conditions, timeouts, IAM boundaries, circuit breakers) · 2.1.4 model coordination/ensembles · 2.1.5 human-in-the-loop · 2.1.6 tool integrations · 2.1.7 MCP servers on Lambda/ECS | [03/01](aip:03-agentic-ai/01-llm-agents-and-bedrock-agents-classic) · [03/02](aip:03-agentic-ai/02-multi-agent-workflows-and-agent-memory) · [03/03](aip:03-agentic-ai/03-strands-agents-and-agent-squad) · [03/04](aip:03-agentic-ai/04-agentcore-runtime-memory-gateway-identity-policy-evaluations) · [03/06](aip:03-agentic-ai/06-mcp-openapi-tools-and-human-in-the-loop) ✅ (2.1.7: official Lambda/ECS MCP hosting guidance not found, see 03/06 §5.3) |
| **2.2** Model deployment strategies | 2.2.1 Lambda on-demand / **Provisioned Throughput** / SageMaker endpoints · 2.2.2 LLM-specific deployment (memory, GPU, token capacity) · 2.2.3 smaller models, model cascading | 05-sagemaker ✅ ([05/01](aip:05-sagemaker/01-sagemaker-ai-deployment-guardrails-and-fm-optimization)), 04 ✅ |
| **2.3** Enterprise integration | 2.3.1 legacy/event-driven · 2.3.2 API Gateway/Lambda/EventBridge · 2.3.3 federation, RBAC, least privilege · 2.3.4 **Outposts**, **Wavelength**, secure routing · 2.3.5 CI/CD + **GenAI gateway** | 06 ✅ ([06/01](aip:06-app-building-tools/01-lambda-integration-patterns-and-lambda-with-bedrock) Lambda, [06/02](aip:06-app-building-tools/02-api-gateway-and-genai-applications) API Gateway, [06/05](aip:06-app-building-tools/05-codepipeline-codebuild-and-codedeploy) CI/CD, [06/07](aip:06-app-building-tools/07-outposts-and-wavelength-for-genai) Outposts/Wavelength, [06/08](aip:06-app-building-tools/08-sqs-eventbridge-sns-and-appflow) SQS/EventBridge/SNS); 2.3.3 federation/RBAC in 08 🟡 |
| **2.4** FM API integrations | 2.4.1 sync + async (SQS) + API Gateway validation · 2.4.2 **streaming** (WebSockets, SSE) · 2.4.3 resilience (backoff, rate limiting, fallback, X-Ray) · 2.4.4 model routing | 01 Converse ✅, 04 ✅, 06 ✅ ([06/02](aip:06-app-building-tools/02-api-gateway-and-genai-applications) streaming and validation, [06/06](aip:06-app-building-tools/06-mlflow-appsync-and-amplify) AppSync subscriptions, [06/08](aip:06-app-building-tools/08-sqs-eventbridge-sns-and-appflow) SQS) |
| **2.5** Application patterns & dev tools | 2.5.1 API Gateway streaming/token limits · 2.5.2 **Amplify**, OpenAPI, Prompt Flows · 2.5.3 **Bedrock Data Automation**, Step Functions · 2.5.4 **Amazon Q Developer** · 2.5.5 Strands/Agent Squad · 2.5.6 CloudWatch Logs Insights, X-Ray | 06 ✅ ([06/02](aip:06-app-building-tools/02-api-gateway-and-genai-applications) API Gateway limits, [06/04](aip:06-app-building-tools/04-step-functions-states-circuit-breaker-and-prompt-chaining) Step Functions, [06/06](aip:06-app-building-tools/06-mlflow-appsync-and-amplify) Amplify; 2.5.4 Amazon Q Developer and 2.5.6 Logs Insights/X-Ray still pending), 02/01 ✅, 2.5.2 OpenAPI + 2.5.5 Strands/Agent Squad in [03](aip:03-agentic-ai/03-strands-agents-and-agent-squad) ✅ |

### Domain 3 — AI Safety, Security, and Governance (20%)

| Task | Skills (short) | Taught in |
|---|---|---|
| **3.1** Input/output safety controls | 3.1.1 input safety · 3.1.2 output safety · 3.1.3 hallucination reduction (KB grounding, JSON Schema) · 3.1.4 defense-in-depth · 3.1.5 prompt-injection/jailbreak detection | 01 Guardrails 🟡 |
| **3.2** Data security & privacy | 3.2.1 VPC endpoints, IAM, **Lake Formation** · 3.2.2 PII detection (**Comprehend, Macie**), S3 Lifecycle retention · 3.2.3 masking/anonymization | Lake Formation ✅ [07/05](aip:07-governance-qa/05-lake-formation-and-mixed-review-for-quiz-7); IAM [08/01](aip:08-security/01-least-privilege-iam-identity-center-and-data-masking), KMS/Macie/Secrets Manager [08/03](aip:08-security/03-kms-secrets-manager-macie-and-bedrock-data-protection), VPC endpoints [08/05](aip:08-security/05-vpc-privatelink-and-network-security) ✅ |
| **3.3** Governance & compliance | 3.3.1 model cards, Glue lineage · 3.3.2 data source tracking, CloudTrail · 3.3.3 org governance · 3.3.4 continuous monitoring, token-level redaction | 07 ✅ ([07/04](aip:07-governance-qa/04-cloudtrail-and-x-ray-for-genai) CloudTrail, [07/03](aip:07-governance-qa/03-cloudwatch-logs-alarms-rum-and-genai-observability) log masking, [07/05](aip:07-governance-qa/05-lake-formation-and-mixed-review-for-quiz-7) Lake Formation); org governance [08/02](aip:08-security/02-control-tower-organizations-and-governance-guardrails) ✅; model cards in [05/03](aip:05-sagemaker/03-model-registry-and-lineage-tracking) |
| **3.4** Responsible AI | 3.4.1 transparency (agent tracing) · 3.4.2 fairness, LLM-as-a-judge · 3.4.3 policy-compliant systems | 07 ✅ ([07/01](aip:07-governance-qa/01-agent-tracing-evaluation-metrics-and-bedrock-model-evaluations), [07/02](aip:07-governance-qa/02-principles-of-responsible-ai-and-fairness-evaluation)) |

### Domain 4 — Operational Efficiency and Optimization (12%)

| Task | Skills (short) | Taught in |
|---|---|---|
| **4.1** Cost optimization | 4.1.1 token efficiency · 4.1.2 cost-effective model selection · 4.1.3 throughput/utilization · 4.1.4 caching (semantic, prompt, edge) | 04-operational-efficiency ✅ ([04/01](aip:04-operational-efficiency/01-token-efficiency-and-cost-effective-model-selection), [04/02](aip:04-operational-efficiency/02-throughput-utilization-and-intelligent-caching)) |
| **4.2** Performance | 4.2.1 latency/cost trade-offs · 4.2.2 retrieval performance · 4.2.3 throughput · 4.2.4 temperature/top-k/top-p, A/B tests · 4.2.5 resource allocation · 4.2.6 profiling | 04 ✅ ([04/03](aip:04-operational-efficiency/03-responsive-systems-retrieval-and-fm-performance), [04/04](aip:04-operational-efficiency/04-backoff-connection-pooling-and-cross-region-inference), [04/02](aip:04-operational-efficiency/02-throughput-utilization-and-intelligent-caching)) |
| **4.3** Monitoring | 4.3.1–4.3.6 observability, invocation logs, tool metrics, vector store ops, golden datasets | 07 ✅ ([07/03](aip:07-governance-qa/03-cloudwatch-logs-alarms-rum-and-genai-observability) §5.7, [07/04](aip:07-governance-qa/04-cloudtrail-and-x-ray-for-genai), [07/01](aip:07-governance-qa/01-agent-tracing-evaluation-metrics-and-bedrock-model-evaluations)); vector-store metric names ❌ |

### Domain 5 — Testing, Validation, and Troubleshooting (11%)

| Task | Skills (short) | Taught in |
|---|---|---|
| **5.1** Evaluation systems | 5.1.1–5.1.9 metrics, Bedrock Model Evaluations, A/B & canary, LLM-as-a-judge, RAG eval, agent eval, reporting, deployment validation | 07 ✅ ([07/01](aip:07-governance-qa/01-agent-tracing-evaluation-metrics-and-bedrock-model-evaluations); canary/A/B also [06/03](aip:06-app-building-tools/03-appconfig-and-dynamic-foundation-model-selection), [06/05](aip:06-app-building-tools/05-codepipeline-codebuild-and-codedeploy)) |
| **5.2** Troubleshooting | 5.2.1 context-window overflow · 5.2.2 API integration issues · 5.2.3 prompt problems · 5.2.4 retrieval problems · 5.2.5 prompt maintenance | 01 ✅ (partial), 07 ✅ (logs, traces and metrics for troubleshooting: [07/03](aip:07-governance-qa/03-cloudwatch-logs-alarms-rum-and-genai-observability), [07/04](aip:07-governance-qa/04-cloudtrail-and-x-ray-for-genai)) |

## 4. Exam-only service scope

The guide's in-scope and out-of-scope lists are reproduced in [service-scope.md](aip:meta/service-scope).
Two surprises worth knowing now:

1. **Amazon Kendra, Augmented AI, SageMaker Ground Truth, Model Monitor and Clarify are still *listed as in scope*** even though AWS has put them into maintenance mode (Kendra) or closed them to new customers (A2I, Clarify and others). See [verification-log.md](aip:meta/verification-log) §2, §3 and §25 and [09/05](aip:09-other-services/05-ml-services-augmented-ai-kendra-lex-rekognition-and-textract).
2. **AWS Direct Connect, AWS VPN, AWS Transit Gateway, Amazon Redshift, AWS Budgets and AWS Trusted Advisor are *out of scope*** even though the video course teaches VPC connectivity (lesson 232). Learn the concepts, but do not over-invest.

## 5. Not verified / limits of this map

- Skill wording is paraphrased; use the official page for exact text.
- Question counts per domain are arithmetic estimates.
- AWS can change the guide. Re-check the guide's page before booking.
