# Policy for Amazon Bedrock AgentCore - End-to-End Tutorial

## Overview

This notebook demonstrates how to implement **Policy for Amazon Bedrock AgentCore**, a feature that enables fine-grained access control for AI agents in tool invocations, using Cedar policies and your JWT token claims with enforcement on Amazon Bedrock AgentCore Gateways.

### What You'll Learn

- How to configure Amazon Cognito to add custom claims to JWT tokens
- How to create policies with Cedar, that validate JWT claims provided via Amazon Bedrock AgentCore Identity
- How to implement attribute-based access control (ABAC) patterns
- How to test and verify policy enforcement with different claim scenarios with attached Amazon Bedrock AgentCore Gateways

### Key Concepts

**Policy for Amazon Bedrock AgentCore**: A Cedar-based policy engine that evaluates access requests against fine-grained policies, using JWT token claims as principal attributes.

**Amazon Bedrock AgentCore Identity**: Integrates with Amazon Cognito, or any other Identity Provider (IdP) that supports OAuth, to authenticate requests and extract JWT claims for policy evaluation.

**Amazon Bedrock AgentCore Gateway**: An easy and secure way for developers to build, deploy, discover, and connect to tools at scale with MCP.

**[Cedar Policies](https://www.cedarpolicy.com/en)**: Declarative policies that define who (principal) can perform what (action) on which resources, with optional conditions. Learn more at [cedarpolicy.com](https://www.cedarpolicy.com/en).

### Sample Architecture

```
                                ┌───────────────────────┐
                                │  Policy for AgentCore │
                                │  (Cedar Policies)     │
                                │                       │
                                │  Evaluates:           │
                                │  - principal tags     │
                                │  - context.input      │
                                │  - resource           │
                                └───────────┬───────────┘
                                            │ attached
                                            ▼
┌─────────────────┐             ┌───────────────────────┐             ┌─────────────┐
│   Amazon        │  JWT Token  │  Amazon Bedrock       │             │   Lambda    │
│   Cognito       │────────────▶│  AgentCore Gateway    │────────────▶│   Target    │
│   + AWS Lambda  │  with       │                       │  if ALLOWED │   (Tool)    │
└─────────────────┘  claims     └───────────────────────┘             └─────────────┘
```

### Prerequisites

- AWS account with appropriate IAM permissions
- Amazon Bedrock AgentCore Gateway already configured with OAuth authorizer
- Amazon Cognito User Pool with an app client (M2M)
- Python 3.8+ with boto3 and requests installed
- AWS credentials configured

---

## Part 1: Setup and Configuration

First, let's install the required dependencies and initialize our configuration.

```python
# Install required packages
%pip install -r requirements.txt
```

```python
import json
import os
import time
import base64
import zipfile
import tempfile
from pathlib import Path
from typing import Dict, Any, Optional, List

import boto3
import requests
from botocore.exceptions import ClientError

print("✓ Libraries imported successfully")
```

### Step 1.1: Load or Create Configuration

This tutorial requires a `gateway_config.json` file containing your Amazon Bedrock AgentCore Gateway details and Amazon Cognito client information. If you don't have these resources already, you can create these by running the utility script `setup-gateway.py` provided in this same folder.

#### Expected Configuration Structure

```json
{
  "gateway_url": "https://<gateway-id>.gateway.policy-registry.<region>.amazonaws.com/mcp",
  "gateway_id": "<gateway-id>",
  "gateway_arn": "arn:aws:policy-registry:<region>:<account-id>:gateway/<gateway-id>",
  "region": "<region>",
  "client_info": {
    "client_id": "<cognito-app-client-id>",
    "client_secret": "<cognito-app-client-secret>",
    "user_pool_id": "<region>_<pool-id>",
    "token_endpoint": "https://<domain>.auth.<region>.amazoncognito.com/oauth2/token"
  },
  "policy_engine_id": "<optional-policy-engine-id>"
}
```

#### Setting Up Prerequisites

If you don't have these resources configured yet, you can run the setup script directly from this notebook. The script will:
- Create an Amazon Bedrock AgentCore Gateway with OAuth authorization
- Create a sample Refund Lambda function for testing
- Attach the Lambda as a target to the Gateway
- Save the configuration to `gateway_config.json`

Run the cell below to execute the setup script:

```python
# Prompt the user for the AWS region
session = boto3.Session()
SETUP_REGION = session.region_name
if not SETUP_REGION:
    SETUP_REGION = input("Enter AWS region (e.g., us-east-1, us-west-2): ").strip()
    if not SETUP_REGION:
        raise ValueError("AWS region is required")

print(f"Using region: {SETUP_REGION}")

# Optional: Specify an IAM role ARN if you have one with the trust relationship configured
# Leave as None to create a new role automatically
SETUP_ROLE_ARN = None  # e.g., "arn:aws:iam::123456789012:role/MyGatewayRole"
```

```python
# Run this cell to set up the Gateway and Lambda target automatically
import subprocess
import sys

cmd = [sys.executable, "setup-gateway.py", "--region", SETUP_REGION]
if SETUP_ROLE_ARN:
    cmd.extend(["--role-arn", SETUP_ROLE_ARN])

result = subprocess.run(cmd, capture_output=False, text=True)
if result.returncode != 0:
    print(f"Setup failed with return code: {result.returncode}")
```

Alternatively, you can set up the resources manually by following these guides:

1. **Amazon Bedrock AgentCore Gateway**: [Gateway Quickstart Guide](https://docs.aws.amazon.com/policy-registry/latest/devguide/gateway.html)
2. **Adding Targets to Gateway**: [Gateway Targets Documentation](https://docs.aws.amazon.com/policy-registry/latest/devguide/gateway-targets.html)
3. **Amazon Cognito User Pool**: [Amazon Cognito Developer Guide](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html)

```python
# Template for gateway_config.json
CONFIG_TEMPLATE = {
    "gateway_url": "https://<gateway-id>.gateway.policy-registry.<region>.amazonaws.com/mcp",
    "gateway_id": "<gateway-id>",
    "gateway_arn": "arn:aws:policy-registry:<region>:<account-id>:gateway/<gateway-id>",
    "region": "<region>",
    "client_info": {
        "client_id": "<cognito-app-client-id>",
        "client_secret": "<cognito-app-client-secret>",
        "user_pool_id": "<region>_<pool-id>",
        "token_endpoint": "https://<domain>.auth.<region>.amazoncognito.com/oauth2/token",
    },
}


def load_or_create_gateway_config() -> Dict[str, Any]:
    """
    Load gateway configuration from gateway_config.json.
    If the file doesn't exist, create a template for the user to fill in.
    """
    config_path = Path.cwd() / "gateway_config.json"

    if not config_path.exists():
        # Create template file
        with open(config_path, "w", encoding="utf-8") as f:
            json.dump(CONFIG_TEMPLATE, f, indent=2)

        print("⚠️  gateway_config.json not found!")
        print(f"\n✓ Created template at: {config_path}")
        print("\nPlease fill in the configuration with your actual values:")
        print("  1. Set up an Amazon Bedrock AgentCore Gateway")
        print("  2. Create an Amazon Cognito User Pool with an app client (M2M)")
        print("  3. Update gateway_config.json with your resource details")
        print("  4. Re-run this cell")
        print("\nDocumentation:")
        print("  - Gateway: https://docs.aws.amazon.com/policy-registry/latest/devguide/gateway.html")
        print("  - Cognito: https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html")
        raise FileNotFoundError("Please configure gateway_config.json and re-run this cell.")

    with open(config_path, "r", encoding="utf-8") as f:
        config = json.load(f)

    # Validate required fields
    required_fields = [
        "gateway_url",
        "gateway_id",
        "gateway_arn",
        "region",
        "client_info",
    ]
    missing = [f for f in required_fields if f not in config or "<" in str(config.get(f, ""))]

    if missing:
        print("⚠️  Configuration incomplete!")
        print(f"   Please update these fields in gateway_config.json: {missing}")
        raise ValueError(f"Missing or placeholder values in config: {missing}")

    # Validate client_info fields
    client_info_fields = [
        "client_id",
        "client_secret",
        "user_pool_id",
        "token_endpoint",
    ]
    client_info = config.get("client_info", {})
    missing_client = [f for f in client_info_fields if f not in client_info or "<" in str(client_info.get(f, ""))]

    if missing_client:
        print("⚠️  Client info incomplete!")
        print(f"   Please update client_info fields: {missing_client}")
        raise ValueError(f"Missing or placeholder values in client_info: {missing_client}")

    return config


# Load configuration
CONFIG = load_or_create_gateway_config()

# Extract key values
REGION = CONFIG["region"]
GATEWAY_URL = CONFIG["gateway_url"]
GATEWAY_ID = CONFIG["gateway_id"]
GATEWAY_ARN = CONFIG["gateway_arn"]
USER_POOL_ID = CONFIG["client_info"]["user_pool_id"]
CLIENT_ID = CONFIG["client_info"]["client_id"]
CLIENT_SECRET = CONFIG["client_info"]["client_secret"]
TOKEN_ENDPOINT = CONFIG["client_info"]["token_endpoint"]
POLICY_ENGINE_ID = CONFIG.get("policy_engine_id")

print("✓ Configuration loaded successfully")
print(f"  Region: {REGION}")
print(f"  Gateway ID: {GATEWAY_ID}")
print(f"  Gateway URL: {GATEWAY_URL}")
print(f"  User Pool ID: {USER_POOL_ID}")
print(f"  Policy Engine ID: {POLICY_ENGINE_ID or 'Not configured yet'}")
```

### Step 1.2: Initialize AWS Clients

Create the boto3 clients needed for this tutorial.

```python
# Initialize AWS clients
session = boto3.Session(region_name=REGION)

lambda_client = session.client("lambda")
cognito_client = session.client("cognito-idp")
iam_client = session.client("iam")
sts_client = session.client("sts")

# AgentCore Control client for managing Policy Engines and Cedar policies
policy_client = session.client("bedrock-agentcore-control", region_name=REGION)

# Get current account information
ACCOUNT_ID = sts_client.get_caller_identity()["Account"]

print("✓ AWS clients initialized")
print(f"  Account ID: {ACCOUNT_ID}")
print(f"  Region: {REGION}")
```

### Step 1.3: Validate Gateway Authorizer Configuration

This step ensures the gateway's JWT authorizer is properly configured for Cognito access tokens.

**Important**: Amazon Cognito access tokens do not include an `aud` (audience) claim. If the gateway has `allowedAudience` configured, token validation will fail with a 401 error. This step checks and fixes the configuration if needed.

```python
# Gateway control client for managing gateway configuration
gateway_control_client = session.client("bedrock-agentcore-control", region_name=REGION)


def get_gateway_details() -> Dict[str, Any]:
    """Get current gateway details."""
    return gateway_control_client.get_gateway(gatewayIdentifier=GATEWAY_ID)


def wait_for_gateway_ready(max_wait: int = 300, poll_interval: int = 5) -> bool:
    """Wait for gateway to reach READY state."""
    terminal_states = {"READY", "FAILED", "UPDATE_UNSUCCESSFUL"}
    start_time = time.time()

    while time.time() - start_time < max_wait:
        gateway = get_gateway_details()
        status = gateway.get("status", "UNKNOWN")
        print(f"  Gateway status: {status}")

        if status == "READY":
            return True
        if status in terminal_states:
            print(f"  ✗ Gateway reached terminal state: {status}")
            return False

        time.sleep(poll_interval)

    print("  ✗ Timeout waiting for gateway")
    return False


def validate_and_fix_gateway_authorizer() -> bool:
    """
    Validate gateway authorizer configuration and fix if needed.

    Cognito access tokens don't have an 'aud' claim, so allowedAudience
    must not be set or the gateway will reject valid tokens.

    Returns:
        True if configuration is valid or was fixed successfully
    """
    print("\nValidating Gateway Authorizer Configuration")
    print("=" * 70)

    gw = get_gateway_details()
    jwt_config = gw.get("authorizerConfiguration", {}).get("customJWTAuthorizer", {})

    # Check current configuration
    discovery_url = jwt_config.get("discoveryUrl")
    allowed_clients = jwt_config.get("allowedClients", [])
    allowed_audience = jwt_config.get("allowedAudience", [])
    allowed_scopes = jwt_config.get("allowedScopes", [])

    print(f"  Discovery URL: {discovery_url or 'NOT SET'}")
    print(f"  Allowed Clients: {allowed_clients}")
    print(f"  Allowed Audience: {allowed_audience}")
    print(f"  Allowed Scopes: {allowed_scopes}")

    # Build expected discovery URL
    expected_discovery_url = (
        f"https://cognito-idp.{REGION}.amazonaws.com/{USER_POOL_ID}/.well-known/openid-configuration"
    )

    # Check if configuration needs fixing
    needs_fix = False
    reasons = []

    if not discovery_url:
        needs_fix = True
        reasons.append("Discovery URL not set")
    elif discovery_url != expected_discovery_url:
        needs_fix = True
        reasons.append("Discovery URL mismatch")

    if CLIENT_ID not in allowed_clients:
        needs_fix = True
        reasons.append(f"Client ID {CLIENT_ID} not in allowed clients")

    # Cognito access tokens don't have 'aud' claim - allowedAudience must be empty
    if allowed_audience:
        needs_fix = True
        reasons.append("allowedAudience is set but Cognito access tokens don't have 'aud' claim")

    if not needs_fix:
        print("\n✓ Gateway authorizer configuration is valid")
        return True

    print("\n⚠️  Configuration needs fixing:")
    for reason in reasons:
        print(f"   - {reason}")

    # Fix the configuration
    print("\n⏳ Updating gateway authorizer configuration...")

    # Get scope from config if available
    scope = CONFIG.get("client_info", {}).get("scope", "")

    new_auth_config = {
        "customJWTAuthorizer": {
            "discoveryUrl": expected_discovery_url,
            "allowedClients": [CLIENT_ID],
            # Do NOT set allowedAudience - Cognito access tokens don't have 'aud' claim
        }
    }

    # Add scope if configured
    if scope:
        new_auth_config["customJWTAuthorizer"]["allowedScopes"] = [scope]

    try:
        # Only include policyEngineConfiguration if one is already attached
        pe_config = gw.get("policyEngineConfiguration", {})
        update_params = dict(
            gatewayIdentifier=GATEWAY_ID,
            name=gw.get("name"),
            roleArn=gw.get("roleArn"),
            protocolType=gw.get("protocolType", "MCP"),
            authorizerType="CUSTOM_JWT",
            authorizerConfiguration=new_auth_config,
        )
        if pe_config and pe_config.get("arn"):
            update_params["policyEngineConfiguration"] = pe_config

        gateway_control_client.update_gateway(**update_params)

        print("\n⏳ Waiting for gateway to become READY...")
        if wait_for_gateway_ready():
            print("\n✓ Gateway authorizer configuration fixed successfully")
            return True
        else:
            print("\n✗ Gateway did not reach READY state")
            return False

    except ClientError as e:
        print(f"\n✗ Error updating gateway: {e}")
        return False


# Validate and fix gateway authorizer if needed
validate_and_fix_gateway_authorizer()
```

---

## Part 2: Helper Functions

These utility functions will be used throughout the tutorial for token management, API calls, and response analysis.

```python
def get_bearer_token() -> str:
    """
    Get bearer token using OAuth2 client credentials flow.

    Returns:
        Access token string
    """
    # Get scope from config if available
    scope = CONFIG.get("client_info", {}).get("scope", "")

    data = {
        "grant_type": "client_credentials",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
    }

    # Add scope if configured
    if scope:
        data["scope"] = scope

    response = requests.post(
        TOKEN_ENDPOINT,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        data=data,
    )
    response.raise_for_status()
    return response.json()["access_token"]


def decode_token(access_token: str) -> Dict[str, Any]:
    """
    Decode JWT token to inspect claims (without verification).

    Args:
        access_token: JWT access token

    Returns:
        Decoded token payload as dictionary
    """
    parts = access_token.split(".")
    if len(parts) != 3:
        raise ValueError("Invalid JWT token format")

    # Decode payload (add padding if needed)
    payload_encoded = parts[1]
    padding = 4 - len(payload_encoded) % 4
    if padding != 4:
        payload_encoded += "=" * padding

    return json.loads(base64.urlsafe_b64decode(payload_encoded))


def make_gateway_request(bearer_token: str, tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
    """
    Make a JSON-RPC request to the Amazon Bedrock AgentCore Gateway.

    Args:
        bearer_token: OAuth2 access token
        tool_name: Name of the tool to invoke
        arguments: Tool arguments

    Returns:
        JSON-RPC response
    """
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {"name": tool_name, "arguments": arguments},
    }

    response = requests.post(
        GATEWAY_URL,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {bearer_token}",
            "Accept": "application/json",
        },
        json=payload,
    )
    response.raise_for_status()
    return response.json()


def analyze_response(result: Dict[str, Any]) -> str:
    """
    Analyze gateway response and determine outcome.

    Returns:
        'ALLOWED', 'DENIED', or 'ERROR'
    """
    # Check for JSON-RPC error (policy denial comes as error with specific messages)
    if "error" in result:
        error_msg = result["error"].get("message", "").lower()
        # Policy denials return errors like 'tool call not allowed', 'access denied', etc.
        if any(phrase in error_msg for phrase in ["not allowed", "denied", "forbidden", "unauthorized action"]):
            return "DENIED"
        return "ERROR"

    if "result" in result:
        # Check if result indicates an error (some denials come this way)
        if result["result"].get("isError", False):
            content = result["result"].get("content", [])
            if content:
                text = content[0].get("text", "").lower() if isinstance(content[0], dict) else str(content[0]).lower()
                if any(phrase in text for phrase in ["not allowed", "denied", "forbidden"]):
                    return "DENIED"
            return "DENIED"
        return "ALLOWED"

    return "UNKNOWN"


def display_test_result(expected: str, actual: str, description: str) -> bool:
    """
    Display test result with formatting.

    Returns:
        True if test passed, False otherwise
    """
    passed = expected == actual
    status = "✓ PASS" if passed else "✗ FAIL"
    print(f"\n{status}: {description}")
    print(f"   Expected: {expected}")
    print(f"   Actual: {actual}")
    return passed


print("✓ Helper functions defined")
```

---

## Part 3: Configure Amazon Cognito Lambda Trigger

To add custom claims to JWT tokens, we need to configure a Pre Token Generation AWS Lambda trigger in Amazon Cognito.

### Important Notes

- For M2M (machine-to-machine) client credentials flow, you **must** use AWS Lambda trigger version **V3_0**
- V3_0 requires Amazon Cognito **Essentials** or **Plus** tier
- The AWS Lambda function adds custom claims like `department_name`, `groups`, etc. to the JWT token
- These claims become **principal tags** in Cedar policies

```python
def create_lambda_function(claims: Dict[str, Any], function_name: Optional[str] = None) -> str:
    """
    Create or update Lambda function for pre-token generation trigger.

    Args:
        claims: Dictionary of claims to add to the token
        function_name: Optional custom function name

    Returns:
        Lambda function ARN
    """
    if function_name is None:
        function_name = f"cognito-custom-claims-{USER_POOL_ID}"

    print(f"\nConfiguring Lambda Function: {function_name}")
    print("=" * 70)

    # Generate Lambda code with specified claims
    claims_json = json.dumps(claims, indent=12)

    lambda_code = f'''
import json

def lambda_handler(event, context):
    """
    Pre-token generation V3 Lambda trigger for Cognito.
    Adds custom claims to JWT tokens for all flows including client_credentials.
    """
    print(f"Event: {{json.dumps(event)}}")
    print(f"Trigger Source: {{event.get('triggerSource', 'unknown')}}")
    
    # Add custom claims to the token
    event['response'] = {{
        'claimsAndScopeOverrideDetails': {{
            'accessTokenGeneration': {{
                'claimsToAddOrOverride': {claims_json}
            }},
            'idTokenGeneration': {{
                'claimsToAddOrOverride': {claims_json}
            }}
        }}
    }}
    
    print(f"Modified event: {{json.dumps(event)}}")
    return event
'''

    # Create deployment package
    with tempfile.NamedTemporaryFile(suffix=".zip", delete=False) as tmp_file:
        zip_path = tmp_file.name
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
            zipf.writestr("lambda_function.py", lambda_code)

    try:
        with open(zip_path, "rb") as f:
            zip_content = f.read()

        # Try to update existing function
        try:
            lambda_client.update_function_code(FunctionName=function_name, ZipFile=zip_content)
            print("✓ Updated Lambda function code")
            response = lambda_client.get_function(FunctionName=function_name)
            return response["Configuration"]["FunctionArn"]

        except lambda_client.exceptions.ResourceNotFoundException:
            # Create new function with IAM role
            role_name = f"{function_name}-role"
            role_arn = f"arn:aws:iam::{ACCOUNT_ID}:role/{role_name}"

            # Create IAM role if needed
            try:
                iam_client.create_role(
                    RoleName=role_name,
                    AssumeRolePolicyDocument=json.dumps(
                        {
                            "Version": "2012-10-17",
                            "Statement": [
                                {
                                    "Effect": "Allow",
                                    "Principal": {"Service": "lambda.amazonaws.com"},
                                    "Action": "sts:AssumeRole",
                                }
                            ],
                        }
                    ),
                )
                iam_client.attach_role_policy(
                    RoleName=role_name,
                    PolicyArn="arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
                )
                print(f"✓ Created IAM role: {role_name}")
                print("  Waiting for IAM role propagation...")
                time.sleep(10)
            except iam_client.exceptions.EntityAlreadyExistsException:
                print(f"  IAM role already exists: {role_name}")

            response = lambda_client.create_function(
                FunctionName=function_name,
                Runtime="python3.12",
                Role=role_arn,
                Handler="lambda_function.lambda_handler",
                Code={"ZipFile": zip_content},
                Timeout=30,
                MemorySize=128,
            )
            print("✓ Created Lambda function")
            return response["FunctionArn"]
    finally:
        os.remove(zip_path)


print("✓ Lambda creation function defined")
```

```python
def configure_cognito_trigger(lambda_arn: str) -> None:
    """
    Configure Cognito User Pool with Lambda trigger V3_0.

    Args:
        lambda_arn: Lambda function ARN
    """
    print("\nConfiguring Cognito User Pool Trigger")
    print("=" * 70)

    # Update user pool with V3_0 trigger (required for M2M)
    cognito_client.update_user_pool(
        UserPoolId=USER_POOL_ID,
        LambdaConfig={
            "PreTokenGenerationConfig": {
                "LambdaVersion": "V3_0",
                "LambdaArn": lambda_arn,
            }
        },
    )
    print("✓ User Pool trigger configured (V3_0)")
    print(f"  User Pool ID: {USER_POOL_ID}")
    print(f"  Lambda ARN: {lambda_arn}")

    # Add Lambda permission for Cognito
    try:
        lambda_client.add_permission(
            FunctionName=lambda_arn,
            StatementId=f"CognitoInvoke-{USER_POOL_ID}",
            Action="lambda:InvokeFunction",
            Principal="cognito-idp.amazonaws.com",
            SourceArn=f"arn:aws:cognito-idp:{REGION}:{ACCOUNT_ID}:userpool/{USER_POOL_ID}",
        )
        print("✓ Lambda permission added for Cognito")
    except lambda_client.exceptions.ResourceConflictException:
        print("  Lambda permission already exists")

    print("\n⚠️  IMPORTANT: V3_0 trigger requires Cognito Essentials or Plus tier")


print("✓ Cognito trigger function defined")
```

---

## Part 4: Policy Engine Functions

These functions interact with the Policy for Amazon Bedrock AgentCore service to create and manage Cedar policies.

### Cedar Policy Syntax for JWT Claims

JWT claims are accessed via **principal tags** in Cedar policies:

| Pattern | Cedar Syntax |
|---------|-------------|
| Check claim exists | `principal.hasTag("claim_name")` |
| Exact match | `principal.getTag("claim_name") == "value"` |
| Pattern match | `principal.getTag("claim_name") like "*value*"` |
| Input validation | `context.input.field <= value` |

```python
def create_policy_engine(name: str) -> Optional[str]:
    """
    Create a new policy engine.

    Args:
        name: Name for the policy engine

    Returns:
        Policy engine ID if successful, None otherwise
    """
    print(f"\nCreating Policy Engine: {name}")
    print("=" * 70)

    try:
        import uuid

        response = policy_client.create_policy_engine(
            name=name,
            description=f"Policy engine created at {time.strftime('%Y-%m-%d %H:%M:%S')}",
            clientToken=str(uuid.uuid4()),
        )

        policy_engine_id = response["policyEngineId"]
        print("✓ Policy engine created")
        print(f"  Policy Engine ID: {policy_engine_id}")

        return policy_engine_id

    except ClientError as e:
        print(f"✗ Error creating policy engine: {e}")
        return None


def get_policy_engine(policy_engine_id: str) -> Optional[Dict[str, Any]]:
    """
    Get policy engine details.
    """
    try:
        return policy_client.get_policy_engine(policyEngineId=policy_engine_id)
    except ClientError:
        return None


def wait_for_policy_engine_active(policy_engine_id: str, timeout: int = 300) -> bool:
    """
    Wait for policy engine to reach ACTIVE state.

    Args:
        policy_engine_id: Policy engine ID
        timeout: Maximum wait time in seconds

    Returns:
        True if active, False if timeout or failed
    """
    print("\nWaiting for Policy Engine to become ACTIVE...")
    start_time = time.time()

    while time.time() - start_time < timeout:
        engine = get_policy_engine(policy_engine_id)
        if not engine:
            time.sleep(5)
            continue

        status = engine.get("status")
        print(f"  Status: {status}")

        if status == "ACTIVE":
            print("✓ Policy engine is ACTIVE")
            return True

        if status in ["CREATE_FAILED", "UPDATE_FAILED", "DELETE_FAILED"]:
            print(f"✗ Policy engine failed: {engine.get('statusReason', 'Unknown')}")
            return False

        time.sleep(5)

    print("✗ Timeout waiting for policy engine")
    return False


print("✓ Policy engine functions defined")
```

```python
def create_cedar_policy(policy_name: str, cedar_statement: str, description: str = "") -> Optional[str]:
    """
    Create a Cedar policy in the Policy Engine.

    Args:
        policy_name: Unique name for the policy
        cedar_statement: Cedar policy statement
        description: Policy description

    Returns:
        Policy ID if successful, None otherwise
    """
    print(f"\nCreating Cedar Policy: {policy_name}")
    print("=" * 70)
    print("\nCedar Statement:")
    print("-" * 60)
    print(cedar_statement)
    print("-" * 60)

    try:
        response = policy_client.create_policy(
            policyEngineId=POLICY_ENGINE_ID,
            name=policy_name,
            description=description or f"Policy: {policy_name}",
            definition={"cedar": {"statement": cedar_statement}},
        )

        policy_id = response["policyId"]
        policy_status = response["status"]

        print("\n✓ Policy created successfully")
        print(f"  Policy ID: {policy_id}")
        print(f"  Status: {policy_status}")

        return policy_id

    except ClientError as e:
        error_code = e.response["Error"]["Code"]
        error_msg = e.response["Error"]["Message"]
        print(f"\n✗ Error creating policy: {error_code}")
        print(f"  {error_msg}")
        return None


def get_policy(policy_id: str) -> Optional[Dict[str, Any]]:
    """
    Get policy details including status.

    Args:
        policy_id: Policy ID to retrieve

    Returns:
        Policy details dict or None if not found
    """
    try:
        return policy_client.get_policy(policyEngineId=POLICY_ENGINE_ID, policyId=policy_id)
    except ClientError:
        return None


def wait_for_policy_active(policy_id: str, timeout: int = 60) -> bool:
    """
    Wait for a policy to reach ACTIVE status.

    Args:
        policy_id: Policy ID to check
        timeout: Maximum wait time in seconds

    Returns:
        True if policy is ACTIVE, False otherwise
    """
    start_time = time.time()

    while time.time() - start_time < timeout:
        policy = get_policy(policy_id)
        if not policy:
            print(f"  ⚠️  Policy not found: {policy_id}")
            return False

        status = policy.get("status")
        print(f"  Policy status: {status}")

        if status == "ACTIVE":
            return True

        if status in ["CREATE_FAILED", "UPDATE_FAILED"]:
            print(f"  ✗ Policy failed: {policy.get('statusReason', 'Unknown')}")
            return False

        time.sleep(3)

    print("  ✗ Timeout waiting for policy to become ACTIVE")
    return False


def delete_policy(policy_id: str) -> bool:
    """
    Delete a policy from the Policy Engine.
    """
    try:
        policy_client.delete_policy(policyEngineId=POLICY_ENGINE_ID, policyId=policy_id)
        print(f"✓ Deleted policy: {policy_id}")
        return True
    except ClientError as e:
        print(f"⚠️  Could not delete policy {policy_id}: {e}")
        return False


def list_policies() -> List[Dict[str, Any]]:
    """
    List all policies in the Policy Engine.
    """
    try:
        response = policy_client.list_policies(policyEngineId=POLICY_ENGINE_ID)
        return response.get("policies", [])
    except ClientError:
        return []


print("✓ Cedar policy functions defined")
```

### Step 4.1: Ensure Policy Engine Exists

Check if a policy engine exists, or create one if needed.

```python
def ensure_policy_engine() -> str:
    """
    Ensure a policy engine exists and is active.
    Creates one if needed and updates gateway_config.json.

    Returns:
        Policy engine ID
    """
    global POLICY_ENGINE_ID, CONFIG

    print("\nEnsuring Policy Engine Exists")
    print("=" * 70)

    # Check if we already have a policy engine ID
    if POLICY_ENGINE_ID:
        engine = get_policy_engine(POLICY_ENGINE_ID)
        if engine and engine.get("status") == "ACTIVE":
            print(f"✓ Using existing policy engine: {POLICY_ENGINE_ID}")
            return POLICY_ENGINE_ID

    # List existing policy engines
    try:
        response = policy_client.list_policy_engines()
        engines = response.get("policyEngines", [])

        for engine in engines:
            if engine.get("status") == "ACTIVE":
                POLICY_ENGINE_ID = engine["policyEngineId"]
                print(f"✓ Found existing ACTIVE policy engine: {POLICY_ENGINE_ID}")
                break
    except ClientError:
        pass

    # Create new policy engine if needed
    if not POLICY_ENGINE_ID:
        engine_name = f"PolicyEngine_{int(time.time())}"
        POLICY_ENGINE_ID = create_policy_engine(engine_name)

        if not POLICY_ENGINE_ID:
            raise RuntimeError("Failed to create policy engine")

        if not wait_for_policy_engine_active(POLICY_ENGINE_ID):
            raise RuntimeError("Policy engine did not become ACTIVE")

    # Save to gateway_config.json
    CONFIG["policy_engine_id"] = POLICY_ENGINE_ID
    with open("gateway_config.json", "w") as f:
        json.dump(CONFIG, f, indent=2)
    print("✓ Saved policy_engine_id to gateway_config.json")

    return POLICY_ENGINE_ID


# Ensure policy engine exists
POLICY_ENGINE_ID = ensure_policy_engine()
```

### Step 4.2: Attach Policy Engine to Gateway

The Policy Engine must be attached to the Gateway for policies to be enforced. This step checks if the Gateway already has a Policy Engine configured, and attaches it if not.

```python
# Note: gateway_control_client, get_gateway_details, and wait_for_gateway_ready
# are already defined in Step 1.3


def attach_policy_engine_to_gateway(mode: str = "ENFORCE") -> bool:
    """
    Attach the Policy Engine to the Gateway if not already attached.
    If a different policy engine is already attached, re-attach with the current one.

    Args:
        mode: Policy engine mode ('LOG_ONLY' or 'ENFORCE')

    Returns:
        True if successful or already attached, False otherwise
    """
    print("\nAttaching Policy Engine to Gateway")
    print("=" * 70)

    # Get current gateway configuration
    gateway_config = get_gateway_details()

    # Check if the correct policy engine is already attached
    existing_pe = gateway_config.get("policyEngineConfiguration", {})
    engine = get_policy_engine(POLICY_ENGINE_ID)
    if not engine:
        print("✗ Could not get policy engine details")
        return False

    policy_engine_arn = engine.get("policyEngineArn")

    if existing_pe.get("arn") == policy_engine_arn and existing_pe.get("mode") == mode:
        print(f"✓ Correct Policy Engine already attached: {existing_pe.get('arn')}")
        print(f"  Mode: {existing_pe.get('mode', 'N/A')}")
        return True

    if existing_pe.get("arn"):
        print(f"  Replacing attached policy engine: {existing_pe.get('arn')}")
    print(f"  Policy Engine ARN: {policy_engine_arn}")
    print(f"  Mode: {mode}")

    try:
        # Must preserve existing authorizer configuration when updating gateway
        auth_config = gateway_config.get("authorizerConfiguration", {})

        gateway_control_client.update_gateway(
            gatewayIdentifier=GATEWAY_ID,
            name=gateway_config.get("name"),
            roleArn=gateway_config.get("roleArn"),
            protocolType=gateway_config.get("protocolType", "MCP"),
            authorizerType=gateway_config.get("authorizerType", "CUSTOM_JWT"),
            authorizerConfiguration=auth_config,
            policyEngineConfiguration={"arn": policy_engine_arn, "mode": mode},
        )

        print("✓ Gateway update request accepted")
        print("\n⏳ Waiting for gateway to become READY...")

        if wait_for_gateway_ready():
            print("✓ Policy Engine attached successfully")
            return True
        else:
            print("✗ Gateway did not reach READY state")
            return False

    except ClientError as e:
        print(f"✗ Error updating gateway: {e}")
        return False


# Attach policy engine to gateway
attach_policy_engine_to_gateway(mode="ENFORCE")
```

---

## Part 5: Test Scenario 1 - Department-Based Access Control

In this scenario, we create a policy that only allows requests from users in the **finance** department.

### Cedar Policy Pattern

```cedar
permit(principal, action, resource)
when {
    principal.hasTag("department_name") &&
    principal.getTag("department_name") == "finance"
};
```

### Step 5.0: Clean Up Existing Policies (Optional)

Before creating new policies, it's recommended to delete any existing policies to ensure a clean test environment. This prevents conflicts between old and new policies.

```python
def cleanup_existing_policies(require_confirmation: bool = True) -> int:
    """
    Delete all existing policies in the policy engine.

    Args:
        require_confirmation: If True, asks user for confirmation before deleting

    Returns:
        Number of policies deleted
    """
    print("\n🧹 Checking for existing policies...")
    print("=" * 70)

    policies = list_policies()

    if not policies:
        print("✓ No existing policies found. Ready to proceed.")
        return 0

    print(f"\n⚠️  Found {len(policies)} existing policy/policies:")
    for p in policies:
        print(f"   - {p.get('name', 'unnamed')} (ID: {p.get('policyId')}, Status: {p.get('status')})")

    if require_confirmation:
        print("\n" + "-" * 70)
        confirm = input("Do you want to DELETE all existing policies? (yes/no): ").strip().lower()
        if confirm != "yes":
            print("\n⏭️  Skipping cleanup. Existing policies will remain.")
            print("   Note: This may cause unexpected policy evaluation results.")
            return 0

    print("\n🗑️  Deleting existing policies...")
    deleted_count = 0
    for p in policies:
        policy_id = p.get("policyId")
        if policy_id and delete_policy(policy_id):
            deleted_count += 1

    print(f"\n✓ Deleted {deleted_count}/{len(policies)} policies")
    return deleted_count


# Track created policies for cleanup at the end
CREATED_POLICIES = []

# Clean up existing policies before starting tests (no confirmation needed)
cleanup_existing_policies(require_confirmation=False)
```

### Step 5.1: Configure Lambda with Finance Department Claims

```python
print("=" * 70)
print("TEST SCENARIO 1: Department-Based Access Control")
print("=" * 70)

# Configure Lambda with department_name = "finance"
claims_finance = {
    "department_name": "finance",
    "employee_level": "senior",
    "cost_center": "CC-1001",
}

lambda_arn = create_lambda_function(claims_finance)
configure_cognito_trigger(lambda_arn)

# Wait for Lambda trigger to propagate before requesting a token
print("\n⏳ Waiting for Cognito trigger to propagate...")
time.sleep(15)

print("\n✓ Lambda configured with claims:")
print(json.dumps(claims_finance, indent=2))
```

### Step 5.2: Verify Token Contains Custom Claims

```python
print("\nVerifying Token Claims")
print("=" * 70)

token = get_bearer_token()
claims = decode_token(token)

print("\nToken Claims (relevant):")
print(f"  department_name: {claims.get('department_name', 'NOT PRESENT')}")
print(f"  employee_level: {claims.get('employee_level', 'NOT PRESENT')}")
print(f"  cost_center: {claims.get('cost_center', 'NOT PRESENT')}")
print(f"  client_id: {claims.get('client_id', 'NOT PRESENT')}")

if claims.get("department_name") == "finance":
    print("\n✓ Custom claims verified in token")
else:
    print("\n⚠️  Custom claims not found - Lambda trigger may not be configured correctly")
```

### Step 5.3: Create Cedar Policy for Department Validation

```python
policy_name = f"dept_policy_{int(time.time())}"

cedar_statement = f'''permit(principal,
    action == AgentCore::Action::"RefundToolTarget___refund",
    resource == AgentCore::Gateway::"{GATEWAY_ARN}")
when {{
    principal.hasTag("department_name") &&
    principal.getTag("department_name") == "finance"
}};'''

print(f"Cedar statement:\n{cedar_statement}")

policy_id = create_cedar_policy(
    policy_name=policy_name,
    cedar_statement=cedar_statement,
    description="Allow requests only from finance department",
)

if policy_id:
    CREATED_POLICIES.append(policy_id)

    # Wait for policy to become ACTIVE (required before testing)
    print("\n⏳ Waiting for policy to become ACTIVE...")
    if wait_for_policy_active(policy_id):
        print("✓ Policy is ACTIVE and ready for testing")
    else:
        print("\n⚠️  Policy did not become ACTIVE. Tests may fail.")
        print("   Check the policy status in the AWS Console.")
else:
    print("\n✗ Failed to create policy. Cannot proceed with tests.")
```

### Step 5.4: Test with Finance Department (Expected: ALLOWED)

```python
print("\n" + "=" * 70)
print("Test 1.1: Request with department_name='finance'")
print("=" * 70)

token = get_bearer_token()
result = make_gateway_request(
    bearer_token=token,
    tool_name="RefundToolTarget___refund",
    arguments={"amount": 500, "orderId": "test-dept-finance"},
)

print("\nRequest: RefundToolTarget___refund(amount=500)")
print("\nResponse:")
print(json.dumps(result, indent=2))

outcome = analyze_response(result)
display_test_result("ALLOWED", outcome, "Finance department should be ALLOWED")
```

### Step 5.5: Test with Engineering Department (Expected: DENIED)

```python
print("\n" + "=" * 70)
print("Test 1.2: Request with department_name='engineering'")
print("=" * 70)

# Update Lambda with different department
claims_engineering = {
    "department_name": "engineering",
    "employee_level": "senior",
    "cost_center": "CC-2001",
}

lambda_arn = create_lambda_function(claims_engineering)
print("\n✓ Lambda updated with department_name='engineering'")

# Wait for Lambda changes to propagate
print("\n⏳ Waiting for Lambda changes to propagate...")
time.sleep(5)

# Get new token and test
token = get_bearer_token()
claims = decode_token(token)
print(f"\nToken department_name: {claims.get('department_name')}")

result = make_gateway_request(
    bearer_token=token,
    tool_name="RefundToolTarget___refund",
    arguments={"amount": 500, "orderId": "test-dept-engineering"},
)

print("\nRequest: RefundToolTarget___refund(amount=500)")
print("\nResponse:")
print(json.dumps(result, indent=2))

outcome = analyze_response(result)
display_test_result("DENIED", outcome, "Engineering department should be DENIED")
```

---

## Part 6: Test Scenario 2 - Groups-Based Access Control

In this scenario, we create a policy that only allows requests from users who belong to the **admins** group.

### Cedar Policy Pattern

Since groups is serialized as a string in the token, we use the `like` operator for pattern matching:

```cedar
permit(principal, action, resource)
when {
    principal.hasTag("groups") &&
    principal.getTag("groups") like "*admins*"
};
```

```python
# Clean up previous policy
print("=" * 70)
print("TEST SCENARIO 2: Groups-Based Access Control")
print("=" * 70)

print("\nCleaning up previous policies...")
for pid in CREATED_POLICIES:
    delete_policy(pid)
CREATED_POLICIES.clear()
```

### Step 6.1: Configure Lambda with Groups Claim

```python
# Configure Lambda with groups containing "admins"
claims_with_admins = {
    "groups": ["admins", "developers", "team-alpha"],
    "department_name": "finance",
    "employee_level": "senior",
}

lambda_arn = create_lambda_function(claims_with_admins)
configure_cognito_trigger(lambda_arn)

print("\n✓ Lambda configured with groups:")
print(f"   groups: {claims_with_admins['groups']}")
```

### Step 6.2: Verify Token Contains Groups Claim

```python
print("\nVerifying Token Claims")
print("=" * 70)

token = get_bearer_token()
claims = decode_token(token)

print("\nToken Claims (relevant):")
print(f"  groups: {claims.get('groups', 'NOT PRESENT')}")
print(f"  department_name: {claims.get('department_name', 'NOT PRESENT')}")
```

### Step 6.3: Create Cedar Policy for Groups Validation

```python
policy_name = f"groups_policy_{int(time.time())}"

cedar_statement = f'''permit(principal,
    action == AgentCore::Action::"RefundToolTarget___refund",
    resource == AgentCore::Gateway::"{GATEWAY_ARN}")
when {{
    principal.hasTag("groups") &&
    principal.getTag("groups") like "*admins*"
}};'''

print(f"Cedar statement:\n{cedar_statement}")

policy_id = create_cedar_policy(
    policy_name=policy_name,
    cedar_statement=cedar_statement,
    description="Allow requests only from users in admins group",
)

if policy_id:
    CREATED_POLICIES.append(policy_id)

    # Wait for policy to become ACTIVE (required before testing)
    print("\n⏳ Waiting for policy to become ACTIVE...")
    if wait_for_policy_active(policy_id):
        print("✓ Policy is ACTIVE and ready for testing")
    else:
        print("\n⚠️  Policy did not become ACTIVE. Tests may fail.")
else:
    print("\n✗ Failed to create policy. Cannot proceed with tests.")
```

### Step 6.4: Test with Admins Group (Expected: ALLOWED)

```python
print("\n" + "=" * 70)
print("Test 2.1: Request with groups=['admins', 'developers', 'team-alpha']")
print("=" * 70)

token = get_bearer_token()
result = make_gateway_request(
    bearer_token=token,
    tool_name="RefundToolTarget___refund",
    arguments={"amount": 500, "orderId": "test-groups-admins"},
)

print("\nRequest: RefundToolTarget___refund(amount=500)")
print("\nResponse:")
print(json.dumps(result, indent=2))

outcome = analyze_response(result)
display_test_result("ALLOWED", outcome, "User with 'admins' group should be ALLOWED")
```

### Step 6.5: Test without Admins Group (Expected: DENIED)

```python
print("\n" + "=" * 70)
print("Test 2.2: Request with groups=['developers', 'team-alpha']")
print("=" * 70)

# Update Lambda without admins group
claims_no_admins = {
    "groups": ["developers", "team-alpha"],
    "department_name": "finance",
    "employee_level": "senior",
}

lambda_arn = create_lambda_function(claims_no_admins)
print("\n✓ Lambda updated with groups (no admins):")

# Wait for Lambda changes to propagate
print("\n⏳ Waiting for Lambda changes to propagate...")
time.sleep(5)
print(f"   groups: {claims_no_admins['groups']}")

# Get new token and test
token = get_bearer_token()
claims = decode_token(token)
print(f"\nToken groups: {claims.get('groups')}")

result = make_gateway_request(
    bearer_token=token,
    tool_name="RefundToolTarget___refund",
    arguments={"amount": 500, "orderId": "test-groups-no-admins"},
)

print("\nRequest: RefundToolTarget___refund(amount=500)")
print("\nResponse:")
print(json.dumps(result, indent=2))

outcome = analyze_response(result)
display_test_result("DENIED", outcome, "User without 'admins' group should be DENIED")
```

---

## Part 7: Test Scenario 3 - Principal ID-Based Access Control

In this scenario, we create a policy that only allows requests from a specific principal (identified by the `sub` claim in Client Credentials Flow).

### Cedar Policy Pattern

In Client Credentials Flow, the `sub` claim in the JWT token equals the `client_id`. Because all JWT claims are surfaced as **principal tags**, the caller's identity can be matched via `getTag("sub")`:

```cedar
permit(principal, action, resource)
when {
    principal.hasTag("sub") &&
    principal.getTag("sub") == "your-client-id"
};
```

**Note**: The `sub` claim in a Cognito M2M access token equals the app client's `client_id`. Checking `getTag("sub")` uniquely identifies the calling principal, equivalent to a principal-ID check.

```python
# Clean up previous policy
print("=" * 70)
print("TEST SCENARIO 3: Principal ID-Based Access Control")
print("=" * 70)

print("\nCleaning up previous policies...")
for pid in CREATED_POLICIES:
    delete_policy(pid)
CREATED_POLICIES.clear()
```

### Step 7.1: Create Cedar Policy for Client ID Validation

```python
policy_name = f"principal_id_policy_{int(time.time())}"

# In Client Credentials Flow, the 'sub' claim equals client_id and is accessible
# as a principal tag via getTag("sub")
cedar_statement = f'''permit(principal,
    action == AgentCore::Action::"RefundToolTarget___refund",
    resource == AgentCore::Gateway::"{GATEWAY_ARN}")
when {{
    principal.hasTag("sub") &&
    principal.getTag("sub") == "{CLIENT_ID}"
}};'''

print(f"Cedar statement:\n{cedar_statement}")

policy_id = create_cedar_policy(
    policy_name=policy_name,
    cedar_statement=cedar_statement,
    description=f"Allow requests only from principal with sub (client_id): {CLIENT_ID}",
)

if policy_id:
    CREATED_POLICIES.append(policy_id)

    # Wait for policy to become ACTIVE
    print("\n⏳ Waiting for policy to become ACTIVE...")
    if wait_for_policy_active(policy_id):
        print("✓ Policy is ACTIVE and ready for testing")
    else:
        print("\n⚠️  Policy did not become ACTIVE. Tests may fail.")
```

### Step 7.2: Test with Matching Principal ID (Expected: ALLOWED)

```python
print("\n" + "=" * 70)
print(f"Test 3.1: Request with sub (client_id)='{CLIENT_ID}'")
print("=" * 70)

token = get_bearer_token()
claims = decode_token(token)
# In Client Credentials Flow, 'sub' claim equals client_id and maps to principal tag "sub"
print(f"\nToken 'sub' claim (used as getTag('sub')): {claims.get('sub')}")
print(f"Token 'client_id' claim: {claims.get('client_id')}")

result = make_gateway_request(
    bearer_token=token,
    tool_name="RefundToolTarget___refund",
    arguments={"amount": 500, "orderId": "test-principal-id"},
)

print("\nRequest: RefundToolTarget___refund(amount=500)")
print("\nResponse:")
print(json.dumps(result, indent=2))

outcome = analyze_response(result)
display_test_result("ALLOWED", outcome, "Matching principal sub (client_id) should be ALLOWED")

print("\n💡 Note: To test DENY scenario, you would need a different")
print("   Amazon Cognito app client with a different client_id (sub)")
```

---

## Part 8: Advanced Patterns

### Combining Multiple Conditions

You can combine multiple conditions in a single policy for more complex access control scenarios.

```python
# Example: Combined policy (department AND amount limit)
print("\nAdvanced Pattern: Combined Conditions")
print("=" * 70)

combined_cedar = f'''permit(principal,
    action == AgentCore::Action::"RefundToolTarget___refund",
    resource == AgentCore::Gateway::"{GATEWAY_ARN}")
when {{
    principal.hasTag("department_name") &&
    principal.getTag("department_name") == "finance" &&
    context.input.amount <= 1000
}};'''

print("Cedar Policy with Combined Conditions:")
print("-" * 60)
print(combined_cedar)
print("-" * 60)
print("\nThis policy allows requests when:")
print("  ✓ User is in finance department")
print("  ✓ AND refund amount is <= $1000")
```

### Pattern Matching with `like` Operator

The `like` operator supports wildcards for flexible matching:

| Pattern | Matches |
|---------|--------|
| `"*admin*"` | Contains "admin" anywhere |
| `"admin*"` | Starts with "admin" |
| `"*admin"` | Ends with "admin" |
| `"team-*"` | Starts with "team-" |

```python
# Example: Pattern matching for team-based access
print("\nAdvanced Pattern: Team-Based Access with Wildcards")
print("=" * 70)

team_cedar = f'''permit(principal,
    action == AgentCore::Action::"RefundToolTarget___refund",
    resource == AgentCore::Gateway::"{GATEWAY_ARN}")
when {{
    principal.hasTag("groups") &&
    principal.getTag("groups") like "*team-finance*"
}};'''

print("Cedar Policy with Pattern Matching:")
print("-" * 60)
print(team_cedar)
print("-" * 60)
print("\nThis policy allows requests when:")
print("  ✓ User's groups contain 'team-finance'")
print("  ✓ Matches: ['team-finance', 'developers']")
print("  ✓ Matches: ['admins', 'team-finance-leads']")
```

---

## Part 9: Best Practices

### Policy Design Best Practices

1. **Use specific actions** - Target specific tool actions rather than wildcards
2. **Always check claim existence** - Use `hasTag()` before `getTag()` to avoid errors
3. **Use pattern matching carefully** - `like "*value*"` can match unintended strings
4. **Test both ALLOW and DENY** - Verify policies work in both directions
5. **Document policies** - Use descriptive names and descriptions

### Amazon Cognito Configuration Best Practices

1. **Use V3_0 trigger** - Required for M2M client credentials flow
2. **Upgrade to Essentials tier** - V3_0 requires Amazon Cognito Essentials or Plus
3. **Test token claims** - Always verify claims appear in tokens before creating policies
4. **Handle arrays carefully** - Arrays are serialized as strings in JWT claims

### Common Pitfalls to Avoid

- ❌ Using V1_0 or V2_0 trigger with M2M flow (claims won't be added)
- ❌ Forgetting to check `hasTag()` before `getTag()`
- ❌ Using exact match (`==`) when pattern match (`like`) is needed for arrays
- ❌ Not waiting for policy to become ACTIVE before testing
- ❌ Creating policies without proper cleanup strategy

### Required AWS IAM Permissions

#### For Policy Management

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "policy-registry:CreatePolicyEngine",
        "policy-registry:GetPolicyEngine",
        "policy-registry:ListPolicyEngines",
        "policy-registry:CreatePolicy",
        "policy-registry:DeletePolicy",
        "policy-registry:ListPolicies"
      ],
      "Resource": "*"
    }
  ]
}
```

#### For Amazon Cognito AWS Lambda Trigger

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cognito-idp:UpdateUserPool",
        "lambda:CreateFunction",
        "lambda:UpdateFunctionCode",
        "lambda:AddPermission",
        "iam:CreateRole",
        "iam:AttachRolePolicy",
        "iam:PassRole"
      ],
      "Resource": "*"
    }
  ]
}
```

