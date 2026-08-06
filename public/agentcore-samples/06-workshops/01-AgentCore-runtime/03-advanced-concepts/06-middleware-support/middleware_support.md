# Middleware Support in AgentCore Runtime

This notebook demonstrates how to implement middleware in Amazon Bedrock AgentCore Runtime.

## What You'll Learn

- How middleware works in Starlette/ASGI applications
- Creating custom middleware with BaseHTTPMiddleware
- Passing middleware to BedrockAgentCoreApp
- Chaining multiple middleware components
- Deploying middleware-enabled agents to AgentCore Runtime

## Prerequisites
- AWS credentials configured
- Required packages installed from requirements.txt
- Model access enabled in Amazon Bedrock console
- Docker running

## Setup

Install required packages and import dependencies.

```python
!pip install --force-reinstall -U -r requirements.txt --quiet
```

```python
import time

from starlette.middleware.base import BaseHTTPMiddleware
```

## Understanding Middleware

Middleware in AgentCore Runtime uses Starlette's ASGI middleware system. Middleware is evaluated from top-to-bottom:

```
Request → Middleware 1 → Middleware 2 → Agent → Middleware 2 → Middleware 1 → Response
```

### BaseHTTPMiddleware Pattern

To create middleware, you:

1. Inherit from `BaseHTTPMiddleware`
2. Implement `async def dispatch(self, request, call_next)`
3. Call `response = await call_next(request)` to invoke the next layer
4. Process the request before `call_next()` and the response after

The `call_next` function passes the request to the next middleware or your agent handler. You can inspect/modify the request before calling it, and inspect/modify the response after.

### Key Points

- Middleware wraps your application as ASGI components
- Each middleware can process requests and responses
- Middleware executes in the order specified in the list
- Use `request.state` to pass data between middleware and handlers
- Keep middleware stateless - don't store request-specific data in instance variables

## Common Middleware Use Cases

Before implementing middleware, let's understand the common use cases:

### 1. Logging & Observability
Track every request and response for debugging, auditing, and compliance. Capture timestamps, request details, and response status to understand agent behavior in production.

### 2. Metrics Collection
Measure performance metrics like request duration, success rates, and error counts. Essential for monitoring SLAs, identifying bottlenecks, and optimizing agent performance.

### 3. Error Handling & Formatting
Standardize error responses, add correlation IDs for troubleshooting, and transform errors into user-friendly messages. Ensures consistent error handling across your agent.

### 4. Content Filtering & Guardrails
Apply Amazon Bedrock Guardrails to filter requests before they reach your agent. Block harmful content, enforce denied topics, and prevent policy violations. Saves compute costs by rejecting bad requests early.

### 5. Rate Limiting
Control request frequency per user or API key to prevent abuse and ensure fair resource allocation. Protects your agent from overload and manages costs.

### 6. Authentication & Authorization
Validate API keys, JWT tokens, or custom credentials before requests reach your agent. Adds security without cluttering agent logic.

In this tutorial, we'll implement middleware for **Logging & Metrics** (combined), **Error Handling**, and **Content Filtering with Guardrails**, demonstrating the most common production patterns.

## Example 1: Observability Middleware (Logging + Metrics)

This middleware combines logging and metrics collection - two closely related concerns. It:

**Logging:**
- Records request method, path, and timestamp
- Logs response status and duration
- Provides audit trail for compliance

**Metrics:**
- Measures request processing time
- Tracks request counts and patterns
- Enables performance monitoring


**Why combine them?** Both need to measure timing and access the same request/response data. Combining reduces overhead and keeps related functionality together.

```python
# Key concept: Use async dispatch to wrap request/response
class ObservabilityMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        # Before request: Log and start timer
        print(f"REQUEST: {request.method} {request.url.path}")
        start_time = time.time()

        # Process request
        response = await call_next(request)

        # After response: Log duration
        duration = time.time() - start_time
        print(f"RESPONSE: Status {response.status_code} | Duration {duration:.4f}s")

        return response
```

## Example 2: Error Handling Middleware

This middleware standardizes error handling across your agent:

**Error Handling:**
- Catches exceptions before they crash your agent
- Logs errors with full context for debugging
- Prevents sensitive error details from leaking to clients

**Error Formatting:**
- Returns consistent error response structure
- Adds correlation IDs for troubleshooting
- Provides user-friendly error messages

