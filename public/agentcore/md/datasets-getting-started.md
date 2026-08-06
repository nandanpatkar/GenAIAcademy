# Getting started - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/datasets-getting-started.html

---

# Getting started

This topic provides an end-to-end workflow for creating, populating, and publishing a dataset.

## Dataset schemas

Each dataset declares a `schemaType` at creation time. AgentCore validates every example against the declared schema before accepting it. Two schema types are supported:

  * **AGENTCORE_EVALUATION_PREDEFINED_V1** — For testing agents against pre-written conversation turns. Required fields: `scenario_id`, `turns` (non-empty list; each turn must contain `input`).

  * **AGENTCORE_EVALUATION_SIMULATED_V1** — For synthetic conversation generation. Required fields: `scenario_id`, `actor_profile` (object with required `context` and `goal`), `input`.


For full schema field definitions, examples, and ground truth mapping, see [Dataset schema](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./dataset-evaluations-schema.html>).

## End-to-end workflow

The following example demonstrates the complete dataset lifecycle: create, add examples, list examples, publish a version, and clean up.

###### Example

AgentCore CLI
    

  1. 
```bash
# 1. Create dataset
agentcore add dataset --name my_eval_dataset \
    --schema-type AGENTCORE_EVALUATION_PREDEFINED_V1

# 2. Add your scenarios to the JSONL file
#    File: agentcore/datasets/my_eval_dataset.jsonl

# 3. Deploy to create the dataset and sync examples
agentcore deploy

# 4. Publish version 1
agentcore dataset publish-version --name my_eval_dataset

# 5. Check status (shows versions and example count)
agentcore status --type dataset

# 6. Download a published version to local file
agentcore dataset download --name my_eval_dataset --version 1

# 7. Cleanup
agentcore remove dataset --name my_eval_dataset
agentcore deploy
```
 


AgentCore SDK
    

  1. 
```python
from bedrock_agentcore.evaluation import DatasetClient

client = DatasetClient(region_name="us-west-2")

# 1. Create dataset (polls until ACTIVE)
ds = client.create_dataset_and_wait(
    datasetName="my_eval_dataset",
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
dataset_id = ds["datasetId"]
print(f"Created: {dataset_id}, status={ds['status']}")

# 2. Add more examples
ds = client.add_examples_and_wait(
    datasetId=dataset_id,
    source={
        "inlineExamples": {
            "examples": [
                {"scenario_id": "TC-02", "turns": [{"input": "Transfer $100", "expected_response": "Transfer complete."}]}
            ]
        }
    },
)
print(f"Example count: {ds['exampleCount']}")

# 3. List examples
resp = client.list_dataset_examples(datasetId=dataset_id)
for example in resp["examples"]:
    print(f"  {example['exampleId']}: {example['scenario_id']}")

# 4. Publish version 1
ds = client.create_dataset_version_and_wait(datasetId=dataset_id)
print(f"Published, draftStatus: {ds.get('draftStatus')}")

# 5. List versions
resp = client.list_dataset_versions(datasetId=dataset_id)
for v in resp["versions"]:
    print(f"  Version {v['datasetVersion']}: {v['exampleCount']} examples")

# 6. Cleanup
client.delete_dataset_and_wait(datasetId=dataset_id)
```
 



