# Data encryption - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/data-encryption.html

---

# Data encryption

## Encryption at rest

Amazon Bedrock AgentCore stores data at rest using Amazon DynamoDB and Amazon Simple Storage Service (Amazon S3). The data at rest is encrypted using AWS encryption solutions by default. AgentCore encrypts your data using AWS owned encryption keys from AWS Key Management Service. You don’t have to take any action to protect the AWS managed keys that encrypt your data. For more information, see [AWS owned keys](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/kms/latest/developerguide/concepts.html#aws-owned-cmk>) in the _AWS Key Management Service Developer Guide_.

**Key considerations**

  * The following data is not encrypted by default:

    * Gateway names

    * Gateway target names

    * Gateway tool names

    * Gateway CloudWatch logs

  * Customers can encrypt the following resources with a customer-managed KMS key:

    * Gateways – For more information, see [Encrypt your AgentCore gateway with a customer-managed KMS key](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-encryption.html>).


## Encryption in transit

All communication between customers and Amazon Bedrock AgentCore and between AgentCore and its downstream dependencies is protected using TLS 1.2 or higher connections.

Encryption in transit is configured by default for the following services:

**Key considerations**

  * All outbound traffic for AgentCore Gateway is protected using TLS.

  * When invoking a gateway, note the following about the data that is transferred:

    * During a _call tool_ request, the service transforms the data in the request and makes a call to the customer-configured web service. The response from the web service is transformed and returned as a _call tool_ response to the invoker.

    * During a _list tools_ request, the request is a standard MCP list/tools operation request and the response contains a list of tools configured on the gateway by the customer during control plane operations.


## Key management

You can use AWS KMS customer managed keys for the following Amazon Bedrock AgentCore resources:

**Resources that support AWS KMS customer managed keys**

  * Memories. For more information, see [Create an AgentCore Memory](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-create-a-memory-store.html>).

  * Gateways. For more information, see [Encrypt your AgentCore gateway with a customer-managed KMS key](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-encryption.html>) . Note the following:

    * For AgentCore Gateway resources, AWS managed keys are single-tenant use and different for each region.

    * If a key encrypting your gateway is compromised, you should rotate the key or delete the gateway and create a new one with a new key.

    * AgentCore Gateway integrates with AWS Certificate Manager. For more information, see [AWS Certificate Manager User Guide](<https://docs.aws.amazon.com/acm/latest/userguide/>)



