# Encrypt your AgentCore policy engine with a customer-managed KMS key - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-encryption.html

---

# Encrypt your AgentCore policy engine with a customer-managed KMS key

Policy in AgentCore provides encryption by default to protect sensitive customer data at rest using AWS owned encryption keys. As an extra layer of protection, Policy in AgentCore allows you to encrypt your policy engines using AWS Key Management Service (AWS KMS) customer managed keys (CMK). This functionality ensures protection of sensitive data via encryption at rest, which helps you:

  * Reduce the operational burden on service’s end to protect sensitive data

  * Maintain control over who can see details of your authorization policies via your own AWS KMS customer managed keys

  * Build security-sensitive applications that meet strict encryption compliance and regulatory requirements


The following sections explain how to configure encryption for new policy engines and manage your encryption keys.

###### Note

Policy in AgentCore encryption at rest is available in all AWS Regions where Policy in AgentCore is available.

## AWS KMS key types for Policy in AgentCore

Policy in AgentCore integrates with AWS KMS to manage encryption keys used for encrypting and decrypting customer data. To learn more about key types and states, see [AWS Key Management Service concepts](<https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html>) in the AWS KMS Developer Guide. When you create a new policy engine, you can choose from the following AWS KMS key types to encrypt your data:

### AWS owned key

