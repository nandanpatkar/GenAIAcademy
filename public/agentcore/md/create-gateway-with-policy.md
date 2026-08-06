# Create gateway with Policy Engine - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/create-gateway-with-policy.html

---

# Create gateway with Policy Engine

This section provides examples of creating a gateway with a policy engine associated for policy enforcement.

###### Note

* The values for the authorization configuration are from when you set up inbound authorization. * If you choose an option that involves specifying an overt gateway service role ARN, ensure that you specify an existing one that you’ve set up. For more information, see Amazon Bedrock AgentCore Gateway service role permissions.

Select one of the following methods:

###### Example

AWS CLI
    

  1. Run the following code in a terminal to create a gateway with a Policy Engine using the AWS CLI:

```bash
aws bedrock-agentcore-control create-gateway \
  --name my-gateway \
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
    

  1. The following Python code shows how to create a gateway with a Policy Engine using the AWS Python SDK (Boto3):

```python
import boto3

gateway_client = boto3.client('bedrock-agentcore-control')

response = gateway_client.create_gateway(
    name='my-gateway',
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



