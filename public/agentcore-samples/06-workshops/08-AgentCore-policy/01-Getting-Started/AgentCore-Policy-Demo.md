# Amazon Bedrock AgentCore Policy - Getting Started Demo

## Overview

Welcome to the Amazon Bedrock AgentCore Policy hands-on demo! This notebook will guide you through the complete workflow of setting up and testing policy-based deterministic controls for AI agent-tool interactions.

### What is AgentCore Policy?

Amazon Bedrock AgentCore Policy enables developers to define and enforce security controls for AI agent interactions with tools by creating a protective boundary ("safety box") around agent operations. AI agents can dynamically adapt to solve complex problems, but this flexibility introduces security challenges:

- **Data Leakage**: Agents may inadvertently expose private information
- **Business Rule Violations**: Agents might misinterpret or bypass business rules
- **Authority Overreach**: Agents could act outside their intended scope

Policy intercepts inbound agent traffic through AgentCore Gateways and evaluates each request against defined policies before allowing tool access.

### Key Benefits

✅ **Declarative Security**: Define policies using Cedar language, not code  
✅ **Runtime Enforcement**: Policies are evaluated in real-time  
✅ **Fine-Grained Control**: From coarse restrictions to detailed access control/ authroization
✅ **Separation of Concerns**: Security logic lives outside agent code  
✅ **Enterprise Scale**: Deploy autonomous agents safely in production  

---

## Demo Architecture

```
┌─────────────┐
│   AI Agent  │
└──────┬──────┘
       │
       │ Tool Call Request
       ▼
┌─────────────────────┐
│  AgentCore Gateway  │
│  + OAuth Auth       │
└──────┬──────────────┘
       │
       │ Policy Check
       ▼
┌─────────────────────┐
│   Policy Engine     │
│   (Cedar Policies)  │
└──────┬──────────────┘
       │
       │ ALLOW / DENY
       ▼
┌─────────────────────--┐
│   Gateway Targets     │
│                       │    
└─────────────────────--┘
```

---

## What You'll Learn

In this demo, you will set up a agent with tools to help perform insurance underwriting:

1. **Setup Infrastructure**: Create a Gateway with Lambda targets for creating insurance application, invoking a risk model and approving insurance claims
2. **Create Policy Engine**: Initialize a policy engine for your gateway
3. **Define Policies**: Write Cedar policies to control access
4. **Test Enforcement**: Verify policies work with real agent requests
5. **Understand Results**: Interpret ALLOW and DENY scenarios

---

## Prerequisites

Before starting, ensure you have:

- ✅ AWS CLI configured with appropriate credentials
- ✅ Python 3.10+ with boto3 installed
- ✅ `bedrock_agentcore_starter_toolkit` package installed
- ✅ Access to AWS Lambda (for target functions)

---

## Demo Scenario: Insurance Underwriting Processing

We'll implement a **insurance underwriting processing system** with policy controls:

- **Tools**: 
       - `ApplicationTool` - Creates a insurance application for a region and coverage_amount
       - `RiskModelTool` - Invokes external risk scoring model with governance controls, when provided API classification and data governance approval
       - `ApprovalTool` - Approve high-value or high-risk underwriting decisions, parameters claim_amount and risk_level


Let's get started! 🚀

---

# Step 0: Environment Setup

First, let's verify our environment and import necessary libraries.

```python
# Install requirements
%pip install -r requirements.txt
```

```python
# Restart the kernel to adopt the updates
import IPython

IPython.Application.instance().kernel.do_shutdown(True)
```

```python
# Import required libraries
import sys
from pathlib import Path
import boto3
import json
import logging
```

```python
# Add the scripts directory to Python path
scripts_dir = Path.cwd() / "scripts"
if str(scripts_dir) not in sys.path:
    sys.path.insert(0, str(scripts_dir))

# Prompt for region
session = boto3.Session()
region = session.region_name
if not region:
    region = input("Enter AWS region (e.g., us-east-1, us-west-2): ").strip()
    if not region:
        raise ValueError("AWS region is required")

print(f"Region: {region}")

# Verify AWS credentials
try:
    sts = session.client("sts", region_name=region)
    identity = sts.get_caller_identity()
    print("✅ AWS Credentials Verified")
    print(f"   Account: {identity['Account']}")
    print(f"   User/Role: {identity['Arn']}")
except Exception as e:
    print(f"❌ AWS Credentials Error: {e}")
    print("   Please configure AWS CLI with: aws configure")
```

---

# Step 1: Create Target Functions for AgentCore Gateway

Before setting up the gateway, we need functions that will serve as our tool targets for the Agent.

