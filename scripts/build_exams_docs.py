#!/usr/bin/env python3
"""Build the Exams and Certification docs index from the AWS ML notes vault.

Input is one upstream repository, github.com/artreimus/notes-aws-machine-learning
— an Obsidian-style vault of 298 markdown notes covering the AWS Certified
Machine Learning Engineer - Associate (MLA-C01) exam plus the wider AWS AI/ML
surface. Every note carries YAML frontmatter (title, exam domains, status,
services, tags, last_verified, sources), which is what makes a structured
viewer possible rather than a flat file list.

The clone is expected at `<repo>/notes-aws-machine-learning/` (gitignored). It
is created automatically on first run:

    python3 scripts/build_exams_docs.py            # clone if missing, then build
    python3 scripts/build_exams_docs.py --refresh  # git pull first

and emits:

  src/data/examsDocsData.js     nav tree + page index consumed by ExamsDocs.jsx
  public/exams/md/<slug>.md     normalized page bodies, fetched on demand
  public/exams/build-report.json

Unlike the LangChain and Strands archives, this corpus is small (~2 MB of
markdown, no images), so the bodies are committed and served straight from
`public/` — no R2 rewrite is involved.

Output markdown targets the same renderer contract the LangChain viewer
established, so both share one markdown module:

    [[sagemaker-neo]]         ->  [SageMaker Neo](ex:05-sagemaker-ai/sagemaker-neo)
    ## Related Notes + list   ->  ```ex-cards  fence holding JSON
    ## Sources + list         ->  ```ex-sources fence holding JSON

The nav tree is curated rather than derived: the vault's folders are flat
listings of up to 47 notes, which is unreadable as a sidebar. TRACKS below maps
those folders onto seven tracks, and GROUPS splits the large ones into titled
branches. Both are exhaustive — a note that no group claims, or a group naming
a note that no longer exists, fails the build rather than silently dropping
out of the viewer.

Run:  python3 scripts/build_exams_docs.py
"""
import argparse
import json
import os
import re
import subprocess
import sys

import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Build input only. The viewer links to AWS documentation, never back to the
# upstream repository, so no page carries a URL into it.
SOURCE_REPO = "https://github.com/artreimus/notes-aws-machine-learning"
VAULT = os.path.join(ROOT, "notes-aws-machine-learning")

OUT_MD = os.path.join(ROOT, "public", "exams", "md")
OUT_DATA = os.path.join(ROOT, "src", "data", "examsDocsData.js")
OUT_REPORT = os.path.join(ROOT, "public", "exams", "build-report.json")

# ── the exam itself ───────────────────────────────────────────────────────
# Weights and task statements come from 00-exam-guide/, which in turn cites the
# official AWS exam guide. They drive the domain chips on every page and the
# domain map on the track landings.

DOMAINS = [
    {
        "id": "1",
        "label": "Data Preparation for Machine Learning",
        "short": "Data Preparation",
        "weight": 28,
        "slug": "00-exam-guide/domain-1-data-preparation",
        "tasks": [
            {"id": "1.1", "label": "Ingest and store data"},
            {"id": "1.2", "label": "Transform data and perform feature engineering"},
            {"id": "1.3", "label": "Ensure data integrity and prepare data for modeling"},
        ],
    },
    {
        "id": "2",
        "label": "ML Model Development",
        "short": "Model Development",
        "weight": 26,
        "slug": "00-exam-guide/domain-2-model-development",
        "tasks": [
            {"id": "2.1", "label": "Choose a modeling approach"},
            {"id": "2.2", "label": "Train and refine models"},
            {"id": "2.3", "label": "Analyze model performance"},
        ],
    },
    {
        "id": "3",
        "label": "Deployment and Orchestration of ML Workflows",
        "short": "Deployment & Orchestration",
        "weight": 22,
        "slug": "00-exam-guide/domain-3-deployment-orchestration",
        "tasks": [
            {"id": "3.1", "label": "Select deployment infrastructure based on requirements"},
            {"id": "3.2", "label": "Create and script infrastructure based on requirements"},
            {"id": "3.3", "label": "Automate and orchestrate ML workflows"},
        ],
    },
    {
        "id": "4",
        "label": "ML Solution Monitoring, Maintenance, and Security",
        "short": "Monitoring & Security",
        "weight": 24,
        "slug": "00-exam-guide/domain-4-monitoring-security",
        "tasks": [
            {"id": "4.1", "label": "Monitor model performance and data quality"},
            {"id": "4.2", "label": "Monitor infrastructure and costs"},
            {"id": "4.3", "label": "Secure AWS resources"},
        ],
    },
]

# ── the nav tree ──────────────────────────────────────────────────────────
# GROUPS[folder] is an ordered list of (group title, [basenames]). A folder
# absent from GROUPS renders flat, in FLAT_ORDER order.

