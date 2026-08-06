# Encrypt your AgentCore gateway with a customer-managed KMS key - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-encryption.html

---

# Encrypt your AgentCore gateway with a customer-managed KMS key

By default, Gateway encrypts your data at rest using a service-managed AWS Key Management Service key. However, you can optionally provide your own customer managed KMS key for encrypting data at rest when you:

  * Create a gateway.

  * Update a gateway’s configurations.


Using a customer managed key gives you more control over the encryption process, including the ability to:

  * Rotate the key on your own schedule

  * Control access to the key through IAM policies

  * Disable or delete the key when it’s no longer needed

  * Audit key usage through CloudWatch logs and AWS CloudTrail


For more information, see [AWS Key Management Service Developer Guide](<https://docs.aws.amazon.com/kms/latest/developerguide/>).

###### Note

If you choose to use a customer managed key, you are responsible for managing the key and its permissions. If the key is disabled or deleted, or if Gateway loses permission to use the key, you will lose access to the encrypted data.

## Prerequisites for encrypting your AgentCore gateway

Before encrypting your gateway, ensure that you have fulfilled the following prerequisites:

  * You have access to a KMS key. For information about creating a KMS key, see [Create a KMS key](<https://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html>).

  * The KMS key has a key policy attached to it that allows the following permissions:

    * Permissions that allow the gateway service role to perform the following actions:

      * kms:CreateGrant

      * kms:DescribeKey

      * kms:Decrypt

      * kms:GenerateDataKey

    * (If you enable CloudWatch Logs for your gateway) Permissions that allow the CloudWatch Logs service to decrypt the key.

For more information about controlling IAM permissions for a KMS key, see [KMS key access and permissions](<https://docs.aws.amazon.com/kms/latest/developerguide/control-access.html>) in the AWS Key Management Service Developer Guide.


**Example key policy**

The following example policy provides the necessary permissions to encrypt a gateway and use an encrypted gateway. The fourth statement also allows CloudWatch Logs logging of key usage for the encrypted gateway. The policy contains condition keys to conform to security best practices.

```json
{
"Version":"2012-10-17",
  "Statement": [
    {
      "Sid": "AllowServiceRoleDescribeKey",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:role/GatewayServiceRole"
      },
      "Action": [
        "kms:DescribeKey"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "kms:ViaService": [
            "bedrock-agentcore.us-east-1.amazonaws.com"
          ]
        }
      }
    },
    {
      "Sid": "AllowServiceRoleDecryptKey",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:role/GatewayServiceRole"
      },
      "Action": [
        "kms:Decrypt",
        "kms:GenerateDataKey"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "kms:ViaService": [
            "bedrock-agentcore.us-east-1.amazonaws.com"
          ]
        },
        "StringLike": {
          "kms:EncryptionContext:aws:bedrock-agentcore-gateway:arn": "arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/GatewayId"
        }
      }
    },
    {
      "Sid": "AllowServiceRoleCreateGrant",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:role/GatewayServiceRole"
      },
      "Action": "kms:CreateGrant",
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "kms:ViaService": [
            "bedrock-agentcore.us-east-1.amazonaws.com"
          ],
          "kms:GrantConstraintType": "EncryptionContextSubset"
        },
        "ForAllValues:StringEquals": {
          "kms:GrantOperations": [
            "Decrypt",
            "GenerateDataKey"
          ]
        },
        "StringLike": {
          "kms:EncryptionContext:aws:bedrock-agentcore-gateway:arn": "arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/GatewayId"
        }
      }
    },
    {
      "Sid": "AllowKMSDecryptionLogging",
      "Effect": "Allow",
      "Principal": {
        "Service": "delivery.logs.amazonaws.com"
      },
      "Action": [
        "kms:GenerateDataKey",
        "kms:Decrypt"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "kms:EncryptionContext:SourceArn": "arn:aws:logs:us-east-1:123456789012:*"
        }
      }
    }
  ]
}
```
The policy contains the following statements:

  * **AllowServiceRoleDescribeKKey** – Allows the specified principal to describe the key if the request is made through the AgentCore service. Replace values in the following fields:

    * `Principal` – Replace the `AWS` value with the actual ARN of your gateway service role.

    * `Condition` – In the `kms:ViaService` array, replace `us-east-1` with the actual AWS Region for which you want to allow the key to be described.

  * **AllowServiceRoleDecryptKey** – Allows the specified principal to decrypt the key if the request is made through the AgentCore service and if the ARN of the gateway to which the request is made matches the one in the `kmsEncryptionContext:aws:bedrock-agentcore-gateway-arn` field. Replace the following values:

    * `Principal` – Replace the `AWS` value with the actual ARN of your gateway service role.

    * `Condition` – Do the following:

      * In the `kms:ViaService` array, replace `us-east-1` with the actual AWS Region for which you want to allow the key to be decrypted.

      * Replace the `kmsEncryptionContext:aws:bedrock-agentcore-gateway-arn` value with the actual ARN of your gateway.

  * **AllowServiceRoleCreateGrant** – Allows the specified principal to create a grant for a key if the request is made through the AgentCore service and if the ARN of the gateway to which the request is made matches the one in the `kmsEncryptionContext:aws:bedrock-agentcore-gateway-arn` field. Replace the following values:

    * `Principal` – Replace the `AWS` value with the actual ARN of your gateway service role.

    * `Condition` – Do the following:

      * In the `kms:ViaService` array, replace `us-east-1` with the actual AWS Region for which you want to allow the key to be decrypted.

      * Replace the `kmsEncryptionContext:aws:bedrock-agentcore-gateway-arn` value with the actual ARN of your gateway (if you want to allow).

  * **AllowKMSDecryptionLogging** – Allows the specified principal to decrypt a customer-managed KMS key for auditing key usage through CloudWatch Logs. In the `kms:EncryptionContext:SourceArn` value, replace `us-east-1` and `123456789012` values with your actual AWS Region and account ID.


###### Example

Console
    

  1. ====== To encrypt your gateway with a customer-managed KMS key

  2. Follow the **Console** steps at [Create an Amazon Bedrock AgentCore gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-create.html>) and expand the **KMS key - optional** section.

  3. Choose **Customize encryption settings (advanced)**.

  4. Select a KMS key and confirm its details.

###### Note

If you don’t see your KMS key, go over the Prerequisites for encrypting your AgentCore gateway and check that the permissions are properly configured.

  5. Continue through the remaining console steps.


CLI
    

  1. To encrypt your gateway using the AWS CLI, include the `kms-key-arn` when sending either of the following requests through an [AgentCore control plane](<https://docs.aws.amazon.com/cli/latest/reference/bedrock-agentcore-control/>) client.:

     * [create-gateway](<https://docs.aws.amazon.com/cli/latest/reference/bedrock-agentcore-control/create-gateway.html>)

     * [update-gateway](<https://docs.aws.amazon.com/cli/latest/reference/bedrock-agentcore-control/update-gateway.html>)

The following example shows an example CLI request to create a gateway with a AWS KMS key specified using the `kms-key-arn` argument:

```bash
aws bedrock-agentcore-control create-gateway \
  --name "MyGateway" \
  --role-arn "arn:aws:iam::123456789012:role/GatewayRole" \
  --protocol-type "MCP" \
  --kms-key-arn "arn:aws:kms:us-west-2:123456789012:key/1234abcd-12ab-34cd-56ef-1234567890ab" \
  --authorizer-type "CUSTOM_JWT" \
  --authorizer-configuration '{
    "customJWTAuthorizer": {
      "allowedAudience": ["myAudience"],
      "discoveryUrl": "https://example.com/.well-known/openid-configuration"
    }
  }'
```
Python (Boto3)
    

  1. To encrypt your gateway using the AWS Python SDK (Boto3), include the `kms-key-arn` when sending either of the following requests through an [AgentCore control plane](<https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/bedrock-agentcore-control.html>) client.:

     * [create_gateway](<https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/bedrock-agentcore-control/client/create_gateway.html>)

     * [update_gateway](<https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/bedrock-agentcore-control/client/update_gateway.html>)

The following example shows an example Boto3 request to create a gateway with a AWS KMS key specified using the `kmsKeyArn` argument:

```python
import boto3
# Create client
agentcore_client = boto3.client('bedrock-agentcore-control')

# Create gateway and specify
gateway = agentcore_client.create_gateway(
  name="MyGateway",
  roleArn="arn:aws:iam::123456789012:role/GatewayRole",
  protocolType="MCP",
  kmsKeyArn="arn:aws:kms:us-west-2:123456789012:key/1234abcd-12ab-34cd-56ef-1234567890ab"
  authorizerType="CUSTOM_JWT",
  authorizerConfiguration= {
    "customJWTAuthorizer": {
      "allowedAudience": ["myAudience"],
      "discoveryUrl": "https://example.com/.well-known/openid-configuration"
    }
  }
)
```
