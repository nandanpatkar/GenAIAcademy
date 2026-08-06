# Custom code-based evaluator - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-based-evaluators.html

---

# Custom code-based evaluator

Custom code-based evaluators let you use your own AWS Lambda function to programmatically evaluate agent performance, instead of using an LLM as a judge. This gives you full control over the evaluation logic — you can implement deterministic checks, call external APIs, run regex matching, compute custom metrics, or apply any business-specific rules.

## Prerequisites

To use custom code-based evaluators, you need:

  * An AWS Lambda function deployed in the same Region as your AgentCore Evaluations resources.

  * An IAM execution role that grants the AgentCore Evaluations service permission to invoke your Lambda function.

  * The Lambda function must return a JSON response conforming to the response schema described in Response schema.


## IAM permissions

Your service execution role needs the following additional permission to invoke Lambda functions for code-based evaluation:

```json
{
    "Sid": "LambdaInvokeStatement",
    "Effect": "Allow",
    "Action": [
        "lambda:InvokeFunction",
        "lambda:GetFunction"
    ],
    "Resource": "arn:aws:lambda:region:account-id:function:function-name"
}
```
## Lambda function contract

###### Note

The maximum runtime timeout for the Lambda function is 5 minutes (300 seconds). The maximum input payload size sent to the Lambda function is 6 MB.

### Input schema

Your Lambda function receives a JSON payload with the following structure:

```json
{
    "schemaVersion": "1.0",
    "evaluatorId": "my-evaluator-abc1234567",
    "evaluatorName": "MyCodeEvaluator",
    "evaluationLevel": "TRACE",
    "evaluationInput": {
        "sessionSpans": [...]
    },
    "evaluationReferenceInputs": [],
    "evaluationTarget": {
        "traceIds": ["trace123"],
        "spanIds": ["span123"]
    }
}
```
Field | Type | Description  
---|---|---  
`schemaVersion` |  String |  Schema version of the payload. Currently `"1.0"`.  
`evaluatorId` |  String |  The ID of the code-based evaluator.  
`evaluatorName` |  String |  The name of the code-based evaluator.  
`evaluationLevel` |  String |  The evaluation level: `TRACE` , `TOOL_CALL` , or `SESSION`.  
`evaluationInput` |  Object |  Contains the session spans for evaluation.  
`evaluationInput.sessionSpans` |  List |  The session spans to evaluate. May be truncated if the original payload exceeds 6 MB.  
`evaluationReferenceInputs` |  List |  Reference inputs provided to the evaluator, filtered based on the evaluation level. See Using ground truth in code-based evaluator.  
`evaluationTarget` |  Object |  Identifies the specific traces or spans to evaluate. For session-level evaluators, this value is `None`.  
`evaluationTarget.traceIds` |  List |  The trace IDs of the evaluation target. Present for trace-level and tool-level evaluations.  
`evaluationTarget.spanIds` |  List |  The span IDs of the evaluation target. Present for tool-level evaluations.  
  
### Response schema

Your Lambda function must return a JSON object matching one of two formats:

**Success response**

```json
{
    "label": "PASS",
    "value": 1.0,
    "explanation": "All validation checks passed."
}
```
Field | Required | Type | Description  
---|---|---|---  
`label` |  Yes |  String |  A categorical label for the evaluation result (for example, "PASS", "FAIL", "Good", "Poor").  
`value` |  No |  Number |  A numeric score (for example, 0.0 to 1.0).  
`explanation` |  No |  String |  A human-readable explanation of the evaluation result.  
  
**Error response**

```json
{
    "errorCode": "VALIDATION_FAILED",
    "errorMessage": "Input spans missing required tool call attributes."
}
```
Field | Required | Type | Description  
---|---|---|---  
`errorCode` |  Yes |  String |  A code identifying the error.  
`errorMessage` |  Yes |  String |  A human-readable description of the error.  
  
## Create a code-based evaluator

The `CreateEvaluator` API creates a code-based evaluator by specifying a Lambda function ARN and optional timeout.

**Required parameters:** A unique evaluator name, evaluation level ( `TRACE` , `TOOL_CALL` , or `SESSION` ), and a code-based evaluator configuration containing the Lambda ARN.

**Code-based evaluator configuration:**

