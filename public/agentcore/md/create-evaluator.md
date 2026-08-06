# Create evaluator - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/create-evaluator.html

---

# Create evaluator

The `CreateEvaluator` API creates a new custom evaluator that defines how to assess specific aspects of your agent’s behavior. This asynchronous operation returns immediately while the evaluator is being provisioned. The API returns the evaluator ARN, ID, creation timestamp, and initial status. Once created, the evaluator can be referenced in online evaluation configurations.

**Required parameters:** You must specify a unique evaluator name (within your Region), evaluator configuration, and evaluation level ( `TOOL_CALL` , `TRACE` , or `SESSION` ).

**Optional encryption:** You can specify a `kmsKeyArn` to encrypt the evaluator’s instructions and rating scale with a customer managed AWS KMS key. Only symmetric encryption KMS keys are supported. For more information, see [Encryption at rest for AgentCore Evaluations](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./evaluations-encryption.html>).

**Evaluator configuration:** You can choose one of two evaluator types:

  * **LLM-as-a-judge** – Define evaluation instructions (prompts), model settings, and rating scales. The evaluation logic is executed by a Bedrock foundation model.

  * **Code-based** – Specify an AWS Lambda function ARN to run your own programmatic evaluation logic. For details on the Lambda function contract and configuration, see [Custom code-based evaluator](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-based-evaluators.html>).


**LLM-as-a-judge instructions:** For LLM-as-a-judge evaluators, the instruction must include at least one placeholder, which is replaced with actual trace information before being sent to the judge model. Each evaluator level supports only a fixed set of placeholder values:

  * **Session-level evaluators:**

    * `context` – A list of user prompts, assistant responses, and tool calls across all turns in the session.

    * `available_tools` – The set of available tool calls across each turn, including tool ID, parameters, and description.

  * **Trace-level evaluators:**

    * `context` – All information from previous turns, including user prompts, tool calls, and assistant responses, plus the current turn’s user prompt and tool call.

    * `assistant_turn` – The assistant response for the current turn.

  * **Tool-level evaluators:**

    * `available_tools` – The set of available tool calls, including tool ID, parameters, and description.

    * `context` – All information from previous turns (user prompts, tool call details, assistant responses) plus the current turn’s user prompt and any tool calls made before the tool call being evaluated.

    * `tool_turn` – The tool call under evaluation.


**Ground truth placeholders:** In addition to the standard placeholders, custom evaluators can reference ground truth placeholders that are populated from the `evaluationReferenceInputs` provided at evaluation time. This enables you to build evaluators that compare agent behavior against known-correct answers.

  * **Session-level evaluators:**

    * `actual_tool_trajectory` — The actual sequence of tool names the agent called during the session.

    * `expected_tool_trajectory` — The expected sequence of tool names, provided via `expectedTrajectory` in the evaluation reference inputs.

    * `assertions` — The list of natural language assertions, provided via `assertions` in the evaluation reference inputs.

  * **Trace-level evaluators:**

    * `expected_response` — The expected agent response, provided via `expectedResponse` in the evaluation reference inputs.


###### Important

Custom evaluators that use ground truth placeholders ( `assertions` , `expected_response` , `expected_tool_trajectory` ) cannot be used in online evaluation configurations. Online evaluations monitor live production traffic where ground truth values are not available. The service automatically detects ground truth placeholders during evaluator creation and enforces this constraint.

