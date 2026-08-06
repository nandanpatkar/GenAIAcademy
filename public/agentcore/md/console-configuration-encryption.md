# Configure KMS key for Token Vault on Console - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/console-configuration-encryption.html

---

# Configure KMS key for Token Vault on Console

The KMS key configuration determines how your token vault encrypts data at rest. You can choose between an AWS owned key or a customer managed key (stored in your account and managed through AWS KMS).

## To configure AWS KMS encryption for your token vault

  * Open the [AgentCore Identity](<https://console.aws.amazon.com/bedrock-agentcore/identity>) console.

  * In the **KMS key (Token vault)** section, choose **Edit**.

  * In the KMS key selection section, your token vault is encrypted by default with a key that AWS owns and manages for you at a token vault level. To choose a different key, customize your encryption settings:

    * **AWS owned key (default)** : Leave the checkbox unselected. The KMS key is owned and managed by AWS.

    * **Customer managed key** : Select the checkbox and provide the KMS key ARN. The key is stored in your account and is managed by AWS Key Management Service (AWS KMS).

  * Choose **Save changes** to update the KMS key configuration for your token vault.

  * To confirm the encryption type, check the **KMS key (Token vault)** details in the AgentCore Identity console.



