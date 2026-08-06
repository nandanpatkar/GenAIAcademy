# AgentCore Optimization Tutorial — HR Assistant

This notebook demonstrates the full **AgentCore Optimization** workflow using an HR Assistant agent:

1. **Deploy** the HR Assistant to AgentCore Runtime
2. **Evaluate** baseline performance with batch evaluations
3. **Recommend** improvements for system prompt and tool descriptions
4. **Bundle** configurations of model ID, system prompt and tool descriptions with Configuration Bundles
5. **A/B Test** — config-bundle routing: compare original vs. new configuration bundle.
6. **A/B Test** — target-based routing: compare 2 agent endpoints
7. **Clean up** all created resources

**Run All Cells** from top to bottom. Each section builds on the previous one.

---

## Prerequisites

- AWS account with Bedrock AgentCore access enabled
- AWS credentials configured (`aws configure` or environment variables)
- IAM permissions: `bedrock-agentcore:*`, `bedrock:InvokeModel`, `iam:*`, `s3:*`, `logs:*`, `xray:*`, `ecr:*`
- Docker running locally (for building the agent container)
- Python 3.10+ with the packages installed in Step 0

> **Note:** CloudWatch ingestion takes 2–3 minutes after invoking the agent. Batch evaluations take 1–5 minutes. Recommendations take 2–5 minutes. Budget ~45 minutes for the full notebook.

## Step 0: Install Dependencies

```python
# Install required packages
# bedrock-agentcore: Python SDK for runtime invocation, evaluations, recommendations, A/B tests
# boto3: AWS SDK (v1.43+ includes public AgentCore APIs)
# requests + botocore: for SigV4-signed gateway invocations
import subprocess
import sys

subprocess.run(
    [
        sys.executable,
        "-m",
        "pip",
        "install",
        "bedrock-agentcore>=1.7.0",
        "boto3>=1.43.0",
        "requests",
        "--quiet",
    ],
    check=True,
)
print("Dependencies installed.")
```

## Step 1: Configuration

Set your region and a unique suffix. The suffix prevents name collisions if you re-run the notebook.

```python
import boto3
import json
import uuid
import time
import subprocess
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

# ── Configuration ─────────────────────────────────────────────────────────
REGION = "us-east-1"  # Change to your preferred region
SUFFIX = uuid.uuid4().hex[:6]  # Unique suffix to avoid name collisions

# Runtime names use the suffix to allow multiple notebook runs
V1_NAME = f"HRAssistV1{SUFFIX}"
V2_NAME = f"HRAssistV2{SUFFIX}"

# Auto-detect account
sts = boto3.client("sts", region_name=REGION)
ACCOUNT_ID = sts.get_caller_identity()["Account"]

# ── boto3 Clients ──────────────────────────────────────────────────────────
# Control plane: gateway, runtime, config bundles, online eval config
ctrl = boto3.client("bedrock-agentcore-control", region_name=REGION)
# Data plane: invoke agent, batch eval, recommendations, A/B tests
dp = boto3.client("bedrock-agentcore", region_name=REGION)
# Supporting services
iam = boto3.client("iam", region_name=REGION)
s3 = boto3.client("s3", region_name=REGION)
logs = boto3.client("logs", region_name=REGION)
xray = boto3.client("xray", region_name=REGION)

print(f"ACCOUNT_ID = {ACCOUNT_ID}")
print(f"REGION     = {REGION}")
print(f"SUFFIX     = {SUFFIX}")
print(f"V1_NAME    = {V1_NAME}")
print(f"V2_NAME    = {V2_NAME}")
```

## Step 2: Deploy HR Assistant (v1)

The `deploy_agent.py` script:
1. Creates an IAM execution role
2. Packages `hr_assistant_agent.py` with ARM64 dependencies
3. Uploads to S3
4. Creates an AgentCore Runtime and polls until `ACTIVE`
5. Saves state to `agent_state_{name}.json`

**IAM role setup:**
The permissions policy grants `bedrock-agentcore:*` (covers gateway, config bundle, and online eval reads needed by the A/B test service) plus the CloudWatch Logs actions required for score aggregation: `DescribeLogGroups`, `DescribeIndexPolicies`, `PutIndexPolicy`, `StartQuery`, `GetQueryResults`, `StopQuery`, `FilterLogEvents`, and `GetLogEvents`.

This typically takes **3–5 minutes** while the service builds the container image.

```python
# Deploy HR Assistant v1 (baseline agent)
result = subprocess.run(
    [
        sys.executable,
        "deploy_agent.py",
        "--name",
        V1_NAME,
        "--region",
        REGION,
        "--version",
        "v1",
    ],
    capture_output=False,  # Stream output to notebook
    text=True,
)
if result.returncode != 0:
    raise RuntimeError(f"deploy_agent.py failed with exit code {result.returncode}")
```

```python
# Load the deployed state
v1_state = json.loads(Path(f"agent_state_{V1_NAME}.json").read_text())

AGENT_ARN = v1_state["runtime_arn"]
AGENT_ID = v1_state["runtime_id"]
LOG_GROUP = v1_state["log_group"]
SERVICE_NAME = v1_state["service_name"]
ROLE_ARN = v1_state["role_arn"]
ROLE_NAME = v1_state["role_name"]
S3_BUCKET = v1_state["s3_bucket"]

# OTel spans also land in the shared 'aws/spans' log group
SPANS_LOG_GROUP = "aws/spans"

LOG_GROUP_ARN = f"arn:aws:logs:{REGION}:{ACCOUNT_ID}:log-group:{LOG_GROUP}"
SPANS_LOG_ARN = f"arn:aws:logs:{REGION}:{ACCOUNT_ID}:log-group:{SPANS_LOG_GROUP}"

print(f"Agent ARN    : {AGENT_ARN}")
print(f"Log Group    : {LOG_GROUP}")
print(f"Service Name : {SERVICE_NAME}")
```

## Step 3: Create Baseline Configuration Bundle & Send Traffic

A **Configuration Bundle** is a versioned container for agent configuration, keyed by the runtime ARN. The agent reads `system_prompt` (and other keys such as `tool_descriptions`) from the bundle at invocation time — no redeployment needed.

Each bundle call returns a `bundleId` (stable identifier) and a `versionId` (immutable snapshot). Use `commitMessage` to document what changed, just like a Git commit.

We create a **baseline bundle** with the current system prompt and tool descriptions, then send 10 representative HR sessions. These traces feed baseline evaluation and recommendations in later steps.

```python
CURRENT_SYSTEM_PROMPT = """You are a helpful HR Assistant for Acme Corp.

You help employees with:
- Checking PTO (paid time off) balances
- Submitting PTO requests
- Looking up HR policies (PTO, remote work, parental leave, code of conduct)
- Understanding employee benefits (health, dental, vision, 401k, life insurance)
- Retrieving pay stub information

Always use the available tools to answer questions accurately. Do not make up
policy details, benefit amounts, or pay information — look them up.
Be concise, professional, and friendly."""

CURRENT_TOOL_DESCRIPTIONS = {
    "get_pto_balance": "Return the current PTO balance for an employee.",
    "submit_pto_request": "Submit a PTO request for an employee.",
    "lookup_hr_policy": "Look up a company HR policy document by topic.",
    "get_benefits_summary": "Return a summary of a specific employee benefit.",
    "get_pay_stub": "Retrieve a pay stub for an employee for a specific pay period.",
}

# Create the baseline Configuration Bundle.
# commitMessage documents what this version contains, like a Git commit.
baseline_resp = ctrl.create_configuration_bundle(
    bundleName=f"HRBaseline{SUFFIX}",
    description="HR Assistant baseline configuration",
    components={
        AGENT_ARN: {
            "configuration": {
                "system_prompt": CURRENT_SYSTEM_PROMPT,
                "tool_descriptions": CURRENT_TOOL_DESCRIPTIONS,
            }
        }
    },
    commitMessage="Initial configuration — baseline system prompt and tool descriptions",
    clientToken=str(uuid.uuid4()),
)
BASELINE_BUNDLE_ARN = baseline_resp["bundleArn"]
BASELINE_BUNDLE_VERSION = baseline_resp["versionId"]
BASELINE_BUNDLE_ID = baseline_resp["bundleId"]

baseline_baggage = (
    f"aws.agentcore.configbundle_arn={BASELINE_BUNDLE_ARN},aws.agentcore.configbundle_version={BASELINE_BUNDLE_VERSION}"
)

print(f"Baseline bundle ID : {BASELINE_BUNDLE_ID}")
print(f"Version            : {BASELINE_BUNDLE_VERSION}")
```

