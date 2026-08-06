# AWS SDK - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/aws-sdk-memory.html

---

# AWS SDK

Use the AWS SDK to directly interact with AgentCore Memory fine-grained control over memory operations. The following examples show how to access the AWS SDK with the [SDK for Python (Boto3)](<https://boto3.amazonaws.com/v1/documentation/api/latest/index.html>).

**Install dependencies**

```bash
pip install boto3
```
**Add short-term memory**

```python
import boto3
from datetime import datetime

# Initialize boto3 clients
control_client = boto3.client('bedrock-agentcore-control', region_name='us-east-1')
data_client = boto3.client('bedrock-agentcore', region_name='us-east-1')

# Create short-term memory
memory_response = control_client.create_memory(
    name="BasicMemory",
    description="Basic memory for short-term event storage",
    eventExpiryDuration=90
)

memory_id = memory_response['memory']['id']
actor_id = f"actor_{datetime.now().strftime('%Y%m%d%H%M%S')}"
session_id = f"session_{datetime.now().strftime('%Y%m%d%H%M%S')}"

# Create event with multiple conversation turns
event = data_client.create_event(
    memoryId=memory_id,
    actorId=actor_id,
    sessionId=session_id,
    eventTimestamp=datetime.now(),
    payload=[
        {
            'conversational': {
                'content': {'text': 'I like sushi with tuna'},
                'role': 'USER'
            }
        },
        {
            'conversational': {
                'content': {'text': 'That sounds delicious! Tuna sushi is a great choice.'},
                'role': 'ASSISTANT'
            }
        },
        {
            'conversational': {
                'content': {'text': 'I also like pizza'},
                'role': 'USER'
            }
        },
        {
            'conversational': {
                'content': {'text': 'Pizza is another excellent choice! You have great taste in food.'},
                'role': 'ASSISTANT'
            }
        }
    ]
)
```
**Add long-term memory with strategies**

```python
import boto3
import time
from datetime import datetime

# Initialize boto3 clients
control_client = boto3.client('bedrock-agentcore-control', region_name='us-east-1')
data_client = boto3.client('bedrock-agentcore', region_name='us-east-1')

# Create long-term memory
memory_response = control_client.create_memory(
    name=f"ComprehensiveMemory",
    description="Memory with strategies for long-term memory extraction",
    eventExpiryDuration=90,
    memoryStrategies=[
        {
            'summaryMemoryStrategy': {
                'name': 'SessionSummarizer',
                'namespaceTemplates': ['/summaries/{actorId}/{sessionId}/']
            }
        },
        {
            'userPreferenceMemoryStrategy': {
                'name': 'PreferenceLearner',
                'namespaceTemplates': ['/preferences/{actorId}/']
            }
        },
        {
            'semanticMemoryStrategy': {
                'name': 'FactExtractor',
                'namespaceTemplates': ['/facts/{actorId}/']
            }
        }
    ]
)

memory_id = memory_response['memory']['id']
actor_id = f"actor_{datetime.now().strftime('%Y%m%d%H%M%S')}"
session_id = f"session_{datetime.now().strftime('%Y%m%d%H%M%S')}"

########## Wait for long-term memory to become active ##########

while True:
    mem_status_response = control_client.get_memory(memoryId=memory_id)
    status = mem_status_response.get('memory', {}).get('status')
    if status == 'ACTIVE':
        print("Memory resource is now ACTIVE.")
        break
    elif status == 'FAILED':
        raise Exception("Memory resource creation FAILED.")
    print("Waiting for memory to become active...")
    time.sleep(10)

# Create single event with all conversation turns
event = data_client.create_event(
    memoryId=memory_id,
    actorId=actor_id,
    sessionId=session_id,
    eventTimestamp=datetime.now(),
    payload=[
        {
            'conversational': {
                'content': {'text': 'I like sushi with tuna'},
                'role': 'USER'
            }
        },
        {
            'conversational': {
                'content': {'text': 'That sounds delicious! Tuna sushi is a great choice.'},
                'role': 'ASSISTANT'
            }
        },
        {
            'conversational': {
                'content': {'text': 'I also like pizza'},
                'role': 'USER'
            }
        },
        {
            'conversational': {
                'content': {'text': 'Pizza is another excellent choice! You have great taste in food.'},
                'role': 'ASSISTANT'
            }
        }
    ]
)
```
Full AWS SDK Amazon Bedrock AgentCore AgentCore Memory API reference can be found at:

  * [https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/bedrock-agentcore.html](<https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/bedrock-agentcore.html>)

  * [https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/bedrock-agentcore-control.html](<https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/bedrock-agentcore-control.html>)



