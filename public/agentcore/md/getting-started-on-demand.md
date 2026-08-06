# Getting started with on-demand evaluation - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/getting-started-on-demand.html

---

# Getting started with on-demand evaluation

Follow these steps to set up and run your first on-demand evaluation.

###### Topics

  * Prerequisites

  * Supported frameworks

  * Step 1: Create and deploy your agent

  * Step 2: Invoke your agent

  * Step 3: Evaluate agent

  * Step 4: Evaluation results


## Prerequisites

To use AgentCore Evaluations OnDemand Evaluation features, you need:

  * **AWS Account** with appropriate IAM permissions

  * **Amazon Bedrock** access with model invocation permissions

  * **Transaction Search** enabled in CloudWatch - see [Enable Transaction Search](<https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Enable-TransactionSearch.html>)

  * **Python 3.10** or later installed

  * **The OpenTelemetry library** – Include `aws-opentelemetry-distro` (ADOT) in your `requirements.txt` file


## Supported frameworks

AgentCore Evaluations currently supports the following agentic frameworks and instrumentation libraries:

  * Strands Agents

  * LangGraph configured with one of the following instrumentation libraries:

    * `opentelemetry-instrumentation-langchain`

    * `openinference-instrumentation-langchain`


## Step 1: Create and deploy your agent

###### Note

If you have an agent already up and running in AgentCore Runtime, you can directly move to step 2

