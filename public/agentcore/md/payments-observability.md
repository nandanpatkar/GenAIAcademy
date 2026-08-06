# Observability with Amazon CloudWatch - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-observability.html

---

# Observability with Amazon CloudWatch

AgentCore payments supports observability through Amazon CloudWatch, so you can monitor and troubleshoot your payment integration.

  * **Amazon CloudWatch** is the AWS monitoring and observability service. It collects and tracks metrics, logs, and traces from your AWS resources, giving you visibility into application performance.

  * **Vended logs** are logs that AWS services publish on your behalf directly to your CloudWatch log group. Unlike application logs that you instrument yourself, vended logs are generated automatically by the service. You configure where to deliver them.

  * **Spans** represent units of work within a request (for example, an API call and its downstream operations). Use spans to trace the flow of a request through the system and identify latency bottlenecks or failures.


After you complete the following setup procedures, any data plane API call (for example, `CreatePaymentInstrument`) produces logs and trace data in your configured CloudWatch log group.

## Prerequisites

  * A **CloudWatch log group** as the delivery destination (for example, `/bedrock-agentcore/payments/my-logs`). If you do not have one, create one using the console or CLI.

  * The **resource ARN** of your PaymentManager.


Create a log group:

###### Example

Console
    

Open the CloudWatch console, go to **Logs > Log groups**, and choose **Create log group**. Enter a name like `/bedrock-agentcore/payments/my-logs` and select your preferred retention period.

AWS CLI
     ```bash
     aws logs create-log-group --log-group-name /bedrock-agentcore/payments/my-logs
     ```
## IAM permissions