GROUPS = {
    "01-ai-services": [
        ("Language & speech", ["comprehend", "comprehend-medical", "translate", "transcribe", "polly", "lex"]),
        ("Vision & documents", ["rekognition", "textract"]),
        ("Search & personalization", ["kendra", "opensearch", "personalize"]),
        ("Forecasting & anomaly detection", ["forecast", "fraud-detector", "lookout-for-equipment", "lookout-for-metrics", "lookout-for-vision"]),
        ("Industry & assistants", ["healthlake", "amazon-q"]),
    ],
    "02-data-ingestion-and-storage": [
        ("Data foundations", [
            "types-of-data", "properties-of-data", "data-sources-and-data-formats",
            "data-lake-lakehouses-warehouses", "data-mesh", "amazon-datazone",
            "etl-and-elt", "data-pipelines", "feature-engineering", "glue-databrew",
        ]),
        ("Streaming ingestion", [
            "kinesis-data-streams", "kinesis-data-firehose", "kinesis-data-stream-vs-firehose",
            "kinesis-data-analytics", "kinesis-client-library", "kinesis-producer-library",
            "kinesis-video-streams", "managed-streaming-for-apache-kafka",
            "managed-service-for-apache-flink",
        ]),
        ("Storage & transfer", [
            "s3", "s3-glacier", "elastic-block-storage", "elastic-file-system", "fsx",
            "storage-gateway", "datasync", "database-migration-service", "ec2-instance-types",
        ]),
        ("Databases", [
            "rds", "aurora", "dynamodb", "documentdb", "keyspaces", "neptune", "timestream",
            "qldb", "elasticache", "sql-databases", "no-sql-databases", "jdbc-odbc",
        ]),
        ("Warehouse & analytics", ["redshift", "redshift-spectrum", "opensearch-layers", "quicksight"]),
        ("Python toolkit", ["pandas", "scikit-learn", "matplotlib-seaborn"]),
    ],
    "03-data-transformation-integrity-and-feature-engineering": [
        ("Transformation engines", ["glue", "spark", "spark-integrations", "elastic-map-reduce", "hadoop", "hive", "presto", "athena"]),
        ("Quality & feature engineering", ["data-quality-validation", "glue-data-quality", "feature-engineering", "encoding-techniques", "tf-idf", "l1-and-l2-regularization"]),
    ],
    "04-model-training-tuning-and-evaluation": [
        ("Training & tuning", [
            "model-hyperparameters", "automatic-model-tuning-and-hyperparameter-tuning",
            "model-baselines-and-convergence", "training-compiler", "efa-and-mics",
            "tensorboard-integration-in-sagemaker", "transfer-learning",
        ]),
        ("Neural networks", ["neural-networks", "activation-functions", "convolutional-neural-networks", "recurrent-neural-networks"]),
        ("Evaluation", ["model-metrics", "model-selection-decision-guide"]),
    ],
    "05-sagemaker-ai": [
        ("Studio & workspaces", [
            "sagemaker-ai-current-capabilities", "sagemaker-studio", "sagemaker-domains",
            "sagemaker-canvas", "sagemaker-jumpstart", "sagemaker-projects",
        ]),
        ("Data & features", ["sagemaker-data-wrangler", "sagemaker-feature-store", "sagemaker-input-modes", "spark-with-sagemaker"]),
        ("Training & tuning", [
            "sagemaker-training-techniques", "sagemaker-training-compiler",
            "sagemaker-model-parallelism", "sagemaker-spot-training",
            "sagemaker-auto-pilot-or-automl", "sagemaker-debugger", "sagemaker-experiments",
        ]),
        ("Deployment & inference", [
            "sagemaker-deployment-modes", "sagemaker-model-endpoints",
            "sagemaker-elastic-inference", "sagemaker-neo", "sagemaker-pipelines",
        ]),
        ("Governance & monitoring", [
            "sagemaker-model-registry", "sagemaker-model-cards", "sagemaker-model-monitor",
            "sagemaker-clarify", "sagemaker-linear-tracking",
        ]),
    ],
    "06-sagemaker-built-in-algorithms": [
        ("Choosing an algorithm", ["sagemaker-built-in-algorithms-cheat-sheet", "supervised-and-unsupervised-models"]),
        ("Tabular & regression", [
            "linear-learner", "xgboost", "light-gbm", "catboost", "autogluon-tabular",
            "tabtransformer", "factorization-machines", "k-nearest-neighbor",
        ]),
        ("Text & NLP", ["blazing-text", "text-classification-tensorflow", "seq2seq", "latent-dirichlet-allocation", "neural-topic-model", "object2vec"]),
        ("Computer vision", [
            "image-classification", "image-classification-tensorflow", "object-detection",
            "object-detection-tensorflow", "semantic-segmentation",
        ]),
        ("Time series & anomaly", ["deep-ar", "random-cut-forest", "ip-insights"]),
        ("Clustering & dimensionality", ["k-means", "principal-component-analysis"]),
    ],
    "09-machine-learning-operations": [
        ("Containers & compute", [
            "docker", "elastic-container-registry", "elastic-container-service",
            "elastic-kubernetes-service", "sagemaker-kubernetes", "aws-batch",
            "lambda-for-ml-workflows", "djl-serving",
        ]),
        ("CI/CD & infrastructure as code", [
            "code-pipeline", "code-build", "code-deploy", "codeartifact", "codeguru",
            "cloud-formation", "cloud-development-kit", "serverless-application-repository",
            "aws-appconfig", "git", "git-branching-strategies", "cicd-tests-for-ml-pipelines",
        ]),
        ("Orchestration & events", [
            "step-functions", "apache-managed-workflows-for-apache-airflow", "event-bridge",
            "sns", "sqs", "api-gateway", "cloudfront",
        ]),
        ("Inference & deployment", [
            "sagemaker-deploying-for-inference", "sagemaker-inner-details-and-prod-variants",
            "sagemaker-inference-recommender", "inference-pipelines",
            "deployment-mode-decision-guide", "deployment-guardrails-and-shadow-test",
            "endpoint-autoscaling-metrics", "resource-management-and-autoscaling",
            "aws-auto-scaling", "retraining-triggers-and-drift-response",
        ]),
        ("Edge & IoT", ["sagemaker-on-the-edge", "greengrass"]),
        ("Cost, observability & governance", [
            "aws-cost-management-for-ml", "compute-optimizer", "trusted-advisor",
            "devops-guru", "aws-chatbot", "x-ray", "lake-formation",
        ]),
    ],
    "10-security-identity-and-compliance": [
        ("Identity & access", ["IAM", "organizations", "sagemaker-role-manager", "service-catalog"]),
        ("Data protection", [
            "key-management-service", "secrets-manager", "ssm-parameter-store", "macie",
            "data-classification-pii-phi-data-residency",
        ]),
        ("Network isolation", ["vpc", "private-ml-networking", "direct-connect", "shield"]),
        ("Audit & compliance", ["cloudtrail", "cloudwatch", "aws-config"]),
    ],
    "13-bedrock": [
        ("Bedrock core", ["amazon-bedrock", "bedrock-application-patterns", "bedrock-cross-region-inference", "bedrock-flows", "bedrock-prompt-management"]),
        ("Knowledge bases & RAG", [
            "bedrock-knowledge-base", "bedrock-rag-decision-guide", "pre-retrieval-knowledge-base",
            "chunking-strategies", "optimizing-vector-store-and-embeddings", "bedrock-data-automation",
        ]),
        ("Agents & AgentCore", [
            "bedrock-agents", "bedrock-agent-memory", "bedrock-agent-tracing", "bedrock-agentcore",
            "bedrock-agentcore-production-patterns", "bedrock-multi-agent-collaboration",
        ]),
        ("Model customization", ["bedrock-model-customization", "bedrock-custom-model-import"]),
        ("Safety & evaluation", [
            "bedrock-guardrails", "bedrock-automated-reasoning-checks", "bedrock-token-redaction",
            "bedrock-model-evaluations", "bedrock-evaluation-techniques",
        ]),
        ("Cost & performance", ["bedrock-prompt-caching", "bedrock-intelligent-prompt-routing", "bedrock-edge-caching"]),
    ],
    "common": [
        ("Learning fundamentals", ["linear-and-logistic-regression", "ensembling-learning-methods", "boosting", "convolution", "probability-distribution"]),
        ("Fit & generalization", ["bias-and-variance", "preventing-overfitting", "preventing-underfitting", "hyperband"]),
        ("Data characteristics", [
            "sparse-data", "dense-data", "gaussian-like-data", "normalization-standardization",
            "shuffling-data", "sub-sampling", "class-imbalance-and-resampling",
        ]),
        ("Fairness & interpretability", ["bias-metrics-ci-dpl", "conditional-demographic-disparity", "interpretability-techniques", "concept-drift"]),
    ],
}

