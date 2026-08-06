# Lab 1: Prerequisites & Infrastructure Setup

## Overview
Verify all prerequisites for the workshop and deploy the CRM application stack on AWS (EC2 + NGINX + DynamoDB).

## Objectives
**Part 1: Prerequisites**
- Verify Python version (3.10+)
- Verify AWS account and credentials
- Install workshop dependencies
- Verify Bedrock AgentCore SDK and starter toolkit
- Test Bedrock model access
- Set up Agent Memory for shared context
- Set up User and Agent identities using Amazon Cognito

**Part 2: Infrastructure Setup**
- Provision AWS infrastructure: EC2 instance, NGINX, DynamoDB, CloudWatch
- Deploy a sample CRM application
- Create fault injection scripts to simulate failures
- Set up CloudWatch monitoring
- Verify infrastructure is running and accessible

## What You'll Learn
- Workshop prerequisites and setup workflow
- Fault injection patterns for testing incident response
- CloudWatch log and metric setup for diagnostics

## 1. Verify Python Version

```python
import sys

print(f"Python version: {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")
assert sys.version_info >= (3, 10), "Python 3.10+ required"
print("✅ Python version check passed")
```

## 2. Install Workshop Dependencies

```python
%pip install -q -r requirements.txt
print("✅ Workshop dependencies installed")
```

## 3. Verify AWS Configuration

```python
import boto3
from lab_helpers.config import AWS_REGION, AWS_PROFILE, MODEL_ID, WORKSHOP_NAME
from lab_helpers.lab_01.infrastructure import get_app_url

# Display configuration
print(f"Workshop Name: {WORKSHOP_NAME}")
print(f"AWS Region: {AWS_REGION}")
print(f"Model ID: {MODEL_ID}\n")

# Verify AWS credentials
session = boto3.Session(profile_name=AWS_PROFILE, region_name=AWS_REGION)
sts = session.client("sts")
identity = sts.get_caller_identity()

print(f"✅ AWS Account: {identity['Account']}")
print(f"✅ AWS User/Role: {identity['Arn']}")
```

## 4. Test Bedrock Model Access

```python
import boto3
from lab_helpers.config import AWS_REGION, MODEL_ID, AWS_PROFILE

session = boto3.Session(profile_name=AWS_PROFILE, region_name=AWS_REGION)
bedrock = session.client("bedrock", region_name=AWS_REGION)

# Verify model access
try:
    model = bedrock.get_foundation_model(modelIdentifier=MODEL_ID)
    print(f"Model ID: {MODEL_ID}")
    print("✅ Bedrock model access verified")
except Exception as e:
    print(f"❌ Error accessing model: {e}")
    raise
```

## 5. Verify AgentCore Components

```python
import importlib

packages = ["bedrock_agentcore", "strands", "boto3", "pydantic"]

for package in packages:
    try:
        mod = importlib.import_module(package)
        version = getattr(mod, "__version__", "installed")
        print(f"✅ {package:<20} {version}")
    except ImportError:
        print(f"❌ {package:<20} NOT FOUND")

print("\n✅ All core packages verified")
```

## Summary
✅ All prerequisites verified. Ready to proceed to Lab 1: Infrastructure Setup & Fault Injection.

## Part 1.5: Cognito Setup (Authentication for Labs 3-5)

### Overview

In this section, we'll set up AWS Cognito for authentication infrastructure used by Labs 3-5:

**What We'll Create:**
- Cognito User Pool: `aiml301-UserPool`
- **Two User Groups** (NEW):
  - **developers**: Users who create remediation plans
  - **approvers**: Users who approve and execute plans
- **Two App Clients**:
  - **User Auth Client** (public): For end-user authentication with OAuth support
  - **M2M Client** (confidential): For Gateway-to-Runtime service-to-service authentication
- **Resource Server**: Custom scopes for fine-grained authorization (`mcp.invoke`, `runtime.access`)
- **User Pool Domain**: OAuth2 token endpoint
- **Two Test Users**:
  - **Developer User**: `testuser@aiml301.example.com` (member of `developers` group)
  - **Approver User**: `approver@aiml301.example.com` (member of `approvers` group)

**Authentication Flows:**
1. **User Auth** (Client → Gateway): End-users authenticate with credentials, receive JWT tokens with group membership
2. **M2M Auth** (Gateway → Runtime): Gateway uses client credentials grant to get M2M tokens for Runtime access

