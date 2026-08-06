# Lab 2: Diagnostics Agent

## Overview
Build a Strands-based diagnostics agent that analyzes CloudWatch logs and metrics from the CRM application stack.

## Objectives
- Create a Strands agent for incident analysis
- Implement custom tools for CloudWatch log and metric retrieval
- Build tools to fetch EC2, DynamoDB, and NGINX logs
- Test agent against real application logs
- Validate diagnostics accuracy

## What You'll Learn
- How to build a Strands agent with tool use
- How to create AWS Lambda-backed tools
- How to analyze CloudWatch logs programmatically
- Agent diagnostic workflow and reasoning

## Architecture Overview

```
┌─────────────────┐         ┌──────────────────────┐         ┌─────────────────────┐
│  User Request   │────────▶│   Strands Agent      │────────▶│  AgentCore Gateway  │
│  (Diagnostic    │         │   (Diagnostics)      │         │  (MCP Protocol)     │
│   Query)        │         └──────────────────────┘         └─────────────────────┘
└─────────────────┘                    │                               │
                                       │                               │
                                       ▼                               ▼
                          ┌────────────────────────┐      ┌──────────────────────┐
                          │  Diagnostic Tools      │      │  Lambda Function     │
                          │  ├─ EC2 Logs           │      │  (ZIP Deployment)    │
                          │  ├─ NGINX Logs         │      │  ├─ Session Mgmt     │
                          │  ├─ DynamoDB Metrics   │      │  ├─ Tool Execution   │
                          │  └─ CloudWatch CPU/    │      │  └─ Error Handling   │
                          │     Memory Metrics     │      └──────────────────────┘
                          └────────────────────────┘                │
                                       │                             │
                                       ▼                             ▼
                          ┌────────────────────────┐      ┌──────────────────────┐
                          │  AWS Services          │◀─────│  Analysis Results    │
                          │  ├─ CloudWatch Logs    │      │  & Validation        │
                          │  ├─ EC2 Instances      │      └──────────────────────┘
                          │  ├─ DynamoDB Tables    │
                          │  └─ CloudWatch Metrics │
                          └────────────────────────┘
```

### Key Components:

• **Multi-Tool Orchestration**: Agent coordinates 7 diagnostic tools (EC2, NGINX, DynamoDB, CloudWatch)
• **Secure Execution**: Lambda function with VPC access and IAM-based authentication
• **Real-time Analysis**: CloudWatch integration for live log and metric retrieval

## 0. Install Required Packages

Run this cell first to ensure all dependencies are installed.

```python
%pip install -q -r requirements.txt
print("✅ Workshop dependencies installed")
```

## 1. Import Required Modules

```python
# AWS SDK and configuration
import boto3
import json
import datetime

# Workshop configuration
from lab_helpers.config import MODEL_ID, AWS_REGION, AWS_PROFILE
from lab_helpers.constants import PARAMETER_PATHS

# Initialize AWS clients
cloudwatch_client = boto3.client("logs", region_name=AWS_REGION)
ec2_client = boto3.client("ec2", region_name=AWS_REGION)
lambda_client = boto3.client("lambda", region_name=AWS_REGION)
sts_client = boto3.client("sts", region_name=AWS_REGION)
agent_memory_client = boto3.client("bedrock-agentcore", region_name=AWS_REGION)

from lab_helpers.lab_01.fault_injection import initialize_fault_injection
from lab_helpers.parameter_store import put_parameter, get_parameter

# Initialize AWS clients and retrieve infrastructure resource IDs from SSM
print("Initializing fault injection utilities...")
resources = initialize_fault_injection(AWS_REGION, AWS_PROFILE)

print("\nDiscovered Infrastructure Resources:")

print(f"  Nginx Instance: {resources.get('nginx_instance_id', 'Not found')}")
print(f"  App Instance: {resources.get('app_instance_id', 'Not found')}")
print(f"  CRM Activities Table: {resources.get('crm_activities_table_name', 'Not found')}")
print(f"  CRM Customers Table: {resources.get('crm_customers_table_name', 'Not found')}")
print(f"  CRM Deals Table: {resources.get('crm_deals_table_name', 'Not found')}")

print("✅ Imports loaded")
```

## 2. Verify Prerequisites

```python
# Verify prerequisites are available
try:
    identity = sts_client.get_caller_identity()
    account_id = identity["Account"]

    from strands import Agent

    print(f"✅ Prerequisites verified: AWS Account {account_id}, bedrock-agentcore + strands available")
except Exception as e:
    print(f"❌ Error: {e}")
    print("Please ensure AWS credentials are configured and all packages are installed.")
```

