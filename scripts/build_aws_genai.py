#!/usr/bin/env python3
"""Build the AWS Certified Generative AI Developer – Professional (AIP-C01)
study guide and practice exams the app reads.

Reads the vendored source tree (gitignored, like the other upstream inputs):

  AWS Genai/AIP-C01-Study-Guide/
      <NN-module>/<NN-topic>.md   64 lessons on one 15-section template
                                  (00-meta/topic-template.md): §1 simple
                                  explanation … §7 checkpoints, §7b practice
                                  questions, §8 hands-on lab, §11 exam notes,
                                  §12 summary + cards, §14 answers
      00-meta/*.md                exam guide map, glossary, service scope …
      labs-code/**                lab files some lessons link to
      11-exam-prep/practice_exam_<n>.json + images/
                                  the five 75-question practice papers
  scripts/data/aws_genai_skills/<NN-module>.md
                                  one hand-written AI skill per lesson — the
                                  artifact each lesson ships, like the skills
                                  AI from Scratch lessons ship
  scripts/data/aip_c01_question_domains.json
                                  the exam domain of every practice question
                                  (the papers carry no domain of their own)

and emits:

  src/data/awsGenAiData.js                    tracks, modules, lesson index
  public/aws-genai/md/<slug>.md               lesson bodies, fetched on demand
  public/aws-genai/bundle/<slug>.json         code + quiz + artifacts, lazy too
  public/aws-genai/build-report.json
  src/data/aipPracticeExams.js                practice-exam manifest
  public/exams/practice/aip-c01-practice-<n>.json
  public/exams/aip-c01/img/<file>.webp        explanation diagrams, resized

Every lesson also gets animated figures: ```figure fences naming a widget in
src/components/awsGenai/figures/ are injected at fixed anchors (FIGURES
below). Relative links are rewritten to the `aip:` (lesson) and `aip-code:`
(lab file) protocols the viewer resolves in-app, so nothing relative
survives. The build fails if a figure names a widget or flow that does not
exist, or a flow step walks an edge between nodes it never declared.

Run:  python3 scripts/build_aws_genai.py     (or `npm run build:aws-genai`)
      python3 scripts/build_aws_genai.py --only guide|exams
"""
import io
import json
import os
import random
import re
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "AWS Genai", "AIP-C01-Study-Guide")
META_DIR = os.path.join(SRC, "00-meta")
EXAM_DIR = os.path.join(SRC, "11-exam-prep")
SKILLS_DIR = os.path.join(ROOT, "scripts", "data", "aws_genai_skills")
QUESTION_DOMAINS = os.path.join(ROOT, "scripts", "data", "aip_c01_question_domains.json")

FIGURE_DIR = os.path.join(ROOT, "src", "components", "awsGenai", "figures")
FLOWS_JSON = os.path.join(FIGURE_DIR, "flows.json")
REGISTRY_JS = os.path.join(FIGURE_DIR, "registry.js")

OUT_DATA = os.path.join(ROOT, "src", "data", "awsGenAiData.js")
OUT_PUB = os.path.join(ROOT, "public", "aws-genai")
PUBLIC_PREFIX = "/aws-genai"

OUT_EXAM_MANIFEST = os.path.join(ROOT, "src", "data", "aipPracticeExams.js")
OUT_EXAM_DIR = os.path.join(ROOT, "public", "exams", "practice")
OUT_EXAM_IMG = os.path.join(ROOT, "public", "exams", "aip-c01", "img")
EXAM_IMG_PREFIX = "/exams/aip-c01/img"

MAX_CODE_BYTES = 200_000

# ── exam facts (00-meta/exam-guide-map.md, verified against the official
#    guide) ──────────────────────────────────────────────────────────────────

DOMAINS = [
    {"n": 1, "name": "Foundation Model Integration, Data Management, and Compliance", "short": "FM integration & data", "weight": 31},
    {"n": 2, "name": "Implementation and Integration", "short": "Implementation & integration", "weight": 26},
    {"n": 3, "name": "AI Safety, Security, and Governance", "short": "Safety, security & governance", "weight": 20},
    {"n": 4, "name": "Operational Efficiency and Optimization for GenAI Applications", "short": "Efficiency & optimization", "weight": 12},
    {"n": 5, "name": "Testing, Validation, and Troubleshooting", "short": "Testing & troubleshooting", "weight": 11},
]

# The real exam: 65 scored + 10 unscored questions, scaled 100–1000, 750 to
# pass. The practice papers are 75 questions on a 180-minute clock.
EXAM_MINUTES = 180
SCALE_MIN, SCALE_MAX, SCALE_PASS = 100, 1000, 750

# ── modules ────────────────────────────────────────────────────────────────

MODULES = {
    "00-foundations": (
        "Foundations",
        "A safe AWS account, how LLMs turn tokens into answers, and the embeddings behind semantic search.",
    ),
    "01-bedrock-genai-fundamentals": (
        "Bedrock & GenAI Fundamentals",
        "Converse, customization, RAG and Knowledge Bases, chunking and reranking, multimodal, Guardrails and prompts.",
    ),
    "02-data-management": (
        "Data Management",
        "Data quality and preparation, Transcribe and Comprehend, and every vector store: OpenSearch, S3 Vectors, pgvector.",
    ),
    "03-agentic-ai": (
        "Agentic AI",
        "Agents Classic, multi-agent memory, Strands and Agent Squad, AgentCore, MCP and humans in the loop.",
    ),
    "04-operational-efficiency": (
        "Operational Efficiency",
        "Token budgets, cost-aware model choice, throughput, four layers of caching, latency, backoff and cross-Region inference.",
    ),
    "05-sagemaker": (
        "SageMaker AI",
        "Endpoints and deployment guardrails, FM optimization, Model Monitor and Clarify, Registry, lineage and Pipelines.",
    ),
    "06-app-building-tools": (
        "App-Building Tools",
        "Lambda, API Gateway, AppConfig, Step Functions, CI/CD, AppSync and Amplify, the edge, and event-driven messaging.",
    ),
    "07-governance-qa": (
        "Governance & QA",
        "Agent tracing, evaluation jobs and metrics, responsible AI, CloudWatch observability, CloudTrail, X-Ray and Lake Formation.",
    ),
    "08-security": (
        "Security",
        "Least privilege and Identity Center, organization guardrails, KMS and Secrets Manager, Cognito, WAF and PrivateLink.",
    ),
    "09-other-services": (
        "Other In-Scope Services",
        "Analytics, containers, databases, developer tools, ML services, cost and scaling, transfer, networking and storage.",
    ),
}

# Reference track, in reading order. resume-here.md and topic-template.md are
# the author's working notes, not material for a learner, so they stay out.
META_DOCS = [
    ("how-to-use", "How to Use This Guide", "The study loop, the suggested path and cost safety before any lab."),
    ("exam-guide-map", "Exam Guide Map", "Exam facts, the five domains and their weights, and where every task is taught."),
    ("service-scope", "Service Scope", "Which AWS services are in scope for AIP-C01, and which are not."),
    ("glossary", "Glossary", "Plain-English definitions for the vocabulary the lessons use."),
    ("verification-log", "Verification Log", "Course claims checked against official AWS pages, and what changed."),
    ("syllabus-coverage-map", "Syllabus Coverage Map", "Every lesson of the source syllabus and the file that teaches it."),
]

# ── animated figures ──────────────────────────────────────────────────────
#
# slug -> [(anchor, spec)]. An anchor is a section number plus where in it:
# "1$" is the end of §1 (just before §2), "5^" the start of §5 (just after its
# heading). Specs are what the ```figure fence carries: a widget name from
# figures/registry.js, or `flow <id>` for an animated architecture diagram
# defined in figures/flows.json, optionally followed by a JSON config.