```json
{
    "codeBased": {
        "lambdaConfig": {
            "lambdaArn": "arn:aws:lambda:region:account-id:function:function-name",
            "lambdaTimeoutInSeconds": 60
        }
    }
}
```
Field | Required | Default | Description  
---|---|---|---  
`lambdaArn` |  Yes |  — |  The ARN of the Lambda function to invoke.  
`lambdaTimeoutInSeconds` |  No |  60 |  Timeout in seconds for the Lambda invocation (1–300).  
  
The following code samples demonstrate how to create code-based evaluators using different development approaches.

###### Example

AgentCore CLI
    

  1. 
```bash
agentcore eval evaluator create \
  --name "MyCodeEvaluator" \
  --level TRACE \
  --lambda-arn "arn:aws:lambda:us-east-1:123456789012:function:my-eval-function" \
  --lambda-timeout 120
```
 


AgentCore SDK
    

  1. 
```python
from bedrock_agentcore.evaluation.code_based_evaluators import (
    EvaluatorInput,
    EvaluatorOutput,
    code_based_evaluator,
)
import json as _json

@code_based_evaluator()
def json_response_evaluator(input: EvaluatorInput) -> EvaluatorOutput:
    """Check if the agent response in the target trace contains valid JSON."""
    for span in input.session_spans:
        if span.get("traceId") != input.target_trace_id:
            continue
        if span.get("name", "").startswith("Model:") or span.get("name") == "Agent.invoke":
            output = span.get("attributes", {}).get("gen_ai.completion", "")
            try:
                _json.loads(output)
                return EvaluatorOutput(
                    value=1.0,
                    label="Pass",
                    explanation="Response contains valid JSON"
                )
            except (ValueError, TypeError):
                pass

    return EvaluatorOutput(
        value=0.0,
        label="Fail",
        explanation="No valid JSON found in agent response"
    )
```
 


AWS SDK
    

  1. 
```python
import boto3

client = boto3.client('bedrock-agentcore-control')

response = client.create_evaluator(
    evaluatorName="MyCodeEvaluator",
    level="TRACE",
    evaluatorConfig={
        "codeBased": {
            "lambdaConfig": {
                "lambdaArn": "arn:aws:lambda:us-east-1:123456789012:function:my-eval-function",
                "lambdaTimeoutInSeconds": 120
            }
        }
    }
)

print(f"Evaluator ID: {response['evaluatorId']}")
print(f"Evaluator ARN: {response['evaluatorArn']}")
```
 


AWS CLI
    

  1. 
```bash
aws bedrock-agentcore-control create-evaluator \
    --evaluator-name 'MyCodeEvaluator' \
    --level TRACE \
    --evaluator-config '{
        "codeBased": {
            "lambdaConfig": {
                "lambdaArn": "arn:aws:lambda:us-east-1:123456789012:function:my-eval-function",
                "lambdaTimeoutInSeconds": 120
            }
        }
    }'
```
 


## Run on-demand evaluation with a code-based evaluator

Once created, use the custom code-based evaluator with the `Evaluate` API the same way you would use any other evaluator. The service handles Lambda invocation, parallel fan-out, and result mapping automatically.

###### Example

AgentCore CLI
    

  1. 
```bash
agentcore run eval \
  --runtime "your_runtime_name" \
  --session-id "your_session_id" \
  --evaluator "code-based-evaluator-id"
```
 


AgentCore SDK
    

  1. 
```python
from bedrock_agentcore.evaluation.client import EvaluationClient

client = EvaluationClient(
    region_name="region"
)

results = client.run(
    evaluator_ids=[
        "code-based-evaluator-id",
    ],
    session_id="session-id",
    log_group_name="log-group-name",
)
```
 


AWS SDK
    

  1. 
```python
import boto3

client = boto3.client('bedrock-agentcore')

response = client.evaluate(
    evaluatorId="code-based-evaluator-id",
    evaluationInput={"sessionSpans": session_span_logs}
)

for result in response["evaluationResults"]:
    if "errorCode" in result:
        print(f"Error: {result['errorCode']} - {result['errorMessage']}")
    else:
        print(f"Label: {result['label']}, Value: {result.get('value')}")
        print(f"Explanation: {result.get('explanation', '')}")
```
 


AWS CLI
    

  1. 
