# Tagging AgentCore resources - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/tagging.html

---

# Tagging AgentCore resources

A _tag_ is a label that you assign to an AWS resource. Each tag consists of a _key_ and an optional _value_ , both of which you define.

Tags enable you to categorize your AWS resources in different ways, for example, by purpose, owner, or environment. This is useful when you have many resources of the same type—you can quickly identify a specific resource based on the tags you’ve assigned to it.

## Tagging overview

Each tag consists of a key and an optional value. For example, you could define a set of tags for your account’s AgentCore resources that helps you track each resource’s owner and stack level.

We recommend that you devise a set of tag keys that meets your needs for each resource type. Using a consistent set of tag keys makes it easier for you to manage your resources. You can search and filter the resources based on the tags you add.

Tags don’t have any semantic meaning to AgentCore and are interpreted strictly as a string of characters. Also, tags are not automatically assigned to your resources. You can edit tag keys and values, and you can remove tags from a resource at any time. You can set the value of a tag to an empty string, but you can’t set the value of a tag to null. If you add a tag that has the same key as an existing tag on that resource, the new value overwrites the old value. If you delete a resource, any tags for the resource are also deleted.

## Resources that support tagging

The following AgentCore resources support tagging:

  * Agent runtime

  * Agent runtime endpoint

  * Code interpreter

  * Browser

  * Browser Profile

  * Gateway

  * Workload identity

  * OAuth2 credential provider

  * API key credential provider

  * Workload identity directory

  * Token vault

  * AgentCore Memory

  * Custom Evaluator

  * Online Evaluation Config

  * Policy Engine

  * Configuration Bundle

  * Batch Evaluation

  * Recommendation

  * AB Test


## Tag restrictions

The following basic restrictions apply to tags:

  * Maximum number of tags per resource – 50

  * For each resource, each tag key must be unique, and each tag key can have only one value.

  * Maximum key length – 128 Unicode characters in UTF-8

  * Maximum value length – 256 Unicode characters in UTF-8

  * If your tagging schema is used across multiple services and resources, remember that other services may have restrictions on allowed characters. Generally allowed characters are: letters, numbers, and spaces representable in UTF-8, and the following characters: + - = . _ : / @.

  * Tag keys are not case-sensitive, while tag values are case-sensitive.

  * Don’t use `aws:` , `AWS:` , or any upper or lowercase combination of such as a prefix for either keys or values as it is reserved for AWS use. You can’t edit or delete tag keys or values with this prefix. Tags with this prefix do not count against your tags per resource limit.


## Working with tags

You can add, edit, or delete tags for AgentCore resources using the console, API, or CLI.

### Adding tags

###### Example

Console
    

  1. You can add tags when you create the following AgentCore resources:

     * Agent runtime

     * Agent runtime endpoint

     * Code interpreter

     * Browser

     * Browser Profile

     * Gateway

     * Workload identity

     * OAuth2 credential provider

     * API key credential provider

     * Custom Evaluator

     * Online Evaluation Config

     * Policy Engine

     * Configuration Bundle

     * Batch Evaluation

     * Recommendation

     * AB Test

**To add tags when creating a resource**

  2. Open the AgentCore console.

  3. Navigate to the resource type you want to create.

  4. Follow the steps to create the resource. When you reach the **Tags** section, choose **Add tag**.

  5. Enter a tag key and optionally a tag value.

  6. To add more tags, choose **Add tag** again.

  7. Complete the resource creation process.

**To add tags to an existing resource**

  8. Open the AgentCore console.

  9. Navigate to the resource type and select the specific resource.

  10. Choose the **Tags** tab.

  11. Choose **Add tag** , then enter a key and optionally a value.

  12. Choose **Save changes**.


API
    

  1. You can add tags when you create resources or to existing resources using the AgentCore API.

**Adding tags when creating resources**

