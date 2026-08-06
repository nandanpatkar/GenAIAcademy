# Search for registry records - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-search-records.html

---

# Search for registry records

###### Upcoming namespace migration

AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry, you must update your endpoints, IAM policies, SDK clients, CLI scripts, and registry data. For more information about migrating from public preview, see [Comprehensive registry migration guide](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-faq.html>).

## Request Parameters

  * **searchQuery** (required): Can be any natural language query from 1–256 characters

  * **registryIds** (required): Which Registry to conduct the Search in. Supports exactly one registry ARN or ID

  * **maxResults** (optional): How many records are returned in the Search response. Can take any value between 1–20 and defaults to 10

  * **filters** (optional) — Metadata filter expression


## Metadata filters

Operators: `$eq` , `$ne` , `$in` . Logical: `$and` , `$or` . Fields: name, descriptorType, version.

Example: `{"descriptorType": {"$eq": "MCP"}}`

Combined: `{"$and": [{"descriptorType": {"$eq": "MCP"}}, {"version": {"$eq": "1.0"}}]}`

## Console

  1. Open the registry detail page.

  2. Choose the **Search records** tab.

  3. Enter your search query and view results.


###### Note

Console search is available for IAM-authorized registries only. For JWT-authorized registries, use the search API directly with an HTTP client (such as `curl` ) and a valid JWT bearer token, or use the MCP endpoint for the registry via an MCP client.

## AWS CLI (Registry with IAM based Inbound Authorization)

```bash
aws bedrock-agentcore search-registry-records \
  --search-query "weather" \
  --registry-ids "<registryARN>" \
  --region us-east-1
```
## AWS SDK (Registry with IAM based Inbound Authorization)

```python
import boto3

client = boto3.client('bedrock-agentcore')

response = client.search_registry_records(
    registryIds=['<registryARN>'],
    searchQuery='weather',
    maxResults=10
)
for record in response['registryRecords']:
    print(f"{record['name']} - {record['descriptorType']} - {record['status']}")
```
## HTTP client (Registry with OAuth based Inbound Authorization)

First obtain a bearer token:

```text
SECRET_HASH=$(echo -n "<username><appClientId>" | openssl dgst -sha256 -hmac "<appClientSecret>" -binary | base64)

aws cognito-idp initiate-auth \
  --client-id "<appClientId>" \
  --auth-flow USER_PASSWORD_AUTH \
  --auth-parameters USERNAME="<username>",PASSWORD='<password>',SECRET_HASH="$SECRET_HASH" \
  --region us-east-1 | jq -r '.AuthenticationResult.AccessToken'
```
Then search with the bearer token:

```bash
curl -X POST "https://bedrock-agentcore.<region>.amazonaws.com/registry-records/search" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{"registryIds": ["<registryARN>"], "searchQuery": "weather", "maxResults": 10}'
```
## Eventual consistency in AWS Agent Registry search

AWS Agent Registry uses an eventually consistent model for search indexing. When you approve a registry record by calling `UpdateRegistryRecordStatus` or through the console, the record does not appear in `SearchRegistryRecords` or `InvokeRegistryMcp` results immediately. It typically takes a few seconds for the approved record to be indexed and become discoverable, but in some cases it can take up to a few minutes.

During this time, you might observe the following behavior:

  * A `SearchRegistryRecords` query does not return a record that was just approved.

  * The registry MCP endpoint ( `InvokeRegistryMcp` ) does not include a recently approved record in tool results.


Only records in **Approved** status are included in search results. Records in Draft, Pending Approval, Rejected, or Deprecated status are never returned by `SearchRegistryRecords` or `InvokeRegistryMcp` . You can verify a record’s current status by calling `GetRegistryRecord` , which always returns the latest revision regardless of indexing state.

To handle eventual consistency in your application, we recommend the following:

  * After approving a record, confirm it is discoverable by calling `SearchRegistryRecords` with a retry strategy that includes exponential backoff.

  * Do not assume a record is missing from the registry if it does not appear in search results immediately after approval. Call `GetRegistryRecord` to verify the record’s status.

  * If you are integrating approval workflows through Amazon EventBridge and `UpdateRegistryRecordStatus` , add a brief delay before downstream systems query the search API for the newly approved record.


