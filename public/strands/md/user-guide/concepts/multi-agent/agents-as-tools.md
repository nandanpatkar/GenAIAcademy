## The Concept: Agents as Tools

“Agents as Tools” is an architectural pattern in AI systems where specialized AI agents are wrapped as callable functions (tools) that can be used by other agents. This creates a hierarchical structure where:

1.  **A primary “orchestrator” agent** handles user interaction and determines which specialized agent to call
2.  **Specialized “tool agents”** perform domain-specific tasks when called by the orchestrator

This approach mimics human team dynamics, where a manager coordinates specialists, each bringing unique expertise to solve complex problems. Rather than a single agent trying to handle everything, tasks are delegated to the most appropriate specialized agent.

## Key Benefits and Core Principles

The “Agents as Tools” pattern offers several advantages:

-   **Separation of concerns**: Each agent has a focused area of responsibility, making the system easier to understand and maintain
-   **Hierarchical delegation**: The orchestrator decides which specialist to invoke, creating a clear chain of command
-   **Modular architecture**: Specialists can be added, removed, or modified independently without affecting the entire system
-   **Improved performance**: Each agent can have tailored system prompts and tools optimized for its specific task

## Strands Agents SDK Best Practices for Agent Tools

When implementing the “Agents as Tools” pattern with Strands Agents SDK:

1.  **Clear tool documentation**: Write descriptive names and descriptions that explain the agent’s expertise
2.  **Focused system prompts**: Keep each specialized agent tightly focused on its domain
3.  **Proper response handling**: Use consistent patterns to extract and format responses
4.  **Tool selection guidance**: Give the orchestrator clear criteria for when to use each specialized agent

## Implementing Agents as Tools with Strands Agents SDK

Strands Agents SDK provides three ways to implement the “Agents as Tools” pattern: passing agents directly in the `tools` array for the simplest setup, `.as_tool()``.asTool()` when you need to customize tool name, description, or context behavior, and the `@tool` decorator or `tool()` function for full control over how the agent is invoked.

```mermaid
flowchart TD
    User([User]) <--> Orchestrator["Orchestrator Agent"]
    Orchestrator --> RA["Research Assistant"]
    Orchestrator --> PA["Product Recommendation Assistant"]
    Orchestrator --> TA["Trip Planning Assistant"]

    RA --> Orchestrator
    PA --> Orchestrator
    TA --> Orchestrator
```

### Passing Agents Directly

