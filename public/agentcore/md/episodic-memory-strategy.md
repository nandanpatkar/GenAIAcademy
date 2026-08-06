# Episodic memory strategy - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/episodic-memory-strategy.html

---

# Episodic memory strategy

**Episodic memory** captures meaningful slices of user and system interactions so applications can recall context in a way that feels focused and relevant. Instead of storing every raw event, it identifies important moments, summarizes them into compact records, and organizes them so the system can retrieve what matters without noise. This creates a more adaptive and intelligent experience by allowing models to understand how context has evolved over time.

Its strength comes from having structured context that spans many interactions, while remaining efficient to store, search, and update. Developers get a balance of freshness, accuracy, and long term continuity without needing to engineer their own summarization pipelines.

**Reflections** build on episodic records by analyzing past episodes to surface insights, patterns, and higher level conclusions. Instead of simply retrieving what happened, reflections help the system understand why certain events matter and how they should influence future behavior. They turn raw experience into guidance the application can use immediately, giving models a way to learn from history.

Their value comes from lifting information above individual moments, or episodes and creating durable knowledge that improves decision making, personalization, and consistency. This helps applications avoid repeating mistakes, adapt more quickly to user preferences, and behave in a way that feels coherent over long periods.

Customers should use episodic memory in any scenario where understanding a sequence of past interactions improves quality, as well as scenarios where long term improvement matters. Ideal use cases include customer support conversations, agent driven workflows, code assistants that rely on session history, personal productivity tools, troubleshooting or diagnostic flows, and applications that need context grounded in real prior events rather than static profiles.

When you invoke the episodic strategy, AgentCore automatically detects episode completion within conversations and processes events into structured episode records.

**Steps in the strategy**

The episodic memory strategy includes the following steps:

  * **Extraction** – Analyzes in-progress episode and determine if episode is complete.

  * **Consolidation** – When an episode is complete, combines extractions into single episode.

  * **Reflection** – Insights are generated across episodes.


**Strategy output**

The episodic memory strategy returns XML-formatted output for both episodes and reflections. Each episode is broken down into a situation, intent, assessment, justification, and episode-level reflection. As the interaction proceeds, the episode is analyzed turn-by-turn. You can use this information to better understand the order of operations and tool use.

**Examples of episodes captured by this strategy**

  * A code deployment interaction where the agent selected specific tools, encountered an error, and successfully resolved it using an alternative approach.

  * An appointment rescheduling task that captured the user’s intent, the agent’s decision to use a particular tool, and the successful outcome.

  * A data processing workflow that documented which parameters led to optimal performance for a specific data type.


The episodic strategy includes memory extraction and consolidation steps (shared with other strategies). In addition, the episodic strategy also generates reflections, which analyze episodes in the background as interactions take place. Reflections consolidate across multiple episodes to extract broader insights that identify successful strategies and patterns, potential improvements, common failure modes, and lessons learned that span multiple interactions.

**Examples of reflections include**

  * Identifying which tool combinations consistently lead to successful outcomes for specific task types.

  * Recognizing patterns in failed attempts and the approaches that resolved them.

  * Extracting best practices from multiple successful episodes with similar scenarios.


The following image schematizes the episodic memory strategy:

![Schema of episodic memory strategy.](/agentcore/images/episodic-memory-strategy.png)

By referencing stored episodes, your agent can retrieve relevant past experiences through semantic search and review reflections to avoid repeating failed approaches and to adapt successful strategies to new contexts. This strategy is useful for agents that benefit from identifying patterns, need to continually update information, maintain consistency across interactions, and require context and reasoning rather than static knowledge to make decisions.

###### Topics

  * Namespaces

  * How to best retrieve episodes to improve agentic performance

  * [System prompts for episodic memory strategy](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-episodic-prompt.html>)


## Namespaces

When you create a memory with the episodic strategy, you define namespaces under which to store episodes and reflections.

###### Note

Regardless of the namespace you choose to store episodes in, episodes are always created from a single session.

Episodes are commonly stored in one of the following namespaces:

  * `/strategy/{memoryStrategyId}/` – Store episodes at the strategy level. Episodes that have different actors or that come from different sessions, but that belong to the same strategy, are stored in the same namespace.

  * `/strategy/{memoryStrategyId}/actor/{actorId}/` – Store all episodes at the actor level. Episodes that come from different sessions, but that belong to the same actor, are stored in the same namespace.

  * `/strategy/{memoryStrategyId}/actor/{actorId}/session/{sessionId}/` – Store all episodes at the session level. Episodes that belong to the same session are stored in the same namespace.


Reflections must match the same namespace pattern as episodes, but reflections can be less nested. For example, if your episodic namespace is `/strategy/{memoryStrategyId}/actor/{actorId}/` , you can use the following namespaces for reflections:

  * `/strategy/{memoryStrategyId}/actor/{actorId}/` – Insights will be extracted across all episodes for an actor.

  * `/strategy/{memoryStrategyId}/` – Insights will be extracted across all episodes and across all actors for the strategy.


###### Important

Because reflections can span multiple actors within the same memory resource, consider the privacy implications of cross-actor analysis when retrieving reflections. Consider using [guardrails in conjunction with memory](<https://github.com/awslabs/amazon-bedrock-agentcore-samples/tree/main/01-features/04-manage-context-of-your-agent/memory/03-integrations/03-guardrails-integration>) or reflecting at the actor level if this is a concern.

## How to best retrieve episodes to improve agentic performance

There are multiple ways to utilize episodic memory:

  * Within your agent code

    * When starting a new task, configure your agent to perform a query asking for the most similar episodes and reflections. Also query for relevant episodes and reflection subsequently based on some logic.

    * When creating short-term memories with [CreateEvent](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateEvent.html>) , including `TOOL` results will yield optimal results.

    * For similar successful episodes, linearize the turns within the episode and feed only this to the agent so it focuses on the main steps

  * Manually

    * Look at your reflections or unsuccessful episodes, and consider whether some issues could be solved with updates to your agent code


When performing retrievals, note that memory records are indexed based on "intent" for episodes and "use case" for reflection.

For other memory strategies, memory records are generated on a regular basis throughout an interaction. Episodic memory records, by contrast, will only be generated once AgentCore Memory detects a completed episode. If an episode is not complete, it will take longer to generate because the systems waits to see if the conversation is continued.

