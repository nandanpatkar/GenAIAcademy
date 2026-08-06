# Models and instructions - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-models.html

---

# Models and instructions

Define a harness once with defaults for model, system prompt, tools, memory, and execution limits. Override any of those on a single invocation when you want to experiment. The harness resource stays unchanged; only that call uses the overrides.

This is the core of the config-based model: **defaults at creation time, overrides at invocation time.** You can test N model/prompt/tool combinations in the time it would take to redeploy once.

###### Example

AWS CLI/boto3
    

Defaults on `create-harness`:

```bash
aws bedrock-agentcore-control create-harness \
  --harness-name "research-agent" \
  --execution-role-arn "arn:aws:iam::123456789012:role/MyHarnessRole" \
  --system-prompt '[{"text": "You are a research assistant."}]' \
  --tools '[{"type": "agentcore_browser", "name": "browser"}]'
```
Overrides per invocation:

```text
response = client.invoke_harness(
    harnessArn=HARNESS_ARN,
    runtimeSessionId=SESSION_ID,
    # These apply only to this call; the harness defaults stay intact
    model={"bedrockModelConfig": {"modelId": "us.anthropic.claude-opus-4-5-20251101-v1:0"}},
    systemPrompt=[{"text": "You are a terse research assistant. One paragraph answers only."}],
    tools=[
        {"type": "agentcore_browser", "name": "browser"},
        {"type": "agentcore_code_interpreter", "name": "code_interpreter"},
    ],
    messages=[{"role": "user", "content": [{"text": "Summarize this paper as a bullet list."}]}],
)
```
To change defaults permanently, use `update-harness`.

AgentCore CLI
    

Set defaults when you create or update the harness:

```bash
# Create a project if one does not already exist.
agentcore create

# Add a harness to the project
agentcore add harness \
  --name research-agent \
  --model-id us.anthropic.claude-sonnet-4-6-20250514-v1:0 \
  --system-prompt "You are a research assistant." \
  --tools agentcore-browser

agentcore deploy
```
Override on an invocation:

```bash
# Switch the model for one call
agentcore invoke --harness research-agent \
  --model-id us.anthropic.claude-opus-4-5-20251101-v1:0 \
  "Summarize this research paper"

# Swap tools for one call
agentcore invoke --harness research-agent \
  --tools agentcore-browser,code-interpreter \
  "Plot the citation counts as a bar chart"
```
Overridable at invoke time: `--model-id`, `--tools`, `--system-prompt`, `--max-iterations`, `--max-tokens`, `--harness-timeout`, `--skills`, `--allowed-tools`, `--actor-id`. Add `--verbose` to print raw streaming JSON events for debugging.

To change defaults permanently, edit `app/<name>/harness.json` and run `agentcore deploy`.

Interactive
    

Run `agentcore` in a project directory to open the TUI, select **add** , then choose **Harness** . The wizard walks you through model and instruction configuration step by step.

  1. Choose your model provider. Amazon Bedrock, OpenAI, Google Gemini, and any LiteLLM-compatible provider are supported, each with a default model.

![Add Harness wizard: select model provider](/agentcore/images/harness-model-01-provider.png)

  2. Choose the API format. For Amazon Bedrock and OpenAI, select **Converse Stream** (default), **Responses** , or **Chat Completions** . Responses and Chat Completions are served by Bedrock Mantle.

![Add Harness wizard: select API format](/agentcore/images/harness-model-03-api-format.png)

  3. If you select **LiteLLM** , the wizard prompts for the LiteLLM-specific fields - an optional API key ARN, an optional API base URL for OpenAI-compatible gateways, and optional additional parameters passed through to the provider.

![Add Harness wizard: LiteLLM API key ARN, API base, and additional params steps](/agentcore/images/harness-model-02-litellm-flow.png)


Continue through the remaining steps (environment, memory, advanced settings) and confirm. Then run `agentcore deploy` to apply.

## Use any model, switch mid-session

