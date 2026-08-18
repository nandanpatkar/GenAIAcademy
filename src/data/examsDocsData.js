// Auto-generated index of the AWS Machine Learning & AI certification notes.
//
// Source: https://github.com/artreimus/notes-aws-machine-learning @ 273d37e06b77
// 299 pages. Bodies live under public/exams/md/ and are fetched on
// demand by ExamsDocs; the corpus is small enough (~2 MB) to ship from public/
// rather than the docs CDN the LangChain and Strands archives use.
//
// Regenerate with `npm run build:exams` rather than hand-editing.

export const EXAMS_TOTAL_PAGES = 299;

export const EXAMS_CERTIFICATION = {
 "code": "MLA-C01",
 "name": "AWS Certified Machine Learning Engineer – Associate",
 "url": "https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/",
 "guide": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01.html"
};

export const EXAMS_DOMAINS = [
 {
  "id": "1",
  "label": "Data Preparation for Machine Learning",
  "short": "Data Preparation",
  "weight": 28,
  "slug": "00-exam-guide/domain-1-data-preparation",
  "tasks": [
   {
    "id": "1.1",
    "label": "Ingest and store data"
   },
   {
    "id": "1.2",
    "label": "Transform data and perform feature engineering"
   },
   {
    "id": "1.3",
    "label": "Ensure data integrity and prepare data for modeling"
   }
  ]
 },
 {
  "id": "2",
  "label": "ML Model Development",
  "short": "Model Development",
  "weight": 26,
  "slug": "00-exam-guide/domain-2-model-development",
  "tasks": [
   {
    "id": "2.1",
    "label": "Choose a modeling approach"
   },
   {
    "id": "2.2",
    "label": "Train and refine models"
   },
   {
    "id": "2.3",
    "label": "Analyze model performance"
   }
  ]
 },
 {
  "id": "3",
  "label": "Deployment and Orchestration of ML Workflows",
  "short": "Deployment & Orchestration",
  "weight": 22,
  "slug": "00-exam-guide/domain-3-deployment-orchestration",
  "tasks": [
   {
    "id": "3.1",
    "label": "Select deployment infrastructure based on requirements"
   },
   {
    "id": "3.2",
    "label": "Create and script infrastructure based on requirements"
   },
   {
    "id": "3.3",
    "label": "Automate and orchestrate ML workflows"
   }
  ]
 },
 {
  "id": "4",
  "label": "ML Solution Monitoring, Maintenance, and Security",
  "short": "Monitoring & Security",
  "weight": 24,
  "slug": "00-exam-guide/domain-4-monitoring-security",
  "tasks": [
   {
    "id": "4.1",
    "label": "Monitor model performance and data quality"
   },
   {
    "id": "4.2",
    "label": "Monitor infrastructure and costs"
   },
   {
    "id": "4.3",
    "label": "Secure AWS resources"
   }
  ]
 }
];

export const EXAMS_STATUS_LABELS = {
 "reviewed": "Reviewed",
 "draft": "Draft",
 "supplemental": "Supplemental",
 "legacy": "Legacy",
 "out-of-scope": "Out of scope"
};

export const EXAMS_TRACKS = [
 {
  "id": "exam_guide",
  "label": "Exam Guide",
  "short": "Exam Guide",
  "blurb": "The MLA-C01 exam shape, its four domains, the in-scope service list, and a study roadmap.",
  "accent": "#EC7211",
  "icon": "BadgeCheck",
  "tabs": [
   {
    "section": "",
    "tab": "MLA-C01",
    "items": [
     {
      "slug": "00-exam-guide/exam-overview",
      "title": "MLA-C01 Exam Overview"
     },
     {
      "slug": "00-exam-guide/domain-1-data-preparation",
      "title": "Domain 1: Data Preparation For Machine Learning"
     },
     {
      "slug": "00-exam-guide/domain-2-model-development",
      "title": "Domain 2: ML Model Development"
     },
     {
      "slug": "00-exam-guide/domain-3-deployment-orchestration",
      "title": "Domain 3: Deployment And Orchestration Of ML Workflows"
     },
     {
      "slug": "00-exam-guide/domain-4-monitoring-security",
      "title": "Domain 4: ML Solution Monitoring, Maintenance, And Security"
     },
     {
      "slug": "00-exam-guide/in-scope-services",
      "title": "MLA-C01 In-Scope Services"
     },
     {
      "slug": "00-exam-guide/out-of-scope-services",
      "title": "MLA-C01 Out-Of-Scope Services"
     },
     {
      "slug": "00-exam-guide/study-roadmap",
      "title": "MLA-C01 Study Roadmap"
     }
    ]
   },
   {
    "section": "",
    "tab": "About this vault",
    "items": [
     {
      "slug": "README",
      "title": "AWS Machine Learning and AI Notes"
     },
     {
      "slug": "NOTE_TEMPLATE",
      "title": "Note Template"
     },
     {
      "slug": "PLAN_NOTES_IMPROVEMENT",
      "title": "Plan: Improve AWS MLA-C01 Notes"
     }
    ]
   }
  ]
 },
 {
  "id": "exam_ai_services",
  "label": "AI Services",
  "short": "AI Services",
  "blurb": "The managed AWS AI services: language, vision, search, personalization, forecasting, and anomaly detection.",
  "accent": "#E7157B",
  "icon": "Sparkles",
  "tabs": [
   {
    "section": "",
    "tab": "AI services",
    "items": [
     {
      "group": "Language & speech",
      "expanded": false,
      "items": [
       {
        "slug": "01-ai-services/comprehend",
        "title": "Amazon Comprehend"
       },
       {
        "slug": "01-ai-services/comprehend-medical",
        "title": "Amazon Comprehend Medical"
       },
       {
        "slug": "01-ai-services/translate",
        "title": "Amazon Translate"
       },
       {
        "slug": "01-ai-services/transcribe",
        "title": "Amazon Transcribe"
       },
       {
        "slug": "01-ai-services/polly",
        "title": "Amazon Polly"
       },
       {
        "slug": "01-ai-services/lex",
        "title": "Amazon Lex"
       }
      ]
     },
     {
      "group": "Vision & documents",
      "expanded": false,
      "items": [
       {
        "slug": "01-ai-services/rekognition",
        "title": "Amazon Rekognition"
       },
       {
        "slug": "01-ai-services/textract",
        "title": "Amazon Textract"
       }
      ]
     },
     {
      "group": "Search & personalization",
      "expanded": false,
      "items": [
       {
        "slug": "01-ai-services/kendra",
        "title": "Amazon Kendra"
       },
       {
        "slug": "01-ai-services/opensearch",
        "title": "OpenSearch"
       },
       {
        "slug": "01-ai-services/personalize",
        "title": "Amazon Personalize"
       }
      ]
     },
     {
      "group": "Forecasting & anomaly detection",
      "expanded": false,
      "items": [
       {
        "slug": "01-ai-services/forecast",
        "title": "Amazon Forecast"
       },
       {
        "slug": "01-ai-services/fraud-detector",
        "title": "Amazon Fraud Detector"
       },
       {
        "slug": "01-ai-services/lookout-for-equipment",
        "title": "Amazon Lookout For Equipment"
       },
       {
        "slug": "01-ai-services/lookout-for-metrics",
        "title": "Amazon Lookout For Metrics"
       },
       {
        "slug": "01-ai-services/lookout-for-vision",
        "title": "Amazon Lookout For Vision"
       }
      ]
     },
     {
      "group": "Industry & assistants",
      "expanded": false,
      "items": [
       {
        "slug": "01-ai-services/healthlake",
        "title": "AWS HealthLake"
       },
       {
        "slug": "01-ai-services/amazon-q",
        "title": "Amazon Q"
       }
      ]
     }
    ]
   }
  ]
 },
 {
  "id": "exam_data",
  "label": "Data Engineering",
  "short": "Data",
  "blurb": "Ingestion, streaming, storage, databases, transformation, data quality, and the SQL you need on top of them.",
  "accent": "#8C4FFF",
  "icon": "DatabaseZap",
  "tabs": [
   {
    "section": "",
    "tab": "Ingestion & storage",
    "items": [
     {
      "group": "Data foundations",
      "expanded": false,
      "items": [
       {
        "slug": "02-data-ingestion-and-storage/types-of-data",
        "title": "Types Of Data"
       },
       {
        "slug": "02-data-ingestion-and-storage/properties-of-data",
        "title": "Properties Of Data"
       },
       {
        "slug": "02-data-ingestion-and-storage/data-sources-and-data-formats",
        "title": "Data Sources And Data Formats"
       },
       {
        "slug": "02-data-ingestion-and-storage/data-lake-lakehouses-warehouses",
        "title": "Data Lakes, Lakehouses, And Warehouses"
       },
       {
        "slug": "02-data-ingestion-and-storage/data-mesh",
        "title": "Data Mesh"
       },
       {
        "slug": "02-data-ingestion-and-storage/amazon-datazone",
        "title": "Amazon DataZone"
       },
       {
        "slug": "02-data-ingestion-and-storage/etl-and-elt",
        "title": "ETL And ELT"
       },
       {
        "slug": "02-data-ingestion-and-storage/data-pipelines",
        "title": "AWS Data Pipeline"
       },
       {
        "slug": "02-data-ingestion-and-storage/feature-engineering",
        "title": "Feature Engineering Techniques"
       },
       {
        "slug": "02-data-ingestion-and-storage/glue-databrew",
        "title": "AWS Glue DataBrew"
       }
      ]
     },
     {
      "group": "Streaming ingestion",
      "expanded": false,
      "items": [
       {
        "slug": "02-data-ingestion-and-storage/kinesis-data-streams",
        "title": "Kinesis Data Streams"
       },
       {
        "slug": "02-data-ingestion-and-storage/kinesis-data-firehose",
        "title": "Kinesis Data Firehose"
       },
       {
        "slug": "02-data-ingestion-and-storage/kinesis-data-stream-vs-firehose",
        "title": "Kinesis Data Stream Vs Firehose"
       },
       {
        "slug": "02-data-ingestion-and-storage/kinesis-data-analytics",
        "title": "Kinesis Data Analytics"
       },
       {
        "slug": "02-data-ingestion-and-storage/kinesis-client-library",
        "title": "Kinesis Client Library (KCL)"
       },
       {
        "slug": "02-data-ingestion-and-storage/kinesis-producer-library",
        "title": "Kinesis Producer Library"
       },
       {
        "slug": "02-data-ingestion-and-storage/kinesis-video-streams",
        "title": "Amazon Kinesis Video Streams"
       },
       {
        "slug": "02-data-ingestion-and-storage/managed-streaming-for-apache-kafka",
        "title": "Amazon Managed Streaming for Apache Kafka (Amazon MSK)"
       },
       {
        "slug": "02-data-ingestion-and-storage/managed-service-for-apache-flink",
        "title": "Amazon Managed Service For Apache Flink"
       }
      ]
     },
     {
      "group": "Storage & transfer",
      "expanded": false,
      "items": [
       {
        "slug": "02-data-ingestion-and-storage/s3",
        "title": "S3"
       },
       {
        "slug": "02-data-ingestion-and-storage/s3-glacier",
        "title": "Amazon S3 Glacier Storage Classes"
       },
       {
        "slug": "02-data-ingestion-and-storage/elastic-block-storage",
        "title": "Amazon Elastic Block Store (EBS)"
       },
       {
        "slug": "02-data-ingestion-and-storage/elastic-file-system",
        "title": "Amazon Elastic File System (EFS)"
       },
       {
        "slug": "02-data-ingestion-and-storage/fsx",
        "title": "Amazon FSx"
       },
       {
        "slug": "02-data-ingestion-and-storage/storage-gateway",
        "title": "AWS Storage Gateway"
       },
       {
        "slug": "02-data-ingestion-and-storage/datasync",
        "title": "AWS DataSync"
       },
       {
        "slug": "02-data-ingestion-and-storage/database-migration-service",
        "title": "Database Migration Service"
       },
       {
        "slug": "02-data-ingestion-and-storage/ec2-instance-types",
        "title": "Amazon EC2 Instance Types Overview"
       }
      ]
     },
     {
      "group": "Databases",
      "expanded": false,
      "items": [
       {
        "slug": "02-data-ingestion-and-storage/rds",
        "title": "Amazon RDS (Relational Database Service)"
       },
       {
        "slug": "02-data-ingestion-and-storage/aurora",
        "title": "Amazon Aurora"
       },
       {
        "slug": "02-data-ingestion-and-storage/dynamodb",
        "title": "Amazon DynamoDB"
       },
       {
        "slug": "02-data-ingestion-and-storage/documentdb",
        "title": "Amazon DocumentDB (with MongoDB compatibility)"
       },
       {
        "slug": "02-data-ingestion-and-storage/keyspaces",
        "title": "Amazon Keyspaces (for Apache Cassandra)"
       },
       {
        "slug": "02-data-ingestion-and-storage/neptune",
        "title": "Amazon Neptune"
       },
       {
        "slug": "02-data-ingestion-and-storage/timestream",
        "title": "Amazon Timestream"
       },
       {
        "slug": "02-data-ingestion-and-storage/qldb",
        "title": "Amazon QLDB"
       },
       {
        "slug": "02-data-ingestion-and-storage/elasticache",
        "title": "Amazon ElastiCache (Redis / Memcached)"
       },
       {
        "slug": "02-data-ingestion-and-storage/sql-databases",
        "title": "SQL Databases in AWS"
       },
       {
        "slug": "02-data-ingestion-and-storage/no-sql-databases",
        "title": "NoSQL Databases in AWS"
       },
       {
        "slug": "02-data-ingestion-and-storage/jdbc-odbc",
        "title": "JDBC and ODBC in AWS Machine Learning Workflows"
       }
      ]
     },
     {
      "group": "Warehouse & analytics",
      "expanded": false,
      "items": [
       {
        "slug": "02-data-ingestion-and-storage/redshift",
        "title": "Amazon Redshift, Redshift ML, Redshift Serverless, and Redshift Data API"
       },
       {
        "slug": "02-data-ingestion-and-storage/redshift-spectrum",
        "title": "Redshift Spectrum"
       },
       {
        "slug": "02-data-ingestion-and-storage/opensearch-layers",
        "title": "OpenSearch vector search: layers and tradeoffs"
       },
       {
        "slug": "02-data-ingestion-and-storage/quicksight",
        "title": "Amazon Quick Sight"
       }
      ]
     },
     {
      "group": "Python toolkit",
      "expanded": false,
      "items": [
       {
        "slug": "02-data-ingestion-and-storage/pandas",
        "title": "Pandas for AWS Machine Learning"
       },
       {
        "slug": "02-data-ingestion-and-storage/scikit-learn",
        "title": "Scikit-learn for Machine Learning"
       },
       {
        "slug": "02-data-ingestion-and-storage/matplotlib-seaborn",
        "title": "Matplotlib and Seaborn for Data Visualization"
       }
      ]
     }
    ]
   },
   {
    "section": "",
    "tab": "Transformation & quality",
    "items": [
     {
      "group": "Transformation engines",
      "expanded": false,
      "items": [
       {
        "slug": "03-data-transformation-integrity-and-feature-engineering/glue",
        "title": "Glue"
       },
       {
        "slug": "03-data-transformation-integrity-and-feature-engineering/spark",
        "title": "What is Apache Spark?"
       },
       {
        "slug": "03-data-transformation-integrity-and-feature-engineering/spark-integrations",
        "title": "Apache Spark & AWS Integration Notes"
       },
       {
        "slug": "03-data-transformation-integrity-and-feature-engineering/elastic-map-reduce",
        "title": "Elastic Map Reduce"
       },
       {
        "slug": "03-data-transformation-integrity-and-feature-engineering/hadoop",
        "title": "What is Apache Hadoop?"
       },
       {
        "slug": "03-data-transformation-integrity-and-feature-engineering/hive",
        "title": "What is Apache Hive?"
       },
       {
        "slug": "03-data-transformation-integrity-and-feature-engineering/presto",
        "title": "What is Presto?"
       },
       {
        "slug": "03-data-transformation-integrity-and-feature-engineering/athena",
        "title": "Amazon Athena"
       }
      ]
     },
     {
      "group": "Quality & feature engineering",
      "expanded": false,
      "items": [
       {
        "slug": "03-data-transformation-integrity-and-feature-engineering/data-quality-validation",
        "title": "Data Quality Validation"
       },
       {
        "slug": "03-data-transformation-integrity-and-feature-engineering/glue-data-quality",
        "title": "AWS Glue Data Quality"
       },
       {
        "slug": "03-data-transformation-integrity-and-feature-engineering/feature-engineering",
        "title": "Feature Engineering"
       },
       {
        "slug": "03-data-transformation-integrity-and-feature-engineering/encoding-techniques",
        "title": "Encoding Techniques"
       },
       {
        "slug": "03-data-transformation-integrity-and-feature-engineering/tf-idf",
        "title": "Tf Idf"
       },
       {
        "slug": "03-data-transformation-integrity-and-feature-engineering/l1-and-l2-regularization",
        "title": "L1 and L2 Regularization: Quick Reference & Practical Guide"
       }
      ]
     }
    ]
   },
   {
    "section": "",
    "tab": "SQL",
    "items": [
     {
      "slug": "12-sql/sql-fundamentals",
      "title": "SQL fundamentals"
     },
     {
      "slug": "12-sql/sql-analytics-patterns",
      "title": "SQL analytics patterns"
     },
     {
      "slug": "12-sql/sql-performance-tuning",
      "title": "SQL performance tuning"
     },
     {
      "slug": "12-sql/sql-on-aws",
      "title": "SQL on AWS"
     },
     {
      "slug": "12-sql/sql-quick-reference",
      "title": "SQL quick reference"
     }
    ]
   }
  ]
 },
 {
  "id": "exam_modeling",
  "label": "Modeling & Algorithms",
  "short": "Modeling",
  "blurb": "Training, tuning, evaluation, the SageMaker built-in algorithms, and the ML fundamentals underneath them.",
  "accent": "#7AA116",
  "icon": "Sigma",
  "tabs": [
   {
    "section": "",
    "tab": "Training & evaluation",
    "items": [
     {
      "group": "Training & tuning",
      "expanded": false,
      "items": [
       {
        "slug": "04-model-training-tuning-and-evaluation/model-hyperparameters",
        "title": "Model Hyperparameters in Machine Learning"
       },
       {
        "slug": "04-model-training-tuning-and-evaluation/automatic-model-tuning-and-hyperparameter-tuning",
        "title": "📗 **AWS Automatic Model Tuning (AMT) & Hyperparameter Tuning**"
       },
       {
        "slug": "04-model-training-tuning-and-evaluation/model-baselines-and-convergence",
        "title": "Model Baselines And Convergence"
       },
       {
        "slug": "04-model-training-tuning-and-evaluation/training-compiler",
        "title": "Training Compiler"
       },
       {
        "slug": "04-model-training-tuning-and-evaluation/efa-and-mics",
        "title": "Elastic Fabric Adapter (EFA) & MiCS (Minimize Communication Scale)"
       },
       {
        "slug": "04-model-training-tuning-and-evaluation/tensorboard-integration-in-sagemaker",
        "title": "Tensorboard Integration In SageMaker"
       },
       {
        "slug": "04-model-training-tuning-and-evaluation/transfer-learning",
        "title": "Transfer Learning"
       }
      ]
     },
     {
      "group": "Neural networks",
      "expanded": false,
      "items": [
       {
        "slug": "04-model-training-tuning-and-evaluation/neural-networks",
        "title": "Neural Networks"
       },
       {
        "slug": "04-model-training-tuning-and-evaluation/activation-functions",
        "title": "Activation Functions"
       },
       {
        "slug": "04-model-training-tuning-and-evaluation/convolutional-neural-networks",
        "title": "Convolutional Neural Networks (CNNs)"
       },
       {
        "slug": "04-model-training-tuning-and-evaluation/recurrent-neural-networks",
        "title": "Recurrent Neural Networks (RNNs)\\*\\*"
       }
      ]
     },
     {
      "group": "Evaluation",
      "expanded": false,
      "items": [
       {
        "slug": "04-model-training-tuning-and-evaluation/model-metrics",
        "title": "Model Metrics"
       },
       {
        "slug": "04-model-training-tuning-and-evaluation/model-selection-decision-guide",
        "title": "Model Selection Decision Guide"
       }
      ]
     }
    ]
   },
   {
    "section": "",
    "tab": "Built-in algorithms",
    "items": [
     {
      "group": "Choosing an algorithm",
      "expanded": false,
      "items": [
       {
        "slug": "06-sagemaker-built-in-algorithms/sagemaker-built-in-algorithms-cheat-sheet",
        "title": "SageMaker Built-In Algorithms Cheat Sheet"
       },
       {
        "slug": "06-sagemaker-built-in-algorithms/supervised-and-unsupervised-models",
        "title": "Supervised And Unsupervised Models"
       }
      ]
     },
     {
      "group": "Tabular & regression",
      "expanded": false,
      "items": [
       {
        "slug": "06-sagemaker-built-in-algorithms/linear-learner",
        "title": "Linear Learner"
       },
       {
        "slug": "06-sagemaker-built-in-algorithms/xgboost",
        "title": "Xgboost"
       },
       {
        "slug": "06-sagemaker-built-in-algorithms/light-gbm",
        "title": "Light Gbm"
       },
       {
        "slug": "06-sagemaker-built-in-algorithms/catboost",
        "title": "CatBoost"
       },
       {
        "slug": "06-sagemaker-built-in-algorithms/autogluon-tabular",
        "title": "AutoGluon-Tabular"
       },
       {
        "slug": "06-sagemaker-built-in-algorithms/tabtransformer",
        "title": "TabTransformer"
       },
       {
        "slug": "06-sagemaker-built-in-algorithms/factorization-machines",
        "title": "Factorization Machines"
       },
       {
        "slug": "06-sagemaker-built-in-algorithms/k-nearest-neighbor",
        "title": "K Nearest Neighbor"
       }
      ]
     },
     {
      "group": "Text & NLP",
      "expanded": false,
      "items": [
       {
        "slug": "06-sagemaker-built-in-algorithms/blazing-text",
        "title": "Blazing Text"
       },
       {
        "slug": "06-sagemaker-built-in-algorithms/text-classification-tensorflow",
        "title": "Text Classification - TensorFlow"
       },
       {
        "slug": "06-sagemaker-built-in-algorithms/seq2seq",
        "title": "Seq2seq"
       },
       {
        "slug": "06-sagemaker-built-in-algorithms/latent-dirichlet-allocation",
        "title": "Latent Dirichlet Allocation"
       },
       {
        "slug": "06-sagemaker-built-in-algorithms/neural-topic-model",
        "title": "Neural Topic Model"
       },
       {
        "slug": "06-sagemaker-built-in-algorithms/object2vec",
        "title": "Object2vec"
       }
      ]
     },
     {
      "group": "Computer vision",
      "expanded": false,
      "items": [
       {
        "slug": "06-sagemaker-built-in-algorithms/image-classification",
        "title": "Image Classification"
       },
       {
        "slug": "06-sagemaker-built-in-algorithms/image-classification-tensorflow",
        "title": "Image Classification - TensorFlow"
       },
       {
        "slug": "06-sagemaker-built-in-algorithms/object-detection",
        "title": "Object Detection"
       },
       {
        "slug": "06-sagemaker-built-in-algorithms/object-detection-tensorflow",
        "title": "Object Detection - TensorFlow"
       },
       {
        "slug": "06-sagemaker-built-in-algorithms/semantic-segmentation",
        "title": "Semantic Segmentation"
       }
      ]
     },
     {
      "group": "Time series & anomaly",
      "expanded": false,
      "items": [
       {
        "slug": "06-sagemaker-built-in-algorithms/deep-ar",
        "title": "Deep Ar"
       },
       {
        "slug": "06-sagemaker-built-in-algorithms/random-cut-forest",
        "title": "Random Cut Forest"
       },
       {
        "slug": "06-sagemaker-built-in-algorithms/ip-insights",
        "title": "Ip Insights"
       }
      ]
     },
     {
      "group": "Clustering & dimensionality",
      "expanded": false,
      "items": [
       {
        "slug": "06-sagemaker-built-in-algorithms/k-means",
        "title": "K Means"
       },
       {
        "slug": "06-sagemaker-built-in-algorithms/principal-component-analysis",
        "title": "Principal Component Analysis"
       }
      ]
     }
    ]
   },
   {
    "section": "",
    "tab": "ML fundamentals",
    "items": [
     {
      "group": "Learning fundamentals",
      "expanded": false,
      "items": [
       {
        "slug": "common/linear-and-logistic-regression",
        "title": "Linear and Logistic Regression"
       },
       {
        "slug": "common/ensembling-learning-methods",
        "title": "Ensembling Learning Methods"
       },
       {
        "slug": "common/boosting",
        "title": "Types of Boosting"
       },
       {
        "slug": "common/convolution",
        "title": "Convolution"
       },
       {
        "slug": "common/probability-distribution",
        "title": "Probability Distributions"
       }
      ]
     },
     {
      "group": "Fit & generalization",
      "expanded": false,
      "items": [
       {
        "slug": "common/bias-and-variance",
        "title": "Bias And Variance"
       },
       {
        "slug": "common/preventing-overfitting",
        "title": "Preventing Overfitting"
       },
       {
        "slug": "common/preventing-underfitting",
        "title": "Preventing Underfitting"
       },
       {
        "slug": "common/hyperband",
        "title": "Hyperband"
       }
      ]
     },
     {
      "group": "Data characteristics",
      "expanded": false,
      "items": [
       {
        "slug": "common/sparse-data",
        "title": "Sparse Data"
       },
       {
        "slug": "common/dense-data",
        "title": "Dense Data"
       },
       {
        "slug": "common/gaussian-like-data",
        "title": "Gaussian Like Data"
       },
       {
        "slug": "common/normalization-standardization",
        "title": "Normalization and Standardization"
       },
       {
        "slug": "common/shuffling-data",
        "title": "Shuffling Data in Machine Learning"
       },
       {
        "slug": "common/sub-sampling",
        "title": "Sub Sampling"
       },
       {
        "slug": "common/class-imbalance-and-resampling",
        "title": "Class Imbalance And Resampling"
       }
      ]
     },
     {
      "group": "Fairness & interpretability",
      "expanded": false,
      "items": [
       {
        "slug": "common/bias-metrics-ci-dpl",
        "title": "Bias Metrics: CI And DPL"
       },
       {
        "slug": "common/conditional-demographic-disparity",
        "title": "Conditional Demographic Disparity (CDD)"
       },
       {
        "slug": "common/interpretability-techniques",
        "title": "Interpretability Techniques in Machine Learning"
       },
       {
        "slug": "common/concept-drift",
        "title": "Concept Drift in Machine Learning"
       }
      ]
     }
    ]
   }
  ]
 },
 {
  "id": "exam_sagemaker",
  "label": "SageMaker AI",
  "short": "SageMaker",
  "blurb": "Amazon SageMaker AI end to end: Studio, features, training, deployment, and model governance.",
  "accent": "#01A88D",
  "icon": "Boxes",
  "tabs": [
   {
    "section": "",
    "tab": "SageMaker AI",
    "items": [
     {
      "group": "Studio & workspaces",
      "expanded": false,
      "items": [
       {
        "slug": "05-sagemaker-ai/sagemaker-ai-current-capabilities",
        "title": "SageMaker AI Current Capabilities"
       },
       {
        "slug": "05-sagemaker-ai/sagemaker-studio",
        "title": "Amazon SageMaker Studio"
       },
       {
        "slug": "05-sagemaker-ai/sagemaker-domains",
        "title": "SageMaker Domains"
       },
       {
        "slug": "05-sagemaker-ai/sagemaker-canvas",
        "title": "Amazon SageMaker Canvas"
       },
       {
        "slug": "05-sagemaker-ai/sagemaker-jumpstart",
        "title": "SageMaker JumpStart"
       },
       {
        "slug": "05-sagemaker-ai/sagemaker-projects",
        "title": "SageMaker Projects"
       }
      ]
     },
     {
      "group": "Data & features",
      "expanded": false,
      "items": [
       {
        "slug": "05-sagemaker-ai/sagemaker-data-wrangler",
        "title": "Amazon SageMaker Data Wrangler"
       },
       {
        "slug": "05-sagemaker-ai/sagemaker-feature-store",
        "title": "SageMaker Feature Store"
       },
       {
        "slug": "05-sagemaker-ai/sagemaker-input-modes",
        "title": "SageMaker Input Modes"
       },
       {
        "slug": "05-sagemaker-ai/spark-with-sagemaker",
        "title": "Spark Integration with SageMaker"
       }
      ]
     },
     {
      "group": "Training & tuning",
      "expanded": false,
      "items": [
       {
        "slug": "05-sagemaker-ai/sagemaker-training-techniques",
        "title": "Advanced Amazon SageMaker Training Techniques"
       },
       {
        "slug": "05-sagemaker-ai/sagemaker-training-compiler",
        "title": "SageMaker Training Compiler"
       },
       {
        "slug": "05-sagemaker-ai/sagemaker-model-parallelism",
        "title": "Distributed Training in SageMaker"
       },
       {
        "slug": "05-sagemaker-ai/sagemaker-spot-training",
        "title": "SageMaker Spot Training"
       },
       {
        "slug": "05-sagemaker-ai/sagemaker-auto-pilot-or-automl",
        "title": "SageMaker Auto Pilot Or Automl"
       },
       {
        "slug": "05-sagemaker-ai/sagemaker-debugger",
        "title": "SageMaker Debugger"
       },
       {
        "slug": "05-sagemaker-ai/sagemaker-experiments",
        "title": "SageMaker Experiments"
       }
      ]
     },
     {
      "group": "Deployment & inference",
      "expanded": false,
      "items": [
       {
        "slug": "05-sagemaker-ai/sagemaker-deployment-modes",
        "title": "SageMaker Deployment Modes"
       },
       {
        "slug": "05-sagemaker-ai/sagemaker-model-endpoints",
        "title": "SageMaker Model Endpoints"
       },
       {
        "slug": "05-sagemaker-ai/sagemaker-elastic-inference",
        "title": "SageMaker Elastic Inference"
       },
       {
        "slug": "05-sagemaker-ai/sagemaker-neo",
        "title": "SageMaker Neo"
       },
       {
        "slug": "05-sagemaker-ai/sagemaker-pipelines",
        "title": "SageMaker Pipelines"
       }
      ]
     },
     {
      "group": "Governance & monitoring",
      "expanded": false,
      "items": [
       {
        "slug": "05-sagemaker-ai/sagemaker-model-registry",
        "title": "SageMaker Model Registry"
       },
       {
        "slug": "05-sagemaker-ai/sagemaker-model-cards",
        "title": "SageMaker Model Cards"
       },
       {
        "slug": "05-sagemaker-ai/sagemaker-model-monitor",
        "title": "SageMaker Model Monitor"
       },
       {
        "slug": "05-sagemaker-ai/sagemaker-clarify",
        "title": "SageMaker Clarify"
       },
       {
        "slug": "05-sagemaker-ai/sagemaker-linear-tracking",
        "title": "SageMaker Linear Learner Tracking"
       }
      ]
     }
    ]
   }
  ]
 },
 {
  "id": "exam_genai",
  "label": "Generative AI",
  "short": "Gen AI",
  "blurb": "Transformer fundamentals, Amazon Bedrock, knowledge bases, guardrails, agents, and agentic patterns.",
  "accent": "#4D27AA",
  "icon": "Bot",
  "tabs": [
   {
    "section": "",
    "tab": "Model fundamentals",
    "items": [
     {
      "slug": "07-generative-ai-model-fundamentals/common-llm-terms",
      "title": "Common LLM Terms and Model Parameters"
     },
     {
      "slug": "07-generative-ai-model-fundamentals/transformer-architecture",
      "title": "Transformer Architecture"
     },
     {
      "slug": "07-generative-ai-model-fundamentals/self-attention-mechanism",
      "title": "Self Attention Mechanism"
     },
     {
      "slug": "07-generative-ai-model-fundamentals/decoder-encoder-models",
      "title": "Encoder-Decoder Models"
     },
     {
      "slug": "07-generative-ai-model-fundamentals/generative-pretrained-transformers",
      "title": "Generative Pretrained Transformers"
     },
     {
      "slug": "07-generative-ai-model-fundamentals/application-of-transformers",
      "title": "Application Of Transformers"
     },
     {
      "slug": "07-generative-ai-model-fundamentals/foundational-models-in-aws",
      "title": "Foundational Models In AWS"
     },
     {
      "slug": "07-generative-ai-model-fundamentals/imputation-of-data",
      "title": "Imputation Of Data"
     },
     {
      "slug": "07-generative-ai-model-fundamentals/transformers-sagemaker",
      "title": "Transformers sagemaker"
     }
    ]
   },
   {
    "section": "",
    "tab": "Building with Bedrock",
    "items": [
     {
      "slug": "08-building-gen-ai-apps-with-bedrock/bedrock-overview",
      "title": "Bedrock Overview"
     },
     {
      "slug": "08-building-gen-ai-apps-with-bedrock/retrieval-augmented-generation",
      "title": "Retrieval Augmented Generation"
     },
     {
      "slug": "08-building-gen-ai-apps-with-bedrock/chunking-strategies",
      "title": "Chunking Strategies in RAG Pipelines"
     },
     {
      "slug": "08-building-gen-ai-apps-with-bedrock/bedrock-agents",
      "title": "Bedrock Agents"
     },
     {
      "slug": "08-building-gen-ai-apps-with-bedrock/bedrock-guardrails",
      "title": "Bedrock Guardrails"
     },
     {
      "slug": "08-building-gen-ai-apps-with-bedrock/fine-tuning-and-continuous-pre-training",
      "title": "Fine Tuning And Continuous Pre Training"
     },
     {
      "slug": "08-building-gen-ai-apps-with-bedrock/multi-llm-routing-strategies",
      "title": "Multi‑LLM Routing Strategies on AWS (Bedrock)"
     },
     {
      "slug": "08-building-gen-ai-apps-with-bedrock/other-bedrock-features",
      "title": "Other Bedrock Features"
     }
    ]
   },
   {
    "section": "",
    "tab": "Amazon Bedrock",
    "items": [
     {
      "group": "Bedrock core",
      "expanded": false,
      "items": [
       {
        "slug": "13-bedrock/amazon-bedrock",
        "title": "Amazon Bedrock (deep dive notes)"
       },
       {
        "slug": "13-bedrock/bedrock-application-patterns",
        "title": "Bedrock Application Patterns"
       },
       {
        "slug": "13-bedrock/bedrock-cross-region-inference",
        "title": "Amazon Bedrock Cross-Region Inference"
       },
       {
        "slug": "13-bedrock/bedrock-flows",
        "title": "Prompt Flows (Amazon Bedrock Flows)"
       },
       {
        "slug": "13-bedrock/bedrock-prompt-management",
        "title": "Amazon Bedrock Prompt Management"
       }
      ]
     },
     {
      "group": "Knowledge bases & RAG",
      "expanded": false,
      "items": [
       {
        "slug": "13-bedrock/bedrock-knowledge-base",
        "title": "Amazon Bedrock Knowledge Bases (deep dive notes)"
       },
       {
        "slug": "13-bedrock/bedrock-rag-decision-guide",
        "title": "Bedrock RAG Decision Guide"
       },
       {
        "slug": "13-bedrock/pre-retrieval-knowledge-base",
        "title": "Pre Retrieval Knowledge Base"
       },
       {
        "slug": "13-bedrock/chunking-strategies",
        "title": "Chunking strategies for RAG (deep dive notes)"
       },
       {
        "slug": "13-bedrock/optimizing-vector-store-and-embeddings",
        "title": "Optimizing Vector Store And Embeddings"
       },
       {
        "slug": "13-bedrock/bedrock-data-automation",
        "title": "Amazon Bedrock Data Automation (BDA)"
       }
      ]
     },
     {
      "group": "Agents & AgentCore",
      "expanded": false,
      "items": [
       {
        "slug": "13-bedrock/bedrock-agents",
        "title": "Agents for Amazon Bedrock"
       },
       {
        "slug": "13-bedrock/bedrock-agent-memory",
        "title": "Amazon Bedrock Agent Memory"
       },
       {
        "slug": "13-bedrock/bedrock-agent-tracing",
        "title": "Agent Tracing in Amazon Bedrock"
       },
       {
        "slug": "13-bedrock/bedrock-agentcore",
        "title": "Amazon Bedrock AgentCore"
       },
       {
        "slug": "13-bedrock/bedrock-agentcore-production-patterns",
        "title": "Bedrock AgentCore Production Patterns"
       },
       {
        "slug": "13-bedrock/bedrock-multi-agent-collaboration",
        "title": "Bedrock Multi-Agent Collaboration"
       }
      ]
     },
     {
      "group": "Model customization",
      "expanded": false,
      "items": [
       {
        "slug": "13-bedrock/bedrock-model-customization",
        "title": "Amazon Bedrock Model Customization (Fine-tuning, Continued Pre-training, LoRA)"
       },
       {
        "slug": "13-bedrock/bedrock-custom-model-import",
        "title": "Amazon Bedrock Custom Model Import"
       }
      ]
     },
     {
      "group": "Safety & evaluation",
      "expanded": false,
      "items": [
       {
        "slug": "13-bedrock/bedrock-guardrails",
        "title": "Bedrock Guardrails"
       },
       {
        "slug": "13-bedrock/bedrock-automated-reasoning-checks",
        "title": "Bedrock Automated Reasoning Checks"
       },
       {
        "slug": "13-bedrock/bedrock-token-redaction",
        "title": "Token-Level Redaction in Amazon Bedrock (Guardrails)"
       },
       {
        "slug": "13-bedrock/bedrock-model-evaluations",
        "title": "Amazon Bedrock Model Evaluations"
       },
       {
        "slug": "13-bedrock/bedrock-evaluation-techniques",
        "title": "Evaluation Techniques in Amazon Bedrock"
       }
      ]
     },
     {
      "group": "Cost & performance",
      "expanded": false,
      "items": [
       {
        "slug": "13-bedrock/bedrock-prompt-caching",
        "title": "Prompt Caching in Amazon Bedrock"
       },
       {
        "slug": "13-bedrock/bedrock-intelligent-prompt-routing",
        "title": "Amazon Bedrock Intelligent Prompt Routing"
       },
       {
        "slug": "13-bedrock/bedrock-edge-caching",
        "title": "Caching for GenAI Workloads: CloudFront + API Gateway (Bedrock Context)"
       }
      ]
     }
    ]
   },
   {
    "section": "",
    "tab": "Agentic AI",
    "items": [
     {
      "slug": "14-agentic-ai/agentic-ai-current-innovation-map",
      "title": "Agentic AI Current Innovation Map"
     },
     {
      "slug": "14-agentic-ai/agentic-rag-patterns",
      "title": "Agentic RAG Patterns"
     },
     {
      "slug": "14-agentic-ai/model-context-protocol-mcp",
      "title": "Model Context Protocol (MCP)"
     },
     {
      "slug": "14-agentic-ai/claude-agentic-ai-on-aws",
      "title": "Claude Agentic AI on AWS"
     },
     {
      "slug": "14-agentic-ai/agent-squad",
      "title": "Agent Squad in Amazon Bedrock"
     },
     {
      "slug": "14-agentic-ai/strands-ai",
      "title": "Strands Agents in Amazon Bedrock"
     }
    ]
   }
  ]
 },
 {
  "id": "exam_mlops",
  "label": "MLOps & Security",
  "short": "MLOps",
  "blurb": "Production operations, CI/CD, orchestration, inference infrastructure, cost, security, and responsible AI.",
  "accent": "#DD344C",
  "icon": "ShieldCheck",
  "tabs": [
   {
    "section": "",
    "tab": "Operations & deployment",
    "items": [
     {
      "group": "Containers & compute",
      "expanded": false,
      "items": [
       {
        "slug": "09-machine-learning-operations/docker",
        "title": "Docker"
       },
       {
        "slug": "09-machine-learning-operations/elastic-container-registry",
        "title": "Elastic Container Registry"
       },
       {
        "slug": "09-machine-learning-operations/elastic-container-service",
        "title": "Elastic Container Service"
       },
       {
        "slug": "09-machine-learning-operations/elastic-kubernetes-service",
        "title": "Elastic Kubernetes Service"
       },
       {
        "slug": "09-machine-learning-operations/sagemaker-kubernetes",
        "title": "SageMaker Kubernetes"
       },
       {
        "slug": "09-machine-learning-operations/aws-batch",
        "title": "AWS Batch"
       },
       {
        "slug": "09-machine-learning-operations/lambda-for-ml-workflows",
        "title": "AWS Lambda For ML Workflows"
       },
       {
        "slug": "09-machine-learning-operations/djl-serving",
        "title": "DJL Serving (Deep Java Library)"
       }
      ]
     },
     {
      "group": "CI/CD & infrastructure as code",
      "expanded": false,
      "items": [
       {
        "slug": "09-machine-learning-operations/code-pipeline",
        "title": "Code Pipeline"
       },
       {
        "slug": "09-machine-learning-operations/code-build",
        "title": "Code Build"
       },
       {
        "slug": "09-machine-learning-operations/code-deploy",
        "title": "Code Deploy"
       },
       {
        "slug": "09-machine-learning-operations/codeartifact",
        "title": "AWS CodeArtifact"
       },
       {
        "slug": "09-machine-learning-operations/codeguru",
        "title": "Amazon CodeGuru"
       },
       {
        "slug": "09-machine-learning-operations/cloud-formation",
        "title": "Cloud Formation"
       },
       {
        "slug": "09-machine-learning-operations/cloud-development-kit",
        "title": "Cloud Development Kit"
       },
       {
        "slug": "09-machine-learning-operations/serverless-application-repository",
        "title": "AWS Serverless Application Repository"
       },
       {
        "slug": "09-machine-learning-operations/aws-appconfig",
        "title": "AWS AppConfig"
       },
       {
        "slug": "09-machine-learning-operations/git",
        "title": "Git"
       },
       {
        "slug": "09-machine-learning-operations/git-branching-strategies",
        "title": "Git Branching Strategies"
       },
       {
        "slug": "09-machine-learning-operations/cicd-tests-for-ml-pipelines",
        "title": "CI/CD Tests For ML Pipelines"
       }
      ]
     },
     {
      "group": "Orchestration & events",
      "expanded": false,
      "items": [
       {
        "slug": "09-machine-learning-operations/step-functions",
        "title": "Step Functions"
       },
       {
        "slug": "09-machine-learning-operations/apache-managed-workflows-for-apache-airflow",
        "title": "Apache Managed Workflows For Apache Airflow"
       },
       {
        "slug": "09-machine-learning-operations/event-bridge",
        "title": "Event Bridge"
       },
       {
        "slug": "09-machine-learning-operations/sns",
        "title": "Amazon SNS"
       },
       {
        "slug": "09-machine-learning-operations/sqs",
        "title": "Amazon SQS"
       },
       {
        "slug": "09-machine-learning-operations/api-gateway",
        "title": "Amazon API Gateway"
       },
       {
        "slug": "09-machine-learning-operations/cloudfront",
        "title": "Amazon CloudFront"
       }
      ]
     },
     {
      "group": "Inference & deployment",
      "expanded": false,
      "items": [
       {
        "slug": "09-machine-learning-operations/sagemaker-deploying-for-inference",
        "title": "SageMaker Deploying For Inference"
       },
       {
        "slug": "09-machine-learning-operations/sagemaker-inner-details-and-prod-variants",
        "title": "Start with a TensorFlow base image"
       },
       {
        "slug": "09-machine-learning-operations/sagemaker-inference-recommender",
        "title": "SageMaker Inference Recommender"
       },
       {
        "slug": "09-machine-learning-operations/inference-pipelines",
        "title": "Inference Pipelines"
       },
       {
        "slug": "09-machine-learning-operations/deployment-mode-decision-guide",
        "title": "Deployment Mode Decision Guide"
       },
       {
        "slug": "09-machine-learning-operations/deployment-guardrails-and-shadow-test",
        "title": "Deployment Guardrails And Shadow Test"
       },
       {
        "slug": "09-machine-learning-operations/endpoint-autoscaling-metrics",
        "title": "Endpoint Autoscaling Metrics"
       },
       {
        "slug": "09-machine-learning-operations/resource-management-and-autoscaling",
        "title": "Resource Management And Autoscaling"
       },
       {
        "slug": "09-machine-learning-operations/aws-auto-scaling",
        "title": "AWS Auto Scaling For ML Workloads"
       },
       {
        "slug": "09-machine-learning-operations/retraining-triggers-and-drift-response",
        "title": "Retraining Triggers And Drift Response"
       }
      ]
     },
     {
      "group": "Edge & IoT",
      "expanded": false,
      "items": [
       {
        "slug": "09-machine-learning-operations/sagemaker-on-the-edge",
        "title": "SageMaker On The Edge"
       },
       {
        "slug": "09-machine-learning-operations/greengrass",
        "title": "AWS IoT Greengrass"
       }
      ]
     },
     {
      "group": "Cost, observability & governance",
      "expanded": false,
      "items": [
       {
        "slug": "09-machine-learning-operations/aws-cost-management-for-ml",
        "title": "AWS Cost Management For ML"
       },
       {
        "slug": "09-machine-learning-operations/compute-optimizer",
        "title": "AWS Compute Optimizer"
       },
       {
        "slug": "09-machine-learning-operations/trusted-advisor",
        "title": "AWS Trusted Advisor"
       },
       {
        "slug": "09-machine-learning-operations/devops-guru",
        "title": "Amazon DevOps Guru"
       },
       {
        "slug": "09-machine-learning-operations/aws-chatbot",
        "title": "Amazon Q Developer In Chat Applications"
       },
       {
        "slug": "09-machine-learning-operations/x-ray",
        "title": "AWS X-Ray"
       },
       {
        "slug": "09-machine-learning-operations/lake-formation",
        "title": "Lake Formation"
       }
      ]
     }
    ]
   },
   {
    "section": "",
    "tab": "Security & compliance",
    "items": [
     {
      "group": "Identity & access",
      "expanded": false,
      "items": [
       {
        "slug": "10-security-identity-and-compliance/IAM",
        "title": "IAM"
       },
       {
        "slug": "10-security-identity-and-compliance/organizations",
        "title": "AWS Organizations"
       },
       {
        "slug": "10-security-identity-and-compliance/sagemaker-role-manager",
        "title": "Amazon SageMaker Role Manager"
       },
       {
        "slug": "10-security-identity-and-compliance/service-catalog",
        "title": "AWS Service Catalog"
       }
      ]
     },
     {
      "group": "Data protection",
      "expanded": false,
      "items": [
       {
        "slug": "10-security-identity-and-compliance/key-management-service",
        "title": "🔐 AWS KMS (Key Management Service) – Complete Notes"
       },
       {
        "slug": "10-security-identity-and-compliance/secrets-manager",
        "title": "🔐 AWS Secrets Manager"
       },
       {
        "slug": "10-security-identity-and-compliance/ssm-parameter-store",
        "title": "🧩 AWS SSM Parameter Store"
       },
       {
        "slug": "10-security-identity-and-compliance/macie",
        "title": "🔍 Amazon Macie"
       },
       {
        "slug": "10-security-identity-and-compliance/data-classification-pii-phi-data-residency",
        "title": "Data Classification, PII, PHI, And Data Residency"
       }
      ]
     },
     {
      "group": "Network isolation",
      "expanded": false,
      "items": [
       {
        "slug": "10-security-identity-and-compliance/vpc",
        "title": "Define a training job with VPC configuration"
       },
       {
        "slug": "10-security-identity-and-compliance/private-ml-networking",
        "title": "Private ML Networking"
       },
       {
        "slug": "10-security-identity-and-compliance/direct-connect",
        "title": "AWS Direct Connect"
       },
       {
        "slug": "10-security-identity-and-compliance/shield",
        "title": "AWS Shield"
       }
      ]
     },
     {
      "group": "Audit & compliance",
      "expanded": false,
      "items": [
       {
        "slug": "10-security-identity-and-compliance/cloudtrail",
        "title": "Cloudtrail"
       },
       {
        "slug": "10-security-identity-and-compliance/cloudwatch",
        "title": "Amazon CloudWatch"
       },
       {
        "slug": "10-security-identity-and-compliance/aws-config",
        "title": "AWS Config"
       }
      ]
     }
    ]
   },
   {
    "section": "",
    "tab": "Best practices",
    "items": [
     {
      "slug": "11-machine-learning-best-practices/aws-well-architected-framework-ml-lens",
      "title": "AWS Well-Architected Framework (ML Lens)"
     },
     {
      "slug": "11-machine-learning-best-practices/well-architected-generative-ai-lens",
      "title": "AWS Well-Architected Generative AI Lens"
     },
     {
      "slug": "11-machine-learning-best-practices/well-architected-tool-generative-ai-lens",
      "title": "AWS Well-Architected Tool with the Generative AI Lens"
     },
     {
      "slug": "11-machine-learning-best-practices/responsible-ai-aws",
      "title": "Responsible AI in AWS (Bedrock + SageMaker)"
     },
     {
      "slug": "11-machine-learning-best-practices/amazon-augmented-ai",
      "title": "Amazon Augmented Ai"
     },
     {
      "slug": "11-machine-learning-best-practices/mechanical-turk",
      "title": "Amazon Mechanical Turk"
     }
    ]
   }
  ]
 }
];

