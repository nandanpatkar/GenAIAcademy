# Enable long-term memory - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/long-term-enabling-long-term-memory.html

---

# Enable long-term memory

You can enable long-term memory in two ways: by adding strategies when you first [create an AgentCore Memory](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-create-a-memory-store.html>) , or by updating an existing resource to include them.

## Creating a new memory with long-term strategies

The most direct method is to include strategies when you create a new AgentCore Memory. After calling `create_memory` , you must wait for the AgentCore Memory status to become `ACTIVE` before you can use it.

###### Example

AgentCore CLI
    

  1. 
```bash
agentcore add memory --name PersonalizedShoppingAgentMemory --strategies USER_PREFERENCE
agentcore deploy
```
 


Interactive
    

  1. Run `agentcore` to open the TUI, then select **add** and choose **Memory** :

  2. Select the **User preference** strategy:

![Memory wizard: select USER_PREFERENCE strategy](/agentcore/images/memory-add-strategies.png)

  3. Review the configuration and press Enter to confirm:

![Memory wizard: confirm memory configuration](/agentcore/images/memory-add-confirm.png)

Then run `agentcore deploy` to provision the memory in AWS.


## Adding long-term strategies to an existing AgentCore Memory

To add long-term capabilities to an existing AgentCore Memory, you use the `update_memory` operation. You can add, modify or delete strategies for an existing memory.

###### Note

The AgentCore CLI supports creating and managing memory resources. To update memory strategies on an existing memory, use the AWS SDK.

**Example Add a Session Summary strategy to an existing AgentCore Memory**

```python
import boto3

# Initialize the Boto3 client for control plane operations
control_client = boto3.client('bedrock-agentcore-control', region_name='us-west-2')

# Assume 'memory_id' is the ID of an existing AgentCore Memory that has no strategies attached to it
memory_id = "your-existing-memory-id"

# Update the memory to add a summary strategy
response = control_client.update_memory(
    memoryId=memory_id,
    memoryStrategies=[
        {
            'summaryMemoryStrategy': {
                'name': 'SessionSummarizer',
                'description': 'Summarizes conversation sessions for context',
                'namespaceTemplates': ['/summaries/{actorId}/{sessionId}/']
            }
        }
    ]
)

print(f"Successfully submitted update for memory ID: {memory_id}")

# Validate strategy was added to the memory
memory_response = control_client.get_memory(memoryId=memory_id)
strategies = memory_response.get('memory', {}).get('strategies', [])
print(f"Memory strategies for memoryID: {memory_id} are: {strategies}")
```
###### Note

Long-term memory records will only be extracted from conversational events that are stored **after** a new strategy becomes `ACTIVE` . Conversations stored before a strategy is added will not be processed for long-term memory.

