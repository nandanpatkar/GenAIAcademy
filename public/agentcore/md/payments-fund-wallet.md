# Fund the wallet and grant agent permissions - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-fund-wallet.html

---

# Fund the wallet and grant agent permissions

After you create a payment instrument, the end user must fund the wallet with USDC and grant the agent permission to sign transactions. Until both steps are complete, the process payment operation fails with a client-side exception.

###### Tip

You can automate the steps on this page with the AgentCore Payments skill in the AWS agent toolkit. The skill is part of the **aws-agents** plugin. With it, an AI coding agent can create your Payment Manager, connector, credential provider, payment instrument, and session using the `agentcore` CLI, and add an x402 payment tool to your agent. For details, see the [quickstart](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-getting-started.html>) and the [AWS agent toolkit on GitHub](<https://github.com/aws/agent-toolkit-for-aws/tree/main>).

## Coinbase CDP

When you create a payment instrument with the Coinbase CDP connector, the `CreatePaymentInstrument` API returns a `redirectUrl` pointing to the Coinbase WalletHub, a portal to grant agent permissions and fund the wallet. Direct the end user to this URL to fund their wallet and grant agent permissions from a single interface.

### Use the WalletHub URL

The `redirectUrl` from the `CreatePaymentInstrument` response opens the Coinbase WalletHub, where the end user can fund the wallet and grant signing permissions to the agent.

```python
instrument = dp_client.create_payment_instrument(
    userId="test-user-123",
    paymentManagerArn=PAYMENT_MANAGER_ARN,
    paymentConnectorId=PAYMENT_CONNECTOR_ID,
    paymentInstrumentType="EMBEDDED_CRYPTO_WALLET",
    paymentInstrumentDetails={
        "embeddedCryptoWallet": {
            "network": "ETHEREUM",
            "linkedAccounts": [{"email": {"emailAddress": "user@example.com"}}]
        }
    },
    clientToken=str(uuid.uuid4()),
)

# Direct the end user to this URL
wallet_hub_url = instrument["paymentInstrumentDetails"]["redirectUrl"]
print(f"Open the WalletHub: {wallet_hub_url}")
```
![Coinbase WalletHub for funding and granting permissions](/agentcore/images/grant-permission.png)

Alternatively, you can deploy the [Coinbase AgentCore template on GitHub](<https://github.com/coinbase/cdp-agentcore-template>) as a self-hosted Next.js frontend that provides the same funding and permissions functionality with a customizable UI. See (Alternative) Deploy the self-hosted frontend for setup instructions.

### Fund the wallet

From the WalletHub (or the self-hosted frontend), the end user can fund their wallet using any of the following methods:

Method | Description | Availability  
---|---|---  
**Coinbase Onramp (card/bank)** |  Purchase USDC directly using a credit card, debit card, Apple Pay, Google Pay, or ACH through Coinbase’s hosted purchase flow. |  Mainnet only  
**Receive (QR code)** |  Display a QR code and wallet address. The user scans the QR or copies the address to send funds from an external wallet or exchange. |  Mainnet and testnet  
**Transfer from external wallet** |  Connect a browser extension wallet (MetaMask, Phantom, Coinbase Wallet) and transfer USDC directly to the embedded wallet. |  Mainnet and testnet  
  
For testnet environments, fund the wallet with testnet USDC from the [Circle USDC faucet](<https://faucet.circle.com/>).

### Grant agent permissions

Agent permissions in Coinbase CDP use **wallet-scoped delegation** —each wallet receives its own independent, time-bound grant from the end user that authorizes the agent to sign transactions.

  1. The end user navigates to the **Permissions** section of the Coinbase frontend dashboard.

  2. The end user selects one or more wallets (EVM and/or Solana) to authorize.

  3. The end user chooses **Grant permission** and selects an expiry duration: **7 days** , **30 days** (default), **60 days** , or **90 days**.


Once granted, the agent can sign transactions on behalf of the end user’s wallets until the grant expires. The end user can revoke permissions at any time from the same dashboard. Once the grant is provided, proceed to [Create a payment session](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-create-session.html>).

#### Revoke permissions

The end user can revoke agent access to any wallet at any time from the permissions section of the WalletHub or frontend dashboard. After revocation, the agent can no longer sign transactions for that wallet until the user grants new permissions.

### (Alternative) Deploy the self-hosted frontend

If you need a customizable UI instead of the hosted WalletHub, deploy the [Coinbase AgentCore template](<https://github.com/coinbase/cdp-agentcore-template>) as a self-hosted Next.js application.

  1. Clone the repository:

```bash
git clone https://github.com/coinbase/cdp-agentcore-template.git
cd cdp-agentcore-template
```
  2. Create a `.env.local` file with your CDP credentials:

```text
NEXT_PUBLIC_CDP_PROJECT_ID=<YOUR_CDP_PROJECT_ID>
CDP_API_KEY_ID=<YOUR_CDP_API_KEY_ID>
CDP_API_KEY_SECRET=<YOUR_CDP_API_KEY_SECRET>
CDP_WALLET_SECRET=<YOUR_CDP_WALLET_SECRET>
NEXT_PUBLIC_NETWORK_MODE=testnet
```
  3. Install dependencies and start the application:

```bash
npm install
npm run dev
```
  4. In the [Coinbase Developer Portal](<https://portal.cdp.coinbase.com/>), add your application’s URL to the **Allowed Origins** list under **Wallets** > **Non-custodial Wallet** > **Security**.


The self-hosted frontend provides the same funding and permission-granting flows described above, with full control over styling and user experience.

## Stripe (Privy)

The [Privy AgentCore SDK on GitHub](<https://github.com/privy-io/aws-agentcore-sdk>) is a Next.js reference frontend that enables end users to authenticate, fund wallets, and grant agent permissions through a guided setup flow.

### Deploy the frontend

  1. Allowlist the localhost endpoint in the Privy dashboard under **App Settings** > **Basics** > **Domains**


![Privy dashboard showing the Domains field under App Settings where localhost is added to the allowed origins list](/agentcore/images/privy-allowlist.png)

  1. Clone the repository:

```bash
git clone https://github.com/privy-io/aws-agentcore-sdk.git
cd aws-agentcore-sdk
```
  2. Create a `.env.local` file with your Privy credentials:

```text
NEXT_PUBLIC_PRIVY_APP_ID=<YOUR_PRIVY_APP_ID>
PRIVY_APP_SECRET=<YOUR_PRIVY_APP_SECRET>
NEXT_PUBLIC_PRIVY_SIGNER_ID=<YOUR_PRIVY_AUTHORIZATION_ID>
NEXT_PUBLIC_NETWORK_MODE=testnet
```
The `NEXT_PUBLIC_PRIVY_SIGNER_ID` value is the Authorization ID (Key ID) from your Privy dashboard under **Wallet Infrastructure** > **Authorization**. This is a public identifier and is safe to expose client-side.

  3. Install dependencies and start the application:

```text
pnpm install
pnpm dev
```
### Fund the wallet

When the end user authenticates through the Privy frontend, embedded wallets are automatically created for both Base (EVM) and Solana networks. The end user can fund their wallet using any of the following methods:

Method | Description | Availability  
---|---|---  
**Pay with card (Stripe)** |  Purchase USDC using a credit or debit card through Stripe’s hosted crypto onramp at `crypto.link.com`. |  Mainnet only  
**Receive (QR code)** |  Display a QR code and wallet address using EIP-681 (EVM) or Solana Pay URI format. The user scans the QR or copies the address to send funds from an external wallet or exchange. |  Mainnet and testnet  
**Transfer from external wallet** |  Connect a browser extension wallet (MetaMask for Base, Phantom for Solana) and transfer USDC directly to the embedded wallet. |  Mainnet and testnet  
  
For testnet environments, fund the wallet with testnet USDC from the [Circle USDC faucet](<https://faucet.circle.com/>).

### Grant agent permissions

Agent permissions in Privy use **session signers** (also called authorization keys)—the end user registers the agent’s authorization key on each embedded wallet, granting the agent permission to sign transactions without per-transaction approval.

  1. In the Privy frontend, the end user logs in and automatic embedded wallets are created (one EVM, one Solana).

  2. The home screen displays a **Connect agent** setup card.

  3. The end user chooses **Connect agent** , and a modal displays: "Give your agent access to your wallets."

  4. The end user chooses **Give access**.


The frontend calls `addSessionSigners` from the Privy SDK to register the agent’s authorization key on each embedded wallet. The operation is idempotent—if the signer is already registered, no error is returned.

Once connected, the agent can sign transactions on behalf of the user’s wallets. The permissions persist until explicitly revoked.

#### (Optional) Verify agent connection

The frontend verifies that permissions are active by calling the Privy API:

```text
GET https://auth.privy.io/api/v1/wallets/{walletId}
Authorization: Basic <base64(appId:appSecret)>
```
The response includes an `additional_signers` array. If the configured Authorization ID appears in this array, the agent is connected.

Once the grant is provided, proceed to [Create a payment session](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-create-session.html>).

## Testing with testnet USDC

For development and testing, use testnet networks and fund wallets with test USDC:

  1. Set `NEXT_PUBLIC_NETWORK_MODE=testnet` in the frontend `.env.local` file.

  2. Obtain testnet USDC from the [Circle USDC faucet](<https://faucet.circle.com/>):

     * Select **Base Sepolia** for EVM wallets

     * Select **Solana Devnet** for Solana wallets

  3. Paste the embedded wallet address (shown in the frontend dashboard or QR code screen) into the faucet.

  4. The faucet dispenses test USDC to your wallet within seconds.


###### Note

The Stripe card onramp (Privy) and Coinbase Onramp are unavailable on testnet. Use the Circle faucet, external wallet transfer, or direct address transfer for testnet funding.

