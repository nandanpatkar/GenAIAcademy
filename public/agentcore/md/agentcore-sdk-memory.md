# Amazon Bedrock AgentCore SDK - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-sdk-memory.html

---

# Amazon Bedrock AgentCore SDK

Use the [Amazon Bedrock AgentCore Python SDK](<https://github.com/aws/bedrock-agentcore-sdk-python>) for a higher-level abstraction that simplifies memory operations and provides convenient methods for common use cases.

**Install dependencies**

```bash
pip install bedrock-agentcore
```
**Add short-term memory**

```python
from bedrock_agentcore.memory import MemoryClient

client = MemoryClient(region_name="us-east-1")

memory = client.create_memory(
    name="CustomerSupportAgentMemory",
    description="Memory for customer support conversations",
)

client.create_event(
    memory_id=memory.get("id"), # This is the id from create_memory or list_memories
    actor_id="User84",  # This is the identifier of the actor, could be an agent or end-user.
    session_id="OrderSupportSession1", #Unique id for a particular request/conversation.
    messages=[
        ("Hi, I'm having trouble with my order #12345", "USER"),
        ("I'm sorry to hear that. Let me look up your order.", "ASSISTANT"),
        ("lookup_order(order_id='12345')", "TOOL"),
        ("I see your order was shipped 3 days ago. What specific issue are you experiencing?", "ASSISTANT"),
        ("Actually, before that - I also want to change my email address", "USER"),
        (
            "Of course! I can help with both. Let's start with updating your email. What's your new email?",
            "ASSISTANT",
        ),
        ("newemail@example.com", "USER"),
        ("update_customer_email(old='old@example.com', new='newemail@example.com')", "TOOL"),
        ("Email updated successfully! Now, about your order issue?", "ASSISTANT"),
        ("The package arrived damaged", "USER"),
    ],
)
```
**Add long-term memory with strategies**

```python
from bedrock_agentcore.memory import MemoryClient
import time

client = MemoryClient(region_name="us-east-1")

memory = client.create_memory_and_wait(
    name="MyAgentMemory",
    strategies=[{
        "summaryMemoryStrategy": {
            # Name of the extraction model/strategy
            "name": "SessionSummarizer",
            # Organize facts by session ID for easy retrieval
            # Example: "summaries/session123" contains summary of session123
            "namespaceTemplates": ["/summaries/{actorId}/{sessionId}/"]
        }
    }]
)

event = client.create_event(
    memory_id=memory.get("id"), # This is the id from create_memory or list_memories
    actor_id="User84",  # This is the identifier of the actor, could be an agent or end-user.
    session_id="OrderSupportSession1",
    messages=[
        ("Hi, I'm having trouble with my order #12345", "USER"),
        ("I'm sorry to hear that. Let me look up your order.", "ASSISTANT"),
        ("lookup_order(order_id='12345')", "TOOL"),
        ("I see your order was shipped 3 days ago. What specific issue are you experiencing?", "ASSISTANT"),
        ("Actually, before that - I also want to change my email address", "USER"),
        (
            "Of course! I can help with both. Let's start with updating your email. What's your new email?",
            "ASSISTANT",
        ),
        ("newemail@example.com", "USER"),
        ("update_customer_email(old='old@example.com', new='newemail@example.com')", "TOOL"),
        ("Email updated successfully! Now, about your order issue?", "ASSISTANT"),
        ("The package arrived damaged", "USER"),
    ],
)

# Wait for meaningful memories to be extracted from the conversation.
time.sleep(60)

# Query for the summary of the issue using the namespace set in summary strategy above
memories = client.retrieve_memories(
    memory_id=memory.get("id"),
    namespace=f"/summaries/User84/OrderSupportSession1/",
    query="can you summarize the support issue"
)
```
