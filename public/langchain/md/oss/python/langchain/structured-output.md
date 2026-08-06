Structured output allows agents to return data in a specific, predictable format. Instead of parsing natural language responses, you get structured data in the form of JSON objects, [Pydantic models](https://docs.pydantic.dev/latest/concepts/models/#basic-model-usage), or dataclasses that your application can use directly.


> [!TIP]
>
> This page covers structured output with agents using `create_agent`. To use structured output directly on a model (outside of agents), see [Models - Structured output](lc:oss/python/langchain/models#structured-output).


LangChain's `create_agent` handles structured output automatically. The user sets their desired structured output schema, and when the model generates the structured data, it's captured, validated, and returned in the `'structured_response'` key of the agent's state.

```python
def create_agent(
    ...
    response_format: Union[
        ToolStrategy[StructuredResponseT],
        ProviderStrategy[StructuredResponseT],
        type[StructuredResponseT],
        None,
    ]
)
```

## Response format

Use `response_format` to control how the agent returns structured data:

- **`ToolStrategy[StructuredResponseT]`**: Uses tool calling for structured output
- **`ProviderStrategy[StructuredResponseT]`**: Uses provider-native structured output
- **`type[StructuredResponseT]`**: Schema type - automatically selects best strategy based on model capabilities
- **`None`**: Structured output not explicitly requested

When a schema type is provided directly, LangChain automatically chooses:

- `ProviderStrategy` if the model and provider chosen supports native structured output (e.g. [OpenAI](lc:oss/python/integrations/providers/openai), [Anthropic (Claude)](lc:oss/python/integrations/providers/anthropic), or [xAI (Grok)](lc:oss/python/integrations/providers/xai)).
- `ToolStrategy` for all other models.


> [!WARNING]
>
> JSON Schema dictionaries must be wrapped in an explicit strategy (`ProviderStrategy` or `ToolStrategy`). They are not automatically detected when passed directly to `response_format`.


> [!NOTE]
>
> Support for native structured output features is read dynamically from the model's [profile data](lc:oss/python/langchain/models#model-profiles) if using `langchain>=1.1`. If data are not available, use another condition or specify manually:
>     ```python
>     custom_profile = {
>         "structured_output": True,
>         # ...
>     }
>     model = init_chat_model("...", profile=custom_profile)
>     ```
>     If tools are specified, the model must support simultaneous use of tools and structured output.


The structured response is returned in the `structured_response` key of the agent's final state.

## Provider strategy

Some model providers support structured output natively through their APIs (e.g. OpenAI, xAI (Grok), Gemini, Anthropic (Claude)). This is the most reliable method when available.

To use this strategy, configure a `ProviderStrategy`:

```python
class ProviderStrategy(Generic[SchemaT]):
    schema: type[SchemaT]
    strict: bool | None = None
```


> [!NOTE]
>
> The `strict` param requires `langchain>=1.2`.


    The schema defining the structured output format. Supports:
    - **Pydantic models**: `BaseModel` subclasses with field validation. Returns validated Pydantic instance.
    - **Dataclasses**: Python dataclasses with type annotations. Returns dict.
    - **TypedDict**: Typed dictionary classes. Returns dict.
    - **JSON Schema**: Dictionary with JSON schema specification. Must include top-level `title` and `description` keys. Returns dict.

    Optional boolean parameter to enable strict schema adherence. Supported by some providers (e.g., [OpenAI](lc:oss/python/integrations/chat/openai) and [xAI](lc:oss/python/integrations/chat/xai)). Defaults to `None` (disabled).

LangChain automatically uses `ProviderStrategy` when you pass a schema type directly to `create_agent.response_format`[create_agent(response_format)] and the model supports native structured output:

    ```lc-tabs
    [
     {
      "label": "Pydantic Model",
      "lang": "python",
      "code": "from pydantic import BaseModel, Field\nfrom langchain.agents import create_agent\n\nclass ContactInfo(BaseModel):\n    \"\"\"Contact information for a person.\"\"\"\n    name: str = Field(description=\"The name of the person\")\n    email: str = Field(description=\"The email address of the person\")\n    phone: str = Field(description=\"The phone number of the person\")\n\nagent = create_agent(\n    model=\"gpt-5.5\",\n    response_format=ContactInfo  # Auto-selects ProviderStrategy\n)\n\nresult = agent.invoke({\n    \"messages\": [{\"role\": \"user\", \"content\": \"Extract contact info from: John Doe, john@example.com, (555) 123-4567\"}]\n})\n\nprint(result[\"structured_response\"])\n# ContactInfo(name='John Doe', email='john@example.com', phone='(555) 123-4567')"
     },
     {
      "label": "Dataclass",
      "lang": "python",
      "code": "from dataclasses import dataclass\nfrom langchain.agents import create_agent\n\n@dataclass\nclass ContactInfo:\n    \"\"\"Contact information for a person.\"\"\"\n    name: str # The name of the person\n    email: str # The email address of the person\n    phone: str # The phone number of the person\n\nagent = create_agent(\n    model=\"gpt-5.5\",\n    tools=tools,\n    response_format=ContactInfo  # Auto-selects ProviderStrategy\n)\n\nresult = agent.invoke({\n    \"messages\": [{\"role\": \"user\", \"content\": \"Extract contact info from: John Doe, john@example.com, (555) 123-4567\"}]\n})\n\nresult[\"structured_response\"]\n# {'name': 'John Doe', 'email': 'john@example.com', 'phone': '(555) 123-4567'}"
     },
     {
      "label": "TypedDict",
      "lang": "python",
      "code": "from typing_extensions import TypedDict\nfrom langchain.agents import create_agent\n\nclass ContactInfo(TypedDict):\n    \"\"\"Contact information for a person.\"\"\"\n    name: str # The name of the person\n    email: str # The email address of the person\n    phone: str # The phone number of the person\n\nagent = create_agent(\n    model=\"gpt-5.5\",\n    tools=tools,\n    response_format=ContactInfo  # Auto-selects ProviderStrategy\n)\n\nresult = agent.invoke({\n    \"messages\": [{\"role\": \"user\", \"content\": \"Extract contact info from: John Doe, john@example.com, (555) 123-4567\"}]\n})\n\nresult[\"structured_response\"]\n# {'name': 'John Doe', 'email': 'john@example.com', 'phone': '(555) 123-4567'}"
     },
     {
      "label": "JSON Schema",
      "lang": "python",
      "code": "from langchain.agents import create_agent\nfrom langchain.agents.structured_output import ProviderStrategy\n\ncontact_info_schema = {\n    \"title\": \"ContactInfo\",\n    \"type\": \"object\",\n    \"description\": \"Contact information for a person.\",\n    \"properties\": {\n        \"name\": {\"type\": \"string\", \"description\": \"The name of the person\"},\n        \"email\": {\"type\": \"string\", \"description\": \"The email address of the person\"},\n        \"phone\": {\"type\": \"string\", \"description\": \"The phone number of the person\"}\n    },\n    \"required\": [\"name\", \"email\", \"phone\"]\n}\n\nagent = create_agent(\n    model=\"gpt-5.5\",\n    tools=tools,\n    response_format=ProviderStrategy(contact_info_schema)\n)\n\nresult = agent.invoke({\n    \"messages\": [{\"role\": \"user\", \"content\": \"Extract contact info from: John Doe, john@example.com, (555) 123-4567\"}]\n})\n\nresult[\"structured_response\"]\n# {'name': 'John Doe', 'email': 'john@example.com', 'phone': '(555) 123-4567'}"
     }
    ]
    ```


Provider-native structured output provides high reliability and strict validation because the model provider enforces the schema. Use it when available.


> [!NOTE]
>
> If the provider natively supports structured output for your model choice, it is functionally equivalent to write `response_format=ProductReview` instead of `response_format=ProviderStrategy(ProductReview)`.
>
>     In either case, if structured output is not supported, the agent will fall back to a tool calling strategy.


## Tool calling strategy

For models that don't support native structured output, LangChain uses tool calling to achieve the same result. This works with all models that support tool calling (most modern models).

To use this strategy, configure a `ToolStrategy`:

```python
class ToolStrategy(Generic[SchemaT]):
    schema: type[SchemaT]
    tool_message_content: str | None
    handle_errors: Union[
        bool,
        str,
        type[Exception],
        tuple[type[Exception], ...],
        Callable[[Exception], str],
    ]
```

    The schema defining the structured output format. Supports:
    - **Pydantic models**: `BaseModel` subclasses with field validation. Returns validated Pydantic instance.
    - **Dataclasses**: Python dataclasses with type annotations. Returns dict.
    - **TypedDict**: Typed dictionary classes. Returns dict.
    - **JSON Schema**: Dictionary with JSON schema specification. Must include top-level `title` and `description` keys. Returns dict.
    - **Union types**: Multiple schema options. The model will choose the most appropriate schema based on the context.

    Custom content for the tool message returned when structured output is generated.
    If not provided, defaults to a message showing the structured response data.

    Error handling strategy for structured output validation failures. Defaults to `True`.

    - **`True`**: Catch all errors with default error template
    - **`str`**: Catch all errors with this custom message
    - **`type[Exception]`**: Only catch this exception type with default message
    - **`tuple[type[Exception], ...]`**: Only catch these exception types with default message
    - **`Callable[[Exception], str]`**: Custom function that returns error message
    - **`False`**: No retry, let exceptions propagate

    ```lc-tabs
    [
     {
      "label": "Pydantic Model",
      "lang": "python",
      "code": "from pydantic import BaseModel, Field\nfrom typing import Literal\nfrom langchain.agents import create_agent\nfrom langchain.agents.structured_output import ToolStrategy\n\nclass ProductReview(BaseModel):\n    \"\"\"Analysis of a product review.\"\"\"\n    rating: int | None = Field(description=\"The rating of the product\", ge=1, le=5)\n    sentiment: Literal[\"positive\", \"negative\"] = Field(description=\"The sentiment of the review\")\n    key_points: list[str] = Field(description=\"The key points of the review. Lowercase, 1-3 words each.\")\n\nagent = create_agent(\n    model=\"gpt-5.5\",\n    tools=tools,\n    response_format=ToolStrategy(ProductReview)\n)\n\nresult = agent.invoke({\n    \"messages\": [{\"role\": \"user\", \"content\": \"Analyze this review: 'Great product: 5 out of 5 stars. Fast shipping, but expensive'\"}]\n})\nresult[\"structured_response\"]\n# ProductReview(rating=5, sentiment='positive', key_points=['fast shipping', 'expensive'])"
     },
     {
      "label": "Dataclass",
      "lang": "python",
      "code": "from dataclasses import dataclass\nfrom typing import Literal\nfrom langchain.agents import create_agent\nfrom langchain.agents.structured_output import ToolStrategy\n\n@dataclass\nclass ProductReview:\n    \"\"\"Analysis of a product review.\"\"\"\n    rating: int | None  # The rating of the product (1-5)\n    sentiment: Literal[\"positive\", \"negative\"]  # The sentiment of the review\n    key_points: list[str]  # The key points of the review\n\nagent = create_agent(\n    model=\"gpt-5.5\",\n    tools=tools,\n    response_format=ToolStrategy(ProductReview)\n)\n\nresult = agent.invoke({\n    \"messages\": [{\"role\": \"user\", \"content\": \"Analyze this review: 'Great product: 5 out of 5 stars. Fast shipping, but expensive'\"}]\n})\nresult[\"structured_response\"]\n# {'rating': 5, 'sentiment': 'positive', 'key_points': ['fast shipping', 'expensive']}"
     },
     {
      "label": "TypedDict",
      "lang": "python",
      "code": "from typing import Literal\nfrom typing_extensions import TypedDict\nfrom langchain.agents import create_agent\nfrom langchain.agents.structured_output import ToolStrategy\n\nclass ProductReview(TypedDict):\n    \"\"\"Analysis of a product review.\"\"\"\n    rating: int | None  # The rating of the product (1-5)\n    sentiment: Literal[\"positive\", \"negative\"]  # The sentiment of the review\n    key_points: list[str]  # The key points of the review\n\nagent = create_agent(\n    model=\"gpt-5.5\",\n    tools=tools,\n    response_format=ToolStrategy(ProductReview)\n)\n\nresult = agent.invoke({\n    \"messages\": [{\"role\": \"user\", \"content\": \"Analyze this review: 'Great product: 5 out of 5 stars. Fast shipping, but expensive'\"}]\n})\nresult[\"structured_response\"]\n# {'rating': 5, 'sentiment': 'positive', 'key_points': ['fast shipping', 'expensive']}"
     },
     {
      "label": "JSON Schema",
      "lang": "python",
      "code": "from langchain.agents import create_agent\nfrom langchain.agents.structured_output import ToolStrategy\n\nproduct_review_schema = {\n    \"title\": \"ProductReview\",\n    \"type\": \"object\",\n    \"description\": \"Analysis of a product review.\",\n    \"properties\": {\n        \"rating\": {\n            \"type\": [\"integer\", \"null\"],\n            \"description\": \"The rating of the product (1-5)\",\n            \"minimum\": 1,\n            \"maximum\": 5\n        },\n        \"sentiment\": {\n            \"type\": \"string\",\n            \"enum\": [\"positive\", \"negative\"],\n            \"description\": \"The sentiment of the review\"\n        },\n        \"key_points\": {\n            \"type\": \"array\",\n            \"items\": {\"type\": \"string\"},\n            \"description\": \"The key points of the review\"\n        }\n    },\n    \"required\": [\"sentiment\", \"key_points\"]\n}\n\nagent = create_agent(\n    model=\"gpt-5.5\",\n    tools=tools,\n    response_format=ToolStrategy(product_review_schema)\n)\n\nresult = agent.invoke({\n    \"messages\": [{\"role\": \"user\", \"content\": \"Analyze this review: 'Great product: 5 out of 5 stars. Fast shipping, but expensive'\"}]\n})\nresult[\"structured_response\"]\n# {'rating': 5, 'sentiment': 'positive', 'key_points': ['fast shipping', 'expensive']}"
     },
     {
      "label": "Union Types",
      "lang": "python",
      "code": "from pydantic import BaseModel, Field\nfrom typing import Literal, Union\nfrom langchain.agents import create_agent\nfrom langchain.agents.structured_output import ToolStrategy\n\nclass ProductReview(BaseModel):\n    \"\"\"Analysis of a product review.\"\"\"\n    rating: int | None = Field(description=\"The rating of the product\", ge=1, le=5)\n    sentiment: Literal[\"positive\", \"negative\"] = Field(description=\"The sentiment of the review\")\n    key_points: list[str] = Field(description=\"The key points of the review. Lowercase, 1-3 words each.\")\n\nclass CustomerComplaint(BaseModel):\n    \"\"\"A customer complaint about a product or service.\"\"\"\n    issue_type: Literal[\"product\", \"service\", \"shipping\", \"billing\"] = Field(description=\"The type of issue\")\n    severity: Literal[\"low\", \"medium\", \"high\"] = Field(description=\"The severity of the complaint\")\n    description: str = Field(description=\"Brief description of the complaint\")\n\nagent = create_agent(\n    model=\"gpt-5.5\",\n    tools=tools,\n    response_format=ToolStrategy(Union[ProductReview, CustomerComplaint])\n)\n\nresult = agent.invoke({\n    \"messages\": [{\"role\": \"user\", \"content\": \"Analyze this review: 'Great product: 5 out of 5 stars. Fast shipping, but expensive'\"}]\n})\nresult[\"structured_response\"]\n# ProductReview(rating=5, sentiment='positive', key_points=['fast shipping', 'expensive'])"
     }
    ]
    ```

### Custom tool message content

The `tool_message_content` parameter allows you to customize the message that appears in the conversation history when structured output is generated:

```python
from pydantic import BaseModel, Field
from typing import Literal
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy

class MeetingAction(BaseModel):
    """Action items extracted from a meeting transcript."""
    task: str = Field(description="The specific task to be completed")
    assignee: str = Field(description="Person responsible for the task")
    priority: Literal["low", "medium", "high"] = Field(description="Priority level")

agent = create_agent(
    model="gpt-5.5",
    tools=[],
    response_format=ToolStrategy(
        schema=MeetingAction,
        tool_message_content="Action item captured and added to meeting notes!"
    )
)

agent.invoke({
    "messages": [{"role": "user", "content": "From our meeting: Sarah needs to update the project timeline as soon as possible"}]
})
```

```
================================ Human Message =================================

From our meeting: Sarah needs to update the project timeline as soon as possible
================================== Ai Message ==================================
Tool Calls:
  MeetingAction (call_1)
 Call ID: call_1
  Args:
    task: Update the project timeline
    assignee: Sarah
    priority: high
================================= Tool Message =================================
Name: MeetingAction

Action item captured and added to meeting notes!
```

Without `tool_message_content`, our final `ToolMessage` would be:
```
================================= Tool Message =================================
Name: MeetingAction

Returning structured response: {'task': 'update the project timeline', 'assignee': 'Sarah', 'priority': 'high'}
```

### Error handling

Models can make mistakes when generating structured output via tool calling. LangChain provides intelligent retry mechanisms to handle these errors automatically.

#### Multiple structured outputs error

When a model incorrectly calls multiple structured output tools, the agent provides error feedback in a `ToolMessage` and prompts the model to retry:

```python
from pydantic import BaseModel, Field
from typing import Union
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy

class ContactInfo(BaseModel):
    name: str = Field(description="Person's name")
    email: str = Field(description="Email address")

class EventDetails(BaseModel):
    event_name: str = Field(description="Name of the event")
    date: str = Field(description="Event date")

agent = create_agent(
    model="gpt-5.5",
    tools=[],
    response_format=ToolStrategy(Union[ContactInfo, EventDetails])  # Default: handle_errors=True
)

agent.invoke({
    "messages": [{"role": "user", "content": "Extract info: John Doe (john@email.com) is organizing Tech Conference on March 15th"}]
})
```

```
================================ Human Message =================================

Extract info: John Doe (john@email.com) is organizing Tech Conference on March 15th
None
================================== Ai Message ==================================
Tool Calls:
  ContactInfo (call_1)
 Call ID: call_1
  Args:
    name: John Doe
    email: john@email.com
  EventDetails (call_2)
 Call ID: call_2
  Args:
    event_name: Tech Conference
    date: March 15th
================================= Tool Message =================================
Name: ContactInfo

Error: Model incorrectly returned multiple structured responses (ContactInfo, EventDetails) when only one is expected.
 Please fix your mistakes.
================================= Tool Message =================================
Name: EventDetails

Error: Model incorrectly returned multiple structured responses (ContactInfo, EventDetails) when only one is expected.
 Please fix your mistakes.
================================== Ai Message ==================================
Tool Calls:
  ContactInfo (call_3)
 Call ID: call_3
  Args:
    name: John Doe
    email: john@email.com
================================= Tool Message =================================
Name: ContactInfo

Returning structured response: {'name': 'John Doe', 'email': 'john@email.com'}
```

#### Schema validation error

When structured output doesn't match the expected schema, the agent provides specific error feedback:

```python
from pydantic import BaseModel, Field
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy

class ProductRating(BaseModel):
    rating: int | None = Field(description="Rating from 1-5", ge=1, le=5)
    comment: str = Field(description="Review comment")

agent = create_agent(
    model="gpt-5.5",
    tools=[],
    response_format=ToolStrategy(ProductRating),  # Default: handle_errors=True
    system_prompt="You are a helpful assistant that parses product reviews. Do not make any field or value up."
)

agent.invoke({
    "messages": [{"role": "user", "content": "Parse this: Amazing product, 10/10!"}]
})
```

```
================================ Human Message =================================

Parse this: Amazing product, 10/10!
================================== Ai Message ==================================
Tool Calls:
  ProductRating (call_1)
 Call ID: call_1
  Args:
    rating: 10
    comment: Amazing product
================================= Tool Message =================================
Name: ProductRating

Error: Failed to parse structured output for tool 'ProductRating': 1 validation error for ProductRating.rating
  Input should be less than or equal to 5 [type=less_than_equal, input_value=10, input_type=int].
 Please fix your mistakes.
================================== Ai Message ==================================
Tool Calls:
  ProductRating (call_2)
 Call ID: call_2
  Args:
    rating: 5
    comment: Amazing product
================================= Tool Message =================================
Name: ProductRating

Returning structured response: {'rating': 5, 'comment': 'Amazing product'}
```

#### Error handling strategies

You can customize how errors are handled using the `handle_errors` parameter:

**Custom error message:**
```python
ToolStrategy(
    schema=ProductRating,
    handle_errors="Please provide a valid rating between 1-5 and include a comment."
)
```
If `handle_errors` is a string, the agent will *always* prompt the model to re-try with a fixed tool message:
```
================================= Tool Message =================================
Name: ProductRating

Please provide a valid rating between 1-5 and include a comment.
```

**Handle specific exceptions only:**

```python
ToolStrategy(
    schema=ProductRating,
    handle_errors=ValueError  # Only retry on ValueError, raise others
)
```

If `handle_errors` is an exception type, the agent will only retry (using the default error message) if the exception raised is the specified type. In all other cases, the exception will be raised.

**Handle multiple exception types:**
```python
ToolStrategy(
    schema=ProductRating,
    handle_errors=(ValueError, TypeError)  # Retry on ValueError and TypeError
)
```

If `handle_errors` is a tuple of exceptions, the agent will only retry (using the default error message) if the exception raised is one of the specified types. In all other cases, the exception will be raised.

**Custom error handler function:**

```python

from langchain.agents.structured_output import StructuredOutputValidationError
from langchain.agents.structured_output import MultipleStructuredOutputsError

def custom_error_handler(error: Exception) -> str:
    if isinstance(error, StructuredOutputValidationError):
        return "There was an issue with the format. Try again."
    elif isinstance(error, MultipleStructuredOutputsError):
        return "Multiple structured outputs were returned. Pick the most relevant one."
    else:
        return f"Error: {str(error)}"

agent = create_agent(
    model="gpt-5.5",
    tools=[],
    response_format=ToolStrategy(
                        schema=Union[ContactInfo, EventDetails],
                        handle_errors=custom_error_handler
                    )  # Default: handle_errors=True
)

result = agent.invoke({
    "messages": [{"role": "user", "content": "Extract info: John Doe (john@email.com) is organizing Tech Conference on March 15th"}]
})

for msg in result['messages']:
    # If message is actually a ToolMessage object (not a dict), check its class name
    if type(msg).__name__ == "ToolMessage":
        print(msg.content)
    # If message is a dictionary or you want a fallback
    elif isinstance(msg, dict) and msg.get('tool_call_id'):
        print(msg['content'])

```

On `StructuredOutputValidationError`:
```
================================= Tool Message =================================
Name: ToolStrategy

There was an issue with the format. Try again.
```

On `MultipleStructuredOutputsError`:

```
================================= Tool Message =================================
Name: ToolStrategy

Multiple structured outputs were returned. Pick the most relevant one.
```

On other errors:

```
================================= Tool Message =================================
Name: ToolStrategy

Error: <error message>
```

**No error handling:**

```python
response_format = ToolStrategy(
    schema=ProductRating,
    handle_errors=False  # All errors raised
)
```