```bash
aws bedrock-agentcore evaluate \
    --cli-input-json file://session_span_logs.json
```
 


### Using evaluation targets

You can target specific traces or spans, just like with LLM-based evaluators:

```bash
# Trace-level evaluation
response = client.evaluate(
    evaluatorId="code-based-evaluator-id",
    evaluationInput={"sessionSpans": session_span_logs},
    evaluationTarget={"traceIds": ["trace-id-1", "trace-id-2"]}
)

# Tool-level evaluation
response = client.evaluate(
    evaluatorId="code-based-evaluator-id",
    evaluationInput={"sessionSpans": session_span_logs},
    evaluationTarget={"spanIds": ["span-id-1", "span-id-2"]}
)
```
### Using ground truth in code-based evaluator

When ground truth reference inputs are configured, your Lambda function receives them in the `evaluationReferenceInputs` field. The reference inputs included depend on the evaluation level:

Evaluation level | Lambda receives  
---|---  
`SESSION` |  All reference inputs.  
`TRACE` |  Session-level reference inputs plus reference inputs matching the target traceId.  
`TOOL_CALL` |  Session-level reference inputs plus reference inputs matching the target spanId.  
  
###### Note

For more information about using ground truth evaluations, see [Ground truth evaluations](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./ground-truth-evaluations.html>).

## Run online evaluation with code-based evaluator

You can use a custom code-based evaluator in an online evaluation configuration to continuously monitor your agent’s live traffic. Pass the evaluator ID in the `evaluators` list when calling `CreateOnlineEvaluationConfig`.

###### Example

AgentCore CLI
    

  1. 
```bash
agentcore add online-eval \
  --name "your_config_name" \
  --runtime "your_runtime_name" \
  --evaluator "code-based-evaluator-id" \
  --sampling-rate 1.0 \
  --enable-on-create
```
 

This command adds the online evaluation configuration to your local `agentcore.json` . Run `agentcore deploy` to create it in your AWS account.

###### Note

Run this from inside an AgentCore project directory (created with `agentcore create` ).


AgentCore SDK
    

  1. 
```python
from bedrock_agentcore_starter_toolkit import Evaluation

eval_client = Evaluation()

config = eval_client.create_online_config(
    config_name="my_online_eval_config",
    agent_id="agent-id",
    sampling_rate=1.0,
    evaluator_list=["code-based-evaluator-id"],
    enable_on_create=True
)

print(f"Config ID: {config['onlineEvaluationConfigId']}")
```
 


AWS SDK
    

  1. 
```python
import boto3

client = boto3.client('bedrock-agentcore-control')

response = client.create_online_evaluation_config(
    onlineEvaluationConfigName="my_online_eval_config",
    rule={"samplingConfig": {"samplingPercentage": 100.0}},
    dataSourceConfig={
        "cloudWatchLogs": {
            "logGroupNames": ["/aws/agentcore/my-agent-traces"],
            "serviceNames": ["my-agent.DEFAULT"]
        }
    },
    evaluators=[{"evaluatorId": "code-based-evaluator-id"}],
    evaluationExecutionRoleArn="arn:aws:iam::account-id:role/AgentCoreEvaluationRole",
    enableOnCreate=True
)

print(f"Config ID: {response['onlineEvaluationConfigId']}")
```
 


AWS CLI
    

  1. 
```bash
aws bedrock-agentcore-control create-online-evaluation-config \
    --online-evaluation-config-name "my_online_eval_config" \
    --rule '{"samplingConfig": {"samplingPercentage": 100.0}}' \
    --data-source-config '{"cloudWatchLogs": {"logGroupNames": ["/aws/agentcore/my-agent-traces"], "serviceNames": ["my-agent.DEFAULT"]}}' \
    --evaluators '[{"evaluatorId": "code-based-evaluator-id"}]' \
    --evaluation-execution-role-arn "arn:aws:iam::account-id:role/AgentCoreEvaluationRole" \
    --enable-on-create
```
 


###### Note

When an online evaluation configuration referencing a code-based evaluator is enabled, the evaluator is automatically locked and cannot be modified or deleted until the configuration is disabled or deleted. To make changes to the evaluator, disable the online evaluation configuration first, or clone the evaluator and create a new configuration.

