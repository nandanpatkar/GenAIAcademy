# Strands Agents SDK - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/strands-sdk-memory.html

---

# Strands Agents SDK

Use the [Strands Agents](<https://strandsagents.com/latest/>) SDK for seamless integration with agent frameworks, providing automatic memory management and retrieval within conversational agents.

First, create a memory with all three long-term strategies. You can do this with the AgentCore CLI or through the SDK code in the examples below.

###### Example

AgentCore CLI
    

  1. The AgentCore CLI memory commands must be run inside an existing agentcore project. If you don’t have one yet, create a project first:

```bash
agentcore create --name my-agent --no-agent
cd my-agent
```
Then add memory and deploy:

```bash
agentcore add memory --name ComprehensiveAgentMemory \
  --strategies SEMANTIC,SUMMARIZATION,USER_PREFERENCE
agentcore deploy
```
Interactive
    

  1. Run `agentcore` to open the TUI, then select **add** and choose **Memory** :

  2. Enter the memory name:

![Memory wizard: enter ComprehensiveAgentMemory name](/agentcore/images/strands-memory-add-name.png)

  3. Select all three strategies (Semantic, Summarization, User preference):

![Memory wizard: select all three memory strategies](/agentcore/images/strands-memory-add-strategies.png)

  4. Review the configuration and press Enter to confirm:

![Memory wizard: confirm ComprehensiveAgentMemory with all strategies](/agentcore/images/strands-memory-add-confirm.png)

Then run `agentcore deploy` to provision the memory in AWS.


**Install dependencies**

```bash
pip install bedrock-agentcore
pip install strands-agents
```
**Add short-term memory**

```python
from datetime import datetime
from strands import Agent
from bedrock_agentcore.memory import MemoryClient
from bedrock_agentcore.memory.integrations.strands.config import AgentCoreMemoryConfig, RetrievalConfig
from bedrock_agentcore.memory.integrations.strands.session_manager import AgentCoreMemorySessionManager

client = MemoryClient(region_name="us-east-1")
basic_memory = client.create_memory(
    name="BasicTestMemory",
    description="Basic memory for testing short-term functionality"
)

MEM_ID = basic_memory.get('id')
ACTOR_ID = "actor_id_test_%s" % datetime.now().strftime("%Y%m%d%H%M%S")
SESSION_ID = "testing_session_id_%s" % datetime.now().strftime("%Y%m%d%H%M%S")

# Configure memory
agentcore_memory_config = AgentCoreMemoryConfig(
    memory_id=MEM_ID,
    session_id=SESSION_ID,
    actor_id=ACTOR_ID
)

# Create session manager
session_manager = AgentCoreMemorySessionManager(
    agentcore_memory_config=agentcore_memory_config,
    region_name="us-east-1"
)

# Create agent
agent = Agent(
    system_prompt="You are a helpful assistant. Use all you know about the user to provide helpful responses.",
    session_manager=session_manager,
)

agent("I like sushi with tuna")
# Agent remembers this preference

agent("I like pizza")
# Agent acknowledges both preferences

agent("What should I buy for lunch today?")
# Agent suggests options based on remembered preferences
```
**Add long-term memory with strategies**

```python
from bedrock_agentcore.memory import MemoryClient
from strands import Agent
from bedrock_agentcore.memory.integrations.strands.config import AgentCoreMemoryConfig, RetrievalConfig
from bedrock_agentcore.memory.integrations.strands.session_manager import AgentCoreMemorySessionManager
from datetime import datetime

# Create comprehensive memory with all built-in strategies
client = MemoryClient(region_name="us-east-1")
comprehensive_memory = client.create_memory_and_wait(
    name="ComprehensiveAgentMemory",
    description="Full-featured memory with all built-in strategies",
    strategies=[
        {
            "summaryMemoryStrategy": {
                "name": "SessionSummarizer",
                "namespaceTemplates": ["/summaries/{actorId}/{sessionId}/"]
            }
        },
        {
            "userPreferenceMemoryStrategy": {
                "name": "PreferenceLearner",
                "namespaceTemplates": ["/preferences/{actorId}/"]
            }
        },
        {
            "semanticMemoryStrategy": {
                "name": "FactExtractor",
                "namespaceTemplates": ["/facts/{actorId}/"]
            }
        }
    ]
)

MEM_ID = comprehensive_memory.get('id')
ACTOR_ID = "actor_id_test_%s" % datetime.now().strftime("%Y%m%d%H%M%S")
SESSION_ID = "testing_session_id_%s" % datetime.now().strftime("%Y%m%d%H%M%S")

# Configure memory
agentcore_memory_config = AgentCoreMemoryConfig(
    memory_id=MEM_ID,
    session_id=SESSION_ID,
    actor_id=ACTOR_ID
)

# Create session manager
session_manager = AgentCoreMemorySessionManager(
    agentcore_memory_config=agentcore_memory_config,
    region_name="us-east-1"
)

# Create agent
agent = Agent(
    system_prompt="You are a helpful assistant. Use all you know about the user to provide helpful responses.",
    session_manager=session_manager,
)

agent("I like sushi with tuna")
# Agent remembers this preference

agent("I like pizza")
# Agent acknowledges both preferences

agent("What should I buy for lunch today?")
# Agent suggests options based on remembered preferences
```
**Message batching**

When `batch_size` is greater than 1, messages are buffered in memory and sent to AgentCore Memory in a single API call once the buffer reaches the configured size. This reduces the number of API requests in high-throughput conversations.

###### Important

When using `batch_size > 1` , you **must** use a `with` block or call `close()` when the session is complete. Otherwise, any buffered messages that have not yet reached the batch threshold will be lost.

_Recommended: Context manager_

```python
from strands import Agent
from bedrock_agentcore.memory.integrations.strands.config import AgentCoreMemoryConfig
from bedrock_agentcore.memory.integrations.strands.session_manager import AgentCoreMemorySessionManager

config = AgentCoreMemoryConfig(
    memory_id=MEM_ID,
    session_id=SESSION_ID,
    actor_id=ACTOR_ID,
    batch_size=10,  # Buffer up to 10 messages before sending
)

# The `with` block guarantees all buffered messages are flushed on exit
with AgentCoreMemorySessionManager(config, region_name='us-east-1') as session_manager:
    agent = Agent(
        system_prompt="You are a helpful assistant.",
        session_manager=session_manager,
    )
    agent("Hello!")
    agent("Tell me about AWS")
# All remaining buffered messages are automatically flushed here
```
_Alternative: Explicit close()_

If you cannot use a `with` block, call `close()` manually:

```text
session_manager = AgentCoreMemorySessionManager(config, region_name='us-east-1')
try:
    agent = Agent(
        system_prompt="You are a helpful assistant.",
        session_manager=session_manager,
    )
    agent("Hello!")
finally:
    session_manager.close()  # Flush any remaining buffered messages
```
More examples are available on GitHub: [https://github.com/aws/bedrock-agentcore-sdk-python/tree/main/src/bedrock_agentcore/memory/integrations/strands](<https://github.com/aws/bedrock-agentcore-sdk-python/tree/main/src/bedrock_agentcore/memory/integrations/strands>)