# Reading order for the folders that render flat.
FLAT_ORDER = {
    "00-exam-guide": [
        "exam-overview", "domain-1-data-preparation", "domain-2-model-development",
        "domain-3-deployment-orchestration", "domain-4-monitoring-security",
        "in-scope-services", "out-of-scope-services", "study-roadmap",
    ],
    "07-generative-ai-model-fundamentals": [
        "common-llm-terms", "transformer-architecture", "self-attention-mechanism",
        "decoder-encoder-models", "generative-pretrained-transformers",
        "application-of-transformers", "foundational-models-in-aws", "imputation-of-data",
        "transformers-sagemaker",
    ],
    "08-building-gen-ai-apps-with-bedrock": [
        "bedrock-overview", "retrieval-augmented-generation", "chunking-strategies",
        "bedrock-agents", "bedrock-guardrails", "fine-tuning-and-continuous-pre-training",
        "multi-llm-routing-strategies", "other-bedrock-features",
    ],
    "11-machine-learning-best-practices": [
        "aws-well-architected-framework-ml-lens", "well-architected-generative-ai-lens",
        "well-architected-tool-generative-ai-lens", "responsible-ai-aws",
        "amazon-augmented-ai", "mechanical-turk",
    ],
    "12-sql": ["sql-fundamentals", "sql-analytics-patterns", "sql-performance-tuning", "sql-on-aws", "sql-quick-reference"],
    "14-agentic-ai": [
        "agentic-ai-current-innovation-map", "agentic-rag-patterns", "model-context-protocol-mcp",
        "claude-agentic-ai-on-aws", "agent-squad", "strands-ai",
    ],
    ".": ["README", "NOTE_TEMPLATE", "PLAN_NOTES_IMPROVEMENT"],
}