## 3. Create Helper Tools

```python
from lab_helpers import mock_data

# Helper tool functions for log and metrics retrieval from Cloudwatch


def fetch_crm_app_logs(log_group_name="/aws/sre-workshop/crm-application", hours=2, use_mock=False):
    """Fetch CRM application logs from CloudWatch"""
    if use_mock:
        return mock_data.get_ec2_logs()

    try:
        now = datetime.datetime.now(datetime.timezone.utc)
        start_time = int((now - datetime.timedelta(hours=hours)).timestamp() * 1000)
        end_time = int(now.timestamp() * 1000)

        response = cloudwatch_client.filter_log_events(
            logGroupName=log_group_name,
            startTime=start_time,
            endTime=end_time,
            filterPattern="?error ?throttle",
            limit=500,
        )
        return response.get("events", [])
    except Exception as e:
        return [{"message": f"Error fetching EC2 logs: {str(e)}"}]


def fetch_ec2_logs(log_group_name="/aws/sre-workshop/application", hours=2, use_mock=False):
    """Fetch EC2 application logs from CloudWatch"""
    if use_mock:
        return mock_data.get_ec2_logs()

    try:
        now = datetime.datetime.now(datetime.timezone.utc)
        start_time = int((now - datetime.timedelta(hours=hours)).timestamp() * 1000)
        end_time = int(now.timestamp() * 1000)

        response = cloudwatch_client.filter_log_events(
            logGroupName=log_group_name,
            startTime=start_time,
            endTime=end_time,
            filterPattern="?error ?throttle",
            limit=500,
        )
        return response.get("events", [])
    except Exception as e:
        return [{"message": f"Error fetching EC2 logs: {str(e)}"}]


def fetch_nginx_error_logs(log_group_name="/aws/sre-workshop/nginx/error", hours=2, use_mock=False):
    """Fetch NGINX error logs from CloudWatch"""
    if use_mock:
        return mock_data.get_nginx_logs()

    try:
        now = datetime.datetime.now(datetime.timezone.utc)
        start_time = int((now - datetime.timedelta(hours=hours)).timestamp() * 1000)
        end_time = int(now.timestamp() * 1000)

        response = cloudwatch_client.filter_log_events(
            logGroupName=log_group_name,
            startTime=start_time,
            endTime=end_time,
            filterPattern="?error ?throttle",
            limit=500,
        )
        return response.get("events", [])
    except Exception as e:
        return [{"message": f"Error fetching NGINX error logs: {str(e)}"}]


def fetch_nginx_access_logs(log_group_name="/aws/sre-workshop/nginx/access", hours=24, use_mock=False):
    """Fetch NGINX access/eor logs from CloudWatch"""
    if use_mock:
        return mock_data.get_nginx_logs()

    try:
        now = datetime.datetime.now(datetime.timezone.utc)
        start_time = int((now - datetime.timedelta(hours=hours)).timestamp() * 1000)
        end_time = int(now.timestamp() * 1000)

        response = cloudwatch_client.filter_log_events(
            logGroupName=log_group_name,
            startTime=start_time,
            endTime=end_time,
            limit=100,
        )
        return response.get("events", [])
    except Exception as e:
        return [{"message": f"Error fetching NGINX access logs: {str(e)}"}]


def fetch_dynamodb_metrics(table_name, period_minutes=60, use_mock=False):
    """Fetch DynamoDB operation logs from CloudWatch"""
    if use_mock:
        return mock_data.get_dynamodb_logs()

    try:
        end_time = datetime.datetime.utcnow()
        start_time = end_time - datetime.timedelta(minutes=period_minutes)

        # Query all metrics in one call using get_metric_data
        cloudwatch = boto3.client("cloudwatch", region_name=AWS_REGION)
        response = cloudwatch.get_metric_data(
            MetricDataQueries=[
                {
                    "Id": "read_capacity",
                    "MetricStat": {
                        "Metric": {
                            "Namespace": "AWS/DynamoDB",
                            "MetricName": "ConsumedReadCapacityUnits",
                            "Dimensions": [{"Name": "TableName", "Value": table_name}],
                        },
                        "Period": 300,
                        "Stat": "Sum",
                    },
                },
                {
                    "Id": "write_capacity",
                    "MetricStat": {
                        "Metric": {
                            "Namespace": "AWS/DynamoDB",
                            "MetricName": "ConsumedWriteCapacityUnits",
                            "Dimensions": [{"Name": "TableName", "Value": table_name}],
                        },
                        "Period": 300,
                        "Stat": "Sum",
                    },
                },
                {
                    "Id": "throttled",
                    "MetricStat": {
                        "Metric": {
                            "Namespace": "AWS/DynamoDB",
                            "MetricName": "ThrottledRequests",
                            "Dimensions": [{"Name": "TableName", "Value": table_name}],
                        },
                        "Period": 300,
                        "Stat": "Sum",
                    },
                },
                {
                    "Id": "user_errors",
                    "MetricStat": {
                        "Metric": {
                            "Namespace": "AWS/DynamoDB",
                            "MetricName": "UserErrors",
                            "Dimensions": [{"Name": "TableName", "Value": table_name}],
                        },
                        "Period": 300,
                        "Stat": "Sum",
                    },
                },
                {
                    "Id": "system_errors",
                    "MetricStat": {
                        "Metric": {
                            "Namespace": "AWS/DynamoDB",
                            "MetricName": "SystemErrors",
                            "Dimensions": [{"Name": "TableName", "Value": table_name}],
                        },
                        "Period": 300,
                        "Stat": "Sum",
                    },
                },
                {
                    "Id": "latency",
                    "MetricStat": {
                        "Metric": {
                            "Namespace": "AWS/DynamoDB",
                            "MetricName": "SuccessfulRequestLatency",
                            "Dimensions": [{"Name": "TableName", "Value": table_name}],
                        },
                        "Period": 300,
                        "Stat": "Average",
                    },
                },
            ],
            StartTime=start_time,
            EndTime=end_time,
        )

        # Extract values from response
        result = {
            "table_name": table_name,
            "timestamp": end_time.isoformat(),
            "read_capacity": 0,
            "write_capacity": 0,
            "throttled_requests": 0,
            "user_errors": 0,
            "system_errors": 0,
            "avg_latency_ms": None,
        }

        for metric_result in response["MetricDataResults"]:
            metric_id = metric_result["Id"]
            values = metric_result["Values"]

            if values:
                if metric_id == "latency":
                    result["avg_latency_ms"] = sum(values) / len(values)
            else:
                result[metric_id.replace("_", "_")] = sum(values)

        return result
    except Exception as e:
        return [{"message": f"Error fetching DynamoDB logs: {str(e)}"}]


def get_cpu_metrics(instance_id, period_minutes=60):
    """Helper function to get a CloudWatch metric."""
    cloudwatch = boto3.client("cloudwatch", region_name=AWS_REGION)
    end_time = datetime.datetime.now(datetime.UTC)
    start_time = end_time - datetime.timedelta(minutes=period_minutes)

    response = cloudwatch.get_metric_data(
        MetricDataQueries=[
            {
                "Id": "m1",
                "MetricStat": {
                    "Metric": {
                        "Namespace": "AWS/EC2",
                        "MetricName": "CPUUtilization",
                        "Dimensions": [{"Name": "InstanceId", "Value": instance_id}],
                    },
                    "Period": 60,
                    "Stat": "Average",
                },
            }
        ],
        StartTime=start_time,
        EndTime=end_time,
    )

    values = response["MetricDataResults"][0]["Values"]
    return values[-1] if values else None


def get_memory_metrics(instance_id, period_minutes=60):
    """Helper function to get a CloudWatch metric."""
    cloudwatch = boto3.client("cloudwatch", region_name=AWS_REGION)
    end_time = datetime.datetime.now(datetime.UTC)

    start_time = end_time - datetime.timedelta(minutes=period_minutes)

    response = cloudwatch.get_metric_data(
        MetricDataQueries=[
            {
                "Id": "m1",
                "MetricStat": {
                    "Metric": {
                        "Namespace": "AWS/EC2",
                        "MetricName": "mem_used_percent",
                        "Dimensions": [{"Name": "InstanceId", "Value": instance_id}],
                    },
                    "Period": 60,
                    "Stat": "Average",
                },
            }
        ],
        StartTime=start_time,
        EndTime=end_time,
    )

    values = response["MetricDataResults"][0]["Values"]
    return values[-1] if values else None


print("✅ Helper tools defined")
```

