In the [LangSmith UI](https://smith.langchain.com), ensure that your API key is set as a [workspace secret](lc:langsmith/set-up-hierarchy#configure-workspace-settings).

1. Navigate to  **Settings** and then move to the **Secrets** tab.
1. Select **Add secret** and enter the key environment variable (e.g.,`OPENAI_API_KEY` or `ANTHROPIC_API_KEY`) and your API key as the **Value**.
1. Select **Save secret**.


> [!NOTE]
>
> When adding workspace secrets in the LangSmith UI, make sure the secret keys match the environment variable names expected by your model provider.


> [!NOTE]
>
> If your provider authenticates with OAuth2 `client_credentials`, configure the credentials on the model configuration instead. Workspace secrets are not required in that case. See [OAuth client credentials](lc:langsmith/model-configurations#oauth-client-credentials).


Prompts guide the behavior of Large Language Models (LLM). [_Prompt engineering_](lc:langsmith/prompt-engineering-concepts) is the process of crafting, testing, and refining the instructions you give to an LLM so it produces reliable and useful responses.

LangSmith provides tools to create, version, test, and collaborate on prompts. You’ll also encounter common concepts like [_prompt templates_](lc:langsmith/prompt-engineering-concepts#prompts-vs-prompt-templates), which let you reuse structured prompts, and [_variables_](lc:langsmith/prompt-engineering-concepts#f-string-vs-mustache), which allow you to dynamically insert values (such as a user’s question) into a prompt.

In this quickstart, you’ll create, test, and improve prompts using either the UI or the SDK. This quickstart will use OpenAI as the example LLM provider, but the same workflow applies across other providers.

## Prerequisites

Before you begin, make sure you have:

- **A LangSmith account**: Sign up or log in at [smith.langchain.com](https://smith.langchain.com).
- **A LangSmith API key**: Follow the [Create an API key](lc:langsmith/create-account-api-key) guide.
- **An OpenAI API key**: Generate this from the [OpenAI dashboard](https://platform.openai.com/account/api-keys).

Select the tab for UI or SDK workflows:

#### Tab: UI

## 1. Set workspace secret


## 2. Create a prompt

1. In the [LangSmith UI](https://smith.langchain.com), navigate to the **Prompts** section in the left-hand menu.
1. Click on **+ Prompt** to create a prompt.
1. Modify the prompt by editing or adding prompts and input variables as needed.


![Playground with the system prompt ready for editing.](/langchain/images/langsmith/images/create-a-prompt-light.png)


![Playground with the system prompt ready for editing.](/langchain/images/langsmith/images/create-a-prompt-dark.png)


## 3. Test a prompt

1. Under the **Prompts** heading select the gear  icon next to the model name, which will launch the **Prompt Settings** window on the **Model Configuration** tab.
1. Set the [model configuration](lc:langsmith/managing-model-configurations) you want to use. The **Provider** and **Model** you select will determine the parameters that are configurable on this configuration page. Once set, click **Save as**.

    
    
![Model Configuration window in the LangSmith UI, settings for Provider, Model, Temperature, Max Output Tokens, Top P, Presence Penalty, Frequency Penalty, Reasoning Effort, etc.](/langchain/images/langsmith/images/model-config-light.png)


    
![Model Configuration window in the LangSmith UI, settings for Provider, Model, Temperature, Max Output Tokens, Top P, Presence Penalty, Frequency Penalty, Reasoning Effort, etc.](/langchain/images/langsmith/images/model-config-dark.png)

    

1. Specify the input variables you would like to test in the **Inputs** box and then click  **Start**.

    
    
![The input box with a question entered. The output box contains the response to the prompt.](/langchain/images/langsmith/images/set-input-start-light.png)


    
![The input box with a question entered. The output box contains the response to the prompt.](/langchain/images/langsmith/images/set-input-start-dark.png)

    

    To learn about more options for configuring your prompt in the Playground, refer to [Configure prompt settings](lc:langsmith/managing-model-configurations).

1. After testing and refining your prompt, click **Save** to store it for future use.

## 4. Iterate on a prompt

LangSmith allows for team-based prompt iteration. [Workspace](lc:langsmith/administration-overview#workspaces) members can experiment with prompts in the Playground and save their changes as a new [_commit_](lc:langsmith/prompt-engineering-concepts#commits) when ready.

To improve your prompts:

- Reference the documentation provided by your model provider for best practices in prompt creation, such as:
    - [Best practices for prompt engineering with the OpenAI API](https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api)
    - [Gemini's Introduction to prompt design](https://ai.google.dev/gemini-api/docs/prompting-intro)
- Build and refine your prompts with the Prompt Canvas—an interactive tool in LangSmith. Learn more in the [Prompt Canvas guide](lc:langsmith/write-prompt-with-ai).
- Tag specific commits to mark important moments in your commit history.
    1. To create a commit, navigate to the **Playground** and select **Commit**. Choose the prompt to commit changes to and then **Commit**.
    1. Navigate to **Prompts** in the left-hand menu. Select the prompt. On the prompt detail page, select **Tag** on the top right to add a [commit tag](lc:langsmith/manage-prompts#commit-tags).

#### Tab: SDK

## 1. Set up your environment

1. In your terminal, prepare your environment:

    

    ```lc-tabs
    [
     {
      "label": "Python",
      "lang": "bash",
      "code": "mkdir ls-prompt-quickstart && cd ls-prompt-quickstart\npython -m venv .venv\nsource .venv/bin/activate\npip install -qU langsmith openai langchain_core"
     },
     {
      "label": "TypeScript",
      "lang": "bash",
      "code": "mkdir ls-prompt-quickstart-ts && cd ls-prompt-quickstart-ts\nnpm init -y\nnpm install langsmith openai typescript ts-node\nnpx tsc --init"
     }
    ]
    ```

    

1. Set your API keys:

    ```bash
    export LANGSMITH_API_KEY='<your_api_key>'
    export OPENAI_API_KEY='<your_api_key>'
    ```

## 2. Create a prompt

To create a prompt, you'll define a list of messages that you want in your prompt and then push to LangSmith.

Use the language-specific constructor and push method:

- Python: `ChatPromptTemplate` → [`client.push_prompt(...)`](https://docs.smith.langchain.com/reference/python/client/langsmith.client.Client#langsmith.client.Client.push_prompt)
- TypeScript: [`ChatPromptTemplate.fromMessages(...)`](https://reference.langchain.com/javascript/langchain-core/prompts/ChatPromptTemplate) → [`client.pushPrompt(...)`](https://reference.langchain.com/javascript/langsmith/client/Client/pushPrompt)

1. Add the following code to a `create_prompt` file:

    

    ```python Python
    from langsmith import Client
    from langchain_core.prompts import ChatPromptTemplate
    
    client = Client()
    
    prompt = ChatPromptTemplate([
        ("system", "You are a helpful chatbot."),
        ("user", "{question}"),
    ])
    
    client.push_prompt("prompt-quickstart", object=prompt)
    ```

    

    This creates an ordered list of messages, wraps them in `ChatPromptTemplate`, and then pushes the prompt by name to your [workspace](lc:langsmith/administration-overview#workspaces) for versioning and reuse.

1. Run `create_prompt`:

    

    ```python Python
    python create_prompt.py
    ```

    

Follow the resulting link to view the newly created Prompt Hub prompt in the LangSmith UI.

## 3. Test a prompt

In this step, you'll pull the prompt you created in [step 2](#2-create-a-prompt) by name (`"prompt-quickstart"`), format it with a test input, convert it to OpenAI’s chat format, and call the OpenAI Chat Completions API.

Then, you'll iterate on the prompt by creating a new version. Members of your workspace can open an existing prompt, experiment with changes in the [UI](https://smith.langchain.com), and save those changes as a new commit on the same prompt, which preserves history for the whole team.

1. Add the following to a `test_prompt` file:

    

    ```python Python
    from langsmith import Client
    from openai import OpenAI
    from langchain_core.messages import convert_to_openai_messages
    
    client = Client()
    oai_client = OpenAI()
    
    prompt = client.pull_prompt("prompt-quickstart")
    
    # Since the prompt only has one variable you could also pass in the value directly
    # Equivalent to formatted_prompt = prompt.invoke("What is the color of the sky?")
    formatted_prompt = prompt.invoke({"question": "What is the color of the sky?"})
    
    response = oai_client.chat.completions.create(
        model="gpt-5.5",
        messages=convert_to_openai_messages(formatted_prompt.messages),
    )
    ```
    

    This loads the prompt by name using `pull` for the latest committed version of the prompt that you're testing. You can also specify a specific commit by passing the commit hash `"<prompt-name>:<commit-hash>"`

1. Run `test_prompt` :

    

    ```python Python
    python test_prompt.py
    ```

    

1. To create a new version of a prompt, call the same push method you used initially with the same prompt name and your updated template. LangSmith will record it as a new commit and preserve prior versions.

    Copy the following code to an `iterate_prompt` file:

    

    ```python Python
    from langsmith import Client
    from langchain_core.prompts import ChatPromptTemplate
    
    client = Client()
    
    new_prompt = ChatPromptTemplate([
        ("system", "You are a helpful chatbot. Respond in Spanish."),
        ("user", "{question}"),
    ])
    
    client.push_prompt("prompt-quickstart", object=new_prompt)
    ```

    

1. Run `iterate_prompt` :

    

    ```python Python
    python iterate_prompt.py
    ```
    

    Now your prompt will contain two commits.

To improve your prompts:

- Reference the documentation provided by your model provider for best practices in prompt creation, such as:
    - [Best practices for prompt engineering with the OpenAI API](https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api)
    - [Gemini's Introduction to prompt design](https://ai.google.dev/gemini-api/docs/prompting-intro)
- Build and refine your prompts with the Prompt Canvas—an interactive tool in LangSmith. Learn more in the [Prompt Canvas guide](lc:langsmith/write-prompt-with-ai).

## Next steps

- Learn more about how to store and manage prompts using the Prompt Hub in the [Create a prompt guide](lc:langsmith/create-a-prompt).
- Learn how to set up the Playground to [Test multi-turn conversations](lc:langsmith/multiple-messages) in this tutorial.
- Learn how to test your prompt's performance over a dataset instead of individual examples, refer to [Run an evaluation from the Playground](lc:langsmith/run-evaluation-from-playground).

> 
Use the **[Chat](lc:langsmith/chat)** in the Playground to help optimize your prompts, generate tools, and create output schemas.
