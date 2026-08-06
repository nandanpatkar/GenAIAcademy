LangSmith Engine is the LangSmith Agent for agent engineering. It works from your production traces to surface recurring issues, diagnose their root cause, and drive the fix across every stage of the development lifecycle.

Each issue moves through a closed loop: a recurring issue is detected in your traces, the root cause is diagnosed, a fix is proposed, an evaluator is deployed to catch regressions, and if the issue resurfaces after being closed, Engine reopens it automatically.

## Engine across the lifecycle

For each issue, Engine surfaces the contributing traces, proposes a fix, generates a custom evaluator to prevent regressions, and creates ground truth dataset examples from the production trace inputs.

  ### [Build: Open a pull request](#)
Apply the proposed fix by opening a pull request in your connected repository. Engine can propose code changes to agents built with Deep Agents, LangChain, and LangGraph.

  ### [Test: Generate evaluators and datasets](#)
Deploy a custom evaluator to catch regressions, and create ground truth dataset examples from production traces for offline evaluation.

  ### [Monitor: Detect recurring issues](#)
Scan your tracing projects on a schedule to surface, prioritize, and diagnose recurring issues.

## How Engine runs

Engine scans each connected tracing project every 6 hours, clustering and prioritizing issues by severity. It uses LangChain-managed inference and charges in LangChain Compute Units (LCUs). Each detected issue is tagged with an [issue category](lc:langsmith/engine-issue-categories) such as **Silent tool error** or **Hallucination**. For setup, costs, and the full issue workflow, see [Find and fix your agent's issues](lc:langsmith/engine). For how Engine handles your data, its GitHub and model subprocessor controls, and its compliance posture, see [Engine security](lc:langsmith/engine-security). For how Engine runs in a self-hosted deployment, see [Engine on self-hosted](lc:langsmith/engine-self-hosted).

## Get started

  ### [Set up Engine](#)
Enable Engine for your organization and configure it for a tracing project.

  ### [Engine issue categories](#)
Reference for the failure categories Engine assigns to detected issues, with descriptions and detection methods.

  ### [Engine webhook events](#)
Forward detected issues into your incident-management, paging, or chat tools.
