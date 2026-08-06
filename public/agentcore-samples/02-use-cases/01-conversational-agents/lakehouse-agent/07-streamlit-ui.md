Test Deployment and run Streamlit App

Test the complete lakehouse agent system end-to-end.

## Prerequisites

- ✅ Run `06-deploy-agent.ipynb` first
- ✅ All components deployed

## What This Notebook Does

1. Tests OAuth token generation from Cognito
2. Tests agent invocation with bearer token
3. Validates end-to-end flow (User → Agent → Gateway → MCP)
4. Verifies agent responses with conversational AI
5. Launches Streamlit UI for interactive testing

## Important Notes

⚠️ **Run cells in order**: Start with the Setup cell (cell 2) to initialize AWS session and clients before running other cells.

```python
# ============================================================================
# SETUP CELL - Run this first to initialize AWS session and clients
# ============================================================================

# AWS Initialization - Load credentials and create session
from utils.notebook_init import init_aws
import json
import base64
import requests
import uuid
import urllib.parse

# This will:
# 1. Load credentials from .env file (if it exists)
# 2. Create and validate AWS session (env vars take precedence over SSO)
# 3. Return session, region, and account_id for use in this notebook
session, region, account_id = init_aws()

# Initialize AWS clients
ssm_client = session.client("ssm", region_name=region)

print("✅ Ready to proceed with AWS operations")
print(f"   Account ID: {account_id}")
print(f"   Region: {region}")
print("\n📝 Architecture: User → Agent Runtime → Gateway → MCP Server")
```

## Step 1: Get OAuth Token from Cognito

```python
# Get Cognito configuration from SSM
COGNITO_DOMAIN = ssm_client.get_parameter(Name="/app/lakehouse-agent/cognito-domain")["Parameter"]["Value"]

CLIENT_ID = ssm_client.get_parameter(Name="/app/lakehouse-agent/cognito-app-client-id")["Parameter"]["Value"]

CLIENT_SECRET = ssm_client.get_parameter(Name="/app/lakehouse-agent/cognito-app-client-secret", WithDecryption=True)[
    "Parameter"
]["Value"]

print("🔐 Cognito Configuration:")
print(f"   Domain: {COGNITO_DOMAIN}")
print(f"   Client ID: {CLIENT_ID}")

# Request token
token_url = f"{COGNITO_DOMAIN}/oauth2/token"
credentials = f"{CLIENT_ID}:{CLIENT_SECRET}"
encoded_credentials = base64.b64encode(credentials.encode()).decode()

headers = {
    "Authorization": f"Basic {encoded_credentials}",
    "Content-Type": "application/x-www-form-urlencoded",
}

data = {"grant_type": "client_credentials", "scope": "lakehouse-api/claims.query"}

print("\n🔑 Requesting OAuth token...")
response = requests.post(token_url, headers=headers, data=data)

if response.status_code == 200:
    token_data = response.json()
    ACCESS_TOKEN = token_data["access_token"]
    print("✅ OAuth token obtained successfully!")
    print(f"   Token type: {token_data.get('token_type')}")
    print(f"   Expires in: {token_data.get('expires_in')} seconds")
else:
    print(f"❌ Failed to get token: {response.status_code}")
    print(response.text)
    ACCESS_TOKEN = None
```

## Step 2: Test Agent Invocation

