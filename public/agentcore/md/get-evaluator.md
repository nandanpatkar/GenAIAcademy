# Get evaluator - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/get-evaluator.html

---

# Get evaluator

The `GetEvaluator` API retrieves complete details of a specific custom or built-in evaluator including its configuration, status, and lock state.

**Lock status:** The response includes lockedForModification indicating whether the evaluator is in use by an enabled evaluation configuration. Locked evaluators cannot be modified.

Use this API to inspect evaluator settings, verify configuration changes, and check availability for modification or deletion.

###### Topics

  * Code samples for AgentCore SDK and AWS SDK

  * Console


## Code samples for AgentCore SDK and AWS SDK

The following code samples demonstrate how to get evaluator details using different development approaches. Choose the method that best fits your development environment and preferences.

###### Example

AgentCore SDK
    

  1. 
```python
from bedrock_agentcore_starter_toolkit import Evaluation

eval_client = Evaluation()

eval_client.get_evaluator(evaluator_id="your_evaluator_id")
```
 


AWS SDK
    

  1. 
```python
import boto3

client = boto3.client('bedrock-agentcore-control')

list_configs_response = client.get_evaluator(evaluatorId='your_evaluator_id')
```
 


AWS CLI
    

  1. 
```bash
aws bedrock-agentcore-control get-evaluator \
    --evaluator-id 'your_evaluator_id'
```
 


## Console

View detailed information about a specific custom evaluator, including its configuration, status, and usage history through the console interface.

**To get custom evaluator details**

  1. Open the Amazon Bedrock AgentCore console.

  2. In the navigation pane, choose **Evaluation**.

  3. Choose **Custom evaluators** next to Evaluation configurations.

  4. In the **Custom evaluators** card, view the table that lists the custom evaluators you have created.

  5. To view information for a specific custom evaluator, choose the custom evaluator name to view its details.



