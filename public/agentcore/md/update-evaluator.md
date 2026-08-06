# Update evaluator - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/update-evaluator.html

---

# Update evaluator

The `UpdateEvaluator` API modifies an existing custom evaluator’s configuration, description, or evaluation level. This asynchronous operation is only allowed on unlocked evaluators.

**Modification lock protection:** Updates are not allowed if the evaluator has been used by any enabled evaluation configuration.

The API returns immediately with updated metadata. Monitor the evaluator status to confirm changes are applied successfully using the `GetEvaluator` API.

###### Topics

  * Code samples for AgentCore SDK and AWS SDK

  * Console


## Code samples for AgentCore SDK and AWS SDK

The following code samples demonstrate how to update evaluators using different development approaches. Choose the method that best fits your development environment and preferences.

###### Example

AgentCore CLI
    

  1. To update an evaluator with the AgentCore CLI, edit the evaluator configuration in your `agentcore.json` file directly, then redeploy:

```bash
agentcore deploy
```
Open `agentcore.json` , find the evaluator in the `evaluators` array, modify its configuration, then run `agentcore deploy` . Changes won’t take effect until you deploy.

###### Note

If the evaluator is locked by a running online evaluation, you must first pause the online evaluation with `agentcore pause online-eval` before making changes, or clone the evaluator instead. After deploying your changes, resume the online evaluation with `agentcore resume online-eval`.

###### Note

Run this from inside an AgentCore project directory (created with `agentcore create` ).


AgentCore SDK
    

  1. 
```python
from bedrock_agentcore_starter_toolkit import Evaluation

eval_client = Evaluation()

eval_client.update_evaluator(
        evaluator_id=evaluator_id,
        description="Updated custom evaluator description"
    )
```
 


AWS SDK
    

  1. 
```python
import boto3

client = boto3.client('bedrock-agentcore-control')

list_configs_response = client.update_evaluator(
    evaluatorId=evaluator_id,
    description="Updated custom evaluator description"
)
```
 


AWS CLI
    

  1. 
```bash
aws bedrock-agentcore-control update-evaluator \
    --evaluator-id 'evaluator-abc123' \
    --description "Updated custom evaluator description"
```
 


## Console

Modify your custom evaluator settings using the console’s editing interface, which provides form validation and guided configuration options.

**To update a custom evaluator**

  1. Open the Amazon Bedrock AgentCore console.

  2. In the navigation pane, choose **Evaluation**.

  3. Choose **Custom evaluators** next to Evaluation configurations.

  4. In the **Custom evaluators** card, view the table that lists the custom evaluators you have created.

  5. Choose one of the following methods to update the custom evaluator:

     * Choose the custom evaluator name to view its details, then choose **Edit** in the upper right of the details page.

     * Select the custom evaluator so that it is highlighted, then choose **Edit** at the top of the Custom evaluators card.

###### Note

If the evaluator is in use in any online evaluation, it cannot be updated. Instead, you can duplicate the evaluator and update the cloned version.

  6. Update the fields as needed.

  7. Choose **Update evaluator** to save the changes.



