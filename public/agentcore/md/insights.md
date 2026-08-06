# AgentCore insights: Triage agent failures with pattern analysis - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/insights.html

---

# AgentCore insights: Triage agent failures with pattern analysis  
  
###### Note

AgentCore insights is in public preview. Features and APIs may change before general availability.

###### Note

When using AgentCore insights in ap-south-1, the service uses Bedrock APAC cross-region inference profiles. When using AgentCore insights in ap-northeast-2, the service uses Bedrock global cross-region inference profiles. In both cases, your request may be routed to any of the destination Regions in the profile. This routing can occur even if you have not opted in to those Regions or have Service Control Policies explicitly denying inference in them. Input prompts and output results may be stored in these destination Regions for abuse detection purposes.

Amazon Bedrock AgentCore insights analyzes your agent sessions to identify failure patterns, extract user intents, and summarize execution behavior. Insights extends [AgentCore Evaluations](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./evaluations.html>) by providing triage analysis that goes beyond scoring — it tells you _why_ your agent fails and _what_ your users are trying to accomplish.

AgentCore insights provides three analysis types:

  * **Failure analysis:** Identifies failures in agent sessions, categorizes them using a detailed taxonomy (tool errors, hallucinations, incorrect reasoning, repetitive behavior, and more), traces root causes back to specific spans, and provides fix recommendations.

  * **User intent extraction:** Extracts what users were trying to accomplish in each session, then clusters similar intents together to show you the most common use cases your agent handles.

  * **Execution summary:** Summarizes the approach the agent took and the outcome for each session, then clusters similar execution patterns to reveal how your agent typically solves problems.


After per-session analysis, the service clusters results across sessions to surface recurring patterns. For failure analysis, this produces a three-level hierarchy: failure categories → subcategories → root cause clusters, each with affected sessions, explanations, and remediation recommendations.

## How insights are triggered

Insights analysis can be triggered in two ways:

  * **One time via batch evaluation:** Call `StartBatchEvaluation` with `insights` to run analysis over a time range of sessions. Results are returned through `GetBatchEvaluation`.

  * **Recurring via clustering schedule:** Configure a `ClusteringConfig` on your online evaluation configuration with one or more frequencies (`DAILY`, `WEEKLY`, or `MONTHLY`). The service automatically triggers batch evaluation jobs on the configured cadence. You can also create a custom report in the recurring schedule to pin to a specific date and time.


Per-session insight analysis runs automatically when insights are configured via CreateOnlineEvaluationConfig, but the clustered results that surface patterns are only generated during batch evaluation jobs.

## From triage to optimization

AgentCore insights works together with [AgentCore optimization](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./optimization.html>) to close the improvement loop. After insights identifies failure patterns and root causes, you can feed those findings into the Recommendations API to generate an improved system prompt that addresses the triaged issues. This turns diagnostic output into actionable configuration changes:

  1. **Triage:** Run insights to identify recurring failure categories and root causes.

  2. **Generate recommendation:** Call `StartRecommendation` with your current system prompt and point it at the same agent traces. The service produces a recommended system prompt with an explanation of what it changed.

  3. **Validate:** Use [A/B testing](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./ab-testing.html>) to compare the original and recommended configurations with live traffic.



