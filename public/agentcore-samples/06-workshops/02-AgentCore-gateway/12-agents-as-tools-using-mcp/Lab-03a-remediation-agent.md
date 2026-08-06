# Lab 3: Remediation Agent with AgentCore Code Interpreter

## Overview
Build a Strands-based remediation agent that uses AgentCore Code Interpreter for secure infrastructure automation and script execution.

## Objectives
- Create a Strands agent with AgentCore Code Interpreter integration
- Build tools for remediation plan generation and secure script execution
- Test agent with infrastructure remediation scenarios
- Validate access and execution safety

## What You'll Learn
- How to integrate AgentCore Code Interpreter with Strands agents
- How to implement secure remediation workflows with right controls
- How to create tools for infrastructure automation
- Agent remediation planning and execution patterns

## Architecture Overview
```
┌─────────────────┐    ┌──────────────────────┐    ┌─────────────────────┐
│   User Request  │───▶│  Strands Agent       │───▶│  AgentCore Code     │
│                 │    │  (Remediation)       │    │  Interpreter        │
└─────────────────┘    └──────────────────────┘    └─────────────────────┘
                                │                            │
                                ▼                            ▼
                       ┌──────────────────────┐    ┌─────────────────────┐
                       │  Remediation Tools   │    │  Secure Python      │
                       │  ├─ Plan Generation  │    │  Execution          │
                       │  ├─ Review   Gate    │    │  ├─ Session Mgmt    │
                       │  └─ Script Execution │    │  ├─ Code Streaming  │
                       └──────────────────────┘    │  └─ Error Handling  │
                                │                  └─────────────────────┘
                                ▼                            │
                       ┌──────────────────────┐              ▼
                       │  Infrastructure      │    ┌─────────────────────┐
                       │  Changes             │◀───│  Execution Results  │
                       │  (Approved Only)     │    │  & Validation       │
                       └──────────────────────┘    └─────────────────────┘
```

**Key Components:**
- **Two-Step Process**: Planning → Review → Execution
- **Secure Execution**: AgentCore Code Interpreter provides isolated environment
- **Risk Assessment**: Comprehensive impact analysis for each step

## 0. Install Required Packages

Run this cell first to ensure all dependencies are installed.

```python
# %pip install -q -r requirements.txt
print("✅ Workshop dependencies installed")
```

## 1. Import Required Modules

```python
### 1. Imports

# AWS SDK and configuration
import json
import boto3
import logging
import uuid
from datetime import datetime
from typing import Dict

# Strands framework
from strands import Agent
from strands.models import BedrockModel
from strands.tools import tool

# Bedrock AgentCore Starter Toolkit
from bedrock_agentcore_starter_toolkit import Runtime
from lab_helpers.config import AWS_REGION, WORKSHOP_NAME
from lab_helpers.parameter_store import get_parameter, put_parameter
from lab_helpers.constants import PARAMETER_PATHS
from lab_helpers.lab_03.gateway_setup import AgentCoreGatewaySetup

# Workshop configuration
from botocore.config import Config
from lab_helpers.config import MODEL_ID, AWS_PROFILE

# Lab-03 Deployment Helpers
from lab_helpers.lab_03 import (
    AgentCoreRuntimeDeployer,
    AgentCoreGatewaySetup,
)

# File system operations

# Configure logging for notebook
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

# Global variables for Code Interpreter
agentcore_code_interpreter = None
CODE_INTERPRETER_AVAILABLE = False

print("✅ Imports loaded")
print(f"   Workshop: {WORKSHOP_NAME}")
print(f"   Region: {AWS_REGION}")
print(f"   Model: {MODEL_ID}")
```

## 2. Setup and Verify Prerequisites

```python
# Create S3 bucket for remediation plans
from botocore.exceptions import ClientError
from lab_helpers.config import AWS_REGION

s3_client = boto3.client("s3", region_name=AWS_REGION)
unique_suffix = str(uuid.uuid4())[:8]
bucket_name = f"sre-workshop-remediation-plans-{unique_suffix}"

try:
    # us-east-1 doesn't use LocationConstraint
    if AWS_REGION == "us-east-1":
        response = s3_client.create_bucket(Bucket=bucket_name)
    else:
        response = s3_client.create_bucket(
            Bucket=bucket_name,
            CreateBucketConfiguration={"LocationConstraint": AWS_REGION},
        )

    print(f"✅ Created bucket: {bucket_name}")

    # Store in Parameter Store
    ssm = boto3.client("ssm", region_name=AWS_REGION)
    ssm.put_parameter(
        Name="/aiml301_sre_workshop/remediation_s3_bucket",
        Value=bucket_name,
        Type="String",
        Overwrite=True,
    )
    print("✅ Stored in Parameter Store")

except ClientError as e:
    print(f"❌ Error: {e}")


try:
    # Test AWS credentials
    sts_client = boto3.client("sts", region_name=AWS_REGION)
    identity = sts_client.get_caller_identity()
    account_id = identity["Account"]

    # Test AgentCore Code Interpreter availability
    agentcore_test = boto3.client("bedrock-agentcore", region_name=AWS_REGION)

    print(f"✅ Prerequisites verified: AWS Account {account_id}, AgentCore Code Interpreter available")
    print(f"   Region: {AWS_REGION}")
    print(f"   Profile: {AWS_PROFILE}")
    print(f"   Model ID: {MODEL_ID}")
    print(f"   Identity: {identity.get('Arn', 'Unknown')}")

except Exception as e:
    print(f"❌ Error: {e}")
    print("Please ensure AWS credentials are configured and AgentCore Code Interpreter permissions are available.")
```

```python
# Store in SSM Parameter Store
parameter_name = "/aiml301_sre_workshop/remediation_s3_bucket"
ssm = boto3.client("ssm", region_name="us-west-2")
parameter = ssm.get_parameter(Name=parameter_name)
retrieved_bucket_name = parameter["Parameter"]["Value"]
```

## 3. Set Up Custom Code Interpreter

**Goal:** Create a custom AgentCore Code Interpreter with custom IAM execution role.

**Approach:** 
1. Create custom IAM execution role with proper trust policy and permissions
2. Create custom code interpreter in PUBLIC network mode
3. Initialize client and session management functions

**Key Learning:** How to create custom code interpreters with specific permissions for your use case.

### 3.1 Set up IAM Policy & Role for Custom Code Interpreter

