This will help you get started with the Gmail [toolkit](lc:oss/python/integrations/tools/google_gmail). This toolkit interacts with the Gmail API to read messages, draft and send messages, and more. For detailed documentation of all `GmailToolkit` features and configurations head to the [API reference](https://reference.langchain.com/python/langchain-google-community/gmail/toolkit/GmailToolkit).

## Setup

To use this toolkit, you will need to set up your credentials explained in the [Gmail API docs](https://developers.google.com/gmail/api/quickstart/python#authorize_credentials_for_a_desktop_application). Once you've downloaded the `credentials.json` file, you can start using the Gmail API.

### Installation

This toolkit lives in the `langchain-google-community` package. We'll need the `gmail` extra:

```python
pip install -qU langchain-google-community\[gmail\]
```

To enable automated tracing of individual tools, set your [LangSmith](lc:langsmith/observability) API key:

```python
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
```

## Instantiation

By default the toolkit reads the local `credentials.json` file. You can also manually provide a `Credentials` object.

```python
from langchain_google_community import GmailToolkit

toolkit = GmailToolkit()
```

### Customizing authentication

Behind the scenes, a `googleapi` resource is created using the following methods.
you can manually build a `googleapi` resource for more auth control.

```python
from langchain_google_community.gmail.utils import (
    build_resource_service,
    get_gmail_credentials,
)

# Can review scopes here https://developers.google.com/gmail/api/auth/scopes
# For instance, readonly scope is 'https://www.googleapis.com/auth/gmail.readonly'
credentials = get_gmail_credentials(
    token_file="token.json",
    scopes=["https://mail.google.com/"],
    client_secrets_file="credentials.json",
)
api_resource = build_resource_service(credentials=credentials)
toolkit = GmailToolkit(api_resource=api_resource)
```

## Tools

View available tools:

```python
tools = toolkit.get_tools()
tools
```

```text
[GmailCreateDraft(api_resource=<googleapiclient.discovery.Resource object at 0x1094509d0>),
 GmailSendMessage(api_resource=<googleapiclient.discovery.Resource object at 0x1094509d0>),
 GmailSearch(api_resource=<googleapiclient.discovery.Resource object at 0x1094509d0>),
 GmailGetMessage(api_resource=<googleapiclient.discovery.Resource object at 0x1094509d0>),
 GmailGetThread(api_resource=<googleapiclient.discovery.Resource object at 0x1094509d0>)]
```

- [GmailCreateDraft](https://reference.langchain.com/python/langchain-google-community/gmail/create_draft/GmailCreateDraft)
- [GmailSendMessage](https://reference.langchain.com/python/langchain-google-community/gmail/send_message/GmailSendMessage)
- [GmailSearch](https://reference.langchain.com/python/langchain-google-community/gmail/search/GmailSearch)
- [GmailGetMessage](https://reference.langchain.com/python/langchain-google-community/gmail/get_message/GmailGetMessage)
- [GmailGetThread](https://reference.langchain.com/python/langchain-google-community/gmail/get_thread/GmailGetThread)

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
example_query = "Draft an email to fake@fake.com thanking them for coffee."

stream = agent_executor.stream_events(
    {"messages": [("user", example_query)]},
    version="v3",
)
for snapshot in stream.values:
    snapshot["messages"][-1].pretty_print()
```

```text
================================ Human Message =================================

Draft an email to fake@fake.com thanking them for coffee.
================================== Ai Message ==================================
Tool Calls:
  create_gmail_draft (call_slGkYKZKA6h3Mf1CraUBzs6M)
 Call ID: call_slGkYKZKA6h3Mf1CraUBzs6M
  Args:
    message: Dear Fake,

I wanted to take a moment to thank you for the coffee yesterday. It was a pleasure catching up with you. Let's do it again soon!

Best regards,
[Your Name]
    to: ['fake@fake.com']
    subject: Thank You for the Coffee
================================= Tool Message =================================
Name: create_gmail_draft

Draft created. Draft Id: r-7233782721440261513
================================== Ai Message ==================================

I have drafted an email to fake@fake.com thanking them for the coffee. You can review and send it from your email draft with the subject "Thank You for the Coffee".
```

---

## API reference

For detailed documentation of all `GmailToolkit` features and configurations head to the [API reference](https://reference.langchain.com/python/langchain-google-community/gmail/toolkit/GmailToolkit).
