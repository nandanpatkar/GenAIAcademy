// Auto-generated index of the AWS Certified Generative AI Developer –
// Professional (AIP-C01) study guide.
//
// 64 lessons in 10 modules plus the exam reference. Bodies live under
// public/aws-genai/md/ and are fetched on demand by AwsGenAi; code, artifacts and
// quizzes live under public/aws-genai/bundle/ and load when a reader opens a tab.
//
// Regenerate with `npm run build:aws-genai` rather than hand-editing.

export const AIP_CONTENT_BASE = "/aws-genai";

export const AIP_TOTAL_LESSONS = 64;

export const AIP_EXAM = {
 "code": "AIP-C01",
 "name": "AWS Certified Generative AI Developer – Professional",
 "scored": 65,
 "unscored": 10,
 "scaleMin": 100,
 "scaleMax": 1000,
 "passing": 750,
 "domains": [
  {
   "n": 1,
   "name": "Foundation Model Integration, Data Management, and Compliance",
   "short": "FM integration & data",
   "weight": 31
  },
  {
   "n": 2,
   "name": "Implementation and Integration",
   "short": "Implementation & integration",
   "weight": 26
  },
  {
   "n": 3,
   "name": "AI Safety, Security, and Governance",
   "short": "Safety, security & governance",
   "weight": 20
  },
  {
   "n": 4,
   "name": "Operational Efficiency and Optimization for GenAI Applications",
   "short": "Efficiency & optimization",
   "weight": 12
  },
  {
   "n": 5,
   "name": "Testing, Validation, and Troubleshooting",
   "short": "Testing & troubleshooting",
   "weight": 11
  }
 ]
};

export const AIP_TRACKS = [
 {
  "id": "guide",
  "label": "Study Guide",
  "blurb": "Ten modules mapped to the five exam domains. Every lesson ships an animated figure, lab code, an AI skill, a cheat sheet and exam-style questions."
 },
 {
  "id": "reference",
  "label": "Exam Reference",
  "blurb": "The verified exam guide map, in-scope services, the glossary and the log of where the course and today's AWS disagree."
 }
];