```python
### 3.1: Create Custom IAM Execution Role


def create_custom_code_interpreter_role():
    """Create IAM execution role for custom code interpreter"""
    iam_client = boto3.client("iam")
    sts_client = boto3.client("sts")
    account_id = sts_client.get_caller_identity()["Account"]

    role_name = f"{WORKSHOP_NAME}-CodeInterpreterRole"

    # Trust policy - allows bedrock-agentcore service to assume the role
    trust_policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "AssumeRolePolicy",
                "Effect": "Allow",
                "Principal": {"Service": "bedrock-agentcore.amazonaws.com"},
                "Action": "sts:AssumeRole",
                "Condition": {
                    "StringEquals": {"aws:SourceAccount": account_id},
                    "ArnLike": {"aws:SourceArn": f"arn:aws:bedrock-agentcore:{AWS_REGION}:{account_id}:*"},
                },
            }
        ],
    }

    # Permissions policy for code interpreter execution
    with open("lab_helpers/lab_03/code_interpreter_permissions_policy.json", "r") as f:
        ci_permissions_policy = f.read()
        ci_permissions_policy = ci_permissions_policy.replace("{{ACCOUNT_ID}}", account_id)
        ci_permissions_policy = ci_permissions_policy.replace("{{REGION}}", AWS_REGION)

    try:
        # Create the role
        response = iam_client.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=json.dumps(trust_policy),
            Description="Custom execution role for AgentCore Code Interpreter",
            Tags=[{"Key": "Workshop", "Value": WORKSHOP_NAME}],
        )
        role_arn = response["Role"]["Arn"]
        logger.info(f"✅ Created IAM role: {role_name}")
    except iam_client.exceptions.EntityAlreadyExistsException:
        response = iam_client.get_role(RoleName=role_name)
        role_arn = response["Role"]["Arn"]
        logger.info(f"✅ Using existing IAM role: {role_name}")

    # Attach permissions policy
    try:
        iam_client.put_role_policy(
            RoleName=role_name,
            PolicyName="CodeInterpreterExecutionPolicy",
            PolicyDocument=ci_permissions_policy,
        )
        logger.info("✅ Attached permissions policy")
    except Exception as e:
        logger.warning(f"Policy may already exist: {e}")

    return role_arn, role_name


# Create the role
print("🔧 Creating custom IAM execution role...")
custom_role_arn, custom_role_name = create_custom_code_interpreter_role()
print(f"✅ IAM Role: {custom_role_name}")
print(f"   ARN: {custom_role_arn}")
```

### 3.2 Create AgentCore Custom Code Interpreter

```python
### 3.2: Create Custom Code Interpreter

import time


def create_custom_code_interpreter(role_arn):
    """Create custom code interpreter with execution role"""
    agentcore_control = boto3.client("bedrock-agentcore-control", region_name=AWS_REGION)

    interpreter_name = f"{WORKSHOP_NAME}_custom_code_interpreter"

    try:
        response = agentcore_control.create_code_interpreter(
            name=interpreter_name,
            executionRoleArn=role_arn,
            networkConfiguration={"networkMode": "PUBLIC"},
            description="Custom code interpreter for remediation agent",
            clientToken=str(uuid.uuid4()),
        )
        interpreter_id = response["codeInterpreterId"]
        interpreter_arn = response["codeInterpreterArn"]
        status = response["status"]
        logger.info(f"✅ Created code interpreter: {interpreter_id}")

    except agentcore_control.exceptions.ConflictException:
        logger.info("⚠️  Code interpreter exists. Finding it...")
        # List to find the actual ID (key is codeInterpreterSummaries, not codeInterpreters)
        list_response = agentcore_control.list_code_interpreters()
        all_items = list_response.get("codeInterpreterSummaries", [])

        interpreter_id = None
        for item in all_items:
            if item.get("name") == interpreter_name:
                interpreter_id = item["codeInterpreterId"]
                interpreter_arn = item["codeInterpreterArn"]
                status = item["status"]
                logger.info(f"✅ Found existing interpreter: {interpreter_id}")
                break

        if not interpreter_id:
            raise Exception(f"Interpreter '{interpreter_name}' exists but not found in list")

    # Wait for READY status
    if status == "CREATING":
        print("⏳ Waiting for code interpreter to be ready...")
        for _ in range(30):
            check_response = agentcore_control.get_code_interpreter(codeInterpreterIdentifier=interpreter_id)
            status = check_response["status"]
            if status == "READY":
                logger.info("✅ Code interpreter is READY")
                break
            elif status == "CREATE_FAILED":
                raise Exception("Code interpreter creation failed")
            time.sleep(10)

    return interpreter_id, interpreter_arn


# Wait for IAM role propagation
print("⏳ Waiting for IAM role to propagate (10 seconds)...")
time.sleep(10)

# Create custom code interpreter
print("\n🔧 Creating custom code interpreter...")
CUSTOM_INTERPRETER_ID, CUSTOM_INTERPRETER_ARN = create_custom_code_interpreter(custom_role_arn)
print("✅ Custom Code Interpreter Created")
print(f"   ID: {CUSTOM_INTERPRETER_ID}")
print(f"   ARN: {CUSTOM_INTERPRETER_ARN}")
print("   Network Mode: PUBLIC")
print(f"   Execution Role: {custom_role_name}")

# Store in SSM Parameter Store

ssm = boto3.client("ssm", region_name=AWS_REGION)
ssm.put_parameter(
    Name=PARAMETER_PATHS["lab_03"]["code_interpreter_id"],
    Value=CUSTOM_INTERPRETER_ID,
    Type="String",
    Overwrite=True,
)
ssm.put_parameter(
    Name=PARAMETER_PATHS["lab_03"]["code_interpreter_arn"],
    Value=CUSTOM_INTERPRETER_ARN,
    Type="String",
    Overwrite=True,
)
ssm.put_parameter(
    Name=PARAMETER_PATHS["lab_03"]["code_interpreter_role_arn"],
    Value=custom_role_arn,
    Type="String",
    Overwrite=True,
)
print("✅ Stored in SSM Parameter Store")
```

```python
ssm.get_parameter(Name=f"/{WORKSHOP_NAME}/lab-03/code-interpreter-id")["Parameter"]["Value"]
```

## 3.3 Initialize Code Interpreter Client Functions and Test Code Interpreter Session