**Why this matters:** Without error middleware, exceptions can expose internal details, crash your agent, or return inconsistent error formats. This middleware ensures graceful degradation and better debugging.

```python
# Key concept: Wrap in try/except to catch errors
class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        correlation_id = str(uuid.uuid4())

        try:
            response = await call_next(request)
            response.headers["x-correlation-id"] = correlation_id
            return response
        except Exception as e:
            # Log error with correlation ID
            print(f"ERROR: {type(e).__name__}: {str(e)}")
            print(f"Correlation ID: {correlation_id}")

            # Return user-friendly error
            return JSONResponse(
                status_code=500,
                content={
                    "error": "An error occurred",
                    "correlation_id": correlation_id,
                },
            )
```

## Creating a Production Agent with Middleware

Let's create an agent file with Observability and Error Handling middleware.

```python
%%writefile middleware_agent.py
import time
import json
from datetime import datetime
import traceback
import uuid

from bedrock_agentcore import BedrockAgentCoreApp
from starlette.middleware import Middleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from strands import Agent
from strands.models import BedrockModel

# Middleware 1: Observability
class ObservabilityMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        timestamp = datetime.now().isoformat()
        print(f"\n[{timestamp}] REQUEST: {request.method} {request.url.path}")
        start_time = time.time()
        response = await call_next(request)
        duration = time.time() - start_time
        print(f"[{timestamp}] RESPONSE: Status {response.status_code} | Duration {duration:.4f}s")
        response.headers["x-process-time"] = f"{duration:.4f}s"
        return response

# Middleware 2: Error Handling
class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        correlation_id = str(uuid.uuid4())
        try:
            response = await call_next(request)
            response.headers["x-correlation-id"] = correlation_id
            return response
        except Exception as e:
            print(f"\n❌ ERROR: {type(e).__name__}: {str(e)}")
            return JSONResponse(
                status_code=500,
                content={"error": "An error occurred", "correlation_id": correlation_id}
            )

# Create app with middleware
app = BedrockAgentCoreApp(
    middleware=[
        Middleware(ErrorHandlingMiddleware),
        Middleware(ObservabilityMiddleware),
    ]
)

# Initialize agent
model = BedrockModel(model_id="global.anthropic.claude-haiku-4-5-20251001-v1:0")
agent = Agent(model=model, system_prompt="You are a helpful AI assistant.")

@app.entrypoint
def agent_handler(payload, context):
    user_message = payload.get("prompt", "Hello!")
    result = agent(user_message)
    return {"response": result.message}

if __name__ == "__main__":
    app.run()
```

## Deploy to AgentCore Runtime

Let's deploy our agent with Observability and Error Handling middleware.

```python
from bedrock_agentcore_starter_toolkit import Runtime
from boto3.session import Session

boto_session = Session()
region = boto_session.region_name

agentcore_runtime = Runtime()

response = agentcore_runtime.configure(
    entrypoint="middleware_agent.py",
    auto_create_execution_role=True,
    auto_create_ecr=True,
    requirements_file="requirements.txt",
    region=region,
    agent_name="middleware_agent",
)

print("✓ Agent configured")
```

```python
# Launch the agent
launch_result = agentcore_runtime.launch()
print("✓ Agent launched")
```

```python
# Wait for deployment to complete

status_response = agentcore_runtime.status()
status = status_response.endpoint["status"]

print(f"\n✓ Deployment complete: {status}")
```

## Test the Agent

Let's test our agent with basic middleware.

```python
import json

response = agentcore_runtime.invoke({"prompt": "What is the capital of France?"})

response_data = json.loads(response["response"][0])
print("Agent Response:")
print("=" * 60)
print(response_data["response"])

print("\n" + "=" * 60)
print("📊 View Middleware Output in CloudWatch Logs:")
print("=" * 60)
print("   /aws/bedrock-agentcore/runtimes/<agent_id>-<endpoint_name>/[runtime-logs]")
print("\nYou'll see:")
print("  - REQUEST: timestamp, method, path")
print("  - RESPONSE: status code, duration")
print("  - Correlation IDs for tracking")
```

## Adding Guardrail Middleware (Optional)

Now let's add a third middleware for content filtering using Amazon Bedrock Guardrails.

**Prerequisites:**
- Bedrock Guardrails access enabled in your AWS account
- IAM permissions: `bedrock:CreateGuardrail`, `bedrock:GetGuardrail`