You can add tags when you create resources using the following API operations:

     * [CreateAgentRuntime](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateAgentRuntime.html>) – Include tags in the `tags` parameter.

     * [CreateAgentRuntimeEndpoint](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateAgentRuntimeEndpoint.html>) – Include tags in the `tags` parameter.

     * [CreateCodeInterpreter](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateCodeInterpreter.html>) – Include tags in the `tags` parameter.

     * [CreateBrowser](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateBrowser.html>) – Include tags in the `tags` parameter.

     * [CreateBrowserProfile](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateBrowserProfile.html>) – Include tags in the `tags` parameter.

     * [CreateGateway](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateGateway.html>) – Include tags in the `tags` parameter.

     * [CreateWorkloadIdentity](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateWorkloadIdentity.html>) – Include tags in the `tags` parameter.

     * [CreateOAuth2CredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateOAuth2CredentialProvider.html>) – Include tags in the `tags` parameter.

     * [CreateAPIKeyCredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateAPIKeyCredentialProvider.html>) – Include tags in the `tags` parameter.

     * [CreateEvaluator](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateEvaluator.html>) – Include tags in the `tags` parameter.

     * [CreateOnlineEvaluationConfig](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateOnlineEvaluationConfig.html>) – Include tags in the `tags` parameter.

     * [CreatePolicyEngine](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreatePolicyEngine.html>) – Include tags in the `tags` parameter.

     * [CreatePaymentCredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreatePaymentCredentialProvider.html>) \- Include tags in the `tags` parameter.

     * [CreatePaymentManager](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreatePaymentManager.html>) \- Include tags in the `tags` parameter.

     * [CreateConfigurationBundle](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateConfigurationBundle.html>) – Include tags in the `tags` parameter.

     * [StartBatchEvaluation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_StartBatchEvaluation.html>) – Include tags in the `tags` parameter.

     * [StartRecommendation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_StartRecommendation.html>) – Include tags in the `tags` parameter.

     * [CreateABTest](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_CreateABTest.html>) – Include tags in the `tags` parameter.

**Adding tags to existing resources**

Use the [TagResource](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_TagResource.html>) operation to add tags to existing resources.


CLI
    

  1. You can use the CLI to add tags to AgentCore resources.

**To add tags to a resource**

Use the `tag-resource` command:

```bash
aws bedrock-agentcore tag-resource \
    --resource-arn arn:aws:bedrock-agentcore:us-east-1:123456789012:agent-runtime/example-runtime \
    --tags Key=Environment,Value=Production Key=Team,Value=AI
```
### Managing tags

###### Example

Console
    

  1. You can edit tag values for existing resources in the console.

**To edit tags for an existing resource**

  2. Open the AgentCore console.

  3. Navigate to the resource type and select the specific resource.

  4. Choose the **Tags** tab.

  5. To edit a tag, modify the key or value directly.

  6. Choose **Save changes**.


API
    

  1. You can use the AgentCore API to list and manage tags for resources.

**Listing tags**

Use the [ListTagsForResource](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_ListTagsForResource.html>) operation to list the tags for a resource.

**Updating tags**

Use the [TagResource](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_TagResource.html>) operation to update existing tags by adding new values for existing keys.


CLI
    

  1. You can use the CLI to list and manage tags for AgentCore resources.

**To list tags for a resource**

Use the `list-tags-for-resource` command:

```bash
aws bedrock-agentcore list-tags-for-resource \
    --resource-arn arn:aws:bedrock-agentcore:us-east-1:123456789012:agent-runtime/example-runtime
```
**To update tags for a resource**

Use the `tag-resource` command to update existing tags:

```bash
aws bedrock-agentcore tag-resource \
    --resource-arn arn:aws:bedrock-agentcore:us-east-1:123456789012:agent-runtime/example-runtime \
    --tags Key=Environment,Value=Staging
```
### Deleting tags

###### Example

Console
    

  1. You can remove tags from resources in the console.

**To delete tags from a resource**

  2. Open the AgentCore console.

  3. Navigate to the resource type and select the specific resource.

  4. Choose the **Tags** tab.

  5. To delete a tag, choose **Remove** next to the tag.

  6. Choose **Save changes**.


API
    

  1. You can use the AgentCore API to remove tags from resources.

**Removing tags**

Use the [UntagResource](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_UntagResource.html>) operation to remove tags from a resource.


CLI
    

  1. You can use the CLI to remove tags from AgentCore resources.

**To remove tags from a resource**

Use the `untag-resource` command:

```bash
aws bedrock-agentcore untag-resource \
    --resource-arn arn:aws:bedrock-agentcore:us-east-1:123456789012:agent-runtime/example-runtime \
    --tag-keys Environment Team
```
