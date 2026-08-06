This page describes how to create, configure, and manage [assistants](lc:langsmith/assistants). Assistants allow you to customize your [deployed](lc:langsmith/deployment) graph's behavior through configuration—such as model selection, prompts, and tool availability—without changing the underlying graph code.

You can work with the [SDK](https://reference.langchain.com/python/langsmith/deployment/sdk/) or in the [LangSmith UI](https://smith.langchain.com).

## Understand assistant configuration

Assistants store _context_ values that customize graph behavior at runtime. You define a context schema in your graph code, then provide specific context values when creating an assistant via the ``context` parameter`[AssistantsClient.create].

Consider this example of a `call_model` node that reads the `model_name` from the context:

```python Python
class ContextSchema(TypedDict):
    model_name: str

builder = StateGraph(AgentState, context_schema=ContextSchema)

def call_model(state, runtime: Runtime[ContextSchema]):
    messages = state["messages"]
    model = _get_model(runtime.context.get("model_name", "anthropic"))
    response = model.invoke(messages)
    return {"messages": [response]}
```

When you create an assistant, you provide specific values for these configuration fields. The assistant stores this configuration and applies it whenever the graph runs.

For more information on configuration in [LangGraph](lc:oss/python/langgraph/overview), refer to the [runtime context documentation](lc:oss/python/langgraph/graph-api#runtime-context).

**Select SDK or UI for your workflow:**

    #### Tab: SDK

## Create an assistant

Use the `assistants.create`[AssistantsClient.create] method to create a new assistant. This method requires:
- **Graph ID**: The name of the deployed graph this assistant will use (e.g., `"agent"`).
- **Context**: Configuration values matching your graph's context schema.
- **Name**: A descriptive name for the assistant.

The following example creates an assistant with `model_name` set to `openai`:

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "from langgraph_sdk import get_client\n\n# Initialize the client with your deployment URL\nclient = get_client(url=<DEPLOYMENT_URL>)\n\n# Create an assistant for the \"agent\" graph\n# The first parameter is the graph ID (also called graph name)\nopenai_assistant = await client.assistants.create(\n    \"agent\",  # Graph ID of the deployed graph\n    context={\"model_name\": \"openai\"},\n    name=\"Open AI Assistant\"\n)\n\nprint(openai_assistant)\n# Output includes the assistant_id (UUID) that uniquely identifies this assistant"
 },
 {
  "label": "cURL",
  "lang": "bash",
  "code": "curl --request POST \\\n    --url <DEPLOYMENT_URL>/assistants \\\n    --header 'Content-Type: application/json' \\\n    --data '{\"graph_id\":\"agent\", \"context\":{\"model_name\":\"openai\"}, \"name\": \"Open AI Assistant\"}'"
 }
]
```

**Response:**

The API returns an assistant object containing:
- `assistant_id`: A UUID that uniquely identifies this assistant
- `graph_id`: The graph this assistant is configured for
- `context`: The configuration values you provided
- `name`, `metadata`, timestamps, and other fields

```json
{
  "assistant_id": "62e209ca-9154-432a-b9e9-2d75c7a9219b",
  "graph_id": "agent",
  "name": "Open AI Assistant",
  "context": {
    "model_name": "openai"
  },
  "metadata": {},
  "created_at": "2024-08-31T03:09:10.230718+00:00",
  "updated_at": "2024-08-31T03:09:10.230718+00:00"
}
```

The `assistant_id` (a UUID like `"62e209ca-9154-432a-b9e9-2d75c7a9219b"`) uniquely identifies this assistant configuration. You'll use this ID when running your graph to specify which configuration to apply.


> [!NOTE]
>
> **Graph ID vs Assistant ID**
>
> When creating an assistant, you specify a **graph ID** (graph name like `"agent"`). This returns an **assistant ID** (UUID like `"62e209ca..."`). You can use either when running your graph:
> - **Graph ID** (e.g., `"agent"`): Uses the default assistant for that graph
> - **Assistant ID** (UUID): Uses the specific assistant configuration
>
> See [Use an assistant](#use-an-assistant) for examples.


## Use an assistant

To use an assistant, pass its `assistant_id` when creating a run. The example below uses the assistant we created above:

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "# Create a thread for the conversation\nthread = await client.threads.create()\n\n# Prepare the input\ninput = {\"messages\": [{\"role\": \"user\", \"content\": \"who made you?\"}]}\n\n# Run the graph using the assistant's configuration\n# Pass the assistant_id (UUID) as the second parameter\nasync for event in client.runs.stream(\n    thread[\"thread_id\"],\n    openai_assistant[\"assistant_id\"],  # Assistant ID (UUID)\n    input=input,\n    stream_mode=\"updates\",\n):\n    print(f\"Receiving event of type: {event.event}\")\n    print(event.data)\n    print(\"\\n\\n\")"
 },
 {
  "label": "cURL",
  "lang": "bash",
  "code": "# First, create a thread\nthread_id=$(curl --request POST \\\n    --url <DEPLOYMENT_URL>/threads \\\n    --header 'Content-Type: application/json' \\\n    --data '{}' | jq -r '.thread_id')\n\n# Run the graph with the assistant ID (UUID)\ncurl --request POST \\\n    --url \"<DEPLOYMENT_URL>/threads/${thread_id}/runs/stream\" \\\n    --header 'Content-Type: application/json' \\\n    --data '{\n        \"assistant_id\": \"<ASSISTANT_ID>\",\n        \"input\": {\n            \"messages\": [\n                {\n                    \"role\": \"user\",\n                    \"content\": \"who made you?\"\n                }\n            ]\n        },\n        \"stream_mode\": [\"updates\"]\n    }' | \\\n    sed 's/\\r$//' | \\\n    awk '\n    /^event:/ {\n        if (data_content != \"\") {\n            print data_content \"\\n\"\n        }\n        sub(/^event: /, \"Receiving event of type: \", $0)\n        printf \"%s...\\n\", $0\n        data_content = \"\"\n    }\n    /^data:/ {\n        sub(/^data: /, \"\", $0)\n        data_content = $0\n    }\n    END {\n        if (data_content != \"\") {\n            print data_content \"\\n\\n\"\n        }\n    }\n'"
 }
]
```

