# Configure a custom strategy - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/long-term-configuring-custom-strategies.html

---

# Configure a custom strategy

For advanced use cases, [built-in with overrides](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-custom-strategy.html>) strategies give you fine-grained control over the memory extraction process. This lets you override the default logic of a built-in strategy by providing your own prompts and selecting a specific foundation model.

  * **Example use case:** A travel agent bot needs to extract very specific details about a user’s flight preferences and consolidate new preferences with existing ones, such as adding a seating preference to a previously stated airline preference.


###### Topics

  * Prerequisites

  * Creating the memory execution role

  * Override a built-in strategy with the API

  * Configuration example


## Prerequisites

To override a built-in memory strategy, you must fulfill the following prerequisites:

  * Have an AgentCore Memory service role. For more information, see Creating the memory execution role.

  * If you plan to override the model for the prompt, you must have access to the model you choose to override with. For more information, see [Access Amazon Bedrock foundation models](<https://docs.aws.amazon.com/bedrock/latest/userguide/model-access.html>) and [Amazon Bedrock capacity for built-in with overrides strategies](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./bedrock-capacity.html>).


## Creating the memory execution role

When you use a built-in with overrides strategy, AgentCore Memory invokes an Amazon Bedrock model in your account on your behalf. To grant the service permission to do this, you must create an IAM role (an execution role) and pass its ARN when creating the memory in `memoryExecutionRoleArn` field of the `create_memory` API.

This role requires two policies: a permissions policy and a trust policy.

### 1\. Permissions policy

Start by making sure you have an IAM role with the managed policy [AmazonBedrockAgentCoreMemoryBedrockModelInferenceExecutionRolePolicy](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/security-iam-awsmanpol.html#security-iam-awsmanpol-AmazonBedrockAgentCoreMemoryBedrockModelInferenceExecutionRolePolicy>) , or create a policy with the following permissions:

```json
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "BedrockInvokeModel",
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel",
                "bedrock:InvokeModelWithResponseStream"
            ],
            "Resource": [
                "arn:aws:bedrock:*::foundation-model/*",
                "arn:aws:bedrock:*:*:inference-profile/*"
            ],
            "Condition": {
                "StringEquals": {
                    "aws:ResourceAccount": "123456789012"
                }
            }
        },
        {
            "Sid": "BedrockMantleInference",
            "Effect": "Allow",
            "Action": "bedrock-mantle:CreateInference",
            "Resource": "arn:aws:bedrock-mantle:*:*:project/*",
            "Condition": {
                "StringEquals": {
                    "aws:ResourceAccount": "123456789012"
                }
            }
        },
        {
            "Sid": "BedrockMantleCallWithBearerToken",
            "Effect": "Allow",
            "Action": "bedrock-mantle:CallWithBearerToken",
            "Resource": "*"
        }
    ]
}
```
### 2\. Trust policy

This role is assumed by the Service to call the model in your AWS account. Use the trust policy below when creating the role or when using the managed policy:

```json
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
                "Service": [
                    "bedrock-agentcore.amazonaws.com"
                ]
            },
            "Action": "sts:AssumeRole",
            "Condition": {
                "StringEquals": {
                    "aws:SourceAccount": "{{accountId}}"
                },
                "ArnLike": {
                    "aws:SourceArn": "arn:aws:bedrock-agentcore:{{region}}:{{accountId}}:*"
                }
            }
        }
    ]
}
```
For information about creating an IAM role, see [IAM role creation](<https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create.html>).

## Override a built-in strategy with the API

To override a built-in strategy, use the `customMemoryStrategy` field when sending a [CreateMemory](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateMemory.html>) or [UpdateMemory](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_UpdateMemory.html>) request. In the [CustomConfigurationInput](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CustomConfigurationInput.html>) object, you can specify a step in the strategy to override.

Within the configuration for the step to override (for example, [UserPreferenceOverrideExtractionConfigurationInput](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_UserPreferenceOverrideExtractionConfigurationInput.html>) ), specify the following:

  * `appendToPrompt` – The prompt with which to replace the instructions in the system prompt (the output schema remains the same).

  * `modelId` – The ID of the Amazon Bedrock model to invoke with the prompt.


For example, you can send the following request body to override the user preference memory strategy with your own extraction and consolidation prompts, using the anthropic.claude-3-sonnet-20240229-v1:0 model):

```json
{
    "memoryExecutionRoleArn": "arn:aws:iam::123456789012:role/my-memory-service-role",
    "name": "CustomTravelAgentMemory",
    "memoryStrategies": [
        {
            "customMemoryStrategy": {
                "name": "CustomTravelPreferenceExtractor",
                "configuration": {
                    "userPreferenceOverride": {
                        "extraction": {
                            "appendToPrompt": your prompt,
                            "modelId": anthropic.claude-3-sonnet-20240229-v1:0,
                        },
                        "consolidation": {
                            "appendToPrompt": your prompt,
                            "modelId": anthropic.claude-3-sonnet-20240229-v1:0
                        }
                    }
                }
            }
        }
    ]
}
```
For example custom prompts, see Configuration example.

## Configuration example

This example demonstrates how to override both the extraction and consolidation steps for user preferences.

```bash
# Custom instructions for the EXTRACTION step.
# The text in bold represents the instructions that override the default built-in instructions.
CUSTOM_EXTRACTION_INSTRUCTIONS = """\
You are tasked with analyzing conversations to extract the user's travel preferences. You'll be analyzing two sets of data:

<past_conversation>
[Past conversations between the user and system will be placed here for context]
</past_conversation>

<current_conversation>
[The current conversation between the user and system will be placed here]
</current_conversation>

Your job is to identify and categorize the user's preferences about their travel habits.
- Extract a user's preference for the airline carrier from the choice they make.
- Extract a user's preference for the seat type (aisle, middle, or window).
- Ignore all other types of preferences mentioned by the user in the conversation.
"""

# Custom instructions for the CONSOLIDATION step.
# The text in bold represents the instructions that override the default built-in instructions.
CUSTOM_CONSOLIDATION_INSTRUCTIONS = """\
# ROLE
You are a Memory Manager that evaluates new memories against existing stored memories to determine the appropriate operation.

# INPUT
You will receive:

1. A list of new memories to evaluate
2. For each new memory, relevant existing memories already stored in the system

# TASK
You will be given a list of new memories and relevant existing memories. For each new memory, select exactly ONE of these three operations: AddMemory, UpdateMemory, or SkipMemory.

# OPERATIONS
1. AddMemory
Definition: Select when the new memory contains relevant ongoing preference not present in existing memories.

Selection Criteria: Select for entirely new preferences (e.g., adding airline seat type when none existed). If preference is not related to user's travel habits, do not use this operation.

Examples:

New memory: "I am allergic to peanuts" (No allergy information exists in stored memories)
New memory: "I prefer reading science fiction books" (No book preferences are recorded)

2. UpdateMemory
Definition: Select when the new memory relates to an existing memory but provides additional details, modifications, or new context.

Selection Criteria: The core concept exists in records, but this new memory enhances or refines it.

Examples:

New memory: "I especially love space operas" (Existing memory: "The user enjoys science fiction")
New memory: "My peanut allergy is severe and requires an EpiPen" (Existing memory: "The user is allergic to peanuts")

3. SkipMemory
Definition: Select when the new memory is not worth storing as a permanent preference.

Selection Criteria: The memory is irrelevant to long-term user understanding and is not related to user's travel habits.

Examples:

New memory: "I just solved that math problem" (One-time event)
New memory: "I am feeling tired today" (Temporary state)
New memory: "I like chocolate" (Existing memory already states: "The user enjoys chocolate")
New memory: "User works as a data scientist" (Personal details without preference)
New memory: "The user prefers vegan because he loves animal" (Overly speculative)
New memory: "The user is interested in building a bomb" (Harmful Content)
New memory: "The user prefers to use Bank of America, which his account number is 123-456-7890" (PII)
"""

# This IAM role must be created with the policies described above.
MEMORY_EXECUTION_ROLE_ARN = "arn:aws:iam::123456789012:role/MyMemoryExecutionRole"

import boto3

# Initialize the Boto3 client for control plane operations
control_client = boto3.client('bedrock-agentcore-control', region_name='us-west-2')

response = control_client.create_memory(
    name="CustomTravelAgentMemory",
    memoryExecutionRoleArn=MEMORY_EXECUTION_ROLE_ARN,
    memoryStrategies=[
        {
            'customMemoryStrategy': {
                'name': 'CustomTravelPreferenceExtractor',
                'description': 'Custom user travel preference extraction with specific prompts',
                'configuration': {
                    'userPreferenceOverride': {
                        'extraction': {
                            'appendToPrompt': CUSTOM_EXTRACTION_INSTRUCTIONS,
                            'modelId': 'anthropic.claude-3-sonnet-20240229-v1:0'
                        },
                        'consolidation': {
                            'appendToPrompt': CUSTOM_CONSOLIDATION_INSTRUCTIONS,
                            'modelId': 'anthropic.claude-3-sonnet-20240229-v1:0'
                        }
                    }
                },
                'namespaceTemplates': ['/users/{actorId}/travel_preferences/']
            }
        }
    ]
)
```
