# AgentCore harness versioning and endpoints - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-versioning.html

---

# AgentCore harness versioning and endpoints

Amazon Bedrock AgentCore implements automatic versioning for AgentCore harnesses and lets you manage different configurations using endpoints. Harness versioning works the same way as [AgentCore Runtime versioning](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./agent-runtime-versioning.html>) \- harness is a managed abstraction over Runtime - but you manage it through the harness control plane APIs.

Each harness in Amazon Bedrock AgentCore is automatically versioned:

  * When you create a harness, AgentCore automatically creates version 1 (V1)

  * Each update to the harness creates a new version with a complete, self-contained configuration

  * Versions are immutable once created

  * Each version contains all the configuration needed for execution: model, system prompt, tools, memory, limits, and environment


## How endpoints reference versions

Endpoints provide a way to reference specific versions of your harness:

  * The `DEFAULT` endpoint automatically points to the latest version of your harness

  * Endpoints can point to specific versions, allowing you to maintain different environments (e.g., development, staging, production)

  * When you update a harness, the `DEFAULT` endpoint is automatically updated to point to the new version

  * Endpoints must be explicitly updated to point to new versions


**Example Updating an endpoint to a new version**

###### Example

AWS CLI/boto3
     ```python
     import boto3

     control_client = boto3.client('bedrock-agentcore-control', region_name='us-west-2')

     response = control_client.update_harness_endpoint(
         harnessId='MyHarness-UuFdkQoXSL',
         endpointName='production-endpoint',
         targetVersion='2',
         description='Updated production endpoint'
     )

     print(response)
     ```
Or with the AWS CLI:

```bash
aws bedrock-agentcore-control update-harness-endpoint \
  --harness-id "MyHarness-UuFdkQoXSL" \
  --endpoint-name "production-endpoint" \
  --target-version "2" \
  --description "Updated production endpoint"
```
## Versioning scenarios

The following table illustrates how versioning and endpoints interact during the lifecycle of a harness:

Change Type | Version Creation Behavior | Latest Version | Endpoint Behavior  
---|---|---|---  
Initial Creation |  Creates Version 1 (V1) automatically |  V1 |  DEFAULT points to V1  
Model Change |  Creates a new version with the updated model selection |  V2 |  DEFAULT automatically updates to V2  
Create "PROD" endpoint with V2 |  No new version created |  V2 |  PROD endpoint points to V2  
Tool or Skill Update |  Creates a new version with the updated tool configuration |  V3 |  DEFAULT updates to V3, PROD remains on V2  
Update "PROD" to V3 |  No new version created |  V3 |  PROD updates to V3  
Limits or Environment Modification |  Creates a new version with updated execution parameters |  V4 |  DEFAULT updates to V4, PROD remains on V3  
  
## Endpoint lifecycle states

Harness endpoints go through various states during their lifecycle:

CREATING
    

Initial state when an endpoint is being created

CREATE_FAILED
    

Indicates creation failure due to permissions, configuration, or other issues

READY
    

Endpoint is ready to accept requests

UPDATING
    

Endpoint is being updated to a new version

UPDATE_FAILED
    

Indicates update operation failure

## Creating an endpoint

Create a named endpoint to pin an environment to a specific harness version. If you omit `targetVersion`, the endpoint points to the latest version at creation time.

###### Example

AWS CLI/boto3
     ```python
     import boto3

     control_client = boto3.client('bedrock-agentcore-control', region_name='us-west-2')

     response = control_client.create_harness_endpoint(
         harnessId='MyHarness-UuFdkQoXSL',
         endpointName='production-endpoint',
         targetVersion='2',
         description='Production endpoint pinned to V2'
     )

     print(response)
     ```
Or with the AWS CLI:

```bash
aws bedrock-agentcore-control create-harness-endpoint \
  --harness-id "MyHarness-UuFdkQoXSL" \
  --endpoint-name "production-endpoint" \
  --target-version "2" \
  --description "Production endpoint pinned to V2"
```
## Listing harness versions and endpoints

You can list all versions of a harness by calling the `ListHarnessVersions` operation. To list the endpoints for a harness, call `ListHarnessEndpoints`.

###### Example

AWS CLI/boto3
     ```python
     import boto3

     control_client = boto3.client('bedrock-agentcore-control', region_name='us-west-2')

     # List all versions of a harness
     versions = control_client.list_harness_versions(
         harnessId='MyHarness-UuFdkQoXSL'
     )
     for version in versions['harnessVersions']:
         print(version)

     # List all endpoints for a harness
     endpoints = control_client.list_harness_endpoints(
         harnessId='MyHarness-UuFdkQoXSL'
     )
     for endpoint in endpoints['endpoints']:
         print(endpoint)
     ```
Or with the AWS CLI:

```bash
aws bedrock-agentcore-control list-harness-versions \
  --harness-id "MyHarness-UuFdkQoXSL"

aws bedrock-agentcore-control list-harness-endpoints \
  --harness-id "MyHarness-UuFdkQoXSL"
```
Both operations support pagination through `maxResults` and `nextToken`. To retrieve the configuration of a single endpoint, call `GetHarnessEndpoint`; to remove one, call `DeleteHarnessEndpoint`.

## Related topics

  * [Get started](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-get-started.html>) \- create and invoke your first harness

  * [Models and instructions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-models.html>) \- configure agents, models, and providers

  * [Observability and cost controls](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-operations.html>) \- observability, cost controls, and tags

  * [AgentCore Runtime versioning and endpoints](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./agent-runtime-versioning.html>) \- versioning and endpoints for AgentCore Runtime