```python
# Representative HR scenarios for baseline traffic
BASELINE_PROMPTS = [
    ("EMP-001", "What is my current PTO balance?"),
    (
        "EMP-001",
        "Please submit a PTO request for me from 2026-06-01 to 2026-06-05 for a family vacation.",
    ),
    ("EMP-001", "Can you pull up my January 2026 pay stub?"),
    ("EMP-002", "How many PTO days do I have left? I only joined recently."),
    ("EMP-042", "What's the company policy on working from home?"),
    (
        "EMP-001",
        "What are my health insurance options and how much does the company cover?",
    ),
    ("EMP-042", "Tell me about the 401k plan — how much does the company match?"),
    ("EMP-001", "What is the parental leave policy for primary caregivers?"),
    (
        "EMP-002",
        "I want to request time off from 2026-07-14 to 2026-07-18 for a medical procedure.",
    ),
    (
        "EMP-042",
        "Can you show me my December 2025 pay stub and explain the deductions?",
    ),
]

baseline_session_ids = []
for emp_id, prompt in BASELINE_PROMPTS:
    session_id = str(uuid.uuid4())
    baseline_session_ids.append(session_id)
    full_prompt = f"Employee ID: {emp_id}. {prompt}"
    resp = dp.invoke_agent_runtime(
        agentRuntimeArn=AGENT_ARN,
        runtimeSessionId=session_id,
        payload=json.dumps({"prompt": full_prompt}).encode(),
        baggage=baseline_baggage,
    )
    response_text = resp["response"].read().decode("utf-8")
    print(f"Session {session_id[:8]}... [{emp_id}] {prompt[:55]}")

print(f"\nSent {len(baseline_session_ids)} baseline sessions.")
print("Waiting 3 minutes for CloudWatch ingestion...")
for remaining in range(180, 0, -30):
    print(f"  {remaining}s remaining...")
    time.sleep(30)
print("CloudWatch ingestion complete.")
```

## Step 4: Baseline Batch Evaluation

**Batch evaluation** measures how well your agent performs today. It discovers sessions from CloudWatch, runs each through built-in LLM evaluators, and returns aggregate scores.

| Evaluator | What it measures |
|-----------|------------------|
| **GoalSuccessRate** | Did the agent complete the user's goal? |
| **Helpfulness** | Was the response useful and actionable? |
| **Correctness** | Did the agent give accurate information? |

These scores become the **baseline** to beat during A/B testing.

```python
# Start baseline batch evaluation
# Public API: batchEvaluationName, evaluators (top-level), dataSourceConfig
eval_resp = dp.start_batch_evaluation(
    batchEvaluationName=f"HRBaseline{SUFFIX}",
    evaluators=[
        {"evaluatorId": "Builtin.GoalSuccessRate"},
        {"evaluatorId": "Builtin.Helpfulness"},
        {"evaluatorId": "Builtin.Correctness"},
    ],
    dataSourceConfig={
        "cloudWatchLogs": {
            "serviceNames": [SERVICE_NAME],
            "logGroupNames": [SPANS_LOG_GROUP, LOG_GROUP],
            "filterConfig": {"sessionIds": baseline_session_ids},
        }
    },
    clientToken=str(uuid.uuid4()),
)
BASELINE_EVAL_ID = eval_resp["batchEvaluationId"]
print(f"Started batch evaluation: {BASELINE_EVAL_ID}")
print("Polling for completion (typically 2–5 minutes)...")
```

```python
# Poll until terminal state
TERMINAL = {"COMPLETED", "FAILED", "STOPPED", "COMPLETED_WITH_ERRORS"}
while True:
    result = dp.get_batch_evaluation(batchEvaluationId=BASELINE_EVAL_ID)
    status = result["status"]
    print(f"  Status: {status}")
    if status in TERMINAL:
        break
    time.sleep(30)

# Try API response first, fall back to CloudWatch
baseline_scores = {}
er = result.get("evaluationResults", {})
for s in er.get("evaluatorSummaries", []):
    avg = s.get("statistics", {}).get("averageScore")
    if avg is not None:
        baseline_scores[s["evaluatorId"]] = avg

if not baseline_scores:
    print("  Reading scores from CloudWatch...")
    baseline_scores = fetch_eval_scores(BASELINE_EVAL_ID)

print(f"\n{'Evaluator':<35} {'Score':>8}")
print("-" * 45)
for eid, score in sorted(baseline_scores.items()):
    print(f"{eid:<35} {score:>8.4f}")
print("\nBaseline scores saved.")
```

## Step 5: Optimization Recommendations

AgentCore analyzes your production traces and generates improved versions of your agent's configuration. Two types are available:

- **System Prompt Recommendation**: rewrites your system prompt to improve a target metric
- **Tool Description Recommendation**: improves tool descriptions so the agent picks the right tool more often

### 5a: System Prompt Recommendation

```python
now = datetime.now(timezone.utc)
start_dt = now - timedelta(days=7)

sp_rec_resp = dp.start_recommendation(
    name=f"HRSpRec{SUFFIX}",
    type="SYSTEM_PROMPT_RECOMMENDATION",
    recommendationConfig={
        "systemPromptRecommendationConfig": {
            "systemPrompt": {"text": CURRENT_SYSTEM_PROMPT},
            "agentTraces": {
                "cloudwatchLogs": {
                    "logGroupArns": [LOG_GROUP_ARN],
                    "serviceNames": [SERVICE_NAME],
                    "startTime": start_dt,
                    "endTime": now,
                }
            },
            "evaluationConfig": {
                "evaluators": [{"evaluatorArn": "arn:aws:bedrock-agentcore:::evaluator/Builtin.GoalSuccessRate"}]
            },
        }
    },
    clientToken=str(uuid.uuid4()),
)
SP_REC_ID = sp_rec_resp["recommendationId"]
print(f"Started system prompt recommendation: {SP_REC_ID}")
print("Polling (typically 2–5 minutes)...")
```

```python
REC_TERMINAL = {"COMPLETED", "FAILED"}
while True:
    sp_result = dp.get_recommendation(recommendationId=SP_REC_ID)
    status = sp_result["status"]
    print(f"  Status: {status}")
    if status in REC_TERMINAL:
        break
    time.sleep(30)

rec = sp_result.get("recommendationResult", {})
sp_rec_result = rec.get("systemPromptRecommendationResult", {})
RECOMMENDED_SYSTEM_PROMPT = sp_rec_result.get("recommendedSystemPrompt") or CURRENT_SYSTEM_PROMPT

if sp_rec_result.get("errorCode"):
    print(f"Recommendation error ({sp_rec_result['errorCode']}): {sp_rec_result.get('errorMessage', '')[:200]}")
    print("Falling back to current system prompt.")

print("\n" + "=" * 60)
print("RECOMMENDED SYSTEM PROMPT")
print("=" * 60)
print(RECOMMENDED_SYSTEM_PROMPT)
```

### 5b: Tool Description Recommendation

Tool description recommendations improve the descriptions of your agent's tools so the LLM picks the right tool more reliably. These improvements are displayed for review and can be applied to a future agent code update or stored in a Configuration Bundle.

```python
tools_list = [{"toolName": name, "toolDescription": {"text": desc}} for name, desc in CURRENT_TOOL_DESCRIPTIONS.items()]

td_rec_resp = dp.start_recommendation(
    name=f"HRTdRec{SUFFIX}",
    type="TOOL_DESCRIPTION_RECOMMENDATION",
    recommendationConfig={
        "toolDescriptionRecommendationConfig": {
            "toolDescription": {"toolDescriptionText": {"tools": tools_list}},
            "agentTraces": {
                "cloudwatchLogs": {
                    "logGroupArns": [LOG_GROUP_ARN],
                    "serviceNames": [SERVICE_NAME],
                    "startTime": start_dt,
                    "endTime": now,
                }
            },
        }
    },
    clientToken=str(uuid.uuid4()),
)
TD_REC_ID = td_rec_resp["recommendationId"]
print(f"Started tool description recommendation: {TD_REC_ID}")
print("Polling (typically 2–5 minutes)...")
```

