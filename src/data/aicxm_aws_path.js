export const AICXM_AWS_PATH = {
  id: "aicxm_aws",
  label: "AICXM AWS Track",
  color: "#ff9900",
  dimColor: "#ec7211",
  bgColor: "rgba(255,153,0,0.08)",
  borderColor: "rgba(255,153,0,0.3)",
  audience: "AWS Solutions Architects & Developers",
  description: "Master AI Customer Experience Management (AICXM) on AWS, covering chatbots, voicebots, and agentic AI.",
  estimatedHours: "200+ hours",
  nodes: [
    {
      id: "aws-product-context",
      title: "Product Context (AWS Use Cases)",
      subtitle: "Industry-standard AI patterns for customer experience on AWS.",
      tag: "READY TO START",
      tagColor: "#ff9900",
      modules: [
        {
          id: "aws-chatbot",
          title: "Chatbot Architecture",
          subtitle: "Ingestion, Retrieval, Generation, and Response pipelines",
          status: "default",
          duration: "10h",
          subtopics: ["Knowledge sources (docs, FAQs, NFTs)","Query rewriting","Embeddings","Hybrid search (dense + sparse/BM25)","Reranking","Context assembly"],
          videos: [],
          files: [],
          links: [{ title: "AWS Chatbot Documentation", url: "https://docs.aws.amazon.com/chatbot/" }],
          overview: "Learn the core pipeline for building production-grade chatbots on AWS, from data ingestion to response generation."
        },
        {
          id: "aws-voicebot",
          title: "Voicebot Architecture",
          subtitle: "VAD, STT, LLM, and TTS pipelines",
          status: "locked",
          duration: "12h",
          subtopics: ["Voice Activity Detection (VAD)","Barge-in handling","Turn-taking","Latency targets","AWS Transcribe (STT)","Amazon Polly (TTS)"],
          videos: [],
          files: [],
          links: [{ title: "Amazon Polly Documentation", url: "https://docs.aws.amazon.com/polly/" }, { title: "Amazon Transcribe Documentation", url: "https://docs.aws.amazon.com/transcribe/" }],
          overview: "Explore the complexities of voice-based AI, including speech-to-text, text-to-speech, and latency optimization."
        },
        {
          id: "aws-lca",
          title: "Live Call Analytics (LCA)",
          subtitle: "Real-time scoring and agent assistance",
          status: "locked",
          duration: "8h",
          subtopics: ["Streaming transcript processing","Real-time scoring (sentiment, risk)","Agent assist (KB articles)","Supervisor alerting"],
          videos: [],
          files: [],
          links: [{ title: "Amazon Connect Contact Lens", url: "https://docs.aws.amazon.com/connect/latest/adminguide/contact-lens.html" }],
          overview: "Implement real-time analysis of live calls to provide agents with immediate feedback and assistance."
        },
        {
          id: "aws-pca",
          title: "Post Call Analytics (PCA)",
          subtitle: "Summarization, KPI extraction, and topic modeling",
          status: "locked",
          duration: "8h",
          subtopics: ["After-call summarisation","KPI extraction (CSAT, resolution)","Compliance scoring","Topic modelling (LDA / LLM)"],
          videos: [],
          files: [],
          links: [{ title: "AWS Post-Call Analytics Solution", url: "https://aws.amazon.com/solutions/implementations/post-call-analytics/" }],
          overview: "Analyze completed calls to extract key performance indicators and improve customer service quality."
        },
        {
          id: "aws-agent-training",
          title: "Agent Training Module",
          subtitle: "Labeling, quality checks, and feedback loops",
          status: "locked",
          duration: "10h",
          subtopics: ["Labelling guidelines","Quality checks (Cohen's Kappa)","Feedback loops","Active learning"],
          videos: [],
          files: [],
          links: [{ title: "Amazon SageMaker Ground Truth", url: "https://docs.aws.amazon.com/sagemaker/latest/dg/sms.html" }],
          overview: "Learn to build high-quality datasets for training and continuously improving AI agents."
        }
      ]
    },
    {
      id: "aws-core-python",
      title: "Core Python for AWS",
      subtitle: "Language fundamentals optimized for high-performance AWS applications.",
      tag: "FOUNDATION",
      tagColor: "#3b82f6",
      modules: [
        {
          id: "aws-py-basic",
          title: "Basic Python",
          subtitle: "Data types, control flow, functions, and collections",
          status: "default",
          duration: "8h",
          subtopics: ["Data types","Control flow","Functions (args, kwargs)","Collections (list, dict)","JSON handling","Exception handling"],
          videos: [],
          files: [],
          links: [{ title: "Python Boto3 Documentation", url: "https://boto3.amazonaws.com/v1/documentation/api/latest/index.html" }],
          overview: "Solidify your Python foundations with a focus on patterns commonly used in AWS SDKs and serverless functions."
        },
        {
          id: "aws-py-int",
          title: "Intermediate Python",
          subtitle: "Logging, testing, and REST APIs",
          status: "locked",
          duration: "10h",
          subtopics: ["Modules & packages","Virtual envs","Structured logging","Testing (pytest)","FastAPI & Pydantic","Pandas data handling"],
          videos: [],
          files: [],
          links: [{ title: "AWS Lambda Python Logging", url: "https://docs.aws.amazon.com/lambda/latest/dg/python-logging.html" }],
          overview: "Master the tools needed to build maintainable and testable Python applications on AWS."
        },
        {
          id: "aws-py-adv",
          title: "Advanced Python",
          subtitle: "Asyncio, concurrency, and secure coding",
          status: "locked",
          duration: "12h",
          subtopics: ["Type hints","Async/await (asyncio)","Threading vs Multiprocessing","Streaming APIs (SSE)","Secure coding (key rotation)"],
          videos: [],
          files: [],
          links: [{ title: "AWS Python SDK Best Practices", url: "https://docs.aws.amazon.com/sdk-for-python/v2/developer-guide/best-practices.html" }],
          overview: "Leverage advanced Python features like asyncio and concurrency to build high-performance, secure cloud applications."
        }
      ]
    },
    {
      id: "aws-oop-se",
      title: "OOP & Software Engineering",
      subtitle: "Design principles and production engineering for AI systems.",
      tag: "ENGINEERING",
      tagColor: "#8b5cf6",
      modules: [
        {
          id: "aws-oop-core",
          title: "Core OOP Concepts",
          subtitle: "Classes, inheritance, polymorphism, and abstraction",
          status: "default",
          duration: "10h",
          subtopics: ["Classes & objects","Encapsulation","Inheritance","Polymorphism","Abstraction","Composition & MRO"],
          videos: [],
          files: [],
          links: [{ title: "AWS SDK for Python Patterns", url: "https://aws.amazon.com/sdk-for-python/" }],
          overview: "Learn to design robust, object-oriented systems that scale effectively in a cloud environment."
        },
        {
          id: "aws-design-principles",
          title: "Design Principles & SOLID",
          subtitle: "SOLID, UML, and Clean Architecture for AI",
          status: "locked",
          duration: "8h",
          subtopics: ["SOLID principles","UML basics","Clean architecture for AI"],
          videos: [],
          files: [],
          links: [{ title: "AWS Well-Architected Framework", url: "https://aws.amazon.com/architecture/well-architected/" }],
          overview: "Apply industry-standard design principles to create maintainable and extensible AI architectures."
        },
        {
          id: "aws-se-essentials",
          title: "Software Engineering Essentials",
          subtitle: "Code quality, debugging, and DevOps awareness",
          status: "locked",
          duration: "12h",
          subtopics: ["Git workflow","Linting & Pre-commit","Performance profiling","REST design & Auth","SQL & Data structures","Docker & CI/CD"],
          videos: [],
          files: [],
          links: [{ title: "AWS DevOps Documentation", url: "https://docs.aws.amazon.com/devops/" }],
          overview: "Master the essential tools and workflows required for professional software development on AWS."
        }
      ]
    },
    {
      id: "aws-data-infra",
      title: "AWS Data & Infrastructure",
      subtitle: "Scalable datastores and serverless infrastructure.",
      tag: "INFRASTRUCTURE",
      tagColor: "#ec4899",
      modules: [
        {
          id: "aws-datastores",
          title: "AWS Datastores",
          subtitle: "DynamoDB, Redis, and MongoDB on AWS",
          status: "default",
          duration: "15h",
          subtopics: ["DynamoDB (GSI, Keys)","Redis (ElastiCache)","MongoDB / CosmosDB"],
          videos: [],
          files: [],
          links: [{ title: "DynamoDB Documentation", url: "https://docs.aws.amazon.com/dynamodb/" }, { title: "ElastiCache Documentation", url: "https://docs.aws.amazon.com/elasticache/" }],
          overview: "Explore the variety of database options available on AWS and learn how to choose the right one for your application."
        },
        {
          id: "aws-concurrency",
          title: "Concurrency & Parallelism",
          subtitle: "Asyncio, threading, and multiprocessing on AWS",
          status: "locked",
          duration: "10h",
          subtopics: ["Asyncio gather/Queue","Threading for blocking I/O","Multiprocessing for CPU tasks"],
          videos: [],
          files: [],
          links: [{ title: "AWS Lambda Concurrency", url: "https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html" }],
          overview: "Optimize the performance of your AWS applications using modern concurrency and parallelism techniques."
        },
        {
          id: "aws-deploy-infra",
          title: "Deployment & Infrastructure",
          subtitle: "IAM, EKS, and Lambda serverless deployment",
          status: "locked",
          duration: "12h",
          subtopics: ["IAM (Least Privilege)","ECR & Docker on AWS","Kubernetes (EKS)","AWS Lambda serverless","CI/CD (GitHub Actions)"],
          videos: [],
          files: [],
          links: [{ title: "AWS IAM Documentation", url: "https://docs.aws.amazon.com/iam/" }, { title: "AWS EKS Documentation", url: "https://docs.aws.amazon.com/eks/" }],
          overview: "Learn the full lifecycle of deploying and managing scalable AI applications on the AWS cloud."
        }
      ]
    },
    {
      id: "aws-nlp-foundations",
      title: "NLP Foundations",
      subtitle: "Tokenization, embeddings, and foundational NLP tasks.",
      tag: "NLP",
      tagColor: "#06b6d4",
      modules: [
        {
          id: "aws-nlp-preprocessing",
          title: "Preprocessing & Vectorisation",
          subtitle: "Tokenisation, TF-IDF, and Cosine similarity",
          status: "default",
          duration: "10h",
          subtopics: ["Preprocessing (Lemmatisation)","Classical Vectorisation (TF-IDF)","Cosine similarity"],
          videos: [],
          files: [],
          links: [{ title: "Amazon SageMaker NLP", url: "https://docs.aws.amazon.com/sagemaker/latest/dg/algos.html" }],
          overview: "Master the foundational text processing techniques required for any natural language processing task."
        },
        {
          id: "aws-nlp-embeddings",
          title: "Embeddings & Tasks",
          subtitle: "Word2vec, BERT, and core NLP modeling",
          status: "locked",
          duration: "12h",
          subtopics: ["Static vs Contextual Embeddings","Text classification","Sentiment analysis","NER & Topic modelling"],
          videos: [],
          files: [],
          links: [{ title: "Amazon Comprehend Documentation", url: "https://docs.aws.amazon.com/comprehend/" }],
          overview: "Explore modern embedding techniques and learn to solve complex NLP tasks like sentiment analysis and entity recognition."
        },
        {
          id: "aws-nlp-eval",
          title: "Evaluation & Libraries",
          subtitle: "Metrics and industry-standard NLP libraries",
          status: "locked",
          duration: "8h",
          subtopics: ["Metrics (Precision, Recall, F1)","spaCy & NLTK","Hugging Face Transformers"],
          videos: [],
          files: [],
          links: [{ title: "AWS NLP Best Practices", url: "https://aws.amazon.com/blogs/machine-learning/best-practices-for-nlp/" }],
          overview: "Learn to evaluate your NLP models effectively and leverage the most powerful open-source libraries."
        }
      ]
    },
    {
      id: "aws-ml-dl-awareness",
      title: "ML & DL Awareness",
      subtitle: "Fundamentals of machine learning and deep learning architectures.",
      tag: "ML/DL",
      tagColor: "#f59e0b",
      modules: [
        {
          id: "aws-ml-fundamentals",
          title: "Machine Learning Fundamentals",
          subtitle: "Supervised vs Unsupervised, feature engineering",
          status: "default",
          duration: "12h",
          subtopics: ["Train/Test Split & Leakage","Feature engineering","XGBoost & LightGBM"],
          videos: [],
          files: [],
          links: [{ title: "Amazon SageMaker Documentation", url: "https://docs.aws.amazon.com/sagemaker/" }],
          overview: "Build a strong foundation in classical machine learning concepts and algorithms."
        },
        {
          id: "aws-dl-fundamentals",
          title: "Deep Learning Fundamentals",
          subtitle: "Neural networks, PyTorch, and Transformer overview",
          status: "locked",
          duration: "15h",
          subtopics: ["Neural networks","Loss functions & Backprop","Transformer basics","PyTorch & TensorFlow basics"],
          videos: [],
          files: [],
          links: [{ title: "AWS Deep Learning AMIs", url: "https://docs.aws.amazon.com/dlami/latest/devguide/what-is-dlami.html" }],
          overview: "Dive into the world of deep learning and explore the architectures that power modern AI."
        }
      ]
    },
    {
      id: "aws-llm-genai",
      title: "LLM & GenAI",
      subtitle: "Architectures, prompting, and model awareness on AWS.",
      tag: "GEN AI",
      tagColor: "#3b82f6",
      modules: [
        {
          id: "aws-llm-arch",
          title: "Transformer Architecture",
          subtitle: "Self-attention and inference parameters",
          status: "default",
          duration: "10h",
          subtopics: ["Tokenisation (BPE)","Self-attention complexity","Encoder vs Decoder","Inference (Temp, top-p)"],
          videos: [],
          files: [],
          links: [{ title: "Amazon Bedrock Foundation Models", url: "https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html" }],
          overview: "Understand the inner workings of Large Language Models and how to tune their performance."
        },
        {
          id: "aws-model-awareness",
          title: "Model Awareness & Prompting",
          subtitle: "GPT-4, Claude, and Prompt Engineering on AWS",
          status: "locked",
          duration: "12h",
          subtopics: ["Claude, Llama, Mistral awareness","Sytem prompts & Few-shot","Chain-of-thought (CoT)"],
          videos: [],
          files: [],
          links: [{ title: "AWS Prompt Engineering Guide", url: "https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-engineering.html" }],
          overview: "Learn to navigate the diverse landscape of LLMs and master the art of prompting for optimal results."
        },
        {
          id: "aws-finetuning-structured",
          title: "Fine-tuning & Structured Outputs",
          subtitle: "LoRA, PEFT, and JSON schema outputs",
          status: "locked",
          duration: "15h",
          subtopics: ["Fine-tune vs RAG","LoRA / PEFT","JSON schema & Tool calling"],
          videos: [],
          files: [],
          links: [{ title: "Amazon Bedrock Custom Models", url: "https://docs.aws.amazon.com/bedrock/latest/userguide/model-customization.html" }],
          overview: "Master advanced techniques for adapting LLMs to specific tasks and generating structured, machine-readable data."
        }
      ]
    },
    {
      id: "aws-rag-systems",
      title: "RAG Systems (AWS-Focused)",
      subtitle: "Ingestion, retrieval, and evaluation on AWS infrastructure.",
      tag: "RAG",
      tagColor: "#00ff88",
      modules: [
        {
          id: "aws-rag-pipeline",
          title: "Ingestion & Retrieval Pipeline",
          subtitle: "Document parsing, chunking, and indexing on AWS",
          status: "default",
          duration: "12h",
          subtopics: ["Document parsing (Textract)","Chunking strategies","Vector indexing (HNSW)","Hybrid retrieval & Reranking"],
          videos: [],
          files: [],
          links: [{ title: "Amazon Bedrock Knowledge Bases", url: "https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html" }],
          overview: "Build highly effective Retrieval-Augmented Generation systems using AWS-native services and best practices."
        },
        {
          id: "aws-rag-eval-tools",
          title: "RAG Evaluation & AWS Tools",
          subtitle: "Metrics and OpenSearch vector databases",
          status: "locked",
          duration: "10h",
          subtopics: ["Evaluation (Recall@K, MRR)","Answer correctness (LLM-judge)","OpenSearch AWS Vector search"],
          videos: [],
          files: [],
          links: [{ title: "Amazon OpenSearch Vector Search", url: "https://docs.aws.amazon.com/opensearch-service/latest/developerguide/vector-search.html" }],
          overview: "Learn to measure the performance of your RAG systems and leverage powerful AWS vector datastores."
        }
      ]
    },
    {
      id: "aws-agentic-foundations",
      title: "Agentic AI Foundations",
      subtitle: "Planning, memory, and safety for autonomous agents.",
      tag: "AGENTS",
      tagColor: "#a855f7",
      modules: [
        {
          id: "aws-agent-core",
          title: "Core Agent Concepts",
          subtitle: "ReAct loop, planning, and tool usage",
          status: "default",
          duration: "10h",
          subtopics: ["Perceive-Reason-Act loop","Planning vs Reactive","Tool usage (APIs, DBs)"],
          videos: [],
          files: [],
          links: [{ title: "AWS Agents for Amazon Bedrock", url: "https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html" }],
          overview: "Discover the fundamental patterns for building autonomous AI agents that can solve complex tasks."
        },
        {
          id: "aws-agent-memory-safety",
          title: "Agent Memory & Safety",
          subtitle: "State management and guardrails",
          status: "locked",
          duration: "12h",
          subtopics: ["Short-term vs Long-term memory","State management","Guardrails & Fallback strategies"],
          videos: [],
          files: [],
          links: [{ title: "Guardrails for Amazon Bedrock", url: "https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html" }],
          overview: "Implement robust memory systems and comprehensive safety guardrails to ensure reliable agent behavior."
        },
        {
          id: "aws-agent-frameworks",
          title: "Agent Frameworks",
          subtitle: "LangChain, LangGraph, and AutoGen",
          status: "locked",
          duration: "15h",
          subtopics: ["LangChain Agents","LangGraph state machines","AutoGen multi-agent systems"],
          videos: [],
          files: [],
          links: [{ title: "AWS LangChain Integration", url: "https://aws.amazon.com/blogs/machine-learning/build-generative-ai-applications-with-langchain-and-amazon-bedrock/" }],
          overview: "Explore the leading frameworks for building sophisticated multi-agent systems and complex AI workflows."
        }
      ]
    },
    {
      id: "aws-strands-sdk",
      title: "Strands Agent SDK",
      subtitle: "Building agents with the Strands SDK and built-in tools.",
      tag: "STRANDS",
      tagColor: "#ff9900",
      modules: [
        {
          id: "aws-strands-core",
          title: "Core SDK & Tools",
          subtitle: "Agent() class, decorators, and built-in tools",
          status: "default",
          duration: "12h",
          subtopics: ["Agent() class & @tool","Built-in tools (calculator, http)","Model-agnostic support"],
          videos: [],
          files: [],
          links: [{ title: "Strands SDK Documentation", url: "https://docs.strands.ai/" }],
          overview: "Get hands-on with the Strands Agent SDK and discover how to build powerful agents with minimal code."
        },
        {
          id: "aws-strands-patterns",
          title: "Multi-Agent Patterns & Design",
          subtitle: "Supervisor and Swarm architectures",
          status: "locked",
          duration: "10h",
          subtopics: ["Supervisor vs Swarm patterns","Tool design best practices","Input validation & strong typing"],
          videos: [],
          files: [],
          links: [{ title: "Strands Multi-Agent Orchestration", url: "https://docs.strands.ai/multi-agent/" }],
          overview: "Master advanced multi-agent architectures and design principles for building enterprise-grade AI systems."
        }
      ]
    },
    {
      id: "aws-agentcore-runtime",
      title: "AWS AgentCore Runtime",
      subtitle: "Serverless runtime, deployment, and observability.",
      tag: "RUNTIME",
      tagColor: "#ec4899",
      modules: [
        {
          id: "aws-ac-runtime-arch",
          title: "Architecture & Deployment",
          subtitle: "Serverless ARM64 containers and launch workflows",
          status: "default",
          duration: "15h",
          subtopics: ["Serverless ARM64 Docker","Auto-scaling (zero-to-thousands)","Configure, Launch, Invoke lifecycle"],
          videos: [],
          files: [],
          links: [{ title: "AWS AgentCore Documentation", url: "https://docs.aws.amazon.com/agentcore/" }],
          overview: "Learn to deploy and scale your AI agents globally using the high-performance AgentCore runtime."
        },
        {
          id: "aws-ac-gateway-memory",
          title: "Gateway, Memory & Identity",
          subtitle: "MCP discovery, memory hooks, and OAuth2 identity",
          status: "locked",
          duration: "12h",
          subtopics: ["AgentCore Gateway (MCP)","Short-term & Long-term memory","OAuth2 & Session binding"],
          videos: [],
          files: [],
          links: [{ title: "AWS AgentCore Memory Hooks", url: "https://docs.aws.amazon.com/agentcore/memory/" }],
          overview: "Integrate powerful gateway and memory capabilities into your AI agents for persistent, context-aware interactions."
        },
        {
          id: "aws-ac-obs-tools",
          title: "Observability & Advanced Tools",
          subtitle: "Telemetry, X-Ray, and Code Interpreter tools",
          status: "locked",
          duration: "12h",
          subtopics: ["CloudWatch & X-Ray Telemetry","Code Interpreter sandbox","Browser automation tool"],
          videos: [],
          files: [],
          links: [{ title: "AWS X-Ray Documentation", url: "https://docs.aws.amazon.com/xray/" }],
          overview: "Ensure the reliability and performance of your production agents with comprehensive observability and advanced sandboxed tools."
        }
      ]
    },
    {
      id: "aws-eval-metrics",
      title: "Evaluation, Accuracy & Metrics",
      subtitle: "Offline and online evaluation for LLMs and agents.",
      tag: "EVALUATION",
      tagColor: "#10b981",
      modules: [
        {
          id: "aws-eval-foundations",
          title: "Core Evaluation Concepts",
          subtitle: "Ground truth, golden datasets, and offline/online eval",
          status: "default",
          duration: "10h",
          subtopics: ["Ground truth vs Golden sets","Offline vs Online evaluation","LLM-as-judge"],
          videos: [],
          files: [],
          links: [{ title: "Amazon Bedrock Model Evaluation", url: "https://docs.aws.amazon.com/bedrock/latest/userguide/model-evaluation.html" }],
          overview: "Learn the rigorous evaluation methodologies required to build reliable and accurate AI systems."
        },
        {
          id: "aws-agent-metrics",
          title: "Agent & RAG Metrics",
          subtitle: "Task success, tool accuracy, and RAGAS",
          status: "locked",
          duration: "12h",
          subtopics: ["Task success rate","Tool-call accuracy","RAGAS & DeepEval frameworks"],
          videos: [],
          files: [],
          links: [{ title: "AWS RAG Evaluation Blog", url: "https://aws.amazon.com/blogs/machine-learning/evaluate-rag-pipelines-on-amazon-bedrock/" }],
          overview: "Master the specific metrics and frameworks used to evaluate complex agentic behaviors and RAG pipelines."
        }
      ]
    }
  ]
};
