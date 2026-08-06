# Configure Root Certificate Authority for Amazon Bedrock AgentCore Code Interpreter - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-root-ca-certificates.html

---

# Configure Root Certificate Authority for Amazon Bedrock AgentCore Code Interpreter

By default, Amazon Bedrock AgentCore Code Interpreter sessions trust only publicly recognized certificate authorities. If your agents need to access internal services or resources behind a TLS-intercepting proxy that use certificates signed by a private CA, you must provide your custom root CA certificates when starting a session.

Amazon Bedrock AgentCore retrieves the PEM-encoded certificate content from AWS Secrets Manager using your caller credentials, validates the X.509 format and expiry, and installs the certificates into the session’s OS trust store. This enables the code interpreter to establish trusted HTTPS connections to your internal resources.

## How it works

Root Certificate Authority for Amazon Bedrock AgentCore Code Interpreter works as follows:

  1. You provide a list of certificate locations, each pointing to a secret in AWS Secrets Manager that contains a PEM-encoded root CA certificate.

  2. Amazon Bedrock AgentCore uses your caller credentials to retrieve each certificate from AWS Secrets Manager.

  3. Each certificate is validated for correct X.509 PEM format and checked to ensure it has not expired and is not used before its validity start date.

  4. Valid certificates are deployed to the session’s OS trust store, making them available to code execution runtimes and any network clients within the sandbox.


Certificates configured at the tool level (through `CreateCodeInterpreter` ) are combined with any certificates provided at session start time. This allows you to set organization-wide certificates on the tool and add session-specific certificates as needed.

###### Note

Certificate configuration is a one-time operation per session. Once certificates are installed, they cannot be modified for the duration of that session.

## Prerequisites

