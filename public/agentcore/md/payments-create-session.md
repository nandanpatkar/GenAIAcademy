# Create a payment session - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-create-session.html

---

# Create a payment session

A payment session is a time-bounded payment context that optionally enforces a spending budget. When the session expires or the budget is reached, further payment requests within that session are denied. For the complete request and response schema, see [CreatePaymentSession](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_CreatePaymentSession.html>) in the API Reference.

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

     # Create payment session with payment limits
     session = manager.create_payment_session(
         user_id="test-user-123",
         limits={"maxSpendAmount": {"value": "100.00", "currency": "USD"}},
         expiry_time_in_minutes=60
     )
     ```
AWS CLI
     ```bash
     aws bedrock-agentcore create-payment-session \
         --payment-manager-arn "arn:aws:bedrock-agentcore:us-west-2:123456789012:payment-manager/my-manager" \
         --user-id "test-user-123" \
         --expiry-time-in-minutes 60 \
         --limits '{"maxSpendAmount": {"value": "100.00", "currency": "USD"}}' \
         --client-token "$(uuidgen)" \
         --region us-west-2
     ```
AWS SDK
     ```python
     import boto3
     import uuid

     dp_client = boto3.client("bedrock-agentcore", region_name="us-west-2",
         endpoint_url="https://bedrock-agentcore.us-west-2.amazonaws.com")

     # Create payment session with payment limits
     session = dp_client.create_payment_session(
         userId="test-user-123",
         paymentManagerArn=PAYMENT_MANAGER_ARN,
         expiryTimeInMinutes=120,
         limits={"maxSpendAmount": {"value": "100.00", "currency": "USD"}},
         clientToken=str(uuid.uuid4()),
     )
     ```
###### Tip

If you use the AgentCore CLI (v0.19.0+), pass `--auto-session` to `agentcore invoke` to create or reuse a session with the default spend limit configured on your payment manager. This removes the need to create sessions manually for most workflows.

## Get a payment session

###### Example

AgentCore SDK
     ```python
     session = manager.get_payment_session(
         user_id="test-user-123",
         payment_session_id="payment-session-abc123"
     )
     print(f"Status: {session['status']}, Remaining: {session['remainingAmount']}")
     ```
AWS CLI
     ```bash
     aws bedrock-agentcore get-payment-session \
         --payment-manager-arn "arn:aws:bedrock-agentcore:us-west-2:123456789012:payment-manager/my-manager" \
         --payment-session-id "payment-session-abc123" \
         --region us-west-2
     ```
AWS SDK
     ```python
     response = dp_client.get_payment_session(
         paymentManagerArn=PAYMENT_MANAGER_ARN,
         paymentSessionId="payment-session-abc123"
     )
     print(f"Status: {response['status']}")
     print(f"Spent: {response['spentAmount']} / {response['limits']['maxSpendAmount']['value']}")
     ```
