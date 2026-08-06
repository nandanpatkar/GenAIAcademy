# Amazon Bedrock AgentCore Policy - NL2Cedar Demo

## Overview

Welcome to the Amazon Bedrock AgentCore Policy hands-on demo! This notebook will guide you through the complete workflow of generating Cedar policies from natural language. This notebook will demonstrate the various types of policies that can be generated and demonstrate how to understand various policy constuctions.

### What is Natural Language Authoring in Amazon Bedrock AgentCore Policy?

NL2Cedar - Natural Language Authoring of Cedar Policies helps you write authorization requirements in natural language which are automatically convert to Cedar syntax as well as verified that the generated policies match your requirements. 

---

## Prerequisites

Before starting, ensure you have:

- ✅ AWS CLI configured with appropriate credentials
- ✅ Python 3.10+ with boto3 installed
- ✅ `bedrock_agentcore_starter_toolkit` package installed
- ✅ Access to AWS Lambda (for target functions)

01-Getting-Started/AgentCore-Policy-Demo.ipynb sets up a Gateway for Insurance Underwriting Use case, woth 3 Lambda targets. We will use the same gateway setup. 

Let's get started! 🚀

---

# Step 0: Environment Setup

First, let's verify our environment and import necessary libraries.

```python
%pip install -r requirements.txt
```

```python
# Import required libraries
import sys
import os
from pathlib import Path
import subprocess
import boto3
import json
import logging
import time

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

### Check if Gateway Setup from 08-AgentCore-policy/01-Getting-Started/AgentCore-Policy-Demo.ipynb exists. If not, the next step will setup a gateway for insurance underwriting with 3 Lambda targets

```python
# Check if Gateway for Insurance Underwriting exists

# Get the path to the Getting-Started directory
current_dir = Path.cwd()
getting_started_dir = current_dir.parent / "01-Getting-Started"
config_file = getting_started_dir / "config.json"
scripts_dir = getting_started_dir / "scripts"

print("🔍 Checking for configuration...")
print(f"Looking for: {config_file.relative_to(current_dir.parent.parent)}")

if config_file.exists():
    print("✅ Configuration file found!")

    # Optionally, verify it has the required fields
    import json

    try:
        with open(config_file, "r") as f:
            config = json.load(f)

        required_fields = ["lambdas", "gateway", "region"]
        missing_fields = [field for field in required_fields if field not in config]

        if missing_fields:
            print(f"⚠️  Warning: Config file is missing fields: {missing_fields}")
            print("   You may need to re-run the setup scripts.")
        else:
            print("✅ Configuration is complete!")

    except json.JSONDecodeError:
        print("⚠️  Warning: Config file exists but is not valid JSON")

else:
    print("❌ Configuration file not found!")
    print("\n" + "=" * 70)
    print("Setting up infrastructure...")
    print("=" * 70)

    # Change to the Getting-Started directory to run scripts
    os.chdir(getting_started_dir)

    try:
        # Step 1: Deploy Lambda functions
        print("\n📦 Step 1: Deploying Lambda functions...")
        print("-" * 70)
        deploy_lambda_script = scripts_dir / "lambda-target-setup" / "deploy_lambdas.py"
        result = subprocess.run([sys.executable, str(deploy_lambda_script)], capture_output=True, text=True)
        print(result.stdout)

        # Step 2: Setup Gateway
        print("\n🌐 Step 2: Setting up AgentCore Gateway...")
        print("-" * 70)
        setup_gateway_script = scripts_dir / "setup_gateway.py"
        result = subprocess.run([sys.executable, str(setup_gateway_script)], capture_output=True, text=True)
        print(result.stdout)

        print("\n" + "=" * 70)
        print("✅ Infrastructure setup complete!")
        print("=" * 70)

        # Verify config was created
        if config_file.exists():
            print(f"✅ Configuration file created: {config_file}")
        else:
            print("⚠️  Warning: Setup completed but config.json was not created")

    except Exception as e:
        print(f"\n❌ Setup failed: {e}")
        print("\nPlease run the setup scripts manually:")
        print(f"1. cd {getting_started_dir}")
        print("2. python scripts/lambda-target-setup/deploy_lambdas.py")
        print("3. python scripts/setup_gateway.py")
    finally:
        # Change back to original directory
        os.chdir(current_dir)