FIGURES = {
    "00-foundations/01-aws-account-iam-and-cli-setup": [("1$", "flow cli-auth"), ("5^", "iam-eval")],
    "00-foundations/02-llm-and-genai-basics": [("1$", "flow llm-generation"), ("5^", "token-sampler"), ("6^", "context-budget")],
    "00-foundations/03-embeddings-vectors-semantic-search": [("1$", "flow semantic-search"), ("5^", "vector-space")],
    "01-bedrock-genai-fundamentals/01-bedrock-overview-and-converse-api": [("1$", "flow converse-request"), ("5^", "latency-stream")],
    "01-bedrock-genai-fundamentals/02-model-customization-finetuning-and-lora": [("1$", "flow customization-job"), ("5^", "lora-rank")],
    "01-bedrock-genai-fundamentals/03-retrieval-augmented-generation-rag": [("1$", "flow rag-pipeline"), ("5^", "rerank-fusion")],
    "01-bedrock-genai-fundamentals/04-bedrock-knowledge-bases": [("1$", "flow kb-retrieve-generate"), ("5^", 'vector-space {"filter": true}')],
    "01-bedrock-genai-fundamentals/05-chunking-embeddings-reranking-and-rag-evaluation": [("1$", "flow rerank-pipeline"), ("5^", "chunker")],
    "01-bedrock-genai-fundamentals/06-multimodal-models-and-pipelines": [("1$", "flow multimodal-pipeline")],
    "01-bedrock-genai-fundamentals/07-bedrock-guardrails": [("1$", "flow guardrail-sequence"), ("5^", "guardrail-lab")],
    "01-bedrock-genai-fundamentals/08-prompt-management-flows-and-structured-output": [("1$", "flow prompt-flow")],
    "01-bedrock-genai-fundamentals/09-prompt-engineering-misuse-and-bias": [("1$", "flow defense-in-depth"), ("5^", "token-sampler")],
    "01-bedrock-genai-fundamentals/10-enterprise-integration-and-generative-ai-lens": [("1$", "flow genai-gateway")],
    "02-data-management/01-structured-data-and-bedrock-data-automation": [("1$", "flow text-to-sql")],
    "02-data-management/02-sagemaker-data-wrangler-and-data-preparation": [("1$", "flow data-wrangler")],
    "02-data-management/03-aws-glue-data-quality-and-cloudwatch-metrics": [("1$", "flow glue-dq-gate"), ("5^", "data-quality")],
    "02-data-management/04-transcribe-comprehend-and-comprehend-medical": [("1$", "flow audio-insights"), ("5^", "pii-redact")],
    "02-data-management/05-amazon-opensearch-for-genai": [("1$", "flow opensearch-knn"), ("5^", "shard-sizing"), ("6^", "rerank-fusion")],
    "02-data-management/06-s3-vectors-and-keeping-vector-stores-current": [("1$", "flow s3-vectors"), ("5^", 'vector-space {"filter": true}')],
    "02-data-management/07-rds-aurora-and-pgvector": [("1$", "flow pgvector-rag"), ("5^", "ann-index")],
    "02-data-management/08-amazon-dynamodb-for-genai": [("1$", "flow dynamodb-chat-state"), ("5^", "dynamo-partitions")],
    "02-data-management/09-amazon-s3-storage-lifecycle-replication-and-security": [("1$", "flow s3-data-protection"), ("5^", "s3-lifecycle")],
    "03-agentic-ai/01-llm-agents-and-bedrock-agents-classic": [("1$", "flow agent-classic-loop"), ("5^", "react-loop")],
    "03-agentic-ai/02-multi-agent-workflows-and-agent-memory": [("1$", "flow supervisor-agents"), ("5^", "memory-window")],
    "03-agentic-ai/03-strands-agents-and-agent-squad": [("1$", "flow agent-squad-routing")],
    "03-agentic-ai/04-agentcore-runtime-memory-gateway-identity-policy-evaluations": [("1$", "flow agentcore-gateway")],
    "03-agentic-ai/05-labs-strands-agentcore-agent-squad-and-harness": [("1$", "flow code-vs-config")],
    "03-agentic-ai/06-mcp-openapi-tools-and-human-in-the-loop": [("1$", "flow tool-use-loop"), ("5^", "flow mcp-transport")],
    "03-agentic-ai/07-amazon-q-apps-and-amazon-quick": [("1$", "flow quick-landscape")],
    "04-operational-efficiency/01-token-efficiency-and-cost-effective-model-selection": [("1$", "flow token-anatomy"), ("5^", "context-budget"), ("6^", "model-cascade")],
    "04-operational-efficiency/02-throughput-utilization-and-intelligent-caching": [("1$", "flow cache-layers"), ("5^", "prompt-cache"), ("6^", "throughput-capacity"), ("9^", "semantic-cache")],
    "04-operational-efficiency/03-responsive-systems-retrieval-and-fm-performance": [("1$", "flow latency-pipeline"), ("5^", "latency-stream"), ("6^", "token-sampler")],
    "04-operational-efficiency/04-backoff-connection-pooling-and-cross-region-inference": [("1$", "flow cris-routing"), ("5^", "backoff-jitter")],
    "05-sagemaker/01-sagemaker-ai-deployment-guardrails-and-fm-optimization": [("1$", "flow endpoint-picker"), ("5^", "traffic-shift")],
    "05-sagemaker/02-ground-truth-model-monitor-and-clarify": [("1$", "flow model-monitor"), ("5^", "drift-monitor")],
    "05-sagemaker/03-model-registry-and-lineage-tracking": [("1$", "flow registry-approval"), ("5^", "flow lineage")],
    "05-sagemaker/04-neo-unified-studio-pipelines-and-jumpstart": [("1$", "flow sm-pipeline")],
    "06-app-building-tools/01-lambda-integration-patterns-and-lambda-with-bedrock": [("1$", "flow lambda-invocation-modes")],
    "06-app-building-tools/02-api-gateway-and-genai-applications": [("1$", "flow apigw-front-door"), ("5^", "latency-stream")],
    "06-app-building-tools/03-appconfig-and-dynamic-foundation-model-selection": [("1$", "flow appconfig-rollout"), ("5^", 'traffic-shift {"preset": "appconfig"}')],
    "06-app-building-tools/04-step-functions-states-circuit-breaker-and-prompt-chaining": [("1$", "flow prompt-chain"), ("5^", "circuit-breaker")],
    "06-app-building-tools/05-codepipeline-codebuild-and-codedeploy": [("1$", "flow cicd-pipeline"), ("5^", 'traffic-shift {"preset": "codedeploy"}')],
    "06-app-building-tools/06-mlflow-appsync-and-amplify": [("1$", "flow appsync-subscription"), ("5^", "trace-waterfall")],
    "06-app-building-tools/07-outposts-and-wavelength-for-genai": [("1$", "flow edge-placement")],
    "06-app-building-tools/08-sqs-eventbridge-sns-and-appflow": [("1$", "flow sns-fanout"), ("5^", "queue-buffer")],
    "07-governance-qa/01-agent-tracing-evaluation-metrics-and-bedrock-model-evaluations": [("1$", "flow eval-job"), ("5^", "eval-scorer")],
    "07-governance-qa/02-principles-of-responsible-ai-and-fairness-evaluation": [("1$", "flow rai-lifecycle"), ("5^", "fairness-slices")],
    "07-governance-qa/03-cloudwatch-logs-alarms-rum-and-genai-observability": [("1$", "flow cw-observability"), ("5^", "alarm-eval")],
    "07-governance-qa/04-cloudtrail-and-x-ray-for-genai": [("1$", "flow cloudtrail-pipeline"), ("5^", "trace-waterfall")],
    "07-governance-qa/05-lake-formation-and-mixed-review-for-quiz-7": [("1$", "flow lake-formation-vending"), ("5^", "lf-filter")],
    "08-security/01-least-privilege-iam-identity-center-and-data-masking": [("1$", "flow identity-center"), ("5^", "iam-eval")],
    "08-security/02-control-tower-organizations-and-governance-guardrails": [("1$", "flow org-governance"), ("5^", 'iam-eval {"preset": "scp"}')],
    "08-security/03-kms-secrets-manager-macie-and-bedrock-data-protection": [("1$", "flow envelope-encryption"), ("5^", "pii-redact")],
    "08-security/04-cognito-and-aws-waf": [("1$", "flow cognito-waf"), ("5^", "waf-rate")],
    "08-security/05-vpc-privatelink-and-network-security": [("1$", "flow private-bedrock")],
    "09-other-services/01-analytics-athena-emr-quick-sight-kinesis-and-msk": [("1$", "flow kinesis-kb-fresh"), ("5^", "kinesis-shards")],
    "09-other-services/02-compute-containers-ec2-ecs-eks-lex-and-connect": [("1$", "flow contact-center")],
    "09-other-services/03-databases-documentdb-elasticache-memorydb-and-neptune": [("1$", "flow semantic-cache-graphrag"), ("5^", "semantic-cache"), ("6^", "ann-index")],
    "09-other-services/04-developer-tools-cdk-cli-sdk-cloudformation-and-codeartifact": [("1$", "flow cdk-deploy")],
    "09-other-services/05-ml-services-augmented-ai-kendra-lex-rekognition-and-textract": [("1$", "flow doc-human-review"), ("5^", "confidence-gate")],
    "09-other-services/06-management-and-governance-auto-scaling-cost-tools-grafana-and-systems-manager": [("1$", "flow autoscaling-loop"), ("5^", "autoscale-target")],
    "09-other-services/07-migration-and-transfer-datasync-and-transfer-family": [("1$", "flow ingest-to-kb")],
    "09-other-services/08-networking-and-delivery-cloudfront-elb-global-accelerator-and-route-53": [("1$", "flow global-delivery"), ("5^", "route53-routing")],
    "09-other-services/09-storage-ebs-efs-and-choosing-between-them": [("1$", "flow ebs-efs")],
    # Reference docs have no numbered sections; "top" puts the figure first.
    "meta/exam-guide-map": [("top", "domain-weights")],
}


