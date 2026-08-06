# Create a Payment Manager and Connector - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-create-manager.html

---

# Create a Payment Manager and Connector

A Payment Manager is the top-level resource that coordinates payment operations for your AWS account. When you create a Payment Manager, you specify an authorizer type and an IAM role, and the service provisions a corresponding workload identity in AgentCore Identity.

This guide walks you through creating a Payment Manager and attaching a Payment Connector using the AWS Management Console or the AWS SDK. For the complete request and response schemas, see [CreatePaymentManager](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreatePaymentManager.html>) and [CreatePaymentConnector](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreatePaymentConnector.html>) in the API Reference.

###### Tip

You can automate the steps on this page with the AgentCore Payments skill in the AWS agent toolkit. The skill is part of the **aws-agents** plugin and lets an AI coding agent create your Payment Manager, connector, credential provider, payment instrument, and session using the `agentcore` CLI, and add an x402 payment tool to your agent. For details, see the [quickstart](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-getting-started.html>) and the [AWS agent toolkit on GitHub](<https://github.com/aws/agent-toolkit-for-aws/tree/main>).

Before you begin, ensure you have:

  * Completed the [Prerequisites](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-prerequisites.html>) (account, credentials, provider keys).

  * Set up the required [IAM roles](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-iam-roles.html>) (administrator role and service role).


## Create a Payment Manager

###### Example

Console
    

**Step 1: Open the Payments page**

  1. Open the [Amazon Bedrock AgentCore console](<https://console.aws.amazon.com/bedrock-agentcore/>).

  2. In the navigation pane, under **Build** , choose **Payments**.

  3. In the **Payment Managers** section, choose **Create Payment Manager**.


**Step 2: Configure Payment Manager details**

  1. For **Name** , enter a name for your Payment Manager. The name must start with a letter. Valid characters are `a–z`, `A–Z`, `0–9`. The name can have up to 48 characters.

  2. (Optional) Choose **Description** to expand the section, and then enter a description to help identify this Payment Manager.


**Step 3: Configure permissions**

The **Permissions** section specifies the permissions for this Payment Manager and the AWS resources that the payment can access.

For **IAM Permissions** , choose one of the following options:

  * **Create and use a new service role** — Amazon Bedrock AgentCore payments creates a new service role on your behalf. A default service role name is generated automatically. For more information, see [Service role permissions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-iam-roles.html#payments-iam-service-role>).

  * **Use an existing service role** — Use a service role that you have already created. If you choose this option, select a role from the dropdown list.


**Step 4: Configure inbound authorization**

Inbound authorization controls who can access this Payment Manager. In the **Inbound Auth** section, for **Inbound Auth type** , choose one of the following options:

**To use IAM authorization:**

  1. Choose **Use IAM username**. This uses the IAM username that you used to sign in to the AWS console.


**To use JWT authorization with Amazon Cognito:**

  1. Choose **Use JSON Web Tokens (JWT)**.

  2. For **JWT schema configuration** , choose **Quick create configurations with Cognito - recommended**. Amazon Bedrock AgentCore payments creates the inbound authorization configurations on your behalf using Amazon Cognito as the identity provider. No additional configuration is required.


**To use JWT authorization with an existing identity provider:**

  1. Choose **Use JSON Web Tokens (JWT)**.

  2. For **JWT schema configuration** , choose **Use existing Identity provider configurations**. This option lets you bring existing inbound authorization configurations from any identity provider to enable OAuth 2.0.

  3. For **Discovery URL** , enter the discovery URL from your identity provider (for example, Okta or Cognito), typically found in that provider’s documentation. This allows your agent or tool to fetch login, downstream resource token, and verification settings. For example, `https://accounts.cognito.com/.well-known/openid-configuration`.

  4. For **Allowed audiences** , enter client IDs that are registered with identity providers or any arbitrary string in the JWT audience claim that the authorizer must verify. Choose **\+ Add audience** to add additional audiences.

  5. For **Allowed clients** , enter client IDs that are registered with identity providers or any arbitrary string in the JWT audience claim that the authorizer must verify. Choose **\+ Add client** to add additional clients.

  6. For **Allowed scopes** , enter the required scopes. Access is allowed only if the token contains at least one of the required scopes configured here. Choose **\+ Add scope** to add additional scopes.

  7. (Optional) For **Custom claims** , define rules that match specific claims in the incoming token against predefined values. For each rule, specify the claim **Name** , **String type** , **Operator** , and **Value**. Choose **\+ Add claim** to add additional claims.


**Step 5: Add a payment connector (optional)**

Payment connectors store the credentials and configuration needed to connect with payment service providers. Adding a connector during creation is optional, but a connector is required for the service to process payments.

  1. In the **Payment connector: New Connector** section, for **Name** , enter a name for the connector. Valid characters are `a–z`, `A–Z`, `0–9`, and `_` (underscore). The name can have up to 48 characters.

  2. (Optional) Choose **Description** to expand the section, and then enter a description for the connector.

  3. In the **Add Outbound Auth** section, if you want to reuse a payment credential provider previously created in [AgentCore Identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./resource-providers.html#payment-credential-provider>), select an existing outbound auth from the dropdown; or choose **create a new one** to create a new payment credential provider. If you choose to create a new one, see **Create a new outbound auth**.

  4. (Optional) To add additional connectors, choose **\+ Add connector** and repeat the steps above.


**Create a new outbound auth**

When you choose **create a new one** in the connector’s outbound auth section, a panel opens where you can configure a new payment credential provider.

  1. For **Name** , enter a name for the outbound auth. Valid characters are `a–z`, `A–Z`, `0–9`, `_` (underscore), and `-` (hyphen).

  2. For **Provider** , select a payment provider from the dropdown. The available providers are **Coinbase** and **Stripe (Privy)**.


If you choose **Coinbase** , complete the following fields under **Payment provider configurations** :

  1. For **API key ID** , enter the unique identifier for your Coinbase CDP account credentials.

  2. For **API key secret** , enter the private key used to authenticate and sign requests to Coinbase CDP.

  3. For **Wallet secret** , enter the asymmetric private key used to authenticate sensitive wallet write operations.


If you choose **Stripe (Privy)** , complete the following fields under **Payment provider configurations** :

  1. For **App ID** , enter the unique identifier for your Privy account credentials.

  2. For **App secret** , enter the private key used to authenticate and sign requests to the Privy application.

  3. For **Authorization ID** , enter the unique identifier for the authorization entity.

  4. For **Authorization private key** , enter the private key used to sign authorization requests.


After completing the provider configuration, choose **Add Outbound Auth**.

**Step 6: Create the Payment Manager**

  1. Review your configuration, and then choose **Create Payment Manager**.


After you choose **Create Payment Manager** , the console navigates to the Payment Manager details page. A success banner confirms that the Payment Manager was created and provides the following next steps:

  1. Set up payment instrument and session, optionally specify the budget.

  2. Integrate the Payment Manager into your agent framework.

  3. Discover paid MCP tools and endpoints.

  4. Enable log deliveries and traces to view metrics in the observability dashboard.


The Payment Manager details page includes sections for **Payment connectors** , **Integration code templates** , **Inbound Auth** , **Observability** metrics, and **Log deliveries and tracing** configuration.

AgentCore CLI
    

The AgentCore CLI creates the credential provider, Payment Manager, and Payment Connector together from your project directory. Requires CLI v0.19.0 or later.

**Interactive wizard:**

```bash
agentcore add payment-manager
```
The wizard prompts for manager name, pattern, auto-payment toggle, spend limit, and optionally walks through adding a connector with provider credentials.

**Non-interactive (Coinbase CDP):**

```bash
agentcore add payment-manager \
  --name MyPaymentManager \
  --auto-payment \
  --default-spend-limit 10.00

agentcore add payment-connector \
  --manager MyPaymentManager \
  --name CoinbaseConnector \
  --provider CoinbaseCDP \
  --api-key-id <YOUR_API_KEY_ID> \
  --api-key-secret <YOUR_API_KEY_SECRET> \
  --wallet-secret <YOUR_WALLET_SECRET>

agentcore deploy
```
**Non-interactive (Stripe/Privy):**

```bash
agentcore add payment-manager \
  --name MyPaymentManager \
  --auto-payment \
  --default-spend-limit 10.00

agentcore add payment-connector \
  --manager MyPaymentManager \
  --name StripePrivyConnector \
  --provider StripePrivy \
  --app-id <YOUR_APP_ID> \
  --app-secret <YOUR_APP_SECRET> \
  --authorization-id <YOUR_AUTHORIZATION_ID> \
  --authorization-private-key <YOUR_PRIVATE_KEY_BASE64>

agentcore deploy
```
Running `agentcore deploy` provisions IAM roles, stores credentials in AgentCore Identity, and creates the Payment Manager and Connector.

AgentCore SDK
    

The AgentCore SDK provides a convenience method `create_payment_manager_with_connector` that creates the Payment Manager, credential provider, and connector in a single call.

**Coinbase CDP with IAM authorization:**

```python
from bedrock_agentcore.payments import PaymentClient

payment_client = PaymentClient(region_name="us-east-1")

response = payment_client.create_payment_manager_with_connector(
    payment_manager_name="MyPaymentManager",
    payment_manager_description="Payment manager for my agent.",
    authorizer_type="AWS_IAM",
    role_arn="arn:aws:iam::123456789012:role/MyPaymentRole",
    payment_connector_config={
        "name": "CoinbaseConnector",
        "description": "Coinbase CDP connector",
        "payment_credential_provider_config": {
            "name": "MyCoinbaseProvider",
            "credential_provider_vendor": "CoinbaseCDP",
            "credentials": {
                "api_key_id": "your-api-key-id",
                "api_key_secret": "your-api-key-secret",
                "wallet_secret": "your-wallet-secret",
            },
        },
    },
    wait_for_ready=True,
    max_wait=300,
    poll_interval=5,
)

payment_manager = response.get("paymentManager", {})
payment_connector = response.get("paymentConnector", {})
credential_provider = response.get("credentialProvider", {})

payment_manager_arn = payment_manager.get("paymentManagerArn")
payment_connector_id = payment_connector.get("paymentConnectorId")

print(f"Payment Manager ARN: {payment_manager_arn}")
print(f"Connector ID: {payment_connector_id}")
```
**Coinbase CDP with JWT authorization:**

```python
from bedrock_agentcore.payments.client import PaymentClient

payment_client = PaymentClient(region_name="us-east-1")

response = payment_client.create_payment_manager_with_connector(
    payment_manager_name="CoinbasePaymentManagerJWT",
    payment_manager_description="Coinbase Payment Manager (JWT auth)",
    authorizer_type="CUSTOM_JWT",
    role_arn="arn:aws:iam::123456789012:role/BedrockAgentCoreFullAccess",
    payment_connector_config={
        "name": "coinbase-connector-jwt",
        "description": "Coinbase Connector (JWT)",
        "payment_credential_provider_config": {
            "name": "my-coinbase-provider-jwt",
            "credential_provider_vendor": "CoinbaseCDP",
            "credentials": {
                "api_key_id": "your-api-key-id",
                "api_key_secret": "your-api-key-secret",
                "wallet_secret": "your-wallet-secret",
            },
        },
    },
    wait_for_ready=True,
)

manager_arn = response["paymentManager"]["paymentManagerArn"]
connector_id = response["paymentConnector"]["paymentConnectorId"]
provider_arn = response["credentialProvider"]["credentialProviderArn"]
```
**Stripe (Privy) with IAM authorization:**

```python
from bedrock_agentcore.payments.client import PaymentClient

payment_client = PaymentClient(region_name="us-east-1")

response = payment_client.create_payment_manager_with_connector(
    payment_manager_name="StripePaymentManager",
    payment_manager_description="Stripe + Privy Payment Manager (IAM auth)",
    authorizer_type="AWS_IAM",
    role_arn="arn:aws:iam::123456789012:role/BedrockAgentCoreFullAccess",
    payment_connector_config={
        "name": "stripe-privy-connector",
        "description": "Stripe + Privy Connector",
        "payment_credential_provider_config": {
            "name": "my-stripe-privy-provider",
            "credential_provider_vendor": "StripePrivy",
            "credentials": {
                "app_id": "your-privy-app-id",
                "app_secret": "your-privy-app-secret",
                "authorization_private_key": "your-authorization-private-key",
                "authorization_id": "your-authorization-id",
            },
        },
    },
    wait_for_ready=True,
)

manager_arn = response["paymentManager"]["paymentManagerArn"]
connector_id = response["paymentConnector"]["paymentConnectorId"]
provider_arn = response["credentialProvider"]["credentialProviderArn"]
```
**Stripe (Privy) with JWT authorization:**

```python
from bedrock_agentcore.payments.client import PaymentClient

payment_client = PaymentClient(region_name="us-east-1")

response = payment_client.create_payment_manager_with_connector(
    payment_manager_name="StripePaymentManagerJWT",
    payment_manager_description="Stripe + Privy Payment Manager (JWT auth)",
    authorizer_type="CUSTOM_JWT",
    role_arn="arn:aws:iam::123456789012:role/BedrockAgentCoreFullAccess",
    payment_connector_config={
        "name": "stripe-privy-connector-jwt",
        "description": "Stripe + Privy Connector (JWT)",
        "payment_credential_provider_config": {
            "name": "my-stripe-privy-provider-jwt",
            "credential_provider_vendor": "StripePrivy",
            "credentials": {
                "app_id": "your-privy-app-id",
                "app_secret": "your-privy-app-secret",
                "authorization_private_key": "your-authorization-private-key",
                "authorization_id": "your-authorization-id",
            },
        },
    },
    wait_for_ready=True,
)

manager_arn = response["paymentManager"]["paymentManagerArn"]
connector_id = response["paymentConnector"]["paymentConnectorId"]
provider_arn = response["credentialProvider"]["credentialProviderArn"]
```
AWS CLI
    

Create a Payment Manager with IAM authorization:

```bash
aws bedrock-agentcore-control create-payment-manager \
  --name "MyPaymentManager" \
  --authorizer-type AWS_IAM \
  --role-arn "arn:aws:iam::123456789012:role/AgentCorePaymentsResourceRetrievalRole" \
  --region us-east-1
```
Create a Payment Manager with JWT authorization:

```bash
aws bedrock-agentcore-control create-payment-manager \
  --name "MyPaymentManager" \
  --authorizer-type CUSTOM_JWT \
  --role-arn "arn:aws:iam::123456789012:role/AgentCorePaymentsResourceRetrievalRole" \
  --custom-jwt-authorizer-configuration '{
    "discoveryUrl": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_EXAMPLE/.well-known/openid-configuration",
    "allowedAudience": ["your-client-id"],
    "allowedClients": ["your-client-id"]
  }' \
  --region us-east-1
```
The Payment Manager status starts as `CREATING` and transitions to `READY` when provisioning completes.

After the Payment Manager is ready, [create a payment credential provider](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/resource-providers.html#payment-credential-provider>):

The following example creates a payment credential provider for Coinbase CDP:

```bash
aws bedrock-agentcore-control create-payment-credential-provider \
  --name "coinbase-provider" \
  --credential-provider-vendor CoinbaseCDP \
  --provider-configuration-input '{
    "coinbaseCdpConfiguration": {
      "apiKeyId": "your-coinbase-api-key-id",
      "apiKeySecret": "your-coinbase-api-key-secret",
      "walletSecret": "your-coinbase-wallet-secret"
    }
  }' \
  --region us-east-1
```
The following example creates a payment credential provider for Stripe Privy:

```bash
aws bedrock-agentcore-control create-payment-credential-provider \
  --name "stripe-privy-provider" \
  --credential-provider-vendor StripePrivy \
  --provider-configuration-input '{
    "stripePrivyConfiguration": {
      "appId": "your-stripe-privy-app-id",
      "appSecret": "your-stripe-privy-app-secret",
      "authorizationPrivateKey": "your-stripe-privy-authorization-private-key",
      "authorizationId": "your-stripe-privy-authorization-id"
    }
  }' \
  --region us-east-1
```
After the credential provider is ready, create a connector:

```bash
aws bedrock-agentcore-control create-payment-connector \
  --payment-manager-id <paymentManagerId> \
  --name "CoinbaseConnector" \
  --type CoinbaseCDP \
  --credential-provider-configurations '[{
    "coinbaseCDP": {
      "credentialProviderArn": "arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/default/paymentcredentialprovider/my-cdp-provider"
    }
  }]' \
  --region us-east-1
```
AWS SDK
    

Create a Payment Manager with IAM authorization:

```python
import boto3

client = boto3.client("bedrock-agentcore-control", region_name="us-east-1")

# Create PaymentManager with IAM authorization
payment_manager = client.create_payment_manager(
    name="MyPaymentManager",
    authorizerType="AWS_IAM",
    roleArn="arn:aws:iam::123456789012:role/AgentCorePaymentsResourceRetrievalRole"
)

print(f"Payment Manager ID: {payment_manager['paymentManagerId']}")
```
Create a Payment Manager with JWT authorization:

```text
payment_manager = client.create_payment_manager(
    name="MyPaymentManager",
    authorizerType="CUSTOM_JWT",
    roleArn="arn:aws:iam::123456789012:role/AgentCorePaymentsResourceRetrievalRole",
    customJWTAuthorizerConfiguration={
        "discoveryUrl": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_EXAMPLE/.well-known/openid-configuration",
        "allowedAudience": ["your-client-id"],
        "allowedClients": ["your-client-id"],
        "allowedScopes": ["payments:write"],
        "customClaims": [
            {
                "claimName": "tenant_id",
                "claimValue": "your-unique-tenant-id",
                "operation": "EQUALS"
            }
        ]
    }
)
```
After the Payment Manager reaches `READY` status, create a payment credential provider:

The following example configures a provider for Coinbase CDP:

```python
import boto3

client = boto3.client("bedrock-agentcore-control", region_name="us-east-1")

coinbase_provider = client.create_payment_credential_provider(
    name="coinbase-provider",
    credentialProviderVendor="CoinbaseCDP",
    providerConfigurationInput={
        "coinbaseCdpConfiguration": {
            "apiKeyId": "your-coinbase-api-key-id",
            "apiKeySecret": "your-coinbase-api-key-secret",
            "walletSecret": "your-coinbase-wallet-secret"
        }
    }
)
```
The following example configures a provider for Stripe Privy:

```python
import boto3

client = boto3.client("bedrock-agentcore-control", region_name="us-east-1")

stripe_privy_provider = client.create_payment_credential_provider(
    name="stripe-privy-provider",
    credentialProviderVendor="StripePrivy",
    providerConfigurationInput={
        "stripePrivyConfiguration": {
            "appId": "your-stripe-privy-app-id",
            "appSecret": "your-stripe-privy-app-secret",
            "authorizationPrivateKey": "your-stripe-privy-authorization-private-key",
            "authorizationId": "your-stripe-privy-authorization-id"
        }
    }
)
```
After creating payment credential provider, create a connector:

```bash
# Create PaymentConnector for Coinbase CDP
payment_connector = client.create_payment_connector(
    paymentManagerId=payment_manager["paymentManagerId"],
    name="CoinbaseConnector",
    type="CoinbaseCDP",
    credentialProviderConfigurations=[
        {
            "coinbaseCDP": {
                "credentialProviderArn": "arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/default/paymentcredentialprovider/my-cdp-provider"
            }
        }
    ]
)

print(f"Connector ID: {payment_connector['paymentConnectorId']}")
```
For Stripe (Privy), use the `stripePrivy` configuration variant:

```bash
# Create PaymentConnector for Stripe (Privy)
payment_connector = client.create_payment_connector(
    paymentManagerId=payment_manager["paymentManagerId"],
    name="StripePrivyConnector",
    type="StripePrivy",
    credentialProviderConfigurations=[
        {
            "stripePrivy": {
                "credentialProviderArn": "arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/default/paymentcredentialprovider/my-privy-provider"
            }
        }
    ]
)
```
## Lifecycle states

After creation, the Payment Manager transitions through the following states:

State | Description  
---|---  
`CREATING` |  Initial state during provisioning.  
`READY` |  Payment Manager is operational and accepting connector configurations.  
`UPDATING` |  A configuration change is being applied.  
`CREATE_FAILED` |  Provisioning failure.  
`UPDATE_FAILED` |  Update operation failure.  
  
## Get a Payment Manager

###### Example

AgentCore CLI
     ```bash
     agentcore status
     ```
AgentCore SDK
     ```python
     from bedrock_agentcore.payments.client import PaymentClient

     payment_client = PaymentClient(region_name="us-east-1")
     response = payment_client.get_payment_manager(
         payment_manager_id="<paymentManagerId>"
     )
     print(f"Status: {response['status']}")
     ```
AWS CLI
     ```bash
     aws bedrock-agentcore-control get-payment-manager \
       --payment-manager-id <paymentManagerId> \
       --region us-east-1
     ```
AWS SDK
     ```python
     response = client.get_payment_manager(
         paymentManagerId="<paymentManagerId>"
     )
     print(f"Status: {response['status']}")
     ```
## List Payment Managers

###### Example

AgentCore CLI
     ```bash
     agentcore status
     ```
AgentCore SDK
     ```python
     from bedrock_agentcore.payments.client import PaymentClient

     payment_client = PaymentClient(region_name="us-east-1")
     response = payment_client.list_payment_managers()
     for pm in response['paymentManagers']:
         print(f"{pm['name']} - {pm['status']}")
     ```
AWS CLI
     ```bash
     aws bedrock-agentcore-control list-payment-managers \
       --region us-east-1
     ```
AWS SDK
     ```python
     response = client.list_payment_managers()
     for pm in response['paymentManagers']:
         print(f"{pm['name']} - {pm['status']}")
     ```
## Delete a Payment Manager

###### Example

AgentCore CLI
     ```bash
     agentcore remove payment-connector --manager MyPaymentManager --name CoinbaseConnector --yes
     agentcore remove payment-manager --name MyPaymentManager --yes
     agentcore deploy
     ```
The `remove` commands update local configuration. The follow-up `deploy` tears down the payment infrastructure in your account.

AgentCore SDK
     ```python
     from bedrock_agentcore.payments.client import PaymentClient

     payment_client = PaymentClient(region_name="us-east-1")
     payment_client.delete_payment_manager(
         payment_manager_id="<paymentManagerId>"
     )
     ```
AWS CLI
     ```bash
     aws bedrock-agentcore-control delete-payment-manager \
       --payment-manager-id <paymentManagerId> \
       --region us-east-1
     ```
AWS SDK
     ```text
     client.delete_payment_manager(
         paymentManagerId="<paymentManagerId>"
     )
     ```
## Next steps

After creating your Payment Manager, you can:

  1. **Set up payment instruments and sessions** — Configure payment instruments and sessions to start processing transactions. See [Create a payment instrument](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-create-instrument.html>).

  2. **Integrate with your agent framework** — Use the integration code templates to connect the Payment Manager to your agentic workflow. See [Processing payments](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-processing.html>).

  3. **Discover paid MCP tools and endpoints** — Connect to ready-to-use MCP servers with pay-per-use endpoints or bring your own merchant endpoints. See [Coinbase Bazaar via AgentCore Gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-connect-bazaar.html>).

  4. **Enable observability** — Configure log deliveries and tracing to monitor sessions, API invocations, transactions, and error rates. See [Observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-observability.html>).



