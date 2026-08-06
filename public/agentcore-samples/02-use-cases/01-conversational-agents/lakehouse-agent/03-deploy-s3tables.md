# Lakehouse Agent - Deploy S3 Tables Database

This notebook deploys the S3 Tables database and tables for the lakehouse data layer.

**What this notebook does:**
- Uses the S3 bucket created in prerequisites setup
- Integrates S3 Tables with Lake Formation (requires Lake Formation admin permissions)
- Creates S3 Tables bucket and namespace
- Creates tables: `claims` and `users` with Iceberg format
- Uploads sample claims and users data
- Configures Lake Formation permissions for tenant roles
- Verifies deployment

**Prerequisites:**
- ✅ Completed `01-deploy-cognito.ipynb`
- ✅ Completed `02-deploy-iam-roles.ipynb` (IAM tenant roles must exist)
- ✅ SSM parameters configured with `/app/lakehouse-agent/` prefix
- ✅ AWS credentials with S3 Tables, Lake Formation, and Glue permissions
- ✅ **Your AWS role must have Lake Formation administrator permissions**

**IAM Permissions Required:**
- `s3tables:*`
- `s3:*`
- `glue:*`
- `lakeformation:*` (including Lake Formation admin role)
- `iam:CreateRole`, `iam:PutRolePolicy`, `iam:GetRole`
- `ssm:GetParameter`, `ssm:PutParameter`

**Duration:** ~15 minutes

```python
# AWS Initialization - Load credentials and create session
from utils.notebook_init import init_aws
import subprocess

# This will:
# 1. Load credentials from .env file (if it exists)
# 2. Create and validate AWS session (env vars take precedence over SSO)
# 3. Return session, region, and account_id for use in this notebook
session, region, account_id = init_aws()

print("✅ Ready to proceed with AWS operations")
print(f"   Account ID: {account_id}")
print(f"   Region: {region}")
```

## Step 1: Validate Prerequisites

Check that IAM tenant roles from the previous notebook exist.

```python
# Initialize AWS clients using the validated session from cell 1
ssm_client = session.client("ssm", region_name=region)

# Check required parameters - IAM roles must exist before S3 Tables setup
print("🔍 Validating prerequisites...\n")

required_params = [
    "/app/lakehouse-agent/roles/lakehouse-policyholders-role",
    "/app/lakehouse-agent/roles/lakehouse-adjusters-role",
    "/app/lakehouse-agent/roles/lakehouse-administrators-role",
]

missing = []

for param in required_params:
    try:
        response = ssm_client.get_parameter(Name=param)
        value = response["Parameter"]["Value"]
        print(f"✅ {param}")
        print(f"   {value}")
    except ssm_client.exceptions.ParameterNotFound:
        print(f"❌ {param}: NOT FOUND")
        missing.append(param)

if missing:
    print(f"\n❌ Missing parameters: {', '.join(missing)}")
    print("Please run 02-deploy-iam-roles.ipynb first")
else:
    print("\n✅ All prerequisites validated!")
```

## Step 2: Grant Lake Formation Admin Permissions (One-time Setup)

Before proceeding, your AWS role needs Lake Formation administrator permissions to create the federated catalog.