```python
while True:
    td_result = dp.get_recommendation(recommendationId=TD_REC_ID)
    status = td_result["status"]
    print(f"  Status: {status}")
    if status in REC_TERMINAL:
        break
    time.sleep(30)

RECOMMENDED_TOOL_DESCRIPTIONS = dict(CURRENT_TOOL_DESCRIPTIONS)  # Default: unchanged

if status == "COMPLETED":
    td_rec_result = td_result.get("recommendationResult", {}).get("toolDescriptionRecommendationResult", {})
    returned_tools = td_rec_result.get("tools", [])
    tool_keys = list(CURRENT_TOOL_DESCRIPTIONS.keys())

    if td_rec_result.get("errorCode"):
        print(f"Recommendation error ({td_rec_result['errorCode']}): {td_rec_result.get('errorMessage', '')[:200]}")
        print("Using current tool descriptions.")
    elif returned_tools:
        print("\n" + "=" * 60)
        print("RECOMMENDED TOOL DESCRIPTIONS")
        print("=" * 60)
        for i, item in enumerate(returned_tools):
            new_desc = item.get("recommendedToolDescription", "")
            tool_name = item.get("toolName") or (tool_keys[i] if i < len(tool_keys) else f"tool_{i}")
            RECOMMENDED_TOOL_DESCRIPTIONS[tool_name] = new_desc
            print(f"\n[{tool_name}]")
            print(f"  Before: {CURRENT_TOOL_DESCRIPTIONS.get(tool_name, '(unknown)')}")
            print(f"  After : {new_desc}")
    else:
        print("No tool description recommendations returned. Using current descriptions.")
else:
    print(f"Tool description recommendation status: {status}. Using current descriptions.")
```

## Step 6: Configuration Bundles — Create, Update, Read, Compare

A **Configuration Bundle** is a versioned container for agent configuration keyed by runtime ARN. Every `create` or `update` call produces a new **immutable version** — you can always retrieve or roll back to any previous version.

### Bundle lifecycle

| Operation | API | When to use |
|-----------|-----|-------------|
| Create | `create_configuration_bundle` | First time; establishes `bundleId` |
| Update | `update_configuration_bundle` | After evaluation; pass `parentVersionIds` to record lineage |
| Read | `get_configuration_bundle` | Verify current config |
| Compare | `get_configuration_bundle_version` | Diff two versions |

Use `commitMessage` on every create and update to document *why* the config changed.

### Agent integration

The agent reads the bundle inside the invocation handler using `BedrockAgentCoreContext.get_config_bundle()`. The bundle is injected automatically from the baggage header set by the gateway or your client code:

```python
bundle = BedrockAgentCoreContext.get_config_bundle()
system_prompt = DEFAULT_SYSTEM_PROMPT
tool_descs = {}
if bundle:
    system_prompt = bundle.get("system_prompt", DEFAULT_SYSTEM_PROMPT)
    tool_descs = bundle.get("tool_descriptions", {})

agent.system_prompt = system_prompt
if tool_descs:
    for t in agent.tools:
        if t.tool_name in tool_descs:
            t.tool_spec["description"] = tool_descs[t.tool_name]
```

### What we create here

- **Control (C)** — original system prompt + original tool descriptions  
- **Treatment (T1)** — recommended system prompt + recommended tool descriptions  

After creation we read and compare them to verify the update took effect.

```python
# ── Step 6a: Create control bundle (original config) ──────────────────────
control_resp = ctrl.create_configuration_bundle(
    bundleName=f"HRControl{SUFFIX}",
    description="HR Assistant control variant — original system prompt and tool descriptions",
    components={
        AGENT_ARN: {
            "configuration": {
                "system_prompt": CURRENT_SYSTEM_PROMPT,
                "tool_descriptions": CURRENT_TOOL_DESCRIPTIONS,
            }
        }
    },
    commitMessage="Control: original system prompt and tool descriptions (v1 baseline)",
    clientToken=str(uuid.uuid4()),
)
CONTROL_BUNDLE_ARN = control_resp["bundleArn"]
CONTROL_BUNDLE_VERSION = control_resp["versionId"]
CONTROL_BUNDLE_ID = control_resp["bundleId"]
print(f"Control bundle ID      : {CONTROL_BUNDLE_ID}")
print(f"Control bundle version : {CONTROL_BUNDLE_VERSION}")

# ── Step 6b: Create treatment bundle (config containing nre recommended system prompt and tool descriptions) ──────────────────
treatment_resp = ctrl.create_configuration_bundle(
    bundleName=f"HRTreatment{SUFFIX}",
    description="HR Assistant treatment variant — recommended system prompt and tool descriptions",
    components={
        AGENT_ARN: {
            "configuration": {
                "system_prompt": RECOMMENDED_SYSTEM_PROMPT,
                "tool_descriptions": RECOMMENDED_TOOL_DESCRIPTIONS,
            }
        }
    },
    commitMessage="Treatment: AI-recommended system prompt + improved tool descriptions from Step 5",
    clientToken=str(uuid.uuid4()),
)
TREATMENT_BUNDLE_ARN = treatment_resp["bundleArn"]
TREATMENT_BUNDLE_VERSION = treatment_resp["versionId"]
TREATMENT_BUNDLE_ID = treatment_resp["bundleId"]
print(f"\nTreatment bundle ID      : {TREATMENT_BUNDLE_ID}")
print(f"Treatment bundle version : {TREATMENT_BUNDLE_VERSION}")
```

### 6c: Read the Bundle

Retrieve the current configuration to verify it was stored correctly. `get_configuration_bundle` always returns the **latest** version.

```python
# ── Step 6c: Read the treatment bundle ────────────────────────────────────
read_resp = ctrl.get_configuration_bundle(bundleId=TREATMENT_BUNDLE_ID)
config = read_resp["components"][AGENT_ARN]["configuration"]

print(f"Bundle ID  : {read_resp['bundleId']}")
print(f"Version    : {read_resp['versionId']}")
print("\nSystem prompt (first 200 chars):")
print(f"  {config['system_prompt'][:200]}...")
print(f"\nTool descriptions ({len(config.get('tool_descriptions', {}))} tools):")
for tool_name, desc in config.get("tool_descriptions", {}).items():
    print(f"  [{tool_name}] {desc[:100]}")
```

### 6d: Compare Versions

`get_configuration_bundle_version` retrieves any specific version by ID. We compare the control (original) and treatment (recommended) versions to confirm exactly what changed — useful for audits and rollback decisions.

```python
# ── Step 6d: Compare control vs treatment versions ────────────────────────
# Fetch both versions by their specific versionId
v_control = ctrl.get_configuration_bundle_version(bundleId=CONTROL_BUNDLE_ID, versionId=CONTROL_BUNDLE_VERSION)
v_treatment = ctrl.get_configuration_bundle_version(bundleId=TREATMENT_BUNDLE_ID, versionId=TREATMENT_BUNDLE_VERSION)

cfg_c = v_control["components"][AGENT_ARN]["configuration"]
cfg_t = v_treatment["components"][AGENT_ARN]["configuration"]

print("=" * 60)
print("CONTROL vs TREATMENT — Configuration Diff")
print("=" * 60)

all_keys = sorted(set(cfg_c.keys()) | set(cfg_t.keys()))
for key in all_keys:
    val_c = cfg_c.get(key)
    val_t = cfg_t.get(key)
    if val_c == val_t:
        continue  # unchanged

    print(f"\n[{key}]")
    if isinstance(val_c, dict) and isinstance(val_t, dict):
        # Show per-tool diffs for tool_descriptions
        for tool in sorted(set(val_c) | set(val_t)):
            if val_c.get(tool) != val_t.get(tool):
                print(f"  Tool: {tool}")
                print(f"    Before: {str(val_c.get(tool, '(missing)'))[:120]}")
                print(f"    After : {str(val_t.get(tool, '(missing)'))[:120]}")
    else:
        c_str = str(val_c or "")
        t_str = str(val_t or "")
        print(f"  Before ({len(c_str)} chars): {c_str[:200]}")
        print(f"  After  ({len(t_str)} chars): {t_str[:200]}")

print("\nDiff complete.")
print(f"\nControl   commitMessage: {v_control.get('commitMessage', 'n/a')}")
print(f"Treatment commitMessage: {v_treatment.get('commitMessage', 'n/a')}")
```

## Step 7: A/B Testing — Configuration Bundle Routing

Use configuration bundle routing when the change you are testing is purely configuration — a different system prompt, a different model ID, or different tool descriptions. Both variants run on the same runtime with different configuration bundle versions. The gateway injects the correct bundle reference into each request via W3C baggage headers, and the agent reads it at runtime. This means you deploy **one runtime** and **one online evaluation config**.

If the change involves code changes, a framework upgrade, or an entirely different agent implementation, use target-based routing (Step 8) instead, which sends traffic to two separate runtimes.

