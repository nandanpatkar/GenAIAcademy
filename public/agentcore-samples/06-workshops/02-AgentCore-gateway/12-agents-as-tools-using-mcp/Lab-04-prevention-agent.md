# Lab 4: Prevention Agent with AgentCore Browser

## Overview
Build a Strands-based prevention agent that uses AgentCore Browser for real-time AWS documentation research and proactive infrastructure recommendations.

## Objectives
- Create a Strands agent with AgentCore Browser integration
- Implement prevention-focused analysis workflows
- Build tools for real-time AWS best practices research
- Test agent with infrastructure prevention scenarios
- Generate proactive recommendations to prevent issues

## What You'll Learn
- How to integrate AgentCore Browser with Strands agents
- How to implement prevention-focused workflows vs reactive remediation
- How to research current AWS best practices using browser automation
- Agent prevention analysis and recommendation patterns

## Architecture Overview
```
┌─────────────────┐    ┌──────────────────────┐    ┌─────────────────────┐
│   User Request  │───▶│  Strands Agent       │───▶│  AgentCore Browser  │
│   (Prevention)  │    │  (Prevention)        │    │                     │
└─────────────────┘    └──────────────────────┘    └─────────────────────┘
                                │                            │
                                ▼                            ▼
                       ┌──────────────────────┐    ┌─────────────────────┐
                       │  Prevention Analysis │    │  Real-time Web      │
                       │  ├─ Risk Assessment  │    │  Research           │
                       │  ├─ Best Practices   │    │  ├─ AWS Docs        │
                       │  └─ Recommendations  │    │  ├─ Best Practices   │
                       └──────────────────────┘    │  └─ Current Standards│
                                │                  └─────────────────────┘
                                ▼                            │
                       ┌──────────────────────┐              ▼
                       │  Proactive           │    ┌─────────────────────┐
                       │  Recommendations     │◀───│  Documentation      │
                       │  (Before Issues)     │    │  Analysis & Insights│
                       └──────────────────────┘    └─────────────────────┘
```

**Key Components:**
- **Prevention Focus**: Proactive recommendations vs reactive fixes
- **Real-time Research**: Live access to current AWS documentation
- **Browser Integration**: AgentCore Browser for web content access
- **Current Standards**: Always uses latest AWS best practices

## 0. Install Required Packages

Run this cell first to ensure all dependencies are installed.

```python
%pip install -q -r requirements.txt
print("✅ Prevention agent dependencies installed")
```

## 1. Import Required Modules

```python
# AWS SDK and configuration
import logging
from datetime import datetime

# Strands framework
from strands import Agent
from strands.models import BedrockModel
from strands.tools import tool
from strands_tools.browser import AgentCoreBrowser

# Workshop configuration
# Bedrock AgentCore Starter Toolkit
from bedrock_agentcore_starter_toolkit import Runtime
from lab_helpers.config import MODEL_ID, AWS_REGION, AWS_PROFILE, WORKSHOP_NAME
from lab_helpers.parameter_store import get_parameter, put_parameter
from lab_helpers.constants import PARAMETER_PATHS
from lab_helpers.lab_04.gateway_setup import AgentCoreGatewaySetup

# Configure logging for notebook
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

print("✅ Imports loaded")
print(f"   Workshop: {WORKSHOP_NAME}")
print(f"   Region: {AWS_REGION}")
print(f"   Model: {MODEL_ID}")
print("🌐 AgentCore Browser tool imported")
print("🔮 Prevention agent ready for setup")
```

## 2. Verify Prerequisites

```python
# Verify prerequisites are available
try:
    # Test AWS credentials
    import boto3

    sts_client = boto3.client("sts", region_name=AWS_REGION)
    identity = sts_client.get_caller_identity()
    account_id = identity["Account"]

    # Test AgentCore Browser availability
    browser_tool = AgentCoreBrowser(region=AWS_REGION)

    print(f"✅ Prerequisites verified: AWS Account {account_id}, AgentCore Browser available")
    print(f"   Region: {AWS_REGION}")
    print(f"   Profile: {AWS_PROFILE}")
    print(f"   Model ID: {MODEL_ID}")
    print(f"   Identity: {identity.get('Arn', 'Unknown')}")
    print("   Browser Tool: AgentCoreBrowser initialized")

except Exception as e:
    print(f"❌ Error: {e}")
    print("Please ensure AWS credentials are configured and AgentCore Browser permissions are available.")
```

## 3. Create Prevention Agent with Browser Integration

**Goal:** Set up Strands agent with AgentCore Browser for real-time web research.

**Approach:** Initialize browser tool, create agent with prevention-focused system prompt.

**Key Learning:** How AgentCore Browser enables real-time documentation research for prevention.

