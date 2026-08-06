# Recommendation encryption - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/recommendations-encryption.html

---

# Recommendation encryption  
  
When you specify a `kmsKeyArn` on a recommendation, the service encrypts the **recommendation configuration** and **recommendation result** using envelope encryption with the AWS Encryption SDK. All other recommendation metadata (name, type, status) remains encrypted with the AWS owned key.

The `kmsKeyArn` is specified at creation time via `StartRecommendation`.

## How it works

Recommendation encryption uses the AWS Encryption SDK for envelope encryption. When the service writes or reads recommendation data, it calls KMS to generate or decrypt data keys. The recommendation result is also stored in S3 with SSE-KMS using the same customer managed key.

At API time, the service validates that the caller has KMS permissions using a dry-run check (Forward Access Sessions). This catches permission issues immediately rather than failing asynchronously during the recommendation workflow.

When the recommendation workflow runs asynchronously, the service principal (`bedrock-agentcore.amazonaws.com`) decrypts the configuration and encrypts the result. The service principal must have `kms:GenerateDataKey` and `kms:Decrypt` permission in the key policy.

AgentCore optimizations supports only symmetric encryption KMS keys. The KMS key must be in the same AWS Region as the recommendation.

### Configuring permissions to use a customer managed KMS key

The following key policy provides the minimum permissions required for recommendation encryption. The policy has three statements:

  * **AllowCallerAccess** – Allows the IAM user or role to validate the key via `DescribeKey`.

  * **AllowCallerCryptoOps** – Allows the IAM user or role to encrypt and decrypt, scoped by encryption context.

  * **AllowServicePrincipalAccess** – Allows the AgentCore service principal to encrypt and decrypt recommendation data during the asynchronous recommendation workflow, scoped by source account and source ARN.


```json
{
"Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCallerAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::111122223333:role/MyRecommendationRole"
      },
      "Action": "kms:DescribeKey",
      "Resource": "*"
    },
    {
      "Sid": "AllowCallerCryptoOps",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::111122223333:role/MyRecommendationRole"
      },
      "Action": [
        "kms:GenerateDataKey",
        "kms:Decrypt"
      ],
      "Resource": "*",
      "Condition": {
        "StringLike": {
          "kms:EncryptionContext:aws:bedrock-agentcore:recommendationArn": "arn:aws:bedrock-agentcore:us-east-1:111122223333:recommendation/*"
        }
      }
    },
    {
      "Sid": "AllowServicePrincipalAccess",
      "Effect": "Allow",
      "Principal": {
        "Service": "bedrock-agentcore.amazonaws.com"
      },
      "Action": [
        "kms:GenerateDataKey",
        "kms:Decrypt"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "aws:SourceAccount": "111122223333"
        },
        "ArnLike": {
          "aws:SourceArn": "arn:aws:bedrock-agentcore:us-east-1:111122223333:recommendation/*"
        }
      }
    }
  ]
}
```
The policy contains the following statements:

  * **AllowCallerAccess** – Grants the IAM role `kms:DescribeKey` permission for key validation at recommendation creation time. Replace `111122223333` with your account ID and `MyRecommendationRole` with the IAM role or user that starts recommendations.

  * **AllowCallerCryptoOps** – Grants the IAM role `kms:GenerateDataKey` and `kms:Decrypt` permissions, scoped by the `aws:bedrock-agentcore:recommendationArn` encryption context. Replace `111122223333`, `MyRecommendationRole`, and `us-east-1` with your values. To allow access to all recommendations in your account, use a wildcard with `StringLike`: `arn:aws:bedrock-agentcore:us-east-1:111122223333:recommendation/*`.

  * **AllowServicePrincipalAccess** – Grants the AgentCore service principal `kms:GenerateDataKey` and `kms:Decrypt` permissions for encrypting and decrypting recommendation data during the asynchronous workflow. Scoped by source account and source ARN (`aws:SourceArn`) to prevent confused deputy attacks. Replace `us-east-1` and `111122223333` with your region and account ID.


### Scoping down access to the customer managed KMS key