**Architecture:**
```
User Request
     │
     ▼
[Gateway] ──50%──▶ [Control Bundle C]   ──┐
     │                                     ├──▶ [HR Runtime v1] ──▶ CloudWatch
     └──50%──▶ [Treatment Bundle T1] ──────┘                            │
                                                   [Online Eval Config] ◀┘
                                                           │
                                                   [A/B Test Results]
```

Session assignment is **sticky**: once a session ID is assigned to a variant, all subsequent requests with that same session ID route to the same variant. This ensures a consistent experience within a session while still distributing new sessions across variants according to your traffic weights.

### 7a: Create Gateway

```python
# Create HTTP gateway with IAM authorizer
# The gateway intercepts requests and injects the configuration bundle via baggage headers
gw_resp = ctrl.create_gateway(
    name=f"HRGateway{SUFFIX}",
    description="HR Assistant A/B test gateway",
    authorizerType="AWS_IAM",
    roleArn=ROLE_ARN,
    clientToken=str(uuid.uuid4()),
)
GATEWAY_ID = gw_resp["gatewayId"]
print(f"Gateway created: {GATEWAY_ID}. Polling for READY...")

for i in range(30):
    gw = ctrl.get_gateway(gatewayIdentifier=GATEWAY_ID)
    gw_status = gw.get("status", "")
    if gw_status == "READY":
        break
    print(f"  Poll {i + 1}: {gw_status}")
    time.sleep(5)

GATEWAY_ARN = gw.get("gatewayArn") or f"arn:aws:bedrock-agentcore:{REGION}:{ACCOUNT_ID}:gateway/{GATEWAY_ID}"
GATEWAY_URL = gw.get("gatewayUrl") or f"https://{GATEWAY_ID}.gateway.bedrock-agentcore.{REGION}.amazonaws.com"

print(f"\nGATEWAY_ID  = {GATEWAY_ID}")
print(f"GATEWAY_ARN = {GATEWAY_ARN}")
print(f"GATEWAY_URL = {GATEWAY_URL}")
```

```python
# Create gateway target pointing to v1 agent runtime (HTTP target)
TARGET_NAME = "HRAgentV1"
tgt_resp = ctrl.create_gateway_target(
    gatewayIdentifier=GATEWAY_ID,
    name=TARGET_NAME,
    description="HR Assistant v1 runtime target",
    targetConfiguration={
        "http": {
            "agentcoreRuntime": {
                "arn": AGENT_ARN,
                "qualifier": "DEFAULT",
            }
        }
    },
    credentialProviderConfigurations=[{"credentialProviderType": "GATEWAY_IAM_ROLE"}],
    clientToken=str(uuid.uuid4()),
)
TARGET_ID = tgt_resp["targetId"]
print(f"Target created: {TARGET_ID}. Polling for READY...")

for i in range(30):
    tgt = ctrl.get_gateway_target(gatewayIdentifier=GATEWAY_ID, targetId=TARGET_ID)
    tgt_status = tgt.get("status", "")
    if tgt_status == "READY":
        break
    print(f"  Poll {i + 1}: {tgt_status}")
    time.sleep(5)

print(f"TARGET_ID   = {TARGET_ID}")
print(f"TARGET_NAME = {TARGET_NAME}")
```

### 7b: Configure Gateway Tracing

The A/B test needs to know which session was assigned to which variant. This information comes from gateway spans in CloudWatch. We set X-Ray to send trace segments to CloudWatch Logs, then create a delivery pipeline from the gateway through X-Ray.

```python
# Ensure X-Ray sends trace segments to CloudWatch Logs
dest = xray.get_trace_segment_destination()
if dest.get("Destination") != "CloudWatchLogs":
    xray.update_trace_segment_destination(Destination="CloudWatchLogs")
    print("X-Ray trace destination set to CloudWatchLogs")
else:
    print("X-Ray trace destination already set to CloudWatchLogs")

# Create delivery source for gateway traces
DELIVERY_SOURCE_NAME = f"hr-gw-traces-{SUFFIX}"
DELIVERY_ID = None
try:
    logs.put_delivery_source(
        name=DELIVERY_SOURCE_NAME,
        resourceArn=GATEWAY_ARN,
        logType="TRACES",
    )
    print(f"Delivery source created: {DELIVERY_SOURCE_NAME}")
except Exception as e:
    print(f"Delivery source: {e}")

# Find or create X-Ray delivery destination
destinations = logs.describe_delivery_destinations().get("deliveryDestinations", [])
xray_dest = next((d for d in destinations if d.get("deliveryDestinationType") == "XRAY"), None)
if not xray_dest:
    logs.put_delivery_destination(
        name="xray-destination",
        deliveryDestinationType="XRAY",
        deliveryDestinationConfiguration={
            "destinationResourceArn": f"arn:aws:xray:{REGION}:{ACCOUNT_ID}:group/Default"
        },
    )
    destinations = logs.describe_delivery_destinations().get("deliveryDestinations", [])
    xray_dest = next((d for d in destinations if d.get("deliveryDestinationType") == "XRAY"), None)

XRAY_DEST_ARN = xray_dest["arn"]
print(f"X-Ray delivery destination: {XRAY_DEST_ARN}")

# Create delivery (source → destination)
try:
    delivery = logs.create_delivery(
        deliverySourceName=DELIVERY_SOURCE_NAME,
        deliveryDestinationArn=XRAY_DEST_ARN,
    )
    DELIVERY_ID = delivery["delivery"]["id"]
    print(f"Delivery created: {DELIVERY_ID}")
except Exception as e:
    print(f"Delivery: {e}")
    # Find existing delivery for this source
    for d in logs.describe_deliveries().get("deliveries", []):
        if d.get("deliverySourceName") == DELIVERY_SOURCE_NAME:
            DELIVERY_ID = d.get("id")
            print(f"Found existing delivery: {DELIVERY_ID}")
            break

print("Gateway tracing configured.")
```

### 7c: Create Online Evaluation Config

The **online evaluation config** automatically scores every session that passes through the gateway, without requiring explicit API calls per session. It monitors the agent's CloudWatch log group, detects when a session closes (after `sessionTimeoutMinutes` of inactivity), and runs the configured evaluators.

```python
# Online evaluation config: auto-evaluate every session
# Bundle names must be alphanumeric + underscores only (no hyphens)
online_eval_resp = ctrl.create_online_evaluation_config(
    onlineEvaluationConfigName=f"HROnlineEval{SUFFIX}",
    description="HR Assistant online evaluation for A/B testing",
    dataSourceConfig={
        "cloudWatchLogs": {
            "logGroupNames": [LOG_GROUP],
            "serviceNames": [SERVICE_NAME],
        }
    },
    evaluators=[
        {"evaluatorId": "Builtin.GoalSuccessRate"},
        {"evaluatorId": "Builtin.Helpfulness"},
    ],
    rule={
        "samplingConfig": {"samplingPercentage": 100.0},
        "sessionConfig": {"sessionTimeoutMinutes": 2},
    },
    evaluationExecutionRoleArn=ROLE_ARN,
    enableOnCreate=True,
    clientToken=str(uuid.uuid4()),
)
ONLINE_EVAL_ID = online_eval_resp["onlineEvaluationConfigId"]
ONLINE_EVAL_ARN = online_eval_resp["onlineEvaluationConfigArn"]
print(f"Online eval config: {ONLINE_EVAL_ID}")
print(f"ARN: {ONLINE_EVAL_ARN}")
```

### 7d: Create A/B Test (Config Bundle Routing)

The A/B test installs a routing rule on the gateway. Each incoming request is assigned to a variant based on the `X-Amzn-Bedrock-AgentCore-Runtime-Session-Id` header — if you don't provide one, the runtime generates it automatically. The gateway uses this session ID to assign the request to a variant based on the configured traffic weights:
- **C (Control, 50%)**: original system prompt via control bundle
- **T1 (Treatment, 50%)**: recommended system prompt via treatment bundle

The gateway automatically injects the appropriate Configuration Bundle into the request as a W3C baggage header. The agent's invocation handler reads it via `BedrockAgentCoreContext.get_config_bundle()` and applies the matching prompt and tool descriptions. Assignment is sticky within a session.