**Architecture Flow:**
1. User → Agent Runtime (OAuth token in Authorization header for JWT validation)
2. Agent receives token in payload (JWT authorizer consumes header, doesn't pass through)
3. Agent → Gateway (passes token from payload)
4. Gateway → MCP Server (with user context)

**Note:** The bearer token must be passed in BOTH the Authorization header (for JWT validation) AND the payload (for the agent code to use when calling Gateway). This is because the JWT authorizer consumes the Authorization header and doesn't pass it through to the agent code.

```python
import requests

if ACCESS_TOKEN:
    # Get Agent Runtime ARN from SSM
    try:
        AGENT_RUNTIME_ARN = ssm_client.get_parameter(Name="/app/lakehouse-agent/agent-runtime-arn")["Parameter"][
            "Value"
        ]

        print("🤖 Agent Runtime Configuration:")
        print(f"   Runtime ARN: {AGENT_RUNTIME_ARN}")
        print(f"   Region: {region}")
    except ssm_client.exceptions.ParameterNotFound:
        print("❌ Agent Runtime ARN not found in SSM")
        print("   Please run 06-deploy-agent.ipynb first")
        AGENT_RUNTIME_ARN = None

    if AGENT_RUNTIME_ARN:
        # Construct the AgentCore Runtime invocation URL
        # URL encode the agent ARN
        escaped_agent_arn = urllib.parse.quote(AGENT_RUNTIME_ARN, safe="")
        AGENT_RUNTIME_URL = f"https://bedrock-agentcore.{region}.amazonaws.com/runtimes/{escaped_agent_arn}/invocations?qualifier=DEFAULT"

        print(f"   Runtime URL: {AGENT_RUNTIME_URL}")

        # Generate session ID for this invocation
        session_id = f"test-session-{uuid.uuid4()}"

        # Prepare payload with bearer token for Gateway calls
        # Note: Token must be in BOTH header (for JWT auth) and payload (for agent to use)
        payload = {
            "prompt": "Show me all my claims",
            "bearer_token": ACCESS_TOKEN,  # Pass token in payload for agent to use with Gateway
        }

        # Prepare headers with OAuth token and session ID
        headers = {
            "Authorization": f"Bearer {ACCESS_TOKEN}",
            "Content-Type": "application/json",
            "X-Amzn-Bedrock-AgentCore-Runtime-Session-Id": session_id,
        }

        print("\n🚀 Invoking Agent Runtime...")
        print(f"   Prompt: {payload['prompt']}")
        print(f"   Session ID: {session_id}")
        print("   Auth: Bearer token in header (for JWT validation) and payload (for Gateway)")

        try:
            # Call the agent runtime
            response = requests.post(AGENT_RUNTIME_URL, headers=headers, data=json.dumps(payload), timeout=60)

            print(f"\n📊 Response Status: {response.status_code}")

            if response.status_code == 200:
                try:
                    result = response.json()
                    print("\n✅ Agent Response:")
                    print(json.dumps(result, indent=2))

                    # Display the content if available
                    if "content" in result:
                        print("\n📝 Agent Output:")
                        print(result["content"])

                    if "tool_calls" in result:
                        print(f"\n🔧 Tool Calls: {result['tool_calls']}")

                except json.JSONDecodeError:
                    print(f"Response: {response.text[:500]}")

            elif response.status_code == 401:
                print("❌ Unauthorized - OAuth token validation failed")
                print("   Check that:")
                print("      1. Agent Runtime has JWT authorizer configured")
                print("      2. Client ID matches the allowed clients")
                print("      3. Token has not expired")
                print(f"\n   Response: {response.text[:500]}")

            elif response.status_code == 403:
                print("❌ Forbidden - User not authorized")
                print(f"   Response: {response.text[:500]}")

            elif response.status_code == 424:
                print("❌ Failed Dependency - Runtime returned 500 error")
                print(f"   Response: {response.text[:500]}")
                print("\n   This means the agent code is crashing.")
                print("   Common causes:")
                print("      1. Missing Gateway ARN in SSM (/app/lakehouse-agent/gateway-arn)")
                print("      2. Agent runtime IAM role lacks SSM permissions")
                print("      3. Agent runtime IAM role lacks bedrock-agentcore-control:GetGateway permission")
                print("      4. Bearer token not being passed correctly")
                print("\n   👉 Run the cells below to diagnose:")
                print('      - "Verify Configuration" cell to check SSM parameters')
                print('      - "Check CloudWatch Logs" cell to see agent error logs')

            else:
                print("❌ Request failed")
                print(f"   Response: {response.text[:500]}")

        except requests.exceptions.Timeout:
            print("\n❌ Request timed out after 60 seconds")
            print("   Check CloudWatch logs:")
            print(f"      - Agent Runtime: /aws/bedrock-agentcore/runtime/{AGENT_RUNTIME_ARN.split('/')[-1]}")
            print("      - Gateway Interceptor: /aws/lambda/lakehouse-gateway-interceptor")

        except Exception as e:
            print(f"\n❌ Error: {e}")
            import traceback

            traceback.print_exc()
else:
    print("⚠️  Skipping agent test - no access token")
```

## Step 3: Launch Streamlit UI

Launch the interactive Streamlit UI for conversational testing with the agent.

```python
import subprocess
import os

print("🚀 Launching Streamlit UI...")
print("\n📝 Instructions:")
print("   - Streamlit will open in your browser automatically")
print("   - Login with: policyholder001@example.com / TempPass123!")
print('   - Try queries like: "Show me all claims" or "Get claims summary"')
print("   - Press Ctrl+C in the terminal to stop Streamlit")
print("\n⏳ Starting Streamlit server...")

# Change to streamlit-ui directory and run streamlit
try:
    streamlit_dir = os.path.join(os.getcwd(), "streamlit-ui")
    subprocess.run(["streamlit", "run", "streamlit_app.py"], cwd=streamlit_dir, check=True)
except KeyboardInterrupt:
    print("\n\n✅ Streamlit stopped")
except FileNotFoundError:
    print("\n❌ streamlit-ui directory or streamlit_app.py not found")
    print("   Make sure you are running this from the lakehouse-agent directory")
except Exception as e:
    print(f"\n❌ Error launching Streamlit: {e}")
    print("\n💡 Manual launch:")
    print("   cd streamlit-ui")
    print("   streamlit run streamlit_app.py")
```

## Summary

✅ **Testing Complete!**

**Architecture Validated:**
```
User (with OAuth token)
  ↓
AgentCore Runtime (Lakehouse Agent)
  ├─ Validates user OAuth token (JWT authorizer)
  ├─ Extracts token from Authorization header
  ↓
AgentCore Gateway
  ├─ Receives bearer token from agent
  ├─ Interceptor Lambda validates token
  ├─ Adds user identity (X-User-Principal header)
  ↓
MCP S3 Tables Server
  └─ Executes queries with user context
```

**What was tested:**
- User OAuth token generation from Cognito
- Agent runtime invocation with bearer token in header
- Agent → Gateway → MCP Server flow
- User identity propagation through headers
- Interactive Streamlit UI for conversational testing

**Additional Testing:**

1. **Test with different users:**
   - policyholder001@example.com / TempPass123!
   - policyholder002@example.com / TempPass123!

2. **Verify User Context:**
   - Check that Gateway interceptor extracts user identity
   - Verify X-User-Principal header is added to MCP requests
   - Confirm user identity appears in CloudWatch logs

**Troubleshooting:**
- Check CloudWatch logs for:
  - Agent Runtime logs: `/aws/bedrock-agentcore/runtime/<runtime-id>`
  - Gateway Interceptor logs: `/aws/lambda/lakehouse-gateway-interceptor`
  - Look for: "Bearer token extracted", "User: <email>", "Request authorized"
- Verify SSM parameters are set correctly
- Ensure all components are deployed in correct order
