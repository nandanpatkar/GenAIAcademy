# AgentCore Runtime versioning and endpoints - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agent-runtime-versioning.html

---

# AgentCore Runtime versioning and endpoints

Amazon Bedrock AgentCore implements automatic versioning for AgentCore Runtimes and lets you manage different configurations using endpoints.

Each AgentCore Runtime in Amazon Bedrock AgentCore is automatically versioned:

  * When you create an AgentCore Runtime, AgentCore Runtime automatically creates version 1 (V1)

  * Each update to the AgentCore Runtime creates a new version with a complete, self-contained configuration

  * Versions are immutable once created

  * Each version contains all the configuration needed for execution


## How endpoints reference versions

Endpoints provide a way to reference specific versions of your AgentCore Runtime:

  * The `DEFAULT` endpoint automatically points to the latest version of your AgentCore Runtime

  * Endpoints can point to specific versions, allowing you to maintain different environments (e.g., development, staging, production)

  * When you update an AgentCore Runtime, the `DEFAULT` endpoint is automatically updated to point to the new version

  * Endpoints must be explicitly updated to point to new versions


**Example Updating an endpoint to a New Version**

```python
bedrock_agentcore_client = boto3.client('bedrock-agentcore', region_name='us-west-2')

response = bedrock_agentcore_client.update_agent_runtime_endpoint(
    agentRuntimeId='agent-runtime-12345',
    endpointName='production-endpoint',
    agentRuntimeVersion='v2.1',
    description='Updated production endpoint'
)

print(response)
```
## Versioning scenarios

The following table illustrates how versioning and endpoints interact during the lifecycle of an AgentCore Runtime:

Change Type | Version Creation Behavior | Latest Version | Endpoint Behavior  
---|---|---|---  
Initial Creation |  Creates Version 1 (V1) automatically |  V1 |  DEFAULT points to V1  
Protocol Change |  Creates a new version with updated protocol settings |  V2 |  DEFAULT automatically updates to V2  
Create "PROD" endpoint with V2 |  No new version created |  V2 |  PROD endpoint points to V2  
Container Image Update |  Creates a new version with new container reference |  V3 |  DEFAULT updates to V3, PROD remains on V2  
Update "PROD" to V3 |  No new version created |  V3 |  PROD updates to V3  
Network Settings Modification |  Creates a new version with updated security parameters |  V4 |  DEFAULT updates to V4, PROD remains on V3  
  
## Endpoint lifecycle states

AgentCore Runtime endpoints go through various states during their lifecycle:

CREATING
    

Initial state when an endpoint is being created

CREATE_FAILED
    

Indicates creation failure due to permissions, container, or other issues

READY
    

Endpoint is ready to accept requests

UPDATING
    

Endpoint is being updated to a new version

UPDATE_FAILED
    

Indicates update operation failure

## Listing AgentCore Runtime versions and endpoints

You can list all versions of an AgentCore Runtime by calling the `ListAgentRuntimeVersions` operation. To list the endpoints for an AgentCore Runtime, call `ListAgentRuntimeEndpoints`.

