# Delete online evaluation - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/delete-online-evaluations.html

---

# Delete online evaluation

The `DeleteOnlineEvaluationConfig` API permanently removes an online evaluation configuration and stops all associated evaluation processing. This asynchronous operation disables the evaluation service and cleans up all related resources.

An online evaluation can only be deleted when the configuration is in `ACTIVE`, `UPDATE_FAILED`, `CREATE_FAILED`, or `ERROR` status. Configurations currently being created, updated, or deleted must complete their operations before another deletion is allowed.

## Code samples for AgentCore CLI, AgentCore SDK, and AWS SDK

The following code samples demonstrate how to delete online evaluation configurations using different development approaches. Choose the method that best fits your development environment and preferences.

###### Example

AgentCore CLI
    

  1. 
```bash
# Delete (with confirmation prompt)
agentcore remove online-eval --name "your_config_name"
agentcore deploy
```
 

The `remove` command removes the online evaluation configuration from your local project. Run `agentcore deploy` to apply the deletion to your AWS account.

###### Note

Run this from inside an AgentCore project directory (created with `agentcore create` ).


Interactive
    

  1. * Run `agentcore remove` and select **Online Eval Config** from the resource type menu.

![Remove resource type selection](/agentcore/images/eval-remove-select.png)


AgentCore SDK
    

  1. 
```python
from bedrock_agentcore_starter_toolkit import Evaluation

# Initialize the evaluation client
eval_client = Evaluation()
config_id = "config-abc123"
print(f"\nUsing config_id: {config_id}")

eval_client.delete_online_config(
     config_id=config_id,
     delete_execution_role=True  # Also delete the IAM role
)
```
 


AWS SDK
    

  1. 
```python
import boto3

client = boto3.client('bedrock-agentcore-control')

delete_config_response = client.delete_online_evaluation_config(
    onlineEvaluationConfigId='your_config_id'
)
```
 


AWS CLI
    

  1. 
```bash
aws bedrock-agentcore-control delete-online-evaluation-config \
    --online-evaluation-config-id your_config_id
```
 


## Console

Permanently remove an online evaluation configuration using the console interface, which includes confirmation prompts to prevent accidental deletion.

**To delete an online evaluation configuration**

  1. Open the Amazon Bedrock AgentCore console.

  2. In the navigation pane, choose **Evaluation**.

  3. In the **Evaluation configurations** card, view the table that lists the evaluation configurations you have created.

  4. Choose one of the following methods to delete the configuration:

     * Choose the evaluation configuration name to view its details, then choose **Delete** in the upper right of the details page.

     * Select the evaluation configuration so that it is highlighted, then choose **Delete** at the top of the **Evaluation configurations** card.

  5. Enter `confirm` to confirm the deletion.

  6. Choose **Delete** to delete the configuration.



