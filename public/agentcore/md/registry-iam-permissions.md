# IAM Permissions - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-iam-permissions.html

---

# IAM Permissions

###### Upcoming namespace migration

AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry, you must update your endpoints, IAM policies, SDK clients, CLI scripts, and registry data. For more information about migrating from public preview, see [Comprehensive registry migration guide](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-faq.html>).

## Registry actions

For an identity to be able to create, manage, or use Registries, you need to attach an identity-based policy to the IAM identity to allow it to perform [Amazon Bedrock AgentCore-related actions](<https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonbedrockagentcore.html>) . For comprehensive permissions, you can use the [BedrockAgentCoreFullAccess](<https://docs.aws.amazon.com/aws-managed-policy/latest/reference/BedrockAgentCoreFullAccess.html>) managed policy.

For greater security and control, you can create your own custom policy by reducing the permissions in the full access policy.

## Registry control plane actions

Action | Description | Access level  
---|---|---  
`bedrock-agentcore:CreateRegistry` |  Grants permission to create a registry |  Write  
`bedrock-agentcore:GetRegistry` |  Grants permission to get a registry |  Read  
`bedrock-agentcore:UpdateRegistry` |  Grants permission to update a registry |  Write  
`bedrock-agentcore:DeleteRegistry` |  Grants permission to delete a registry |  Write  
`bedrock-agentcore:ListRegistries` |  Grants permission to list registries |  List  
  
## Registry record control plane actions

Action | Description | Access level  
---|---|---  
`bedrock-agentcore:CreateRegistryRecord` |  Grants permission to create a registry record |  Write  
`bedrock-agentcore:GetRegistryRecord` |  Grants permission to get a registry record |  Read  
`bedrock-agentcore:UpdateRegistryRecord` |  Grants permission to update a registry record |  Write  
`bedrock-agentcore:DeleteRegistryRecord` |  Grants permission to delete a registry record |  Write  
`bedrock-agentcore:ListRegistryRecords` |  Grants permission to list registry records |  List  
`bedrock-agentcore:SubmitRegistryRecordForApproval` |  Grants permission to submit a registry record for approval |  Write  
`bedrock-agentcore:UpdateRegistryRecordStatus` |  Grants permission to approve, reject, or deprecate a registry record |  Write  
  
## Registry data plane actions

Action | Description | Access level  
---|---|---  
`bedrock-agentcore:SearchRegistryRecords` |  Grants permission to search registry records |  Read  
`bedrock-agentcore:InvokeRegistryMcp` |  Grants permission to invoke the registry MCP endpoint |  Read  
  
###### Note

For Invoking the MCP Server, you will need both SearchRegistryRecords and InvokeRegistryMcp IAM Permissions.

## Registry resource types

The following resource types are defined for AWS Agent Registry:

Resource type | ARN format  
---|---  
Registry |  `arn:aws:bedrock-agentcore:{region}:{account}:registry/{registryId}`  
Registry record |  `arn:aws:bedrock-agentcore:{region}:{account}:registry/{registryId}/record/{recordId}`

