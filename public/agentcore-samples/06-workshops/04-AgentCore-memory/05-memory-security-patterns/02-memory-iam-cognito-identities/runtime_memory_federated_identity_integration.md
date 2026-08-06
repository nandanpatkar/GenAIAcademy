# Amazon Bedrock AgentCore Runtime and AgentCore Memory Agent with Identity Isolation using Cognito Federated Identities

## Overview

This tutorial demonstrates how to implement secure memory isolation in conversational agents using Amazon Bedrock AgentCore Memory with Cognito federated identities. You'll build a memory-enabled agent that automatically partitions and isolates conversation history based on authenticated user credentials from Amazon Cognito Identity Pool, ensuring data privacy and security in multi-tenant environments.

Memory isolation is a critical security requirement for production conversational agents. Without proper isolation, users could potentially access conversation history from other users, leading to privacy violations and data leakage. 

The implementation demonstrates how AgentCore Memory integrates with Amazon Cognito Identity Pools to automatically enforce memory boundaries based on federated user credentials, eliminating the need for custom authorization logic in your application code.

### Tutorial Details

| Information         | Details                                                          |
|---------------------|------------------------------------------------------------------|
| Tutorial type       | Security & Identity Management                                   |
| Agent type          | Single Conversational Agent                                      |
| Agentic Framework   | Strands Agents                                                   |
| LLM model           | Anthropic Claude 4.5 Haiku                                      |
| Key features        | Memory Isolation, Federated Identity, User Context               |
| SDK used            | boto3, bedrock-agentcore, bedrock-agentcore-starter-toolkit      |

### What You'll Learn

In this tutorial, you'll learn:
1. How to configure Cognito Identity Pools for federated identity in AgentCore Memory
2. How to propagate user identity through temporary AWS credentials
3. How to implement memory hooks with federated credentials for secure data partitioning
4. How to deploy and test multi-user agents with isolated memory spaces
5. How to verify memory isolation between different users using federated identities


### Architecture

This example demonstrates a conversational agent deployed to AgentCore Runtime with federated identity-based memory isolation:

<div style="text-align:left">
    <img src="architecture.png" width="90%"/>
</div>

## 0. Prerequisites

To execute this tutorial you will need:
* Python 3.10 or newer
* AWS credentials configured with appropriate permissions for Bedrock, ECR, IAM, and Cognito
* Amazon Bedrock model access (Claude 3.5 Haiku)
* Amazon Bedrock AgentCore SDK and dependencies

First, let's install the required libraries.

```python
!pip install -qUr requirements.txt
```

### Setting Up Environment

Let's import the required libraries and configure our environment. We'll be using:
- `boto3` for AWS service interactions
- `bedrock_agentcore.memory` for managing agent memory
- Various utility functions for setting up authentication

```python
# Imports
import os
import boto3
import uuid
import logging
from bedrock_agentcore_starter_toolkit.operations.memory.manager import MemoryManager
from utils import setup_cognito_user_pool, create_agentcore_role

# Configuration
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("runtime-memory-agent")
REGION = os.getenv("AWS_REGION", "us-west-2")
```

## 1. Creating Memory Resource

In this section, we'll create a memory resource for our agent to store conversation history. Memory allows the agent to recall past interactions, maintain context, and provide more coherent responses over time.

For this example, we'll create a simple short-term memory resource without any additional long-term strategies. The memory will store all conversation messages, helping our agent remember previous interactions when continuing a session after it has been terminated in AgentCore Runtime.

```python
# Create unique identifier for this resource
unique_id = str(uuid.uuid4())[:8]
memory_name = f"RuntimeIdentityMemoryAgent_{unique_id}"

# Initialize Memory Manager
memory_manager = MemoryManager(region_name=REGION)

# Create memory
print("\n🧠 Creating memory...")
print("   This takes 2-3 minutes...\n")

memory = memory_manager.get_or_create_memory(
    name=memory_name,
    strategies=[],
    description="Memory isolation with IAM example.",
    event_expiry_days=30,  # Optional: adjust as needed
)

MEMORY_ID = memory.get("id")
print("\n✅ Memory created successfully!")
print(f"   Memory ID: {MEMORY_ID}")
print(f"   Status: {memory.get('status')}")
```

## 2. Creating the Amazon Cognito User Pool and Identity Pool