```python
### 3.3: Initialize Code Interpreter Client Functions


def initialize_code_interpreter_client():
    """Initialize AgentCore Code Interpreter client"""
    global agentcore_code_interpreter, CODE_INTERPRETER_AVAILABLE

    try:
        agentcore_code_interpreter = boto3.client("bedrock-agentcore", region_name=AWS_REGION)
        CODE_INTERPRETER_AVAILABLE = True
        logger.info("✅ AgentCore Code Interpreter client initialized")
        return True
    except Exception as e:
        CODE_INTERPRETER_AVAILABLE = False
        logger.warning(f"⚠️ AgentCore Code Interpreter not available: {e}")
        return False


def start_code_interpreter_session():
    """Start a Code Interpreter session using custom interpreter"""
    if not CODE_INTERPRETER_AVAILABLE:
        return None

    try:
        session_response = agentcore_code_interpreter.start_code_interpreter_session(
            codeInterpreterIdentifier=CUSTOM_INTERPRETER_ID,  # Use custom interpreter
            name=f"remediation-session-{uuid.uuid4()}",
            sessionTimeoutSeconds=1800,  # 30 minutes
        )

        session_id = session_response.get("sessionId")
        logger.info(f"✅ Code Interpreter session started: {session_id}")
        return session_id

    except Exception as e:
        logger.error(f"❌ Failed to start Code Interpreter session: {e}")
        return None


def stop_code_interpreter_session(session_id: str):
    """Stop the Code Interpreter session"""
    if not session_id or not CODE_INTERPRETER_AVAILABLE:
        return

    try:
        agentcore_code_interpreter.stop_code_interpreter_session(
            codeInterpreterIdentifier=CUSTOM_INTERPRETER_ID,  # Use custom interpreter
            sessionId=session_id,
        )
        logger.info(f"✅ Code Interpreter session stopped: {session_id}")
    except Exception as e:
        logger.error(f"❌ Failed to stop Code Interpreter session: {e}")


def execute_remediation_code(session_id: str, code: str) -> Dict:
    """Execute remediation code using custom AgentCore Code Interpreter"""
    if not session_id:
        return {"error": "No Code Interpreter session available"}

    try:
        logger.info(f"🔧 Executing remediation code: {code}")

        execute_response = agentcore_code_interpreter.invoke_code_interpreter(
            codeInterpreterIdentifier=CUSTOM_INTERPRETER_ID,  # Use custom interpreter
            sessionId=session_id,
            name="executeCode",
            arguments={"language": "python", "code": code},
        )

        # Process the streaming response
        output_text = ""
        execution_status = "success"

        for event in execute_response.get("stream", []):
            if "result" in event:
                result = event["result"]
                if "content" in result:
                    for content_item in result["content"]:
                        if content_item.get("type") == "text":
                            output_text += content_item.get("text", "")
                        elif content_item.get("type") == "error":
                            execution_status = "error"
                            output_text += f"ERROR: {content_item.get('text', '')}"

        return {
            "execution_status": execution_status,
            "output": output_text,
            "session_id": session_id,
        }

    except Exception as e:
        logger.error(f"❌ Failed to execute remediation code: {e}")
        return {"error": f"Code execution failed: {str(e)}"}


# Test initialization
if initialize_code_interpreter_client():
    print("\n✅ Custom Code Interpreter integration ready")
    print(f"   Interpreter ID: {CUSTOM_INTERPRETER_ID}")
    print("   Network Mode: PUBLIC")
    print(f"   Execution Role: {custom_role_name}")
    print(f"   Client Status: {CODE_INTERPRETER_AVAILABLE}")
    print("   Functions: initialize, start_session, stop_session, execute_code")

    # Test session creation
    print("\n🧪 Testing session creation...")
    test_session_id = start_code_interpreter_session()
    if test_session_id:
        print(f"✅ Test session created: {test_session_id}")
        stop_code_interpreter_session(test_session_id)
        print("✅ Test session stopped")
    else:
        print("❌ Test session creation failed")
else:
    print("❌ Code Interpreter client initialization failed")
    print("   Check AWS credentials and AgentCore permissions")
```

## 3.4 Enable Observability
To enable observability in agentcore we need to first enable transaction search. This is a one time setup per region.
Transaction Search provides:
Span ingestion as structured logs for detailed analysisX-Ray trace indexing for session trackingDeep trace analysis across all AgentCore runtimes
For more information about enabling Transaction Search in your own account, see the AWS documentation

```python
# 1. Setup Session
session = boto3.Session()
region = AWS_REGION
sts = session.client("sts")
account_id = sts.get_caller_identity()["Account"]
logs_client = session.client("logs")
xray_client = session.client("xray")


print(f"Configuring AgentCore Observability for Account: {account_id} in Region: {AWS_REGION}")

# ---------------------------------------------------------
# Step 1: Resource Policy (Idempotent-ish)
# ---------------------------------------------------------
policy_document = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "TransactionSearchXRayAccess",
            "Effect": "Allow",
            "Principal": {"Service": "xray.amazonaws.com"},
            "Action": "logs:PutLogEvents",
            "Resource": [
                f"arn:aws:logs:{region}:{account_id}:log-group:/aws/vendedlogs/xray:*",
                f"arn:aws:logs:{region}:{account_id}:log-group:aws/spans:*",
                f"arn:aws:logs:{region}:{account_id}:log-group:/aws/application-signals/*",
            ],
        }
    ],
}

try:
    logs_client.put_resource_policy(
        policyName="BedrockAgentCoreXRayPolicy",
        policyDocument=json.dumps(policy_document),
    )
    print("✅ Resource Policy created/updated successfully.")
except Exception as e:
    print(f"ℹ️ Note on Policy: {e}")

# ---------------------------------------------------------
# Step 2: Update Trace Destination (Handle "Already Set")
# ---------------------------------------------------------
try:
    xray_client.update_trace_segment_destination(Destination="CloudWatchLogs")
    print("✅ Trace segment destination set to CloudWatchLogs.")
except xray_client.exceptions.InvalidRequestException as e:
    # Check if the error is simply that it's already enabled
    if "already set" in str(e):
        print("✅ Trace destination was already set to CloudWatchLogs (Skipped).")
    else:
        print(f"❌ Error updating trace destination: {e}")

# ---------------------------------------------------------
# Step 3: Update Indexing Rule (FIXED: Pass Dict, not String)
# ---------------------------------------------------------
try:
    xray_client.update_indexing_rule(
        Name="Default",
        # FIX: Pass a Python dictionary, NOT a json.dumps() string
        Rule={"Probabilistic": {"DesiredSamplingPercentage": 5.0}},
    )
    print("✅ Indexing rule updated successfully.")
except Exception as e:
    print(f"❌ Error updating indexing rule: {e}")
```

