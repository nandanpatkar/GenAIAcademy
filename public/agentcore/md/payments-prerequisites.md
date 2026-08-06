# Prerequisites for AgentCore payments - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-prerequisites.html

---

# Prerequisites for AgentCore payments

Complete the prerequisites on this page before you use AgentCore payments.

###### Tip

You can automate the steps on this page with the AgentCore Payments skill in the AWS agent toolkit. The skill is part of the **aws-agents** plugin and lets an AI coding agent create your Payment Manager, connector, credential provider, payment instrument, and session using the `agentcore` CLI, and add an x402 payment tool to your agent. For details, see the [quickstart](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-getting-started.html>) and the [AWS agent toolkit on GitHub](<https://github.com/aws/agent-toolkit-for-aws/tree/main>).

## AWS account and credentials

You need an AWS account with credentials configured. To configure credentials, install and use the AWS Command Line Interface by following the steps at [Getting started with the AWS CLI](<https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html>).

```bash
# Verify installation
aws --version  # Should show version 2.x
```
## Python and AWS SDK

To access your AWS credentials and configure them for use with SDKs, follow the steps at [Using IAM Identity Center to authenticate AWS SDK and Tools](<https://docs.aws.amazon.com/sdkref/latest/guide/access-sso.html>). If you plan to use the AWS Python SDK (Boto3) to interact with AgentCore payments programmatically:

  1. Install **Python 3.10+**.

  2. Install the AWS SDK: `pip install boto3`

  3. Verify your credentials are configured: `aws sts get-caller-identity`


For more information on how to set up and use the AWS SDK, see [AWS Builder Tools](<https://aws.amazon.com/developer/tools/>).

## Payment provider credentials

AgentCore payments connects to external payment providers for cryptocurrency wallet operations. You must obtain credentials from at least one supported provider before creating a PaymentConnector.

### Coinbase CDP credentials

If you plan to use Coinbase CDP as your payment provider for developer-managed wallets, obtain the following credentials from the [Coinbase Developer Platform](<https://docs.cdp.coinbase.com/api-reference/v2/authentication>). The [Coinbase AgentCore template on GitHub](<https://github.com/coinbase/cdp-agentcore-template>) provides a reference frontend for onramping funds and granting agent permissions.

  1. Create or log in to a Coinbase Developer Platform account and project.

  2. Generate an API key and Wallet secret (or reuse an existing one):

     1. Generate an **API Key** and note the following values:

Credential | Description  
---|---  
`API Key ID` |  The public identifier for your CDP project  
`API Key Secret` |  The private secret used to sign API requests to the CDP control plane  
  
![Coinbase CDP API key generation](/agentcore/images/coinbase-api-key.png)

     2. Under Project > Wallets > Non-custodial Wallet > Security, generate a **Wallet secret** and note the following value:

Credential | Description  
---|---  
`Wallet Secret` |  A specialized secret for cryptographic wallet operations such as deriving addresses and signing transactions  
  
![Coinbase CDP Wallet secret generation](/agentcore/images/coinbase-wallet-secret.png)

  3. Under **Project** > **Wallets** > **Non-custodial Wallet** > **Security** , enable **Delegated signing**.


![Coinbase dashboard for Delegation](/agentcore/images/coinbase-delegation.png)

### Privy credentials

If you plan to use Privy for user-owned embedded wallet flows, obtain the following credentials from the [Privy Dashboard](<https://docs.privy.io/authentication/overview#api-authentication>). The [Privy AgentCore SDK on GitHub](<https://github.com/privy-io/aws-agentcore-sdk>) provides a reference frontend for onramping funds and granting agent permissions.

  1. Create a **dedicated** Privy app for AgentCore operations at [dashboard.privy.io](<https://dashboard.privy.io/>). Do not reuse Privy apps that serve other purposes.

  2. Copy the **App ID** and **App Secret** from your app settings.

  3. In your Privy app, navigate to **Wallet Infrastructure** > **Authorization** and choose **New Key** to generate a P-256 key pair. Note the following values:

Credential | Description  
---|---  
`App ID` |  Your Privy application identifier, sent as the `privy-app-id` header on API calls  
`App Secret` |  Secret credential paired with the App ID, used for server-to-server Basic Auth  
`Authorization ID` (Signer ID) |  The public key identifier from the generated P-256 key pair  
`Authorization Private Key` |  The private key from the generated P-256 key pair, used for signing wallet operations.  
  


![Privy key dialog for AgentCore payments](/agentcore/images/privy-keys.png)

#### Security best practices for Privy credentials

**Create a dedicated Privy app for AgentCore**

Create a separate Privy app that is used exclusively for AgentCore payments. This reduces the scope of credentials and simplifies auditing of wallet operations.

**Restrict secret access to AgentCore services**

When you store your Privy `App Secret` in AgentCore Identity as a PaymentCredentialProvider, ensure that only the AgentCore payments service role can retrieve the secret. Do not grant access to the underlying secret in AWS Secrets Manager to any other IAM principals. The following resource policy on the secret restricts access to the AgentCore service role:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Deny",
            "Principal": "*",
            "Action": "secretsmanager:GetSecretValue",
            "Resource": "*",
            "Condition": {
                "StringNotEquals": {
                    "aws:PrincipalArn": "arn:aws:iam::111122223333:role/AgentCorePaymentsResourceRetrievalRole"
                }
            }
        }
    ]
}
```
###### Warning

If Privy secrets are accessible to principals beyond the AgentCore service role, a compromised IAM identity could retrieve the secrets and execute unauthorized wallet operations outside of AgentCore’s budget enforcement and audit controls.

**Rotate secrets regularly**

Rotate your Privy credentials on a regular schedule to reduce the window of exposure for any compromised secret.

Credential | Recommended rotation frequency  
---|---  
`App Secret` |  Every 90 days  
`Authorization Private Key` |  Every 90 days  
`App ID` |  Does not require rotation (public identifier)  
`Authorization ID` |  Rotates automatically when you generate a new key pair  
  
To rotate credentials:

  1. Generate a new key pair or App Secret in the Privy Dashboard.

  2. Update the PaymentCredentialProvider in AgentCore Identity with the new values.

  3. Verify that payment operations succeed with the new credentials.

  4. Revoke the old credentials in the Privy Dashboard.


###### Note

Plan for a brief overlap period where both old and new credentials are active. This prevents downtime during rotation.

After you obtain credentials from your provider, you store them in AgentCore Identity as a PaymentCredentialProvider. For instructions, see [Configure payment credential providers](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./resource-providers.html>). For the complete request and response schema, see [CreatePaymentCredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreatePaymentCredentialProvider.html>) in the API Reference.

## (Optional) Identity provider for JWT authorization

If you plan to use JWT authorization for inbound access to your Payment Manager (to enable consumers to access the Payment Manager using non-IAM identities), set up Amazon Cognito or your own identity provider before creating the Payment Manager:

  1. **Create a Cognito User Pool** (or use your existing identity provider).

  2. **Register an App Client** and note the Client ID.

  3. **Create a test user** with a username and password.


Alternatively, you can choose **Quick create configurations with Cognito** during Payment Manager creation, and AgentCore payments creates the authorization configurations on your behalf.

For detailed instructions, see [Configure inbound JWT authorizer](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./inbound-jwt-authorizer.html>).