## What is a Lambda Target?

A Lambda target is a backend function that the AI agent can invoke through the gateway. In our case, we are setting up 3 lambda functions, for ApplicationTool, RiskModelTool and ApprovalTool to support the agent perform insurance underwriting tasks. 

### Create via CLI (run the cell below)
Running the following script will deploy 3 Lambdas in your AWS account:

1. Application Tool: Simplified Application Creation (Mocked Up for Demo purpose)
 Creates insurance applications with applicant region and coverage amount
 Parameters:
 - applicant_region: Customer's geographic region
 - coverage_amount: Requested insurance coverage amount

2. Risk Model Tool: Simplified Risk Model Access (Mocked Up for Demo purpose)
 Invokes risk scoring model and returns assessment
 Parameters:
 - API_classification: API classification (public, internal, restricted)
 - data_governance_approval: Whether data governance has approved model usage

3. Approval Tool: - Insurance Approval Process (Mocked Up for Demo purpose)
 Approves underwriting decisions and claim amounts
 Parameters:
 - claim_amount: Insurance claim/coverage amount
 - risk_level: Risk level assessment (low, medium, high, critical)

```python
%run scripts/lambda-target-setup/deploy_lambdas.py --region $region
```

---

# Step 2: Setup AgentCore Gateway

Now we'll create an AgentCore Gateway with OAuth authentication and attach our Lambda functions as targets.

## What Gets Created?

1. **OAuth Authorization Server**: Cognito-based OAuth for authentication
2. **AgentCore Gateway**: Main gateway with MCP protocol support
3. **Lambda Target**: Your Lambda functions attached with schema definition
4. **Configuration File**: All connection details saved for later use

## Gateway Configuration

The gateway will be configured with:
- **Protocol**: MCP (Model Context Protocol)
- **Authentication**: OAuth 2.0 via Cognito
- **Target**: ApplicationTool, RiskModelTool, ApprovalTool Lambda functions - Target schema will be provided to the Gateway

```python
# Run the gateway setup script
print("🚀 Setting up AgentCore Gateway...\n")
print("This will:")
print("  1. Create OAuth authorization server (Cognito)")
print("  2. Create AgentCore Gateway")
print("  3. Attach Lambda as target")
print("  4. Save configuration to config.json")
print("\n" + "=" * 60)

# Run the gateway setup script
%run scripts/setup_gateway.py
```

### Verify Gateway Configuration

Let's load and verify the gateway configuration that was just created:

```python
# Load gateway configuration
gateway_config_file = "config.json"

with open(gateway_config_file, "r") as f:
    gateway_config = json.load(f)

print("✅ Gateway Configuration Loaded\n")
print("=" * 60)
print(f"Gateway ID:  {gateway_config['gateway']['gateway_id']}")
print(f"Gateway ARN: {gateway_config['gateway']['gateway_arn']}")
print(f"Gateway URL: {gateway_config['gateway']['gateway_url']}")
print(f"Region:      {gateway_config['region']}")
print("\nOAuth Configuration:")
print(f"  Client ID:  {gateway_config['gateway']['client_info']['client_id']}")
print(f"  Token URL:  {gateway_config['gateway']['client_info']['token_endpoint']}")
print("=" * 60)

# Store for later use
GATEWAY_ARN = gateway_config["gateway"]["gateway_arn"]
GATEWAY_ID = gateway_config["gateway"]["gateway_id"]
GATEWAY_URL = gateway_config["gateway"]["gateway_url"]
```

### Run a agent which uses the tools created on the Gateway

```python
# Import the agent session
from scripts.agent_with_tools import AgentSession

# Use the agent within a context manager (this handles setup and cleanup automatically)
with AgentSession() as session:
    # The agent will list all available tools during setup

    # Now you can invoke the agent with different prompts
    response1 = session.invoke("What tools do you have access to?")

    response2 = session.invoke("Create an application for US region with $5M coverage")

    response3 = session.invoke(
        "Invoke the risk model with public API classification and data governance approval set to true"
    )

    response4 = session.invoke("Approve underwriting for $75000 claim with medium risk level")

# The session is automatically cleaned up when exiting the 'with' block
print("=" * 60)
print(f"🚀 The agent has access to the following tools configured on the Gateway: {response1}\n")
print(f"🚀 The agent can create applications without any limits: {response2}\n")
print(f"🚀 The agent can invoke the risk model: {response3}\n")
print(f"🚀 The agent is able to approve the insurance claims: {response4}\n")
print("=" * 60)
```

---

# Step 3: Create Policy Engine and Policies

Now we'll create a Policy Engine with Cedar policies to control access to the tools on the gateway.

