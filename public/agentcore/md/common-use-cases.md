# Supported authentication patterns - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/common-use-cases.html

---

# Supported authentication patterns

AgentCore Identity supports two primary authentication patterns that address different agent use cases. Understanding these patterns will help you choose the right approach for your specific agent implementation.

For detailed examples of how these patterns apply to specific industries and agent types, see [Example use cases](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-use-cases.html>).

###### Topics

  * User-delegated access (OAuth 2.0 authorization code grant)

  * Machine-to-machine authentication (OAuth 2.0 client credentials grant)

  * On-behalf-of token exchange (OAuth 2.0 token exchange)

  * Choosing the right authentication pattern

  * [On-behalf-of token exchange with AgentCore Identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./on-behalf-of-token-exchange.html>)


## User-delegated access (OAuth 2.0 authorization code grant)

The OAuth 2.0 authorization code grant flow enables agents to access user-specific data with explicit user consent. This pattern is essential when agents need to access personal data or perform actions on behalf of specific users. The flow includes a user consent step where the resource owner (user) explicitly authorizes the agent to access their data within specific scopes.

**Key characteristics**

  * Requires explicit user consent through an authorization prompt

  * Provides access to user-specific data and resources

  * Maintains clear separation between agent identity and user authorization

  * Supports fine-grained scopes that limit what data the agent can access


**Example scenario** – A productivity agent needs to access a user’s Google Calendar to schedule meetings, their Gmail to send emails, and their Google Drive to store documents. The agent uses the OAuth 2.0 authorization code grant to obtain user consent for each service, with specific scopes that limit access to only the necessary data. The user explicitly authorizes the agent through Google’s consent screen, and AgentCore Identity securely stores the resulting credentials for future use.

This pattern is ideal for personal assistant agents, customer service agents, and any scenario where agents need access to user-specific data across multiple services. For detailed industry-specific examples, see [Personal assistant agents](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-use-cases.html#personal-assistant-agents>) and [Customer service agents](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-use-cases.html#customer-service-agents>).

## Machine-to-machine authentication (OAuth 2.0 client credentials grant)

The OAuth 2.0 client credentials grant flow enables direct authentication between systems without user interaction. This pattern is appropriate when agents need to access resources that aren’t user-specific or when agents act themselves with pre-authorized user consent.

**Key characteristics**

  * No user interaction or consent required

  * Agent authenticates directly with resource servers using its own credentials

  * Suitable for background processes, scheduled tasks, and system-level operations

  * Permissions are defined at the agent level rather than per-user


**Example scenario** – An enterprise data processing agent needs to collect data from multiple internal systems, process it, and store the results in a data warehouse. The agent uses the OAuth 2.0 client credentials grant to authenticate directly with each system using its own identity and pre-configured permissions. No user interaction is required, and the agent can operate when agents act themselves with pre-authorized user consent on scheduled intervals.

This pattern is ideal for enterprise automation agents, data processing workflows, and DevOps automation. For detailed industry-specific examples, see [Enterprise automation agents](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-use-cases.html#enterprise-automation-agents>) , [Data processing and analytics agents](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-use-cases.html#data-processing-and-analytics-agents>) , and [Development and DevOps agents](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-use-cases.html#development-and-devops-agents>).

## On-behalf-of token exchange (OAuth 2.0 token exchange)

On-behalf-of (OBO) token exchange enables agents to access downstream resource servers on behalf of an already-authenticated user. The agent exchanges the inbound user token for a new, audience-scoped access token through an outbound credential provider, binding both the user’s identity and the agent’s identity into the resulting token. Downstream services can then make authorization decisions based on both identities — without requiring the user to go through another consent flow.

**Key characteristics**

  * No additional user consent — the inbound user token is exchanged directly for a downstream access token

  * Propagates both the user’s identity and the agent’s (or workload’s) identity across multiple hops, giving each downstream service the context to make its own authorization decisions

  * Supports standard token exchange ([RFC 8693](<https://www.rfc-editor.org/rfc/rfc8693.html>)) or JWT authorization grant ([RFC 7523](<https://www.rfc-editor.org/rfc/rfc7523.html>)), depending on the identity provider


**Example scenario: Accessing a per-user business application** – An enterprise has an internal HR application that enforces per-user access control — each employee can only see their own compensation and benefits data. The company wants to let employees query this application through an AI agent, without relaxing any of the existing access policies.

  1. **Mike (identity admin)** configures the HR application as an OAuth Credential Provider in AgentCore Identity, including the OBO token exchange mode. Once set up, no per-user provisioning is needed — any employee who can authenticate to the agent can reach the HR application through it.

  2. **Bob (agent developer)** adds a tool that calls the HR application. He doesn’t write any token exchange logic or handle client secrets. He calls [`GetResourceOauth2Token`](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_GetResourceOauth2Token.html>) with the workload access token, and AgentCore Identity returns a scoped downstream token. Bob focuses on what the agent does with the data, not how it gets authorized.

  3. **Sarah (end user)** signs into the agent and asks it to pull her benefits summary. She is not prompted to sign in a second time. Behind the scenes, AgentCore Identity exchanges Sarah’s inbound token for a downstream access token that carries her identity. The HR application applies its existing access policies and returns only Sarah’s data — the same data she would see if she accessed the application directly.


This pattern is ideal for enterprise agents that traverse multiple identity-aware services in a single trust domain. For a deep-dive on grant types, configuration, and supported identity providers, see [On-behalf-of token exchange](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./on-behalf-of-token-exchange.html>).

## Choosing the right authentication pattern

When designing your agent authentication strategy, consider these factors to determine which pattern is most appropriate:

Factor | User-delegated access (OAuth 2.0 authorization code grant) | Machine-to-machine authentication (OAuth 2.0 client credentials grant) | On-behalf-of token exchange (OAuth 2.0 token exchange)  
---|---|---|---  
Data ownership |  User-specific data (emails, documents, personal calendars) |  System or organization-owned data (analytics, logs, shared resources) |  User-specific data, where the user is already authenticated to the agent  
User interaction |  User is present and can provide consent |  No user interaction required or available |  User is already authenticated to the agent; no new consent prompt  
Operation timing |  Interactive, real-time operations |  Background, scheduled, or batch operations |  Interactive, real-time operations initiated by an authenticated user  
Permission scope |  Permissions vary by user and their consent choices |  Consistent permissions defined at the agent level |  Permissions derived from the inbound user token and downstream provider policy  
  
Many agent implementations will require all patterns for different aspects of their functionality. For example, a customer service agent might use user-delegated access to retrieve a specific customer’s data while using machine-to-machine authentication to access company knowledge bases and internal systems. The same agent may also use on-behalf-of token exchange to propagate the user’s identity to downstream services that enforce per-user authorization, without prompting the user again. AgentCore Identity supports all patterns simultaneously, allowing agents to use the most appropriate authentication mechanism for each resource they need to access.

All authentication patterns benefit from AgentCore Identity’s core capabilities:

  * Secure credential storage without exposing secrets to agent code

  * Consistent authentication interfaces across multiple resource types

  * Comprehensive audit logging for security and compliance

  * Fine-grained access controls based on identity and context

  * Simplified integration through the AgentCore SDK