In this section, we'll create an Amazon Cognito User Pool, Identity Pool, and users. Cognito provides user authentication and identity management for our agent, ensuring that each user's conversation history is accessible only to that user through federated identity credentials.

The `setup_cognito_user_pool` function will:
1. Create a Cognito User Pool if it doesn't exist
2. Create a Cognito Identity Pool for federated identity
3. Set up app clients for authentication
4. Create 2 test users with temporary passwords
5. Generate access tokens and ID tokens for testing

```python
print("Setting up Amazon Cognito user pool and users...")
cognito_config = setup_cognito_user_pool(REGION, MEMORY_ID)
print("Cognito setup completed ✓")
```

## 3. Creating Your Memory-Enabled Agent

In this section, we'll build our memory-enabled agent using Strands Agents framework with custom hooks for memory integration. This agent will maintain conversation context by storing and retrieving messages from AgentCore Memory using federated identity credentials.

> **Why Memory Matters**: Sessions in AgentCore runtime expire after a certain time, which deletes the conversation context. By storing conversations in memory, we ensure previous information persists between sessions, creating a seamless experience for users even after long breaks.

### Agent Capabilities

Our agent will:
1. Store each user and assistant message in memory automatically
2. Retrieve past conversation history when continuing an existing session
3. Maintain context across multiple interactions with the same user
4. Isolate conversations between different users through federated identity verification

### Key Components of Our Implementation

#### 1. Memory Hook Provider
Our custom hook provider implements:
- `on_agent_initialized`: Triggered when the agent starts, retrieves conversation history from AgentCore Memory
- `on_message_added`: Triggered when a new message is added to the conversation, stores it in AgentCore Memory

#### 2. Agent Initialization
The `initialize_agent` function:
- Configures the memory hook with the correct region
- Sets up the agent with proper state variables (memory_id, actor_id, session_id)
- Configures the system prompt for the LLM

#### 3. Federated Credentials
The `get_aws_credentials_for_identity` function:
- Exchanges Cognito ID token for temporary AWS credentials
- Returns credentials that can be used to access AWS services with user-specific permissions

#### 4. Entry Point Handler
The runtime_memory_agent function:
- Parses input payload and extracts user message and ID token
- Obtains federated credentials using the ID token
- Manages agent initialization and session tracking
- Handles invocation of the agent with proper context
- Returns formatted responses to the runtime environment

Let's create our agent file:

```python
%%writefile runtime_identity_memory_agent.py
import os
import jwt
import ast
import json
import boto3
import logging
import datetime

from strands import Agent
from jwt import PyJWKClient
from typing import Dict, Any
from strands.models import BedrockModel
from bedrock_agentcore.memory.session import MemorySessionManager
from bedrock_agentcore.runtime import BedrockAgentCoreApp
from strands.hooks import AgentInitializedEvent, HookProvider, HookRegistry, MessageAddedEvent
from bedrock_agentcore.memory.constants import StrategyType, ConversationalMessage, MessageRole

# Configure detailed logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger("runtime-memory-agent")

# Initialize the agent core app
app = BedrockAgentCoreApp()

MODEL_ID = os.getenv('MODEL_ID')
MEMORY_ID = os.getenv('MEMORY_ID')
COGNITO_USER_POOL = os.getenv('COGNITO_USER_POOL')
IDENTITY_POOL_ID = os.getenv('IDENTITY_POOL_ID')
REGION = os.getenv('AWS_REGION')

# Global agent instance - will be initialized with first request
agent = None
memory_session_manager = None
actor_id = None

def get_aws_credentials_for_identity(identity_pool_id, id_token, region, user_pool_id):
    """
    Get temporary AWS credentials for a Cognito identity using a User Pool ID token
    """
    identity_client = boto3.client('cognito-identity', region_name=region)
    
    # Get ID from identity pool
    get_id_response = identity_client.get_id(
        IdentityPoolId=identity_pool_id,
        Logins={
            f'cognito-idp.{region}.amazonaws.com/{user_pool_id}': id_token
        }
    )
    identity_id = get_id_response['IdentityId']
    
    # Get credentials for the identity
    get_credentials_response = identity_client.get_credentials_for_identity(
        IdentityId=identity_id,
        Logins={
            f'cognito-idp.{region}.amazonaws.com/{user_pool_id}': id_token
        }
    )
    
    # Return the temporary credentials
    credentials = get_credentials_response['Credentials']
    return {
        'access_key_id': credentials['AccessKeyId'],
        'secret_key': credentials['SecretKey'],
        'session_token': credentials['SessionToken'],
        'expiration': credentials['Expiration'],
        'identity_id': identity_id
    }

class MemoryHookProvider(HookProvider):
    """Custom hook provider to integrate with Bedrock Memory"""
    
    def __init__(self):
        logger.info(f"Initializing MemoryHookProvider")
        # Use global memory_client that may have federated credentials
        self.memory_session_manager = memory_session_manager
    
    def on_agent_initialized(self, event: AgentInitializedEvent):
        """Load recent conversation history when agent starts"""
        logger.info("Agent initialization hook triggered")
        
        actor_id = event.agent.state.get("actor_id")
        session_id = event.agent.state.get("session_id")
        
        logger.info(f"State values - actor_id: {actor_id}, session_id: {session_id}")
        
        if not all([actor_id, session_id]):
            logger.warning("Missing required state values")
            return
        
        try:
            # Check if the session exists
            logger.info(f"Checking if session {session_id} exists...")
            session_exists = False
            try:
                events = self.memory_session_manager.list_events(
                    actor_id=actor_id,
                    session_id=session_id,
                    max_results=1
                )
                session_exists = len(events) > 0
                logger.info(f"Session exists: {session_exists}")
            except Exception as e:
                logger.warning(f"Error checking session existence: {e}")
                session_exists = False
            
            if not session_exists:
                logger.info(f"No existing conversation found for session {session_id}")
                return
            
            # Load conversation history
            logger.info(f"Loading conversation history for existing session {session_id}")
            recent_turns = self.memory_session_manager.get_last_k_turns(
                actor_id=actor_id,
                session_id=session_id,
                k=5
            )            

            if recent_turns:
                logger.info(f"✅ Loaded {len(recent_turns)} conversation turns from memory")
                
                # Add messages to agent's conversation history
                for turn in reversed(recent_turns):
                    for message in turn:
                        role = message['role'].lower()  # 'user' or 'assistant'
                        parsed = ast.literal_eval(message['content']['text'])
                        content = parsed[0]['text']
                        
                        # Add to agent's message history
                        event.agent.messages.append({
                            "role": role,
                            "content": [{"text": content}]
                        })
                        logger.info(f"Added {role} message to history: {content[:50]}...")
                
                logger.info(f"✅ Added {len(event.agent.messages)} messages to conversation history")
            else:
                logger.info("No recent turns found for this session")
                    
        except Exception as e:
            logger.error(f"❌ Memory load error: {e}", exc_info=True)
    
    def on_message_added(self, event: MessageAddedEvent):
        """Store messages in memory"""
        logger.info("💬 Message added - storing in memory")
        
        actor_id = event.agent.state.get("actor_id")
        session_id = event.agent.state.get("session_id")
        
        if not all([actor_id, session_id]):
            logger.warning("Missing required state values")
            return
        
        try:
            messages = event.agent.messages
            last_message = messages[-1]
            message_content = str(last_message.get("content", ""))
            if last_message["role"] == "user":
                message_role = MessageRole.USER
            elif last_message["role"] == "assistant":
                message_role = MessageRole.ASSISTANT
            
            self.memory_session_manager.add_turns(
                actor_id=actor_id,
                session_id=session_id,
                messages=[ConversationalMessage(message_content, message_role)]
            )
            logger.info("✅ Message stored")
            
        except Exception as e:
            logger.error(f"❌ Error storing message: {e}")
    
    def register_hooks(self, registry: HookRegistry):
        logger.info("Registering memory hooks")
        registry.add_callback(MessageAddedEvent, self.on_message_added)
        registry.add_callback(AgentInitializedEvent, self.on_agent_initialized)

def initialize_agent(actor_id, session_id):
    """Initialize the agent for first use"""
    global agent
    
    logger.info(f"Initializing agent for actor_id={actor_id}, session_id={session_id}")
    
    # Create model and memory hook
    logger.info(f"Creating model with ID: {MODEL_ID}")
    model = BedrockModel(model_id=MODEL_ID)
    logger.info(f"Creating memory hook with region: {REGION}")
    memory_hook = MemoryHookProvider()
    
    # Create agent with proper initial state
    logger.info("Creating agent with memory hook")
    agent = Agent(
        model=model,
        hooks=[memory_hook],
        system_prompt="You're a helpful agent. You can remember previous interactions within the same session. Be friendly and concise in your responses.",
        state={
            "actor_id": actor_id,
            "session_id": session_id
        }
    )
    logger.info(f"✅ Agent initialized with state: {agent.state.get()}")

def log_cognito_sub_from_token(id_token):
    """Log the sub value from the Cognito ID token"""
    try:
        # Decode without verification (just for logging)
        decoded = jwt.decode(
            id_token,
            options={"verify_signature": False, "verify_aud": False, "verify_exp": False}
        )
        logger.info(f"ID Token sub claim: {decoded.get('sub')}")
        return decoded.get('sub')
    except Exception as e:
        logger.error(f"Error decoding token: {e}")
        return None

@app.entrypoint
def runtime_memory_agent(payload, context):
    """
    Main entry point for the memory-enabled agent with identity federation
    
    Args:
        payload: The input payload containing user data
        context: The runtime context object containing session information
    """
    global agent, memory_session_manager
    
    # Log both payload and context info
    logger.info(f"Received payload: {payload}")
    logger.info(f"Context: {context}")
    logger.info(f"Context Auth: {context.request_headers.get('Authorization')}")
    
    # Extract and validate required values
    user_input = payload.get("prompt")
    id_token = payload.get("id_token")  # Get the ID token from payload
    auth_header = context.request_headers.get('Authorization')
    session_id = context.session_id
    
    # Validate required fields
    if user_input is None:
        error_msg = "❌ ERROR: Missing 'prompt' field in payload"
        logger.error(error_msg)
        return error_msg
    
    # Set up federated identity if ID token is provided
    if id_token and IDENTITY_POOL_ID:
        logger.info("ID token provided - setting up federated identity")
        
        # Get AWS credentials using the ID token
        user_credentials = get_aws_credentials_for_identity(
            identity_pool_id=IDENTITY_POOL_ID,
            id_token=id_token,
            region=REGION,
            user_pool_id=COGNITO_USER_POOL
        )
        
        # Set up actor_id
        logger.info(f"Identity Credentials: {user_credentials['identity_id']}")
        actor_id = user_credentials['identity_id']

        # Set up boto3 session with federated credentials
        session = boto3.Session(
            aws_access_key_id=user_credentials['access_key_id'],
            aws_secret_access_key=user_credentials['secret_key'],
            aws_session_token=user_credentials['session_token'],
            region_name=REGION
        )
        
        log_cognito_sub_from_token(id_token)

        # Create memory client with federated credentials 
        memory_session_manager = MemorySessionManager(
            memory_id = MEMORY_ID,
            region_name = REGION, 
            boto3_session = session
        )
        logger.info("✅ Successfully configured federated credentials for memory operations")
            
    
    # Initialize agent on first request
    if agent is None:
        logger.info("First request - initializing agent")
        initialize_agent(actor_id, session_id)
    else:
        logger.info("Using existing agent instance")
        # Update the session ID in case it changed
        if agent.state.get("session_id") != session_id:
            logger.info(f"Updating session ID to {session_id}")
            agent.state.set("session_id", session_id)
        if agent.state.get("actor_id") != actor_id:
            logger.info(f"Updating actor ID to {actor_id}")
            agent.state.set("actor_id", actor_id)
    
    # Invoke the agent with the user's input
    logger.info(f"Invoking agent with input: {user_input}")
    response = agent(user_input)
    response_text = response.message['content'][0]['text']
    logger.info(f"✅ Agent response: {response_text[:50]}…")
    
    return response_text

if __name__ == "__main__":
    logger.info("Starting AgentCore application")
    app.run()
```

