# Run an A/B test for agents hosted outside of AgentCore - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/ab-testing-3p-agents.html

---

# Run an A/B test for agents hosted outside of AgentCore

You can A/B test an agent that runs outside an AgentCore Runtime with an agent hosted anywhere, for example on AWS Lambda, Amazon EKS, or Amazon ECS. For A/B testing agents, AgentCore gateway routes traffic between variants, online evaluation scores each session, and the service computes per-variant statistical significance. When your agent is not on an AgentCore Runtime, you need to instrument it for observability and register it as an AgentCore gateway target yourself, and enable gateway tracing so sessions can be attributed to a variant.

A/B tests supports [configuration bundles with a single agent runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./ab-testing-config-bundle.html>) as well as [target based routing with two agent endpoints](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./ab-testing-target-based.html>). This page shows how to set up a HTTP reachable agent endpoint as a target on AgentCore gateway with tracing enabled. Then, AgentCore gateway tracing supplies variant attribution, and observability on the agent endpoint supplies the message content for scoring.

This page is an addendum to [Run an A/B test with target-based routing](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./ab-testing-target-based.html>). It covers only the extra setup a non-runtime agent needs — using a Lambda-hosted agent (behind a function URL) as the example; the same approach applies to any HTTP-reachable agent endpoint you register as an AgentCore gateway target — then sends you back to that page to create and run the test.

## Prerequisites

In addition to the [general A/B testing prerequisites](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./ab-testing-prereqs.html>), you need:

  1. AgentCore gateway tracing enabled on the gateway so sessions can be attributed to a variant.

  2. Your agent added as a passthrough target on an AgentCore gateway using a supported protocol.


## Step 1: Instrument your agent for AgentCore observability

###### Note

