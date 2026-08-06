# Features of AgentCore Identity - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/key-features-and-benefits.html

---

# Features of AgentCore Identity

AgentCore Identity offers a set of features designed to address the unique challenges of workload identity management and credential security:

###### Topics

  * Centralized agent identity management

  * Secure credential storage

  * OAuth 2.0 flow support

  * Agent identity and access controls

  * AgentCore SDK Integration

  * Request verification security


## Centralized agent identity management

Create, manage, and organize agent and workload identities through a unified directory service that acts as the single source of truth for all agent identities within your organization. Each agent receives a unique identity with associated metadata (such as name, ARN, OAuth return URLs, created time, last updated time) that can be managed centrally across your organization. The agent identity directory functions similarly to [Cognito User Pools](<https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html#what-is-amazon-cognito-user-pools>) , providing a unit of governance that allows administrators to configure policies across a common set of agent identities. Agent identities are managed as specialized workload identities with agent-specific attributes and capabilities. For detailed procedures on creating and managing agent identities, see [Manage workload identities with AgentCore Identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-manage-agent-ids.html>).

The centralized approach eliminates the complexity of managing agent identities across different environments and systems. Whether your agents run on AgentCore Runtime, self-hosted environments, or hybrid deployments, the service provides consistent identity management regardless of where your agents are deployed. Each agent identity receives a unique ARN (such as `arn:aws:bedrock-agentcore:region:account:workload-identity/directory/default/workload-identity/agent-name`) that enables precise access control and resource management. This centralization also enables hierarchical organization and group-based access controls, making it easier to implement enterprise-wide governance policies and maintain compliance across all agent operations. The hierarchical structure in the ARN path (with directory/default/workload-identity/agent-name components) allows administrators to organize agents logically and apply policies at different levels of the hierarchy—for example, targeting all agents within a specific directory or with similar attributes—without having to manage each agent identity individually.

## Secure credential storage

The token vault provides security for storing OAuth 2.0 tokens, OAuth client credentials, and API keys with comprehensive encryption at rest and in transit. All credentials are encrypted using either customer-managed or service-managed AWS KMS keys and access-controlled to prevent unauthorized retrieval. The vault implements strict access controls, ensuring that credentials can only be accessed by authorized agents for specific purposes and only when they present verifiable proof of workload identity.

Building on OAuth 2.0’s scope-based security model, the token vault implements additional security measures where every access request is validated independently, even from callers within the same trust domain. This extra security mechanism is necessary to protect end-user data from malicious or misbehaving agent code. The vault securely stores OAuth 2.0 tokens, reducing security risks while improving your overall security posture.

## OAuth 2.0 flow support

Native support for both OAuth 2.0 client credentials grant (machine-to-machine) and OAuth 2.0 authorization code grant (user-delegated access) flows enables comprehensive authentication patterns for different use cases. The service handles the complexity of OAuth 2.0 implementations while providing simple APIs for agents to access AWS resources and third-party services. For 2LO flows, agents can authenticate themselves directly with resource servers without user interaction, while 3LO flows enable explicit user consent and authorization for accessing user-specific data from external services.

The service also provides built-in OAuth 2.0 credential providers for popular services such as Google, GitHub, Slack, Salesforce, and Atlassian (Jira), with authorization server endpoints and provider-specific parameters pre-filled to reduce development effort. For custom integrations, the service supports configurable OAuth 2.0 credential providers that can be tailored to work with any OAuth 2.0-compatible resource server. This comprehensive OAuth 2.0 support eliminates the heavy-lifting of agent developers implementing complex authorization flows and reduces the risk of security vulnerabilities in custom implementations. For comprehensive information about configuring these providers, see [Configure credential provider](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./resource-providers.html>).

## Agent identity and access controls

AgentCore Identity supports impersonation flow where agents can access resources using credentials provided to them. This approach enables agents to perform actions on behalf of users while maintaining audit trails and access controls. The impersonation process allows agents to use provided credentials to access resources, with authorization decisions based on those credentials.

## AgentCore SDK Integration

Seamless integration with the AgentCore SDK through declarative annotations like @requires_access_token and @requires_api_key automatically handles credential retrieval and injection, reducing boilerplate code and potential security vulnerabilities. These annotations eliminate the need for developers to implement complex OAuth flows manually, instead providing a simple declarative interface that abstracts away the underlying complexity of token management and credential handling.

The SDK integration also provides automatic error handling for common scenarios such as token expiration and user consent requirements. When tokens expire or user consent is needed, the SDK automatically generates appropriate authorization URLs and handles the OAuth flow orchestration, presenting developers with simple success or failure responses. This integration significantly reduces development time and the likelihood of security vulnerabilities while ensuring that all credential operations follow security best practices.

## Request verification security

The service implements validation of all requests, including token signature verification, expiration checks, and scope validation.

By treating every request as requiring verification and requiring explicit proof of authorization, the service implements security validation for each request. All operations are logged with detailed context for security monitoring and compliance reporting, providing visibility into agent activities.

These features combine to provide significant benefits for organizations deploying AI agents:

  * **Reduced Security Risk** : Centralized credential management eliminates the need to embed secrets in agent code or configuration files.

  * **Simplified Development** : Declarative APIs and SDK integration reduce the complexity of implementing secure authentication in agent applications.

  * **Enhanced Compliance** : Comprehensive audit trails and access controls support regulatory compliance requirements.

  * **Operational Efficiency** : Automated credential refresh reduces operational overhead while improving security posture.