## 4. Deploying to AgentCore Runtime

In this section, we'll deploy our agent to Amazon Bedrock AgentCore Runtime, a managed agent runtime environment that provides scalability and simplified operations. AgentCore Runtime handles the infrastructure complexity, allowing you to focus on your agent's logic rather than deployment concerns.

Unlike traditional deployment methods that require manual server setup and management, AgentCore Runtime deploys your agent containers to AWS infrastructure, and provides secure HTTPS endpoints for invocation. This approach ensures your agent can scale with demand and operate reliably in production environments.

> 💡 **Tip**: The AgentCore starter toolkit handles all the complex deployment steps for us, including IAM roles, ECR repositories, and container builds.

### Configure the Deployment

Let's set up our deployment configuration:

```python
iam_role = create_agentcore_role(agent_name=f"runtime_memory_agent_{unique_id}", region=REGION)
```

```python
from bedrock_agentcore_starter_toolkit import Runtime
import time

agentcore_runtime = Runtime()
agent_name = f"runtime_memory_agent_{unique_id}"

response = agentcore_runtime.configure(
    entrypoint="runtime_identity_memory_agent.py",
    execution_role=iam_role["Role"]["RoleName"],
    auto_create_ecr=True,
    requirements_file="requirements.txt",
    region=REGION,
    agent_name=agent_name,
    non_interactive=True,
    memory_mode="NO_MEMORY",
    idle_timeout=60,
    request_header_configuration={"requestHeaderAllowlist": ["Authorization"]},
    authorizer_configuration={
        "customJWTAuthorizer": {
            "discoveryUrl": cognito_config.get("discovery_url"),
            "allowedClients": [cognito_config.get("client_id")],
        }
    },
)
response
```