Follow [Enabling observability for agents hosted outside of AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-configure.html#observability-configure-3p>) for the full setup.

For a Lambda-hosted agent, attach the [AWS Lambda Layer for OpenTelemetry](<https://aws-otel.github.io/docs/getting-started/lambda#adot-lambda-layer-arns>) and set the following environment variables:

```bash
aws lambda update-function-configuration \
  --function-name <function-name> \
  --region <region> \
  --layers <adot-python-layer-arn> \
  --environment "Variables={
    AGENT_OBSERVABILITY_ENABLED=true,
    OTEL_PROPAGATORS='baggage,xray-lambda,tracecontext',
    OTEL_PYTHON_DISTRO=aws_distro,
    OTEL_PYTHON_CONFIGURATOR=aws_configurator,
    OTEL_LOGS_EXPORTER=otlp,
    OTEL_TRACES_EXPORTER=otlp,
    OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf,
    OTEL_PYTHON_LOGGING_AUTO_INSTRUMENTATION_ENABLED=true,
    OTEL_AWS_APPLICATION_SIGNALS_ENABLED=false,
    OTEL_EXPORTER_OTLP_LOGS_HEADERS='x-aws-log-group=/aws/bedrock-agentcore/agents/<function-name>/runtime-logs,x-aws-log-stream=runtime-logs,x-aws-metric-namespace=agentcore',
    OTEL_RESOURCE_ATTRIBUTES='service.name=<function-name>',
    AWS_LAMBDA_EXEC_WRAPPER=/opt/otel-instrument
  }"
```
A minimal Lambda handler that parses the function URL request and sets the session baggage:

```python
import base64, json
from strands import Agent
from strands.models.bedrock import BedrockModel
from opentelemetry import baggage, context

_model = BedrockModel(model_id="global.anthropic.claude-sonnet-4-5-20250929-v1:0")

def lambda_handler(event, _context):
    # Lambda function URL payload format 2.0: JSON body is in event["body"], no httpMethod.
    raw = event.get("body")
    if raw is not None and event.get("isBase64Encoded"):
        raw = base64.b64decode(raw).decode()
    body = json.loads(raw) if isinstance(raw, str) else (raw or event)

    session_id = _session_id(event)
    token = context.attach(baggage.set_baggage("session.id", session_id))
    try:
        agent = Agent(model=_model, system_prompt="You are a helpful assistant. Be concise.")
        result = agent(body.get("prompt", "Hello"))
    finally:
        context.detach(token)
    return {"response": str(result), "sessionId": session_id}

def _session_id(event):
    return (event.get("headers") or {}).get("x-session-id") or "default"
```
For target-based routing, deploy this twice (control and treatment) with the change you are testing — for example, a different `model_id` or system prompt.

## Step 2: Expose your agent over HTTP

The agent must be reachable at an HTTP endpoint the AgentCore gateway can call. For the Lambda example, create a function URL with IAM authentication for each function:

```bash
aws lambda create-function-url-config \
  --function-name cs-agent-control \
  --auth-type AWS_IAM \
  --region us-west-2
```
Repeat for the treatment function. (For a container or self-hosted agent, expose an HTTPS endpoint instead and skip to Step 3.)

## Step 3: Register your agent as an AgentCore gateway target

Register each endpoint as an HTTP **passthrough** target on an AgentCore gateway. For the details of passthrough targets — including the `protocolType`, stickiness, and credential options — see [HTTP passthrough targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-http-passthrough.html>).

To register a Lambda function URL as a target, set `protocolType` to `CUSTOM` and provide an `iamCredentialProvider`. The credential provider authorizes the gateway to sign each outbound request to the function URL as the `lambda` service:

###### Note

  * The `stickinessConfiguration` tells the gateway to use the `x-session-id` header to recognize which requests belong to the same session. Session stickiness keeps in-flight sessions unaffected when you start or stop an A/B test: the gateway continues to route ongoing sessions to the same target they were already assigned to, and routes only new sessions according to your A/B test treatment weights while the test is running.

  * For observability, your agent must also set this same session ID in its trace context (for example, as `session.id` baggage). This lets online evaluation score agent sessions and traces, and attribute them to the correct A/B test treatment.


###### Example

AgentCore CLI
     ```bash
     agentcore add gateway-target \
       --name customer-support-control \
       --gateway cs-3p-abtest-gw \
       --type passthrough \
       --passthrough-endpoint https://<control-id>.lambda-url.us-west-2.on.aws/ \
       --passthrough-protocol CUSTOM \
       --stickiness-identifier '$context.header.x-session-id' \
       --stickiness-timeout 28800 \
       --signing-service lambda \
       --signing-region us-west-2
     ```
AWS CLI
     ```bash
     aws bedrock-agentcore-control create-gateway-target \
       --gateway-identifier cs-3p-abtest-gw-abc123 \
       --name customer-support-control \
       --region us-west-2 \
       --target-configuration '{
         "http": {
           "passthrough": {
             "endpoint": "https://<control-id>.lambda-url.us-west-2.on.aws/",
             "protocolType": "CUSTOM",
             "stickinessConfiguration": {
               "identifier": "$context.header.x-session-id",
               "timeout": 28800
             }
           }
         }
       }' \
       --credential-provider-configurations '[
         {
           "credentialProviderType": "GATEWAY_IAM_ROLE",
           "credentialProvider": {
             "iamCredentialProvider": { "service": "lambda", "region": "us-west-2" }
           }
         }
       ]'
     ```
For target-based routing, repeat for the treatment endpoint (name it `customer-support-treatment`). Poll each target with `get-gateway-target` until `status` is `READY`.

###### Note

`iamCredentialProvider` is required for an IAM-authenticated passthrough target. For a Lambda function URL set `service` to `lambda`. The gateway IAM role must have both `lambda:InvokeFunctionUrl` and `lambda:InvokeFunction` on each function’s ARN.

## Step 4: Enable AgentCore gateway tracing

Enable tracing delivery on the AgentCore gateway so that it emits variant-attribution spans to `aws/spans`. To enable tracing from the console, open the gateway detail page and choose **Log deliveries and tracing** → **Tracing** → **Enable**. For more information, see [Configure tracing delivery to CloudWatch](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-configure.html#observability-configure-tracing>).

Once traffic begins to flow, each gateway span carries the `aws.agentcore.gateway.routing_experiment_arn` and `aws.agentcore.gateway.routing_experiment_variant_name` (for example, `C` or `T1`) attributes, along with the `traceId` of the request. The online evaluation pipeline joins the gateway span to your agent’s spans by `traceId`, which is how each scored session is attributed to its variant. Without gateway tracing, sessions are still scored, but they cannot be attributed to a variant, and the A/B test does not produce per-variant results.

## Step 5: Create and run the A/B test

Your agent is now a gateway target emitting telemetry. Two steps remain:

  1. **Create one online evaluation configuration per variant endpoint.** See [Create online evaluation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./create-online-evaluations.html>). For each config, use the `service.name` and event log group you configured in Step 1: Instrument your agent for AgentCore observability.

  2. **Create and run the A/B test.** Follow [Run an A/B test with target-based routing](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./ab-testing-target-based.html>), starting from the **Create the A/B test** step — create the test with `perVariantOnlineEvaluationConfig`, send traffic, poll results, stop, and deploy the winner.


When you send traffic through the gateway, direct it to the control variant’s target. The gateway splits all traffic arriving at the control target across the control (`C`) and treatment (`T1`) targets according to your A/B test configuration.

###### Example

AgentCore CLI
    

Add one online evaluation config per variant — using the `service.name` and event log group from Step 1: Instrument your agent for AgentCore observability as the data source — then start the test in `target-based` mode:

```bash
agentcore add online-eval \
  --name cs-control-eval \
  --evaluator Builtin.Correctness \
  --service-name customer-support-control \
  --log-group-name /aws/bedrock-agentcore/agents/cs-agent-control/runtime-logs \
  --enable-on-create

agentcore add online-eval \
  --name cs-treatment-eval \
  --evaluator Builtin.Correctness \
  --service-name customer-support-treatment \
  --log-group-name /aws/bedrock-agentcore/agents/cs-agent-treatment/runtime-logs \
  --enable-on-create

agentcore deploy

agentcore run ab-test \
  --name cs-3p-abtest \
  --gateway cs-3p-abtest-gw \
  --mode target-based \
  --control-target customer-support-control \
  --treatment-target customer-support-treatment \
  --control-online-eval cs-control-eval \
  --treatment-online-eval cs-treatment-eval \
  --control-weight 50 \
  --treatment-weight 50 \
  --wait
```
Use `agentcore status` to view per-variant results while the test runs and `agentcore stop` to end it.

AWS SDK (boto3)
    

Create one online evaluation config per variant with `create_online_evaluation_config`. Set `serviceNames` to the endpoint’s `service.name` and `logGroupNames` to its event log group. Then create the test with `create_ab_test`, using `perVariantOnlineEvaluationConfig`. For the full boto3 example — including sending traffic, polling results, and stopping the test — see [Run an A/B test with target-based routing](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./ab-testing-target-based.html>), starting from the **Create the A/B test** step.

## Troubleshooting

### A/B test shows no results after sending traffic

  * Confirm gateway tracing is enabled (Step 4: Enable AgentCore gateway tracing) — without it the aggregation pipeline cannot attribute sessions to variants.

  * Confirm each online evaluation config’s `serviceNames` matches the endpoint’s `service.name` and its `logGroupNames` includes the endpoint’s event log group. Online evaluation reads `aws/spans` automatically, so you do not list it — but the event log group (message content) must be listed.

  * Results appear after a session is idle for the configured `sessionTimeoutMinutes`, then within roughly 15 minutes of the next scoring cycle.



