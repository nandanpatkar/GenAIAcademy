# HR Assistant Agent — Programmatic (Code-Based) Evaluators

This notebook demonstrates how to create and use **code-based evaluators** with Amazon Bedrock AgentCore Evaluations.

### What are code-based evaluators?

Custom code-based evaluators allow you to use **your own Lambda function** as the evaluator in Amazon Bedrock AgentCore Evaluations.
This gives you:

| Benefit | Description |
|---|---|
| **Determinism** | No LLM variance — same input always produces the same score |
| **Zero inference cost** | Lambda execution costs a fraction of LLM calls |
| **Domain specificity** | Encode exact business rules (e.g. "net pay must equal $X") |
| **Composability** | Mix code-based and LLM-based evaluators in the same run |

### What we'll build

We'll create two Lambda-backed evaluators for the HR Assistant agent:

| Evaluator | Level | Lambda | What it checks |
|---|---|---|---|
| **HRResponseLength** | TRACE | `hr-response-length` | Response length is 50–600 chars |
| **HRFactChecker** | SESSION | `hr-fact-checker` | PTO balances, pay stubs, and policy facts are accurate |

Then we'll run `OnDemandEvaluationDatasetRunner` with a **mixed evaluator set** combining these code-based evaluators with built-in LLM-as-as-Judge evaluators. We will also set up online evaluation using these evaluation for live monitoring.

### Tutorial Details

| Information | Details |
|---|---|
| Agent framework | Strands Agents |
| Runtime | Amazon Bedrock AgentCore Runtime |
| Evaluation SDK | `bedrock-agentcore` ≥ 1.6.0 |
| AWS services | AgentCore Runtime, AgentCore Evaluations, Lambda, CloudWatch |

### Prerequisites
- Python 3.10+
- AWS credentials with permissions for AgentCore, Lambda, CloudWatch, ECR, IAM
- Docker running locally (for agent container image build)
- IAM role for Lambda execution with `AWSLambdaBasicExecutionRole`

## Step 1: Install Dependencies

```python
!pip install -r requirements.txt -q
```

## Step 2: Configuration

```python
import boto3
import io
import json
import os
import subprocess
import sys
import tempfile
import time
import uuid
import zipfile
from datetime import datetime
from pathlib import Path
from boto3.session import Session
from botocore.config import Config
from IPython.display import display, Markdown

# ── Region configuration ──────────────────────────────────────────────────────
# REGION: the AWS region where the AgentCore Runtime (agent) is deployed.
#   Auto-detected from the boto3 session (reads AWS_DEFAULT_REGION env var or
#   the default region in ~/.aws/config). Set explicitly if needed, e.g.:
#   REGION = "us-east-1"
#
#   If you ran groundtruth_evaluations.ipynb first, REGION is also restored
#   from %store in the agent-load cell below, overriding this value.
REGION = Session().region_name
assert REGION, (
    "No AWS region detected. Set AWS_DEFAULT_REGION or configure a default "
    "region in ~/.aws/config, or set REGION explicitly above."
)

# EVAL_REGION: region for Lambda evaluators and evaluator registrations.
#   For online evaluation, this MUST match REGION (the agent's CloudWatch log
#   group and the evaluation config must be in the same region). The
#   agent-clients cell below aligns EVAL_REGION to REGION automatically
#   after %store restores the agent's actual region.
EVAL_REGION = REGION

boto_session = Session(region_name=REGION)
ACCOUNT_ID = boto3.client("sts").get_caller_identity()["Account"]

# Lambda execution role — needs AWSLambdaBasicExecutionRole
# Update this if your role has a different name
LAMBDA_ROLE_ARN = f"arn:aws:iam::{ACCOUNT_ID}:role/AgentCoreLambdaExecutionRole"

print(f"Region          : {REGION}")
print(f"Eval Region     : {EVAL_REGION}")
print(f"Account         : {ACCOUNT_ID}")
print(f"Lambda Role ARN : {LAMBDA_ROLE_ARN}")
```

## Step 3: Agent Setup

We need the HR Assistant agent deployed on AgentCore Runtime. If you ran the
`groundtruth_evaluations.ipynb` notebook, agent info was saved with `%store` and
we can reload it. Otherwise, we deploy fresh here.

```python
# Pre-initialize so static linters (ruff F821) don't flag them as undefined.
# %store -r overwrites these with the values saved by the groundtruth notebook.
AGENT_ID = AGENT_ARN = CW_LOG_GROUP = ""

# Try to load agent info from the groundtruth notebook.
# %store restores REGION to ensure the agentcore client uses the correct
# deployment region, regardless of the user's current boto3 default.
try:
    %store -r AGENT_ID
    %store -r AGENT_ARN
    %store -r CW_LOG_GROUP
    %store -r REGION          # restore the region the agent was deployed in
    print("Loaded agent from store:")
    print(f"  AGENT_ID     : {AGENT_ID}")
    print(f"  AGENT_ARN    : {AGENT_ARN}")
    print(f"  CW_LOG_GROUP : {CW_LOG_GROUP}")
    print(f"  REGION       : {REGION}")
    _agent_loaded = bool(AGENT_ID and AGENT_ARN)
except Exception:
    print("Agent info not found in store. Will deploy a fresh agent below.")
    _agent_loaded = False
```

```python
# Deploy agent if not already loaded
if not _agent_loaded:
    # -------------------------------------------------------------------------
    # Fresh deployment using boto3 (bedrock-agentcore-control) + Docker/ECR.
    # This path runs only when the groundtruth notebook has NOT been executed
    # first. If you prefer the CLI, run `agentcore deploy` from the project
    # root instead and set AGENT_ID / AGENT_ARN / CW_LOG_GROUP manually below.
    # -------------------------------------------------------------------------

    ecr_client = boto3.client("ecr", region_name=REGION)
    agentcore_control_deploy = boto3.client("bedrock-agentcore-control", region_name=REGION)
    iam_client = boto3.client("iam")

    AGENT_NAME = "hr_assistant_codeeval_tutorial"
    ECR_REPO_NAME = f"agentcore-{AGENT_NAME}"

    # ------------------------------------------------------------------
    # 1. Ensure IAM execution role exists
    # ------------------------------------------------------------------
    EXECUTION_ROLE_NAME = "AgentCoreRuntimeExecutionRole"
    EXECUTION_ROLE_ARN = f"arn:aws:iam::{ACCOUNT_ID}:role/{EXECUTION_ROLE_NAME}"

    try:
        iam_client.get_role(RoleName=EXECUTION_ROLE_NAME)
        print(f"Using existing IAM role: {EXECUTION_ROLE_ARN}")
    except iam_client.exceptions.NoSuchEntityException:
        print(f"Creating IAM role: {EXECUTION_ROLE_NAME}...")
        trust_policy = json.dumps(
            {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {"Service": "bedrock-agentcore.amazonaws.com"},
                        "Action": "sts:AssumeRole",
                    }
                ],
            }
        )
        iam_client.create_role(
            RoleName=EXECUTION_ROLE_NAME,
            AssumeRolePolicyDocument=trust_policy,
            Description="Execution role for AgentCore Runtime tutorial agents",
        )
        for policy_arn in [
            "arn:aws:iam::aws:policy/AmazonBedrockFullAccess",
            "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess",
        ]:
            iam_client.attach_role_policy(RoleName=EXECUTION_ROLE_NAME, PolicyArn=policy_arn)
        print(f"Created: {EXECUTION_ROLE_ARN}")
        time.sleep(10)  # allow IAM propagation

    # ------------------------------------------------------------------
    # 2. Create ECR repository (or reuse existing)
    # ------------------------------------------------------------------
    try:
        ecr_resp = ecr_client.create_repository(repositoryName=ECR_REPO_NAME)
        ECR_REPO_URI = ecr_resp["repository"]["repositoryUri"]
        print(f"Created ECR repo: {ECR_REPO_URI}")
    except ecr_client.exceptions.RepositoryAlreadyExistsException:
        ECR_REPO_URI = ecr_client.describe_repositories(repositoryNames=[ECR_REPO_NAME])["repositories"][0][
            "repositoryUri"
        ]
        print(f"Using existing ECR repo: {ECR_REPO_URI}")

    IMAGE_URI = f"{ECR_REPO_URI}:latest"

    # ------------------------------------------------------------------
    # 3. Build Docker image and push to ECR
    # ------------------------------------------------------------------
    ecr_registry = f"{ACCOUNT_ID}.dkr.ecr.{REGION}.amazonaws.com"
    print("Docker login to ECR...")
    subprocess.run(
        f"aws ecr get-login-password --region {REGION} | docker login --username AWS --password-stdin {ecr_registry}",
        shell=True,
        check=True,
    )
    print("Building Docker image (this may take a few minutes)...")
    subprocess.run(
        ["docker", "build", "--platform", "linux/amd64", "-t", IMAGE_URI, "."],
        check=True,
    )
    print("Pushing image to ECR...")
    subprocess.run(["docker", "push", IMAGE_URI], check=True)
    print(f"Image pushed: {IMAGE_URI}")

    # Allow ECR pull from AgentCore
    ecr_client.set_repository_policy(
        repositoryName=ECR_REPO_NAME,
        policyText=json.dumps(
            {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Sid": "AllowAgentCorePull",
                        "Effect": "Allow",
                        "Principal": {"Service": "bedrock-agentcore.amazonaws.com"},
                        "Action": [
                            "ecr:GetDownloadUrlForLayer",
                            "ecr:BatchGetImage",
                            "ecr:BatchCheckLayerAvailability",
                        ],
                    }
                ],
            }
        ),
    )

    # ------------------------------------------------------------------
    # 4. Create (or update) AgentCore Runtime
    # ------------------------------------------------------------------
    artifact = {"containerConfiguration": {"containerUri": IMAGE_URI}}
    try:
        resp = agentcore_control_deploy.create_agent_runtime(
            agentRuntimeName=AGENT_NAME,
            agentRuntimeArtifact=artifact,
            executionRoleArn=EXECUTION_ROLE_ARN,
            networkConfiguration={"networkMode": "PUBLIC"},
        )
        AGENT_ID = resp["agentRuntimeId"]
        AGENT_ARN = resp["agentRuntimeArn"]
        print(f"Created AgentCore Runtime: {AGENT_ID}")
    except agentcore_control_deploy.exceptions.ConflictException:
        runtimes = agentcore_control_deploy.list_agent_runtimes()["agentRuntimes"]
        existing = next((r for r in runtimes if r["agentRuntimeName"] == AGENT_NAME), None)
        assert existing, f"Runtime {AGENT_NAME} not found after conflict"
        AGENT_ID = existing["agentRuntimeId"]
        AGENT_ARN = existing["agentRuntimeArn"]
        agentcore_control_deploy.update_agent_runtime(
            agentRuntimeId=AGENT_ID,
            agentRuntimeArtifact=artifact,
        )
        print(f"Updated existing runtime: {AGENT_ID}")

    # Wait until READY
    terminal = {"READY", "CREATE_FAILED", "UPDATE_FAILED"}
    while True:
        status = agentcore_control_deploy.get_agent_runtime(agentRuntimeId=AGENT_ID)["status"]
        print(f"  Status: {status}")
        if status in terminal:
            break
        time.sleep(15)

    assert status == "READY", f"Deployment failed: {status}"
    CW_LOG_GROUP = f"/aws/bedrock-agentcore/runtimes/{AGENT_ID}-DEFAULT"

    print("\nAgent deployed:")
    print(f"  AGENT_ID     : {AGENT_ID}")
    print(f"  AGENT_ARN    : {AGENT_ARN}")
    print(f"  CW_LOG_GROUP : {CW_LOG_GROUP}")
else:
    print("Using existing agent — skipping deployment.")
```

