# Add memory to your Amazon Bedrock AgentCore agent - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html

---

# Add memory to your Amazon Bedrock AgentCore agent

AgentCore Memory is a fully managed service that gives your AI agents the ability to remember past interactions, enabling them to provide more intelligent, context-aware, and personalized conversations. It provides a simple and powerful way to handle both short-term context and long-term knowledge retention without the need to build or manage complex infrastructure.

AgentCore Memory addresses a fundamental challenge in agentic AI: statelessness. Without memory capabilities, AI agents treat each interaction as a new instance with no knowledge of previous conversations. AgentCore Memory provides this critical capability, allowing your agent to build a coherent understanding of users over time.

![Memory AgentCore Memory](/agentcore/images/memory-overview.png)

AgentCore Memory supports a variety of SDKs and agent frameworks. For examples, see [Amazon Bedrock AgentCore Memory examples](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-examples.html>).

###### Topics

  * Memory types

  * Memory key benefits

  * Common use cases of memory

  * [How it works](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./how-it-works.html>)

  * [Get started with AgentCore Memory](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-get-started.html>)

  * [Create an AgentCore Memory](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-create-a-memory-store.html>)

  * [Use short-term memory](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./using-memory-short-term.html>)

  * [Use long-term memory](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./long-term-memory-long-term.html>)

  * [Amazon Bedrock AgentCore Memory examples](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-examples.html>)

  * [Amazon Bedrock capacity for built-in with overrides strategies](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./bedrock-capacity.html>)

  * [Observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-observability.html>)

  * [Best practices](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./best-practices.html>)


## Memory types

AgentCore Memory offers [two types](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-types.html>) of memory that work together to create intelligent, context-aware AI agents:

**Short-term memory**
    

Short-term memory captures turn-by-turn interactions within a single session. This lets agents maintain immediate context without requiring users to repeat information.

**Example:** When a user asks, "What’s the weather like in Seattle?" and follows up with "What about tomorrow?", the agent relies on recent conversation history to understand that "tomorrow" refers to the weather in Seattle.

**Long-term memory**
    

Long-term memory automatically extracts and stores key insights from conversations across multiple sessions, including user preferences, important facts, and session summaries — for persistent knowledge retention across multiple sessions.

**Example:** If a customer mentions they prefer window seats during flight booking, the agent stores this preference in long-term memory. In future interactions, the agent can proactively offer window seats, creating a personalized experience.

## Memory key benefits

  * **Create more natural conversations:** By remembering previous turns in a conversation, agents can understand context, resolve ambiguous statements, and interact in a way that feels more human.

  * **Deliver personalized experiences:** Retain user preferences, historical data, and key facts across sessions to tailor responses and actions to individual users.

  * **Reduce development complexity:** Offload the undifferentiated heavy lifting of managing conversational state and memory, allowing you to focus on building your agent’s core business logic.


## Common use cases of memory

  * **Conversational agents:** A customer support chatbot remembers a user’s previous issues and preferences, enabling it to provide more relevant assistance in future interactions.

  * **Task-oriented / workflow agents:** An AI agent orchestrating a multi-step business process, such as invoice approval, uses memory to track the status of each step and maintain workflow progress.

  * **Multi-agent systems:** A team of AI agents managing a supply chain shares memory to synchronize inventory levels, anticipate demand, and optimize logistics.

  * **Autonomous or planning agents:** An autonomous vehicle uses memory to plan routes, adjust to traffic conditions, and learn from past experiences to improve future driving decisions.