The default encryption type. Policy in AgentCore owns the key at no additional charge to you and encrypts resource data at rest upon creation. No additional configuration is required in your code or applications to encrypt or decrypt your data using the key owned by Policy in AgentCore. You don’t need to view, manage, use, or audit these keys. For more information, see [AWS owned keys](<https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#aws-owned-cmk>) in the AWS KMS Developer Guide.

### Customer managed key

You create, own, and manage the key in your AWS account. You have full control over the KMS key. AWS KMS charges apply for customer managed keys. For more information, see the [AWS KMS Pricing page](<https://aws.amazon.com/kms/pricing/>) . For more information about key types, see [Customer managed keys](<https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#customer-cmk>) in the AWS KMS Developer Guide.

When you specify a customer managed key for encryption of a policy engine, Policy in AgentCore encrypts the policy engine and all its child resources (policies, policy generations) with that key. To encrypt a policy engine using a customer managed key, you need to grant access to Policy in AgentCore in your key policy. A key policy is a resource-based policy that you attach to your customer managed key to control access to it. See Authorizing use of your AWS KMS key for Policy in AgentCore for more details.

In addition, to create an encrypted policy engine with a customer managed key, or to make API calls to a policy engine encrypted by a customer managed key, the IAM user or role which makes the call must also have access to the key. If Policy in AgentCore is unable to access the key, any authorization decisions that involve resources encrypted by that key will be denied. When you do not have access to the key, you will not be able to read, update, or delete resources encrypted by that key, and any create calls to utilize the key for encryption will fail.

###### Important

Once a customer managed key has been used to encrypt a policy engine, you CANNOT update the resource to use a different key for encryption or remove the key from that policy engine.

## Using AWS KMS and data keys with Policy in AgentCore

The Policy in AgentCore encryption at rest feature uses a KMS key and a hierarchy of data keys to protect your resource data.

###### Note

Policy in AgentCore supports only symmetric AWS KMS keys. You can’t use an asymmetric KMS key to encrypt your Policy in AgentCore resources.

Policy in AgentCore uses a grant-based model to access your customer managed key. When you create a policy engine with a customer managed key, Policy in AgentCore performs the following steps:

  1. Policy in AgentCore validates the key to ensure it is a symmetric encryption key with `ENCRYPT_DECRYPT` key usage and is in the `Enabled` state.

  2. Policy in AgentCore creates two AWS KMS grants on your behalf. To create these grants, Policy in AgentCore calls `kms:CreateGrant` using your identity through a [Forward Access Session (FAS)](<https://docs.aws.amazon.com/IAM/latest/UserGuide/access_forward_access_sessions.html>) . Because the `CreateGrant` call is made with your credentials via FAS, your AWS KMS key policy must grant `kms:CreateGrant` permission to your AWS account principal (not to a service principal). The grants themselves then allow Policy in AgentCore to perform cryptographic operations on your behalf without requiring further caller involvement.

  3. All policy data (policies, policy generations, and related resources under the policy engine) is encrypted using your customer managed key.


The two grants serve different purposes:

Policy management grant
    

Used for managing policy data. This grant allows encrypt, decrypt, and generate data key operations for creating, reading, updating, and deleting policies and related resources.

Policy evaluation grant
    

Used for runtime policy evaluation. This grant allows decrypt and re-encrypt operations so that the policy engine can evaluate Cedar policies against incoming authorization requests.

Both grants are constrained by encryption context using the key `aws:bedrock-agentcore-policy:policy-engine-arn` , which binds the grants to the specific policy engine resource.

When you delete a policy engine with a customer managed key, Policy in AgentCore automatically retires both grants.

###### Important

If you need to revoke grants manually, always revoke both the policy management grant and the policy evaluation grant. Revoking only one grant does not fully remove the service’s access to your key and may result in inconsistent behavior. You can view and manage grants for your key using the AWS KMS console or the `list-grants` AWS CLI command.

## Authorizing use of your AWS KMS key for Policy in AgentCore

To use a customer managed key with Policy in AgentCore, your AWS KMS key policy must grant permissions to your AWS account. When creating a policy engine, Policy in AgentCore calls `kms:CreateGrant` using your identity through a [Forward Access Session (FAS)](<https://docs.aws.amazon.com/IAM/latest/UserGuide/access_forward_access_sessions.html>) . As a result, the key policy must grant `kms:CreateGrant` and other required permissions to your account principal (not to a service principal) and uses the `kms:ViaService` condition to ensure the key is only used through Policy in AgentCore.

At a minimum, Policy in AgentCore requires the following permissions on a customer managed key:

  * `kms:CreateGrant` — Create grants for encrypt, decrypt, generate data key, re-encrypt, and describe key operations

  * `kms:Decrypt` — Decrypt data encrypted with the key

  * `kms:GenerateDataKey` — Generate data keys for encrypting policy data

  * `kms:DescribeKey` — Retrieve key metadata to validate key configuration


### Understanding source context

Source context provides information on the source caller attempting to make AWS KMS actions against a given key. This prevents confusion or misuse of encrypted data by binding context to the source of the data.

When Policy in AgentCore performs AWS KMS operations through grants on your behalf, the source context identifies the Policy in AgentCore resource that initiated the request. You can use source context as additional conditions on the grant-based operations in your key policy to restrict key usage to requests originating from specific accounts or resources.

###### Note

Source context conditions ( `aws:SourceAccount` and `aws:SourceArn` ) are available on grant-based AWS KMS operations but not on the `kms:CreateGrant` call, which uses a [Forward Access Session](<https://docs.aws.amazon.com/IAM/latest/UserGuide/access_forward_access_sessions.html>).

For example, you can add `aws:SourceAccount` and `aws:SourceArn` conditions to the KMS operations and validation statements in your key policy to ensure that these operations only succeed when the request originates from your account and for your policy engine resources:

```json
{
  "Sid": "Allow Policy for KMS operations with source context",
  "Effect": "Allow",
  "Principal": {
    "AWS": "arn:aws:iam::111122223333:root"
  },
  "Action": [
    "kms:Decrypt",
    "kms:GenerateDataKey"
  ],
  "Resource": "*",
  "Condition": {
    "StringEquals": {
      "kms:ViaService": "bedrock-agentcore.us-east-1.amazonaws.com",
      "aws:SourceAccount": "111122223333"
    },
    "StringLike": {
      "aws:SourceArn": "arn:aws:bedrock-agentcore:us-east-1:111122223333:policy-engine/*",
      "kms:EncryptionContext:aws:bedrock-agentcore-policy:policy-engine-arn": "arn:aws*:bedrock-agentcore:*:*:policy-engine/*"
    }
  }
}
```
This key policy allows Policy in AgentCore to make AWS KMS calls on your behalf through grants, if the source account is the same as the account that this KMS key lives in. These values should be verifiable when checking CloudTrail audit logs for the KMS key. For more information on global AWS condition keys, see [Using aws:SourceArn or aws:SourceAccount condition keys](<https://docs.aws.amazon.com/kms/latest/developerguide/least-privilege.html#key-policy-least-privilege>) in the AWS KMS Developer Guide.

### Understanding kms:ViaService

The `kms:ViaService` condition key limits use of a KMS key to requests from specified AWS services. This condition key applies for [Forward Access Sessions (FAS)](<https://docs.aws.amazon.com/IAM/latest/UserGuide/access_forward_access_sessions.html>) . For more information on `kms:ViaService` , see [kms:ViaService](<https://docs.aws.amazon.com/kms/latest/developerguide/policy-conditions.html#conditions-kms-via-service>) in the AWS KMS Developer Guide.

In the key policy, the `kms:ViaService` value follows the format `bedrock-agentcore.REGION.amazonaws.com` , where `REGION` is the AWS Region where your policy engine is created (for example, `bedrock-agentcore.us-east-1.amazonaws.com` ).

### Understanding encryption context

Encryption context is a set of key-value pairs that contain additional authenticated data for encryption integrity checks. When you include an encryption context in a request to encrypt data, AWS KMS cryptographically binds the encryption context to the encrypted data. To decrypt the data, you must pass the same encryption context. For more information, see [Encryption context](<https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#encrypt_context>) in the AWS KMS Developer Guide.

Policy in AgentCore uses the following encryption context in all AWS KMS cryptographic operations and can be verified within CloudTrail logs when Policy in AgentCore makes AWS KMS calls on your behalf for encryption and decryption processes:

```json
{
  "aws:bedrock-agentcore-policy:policy-engine-arn": "arn:aws:bedrock-agentcore:REGION:ACCOUNT_ID:policy-engine/POLICY_ENGINE_ID"
}
```
You can use this encryption context in your key policy conditions to restrict which policy engines can use the key. For example, the key policy in the following section uses a `kms:EncryptionContext` condition to allow the key to be used only for policy engine resources.

### Complete AWS KMS key policy

Based on the concepts in the previous sections, the following example key policy provides the necessary permissions to encrypt a policy engine and use an encrypted policy engine. The policy contains condition keys to conform to security best practices.

###### Important

Replace the following values in the key policy: * `111122223333` — Replace with your AWS account ID * `us-east-1` — Replace with your AWS Region

```json
{
"Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Allow Policy to create grants",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::111122223333:role/ExampleRole"
      },
      "Action": "kms:CreateGrant",
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "kms:ViaService": "bedrock-agentcore.us-east-1.amazonaws.com",
          "kms:GrantConstraintType": "EncryptionContextSubset"
        },
        "StringLike": {
          "kms:EncryptionContext:aws:bedrock-agentcore-policy:policy-engine-arn": "arn:aws*:bedrock-agentcore:*:*:policy-engine/*"
        },
        "ForAllValues:StringEquals": {
          "kms:GrantOperations": [
            "Encrypt",
            "Decrypt",
            "GenerateDataKey",
            "GenerateDataKeyWithoutPlaintext",
            "ReEncryptFrom",
            "ReEncryptTo"
          ]
        }
      }
    },
    {
      "Sid": "Allow Policy for KMS operations",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::111122223333:role/ExampleRole"
      },
      "Action": [
        "kms:Decrypt",
        "kms:GenerateDataKey"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "kms:ViaService": "bedrock-agentcore.us-east-1.amazonaws.com"
        },
        "StringLike": {
          "kms:EncryptionContext:aws:bedrock-agentcore-policy:policy-engine-arn": "arn:aws*:bedrock-agentcore:*:*:policy-engine/*"
        }
      }
    },
    {
      "Sid": "Allow Policy for KMS validation",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::111122223333:role/ExampleRole"
      },
      "Action": "kms:DescribeKey",
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "kms:ViaService": "bedrock-agentcore.us-east-1.amazonaws.com"
        }
      }
    }
  ]
}
```
The policy contains the following statements:

Allow Policy to create grants
    

Allows the caller to create AWS KMS grants when creating a policy engine. The `kms:GrantConstraintType` condition ensures that grants are constrained by encryption context. The `ForAllValues:StringEquals` condition on `kms:GrantOperations` restricts the grant to only the cryptographic operations that Policy in AgentCore requires.

Allow Policy for KMS operations
    

Allows the caller to perform decrypt and generate data key operations through Policy in AgentCore. The encryption context condition ensures these operations are scoped to policy engine resources.

Allow Policy for KMS validation
    

Allows the caller to describe the key through Policy in AgentCore. This permission is used during policy engine creation to validate that the key meets the requirements (symmetric, enabled, correct key usage).

###### Important

Exercise caution when modifying AWS KMS key policies for keys already in use by Policy in AgentCore. If you inadvertently remove necessary permissions from the key policy, Policy in AgentCore will no longer be able to decrypt policy data, and all authorization decisions will be denied. Any operations that require access to the encrypted data (such as creating, reading, updating, or deleting policies) will also fail.

## Prerequisites for encrypting your policy engine

Before encrypting your policy engine, ensure that you have fulfilled the following prerequisites:

  * You have access to a KMS key. For information about creating a KMS key, see [Create a KMS key](<https://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html>) in the AWS KMS Developer Guide.

  * The KMS key must be a **symmetric encryption key** with `ENCRYPT_DECRYPT` key usage.

  * The KMS key must be in the **Enabled** state.

  * The KMS key has a key policy attached that grants the required permissions. See Complete AWS KMS key policy for the required key policy.


For more information about controlling IAM permissions for a KMS key, see [KMS key access and permissions](<https://docs.aws.amazon.com/kms/latest/developerguide/control-access.html>) in the AWS KMS Developer Guide.

## Creating an encrypted policy engine

Before creating an encrypted policy engine, ensure that the customer managed key you are using has the proper key policy statements set for Policy in AgentCore to use the key for encryption and decryption. See Authorizing use of your AWS KMS key for Policy in AgentCore for the required permissions.

To encrypt your policy engine using the AWS CLI, include the `--encryption-key-arn` parameter when sending a `create-policy-engine` request:

```bash
aws bedrock-agentcore-control create-policy-engine \
  --name "MyPolicyEngine" \
  --description "Policy engine with customer-managed encryption" \
  --encryption-key-arn "arn:aws:kms:us-east-1:123456789012:key/1234abcd-12ab-34cd-56ef-1234567890ab"
```
The response includes the policy engine ARN and status:

```json
{
  "policyEngineId": "MyPolicyEngine-abc123",
  "name": "MyPolicyEngine",
  "description": "Policy engine with customer-managed encryption",
  "policyEngineArn": "arn:aws:bedrock-agentcore:us-east-1:123456789012:policy-engine/MyPolicyEngine-abc123",
  "status": "CREATING",
  "statusReasons": [],
  "encryptionKeyArn": "arn:aws:kms:us-east-1:123456789012:key/1234abcd-12ab-34cd-56ef-1234567890ab",
  "createdAt": "2026-02-24T12:00:00Z",
  "updatedAt": "2026-02-24T12:00:00Z"
}
```
###### Note

If the KMS key in use by your policy engine is deleted, disabled, or inaccessible due to an incorrect AWS KMS key policy, decryption of resources will fail. This can result in denied authorization decisions. The loss of access can be temporary (a key policy can be corrected) or permanent (a deleted key cannot be restored) depending on the circumstances. We recommend that you [restrict access](<https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys-adding-permission.html>) to critical operations such as deleting or disabling the KMS key. Also, we recommend that your organization set up [AWS break-glass access procedures](<https://docs.aws.amazon.com/wellarchitected/latest/devops-guidance/ag.sad.5-implement-break-glass-procedures.html>) to ensure your privileged users can access AWS in the unlikely event that Policy in AgentCore is inaccessible.

## Limitations

The following limitations apply to customer managed key encryption for policy engines:

  * You cannot disable encryption for a policy engine once enabled.

  * After you create a policy engine without encryption, you cannot update the policy engine to be encrypted by a customer managed key.

  * After you create a policy engine with a customer managed key, you cannot change the key or remove it from that policy engine. You must create a new policy engine to use a different key.

  * Customer managed key encryption is configured at the policy engine level. All resources under the policy engine, including policies and policy generations, are encrypted using the same customer managed key as the policy engine. You cannot specify different keys for individual resources within a policy engine.

  * After you revoke Policy in AgentCore’s access to a customer managed key for an existing encrypted policy engine, all authorization decisions will be denied because the policy engine can no longer decrypt policy data.


## Troubleshooting

This section describes common customer managed key related errors you might encounter when using Policy in AgentCore and provides troubleshooting steps to resolve them.

### Access denied: AWS KMS permission issue

**Error:** "Access denied for the specified KMS key. Verify the key policy grants the required permissions."

This could mean that the caller lacks the required kms:* action permissions in their IAM policy or AWS KMS key policy, or that the key being referenced does not exist or no longer exists.

**To resolve this issue:**

  1. Verify that the KMS key ARN is correct and the key exists in the specified Region.

  2. Verify that the AWS KMS key policy includes the required statements. See Complete AWS KMS key policy.

  3. Verify that the caller’s IAM policy includes the required AWS KMS permissions ( `kms:CreateGrant` , `kms:Decrypt` , `kms:GenerateDataKey` , `kms:DescribeKey` ).

  4. Check CloudTrail for `kms.amazonaws.com` events to identify which operation was denied and which principal attempted it.


### Validation exception: AWS KMS key configuration

**Error:** "The specified KMS key is not in a usable state. Verify the key is enabled and not pending deletion."

This means that the key being referenced cannot be used for customer managed key encryption due to its current configuration. Possible reasons include:

  * The key is disabled or pending deletion.

  * The key is not a symmetric encryption key.

  * The key does not have `ENCRYPT_DECRYPT` key usage.


**To resolve this issue:** Verify that the key meets the prerequisites described in Prerequisites for encrypting your policy engine.