## What is a Policy Engine?

A Policy Engine evaluates requests against Cedar policies in real-time. It operates in two modes:
- **LOG_ONLY**: Evaluates but doesn't block (for testing)
- **ENFORCE**: Actively blocks non-compliant requests (for production)

When a Gateway is associated with a Policy Engine, the default action is deny, unless specific policies allow access. An empty policy engine will now allow any tools on the gateway to be accessed. 

### Encryption Keys

When creating a Policy Engine, you can apply a Customer Managed Key (CMK), which is a customer owned and managed key present in the AWS Key Management Service (KMS).  Before creating the Policy Engine, you will be prompted for the ARN of the CMK.  If you do not want to use one, just simply enter no value.

```python
# Get the CMK ARN from the user
user_input = input("Please enter the CMK ARN.  To skip enter a blank value: ")

# If the user entered a value, use it. Otherwise, pass None
cmk_arn = None
if user_input.strip():  # Check if the input is not empty
    cmk_arn = user_input.strip()
```

### Create Policy Engine

First, we'll create a Policy Engine to hold our Cedar policies:

```python
# Import PolicyClient from AgentCore Starter Toolkit
import boto3

# Create the needed constructs to create the policy engine
client = boto3.client("bedrock-agentcore-control", region_name=region)

# Create a Policy Engine
print("🔧 Creating Policy Engine...")

# Capture the data to send into the client
request = {
    "name": "InsurancePolicyEngine",
    "description": "Policy engine for insurance underwriting governance",
}

# If a CMK was provided, add it to the request to create the policy engine
if cmk_arn:
    request["encryptionKeyArn"] = cmk_arn


# Create the policy engine (reuse if one with same name already exists)
try:
    engine = client.create_policy_engine(**request)
except client.exceptions.ConflictException:
    existing = client.list_policy_engines()
    engine = next(e for e in existing.get("policyEngines", []) if e["name"] == request["name"])

print(f"✓ Policy Engine: {engine['policyEngineId']}\n")
```

```python
# Save Policy Engine in the configuration file
with open("config.json", "r") as f:
    config = json.load(f)

# Add policy engine information (without removing existing data)
config["policy_engine_id"] = engine["policyEngineId"]
config["policy_engine_arn"] = engine["policyEngineArn"]

# Write back the updated config
with open("config.json", "w") as f:
    json.dump(config, f, indent=2)

print("✅ Policy engine information added to config.json")
```

```python
# Wait for Policy Engine to become ACTIVE before attaching
import time

_pe_client = boto3.client("bedrock-agentcore-control", region_name=region)
for _ in range(60):
    _pe_status = _pe_client.get_policy_engine(policyEngineId=engine["policyEngineId"]).get("status")
    if _pe_status == "ACTIVE":
        break
    print(f"Policy Engine status: {_pe_status}, waiting...")
    time.sleep(5)
print(f"Policy Engine is {_pe_status}")

# Attach Policy Engine to the Gateway
from bedrock_agentcore_starter_toolkit.operations.gateway.client import GatewayClient

gateway_client = GatewayClient(region_name=region)
gateway_client.logger.setLevel(logging.INFO)

gateway_client.update_gateway_policy_engine(
    gateway_identifier=config["gateway"]["gateway_id"],
    policy_engine_arn=engine["policyEngineArn"],
    mode="ENFORCE",
)
print("✓ Policy Engine attached to Gateway\n")
```

### Now that the Policy Engine is attached to the Gateway, by default the tools will be blocked, both during the list tools API call as well as when a agent tries to access it through the Gateway

```python
# Import the agent session
from scripts.agent_with_tools import list_available_tools, fetch_access_token

client_info = config["gateway"]["client_info"]

CLIENT_ID = client_info["client_id"]
CLIENT_SECRET = client_info["client_secret"]
TOKEN_URL = client_info["token_endpoint"]
access_token = fetch_access_token(CLIENT_ID, CLIENT_SECRET, TOKEN_URL)

print("=" * 60)
print("🚀 The agent has access to the following tools configured on the Gateway: \n")
print(list_available_tools(config["gateway"]["gateway_url"], access_token))
```

### Create Cedar Policy

Now we'll create a Cedar policy that allows insurance applications to be created if the coverage amount is below 1 million:

## Our Policy Rule

```cedar
permit(
  principal,
  action == AgentCore::Action::"ApplicationToolTarget___create_application",
  resource == AgentCore::Gateway::"<gateway-arn>"
) when {
  context.input.coverage_amount <= 1000000
};
```

This means:
- ✅ Create insurance application of $1000000 or less: **ALLOWED**
- ❌ Create insurance application over $1000000: **DENIED**

