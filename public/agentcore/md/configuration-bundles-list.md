# List configuration bundles - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/configuration-bundles-list.html

---

# List configuration bundles  
  
List configuration bundles in your account, or list versions of a specific bundle. Two operations are available:

  * **ListConfigurationBundles** — Returns all bundles in your account with summary information.

  * **ListConfigurationBundleVersions** — Returns all versions of a specific bundle, with optional filtering by branch or creation source.


Both operations support pagination.

## Code samples

###### Example

AgentCore CLI
    

List versions of a bundle:

```bash
agentcore config-bundle versions --name myAgentConfig
```
Filter by branch:

```bash
agentcore config-bundle versions --name myAgentConfig --branch mainline
```
Show only the latest version per branch:

```bash
agentcore config-bundle versions --name myAgentConfig --latest-per-branch
```
Filter by creator (for example, versions created by a recommendation job):

```bash
agentcore config-bundle versions --name myAgentConfig --created-by recommendation
```
AWS SDK (boto3)
    

List all bundles with pagination:

```python
import boto3

client = boto3.client("bedrock-agentcore-control", region_name="us-west-2")

paginator = client.get_paginator("list_configuration_bundles")
for page in paginator.paginate(maxResults=20):
    for bundle in page["bundles"]:
        print(f"{bundle['bundleId']} - {bundle['bundleName']}")
```
List versions of a specific bundle:

```python
response = client.list_configuration_bundle_versions(
    bundleId="myAgentConfig-a1b2c3d4e5",
    filter={"branchName": "mainline"},
    maxResults=20,
)

for version in response["versions"]:
    lineage = version.get("lineageMetadata", {})
    print(
        f"{version['versionId']}  "
        f"{version['versionCreatedAt']}  "
        f"{lineage.get('commitMessage', '')}"
    )
```
## Request parameters

### ListConfigurationBundles

Parameter | Type | Required | Description  
---|---|---|---  
`maxResults` |  Integer |  No |  Maximum number of results to return per page. Range: 1–100.  
`nextToken` |  String |  No |  Pagination token from a previous response.  
  
### ListConfigurationBundleVersions

Parameter | Type | Required | Description  
---|---|---|---  
`bundleId` |  String |  Yes |  The ID of the configuration bundle. Passed as a path parameter.  
`filter` |  Object |  No |  Optional filter. See Version filter below.  
`maxResults` |  Integer |  No |  Maximum number of results to return per page. Range: 1–100.  
`nextToken` |  String |  No |  Pagination token from a previous response.  
  
### Version filter

Field | Type | Description  
---|---|---  
`branchName` |  String |  Return only versions on this branch.  
`createdByName` |  String |  Return only versions created by this source name (for example, `optimization-job` or `recommendation`).  
`latestPerBranch` |  Boolean |  When `true`, returns only the latest version for each branch. Can be combined with `branchName` to get the latest for a specific branch.  
  
## Response

### ListConfigurationBundles

Field | Type | Description  
---|---|---  
`bundles` |  List |  List of bundle summaries. Each contains `bundleArn`, `bundleId`, `bundleName`, and `description`.  
`nextToken` |  String |  Pagination token for the next page. Absent when there are no more results.  
  
### ListConfigurationBundleVersions

Field | Type | Description  
---|---|---  
`versions` |  List |  List of version summaries. Each contains `bundleArn`, `bundleId`, `versionId`, `lineageMetadata`, and `versionCreatedAt`.  
`nextToken` |  String |  Pagination token for the next page. Absent when there are no more results.  
  
## Errors

Error | HTTP status | Description  
---|---|---  
`ValidationException` |  400 |  Invalid request parameters.  
`ResourceNotFoundException` |  404 |  The specified `bundleId` does not exist (ListConfigurationBundleVersions only).  
`AccessDeniedException` |  403 |  Insufficient permissions.  
`ThrottlingException` |  429 |  Request rate exceeded. Retry with exponential backoff.  
`InternalServerException` |  500 |  Service-side error. Retry the request.

