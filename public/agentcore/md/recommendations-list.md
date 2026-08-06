# List recommendations - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/recommendations-list.html

---

# List recommendations  
  
List all recommendations in your account. Results are paginated and can be filtered by status.

## Code samples

###### Example

AgentCore CLI
    

List past recommendation jobs (running jobs are refreshed from the service):

```bash
agentcore view recommendation
```
View a single recommendation by ID:

```bash
agentcore view recommendation <recommendation-id>
```
Add `--json` for machine-readable output:

```bash
agentcore view recommendation --json
```
AWS SDK (boto3)
     ```python
     import boto3

     client = boto3.client("bedrock-agentcore", region_name="us-west-2")

     # List all recommendations
     response = client.list_recommendations()
     for rec in response["recommendationSummaries"]:
         print(f"{rec['recommendationId']} | {rec['name']} | {rec['type']} | {rec['status']}")
     ```
Filter by status:

```python
response = client.list_recommendations(statusFilter="COMPLETED")

for rec in response["recommendationSummaries"]:
    print(f"{rec['recommendationId']}  {rec['name']}  {rec['status']}")
```
Paginate through all results:

```python
paginator = client.get_paginator("list_recommendations")
for page in paginator.paginate(statusFilter="COMPLETED"):
    for rec in page["recommendationSummaries"]:
        print(rec["recommendationId"])
```
## Request parameters

Parameter | Type | Required | Description  
---|---|---|---  
`maxResults` |  Integer |  No |  Maximum number of results per page. Range: 1–100.  
`nextToken` |  String |  No |  Pagination token from a previous response.  
`statusFilter` |  String |  No |  Filter by status. One of: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `FAILED`, `DELETING`.  
  
## Response

Field | Type | Description  
---|---|---  
`recommendationSummaries` |  List |  List of recommendation summaries.  
`nextToken` |  String |  Pagination token for the next page. Absent when there are no more results.  
  
### Recommendation summary fields

Field | Type | Description  
---|---|---  
`recommendationId` |  String |  Unique identifier.  
`recommendationArn` |  String |  ARN of the recommendation.  
`name` |  String |  The recommendation name.  
`description` |  String |  Optional description, if provided.  
`type` |  String |  `SYSTEM_PROMPT_RECOMMENDATION` or `TOOL_DESCRIPTION_RECOMMENDATION`.  
`status` |  String |  Current status: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `FAILED`, `DELETING`.  
`createdAt` |  Timestamp |  When the recommendation was created.  
`updatedAt` |  Timestamp |  When the recommendation was last updated.  
  
To retrieve the full details and results of a recommendation, use [Get a recommendation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./recommendations-get.html>) with the `recommendationId`.

## Errors

Error | HTTP status | Description  
---|---|---  
`ValidationException` |  400 |  Invalid pagination parameters or status filter value.  
`AccessDeniedException` |  403 |  Insufficient permissions.  
`ThrottlingException` |  429 |  Request rate exceeded.  
`InternalServerException` |  500 |  Service-side error.

