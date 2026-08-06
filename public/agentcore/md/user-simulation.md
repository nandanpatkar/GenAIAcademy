# User simulation - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/user-simulation.html

---

# User simulation

User simulation uses an LLM-backed actor to play the role of an end user interacting with your agent. You define the actor’s profile and goal, and the actor drives a multi-turn conversation with your agent until the goal is met or the turn limit is reached.

###### Note

User simulation invokes Amazon Bedrock models on the SDK side to generate the actor’s responses. Standard Amazon Bedrock model invocation charges apply for these calls. For details, see the [AgentCore pricing page](<https://aws.amazon.com/bedrock/agentcore/pricing/>).

This is useful when you want to:

  * **Test with realistic variation:** The actor generates different phrasings, follow-up questions, and conversation paths each run, exposing edge cases that hand-authored scenarios miss.

  * **Evaluate open-ended conversations:** For agents that handle free-form dialogue (customer support, tutoring, advisory), simulated scenarios better reflect real user behavior than fixed turn sequences.

  * **Scale scenario coverage:** Instead of writing dozens of multi-turn scripts by hand, define actor profiles with different personas and goals and let the actor generate the conversations.

  * **Regression test with diversity:** Run the same actor profile multiple times to check that your agent handles varied expressions of the same intent.


User simulation works with both the [on-demand](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./dataset-evaluations-on-demand.html>) and [batch](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./dataset-evaluations-batch.html>) dataset runners.

## How it works

The runner processes each simulated scenario through a conversation loop:

  1. **Start:** The runner sends the scenario’s `input` field to your agent as the first turn.

  2. **Agent responds:** Your agent processes the input and returns a response.

  3. **Actor evaluates:** The LLM-backed actor receives the agent’s response and decides what to do next based on its profile and goal. The actor produces a structured response containing:

     * **Reasoning:** The actor’s internal reasoning for its response (for example, "The agent provided flight options but did not ask for my preferred time. I should specify that I prefer morning flights."). This is useful for debugging why the actor behaved a certain way.

     * **Message:** The next message to send to the agent.

     * **Stop signal:** A boolean indicating whether the actor considers its goal achieved.

  4. **Continue or stop:** If the actor signals goal completion (`stop: true`) or the turn count reaches `max_turns`, the conversation ends. Otherwise, the actor’s next message becomes the input for the next turn.

  5. **Evaluate:** After the conversation completes, the runner evaluates the session using the configured evaluators, the same as with predefined scenarios.


## Actor profile

Each simulated scenario requires an `ActorProfile` that defines who the actor is and what it wants to achieve:

Field | Required | Description  
---|---|---  
`context` |  Yes |  Background information about the actor. Describes the situation and any relevant details the actor should know.  
`goal` |  Yes |  What the actor wants to achieve in the conversation. The actor signals completion when it determines the goal has been met.  
`traits` |  No |  Key-value pairs describing the actor’s characteristics (for example, expertise level, communication style, patience). Defaults to empty.  
  
```json
{
  "actor_profile": {
    "context": "A customer who purchased a laptop last week and it arrived with a cracked screen",
    "goal": "Get a replacement laptop shipped within 2 business days",
    "traits": {
      "expertise": "non-technical",
      "tone": "frustrated but polite",
      "patience": "low"
    }
  }
}
```
## Simulation configuration

The `SimulationConfig` controls the actor’s behavior and is set on the runner’s evaluation config:

Field | Default | Description  
---|---|---  
`model_id` |  Default model |  The Amazon Bedrock model ID used for the actor LLM. Choose a model that can follow complex persona instructions. If omitted, the default model is used.  
  
```python
from bedrock_agentcore.evaluation import SimulationConfig

simulation_config = SimulationConfig(
    model_id="<model-id>",
)
```
## Dataset schema

A simulated scenario uses `actor_profile` and `input` instead of `turns`:

```json
{
  "scenarios": [
    {
      "scenario_id": "geography-student",
      "scenario_description": "A curious student asks geography questions",
      "actor_profile": {
        "traits": {"expertise": "novice", "tone": "curious"},
        "context": "A student studying world geography who wants to learn about capitals",
        "goal": "Find out the capital cities of at least two different countries"
      },
      "input": "Hi! I'm studying geography. Can you help me learn about world capitals?",
      "max_turns": 5,
      "assertions": [
        "Agent provides accurate capital city information",
        "Agent is helpful and encouraging to the student"
      ]
    }
  ]
}
```
Field | Required | Default | Description  
---|---|---|---  
`scenario_id` |  Yes |  — |  Unique identifier for the scenario.  
`scenario_description` |  No |  `""` |  Optional metadata describing the scenario. Useful for organizing and identifying scenarios in results.  
`actor_profile` |  Yes |  — |  The actor’s identity and objective. See Actor profile.  
`input` |  Yes |  — |  The first message sent to your agent to start the conversation.  
`max_turns` |  No |  10 |  Maximum number of turns before the conversation stops. Must be at least 1.  
`assertions` |  No |  — |  Natural language assertions about expected behavior. Used by session-level evaluators such as `Builtin.GoalSuccessRate`.  
  
###### Note

Simulated scenarios do not support `expected_trajectory` or per-turn `expected_response` because the conversation flow is not known in advance. Use `assertions` for ground truth with simulated scenarios.

`FileDatasetProvider` auto-detects the scenario type from the JSON structure: scenarios with an `actor_profile` field (and no `turns` field) are loaded as `SimulatedScenario`.

## Using with the batch dataset runner

The following example runs a simulated scenario evaluation using the [batch dataset runner](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./dataset-evaluations-batch.html>). Set `simulation_config` on `BatchEvaluationRunConfig` and include `SimulatedScenario` instances in the dataset:

```python
import boto3
import json
from bedrock_agentcore.evaluation import (
    BatchEvaluationRunner,
    BatchEvaluationRunConfig,
    BatchEvaluatorConfig,
    CloudWatchDataSourceConfig,
    SimulationConfig,
    AgentInvokerInput,
    AgentInvokerOutput,
    Dataset,
    SimulatedScenario,
    ActorProfile,
)

AGENT_ARN = "arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/MyAgent-abc123"  # Replace with your agent runtime ARN
REGION = "us-west-2"  # Replace with your region
RUNTIME_ID = AGENT_ARN.split("/")[-1]
AGENT_NAME = RUNTIME_ID.rsplit("-", 1)[0]
ENDPOINT_NAME = "DEFAULT"
LOG_GROUP = f"/aws/bedrock-agentcore/runtimes/{RUNTIME_ID}-{ENDPOINT_NAME}"
SERVICE_NAME = f"{AGENT_NAME}.{ENDPOINT_NAME}"
ACTOR_MODEL_ID = "global.anthropic.claude-haiku-4-5-20251001-v1:0"  # Replace with your preferred model

# Define the dataset with simulated scenarios
dataset = Dataset(
    scenarios=[
        SimulatedScenario(
            scenario_id="support-frustrated-customer",
            scenario_description="A frustrated customer with a defective product",
            actor_profile=ActorProfile(
                traits={"expertise": "non-technical", "tone": "frustrated but polite"},
                context="Purchased a laptop last week that arrived with a cracked screen",
                goal="Get a replacement laptop shipped within 2 business days",
            ),
            input="I received my laptop and the screen is cracked. I need help.",
            max_turns=8,
            assertions=[
                "Agent acknowledges the issue and apologizes",
                "Agent offers a replacement or refund",
                "Agent provides a timeline for resolution",
            ],
        ),
        SimulatedScenario(
            scenario_id="support-billing-question",
            scenario_description="A customer with a billing discrepancy",
            actor_profile=ActorProfile(
                traits={"expertise": "moderate", "tone": "calm"},
                context="Noticed a double charge on the last credit card statement",
                goal="Get the duplicate charge reversed and confirmation of the refund",
            ),
            input="I see two charges for the same order on my statement. Can you look into this?",
            max_turns=6,
            assertions=[
                "Agent investigates the billing issue",
                "Agent confirms whether a duplicate charge exists",
            ],
        ),
    ]
)

# Configure the evaluation
config = BatchEvaluationRunConfig(
    batch_evaluation_name="simulated-support-eval",
    evaluator_config=BatchEvaluatorConfig(
        evaluator_ids=[
            "Builtin.GoalSuccessRate",
            "Builtin.Helpfulness",
        ],
    ),
    data_source=CloudWatchDataSourceConfig(
        service_names=[SERVICE_NAME],
        log_group_names=[LOG_GROUP],
        ingestion_delay_seconds=180,
    ),
    simulation_config=SimulationConfig(
        model_id=ACTOR_MODEL_ID,
    ),
    polling_timeout_seconds=1800,
    polling_interval_seconds=30,
)

# Define the agent invoker
agentcore_client = boto3.client("bedrock-agentcore", region_name=REGION)

def agent_invoker(inp: AgentInvokerInput) -> AgentInvokerOutput:
    payload = inp.payload
    if isinstance(payload, str):
        raw_bytes = json.dumps({"prompt": payload}).encode()
    elif isinstance(payload, dict):
        raw_bytes = json.dumps(payload).encode()
    else:
        raw_bytes = json.dumps({"prompt": str(payload)}).encode()

    print(f"[{inp.session_id}] > sending payload: {raw_bytes.decode()}")
    response = agentcore_client.invoke_agent_runtime(
        agentRuntimeArn=AGENT_ARN,
        runtimeSessionId=inp.session_id,
        payload=raw_bytes,
    )
    response_body = response["response"].read()
    print(f"[{inp.session_id}] < received response: {response_body.decode()}")
    return AgentInvokerOutput(agent_output=json.loads(response_body))

# Run the evaluation
runner = BatchEvaluationRunner(region=REGION)
result = runner.run_dataset_evaluation(
    config=config,
    dataset=dataset,
    agent_invoker=agent_invoker,
)

# Display results
print(f"Status: {result.status}")
if result.evaluation_results:
    er = result.evaluation_results
    print(f"Sessions completed: {er.number_of_sessions_completed}")
    print(f"Sessions failed:    {er.number_of_sessions_failed}")
    for summary in er.evaluator_summaries or []:
        avg = summary.statistics.average_score if summary.statistics else None
        print(f"  {summary.evaluator_id}: avg={avg}")
```
## Using with the on-demand dataset runner

The [on-demand dataset runner](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./dataset-evaluations-on-demand.html>) follows the same pattern. Set `simulation_config` on `EvaluationRunConfig` and include `SimulatedScenario` instances in the dataset:

###### Note

On-demand evaluations are charged based on consumption. For details, see the [AgentCore pricing page](<https://aws.amazon.com/bedrock/agentcore/pricing/>).

```python
from bedrock_agentcore.evaluation import (
    OnDemandEvaluationDatasetRunner,
    EvaluationRunConfig,
    EvaluatorConfig,
    CloudWatchAgentSpanCollector,
    SimulationConfig,
    FileDatasetProvider,
)

AGENT_ARN = "arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/MyAgent-abc123"  # Replace with your agent runtime ARN
REGION = "us-west-2"  # Replace with your region
RUNTIME_ID = AGENT_ARN.split("/")[-1]
ENDPOINT_NAME = "DEFAULT"
LOG_GROUP = f"/aws/bedrock-agentcore/runtimes/{RUNTIME_ID}-{ENDPOINT_NAME}"
ACTOR_MODEL_ID = "global.anthropic.claude-haiku-4-5-20251001-v1:0"  # Replace with your preferred model

# Load dataset (auto-detects simulated scenarios from actor_profile field)
dataset = FileDatasetProvider("simulated_dataset.json").get_dataset()

# Create span collector
span_collector = CloudWatchAgentSpanCollector(
    log_group_name=LOG_GROUP,
    region=REGION,
)

# Configure with simulation support
config = EvaluationRunConfig(
    evaluator_config=EvaluatorConfig(
        evaluator_ids=["Builtin.GoalSuccessRate", "Builtin.Helpfulness"],
    ),
    evaluation_delay_seconds=180,
    max_concurrent_scenarios=5,
    simulation_config=SimulationConfig(
        model_id=ACTOR_MODEL_ID,
    ),
)

# Run
runner = OnDemandEvaluationDatasetRunner(region=REGION)
result = runner.run(
    agent_invoker=agent_invoker,
    dataset=dataset,
    span_collector=span_collector,
    config=config,
)

for scenario in result.scenario_results:
    print(f"Scenario: {scenario.scenario_id} ({scenario.status})")
    for evaluator in scenario.evaluator_results:
        for r in evaluator.results:
            print(f"  {evaluator.evaluator_id}: {r.get('value')} ({r.get('label')})")
```
## Stop conditions

A simulated conversation ends when any of the following conditions is met:

  1. **Goal completed:** The actor determines its goal has been achieved and signals `stop: true`. This is the expected outcome.

  2. **Maximum turns reached:** The conversation reaches the `max_turns` limit. This acts as a safety backstop. If your scenarios frequently hit the turn limit, consider increasing `max_turns` or simplifying the actor’s goal.

  3. **No message produced:** The actor produces no next message but does not explicitly signal stop. This is treated as an implicit goal completion.


## Tips for effective simulated scenarios

  * **Be specific in the goal:** Vague goals like "have a conversation" lead to unfocused interactions. Specific goals like "get a refund for order #12345" give the actor a clear endpoint.

  * **Use traits to control difficulty:** An actor with `"expertise": "expert"` asks harder questions than one with `"expertise": "novice"`. Use traits to test your agent across different user segments.

  * **Set realistic turn limits:** Most customer support conversations resolve in 5 to 10 turns. Setting `max_turns` too high wastes compute; setting it too low may cut off conversations before the goal is reached.

  * **Use assertions for ground truth:** Since the conversation flow is dynamic, per-turn `expected_response` is not available. Write assertions that describe the outcome you expect regardless of the specific path taken.

  * **Choose an appropriate actor model:** The actor model should be capable enough to maintain a coherent persona across turns. Smaller models work for simple personas; complex personas with nuanced goals benefit from more capable models.