```python
### 3.1: Setup Prevention Agent with Browser Tool


def setup_prevention_agent(region=AWS_REGION):
    """Setup Strands agent with AgentCore Browser tool"""
    try:
        # Initialize the Browser tool - following strands_tools.browser pattern
        browser_tool = AgentCoreBrowser(region=region)

        # Setup Bedrock model
        model = BedrockModel(
            model_id=MODEL_ID,
            streaming=True,
        )

        # Create agent with browser tool
        agent = Agent(model=model, tools=[browser_tool.browser])

        logger.info("✅ SRE Prevention Agent ready with AgentCore Browser")
        logger.info(f"🌍 Region: {region}")
        logger.info("🌐 Browser tool: AgentCoreBrowser integrated")

        return agent

    except Exception as e:
        logger.error(f"❌ Failed to setup agent: {e}")
        return None


# Setup the agent
agent = setup_prevention_agent()
if agent:
    print("✅ Strands prevention agent created successfully")
    print(f"   Model: {MODEL_ID}")
    print("   Tools: 1 (AgentCore Browser)")
    print("🌐 AgentCore Browser integration ready")
    print("🔮 Ready for prevention analysis")
else:
    print("❌ Agent setup failed!")
    print("   Check AgentCore Browser initialization and AWS credentials")
```

## 4. Test Browser Integration

**Goal:** Verify AgentCore Browser functionality with basic web access test.

**Approach:** Test browser tool with simple AWS homepage access.

**Key Learning:** How to validate browser connectivity and content extraction.

```python
### 4.1: Test Browser Integration

# Setup the agent

agent = setup_prevention_agent()


def test_browser_integration(agent):
    """Test AgentCore Browser integration"""
    if not agent:
        print("❌ Agent not available for testing")
        return False

    print("🧪 Testing AgentCore Browser Integration...")
    print("=" * 50)

    test_prompt = """
    Please use the browser tool to visit https://aws.amazon.com and get the page title
    
    
    This is just a test to verify the browser tool is working correctly.
    """

    try:
        start_time = datetime.now()
        response = agent(test_prompt)
        test_time = (datetime.now() - start_time).total_seconds()

        print(f"✅ Browser test completed in {test_time:.2f} seconds")

        # Display the response (truncate if too long)
        response_content = response.message.get("content", [])
        if response_content:
            for content in response_content:
                if isinstance(content, dict) and "text" in content:
                    text = content["text"]
                    if len(text) > 800:
                        print("\n📋 BROWSER TEST RESULTS (first 800 chars):")
                        print("-" * 30)
                        print(f"{text[:800]}...\n\n[Full output: {len(text)} chars]")
                    else:
                        print("\n📋 BROWSER TEST RESULTS:")
                        print("-" * 30)
                        print(text)
                elif isinstance(content, str):
                    print("\n📋 BROWSER TEST RESULTS:")
                    print("-" * 30)
                    print(content)

        return True

    except Exception as e:
        print(f"❌ Browser test failed: {e}")
        return False


# Run the browser test
if agent:
    print("💡 To run browser test, uncomment the line below:")
    test_result = test_browser_integration(agent)
    if test_result:
        print("\n🎉 AgentCore Browser integration test PASSED!")
    else:
        print("\n❌ AgentCore Browser integration test FAILED!")
    print("⚠️  Note: This will make a real web request to AWS homepage")
else:
    print("❌ Agent not available for browser testing")
```

## Enrich Context from Memory

Let's get additional information from our curated memory to enrich the context with diagnostics information.

```python
agent_memory_client = boto3.client("bedrock-agentcore", region_name=AWS_REGION)

memory_id = get_parameter(PARAMETER_PATHS["memory"]["memory_id"])
memory_session_id = get_parameter(PARAMETER_PATHS["memory"]["default_session_id"])

print(memory_id)
print(memory_session_id)
actor_id = "diagnostics_agent"


# list events added to agent memory, to confirm successful write
params = {
    "memoryId": memory_id,
    "actorId": actor_id,
    "sessionId": memory_session_id,
    "includePayloads": True,
}
# Get all messages
response = agent_memory_client.list_events(**params)
additional_context = ""
for event in response.get("events", []):
    payload = event.get("payload", [])
    for i, item in enumerate(payload):
        if "conversational" in item:
            text = item["conversational"]["content"]["text"]
            additional_context += text
additional_context
```

## 5. Prevention Analysis Workflow

**Goal:** Demonstrate prevention analysis workflow with real AWS documentation research.

**Approach:** Run comprehensive prevention analysis using browser to research best practices.

**Key Learning:** How prevention agents research and recommend proactive measures.

