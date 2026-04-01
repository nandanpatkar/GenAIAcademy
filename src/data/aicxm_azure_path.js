export const AICXM_AZURE_PATH = {
  id: "aicxm_azure",
  label: "AICXM Azure Path",
  color: "#0078d4",
  dimColor: "#005a9e",
  bgColor: "rgba(0,120,212,0.08)",
  borderColor: "rgba(0,120,212,0.3)",
  audience: "Azure Solutions Architects & Developers",
  description: "Master AI Customer Experience Management (AICXM) on Azure, covering chatbots, Azure AI Foundry, and Semantic Kernel.",
  estimatedHours: "200+ hours",
  nodes: [
    {
      id: "azure-product-context",
      title: "Product Context (Azure Use Cases)",
      subtitle: "Industry-standard AI patterns for customer experience on Azure.",
      tag: "READY TO START",
      tagColor: "#0078d4",
      modules: [
        {
          id: "azure-chatbot",
          title: "Chatbot Architecture",
          subtitle: "Ingestion, Retrieval, Generation, and Response pipelines",
          status: "default",
          duration: "10h",
          subtopics: ["Knowledge sources (docs, FAQs, PDFs)","Query rewriting","Embeddings","Hybrid search (dense + sparse/BM25)","Reranking","Context assembly"],
          videos: [],
          files: [],
          links: [{ title: "Azure AI Language Documentation", url: "https://learn.microsoft.com/azure/ai-services/language-service/" }],
          overview: "Learn the core pipeline for building production-grade chatbots on Azure, from data ingestion to response generation."
        },
        {
          id: "azure-voicebot",
          title: "Voicebot Architecture",
          subtitle: "VAD, STT, LLM, and TTS pipelines",
          status: "locked",
          duration: "12h",
          subtopics: ["Voice Activity Detection (VAD)","Barge-in handling","Turn-taking","Latency targets","Azure Speech (STT)","Azure TTS"],
          videos: [],
          files: [],
          links: [{ title: "Azure AI Speech Documentation", url: "https://learn.microsoft.com/azure/ai-services/speech-service/" }],
          overview: "Explore the complexities of voice-based AI using Azure AI Speech services for real-time interaction."
        },
        {
          id: "azure-lca",
          title: "Live Call Analytics (LCA)",
          subtitle: "Real-time scoring and agent assistance",
          status: "locked",
          duration: "8h",
          subtopics: ["Streaming transcript processing","Real-time scoring (sentiment, risk)","Agent assist (KB articles)","Supervisor alerting"],
          videos: [],
          files: [],
          links: [{ title: "Azure AI Services for Call Centers", url: "https://learn.microsoft.com/azure/architecture/solution-ideas/articles/interactive-voice-response-bot" }],
          overview: "Implement real-time analysis of live calls to provide agents with immediate feedback and assistance on Azure."
        },
        {
          id: "azure-pca",
          title: "Post Call Analytics (PCA)",
          subtitle: "Summarization, KPI extraction, and topic modeling",
          status: "locked",
          duration: "8h",
          subtopics: ["After-call summarisation","KPI extraction (AHT, resolution)","Compliance scoring","Topic modelling (LDA / LLM)"],
          videos: [],
          files: [],
          links: [{ title: "Azure Post-Call Analytics Solution", url: "https://learn.microsoft.com/azure/ai-services/speech-service/call-center-transcription" }],
          overview: "Analyze completed calls to extract key performance indicators and improve customer service quality using Azure AI."
        },
        {
          id: "azure-agent-training",
          title: "Agent Training Module",
          subtitle: "Labeling, quality checks, and feedback loops",
          status: "locked",
          duration: "10h",
          subtopics: ["Labelling guidelines","Quality checks (Cohen's Kappa)","Feedback loops","Active learning"],
          videos: [],
          files: [],
          links: [{ title: "Azure AI Vision / Language Labeling", url: "https://learn.microsoft.com/azure/ai-services/language-service/custom-text-classification/how-to/tag-data" }],
          overview: "Learn to build high-quality datasets for training and continuously improving AI agents on Azure."
        }
      ]
    },
    {
      id: "azure-core-python",
      title: "Core Python for Azure",
      subtitle: "Language fundamentals optimized for high-performance Azure applications.",
      tag: "FOUNDATION",
      tagColor: "#3b82f6",
      modules: [
        {
          id: "azure-py-basic",
          title: "Basic Python",
          subtitle: "Data types, control flow, and collections",
          status: "default",
          duration: "8h",
          subtopics: ["Data types","Control flow","Functions (args, kwargs)","Collections (list, dict)","JSON handling","File I/O"],
          videos: [],
          files: [],
          links: [{ title: "Python on Azure Documentation", url: "https://learn.microsoft.com/azure/developer/python/" }],
          overview: "Solidify your Python foundations with a focus on patterns commonly used in Azure SDKs and serverless functions."
        },
        {
          id: "azure-py-int",
          title: "Intermediate Python",
          subtitle: "Logging, testing, and REST APIs",
          status: "locked",
          duration: "10h",
          subtopics: ["Modules & packages","Virtual envs","Structured logging","Testing (pytest)","FastAPI & Pydantic","Pandas data handling"],
          videos: [],
          files: [],
          links: [{ title: "Azure Function Python Developer Guide", url: "https://learn.microsoft.com/azure/azure-functions/functions-reference-python" }],
          overview: "Master the tools needed to build maintainable and testable Python applications on Azure."
        },
        {
          id: "azure-py-adv",
          title: "Advanced Python",
          subtitle: "Asyncio, concurrency, and secure coding",
          status: "locked",
          duration: "12h",
          subtopics: ["Type hints","Async/await (asyncio)","Threading vs Multiprocessing","Streaming APIs (SSE)","Secure coding (os.environ)"],
          videos: [],
          files: [],
          links: [{ title: "Azure SDK for Python Best Practices", url: "https://azure.github.io/azure-sdk/python_introduction.html" }],
          overview: "Leverage advanced Python features like asyncio and concurrency to build high-performance, secure cloud applications."
        }
      ]
    },
    {
      id: "azure-oop-se",
      title: "OOP & Software Engineering",
      subtitle: "Design principles and production engineering for AI systems.",
      tag: "ENGINEERING",
      tagColor: "#8b5cf6",
      modules: [
        {
          id: "azure-oop-core",
          title: "Core OOP Concepts",
          subtitle: "Classes, inheritance, polymorphism, and abstraction",
          status: "default",
          duration: "10h",
          subtopics: ["Classes & objects","Encapsulation","Inheritance","Polymorphism","Abstraction","Composition & MRO"],
          videos: [],
          files: [],
          links: [{ title: "Python OOP on Azure SDKs", url: "https://learn.microsoft.com/azure/developer/python/sdk/azure-sdk-overview" }],
          overview: "Learn to design robust, object-oriented systems that scale effectively in a cloud environment."
        },
        {
          id: "azure-design-principles",
          title: "Design Principles & SOLID",
          subtitle: "SOLID, UML, and Clean Architecture for AI",
          status: "locked",
          duration: "8h",
          subtopics: ["SOLID principles","UML basics","Clean architecture for AI"],
          videos: [],
          files: [],
          links: [{ title: "Azure Well-Architected Framework", url: "https://learn.microsoft.com/azure/well-architected/" }],
          overview: "Apply industry-standard design principles to create maintainable and extensible AI architectures on Azure."
        },
        {
          id: "azure-se-essentials",
          title: "Software Engineering Essentials",
          subtitle: "Code quality, debugging, and DevOps awareness",
          status: "locked",
          duration: "12h",
          subtopics: ["Git workflow","Linting & Pre-commit","Performance profiling","REST design & Auth","SQL & Data basics","Docker & CI/CD"],
          videos: [],
          files: [],
          links: [{ title: "Azure DevOps Documentation", url: "https://learn.microsoft.com/azure/devops/" }],
          overview: "Master the essential tools and workflows required for professional software development on Azure."
        }
      ]
    },
    {
      id: "azure-data-infra",
      title: "Azure Data & Infrastructure",
      subtitle: "Scalable datastores and serverless infrastructure on Azure.",
      tag: "INFRASTRUCTURE",
      tagColor: "#ec4899",
      modules: [
        {
          id: "azure-datastores",
          title: "Azure Datastores",
          subtitle: "Cosmos DB, Redis, and Azure SQL",
          status: "default",
          duration: "15h",
          subtopics: ["Cosmos DB (Document model)","Azure Cache for Redis","Azure SQL / Relational"],
          videos: [],
          files: [],
          links: [{ title: "Azure Cosmos DB Documentation", url: "https://learn.microsoft.com/azure/cosmos-db/" }, { title: "Azure Cache for Redis Documentation", url: "https://learn.microsoft.com/azure/azure-cache-for-redis/" }],
          overview: "Explore the variety of database options available on Azure and learn how to choose the right one for your application."
        },
        {
          id: "azure-concurrency",
          title: "Concurrency & Parallelism",
          subtitle: "Asyncio and threading on Azure",
          status: "locked",
          duration: "10h",
          subtopics: ["Asyncio (gather, Queue)","Threading for blocking I/O","Multiprocessing (ProcessPoolExecutor)"],
          videos: [],
          files: [],
          links: [{ title: "Python Async on Azure", url: "https://learn.microsoft.com/azure/developer/python/sdk/azure-sdk-async" }],
          overview: "Optimize the performance of your Azure applications using modern concurrency and parallelism techniques."
        },
        {
          id: "azure-deploy-infra",
          title: "Deployment & Infrastructure",
          subtitle: "RBAC, AKS, and Azure Functions",
          status: "locked",
          duration: "12h",
          subtopics: ["Azure RBAC","Docker on Azure (ACR)","Kubernetes (AKS)","Azure Functions serverless","Azure API Management"],
          videos: [],
          files: [],
          links: [{ title: "Azure RBAC Documentation", url: "https://learn.microsoft.com/azure/role-based-access-control/" }, { title: "Azure AKS Documentation", url: "https://learn.microsoft.com/azure/aks/" }],
          overview: "Learn the full lifecycle of deploying and managing scalable AI applications on the Azure cloud."
        }
      ]
    },
    {
      id: "azure-nlp-foundations",
      title: "NLP Foundations",
      subtitle: "Text preprocessing, embeddings, and NLP tasks.",
      tag: "NLP",
      tagColor: "#06b6d4",
      modules: [
        {
          id: "azure-nlp-preprocessing",
          title: "Preprocessing & Vectorisation",
          subtitle: "Tokenisation, TF-IDF, and Cosine similarity",
          status: "default",
          duration: "10h",
          subtopics: ["Tokenisation","Normalisation","Lemmatisation","Classical Vectorisation (TF-IDF)","Cosine similarity"],
          videos: [],
          files: [],
          links: [{ title: "Azure AI Language Service NLP", url: "https://learn.microsoft.com/azure/ai-services/language-service/overview" }],
          overview: "Master the foundational text processing techniques required for any natural language processing task."
        },
        {
          id: "azure-nlp-embeddings",
          title: "Embeddings & Tasks",
          subtitle: "Word2vec, BERT, and core NLP modeling",
          status: "locked",
          duration: "12h",
          subtopics: ["Static vs Contextual Embeddings","Sentence transformers","Text classification","Sentiment analysis","NER & Summarisation"],
          videos: [],
          files: [],
          links: [{ title: "Azure OpenAI Embeddings", url: "https://learn.microsoft.com/azure/ai-services/openai/concepts/understand-embeddings" }],
          overview: "Explore modern embedding techniques and learn to solve complex NLP tasks like sentiment analysis and entity recognition."
        },
        {
          id: "azure-nlp-eval",
          title: "Evaluation & Libraries",
          subtitle: "Metrics and industry-standard NLP libraries",
          status: "locked",
          duration: "8h",
          subtopics: ["Metrics (Precision, Recall, F1)","spaCy & NLTK","Hugging Face Transformers","Azure AI Language managed NLP"],
          videos: [],
          files: [],
          links: [{ title: "Azure AI Language Evaluation", url: "https://learn.microsoft.com/azure/ai-services/language-service/conversational-language-understanding/how-to/test-model" }],
          overview: "Learn to evaluate your NLP models effectively and leverage the most powerful open-source libraries and managed services."
        }
      ]
    },
    {
      id: "azure-ml-dl-awareness",
      title: "ML & DL Awareness",
      subtitle: "Fundamentals of machine learning and deep learning architectures.",
      tag: "ML/DL",
      tagColor: "#f59e0b",
      modules: [
        {
          id: "azure-ml-fundamentals",
          title: "Machine Learning Fundamentals",
          subtitle: "Supervised vs Unsupervised, feature engineering",
          max_lines: 50,
          status: "default",
          duration: "12h",
          subtopics: ["Train/Test Split & Leakage","Feature engineering","XGBoost & LightGBM"],
          videos: [],
          files: [],
          links: [{ title: "Azure Machine Learning Documentation", url: "https://learn.microsoft.com/azure/machine-learning/" }],
          overview: "Build a strong foundation in classical machine learning concepts and algorithms on Azure."
        },
        {
          id: "azure-dl-fundamentals",
          title: "Deep Learning Fundamentals",
          subtitle: "Neural networks, PyTorch, and Transformer overview",
          status: "locked",
          duration: "15h",
          subtopics: ["Neural networks","Loss functions & Backprop","Transformer overview (BERT, GPT, T5)","PyTorch & TensorFlow basics"],
          videos: [],
          files: [],
          links: [{ title: "Azure Machine Learning Deep Learning", url: "https://learn.microsoft.com/azure/machine-learning/concept-deep-learning-vs-machine-learning" }],
          overview: "Dive into the world of deep learning and explore the architectures that power modern AI."
        }
      ]
    },
    {
      id: "azure-llm-genai",
      title: "LLM & GenAI",
      subtitle: "Architectures, prompting, and model awareness on Azure OpenAI.",
      tag: "GEN AI",
      tagColor: "#3b82f6",
      modules: [
        {
          id: "azure-llm-arch",
          title: "Transformer Architecture",
          subtitle: "Self-attention and inference parameters",
          status: "default",
          duration: "10h",
          subtopics: ["Tokenisation (BPE)","Self-attention (O(n²))","Multi-head attention","Inference (Temp, top-p, top-k)"],
          videos: [],
          files: [],
          links: [{ title: "Azure OpenAI Models", url: "https://learn.microsoft.com/azure/ai-services/openai/concepts/models" }],
          overview: "Understand the inner workings of Large Language Models and how to tune their performance on Azure OpenAI."
        },
        {
          id: "azure-model-awareness",
          title: "Model Awareness & Prompting",
          subtitle: "GPT-4, Phi, and Prompt Engineering on Azure",
          status: "locked",
          duration: "12h",
          subtopics: ["GPT-4 / GPT-4o Awareness","Claude, Llama awareness","Phi — Microsoft SLMs","Prompt Engineering (System prompts, Few-shot)","Chain-of-thought (CoT)"],
          videos: [],
          files: [],
          links: [{ title: "Azure OpenAI Prompt Engineering", url: "https://learn.microsoft.com/azure/ai-services/openai/concepts/prompt-engineering" }],
          overview: "Learn to navigate the diverse landscape of LLMs and master the art of prompting for optimal results on Azure."
        },
        {
          id: "azure-finetuning-structured",
          title: "Fine-tuning & Structured Outputs",
          subtitle: "LoRA, PEFT, and JSON schema outputs",
          status: "locked",
          duration: "15h",
          subtopics: ["Fine-tune vs RAG","LoRA / PEFT","JSON schema & Tool calling"],
          videos: [],
          files: [],
          links: [{ title: "Azure OpenAI Fine-tuning", url: "https://learn.microsoft.com/azure/ai-services/openai/how-to/fine-tuning" }],
          overview: "Master advanced techniques for adapting LLMs to specific tasks and generating structured, machine-readable data on Azure."
        }
      ]
    },
    {
      id: "azure-rag-systems",
      title: "RAG Systems (Azure-Focused)",
      subtitle: "Ingestion, retrieval, and evaluation on Azure infrastructure.",
      tag: "RAG",
      tagColor: "#00ff88",
      modules: [
        {
          id: "azure-rag-pipeline",
          title: "Ingestion & Retrieval Pipeline",
          subtitle: "Document parsing, chunking, and AI Search",
          status: "default",
          duration: "12h",
          subtopics: ["Document parsing (Azure Doc Intelligence)","Chunking strategies","Azure AI Search (Hybrid retrieval)","Semantic reranking"],
          videos: [],
          files: [],
          links: [{ title: "Azure AI Search Document Recovery", url: "https://learn.microsoft.com/azure/search/search-what-is-azure-search" }],
          overview: "Build highly effective Retrieval-Augmented Generation systems using Azure-native services and best practices."
        },
        {
          id: "azure-rag-eval-tools",
          title: "RAG Evaluation & Azure Tools",
          subtitle: "Metrics and evaluation frameworks",
          status: "locked",
          duration: "10h",
          subtopics: ["Evaluation (Recall@K, MRR, nDCG)","Answer correctness (LLM-judge)","RAGAS & DeepEval frameworks"],
          videos: [],
          files: [],
          links: [{ title: "Azure AI Search Evaluation", url: "https://learn.microsoft.com/azure/search/search-performance-analysis" }],
          overview: "Learn to measure the performance of your RAG systems and leverage powerful Azure evaluation tools."
        }
      ]
    },
    {
      id: "azure-agentic-foundations",
      title: "Agentic AI Foundations",
      subtitle: "Core agent concepts and memory in Azure.",
      tag: "AGENTS",
      tagColor: "#a855f7",
      modules: [
        {
          id: "azure-agent-core",
          title: "Core Agent Concepts",
          subtitle: "ReAct loop, planning, and memory",
          status: "default",
          duration: "10h",
          subtopics: ["Perceive-Reason-Act loop","Planning vs Reactive","Short-term (context) vs Long-term (vector) memory"],
          videos: [],
          files: [],
          links: [{ title: "Azure OpenAI Assistants API", url: "https://learn.microsoft.com/azure/ai-services/openai/how-to/assistant" }],
          overview: "Discover the fundamental patterns for building autonomous AI agents that can solve complex tasks on Azure."
        },
        {
          id: "azure-agent-frameworks",
          title: "Agent Frameworks",
          subtitle: "LangChain, LangGraph, and AutoGen",
          status: "locked",
          duration: "15h",
          subtopics: ["LangChain Agents","LangGraph state machines","AutoGen (Microsoft) role-based agents"],
          videos: [],
          files: [],
          links: [{ title: "AutoGen GitHub", url: "https://github.com/microsoft/autogen" }],
          overview: "Explore the leading frameworks for building sophisticated multi-agent systems and complex AI workflows."
        }
      ]
    },
    {
      id: "azure-ai-foundry",
      title: "Azure AI Foundry",
      subtitle: "Managed platform for hosting, routing, and orchestrating agents.",
      tag: "FOUNDRY",
      tagColor: "#0078d4",
      modules: [
        {
          id: "azure-foundry-arch",
          title: "Architecture & Orchestration",
          subtitle: "Project workspace, model hosting, and tool management",
          status: "default",
          duration: "12h",
          subtopics: ["Project workspace & RBAC","Model hosting & routing","Tool management (OpenAPI tools)","Multi-agent orchestration"],
          videos: [],
          files: [],
          links: [{ title: "Azure AI Foundry Overview", url: "https://learn.microsoft.com/azure/ai-foundry/" }],
          overview: "Master the managed platform for enterprise-grade agent orchestration on Azure."
        },
        {
          id: "azure-foundry-safety",
          title: "Guardrails & Content Safety",
          subtitle: "Azure AI Content Safety and monitoring",
          status: "locked",
          duration: "12h",
          subtopics: ["Azure AI Content Safety","Jailbreak detection (Prompt Shield)","Groundedness detection","Prompt flow tracing"],
          videos: [],
          files: [],
          links: [{ title: "Azure AI Content Safety Documentation", url: "https://learn.microsoft.com/azure/ai-services/content-safety/overview" }],
          overview: "Implement robust security and safety policies for your production-grade agents using Azure AI Foundry."
        }
      ]
    },
    {
      id: "azure-semantic-kernel",
      title: "Semantic Kernel",
      subtitle: "Microsoft's central orchestrator for models, plugins, and memory.",
      tag: "SK",
      tagColor: "#ec4899",
      modules: [
        {
          id: "azure-sk-core",
          title: "Core Architecture & Plugins",
          subtitle: "Kernel, Semantic functions, and Native functions",
          status: "default",
          duration: "12h",
          subtopics: ["Kernel orchestrator","Plugins (Skills)","Semantic vs Native functions","Function pipeline"],
          videos: [],
          files: [],
          links: [{ title: "Semantic Kernel Documentation", url: "https://learn.microsoft.com/semantic-kernel/overview/" }],
          overview: "Learn to build complex AI workflows using Microsoft's Semantic Kernel framework."
        },
        {
          id: "azure-sk-planner",
          title: "Planner & Workflow",
          subtitle: "Task decomposition and multi-step reasoning",
          status: "locked",
          duration: "12h",
          subtopics: ["Planner (Sequential, Handlebars)","Plan validation","Workflow orchestration","Retry & Error handling"],
          videos: [],
          files: [],
          links: [{ title: "Semantic Kernel Planners", url: "https://learn.microsoft.com/semantic-kernel/agents/planners/overview" }],
          overview: "Master the art of autonomous task decomposition and workflow execution with Semantic Kernel planners."
        }
      ]
    },
    {
      id: "azure-eval-metrics",
      title: "Evaluation, Accuracy & Metrics",
      subtitle: "Offline and online evaluation for Azure-based agents.",
      tag: "EVALUATION",
      tagColor: "#10b981",
      modules: [
        {
          id: "azure-eval-foundations",
          title: "Core Evaluation Concepts",
          subtitle: "Ground truth, Golden sets, and LLM-as-judge",
          status: "default",
          duration: "10h",
          subtopics: ["Ground truth vs Golden sets","Offline vs Online evaluation","LLM-as-judge calibration"],
          videos: [],
          files: [],
          links: [{ title: "Azure AI Foundry Evaluation", url: "https://learn.microsoft.com/azure/ai-foundry/how-to/evaluate-generative-ai-app" }],
          overview: "Learn the rigorous evaluation methodologies required to build reliable and accurate AI systems on Azure."
        },
        {
          id: "azure-agent-metrics",
          title: "Agent & RAG Metrics",
          subtitle: "Task success, tool accuracy, and RAGAS",
          status: "locked",
          duration: "12h",
          subtopics: ["Task success rate","Tool-call accuracy","RAGAS (faithfulness, relevancy)","MLflow experiment tracking"],
          videos: [],
          files: [],
          links: [{ title: "Azure RAG Evaluation Guide", url: "https://learn.microsoft.com/azure/search/search-performance-analysis" }],
          overview: "Master the specific metrics and frameworks used to evaluate complex agentic behaviors and RAG pipelines on Azure."
        }
      ]
    }
  ]
};
