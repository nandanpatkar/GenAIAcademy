# Manage dataset versions - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/datasets-versions.html

---

# Manage dataset versions

Use `CreateDatasetVersion` to publish the current Draft as an immutable numbered version. The Draft persists unchanged after publishing — `draftStatus` changes from `MODIFIED` to `UNMODIFIED`.

## CreateDatasetVersion

The following examples show how to publish a version:

###### Example

AgentCore CLI
    

  1. 
```bash
agentcore dataset publish-version --name my_eval_dataset
```
 


AgentCore SDK
    

  1. 
```python
from bedrock_agentcore.evaluation import DatasetClient

client = DatasetClient(region_name="us-west-2")

ds = client.create_dataset_version_and_wait(datasetId="my-dataset-id")
print(f"Published, draftStatus: {ds.get('draftStatus')}")
```
 


AWS SDK
    

  1. 
```python
import boto3

client = boto3.client('bedrock-agentcore-control')

client.create_dataset_version(datasetId='my-dataset-id')
```
 


AWS CLI
    

  1. 
```bash
aws bedrock-agentcore-control create-dataset-version \
    --dataset-id my-dataset-id
```
 


## ListDatasetVersions

Returns published versions sorted newest first. Each version summary includes `datasetVersion`, `exampleCount`, and `createdAt`.

The following examples show how to list versions:

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

resp = client.list_dataset_versions(datasetId="my-dataset-id")
for v in resp["versions"]:
    print(f"  Version {v['datasetVersion']}: {v['exampleCount']} examples")
```
 


AWS SDK
    

  1. 
```python
import boto3

client = boto3.client('bedrock-agentcore-control')

resp = client.list_dataset_versions(datasetId='my-dataset-id')
for v in resp['versions']:
    print(f"  Version {v['datasetVersion']}: {v['exampleCount']} examples")
```
 


AWS CLI
    

  1. 
```bash
aws bedrock-agentcore-control list-dataset-versions \
    --dataset-id my-dataset-id
```
 



