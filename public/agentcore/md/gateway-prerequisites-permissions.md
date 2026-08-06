# Set up permissions for AgentCore Gateway - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-prerequisites-permissions.html

---

# Set up permissions for AgentCore Gateway

To use Amazon Bedrock AgentCore Gateway and its capabilities, you’ll need to consider the following permissions:

  1. **Gateway builder/user permissions** – Permissions provided to a gateway builder or user to allow it to create, manage, and or use AgentCore gateways.

  2. **Gateway service role permissions** – Permissions provided to a service role that you’ll create for your gateway. These permissions allow the Amazon Bedrock AgentCore service to perform actions on behalf of the identity that invokes the gateway.

  3. **Resource-based permissions** – Permissions attached to resources to allow the gateway service role to access it. You’ll include the Amazon Resource Name (ARN) of the gateway service role as the `Principal` in the resource-based policy.

  4. **Gateway resource-based policies** – Policies attached directly to your gateway resources to control which principals can invoke them. For more information, see [Resource-based policies for Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./resource-based-policies.html>).


###### Note

If you prefer not to set up custom permissions, you can use the following options for easy setup: * Attach the [BedrockAgentCoreFullAccess](<https://docs.aws.amazon.com/aws-managed-policy/latest/reference/BedrockAgentCoreFullAccess.html>) to an IAM identity to allow it to create, manage, and invoke gateways. * Use the AWS Management Console or AgentCore CLI to create an AgentCore gateway service role with the proper permissions and gateway targets with the proper resource-based policies to allow the service role to access them.

Select a topic to learn more:

###### Topics

  * Gateway builder and user permissions

  * AgentCore Gateway service role permissions

  * Best practices for Gateway permissions


## Gateway builder and user permissions

For an identity to be able to create, manage, or use gateways, you need to attach an identity-based policy to the IAM identity to allow it to perform [Amazon Bedrock AgentCore-related actions](<https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonbedrockagentcore.html>) . For comprehensive permissions, you can use the [BedrockAgentCoreFullAccess](<https://docs.aws.amazon.com/aws-managed-policy/latest/reference/BedrockAgentCoreFullAccess.html>) managed policy.

For greater security and control, you can create your own custom policy by reducing the permissions in the full access policy. For example, the following policy allows an identity to perform actions related to AgentCore Gateway but not to other AgentCore services, such as AgentCore Runtime or AgentCore Browser:

```json
{
"Version":"2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock-agentcore:*Gateway*",
        "bedrock-agentcore:*WorkloadIdentity",
        "bedrock-agentcore:*CredentialProvider",
        "bedrock-agentcore:*Token*",
        "bedrock-agentcore:*Access*"
      ],
      "Resource": "arn:aws:bedrock-agentcore:*:*:*gateway*"
    }
  ]
}
```
The following custom policy is a more restrictive one that only allows read access to gateways and gateway targets
    

```json
{
"Version":"2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock-agentcore:ListGateways",
        "bedrock-agentcore:GetGateway",
        "bedrock-agentcore:ListGatewayTargets",
        "bedrock-agentcore:GetGatewayTarget"
      ],
      "Resource": "arn:aws:bedrock-agentcore:*:*:*gateway*"
    }
  ]
}
```
### Gateway access permissions (inbound authorization)

In addition to gateway-related permissions, you’ll also need to configure permissions for identities to be able to access the gateway during invocation. You’ll configure these permissions when you [set up inbound authorization](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-inbound-auth.html>).

## AgentCore Gateway service role permissions

When creating a gateway, you need a service role that has permissions to assume an IAM role and to access AWS resources and external services on the IAM role’s behalf. You can create the service role in the following ways:

  * If you create a gateway in the AWS Management Console or through the AgentCore CLI, you can choose to let AgentCore automatically create a service role for you with the necessary permissions. If you prefer this method, you can skip this prerequisite.

  * If you prefer to create your own service role for greater customization, you’ll need to configure the role with the permissions outlined in this topic. To learn how to create a service role and attach permissions to it, see [Create a role to delegate permissions to an AWS service](<https://docs.aws.amazon.com//IAM/latest/UserGuide/id_roles_create_for-service.html>).


The required permissions for a service role are in the following topics:

###### Topics

  * Trust permissions

  * Outbound authorization permissions

  * Permissions to access AWS resources


### Trust permissions

A service role must have a [trust policy](<https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html#term_trust_policy>) attached that allows the AgentCore service to assume an IAM identity and carry out actions on its behalf.

The following is an example of a trust policy that you can use.

```json
{
"Version":"2012-10-17",
  "Statement": [
    {
      "Sid": "GatewayAssumeRolePolicy",
      "Effect": "Allow",
      "Principal": {
        "Service": "bedrock-agentcore.amazonaws.com"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "aws:SourceAccount": "111122223333"
        },
        "ArnLike": {
          "aws:SourceArn": "arn:aws:bedrock-agentcore:us-east-1:111122223333:gateway/gateway-name-*"
        }
      }
    }
  ]
}
```
###### Note

Because you won’t know the gateway ARN before you create it, you can omit the `Condition` field when you first create the service role. After you create the gateway, add the `Condition` field back to the policy as a best security practice and do the following: * Replace the `aws:SourceAccount` condition key value with the ID of the account that the gateway belongs to. * Replace the `aws:SourceArn` condition key with the ARN of the gateway.

### Outbound authorization permissions

Depending on the type of outbound authorization you use for your gateway targets, you need to add permissions to the service role to allow it to invoke the target. These permissions allow the gateway service role to retrieve authorization credentials for invoking the target. You can do this in the process of [setting up outbound authorization](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-outbound-auth.html>).

### Permissions to access AWS resources

Depending on your gateway setup or the targets that you choose to add to the gateway, you might need to add permissions to the gateway service role to allow it to access AWS resources. The following topics cover some resources that your gateway service role might need access to:

If you attach a Lambda target to your gateway, you need to add permissions for the AgentCore Gateway service role to be able to invoke the function by doing the following:

  * Attach an identity-based policy to the AgentCore Gateway service role that allows the `lambda:InvokeFunction` action on the Lambda function resource.

  * (If the function is in a different account from the gateway service role) Attach a resource-based policy to the Lambda function that allows the gateway service role principal to perform the `lambda:InvokeFunction` action on the Lambda function resource.


Select a topic to learn how to set up the permissions:

###### Topics


===== Attach an identity-based policy to the gateway service role

To allow the gateway service role to access a Lambda target, attach the following identity-based policy to your AgentCore Gateway service role by choosing the topic at [Adding and removing IAM identity permissions](<https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage-attach-detach.html>) that pertains to your use case and following the steps..

```json
{
"Version": "2012-10-17",
    "Statement": [{
        "Sid": "AmazonBedrockAgentCoreGatewayLambdaProd",
        "Effect": "Allow",
        "Action": [
            "lambda:InvokeFunction"
        ],
        "Resource": [
            "arn:aws:lambda:us-east-1:123456789012:function:FunctionName"
        ]
    }]
}
```
Replace the ARN in the `Resource` field with the ARN of your Lambda function gateway target. If your gateway has multiple Lambda targets, you can add the ARN of each function to the `Resource` list.

===== (If function is in another account) Attach a resource-based policy to the Lambda function

If the Lambda function target is in a different account from the gateway service role, you need to attach a resource-based policy to allow the gateway service role to access it. The following is an example policy that you can use:

```json
{
"Version":"2012-10-17",
    "Statement": [
        {
            "Sid": "LambdaAllowGatewayServiceRoleMyFunction",
            "Effect": "Allow",
            "Principal": {
              "AWS": "arn:aws:iam::123456789012:role/MyGatewayExecutionRole"
            },
            "Action": "lambda:InvokeFunction",
            "Resource":  "arn:aws:lambda:us-east-1:123456789012:function:MyFunction"
        }
     ]
}
```
Replace the values of the following fields:

  * `AWS` – Use the ARN of your gateway service role.

  * `Resource` – Use the ARN of your Lambda function.

To learn how to attach a resource-based policy to the Lambda function that allows your gateway service role to access the function, select one of the following methods
    


Console
    

  1. ====== To attach a resource-based policy to your Lambda function in the AWS Management Console

  2. Follow the steps in the **Console** tab at [Viewing resource-based IAM policies in Lambda](<https://docs.aws.amazon.com/lambda/latest/dg/access-control-resource-based.html>).

  3. In the **Resource-based policy statements** section, choose **Add permissions**.

  4. Select **AWS account** and fill out the following fields:

     * **Statement ID** – A unique identifier for the statement providing permissions for the gateway service role to access the function.

     * **Principal** – Specify the ARN of your gateway service role.

     * **Action** – Select `lambda:InvokeFunction`.


CLI
    

  1. To attach a resource-based policy to your Lambda function using the AWS CLI, follow the steps at [Granting Lambda function access to AWS services](<https://docs.aws.amazon.com/lambda/latest/dg/permissions-function-services.html>) and specify your gateway service role as the `principal`.

You can run the following code in a terminal to add permissions for your gateway service role to access the function in `us-east-1` :

```bash
aws lambda add-permission \
  --function-name "MyFunction" \
  --statement-id "GatewayInvoke" \
  --action "lambda:InvokeFunction" \
  --principal "arn:aws:iam::123456789012:role/MyGatewayServiceRole"
  --region us-east-1
```
###### Example

If you plan to include a gateway target tool definition from an Amazon S3 URI, you’ll need to include permissions for the gateway service role to access the bucket. The [AmazonS3ReadOnlyAccess](<https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonS3ReadOnlyAccess.html>) policy is an example of a policy that you can attach to the service role. You can scope the `Resource` to the S3 location for greater security.

If you plan to add a Smithy target, you need to add permissions for the gateway service role to access AWS services that your Smithy models refer to. To determine which permissions need to be attached to the service role, refer to that service’s documentation.

You can add permissions to the service role by choosing the topic at [Adding and removing IAM identity permissions](<https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage-attach-detach.html>) that pertains to your use case and following the steps.

For example, if your Smithy model target accesses a DynamoDB table, you can attach the following policy to allow the service role to perform DynamoDB operations on the table:

```json
{
"Version":"2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/*"
    }
  ]
}
```
## Best practices for Gateway permissions

**Follow the principle of least privilege**
    

  * Grant only the permissions necessary for your Gateway to function

  * Use specific resource ARNs rather than wildcards when possible

  * Regularly review and audit permissions


**Separate roles by function**
    

  * Use different roles for management and execution

  * Create separate roles for different Gateways with different purposes


**Secure credential storage**
    

  * Store API keys and OAuth credentials in AWS Secrets Manager

  * Rotate credentials regularly


**Monitor and audit**
    

  * Enable CloudTrail logging for Gateway operations

  * Regularly review access patterns and permissions usage


**Use conditions in policies**
    

  * Add conditions to limit when and how permissions can be used

  * Consider using source IP restrictions for management operations



