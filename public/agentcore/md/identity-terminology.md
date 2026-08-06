# AgentCore Identity terminology - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-terminology.html

---

# AgentCore Identity terminology

AgentCore Identity uses specific terminology to describe the components, processes, and relationships involved in workload identity management and credential handling. Understanding these terms will help you better comprehend how the service orchestrates secure authentication and authorization across multiple parties in agent workflows.

Term | Definition  
---|---  
**Identity and Authentication**  
Agent |  An AI-powered application or automated workload that performs tasks on behalf of users by accessing AWS resources and third-party services. Agents act with pre-authorized user consent, to accomplish user goals, such as retrieving data from APIs, processing information, or integrating with third-party systems. Unlike traditional applications that run with static credentials, agents require dynamic identity management to securely access resources across multiple trust domains while maintaining proper authentication and authorization boundaries.  
Agent identity |  A unique identifier and associated metadata for an AI agent or automated workload. Agent identities are implemented as workload identities with specific attributes that identify them as agents, enabling specialized agent capabilities while maintaining compatibility with broader workload identity standards. Agent identities enable agents to authenticate as themselves rather than impersonating users, supporting delegation-based access patterns.  
Agent identity directory |  A centralized registry that manages agent identities and their associated metadata and access policies. Similar to Cognito User Pools, it acts as a unit of governance for organizing agent identities within an account or region.  
Workload identity |  The underlying technical implementation for agent identities, representing a logical application or workload that is independent of specific hardware or infrastructure. Workload identities can operate across different environments while maintaining consistent authentication. Agent identities are a specialized type of workload identity with additional agent-specific attributes and capabilities.  
**Integration and Protocols**  
Cross-service agents |  AI agents that perform actions across multiple services, which may include accessing system resources (using machine-to-machine authentication) or user-specific data (using user-delegated access). Examples include agents that integrate with multiple backend systems for data processing or agents that access a user’s calendar, email, and document storage. These agents require sophisticated identity management to operate securely across different trust domains.  
MCP client |  A client component that allows agents to communicate with MCP servers to access external tools and resources. MCP clients present authentication tokens to access MCP tools securely.  
MCP server |  An intermediate server that hosts tools and resources for MCP clients. MCP servers act as OAuth 2.0 resource servers when accessed by agents and as OAuth 2.0 clients when accessing downstream resources.  
Model context protocol (MCP) |  MCP is an open protocol that standardizes how applications provide context to language models. AgentCore Identity is MCP-compliant, supporting standard protocols for agent-to-tool communication and enabling secure integration with MCP servers and tools.  
**OAuth and Token Management**  
OAuth 2.0 |  An industry-standard authorization framework (defined in [RFC 6749](<https://datatracker.ietf.org/doc/html/rfc6749>) ) that enables applications to obtain limited access to user accounts on external services without exposing user credentials. OAuth 2.0 provides secure delegation by allowing users to grant third-party applications access to their resources through access tokens rather than sharing passwords. For agent applications, OAuth 2.0 enables secure access to user data across multiple services while maintaining proper authentication boundaries and user consent mechanisms.  
OAuth 2.0 authorizer |  An SDK component that authenticates and authorizes incoming OAuth 2.0 API requests to agent endpoints. It validates tokens before allowing access to agent services.  
OAuth 2.0 client credentials grant (2LO) |  OAuth client credentials grant used for machine-to-machine authentication where no user interaction is required. Agents use 2LO to authenticate themselves directly with resource servers.  
OAuth 2.0 authorization code grant (3LO) |  OAuth authorization code grant that involves user consent and interaction. Agents use 3LO when they need explicit user permission to access user-specific data from external services like Google Calendar or Salesforce.  
Agent access token |  An AWS-signed token that contains both workload identity and user identity information, enabling downstream services to make authorization decisions based on both identities. These tokens are created through the token exchange process.  
**Security and Trust**  
Identity propagation |  The process of maintaining and passing identity context through a chain of service calls. This enables downstream services to make authorization decisions based on both the calling service identity and the original user identity.  
Trust domain |  A security boundary within which entities share common authentication and authorization mechanisms. Agent workflows often span multiple trust domains, requiring careful identity propagation and token exchange.  
Request verification security |  A security model where every request is authenticated and authorized regardless of source or previous trust relationships. AgentCore Identity implements request verification to ensure validation of all access requests.  
**Service Components**  
Resource credential provider |  A component that manages connections to external identity providers and resource servers, handling OAuth 2.0 authorization flows and credential retrieval. It orchestrates the complex process of obtaining and refreshing credentials from third-party services. For detailed configuration information, see [Configure credential provider](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./resource-providers.html>).  
Token vault |  A secure storage system for OAuth 2.0 tokens, API keys, and other credentials that operates with strict access controls. The token vault ensures credentials can only be accessed by the specific agent and user combination that originally obtained them.

