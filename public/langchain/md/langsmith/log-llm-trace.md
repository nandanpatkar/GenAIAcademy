When you call an LLM directly, outside of [LangChain](lc:oss/python/langchain/overview) or a LangSmith [supported integration](lc:langsmith/integrations), you need to provide specific metadata so that LangSmith can display token counts, calculate costs, and let you open the [run](lc:langsmith/observability-concepts#runs) in the [Playground](lc:langsmith/prompt-engineering-concepts#playground) with the correct provider and model.

There are four requirements for a fully functional LLM trace:

| Requirement | What to do | Enables |
|---|---|---|
| 1. Set [`run_type="llm"`](lc:langsmith/run-data-format#run-types) | Pass `run_type="llm"` to `@traceable` | LLM-specific rendering, token/cost display |
| 2. Format inputs/outputs | Use OpenAI, Anthropic, or LangChain message format | Structured message rendering, Playground support |
| 3. Set `ls_provider` and `ls_model_name` | Pass both in `metadata` | Cost tracking, Playground model selection |
| 4. Provide token counts | Set `usage_metadata` on the run | Token counts and cost calculation |


> [!NOTE]
>
> If you are using LangChain OSS, the [OpenAI wrapper](lc:langsmith/trace-openai), or the [Anthropic wrapper](lc:langsmith/trace-anthropic), these details are handled automatically.
>
> The examples on this page use the `traceable` decorator/wrapper (the recommended approach for Python and JS/TS). The same requirements apply if you use the [RunTree](lc:langsmith/annotate-code#use-the-runtree-api) or [API](lc:langsmith/smith-api-ref) directly.


## Messages format

When tracing a custom model or a custom input/output format, it must either follow the LangChain format, OpenAI completions format or Anthropic messages format. For more details,  refer to the [OpenAI Chat Completions](https://platform.openai.com/docs/api-reference/chat/create) or [Anthropic Messages](https://platform.claude.com/docs/en/api/messages) documentation. The LangChain format is:

 

> [!DETAILS] LangChain format
>
> - **** (): 
>   A list of messages containing the content of the conversation.
>
>
>   Identifies the message type. One of: <code>system</code> | <code>reasoning</code> | <code>user</code> | <code>assistant</code> | <code>tool</code>
>
>     - **** (): 
>       Content of the message. List of typed dictionaries.
>
>       
>
>           One of: <code>text</code> | <code>image</code> | <code>file</code> | <code>audio</code> | <code>video</code> | <code>tool_call</code> | <code>server_tool_call</code> | <code>server_tool_result</code>.
>
>
>         
>           - **** (): 
>
>             Text content.
>
>
>         - **** (): 
>             List of annotations for the text
>
>
>         - **** (): 
>             Additional provider-specific data.


        

> [!DETAILS] reasoning
>
> - **** (): 
>
>             Text content.
>
>
>         - **** (): 
>             Additional provider-specific data.


        

> [!DETAILS] image
>
> - **** (): 
>
>             URL pointing to the image location.
>
>
>         - **** (): 
>             Base64-encoded image data.
>
>
>           - **** (): 
>             Reference ID to an externally stored image (e.g., in a provider’s file system or in a bucket).
>
>
>           - **** (): 
>             Image [MIME type](https://www.iana.org/assignments/media-types/media-types.xhtml#image) (e.g., `image/jpeg`, `image/png`).


        

> [!DETAILS] file (e.g., PDFs)
>
> - **** (): 
>
>             URL pointing to the file.
>
>
>         - **** (): 
>             Base64-encoded file data.
>
>
>           - **** (): 
>             Reference ID to an externally stored file (e.g., in a provider’s file system or in a bucket).
>
>
>           - **** (): 
>             File [MIME type](https://www.iana.org/assignments/media-types/media-types.xhtml#image) (e.g., `application/pdf`).


        

> [!DETAILS] audio
>
> - **** (): 
>
>             URL pointing to the audio file.
>
>
>         - **** (): 
>             Base64-encoded audio data.
>
>
>           - **** (): 
>             Reference ID to an externally stored audio file (e.g., in a provider’s file system or in a bucket).
>
>
>           - **** (): 
>             Audio [MIME type](https://www.iana.org/assignments/media-types/media-types.xhtml#image) (e.g., `audio/mpeg`, `audio/wav`).


        

> [!DETAILS] video
>
> - **** (): 
>
>             URL pointing to the video file.
>
>
>         - **** (): 
>             Base64-encoded video data.
>
>
>           - **** (): 
>             Reference ID to an externally stored video file (e.g., in a provider’s file system or in a bucket).
>
>
>           - **** (): 
>             Video [MIME type](https://www.iana.org/assignments/media-types/media-types.xhtml#image) (e.g., `video/mp4`, `video/webm`).


        

> [!DETAILS] tool_call
>
> - **** (): 
>
>
>             Arguments to pass to the tool.
>
>
>           - **** (): 
>             Unique identifier for this tool call.


        

> [!DETAILS] server_tool_call
>
> - **** (): 
>
>             Unique identifier for this tool call.
>
>
>           - **** (): 
>             The name of the tool to be called.
>
>
>           - **** (): 
>             Arguments to pass to the tool.


        

> [!DETAILS] server_tool_result
>
> - **** (): 
>
>             Identifier of the corresponding server tool call.
>
>
>           - **** (): 
>             Unique identifier for this tool call.
>
>
>         - **** (): 
>             Execution status of the server-side tool. One of: <code>success</code> | <code>error</code>.
>
>
>
>             Output of the executed tool.


      

    

    - **** (): 
    Must match the <code>id</code> of a prior <code>assistant</code> message’s <code>tool_calls[i]</code> entry. Only valid when <code>role</code> is <code>tool</code>.
    

    - **** (): 
    Use this field to send token counts and/or costs with your model's output. See [Provide token and cost information](lc:langsmith/log-llm-trace#provide-token-and-cost-information) for more details.
    


```lc-tabs
[
 {
  "label": "Text and reasoning",
  "lang": "python",
  "code": " inputs = {\n  \"messages\": [\n    {\n      \"role\": \"user\",\n      \"content\": [\n        {\n          \"type\": \"text\",\n          \"text\": \"Hi, can you tell me the capital of France?\"\n        }\n      ]\n    }\n  ]\n}\n\noutputs = {\n  \"messages\": [\n    {\n      \"role\": \"assistant\",\n      \"content\": [\n        {\n          \"type\": \"text\",\n          \"text\": \"The capital of France is Paris.\"\n        },\n        {\n          \"type\": \"reasoning\",\n          \"text\": \"The user is asking about...\"\n        }\n      ]\n    }\n  ]\n}"
 },
 {
  "label": "Tool calls",
  "lang": "python",
  "code": "input = {\n  \"messages\": [\n    {\n      \"role\": \"user\",\n      \"content\": [\n        {\n          \"type\": \"text\",\n          \"text\": \"What's the weather in San Francisco?\"\n        }\n      ]\n    }\n  ]\n}\n\noutputs = {\n  \"messages\": [\n    {\n      \"role\": \"assistant\",\n      \"content\": [{\"type\": \"tool_call\", \"name\": \"get_weather\", \"args\": {\"city\": \"San Francisco\"}, \"id\": \"call_1\"}],\n    },\n    {\n      \"role\": \"tool\",\n      \"tool_call_id\": \"call_1\",\n      \"content\": [\n        {\n          \"type\": \"text\",\n          \"text\": \"{\\\"temperature\\\": \\\"18\u00b0C\\\", \\\"condition\\\": \\\"Sunny\\\"}\"\n        }\n      ]\n    },\n    {\n      \"role\": \"assistant\",\n      \"content\": [\n        {\n          \"type\": \"text\",\n          \"text\": \"The weather in San Francisco is 18\u00b0C and sunny.\"\n        }\n      ]\n    }\n  ]\n}"
 },
 {
  "label": "Multimodal",
  "lang": "python",
  "code": "inputs = {\n  \"messages\": [\n    {\n      \"role\": \"user\",\n      \"content\": [\n        {\n          \"type\": \"text\",\n          \"text\": \"What breed is this dog?\"\n        },\n        {\n          \"type\": \"image\",\n          \"url\": \"https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U\",\n          # alternative to a url, you can provide a base64 encoded image\n          # \"base64\": \"<base64 encoded image>\",\n          \"mime_type\": \"image/jpeg\",\n        }\n      ]\n    }\n  ]\n}\n\noutputs = {\n  \"messages\": [\n    {\n      \"role\": \"assistant\",\n      \"content\": [\n        {\n          \"type\": \"text\",\n          \"text\": \"This looks like a Black Labrador.\"\n        }\n      ]\n    }\n  ]\n}"
 },
 {
  "label": "Server-side tool calls",
  "lang": "python",
  "code": "input = {\n  \"messages\": [\n    {\n      \"role\": \"user\",\n      \"content\": [\n        {\n          \"type\": \"text\",\n          \"text\": \"What is the price of AAPL?\"\n        }\n      ]\n    }\n  ]\n}\n\noutput = {\n  \"messages\": [\n    {\n      \"role\": \"assistant\",\n      \"content\": [\n        {\n          \"type\": \"server_tool_call\",\n          \"name\": \"web_search\",\n          \"args\": {\n            \"query\": \"price of AAPL\",\n            \"type\": \"search\"\n          },\n          \"id\": \"call_1\"\n        },\n        {\n          \"type\": \"server_tool_result\",\n          \"tool_call_id\": \"call_1\",\n          \"status\": \"success\"\n        },\n        {\n          \"type\": \"text\",\n          \"text\": \"The price of AAPL is $150.00\"\n        }\n      ]\n    }\n  ]\n}"
 }
]
```

## Convert custom I/O formats into LangSmith compatible formats

If you're using a custom input or output format, you can convert it to a LangSmith compatible format using `process_inputs`/`processInputs` and `process_outputs`/`processOutputs` functions on the [`@traceable` decorator](https://docs.smith.langchain.com/reference/python/run_helpers/langsmith.run_helpers.traceable) (Python) or [`traceable` function](https://docs.smith.langchain.com/reference/js/functions/traceable.traceable) (TS).

`process_inputs`/`processInputs` and `process_outputs`/`processOutputs` accept functions that allow you to transform the inputs and outputs of a specific trace before they are logged to LangSmith. They have access to the trace's inputs and outputs, and can return a new dictionary with the processed data.

Here's a boilerplate example of how to use `process_inputs` and `process_outputs` to convert a custom I/O format into a LangSmith compatible format:

```python expandable
class OriginalInputs(BaseModel):
    """Your app's custom request shape"""

class OriginalOutputs(BaseModel):
    """Your app's custom response shape."""

class LangSmithInputs(BaseModel):
    """The input format LangSmith expects."""

class LangSmithOutputs(BaseModel):
    """The output format LangSmith expects."""

def process_inputs(inputs: dict) -> dict:
    """Dict -> OriginalInputs -> LangSmithInputs -> dict"""

def process_outputs(output: Any) -> dict:
    """OriginalOutputs -> LangSmithOutputs -> dict"""

@traceable(run_type="llm", process_inputs=process_inputs, process_outputs=process_outputs)
def chat_model(inputs: dict) -> dict:
    """
    Your app's model call. Keeps your custom I/O shape.
    The decorators call process_* to log LangSmith-compatible format.
    """
```

## Identify a custom model in traces

When using a custom model, it is recommended to also provide the following `metadata` fields to identify the model when viewing traces and when [filtering](lc:langsmith/filter-traces-in-application).

- `ls_provider`: The provider of the model, e.g., `"openai"`, `"anthropic"`.
- `ls_model_name`: The name of the model, e.g., `"gpt-5.4-mini"`, `"claude-opus-4-8"`.

```python Python wrap
from langsmith import traceable

inputs = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "I'd like to book a table for two."},
]
output = {
    "choices": [
        {
            "message": {
                "role": "assistant",
                "content": "Sure, what time would you like to book the table for?"
            }
        }
    ]
}

@traceable(
    run_type="llm",
    metadata={"ls_provider": "my_provider", "ls_model_name": "my_model"}
)
def chat_model(messages: list):
    return output

chat_model(inputs)
```

If you implement a custom streaming `chat_model`, you can "reduce" the outputs into the same format as the non-streaming version. This is only supported in Python:

```python expandable wrap
def _reduce_chunks(chunks: list):
    all_text = "".join([chunk["choices"][0]["message"]["content"] for chunk in chunks])
    return {"choices": [{"message": {"content": all_text, "role": "assistant"}}]}

@traceable(
    run_type="llm",
    reduce_fn=_reduce_chunks,
    metadata={"ls_provider": "my_provider", "ls_model_name": "my_model"}
)
def my_streaming_chat_model(messages: list):
    for chunk in ["Hello, " + messages[1]["content"]]:
        yield {
            "choices": [
                {
                    "message": {
                        "content": chunk,
                        "role": "assistant",
                    }
                }
            ]
        }

list(
    my_streaming_chat_model(
        [
            {"role": "system", "content": "You are a helpful assistant. Please greet the user."},
            {"role": "user", "content": "assistant"},
        ],
    )
)
```


> [!TIP]
>
> Setting `ls_model_name` in your `metadata` is required for LangSmith to identify the model and calculate costs for custom LLM traces. Without it, token counts may still be recorded but costs won't be estimated.


To learn more about how to use the `metadata` fields, refer to the [Add metadata and tags](lc:langsmith/add-metadata-tags) guide. To customize how custom agent runs appear in the Messages view, see [Customize the Messages view](lc:langsmith/view-traces#customize-the-messages-view).

## Provide token and cost information

Token counts enable cost calculation, which LangSmith displays in the [Tracing Projects UI](https://smith.langchain.com/projects). There are two ways to provide them:

- **Set `usage_metadata` on the run tree**: call [`get_current_run_tree()` / `getCurrentRunTree()`](lc:langsmith/access-current-span) inside your [`@traceable`](lc:langsmith/annotate-code#use-%40traceable-%2F-traceable) function and set the `usage_metadata` field. This does not change your function's return value.
- **Return `usage_metadata` in the output**: include `usage_metadata` as a top-level key in the dictionary your function returns.

### Supported `usage_metadata` fields

| Field | Type | Description |
|---|---|---|
| `input_tokens` | `int` | Total input/prompt tokens |
| `output_tokens` | `int` | Total output/completion tokens |
| `total_tokens` | `int` | Sum of input + output (optional, can be inferred) |
| `input_token_details` | `object` | Breakdown: `cache_read`, `cache_creation`, `cache_read_over_200k`, `ephemeral_5m_input_tokens`, `ephemeral_1h_input_tokens`, `audio`, `text`, `image` |
| `output_token_details` | `object` | Breakdown: `reasoning`, `audio`, `text`, `image` |

To send costs directly (for non-linear pricing), you can also include `input_cost`, `output_cost`, and `total_cost` fields. For details on configuring model pricing and viewing costs in the UI, refer to the [Cost tracking](lc:langsmith/cost-tracking) page.

## Time-to-first-token

If you are using `traceable` or one of the SDK wrappers, LangSmith will automatically populate time-to-first-token for streaming LLM runs. However, if you are using the [`RunTree` API](lc:langsmith/annotate-code#use-the-runtree-api) directly, you will need to add a `new_token` event to the run tree in order to properly populate time-to-first-token.

Here's an example:

```python Python
from langsmith.run_trees import RunTree
run_tree = RunTree(
    name="CustomChatModel",
    run_type="llm",
    inputs={ ... }
)
run_tree.post()
llm_stream = ...
first_token = None
for token in llm_stream:
    if first_token is None:
      first_token = token
      run_tree.add_event({
        "name": "new_token"
      })
run_tree.end(outputs={ ... })
run_tree.patch()
```

## Related

- [Custom instrumentation](lc:langsmith/annotate-code): core `@traceable` and `RunTree` patterns.
- [Access the current run (span) within a traced function](lc:langsmith/access-current-span): using `get_current_run_tree()` to set `usage_metadata` and other fields at runtime.
- [Trace OpenAI applications](lc:langsmith/trace-openai): automatic token and cost tracking when using the OpenAI wrapper.
- [Trace Anthropic applications](lc:langsmith/trace-anthropic): automatic token and cost tracking when using the Anthropic wrapper.
- [Integrations overview](lc:langsmith/integrations): full list of providers and frameworks with built-in LangSmith support.
