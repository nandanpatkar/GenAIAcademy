# Get started with AgentCore Memory - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-get-started.html

---

# Get started with AgentCore Memory

Amazon Bedrock Amazon Bedrock AgentCore Memory lets you create and manage AgentCore Memory resources that store conversation context for your AI agents. This getting started guides you through installing dependencies and implementing both short-term and long-term memory features. The instructions use the AgentCore CLI.

The steps are as follows:

  1. Create an AgentCore Memory containing a semantic strategy

  2. Write events (conversation history) to the memory resource

  3. Retrieve memory records from long term memory


For other examples, see [Amazon Bedrock AgentCore Memory examples](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-examples.html>).

## Prerequisites

Before starting, make sure you have:

  * **AWS Account** with credentials configured ( `aws configure` )

  * **Python 3.10+** installed

  * Node.js 18+ installed (for the AgentCore CLI)


To get started with Amazon Bedrock Amazon Bedrock AgentCore Memory, install the dependencies, create an AgentCore CLI project, and set up a virtual environment. The below commands can be run directly in the terminal.

```bash
pip install bedrock-agentcore
npm install -g @aws/agentcore
agentcore create --name agentcore-memory-quickstart --no-agent
cd agentcore-memory-quickstart
python -m venv .venv
source .venv/bin/activate
```
The AgentCore CLI provides commands for creating and managing memory resources. Use `agentcore add memory` to create a memory, and `agentcore deploy` to provision it in AWS. For event operations and session management, use the AWS Python SDK (Boto3) ( `bedrock-agentcore` ).

###### Note

The AgentCore CLI helps you create and deploy memory resources. For the complete set of Amazon Bedrock AgentCore Memory operations, see the Boto3 documentation: [bedrock-agentcore-control](<https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/bedrock-agentcore-control.html>) and [bedrock-agentcore](<https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/bedrock-agentcore.html>).