```python
### 5.1: Run Prevention Analysis

# Setup the agent

agent = setup_prevention_agent()


def analyze_prevention_opportunities(agent):
    """Analyze infrastructure for prevention opportunities"""
    if not agent:
        logger.error("❌ Agent not initialized")
        return None

    logger.info("🔮 Starting prevention opportunity analysis...")

    prevention_prompt = f"""
    I need you to analyze our CRM infrastructure for prevention opportunities using the browser tool to access AWS documentation. 
    Our CRM application is hosted on EC2 instances with a DynamoDB backend for customer data. 

    Here is additional information about the issues identified and fixes that have been applied:

    {additional_context}
    
    Please use the browser tool to access these specific AWS documentation pages and provide analysis:
    
    1. First, use the browser tool to visit: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html
    2. Then visit: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-best-practices.html  
    3. Finally visit: https://docs.aws.amazon.com/wellarchitected/latest/framework/
    
    Based on what you find in the AWS documentation, provide analysis focusing on:
    
    1. **Proactive Infrastructure Management**: Best practices we should implement
    2. **Customer Impact Prevention**: How to prevent issues that could affect customer experience  
    3. **Performance Optimization**: Latest AWS recommendations for EC2 and DynamoDB optimization
    4. **Monitoring and Alerting**: Best practices for proactive monitoring
    
    Provide your analysis with:
    - Executive summary of prevention opportunities
    - Customer impact prioritization  
    - Implementation roadmap with AWS best practices
    - Success metrics for measuring prevention effectiveness
    
    Use the browser tool to get the most current AWS documentation and recommendations.
    """

    try:
        start_time = datetime.now()
        response = agent(prevention_prompt)
        analysis_time = (datetime.now() - start_time).total_seconds()

        logger.info(f"✅ Prevention analysis completed in {analysis_time:.2f} seconds")

        return {
            "analysis_time": analysis_time,
            "response": response,
            "timestamp": datetime.now().isoformat(),
        }

    except Exception as e:
        logger.error(f"❌ Prevention analysis failed: {e}")
        return None


# Run the complete prevention analysis
if agent:
    print("🚀 Starting Complete Prevention Analysis Workflow...")
    print("=" * 60)
    print("🔮 This will research current AWS best practices using the browser")
    print("📚 Accessing live AWS documentation for latest recommendations")
    print("⏳ This may take a few minutes as we browse multiple documentation pages...")
    result = analyze_prevention_opportunities(agent)

    if result:
        print("\n🎯 PREVENTION ANALYSIS RESULTS:")
        print(f"Analysis Time: {result['analysis_time']:.2f} seconds")
        print(f"Timestamp: {result['timestamp']}")

        # Display the agent's response
        response_content = result["response"].message.get("content", [])
        if response_content:
            for content in response_content:
                if isinstance(content, dict) and "text" in content:
                    text = content["text"]
                    if len(text) > 2000:
                        print(f"\n📋 PREVENTION ANALYSIS (first 2000 chars):\n{text[:2000]}...")
                    else:
                        print(f"\n📋 PREVENTION ANALYSIS:\n{text}")
                elif isinstance(content, str):
                    print(f"\n📋 PREVENTION ANALYSIS:\n{content}")

        print("\n🎉 Prevention analysis workflow completed successfully!")
    else:
        print("❌ Prevention analysis failed!")

    print("⚠️  Note: This will make multiple browser requests and may take several minutes")
    print("🔒 This demonstrates proactive analysis vs reactive remediation")

else:
    print("❌ Agent not available for prevention analysis!")
```

## 6. Deploy to AgentCore Runtime

**Goal:** Deploy the prevention agent to Amazon Bedrock AgentCore Runtime for serverless execution.

**Approach:** Use AgentCoreRuntimeDeployer to create Runtime infrastructure and deploy the agent.

**Key Learning:** How to deploy Strands agents to production-ready serverless infrastructure with Browser integration.

### 6.1: Initialize Runtime Deployer and Create IAM Role

```python
from lab_helpers.lab_04 import AgentCoreRuntimeDeployer, store_runtime_configuration

# Initialize deployer
deployer = AgentCoreRuntimeDeployer(region=AWS_REGION, prefix=WORKSHOP_NAME, verbose=True)

# Check prerequisites
print("✓ Checking prerequisites...")
if deployer.check_prerequisites():
    print("✅ All prerequisites met")
else:
    print("❌ Prerequisites not met")
    print("Please install: pip install fastmcp bedrock-agentcore-starter-toolkit strands-agents-tools")

# Create IAM role with Browser permissions
print("\n🔐 Creating IAM role for Runtime...")
role_info = deployer.create_runtime_iam_role()
print(f"   Role ARN: {role_info['role_arn']}")
```

