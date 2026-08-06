# Multi-Provider Setup: Coinbase + Stripe (Privy) on One Manager

## Overview

Tutorial 00 sets up a single wallet provider. This notebook shows the **multi-connector pattern** — one Payment Manager with both Coinbase CDP and Stripe (Privy) connectors. Different users (or the same user) can have wallets from different providers, all managed through the same payment stack.



```
Payment Manager (shared)
  ├── Coinbase CDP Connector
  │     └── Embedded Wallet (user A)
  ├── StripePrivy Connector
  │     └── Embedded Wallet (user B)
  └── Payment Session (budget — works with either wallet)
```

### Prerequisites

* Both Coinbase CDP and Privy credentials in your `.env`
* IAM roles: created automatically by Tutorial 00 (`setup_payment_roles()`)

> **Testnet only.** All code uses Base Sepolia or Solana Devnet with free USDC from [faucet.circle.com](https://faucet.circle.com/). Testnet USDC has no real-world value.

```python
%pip install -r requirements.txt --quiet
```

```python
import os
import uuid
import sys

sys.path.append("..")
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env", override=True)

import boto3
from utils import (
    assume_role,
    idempotent_create,
    wait_for_status,
    client_token,
    save_tutorial_config,
    print_summary,
    require_env,
)

AWS_REGION = os.environ.get("AWS_REGION", "us-west-2")
# os.environ['AWS_PROFILE'] = '<your-profile>'

CP_ENDPOINT = os.environ.get(
    "PAYMENTS_CP_ENDPOINT",
    f"https://bedrock-agentcore-control.{AWS_REGION}.amazonaws.com",
)
DP_ENDPOINT = os.environ.get("PAYMENTS_DP_ENDPOINT", f"https://bedrock-agentcore.{AWS_REGION}.amazonaws.com")
CRED_ENDPOINT = os.environ.get("CREDENTIAL_PROVIDER_ENDPOINT", CP_ENDPOINT)
NETWORK = os.environ.get("NETWORK", "ETHEREUM")

CP_ROLE_ARN = os.environ["CONTROL_PLANE_ROLE_ARN"]
MGMT_ROLE_ARN = os.environ["MANAGEMENT_ROLE_ARN"]
RR_ROLE_ARN = os.environ["RESOURCE_RETRIEVAL_ROLE_ARN"]
USER_ID = os.environ.get("USER_ID", "test-user-001")
LINKED_EMAIL = os.environ.get("LINKED_EMAIL", "")

session = boto3.Session(region_name=AWS_REGION)


# --- Print prerequisite values ---
def _check(label, value, redact=False):
    ok = bool(value) and not value.startswith("<")
    icon = "✅" if ok else "❌ MISSING"
    display = "[redacted]" if redact and value else value
    print(f"  {icon}  {label}: {display}")


print("Prerequisites (from .env / Tutorial 00):\n")
print("  AWS:")
_check("AWS_REGION", AWS_REGION)
_check("CP_ENDPOINT", CP_ENDPOINT)
_check("DP_ENDPOINT", DP_ENDPOINT)

print("\n  IAM Roles:")
_check("CONTROL_PLANE_ROLE_ARN", CP_ROLE_ARN)
_check("MANAGEMENT_ROLE_ARN", MGMT_ROLE_ARN)
_check("RESOURCE_RETRIEVAL_ROLE_ARN", RR_ROLE_ARN)

print("\n  Identity:")
_check("USER_ID", USER_ID)
_check("LINKED_EMAIL", LINKED_EMAIL)
_check("NETWORK", NETWORK)

print("\n  Coinbase CDP Credentials:")
_check("COINBASE_API_KEY_ID", os.environ.get("COINBASE_API_KEY_ID", ""))
_check(
    "COINBASE_API_KEY_SECRET",
    os.environ.get("COINBASE_API_KEY_SECRET", ""),
    redact=True,
)
_check("COINBASE_WALLET_SECRET", os.environ.get("COINBASE_WALLET_SECRET", ""), redact=True)

print("\n  Stripe (Privy) Credentials:")
_check("PRIVY_APP_ID", os.environ.get("PRIVY_APP_ID", ""))
_check("PRIVY_APP_SECRET", os.environ.get("PRIVY_APP_SECRET", ""), redact=True)
_check("PRIVY_AUTHORIZATION_ID", os.environ.get("PRIVY_AUTHORIZATION_ID", ""))
_check(
    "PRIVY_AUTHORIZATION_PRIVATE_KEY",
    os.environ.get("PRIVY_AUTHORIZATION_PRIVATE_KEY", ""),
    redact=True,
)
```

## Step 1 — Create One Shared Payment Manager

> **Cost notice:** Payment Managers, Connectors, and Instruments incur AWS charges while provisioned. Run cleanup when finished.

```python
cp_session = assume_role(session, CP_ROLE_ARN, "multi-provider-cp")
cp_client = cp_session.client("bedrock-agentcore-control", endpoint_url=CP_ENDPOINT)
cred_client = cp_session.client("bedrock-agentcore-control", endpoint_url=CRED_ENDPOINT)

suffix = uuid.uuid4().hex[:8]
MANAGER_NAME = f"MultiProviderMgr{suffix}"

resp = idempotent_create(
    cp_client.create_payment_manager,
    f"Manager '{MANAGER_NAME}' already exists",
    name=MANAGER_NAME,
    authorizerType="AWS_IAM",
    roleArn=RR_ROLE_ARN,
    clientToken=client_token(),
)
MANAGER_ID = resp["paymentManagerId"]
MANAGER_ARN = resp["paymentManagerArn"]
print(f"✅ Manager: {MANAGER_ID}")

wait_for_status(cp_client.get_payment_manager, "READY", paymentManagerId=MANAGER_ID)
```

## Step 2 — Attach Coinbase CDP Connector

```python
# Coinbase credential provider
cb_cred = cred_client.create_payment_credential_provider(
    name=f"CoinbaseCdp{suffix}",
    credentialProviderVendor="CoinbaseCDP",
    providerConfigurationInput={
        "coinbaseCdpConfiguration": {
            "apiKeyId": require_env("COINBASE_API_KEY_ID"),
            "apiKeySecret": require_env("COINBASE_API_KEY_SECRET"),
            "walletSecret": require_env("COINBASE_WALLET_SECRET"),
        }
    },
)
CB_CRED_ARN = cb_cred["credentialProviderArn"]

# Coinbase connector
cb_conn = cp_client.create_payment_connector(
    paymentManagerId=MANAGER_ID,
    name=f"CoinbaseConn{suffix}",
    type="CoinbaseCDP",
    credentialProviderConfigurations=[{"coinbaseCDP": {"credentialProviderArn": CB_CRED_ARN}}],
    clientToken=client_token(),
)
CB_CONNECTOR_ID = cb_conn["paymentConnectorId"]
print(f"✅ Coinbase connector: {CB_CONNECTOR_ID}")
wait_for_status(
    cp_client.get_payment_connector,
    "READY",
    paymentManagerId=MANAGER_ID,
    paymentConnectorId=CB_CONNECTOR_ID,
)
```

## Step 3 — Attach StripePrivy Connector

```python
# StripePrivy credential provider
sp_cred = cred_client.create_payment_credential_provider(
    name=f"StripePrivy{suffix}",
    credentialProviderVendor="StripePrivy",
    providerConfigurationInput={
        "stripePrivyConfiguration": {
            "appId": require_env("PRIVY_APP_ID"),
            "appSecret": require_env("PRIVY_APP_SECRET"),
            "authorizationId": require_env("PRIVY_AUTHORIZATION_ID"),
            "authorizationPrivateKey": require_env("PRIVY_AUTHORIZATION_PRIVATE_KEY"),
        }
    },
)
SP_CRED_ARN = sp_cred["credentialProviderArn"]

# StripePrivy connector
sp_conn = cp_client.create_payment_connector(
    paymentManagerId=MANAGER_ID,
    name=f"StripePrivyConn{suffix}",
    type="StripePrivy",
    credentialProviderConfigurations=[{"stripePrivy": {"credentialProviderArn": SP_CRED_ARN}}],
    clientToken=client_token(),
)
SP_CONNECTOR_ID = sp_conn["paymentConnectorId"]
print(f"✅ StripePrivy connector: {SP_CONNECTOR_ID}")
wait_for_status(
    cp_client.get_payment_connector,
    "READY",
    paymentManagerId=MANAGER_ID,
    paymentConnectorId=SP_CONNECTOR_ID,
)
```

## Step 4 — Create Instruments for Both Providers

Same manager, different connectors → different wallet providers. Both use `EMBEDDED_CRYPTO_WALLET`.

```python
mgmt_session = assume_role(session, MGMT_ROLE_ARN, "multi-provider-mgmt")
dp_client = mgmt_session.client("bedrock-agentcore", endpoint_url=DP_ENDPOINT)

LINKED_EMAIL = os.environ.get("LINKED_EMAIL", "")
assert LINKED_EMAIL and not LINKED_EMAIL.startswith("<") and LINKED_EMAIL != "user@example.com", (
    "Set LINKED_EMAIL in .env to your real email before running this notebook."
)

instruments = {}

for label, conn_id in [
    ("coinbase", CB_CONNECTOR_ID),
    ("stripe_privy", SP_CONNECTOR_ID),
]:
    resp = dp_client.create_payment_instrument(
        paymentManagerArn=MANAGER_ARN,
        paymentConnectorId=conn_id,
        userId=USER_ID,
        paymentInstrumentType="EMBEDDED_CRYPTO_WALLET",
        paymentInstrumentDetails={
            "embeddedCryptoWallet": {
                "network": NETWORK,
                "linkedAccounts": [{"email": {"emailAddress": LINKED_EMAIL}}],
            }
        },
        clientToken=client_token(),
    )
    inst = resp["paymentInstrument"]
    inst_id = inst["paymentInstrumentId"]
    wallet = inst["paymentInstrumentDetails"]["embeddedCryptoWallet"].get("walletAddress", "pending...")
    instruments[label] = {
        "instrument_id": inst_id,
        "wallet_address": wallet,
        "connector_id": conn_id,
    }
    print(f"✅ {label}: {inst_id} → {wallet}")

    wait_for_status(
        dp_client.get_payment_instrument,
        "ACTIVE",
        paymentManagerArn=MANAGER_ARN,
        paymentConnectorId=conn_id,
        paymentInstrumentId=inst_id,
        userId=USER_ID,
    )
```

## Step 5 — Fund Both Wallets + Complete Consent

Fund both wallets at [faucet.circle.com](https://faucet.circle.com/):
- `ETHEREUM` → **Base Sepolia**
- `SOLANA` → **Solana Devnet**

### StripePrivy — run the Privy reference frontend

The StripePrivy wallet above won't accept payments until the end user grants your agent signing permission. Follow **Step 3** of [providers/stripe_privy_account_setup.ipynb](providers/stripe_privy_account_setup.ipynb) if you haven't already — it walks through the Privy reference frontend from `github.com/privy-io/aws-agentcore-sdk`.

If the Privy reference frontend is already running from that notebook: reload it in your browser so the page picks up the StripePrivy wallet created above, then choose **Connect agent** once. That adds AgentCore as an *additional signer* on every Privy wallet attached to the logged-in user. Re-choosing later is safe.

> **CoinbaseCDP** uses project-level delegation configured in the [CDP Portal](https://portal.cdp.coinbase.com/), not a per-wallet action. See Tutorial 00's Step 7b for details.

```python
print("Fund these wallets at https://faucet.circle.com/\n")
for label, inst in instruments.items():
    print(f"  {label:15s} → {inst['wallet_address']}")
print(f"\n  Network: {NETWORK}")
print()
print("  StripePrivy: reload the Privy reference frontend you set up in the Privy provider notebook,")
print("    then choose Connect agent once to grant AgentCore signer access on all Privy wallets")
print(f"    linked to {os.environ.get('LINKED_EMAIL', 'user@example.com')}.")
```

```python
# StripePrivy: confirm signer access actually landed on the wallet.
# Skipped for CoinbaseCDP — delegation is handled at the CDP project level, not per-wallet.
from utils import verify_privy_signer_on_wallet

privy_wallet = instruments["stripe_privy"]["wallet_address"]
try:
    ok = verify_privy_signer_on_wallet(
        app_id=require_env("PRIVY_APP_ID"),
        app_secret=require_env("PRIVY_APP_SECRET"),
        wallet_address_or_id=privy_wallet,
        quorum_id=require_env("PRIVY_AUTHORIZATION_ID"),
    )
except Exception as exc:
    print(f"  ⚠️  Consent check skipped: {exc}")
    print("     Choose Connect agent in the Privy reference frontend, then re-run this cell.")
else:
    if ok:
        print(f"  ✅ Signer access granted on {privy_wallet}")
    else:
        print(f"  ❌ Signer access has NOT been granted on {privy_wallet}.")
        print("     Reload the Privy reference frontend, choose Connect agent, then re-run this cell.")
        print("     ProcessPayment requires delegated signing on this instrument to succeed.")
```

## Step 6 — Create Session + Save Config

```python
resp = dp_client.create_payment_session(
    paymentManagerArn=MANAGER_ARN,
    userId=USER_ID,
    expiryTimeInMinutes=60,
    limits={"maxSpendAmount": {"value": "1.0", "currency": "USD"}},
    clientToken=client_token(),
)
SESSION_ID = resp["paymentSession"]["paymentSessionId"]
print(f"✅ Session: {SESSION_ID} (budget: $1.00)")
```

```python
# Write resource IDs to .env for downstream tutorials (multi-provider)
save_tutorial_config(
    {
        "PAYMENT_MANAGER_ARN": MANAGER_ARN,
        "PAYMENT_MANAGER_ID": MANAGER_ID,
        "USER_ID": USER_ID,
        "SESSION_ID": SESSION_ID,
        "NETWORK": NETWORK,
        "CREDENTIAL_PROVIDER_TYPE": "MultiProvider",
        # Coinbase
        "COINBASE_INSTRUMENT_ID": instruments["coinbase"]["instrument_id"],
        "COINBASE_WALLET_ADDRESS": instruments["coinbase"]["wallet_address"],
        "COINBASE_CONNECTOR_ID": CB_CONNECTOR_ID,
        # Stripe (Privy)
        "PRIVY_INSTRUMENT_ID": instruments["stripe_privy"]["instrument_id"],
        "PRIVY_WALLET_ADDRESS": instruments["stripe_privy"]["wallet_address"],
        "PRIVY_CONNECTOR_ID": SP_CONNECTOR_ID,
    }
)

print_summary(
    "Multi-Provider Setup Complete",
    manager_arn=MANAGER_ARN,
    coinbase_instrument=instruments["coinbase"]["instrument_id"],
    stripe_privy_instrument=instruments["stripe_privy"]["instrument_id"],
    session_id=SESSION_ID,
)
print("Downstream tutorials pick a provider via env vars:")
print("  COINBASE_INSTRUMENT_ID / PRIVY_INSTRUMENT_ID")
```

## What This Demonstrates

One Payment Manager, two wallet providers, same session budget. The agent code in Tutorial 01+ doesn't change — Select which `instrument_id` to pass to the plugin.

## Verification

If the cells above ran without errors, both connectors are active. You should see two Payment Instruments printed above — one for Coinbase CDP and one for StripePrivy — each with an `ACTIVE` status and a unique `walletAddress`.

## Cleanup

> **Warning:** Deleting the Payment Manager permanently removes all child resources (Connectors, Credential Providers, Instruments) and cannot be undone. Confirm you have completed all downstream tutorials before cleaning up.

**Cost notice:** Please see AgentCore pricing for more details on cost for the services used - https://aws.amazon.com/bedrock/agentcore/pricing/

Sessions expire automatically after their configured `expiryTimeInMinutes`. To delete all payment resources created in this tutorial, run the cleanup cell at the bottom of Tutorial 00 (`setup_agentcore_payments.ipynb`). Deleting the Payment Manager cascades to all child resources (Connectors, Instruments).

# Congratulations!

Continue to Tutorial 01 — the agent works with either provider's instrument.
