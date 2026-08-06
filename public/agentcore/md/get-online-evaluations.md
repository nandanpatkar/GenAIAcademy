# Get online evaluation - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/get-online-evaluations.html

---

# Get online evaluation

The `GetOnlineEvaluationConfig` API retrieves the complete details and current status of an existing online evaluation configuration. This synchronous operation returns the full configuration including data sources, evaluators, execution status, and operational metadata.

Use this API to monitor the configuration’s lifecycle status (`ACTIVE`, `CREATING`, `CREATE_FAILED`, `UPDATING`, `UPDATE_FAILED`, `DELETING`, or `ERROR`), check current execution status (`ENABLED` or `DISABLED`), and retrieve all configuration parameters including evaluator lists, data source settings, and output destinations.

## Lifecycle status

The `status` field on an online evaluation configuration reports its lifecycle state, which is separate from the `executionStatus` field that controls whether the evaluation job is actively processing traces.

  * `ACTIVE` – The configuration is fully provisioned and ready to use.

  * `CREATING` – The configuration is being provisioned. Wait for it to transition to `ACTIVE` before updating or deleting.

  * `CREATE_FAILED` – Creation did not complete successfully. You cannot update a configuration in this state; call `DeleteOnlineEvaluationConfig` to remove it and then create a new one.

  * `UPDATING` – An update is in progress. Wait for the operation to complete before making additional changes.

  * `UPDATE_FAILED` – The most recent update did not apply. You can retry by calling `UpdateOnlineEvaluationConfig` again or remove the configuration with `DeleteOnlineEvaluationConfig`.

  * `DELETING` – The configuration is being removed.

  * `ERROR` – A problem occurred that requires your action. Check the `failureReason` field to identify the issue. Common causes include insufficient IAM role access, missing log group permissions, and exceeded service quotas. After fixing the issue, call `UpdateOnlineEvaluationConfig` to retry or `DeleteOnlineEvaluationConfig` to remove the configuration.


## Code samples for AgentCore SDK and AWS SDK

The following code samples demonstrate how to get online evaluation configuration details using different development approaches. Choose the method that best fits your development environment and preferences.

###### Example

AgentCore SDK
    

  1. 
```python
from bedrock_agentcore_starter_toolkit import Evaluation

# Initialize the evaluation client
eval_client = Evaluation()

config_id = "config-abc123"
print(f"\nUsing config_id: {config_id}")

config_details = eval_client.get_online_config(config_id)
# Display configuration details
print(f"Config Name: {config_details['onlineEvaluationConfigName']}")
print(f"Config ID: {config_details['onlineEvaluationConfigId']}")
print(f"Status: {config_details['status']}")
```
 


AWS SDK
    

  1. 
```python
import boto3

client = boto3.client('bedrock-agentcore-control')

response = client.get_online_evaluation_config(
    onlineEvaluationConfigId='your_config_id'
)
```
 


AWS CLI
    

  1. 
```bash
aws bedrock-agentcore-control get-online-evaluation-config \
    --online-evaluation-config-id your_config_id
```
 


## Console

You can view detailed information about a specific online evaluation configuration through the console interface.

**To get online evaluation configuration details**

  1. Open the Amazon Bedrock AgentCore console.

  2. In the navigation pane, choose **Evaluation**.

  3. In the **Evaluation configurations** card, view the table that lists the evaluation configurations you have created.

  4. To view information for a specific evaluation configuration, choose the configuration name to view its details.



