# Create a payment instrument - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-create-instrument.html

---

# Create a payment instrument

A payment instrument represents an embedded crypto wallet that an agent uses to pay merchants on behalf of a user. Each instrument is associated with a specific blockchain network. The `ETHEREUM` network value covers Ethereum mainnet and all supported EVM-compatible Layer 2 networks (Base, Arbitrum, and others). For the complete request and response schema, see [CreatePaymentInstrument](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_CreatePaymentInstrument.html>) in the API Reference.

###### Tip

You can automate the steps on this page with the AgentCore Payments skill in the AWS agent toolkit. The skill is part of the **aws-agents** plugin and lets an AI coding agent create your Payment Manager, connector, credential provider, payment instrument, and session using the `agentcore` CLI, and add an x402 payment tool to your agent. For details, see the [quickstart](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-getting-started.html>) and the [AWS agent toolkit on GitHub](<https://github.com/aws/agent-toolkit-for-aws/tree/main>).

###### Example

AgentCore SDK
     ```python
     from bedrock_agentcore.payments import PaymentManager

     manager = PaymentManager(
         payment_manager_arn=mgr["paymentManagerArn"],
         region_name="us-west-2"
     )

     # Create payment instrument (Ethereum)
     instrument = manager.create_payment_instrument(
         user_id="test-user-123",
         payment_connector_id=PAYMENT_CONNECTOR_ID,
         payment_instrument_type="EMBEDDED_CRYPTO_WALLET",
         payment_instrument_details={"embeddedCryptoWallet": {"network": "ETHEREUM",
         "linkedAccounts": [{
                     "email": {
                         "emailAddress": "myemail@example.com"
                     }
                 }]
        }},
     )
     ```
For Solana compatible chain, use enum `SOLANA` for network input.

AWS CLI
     ```bash
     aws bedrock-agentcore create-payment-instrument \
         --payment-manager-arn "arn:aws:bedrock-agentcore:us-west-2:123456789012:payment-manager/my-manager" \
         --payment-connector-id "my-connector-id" \
         --user-id "test-user-123" \
         --payment-instrument-type "EMBEDDED_CRYPTO_WALLET" \
         --payment-instrument-details '{
             "embeddedCryptoWallet": {
                 "network": "ETHEREUM",
                 "linkedAccounts": [{"email": {"emailAddress": "myemail@example.com"}}]
             }
         }' \
         --client-token "$(uuidgen)" \
         --region us-west-2
     ```
For Solana compatible chain, use `"network": "SOLANA"`.

AWS SDK
     ```python
     import boto3
     import uuid

     dp_client = boto3.client("bedrock-agentcore", region_name="us-west-2",
         endpoint_url="https://bedrock-agentcore.us-west-2.amazonaws.com")

     # Create payment instrument (Ethereum)
     instrument = dp_client.create_payment_instrument(
         userId="test-user-123",
         paymentManagerArn=PAYMENT_MANAGER_ARN,
         paymentConnectorId=PAYMENT_CONNECTOR_ID,
         paymentInstrumentType="EMBEDDED_CRYPTO_WALLET",
         paymentInstrumentDetails={
             "embeddedCryptoWallet": {
                 "network": "ETHEREUM",
                 "linkedAccounts": [{
                     "email": {
                         "emailAddress": "myemail@example.com"
                     }
                 }]
             },
         },
         clientToken=str(uuid.uuid4()),
     )
     ```
For Solana compatible chain, use enum `SOLANA` for network input.

###### Note

Once the payment instrument is created, the end user must fund the instrument and grant signing permissions before the agent can process payments. For detailed instructions, see [Fund the wallet and grant agent permissions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-fund-wallet.html>).

## Get a payment instrument

###### Example

AgentCore SDK
     ```python
     instrument = manager.get_payment_instrument(
         user_id="test-user-123",
         payment_instrument_id="payment-instrument-abc123"
     )
     print(f"Status: {instrument['status']}")
     ```
AWS CLI
     ```bash
     aws bedrock-agentcore get-payment-instrument \
         --payment-manager-arn "arn:aws:bedrock-agentcore:us-west-2:123456789012:payment-manager/my-manager" \
         --payment-instrument-id "payment-instrument-abc123" \
         --user-id "test-user-123" \
         --region us-west-2
     ```
AWS SDK
     ```python
     response = dp_client.get_payment_instrument(
         paymentManagerArn=PAYMENT_MANAGER_ARN,
         paymentInstrumentId="payment-instrument-abc123"
     )
     print(f"Status: {response['status']}, Network: {response['paymentInstrumentDetails']['embeddedCryptoWallet']['network']}")
     ```
## List payment instruments

###### Example

AgentCore SDK
     ```python
     instruments = manager.list_payment_instruments(
         user_id="test-user-123"
     )
     for inst in instruments['paymentInstruments']:
         print(f"{inst['paymentInstrumentId']} - {inst['status']}")
     ```
AWS CLI
     ```bash
     aws bedrock-agentcore list-payment-instruments \
         --payment-manager-arn "arn:aws:bedrock-agentcore:us-west-2:123456789012:payment-manager/my-manager" \
         --user-id "test-user-123" \
         --region us-west-2
     ```
AWS SDK
     ```python
     response = dp_client.list_payment_instruments(
         paymentManagerArn=PAYMENT_MANAGER_ARN,
         userId="test-user-123"
     )
     for inst in response['paymentInstruments']:
         print(f"{inst['paymentInstrumentId']} - {inst['status']}")
     ```
## Check instrument balance

###### Example

AgentCore SDK
     ```python
     balance = manager.get_payment_instrument_balance(
         user_id="test-user-123",
         payment_instrument_id="payment-instrument-abc123"
     )
     print(f"Balance: {balance['amount']} {balance['currency']}")
     ```
AWS CLI
     ```bash
     aws bedrock-agentcore get-payment-instrument-balance \
         --payment-manager-arn "arn:aws:bedrock-agentcore:us-west-2:123456789012:payment-manager/my-manager" \
         --payment-instrument-id "payment-instrument-abc123" \
         --region us-west-2
     ```
AWS SDK
     ```python
     response = dp_client.get_payment_instrument_balance(
         paymentManagerArn=PAYMENT_MANAGER_ARN,
         paymentInstrumentId="payment-instrument-abc123"
     )
     print(f"Balance: {response['amount']} {response['currency']}")
     ```
## Delete a payment instrument

###### Example

AgentCore SDK
     ```text
     manager.delete_payment_instrument(
         user_id="test-user-123",
         payment_instrument_id="payment-instrument-abc123"
     )
     ```
AWS CLI
     ```bash
     aws bedrock-agentcore delete-payment-instrument \
         --payment-manager-arn "arn:aws:bedrock-agentcore:us-west-2:123456789012:payment-manager/my-manager" \
         --payment-instrument-id "payment-instrument-abc123" \
         --region us-west-2
     ```
AWS SDK
     ```text
     dp_client.delete_payment_instrument(
         paymentManagerArn=PAYMENT_MANAGER_ARN,
         paymentInstrumentId="payment-instrument-abc123"
     )
     ```