### Launch the agent

Now let's launch our agent to AgentCore Runtime. This step takes our configured agent and deploys it to AgentCore Runtime's managed infrastructure. During this process, we're also passing in the essential environment variables our agent needs: the memory ID we created earlier, the model ID to use, the AWS region, and the Cognito user pool ID for authentication.

Once deployed, our agent will be accessible through a secure endpoint that we can invoke with user messages. The endpoint will be protected by AgentCore Identity inbound authentication, ensuring only authorized users can access our agent.

```python
launch_result = agentcore_runtime.launch(
    env_vars={
        "MEMORY_ID": MEMORY_ID,
        "MODEL_ID": "us.anthropic.claude-haiku-4-5-20251001-v1:0",
        "AWS_REGION": REGION,
        "COGNITO_USER_POOL": cognito_config["pool_id"],
        "IDENTITY_POOL_ID": cognito_config["identity_pool_id"],
    }
)
```

### Check deployment status

Let's check the deployment status of our agent. This can take a few minutes as AgentCore Runtime builds your container, provisions the necessary resources, and deploys your agent to AWS infrastructure. We'll poll the status every 10 seconds until the deployment completes.

```python
status_response = agentcore_runtime.status()
status = status_response.endpoint["status"]
end_status = ["READY", "CREATE_FAILED", "DELETE_FAILED", "UPDATE_FAILED"]

while status not in end_status:
    time.sleep(10)
    status_response = agentcore_runtime.status()
    status = status_response.endpoint["status"]
    print(f"Current status: {status}")

if status == "READY":
    print("✅ Agent successfully deployed!")
else:
    print(f"❌ Deployment ended with status: {status}")

account_id = status_response.config.account
role_arn = status_response.config.execution_role
role_name = role_arn.split("/")[-1]
print(f"Account ID is {account_id}")
print(f"Agent role is {role_arn}")
print(f"Role name is {role_name}")
```

## 5. Testing Your Agent

Now that our agent is deployed, let's test it by sending messages and verifying that it can remember previous interactions. We'll also test that different users have isolated memory contexts, ensuring that one user's conversation isn't visible to another user.

**Important Notes on Session Management**

- **Session Management**: While AgentCore Runtime will automatically generate a session ID if one isn't provided, it's recommended to explicitly manage session IDs in your application. This gives you better control over:
  - Continuing conversations after session timeouts
  - Creating new sessions when appropriate (e.g., user starts a new conversation)
  - Handling multiple parallel conversations with the same user
  - Implementing session expiration policies based on your application's needs

- **Memory Persistence**: Even if a session expires in AgentCore Runtime, our agent can retrieve previous conversations from AgentCore Memory when a new session starts with the same user.