## 4. Test Helper Tools

```python
# Test helper tools created in section 3

# 1. Get application resources
nginx_instance_id = resources.get("nginx_instance_id")
app_instance_id = resources.get("app_instance_id")
crm_activities_table_name = resources.get("crm_activities_table_name")
crm_customers_table_name = resources.get("crm_customers_table_name")
crm_deals_table_name = resources.get("crm_deals_table_name")

# 2. Testing the tools with some values
crm_app_logs = fetch_crm_app_logs()
print(crm_app_logs)
ec2_logs = fetch_ec2_logs()
print(ec2_logs)
nginx_error_logs = fetch_nginx_error_logs()
print(nginx_error_logs)
nginx_access_logs = fetch_nginx_access_logs()
print(nginx_access_logs)
ddb_logs = fetch_dynamodb_metrics(table_name=crm_customers_table_name)

print(ddb_logs)

cpu_metrics = get_cpu_metrics(instance_id=nginx_instance_id)
print(cpu_metrics)
memory_metrics = get_memory_metrics(instance_id=nginx_instance_id)
print(memory_metrics)

# print(f"✅ Helper tools verified: EC2({len(ec2_logs)}), NGINX({len(nginx_logs)}), DynamoDB({len(ddb_logs)}), CPU({len(cpu_metrics)}), Memory({len(memory_metrics)})")
```

