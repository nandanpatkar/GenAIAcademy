# Use any agent framework - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/using-any-agent-framework.html

---

# Use any agent framework

You can use open source AI frameworks to create an agent or tool. This topic shows examples for a variety of frameworks, including Strands Agents, LangGraph, and Google ADK.

###### Topics

  * Strands Agents

  * LangGraph

  * Google Agent Development Kit (ADK)

  * OpenAI Agents SDK


## Strands Agents

For the full example, see [https://github.com/awslabs/amazon-bedrock-agentcore-samples/tree/main/03-integrations/agentic-frameworks/strands-agents](<https://github.com/awslabs/amazon-bedrock-agentcore-samples/tree/main/03-integrations/agentic-frameworks/strands-agents>).

```python
import os
from strands import Agent
from strands_tools import file_read, file_write, editor

agent = Agent(tools=[file_read, file_write, editor])

from bedrock_agentcore.runtime import BedrockAgentCoreApp
app = BedrockAgentCoreApp()
@app.entrypoint
def agent_invocation(payload, context):
    """Handler for agent invocation"""
    user_message = payload.get("prompt", "")
    if not isinstance(user_message, str) or not user_message.strip():
        return {"error": "Invalid input: 'prompt' must be a non-empty string"}
    result = agent(user_message)
    print("context:\n-------\n", context)
    print("result:\n*******\n", result)
    return {"result": result.message}
app.run()
```
## LangGraph

For the full example, see [https://github.com/awslabs/amazon-bedrock-agentcore-samples/tree/main/03-integrations/agentic-frameworks/langgraph](<https://github.com/awslabs/amazon-bedrock-agentcore-samples/tree/main/03-integrations/agentic-frameworks/langgraph>).

```python
from langchain.chat_models import init_chat_model
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
#------------------------------------------------
from bedrock_agentcore.runtime import BedrockAgentCoreApp
app = BedrockAgentCoreApp()
#------------------------------------------------

llm = init_chat_model(
    "us.anthropic.claude-3-5-haiku-20241022-v1:0",
    model_provider="bedrock_converse",
)

# Create graph
graph_builder = StateGraph(State)
...
# Add nodes and edges
...
graph = graph_builder.compile()

# Finally write your entrypoint
@app.entrypoint
def agent_invocation(payload, context):

    print("received payload")
    print(payload)

    tmp_msg = {"messages": [{"role": "user", "content": str(payload.get("prompt", "No prompt found in input, please guide customer as to what tools can be used"))}]}
    tmp_output = graph.invoke(tmp_msg)
    print(tmp_output)

    return {"result": tmp_output['messages'][-1].content}

app.run()
```
## Google Agent Development Kit (ADK)

For the full example, see [https://github.com/awslabs/amazon-bedrock-agentcore-samples/tree/main/03-integrations/agentic-frameworks/adk](<https://github.com/awslabs/amazon-bedrock-agentcore-samples/tree/main/03-integrations/agentic-frameworks/adk>).

```python
from google.adk.agents import Agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.tools import google_search
from google.genai import types
import asyncio
import os

# adapted form https://google.github.io/adk-docs/tools/built-in-tools/#google-search

APP_NAME="google_search_agent"
USER_ID="user1234"

# Agent Definition
# Add your GEMINI_API_KEY
root_agent = Agent(
    model="gemini-2.0-flash",
    name="openai_agent",
    description="Agent to answer questions using Google Search.",
    instruction="I can answer your questions by searching the internet. Just ask me anything!",
    # google_search is a pre-built tool which allows the agent to perform Google searches.
    tools=[google_search]
)

# Session and Runner
async def setup_session_and_runner(user_id, session_id):
    session_service = InMemorySessionService()
    session = await session_service.create_session(app_name=APP_NAME, user_id=user_id, session_id=session_id)
    runner = Runner(agent=root_agent, app_name=APP_NAME, session_service=session_service)
    return session, runner

# Agent Interaction
async def call_agent_async(query, user_id, session_id):
    content = types.Content(role='user', parts=[types.Part(text=query)])
    session, runner = await setup_session_and_runner(user_id, session_id)
    events = runner.run_async(user_id=user_id, session_id=session_id, new_message=content)

    async for event in events:
        if event.is_final_response():
            final_response = event.content.parts[0].text
            print("Agent Response: ", final_response)

    return final_response

from bedrock_agentcore.runtime import BedrockAgentCoreApp
app = BedrockAgentCoreApp()

@app.entrypoint
def agent_invocation(payload, context):
    query = str(payload.get("prompt", "what is Bedrock Agentcore Runtime?"))
    return asyncio.run(call_agent_async(query, payload.get("user_id",USER_ID), context.session_id))

app.run()
```
## OpenAI Agents SDK

For the full example, see [https://github.com/awslabs/amazon-bedrock-agentcore-samples/tree/main/03-integrations/agentic-frameworks/openai-agents](<https://github.com/awslabs/amazon-bedrock-agentcore-samples/tree/main/03-integrations/agentic-frameworks/openai-agents>).

```python
from agents import Agent, Runner, WebSearchTool
import logging
import asyncio
import sys

# Set up logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("openai_agents")

# Configure OpenAI library logging
logging.getLogger("openai").setLevel(logging.DEBUG)

logger.debug("Initializing OpenAI agent with tools")
agent = Agent(
    name="Assistant",
    tools=[
        WebSearchTool(),
    ],
)

async def main(query=None):
    if query is None:
        query = "Which coffee shop should I go to, taking into account my preferences and the weather today in SF?"

    logger.debug(f"Running agent with query: {query}")

    try:
        logger.debug("Starting agent execution")
        result = await Runner.run(agent, query)
        logger.debug(f"Agent execution completed with result type: {type(result)}")
        return result
    except Exception as e:
        logger.error(f"Error during agent execution: {e}", exc_info=True)
        raise

# Integration with Bedrock AgentCore
from bedrock_agentcore.runtime import BedrockAgentCoreApp
app = BedrockAgentCoreApp()

@app.entrypoint
async def agent_invocation(payload, context):
    logger.debug(f"Received payload: {payload}")
    query = str(payload.get("prompt", "How can I help you today?"))

    try:
        result = await main(query)
        logger.debug("Agent execution completed successfully")
        return {"result": result.final_output}
    except Exception as e:
        logger.error(f"Error during agent execution: {e}", exc_info=True)
        return {"result": f"Error: {str(e)}"}

# Run the app when imported
if __name__== "__main__":
    app.run()
```