print("\n" + "=" * 70)
```

---

# Step 1: Create a Policy Engine

Now we'll create a Policy Engine to hold our Cedar policies

A Policy Engine is a collection of policies. It can be associated with a gateway for real-time enforcement of policies on the inbound traffic.
We will be creating policies in this policy engine in the upcoming steps

### Create Policy Engine

First, we'll create a Policy Engine to hold our Cedar policies:

```python
from bedrock_agentcore_starter_toolkit.operations.policy.client import PolicyClient

policy_client = PolicyClient(region_name=region)
policy_client.logger.setLevel(logging.INFO)

# Create a Policy Engine
print("🔧 Creating Policy Engine...")
engine = policy_client.create_or_get_policy_engine(
    name="InsurancePolicyEngine_NL2Cedar",
    description="Policy engine for insurance underwriting governance",
)
print(f"✓ Policy Engine: {engine['policyEngineId']}\n")

# Save Policy Engine in the configuration file
with open(config_file, "r") as f:
    config = json.load(f)

# Add policy engine information (without removing existing data)
config["policy_engine_id"] = engine["policyEngineId"]
config["policy_engine_arn"] = engine["policyEngineArn"]

# Write back the updated config
with open(config_file, "w") as f:
    json.dump(config, f, indent=2)
```

## Step 2: Generate policy from natural language

Now we will generate a Cedar policy from natural language using NL2Cedar capability. The policy creation using NL2Cedar involves two steps: first, the generation of a Cedar policy from natural language, and then creation of the policy in the Policy engine. 

> **💡 Tip**: The schema of the targets on the Gateway are provided to the NL2Cedar capability to help the foundation model understand the names of the targets and the parameters.

The Gateway has 3 Lambda targets:
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


 Our natural language statements can refer to any of these targets and introduce constraints on agent-tool access based on these parameters.

### Cedar Policy Validation Findings

When NL2Cedar generates a Cedar policy, it runs the generated Cedar through a multi-step validation process before returning it. This may produce **findings** that describe issues with the policy:

| Finding Type | Meaning |
|---|---|
| `INVALID` | Cedar syntax or schema error — may block policy creation under strict mode |
| `WARNING` | Non-blocking issue — policy is syntactically valid but may behave unexpectedly |

Findings can cause the `generatedPolicies` list to be empty if the service withholds assets with critical issues. Even when assets are present, calling `create_policy` may raise a validation error if findings exist.

To override this and create the policy regardless of findings, pass `validation_mode="IGNORE_ALL_FINDINGS"` to `create_policy` or `create_or_get_policy`. This notebook uses it **only as a fallback** — attempted after the default creation fails.

> 📖 See [Policy Generation Validation Findings](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-generation-validation.html#policy-generation-findings) for details on each finding type and remediation guidance.

```python
# Create Cedar policy
print("\n\U0001f4dd Generating Cedar Policy from Natural language...")
print("\n\U0001f4dd Simple natural language statement")

nl_input = "Allow all users to invoke the application tool when the coverage amount is under 1000000 and the applicant region is US or CA"

result = policy_client.generate_policy(
    policy_engine_id=config["policy_engine_id"],
    name=f"nl_policy_{int(time.time())}",
    resource={"arn": config["gateway"]["gateway_arn"]},
    content={"rawText": nl_input},
    fetch_assets=True,
)
```

```python
cedar_statement = None
if result.get("status") == "GENERATED" and result.get("generatedPolicies"):
    generated_policy = result["generatedPolicies"][0]
    findings = generated_policy.get("findings", [])
    invalid = [f for f in findings if f.get("type") == "INVALID"]
    warnings = [f for f in findings if f.get("type") == "WARNING"]
    if invalid:
        print(
            "⚠️  Policy generation returned INVALID findings (policy creation will be retried with IGNORE_ALL_FINDINGS):"
        )
        for f in invalid:
            print(f"   • {f.get('description', 'Unknown')}")
    if warnings:
        print(
            "⚠️  Policy generation returned WARNING findings (policy creation may be retried with IGNORE_ALL_FINDINGS):"
        )
        for f in warnings:
            print(f"   • {f.get('description', 'Unknown')}")
    cedar_statement = generated_policy.get("definition", {}).get("cedar", {}).get("statement")
    if cedar_statement:
        print("Generated Cedar Policy:")
        print("=" * 60)
        print(cedar_statement)
        print("=" * 60)
    else:
        print("⚠️  No Cedar statement in generated policy")
        print("Raw asset:", generated_policy)