## 5. Add Strands Framework Locally

**Goal:** Integrate diagnostic tools with Strands for intelligent agent-based reasoning.

**Approach:** Define Tool objects, create agent instance, test end-to-end locally.

**Key Learning:** How Strands orchestrates tool use for complex diagnostics.

```python
### 5.1: Define Strands Tools

from strands import tool

table_names = [key for key in resources.keys() if key.endswith("_table_name") and "crm" in key]
nginx_instance_id = resources.get("nginx_instance_id")
app_instance_id = resources.get("app_instance_id")
crm_activities_table_name = resources.get("crm_activities_table_name")
crm_customers_table_name = resources.get("crm_customers_table_name")
crm_deals_table_name = resources.get("crm_deals_table_name")


# Tool 1: CRM App Logs
@tool(description="Fetch CRM application logs to identify application errors and issues")
def get_crm_app_logs(limit: int = 10):
    """Fetch recent crm application logs"""
    crm_app_logs = fetch_crm_app_logs()
    return crm_app_logs


# Tool 2: EC2 Logs
@tool(description="Fetch EC2 application logs to identify application errors and issues")
def get_ec2_logs(limit: int = 10):
    """Fetch recent EC2 application logs"""
    ec2_logs = fetch_ec2_logs()
    return ec2_logs


# Tool 3: NGINX Error Logs
@tool(description="Fetch NGINX error logs")
def get_nginx_error_logs():
    """Fetch NGINX error logs"""
    nginx_error_logs = fetch_nginx_error_logs()
    return nginx_error_logs


# Tool 4: NGINX Access Logs
@tool(description="Fetch NGINX access logs")
def get_nginx_access_logs():
    """Fetch NGINX access/error logs"""
    nginx_access_logs = fetch_nginx_access_logs()
    return nginx_access_logs


# Tool 5: DynamoDB Metrics
@tool(description="Fetch DynamoDB metrics to detect throttling and service issues")
def get_dynamodb_metrics():
    """Fetch DynamoDB operation metrics"""
    ddb_metrics = ""
    for table in table_names:
        ddb_metrics += str(fetch_dynamodb_metrics(table_name=table))

    return ddb_metrics


# Tool 6: Application CPU Metrics
@tool(description="Fetch CloudWatch metrics (CPU) to analyze resource utilization for an instance")
def get_cloudwatch_cpu_metrics():
    """Fetch CloudWatch CPU metrics"""
    cpu_metrics = get_cpu_metrics(instance_id=nginx_instance_id) + get_cpu_metrics(instance_id=app_instance_id)
    return cpu_metrics


# Tool 7: Application memory Metrics
@tool(description="Fetch CloudWatch metrics (memory) to analyze resource utilization an instance")
def get_cloudwatch_memory_metrics():
    """Fetch CloudWatch memory metrics"""
    memory_metrics = get_memory_metrics(instance_id=nginx_instance_id) + get_memory_metrics(instance_id=app_instance_id)
    return memory_metrics


print("✅ Strands tools defined (7 tools)")
print("   • get crm logs")
print("   • get ec2 logs")
print("   • get nginx error logs")
print("   • get nginx accesslogs")
print("   • get dynamodb metrics")
print("   • get cloudwatch cpu metrics")
print("   • get cloudwatch memory metrics")
```