Create and deploy your agent by following the [Get Started guide for AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-getting-started.html>) . You can find additional examples in the [AgentCore Evaluations Samples](<https://github.com/awslabs/amazon-bedrock-agentcore-samples/tree/main/01-features/06-observe-evaluate-optimize-your-agent/02-evaluate>).

## Step 2: Invoke your agent

Invoke your agent using the following command and view the traces, sessions and metrics on GenAI Observability dashboard on CloudWatch.

###### Topics

  * Example invoke_agent.py


### Example invoke_agent.py

```python
import boto3
import json
import uuid

region = "region-code"
ace_demo_agent_arn = "agent-arn from step-2"

agent_core_client = boto3.client('bedrock-agentcore', region_name=region)

text_to_analyze = "Sample text to test agent for agentcore evaluations demo"

payload = json.dumps({
    "prompt": f"Can you analyze this text and tell me about its statistics: {text_to_analyze}"
})

# random session-id, you can set your own here
session_id = "test-ace-demo-session-18a1dba0-62a0-462g"

response = agent_core_client.invoke_agent_runtime(
    agentRuntimeArn=ace_demo_agent_arn,
    runtimeSessionId=session_id,
    payload=payload,
    qualifier="DEFAULT"
)

response_body = response['response'].read()
response_data = json.loads(response_body)
print("Agent Response:", response_data)
print("SessionId:", session_id)
```
## Step 3: Evaluate agent

Once you have made a few invocations to your agent, you are ready to evaluate it. For evaluations we require:

  * `EvaluatorId` : this can be the id for either a builtin evaluator or a custom created one

  * `SessionSpans` : spans are the telemetry blocks emitted when you interact with an application. The application in our example is an agent hosted on AgentCore Runtime.

    * For on-demand evaluation, we need to download the spans from CloudWatch log groups and use them for evaluation.

    * **AgentCore CLI** does this for you automatically and is the easiest to get started with.

    * If you are not using the AgentCore CLI, we will show how to download logs using session-id and use them for evaluation using the AWS SDK.


###### Topics

  * Code samples for AgentCore CLI and AgentCore SDK

  * AWS SDK


### Code samples for AgentCore CLI and AgentCore SDK

The following code samples demonstrate how to run on-demand evaluations using different development approaches. Choose the method that best fits your development environment and preferences.

###### Example

AgentCore CLI
    

  1. 
````bash
# Runs evaluation for the specified runtime and session.
# It auto queries cloudwatch logs and orchestrates evaluation over multiple evaluators.

RUNTIME_NAME="your_runtime_name"
SESSION_ID="YOUR_SESSION_ID"
agentcore run eval \
  --runtime $RUNTIME_NAME \
  --session-id $SESSION_ID \
  --evaluator "Builtin.Helpfulness" \
  --evaluator "Builtin.GoalSuccessRate"

# Auto reads default runtime from current project config if available
# Verify using ```agentcore status```
agentcore run eval \
  --evaluator "Builtin.Helpfulness" \
  --evaluator "Builtin.GoalSuccessRate"
````
 

Results are saved locally and can be reviewed later with `agentcore evals history` . In interactive mode, the CLI automatically discovers recent sessions from CloudWatch — you don’t need to know session IDs in advance.

###### Note

Run this from inside an AgentCore project directory (created with `agentcore create` ). The `--agent-arn` flag can be used outside a project directory.


Interactive
    

  1. Run `agentcore` to open the TUI, then select **run** and choose **On-demand Evaluation** :

  2. Select evaluators to run against agent traces:

![On-demand evaluation: select evaluators](/agentcore/images/eval-run-evaluators.png)

  3. Review the configuration and press Enter to confirm:

![On-demand evaluation: review configuration](/agentcore/images/eval-run-confirm.png)


AgentCore SDK
    

  1. 
```python
from bedrock_agentcore_starter_toolkit import Evaluation

# Initialize the evaluation client
eval_client = Evaluation()

# Run evaluation on a specific session
results = eval_client.run(
    agent_id="YOUR_AGENT_ID",      # Replace with your agent ID
    session_id="YOUR_SESSION_ID",  # Replace with your session ID
    evaluators=["Builtin.Helpfulness", "Builtin.GoalSuccessRate"]
)

# Display results
successful = results.get_successful_results()
failed = results.get_failed_results()

print(f"  Successful: {len(successful)}")
print(f"  Failed:     {len(failed)}")

if successful:
    result = successful[0]
    print("\n📊 Result:")
    print(f"  Evaluator: {result.evaluator_name}")
    print(f"  Score:     {result.value:.2f}")
    print(f"  Label:     {result.label}")
    if result.explanation:
        print(f"  Explanation: {result.explanation[:150]}...")
```
 


### AWS SDK

###### Topics

  * Download span-logs from CloudWatch

  * Call Evaluate

  * Using evaluation targets


#### Download span-logs from CloudWatch

Before calling the `Evaluate` API, you need to download the span logs from CloudWatch. You can use the Python code below to do so and optionally save them in a JSON file. This makes it easier to make the request for the same session with different evaluators.

###### Note

It takes a couple of minutes for logs to get populated in CloudWatch, so its possible that if you try running the below script "immediately" after agent invocation, the logs are empty or incomplete

```python
import boto3
import time
import json
from datetime import datetime, timedelta

region = "region-code"
agent_id = "agent-id-from-step-2"
session_id = "session-id-from-step-3"

def query_logs(log_group_name, query_string):
    client = boto3.client('logs', region_name=region)
    start_time = datetime.now() - timedelta(minutes=60) # past 1 hour
    end_time = datetime.now()

    query_id = client.start_query(
        logGroupName=log_group_name,
        startTime=int(start_time.timestamp()),
        endTime=int(end_time.timestamp()),
        queryString=query_string
    )['queryId']

    while (result := client.get_query_results(queryId=query_id))['status'] not in ['Complete', 'Failed']:
        time.sleep(1)

    if result['status'] == 'Failed':
        raise Exception("Query failed")
    return result['results']

def query_session_logs(log_group_name, session_id, **kwargs):
    query = f"""fields @timestamp, @message
    | filter ispresent(scope.name) and ispresent(attributes.session.id)
    | filter attributes.session.id = "{session_id}"
    | sort @timestamp asc"""
    return query_logs(log_group_name, query, **kwargs)

def query_agent_runtime_logs(agent_id, endpoint, session_id, **kwargs):
    return query_session_logs(
        f"/aws/bedrock-agentcore/runtimes/{agent_id}-{endpoint}",
        session_id, **kwargs)

def query_aws_spans_logs(session_id, **kwargs):
    return query_session_logs("aws/spans", session_id, **kwargs)

def extract_messages_as_json(query_results):
    return [json.loads(f['value']) for row in query_results
            for f in row if f['field'] == '@message'
            and f['value'].strip().startswith('{')]

def get_session_span_logs():
    agent_runtime_logs = query_agent_runtime_logs(
        agent_id=agent_id, endpoint="DEFAULT", session_id=session_id
    )
    print(f"Downloaded {len(agent_runtime_logs)} runtime-log entries")

    aws_span_logs = query_aws_spans_logs(session_id=session_id)
    print(f"Downloaded {len(aws_span_logs)} aws/span entries")

    session_span_logs = extract_messages_as_json(aws_span_logs) + extract_messages_as_json(agent_runtime_logs)
    print(f"Returning {len(aws_span_logs) + len(agent_runtime_logs)} total records")
    return session_span_logs

# get the spans from cloudwatch
session_span_logs = get_session_span_logs()

# optional (dump in a json file for reuse)
session_span_logs_file_name = "ace-demo-session.json"
with open(session_span_logs_file_name, "w") as f:
    json.dump(session_span_logs, f, indent=2)
```
#### Call Evaluate

Once you have the input spans, you can invoke the `Evaluate` API. Please note that the responses may take a few moments as a large language model is scoring your traces.

```bash
# initialise client
ace_dp_client = boto3.client('bedrock-agentcore', region_name = region)

# call evaluate
response = ace_dp_client.evaluate(
    evaluatorId = "Builtin.Helpfulness", # can be a custom evaluator id as well
    evaluationInput = {"sessionSpans": session_span_logs})

print(response["evaluationResults"])
```
If you use above and dump the session-spans in a json file, you can also subsequently run evaluate as below

```python
with open(session_span_logs_file_name, "r") as f:
    session_span_logs = json.load(f)

# initialise client
ace_dp_client = boto3.client('bedrock-agentcore', region_name = region)

# call evaluate
response = ace_dp_client.evaluate(
    evaluatorId = "Builtin.ToolSelectionAccuracy", # can be a custom evaluator id as well
    evaluationInput = {"sessionSpans": session_span_logs})

print(response["evaluationResults"])
```
#### Using evaluation targets

To evaluate a specific trace or tool within a session, you can specify the target using the `evaluationTarget` parameter in your request.

###### Topics

  * Session-level evaluator

  * Trace-level evaluator

  * Tool call level evaluator


##### Session-level evaluator

Since the service supports only one session per evaluation, you do not need to explicitly set the evaluation target.

##### Trace-level evaluator

For trace-level evaluators (such as `Builtin.Helpfulness` or `Builtin.Correctness` ), set the trace IDs in the `evaluationTarget` parameter:

```text
response = ace_dp_client.evaluate(
    evaluatorId = "Builtin.Helpfulness",
    evaluationInput = {"sessionSpans": session_span_logs},
    evaluationTarget = {"traceIds": ["trace-id-1", "trace-id-2"]}
)
```
##### Tool call level evaluator

For span-level evaluators (such as `Builtin.ToolSelectionAccuracy` ), set the span IDs in the `evaluationTarget` parameter:

```text
response = ace_dp_client.evaluate(
    evaluatorId = "Builtin.ToolSelectionAccuracy",
    evaluationInput = {"sessionSpans": session_span_logs},
    evaluationTarget = {"spanIds": ["span-id-1", "span-id-2"]}
)
```
## Step 4: Evaluation results

Each `Evaluate` API call returns a response containing a list of evaluator results. Because a single session can include multiple traces and tool calls, these elements are evaluated as separate entities. Consequently, a single API call may return multiple evaluation results.

```json
{
    "evaluationResults": [ {evaluation-result-1}, {evaluation-result_2},.... ]
}
```
###### Topics

  * Result limit

  * Partial failures

  * Span context

  * Example successful result entry

  * Example failed result entry


### Result limit

The number of evaluations returned per API call is limited to 10 results. For example, if you evaluate a session containing 15 traces using a trace-level evaluator, the response includes a maximum of 10 results. By default, the API returns the last 10 evaluations, as these typically contain the most context relevant to evaluation quality.

### Partial failures

An API call may process n evaluations while m of them fail. Failures can occur due to various reasons, including:

  * Throttling from model providers

  * Parsing errors

  * Model timeouts

  * Other processing issues


In cases of partial failure, the response includes both successful and failed evaluations. Failed results include an error code and error message to help you diagnose the issue.

### Span context

Each evaluator result has a `spanContext` field that identifies the entity evaluated:

  * For session-level evaluators, only `sessionId` is present.

  * For trace-level evaluators, `sessionId` and `traceId` are present.

  * For tool-level evaluators, `sessionId` , `traceId` , and `spanId` are present.


### Example successful result entry

This is just one entry. If a session has multiple traces, you will see multiple such entries, one for each trace. Similarly for tool-level evaluators, if there are multiple tool calls and a tool evaluator (such as `Builtin.ToolSelectionAccuracy` ) is provided, there will be one result per tool span.

```json
{
  "evaluatorArn": "arn:aws:bedrock-agentcore:::evaluator/Builtin.Helpfulness",
  "evaluatorId": "Builtin.Helpfulness",
  "evaluatorName": "Builtin.Helpfulness",
  "explanation": ".... evaluation explanation will be added here ...",
  "context": {
    "spanContext": {
      "sessionId": "test-ace-demo-session-18a1dba0-62a0-462e",
      "traceId": "....trace_id......."
    }
  },
  "value": 0.83,
  "label": "Very Helpful",
  "tokenUsage": {
    "inputTokens": 958,
    "outputTokens": 211,
    "totalTokens": 1169
  }
}
```
### Example failed result entry

```json
{
    "evaluatorArn": "arn:aws:bedrock-agentcore:::evaluator/Builtin.Helpfulness",
    "evaluatorId": "Builtin.Helpfulness",
    "evaluatorName": "Builtin.Helpfulness",
    "context": {
        "spanContext": {
            "sessionId": "test-ace-demo-session-18a1dba0-62a0-462e",
            "traceId": "....trace_id......."
        }
    },
    "errorMessage": ".... details of the error....",
    "errorCode": ".... name/code of the error...."
}
```
