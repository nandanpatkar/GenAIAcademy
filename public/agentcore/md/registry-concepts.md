# Concepts and terminology - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-concepts.html

---

# Concepts and terminology

###### Upcoming namespace migration

AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry, you must update your endpoints, IAM policies, SDK clients, CLI scripts, and registry data. For more information about migrating from public preview, see [Comprehensive registry migration guide](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-faq.html>).

## Registry

A registry is a centralized catalog that you create in your AWS account to organize and manage resources. Each registry has a name, a description, an authorization configuration that controls how consumers access the search and MCP APIs, and an approval configuration that determines whether records require manual review before becoming discoverable.

How you organize your registries depends on your needs — for example, dedicated registries for different resource types (an agent registry, an MCP server registry, a skill registry), registries for different stages of development (production, QA, development), independent registries for different teams or business units, or a single registry for your entire organization.

## Registry record

A registry record represents the metadata for an individual resource published into a registry. Each record captures key metadata that describes the underlying resource — providing information about what it is, what it does, and how it can be found. Records have a name, optional description, version, type and resource-type-specific metadata.

## Resource types

**MCP servers** — Model Context Protocol (MCP) servers provide tools that AI agents can discover and invoke. An MCP server record contains a server definition describing the server’s configuration and tool definitions for all the tools the server provides, including their input parameters and output formats. AWS Agent Registry validates MCP server records against the [MCP protocol schema](<https://modelcontextprotocol.io/docs/getting-started/intro>) to ensure correctness.

**Agents** — Agents are autonomous programs that can reason, plan, and take actions to accomplish tasks. An agent record contains an agent card that describes the agent’s capabilities, skills, and communication interface per the A2A [(Agent-to-Agent)](<https://a2a-protocol.org/latest/>) protocol specification. AWS Agent Registry validates agent records against the A2A protocol schema to ensure correctness.

**Skills** — Skills are reusable capabilities that can be shared across agents. A skill record contains basic descriptor metadata like Name, Description, optional access information like Package or Repository details, and optional markdown documentation describing what the skill does and how to use it.

**Custom resources** — For resources that don’t fit the standard types above you can define your own metadata schema using any valid JSON structure.

## Credential provider

When you configure a registry record to synchronize metadata from an external source (outbound authorization) AWS Agent Registry needs credentials to access that source. A credential provider stores the authorization details — either OAuth credentials or an IAM role — that AWS Agent Registry uses to invoke the external resource’s endpoint during synchronization. You reference a credential provider by its ARN when configuring synchronization on a record. For more information, see [Manage credential providers](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-outbound-credential-provider.html>).

**Registry Authorization is of 2 types -**

  1. **Inbound Authorization** : This configuration enables Registry Administrators to control how Consumers can search the Registry (via AWS CLI, AWS SDK or by Invoking the MCP Endpoint). Registry supports IAM based and JWT based inbound Authorization. Registry Administrators specify this as part of the workflow for creating a Registry.

  2. **Outbound Authorization:** As part of Synchronizing MCP and A2A Records with their remote endpoints (for records where synchronization is setup), the registry requires outbound credentials to invoke the remote resource at the specified endpoint and retrieve metadata. Publishers provide these credentials as part of setting up the synchronization job for a particular registry record.


## Key Personas

Personas that use the Registry can vary from organization to organization. However, we have seen the following general personas that interact with the Registry, found commonly across organizations.

**Administrator**
    

The Administrator is the owner of the registry infrastructure. They are responsible for creating and configuring registries within the AWS account, deciding how each registry is organized (by team, environment, or resource type), and choosing the authorization method (IAM or JWT) that determines how consumers access the registry. Administrators set up the approval workflow — deciding whether records require manual review or are auto-approved — and configure Amazon EventBridge integrations to connect the registry to the organization’s existing notification and review systems. They manage IAM permissions to control which publishers, curators, and consumers can access each registry. Because they are the admin, they also have full access to create, update, and delete records, and can approve, reject, or deprecate records when needed.

**Publisher**
    

The Publisher is a builder within the organization who has created a resource — an MCP server, an agent, a skill, or some other tool — and wants to make it discoverable to others. Publishers create registry records that describe their resources, providing the metadata, definitions, and version information that will help others find and understand what the resource does. They iterate on records in Draft status, refining descriptions and schemas until the record is ready, then submit it for approval. If a record is rejected, the publisher reviews the curator’s feedback, makes the necessary changes, and resubmits. Publishers can also configure URL-based synchronization so that their records stay in sync with live MCP servers without manual updates.

**Curator / Approver**
    

The Curator is the quality gatekeeper of the registry, and can often be the Administrator of the Registry as well. They are responsible for reviewing records that publishers have submitted for approval, evaluating each record against the organization’s standards for security, compliance, metadata completeness, and any other criteria the organization defines. Curators approve records that meet these standards — making them visible in search results and through the MCP endpoint — and reject records that don’t, providing clear feedback on what needs to be fixed. When a resource is decommissioned, has known issues, or is superseded by a newer version, the curator deprecates the record to remove it from discovery. Curators ensure that the registry remains a trusted, high-quality catalog that builders across the organization can rely on.

**Consumer**
    

The Consumer is anyone — human or agent — who needs to find and use resources. Consumers search the registry using natural language queries or keyword lookups to discover MCP servers, agents, skills, and other resources that have been approved and published. They can also connect to the registry’s MCP endpoint using any MCP-compatible client to discover available tools programmatically. Consumers only see approved records, so they can trust that everything they find in the registry has been reviewed and meets the organization’s quality standards. Consumers may authorize via IAM credentials or JWT tokens from a corporate identity provider, depending on how the registry is configured.