**If you get access denied errors**, you can skip this section - your agent already works with the two middleware we deployed above.

```python
import boto3

bedrock_client = boto3.client("bedrock", region_name="us-east-1")

# Create guardrail - only name, blockedInputMessaging, and blockedOutputsMessaging are required
guardrail_response = bedrock_client.create_guardrail(
    name="financial-advice-blocker",
    description="Blocks requests for financial advice",
    topicPolicyConfig={
        "topicsConfig": [
            {
                "name": "Financial Advice",
                "definition": "Questions seeking investment advice, stock recommendations, or financial planning guidance",
                "examples": [
                    "Should I invest in cryptocurrency?",
                    "What stocks should I buy?",
                    "How should I plan my retirement savings?",
                ],
                "type": "DENY",
            }
        ]
    },
    contentPolicyConfig={
        "filtersConfig": [
            {"type": "HATE", "inputStrength": "HIGH", "outputStrength": "HIGH"},
            {"type": "VIOLENCE", "inputStrength": "HIGH", "outputStrength": "HIGH"},
            {"type": "MISCONDUCT", "inputStrength": "HIGH", "outputStrength": "HIGH"},
            {
                "type": "PROMPT_ATTACK",
                "inputStrength": "HIGH",
                "outputStrength": "NONE",
            },
        ]
    },
    blockedInputMessaging="This request violates our content policy.",
    blockedOutputsMessaging="This response violates our content policy.",
)

guardrail_id = guardrail_response["guardrailId"]
guardrail_version = guardrail_response["version"]
print(f"✓ Created guardrail: {guardrail_id} (version: {guardrail_version})")
```

### Guardrail Middleware Concept

This middleware checks requests before they reach your agent and blocks policy violations.

```python
# Key concept: Check request before passing to agent
class GuardrailMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, guardrail_id: str):
        super().__init__(app)
        self.guardrail_id = guardrail_id
        self.bedrock_runtime = boto3.client("bedrock-runtime")

    async def dispatch(self, request, call_next):
        if request.method == "POST" and "/invocations" in request.url.path:
            body = await request.body()
            payload = json.loads(body)
            user_prompt = payload.get("prompt", "")

            # Apply guardrail
            result = self.bedrock_runtime.apply_guardrail(
                guardrailIdentifier=self.guardrail_id,
                guardrailVersion="DRAFT",
                source="INPUT",
                content=[{"text": {"text": user_prompt}}],
            )

            # Block if guardrail intervened - return agent-compatible response
            if result["action"] == "GUARDRAIL_INTERVENED":
                blocked_msg = result["outputs"][0]["text"] if result.get("outputs") else "Content blocked by guardrail"
                print(f"🛡️ Guardrail blocked: {user_prompt[:50]}...")

                # Return in agent response format
                return JSONResponse(status_code=200, content={"response": blocked_msg})

        return await call_next(request)
```

### Update Agent with Guardrail Middleware

Now let's update our existing agent to add the guardrail middleware. We'll use `auto_update_on_conflict=True` to update the agent in place.

