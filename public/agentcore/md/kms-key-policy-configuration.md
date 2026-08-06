# Set customer managed key policy - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/kms-key-policy-configuration.html

---

# Set customer managed key policy

###### Note

Currently we don’t support configuring CMK on token vault through console.

To use a customer managed key, your key must trust an Amazon Bedrock AgentCore Identity service principal to perform encryption and decryption operations on the key. Configure the [key policy](<https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html>) of your KMS key as shown in the following example. The IAM principal that writes this policy must have write access to your KMS key, with `kms:PutKeyPolicy` permission.

```json
{
    "Id": "identity-service-cmk-policy",
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "BedrockAgentCoreIdentityKMSAccess",
            "Effect": "Allow",
            "Action": [
                "kms:Encrypt",
                "kms:Decrypt",
                "kms:GenerateDataKeyWithoutPlaintext"
            ],
            "Resource": "*",
            "Condition": {
                "StringLike": {
                    "kms:ViaService": "bedrock-agentcore-identity.*.amazonaws.com"
                },
                "StringEquals": {
                    "aws:ResourceAccount": "${aws:PrincipalAccount}"
                },
                "ArnLike": {
                    "kms:EncryptionContext:aws-crypto-ec:aws:bedrock-agentcore-identity:token-vault-arn": "arn:aws:bedrock-agentcore:*:*:token-vault/default"
                }
            }
        },
        {
            "Sid": "BedrockAgentCoreIdentityDescribeKeyKMSAccess",
            "Effect": "Allow",
            "Action": [
                "kms:DescribeKey"
            ],
            "Resource": "*",
            "Condition": {
                "StringEquals": {
                    "aws:ResourceAccount": "${aws:PrincipalAccount}"
                },
                "StringLike": {
                    "kms:ViaService": "bedrock-agentcore-identity.*.amazonaws.com"
                }
            }
        }
    ]
}
```