Use models from Amazon Bedrock, OpenAI, Google Gemini, or other providers through LiteLLM, including OpenAI-compatible endpoints. Switch providers between turns of the same session and the conversation continues. Context carries over.

If you don’t specify a model, the harness defaults to Anthropic’s Claude Sonnet 4.6 on Amazon Bedrock (`global.anthropic.claude-sonnet-4-6`) so you can get started immediately. You can change the default or override per invocation at any time.

Store third-party API keys in [AgentCore Identity’s](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity.html>) token vault as an API key credential provider. The harness pulls the key at invocation time. Your agent code never sees raw credentials.

###### Example

AWS CLI/boto3
    

Register an API key with [AgentCore Identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity.html>):

```bash
aws bedrock-agentcore-control create-api-key-credential-provider \
  --name my-openai-key \
  --api-key "$OPENAI_API_KEY"
```
Switch providers across turns of the same session:

```bash
# Turn 1: Bedrock (native Converse API)
response = client.invoke_harness(
    harnessArn=HARNESS_ARN,
    runtimeSessionId=SESSION_ID,
    model={"bedrockModelConfig": {"modelId": "us.anthropic.claude-sonnet-4-5-20250514-v1:0"}},
    messages=[{"role": "user", "content": [{"text": "Analyze this codebase."}]}],
)

# Turn 2: Bedrock Mantle (OpenAI Responses format, no API key needed)
response = client.invoke_harness(
    harnessArn=HARNESS_ARN,
    runtimeSessionId=SESSION_ID,
    model={
        "bedrockModelConfig": {
            "modelId": "openai.gpt-4o",
            "apiFormat": "responses",
            "additionalParams": {"reasoning": {"effort": "high"}},
        }
    },
    messages=[{"role": "user", "content": [{"text": "Now suggest fixes for the top three issues."}]}],
)

# Turn 3: OpenAI model via Bedrock Mantle (no API key needed)
response = client.invoke_harness(
    harnessArn=HARNESS_ARN,
    runtimeSessionId=SESSION_ID,
    model={
        "openAiModelConfig": {
            "modelId": "gpt-5.4",
            "apiFormat": "responses",
            "endpoint": {"bedrockMantle": {}},
        }
    },
    messages=[{"role": "user", "content": [{"text": "Summarize the fixes as a bullet list."}]}],
)
```
###### Tip

Use `openAiModelConfig` with `"endpoint": {"bedrockMantle": {}}` to call OpenAI models through Amazon Bedrock Mantle — no API key required, uses your execution role credentials. Use `openAiModelConfig` with `apiKeyArn` when calling the OpenAI endpoint directly.

AgentCore CLI
    

Add an API key to [AgentCore Identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity.html>):

```bash
agentcore add credential --type api-key --name my-openai-key --api-key $OPENAI_API_KEY
agentcore deploy
```
Invoke with Bedrock Mantle (Responses format, no API key needed):

```text
SESSION_ID="$(uuidgen)"

# Turn 1: Bedrock Mantle (Responses format)
agentcore invoke --harness my-agent \
  --model-id us.anthropic.claude-sonnet-4-5-20250514-v1:0 \
  --api-format responses \
  --session-id "$SESSION_ID" \
  "Analyze this codebase and identify performance bottlenecks."
```
Switch to OpenAI direct on the same session:

```bash
# Turn 2: OpenAI direct on the same session
agentcore invoke --harness my-agent \
  --model-provider open_ai \
  --model-id gpt-5.4 \
  --api-key-arn arn:aws:bedrock-agentcore:us-west-2:123456789012:token-vault/default/apikeycredentialprovider/my-openai-key \
  --session-id "$SESSION_ID" \
  "Now suggest fixes for the top three issues."
```
Learn more: [AgentCore Identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity.html>), [API key credential providers](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-api-key.html>).

### Select the model API format

The Amazon Bedrock and OpenAI model configurations each accept an optional `apiFormat` field that selects which API protocol the harness uses to call the model.

