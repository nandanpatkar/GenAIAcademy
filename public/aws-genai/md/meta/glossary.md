Plain-English definitions. Terms link to the file that teaches them in depth when that file exists.

| Term | Meaning |
|---|---|
| **AWS Region** | A geographic area (for example `us-east-1`) containing several data centers. Most services and models are enabled **per Region**. |
| **IAM** | Identity and Access Management: AWS's system for deciding *who* may do *what* on *which* resources. |
| **IAM role** | A set of permissions that a person or service can *temporarily* assume. Think "visitor badge", not "permanent key". |
| **Least privilege** | Give only the permissions needed, nothing more. |
| **ARN** | Amazon Resource Name: the unique address of any AWS resource. |
| **SDK / Boto3** | A library for calling AWS APIs. Boto3 is the Python one. |
| **Foundation model (FM)** | A very large pre-trained AI model (text, image, etc.) that can be used for many tasks without training from scratch. |
| **LLM** | Large language model: an FM that reads and writes text. |
| **Token** | A chunk of text (word piece) that a model reads. Models and bills are measured in tokens. |
| **Context window** | The maximum number of tokens (input + output) a model can handle in one request. |
| **Inference** | Using a trained model to produce an answer. |
| **Prompt** | The input instructions and data you send to a model. |
| **System prompt** | Instructions that set the model's role and rules for the whole conversation. |
| **Temperature / top-p / top-k** | Settings that control randomness of the output. Low temperature = more predictable. |
| **Hallucination** | A confident answer that is wrong or invented. |
| **RAG** | Retrieval-Augmented Generation: fetch relevant documents first, then let the model answer using them. |
| **Embedding** | A list of numbers (a vector) that represents the *meaning* of a piece of data so similar meanings sit close together. See [00-foundations/03](aip:00-foundations/03-embeddings-vectors-semantic-search). |
| **Vector** | An ordered list of numbers, e.g. `[0.12, -0.5, 0.8, …]`. |
| **Dimension** | Length of a vector (for example 1024). |
| **Cosine similarity** | A score from −1 to 1 for how similar the direction of two vectors is. |
| **Semantic search** | Searching by meaning instead of exact words. |
| **Vector store / vector database** | A system that stores vectors and quickly finds the nearest ones. |
| **Chunking** | Splitting documents into smaller pieces before embedding. |
| **Knowledge base (Bedrock)** | A managed feature that ingests your documents and retrieves relevant pieces for RAG. |
| **Guardrails** | Rules that filter harmful, off-topic, or sensitive inputs/outputs. |
| **Agent** | An LLM-driven program that decides which tools/actions to call to reach a goal. |
| **MCP** | Model Context Protocol: a standard way for agents to discover and call tools. |
| **Throttling** | The service rejecting requests because you exceeded a rate quota. |
| **Exponential backoff** | Waiting longer after each retry (1s, 2s, 4s…), usually with random jitter. |
| **Cross-Region inference (CRIS)** | Bedrock routes your request to another Region to get more capacity. |
| **Provisioned Throughput** | Reserved model capacity billed by time, for steady high traffic or custom models. |
| **LoRA** | Low-Rank Adaptation: fine-tuning a small add-on instead of every model weight. |
| **BDA (Bedrock Data Automation)** | Managed service that turns documents, images, audio and video into structured output; custom output uses *blueprints* grouped in *projects*. See [02/01](aip:02-data-management/01-structured-data-and-bedrock-data-automation). |
| **DQDL / data quality score** | Glue Data Quality's rule language, and the percentage of rules that passed. See [02/03](aip:02-data-management/03-aws-glue-data-quality-and-cloudwatch-metrics). |
| **OCU** | OpenSearch Compute Unit: 6 GiB memory plus vCPU; the billing/capacity unit of OpenSearch Serverless. See [02/05](aip:02-data-management/05-amazon-opensearch-for-genai). |
| **HNSW** | Hierarchical Navigable Small World: a graph index for fast approximate nearest-neighbour search (OpenSearch, pgvector). |
| **Shard** | One slice of an OpenSearch index; sized by guidance (10–30 GiB for search workloads). |
| **S3 Vectors** | S3 vector buckets and indexes for low-cost similarity search. See [02/06](aip:02-data-management/06-s3-vectors-and-keeping-vector-stores-current). |
| **Pre-filtering vs post-filtering** | Filtering metadata before vs after the nearest-neighbour search; post-filtering can return fewer than K results. |
| **pgvector** | PostgreSQL extension that adds the `vector` type and distance operators. See [02/07](aip:02-data-management/07-rds-aurora-and-pgvector). |
| **RCU / WCU** | DynamoDB read (4 KB) and write (1 KB) capacity units. See [02/08](aip:02-data-management/08-amazon-dynamodb-for-genai). |
| **DAX** | DynamoDB Accelerator: in-memory cache for eventually consistent reads. |
| **TTL (DynamoDB)** | Per-item expiry timestamp (epoch seconds, Number); deletion happens typically within days and costs no write capacity. |
| **Lifecycle rule (S3)** | Rule that transitions objects to colder storage classes or expires them. See [02/09](aip:02-data-management/09-amazon-s3-storage-lifecycle-replication-and-security). |
| **CRR / SRR** | S3 Cross-Region / Same-Region Replication; both need versioning on source and destination. |
| **SSE-S3 / SSE-KMS / DSSE-KMS / SSE-C** | S3 server-side encryption options: S3-managed (default), KMS-managed, dual-layer KMS, customer-provided keys. |
| **S3 Bucket Key** | Bucket-level key that cuts KMS request cost for SSE-KMS (not supported with DSSE-KMS). |
| **S3 access point** | Named endpoint on a bucket with its own policy and optional VPC restriction. |