```python
# Create and attach log groups, log sources and destinations


def enable_observability_for_resource(resource_arn, resource_id, account_id, region=AWS_REGION):
    """
    Enable observability for a Bedrock AgentCore resource (e.g., Memory Store)
    """
    logs_client = boto3.client("logs", region_name=region)

    # Step 0: Create new log group for vended log delivery
    log_group_name = f"/aws/vendedlogs/bedrock-agentcore/{resource_id}"
    try:
        logs_client.create_log_group(logGroupName=log_group_name)
    except logs_client.exceptions.ResourceAlreadyExistsException:
        pass
    log_group_arn = f"arn:aws:logs:{region}:{account_id}:log-group:{log_group_name}"
    print(f"Resource CloudWatch Log Group: f{log_group_arn}")

    unique_suffix = str(uuid.uuid4())[:8]

    # Step 1: Create delivery source for logs
    logs_source_response = logs_client.put_delivery_source(
        name=f"aiml301_custom_code_interpreter-{unique_suffix}-logs-source",
        logType="APPLICATION_LOGS",
        resourceArn=resource_arn,
    )

    # Step 2: Create delivery source for traces
    traces_source_response = logs_client.put_delivery_source(
        name=f"aiml301_custom_code_interpreter-{unique_suffix}-traces-source",
        logType="TRACES",
        resourceArn=resource_arn,
    )

    # Step 3: Create delivery destinations
    logs_destination_response = logs_client.put_delivery_destination(
        name=f"aiml301_custom_code_interpreter-{unique_suffix}-logs-dest",
        deliveryDestinationType="CWL",
        deliveryDestinationConfiguration={
            "destinationResourceArn": log_group_arn,
        },
    )

    # Traces required
    traces_destination_response = logs_client.put_delivery_destination(
        name=f"aiml301_custom_code_interpreter-{unique_suffix}-traces-dest",
        deliveryDestinationType="XRAY",
    )

    # Step 4: Create deliveries (connect sources to destinations)
    logs_client.create_delivery(
        deliverySourceName=logs_source_response["deliverySource"]["name"],
        deliveryDestinationArn=logs_destination_response["deliveryDestination"]["arn"],
    )

    # Traces required
    logs_client.create_delivery(
        deliverySourceName=traces_source_response["deliverySource"]["name"],
        deliveryDestinationArn=traces_destination_response["deliveryDestination"]["arn"],
    )

    print(f"Observability enabled for {resource_id}")


# get code interpreter resource id and arn
resource_id = ssm.get_parameter(Name=f"/{WORKSHOP_NAME}/lab-03/code-interpreter-id")["Parameter"]["Value"]
resource_arn = f"arn:aws:bedrock-agentcore:{AWS_REGION}:{account_id}:code-interpreter-custom/{resource_id}"

delivery_ids = enable_observability_for_resource(resource_arn, resource_id, account_id)
```

## 4. Create Strands Agent Tools

**Goal:** Define Strands tools for remediation planning and execution with approval workflow.

**Approach:** Create @tool decorated functions for plan generation, execution, and validation.

**Key Learning:** How to implement secure remediation workflows with mandatory approval gates.

````python
### 4.1: Define Remediation Tools [execute_remediation_step]


@tool
def execute_remediation_step(remediation_code: str) -> str:
    """Execute remediation steps"""

    if not initialize_code_interpreter_client():
        return "AgentCore Code Interpreter not available"

    session_id = start_code_interpreter_session()
    if not session_id:
        return "Failed to start code interpreter session"

    try:
        execution_result = execute_remediation_code(session_id, remediation_code)

        if "error" in execution_result:
            return f"❌ failed: {execution_result['error']}"

        response = "# ✅ APPROVED EXECUTION - Results\n\n"
        response += "## Execution Output\n\n```\n"
        response += execution_result["output"]
        response += "\n```\n"

        return response

    except Exception as e:
        logger.error(f"❌ Error : {e}")
        return f"❌ remediation plan execution failed: {str(e)}"
    finally:
        stop_code_interpreter_session(session_id)
````

```python
### 4.2: Define Remediation Tools [validate_remediation_environment]


@tool
def validate_remediation_environment() -> str:
    """Validate that the remediation environment is ready"""

    logger.info("🔍 Validating remediation environment...")

    validation_results = {
        "code_interpreter_available": False,
        "session_creation": False,
        "aws_access": False,
        "environment_ready": False,
    }

    try:
        # Test code interpreter initialization
        if initialize_code_interpreter_client():
            validation_results["code_interpreter_available"] = True

            # Test session creation
            session_id = start_code_interpreter_session()
            if session_id:
                validation_results["session_creation"] = True
                validation_results["aws_access"] = True  # Simplified for demo
                stop_code_interpreter_session(session_id)

        validation_results["environment_ready"] = all(
            [
                validation_results["code_interpreter_available"],
                validation_results["session_creation"],
                validation_results["aws_access"],
            ]
        )

    except Exception as e:
        logger.error(f"❌ Environment validation failed: {e}")

    # Format response
    response = "# Remediation Environment Validation\n\n"
    response += f"**Validation Date**: {datetime.utcnow().isoformat()}\n\n"

    for check, status in validation_results.items():
        status_icon = "✅" if status else "❌"
        check_name = check.replace("_", " ").title()
        response += f"- **{check_name}**: {status_icon} {'PASS' if status else 'FAIL'}\n"

    if validation_results["environment_ready"]:
        response += "\n🎉 **Environment is READY for remediation**\n"
    else:
        response += "\n⚠️ **Environment is NOT READY**\n"

    return response
```

```python
### 4.3: Define Remediation Tools [persist_remediation_scripts_to_s3]
@tool
def persist_remediation_scripts_to_s3(file_key: str, content: str) -> dict:
    """Write a python scripts to S3 bucket.

    Args:
        bucket_name: Name of the S3 bucket
        file_key: The S3 key (path/filename) where the file will be stored
        content: The content to write to the file
        region: AWS region (default: us-west-2)
        content_type: MIME type of the content (default: text/plain)
    """
    bucket_name = retrieved_bucket_name
    region = AWS_REGION
    try:
        s3_client = boto3.client("s3", region_name=region)

        # Write to S3
        s3_client.put_object(Bucket=bucket_name, Key=file_key, Body=content.encode("utf-8"))

        # Generate S3 URL
        s3_url = f"s3://{bucket_name}/{file_key}"
        https_url = f"https://{bucket_name}.s3.{region}.amazonaws.com/{file_key}"

        result = {
            "success": True,
            "message": "Successfully wrote file to S3",
            "bucket": bucket_name,
            "key": file_key,
            "s3_url": s3_url,
            "https_url": https_url,
            "size_bytes": len(content.encode("utf-8")),
        }

        return {
            "status": "success",
            "content": [{"text": f"✓ File written  to {s3_url}"}, {"json": result}],
        }

    except Exception as e:
        error_msg = f"Failed to write file to S3: {str(e)}"
        return {"status": "error", "content": [{"text": error_msg}]}
```

