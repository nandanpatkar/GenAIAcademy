# Update existing gateway with Policy Engine - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/update-gateway-with-policy.html

---

# Update existing gateway with Policy Engine

Associate a policy engine with an existing gateway:

###### Example

AWS CLI
    

  1. Run the following code in a terminal to update a gateway with a Policy Engine using the AWS CLI:

```bash
aws bedrock-agentcore-control update-gateway \
  --gateway-identifier my-gateway-id \
  --role-arn arn:aws:iam::123456789012:role/my-gateway-service-role \
  --protocol-type MCP \
  --authorizer-type CUSTOM_JWT \
  --authorizer-configuration '{
    "customJWTAuthorizer": {
      "discoveryUrl": "https://cognito-idp.us-west-2.amazonaws.com/some-user-pool/.well-known/openid-configuration",
      "allowedClients": ["clientId"]
    }
  }' \
  --policy-engine-configuration '{
    "mode": "ENFORCE",
    "arn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:policy-engine/my_policy_engine"
  }'
```
The gatewayUrl in the response is the endpoint to use when you invoke the gateway.


AWS Python SDK (Boto3)
    

  1. The following Python code shows how to update a gateway with a Policy Engine using the AWS Python SDK (Boto3):

```python
import boto3

gateway_client = boto3.client('bedrock-agentcore-control')

response = gateway_client.update_gateway(
    name='my-gateway-name',
    gatewayId='my-gateway-id',
    protocolType='MCP',
    authorizerType='CUSTOM_JWT',
    authorizerConfiguration={
        'customJWTAuthorizer': {
            'allowedClients': ['clientId'],
            'discoveryUrl': 'https://cognito-idp.us-west-2.amazonaws.com/some-user-pool/.well-known/openid-configuration'
        }
    },
    roleArn='arn:aws:iam::123456789012:role/my-gateway-service-role',
    policyEngineConfiguration={
        'mode': 'ENFORCE',
        'arn': 'arn:aws:bedrock-agentcore:us-west-2:123456789012:policy-engine/my_policy_engine'
    }
)

print(f"GATEWAY ARN: {response['gatewayArn']}")
print(f"GATEWAY URL: {response['gatewayUrl']}")
```
The gatewayUrl in the response is the endpoint to use when you invoke the gateway.