```python
### 5.2: Create Strands Agent

from strands import Agent

# Create agent with diagnostic tools
diagnostic_agent = Agent(
    name="system_diagnostics_agent",
    description="Expert system diagnostics agent for analyzing logs and metrics",
    model=MODEL_ID,
    tools=[
        get_crm_app_logs,
        get_ec2_logs,
        get_nginx_error_logs,
        get_nginx_access_logs,
        get_dynamodb_metrics,
        get_cloudwatch_cpu_metrics,
        get_cloudwatch_memory_metrics,
    ],
    system_prompt="""
    You are an expert system diagnostics agent. Your role is to analyze system logs and metrics to identify issues and their high level root causes(including AWS resources such as ARNs,IDs etc. causing them).

When diagnosing system issues:
1. Start by gathering relevant logs (EC2, NGINX, DynamoDB)
2. Check CloudWatch metrics to understand resource utilization patterns
3. Correlate findings across and provide a fairly detailed but consize assessment with severity
4. Once the analysis is complete, in the end share the data sources or points(EC2s, tables etc.), based on which these insights were generated. 
""",
)

print("✅ Strands agent created")
print("   Agent: system_diagnostics_agent")
print(f"   Model: {MODEL_ID}")
print("   Tools: 7 (EC2, NGINX, DynamoDB, CloudWatch)")
```

## 6. Test Strands Agent Locally

**Goal:** Verify agent reasoning and tool orchestration with mock data.

**Approach:** Invoke agent with diagnostic queries, trace tool calls and reasoning.

**Key Learning:** How agent selects and combines tools to solve problems.

```python
### 6.1: Test Agent with Diagnostic Queries


print("🧪 Testing Strands Agent Locally\n")
print("=" * 70)

test_queries = ["What critical issues do you see in the system? Provide a summary with key data points."]
diagnostics_agent_response = ""


async def test_agent():
    responses = []
    for i, query in enumerate(test_queries, 1):
        print(f"\n[Query {i}] {query}\n")

        try:
            # Run agent (async invocation)
            response = await diagnostic_agent.invoke_async(query)
            print(f"Agent Response:\n{response}\n")
            responses.append(response.message["content"][0]["text"])
        except Exception as e:
            print(f"❌ Error: {e}\n")
            responses.append(None)

    return responses


# Run async tests in Jupyter
diagnostics_agent_response = await test_agent()

print("=" * 70)
print("✅ Agent test complete")
```

## Write Diagnostics Analysis to Agent Memory

```python
nginx_instance_id = resources.get("nginx_instance_id")
app_instance_id = resources.get("app_instance_id")
crm_activities_table_name = resources.get("crm_activities_table_name")
crm_customers_table_name = resources.get("crm_customers_table_name")
crm_deals_table_name = resources.get("crm_deals_table_name")


memory_id = get_parameter(PARAMETER_PATHS["memory"]["memory_id"])
memory_session_id = get_parameter(PARAMETER_PATHS["memory"]["default_session_id"])

print(memory_id)
print(memory_session_id)
actor_id = "diagnostics_agent"

# Build payload from messages

payload = []
payload.append(
    {
        "conversational": {
            "content": {"text": "nginx EC2 instance id: " + nginx_instance_id + "."},
            "role": "ASSISTANT",
        }
    }
)
payload.append(
    {
        "conversational": {
            "content": {"text": "application EC2 instance id: " + app_instance_id + "."},
            "role": "ASSISTANT",
        }
    }
)
payload.append(
    {
        "conversational": {
            "content": {"text": "CRM Activities Table Name (DynamoDB): " + crm_activities_table_name + "."},
            "role": "ASSISTANT",
        }
    }
)
payload.append(
    {
        "conversational": {
            "content": {"text": "CRM Customers Table Name (DynamoDB): " + crm_customers_table_name + "."},
            "role": "ASSISTANT",
        }
    }
)
payload.append(
    {
        "conversational": {
            "content": {"text": "CRM Deals Table Name (DynamoDB): " + crm_deals_table_name + "."},
            "role": "ASSISTANT",
        }
    }
)
payload.append(
    {
        "conversational": {
            "content": {"text": "diagnostics agent analysis: " + str(diagnostics_agent_response)},
            "role": "ASSISTANT",
        }
    }
)

# Use provided timestamp or current UTC time
event_timestamp = datetime.datetime.now()

# Build request parameters
params = {
    "memoryId": memory_id,
    "actorId": actor_id,
    "sessionId": memory_session_id,
    "eventTimestamp": event_timestamp,
    "payload": payload,
}

response = agent_memory_client.create_event(**params)

# list events added to agent memory, to confirm successful write
params = {
    "memoryId": memory_id,
    "actorId": actor_id,
    "sessionId": memory_session_id,
    "includePayloads": True,
}

response = agent_memory_client.list_events(**params)

for event in response.get("events", []):
    event_id = event.get("eventId")
    # print(f"\nEvent: {event_id}")

    # Get all messages
    payload = event.get("payload", [])
    for i, item in enumerate(payload):
        if "conversational" in item:
            text = item["conversational"]["content"]["text"]
            role = item["conversational"]["role"]
            print(f"  Message {i}: [{actor_id}] {text}")
```