# The seven sidebar destinations. `folders` are (folder, tab label) pairs; the
# tab order here is the reading order inside the track. `short` is the label the
# in-viewer switcher uses, where two columns leave no room for the full one.
TRACKS = [
    {
        "id": "exam_guide",
        "short": "Exam Guide",
        "label": "Exam Guide",
        "blurb": "The MLA-C01 exam shape, its four domains, the in-scope service list, and a study roadmap.",
        "accent": "#EC7211",
        "icon": "BadgeCheck",
        "folders": [("00-exam-guide", "MLA-C01"), (".", "About this vault")],
    },
    {
        "id": "exam_ai_services",
        "short": "AI Services",
        "label": "AI Services",
        "blurb": "The managed AWS AI services: language, vision, search, personalization, forecasting, and anomaly detection.",
        "accent": "#E7157B",
        "icon": "Sparkles",
        "folders": [("01-ai-services", "AI services")],
    },
    {
        "id": "exam_data",
        "short": "Data",
        "label": "Data Engineering",
        "blurb": "Ingestion, streaming, storage, databases, transformation, data quality, and the SQL you need on top of them.",
        "accent": "#8C4FFF",
        "icon": "DatabaseZap",
        "folders": [
            ("02-data-ingestion-and-storage", "Ingestion & storage"),
            ("03-data-transformation-integrity-and-feature-engineering", "Transformation & quality"),
            ("12-sql", "SQL"),
        ],
    },
    {
        "id": "exam_modeling",
        "short": "Modeling",
        "label": "Modeling & Algorithms",
        "blurb": "Training, tuning, evaluation, the SageMaker built-in algorithms, and the ML fundamentals underneath them.",
        "accent": "#7AA116",
        "icon": "Sigma",
        "folders": [
            ("04-model-training-tuning-and-evaluation", "Training & evaluation"),
            ("06-sagemaker-built-in-algorithms", "Built-in algorithms"),
            ("common", "ML fundamentals"),
        ],
    },
    {
        "id": "exam_sagemaker",
        "short": "SageMaker",
        "label": "SageMaker AI",
        "blurb": "Amazon SageMaker AI end to end: Studio, features, training, deployment, and model governance.",
        "accent": "#01A88D",
        "icon": "Boxes",
        "folders": [("05-sagemaker-ai", "SageMaker AI")],
    },
    {
        "id": "exam_genai",
        "short": "Gen AI",
        "label": "Generative AI",
        "blurb": "Transformer fundamentals, Amazon Bedrock, knowledge bases, guardrails, agents, and agentic patterns.",
        "accent": "#4D27AA",
        "icon": "Bot",
        "folders": [
            ("07-generative-ai-model-fundamentals", "Model fundamentals"),
            ("08-building-gen-ai-apps-with-bedrock", "Building with Bedrock"),
            ("13-bedrock", "Amazon Bedrock"),
            ("14-agentic-ai", "Agentic AI"),
        ],
    },
    {
        "id": "exam_mlops",
        "short": "MLOps",
        "label": "MLOps & Security",
        "blurb": "Production operations, CI/CD, orchestration, inference infrastructure, cost, security, and responsible AI.",
        "accent": "#DD344C",
        "icon": "ShieldCheck",
        "folders": [
            ("09-machine-learning-operations", "Operations & deployment"),
            ("10-security-identity-and-compliance", "Security & compliance"),
            ("11-machine-learning-best-practices", "Best practices"),
        ],
    },
]

# Four basenames exist in two folders each. The vault's README names 13-bedrock
# as the canonical home for the Bedrock notes, and 03 as the canonical home for
# feature engineering; an unqualified [[wikilink]] resolves to the winner here.
WIKILINK_CANONICAL = {
    "bedrock-agents": "13-bedrock/bedrock-agents",
    "bedrock-guardrails": "13-bedrock/bedrock-guardrails",
    "chunking-strategies": "13-bedrock/chunking-strategies",
    "feature-engineering": "03-data-transformation-integrity-and-feature-engineering/feature-engineering",
}

# Pages whose own folder is not the canonical one still deserve a working link
# to their neighbours, so the disambiguation is applied per source folder first.

STATUS_LABEL = {
    "reviewed": "Reviewed",
    "draft": "Draft",
    "supplemental": "Supplemental",
    "legacy": "Legacy",
    "out-of-scope": "Out of scope",
}


# ── input ─────────────────────────────────────────────────────────────────

def ensure_vault(refresh):
    """Clone the upstream vault on first run; optionally pull on later ones."""
    if not os.path.isdir(os.path.join(VAULT, ".git")):
        if os.path.exists(VAULT):
            sys.exit(f"{VAULT} exists but is not a git clone — remove it and re-run.")
        print(f"cloning {SOURCE_REPO} -> {VAULT}")
        subprocess.run(["git", "clone", "--depth", "1", SOURCE_REPO, VAULT], check=True)
    elif refresh:
        print("pulling latest notes")
        subprocess.run(["git", "-C", VAULT, "pull", "--ff-only"], check=True)

    head = subprocess.run(
        ["git", "-C", VAULT, "rev-parse", "HEAD"],
        check=True, capture_output=True, text=True,
    ).stdout.strip()
    return head


def parse_frontmatter_loosely(block):
    """Scalars and `- item` lists only, for the notes YAML itself rejects.

    At least one note escapes markdown emphasis inside a double-quoted title
    (`"… (RNNs)\\*\\*"`), which is an invalid YAML escape. The frontmatter is
    otherwise a fixed, flat shape, so a line reader recovers it exactly.
    """
    meta = {}
    key = None
    for line in block.split("\n"):
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        item = re.match(r"^\s+-\s+(.*)$", line)
        if item and key:
            meta.setdefault(key, [])
            if isinstance(meta[key], list):
                meta[key].append(item.group(1).strip().strip('"').strip("'"))
            continue
        field = re.match(r"^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$", line)
        if field:
            key = field.group(1)
            value = field.group(2).strip().strip('"').strip("'")
            meta[key] = value if value else []
    return meta


def read_note(path):
    """Split a vault note into (frontmatter dict, body)."""
    text = open(path, encoding="utf-8").read()
    match = re.match(r"^---\n(.*?)\n---\n?", text, re.S)
    if not match:
        return {}, text
    try:
        meta = yaml.safe_load(match.group(1)) or {}
    except yaml.YAMLError:
        meta = parse_frontmatter_loosely(match.group(1))
    return meta, text[match.end():]