```python
# A/B test name: alphanumeric + underscores only (no hyphens)
abtest_resp = dp.create_ab_test(
    name=f"HRBundleAB{SUFFIX}",
    description="HR Assistant: compare original vs recommended system prompt",
    gatewayArn=GATEWAY_ARN,
    roleArn=ROLE_ARN,
    enableOnCreate=True,
    evaluationConfig={"onlineEvaluationConfigArn": ONLINE_EVAL_ARN},
    variants=[
        {
            "name": "C",
            "weight": 50,
            "variantConfiguration": {
                "configurationBundle": {
                    "bundleArn": CONTROL_BUNDLE_ARN,
                    "bundleVersion": CONTROL_BUNDLE_VERSION,
                }
            },
        },
        {
            "name": "T1",
            "weight": 50,
            "variantConfiguration": {
                "configurationBundle": {
                    "bundleArn": TREATMENT_BUNDLE_ARN,
                    "bundleVersion": TREATMENT_BUNDLE_VERSION,
                }
            },
        },
    ],
    clientToken=str(uuid.uuid4()),
)
ABTEST_BUNDLE_ID = abtest_resp["abTestId"]
print(f"A/B test created: {ABTEST_BUNDLE_ID}")
print("Polling for ACTIVE/RUNNING...")

for i in range(30):
    ab = dp.get_ab_test(abTestId=ABTEST_BUNDLE_ID)
    s, es = ab.get("status", ""), ab.get("executionStatus", "")
    print(f"  Poll {i + 1}: status={s}  executionStatus={es}")
    if s == "ACTIVE" and es == "RUNNING":
        break
    if "FAILED" in s:
        print(f"  Error: {ab.get('errorDetails')}")
        break
    time.sleep(5)

print("\nA/B test LIVE. Gateway is splitting traffic 50/50 between C and T1.")
```

### 7e: Send Traffic Through Gateway

Now we send traffic via the gateway URL (not directly to the runtime). The gateway assigns each session to a variant based on session ID, injects the corresponding bundle via baggage, and forwards the request to the runtime.

Requests are SigV4-signed using IAM credentials.

```python
import requests as http_requests
from botocore.auth import SigV4Auth
from botocore.awsrequest import AWSRequest

session = boto3.Session()
credentials = session.get_credentials().get_frozen_credentials()

# Gateway URL format: https://{gateway-id}.gateway.bedrock-agentcore.{region}.amazonaws.com/{target-name}/invocations
GW_INVOKE_URL = f"{GATEWAY_URL}/{TARGET_NAME}/invocations"

GW_PROMPTS = [
    "Employee ID: EMP-001. What is my current PTO balance?",
    "Employee ID: EMP-001. I need to request leave from 2026-08-04 to 2026-08-08 for a vacation.",
    "Employee ID: EMP-042. Can you explain our 401k matching policy?",
    "Employee ID: EMP-002. I only have a few days left. What exactly is the PTO rollover policy?",
    "Employee ID: EMP-001. Show me my January 2026 pay stub and explain the deductions.",
    "Employee ID: EMP-042. What are my health insurance options?",
    "Employee ID: EMP-001. What's the remote work policy at Acme?",
    "Employee ID: EMP-002. I need to take parental leave soon. How many weeks am I entitled to?",
    "Employee ID: EMP-042. Please submit a PTO request for 2026-09-01 to 2026-09-03 for personal reasons.",
    "Employee ID: EMP-001. How much life insurance does the company provide?",
    "Employee ID: EMP-001. Request time off from 2026-07-21 to 2026-07-25 for a family trip.",
    "Employee ID: EMP-042. What dental coverage do we have for major restorative work?",
    "Employee ID: EMP-002. I want to check my PTO balance before requesting leave.",
    "Employee ID: EMP-001. Can I work from home 4 days a week?",
    "Employee ID: EMP-042. What's the vision insurance allowance for contacts?",
    "Employee ID: EMP-001. Submit PTO for me: 2026-10-13 to 2026-10-14 for doctor appointments.",
    "Employee ID: EMP-002. Explain the 401k vesting schedule.",
    "Employee ID: EMP-042. What's the code of conduct policy around harassment?",
    "Employee ID: EMP-001. How much does the company contribute to health premiums for family coverage?",
    "Employee ID: EMP-042. Can you pull up my January 2026 pay stub?",
]

gw_session_ids = []
success, fail = 0, 0

for i, prompt in enumerate(GW_PROMPTS):
    sid = str(uuid.uuid4())
    gw_session_ids.append(sid)
    body = json.dumps({"prompt": prompt, "sessionId": sid})
    req = AWSRequest(
        method="POST",
        url=GW_INVOKE_URL,
        data=body,
        headers={
            "Content-Type": "application/json",
            "X-Amzn-Bedrock-AgentCore-Runtime-Session-Id": sid,
        },
    )
    SigV4Auth(credentials, "bedrock-agentcore", REGION).add_auth(req)
    try:
        resp = http_requests.post(GW_INVOKE_URL, data=body, headers=dict(req.headers), timeout=120)
        if resp.status_code == 200:
            print(f"  [{i + 1:2d}/{len(GW_PROMPTS)}] OK  {sid[:8]}...  {resp.text[:80]}...")
            success += 1
        else:
            print(f"  [{i + 1:2d}/{len(GW_PROMPTS)}] ERR status={resp.status_code}: {resp.text[:100]}")
            fail += 1
    except Exception as e:
        print(f"  [{i + 1:2d}/{len(GW_PROMPTS)}] ERR {e}")
        fail += 1
    time.sleep(1)

print(f"\nTraffic summary: success={success}, fail={fail}, total={len(GW_PROMPTS)}")
print("Waiting for online evaluation pipeline...")
```

### 7f: Monitor A/B Test Results

Results become available after three stages:
1. **Session timeout** (2 min): evaluator waits for session inactivity before scoring
2. **Evaluation** (2–3 min): each session is scored by the online evaluator
3. **Aggregation** (~5 min cycle): gateway spans are joined with scores to compute per-variant means

Budget 10–15 minutes from your last request. Poll until `analysisTimestamp` is populated.

```python
print("Polling for A/B test results (up to 20 minutes)...\n")
bundle_ab_results = None

for poll in range(25):
    ab = dp.get_ab_test(abTestId=ABTEST_BUNDLE_ID)
    results = ab.get("results", {})
    metrics = results.get("evaluatorMetrics", [])
    print(f"--- Poll {poll + 1}/25 -- {time.strftime('%H:%M:%S')} ---")
    print(f"  analysisTimestamp: {results.get('analysisTimestamp', 'none')}")

    for m in metrics:
        name = m.get("evaluatorArn", "").split("/")[-1]
        cs = m.get("controlStats", {})
        print(f"  Evaluator: {name}")
        print(f"    Control (C):   mean={cs.get('mean', '-')}  n={cs.get('sampleSize', '-')}")
        for vr in m.get("variantResults", []):
            # Prefer API-provided percentChange; fall back to manual calculation
            pct_change = vr.get("percentChange")
            if pct_change is None:
                cs_mean, vr_mean = cs.get("mean"), vr.get("mean")
                if cs_mean and vr_mean and float(cs_mean) != 0:
                    pct_change = (float(vr_mean) - float(cs_mean)) / float(cs_mean) * 100
            delta = f"  change={pct_change:+.1f}%" if pct_change is not None else ""
            print(
                f"    Treatment (T1): mean={vr.get('mean', '-')}  n={vr.get('sampleSize', '-')}  "
                f"p={vr.get('pValue', 'N/A')}  significant={vr.get('isSignificant', '-')}{delta}"
            )

    if results.get("analysisTimestamp") and metrics:
        bundle_ab_results = results
        print("\nResults are available!")
        break
    print()
    time.sleep(60)

if bundle_ab_results:
    print("\n" + "=" * 60)
    print("A/B TEST INTERPRETATION")
    print("=" * 60)
    for m in bundle_ab_results.get("evaluatorMetrics", []):
        name = m.get("evaluatorArn", "").split("/")[-1]
        cs_mean = m.get("controlStats", {}).get("mean")
        for vr in m.get("variantResults", []):
            sig = vr.get("isSignificant")
            t1_mean = vr.get("mean")
            p_value = vr.get("pValue", "N/A")
            pct_change = vr.get("percentChange")
            if pct_change is None and cs_mean and t1_mean and float(cs_mean) != 0:
                pct_change = (float(t1_mean) - float(cs_mean)) / float(cs_mean) * 100
            pct_str = f"{pct_change:+.1f}%" if pct_change is not None else "N/A"
            print(f"\n  {name}:  p-value={p_value}  change={pct_str}  significant={sig}")
            if sig and pct_change is not None and pct_change > 0:
                print("    RESULT: T1 wins (statistically significant improvement)")
                print("    ACTION: Promote treatment bundle as new default (Step 7g)")
            elif sig and pct_change is not None and pct_change < 0:
                print("    RESULT: T1 regressed (statistically significant decline)")
                print("    ACTION: Keep control; investigate recommendation quality")
            else:
                print("    RESULT: Inconclusive (p >= 0.05 or insufficient samples)")
                print("    ACTION: Continue sending traffic to accumulate sample size")
```

