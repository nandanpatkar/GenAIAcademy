# Sample use cases - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-use-cases.html

---

# Sample use cases

###### Upcoming namespace migration

AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry, you must update your endpoints, IAM policies, SDK clients, CLI scripts, and registry data. For more information about migrating from public preview, see [Comprehensive registry migration guide](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-faq.html>).

Below you will find some examples use cases where registry can be used.

## Discover Agents or Tools for building an internal workflow

A builder is creating an internal HR workflow that generates a report of employee time-off balances. The workflow needs access to an employee information service, a PTO tracking service, and a document generation service like SharePoint. Rather than asking around or searching through internal wikis, the builder searches the AWS Agent Registry for services matching their needs. They find all three services registered with their connection details and tool schemas, and use this information to construct the workflow — reducing what would have been days of discovery into minutes.

## Add a new capability to a customer-facing agent

A builder maintains an external customer service agent that handles order inquiries. They need to add a new use case: helping customers track delayed package deliveries. The agent already has access to customer information and order history services, but needs a delivery tracking service. The builder searches the registry, finds a registered delivery tracking service with the right capabilities, attaches it to their Gateway, and updates the agent’s policy to allow calls to this new service — all without needing to know which team built the delivery service or how to contact them.

## Manage agent sprawl across teams

An administrator reviewing the registry notices that a new team is building a travel booking agent with capabilities very similar to an existing travel planning agent registered by another team. By discovering this overlap through the registry, the administrator connects the two teams. Instead of duplicating effort, the existing agent is updated with the additional capabilities, and the organization avoids maintaining two agents that do essentially the same thing.

## Share reusable skills across agents

A team has developed a skill for extracting structured data from PDF documents. They received positive feedback about the effectiveness of this skill, and were asked to broadly share this skill across the organization to boost collective productivity. Instead of reaching out to each team independently, they publish the skill to the registry with detailed markdown documentation and a structured definition. Other agent builders discover the skill through search and integrate it into their own agents, accelerating development across the organization.

## Enforce quality standards through curation

A builder submits a new MCP server record to the registry. The submission triggers an Amazon EventBridge notification that kicks off the organization’s standard review pipeline. The automated pipeline checks that the server definition includes complete tool descriptions, that input schemas are properly defined, and that the server meets the organization’s security requirements. The review finds that several tool descriptions are missing required fields. The curator rejects the record with a detailed reason, and the builder receives feedback on what to fix before resubmitting.

## Keep registry records synchronized with live servers

A team deploys MCP servers on AgentCore Runtime whose tool definitions evolve as new features are added. Rather than manually updating registry records every time a tool changes, they configure URL-based synchronization on each record and simply come to the registry periodically to trigger synchronization. When they do so, AWS Agent Registry fetches the latest server and tool metadata from the MCP server’s endpoint, keeping the registry accurate.

