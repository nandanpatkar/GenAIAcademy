# Policy in Amazon Bedrock AgentCore: Control Agent Interactions - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy.html

---

# Policy in Amazon Bedrock AgentCore: Control Agent Interactions

Policy in Amazon Bedrock AgentCore enables developers to define and enforce security controls for AI agent interactions with tools by creating a protective boundary around agent operations. AI agents can dynamically adapt to solve complex problems - from processing customer inquiries to automating workflows across multiple tools and systems. However, this flexibility introduces new security challenges, as agents may inadvertently misinterpret business rules, or act outside their intended authority.

With Policy in AgentCore, developers can create policy engines, create and store deterministic policies in them and associate policy engines with gateways. Policy in AgentCore intercepts all agent traffic through Amazon Bedrock AgentCore Gateways and evaluates each request against defined policies in the policy engine before allowing tool access.

Policies are constructed using [Cedar language](<https://www.cedarpolicy.com/en>) , an open source language for writing and enforcing authorization policies. This allows developers to precisely specify what agents can access and what actions they can perform. Policy in AgentCore also provides the capability to author policies using natural language by allowing developers to describe rules in plain English instead of writing formal policy code in Cedar. Natural language-based policy authoring interprets what the user intends, generates candidate policies, validates them against the tool schema, and uses automated reasoning to check safety conditions such as identifying policies that are overly permissive, overly restrictive, or contain conditions that can never be satisfied - ensuring customers catch these issues before enforcing policies.

Policy in AgentCore supports fine-grained permissions based on user identity and tool input parameters, making it possible to safely deploy autonomous agents at enterprise scale. By moving security controls outside of agent code, developers can focus on building innovative agent capabilities while maintaining strong security guarantees - eliminating the need for custom security implementation and reducing the risk of policy bypass through agent manipulation.

###### Topics

  * Key benefits

  * Key features

  * [Getting started with Policy in AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./policy-getting-started.html>)

  * [Core concepts](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./policy-core-concepts.html>)

  * [AgentCore Gateway and Policy in AgentCore IAM Permissions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./policy-permissions.html>)

  * [Create a policy engine](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./policy-create-engine.html>)

  * [Create a policy](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./policy-create-policies.html>)

  * [Writing policies in natural language](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./policy-natural-language.html>)

  * [Validate and test policies](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./policy-validate-policies.html>)

  * [Use policies](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./policy-use-policies.html>)

  * [Example policies](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./example-policies.html>)

  * [Advanced features and topics for Policy in AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./policy-advanced.html>)


## Key benefits

Policy in AgentCore provides three key benefits that enable secure, scalable deployment of AI agents in enterprise environments:

**Fine-grained control over agent actions**
    

Define what actions an agent is allowed to perform - including which tools it can call and the precise conditions under which those actions are permitted.

**Deterministic enforcement with strong guarantees**
    

Every agent action through Amazon Bedrock AgentCore Gateway is intercepted and evaluated at the boundary outside of agent’s code - ensuring consistent, deterministic enforcement that remains reliable regardless of how the agent is implemented.

**Simple, accessible authoring with organization-wide consistency**
    

Write policies using natural language prompts or directly in Cedar (AWS's open-source policy language for fine-grained permissions), making it easy for builders with varying degree of expertise to define rules for their agents. Teams can set boundaries once and have them applied consistently across all agents and tools, with every enforcement decision logged through CloudWatch metrics and logs, so security and compliance teams can audit and validate behavior.

## Key features

Policy in AgentCore offers comprehensive capabilities for policy-based governance of agent interactions, including the following key features:

  * **Policy Enforcement** \- Intercepts and evaluates all agent requests against defined policies before allowing tool access

  * **Access Controls** \- Enables fine-grained based on user identity and tool input parameters

  * **Policy Authoring** \- Provides Cedar policy language support for writing clear, validated policies. Policies can also be authored in natural language using English prompts which are translated into Cedar policies and validated

  * **Policy Monitoring** \- Offers CloudWatch integration for monitoring policy evaluations and decisions

  * **Infrastructure Integration** \- Integrates with VPC security groups and other AWS security infrastructure

  * **Audit Logging** \- Maintains detailed logs of policy decisions for compliance and troubleshooting