### 7g: Promote — Update the Control Bundle with Winning Config

After the A/B test shows the treatment wins, you can **promote** by updating the control bundle to the recommended config. Pass `parentVersionIds` to record lineage — the service enforces that you're updating from the correct parent version, preventing accidental overwrites.

```python
# ── Step 7g: Promote treatment config into the control bundle ─────────────
# update_configuration_bundle creates a NEW version on the existing bundleId.

current = ctrl.get_configuration_bundle(bundleId=CONTROL_BUNDLE_ID)
CONTROL_BUNDLE_VERSION = current["versionId"]
print(f"Current control bundle version: {CONTROL_BUNDLE_VERSION}")

promote_resp = ctrl.update_configuration_bundle(
    bundleId=CONTROL_BUNDLE_ID,
    components={
        AGENT_ARN: {
            "configuration": {
                "system_prompt": RECOMMENDED_SYSTEM_PROMPT,
                "tool_descriptions": RECOMMENDED_TOOL_DESCRIPTIONS,
            }
        }
    },
    parentVersionIds=[CONTROL_BUNDLE_VERSION],  # current version we're updating from
    commitMessage="Promote treatment: AI-recommended prompt + tool descriptions (A/B validated)",
    clientToken=str(uuid.uuid4()),
)
CONTROL_BUNDLE_VERSION_V2 = promote_resp["versionId"]
print(f"Control bundle promoted to version: {CONTROL_BUNDLE_VERSION_V2}")
print(f"Previous version was             : {CONTROL_BUNDLE_VERSION}")
print()
print("The control bundle now carries the recommended config.")
print("All new sessions using this bundle will receive the improved prompt")
print("and tool descriptions — without any code redeployment.")

promoted_control_baggage = (
    f"aws.agentcore.configbundle_arn={CONTROL_BUNDLE_ARN},"
    f"aws.agentcore.configbundle_version={CONTROL_BUNDLE_VERSION_V2}"
)
print(f"\nUpdated baggage for promoted control:\n  {promoted_control_baggage}")
```

```python
# Spot-check the treatment bundle: send a session and verify the agent
# responds differently than with the baseline bundle.
treatment_baggage = (
    f"aws.agentcore.configbundle_arn={TREATMENT_BUNDLE_ARN},"
    f"aws.agentcore.configbundle_version={TREATMENT_BUNDLE_VERSION}"
)
control_baggage = (
    f"aws.agentcore.configbundle_arn={CONTROL_BUNDLE_ARN},aws.agentcore.configbundle_version={CONTROL_BUNDLE_VERSION}"
)

test_prompt = "Employee ID: EMP-001. I want to request 3 days off next week for a medical appointment."

ctrl_sid = str(uuid.uuid4())
ctrl_resp = dp.invoke_agent_runtime(
    agentRuntimeArn=AGENT_ARN,
    runtimeSessionId=ctrl_sid,
    payload=json.dumps({"prompt": test_prompt}).encode(),
    baggage=control_baggage,
)
ctrl_text = ctrl_resp["response"].read().decode("utf-8")

treat_sid = str(uuid.uuid4())
treat_resp = dp.invoke_agent_runtime(
    agentRuntimeArn=AGENT_ARN,
    runtimeSessionId=treat_sid,
    payload=json.dumps({"prompt": test_prompt}).encode(),
    baggage=treatment_baggage,
)
treat_text = treat_resp["response"].read().decode("utf-8")

print(f"Prompt: {test_prompt}\n")
print("[Control   ] " + ctrl_text[:300])
print()
print("[Treatment ] " + treat_text[:300])
```

## Step 8: A/B Testing — Target-Based Routing (Phased Rollout)

If the change you are testing involves code changes, a framework upgrade, or an entirely different agent implementation, use target-based routing instead. Target-based routing sends traffic to two separate runtimes — each registered as a different gateway target. The gateway routes each session to one target or the other based on the A/B test's traffic weights.

Use configuration bundle routing (Step 7) when the change is purely configuration — a different system prompt, model ID, or tool descriptions — where both variants can run on the same runtime.

**Config-bundle vs. target-based routing:**

| | Config-Bundle Routing | Target-Based Routing |
|---|---|---|
| **What changes** | System prompt or config (no code change) | Agent code, tools, or model |
| **Deployment** | No redeployment needed | Requires deploying a new runtime |
| **Runtimes needed** | One shared runtime | Two separate runtimes |
| **Eval configs needed** | One shared online eval config | One per variant (different log groups) |
| **Use case** | Prompt optimization, config tuning | Code rollout, version upgrade |
| **Risk** | Very low — instant rollback via bundle | Higher — binary change |

Session assignment is **sticky**: once a session ID is assigned to a variant, all subsequent requests with that session ID route to the same target runtime. This ensures consistent behavior within a session while distributing new sessions according to your traffic weights.

**Use case: Phased rollout of HR Assistant v2**

v2 adds a new `escalate_to_hr_manager` tool and a more detailed system prompt baked into the code. Instead of rolling it out to 100% of users immediately, we:
1. Deploy v2 alongside v1 (both runtimes running)
2. Route 10% of traffic to v2 (canary)
3. Evaluate each runtime with its own online eval config
4. Promote to 50%, then 100% if metrics improve

### 8a: Deploy HR Assistant v2

```python
# Deploy HR Assistant v2 — new tool + improved system prompt (simulates a code change)
result = subprocess.run(
    [
        sys.executable,
        "deploy_agent.py",
        "--name",
        V2_NAME,
        "--region",
        REGION,
        "--version",
        "v2",
    ],
    capture_output=False,
    text=True,
)
if result.returncode != 0:
    raise RuntimeError(f"deploy_agent.py (v2) failed with exit code {result.returncode}")
```

```python
# Load v2 state
v2_state = json.loads(Path(f"agent_state_{V2_NAME}.json").read_text())

AGENT_ARN_V2 = v2_state["runtime_arn"]
AGENT_ID_V2 = v2_state["runtime_id"]
LOG_GROUP_V2 = v2_state["log_group"]
SERVICE_NAME_V2 = v2_state["service_name"]
ROLE_ARN_V2 = v2_state["role_arn"]

print(f"v2 Agent ARN : {AGENT_ARN_V2}")
print(f"v2 Log Group : {LOG_GROUP_V2}")
print("v2 has extra tool: escalate_to_hr_manager")
print("v2 has improved system prompt baked into the code")
```

### 8b: Add v2 Gateway Target

We add a second target to the existing gateway. The gateway now has two targets:
- `HRAgentV1`: points to the v1 runtime (stable baseline)
- `HRAgentV2`: points to the v2 runtime (new code under test)

The target-based A/B test will reference these targets by name.

```python
# Create second gateway target pointing to v2 runtime
TARGET_NAME_V2 = "HRAgentV2"
tgt_v2_resp = ctrl.create_gateway_target(
    gatewayIdentifier=GATEWAY_ID,
    name=TARGET_NAME_V2,
    description="HR Assistant v2 runtime target (new escalation tool + improved prompt)",
    targetConfiguration={
        "http": {
            "agentcoreRuntime": {
                "arn": AGENT_ARN_V2,
                "qualifier": "DEFAULT",
            }
        }
    },
    credentialProviderConfigurations=[{"credentialProviderType": "GATEWAY_IAM_ROLE"}],
    clientToken=str(uuid.uuid4()),
)
TARGET_ID_V2 = tgt_v2_resp["targetId"]
print(f"v2 target created: {TARGET_ID_V2}. Polling for READY...")

for i in range(30):
    tgt_v2 = ctrl.get_gateway_target(gatewayIdentifier=GATEWAY_ID, targetId=TARGET_ID_V2)
    if tgt_v2.get("status") == "READY":
        break
    print(f"  Poll {i + 1}: {tgt_v2.get('status')}")
    time.sleep(5)

print("\nGateway now has two targets:")
print(f"  {TARGET_NAME}    -> v1 runtime (stable)")
print(f"  {TARGET_NAME_V2} -> v2 runtime (canary with new tool)")
```

### 8c: Create Online Eval Config for v2

For target-based routing, we need a second online evaluation config that monitors the v2 log group. We use `perVariantOnlineEvaluationConfig` so each variant's sessions are evaluated by its own config.