**Response:**

The stream returns events as the graph executes with your assistant's configuration:

```
Receiving event of type: metadata
{'run_id': '1ef6746e-5893-67b1-978a-0f1cd4060e16'}

Receiving event of type: updates
{'agent': {'messages': [{'content': 'I was created by OpenAI...', ...}]}}
```


> [!NOTE]
>
> **Using graph ID vs assistant ID**
>
> You can pass either a **graph ID** or **assistant ID** when running your graph:
>
> ```python
> # Option 1: Use graph ID to get the default assistant
> client.runs.stream(thread_id, "agent", input=input)
>
> # Option 2: Use assistant ID (UUID) for a specific configuration
> client.runs.stream(thread_id, "62e209ca-9154-432a-b9e9-2d75c7a9219b", input=input)
> ```


## Create a new version for your assistant

Use the `assistants.update`[AssistantsClient.update] method to create a new version of an assistant.


> [!WARNING]
>
> **Updates require full configuration**
>
> You must provide the **entire** configuration when updating. The update endpoint creates new versions from scratch and does not merge with previous versions. Include all configuration fields you want to retain.


For example, to add a system prompt to the assistant:

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "# Update the assistant with a new configuration\n# IMPORTANT: Include ALL configuration fields, not just the ones you're changing\nopenai_assistant_v2 = await client.assistants.update(\n    openai_assistant[\"assistant_id\"],  # Assistant ID (UUID)\n    context={\n          \"model_name\": \"openai\",  # Must include existing fields\n          \"system_prompt\": \"You are a mindful assistant!\",  # New field\n    },\n)\n\n# This creates version 2 and sets it as the active version\n# Future runs using this assistant_id will use version 2"
 },
 {
  "label": "cURL",
  "lang": "bash",
  "code": "curl --request PATCH \\\n--url <DEPLOYMENT_URL>/assistants/<ASSISTANT_ID> \\\n--header 'Content-Type: application/json' \\\n--data '{\n\"context\": {\"model_name\": \"openai\", \"system_prompt\": \"You are a mindful assistant!\"}\n}'"
 }
]
```

The update creates a new version and automatically sets it as active. All future runs using this assistant ID will use the new configuration.

## Use a previous assistant version

Use the `setLatest` method to change which version is active:

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "# Roll back to version 1 of the assistant\nawait client.assistants.set_latest(\n    openai_assistant['assistant_id'],  # Assistant ID (UUID)\n    1  # Version number\n)\n\n# All future runs using this assistant_id will now use version 1"
 },
 {
  "label": "cURL",
  "lang": "bash",
  "code": "curl --request POST \\\n--url <DEPLOYMENT_URL>/assistants/<ASSISTANT_ID>/latest \\\n--header 'Content-Type: application/json' \\\n--data '{\n\"version\": 1\n}'"
 }
]
```

After changing the active version, all runs using this assistant ID will use the specified version's configuration.

#### Tab: UI

## Create an assistant

You can create assistants from the [LangSmith UI](https://smith.langchain.com):

1. Navigate to your deployment and select the **Assistants** tab.
1. Click **+ New assistant**.
1. In the form that opens:
   - Select the graph this assistant is for.
   - Provide a name and description.
   - Configure the assistant using the configuration schema for that graph.
1. Click **Create assistant**.

This will take you to [Studio](lc:langsmith/studio) where you can test the assistant. Return to the **Assistants** tab to see your newly created assistant in the table.

## Use an assistant

To use an assistant in the LangSmith UI:

1. Navigate to your deployment and select the **Assistants** tab.
1. Find the assistant you want to use.
1. Click **Studio** for that assistant.

This opens [Studio](lc:langsmith/studio) with the selected assistant. When you submit an input (in **Graph** or **Chat** mode), the assistant's configuration will be applied to the run.

## Create a new version for your assistant

To update an assistant and create a new version from the UI, you can use either the Assistants tab or Studio. Either method creates a new version and sets it as the active version:

#### Tab: Assistants tab

1. Navigate to your deployment and select the **Assistants** tab.
1. Find the assistant you want to edit.
1. Click **Edit**.
1. Modify the assistant's name, description, or configuration.
1. Save your changes.

#### Tab: Studio

1. Open Studio for the assistant.
1. Click **Manage Assistants**.
1. Edit the assistant's configuration.
1. Save your changes.

## Use a previous assistant version

To set a previous version as active from Studio:

1. Open Studio for the assistant.
2. Click **Manage Assistants**.
3. Locate the assistant and select the version you want to use.
4. Toggle the **Active** switch for that version.

This updates the assistant to use the selected version for all future runs.


> [!WARNING]
>
> Deleting an assistant will delete **all** of its versions. There is currently no way to delete a single version. To skip a version, simply set a different version as active.