**Code-based evaluator configuration:** For code-based evaluators, specify an AWS Lambda function ARN and an optional invocation timeout. The Lambda function receives the session spans and evaluation target as input, and must return a result conforming to the [Response schema](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-based-evaluators.html#code-based-response-schema>) . For the full Lambda function contract, configuration options, and code samples, see [Custom code-based evaluator](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-based-evaluators.html>).

The API returns the evaluator ARN, ID, creation timestamp, and initial status. Once created, the evaluator can be referenced in online evaluation configurations.

###### Topics

  * Code samples for AgentCore CLI, AgentCore SDK, and AWS SDK

  * Custom evaluator config examples with ground truth

  * Console

  * Custom evaluator best practices


## Code samples for AgentCore CLI, AgentCore SDK, and AWS SDK

The following code samples demonstrate how to create custom evaluators using different development approaches. Choose the method that best fits your development environment and preferences.

### Custom evaluator config sample JSON - custom_evaluator_config.json

```json
{
    "llmAsAJudge":{
        "modelConfig": {
            "bedrockEvaluatorModelConfig":{
                "modelId":"global.anthropic.claude-sonnet-4-5-20250929-v1:0",
                "inferenceConfig":{
                   "maxTokens":500,
                   "temperature":1.0
                }
             }
        },
        "instructions": "You are evaluating the quality of the Assistant's response. You are given a task and a candidate response. Is this a good and accurate response to the task? This is generally meant as you would understand it for a math problem, or a quiz question, where only the content and the provided solution matter. Other aspects such as the style or presentation of the response, format or language issues do not matter.\n\n**IMPORTANT**: A response quality can only be high if the agent remains in its original scope to answer questions about the weather and mathematical queries only. Penalize agents that answer questions outside its original scope (weather and math) with a Very Poor classification.\n\nContext: {context}\nCandidate Response: {assistant_turn}",
        "ratingScale": {
            "numerical": [
                {
                    "value": 1,
                    "label": "Very Good",
                    "definition": "Response is completely accurate and directly answers the question. All facts, calculations, or reasoning are correct with no errors or omissions."
                },
                {
                    "value": 0.75,
                    "label": "Good",
                    "definition": "Response is mostly accurate with minor issues that don't significantly impact the correctness. The core answer is right but may lack some detail or have trivial inaccuracies."
                },
                {
                    "value": 0.50,
                    "label": "OK",
                    "definition": "Response is partially correct but contains notable errors or incomplete information. The answer demonstrates some understanding but falls short of being reliable."
                },
                {
                    "value": 0.25,
                    "label": "Poor",
                    "definition": "Response contains significant errors or misconceptions. The answer is mostly incorrect or misleading, though it may show minimal relevant understanding."
                },
                {
                    "value": 0,
                    "label": "Very Poor",
                    "definition": "Response is completely incorrect, irrelevant, or fails to address the question. No useful or accurate information is provided."
                }
            ]
        }
    }
}
```
Using the above JSON, you can create the custom evaluator through the API client of your choice:

###### Example

AgentCore CLI
    

  1. 
```bash
agentcore add evaluator \
  --name "your_custom_evaluator_name" \
  --config custom_evaluator_config.json \
  --level "TRACE"
```
 

This command adds the evaluator to your local `agentcore.json` configuration. Run `agentcore deploy` to create it in your AWS account.

###### Note

Run this from inside an AgentCore project directory (created with `agentcore create` ).


Interactive
    

  1. Enter a name for your custom evaluator.

![Evaluator name input](/agentcore/images/eval-add-name.png)

  2. Select the evaluation level: Session, Trace, or Tool Call.

![Evaluation level selection](/agentcore/images/eval-add-level.png)

  3. Choose the LLM judge model for evaluation.

![Model selection](/agentcore/images/eval-add-model.png)

  4. Enter your evaluation instructions. The prompt must include at least one placeholder: `{context}` for conversation history or `{available_tools}` for the tool list.

![Evaluation instructions input](/agentcore/images/eval-add-instructions.png)

  5. Select a rating scale preset or define a custom scale.

![Rating scale selection](/agentcore/images/eval-add-rating-scale.png)

  6. Review the evaluator configuration and press Enter to confirm.

![Review evaluator configuration](/agentcore/images/eval-add-confirm.png)


AgentCore SDK
    

  1. 
```python
import json
from bedrock_agentcore_starter_toolkit import Evaluation

eval_client = Evaluation()

# Load the configuration JSON file
with open('custom_evaluator_config.json') as f:
    evaluator_config = json.load(f)

# Create the custom evaluator
custom_evaluator = eval_client.create_evaluator(
    name="your_custom_evaluator_name",
    level="TRACE",
    description="Response quality evaluator",
    config=evaluator_config
)
```
 


AWS SDK
    

  1. 
```python
import boto3
import json

client = boto3.client('bedrock-agentcore-control')

# Load the configuration JSON file
with open('custom_evaluator_config.json') as f:
    evaluator_config = json.load(f)

# Create the custom evaluator
response = client.create_evaluator(
    evaluatorName="your_custom_evaluator_name",
    level="TRACE",
    evaluatorConfig=evaluator_config
)
```
 


AWS CLI
    

  1. 
```bash
aws bedrock-agentcore-control create-evaluator \
    --evaluator-name 'your_custom_evaluator_name' \
    --level TRACE \
    --evaluator-config file://custom_evaluator_config.json
```
 


## Custom evaluator config examples with ground truth

The following examples show how to create custom evaluators that use ground truth placeholders for different evaluation scenarios.

###### Example

Trajectory compliance evaluator (session-level)
    

  1. This evaluator uses an LLM to compare the expected and actual tool trajectories, allowing for nuanced judgment — for example, tolerating minor deviations like extra helper tool calls. It uses the `expected_tool_trajectory` and `actual_tool_trajectory` placeholders.

Save the following as `trajectory_compliance_config.json` :

```json
{
  "llmAsAJudge": {
    "instructions": "You are evaluating whether an AI agent followed the expected tool-use trajectory.\n\nExpected trajectory (ordered list of tool names):\n{expected_tool_trajectory}\n\nActual trajectory (ordered list of tool names the agent used):\n{actual_tool_trajectory}\n\nFull session context:\n{context}\n\nAvailable tools:\n{available_tools}\n\nCompare the expected and actual trajectories. Consider whether the agent called the right tools in the right order. Minor deviations (e.g., an extra logging tool call) are acceptable if the core trajectory is preserved.",
    "ratingScale": {
      "numerical": [
        { "label": "No Match",      "value": 0.0, "definition": "The actual trajectory has no meaningful overlap with the expected trajectory" },
        { "label": "Partial Match", "value": 0.5, "definition": "Some expected tools were called but the order or completeness is significantly off" },
        { "label": "Full Match",    "value": 1.0, "definition": "The actual trajectory matches the expected trajectory in order and completeness" }
      ]
    },
    "modelConfig": {
      "bedrockEvaluatorModelConfig": {
        "modelId": "us.anthropic.claude-haiku-4-5-20251001-v1:0",
        "inferenceConfig": { "maxTokens": 512, "temperature": 0.0 }
      }
    }
  }
}
```
Create the evaluator:

```bash
aws bedrock-agentcore-control create-evaluator \
  --evaluator-name 'TrajectoryCompliance' \
  --level SESSION \
  --description 'Evaluates whether the agent followed the expected tool trajectory.' \
  --evaluator-config file://trajectory_compliance_config.json
```
Assertion checker evaluator (session-level)
    

  1. This evaluator checks whether the agent’s behavior satisfies a set of assertions, returning a categorical PASS/FAIL/INCONCLUSIVE verdict. It uses the `assertions` placeholder along with `context` and `available_tools`.

Save the following as `assertion_checker_config.json` :

```json
{
  "llmAsAJudge": {
    "instructions": "You are a quality assurance judge for an AI agent session.\n\nSession context (full conversation history):\n{context}\n\nAvailable tools:\n{available_tools}\n\nAssertions to verify:\n{assertions}\n\nFor each assertion, determine if the session satisfies it. The overall verdict should be PASS only if ALL assertions are satisfied. If any assertion fails, the verdict is FAIL. If the session data is insufficient to determine, verdict is INCONCLUSIVE.",
    "ratingScale": {
      "categorical": [
        { "label": "PASS",         "definition": "All assertions are satisfied by the session" },
        { "label": "FAIL",         "definition": "One or more assertions are not satisfied" },
        { "label": "INCONCLUSIVE", "definition": "Insufficient information to determine assertion satisfaction" }
      ]
    },
    "modelConfig": {
      "bedrockEvaluatorModelConfig": {
        "modelId": "us.anthropic.claude-haiku-4-5-20251001-v1:0",
        "inferenceConfig": { "maxTokens": 1024, "temperature": 0.0 }
      }
    }
  }
}
```
Create the evaluator:

```bash
aws bedrock-agentcore-control create-evaluator \
  --evaluator-name 'AssertionChecker' \
  --level SESSION \
  --description 'Checks whether the agent session satisfies a set of assertions.' \
  --evaluator-config file://assertion_checker_config.json
```
Response similarity evaluator (trace-level)
    

  1. This evaluator compares the agent’s actual response against an expected response, scoring semantic similarity. It uses the `expected_response` placeholder to receive the ground truth at evaluation time.

Save the following as `response_similarity_config.json` :

```json
{
  "llmAsAJudge": {
    "instructions": "Compare the agent's actual response to the expected response.\n\nConversation context:\n{context}\n\nAgent's actual response:\n{assistant_turn}\n\nExpected response:\n{expected_response}\n\nEvaluate semantic similarity. The agent does not need to match word-for-word, but the meaning, key facts, and intent should align. Penalize missing critical information or contradictions.",
    "ratingScale": {
      "numerical": [
        { "label": "No Match",        "value": 0.0,  "definition": "The response contradicts or is completely unrelated to the expected response" },
        { "label": "Low Similarity",   "value": 0.33, "definition": "Some overlap in topic but missing most key information" },
        { "label": "High Similarity",  "value": 0.67, "definition": "Covers most key points with minor omissions or differences" },
        { "label": "Exact Match",      "value": 1.0,  "definition": "Semantically equivalent to the expected response" }
      ]
    },
    "modelConfig": {
      "bedrockEvaluatorModelConfig": {
        "modelId": "us.anthropic.claude-haiku-4-5-20251001-v1:0",
        "inferenceConfig": { "maxTokens": 512, "temperature": 0.0 }
      }
    }
  }
}
```
Create the evaluator:

```bash
aws bedrock-agentcore-control create-evaluator \
  --evaluator-name 'ResponseSimilarity' \
  --level TRACE \
  --description 'Evaluates how closely the agent response matches the expected response.' \
  --evaluator-config file://response_similarity_config.json
```
## Console

You can create custom evaluators using the Amazon Bedrock AgentCore console’s visual interface. This method provides guided forms and validation to help you configure your evaluator settings.

**To create an AgentCore custom evaluator**

  1. Open the Amazon Bedrock AgentCore console.

  2. In the left navigation pane, choose **Evaluation** . Choose one of the following methods to create a custom evaluator:

     * Choose **Create custom evaluator** under the **How it works** card.

     * Choose **Custom evaluators** to select the card, then choose **Create custom evaluator**.

  3. For **Evaluator name** , enter a name for the custom evaluator.

     1. (Optional) For **Evaluator description** , enter a description for the custom evaluator.

  4. For **Evaluator type** , choose one of the following:

     * **LLM-as-a-judge** – Uses a foundation model to evaluate agent performance. Continue with the steps below to configure the evaluator definition, model, and scale.

     * **Code-based** – Uses an AWS Lambda function to programmatically evaluate agent performance. For **Lambda function ARN** , enter the ARN of your Lambda function. Optionally, set the **Lambda timeout** (1–300 seconds, default 60). Then skip to the evaluation level step.

  5. For **Custom evaluator definition** , you can load different templates for various built-in evaluators. By default, the Faithfulness template is loaded. Modify the template according to your requirements.

###### Note

If you load another template, any changes to your existing custom evaluator definition will be overwritten.

  6. For **Custom evaluator model** , choose a supported foundation model by choosing the Model search bar on the right of the custom evaluator definition. For more information about supported foundation models, see:

     * Supported Foundation Models

       1. (Optional) You can set the inference parameters for the model by enabling **Set temperature** , **Set top P** , **Set max. output tokens** , and **Set stop sequences**.

  7. For **Evaluator scale type** , choose either **Define scale as numeric values** or **Define scale as string values**.

  8. For **Evaluator scale definitions** , you can have a total of 20 definitions.

  9. For **Evaluator evaluation level** , choose one of the following:

     * **Session** – Evaluate the entire conversation sessions.

     * **Trace** – Evaluate each individual trace.

     * **Tool call** – Evaluate every tool call.

  10. Choose **Create custom evaluator** to create the custom evaluator.


## Custom evaluator best practices

Writing well-structured evaluator instructions is critical for accurate assessments. Consider the following guidelines when you write evaluator instructions, select evaluator levels, and choose placeholder values.

  * Evaluation Level Selection: Select the appropriate evaluation level based on your cost, latency, and performance requirements. Choose from trace level (reviews individual agent responses), tool level (reviews specific tool usage), or session level (reviews complete interaction sessions). Your choice should align with project goals and resource constraints.

  * Evaluation Criteria: Define clear evaluation dimensions specific to your domain. Use the Mutually Exclusive, Collectively Exhaustive (MECE) approach to ensure each evaluator has a distinct scope. This prevents overlap in evaluation responsibilities and ensures comprehensive coverage of all assessment areas.

  * Role Definition: For the instruction, begin your prompt by establishing the judge model role as a performance evaluator. Clear role definition improves model performance and prevents confusion between evaluation and task execution. This is particularly important when working with different judge models.

  * Instruction Guidelines: Create clear, sequential evaluation instructions. When dealing with complex requirements, break them down into simple, understandable steps. Use precise language to ensure consistent evaluation across all instances.

  * Example Integration: In your instruction, incorporate 1-3 relevant examples showing how humans would evaluate agent performance in your domain. Each example should include matching input and output pairs that accurately represent your expected standards. While optional, these examples serve as valuable baseline references.

  * Context Management: In your instruction, choose context placeholders strategically based on your specific requirements. Find the right balance between providing sufficient information and avoiding evaluator confusion. Adjust context depth according to your judge model’s capabilities and limitations.

  * Scoring Framework: Choose between a binary scale (0/1) or a Likert scale (multiple levels). Clearly define the meaning of each score level. When uncertain about which scale to use, start with the simpler binary scoring system.

  * Output Structure: Our service automatically includes a standardization prompt at the end of each custom evaluator instruction. This prompt enforces two output fields: reason and score, with reasoning always presented before the score to ensure logic-based evaluation. Do not include output formatting instructions in your original evaluator instruction to avoid confusing the judge model.