**Multi-Actor Workflow (Lab-03):**
- **Developer** logs in → Creates remediation plan → Gets blocked (needs approval)
- **Approver** logs in → Discovers pending incidents → Reviews plan → Approves execution
- **Developer** returns → Sees approval in shared memory → Executes approved steps

**JWT Token Claims:**
After setup, JWT ID tokens will include:
```json
{
  "email": "developer@aiml301.example.com",
  "cognito:username": "developer@aiml301.example.com",
  "cognito:groups": ["developers"],
  "sub": "uuid",
  "scope": "openid profile email custom-scopes"
}
```

**Why Groups?**
- **Role-based authorization**: Gateway can check if user is in `approvers` group before allowing execution
- **Incident routing**: Only notify approvers for pending incidents
- **Audit trails**: Memory records show which role performed each action
- **Actor identification**: `email` claim provides readable actor_id instead of UUID

### Objectives

✅ Set up Cognito infrastructure for centralized authentication
✅ Create user groups for role-based access control
✅ Enable dual auth modes: user-based and service-to-service
✅ Create fine-grained authorization scopes
✅ Enable OAuth flows for rich JWT ID tokens
✅ Store configuration in SSM Parameter Store for use by later labs

#### 1. Execute Cognito Setup

```python
from lab_helpers.cognito_setup import setup_cognito_complete

# Execute complete Cognito setup workflow
cognito_config = setup_cognito_complete()

print("\n" + "=" * 70)
print("COGNITO SETUP COMPLETE")
print("=" * 70)
print("Cognito User Pool ID: ", cognito_config["user_pool_id"])
```

## Part 1.6: Memory Setup for Labs 2-5

In this section, we'll create a shared AgentCore Memory resource that will be used by all agent labs (2-5) for conversation history and session management.

### What We'll Create:
- AgentCore Memory resource with 7-day expiry
- Store memory_id in Parameter Store for easy access by Labs 2-5
- Store default session ID for static session tracking in Labs 2-4

### Key Learning:
Memory enables context persistence across agent calls and multi-turn conversations. All labs will share this single memory resource.

### Objectives
✅ Create AgentCore Memory resource  
✅ Store memory configuration in Parameter Store  
✅ Enable conversation history loading for downstream agents

```python
### 1.6.1: Create AgentCore Memory Resource

from bedrock_agentcore.memory import MemoryClient
from lab_helpers.constants import PARAMETER_PATHS
from datetime import datetime

memory_client = MemoryClient(region_name=AWS_REGION)
memory_name = f"{PARAMETER_PATHS['memory']['memory_name_prefix']}_{datetime.now().strftime('%Y%m%d%H%M%S')}"

print(f"Creating memory: {memory_name}")
memory = memory_client.create_memory_and_wait(
    name=memory_name,
    description="SRE Agent Shared Short-Term Memory for Labs 2-5",
    strategies=[],
    event_expiry_days=7,
    max_wait=600,
    poll_interval=10,
)

memory_id = memory["id"]
print(f"✅ Memory created: {memory_id} (Status: ACTIVE, Expiry: 7 days)")
```

```python
### 1.6.2: Store Memory Configuration in Parameter Store

from lab_helpers.parameter_store import put_parameter

# Store memory_id for Labs 2-5
put_parameter(
    PARAMETER_PATHS["memory"]["memory_id"],
    memory_id,
    description="Memory ID for agent conversation history",
    region_name=AWS_REGION,
)

# Store default session ID for Labs 2-4
put_parameter(
    PARAMETER_PATHS["memory"]["default_session_id"],
    "crm-session-id",
    description="Default session ID for Labs 2-4",
    region_name=AWS_REGION,
)

print("✅ PSM Keys stored:")
print(f"   • {PARAMETER_PATHS['memory']['memory_id']} = {memory_id}")
print(f"   • {PARAMETER_PATHS['memory']['default_session_id']} = crm-session-id")
```

### Summary: Memory Setup Complete

✅ **AgentCore Memory Resource Created**
- Single shared memory resource for all labs (2-5)
- Automatic 7-day expiry for cost management
- Supports multi-turn conversations and context loading

✅ **Parameter Store Configuration**
- Memory ID stored for Lab 2-5 retrieval
- Default session ID available for Labs 2-4
- Follows central configuration pattern

