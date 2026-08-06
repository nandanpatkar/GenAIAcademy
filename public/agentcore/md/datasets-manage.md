# Manage datasets - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/datasets-manage.html

---

# Manage datasets

This topic covers creating, retrieving, listing, updating, and deleting datasets.

## Create dataset

The `CreateDataset` API creates a new evaluation dataset. This is an asynchronous operation (HTTP 202) — the dataset transitions from `CREATING` to `ACTIVE` once ingestion completes.

**Required parameters:** `datasetName` (alphanumeric and underscores only, `^[a-zA-Z][a-zA-Z0-9_]{0,47}$`), `schemaType`, and `source` (inline examples or S3 URI).

**Optional parameters:** `description`, `kmsKeyArn` (customer managed encryption key, immutable after creation — see [Dataset encryption](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./datasets-encryption.html>)), `tags`.

The following examples show how to create a dataset:

###### Example

AgentCore CLI
    

  1. 
```bash
# Add a dataset to your project
agentcore add dataset --name my_eval_dataset \
    --schema-type AGENTCORE_EVALUATION_PREDEFINED_V1

# Edit the generated JSONL file with your scenarios
# File location: agentcore/datasets/my_eval_dataset.jsonl

# Deploy to create the dataset in your AWS account
agentcore deploy
```
 

This creates a local JSONL file and registers the dataset in your project configuration. Run `agentcore deploy` to create the dataset resource and sync examples to the service.

###### Note

Run this from inside an AgentCore project directory (created with `agentcore create`).


AgentCore SDK
    

  1. 
```python
from bedrock_agentcore.evaluation import DatasetClient

client = DatasetClient(region_name="us-west-2")

# Create with inline examples (polls until ACTIVE)
ds = client.create_dataset_and_wait(
    datasetName="customer_support_scenarios",
    schemaType="AGENTCORE_EVALUATION_PREDEFINED_V1",
    source={
        "inlineExamples": {
            "examples": [
                {
                    "scenario_id": "TC-01",
                    "turns": [{"input": "What is my balance?", "expected_response": "Your balance is $50."}],
                    "assertions": ["Response includes a dollar amount"],
                }
            ]
        }
    },
)
print(f"Dataset ID: {ds['datasetId']}, Status: {ds['status']}")

# Create with S3 source
ds = client.create_dataset_and_wait(
    datasetName="my_s3_dataset",
    schemaType="AGENTCORE_EVALUATION_PREDEFINED_V1",
    source={"s3Source": {"s3Uri": "s3://my-bucket/scenarios.jsonl"}},
)
```
 

###### Note

For S3 ingestion, each line in the JSONL file must include an `exampleId` field. The S3 bucket must be accessible using the caller’s credentials.


AWS SDK
    

  1. 
```python
import boto3
import time

client = boto3.client('bedrock-agentcore-control')

response = client.create_dataset(
    datasetName='customer_support_scenarios',
    schemaType='AGENTCORE_EVALUATION_PREDEFINED_V1',
    source={
        'inlineExamples': {
            'examples': [
                {
                    'scenario_id': 'TC-01',
                    'turns': [{'input': 'What is my balance?', 'expected_response': 'Your balance is $50.'}],
                    'assertions': ['Response includes a dollar amount'],
                }
            ]
        }
    }
)
dataset_id = response['datasetId']

# Create with S3 source
response = client.create_dataset(
    datasetName='my_s3_dataset',
    schemaType='AGENTCORE_EVALUATION_PREDEFINED_V1',
    source={
        's3Source': {'s3Uri': 's3://my-bucket/scenarios.jsonl'}
    }
)

# Poll until ACTIVE
while True:
    ds = client.get_dataset(datasetId=dataset_id)
    if ds['status'] in ('ACTIVE', 'CREATE_FAILED'):
        break
    time.sleep(2)
```
 


AWS CLI
    

  1. 
```bash
# Create with inline examples
aws bedrock-agentcore-control create-dataset \
    --dataset-name "customer_support_scenarios" \
    --schema-type AGENTCORE_EVALUATION_PREDEFINED_V1 \
    --source '{"inlineExamples": {"examples": [{"scenario_id": "TC-01", "turns": [{"input": "What is my balance?", "expected_response": "Your balance is $50."}], "assertions": ["Response includes a dollar amount"]}]}}'

# Create with S3 source
aws bedrock-agentcore-control create-dataset \
    --dataset-name "my_s3_dataset" \
    --schema-type AGENTCORE_EVALUATION_PREDEFINED_V1 \
    --source '{"s3Source": {"s3Uri": "s3://my-bucket/scenarios.jsonl"}}'

# Poll until ACTIVE
aws bedrock-agentcore-control get-dataset \
    --dataset-id my-dataset-id
```
 


## Get dataset

The `GetDataset` API retrieves dataset metadata, status, example count, and a presigned download URL for the dataset content. By default reads the Draft; specify `datasetVersion` for a published version.

The `downloadUrl` is a presigned S3 URL for the full `dataset.jsonl` file. You can download it with a plain HTTP GET request without authentication headers.

The following examples show how to get a dataset:

###### Example

AgentCore CLI
    

  1. 
```bash
# Show dataset deployment status and metadata
agentcore status --type dataset

# Download dataset content to your local JSONL file (default: Draft)
agentcore dataset download --name my_eval_dataset

# Download a specific published version
agentcore dataset download --name my_eval_dataset --version 1
```
 


