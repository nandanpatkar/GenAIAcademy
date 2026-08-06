# Customize a built-in strategy or create your own strategy - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-custom-strategy.html

---

# Customize a built-in strategy or create your own strategy

For advanced or domain-specific use cases, you can create a built-in with overrides strategy to gain fine-grained control over the long-term memory process. Built-in with overrides strategies let you override the default behavior of the built-in strategies by providing your own instructions and selecting a specific foundation model for the extraction and consolidation steps.

## When to use a built-in with overrides strategy

Choose a built-in with overrides strategy when you need to tailor the memory logic to your specific requirements. Common use cases include:

  * **Domain-specific extraction:** Constraining the strategy to extract only certain types of information. For example, capturing a user’s food and dietary preferences while ignoring their preferences for clothing.

  * **Controlling granularity:** Adjusting the level of detail in the extracted memory. For example, instructing the summary strategy to only save high-level key points rather than a detailed narrative.

  * **Model selection:** Using a specific foundation model that is better suited for your particular domain or task, such as a model fine-tuned for financial or legal text.


## How to customize a strategy

To override a built-in strategy with a custom configuration, you specify the configuration when you use the [CreateMemory](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateMemory.html>) operation or the [UpdateMemory](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_UpdateMemory.html>) operation. You can override the following:

  * The instructions in the system prompt (however, the output schema remains the same). To create an effective custom prompt, you should first understand the default prompts. For more information, see the system prompt section for each [built-in strategy](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./built-in-strategies.html>).

  * The Amazon Bedrock model with which to invoke the prompt. For more information, see [Add or remove access to Amazon Bedrock foundation models](<https://docs.aws.amazon.com/bedrock/latest/userguide/model-access-modify.html>) . For more information about obtaining sufficient Amazon Bedrock capacity, see [Amazon Bedrock capacity for built-in with overrides strategies](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./bedrock-capacity.html>).


The following table shows the steps you can override for each memory strategy:

Strategy | Steps you can override  
---|---  
Semantic |  Extraction Consolidation  
Summary |  Consolidation  
User preference |  Extraction Consolidation  
Episodic |  Extraction Consolidation Reflection  
  
###### Note

You can also override with a self-managed strategy. For more information, see [Self-managed strategy](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-self-managed-strategies.html>).

## How to customize a strategy

For example, you can modify the extraction instruction for semantic memory strategy to add new instructions when customizing it.

**Built-in semantic memory strategy instructions**

The following shows the built-in instructions for the semantic memory strategy:

```text
You are a long-term memory extraction agent supporting a lifelong learning system. Your
task is to identify and extract meaningful information about the users from a given
list of messages.

Analyze the conversation and extract structured information about the user according to
the schema below. Only include details that are explicitly stated or can be logically
inferred from the conversation.

- Extract information ONLY from the user messages. You should use assistant messages
only as supporting context.
- If the conversation contains no relevant or noteworthy information, return an empty
list.

- Do NOT extract anything from prior conversation history, even if provided. Use it
solely for context.
- Do NOT incorporate external knowledge.
- Avoid duplicate extractions.

IMPORTANT: Maintain the original language of the user's conversation. If the user
communicates in a specific language, extract and format the extracted information
in that same language.
```
You could append a new rule to these instructions, such as:

```text
- Focus exclusively on extracting facts related to travel and booking preferences.
```
or edit an existing rule such as:

```yaml
IMPORTANT: Always extract memories in English irrespective of the original language of the user's conversation.
```
## Best practices for customization

  * **Build upon existing instructions:** We strongly recommend you use the built-in strategies instructions as a starting point. The base structure and instructions are critical to the memory functionality. You should add your task-specific guidance to the existing instructions rather than writing entirely new ones from scratch.

  * **Provide clear instructions:** The content of `appendToPrompt` replaces the default instructions in the system prompt. Make sure your instructions are logical and complete, as empty or poorly formed instructions can lead to undesirable results.


## Important considerations

To maintain the reliability of the memory pipeline, please adhere to the following guidelines:

  * **Do not modify schemas in prompts:** You should only add or modify instructions that guide _how_ memories are extracted or consolidated. Do not attempt to alter the conversation or memory schema definitions within the prompt itself, as this can cause unexpected failures.

  * **Do not rename consolidation operations:** When customizing a consolidation prompt, do not change the operation names (e.g., `AddMemory` , `UpdateMemory` ). Altering these names will cause the long-term memory pipeline to fail.

  * **Output schema is not editable:** built-in with overrides strategies do not let you change the final output schema of the extracted or consolidated memory. The output schema that will be added to the system prompt for the built-in with overrides strategy will be same as the built-in strategies. For information about the output schemas, see the following:

    * [System prompt for semantic memory strategy](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-system-prompt.html>)

    * [System prompt for user preference memory strategy](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-user-prompt.html>)

    * [System prompt for summary strategy](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-summary-prompt.html>)


For full control over the end-to-end memory process, including the output schema, see [Self-managed strategy](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-self-managed-strategies.html>).

## Execution role

When using built-in with overrides strategies you are also required to provide a `memoryExecutionRoleArn` in the `CreateMemory` API. Bedrock Amazon Bedrock AgentCore will assume this role to call the bedrock models in your AWS account for extraction and consolidation.

###### Note

When using built-in with overrides strategies, the LLM usage for extraction and consolidation will be charged separately to your AWS account, and additional charges may apply.

