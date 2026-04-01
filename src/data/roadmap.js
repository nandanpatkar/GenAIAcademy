import { DSA_PATH } from "./dsa_path";
import { AICXM_AWS_PATH } from "./aicxm_aws_path";
import { AICXM_AZURE_PATH } from "./aicxm_azure_path";
import { AICXM_DATABRICKS_PATH } from "./aicxm_databricks_path";

export const PATHS = {
  dsa: DSA_PATH,
  aicxm_aws: AICXM_AWS_PATH,
  aicxm_azure: AICXM_AZURE_PATH,
  aicxm_databricks: AICXM_DATABRICKS_PATH,
  ds: {
    id: "ds",
    label: "Data Science",
    color: "#00ff88",
    dimColor: "#00cc66",
    bgColor: "rgba(0,255,136,0.08)",
    borderColor: "rgba(0,255,136,0.3)",
    audience: "Beginners",
    description: "Master classical Data Science from Python to production ML pipelines",
    estimatedHours: "300+ hours",
    nodes: [
      {
        id: "python",
        title: "Python Basics",
        subtitle: "Core syntax, data structures, and algorithms. Foundations for data science.",
        tag: "READY TO START",
        tagColor: "#00ff88",
        modules: [
          {
            id: "py-syntax",
            title: "Python Syntax & OOP",
            subtitle: "Variables, functions, classes, and object-oriented programming",
            status: "complete",
            duration: "8h",
            subtopics: ["Variables & Types","Control Flow","Functions","Classes & OOP","Decorators","Generators","List Comprehensions","Exception Handling"],
            videos: [
              { title: "Python for Data Science — Full Course", channel: "Krish Naik", duration: "2h 15m", views: "1.2M" },
              { title: "OOP in Python — Complete Tutorial", channel: "Krish Naik", duration: "1h 08m", views: "890K" },
              { title: "Python Advanced Concepts", channel: "Krish Naik", duration: "55m", views: "670K" },
            ],
            files: [
              { name: "Python_Cheatsheet.pdf", size: "1.2 MB", type: "pdf" },
              { name: "OOP_Notes.docx", size: "890 KB", type: "doc" },
            ],
            links: [
              { title: "Python Official Docs", url: "docs.python.org" },
              { title: "Real Python Tutorials", url: "realpython.com" },
            ],
            overview: "Python is the primary language for data science and AI. This module covers all foundational Python concepts you need before moving to data analysis and machine learning."
          },
          {
            id: "py-numpy",
            title: "NumPy & Pandas",
            subtitle: "Data manipulation, arrays, dataframes and analysis",
            status: "in_progress",
            duration: "10h",
            subtopics: ["NumPy Arrays","Array Operations","Broadcasting","Pandas Series","DataFrames","Data Cleaning","GroupBy","Merging & Joining","Time Series"],
            videos: [
              { title: "NumPy for Data Science — Full Course", channel: "Krish Naik", duration: "1h 45m", views: "980K" },
              { title: "Pandas DataFrames Tutorial", channel: "Krish Naik", duration: "2h 05m", views: "1.1M" },
              { title: "Advanced Data Analysis Techniques", channel: "Krish Naik", duration: "1h 20m", views: "540K" },
            ],
            files: [
              { name: "NumPy_Pandas_CheatSheet.pdf", size: "2.3 MB", type: "pdf" },
              { name: "Data_Manipulation_Exercises.ipynb", size: "450 KB", type: "ipynb" },
            ],
            links: [
              { title: "NumPy Documentation", url: "numpy.org/doc" },
              { title: "Pandas Documentation", url: "pandas.pydata.org" },
            ],
            overview: "NumPy and Pandas are the core libraries for numerical computing and data manipulation in Python. Master these to work efficiently with any dataset."
          },
          {
            id: "py-viz",
            title: "Matplotlib & Visualization",
            subtitle: "Charts, graphs and visual storytelling with data",
            status: "locked",
            duration: "6h",
            subtopics: ["Matplotlib Basics","Subplots","Seaborn","Plotly Interactive","Data Storytelling"],
            videos: [
              { title: "Data Visualization with Matplotlib", channel: "Krish Naik", duration: "1h 10m", views: "760K" },
              { title: "Seaborn for Statistical Plots", channel: "Krish Naik", duration: "55m", views: "430K" },
            ],
            files: [{ name: "Visualization_Guide.pdf", size: "1.8 MB", type: "pdf" }],
            links: [{ title: "Matplotlib Gallery", url: "matplotlib.org/gallery" }],
            overview: "Data visualization is key to communicating insights. Learn to create compelling charts and dashboards using Python's leading visualization libraries."
          },
          {
            id: "py-fileio",
            title: "File I/O & Exceptions",
            subtitle: "Reading/writing files, error handling patterns",
            status: "locked",
            duration: "4h",
            subtopics: ["File Reading/Writing","CSV/JSON/XML","Context Managers","Try/Except","Custom Exceptions","Logging"],
            videos: [
              { title: "File Handling in Python", channel: "Krish Naik", duration: "45m", views: "320K" },
            ],
            files: [],
            links: [],
            overview: "Production code requires robust file handling and error management. This module covers all patterns needed for reliable data pipelines."
          },
        ]
      },
      {
        id: "stats",
        title: "Statistics & Math",
        subtitle: "Probability, distributions, hypothesis testing and linear algebra fundamentals.",
        tag: "CORE MODULE",
        tagColor: "#3b82f6",
        modules: [
          {
            id: "stats-desc",
            title: "Descriptive Statistics",
            subtitle: "Mean, median, variance, distributions and summary stats",
            status: "default",
            duration: "8h",
            subtopics: ["Mean/Median/Mode","Variance & Std Dev","Normal Distribution","Skewness & Kurtosis","Percentiles","Box Plots","Correlation"],
            videos: [
              { title: "Statistics for Data Science — Complete", channel: "Krish Naik", duration: "2h 30m", views: "1.5M" },
              { title: "Probability Theory Explained", channel: "Krish Naik", duration: "1h 15m", views: "870K" },
            ],
            files: [{ name: "Statistics_Notes.pdf", size: "3.1 MB", type: "pdf" }],
            links: [{ title: "Khan Academy Statistics", url: "khanacademy.org/statistics" }],
            overview: "Statistics underpins all of data science. This module builds your mathematical intuition for data analysis, model evaluation, and experimental design."
          },
          {
            id: "stats-inf",
            title: "Inferential Statistics",
            subtitle: "Hypothesis testing, p-values, confidence intervals",
            status: "locked",
            duration: "10h",
            subtopics: ["Hypothesis Testing","p-Values","t-Tests","ANOVA","Chi-Square","Confidence Intervals","A/B Testing"],
            videos: [
              { title: "Hypothesis Testing Tutorial", channel: "Krish Naik", duration: "1h 40m", views: "650K" },
              { title: "A/B Testing for Data Scientists", channel: "Krish Naik", duration: "55m", views: "420K" },
            ],
            files: [],
            links: [],
            overview: "Inferential statistics lets you draw conclusions from data samples. Critical for A/B testing, model evaluation and research."
          },
          {
            id: "stats-linalg",
            title: "Linear Algebra",
            subtitle: "Vectors, matrices, eigenvalues for ML",
            status: "locked",
            duration: "12h",
            subtopics: ["Vectors & Matrices","Matrix Multiplication","Eigenvalues","SVD","PCA Math","Dot Products","Projections"],
            videos: [
              { title: "Linear Algebra for ML", channel: "Krish Naik", duration: "2h 00m", views: "780K" },
            ],
            files: [],
            links: [{ title: "3Blue1Brown Linear Algebra", url: "youtube.com/3blue1brown" }],
            overview: "Linear algebra is the language of machine learning. Every neural network, dimensionality reduction, and optimization algorithm relies on these concepts."
          },
        ]
      },
      {
        id: "eda",
        title: "EDA & Feature Engineering",
        subtitle: "Exploratory data analysis, feature creation and data cleaning with Pandas and Matplotlib.",
        tag: "DOWNLOAD STEP",
        tagColor: "#f59e0b",
        modules: [
          {
            id: "eda-explore",
            title: "Exploratory Data Analysis",
            subtitle: "Profiling datasets, finding patterns and outliers",
            status: "default",
            duration: "10h",
            subtopics: ["Data Profiling","Missing Values","Outlier Detection","Univariate Analysis","Bivariate Analysis","Correlation Heatmaps","Distribution Plots"],
            videos: [
              { title: "EDA Complete Tutorial", channel: "Krish Naik", duration: "2h 20m", views: "1.1M" },
              { title: "Feature Engineering Masterclass", channel: "Krish Naik", duration: "1h 50m", views: "890K" },
            ],
            files: [{ name: "EDA_Template.ipynb", size: "780 KB", type: "ipynb" }],
            links: [],
            overview: "EDA is the most important step in any data science project. You will learn to understand your data before applying any models."
          },
          {
            id: "eda-feature",
            title: "Feature Engineering",
            subtitle: "Creating, selecting and transforming features",
            status: "locked",
            duration: "8h",
            subtopics: ["Feature Creation","Encoding Categoricals","Scaling & Normalization","Feature Selection","Dimensionality Reduction","PCA","Target Encoding"],
            videos: [
              { title: "Feature Engineering for ML", channel: "Krish Naik", duration: "1h 30m", views: "670K" },
            ],
            files: [],
            links: [],
            overview: "Feature engineering is often the difference between a mediocre and great model. Learn the techniques used by top Kaggle competitors."
          },
        ]
      },
      {
        id: "sql",
        title: "SQL & NoSQL Databases",
        subtitle: "Relational querying and executing at scale for large data pipelines.",
        tag: "DATA LAYER",
        tagColor: "#8b5cf6",
        modules: [
          {
            id: "sql-basics",
            title: "SQL Fundamentals",
            subtitle: "SELECT, JOIN, GROUP BY, subqueries",
            status: "default",
            duration: "12h",
            subtopics: ["SELECT & WHERE","JOINs","GROUP BY","Subqueries","Window Functions","CTEs","Indexes","Query Optimization"],
            videos: [
              { title: "SQL for Data Science — Full Course", channel: "Krish Naik", duration: "3h 00m", views: "2.1M" },
              { title: "Advanced SQL Techniques", channel: "Krish Naik", duration: "1h 45m", views: "980K" },
            ],
            files: [{ name: "SQL_Practice_Exercises.pdf", size: "2.4 MB", type: "pdf" }],
            links: [{ title: "SQLBolt Interactive Lessons", url: "sqlbolt.com" }],
            overview: "SQL is the universal language of data. Every data scientist must be proficient in querying relational databases to extract and transform data."
          },
          {
            id: "sql-nosql",
            title: "NoSQL & MongoDB",
            subtitle: "Document databases, aggregation pipelines",
            status: "locked",
            duration: "8h",
            subtopics: ["Document Model","CRUD Operations","Aggregation Pipeline","Indexes","Schema Design","MongoDB Atlas","Vector DBs Intro"],
            videos: [
              { title: "MongoDB for Data Scientists", channel: "Krish Naik", duration: "1h 20m", views: "450K" },
            ],
            files: [],
            links: [],
            overview: "NoSQL databases are essential for handling unstructured data in modern AI applications, especially for vector storage and retrieval."
          },
        ]
      },
      {
        id: "ml",
        title: "Machine Learning",
        subtitle: "Supervised and unsupervised learning, cross-validation, and metrics.",
        tag: "PRIMARY OBJECTIVE",
        tagColor: "#00ff88",
        modules: [
          {
            id: "ml-supervised",
            title: "Supervised Learning",
            subtitle: "Regression, classification, tree-based models",
            status: "default",
            duration: "20h",
            subtopics: ["Linear Regression","Logistic Regression","Decision Trees","Random Forest","XGBoost","SVM","KNN","Naive Bayes","Cross-Validation","Hyperparameter Tuning"],
            videos: [
              { title: "Machine Learning Complete Course", channel: "Krish Naik", duration: "5h 30m", views: "3.2M" },
              { title: "XGBoost & Ensemble Methods", channel: "Krish Naik", duration: "2h 00m", views: "1.4M" },
              { title: "Model Evaluation Metrics", channel: "Krish Naik", duration: "1h 10m", views: "890K" },
            ],
            files: [
              { name: "ML_Algorithms_Cheatsheet.pdf", size: "4.2 MB", type: "pdf" },
              { name: "Sklearn_Templates.ipynb", size: "1.1 MB", type: "ipynb" },
            ],
            links: [
              { title: "Scikit-learn Documentation", url: "scikit-learn.org" },
              { title: "Kaggle ML Courses", url: "kaggle.com/learn" },
            ],
            overview: "Machine learning is the core of data science. This module covers all major supervised learning algorithms with hands-on implementation using scikit-learn."
          },
          {
            id: "ml-unsupervised",
            title: "Unsupervised Learning",
            subtitle: "Clustering, dimensionality reduction, anomaly detection",
            status: "locked",
            duration: "12h",
            subtopics: ["K-Means","DBSCAN","Hierarchical Clustering","PCA","t-SNE","UMAP","Anomaly Detection","Association Rules"],
            videos: [
              { title: "Unsupervised Learning Tutorial", channel: "Krish Naik", duration: "2h 00m", views: "780K" },
            ],
            files: [],
            links: [],
            overview: "Unsupervised learning lets you discover hidden patterns in unlabeled data — critical for customer segmentation, recommendation systems and anomaly detection."
          },
          {
            id: "ml-mlops",
            title: "MLOps Basics",
            subtitle: "MLflow, experiment tracking, model registry",
            status: "locked",
            duration: "10h",
            subtopics: ["MLflow Tracking","Experiment Management","Model Registry","DVC","Data Versioning","Model Serving","Monitoring Drift"],
            videos: [
              { title: "MLOps with MLflow", channel: "Krish Naik", duration: "1h 40m", views: "560K" },
            ],
            files: [],
            links: [{ title: "MLflow Documentation", url: "mlflow.org" }],
            overview: "MLOps is essential for taking models from notebooks to production. Learn experiment tracking, versioning, and deployment pipelines."
          },
        ]
      },
      {
        id: "dl",
        title: "Deep Learning",
        subtitle: "Neural networks, CNNs, RNNs, and optimisation techniques for DL models.",
        tag: "ADVANCED MODULE",
        tagColor: "#ec4899",
        modules: [
          {
            id: "dl-ann",
            title: "Neural Networks Fundamentals",
            subtitle: "Perceptrons, backprop, activation functions",
            status: "default",
            duration: "15h",
            subtopics: ["Perceptrons","Backpropagation","Activation Functions","Optimizers","Batch Norm","Dropout","Weight Init","Loss Functions"],
            videos: [
              { title: "Deep Learning Complete Course", channel: "Krish Naik", duration: "4h 30m", views: "2.8M" },
              { title: "Backpropagation Explained", channel: "Krish Naik", duration: "1h 20m", views: "1.1M" },
            ],
            files: [{ name: "DL_Notes_Complete.pdf", size: "5.4 MB", type: "pdf" }],
            links: [{ title: "fast.ai Deep Learning", url: "fast.ai" }],
            overview: "Deep learning has revolutionized AI. This module builds your understanding from first principles — every concept is explained mathematically and implemented from scratch."
          },
          {
            id: "dl-cnn",
            title: "CNNs & Computer Vision",
            subtitle: "Convolutional networks, ResNet, object detection",
            status: "locked",
            duration: "18h",
            subtopics: ["Convolution Ops","Pooling","VGG/ResNet/EfficientNet","Transfer Learning","Object Detection","YOLO","Semantic Segmentation","Image Augmentation"],
            videos: [
              { title: "CNN Complete Tutorial", channel: "Krish Naik", duration: "3h 15m", views: "1.9M" },
              { title: "Transfer Learning with PyTorch", channel: "Krish Naik", duration: "1h 45m", views: "870K" },
            ],
            files: [],
            links: [],
            overview: "Computer vision powers autonomous vehicles, medical imaging, and facial recognition. Master CNNs and transfer learning to build production vision systems."
          },
          {
            id: "dl-rnn",
            title: "RNNs, LSTMs & Transformers",
            subtitle: "Sequential models and attention mechanism",
            status: "locked",
            duration: "20h",
            subtopics: ["RNN Architecture","LSTM/GRU","Seq2Seq","Attention Mechanism","Transformer Architecture","BERT Pretraining","GPT Architecture","Positional Encoding"],
            videos: [
              { title: "RNN & LSTM Tutorial", channel: "Krish Naik", duration: "2h 30m", views: "1.3M" },
              { title: "Transformer Architecture Explained", channel: "Krish Naik", duration: "2h 00m", views: "2.1M" },
            ],
            files: [],
            links: [{ title: "The Illustrated Transformer", url: "jalammar.github.io" }],
            overview: "Transformers are the backbone of modern AI — GPT, BERT, and all modern LLMs are built on this architecture. This module gives you complete mastery."
          },
        ]
      },
      {
        id: "nlp",
        title: "NLP Fundamentals",
        subtitle: "Tokenization, embeddings, and NLP for text modelling.",
        tag: "SPECIALIZATION",
        tagColor: "#06b6d4",
        modules: [
          {
            id: "nlp-basics",
            title: "Classical NLP",
            subtitle: "TF-IDF, word embeddings, text preprocessing",
            status: "default",
            duration: "12h",
            subtopics: ["Text Preprocessing","Tokenization","Stemming/Lemmatization","Bag of Words","TF-IDF","Word2Vec","GloVe","FastText","Sentence Embeddings"],
            videos: [
              { title: "NLP Zero to Hero", channel: "Krish Naik", duration: "3h 45m", views: "1.7M" },
              { title: "Word Embeddings Explained", channel: "Krish Naik", duration: "1h 10m", views: "890K" },
            ],
            files: [{ name: "NLP_Fundamentals.pdf", size: "2.8 MB", type: "pdf" }],
            links: [{ title: "HuggingFace NLP Course", url: "huggingface.co/course" }],
            overview: "NLP is the gateway to GenAI. This module covers classical NLP techniques that form the foundation for understanding modern LLMs."
          },
          {
            id: "nlp-bert",
            title: "BERT & Modern NLP",
            subtitle: "Fine-tuning transformers for NLP tasks",
            status: "locked",
            duration: "15h",
            subtopics: ["BERT Architecture","Fine-tuning","Named Entity Recognition","Sentiment Analysis","Text Classification","Question Answering","Summarization"],
            videos: [
              { title: "BERT Fine-tuning Tutorial", channel: "Krish Naik", duration: "2h 20m", views: "1.1M" },
            ],
            files: [],
            links: [],
            overview: "BERT and its variants power most modern NLP applications. Learn to fine-tune these models for your specific tasks using HuggingFace Transformers."
          },
        ]
      },
      {
        id: "deploy",
        title: "Model Deployment",
        subtitle: "Containerisation, Docker, and cloud infrastructure for production ML.",
        tag: "COMPLETION MILESTONE",
        tagColor: "#00ff88",
        modules: [
          {
            id: "deploy-flask",
            title: "Flask & FastAPI",
            subtitle: "Building REST APIs for ML models",
            status: "default",
            duration: "10h",
            subtopics: ["Flask Basics","FastAPI","REST API Design","Model Serialization","Pickle/Joblib","API Authentication","Rate Limiting","Swagger Docs"],
            videos: [
              { title: "Deploy ML Model with Flask", channel: "Krish Naik", duration: "1h 30m", views: "980K" },
              { title: "FastAPI for ML Engineers", channel: "Krish Naik", duration: "1h 15m", views: "670K" },
            ],
            files: [],
            links: [],
            overview: "Deploying ML models as APIs is the most common production pattern. Learn Flask and FastAPI to expose your models as scalable web services."
          },
          {
            id: "deploy-docker",
            title: "Docker & Kubernetes",
            subtitle: "Containerization and orchestration for ML",
            status: "locked",
            duration: "12h",
            subtopics: ["Docker Basics","Dockerfile","Docker Compose","Container Registry","Kubernetes Basics","Pods & Services","Helm Charts","CI/CD Pipelines"],
            videos: [
              { title: "Docker for Data Scientists", channel: "Krish Naik", duration: "2h 00m", views: "1.2M" },
              { title: "Kubernetes ML Deployment", channel: "Krish Naik", duration: "1h 45m", views: "560K" },
            ],
            files: [{ name: "Docker_Cheatsheet.pdf", size: "1.5 MB", type: "pdf" }],
            links: [{ title: "Docker Official Docs", url: "docs.docker.com" }],
            overview: "Docker and Kubernetes are the industry standard for deploying ML models at scale. This module covers containerization from basics to production orchestration."
          },
          {
            id: "deploy-cloud",
            title: "Cloud Deployment (AWS/GCP/Azure)",
            subtitle: "Deploy to cloud with EC2, Lambda, and managed services",
            status: "locked",
            duration: "15h",
            subtopics: ["AWS EC2","AWS Lambda","S3 Storage","SageMaker","GCP Vertex AI","Azure ML","CI/CD with GitHub Actions","Monitoring & Logging"],
            videos: [
              { title: "AWS ML Deployment Tutorial", channel: "Krish Naik", duration: "2h 30m", views: "870K" },
              { title: "MLOps on GCP", channel: "Krish Naik", duration: "1h 50m", views: "430K" },
            ],
            files: [],
            links: [{ title: "AWS SageMaker Docs", url: "aws.amazon.com/sagemaker" }],
            overview: "Cloud deployment is the final step in the ML lifecycle. Learn to deploy, monitor, and scale your models on AWS, GCP and Azure."
          },
        ]
      },
    ]
  },

  genai: {
    id: "genai",
    label: "Gen AI",
    color: "#3b82f6",
    dimColor: "#1d4ed8",
    bgColor: "rgba(59,130,246,0.08)",
    borderColor: "rgba(59,130,246,0.3)",
    audience: "Developers",
    description: "Master the complete GenAI stack — LLMs, RAG, Fine-tuning, Agents and LLMOps",
    estimatedHours: "250+ hours",
    nodes: [
      {
        id: "llm",
        title: "LLM Fundamentals",
        subtitle: "Architecture, tokenization, and the inner workings of large language models.",
        tag: "READY TO START",
        tagColor: "#3b82f6",
        modules: [
          {
            id: "llm-arch",
            title: "Transformer Architecture",
            subtitle: "Attention, positional encoding, encoder-decoder",
            status: "default",
            duration: "10h",
            subtopics: ["Self-Attention","Multi-Head Attention","Positional Encoding","Feed-Forward Layers","Layer Normalization","Encoder vs Decoder","GPT Architecture","BERT Architecture"],
            videos: [
              { title: "LLM Architecture Deep Dive", channel: "Krish Naik", duration: "2h 30m", views: "1.8M" },
              { title: "How GPT Works — Explained", channel: "Krish Naik", duration: "1h 15m", views: "2.3M" },
            ],
            files: [{ name: "Transformer_Architecture.pdf", size: "3.2 MB", type: "pdf" }],
            links: [{ title: "Attention is All You Need", url: "arxiv.org/abs/1706.03762" }],
            overview: "Understanding transformer architecture is foundational to everything in GenAI. This module demystifies how GPT, BERT, and all modern LLMs actually work under the hood."
          },
          {
            id: "llm-tokens",
            title: "Tokenization & Embeddings",
            subtitle: "BPE, vocabulary, embedding spaces",
            status: "locked",
            duration: "6h",
            subtopics: ["BPE Tokenization","WordPiece","SentencePiece","Token Limits","Embedding Spaces","Semantic Similarity","Dimensionality"],
            videos: [
              { title: "Tokenization Explained", channel: "Krish Naik", duration: "55m", views: "760K" },
            ],
            files: [],
            links: [],
            overview: "Tokenization determines how text is converted to numbers that LLMs process. Understanding tokens is critical for prompt design and cost management."
          },
          {
            id: "llm-inference",
            title: "LLM Inference & APIs",
            subtitle: "OpenAI, Anthropic, Gemini API usage",
            status: "locked",
            duration: "8h",
            subtopics: ["OpenAI API","Anthropic Claude API","Google Gemini","Temperature & Top-p","System Prompts","Token Counting","Cost Optimization","Batch Inference"],
            videos: [
              { title: "OpenAI API Complete Guide", channel: "Krish Naik", duration: "1h 30m", views: "1.1M" },
            ],
            files: [],
            links: [{ title: "OpenAI API Docs", url: "platform.openai.com/docs" }],
            overview: "Learn to call LLM APIs effectively, manage costs, and configure inference parameters for different use cases."
          },
        ]
      },
      {
        id: "prompt",
        title: "Prompt Engineering",
        subtitle: "Effective prompting, chain-of-thought, few-shot, and system prompt design.",
        tag: "CORE SKILL",
        tagColor: "#3b82f6",
        modules: [
          {
            id: "prompt-basics",
            title: "Prompting Fundamentals",
            subtitle: "Zero-shot, few-shot, role prompting",
            status: "default",
            duration: "8h",
            subtopics: ["Zero-shot Prompting","Few-shot Examples","Role Prompting","Instruction Tuning","Output Formatting","Temperature Control","System vs User Prompts","Prompt Templates"],
            videos: [
              { title: "Prompt Engineering Complete Guide", channel: "Krish Naik", duration: "2h 00m", views: "1.5M" },
              { title: "Advanced Prompting Techniques", channel: "Krish Naik", duration: "1h 20m", views: "980K" },
            ],
            files: [{ name: "Prompt_Engineering_Playbook.pdf", size: "2.1 MB", type: "pdf" }],
            links: [
              { title: "Anthropic Prompt Engineering", url: "docs.anthropic.com/prompting" },
              { title: "OpenAI Prompt Guide", url: "platform.openai.com/docs/guides/prompt-engineering" },
            ],
            overview: "Prompt engineering is the fastest way to improve LLM output quality without any training. Master these techniques to get production-grade results from any LLM."
          },
          {
            id: "prompt-cot",
            title: "Chain-of-Thought & ReAct",
            subtitle: "Reasoning, planning and tool-use prompting",
            status: "locked",
            duration: "10h",
            subtopics: ["Chain-of-Thought","Self-Consistency","Tree of Thoughts","ReAct Pattern","Scratchpad Prompting","Structured Output","JSON Mode","Function Calling Prompts"],
            videos: [
              { title: "Chain of Thought Prompting", channel: "Krish Naik", duration: "1h 10m", views: "870K" },
            ],
            files: [],
            links: [],
            overview: "Advanced prompting techniques like CoT dramatically improve LLM reasoning. These patterns are the foundation for building reliable AI agents."
          },
        ]
      },
      {
        id: "langchain",
        title: "LangChain & LLM Chains",
        subtitle: "Orchestrating LLM workflows, memory, tools and complex chains.",
        tag: "FRAMEWORK",
        tagColor: "#f59e0b",
        modules: [
          {
            id: "lc-basics",
            title: "LangChain Fundamentals",
            subtitle: "LCEL, chains, prompts and models",
            status: "default",
            duration: "12h",
            subtopics: ["LCEL Syntax","PromptTemplates","LLM Wrappers","Output Parsers","Sequential Chains","Parallel Chains","RunnablePassthrough","Callbacks & Tracing"],
            videos: [
              { title: "LangChain Complete Tutorial 2024", channel: "Krish Naik", duration: "3h 30m", views: "2.1M" },
              { title: "LangChain LCEL Explained", channel: "Krish Naik", duration: "1h 45m", views: "980K" },
            ],
            files: [{ name: "LangChain_Cheatsheet.pdf", size: "1.8 MB", type: "pdf" }],
            links: [{ title: "LangChain Documentation", url: "docs.langchain.com" }],
            overview: "LangChain is the most popular framework for building LLM applications. Learn to compose powerful chains, integrate tools, and build production-ready AI pipelines."
          },
          {
            id: "lc-memory",
            title: "Memory & Conversation",
            subtitle: "ConversationBufferMemory, summary, vector memory",
            status: "locked",
            duration: "8h",
            subtopics: ["Buffer Memory","Summary Memory","Entity Memory","Vector Memory","Conversation History","Memory Persistence","Custom Memory","Multi-turn Conversations"],
            videos: [
              { title: "LangChain Memory Systems", channel: "Krish Naik", duration: "1h 20m", views: "670K" },
            ],
            files: [],
            links: [],
            overview: "Memory is what turns a stateless LLM into a conversational AI. This module covers all LangChain memory types and when to use each."
          },
          {
            id: "lc-tools",
            title: "Tool Use & Function Calling",
            subtitle: "Empowering agents to interact with external APIs",
            status: "locked",
            duration: "10h",
            subtopics: ["Function Calling","Tool Definition","Web Search Tool","Calculator Tool","SQL Tool","Custom Tools","Tool Selection","Error Handling"],
            videos: [
              { title: "LangChain Tools & Function Calling", channel: "Krish Naik", duration: "1h 45m", views: "780K" },
            ],
            files: [],
            links: [],
            overview: "Tools extend LLMs to interact with the real world. Learn to build custom tools and connect LLMs to APIs, databases, and external services."
          },
        ]
      },
      {
        id: "vectordb",
        title: "Vector Databases",
        subtitle: "Embeddings storage, similarity search with Pinecone, Chroma and FAISS.",
        tag: "DATA LAYER",
        tagColor: "#8b5cf6",
        modules: [
          {
            id: "vdb-concepts",
            title: "Vector DB Concepts",
            subtitle: "Embeddings, similarity search, indexing",
            status: "default",
            duration: "8h",
            subtopics: ["What are Embeddings","Cosine Similarity","Dot Product","ANN Algorithms","HNSW Index","IVF Index","Metadata Filtering","Hybrid Search"],
            videos: [
              { title: "Vector Databases Explained", channel: "Krish Naik", duration: "1h 30m", views: "1.2M" },
              { title: "Embeddings Deep Dive", channel: "Krish Naik", duration: "1h 00m", views: "890K" },
            ],
            files: [{ name: "VectorDB_Comparison.pdf", size: "2.4 MB", type: "pdf" }],
            links: [
              { title: "Pinecone Documentation", url: "docs.pinecone.io" },
              { title: "ChromaDB Docs", url: "docs.trychroma.com" },
            ],
            overview: "Vector databases are the memory layer of modern AI applications. Understanding how they work is essential for building RAG systems and semantic search."
          },
          {
            id: "vdb-pinecone",
            title: "Pinecone & Chroma",
            subtitle: "Managed and local vector store implementation",
            status: "locked",
            duration: "10h",
            subtopics: ["Pinecone Setup","Index Management","Upserting Vectors","Querying","Chroma Local DB","Persistent Storage","Collections","LangChain Integration"],
            videos: [
              { title: "Pinecone Complete Tutorial", channel: "Krish Naik", duration: "1h 45m", views: "760K" },
              { title: "ChromaDB with LangChain", channel: "Krish Naik", duration: "1h 10m", views: "540K" },
            ],
            files: [],
            links: [],
            overview: "Get hands-on with the two most popular vector stores — Pinecone for production and Chroma for local development."
          },
        ]
      },
      {
        id: "rag",
        title: "RAG Systems",
        subtitle: "Retrieval-Augmented Generation — build production Q&A and document AI systems.",
        tag: "KEY PROJECT",
        tagColor: "#00ff88",
        modules: [
          {
            id: "rag-basics",
            title: "RAG Fundamentals",
            subtitle: "Ingestion, retrieval and generation pipeline",
            status: "default",
            duration: "12h",
            subtopics: ["RAG Architecture","Document Loading","Text Splitting","Chunking Strategies","Embedding Models","Similarity Retrieval","Context Injection","Answer Generation"],
            videos: [
              { title: "RAG Pipeline Explained", channel: "Krish Naik", duration: "2h 15m", views: "1.8M" },
              { title: "Building RAG from Scratch", channel: "Krish Naik", duration: "2h 30m", views: "1.4M" },
            ],
            files: [
              { name: "RAG_Architecture_Guide.pdf", size: "3.1 MB", type: "pdf" },
              { name: "RAG_Project_Template.ipynb", size: "890 KB", type: "ipynb" },
            ],
            links: [
              { title: "LangChain RAG Tutorial", url: "python.langchain.com/docs/use_cases/question_answering" },
            ],
            overview: "RAG is the most widely deployed GenAI pattern in production. This module builds a complete RAG system from document ingestion to production-grade Q&A."
          },
          {
            id: "rag-advanced",
            title: "Advanced RAG",
            subtitle: "HyDE, re-ranking, multi-query, self-RAG",
            status: "locked",
            duration: "15h",
            subtopics: ["HyDE (Hypothetical Documents)","Multi-Query Retrieval","Contextual Compression","Re-ranking with Cohere","Self-RAG","CRAG","Recursive Retrieval","RAG Evaluation"],
            videos: [
              { title: "Advanced RAG Techniques", channel: "Krish Naik", duration: "2h 45m", views: "1.1M" },
              { title: "RAG Evaluation with RAGAS", channel: "Krish Naik", duration: "1h 20m", views: "670K" },
            ],
            files: [],
            links: [{ title: "RAGAS Evaluation Framework", url: "docs.ragas.io" }],
            overview: "Production RAG requires advanced retrieval strategies. This module covers the latest research techniques that dramatically improve accuracy and reliability."
          },
        ]
      },
      {
        id: "finetune",
        title: "Fine-Tuning LLMs",
        subtitle: "LoRA, QLoRA, PEFT methods and training on custom datasets.",
        tag: "ADVANCED",
        tagColor: "#ec4899",
        modules: [
          {
            id: "ft-basics",
            title: "Fine-Tuning Fundamentals",
            subtitle: "Full fine-tuning vs parameter efficient methods",
            status: "default",
            duration: "12h",
            subtopics: ["Why Fine-tune","Full Fine-tuning","PEFT Overview","LoRA","QLoRA","Adapter Layers","Dataset Preparation","Instruction Tuning","RLHF Basics"],
            videos: [
              { title: "Fine-Tuning LLMs Complete Guide", channel: "Krish Naik", duration: "3h 00m", views: "1.6M" },
              { title: "LoRA & QLoRA Explained", channel: "Krish Naik", duration: "1h 30m", views: "1.1M" },
            ],
            files: [{ name: "FineTuning_Playbook.pdf", size: "4.1 MB", type: "pdf" }],
            links: [{ title: "HuggingFace PEFT Library", url: "huggingface.co/docs/peft" }],
            overview: "Fine-tuning allows you to customize LLMs for your specific domain and task. Learn efficient training techniques that work even on consumer hardware."
          },
          {
            id: "ft-practice",
            title: "Fine-Tuning with Unsloth",
            subtitle: "Practical fine-tuning with Llama, Mistral, Gemma",
            status: "locked",
            duration: "15h",
            subtopics: ["Unsloth Setup","Llama-3 Fine-tuning","Mistral Fine-tuning","Gemma Fine-tuning","ORPO","DPO Training","Merging LoRA Weights","Pushing to HuggingFace"],
            videos: [
              { title: "Fine-tune Llama 3 with Unsloth", channel: "Krish Naik", duration: "2h 20m", views: "890K" },
            ],
            files: [],
            links: [{ title: "Unsloth GitHub", url: "github.com/unslothai/unsloth" }],
            overview: "Unsloth makes fine-tuning 2x faster and uses 50% less VRAM. This module walks through fine-tuning the latest open-source models step by step."
          },
        ]
      },
      {
        id: "llmops",
        title: "LLMOps & Evaluation",
        subtitle: "Production monitoring, guardrails, LangSmith and evaluation frameworks.",
        tag: "PRODUCTION",
        tagColor: "#f59e0b",
        modules: [
          {
            id: "ops-eval",
            title: "LLM Evaluation",
            subtitle: "BLEU, ROUGE, LLM-as-judge, RAGAS",
            status: "default",
            duration: "10h",
            subtopics: ["BLEU & ROUGE","Perplexity","LLM-as-Judge","G-Eval","RAGAS Framework","Faithfulness","Answer Relevancy","Context Precision","Hallucination Detection"],
            videos: [
              { title: "LLM Evaluation Frameworks", channel: "Krish Naik", duration: "1h 45m", views: "780K" },
            ],
            files: [],
            links: [{ title: "LangSmith Docs", url: "docs.smith.langchain.com" }],
            overview: "Evaluating LLM output quality is one of the hardest problems in production AI. This module covers all major evaluation frameworks and metrics."
          },
          {
            id: "ops-guardrails",
            title: "Guardrails & Safety",
            subtitle: "Content filtering, prompt injection defense",
            status: "locked",
            duration: "8h",
            subtopics: ["Guardrails AI","NeMo Guardrails","Prompt Injection Defense","PII Detection","Toxic Content Filtering","Output Validation","Constitutional AI","Red Teaming"],
            videos: [
              { title: "LLM Safety & Guardrails", channel: "Krish Naik", duration: "1h 20m", views: "560K" },
            ],
            files: [],
            links: [],
            overview: "Production LLM systems must be safe and reliable. Learn to implement comprehensive guardrails that prevent harmful outputs and prompt injection attacks."
          },
        ]
      },
      {
        id: "cloud",
        title: "Cloud Deployment",
        subtitle: "Deploy GenAI apps on AWS Bedrock, Azure OpenAI, and GCP Vertex AI.",
        tag: "COMPLETION MILESTONE",
        tagColor: "#00ff88",
        modules: [
          {
            id: "cloud-aws",
            title: "AWS Bedrock & Lambda",
            subtitle: "Serverless GenAI on AWS",
            status: "default",
            duration: "15h",
            subtopics: ["AWS Bedrock","Foundation Models on AWS","Lambda for GenAI","API Gateway","S3 for RAG","DynamoDB","CloudWatch Monitoring","Cost Management"],
            videos: [
              { title: "AWS GenAI Architecture", channel: "Krish Naik", duration: "2h 30m", views: "890K" },
              { title: "AWS Bedrock Tutorial", channel: "Krish Naik", duration: "1h 50m", views: "670K" },
            ],
            files: [],
            links: [{ title: "AWS Bedrock Docs", url: "aws.amazon.com/bedrock" }],
            overview: "AWS is the leading cloud platform for GenAI deployment. This module covers the complete serverless architecture for production LLM applications."
          },
          {
            id: "cloud-azure",
            title: "Azure OpenAI Service",
            subtitle: "Enterprise GenAI deployment on Azure",
            status: "locked",
            duration: "12h",
            subtopics: ["Azure OpenAI","Azure AI Studio","Responsible AI","Content Filters","Azure Functions","CosmosDB for Vectors","Application Insights","Azure DevOps CI/CD"],
            videos: [
              { title: "Azure OpenAI Complete Guide", channel: "Krish Naik", duration: "2h 00m", views: "560K" },
            ],
            files: [],
            links: [{ title: "Azure OpenAI Docs", url: "learn.microsoft.com/azure/ai-services/openai" }],
            overview: "Azure OpenAI provides enterprise-grade LLM deployment with compliance, security, and integration with the Microsoft ecosystem."
          },
        ]
      },
    ]
  },

  agentic: {
    id: "agentic",
    label: "Agentic AI",
    color: "#a855f7",
    dimColor: "#7e22ce",
    bgColor: "rgba(168,85,247,0.08)",
    borderColor: "rgba(168,85,247,0.3)",
    audience: "Advanced",
    description: "Build autonomous AI agents, multi-agent systems and production agentic workflows",
    estimatedHours: "200+ hours",
    nodes: [
      {
        id: "agent-basics",
        title: "AI Agents Architecture",
        subtitle: "ReAct pattern, planning, tool use, and agent design principles.",
        tag: "FOUNDATION",
        tagColor: "#a855f7",
        modules: [
          {
            id: "ag-react",
            title: "ReAct & Agent Patterns",
            subtitle: "Reasoning + Acting loop, planning agents",
            status: "default",
            duration: "10h",
            subtopics: ["ReAct Framework","Thought-Action-Observation","Planning Agents","Goal Decomposition","Tool Selection","Reflection","Self-Critique","Agent Memory"],
            videos: [
              { title: "AI Agents Architecture — Full Course", channel: "Krish Naik", duration: "2h 30m", views: "1.4M" },
              { title: "ReAct Pattern Explained", channel: "Krish Naik", duration: "1h 00m", views: "890K" },
            ],
            files: [{ name: "Agentic_AI_Patterns.pdf", size: "3.4 MB", type: "pdf" }],
            links: [{ title: "ReAct Paper — arXiv", url: "arxiv.org/abs/2210.03629" }],
            overview: "AI agents are the next frontier of AI applications. This module teaches the foundational patterns for building autonomous agents that can plan, reason, and act."
          },
          {
            id: "ag-tools",
            title: "Agent Tooling",
            subtitle: "Web search, code execution, file management tools",
            status: "locked",
            duration: "12h",
            subtopics: ["Tool Definition Patterns","Tavily Web Search","Code Interpreter","File System Tools","Database Tools","Email/Calendar Tools","Custom MCP Tools","Error Recovery"],
            videos: [
              { title: "Building AI Agent Tools", channel: "Krish Naik", duration: "1h 50m", views: "760K" },
            ],
            files: [],
            links: [{ title: "Tavily Search API", url: "tavily.com" }],
            overview: "Tools transform LLMs from text generators into capable agents. Learn to build robust tools with proper error handling and observability."
          },
        ]
      },
      {
        id: "langgraph",
        title: "LangGraph",
        subtitle: "Stateful, graph-based workflows with checkpointing and human-in-the-loop.",
        tag: "CORE FRAMEWORK",
        tagColor: "#a855f7",
        modules: [
          {
            id: "lg-basics",
            title: "LangGraph Fundamentals",
            subtitle: "Nodes, edges, state management",
            status: "default",
            duration: "15h",
            subtopics: ["Graph Structure","StateGraph","Nodes & Edges","TypedDict State","Conditional Edges","Entry & End Points","Checkpointing","Thread Management","Streaming"],
            videos: [
              { title: "LangGraph Complete Tutorial", channel: "Krish Naik", duration: "3h 30m", views: "1.1M" },
              { title: "Building Stateful Agents with LangGraph", channel: "Krish Naik", duration: "2h 00m", views: "870K" },
            ],
            files: [{ name: "LangGraph_Patterns.pdf", size: "2.8 MB", type: "pdf" }],
            links: [{ title: "LangGraph Documentation", url: "langchain-ai.github.io/langgraph" }],
            overview: "LangGraph brings the power of graph-based state machines to AI agents. This module teaches you to build reliable, stateful agents with proper checkpointing and recovery."
          },
          {
            id: "lg-hitl",
            title: "Human-in-the-Loop",
            subtitle: "Approval workflows, interrupts and breakpoints",
            status: "locked",
            duration: "10h",
            subtopics: ["Interrupt Before/After","Human Approval Steps","Dynamic Breakpoints","State Editing","Resume from Checkpoint","Time Travel Debugging","Audit Logging","HITL Patterns"],
            videos: [
              { title: "HITL with LangGraph", channel: "Krish Naik", duration: "1h 30m", views: "540K" },
            ],
            files: [],
            links: [],
            overview: "Human-in-the-loop is critical for production agents. Learn to build approval workflows that keep humans in control of consequential AI actions."
          },
        ]
      },
      {
        id: "multiagent",
        title: "Multi-Agent Systems",
        subtitle: "Supervisor-worker architectures, agent communication and collaboration.",
        tag: "ADVANCED",
        tagColor: "#ec4899",
        modules: [
          {
            id: "ma-supervisor",
            title: "Supervisor Architecture",
            subtitle: "Orchestrator and specialized worker agents",
            status: "default",
            duration: "15h",
            subtopics: ["Supervisor Pattern","Worker Agents","Task Routing","Agent Communication","Shared State","Parallel Execution","Error Propagation","Result Aggregation"],
            videos: [
              { title: "Multi-Agent Systems with LangGraph", channel: "Krish Naik", duration: "2h 45m", views: "980K" },
              { title: "Supervisor Agent Pattern", channel: "Krish Naik", duration: "1h 30m", views: "670K" },
            ],
            files: [],
            links: [],
            overview: "Multi-agent systems allow complex tasks to be broken down and handled by specialized agents. Learn the supervisor pattern used in production AI systems."
          },
          {
            id: "ma-collab",
            title: "Agent Collaboration",
            subtitle: "Peer-to-peer, hierarchical and ensemble agent patterns",
            status: "locked",
            duration: "12h",
            subtopics: ["Peer-to-Peer Communication","Hierarchical Teams","Ensemble Voting","Debate Pattern","Critic Agent","Revision Loop","Agent Memory Sharing","Cross-Agent Tooling"],
            videos: [
              { title: "Advanced Multi-Agent Patterns", channel: "Krish Naik", duration: "2h 00m", views: "560K" },
            ],
            files: [],
            links: [],
            overview: "Advanced agent collaboration patterns enable complex reasoning through debate, critique, and ensemble decision-making."
          },
        ]
      },
      {
        id: "frameworks",
        title: "Agent Frameworks",
        subtitle: "CrewAI, AutoGen, Phidata and LangFlow for rapid agent development.",
        tag: "TOOLING",
        tagColor: "#f59e0b",
        modules: [
          {
            id: "fw-crewai",
            title: "CrewAI",
            subtitle: "Role-based agent crews with tasks and workflows",
            status: "default",
            duration: "12h",
            subtopics: ["Crew Setup","Agent Roles","Tasks & Goals","Process Types","Tools Integration","Memory in CrewAI","Human Input","Crew Output","YAML Config"],
            videos: [
              { title: "CrewAI Complete Tutorial", channel: "Krish Naik", duration: "2h 20m", views: "1.2M" },
              { title: "Building AI Crews for Automation", channel: "Krish Naik", duration: "1h 30m", views: "780K" },
            ],
            files: [{ name: "CrewAI_Templates.pdf", size: "1.9 MB", type: "pdf" }],
            links: [{ title: "CrewAI Documentation", url: "docs.crewai.com" }],
            overview: "CrewAI simplifies multi-agent development with a role-based approach. Build crews of AI agents that collaborate to complete complex business workflows."
          },
          {
            id: "fw-autogen",
            title: "AutoGen & Phidata",
            subtitle: "Microsoft AutoGen and Phidata agent frameworks",
            status: "locked",
            duration: "10h",
            subtopics: ["AutoGen Setup","Conversable Agents","Group Chat","Code Execution","Phidata Agents","Phidata Storage","Phidata Knowledge","Framework Comparison"],
            videos: [
              { title: "Microsoft AutoGen Tutorial", channel: "Krish Naik", duration: "1h 45m", views: "890K" },
              { title: "Phidata Agentic Framework", channel: "Krish Naik", duration: "1h 20m", views: "560K" },
            ],
            files: [],
            links: [{ title: "AutoGen GitHub", url: "github.com/microsoft/autogen" }],
            overview: "AutoGen and Phidata offer different approaches to multi-agent systems. Learn both to choose the right framework for your use case."
          },
        ]
      },
      {
        id: "memory",
        title: "Memory & Context",
        subtitle: "Persistent long-term memory with Mem0, vector stores and checkpointing.",
        tag: "PERSISTENCE",
        tagColor: "#06b6d4",
        modules: [
          {
            id: "mem-basics",
            title: "Agent Memory Systems",
            subtitle: "Short-term, long-term, episodic and semantic memory",
            status: "default",
            duration: "12h",
            subtopics: ["Memory Types","Working Memory","Episodic Memory","Semantic Memory","Procedural Memory","Mem0 Library","LangChain Memory","Memory Consolidation","Forgetting Strategies"],
            videos: [
              { title: "AI Agent Memory Systems", channel: "Krish Naik", duration: "1h 45m", views: "670K" },
              { title: "Mem0 for Persistent AI Memory", channel: "Krish Naik", duration: "1h 10m", views: "430K" },
            ],
            files: [],
            links: [{ title: "Mem0 Documentation", url: "docs.mem0.ai" }],
            overview: "Memory is what transforms stateless LLM calls into intelligent agents that learn from experience. This module covers all memory architectures used in production agents."
          },
        ]
      },
      {
        id: "cloud-agent",
        title: "Agentic on Cloud",
        subtitle: "Deploy autonomous agents on AWS, GCP with proper orchestration and monitoring.",
        tag: "DEPLOYMENT",
        tagColor: "#f59e0b",
        modules: [
          {
            id: "ca-aws",
            title: "AWS Bedrock Agents",
            subtitle: "Managed agent infrastructure on AWS",
            status: "default",
            duration: "15h",
            subtopics: ["Bedrock Agents","Knowledge Bases","Action Groups","Lambda Functions","S3 Data Sources","OpenSearch Vector","Guardrails on Bedrock","Monitoring & Traces"],
            videos: [
              { title: "AWS Bedrock Agents Complete Guide", channel: "Krish Naik", duration: "2h 30m", views: "780K" },
            ],
            files: [],
            links: [{ title: "AWS Bedrock Agents Docs", url: "aws.amazon.com/bedrock/agents" }],
            overview: "AWS Bedrock Agents provides managed infrastructure for deploying production agents at scale with built-in RAG, guardrails, and monitoring."
          },
          {
            id: "ca-gcp",
            title: "GCP Vertex AI Agents",
            subtitle: "Agent Builder and ADK on Google Cloud",
            status: "locked",
            duration: "12h",
            subtopics: ["Vertex AI Agent Builder","Agent Development Kit","Dialogflow CX","Vertex AI Search","Grounding with Google","Cloud Run Deployment","BigQuery Integration","Monitoring"],
            videos: [
              { title: "GCP Vertex AI Agents", channel: "Krish Naik", duration: "1h 50m", views: "450K" },
            ],
            files: [],
            links: [{ title: "Vertex AI Agent Builder", url: "cloud.google.com/products/agent-builder" }],
            overview: "Google's Vertex AI platform offers powerful agent infrastructure with unique grounding capabilities using Google Search."
          },
        ]
      },
      {
        id: "prod-agent",
        title: "Production Agents",
        subtitle: "Monitoring, evaluation, safety and CI/CD for production agentic systems.",
        tag: "COMPLETION MILESTONE",
        tagColor: "#00ff88",
        modules: [
          {
            id: "pa-monitor",
            title: "Agent Monitoring & Observability",
            subtitle: "Tracing, logging and performance monitoring",
            status: "default",
            duration: "10h",
            subtopics: ["LangSmith Tracing","AgentOps","Prompt Monitoring","Token Usage","Latency Tracking","Cost per Run","Error Analysis","LangFuse","Arize Phoenix"],
            videos: [
              { title: "Monitoring AI Agents in Production", channel: "Krish Naik", duration: "1h 30m", views: "540K" },
            ],
            files: [],
            links: [{ title: "LangSmith Platform", url: "smith.langchain.com" }],
            overview: "Production agents require comprehensive monitoring to catch failures, track costs, and continuously improve reliability."
          },
          {
            id: "pa-cicd",
            title: "CI/CD for Agents",
            subtitle: "Testing, evaluation pipelines and automated deployment",
            status: "locked",
            duration: "12h",
            subtopics: ["Unit Testing Agents","Integration Testing","Evaluation Datasets","Regression Testing","GitHub Actions","Docker for Agents","Kubernetes Deployment","Blue-Green Deployment"],
            videos: [
              { title: "CI/CD Pipeline for AI Agents", channel: "Krish Naik", duration: "2h 00m", views: "430K" },
            ],
            files: [],
            links: [],
            overview: "Production-grade agents need reliable CI/CD pipelines. This module builds an end-to-end testing and deployment pipeline for AI agents."
          },
        ]
      },
    ]
  }
};