```python
# Derive the agent's actual region from its ARN (robust even if %store is incomplete).
# ARN format: arn:aws:bedrock-agentcore:{region}:{account}:runtime/{id}
_arn_region = AGENT_ARN.split(":")[3] if AGENT_ARN else REGION
if _arn_region and _arn_region != REGION:
    print(f"Note: agent is in {_arn_region}, overriding REGION={REGION}")
    REGION = _arn_region

# Align EVAL_REGION with the agent's region so that Lambda evaluators, evaluator
# registrations, and the online evaluation config all live in the same region as
# the agent's CloudWatch log group. Online evaluation requires the log group and
# the evaluators to be in the same region as the control-plane config.
if EVAL_REGION != REGION:
    print(f"Aligning EVAL_REGION: {EVAL_REGION} → {REGION} (must match agent region for online eval)")
    EVAL_REGION = REGION

# boto3 client for agent invocation — must be in the same region as the agent
agentcore_client = boto3.client("bedrock-agentcore", region_name=REGION)
print(f"REGION      : {REGION}")
print(f"EVAL_REGION : {EVAL_REGION}")
```

## Step 4: Define Lambda Evaluator Functions

Each code-based evaluator is a Lambda function that receives agent spans and returns a score.

### Lambda input structure

AgentCore passes the following event to your Lambda:

```json
{
  "evaluationInput": {
    "sessionSpans": [ ... ]   // OTel spans from the agent session
  },
  "evaluationTarget": {       // null for SESSION level
    "traceIds": [ ... ]       // present for TRACE level
  },
  "evaluationLevel": "TRACE" // or "SESSION"
}
```

### Span structure (Strands / AgentCore OTel)

```
span.name                             → e.g. "invoke_agent", "llm_call"
span.attributes.gen_ai.operation.name → "execute_tool" for tool calls
span.attributes.gen_ai.tool.name      → tool name for tool call spans
span.span_events[*].body.output
      .messages[*].content.message   → final agent response text
```

### Lambda return format

```json
{ "value": 1.0, "label": "PASS", "explanation": "..." }   // success
{ "errorCode": "NoResponseFound", "errorMessage": "..." }  // error
```

### Evaluator 1: HRResponseLength (TRACE level)

Verifies the agent's response length is within an acceptable range (50–600 characters).
Responses shorter than 50 chars are likely incomplete; longer than 600 chars suggests over-explanation.

Since this operates at **TRACE level**, it evaluates each individual agent response separately.

```python
os.makedirs("lambdas/hr_response_length", exist_ok=True)

lambda_response_length_code = '# pylint: disable=duplicate-code\n"""\nHRResponseLength — Code-Based Evaluator (TRACE level)\n\nUses the SDK 1.6 @custom_code_based_evaluator() decorator.\nChecks that the agent\'s response is between MIN_LENGTH and MAX_LENGTH characters.\nStrips thinking blocks (<thinking>...</thinking>) before measuring.\n\nReturns:\n    value       — 1.0 (PASS) if within range, 0.0 (FAIL) otherwise\n    label       — "PASS" or "FAIL"\n    explanation — actual length and acceptable range\n"""\n\nimport re\n\nfrom bedrock_agentcore.evaluation import (  # pylint: disable=no-name-in-module\n    EvaluatorInput,\n    EvaluatorOutput,\n    custom_code_based_evaluator,\n)\n\nMIN_LENGTH = 50\nMAX_LENGTH = 600\n\n_THINKING_RE = re.compile(r"<thinking>.*?</thinking>", re.DOTALL)\n\n\ndef _first_clean_message(span: dict) -> str:\n    """Return the first non-empty cleaned message from a span\'s events."""\n    for se in span.get("span_events", []):\n        body = se.get("body", {})\n        if not isinstance(body, dict):\n            continue\n        for msg in body.get("output", {}).get("messages", []):\n            content = msg.get("content", {})\n            if isinstance(content, dict):\n                text = content.get("message", "")\n                if text:\n                    cleaned = _THINKING_RE.sub("", text).strip()\n                    if cleaned:\n                        return cleaned\n    return ""\n\n\ndef _extract_final_response(spans: list) -> str:\n    """Extract final visible response text from the invoke_agent span."""\n    for span in spans:\n        name = (span.get("name") or "").lower()\n        if "invoke_agent" not in name:\n            continue\n        text = _first_clean_message(span)\n        if text:\n            return text\n    return ""\n\n\ndef _extract_fallback_response(spans: list) -> str:\n    """Fallback: scan all span_events for any non-empty content message."""\n    for span in reversed(spans):\n        for se in span.get("span_events", []):\n            body = se.get("body", {})\n            if not isinstance(body, dict):\n                continue\n            for msg in (body.get("output", {}) or {}).get("messages", []):\n                content = msg.get("content", {})\n                text = (\n                    (content.get("message") or "") if isinstance(content, dict) else ""\n                )\n                cleaned = _THINKING_RE.sub("", text).strip()\n                if cleaned and not cleaned.startswith("[{"):\n                    return cleaned\n    return ""\n\n\n@custom_code_based_evaluator()\ndef lambda_handler(evaluator_input: EvaluatorInput, _context) -> EvaluatorOutput:\n    """Evaluate response length for a single agent trace."""\n    spans = evaluator_input.session_spans\n\n    # For TRACE level, target_trace_id identifies which trace to evaluate.\n    if evaluator_input.evaluation_level == "TRACE" and evaluator_input.target_trace_id:\n        spans = [\n            s\n            for s in spans\n            if s.get("traceId") == evaluator_input.target_trace_id\n            or s.get("trace_id") == evaluator_input.target_trace_id\n        ]\n\n    output_text = _extract_final_response(spans) or _extract_fallback_response(spans)\n\n    if not output_text:\n        return EvaluatorOutput(\n            label="FAIL",\n            errorCode="NoResponseFound",\n            errorMessage=(\n                f"No agent response text found in {len(spans)} spans. "\n                "Expected invoke_agent span with span_events containing output message."\n            ),\n        )\n\n    length = len(output_text)\n\n    if MIN_LENGTH <= length <= MAX_LENGTH:\n        return EvaluatorOutput(\n            value=1.0,\n            label="PASS",\n            explanation=(\n                f"Response length {length} chars is within the acceptable range "\n                f"[{MIN_LENGTH}, {MAX_LENGTH}]."\n            ),\n        )\n    if length < MIN_LENGTH:\n        return EvaluatorOutput(\n            value=0.0,\n            label="FAIL",\n            explanation=(\n                f"Response length {length} chars is too short (minimum {MIN_LENGTH}). "\n                f\'Preview: "{output_text[:60]}..."\'\n            ),\n        )\n    return EvaluatorOutput(\n        value=0.0,\n        label="FAIL",\n        explanation=(\n            f"Response length {length} chars exceeds maximum {MAX_LENGTH}. "\n            "Consider a more concise answer."\n        ),\n    )\n'

with open("lambdas/hr_response_length/lambda_function.py", "w") as f:
    f.write(lambda_response_length_code)

print("Written: lambdas/hr_response_length/lambda_function.py")
print(f"  {len(lambda_response_length_code)} chars")
```