def notebook_to_markdown(path):
    """Flatten a .ipynb into prose + fenced code, dropping every output.

    The vault ships one notebook (a 6.5 MB transformers walkthrough whose bulk
    is stored tensor output). Its 1.8 KB of actual source is worth reading, the
    outputs are not.
    """
    notebook = json.load(open(path, encoding="utf-8"))
    language = (
        notebook.get("metadata", {}).get("language_info", {}).get("name")
        or "python"
    )
    parts = []
    for cell in notebook.get("cells", []):
        source = "".join(cell.get("source", [])).strip()
        if not source:
            continue
        if cell.get("cell_type") == "markdown":
            parts.append(source)
        else:
            parts.append(f"```{language}\n{source}\n```")
    return "\n\n".join(parts) + "\n"


# ── markdown normalization ────────────────────────────────────────────────

WIKILINK_RE = re.compile(r"\[\[([^\]|#]+?)(?:#([^\]|]+?))?(?:\|([^\]]+?))?\]\]")

# Fenced blocks and inline spans, so prose rewrites never reach into code.
# The vault has Python that reads exactly like a wikilink — `df[['feature1',
# 'feature2']]`, `"dynamic_feat": [[1.1, 1.2, ...]]` — and rewriting those
# would corrupt the samples.
CODE_RE = re.compile(r"(^```.*?^```|^~~~.*?^~~~|`+[^`\n]*`+)", re.S | re.M)


def apply_outside_code(text, transform):
    """Run `transform` on the prose parts of `text`, leaving code untouched."""
    return "".join(
        part if index % 2 else transform(part)
        for index, part in enumerate(CODE_RE.split(text))
    )


def title_case(basename):
    """Fallback display title for a wikilink whose target has no frontmatter."""
    return basename.replace("-", " ").replace("_", " ").strip().capitalize()


def rewrite_wikilinks(body, folder, by_basename, titles, stats):
    """Turn Obsidian [[links]] into the viewer's own `ex:` cross-references.

    Resolution prefers a note in the linking page's own folder, then the
    canonical folder from WIKILINK_CANONICAL, then the single match. A target
    that is not in the build renders as plain text rather than a dead link.
    """
    def replace(match):
        target, anchor, alias = match.group(1).strip(), match.group(2), match.group(3)
        candidates = by_basename.get(target, [])
        if not candidates:
            stats["unresolved"].append(f"{folder}: {target}")
            return alias or title_case(target)

        slug = None
        if len(candidates) > 1:
            same_folder = [c for c in candidates if c.rsplit("/", 1)[0] == folder]
            if same_folder:
                slug = same_folder[0]
            elif target in WIKILINK_CANONICAL:
                slug = WIKILINK_CANONICAL[target]
        slug = slug or candidates[0]

        label = alias or titles.get(slug) or title_case(target)
        href = f"ex:{slug}"
        if anchor:
            href += "#" + re.sub(r"[^a-z0-9]+", "-", anchor.strip().lower()).strip("-")
        stats["resolved"] += 1
        return f"[{label}]({href})"

    return apply_outside_code(body, lambda prose: WIKILINK_RE.sub(replace, prose))


LINK_ONLY_RE = re.compile(r"^\s*[-*]\s+\[([^\]]+)\]\(([^)]+)\)\s*(?:[—–-]\s*(.*))?$")
BARE_URL_RE = re.compile(r"^\s*[-*]\s+(?:\*\*(.+?)\*\*:?\s*)?<?(https?://\S+?)>?\s*$")


def extract_section(body, heading):
    """Return (start, end, lines) for a level-2 section, or None.

    Fence-aware: a `## ` line inside a code sample is a shell comment, not a
    heading, and must not open or close the section.
    """
    lines = body.split("\n")
    start = None
    fenced = False
    for index, line in enumerate(lines):
        if re.match(r"^\s*(```|~~~)", line):
            fenced = not fenced
            continue
        if fenced:
            continue
        if start is None and re.match(rf"^##\s+{re.escape(heading)}\s*$", line.strip()):
            start = index
        elif start is not None and line.startswith("## "):
            return start, index, lines[start + 1:index]
    if start is not None:
        return start, len(lines), lines[start + 1:]
    return None


def fence_related_notes(body):
    """Render the vault's "Related Notes" list as a card grid.

    Every bullet must already be a plain link (the wikilink pass runs first);
    a section holding anything else is left as prose rather than half-converted.
    """
    section = extract_section(body, "Related Notes")
    if not section:
        return body
    start, end, lines = section

    cards = []
    for line in lines:
        if not line.strip():
            continue
        match = LINK_ONLY_RE.match(line)
        if not match:
            return body
        cards.append({"title": match.group(1), "href": match.group(2), "body": (match.group(3) or "").strip()})
    if not cards:
        return body

    replacement = ["## Related Notes", "", "```ex-cards", json.dumps(cards, ensure_ascii=False), "```", ""]
    all_lines = body.split("\n")
    return "\n".join(all_lines[:start] + replacement + all_lines[end:])