# ── io ─────────────────────────────────────────────────────────────────────

def read(path):
    with open(path, "r", encoding="utf-8", errors="replace") as handle:
        return handle.read()


def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as handle:
        handle.write(text)


def write_json(path, value, pretty=False):
    write(path, json.dumps(value, ensure_ascii=False, indent=1 if pretty else None,
                           separators=None if pretty else (",", ":")))


# ── markdown helpers ──────────────────────────────────────────────────────

FENCE = re.compile(r"^\s*(```|~~~)")


def strip_inline(text):
    """Markdown inline syntax off, for chips, blurbs and slugs."""
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"`([^`]*)`", r"\1", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"(?<![\w*])\*([^*\n]+)\*(?![\w*])", r"\1", text)
    text = re.sub(r"(?<![\w])_([^_\n]+)_(?![\w])", r"\1", text)
    return re.sub(r"\s+", " ", text).strip()


def heading_id(text):
    """The id the viewer gives a rendered heading (slugifyHeading on its text)."""
    return re.sub(r"[^a-z0-9]+", "-", strip_inline(text).lower()).strip("-")


def github_anchor(text):
    """The anchor GitHub generates for a heading, which is what the source links use."""
    plain = strip_inline(text).lower()
    plain = re.sub(r"[^\w\- ]", "", plain)
    return plain.replace(" ", "-")


def headings(markdown):
    """(level, text, line_index) for every ATX heading outside code fences."""
    out, fenced = [], False
    for index, line in enumerate(markdown.split("\n")):
        if FENCE.match(line):
            fenced = not fenced
            continue
        if fenced:
            continue
        match = re.match(r"^(#{1,6})\s+(.*?)\s*#*\s*$", line)
        if match:
            out.append((len(match.group(1)), match.group(2), index))
    return out


def split_sections(markdown):
    """{key: text} for every level-2 section, keyed by its number ("7b", "14")."""
    lines = markdown.split("\n")
    marks = [(text, index) for level, text, index in headings(markdown) if level == 2]
    sections = {}
    for position, (text, start) in enumerate(marks):
        end = marks[position + 1][1] if position + 1 < len(marks) else len(lines)
        match = re.match(r"^(\d+[a-z]?)\.", text)
        if match:
            sections[match.group(1)] = "\n".join(lines[start + 1:end]).strip("\n")
    return sections


def code_blocks(markdown):
    """Fenced blocks as dicts: lang, meta, source, heading (nearest h3/h4)."""
    out, lines = [], markdown.split("\n")
    heading, index = "", 0
    while index < len(lines):
        line = lines[index]
        open_match = re.match(r"^(\s*)(```|~~~)\s*([^\s`]*)\s*(.*)$", line)
        if open_match:
            fence = open_match.group(2)
            lang = open_match.group(3).lower()
            meta = open_match.group(4).strip()
            body, index = [], index + 1
            while index < len(lines) and not lines[index].strip().startswith(fence):
                body.append(lines[index])
                index += 1
            out.append({"lang": lang, "meta": meta, "source": "\n".join(body), "heading": heading})
        else:
            match = re.match(r"^#{3,4}\s+(.*)$", line)
            if match:
                heading = strip_inline(match.group(1))
        index += 1
    return out


# ── header (title + metadata table) ───────────────────────────────────────

def parse_header(markdown):
    """Title, the first metadata table as {field: raw value}, and the body after it."""
    lines = markdown.split("\n")
    index = 0
    while index < len(lines) and not lines[index].startswith("# "):
        index += 1
    title = lines[index][2:].strip() if index < len(lines) else ""
    index += 1
    while index < len(lines) and not lines[index].strip():
        index += 1
    meta = {}
    if index < len(lines) and lines[index].lstrip().startswith("|"):
        while index < len(lines) and lines[index].lstrip().startswith("|"):
            cells = [cell.strip() for cell in lines[index].strip().strip("|").split("|")]
            if len(cells) >= 2 and not re.match(r"^:?-{2,}", cells[0]) and cells[0] != "Field":
                meta[strip_inline(cells[0])] = "|".join(cells[1:]).strip()
            index += 1
    return title, meta, "\n".join(lines[index:]).strip("\n")


def first_sentences(text, limit=240):
    plain = strip_inline(text)
    sentences = re.split(r"(?<=[.!?])\s+", plain)
    out = ""
    for sentence in sentences:
        if out and len(out) + len(sentence) > limit:
            break
        out = (out + " " + sentence).strip()
    return out


def parse_domains(text):
    return sorted({int(n) for n in re.findall(r"Domain\s*([1-5])", text or "")})


def short_relevance(text):
    plain = strip_inline(text or "")
    return re.split(r"\s*[(;]", plain)[0].strip(" .") or plain


def reading_minutes(markdown):
    prose = re.sub(r"```.*?```", " ", markdown, flags=re.S)
    words = len(re.findall(r"\w+", prose))
    return max(1, round(words / 220))


# ── link rewriting ────────────────────────────────────────────────────────

LINK = re.compile(r"(!?)\[([^\]\n]*)\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)")


class Resolver:
    """Maps a relative link in one source file onto the app's in-app protocols."""

    def __init__(self, slug_by_path, module_first, anchors_by_slug):
        self.slug_by_path = slug_by_path          # "01-…/02-….md" -> slug
        self.module_first = module_first          # "07-governance-qa" -> first lesson slug
        self.anchors = anchors_by_slug            # slug -> {github anchor: heading id}
        self.lab_links = {}                       # source slug -> [labs-code paths]
        self.unresolved = set()

    def anchor(self, slug, raw):
        if not raw:
            return ""
        known = self.anchors.get(slug, {})
        return "#" + known.get(raw, re.sub(r"[^a-z0-9]+", "-", raw.lower()).strip("-"))

    def rewrite(self, markdown, source_path, slug):
        source_dir = os.path.dirname(source_path)

        def replace(match):
            bang, text, href = match.group(1), match.group(2), match.group(3).strip()
            if re.match(r"^(?:https?:|mailto:|aip:|aip-code:)", href):
                return match.group(0)
            if href.startswith("#"):
                return "[%s](%s)" % (text, self.anchor(slug, href[1:]))
            target, _, fragment = href.partition("#")
            full = os.path.normpath(os.path.join(source_dir, target))
            rel = os.path.relpath(full, SRC).replace(os.sep, "/")
            if rel.startswith("labs-code/") and os.path.isfile(full):
                self.lab_links.setdefault(slug, [])
                if rel not in self.lab_links[slug]:
                    self.lab_links[slug].append(rel)
                return "[%s](aip-code:%s)" % (text, rel)
            if rel in self.slug_by_path:
                linked = self.slug_by_path[rel]
                return "[%s](aip:%s%s)" % (text, linked, self.anchor(linked, fragment))
            module = rel.rstrip("/").split("/")[0]
            if rel.rstrip("/") == module and module in self.module_first:
                return "[%s](aip:%s)" % (text, self.module_first[module])
            # README, the exam-prep folder, the empty capstone folder: there is
            # no in-app page for them, so the link text stays and the link goes.
            if not rel.endswith("README.md"):
                self.unresolved.add("%s -> %s" % (slug, href))
            return text if not bang else ""

        return LINK.sub(replace, markdown)