**Next Steps:**
- Lab 2: Retrieve memory_id and initialize memory hooks
- Lab 3-4: Use same memory for remediation/prevention agents
- Lab 5: Multi-agent orchestration with shared memory

## Part 2: Infrastructure Setup & CRM Application Deployment

The Infrastructure Setup & CRM Application Deployment is automated is a part of the workshop set up.

Please proceed to the next section.

```python
# Try url with both port 80 and 8080
print(f"Click here to access the CRM App UI: '{get_app_url()}'")
```

## 1. Set Up Fault Injection Utilities

In this section, we'll prepare tools to inject infrastructure faults and review pre-baked faults already built into the deployment. The workshop includes **4 total faults** for comprehensive SRE training:

- **Fault 1: DynamoDB Throttling** - Reduce table capacity to trigger ProvisionedThroughputExceededException
- **Fault 2: IAM Permission Issues** - Restrict EC2 role permissions to cause AccessDenied errors

These faults will be used throughout the workshop to test your SRE agent's diagnostic capabilities across different failure modes and detection methods.

```python
from lab_helpers.lab_01.fault_injection import (
    initialize_fault_injection,
    inject_dynamodb_throttling,
    inject_iam_permissions,
)

# Initialize AWS clients and retrieve infrastructure resource IDs from SSM
print("Initializing fault injection utilities...")
resources = initialize_fault_injection(AWS_REGION, AWS_PROFILE)

print("\nDiscovered Infrastructure Resources:")
print(f"  Nginx Instance: {resources.get('nginx_instance_id', 'Not found')}")
print(f"  App Instance: {resources.get('app_instance_id', 'Not found')}")
print(f"  CRM Activities Table: {resources.get('crm_activities_table_name', 'Not found')}")
print(f"  CRM Customers Table: {resources.get('crm_customers_table_name', 'Not found')}")
print(f"  CRM Deals Table: {resources.get('crm_deals_table_name', 'Not found')}")
print(f"  EC2 Role: {resources.get('ec2_role_name', 'Not found')}")
print(f"  Public ALB DNS: {resources.get('public_alb_dns', 'Not found')}")

print("\n✅ Fault injection utilities ready")
```

## 2. Verify Infrastructure

Before injecting faults, let's verify that the CloudFormation stack has created all necessary resources and they are healthy.

```python
from lab_helpers.lab_01.infrastructure import (
    verify_ec2_instances,
    verify_dynamodb_tables,
    verify_alb_health,
    verify_cloudwatch_logs,
)

print("Verifying infrastructure components...\n")

# Verify EC2 instances are running
ec2_status = verify_ec2_instances(resources, AWS_REGION, AWS_PROFILE)

# Verify DynamoDB tables exist and are accessible
dynamodb_status = verify_dynamodb_tables(resources, AWS_REGION, AWS_PROFILE)

# Verify ALB targets are healthy
alb_status = verify_alb_health(resources, AWS_REGION, AWS_PROFILE)

# Verify CloudWatch log groups exist
logs_status = verify_cloudwatch_logs(AWS_REGION, AWS_PROFILE)

if all([ec2_status, dynamodb_status, alb_status, logs_status]):
    print("\n✅ All infrastructure components verified and healthy")
else:
    print("\n⚠️  Some infrastructure components failed verification")
```

## 3. Test Fault Injection and Review Pre-Baked Faults

In this section, we'll inject two infrastructure faults and review two additional faults that are pre-baked into the deployment. Together, these **4 faults** will provide comprehensive training scenarios for your diagnostic agents.

### Fault 1: DynamoDB Throttling

**What it is:**
DynamoDB throttling occurs when your application exceeds the provisioned read/write capacity of your tables. This is a common production issue that can happen when:
- Traffic spikes unexpectedly exceed provisioned capacity
- Tables are misconfigured with insufficient capacity units

**How we inject this fault:**
The `inject_dynamodb_throttling()` helper function simulates this by:
- Converting the metrics table from `PAY_PER_REQUEST` (unlimited) to `PROVISIONED` billing mode
- Setting extremely low capacity limits: **1 Read Capacity Unit** and **1 Write Capacity Unit**
- This means the table can only handle ~1 read and ~1 write operation per second
- Any normal application load will immediately exceed these limits