### 6.2: Deploy to AgentCore Runtime

```python
### 6.2 a: Agent code for deployment

# Read the agent code file
with open("lab_helpers/lab_04/runtime_mcp_agent_code.py", "r") as f:
    agentcore_agent_code = f.read()

print("✅ Agent code loaded from: lab_helpers/lab_04/runtime_mcp_agent_code.py")
print(f"✓ Loaded agent code: {len(agentcore_agent_code)} bytes")
print(f"✓ Code size: {len(agentcore_agent_code) / 1024:.1f} KB")
print(f"✓ AWS_REGION: {AWS_REGION}")
```

```python
### 6.2 b: Write agent code to disk
with open("agent-prevention.py", "w") as f:
    f.write(agentcore_agent_code)

print("✅ Agent code written: agent-prevention.py")
```

### 6.3 Configure Runtime with JWT Authorizer

**What runtime.configure() does:**
- Validates agent code and dependencies
- Generates Dockerfile and AWS configuration files
- Prepares deployment blueprint (local operation, no AWS resources created yet)
- Sets up execution role and token validation

**JWT Authorizer Configuration:**
The `authorizer_configuration` parameter tells Runtime how to validate incoming tokens:
- **discoveryUrl**: Cognito OIDC endpoint where Runtime fetches public keys for signature validation
- **allowedClients**: Both User Auth client (direct users) and M2M client (Gateway) are permitted

**Automatic Runtime Behavior:**
```
Bearer token in request → Validate signature → Check issuer (Cognito) → Verify client ID in allowedClients → Allow or Reject
```

```python
### 6.3 a: Retrieve Cognito configuration
from lab_helpers.parameter_store import get_parameter
from lab_helpers.constants import PARAMETER_PATHS

# Retrieve Cognito configuration from Lab-01 SSM Parameter Store
cognito_domain = get_parameter(PARAMETER_PATHS["cognito"]["domain"])
user_pool_id = get_parameter(PARAMETER_PATHS["cognito"]["user_pool_id"])
m2m_client_id = get_parameter(PARAMETER_PATHS["cognito"]["m2m_client_id"])
user_auth_client_id = get_parameter(PARAMETER_PATHS["cognito"]["user_auth_client_id"])

# Build Cognito discovery URL - Runtime uses this to fetch public keys for token validation
# Using Cognito domain from Parameter Store (more reliable than manual construction)
discovery_url = f"https://cognito-idp.{AWS_REGION}.amazonaws.com/{user_pool_id}/.well-known/openid-configuration"

print("✅ Cognito configuration retrieved")
print(f"   Discovery URL: {discovery_url}")
print("   Allowed Clients: User Auth + M2M")
print(f"   User Auth Client ID: {user_auth_client_id}")
print(f"   M2M Client ID: {m2m_client_id}")
```

```python
### 6.3 b: Configure Runtime with JWT Authorizer

# Initialize Runtime object
runtime = Runtime()

# JWT Authorizer Configuration
# - discoveryUrl: Cognito OIDC endpoint (Runtime automatically fetches public keys)
# - allowedClients: Both User Auth and M2M clients can call the Runtime
authorizer_config = {
    "customJWTAuthorizer": {
        "discoveryUrl": discovery_url,
        "allowedClients": [user_auth_client_id, m2m_client_id],
    }
}

# CRITICAL: Configure Runtime with JWT token validation
runtime.configure(
    entrypoint="agent-prevention.py",
    execution_role=role_info["role_arn"],
    auto_create_ecr=True,
    requirements_file="requirements.txt",
    region=AWS_REGION,
    agent_name=f"{WORKSHOP_NAME}_prevention_runtime",
    protocol="MCP",
    authorizer_configuration=authorizer_config,  # ← TOKEN VALIDATION ENABLED
)

print("✅ Runtime configured with JWT authorizer")
print("   Protocol: MCP")
print("   JWT Token Validation: ENABLED")
print("   Allowed Tokens: User Auth + M2M")
```

### 6.4: Launch Runtime to AgentCore

Deploy the configured Runtime to AgentCore using the Python SDK `runtime.launch()`. This critical step transforms your local agent into a production serverless service.

#### 6.4 a: Understanding the Launch Process

  **What happens during runtime.launch():**

  1️⃣ CodeBuild starts building your Docker container

  2️⃣ Dependencies from requirements.txt are installed

  3️⃣ Image is pushed to Amazon ECR (auto-created)

  4️⃣ AgentCore registers Runtime as MCP service
  
  5️⃣ CloudWatch logging is configured

  ⏱️ **Typical duration:** 5-10 minutes

```python
# Added to handle run all cells scenario
import time

time.sleep(10)
```