# ── figures ───────────────────────────────────────────────────────────────

def load_figure_catalog():
    """Widget names from registry.js and the flow definitions from flows.json."""
    widgets = set()
    if os.path.exists(REGISTRY_JS):
        block = read(REGISTRY_JS)
        widgets = set(re.findall(r'^\s*"([a-z0-9-]+)"\s*:', block, re.M))
    flows = json.loads(read(FLOWS_JSON)) if os.path.exists(FLOWS_JSON) else {}
    return widgets, flows


FLOW_KINDS = {
    "client", "compute", "ai", "storage", "db", "integration", "security",
    "network", "monitor", "analytics", "human", "devtools", "external",
}


def check_flow(flow_id, flow):
    """A flow's steps must only walk nodes it declares."""
    problems = []
    ids = {node["id"] for node in flow.get("nodes", [])}
    for group in flow.get("groups", []):
        for member in group.get("nodes", []):
            if member not in ids:
                problems.append("flow %s: group member %r is not a node" % (flow_id, member))
    for edge in flow.get("edges", []):
        for end in edge[:2]:
            if end not in ids:
                problems.append("flow %s: edge end %r is not a node" % (flow_id, end))
    for number, step in enumerate(flow.get("steps", []), start=1):
        paths = step.get("paths") or [step.get("path", [])]
        for path in paths:
            if len(path) < 2:
                problems.append("flow %s step %d: path needs two nodes" % (flow_id, number))
            for node in path:
                if node not in ids:
                    problems.append("flow %s step %d: %r is not a node" % (flow_id, number, node))
        if not step.get("label"):
            problems.append("flow %s step %d has no label" % (flow_id, number))
    for node in flow.get("nodes", []):
        if node.get("kind") not in FLOW_KINDS:
            problems.append("flow %s: node %r has unknown kind %r" % (flow_id, node.get("id"), node.get("kind")))
    if not flow.get("steps"):
        problems.append("flow %s has no steps" % flow_id)
    return problems


def validate_figures(widgets, flows):
    problems = []
    for flow_id, flow in flows.items():
        problems.extend(check_flow(flow_id, flow))
    for slug, specs in FIGURES.items():
        for _, spec in specs:
            name, _, rest = spec.partition(" ")
            if name == "flow":
                flow_id = rest.split(" ")[0]
                if flow_id not in flows:
                    problems.append("%s: unknown flow %r" % (slug, flow_id))
            elif name not in widgets:
                problems.append("%s: unknown widget %r" % (slug, name))
            config = rest[len(rest.split(" ")[0]):].strip() if name == "flow" else rest.strip()
            if config:
                try:
                    json.loads(config)
                except ValueError:
                    problems.append("%s: figure config is not JSON: %s" % (slug, config))
    return problems


def inject_figures(body, slug):
    specs = FIGURES.get(slug)
    if not specs:
        return body, 0
    lines = body.split("\n")
    marks = {}
    for level, text, index in headings(body):
        if level != 2:
            continue
        match = re.match(r"^(\d+[a-z]?)\.", text)
        if match:
            marks[match.group(1)] = index
    order = sorted(marks.values())
    inserts = []  # (line index to insert before, spec)
    for anchor, spec in specs:
        if anchor == "top":
            inserts.append((0, spec))
            continue
        key, where = anchor[:-1], anchor[-1]
        if key not in marks:
            raise SystemExit("%s: no section %s for a figure" % (slug, key))
        start = marks[key]
        if where == "^":
            inserts.append((start + 1, spec))
        else:
            later = [index for index in order if index > start]
            inserts.append((later[0] if later else len(lines), spec))
    for at, spec in sorted(inserts, key=lambda item: -item[0]):
        lines[at:at] = ["", "```figure", spec, "```", ""]
    return "\n".join(lines), len(specs)


# ── code tab ──────────────────────────────────────────────────────────────

EXT = {
    "python": "py", "py": "py", "powershell": "ps1", "ps1": "ps1", "bash": "sh",
    "sh": "sh", "shell": "sh", "json": "json", "yaml": "yaml", "yml": "yaml",
    "sql": "sql", "typescript": "ts", "javascript": "js", "markdown": "md",
}
LANG_OF_EXT = {
    ".py": "python", ".json": "json", ".jsonl": "json", ".md": "markdown",
    ".sh": "bash", ".yaml": "yaml", ".yml": "yaml", ".txt": "text",
}


def slug_words(text, limit=30):
    """A short file stem from a lab heading: "Part A: chunk size (paste…)" -> "part-a-chunk-size"."""
    text = re.sub(r"\(.*?\)|\[.*?\]", " ", text).split(":", 1)[-1] if re.match(
        r"^\s*(?:lab\s*)?[\d.–-]+\s*:", text, re.I) else re.sub(r"\(.*?\)|\[.*?\]", " ", text)
    words = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    words = re.sub(r"^(?:\d+-)+", "", words)          # "8-8-code" -> "code"
    out = ""
    for word in words.split("-"):
        if out and len(out) + 1 + len(word) > limit:
            break
        out = "%s-%s" % (out, word) if out else word
    return out or "snippet"


IMPORT_LINE = re.compile(r"^\s*(?:from\s+([\w.]+)\s+import|import\s+([\w., ]+))", re.M)
STDLIB = set(getattr(sys, "stdlib_module_names", ()))


def runs_alone(source):
    """Can this file run by itself in the in-app sandbox (one file, no AWS)?

    Only when every import is standard library: boto3, botocore, numpy and the
    labs' own helper modules are not there, so a Run button would only fail.
    The same goes for code that reads files or command-line arguments.
    """
    if re.search(r"\bargparse\b|\bsys\.argv\b|\binput\(|\bopen\(", source):
        return False
    if not STDLIB:
        return "boto3" not in source
    names = set()
    for found in IMPORT_LINE.findall(source):
        for name in (found[0] or found[1]).split(","):
            names.add(name.strip().split(" ")[0].split(".")[0])
    return all(name in STDLIB for name in names if name and name != "__future__")