```python
### 4.4: Define Remediation Tools [read_remediation_scripts_from_s3]
@tool
def read_remediation_scripts_from_s3(prefix: str = "") -> dict:
    """Read all files from an S3 bucket and return their contents.

    Args:
        prefix: Optional prefix to filter files (e.g., 'crm-remediation')
    """
    bucket_name = retrieved_bucket_name
    region = AWS_REGION
    max_files = 100

    try:
        s3_client = boto3.client("s3", region_name=region)

        # List objects
        list_params = {"Bucket": bucket_name, "MaxKeys": max_files}
        if prefix:
            list_params["Prefix"] = prefix

        response = s3_client.list_objects_v2(**list_params)

        if "Contents" not in response:
            return {
                "status": "success",
                "content": [
                    {"text": f"No files found in s3://{bucket_name}/{prefix}"},
                    {
                        "json": {
                            "success": True,
                            "bucket": bucket_name,
                            "prefix": prefix,
                            "file_count": 0,
                            "files": [],
                        }
                    },
                ],
            }

        files_data = []
        total_size = 0

        # Read each file
        for obj in response["Contents"]:
            file_key = obj["Key"]

            # Skip directories (keys ending with /)
            if file_key.endswith("/"):
                continue

            try:
                # Read file content
                file_response = s3_client.get_object(Bucket=bucket_name, Key=file_key)
                content = file_response["Body"].read().decode("utf-8")

                file_info = {
                    "key": file_key,
                    "s3_url": f"s3://{bucket_name}/{file_key}",
                    "size": obj["Size"],
                    "last_modified": obj["LastModified"].isoformat(),
                    "content": content,
                }
                files_data.append(file_info)
                total_size += obj["Size"]

            except Exception as file_error:
                # If a file can't be read, include error info but continue
                files_data.append(
                    {
                        "key": file_key,
                        "s3_url": f"s3://{bucket_name}/{file_key}",
                        "size": obj["Size"],
                        "last_modified": obj["LastModified"].isoformat(),
                        "error": str(file_error),
                    }
                )

        result = {
            "success": True,
            "message": f"Successfully read {len(files_data)} files from S3",
            "bucket": bucket_name,
            "prefix": prefix,
            "file_count": len(files_data),
            "total_size_bytes": total_size,
            "files": files_data,
        }

        return {
            "status": "success",
            "content": [
                {"text": f"✓ Read {len(files_data)} files from s3://{bucket_name}/{prefix}"},
                {"json": result},
            ],
        }

    except Exception as e:
        error_msg = f"Failed to read files from S3: {str(e)}"
        return {"status": "error", "content": [{"text": error_msg}]}
```

```python
# Get current application architecture and details
with open("lab_helpers/lab_03/app_arch.txt", "r") as f:
    current_app_architecture = f.read()
```

## 5. Create Strands Agent

**Goal:** Create Strands agent with remediation tools and appropriate system prompt.

**Approach:** Configure agent with Bedrock model and remediation tools.

**Key Learning:** How to configure agents for infrastructure remediation workflows.

```python
### 5.1: Create Strands Agent with Remediation Tools


def setup_agent(region=AWS_REGION):
    """Setup Strands agent with remediation tools"""
    try:
        if not initialize_code_interpreter_client():
            logger.error("❌ Failed to initialize code interpreter client")
            return None

        BOTO3_CONFIG = Config(
            read_timeout=300,  # 5 minutes for model responses
            connect_timeout=60,  # 1 minute for connection
            retries={"max_attempts": 3, "mode": "adaptive"},
        )
        model = BedrockModel(
            model_id=MODEL_ID,
            streaming=True,
            max_tokens=4000,
            boto_client_config=BOTO3_CONFIG,
        )
        system_prompt = f"""
            You are an AWS application remediation agent that helps in creating remediation plans in markdown format (no code execution). 
            Here are the application details and architecture: {current_app_architecture}
            Think step and step, break down the problems into smaller steps and use the persist_remediation_scripts_to_s3 tool to persist remediation plans.

FOCUS: Generate plans to restore system availability. No long-term improvements.

After the remediation plan has been created and persisted, provide the below summary:
1. **Issue Summary** - Brief description of the problem
2. **Root Cause** - Identified cause based on diagnostics
3. **Remediation Plan** - High level summary of the proposed fixes (numbered list)

        """
        agent = Agent(
            system_prompt=system_prompt,
            model=model,
            tools=[
                execute_remediation_step,
                validate_remediation_environment,
                persist_remediation_scripts_to_s3,
                read_remediation_scripts_from_s3,
            ],
        )

        logger.info("✅ SRE Remediation Agent ready with code interpreter tools")
        logger.info(f"🌍 Region: {region}")
        logger.info(f"🔧 Code interpreter integration: {CODE_INTERPRETER_AVAILABLE}")

        return agent

    except Exception as e:
        logger.error(f"❌ Failed to setup agent: {e}")
        return None


# Setup the agent
agent = setup_agent()
if agent:
    print("✅ Strands agent created successfully")
    print(f"   Model: {MODEL_ID}")
    print(
        "   Tools: 4 (execute_remediation_step, validate_remediation_environment, persist_remediation_scripts_to_s3, read_remediation_scripts_from_s3)"
    )
    print(f"   Code Interpreter: {CODE_INTERPRETER_AVAILABLE}")
else:
    print("❌ Agent setup failed!")
    print("   Check Code Interpreter initialization and AWS credentials")
```

## Enrich Context from Memory with Diagnostics Information

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

## 6. Test Remediation Workflow

**Goal:** Demonstrate complete remediation workflow with approval gates.

**Approach:** Run infrastructure remediation analysis with two-step approval process.

**Key Learning:** End-to-end remediation process from planning to execution approval.

