# Dataset schema - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/dataset-evaluations-schema.html

---

# Dataset schema

A dataset contains one or more scenarios. Each scenario represents a conversation (session) with the agent. Both the [on-demand](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./dataset-evaluations-on-demand.html>) and [batch](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./dataset-evaluations-batch.html>) dataset runners use the same dataset format.

The AgentCore SDK supports two scenario types:

  * **Predefined scenarios** use a fixed sequence of turns that you author by hand. The runner replays the turns exactly as written.

  * **Simulated scenarios** use an LLM-backed actor to generate turns dynamically based on a persona and goal. See [User simulation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./user-simulation.html>) for details on actor profiles and simulation configuration.


`FileDatasetProvider` auto-detects the scenario type from the JSON structure: scenarios with a `turns` field are loaded as predefined; scenarios with an `actor_profile` field (and no `turns`) are loaded as simulated.

## Predefined scenarios

A predefined scenario specifies a fixed sequence of turns with known inputs and optional expected outputs.

### Single-turn example

Each scenario sends one prompt and checks the response:

```json
{
  "scenarios": [
    {
      "scenario_id": "math-question",
      "turns": [
        {
          "input": "What is 15 + 27?",
          "expected_response": "15 + 27 = 42"
        }
      ],
      "expected_trajectory": ["calculator"],
      "assertions": ["Agent used the calculator tool to compute the result"]
    },
    {
      "scenario_id": "weather-check",
      "turns": [
        {
          "input": "What's the weather?",
          "expected_response": "The weather is sunny"
        }
      ],
      "expected_trajectory": ["weather"],
      "assertions": ["Agent used the weather tool"]
    }
  ]
}
```
### Multi-turn example

Multi-turn scenarios have multiple turns per scenario. Turns execute sequentially within the same session, maintaining conversation context. Each turn can have its own `expected_response`, while `assertions` and `expected_trajectory` apply to the entire session:

```json
{
  "scenarios": [
    {
      "scenario_id": "math-then-weather",
      "turns": [
        {
          "input": "What is 15 + 27?",
          "expected_response": "15 + 27 = 42"
        },
        {
          "input": "What's the weather?",
          "expected_response": "The weather is sunny"
        }
      ],
      "expected_trajectory": ["calculator", "weather"],
      "assertions": [
        "Agent used the calculator tool for the math question",
        "Agent used the weather tool when asked about weather"
      ]
    }
  ]
}
```
### Scenario fields

Field | Required | Type | Constraints | Description  
---|---|---|---|---  
`scenario_id` |  Yes |  String |  Non-empty |  Unique identifier for the scenario.  
`turns` |  Yes |  List of objects |  Non-empty list |  List of turns in the conversation. Each turn has `input` (required) and `expected_response` (optional).  
`expected_trajectory` |  No |  List of strings |  |  Expected sequence of tool names. Used by trajectory evaluators (`Builtin.TrajectoryExactOrderMatch`, `Builtin.TrajectoryInOrderMatch`, `Builtin.TrajectoryAnyOrderMatch`).  
`assertions` |  No |  List of strings |  |  Natural language assertions about expected behavior. Used by `Builtin.GoalSuccessRate`.  
`metadata` |  No |  Object |  |  Arbitrary key-value metadata for the scenario.  
  
### Turn fields

Field | Required | Type | Constraints | Description  
---|---|---|---|---  
`input` |  Yes |  String or Object |  Non-empty |  The prompt sent to the agent for this turn. Can be a plain string (for example, `"What is my balance?"`) or a structured object (for example, `{"role": "user", "content": "What is my balance?"}`).  
`expected_response` |  No |  String |  |  The expected agent response for this turn. Used by `Builtin.Correctness`. Mapped positionally to the trace produced by this turn; turn 0 maps to trace 0, turn 1 maps to trace 1.  
  
## Simulated scenarios

A simulated scenario defines an actor profile and an initial input. The actor generates subsequent turns dynamically:

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
### Scenario fields

Field | Required | Type | Constraints | Description  
---|---|---|---|---  
`scenario_id` |  Yes |  String |  Non-empty |  Unique identifier for the scenario.  
`actor_profile` |  Yes |  Object |  Must contain `context` and `goal` |  The actor’s identity and objective, containing `context` (required), `goal` (required), and `traits` (optional). See [User simulation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./user-simulation.html>).  
`input` |  Yes |  String or Object |  Non-empty |  The first message sent to your agent to start the conversation. Typically a plain string, but can also be a structured object.  
`scenario_description` |  No |  String |  |  Optional metadata describing the scenario. Useful for organizing and identifying scenarios in results.  
`max_turns` |  No |  Integer |  Must be ≥ 1 |  Maximum number of turns before the conversation stops. Default: 10.  
`assertions` |  No |  List of strings |  |  Natural language assertions about expected behavior. Used by `Builtin.GoalSuccessRate`.  
`metadata` |  No |  Object |  |  Arbitrary key-value metadata for the scenario.  
  
###### Note

Simulated scenarios do not support `expected_trajectory` or per-turn `expected_response` because the conversation flow is not known in advance. Use `assertions` for ground truth with simulated scenarios.

## Ground truth mapping

Both runners automatically map dataset fields to the evaluators that use them:

Evaluator | Ground truth field | Level | Description  
---|---|---|---  
`Builtin.Correctness` |  `turns[].expected_response` |  Trace |  Measures how accurately the agent’s response matches the expected answer.  
`Builtin.GoalSuccessRate` |  `assertions` |  Session |  Validates whether the agent’s behavior satisfies natural language assertions.  
`Builtin.TrajectoryExactOrderMatch` |  `expected_trajectory` |  Session |  Checks that the actual tool call sequence matches exactly.  
`Builtin.TrajectoryInOrderMatch` |  `expected_trajectory` |  Session |  Checks that expected tools appear in order, allowing extras between them.  
`Builtin.TrajectoryAnyOrderMatch` |  `expected_trajectory` |  Session |  Checks that all expected tools are present, regardless of order.  
  
  * Ground truth fields are optional. Evaluators that do not use ground truth (for example, `Builtin.Helpfulness`, `Builtin.Faithfulness`) evaluate based on session content alone.

  * You can include all ground truth fields in a single dataset. Each runner routes the relevant fields to the appropriate evaluators.

  * If no ground truth fields are present, evaluators fall back to their ground truth-free mode.


For more details on ground truth fields and how they work with the Evaluate API, see [Ground truth evaluations](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./ground-truth-evaluations.html>).

## Inline dataset construction

Instead of loading from a JSON file, you can construct datasets directly in Python:

```python
from bedrock_agentcore.evaluation import Dataset, PredefinedScenario, Turn

dataset = Dataset(
    scenarios=[
        PredefinedScenario(
            scenario_id="math-question",
            turns=[
                Turn(
                    input="What is 15 + 27?",
                    expected_response="15 + 27 = 42",
                ),
            ],
            expected_trajectory=["calculator"],
            assertions=["Agent used the calculator tool"],
        ),
        PredefinedScenario(
            scenario_id="weather-check",
            turns=[
                Turn(input="What's the weather?"),
            ],
            expected_trajectory=["weather"],
        ),
    ]
)
```
Or load from a JSON file:

```python
from bedrock_agentcore.evaluation import FileDatasetProvider

dataset = FileDatasetProvider("dataset.json").get_dataset()
```