Before configuring root CA certificates, ensure you have the following:

  * Completed the general [Prerequisites](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-interpreter-getting-started.html#code-interpreter-prerequisites>).

  * Your root CA certificates stored as secrets in AWS Secrets Manager. Each secret must contain valid PEM-encoded X.509 certificate

  * IAM permissions to read the certificate secrets from AWS Secrets Manager. Add the following permissions to your IAM policy:

```json
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "SecretsManagerCertificateAccess",
            "Effect": "Allow",
            "Action": [
                "secretsmanager:GetSecretValue"
            ],
            "Resource": "arn:aws:secretsmanager:<Region>:<account-id>:secret:<secret-name>"
        }
    ]
}
```
## Store your certificate in AWS Secrets Manager

Before you can use a root CA certificate with Amazon Bedrock AgentCore Code Interpreter, you must store it as a secret in AWS Secrets Manager. The secret value must be the PEM-encoded certificate content.

###### Example

AWS CLI
    

  1. 
```bash
aws secretsmanager create-secret \
  --name "my-corporate-root-ca" \
  --description "Corporate root CA certificate for AgentCore sessions" \
  --secret-string file://my-root-ca.pem \
  --region <region>
```
 


Boto3
    

  1. 
```python
import boto3

client = boto3.client('secretsmanager', region_name='<region>')

# Read the PEM certificate file
with open('my-root-ca.pem', 'r') as f:
    cert_content = f.read()

response = client.create_secret(
    Name='my-corporate-root-ca',
    Description='Corporate root CA certificate for AgentCore sessions',
    SecretString=cert_content
)

print(f"Secret ARN: {response['ARN']}")
```
 


Note the secret ARN from the output. You will use this ARN when starting sessions with certificate configuration.

###### Important

The secret must contain a valid PEM-encoded X.509 certificate. The certificate must not be expired and must be within its validity period. Amazon Bedrock AgentCore validates the certificate format and expiry before installing it.

## Start a code interpreter session with custom certificates

To start a code interpreter session that trusts your custom root CA certificates, include the `certificates` parameter in your `StartCodeInterpreterSession` request.

###### Example

AWS CLI
    

  1. 
```bash
aws bedrock-agentcore start-code-interpreter-session \
  --code-interpreter-identifier "aws.codeinterpreter.v1" \
  --name "ci-session-with-custom-ca" \
  --certificates '[
    {
      "location": {
        "secretsManager": {
          "secretArn": "arn:aws:secretsmanager:<region>:<account-id>:secret:<secret-name>"
        }
      }
    }
  ]'
```
 


Boto3
    

  1. 
```python
import boto3

client = boto3.client('bedrock-agentcore', region_name='<region>')

response = client.start_code_interpreter_session(
    codeInterpreterIdentifier="aws.codeinterpreter.v1",
    name="ci-session-with-custom-ca",
    certificates=[
        {
            "location": {
                "secretsManager": {
                    "secretArn": "arn:aws:secretsmanager:<region>:<account-id>:secret:<secret-name>"
                }
            }
        }
    ]
)

print(f"Session ID: {response['sessionId']}")
print(f"Status: {response['status']}")
```
 


API
    

  1. 
```json
{
  "name": "ci-session-with-custom-ca",
  "certificates": [
    {
      "location": {
        "secretsManager": {
          "secretArn": "arn:aws:secretsmanager:<region>:<account-id>:secret:<secret-name>"
        }
      }
    }
  ]
}
```
 


## Using multiple certificates

You can provide multiple root CA certificates in a single code interpreter session. This is useful when your environment requires trust for multiple internal certificate authorities, such as separate CAs for different internal services or environments.

###### Example

AWS CLI
    

  1. 
```bash
aws bedrock-agentcore start-code-interpreter-session \
  --code-interpreter-identifier "aws.codeinterpreter.v1" \
  --name "ci-session-with-multiple-cas" \
  --certificates '[
    {
      "location": {
        "secretsManager": {
          "secretArn": "arn:aws:secretsmanager:<region>:<account-id>:secret:corporate-root-ca"
        }
      }
    },
    {
      "location": {
        "secretsManager": {
          "secretArn": "arn:aws:secretsmanager:<region>:<account-id>:secret:proxy-ca"
        }
      }
    }
  ]'
```
 


Boto3
    

  1. 
```text
response = client.start_code_interpreter_session(
    codeInterpreterIdentifier="aws.codeinterpreter.v1",
    name="ci-session-with-multiple-cas",
    certificates=[
        {
            "location": {
                "secretsManager": {
                    "secretArn": "arn:aws:secretsmanager:<region>:<account-id>:secret:corporate-root-ca"
                }
            }
        },
        {
            "location": {
                "secretsManager": {
                    "secretArn": "arn:aws:secretsmanager:<region>:<account-id>:secret:proxy-ca"
                }
            }
        }
    ]
)
```
 


## Configure certificates at the tool level

You can configure certificates at the tool level when creating a custom code interpreter. Certificates configured at the tool level are automatically applied to every session started with that tool, in addition to any certificates provided at session start time.

This is useful for organization-wide certificates that should be trusted by all code interpreter sessions.

###### Example

Boto3
    

  1. 
```python
response = client.create_code_interpreter(
    name="corporate-code-interpreter",
    description="Code interpreter with corporate CA trust",
    certificates=[
        {
            "location": {
                "secretsManager": {
                    "secretArn": "arn:aws:secretsmanager:<region>:<account-id>:secret:corporate-root-ca"
                }
            }
        }
    ]
)

ci_id = response['codeInterpreterIdentifier']
print(f"Code Interpreter ID: {ci_id}")
```
 


When you start a session with a code interpreter that has certificates configured, the tool-level certificates are combined with any session-level certificates. Tool-level certificates are applied first, followed by session-level certificates.

## Certificate requirements and limits

Certificates must meet the following requirements:

Requirement | Details  
---|---  
Format |  PEM-encoded X.509 certificate  
Storage |  AWS Secrets Manager secret (as a string value, not binary)  
Validity |  Certificate must not be expired and must be within its validity period (between `notBefore` and `notAfter` dates)  
Maximum certificates per session |  10 per session and 10 per tool. A session can have up to 20 certificates in total.  
Secret ARN format |  `arn:aws:secretsmanager:region:account-id:secret:secret-name`  
Location type |  Only AWS Secrets Manager is supported as a certificate location  
  
## Troubleshooting

The following table describes common errors and their resolutions when configuring root CA certificates for Amazon Bedrock AgentCore Code Interpreter.

Error | Cause | Resolution  
---|---|---  
Certificate secret not found in Secrets Manager |  The secret ARN does not exist or the secret has been deleted. |  Verify the secret ARN is correct and the secret exists in the specified Region.  
Access denied to certificate secret in Secrets Manager |  The caller does not have `secretsmanager:GetSecretValue` permission on the secret. |  Add the `secretsmanager:GetSecretValue` permission to your IAM policy for the specified secret ARN.  
Certificate content is not valid PEM/X.509 format |  The secret value is not a valid PEM-encoded X.509 certificate. |  Ensure the secret contains a properly formatted PEM certificate starting with `-----BEGIN CERTIFICATE-----` and ending with `-----END CERTIFICATE-----`.  
Certificate has expired |  The certificate’s `notAfter` date is in the past. |  Replace the expired certificate with a valid one in AWS Secrets Manager and retry.  
Certificate is not yet valid |  The certificate’s `notBefore` date is in the future. |  Wait until the certificate’s validity period begins, or use a certificate that is currently valid.  
Number of certificates exceeds the maximum allowed |  More than 10 certificates were provided at the session level or tool level. |  Reduce the number of certificates to 10 or fewer per session and 10 or fewer per tool.  
Certificate location is required |  A certificate entry was provided without a location. |  Ensure each certificate in the array includes a `location` with a `secretsManager` entry containing a valid `secretArn`.  
Certificates configuration is not enabled |  The certificates feature is not enabled for your account. |  Contact AWS Support to enable the certificates feature for your account.