```python
### 6.4 a: Execute runtime.launch()

print("\n🚀 Launching Runtime to AgentCore...\n")

try:
    # Launch Runtime with auto-update for conflicts
    # This is synchronous - waits for CodeBuild and initial health checks
    launch_result = runtime.launch(auto_update_on_conflict=True)

    # Extract deployment ARN
    runtime_arn = launch_result.agent_arn

    print("✅ Runtime launched successfully!")
    print(f"   Runtime ARN: {runtime_arn}")
    print("\n📝 Configuration stored for next sections:")

except Exception as e:
    print(f"❌ Launch failed: {e}")
    print("\nTroubleshooting:")
    print("  • Check CodeBuild service limits")
    print("  • Verify ECR permissions in IAM role")
    print("  • Review CloudWatch logs for build errors")
    print("  • Ensure all dependencies in requirements.txt are correct")
    raise
```

```python
### 6.4 b: Storing Runtime Configuration

# Extract and store runtime configuration
runtime_arn = launch_result.agent_arn
runtime_id = getattr(launch_result, "agent_id", None)

# Store configuration

store_runtime_configuration(runtime_arn, runtime_id, region=AWS_REGION, prefix=WORKSHOP_NAME)

print("\n✅ Runtime deployed and configured")
print(f"   ARN: {runtime_arn}")
print("   Ready for Gateway registration")
```

## 7. Configure CloudWatch Logging

**Goal:** Set up CloudWatch Logs delivery for Runtime container logs.

**Approach:** Use configure_runtime_logging to automatically set up log delivery.

**Key Learning:** How AgentCore integrates with CloudWatch for observability.

```python
from lab_helpers.lab_04.configure_logging import configure_runtime_logging

# Configure CloudWatch Logs Delivery
print("📊 Configuring CloudWatch Logs Delivery...")

logging_config = configure_runtime_logging(
    runtime_arn=runtime_arn,
    runtime_id=runtime_id,
    region=AWS_REGION,
    log_type="APPLICATION_LOGS",
)

print("\n✅ Logging configured:")
print(f"   Log Group: {logging_config['log_group_name']}")
print(f"   Status: {logging_config['delivery_status']}")
```

## 8. Deploy AgentCore Gateway

**Goal:** Create Gateway infrastructure and register Runtime as target.

**Approach:** Create Gateway with Cognito JWT auth, then register Runtime with OAuth2 M2M credentials.

**Key Learning:** How to set up dual-layer authentication (JWT inbound, OAuth2 M2M outbound).

```python
# Retrieve Cognito credentials from Lab-01
user_auth_client_id = get_parameter(PARAMETER_PATHS["cognito"]["user_auth_client_id"])
user_pool_id = get_parameter(PARAMETER_PATHS["cognito"]["user_pool_id"])

# Build Cognito OIDC discovery URL
discovery_url = f"https://cognito-idp.{AWS_REGION}.amazonaws.com/{user_pool_id}/.well-known/openid-configuration"

# Use helper to create Gateway IAM role
gateway_setup = AgentCoreGatewaySetup(region=AWS_REGION, prefix=WORKSHOP_NAME, verbose=False)
role_info = gateway_setup.create_gateway_service_role()
role_arn = role_info["role_arn"]

# Create Gateway directly with boto3 (simple API call)
agentcore = boto3.client("bedrock-agentcore-control", region_name=AWS_REGION)

gateway_response = agentcore.create_gateway(
    name="aiml301-prevention-gateway",
    roleArn=role_arn,
    protocolType="MCP",
    authorizerType="CUSTOM_JWT",
    authorizerConfiguration={
        "customJWTAuthorizer": {
            "discoveryUrl": discovery_url,
            "allowedClients": [user_auth_client_id],
        }
    },
)

gateway_id = gateway_response["gatewayId"]
gateway_url = gateway_response["gatewayUrl"]

# Store configuration
put_parameter(PARAMETER_PATHS["lab_04"]["gateway_id"], gateway_id)
put_parameter(PARAMETER_PATHS["lab_04"]["gateway_role_arn"], role_arn)

print("✅ Gateway deployed with JWT authorization")
print(f"   Gateway ID: {gateway_id}")
print(f"   Gateway URL: {gateway_url}")
print("   Auth Type: Cognito JWT")
```

### 8.1: Add Runtime as Gateway Target with M2M Auth

  **Goal:** Register the Runtime as a Gateway target with OAuth2 M2M authentication.

  **Architecture:**

