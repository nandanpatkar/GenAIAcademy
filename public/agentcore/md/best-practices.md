# Best practices - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/best-practices.html

---

# Best practices

We recommend these best practices for using AgentCore Memory effectively in your AI agent applications.

###### Topics

  * Encrypting your memory

  * Memory poisoning or prompt injection

  * Least-privilege principle


## Encrypting your memory

Your data stored in AgentCore Memory is always encrypted at rest using AWS KMS keys. By default, encryption uses an AWS-owned and managed KMS key. You can optionally configure a customer-managed KMS key from your own AWS account for additional control over encryption by specifying `encryptionKeyArn` when creating memory.

## Memory poisoning or prompt injection

When processing conversational data through the CreateEvent API and extracting long-term memory via LLM, it is important to protect against memory poisoning and prompt injection attacks that could compromise data integrity or system behavior. These security concerns are critical as they can lead to corrupted memory stores and manipulated system responses.

Following AWS's shared responsibility model, AWS is responsible for securing Amazon Bedrock Amazon Bedrock AgentCore infrastructure. However, customers bear the responsibility for secure application development, input validation, and preventing prompt injection vulnerabilities in the memory extraction service. This is similar to how AWS provides secure database engines like RDS, but customers must prevent SQL injection in their applications.

**Threats**

  * **Memory poisoning** represents a threat where attackers embed false information in conversations to corrupt long-term memory stores. This can manifest as context pollution, where misleading context influences future memory retrieval, or as deliberate data integrity attacks designed to degrade service quality over time.

  * **Prompt injection** attacks occur when users attempt to override system prompts during memory extraction or when malicious content in conversational data manipulates LLM behavior. These attacks can also involve privilege escalation attempts to access or modify memory beyond user permissions.


**Prevention techniques**

  * **Input validation** forms the foundation of protection at the `CreateEvent` API level. Sanitize the user input data with guardrails prior to persistence to memory

  * **Security testing** – Regularly test your applications for prompt injection and other security vulnerabilities using techniques like penetration testing, static code analysis, and dynamic application security testing (DAST).


## Least-privilege principle

Identity-based policies determine whether someone can create, access, or delete Amazon Bedrock Amazon Bedrock AgentCore resources in your account. These actions can incur costs for your AWS account. When you create or edit identity-based policies, follow these guidelines and recommendations:

  * **Get started with AWS managed policies and move toward least-privilege permissions** – To get started granting permissions to your users and workloads, use the AWS managed policies that grant permissions for many common use cases. They are available in your AWS account. We recommend that you reduce permissions further by defining AWS customer managed policies that are specific to your use cases.

  * **Apply least-privilege permissions** – When you set permissions with IAM policies, grant only the permissions required to perform a task. You do this by defining the actions that can be taken on specific resources under specific conditions, also known as least-privilege permissions.

  * **Use conditions in IAM policies to further restrict access** – You can add a condition to your policies to limit access to actions and resources. For example, you can write a policy condition to specify the service role can only be assumed by a particular AgentCore Memory resource.

  * **Use IAM Access Analyzer to validate your IAM policies to maintain secure and functional permissions** – [IAM Access Analyzer](<https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html>) validates new and existing policies so that the policies adhere to the IAM policy language (JSON) and IAM best practices. IAM Access Analyzer provides more than 100 policy checks and actionable recommendations to help you author secure and functional policies.



