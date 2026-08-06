# Lakehouse Agent - Optional Cleanup

This notebook cleans up all AWS resources created by notebooks 00-07.

**⚠️ WARNING: This will delete all resources created during deployment!**

Each deployment step has a dedicated cleanup script. This notebook runs them in reverse order.

**Prerequisites:**
- AWS credentials configured
- Python 3.10 or later

```python
# AWS Initialization
from utils.notebook_init import init_aws
import subprocess

session, region, account_id = init_aws()

print("✅ Ready to clean up")
print(f"   Account ID: {account_id}")
print(f"   Region: {region}")
```

## Step 1: Delete Lakehouse Agent Runtime

Deletes the agent runtime, IAM role, ECR repository, and CodeBuild project.

```python
result = subprocess.run(
    ["python", "cleanup_agent.py"],  # , '--keep-ssm'
    cwd="deployment/6-lakehouse-agent",
    capture_output=True,
    text=True,
)
print(result.stdout)
if result.returncode != 0:
    print(f"⚠️  Errors:\n{result.stderr}")
```

## Step 2: Delete Gateway & Interceptors

Deletes the gateway, targets, OAuth providers, Lambda interceptors, DynamoDB mapping table, and IAM roles.

```python
result = subprocess.run(
    ["python", "cleanup_gateway.py"],  # , '--keep-ssm'
    cwd="deployment/5-gateway-setup",
    capture_output=True,
    text=True,
)
print(result.stdout)
if result.returncode != 0:
    print(f"⚠️  Errors:\n{result.stderr}")
```

## Step 3: Delete MCP Server Runtime

Deletes the MCP server runtime, IAM role, ECR repository, and CodeBuild project.

```python
result = subprocess.run(
    ["python", "cleanup_runtime.py"],  # use '--keep-ssm' if you intend to prese
    cwd="deployment/4-mcp-lakehouse-server",
    capture_output=True,
    text=True,
)
print(result.stdout)
if result.returncode != 0:
    print(f"⚠️  Errors:\n{result.stderr}")
```

## Step 4: Delete S3 Tables & Lake Formation

Deletes S3 Tables bucket, namespace, tables, federated catalog, and Lake Formation registration.

```python
result = subprocess.run(
    ["python", "cleanup_s3tables.py"],  #'--keep-ssm'
    cwd="deployment/3-s3tables-setup",
    capture_output=True,
    text=True,
)
print(result.stdout)
if result.returncode != 0:
    print(f"⚠️  Errors:\n{result.stderr}")
```

## Step 5: Delete IAM Tenant Roles

Deletes policyholders, adjusters, administrators roles and the Lake Formation data access role.

```python
result = subprocess.run(
    ["python", "cleanup_iam_roles.py"],  # , '--keep-ssm'
    cwd="deployment/2-lakehouse-tenant-roles-setup",
    capture_output=True,
    text=True,
)
print(result.stdout)
if result.returncode != 0:
    print(f"⚠️  Errors:\n{result.stderr}")
```

## Step 6: Delete Cognito

Deletes User Pool, domain, post-auth Lambda, and login audit DynamoDB table.

```python
result = subprocess.run(
    ["python", "cleanup_cognito.py"],  # , '--keep-ssm'
    cwd="deployment/1-cognito-setup",
    capture_output=True,
    text=True,
)
print(result.stdout)
if result.returncode != 0:
    print(f"⚠️  Errors:\n{result.stderr}")
```

## Step 7: Delete S3 Bucket (Optional)

**⚠️ This permanently deletes all data in the S3 bucket!**

Set `DELETE_S3_BUCKET = True` to enable.

```python
DELETE_S3_BUCKET = True  # False  # Change to True to enable

if not DELETE_S3_BUCKET:
    print("⏭️  S3 bucket deletion is DISABLED")
    print("   Set DELETE_S3_BUCKET = True to enable")
else:
    ssm_client = session.client("ssm", region_name=region)
    s3_client = session.client("s3", region_name=region)
    try:
        bucket_name = ssm_client.get_parameter(Name="/app/lakehouse-agent/s3-bucket-name")["Parameter"]["Value"]
        print(f"Deleting all objects in: {bucket_name}")
        paginator = s3_client.get_paginator("list_objects_v2")
        for page in paginator.paginate(Bucket=bucket_name):
            if "Contents" in page:
                objects = [{"Key": obj["Key"]} for obj in page["Contents"]]
                s3_client.delete_objects(Bucket=bucket_name, Delete={"Objects": objects})
        s3_client.delete_bucket(Bucket=bucket_name)
        print(f"✅ Deleted S3 bucket: {bucket_name}")
    except Exception as e:
        print(f"❌ Error: {e}")
```

## Step 8: Delete All SSM Parameters

```python
ssm_client = session.client("ssm", region_name=region)

print("🗑️  Deleting all SSM parameters...\n")
try:
    paginator = ssm_client.get_paginator("describe_parameters")
    params_to_delete = []
    for page in paginator.paginate(
        ParameterFilters=[{"Key": "Name", "Option": "BeginsWith", "Values": ["/app/lakehouse-agent/"]}]
    ):
        params_to_delete.extend([p["Name"] for p in page["Parameters"]])

    if params_to_delete:
        for i in range(0, len(params_to_delete), 10):
            batch = params_to_delete[i : i + 10]
            ssm_client.delete_parameters(Names=batch)
            for p in batch:
                print(f"  ✅ Deleted: {p}")
        print(f"\n✅ Deleted {len(params_to_delete)} SSM parameters")
    else:
        print("⏭️  No SSM parameters found")
except Exception as e:
    print(f"❌ Error: {e}")
```

## Summary

```python
print("=" * 60)
print("🎉 CLEANUP COMPLETE")
print("=" * 60)
print()
print("Resources cleaned up:")
print("  • Lakehouse Agent Runtime + IAM role + ECR")
print("  • Gateway + targets + OAuth providers + interceptors")
print("  • MCP Server Runtime + IAM role + ECR")
print("  • S3 Tables + Lake Formation integration")
print("  • IAM tenant roles")
print("  • Cognito User Pool + post-auth Lambda + login audit DynamoDB table")
print("  • SSM parameters")
print()
print("Manual cleanup (if needed):")
print("  • CloudWatch Log Groups: /aws/bedrock-agentcore/runtime/*")
print("  • CloudWatch Log Groups: /aws/lambda/lakehouse-*")
```