**Expected impact:**
- `ProvisionedThroughputExceededException` errors in application logs
- Increased latency as requests get throttled and retried
- CloudWatch metrics will show throttled requests

```python
# Execute DynamoDB throttling fault injection
success = inject_dynamodb_throttling(resources, AWS_REGION, AWS_PROFILE)

if success:
    print("✅ DynamoDB throttling fault injected successfully")
    print("   → Table converted to PROVISIONED mode with 1 RCU/1 WCU")
    print("   → Normal application load will now trigger throttling")
else:
    print("❌ Failed to inject DynamoDB throttling fault")
```

### Load Application Tables 

Now lets load test our endpoint. We are going to send 20 concurrent requests/second for 30 seconds. This load is not very significant, but due to misconfiguration in the table capacity provisioned - our app should should show `ProvisionedThroughputExceededException` errors in [application logs](https://us-west-2.console.aws.amazon.com/cloudwatch/home?region=us-west-2#logsV2:log-groups/log-group/$252Faws$252Fsre-workshop$252Fcrm-application) and CloudWatch metrics will show throttled requests. If you try to access the Customers tab during the load test, you will experience issues with it loading the data.

```python
import requests
import time
from concurrent.futures import ThreadPoolExecutor

alb_dns = resources["public_alb_dns"]
url = f"http://{alb_dns}:8080/api/customers"


def make_request(i):
    try:
        requests.get(url, timeout=5)
    except:
        pass


for second in range(1, 31):
    with ThreadPoolExecutor(max_workers=50) as executor:
        executor.map(make_request, range(50))

    if second % 10 == 0:
        print(f"Progress: {second}/30 seconds")

    time.sleep(1)

print("\n✓ Load test complete")
```

### Fault 2: IAM Permission Issues

**What it is:**
IAM permission issues occur when applications lack necessary permissions to access AWS resources. This is one of the most common production problems, often caused by:
- Overly restrictive security policies applied without testing
- Role assumptions failing due to trust policy modifications
- Security team applying blanket deny policies

**How we inject this fault:**
Our helper function `inject_iam_permissions()` simulates this by:
- Locating the EC2 instance IAM role used by the application servers
- Backing up the original DynamoDB access policy
- Replacing it with an explicit **Deny** policy for key DynamoDB operations
- Targeting: `PutItem`, `GetItem`, `Query`, `Scan`, `UpdateItem`, `DeleteItem`
- Since Deny policies override Allow policies, this immediately blocks database access

**Expected impact:**
- `AccessDenied` exceptions in application logs for any database operations
- Complete failure of features that require DynamoDB access

```python
# Execute IAM permission fault injection
success = inject_iam_permissions(resources, AWS_REGION, AWS_PROFILE)

if success:
    print("✅ IAM permission fault injected successfully")
    print(f"   → EC2 role '{resources.get('ec2_role_name', 'Unknown')}' now has Deny policy")
    print("   → All DynamoDB operations will return AccessDenied")
else:
    print("❌ Failed to inject IAM permission fault")
```

Let's test what response we get when invoking our application now. We should see error 500 due to the backend issues with the API not being able to retrieve data from DynamoDB.
**Note**: It may take a minute for IAM permissions to propagate. If you're not seeing 500 errors, please wait and try again.

```python
time.sleep(180)
alb_dns = resources["public_alb_dns"]

url = f"http://{alb_dns}:8080/api/deals"

print("\nGenerating 5 requests to trigger IAM errors...")
print(f"Target: {url}\n")

for i in range(10):
    try:
        response = requests.get(url, timeout=5)
        print(f"Request {i + 1} - Status: {response.status_code}")
    except Exception as e:
        print(f"Request {i + 1} - Error: {str(e)}")

    time.sleep(1)  # Small delay to avoid overwhelming

print("\n✓ Load complete - waiting 10 seconds for logs to propagate...")
time.sleep(10)
```

## Summary

✅ Prerequisites verified and infrastructure deployed. CRM application is running and monitored via CloudWatch. We have injected faults simulating real production issues for our Agent to troubleshoot.

Next: Lab 2 - Build the Diagnostics Agent (Lab-02-diagnostics-agent.ipynb)

```python
# Try url with both port 80 and 8080
print(f"Click here to access the CRM App UI: '{get_app_url()}'")
```
