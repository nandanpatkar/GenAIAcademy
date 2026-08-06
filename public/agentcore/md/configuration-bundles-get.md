# Get a configuration bundle - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/configuration-bundles-get.html

---

# Get a configuration bundle  
  
Retrieve a configuration bundle to inspect its metadata or read the full configuration content of a specific version. Two operations are available:

  * **GetConfigurationBundle** — Returns the latest version of a bundle. If `branchName` is specified, returns the latest version on that branch. If omitted, returns the newest version across all branches. Use this to read the current active configuration.

  * **GetConfigurationBundleVersion** — Returns a specific historical version by version ID. Use this to inspect past configurations or compare versions.


## Bundle metadata vs version content

`GetConfigurationBundle` returns both the bundle-level metadata (name, description, ARN) and the full version content (components with their configuration key-value pairs). If you only need to know which versions exist without fetching their full content, use `ListConfigurationBundleVersions` instead.

`GetConfigurationBundleVersion` returns the same fields plus `versionCreatedAt`, which tells you exactly when that specific version was created (as opposed to `createdAt`, which is when the bundle itself was first created).

## Code samples

###### Example

AgentCore CLI
    

View version history for a bundle:

```bash
agentcore config-bundle versions --name myAgentConfig
```
Compare two versions side by side:

```bash
agentcore config-bundle diff --name myAgentConfig \
  --from <version-1> \
  --to <version-2>
```
###### Note

There is no direct "get bundle content" CLI command — the `config-bundle` subcommands are `versions`, `diff`, and `create-branch`. To enumerate versions and capture their IDs, use `agentcore config-bundle versions --name myAgentConfig --json` (optionally with `--branch <name>`, `--latest-per-branch`, or `--created-by <name>`), then feed the version IDs into `config-bundle diff`. To fetch the full configuration content of a bundle version, use the SDK/REST `GetConfigurationBundleVersion` operation shown below.

AWS SDK (boto3)
    

Get bundle metadata and latest version content:

```python
import boto3

client = boto3.client("bedrock-agentcore-control", region_name="us-west-2")

response = client.get_configuration_bundle(
    bundleId="myAgentConfig-a1b2c3d4e5"
)

print(f"Bundle: {response['bundleName']}")
print(f"Version: {response['versionId']}")
print(f"Branch: {response.get('lineageMetadata', {}).get('branchName', 'N/A')}")
print(f"Components: {response['components']}")
```
Get a specific historical version:

```python
response = client.get_configuration_bundle_version(
    bundleId="myAgentConfig-a1b2c3d4e5",
    versionId="12345678-1234-1234-1234-123456789012"
)

print(f"Version: {response['versionId']}")
print(f"Version created at: {response['versionCreatedAt']}")
print(f"Commit message: {response.get('lineageMetadata', {}).get('commitMessage', '')}")
print(f"Components: {response['components']}")
```
## Request parameters

### GetConfigurationBundle

Parameter | Type | Required | Description  
---|---|---|---  
`bundleId` |  String |  Yes |  The ID of the configuration bundle. Passed as a path parameter.  
`branchName` |  String |  No |  Branch name to get the latest version from. If omitted, returns the newest version across all branches.  
  
### GetConfigurationBundleVersion

Parameter | Type | Required | Description  
---|---|---|---  
`bundleId` |  String |  Yes |  The ID of the configuration bundle. Passed as a path parameter.  
`versionId` |  String |  Yes |  The UUID of the specific version to retrieve. Passed as a path parameter.  
  
## Response

Both operations return the same fields. `GetConfigurationBundleVersion` additionally returns `versionCreatedAt`.

Field | Type | Description  
---|---|---  
`bundleArn` |  String |  ARN of the configuration bundle.  
`bundleId` |  String |  ID of the configuration bundle.  
`bundleName` |  String |  Name of the bundle.  
`description` |  String |  Description of the bundle (if set).  
`versionId` |  String |  UUID of the version returned.  
`components` |  Map |  Map of component identifier to component configuration. Each value contains a `configuration` object with the key-value pairs stored in this version.  
`lineageMetadata` |  Object |  Version lineage metadata including `parentVersionIds`, `branchName`, `createdBy`, and `commitMessage`.  
`createdAt` |  Timestamp |  When the bundle was originally created.  
`updatedAt` |  Timestamp |  When the bundle was last updated (GetConfigurationBundle only).  
`versionCreatedAt` |  Timestamp |  When this specific version was created (GetConfigurationBundleVersion only).  
  
## Errors

Error | HTTP status | Description  
---|---|---  
`ValidationException` |  400 |  Invalid request parameters.  
`ResourceNotFoundException` |  404 |  The specified `bundleId` or `versionId` does not exist.  
`AccessDeniedException` |  403 |  Insufficient permissions. Verify IAM policies include `bedrock-agentcore:GetConfigurationBundle` or `bedrock-agentcore:GetConfigurationBundleVersion`.  
`ThrottlingException` |  429 |  Request rate exceeded. Retry with exponential backoff.  
`InternalServerException` |  500 |  Service-side error. Retry the request.