```
  User (JWT) → Gateway (JWT Validation) → Runtime (M2M Token)
                      ↓
              Gateway automatically:
              - Calls GetResourceOauth2Token
              - Retrieves credentials from Secrets Manager
              - Gets M2M access token from Cognito
              - Injects Bearer token in request
                      ↓
              Calls Runtime with Authorization: Bearer {token}
```
  **How Gateway Automatically Sends M2M OAuth2 Tokens:**

  1. **Credential Provider Storage**
     - OAuth2 credential provider stores `clientId` + `clientSecret` in AWS Secrets Manager (encrypted)
     - Provider ARN points to this secure storage location

  2. **Automatic Token Retrieval Flow**
  ```
     Gateway target created with credentialProviderConfigurations
         ↓
     Gateway needs to call Runtime target
         ↓
     Gateway calls GetResourceOauth2Token API (automatic, built-in)
         ↓
     AgentCore Identity retrieves client_id + client_secret from Secrets Manager
         ↓
     AgentCore calls Cognito token endpoint:
     POST /token
     Body: grant_type=client_credentials&client_id=...&client_secret=...&scope=...
         ↓
     Cognito returns M2M access token
         ↓
     AgentCore caches token + manages refresh lifecycle
         ↓
     Gateway injects token in request header:
     Authorization: Bearer {access_token}
         ↓
     Gateway calls Runtime MCP endpoint with Bearer token
         ↓
     Runtime validates JWT signature using Cognito public keys (JWKS)
```
  3. **No Custom Code Needed**
  - All credential management is automatic
  - Token refresh is automatic
  - Token injection is automatic
  - Your code just specifies the credential provider ARN

  **Key Learning:** Dual authentication - user-based inbound (JWT), service-based outbound (OAuth2 M2M).

```python
# Added to handle run all cells scenario
import time

time.sleep(10)
```

If you have successfull ran Lab-03, we will reuse the credentials provider we created there. If you are directly running Lab-04, please uncomment below

```python
### 8.1 Create AgentCore Identity CredentialsProvider for Secure Access
## Retrieve M2M credentials from Lab-01 Cognito setup
# m2m_client_id = get_parameter(PARAMETER_PATHS['cognito']['m2m_client_id'])
# m2m_client_secret = get_parameter(PARAMETER_PATHS['cognito']['m2m_client_secret'])
# user_pool_id = get_parameter(PARAMETER_PATHS['cognito']['user_pool_id'])

## Build Cognito OIDC discovery URL
# discovery_url = f"https://cognito-idp.{AWS_REGION}.amazonaws.com/{user_pool_id}/.well-known/openid-configuration"

# Initialize AgentCore client
# agentcore = boto3.client('bedrock-agentcore-control', region_name=AWS_REGION)

## Create OAuth2 Credential Provider
## Stores M2M credentials securely in Secrets Manager
# credential_provider_response = agentcore.create_oauth2_credential_provider(
#      name='aiml301-m2m-credentials',
#      credentialProviderVendor='CustomOauth2',
#      oauth2ProviderConfigInput={
#          'customOauth2ProviderConfig': {
#              'clientId': m2m_client_id,
#              'clientSecret': m2m_client_secret,
#              'oauthDiscovery': {
#                  'discoveryUrl': discovery_url
#              }
#          }
#      }
#  )

## Extract response
# oauth2_provider_arn = credential_provider_response['credentialProviderArn']
# client_secret_arn = credential_provider_response['clientSecretArn']['secretArn']

## Store in SSM for next sections
# put_parameter(PARAMETER_PATHS['lab_03']['oauth2_provider_arn'], oauth2_provider_arn)
# put_parameter(PARAMETER_PATHS['lab_03']['oauth2_secret_arn'], client_secret_arn)

# print("✅ OAuth2 Credential Provider created")
# print(f"\n📋 Credential Storage:")
# print(f"   Provider ARN: {oauth2_provider_arn}")
# print(f"   Secret ARN: {client_secret_arn}")
# print(f"   Location: AWS Secrets Manager (encrypted)")
# print(f"   Credentials: M2M client_id + client_secret")
```

### 8.2: Create OAuth2 Credential Provider and Register Runtime Target

```python
# Get M2M credentials from Parameter Store
# Retrieve configurations from SSM
gateway_id = get_parameter(PARAMETER_PATHS["lab_04"]["gateway_id"], region_name=AWS_REGION)
runtime_arn = get_parameter(PARAMETER_PATHS["lab_04"]["runtime_arn"], region_name=AWS_REGION)

# If using Lab-03 created credentials provider
oauth2_provider_arn = get_parameter(PARAMETER_PATHS["lab_03"]["oauth2_provider_arn"], region_name=AWS_REGION)
# If not using Lab-03, uncomment below to create new credentials provider
# oauth2_provider_arn = get_parameter(PARAMETER_PATHS['lab_04']['oauth2_provider_arn'], region_name=AWS_REGION)

resource_server_id = get_parameter(PARAMETER_PATHS["cognito"]["resource_server_identifier"], region_name=AWS_REGION)
```