elif not result.get("generatedPolicies"):
    print(
        "⚠️  generatedPolicies list is empty — NL2Cedar produced no assets (possibly due to findings blocking generation)"
    )
```

## Step 2: Create a policy from the generated Cedar policy

```python
if cedar_statement:
    try:
        application_creation_policy = policy_client.create_or_get_policy(
            policy_engine_id=config["policy_engine_id"],
            name="application_creation_policy",
            description="Allow application creation when coverage is under $1M and region is US or CA",
            definition={"cedar": {"statement": cedar_statement}},
        )
        print(f"✓ Policy ready: {application_creation_policy['policyId']}")
    except Exception as e:
        # Creation failed (e.g. validation findings blocked it) — retry with IGNORE_ALL_FINDINGS
        print(f"⚠️  Policy creation failed: {e}")
        print("   Retrying with validation_mode='IGNORE_ALL_FINDINGS'...")
        application_creation_policy = policy_client.create_or_get_policy(
            policy_engine_id=config["policy_engine_id"],
            name="application_creation_policy",
            description="Allow application creation when coverage is under $1M and region is US or CA",
            definition={"cedar": {"statement": cedar_statement}},
            validation_mode="IGNORE_ALL_FINDINGS",
        )
        print(f"✓ Policy ready with IGNORE_ALL_FINDINGS: {application_creation_policy['policyId']}")
else:
    print("⚠️  Skipping policy creation: no Cedar statement was generated")
```

---

# Other types of policy generations from natural language

### 1. Multi-line statements
When multi-line statements are provided, multiple policies will be generated and present in the result['generatedPolicies']. The consistently appearing delimited (be it comma, full stop, semi-colon, etc) will be picked up to distinguish between individual policy statements

```python
print("\n📝 Multi-line statement")

nl_input = """Allow all users to invoke the risk model tool when data governance approval is true. 
Block users from calling the application tool unless coverage amount is present"""

result = policy_client.generate_policy(
    policy_engine_id=config["policy_engine_id"],
    name=f"nl_policy_{int(time.time())}",
    resource={"arn": config["gateway"]["gateway_arn"]},
    content={"rawText": nl_input},
    fetch_assets=True,
)

if result.get("status") == "GENERATED" and result.get("generatedPolicies"):
    for generated_policy in result["generatedPolicies"]:
        cedar_statement = generated_policy.get("definition", {}).get("cedar", {}).get("statement", "N/A")

        print("Generated Cedar Policy:")
        print("=" * 60)
        print(cedar_statement)
        print("=" * 60)
```

### 2. Principal Related Policy Statements
It is possible to create policies that assert conditions based on the principal scope, which is relayed through the idP representation in the form of the OAuth access token. As you can configure what attributes are stored in the OAuth token which can be custom, for NL2Cedar generation, providing the exact tag would help NL2Cedar create the correct Cedar policy

```python
print("\n📝 Principal Scope statements")

nl_inputs = [
    'Allow principals with username "test-user" to invoke the risk model tool',
    str(
        'Forbid principals to access the approval tool unless they have the scope group:Controller <idp_claims>["scope"]</idp_claims>'
    ),
    str(
        'Block principals from using risk model tool and approval tool unless the principal has role "senior-adjuster"'
    ),
]

for nl_input in nl_inputs:
    result = policy_client.generate_policy(
        policy_engine_id=config["policy_engine_id"],
        name=f"nl_policy_{int(time.time())}",
        resource={"arn": config["gateway"]["gateway_arn"]},
        content={"rawText": nl_input},
        fetch_assets=True,
    )

    if result.get("status") == "GENERATED" and result.get("generatedPolicies"):
        for generated_policy in result["generatedPolicies"]:
            cedar_statement = generated_policy.get("definition", {}).get("cedar", {}).get("statement", "N/A")
            print("=" * 60)
            print(f"Natural Language: {nl_input}")
            print("Generated Cedar Policy:")
            print("=" * 60)
            print(cedar_statement)
            print("=" * 60)
```

# CleanUp

```python
from bedrock_agentcore_starter_toolkit.operations.gateway.client import GatewayClient
from bedrock_agentcore_starter_toolkit.operations.policy.client import PolicyClient

with open(config_file, "r") as f:
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