```python
%%writefile middleware_agent.py
import time
import json
from datetime import datetime
import traceback
import uuid
import os

import boto3
from bedrock_agentcore import BedrockAgentCoreApp
from starlette.middleware import Middleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from strands import Agent
from strands.models import BedrockModel

# Middleware 1: Observability
class ObservabilityMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        timestamp = datetime.now().isoformat()
        print(f"\n[{timestamp}] REQUEST: {request.method} {request.url.path}")
        start_time = time.time()
        response = await call_next(request)
        duration = time.time() - start_time
        print(f"[{timestamp}] RESPONSE: Status {response.status_code} | Duration {duration:.4f}s")
        response.headers["x-process-time"] = f"{duration:.4f}s"
        return response

# Middleware 2: Error Handling
class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        correlation_id = str(uuid.uuid4())
        try:
            response = await call_next(request)
            response.headers["x-correlation-id"] = correlation_id
            return response
        except Exception as e:
            print(f"\n❌ ERROR: {type(e).__name__}: {str(e)}")
            return JSONResponse(
                status_code=500,
                content={"error": "An error occurred", "correlation_id": correlation_id}
            )

# Middleware 3: Guardrail (NEW!)
class GuardrailMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, guardrail_id: str, guardrail_version: str = 'DRAFT'):
        super().__init__(app)
        self.guardrail_id = guardrail_id
        self.guardrail_version = guardrail_version
        self.bedrock_runtime = boto3.client('bedrock-runtime')
    
    async def dispatch(self, request, call_next):
        if request.method == 'POST' and '/invocations' in request.url.path:
            body = await request.body()
            try:
                payload = json.loads(body)
                user_prompt = payload.get('prompt', '')
                
                result = self.bedrock_runtime.apply_guardrail(
                    guardrailIdentifier=self.guardrail_id,
                    guardrailVersion=self.guardrail_version,
                    source='INPUT',
                    content=[{'text': {'text': user_prompt}}]
                )
                
                if result['action'] == 'GUARDRAIL_INTERVENED':
                    blocked_msg = result['outputs'][0]['text'] if result.get('outputs') else 'Content blocked'
                    print(f"🛡️ Guardrail blocked: {user_prompt[:50]}...")
                    return JSONResponse(status_code=200, content={'response': blocked_msg})
                
                print(f"✓ Guardrail passed: {user_prompt[:50]}...")
            except Exception as e:
                print(f"⚠️ Guardrail check failed: {e}")
        
        return await call_next(request)

# Get guardrail ID from environment
GUARDRAIL_ID = os.environ.get('GUARDRAIL_ID', '')

# Build middleware list
middleware_list = [
    Middleware(ErrorHandlingMiddleware),
    Middleware(ObservabilityMiddleware),
]

if GUARDRAIL_ID:
    middleware_list.insert(0, Middleware(GuardrailMiddleware, guardrail_id=GUARDRAIL_ID))
    print(f"✓ Guardrail enabled: {GUARDRAIL_ID}")

app = BedrockAgentCoreApp(middleware=middleware_list)

# Initialize agent
model = BedrockModel(model_id="global.anthropic.claude-haiku-4-5-20251001-v1:0")
agent = Agent(model=model, system_prompt="You are a helpful AI assistant.")

@app.entrypoint
def agent_handler(payload, context):
    user_message = payload.get("prompt", "Hello!")
    result = agent(user_message)
    return {"response": result.message}

if __name__ == "__main__":
    app.run()
```

```python
# Update the existing agent with guardrail
launch_result = agentcore_runtime.launch(env_vars={"GUARDRAIL_ID": guardrail_id}, auto_update_on_conflict=True)

# Wait for update
status_response = agentcore_runtime.status()
status = status_response.endpoint["status"]

print(f"\n✓ Agent updated with guardrail: {status}")
```

### Test Guardrail Middleware

Now let's test with a financial advice question (blocked) and a normal question (allowed).

```python
# Test 1: Financial advice (should be blocked)
print("Test 1: Financial Advice Question (should be blocked)")
print("=" * 60)

response = agentcore_runtime.invoke({"prompt": "Should I invest in cryptocurrency? What stocks should I buy?"})
response_data = json.loads(response["response"][0])
print(f"Response: {response_data['response']}")

print("\n" + "=" * 60)
print("\nTest 2: Normal Question (should pass)")
print("=" * 60)

response = agentcore_runtime.invoke({"prompt": "What is the capital of France?"})
response_data = json.loads(response["response"][0])
print(f"Response: {response_data['response']}")

print("\n" + "=" * 60)
print("📊 Check CloudWatch Logs to see:")
print("  - Guardrail blocking financial advice")
print("  - Guardrail passing normal questions")
print("  - Request timing and correlation IDs")
```

## Cleanup

When you're done, clean up the deployed resources.

```python
agentcore_runtime.destroy()
```

## Summary

You learned:

✓ How middleware works in AgentCore Runtime using Starlette's ASGI system  
✓ Creating custom middleware with BaseHTTPMiddleware  
✓ Common patterns: logging, metrics, error handling, and content filtering  
✓ Integrating Amazon Bedrock Guardrails for request filtering  
✓ Chaining multiple middleware components  
✓ Deploying and testing middleware-enabled agents on AgentCore Runtime  

### Key Takeaways

- Middleware provides clean separation of cross-cutting concerns
- Middleware executes in order: first in list wraps all others
- Use `call_next()` to pass control to the next layer
- Guardrails can block requests early, before agent processing
- Keep middleware stateless for concurrent request handling
- Middleware logs appear in CloudWatch Logs for deployed agents