```python
print(f"   Gateway ID: {gateway_id}")
print(f"   Gateway URL: {gateway_url}")
print(f"   Runtime ARN: {runtime_arn}")
```

```python
### Create Target for Runtime with M2M OAuth2

import urllib.parse

# IMP: Construct endpoint URL from Runtime ARN
# Format: https://bedrock-agentcore.{region}.amazonaws.com/runtimes/{URL_ENCODED_ARN}/invocations?qualifier=DEFAULT
# Example ARN: arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/my-runtime
encoded_arn = urllib.parse.quote(runtime_arn, safe="")
endpoint_url = (
    f"https://bedrock-agentcore.{AWS_REGION}.amazonaws.com/runtimes/{encoded_arn}/invocations?qualifier=DEFAULT"
)

# M2M scopes for fine-grained authorization
m2m_scopes = [
    f"{resource_server_id}/mcp.invoke",
    f"{resource_server_id}/runtime.access",
]

# Initialize AgentCore client
agentcore = boto3.client("bedrock-agentcore-control", region_name=AWS_REGION)

# Create Gateway Target - Runtime as external MCP server with M2M OAuth2
# The Gateway will automatically:
# 1. Use oauth2_provider_arn to get M2M token from Cognito
# 2. Include Bearer token when calling Runtime
# 3. Runtime validates token and authorizes operation based on scopes
target_response = agentcore.create_gateway_target(
    gatewayIdentifier=gateway_id,
    name="aiml301-runtime-target",
    description="AgentCore Runtime with M2M OAuth2 authentication",
    targetConfiguration={
        "mcp": {
            "mcpServer": {
                "endpoint": endpoint_url  # ← Constructed from Runtime ARN with URL encoding
            }
        }
    },
    credentialProviderConfigurations=[
        {
            "credentialProviderType": "OAUTH",
            "credentialProvider": {
                "oauthCredentialProvider": {
                    "providerArn": oauth2_provider_arn,  # ← References OAuth2 credential provider from Section 9.1
                    "scopes": m2m_scopes,
                }
            },
        }
    ],
)

target_id = target_response["targetId"]
put_parameter(
    PARAMETER_PATHS["lab_04"]["gateway_runtime_target"],
    target_id,
    region_name=AWS_REGION,
)

print("✅ Runtime added as Gateway target with M2M OAuth2")
print(f"   Target ID: {target_id}")
print(f"   Runtime ARN: {runtime_arn}")
print(f"   Endpoint: {endpoint_url}")
print(f"   Credential Provider: {oauth2_provider_arn}")
```

```python
import time

### 9.2 Check Target Status and Synchronize

# Wait for target READY
print("\n⏳ Waiting for target to be READY...")
for attempt in range(30):
    target_info = agentcore.get_gateway_target(gatewayIdentifier=gateway_id, targetId=target_id)
    status = target_info.get("status", "UNKNOWN")

    if status == "READY":
        print("✅ Target is READY")
        break
    if status == "FAILED" or status == "SYNCHRONIZE_UNSUCCESSFUL":
        print(f"❌ Target in ERROR state: {target_info.get('statusReasons', 'No error message')}")
        break
    time.sleep(5)

# Synchronize to discover tools
agentcore.synchronize_gateway_targets(gatewayIdentifier=gateway_id, targetIdList=[target_id])

print("\n✅ Complete - Gateway will automatically manage M2M tokens")
```

  ##### IMP NOTE: 
  Gateway Role needs:

  - bedrock-agentcore:GetResourceOauth2Token - to retrieve M2M tokens from credential provider
  - secretsmanager:GetSecretValue - to access stored OAuth2 credentials

  Why? Gateway initiates the MCP connection to Runtime and needs to authenticate with OAuth2 M2M credentials.

  Runtime Role needs:

  - bedrock-agentcore:GetWorkloadAccessToken - to validate workload identity
  - bedrock-agentcore:CreateWorkloadIdentity - to establish its own identity
  - bedrock-agentcore:GetResourceOauth2Token - to validate incoming OAuth2 tokens from Gateway

  Why? Runtime receives MCP requests from Gateway that include OAuth2 Bearer tokens. The Runtime needs to validate those tokens and authenticate the incoming MCP calls.

## 9. Test Deployed Agent via MCP Client

**Goal:** Verify deployed agent works by connecting through Gateway with JWT authentication.

**Approach:** Authenticate with Cognito, connect MCPClient to Gateway, invoke prevention tools.

**Key Learning:** How to test production agents using MCP protocol.