```python
from bedrock_agentcore_starter_toolkit.operations.policy.client import PolicyClient

# Policy client creation
policy_client = PolicyClient(region_name=region)
policy_client.logger.setLevel(logging.INFO)

# Create Cedar policy
print("\n📝 Creating Cedar Policy...")
print(f"   Policy Engine ID: {engine['policyEngineArn']}")
GATEWAY_ARN = config["gateway"]["gateway_arn"]

# Define the Cedar policy statement
cedar_statement = (
    f"permit(principal, "
    f'action == AgentCore::Action::"ApplicationToolTarget___create_application", '
    f'resource == AgentCore::Gateway::"{GATEWAY_ARN}") '
    f"when {{ context.input.coverage_amount <= 1000000 }};"
)

try:
    policy = policy_client.create_or_get_policy(
        policy_engine_id=engine["policyEngineId"],
        name="create_application_policy",
        description="Allow application creation under $1M",
        definition={"cedar": {"statement": cedar_statement}},
    )
    print(f"✓ Policy: {policy['policyId']}\n")
except Exception as e:
    print(f"⚠️  Policy creation failed: {e}")
    print("   This may be due to Cedar validation findings (e.g., policy too restrictive or schema issues).")
    print("   Retrying with validation_mode='IGNORE_ALL_FINDINGS'...")
    policy = policy_client.create_or_get_policy(
        policy_engine_id=engine["policyEngineId"],
        name="create_application_policy",
        description="Allow application creation under $1M",
        definition={"cedar": {"statement": cedar_statement}},
        validation_mode="IGNORE_ALL_FINDINGS",
    )
    print(f"✓ Policy created with IGNORE_ALL_FINDINGS: {policy['policyId']}\n")

# Save to config
config["policy_id"] = policy["policyId"]
with open("config.json", "w") as f:
    json.dump(config, f, indent=2)
```

---

# Step 4: Test Policy Enforcement with AI Agent

Now for the exciting part - let's test our policy with a real AI agent!
You will also now notice that due to the policy we have attached for the create_application tool, this tool can now be listed by the gateway and invoked by the agent

## Test Scenarios

We'll test two scenarios:

### Test 1: ALLOWED Scenario ✅
- **Request**: Create a application with a coverage amount of a $750,000
- **Expected**: Policy allows, Lambda executes, application created
- **Reason**: $750K <= $1M (within policy limit)

```python
# Use the agent within a context manager (this handles setup and cleanup automatically)
with AgentSession() as session:
    # The agent will list all available tools during setup

    # Now you can invoke the agent with different prompts
    response1 = session.invoke("What tools do you have access to?")

    response2 = session.invoke("Create an application for US region with $750,000 coverage")
```

### Test 2: DENIED Scenario ❌
- **Request**: Create a application with a coverage amount of a $1.5M
- **Expected**: Policy blocks, Lambda never executes
- **Reason**: $1.5M > $1M (exceeds policy limit)

```python
with AgentSession() as session:
    # The agent will list all available tools during setup

    response2 = session.invoke("Create an application for US region with $1.5M coverage")
```

## Clean Up

<div style="background-color: #d1ecf1; border-left: 4px solid #0c5460; padding: 10px; margin: 10px 0; color: #000;">
    <strong style="color: #000;">ℹ️ Note:</strong> 02-Natural-Language-Policy-Authoring/NL-Authoring-Policy.ipynb will reuse the Gateway set up from this Demo. You can skip the Cleanup step, and perform it after testing NL2Cedar functionality in the second lab. 
</div>


To clean up the resources of policy engines and policies, it is done in the following order:
1. Delete the association of the policy engine on the gateway by using the update_gateway CLI and passing in a empty policy engine

2. Delete all the policies in the policy engine

3. Delete the policy engine

```python
from bedrock_agentcore_starter_toolkit.operations.gateway.client import GatewayClient
from bedrock_agentcore_starter_toolkit.operations.policy.client import PolicyClient

with open("config.json", "r") as f:
    config = json.load(f)

# Clean up Policy Engine first
print("🧹 Cleaning up Policy Engine...")
policy_client = PolicyClient(region_name=config["region"])
policy_client.cleanup_policy_engine(config["policy_engine_id"])
print("✓ Policy Engine cleaned up\n")

# Then clean up Gateway
print("🧹 Cleaning up Gateway...")
gateway_client = GatewayClient(region_name=config["region"])
gateway_client.cleanup_gateway(config["gateway"]["gateway_id"], config["gateway"]["client_info"])
print("✅ Cleanup complete!")
```
