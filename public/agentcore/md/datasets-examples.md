# Manage dataset examples - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/datasets-examples.html

---

# Manage dataset examples

After a dataset reaches `ACTIVE` status, you can add, update, delete, and list examples in the Draft. All example mutations are asynchronous (HTTP 202) and use all-or-nothing semantics — if any example ID is not found, the entire batch fails with `ResourceNotFoundException`.

Maximum 1,000 examples per request. Inline content limit: 5 MB.

## AddDatasetExamples

The following examples show how to add examples to a dataset:

###### Example

AgentCore CLI
    

  1. To add examples with the AgentCore CLI, append new scenarios to your local JSONL file, then redeploy:

```bash
# Edit agentcore/datasets/my_eval_dataset.jsonl — add new lines
agentcore deploy
```
The deploy detects new scenarios in your JSONL file and adds them to the service. Only the diff is applied — existing examples are not re-uploaded.

###### Note

Run this from inside an AgentCore project directory (created with `agentcore create`).


AgentCore SDK
    

  1. 
```python
from bedrock_agentcore.evaluation import DatasetClient

client = DatasetClient(region_name="us-west-2")

ds = client.add_examples_and_wait(
    datasetId="my-dataset-id",
    source={
        "inlineExamples": {
            "examples": [
                {
                    "scenario_id": "TC-02",
                    "turns": [{"input": "Transfer $100", "expected_response": "Transfer complete."}],
                }
            ]
        }
    },
)
print(f"Example count: {ds['exampleCount']}")
```
 


AWS SDK
    

  1. 
```python
import boto3
import time

client = boto3.client('bedrock-agentcore-control')

resp = client.add_dataset_examples(
    datasetId='my-dataset-id',
    source={'inlineExamples': {'examples': [
        {'scenario_id': 'TC-02', 'turns': [{'input': 'Transfer $100', 'expected_response': 'Transfer complete.'}]}
    ]}}
)
print(f"Added example IDs: {resp['exampleIds']}")

# Poll until ACTIVE
while True:
    ds = client.get_dataset(datasetId='my-dataset-id')
    if ds['status'] == 'ACTIVE':
        break
    time.sleep(2)
```
 


AWS CLI
    

  1. 
```bash
aws bedrock-agentcore-control add-dataset-examples \
    --dataset-id my-dataset-id \
    --source '{"inlineExamples": {"examples": [{"scenario_id": "TC-02", "turns": [{"input": "Transfer $100", "expected_response": "Transfer complete."}]}]}}'
```
 


## UpdateDatasetExamples

Each entry must include `exampleId` plus the updated content fields. The dataset must be in `ACTIVE` or `UPDATE_FAILED` status.

The following examples show how to update dataset examples:

###### Example

AgentCore CLI
    

  1. To update examples with the AgentCore CLI, modify existing scenarios in your local JSONL file, then redeploy:

```bash
# Edit agentcore/datasets/my_eval_dataset.jsonl — modify existing lines
agentcore deploy
```
The deploy diffs your local file against the service and updates changed examples. Each line must retain its `exampleId` for the service to recognize it as an update rather than a new example.

###### Note

Run this from inside an AgentCore project directory (created with `agentcore create`).


AgentCore SDK
    

  1. 
```python
from bedrock_agentcore.evaluation import DatasetClient

client = DatasetClient(region_name="us-west-2")

ds = client.update_examples_and_wait(
    datasetId="my-dataset-id",
    examples=[
        {
            "exampleId": "example-id-from-list",
            "scenario_id": "TC-02-updated",
            "turns": [{"input": "Transfer $200", "expected_response": "Transfer complete."}],
        }
    ],
)
```
 


AWS SDK
    

  1. 
```python
import boto3
import time

client = boto3.client('bedrock-agentcore-control')

client.update_dataset_examples(
    datasetId='my-dataset-id',
    examples=[
        {
            'exampleId': 'example-id-from-list',
            'scenario_id': 'TC-02-updated',
            'turns': [{'input': 'Transfer $200', 'expected_response': 'Transfer complete.'}],
        }
    ]
)

# Poll until ACTIVE
while True:
    ds = client.get_dataset(datasetId='my-dataset-id')
    if ds['status'] == 'ACTIVE':
        break
    time.sleep(2)
```
 


AWS CLI
    

  1. 
```bash
aws bedrock-agentcore-control update-dataset-examples \
    --dataset-id my-dataset-id \
    --cli-input-json file://update-examples.json
```
 


## DeleteDatasetExamples

The dataset must be in `ACTIVE`, `UPDATE_FAILED`, or `CREATE_FAILED` status.

The following examples show how to delete dataset examples:

###### Example

AgentCore CLI
    

  1. To delete examples with the AgentCore CLI, remove the corresponding lines from your local JSONL file, then redeploy:

```bash
# Edit agentcore/datasets/my_eval_dataset.jsonl — remove lines
agentcore deploy
```
The deploy detects removed scenarios and deletes them from the service.

###### Note

Run this from inside an AgentCore project directory (created with `agentcore create`).


AgentCore SDK
    

  1. 
```python
from bedrock_agentcore.evaluation import DatasetClient

client = DatasetClient(region_name="us-west-2")

ds = client.delete_examples_and_wait(
    datasetId="my-dataset-id",
    exampleIds=["example-id-1", "example-id-2"],
)
```
 


AWS SDK
    

  1. 
```python
import boto3
import time

client = boto3.client('bedrock-agentcore-control')

client.delete_dataset_examples(
    datasetId='my-dataset-id',
    exampleIds=['example-id-1', 'example-id-2']
)

# Poll until ACTIVE
while True:
    ds = client.get_dataset(datasetId='my-dataset-id')
    if ds['status'] == 'ACTIVE':
        break
    time.sleep(2)
```
 


AWS CLI
    

  1. 
```bash
aws bedrock-agentcore-control delete-dataset-examples \
    --dataset-id my-dataset-id \
    --example-ids '["example-id-1", "example-id-2"]'
```
 


## ListDatasetExamples

Returns a paginated list of examples with full content. By default reads from the Draft. Specify `datasetVersion` to read from a published version.

The following examples show how to list dataset examples:

###### Example

AgentCore CLI
    

  1. 
```bash
# Download examples to your local JSONL file (default: Draft)
agentcore dataset download --name my_eval_dataset

# Download examples from a published version
agentcore dataset download --name my_eval_dataset --version 1
```
 


AgentCore SDK
    

  1. 
```python
from bedrock_agentcore.evaluation import DatasetClient

client = DatasetClient(region_name="us-west-2")

# List examples from Draft
resp = client.list_dataset_examples(datasetId="my-dataset-id")
for example in resp["examples"]:
    print(f"  {example['exampleId']}: {example['scenario_id']}")

# List examples from a published version
resp = client.list_dataset_examples(datasetId="my-dataset-id", datasetVersion="1")
```
 


AWS SDK
    

  1. 
```python
import boto3

client = boto3.client('bedrock-agentcore-control')

resp = client.list_dataset_examples(datasetId='my-dataset-id')
for example in resp['examples']:
    print(f"  {example['exampleId']}: {example.get('scenario_id')}")

# List examples from a published version
resp = client.list_dataset_examples(datasetId='my-dataset-id', datasetVersion='1')
```
 


AWS CLI
    

  1. 
```bash
# List examples from Draft
aws bedrock-agentcore-control list-dataset-examples \
    --dataset-id my-dataset-id

# List examples from a published version
aws bedrock-agentcore-control list-dataset-examples \
    --dataset-id my-dataset-id \
    --dataset-version 1
```
 