The simplest way to use an agent as a tool is to pass it directly in the `tools` array. The SDK automatically converts it into a tool that accepts an `input` string parameter and returns the agent’s text response.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands_tools import retrieve, http_request\n\n# Create specialized agents\nresearch_agent = Agent(\n    system_prompt=\"\"\"You are a specialized research assistant. Focus only on providing\n    factual, well-sourced information in response to research questions.\n    Always cite your sources when possible.\"\"\",\n    tools=[retrieve, http_request],\n)\n\nproduct_agent = Agent(\n    system_prompt=\"\"\"You are a specialized product recommendation assistant.\n    Provide personalized product suggestions based on user preferences.\"\"\",\n    tools=[retrieve, http_request],\n)\n\ntravel_agent = Agent(\n    system_prompt=\"\"\"You are a specialized travel planning assistant.\n    Create detailed travel itineraries based on user preferences.\"\"\",\n    tools=[retrieve, http_request],\n)\n\n# Create the orchestrator \u2014 agents are automatically converted to tools\norchestrator = Agent(\n    system_prompt=\"\"\"You are an assistant that routes queries to specialized agents:\n    - For research questions and factual information \u2192 Use the research_agent tool\n    - For product recommendations and shopping advice \u2192 Use the product_agent tool\n    - For travel planning and itineraries \u2192 Use the travel_agent tool\n    - For simple questions not requiring specialized knowledge \u2192 Answer directly\n\n    Always select the most appropriate tool based on the user's query.\"\"\",\n    tools=[research_agent, product_agent, travel_agent],\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\n// Create specialized agents\nconst researchAgent = new Agent({\n  name: 'research_agent',\n  description:\n    'Provides factual, well-sourced information in response to research questions.',\n  systemPrompt: `You are a specialized research assistant. Focus only on providing\nfactual, well-sourced information in response to research questions.\nAlways cite your sources when possible.`,\n  printer: false,\n})\n\nconst productAgent = new Agent({\n  name: 'product_agent',\n  description: 'Provides personalized product suggestions based on user preferences.',\n  systemPrompt: `You are a specialized product recommendation assistant.\nProvide personalized product suggestions based on user preferences.`,\n  printer: false,\n})\n\nconst travelAgent = new Agent({\n  name: 'travel_agent',\n  description: 'Creates detailed travel itineraries based on user preferences.',\n  systemPrompt: `You are a specialized travel planning assistant.\nCreate detailed travel itineraries based on user preferences.`,\n  printer: false,\n})\n\n// Create the orchestrator \u2014 agents are automatically converted to tools\nconst orchestrator = new Agent({\n  systemPrompt: `You are an assistant that routes queries to specialized agents:\n- For research questions and factual information \u2192 Use the research_agent tool\n- For product recommendations and shopping advice \u2192 Use the product_agent tool\n- For travel planning and itineraries \u2192 Use the travel_agent tool\n- For simple questions not requiring specialized knowledge \u2192 Answer directly\n\nAlways select the most appropriate tool based on the user's query.`,\n  tools: [researchAgent, productAgent, travelAgent],\n})\n```"
 }
]
```

### Customizing Agent Tools

When you need to customize the tool name, description, or context behavior, use `.as_tool()``.asTool()` explicitly:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\norchestrator = Agent(\n    system_prompt=\"You are an assistant that routes queries to specialized agents.\",\n    tools=[\n        research_agent.as_tool(\n            name=\"research_assistant\",\n            description=\"Process and respond to research-related queries requiring factual information.\",\n        ),\n    ],\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst orchestrator = new Agent({\n  systemPrompt: 'You are an assistant that routes queries to specialized agents.',\n  tools: [\n    researchAgent.asTool({\n      name: 'research_assistant',\n      description:\n        'Process and respond to research-related queries requiring factual information.',\n    }),\n  ],\n})\n```"
 }
]
```

#### Context Management

By default, both direct passing and `.as_tool()``.asTool()` reset the agent’s conversation context between invocations, ensuring every call starts from a clean baseline. To preserve the agent’s conversation history across invocations:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\n# Agent will remember prior interactions within the same orchestrator session\norchestrator = Agent(\n    system_prompt=\"You are an assistant that routes queries to specialized agents.\",\n    tools=[research_agent.as_tool(preserve_context=True)],\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\n// Agent will remember prior interactions within the same orchestrator session\nconst orchestrator = new Agent({\n  systemPrompt: 'You are an assistant that routes queries to specialized agents.',\n  tools: [researchAgent.asTool({ preserveContext: true })],\n})\n```"
 }
]
```

### Creating Custom Agent Tools

For more control over how the agent is invoked — such as custom pre/post-processing, error handling, or passing multiple parameters — you can create a custom tool that wraps an agent:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent, tool\nfrom strands_tools import retrieve, http_request\n\nRESEARCH_ASSISTANT_PROMPT = \"\"\"\nYou are a specialized research assistant. Focus only on providing\nfactual, well-sourced information in response to research questions.\nAlways cite your sources when possible.\n\"\"\"\n\n@tool\ndef research_assistant(query: str) -> str:\n    \"\"\"\n    Process and respond to research-related queries.\n\n    Args:\n        query: A research question requiring factual information\n\n    Returns:\n        A detailed research answer with citations\n    \"\"\"\n    try:\n        research_agent = Agent(\n            system_prompt=RESEARCH_ASSISTANT_PROMPT,\n            tools=[retrieve, http_request]\n        )\n\n        response = research_agent(query)\n        return str(response)\n    except Exception as e:\n        return f\"Error in research assistant: {str(e)}\"\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst researchAssistant = tool({\n  name: 'research_assistant',\n  description:\n    'Process and respond to research-related queries requiring factual information.',\n  inputSchema: z.object({\n    query: z.string().describe('A research question requiring factual information'),\n  }),\n  callback: async (input) => {\n    const researchAgent = new Agent({\n      systemPrompt: `You are a specialized research assistant. Focus only on providing\nfactual, well-sourced information in response to research questions.\nAlways cite your sources when possible.`,\n    })\n\n    const response = await researchAgent.invoke(input.query)\n    return response.lastMessage.content\n      .map((block) => ('text' in block ? block.text : ''))\n      .join('')\n  },\n})\n```"
 }
]
```

You can create multiple specialized agents following the same pattern:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\n@tool\ndef product_recommendation_assistant(query: str) -> str:\n    \"\"\"\n    Handle product recommendation queries by suggesting appropriate products.\n\n    Args:\n        query: A product inquiry with user preferences\n\n    Returns:\n        Personalized product recommendations with reasoning\n    \"\"\"\n    try:\n        product_agent = Agent(\n            system_prompt=\"\"\"You are a specialized product recommendation assistant.\n            Provide personalized product suggestions based on user preferences.\"\"\",\n            tools=[retrieve, http_request, dialog],\n        )\n        # Implementation with response handling\n        # ...\n        return processed_response\n    except Exception as e:\n        return f\"Error in product recommendation: {str(e)}\"\n\n@tool\ndef trip_planning_assistant(query: str) -> str:\n    \"\"\"\n    Create travel itineraries and provide travel advice.\n\n    Args:\n        query: A travel planning request with destination and preferences\n\n    Returns:\n        A detailed travel itinerary or travel advice\n    \"\"\"\n    try:\n        travel_agent = Agent(\n            system_prompt=\"\"\"You are a specialized travel planning assistant.\n            Create detailed travel itineraries based on user preferences.\"\"\",\n            tools=[retrieve, http_request],\n        )\n        # Implementation with response handling\n        # ...\n        return processed_response\n    except Exception as e:\n        return f\"Error in trip planning: {str(e)}\"\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst productRecommendationAssistant = tool({\n  name: 'product_recommendation_assistant',\n  description:\n    'Handle product recommendation queries by suggesting appropriate products.',\n  inputSchema: z.object({\n    query: z.string().describe('A product inquiry with user preferences'),\n  }),\n  callback: async (input) => {\n    const productAgent = new Agent({\n      systemPrompt: `You are a specialized product recommendation assistant.\nProvide personalized product suggestions based on user preferences.`,\n    })\n\n    const response = await productAgent.invoke(input.query)\n    return response.lastMessage.content\n      .map((block) => ('text' in block ? block.text : ''))\n      .join('')\n  },\n})\n\nconst tripPlanningAssistant = tool({\n  name: 'trip_planning_assistant',\n  description: 'Create travel itineraries and provide travel advice.',\n  inputSchema: z.object({\n    query: z\n      .string()\n      .describe('A travel planning request with destination and preferences'),\n  }),\n  callback: async (input) => {\n    const travelAgent = new Agent({\n      systemPrompt: `You are a specialized travel planning assistant.\nCreate detailed travel itineraries based on user preferences.`,\n    })\n\n    const response = await travelAgent.invoke(input.query)\n    return response.lastMessage.content\n      .map((block) => ('text' in block ? block.text : ''))\n      .join('')\n  },\n})\n```"
 }
]
```

#### Creating the Orchestrator Agent

Create an orchestrator agent that has access to all specialized agents as tools:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom .specialized_agents import research_assistant, product_recommendation_assistant, trip_planning_assistant\n\nMAIN_SYSTEM_PROMPT = \"\"\"\nYou are an assistant that routes queries to specialized agents:\n- For research questions and factual information \u2192 Use the research_assistant tool\n- For product recommendations and shopping advice \u2192 Use the product_recommendation_assistant tool\n- For travel planning and itineraries \u2192 Use the trip_planning_assistant tool\n- For simple questions not requiring specialized knowledge \u2192 Answer directly\n\nAlways select the most appropriate tool based on the user's query.\n\"\"\"\n\norchestrator = Agent(\n    system_prompt=MAIN_SYSTEM_PROMPT,\n    callback_handler=None,\n    tools=[research_assistant, product_recommendation_assistant, trip_planning_assistant]\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst orchestrator = new Agent({\n    systemPrompt: `You are an assistant that routes queries to specialized agents:\n- For research questions and factual information \u2192 Use the research_assistant tool\n- For recommendations and advice \u2192 Use the product_recommendation_assistant tool\n- For travel planning and itineraries \u2192 Use the trip_planning_assistant tool\n- For simple questions not requiring specialized knowledge \u2192 Answer directly\n\nAlways select the most appropriate tool based on the user's query.`,\n    tools: [researchAssistant, productRecommendationAssistant, tripPlanningAssistant],\n  })\n```"
 }
]
```

Here’s how this multi-agent system might handle a complex user query:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\n# Example: E-commerce Customer Service System\ncustomer_query = \"I'm looking for hiking boots for a trip to Patagonia next month\"\n\n# The orchestrator automatically determines that this requires multiple specialized agents\nresponse = orchestrator(customer_query)\n\n# Behind the scenes, the orchestrator will:\n# 1. First call the trip_planning_assistant to understand travel requirements for Patagonia\n#    - Weather conditions in the region next month\n#    - Typical terrain and hiking conditions\n# 2. Then call product_recommendation_assistant with this context to suggest appropriate boots\n#    - Waterproof options for potential rain\n#    - Proper ankle support for uneven terrain\n#    - Brands known for durability in harsh conditions\n# 3. Combine these specialized responses into a cohesive answer that addresses both the\n#    travel planning and product recommendation aspects of the query\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst response = await orchestrator.invoke(\n  \"I'm looking for hiking boots for a trip to Patagonia next month\"\n)\n```"
 }
]
```

This example demonstrates how Strands Agents SDK enables specialized experts to collaborate on complex queries requiring multiple domains of knowledge. The orchestrator intelligently routes different aspects of the query to the appropriate specialized agents, then synthesizes their responses into a comprehensive answer.

## Remote Agents with A2A

You can also use remote agents as tools through the [Agent-to-Agent (A2A) protocol](lc:user-guide/concepts/multi-agent/agent-to-agent). The `A2AAgent` class lets you wrap a remote A2A-compatible agent as a tool in your orchestrator, following the same pattern described above but communicating over the network. See [A2AAgent as a Tool](lc:user-guide/concepts/multi-agent/agent-to-agent#as-a-tool) for details.

## Complete Working Example

For complete implementations of this pattern, see the following examples:

```sa-tabs
[
 {
  "label": "Python",
  "body": "The [Teacher\u2019s Assistant](lc:examples/python/multi_agent_example/multi_agent_example) example demonstrates an orchestrator agent that routes student queries to specialized agents for math, English, language translation, computer science, and general knowledge."
 },
 {
  "label": "TypeScript",
  "body": "The [Agents as Tools](https://github.com/strands-agents/harness-sdk/tree/main/strands-ts/examples/agents-as-tools) example demonstrates an orchestrator agent that routes student queries to specialized tool agents for math, English, computer science, and general knowledge."
 }
]
```

## Related pages

- [Agent Workflows: Building Multi-Agent Systems with Strands Agents SDK](lc:user-guide/concepts/multi-agent/workflow) (1 shared tag)
- [Agent-to-Agent (A2A) Protocol](lc:user-guide/concepts/multi-agent/agent-to-agent) (1 shared tag)
- [Graph Multi-Agent Pattern](lc:user-guide/concepts/multi-agent/graph) (1 shared tag)
- [Multi-agent Patterns](lc:user-guide/concepts/multi-agent/multi-agent-patterns) (1 shared tag)
- [Swarm Multi-Agent Pattern](lc:user-guide/concepts/multi-agent/swarm) (1 shared tag)
- [Community Built Tools](lc:user-guide/concepts/tools/community-tools-package) (1 shared tag)
- [Creating Custom Tools](lc:user-guide/concepts/tools/custom-tools) (1 shared tag)
- [Vended Tools](lc:user-guide/concepts/tools/vended-tools) (1 shared tag)
- [Creating a Custom Model Provider](lc:user-guide/concepts/model-providers/custom_model_provider) (1 shared tag)
- [Build with AI](lc:user-guide/build-with-ai) (1 shared tag)


## Implementation

### Python

- [harness-sdk/strands-py/src/strands/agent/_agent_as_tool.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/agent/_agent_as_tool.py)

### TypeScript

- [harness-sdk/strands-ts/src/agent/agent-as-tool.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/agent/agent-as-tool.ts)
