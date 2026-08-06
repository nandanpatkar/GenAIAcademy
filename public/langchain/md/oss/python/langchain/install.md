To install the LangChain package:


    ```lc-tabs
    [
     {
      "label": "pip",
      "lang": "bash",
      "code": "pip install -U langchain\n# Requires Python 3.10+"
     },
     {
      "label": "uv",
      "lang": "bash",
      "code": "uv add langchain\n# Requires Python 3.10+"
     }
    ]
    ```


LangChain provides integrations to hundreds of LLMs and thousands of other integrations. These live in independent provider packages.


    ```lc-tabs
    [
     {
      "label": "pip",
      "lang": "bash",
      "code": "# Installing the OpenAI integration\npip install -U langchain-openai\n\n# Installing the Anthropic integration\npip install -U langchain-anthropic"
     },
     {
      "label": "uv",
      "lang": "bash",
      "code": "# Installing the OpenAI integration\nuv add langchain-openai\n\n# Installing the Anthropic integration\nuv add langchain-anthropic"
     }
    ]
    ```


> [!TIP]
>
> See the [Integrations tab](lc:oss/python/integrations/providers/overview) for a full list of available integrations.


Now that you have LangChain installed, you can get started by following the [Quickstart guide](lc:oss/python/langchain/quickstart).


> [!TIP]
>
> Set up [LangSmith](https://smith.langchain.com) tracing to debug your first LangChain app. Follow the [tracing quickstart](lc:langsmith/trace-with-langchain) to get started. We recommend you also set up [LangSmith Engine](lc:langsmith/engine) which monitors your traces, detects issues, and proposes fixes.
