> [Google Calendar](https://workspace.google.com/intl/en-419/products/calendar/) is a product of Google Workspace that allows users to organize their schedules and events. It is a cloud-based calendar that allows users to create, edit, and delete events. It also allows users to share their calendars with others.

## Overview

This notebook will help you get started with the Google Calendar Toolkit. This toolkit interacts with the Google Calendar API to perform various operations on the calendar. It allows you to:

- Create events.
- Search events.
- Update events.
- Move events between different calendars.
- Delete events.
- List events.

## Setup

To use this toolkit, you will need to:

1. Have a Google account with access to Google Calendar.
2. Set up your credentials as explained in the [Google Calendar API docs](https://developers.google.com/calendar/api/quickstart/python#authorize_credentials_for_a_desktop_application). Once you've downloaded the `credentials.json` file, you can start using the Google Calendar API.

To enable automated tracing of individual tools, set your [LangSmith](lc:langsmith/observability) API key:

```python
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
```

### Installation

This toolkit lives in the `langchain-google-community` package of the [langchain-google](https://github.com/langchain-ai/langchain-google) repository. We'll need the `calendar` extra:

```python
pip install -qU langchain-google-community\[calendar\]
```

## Instantiation

By default the toolkit reads the local `credentials.json` file. You can also manually provide a `Credentials` object.

```python
from langchain_google_community import CalendarToolkit

toolkit = CalendarToolkit()
```

### Customizing authentication

Behind the scenes, a `googleapi` resource is created using the following methods. you can manually build a `googleapi` resource for more auth control.

```python
from langchain_google_community import CalendarToolkit
from langchain_google_community.calendar.utils import (
    build_resource_service,
    get_google_credentials,
)

# Can review scopes here: https://developers.google.com/calendar/api/auth
# For instance, readonly scope is https://www.googleapis.com/auth/calendar.readonly
credentials = get_google_credentials(
    token_file="token.json",
    scopes=["https://www.googleapis.com/auth/calendar"],
    client_secrets_file="credentials.json",
)

api_resource = build_resource_service(credentials=credentials)
toolkit = CalendarToolkit(api_resource=api_resource)
```

## Tools

View available tools:

```python
tools = toolkit.get_tools()
tools
```

```text
[CalendarCreateEvent(api_resource=<googleapiclient.discovery.Resource object at 0x10ad13fb0>),
 CalendarSearchEvents(api_resource=<googleapiclient.discovery.Resource object at 0x10ad13fb0>),
 CalendarUpdateEvent(api_resource=<googleapiclient.discovery.Resource object at 0x10ad13fb0>),
 GetCalendarsInfo(api_resource=<googleapiclient.discovery.Resource object at 0x10ad13fb0>),
 CalendarMoveEvent(api_resource=<googleapiclient.discovery.Resource object at 0x10ad13fb0>),
 CalendarDeleteEvent(api_resource=<googleapiclient.discovery.Resource object at 0x10ad13fb0>),
 GetCurrentDatetime(api_resource=<googleapiclient.discovery.Resource object at 0x10ad13fb0>)]
```

- [CalendarCreateEvent](https://reference.langchain.com/python/langchain-google-community/calendar/create_event/CalendarCreateEvent)
- [CalendarSearchEvents](https://reference.langchain.com/python/langchain-google-community/calendar/search_events/CalendarSearchEvents)
- [CalendarUpdateEvent](https://reference.langchain.com/python/langchain-google-community/calendar/update_event/CalendarUpdateEvent)
- [GetCalendarsInfo](https://reference.langchain.com/python/langchain-google-community/calendar/get_calendars_info/GetCalendarsInfo)
- [CalendarMoveEvent](https://reference.langchain.com/python/langchain-google-community/calendar/move_event/CalendarMoveEvent)
- [CalendarDeleteEvent](https://reference.langchain.com/python/langchain-google-community/calendar/delete_event/CalendarDeleteEvent)
- [GetCurrentDatetime](https://reference.langchain.com/python/langchain-google-community/calendar/current_datetime/GetCurrentDatetime)

## Invocation

### [Invoke directly with args](lc:oss/python/langchain/tools#create-tools)

You can invoke the tool directly by passing the required arguments in a dictionary format. Here is an example of creating a new event using the `CalendarCreateEvent` tool.

```python
from langchain_google_community.calendar.create_event import CalendarCreateEvent

tool = CalendarCreateEvent()
tool.invoke(
    {
        "summary": "Calculus exam",
        "start_datetime": "2025-07-11 11:00:00",
        "end_datetime": "2025-07-11 13:00:00",
        "timezone": "America/Mexico_City",
        "location": "UAM Cuajimalpa",
        "description": "Event created from the LangChain toolkit",
        "reminders": [{"method": "popup", "minutes": 60}],
        "conference_data": True,
        "color_id": "5",
    }
)
```

```text
'Event created: https://www.google.com/calendar/event?eid=amoxdjVsM2UzMW51Yjk2czc4ajhvaGdkcGcgam9yZ2VhbmczM0Bt'
```

## Use within an agent

Below we show how to incorporate the toolkit into an [agent](lc:oss/python/langchain/agents).

We will need an LLM or chat model:


#### Tab: OpenAI

        👉 Read the [OpenAI chat model integration docs](lc:oss/python/integrations/chat/openai)

        ```shell
        pip install -U "langchain[openai]"
        ```

        
            ```lc-tabs
            [
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nos.environ[\"OPENAI_API_KEY\"] = \"sk-...\"\n\nmodel = init_chat_model(\"gpt-5.5\")"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_openai import ChatOpenAI\n\nos.environ[\"OPENAI_API_KEY\"] = \"sk-...\"\n\nmodel = ChatOpenAI(model=\"gpt-5.5\")"
             }
            ]
            ```
        
    
    #### Tab: Anthropic

        👉 Read the [Anthropic chat model integration docs](lc:oss/python/integrations/chat/anthropic)
        ```shell
        pip install -U "langchain[anthropic]"
        ```

        
            ```lc-tabs
            [
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nos.environ[\"ANTHROPIC_API_KEY\"] = \"sk-...\"\n\nmodel = init_chat_model(\"claude-sonnet-4-6\")"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_anthropic import ChatAnthropic\n\nos.environ[\"ANTHROPIC_API_KEY\"] = \"sk-...\"\n\nmodel = ChatAnthropic(model=\"claude-sonnet-4-6\")"
             }
            ]
            ```
        
    
    #### Tab: Azure

        👉 Read the [Azure chat model integration docs](lc:oss/python/integrations/chat/azure_chat_openai)
        ```shell
        pip install -U "langchain[openai]"
        ```

        
            ```lc-tabs
            [
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nos.environ[\"AZURE_OPENAI_API_KEY\"] = \"...\"\nos.environ[\"AZURE_OPENAI_ENDPOINT\"] = \"...\"\nos.environ[\"OPENAI_API_VERSION\"] = \"2025-03-01-preview\"\n\nmodel = init_chat_model(\n    \"azure_openai:gpt-5.5\",\n    azure_deployment=os.environ[\"AZURE_OPENAI_DEPLOYMENT_NAME\"],\n)"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_openai import AzureChatOpenAI\n\nos.environ[\"AZURE_OPENAI_API_KEY\"] = \"...\"\nos.environ[\"AZURE_OPENAI_ENDPOINT\"] = \"...\"\nos.environ[\"OPENAI_API_VERSION\"] = \"2025-03-01-preview\"\n\nmodel = AzureChatOpenAI(\n    model=\"gpt-5.5\",\n    azure_deployment=os.environ[\"AZURE_OPENAI_DEPLOYMENT_NAME\"]\n)"
             }
            ]
            ```
        
    
    #### Tab: Google Gemini

        👉 Read the [Google GenAI chat model integration docs](lc:oss/python/integrations/chat/google_generative_ai)
        ```shell
        pip install -U "langchain[google-genai]"
        ```

        
            ```lc-tabs
            [
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nos.environ[\"GOOGLE_API_KEY\"] = \"...\"\n\nmodel = init_chat_model(\"google_genai:gemini-2.5-flash-lite\")"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_google_genai import ChatGoogleGenerativeAI\n\nos.environ[\"GOOGLE_API_KEY\"] = \"...\"\n\nmodel = ChatGoogleGenerativeAI(model=\"gemini-2.5-flash-lite\")"
             }
            ]
            ```
        
    
    #### Tab: AWS Bedrock

        👉 Read the [AWS Bedrock chat model integration docs](lc:oss/python/integrations/chat/bedrock)
        ```shell
        pip install -U "langchain[aws]"
        ```

        
            ```lc-tabs
            [
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\n# Follow the steps here to configure your credentials:\n# https://docs.aws.amazon.com/bedrock/latest/userguide/getting-started.html\n\nmodel = init_chat_model(\n    \"us.anthropic.claude-sonnet-4-6\",\n    model_provider=\"bedrock_converse\",\n)"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_aws import ChatBedrock\n\nmodel = ChatBedrock(model=\"us.anthropic.claude-sonnet-4-6\")"
             }
            ]
            ```
        
    
    #### Tab: HuggingFace

        👉 Read the [HuggingFace chat model integration docs](lc:oss/python/integrations/chat/huggingface)

        ```shell
        pip install -U "langchain[huggingface]"
        ```

        
            ```lc-tabs
            [
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nos.environ[\"HUGGINGFACEHUB_API_TOKEN\"] = \"hf_...\"\n\nmodel = init_chat_model(\n    \"microsoft/Phi-3-mini-4k-instruct\",\n    model_provider=\"huggingface\",\n    temperature=0.7,\n    max_tokens=1024,\n)"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint\n\nos.environ[\"HUGGINGFACEHUB_API_TOKEN\"] = \"hf_...\"\n\nllm = HuggingFaceEndpoint(\n    repo_id=\"microsoft/Phi-3-mini-4k-instruct\",\n    temperature=0.7,\n    max_length=1024,\n)\nmodel = ChatHuggingFace(llm=llm)"
             }
            ]
            ```
        
    
    #### Tab: OpenRouter

        👉 Read the [OpenRouter chat model integration docs](lc:oss/python/integrations/chat/openrouter)

        ```shell
        pip install -U "langchain-openrouter"
        ```

        
            ```lc-tabs
            [
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nos.environ[\"OPENROUTER_API_KEY\"] = \"sk-...\"\n\nmodel = init_chat_model(\n    \"auto\",\n    model_provider=\"openrouter\",\n)"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_openrouter import ChatOpenRouter\n\nos.environ[\"OPENROUTER_API_KEY\"] = \"sk-...\"\n\nmodel = ChatOpenRouter(model=\"auto\")"
             }
            ]
            ```


```python
# | output: false
# | echo: false

from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-5.4-mini", temperature=0)
```

```python
from langchain.agents import create_agent

agent_executor = create_agent(llm, tools)
```

```python
example_query = "Create a green event for this afternoon to go for a 30-minute run."

stream = agent_executor.stream_events(
    {"messages": [("user", example_query)]},
    version="v3",
)
for snapshot in stream.values:
    snapshot["messages"][-1].pretty_print()
```

```text
================================ Human Message =================================

Create a green event for this afternoon to go for a 30-minute run.
================================== Ai Message ==================================
Tool Calls:
  get_current_datetime (call_drHRRhm6pdvcAuqagONUEKs5)
 Call ID: call_drHRRhm6pdvcAuqagONUEKs5
  Args:
================================= Tool Message =================================
Name: get_current_datetime

Time zone: America/Mexico_City, Date and time: 2025-04-02 19:07:30
================================== Ai Message ==================================
Tool Calls:
  create_calendar_event (call_p60zSVMmmjTy5Ctezzmlb9zD)
 Call ID: call_p60zSVMmmjTy5Ctezzmlb9zD
  Args:
    summary: Run
    start_datetime: 2025-04-02 19:30:00
    end_datetime: 2025-04-02 20:00:00
    timezone: America/Mexico_City
    color_id: 2
================================= Tool Message =================================
Name: create_calendar_event

Event created: https://www.google.com/calendar/event?eid=czZyZHVpcG43ajNiY241dmJmNWwycjE0NWsgam9yZ2VhbmczM0Bt
================================== Ai Message ==================================

I have created a green event for your run this afternoon. You can view it [in Google Calendar](https://www.google.com/calendar/event?eid=czZyZHVpcG43ajNiY241dmJmNWwycjE0NWsgam9yZ2VhbmczM0Bt). Enjoy your run!
```

---

## API reference

- Refer to the [Google Calendar API overview](https://developers.google.com/calendar/api/guides/overview) for more details from Google Calendar API.
- For detailed documentation of all Google Calendar Toolkit features and configurations head to the [calendar documentation](https://reference.langchain.com/python/langchain-google-community/calendar).
