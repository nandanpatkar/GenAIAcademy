# How it works - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/insights-how-it-works.html

---

# How it works

AgentCore insights answers three questions about your agent’s production behavior: **Why is it failing?** **What are users asking for?** and **How is it solving problems?**

## What you get

When you run insights, you receive:

  * **A prioritized list of failure patterns** — not individual errors, but recurring issues grouped by root cause. Each pattern tells you what’s going wrong and why. Insights is integrated with [AgentCore recommendation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./optimization-recommendations.html>) capabilities to generate fixes for the failure patterns.

  * **A map of user intents** — the most common things your users are trying to accomplish, ranked by frequency.

  * **A summary of agent behavior patterns** — how your agent typically approaches problems and what outcomes it achieves.


These correspond to three insight types you can configure:

  * `Builtin.Insight.FailureAnalysis` — Failure pattern detection and root cause analysis

  * `Builtin.Insight.UserIntent` — User intent extraction and clustering

  * `Builtin.Insight.ExecutionSummary` — Agent behavior summarization and clustering


## How the analysis works

Insights examines your agent’s session traces — the full record of user messages, agent reasoning, tool calls, and responses — and produces findings at two levels:

### Session-level analysis

Each session is individually analyzed to determine:

  * Whether the agent encountered failures during execution — including hidden failures within traces that may not be visible to the end user even when the session appears successful

  * What category of failure occurred (tool error, hallucination, wrong tool choice, etc.)

  * Which specific step in the agent’s execution caused the failure

  * What the root cause was

  * What the user was trying to accomplish

  * What approach the agent took and the final outcome


### Pattern discovery

After individual sessions are analyzed, the service identifies recurring patterns across all sessions by grouping similar findings together. For failure analysis, this produces a three-level hierarchy:

  1. **Failure categories:** Broad groupings such as "execution errors," "hallucinations," or "incorrect actions."

  2. **Subcategories:** More specific failure types, such as "rate limiting" or "tool schema errors."

  3. **Root cause clusters:** Within each subcategory, the specific recurring root causes. Each cluster tells you:

     * What the root cause is

     * How many sessions are affected

     * Which sessions you can inspect for details


For user intents and execution summaries, the service produces flat clusters ranked by frequency.

## When it runs

You control when insights runs:

  * **One-time:** Call `StartBatchEvaluation` with insights whenever you want an analysis — for example, after a deployment, after a spike in user complaints, or as part of a weekly review.

  * **Recurring:** Configure a clustering frequency (`DAILY`, `WEEKLY`, or `MONTHLY`) and the service runs automatically, giving you periodic reports without manual intervention.


## Failure categories

Insights recognizes a broad taxonomy of agent failure types:

Category | Examples  
---|---  
Execution errors |  Authentication failures, resource not found, service errors, rate limiting, timeouts, tool schema violations  
Task instruction issues |  Non-compliance with instructions, problem identification failures  
Incorrect actions |  Wrong tool selection, poor information retrieval, inappropriate clarification requests  
Context handling |  Context handling failures across turns  
Hallucinations |  Fabricated capabilities, misunderstanding, incorrect usage, history fabrication, parameter hallucination, fabricated tool outputs  
Repetitive behavior |  Tool call repetition, information request repetition, step repetition  
Orchestration errors |  Reasoning mismatch, goal deviation, premature termination, unaware termination  
LLM output issues |  Nonsensical outputs  
Configuration mismatch |  Tool definition mismatches  
Coding-specific |  Edge case oversights, dependency issues

