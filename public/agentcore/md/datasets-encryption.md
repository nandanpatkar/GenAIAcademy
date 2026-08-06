# Dataset encryption - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/datasets-encryption.html

---

# Dataset encryption

When you specify a `kmsKeyArn` on a dataset, the service encrypts all stored examples using S3 server-side encryption with KMS (SSE-KMS). This includes examples in the Draft and all published versions.

The `kmsKeyArn` is immutable after dataset creation — you cannot change or remove it.

## How it works

Dataset encryption uses S3 SSE-KMS. When the service writes or reads dataset content in S3, S3 calls KMS on behalf of the service to encrypt or decrypt the data. The service principal (`bedrock-agentcore.amazonaws.com`) must have KMS permissions in the key policy.

At API time, the service validates that the caller has KMS permissions using a dry-run check (Forward Access Sessions). This catches permission issues immediately rather than failing asynchronously during ingestion.

AgentCore Evaluations supports only symmetric encryption KMS keys. The KMS key must be in the same AWS Region as the dataset.

## Required key policy

The following key policy grants the minimum permissions required for dataset encryption. It includes two statements:

  * **AllowCallerAccess** — Grants the IAM user or role that calls `CreateDataset` permission to validate and use the key. The service performs a dry-run check at API time to verify the caller has KMS access. Replace `111122223333` with your account ID and `MyDatasetRole` with the IAM role or user that manages datasets.

  * **AllowAgentCoreDatasetAccess** — Grants the AgentCore service principal permission to encrypt and decrypt dataset content in S3.


```json
{
"Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCallerAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::111122223333:role/MyDatasetRole"
      },
      "Action": [
        "kms:GenerateDataKey",
        "kms:Decrypt",
        "kms:DescribeKey"
      ],
      "Resource": "*"
    },
    {
      "Sid": "AllowAgentCoreDatasetAccess",
      "Effect": "Allow",
      "Principal": {
        "Service": "bedrock-agentcore.amazonaws.com"
      },
      "Action": [
        "kms:GenerateDataKey",
        "kms:Decrypt",
        "kms:DescribeKey"
      ],
      "Resource": "*"
    }
  ]
}
```
###### Note

This is the minimum policy. See Scoping down access for recommended security conditions.

## Scoping down access

You can add conditions to restrict when the key can be used. For datasets, the service sends the following context with KMS write operations (`GenerateDataKey`):

  * `aws:SourceAccount` — The AWS account ID that owns the dataset.

  * `aws:SourceArn` — The ARN of the dataset being encrypted.

  * `kms:EncryptionContext:aws:bedrock-agentcore:datasetArn` — The dataset ARN as encryption context.


The following policy splits permissions into write (conditioned) and read (unconditioned):

```json
{
"Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCallerAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::111122223333:role/MyDatasetRole"
      },
      "Action": [
        "kms:GenerateDataKey",
        "kms:Decrypt",
        "kms:DescribeKey"
      ],
      "Resource": "*"
    },
    {
      "Sid": "AllowAgentCoreDatasetWrite",
      "Effect": "Allow",
      "Principal": {
        "Service": "bedrock-agentcore.amazonaws.com"
      },
      "Action": "kms:GenerateDataKey",
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "aws:SourceAccount": "111122223333"
        },
        "StringLike": {
          "aws:SourceArn": "arn:aws:bedrock-agentcore:us-east-1:111122223333:dataset/*",
          "kms:EncryptionContext:aws:bedrock-agentcore:datasetArn": "arn:aws:bedrock-agentcore:us-east-1:111122223333:dataset/*"
        }
      }
    },
    {
      "Sid": "AllowAgentCoreDatasetRead",
      "Effect": "Allow",
      "Principal": {
        "Service": "bedrock-agentcore.amazonaws.com"
      },
      "Action": [
        "kms:Decrypt",
        "kms:DescribeKey"
      ],
      "Resource": "*"
    }
  ]
}
```
###### Important

Do not add `aws:SourceAccount` or `aws:SourceArn` conditions to the read statement (`Decrypt`, `DescribeKey`). Dataset downloads use presigned S3 URLs, and the downloading client does not send source context headers. Adding these conditions to read operations causes download failures.

Replace `111122223333` with your account ID and `us-east-1` with your AWS Region. To scope to a specific dataset, replace the wildcard with the dataset ID: `arn:aws:bedrock-agentcore:us-east-1:111122223333:dataset/my-dataset-id`.

## Creating a dataset with a customer managed KMS key

Specify the `kmsKeyArn` parameter when calling `CreateDataset`:

###### Example

AgentCore CLI
    

  1. To create an encrypted dataset, pass `--kms-key-arn` when you add the dataset, then run `agentcore deploy`. Replace the KMS key ARN with your own key ARN.

```bash
agentcore add dataset --name encrypted_dataset \
    --schema-type AGENTCORE_EVALUATION_PREDEFINED_V1 \
    --kms-key-arn "arn:aws:kms:us-east-1:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"

# Add your scenarios to agentcore/datasets/encrypted_dataset.jsonl, then run agentcore deploy.
agentcore deploy
```
AgentCore SDK
    

  1. 
```python
from bedrock_agentcore.evaluation import DatasetClient

client = DatasetClient(region_name="us-east-1")

ds = client.create_dataset_and_wait(
    datasetName="encrypted_dataset",
    schemaType="AGENTCORE_EVALUATION_PREDEFINED_V1",
    kmsKeyArn="arn:aws:kms:us-east-1:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab",
    source={
        "inlineExamples": {
            "examples": [
                {"scenario_id": "TC-01", "turns": [{"input": "Hello"}]}
            ]
        }
    },
)
```
 


AWS SDK
    

  1. 
```python
import boto3

client = boto3.client('bedrock-agentcore-control')

response = client.create_dataset(
    datasetName='encrypted_dataset',
    schemaType='AGENTCORE_EVALUATION_PREDEFINED_V1',
    kmsKeyArn='arn:aws:kms:us-east-1:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab',
    source={
        'inlineExamples': {
            'examples': [
                {'scenario_id': 'TC-01', 'turns': [{'input': 'Hello'}]}
            ]
        }
    }
)
```
 


AWS CLI
    

  1. 
```bash
aws bedrock-agentcore-control create-dataset \
    --dataset-name "encrypted_dataset" \
    --schema-type AGENTCORE_EVALUATION_PREDEFINED_V1 \
    --kms-key-arn "arn:aws:kms:us-east-1:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab" \
    --source '{"inlineExamples": {"examples": [{"scenario_id": "TC-01", "turns": [{"input": "Hello"}]}]}}'
```
 


## Monitoring KMS usage for datasets

The following CloudTrail event names appear for dataset KMS operations:

  * `GenerateDataKey` — When creating a dataset, adding examples, updating examples, or publishing a version. The `encryptionContext` field contains `aws:bedrock-agentcore:datasetArn`.

  * `Decrypt` — When reading dataset content (GetDataset, ListDatasetExamples) or during presigned URL downloads.

  * `DescribeKey` — When validating the key at dataset creation.


## Behavior when a key becomes unavailable

If you disable or delete the customer managed KMS key used by a dataset:

  * **CreateDataset** — Fails at validation with `ValidationException`.

  * **AddDatasetExamples, UpdateDatasetExamples, CreateDatasetVersion** — Fails with `ValidationException` at API time.

  * **GetDataset** — Fails with `ValidationException` indicating the KMS key is disabled or deleted.

  * **ListDatasetExamples** — Fails with `ValidationException` indicating the KMS key is disabled or deleted.

  * **DeleteDataset** — Succeeds because S3 object deletion does not require KMS decryption.



