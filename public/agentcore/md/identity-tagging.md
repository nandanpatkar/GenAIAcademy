# Tagging AgentCore Identity resources - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-tagging.html

---

# Tagging AgentCore Identity resources

Amazon Bedrock AgentCore Identity supports comprehensive tagging capabilities across its resource hierarchy to enable better resource management, cost allocation, access control, and operational visibility. For general information about tags, including syntax and usage, see [Tagging AgentCore resources](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./tagging.html>).

## Benefits of tagging AgentCore Identity resources

Tags help you accomplish the following key objectives with your AgentCore Identity resources:

### Identify and organize AWS resources

Many AWS services support tagging, allowing you to assign the same tag to resources from different services. This helps indicate which resources are related. You could assign the same tag to a workload identity that you assign to an DynamoDB table or Lambda function that uses those credentials.

**Example scenario** : Tag all resources for a customer service application with `Application=customer-service-bot` to easily identify and manage related resources across different AWS services, as shown in the following sample code.

```json
{
  "name": "customer-service-workload-identity",
  "tags": {
    "Application": "customer-service-bot",
    "Component": "authentication",
    "Owner": "customer-experience-team"
  }
}
```
### Track AWS costs

You can activate cost allocation tags on the AWS Billing and Cost Management dashboard. AWS uses these tags to categorize your costs and deliver a monthly cost allocation report. This enables you to:

  * Allocate identity service costs to specific projects or teams

  * Track spending patterns across different environments

  * Optimize costs based on usage analysis


**Example scenario** : Use `CostCenter=ai-platform` and `Project=bedrock-agents` tags to track how much your AI platform team spends on identity services for the Bedrock agents project, as shown in the following sample code.

```json
{
  "name": "customer-service-workload-identity",
  "tags": {
    "CostCenter": "ai-platform",
    "Project": "bedrock-agents",
    "Environment": "production",
    "Team": "customer-experience"
  }
}
```
### Control access based on tags

You can control access by specifying tag keys and values in the conditions for IAM policies. This enables attribute-based access control (ABAC) where permissions are granted based on resource tags.

**Example scenario** : Allow a user to access workload identities only if they have an `Owner` tag with a value matching the user’s team name, or restrict access to production credential providers based on `Environment=production` tags, as shown in the following sample code.

```json
{
"Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock-agentcore:GetWorkloadIdentity",
        "bedrock-agentcore:UpdateWorkloadIdentity"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "bedrock-agentcore:ResourceTag/Owner": "${aws:PrincipalTag/Team}"
        }
      }
    }
  ]
}
```
## Resource architecture

Amazon Bedrock AgentCore Identity manages five distinct resource types organized in a hierarchical structure:

### Primary resources

The following are the primary resources in the AgentCore Identity service hierarchy:

  * **Workload Identity Directory** : `arn:aws:bedrock-agentcore:${Region}:${Account}:workload-identity-directory/default`

  * **Token Vault** : `arn:aws:bedrock-agentcore:${Region}:${Account}:token-vault/default`


### Sub-resources

The following are the sub-resources that exist within the primary resource hierarchy:

  * **Workload Identity** : `arn:aws:bedrock-agentcore:${Region}:${Account}:workload-identity-directory/default/workload-identity/${workload identity name}`

  * **OAuth2 Credential Provider** : `arn:aws:bedrock-agentcore:${Region}:${Account}:token-vault/default/oauth2credentialprovider/${oauth2CredentialProviderName}`

  * **API Key Credential Provider** : `arn:${Partition}:bedrock-agentcore:${Region}:${Account}:token-vault/default/apikeycredentialprovider/${APIkeyCredentialproviderName}`


## Tagging support matrix

The following table shows the tagging capabilities for each AgentCore Identity resource type:

Resource Type | Tag on Create | Basic Tagging | TBAC Support  
---|---|---|---  
Workload Identity |  ✅ |  ✅ |  ✅  
OAuth2 Credential Provider |  ✅ |  ✅ |  ✅  
API Key Credential Provider |  ✅ |  ✅ |  ✅  
Workload Identity Directory |  ❌ |  ✅ |  ✅  
Token Vault |  ❌ |  ✅ |  ✅  
  
###### Note

TBAC (Tag-Based Access Control) support means you can use resource tags in IAM policy conditions to control access to these resources.