For `bedrockModelConfig`, `apiFormat` selects both the API protocol and the Amazon Bedrock endpoint the harness calls:

  * `converse_stream` \- the Amazon Bedrock Converse API, served by the `bedrock-runtime` endpoint. This is the default.

  * `responses` \- the OpenAI-compatible Responses API, served by the `bedrock-mantle` endpoint.

  * `chat_completions` \- the OpenAI-compatible Chat Completions API, served by the `bedrock-mantle` endpoint.


The `bedrock-mantle` endpoint supports a different set of models and capabilities than the default `bedrock-runtime` endpoint. For details, see [Endpoints supported by Amazon Bedrock](<https://docs.aws.amazon.com/bedrock/latest/userguide/endpoints.html>).

For `openAiModelConfig`, `apiFormat` can be one of:

  * `responses` \- the OpenAI Responses API. This is the default.

  * `chat_completions` \- the OpenAI Chat Completions API.


Both configurations also accept an optional `additionalParams` field. Provider-specific parameters in `additionalParams` are passed through to the model provider unchanged.

###### Important

Parameters in `additionalParams` can alter provider behavior including endpoint routing, credential handling, and region selection. If your application forwards caller-supplied model configuration to `InvokeHarness`, validate these fields before invocation. See [Shared responsibility model](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-security.html#harness-shared-responsibility>).

###### Example

AgentCore CLI
    

Set the API format when you create or update the harness with the `--api-format` flag:


```bash
# Bedrock model through the OpenAI-compatible Responses API (bedrock-mantle endpoint)
agentcore add harness --name research-agent \
  --model-provider bedrock \
  --model-id us.anthropic.claude-sonnet-4-5-20250514-v1:0 \
  --api-format responses
agentcore deploy
```
 
```bash
# OpenAI model using the Chat Completions API
agentcore add harness --name openai-agent \
  --model-provider open_ai \
  --model-id gpt-5.4 \
  --api-key-arn arn:aws:bedrock-agentcore:us-west-2:123456789012:token-vault/default/apikeycredentialprovider/my-openai-key \
  --api-format chat_completions
agentcore deploy
```
 

###### Note

`--api-format` accepts `converse_stream`, `responses`, or `chat_completions` for `--model-provider bedrock`, and `responses` or `chat_completions` for `--model-provider open_ai`. It does not apply to `gemini` or `lite_llm`.

### Apply Amazon Bedrock Guardrails

Use Amazon Bedrock Guardrails to filter harmful content or block denied topics in model inputs and outputs. To apply a guardrail to each model request, add a `guardrailConfig` object to `bedrockModelConfig.additionalParams`. The harness passes this object to Amazon Bedrock with each model request.

To use Amazon Bedrock Guardrails with the harness, configure `bedrockModelConfig` with the `converse_stream` API format. If you omit `apiFormat`, the harness uses `converse_stream` by default. Set this configuration in `CreateHarness` or `UpdateHarness`, or override it for one call in `InvokeHarness`.

The following Python example calls `InvokeHarness` with a guardrail configuration. Replace `HARNESS_ARN` with your harness ARN and `SESSION_ID` with a unique runtime session ID.

```python
import boto3

client = boto3.client("bedrock-agentcore")
response = client.invoke_harness(
    harnessArn=HARNESS_ARN,
    runtimeSessionId=SESSION_ID,
    model={
        "bedrockModelConfig": {
            "modelId": "us.amazon.nova-micro-v1:0",
            "apiFormat": "converse_stream",
            "additionalParams": {
                "guardrailConfig": {
                    "guardrailIdentifier": "arn:aws:bedrock:us-west-2:111122223333:guardrail/abc123def456",
                    "guardrailVersion": "1",
                    "trace": "enabled_full",
                }
            },
        }
    },
    messages=[{"role": "user", "content": [{"text": "Help me plan a trip."}]}],
)
```
For the baseline model permissions, see the [execution role policy](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-security.html#harness-execution-role-policy>). Add the following JSON statement to the harness execution role policy:

```json
{
  "Effect": "Allow",
  "Action": "bedrock:ApplyGuardrail",
  "Resource": "arn:aws:bedrock:us-west-2:111122223333:guardrail/abc123def456"
}
```
Use a guardrail in the same AWS Region as the model request. When a guardrail intervenes, the response stream reports `guardrail_intervened` as the stop reason.

For more information about guardrail configuration fields, see [Use a guardrail with the Converse API](<https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-use-converse-api.html>). For more information about IAM permissions, see [Set up permissions to use Amazon Bedrock Guardrails](<https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-permissions.html>).

### Use a model through LiteLLM

Use `liteLlmModelConfig` to reach any provider that [LiteLLM](<https://docs.litellm.ai/>) supports, including OpenAI-compatible endpoints. Set `modelId` to a LiteLLM provider-prefixed model ID, such as `gemini/gemini-2.5-pro` or `anthropic/claude-sonnet-4-6`.

Providers that authenticate with an API key (such as Google or Anthropic) require `apiKeyArn`. Amazon Bedrock models accessed with the `bedrock/` prefix use the harness execution role’s permissions and don’t need an API key.

  * `modelId` (required) - the LiteLLM provider-prefixed model ID.

  * `apiKeyArn` \- the ARN of the provider’s API key, stored in [AgentCore Identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity.html>) as an API key credential provider. The endpoint must accept this API key.

  * `apiBase` \- a custom endpoint URL for an OpenAI-compatible gateway, such as a proxy or self-hosted endpoint.

  * `additionalParams` \- provider-specific parameters passed through to LiteLLM unchanged. This includes parameters that can override endpoints (`aws_bedrock_runtime_endpoint`), assume IAM roles (`aws_role_name`), or alter request routing. See [Shared responsibility model](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-security.html#harness-shared-responsibility>).


`liteLlmModelConfig` also accepts the optional `maxTokens`, `temperature`, and `topP` fields.

###### Example

boto3
    

Configure a LiteLLM model:

```text
response = client.invoke_harness(
    harnessArn=HARNESS_ARN,
    runtimeSessionId=SESSION_ID,
    model={
        "liteLlmModelConfig": {
            "modelId": "gemini/gemini-2.5-pro",
            "apiKeyArn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:token-vault/default/apikeycredentialprovider/my-gemini-key",
        }
    },
    messages=[{"role": "user", "content": [{"text": "Summarize this paper."}]}],
)
```
AgentCore CLI
    

Configure a LiteLLM model with `--model-provider lite_llm`:

```bash
agentcore add harness --name research-agent \
  --model-provider lite_llm \
  --model-id gemini/gemini-2.5-pro \
  --api-key-arn arn:aws:bedrock-agentcore:us-west-2:123456789012:token-vault/default/apikeycredentialprovider/my-gemini-key
agentcore deploy
```
Reach an OpenAI-compatible gateway with `--api-base`, and pass provider-specific parameters with `--additional-params`:

```bash
agentcore add harness --name proxy-agent \
  --model-provider lite_llm \
  --model-id openai/gpt-5.4 \
  --api-base https://my-llm-gateway.example.com/v1 \
  --api-key-arn arn:aws:bedrock-agentcore:us-west-2:123456789012:token-vault/default/apikeycredentialprovider/my-gateway-key \
  --additional-params '{"timeout": 30}'
agentcore deploy
```
###### Note

`--api-base` and `--additional-params` apply only to `--model-provider lite_llm`. Amazon Bedrock models reached with the `bedrock/` prefix use the execution role’s permissions and don’t need `--api-key-arn`.

When your harness uses an API key credential provider, grant the execution role permission to read the key. See [Security and access controls](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-security.html>).

For additional information on harness configuration, see the [API Documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-get-started.html#api-documentation>)

#### Related topics

  * [Tools](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-tools.html>) \- connect tools to your harness

  * [Memory](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-memory.html>) \- persist conversations across sessions

  * [Control cost with limits](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-operations.html#harness-limits>) \- set execution limits and truncation strategies