def collect_code(lab_section, lab_links):
    """The lesson's §8 code, file by file, plus every labs-code file it links."""
    files, names = [], set()

    def unique(name):
        stem, dot, ext = name.rpartition(".")
        candidate, counter = name, 2
        while candidate in names:
            candidate = "%s-%d.%s" % (stem, counter, ext)
            counter += 1
        names.add(candidate)
        return candidate

    for rel in lab_links:
        full = os.path.join(SRC, rel)
        if os.path.getsize(full) > MAX_CODE_BYTES:
            continue
        source = read(full)
        ext = os.path.splitext(rel)[1].lower()
        files.append({
            "path": unique(rel),
            "lang": LANG_OF_EXT.get(ext, "text"),
            "source": source,
            "kind": "file",
            "runnable": ext == ".py" and runs_alone(source),
        })

    previous = None
    for block in code_blocks(lab_section or ""):
        lang, meta = block["lang"], block["meta"]
        if lang == "text" and meta == "lab-out":
            if previous is not None and previous.get("runnable"):
                previous["expected"] = block["source"]
            continue
        if lang in ("", "text", "mermaid", "figure") or lang not in EXT:
            continue
        if lang in ("python", "py") and meta == "lab-run":
            name, kind, runnable = "lab.py", "lab", runs_alone(block["source"])
        elif lang in ("python", "py") and meta == "snippet":
            name, kind, runnable = "snippet.py", "snippet", False
        else:
            name = "%s.%s" % (slug_words(block["heading"]), EXT[lang])
            # Early lessons predate the lab-run convention; their plain Python
            # blocks run offline just the same when they need nothing but stdlib.
            kind = "step"
            runnable = lang in ("python", "py") and runs_alone(block["source"])
        # "Optional AWS lab" sections are shown, not run: their blocks build on
        # an AWS client created in an earlier block.
        if re.search(r"optional aws lab", block["heading"] or "", re.I):
            runnable = False
        entry = {
            "path": unique(name),
            "lang": "python" if lang == "py" else lang,
            "source": block["source"].rstrip(),
            "kind": kind,
            "runnable": runnable,
            "section": block["heading"],
        }
        files.append(entry)
        previous = entry
    return files


# ── quiz tab ──────────────────────────────────────────────────────────────

ANSWER_MARK = re.compile(r"(?:\*\*)?\b([QR])(\d+)\s*→\s*([A-F](?:\s*(?:,|and|&)\s*[A-F])*)")
SELECT_N = re.compile(r"\(Select\s+(TWO|THREE|FOUR|2|3|4)\)", re.I)
NUMBERS = {"two": 2, "three": 3, "four": 4}


def parse_answers(text):
    """{("Q", 3): (["A", "C"], explanation)} from §14 and inline answer blocks."""
    out = {}
    marks = list(ANSWER_MARK.finditer(text or ""))
    for position, match in enumerate(marks):
        end = marks[position + 1].start() if position + 1 < len(marks) else len(text)
        tail = text[match.end():end]
        tail = tail.split("\n\n")[0]
        tail = re.sub(r"^[\s.*]+", "", tail)
        tail = re.sub(r"\s*\n\s*-\s*\*?\*?\s*$", "", tail)
        tail = re.sub(r"[\s\-*]+$", "", tail).strip()
        tail = re.sub(r"^\((.*)\)\.?$", r"\1", tail).strip()
        letters = re.findall(r"[A-F]", match.group(3))
        out[(match.group(1), int(match.group(2)))] = (letters, re.sub(r"\s+", " ", tail))
    return out


def split_inline_options(text):
    """"Which fix? A. Larger B. Prune C. …" -> ("Which fix?", ["Larger", "Prune", …])."""
    positions, cursor = [], 0
    for letter in "ABCDEF":
        found = re.search(r"(?:^|\s)%s\.\s" % letter, text[cursor:])
        if not found:
            break
        positions.append(cursor + found.start())
        cursor += found.end()
    if len(positions) < 2:
        return text.strip(), []
    stem = text[:positions[0]].strip()
    options = []
    for index, start in enumerate(positions):
        end = positions[index + 1] if index + 1 < len(positions) else len(text)
        options.append(re.sub(r"^\s*[A-F]\.\s*", "", text[start:end]).strip())
    return stem, options


def parse_mcq(section, prefix, answers, source):
    """`**Q1.** stem` + `A. …` option lines (or inline options) -> quiz items."""
    items = []
    blocks = re.split(r"(?m)^\*\*%s(\d+)\.\*\*\s*" % prefix, section or "")
    for index in range(1, len(blocks), 2):
        number = int(blocks[index])
        chunk = blocks[index + 1].strip()
        chunk = re.split(r"\n\s*\*\*Answers", chunk)[0].strip()
        lines = chunk.split("\n")
        stem_lines, options = [], []
        for line in lines:
            option = re.match(r"^\s*([A-F])\.\s+(.*)$", line)
            if option:
                options.append(option.group(2).strip())
            elif options and line.strip():
                options[-1] += " " + line.strip()
            elif not options:
                stem_lines.append(line.strip())
        stem = " ".join(part for part in stem_lines if part)
        if not options:
            stem, options = split_inline_options(stem)
        letters, explanation = answers.get((prefix, number), ([], ""))
        correct = ["ABCDEF".index(letter) for letter in letters if "ABCDEF".index(letter) < len(options)]
        if not options or not correct:
            continue
        select = SELECT_N.search(stem)
        wanted = (NUMBERS.get(select.group(1).lower()) or int(select.group(1))) if select else len(correct)
        items.append({
            "id": "%s%d" % (prefix.lower(), number),
            "question": stem,
            "options": options,
            "correct": correct,
            "multi": len(correct) > 1 or wanted > 1,
            "select": wanted,
            "explanation": explanation,
            "source": source,
        })
    return items


# The source puts the right answer at A or B on almost every question (at A
# on nearly all of modules 06–09), which turns an interactive quiz into a
# pattern-matching game. Options are therefore shuffled, deterministically per
# question so the order is stable between builds, and the option letters the
# explanation cites are relabelled to match. A standalone capital A–F in an
# explanation is an option reference except "A <word>" where <word> is not
# commentary on an option ("A reranker reorders…" is an article) — in this
# corpus that rule is exact. Questions whose stem names things with letters
# ("Model A", "Bucket C") keep their order, since their letters are not
# option references.
OPTION_VERBS = {
    "is", "are", "was", "and", "or", "adds", "can't", "cannot", "changes", "confounds",
    "costs", "describes", "does", "doesn't", "do", "don't", "fails", "false", "true",
    "generates", "loses", "makes", "may", "merges", "misses", "needs", "overloads",
    "removes", "repeats", "requires", "skips", "still", "worsens", "would", "will",
    "only", "alone", "wrong", "lacks", "uses", "leaves", "breaks", "has", "isn't",
}
LETTER_REF = re.compile(r"(?<![A-Za-z0-9\-.`§/])([A-F](?:\s*/\s*[A-F])*)(?![A-Za-z0-9`])")
# B–F are never English words; "A" names a thing only right after a word
# ("Model A"), never at the start of a sentence ("A company…").
STEM_ENTITY = re.compile(r"(?<![A-Za-z0-9\-.`(])[B-F](?![A-Za-z0-9`])|(?<=[A-Za-z] )A(?![A-Za-z0-9`])")


def relabel(text, mapping):
    def replace(match):
        token = match.group(1)
        if token == "A":
            following = re.match(r"\s+([a-z][\w'’-]*)", text[match.end():])
            if following and following.group(1) not in OPTION_VERBS:
                return token
        return re.sub(r"[A-F]", lambda letter: mapping.get(letter.group(0), letter.group(0)), token)
    return LETTER_REF.sub(replace, text)


def shuffle_options(item, seed):
    if STEM_ENTITY.search(SELECT_N.sub("", item["question"])):
        return item
    order = list(range(len(item["options"])))
    random.Random(seed).shuffle(order)
    mapping = {"ABCDEF"[old]: "ABCDEF"[new] for new, old in enumerate(order)}
    return dict(
        item,
        options=[item["options"][old] for old in order],
        correct=sorted(order.index(old) for old in item["correct"]),
        explanation=relabel(item["explanation"], mapping),
    )


def numbered_items(text):
    """"1. a … 2. b" — as list lines or run together on one line."""
    items = {}
    lines = [line for line in (text or "").split("\n")]
    listed = [re.match(r"^\s*(\d+)\.\s+(.*)$", line) for line in lines]
    if sum(1 for match in listed if match) >= 2:
        current = None
        for line, match in zip(lines, listed):
            if match:
                current = int(match.group(1))
                items[current] = match.group(2).strip()
            elif current is not None and line.strip() and not line.startswith("#"):
                items[current] += " " + line.strip()
        return items
    for match in re.finditer(r"(?:^|\s)(\d+)\.\s+(.+?)(?=\s\d+\.\s+[A-Z`*\"']|$)", text or "", re.S):
        items[int(match.group(1))] = re.sub(r"\s+", " ", match.group(2)).strip()
    return items


