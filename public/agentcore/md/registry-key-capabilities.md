# Key capabilities - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-key-capabilities.html

---

# Key capabilities

###### Upcoming namespace migration

AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry, you must update your endpoints, IAM policies, SDK clients, CLI scripts, and registry data. For more information about migrating from public preview, see [Comprehensive registry migration guide](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-faq.html>).

## Flexible resource types

Add records of any type with a flexible structure and custom metadata. AWS Agent Registry directly supports MCP servers, agents, and skills. For MCP Server and Agent records, AWS Agent Registry validates your definitions against the MCP and A2A protocol schemas respectively, ensuring correctness before records are published. You can also register any kind of custom resource — such as agents conforming to protocols other than A2A, APIs, Lambda functions, knowledge bases, or databases — by defining your own metadata schema. This means AWS Agent Registry can serve as a unified catalog for all discoverable resources in your organization, regardless of the underlying technology.

## Hybrid search

AWS Agent Registry combines semantic search with keyword matching to deliver relevant results for any type of query. When you search using natural language — such as "find a tool that can book flights" — semantic search understands the intent and finds conceptually relevant records, even if those exact words don’t appear in the record metadata. When you search using exact terms — such as "weather-api-v2" — keyword search matches the precise text. Both search modalities run simultaneously on every query, with results ranked by a weighted combination of relevance scores. You can further narrow results using metadata filters on fields such as record name, record types, and version.

## Governance and curation

AWS Agent Registry gives administrators control over what builders in their organization can discover and use. Administrators can ensure that only records meeting internally defined criteria for security, metadata richness, compliance, safety, and any other organizational standards are approved and made visible in search results. When a curator needs to remove a resource from discovery — whether due to a newly discovered issue, a deprecation, or a policy change — they can deprecate existing approved records, ensuring those resources can no longer be found by builders. For development environments where manual review isn’t needed, administrators can enable auto-approval so that submitted records become discoverable immediately.

## Amazon EventBridge notifications

AWS Agent Registry sends events to Amazon EventBridge when a record is submitted for approval. You can use these events to trigger automated review workflows, send alerts to curators via email or messaging, or integrate with ticketing systems and approval pipelines. Events are delivered to the default Amazon EventBridge bus in your account and Region, and can be routed to any Amazon EventBridge-supported target including AWS Lambda, Amazon Simple Notification Service, Amazon Simple Queue Service, and AWS Step Functions.

## Integrate with existing approval workflows

Many organizations already have established mechanisms for reviewing and approving resources — processes that include security reviews, compliance checks, safety assessments, and other evaluations. AWS Agent Registry can be integrated with these existing workflows through Amazon EventBridge and the UpdateRegistryRecordStatus API. When a publisher submits a record for approval, AWS Agent Registry sends an Amazon EventBridge notification that can trigger your existing review pipeline. Once your pipeline completes its checks, it calls the UpdateRegistryRecordStatus API to approve or reject the record. By integrating AWS Agent Registry with your existing review pipeline, you can curate the registry directly from your existing approval process without changing how your organization reviews resources.

## Discovering Resources using the Registry’s MCP Server

Each registry exposes an MCP-compatible endpoint that MCP clients can connect to directly using the Model Context Protocol. This allows agents and tools built on MCP to discover and interact with registered resources using standard MCP protocol communication — without needing to use the AWS SDK or integrate with AWS-specific APIs. Any valid MCP-compatible client can connect to the registry’s MCP endpoint and search for available resources in the registry. This enables developers using AI IDEs to easily discover existing agents and tools in the organization and leverage them as they build new agentic workflows.

## Flexible Authorization

AWS Agent Registry supports two authorization methods for the search and MCP invoke operations, so you can choose the approach that fits your organization:

  * **AWS IAM** — Use your existing IAM credentials for authorization. This is the simplest option for teams already working within AWS, requiring no additional configuration.

  * **JSON Web Tokens (JWT)** — Integrate the registry with your organization’s existing identity provider — such as Amazon Cognito, Okta, Microsoft Azure AD, or any OAuth 2.0-compatible provider. Your developers and agents can search the registry and invoke the MCP endpoint using their existing corporate credentials, without needing individual IAM access.


Control plane operations (creating, updating, and managing registries and records) always use IAM authorization regardless of the registry’s search authorization setting.

## Record synchronization

AWS Agent Registry can synchronize record metadata from external sources, keeping your registry up to date. When you configure a record with a URL pointing to an external MCP server, AWS Agent Registry fetches the latest server (Details like Name, Description) and tool metadata (Tool Names, Tool Descriptions) from that URL and updates the record. Synchronization can be used both to create the record the first time by pulling the metadata from the URL provided, or update an existing record with fresh metadata due to changes in the underlying resource. When Synchronization is used for an existing record, a new revision for the existing record is created. Synchronization supports both OAuth and IAM credential providers for authorization.

## CloudTrail integration

AWS Agent Registry control plane API calls are logged in AWS CloudTrail, providing a complete audit trail of who did what and when. Control plane operations are logged as management events by default.

