# Save and retrieve insights - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/long-term-saving-and-retrieving-insights.html

---

# Save and retrieve insights

Once you have configured an AgentCore Memory with at least one long-term memory strategy and the strategy is ACTIVE, the service will automatically begin processing conversational data to extract and store insights. This process involves two distinct steps: saving the raw conversation and then retrieving the structured insights after they have been processed.

## Step 1: Save conversational events to trigger extraction

The entire long-term memory process is triggered when you save conversational data to short-term memory using the `create_event` operation. Each time you record an event, you are providing new raw material for your active memory strategies to analyze.

###### Important

Only events that are created **after** a memory strategy’s status becomes `ACTIVE` will be processed for long-term memory extraction. Any conversations stored before the strategy was added and activated will not be included.

The following example shows how to save a multi-turn conversation to a memory resource.

**Example Save a conversation as a series of events**

```python
#'memory_id' is the ID of your memory resource with an active summary strategy.

from bedrock_agentcore.memory.session import MemorySessionManager
from bedrock_agentcore.memory.constants import ConversationalMessage, MessageRole
import time

actor_id = "User84"
session_id = "OrderSupportSession1"

# Create session manager
session_manager = MemorySessionManager(
    memory_id=memory_id,
    region_name="us-west-2"
)

# Create a session
session = session_manager.create_memory_session(
    actor_id=actor_id,
    session_id=session_id
)

print("Capturing conversational events...")

# Add all conversation turns
session.add_turns(
    messages=[
        ConversationalMessage("Hi, I'm having trouble with my order #12345", MessageRole.USER),
        ConversationalMessage("I am sorry to hear that. Let me look up your order.", MessageRole.ASSISTANT),
        ConversationalMessage("lookup_order(order_id='12345')", MessageRole.TOOL),
        ConversationalMessage("I see your order was shipped 3 days ago. What specific issue are you experiencing?", MessageRole.ASSISTANT),
        ConversationalMessage("The package arrived damaged", MessageRole.USER),
    ]
)

print("Conversation turns added successfully!")
```
## Step 2: Retrieve extracted insights

The extraction and consolidation of long-term memories is an **asynchronous process** that runs in the background. It may take a minute or more for insights from a new conversation to become available for retrieval. Your application logic should account for this delay.

To retrieve the structured insights, you use the `retrieve_memory_records` operation. This operation performs a powerful semantic search against the long-term memory store. You must provide the correct `namespace` that you defined in your strategy and a `searchQuery` that describes the information you are looking for.

The following example demonstrates how to wait for processing and then retrieve a summary of the conversation saved in the previous step.

**Example Wait and retrieve a session summary**

```bash
# 'session' is an existing session object that you created when adding the coversation turns
# session should be created on a memory resource with an active summary strategy.

# --- Example 1: Retrieve the user's shipping issues under a specific namespace ---
memories = session.search_long_term_memories(
    namespace=f"/summaries/{actor_id}/{session_id}/",
    query="What problem did the user report with their order?",
    top_k=5
)

# --- Example 2: Retrieve the user's shipping issues under a particular namespace hierarchy (e.g.: shipping issues across multiple sessions) ---
memories = session.search_long_term_memories(
    namespace_path=f"/summaries/{actor_id}/",
    query="What problem did the user report with their order?",
    top_k=5
)

print(f"Found {len(memories)} memories:")
for memory_record in memories:
    print(f"Retrieved Issue Detail: {memory_record}")
    print("--------------------------------------------------------------------")

# Example Output:
# Retrieved Issue Detail: The user reported that their package for order #12345 arrived damaged.
```
