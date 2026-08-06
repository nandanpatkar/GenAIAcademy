# Delete a configuration bundle - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/configuration-bundles-delete.html

---

# Delete a configuration bundle  
  
Delete a configuration bundle and all of its versions. Deletion is asynchronous — the API returns immediately with a `DELETING` status, and the service removes the bundle and its version history in the background.

You cannot delete a bundle that is referenced by an active A/B test. Stop the A/B test first.

## Code samples

###### Example

AgentCore CLI
    

Remove the bundle from your project configuration, then deploy to propagate the deletion:

```bash
agentcore remove config-bundle

agentcore deploy
```
The CLI prompts you to select which bundle to remove.

To remove a specific bundle non-interactively (for example, in a script), pass the bundle name with `--name` and skip the confirmation prompt with `-y`:

```bash
agentcore remove config-bundle --name MyBundle -y

agentcore deploy
```
AWS SDK (boto3)
     ```python
     import boto3

     client = boto3.client("bedrock-agentcore-control", region_name="us-west-2")

     response = client.delete_configuration_bundle(
         bundleId="myAgentConfig-a1b2c3d4e5"
     )

     print(f"Bundle ID: {response['bundleId']}")
     print(f"Status: {response['status']}")  # DELETING
     ```
## Request parameters

Parameter | Type | Required | Description  
---|---|---|---  
`bundleId` |  String |  Yes |  The ID of the configuration bundle to delete. Passed as a path parameter.  
  
## Response

The API returns HTTP 202 (Accepted), indicating the deletion has been queued.

Field | Type | Description  
---|---|---  
`bundleId` |  String |  ID of the bundle being deleted.  
`status` |  String |  Status of the bundle. Returns `DELETING`.  
  
## Deletion behavior

  * The operation is **idempotent** — calling delete on an already-deleting bundle returns the same response without error.

  * All versions across all branches are deleted along with the bundle.

  * Once deletion completes, the bundle ID and name become available for reuse.

  * If the bundle is referenced by an active A/B test, the delete fails with a `ConflictException`. Stop the A/B test first.


## Errors

Error | HTTP status | Description  
---|---|---  
`ValidationException` |  400 |  Invalid request parameters.  
`ResourceNotFoundException` |  404 |  The specified `bundleId` does not exist.  
`ConflictException` |  409 |  The bundle is in use by another resource (for example, an active A/B test) and cannot be deleted.  
`AccessDeniedException` |  403 |  Insufficient permissions. Verify IAM policies include `bedrock-agentcore:DeleteConfigurationBundle`.  
`ThrottlingException` |  429 |  Request rate exceeded. Retry with exponential backoff.  
`InternalServerException` |  500 |  Service-side error. Retry the request.

