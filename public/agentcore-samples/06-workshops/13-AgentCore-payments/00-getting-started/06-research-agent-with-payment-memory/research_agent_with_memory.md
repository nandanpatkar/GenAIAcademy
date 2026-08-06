# Research Agent with Payment Memory

## Overview

In previous tutorials, the agent was stateless — every session started from scratch. This tutorial adds **AgentCore Memory** so the agent builds intelligence across sessions:

- Remembers what topics it already paid to research (avoids re-paying for the same data)
- Learns user preferences (budget tolerance, topic interests)
- Tracks which endpoints were useful vs expensive

### How Payments + Memory work together

```
Session 1 (new user)                    Session 2 (returning user)
  │                                       │
  │ "Research renewable energy outlook"     │ "Research renewable energy AND AI market trends"
  │                                       │
  ├─► Pay $0.05 — renewable energy      ├─► Recall per topic:
  ├─► Return summary                       │     • renewable energy → already in memory ✓
  │                                       │     • AI market trends → not in memory ✗
  │                                       ├─► Skip payment for renewable energy (free)
  │                                       ├─► Pay $0.05 only for AI market trends
  │                                       ├─► Return both summaries + savings report
  │                                       │
  └─► Memory extracts:                  └─► Result: paid $0.05 instead of $0.10 — memory saved $0.05.
      • renewable energy researched ($0.05)
```