## 7. Create Strands Lambda Handler

**Goal:** Create a Lambda handler that wraps the Strands agent for AgentCore Gateway invocation.

**Approach:** Build handler that receives Gateway event context, invokes Strands agent, returns structured response.

**Key Learning:** How to bridge Strands agent with Lambda/Gateway infrastructure.

## 8. Deploy Strands Agent to Lambda (ZIP-Based - VPC Compatible)

**Goal:** Deploy proven Strands agent code to Lambda using ZIP packaging.

**Prerequisites:** Sections 5-7 complete and tested locally.

```python
print(AWS_REGION)
```

```python
### 8.1: Deploy Lambda
!chmod +x lab_helpers/lab_02/deploy.sh
!lab_helpers/lab_02/deploy.sh
```

## 9. Create AgentCore Gateway & Register Lambda Target

**Goal:** Set up Gateway infrastructure to coordinate with deployed Lambda function.

**Approach:** Build step-by-step using Boto3 for explicit control.

**Prerequisites:** Section 8 Lambda deployment complete.

**Key Learning:** How Gateway orchestrates tool invocation across Lambda functions via IAM auth.

**Architecture:**
```
User Request
    ↓
MCP Client (Section 10)
    ↓ (IAM auth)
Gateway (Section 9)
    ↓ (Gateway service role)
Lambda (Section 8)
    ↓
Strands Agent (Sections 5-7)
```

```python
### 9.0: Create Gateway Service Role

print("📋 Setting up Gateway service role...\n")

from lab_helpers.lab_02.gateway_setup import create_gateway_service_role
from lab_helpers.config import AWS_REGION

# Create IAM service role for Gateway
gateway_role_config = create_gateway_service_role(region_name=AWS_REGION)

print("\n✅ Gateway service role ready")
print(f"   Role ARN: {gateway_role_config['role_arn']}")
print("   Permissions: Lambda invocation + CloudWatch logs")

# Save for use in 9.1
gateway_role_arn = gateway_role_config["role_arn"]
```

```python
### 9.1: Create the Gateway

import boto3
from lab_helpers.config import AWS_REGION

# Initialize AgentCore client
agentcore_client = boto3.client("bedrock-agentcore-control", region_name=AWS_REGION)

print("📋 Creating AgentCore Gateway...")

try:
    # Get Cognito configuration from Parameter Store
    from lab_helpers.parameter_store import get_parameter
    from lab_helpers.constants import PARAMETER_PATHS

    user_pool_id = get_parameter(PARAMETER_PATHS["cognito"]["user_pool_id"], region_name=AWS_REGION)
    user_auth_client_id = get_parameter(PARAMETER_PATHS["cognito"]["user_auth_client_id"], region_name=AWS_REGION)

    # Construct discovery URL (same pattern as Labs 3 & 4)
    discovery_url = f"https://cognito-idp.{AWS_REGION}.amazonaws.com/{user_pool_id}/.well-known/openid-configuration"

    # Create gateway with CUSTOM_JWT authorizer (matches Labs 3 & 4)
    gateway = agentcore_client.create_gateway(
        name="aiml301-diagnostics-gateway",
        roleArn=gateway_role_arn,  # Gateway service role (from 9.0)
        protocolType="MCP",
        authorizerType="CUSTOM_JWT",  # Callers use Cognito JWT to invoke Gateway
        authorizerConfiguration={
            "customJWTAuthorizer": {
                "discoveryUrl": discovery_url,
                "allowedClients": [user_auth_client_id],
            }
        },
    )

    gateway_id = gateway["gatewayId"]
    gateway_url = gateway["gatewayUrl"]
    gateway_role_arn_actual = gateway["roleArn"]

    print("✅ Gateway created successfully")
    print(f"   Gateway ID: {gateway_id}")
    print(f"   Gateway URL: {gateway_url}")
    print(f"   Authorization: CUSTOM_JWT (Cognito User Pool: {user_pool_id})")
    print(f"   Allowed Clients: {user_auth_client_id}")
    print(f"   Service Role: {gateway_role_arn_actual}")
    print("      (used by Gateway to invoke Lambda targets)")

    # Save gateway configuration to Parameter Store for Lab 5
    from lab_helpers.parameter_store import put_parameter

    put_parameter("/aiml301/lab-02/gateway-id", gateway_id, region_name=AWS_REGION)
    put_parameter("/aiml301/lab-02/gateway-url", gateway_url, region_name=AWS_REGION)
    print("✅ Gateway configuration saved to Parameter Store")

    # Save for later use in this notebook
    gateway_config = {
        "gateway_id": gateway_id,
        "gateway_url": gateway_url,
        "region": AWS_REGION,
    }

except Exception as e:
    print(f"❌ Error: {e}")
    raise
```