### Evaluator 2: HRFactChecker (SESSION level)

Deterministically validates that the HR assistant's responses contain accurate facts
from the mock data store. Uses exact pattern matching — no LLM inference, no hallucination
risk in the evaluation itself.

Since this operates at **SESSION level**, it receives all spans for the entire conversation
and checks facts across all turns.

**Facts checked:**
- PTO balances: EMP-001 (10 remaining), EMP-002 (3 remaining), EMP-042 (13 remaining)
- Pay stubs: EMP-001 Jan 2026 gross=$8,333.33 / net=$5,362.50
- PTO request IDs must match format `PTO-2026-NNN`
- Policy facts: 15-day PTO accrual, 2-day advance notice, 401k 4% match, etc.

```python
os.makedirs("lambdas/hr_fact_checker", exist_ok=True)

lambda_fact_checker_code = '# pylint: disable=duplicate-code\n"""\nHRFactChecker — Code-Based Evaluator (SESSION level)\n\nUses the SDK 1.6 @custom_code_based_evaluator() decorator.\nDeterministically validates HR assistant responses against known ground-truth data.\nUnlike LLM-as-judge, this evaluator uses exact pattern matching.\n\nReturns:\n    value       — fraction of applicable checks that passed (0.0–1.0)\n    label       — "PASS" (all), "PARTIAL" (>=50%), "FAIL" (<50%), "SKIP" (no checks triggered)\n    explanation — which checks passed/failed\n"""\n\nimport re\n\nfrom bedrock_agentcore.evaluation import (  # pylint: disable=no-name-in-module\n    EvaluatorInput,\n    EvaluatorOutput,\n    custom_code_based_evaluator,\n)\n\n# Ground-truth registry (mirrors agent mock data)\nPTO_BALANCES = {\n    "EMP-001": {"remaining": 10, "total": 15, "used": 5},\n    "EMP-002": {"remaining": 3, "total": 15, "used": 12},\n    "EMP-042": {"remaining": 13, "total": 20, "used": 7},\n}\n\nPAY_STUBS = {\n    ("EMP-001", "2026-01"): {"gross": "8,333.33", "net": "5,362.50"},\n    ("EMP-001", "2025-12"): {"gross": "8,333.33", "net": "5,362.50"},\n    ("EMP-042", "2026-01"): {"gross": "10,416.67", "net": "6,607.30"},\n}\n\nMONTH_NAMES = {\n    "01": ["january", "jan"],\n    "02": ["february", "feb"],\n    "03": ["march", "mar"],\n    "04": ["april", "apr"],\n    "05": ["may"],\n    "06": ["june", "jun"],\n    "07": ["july", "jul"],\n    "08": ["august", "aug"],\n    "09": ["september", "sep"],\n    "10": ["october", "oct"],\n    "11": ["november", "nov"],\n    "12": ["december", "dec"],\n}\n\nPOLICY_FACTS_BY_TOPIC = {\n    "pto": [\n        (\n            "PTO accrual 15 days",\n            [r"15\\s*days?(\\s*of\\s*PTO|\\s*per\\s*year)", r"PTO.{0,30}15\\s*days?"],\n        ),\n        ("PTO advance notice 2 days", [r"2\\s*business\\s*days?", r"2-business-day"]),\n    ],\n    "remote_work": [\n        (\n            "Remote work 3 days/week",\n            [r"3\\s*days?\\s*(per|a)\\s*week", r"up\\s*to\\s*3\\s*days?"],\n        ),\n        (\n            "Core hours 10am-3pm",\n            [r"10\\s*[Aa]\\.?[Mm]\\.?.*3\\s*[Pp]\\.?[Mm]", r"10am.*3pm"],\n        ),\n    ],\n    "parental_leave": [\n        ("Primary leave 16 weeks", [r"16\\s*weeks?", r"primary.*16\\s*weeks?"]),\n        ("Secondary leave 6 weeks", [r"6\\s*weeks?", r"secondary.*6\\s*weeks?"]),\n    ],\n    "401k": [\n        ("401k 4% match", [r"4%?\\s*(of\\s*salary)?.*match", r"matches?\\s*4%"]),\n        ("401k 3-year vesting", [r"3[-\\s]year\\s*vest", r"vests?\\s*over\\s*3"]),\n    ],\n    "health": [\n        (\n            "Health 90% coverage",\n            [r"90%?\\s*(of\\s*premiums?|coverage)", r"covers?\\s*90%"],\n        ),\n    ],\n}\n\n_THINKING_RE = re.compile(r"<thinking>.*?</thinking>", re.DOTALL)\n\n\ndef _collect_span_texts(span: dict) -> list:\n    """Extract all non-empty response texts from a single invoke_agent span."""\n    texts = []\n    for se in span.get("span_events", []):\n        body = se.get("body", {})\n        if not isinstance(body, dict):\n            continue\n        for msg in body.get("output", {}).get("messages", []):\n            content = msg.get("content", {})\n            if isinstance(content, dict):\n                text = content.get("message", "")\n                if text:\n                    cleaned = _THINKING_RE.sub("", text).strip()\n                    if cleaned:\n                        texts.append(cleaned)\n    return texts\n\n\ndef _parse_spans(spans: list) -> tuple:\n    """Extract concatenated response text and tool names from session spans."""\n    response_parts = []\n    tool_names = []\n    for span in spans:\n        name = (span.get("name") or "").lower()\n        attrs = span.get("attributes", {})\n        op = attrs.get("gen_ai.operation.name", "")\n        # Collect all invoke_agent response texts (multi-turn sessions)\n        if "invoke_agent" in name:\n            response_parts.extend(_collect_span_texts(span))\n        # Tool calls\n        if op == "execute_tool":\n            tool_name = attrs.get("gen_ai.tool.name", "")\n            if tool_name:\n                tool_names.append(tool_name)\n    # Concatenate all turns for session-level fact checking\n    all_text = " ".join(response_parts)\n    return all_text, tool_names\n\n\n@custom_code_based_evaluator()\ndef lambda_handler(  # pylint: disable=too-many-branches,too-many-locals,too-many-statements\n    evaluator_input: EvaluatorInput, _context\n) -> EvaluatorOutput:\n    """Validate HR fact accuracy across all turns of a session."""\n    spans = evaluator_input.session_spans\n    all_text, tool_names = _parse_spans(spans)\n    all_text_lower = all_text.lower()\n\n    checks_run, checks_passed, checks_failed = [], [], []\n\n    # 1. PTO balance accuracy\n    if "get_pto_balance" in tool_names:\n        for emp_id, facts in PTO_BALANCES.items():\n            if emp_id not in all_text:\n                continue\n            correct = str(facts["remaining"])\n            near_remaining = rf"\\b{re.escape(correct)}\\b.{{0,30}}remaining"\n            near_value = rf"remaining.{{0,30}}\\b{re.escape(correct)}\\b"\n            remaining_pattern = re.compile(\n                f"{near_remaining}|{near_value}",\n                re.IGNORECASE,\n            )\n            check = f"PTO balance {emp_id} = {correct} remaining"\n            checks_run.append(check)\n            correct_val = bool(re.search(rf"\\b{re.escape(correct)}\\b", all_text))\n            if bool(remaining_pattern.search(all_text)) or (\n                correct_val and "remaining" in all_text_lower\n            ):\n                checks_passed.append(check)\n            else:\n                checks_failed.append(f"{check}: value not found near \'remaining\'")\n\n    # 2. Pay stub accuracy\n    for (emp_id, period), figures in PAY_STUBS.items():\n        if emp_id not in all_text:\n            continue\n        year, month_num = period.split("-")\n        month_variants = MONTH_NAMES.get(month_num, [])\n        if not (year in all_text and any(m in all_text_lower for m in month_variants)):\n            continue\n        for field, expected_val in [\n            ("gross", figures["gross"]),\n            ("net", figures["net"]),\n        ]:\n            check = f"Pay stub {emp_id} {period} {field} = ${expected_val}"\n            checks_run.append(check)\n            amount_re = re.compile(\n                r"\\$?\\s*" + re.escape(expected_val).replace(",", ",?"), re.IGNORECASE\n            )\n            if amount_re.search(all_text):\n                checks_passed.append(check)\n            else:\n                checks_failed.append(f"{check}: ${expected_val} not found")\n\n    # 3. PTO request ID format\n    if "submit_pto_request" in tool_names:\n        check = "PTO request ID format PTO-2026-NNN"\n        checks_run.append(check)\n        match = re.search(r"PTO-2026-\\d{3}", all_text)\n        if match:\n            checks_passed.append(f"{check}: found {match.group()}")\n        else:\n            checks_failed.append(f"{check}: no PTO-2026-NNN ID found")\n\n    # 4. Policy fact checks\n    if "lookup_hr_policy" in tool_names or "get_benefits_summary" in tool_names:\n        kw_topic_map = [\n            ("pto", ["paid time off", "pto policy", "pto accrual"]),\n            ("remote_work", ["remote work", "work remotely"]),\n            ("parental_leave", ["parental leave", "maternity", "paternity"]),\n            ("401k", ["401(k)", "401k", "employer match"]),\n            ("health", ["health insurance", "health plan", "hmo", "ppo", "hdhp"]),\n        ]\n        for topic, keywords in kw_topic_map:\n            if not any(kw in all_text_lower for kw in keywords):\n                continue\n            for check_desc, patterns in POLICY_FACTS_BY_TOPIC.get(topic, []):\n                check = f"Policy fact: {check_desc}"\n                checks_run.append(check)\n                if any(re.search(p, all_text, re.IGNORECASE) for p in patterns):\n                    checks_passed.append(check)\n                else:\n                    checks_failed.append(f"{check}: expected phrase not found")\n\n    if not checks_run:\n        return EvaluatorOutput(\n            value=1.0,\n            label="SKIP",\n            explanation=(\n                f"No applicable checks triggered. "\n                f"Tools: {tool_names or [\'none\']}, response length: {len(all_text)} chars."\n            ),\n        )\n\n    total = len(checks_run)\n    passed = len(checks_passed)\n    value = round(passed / total, 3)\n    label = "PASS" if value == 1.0 else ("PARTIAL" if value >= 0.5 else "FAIL")\n\n    lines = [f"{passed}/{total} HR fact checks passed."]\n    if checks_passed:\n        lines.append("Passed: " + "; ".join(checks_passed[:4]))\n    if checks_failed:\n        lines.append("Failed: " + "; ".join(checks_failed[:4]))\n\n    return EvaluatorOutput(value=value, label=label, explanation=" | ".join(lines))\n'

with open("lambdas/hr_fact_checker/lambda_function.py", "w") as f:
    f.write(lambda_fact_checker_code)

print("Written: lambdas/hr_fact_checker/lambda_function.py")
print(f"  {len(lambda_fact_checker_code)} chars")
```