### 9.1: Authenticate with Cognito and Get JWT Token

```python
import boto3

# Get test user credentials
test_user_email = get_parameter(PARAMETER_PATHS["cognito"]["test_user_email"])
test_user_password = get_parameter(PARAMETER_PATHS["cognito"]["test_user_password"])

print("🔐 Authenticating with Cognito...")
print(f"   User: {test_user_email}")

cognito_client = boto3.client("cognito-idp", region_name=AWS_REGION)

# Authenticate user
auth_response = cognito_client.initiate_auth(
    ClientId=user_auth_client_id,
    AuthFlow="USER_PASSWORD_AUTH",
    AuthParameters={"USERNAME": test_user_email, "PASSWORD": test_user_password},
)

access_token = auth_response["AuthenticationResult"]["AccessToken"]
print("✅ JWT token obtained")
print(f"   Token length: {len(access_token)} chars")
```

```python
print((access_token))
```

### 9.2: Connect MCPClient and List Tools

```python
from lab_helpers.lab_04.mcp_client import MCPClient

# Connect MCP client to gateway
print("🔌 Connecting to Gateway via MCPClient...")
client = MCPClient(gateway_url, access_token, timeout=300)

# Initialize MCP session
print("\n📡 Initializing MCP session...")
server_info = client.initialize()

# List available tools
print("\n🔧 Listing available tools...")
tools = client.list_tools()

print(f"\n✅ Found {len(tools)} tools:")
for i, tool in enumerate(tools, 1):
    print(f"   {i}. {tool['name']}")
    desc = tool.get("description", "No description")
    first_line = desc.split("\n")[0][:80]
    print(f"      {first_line}...")
```

```python
# Added to handle run all cells scenario
import time

time.sleep(10)
```

### 9.3: Invoke Prevention Analysis Tool

```python
# Invoke analyze_infrastructure_prevention tool
print("🔮 Invoking prevention_agent tool...")

result = client.call_tool(
    "aiml301-runtime-target___research_agent",
    {
        "research_topic_query": f"""Research based on this {additional_context} for best practices to minimize issues in the future."""
    },
)

print("\n✅ Prevention analysis complete:")
if not result["isError"]:
    print(result["content"][0]["text"])

else:
    print(f"   Error: {result}")
```

## 10. Cleanup

**Goal:** Remove all Lab-04 AWS resources.

**Approach:** Use cleanup_lab_04 to remove Gateway, Runtime, IAM roles, and logs.

**Note:** Run this when you're done testing to avoid ongoing charges.

```python
# Clean up all Lab-04 resources
print("🧹 Cleaning up Lab-04 resources...")
print("\nWARNING: This will delete:")
print("  • AgentCore Gateway and all targets")
print("  • AgentCore Runtime")
print("  • OAuth2 Credential Provider")
print("  • IAM roles")
print("  • CloudWatch logs")
print("\nTo proceed, uncomment the line below:")
print("# cleanup_lab_04(region_name=AWS_REGION, verbose=True)")

# Uncomment to run cleanup:
# cleanup_lab_04(region_name='us-west-2', verbose=True)
```

## Summary: Lab 4 - Prevention Agent with Production Deployment

✅ **Completed:**
1. ✓ Created Strands Prevention Agent with Browser integration
2. ✓ Tested Browser web access and content extraction
3. ✓ Ran prevention analysis workflow (local)
4. ✓ Deployed agent to AgentCore Runtime
5. ✓ Configured CloudWatch Logs Delivery
6. ✓ Deployed Gateway with Cognito JWT authentication
7. ✓ Registered Runtime as MCP target with OAuth2 M2M
8. ✓ Tested via MCPClient with JWT authentication

**Architecture:**
```
Prevention Agent (Strands + Browser)
    ↓
AgentCore Runtime (FastMCP)
    ↓
Gateway (JWT auth inbound, OAuth2 M2M outbound)
    ↓
MCPClient (test via JWT)
```

**Key Features:**
- **Proactive Prevention**: Analyzes infrastructure for prevention opportunities
- **Research-Based**: Uses AgentCore Browser for current AWS best practices
- **Production-Ready**: Serverless, auto-scaling, observable
- **Secure**: Dual-layer authentication (JWT + OAuth2)

**3 MCP Tools Available:**
1. `analyze_infrastructure_prevention` - Research prevention opportunities
2. `research_aws_best_practices` - Research AWS topics
3. `validate_prevention_environment` - Validate environment readiness

**Next Steps:**
- Lab-05: Multi-Agent Orchestration (Remediation + Prevention)
- Combine Lab-03 + Lab-04 into unified SRE automation pipeline
- RESEARCH → PREVENT → REMEDIATE workflow