```python
print("📝 Defining tool schema for Strands diagnostics agent...\n")

# The Gateway exposes a single high-level tool: "invoke_diagnostics_agent"
# This tool accepts natural language queries and invokes the Strands agent running in Lambda
# The agent internally orchestrates the 4 diagnostic tools (EC2, NGINX, DynamoDB, CloudWatch)

tool_schema = [
    {
        "name": "invoke_diagnostics_agent",
        "description": "Invoke the diagnostics agent to analyze system logs and metrics. The agent will orchestrate multiple diagnostic tools (EC2 logs, NGINX logs, DynamoDB logs, CloudWatch metrics) to identify issues and root causes.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Natural language diagnostic query (e.g., 'What are the main issues?', 'Analyze CPU and memory utilization')",
                }
            },
            "required": ["query"],
        },
    }
]

print("✅ Tool schema defined (1 high-level tool)")
print("   Tool: invoke_diagnostics_agent")
print("   Purpose: Natural language diagnostic queries")
print("   Internal: Agent orchestrates 4 diagnostic tools (EC2, NGINX, DynamoDB, CloudWatch)")
print("\n📐 Architecture:")
print("   Gateway Tool: invoke_diagnostics_agent (natural language interface)")
print("        ↓")
print("   Lambda Handler: Receives query, invokes Strands agent")
print("        ↓")
print("   Strands Agent: Orchestrates local tools")
print("        ├─ get_ec2_logs")
print("        ├─ get_nginx_logs")
print("        ├─ get_dynamodb_logs")
print("        └─ get_cloudwatch_metrics")
```

```python
import time

time.sleep(10)
```

```python
### 9.3: Register Lambda Function as Gateway Target

print("🔗 Registering Lambda as tool target...\n")

# Get Lambda function ARN from Parameter Store
ssm_client = boto3.client("ssm", region_name=AWS_REGION)
lambda_function_arn = ssm_client.get_parameter(Name="/aiml301/lab-02/lambda-function-arn")["Parameter"]["Value"]

print(f"Lambda ARN: {lambda_function_arn}\n")

try:
    # Register Lambda as a tool target
    target = agentcore_client.create_gateway_target(
        gatewayIdentifier=gateway_id,
        name="strands-diagnostics-agent",
        targetConfiguration={
            "mcp": {
                "lambda": {
                    "lambdaArn": lambda_function_arn,
                    "toolSchema": {
                        "inlinePayload": tool_schema  # Define tools available on this target
                    },
                }
            }
        },
        credentialProviderConfigurations=[
            {
                "credentialProviderType": "GATEWAY_IAM_ROLE"  # Lambda invoked with Gateway's IAM role
            }
        ],
    )

    target_id = target["targetId"]

    print("✅ Lambda target registered successfully")
    print(f"   Target ID: {target_id}")
    print("   Target Name: strands-diagnostics-agent")
    print(f"   Lambda ARN: {lambda_function_arn}")
    print("   Tools: 4 (get_ec2_logs, get_nginx_logs, get_dynamodb_logs, get_cloudwatch_metrics)")
    print("   Credentials: GATEWAY_IAM_ROLE (Lambda invoked with Gateway service role)")

    # Update gateway config with target info
    gateway_config["target_id"] = target_id
    gateway_config["lambda_arn"] = lambda_function_arn

    print("\n📊 Gateway Configuration Summary:")
    print(f"   Gateway ID: {gateway_config['gateway_id']}")
    print(f"   Gateway URL: {gateway_config['gateway_url']}")
    print(f"   Target ID: {gateway_config['target_id']}")
    print(f"   Region: {gateway_config['region']}")

except Exception as e:
    print(f"❌ Error registering target: {e}")
    raise
```

## 10. Test Gateway with Cognito JWT Authentication

**Goal:** Test the gateway using Cognito JWT token (same pattern as Labs 3, 4, and 5).

**Approach:**
1. Authenticate with Cognito to get JWT token
2. Use custom HTTP MCP client with JWT Bearer token
3. Test end-to-end flow

**Key Learning:** JWT authentication pattern used across all labs for consistency.