## Step 5: Deploy Lambda Functions

We package each Lambda function as a zip archive and deploy it to AWS Lambda.
Then we add a resource policy granting AgentCore Evaluations permission to invoke the function.

```python
lambda_client = boto3.client("lambda", region_name=EVAL_REGION)


def make_zip(source_dir: str) -> bytes:
    """Package Lambda source + bedrock-agentcore SDK + pydantic into an in-memory zip.

    The Lambda functions use the SDK 1.6 @custom_code_based_evaluator() decorator which
    requires bedrock_agentcore and pydantic. We bundle all required packages.
    boto3/botocore are already available in the Lambda runtime — excluded to save space.
    """
    buf = io.BytesIO()
    with tempfile.TemporaryDirectory() as tmpdir:
        pkg_dir = Path(tmpdir) / "packages"
        pkg_dir.mkdir()

        print("  Bundling bedrock-agentcore SDK (no runtime deps — boto3 is in Lambda runtime)...")
        subprocess.run(
            [
                sys.executable,
                "-m",
                "pip",
                "install",
                "bedrock-agentcore>=1.6.0",
                "--no-deps",
                "--target",
                str(pkg_dir),
                "--quiet",
            ],
            check=True,
        )

        print("  Bundling pydantic (Linux x86_64 binary for Python 3.12)...")
        subprocess.run(
            [
                sys.executable,
                "-m",
                "pip",
                "install",
                "pydantic>=2.0.0",
                "--target",
                str(pkg_dir),
                "--platform",
                "manylinux2014_x86_64",
                "--implementation",
                "cp",
                "--python-version",
                "312",
                "--only-binary=:all:",
                "--quiet",
            ],
            check=True,
        )

        # bedrock-agentcore imports starlette, uvicorn, websockets, typing-extensions
        # even though they aren't strictly needed for the evaluator decorator.
        print("  Bundling starlette, uvicorn, websockets, typing-extensions...")
        subprocess.run(
            [
                sys.executable,
                "-m",
                "pip",
                "install",
                "starlette",
                "uvicorn",
                "websockets",
                "typing-extensions",
                "--target",
                str(pkg_dir),
                "--quiet",
            ],
            check=True,
        )

        with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
            # Lambda function source files
            for py_file in sorted(Path(source_dir).glob("*.py")):
                zf.write(py_file, py_file.name)
                print(f"    + {py_file.name} ({py_file.stat().st_size} bytes)")
            # Bundled packages
            for pkg_file in sorted(pkg_dir.rglob("*")):
                if pkg_file.is_file():
                    zf.write(pkg_file, str(pkg_file.relative_to(pkg_dir)))

    buf.seek(0)
    data = buf.read()
    print(f"  Total zip size: {len(data):,} bytes ({len(data) // 1024} KB)")
    return data


def deploy_lambda(function_name: str, source_dir: str, timeout_s: int = 60) -> str:
    """Create or update a Lambda function. Returns the function ARN."""
    print(f"\n[Lambda] Packaging {function_name}...")
    zip_bytes = make_zip(source_dir)

    try:
        resp = lambda_client.get_function(FunctionName=function_name)
        print("  Function exists — updating code...")
        lambda_client.update_function_code(FunctionName=function_name, ZipFile=zip_bytes)
        waiter = lambda_client.get_waiter("function_updated_v2")
        waiter.wait(FunctionName=function_name)
        arn = resp["Configuration"]["FunctionArn"]
        print(f"  Updated: {arn}")
    except lambda_client.exceptions.ResourceNotFoundException:
        print("  Creating new Lambda function...")
        resp = lambda_client.create_function(
            FunctionName=function_name,
            Runtime="python3.12",
            Role=LAMBDA_ROLE_ARN,
            Handler="lambda_function.lambda_handler",
            Code={"ZipFile": zip_bytes},
            Timeout=timeout_s + 10,
            MemorySize=128,
            Description=f"AgentCore code-based evaluator: {function_name}",
        )
        waiter = lambda_client.get_waiter("function_active_v2")
        waiter.wait(FunctionName=function_name)
        arn = resp["FunctionArn"]
        print(f"  Created: {arn}")
    return arn


def add_invoke_permission(function_name: str) -> None:
    """Grant AgentCore Evaluate service principal permission to invoke the Lambda."""
    statement_id = "AllowAgentCoreEvaluateInvoke"
    print(f"  Adding resource policy to {function_name}...")
    try:
        lambda_client.remove_permission(FunctionName=function_name, StatementId=statement_id)
    except lambda_client.exceptions.ResourceNotFoundException:
        pass
    lambda_client.add_permission(
        FunctionName=function_name,
        StatementId=statement_id,
        Action="lambda:InvokeFunction",
        Principal="bedrock-agentcore.amazonaws.com",
        SourceAccount=ACCOUNT_ID,
    )
    print("  Granted lambda:InvokeFunction to bedrock-agentcore.amazonaws.com")
```

```python
# Deploy both Lambda functions
lambda_arn_response_length = deploy_lambda(
    "hr-response-length",
    "lambdas/hr_response_length",
    timeout_s=30,
)
add_invoke_permission("hr-response-length")

lambda_arn_fact_checker = deploy_lambda(
    "hr-fact-checker",
    "lambdas/hr_fact_checker",
    timeout_s=60,
)
add_invoke_permission("hr-fact-checker")

print("\nLambda functions deployed:")
print(f"  hr-response-length : {lambda_arn_response_length}")
print(f"  hr-fact-checker    : {lambda_arn_fact_checker}")
```

## Step 6: Register Evaluators with AgentCore

With the Lambda functions deployed, we register them as evaluators using the
AgentCore Evaluations control plane API. This creates an evaluator record that
references the Lambda ARN.

The `level` field controls how the evaluator is invoked:
- **TRACE** — called once per agent response (trace)
- **SESSION** — called once per conversation session

```python
# SDK 1.6: bedrock-agentcore-control is a standard boto3 service — no custom endpoint needed.
cp_client = boto3.client(
    "bedrock-agentcore-control",
    region_name=EVAL_REGION,
    config=Config(retries={"max_attempts": 3, "mode": "standard"}),
)
```

```python
def create_code_evaluator(name: str, lambda_arn: str, level: str, timeout_s: int) -> dict:
    """Register a Lambda function as an AgentCore code-based evaluator.

    Appends a unique run suffix to the name to avoid ConflictException on re-runs.
    """
    unique_name = f"{name}_{RUN_SUFFIX}"
    print(f"[Evaluator] Creating '{unique_name}' (level={level})...")
    resp = cp_client.create_evaluator(
        evaluatorName=unique_name,
        level=level,
        evaluatorConfig={
            "codeBased": {
                "lambdaConfig": {
                    "lambdaArn": lambda_arn,
                    "lambdaTimeoutInSeconds": timeout_s,
                }
            }
        },
    )
    evaluator_id = resp["evaluatorId"]
    print(f"  evaluatorId : {evaluator_id}")
    print(f"  level       : {level}")
    return {"id": evaluator_id, "level": level, "lambda_arn": lambda_arn}
```