**Full example:** See the [Amazon Bedrock AgentCore samples](<https://github.com/awslabs/amazon-bedrock-agentcore-samples/tree/main/01-features/04-manage-context-of-your-agent/memory>) that demonstrate steps 1-3.

## Step 1: Create an AgentCore Memory

You need an AgentCore Memory to start storing information for your agent. By default, memory events (which we refer to as short-term memory) can be written to an AgentCore Memory. For insights to be extracted and placed into long term memory records, the resource requires a _memory strategy_ which is a configuration that defines how conversational data should be processed, and what information to extract (such as facts, preferences, or summaries).

In this step, you create an AgentCore Memory with a semantic strategy so that both short term and long term memory can be utilized. This will take 2-3 minutes. You can also create AgentCore Memory resources in the AWS console.

Create memory with semantic strategy:

###### Example

AgentCore CLI
    

  1. 
```bash
agentcore add memory --name CustomerSupportSemantic --strategies SEMANTIC
agentcore deploy
```
 


Interactive
    

  1. Run `agentcore` to open the TUI, then select **add** and choose **Memory** :

  2. Enter the memory name:

![Memory wizard: enter name](/agentcore/images/memory-add-name.png)

  3. Select the **Semantic** strategy, then confirm:

![Memory wizard: select SEMANTIC strategy](/agentcore/images/memory-add-strategies.png)

Then run `agentcore deploy` to provision the memory in AWS.


After deployment, verify the memory was created:

```bash
agentcore status
```
## Step 2: Write events to memory

You can write events to an AgentCore Memory as short-term memory and extracts insights for long-term memory.

Writing events to memory has multiple purposes. First, event contents (most commonly conversation history) are stored as short-term memory. Second, relevant insights are pulled from events and written into memory records as a part of long-term memory.

The memory resource id, actor id, and session id are required to create an event. In this step, you create three events, simulating messages between an end user and a chat bot.

```python
import boto3
from bedrock_agentcore.memory import MemorySessionManager
from bedrock_agentcore.memory.constants import ConversationalMessage, MessageRole

control_client = boto3.client('bedrock-agentcore-control', region_name='us-west-2')

# Retrieve the memory created in Step 1
response = control_client.list_memories()
memory = response['memories'][0]
memory_id = memory['id']

# Create a session to store memory events
session_manager = MemorySessionManager(
    memory_id=memory_id,
    region_name="us-west-2")

session = session_manager.create_memory_session(
    actor_id="User1",
    session_id="OrderSupportSession1"
)

# Write memory events (conversation turns)
session.add_turns(
    messages=[
        ConversationalMessage(
            "Hi, how can I help you today?",
            MessageRole.ASSISTANT)],
)

session.add_turns(
    messages=[
        ConversationalMessage(
            "Hi, I am a new customer. I just made an order, but it hasn't arrived. The Order number is #35476",
            MessageRole.USER)],
)

session.add_turns(
    messages=[
        ConversationalMessage(
            "I'm sorry to hear that. Let me look up your order.",
            MessageRole.ASSISTANT)],
)
```
You can get events (turns) for a specific actor after they’ve been written.

```bash
# Get the last k turns in the session
turns = session.get_last_k_turns(k=5)

for turn in turns:
    print(f"Turn: {turn}")
```
In this case, you can see the last three events for the actor and session.

## Step 3: Retrieve records from long term memory

After the events were written to the memory resource, they were analyzed and useful information was sent to long term memory. Since the memory contains a semantic long term memory strategy, the system extracts and stores factual information.

You can list all memory records with:

```bash
# List all memory records
memory_records = session.list_long_term_memory_records(
    namespace_path="/"
)

for record in memory_records:
    print(f"Memory record: {record}")
    print("--------------------------------------------------------------------")
```
Or ask for the most relevant information as part of a semantic search:

```bash
# Perform a semantic search
memory_records = session.search_long_term_memories(
    query="can you summarize the support issue",
    namespace_path="/",
    top_k=3
)
```
Important information about the user is likely stored is long term memory. Agents can use long term memory rather than a full conversation history to make sure that LLMs are not overloaded with context.

## Adding memory to an existing agent

If you created a Strands agent without memory and want to add it later, follow these steps:

  1. Add a memory resource to your project:

```bash
agentcore add memory --name MyMemory --strategies SEMANTIC,SUMMARIZATION
agentcore deploy
```
  2. Create the `memory/` directory in your agent:

```bash
mkdir -p app/MyAgent/memory
```
  3. Create `app/MyAgent/memory/session.py` :

```python
import os
from typing import Optional
from bedrock_agentcore.memory.integrations.strands.config import AgentCoreMemoryConfig, RetrievalConfig
from bedrock_agentcore.memory.integrations.strands.session_manager import AgentCoreMemorySessionManager

MEMORY_ID = os.getenv("MEMORY_MYMEMORY_ID")
REGION = os.getenv("AWS_REGION")

def get_memory_session_manager(session_id: str, actor_id: str) -> Optional[AgentCoreMemorySessionManager]:
    if not MEMORY_ID:
        return None

    retrieval_config = {
        f"/users/{actor_id}/facts": RetrievalConfig(top_k=3, relevance_score=0.5),
        f"/summaries/{actor_id}/{session_id}": RetrievalConfig(top_k=3, relevance_score=0.5)
    }

    return AgentCoreMemorySessionManager(
        AgentCoreMemoryConfig(
            memory_id=MEMORY_ID,
            session_id=session_id,
            actor_id=actor_id,
            retrieval_config=retrieval_config,
        ),
        REGION
    )
```
  4. Update your `main.py` to use the session manager:

```python
from memory.session import get_memory_session_manager

@app.entrypoint
async def invoke(payload, context):
    session_id = getattr(context, 'session_id', 'default-session')
    user_id = getattr(context, 'user_id', 'default-user')

    agent = Agent(
        model=load_model(),
        session_manager=get_memory_session_manager(session_id, user_id),
        system_prompt="You are a helpful assistant.",
    )

    response = agent(str(payload.get("prompt", "")))
    return response
```
  5. Deploy the updated project:

```bash
agentcore deploy
```
###### Note

Each memory resource gets an environment variable `MEMORY_<NAME>_ID` (uppercase, with underscores) that is automatically available in your agent’s runtime environment after deployment.

## Cleanup

When you’re done with the memory resource, you can delete it:

```bash
agentcore remove memory --name CustomerSupportSemantic
agentcore deploy
```
## Next steps

Consider the following:

  * [Add another strategy](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./long-term-enabling-long-term-memory.html#long-term-adding-strategies-to-existing-memory>) to your memory resource.

  * [Enable observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-observability.html>) for more visibility into how memory is working

  * Look at further [examples](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-examples.html>).