```python
# Retrieve Cognito configuration
print("🔐 Retrieving Cognito configuration...")
user_pool_id = get_parameter(PARAMETER_PATHS["cognito"]["user_pool_id"], region_name=AWS_REGION)
user_client_id = get_parameter(PARAMETER_PATHS["cognito"]["user_auth_client_id"], region_name=AWS_REGION)
test_username = get_parameter(PARAMETER_PATHS["cognito"]["test_user_email"], region_name=AWS_REGION)
test_password = get_parameter(PARAMETER_PATHS["cognito"]["test_user_password"], region_name=AWS_REGION)

print(f"  ✓ User Pool: {user_pool_id}")
print(f"  ✓ Client ID: {user_client_id}")
print(f"  ✓ Username: {test_username}")

# Authenticate with Cognito
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
print(f"  ✓ Expires in: {expires_in} seconds ({expires_in // 60} minutes)")
print(f"  ✓ Access Token (first 50 chars): {access_token[:50]}...")
print("\n📋 JWT tokens retrieved and ready for gateway authentication")
```

```python
### 10.2: Initialize MCP Client with JWT Token

from lab_helpers.lab_02.mcp_client import MCPClient

print("🔗 Initializing MCP Client for Gateway\n")

# Get Gateway URL from Section 9
gateway_url = gateway_config["gateway_url"]

# Create MCP client with JWT Bearer token
mcp_client = MCPClient(gateway_url, access_token)

# Initialize the MCP session
mcp_client.initialize()

print("\n✅ MCP Client ready")
print(f"   Gateway URL: {gateway_url}")
print("   Authentication: JWT Bearer Token")
print("   Session: Initialized")
print("\n📝 Client is ready to invoke tools via MCP protocol")
```

```python
### 10.3: List Available Tools on Gateway

print("📋 Listing tools available on Gateway\n")

# List tools via MCP protocol
tools = mcp_client.list_tools()

print(f"\n✅ Gateway is ready with {len(tools)} tool(s)")
```

### 10.3: Test Tool Invocation via Gateway

```python
### 10.4: Test Tool Invocation via Gateway

print("🧪 Testing tool invocation via Gateway MCP\n")
print("=" * 70)

# The Gateway prefixes tool names with target: "strands-diagnostics-agent___<tool_name>"
agent_tool_full = "strands-diagnostics-agent___invoke_diagnostics_agent"
test_query = "Provide a summary of critical issues with key data points and resource details."
test_args = {"query": test_query}

print(f"\n📤 Test Query: {test_query}\n")

try:
    # Call the tool using the MCP client
    result = mcp_client.call_tool(agent_tool_full, test_args)

    # Extract and display the response
    if "content" in result:
        print("\n" + "=" * 70)
        print("📥 Agent Response:")
        print("=" * 70)

        for item in result["content"]:
            if item.get("type") == "text":
                text = item.get("text", "")
                # Parse JSON if possible
                try:
                    import json

                    parsed = json.loads(text)
                    if "response" in parsed:
                        print(f"\n{parsed['response']}")
                    else:
                        print(f"\n{json.dumps(parsed, indent=2)}")
                except json.JSONDecodeError:
                    print(f"\n{text}")

    print("\n" + "=" * 70)
    print("✅ Tool invocation test complete")

except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback

    traceback.print_exc()
    print("\n" + "=" * 70)
```

## 11. Cleanup Lab 02 Resources

**Purpose:** Remove all resources created during Lab 02 for a fresh restart.

**Caution:** This will delete:
- AgentCore Gateway
- Lambda function
- ECR repository
- IAM roles
- Parameter Store entries
- CloudWatch logs

Run this section when you're done with Lab 02 or want to start fresh.

```python
### 11.1: Cleanup All Lab 02 Resources
# Only run if you do not plan to run Lab-03 next

from lab_helpers.config import AWS_REGION

# Run cleanup
# cleanup_lab_02(region_name=AWS_REGION)
```

## Summary: Lab 2 - Diagnostics Agent Architecture

✅ **Completed:**
1. ✓ Helper Tools - CloudWatch log & metric retrieval with mock data support
2. ✓ IAM Configuration - Lambda execution role with required permissions
3. ✓ Agent Architecture - Strands agent for diagnostics

**Workflow Summary:**
```
User Request
    ↓
AgentCore Gateway
    ↓
Lambda Function (ECR Container)
    ↓
Strands Agent + Tools
    ├─ fetch_ec2_logs() [mock/live]
    ├─ fetch_nginx_logs() [mock/live]
    ├─ fetch_dynamodb_logs() [mock/live]
    └─ fetch_metrics() [mock/live]
    ↓
Analysis Output
    ↓
Back to Gateway
```

**Next: Lab 3 - Remediation Agent** (`Lab-03-remediation-agent.ipynb`)
- Approval workflow for remediation actions
- Code Interpreter for safe script execution
- Integration with Diagnostics Agent findings