For general guidance on configuring retry behavior in AWS SDKs, see [Retry behavior](<https://docs.aws.amazon.com/sdkref/latest/guide/feature-retry-behavior.html>) in the _AWS SDKs and Tools Reference Guide_.

## How record attributes affect search relevance

AWS Agent Registry uses hybrid search that combines semantic understanding with keyword matching to return relevant results. If a record you expect to find does not appear in search results, understanding which record attributes influence search can help.

### Which record attributes are used for search

The following attributes from your registry record are used to determine search relevance:

  * **Name** — Used for keyword matching. Clear, descriptive names that reflect what the resource does improve discoverability for exact and partial name lookups.

  * **Description** — Used for both keyword and semantic matching. Descriptions written in natural language that explain the resource’s purpose and common use cases are more discoverable than terse technical labels.

  * **Descriptors** — The full content of your protocol definition (MCP server definition, agent card, skill documentation, or custom JSON) is used for semantic matching. This includes tool names, tool descriptions, input parameter names, and capability summaries.

  * **Version and descriptor type** — Available as filterable fields. Consumers can narrow results using metadata filters on `name` , `descriptorType` , and `version`.


### How search queries are processed

When you call `SearchRegistryRecords` , AWS Agent Registry runs two searches in parallel against the same set of indexed records and merges the results:

  * **Semantic search** — Your query is converted into a vector representation and compared against the vector representations of indexed records. This finds conceptually related records even when the exact words in your query don’t appear in the record. For example, a query for "book a flight" can match a record named "travel-reservation-service."

  * **Keyword search** — Your query is matched against the text content of record fields using traditional keyword relevance. This is effective for exact name lookups and specific technical terms. For example, a query for "weather-api-v2" matches records containing that exact text.


If you include metadata filters in your request, the filters are applied to both searches before results are scored and ranked. This means filters reduce the candidate set that both semantic and keyword search operate on, rather than filtering results after ranking.

### How results are ranked

Results from both semantic and keyword search are combined into a single ranked list and returned in order of relevance, with the most relevant record first. Each result’s final position is determined by its relevance across both searches — a record that ranks highly in both semantic and keyword results will appear higher than a record that ranks highly in only one. Within keyword search, the record name has the strongest influence on ranking, followed by the description and descriptor content, which contribute equally. Because both search modes always run and contribute to the final ranking, how you write your query affects which records surface. The following guidance can help you get better results depending on your intent.

### Writing effective search queries

**When you know the exact name or identifier** , use a short, specific query. Keyword search matches exact text against record names, descriptions, and descriptor content. Short queries like "weather-api-v2" or "pdf-processing" are effective for finding records by name.

**When you’re exploring by capability or use case** , use a natural language description of what you need. Semantic search understands conceptual intent, so queries like "find a tool that can book flights" or "extract structured data from PDF documents" can match relevant records even if those exact words don’t appear in the record metadata.

**Avoid mixing filter-like constraints with descriptive intent in the same query.** A query like "find all MCP servers for weather forecasts" sends the entire sentence through both semantic and keyword search. The semantic component interprets the full sentence as a conceptual intent, which can surface records that are conceptually related but don’t match the specific attribute you intended to constrain. Instead, use metadata filters for attribute-based constraints and keep the query focused on the topic. See When to use metadata filters versus query text.

### Writing discoverable records

  * Write descriptions that explain what the resource does and the problems it solves. Semantic search understands intent, so "helps customers track package deliveries" is more discoverable than "delivery-status-endpoint."

  * Provide complete tool definitions for MCP servers. Tool descriptions and input parameter descriptions all contribute to search relevance.

  * Include relevant keywords in your name and description. Keyword search matches exact text, so if consumers are likely to search for specific terms, make sure those terms appear in your record.


### When to use metadata filters versus query text

Use metadata filters when your intent is to constrain results by a known attribute such as record type, name, or version. Do not embed filter-like constraints in the query text itself. For example, if you want to find all MCP servers related to weather, use a metadata filter for the record type and a query for the topic:

```json
{
  "searchQuery": "weather forecast",
  "filters": {
    "descriptorType": { "$eq": "MCP" }
  }
}
```
Avoid putting the constraint into the query text like "find all MCP servers for weather forecasts". Because longer queries lean toward semantic matching, the words "MCP servers" are interpreted as part of the conceptual intent rather than as an exact filter. This can cause the semantic component to return records that are conceptually related to the full sentence but don’t match the specific attribute you intended to filter on — for example, returning agent records about weather alongside MCP server records. The same applies to any attribute-based constraint. If you want records with a specific name, version, or type, use the corresponding metadata filter rather than including those terms in the query.

You can filter on the following fields:

  * `name` — Match records by exact name.

  * `descriptorType` — Match records by resource type (for example, `MCP` , `A2A` , `SKILL` , `CUSTOM` ).

  * `version` — Match records by version string.


Filters support `$eq` (equals), `$ne` (not equals), and `$in` (matches any value in a list) operators, and can be combined using `$and` and `$or` logic.

For example, to search for weather-related MCP servers only:

```json
{
  "searchQuery": "weather forecast",
  "filters": {
    "descriptorType": { "$eq": "MCP" }
  }
}
```
To exclude a specific resource type:

```json
{
  "searchQuery": "<your query>",
  "filters": {
    "descriptorType": { "$ne": "CUSTOM" }
  }
}
```
To match any of several versions:

```json
{
  "filters": {
    "version": { "$in": ["1.0", "1.1", "2.0"] }
  }
}
```
### Search returns only approved records

Only records in **Approved** status appear in search results and through the MCP endpoint. Records in Draft, Pending Approval, Rejected, or Deprecated status are not returned. If a recently approved record does not appear in results, see Eventual consistency in AWS Agent Registry search.

