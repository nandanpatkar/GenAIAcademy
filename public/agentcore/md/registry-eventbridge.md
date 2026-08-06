# Notifications (Amazon EventBridge) - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-eventbridge.html

---

# Notifications (Amazon EventBridge)

###### Upcoming namespace migration

AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry, you must update your endpoints, IAM policies, SDK clients, CLI scripts, and registry data. For more information about migrating from public preview, see [Comprehensive registry migration guide](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-faq.html>).

## Supported events

Events are sent to the default Amazon EventBridge bus. Source: `aws.bedrock-agentcore`.

Event | Detail type | Trigger  
---|---|---  
Record submitted for approval |  `Registry Record State changed to Pending Approval` |  SubmitRegistryRecordForApproval called  
Registry moves from Creating to Ready State |  `Registry State transitions from Creating to Ready` |  After Create Registry, once a Registry completes provisioning  
  
See [Notifications for pending approvals](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-notifications-approvals.html>) for full event schema and setup instructions.

