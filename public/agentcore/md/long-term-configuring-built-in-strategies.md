# Configure built-in strategies - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/long-term-configuring-built-in-strategies.html

---

# Configure built-in strategies

AgentCore Memory provides pre-configured, [built-in memory strategies](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./built-in-strategies.html>) for common use cases.

###### Topics

  * User preferences

  * Semantic

  * Session summaries

  * Episodic


## User preferences

The [user preferences](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./user-preference-memory-strategy.html>) ( `UserPreferenceMemoryStrategy` ) strategy is designed to automatically identify and extract user preferences, choices, and styles from conversations. This lets your agent build a persistent profile of each user, leading to more personalized and relevant interactions.

  * **Example use case:** An e-commerce agent remembers a user’s favorite brands and preferred size, letting it offer tailored product recommendations in future sessions.


**Configuration example:**

```python
import boto3

# Initialize the Boto3 client for control plane operations
control_client = boto3.client('bedrock-agentcore-control', region_name='us-west-2')

# Create memory resource with user preference strategy
response = control_client.create_memory(
    name="ECommerceAgentMemory",
    memoryStrategies=[
        {
            'userPreferenceMemoryStrategy': {
                'name': 'UserPreferenceExtractor',
                'namespaceTemplates': ['/users/{actorId}/preferences/']
            }
        }
    ]
)
```
## Semantic

The [Semantic](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./semantic-memory-strategy.html>) ( `SemanticMemoryStrategy` ) memory strategy is engineered to identify and extract key pieces of factual information and contextual knowledge from conversational data. This lets your agent build a persistent knowledge base about important entities, events, and details discussed during an interaction.

  * **Example use case:** A customer support agent remembers that order #ABC-123 is related to a specific support ticket, so the user doesn’t have to provide the order number again when following up.


**Configuration example:**

```python
import boto3

# Initialize the Boto3 client for control plane operations
control_client = boto3.client('bedrock-agentcore-control', region_name='us-west-2')

# Create memory resource with semantic strategy
response = control_client.create_memory(
    name="SupportAgentFactMemory",
    memoryStrategies=[
        {
            'semanticMemoryStrategy': {
                'name': 'FactExtractor',
                'namespaceTemplates': ['/support_cases/{sessionId}/facts/']
            }
        }
    ]
)
```
## Session summaries

The [session summaries](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./summary-strategy.html>) ( `SummaryMemoryStrategy` ) memory strategy creates condensed, running summaries of conversations as they happen within a single session. This captures the key topics and decisions, letting an agent quickly recall the context of a long conversation without needing to re-process the entire history.

  * **Example use case:** After a 30-minute troubleshooting session, the agent can access a summary like, "User reported issue with software v2.1, attempted a restart, and was provided a link to the knowledge base article."


**Configuration example:**

```python
import boto3

# Initialize the Boto3 client for control plane operations
control_client = boto3.client('bedrock-agentcore-control', region_name='us-west-2')

# Create memory resource with summary strategy
response = control_client.create_memory(
    name="TroubleshootingAgentSummaryMemory",
    memoryStrategies=[
        {
            'summaryMemoryStrategy': {
                'name': 'SessionSummarizer',
                'namespaceTemplates': ['/summaries/{actorId}/{sessionId}/']
            }
        }
    ]
)
```
## Episodic

The [episodic](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./episodic-memory-strategy.html>) ( `EpisodicStrategy` ) memory strategy captures interactions as structured episodes consisting of scenarios, intents, thoughts, actions taken, outcomes, and artifacts. With this strategy, reflections are also made across episodes to extract broader insights, letting an agent learn and apply successful patterns from prior interactions to new interactions.

  * **Example use case:** A customer support agent logs interactions as episodes. The system captures which phrases and actions lead to successful interactions


**Configuration example:**

```python
import boto3

# Initialize the Boto3 client for control plane operations
control_client = boto3.client('bedrock-agentcore-control', region_name='us-west-2')

# Create memory resource with episodic strategy
response = control_client.create_memory(
    name="MyMemory",
    memoryStrategies=[
        {
            'episodicMemoryStrategy': {
                'name': 'EpisodicStrategy',
                'namespaceTemplates': ['/strategy/{memoryStrategyId}/actors/{actorId}/sessions/{sessionId}/'],
                'reflection': {
                    'namespaceTemplates': ['strategy/{memoryStrategyId}/actors/{actorId}/']
                }
            }
        }
    ]
)
```