> **Testnet only.** All code uses Base Sepolia or Solana Devnet with free USDC from [faucet.circle.com](https://faucet.circle.com/). Testnet USDC has no real-world value.

### Tutorial Details

| Information         | Details                                                         |
|:--------------------|:----------------------------------------------------------------|
| Tutorial type       | Conversational                                                  |
| Agent type          | Single                                                          |
| Agentic Framework   | Strands Agents                                                  |
| LLM model           | Anthropic Claude Sonnet                                         |
| Tutorial components | AgentCore payments, AgentCore Memory, AgentCorePaymentsPlugin   |
| Example complexity  | Intermediate                                                    |
| SDK used            | bedrock-agentcore SDK, Strands Agents SDK                       |

## Prerequisites

* Tutorial 00 completed (`.env` exists)
* Wallet funded with testnet USDC from https://faucet.circle.com/

This tutorial works with any wallet provider you configured in Tutorial 00 (Coinbase CDP or Stripe/Privy). The agent code is identical regardless of your choice.

Your AWS credentials need the IAM permissions created by Tutorial 00 (`setup_payment_roles()`). If you completed Tutorial 00 successfully, you have the required permissions.

```python
!pip install -r requirements.txt --quiet
```

## Step 1 — Load Config

```python
import sys, os, json, time, uuid

sys.path.append("..")

from dotenv import load_dotenv

load_dotenv(override=True)

import boto3
from utils import load_tutorial_env, print_summary, client_token

config = load_tutorial_env()
PAYMENT_MANAGER_ARN = config["payment_manager_arn"]
REGION = config["region"]
USER_ID = config["user_id"]

if config.get("multi_provider"):
    PROVIDER = list(config["instruments"].keys())[0]
    INSTRUMENT_ID = config["instruments"][PROVIDER]["instrument_id"]
    CONNECTOR_ID = config["instruments"][PROVIDER]["connector_id"]
else:
    INSTRUMENT_ID = config["instrument_id"]
    CONNECTOR_ID = config.get("connector_id")
    PROVIDER = config.get("provider_type", "unknown")

MODEL_ID = os.environ.get("MODEL_ID", "us.anthropic.claude-sonnet-4-6")

print_summary(
    "Config",
    manager_arn=PAYMENT_MANAGER_ARN,
    provider=PROVIDER,
    instrument_id=INSTRUMENT_ID,
)
```

## Step 2 — Verify Instrument and Create Session

Tutorial 00 created the Payment Manager, Connector, and Instrument. We create an SDK client to interact with them, verify the instrument is ACTIVE, then create a fresh session for this task.

```python
from bedrock_agentcore.payments import PaymentManager

# SDK client wrapping the existing Payment Manager ARN from Tutorial 00
manager = PaymentManager(payment_manager_arn=PAYMENT_MANAGER_ARN, region_name=REGION)

# Verify instrument is ACTIVE
instr = manager.get_payment_instrument(user_id=USER_ID, payment_instrument_id=INSTRUMENT_ID)
instr_status = instr.get("status", "UNKNOWN")
assert instr_status == "ACTIVE", f"Instrument is {instr_status} — fund and delegate in Tutorial 00/03 first"

# Create a fresh session for this task
sess_resp = manager.create_payment_session(
    user_id=USER_ID,
    limits={"maxSpendAmount": {"value": "0.20", "currency": "USD"}},
    expiry_time_in_minutes=60,
)
SESSION_ID = sess_resp["paymentSessionId"]
print(f"✅ Instrument {INSTRUMENT_ID} is {instr_status}")
print(f"✅ Session: {SESSION_ID} (budget: $0.20)")
```

### Two layers of budget control

The session budget ($0.20) is the **hard limit** — enforced by AgentCore payments at the API level. The agent cannot exceed it regardless of what the LLM decides.

Memory adds a **soft optimization** layer on top — the agent uses past session data to make smarter spending decisions within that budget. Without memory, the agent might waste the $0.20 on redundant calls. With memory, it skips what it already knows and stretches the budget further.

| Layer | Controls | Enforced by |
|-------|----------|-------------|
| **Session budget** ($0.20, 60 min expiry) | Hard ceiling — cannot exceed | AgentCore payments service |
| **Memory intelligence** | Soft optimization — skip redundant calls | Agent logic (system prompt + recall tool) |

Budget enforcement is structural (IAM + API). Memory is additive intelligence.

## Step 3 — Create Memory

AgentCore Memory with a semantic strategy that extracts facts from conversations. The memory captures:
- What topics the user researched
- Which endpoints the agent called and what they cost
- User preferences expressed during conversation

```python
memory_ctl = boto3.client("bedrock-agentcore-control", region_name=REGION)
memory_data = boto3.client("bedrock-agentcore", region_name=REGION)

MEMORY_NAME = f"research_memory_{uuid.uuid4().hex[:8]}"

memory_resp = memory_ctl.create_memory(
    name=MEMORY_NAME,
    description="Research agent memory - tracks topics, costs, and preferences",
    eventExpiryDuration=30,
    memoryStrategies=[
        {
            "semanticMemoryStrategy": {
                "name": "ResearchFacts",
                "namespaceTemplates": [f"/actor/{USER_ID}/facts/"],
            }
        }
    ],
)
MEMORY_ID = memory_resp["memory"]["id"]
print(f"✅ Memory created: {MEMORY_ID}")
print(f"   Strategy: ResearchFacts (semantic extraction)")
print(f"   Namespace: /actor/{USER_ID}/facts/")

# Wait for the memory to become ACTIVE. CreateMemory returns immediately with
# status=CREATING; downstream record ops (batch_create, retrieve) require ACTIVE.
print("\n   Waiting for memory to become ACTIVE (usually 30-90s)...", flush=True)
elapsed = 0
while True:
    status = memory_ctl.get_memory(memoryId=MEMORY_ID)["memory"]["status"]
    if status == "ACTIVE":
        print(f"   ✅ Memory is ACTIVE (after {elapsed}s)", flush=True)
        break
    if status == "FAILED":
        reason = memory_ctl.get_memory(memoryId=MEMORY_ID)["memory"].get("failureReason", "unknown")
        raise RuntimeError(f"Memory creation failed: {reason}")
    print(f"   status={status}, elapsed={elapsed}s, polling again in 10s...", flush=True)
    time.sleep(10)
    elapsed += 10
```

## Step 4 — Hydrate Memory (Simulate Returning User)

We pre-populate memory to simulate a returning user who already has research history with the agent. Two prior research topics are loaded, each costing $0.05 in the previous session ($0.10 total):

- **Seattle weather** — sets up Query 1 (full memory hit).
- **Renewable energy market outlook** — sets up Query 3 (partial hit: this topic comes from memory, AI market trends is fetched fresh).

A `user_profile` and `tool_preference` record are also loaded so Query 2 has substance to recall.

```python
from datetime import datetime, timedelta, timezone

# Use yesterday's date so cached research always looks recent — otherwise the
# agent decides the memory hit is too stale and pays for fresh data anyway.
yesterday = (datetime.now(timezone.utc) - timedelta(days=1)).strftime("%Y-%m-%d")

hydration_records = [
    {
        "content": {
            "text": json.dumps(
                {
                    "type": "user_profile",
                    "interests": ["weather data", "renewable energy", "market research"],
                    "budget_preference": "moderate - prefers endpoints under $0.10 per call",
                    "style": "concise summaries with key data points",
                    "last_session_total_spent": "$0.10",
                }
            )
        },
        "namespace": f"/actor/{USER_ID}/facts/",
    },
    {
        "content": {
            "text": json.dumps(
                {
                    "type": "past_research",
                    "date": yesterday,
                    "topic": "weather data for Seattle",
                    "cost": "$0.05",
                    "endpoint_used": "weather-api ($0.05, accurate 7-day forecast)",
                    "result_summary": "Seattle: 58F, partly cloudy, rain expected Thursday",
                }
            )
        },
        "namespace": f"/actor/{USER_ID}/facts/",
    },
    {
        "content": {
            "text": json.dumps(
                {
                    "type": "past_research",
                    "date": yesterday,
                    "topic": "renewable energy market outlook",
                    "cost": "$0.05",
                    "endpoint_used": "energy-insights-api ($0.05, concise sector summary)",
                    "result_summary": "Global renewable capacity additions on track to exceed 560 GW in 2026; solar leading growth; grid storage and offshore wind project pipelines expanding into late 2026",
                }
            )
        },
        "namespace": f"/actor/{USER_ID}/facts/",
    },
    {
        "content": {
            "text": json.dumps(
                {
                    "type": "tool_preference",
                    "preferred": [
                        "weather-api - $0.05, fast and accurate",
                        "energy-insights-api - $0.05, good sector summaries",
                    ],
                    "avoid": ["premium-analytics - $0.50 per call, too expensive for this user"],
                }
            )
        },
        "namespace": f"/actor/{USER_ID}/facts/",
    },
]

ts = time.time()
records_to_create = []
for idx, rec in enumerate(hydration_records):
    records_to_create.append(
        {
            "requestIdentifier": f"hydrate_{idx:03d}",
            "content": rec["content"],
            "namespaces": [rec["namespace"]],
            "timestamp": ts + idx,
        }
    )

resp = memory_data.batch_create_memory_records(
    memoryId=MEMORY_ID,
    records=records_to_create,
)
print(f"✅ Hydrated {len(resp.get('successfulRecords', []))} memory records")
print(f"   Namespace: /actor/{USER_ID}/facts/")
print(f"   Past research dated {yesterday}: Seattle weather ($0.05), renewable energy outlook ($0.05)")
print(f"   Last session total: $0.10")
print(f"\n   Waiting 25s for indexing...", flush=True)
time.sleep(25)
print("   ✅ Ready for semantic search", flush=True)
```

## Step 5 — Build the Agent

The agent has three capabilities:
1. **PaymentsPlugin** — auto-pays x402 when `http_request` hits a paid endpoint
2. **Memory tool** — agent queries user history before deciding to pay
3. **http_request** — calls paid endpoints (plugin handles the 402 flow)

```python
from strands import Agent
from strands.models import BedrockModel
from strands.tools import tool
from strands_tools import http_request
from bedrock_agentcore.payments.integrations.strands import (
    AgentCorePaymentsPlugin,
    AgentCorePaymentsPluginConfig,
)

# Payment plugin
payment_plugin = AgentCorePaymentsPlugin(
    config=AgentCorePaymentsPluginConfig(
        payment_manager_arn=PAYMENT_MANAGER_ARN,
        user_id=USER_ID,
        payment_instrument_id=INSTRUMENT_ID,
        payment_session_id=SESSION_ID,
        region=REGION,
        network_preferences_config=["eip155:84532", "base-sepolia"]
        if os.environ.get("NETWORK", "ETHEREUM") == "ETHEREUM"
        else ["solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1"],
    )
)


# Memory query tool - uses RetrieveMemoryRecords (semantic search)
@tool
def recall_user_context(query: str) -> str:
    """Search the user's memory for relevant context before making paid calls.

    Use this to check:
    - Has the user asked about this topic before?
    - What did past sessions cost?
    - Which endpoints does the user prefer or avoid?

    Args:
        query: Natural language search (e.g., 'weather data', 'budget preference')

    Returns:
        JSON with matching memory records.
    """
    results = memory_data.retrieve_memory_records(
        memoryId=MEMORY_ID,
        namespace=f"/actor/{USER_ID}/facts/",
        searchCriteria={
            "searchQuery": query,
            "topK": 5,
        },
    )
    # RetrieveMemoryRecords returns matches under 'memoryRecordSummaries'
    records = results.get("memoryRecordSummaries", [])
    parsed = []
    for r in records:
        text = r.get("content", {}).get("text", "")
        try:
            parsed.append(json.loads(text))
        except (json.JSONDecodeError, TypeError):
            parsed.append(text)
    return json.dumps({"query": query, "results": parsed, "count": len(parsed)}, indent=2)


SYSTEM_PROMPT = """You are a research agent with payment capabilities and persistent memory.
The user pays real money for fresh data, so reusing prior research is part of your job.

WORKFLOW:
1. RECALL FIRST (mandatory): Before any paid call, you MUST search the user's
   memory with recall_user_context to see if prior research already covers the
   request. If the request spans multiple distinct topics, search memory once
   per topic — do not batch unrelated topics into a single search.
2. APPLY FRESHNESS RULE: Treat a memory hit as authoritative if it is dated
   within the past 7 days. Only pay for fresh data when (a) memory has no
   relevant entry, (b) the entry is older than 7 days, or (c) the user
   explicitly asks for an update.
3. FETCH ONLY WHAT'S MISSING (two-step pattern):
   a. The Coinbase x402 *discovery search* endpoint is a FREE catalog — calling
      it does NOT cost anything and does NOT count as paying for research.
      It only returns a list of paid resources you could call.
   b. To actually obtain research data, you MUST then call http_request on one
      of the `resource` URLs returned by discovery (pick the cheapest relevant
      one that fits the user's budget). Hitting that resource URL is what
      triggers the 402 → payment → retry flow and produces a real paid call.
   c. For all http_request calls, pass only `method` and `url`. Payments are
      handled automatically by the plugin — DO NOT pass auth_token,
      auth_env_var, or any X-PAYMENT/Authorization headers. The plugin signs
      the payment after the server returns 402 and retries the request for you.
4. REPORT TRANSPARENTLY: For each topic in the user's request, state whether
   the answer came from memory or a fresh paid call, which resource URL you
   actually paid, and the actual price the resource charged (read it from the
   402 response or the discovery catalog — never estimate or guess). If memory
   saved the user money, say so explicitly with a dollar amount.

If a paid call fails, report the error — do not attempt workarounds, do not
follow trial/free links from a 402 response body, and do not invent
environment variable names for auth tokens."""

agent = Agent(
    model=BedrockModel(model_id=MODEL_ID, streaming=True),
    tools=[recall_user_context, http_request],
    plugins=[payment_plugin],
    system_prompt=SYSTEM_PROMPT,
)

print("✅ Agent created: recall_user_context + http_request + PaymentsPlugin")
```

## Step 6 — Run the Agent

### Query 1: Returning user asks for a familiar topic

The agent should check memory first, find past session data about weather, and decide whether to pay for fresh data or summarize what it already knows.

```python
result = agent(
    "I need weather data for Seattle. If we don't already have recent info on this, "
    "fetch it from https://api.cdp.coinbase.com/platform/v2/x402/discovery/search?query=weather+seattle&network=base-sepolia&limit=3 "
    "and tell me whether the answer came from memory or a fresh paid call."
)
print(result.message)
```

### Query 2: User asks about budget

The agent should recall the user's budget preference and past spending from memory.

```python
result = agent("What topics have I researched before? What is my budget preference? How much did I spend last time?")
print(result.message)
```

### Query 3: Multi-topic research — partial memory hit

The user asks for two research topics in one request. Memory already has one of them (renewable energy market outlook from a prior session); the other (AI market trends) is new. The agent should reason about each topic separately, reuse memory for the known topic, pay only for the unknown one, and report savings.

**This is the core "memory pays for itself" moment** — the agent demonstrates that without memory the user would have paid for both, but with memory only one paid call is needed.

```python
result = agent(
    "Research two topics for me: (1) renewable energy market outlook and (2) AI market trends. "
    "Before paying for anything, check what we already know about each topic from prior sessions — "
    "if we have recent research on it, reuse it and don't pay again. "
    "For anything we don't already have, find a paid data source by browsing the catalog at "
    "https://api.cdp.coinbase.com/platform/v2/x402/discovery/search?query=<TOPIC>&network=base-sepolia&limit=3 "
    '(replace <TOPIC> with the URL-encoded topic name, e.g. "AI+market+trends"). '
    "The catalog itself is free — pick the cheapest relevant resource it returns, then actually fetch "
    "from that resource URL so the payment goes through. "
    "For each topic separately, tell me: source (memory or fresh paid call), the resource URL paid "
    "(if any), the actual price charged, and a short summary of the data. "
    "At the end, total what I paid this turn versus what fetching both fresh would have cost."
)
print(result.message)
```

### Query 4: Session recap with explicit cost comparison

The agent enumerates each request, marks each as memory or paid, totals this session's spend, and compares it to the prior session's $0.10 and to the cost of fetching everything fresh — so the user sees exactly what memory saved.

```python
result = agent(
    "Recap this whole session for me. List each request I made, whether it was answered "
    "from memory or by paying for fresh data, and the cost of each. "
    "Then compare total session spend to my last session and to what fresh research on "
    "everything would have cost — be specific with dollar amounts so I can see exactly what memory saved me."
)
print(result.message)
```

## Step 7 — Check Session Spend

```python
session_info = manager.get_payment_session(
    user_id=USER_ID,
    payment_session_id=SESSION_ID,
)
sess = session_info
print_summary(
    "Session Spend",
    session_id=SESSION_ID,
    available=sess.get("availableLimits", {}).get("availableSpendAmount", "N/A"),
    budget_limit=sess.get("limits", {}).get("maxSpendAmount", "N/A"),
)
```

## Step 8 — Budget Enforcement in Action

Memory optimizes spend, but the **session budget is the hard limit**. Let's prove it — create a tiny session ($0.0001) that's smaller than any priced x402 resource, then have the agent actually attempt a paid resource fetch. AgentCore payments will reject the payment at the API level, regardless of what the LLM decides.

> The discovery search itself is free, so it would always succeed. To trigger budget enforcement we need the agent to call a *resource* URL returned by discovery — that's where the 402 → payment flow happens.

```python
# Create a session with a budget smaller than any priced x402 resource.
# The cheapest resource we've seen is $0.001 — a $0.0001 budget guarantees rejection.
tiny_resp = manager.create_payment_session(
    user_id=USER_ID,
    limits={"maxSpendAmount": {"value": "0.0001", "currency": "USD"}},
    expiry_time_in_minutes=15,
)
tiny_session_id = tiny_resp["paymentSessionId"]
print(f"Tiny session: {tiny_session_id} (budget: $0.0001)")

# Reuse the same plugin shape, just point it at the tiny session
tiny_plugin = AgentCorePaymentsPlugin(
    config=AgentCorePaymentsPluginConfig(
        payment_manager_arn=PAYMENT_MANAGER_ARN,
        user_id=USER_ID,
        payment_instrument_id=INSTRUMENT_ID,
        payment_session_id=tiny_session_id,
        region=REGION,
        network_preferences_config=["eip155:84532", "base-sepolia"],
    )
)

# Give the budget-test agent the same two-step pattern so it actually attempts
# a paid resource — calling only the free discovery catalog would prove nothing.
TINY_SYSTEM_PROMPT = """You are a research agent. To fetch paid data on x402:
1. Call the discovery search URL (this is FREE — it just returns a catalog).
2. Pick a resource URL from the catalog and call THAT URL with http_request.
   Step 2 is what triggers the 402 → payment flow. The plugin handles payment
   automatically — pass only `method` and `url` to http_request.
If a paid call is rejected, report the exact error message verbatim. Do not
attempt workarounds or invent retry strategies."""

budget_test_agent = Agent(
    model=BedrockModel(model_id=MODEL_ID, streaming=True),
    tools=[http_request],
    plugins=[tiny_plugin],
    system_prompt=TINY_SYSTEM_PROMPT,
)

print("\nAttempting a paid resource fetch with $0.0001 budget...")
result = budget_test_agent(
    "Find a paid weather data resource on x402 by browsing the catalog at "
    "https://api.cdp.coinbase.com/platform/v2/x402/discovery/search?query=weather&network=base-sepolia&limit=1 "
    "and then actually call the resource URL it returns to fetch the weather data. "
    "Report exactly what happened — including any payment errors verbatim."
)
print(result.message)
print("\n✅ Budget enforcement: the $0.0001 session cannot cover any Bazaar resource call.")
print("   This is structural — enforced by AgentCore payments at the API level, not by agent logic.")
```

## View Payment Traces

Every payment produces a trace. Explore the service-generated telemetry — payment success rates, session spend, and transaction latency — on the Amazon CloudWatch GenAI Observability Dashboard.

```python
print(f"🔍 View your agent traces: Amazon CloudWatch → GenAI Observability Dashboard")
print(f"  https://{REGION}.console.aws.amazon.com/cloudwatch/home?region={REGION}#gen-ai-observability/agent-core")
```

## What Just Happened

You built a research agent that combines payments and memory:

1. **Memory recall** — agent checked user history before spending
2. **Smart spending** — skipped redundant calls when memory had the answer
3. **Payments** — plugin handled x402 automatically for fresh data calls
4. **Transparency** — agent reported what it recalled vs what it paid for

### What memory adds to payments

| Without Memory | With Memory |
|---------------|-------------|
| Agent re-pays for same data every session | Agent checks memory first, pays only for new data |
| No cost awareness across sessions | Agent compares current vs past session costs |
| Every session starts cold | Agent remembers user preferences and tool quality |

### Role separation for deployed agents

This notebook runs locally under your AWS credentials. When deployed, the runtime process runs under ProcessPaymentRole — the plugin calls `ProcessPayment` on behalf of the agent within the budget set by the app backend. The runtime cannot create sessions, modify limits, or provision wallets. The agent (LLM) never calls `ProcessPayment` directly. The memory tool and payment plugin work the same way when deployed. See Tutorial 02 for the full role separation implementation.

To test role separation locally, pass an assumed-role session to the SDK client:

```python
from utils import assume_role
import boto3

# App backend (ManagementRole) creates the session
manager = PaymentManager(payment_manager_arn=ARN, region_name=REGION)
session = manager.create_payment_session(user_id=USER_ID, ...)

# Agent runs under ProcessPaymentRole — can only ProcessPayment
agent_session = assume_role(boto3.Session(), PROCESS_PAYMENT_ROLE_ARN, 'agent')
agent_manager = PaymentManager(
    payment_manager_arn=ARN, boto3_session=agent_session
)
# Pass agent_manager to the plugin — it cannot create sessions or modify budgets
```

## Cleanup

The memory resource is created by this tutorial and should be deleted. Sessions expire automatically. Payment resources (Manager, Connector, Instrument) belong to Tutorial 00 — don't delete them here.

```python
# Delete memory resource
try:
    memory_ctl.delete_memory(memoryId=MEMORY_ID)
    print(f"✅ Deleted memory: {MEMORY_ID}")
except Exception as e:
    print(f"⚠️  {e}")
```

# Congratulations!

You've built a research agent that pays for data and gets smarter over time. Next: **Tutorial 07** — Multi-Agent Payment Orchestrator.
