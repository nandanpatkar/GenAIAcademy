# AWS Agent Registry: Discover and manage agents, tools, and resources (Preview) - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry.html

---

# AWS Agent Registry: Discover and manage agents, tools, and resources (Preview)

###### Topics

  * What is AWS Agent Registry?

  * Why use AWS Agent Registry?

  * How it works

  * Accessing AWS Agent Registry

  * Related services

  * [Key capabilities](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-key-capabilities.html>)

  * [Concepts and terminology](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-concepts.html>)

  * [Prerequisites](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-prerequisites.html>)

  * [Sample use cases](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-use-cases.html>)

  * [Get started with AWS Agent Registry](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-get-started.html>)

  * [Creating and managing registries](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-managing-registries.html>)

  * [Creating and managing registry records](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-managing-records.html>)

  * [Curating the registry](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-curating.html>)

  * [Searching the registry](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-searching.html>)

  * [Notifications (Amazon EventBridge)](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-eventbridge.html>)

  * [Log Registry API calls with AWS CloudTrail](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-cloudtrail.html>)

  * [IAM Permissions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-iam-permissions.html>)

  * [Troubleshooting](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-troubleshooting.html>)

  * [Comprehensive registry migration guide](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-faq.html>)


## What is AWS Agent Registry?

AWS Agent Registry is a fully managed discovery service that provides a centralized catalog for organizing, curating, and discovering resources across your organization. With AWS Agent Registry, you can publish MCP servers, tools, agents, agent skills, and custom resources into a searchable registry, control access through an approval workflow, and enable both human users and AI agents to discover the right tools and agents using semantic and keyword search.

## Why use AWS Agent Registry?

As organizations scale their use of AI agents and tools, discovering the right resource becomes increasingly difficult. Teams build MCP servers, deploy agents, and create specialized tools — but without a central catalog, these resources remain siloed and hard to find. This also causes duplication of effort and increased technical debt as teams re-build resources that already exist simply because they are unable to discover them. AWS Agent Registry solves this by providing:

  * **Centralized discovery** – A single place to find all published resources across your organization, searchable by both humans and agents.

  * **Governance and curation** – An approval workflow that ensures only records meeting your organization’s criteria for security, compliance, and quality are discoverable. Administrators control what builders in their organization can discover and use, and can remove resources being discoverable at any time.

  * **Flexible resource types** – Register MCP servers, agents, skills, and any custom resource. AWS Agent Registry validates MCP and agent records against their respective protocol schemas, and supports custom metadata for all resource types.

  * **Hybrid search** – Combines semantic understanding with keyword matching so that both natural language queries and exact name lookups return relevant results.

  * **MCP-native access** – The Registry is available at a remote MCP endpoint that lets MCP-compatible clients interact with the registry directly using the Model Context Protocol.

  * **Flexible authorization** – Choose between AWS IAM credentials or JSON Web Tokens (JWT) from your corporate identity provider to control who can search and invoke the registry’s MCP endpoint.


## How it works

AWS Agent Registry is organized around two core resources:

  * **Registries** – A registry is a catalog that you create in your AWS account. Each registry has its own Name, Description, Authorization configuration (IAM or JWT), approval settings, and set of records. You can create a single organization wide registry, create registries organized by resource type (such as an agent registry, MCP server registry, or skill registry), by stage of development (production, QA, development), by team or business unit — whatever setup works best for you.

  * **Registry records** – A record represents an individual resource published into a registry. Each record captures key metadata that describes the underlying resource — providing information about what it is, what it does, and how it can be found.


### Typical workflow

  1. **Create a registry** – An administrator creates a registry and configures authorization and approval settings.

  2. **Publish records** – A publisher creates registry records describing their MCP servers, agents, or tools, and submits them for approval.

  3. **Curate the registry** – A curator (or the administrator) reviews records pending approval and approves or rejects them; They also deprecate records no longer in use.

  4. **Discover resources** – Consumers/End-Users search for resources relevant to their needs in the registry.


You can learn more about how to configure IAM Permissions specific to each Persona in [Key Personas](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-concepts.html#registry-concept-personas>).

## Accessing AWS Agent Registry

You can interact with AWS Agent Registry by directly invoking the Registry service’s public APIs via the AWS CLI or AWS SDKs, or by invoking the registry’s MCP endpoint with any valid MCP-compatible client.

## Related services

  * [Host agent or tools with Amazon Bedrock AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./agents-tools-runtime.html>) – Deploy and run the agents and MCP servers that you register.

  * [Amazon Bedrock AgentCore Gateway: Securely connect tools and other resources to your Gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway.html>) – Convert APIs and Lambda functions into MCP-compatible tools that can be registered.

  * [Provide identity and credential management for agent applications with Amazon Bedrock AgentCore Identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity.html>) – Manage identity and credential providers used for JWT-based registry authorization.

  * [Amazon EventBridge](<https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html>) – Receive notifications when registry records are submitted for approval.

  * [AWS CloudTrail](<https://docs.aws.amazon.com/awscloudtrail/latest/userguide/>) – Log and monitor all API calls made to AWS Agent Registry.