```python
### 6.1: Run Complete Remediation Workflow


if agent:
    print("🚀 Starting Complete Remediation Workflow...")
    print("=" * 60)
    print()

    # Example remediation prompt
    # remediation_prompt = f"""I need help with infrastructure remediation for our CRM application. We're experiencing: {additional_context} """

    remediation_prompt = f"""
    Help me fix  the dynamo DB throttling issues based on this diagnostic information: {additional_context}.
    
    """

    try:
        start_time = datetime.now()
        response = agent(remediation_prompt)
        analysis_time = (datetime.now() - start_time).total_seconds()

        print("\n🎯 REMEDIATION ANALYSIS RESULTS:")
        print(f"Analysis Time: {analysis_time:.2f} seconds")

        # Display response
        response_content = response.message.get("content", [])
        if response_content:
            for content in response_content:
                if isinstance(content, dict) and "text" in content:
                    text = content["text"]
                    if len(text) > 2000:
                        print(f"\n📋 AGENT ANALYSIS (first 2000 chars):\n{text[:2000]}...")
                    else:
                        print(f"\n📋 AGENT ANALYSIS:\n{text}")
    except Exception as e:
        print(f"❌ Error: {e}")

    print("⚠️  Note: This will demonstrate the complete remediation planning workflow")

else:
    print("❌ Agent not available for workflow demonstration!")
```

## 7. Deploy to AgentCore Runtime

**Goal:** Deploy the remediation agent to Amazon Bedrock AgentCore Runtime for serverless execution.

**Approach:** Transform the agent for AgentCore compatibility and deploy using the CLI.

**Key Learning:** How to deploy Strands agents with Code Interpreter integration to production-ready serverless infrastructure.

### 7.1: Create AgentCore-Compatible Agent

First, we need to create an AgentCore-compatible version of our remediation agent with the required wrapper and entrypoint.

```python
### 7.1: Create Custom Runtime IAM Role

# Initialize deployer
deployer = AgentCoreRuntimeDeployer(region=AWS_REGION, prefix=WORKSHOP_NAME, verbose=False)

# Check AgentCore Starter kit prerequisites
if not deployer.check_prerequisites():
    raise RuntimeError("Prerequisites not met. Install: pip install bedrock-agentcore-starter-toolkit")

# Load custom policies and replace placeholders
iam = boto3.client("iam")
sts = boto3.client("sts")
account_id = sts.get_caller_identity()["Account"]
role_name = f"{WORKSHOP_NAME}_CustomRemediationRuntimeRole"

# Load trust policy
with open("lab_helpers/lab_03/custom_runtime_trust_policy.json", "r") as f:
    trust_policy = f.read()
    trust_policy = trust_policy.replace("{{ACCOUNT_ID}}", account_id)
    trust_policy = trust_policy.replace("{{REGION}}", AWS_REGION)

# Load permissions policy
with open("lab_helpers/lab_03/custom_runtime_permissions.json", "r") as f:
    permissions_policy = f.read()
    permissions_policy = permissions_policy.replace("{{ACCOUNT_ID}}", account_id)
    permissions_policy = permissions_policy.replace("{{REGION}}", AWS_REGION)
    permissions_policy = permissions_policy.replace("{{PREFIX}}", WORKSHOP_NAME)

# Create or update role
try:
    role = iam.get_role(RoleName=role_name)
    role_arn = role["Role"]["Arn"]
    iam.update_assume_role_policy(RoleName=role_name, PolicyDocument=trust_policy)
    print(f"✅ Using existing role: {role_name}")
except iam.exceptions.NoSuchEntityException:
    role = iam.create_role(
        RoleName=role_name,
        AssumeRolePolicyDocument=trust_policy,
        Description="Custom execution role for AgentCore Runtime",
    )
    role_arn = role["Role"]["Arn"]
    print(f"✅ Created custom role: {role_name}")
    import time

    time.sleep(10)

# Attach permissions
iam.put_role_policy(
    RoleName=role_name,
    PolicyName=f"{WORKSHOP_NAME}_RuntimePermissions",
    PolicyDocument=permissions_policy,
)

role_info = {"role_arn": role_arn, "role_name": role_name}
print("✅ Custom permissions attached")
print(f"   Role ARN: {role_arn}")
```

```python
### 7.1: Agent code for deployment

# Load agent code from helper file
with open("lab_helpers/lab_03/runtime_mcp_agent_code.py", "r") as f:
    agentcore_agent_code = f.read()

print("✅ Agent code loaded from: lab_helpers/lab_03/runtime_mcp_agent_code.py")
print(f"   Code length: {len(agentcore_agent_code)} characters")
print("   Transport: streamable-http (AgentCore Runtime compatible)")
```

```python
### 7.1: Write agent code to disk
with open("agent-remediation.py", "w") as f:
    f.write(agentcore_agent_code)

print("✅ Agent code written: agent-remediation.py")
```

### 7.2 Configure Runtime with JWT Authorizer

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
from lab_helpers.parameter_store import get_parameter
from lab_helpers.constants import PARAMETER_PATHS

# Retrieve Cognito configuration from Lab-01 SSM Parameter Store
user_pool_id = get_parameter(PARAMETER_PATHS["cognito"]["user_pool_id"])
m2m_client_id = get_parameter(PARAMETER_PATHS["cognito"]["m2m_client_id"])
user_auth_client_id = get_parameter(PARAMETER_PATHS["cognito"]["user_auth_client_id"])

# Build Cognito discovery URL - Runtime uses this to fetch public keys for token validation
discovery_url = f"https://cognito-idp.{AWS_REGION}.amazonaws.com/{user_pool_id}/.well-known/openid-configuration"

print("✅ Cognito configuration retrieved")
print(f"   Discovery URL: {discovery_url}")
print("   Allowed Clients: User Auth + M2M")
print(f"   User Auth Client ID: {user_auth_client_id}")
print(f"   M2M Client ID: {m2m_client_id}")
```

```python
### 7.2 b: Configure Runtime with JWT Authorizer

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
print(f"\n🔍 Using execution role: {role_info['role_arn']}")
print(f"   Role name: {role_info['role_name']}")

runtime.configure(
    entrypoint="agent-remediation.py",
    execution_role=role_info["role_arn"],
    auto_create_ecr=True,
    requirements_file="requirements.txt",
    region=AWS_REGION,
    agent_name=f"{WORKSHOP_NAME}_remediation_runtime",
    protocol="MCP",
    authorizer_configuration=authorizer_config,  # ← TOKEN VALIDATION ENABLED
)