```python
import time


def test_user_memory_isolation_with_federated_identity():
    """
    Test user memory isolation using federated identity credentials.
    """
    print("\n" + "=" * 50)
    print("USER MEMORY ISOLATION WITH FEDERATED IDENTITY TEST")
    print("=" * 50)

    # Extract bearer tokens and ID tokens
    testuser1_token = cognito_config["bearer_tokens"]["testuser1"]
    testuser2_token = cognito_config["bearer_tokens"]["testuser2"]
    testuser1_id_token = cognito_config["id_tokens"]["testuser1"]
    testuser2_id_token = cognito_config["id_tokens"]["testuser2"]

    # Create unique session IDs for each test phase
    user1_session_id = f"memory-agent-session-user1-{int(time.time())}"
    user2_session_id = f"memory-agent-session-user2-{int(time.time())}"

    # PHASE 1: Test with user1's memory persistence
    print("\n" + "=" * 50)
    print("PHASE 1: USER 1 MEMORY PERSISTENCE TEST")
    print("=" * 50)

    # Step 1: User 1 shares initial information
    print("\n" + "-" * 50)
    print("STEP 1: User 1 shares information")
    print("-" * 50)

    user1_prompt1 = "My name is Dani and my favorite color is blue."
    response1 = agentcore_runtime.invoke(
        {"prompt": user1_prompt1, "id_token": testuser1_id_token},
        session_id=user1_session_id,
        bearer_token=testuser1_token,
    )
    print(f'User 1 prompt: "{user1_prompt1}"')
    print(f'User 1 response: "{response1["response"]}"')

    # Wait for session to terminate (75 seconds)
    print("\nWaiting 75 seconds for session to terminate...")
    time.sleep(75)

    # Step 2: User 1 asks to recall information
    print("\n" + "-" * 50)
    print("STEP 2: User 1 recalls information (should succeed)")
    print("-" * 50)

    user1_prompt2 = "What is my name and favorite color?"
    response2 = agentcore_runtime.invoke(
        {"prompt": user1_prompt2, "id_token": testuser1_id_token},
        session_id=user1_session_id,
        bearer_token=testuser1_token,
    )
    print(f'User 1 prompt: "{user1_prompt2}"')
    print(f'User 1 response: "{response2["response"]}"')

    # PHASE 2: Test user2 memory isolation
    print("\n" + "=" * 50)
    print("PHASE 2: USER 2 MEMORY ISOLATION TEST")
    print("=" * 50)

    # Step 3: User 2 shares information
    print("\n" + "-" * 50)
    print("STEP 3: User 2 shares information")
    print("-" * 50)

    user2_prompt1 = "My name is Paula and my favorite color is pink."
    response3 = agentcore_runtime.invoke(
        {"prompt": user2_prompt1, "id_token": testuser2_id_token},
        session_id=user2_session_id,
        bearer_token=testuser2_token,
    )
    print(f'User 2 prompt: "{user2_prompt1}"')
    print(f'User 2 response: "{response3["response"]}"')

    # Wait for session to terminate
    print("\nWaiting 75 seconds for session to terminate...")
    time.sleep(75)

    # Step 4: User 2 tries to recall (should only see their own info)
    print("\n" + "-" * 50)
    print("STEP 4: User 2 recalls information (should see only their data)")
    print("-" * 50)

    user2_prompt2 = "What is my name and favorite color?"
    response4 = agentcore_runtime.invoke(
        {"prompt": user2_prompt2, "id_token": testuser2_id_token},
        session_id=user2_session_id,
        bearer_token=testuser2_token,
    )
    print(f'User 2 prompt: "{user2_prompt2}"')
    print(f'User 2 response: "{response4["response"]}"')
    print("\n✅ Each user should only see their own information, demonstrating memory isolation")
```

```python
test_user_memory_isolation_with_federated_identity()
```

## Key Concepts

In this tutorial, you've learned several important concepts for building memory-enabled agents with AgentCore:

1. **Memory Integration**: How to use  AgentCore Memory to store conversation history across sessions, enabling your agent to maintain context over time even when sessions expire.

2. **Session Management**: How to use session IDs to organize conversations and retrieve relevant history when a user returns, creating a seamless experience.

3. **AgentCore Runtime Deployment**: How to deploy your agent to a production runtime environment that handles scaling, security, and infrastructure management automatically.

4. **Memory Hooks**: How to implement custom hooks that integrate with memory services, allowing you to store and retrieve conversation history at specific points in the agent lifecycle.

5. **Federated Identity and Privacy**: How to use Cognito Identity Pools and federated credentials to ensure that each user's conversation history is private and isolated from other users through AWS IAM.

These concepts provide a foundation for building more complex agents with persistent memory and sophisticated conversation management capabilities.

## Cleanup (Optional)

If you no longer need the resources created in this tutorial, you can clean them up to avoid unnecessary AWS charges.