**Option 1: AWS Console (Recommended)**
1. Go to [AWS Lake Formation console](https://console.aws.amazon.com/lakeformation/)
2. Navigate to "Administrative roles and tasks" → "Data lake administrators"
3. Click "Choose administrators"
4. Add your IAM role ARN (check the output from cell 1 for your role)
5. Click "Save"

**Option 2: AWS CLI**
```bash
# Get current Lake Formation admins
aws lakeformation get-data-lake-settings --region {region}

# Add your role (replace with your role ARN from cell 1)
aws lakeformation put-data-lake-settings \
  --data-lake-settings '{
    "DataLakeAdmins": [
      {
        "DataLakePrincipalIdentifier": "arn:aws:iam::{account_id}:role/YourRole"
      }
    ]
  }' \
  --region {region}
```

**After granting permissions, continue to the next cell.**

## Step 3: Integrate S3 Tables with Lake Formation

This step creates the Lake Formation integration for S3 Tables:
- Creates IAM role for Lake Formation data access
- Registers S3 Tables bucket with Lake Formation (with federation enabled)
- Creates federated catalog `s3tablescatalog` for S3 Tables

**Important:** Make sure you completed Step 2 (Lake Formation admin permissions) before running this cell.

```python
print("🚀 Integrating S3 Tables with Lake Formation...\n")

result = subprocess.run(
    ["python", "integrate_s3tables_lakeformation.py"],
    cwd="deployment/3-s3tables-setup",
    capture_output=True,
    text=True,
)

print(result.stdout)

if result.returncode != 0:
    print("❌ Error during Lake Formation integration:")
    print(result.stderr)
    print("\n⚠️  Common issue: Your AWS role needs Lake Formation administrator permissions.")
    print("   Please complete Step 2 above and try again.")
else:
    print("\n✅ Lake Formation integration completed successfully!")
    print("\n📋 Created:")
    print("   • Lake Formation data access role")
    print("   • Federated catalog: s3tablescatalog")
    print("   • S3 Tables registration with Lake Formation")
```

## Step 4: Create S3 Tables

Create the S3 Tables bucket, namespace, and tables.

**Note**: The S3 bucket for query results was already created in the prerequisites notebook.

```python
print("🚀 Creating S3 Tables...\n")

print("📦 The setup script will create an S3 bucket and S3 Tables automatically")
print()

# Run setup_s3tables.py
result = subprocess.run(
    ["python", "setup_s3tables.py"],
    cwd="deployment/3-s3tables-setup",
    capture_output=True,
    text=True,
)

print(result.stdout)

if result.returncode != 0:
    print("❌ Error during S3 Tables setup:")
    print(result.stderr)
else:
    print("\n✅ S3 Tables setup completed successfully!")
    print("\n💾 Database and tables created with Iceberg format")
```

## Step 5: Configure Lake Formation Permissions

Set up Lake Formation permissions for tenant roles (policyholders, adjusters, administrators).
This must be done BEFORE loading data so the admin role has INSERT permissions.

```python
print("🔐 Configuring Lake Formation permissions...\n")

result = subprocess.run(
    ["python", "setup_lakeformation_permissions.py"],
    cwd="deployment/3-s3tables-setup",
    capture_output=True,
    text=True,
)

print(result.stdout)

if result.returncode != 0:
    print("❌ Error configuring Lake Formation permissions:")
    print(result.stderr)
else:
    print("\n✅ Lake Formation permissions configured successfully!")
```

## Step 6: Load Sample Data

Load sample claims and users data via Athena.
The script assumes the administrators role (created in Step 2) which has Lake Formation permissions from Step 5.

```python
print("📤 Loading sample data...\n")

result = subprocess.run(
    ["python", "load_sample_data.py"],
    cwd="deployment/3-s3tables-setup",
    capture_output=True,
    text=True,
)

print(result.stdout)

if result.returncode != 0:
    print("❌ Error loading sample data:")
    print(result.stderr)
else:
    print("\n✅ Sample data loaded successfully!")
```

## Step 7: Validate Deployment

Verify that the database and tables were created successfully.

```python
print("🔍 Validating S3 Tables deployment...\n")

# Use session from cell 1 to create AWS clients
s3tables_client = session.client("s3tables", region_name=region)
glue_client = session.client("glue", region_name=region)

# Get catalog name and database name from SSM
try:
    catalog_response = ssm_client.get_parameter(Name="/app/lakehouse-agent/catalog-name")
    catalog_name = catalog_response["Parameter"]["Value"]
    print(f"📚 Using catalog: {catalog_name}")
except:
    catalog_name = "s3tablescatalog"
    print(f"⚠️  Using default catalog: {catalog_name}")

try:
    db_response = ssm_client.get_parameter(Name="/app/lakehouse-agent/database-name")
    database_name = db_response["Parameter"]["Value"]
except:
    database_name = "lakehouse_data"
print(f"📚 Using database: {database_name}")

# For S3 Tables federated catalog, CatalogId = account_id:catalog_name
catalog_id = f"{account_id}:{catalog_name}"
print(f"📚 Catalog ID: {catalog_id}")

# Check database exists
try:
    response = glue_client.get_database(CatalogId=catalog_id, Name=database_name)
    print(f"✅ Database '{database_name}' exists in catalog '{catalog_name}'")
except glue_client.exceptions.EntityNotFoundException:
    print(f"❌ Database '{database_name}' not found in catalog '{catalog_name}'")

# Check tables exist
try:
    response = glue_client.get_tables(CatalogId=catalog_id, DatabaseName=database_name)
    tables = response["TableList"]

    print(f"\n📋 Tables in {catalog_name}.{database_name}:")
    for table in tables:
        table_name = table["Name"]
        column_count = len(table["StorageDescriptor"]["Columns"])
        print(f"   • {table_name} ({column_count} columns)")

    if len(tables) >= 2:
        print("\n✅ All tables created successfully")
    else:
        print(f"\n⚠️  Expected 2 tables, found {len(tables)}")

except Exception as e:
    print(f"❌ Error checking tables: {e}")
```

## Next Steps

✅ **S3 Tables Database Deployment Complete!**

Your S3 Tables database is now set up with:
- Lake Formation integration with federated catalog `s3tablescatalog`
- Database: S3 Tables bucket with namespace
- Tables: `claims` (sample claims data), `users` (test users)
- Format: Apache Iceberg
- S3 data location: S3 bucket created by setup script
- Lake Formation permissions configured for tenant roles

**Next:** Run `04-deploy-mcp-server.ipynb` to deploy the MCP server.

### Test Queries

You can test the deployment with these queries using Athena (use catalog `s3tablescatalog`):

```sql
-- Count all claims
SELECT COUNT(*) as total_claims 
FROM s3tablescatalog.lakehouse_data.claims;

-- View claims for policyholder001
SELECT claim_id, claim_type, claim_status, claim_amount 
FROM s3tablescatalog.lakehouse_data.claims 
WHERE user_id = 'policyholder001@example.com';

-- View all users
SELECT * FROM s3tablescatalog.lakehouse_data.users;
```

### Verify SSM Parameters

The setup scripts automatically save configuration to SSM:
```bash
aws ssm get-parameter --name /app/lakehouse-agent/s3-bucket-name
aws ssm get-parameter --name /app/lakehouse-agent/table-bucket-name
aws ssm get-parameter --name /app/lakehouse-agent/catalog-name
aws ssm get-parameter --name /app/lakehouse-agent/s3tables-catalog-name
aws ssm get-parameter --name /app/lakehouse-agent/lakeformation-role-arn
```