AgentCore SDK
    

  1. 
```python
from bedrock_agentcore.evaluation import DatasetClient

client = DatasetClient(region_name="us-west-2")

# Get dataset (default: Draft)
ds = client.get_dataset(datasetId="my-dataset-id")
print(f"Status: {ds['status']}, Examples: {ds['exampleCount']}")
print(f"Download URL: {ds['downloadUrl']}")

# Get a specific published version
ds_v1 = client.get_dataset(datasetId="my-dataset-id", datasetVersion="1")
```
 


AWS SDK
    

  1. 
```python
import boto3

client = boto3.client('bedrock-agentcore-control')

response = client.get_dataset(datasetId='my-dataset-id')
print(f"Status: {response['status']}, Examples: {response['exampleCount']}")

# Download the dataset content via presigned URL
if 'downloadUrl' in response:
    import requests
    data = requests.get(response['downloadUrl'])
    print(data.text)

# Get a specific published version
response = client.get_dataset(datasetId='my-dataset-id', datasetVersion='1')
```
 


AWS CLI
    

  1. 
```bash
# Get dataset (default: Draft)
aws bedrock-agentcore-control get-dataset \
    --dataset-id my-dataset-id

# Get a specific published version
aws bedrock-agentcore-control get-dataset \
    --dataset-id my-dataset-id \
    --dataset-version 1
```
 


## List datasets

The `ListDatasets` API returns a paginated list of datasets in your account and Region.

The following examples show how to list datasets:

###### Example

AgentCore CLI
    

  1. 
```bash
agentcore status --type dataset
```
 


AgentCore SDK
    

  1. 
```python
from bedrock_agentcore.evaluation import DatasetClient

client = DatasetClient(region_name="us-west-2")

response = client.list_datasets()
for dataset in response["datasets"]:
    print(f"  {dataset['datasetName']} ({dataset['status']})")
```
 


AWS SDK
    

  1. 
```python
import boto3

client = boto3.client('bedrock-agentcore-control')

response = client.list_datasets()
for dataset in response['datasets']:
    print(f"  {dataset['datasetName']} ({dataset['status']})")
```
 


AWS CLI
    

  1. 
```bash
aws bedrock-agentcore-control list-datasets
```
 


## Update dataset

The `UpdateDataset` API updates dataset metadata. This is a synchronous operation (HTTP 200). Only `description` and `tags` can be updated. `datasetName`, `schemaType`, and `kmsKeyArn` are immutable after creation.

The dataset must be in `ACTIVE`, `UPDATE_FAILED`, or `CREATE_FAILED` status.

The following examples show how to update dataset metadata:

###### Example

AgentCore CLI
    

  1. To update a dataset with the AgentCore CLI, edit the dataset configuration in your `agentcore.json` file directly, then redeploy:

```bash
agentcore deploy
```
Open `agentcore.json`, find the dataset in the `datasets` array, modify its `description`, then run `agentcore deploy`. Changes take effect after deployment.

###### Note

Run this from inside an AgentCore project directory (created with `agentcore create`).


AgentCore SDK
    

  1. 
```python
from bedrock_agentcore.evaluation import DatasetClient

client = DatasetClient(region_name="us-west-2")

client.update_dataset(datasetId="my-dataset-id", description="Updated description")
```
 


AWS SDK
    

  1. 
```python
import boto3

client = boto3.client('bedrock-agentcore-control')

client.update_dataset(datasetId='my-dataset-id', description='Updated description')
```
 


AWS CLI
    

  1. 
```bash
aws bedrock-agentcore-control update-dataset \
    --dataset-id my-dataset-id \
    --description "Updated description"
```
 


## Delete dataset

The `DeleteDataset` API deletes a dataset. This is an asynchronous operation (HTTP 202).

  * **Full delete** (omit `datasetVersion`): Deletes all versions, Draft, and the dataset record.

  * **Version-specific delete** (specify `datasetVersion` as an integer): Deletes only that published version.


The dataset must be in `ACTIVE`, `CREATE_FAILED`, `UPDATE_FAILED`, or `DELETE_FAILED` status.

###### Note

Only integer version numbers are accepted for version-specific deletion.

The following examples show how to delete a dataset:

###### Example

AgentCore CLI
    

  1. 
```bash
# Delete a specific published version
agentcore dataset remove-version 1 --name my_eval_dataset

# Delete entire dataset
agentcore remove dataset --name my_eval_dataset
agentcore deploy
```
 


AgentCore SDK
    

  1. 
```python
from bedrock_agentcore.evaluation import DatasetClient

client = DatasetClient(region_name="us-west-2")

# Delete a specific published version
client.delete_dataset_and_wait(datasetId="my-dataset-id", datasetVersion="1")

# Delete entire dataset (polls until complete)
client.delete_dataset_and_wait(datasetId="my-dataset-id")
```
 


AWS SDK
    

  1. 
```python
import boto3

client = boto3.client('bedrock-agentcore-control')

# Delete a specific published version
client.delete_dataset(datasetId='my-dataset-id', datasetVersion='1')

# Delete entire dataset
client.delete_dataset(datasetId='my-dataset-id')
```
 


AWS CLI
    

  1. 
```bash
# Delete a specific published version
aws bedrock-agentcore-control delete-dataset \
    --dataset-id my-dataset-id \
    --dataset-version 1

# Delete entire dataset
aws bedrock-agentcore-control delete-dataset \
    --dataset-id my-dataset-id
```
 



