# Encrypt your Amazon Bedrock AgentCore Memory - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/storage-encryption.html

---

# Encrypt your Amazon Bedrock AgentCore Memory

When creating an AgentCore Memory, it is important to make sure your data is safe and secure. If your application handles sensitive information (such as customer details, payment data, or personal chats), you must use encryption to protect this data. Consider using a customer-managed KMS key (CMK) for encryption. The service still encrypts data using a service managed key, even if you don’t provide a CMK. Alternatively, you can also use an AWS-managed KMS key. In this case, you need to the add the following policy to the IAM user or role that you are using to setup memory.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAgentCoreMemoryKMS",
      "Effect": "Allow",
      "Action": [
        "kms:CreateGrant",
        "kms:Decrypt",
        "kms:DescribeKey",
        "kms:GenerateDataKey",
        "kms:GenerateDataKeyWithoutPlaintext",
        "kms:ReEncrypt*"
      ],
      "Resource": "arn:aws:kms:*:111122223333:key/*",
      "Condition": {
        "StringEquals": {
          "kms:ViaService": "bedrock-agentcore.us-east-1.amazonaws.com"
        }
      }
    }
  ]
}
```
Along with the security settings already explained above, you should be aware of prompt injection and memory poisoning risks when using long-term memory.

  * Prompt injection is an application-level security concern, similar to SQL injection in database applications. Just as AWS services like Amazon RDS and Amazon Aurora provide secure database engines, but customers are responsible for preventing SQL injection in their applications. Amazon Bedrock provides a secure foundation for natural language processing, but customers must take measures to prevent prompt injection vulnerabilities in their code. Additionally, AWS provides detailed documentation, best practices, and guidance on secure coding practices for Bedrock and other AWS services.

  * Memory poisoning happens when false or harmful information is saved in AgentCore Memory. Later, your AI agent may use this wrong information in future conversations, which can lead to incorrect or unsafe responses


As per the [AWS Shared Responsibility Model](<https://aws.amazon.com/compliance/shared-responsibility-model/>) , AWS is responsible for securing the underlying cloud infrastructure, including the hardware, software, networking, and facilities that run AWS services. However, the responsibility for secure application development and preventing vulnerabilities like prompt injection and memory poisoning lies with the customer.

To reduce risk, you can do the following:

  * **Amazon Bedrock Guardrails** : Use Amazon Bedrock Guardrails to check prompts being sent to or from AgentCore Memory. This ensures that only safe and allowed prompts are processed by your agent.

  * **Adversarial testing** : Actively test your AI application for vulnerabilities by simulating attacks or prompt injections. This helps you find weak points and fix them before real threats occur.