def fence_sources(body):
    """Render the trailing "Sources" list as a compact citation block."""
    section = extract_section(body, "Sources")
    if not section:
        return body, []
    start, end, lines = section

    sources = []
    for line in lines:
        if not line.strip():
            continue
        bare = BARE_URL_RE.match(line)
        linked = LINK_ONLY_RE.match(line)
        if bare:
            sources.append({"title": (bare.group(1) or bare.group(2)).strip(), "href": bare.group(2)})
        elif linked and linked.group(2).startswith("http"):
            sources.append({"title": linked.group(1), "href": linked.group(2)})
        else:
            return body, []
    if not sources:
        return body, []

    replacement = ["## Sources", "", "```ex-sources", json.dumps(sources, ensure_ascii=False), "```", ""]
    all_lines = body.split("\n")
    return "\n".join(all_lines[:start] + replacement + all_lines[end:]), sources


def normalize(body, folder, by_basename, titles, stats):
    """Vault markdown -> the markdown the viewer renders."""
    # The viewer prints its own <h1> from the index, so drop the note's.
    body = re.sub(r"\A\s*#\s+.*?\n", "", body, count=1)
    # A leading rule right under the title is decoration in the vault and an
    # empty box in the viewer.
    body = re.sub(r"\A\s*(---|\*\*\*|___)\s*\n", "", body)
    body = strip_meta_block(body)

    body = rewrite_wikilinks(body, folder, by_basename, titles, stats)
    body = fence_related_notes(body)
    body, sources = fence_sources(body)

    # Collapse the runs of blank lines the section rewrites can leave behind.
    body = re.sub(r"\n{4,}", "\n\n\n", body).strip() + "\n"
    return body, sources


SKIP_BLOCK_RE = re.compile(r"^(#|>|\||```|~~~|<|[-*+]\s|\d+\.\s)")
BOLD_LABEL_RE = re.compile(r"^\*\*[^*\n]{1,60}\*\*:?\s*")


RULE_RE = re.compile(r"^(-{3,}|\*{3,}|_{3,})\s*$")

# A leading block of `Key: value` lines is authoring metadata, not prose — one
# note opens with the author's own `Created:` date and local checkout path. It
# has no place in the reading pane, and picked up as a description it would put
# a stranger's filesystem layout on a card.
META_LINE_RE = re.compile(r"^[A-Z][A-Za-z /]{0,24}:\s*\S")


def strip_meta_block(body):
    blocks = re.split(r"\n\s*\n", body.strip())
    if not blocks:
        return body
    lines = [line for line in blocks[0].split("\n") if line.strip()]
    if len(lines) >= 2 and all(META_LINE_RE.match(line.strip()) for line in lines):
        return "\n\n".join(blocks[1:]).strip() + "\n"
    return body


def clean_prose(block):
    """Markdown block -> one line of plain text."""
    text = BOLD_LABEL_RE.sub("", block.strip())
    text = re.sub(r"`([^`]*)`", r"\1", text)
    text = re.sub(r"\*\*([^*]*)\*\*", r"\1", text)
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
    return " ".join(text.split())


def echoes(desc, text):
    """Is `text` the paragraph `desc` was cut from?"""
    if not desc or not text:
        return False
    head = desc[:-1] if desc.endswith("…") else desc
    return text.startswith(head)


def dedupe_summary(body, desc):
    """Drop the note's own summary once the viewer shows it as the lede.

    Two shapes account for nearly every note: a bare opening paragraph before
    any heading, and a first section (usually "Knowledge Relevance") holding
    that one paragraph and nothing else. Both would otherwise render twice —
    once as the lede under the title, once as the first thing in the body.
    """
    blocks = re.split(r"\n\s*\n", body.strip())
    if not blocks:
        return body

    if not SKIP_BLOCK_RE.match(blocks[0]) and echoes(desc, clean_prose(blocks[0])):
        return rejoin(blocks[1:])

    if (
        len(blocks) > 2
        and re.match(r"^##\s+\S", blocks[0])
        and not SKIP_BLOCK_RE.match(blocks[1])
        and echoes(desc, clean_prose(blocks[1]))
        and (blocks[2].startswith("#") or re.match(r"^(---|\*\*\*|___)\s*$", blocks[2]))
    ):
        rest = blocks[3:] if RULE_RE.match(blocks[2]) else blocks[2:]
        return rejoin(rest)

    return body


def rejoin(blocks):
    """Re-emit blocks, dropping any rule the removal left stranded on top."""
    while blocks and RULE_RE.match(blocks[0].strip()):
        blocks = blocks[1:]
    return "\n\n".join(blocks).strip() + "\n"


def first_paragraph(body):
    """A one-line description for the index, taken from the note's own prose.

    Many notes open with a `**Definition and Purpose:**` label above the first
    sentence, so the label is stripped rather than the block skipped — matching
    on a bare `*` would throw away 47 of the 299 descriptions.
    """
    # Some notes put the first bullet directly under the heading with no blank
    # line, which would otherwise glue the two into one skipped block.
    body = re.sub(r"^(#{1,6} .*)\n(?=\S)", r"\1\n\n", body, flags=re.M)

    for block in re.split(r"\n\s*\n", body):
        block = block.strip()
        if not block or SKIP_BLOCK_RE.match(block):
            continue
        block = BOLD_LABEL_RE.sub("", block).strip()
        if not block:
            continue
        text = re.sub(r"`([^`]*)`", r"\1", block)
        text = re.sub(r"\*\*([^*]*)\*\*", r"\1", text)
        text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
        text = " ".join(text.split())
        if len(text) < 25:
            continue
        return trim(text)

    # 41 notes open straight into a bulleted "Why it matters" list with no prose
    # paragraph at all. The first bullet summarizes those fairly.
    for block in re.split(r"\n\s*\n", body):
        block = block.strip()
        if not re.match(r"^[-*+]\s", block):
            continue
        text = re.sub(r"^[-*+]\s+", "", re.split(r"\n[-*+]\s", block)[0])
        text = re.sub(r"`([^`]*)`", r"\1", text)
        text = re.sub(r"\*\*([^*]*)\*\*", r"\1", text)
        text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
        text = " ".join(text.split())
        if len(text) >= 25:
            return trim(text)
    return ""