```python
# Generate a short unique suffix so re-runs don't conflict with existing evaluator names
RUN_SUFFIX = uuid.uuid4().hex[:8]
print(f"Run suffix: {RUN_SUFFIX}")

# Small pause for IAM policy propagation
time.sleep(5)

response_length_eval = create_code_evaluator(
    name="HRResponseLength",
    lambda_arn=lambda_arn_response_length,
    level="TRACE",
    timeout_s=30,
)

fact_checker_eval = create_code_evaluator(
    name="HRFactChecker",
    lambda_arn=lambda_arn_fact_checker,
    level="SESSION",
    timeout_s=60,
)

CODE_EVAL_IDS = {
    "HRResponseLength": response_length_eval["id"],
    "HRFactChecker": fact_checker_eval["id"],
}

print("\nCode-based evaluators registered:")
for name, eid in CODE_EVAL_IDS.items():
    print(f"  {name} : {eid}")
```

```python
# Save evaluator IDs for future use
os.makedirs("results", exist_ok=True)
ids_path = "results/code_evaluator_ids.json"
with open(ids_path, "w") as f:
    json.dump(
        {
            "HRResponseLength": {
                "id": response_length_eval["id"],
                "level": "TRACE",
                "lambda_arn": lambda_arn_response_length,
            },
            "HRFactChecker": {
                "id": fact_checker_eval["id"],
                "level": "SESSION",
                "lambda_arn": lambda_arn_fact_checker,
            },
        },
        f,
        indent=2,
    )
print(f"Evaluator IDs saved to: {ids_path}")
```

## Step 7: On-Demand Evaluation with Code-Based Evaluators

On-demand evaluation lets you evaluate a specific existing session from CloudWatch — no re-invocation of the agent required.
You supply a `session_id` and a list of evaluator IDs; the service retrieves the stored OTel spans and runs the evaluators against them.

We first invoke the HR assistant to create a fresh session, then pass the **code-based evaluator IDs** (`HRResponseLength` and `HRFactChecker`) to `EvaluationClient.run()` alongside two built-in evaluators for comparison.

| Evaluator | Type | Level | What it checks |
|---|---|---|---|
| `Builtin.Correctness` | LLM | TRACE | Semantic similarity to expected answer |
| `Builtin.GoalSuccessRate` | LLM | SESSION | Whether the agent fulfilled the user goal |
| `HRResponseLength_<suffix>` | Code | TRACE | Response length 50–600 chars |
| `HRFactChecker_<suffix>` | Code | SESSION | PTO balances / pay stub / policy accuracy |

> **Note:** If the agent is in a different region than `EVAL_REGION`, `EvaluationClient` needs the
> agent region for CloudWatch span collection. The workaround is to create the client with `EVAL_REGION`
> (so the data plane targets evaluators in `EVAL_REGION`) then set `ec.region_name = REGION` so
> CloudWatch queries run in the agent's region.

```python
# Simple invoker for on-demand sessions (no AgentInvokerInput wrapper needed)
def invoke_agent_simple(prompt: str, session_id: str) -> str:
    resp = agentcore_client.invoke_agent_runtime(
        agentRuntimeArn=AGENT_ARN,
        qualifier="DEFAULT",
        runtimeSessionId=session_id,
        payload=json.dumps({"prompt": prompt}).encode("utf-8"),
    )
    raw = resp["response"].read().decode("utf-8")
    parts = []
    for line in raw.splitlines():
        if line.startswith("data: "):
            chunk = line[len("data: ") :]
            try:
                chunk = json.loads(chunk)
            except Exception:
                pass
            parts.append(str(chunk))
    return "".join(parts) if parts else raw
```

```python
# Invoke the agent to generate a session with known HR data facts
ONDEMAND_SESSION_ID = f"ondemand-eval-{uuid.uuid4()}"
print(f"Session ID : {ONDEMAND_SESSION_ID}")

turns = [
    "What is the current PTO balance for employee EMP-001?",
    "Please submit a PTO request for EMP-001 from 2026-06-02 to 2026-06-04.",
    "What is the company PTO policy?",
]

for prompt in turns:
    print(f"  > {prompt}")
    reply = invoke_agent_simple(prompt, ONDEMAND_SESSION_ID)
    print(f"  < {reply[:120]}")

print("\nWaiting 90s for CloudWatch log ingestion...")
time.sleep(90)
print("Ready for on-demand evaluation.")
```

```python
from bedrock_agentcore.evaluation import EvaluationClient
from datetime import timedelta

# EvaluationClient with EVAL_REGION so the data plane calls go to the region
# where code-based evaluators are registered.
ec = EvaluationClient(region_name=EVAL_REGION)

# If the agent is in a different region, override region_name so the internal
# CloudWatchAgentSpanCollector queries the correct region for spans.
if REGION != EVAL_REGION:
    ec.region_name = REGION  # CW span lookup → agent's region

# Pre-populate level cache so the SDK can resolve evaluator levels without
# extra GetEvaluator API calls (required for Builtin.* evaluators).
ec._evaluator_level_cache.update(
    {
        "Builtin.Correctness": "TRACE",
        "Builtin.GoalSuccessRate": "SESSION",
        CODE_EVAL_IDS["HRResponseLength"]: "TRACE",
        CODE_EVAL_IDS["HRFactChecker"]: "SESSION",
    }
)

ondemand_evaluators = [
    "Builtin.Correctness",
    "Builtin.GoalSuccessRate",
    CODE_EVAL_IDS["HRResponseLength"],  # Lambda: TRACE level
    CODE_EVAL_IDS["HRFactChecker"],  # Lambda: SESSION level
]

print(f"Running on-demand evaluation for session: {ONDEMAND_SESSION_ID}")
print(f"  CW region   : {ec.region_name} (agent spans)")
print(f"  Eval region : {EVAL_REGION} (code-based evaluators)")
print(f"  Evaluators  : {ondemand_evaluators}\n")

ondemand_results = ec.run(
    evaluator_ids=ondemand_evaluators,
    session_id=ONDEMAND_SESSION_ID,
    agent_id=AGENT_ID,
    look_back_time=timedelta(hours=2),
)

print(f"\nEvaluation complete. {len(ondemand_results)} result(s) returned.")
```

```python
# EvaluationClient.run() returns List[dict] — same schema as the groundtruth notebook
name_by_id = {v: k for k, v in CODE_EVAL_IDS.items()}

rows = ["| Evaluator | Type | Value | Label | Explanation |", "|---|---|---|---|---|"]

for res in ondemand_results:
    evaluator_id = res.get("evaluatorId", "")
    kind = "code" if evaluator_id in CODE_EVAL_IDS.values() else "builtin"
    display_name = name_by_id.get(evaluator_id, evaluator_id)
    value = str(res.get("value", res.get("score", "N/A")))
    lbl = str(res.get("label", res.get("rating", "")))
    explanation = (res.get("explanation", "") or "")[:120].replace("\n", " ")
    error_code = res.get("errorCode")
    if error_code:
        lbl = f"ERR:{error_code}"
        explanation = (res.get("errorMessage", "") or "")[:120]
    rows.append(f"| `{display_name}` | {kind} | {value} | {lbl} | {explanation} |")

display(Markdown("### On-Demand Evaluation Results\n\n" + "\n".join(rows)))
```

## Step 8: Run Evaluation with Mixed Evaluator Set

Now we run `OnDemandEvaluationDatasetRunner` with a **mixed evaluator set** — combining the two code-based Lambda evaluators we just registered with three built-in LLM evaluators.

`OnDemandEvaluationDatasetRunner` handles everything automatically:
1. Iterates through each scenario in the dataset
2. Invokes the agent with the scenario prompt
3. Waits for CloudWatch logs to arrive
4. Calls each evaluator on the resulting spans
5. Aggregates scores into an `EvaluationResult`

```
Dataset → OnDemandEvaluationDatasetRunner → Agent invocations → CloudWatch → Evaluators → Results
```

```python
from bedrock_agentcore.evaluation import (
    AgentInvokerInput,
    AgentInvokerOutput,
    CloudWatchAgentSpanCollector,
    Dataset,
    EvaluationRunConfig,
    OnDemandEvaluationDatasetRunner,
    EvaluatorConfig,
    Turn,
    PredefinedScenario,
)
```

```python
def agent_invoker(invoker_input: AgentInvokerInput) -> AgentInvokerOutput:
    """Invoke the HR assistant and return the response text."""
    payload = invoker_input.payload
    body = {"prompt": payload} if isinstance(payload, str) else payload

    resp = agentcore_client.invoke_agent_runtime(
        agentRuntimeArn=AGENT_ARN,
        qualifier="DEFAULT",
        runtimeSessionId=invoker_input.session_id,
        payload=json.dumps(body).encode("utf-8"),
    )

    raw = resp["response"].read().decode("utf-8")
    parts = []
    for line in raw.splitlines():
        if line.startswith("data: "):
            chunk = line[len("data: ") :]
            try:
                chunk = json.loads(chunk)
            except Exception:
                pass
            parts.append(str(chunk))
    return AgentInvokerOutput(agent_output="".join(parts) if parts else raw)
```