---

## Part 10: Cleanup

Delete all policies created during this tutorial.

```python
print("=" * 70)
print("CLEANUP")
print("=" * 70)

print(f"\nDeleting {len(CREATED_POLICIES)} policies...")
for pid in CREATED_POLICIES:
    delete_policy(pid)

CREATED_POLICIES.clear()
print("\n✓ Cleanup complete")
```

### Optional: Delete All Policies

Use this to clean up all policies in the policy engine (use with caution).

```python
# Uncomment to delete ALL policies in the policy engine
# WARNING: This will delete all policies, not just those created in this tutorial

# print("Deleting ALL policies...")
# policies = list_policies()
# for policy in policies:
#     policy_id = policy.get('policyId')
#     if policy_id:
#         delete_policy(policy_id)
# print("✓ All policies deleted")
```

---

## Conclusion

Congratulations! You've completed the Policy for Amazon Bedrock AgentCore tutorial. You've learned how to:

✅ Configure Amazon Cognito AWS Lambda triggers to add custom claims to JWT tokens  
✅ Create Cedar policies that validate JWT claims via principal tags  
✅ Implement department-based access control  
✅ Implement groups-based access control with pattern matching  
✅ Implement principal ID-based access control  
✅ Combine multiple conditions for complex access control scenarios  

### Key Cedar Syntax Patterns

| Claim Type | Cedar Syntax |
|------------|-------------|
| String (exact) | `principal.getTag("claim") == "value"` |
| String (contains) | `principal.getTag("claim") like "*value*"` |
| Array (contains) | `principal.getTag("claim") like "*value*"` |
| Input validation | `context.input.field <= value` |

### Next Steps

1. **Implement in production** - Apply these patterns to your Amazon Bedrock AgentCore deployments
2. **Customize policies** - Tailor policies to your specific access control requirements
3. **Add monitoring** - Set up Amazon CloudWatch alarms for policy denials
4. **Iterate and improve** - Refine policies based on real-world usage

---

**Author**: AWS  
**License**: MIT-0  
**Last Updated**: 2025
