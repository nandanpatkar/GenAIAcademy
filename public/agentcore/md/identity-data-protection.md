# Data protection in Amazon Bedrock AgentCore Identity - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-data-protection.html

---

# Data protection in Amazon Bedrock AgentCore Identity

The AWS [shared responsibility model](<https://aws.amazon.com/compliance/shared-responsibility-model/>) applies to data protection in Amazon Bedrock AgentCore Identity. As described in this model, AWS is responsible for protecting the global infrastructure that runs all of the AWS Cloud. You are responsible for maintaining control over your content that is hosted on this infrastructure. This content includes the security configuration and management tasks for the AWS services that you use. For more information about data privacy, see the [Data Privacy FAQ](<https://aws.amazon.com/compliance/data-privacy-faq>).

For data protection purposes, we recommend that you protect AWS account credentials and set up individual user accounts with IAM. That way each user is given only the permissions necessary to fulfill their job duties. We also recommend that you secure your data in the following ways:

  * Use multi-factor authentication (MFA) with each account.

  * Use SSL/TLS to communicate with AWS resources.

  * Set up API and user activity logging with AWS CloudTrail.

  * Use AWS encryption solutions, along with all default security controls within AWS services.

  * Use advanced managed security services such as Amazon Macie, which assists in discovering and securing personal data that is stored in Amazon S3.


We strongly recommend that you never put sensitive identifying information, such as your customers' account numbers, into free-form fields such as a **Name** field. This includes when you work with Amazon Bedrock AgentCore Identity or other AWS services using the console, API, AWS CLI, or AWS SDKs. Any data that you enter into Amazon Bedrock AgentCore Identity or other services might get picked up for inclusion in diagnostic logs. When you provide a URL to an external server, don’t include credentials information in the URL to validate your request to that server.

###### Topics

  * [Data encryption](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-data-encryption.html>)

  * [Set customer managed key policy](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./kms-key-policy-configuration.html>)

  * [Configure with API operations or an AWS SDK](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./api-configuration-encryption.html>)

  * [Configure KMS key for Token Vault on Console](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./console-configuration-encryption.html>)



