# AgentCore generated payments observability data - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-payments-metrics.html

---

# AgentCore generated payments observability data  
  
AgentCore payments automatically generates spans and metrics for every data plane API call. This data is available in Amazon CloudWatch and AWS X-Ray.

For full details on payments observability setup, prerequisites, IAM permissions, and vended logs, see [Observability with Amazon CloudWatch](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-observability.html>) in the payments documentation.

## Provided spans

AgentCore payments emits one span per data plane API call. Span names follow the pattern `Bedrock.AgentCore.Payments.<Operation>`.

Operation | Span attributes | Description  
---|---|---  
ProcessPayment |  aws.payments.payment_manager_id, payment_connector_id, payment_instrument_id, payment_session_id, spend_amount, spend_currency, session_remaining_budget, merchant, token_fetch_latency_ms, payment_agent_name |  Process a payment transaction  
CreatePaymentInstrument |  aws.payments.payment_manager_id, payment_connector_id, payment_instrument_id, payment_agent_name |  Create a payment instrument  
GetPaymentInstrument |  aws.payments.payment_manager_id, payment_connector_id, payment_instrument_id, payment_agent_name |  Retrieve a payment instrument  
ListPaymentInstruments |  aws.payments.payment_manager_id, payment_agent_name |  List payment instruments  
DeletePaymentInstrument |  aws.payments.payment_manager_id, payment_connector_id, payment_instrument_id, payment_agent_name |  Delete a payment instrument  
GetPaymentInstrumentBalance |  aws.payments.payment_manager_id, payment_connector_id, payment_instrument_id, payment_agent_name |  Get instrument balance  
CreatePaymentSession |  aws.payments.payment_manager_id, payment_session_id, session_start_time, payment_agent_name |  Create a payment session  
GetPaymentSession |  aws.payments.payment_manager_id, payment_session_id, session_start_time, payment_agent_name |  Retrieve a payment session  
ListPaymentSessions |  aws.payments.payment_manager_id, payment_agent_name |  List payment sessions  
DeletePaymentSession |  aws.payments.payment_manager_id, payment_session_id, payment_agent_name |  Delete a payment session  
  
All spans also include standard AWS attributes: `aws.region`, `aws.account.id`, `aws.resource.arn`, `aws.request_id`, `http.response.status_code`.

## Provided metrics

Metric | Unit | Description  
---|---|---  
OperationSuccess |  Count |  Number of successful API calls  
OperationFailure |  Count |  Number of failed API calls  
OperationLatency |  Milliseconds |  End-to-end latency per API call  
SpendAmount |  None |  Payment amount processed (ProcessPayment only)  
Throttles |  Count |  Number of throttled requests  
UserErrors |  Count |  Number of client-side validation errors  
ActiveSessions |  Count |  Number of active payment sessions  
PaymentRequestCount |  Count |  Total payment requests  
PaymentSuccessCount |  Count |  Successful payment transactions  
PaymentFailureCount |  Count |  Failed payment transactions  
PaymentLatency |  Milliseconds |  Payment processing latency  
  
Metrics are published with the following dimensions: **Operation** , **PaymentManagerId** , **PaymentConnectorId** , **AgentName** , **Currency** (for SpendAmount).