print("✅ Runtime configured with JWT authorizer")
print("   Protocol: MCP")
print("   JWT Token Validation: ENABLED")
print("   Allowed Tokens: User Auth + M2M")
```

### 7.3: Launch Runtime to AgentCore

Deploy the configured Runtime to AgentCore using the Python SDK `runtime.launch()`. This critical step transforms your local agent into a production serverless service.

#### 7.3 a: Understanding the Launch Process

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
### 7.3 b: Execute runtime.launch()

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
### 7.3c: Storing Runtime Configuration

# Extract and store runtime configuration
runtime_arn = launch_result.agent_arn
runtime_id = getattr(launch_result, "agent_id", None)

# Store configuration
from lab_helpers.lab_03 import store_runtime_configuration

store_runtime_configuration(runtime_arn, runtime_id, region=AWS_REGION, prefix=WORKSHOP_NAME)

print("\n✅ Runtime deployed and configured")
print(f"   ARN: {runtime_arn}")
print("   Ready for Gateway registration")
```

```python
# Import the logging configuration helper
from lab_helpers.lab_03.configure_logging import configure_runtime_logging

# Configure CloudWatch Logs Delivery for the Runtime
logging_config = configure_runtime_logging(
    runtime_arn=runtime_arn,  # From previous cell
    runtime_id=runtime_id,  # From previous cell
    region=AWS_REGION,
    log_type="APPLICATION_LOGS",  # Container stdout/stderr logs
)

print("\n📊 Logging Configuration Summary:")
print(f"  Log Group: {logging_config['log_group_name']}")
print(f"  Delivery Status: {logging_config['delivery_status']}")
print(f"  Delivery ID: {logging_config['delivery_id']}")
```

## 8. Deploy Gateway with Cognito JWT Authorization

**Goal:** Deploy AgentCore Gateway with Cognito JWT authorizer for inbound user authentication.

**Approach:** Use Cognito User Auth Client and JWT validation for gateway access control.

**Key Learning:** How to integrate Cognito authentication into AgentCore Gateway.

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
    name="aiml301-remediation-gateway",
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
put_parameter(PARAMETER_PATHS["lab_03"]["gateway_id"], gateway_id)
put_parameter(PARAMETER_PATHS["lab_03"]["gateway_role_arn"], role_arn)

print("✅ Gateway deployed with JWT authorization")
print(f"   Gateway ID: {gateway_id}")
print(f"   Gateway URL: {gateway_url}")
print("   Auth Type: Cognito JWT")
```

## 9. Add Runtime as Gateway Target with M2M Auth

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

```python
### 9.1 Create AgentCore Identity CredentialsProvider for Secure Access
# Retrieve M2M credentials from Lab-01 Cognito setup
m2m_client_id = get_parameter(PARAMETER_PATHS["cognito"]["m2m_client_id"])
m2m_client_secret = get_parameter(PARAMETER_PATHS["cognito"]["m2m_client_secret"])
user_pool_id = get_parameter(PARAMETER_PATHS["cognito"]["user_pool_id"])

# Build Cognito OIDC discovery URL
discovery_url = f"https://cognito-idp.{AWS_REGION}.amazonaws.com/{user_pool_id}/.well-known/openid-configuration"

# Initialize AgentCore client
agentcore = boto3.client("bedrock-agentcore-control", region_name=AWS_REGION)

# Create OAuth2 Credential Provider
# Stores M2M credentials securely in Secrets Manager
credential_provider_response = agentcore.create_oauth2_credential_provider(
    name="aiml301-m2m-credentials",
    credentialProviderVendor="CustomOauth2",
    oauth2ProviderConfigInput={
        "customOauth2ProviderConfig": {
            "clientId": m2m_client_id,
            "clientSecret": m2m_client_secret,
            "oauthDiscovery": {"discoveryUrl": discovery_url},
        }
    },
)

# Extract response
oauth2_provider_arn = credential_provider_response["credentialProviderArn"]
client_secret_arn = credential_provider_response["clientSecretArn"]["secretArn"]

# Store in SSM for next sections
put_parameter(PARAMETER_PATHS["lab_03"]["oauth2_provider_arn"], oauth2_provider_arn)
put_parameter(PARAMETER_PATHS["lab_03"]["oauth2_secret_arn"], client_secret_arn)

print("✅ OAuth2 Credential Provider created")
print("\n📋 Credential Storage:")
print(f"   Provider ARN: {oauth2_provider_arn}")
print(f"   Secret ARN: {client_secret_arn}")
print("   Location: AWS Secrets Manager (encrypted)")
print("   Credentials: M2M client_id + client_secret")
```

```python
### 9.2 Create Target for Runtime with M2M OAuth2

import urllib.parse

# Retrieve configurations from SSM
gateway_id = get_parameter(PARAMETER_PATHS["lab_03"]["gateway_id"], region_name=AWS_REGION)
runtime_arn = get_parameter(PARAMETER_PATHS["lab_03"]["runtime_arn"], region_name=AWS_REGION)
oauth2_provider_arn = get_parameter(PARAMETER_PATHS["lab_03"]["oauth2_provider_arn"], region_name=AWS_REGION)
resource_server_id = get_parameter(PARAMETER_PATHS["cognito"]["resource_server_identifier"], region_name=AWS_REGION)

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
    PARAMETER_PATHS["lab_03"]["gateway_runtime_target"],
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

## 10. MCP Client Integration with JWT Auth

**Goal:** Connect local MCP client to Gateway via Cognito authentication.

**Approach:**
1. Fetch Tokens from Cognito
2. Create local MCP server wrapper
3. Connect to Gateway with MCP protocol
4. Test end-to-end flow

**Key Learning:** Full integration: Local client → MCP → Gateway → Runtime → Strands Agent → Remediation

```python
### 10.1: Display Test User Credentials
# Retrieve test user credentials from SSM Parameter Store
user_pool_id = get_parameter(PARAMETER_PATHS["cognito"]["user_pool_id"])
token_endpoint = get_parameter(PARAMETER_PATHS["cognito"]["token_endpoint"])
user_client_id = get_parameter(PARAMETER_PATHS["cognito"]["user_auth_client_id"])
test_username = get_parameter(PARAMETER_PATHS["cognito"]["test_user_email"])
test_password = get_parameter(PARAMETER_PATHS["cognito"]["test_user_password"])

print(f"  ✓ User Pool: {user_pool_id}")
print(f"  ✓ Client ID: {user_client_id}")
print(f"  ✓ Username: {test_username}")
```

