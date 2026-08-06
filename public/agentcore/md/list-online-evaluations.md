# List online evaluations - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/list-online-evaluations.html

---

# List online evaluations

The `ListOnlineEvaluationConfigs` API retrieves a paginated list of all online evaluation configurations in your account and Region. This synchronous operation uses the POST method and returns summary information for each configuration.

The response includes an array of evaluation configuration summaries containing the configuration ARN, ID, name, description, lifecycle status (`ACTIVE`, `CREATING`, `CREATE_FAILED`, `UPDATING`, `UPDATE_FAILED`, `DELETING`, or `ERROR`), execution status (`ENABLED` or `DISABLED`), creation and update timestamps, and any failure reasons.

## Code samples for AgentCore SDK and AWS SDK

The following code samples demonstrate how to list online evaluation configurations using different development approaches. Choose the method that best fits your development environment and preferences.

###### Example

AgentCore SDK
    

  1. 
```python
from bedrock_agentcore_starter_toolkit import Evaluation

# Initialize the evaluation client
eval_client = Evaluation()

# List all online evaluation configurations, optionally filtered by agent.
configs= eval_client.list_online_configs()
agent_config_list = configs.get('onlineEvaluationConfigs', [])
print(f"Found {len(agent_config_list)} configuration(s) for this agent")
for cfg in agent_config_list:
    print(f"  • {cfg['onlineEvaluationConfigName']}")
    print(f"    ID: {cfg['onlineEvaluationConfigId']}")
    print(f"    Status: {cfg['status']}")
```
 


AWS SDK
    

  1. 
```python
import boto3

client = boto3.client('bedrock-agentcore-control')

list_configs_response = client.list_online_evaluation_configs(maxResults=20)
```
 


AWS CLI
    

  1. 
```bash
aws bedrock-agentcore-control list-online-evaluation-configs \
    --max-results 20
```
 


## Console

You can view and manage your online evaluation configurations through a visual interface that displays configuration details in an organized table format.

**To list online evaluation configurations**

  1. Open the Amazon Bedrock AgentCore console.

  2. In the navigation pane, choose **Evaluation**.

  3. In the **Evaluation configurations** card, view the table that lists the evaluation configurations you have created.



