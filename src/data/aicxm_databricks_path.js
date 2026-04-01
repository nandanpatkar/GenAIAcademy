export const AICXM_DATABRICKS_PATH = {
  id: "aicxm_databricks",
  label: "AICXM Databricks Path",
  color: "#FF3621",
  dimColor: "#CC2B1A",
  bgColor: "rgba(255,54,33,0.08)",
  borderColor: "rgba(255,54,33,0.3)",
  audience: "Data Engineers & AI Architects on Databricks",
  description: "Master AI Customer Experience Management (AICXM) on Databricks, covering Delta Lake, Vector Search, and the AgentBricks architecture.",
  estimatedHours: "200+ hours",
  nodes: [
    {
      id: "db-product-context",
      title: "Product Context (Databricks Use Cases)",
      subtitle: "Industry-standard AI patterns for customer experience on Databricks.",
      tag: "READY TO START",
      tagColor: "#FF3621",
      modules: [
        {
          id: "db-chatbot",
          title: "Chatbot Architecture",
          subtitle: "Ingestion, Retrieval, Generation, and Response pipelines",
          status: "default",
          duration: "10h",
          subtopics: ["Knowledge sources (docs, FAQs, PDFs)","Query rewriting","Embeddings","Hybrid search (dense + sparse)","Reranking","Context assembly"],
          videos: [],
          files: [],
          links: [{ title: "Databricks Vector Search Documentation", url: "https://docs.databricks.com/en/generative-ai/vector-search.html" }],
          overview: "Learn the core pipeline for building production-grade chatbots using Databricks Vector Search and Foundation Model APIs."
        },
        {
          id: "db-voicebot",
          title: "Voicebot Architecture",
          subtitle: "VAD, STT, LLM, and TTS pipelines",
          status: "locked",
          duration: "12h",
          subtopics: ["Voice Activity Detection (VAD)","Barge-in handling","Turn-taking","Latency targets","AWS Transcribe / Azure Speech (STT)","Amazon Polly / Azure TTS"],
          videos: [],
          files: [],
          links: [{ title: "Building LLM-powered Voicebots on Databricks", url: "https://www.databricks.com/blog/building-generative-ai-voicebots-applications" }],
          overview: "Explore the complexities of voice-based AI using Databricks to orchestrate multi-modal interaction."
        },
        {
          id: "db-lca",
          title: "Live Call Analytics (LCA)",
          subtitle: "Real-time scoring and agent assistance",
          status: "locked",
          duration: "8h",
          subtopics: ["Streaming transcript processing","Real-time scoring (sentiment, risk)","Agent assist (KB articles)","Supervisor alerting"],
          videos: [],
          files: [],
          links: [{ title: "Streaming Analytics on Databricks", url: "https://docs.databricks.com/en/structured-streaming/index.html" }],
          overview: "Implement real-time analysis of live calls to provide agents with immediate feedback and assistance on the Databricks Lakehouse."
        },
        {
          id: "db-pca",
          title: "Post Call Analytics (PCA)",
          subtitle: "Summarization, KPI extraction, and topic modeling",
          status: "locked",
          duration: "8h",
          subtopics: ["After-call summarisation","KPI extraction (AHT, resolution)","Compliance scoring","Topic modelling (LDA / LLM)","Batch processing via Databricks Workflows"],
          videos: [],
          files: [],
          links: [{ title: "Batch Processing for PCA on Databricks", url: "https://docs.databricks.com/en/workflows/index.html" }],
          overview: "Analyze completed calls to extract key performance indicators and improve customer service quality using scheduled Databricks Workflows."
        },
        {
          id: "db-agent-training",
          title: "Agent Training Module",
          subtitle: "Labeling, quality checks, and feedback loops",
          status: "locked",
          duration: "10h",
          subtopics: ["Labelling guidelines","Quality checks (Cohen's Kappa)","Feedback loops","Active learning","Databricks Vector Store dedup"],
          videos: [],
          files: [],
          links: [{ title: "Labeling and Dataset Preparation on Databricks", url: "https://docs.databricks.com/en/machine-learning/data-preparation/index.html" }],
          overview: "Learn to build high-quality datasets for training and continuously improving AI agents on Databricks."
        }
      ]
    },
    {
      id: "db-core-python",
      title: "Core Python for Databricks",
      subtitle: "Language fundamentals optimized for Databricks notebooks and jobs.",
      tag: "FOUNDATION",
      tagColor: "#3b82f6",
      modules: [
        {
          id: "db-py-basic",
          title: "Basic Python",
          subtitle: "Data types, control flow, functions, and collections",
          status: "default",
          duration: "8h",
          subtopics: ["Data types","Control flow","Functions","Collections (list, tuple, set, dict)","JSON (loads, dumps)","File I/O"],
          videos: [],
          files: [],
          links: [{ title: "Python on Databricks", url: "https://docs.databricks.com/en/languages/python.html" }],
          overview: "Solidify your Python foundations with a focus on patterns commonly used in Databricks notebooks and data processing."
        },
        {
          id: "db-py-int",
          title: "Intermediate Python",
          subtitle: "Logging, testing, and Parquet data handling",
          status: "locked",
          duration: "10h",
          subtopics: ["Modules & packages","Virtual envs","Structured logging","Pytest fixtures","Pandas & Parquet (read_parquet)","Date handling (UTC)"],
          videos: [],
          files: [],
          links: [{ title: "Python Libraries on Databricks", url: "https://docs.databricks.com/en/libraries/index.html" }],
          overview: "Master the tools needed to build maintainable and testable Python applications and data pipelines on Databricks."
        },
        {
          id: "db-py-adv",
          title: "Advanced Python",
          subtitle: "Asyncio, concurrency, and secure coding",
          status: "locked",
          duration: "12h",
          subtopics: ["Type hints","Async/await (asyncio)","Threading vs Multiprocessing","Streaming APIs (SSE)","Secure coding (key rotation)"],
          videos: [],
          files: [],
          links: [{ title: "Advanced Python Development on Databricks", url: "https://docs.databricks.com/en/dev-tools/index.html" }],
          overview: "Leverage advanced Python features like asyncio and concurrency to build high-performance, secure cloud applications."
        }
      ]
    },
    {
      id: "db-oop-se",
      title: "OOP & Software Engineering",
      subtitle: "Design principles and production engineering for AI systems.",
      tag: "ENGINEERING",
      tagColor: "#8b5cf6",
      modules: [
        {
          id: "db-oop-core",
          title: "Core OOP Concepts",
          subtitle: "Classes, inheritance, polymorphism, and abstraction",
          status: "default",
          duration: "10h",
          subtopics: ["Classes & objects","Encapsulation","Inheritance","Polymorphism","Abstraction","Composition & MRO"],
          videos: [],
          files: [],
          links: [{ title: "Writing Clean Python for Databricks", url: "https://www.databricks.com/blog/2020/06/03/best-practices-for-maintaining-python-packages-on-databricks.html" }],
          overview: "Learn to design robust, object-oriented systems that scale effectively in a cloud environment."
        },
        {
          id: "db-design-principles",
          title: "Design Principles & SOLID",
          subtitle: "SOLID, UML, and Clean Architecture for AI",
          status: "locked",
          duration: "8h",
          subtopics: ["SOLID principles","UML basics","Clean architecture for AI"],
          videos: [],
          files: [],
          links: [{ title: "Clean Architecture for Machine Learning", url: "https://www.databricks.com/blog/2021/10/18/clean-architecture-for-machine-learning.html" }],
          overview: "Apply industry-standard design principles to create maintainable and extensible AI architectures."
        },
        {
          id: "db-se-essentials",
          title: "Software Engineering Essentials",
          subtitle: "Code quality, ELT vs ETL, and DevOps awareness",
          status: "locked",
          duration: "12h",
          subtopics: ["Git workflow","Linting & Pre-commit","HTTP/REST design","SQL & Window functions","Parquet (core format)","ELT (Preferred)","Docker & CI/CD"],
          videos: [],
          files: [],
          links: [{ title: "Databricks DevOps Documentation", url: "https://docs.databricks.com/en/dev-tools/devops.html" }],
          overview: "Master the essential tools and workflows required for professional software development and data engineering on Databricks."
        }
      ]
    },
    {
      id: "db-data-infra",
      title: "Databricks Data & Infrastructure",
      subtitle: "Delta Lake, Unity Catalog, and scalable clusters.",
      tag: "INFRASTRUCTURE",
      tagColor: "#ec4899",
      modules: [
        {
          id: "db-datastores",
          title: "Delta Lake & Datastores",
          subtitle: "ACID transactions, Time travel, and local databases",
          status: "default",
          duration: "15h",
          subtopics: ["Delta Lake (ACID, Time travel)","Unity Catalog (Governance)","CosmosDB/DynamoDB (Reference awareness)","Redis (Caching)"],
          videos: [],
          files: [],
          links: [{ title: "Delta Lake Documentation", url: "https://docs.delta.io/latest/index.html" }, { title: "Unity Catalog Documentation", url: "https://docs.databricks.com/en/data-governance/unity-catalog/index.html" }],
          overview: "Explore the variety of database options available with Databricks and learn how to choose the right one for your application."
        },
        {
          id: "db-concurrency",
          title: "Concurrency & Parallelism",
          subtitle: "Asyncio, Spark parallelism, and threading",
          status: "locked",
          duration: "10h",
          subtopics: ["Asyncio (gather, Queue)","Threading for blocking I/O","Spark parallelism (Batch pipelines)"],
          videos: [],
          files: [],
          links: [{ title: "Concurrency in Databricks and Spark", url: "https://docs.databricks.com/en/optimizations/index.html" }],
          overview: "Optimize the performance of your Databricks applications using modern concurrency and Spark parallelism techniques."
        },
        {
          id: "db-deploy-infra",
          title: "Deployment & Infrastructure",
          subtitle: "Clusters, Serverless, and Secret management",
          status: "locked",
          duration: "12h",
          subtopics: ["Databricks Clusters (CPU/GPU)","Databricks Serverless (Event-triggered)","Secret Management","CI/CD (GitHub Actions)"],
          videos: [],
          files: [],
          links: [{ title: "Databricks Cluster Configuration", url: "https://docs.databricks.com/en/compute/cluster-config-best-practices.html" }, { title: "Databricks Secrets", url: "https://docs.databricks.com/en/security/secrets/index.html" }],
          overview: "Learn the full lifecycle of deploying and managing scalable AI applications on the Databricks platform."
        }
      ]
    },
    {
      id: "db-nlp-foundations",
      title: "NLP Foundations",
      subtitle: "Tokenization, embeddings, and NLP tasks on Databricks.",
      tag: "NLP",
      tagColor: "#06b6d4",
      modules: [
        {
          id: "db-nlp-preprocessing",
          title: "Preprocessing & Classical Vectorisation",
          subtitle: "Tokenisation, TF-IDF, and Cosine similarity",
          status: "default",
          duration: "10h",
          subtopics: ["Tokenisation","Normalisation","Lemmatisation","TF-IDF","Cosine similarity"],
          videos: [],
          files: [],
          links: [{ title: "Text Preprocessing on Databricks", url: "https://docs.databricks.com/en/machine-learning/data-preparation/text-preprocessing.html" }],
          overview: "Master the foundational text processing techniques required for any natural language processing task."
        },
        {
          id: "db-nlp-embeddings",
          title: "Embeddings & Foundation Model APIs",
          subtitle: "Word2vec, Transformers, and Databricks endpoints",
          status: "locked",
          duration: "12h",
          subtopics: ["Static vs Contextual Embeddings","Sentence transformers","Databricks Foundation Model APIs"],
          videos: [],
          files: [],
          links: [{ title: "Databricks Foundation Model APIs (Embeddings)", url: "https://docs.databricks.com/en/generative-ai/foundation-model-apis.html" }],
          overview: "Explore modern embedding techniques and learn to solve complex NLP tasks like sentiment analysis and entity recognition."
        },
        {
          id: "db-nlp-tasks",
          title: "NLP Tasks & Evaluation",
          subtitle: "Classification, NER, and evaluation metrics",
          status: "locked",
          duration: "8h",
          subtopics: ["Metrics (Precision, Recall, F1)","Named Entity Recognition (NER)","Summarisation (extractive vs abstractive)"],
          videos: [],
          files: [],
          links: [{ title: "NLP Tasks with Spark NLP", url: "https://docs.databricks.com/en/machine-learning/ml-and-deep-learning-libraries.html#spark-nlp" }],
          overview: "Learn to evaluate your NLP models effectively and leverage the most powerful open-source libraries on Databricks."
        }
      ]
    },
    {
      id: "db-ml-dl-awareness",
      title: "ML & DL Awareness",
      subtitle: "Fundamentals of machine learning and deep learning architectures.",
      tag: "ML/DL",
      tagColor: "#f59e0b",
      modules: [
        {
          id: "db-ml-fundamentals",
          title: "Machine Learning Fundamentals",
          subtitle: "Supervised vs Unsupervised, feature engineering",
          status: "default",
          duration: "12h",
          subtopics: ["Train/Test Split & Leakage","Feature engineering","XGBoost & LightGBM"],
          videos: [],
          files: [],
          links: [{ title: "Databricks Machine Learning Documentation", url: "https://docs.databricks.com/en/machine-learning/index.html" }],
          overview: "Build a strong foundation in classical machine learning concepts and algorithms on Databricks."
        },
        {
          id: "db-dl-fundamentals",
          title: "Deep Learning Fundamentals",
          subtitle: "Neural networks, PyTorch, and Transformer overview",
          status: "locked",
          duration: "15h",
          subtopics: ["Neural networks","Loss functions & Backprop","Transformer overview","PyTorch & TensorFlow on Databricks"],
          videos: [],
          files: [],
          links: [{ title: "Deep Learning on Databricks", url: "https://docs.databricks.com/en/machine-learning/train-model/deep-learning/index.html" }],
          overview: "Dive into the world of deep learning and explore the architectures that power modern AI."
        }
      ]
    },
    {
      id: "db-llm-genai",
      title: "LLM & GenAI",
      subtitle: "Architectures, prompting, and Foundation Models on Databricks.",
      tag: "GEN AI",
      tagColor: "#3b82f6",
      modules: [
        {
          id: "db-llm-arch",
          title: "Transformer Architecture",
          subtitle: "Self-attention and inference parameters",
          status: "default",
          duration: "10h",
          subtopics: ["Tokens and tokenisation (BPE)","Self-attention (O(n²))","Multi-head attention","Inference (Temp, top-p, top-k)"],
          videos: [],
          files: [],
          links: [{ title: "Generative AI on Databricks", url: "https://docs.databricks.com/en/generative-ai/index.html" }],
          overview: "Understand the inner workings of Large Language Models and how to tune their performance."
        },
        {
          id: "db-model-awareness",
          title: "Model Awareness & Prompting",
          subtitle: "GPT-4, Llama, and Mosaic AI Foundation Models",
          status: "locked",
          duration: "12h",
          subtopics: ["GPT-4 / Claude awareness","Llama on Databricks","Mosaic AI Foundation Models","Prompt Engineering (Few-shot, CoT)"],
          videos: [],
          files: [],
          links: [{ title: "Databricks Foundation Model Training", url: "https://docs.databricks.com/en/generative-ai/mosaic-ai-foundation-model-training.html" }],
          overview: "Learn to navigate the diverse landscape of LLMs and master the art of prompting for optimal results."
        },
        {
          id: "db-finetuning-structured",
          title: "Fine-tuning & Structured Outputs",
          subtitle: "LoRA, PEFT, and JSON schema outputs",
          status: "locked",
          duration: "15h",
          subtopics: ["Fine-tune vs RAG","LoRA / PEFT","Databricks fine-tuning (Mosaic AI)","JSON schema & Tool calling"],
          videos: [],
          files: [],
          links: [{ title: "Fine-tuning Models on Databricks", url: "https://docs.databricks.com/en/machine-learning/train-model/index.html" }],
          overview: "Master advanced techniques for adapting LLMs to specific tasks and generating structured, machine-readable data."
        }
      ]
    },
    {
      id: "db-rag-systems",
      title: "RAG Systems (Databricks-Focused)",
      subtitle: "Ingestion, retrieval, and evaluation on the Lakehouse.",
      tag: "RAG",
      tagColor: "#00ff88",
      modules: [
        {
          id: "db-rag-pipeline",
          title: "Ingestion & Retrieval Pipeline",
          subtitle: "Document parsing, chunking, and Delta Lake storage",
          status: "default",
          duration: "12h",
          subtopics: ["Document parsing","Chunking strategies","Delta Lake as ingestion target","Hybrid retrieval (dense + BM25)"],
          videos: [],
          files: [],
          links: [{ title: "Building RAG applications on Databricks", url: "https://docs.databricks.com/en/generative-ai/retrieval-augmented-generation.html" }],
          overview: "Build highly effective Retrieval-Augmented Generation systems using Databricks-native services and best practices."
        },
        {
          id: "db-rag-vector-tools",
          title: "Databricks Vector Search",
          subtitle: "Fully managed index and Delta Sync",
          status: "locked",
          duration: "10h",
          subtopics: ["Direct Access vs Delta Sync","Metadata filtering","Embedding models via Foundation Model APIs"],
          videos: [],
          files: [],
          links: [{ title: "Databricks Vector Search - Getting Started", url: "https://docs.databricks.com/en/generative-ai/vector-search.html" }],
          overview: "Learn to measure the performance of your RAG systems and leverage powerful Databricks vector datastores."
        }
      ]
    },
    {
      id: "db-agentic-foundations",
      title: "Agentic AI Foundations",
      subtitle: "Planning, memory, and safety for autonomous agents.",
      tag: "AGENTS",
      tagColor: "#a855f7",
      modules: [
        {
          id: "db-agent-core",
          title: "Core Agent Concepts",
          subtitle: "ReAct loop, planning, and memory",
          status: "default",
          duration: "10h",
          subtopics: ["Perceive-Reason-Act loop","Planning vs Reactive","Agent Memory (Delta Lake tables)"],
          videos: [],
          files: [],
          links: [{ title: "AI Agents on Databricks", url: "https://docs.databricks.com/en/generative-ai/ai-agents.html" }],
          overview: "Discover the fundamental patterns for building autonomous AI agents that can solve complex tasks."
        },
        {
          id: "db-agent-frameworks",
          title: "Agent Frameworks",
          subtitle: "LangChain, LangGraph, and AutoGen",
          status: "locked",
          duration: "15h",
          subtopics: ["LangChain Agents","LangGraph state machines","AutoGen (Microsoft)"],
          videos: [],
          files: [],
          links: [{ title: "Integrating LangChain with Databricks", url: "https://docs.databricks.com/en/machine-learning/index.html" }],
          overview: "Explore the leading frameworks for building sophisticated multi-agent systems and complex AI workflows."
        }
      ]
    },
    {
      id: "db-agentbricks",
      title: "AgentBricks Architecture",
      subtitle: "Managed orchestration, governance, and observability on Databricks.",
      tag: "AGENTBRICKS",
      tagColor: "#FF3621",
      modules: [
        {
          id: "db-ab-overview",
          title: "Platform Overview",
          subtitle: "Delta Lake tools, Unity Catalog governance, and Model Serving",
          status: "default",
          duration: "12h",
          subtopics: ["Delta Lake as a tool (SQL jobs)","Unity Catalog access governance","Model Serving endpoints (REST)","Databricks Workflows integration"],
          videos: [],
          files: [],
          links: [{ title: "Mosaic AI Model Serving Documentation", url: "https://docs.databricks.com/en/machine-learning/model-serving/index.html" }],
          overview: "Master the managed orchestration layer for enterprise-grade agents on the Databricks Lakehouse."
        },
        {
          id: "db-ab-observability",
          title: "MLflow & Tracing",
          subtitle: "Experiment tracking, tracing, and observability",
          status: "locked",
          duration: "12h",
          subtopics: ["MLflow Tracing (Agent reasoning)","Experiment tracking (Inputs, Outputs)","Monitoring & Custom Dashboards (SQL)"],
          videos: [],
          files: [],
          links: [{ title: "MLflow Tracing for AI Agents", url: "https://docs.databricks.com/en/mlflow/tracing.html" }],
          overview: "Implement comprehensive observability for your production agents using native MLflow integration."
        }
      ]
    },
    {
      id: "db-eval-metrics",
      title: "Evaluation, Accuracy & Metrics",
      subtitle: "Offline and online evaluation for Lakehouse-based agents.",
      tag: "EVALUATION",
      tagColor: "#10b981",
      modules: [
        {
          id: "db-eval-foundations",
          title: "Core Evaluation Concepts",
          subtitle: "Ground truth, Golden sets, and LLM-as-judge",
          status: "default",
          duration: "10h",
          subtopics: ["Ground truth in Delta Lake","Offline vs Online evaluation","LLM-as-judge (GPT-4/Claude)"],
          videos: [],
          files: [],
          links: [{ title: "Evaluating LLMs and RAG with MLflow", url: "https://docs.databricks.com/en/mlflow/llm-evaluate.html" }],
          overview: "Learn the rigorous evaluation methodologies required to build reliable and accurate AI systems on Databricks."
        },
        {
          id: "db-agent-metrics",
          title: "Agent & RAG Metrics",
          subtitle: "Task success, tool accuracy, and RAGAS",
          status: "locked",
          duration: "12h",
          subtopics: ["Task success rate","Tool-call accuracy","RAGAS (faithfulness, precision)","Regression detection across versions"],
          videos: [],
          files: [],
          links: [{ title: "Agent Evaluation Best Practices", url: "https://www.databricks.com/blog/2023/10/23/evaluating-large-language-model-generative-ai-production" }],
          overview: "Master the specific metrics and frameworks used to evaluate complex agentic behaviors and RAG pipelines."
        }
      ]
    }
  ]
};
