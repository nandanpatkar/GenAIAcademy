# Private Key JWT client authentication - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/private-key-jwt.html

---

# Private Key JWT client authentication

With Private Key JWT, AgentCore Identity authenticates to a downstream identity provider’s token endpoint using a signed JWT client assertion, per RFC 7523, Section 2.2, instead of a client secret. The private key never leaves AWS Key Management Service (KMS). AgentCore Identity signs each assertion via `kms:Sign`. Your identity provider possesses the corresponding public key used to authenticate the client assertion and returns an access token.

This method eliminates shared secrets between AgentCore Identity and your authorization server, replacing them with asymmetric key pairs under your full control.

## How Private Key JWT client authentication works

  * You configure a custom OAuth 2.0 credential provider with your `clientId`, the ARN of an asymmetric KMS signing key, and the same signing algorithm required by your identity provider for Private Key JWT client authentication.

  * When AgentCore Identity needs a token for machine-to-machine (M2M), on-behalf-of (OBO), or authorization code flows, it builds a short-lived JWT client assertion. The assertion contains the claims required by your identity provider.

  * AgentCore Identity then signs the assertion using AWS KMS, with the provided asymmetric signing key ARN.

  * The signed assertion is sent to the token endpoint as `client_assertion` with `client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer`.

  * The authorization server validates the assertion against the public key you registered and issues the requested token.


Private Key JWT is available on the custom OAuth 2.0 credential provider (`CustomOauth2`). It works for all grant flows: client credentials (M2M), token exchange with JWT authorization grant (OBO), and authorization code (user-delegated access).

## Configuring Private Key JWT in AgentCore Identity

To configure the credential provider successfully, first verify your identity provider’s requirements for Private Key JWT client authentication: signing algorithm, public keys, and required JWT client assertion claims.

### Signing Algorithm

Identify the signing algorithm that your identity provider requires for Private Key JWT client authentication. This corresponds to the `signingAlgorithm` field in `privateKeyJwtConfig` while creating or updating an OAuth 2.0 custom credential provider.

  * Specify the same algorithm as the signing algorithm when you create the credential provider in AgentCore Identity.

  * This signing algorithm will also be used to choose an acceptable KMS key spec, detailed below.


### AWS KMS Asymmetric Key Configuration

Determine how your identity provider manages signing keys:

  * If your identity provider accepts uploaded public keys, create an asymmetric KMS key pair with `SIGN_VERIFY` usage. Choose a key spec that supports your signing algorithm (see the following table). The key must be in the same Region as the credential provider. Specify the KMS key ARN while creating the credential provider on AgentCore Identity.

