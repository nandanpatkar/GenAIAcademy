# Understand observability for agentic resources in AgentCore - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-telemetry.html

---

# Understand observability for agentic resources in AgentCore

This section defines the concepts of sessions, traces and spans as they relate to monitoring and observability of agents.

###### Topics

  * Sessions

  * Traces

  * Spans

  * Relationship Between Sessions, Traces, and Spans


## Sessions

A session represents a complete interaction context between a user and an agent. Sessions encapsulate the entire conversation or interaction flow, maintaining state and context across multiple exchanges. Each session has a unique identifier and captures the full lifecycle of user engagement with the agent, from initialization to termination.

Sessions provide the following capabilities for agents:

  * Context persistence across multiple interactions within the same conversation

  * State management for maintaining user-specific information

  * Conversation history tracking for contextual understanding

  * Resource allocation and management for the duration of the interaction

  * Isolation between different user interactions with the same agent


From an observability perspective, sessions provide a high-level view of user engagement patterns, allowing you to monitor agent performance across metrics, traces, and spans and to understand how users interact with your agents over time and across different use cases.

By default, AgentCore provides a set of observability metrics at the session level for agents that are running in the AgentCore runtime. You can view the runtime metrics in the Amazon CloudWatch console on the generative AI observability page. This page offers a variety of graphs and visualizations to help you interpret your agents' data. AgentCore also outputs a default set of metrics for memory resources, gateway resources, and built-in tools. All of these metrics can be viewed in CloudWatch. In addition to the provided metrics, logs and spans are provided by default for memory resources, and by instrumenting your agent code, you can capture custom metrics, logs, and spans for your agent which can also be viewed on the CloudWatch generative AI observability page. See the following sections and [View observability data for your Amazon Bedrock AgentCore agents](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-view.html>) to learn more.

## Traces

A trace represents a detailed record of a single request-response cycle beginning from with an agent invocation and may include additional calls to other agents. Traces capture the complete execution path of a request, including all internal processing steps, external service calls, decision points, and resource utilization. Each trace is associated with a specific session and provides granular visibility into the agent’s behavior for a particular interaction.

Traces include the following components for agents:

  * Request details including timestamps, input parameters, and context

  * Processing steps showing the sequence of operations performed

  * Tool invocations with input/output parameters and execution times

  * Resource utilization metrics such as processing time

  * Error information including exception details and recovery attempts

  * Response generation details and final output


From an observability perspective, traces provide deep insights into the internal workings of your agents, allowing you to troubleshoot issues, optimize performance, and understand behavior patterns. By analyzing trace data, you can identify bottlenecks, detect anomalies, and verify that your agent is functioning as expected across different scenarios and inputs.

To gather trace data, you need to instrument your agent code using the AWS Distro for Open Telemetry (ADOT). See [Enabling observability in agent code for AgentCore-hosted agents](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-configure.html#observability-configure-custom>) and [Enabling observability for agents hosted outside of AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-configure.html#observability-configure-3p>) to learn more.

## Spans

A span represents a discrete, measurable unit of work within an agent’s execution flow. Spans capture fine-grained operations that occur during request processing, providing detailed visibility into the internal components and steps that make up a complete trace. Each span has a defined start and end time, creating a precise timeline of agent activities and their durations.

Spans include the following essential attributes for agent observability:

  * Operation name identifying the specific function or process being executed

  * Timestamps marking the exact start and end times of the operation

  * Parent-child relationships showing how operations nest within larger processes

  * Tags and attributes providing contextual metadata about the operation

  * Events marking significant occurrences within the span’s lifetime

  * Status information indicating success, failure, or other completion states

  * Resource utilization metrics specific to the operation


Spans form a hierarchical structure within traces, with parent spans encompassing child spans that represent more granular operations. For example, a high-level "process user query" span might contain child spans for "parse input," "retrieve context," "generate response," and "format output." This hierarchical organization creates a detailed execution tree that reveals the complete flow of operations within the agent.

By default, AgentCore outputs a set of span data for memory resources only. This data can be viewed in CloudWatch Logs and CloudWatch Application signals. To record span data for your agents or gateway resources, you need to instrument your agent. See [Enabling observability in agent code for AgentCore-hosted agents](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-configure.html#observability-configure-custom>) and [Enabling observability for agents hosted outside of AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-configure.html#observability-configure-3p>) to learn more.

## Relationship Between Sessions, Traces, and Spans

Sessions, traces, and spans form a three-tiered hierarchical relationship in the observability framework for agents. A session contains multiple traces, with each trace representing a discrete interaction within the broader context of the session. Each trace, in turn, contains multiple spans that capture the fine-grained operations and steps within that interaction. This hierarchical structure allows you to analyze agent behavior at different levels of granularity, from high-level session patterns to mid-level interaction flows to detailed execution paths for specific operations.

The relationship between these three observability components can be visualized as:

  * Sessions (highest level) - Represent complete user conversations or interaction contexts

  * Traces (middle level) - Represent individual request-response cycles within a session

  * Spans (lowest level) - Represent specific operations or steps within a trace


This multi-tiered relationship enables several important observability capabilities:

  * Contextual analysis of individual interactions within their broader conversation flow

  * Correlation of related requests across a user’s interaction journey

  * Progressive troubleshooting from session-level anomalies to trace-level patterns to span-level root causes

  * Comprehensive performance profiling across different temporal and functional dimensions

  * Holistic understanding of agent behavior patterns and evolution throughout a conversation

  * Precise identification of performance bottlenecks at the operation level through span analysis


While traces provide visibility into complete request-response cycles, spans offer deeper insights into the internal workings of those cycles. Spans reveal exactly which operations consume the most time, where errors originate, and how different components interact within a single trace. This granularity is particularly valuable when troubleshooting complex issues or optimizing performance in sophisticated agent implementations.

By leveraging session, trace, and span data in your observability strategy, you can gain comprehensive insights into your agent’s behavior, performance, and effectiveness at multiple levels of detail. This multi-layered approach to observability supports continuous improvement, robust troubleshooting, and informed optimization of your agent implementations, from high-level conversation patterns down to individual operation performance.