```python
# Online eval config for v2 sessions
online_eval_v2_resp = ctrl.create_online_evaluation_config(
    onlineEvaluationConfigName=f"HROnlineEvalV2{SUFFIX}",
    description="HR Assistant v2 online evaluation (target-based routing)",
    dataSourceConfig={
        "cloudWatchLogs": {
            "logGroupNames": [LOG_GROUP_V2],
            "serviceNames": [SERVICE_NAME_V2],
        }
    },
    evaluators=[
        {"evaluatorId": "Builtin.GoalSuccessRate"},
        {"evaluatorId": "Builtin.Helpfulness"},
    ],
    rule={
        "samplingConfig": {"samplingPercentage": 100.0},
        "sessionConfig": {"sessionTimeoutMinutes": 2},
    },
    evaluationExecutionRoleArn=ROLE_ARN_V2,
    enableOnCreate=True,
    clientToken=str(uuid.uuid4()),
)
ONLINE_EVAL_V2_ID = online_eval_v2_resp["onlineEvaluationConfigId"]
ONLINE_EVAL_V2_ARN = online_eval_v2_resp["onlineEvaluationConfigArn"]
print(f"v2 online eval config: {ONLINE_EVAL_V2_ID}")
```

### 8d: Create Target-Based A/B Test (90/10 Canary Split)

In `variantConfiguration`, instead of `configurationBundle`, we specify `target: {name: ...}`. The gateway routes each session to the named target, which maps to a specific runtime ARN.

We use a **90/10 split** (typical for a canary rollout):
- **C (90%)**: v1 runtime — stable production
- **T1 (10%)**: v2 runtime — canary with new features

We use `perVariantOnlineEvaluationConfig` since each variant has its own log group (the log group name includes the endpoint name).

`gatewayFilter.targetPaths` scopes the A/B test routing rule to requests that match the control target's path, ensuring only traffic intended for this test is intercepted.

`enableOnCreate=True` starts the test immediately after creation — no separate `update_ab_test` call needed.

```python
# Only one A/B test can run per gateway at a time.
# Stop the config-bundle A/B test before creating the target routing test.
print("Stopping config-bundle A/B test to free the gateway for target routing...")
try:
    ab = dp.get_ab_test(abTestId=ABTEST_BUNDLE_ID)
    if ab.get("executionStatus") in ("RUNNING", "PAUSED"):
        dp.update_ab_test(abTestId=ABTEST_BUNDLE_ID, executionStatus="STOPPED")
        for i in range(20):
            ab = dp.get_ab_test(abTestId=ABTEST_BUNDLE_ID)
            if ab.get("executionStatus") == "STOPPED":
                print("  Bundle A/B test stopped (executionStatus=STOPPED)")
                break
            time.sleep(5)
    else:
        print(f"  Bundle A/B test already in state: {ab.get('executionStatus')}")
except Exception as e:
    print(f"  Stop skipped: {e}")

# Target-based A/B test: route by gateway target name (different runtimes).
# gatewayFilter.targetPaths scopes the routing rule to the control target path.
# enableOnCreate=True starts the test immediately — no separate update_ab_test needed.
abtest_target_resp = dp.create_ab_test(
    name=f"HRTargetAB{SUFFIX}",
    description="HR Assistant: phased rollout v1 (90%) vs v2 (10%) — target-based routing",
    gatewayArn=GATEWAY_ARN,
    roleArn=ROLE_ARN,
    enableOnCreate=True,
    evaluationConfig={
        "perVariantOnlineEvaluationConfig": [
            {"name": "C", "onlineEvaluationConfigArn": ONLINE_EVAL_ARN},
            {"name": "T1", "onlineEvaluationConfigArn": ONLINE_EVAL_V2_ARN},
        ]
    },
    gatewayFilter={"targetPaths": [f"/{TARGET_NAME}/*"]},
    variants=[
        {
            "name": "C",
            "weight": 90,
            "variantConfiguration": {
                "target": {"name": TARGET_NAME}  # v1 runtime (stable)
            },
        },
        {
            "name": "T1",
            "weight": 10,
            "variantConfiguration": {
                "target": {"name": TARGET_NAME_V2}  # v2 runtime (canary)
            },
        },
    ],
    clientToken=str(uuid.uuid4()),
)
ABTEST_TARGET_ID = abtest_target_resp["abTestId"]
print(f"Target-based A/B test created: {ABTEST_TARGET_ID}")
print("Polling for ACTIVE/RUNNING...")

for i in range(30):
    ab = dp.get_ab_test(abTestId=ABTEST_TARGET_ID)
    s, es = ab.get("status", ""), ab.get("executionStatus", "")
    print(f"  Poll {i + 1}: status={s}  executionStatus={es}")
    if s == "ACTIVE" and es == "RUNNING":
        break
    if "FAILED" in s:
        print(f"  Error: {ab.get('errorDetails')}")
        raise RuntimeError("Failed to create/start target A/B test")
    time.sleep(5)

print("\nTarget-based A/B test LIVE.")
print(f"  90% of traffic -> {TARGET_NAME}  (v1, stable)")
print(f"  10% of traffic -> {TARGET_NAME_V2} (v2, canary)")
```

### 8e: Send Traffic to Target-Based A/B Test

Traffic is sent through the same gateway URL. The target-based A/B test now overrides the routing rule to direct 90% to v1 and 10% to v2.

```python
# Use v2 target URL since the target-based A/B test routes based on target name
# Requests to either target URL will be split by the A/B test routing rule
GW_INVOKE_URL_V2 = f"{GATEWAY_URL}/{TARGET_NAME_V2}/invocations"

# A mix of HR prompts to generate target-based routing traffic
TARGET_PROMPTS = [
    "Employee ID: EMP-001. Check my PTO balance and submit a request for 2026-11-24 to 2026-11-28.",
    "Employee ID: EMP-042. I have a payroll dispute. Can you escalate this to an HR manager?",
    "Employee ID: EMP-002. What benefits can I enroll in during open enrollment?",
    "Employee ID: EMP-001. What's the maximum PTO carryover allowed?",
    "Employee ID: EMP-042. My manager is creating a hostile work environment. I need help.",
    "Employee ID: EMP-001. How many weeks of parental leave will I get as a primary caregiver?",
    "Employee ID: EMP-002. Pull up my pay stub for January 2026.",
    "Employee ID: EMP-001. Can I take PTO before I've fully accrued the days?",
    "Employee ID: EMP-042. I need a dental claim reviewed — can you escalate?",
    "Employee ID: EMP-001. What vision insurance benefits do we have?",
]

target_session_ids = []
success, fail = 0, 0

for i, prompt in enumerate(TARGET_PROMPTS):
    sid = str(uuid.uuid4())
    target_session_ids.append(sid)
    # Send to both target URLs alternately to generate diverse traffic
    invoke_url = GW_INVOKE_URL if i % 2 == 0 else GW_INVOKE_URL_V2
    body = json.dumps({"prompt": prompt, "sessionId": sid})
    req = AWSRequest(
        method="POST",
        url=invoke_url,
        data=body,
        headers={
            "Content-Type": "application/json",
            "X-Amzn-Bedrock-AgentCore-Runtime-Session-Id": sid,
        },
    )
    SigV4Auth(credentials, "bedrock-agentcore", REGION).add_auth(req)
    try:
        resp = http_requests.post(invoke_url, data=body, headers=dict(req.headers), timeout=120)
        if resp.status_code == 200:
            print(f"  [{i + 1:2d}/{len(TARGET_PROMPTS)}] OK  {sid[:8]}...  {resp.text[:80]}...")
            success += 1
        else:
            print(f"  [{i + 1:2d}/{len(TARGET_PROMPTS)}] ERR status={resp.status_code}: {resp.text[:100]}")
            fail += 1
    except Exception as e:
        print(f"  [{i + 1:2d}/{len(TARGET_PROMPTS)}] ERR {e}")
        fail += 1
    time.sleep(1)

print(f"\nTraffic summary: success={success}, fail={fail}, total={len(TARGET_PROMPTS)}")
print("Waiting for online evaluation pipeline...")
```

### 8f: Monitor Target-Based A/B Test Results