```python
# Evaluation dataset — scenarios that exercise facts the HRFactChecker validates
dataset = Dataset(
    scenarios=[
        PredefinedScenario(
            scenario_id="pto-balance-check",
            turns=[
                Turn(
                    input="What is the current PTO balance for employee EMP-001?",
                    expected_response="Employee EMP-001 has 10 remaining PTO days out of 15 total (5 days used).",
                )
            ],
            expected_trajectory=["get_pto_balance"],
            assertions=[
                "Agent called get_pto_balance with employee_id=EMP-001",
                "Agent reported 10 remaining PTO days",
            ],
        ),
        PredefinedScenario(
            scenario_id="submit-pto-request",
            turns=[
                Turn(
                    input="Please submit a PTO request for EMP-001 from 2026-04-14 to 2026-04-16 for a family vacation.",
                    expected_response="PTO request submitted and approved for EMP-001 from 2026-04-14 to 2026-04-16.",
                )
            ],
            expected_trajectory=["submit_pto_request"],
            assertions=[
                "Agent called submit_pto_request for EMP-001",
                "Agent confirmed the request was approved and provided a request ID",
            ],
        ),
        PredefinedScenario(
            scenario_id="pay-stub-lookup",
            turns=[
                Turn(
                    input="Can you pull up the January 2026 pay stub for employee EMP-001?",
                    expected_response="EMP-001 January 2026: gross pay $8,333.33, net pay $5,362.50.",
                )
            ],
            expected_trajectory=["get_pay_stub"],
            assertions=[
                "Agent called get_pay_stub for EMP-001 period 2026-01",
                "Agent reported gross pay of $8,333.33",
                "Agent reported net pay of $5,362.50",
            ],
        ),
        PredefinedScenario(
            scenario_id="pto-policy-lookup",
            turns=[
                Turn(
                    input="What is the company PTO policy?",
                    expected_response="Full-time employees accrue 15 days of PTO per year. Requests must be submitted at least 2 business days in advance.",
                )
            ],
            expected_trajectory=["lookup_hr_policy"],
            assertions=[
                "Agent called lookup_hr_policy with topic=pto",
                "Agent mentioned 15 days annual accrual",
                "Agent mentioned the 2 business day advance notice requirement",
            ],
        ),
        PredefinedScenario(
            scenario_id="health-benefits",
            turns=[
                Turn(
                    input="Can you tell me about the company health insurance options?",
                    expected_response="The company covers 90% of health insurance premiums for employee-only coverage. Three plans are available: Blue Shield PPO, Kaiser HMO, and HDHP with HSA.",
                )
            ],
            expected_trajectory=["get_benefits_summary"],
            assertions=[
                "Agent called get_benefits_summary with benefit_type=health",
                "Agent mentioned 90% premium coverage",
            ],
        ),
    ]
)

print(f"Dataset: {len(dataset.scenarios)} scenarios")
```

```python
# Mixed evaluator set: builtin LLM evaluators + code-based Lambda evaluators
builtin_evaluator_ids = [
    "Builtin.Correctness",  # TRACE — uses expected_response
    "Builtin.Helpfulness",  # TRACE — no ground truth needed
    "Builtin.ResponseRelevance",  # TRACE — no ground truth needed
]

code_evaluator_ids = list(CODE_EVAL_IDS.values())

all_evaluator_ids = builtin_evaluator_ids + code_evaluator_ids

# Pre-populate evaluator level cache so the runner knows whether
# each evaluator runs at TRACE or SESSION level without extra API calls.
# Required because Builtin.* evaluators cannot be resolved via GetEvaluator.
EVALUATOR_LEVELS = {
    "Builtin.Correctness": "TRACE",
    "Builtin.Helpfulness": "TRACE",
    "Builtin.ResponseRelevance": "TRACE",
    "Builtin.GoalSuccessRate": "SESSION",
    "Builtin.TrajectoryExactOrderMatch": "SESSION",
    CODE_EVAL_IDS["HRResponseLength"]: "TRACE",  # code-based TRACE
    CODE_EVAL_IDS["HRFactChecker"]: "SESSION",  # code-based SESSION
}

span_collector = CloudWatchAgentSpanCollector(
    log_group_name=CW_LOG_GROUP,
    region=REGION,
    max_wait_seconds=180,
    poll_interval_seconds=15,
)

config = EvaluationRunConfig(
    evaluator_config=EvaluatorConfig(evaluator_ids=all_evaluator_ids),
    evaluation_delay_seconds=180,
    max_concurrent_scenarios=3,
)

runner = OnDemandEvaluationDatasetRunner(region=EVAL_REGION)
runner._evaluator_level_cache.update(EVALUATOR_LEVELS)

print(f"Evaluator set ({len(all_evaluator_ids)} total):")
for eid in all_evaluator_ids:
    level = EVALUATOR_LEVELS.get(eid, "?")
    kind = "code-based" if eid in code_evaluator_ids else "builtin"
    print(f"  [{level}] {eid} ({kind})")
```

```python
print("Starting evaluation...")
print(f"  Scenarios : {len(dataset.scenarios)}")
print(
    f"  Evaluators: {len(all_evaluator_ids)} ({len(builtin_evaluator_ids)} builtin + {len(code_evaluator_ids)} code-based)"
)
print(f"  Delay     : {config.evaluation_delay_seconds}s\n")

eval_result = runner.run(
    config=config,
    dataset=dataset,
    agent_invoker=agent_invoker,
    span_collector=span_collector,
)

completed = sum(1 for sr in eval_result.scenario_results if sr.status == "COMPLETED")
failed = sum(1 for sr in eval_result.scenario_results if sr.status == "FAILED")
print(f"\nEvaluation complete: {completed} completed, {failed} failed.")
```

## Step 9: Inspect Results

We display two views of the results:
1. **Full table** — all evaluators, all scenarios, with explanations
2. **Code evaluator summary** — aggregate scores for the two Lambda-backed evaluators

```python
def display_all_results(eval_result) -> None:
    """Display results as markdown tables, one per scenario."""
    for sr in eval_result.scenario_results:
        if sr.status == "FAILED":
            display(Markdown(f"**Scenario `{sr.scenario_id}`** — FAILED: {sr.error}"))
            continue

        rows = [
            "| Evaluator | Type | Value | Label | Explanation |",
            "|---|---|---|---|---|",
        ]
        for er in sr.evaluator_results:
            kind = "code" if er.evaluator_id in code_evaluator_ids else "builtin"
            for res in er.results:
                value = str(res.get("value", res.get("score", "N/A")))
                lbl = str(res.get("label", res.get("rating", "")))
                explanation = (res.get("explanation", "") or "")[:110].replace("\n", " ")
                error_code = res.get("errorCode")
                if error_code:
                    lbl = f"ERR:{error_code}"
                    explanation = (res.get("errorMessage", "") or "")[:110]
                rows.append(f"| `{er.evaluator_id[:38]}` | {kind} | {value} | {lbl} | {explanation} |")

        display(Markdown(f"### Scenario: `{sr.scenario_id}`\n\n" + "\n".join(rows)))


display_all_results(eval_result)
```

```python
def display_code_eval_summary(eval_result, code_eval_ids: dict) -> None:
    """Focused summary of code-based evaluator results across all scenarios."""
    code_eval_set = set(code_eval_ids.values())
    name_by_id = {v: k for k, v in code_eval_ids.items()}

    rows = [
        "| Scenario | Evaluator | Value | Label | Explanation |",
        "|---|---|---|---|---|",
    ]

    for sr in eval_result.scenario_results:
        if sr.status != "COMPLETED":
            continue
        for er in sr.evaluator_results:
            if er.evaluator_id not in code_eval_set:
                continue
            eval_name = name_by_id.get(er.evaluator_id, er.evaluator_id)
            for res in er.results:
                value = str(res.get("value", "N/A"))
                lbl = str(res.get("label", ""))
                explanation = (res.get("explanation", "") or "")[:120].replace("\n", " ")
                error_code = res.get("errorCode")
                if error_code:
                    lbl = f"ERR:{error_code}"
                    explanation = (res.get("errorMessage", "") or "")[:120]
                rows.append(f"| `{sr.scenario_id}` | **{eval_name}** | {value} | {lbl} | {explanation} |")

    display(Markdown("## Code-Based Evaluator Summary\n\n" + "\n".join(rows)))


display_code_eval_summary(eval_result, CODE_EVAL_IDS)
```

```python
# Compare code-based vs builtin evaluator average scores
from collections import defaultdict

builtin_scores = defaultdict(list)
code_scores = defaultdict(list)

for sr in eval_result.scenario_results:
    if sr.status != "COMPLETED":
        continue
    for er in sr.evaluator_results:
        for res in er.results:
            if "value" in res and res["value"] is not None and not res.get("errorCode"):
                score = float(res["value"])
                if er.evaluator_id in code_evaluator_ids:
                    code_scores[er.evaluator_id].append(score)
                else:
                    builtin_scores[er.evaluator_id].append(score)

print("Built-in (LLM-as-judge) evaluator averages:")
for eid, scores in sorted(builtin_scores.items()):
    print(f"  {eid:<45} avg={sum(scores) / len(scores):.2f}  (n={len(scores)})")

print("\nCode-based (Lambda) evaluator averages:")
name_by_id = {v: k for k, v in CODE_EVAL_IDS.items()}
for eid, scores in sorted(code_scores.items()):
    name = name_by_id.get(eid, eid)
    print(f"  {name:<45} avg={sum(scores) / len(scores):.2f}  (n={len(scores)})")
```