After creation, use the [kms:GetPublicKey API](<https://docs.aws.amazon.com/kms/latest/APIReference/API_GetPublicKey.html>) to generate the corresponding public key. `kms:GetPublicKey` returns a DER-encoded X.509 public key or SPKI. Some identity providers require these public keys in a specific format. For example, Microsoft Entra requires an X.509 certificate object, Okta requires a JSON Web Key, while Ping Identity supports both. Convert the public key to your identity provider’s required format and upload it to your identity provider.

  * If your identity provider creates the key pair and provides the private key material, import it into a KMS key with `SIGN_VERIFY` usage. Choose a key spec compatible with the signing algorithm (see the following table). For instructions, see [Importing key material for AWS KMS keys](<https://docs.aws.amazon.com/kms/latest/developerguide/importing-keys.html>). Specify the KMS key ARN while creating the credential provider on AgentCore Identity.


The `signingAlgorithm` you choose determines which KMS key specs are accepted:

Signing Algorithm | Accepted KMS Key Specs  
---|---  
`RS256` |  `RSA_2048`, `RSA_3072`, `RSA_4096`  
`PS256` |  `RSA_2048`, `RSA_3072`, `RSA_4096`  
`ES256` |  `ECC_NIST_P256`  
  
#### AWS KMS key policy

To use an asymmetric KMS signing key for Private Key JWT, your key must allow AgentCore Identity to perform signing and key-description operations on your behalf. Append the following permissions to the [key policy](<https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html>) of your KMS key.

The `kms:ViaService` condition ensures the key can only be used when the request originates through Amazon Bedrock AgentCore Identity. Cross-account keys are supported when the key policy grants `kms:DescribeKey` and `kms:Sign` to the calling identity. Replace the `Principal` ARN with the root ARN of the account that will call AgentCore Identity.

```json
{
  "Id": "identity-service-cmk-policy",
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "BedrockAgentCoreIdentityPrivateKeyJwtAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::111122223333:root"
      },
      "Action": [
        "kms:Sign",
        "kms:DescribeKey"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "aws:ResourceAccount": "${aws:PrincipalAccount}"
        },
        "StringLike": {
          "kms:ViaService": "bedrock-agentcore-identity.*.amazonaws.com"
        }
      }
    }
  ]
}
```
Cross-Region keys are not supported. The KMS key must be in the same AWS Region as the credential provider.

### Additional Claims in JWT Client Assertion

Check whether your identity provider requires additional claims in the JWT client assertion header or payload for Private Key JWT client authentication. If so, include them in the `additionalHeaderClaims` and `additionalPayloadClaims` fields within `privateKeyJwtConfig`.

  * For `additionalHeaderClaims`, we do not allow the claims `alg` or `typ`.

  * For `additionalPayloadClaims`, we do not allow the claims `iss`, `sub`, `jti`, `exp`, `iat`, or `nbf`. We will allow overrides to the `aud` claim (defaulted to the token endpoint of your identity provider).


### Configuring OAuth client with custom provider using Private Key JWT authentication

To configure a credential provider with Private Key JWT client authentication, on the AWS console, see [Add OAuth client using custom provider](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-add-oauth-client-custom.html>). You can also configure the credential provider using the AWS CLI.

#### CLI example: Private Key JWT for a Microsoft credential provider

```bash
aws bedrock-agentcore-control create-oauth2-credential-provider \
  --cli-input-json '{
    "name": "microsoft-private-key-jwt",
    "credentialProviderVendor": "CustomOauth2",
    "oauth2ProviderConfigInput": {
      "customOauth2ProviderConfig": {
        "oauthDiscovery": {
          "discoveryUrl": "https://login.microsoftonline.com/your-tenant-id/v2.0/.well-known/openid-configuration"
        },
        "clientId": "your-client-id",
        "clientAuthenticationMethod": "PRIVATE_KEY_JWT",
        "privateKeyJwtConfig": {
          "privateKeySource": {
            "kmsKeySource": {
              "kmsKeyArn": "arn:aws:kms:us-east-1:111122223333:key/your-key-id"
            }
          },
          "signingAlgorithm": "PS256",
          "additionalHeaderClaims": {
            "x5t#S256": "Base64url-encoded SHA-256 thumbprint of the DER encoding of the X.509 public key certificate uploaded to Microsoft Entra"
          },
          "additionalPayloadClaims": {
            "aud": "https://login.microsoftonline.com/your-tenant-id/oauth2/v2.0/token"
          }
        }
      }
    }
  }'
```
#### CLI example: Private Key JWT for an Okta credential provider with On-behalf-of Token Exchange

```bash
aws bedrock-agentcore-control create-oauth2-credential-provider \
  --cli-input-json '{
    "name": "okta-private-key-jwt",
    "credentialProviderVendor": "CustomOauth2",
    "oauth2ProviderConfigInput": {
      "customOauth2ProviderConfig": {
        "oauthDiscovery": {
          "discoveryUrl": "https://your-app.okta.com/oauth2/default/.well-known/openid-configuration"
        },
        "clientId": "your-client-id",
        "clientAuthenticationMethod": "PRIVATE_KEY_JWT",
        "privateKeyJwtConfig": {
          "privateKeySource": {
            "kmsKeySource": {
              "kmsKeyArn": "arn:aws:kms:us-east-1:111122223333:key/your-key-id"
            }
          },
          "signingAlgorithm": "RS256"
        },
        "onBehalfOfTokenExchangeConfig": {
          "grantType": "TOKEN_EXCHANGE",
          "tokenExchangeGrantTypeConfig": {
            "actorTokenContent": "NONE"
          }
        }
      }
    }
  }'
```
#### Parameters for OAuth client with custom provider using Private Key JWT authentication

Parameter | Required | Description  
---|---|---  
`clientAuthenticationMethod` |  Yes |  Set to `PRIVATE_KEY_JWT`.  
`clientId` |  Yes |  The client identifier registered at your identity provider.  
`privateKeyJwtConfig.privateKeySource.kmsKeySource.kmsKeyArn` |  Yes |  Full ARN of the asymmetric KMS signing key. Must be in the same Region as the credential provider. Cross-account supported.  
`privateKeyJwtConfig.signingAlgorithm` |  Yes |  Algorithm for signing the JWT. One of: `RS256`, `PS256`, `ES256`.  
`privateKeyJwtConfig.additionalHeaderClaims` |  No |  Additional JWT header claims (map, max 10 entries). Use this to pass a `kid` or `x5t#S256` that matches the key registered at your identity provider. Cannot override `alg` or `typ`.  
`privateKeyJwtConfig.additionalPayloadClaims` |  No |  Additional JWT payload claims (map, max 10 entries). Cannot override `iss`, `sub`, `jti`, `exp`, `iat`, or `nbf`. Use this to add provider-specific claims or to override `aud` (token endpoint by default).  
`clientSecret` |  Not required |  Omit when using Private Key JWT.

