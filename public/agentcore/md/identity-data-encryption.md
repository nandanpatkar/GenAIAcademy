# Data encryption - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-data-encryption.html

---

# Data encryption

Data encryption typically falls into two categories: encryption at rest and encryption in transit.

## Encryption at rest

Data within Amazon Bedrock AgentCore Identity is encrypted at rest in accordance with industry standards.

By default, Amazon Bedrock AgentCore Identity encrypts customer data in token vaults with AWS owned keys. You can also configure your token vaults to instead encrypt your information with customer managed keys.

**AWS owned key**
    

Amazon Bedrock AgentCore Identity encrypts the data in your token vault with an AWS owned KMS key. Keys of this type aren’t visible in AWS KMS.

**Customer managed key**
    

Amazon Bedrock AgentCore Identity encrypts the data in your token vault with a customer managed key. You own the administration of customer managed key policies, rotation, and scheduled deletion.

### Things to know about token vault encryption with customer managed keys

  * Data in your token vault (access tokens) are encrypted at rest with the customer managed key you configure. The token vault ARN is captured in the EncryptionContext.

  * All customer data in your token vault is encrypted at rest, even if you take no action to configure encryption settings.

  * You can’t configure token vault encryption at rest with [multi-Region keys](<https://docs.aws.amazon.com/kms/latest/developerguide/multi-region-keys-overview.html>) or [asymmetric keys](<https://docs.aws.amazon.com/kms/latest/developerguide/symmetric-asymmetric.html>) . Amazon Bedrock AgentCore Identity supports only single-region symmetric KMS keys for token vault encryption at rest.

  * You can configure token vault encryption only with a KMS key ARN, not an alias.

  * You can configure CMK for credential provider secrets using AWS Secrets Manager. [Learn more](<https://docs.aws.amazon.com/secretsmanager/latest/userguide/manage_update-encryption-key.html>).


The following procedures configure encryption at rest in your token vault. For more information about KMS key policies that delegate access to AWS services like Amazon Cognito, see [Permissions for AWS services in key policies](<https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-services.html>).

