Metrics are essential for understanding agent performance, optimizing behavior, and monitoring resource usage. The Strands Agents SDK provides comprehensive metrics tracking capabilities that give you visibility into how your agents operate.

## Overview

```sa-tabs
[
 {
  "label": "Python",
  "body": "The Strands Agents SDK automatically tracks key metrics during agent execution:\n\n-   **Token usage**: Input tokens, output tokens, total tokens consumed, and cache metrics\n-   **Performance metrics**: Latency and execution time measurements\n-   **Tool usage**: Call counts, success rates, and execution times for each tool\n-   **Event loop cycles**: Number of reasoning cycles and their durations\n\nAll these metrics are accessible through the [`AgentResult`](lc:api/python/strands.agent.agent_result#AgentResult) object that\u2019s returned whenever you invoke an agent:\n\n```python\nfrom strands import Agent\nfrom strands_tools import calculator\n\n# Create an agent with tools\nagent = Agent(tools=[calculator])\n\n# Invoke the agent with a prompt and get an AgentResult\nresult = agent(\"What is the square root of 144?\")\n\n# Access metrics through the AgentResult\nprint(f\"Total tokens: {result.metrics.accumulated_usage['totalTokens']}\")\nprint(f\"Execution time: {sum(result.metrics.cycle_durations):.2f} seconds\")\nprint(f\"Tools used: {list(result.metrics.tool_metrics.keys())}\")\n\n# Cache metrics (when available)\nif 'cacheReadInputTokens' in result.metrics.accumulated_usage:\n    print(f\"Cache read tokens: {result.metrics.accumulated_usage['cacheReadInputTokens']}\")\nif 'cacheWriteInputTokens' in result.metrics.accumulated_usage:\n    print(f\"Cache write tokens: {result.metrics.accumulated_usage['cacheWriteInputTokens']}\")\n```\n\nThe `metrics` attribute of `AgentResult` (an instance of [`EventLoopMetrics`](lc:api/python/strands.telemetry.metrics)) provides comprehensive performance metric data about the agent\u2019s execution, while other attributes like `stop_reason`, `message`, and `state` provide context about the agent\u2019s response. This document explains the metrics available in the agent\u2019s response and how to interpret them."
 },
 {
  "label": "TypeScript",
  "body": "The TypeScript SDK automatically tracks key metrics during agent execution through the `AgentMetrics` class:\n\n-   **Token usage**: Input tokens, output tokens, total tokens consumed, and cache metrics\n-   **Performance metrics**: Latency and execution time measurements\n-   **Tool usage**: Call counts, success rates, and execution times for each tool\n-   **Event loop cycles**: Number of reasoning cycles and their durations\n\nAll these metrics are accessible through the `AgentResult` object returned when you invoke an agent:\n\n```typescript\nconst agent = new Agent({\n  tools: [notebook],\n})\n\nconst result = await agent.invoke('What is the square root of 144?')\n\n// Access metrics through the AgentResult\nif (result.metrics) {\n  console.log(`Total tokens: ${result.metrics.accumulatedUsage.totalTokens}`)\n  console.log(`Total duration: ${result.metrics.totalDuration}ms`)\n  console.log(`Tools used: ${Object.keys(result.metrics.toolMetrics)}`)\n\n  // Cache metrics (when available)\n  if (result.metrics.accumulatedUsage.cacheReadInputTokens) {\n    console.log(\n      `Cache read tokens: ${result.metrics.accumulatedUsage.cacheReadInputTokens}`\n    )\n  }\n  if (result.metrics.accumulatedUsage.cacheWriteInputTokens) {\n    console.log(\n      `Cache write tokens: ${result.metrics.accumulatedUsage.cacheWriteInputTokens}`\n    )\n  }\n}\n```\n\nThe `metrics` property on `AgentResult` is an instance of `AgentMetrics` that provides comprehensive performance data about the agent\u2019s execution."
 }
]
```

## Agent Loop Metrics

```sa-tabs
[
 {
  "label": "Python",
  "body": "The [`EventLoopMetrics`](lc:api/python/strands.telemetry.metrics#EventLoopMetrics) class aggregates metrics across the entire event loop execution cycle, providing a complete picture of your agent\u2019s performance. It tracks cycle counts, tool usage, execution durations, and token consumption across all model invocations.\n\nKey metrics include:\n\n-   **Cycle tracking**: Number of event loop cycles and their individual durations\n-   **Tool metrics**: Detailed performance data for each tool used during execution\n-   **Agent invocations**: List of agent invocations, each containing cycles and usage data for that specific invocation\n-   **Accumulated usage**: Aggregated token counts (input, output, total, and cache metrics) across all agent invocations\n-   **Accumulated metrics**: Latency measurements in milliseconds for all model requests\n-   **Execution traces**: Detailed trace information for performance analysis\n\n**Agent Invocations**\n\nThe `agent_invocations` property is a list of [`AgentInvocation`](lc:api/python/strands.telemetry.metrics#AgentInvocation) objects that track metrics for each agent invocation (request). Each `AgentInvocation` contains:\n\n-   **cycles**: A list of `EventLoopCycleMetric` objects, each representing a single event loop cycle with its ID and token usage\n-   **usage**: Accumulated token usage for this specific invocation across all its cycles\n\nThis allows you to track metrics at both the individual invocation level and across all invocations:\n\n```python\nfrom strands import Agent\nfrom strands_tools import calculator\n\nagent = Agent(tools=[calculator])\n\n# First invocation\nresult1 = agent(\"What is 5 + 3?\")\n\n# Second invocation\nresult2 = agent(\"What is the square root of 144?\")\n\n# Access metrics for the latest invocation\nlatest_invocation = result2.metrics.latest_agent_invocation\ncycles = latest_invocation.cycles\nusage = latest_invocation.usage\n\n# Or access all invocations\nfor invocation in response.metrics.agent_invocations:\n    print(f\"Invocation usage: {invocation.usage}\")\n    for cycle in invocation.cycles:\n        print(f\"  Cycle {cycle.event_loop_cycle_id}: {cycle.usage}\")\n\n# Or print the summary (includes all invocations)\nprint(result2.metrics.get_summary())\n```\n\nFor a complete list of attributes and their types, see the [`EventLoopMetrics` API reference](lc:api/python/strands.telemetry.metrics#EventLoopMetrics)."
 },
 {
  "label": "TypeScript",
  "body": "The `AgentMetrics` class aggregates metrics across the entire agent loop execution, providing a complete picture of your agent\u2019s performance. It tracks cycle counts, tool usage, execution durations, and token consumption across all model invocations.\n\nKey metrics include:\n\n-   **Cycle tracking**: Number of event loop cycles and their individual durations via `cycleCount`, `totalDuration`, and `averageCycleTime`\n-   **Tool metrics**: Detailed performance data for each tool used during execution\n-   **Agent invocations**: List of agent invocations, each containing cycles and usage data for that specific invocation\n-   **Accumulated usage**: Aggregated token counts (input, output, total, and cache metrics) across all agent invocations\n-   **Accumulated metrics**: Latency measurements in milliseconds for all model requests\n\n**Agent Invocations**\n\nThe `agentInvocations` property is a list of `InvocationMetricsData` objects that track metrics for each agent invocation (request). Each invocation contains:\n\n-   **cycles**: A list of `AgentLoopMetricsData` objects, each representing a single event loop cycle with its ID, duration, and token usage\n-   **usage**: Accumulated token usage for this specific invocation across all its cycles\n\nThis allows you to track metrics at both the individual invocation level and across all invocations:\n\n```typescript\nconst agent = new Agent({\n  tools: [notebook],\n})\n\n// First invocation\nconst _result1 = await agent.invoke('What is 5 + 3?')\n\n// Second invocation\nconst result2 = await agent.invoke('What is the square root of 144?')\n\n// Access metrics for the latest invocation\nif (result2.metrics) {\n  const latest = result2.metrics.latestAgentInvocation\n  if (latest) {\n    console.log(`Invocation usage: ${JSON.stringify(latest.usage)}`)\n    for (const cycle of latest.cycles) {\n      console.log(`  Cycle ${cycle.cycleId}: ${JSON.stringify(cycle.usage)}`)\n    }\n  }\n\n  // Access all invocations\n  for (const invocation of result2.metrics.agentInvocations) {\n    console.log(`Invocation usage: ${JSON.stringify(invocation.usage)}`)\n    for (const cycle of invocation.cycles) {\n      console.log(`  Cycle ${cycle.cycleId}: ${JSON.stringify(cycle.usage)}`)\n    }\n  }\n\n  // Computed metrics\n  console.log(`Cycle count: ${result2.metrics.cycleCount}`)\n  console.log(`Total duration: ${result2.metrics.totalDuration}ms`)\n  console.log(`Average cycle time: ${result2.metrics.averageCycleTime}ms`)\n}\n```"
 }
]
```

## Tool Metrics

```sa-tabs
[
 {
  "label": "Python",
  "body": "For each tool used by the agent, detailed metrics are collected in the `tool_metrics` dictionary. Each entry is an instance of [`ToolMetrics`](lc:api/python/strands.telemetry.metrics#ToolMetrics) that tracks the tool\u2019s performance throughout the agent\u2019s execution.\n\nTool metrics provide insights into:\n\n-   **Call statistics**: Total number of calls, successful executions, and errors\n-   **Execution time**: Total and average time spent executing the tool\n-   **Success rate**: Percentage of successful tool invocations\n-   **Tool reference**: Information about the specific tool being tracked\n\nThese metrics help you identify performance bottlenecks, tools with high error rates, and opportunities for optimization. For complete details on all available properties, see the [`ToolMetrics` API reference](lc:api/python/strands.telemetry.metrics#ToolMetrics)."
 },
 {
  "label": "TypeScript",
  "body": "For each tool used by the agent, detailed metrics are collected in the `toolMetrics` dictionary. Each entry is a `ToolMetricsData` object that tracks the tool\u2019s performance throughout the agent\u2019s execution.\n\nTool metrics provide insights into:\n\n-   **Call statistics**: Total number of calls, successful executions, and errors\n-   **Execution time**: Total time spent executing the tool\n-   **Computed statistics**: The `toolUsage` getter adds computed `averageTime` and `successRate` fields\n\nThese metrics help you identify performance bottlenecks, tools with high error rates, and opportunities for optimization."
 }
]
```

## Example Metrics Summary Output

```sa-tabs
[
 {
  "label": "Python",
  "body": "The Strands Agents SDK provides a convenient `get_summary()` method on the `EventLoopMetrics` class that gives you a comprehensive overview of your agent\u2019s performance in a single call. This method aggregates all the metrics data into a structured dictionary that\u2019s easy to analyze or export.\n\nLet\u2019s look at the output from calling `get_summary()` on the metrics from our calculator example from the beginning of this document:\n\n```python\nresult = agent(\"What is the square root of 144?\")\nprint(result.metrics.get_summary())\n```\n\n```python\n{\n  \"total_cycles\": 1,\n  \"total_duration\": 2.6939949989318848,\n  \"average_cycle_time\": 2.6939949989318848,\n  \"tool_usage\": {},\n  \"traces\": [{\n      \"id\": \"e1264f67-81c9-4bd7-8cab-8f69c53e85f1\",\n      \"name\": \"Cycle 1\",\n      \"raw_name\": None,\n      \"parent_id\": None,\n      \"start_time\": 1767110391.614767,\n      \"end_time\": 1767110394.308762,\n      \"duration\": 2.6939949989318848,\n      \"children\": [{\n          \"id\": \"0de6d280-14ff-423b-af80-9cc823c8c3a1\",\n          \"name\": \"stream_messages\",\n          \"raw_name\": None,\n          \"parent_id\": \"e1264f67-81c9-4bd7-8cab-8f69c53e85f1\",\n          \"start_time\": 1767110391.614809,\n          \"end_time\": 1767110394.308734,\n          \"duration\": 2.693924903869629,\n          \"children\": [],\n          \"metadata\": {},\n          \"message\": {\n              \"role\": \"assistant\",\n              \"content\": [{\n                  \"text\": \"The square root of 144 is 12.\\n\\nThis is because 12 \u00d7 12 = 144.\"\n              }]\n          }\n      }],\n      \"metadata\": {},\n      \"message\": None\n  }],\n  \"accumulated_usage\": {\n      \"inputTokens\": 16,\n      \"outputTokens\": 29,\n      \"totalTokens\": 45\n  },\n  \"accumulated_metrics\": {\n      \"latencyMs\": 1799\n  },\n  \"agent_invocations\": [{\n      \"usage\": {\n          \"inputTokens\": 16,\n          \"outputTokens\": 29,\n          \"totalTokens\": 45\n      },\n      \"cycles\": [{\n          \"event_loop_cycle_id\": \"ed854916-7eca-4317-a3f3-1ffcc03ee3ab\",\n          \"usage\": {\n              \"inputTokens\": 16,\n              \"outputTokens\": 29,\n              \"totalTokens\": 45\n          }\n      }]\n  }]\n}\n```\n\nThis summary provides a complete picture of the agent\u2019s execution, including cycle information, token usage, tool performance, and detailed execution traces."
 },
 {
  "label": "TypeScript",
  "body": "The `AgentMetrics` class implements `toJSON()`, so you can serialize the complete metrics snapshot with `JSON.stringify()`. This gives you a comprehensive overview of your agent\u2019s performance in a single call:\n\n```typescript\nconst agent = new Agent({\n  tools: [notebook],\n})\n\nconst result = await agent.invoke('What is the square root of 144?')\n\n// Serialize metrics to JSON\nconsole.log(JSON.stringify(result?.metrics, null, 2))\n```\n\n```json\n{\n  \"cycleCount\": 1,\n  \"accumulatedUsage\": {\n    \"inputTokens\": 16,\n    \"outputTokens\": 29,\n    \"totalTokens\": 45\n  },\n  \"accumulatedMetrics\": {\n    \"latencyMs\": 1799\n  },\n  \"agentInvocations\": [\n    {\n      \"usage\": {\n        \"inputTokens\": 16,\n        \"outputTokens\": 29,\n        \"totalTokens\": 45\n      },\n      \"cycles\": [\n        {\n          \"cycleId\": \"cycle-1\",\n          \"duration\": 2694,\n          \"usage\": {\n            \"inputTokens\": 16,\n            \"outputTokens\": 29,\n            \"totalTokens\": 45\n          }\n        }\n      ]\n    }\n  ],\n  \"toolMetrics\": {}\n}\n```\n\nThis summary provides a complete picture of the agent\u2019s execution, including cycle information, token usage, and tool performance."
 }
]
```

## Local Execution Traces

```sa-tabs
[
 {
  "label": "Python",
  "body": "In addition to aggregate metrics, the Strands Agents SDK automatically collects **local execution traces** \u2014 lightweight, in-memory timing trees that capture the hierarchy and duration of operations within the agent loop. These traces are always collected regardless of OpenTelemetry configuration and are returned directly in the `AgentResult`.\n\nEach trace represents a cycle in the agent loop, with child traces for model invocations and tool calls:\n\n```python\nfrom strands import Agent\nfrom strands_tools import calculator\n\nagent = Agent(tools=[calculator])\nresult = agent(\"What is 15 * 8 + 42?\")\n\n# Traces are included in the summary output\nprint(result.metrics.get_summary())\n```\n\nEach trace contains:\n\n-   **name**: Human-readable label (e.g., \u201cCycle 1\u201d, \u201cstream\\_messages\u201d, \u201cTool: calculator\u201d)\n-   **duration**: Execution time in seconds\n-   **children**: Nested traces for operations within the cycle\n-   **metadata**: Associated data like `cycleId`, `toolUseId`, and `toolName`\n-   **message**: The model output message (for model invocation traces)\n\nTraces are included in the `get_summary()` output, giving you a complete hierarchical view of agent execution alongside aggregate metrics."
 },
 {
  "label": "TypeScript",
  "body": "In addition to aggregate metrics, the Strands Agents SDK automatically collects **local execution traces** \u2014 lightweight, in-memory timing trees that capture the hierarchy and duration of operations within the agent loop. These traces are always collected regardless of OpenTelemetry configuration and are returned directly in `AgentResult.traces`.\n\nEach trace is an `AgentTrace` instance representing a cycle in the agent loop, with child traces for model invocations and tool calls:\n\n```typescript\nconst agent = new Agent({\n  tools: [notebook],\n})\n\nconst result = await agent.invoke('What is 15 * 8 + 42?')\n\n// Access traces directly from the result\nconsole.log(JSON.stringify(result.traces))\n```\n\nEach `AgentTrace` contains:\n\n-   **name**: Human-readable label (e.g., \u201cCycle 1\u201d, \u201cstream\\_messages\u201d, \u201cTool: calculator\u201d)\n-   **duration**: Execution time in milliseconds\n-   **children**: Nested `AgentTrace` instances for operations within the cycle\n-   **metadata**: Associated data like `cycleId`, `toolUseId`, and `toolName`\n-   **message**: The model output message (for model invocation traces)\n\nTraces are separate from `AgentMetrics` and are accessed via `result.traces`. Note that `AgentResult.toJSON()` excludes traces and metrics by default to keep API responses lean \u2014 access them directly via `result.traces` and `result.metrics`."
 }
]
```

## Best Practices

1.  **Monitor Token Usage**: Keep track of token usage to ensure you stay within limits and optimize costs. Set up alerts for when token usage approaches predefined thresholds to avoid unexpected costs.
    
2.  **Analyze Tool Performance**: Review tool metrics to identify tools with high error rates or long execution times. Consider refactoring tools with success rates below 95% or average execution times that exceed your latency requirements.
    
3.  **Track Cycle Efficiency**: Monitor how many iterations the agent needed and how long each took. Agents that require many cycles may benefit from improved prompting or tool design.
    
4.  **Benchmark Latency Metrics**: Monitor latency values to establish performance baselines. Compare these metrics across different agent configurations to identify optimal setups.
    
5.  **Regular Metrics Reviews**: Schedule periodic reviews of agent metrics to identify trends and opportunities for optimization. Look for gradual changes in performance that might indicate drift in tool behavior or model responses.

## Related pages

- [Evaluating Remote Traces](lc:user-guide/evals-sdk/how-to/trace_providers) (1 shared tag)
- [Observability](lc:user-guide/observability-evaluation/observability) (1 shared tag)
- [Task Decorator](lc:user-guide/evals-sdk/how-to/eval_task) (1 shared tag)
- [Traces](lc:user-guide/observability-evaluation/traces) (1 shared tag)
- [Logging](lc:user-guide/observability-evaluation/logs) (1 shared tag)
- [Operating Agents in Production](lc:user-guide/deploy/operating-agents-in-production) (1 shared tag)
- [Root Cause Analysis](lc:user-guide/evals-sdk/detectors/root_cause_analysis) (1 shared tag)
- [Session Diagnosis](lc:user-guide/evals-sdk/detectors/diagnosis) (1 shared tag)
- [PII Redaction](lc:user-guide/safety-security/pii-redaction) (1 shared tag)
- [AgentCore Evaluation Dashboard Configuration](lc:user-guide/evals-sdk/how-to/agentcore_evaluation_dashboard) (1 shared tag)
