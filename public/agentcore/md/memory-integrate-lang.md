# Integrate AgentCore Memory with LangChain or LangGraph - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-integrate-lang.html

---

# Integrate AgentCore Memory with LangChain or LangGraph

[LangChain and LangGraph](<https://www.langchain.com/langgraph>) are powerful open-source frameworks for developing agents through a graph-based architecture. They provide a simple interface for defining agent interactions with the user, its tools, and memory.

Within LangGraph there are two main memory concepts when it comes to memory [persistence](<https://docs.langchain.com/oss/python/langgraph/persistence>) . Short-term, raw context is saved through checkpoint objects, while intelligent long term memory retrieval is done by saving and searching through memory stores. To address these two use cases, integrations were created to cover both the checkpointing workflow and the store workflow:

  * `AgentCoreMemorySaver` \- used to save and load checkpoint objects that include user and AI messages, graph execution state, and additional metadata

  * `AgentCoreMemoryStore` \- used to save conversational messages, leaving the AgentCore Memory service to extract insights, summaries, and user preferences in the background, then letting the agent search through those intelligent memories in future conversations


These integrations are easy to set up, requiring only specifying the Memory ID of a AgentCore Memory. Because they are saved to persistent storage within the service, there is no need to worry about losing these interactions through container exits, unreliable in-memory solutions, or agent application crashes.

###### Topics

  * Prerequisites

  * Configuration for short term memory persistence

  * Configuration for intelligent long term memory search

  * Create the agent with configurations

  * Invoke the agent

  * Resources


## Prerequisites

Requirements you need before integrating AgentCore Memory with LangChain and LangGraph.

  1. AWS account with Bedrock Amazon Bedrock AgentCore access

  2. Configured AWS credentials (boto3)

  3. An AgentCore Memory

  4. Required IAM permissions:

     * `bedrock-agentcore:CreateEvent`

     * `bedrock-agentcore:ListEvents`

     * `bedrock-agentcore:RetrieveMemories`


## Configuration for short term memory persistence

The `AgentCoreMemorySaver` in LangGraph handles all the saving and loading of conversational state, execution context, and state variables under the hood through [AgentCore Memory blob types](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_CreateEvent.html#API_CreateEvent_RequestSyntax>) . This means that the only setup required is to specify the checkpointer when compiling the agent graph, then providing an `actor_id` and `thread_id` in the [RunnableConfig](<https://python.langchain.com/docs/concepts/runnables/#runnableconfig>) when invoking the agent. The configuration is shown below and the agent invocation is shown in the next section. If simple conversation persistence is all your application needs, feel free to skip the long term memory section.

```bash
# Import LangGraph and LangChain components
from langchain.chat_models import init_chat_model
from langgraph.prebuilt import create_react_agent

# Import the AgentCore Memory integrations
from langgraph_checkpoint_aws import AgentCoreMemorySaver

REGION = "us-west-2"
MEMORY_ID = "YOUR_MEMORY_ID"
MODEL_ID = "us.anthropic.claude-3-7-sonnet-20250219-v1:0"

# Initialize checkpointer for state persistence. No additional setup required.
# Sessions will be saved and persisted for actor_id/session_id combinations
checkpointer = AgentCoreMemorySaver(MEMORY_ID, region_name=REGION)
```
## Configuration for intelligent long term memory search

For long term memory stores in LangGraph, you have more flexibility on how messages are processed. For instance, if the application is only concerned with user preferences, you would only need to store the `HumanMessage` objects in the conversation. For summaries, all types `HumanMessage` , `AIMessage` , and `ToolMessage` would be relevant. There are numerous ways to do this, but a common implementation pattern is using pre and post model hooks, as shown in the example below. For retrieval of memories, you may add a `store.search(query)` call in the pre-model hook and append it to the user’s message so the agent has all the context. Alternatively, the agent could be provided a tool to search for information as needed. All of these implementation patterns are supported and the implementation will vary based on the application.

```python
from langgraph_checkpoint_aws import (
    AgentCoreMemoryStore
)

# Initialize store for saving and searching over long term memories
# such as preferences and facts across sessions
store = AgentCoreMemoryStore(MEMORY_ID, region_name=REGION)

# Pre-model hook runs and saves messages of your choosing to AgentCore Memory
# for async processing and extraction
def pre_model_hook(state, config: RunnableConfig, *, store: BaseStore):
    """Hook that runs pre-LLM invocation to save the latest human message"""
    actor_id = config["configurable"]["actor_id"]
    thread_id = config["configurable"]["thread_id"]

    # Saving the message to the actor and session combination that we get at runtime
    namespace = (actor_id, thread_id)

    messages = state.get("messages", [])
    # Save the last human message we see before LLM invocation
    for msg in reversed(messages):
        if isinstance(msg, HumanMessage):
            store.put(namespace, str(uuid.uuid4()), {"message": msg})
            break

    # OPTIONAL: Retrieve user preferences based on the last message and append to state
    # user_preferences_namespace = ("preferences", actor_id)
    # preferences = store.search(user_preferences_namespace, query=msg.content, limit=5)
    # # Add to input messages as needed

    return {"llm_input_messages": messages}
```
## Create the agent with configurations

Initialize the LLM and create a LangGraph agent with a memory configuration.

```bash
# Initialize LLM
llm = init_chat_model(MODEL_ID, model_provider="bedrock_converse", region_name=REGION)

# Create a pre-built langgraph agent (configurations work for custom agents too)
graph = create_react_agent(
    model=llm,
    tools=tools,
    checkpointer=checkpointer, # AgentCoreMemorySaver we created above
    store=store, # AgentCoreMemoryStore we created above
    pre_model_hook=pre_model_hook, # OPTIONAL: Function we defined to save user messages
    # post_model_hook=post_model_hook # OPTIONAL: Can save AI messages to memory if needed
)
```
## Invoke the agent

Invoke the agent.

```bash
# Specify config at runtime for ACTOR and SESSION
config = {
    "configurable": {
        "thread_id": "session-1", # REQUIRED: This maps to Bedrock AgentCore session_id under the hood
        "actor_id": "react-agent-1", # REQUIRED: This maps to Bedrock AgentCore actor_id under the hood
    }
}

# Invoke the agent
response = graph.invoke(
    {"messages": [("human", "I like sushi with tuna. In general seafood is great.")]},
    config=config
)

# ... agent will answer

# Agent will have the conversation and state persisted on the next message
# Because the session ID is the same in the runtime config
response = graph.invoke(
    {"messages": [("human", "What did I just say?")]},
    config=config
)

# Define a new session in the runtime config to test long term retrieval
config = {
    "configurable": {
        "thread_id": "session-2", # New session ID
        "actor_id": "react-agent-1", # Same actor ID
    }
}

# Invoke the agent (it will retrieve long term memories from other session)
response = graph.invoke(
    {"messages": [("human", "Lets make a meal tonight, what should I cook?")]},
    config=config
)
```
## Resources

  * [LangChain x AWS Github Repo](<https://github.com/langchain-ai/langchain-aws/tree/main>)

  * [Pypi package](<https://pypi.org/project/langgraph-checkpoint-aws/>)

  * [AgentCoreMemorySaver implementation](<https://github.com/langchain-ai/langchain-aws/blob/main/libs/langgraph-checkpoint-aws/langgraph_checkpoint_aws/agentcore/saver.py>)

  * [AgentCoreMemorySaver sample notebook (checkpointing only)](<https://github.com/langchain-ai/langchain-aws/blob/main/samples/memory/agentcore_memory_checkpointer.ipynb>)