You can use the encryption context to scope down access to the customer managed key. AgentCore optimizations includes the following encryption context in all KMS operations:

```json
{
  "aws:bedrock-agentcore:recommendationArn": "arn:aws:bedrock-agentcore:us-east-1:111122223333:recommendation/recommendation-id"
}
```
You can use this encryption context in key policy conditions to restrict KMS operations to specific recommendations, as shown in the `AllowCallerCryptoOps` statement in the example key policy above. Note that `AllowServicePrincipalAccess` uses `aws:SourceArn` for scoping rather than encryption context.

## Starting a recommendation with a customer managed KMS key

Specify the `kmsKeyArn` parameter when calling `StartRecommendation`:

###### Example

AgentCore CLI
     ```bash
     agentcore run recommendation \
       -t system-prompt \
       -r MyAgent \
       -e Builtin.Correctness \
       --inline "You are a helpful assistant" \
       --kms-key arn:aws:kms:us-east-1:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab
     ```
AWS CLI
     ```bash
     aws bedrock-agentcore start-recommendation \
       --name "MyEncryptedRecommendation" \
       --type SYSTEM_PROMPT_RECOMMENDATION \
       --kms-key-arn "arn:aws:kms:us-east-1:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab" \
       --recommendation-config '{
         "systemPromptRecommendationConfig": {
           "systemPrompt": {
             "text": "You are a helpful assistant."
           },
           "agentTraces": {
             "cloudwatchLogs": {
               "logGroupArns": ["arn:aws:logs:us-east-1:111122223333:log-group:/aws/bedrock-agentcore/sessions/my-agent"],
               "serviceNames": ["my-agent.DEFAULT"],
               "startTime": "2025-01-01T00:00:00Z",
               "endTime": "2025-01-02T00:00:00Z"
             }
           },
           "evaluationConfig": {
             "evaluators": [{"evaluatorArn": "arn:aws:bedrock-agentcore:::evaluator/Builtin.Helpfulness"}]
           }
         }
       }'
     ```
Python (Boto3)
     ```python
     import boto3

     client = boto3.client('bedrock-agentcore')

     response = client.start_recommendation(
         name='MyEncryptedRecommendation',
         type='SYSTEM_PROMPT_RECOMMENDATION',
         kmsKeyArn='arn:aws:kms:us-east-1:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab',
         recommendationConfig={
             'systemPromptRecommendationConfig': {
                 'systemPrompt': {
                     'text': 'You are a helpful assistant.'
                 },
                 'agentTraces': {
                     'cloudwatchLogs': {
                         'logGroupArns': ['arn:aws:logs:us-east-1:111122223333:log-group:/aws/bedrock-agentcore/sessions/my-agent'],
                         'serviceNames': ['my-agent.DEFAULT'],
                         'startTime': '2025-01-01T00:00:00Z',
                         'endTime': '2025-01-02T00:00:00Z'
                     }
                 },
                 'evaluationConfig': {
                     'evaluators': [{'evaluatorArn': 'arn:aws:bedrock-agentcore:::evaluator/Builtin.Helpfulness'}]
                 }
             }
         }
     )

     print(f"Recommendation ID: {response['recommendationId']}")
     ```
## Monitoring KMS usage for recommendations

The following CloudTrail event names appear for recommendation KMS operations:

  * `GenerateDataKey` — When starting a recommendation (encrypting configuration) and when the recommendation workflow completes (encrypting the result). The `encryptionContext` field contains `aws:bedrock-agentcore:recommendationArn`.

  * `Decrypt` — When the recommendation workflow processes the configuration, or when retrieving recommendation results.

  * `DescribeKey` — When validating the key at recommendation creation time.


## Behavior when a key becomes unavailable

If you disable or delete the customer managed KMS key used by a recommendation:

  * **StartRecommendation** — Fails at validation with `ValidationException`.

  * **GetRecommendation** — Fails with `ValidationException` indicating the KMS key is disabled or deleted.

  * **ListRecommendations** — Succeeds because listing returns metadata only and does not require KMS operations.

  * **DeleteRecommendation** — Succeeds because deletion does not require decrypting recommendation data.