```python
timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
results_path = f"results/code_based_eval_{timestamp}.json"
with open(results_path, "w") as f:
    json.dump(eval_result.model_dump(), f, indent=2, default=str)
print(f"Results saved to: {results_path}")
```

## Step 10: Online Evaluation with Code-Based Evaluators

**Online evaluation** continuously monitors your live agent traffic and automatically scores sessions
as they happen — no manual triggering required. You configure it once, and AgentCore watches your
agent's CloudWatch log stream, evaluating new sessions at a configurable sampling rate.

In this step we reuse the **same code-based evaluators** (`HRResponseLength` and `HRFactChecker`)
we registered in Step 6. This demonstrates that a single evaluator registration can serve both
on-demand and online evaluation use cases.

### How online evaluation works

```
Agent invocation
      │
      ▼  (OTel spans → CloudWatch)
AgentCore Runtime log group
      │
      ▼  (online eval config watches the log group)
AgentCore Evaluations
      ├── Builtin LLM evaluators  → LLM inference
      └── Code-based evaluators   → your Lambda function
             │
             ▼
       Results in CloudWatch Logs
       /aws/bedrock-agentcore/evaluations/online-evaluations/...
```

### Key differences from on-demand evaluation

| | On-demand | Online |
|---|---|---|
| **Trigger** | Explicit API call per session | Automatic, event-driven |
| **Scope** | Specific session(s) you choose | All sessions (or a sampled %) |
| **Setup** | Call `EvaluationClient.run()` per session | Configure once with `create_online_evaluation_config` |
| **Evaluator locking** | No | Code-based evaluators become **locked** while the config is enabled |
| **Best for** | Ad-hoc checks, CI/CD pipelines | Continuous production monitoring |

### IAM execution role

Online evaluation requires an **evaluation execution role** — an IAM role that AgentCore Evaluations
assumes to invoke your Lambda evaluators and read CloudWatch spans. It must trust
`bedrock-agentcore.amazonaws.com` and have `lambda:InvokeFunction` + `logs:FilterLogEvents`
permissions.

> **Evaluator locking:** When a code-based evaluator is referenced by an enabled online evaluation
> config, AgentCore automatically locks it to prevent accidental modification. To update the
> evaluator, first disable the online evaluation config (or delete it), then update the evaluator,
> then re-enable the config.

### Step 10a: Create IAM Evaluation Execution Role

```python
iam_client = boto3.client("iam")
ONLINE_EVAL_ROLE_NAME = "AgentCoreOnlineEvaluationRole"
ONLINE_EVAL_ROLE_ARN = f"arn:aws:iam::{ACCOUNT_ID}:role/{ONLINE_EVAL_ROLE_NAME}"

# Trust policy: allow AgentCore Evaluations service to assume this role
trust_policy = json.dumps(
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {"Service": "bedrock-agentcore.amazonaws.com"},
                "Action": "sts:AssumeRole",
            }
        ],
    }
)

# Inline permission policy: invoke Lambda evaluators + full CloudWatch Logs access.
# The online evaluation service requires:
#   READ  — FilterLogEvents, GetLogEvents, StartQuery, GetQueryResults on:
#             - agent runtime log group (/aws/bedrock-agentcore/runtimes/...)
#             - OTel spans log group (aws/spans — no leading slash)
#   WRITE — CreateLogGroup, CreateLogStream, PutLogEvents for writing evaluation results to:
#             - /aws/bedrock-agentcore/evaluations/results/<config-name>
eval_policy = json.dumps(
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "InvokeLambdaEvaluators",
                "Effect": "Allow",
                "Action": ["lambda:InvokeFunction", "lambda:GetFunction"],
                "Resource": [
                    lambda_arn_response_length,
                    lambda_arn_fact_checker,
                ],
            },
            {
                "Sid": "CloudWatchLogsReadSpans",
                "Effect": "Allow",
                "Action": [
                    "logs:FilterLogEvents",
                    "logs:DescribeLogGroups",
                    "logs:DescribeLogStreams",
                    "logs:GetLogEvents",
                    "logs:StartQuery",
                    "logs:GetQueryResults",
                    "logs:StopQuery",
                ],
                "Resource": "*",
            },
            {
                "Sid": "CloudWatchLogsWriteResults",
                "Effect": "Allow",
                "Action": [
                    "logs:CreateLogGroup",
                    "logs:CreateLogStream",
                    "logs:PutLogEvents",
                ],
                "Resource": f"arn:aws:logs:{REGION}:{ACCOUNT_ID}:log-group:/aws/bedrock-agentcore/evaluations/*",
            },
        ],
    }
)

try:
    iam_client.get_role(RoleName=ONLINE_EVAL_ROLE_NAME)
    print(f"Using existing role: {ONLINE_EVAL_ROLE_ARN}")
    iam_client.put_role_policy(
        RoleName=ONLINE_EVAL_ROLE_NAME,
        PolicyName="AgentCoreOnlineEvalPermissions",
        PolicyDocument=eval_policy,
    )
    print("  Inline policy updated.")
except iam_client.exceptions.NoSuchEntityException:
    print(f"Creating IAM role: {ONLINE_EVAL_ROLE_NAME}...")
    iam_client.create_role(
        RoleName=ONLINE_EVAL_ROLE_NAME,
        AssumeRolePolicyDocument=trust_policy,
        Description="Execution role for AgentCore online evaluation with code-based evaluators",
    )
    iam_client.put_role_policy(
        RoleName=ONLINE_EVAL_ROLE_NAME,
        PolicyName="AgentCoreOnlineEvalPermissions",
        PolicyDocument=eval_policy,
    )
    print(f"Created: {ONLINE_EVAL_ROLE_ARN}")

print(f"\nOnline eval execution role: {ONLINE_EVAL_ROLE_ARN}")
print("Waiting 10s for IAM propagation...")
time.sleep(10)
```

### Step 10b: Create Online Evaluation Configuration

We create an online evaluation config that monitors the HR assistant's live CloudWatch log group
and evaluates every session (100% sampling rate) with our two code-based evaluators.

The config references:
- **`HRResponseLength`** (TRACE level) — evaluated per agent response turn
- **`HRFactChecker`** (SESSION level) — evaluated once per completed session

> Once this config is **enabled**, both code-based evaluators are automatically **locked**
> and cannot be modified until the config is disabled or deleted.

```python
# Unique name for the online eval config (no hyphens — service regex: [a-zA-Z][a-zA-Z0-9_]{0,99})
ONLINE_EVAL_CONFIG_NAME = f"hr_online_eval_{RUN_SUFFIX}"

# The OTel service name is <agentRuntimeName>.DEFAULT
# AGENT_ARN format: arn:aws:bedrock-agentcore:{region}:{account}:runtime/{id}
_runtime_id = AGENT_ARN.split("/")[-1]  # e.g. hr_assistant_codeeval_tutorial-AbCdEfGhIj
_agent_runtime_name = _runtime_id.rsplit("-", 1)[0]  # strip auto-generated suffix
OTEL_SERVICE_NAME = f"{_agent_runtime_name}.DEFAULT"

print(f"Online eval config name : {ONLINE_EVAL_CONFIG_NAME}")
print(f"Monitoring log group    : {CW_LOG_GROUP}")
print(f"OTel service name       : {OTEL_SERVICE_NAME}")
print(f"Evaluators              : {list(CODE_EVAL_IDS.keys())}")
print()

online_eval_resp = cp_client.create_online_evaluation_config(
    onlineEvaluationConfigName=ONLINE_EVAL_CONFIG_NAME,
    # Evaluate 100% of sessions; lower this in production to control cost
    rule={"samplingConfig": {"samplingPercentage": 100.0}},
    # Watch the agent's runtime CloudWatch log group for new OTel spans
    dataSourceConfig={
        "cloudWatchLogs": {
            "logGroupNames": [CW_LOG_GROUP],
            "serviceNames": [OTEL_SERVICE_NAME],
        }
    },
    # Code-based + builtin evaluators can be mixed freely
    evaluators=[
        {"evaluatorId": CODE_EVAL_IDS["HRResponseLength"]},
        {"evaluatorId": CODE_EVAL_IDS["HRFactChecker"]},
    ],
    evaluationExecutionRoleArn=ONLINE_EVAL_ROLE_ARN,
    # enableOnCreate=True activates the config immediately on creation
    enableOnCreate=True,
)

ONLINE_EVAL_CONFIG_ID = online_eval_resp["onlineEvaluationConfigId"]
ONLINE_EVAL_CONFIG_ARN = online_eval_resp.get("onlineEvaluationConfigArn", "")

print("Online eval config created:")
print(f"  ID  : {ONLINE_EVAL_CONFIG_ID}")
print(f"  ARN : {ONLINE_EVAL_CONFIG_ARN}")
print()
print("Evaluators are now LOCKED — they cannot be modified while this config is enabled.")
print("To update an evaluator: disable this config → update evaluator → re-enable.")
```

### Step 10c: Invoke Agent to Trigger Online Evaluation

Now we invoke the HR assistant with a few turns. Because the online evaluation config is active
and watching the runtime log group, AgentCore will automatically evaluate each session as OTel
spans arrive in CloudWatch — no explicit evaluation API call needed.

