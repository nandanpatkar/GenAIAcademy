# Create a policy engine - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-create-engine.html

---

# Create a policy engine

A policy engine is a collection of policies that evaluates and authorizes agent tool calls. When associated with a gateway, the policy engine intercepts all agent requests and determines whether to allow or deny each action based on the defined policies.

###### Topics

  * Prerequisites

  * Create a policy engine

  * Using the policy engine ARN


## Prerequisites

Before creating a policy engine, ensure you have a gateway setup. For more information, see [Building a gateway](<https://docs.aws.amazon.com//bedrock-agentcore/latest/devguide/gateway-building.html>).

## Create a policy engine

The following shows how to create a policy engine.

###### Example

AWS CLI
    

  1. Run the following code in a terminal to create a policy engine using the AWS CLI:

```bash
aws bedrock-agentcore-control create-policy-engine \
  --name my_policy_engine \
  --description "My Policy Engine"
```
The `policyEngineArn` in the response is the ARN to use when creating policies or associating with gateway.


AWS Python SDK (Boto3)
    

  1. The following Python code shows how to create a policy engine using the AWS Python SDK (Boto3):

```python
import boto3

client = boto3.client('bedrock-agentcore-control')

response = client.create_policy_engine(
    name='my_policy_engine',
    description='My Policy Engine'
)

print(f"Policy Engine ID: {response['policyEngineId']}")
print(f"Policy Engine ARN: {response['policyEngineArn']}")
```
## Using the policy engine ARN

The `policyEngineArn` returned when creating a policy engine is used for two main purposes:

  * **Creating policies** \- Use the ARN when adding policies to the engine

  * **Associating with gateways** \- Use the ARN to enable policy enforcement on gateways


For more information about creating policies, see [Create a policy](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./policy-create-policies.html>).