```python
# Only run this cell if you want to delete all resources

# 1. Delete the AgentCore Runtime
if "launch_result" in locals() and hasattr(launch_result, "agent_id"):
    try:
        agentcore_control_client = boto3.client("bedrock-agentcore-control", region_name=REGION)

        runtime_delete_response = agentcore_control_client.delete_agent_runtime(
            agentRuntimeId=launch_result.agent_id,
        )
        print(f"✅ Deleted AgentCore Runtime: {launch_result.agent_id}")
    except Exception as e:
        print(f"❌ Error deleting AgentCore Runtime: {e}")
else:
    print("No AgentCore Runtime to delete")

# 2. Delete the ECR repository
if "launch_result" in locals() and hasattr(launch_result, "ecr_uri"):
    try:
        ecr_client = boto3.client("ecr", region_name=REGION)

        repository_name = launch_result.ecr_uri.split("/")[1]
        response = ecr_client.delete_repository(
            repositoryName=repository_name,
            force=True,  # Force deletion even if it contains images
        )
        print(f"✅ Deleted ECR repository: {repository_name}")
    except Exception as e:
        print(f"❌ Error deleting ECR repository: {e}")
else:
    print("No ECR repository to delete")

# 3. Delete the memory resource
try:
    memory_manager.delete_memory(memory_id=MEMORY_ID)
    print(f"✅ Deleted memory resource: {MEMORY_ID}")
except Exception as e:
    print(f"❌ Error deleting memory resource: {e}")

# 4. Delete the Cognito User Pool and associated resources
if "cognito_config" in locals() and cognito_config and "pool_id" in cognito_config:
    try:
        cognito_client = boto3.client("cognito-idp", region_name=REGION)

        # Get the user pool ID
        pool_id = cognito_config["pool_id"]

        # List and delete all user pool clients
        clients_response = cognito_client.list_user_pool_clients(UserPoolId=pool_id, MaxResults=60)

        for client in clients_response.get("UserPoolClients", []):
            client_id = client["ClientId"]
            cognito_client.delete_user_pool_client(UserPoolId=pool_id, ClientId=client_id)
            print(f"✅ Deleted User Pool Client: {client_id}")

        # Delete the user pool itself
        cognito_client.delete_user_pool(UserPoolId=pool_id)
        print(f"✅ Deleted Cognito User Pool: {pool_id}")

    except Exception as e:
        print(f"❌ Error deleting Cognito resources: {e}")
else:
    print("No Cognito resources to delete")


# 5. Function to delete IAM role and all its versions
def delete_iam_role(role_identifier, region=REGION):
    """
    Deletes an IAM role including all attached policies and versions

    Args:
        role_identifier (str): The ARN or name of the IAM role
        region (str): AWS region
    """
    try:
        iam_client = boto3.client("iam", region_name=region)

        # Determine if the identifier is an ARN or a role name
        if role_identifier.startswith("arn:aws:iam::"):
            # Extract role name from ARN
            role_name = role_identifier.split("/")[-1]
        else:
            role_name = role_identifier

        print(f"Attempting to delete IAM role: {role_name}")

        # 1. Detach all managed policies
        attached_policies = iam_client.list_attached_role_policies(RoleName=role_name)
        for policy in attached_policies.get("AttachedPolicies", []):
            iam_client.detach_role_policy(RoleName=role_name, PolicyArn=policy["PolicyArn"])
            print(f"✅ Detached managed policy: {policy['PolicyArn']}")

        # 2. Delete all inline policies
        inline_policies = iam_client.list_role_policies(RoleName=role_name)
        for policy_name in inline_policies.get("PolicyNames", []):
            iam_client.delete_role_policy(RoleName=role_name, PolicyName=policy_name)
            print(f"✅ Deleted inline policy: {policy_name}")

        # 3. Delete any instance profiles associated with the role
        instance_profiles = iam_client.list_instance_profiles_for_role(RoleName=role_name)
        for profile in instance_profiles.get("InstanceProfiles", []):
            iam_client.remove_role_from_instance_profile(
                InstanceProfileName=profile["InstanceProfileName"], RoleName=role_name
            )
            print(f"✅ Removed role from instance profile: {profile['InstanceProfileName']}")

        # 4. Finally delete the role
        iam_client.delete_role(RoleName=role_name)
        print(f"✅ Successfully deleted IAM role: {role_name}")

    except Exception as e:
        print(f"❌ Error deleting IAM role: {e}")


delete_iam_role(role_arn)

print("\n✅ Cleanup complete")
```