export const EXAMS_ALL_PAGES = [
 {
  "slug": "00-exam-guide/exam-overview",
  "title": "MLA-C01 Exam Overview",
  "desc": "This is the top-level map for the AWS Certified Machine Learning Engineer - Associate exam.",
  "file": "/exams/md/00-exam-guide/exam-overview.md",
  "track": "exam_guide",
  "tab": "MLA-C01",
  "group": "",
  "status": "reviewed",
  "domains": [],
  "domainScope": "all",
  "services": [
   "AWS Certification"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "exam-guide"
  ],
  "aliases": [
   "MLA-C01 Exam Overview"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 254
 },
 {
  "slug": "00-exam-guide/domain-1-data-preparation",
  "title": "Domain 1: Data Preparation For Machine Learning",
  "desc": "Task 1.1: Ingest and store data.",
  "file": "/exams/md/00-exam-guide/domain-1-data-preparation.md",
  "track": "exam_guide",
  "tab": "MLA-C01",
  "group": "",
  "status": "reviewed",
  "domains": [
   "1.1",
   "1.2",
   "1.3"
  ],
  "domainScope": "",
  "services": [
   "AWS Certification"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1"
  ],
  "aliases": [
   "Domain 1: Data Preparation For Machine Learning"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 133
 },
 {
  "slug": "00-exam-guide/domain-2-model-development",
  "title": "Domain 2: ML Model Development",
  "desc": "Task 2.1: Choose a modeling approach.",
  "file": "/exams/md/00-exam-guide/domain-2-model-development.md",
  "track": "exam_guide",
  "tab": "MLA-C01",
  "group": "",
  "status": "reviewed",
  "domains": [
   "2.1",
   "2.2",
   "2.3"
  ],
  "domainScope": "",
  "services": [
   "AWS Certification"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2"
  ],
  "aliases": [
   "Domain 2: ML Model Development"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 113
 },
 {
  "slug": "00-exam-guide/domain-3-deployment-orchestration",
  "title": "Domain 3: Deployment And Orchestration Of ML Workflows",
  "desc": "Task 3.1: Select deployment infrastructure based on requirements.",
  "file": "/exams/md/00-exam-guide/domain-3-deployment-orchestration.md",
  "track": "exam_guide",
  "tab": "MLA-C01",
  "group": "",
  "status": "reviewed",
  "domains": [
   "3.1",
   "3.2",
   "3.3"
  ],
  "domainScope": "",
  "services": [
   "AWS Certification"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3"
  ],
  "aliases": [
   "Domain 3: Deployment And Orchestration Of ML Workflows"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 107
 },
 {
  "slug": "00-exam-guide/domain-4-monitoring-security",
  "title": "Domain 4: ML Solution Monitoring, Maintenance, And Security",
  "desc": "Task 4.1: Monitor model performance and data quality.",
  "file": "/exams/md/00-exam-guide/domain-4-monitoring-security.md",
  "track": "exam_guide",
  "tab": "MLA-C01",
  "group": "",
  "status": "reviewed",
  "domains": [
   "4.1",
   "4.2",
   "4.3"
  ],
  "domainScope": "",
  "services": [
   "AWS Certification"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4"
  ],
  "aliases": [
   "Domain 4: ML Solution Monitoring, Maintenance, And Security"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 109
 },
 {
  "slug": "00-exam-guide/in-scope-services",
  "title": "MLA-C01 In-Scope Services",
  "desc": "Use this as the canonical checklist for service coverage. It follows the official AWS service list, with lifecycle caveats from current AWS service lifecycle documentation.",
  "file": "/exams/md/00-exam-guide/in-scope-services.md",
  "track": "exam_guide",
  "tab": "MLA-C01",
  "group": "",
  "status": "reviewed",
  "domains": [],
  "domainScope": "all",
  "services": [
   "AWS Certification"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "exam-scope"
  ],
  "aliases": [
   "MLA-C01 In-Scope Services"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 155
 },
 {
  "slug": "00-exam-guide/out-of-scope-services",
  "title": "MLA-C01 Out-Of-Scope Services",
  "desc": "This note prevents over-studying services that are useful AWS background but not current MLA-C01 target material.",
  "file": "/exams/md/00-exam-guide/out-of-scope-services.md",
  "track": "exam_guide",
  "tab": "MLA-C01",
  "group": "",
  "status": "reviewed",
  "domains": [],
  "domainScope": "all",
  "services": [
   "AWS Certification"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "exam-scope"
  ],
  "aliases": [
   "MLA-C01 Out-Of-Scope Services"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 55
 },
 {
  "slug": "00-exam-guide/study-roadmap",
  "title": "MLA-C01 Study Roadmap",
  "desc": "Data quality, PII/PHI, bias, class imbalance, feature engineering.",
  "file": "/exams/md/00-exam-guide/study-roadmap.md",
  "track": "exam_guide",
  "tab": "MLA-C01",
  "group": "",
  "status": "reviewed",
  "domains": [],
  "domainScope": "all",
  "services": [
   "AWS Certification"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "study-roadmap"
  ],
  "aliases": [
   "MLA-C01 Study Roadmap"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 5,
  "words": 124
 },
 {
  "slug": "README",
  "title": "AWS Machine Learning and AI Notes",
  "desc": "This vault is an AWS Machine Learning and AI knowledge base. It covers AWS AI services, data foundations, classic ML, SageMaker AI, Amazon Bedrock, generative AI, agentic AI, MLOps,…",
  "file": "/exams/md/README.md",
  "track": "exam_guide",
  "tab": "About this vault",
  "group": "",
  "status": "reviewed",
  "domains": [],
  "domainScope": "all",
  "services": [
   "AWS AI and ML"
  ],
  "tags": [
   "aws",
   "machine-learning",
   "artificial-intelligence",
   "bedrock",
   "sagemaker",
   "readme"
  ],
  "aliases": [
   "AWS ML and AI Notes",
   "AWS AI Notes",
   "AWS Machine Learning Notes"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 9,
  "words": 993
 },
 {
  "slug": "NOTE_TEMPLATE",
  "title": "Note Template",
  "desc": "Use this format for AWS Machine Learning and AI notes. Add certifications only when the note maps to a specific credential track.",
  "file": "/exams/md/NOTE_TEMPLATE.md",
  "track": "exam_guide",
  "tab": "About this vault",
  "group": "",
  "status": "supplemental",
  "domains": [],
  "domainScope": "unmapped",
  "services": [],
  "tags": [
   "aws",
   "template"
  ],
  "aliases": [
   "Standard Note Template"
  ],
  "certifications": [],
  "lastVerified": "2026-05-16",
  "sourceType": "repo-standard",
  "sourceCount": 3,
  "words": 187
 },
 {
  "slug": "PLAN_NOTES_IMPROVEMENT",
  "title": "Plan: Improve AWS MLA-C01 Notes",
  "desc": "Improve this vault as a study system for the AWS Certified Machine Learning Engineer - Associate (MLA-C01) exam by:",
  "file": "/exams/md/PLAN_NOTES_IMPROVEMENT.md",
  "track": "exam_guide",
  "tab": "About this vault",
  "group": "",
  "status": "supplemental",
  "domains": [],
  "domainScope": "all",
  "services": [
   "AWS Certification"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "plan"
  ],
  "aliases": [
   "Notes Improvement Plan"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "mixed-official-research",
  "sourceCount": 0,
  "words": 5656
 },
 {
  "slug": "01-ai-services/comprehend",
  "title": "Amazon Comprehend",
  "desc": "Amazon Comprehend is a fully managed Natural Language Processing (NLP) service that uses machine learning to uncover valuable insights and relationships within unstructured text. It enables…",
  "file": "/exams/md/01-ai-services/comprehend.md",
  "track": "exam_ai_services",
  "tab": "AI services",
  "group": "Language & speech",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "01_ai_services"
  ],
  "aliases": [
   "Amazon Comprehend"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 1086
 },
 {
  "slug": "01-ai-services/comprehend-medical",
  "title": "Amazon Comprehend Medical",
  "desc": "In-scope medical NLP service for extracting structured information from unstructured clinical text.",
  "file": "/exams/md/01-ai-services/comprehend-medical.md",
  "track": "exam_ai_services",
  "tab": "AI services",
  "group": "Language & speech",
  "status": "reviewed",
  "domains": [
   "1.3",
   "2.1",
   "4.3"
  ],
  "domainScope": "",
  "services": [
   "Amazon Comprehend Medical"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "ai-services",
   "healthcare"
  ],
  "aliases": [
   "Amazon Comprehend Medical"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 225
 },
 {
  "slug": "01-ai-services/translate",
  "title": "Amazon Translate",
  "desc": "Amazon Translate is a fully managed neural machine translation (NMT) service provided by AWS. It enables developers to translate text between languages quickly, accurately, and at scale.…",
  "file": "/exams/md/01-ai-services/translate.md",
  "track": "exam_ai_services",
  "tab": "AI services",
  "group": "Language & speech",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "01_ai_services"
  ],
  "aliases": [
   "Amazon Translate"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 554
 },
 {
  "slug": "01-ai-services/transcribe",
  "title": "Amazon Transcribe",
  "desc": "Amazon Transcribe is a fully managed automatic speech recognition (ASR) service that makes it easy to add speech-to-text capabilities to applications. It converts audio and video input into…",
  "file": "/exams/md/01-ai-services/transcribe.md",
  "track": "exam_ai_services",
  "tab": "AI services",
  "group": "Language & speech",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "01_ai_services"
  ],
  "aliases": [
   "Amazon Transcribe"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 435
 },
 {
  "slug": "01-ai-services/polly",
  "title": "Amazon Polly",
  "desc": "Amazon Polly is a cloud-based Text-to-Speech (TTS) service that uses advanced deep learning technologies to synthesize natural-sounding human speech from text. It supports dozens of…",
  "file": "/exams/md/01-ai-services/polly.md",
  "track": "exam_ai_services",
  "tab": "AI services",
  "group": "Language & speech",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "01_ai_services"
  ],
  "aliases": [
   "Amazon Polly"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 0,
  "words": 389
 },
 {
  "slug": "01-ai-services/lex",
  "title": "Amazon Lex",
  "desc": "Amazon Lex is a fully managed artificial intelligence (AI) service that enables developers to build conversational interfaces (chatbots, voice assistants) into applications using voice and…",
  "file": "/exams/md/01-ai-services/lex.md",
  "track": "exam_ai_services",
  "tab": "AI services",
  "group": "Language & speech",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "01_ai_services"
  ],
  "aliases": [
   "Amazon Lex"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 502
 },
 {
  "slug": "01-ai-services/rekognition",
  "title": "Amazon Rekognition",
  "desc": "Amazon Rekognition is a cloud-based service that automates image and video analysis using machine learning. It provides pre-trained and customizable computer vision (CV) capabilities to…",
  "file": "/exams/md/01-ai-services/rekognition.md",
  "track": "exam_ai_services",
  "tab": "AI services",
  "group": "Vision & documents",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "01_ai_services"
  ],
  "aliases": [
   "Amazon Rekognition"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 1045
 },
 {
  "slug": "01-ai-services/textract",
  "title": "Amazon Textract",
  "desc": "Amazon Textract is a fully managed machine learning service that automatically extracts printed text, handwriting, and data from scanned documents, forms, and tables. Unlike traditional…",
  "file": "/exams/md/01-ai-services/textract.md",
  "track": "exam_ai_services",
  "tab": "AI services",
  "group": "Vision & documents",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "01_ai_services"
  ],
  "aliases": [
   "Amazon Textract"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 425
 },
 {
  "slug": "01-ai-services/kendra",
  "title": "Amazon Kendra",
  "desc": "Amazon Kendra is an intelligent enterprise search service powered by machine learning (ML). It enables organizations to index, search, and retrieve unstructured and structured data from a…",
  "file": "/exams/md/01-ai-services/kendra.md",
  "track": "exam_ai_services",
  "tab": "AI services",
  "group": "Search & personalization",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "01_ai_services"
  ],
  "aliases": [
   "Amazon Kendra"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 518
 },
 {
  "slug": "01-ai-services/opensearch",
  "title": "OpenSearch",
  "desc": "Amazon OpenSearch Service (formerly Amazon Elasticsearch Service) is a fully managed, open-source search and analytics suite. It enables users to ingest, search, analyze, and visualize…",
  "file": "/exams/md/01-ai-services/opensearch.md",
  "track": "exam_ai_services",
  "tab": "AI services",
  "group": "Search & personalization",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "01_ai_services"
  ],
  "aliases": [
   "OpenSearch"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 535
 },
 {
  "slug": "01-ai-services/personalize",
  "title": "Amazon Personalize",
  "desc": "Amazon Personalize is a fully managed machine learning service by AWS that enables developers to build real-time personalized recommendation systems, such as product, content, or marketing…",
  "file": "/exams/md/01-ai-services/personalize.md",
  "track": "exam_ai_services",
  "tab": "AI services",
  "group": "Search & personalization",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "01_ai_services"
  ],
  "aliases": [
   "Amazon Personalize"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 500
 },
 {
  "slug": "01-ai-services/forecast",
  "title": "Amazon Forecast",
  "desc": "Legacy forecasting service note. Amazon Forecast is no longer available to new customers and is absent from the current MLA-C01 in-scope ML service list.",
  "file": "/exams/md/01-ai-services/forecast.md",
  "track": "exam_ai_services",
  "tab": "AI services",
  "group": "Forecasting & anomaly detection",
  "status": "legacy",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [
   "Amazon Forecast",
   "Amazon SageMaker AI"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "legacy",
   "forecasting"
  ],
  "aliases": [
   "Amazon Forecast"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 168
 },
 {
  "slug": "01-ai-services/fraud-detector",
  "title": "Amazon Fraud Detector",
  "desc": "Lifecycle-aware service note: Amazon Fraud Detector appears in MLA-C01 service scope, but AWS says it is no longer open to new customers and is in sunset status.",
  "file": "/exams/md/01-ai-services/fraud-detector.md",
  "track": "exam_ai_services",
  "tab": "AI services",
  "group": "Forecasting & anomaly detection",
  "status": "legacy",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [
   "Amazon Fraud Detector"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "ai-services",
   "legacy"
  ],
  "aliases": [
   "Amazon Fraud Detector"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 233
 },
 {
  "slug": "01-ai-services/lookout-for-equipment",
  "title": "Amazon Lookout For Equipment",
  "desc": "Lifecycle-aware note for the industrial equipment anomaly detection service; AWS has announced support discontinuation for October 7, 2026.",
  "file": "/exams/md/01-ai-services/lookout-for-equipment.md",
  "track": "exam_ai_services",
  "tab": "AI services",
  "group": "Forecasting & anomaly detection",
  "status": "legacy",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [
   "Amazon Lookout for Equipment"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "ai-services",
   "legacy"
  ],
  "aliases": [
   "Amazon Lookout For Equipment"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 228
 },
 {
  "slug": "01-ai-services/lookout-for-metrics",
  "title": "Amazon Lookout For Metrics",
  "desc": "Lifecycle-aware note: AWS General Reference lists Amazon Lookout for Metrics in full shutdown as of October 10, 2025.",
  "file": "/exams/md/01-ai-services/lookout-for-metrics.md",
  "track": "exam_ai_services",
  "tab": "AI services",
  "group": "Forecasting & anomaly detection",
  "status": "legacy",
  "domains": [
   "2.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [
   "Amazon Lookout for Metrics"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "ai-services",
   "legacy"
  ],
  "aliases": [
   "Amazon Lookout For Metrics"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 207
 },
 {
  "slug": "01-ai-services/lookout-for-vision",
  "title": "Amazon Lookout For Vision",
  "desc": "Lifecycle-aware note: AWS General Reference lists Amazon Lookout for Vision in full shutdown as of October 31, 2025.",
  "file": "/exams/md/01-ai-services/lookout-for-vision.md",
  "track": "exam_ai_services",
  "tab": "AI services",
  "group": "Forecasting & anomaly detection",
  "status": "legacy",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [
   "Amazon Lookout for Vision"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "ai-services",
   "legacy"
  ],
  "aliases": [
   "Amazon Lookout For Vision"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 196
 },
 {
  "slug": "01-ai-services/healthlake",
  "title": "AWS HealthLake",
  "desc": "In-scope healthcare data service for storing, querying, analyzing, and sharing FHIR R4 health data.",
  "file": "/exams/md/01-ai-services/healthlake.md",
  "track": "exam_ai_services",
  "tab": "AI services",
  "group": "Industry & assistants",
  "status": "reviewed",
  "domains": [
   "1.1",
   "1.3",
   "4.3"
  ],
  "domainScope": "",
  "services": [
   "AWS HealthLake"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "healthcare",
   "security"
  ],
  "aliases": [
   "AWS HealthLake"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 234
 },
 {
  "slug": "01-ai-services/amazon-q",
  "title": "Amazon Q",
  "desc": "In-scope generative AI assistant family that includes enterprise assistants, developer assistance, and AWS operational/chat integrations.",
  "file": "/exams/md/01-ai-services/amazon-q.md",
  "track": "exam_ai_services",
  "tab": "AI services",
  "group": "Industry & assistants",
  "status": "reviewed",
  "domains": [
   "2.1",
   "3.3",
   "4.2"
  ],
  "domainScope": "",
  "services": [
   "Amazon Q",
   "Amazon Q Business",
   "Amazon Q Developer"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "amazon-q",
   "generative-ai"
  ],
  "aliases": [
   "Amazon Q"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 283
 },
 {
  "slug": "02-data-ingestion-and-storage/types-of-data",
  "title": "Types Of Data",
  "desc": "AWS’s Machine Learning Engineer exam guide calls out three fundamental data types you must recognize and handle when designing ML workflows:",
  "file": "/exams/md/02-data-ingestion-and-storage/types-of-data.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Data foundations",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Types Of Data"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 484
 },
 {
  "slug": "02-data-ingestion-and-storage/properties-of-data",
  "title": "Properties Of Data",
  "desc": "The data‑properties “three V’s” describe key dimensions that influence how you architect data ingestion, storage, and processing pipelines:",
  "file": "/exams/md/02-data-ingestion-and-storage/properties-of-data.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Data foundations",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Properties Of Data"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 552
 },
 {
  "slug": "02-data-ingestion-and-storage/data-sources-and-data-formats",
  "title": "Data Sources And Data Formats",
  "desc": "When building ETL/ELT pipelines, your raw data may originate from many different places. Understanding each source's characteristics helps you choose the right connector, handle…",
  "file": "/exams/md/02-data-ingestion-and-storage/data-sources-and-data-formats.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Data foundations",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Data Sources And Data Formats"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 715
 },
 {
  "slug": "02-data-ingestion-and-storage/data-lake-lakehouses-warehouses",
  "title": "Data Lakes, Lakehouses, And Warehouses",
  "desc": "Domain 1 architecture note for choosing between data lake, lakehouse, and warehouse patterns for ML datasets.",
  "file": "/exams/md/02-data-ingestion-and-storage/data-lake-lakehouses-warehouses.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Data foundations",
  "status": "reviewed",
  "domains": [
   "1.1",
   "1.2",
   "1.3"
  ],
  "domainScope": "",
  "services": [
   "Amazon S3",
   "AWS Lake Formation",
   "Amazon Redshift",
   "Amazon Athena",
   "AWS Glue"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "data-architecture"
  ],
  "aliases": [
   "Data Lakes, Lakehouses, And Warehouses"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 5,
  "words": 282
 },
 {
  "slug": "02-data-ingestion-and-storage/data-mesh",
  "title": "Data Mesh",
  "desc": "is a modern architectural and organizational paradigm for data platform design, especially suited for large, complex, and distributed organizations. Unlike traditional centralized data…",
  "file": "/exams/md/02-data-ingestion-and-storage/data-mesh.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Data foundations",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Data Mesh"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 0,
  "words": 666
 },
 {
  "slug": "02-data-ingestion-and-storage/amazon-datazone",
  "title": "Amazon DataZone",
  "desc": "Amazon DataZone is listed out of scope for MLA-C01. Keep only as governance background.",
  "file": "/exams/md/02-data-ingestion-and-storage/amazon-datazone.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Data foundations",
  "status": "out-of-scope",
  "domains": [],
  "domainScope": "supplemental",
  "services": [
   "Amazon DataZone"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "out-of-scope"
  ],
  "aliases": [
   "Amazon DataZone"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 1,
  "words": 122
 },
 {
  "slug": "02-data-ingestion-and-storage/etl-and-elt",
  "title": "ETL And ELT",
  "desc": "Building reliable pipelines means wiring these steps together, handling dependencies, retries, and notifications:",
  "file": "/exams/md/02-data-ingestion-and-storage/etl-and-elt.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Data foundations",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "ETL And ELT"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 666
 },
 {
  "slug": "02-data-ingestion-and-storage/data-pipelines",
  "title": "AWS Data Pipeline",
  "desc": "AWS Data Pipeline is no longer available to new customers; prefer AWS Glue, Step Functions, or MWAA for current workflows.",
  "file": "/exams/md/02-data-ingestion-and-storage/data-pipelines.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Data foundations",
  "status": "legacy",
  "domains": [],
  "domainScope": "supplemental",
  "services": [
   "AWS Data Pipeline"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "legacy"
  ],
  "aliases": [
   "AWS Data Pipeline"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 133
 },
 {
  "slug": "02-data-ingestion-and-storage/feature-engineering",
  "title": "Feature Engineering Techniques",
  "desc": "Breaking a single composite feature into two or more atomic features.",
  "file": "/exams/md/02-data-ingestion-and-storage/feature-engineering.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Data foundations",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Feature Engineering Techniques"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 427
 },
 {
  "slug": "02-data-ingestion-and-storage/glue-databrew",
  "title": "AWS Glue DataBrew",
  "desc": "Domain 1 data preparation service for visual cleaning, profiling, and no-code transformation before analytics or ML.",
  "file": "/exams/md/02-data-ingestion-and-storage/glue-databrew.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Data foundations",
  "status": "reviewed",
  "domains": [
   "1.2",
   "1.3"
  ],
  "domainScope": "",
  "services": [
   "AWS Glue DataBrew"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "glue",
   "data-preparation"
  ],
  "aliases": [
   "AWS Glue DataBrew"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 238
 },
 {
  "slug": "02-data-ingestion-and-storage/kinesis-data-streams",
  "title": "Kinesis Data Streams",
  "desc": "Amazon Kinesis Data Streams (KDS) is a fully managed, high-throughput service for real-time ingestion and storage of streaming data. Producers push immutable data records into shards, and…",
  "file": "/exams/md/02-data-ingestion-and-storage/kinesis-data-streams.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Streaming ingestion",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Kinesis Data Streams"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 880
 },
 {
  "slug": "02-data-ingestion-and-storage/kinesis-data-firehose",
  "title": "Kinesis Data Firehose",
  "desc": "Amazon Data Firehose (formerly known as Amazon Kinesis Data Firehose) is a fully managed service designed for real-time data delivery to various destinations, including Amazon S3, Amazon…",
  "file": "/exams/md/02-data-ingestion-and-storage/kinesis-data-firehose.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Streaming ingestion",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Kinesis Data Firehose"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 700
 },
 {
  "slug": "02-data-ingestion-and-storage/kinesis-data-stream-vs-firehose",
  "title": "Kinesis Data Stream Vs Firehose",
  "desc": "Here's a comprehensive comparison between Amazon Kinesis Data Streams (KDS) and Amazon Data Firehose (formerly Kinesis Data Firehose), highlighting their key differences and providing…",
  "file": "/exams/md/02-data-ingestion-and-storage/kinesis-data-stream-vs-firehose.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Streaming ingestion",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Kinesis Data Stream Vs Firehose"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 429
 },
 {
  "slug": "02-data-ingestion-and-storage/kinesis-data-analytics",
  "title": "Kinesis Data Analytics",
  "desc": "Redirect-style note for a stale service name. Use Amazon Managed Service For Apache Flink as the canonical current note.",
  "file": "/exams/md/02-data-ingestion-and-storage/kinesis-data-analytics.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Streaming ingestion",
  "status": "supplemental",
  "domains": [
   "1.2",
   "3.3"
  ],
  "domainScope": "",
  "services": [
   "Amazon Managed Service for Apache Flink"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "stale-name",
   "streaming"
  ],
  "aliases": [
   "Kinesis Data Analytics"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 228
 },
 {
  "slug": "02-data-ingestion-and-storage/kinesis-client-library",
  "title": "Kinesis Client Library (KCL)",
  "desc": "The Kinesis Client Library (KCL) is an open-source library designed to simplify the development of applications that process data from Amazon Kinesis Data Streams. KCL manages the complex…",
  "file": "/exams/md/02-data-ingestion-and-storage/kinesis-client-library.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Streaming ingestion",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Kinesis Client Library (KCL)"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 0,
  "words": 547
 },
 {
  "slug": "02-data-ingestion-and-storage/kinesis-producer-library",
  "title": "Kinesis Producer Library",
  "desc": "The Amazon Kinesis Producer Library (KPL) is a high-performance library designed to simplify and optimize the process of writing data to Amazon Kinesis Data Streams. It handles complex…",
  "file": "/exams/md/02-data-ingestion-and-storage/kinesis-producer-library.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Streaming ingestion",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Kinesis Producer Library"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 567
 },
 {
  "slug": "02-data-ingestion-and-storage/kinesis-video-streams",
  "title": "Amazon Kinesis Video Streams",
  "desc": "In-scope media streaming service for ingesting live video/audio/time-serialized data into AWS.",
  "file": "/exams/md/02-data-ingestion-and-storage/kinesis-video-streams.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Streaming ingestion",
  "status": "reviewed",
  "domains": [
   "1.1",
   "2.1"
  ],
  "domainScope": "",
  "services": [
   "Amazon Kinesis Video Streams"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "media",
   "streaming"
  ],
  "aliases": [
   "Amazon Kinesis Video Streams"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 200
 },
 {
  "slug": "02-data-ingestion-and-storage/managed-streaming-for-apache-kafka",
  "title": "Amazon Managed Streaming for Apache Kafka (Amazon MSK)",
  "desc": "Category Messagi ng & Streaming",
  "file": "/exams/md/02-data-ingestion-and-storage/managed-streaming-for-apache-kafka.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Streaming ingestion",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Amazon Managed Streaming for Apache Kafka (Amazon MSK)"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 656
 },
 {
  "slug": "02-data-ingestion-and-storage/managed-service-for-apache-flink",
  "title": "Amazon Managed Service For Apache Flink",
  "desc": "In-scope streaming analytics service for low-latency stream processing and stateful streaming transformations.",
  "file": "/exams/md/02-data-ingestion-and-storage/managed-service-for-apache-flink.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Streaming ingestion",
  "status": "reviewed",
  "domains": [
   "1.1",
   "1.2",
   "3.3"
  ],
  "domainScope": "",
  "services": [
   "Amazon Managed Service for Apache Flink"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "streaming",
   "flink"
  ],
  "aliases": [
   "Amazon Managed Service For Apache Flink"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 265
 },
 {
  "slug": "02-data-ingestion-and-storage/s3",
  "title": "S3",
  "desc": "Amazon Simple Storage Service (Amazon S3) is AWS’s highly durable and available object storage service, designed to store and retrieve any amount of data from anywhere on the web. It offers…",
  "file": "/exams/md/02-data-ingestion-and-storage/s3.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Storage & transfer",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "S3"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 619
 },
 {
  "slug": "02-data-ingestion-and-storage/s3-glacier",
  "title": "Amazon S3 Glacier Storage Classes",
  "desc": "Archive storage note focused on current S3 Glacier storage classes, not the legacy standalone Amazon Glacier vault API.",
  "file": "/exams/md/02-data-ingestion-and-storage/s3-glacier.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Storage & transfer",
  "status": "reviewed",
  "domains": [
   "1.1",
   "4.2"
  ],
  "domainScope": "",
  "services": [
   "Amazon S3 Glacier storage classes"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "storage",
   "lifecycle"
  ],
  "aliases": [
   "Amazon S3 Glacier Storage Classes"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 233
 },
 {
  "slug": "02-data-ingestion-and-storage/elastic-block-storage",
  "title": "Amazon Elastic Block Store (EBS)",
  "desc": "Amazon Elastic Block Store (EBS) is a scalable, high-performance block storage service designed for use with Amazon EC2 instances. EBS provides persistent storage volumes that can be…",
  "file": "/exams/md/02-data-ingestion-and-storage/elastic-block-storage.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Storage & transfer",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Amazon Elastic Block Store (EBS)"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 331
 },
 {
  "slug": "02-data-ingestion-and-storage/elastic-file-system",
  "title": "Amazon Elastic File System (EFS)",
  "desc": "Amazon Elastic File System (EFS) is a fully managed, scalable, cloud-native Network File System (NFS) that provides simple, serverless, set-and-forget file storage for use with AWS Cloud…",
  "file": "/exams/md/02-data-ingestion-and-storage/elastic-file-system.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Storage & transfer",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Amazon Elastic File System (EFS)"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 568
 },
 {
  "slug": "02-data-ingestion-and-storage/fsx",
  "title": "Amazon FSx",
  "desc": "High-performance file system service; FSx for Lustre is especially relevant for ML/HPC training datasets that need fast POSIX file access.",
  "file": "/exams/md/02-data-ingestion-and-storage/fsx.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Storage & transfer",
  "status": "reviewed",
  "domains": [
   "1.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [
   "Amazon FSx for Lustre"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "storage",
   "sagemaker"
  ],
  "aliases": [
   "Amazon FSx"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 224
 },
 {
  "slug": "02-data-ingestion-and-storage/storage-gateway",
  "title": "AWS Storage Gateway",
  "desc": "Hybrid storage service that connects on-premises environments to AWS storage for ingestion, backup, and migration patterns.",
  "file": "/exams/md/02-data-ingestion-and-storage/storage-gateway.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Storage & transfer",
  "status": "reviewed",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [
   "AWS Storage Gateway"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "storage",
   "hybrid"
  ],
  "aliases": [
   "AWS Storage Gateway"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 201
 },
 {
  "slug": "02-data-ingestion-and-storage/datasync",
  "title": "AWS DataSync",
  "desc": "AWS DataSync is a fully managed data transfer service that simplifies, automates, and accelerates moving large amounts of data between on-premises storage, edge locations, and AWS storage…",
  "file": "/exams/md/02-data-ingestion-and-storage/datasync.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Storage & transfer",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "AWS DataSync"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 0,
  "words": 455
 },
 {
  "slug": "02-data-ingestion-and-storage/database-migration-service",
  "title": "Database Migration Service",
  "desc": "",
  "file": "/exams/md/02-data-ingestion-and-storage/database-migration-service.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Storage & transfer",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Database Migration Service"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 12
 },
 {
  "slug": "02-data-ingestion-and-storage/ec2-instance-types",
  "title": "Amazon EC2 Instance Types Overview",
  "desc": "Amazon EC2 offers a wide variety of instance types optimized for different use cases. Here's a categorized summary of the main EC2 instance families, along with their capabilities in terms…",
  "file": "/exams/md/02-data-ingestion-and-storage/ec2-instance-types.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Storage & transfer",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Amazon EC2 Instance Types Overview"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 530
 },
 {
  "slug": "02-data-ingestion-and-storage/rds",
  "title": "Amazon RDS (Relational Database Service)",
  "desc": "Amazon RDS is a managed service for running relational database engines. RDS handles common operational tasks like provisioning, patching, backups, monitoring, and (engine-dependent)…",
  "file": "/exams/md/02-data-ingestion-and-storage/rds.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Databases",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Amazon RDS (Relational Database Service)"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 250
 },
 {
  "slug": "02-data-ingestion-and-storage/aurora",
  "title": "Amazon Aurora",
  "desc": "Amazon Aurora is a managed relational database engine compatible with MySQL and PostgreSQL, designed for cloud scale. It emphasizes high throughput, fast failover, and decoupled…",
  "file": "/exams/md/02-data-ingestion-and-storage/aurora.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Databases",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Amazon Aurora"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 284
 },
 {
  "slug": "02-data-ingestion-and-storage/dynamodb",
  "title": "Amazon DynamoDB",
  "desc": "Amazon DynamoDB is a fully managed, serverless NoSQL database that supports key-value and document data models. It provides single-digit millisecond latency at scale, with built-in high…",
  "file": "/exams/md/02-data-ingestion-and-storage/dynamodb.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Databases",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Amazon DynamoDB"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 582
 },
 {
  "slug": "02-data-ingestion-and-storage/documentdb",
  "title": "Amazon DocumentDB (with MongoDB compatibility)",
  "desc": "Amazon DocumentDB is a managed document database service designed to be MongoDB API compatible. It’s commonly used for applications built around JSON-like documents, flexible schemas, and…",
  "file": "/exams/md/02-data-ingestion-and-storage/documentdb.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Databases",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Amazon DocumentDB (with MongoDB compatibility)"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 429
 },
 {
  "slug": "02-data-ingestion-and-storage/keyspaces",
  "title": "Amazon Keyspaces (for Apache Cassandra)",
  "desc": "Amazon Keyspaces is a managed, scalable database compatible with Apache Cassandra and the Cassandra Query Language (CQL). It’s designed for high-throughput workloads using a wide-column…",
  "file": "/exams/md/02-data-ingestion-and-storage/keyspaces.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Databases",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Amazon Keyspaces (for Apache Cassandra)"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 210
 },
 {
  "slug": "02-data-ingestion-and-storage/neptune",
  "title": "Amazon Neptune",
  "desc": "Amazon Neptune is a managed graph database designed for workloads where the primary value comes from relationships. It supports common graph query approaches (property graphs and RDF-style…",
  "file": "/exams/md/02-data-ingestion-and-storage/neptune.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Databases",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Amazon Neptune"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 195
 },
 {
  "slug": "02-data-ingestion-and-storage/timestream",
  "title": "Amazon Timestream",
  "desc": "Amazon Timestream is a managed time-series database optimized for data indexed by time (metrics, telemetry, events). It’s designed to make time-window queries and time-based retention…",
  "file": "/exams/md/02-data-ingestion-and-storage/timestream.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Databases",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Amazon Timestream"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 199
 },
 {
  "slug": "02-data-ingestion-and-storage/qldb",
  "title": "Amazon QLDB",
  "desc": "Legacy/supplemental note. Amazon QLDB is in full shutdown and is not a current MLA-C01 study target.",
  "file": "/exams/md/02-data-ingestion-and-storage/qldb.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Databases",
  "status": "legacy",
  "domains": [],
  "domainScope": "supplemental",
  "services": [
   "Amazon QLDB"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "legacy",
   "supplemental"
  ],
  "aliases": [
   "Amazon QLDB"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 158
 },
 {
  "slug": "02-data-ingestion-and-storage/elasticache",
  "title": "Amazon ElastiCache (Redis / Memcached)",
  "desc": "Amazon ElastiCache is a managed in-memory data store service that supports Redis and Memcached. It’s commonly used as a cache in front of databases to reduce latency and offload read…",
  "file": "/exams/md/02-data-ingestion-and-storage/elasticache.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Databases",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Amazon ElastiCache (Redis / Memcached)"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 209
 },
 {
  "slug": "02-data-ingestion-and-storage/sql-databases",
  "title": "SQL Databases in AWS",
  "desc": "(also known as relational databases) are structured systems that store data in tables with predefined schemas. They use Structured Query Language (SQL) for defining, manipulating, and…",
  "file": "/exams/md/02-data-ingestion-and-storage/sql-databases.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Databases",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "SQL Databases in AWS"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 536
 },
 {
  "slug": "02-data-ingestion-and-storage/no-sql-databases",
  "title": "NoSQL Databases in AWS",
  "desc": "are a class of database management systems designed to handle large volumes of unstructured, semi-structured, or structured data that may not fit well into traditional relational (SQL)…",
  "file": "/exams/md/02-data-ingestion-and-storage/no-sql-databases.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Databases",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "NoSQL Databases in AWS"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 572
 },
 {
  "slug": "02-data-ingestion-and-storage/jdbc-odbc",
  "title": "JDBC and ODBC in AWS Machine Learning Workflows",
  "desc": "and ODBC (Open Database Connectivity) are standard APIs that enable applications to connect to and interact with relational databases. JDBC is Java-specific, while ODBC is language-agnostic…",
  "file": "/exams/md/02-data-ingestion-and-storage/jdbc-odbc.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Databases",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "JDBC and ODBC in AWS Machine Learning Workflows"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 804
 },
 {
  "slug": "02-data-ingestion-and-storage/redshift",
  "title": "Amazon Redshift, Redshift ML, Redshift Serverless, and Redshift Data API",
  "desc": "Amazon Redshift is AWS's fully managed, petabyte-scale cloud data warehouse service. It enables fast query performance using columnar storage, massively parallel processing (MPP), and…",
  "file": "/exams/md/02-data-ingestion-and-storage/redshift.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Warehouse & analytics",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Amazon Redshift, Redshift ML, Redshift Serverless, and Redshift Data API"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 940
 },
 {
  "slug": "02-data-ingestion-and-storage/redshift-spectrum",
  "title": "Redshift Spectrum",
  "desc": "is a feature of Amazon Redshift that lets you run SQL queries against exabytes of data in Amazon S3 without having to load the data into Redshift tables. Spectrum extends Redshift’s query…",
  "file": "/exams/md/02-data-ingestion-and-storage/redshift-spectrum.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Warehouse & analytics",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Redshift Spectrum"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 466
 },
 {
  "slug": "02-data-ingestion-and-storage/opensearch-layers",
  "title": "OpenSearch vector search: layers and tradeoffs",
  "desc": "Below is a “stack view” of OpenSearch vector search. Each row is a choice at a different layer (you can mix-and-match: e.g., faiss + hnsw + on_disk).",
  "file": "/exams/md/02-data-ingestion-and-storage/opensearch-layers.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Warehouse & analytics",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "OpenSearch vector search: layers and tradeoffs"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 687
 },
 {
  "slug": "02-data-ingestion-and-storage/quicksight",
  "title": "Amazon Quick Sight",
  "desc": "In-scope analytics/dashboarding service for visualizing data, model outcomes, operational metrics, and cost signals.",
  "file": "/exams/md/02-data-ingestion-and-storage/quicksight.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Warehouse & analytics",
  "status": "reviewed",
  "domains": [
   "4.1",
   "4.2"
  ],
  "domainScope": "",
  "services": [
   "Amazon Quick Sight",
   "Amazon Quick Suite"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4",
   "analytics",
   "dashboarding"
  ],
  "aliases": [
   "Amazon Quick Sight"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 236
 },
 {
  "slug": "02-data-ingestion-and-storage/pandas",
  "title": "Pandas for AWS Machine Learning",
  "desc": "Pandas is a powerful open-source data manipulation and analysis library for Python. It provides fast, flexible, and expressive data structures designed to make working with structured…",
  "file": "/exams/md/02-data-ingestion-and-storage/pandas.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Python toolkit",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Pandas for AWS Machine Learning"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 0,
  "words": 917
 },
 {
  "slug": "02-data-ingestion-and-storage/scikit-learn",
  "title": "Scikit-learn for Machine Learning",
  "desc": "Scikit-learn (sklearn) is a powerful, open-source Python library designed specifically for machine learning. It provides simple and efficient tools for data analysis and modeling, built on…",
  "file": "/exams/md/02-data-ingestion-and-storage/scikit-learn.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Python toolkit",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Scikit-learn for Machine Learning"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 0,
  "words": 1449
 },
 {
  "slug": "02-data-ingestion-and-storage/matplotlib-seaborn",
  "title": "Matplotlib and Seaborn for Data Visualization",
  "desc": "Data visualization is a critical component of the machine learning workflow, enabling data scientists to gain insights from data, detect patterns, identify outliers, and effectively…",
  "file": "/exams/md/02-data-ingestion-and-storage/matplotlib-seaborn.md",
  "track": "exam_data",
  "tab": "Ingestion & storage",
  "group": "Python toolkit",
  "status": "draft",
  "domains": [
   "1.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "02_data_ingestion_and_storage"
  ],
  "aliases": [
   "Matplotlib and Seaborn for Data Visualization"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 0,
  "words": 1383
 },
 {
  "slug": "03-data-transformation-integrity-and-feature-engineering/glue",
  "title": "Glue",
  "desc": "Serverless: Fully managed ETL (Extract, Transform, Load) service—no infrastructure to provision or manage.",
  "file": "/exams/md/03-data-transformation-integrity-and-feature-engineering/glue.md",
  "track": "exam_data",
  "tab": "Transformation & quality",
  "group": "Transformation engines",
  "status": "draft",
  "domains": [
   "1.2",
   "1.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "03_data_transformation_integrity_and_feature_engineering"
  ],
  "aliases": [
   "Glue"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 1027
 },
 {
  "slug": "03-data-transformation-integrity-and-feature-engineering/spark",
  "title": "What is Apache Spark?",
  "desc": "is an open-source, distributed computing engine designed for fast, large-scale data processing. It is widely used for big data analytics, data engineering, and machine learning tasks.",
  "file": "/exams/md/03-data-transformation-integrity-and-feature-engineering/spark.md",
  "track": "exam_data",
  "tab": "Transformation & quality",
  "group": "Transformation engines",
  "status": "draft",
  "domains": [
   "1.2",
   "1.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "03_data_transformation_integrity_and_feature_engineering"
  ],
  "aliases": [
   "What is Apache Spark?"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 194
 },
 {
  "slug": "03-data-transformation-integrity-and-feature-engineering/spark-integrations",
  "title": "Apache Spark & AWS Integration Notes",
  "desc": "The SageMakerEstimator classes allow tight integration between Spark and SageMaker for several models including XGBoost, and offer the simplest solution for distributed ML from Spark. Note:",
  "file": "/exams/md/03-data-transformation-integrity-and-feature-engineering/spark-integrations.md",
  "track": "exam_data",
  "tab": "Transformation & quality",
  "group": "Transformation engines",
  "status": "draft",
  "domains": [
   "1.2",
   "1.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "03_data_transformation_integrity_and_feature_engineering"
  ],
  "aliases": [
   "Apache Spark & AWS Integration Notes"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 953
 },
 {
  "slug": "03-data-transformation-integrity-and-feature-engineering/elastic-map-reduce",
  "title": "Elastic Map Reduce",
  "desc": "Amazon EMR is a managed big data platform designed to process vast amounts of data using open-source frameworks such as Apache Hadoop, Spark, HBase, Presto, and more. It is engineered for…",
  "file": "/exams/md/03-data-transformation-integrity-and-feature-engineering/elastic-map-reduce.md",
  "track": "exam_data",
  "tab": "Transformation & quality",
  "group": "Transformation engines",
  "status": "draft",
  "domains": [
   "1.2",
   "1.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "03_data_transformation_integrity_and_feature_engineering"
  ],
  "aliases": [
   "Elastic Map Reduce"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 2498
 },
 {
  "slug": "03-data-transformation-integrity-and-feature-engineering/hadoop",
  "title": "What is Apache Hadoop?",
  "desc": "is an open-source framework for distributed storage and processing of large datasets across clusters of computers. It is designed to scale from a single server to thousands of machines,…",
  "file": "/exams/md/03-data-transformation-integrity-and-feature-engineering/hadoop.md",
  "track": "exam_data",
  "tab": "Transformation & quality",
  "group": "Transformation engines",
  "status": "draft",
  "domains": [
   "1.2",
   "1.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "03_data_transformation_integrity_and_feature_engineering"
  ],
  "aliases": [
   "What is Apache Hadoop?"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 208
 },
 {
  "slug": "03-data-transformation-integrity-and-feature-engineering/hive",
  "title": "What is Apache Hive?",
  "desc": "is an open-source data warehouse system built on top of Hadoop for querying and analyzing large datasets stored in distributed storage. It provides a SQL-like interface (HiveQL) to manage…",
  "file": "/exams/md/03-data-transformation-integrity-and-feature-engineering/hive.md",
  "track": "exam_data",
  "tab": "Transformation & quality",
  "group": "Transformation engines",
  "status": "draft",
  "domains": [
   "1.2",
   "1.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "03_data_transformation_integrity_and_feature_engineering"
  ],
  "aliases": [
   "What is Apache Hive?"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 183
 },
 {
  "slug": "03-data-transformation-integrity-and-feature-engineering/presto",
  "title": "What is Presto?",
  "desc": "is an open-source, distributed SQL query engine designed for fast, interactive analytics on large datasets. It allows you to run SQL queries across data stored in a variety of sources,…",
  "file": "/exams/md/03-data-transformation-integrity-and-feature-engineering/presto.md",
  "track": "exam_data",
  "tab": "Transformation & quality",
  "group": "Transformation engines",
  "status": "draft",
  "domains": [
   "1.2",
   "1.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "03_data_transformation_integrity_and_feature_engineering"
  ],
  "aliases": [
   "What is Presto?"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 191
 },
 {
  "slug": "03-data-transformation-integrity-and-feature-engineering/athena",
  "title": "Amazon Athena",
  "desc": "Amazon Athena is a serverless, interactive query service that enables you to analyze data directly in Amazon S3 using standard SQL. With Athena, there is no infrastructure to manage, and…",
  "file": "/exams/md/03-data-transformation-integrity-and-feature-engineering/athena.md",
  "track": "exam_data",
  "tab": "Transformation & quality",
  "group": "Transformation engines",
  "status": "draft",
  "domains": [
   "1.2",
   "1.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "03_data_transformation_integrity_and_feature_engineering"
  ],
  "aliases": [
   "Amazon Athena"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 529
 },
 {
  "slug": "03-data-transformation-integrity-and-feature-engineering/data-quality-validation",
  "title": "Data Quality Validation",
  "desc": "Cross-service note for validating ML datasets before training and monitoring quality drift after deployment.",
  "file": "/exams/md/03-data-transformation-integrity-and-feature-engineering/data-quality-validation.md",
  "track": "exam_data",
  "tab": "Transformation & quality",
  "group": "Quality & feature engineering",
  "status": "reviewed",
  "domains": [
   "1.3",
   "4.1"
  ],
  "domainScope": "",
  "services": [
   "AWS Glue Data Quality",
   "AWS Glue DataBrew"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "data-quality"
  ],
  "aliases": [
   "Data Quality Validation"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 217
 },
 {
  "slug": "03-data-transformation-integrity-and-feature-engineering/glue-data-quality",
  "title": "AWS Glue Data Quality",
  "desc": "Domain 1 and Domain 4 feature for measuring, monitoring, and enforcing data quality before and during ML workflows.",
  "file": "/exams/md/03-data-transformation-integrity-and-feature-engineering/glue-data-quality.md",
  "track": "exam_data",
  "tab": "Transformation & quality",
  "group": "Quality & feature engineering",
  "status": "reviewed",
  "domains": [
   "1.3",
   "4.1"
  ],
  "domainScope": "",
  "services": [
   "AWS Glue"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "domain-4",
   "glue",
   "data-quality"
  ],
  "aliases": [
   "AWS Glue Data Quality"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 258
 },
 {
  "slug": "03-data-transformation-integrity-and-feature-engineering/feature-engineering",
  "title": "Feature Engineering",
  "desc": "Feature engineering is the practice of leveraging domain knowledge to create, transform, select, and optimize the variables (features) used to train machine learning models. Unlike simply…",
  "file": "/exams/md/03-data-transformation-integrity-and-feature-engineering/feature-engineering.md",
  "track": "exam_data",
  "tab": "Transformation & quality",
  "group": "Quality & feature engineering",
  "status": "draft",
  "domains": [
   "1.2",
   "1.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "03_data_transformation_integrity_and_feature_engineering"
  ],
  "aliases": [
   "Feature Engineering"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 1304
 },
 {
  "slug": "03-data-transformation-integrity-and-feature-engineering/encoding-techniques",
  "title": "Encoding Techniques",
  "desc": "Feature engineering note for converting categorical/text values into model-usable numeric representations.",
  "file": "/exams/md/03-data-transformation-integrity-and-feature-engineering/encoding-techniques.md",
  "track": "exam_data",
  "tab": "Transformation & quality",
  "group": "Quality & feature engineering",
  "status": "reviewed",
  "domains": [
   "1.2",
   "2.1"
  ],
  "domainScope": "",
  "services": [
   "SageMaker Data Wrangler"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "feature-engineering"
  ],
  "aliases": [
   "Encoding Techniques"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 189
 },
 {
  "slug": "03-data-transformation-integrity-and-feature-engineering/tf-idf",
  "title": "Tf Idf",
  "desc": "is a numerical statistic used in information retrieval and text mining to reflect how important a word is to a document in a collection (or corpus). The main idea behind TF-IDF is to weigh…",
  "file": "/exams/md/03-data-transformation-integrity-and-feature-engineering/tf-idf.md",
  "track": "exam_data",
  "tab": "Transformation & quality",
  "group": "Quality & feature engineering",
  "status": "draft",
  "domains": [
   "1.2",
   "1.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "03_data_transformation_integrity_and_feature_engineering"
  ],
  "aliases": [
   "Tf Idf"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 891
 },
 {
  "slug": "03-data-transformation-integrity-and-feature-engineering/l1-and-l2-regularization",
  "title": "L1 and L2 Regularization: Quick Reference & Practical Guide",
  "desc": "L1 and L2 regularization are techniques to prevent overfitting by adding a penalty to the loss function, discouraging overly complex models. They help improve generalization by constraining…",
  "file": "/exams/md/03-data-transformation-integrity-and-feature-engineering/l1-and-l2-regularization.md",
  "track": "exam_data",
  "tab": "Transformation & quality",
  "group": "Quality & feature engineering",
  "status": "draft",
  "domains": [
   "1.2",
   "1.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "03_data_transformation_integrity_and_feature_engineering"
  ],
  "aliases": [
   "L1 and L2 Regularization: Quick Reference & Practical Guide"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 562
 },
 {
  "slug": "12-sql/sql-fundamentals",
  "title": "SQL fundamentals",
  "desc": "SQL underpins transactional systems that feed ML feature stores and analytics workloads on AWS.",
  "file": "/exams/md/12-sql/sql-fundamentals.md",
  "track": "exam_data",
  "tab": "SQL",
  "group": "",
  "status": "draft",
  "domains": [
   "1.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "12_sql"
  ],
  "aliases": [
   "SQL fundamentals"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 1,
  "words": 571
 },
 {
  "slug": "12-sql/sql-analytics-patterns",
  "title": "SQL analytics patterns",
  "desc": "AWS data engineers translate business KPIs into SQL for dashboards, feature stores, and ML datasets.",
  "file": "/exams/md/12-sql/sql-analytics-patterns.md",
  "track": "exam_data",
  "tab": "SQL",
  "group": "",
  "status": "draft",
  "domains": [
   "1.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "12_sql"
  ],
  "aliases": [
   "SQL analytics patterns"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 1,
  "words": 591
 },
 {
  "slug": "12-sql/sql-performance-tuning",
  "title": "SQL performance tuning",
  "desc": "Poorly tuned queries inflate cost on Amazon Redshift and Amazon RDS and can break pipeline SLAs.",
  "file": "/exams/md/12-sql/sql-performance-tuning.md",
  "track": "exam_data",
  "tab": "SQL",
  "group": "",
  "status": "draft",
  "domains": [
   "1.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "12_sql"
  ],
  "aliases": [
   "SQL performance tuning"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 1,
  "words": 455
 },
 {
  "slug": "12-sql/sql-on-aws",
  "title": "SQL on AWS",
  "desc": "AWS services expose SQL interfaces for transactional apps, analytics, and serverless querying.",
  "file": "/exams/md/12-sql/sql-on-aws.md",
  "track": "exam_data",
  "tab": "SQL",
  "group": "",
  "status": "draft",
  "domains": [
   "1.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "12_sql"
  ],
  "aliases": [
   "SQL on AWS"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 1,
  "words": 548
 },
 {
  "slug": "12-sql/sql-quick-reference",
  "title": "SQL quick reference",
  "desc": "Short, exam-ready reminders for common SQL tasks and patterns.",
  "file": "/exams/md/12-sql/sql-quick-reference.md",
  "track": "exam_data",
  "tab": "SQL",
  "group": "",
  "status": "draft",
  "domains": [
   "1.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "12_sql"
  ],
  "aliases": [
   "SQL quick reference"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 1,
  "words": 652
 },
 {
  "slug": "04-model-training-tuning-and-evaluation/model-hyperparameters",
  "title": "Model Hyperparameters in Machine Learning",
  "desc": "are external configurations set before the training process begins, controlling how a machine learning model learns from data. Unlike model parameters (e.g., weights in neural networks or…",
  "file": "/exams/md/04-model-training-tuning-and-evaluation/model-hyperparameters.md",
  "track": "exam_modeling",
  "tab": "Training & evaluation",
  "group": "Training & tuning",
  "status": "draft",
  "domains": [
   "2.2",
   "2.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "04_model_training_tuning_and_evaluation"
  ],
  "aliases": [
   "Model Hyperparameters in Machine Learning"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 1,
  "words": 731
 },
 {
  "slug": "04-model-training-tuning-and-evaluation/automatic-model-tuning-and-hyperparameter-tuning",
  "title": "📗 **AWS Automatic Model Tuning (AMT) & Hyperparameter Tuning**",
  "desc": "AWS Automatic Model Tuning (AMT) is a fully managed hyperparameter optimization service within Amazon SageMaker. It automatically searches for optimal combinations of hyperparameters to…",
  "file": "/exams/md/04-model-training-tuning-and-evaluation/automatic-model-tuning-and-hyperparameter-tuning.md",
  "track": "exam_modeling",
  "tab": "Training & evaluation",
  "group": "Training & tuning",
  "status": "draft",
  "domains": [
   "2.2",
   "2.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "04_model_training_tuning_and_evaluation"
  ],
  "aliases": [
   "📗 **AWS Automatic Model Tuning (AMT) & Hyperparameter Tuning**"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 1,
  "words": 858
 },
 {
  "slug": "04-model-training-tuning-and-evaluation/model-baselines-and-convergence",
  "title": "Model Baselines And Convergence",
  "desc": "Model development concept note for comparing models to baselines and detecting convergence or non-convergence during training/tuning.",
  "file": "/exams/md/04-model-training-tuning-and-evaluation/model-baselines-and-convergence.md",
  "track": "exam_modeling",
  "tab": "Training & evaluation",
  "group": "Training & tuning",
  "status": "reviewed",
  "domains": [
   "2.2",
   "2.3"
  ],
  "domainScope": "",
  "services": [
   "Amazon SageMaker AI"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "model-evaluation"
  ],
  "aliases": [
   "Model Baselines And Convergence"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 219
 },
 {
  "slug": "04-model-training-tuning-and-evaluation/training-compiler",
  "title": "Training Compiler",
  "desc": "Redirect-style legacy note. The canonical note is SageMaker Training Compiler.",
  "file": "/exams/md/04-model-training-tuning-and-evaluation/training-compiler.md",
  "track": "exam_modeling",
  "tab": "Training & evaluation",
  "group": "Training & tuning",
  "status": "legacy",
  "domains": [
   "2.2"
  ],
  "domainScope": "",
  "services": [
   "Amazon SageMaker AI"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "legacy",
   "training"
  ],
  "aliases": [
   "Training Compiler"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 137
 },
 {
  "slug": "04-model-training-tuning-and-evaluation/efa-and-mics",
  "title": "Elastic Fabric Adapter (EFA) & MiCS (Minimize Communication Scale)",
  "desc": "Elastic Fabric Adapter (EFA)",
  "file": "/exams/md/04-model-training-tuning-and-evaluation/efa-and-mics.md",
  "track": "exam_modeling",
  "tab": "Training & evaluation",
  "group": "Training & tuning",
  "status": "draft",
  "domains": [
   "2.2",
   "2.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "04_model_training_tuning_and_evaluation"
  ],
  "aliases": [
   "Elastic Fabric Adapter (EFA) & MiCS (Minimize Communication Scale)"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 1,
  "words": 550
 },
 {
  "slug": "04-model-training-tuning-and-evaluation/tensorboard-integration-in-sagemaker",
  "title": "Tensorboard Integration In SageMaker",
  "desc": "TensorBoard is the standard visualization toolkit for TensorFlow (and now supported by PyTorch). In SageMaker, you can launch a hosted TensorBoard instance that points at your training…",
  "file": "/exams/md/04-model-training-tuning-and-evaluation/tensorboard-integration-in-sagemaker.md",
  "track": "exam_modeling",
  "tab": "Training & evaluation",
  "group": "Training & tuning",
  "status": "draft",
  "domains": [
   "2.2",
   "2.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "04_model_training_tuning_and_evaluation"
  ],
  "aliases": [
   "Tensorboard Integration In SageMaker"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 1,
  "words": 483
 },
 {
  "slug": "04-model-training-tuning-and-evaluation/transfer-learning",
  "title": "Transfer Learning",
  "desc": "Definition: leveraging knowledge gained in one domain or task to improve performance on a different but related task.",
  "file": "/exams/md/04-model-training-tuning-and-evaluation/transfer-learning.md",
  "track": "exam_modeling",
  "tab": "Training & evaluation",
  "group": "Training & tuning",
  "status": "draft",
  "domains": [
   "2.2",
   "2.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "04_model_training_tuning_and_evaluation"
  ],
  "aliases": [
   "Transfer Learning"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 1,
  "words": 532
 },
 {
  "slug": "04-model-training-tuning-and-evaluation/neural-networks",
  "title": "Neural Networks",
  "desc": "A neural network is a computational model inspired by the human brain's network of neurons. It consists of interconnected layers of nodes (neurons), where each connection has an associated…",
  "file": "/exams/md/04-model-training-tuning-and-evaluation/neural-networks.md",
  "track": "exam_modeling",
  "tab": "Training & evaluation",
  "group": "Neural networks",
  "status": "draft",
  "domains": [
   "2.2",
   "2.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "04_model_training_tuning_and_evaluation"
  ],
  "aliases": [
   "Neural Networks"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 1,
  "words": 695
 },
 {
  "slug": "04-model-training-tuning-and-evaluation/activation-functions",
  "title": "Activation Functions",
  "desc": "Activation functions are crucial in neural networks as they introduce non-linearity, allowing the model to learn complex patterns. They determine how the weighted sum of inputs is…",
  "file": "/exams/md/04-model-training-tuning-and-evaluation/activation-functions.md",
  "track": "exam_modeling",
  "tab": "Training & evaluation",
  "group": "Neural networks",
  "status": "draft",
  "domains": [
   "2.2",
   "2.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "04_model_training_tuning_and_evaluation"
  ],
  "aliases": [
   "Activation Functions"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 1,
  "words": 454
 },
 {
  "slug": "04-model-training-tuning-and-evaluation/convolutional-neural-networks",
  "title": "Convolutional Neural Networks (CNNs)",
  "desc": "Handle data that doesn’t align neatly into columns (e.g., images, sequential text).",
  "file": "/exams/md/04-model-training-tuning-and-evaluation/convolutional-neural-networks.md",
  "track": "exam_modeling",
  "tab": "Training & evaluation",
  "group": "Neural networks",
  "status": "draft",
  "domains": [
   "2.2",
   "2.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "04_model_training_tuning_and_evaluation"
  ],
  "aliases": [
   "Convolutional Neural Networks (CNNs)"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 1,
  "words": 356
 },
 {
  "slug": "04-model-training-tuning-and-evaluation/recurrent-neural-networks",
  "title": "Recurrent Neural Networks (RNNs)\\*\\*",
  "desc": "Time-series prediction: modeling sequential data where past inputs influence future outputs. - Stock prices, sensor logs, web traffic, self-driving car trajectories.",
  "file": "/exams/md/04-model-training-tuning-and-evaluation/recurrent-neural-networks.md",
  "track": "exam_modeling",
  "tab": "Training & evaluation",
  "group": "Neural networks",
  "status": "draft",
  "domains": [
   "2.2",
   "2.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "04_model_training_tuning_and_evaluation"
  ],
  "aliases": [
   "Recurrent Neural Networks (RNNs)\\*\\*"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 1,
  "words": 451
 },
 {
  "slug": "04-model-training-tuning-and-evaluation/model-metrics",
  "title": "Model Metrics",
  "desc": "A confusion matrix is a fundamental tool in machine learning for evaluating the performance of classification models, especially when dealing with imbalanced datasets or when the costs of…",
  "file": "/exams/md/04-model-training-tuning-and-evaluation/model-metrics.md",
  "track": "exam_modeling",
  "tab": "Training & evaluation",
  "group": "Evaluation",
  "status": "draft",
  "domains": [
   "2.2",
   "2.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "04_model_training_tuning_and_evaluation"
  ],
  "aliases": [
   "Model Metrics"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 1,
  "words": 1170
 },
 {
  "slug": "04-model-training-tuning-and-evaluation/model-selection-decision-guide",
  "title": "Model Selection Decision Guide",
  "desc": "Scenario guide for choosing between AWS AI services, SageMaker built-in algorithms, custom training, JumpStart, and Bedrock models.",
  "file": "/exams/md/04-model-training-tuning-and-evaluation/model-selection-decision-guide.md",
  "track": "exam_modeling",
  "tab": "Training & evaluation",
  "group": "Evaluation",
  "status": "reviewed",
  "domains": [
   "2.1",
   "2.3"
  ],
  "domainScope": "",
  "services": [
   "Amazon SageMaker AI",
   "Amazon Bedrock"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "model-selection"
  ],
  "aliases": [
   "Model Selection Decision Guide"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 250
 },
 {
  "slug": "06-sagemaker-built-in-algorithms/sagemaker-built-in-algorithms-cheat-sheet",
  "title": "SageMaker Built-In Algorithms Cheat Sheet",
  "desc": "Use this as the first-stop decision table for SageMaker AI built-in algorithm questions.",
  "file": "/exams/md/06-sagemaker-built-in-algorithms/sagemaker-built-in-algorithms-cheat-sheet.md",
  "track": "exam_modeling",
  "tab": "Built-in algorithms",
  "group": "Choosing an algorithm",
  "status": "reviewed",
  "domains": [
   "2.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [
   "Amazon SageMaker AI"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "sagemaker",
   "built-in-algorithms"
  ],
  "aliases": [
   "SageMaker Built-In Algorithms Cheat Sheet"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 5,
  "words": 366
 },
 {
  "slug": "06-sagemaker-built-in-algorithms/supervised-and-unsupervised-models",
  "title": "Supervised And Unsupervised Models",
  "desc": "Amazon SageMaker offers a broad portfolio of built-in algorithms for both supervised and unsupervised learning, enabling use cases from classification and regression to clustering, anomaly…",
  "file": "/exams/md/06-sagemaker-built-in-algorithms/supervised-and-unsupervised-models.md",
  "track": "exam_modeling",
  "tab": "Built-in algorithms",
  "group": "Choosing an algorithm",
  "status": "draft",
  "domains": [
   "2.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "06_sagemaker_built_in_algorithms"
  ],
  "aliases": [
   "Supervised And Unsupervised Models"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 877
 },
 {
  "slug": "06-sagemaker-built-in-algorithms/linear-learner",
  "title": "Linear Learner",
  "desc": "Amazon SageMaker's Linear Learner algorithm is a supervised learning method designed to address both classification and regression tasks. It achieves this by learning a linear function (for…",
  "file": "/exams/md/06-sagemaker-built-in-algorithms/linear-learner.md",
  "track": "exam_modeling",
  "tab": "Built-in algorithms",
  "group": "Tabular & regression",
  "status": "draft",
  "domains": [
   "2.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "06_sagemaker_built_in_algorithms"
  ],
  "aliases": [
   "Linear Learner"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 445
 },
 {
  "slug": "06-sagemaker-built-in-algorithms/xgboost",
  "title": "Xgboost",
  "desc": "Amazon SageMaker integrates XGBoost (eXtreme Gradient Boosting), a powerful and efficient open-source implementation of the gradient boosted trees algorithm. XGBoost is renowned for its…",
  "file": "/exams/md/06-sagemaker-built-in-algorithms/xgboost.md",
  "track": "exam_modeling",
  "tab": "Built-in algorithms",
  "group": "Tabular & regression",
  "status": "draft",
  "domains": [
   "2.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "06_sagemaker_built_in_algorithms"
  ],
  "aliases": [
   "Xgboost"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 544
 },
 {
  "slug": "06-sagemaker-built-in-algorithms/light-gbm",
  "title": "Light Gbm",
  "desc": "(Light Gradient Boosting Machine) is an open-source, high-performance framework developed by Microsoft for gradient boosting on decision trees. It is designed to be efficient and scalable,…",
  "file": "/exams/md/06-sagemaker-built-in-algorithms/light-gbm.md",
  "track": "exam_modeling",
  "tab": "Built-in algorithms",
  "group": "Tabular & regression",
  "status": "draft",
  "domains": [
   "2.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "06_sagemaker_built_in_algorithms"
  ],
  "aliases": [
   "Light Gbm"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 342
 },
 {
  "slug": "06-sagemaker-built-in-algorithms/catboost",
  "title": "CatBoost",
  "desc": "SageMaker AI built-in gradient-boosted tree algorithm with strong categorical feature handling.",
  "file": "/exams/md/06-sagemaker-built-in-algorithms/catboost.md",
  "track": "exam_modeling",
  "tab": "Built-in algorithms",
  "group": "Tabular & regression",
  "status": "reviewed",
  "domains": [
   "2.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [
   "Amazon SageMaker AI"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "sagemaker",
   "built-in-algorithm"
  ],
  "aliases": [
   "CatBoost"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 225
 },
 {
  "slug": "06-sagemaker-built-in-algorithms/autogluon-tabular",
  "title": "AutoGluon-Tabular",
  "desc": "SageMaker AI built-in tabular AutoML algorithm for classification, regression, and ranking.",
  "file": "/exams/md/06-sagemaker-built-in-algorithms/autogluon-tabular.md",
  "track": "exam_modeling",
  "tab": "Built-in algorithms",
  "group": "Tabular & regression",
  "status": "reviewed",
  "domains": [
   "2.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [
   "Amazon SageMaker AI"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "sagemaker",
   "built-in-algorithm"
  ],
  "aliases": [
   "AutoGluon-Tabular"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 229
 },
 {
  "slug": "06-sagemaker-built-in-algorithms/tabtransformer",
  "title": "TabTransformer",
  "desc": "SageMaker AI built-in deep learning algorithm for tabular classification/regression with categorical features.",
  "file": "/exams/md/06-sagemaker-built-in-algorithms/tabtransformer.md",
  "track": "exam_modeling",
  "tab": "Built-in algorithms",
  "group": "Tabular & regression",
  "status": "reviewed",
  "domains": [
   "2.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [
   "Amazon SageMaker AI"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "sagemaker",
   "built-in-algorithm"
  ],
  "aliases": [
   "TabTransformer"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 221
 },
 {
  "slug": "06-sagemaker-built-in-algorithms/factorization-machines",
  "title": "Factorization Machines",
  "desc": "Amazon SageMaker's Factorization Machines is a supervised learning algorithm specifically designed for handling sparse data in recommendation systems and click prediction tasks. It excels…",
  "file": "/exams/md/06-sagemaker-built-in-algorithms/factorization-machines.md",
  "track": "exam_modeling",
  "tab": "Built-in algorithms",
  "group": "Tabular & regression",
  "status": "draft",
  "domains": [
   "2.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "06_sagemaker_built_in_algorithms"
  ],
  "aliases": [
   "Factorization Machines"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 369
 },
 {
  "slug": "06-sagemaker-built-in-algorithms/k-nearest-neighbor",
  "title": "K Nearest Neighbor",
  "desc": "Amazon SageMaker's k-NN is a simple yet powerful algorithm for both classification and regression tasks. It operates on the principle that similar data points tend to have similar outcomes,…",
  "file": "/exams/md/06-sagemaker-built-in-algorithms/k-nearest-neighbor.md",
  "track": "exam_modeling",
  "tab": "Built-in algorithms",
  "group": "Tabular & regression",
  "status": "draft",
  "domains": [
   "2.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "06_sagemaker_built_in_algorithms"
  ],
  "aliases": [
   "K Nearest Neighbor"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 370
 },
 {
  "slug": "06-sagemaker-built-in-algorithms/blazing-text",
  "title": "Blazing Text",
  "desc": "Amazon SageMaker's BlazingText is a highly optimized algorithm designed for natural language processing (NLP) tasks, offering implementations for both text classification and Word2Vec…",
  "file": "/exams/md/06-sagemaker-built-in-algorithms/blazing-text.md",
  "track": "exam_modeling",
  "tab": "Built-in algorithms",
  "group": "Text & NLP",
  "status": "draft",
  "domains": [
   "2.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "06_sagemaker_built_in_algorithms"
  ],
  "aliases": [
   "Blazing Text"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 388
 },
 {
  "slug": "06-sagemaker-built-in-algorithms/text-classification-tensorflow",
  "title": "Text Classification - TensorFlow",
  "desc": "SageMaker AI supervised transfer-learning algorithm for text classification.",
  "file": "/exams/md/06-sagemaker-built-in-algorithms/text-classification-tensorflow.md",
  "track": "exam_modeling",
  "tab": "Built-in algorithms",
  "group": "Text & NLP",
  "status": "reviewed",
  "domains": [
   "2.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [
   "Amazon SageMaker AI"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "sagemaker",
   "built-in-algorithm"
  ],
  "aliases": [
   "Text Classification - TensorFlow"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 225
 },
 {
  "slug": "06-sagemaker-built-in-algorithms/seq2seq",
  "title": "Seq2seq",
  "desc": "Amazon SageMaker's Sequence-to-Sequence (Seq2Seq) algorithm is a supervised learning model designed to transform sequences of tokens from one domain to another. Common applications include…",
  "file": "/exams/md/06-sagemaker-built-in-algorithms/seq2seq.md",
  "track": "exam_modeling",
  "tab": "Built-in algorithms",
  "group": "Text & NLP",
  "status": "draft",
  "domains": [
   "2.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "06_sagemaker_built_in_algorithms"
  ],
  "aliases": [
   "Seq2seq"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 418
 },
 {
  "slug": "06-sagemaker-built-in-algorithms/latent-dirichlet-allocation",
  "title": "Latent Dirichlet Allocation",
  "desc": "Amazon SageMaker's LDA is an unsupervised machine learning algorithm designed for topic modeling, capable of identifying latent topics within a collection of documents. Unlike deep learning…",
  "file": "/exams/md/06-sagemaker-built-in-algorithms/latent-dirichlet-allocation.md",
  "track": "exam_modeling",
  "tab": "Built-in algorithms",
  "group": "Text & NLP",
  "status": "draft",
  "domains": [
   "2.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "06_sagemaker_built_in_algorithms"
  ],
  "aliases": [
   "Latent Dirichlet Allocation"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 585
 },
 {
  "slug": "06-sagemaker-built-in-algorithms/neural-topic-model",
  "title": "Neural Topic Model",
  "desc": "The Neural Topic Model (NTM) in Amazon SageMaker is an unsupervised learning algorithm designed to organize a corpus of documents into topics based on statistical distributions of words…",
  "file": "/exams/md/06-sagemaker-built-in-algorithms/neural-topic-model.md",
  "track": "exam_modeling",
  "tab": "Built-in algorithms",
  "group": "Text & NLP",
  "status": "draft",
  "domains": [
   "2.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "06_sagemaker_built_in_algorithms"
  ],
  "aliases": [
   "Neural Topic Model"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 403
 },
 {
  "slug": "06-sagemaker-built-in-algorithms/object2vec",
  "title": "Object2vec",
  "desc": "Amazon SageMaker's Object2Vec is a versatile neural embedding algorithm designed to learn low-dimensional, dense embeddings of high-dimensional objects. It generalizes the concept of word…",
  "file": "/exams/md/06-sagemaker-built-in-algorithms/object2vec.md",
  "track": "exam_modeling",
  "tab": "Built-in algorithms",
  "group": "Text & NLP",
  "status": "draft",
  "domains": [
   "2.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "06_sagemaker_built_in_algorithms"
  ],
  "aliases": [
   "Object2vec"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 597
 },
 {
  "slug": "06-sagemaker-built-in-algorithms/image-classification",
  "title": "Image Classification",
  "desc": "Image classification is a fundamental task in computer vision that involves assigning one or more labels to an image, indicating the presence of specific objects or features. Unlike object…",
  "file": "/exams/md/06-sagemaker-built-in-algorithms/image-classification.md",
  "track": "exam_modeling",
  "tab": "Built-in algorithms",
  "group": "Computer vision",
  "status": "draft",
  "domains": [
   "2.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "06_sagemaker_built_in_algorithms"
  ],
  "aliases": [
   "Image Classification"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 372
 },
 {
  "slug": "06-sagemaker-built-in-algorithms/image-classification-tensorflow",
  "title": "Image Classification - TensorFlow",
  "desc": "SageMaker AI supervised transfer-learning algorithm for image classification.",
  "file": "/exams/md/06-sagemaker-built-in-algorithms/image-classification-tensorflow.md",
  "track": "exam_modeling",
  "tab": "Built-in algorithms",
  "group": "Computer vision",
  "status": "reviewed",
  "domains": [
   "2.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [
   "Amazon SageMaker AI"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "sagemaker",
   "built-in-algorithm"
  ],
  "aliases": [
   "Image Classification - TensorFlow"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 215
 },
 {
  "slug": "06-sagemaker-built-in-algorithms/object-detection",
  "title": "Object Detection",
  "desc": "Object detection is a computer vision technique that identifies and localizes objects within an image by drawing bounding boxes around them and classifying them into predefined categories.…",
  "file": "/exams/md/06-sagemaker-built-in-algorithms/object-detection.md",
  "track": "exam_modeling",
  "tab": "Built-in algorithms",
  "group": "Computer vision",
  "status": "draft",
  "domains": [
   "2.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "06_sagemaker_built_in_algorithms"
  ],
  "aliases": [
   "Object Detection"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 446
 },
 {
  "slug": "06-sagemaker-built-in-algorithms/object-detection-tensorflow",
  "title": "Object Detection - TensorFlow",
  "desc": "SageMaker AI supervised transfer-learning algorithm for object detection.",
  "file": "/exams/md/06-sagemaker-built-in-algorithms/object-detection-tensorflow.md",
  "track": "exam_modeling",
  "tab": "Built-in algorithms",
  "group": "Computer vision",
  "status": "reviewed",
  "domains": [
   "2.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [
   "Amazon SageMaker AI"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "sagemaker",
   "built-in-algorithm"
  ],
  "aliases": [
   "Object Detection - TensorFlow"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 218
 },
 {
  "slug": "06-sagemaker-built-in-algorithms/semantic-segmentation",
  "title": "Semantic Segmentation",
  "desc": "Pixel-level object classification: Assigns a class to each individual pixel in an image, generating a segmentation mask.",
  "file": "/exams/md/06-sagemaker-built-in-algorithms/semantic-segmentation.md",
  "track": "exam_modeling",
  "tab": "Built-in algorithms",
  "group": "Computer vision",
  "status": "draft",
  "domains": [
   "2.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "06_sagemaker_built_in_algorithms"
  ],
  "aliases": [
   "Semantic Segmentation"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 344
 },
 {
  "slug": "06-sagemaker-built-in-algorithms/deep-ar",
  "title": "Deep Ar",
  "desc": "DeepAR is a supervised learning algorithm developed by Amazon SageMaker for forecasting one-dimensional time series data. It utilizes recurrent neural networks (RNNs) to model temporal…",
  "file": "/exams/md/06-sagemaker-built-in-algorithms/deep-ar.md",
  "track": "exam_modeling",
  "tab": "Built-in algorithms",
  "group": "Time series & anomaly",
  "status": "draft",
  "domains": [
   "2.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "06_sagemaker_built_in_algorithms"
  ],
  "aliases": [
   "Deep Ar"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 501
 },
 {
  "slug": "06-sagemaker-built-in-algorithms/random-cut-forest",
  "title": "Random Cut Forest",
  "desc": "Random Cut Forest (RCF) is an unsupervised machine learning algorithm developed by Amazon Web Services (AWS) for anomaly detection. It identifies data points that deviate significantly from…",
  "file": "/exams/md/06-sagemaker-built-in-algorithms/random-cut-forest.md",
  "track": "exam_modeling",
  "tab": "Built-in algorithms",
  "group": "Time series & anomaly",
  "status": "draft",
  "domains": [
   "2.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "06_sagemaker_built_in_algorithms"
  ],
  "aliases": [
   "Random Cut Forest"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 277
 },
 {
  "slug": "06-sagemaker-built-in-algorithms/ip-insights",
  "title": "Ip Insights",
  "desc": "Amazon SageMaker's IP Insights is an unsupervised machine learning algorithm designed to detect anomalous behavior in IP address usage patterns. It learns from historical data comprising…",
  "file": "/exams/md/06-sagemaker-built-in-algorithms/ip-insights.md",
  "track": "exam_modeling",
  "tab": "Built-in algorithms",
  "group": "Time series & anomaly",
  "status": "draft",
  "domains": [
   "2.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "06_sagemaker_built_in_algorithms"
  ],
  "aliases": [
   "Ip Insights"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 407
 },
 {
  "slug": "06-sagemaker-built-in-algorithms/k-means",
  "title": "K Means",
  "desc": "K-Means Clustering is an unsupervised machine learning algorithm that partitions data into _k_ distinct clusters based on feature similarity. The goal is to organize data points such that…",
  "file": "/exams/md/06-sagemaker-built-in-algorithms/k-means.md",
  "track": "exam_modeling",
  "tab": "Built-in algorithms",
  "group": "Clustering & dimensionality",
  "status": "draft",
  "domains": [
   "2.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "06_sagemaker_built_in_algorithms"
  ],
  "aliases": [
   "K Means"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 238
 },
 {
  "slug": "06-sagemaker-built-in-algorithms/principal-component-analysis",
  "title": "Principal Component Analysis",
  "desc": "Principal Component Analysis (PCA): Overview and Applications",
  "file": "/exams/md/06-sagemaker-built-in-algorithms/principal-component-analysis.md",
  "track": "exam_modeling",
  "tab": "Built-in algorithms",
  "group": "Clustering & dimensionality",
  "status": "draft",
  "domains": [
   "2.1",
   "2.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "06_sagemaker_built_in_algorithms"
  ],
  "aliases": [
   "Principal Component Analysis"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 485
 },
 {
  "slug": "common/linear-and-logistic-regression",
  "title": "Linear and Logistic Regression",
  "desc": "Linear regression is a supervised learning algorithm that models the relationship between a continuous dependent variable and one or more independent variables by fitting an affine function…",
  "file": "/exams/md/common/linear-and-logistic-regression.md",
  "track": "exam_modeling",
  "tab": "ML fundamentals",
  "group": "Learning fundamentals",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2"
  ],
  "aliases": [
   "Linear and Logistic Regression"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 447
 },
 {
  "slug": "common/ensembling-learning-methods",
  "title": "Ensembling Learning Methods",
  "desc": "Ensemble learning methods combine multiple \"base\" models to produce a stronger overall model. Three of the most popular techniques are bagging, boosting, and stacking:",
  "file": "/exams/md/common/ensembling-learning-methods.md",
  "track": "exam_modeling",
  "tab": "ML fundamentals",
  "group": "Learning fundamentals",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2"
  ],
  "aliases": [
   "Ensembling Learning Methods"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 964
 },
 {
  "slug": "common/boosting",
  "title": "Types of Boosting",
  "desc": "Boosting is an ensemble technique that combines multiple weak learners to form a strong learner, improving model accuracy and robustness. The three main types of boosting are:",
  "file": "/exams/md/common/boosting.md",
  "track": "exam_modeling",
  "tab": "ML fundamentals",
  "group": "Learning fundamentals",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2"
  ],
  "aliases": [
   "Types of Boosting"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 232
 },
 {
  "slug": "common/convolution",
  "title": "Convolution",
  "desc": "The purpose of convolution in a Convolutional Neural Network (CNN) is to automatically extract and learn features from input data, typically images.",
  "file": "/exams/md/common/convolution.md",
  "track": "exam_modeling",
  "tab": "ML fundamentals",
  "group": "Learning fundamentals",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2"
  ],
  "aliases": [
   "Convolution"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 133
 },
 {
  "slug": "common/probability-distribution",
  "title": "Probability Distributions",
  "desc": "A probability distribution is just a rule that tells us how likely each possible outcome of a random event is. Flip a coin: there’s a 50 % chance of heads and a 50 % chance of tails. Those…",
  "file": "/exams/md/common/probability-distribution.md",
  "track": "exam_modeling",
  "tab": "ML fundamentals",
  "group": "Learning fundamentals",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2"
  ],
  "aliases": [
   "Probability Distributions"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 353
 },
 {
  "slug": "common/bias-and-variance",
  "title": "Bias And Variance",
  "desc": "In supervised learning, model error can be decomposed into three parts:",
  "file": "/exams/md/common/bias-and-variance.md",
  "track": "exam_modeling",
  "tab": "ML fundamentals",
  "group": "Fit & generalization",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2"
  ],
  "aliases": [
   "Bias And Variance"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 622
 },
 {
  "slug": "common/preventing-overfitting",
  "title": "Preventing Overfitting",
  "desc": "Overfitting occurs when a machine learning model learns not only the underlying patterns in the training data but also the noise and random fluctuations, resulting in poor generalization to…",
  "file": "/exams/md/common/preventing-overfitting.md",
  "track": "exam_modeling",
  "tab": "ML fundamentals",
  "group": "Fit & generalization",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2"
  ],
  "aliases": [
   "Preventing Overfitting"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 559
 },
 {
  "slug": "common/preventing-underfitting",
  "title": "Preventing Underfitting",
  "desc": "Underfitting happens when your model is too simple to capture the underlying structure of the data, resulting in poor performance on both training and validation sets. Here's how to address…",
  "file": "/exams/md/common/preventing-underfitting.md",
  "track": "exam_modeling",
  "tab": "ML fundamentals",
  "group": "Fit & generalization",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2"
  ],
  "aliases": [
   "Preventing Underfitting"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 0,
  "words": 715
 },
 {
  "slug": "common/hyperband",
  "title": "Hyperband",
  "desc": "Hyperband is an efficient hyperparameter optimization algorithm that adapts the concept of multi-armed bandits to allocate resources (e.g., training epochs, data subsets) to randomly…",
  "file": "/exams/md/common/hyperband.md",
  "track": "exam_modeling",
  "tab": "ML fundamentals",
  "group": "Fit & generalization",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2"
  ],
  "aliases": [
   "Hyperband"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 350
 },
 {
  "slug": "common/sparse-data",
  "title": "Sparse Data",
  "desc": "In machine learning, sparse data refers to datasets where a significant proportion of the values are zeros or nulls. This sparsity often arises in scenarios involving high-dimensional data,…",
  "file": "/exams/md/common/sparse-data.md",
  "track": "exam_modeling",
  "tab": "ML fundamentals",
  "group": "Data characteristics",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2"
  ],
  "aliases": [
   "Sparse Data"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 138
 },
 {
  "slug": "common/dense-data",
  "title": "Dense Data",
  "desc": "In machine learning, dense data refers to datasets where most or all of the values are non-zero or present. This type of data is common in scenarios where features are consistently observed…",
  "file": "/exams/md/common/dense-data.md",
  "track": "exam_modeling",
  "tab": "ML fundamentals",
  "group": "Data characteristics",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2"
  ],
  "aliases": [
   "Dense Data"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 129
 },
 {
  "slug": "common/gaussian-like-data",
  "title": "Gaussian Like Data",
  "desc": "By \"Gaussian-like data\", we mean data that is approximately normally distributed—that is, it resembles a bell curve or Gaussian distribution.",
  "file": "/exams/md/common/gaussian-like-data.md",
  "track": "exam_modeling",
  "tab": "ML fundamentals",
  "group": "Data characteristics",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2"
  ],
  "aliases": [
   "Gaussian Like Data"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 158
 },
 {
  "slug": "common/normalization-standardization",
  "title": "Normalization and Standardization",
  "desc": "Normalization and standardization are data preprocessing techniques used to rescale features before feeding them into machine learning models. Here's a detailed comparison:",
  "file": "/exams/md/common/normalization-standardization.md",
  "track": "exam_modeling",
  "tab": "ML fundamentals",
  "group": "Data characteristics",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2"
  ],
  "aliases": [
   "Normalization and Standardization"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 771
 },
 {
  "slug": "common/shuffling-data",
  "title": "Shuffling Data in Machine Learning",
  "desc": "Shuffling data refers to the process of randomly reordering the samples in a dataset before training a machine learning model. This step is crucial for ensuring that the model learns…",
  "file": "/exams/md/common/shuffling-data.md",
  "track": "exam_modeling",
  "tab": "ML fundamentals",
  "group": "Data characteristics",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2"
  ],
  "aliases": [
   "Shuffling Data in Machine Learning"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 497
 },
 {
  "slug": "common/sub-sampling",
  "title": "Sub Sampling",
  "desc": ", also known as pooling, is a technique used in CNNs to reduce the spatial dimensions (width and height) of feature maps after convolution. The most common type is max pooling, but average…",
  "file": "/exams/md/common/sub-sampling.md",
  "track": "exam_modeling",
  "tab": "ML fundamentals",
  "group": "Data characteristics",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2"
  ],
  "aliases": [
   "Sub Sampling"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 111
 },
 {
  "slug": "common/class-imbalance-and-resampling",
  "title": "Class Imbalance And Resampling",
  "desc": "Domain 1/2 concept note for imbalanced labels, sampling strategies, and the SageMaker Clarify Class Imbalance bias metric.",
  "file": "/exams/md/common/class-imbalance-and-resampling.md",
  "track": "exam_modeling",
  "tab": "ML fundamentals",
  "group": "Data characteristics",
  "status": "reviewed",
  "domains": [
   "1.3",
   "2.3"
  ],
  "domainScope": "",
  "services": [
   "Amazon SageMaker Clarify"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "ml-concepts",
   "bias"
  ],
  "aliases": [
   "Class Imbalance And Resampling"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 210
 },
 {
  "slug": "common/bias-metrics-ci-dpl",
  "title": "Bias Metrics: CI And DPL",
  "desc": "Focused note on SageMaker Clarify Class Imbalance (CI) and Difference in Proportions of Labels (DPL) metrics.",
  "file": "/exams/md/common/bias-metrics-ci-dpl.md",
  "track": "exam_modeling",
  "tab": "ML fundamentals",
  "group": "Fairness & interpretability",
  "status": "reviewed",
  "domains": [
   "1.3",
   "4.1"
  ],
  "domainScope": "",
  "services": [
   "Amazon SageMaker Clarify"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "bias",
   "clarify"
  ],
  "aliases": [
   "Bias Metrics: CI And DPL"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 206
 },
 {
  "slug": "common/conditional-demographic-disparity",
  "title": "Conditional Demographic Disparity (CDD)",
  "desc": "is a fairness metric used to measure the difference in positive prediction rates between demographic groups, while conditioning on relevant features (such as income, education, or other…",
  "file": "/exams/md/common/conditional-demographic-disparity.md",
  "track": "exam_modeling",
  "tab": "ML fundamentals",
  "group": "Fairness & interpretability",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2"
  ],
  "aliases": [
   "Conditional Demographic Disparity (CDD)"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 218
 },
 {
  "slug": "common/interpretability-techniques",
  "title": "Interpretability Techniques in Machine Learning",
  "desc": "Interpretability techniques help us understand how machine learning models make decisions. These techniques can be grouped into:",
  "file": "/exams/md/common/interpretability-techniques.md",
  "track": "exam_modeling",
  "tab": "ML fundamentals",
  "group": "Fairness & interpretability",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2"
  ],
  "aliases": [
   "Interpretability Techniques in Machine Learning"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 0,
  "words": 564
 },
 {
  "slug": "common/concept-drift",
  "title": "Concept Drift in Machine Learning",
  "desc": "refers to the phenomenon where the statistical properties of the target variable, which a model is trying to predict, change over time in unforeseen ways. This causes the relationship…",
  "file": "/exams/md/common/concept-drift.md",
  "track": "exam_modeling",
  "tab": "ML fundamentals",
  "group": "Fairness & interpretability",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2"
  ],
  "aliases": [
   "Concept Drift in Machine Learning"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 277
 },
 {
  "slug": "05-sagemaker-ai/sagemaker-ai-current-capabilities",
  "title": "SageMaker AI Current Capabilities",
  "desc": "Current landscape note for Amazon SageMaker AI versus next-generation SageMaker, Studio, and related ML lifecycle features.",
  "file": "/exams/md/05-sagemaker-ai/sagemaker-ai-current-capabilities.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Studio & workspaces",
  "status": "reviewed",
  "domains": [
   "2.1",
   "2.2",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [
   "Amazon SageMaker AI"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "sagemaker",
   "current"
  ],
  "aliases": [
   "SageMaker AI Current Capabilities"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 259
 },
 {
  "slug": "05-sagemaker-ai/sagemaker-studio",
  "title": "Amazon SageMaker Studio",
  "desc": "Domain 2/3/4 SageMaker AI development environment note. Current AWS docs distinguish updated Studio from legacy Studio Classic and next-generation SageMaker/Unified Studio context.",
  "file": "/exams/md/05-sagemaker-ai/sagemaker-studio.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Studio & workspaces",
  "status": "reviewed",
  "domains": [
   "2.2",
   "3.1",
   "4.3"
  ],
  "domainScope": "",
  "services": [
   "Amazon SageMaker AI"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "sagemaker",
   "studio"
  ],
  "aliases": [
   "Amazon SageMaker Studio"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 261
 },
 {
  "slug": "05-sagemaker-ai/sagemaker-domains",
  "title": "SageMaker Domains",
  "desc": "Amazon SageMaker Domains provide a secure, managed environment for teams to collaborate on machine learning (ML) projects. A Domain acts as a central hub for users, data, notebooks, and ML…",
  "file": "/exams/md/05-sagemaker-ai/sagemaker-domains.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Studio & workspaces",
  "status": "draft",
  "domains": [
   "2.2",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "05_sagemaker_ai"
  ],
  "aliases": [
   "SageMaker Domains"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 269
 },
 {
  "slug": "05-sagemaker-ai/sagemaker-canvas",
  "title": "Amazon SageMaker Canvas",
  "desc": "Amazon SageMaker Canvas is a visual, no-code machine learning (ML) service that enables business analysts and domain experts to generate accurate ML predictions without writing code or…",
  "file": "/exams/md/05-sagemaker-ai/sagemaker-canvas.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Studio & workspaces",
  "status": "draft",
  "domains": [
   "2.2",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "05_sagemaker_ai"
  ],
  "aliases": [
   "Amazon SageMaker Canvas"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 533
 },
 {
  "slug": "05-sagemaker-ai/sagemaker-jumpstart",
  "title": "SageMaker JumpStart",
  "desc": "Amazon SageMaker JumpStart is a feature within Amazon SageMaker that provides access to a wide range of pre-built machine learning (ML) solutions, foundation models (FMs), and pre-trained…",
  "file": "/exams/md/05-sagemaker-ai/sagemaker-jumpstart.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Studio & workspaces",
  "status": "draft",
  "domains": [
   "2.2",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "05_sagemaker_ai"
  ],
  "aliases": [
   "SageMaker JumpStart"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 634
 },
 {
  "slug": "05-sagemaker-ai/sagemaker-projects",
  "title": "SageMaker Projects",
  "desc": "Amazon SageMaker Projects is a feature within Amazon SageMaker that enables organizations to standardize, automate, and scale end-to-end machine learning (ML) workflows using MLOps best…",
  "file": "/exams/md/05-sagemaker-ai/sagemaker-projects.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Studio & workspaces",
  "status": "draft",
  "domains": [
   "2.2",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "05_sagemaker_ai"
  ],
  "aliases": [
   "SageMaker Projects"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 436
 },
 {
  "slug": "05-sagemaker-ai/sagemaker-data-wrangler",
  "title": "Amazon SageMaker Data Wrangler",
  "desc": "Amazon SageMaker Data Wrangler is an integrated, visual data preparation tool within Amazon SageMaker that is designed to simplify and streamline the process of data exploration,…",
  "file": "/exams/md/05-sagemaker-ai/sagemaker-data-wrangler.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Data & features",
  "status": "draft",
  "domains": [
   "2.2",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "05_sagemaker_ai"
  ],
  "aliases": [
   "Amazon SageMaker Data Wrangler"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 887
 },
 {
  "slug": "05-sagemaker-ai/sagemaker-feature-store",
  "title": "SageMaker Feature Store",
  "desc": "Amazon SageMaker Feature Store is a fully managed repository purpose-built to create, store, share, and manage machine learning (ML) features. It is an integral part of the SageMaker…",
  "file": "/exams/md/05-sagemaker-ai/sagemaker-feature-store.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Data & features",
  "status": "draft",
  "domains": [
   "2.2",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "05_sagemaker_ai"
  ],
  "aliases": [
   "SageMaker Feature Store"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 0,
  "words": 804
 },
 {
  "slug": "05-sagemaker-ai/sagemaker-input-modes",
  "title": "SageMaker Input Modes",
  "desc": "Amazon SageMaker offers various input modes to efficiently access training data stored in Amazon S3 and other AWS storage services. Here's an overview of these input modes and their…",
  "file": "/exams/md/05-sagemaker-ai/sagemaker-input-modes.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Data & features",
  "status": "draft",
  "domains": [
   "2.2",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "05_sagemaker_ai"
  ],
  "aliases": [
   "SageMaker Input Modes"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 784
 },
 {
  "slug": "05-sagemaker-ai/spark-with-sagemaker",
  "title": "Spark Integration with SageMaker",
  "desc": "Apache Spark is an open-source, distributed computing system designed for big data processing and analytics. Integrating Spark with Amazon SageMaker enables scalable data preprocessing,…",
  "file": "/exams/md/05-sagemaker-ai/spark-with-sagemaker.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Data & features",
  "status": "draft",
  "domains": [
   "2.2",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "05_sagemaker_ai"
  ],
  "aliases": [
   "Spark Integration with SageMaker"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 672
 },
 {
  "slug": "05-sagemaker-ai/sagemaker-training-techniques",
  "title": "Advanced Amazon SageMaker Training Techniques",
  "desc": "Domain 2 optimization note for scaling, speeding up, and reducing cost of SageMaker AI training jobs.",
  "file": "/exams/md/05-sagemaker-ai/sagemaker-training-techniques.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Training & tuning",
  "status": "reviewed",
  "domains": [
   "2.2",
   "2.3"
  ],
  "domainScope": "",
  "services": [
   "Amazon SageMaker AI"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "sagemaker",
   "training"
  ],
  "aliases": [
   "Advanced Amazon SageMaker Training Techniques"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 5,
  "words": 291
 },
 {
  "slug": "05-sagemaker-ai/sagemaker-training-compiler",
  "title": "SageMaker Training Compiler",
  "desc": "Legacy SageMaker optimization feature. Keep for historical context and exam caveat recognition, but do not emphasize as a current optimization path.",
  "file": "/exams/md/05-sagemaker-ai/sagemaker-training-compiler.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Training & tuning",
  "status": "legacy",
  "domains": [
   "2.2"
  ],
  "domainScope": "",
  "services": [
   "Amazon SageMaker AI"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "sagemaker",
   "legacy"
  ],
  "aliases": [
   "SageMaker Training Compiler"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 224
 },
 {
  "slug": "05-sagemaker-ai/sagemaker-model-parallelism",
  "title": "Distributed Training in SageMaker",
  "desc": "Scaling individual model training across multiple GPUs and instances.",
  "file": "/exams/md/05-sagemaker-ai/sagemaker-model-parallelism.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Training & tuning",
  "status": "draft",
  "domains": [
   "2.2",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "05_sagemaker_ai"
  ],
  "aliases": [
   "Distributed Training in SageMaker"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 672
 },
 {
  "slug": "05-sagemaker-ai/sagemaker-spot-training",
  "title": "SageMaker Spot Training",
  "desc": "Amazon SageMaker Spot Training allows you to use Amazon EC2 Spot Instances to run your training jobs at a significantly reduced cost compared to on-demand instances. Spot Instances are…",
  "file": "/exams/md/05-sagemaker-ai/sagemaker-spot-training.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Training & tuning",
  "status": "draft",
  "domains": [
   "2.2",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "05_sagemaker_ai"
  ],
  "aliases": [
   "SageMaker Spot Training"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 0,
  "words": 257
 },
 {
  "slug": "05-sagemaker-ai/sagemaker-auto-pilot-or-automl",
  "title": "SageMaker Auto Pilot Or Automl",
  "desc": "SageMaker Autopilot is AWS’s managed AutoML service. Given a tabular dataset and a target column, it will automatically:",
  "file": "/exams/md/05-sagemaker-ai/sagemaker-auto-pilot-or-automl.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Training & tuning",
  "status": "draft",
  "domains": [
   "2.2",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "05_sagemaker_ai"
  ],
  "aliases": [
   "SageMaker Auto Pilot Or Automl"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 821
 },
 {
  "slug": "05-sagemaker-ai/sagemaker-debugger",
  "title": "SageMaker Debugger",
  "desc": "Amazon SageMaker Debugger is a powerful tool that provides real-time insights into the training of machine learning models on SageMaker. It automatically captures and analyzes data such as…",
  "file": "/exams/md/05-sagemaker-ai/sagemaker-debugger.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Training & tuning",
  "status": "draft",
  "domains": [
   "2.2",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "05_sagemaker_ai"
  ],
  "aliases": [
   "SageMaker Debugger"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 377
 },
 {
  "slug": "05-sagemaker-ai/sagemaker-experiments",
  "title": "SageMaker Experiments",
  "desc": "Amazon SageMaker Experiments is a feature of Amazon SageMaker that helps data scientists and machine learning (ML) practitioners organize, track, compare, and evaluate ML experiments. It…",
  "file": "/exams/md/05-sagemaker-ai/sagemaker-experiments.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Training & tuning",
  "status": "draft",
  "domains": [
   "2.2",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "05_sagemaker_ai"
  ],
  "aliases": [
   "SageMaker Experiments"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 513
 },
 {
  "slug": "05-sagemaker-ai/sagemaker-deployment-modes",
  "title": "SageMaker Deployment Modes",
  "desc": "Amazon SageMaker supports several deployment strategies that allow you to update machine learning models in production with minimal disruption and risk. These strategies—blue/green, canary,…",
  "file": "/exams/md/05-sagemaker-ai/sagemaker-deployment-modes.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Deployment & inference",
  "status": "draft",
  "domains": [
   "2.2",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "05_sagemaker_ai"
  ],
  "aliases": [
   "SageMaker Deployment Modes"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 806
 },
 {
  "slug": "05-sagemaker-ai/sagemaker-model-endpoints",
  "title": "SageMaker Model Endpoints",
  "desc": "Amazon SageMaker Model Endpoints are fully managed, scalable interfaces for deploying machine learning models to production. Endpoints enable real-time or asynchronous (batch) inference,…",
  "file": "/exams/md/05-sagemaker-ai/sagemaker-model-endpoints.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Deployment & inference",
  "status": "draft",
  "domains": [
   "2.2",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "05_sagemaker_ai"
  ],
  "aliases": [
   "SageMaker Model Endpoints"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 632
 },
 {
  "slug": "05-sagemaker-ai/sagemaker-elastic-inference",
  "title": "SageMaker Elastic Inference",
  "desc": "Legacy inference acceleration note. AWS stopped onboarding new Elastic Inference customers after April 15, 2023.",
  "file": "/exams/md/05-sagemaker-ai/sagemaker-elastic-inference.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Deployment & inference",
  "status": "legacy",
  "domains": [
   "3.1"
  ],
  "domainScope": "",
  "services": [
   "Amazon SageMaker AI",
   "Amazon Elastic Inference"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "legacy",
   "inference"
  ],
  "aliases": [
   "SageMaker Elastic Inference"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 186
 },
 {
  "slug": "05-sagemaker-ai/sagemaker-neo",
  "title": "SageMaker Neo",
  "desc": "SageMaker model optimization note. Neo remains optimization context, but Edge Manager references must be treated as historical.",
  "file": "/exams/md/05-sagemaker-ai/sagemaker-neo.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Deployment & inference",
  "status": "reviewed",
  "domains": [
   "3.1"
  ],
  "domainScope": "",
  "services": [
   "Amazon SageMaker AI"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "sagemaker",
   "deployment"
  ],
  "aliases": [
   "SageMaker Neo"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 213
 },
 {
  "slug": "05-sagemaker-ai/sagemaker-pipelines",
  "title": "SageMaker Pipelines",
  "desc": "Amazon SageMaker Pipelines is an end-to-end orchestration service for creating, automating, and managing machine learning (ML) workflows. It is designed to streamline the entire ML…",
  "file": "/exams/md/05-sagemaker-ai/sagemaker-pipelines.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Deployment & inference",
  "status": "draft",
  "domains": [
   "2.2",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "05_sagemaker_ai"
  ],
  "aliases": [
   "SageMaker Pipelines"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 947
 },
 {
  "slug": "05-sagemaker-ai/sagemaker-model-registry",
  "title": "SageMaker Model Registry",
  "desc": "Amazon SageMaker Model Registry is a key component of the SageMaker ecosystem that provides a centralized, managed repository for cataloging, versioning, and managing machine learning (ML)…",
  "file": "/exams/md/05-sagemaker-ai/sagemaker-model-registry.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Governance & monitoring",
  "status": "draft",
  "domains": [
   "2.2",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "05_sagemaker_ai"
  ],
  "aliases": [
   "SageMaker Model Registry"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 0,
  "words": 854
 },
 {
  "slug": "05-sagemaker-ai/sagemaker-model-cards",
  "title": "SageMaker Model Cards",
  "desc": "Amazon SageMaker Model Cards provide a standardized, centralized way to document machine learning (ML) models throughout their lifecycle. Model cards capture essential details such as…",
  "file": "/exams/md/05-sagemaker-ai/sagemaker-model-cards.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Governance & monitoring",
  "status": "draft",
  "domains": [
   "2.2",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "05_sagemaker_ai"
  ],
  "aliases": [
   "SageMaker Model Cards"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 469
 },
 {
  "slug": "05-sagemaker-ai/sagemaker-model-monitor",
  "title": "SageMaker Model Monitor",
  "desc": "Amazon Model Monitor is a built-in feature of Amazon SageMaker that continuously monitors machine learning models deployed in production. Its primary purpose is to ensure that models…",
  "file": "/exams/md/05-sagemaker-ai/sagemaker-model-monitor.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Governance & monitoring",
  "status": "draft",
  "domains": [
   "2.2",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "05_sagemaker_ai"
  ],
  "aliases": [
   "SageMaker Model Monitor"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 981
 },
 {
  "slug": "05-sagemaker-ai/sagemaker-clarify",
  "title": "SageMaker Clarify",
  "desc": "Amazon SageMaker Clarify is a built-in feature of the SageMaker ecosystem designed to help you detect and mitigate bias in your machine learning models and datasets. Its primary goal is to…",
  "file": "/exams/md/05-sagemaker-ai/sagemaker-clarify.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Governance & monitoring",
  "status": "draft",
  "domains": [
   "2.2",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "05_sagemaker_ai"
  ],
  "aliases": [
   "SageMaker Clarify"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 919
 },
 {
  "slug": "05-sagemaker-ai/sagemaker-linear-tracking",
  "title": "SageMaker Linear Learner Tracking",
  "desc": "Amazon SageMaker Linear Learner is a built-in algorithm for supervised learning tasks such as binary classification, multiclass classification, and regression. It is optimized for large…",
  "file": "/exams/md/05-sagemaker-ai/sagemaker-linear-tracking.md",
  "track": "exam_sagemaker",
  "tab": "SageMaker AI",
  "group": "Governance & monitoring",
  "status": "draft",
  "domains": [
   "2.2",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "05_sagemaker_ai"
  ],
  "aliases": [
   "SageMaker Linear Learner Tracking"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 272
 },
 {
  "slug": "07-generative-ai-model-fundamentals/common-llm-terms",
  "title": "Common LLM Terms and Model Parameters",
  "desc": "Understanding these parameters is crucial for tuning model behavior, optimizing generation quality, and controlling computational cost.",
  "file": "/exams/md/07-generative-ai-model-fundamentals/common-llm-terms.md",
  "track": "exam_genai",
  "tab": "Model fundamentals",
  "group": "",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "07_generative_ai_model_fundamentals"
  ],
  "aliases": [
   "Common LLM Terms and Model Parameters"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 250
 },
 {
  "slug": "07-generative-ai-model-fundamentals/transformer-architecture",
  "title": "Transformer Architecture",
  "desc": "The Transformer architecture has revolutionized the field of artificial intelligence (AI), particularly in natural language processing (NLP). Introduced in the 2017 paper \"Attention Is All…",
  "file": "/exams/md/07-generative-ai-model-fundamentals/transformer-architecture.md",
  "track": "exam_genai",
  "tab": "Model fundamentals",
  "group": "",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "07_generative_ai_model_fundamentals"
  ],
  "aliases": [
   "Transformer Architecture"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 564
 },
 {
  "slug": "07-generative-ai-model-fundamentals/self-attention-mechanism",
  "title": "Self Attention Mechanism",
  "desc": "Self-attention is a pivotal mechanism in neural networks, particularly within the architecture of Transformers, that enables models to evaluate and assign varying degrees of importance to…",
  "file": "/exams/md/07-generative-ai-model-fundamentals/self-attention-mechanism.md",
  "track": "exam_genai",
  "tab": "Model fundamentals",
  "group": "",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "07_generative_ai_model_fundamentals"
  ],
  "aliases": [
   "Self Attention Mechanism"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 1937
 },
 {
  "slug": "07-generative-ai-model-fundamentals/decoder-encoder-models",
  "title": "Encoder-Decoder Models",
  "desc": "Encoder-decoder models are a crucial class of neural network architectures originally introduced in the Transformer model in the 2017 paper \"Attention is All You Need\" by Vaswani et al.…",
  "file": "/exams/md/07-generative-ai-model-fundamentals/decoder-encoder-models.md",
  "track": "exam_genai",
  "tab": "Model fundamentals",
  "group": "",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "07_generative_ai_model_fundamentals"
  ],
  "aliases": [
   "Encoder-Decoder Models"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 0,
  "words": 744
 },
 {
  "slug": "07-generative-ai-model-fundamentals/generative-pretrained-transformers",
  "title": "Generative Pretrained Transformers",
  "desc": "GPT Models: Architecture and Relevance to AWS Machine Learning",
  "file": "/exams/md/07-generative-ai-model-fundamentals/generative-pretrained-transformers.md",
  "track": "exam_genai",
  "tab": "Model fundamentals",
  "group": "",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "07_generative_ai_model_fundamentals"
  ],
  "aliases": [
   "Generative Pretrained Transformers"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 647
 },
 {
  "slug": "07-generative-ai-model-fundamentals/application-of-transformers",
  "title": "Application Of Transformers",
  "desc": "Transformer application note for understanding current AWS generative AI services and updated Amazon Q Developer naming.",
  "file": "/exams/md/07-generative-ai-model-fundamentals/application-of-transformers.md",
  "track": "exam_genai",
  "tab": "Model fundamentals",
  "group": "",
  "status": "reviewed",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [
   "Amazon Bedrock",
   "Amazon Q Developer"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "transformers",
   "generative-ai"
  ],
  "aliases": [
   "Application Of Transformers"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 186
 },
 {
  "slug": "07-generative-ai-model-fundamentals/foundational-models-in-aws",
  "title": "Foundational Models In AWS",
  "desc": "Foundation models (FMs) are expansive deep learning neural networks trained on vast datasets, serving as versatile bases for various machine learning (ML) applications. In AWS, both…",
  "file": "/exams/md/07-generative-ai-model-fundamentals/foundational-models-in-aws.md",
  "track": "exam_genai",
  "tab": "Model fundamentals",
  "group": "",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "07_generative_ai_model_fundamentals"
  ],
  "aliases": [
   "Foundational Models In AWS"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 882
 },
 {
  "slug": "07-generative-ai-model-fundamentals/imputation-of-data",
  "title": "Imputation Of Data",
  "desc": "Imputing missing data means filling in the blanks in a dataset where some values are missing.",
  "file": "/exams/md/07-generative-ai-model-fundamentals/imputation-of-data.md",
  "track": "exam_genai",
  "tab": "Model fundamentals",
  "group": "",
  "status": "draft",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "07_generative_ai_model_fundamentals"
  ],
  "aliases": [
   "Imputation Of Data"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 148
 },
 {
  "slug": "07-generative-ai-model-fundamentals/transformers-sagemaker",
  "title": "Transformers sagemaker",
  "desc": "A runnable transformers walkthrough: tokenizers, attention, embeddings, and fine-tuning on SageMaker.",
  "file": "/exams/md/07-generative-ai-model-fundamentals/transformers-sagemaker.md",
  "track": "exam_genai",
  "tab": "Model fundamentals",
  "group": "",
  "status": "supplemental",
  "domains": [
   "2.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "transformers",
   "sagemaker",
   "notebook"
  ],
  "aliases": [],
  "certifications": [],
  "lastVerified": "",
  "sourceType": "repo-notebook",
  "sourceCount": 0,
  "words": 185
 },
 {
  "slug": "08-building-gen-ai-apps-with-bedrock/bedrock-overview",
  "title": "Bedrock Overview",
  "desc": "Amazon Bedrock is a fully managed, serverless service designed to simplify access to a variety of generative AI foundation models. These foundation models are essentially the large language…",
  "file": "/exams/md/08-building-gen-ai-apps-with-bedrock/bedrock-overview.md",
  "track": "exam_genai",
  "tab": "Building with Bedrock",
  "group": "",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "08_building_gen_ai_apps_with_bedrock"
  ],
  "aliases": [
   "Bedrock Overview"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 946
 },
 {
  "slug": "08-building-gen-ai-apps-with-bedrock/retrieval-augmented-generation",
  "title": "Retrieval Augmented Generation",
  "desc": "In the context of Bedrock, a knowledge base is essentially built on top of a data store that holds your domain data alongside its corresponding embeddings. This data store is critical…",
  "file": "/exams/md/08-building-gen-ai-apps-with-bedrock/retrieval-augmented-generation.md",
  "track": "exam_genai",
  "tab": "Building with Bedrock",
  "group": "",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "08_building_gen_ai_apps_with_bedrock"
  ],
  "aliases": [
   "Retrieval Augmented Generation"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 793
 },
 {
  "slug": "08-building-gen-ai-apps-with-bedrock/chunking-strategies",
  "title": "Chunking Strategies in RAG Pipelines",
  "desc": "Chunking is a critical component in the Retrieval-Augmented Generation (RAG) pipeline that involves breaking down large documents into smaller, manageable pieces or \"chunks\" before they are…",
  "file": "/exams/md/08-building-gen-ai-apps-with-bedrock/chunking-strategies.md",
  "track": "exam_genai",
  "tab": "Building with Bedrock",
  "group": "",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "08_building_gen_ai_apps_with_bedrock"
  ],
  "aliases": [
   "Chunking Strategies in RAG Pipelines"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 1060
 },
 {
  "slug": "08-building-gen-ai-apps-with-bedrock/bedrock-agents",
  "title": "Bedrock Agents",
  "desc": "LM agents are an advanced way to extend the capabilities of a foundation model by giving it “tools” to interact with external systems. Rather than being limited to its internal knowledge,…",
  "file": "/exams/md/08-building-gen-ai-apps-with-bedrock/bedrock-agents.md",
  "track": "exam_genai",
  "tab": "Building with Bedrock",
  "group": "",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "08_building_gen_ai_apps_with_bedrock"
  ],
  "aliases": [
   "Bedrock Agents"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 1121
 },
 {
  "slug": "08-building-gen-ai-apps-with-bedrock/bedrock-guardrails",
  "title": "Bedrock Guardrails",
  "desc": "Amazon Bedrock Guardrails provide a robust mechanism for ensuring that both the input (prompts) and output (responses) of your generative AI system comply with safety, governance, and…",
  "file": "/exams/md/08-building-gen-ai-apps-with-bedrock/bedrock-guardrails.md",
  "track": "exam_genai",
  "tab": "Building with Bedrock",
  "group": "",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "08_building_gen_ai_apps_with_bedrock"
  ],
  "aliases": [
   "Bedrock Guardrails"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 783
 },
 {
  "slug": "08-building-gen-ai-apps-with-bedrock/fine-tuning-and-continuous-pre-training",
  "title": "Fine Tuning And Continuous Pre Training",
  "desc": "Fine tuning in Bedrock is the process of extending the training of a foundation model—such as a large language model or an image generation model—to better suit a specific application or…",
  "file": "/exams/md/08-building-gen-ai-apps-with-bedrock/fine-tuning-and-continuous-pre-training.md",
  "track": "exam_genai",
  "tab": "Building with Bedrock",
  "group": "",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "08_building_gen_ai_apps_with_bedrock"
  ],
  "aliases": [
   "Fine Tuning And Continuous Pre Training"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 1275
 },
 {
  "slug": "08-building-gen-ai-apps-with-bedrock/multi-llm-routing-strategies",
  "title": "Multi‑LLM Routing Strategies on AWS (Bedrock)",
  "desc": "Single entry point, routing happens behind the scenes.",
  "file": "/exams/md/08-building-gen-ai-apps-with-bedrock/multi-llm-routing-strategies.md",
  "track": "exam_genai",
  "tab": "Building with Bedrock",
  "group": "",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "08_building_gen_ai_apps_with_bedrock"
  ],
  "aliases": [
   "Multi‑LLM Routing Strategies on AWS (Bedrock)"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 413
 },
 {
  "slug": "08-building-gen-ai-apps-with-bedrock/other-bedrock-features",
  "title": "Other Bedrock Features",
  "desc": "These additional features highlight the expansive capabilities of Amazon Bedrock:",
  "file": "/exams/md/08-building-gen-ai-apps-with-bedrock/other-bedrock-features.md",
  "track": "exam_genai",
  "tab": "Building with Bedrock",
  "group": "",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "08_building_gen_ai_apps_with_bedrock"
  ],
  "aliases": [
   "Other Bedrock Features"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 758
 },
 {
  "slug": "13-bedrock/amazon-bedrock",
  "title": "Amazon Bedrock (deep dive notes)",
  "desc": "Amazon Bedrock is a fully managed AWS service that gives you access to a variety of foundation models (FMs)—from Amazon and multiple third-party providers—through a unified set of APIs,…",
  "file": "/exams/md/13-bedrock/amazon-bedrock.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Bedrock core",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "13_bedrock"
  ],
  "aliases": [
   "Amazon Bedrock (deep dive notes)"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 1756
 },
 {
  "slug": "13-bedrock/bedrock-application-patterns",
  "title": "Bedrock Application Patterns",
  "desc": "Canonical pattern note for common Amazon Bedrock application designs without duplicating every Bedrock feature note.",
  "file": "/exams/md/13-bedrock/bedrock-application-patterns.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Bedrock core",
  "status": "reviewed",
  "domains": [
   "2.1",
   "3.1"
  ],
  "domainScope": "",
  "services": [
   "Amazon Bedrock"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "bedrock",
   "generative-ai"
  ],
  "aliases": [
   "Bedrock Application Patterns"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 238
 },
 {
  "slug": "13-bedrock/bedrock-cross-region-inference",
  "title": "Amazon Bedrock Cross-Region Inference",
  "desc": "Cross-Region inference routes Bedrock requests across multiple AWS Regions to handle traffic bursts and increase throughput.",
  "file": "/exams/md/13-bedrock/bedrock-cross-region-inference.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Bedrock core",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "13_bedrock"
  ],
  "aliases": [
   "Amazon Bedrock Cross-Region Inference"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 6,
  "words": 369
 },
 {
  "slug": "13-bedrock/bedrock-flows",
  "title": "Prompt Flows (Amazon Bedrock Flows)",
  "desc": "Prompt Flows was the preview name; the feature is now generally available as Amazon Bedrock Flows.",
  "file": "/exams/md/13-bedrock/bedrock-flows.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Bedrock core",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "13_bedrock"
  ],
  "aliases": [
   "Prompt Flows (Amazon Bedrock Flows)"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 10,
  "words": 427
 },
 {
  "slug": "13-bedrock/bedrock-prompt-management",
  "title": "Amazon Bedrock Prompt Management",
  "desc": "Prompt Management is a Bedrock feature to create, test, version, and reuse prompts in a governed way.",
  "file": "/exams/md/13-bedrock/bedrock-prompt-management.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Bedrock core",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "13_bedrock"
  ],
  "aliases": [
   "Amazon Bedrock Prompt Management"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 8,
  "words": 440
 },
 {
  "slug": "13-bedrock/bedrock-knowledge-base",
  "title": "Amazon Bedrock Knowledge Bases (deep dive notes)",
  "desc": "Amazon Bedrock Knowledge Bases is AWS’s managed Retrieval-Augmented Generation (RAG) capability. You connect your private data (unstructured docs, multimodal files, or structured tables),…",
  "file": "/exams/md/13-bedrock/bedrock-knowledge-base.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Knowledge bases & RAG",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "13_bedrock"
  ],
  "aliases": [
   "Amazon Bedrock Knowledge Bases (deep dive notes)"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 1885
 },
 {
  "slug": "13-bedrock/bedrock-rag-decision-guide",
  "title": "Bedrock RAG Decision Guide",
  "desc": "Decision guide for Bedrock RAG, chunking, vector store selection, pre-retrieval filtering, and evaluation.",
  "file": "/exams/md/13-bedrock/bedrock-rag-decision-guide.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Knowledge bases & RAG",
  "status": "reviewed",
  "domains": [
   "2.1",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [
   "Amazon Bedrock"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "bedrock",
   "rag"
  ],
  "aliases": [
   "Bedrock RAG Decision Guide"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 244
 },
 {
  "slug": "13-bedrock/pre-retrieval-knowledge-base",
  "title": "Pre Retrieval Knowledge Base",
  "desc": "",
  "file": "/exams/md/13-bedrock/pre-retrieval-knowledge-base.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Knowledge bases & RAG",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "13_bedrock"
  ],
  "aliases": [
   "Pre Retrieval Knowledge Base"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 20
 },
 {
  "slug": "13-bedrock/chunking-strategies",
  "title": "Chunking strategies for RAG (deep dive notes)",
  "desc": "Chunking is the step where you turn “documents” into retrieval units. Retrieval (vector / hybrid / keyword) typically happens at the chunk level, so chunking quietly controls everything…",
  "file": "/exams/md/13-bedrock/chunking-strategies.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Knowledge bases & RAG",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "13_bedrock"
  ],
  "aliases": [
   "Chunking strategies for RAG (deep dive notes)"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 1579
 },
 {
  "slug": "13-bedrock/optimizing-vector-store-and-embeddings",
  "title": "Optimizing Vector Store And Embeddings",
  "desc": "When RAG feels “meh”, it is usually not the LLM. It is the geometry you built underneath it: how you chunked, embedded, indexed, and searched. Bedrock Knowledge Bases is helpful because it…",
  "file": "/exams/md/13-bedrock/optimizing-vector-store-and-embeddings.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Knowledge bases & RAG",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "13_bedrock"
  ],
  "aliases": [
   "Optimizing Vector Store And Embeddings"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 1771
 },
 {
  "slug": "13-bedrock/bedrock-data-automation",
  "title": "Amazon Bedrock Data Automation (BDA)",
  "desc": "BDA is a Bedrock feature for extracting structured insights from unstructured, multimodal content (documents, images, audio, video).",
  "file": "/exams/md/13-bedrock/bedrock-data-automation.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Knowledge bases & RAG",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "13_bedrock"
  ],
  "aliases": [
   "Amazon Bedrock Data Automation (BDA)"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 9,
  "words": 372
 },
 {
  "slug": "13-bedrock/bedrock-agents",
  "title": "Agents for Amazon Bedrock",
  "desc": "Managed Bedrock agent note for building applications that combine foundation models, tools, knowledge bases, traces, and deployment aliases.",
  "file": "/exams/md/13-bedrock/bedrock-agents.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Agents & AgentCore",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [
   "Amazon Bedrock",
   "Agents for Amazon Bedrock"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "13_bedrock"
  ],
  "aliases": [
   "Agents for Amazon Bedrock"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 6,
  "words": 419
 },
 {
  "slug": "13-bedrock/bedrock-agent-memory",
  "title": "Amazon Bedrock Agent Memory",
  "desc": "Agents for Amazon Bedrock can retain conversational context across sessions using agent memory.",
  "file": "/exams/md/13-bedrock/bedrock-agent-memory.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Agents & AgentCore",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "13_bedrock"
  ],
  "aliases": [
   "Amazon Bedrock Agent Memory"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 303
 },
 {
  "slug": "13-bedrock/bedrock-agent-tracing",
  "title": "Agent Tracing in Amazon Bedrock",
  "desc": "Agent tracing lets you follow an agent’s step-by-step orchestration: what it decided, which action groups or knowledge bases it called, and how it formed the final response.",
  "file": "/exams/md/13-bedrock/bedrock-agent-tracing.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Agents & AgentCore",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "13_bedrock"
  ],
  "aliases": [
   "Agent Tracing in Amazon Bedrock"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 304
 },
 {
  "slug": "13-bedrock/bedrock-agentcore",
  "title": "Amazon Bedrock AgentCore",
  "desc": "Supplemental current Bedrock note for production agentic AI. AgentCore is useful for architecture decisions around custom agent deployment, tool access, memory, identity, monitoring, and…",
  "file": "/exams/md/13-bedrock/bedrock-agentcore.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Agents & AgentCore",
  "status": "supplemental",
  "domains": [],
  "domainScope": "supplemental",
  "services": [
   "Amazon Bedrock AgentCore"
  ],
  "tags": [
   "aws",
   "13_bedrock"
  ],
  "aliases": [
   "Amazon Bedrock AgentCore"
  ],
  "certifications": [],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 8,
  "words": 644
 },
 {
  "slug": "13-bedrock/bedrock-agentcore-production-patterns",
  "title": "Bedrock AgentCore Production Patterns",
  "desc": "Supplemental production-architecture note. Use for current Bedrock/agentic-AI implementation context, especially where deployment, orchestration, monitoring, maintenance, and security…",
  "file": "/exams/md/13-bedrock/bedrock-agentcore-production-patterns.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Agents & AgentCore",
  "status": "supplemental",
  "domains": [
   "3.1",
   "3.3",
   "4.1"
  ],
  "domainScope": "",
  "services": [
   "Amazon Bedrock AgentCore"
  ],
  "tags": [
   "aws",
   "bedrock",
   "agentcore",
   "agentic-ai",
   "mlops"
  ],
  "aliases": [
   "AgentCore Production Patterns",
   "Production AgentCore"
  ],
  "certifications": [],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 7,
  "words": 645
 },
 {
  "slug": "13-bedrock/bedrock-multi-agent-collaboration",
  "title": "Bedrock Multi-Agent Collaboration",
  "desc": "Supplemental current Bedrock agent capability. Use to understand how managed Bedrock Agents can coordinate specialist agents for complex tasks.",
  "file": "/exams/md/13-bedrock/bedrock-multi-agent-collaboration.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Agents & AgentCore",
  "status": "supplemental",
  "domains": [
   "2.1",
   "3.1"
  ],
  "domainScope": "",
  "services": [
   "Amazon Bedrock",
   "Agents for Amazon Bedrock"
  ],
  "tags": [
   "aws",
   "bedrock",
   "agents",
   "agentic-ai",
   "multi-agent"
  ],
  "aliases": [
   "Multi-Agent Collaboration",
   "Bedrock Agent Collaboration"
  ],
  "certifications": [],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 439
 },
 {
  "slug": "13-bedrock/bedrock-model-customization",
  "title": "Amazon Bedrock Model Customization (Fine-tuning, Continued Pre-training, LoRA)",
  "desc": "Bedrock supports model customization to improve performance on your domain or task.",
  "file": "/exams/md/13-bedrock/bedrock-model-customization.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Model customization",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "13_bedrock"
  ],
  "aliases": [
   "Amazon Bedrock Model Customization (Fine-tuning, Continued Pre-training, LoRA)"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 9,
  "words": 410
 },
 {
  "slug": "13-bedrock/bedrock-custom-model-import",
  "title": "Amazon Bedrock Custom Model Import",
  "desc": "Custom Model Import lets you bring customized open‑source foundation models into Bedrock and use them via the same Bedrock inference APIs.",
  "file": "/exams/md/13-bedrock/bedrock-custom-model-import.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Model customization",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "13_bedrock"
  ],
  "aliases": [
   "Amazon Bedrock Custom Model Import"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 306
 },
 {
  "slug": "13-bedrock/bedrock-guardrails",
  "title": "Bedrock Guardrails",
  "desc": "Amazon Bedrock Guardrails is AWS’s “policy layer” you attach to model interactions to reduce unsafe outputs, block certain topics, scrub sensitive data, and (optionally) check whether…",
  "file": "/exams/md/13-bedrock/bedrock-guardrails.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Safety & evaluation",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "13_bedrock"
  ],
  "aliases": [
   "Bedrock Guardrails"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 1500
 },
 {
  "slug": "13-bedrock/bedrock-automated-reasoning-checks",
  "title": "Bedrock Automated Reasoning Checks",
  "desc": "is a Guardrails policy type in Amazon Bedrock that uses formal (logic-based) verification to validate whether an LLM’s output is consistent with the rules you define for a domain. Instead…",
  "file": "/exams/md/13-bedrock/bedrock-automated-reasoning-checks.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Safety & evaluation",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "13_bedrock"
  ],
  "aliases": [
   "Bedrock Automated Reasoning Checks"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 1732
 },
 {
  "slug": "13-bedrock/bedrock-token-redaction",
  "title": "Token-Level Redaction in Amazon Bedrock (Guardrails)",
  "desc": "Bedrock implements token-level redaction through Guardrails sensitive information filters.",
  "file": "/exams/md/13-bedrock/bedrock-token-redaction.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Safety & evaluation",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "13_bedrock"
  ],
  "aliases": [
   "Token-Level Redaction in Amazon Bedrock (Guardrails)"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 257
 },
 {
  "slug": "13-bedrock/bedrock-model-evaluations",
  "title": "Amazon Bedrock Model Evaluations",
  "desc": "Bedrock Model Evaluations helps you compare and select foundation models (including custom/imported ones) for your use case.",
  "file": "/exams/md/13-bedrock/bedrock-model-evaluations.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Safety & evaluation",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "13_bedrock"
  ],
  "aliases": [
   "Amazon Bedrock Model Evaluations"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 7,
  "words": 342
 },
 {
  "slug": "13-bedrock/bedrock-evaluation-techniques",
  "title": "Evaluation Techniques in Amazon Bedrock",
  "desc": "Bedrock provides multiple evaluation approaches to compare models, prompts, and RAG pipelines.",
  "file": "/exams/md/13-bedrock/bedrock-evaluation-techniques.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Safety & evaluation",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "13_bedrock"
  ],
  "aliases": [
   "Evaluation Techniques in Amazon Bedrock"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 5,
  "words": 360
 },
 {
  "slug": "13-bedrock/bedrock-prompt-caching",
  "title": "Prompt Caching in Amazon Bedrock",
  "desc": "Prompt caching reduces inference cost and latency by reusing cached prompt prefixes across requests.",
  "file": "/exams/md/13-bedrock/bedrock-prompt-caching.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Cost & performance",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "13_bedrock"
  ],
  "aliases": [
   "Prompt Caching in Amazon Bedrock"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 5,
  "words": 505
 },
 {
  "slug": "13-bedrock/bedrock-intelligent-prompt-routing",
  "title": "Amazon Bedrock Intelligent Prompt Routing",
  "desc": "Intelligent Prompt Routing (IPR) provides a single serverless endpoint that routes requests between models within the same family to optimize response quality and cost.",
  "file": "/exams/md/13-bedrock/bedrock-intelligent-prompt-routing.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Cost & performance",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "13_bedrock"
  ],
  "aliases": [
   "Amazon Bedrock Intelligent Prompt Routing"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 369
 },
 {
  "slug": "13-bedrock/bedrock-edge-caching",
  "title": "Caching for GenAI Workloads: CloudFront + API Gateway (Bedrock Context)",
  "desc": "GenAI responses can be expensive and latency-sensitive.",
  "file": "/exams/md/13-bedrock/bedrock-edge-caching.md",
  "track": "exam_genai",
  "tab": "Amazon Bedrock",
  "group": "Cost & performance",
  "status": "draft",
  "domains": [
   "2.1",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-2",
   "domain-3",
   "domain-4",
   "13_bedrock"
  ],
  "aliases": [
   "Caching for GenAI Workloads: CloudFront + API Gateway (Bedrock Context)"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 5,
  "words": 461
 },
 {
  "slug": "14-agentic-ai/agentic-ai-current-innovation-map",
  "title": "Agentic AI Current Innovation Map",
  "desc": "Supplemental note for understanding current agentic AI direction around Bedrock, AgentCore, Claude, RAG, MCP, and production agent operations. Use this for architecture context, not as a…",
  "file": "/exams/md/14-agentic-ai/agentic-ai-current-innovation-map.md",
  "track": "exam_genai",
  "tab": "Agentic AI",
  "group": "",
  "status": "supplemental",
  "domains": [],
  "domainScope": "supplemental",
  "services": [
   "Amazon Bedrock",
   "Amazon Bedrock AgentCore",
   "Anthropic Claude"
  ],
  "tags": [
   "aws",
   "agentic-ai",
   "bedrock",
   "agentcore",
   "mcp",
   "claude"
  ],
  "aliases": [
   "Agentic AI Innovation Map",
   "Latest Agentic AI Patterns"
  ],
  "certifications": [],
  "lastVerified": "2026-05-16",
  "sourceType": "official-docs",
  "sourceCount": 6,
  "words": 685
 },
 {
  "slug": "14-agentic-ai/agentic-rag-patterns",
  "title": "Agentic RAG Patterns",
  "desc": "Supplemental bridge between Bedrock RAG Decision Guide and agent design. RAG is exam-relevant through Bedrock Knowledge Bases and model grounding; \"agentic RAG\" is the production pattern…",
  "file": "/exams/md/14-agentic-ai/agentic-rag-patterns.md",
  "track": "exam_genai",
  "tab": "Agentic AI",
  "group": "",
  "status": "supplemental",
  "domains": [
   "2.1",
   "3.1",
   "4.1"
  ],
  "domainScope": "",
  "services": [
   "Amazon Bedrock",
   "Amazon Bedrock Knowledge Bases",
   "Amazon Bedrock Agents"
  ],
  "tags": [
   "aws",
   "agentic-ai",
   "rag",
   "bedrock"
  ],
  "aliases": [
   "Agentic RAG",
   "RAG for Agents"
  ],
  "certifications": [],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 555
 },
 {
  "slug": "14-agentic-ai/model-context-protocol-mcp",
  "title": "Model Context Protocol (MCP)",
  "desc": "Supplemental current-agentic-AI note. MCP is not a primary MLA-C01 service, but it is increasingly important for understanding how agents connect to tools, data sources, prompts, and…",
  "file": "/exams/md/14-agentic-ai/model-context-protocol-mcp.md",
  "track": "exam_genai",
  "tab": "Agentic AI",
  "group": "",
  "status": "supplemental",
  "domains": [],
  "domainScope": "supplemental",
  "services": [
   "Model Context Protocol",
   "Amazon Bedrock AgentCore",
   "Anthropic Claude"
  ],
  "tags": [
   "aws",
   "agentic-ai",
   "mcp",
   "tools",
   "protocol"
  ],
  "aliases": [
   "MCP",
   "Model Context Protocol",
   "MCP Servers"
  ],
  "certifications": [],
  "lastVerified": "2026-05-16",
  "sourceType": "official-docs",
  "sourceCount": 7,
  "words": 570
 },
 {
  "slug": "14-agentic-ai/claude-agentic-ai-on-aws",
  "title": "Claude Agentic AI on AWS",
  "desc": "Supplemental note for current Claude capabilities that influence AWS agentic architectures. MLA-C01 may mention Bedrock and foundation models, but detailed Claude model/version features…",
  "file": "/exams/md/14-agentic-ai/claude-agentic-ai-on-aws.md",
  "track": "exam_genai",
  "tab": "Agentic AI",
  "group": "",
  "status": "supplemental",
  "domains": [],
  "domainScope": "supplemental",
  "services": [
   "Anthropic Claude",
   "Amazon Bedrock",
   "Amazon Bedrock AgentCore"
  ],
  "tags": [
   "aws",
   "agentic-ai",
   "claude",
   "bedrock",
   "mcp"
  ],
  "aliases": [
   "Claude Agents on AWS",
   "Claude Tool Use on AWS"
  ],
  "certifications": [],
  "lastVerified": "2026-05-16",
  "sourceType": "official-docs",
  "sourceCount": 5,
  "words": 597
 },
 {
  "slug": "14-agentic-ai/agent-squad",
  "title": "Agent Squad in Amazon Bedrock",
  "desc": "Agent Squad is an open-source framework (AWS Labs) for multi-agent orchestration.",
  "file": "/exams/md/14-agentic-ai/agent-squad.md",
  "track": "exam_genai",
  "tab": "Agentic AI",
  "group": "",
  "status": "supplemental",
  "domains": [],
  "domainScope": "supplemental",
  "services": [],
  "tags": [
   "aws",
   "14_agentic_ai"
  ],
  "aliases": [
   "Agent Squad in Amazon Bedrock"
  ],
  "certifications": [],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 6,
  "words": 442
 },
 {
  "slug": "14-agentic-ai/strands-ai",
  "title": "Strands Agents in Amazon Bedrock",
  "desc": "Strands Agents is an open-source, code-first SDK from AWS for building agentic AI applications.",
  "file": "/exams/md/14-agentic-ai/strands-ai.md",
  "track": "exam_genai",
  "tab": "Agentic AI",
  "group": "",
  "status": "supplemental",
  "domains": [],
  "domainScope": "supplemental",
  "services": [],
  "tags": [
   "aws",
   "14_agentic_ai"
  ],
  "aliases": [
   "Strands Agents in Amazon Bedrock"
  ],
  "certifications": [],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 4,
  "words": 407
 },
 {
  "slug": "09-machine-learning-operations/docker",
  "title": "Docker",
  "desc": "This detailed overview should provide a solid foundation on container concepts and their integration into AWS ML services. Whether you’re packaging models, deploying inference endpoints, or…",
  "file": "/exams/md/09-machine-learning-operations/docker.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Containers & compute",
  "status": "draft",
  "domains": [
   "3.1",
   "3.3",
   "4.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "09_machine_learning_operations"
  ],
  "aliases": [
   "Docker"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 1435
 },
 {
  "slug": "09-machine-learning-operations/elastic-container-registry",
  "title": "Elastic Container Registry",
  "desc": "is a fully managed container registry service that simplifies storing, managing, and deploying Docker images on AWS. Its tight integration with other AWS services—such as ECS, EKS, and…",
  "file": "/exams/md/09-machine-learning-operations/elastic-container-registry.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Containers & compute",
  "status": "draft",
  "domains": [
   "3.1",
   "3.3",
   "4.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "09_machine_learning_operations"
  ],
  "aliases": [
   "Elastic Container Registry"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 640
 },
 {
  "slug": "09-machine-learning-operations/elastic-container-service",
  "title": "Elastic Container Service",
  "desc": "ECS supports two primary launch types that dictate how your containers are hosted and managed:",
  "file": "/exams/md/09-machine-learning-operations/elastic-container-service.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Containers & compute",
  "status": "draft",
  "domains": [
   "3.1",
   "3.3",
   "4.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "09_machine_learning_operations"
  ],
  "aliases": [
   "Elastic Container Service"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 1160
 },
 {
  "slug": "09-machine-learning-operations/elastic-kubernetes-service",
  "title": "Elastic Kubernetes Service",
  "desc": "is a managed Kubernetes service on AWS. It enables you to deploy, scale, and manage containerized applications using Kubernetes—a widely adopted, open-source container orchestration system.…",
  "file": "/exams/md/09-machine-learning-operations/elastic-kubernetes-service.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Containers & compute",
  "status": "draft",
  "domains": [
   "3.1",
   "3.3",
   "4.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "09_machine_learning_operations"
  ],
  "aliases": [
   "Elastic Kubernetes Service"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 877
 },
 {
  "slug": "09-machine-learning-operations/sagemaker-kubernetes",
  "title": "SageMaker Kubernetes",
  "desc": "SageMaker’s flexible MLOps offerings allow you to:",
  "file": "/exams/md/09-machine-learning-operations/sagemaker-kubernetes.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Containers & compute",
  "status": "draft",
  "domains": [
   "3.1",
   "3.3",
   "4.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "09_machine_learning_operations"
  ],
  "aliases": [
   "SageMaker Kubernetes"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 568
 },
 {
  "slug": "09-machine-learning-operations/aws-batch",
  "title": "AWS Batch",
  "desc": "is a fully managed service designed to run batch computing workloads on AWS. It dynamically provisions the underlying compute resources (whether EC2 instances or Spot Instances) based on…",
  "file": "/exams/md/09-machine-learning-operations/aws-batch.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Containers & compute",
  "status": "draft",
  "domains": [
   "3.1",
   "3.3",
   "4.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "09_machine_learning_operations"
  ],
  "aliases": [
   "AWS Batch"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 872
 },
 {
  "slug": "09-machine-learning-operations/lambda-for-ml-workflows",
  "title": "AWS Lambda For ML Workflows",
  "desc": "Compute service for event-driven orchestration glue, preprocessing, lightweight inference wrappers, and automation around ML workflows.",
  "file": "/exams/md/09-machine-learning-operations/lambda-for-ml-workflows.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Containers & compute",
  "status": "reviewed",
  "domains": [
   "3.1",
   "3.3",
   "4.1"
  ],
  "domainScope": "",
  "services": [
   "AWS Lambda"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "serverless"
  ],
  "aliases": [
   "AWS Lambda For ML Workflows"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 251
 },
 {
  "slug": "09-machine-learning-operations/djl-serving",
  "title": "DJL Serving (Deep Java Library)",
  "desc": "DJL Serving is a high‑performance, universal model server powered by the Deep Java Library (DJL).",
  "file": "/exams/md/09-machine-learning-operations/djl-serving.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Containers & compute",
  "status": "draft",
  "domains": [
   "3.1",
   "3.3",
   "4.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "09_machine_learning_operations"
  ],
  "aliases": [
   "DJL Serving (Deep Java Library)"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 10,
  "words": 450
 },
 {
  "slug": "09-machine-learning-operations/code-pipeline",
  "title": "Code Pipeline",
  "desc": "is a fully managed continuous integration and continuous delivery (CI/CD) service that orchestrates the various stages of your application delivery process. It enables you to automatically…",
  "file": "/exams/md/09-machine-learning-operations/code-pipeline.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "CI/CD & infrastructure as code",
  "status": "draft",
  "domains": [
   "3.1",
   "3.3",
   "4.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "09_machine_learning_operations"
  ],
  "aliases": [
   "Code Pipeline"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 851
 },
 {
  "slug": "09-machine-learning-operations/code-build",
  "title": "Code Build",
  "desc": "",
  "file": "/exams/md/09-machine-learning-operations/code-build.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "CI/CD & infrastructure as code",
  "status": "draft",
  "domains": [
   "3.1",
   "3.3",
   "4.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "09_machine_learning_operations"
  ],
  "aliases": [
   "Code Build"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 16
 },
 {
  "slug": "09-machine-learning-operations/code-deploy",
  "title": "Code Deploy",
  "desc": "is a deployment service that automates application deployments to various compute services such as Amazon EC2 instances and even on-premises servers. Unlike services like Elastic Beanstalk…",
  "file": "/exams/md/09-machine-learning-operations/code-deploy.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "CI/CD & infrastructure as code",
  "status": "draft",
  "domains": [
   "3.1",
   "3.3",
   "4.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "09_machine_learning_operations"
  ],
  "aliases": [
   "Code Deploy"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 829
 },
 {
  "slug": "09-machine-learning-operations/codeartifact",
  "title": "AWS CodeArtifact",
  "desc": "Managed artifact repository for software packages used by ML application and pipeline builds.",
  "file": "/exams/md/09-machine-learning-operations/codeartifact.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "CI/CD & infrastructure as code",
  "status": "reviewed",
  "domains": [
   "3.2",
   "3.3"
  ],
  "domainScope": "",
  "services": [
   "AWS CodeArtifact"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "developer-tools"
  ],
  "aliases": [
   "AWS CodeArtifact"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 199
 },
 {
  "slug": "09-machine-learning-operations/codeguru",
  "title": "Amazon CodeGuru",
  "desc": "In-scope ML-powered developer/operations tooling for code review, security finding, and application performance insight context.",
  "file": "/exams/md/09-machine-learning-operations/codeguru.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "CI/CD & infrastructure as code",
  "status": "reviewed",
  "domains": [
   "3.3",
   "4.1"
  ],
  "domainScope": "",
  "services": [
   "Amazon CodeGuru"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "developer-tools",
   "operations"
  ],
  "aliases": [
   "Amazon CodeGuru"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 200
 },
 {
  "slug": "09-machine-learning-operations/cloud-formation",
  "title": "Cloud Formation",
  "desc": "is a service that enables you to model, provision, and manage your AWS infrastructure using a declarative template. Instead of manually creating resources through the AWS Management…",
  "file": "/exams/md/09-machine-learning-operations/cloud-formation.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "CI/CD & infrastructure as code",
  "status": "draft",
  "domains": [
   "3.1",
   "3.3",
   "4.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "09_machine_learning_operations"
  ],
  "aliases": [
   "Cloud Formation"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 1159
 },
 {
  "slug": "09-machine-learning-operations/cloud-development-kit",
  "title": "Cloud Development Kit",
  "desc": "The AWS Cloud Development Kit (CDK) is an open source software development framework that enables you to define your cloud infrastructure using familiar programming languages—such as…",
  "file": "/exams/md/09-machine-learning-operations/cloud-development-kit.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "CI/CD & infrastructure as code",
  "status": "draft",
  "domains": [
   "3.1",
   "3.3",
   "4.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "09_machine_learning_operations"
  ],
  "aliases": [
   "Cloud Development Kit"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 983
 },
 {
  "slug": "09-machine-learning-operations/serverless-application-repository",
  "title": "AWS Serverless Application Repository",
  "desc": "In-scope compute-adjacent service for finding, deploying, and publishing packaged serverless applications.",
  "file": "/exams/md/09-machine-learning-operations/serverless-application-repository.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "CI/CD & infrastructure as code",
  "status": "reviewed",
  "domains": [
   "3.1"
  ],
  "domainScope": "",
  "services": [
   "AWS Serverless Application Repository"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "serverless"
  ],
  "aliases": [
   "AWS Serverless Application Repository"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 195
 },
 {
  "slug": "09-machine-learning-operations/aws-appconfig",
  "title": "AWS AppConfig",
  "desc": "AWS AppConfig is listed out of scope for MLA-C01. Keep only as application-configuration background.",
  "file": "/exams/md/09-machine-learning-operations/aws-appconfig.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "CI/CD & infrastructure as code",
  "status": "out-of-scope",
  "domains": [],
  "domainScope": "supplemental",
  "services": [
   "AWS AppConfig"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "out-of-scope"
  ],
  "aliases": [
   "AWS AppConfig"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 1,
  "words": 122
 },
 {
  "slug": "09-machine-learning-operations/git",
  "title": "Git",
  "desc": "is a distributed version control system that enables multiple developers to work on code simultaneously while tracking changes over time. It is widely used for managing source code in both…",
  "file": "/exams/md/09-machine-learning-operations/git.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "CI/CD & infrastructure as code",
  "status": "draft",
  "domains": [
   "3.1",
   "3.3",
   "4.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "09_machine_learning_operations"
  ],
  "aliases": [
   "Git"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 941
 },
 {
  "slug": "09-machine-learning-operations/git-branching-strategies",
  "title": "Git Branching Strategies",
  "desc": "is a branching strategy that provides a robust framework for managing multiple streams of work simultaneously. It defines several types of branches, each with a specific purpose:",
  "file": "/exams/md/09-machine-learning-operations/git-branching-strategies.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "CI/CD & infrastructure as code",
  "status": "draft",
  "domains": [
   "3.1",
   "3.3",
   "4.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "09_machine_learning_operations"
  ],
  "aliases": [
   "Git Branching Strategies"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 850
 },
 {
  "slug": "09-machine-learning-operations/cicd-tests-for-ml-pipelines",
  "title": "CI/CD Tests For ML Pipelines",
  "desc": "Testing strategy note for validating ML code, data contracts, pipelines, model artifacts, and deployments in CI/CD.",
  "file": "/exams/md/09-machine-learning-operations/cicd-tests-for-ml-pipelines.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "CI/CD & infrastructure as code",
  "status": "reviewed",
  "domains": [
   "3.2",
   "3.3"
  ],
  "domainScope": "",
  "services": [
   "AWS CodePipeline",
   "AWS CodeBuild",
   "Amazon SageMaker AI"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "cicd",
   "testing"
  ],
  "aliases": [
   "CI/CD Tests For ML Pipelines"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 208
 },
 {
  "slug": "09-machine-learning-operations/step-functions",
  "title": "Step Functions",
  "desc": "is a powerful serverless orchestration service designed to coordinate multiple AWS services into serverless workflows. These workflows, defined as state machines using the Amazon States…",
  "file": "/exams/md/09-machine-learning-operations/step-functions.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Orchestration & events",
  "status": "draft",
  "domains": [
   "3.1",
   "3.3",
   "4.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "09_machine_learning_operations"
  ],
  "aliases": [
   "Step Functions"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 899
 },
 {
  "slug": "09-machine-learning-operations/apache-managed-workflows-for-apache-airflow",
  "title": "Apache Managed Workflows For Apache Airflow",
  "desc": "Amazon Managed Workflows for Apache Airflow (MWAA) is a fully managed service that simplifies the deployment, management, and scaling of Apache Airflow—a popular open source workflow…",
  "file": "/exams/md/09-machine-learning-operations/apache-managed-workflows-for-apache-airflow.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Orchestration & events",
  "status": "draft",
  "domains": [
   "3.1",
   "3.3",
   "4.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "09_machine_learning_operations"
  ],
  "aliases": [
   "Apache Managed Workflows For Apache Airflow"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 908
 },
 {
  "slug": "09-machine-learning-operations/event-bridge",
  "title": "Event Bridge",
  "desc": "(formerly known as CloudWatch Events) is a serverless event bus service that enables you to build event-driven architectures by easily integrating data from AWS services, custom…",
  "file": "/exams/md/09-machine-learning-operations/event-bridge.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Orchestration & events",
  "status": "draft",
  "domains": [
   "3.1",
   "3.3",
   "4.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "09_machine_learning_operations"
  ],
  "aliases": [
   "Event Bridge"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 994
 },
 {
  "slug": "09-machine-learning-operations/sns",
  "title": "Amazon SNS",
  "desc": "Application integration service for pub/sub notifications and fanout in ML workflows.",
  "file": "/exams/md/09-machine-learning-operations/sns.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Orchestration & events",
  "status": "reviewed",
  "domains": [
   "3.3",
   "4.1"
  ],
  "domainScope": "",
  "services": [
   "Amazon SNS"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "application-integration"
  ],
  "aliases": [
   "Amazon SNS"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 219
 },
 {
  "slug": "09-machine-learning-operations/sqs",
  "title": "Amazon SQS",
  "desc": "Application integration service for durable queue-based decoupling in asynchronous ML workflows.",
  "file": "/exams/md/09-machine-learning-operations/sqs.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Orchestration & events",
  "status": "reviewed",
  "domains": [
   "3.3"
  ],
  "domainScope": "",
  "services": [
   "Amazon SQS"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "application-integration"
  ],
  "aliases": [
   "Amazon SQS"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 203
 },
 {
  "slug": "09-machine-learning-operations/api-gateway",
  "title": "Amazon API Gateway",
  "desc": "Managed service for creating and securing APIs in front of ML applications and inference workflows.",
  "file": "/exams/md/09-machine-learning-operations/api-gateway.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Orchestration & events",
  "status": "reviewed",
  "domains": [
   "3.1",
   "3.2",
   "4.3"
  ],
  "domainScope": "",
  "services": [
   "Amazon API Gateway"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "api"
  ],
  "aliases": [
   "Amazon API Gateway"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 203
 },
 {
  "slug": "09-machine-learning-operations/cloudfront",
  "title": "Amazon CloudFront",
  "desc": "CDN service for low-latency delivery and caching in ML and generative AI applications that serve static or dynamic web content.",
  "file": "/exams/md/09-machine-learning-operations/cloudfront.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Orchestration & events",
  "status": "reviewed",
  "domains": [
   "3.1",
   "4.2"
  ],
  "domainScope": "",
  "services": [
   "Amazon CloudFront"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "networking",
   "cdn"
  ],
  "aliases": [
   "Amazon CloudFront"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 205
 },
 {
  "slug": "09-machine-learning-operations/sagemaker-deploying-for-inference",
  "title": "SageMaker Deploying For Inference",
  "desc": "Once a model is trained and validated, it must be made accessible to end-user applications through an inference endpoint. Whether you need to support real-time, asynchronous, or batch…",
  "file": "/exams/md/09-machine-learning-operations/sagemaker-deploying-for-inference.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Inference & deployment",
  "status": "draft",
  "domains": [
   "3.1",
   "3.3",
   "4.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "09_machine_learning_operations"
  ],
  "aliases": [
   "SageMaker Deploying For Inference"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 1100
 },
 {
  "slug": "09-machine-learning-operations/sagemaker-inner-details-and-prod-variants",
  "title": "Start with a TensorFlow base image",
  "desc": "Every SageMaker training job and inference endpoint runs inside a Docker container. This design ensures that your ML code, dependencies, and runtime environment are fully isolated and…",
  "file": "/exams/md/09-machine-learning-operations/sagemaker-inner-details-and-prod-variants.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Inference & deployment",
  "status": "draft",
  "domains": [
   "3.1",
   "3.3",
   "4.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "09_machine_learning_operations"
  ],
  "aliases": [
   "Start with a TensorFlow base image"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 1207
 },
 {
  "slug": "09-machine-learning-operations/sagemaker-inference-recommender",
  "title": "SageMaker Inference Recommender",
  "desc": "Amazon SageMaker Serverless Inference lets you deploy your model without pre-provisioning or managing any underlying infrastructure. You simply define the memory size (from 1 GB up to 6 GB)…",
  "file": "/exams/md/09-machine-learning-operations/sagemaker-inference-recommender.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Inference & deployment",
  "status": "draft",
  "domains": [
   "3.1",
   "3.3",
   "4.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "09_machine_learning_operations"
  ],
  "aliases": [
   "SageMaker Inference Recommender"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 732
 },
 {
  "slug": "09-machine-learning-operations/inference-pipelines",
  "title": "Inference Pipelines",
  "desc": "allow you to chain together multiple inference containers (Docker images) in a linear sequence—between 2 and 15 containers—to perform a complete end-to-end inference workflow. Instead of…",
  "file": "/exams/md/09-machine-learning-operations/inference-pipelines.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Inference & deployment",
  "status": "draft",
  "domains": [
   "3.1",
   "3.3",
   "4.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "09_machine_learning_operations"
  ],
  "aliases": [
   "Inference Pipelines"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 496
 },
 {
  "slug": "09-machine-learning-operations/deployment-mode-decision-guide",
  "title": "Deployment Mode Decision Guide",
  "desc": "Decision guide for choosing real-time, async, batch, serverless, multi-model, and multi-container SageMaker deployment modes.",
  "file": "/exams/md/09-machine-learning-operations/deployment-mode-decision-guide.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Inference & deployment",
  "status": "reviewed",
  "domains": [
   "3.1"
  ],
  "domainScope": "",
  "services": [
   "Amazon SageMaker AI"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "deployment"
  ],
  "aliases": [
   "Deployment Mode Decision Guide"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 251
 },
 {
  "slug": "09-machine-learning-operations/deployment-guardrails-and-shadow-test",
  "title": "Deployment Guardrails And Shadow Test",
  "desc": "are new SageMaker features designed to safely update models in production. They help you avoid downtime and minimize risk by controlling how traffic is shifted from an old model (blue…",
  "file": "/exams/md/09-machine-learning-operations/deployment-guardrails-and-shadow-test.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Inference & deployment",
  "status": "draft",
  "domains": [
   "3.1",
   "3.3",
   "4.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "09_machine_learning_operations"
  ],
  "aliases": [
   "Deployment Guardrails And Shadow Test"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 733
 },
 {
  "slug": "09-machine-learning-operations/endpoint-autoscaling-metrics",
  "title": "Endpoint Autoscaling Metrics",
  "desc": "Operational note for choosing SageMaker endpoint scaling metrics and policies.",
  "file": "/exams/md/09-machine-learning-operations/endpoint-autoscaling-metrics.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Inference & deployment",
  "status": "reviewed",
  "domains": [
   "3.1",
   "4.2"
  ],
  "domainScope": "",
  "services": [
   "Amazon SageMaker AI",
   "Application Auto Scaling"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "autoscaling"
  ],
  "aliases": [
   "Endpoint Autoscaling Metrics"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 195
 },
 {
  "slug": "09-machine-learning-operations/resource-management-and-autoscaling",
  "title": "Resource Management And Autoscaling",
  "desc": "is an essential operations concern that focuses on selecting the optimal instance types and configurations for both training and inference. The goal is to maximize performance while…",
  "file": "/exams/md/09-machine-learning-operations/resource-management-and-autoscaling.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Inference & deployment",
  "status": "draft",
  "domains": [
   "3.1",
   "3.3",
   "4.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "09_machine_learning_operations"
  ],
  "aliases": [
   "Resource Management And Autoscaling"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 635
 },
 {
  "slug": "09-machine-learning-operations/aws-auto-scaling",
  "title": "AWS Auto Scaling For ML Workloads",
  "desc": "Scaling note for SageMaker AI endpoints and supporting services using target tracking, step, scheduled, or predictive scaling patterns.",
  "file": "/exams/md/09-machine-learning-operations/aws-auto-scaling.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Inference & deployment",
  "status": "reviewed",
  "domains": [
   "3.1",
   "4.2"
  ],
  "domainScope": "",
  "services": [
   "Application Auto Scaling",
   "Amazon SageMaker AI"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "autoscaling"
  ],
  "aliases": [
   "AWS Auto Scaling For ML Workloads"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 223
 },
 {
  "slug": "09-machine-learning-operations/retraining-triggers-and-drift-response",
  "title": "Retraining Triggers And Drift Response",
  "desc": "Monitoring and maintenance note for responding to data drift, model quality drift, bias drift, and infrastructure signals.",
  "file": "/exams/md/09-machine-learning-operations/retraining-triggers-and-drift-response.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Inference & deployment",
  "status": "reviewed",
  "domains": [
   "4.1",
   "3.3"
  ],
  "domainScope": "",
  "services": [
   "Amazon SageMaker AI",
   "Amazon EventBridge"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4",
   "monitoring",
   "drift"
  ],
  "aliases": [
   "Retraining Triggers And Drift Response"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 217
 },
 {
  "slug": "09-machine-learning-operations/sagemaker-on-the-edge",
  "title": "SageMaker On The Edge",
  "desc": "Supplemental edge-deployment context. Use for historical/adjacent knowledge only; AWS IoT Greengrass is out-of-scope for MLA-C01 and SageMaker Edge Manager is EOL.",
  "file": "/exams/md/09-machine-learning-operations/sagemaker-on-the-edge.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Edge & IoT",
  "status": "supplemental",
  "domains": [
   "3.1"
  ],
  "domainScope": "",
  "services": [
   "Amazon SageMaker AI",
   "AWS IoT Greengrass"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "supplemental",
   "edge"
  ],
  "aliases": [
   "SageMaker On The Edge"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 195
 },
 {
  "slug": "09-machine-learning-operations/greengrass",
  "title": "AWS IoT Greengrass",
  "desc": "AWS IoT Greengrass is listed out of scope for MLA-C01; Greengrass V1 is also in sunset. Keep only as edge context.",
  "file": "/exams/md/09-machine-learning-operations/greengrass.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Edge & IoT",
  "status": "out-of-scope",
  "domains": [],
  "domainScope": "supplemental",
  "services": [
   "AWS IoT Greengrass"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "out-of-scope"
  ],
  "aliases": [
   "AWS IoT Greengrass"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 134
 },
 {
  "slug": "09-machine-learning-operations/aws-cost-management-for-ml",
  "title": "AWS Cost Management For ML",
  "desc": "Domain 4 cost governance note for controlling ML training, inference, storage, and data pipeline spend.",
  "file": "/exams/md/09-machine-learning-operations/aws-cost-management-for-ml.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Cost, observability & governance",
  "status": "reviewed",
  "domains": [
   "4.2"
  ],
  "domainScope": "",
  "services": [
   "AWS Billing and Cost Management",
   "AWS Budgets",
   "AWS Cost Explorer"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4",
   "cost-management"
  ],
  "aliases": [
   "AWS Cost Management For ML"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 230
 },
 {
  "slug": "09-machine-learning-operations/compute-optimizer",
  "title": "AWS Compute Optimizer",
  "desc": "Cost/performance optimization service for rightsizing supported AWS compute resources.",
  "file": "/exams/md/09-machine-learning-operations/compute-optimizer.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Cost, observability & governance",
  "status": "reviewed",
  "domains": [
   "4.2"
  ],
  "domainScope": "",
  "services": [
   "AWS Compute Optimizer"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4",
   "cost-optimization"
  ],
  "aliases": [
   "AWS Compute Optimizer"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 191
 },
 {
  "slug": "09-machine-learning-operations/trusted-advisor",
  "title": "AWS Trusted Advisor",
  "desc": "Recommendation service that checks AWS environments across cost optimization, performance, security, fault tolerance, service limits, and operational excellence.",
  "file": "/exams/md/09-machine-learning-operations/trusted-advisor.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Cost, observability & governance",
  "status": "reviewed",
  "domains": [
   "4.2",
   "4.3"
  ],
  "domainScope": "",
  "services": [
   "AWS Trusted Advisor"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4",
   "operations",
   "cost-optimization"
  ],
  "aliases": [
   "AWS Trusted Advisor"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 209
 },
 {
  "slug": "09-machine-learning-operations/devops-guru",
  "title": "Amazon DevOps Guru",
  "desc": "In-scope ML-powered operations service for detecting abnormal operational behavior and producing recommendations.",
  "file": "/exams/md/09-machine-learning-operations/devops-guru.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Cost, observability & governance",
  "status": "reviewed",
  "domains": [
   "4.1",
   "4.2"
  ],
  "domainScope": "",
  "services": [
   "Amazon DevOps Guru"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4",
   "operations"
  ],
  "aliases": [
   "Amazon DevOps Guru"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 208
 },
 {
  "slug": "09-machine-learning-operations/aws-chatbot",
  "title": "Amazon Q Developer In Chat Applications",
  "desc": "Current name for AWS Chatbot: ChatOps service for receiving AWS notifications and running AWS CLI commands from chat channels.",
  "file": "/exams/md/09-machine-learning-operations/aws-chatbot.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Cost, observability & governance",
  "status": "reviewed",
  "domains": [
   "4.1",
   "4.2"
  ],
  "domainScope": "",
  "services": [
   "Amazon Q Developer in chat applications"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4",
   "chatops"
  ],
  "aliases": [
   "Amazon Q Developer In Chat Applications"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 219
 },
 {
  "slug": "09-machine-learning-operations/x-ray",
  "title": "AWS X-Ray",
  "desc": "Tracing service for request-level observability across application services that call ML endpoints and downstream dependencies.",
  "file": "/exams/md/09-machine-learning-operations/x-ray.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Cost, observability & governance",
  "status": "reviewed",
  "domains": [
   "3.3",
   "4.1"
  ],
  "domainScope": "",
  "services": [
   "AWS X-Ray"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "observability"
  ],
  "aliases": [
   "AWS X-Ray"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 222
 },
 {
  "slug": "09-machine-learning-operations/lake-formation",
  "title": "Lake Formation",
  "desc": "is a managed service designed to simplify and accelerate the process of setting up a secure data lake on AWS. Originally announced in 2018 and significantly refined over 2020, Lake…",
  "file": "/exams/md/09-machine-learning-operations/lake-formation.md",
  "track": "exam_mlops",
  "tab": "Operations & deployment",
  "group": "Cost, observability & governance",
  "status": "draft",
  "domains": [
   "3.1",
   "3.3",
   "4.2"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-3",
   "domain-4",
   "09_machine_learning_operations"
  ],
  "aliases": [
   "Lake Formation"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 838
 },
 {
  "slug": "10-security-identity-and-compliance/IAM",
  "title": "IAM",
  "desc": "is a service that allows you to securely manage access to AWS resources. IAM is foundational for every AWS workload—including ML—because it enforces least privilege access, authorization,…",
  "file": "/exams/md/10-security-identity-and-compliance/IAM.md",
  "track": "exam_mlops",
  "tab": "Security & compliance",
  "group": "Identity & access",
  "status": "draft",
  "domains": [
   "4.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4",
   "10_security_identity_and_compliance"
  ],
  "aliases": [
   "IAM"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 932
 },
 {
  "slug": "10-security-identity-and-compliance/organizations",
  "title": "AWS Organizations",
  "desc": "Multi-account governance and consolidated billing service for AWS environments.",
  "file": "/exams/md/10-security-identity-and-compliance/organizations.md",
  "track": "exam_mlops",
  "tab": "Security & compliance",
  "group": "Identity & access",
  "status": "reviewed",
  "domains": [
   "4.2",
   "4.3"
  ],
  "domainScope": "",
  "services": [
   "AWS Organizations"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4",
   "governance",
   "multi-account"
  ],
  "aliases": [
   "AWS Organizations"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 213
 },
 {
  "slug": "10-security-identity-and-compliance/sagemaker-role-manager",
  "title": "Amazon SageMaker Role Manager",
  "desc": "SageMaker feature for creating persona-based IAM roles with least-privilege permissions for ML activities.",
  "file": "/exams/md/10-security-identity-and-compliance/sagemaker-role-manager.md",
  "track": "exam_mlops",
  "tab": "Security & compliance",
  "group": "Identity & access",
  "status": "reviewed",
  "domains": [
   "4.3"
  ],
  "domainScope": "",
  "services": [
   "Amazon SageMaker AI"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4",
   "security",
   "iam"
  ],
  "aliases": [
   "Amazon SageMaker Role Manager"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 207
 },
 {
  "slug": "10-security-identity-and-compliance/service-catalog",
  "title": "AWS Service Catalog",
  "desc": "Governed self-service catalog for approved AWS infrastructure and application templates.",
  "file": "/exams/md/10-security-identity-and-compliance/service-catalog.md",
  "track": "exam_mlops",
  "tab": "Security & compliance",
  "group": "Identity & access",
  "status": "reviewed",
  "domains": [
   "3.2",
   "4.3"
  ],
  "domainScope": "",
  "services": [
   "AWS Service Catalog"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4",
   "governance"
  ],
  "aliases": [
   "AWS Service Catalog"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 196
 },
 {
  "slug": "10-security-identity-and-compliance/key-management-service",
  "title": "🔐 AWS KMS (Key Management Service) – Complete Notes",
  "desc": "is a fully managed service that makes it easy to create and control cryptographic keys and secure your data across AWS services and applications.",
  "file": "/exams/md/10-security-identity-and-compliance/key-management-service.md",
  "track": "exam_mlops",
  "tab": "Security & compliance",
  "group": "Data protection",
  "status": "draft",
  "domains": [
   "4.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4",
   "10_security_identity_and_compliance"
  ],
  "aliases": [
   "🔐 AWS KMS (Key Management Service) – Complete Notes"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 1314
 },
 {
  "slug": "10-security-identity-and-compliance/secrets-manager",
  "title": "🔐 AWS Secrets Manager",
  "desc": "is a fully managed service that enables you to store, manage, and retrieve sensitive information (called “secrets”) such as:",
  "file": "/exams/md/10-security-identity-and-compliance/secrets-manager.md",
  "track": "exam_mlops",
  "tab": "Security & compliance",
  "group": "Data protection",
  "status": "draft",
  "domains": [
   "4.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4",
   "10_security_identity_and_compliance"
  ],
  "aliases": [
   "🔐 AWS Secrets Manager"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 965
 },
 {
  "slug": "10-security-identity-and-compliance/ssm-parameter-store",
  "title": "🧩 AWS SSM Parameter Store",
  "desc": "is a feature of AWS Systems Manager that provides secure, hierarchical storage for configuration data and secrets.",
  "file": "/exams/md/10-security-identity-and-compliance/ssm-parameter-store.md",
  "track": "exam_mlops",
  "tab": "Security & compliance",
  "group": "Data protection",
  "status": "draft",
  "domains": [
   "4.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4",
   "10_security_identity_and_compliance"
  ],
  "aliases": [
   "🧩 AWS SSM Parameter Store"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 912
 },
 {
  "slug": "10-security-identity-and-compliance/macie",
  "title": "🔍 Amazon Macie",
  "desc": "is a fully managed data security and data privacy service that uses machine learning and pattern matching to automatically discover, classify, and protect sensitive data (like PII or…",
  "file": "/exams/md/10-security-identity-and-compliance/macie.md",
  "track": "exam_mlops",
  "tab": "Security & compliance",
  "group": "Data protection",
  "status": "draft",
  "domains": [
   "4.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4",
   "10_security_identity_and_compliance"
  ],
  "aliases": [
   "🔍 Amazon Macie"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 965
 },
 {
  "slug": "10-security-identity-and-compliance/data-classification-pii-phi-data-residency",
  "title": "Data Classification, PII, PHI, And Data Residency",
  "desc": "Security and data preparation note for classifying sensitive data, protecting PII/PHI, and meeting data residency requirements.",
  "file": "/exams/md/10-security-identity-and-compliance/data-classification-pii-phi-data-residency.md",
  "track": "exam_mlops",
  "tab": "Security & compliance",
  "group": "Data protection",
  "status": "reviewed",
  "domains": [
   "1.3",
   "4.3"
  ],
  "domainScope": "",
  "services": [
   "Amazon Macie",
   "Amazon Comprehend Medical",
   "AWS HealthLake"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-1",
   "domain-4",
   "security",
   "data-governance"
  ],
  "aliases": [
   "Data Classification, PII, PHI, And Data Residency"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 5,
  "words": 261
 },
 {
  "slug": "10-security-identity-and-compliance/vpc",
  "title": "Define a training job with VPC configuration",
  "desc": "is a service that lets you launch AWS resources in a logically isolated virtual network. VPC provides complete control over your virtual networking environment, including resource…",
  "file": "/exams/md/10-security-identity-and-compliance/vpc.md",
  "track": "exam_mlops",
  "tab": "Security & compliance",
  "group": "Network isolation",
  "status": "draft",
  "domains": [
   "4.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4",
   "10_security_identity_and_compliance"
  ],
  "aliases": [
   "Define a training job with VPC configuration"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 3125
 },
 {
  "slug": "10-security-identity-and-compliance/private-ml-networking",
  "title": "Private ML Networking",
  "desc": "Security architecture note for keeping ML data movement, training, and inference paths private where required.",
  "file": "/exams/md/10-security-identity-and-compliance/private-ml-networking.md",
  "track": "exam_mlops",
  "tab": "Security & compliance",
  "group": "Network isolation",
  "status": "reviewed",
  "domains": [
   "1.1",
   "3.1",
   "4.3"
  ],
  "domainScope": "",
  "services": [
   "Amazon VPC",
   "AWS PrivateLink",
   "Amazon SageMaker AI"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4",
   "networking",
   "security"
  ],
  "aliases": [
   "Private ML Networking"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 3,
  "words": 224
 },
 {
  "slug": "10-security-identity-and-compliance/direct-connect",
  "title": "AWS Direct Connect",
  "desc": "Private network connectivity service for linking on-premises networks to AWS without relying only on the public internet path.",
  "file": "/exams/md/10-security-identity-and-compliance/direct-connect.md",
  "track": "exam_mlops",
  "tab": "Security & compliance",
  "group": "Network isolation",
  "status": "reviewed",
  "domains": [
   "1.1",
   "4.3"
  ],
  "domainScope": "",
  "services": [
   "AWS Direct Connect"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "networking",
   "security"
  ],
  "aliases": [
   "AWS Direct Connect"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 223
 },
 {
  "slug": "10-security-identity-and-compliance/shield",
  "title": "AWS Shield",
  "desc": "AWS Shield is listed out of scope for MLA-C01. Prioritize IAM, KMS, Macie, Secrets Manager, VPC, Config, and Organizations.",
  "file": "/exams/md/10-security-identity-and-compliance/shield.md",
  "track": "exam_mlops",
  "tab": "Security & compliance",
  "group": "Network isolation",
  "status": "out-of-scope",
  "domains": [],
  "domainScope": "supplemental",
  "services": [
   "AWS Shield"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "out-of-scope"
  ],
  "aliases": [
   "AWS Shield"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 131
 },
 {
  "slug": "10-security-identity-and-compliance/cloudtrail",
  "title": "Cloudtrail",
  "desc": "",
  "file": "/exams/md/10-security-identity-and-compliance/cloudtrail.md",
  "track": "exam_mlops",
  "tab": "Security & compliance",
  "group": "Audit & compliance",
  "status": "draft",
  "domains": [
   "4.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4",
   "10_security_identity_and_compliance"
  ],
  "aliases": [
   "Cloudtrail"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 12
 },
 {
  "slug": "10-security-identity-and-compliance/cloudwatch",
  "title": "Amazon CloudWatch",
  "desc": "Amazon CloudWatch is a monitoring and observability service natively integrated with AWS. It collects, visualizes, and analyzes operational data in the form of metrics, logs, and events…",
  "file": "/exams/md/10-security-identity-and-compliance/cloudwatch.md",
  "track": "exam_mlops",
  "tab": "Security & compliance",
  "group": "Audit & compliance",
  "status": "draft",
  "domains": [
   "4.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4",
   "10_security_identity_and_compliance"
  ],
  "aliases": [
   "Amazon CloudWatch"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 0,
  "words": 610
 },
 {
  "slug": "10-security-identity-and-compliance/aws-config",
  "title": "AWS Config",
  "desc": "Governance service for recording resource configuration history and evaluating compliance rules.",
  "file": "/exams/md/10-security-identity-and-compliance/aws-config.md",
  "track": "exam_mlops",
  "tab": "Security & compliance",
  "group": "Audit & compliance",
  "status": "reviewed",
  "domains": [
   "4.3"
  ],
  "domainScope": "",
  "services": [
   "AWS Config"
  ],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4",
   "governance",
   "compliance"
  ],
  "aliases": [
   "AWS Config"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 196
 },
 {
  "slug": "11-machine-learning-best-practices/aws-well-architected-framework-ml-lens",
  "title": "AWS Well-Architected Framework (ML Lens)",
  "desc": "The AWS Well-Architected Framework is a set of best practices and guidelines designed to help cloud architects build secure, high-performing, resilient, and efficient infrastructure for…",
  "file": "/exams/md/11-machine-learning-best-practices/aws-well-architected-framework-ml-lens.md",
  "track": "exam_mlops",
  "tab": "Best practices",
  "group": "",
  "status": "draft",
  "domains": [
   "4.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4",
   "11_machine_learning_best_practices"
  ],
  "aliases": [
   "AWS Well-Architected Framework (ML Lens)"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 552
 },
 {
  "slug": "11-machine-learning-best-practices/well-architected-generative-ai-lens",
  "title": "AWS Well-Architected Generative AI Lens",
  "desc": "The Generative AI Lens extends the AWS Well-Architected Framework with guidance specific to generative AI workloads.",
  "file": "/exams/md/11-machine-learning-best-practices/well-architected-generative-ai-lens.md",
  "track": "exam_mlops",
  "tab": "Best practices",
  "group": "",
  "status": "draft",
  "domains": [
   "4.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4",
   "11_machine_learning_best_practices"
  ],
  "aliases": [
   "AWS Well-Architected Generative AI Lens"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 5,
  "words": 323
 },
 {
  "slug": "11-machine-learning-best-practices/well-architected-tool-generative-ai-lens",
  "title": "AWS Well-Architected Tool with the Generative AI Lens",
  "desc": "The AWS Well-Architected Tool (WA Tool) lets you assess workloads against best‑practice questions called lenses.",
  "file": "/exams/md/11-machine-learning-best-practices/well-architected-tool-generative-ai-lens.md",
  "track": "exam_mlops",
  "tab": "Best practices",
  "group": "",
  "status": "draft",
  "domains": [
   "4.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4",
   "11_machine_learning_best_practices"
  ],
  "aliases": [
   "AWS Well-Architected Tool with the Generative AI Lens"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 5,
  "words": 327
 },
 {
  "slug": "11-machine-learning-best-practices/responsible-ai-aws",
  "title": "Responsible AI in AWS (Bedrock + SageMaker)",
  "desc": "AWS defines responsible AI across eight dimensions: fairness, explainability, privacy and security, safety, controllability, veracity and robustness, governance, and transparency.",
  "file": "/exams/md/11-machine-learning-best-practices/responsible-ai-aws.md",
  "track": "exam_mlops",
  "tab": "Best practices",
  "group": "",
  "status": "draft",
  "domains": [
   "4.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4",
   "11_machine_learning_best_practices"
  ],
  "aliases": [
   "Responsible AI in AWS (Bedrock + SageMaker)"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 13,
  "words": 519
 },
 {
  "slug": "11-machine-learning-best-practices/amazon-augmented-ai",
  "title": "Amazon Augmented Ai",
  "desc": "Amazon Augmented AI (A2I) is an AWS service that simplifies the process of incorporating human reviews into machine learning workflows. It enables the seamless integration of human…",
  "file": "/exams/md/11-machine-learning-best-practices/amazon-augmented-ai.md",
  "track": "exam_mlops",
  "tab": "Best practices",
  "group": "",
  "status": "draft",
  "domains": [
   "4.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4",
   "11_machine_learning_best_practices"
  ],
  "aliases": [
   "Amazon Augmented Ai"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 1025
 },
 {
  "slug": "11-machine-learning-best-practices/mechanical-turk",
  "title": "Amazon Mechanical Turk",
  "desc": "Amazon Mechanical Turk (MTurk) is a fully managed crowdsourcing marketplace that enables organizations (often called \"requesters\") to access a distributed workforce (or \"workers\") to…",
  "file": "/exams/md/11-machine-learning-best-practices/mechanical-turk.md",
  "track": "exam_mlops",
  "tab": "Best practices",
  "group": "",
  "status": "draft",
  "domains": [
   "4.3"
  ],
  "domainScope": "",
  "services": [],
  "tags": [
   "aws",
   "mla-c01",
   "domain-4",
   "11_machine_learning_best_practices"
  ],
  "aliases": [
   "Amazon Mechanical Turk"
  ],
  "certifications": [
   "MLA-C01"
  ],
  "lastVerified": "2026-05-16",
  "sourceType": "aws-official",
  "sourceCount": 2,
  "words": 861
 }
];