def trim(text, limit=190):
    """Clip a description at a word boundary."""
    if len(text) <= limit:
        return text
    return text[:limit].rsplit(" ", 1)[0] + "…"


def as_list(value):
    if value is None:
        return []
    if isinstance(value, list):
        return [str(v).strip() for v in value if str(v).strip()]
    return [str(value).strip()] if str(value).strip() else []


# ── build ─────────────────────────────────────────────────────────────────

def collect(folder):
    """Every note basename in a vault folder, sorted."""
    path = VAULT if folder == "." else os.path.join(VAULT, folder)
    if not os.path.isdir(path):
        sys.exit(f"missing folder in the vault: {folder}")
    names = []
    for entry in sorted(os.listdir(path)):
        stem, ext = os.path.splitext(entry)
        if ext in (".md", ".ipynb") and os.path.isfile(os.path.join(path, entry)):
            names.append(stem)
    return names


def plan_folder(folder):
    """Ordered [(group or None, basename)] for one folder, validated."""
    present = collect(folder)
    known = set(present)
    planned = []
    seen = set()

    if folder in GROUPS:
        for group, names in GROUPS[folder]:
            for name in names:
                if name not in known:
                    sys.exit(f"{folder}: group '{group}' lists '{name}', which is not in the vault")
                if name in seen:
                    sys.exit(f"{folder}: '{name}' appears in more than one group")
                seen.add(name)
                planned.append((group, name))
    else:
        for name in FLAT_ORDER.get(folder, present):
            if name not in known:
                sys.exit(f"{folder}: FLAT_ORDER lists '{name}', which is not in the vault")
            seen.add(name)
            planned.append((None, name))

    missing = [name for name in present if name not in seen]
    if missing:
        sys.exit(f"{folder}: {len(missing)} note(s) not claimed by any group: {', '.join(missing)}")
    return planned


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--refresh", action="store_true", help="git pull the vault before building")
    args = parser.parse_args()

    head = ensure_vault(args.refresh)

    # Pass 1 — plan the tree and read every note's frontmatter, so that the
    # wikilink pass can resolve targets to real titles.
    plan = []  # (track, tab, group, folder, basename, slug, source path)
    for track in TRACKS:
        for folder, tab in track["folders"]:
            for group, basename in plan_folder(folder):
                slug = basename if folder == "." else f"{folder}/{basename}"
                base = VAULT if folder == "." else os.path.join(VAULT, folder)
                path = os.path.join(base, basename + ".md")
                if not os.path.exists(path):
                    path = os.path.join(base, basename + ".ipynb")
                plan.append((track, tab, group, folder, basename, slug, path))

    meta_by_slug = {}
    titles = {}
    by_basename = {}
    for _, _, _, _, basename, slug, path in plan:
        meta = read_note(path)[0] if path.endswith(".md") else {}
        meta_by_slug[slug] = meta
        titles[slug] = str(meta.get("title") or title_case(basename))
        by_basename.setdefault(basename, []).append(slug)

    # The notebook has no frontmatter of its own.
    titles.setdefault("07-generative-ai-model-fundamentals/transformers-sagemaker", "Transformers on SageMaker (notebook)")

    # Pass 2 — normalize bodies and emit the index.
    # Written in place, with stale files swept afterwards, rather than deleting
    # the tree first: a running dev server caches its public/ directory listing
    # and serves the SPA fallback for everything under a directory that vanished
    # mid-session.
    os.makedirs(OUT_MD, exist_ok=True)
    written = set()

    stats = {"resolved": 0, "unresolved": []}
    pages = []
    tree = {track["id"]: {} for track in TRACKS}
    tab_order = {track["id"]: [] for track in TRACKS}

    for track, tab, group, folder, basename, slug, path in plan:
        if path.endswith(".ipynb"):
            raw = notebook_to_markdown(path)
            meta = {
                "title": titles[slug],
                "status": "supplemental",
                "domain": ["2.1"],
                "tags": ["aws", "transformers", "sagemaker", "notebook"],
                "last_verified": "",
                "source_type": "repo-notebook",
            }
            desc = "A runnable transformers walkthrough: tokenizers, attention, embeddings, and fine-tuning on SageMaker."
        else:
            meta, raw = read_note(path)
            desc = ""

        body, sources = normalize(raw, folder, by_basename, titles, stats)
        title = titles[slug]
        desc = desc or str(meta.get("description") or "") or first_paragraph(body)
        body = dedupe_summary(body, desc)

        out_path = os.path.join(OUT_MD, slug + ".md")
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as handle:
            handle.write(body)
        written.add(os.path.abspath(out_path))

        raw_domains = as_list(meta.get("domain"))
        domains = [d for d in raw_domains if re.fullmatch(r"\d\.\d", d)]
        # "all" / "supplemental" / "unmapped" are the vault's way of saying a
        # note maps to no single task statement. Kept so the viewer can label
        # them instead of showing a page with no domain at all.
        scope = "" if domains else (raw_domains[0] if raw_domains else "")
        services = [s for s in as_list(meta.get("service")) if s.lower() != "none"]

        pages.append({
            "slug": slug,
            "title": title,
            "desc": desc,
            "file": f"/exams/md/{slug}.md",
            "track": track["id"],
            "tab": tab,
            "group": group or "",
            "status": str(meta.get("status") or "draft"),
            "domains": domains,
            "domainScope": scope,
            "services": services,
            "tags": as_list(meta.get("tags")),
            "aliases": as_list(meta.get("aliases")),
            "certifications": as_list(meta.get("certifications")),
            "lastVerified": str(meta.get("last_verified") or ""),
            "sourceType": str(meta.get("source_type") or ""),
            "sourceCount": len(sources),
            "words": len(body.split()),
        })

        if tab not in tree[track["id"]]:
            tree[track["id"]][tab] = []
            tab_order[track["id"]].append(tab)
        tree[track["id"]][tab].append((group, slug, title))

    # Sweep pages the vault no longer has, and any directory they emptied.
    for dirpath, _, names in os.walk(OUT_MD, topdown=False):
        for name in names:
            path = os.path.abspath(os.path.join(dirpath, name))
            if path not in written:
                os.remove(path)
        if dirpath != OUT_MD and not os.listdir(dirpath):
            os.rmdir(dirpath)

    # Fold the flat (group, slug) stream into the viewer's nav shape.
    tracks_out = []
    for track in TRACKS:
        tabs = []
        for tab in tab_order[track["id"]]:
            items = []
            current_group = None
            for group, slug, title in tree[track["id"]][tab]:
                entry = {"slug": slug, "title": title}
                if not group:
                    items.append(entry)
                    current_group = None
                    continue
                if current_group is None or current_group["group"] != group:
                    current_group = {"group": group, "expanded": False, "items": []}
                    items.append(current_group)
                current_group["items"].append(entry)
            tabs.append({"section": "", "tab": tab, "items": items})
        tracks_out.append({
            "id": track["id"],
            "label": track["label"],
            "short": track["short"],
            "blurb": track["blurb"],
            "accent": track["accent"],
            "icon": track["icon"],
            "tabs": tabs,
        })

    banner = (
        "// Auto-generated index of the AWS Machine Learning & AI certification notes.\n"
        "//\n"
        f"// Source: {SOURCE_REPO} @ {head[:12]}\n"
        f"// {len(pages)} pages. Bodies live under public/exams/md/ and are fetched on\n"
        "// demand by ExamsDocs; the corpus is small enough (~2 MB) to ship from public/\n"
        "// rather than the docs CDN the LangChain and Strands archives use.\n"
        "//\n"
        "// Regenerate with `npm run build:exams` rather than hand-editing.\n\n"
    )

    with open(OUT_DATA, "w", encoding="utf-8") as handle:
        handle.write(banner)
        handle.write(f"export const EXAMS_TOTAL_PAGES = {len(pages)};\n\n")
        handle.write("export const EXAMS_CERTIFICATION = ")
        handle.write(json.dumps({
            "code": "MLA-C01",
            "name": "AWS Certified Machine Learning Engineer – Associate",
            "url": "https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/",
            "guide": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01.html",
        }, indent=1, ensure_ascii=False))
        handle.write(";\n\n")
        handle.write("export const EXAMS_DOMAINS = ")
        handle.write(json.dumps(DOMAINS, indent=1, ensure_ascii=False))
        handle.write(";\n\n")
        handle.write("export const EXAMS_STATUS_LABELS = ")
        handle.write(json.dumps(STATUS_LABEL, indent=1, ensure_ascii=False))
        handle.write(";\n\n")
        handle.write("export const EXAMS_TRACKS = ")
        handle.write(json.dumps(tracks_out, indent=1, ensure_ascii=False))
        handle.write(";\n\n")
        handle.write("export const EXAMS_ALL_PAGES = ")
        handle.write(json.dumps(pages, indent=1, ensure_ascii=False))
        handle.write(";\n")

    report = {
        # No source URL: build-report.json is deployed under public/, and the
        # viewer deliberately carries no pointer back to the upstream repo.
        "commit": head,
        "pages": len(pages),
        "tracks": {track["id"]: sum(1 for p in pages if p["track"] == track["id"]) for track in TRACKS},
        "domains": {
            task["id"]: sum(1 for p in pages if task["id"] in p["domains"])
            for domain in DOMAINS for task in domain["tasks"]
        },
        "statuses": {
            status: sum(1 for p in pages if p["status"] == status)
            for status in sorted({p["status"] for p in pages})
        },
        "wikilinks": {"resolved": stats["resolved"], "unresolved": sorted(set(stats["unresolved"]))},
        "bytes": sum(os.path.getsize(os.path.join(dirpath, name))
                     for dirpath, _, names in os.walk(OUT_MD) for name in names),
    }
    with open(OUT_REPORT, "w", encoding="utf-8") as handle:
        json.dump(report, handle, indent=2)

    print(f"{len(pages)} pages across {len(TRACKS)} tracks -> {os.path.relpath(OUT_DATA, ROOT)}")
    print(f"{stats['resolved']} wikilinks resolved, {len(set(stats['unresolved']))} unresolved")
    print(f"{report['bytes'] / 1_048_576:.1f} MB of markdown -> {os.path.relpath(OUT_MD, ROOT)}")


if __name__ == "__main__":
    main()