def paren_items(text):
    """"1) a. 2) b." -> {1: "a.", 2: "b."}"""
    items = {}
    for match in re.finditer(r"(?:^|\s)(\d+)\)\s+(.+?)(?=\s\d+\)\s|$)", text or "", re.S):
        items[int(match.group(1))] = re.sub(r"\s+", " ", match.group(2)).strip()
    return items


def checkpoint_answers(answers_section):
    """§14 opens with the checkpoint answers, as a list or as `1) … 2) …`."""
    head = re.split(r"\*\*Practice|\n\s*-\s*\*\*Q\d", answers_section or "")[0]
    head = re.sub(r"^\s*\*\*Checkpoints?[.:]?\*\*\s*", "", head.strip())
    listed = numbered_items(head)
    return listed if len(listed) >= 2 else paren_items(head)


def parse_recall(sections):
    items = []
    questions = numbered_items(sections.get("7", ""))
    answers = checkpoint_answers(sections.get("14", ""))
    for number in sorted(questions):
        if number in answers:
            items.append({"question": questions[number], "answer": answers[number], "source": "7"})
    # The module-closing mixed reviews in 09 are open questions on one line.
    review = sections.get("7c", "")
    if review and not re.search(r"(?m)^\*\*R\d+\.\*\*", review):
        review_q = numbered_items(review)
        block = re.search(r"\*\*Mixed review[^*]*\*\*(.*?)(?:\n\n|$)", sections.get("14", ""), re.S)
        review_a = paren_items(block.group(1)) if block else {}
        for number in sorted(review_q):
            if number in review_a:
                items.append({"question": review_q[number], "answer": review_a[number], "source": "7c"})
    return items


CARDS = re.compile(r"\*\*Cards[.:]\*\*(.*?)(?:\n\n|$)", re.S)


def parse_cards(summary):
    match = CARDS.search(summary or "")
    if not match:
        return []
    out = []
    for card in re.finditer(r"Q:\s*(.+?)\s*A:\s*(.+?)(?=\s*·\s*Q:|\s*$)", match.group(1), re.S):
        out.append({"front": re.sub(r"\s+", " ", card.group(1)).strip(), "back": re.sub(r"\s+", " ", card.group(2)).strip()})
    return out


# ── artifacts ─────────────────────────────────────────────────────────────

def load_skills():
    """`<!-- skill: <slug> -->` blocks from the hand-written skills files."""
    if not os.path.isdir(SKILLS_DIR):
        return {}
    skills = {}
    for name in sorted(os.listdir(SKILLS_DIR)):
        if not name.endswith(".md"):
            continue
        parts = re.split(r"(?m)^<!--\s*skill:\s*(\S+)\s*-->\s*$", read(os.path.join(SKILLS_DIR, name)))
        for index in range(1, len(parts), 2):
            if parts[index] in skills:
                sys.exit("Skill written twice: %s" % parts[index])
            skills[parts[index]] = parts[index + 1].strip() + "\n"
    return skills


def skill_name(markdown, fallback):
    match = re.search(r"(?m)^name:\s*(\S+)", markdown)
    return "skill-" + (match.group(1) if match else fallback)


def cheatsheet(title, slug, domains, sections, cards):
    """One page to revise from: exam patterns, key facts, traps and the cards."""
    parts = [
        "---",
        "name: aip-c01-cheatsheet-%s" % slug.split("/")[-1][3:],
        'description: One-page AIP-C01 revision sheet for "%s".' % title.replace('"', "'"),
        "exam: AIP-C01",
        "domains: [%s]" % ", ".join("D%d" % n for n in domains),
        "---",
        "",
        "# %s — exam cheat sheet" % title,
        "",
    ]
    notes = sections.get("11", "").strip()
    if notes:
        parts += ["## How the exam asks about it", "", notes, ""]
    summary = re.sub(r"\*\*Cards[.:]\*\*.*", "", sections.get("12", ""), flags=re.S).strip()
    if summary:
        parts += ["## Key facts", "", summary, ""]
    traps = sections.get("10", "").strip()
    if traps:
        parts += ["## Misconceptions to unlearn", "", traps, ""]
    if cards:
        parts += ["## Flashcards", ""] + ["- **Q:** %s  \n  **A:** %s" % (card["front"], card["back"]) for card in cards] + [""]
    return "\n".join(parts).strip() + "\n"


# ── study guide ───────────────────────────────────────────────────────────

def scan_lessons():
    modules = []
    for name in sorted(os.listdir(SRC)):
        if name not in MODULES:
            continue
        folder = os.path.join(SRC, name)
        lessons = []
        for file in sorted(os.listdir(folder)):
            if not file.endswith(".md") or not re.match(r"^\d+", file):
                continue
            lessons.append({"slug": "%s/%s" % (name, file[:-3]), "path": os.path.join(folder, file),
                            "n": int(re.match(r"^(\d+)", file).group(1))})
        if lessons:
            title, blurb = MODULES[name]
            modules.append({"id": name, "n": int(name[:2]), "track": "guide", "title": title,
                            "blurb": blurb, "lessons": lessons})
    meta_lessons = []
    for number, (stem, title, blurb) in enumerate(META_DOCS, start=1):
        path = os.path.join(META_DIR, stem + ".md")
        if os.path.exists(path):
            meta_lessons.append({"slug": "meta/" + stem, "path": path, "n": number,
                                 "title": title, "blurb": blurb})
    if meta_lessons:
        modules.append({"id": "meta", "n": 0, "track": "reference", "title": "Exam Reference",
                        "blurb": "The exam guide map, service scope, glossary and verification log.",
                        "lessons": meta_lessons})
    return modules


