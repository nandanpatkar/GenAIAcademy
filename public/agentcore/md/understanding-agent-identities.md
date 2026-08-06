# Understanding workload identities - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/understanding-agent-identities.html

---

# Understanding workload identities

Workload identities represent the digital identity of your agents within the AWS environment. They serve as a stable anchor point that persists across different deployment environments and authentication schemes, allowing agents to maintain consistent identity whether they’re using IAM roles for AWS resource access, OAuth2 tokens for external service integration, or API keys for third-party tool access. The identity system abstracts the complexity of managing multiple credential types while providing a unified interface for authentication and authorization operations.

Workload identities integrate seamlessly with the broader AgentCore Identity framework, including the token vault for secure credential storage (see [Secure credential storage](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./key-features-and-benefits.html#secure-credential-storage>) ), Resource credential providers for external service access (see [Configure credential provider](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./resource-providers.html>) ), and the AgentCore Identity directory for centralized management. For more information about the directory, see [Understanding the agent identity directory](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./agent-identity-directory.html>).

###### Topics

  * How workload identities are created


## How workload identities are created

Workload identities are created automatically in several scenarios and can also be created manually when needed. These identities are used to obtain workload access tokens that authorize agent access to credentials. For details about how workload identities are used in the authentication flow, see [Get workload access token](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./get-workload-access-token.html>).

**Automatic creation by Runtime and Gateway**

  * When you deploy an agent using AgentCore Runtime, a workload identity is automatically created and associated with your agent

  * AgentCore Gateway also creates workload identities automatically for agents deployed through the gateway service

  * These automatically created identities are managed by the service and include the necessary settings for your deployment environment

  * The workload identity ARN is returned in the deployment response and can be used for IAM policies and access control


**Manual creation for custom deployments**

  * For agents not hosted by Runtime or Gateway (such as self-hosted or hybrid deployments), you can manually create workload identities

  * Use the [CreateWorkloadIdentity API](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateWorkloadIdentity.html>) or AWS CLI to create identities for custom agent deployments

  * Manual creation gives you control over the identity name and metadata

  * This approach is ideal when you need specific identity names or are integrating with existing identity management systems


**When to use each approach**

  * Use automatic creation when deploying through AgentCore Runtime or Gateway for simplified setup

  * Use manual creation when you need specific identity names or are deploying agents in non-standard environments

  * Manual creation is also useful for testing scenarios or when you need multiple identities for the same agent in different environments


Workload identities are used to obtain workload access tokens that authorize agent access to credentials. For details about how workload identities are used in the authentication flow, see [Get workload access token](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./get-workload-access-token.html>).

Once you have created workload identities, you can use them to control access to credential providers. For information about implementing fine-grained access control, see [Scope down access to credential providers by workload identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./scope-credential-provider-access.html>).