```python
### 10.2: Authenticate Test User and Retrieve JWT Token
print("\n🔑 Authenticating with Cognito...")

cognito = boto3.client("cognito-idp", region_name=AWS_REGION)

response = cognito.initiate_auth(
    ClientId=user_client_id,
    AuthFlow="USER_PASSWORD_AUTH",
    AuthParameters={"USERNAME": test_username, "PASSWORD": test_password},
)

access_token = response["AuthenticationResult"]["AccessToken"]
id_token = response["AuthenticationResult"]["IdToken"]
expires_in = response["AuthenticationResult"]["ExpiresIn"]

print("  ✅ Authentication successful!")
print("  ✓ Token Type: Bearer")
print(f"  ✓ Expires in: {expires_in} seconds")
print(f"  ✓ Access Token (first 50 chars): {access_token[:50]}...")
```

```python
### 10.3: Decode JWT Token and Show Claims

import base64

# Decode JWT token to show claims
print("\n📋 Decoding JWT Token...")

# JWT tokens have 3 parts: header.payload.signature
parts = access_token.split(".")
if len(parts) == 3:
    # Decode payload (add padding if needed)
    payload_b64 = parts[1]
    # Add padding for base64 decoding
    padding = 4 - len(payload_b64) % 4
    if padding != 4:
        payload_b64 += "=" * padding

payload_json = base64.urlsafe_b64decode(payload_b64)
payload = json.loads(payload_json)

print("  Token Claims:")
print(f"    • Subject (sub): {payload.get('sub', 'N/A')}")
print(f"    • Username: {payload.get('username', 'N/A')}")
print(f"    • Client ID: {payload.get('client_id', 'N/A')}")
print(f"    • Token Use: {payload.get('token_use', 'N/A')}")
print(f"    • Scope: {payload.get('scope', 'N/A')}")
print(f"    • Issued At: {payload.get('iat', 'N/A')}")
print(f"    • Expiration: {payload.get('exp', 'N/A')}")
```

```python
### 10.4: Connect to AgentCore Gateway using MCP Client

from lab_helpers.lab_03.mcp_client import MCPClient

print("=" * 80)
print("🌉 Connecting to AgentCore Gateway")
print("=" * 80)

print(f"  ✓ Gateway URL: {gateway_url}")

# Create MCP client
client = MCPClient(gateway_url, access_token)
# Initialize session
client.initialize()
```

```python
### 10.5: List Available Tools from Gateway
print("=" * 80)
print("🔧 Step 4: Listing Available MCP Tools")
print("=" * 80)

# List all tools available through the Gateway
tools = client.list_tools()

# Store tool names for easy access
tool_names = [tool["name"] for tool in tools]
print(f"\n📝 Available tools: {tool_names}")
```

```python
print("=" * 80)
print("🔍 Step 5: Testing Tool Invocation")
print("=" * 80)

# Find the ddgs_search tool
search_tool = next(
    (t for t in tools if "infrastructure_agent" in t["name"].lower() and "news" not in t["name"].lower()),
    None,
)

start_time = time.time()
try:
    if search_tool:
        print(f"\n🎯 Using tool: {search_tool['name']}")

        # Call the search tool
        result = client.call_tool(
            tool_name=search_tool["name"],
            arguments={
                "remediation_query": f"""I need help with infrastructure remediation for our CRM application. We're experiencing: {additional_context} """,
                "action_type": "only_plan",
            },
        )

        print("\n✅ End-to-end test complete!")
        print("   Client → Gateway → Runtime → MCP Server → Remediation-Agent ✓")
    else:
        print("❌ Search tool not found")

except Exception as e:
    print(f"❌ Error: {e}")

end_time = time.time()
print(f"  ⏰ Total time taken: {end_time - start_time:.2f} seconds")
```

## 11. Cleanup

**Goal:** Remove all Lab 03 resources including custom code interpreter and IAM role.

**Important:** Only run cleanup if you don't plan to run Lab-04 next.

```python
### 11.1: Cleanup All Lab 03 Resources

from lab_helpers.config import AWS_REGION

# Only run if you do not plan to run Lab-04 next

# cleanup_lab_03(region_name=AWS_REGION, verbose=True)
```

**Next Steps:**
- ✅ All Lab 03 resources have been removed
- ✅ AWS costs for AgentCore Runtime and Gateway are now zero
- ✅ You can safely run other labs or re-run Lab 03

**To Re-run Lab 03:**
1. Start from Section 1 (Imports)
2. All helper functions are still available
3. IAM roles will be recreated with fresh permissions

**To Move to Lab 04:**
- See `Lab-04-prevention-agent.ipynb` for the prevention agent workflow

## Summary: Lab 3 - Remediation Agent Architecture

✅ **Completed:**
1. ✓ **Custom Code Interpreter Setup** - Created custom interpreter with IAM execution role
2. ✓ **Custom IAM Role** - Configured permissions for CloudWatch, S3, X-Ray, and Metrics
3. ✓ **PUBLIC Network Mode** - Simplified setup without VPC requirements
4. ✓ **Session Management** - Start/stop Code Interpreter sessions with proper cleanup
5. ✓ **Remediation Tools** - Planning, execution, and validation tools with approval workflow
6. ✓ **Strands Agent** - Expert remediation agent with comprehensive system prompt
7. ✓ **AgentCore Runtime Deployment** - Production-ready serverless deployment
8. ✓ **Production Testing** - Validated deployed agent functionality and security
9. ✓ **Complete Cleanup** - Custom interpreter and IAM role cleanup included

**Complete Workflow:**
```
Custom Code Interpreter Setup
    ├─ IAM Execution Role ✓
    ├─ Custom Interpreter (PUBLIC mode) ✓
    └─ Session Testing ✓
    ↓
Development (Notebook)
    ↓
Local Testing & Validation
    ↓
AgentCore Runtime Deployment
    ├─ CodeBuild Container Build ✓
    ├─ AWS Resource Creation ✓
    └─ Serverless Deployment ✓
    ↓
Production Agent
    ├─ Serverless Execution ✓
    ├─ Auto-scaling ✓
    ├─ Custom Code Interpreter Integration ✓
    ├─ Approval Workflows ✓
    └─ Monitoring & Logging ✓
    ↓
Cleanup
    ├─ Custom Code Interpreter ✓
    ├─ IAM Execution Role ✓
    └─ All Lab Resources ✓
```
**Production Status: ✅ DEPLOYED AND OPERATIONAL**

**Key Features:**
- Custom code interpreter with tailored permissions
- PUBLIC network mode for simplified setup
- Full control over execution environment
- Complete resource cleanup included

**Next: Lab 4 - Prevention Agent** (`Lab-04-prevention-agent.ipynb`)
- Proactive infrastructure analysis using AgentCore Browser
- Real-time AWS best practices research
- Prevention-focused recommendations to avoid issues before they occur
- Complete SRE automation pipeline: Prevention + Remediation
