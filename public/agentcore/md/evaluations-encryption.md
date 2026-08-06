# Encryption at rest for AgentCore Evaluations - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations-encryption.html

---

# Encryption at rest for AgentCore Evaluations

###### Note

This page covers customer managed key encryption for custom evaluators. For dataset encryption, see [Dataset encryption](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./datasets-encryption.html>).

## Encryption options

Amazon Bedrock AgentCore Evaluations encrypts all data at rest by default using an AWS owned key at no additional charge. You cannot view, manage, or audit the use of this key.

You can optionally encrypt sensitive evaluator data with a customer managed key. When you specify a customer managed AWS KMS key on a custom evaluator, the service encrypts the evaluator’s **instructions** and **rating scale** using envelope encryption with the AWS Encryption SDK. All other evaluator metadata (name, level, model configuration, status) remains encrypted with the AWS owned key.

Using a customer managed key gives you more control over the encryption process, including the ability to:

  * Create and manage the key, including setting key policies

  * Rotate the key on your own schedule

  * Disable or delete the key to control access to encrypted data

  * Audit key usage through AWS CloudTrail


For more information, see [Customer managed keys](<https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#customer-cmk>) in the _AWS Key Management Service Developer Guide_.

## How AgentCore Evaluations uses a customer managed KMS key

When you specify a customer managed key on a custom evaluator, the service uses the caller’s credentials (via [Forward Access Sessions](<https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#fas>)) to encrypt and decrypt the evaluator’s instructions and rating scale. The caller must have `kms:GenerateDataKey`, `kms:Decrypt`, and `kms:DescribeKey` permissions on the key.

For online evaluation, the service decrypts evaluator instructions asynchronously using its own service principal (`bedrock-agentcore.amazonaws.com`). The service principal must have `kms:Decrypt` permission in the key policy.

###### Note

AgentCore Evaluations does not use KMS grants or cache data keys. Online evaluation configurations do not accept a `kmsKeyArn` parameter — they inherit CMK encryption from the evaluators they reference.

## Configuring a customer managed KMS key

AgentCore Evaluations supports only symmetric encryption KMS keys. The KMS key must be in the same AWS Region as the evaluator. For information about creating a symmetric KMS key, see [Creating symmetric encryption KMS keys](<https://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html#create-symmetric-cmk>) in the _AWS Key Management Service Developer Guide_.

### Configuring permissions to use a customer managed KMS key

The following key policy provides the minimum permissions required for AgentCore Evaluations. The policy has three statements:

  * **AllowCallerAccess** – Allows the IAM user or role to validate the key via `DescribeKey`, scoped by `kms:ViaService`.

  * **AllowCallerCryptoOps** – Allows the IAM user or role to encrypt and decrypt, scoped by `kms:ViaService` and encryption context.

  * **AllowServicePrincipalDecrypt** – Allows the AgentCore service principal to decrypt during online evaluation, scoped by source account and source ARN.


```json
{
"Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCallerAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::111122223333:role/MyEvaluationRole"
      },
      "Action": "kms:DescribeKey",
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "kms:ViaService": "bedrock-agentcore.us-east-1.amazonaws.com"
        }
      }
    },
    {
      "Sid": "AllowCallerCryptoOps",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::111122223333:role/MyEvaluationRole"
      },
      "Action": [
        "kms:GenerateDataKey",
        "kms:Decrypt"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "kms:ViaService": "bedrock-agentcore.us-east-1.amazonaws.com",
          "kms:EncryptionContext:aws:bedrock-agentcore:evaluatorArn": "arn:aws:bedrock-agentcore:us-east-1:111122223333:evaluator/my-evaluator-id"
        }
      }
    },
    {
      "Sid": "AllowServicePrincipalDecrypt",
      "Effect": "Allow",
      "Principal": {
        "Service": "bedrock-agentcore.amazonaws.com"
      },
      "Action": "kms:Decrypt",
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "aws:SourceAccount": "111122223333",
          "aws:SourceArn": "arn:aws:bedrock-agentcore:us-east-1:111122223333:evaluator/my-evaluator-id"
        }
      }
    }
  ]
}
```
The policy contains the following statements:

  * **AllowCallerAccess** – Grants the IAM role `kms:DescribeKey` permission, scoped to requests made through the AgentCore service (`kms:ViaService`). Replace `111122223333` with your account ID, `MyEvaluationRole` with the IAM role or user that manages evaluators, and `us-east-1` with your AWS Region.

  * **AllowCallerCryptoOps** – Grants the IAM role `kms:GenerateDataKey` and `kms:Decrypt` permissions, scoped by `kms:ViaService` and the `aws:bedrock-agentcore:evaluatorArn` encryption context. Replace `111122223333`, `MyEvaluationRole`, `us-east-1`, and `my-evaluator-id` with your values. To allow access to all evaluators in your account, use a wildcard with `StringLike`: `arn:aws:bedrock-agentcore:us-east-1:111122223333:evaluator/****`. Note that when using a wildcard, you must change the condition operator from `StringEquals` to `StringLike`, because `StringEquals` treats `` as a literal character.

  * **AllowServicePrincipalDecrypt** – Grants the AgentCore service principal `kms:Decrypt` permission for decrypting evaluator data during online evaluation execution. Scoped by source account and source ARN (`aws:SourceArn`) to prevent confused deputy attacks. Replace `us-east-1` and `111122223333` with your region and account ID.


### Creating an evaluator with a customer managed KMS key

To encrypt a custom evaluator, specify the `kmsKeyArn` parameter when calling [CreateEvaluator](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateEvaluator.html>).

###### Example

CLI
     ```bash
     aws bedrock-agentcore-control create-evaluator \
       --evaluator-name "MyEncryptedEvaluator" \
       --level SESSION \
       --kms-key-arn "arn:aws:kms:us-east-1:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab" \
       --evaluator-config '{
         "llmAsAJudge": {
           "instructions": "Rate the session quality using {available_tools} and {context}",
           "ratingScale": {
             "categorical": [
               {"label": "Good", "definition": "The agent performed well"},
               {"label": "Bad", "definition": "The agent performed poorly"}
             ]
           },
           "modelConfig": {
             "bedrockEvaluatorModelConfig": {
               "modelId": "us.anthropic.claude-sonnet-4-20250514-v1:0"
             }
           }
         }
       }'
     ```
Python (Boto3)
     ```python
     import boto3

     client = boto3.client('bedrock-agentcore-control')

     response = client.create_evaluator(
         evaluatorName='MyEncryptedEvaluator',
         level='SESSION',
         kmsKeyArn='arn:aws:kms:us-east-1:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab',
         evaluatorConfig={
             'llmAsAJudge': {
                 'instructions': 'Rate the session quality using {available_tools} and {context}',
                 'ratingScale': {
                     'categorical': [
                         {'label': 'Good', 'definition': 'The agent performed well'},
                         {'label': 'Bad', 'definition': 'The agent performed poorly'}
                     ]
                 },
                 'modelConfig': {
                     'bedrockEvaluatorModelConfig': {
                         'modelId': 'us.anthropic.claude-sonnet-4-20250514-v1:0'
                     }
                 }
             }
         }
     )

     print(f"Evaluator ID: {response['evaluatorId']}")
     ```
### Changing encryption configuration on an existing evaluator

You can change the encryption configuration on an existing evaluator using [UpdateEvaluator](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_UpdateEvaluator.html>):

  * **Add encryption** – Specify a `kmsKeyArn` on an evaluator that was created without one. The service encrypts the instructions and rating scale with the new key.

  * **Rotate key** – Specify a different `kmsKeyArn`. The service decrypts the data with the old key and re-encrypts it with the new key. The caller must have permissions on both keys. If the old key is unavailable (disabled, deleted, or missing permissions), the update will fail.


###### Note

You cannot remove customer managed key encryption from an evaluator once it has been added.

### Scoping down access to the customer managed KMS key

You can use the encryption context to scope down access to the customer managed key. AgentCore Evaluations includes the following encryption context in all KMS operations:

```json
{
  "aws:bedrock-agentcore:evaluatorArn": "arn:aws:bedrock-agentcore:us-east-1:111122223333:evaluator/evaluator-id"
}
```
You can use this encryption context in key policy conditions to restrict KMS operations to specific evaluators, as shown in the `AllowCallerCryptoOps` statement in the example key policy above. Note that `AllowServicePrincipalDecrypt` uses `aws:SourceArn` for scoping rather than encryption context.

## Monitoring AgentCore Evaluations interaction with AWS KMS

You can use AWS CloudTrail to track the KMS API requests that AgentCore Evaluations makes on your behalf. The following CloudTrail event names appear in your logs:

  * `GenerateDataKey` – When creating or updating an evaluator with a customer managed key.

  * `Decrypt` – When retrieving evaluator data, during on-demand evaluation, or during online evaluation execution.

  * `DescribeKey` – When validating the key at evaluator creation, update, or online evaluation configuration creation.


In the CloudTrail log entries, the `requestParameters.encryptionContext` field contains `aws:bedrock-agentcore:evaluatorArn` with the ARN of the evaluator. For requests made by the service principal during online evaluation, the `userIdentity.invokedBy` field shows `bedrock-agentcore.amazonaws.com`.

For more information about monitoring KMS usage, see [Logging AWS KMS API calls with AWS CloudTrail](<https://docs.aws.amazon.com/kms/latest/developerguide/logging-using-cloudtrail.html>) in the _AWS Key Management Service Developer Guide_.

## Behavior when a key becomes unavailable

If you disable or delete your customer managed KMS key, or if the key policy no longer grants the required permissions:

  * **GetEvaluator with ALL_DATA** – Fails because the service cannot decrypt the instructions and rating scale.

  * **GetEvaluator with METADATA_ONLY** – Succeeds because no KMS operations are required.

  * **Evaluate (on-demand)** – Fails for CMK-encrypted evaluators because the service cannot decrypt the instructions.

  * **UpdateEvaluator (key rotation)** – Fails because the service cannot decrypt the existing data with the unavailable key before re-encrypting with the new key.

  * **CreateOnlineEvaluationConfig / UpdateOnlineEvaluationConfig** – Fails because the service cannot validate caller access via `kms:DescribeKey` and `kms:Decrypt` dry-run.

  * **Online evaluation execution** – Fails because the service cannot decrypt evaluator instructions for scoring.

  * **DeleteEvaluator** – Succeeds because deletion does not require decrypting the evaluator data.

  * **DeleteOnlineEvaluationConfig** – Succeeds because deletion does not require KMS access.


###### Tip

Use `includedData=METADATA_ONLY` on GetEvaluator to retrieve evaluator metadata (name, level, model configuration, status) without requiring KMS permissions. This is useful for monitoring and inventory workflows when the key is unavailable.

To restore access, re-enable the key or update the key policy to grant the required permissions.

###### Note

For information about customer managed key encryption for datasets, see [Dataset encryption](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./datasets-encryption.html>).