export const AIP_MODULES = [
 {
  "id": "00-foundations",
  "n": 0,
  "track": "guide",
  "title": "Foundations",
  "blurb": "A safe AWS account, how LLMs turn tokens into answers, and the embeddings behind semantic search.",
  "domains": [
   1,
   3,
   4,
   5
  ],
  "lessons": [
   {
    "slug": "00-foundations/01-aws-account-iam-and-cli-setup",
    "n": 1,
    "title": "AWS Account, IAM and CLI Setup (the safe way)",
    "blurb": "An AWS account is like a company bank account for cloud services: everything you create and every dollar you spend is attached to it.",
    "domains": [
     3
    ],
    "blueprint": "Prerequisite for everything. Touches Domain 3 (least privilege, skill 2.3.3 / 3.2.1)",
    "relevance": "Medium",
    "level": "Beginner",
    "syllabus": "4, 5, 6; CLI setup 258–262 ; IAM intro 209–219 is deepened later in 08-security",
    "prereqs": [],
    "verified": "2026-10-23",
    "minutes": 13,
    "figures": 2,
    "code": 7,
    "labs": 0,
    "artifacts": 2,
    "quiz": 8,
    "recall": 4,
    "cards": 3
   },
   {
    "slug": "00-foundations/02-llm-and-genai-basics",
    "n": 2,
    "title": "LLMs and GenAI Basics (tokens, context, randomness, hallucination)",
    "blurb": "A large language model (LLM) is a program trained on huge amounts of text to predict the next small piece of text, over and over, until it has written an answer.",
    "domains": [
     1,
     4,
     5
    ],
    "blueprint": "Foundation for Domain 1 (1.2, 1.3.3, 1.6), Domain 4 (4.1.1, 4.2.4), Domain 5 (5.2.1)",
    "relevance": "High",
    "level": "Beginner",
    "syllabus": "Prerequisite for 7–36 and 127–136",
    "prereqs": [
     {
      "label": "01 AWS account and CLI setup",
      "slug": "00-foundations/01-aws-account-iam-and-cli-setup"
     }
    ],
    "verified": "2026-10-23",
    "minutes": 11,
    "figures": 3,
    "code": 3,
    "labs": 2,
    "artifacts": 2,
    "quiz": 8,
    "recall": 4,
    "cards": 0
   },
   {
    "slug": "00-foundations/03-embeddings-vectors-semantic-search",
    "n": 3,
    "title": "Embeddings, Vectors and Semantic Search",
    "blurb": "Computers compare exact letters well but compare meaning badly: \"reset my password\" and \"I can't get into my account\" share almost no words.",
    "domains": [
     1
    ],
    "blueprint": "Domain 1 · Task 1.4 (1.4.1–1.4.3) and Task 1.5 (1.5.2, 1.5.3, 1.5.4)",
    "relevance": "High",
    "level": "Beginner → Intermediate",
    "syllabus": "14 and the concept base for 13, 15–21, 53–61, 67–69, 300",
    "prereqs": [
     {
      "label": "02 LLM basics",
      "slug": "00-foundations/02-llm-and-genai-basics"
     }
    ],
    "verified": "2026-10-23",
    "minutes": 15,
    "figures": 2,
    "code": 3,
    "labs": 0,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 3
   }
  ]
 },
 {
  "id": "01-bedrock-genai-fundamentals",
  "n": 1,
  "track": "guide",
  "title": "Bedrock & GenAI Fundamentals",
  "blurb": "Converse, customization, RAG and Knowledge Bases, chunking and reranking, multimodal, Guardrails and prompts.",
  "domains": [
   1,
   2,
   3,
   4,
   5
  ],
  "lessons": [
   {
    "slug": "01-bedrock-genai-fundamentals/01-bedrock-overview-and-converse-api",
    "n": 1,
    "title": "Amazon Bedrock Overview, Model Access and the Converse API",
    "blurb": "Amazon Bedrock is a service that lets you use many different AI models (text, image, embeddings) through one AWS API, without hosting any servers yourself.",
    "domains": [
     1,
     2,
     5
    ],
    "blueprint": "Domain 1 · Task 1.1 (1.1.2 PoC), 1.2 (1.2.1 choose FMs), 1.3.3 (format input per model) · Domain 2 · Task 2.4 (2.4.1 sync API use, 2.4.3 resilience) · Domain 5 · 5.2.2 (integration troubleshooting)",
    "relevance": "High",
    "level": "Beginner → Intermediate",
    "syllabus": "7, 8, 9, 10",
    "prereqs": [
     {
      "label": "00-foundations/01 setup",
      "slug": "00-foundations/01-aws-account-iam-and-cli-setup"
     },
     {
      "label": "02 LLM basics",
      "slug": "00-foundations/02-llm-and-genai-basics"
     }
    ],
    "verified": "2026-10-23",
    "minutes": 19,
    "figures": 2,
    "code": 9,
    "labs": 0,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 4
   },
   {
    "slug": "01-bedrock-genai-fundamentals/02-model-customization-finetuning-and-lora",
    "n": 2,
    "title": "Model Customization: Fine-Tuning, Distillation, Reinforcement Fine-Tuning and LoRA",
    "blurb": "A foundation model is already smart, but it is generic.",
    "domains": [
     1,
     2
    ],
    "blueprint": "Domain 1 · Task 1.2 (skill 1.2.4 customization deployment and lifecycle; also 1.2.1 choosing FMs) · Domain 2 · Task 2.2 (2.2.3 smaller models)",
    "relevance": "Medium–High",
    "level": "Intermediate",
    "syllabus": "11, 12 ; links to 141, 145",
    "prereqs": [
     {
      "label": "LLM basics",
      "slug": "00-foundations/02-llm-and-genai-basics"
     },
     {
      "label": "Bedrock overview",
      "slug": "01-bedrock-genai-fundamentals/01-bedrock-overview-and-converse-api"
     }
    ],
    "verified": "2026-10-23",
    "minutes": 18,
    "figures": 2,
    "code": 7,
    "labs": 0,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 3
   },
   {
    "slug": "01-bedrock-genai-fundamentals/03-retrieval-augmented-generation-rag",
    "n": 3,
    "title": "Retrieval-Augmented Generation (RAG)",
    "blurb": "A language model only knows what it learned during training and what you put in the prompt.",
    "domains": [
     1,
     3,
     5
    ],
    "blueprint": "Domain 1 · Tasks 1.4 and 1.5 (esp. 1.5.1, 1.5.4, 1.5.5) · Domain 3 · 3.1.3 (reduce hallucination) · Domain 5 · 5.1.5, 5.1.6, 5.2.4",
    "relevance": "High",
    "level": "Intermediate",
    "syllabus": "13, 14, 21",
    "prereqs": [
     {
      "label": "LLM basics",
      "slug": "00-foundations/02-llm-and-genai-basics"
     },
     {
      "label": "Embeddings and semantic search",
      "slug": "00-foundations/03-embeddings-vectors-semantic-search"
     }
    ],
    "verified": "2026-10-23",
    "minutes": 17,
    "figures": 2,
    "code": 3,
    "labs": 0,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 3
   },
   {
    "slug": "01-bedrock-genai-fundamentals/04-bedrock-knowledge-bases",
    "n": 4,
    "title": "Amazon Bedrock Knowledge Bases (Managed and Customer-Managed)",
    "blurb": "Building RAG by hand means writing code to read files, split them, call an embedding model, run a vector database, search it, and assemble prompts. Amazon Bedrock Knowledge Bases does this plumbing for you.",
    "domains": [
     1,
     3
    ],
    "blueprint": "Domain 1 · Task 1.4 (1.4.1, 1.4.2, 1.4.4, 1.4.5) and Task 1.5 (1.5.3, 1.5.4, 1.5.6) · Domain 3 · 3.1.3, 3.2.1",
    "relevance": "High",
    "level": "Intermediate",
    "syllabus": "15, 16, 17, partly 80",
    "prereqs": [
     {
      "label": "RAG",
      "slug": "01-bedrock-genai-fundamentals/03-retrieval-augmented-generation-rag"
     },
     {
      "label": "Embeddings",
      "slug": "00-foundations/03-embeddings-vectors-semantic-search"
     },
     {
      "label": "Bedrock overview",
      "slug": "01-bedrock-genai-fundamentals/01-bedrock-overview-and-converse-api"
     }
    ],
    "verified": "2026-10-23",
    "minutes": 21,
    "figures": 2,
    "code": 7,
    "labs": 0,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 4
   },
   {
    "slug": "01-bedrock-genai-fundamentals/05-chunking-embeddings-reranking-and-rag-evaluation",
    "n": 5,
    "title": "Chunking, Parsing, Embeddings, Reranking and Evaluating RAG",
    "blurb": "Most \"bad RAG answers\" are caused before the model ever writes a word: the documents were read badly, cut in the wrong places, or embedded in a way that makes the right passage hard to find.",
    "domains": [
     1,
     4,
     5
    ],
    "blueprint": "Domain 1 · Task 1.5 (1.5.1 chunking, 1.5.2 embeddings, 1.5.4 hybrid + reranker) · Domain 4 · 4.2.2 (retrieval performance) · Domain 5 · 5.1.5, 5.1.6 (retrieval quality), 5.2.4 (retrieval troubleshooting)",
    "relevance": "High",
    "level": "Intermediate → Advanced",
    "syllabus": "18, 19, 20, 21, 81",
    "prereqs": [
     {
      "label": "RAG",
      "slug": "01-bedrock-genai-fundamentals/03-retrieval-augmented-generation-rag"
     },
     {
      "label": "Knowledge Bases",
      "slug": "01-bedrock-genai-fundamentals/04-bedrock-knowledge-bases"
     },
     {
      "label": "Embeddings",
      "slug": "00-foundations/03-embeddings-vectors-semantic-search"
     }
    ],
    "verified": "2026-10-23",
    "minutes": 22,
    "figures": 2,
    "code": 4,
    "labs": 0,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 4
   },
   {
    "slug": "01-bedrock-genai-fundamentals/06-multimodal-models-and-pipelines",
    "n": 6,
    "title": "Multimodal Models and Pipelines with Amazon Bedrock",
    "blurb": "A multimodal model understands more than text: it can look at an image, read a PDF, or watch a video along with your question (\"What is the total on this invoice?\").",
    "domains": [
     1,
     2
    ],
    "blueprint": "Domain 1 · Task 1.3 (1.3.2 process text, image, audio and tabular data for FM consumption; 1.3.3 format input per model) · Domain 2 · 2.5.3 (Bedrock Data Automation)",
    "relevance": "Medium",
    "level": "Intermediate",
    "syllabus": "22 ; previews 39 and 47–48, which are deepened in 02-data-management",
    "prereqs": [
     {
      "label": "Bedrock overview and Converse",
      "slug": "01-bedrock-genai-fundamentals/01-bedrock-overview-and-converse-api"
     },
     {
      "label": "Embeddings",
      "slug": "00-foundations/03-embeddings-vectors-semantic-search"
     }
    ],
    "verified": "2026-10-23",
    "minutes": 15,
    "figures": 1,
    "code": 2,
    "labs": 0,
    "artifacts": 2,
    "quiz": 8,
    "recall": 4,
    "cards": 3
   },
   {
    "slug": "01-bedrock-genai-fundamentals/07-bedrock-guardrails",
    "n": 7,
    "title": "Amazon Bedrock Guardrails (including Automated Reasoning checks and redaction)",
    "blurb": "A foundation model will try to answer almost anything, including things your business must never say or do.",
    "domains": [
     1,
     3
    ],
    "blueprint": "Domain 3 · Task 3.1 (3.1.1 input safety, 3.1.2 output safety, 3.1.3 hallucination reduction, 3.1.4 defense in depth, 3.1.5 prompt-attack detection), Task 3.2 (3.2.2, 3.2.3 privacy), Task 3.3 (3.3.4 token-level redaction, response logging), Task 3.4 (3.4.3 policy-compliant systems) · Domain 1 · 1.6.1",
    "relevance": "High",
    "level": "Intermediate → Advanced",
    "syllabus": "23, 24, 25, 26",
    "prereqs": [
     {
      "label": "Bedrock overview and Converse",
      "slug": "01-bedrock-genai-fundamentals/01-bedrock-overview-and-converse-api"
     },
     {
      "label": "RAG",
      "slug": "01-bedrock-genai-fundamentals/03-retrieval-augmented-generation-rag"
     },
     {
      "label": "Knowledge Bases",
      "slug": "01-bedrock-genai-fundamentals/04-bedrock-knowledge-bases"
     }
    ],
    "verified": "2026-10-23",
    "minutes": 22,
    "figures": 2,
    "code": 8,
    "labs": 0,
    "artifacts": 2,
    "quiz": 10,
    "recall": 5,
    "cards": 4
   },
   {
    "slug": "01-bedrock-genai-fundamentals/08-prompt-management-flows-and-structured-output",
    "n": 8,
    "title": "Prompt Management, Flows and Enforcing Structured Output",
    "blurb": "Real applications don't hard-code prompts inside code.",
    "domains": [
     1,
     2,
     3
    ],
    "blueprint": "Domain 1 · Task 1.6 (1.6.1 instruction frameworks, 1.6.3 prompt management and governance, 1.6.6 complex prompt systems / Prompt Flows) · Domain 2 · 2.5.2 (Prompt Flows as no-code builder), 2.5.5 (prompt chaining) · Domain 3 · 3.1.3 (JSON Schema to enforce structured outputs)",
    "relevance": "High",
    "level": "Intermediate",
    "syllabus": "27, 28, 29",
    "prereqs": [
     {
      "label": "Bedrock overview and Converse",
      "slug": "01-bedrock-genai-fundamentals/01-bedrock-overview-and-converse-api"
     },
     {
      "label": "Guardrails",
      "slug": "01-bedrock-genai-fundamentals/07-bedrock-guardrails"
     }
    ],
    "verified": "2026-10-23",
    "minutes": 20,
    "figures": 1,
    "code": 7,
    "labs": 1,
    "artifacts": 2,
    "quiz": 10,
    "recall": 5,
    "cards": 4
   },
   {
    "slug": "01-bedrock-genai-fundamentals/09-prompt-engineering-misuse-and-bias",
    "n": 9,
    "title": "Prompt Engineering: Anatomy, Best Practices, Prompt Types, Misuse and Bias",
    "blurb": "A prompt is the instructions and material you give a model. The model does exactly what the words and structure of the prompt make most likely, so clearer prompts give better, more repeatable answers.",
    "domains": [
     1,
     3,
     5
    ],
    "blueprint": "Domain 1 · Task 1.6 (1.6.1 instruction frameworks, 1.6.4 prompt QA, 1.6.5 iterative refinement: structured input, output format, chain-of-thought, feedback loops) · Domain 3 · 3.1.5 (prompt injection / jailbreak), 3.4.2 (fairness evaluation) · Domain 5 · 5.2.3, 5.2.5 (prompt troubleshooting)",
    "relevance": "High",
    "level": "Beginner → Intermediate",
    "syllabus": "30, 31, 32, 33, 34",
    "prereqs": [
     {
      "label": "LLM basics",
      "slug": "00-foundations/02-llm-and-genai-basics"
     },
     {
      "label": "Converse API",
      "slug": "01-bedrock-genai-fundamentals/01-bedrock-overview-and-converse-api"
     },
     {
      "label": "Guardrails",
      "slug": "01-bedrock-genai-fundamentals/07-bedrock-guardrails"
     },
     {
      "label": "Prompt Management",
      "slug": "01-bedrock-genai-fundamentals/08-prompt-management-flows-and-structured-output"
     }
    ],
    "verified": "2026-10-23",
    "minutes": 17,
    "figures": 2,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 10,
    "recall": 5,
    "cards": 3
   },
   {
    "slug": "01-bedrock-genai-fundamentals/10-enterprise-integration-and-generative-ai-lens",
    "n": 10,
    "title": "Enterprise Integration and the Well-Architected Generative AI Lens",
    "blurb": "A demo calls a model from a laptop.",
    "domains": [
     1,
     2,
     3
    ],
    "blueprint": "Domain 1 · Task 1.1 (1.1.3 standardized components using the Well-Architected Framework and the Generative AI Lens) · Domain 2 · Task 2.3 (2.3.1–2.3.5 enterprise connectivity, integrated AI capabilities, secure access, cross-environment, CI/CD and GenAI gateway) · Domain 3 · 3.2.1",
    "relevance": "Medium–High",
    "level": "Intermediate → Advanced",
    "syllabus": "35, 36",
    "prereqs": [
     {
      "label": "Bedrock overview",
      "slug": "01-bedrock-genai-fundamentals/01-bedrock-overview-and-converse-api"
     },
     {
      "label": "Guardrails",
      "slug": "01-bedrock-genai-fundamentals/07-bedrock-guardrails"
     }
    ],
    "verified": "2026-10-23",
    "minutes": 20,
    "figures": 1,
    "code": 3,
    "labs": 0,
    "artifacts": 2,
    "quiz": 10,
    "recall": 5,
    "cards": 3
   }
  ]
 },
 {
  "id": "02-data-management",
  "n": 2,
  "track": "guide",
  "title": "Data Management",
  "blurb": "Data quality and preparation, Transcribe and Comprehend, and every vector store: OpenSearch, S3 Vectors, pgvector.",
  "domains": [
   1,
   2,
   3,
   4,
   5
  ],
  "lessons": [
   {
    "slug": "02-data-management/01-structured-data-and-bedrock-data-automation",
    "n": 1,
    "title": "Structured Data for GenAI and Amazon Bedrock Data Automation",
    "blurb": "A language model is good with words but bad with big tables: if you paste a million sales rows into a prompt it will run out of room and guess.",
    "domains": [
     1
    ],
    "blueprint": "Domain 1 · Task 1.3 (1.3.2 text/image/audio/tabular processing, 1.3.4 improve input quality) · Task 1.5 (retrieval over structured sources) · 2.5.3 (Bedrock Data Automation)",
    "relevance": "Medium–High",
    "level": "Intermediate",
    "syllabus": "37, 38, 39",
    "prereqs": [
     {
      "label": "Multimodal pipelines",
      "slug": "01-bedrock-genai-fundamentals/06-multimodal-models-and-pipelines"
     },
     {
      "label": "Knowledge Bases",
      "slug": "01-bedrock-genai-fundamentals/04-bedrock-knowledge-bases"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 18,
    "figures": 1,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 4,
    "cards": 3
   },
   {
    "slug": "02-data-management/02-sagemaker-data-wrangler-and-data-preparation",
    "n": 2,
    "title": "SageMaker Data Wrangler and Data Preparation for GenAI",
    "blurb": "Before data reaches a model, an embedding job or a training run, somebody has to tidy it: fix dates, remove duplicates, fill or drop blanks, spot weird numbers.",
    "domains": [
     1
    ],
    "blueprint": "Domain 1 · Task 1.3 (1.3.1 data validation workflows, 1.3.2 processing, 1.3.4 improve input quality)",
    "relevance": "Medium",
    "level": "Beginner→Intermediate",
    "syllabus": "40, 41, 42",
    "prereqs": [
     {
      "label": "Structured data and BDA",
      "slug": "02-data-management/01-structured-data-and-bedrock-data-automation"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 11,
    "figures": 1,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 4,
    "cards": 2
   },
   {
    "slug": "02-data-management/03-aws-glue-data-quality-and-cloudwatch-metrics",
    "n": 3,
    "title": "AWS Glue, Glue Studio, Glue Data Quality and CloudWatch Metrics",
    "blurb": "AWS Glue is a serverless data-plumbing service: it finds your data and writes down what it looks like (the Data Catalog), then runs jobs that move and reshape that data (ETL), without servers for you to manage.",
    "domains": [
     1,
     5
    ],
    "blueprint": "Domain 1 · Task 1.3 (1.3.1 data validation workflows: Glue Data Quality, Lambda, CloudWatch) · Domain 5 (monitoring, previewed)",
    "relevance": "High",
    "level": "Intermediate",
    "syllabus": "43, 44, 45, 46",
    "prereqs": [
     {
      "label": "Data Wrangler and data preparation",
      "slug": "02-data-management/02-sagemaker-data-wrangler-and-data-preparation"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 14,
    "figures": 2,
    "code": 2,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 4,
    "cards": 3
   },
   {
    "slug": "02-data-management/04-transcribe-comprehend-and-comprehend-medical",
    "n": 4,
    "title": "Amazon Transcribe, Amazon Comprehend and Comprehend Medical",
    "blurb": "GenAI apps often start with data a model cannot read directly. Amazon Transcribe turns audio (calls, meetings, videos) into text with timestamps and, optionally, speaker labels.",
    "domains": [
     1,
     3
    ],
    "blueprint": "Domain 1 · Task 1.3 (1.3.2 audio and text processing, 1.3.4 enhance input data quality with Comprehend) · Domain 3 (PII handling, previewed)",
    "relevance": "Medium–High",
    "level": "Intermediate",
    "syllabus": "47, 48, 49, 50, 51, 52",
    "prereqs": [
     {
      "label": "Multimodal pipelines",
      "slug": "01-bedrock-genai-fundamentals/06-multimodal-models-and-pipelines"
     },
     {
      "label": "Structured data and BDA",
      "slug": "02-data-management/01-structured-data-and-bedrock-data-automation"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 12,
    "figures": 2,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 4,
    "cards": 2
   },
   {
    "slug": "02-data-management/05-amazon-opensearch-for-genai",
    "n": 5,
    "title": "Amazon OpenSearch Service and Serverless as a GenAI Vector Store",
    "blurb": "Amazon OpenSearch is a search engine that can do two kinds of search at once: classic keyword search (find the word \"refund\") and vector search (find text that means refund). That mix makes it the most flexible vector store for RAG.",
    "domains": [
     1
    ],
    "blueprint": "Domain 1 · Task 1.4 (1.4.1 vector architectures, 1.4.3 high-performance vector DB: sharding, multi-index, hierarchical) · Task 1.5 (1.5.3 vector search deployment, 1.5.4 hybrid search and reranker)",
    "relevance": "High",
    "level": "Intermediate→Advanced",
    "syllabus": "53, 54–55, 56, 57, 58, 59",
    "prereqs": [
     {
      "label": "Embeddings and vector search",
      "slug": "00-foundations/03-embeddings-vectors-semantic-search"
     },
     {
      "label": "RAG",
      "slug": "01-bedrock-genai-fundamentals/03-retrieval-augmented-generation-rag"
     },
     {
      "label": "Chunking, embeddings and reranking",
      "slug": "01-bedrock-genai-fundamentals/05-chunking-embeddings-reranking-and-rag-evaluation"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 18,
    "figures": 3,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 4,
    "cards": 4
   },
   {
    "slug": "02-data-management/06-s3-vectors-and-keeping-vector-stores-current",
    "n": 6,
    "title": "Amazon S3 Vectors and Keeping a Vector Store Up to Date",
    "blurb": "Amazon S3 Vectors is storage built for embeddings.",
    "domains": [
     1
    ],
    "blueprint": "Domain 1 · Task 1.4 (1.4.1 vector architectures, 1.4.2 metadata frameworks, 1.4.5 data maintenance: incremental updates, change detection, sync)",
    "relevance": "High",
    "level": "Intermediate",
    "syllabus": "60, 61, 62, 63, 80",
    "prereqs": [
     {
      "label": "Embeddings and vector search",
      "slug": "00-foundations/03-embeddings-vectors-semantic-search"
     },
     {
      "label": "OpenSearch for GenAI",
      "slug": "02-data-management/05-amazon-opensearch-for-genai"
     },
     {
      "label": "Knowledge Bases",
      "slug": "01-bedrock-genai-fundamentals/04-bedrock-knowledge-bases"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 16,
    "figures": 2,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 4,
    "cards": 4
   },
   {
    "slug": "02-data-management/07-rds-aurora-and-pgvector",
    "n": 7,
    "title": "Amazon RDS, Amazon Aurora and pgvector for GenAI",
    "blurb": "Many companies already keep their business data (customers, products, tickets) in a relational database. Amazon RDS runs managed databases such as PostgreSQL; Amazon Aurora is AWS's cloud-built, MySQL- and PostgreSQL-compatible engine.",
    "domains": [
     1
    ],
    "blueprint": "Domain 1 · Task 1.4 (1.4.1 vector architectures: RDS + S3, 1.4.2 metadata) · Task 1.5 (1.5.3 vector search deployment with Aurora pgvector, 1.5.4 hybrid search)",
    "relevance": "High",
    "level": "Intermediate",
    "syllabus": "64, 65, 66, 67, 68, 69",
    "prereqs": [
     {
      "label": "Embeddings and vector search",
      "slug": "00-foundations/03-embeddings-vectors-semantic-search"
     },
     {
      "label": "Knowledge Bases",
      "slug": "01-bedrock-genai-fundamentals/04-bedrock-knowledge-bases"
     },
     {
      "label": "OpenSearch for GenAI",
      "slug": "02-data-management/05-amazon-opensearch-for-genai"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 14,
    "figures": 2,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 4,
    "cards": 4
   },
   {
    "slug": "02-data-management/08-amazon-dynamodb-for-genai",
    "n": 8,
    "title": "Amazon DynamoDB for GenAI Applications",
    "blurb": "Amazon DynamoDB is a serverless NoSQL database that answers \"give me the item with this key\" in a few milliseconds at almost any scale.",
    "domains": [
     1,
     2
    ],
    "blueprint": "Domain 1 · Task 1.4 (1.4.1 DynamoDB in vector/metadata architectures) · Task 1.6 (prompt and conversation governance with DynamoDB) · Domain 2 (state, memory)",
    "relevance": "Medium–High",
    "level": "Beginner→Intermediate",
    "syllabus": "70, 71, 72–73, 74–75, 76–77, 78, 79",
    "prereqs": [
     {
      "label": "AWS account, IAM and CLI",
      "slug": "00-foundations/01-aws-account-iam-and-cli-setup"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 15,
    "figures": 2,
    "code": 2,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 4,
    "cards": 4
   },
   {
    "slug": "02-data-management/09-amazon-s3-storage-lifecycle-replication-and-security",
    "n": 9,
    "title": "Amazon S3 for GenAI Data: Storage Classes, Lifecycle, Replication, Encryption, Logs and Access Points",
    "blurb": "Amazon S3 is where GenAI data lives before and after the model sees it: source documents for a knowledge base, training and evaluation files, call recordings, extracted text, logs, backups. Five practical questions come up again and again.",
    "domains": [
     1,
     3,
     4
    ],
    "blueprint": "Domain 1 · Task 1.4 (data maintenance, RAG data lakes) · Domain 3 (encryption, access control, auditing) · Domain 4 (storage cost)",
    "relevance": "Medium–High",
    "level": "Beginner→Intermediate",
    "syllabus": "82–83, 84–85, 86, 87–89, 90–93, 94–95, 96 . Lesson 81 is in [01/05].",
    "prereqs": [
     {
      "label": "AWS account, IAM and CLI",
      "slug": "00-foundations/01-aws-account-iam-and-cli-setup"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 22,
    "figures": 2,
    "code": 2,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 4
   }
  ]
 },
 {
  "id": "03-agentic-ai",
  "n": 3,
  "track": "guide",
  "title": "Agentic AI",
  "blurb": "Agents Classic, multi-agent memory, Strands and Agent Squad, AgentCore, MCP and humans in the loop.",
  "domains": [
   2,
   5
  ],
  "lessons": [
   {
    "slug": "03-agentic-ai/01-llm-agents-and-bedrock-agents-classic",
    "n": 1,
    "title": "LLM Agents and Amazon Bedrock Agents Classic",
    "blurb": "A plain chatbot answers with words. An agent can also do things: it reads your request, decides which tool to use (look up an order, search the knowledge base, call an API), uses it, looks at the result, and repeats until it can answer.",
    "domains": [
     2
    ],
    "blueprint": "Domain 2 · Task 2.1 (2.1.1 agent state/memory · 2.1.3 safeguards · 2.1.5 human-in-the-loop · 2.1.6 tool integrations)",
    "relevance": "High",
    "level": "Intermediate",
    "syllabus": "97, 98 ), 99, 100, 101",
    "prereqs": [
     {
      "label": "Bedrock overview and Converse API",
      "slug": "01-bedrock-genai-fundamentals/01-bedrock-overview-and-converse-api"
     },
     {
      "label": "Knowledge Bases",
      "slug": "01-bedrock-genai-fundamentals/04-bedrock-knowledge-bases"
     },
     {
      "label": "Guardrails",
      "slug": "01-bedrock-genai-fundamentals/07-bedrock-guardrails"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 14,
    "figures": 2,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 4,
    "cards": 3
   },
   {
    "slug": "03-agentic-ai/02-multi-agent-workflows-and-agent-memory",
    "n": 2,
    "title": "Multi-Agent Workflows and Short/Long-Term Agent Memory",
    "blurb": "One agent with twenty tools gets confused, like one employee doing sales, legal and IT support.",
    "domains": [
     2
    ],
    "blueprint": "Domain 2 · Task 2.1 (2.1.1 memory/state · 2.1.4 model coordination and ensembles)",
    "relevance": "High",
    "level": "Intermediate",
    "syllabus": "102, 103",
    "prereqs": [
     {
      "label": "LLM agents and Agents Classic",
      "slug": "03-agentic-ai/01-llm-agents-and-bedrock-agents-classic"
     },
     {
      "label": "DynamoDB for GenAI",
      "slug": "02-data-management/08-amazon-dynamodb-for-genai"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 12,
    "figures": 2,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 4,
    "cards": 3
   },
   {
    "slug": "03-agentic-ai/03-strands-agents-and-agent-squad",
    "n": 3,
    "title": "Strands Agents and Agent Squad",
    "blurb": "Strands Agents is an open-source library from AWS. You write a few lines of Python, give the agent a model and some functions, and the library runs the think-act-observe loop for you inside your own process.",
    "domains": [
     2
    ],
    "blueprint": "Domain 2 · Task 2.1 (2.1.1 Strands Agents, Agent Squad) · Task 2.5 (2.5.5 Strands/Agent Squad)",
    "relevance": "High",
    "level": "Intermediate",
    "syllabus": "104, 105",
    "prereqs": [
     {
      "label": "LLM agents",
      "slug": "03-agentic-ai/01-llm-agents-and-bedrock-agents-classic"
     },
     {
      "label": "Multi-agent and memory",
      "slug": "03-agentic-ai/02-multi-agent-workflows-and-agent-memory"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 11,
    "figures": 1,
    "code": 2,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 4,
    "cards": 3
   },
   {
    "slug": "03-agentic-ai/04-agentcore-runtime-memory-gateway-identity-policy-evaluations",
    "n": 4,
    "title": "Amazon Bedrock AgentCore: Runtime, Memory, Tools, Gateway, Identity, Policy and Evaluations",
    "blurb": "Building a demo agent is easy.",
    "domains": [
     2,
     5
    ],
    "blueprint": "Domain 2 · Task 2.1 (2.1.1 state, 2.1.3 safeguards, 2.1.6 tool integrations, 2.1.7 MCP) · Domain 5 evaluation themes",
    "relevance": "High",
    "level": "Intermediate to Advanced",
    "syllabus": "106, 107, 108, 109, 110",
    "prereqs": [
     {
      "label": "LLM agents",
      "slug": "03-agentic-ai/01-llm-agents-and-bedrock-agents-classic"
     },
     {
      "label": "Multi-agent and memory",
      "slug": "03-agentic-ai/02-multi-agent-workflows-and-agent-memory"
     },
     {
      "label": "Strands and Agent Squad",
      "slug": "03-agentic-ai/03-strands-agents-and-agent-squad"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 16,
    "figures": 1,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 4,
    "cards": 4
   },
   {
    "slug": "03-agentic-ai/05-labs-strands-agentcore-agent-squad-and-harness",
    "n": 5,
    "title": "Labs: Strands + AgentCore + Agent Squad, and AgentCore Harnesses",
    "blurb": "You will build the same idea two ways. In the code path, you write a Strands agent in Python and let AgentCore Runtime host it; if you have several agents you can put Agent Squad in front to route.",
    "domains": [
     2
    ],
    "blueprint": "Domain 2 · Task 2.1 and 2.5 (hands-on for 2.1.1, 2.5.5)",
    "relevance": "Medium",
    "level": "Intermediate",
    "syllabus": "111, 112, 113",
    "prereqs": [
     {
      "label": "Strands and Agent Squad",
      "slug": "03-agentic-ai/03-strands-agents-and-agent-squad"
     },
     {
      "label": "AgentCore services",
      "slug": "03-agentic-ai/04-agentcore-runtime-memory-gateway-identity-policy-evaluations"
     },
     {
      "label": "AWS account, IAM and CLI",
      "slug": "00-foundations/01-aws-account-iam-and-cli-setup"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 13,
    "figures": 1,
    "code": 4,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 4,
    "cards": 2
   },
   {
    "slug": "03-agentic-ai/06-mcp-openapi-tools-and-human-in-the-loop",
    "n": 6,
    "title": "Model Context Protocol, OpenAPI, Tool Usage and Humans in the Loop",
    "blurb": "A model cannot call your systems by itself; it can only ask for a tool to be run. Tool use is the agreed way to ask: you describe tools, the model replies \"please call X with these arguments\", your code runs it and sends the result back.",
    "domains": [
     2
    ],
    "blueprint": "Domain 2 · Task 2.1 (2.1.5 human-in-the-loop · 2.1.6 tool integrations · 2.1.7 MCP servers on Lambda/ECS) · Task 2.5.2 (OpenAPI)",
    "relevance": "High",
    "level": "Intermediate",
    "syllabus": "114, 115, 116",
    "prereqs": [
     {
      "label": "LLM agents",
      "slug": "03-agentic-ai/01-llm-agents-and-bedrock-agents-classic"
     },
     {
      "label": "AgentCore services",
      "slug": "03-agentic-ai/04-agentcore-runtime-memory-gateway-identity-policy-evaluations"
     },
     {
      "label": "Converse API",
      "slug": "01-bedrock-genai-fundamentals/01-bedrock-overview-and-converse-api"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 14,
    "figures": 2,
    "code": 2,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 4,
    "cards": 3
   },
   {
    "slug": "03-agentic-ai/07-amazon-q-apps-and-amazon-quick",
    "n": 7,
    "title": "Amazon Q Apps and Amazon Quick",
    "blurb": "Not every company wants to build agents with code. Amazon Q Apps (inside Amazon Q Business) lets employees turn a prompt or a good chat into a small shareable AI app with a few input and output cards.",
    "domains": [
     2
    ],
    "blueprint": "Supplemental (named in the exam guide's in-scope services: Q Business Apps, Amazon Quick, Quick Sight); relates to Task 2.5.4 (developer assistants) and Domain 2 agentic context",
    "relevance": "Low to Medium",
    "level": "Beginner",
    "syllabus": "117, 118, 119, 120, 121, 122, 123, 124, 125 · plus Quiz 3 coverage",
    "prereqs": [
     {
      "label": "LLM agents",
      "slug": "03-agentic-ai/01-llm-agents-and-bedrock-agents-classic"
     },
     {
      "label": "Knowledge Bases",
      "slug": "01-bedrock-genai-fundamentals/04-bedrock-knowledge-bases"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 14,
    "figures": 1,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 16,
    "recall": 4,
    "cards": 3
   }
  ]
 },
 {
  "id": "04-operational-efficiency",
  "n": 4,
  "track": "guide",
  "title": "Operational Efficiency",
  "blurb": "Token budgets, cost-aware model choice, throughput, four layers of caching, latency, backoff and cross-Region inference.",
  "domains": [
   4,
   5
  ],
  "lessons": [
   {
    "slug": "04-operational-efficiency/01-token-efficiency-and-cost-effective-model-selection",
    "n": 1,
    "title": "Token Efficiency and Cost-Effective Model Selection",
    "blurb": "A foundation model is billed (and rate-limited) by the token, a small chunk of text. Every word you send in and every word the model writes back costs tokens.",
    "domains": [
     4
    ],
    "blueprint": "Domain 4 · Task 4.1 (4.1.1 token efficiency · 4.1.2 cost-effective model selection) · supports 4.3.2 (token monitoring)",
    "relevance": "High",
    "level": "Intermediate",
    "syllabus": "126, 127, 128",
    "prereqs": [
     {
      "label": "Bedrock and the Converse API",
      "slug": "01-bedrock-genai-fundamentals/01-bedrock-overview-and-converse-api"
     },
     {
      "label": "LLM basics",
      "slug": "00-foundations/02-llm-and-genai-basics"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 18,
    "figures": 3,
    "code": 3,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 4
   },
   {
    "slug": "04-operational-efficiency/02-throughput-utilization-and-intelligent-caching",
    "n": 2,
    "title": "Throughput, Resource Utilization and Intelligent Caching",
    "blurb": "Bedrock gives each account a speed limit, measured in tokens per minute.",
    "domains": [
     4
    ],
    "blueprint": "Domain 4 · Task 4.1 (4.1.3 throughput and utilization · 4.1.4 intelligent caching) · Task 4.2 (4.2.3 throughput optimization · 4.2.5 resource allocation)",
    "relevance": "High",
    "level": "Intermediate→Advanced",
    "syllabus": "129, 130",
    "prereqs": [
     {
      "label": "Token efficiency and model selection",
      "slug": "04-operational-efficiency/01-token-efficiency-and-cost-effective-model-selection"
     },
     {
      "label": "DynamoDB for GenAI",
      "slug": "02-data-management/08-amazon-dynamodb-for-genai"
     },
     {
      "label": "Embeddings and semantic search",
      "slug": "00-foundations/03-embeddings-vectors-semantic-search"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 23,
    "figures": 4,
    "code": 3,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 4
   },
   {
    "slug": "04-operational-efficiency/03-responsive-systems-retrieval-and-fm-performance",
    "n": 3,
    "title": "Responsive AI Systems, Retrieval Performance and FM System Performance",
    "blurb": "\"Fast\" has three meanings in a GenAI app: how soon the user sees something, how long until the whole answer is done, and how many users you can serve at once.",
    "domains": [
     4
    ],
    "blueprint": "Domain 4 · Task 4.2 (4.2.1 responsiveness and latency-cost trade-offs · 4.2.2 retrieval performance · 4.2.4 model parameters and A/B tests · 4.2.6 profiling and system-level optimization) · links to 4.3.2",
    "relevance": "High",
    "level": "Intermediate→Advanced",
    "syllabus": "131, 132, 133, 134",
    "prereqs": [
     {
      "label": "Token efficiency",
      "slug": "04-operational-efficiency/01-token-efficiency-and-cost-effective-model-selection"
     },
     {
      "label": "Caching and throughput",
      "slug": "04-operational-efficiency/02-throughput-utilization-and-intelligent-caching"
     },
     {
      "label": "RAG",
      "slug": "01-bedrock-genai-fundamentals/03-retrieval-augmented-generation-rag"
     },
     {
      "label": "OpenSearch for GenAI",
      "slug": "02-data-management/05-amazon-opensearch-for-genai"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 22,
    "figures": 3,
    "code": 2,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 4
   },
   {
    "slug": "04-operational-efficiency/04-backoff-connection-pooling-and-cross-region-inference",
    "n": 4,
    "title": "Exponential Backoff, Connection Pooling and Bedrock Cross-Region Inference",
    "blurb": "When Bedrock says \"too busy\", the worst response is to ask again immediately, from every client, at the same moment: that turns a small problem into a stampede.",
    "domains": [
     4,
     5
    ],
    "blueprint": "Domain 4 · Task 4.1 (4.1.3 high-performance FM systems) · Task 4.2 (4.2.3 throughput optimization, 4.2.6 efficient service communication) · supports Domain 5 skill 5.2.2 (API integration issues)",
    "relevance": "High",
    "level": "Intermediate→Advanced",
    "syllabus": "135, 136, plus Quiz 4 coverage",
    "prereqs": [
     {
      "label": "Throughput and caching",
      "slug": "04-operational-efficiency/02-throughput-utilization-and-intelligent-caching"
     },
     {
      "label": "Bedrock and the Converse API",
      "slug": "01-bedrock-genai-fundamentals/01-bedrock-overview-and-converse-api"
     },
     {
      "label": "AWS account, IAM and CLI",
      "slug": "00-foundations/01-aws-account-iam-and-cli-setup"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 23,
    "figures": 2,
    "code": 2,
    "labs": 1,
    "artifacts": 2,
    "quiz": 14,
    "recall": 5,
    "cards": 5
   }
  ]
 },
 {
  "id": "05-sagemaker",
  "n": 5,
  "track": "guide",
  "title": "SageMaker AI",
  "blurb": "Endpoints and deployment guardrails, FM optimization, Model Monitor and Clarify, Registry, lineage and Pipelines.",
  "domains": [
   1,
   2,
   3,
   4,
   5
  ],
  "lessons": [
   {
    "slug": "05-sagemaker/01-sagemaker-ai-deployment-guardrails-and-fm-optimization",
    "n": 1,
    "title": "SageMaker AI: Hosting Models, Deployment Safeguards and Optimizing FM Deployments",
    "blurb": "Amazon Bedrock lets you use models that AWS hosts. Amazon SageMaker AI is the toolbox for when you want to own the machine: you choose the model files, the container, the instance type and how traffic reaches it.",
    "domains": [
     1,
     2
    ],
    "blueprint": "Domain 2 · Task 2.2 (2.2.1 deployment options incl. SageMaker endpoints · 2.2.2 LLM-specific deployment: memory, GPU, token capacity · 2.2.3 smaller models) · Domain 1 skill 1.2.4 (customization deployment and lifecycle)",
    "relevance": "Medium–High",
    "level": "Intermediate→Advanced",
    "syllabus": "137, 138, 139, 140, 141",
    "prereqs": [
     {
      "label": "Bedrock overview",
      "slug": "01-bedrock-genai-fundamentals/01-bedrock-overview-and-converse-api"
     },
     {
      "label": "Model customization",
      "slug": "01-bedrock-genai-fundamentals/02-model-customization-finetuning-and-lora"
     },
     {
      "label": "AWS account, IAM and CLI",
      "slug": "00-foundations/01-aws-account-iam-and-cli-setup"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 18,
    "figures": 2,
    "code": 3,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 4
   },
   {
    "slug": "05-sagemaker/02-ground-truth-model-monitor-and-clarify",
    "n": 2,
    "title": "SageMaker Ground Truth, Model Monitor and Clarify (Maintenance Mode)",
    "blurb": "Three SageMaker services help keep machine-learning models trustworthy. Ground Truth helps people label data (this photo is a cat; this review is positive) so a model can learn.",
    "domains": [
     1,
     3,
     4
    ],
    "blueprint": "Domain 3 · Task 3.4 (fairness, responsible AI) · Domain 4 · Task 4.3 (monitoring, drift) · Domain 1 (labeled data) · all three services are still on the exam's in-scope list (service-scope)",
    "relevance": "Medium",
    "level": "Intermediate",
    "syllabus": "142, 143, 144",
    "prereqs": [
     {
      "label": "SageMaker hosting",
      "slug": "05-sagemaker/01-sagemaker-ai-deployment-guardrails-and-fm-optimization"
     },
     {
      "label": "Glue Data Quality",
      "slug": "02-data-management/03-aws-glue-data-quality-and-cloudwatch-metrics"
     },
     {
      "label": "Bedrock Guardrails",
      "slug": "01-bedrock-genai-fundamentals/07-bedrock-guardrails"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 15,
    "figures": 2,
    "code": 2,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 3
   },
   {
    "slug": "05-sagemaker/03-model-registry-and-lineage-tracking",
    "n": 3,
    "title": "SageMaker Model Registry, Lineage Tracking and Cross-Account Lineage",
    "blurb": "When many model versions exist, you need two answers: which version is approved to run in production? and where did it come from?",
    "domains": [
     1,
     3,
     5
    ],
    "blueprint": "Domain 1 skill 1.2.4 (customization deployment and lifecycle: Model Registry, rollback) · Domain 3 · Task 3.3 (3.3.1 model cards, lineage; governance and audit) · Domain 5 (deployment validation)",
    "relevance": "Medium–High",
    "level": "Intermediate",
    "syllabus": "145, 146, 147",
    "prereqs": [
     {
      "label": "SageMaker hosting and guardrails",
      "slug": "05-sagemaker/01-sagemaker-ai-deployment-guardrails-and-fm-optimization"
     },
     {
      "label": "IAM basics",
      "slug": "00-foundations/01-aws-account-iam-and-cli-setup"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 14,
    "figures": 2,
    "code": 2,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 3
   },
   {
    "slug": "05-sagemaker/04-neo-unified-studio-pipelines-and-jumpstart",
    "n": 4,
    "title": "SageMaker Neo, Unified Studio, Pipelines and JumpStart",
    "blurb": "Four loosely related tools finish the SageMaker story. Neo compiles a trained model for a specific chip so it runs faster in the cloud or on an edge device.",
    "domains": [
     1,
     2
    ],
    "blueprint": "Domain 1 skill 1.2.4 (lifecycle, CI/CD for models) · Domain 2 · Task 2.2 (deployment strategies; edge/optimized hosting) · Domain 2 CI/CD skills (module 06 continues)",
    "relevance": "Medium",
    "level": "Intermediate",
    "syllabus": "148, 149, 150, 151+ Quiz 5 coverage",
    "prereqs": [
     {
      "label": "SageMaker hosting",
      "slug": "05-sagemaker/01-sagemaker-ai-deployment-guardrails-and-fm-optimization"
     },
     {
      "label": "Model Registry and lineage",
      "slug": "05-sagemaker/03-model-registry-and-lineage-tracking"
     },
     {
      "label": "Monitoring services",
      "slug": "05-sagemaker/02-ground-truth-model-monitor-and-clarify"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 15,
    "figures": 1,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 14,
    "recall": 5,
    "cards": 3
   }
  ]
 },
 {
  "id": "06-app-building-tools",
  "n": 6,
  "track": "guide",
  "title": "App-Building Tools",
  "blurb": "Lambda, API Gateway, AppConfig, Step Functions, CI/CD, AppSync and Amplify, the edge, and event-driven messaging.",
  "domains": [
   1,
   2,
   3,
   4,
   5
  ],
  "lessons": [
   {
    "slug": "06-app-building-tools/01-lambda-integration-patterns-and-lambda-with-bedrock",
    "n": 1,
    "title": "AWS Lambda, Integration Patterns and Lambda with Bedrock",
    "blurb": "AWS Lambda runs your small piece of code only when something asks for it, and you pay only while it runs. You do not manage servers.",
    "domains": [
     2
    ],
    "blueprint": "Domain 2 · Task 2.3 (skills 2.3.1 legacy/event-driven, 2.3.2 API Gateway/Lambda/EventBridge) · Task 2.4 (skills 2.4.1 sync + async FM calls, 2.4.2 streaming, 2.4.3 resilience) · Task 2.2 (skill 2.2.1 Lambda as an on-demand integration layer)",
    "relevance": "High",
    "level": "Beginner → Intermediate",
    "syllabus": "152, 153, 154 and 155, 156",
    "prereqs": [
     {
      "label": "Bedrock and the Converse API",
      "slug": "01-bedrock-genai-fundamentals/01-bedrock-overview-and-converse-api"
     },
     {
      "label": "Backoff, pooling and CRIS",
      "slug": "04-operational-efficiency/04-backoff-connection-pooling-and-cross-region-inference"
     },
     {
      "label": "Responsive systems and streaming",
      "slug": "04-operational-efficiency/03-responsive-systems-retrieval-and-fm-performance"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 21,
    "figures": 1,
    "code": 2,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 3
   },
   {
    "slug": "06-app-building-tools/02-api-gateway-and-genai-applications",
    "n": 2,
    "title": "Amazon API Gateway and GenAI Applications",
    "blurb": "Amazon API Gateway is the front door of your application.",
    "domains": [
     2
    ],
    "blueprint": "Domain 2 · Task 2.3 (2.3.2 API Gateway/Lambda/EventBridge, 2.3.5 GenAI gateway) · Task 2.4 (2.4.1 request validation and async, 2.4.2 streaming with WebSockets/SSE) · Task 2.5 (2.5.1 API Gateway streaming and token limits)",
    "relevance": "High",
    "level": "Intermediate",
    "syllabus": "157, 158, 159",
    "prereqs": [
     {
      "label": "Lambda and Bedrock",
      "slug": "06-app-building-tools/01-lambda-integration-patterns-and-lambda-with-bedrock"
     },
     {
      "label": "Responsive systems and streaming",
      "slug": "04-operational-efficiency/03-responsive-systems-retrieval-and-fm-performance"
     },
     {
      "label": "Throughput and caching (API Gateway cache facts)",
      "slug": "04-operational-efficiency/02-throughput-utilization-and-intelligent-caching"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 18,
    "figures": 2,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 3
   },
   {
    "slug": "06-app-building-tools/03-appconfig-and-dynamic-foundation-model-selection",
    "n": 3,
    "title": "AWS AppConfig and Dynamic Foundation Model Selection",
    "blurb": "Normally, the name of the AI model your application uses is written in code or a setting that needs a redeploy to change.",
    "domains": [
     1,
     2,
     5
    ],
    "blueprint": "Domain 1 · Task 1.2 (skill 1.2.2 dynamic model selection and provider switching without code changes; 1.2.3 resilience) · Domain 2 · Task 2.4 (2.4.4 model routing) · Domain 5 (deployment validation: canary and rollback)",
    "relevance": "High",
    "level": "Intermediate",
    "syllabus": "160, 161",
    "prereqs": [
     {
      "label": "Lambda and Bedrock",
      "slug": "06-app-building-tools/01-lambda-integration-patterns-and-lambda-with-bedrock"
     },
     {
      "label": "Prompt Management",
      "slug": "01-bedrock-genai-fundamentals/08-prompt-management-flows-and-structured-output"
     },
     {
      "label": "Model selection",
      "slug": "04-operational-efficiency/01-token-efficiency-and-cost-effective-model-selection"
     },
     {
      "label": "Cross-Region inference",
      "slug": "04-operational-efficiency/04-backoff-connection-pooling-and-cross-region-inference"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 17,
    "figures": 2,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 3
   },
   {
    "slug": "06-app-building-tools/04-step-functions-states-circuit-breaker-and-prompt-chaining",
    "n": 4,
    "title": "AWS Step Functions: States, Error Handling, Circuit Breaker and Prompt Chaining",
    "blurb": "AWS Step Functions lets you draw and run a multi-step process as a state machine: a map of boxes (states) and arrows. One box calls a model, the next checks the result, another waits for a person, another retries when something fails.",
    "domains": [
     1,
     2
    ],
    "blueprint": "Domain 1 · Task 1.2 (skill 1.2.3 resilient AI: circuit breaker, fallback) · Domain 2 · Task 2.1 (2.1.2 ReAct/CoT with Step Functions, 2.1.3 safeguards, 2.1.5 human-in-the-loop) · Task 2.5 (2.5.3 Step Functions with Bedrock Data Automation and prompt chains) · Task 1.5 (1.5.5 query handling)",
    "relevance": "High",
    "level": "Intermediate",
    "syllabus": "162, 163, 164, 165",
    "prereqs": [
     {
      "label": "Lambda",
      "slug": "06-app-building-tools/01-lambda-integration-patterns-and-lambda-with-bedrock"
     },
     {
      "label": "MCP, tools and human in the loop (callback tokens)",
      "slug": "03-agentic-ai/06-mcp-openapi-tools-and-human-in-the-loop"
     },
     {
      "label": "Backoff and retries",
      "slug": "04-operational-efficiency/04-backoff-connection-pooling-and-cross-region-inference"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 17,
    "figures": 2,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 3
   },
   {
    "slug": "06-app-building-tools/05-codepipeline-codebuild-and-codedeploy",
    "n": 5,
    "title": "CI/CD for GenAI Apps: CodePipeline, CodeBuild and CodeDeploy",
    "blurb": "Three AWS services make the \"ship it safely\" conveyor belt. CodeBuild compiles your code and runs your tests on a temporary machine and hands back a package.",
    "domains": [
     1,
     2,
     5
    ],
    "blueprint": "Domain 2 · Task 2.3 (skill 2.3.5 CI/CD with a GenAI gateway) · Domain 5 · Task 5.1 (deployment validation, A/B and canary: skills 5.1.5, 5.1.9) · Domain 1 · Task 1.2 (2.2/1.2.4 rollback of deployed customizations, with 05/03)",
    "relevance": "Medium",
    "level": "Intermediate",
    "syllabus": "166–168, 169–171, 172–173",
    "prereqs": [
     {
      "label": "Lambda",
      "slug": "06-app-building-tools/01-lambda-integration-patterns-and-lambda-with-bedrock"
     },
     {
      "label": "AppConfig",
      "slug": "06-app-building-tools/03-appconfig-and-dynamic-foundation-model-selection"
     },
     {
      "label": "SageMaker Pipelines (the ML-specific pipeline)",
      "slug": "05-sagemaker/04-neo-unified-studio-pipelines-and-jumpstart"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 18,
    "figures": 2,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 3
   },
   {
    "slug": "06-app-building-tools/06-mlflow-appsync-and-amplify",
    "n": 6,
    "title": "MLflow for LLM Experimentation, AWS AppSync and AWS Amplify",
    "blurb": "Three different helpers sit around a GenAI application.",
    "domains": [
     2,
     4,
     5
    ],
    "blueprint": "Domain 2 · Task 2.5 (2.5.2 Amplify, OpenAPI and Prompt Flows; 2.5.6 tracing) · Task 2.4 (2.4.2 streaming and real-time delivery) · Domain 5 · Task 5.1 (experiment tracking and comparison) · Domain 4 · Task 4.2 (4.2.4 A/B parameter testing, 4.2.6 profiling)",
    "relevance": "Medium",
    "level": "Intermediate",
    "syllabus": "174, 175, 182",
    "prereqs": [
     {
      "label": "API Gateway and GenAI apps",
      "slug": "06-app-building-tools/02-api-gateway-and-genai-applications"
     },
     {
      "label": "SageMaker Model Registry and lineage",
      "slug": "05-sagemaker/03-model-registry-and-lineage-tracking"
     },
     {
      "label": "Model Monitor replacement guidance (MLflow Apps)",
      "slug": "05-sagemaker/02-ground-truth-model-monitor-and-clarify"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 17,
    "figures": 2,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 3
   },
   {
    "slug": "06-app-building-tools/07-outposts-and-wavelength-for-genai",
    "n": 7,
    "title": "AWS Outposts, AWS Wavelength and GenAI at the Edge",
    "blurb": "Sometimes your AI application cannot live only in a faraway AWS Region. The data may have to stay in your own building (a factory, a hospital, a bank branch), or the users may be on mobile phones and every extra millisecond is noticed.",
    "domains": [
     2,
     3
    ],
    "blueprint": "Domain 2 · Task 2.3 (skill 2.3.4: Outposts, Wavelength and secure routing for enterprise integration) · Domain 3 · Task 3.2 (data residency, with module 08)",
    "relevance": "Medium",
    "level": "Intermediate",
    "syllabus": "176, 177, 178, 179",
    "prereqs": [
     {
      "label": "Lambda and Bedrock",
      "slug": "06-app-building-tools/01-lambda-integration-patterns-and-lambda-with-bedrock"
     },
     {
      "label": "Cross-Region inference",
      "slug": "04-operational-efficiency/04-backoff-connection-pooling-and-cross-region-inference"
     },
     {
      "label": "SageMaker hosting",
      "slug": "05-sagemaker/01-sagemaker-ai-deployment-guardrails-and-fm-optimization"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 15,
    "figures": 1,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 3
   },
   {
    "slug": "06-app-building-tools/08-sqs-eventbridge-sns-and-appflow",
    "n": 8,
    "title": "Amazon SQS, EventBridge, SNS and AppFlow for Event-Driven GenAI",
    "blurb": "Four services let the parts of an application talk without waiting for each other. SQS is a mailbox: producers drop messages in, workers take them out when ready, and messages that keep failing are moved to a \"problem\" mailbox.",
    "domains": [
     1,
     2
    ],
    "blueprint": "Domain 2 · Task 2.3 (2.3.1 legacy and event-driven integration, 2.3.2 API Gateway/Lambda/EventBridge) · Task 2.4 (2.4.1 synchronous and asynchronous FM calls with SQS, 2.4.3 resilience: backoff, rate limiting) · Domain 1 · Task 1.4 (1.4.5 data maintenance: change detection and sync, with 02/06)",
    "relevance": "High",
    "level": "Beginner → Intermediate",
    "syllabus": "180, 181, 183, 184, 185, 186, 187+ Quiz 6 coverage",
    "prereqs": [
     {
      "label": "Lambda and event source mappings",
      "slug": "06-app-building-tools/01-lambda-integration-patterns-and-lambda-with-bedrock"
     },
     {
      "label": "Step Functions",
      "slug": "06-app-building-tools/04-step-functions-states-circuit-breaker-and-prompt-chaining"
     },
     {
      "label": "Backoff and retries",
      "slug": "04-operational-efficiency/04-backoff-connection-pooling-and-cross-region-inference"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 21,
    "figures": 2,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 15,
    "recall": 5,
    "cards": 3
   }
  ]
 },
 {
  "id": "07-governance-qa",
  "n": 7,
  "track": "guide",
  "title": "Governance & QA",
  "blurb": "Agent tracing, evaluation jobs and metrics, responsible AI, CloudWatch observability, CloudTrail, X-Ray and Lake Formation.",
  "domains": [
   1,
   2,
   3,
   4,
   5
  ],
  "lessons": [
   {
    "slug": "07-governance-qa/01-agent-tracing-evaluation-metrics-and-bedrock-model-evaluations",
    "n": 1,
    "title": "Agent Tracing, Evaluation Techniques, ROUGE/BLEU/BERTScore and Amazon Bedrock Evaluations",
    "blurb": "A generative model does not give the same answer twice, and there is no compiler error when it is wrong. So you measure it.",
    "domains": [
     3,
     5
    ],
    "blueprint": "Domain 5 · Task 5.1 (5.1.1 metrics, 5.1.2 Bedrock Model Evaluations, 5.1.3 A/B and canary, 5.1.4 LLM-as-a-judge, 5.1.5 RAG evaluation, 5.1.6 agent evaluation, 5.1.7 reporting, 5.1.9 deployment validation) · Domain 3 · Task 3.4 (3.4.1 transparency through agent tracing)",
    "relevance": "High",
    "level": "Intermediate → Advanced",
    "syllabus": "189, 190, 191, 192, 193 ; lesson 188 is the section intro",
    "prereqs": [
     {
      "label": "RAG evaluation basics",
      "slug": "01-bedrock-genai-fundamentals/05-chunking-embeddings-reranking-and-rag-evaluation"
     },
     {
      "label": "Agents Classic",
      "slug": "03-agentic-ai/01-llm-agents-and-bedrock-agents-classic"
     },
     {
      "label": "AgentCore Evaluations",
      "slug": "03-agentic-ai/04-agentcore-runtime-memory-gateway-identity-policy-evaluations"
     },
     {
      "label": "Guardrails",
      "slug": "01-bedrock-genai-fundamentals/07-bedrock-guardrails"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 22,
    "figures": 2,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 3
   },
   {
    "slug": "07-governance-qa/02-principles-of-responsible-ai-and-fairness-evaluation",
    "n": 2,
    "title": "Principles of Responsible AI, Transparency and Fairness Evaluation",
    "blurb": "Responsible AI means building a system that is useful and safe, fair and honest about what it is doing.",
    "domains": [
     3,
     5
    ],
    "blueprint": "Domain 3 · Task 3.4 (3.4.1 transparency, for example through agent tracing; 3.4.2 fairness evaluation and LLM-as-a-judge; 3.4.3 policy-compliant systems) · Domain 5 · Task 5.1 (responsible-AI metrics)",
    "relevance": "Medium → High",
    "level": "Beginner → Intermediate",
    "syllabus": "194",
    "prereqs": [
     {
      "label": "Guardrails",
      "slug": "01-bedrock-genai-fundamentals/07-bedrock-guardrails"
     },
     {
      "label": "Prompt engineering, misuse and bias",
      "slug": "01-bedrock-genai-fundamentals/09-prompt-engineering-misuse-and-bias"
     },
     {
      "label": "Evaluation and tracing",
      "slug": "07-governance-qa/01-agent-tracing-evaluation-metrics-and-bedrock-model-evaluations"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 15,
    "figures": 2,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 3
   },
   {
    "slug": "07-governance-qa/03-cloudwatch-logs-alarms-rum-and-genai-observability",
    "n": 3,
    "title": "CloudWatch Logs, Alarms, RUM and Generative AI Observability",
    "blurb": "Amazon CloudWatch is the AWS service that collects what your application and AWS services say about themselves. Logs are the story (what happened, in words). Metrics are the dashboard numbers (how many, how fast, how many errors).",
    "domains": [
     3,
     4,
     5
    ],
    "blueprint": "Domain 4 · Task 4.3 (4.3.1–4.3.6 observability, invocation logs, token and tool metrics, vector store operations, golden datasets, dashboards and alarms) · Domain 3 · Task 3.3 (3.3.4 continuous monitoring and redaction in logs) · Domain 5 (troubleshooting with logs)",
    "relevance": "High",
    "level": "Beginner → Intermediate",
    "syllabus": "195, 196, 197, 198, 199, 200",
    "prereqs": [
     {
      "label": "Bedrock overview",
      "slug": "01-bedrock-genai-fundamentals/01-bedrock-overview-and-converse-api"
     },
     {
      "label": "Evaluation and tracing",
      "slug": "07-governance-qa/01-agent-tracing-evaluation-metrics-and-bedrock-model-evaluations"
     },
     {
      "label": "Backoff and retries",
      "slug": "04-operational-efficiency/04-backoff-connection-pooling-and-cross-region-inference"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 23,
    "figures": 2,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 3
   },
   {
    "slug": "07-governance-qa/04-cloudtrail-and-x-ray-for-genai",
    "n": 4,
    "title": "AWS CloudTrail and AWS X-Ray for Generative AI Applications",
    "blurb": "CloudTrail answers \"who did what, when, from where\" for AWS API calls: it is the security camera over your account.",
    "domains": [
     2,
     3,
     4,
     5
    ],
    "blueprint": "Domain 3 · Task 3.3 (3.3.2 data source tracking and audit with CloudTrail; 3.3.3 organization governance) · Domain 2 · Task 2.4 (2.4.3 troubleshooting and X-Ray in resilient FM integrations) · Domain 4 · Task 4.3 (observability and tracing) · Domain 5 · Task 5.2 (troubleshooting API integrations)",
    "relevance": "High",
    "level": "Intermediate",
    "syllabus": "201, 202, 203, 204, 205, 206",
    "prereqs": [
     {
      "label": "CloudWatch Logs and alarms",
      "slug": "07-governance-qa/03-cloudwatch-logs-alarms-rum-and-genai-observability"
     },
     {
      "label": "Lambda",
      "slug": "06-app-building-tools/01-lambda-integration-patterns-and-lambda-with-bedrock"
     },
     {
      "label": "API Gateway",
      "slug": "06-app-building-tools/02-api-gateway-and-genai-applications"
     },
     {
      "label": "S3 security",
      "slug": "02-data-management/09-amazon-s3-storage-lifecycle-replication-and-security"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 21,
    "figures": 2,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 3
   },
   {
    "slug": "07-governance-qa/05-lake-formation-and-mixed-review-for-quiz-7",
    "n": 5,
    "title": "AWS Lake Formation for Governed Data Access, and a Mixed Review for Quiz 7",
    "blurb": "IAM answers \"may this role call this API?\" but not \"may this person see the salary column of this table, only for their own region?\". AWS Lake Formation adds that layer.",
    "domains": [
     1,
     3
    ],
    "blueprint": "Domain 3 · Task 3.2 (3.2.1 data access control with Lake Formation, with VPC endpoints and IAM) · Task 3.3 (3.3.1–3.3.2 governance and data source tracking) · Domain 1 (structured data for Knowledge Bases, 02/01)",
    "relevance": "Medium",
    "level": "Intermediate",
    "syllabus": "207+ Quiz 7 coverage",
    "prereqs": [
     {
      "label": "Glue and the Data Catalog",
      "slug": "02-data-management/03-aws-glue-data-quality-and-cloudwatch-metrics"
     },
     {
      "label": "S3 security",
      "slug": "02-data-management/09-amazon-s3-storage-lifecycle-replication-and-security"
     },
     {
      "label": "CloudTrail",
      "slug": "07-governance-qa/04-cloudtrail-and-x-ray-for-genai"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 18,
    "figures": 2,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 16,
    "recall": 5,
    "cards": 3
   }
  ]
 },
 {
  "id": "08-security",
  "n": 8,
  "track": "guide",
  "title": "Security",
  "blurb": "Least privilege and Identity Center, organization guardrails, KMS and Secrets Manager, Cognito, WAF and PrivateLink.",
  "domains": [
   2,
   3
  ],
  "lessons": [
   {
    "slug": "08-security/01-least-privilege-iam-identity-center-and-data-masking",
    "n": 1,
    "title": "Least Privilege, IAM, Identity Center and Data Masking for GenAI Applications",
    "blurb": "IAM (Identity and Access Management) decides who may do what in your AWS account.",
    "domains": [
     2,
     3
    ],
    "blueprint": "Domain 3 · Task 3.2 (3.2.1 IAM and least privilege, 3.2.3 masking and anonymization) · Domain 2 · Task 2.3 (2.3.3 federated access, RBAC and least privilege) · Domain 3 · Task 3.1 (enforcing a guardrail with IAM)",
    "relevance": "High",
    "level": "Beginner → Advanced",
    "syllabus": "209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220 ; lesson 208 is the section intro",
    "prereqs": [
     {
      "label": "Account, IAM and CLI setup",
      "slug": "00-foundations/01-aws-account-iam-and-cli-setup"
     },
     {
      "label": "Guardrails",
      "slug": "01-bedrock-genai-fundamentals/07-bedrock-guardrails"
     },
     {
      "label": "CloudTrail",
      "slug": "07-governance-qa/04-cloudtrail-and-x-ray-for-genai"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 20,
    "figures": 2,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 3
   },
   {
    "slug": "08-security/02-control-tower-organizations-and-governance-guardrails",
    "n": 2,
    "title": "AWS Control Tower, Organizations Guardrails and Organization-Enforced Bedrock Guardrails",
    "blurb": "One AWS account is easy to start but hard to govern at company scale.",
    "domains": [
     3
    ],
    "blueprint": "Domain 3 · Task 3.3 (3.3.3 organizational governance) · Task 3.2 (3.2.1 access control at scale) · Task 3.4 (3.4.3 policy-compliant systems)",
    "relevance": "Medium",
    "level": "Intermediate",
    "syllabus": "221",
    "prereqs": [
     {
      "label": "IAM and Identity Center",
      "slug": "08-security/01-least-privilege-iam-identity-center-and-data-masking"
     },
     {
      "label": "CloudTrail",
      "slug": "07-governance-qa/04-cloudtrail-and-x-ray-for-genai"
     },
     {
      "label": "Guardrails",
      "slug": "01-bedrock-genai-fundamentals/07-bedrock-guardrails"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 15,
    "figures": 2,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 3
   },
   {
    "slug": "08-security/03-kms-secrets-manager-macie-and-bedrock-data-protection",
    "n": 3,
    "title": "Encryption, AWS KMS, Secrets Manager, Amazon Macie and Bedrock Data Protection",
    "blurb": "Encryption turns readable data into scrambled data that only someone with the right key can read. Two places matter: in transit (TLS protects data moving over a network) and at rest (the data on disk).",
    "domains": [
     3
    ],
    "blueprint": "Domain 3 · Task 3.2 (3.2.1 encryption and access control, 3.2.2 PII detection with Macie and Comprehend, 3.2.3 masking) · Task 3.3 (data governance and retention)",
    "relevance": "High",
    "level": "Intermediate",
    "syllabus": "222, 223, 224, 225, 226, 227",
    "prereqs": [
     {
      "label": "IAM and masking",
      "slug": "08-security/01-least-privilege-iam-identity-center-and-data-masking"
     },
     {
      "label": "S3 encryption",
      "slug": "02-data-management/09-amazon-s3-storage-lifecycle-replication-and-security"
     },
     {
      "label": "Comprehend PII",
      "slug": "02-data-management/04-transcribe-comprehend-and-comprehend-medical"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 21,
    "figures": 2,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 3
   },
   {
    "slug": "08-security/04-cognito-and-aws-waf",
    "n": 4,
    "title": "Amazon Cognito and AWS WAF for GenAI Application Front Doors",
    "blurb": "A chat application on the internet needs two guards.",
    "domains": [
     2,
     3
    ],
    "blueprint": "Domain 3 · Task 3.2 (3.2.1 authentication and authorization, access control for AI endpoints) · Domain 2 · Task 2.3 (2.3.3 federated access and RBAC, 2.3.2 API Gateway integration) · Domain 3 · Task 3.1 (3.1.4 defense in depth at the edge)",
    "relevance": "High",
    "level": "Intermediate",
    "syllabus": "228, 229",
    "prereqs": [
     {
      "label": "IAM and Identity Center",
      "slug": "08-security/01-least-privilege-iam-identity-center-and-data-masking"
     },
     {
      "label": "API Gateway",
      "slug": "06-app-building-tools/02-api-gateway-and-genai-applications"
     },
     {
      "label": "AppSync and Amplify",
      "slug": "06-app-building-tools/06-mlflow-appsync-and-amplify"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 18,
    "figures": 2,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 5,
    "cards": 3
   },
   {
    "slug": "08-security/05-vpc-privatelink-and-network-security",
    "n": 5,
    "title": "VPC, PrivateLink and Network Security for GenAI, with a Mixed Review for Quiz 8",
    "blurb": "A VPC (Virtual Private Cloud) is your own private network inside AWS. You cut it into subnets. A subnet whose routing table has a route to an internet gateway is public; one without is private.",
    "domains": [
     2,
     3
    ],
    "blueprint": "Domain 3 · Task 3.2 (3.2.1 VPC endpoints, network isolation, access control) · Domain 2 · Task 2.3 (2.3.4 secure routing, hybrid connectivity) · Domain 3 · Task 3.3 (network audit with Flow Logs)",
    "relevance": "High",
    "level": "Intermediate",
    "syllabus": "230, 231, 232, 233, 234+ Quiz 8 coverage",
    "prereqs": [
     {
      "label": "IAM",
      "slug": "08-security/01-least-privilege-iam-identity-center-and-data-masking"
     },
     {
      "label": "KMS and Secrets Manager",
      "slug": "08-security/03-kms-secrets-manager-macie-and-bedrock-data-protection"
     },
     {
      "label": "Lambda",
      "slug": "06-app-building-tools/01-lambda-integration-patterns-and-lambda-with-bedrock"
     },
     {
      "label": "Outposts and Wavelength",
      "slug": "06-app-building-tools/07-outposts-and-wavelength-for-genai"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 23,
    "figures": 1,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 16,
    "recall": 5,
    "cards": 3
   }
  ]
 },
 {
  "id": "09-other-services",
  "n": 9,
  "track": "guide",
  "title": "Other In-Scope Services",
  "blurb": "Analytics, containers, databases, developer tools, ML services, cost and scaling, transfer, networking and storage.",
  "domains": [
   1,
   2,
   3,
   4
  ],
  "lessons": [
   {
    "slug": "09-other-services/01-analytics-athena-emr-quick-sight-kinesis-and-msk",
    "n": 1,
    "title": "Analytics Services: Athena, EMR, Quick Sight, Kinesis Data Streams and MSK",
    "blurb": "These five services move and examine data around your GenAI application. Athena lets you run SQL on files that sit in S3, with no server to run: good for questions like \"how many tokens did each team use last week?\" when the logs are in S3.",
    "domains": [
     1,
     2,
     4
    ],
    "blueprint": "Domain 1 · Task 1.4 (data pipelines and ingestion for FM workloads) · Domain 2 · Task 2.5 (operational data and monitoring analysis) · Domain 4 (cost and usage analysis)",
    "relevance": "Medium",
    "level": "Beginner → Intermediate",
    "syllabus": "235, 236, 237, 238, 239, 240, 241, Quiz 9",
    "prereqs": [
     {
      "label": "S3",
      "slug": "02-data-management/09-amazon-s3-storage-lifecycle-replication-and-security"
     },
     {
      "label": "Glue",
      "slug": "02-data-management/03-aws-glue-data-quality-and-cloudwatch-metrics"
     },
     {
      "label": "Keeping vector stores current",
      "slug": "02-data-management/06-s3-vectors-and-keeping-vector-stores-current"
     },
     {
      "label": "CloudWatch Logs",
      "slug": "07-governance-qa/03-cloudwatch-logs-alarms-rum-and-genai-observability"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 19,
    "figures": 2,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 10,
    "cards": 4
   },
   {
    "slug": "09-other-services/02-compute-containers-ec2-ecs-eks-lex-and-connect",
    "n": 2,
    "title": "Compute, Containers and Customer Service: EC2, ECS, EKS, Amazon Lex and Amazon Connect",
    "blurb": "Most GenAI apps simply call Bedrock, but sometimes you must run your own code or your own model. EC2 gives you a virtual server (you manage everything on it).",
    "domains": [
     1,
     2
    ],
    "blueprint": "Domain 2 · Task 2.1–2.2 (deployment and integration of GenAI workloads) · Domain 1 · Task 1.1 (architecture choices) · Domain 2 (conversational interfaces)",
    "relevance": "Medium",
    "level": "Beginner → Intermediate",
    "syllabus": "242, 243, 244, 245, 246, 247, 248, 249, Quiz 10",
    "prereqs": [
     {
      "label": "VPC and network security",
      "slug": "08-security/05-vpc-privatelink-and-network-security"
     },
     {
      "label": "SageMaker hosting",
      "slug": "05-sagemaker/01-sagemaker-ai-deployment-guardrails-and-fm-optimization"
     },
     {
      "label": "Lambda",
      "slug": "06-app-building-tools/01-lambda-integration-patterns-and-lambda-with-bedrock"
     },
     {
      "label": "Knowledge Bases",
      "slug": "01-bedrock-genai-fundamentals/04-bedrock-knowledge-bases"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 17,
    "figures": 1,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 10,
    "cards": 3
   },
   {
    "slug": "09-other-services/03-databases-documentdb-elasticache-memorydb-and-neptune",
    "n": 3,
    "title": "Databases for GenAI: DocumentDB, ElastiCache, Valkey and MemoryDB, Neptune and Neptune Analytics",
    "blurb": "Not every GenAI app needs a special \"vector database\". Often the data already lives somewhere, and that place can also search by meaning. DocumentDB stores JSON documents (it speaks the MongoDB language) and now has vector search.",
    "domains": [
     1,
     4
    ],
    "blueprint": "Domain 1 · Task 1.4 (vector stores and retrieval) · Domain 4 · Task 4.1–4.2 (caching and latency) · Domain 1 · Task 1.5 (retrieval mechanisms, GraphRAG)",
    "relevance": "Medium → High",
    "level": "Intermediate",
    "syllabus": "250, 251, 252, 253, 254, 255, Quiz 11",
    "prereqs": [
     {
      "label": "OpenSearch",
      "slug": "02-data-management/05-amazon-opensearch-for-genai"
     },
     {
      "label": "Aurora and pgvector",
      "slug": "02-data-management/07-rds-aurora-and-pgvector"
     },
     {
      "label": "DynamoDB",
      "slug": "02-data-management/08-amazon-dynamodb-for-genai"
     },
     {
      "label": "Throughput and intelligent caching",
      "slug": "04-operational-efficiency/02-throughput-utilization-and-intelligent-caching"
     },
     {
      "label": "Embeddings",
      "slug": "00-foundations/03-embeddings-vectors-semantic-search"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 18,
    "figures": 3,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 10,
    "cards": 3
   },
   {
    "slug": "09-other-services/04-developer-tools-cdk-cli-sdk-cloudformation-and-codeartifact",
    "n": 4,
    "title": "Developer Tools: AWS CDK, Access Keys, CLI and SDK, CloudFormation and CodeArtifact",
    "blurb": "When you click around the console to build a GenAI app, nobody can repeat or review what you did. Infrastructure as code fixes that: you write the setup in a file.",
    "domains": [
     2,
     3,
     4
    ],
    "blueprint": "Domain 2 · Task 2.5 (deployment and operations of GenAI applications) · Domain 3 · Task 3.2 (credential hygiene) · Domain 4 (reproducible, auditable deployments)",
    "relevance": "Medium",
    "level": "Beginner → Intermediate",
    "syllabus": "256, 257, 258, 259–261 ), 262, 263, 264, 265, 266, Quiz 12",
    "prereqs": [
     {
      "label": "AWS account, IAM and CLI setup",
      "slug": "00-foundations/01-aws-account-iam-and-cli-setup"
     },
     {
      "label": "IAM and Identity Center",
      "slug": "08-security/01-least-privilege-iam-identity-center-and-data-masking"
     },
     {
      "label": "CodePipeline, CodeBuild, CodeDeploy",
      "slug": "06-app-building-tools/05-codepipeline-codebuild-and-codedeploy"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 18,
    "figures": 1,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 10,
    "cards": 3
   },
   {
    "slug": "09-other-services/05-ml-services-augmented-ai-kendra-lex-rekognition-and-textract",
    "n": 5,
    "title": "Machine Learning Services: Augmented AI, Kendra, Lex, Rekognition and Textract",
    "blurb": "Before a language model can use a scanned invoice or a photo, something must turn pixels into data. Textract reads documents (text, forms, tables, answers to questions).",
    "domains": [
     1,
     2,
     3
    ],
    "blueprint": "Domain 1 · Task 1.4–1.5 (document and image inputs, retrieval) · Domain 3 · Task 3.3–3.4 (human review, content safety) · Domain 2 (conversational interfaces)",
    "relevance": "Medium",
    "level": "Beginner → Intermediate",
    "syllabus": "267, 268, 269, 270, 271, 272, 273, 274, 275, 276, Quiz 13",
    "prereqs": [
     {
      "label": "Multimodal pipelines and BDA",
      "slug": "01-bedrock-genai-fundamentals/06-multimodal-models-and-pipelines"
     },
     {
      "label": "Knowledge Bases",
      "slug": "01-bedrock-genai-fundamentals/04-bedrock-knowledge-bases"
     },
     {
      "label": "Ground Truth, Model Monitor, Clarify",
      "slug": "05-sagemaker/02-ground-truth-model-monitor-and-clarify"
     },
     {
      "label": "Compute, containers, Lex and Connect",
      "slug": "09-other-services/02-compute-containers-ec2-ecs-eks-lex-and-connect"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 17,
    "figures": 2,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 10,
    "cards": 3
   },
   {
    "slug": "09-other-services/06-management-and-governance-auto-scaling-cost-tools-grafana-and-systems-manager",
    "n": 6,
    "title": "Management and Governance: Auto Scaling, Cost Tools, Managed Grafana and Systems Manager",
    "blurb": "GenAI traffic and bills move up and down. Auto Scaling adds and removes capacity (servers, containers, model endpoint copies) so you do not pay for idle machines or fall over at a peak.",
    "domains": [
     2,
     3,
     4
    ],
    "blueprint": "Domain 4 · Task 4.1–4.2 (cost optimization, scaling) · Domain 4 · Task 4.3 (monitoring and dashboards) · Domain 2 · Task 2.4 (configuration management) · Domain 3 (secure operations access)",
    "relevance": "Medium → High",
    "level": "Beginner → Intermediate",
    "syllabus": "277, 278, 279, 280, 281, 282, 283, 284, Quiz 14",
    "prereqs": [
     {
      "label": "Throughput and caching",
      "slug": "04-operational-efficiency/02-throughput-utilization-and-intelligent-caching"
     },
     {
      "label": "SageMaker hosting",
      "slug": "05-sagemaker/01-sagemaker-ai-deployment-guardrails-and-fm-optimization"
     },
     {
      "label": "AppConfig",
      "slug": "06-app-building-tools/03-appconfig-and-dynamic-foundation-model-selection"
     },
     {
      "label": "CloudWatch",
      "slug": "07-governance-qa/03-cloudwatch-logs-alarms-rum-and-genai-observability"
     },
     {
      "label": "Secrets Manager",
      "slug": "08-security/03-kms-secrets-manager-macie-and-bedrock-data-protection"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 21,
    "figures": 2,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 10,
    "cards": 3
   },
   {
    "slug": "09-other-services/07-migration-and-transfer-datasync-and-transfer-family",
    "n": 7,
    "title": "Migration and Transfer: AWS DataSync and AWS Transfer Family",
    "blurb": "A RAG system is only as good as the documents that reach it. Those documents often start on an office file server, in another cloud, or on a partner's SFTP site.",
    "domains": [
     1,
     3
    ],
    "blueprint": "Domain 1 · Task 1.4 (ingesting data for FM and RAG workloads) · Domain 3 (secure data transfer)",
    "relevance": "Medium",
    "level": "Beginner → Intermediate",
    "syllabus": "285, 286, Quiz 15",
    "prereqs": [
     {
      "label": "S3",
      "slug": "02-data-management/09-amazon-s3-storage-lifecycle-replication-and-security"
     },
     {
      "label": "Keeping vector stores current",
      "slug": "02-data-management/06-s3-vectors-and-keeping-vector-stores-current"
     },
     {
      "label": "VPC and PrivateLink",
      "slug": "08-security/05-vpc-privatelink-and-network-security"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 14,
    "figures": 1,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 10,
    "cards": 3
   },
   {
    "slug": "09-other-services/08-networking-and-delivery-cloudfront-elb-global-accelerator-and-route-53",
    "n": 8,
    "title": "Networking and Content Delivery: CloudFront, Elastic Load Balancing, Global Accelerator and Route 53",
    "blurb": "When a chat app has users around the world, four things matter: finding the app (DNS), reaching it quickly (fast network path), sharing the work (load balancing), and not asking the origin for things it already answered (caching).",
    "domains": [
     2,
     3,
     4
    ],
    "blueprint": "Domain 2 · Task 2.1–2.3 (application delivery for GenAI) · Domain 4 · Task 4.2 (latency and caching) · Domain 3 · Task 3.1 (network edge)",
    "relevance": "Medium → High",
    "level": "Intermediate",
    "syllabus": "287, 288, 289, 290, 291, 292, 293, Quiz 16",
    "prereqs": [
     {
      "label": "API Gateway",
      "slug": "06-app-building-tools/02-api-gateway-and-genai-applications"
     },
     {
      "label": "Cognito and WAF",
      "slug": "08-security/04-cognito-and-aws-waf"
     },
     {
      "label": "VPC and PrivateLink",
      "slug": "08-security/05-vpc-privatelink-and-network-security"
     },
     {
      "label": "Responsive systems and caching",
      "slug": "04-operational-efficiency/03-responsive-systems-retrieval-and-fm-performance"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 21,
    "figures": 2,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 10,
    "cards": 3
   },
   {
    "slug": "09-other-services/09-storage-ebs-efs-and-choosing-between-them",
    "n": 9,
    "title": "Storage: Amazon EBS, Amazon EFS and EBS vs EFS",
    "blurb": "Most GenAI apps keep documents in S3 and call Bedrock, but sometimes code needs a disk. EBS is a virtual hard disk that you attach to one EC2 instance (fast, private to that server).",
    "domains": [
     1,
     2,
     4
    ],
    "blueprint": "Domain 1 · Task 1.1 (architecture choices) · Domain 2 · Task 2.1 (hosting custom components) · Domain 4 · Task 4.2 (performance)",
    "relevance": "Medium",
    "level": "Beginner → Intermediate",
    "syllabus": "294, 295, 296, 297, 298, Quiz 17",
    "prereqs": [
     {
      "label": "Compute and containers",
      "slug": "09-other-services/02-compute-containers-ec2-ecs-eks-lex-and-connect"
     },
     {
      "label": "S3",
      "slug": "02-data-management/09-amazon-s3-storage-lifecycle-replication-and-security"
     },
     {
      "label": "KMS",
      "slug": "08-security/03-kms-secrets-manager-macie-and-bedrock-data-protection"
     }
    ],
    "verified": "2026-10-26",
    "minutes": 17,
    "figures": 1,
    "code": 1,
    "labs": 1,
    "artifacts": 2,
    "quiz": 8,
    "recall": 10,
    "cards": 3
   }
  ]
 },
 {
  "id": "meta",
  "n": 0,
  "track": "reference",
  "title": "Exam Reference",
  "blurb": "The exam guide map, service scope, glossary and verification log.",
  "domains": [],
  "lessons": [
   {
    "slug": "meta/how-to-use",
    "n": 1,
    "title": "How to Use This Guide",
    "blurb": "The study loop, the suggested path and cost safety before any lab.",
    "type": "Reference",
    "minutes": 1,
    "figures": 0
   },
   {
    "slug": "meta/exam-guide-map",
    "n": 2,
    "title": "Exam Guide Map",
    "blurb": "Exam facts, the five domains and their weights, and where every task is taught.",
    "type": "Reference",
    "minutes": 10,
    "figures": 1
   },
   {
    "slug": "meta/service-scope",
    "n": 3,
    "title": "Service Scope",
    "blurb": "Which AWS services are in scope for AIP-C01, and which are not.",
    "type": "Reference",
    "minutes": 2,
    "figures": 0
   },
   {
    "slug": "meta/glossary",
    "n": 4,
    "title": "Glossary",
    "blurb": "Plain-English definitions for the vocabulary the lessons use.",
    "type": "Reference",
    "minutes": 4,
    "figures": 0
   },
   {
    "slug": "meta/verification-log",
    "n": 5,
    "title": "Verification Log",
    "blurb": "Course claims checked against official AWS pages, and what changed.",
    "type": "Reference",
    "minutes": 67,
    "figures": 0
   },
   {
    "slug": "meta/syllabus-coverage-map",
    "n": 6,
    "title": "Syllabus Coverage Map",
    "blurb": "Every lesson of the source syllabus and the file that teaches it.",
    "type": "Reference",
    "minutes": 16,
    "figures": 0
   }
  ]
 }
];
