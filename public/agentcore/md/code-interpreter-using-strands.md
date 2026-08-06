# Using AgentCore Code Interpreter via AWS Strands - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-using-strands.html

---

# Using AgentCore Code Interpreter via AWS Strands

The following sections show you how to use the Amazon Bedrock AgentCore Code Interpreter with the Strands SDK. Before you go through the examples in this section, see [Prerequisites](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-interpreter-getting-started.html#code-interpreter-prerequisites>).

###### Topics

  * Step 1: Install dependencies

  * Step 2: Create your agent with AgentCore Code Interpreter

  * Step 3: Run the agent


## Step 1: Install dependencies

Create a project folder and install the required packages:

###### Note

On Windows, use: `.venv\Scripts\activate`

```bash
mkdir agentcore-tools-quickstart
cd agentcore-tools-quickstart
python3 -m venv .venv
source .venv/bin/activate
```
Install the required packages:

```bash
pip install bedrock-agentcore strands-agents strands-agents-tools
```
These packages provide:

  * `bedrock-agentcore` : The SDK for Amazon Bedrock AgentCore tools including AgentCore Code Interpreter

  * `strands-agents` : The Strands agent framework

  * `strands-agents-tools` : The tools that the Strands agent framework offers


## Step 2: Create your agent with AgentCore Code Interpreter

Create a file named `code_interpreter_agent.py` and add the following code:

```python
from strands import Agent
from strands_tools.code_interpreter import AgentCoreCodeInterpreter

# Initialize the Code Interpreter tool
code_interpreter_tool = AgentCoreCodeInterpreter(region="<Region>")

# Define the agent's system prompt
SYSTEM_PROMPT = """You are an AI assistant that validates answers through code execution.
When asked about code, algorithms, or calculations, write Python code to verify your answers."""

# Create an agent with the Code Interpreter tool
agent = Agent(
    tools=[code_interpreter_tool.code_interpreter],
    system_prompt=SYSTEM_PROMPT
)

# Test the agent with a sample prompt
prompt = "Calculate the first 10 Fibonacci numbers."
print(f"\n\nPrompt: {prompt}\n\n")

response = agent(prompt)
print(response.message["content"][0]["text"])
```
This code:

  * Initializes the AgentCore Code Interpreter tool for your region

  * Creates an agent configured to use code execution for validation

  * Sends a prompt asking the agent to calculate Fibonacci numbers

  * Prints the agent’s response


## Step 3: Run the agent

Execute the script:

```text
python code_interpreter_agent.py
```
**Expected output**

You should see the agent’s response containing the first 10 Fibonacci numbers. The agent will write Python code to calculate the sequence and return both the code and the results.

If you encounter errors, verify:

  * Your IAM role has the correct permissions and trust policy

  * You have model access enabled in the Amazon Bedrock console

  * Your AWS credentials are properly configured