```python
print("Polling for target-based A/B test results (up to 20 minutes)...\n")
target_ab_results = None

for poll in range(25):
    ab = dp.get_ab_test(abTestId=ABTEST_TARGET_ID)
    results = ab.get("results", {})
    metrics = results.get("evaluatorMetrics", [])
    print(f"--- Poll {poll + 1}/25 -- {time.strftime('%H:%M:%S')} ---")
    print(f"  analysisTimestamp: {results.get('analysisTimestamp', 'none')}")

    for m in metrics:
        name = m.get("evaluatorArn", "").split("/")[-1]
        cs = m.get("controlStats", {})
        print(f"  Evaluator: {name}")
        print(f"    v1 Control  (C,  90%): mean={cs.get('mean', '-')}  n={cs.get('sampleSize', '-')}")
        for vr in m.get("variantResults", []):
            # Prefer API-provided percentChange; fall back to manual calculation
            pct_change = vr.get("percentChange")
            if pct_change is None:
                cs_mean, vr_mean = cs.get("mean"), vr.get("mean")
                if cs_mean and vr_mean and float(cs_mean) != 0:
                    pct_change = (float(vr_mean) - float(cs_mean)) / float(cs_mean) * 100
            delta = f"  change={pct_change:+.1f}%" if pct_change is not None else ""
            print(
                f"    v2 Treatment (T1, 10%): mean={vr.get('mean', '-')}  n={vr.get('sampleSize', '-')}  "
                f"p={vr.get('pValue', 'N/A')}  significant={vr.get('isSignificant', '-')}{delta}"
            )

    if results.get("analysisTimestamp") and metrics:
        target_ab_results = results
        print("\nResults are available!")
        break
    print()
    time.sleep(60)

if target_ab_results:
    print("\n" + "=" * 60)
    print("TARGET-BASED ROUTING INTERPRETATION")
    print("=" * 60)
    for m in target_ab_results.get("evaluatorMetrics", []):
        name = m.get("evaluatorArn", "").split("/")[-1]
        cs_mean = m.get("controlStats", {}).get("mean")
        for vr in m.get("variantResults", []):
            sig = vr.get("isSignificant")
            t1_mean = vr.get("mean")
            p_value = vr.get("pValue", "N/A")
            pct_change = vr.get("percentChange")
            if pct_change is None and cs_mean and t1_mean and float(cs_mean) != 0:
                pct_change = (float(t1_mean) - float(cs_mean)) / float(cs_mean) * 100
            pct_str = f"{pct_change:+.1f}%" if pct_change is not None else "N/A"
            print(f"\n  {name}:  p-value={p_value}  change={pct_str}  significant={sig}")
            if sig and pct_change is not None and pct_change > 0:
                print("    RESULT: v2 wins (statistically significant improvement)")
                print("    ACTION: Ramp to 50%, then 100% cutover to v2")
            elif sig and pct_change is not None and pct_change < 0:
                print("    RESULT: v2 regressed (statistically significant decline)")
                print("    ACTION: Halt rollout; keep v1, investigate v2")
            else:
                print("    RESULT: Inconclusive (p >= 0.05 or insufficient samples)")
                print("    ACTION: Continue sending traffic to accumulate sample size")
    print("\nPhased rollout workflow:")
    print("  10% canary  -> validate no regressions")
    print("  50% ramp    -> gather statistical significance")
    print("  100% promote -> complete cutover to v2")
    print("  To update weights: dp.update_ab_test(abTestId=ABTEST_TARGET_ID, variants=[...new weights...])")
```

## Summary

You have completed the full AgentCore Optimization workflow:

| Step | What you did | Key API |
|------|-------------|---------|
| 2 | Deployed HR Assistant to AgentCore Runtime | `create_agent_runtime` |
| 3 | Created baseline Configuration Bundle and sent traffic | `create_configuration_bundle`, `invoke_agent_runtime` |
| 4 | Measured baseline performance | `start_batch_evaluation` / `get_batch_evaluation` |
| 5a | Generated improved system prompt from traces | `start_recommendation` (SYSTEM_PROMPT) |
| 5b | Generated improved tool descriptions from traces | `start_recommendation` (TOOL_DESCRIPTION) |
| 6 | Packaged control and treatment configs (system prompt **and** tool descriptions) | `create_configuration_bundle` |
| 7 | A/B tested prompt + tool description change via config-bundle routing | `create_ab_test` (configurationBundle variants) |
| 8 | Canary rollout of v2 via target-based routing | `create_ab_test` (target variants, 90/10 split) |

### Decision Framework

**Config-bundle A/B test shows T1 wins?** → Update the baseline bundle to the treatment config (recommended system prompt + tool descriptions). This becomes your new default without any code deployment.

**Target-based A/B test shows v2 wins?** → Update the A/B test weights to 50/50, then 100/0. When 100% on v2, delete v1 runtime.

**Either test shows regression?** → Stop the A/B test (`update_ab_test(executionStatus='STOPPED')`), investigate, iterate.

## Step 9: Cleanup

Remove all AWS resources created by this notebook. Each block runs independently so a partial run still cleans up what it can.

```python
# ── 1. Stop and delete A/B tests ──────────────────────────────────────────
for ab_id, label in [
    (ABTEST_BUNDLE_ID if "ABTEST_BUNDLE_ID" in dir() else None, "bundle"),
    (ABTEST_TARGET_ID if "ABTEST_TARGET_ID" in dir() else None, "target"),
]:
    if not ab_id:
        continue
    print(f"1. Deleting A/B test ({label}): {ab_id}")
    try:
        # Stop the test before deleting (STOPPED ends traffic routing immediately)
        ab = dp.get_ab_test(abTestId=ab_id)
        if ab.get("executionStatus") in ("RUNNING", "PAUSED"):
            dp.update_ab_test(abTestId=ab_id, executionStatus="STOPPED")
            time.sleep(3)
        dp.delete_ab_test(abTestId=ab_id)
        print(f"   Deleted: {ab_id}")
    except Exception as e:
        print(f"   Skipped: {e}")

# ── 2. Delete online evaluation configs ───────────────────────────────────
for oe_id, label in [
    (ONLINE_EVAL_ID if "ONLINE_EVAL_ID" in dir() else None, "v1"),
    (ONLINE_EVAL_V2_ID if "ONLINE_EVAL_V2_ID" in dir() else None, "v2"),
]:
    if not oe_id:
        continue
    print(f"2. Deleting online eval config ({label}): {oe_id}")
    try:
        # Disable before deleting (executionStatus='DISABLED', not enableOnCreate=False)
        ctrl.update_online_evaluation_config(onlineEvaluationConfigId=oe_id, executionStatus="DISABLED")
        time.sleep(2)
        ctrl.delete_online_evaluation_config(onlineEvaluationConfigId=oe_id)
        print(f"   Deleted: {oe_id}")
    except Exception as e:
        print(f"   Skipped: {e}")

# ── 3. Delete configuration bundles ───────────────────────────────────────
for b_id, label in [
    (BASELINE_BUNDLE_ID if "BASELINE_BUNDLE_ID" in dir() else None, "baseline"),
    (CONTROL_BUNDLE_ID if "CONTROL_BUNDLE_ID" in dir() else None, "control"),
    (TREATMENT_BUNDLE_ID if "TREATMENT_BUNDLE_ID" in dir() else None, "treatment"),
]:
    if not b_id:
        continue
    print(f"3. Deleting bundle ({label}): {b_id}")
    try:
        ctrl.delete_configuration_bundle(bundleId=b_id)
        print(f"   Deleted: {b_id}")
    except Exception as e:
        print(f"   Skipped: {e}")

# ── 4. Delete gateway tracing (delivery + source) ─────────────────────────
if "DELIVERY_ID" in dir() and DELIVERY_ID:
    print("4a. Deleting delivery...")
    try:
        logs.delete_delivery(id=DELIVERY_ID)
        print(f"   Deleted delivery: {DELIVERY_ID}")
    except Exception as e:
        print(f"   Skipped delivery: {e}")

if "DELIVERY_SOURCE_NAME" in dir():
    print("4b. Deleting delivery source...")
    try:
        logs.delete_delivery_source(name=DELIVERY_SOURCE_NAME)
        print(f"   Deleted delivery source: {DELIVERY_SOURCE_NAME}")
    except Exception as e:
        print(f"   Skipped delivery source: {e}")

# ── 5. Delete gateway targets + gateway ───────────────────────────────────
if "GATEWAY_ID" in dir():
    for t_id, tname in [
        (TARGET_ID_V2 if "TARGET_ID_V2" in dir() else None, "v2"),
        (TARGET_ID if "TARGET_ID" in dir() else None, "v1"),
    ]:
        if not t_id:
            continue
        print(f"5. Deleting gateway target ({tname}): {t_id}")
        try:
            ctrl.delete_gateway_target(gatewayIdentifier=GATEWAY_ID, targetId=t_id)
            time.sleep(3)
            print(f"   Deleted: {t_id}")
        except Exception as e:
            print(f"   Skipped: {e}")
```