Your IAM user or role must have the following permissions to create log and span delivery resources:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "CloudWatchLogsVendedDelivery",
            "Effect": "Allow",
            "Action": [
                "logs:CreateDelivery",
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:DeleteDelivery",
                "logs:DeleteDeliveryDestination",
                "logs:DeleteDeliverySource",
                "logs:DeleteLogGroup",
                "logs:DeleteResourcePolicy",
                "logs:DescribeLogGroups",
                "logs:DescribeResourcePolicies",
                "logs:GetDelivery",
                "logs:GetDeliveryDestination",
                "logs:GetDeliverySource",
                "logs:PutDeliveryDestination",
                "logs:PutDeliverySource",
                "logs:PutLogEvents",
                "logs:PutResourcePolicy",
                "logs:PutRetentionPolicy"
            ],
            "Resource": "*"
        },
        {
            "Sid": "XRayApplicationSignalsCloudTrail",
            "Effect": "Allow",
            "Action": [
                "xray:GetTraceSegmentDestination",
                "xray:ListResourcePolicies",
                "xray:PutResourcePolicy",
                "xray:PutTelemetryRecords",
                "xray:PutTraceSegments",
                "xray:UpdateTraceSegmentDestination",
                "application-signals:StartDiscovery",
                "cloudtrail:CreateServiceLinkedChannel"
            ],
            "Resource": "*"
        },
        {
            "Sid": "CreateServiceLinkedRoleForAppSignals",
            "Effect": "Allow",
            "Action": "iam:CreateServiceLinkedRole",
            "Resource": "arn:*:iam::*:role/aws-service-role/application-signals.cloudwatch.amazonaws.com/AWSServiceRoleForCloudWatchApplicationSignals"
        },
        {
            "Sid": "BedrockAgentCoreVendedLogDelivery",
            "Effect": "Allow",
            "Action": "bedrock-agentcore:AllowVendedLogDeliveryForResource",
            "Resource": "*"
        }
    ]
}
```
## Vended logs

Vended logs appear as application logs in your configured log group. These are generated automatically by the AgentCore payments service for every data plane API call.

## Vended spans

Vended spans are trace records for individual requests. Use them to visualize request flow in AWS X-Ray. Each span represents a unit of work (for example, an API call and its downstream operations), enabling you to identify latency bottlenecks or failures.

### Span names

AgentCore payments emits one span per data plane API call. Span names follow the pattern `Bedrock.AgentCore.Payments.<Operation>`:

Span Name | Description  
---|---  
`Bedrock.AgentCore.Payments.ProcessPayment` |  Process a payment transaction  
`Bedrock.AgentCore.Payments.CreatePaymentInstrument` |  Create a payment instrument  
`Bedrock.AgentCore.Payments.GetPaymentInstrument` |  Retrieve a payment instrument  
`Bedrock.AgentCore.Payments.ListPaymentInstruments` |  List payment instruments  
`Bedrock.AgentCore.Payments.DeletePaymentInstrument` |  Delete a payment instrument  
`Bedrock.AgentCore.Payments.GetPaymentInstrumentBalance` |  Get instrument balance  
`Bedrock.AgentCore.Payments.CreatePaymentSession` |  Create a payment session  
`Bedrock.AgentCore.Payments.GetPaymentSession` |  Retrieve a payment session  
`Bedrock.AgentCore.Payments.ListPaymentSessions` |  List payment sessions  
`Bedrock.AgentCore.Payments.DeletePaymentSession` |  Delete a payment session  
  
### Span attributes

Each span includes the following attributes for filtering and analysis in AWS X-Ray:

Attribute | Description  
---|---  
`aws.payments.payment_manager_id` |  The Payment Manager ID for this request  
`aws.payments.payment_connector_id` |  The Payment Connector ID (when applicable)  
`aws.payments.payment_instrument_id` |  The Payment Instrument ID (when applicable)  
`aws.payments.payment_session_id` |  The Payment Session ID (when applicable)  
`aws.payments.spend_amount` |  The payment amount (ProcessPayment only)  
`aws.payments.spend_currency` |  The payment currency (ProcessPayment only)  
`aws.payments.session_remaining_budget` |  Remaining session budget after payment (ProcessPayment only)  
`aws.payments.total_budget_amount` |  Total session budget (ProcessPayment only)  
`aws.payments.merchant` |  The merchant address (payTo) for the transaction (ProcessPayment only)  
`aws.payments.payment_agent_name` |  The agent name, if provided via the `X-Amzn-Bedrock-AgentCore-Payments-Agent-Name` header  
`aws.payments.token_fetch_latency_ms` |  Latency of credential token retrieval from AgentCore Identity (ProcessPayment only)  
  
Standard AWS attributes are also included on every span:

  * `aws.region` — The AWS Region

  * `aws.account.id` — The caller’s account ID

  * `aws.resource.arn` — The PaymentManager ARN

  * `aws.request_id` — The request ID

  * `http.response.status_code` — The HTTP response status code


## Vended metrics

AgentCore payments publishes the following metrics to your Amazon CloudWatch namespace. Use these to build dashboards, set alarms, and monitor payment health.

Metric | Unit | Description  
---|---|---  
`OperationSuccess` |  Count |  Number of successful API calls  
`OperationFailure` |  Count |  Number of failed API calls  
`OperationLatency` |  Milliseconds |  End-to-end latency per API call  
`SpendAmount` |  None |  Payment amount processed (ProcessPayment only)  
`Throttles` |  Count |  Number of throttled requests  
`UserErrors` |  Count |  Number of client-side validation errors  
`ActiveSessions` |  Count |  Number of active payment sessions  
`PaymentRequestCount` |  Count |  Total payment requests  
`PaymentSuccessCount` |  Count |  Successful payment transactions  
`PaymentFailureCount` |  Count |  Failed payment transactions  
`PaymentLatency` |  Milliseconds |  Payment processing latency  
  
### Metric dimensions

Metrics are published with the following dimensions for filtering:

  * **Operation** — The API operation name (always present)

  * **PaymentManagerId** — The Payment Manager ID (when available)

  * **PaymentConnectorId** — The Payment Connector ID (when available)

  * **AgentName** — The agent name (when provided via header)

  * **Currency** — The payment currency (for SpendAmount metric)


## Enable observability

###### Example

Console
    

From the Payment Manager details page in the Amazon Bedrock AgentCore console:

  1. Navigate to the **Log deliveries and tracing** section.

  2. Configure log delivery to your CloudWatch log group.

  3. Enable traces to view spans in AWS X-Ray.


The **Observability** section on the Payment Manager details page provides real-time metrics including session counts, API invocations, transaction success rates, and error rates.

AWS CLI
     ```bash
     # Step 1: Allow vended log delivery for your Payment Manager
     aws bedrock-agentcore allow-vended-log-delivery-for-resource \
         --resource-arn "arn:aws:bedrock-agentcore:us-west-2:123456789012:payment-manager/my-manager"

     # Step 2: Create a delivery source
     aws logs put-delivery-source \
         --name "payments-logs" \
         --resource-arn "arn:aws:bedrock-agentcore:us-west-2:123456789012:payment-manager/my-manager" \
         --log-type "APPLICATION_LOGS"

     # Step 3: Create a delivery destination
     aws logs put-delivery-destination \
         --name "payments-log-destination" \
         --delivery-destination-configuration '{"destinationResourceArn": "arn:aws:logs:us-west-2:123456789012:log-group:/bedrock-agentcore/payments/my-logs"}'

     # Step 4: Create the delivery
     aws logs create-delivery \
         --delivery-source-name "payments-logs" \
         --delivery-destination-arn "arn:aws:logs:us-west-2:123456789012:delivery-destination:payments-log-destination"
     ```
AWS SDK
     ```python
     import boto3

     # Allow vended log delivery for your Payment Manager
     agentcore_client = boto3.client("bedrock-agentcore-control", region_name="us-west-2")
     agentcore_client.allow_vended_log_delivery_for_resource(
         resourceArn="arn:aws:bedrock-agentcore:us-west-2:123456789012:payment-manager/my-manager"
     )

     # Configure CloudWatch Logs delivery
     logs_client = boto3.client("logs", region_name="us-west-2")

     # Create delivery source
     logs_client.put_delivery_source(
         name="payments-logs",
         resourceArn="arn:aws:bedrock-agentcore:us-west-2:123456789012:payment-manager/my-manager",
         logType="APPLICATION_LOGS"
     )

     # Create delivery destination
     logs_client.put_delivery_destination(
         name="payments-log-destination",
         deliveryDestinationConfiguration={
             "destinationResourceArn": "arn:aws:logs:us-west-2:123456789012:log-group:/bedrock-agentcore/payments/my-logs"
         }
     )

     # Create the delivery
     logs_client.create_delivery(
         deliverySourceName="payments-logs",
         deliveryDestinationArn="arn:aws:logs:us-west-2:123456789012:delivery-destination:payments-log-destination"
     )
     ```
For more information on AgentCore observability, see [AgentCore Observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability.html>). For gateway-specific metrics and spans, see [AgentCore generated gateway observability data](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-gateway-metrics.html>).

