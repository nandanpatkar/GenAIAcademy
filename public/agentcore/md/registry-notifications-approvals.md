# Notifications for pending approvals - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-notifications-approvals.html

---

# Notifications for pending approvals

###### Upcoming namespace migration

AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry, you must update your endpoints, IAM policies, SDK clients, CLI scripts, and registry data. For more information about migrating from public preview, see [Comprehensive registry migration guide](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-faq.html>).

## Event details

  * **Source:** `aws.bedrock-agentcore`

  * **Detail type:** `Registry Record State changed to Pending Approval`

  * **Bus:** Default Amazon EventBridge bus

  * **Resources:** Full ARN of the registry record

  * **Detail:** Contains `registryRecordId` and `registryId`


## Example event

```json
{
 "version":"0",
 "detail-type":"Registry Record State changed to Pending Approval",
 "source":"aws.bedrock-agentcore",
 "account":"123456789012",
 "region":"us-west-2",
 "resources":["arn:aws:bedrock-agentcore:us-west-2:123456789012:registry/REG_ID/record/REC_ID"],
 "detail":{"registryRecordId":"REC_ID","registryId":"REG_ID"}
}
```
## Create an Amazon EventBridge rule

For more information on how to create Amazon EventBridge Rules, see [Creating Amazon EventBridge rules](<https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule-visual.html>) . AWS Agent Registry events can be found under the source: `aws.bedrock-agentcore` and detail-type: `Registry Record State changed to Pending Approval`.

You can configure the rule to any [Target](<https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-targets.html>) supported by Amazon EventBridge.

