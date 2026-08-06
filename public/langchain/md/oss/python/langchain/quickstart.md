This quickstart shows you how to create a fully functional AI agent in just a few minutes.


> [!TIP]
>
> **Using an AI coding assistant?**
>
>     - Install the [LangChain Docs MCP server](https://docs.langchain.com/use-these-docs) to give your agent access to up-to-date LangChain documentation and examples.
>     - Install [LangChain Skills](https://github.com/langchain-ai/langchain-skills) to improve your agent's performance on LangChain ecosystem tasks.


## Install dependencies

Install the following packages to follow along:


    ```lc-tabs
    [
     {
      "label": "uv",
      "lang": "bash",
      "code": "uv init\nuv add langchain deepagents\nuv sync"
     },
     {
      "label": "pip",
      "lang": "bash",
      "code": "pip install -U langchain deepagents"
     },
     {
      "label": "venv",
      "lang": "bash",
      "code": "python3 -m venv .venv\nsource .venv/bin/activate\n# Windows: .venv\\Scripts\\activate\npip install -U langchain deepagents"
     }
    ]
    ```


## Set up API keys

Get an API key from [any supported model provider](lc:oss/python/integrations/providers/overview) (for example, Google Gemini or OpenAI).

Set the API keys, for example:

  #### Tab: OpenAI

```bash
export OPENAI_API_KEY="your-api-key"
```

  
  #### Tab: Google Gemini

```bash
export GOOGLE_API_KEY="your-api-key"
```

  
  #### Tab: Claude (Anthropic)

```bash
export ANTHROPIC_API_KEY="your-api-key"
```

  
  #### Tab: OpenRouter

```bash
export OPENROUTER_API_KEY="your-api-key"
```

  
  #### Tab: Fireworks

```bash
export FIREWORKS_API_KEY="your-api-key"
```

  
  #### Tab: Baseten

```bash
export BASETEN_API_KEY="your-api-key"
```

  
  #### Tab: Ollama

```bash
# Local: Ollama must be running (https://ollama.com)
# Cloud: Set your Ollama API key for hosted inference
export OLLAMA_API_KEY="your-api-key"
```

  
  #### Tab: Azure

```bash
export AZURE_OPENAI_API_KEY="your-api-key"
export AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com"
export AZURE_OPENAI_DEPLOYMENT_NAME="your-deployment"
```

  
  #### Tab: AWS Bedrock

```bash
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_REGION="us-east-1"
```

  
  #### Tab: HuggingFace

```bash
export HUGGINGFACEHUB_API_TOKEN="hf_..."
```

  
  #### Tab: Other

    See the full list of supported [chat model integrations](lc:oss/python/integrations/chat/index).
  


> [!TIP]
>
> **Using LangSmith Gateway**
>
>     The [LangSmith Gateway](lc:langsmith/llm-gateway) routes most major providers through LangSmith. You can [bring your own provider keys](lc:langsmith/llm-gateway-quickstart#2-make-a-call), or use [Gateway Credits](lc:langsmith/llm-gateway-credits) to access models without a provider key.


## Build a basic agent

Start by creating a simple agent that can answer questions and call tools. The agent in this example uses the chosen language model, a basic weather function as a tool, and a simple prompt to guide its behavior:


    ```lc-tabs
    [
     {
      "label": "OpenAI",
      "lang": "python",
      "code": "from langchain.agents import create_agent\n\ndef get_weather(city: str) -> str:\n    \"\"\"Get weather for a given city.\"\"\"\n    return f\"It's always sunny in {city}!\"\n\nagent = create_agent(\n    model=\"openai:gpt-5.5\",\n    tools=[get_weather],\n    system_prompt=\"You are a helpful assistant\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]}\n)\nprint(result[\"messages\"][-1].content_blocks)"
     },
     {
      "label": "Google Gemini",
      "lang": "python",
      "code": "from langchain.agents import create_agent\n\ndef get_weather(city: str) -> str:\n    \"\"\"Get weather for a given city.\"\"\"\n    return f\"It's always sunny in {city}!\"\n\nagent = create_agent(\n    model=\"google_genai:gemini-2.5-flash-lite\",\n    tools=[get_weather],\n    system_prompt=\"You are a helpful assistant\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]}\n)\nprint(result[\"messages\"][-1].content_blocks)"
     },
     {
      "label": "Claude (Anthropic)",
      "lang": "python",
      "code": "from langchain.agents import create_agent\n\ndef get_weather(city: str) -> str:\n    \"\"\"Get weather for a given city.\"\"\"\n    return f\"It's always sunny in {city}!\"\n\nagent = create_agent(\n    model=\"claude-sonnet-4-6\",\n    tools=[get_weather],\n    system_prompt=\"You are a helpful assistant\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]}\n)\nprint(result[\"messages\"][-1].content_blocks)"
     },
     {
      "label": "OpenRouter",
      "lang": "python",
      "code": "from langchain.agents import create_agent\n\ndef get_weather(city: str) -> str:\n    \"\"\"Get weather for a given city.\"\"\"\n    return f\"It's always sunny in {city}!\"\n\nagent = create_agent(\n    model=\"openrouter:anthropic/claude-sonnet-4-6\",\n    tools=[get_weather],\n    system_prompt=\"You are a helpful assistant\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]}\n)\nprint(result[\"messages\"][-1].content_blocks)"
     },
     {
      "label": "Fireworks",
      "lang": "python",
      "code": "from langchain.agents import create_agent\n\ndef get_weather(city: str) -> str:\n    \"\"\"Get weather for a given city.\"\"\"\n    return f\"It's always sunny in {city}!\"\n\nagent = create_agent(\n    model=\"fireworks:accounts/fireworks/models/qwen3p5-397b-a17b\",\n    tools=[get_weather],\n    system_prompt=\"You are a helpful assistant\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]}\n)\nprint(result[\"messages\"][-1].content_blocks)"
     },
     {
      "label": "Baseten",
      "lang": "python",
      "code": "from langchain.agents import create_agent\n\ndef get_weather(city: str) -> str:\n    \"\"\"Get weather for a given city.\"\"\"\n    return f\"It's always sunny in {city}!\"\n\nagent = create_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    tools=[get_weather],\n    system_prompt=\"You are a helpful assistant\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]}\n)\nprint(result[\"messages\"][-1].content_blocks)"
     },
     {
      "label": "Ollama",
      "lang": "python",
      "code": "from langchain.agents import create_agent\n\ndef get_weather(city: str) -> str:\n    \"\"\"Get weather for a given city.\"\"\"\n    return f\"It's always sunny in {city}!\"\n\nagent = create_agent(\n    model=\"ollama:devstral-2\",\n    tools=[get_weather],\n    system_prompt=\"You are a helpful assistant\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]}\n)\nprint(result[\"messages\"][-1].content_blocks)"
     },
     {
      "label": "Azure",
      "lang": "python",
      "code": "from langchain.agents import create_agent\nfrom langchain.chat_models import init_chat_model\n\ndef get_weather(city: str) -> str:\n    \"\"\"Get weather for a given city.\"\"\"\n    return f\"It's always sunny in {city}!\"\n\nmodel = init_chat_model(\n    \"azure_openai:gpt-5.5\",\n    azure_deployment=os.environ[\"AZURE_OPENAI_DEPLOYMENT_NAME\"],\n)\nagent = create_agent(\n    model=model,\n    tools=[get_weather],\n    system_prompt=\"You are a helpful assistant\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]}\n)\nprint(result[\"messages\"][-1].content_blocks)"
     },
     {
      "label": "AWS Bedrock",
      "lang": "python",
      "code": "from langchain.agents import create_agent\n\ndef get_weather(city: str) -> str:\n    \"\"\"Get weather for a given city.\"\"\"\n    return f\"It's always sunny in {city}!\"\n\nagent = create_agent(\n    model=\"bedrock_converse:us.anthropic.claude-sonnet-4-6\",\n    tools=[get_weather],\n    system_prompt=\"You are a helpful assistant\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]}\n)\nprint(result[\"messages\"][-1].content_blocks)"
     },
     {
      "label": "HuggingFace",
      "lang": "python",
      "code": "from langchain.agents import create_agent\n\ndef get_weather(city: str) -> str:\n    \"\"\"Get weather for a given city.\"\"\"\n    return f\"It's always sunny in {city}!\"\n\nagent = create_agent(\n    model=\"huggingface:microsoft/Phi-3-mini-4k-instruct\",\n    tools=[get_weather],\n    system_prompt=\"You are a helpful assistant\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]}\n)\nprint(result[\"messages\"][-1].content_blocks)"
     }
    ]
    ```


When you run the code and prompt the agent to tell you about the weather in San Francisco, the agent uses that input and its available context.
The agent understands that you are asking about the weather for the city San Francisco and therefore calls the weather tool with the provided city name.


> [!TIP]
>
> You can use [any supported model](lc:oss/python/integrations/providers/overview) by changing the model name and setting up the appropriate API key. Trace what is happening inside your agent with [LangSmith](https://smith.langchain.com). Follow the [tracing quickstart](lc:langsmith/trace-with-langchain) to get set up.
>
> We recommend you also set up [LangSmith Engine](lc:langsmith/engine) which monitors your traces, detects issues, and proposes fixes.


## Build a real-world agent

In the following example you will build a research agent that can answer questions about text files.
Along the way you will explore the following concepts:

1. **Detailed system prompts** for better agent behavior
1. **Create tools** that integrate with external data
1. **Model configuration** for consistent responses
1. **Conversational memory** for chat-like interactions
1. **Deep Agents** for built-in features
1. **Testing** your agent

    #### Step: Define the system prompt

        The system prompt defines your agent’s role and behavior. Keep it specific and actionable:

        ```python wrap
        SYSTEM_PROMPT = """You are a literary data assistant.
        
        ## Capabilities
        
        - `fetch_text_from_url`: loads document text from a URL into the conversation.
        Do not guess line counts or positions—ground them in tool results from the saved file."""
        ```


    
    #### Step: Create tools

        [Tools](lc:oss/python/langchain/tools) let a model interact with external systems by calling functions you define.
        Tools can depend on [runtime context](lc:oss/python/langchain/runtime) and also interact with [agent memory](lc:oss/python/langchain/short-term-memory).

        This example uses a tool to load a document from a given URL:

        ```python

        from langchain.tools import tool

        @tool
        def fetch_text_from_url(url: str) -> str:
            """Fetch the document from a URL.
            """
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "Mozilla/5.0 (compatible; quickstart-research/1.0)"},
            )
            try:
                with urllib.request.urlopen(req, timeout=120) as resp:
                    raw = resp.read()
            except urllib.error.URLError as e:
                return f"Fetch failed: {e}"
            text = raw.decode("utf-8", errors="replace")
            return text
        ```

        

> [!TIP]
>
> Tools should be well-documented: their name, description, and argument names become part of the model's prompt.
>             LangChain's ``@tool` decorator`[@tool] adds metadata and enables runtime injection with the `ToolRuntime` parameter.
>             Learn more in the [tools guide](lc:oss/python/langchain/tools).


    
    #### Step: Configure your model

        Set up your [language model](lc:oss/python/langchain/models) with the right parameters for your use case. For example:

        
            ```lc-tabs
            [
             {
              "label": "OpenAI",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nmodel = init_chat_model(\n    \"openai:gpt-5.5\",\n    temperature=0.5,\n    timeout=300,\n    max_tokens=25000,\n)"
             },
             {
              "label": "Google Gemini",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nmodel = init_chat_model(\n    \"gemini-3.1-pro-preview\",\n    model_provider=\"google-genai\",\n    temperature=0.5,\n    timeout=600,\n    max_tokens=25000,\n    streaming=True,\n)"
             },
             {
              "label": "Claude (Anthropic)",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nmodel = init_chat_model(\n    \"claude-sonnet-4-6\",\n    temperature=0.5,\n    timeout=600,\n    max_tokens=25000,\n    streaming=True,\n)"
             },
             {
              "label": "OpenRouter",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nmodel = init_chat_model(\n    \"openrouter:anthropic/claude-sonnet-4-6\",\n    temperature=0.5,\n    timeout=300,\n    max_tokens=25000,\n)"
             },
             {
              "label": "Fireworks",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nmodel = init_chat_model(\n    \"fireworks:accounts/fireworks/models/qwen3p5-397b-a17b\",\n    temperature=0.5,\n    timeout=300,\n    max_tokens=25000,\n)"
             },
             {
              "label": "Baseten",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nmodel = init_chat_model(\n    \"baseten:zai-org/GLM-5.2\",\n    temperature=0.5,\n    timeout=300,\n    max_tokens=25000,\n)"
             },
             {
              "label": "Ollama",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nmodel = init_chat_model(\n    \"ollama:devstral-2\",\n    temperature=0.5,\n    timeout=300,\n    max_tokens=25000,\n)"
             },
             {
              "label": "Azure",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nmodel = init_chat_model(\n    \"azure_openai:gpt-5.5\",\n    temperature=0.5,\n    timeout=300,\n    max_tokens=25000,\n    azure_deployment=os.environ[\"AZURE_OPENAI_DEPLOYMENT_NAME\"],\n)"
             },
             {
              "label": "AWS Bedrock",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nmodel = init_chat_model(\n    \"us.anthropic.claude-sonnet-4-6\",\n    model_provider=\"bedrock_converse\",\n    temperature=0.5,\n    timeout=300,\n    max_tokens=25000,\n)"
             },
             {
              "label": "HuggingFace",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nmodel = init_chat_model(\n    \"microsoft/Phi-3-mini-4k-instruct\",\n    model_provider=\"huggingface\",\n    temperature=0.5,\n    timeout=300,\n    max_tokens=25000,\n)"
             }
            ]
            ```
        


        Depending on the model and provider chosen, initialization parameters may vary; refer to their reference pages for details.
    
    #### Step: Add memory

        Add [memory](lc:oss/python/langchain/short-term-memory) to your agent to maintain state across interactions. This allows
        the agent to remember previous conversations and context.

        ```python
        from langgraph.checkpoint.memory import InMemorySaver

        checkpointer = InMemorySaver()
        ```


        

> [!NOTE]
>
> In production, use a persistent checkpointer that saves message history to a database.
>             See [Add and manage memory](lc:oss/python/langgraph/add-memory#manage-short-term-memory) for more details.


    
    #### Step: Create and run the agent

        Now assemble your agent with all the components and run it.

        There are two different frameworks for creating agents: LangChain agents and deep agents.
        Both LangChain and deep agents provide you with fine-grained control over tools, memory, and more.
        The main difference between both is that deep agents come with a range of commonly useful capabilities already built in, such as planning, file system tools, and subagents.

        Use deep agents when you want maximum capability with minimal setup; choose LangChain agents when you need fine-grained control.

        

> [!WARNING]
>
> Since the code invokes the model with the entire text from The Great Gatsby, it uses a large amount of tokens.
>
>             You can view example output in the next step.


        Let's try both:


        ```python wrap
        from langchain.agents import create_agent
        from deepagents import create_deep_agent
        
        agent = create_agent(
            model=model,
            tools=[fetch_text_from_url],
            system_prompt=SYSTEM_PROMPT,
            checkpointer=checkpointer,
        )
        
        deep_agent = create_deep_agent(
            model=model,
            tools=[fetch_text_from_url],
            system_prompt=SYSTEM_PROMPT,
            checkpointer=checkpointer,
        )
        
        content = f"""Project Gutenberg hosts a full plain-text copy of F. Scott Fitzgerald's The Great Gatsby.
        URL: https://www.gutenberg.org/files/64317/64317-0.txt
        
        Answer as much as you can:
        
        1) How many lines in the complete Gutenberg file contain the substring `Gatsby` (count lines, not occurrences within a line, each line ends with a line break).
        2) The 1-based line number of the first line in the file that contains `Daisy`.
        3) A two-sentence neutral synopsis.
        
        Do your best on (1) and (2). If at any point you realize you cannot **verify** an exact answer with
        your available tools and reasoning, do not fabricate numbers: use `null` for that field and spell out
        the limitation in `how_you_computed_counts`. If you encounter any errors please report what the error was and what the error message was."""
        
        agent_result = agent.invoke(
            {"messages": [{"role": "user", "content": content}]},
            config={"configurable": {"thread_id": "great-gatsby-lc"}},
        )
        deep_agent_result = deep_agent.invoke(
            {"messages": [{"role": "user", "content": content}]},
            config={"configurable": {"thread_id": "great-gatsby-da"}},
        )
        print(agent_result["messages"][-1].content_blocks)
        print("\n")
        print(deep_agent_result["messages"][-1].content_blocks)
        ```


        

> [!DETAILS] Full example code
>
> ```python wrap
>
>         from langchain.agents import create_agent
>         from deepagents import create_deep_agent
>         from langchain.chat_models import init_chat_model
>         from langchain.tools import tool
>         from langgraph.checkpoint.memory import InMemorySaver
>
>         SYSTEM_PROMPT = """You are a literary data assistant.
>
>         ## Capabilities
>
>         - `fetch_text_from_url`: loads document text from a URL into the conversation.
>         Do not guess line counts or positions—ground them in tool results from the saved file."""
>
>         @tool
>         def fetch_text_from_url(url: str) -> str:
>             """Fetch the document from a URL.
>             """
>             req = urllib.request.Request(
>                 url,
>                 headers={"User-Agent": "Mozilla/5.0 (compatible; quickstart-research/1.0)"},
>             )
>             try:
>                 with urllib.request.urlopen(req, timeout=120) as resp:
>                     raw = resp.read()
>             except urllib.error.URLError as e:
>                 return f"Fetch failed: {e}"
>             text = raw.decode("utf-8", errors="replace")
>             return text
>
>         model = init_chat_model(
>             "gemini-3.1-pro-preview",
>             model_provider="google-genai",
>             temperature=0.5,
>             timeout=600,
>             max_tokens=25000,
>             streaming=True,
>         )
>
>         checkpointer = InMemorySaver()
>
>         agent = create_agent(
>             model=model,
>             tools=[fetch_text_from_url],
>             system_prompt=SYSTEM_PROMPT,
>             checkpointer=checkpointer,
>         )
>
>         deep_agent = create_deep_agent(
>             model=model,
>             tools=[fetch_text_from_url],
>             system_prompt=SYSTEM_PROMPT,
>             checkpointer=checkpointer,
>         )
>
>         content = f"""Project Gutenberg hosts a full plain-text copy of F. Scott Fitzgerald's The Great Gatsby.
>         URL: https://www.gutenberg.org/files/64317/64317-0.txt
>
>         Answer as much as you can:
>
>         1) How many lines in the complete Gutenberg file contain the substring `Gatsby` (count lines, not occurrences within a line, each line ends with a line break).
>         2) The 1-based line number of the first line in the file that contains `Daisy`.
>         3) A two-sentence neutral synopsis.
>
>         Do your best on (1) and (2). If at any point you realize you cannot **verify** an exact answer with
>         your available tools and reasoning, do not fabricate numbers: use `null` for that field and spell out
>         the limitation in `how_you_computed_counts`. If you encounter any errors please report what the error was and what the error message was."""
>
>         agent_result = agent.invoke(
>             {"messages": [{"role": "user", "content": content}]},
>             config={"configurable": {"thread_id": "great-gatsby-lc"}},
>         )
>         deep_agent_result = deep_agent.invoke(
>             {"messages": [{"role": "user", "content": content}]},
>             config={"configurable": {"thread_id": "great-gatsby-da"}},
>         )
>         print(agent_result["messages"][-1].content_blocks)
>         print("\n")
>         print(deep_agent_result["messages"][-1].content_blocks)
>         ```


    
    #### Step: Review the results

        The results will differ based on the model and the execution.

        
        #### Tab: LangChain agents

        ````txt wrap expandable
        **1) Number of lines containing `Gatsby`:** `null`

        **2) First line containing `Daisy`:** `null`

        **3) Synopsis:**
        The Great Gatsby follows the mysterious millionaire Jay Gatsby and his obsession with reuniting with his former lover, Daisy Buchanan, as narrated by his neighbor Nick Carraway. Set against the backdrop of the Roaring Twenties on Long Island, the novel explores themes of wealth, class, and the elusive nature of the American Dream.

        **how_you_computed_counts:**
        I successfully fetched the full text of the eBook using the `fetch_text_from_url` tool. However, because I do not have access to a code execution environment (like Python) or text-processing tools (like `grep`), I cannot deterministically split the text by line breaks, iterate through the thousands of lines, and verify the exact line numbers or match counts. LLMs cannot reliably perform exact line-counting or indexing over massive texts within their context window without external computational tools. As instructed, rather than fabricating or guessing a number, I have output `null` for the exact counts and positions.
        ````

        
        #### Tab: Deep agents

        ````txt wrap expandable
        Based on the text fetched directly from the Gutenberg URL and analyzed using filesystem search tools, here are the answers to your questions:

        **1) Lines containing the substring `Gatsby`**
        **258** lines contain the exact substring `Gatsby`.

        **2) First line containing `Daisy`**
        Line **181** is the first line in the file that contains the exact substring `Daisy`.
        *(For context, the line reads: "Buchanans. Daisy was my second cousin once removed, and I’d known Tom")*

        **3) Two-sentence neutral synopsis**
        *The Great Gatsby* follows the mysterious millionaire Jay Gatsby and his obsessive pursuit to reunite with his former lover, Daisy Buchanan, in 1920s Long Island. The story is narrated by Nick Carraway, who observes the tragic consequences of Gatsby's relentless ambition and the shallow materialism of the era's wealthy elite.

        ***

        **How counts were computed:**
        When fetching the document from the URL, the file was too large for the standard output and was automatically saved to the local filesystem by the system (`/large_tool_results/x246ax2x`). I then used the `grep` tool to search the saved file for the exact literal substrings `Gatsby` and `Daisy`. The `grep` tool returned every matching line along with its 1-based line number. I manually counted the exact number of lines returned for `Gatsby` (which totaled 258) and identified the first line number returned for `Daisy` (which was 181). I also verified there were no uppercase variations (`GATSBY` or `DAISY`) that would have been missed. No errors were encountered during this process.
        ````

        
        

        If you look at the output on both tabs, you notice that the LangChain agent provided answers but they are estimates. The agent lacks the tools to answer this question. You may also get errors that the prompt is too long.

        The deep agent, on the other hand can:

        1. **Plans its approach** using the built-in [`write_todos`](https://docs.langchain.com/oss/deepagents/harness#task-planning) tool to break down the research task.
        1. **Loads the file** by calling the `fetch_text_from_url` tool to gather information.
        1. **Manages context** by using file system tools ([`grep`](https://docs.langchain.com/oss/deepagents/harness#virtual-filesystem-access) and [`read_file`](https://docs.langchain.com/oss/deepagents/harness#virtual-filesystem-access)).
        1. **Spawns subagents** as needed to delegate complex subtasks to specialized subagents.

        For LangChain agents, you must implement more capabilities to get a similar level of service and can customize them along the way as needed.

    

## Trace agent calls

Most interesting applications you build with LangChain make many calls to LLMs. As these applications get more complex, it becomes important to be able to inspect what exactly is going on inside your agent. The best way to do this is with [LangSmith](https://smith.langchain.com).

Sign up for a [LangSmith](https://smith.langchain.com) account and set these to start logging traces:

```shell
export LANGSMITH_TRACING="true"
export LANGSMITH_API_KEY="..."
```

Once set, run your script again and then inspect what happened during your agent calls on [LangSmith](https://smith.langchain.com) .


> [!TIP]
>
> To learn more about tracing your agent with LangSmith, see the [LangSmith documentation](lc:langsmith/trace-with-langchain).
>
> We recommend you also set up [LangSmith Engine](lc:langsmith/engine) which monitors your traces, detects issues, and proposes fixes.


## Next steps

You now have agents that can:

- **Understand context** and remember conversations
- **Use tools** intelligently
- **Provide structured responses** in a consistent format
- **Handle user-specific information** through context
- **Maintain conversation state** across interactions
- **Plan, research, and synthesize** (deep agents only)

Continue with:

- **LangChain agents**: [Add and manage memory](lc:oss/python/langgraph/add-memory#manage-short-term-memory), [deploy to production](lc:oss/python/langgraph/deploy)
- **Deep Agents**: [Customization options](lc:oss/python/deepagents/customization), [persistent memory](lc:oss/python/deepagents/memory), [deploy to production](lc:oss/python/langgraph/deploy)
