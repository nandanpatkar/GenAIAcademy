# Manage workload identities with AgentCore Identity - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-manage-agent-ids.html

---

# Manage workload identities with AgentCore Identity

Agent identities in AgentCore Identity are implemented as workload identities with specialized attributes that enable agent-specific capabilities. This approach follows established industry patterns where workloads have granular properties that indicate their specific type and purpose. Unlike traditional service accounts that are tied to specific infrastructure, agent identities are designed to be environment-agnostic and can support multiple authentication credentials simultaneously. The AgentCore Identity directory acts as a centralized registry and management system for all agent identities. For information about workload identity limits, see [AgentCore Identity Service Quotas](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./bedrock-agentcore-limits.html#identity-service-limits>).

###### Topics

  * [Understanding workload identities](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./understanding-agent-identities.html>)

  * [Understanding the agent identity directory](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./agent-identity-directory.html>)

  * [Create and manage workload identities](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./creating-agent-identities.html>)



