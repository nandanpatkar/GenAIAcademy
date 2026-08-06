# Add policies to the Policy Engine - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/add-policies-to-engine.html

---

# Add policies to the Policy Engine

You can create one or more policies in your policy engine to control how agents interact with your enterprise tools and data through Amazon Bedrock AgentCore Gateway.

###### Note

Use the policy engine ID from the previous step. The validation mode controls how findings are handled. Schema checks always run regardless of the validation mode. `FAIL_ON_ANY_FINDINGS` runs both schema checks and semantic validation, rejecting the policy if either produces findings. `IGNORE_ALL_FINDINGS` runs only schema checks, and policies are accepted as long as they pass. For more information about validation and the types of findings, see [Validate and test policies](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./policy-validate-policies.html>).

Select one of the following methods:

###### Example

AWS CLI
    

  1. Run the following code in a terminal to create a policy using the AWS CLI:

```bash
aws bedrock-agentcore-control create-policy \
  --policy-engine-id my-policy-engine-id \
  --name my_policy \
  --validation-mode FAIL_ON_ANY_FINDINGS \
  --description "My Policy" \
  --definition '{
    "cedar": {
      "statement": "my-cedar-policy-statement"
    }
  }'
```
AWS Python SDK (Boto3)
    

  1. The following Python code shows how to create a policy using the AWS Python SDK (Boto3):

```python
import boto3

client = boto3.client('bedrock-agentcore-control')

response = client.create_policy(
    policyEngineId='my-policy-engine-id',
    name='my_policy',
    validationMode='FAIL_ON_ANY_FINDINGS',
    description='My Policy',
    definition={
        'cedar': {
            'statement': 'my-cedar-policy-statement'
        }
    }
)
print(f"Policy ID: {response['policyId']}")
```