def build_guide():
    if not os.path.isdir(SRC):
        sys.exit("Source tree not found: %s" % SRC)

    widgets, flows = load_figure_catalog()
    problems = validate_figures(widgets, flows)
    if problems:
        sys.exit("Figure check failed:\n  " + "\n  ".join(problems[:30]))

    for sub in ("md", "bundle"):
        shutil.rmtree(os.path.join(OUT_PUB, sub), ignore_errors=True)

    modules = scan_lessons()
    skills = load_skills()
    stray = sorted(set(skills) - {lesson["slug"] for module in modules for lesson in module["lessons"]})
    if stray:
        sys.exit("Skills written for lessons that do not exist: %s" % ", ".join(stray))

    slug_by_path, module_first, anchors = {}, {}, {}
    for module in modules:
        for lesson in module["lessons"]:
            rel = os.path.relpath(lesson["path"], SRC).replace(os.sep, "/")
            slug_by_path[rel] = lesson["slug"]
            module_first.setdefault(module["id"], lesson["slug"])
            anchors[lesson["slug"]] = {
                github_anchor(text): heading_id(text) for _, text, _ in headings(read(lesson["path"]))
            }
    resolver = Resolver(slug_by_path, module_first, anchors)

    index, report = [], {"lessons": 0, "figures": 0, "practice": 0, "recall": 0, "cards": 0,
                         "codeFiles": 0, "runnableLabs": 0, "artifacts": 0, "skillsMissing": []}
    for module in modules:
        entries = []
        for lesson in module["lessons"]:
            slug, raw = lesson["slug"], read(lesson["path"])
            title, meta, body = parse_header(raw)
            if module["track"] == "reference":
                title = lesson["title"]
                body = re.sub(r"^#\s+.*\n+", "", raw, count=1)
            sections = split_sections(body)

            body = resolver.rewrite(body, lesson["path"], slug)
            body, figure_count = inject_figures(body, slug)
            write(os.path.join(OUT_PUB, "md", slug + ".md"), body.strip() + "\n")

            # Rewritten copies, so links inside quiz text and artifacts resolve too.
            sections = {key: resolver.rewrite(text, lesson["path"], slug) for key, text in sections.items()}

            entry = {"slug": slug, "n": lesson["n"], "title": title}
            if module["track"] == "guide":
                answers = parse_answers(sections.get("14", "") + "\n\n" + sections.get("7c", ""))
                practice = parse_mcq(sections.get("7b", ""), "Q", answers, "7b")
                practice += parse_mcq(sections.get("7c", ""), "R", answers, "7c")
                practice = [shuffle_options(item, "%s:%s" % (slug, item["id"])) for item in practice]
                recall = parse_recall(sections)
                cards = parse_cards(sections.get("12", ""))
                code = collect_code(sections.get("8", ""), resolver.lab_links.get(slug, []))
                domains = parse_domains(meta.get("Exam domain / task", ""))

                artifacts = []
                if slug in skills:
                    artifacts.append({"name": skill_name(skills[slug], slug.split("/")[-1]),
                                      "kind": "skill", "markdown": skills[slug]})
                else:
                    report["skillsMissing"].append(slug)
                artifacts.append({"name": "exam-cheatsheet", "kind": "cheatsheet",
                                  "markdown": cheatsheet(title, slug, domains, sections, cards)})

                write_json(os.path.join(OUT_PUB, "bundle", slug + ".json"), {
                    "code": code,
                    "artifacts": artifacts,
                    # `quiz` keeps the shape the AI tutor already reads.
                    "quiz": practice,
                    "recall": recall,
                    "cards": cards,
                })

                prereqs = []
                for label, href in re.findall(r"\[([^\]]*)\]\((aip:[^)#]+)", resolver.rewrite(
                        meta.get("Prerequisites", ""), lesson["path"], slug)):
                    prereqs.append({"label": strip_inline(label), "slug": href[4:]})
                entry.update({
                    "blurb": first_sentences(sections.get("1", "")),
                    "domains": domains,
                    "blueprint": strip_inline(meta.get("Exam domain / task", "")),
                    "relevance": short_relevance(meta.get("Exam relevance", "")),
                    "level": strip_inline(meta.get("Level", "")),
                    "syllabus": re.sub(r"\s+([,+])", r"\1", strip_inline(
                        re.sub(r"\(.*?\)", "", meta.get("Syllabus lessons", "")))).strip(" ,"),
                    "prereqs": prereqs,
                    "verified": (re.match(r"\d{4}-\d{2}-\d{2}", meta.get("Verified on", "")) or [""])[0],
                    "minutes": reading_minutes(body),
                    "figures": figure_count,
                    "code": len(code),
                    "labs": sum(1 for item in code if item["runnable"]),
                    "artifacts": len(artifacts),
                    "quiz": len(practice),
                    "recall": len(recall),
                    "cards": len(cards),
                })
                report["practice"] += len(practice)
                report["recall"] += len(recall)
                report["cards"] += len(cards)
                report["codeFiles"] += len(code)
                report["runnableLabs"] += entry["labs"]
                report["artifacts"] += len(artifacts)
            else:
                entry.update({"blurb": lesson["blurb"], "type": "Reference",
                              "minutes": reading_minutes(body), "figures": figure_count})
            report["lessons"] += 1
            report["figures"] += figure_count
            entries.append(entry)

        index.append({
            "id": module["id"], "n": module["n"], "track": module["track"], "title": module["title"],
            "blurb": module["blurb"],
            "domains": sorted({d for entry in entries for d in entry.get("domains", [])}),
            "lessons": entries,
        })

    if resolver.unresolved:
        print("note: %d links had no in-app target and were de-linked, e.g. %s"
              % (len(resolver.unresolved), "; ".join(sorted(resolver.unresolved)[:4])))

    guide_lessons = sum(len(m["lessons"]) for m in index if m["track"] == "guide")
    tracks = [
        {"id": "guide", "label": "Study Guide",
         "blurb": "Ten modules mapped to the five exam domains. Every lesson ships an animated "
                  "figure, lab code, an AI skill, a cheat sheet and exam-style questions."},
        {"id": "reference", "label": "Exam Reference",
         "blurb": "The verified exam guide map, in-scope services, the glossary and the log of "
                  "where the course and today's AWS disagree."},
    ]
    exam = {
        "code": "AIP-C01",
        "name": "AWS Certified Generative AI Developer – Professional",
        "scored": 65, "unscored": 10, "scaleMin": SCALE_MIN, "scaleMax": SCALE_MAX,
        "passing": SCALE_PASS, "domains": DOMAINS,
    }
    header = (
        "// Auto-generated index of the AWS Certified Generative AI Developer –\n"
        "// Professional (AIP-C01) study guide.\n"
        "//\n"
        "// %d lessons in %d modules plus the exam reference. Bodies live under\n"
        "// public%s/md/ and are fetched on demand by AwsGenAi; code, artifacts and\n"
        "// quizzes live under public%s/bundle/ and load when a reader opens a tab.\n"
        "//\n"
        "// Regenerate with `npm run build:aws-genai` rather than hand-editing.\n\n"
        % (guide_lessons, sum(1 for m in index if m["track"] == "guide"), PUBLIC_PREFIX, PUBLIC_PREFIX)
    )
    write(OUT_DATA, header
          + "export const AIP_CONTENT_BASE = %s;\n\n" % json.dumps(PUBLIC_PREFIX)
          + "export const AIP_TOTAL_LESSONS = %d;\n\n" % guide_lessons
          + "export const AIP_EXAM = %s;\n\n" % json.dumps(exam, indent=1, ensure_ascii=False)
          + "export const AIP_TRACKS = %s;\n\n" % json.dumps(tracks, indent=1, ensure_ascii=False)
          + "export const AIP_MODULES = %s;\n" % json.dumps(index, indent=1, ensure_ascii=False))

    report["skillsMissing"] = len(report["skillsMissing"])
    write_json(os.path.join(OUT_PUB, "build-report.json"), report, pretty=True)
    print("AWS GenAI guide: %(lessons)d pages, %(figures)d figures, %(practice)d practice + "
          "%(recall)d recall questions, %(cards)d cards, %(codeFiles)d code files "
          "(%(runnableLabs)d runnable), %(artifacts)d artifacts" % report)
    if report["skillsMissing"]:
        print("note: %d lessons have no hand-written skill yet" % report["skillsMissing"])
    print("index -> %s" % os.path.relpath(OUT_DATA, ROOT))


# ── practice exams ────────────────────────────────────────────────────────
#
# Slugs are permanent: a saved attempt in mla_exam_attempts refers to its paper
# by slug, so renumbering one orphans that learner's progress.

EXAM_PREFIX = "aip-c01-practice"
EXAM_MAX_WIDTH = 1600
EXAM_WEBP_QUALITY = 80

ALLOWED_TAGS = {
    "p", "br", "strong", "b", "em", "i", "u", "code", "pre",
    "ul", "ol", "li", "blockquote", "a", "img", "span",
    "table", "thead", "tbody", "tr", "th", "td", "h4", "h5",
}
ALLOWED_ATTRS = {"a": {"href", "title"}, "img": {"src", "alt"}}
VOID_TAGS = {"br", "img"}

from html.parser import HTMLParser  # noqa: E402  (kept beside the code that uses it)


class SafeHtml(HTMLParser):
    """The same whitelist build_mla_practice_exams.py applies, plus local images.

    Unknown tags are unwrapped so no prose is lost; only http(s) URLs and this
    build's own image paths survive on href/src, which rules out javascript:
    and data: payloads.
    """

    def __init__(self, images):
        super().__init__(convert_charrefs=True)
        self.out, self.skip_depth, self.images = [], 0, images

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):
            self.skip_depth += 1
            return
        if self.skip_depth or tag not in ALLOWED_TAGS:
            return
        kept = []
        for name, value in attrs:
            if name not in ALLOWED_ATTRS.get(tag, set()) or not value:
                continue
            value = value.strip()
            if name == "src":
                value = self.images.get(value, value)
                if not (value.startswith(EXAM_IMG_PREFIX + "/") or re.match(r"^https?://", value, re.I)):
                    continue
            elif name == "href" and not re.match(r"^https?://", value, re.I):
                continue
            kept.append(' %s="%s"' % (name, escape_attr(value)))
        if tag == "a":
            kept.append(' target="_blank" rel="noopener noreferrer"')
        self.out.append("<%s%s%s>" % (tag, "".join(kept), "/" if tag in VOID_TAGS else ""))

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.skip_depth = max(0, self.skip_depth - 1)
            return
        if self.skip_depth or tag not in ALLOWED_TAGS or tag in VOID_TAGS:
            return
        self.out.append("</%s>" % tag)

    def handle_data(self, data):
        if not self.skip_depth:
            self.out.append(data.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))

    def value(self):
        return re.sub(r"\n{3,}", "\n\n", "".join(self.out)).strip()