```python
# Invoke the agent to generate a fresh session that will be auto-evaluated online.
# We use two separate sessions to demonstrate per-session evaluation.
ONLINE_SESSION_IDS = [
    f"online-eval-{uuid.uuid4()}",
    f"online-eval-{uuid.uuid4()}",
]

ONLINE_SESSION_TURNS = [
    # Session 1: PTO balance + policy lookup
    [
        "What is the PTO balance for employee EMP-001?",
        "What is the company PTO policy?",
    ],
    # Session 2: pay stub + benefits
    [
        "Can you pull up the January 2026 pay stub for EMP-001?",
        "What health insurance options does the company offer?",
    ],
]

print("Invoking agent sessions (these will be auto-evaluated online)...")
for session_id, turns in zip(ONLINE_SESSION_IDS, ONLINE_SESSION_TURNS):
    print(f"\n  Session: {session_id}")
    for prompt in turns:
        print(f"    > {prompt}")
        reply = invoke_agent_simple(prompt, session_id)
        print(f"    < {reply[:100]}...")

print("\nBoth sessions invoked.")
print("AgentCore will automatically evaluate them as spans arrive in CloudWatch.")
print("Waiting 120s for CloudWatch ingestion + evaluation processing...")
time.sleep(120)
print("Ready to check online evaluation results.")
```

### Step 10d: Retrieve and Display Online Evaluation Results

Online evaluation results are written to CloudWatch Logs in the evaluations results log group.
We query the log group for evaluation events for our sessions and display the scores.

```python
# Online evaluation results log group is in the same region as the evaluation config
# (which is REGION = EVAL_REGION after alignment in the agent-clients cell).
logs_client = boto3.client("logs", region_name=REGION)

ONLINE_EVAL_RESULTS_LOG_GROUP = "/aws/bedrock-agentcore/evaluations/online-evaluations/results/default"

look_back_ms = int(time.time() * 1000) - (30 * 60 * 1000)  # last 30 minutes

print(f"Querying online eval results from: {ONLINE_EVAL_RESULTS_LOG_GROUP}")
print(f"Filtering for session IDs: {[s[:20] + '...' for s in ONLINE_SESSION_IDS]}\n")

online_results = []
try:
    paginator = logs_client.get_paginator("filter_log_events")
    for page in paginator.paginate(
        logGroupName=ONLINE_EVAL_RESULTS_LOG_GROUP,
        startTime=look_back_ms,
    ):
        for event in page.get("events", []):
            try:
                log_entry = json.loads(event["message"])
            except (json.JSONDecodeError, TypeError):
                continue

            attrs = log_entry.get("attributes", log_entry)
            session_id = attrs.get("session.id", "")

            if not any(sid == session_id for sid in ONLINE_SESSION_IDS):
                continue

            online_results.append(
                {
                    "session_id": session_id,
                    "evaluator_name": attrs.get("gen_ai.evaluation.name", ""),
                    "score": attrs.get("gen_ai.evaluation.score.value"),
                    "label": attrs.get("gen_ai.evaluation.score.label", ""),
                    "explanation": (attrs.get("gen_ai.evaluation.explanation") or "")[:120],
                }
            )

except logs_client.exceptions.ResourceNotFoundException:
    print(f"Note: Log group '{ONLINE_EVAL_RESULTS_LOG_GROUP}' not found yet.")
    print("This is normal if no sessions have been evaluated yet.")
    print("Results will appear here after AgentCore processes the first session.")

print(f"Found {len(online_results)} online evaluation result event(s).")
```

```python
# Display online evaluation results as a markdown table
name_by_id = {v: k for k, v in CODE_EVAL_IDS.items()}

if online_results:
    rows = [
        "| Session (truncated) | Evaluator | Score | Label | Explanation |",
        "|---|---|---|---|---|",
    ]
    for r in online_results:
        short_session = r["session_id"][:30] + "..."
        evaluator = r["evaluator_name"] or "(unknown)"
        score = str(r["score"]) if r["score"] is not None else "N/A"
        label = r["label"] or ""
        explanation = r["explanation"].replace("\n", " ")
        rows.append(f"| `{short_session}` | **{evaluator}** | {score} | {label} | {explanation} |")
    display(Markdown("### Online Evaluation Results\n\n" + "\n".join(rows)))
else:
    display(
        Markdown("""### Online Evaluation Results

> **No results yet.** Online evaluation is asynchronous — AgentCore may still be processing the
> sessions. Try re-running this cell after another 60–120 seconds.
>
> You can also check the AgentCore console or run the query below to inspect the results log group
> directly once events arrive.
""")
    )
    print(f"Log group to monitor: {ONLINE_EVAL_RESULTS_LOG_GROUP}")
    print(f"Session IDs invoked  : {ONLINE_SESSION_IDS}")
```

## Step 11: Cleanup

Delete created resources to avoid ongoing charges.

```python
# Uncomment to clean up resources

# # Disable and delete online evaluation config (must disable before deleting locked evaluators)
# try:
#     cp_client.update_online_evaluation_config(
#         onlineEvaluationConfigId=ONLINE_EVAL_CONFIG_ID,
#         enableOnCreate=False,
#     )
#     print(f"Disabled online eval config: {ONLINE_EVAL_CONFIG_ID}")
# except Exception as e:
#     print(f"Could not disable online eval config: {e}")
#
# try:
#     cp_client.delete_online_evaluation_config(onlineEvaluationConfigId=ONLINE_EVAL_CONFIG_ID)
#     print(f"Deleted online eval config: {ONLINE_EVAL_CONFIG_ID}")
# except Exception as e:
#     print(f"Could not delete online eval config: {e}")

# # Delete Lambda functions
# for fn in ["hr-response-length", "hr-fact-checker"]:
#     try:
#         lambda_client.delete_function(FunctionName=fn)
#         print(f"Deleted Lambda: {fn}")
#     except Exception as e:
#         print(f"Could not delete {fn}: {e}")

# # Delete evaluator records (only possible after online eval config is deleted/disabled)
# for name, eid in CODE_EVAL_IDS.items():
#     try:
#         cp_client.delete_evaluator(evaluatorId=eid)
#         print(f"Deleted evaluator: {name} ({eid})")
#     except Exception as e:
#         print(f"Could not delete evaluator {name}: {e}")

# # Delete agent runtime (only if deployed in this notebook)
# if not _agent_loaded:
#     agentcore_control_deploy = boto3.client("bedrock-agentcore-control", region_name=REGION)
#     agentcore_control_deploy.delete_agent_runtime(agentRuntimeId=AGENT_ID)
#     print(f"Deleted agent runtime: {AGENT_ID}")

print("Cleanup skipped. Uncomment the cells above to delete resources.")
```

## Summary

You've created two Lambda-backed code-based evaluators and run them in three ways:

**Step 7 — On-Demand Evaluation (`EvaluationClient`)**: evaluated a specific production session
with a mix of builtin LLM evaluators and code-based evaluators.

**Step 8 — `OnDemandEvaluationDatasetRunner`**: automatically invoked the agent across a dataset
and scored each scenario with the full mixed evaluator set.

**Step 10 — Online Evaluation (`create_online_evaluation_config`)**: deployed a continuous
evaluation config that automatically scores every live session as OTel spans arrive in CloudWatch.
No per-session API calls needed.

| Evaluator | Type | Level | Used in |
|---|---|---|---|
| `Builtin.Correctness` | LLM | TRACE | On-demand (Steps 7 & 8) |
| `Builtin.Helpfulness` | LLM | TRACE | On-demand (Step 8) |
| `Builtin.ResponseRelevance` | LLM | TRACE | On-demand (Step 8) |
| `HRResponseLength` | Code | TRACE | On-demand **and** Online (Steps 7, 8, 10) |
| `HRFactChecker` | Code | SESSION | On-demand **and** Online (Steps 7, 8, 10) |

### When to use code-based evaluators

- **Exact data validation**: Check that specific numbers, IDs, or codes appear in responses
- **Format compliance**: Validate response structure, length, or formatting constraints
- **Business rule enforcement**: Encode domain-specific rules that LLMs might misinterpret
- **High-volume evaluation**: Reduce cost for evaluations that run on every production session
- **Regulatory requirements**: Ensure certain disclosures or disclaimers are always present
- **Continuous monitoring**: Combine with online evaluation for zero-touch production quality gates

### On-demand vs. online evaluation summary

| Dimension | On-demand | Online |
|---|---|---|
| Trigger | Explicit per session | Automatic on every invocation |
| Setup | `EvaluationClient.run()` or `OnDemandEvaluationDatasetRunner` | `create_online_evaluation_config` once |
| Code-based evaluators | ✅ Supported | ✅ Supported |
| Evaluator locking | No | Yes — while config is enabled |
| Best for | CI/CD, ad-hoc debugging | Continuous production monitoring |

### Next steps

- Combine code-based evaluators with `EvaluationClient` to evaluate specific production sessions
- Add code-based evaluators to your CI/CD pipeline for automated regression testing
- Use online evaluation with a lower sampling rate (e.g. 10%) to cost-effectively monitor high-traffic agents
- Extend `HRFactChecker` with additional business rules as your agent evolves
