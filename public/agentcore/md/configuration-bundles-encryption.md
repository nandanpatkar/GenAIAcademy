# Configuration bundle encryption - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/configuration-bundles-encryption.html

---

# Configuration bundle encryption

When you specify a `kmsKeyArn` on a configuration bundle, the service encrypts the **component configurations** (system prompts, tool descriptions, and other configuration content) using envelope encryption. All other bundle metadata (name, description, version IDs, timestamps) remains encrypted with the AWS owned key.

## How it works

Configuration bundle encryption uses envelope encryption with caller credentials. When you create or update a bundle with a `kmsKeyArn`, the service uses your credentials (via [Forward Access Sessions](<https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#fas>)) to generate a data encryption key (DEK) from KMS. The service encrypts the component configurations locally using AES-GCM with that DEK, then stores the encrypted DEK alongside the bundle. When you retrieve the bundle, the service decrypts the DEK using your credentials and decrypts the components.

The caller must have `kms:GenerateDataKey`, `kms:Decrypt`, `kms:DescribeKey`, and `kms:ReEncrypt*` permissions on the key.

AgentCore optimizations supports only symmetric encryption KMS keys. The KMS key must be in the same AWS Region as the configuration bundle.

### Configuring permissions to use a customer managed KMS key

The following key policy provides the minimum permissions required for configuration bundle encryption. The policy has two statements:

  * **AllowCallerAccess** – Allows the IAM user or role to validate the key via `DescribeKey`.

  * **AllowCallerCryptoOps** – Allows the IAM user or role to generate data keys, decrypt, and re-encrypt (for key rotation), scoped by encryption context.


```json
{
"Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCallerAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::111122223333:role/MyConfigBundleRole"
      },
      "Action": "kms:DescribeKey",
      "Resource": "*"
    },
    {
      "Sid": "AllowCallerCryptoOps",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::111122223333:role/MyConfigBundleRole"
      },
      "Action": [
        "kms:GenerateDataKey",
        "kms:Decrypt",
        "kms:ReEncrypt*"
      ],
      "Resource": "*",
      "Condition": {
        "StringLike": {
          "kms:EncryptionContext:aws:bedrock-agentcore:configurationBundleArn": "arn:aws:bedrock-agentcore:us-east-1:111122223333:configuration-bundle/*"
        }
      }
    }
  ]
}
```
The policy contains the following statements:

  * **AllowCallerAccess** – Grants the IAM role `kms:DescribeKey` permission for key validation at bundle creation or update time. Replace `111122223333` with your account ID and `MyConfigBundleRole` with the IAM role or user that manages configuration bundles.

  * **AllowCallerCryptoOps** – Grants the IAM role `kms:GenerateDataKey`, `kms:Decrypt`, and `kms:ReEncrypt*` permissions, scoped by the `aws:bedrock-agentcore:configurationBundleArn` encryption context. The `kms:ReEncrypt*` permission is required for key rotation (changing the KMS key on an existing bundle). Replace `111122223333`, `MyConfigBundleRole`, and `us-east-1` with your values. To allow access to all configuration bundles in your account, use a wildcard with `StringLike`: `arn:aws:bedrock-agentcore:us-east-1:111122223333:configuration-bundle/*`.


### Scoping down access to the customer managed KMS key

You can use the encryption context to scope down access to the customer managed key. AgentCore optimizations includes the following encryption context in all KMS operations:

```json
{
  "aws:bedrock-agentcore:configurationBundleArn": "arn:aws:bedrock-agentcore:us-east-1:111122223333:configuration-bundle/bundle-id"
}
```
You can use this encryption context in key policy conditions to restrict KMS operations to specific configuration bundles, as shown in the `AllowCallerCryptoOps` statement in the example key policy above.

### Creating a configuration bundle with a customer managed KMS key

To encrypt a configuration bundle, specify the `kmsKeyArn` parameter when calling [CreateConfigurationBundle](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateConfigurationBundle.html>).

###### Example

AWS CLI
     ```bash
     aws bedrock-agentcore-control create-configuration-bundle \
       --bundle-name "MyEncryptedBundle" \
       --kms-key-arn "arn:aws:kms:us-east-1:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab" \
       --components '{
         "arn:aws:bedrock-agentcore:us-east-1:111122223333:runtime/my-agent": {
           "configuration": {
             "systemPrompt": "You are a helpful assistant.",
             "modelId": "anthropic.claude-3-sonnet"
           }
         }
       }'
     ```
Python (Boto3)
     ```python
     import boto3

     client = boto3.client('bedrock-agentcore-control')

     response = client.create_configuration_bundle(
         bundleName='MyEncryptedBundle',
         kmsKeyArn='arn:aws:kms:us-east-1:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab',
         components={
             'arn:aws:bedrock-agentcore:us-east-1:111122223333:runtime/my-agent': {
                 'configuration': {
                     'systemPrompt': 'You are a helpful assistant.',
                     'modelId': 'anthropic.claude-3-sonnet'
                 }
             }
         }
     )

     print(f"Bundle ID: {response['bundleId']}")
     ```
### Changing encryption configuration on an existing bundle

You can change the encryption configuration on an existing bundle using [UpdateConfigurationBundle](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_UpdateConfigurationBundle.html>):

  * **Add encryption** – Specify a `kmsKeyArn` on a bundle that was created without one. The service generates a new DEK and encrypts the component configurations.

  * **Rotate key** – Specify a different `kmsKeyArn`. The service re-wraps the existing DEK from the old key to the new key using `kms:ReEncrypt`. The caller must have permissions on both keys. If the old key is unavailable (disabled, deleted, or missing permissions), the update will fail.


###### Note

You cannot remove customer managed key encryption from a configuration bundle once it has been added.

## Monitoring KMS usage for configuration bundles

The following CloudTrail event names appear for configuration bundle KMS operations:

  * `GenerateDataKey` – When creating a bundle with a customer managed key, or adding encryption to an existing bundle. The `encryptionContext` field contains `aws:bedrock-agentcore:configurationBundleArn`.

  * `Decrypt` – When retrieving bundle content (GetConfigurationBundle, GetConfigurationBundleVersion) or when updating an encrypted bundle.

  * `ReEncrypt` – When rotating the KMS key on an existing bundle via UpdateConfigurationBundle.

  * `DescribeKey` – When validating the key at bundle creation or update time.


## Behavior when a key becomes unavailable

If you disable or delete the customer managed KMS key used by a configuration bundle:

  * **CreateConfigurationBundle** – Fails at validation with `ValidationException`.

  * **UpdateConfigurationBundle** – Fails because the service cannot decrypt the existing DEK to re-encrypt new components. Key rotation also fails because the old key is unavailable for re-wrapping.

  * **GetConfigurationBundle / GetConfigurationBundleVersion** – Fails because the service cannot decrypt the DEK or the component configurations.

  * **ListConfigurationBundles / ListConfigurationBundleVersions** – Succeeds because listing returns metadata only and does not require KMS operations.

  * **DeleteConfigurationBundle** – Succeeds because deletion does not require decrypting bundle data.


To restore access, re-enable the key or update the key policy to grant the required permissions.

