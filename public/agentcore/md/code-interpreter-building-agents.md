# Run code in Code Interpreter from Agents - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-building-agents.html

---

# Run code in Code Interpreter from Agents

You can build agents that use the Code Interpreter tool to execute code and analyze data. This section demonstrates how to build agents using different frameworks.

###### Example

Strands
    

  1. You can build an agent that uses the Code Interpreter tool using the Strands framework:

**Install dependencies**

Run the following commands to install the required packages:

```bash
pip install strands-agents
pip install bedrock-agentcore
```
**Write an agent with Code Interpreter tool**

The following Python code shows how to write an agent using Strands with the Code Interpreter tool:

```bash
# strands_ci_agent.py

import json
from strands import Agent, tool
from bedrock_agentcore.tools.code_interpreter_client import code_session
import asyncio

#Define the detailed system prompt for the assistant
SYSTEM_PROMPT = """You are a helpful AI assistant that validates all answers through code execution.

VALIDATION PRINCIPLES:
1. When making claims about code, algorithms, or calculations - write code to verify them
2. Use execute_python to test mathematical calculations, algorithms, and logic
3. Create test scripts to validate your understanding before giving answers
4. Always show your work with actual code execution
5. If uncertain, explicitly state limitations and validate what you can

APPROACH:
- If asked about a programming concept, implement it in code to demonstrate
- If asked for calculations, compute them programmatically AND show the code
- If implementing algorithms, include test cases to prove correctness
- Document your validation process for transparency
- The state is maintained between executions, so you can refer to previous results

TOOL AVAILABLE:
- execute_python: Run Python code and see output

RESPONSE FORMAT: The execute_python tool returns a JSON response with:
- sessionId: The code interpreter session ID
- id: Request ID
- isError: Boolean indicating if there was an error
- content: Array of content objects with type and text/data
- structuredContent: For code execution, includes stdout, stderr, exitCode, executionTime

For successful code execution, the output will be in content[0].text and also in structuredContent.stdout.
Check isError field to see if there was an error.

Be thorough, accurate, and always validate your answers when possible."""

#Define and configure the code interpreter tool
@tool
def execute_python(code: str, description: str = "") -> str:
    """Execute Python code"""

    if description:
        code = f"# {description}\n{code}"

    #Print code to be executed
    print(f"\n Code: {code}")

    # Call the Invoke method and execute the generated code, within the initialized code interpreter session
    with code_session("<Region>") as code_client:
        response = code_client.invoke("executeCode", {
        "code": code,
        "language": "python",
        "clearContext": False
    })

    for event in response["stream"]:
        return json.dumps(event["result"])

#configure the strands agent including the tool(s)
agent=Agent(
        tools=[execute_python],
        system_prompt=SYSTEM_PROMPT,
        callback_handler=None)

query="Can all the planets in the solar system fit between the earth and moon?"

# Invoke the agent asynchcronously and stream the response
async def main():
    response_text = ""
    async for event in agent.stream_async(query):
        if "data" in event:
            # Stream text response
            chunk = event["data"]
            response_text += chunk
            print(chunk, end="")

asyncio.run(main())
```
LangChain
    

  1. You can build an agent that uses the Code Interpreter tool using the LangChain framework:

**Install dependencies**

Run the following commands to install the required packages:

```bash
pip install langchain
pip install langchain_aws
pip install bedrock-agentcore
```
**Write an agent with Code Interpreter tool**

The following Python code shows how to write an agent using LangChain with the Code Interpreter tool:

```bash
# langchain_ci_agent.py

#Please ensure that the latest Bedrock-AgentCore and Boto SDKs are installed
#Import Bedrock-AgentCore and other libraries

import json
from bedrock_agentcore.tools.code_interpreter_client import code_session
from langchain.agents import AgentExecutor, create_tool_calling_agent, initialize_agent, tool
from langchain_aws import ChatBedrockConverse
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

#Define and configure the code interpreter tool
@tool
def execute_python(code: str, description: str = "") -> str:
    """Execute Python code"""

    if description:
        code = f"# {description}\n{code}"

    #Print the code to be executed
    print(f"\nGenerated Code: \n{code}")

# Call the Invoke method and execute the generated code, within the initialized code interpreter session
    with code_session("<Region>") as code_client:
        response = code_client.invoke("executeCode", {
        "code": code,
        "language": "python",
        "clearContext": False
    })
    for event in response["stream"]:
        return json.dumps(event["result"])

# Initialize the language model
# Please ensure access to anthropic.claude-3-5-sonnet model in Amazon Bedrock
llm = ChatBedrockConverse(
            model_id="anthropic.claude-3-5-sonnet-20240620-v1:0",
            region_name="<Region>"
        )

#Define the detailed system prompt for the assistant
SYSTEM_PROMPT = """You are a helpful AI assistant that validates all answers through code execution.

VALIDATION PRINCIPLES:
1. When making claims about code, algorithms, or calculations - write code to verify them
2. Use execute_python to test mathematical calculations, algorithms, and logic
3. Create test scripts to validate your understanding before giving answers
4. Always show your work with actual code execution
5. If uncertain, explicitly state limitations and validate what you can

APPROACH:
- If asked about a programming concept, implement it in code to demonstrate
- If asked for calculations, compute them programmatically AND show the code
- If implementing algorithms, include test cases to prove correctness
- Document your validation process for transparency
- The code interpreter maintains state between executions, so you can refer to previous results

TOOL AVAILABLE:
- execute_python: Run Python code and see output

RESPONSE FORMAT: The execute_python tool returns a JSON response with:
- sessionId: The code interpreter session ID
- id: Request ID
- isError: Boolean indicating if there was an error
- content: Array of content objects with type and text/data
- structuredContent: For code execution, includes stdout, stderr, exitCode, executionTime

For successful code execution, the output will be in content[0].text and also in structuredContent.stdout.
Check isError field to see if there was an error.

Be thorough, accurate, and always validate your answers when possible."""

# Create a list of our custom tools
tools = [execute_python]

# Define the prompt template
prompt = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT),
    ("user", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad"),
])

# Create the agent
agent = create_tool_calling_agent(llm, tools, prompt)
# Create the agent executor
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

query="Can all the planets in the solar system fit between the earth and moon?"
resp=agent_executor.invoke({"input": query})

#print the result
print(resp['output'][0]['text'])
```