def escape_attr(value):
    return value.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;")


def clean_html(raw, fallback="", images=None):
    if not raw:
        paragraphs = [p.strip() for p in (fallback or "").split("\n\n") if p.strip()]
        return "".join("<p>%s</p>" % p.replace("&", "&amp;").replace("<", "&lt;")
                       .replace(">", "&gt;").replace("\n", "<br/>") for p in paragraphs)
    parser = SafeHtml(images or {})
    parser.feed(raw)
    parser.close()
    # Every upstream explanation repeats this hint; the links here already
    # open in a new tab, so it only adds noise.
    return re.sub(r"<p>\s*Tip: use Ctrl\+click[^<]*</p>", "", parser.value())


def export_image(source, name):
    """Resize to EXAM_MAX_WIDTH and re-encode as WebP; skip when already current."""
    target = os.path.join(OUT_EXAM_IMG, os.path.splitext(name)[0] + ".webp")
    if os.path.exists(target) and os.path.getmtime(target) >= os.path.getmtime(source):
        return os.path.basename(target)
    os.makedirs(OUT_EXAM_IMG, exist_ok=True)
    try:
        from PIL import Image
    except ImportError:
        # No Pillow: ship the original rather than a broken reference.
        shutil.copy2(source, os.path.join(OUT_EXAM_IMG, name))
        return name
    image = Image.open(source)
    if image.mode not in ("RGB", "RGBA"):
        image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
    if image.width > EXAM_MAX_WIDTH:
        height = max(1, round(image.height * EXAM_MAX_WIDTH / image.width))
        image = image.resize((EXAM_MAX_WIDTH, height), Image.LANCZOS)
    buffer = io.BytesIO()
    image.save(buffer, "WEBP", quality=EXAM_WEBP_QUALITY, method=4)
    with open(target, "wb") as handle:
        handle.write(buffer.getvalue())
    return os.path.basename(target)


def build_exams():
    papers = sorted(
        (name for name in os.listdir(EXAM_DIR) if re.match(r"^practice_exam_\d+\.json$", name)),
        key=lambda name: int(re.search(r"\d+", name).group(0)),
    )
    if not papers:
        sys.exit("No practice papers in %s" % EXAM_DIR)
    labels = json.loads(read(QUESTION_DOMAINS)) if os.path.exists(QUESTION_DOMAINS) else {}
    domain_name = {d["n"]: d["name"] for d in DOMAINS}
    blueprint_order = {d["name"]: index for index, d in enumerate(DOMAINS)}

    os.makedirs(OUT_EXAM_DIR, exist_ok=True)
    manifest, unlabeled, images_written = [], [], 0
    for file in papers:
        paper = json.loads(read(os.path.join(EXAM_DIR, file)))
        number = paper.get("exam_number") or int(re.search(r"\d+", file).group(0))
        slug = "%s-%d" % (EXAM_PREFIX, number)
        questions = []
        for raw in paper["questions"]:
            images = {}
            for image in raw.get("images", []):
                local = os.path.join(EXAM_DIR, image["local_path"])
                if os.path.exists(local):
                    images[image["url"]] = "%s/%s" % (EXAM_IMG_PREFIX, export_image(local, image["filename"]))
                    images_written += 1
            options = [{"key": option["label"], "text": option["text"].strip()} for option in raw["options"]]
            correct = sorted(option["label"] for option in raw["options"] if option.get("is_correct"))
            if not correct:
                correct = sorted(key.upper() for key in raw.get("correct_response", []))
            label = labels.get(str(raw["id"]))
            if label is None:
                unlabeled.append(raw["id"])
            questions.append({
                "id": raw["id"],
                "number": raw["question_number"],
                "domain": domain_name.get(label, "General"),
                "multi": len(correct) > 1 or raw.get("assessment_type") == "multi-select",
                "promptHtml": clean_html(raw.get("question_html"), raw.get("question"), images),
                "promptText": (raw.get("question") or "").strip(),
                "options": options,
                "correct": correct,
                "explanationHtml": clean_html(raw.get("explanation_html"), raw.get("explanation"), images),
            })
        title = "Practice Exam %d" % number
        write_json(os.path.join(OUT_EXAM_DIR, slug + ".json"),
                   {"slug": slug, "title": title, "questions": questions})
        domains = {}
        for question in questions:
            domains[question["domain"]] = domains.get(question["domain"], 0) + 1
        manifest.append({
            "slug": slug,
            "setId": "aip-c01",
            "setLabel": "AIP-C01",
            "title": title,
            "label": title,
            "fullTitle": re.sub(r"^\[Unofficial\]\s*", "", paper.get("title", title)),
            "questionCount": len(questions),
            "multiSelectCount": sum(1 for q in questions if q["multi"]),
            # Blueprint order (D1…D5, unlabeled last), so every card lists them alike.
            "domains": [{"name": name, "count": count} for name, count in sorted(
                domains.items(), key=lambda kv: blueprint_order.get(kv[0], len(DOMAINS)))],
        })

    sets = [{
        "id": "aip-c01",
        "label": "Full-length papers",
        "blurb": "Five 75-question papers written against the AIP-C01 blueprint, each with "
                 "a full explanation and architecture diagrams.",
        "examSlugs": [entry["slug"] for entry in manifest],
    }]
    write(OUT_EXAM_MANIFEST,
          "// Generated by scripts/build_aws_genai.py — do not edit by hand.\n"
          "//\n"
          "// The landing screen needs titles, counts and domain splits before any\n"
          "// question body is fetched, so those live here; the questions themselves are\n"
          "// in public/exams/practice/<slug>.json and load when a paper is opened.\n\n"
          "export const AIP_EXAM_MINUTES = %d;\n"
          "export const AIP_SCORE_MIN = %d;\n"
          "export const AIP_SCORE_MAX = %d;\n"
          "export const AIP_PASSING_SCORE = %d;\n\n"
          "export const AIP_CERTIFICATION = {\n"
          '  code: "AIP-C01",\n'
          '  name: "AWS Certified Generative AI Developer – Professional",\n'
          "};\n\n"
          "export const AIP_DOMAINS = %s;\n\n"
          "export const AIP_PRACTICE_EXAMS = %s;\n\n"
          "export const AIP_EXAM_SETS = %s;\n"
          % (EXAM_MINUTES, SCALE_MIN, SCALE_MAX, SCALE_PASS,
             json.dumps([d["name"] for d in DOMAINS], indent=2, ensure_ascii=False),
             json.dumps(manifest, indent=2, ensure_ascii=False),
             json.dumps(sets, indent=2, ensure_ascii=False)))

    total = sum(entry["questionCount"] for entry in manifest)
    print("AIP-C01 practice: %d papers, %d questions, %d explanation images -> %s"
          % (len(manifest), total, images_written, os.path.relpath(OUT_EXAM_DIR, ROOT)))
    if unlabeled:
        print("note: %d questions have no domain label in %s"
              % (len(unlabeled), os.path.relpath(QUESTION_DOMAINS, ROOT)))


def main():
    only = None
    if "--only" in sys.argv:
        position = sys.argv.index("--only")
        only = sys.argv[position + 1] if position + 1 < len(sys.argv) else None
    if only in (None, "guide"):
        build_guide()
    if only in (None, "exams"):
        build_exams()


if __name__ == "__main__":
    main()
