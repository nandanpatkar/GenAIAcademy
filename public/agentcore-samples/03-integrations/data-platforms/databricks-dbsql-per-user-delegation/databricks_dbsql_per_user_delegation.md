# Databricks Per-User Delegation with AgentCore Gateway Interceptor

This notebook demonstrates per-user identity propagation from **Entra ID** to **Databricks** via an AgentCore Gateway **REQUEST interceptor** and **RFC 8693 OAuth Token Exchange**.

The [existing M2M sample](../databricks-dbsql-agentcore-gateway) uses a service principal for all requests. This sample extends it so each request carries the individual user's identity — enabling Unity Catalog to enforce per-user ACL.

## Prerequisites

1. AWS credentials configured
2. Databricks workspace on AWS with Unity Catalog
3. Databricks service principal with OAuth secret
4. Entra ID app registration (`Allow public client flows` enabled for testing)
5. Databricks federation policy trusting the Entra tenant
6. Databricks user matching the Entra `email` claim

```python
# Install dependencies
!pip install -q boto3 httpx bedrock-agentcore-starter-toolkit strands-agents
```

## Step 1: Configure credentials

```python
# Databricks
DATABRICKS_HOST = "https://<workspace>.cloud.databricks.com"  # Your workspace URL
DATABRICKS_SP_CLIENT_ID = "<sp-client-id>"  # Service principal (for tool sync)
DATABRICKS_SP_CLIENT_SECRET = "<sp-oauth-secret>"  # SP OAuth secret

# Entra ID
ENTRA_TENANT_ID = "<tenant-id>"
ENTRA_APP_CLIENT_ID = "<app-client-id>"  # App registration client ID

# AWS
REGION = "us-east-1"
```

## Step 2: Create Gateway with Entra ID inbound auth

```python
import boto3
import json
import time

agentcore = boto3.client("bedrock-agentcore-control", region_name=REGION)
iam = boto3.client("iam")

# Entra ID v1.0 discovery URL (matches device code flow tokens)
entra_discovery = f"https://login.microsoftonline.com/{ENTRA_TENANT_ID}/.well-known/openid-configuration"

gateway = agentcore.create_gateway(
    name="databricks-per-user",
    roleArn="arn:aws:iam::"
    + boto3.client("sts").get_caller_identity()["Account"]
    + ":role/AgentCoreGatewayExecutionRole",
    protocolType="MCP",
    authorizerType="CUSTOM_JWT",
    authorizerConfiguration={
        "customJWTAuthorizer": {
            "discoveryUrl": entra_discovery,
            "allowedAudience": [ENTRA_APP_CLIENT_ID],
            # Note: omit allowedClients for Entra v1.0 tokens
        }
    },
)

gateway_id = gateway["gatewayId"]
print(f"Gateway: {gateway_id}")

# Wait for READY
for _ in range(24):
    gw = agentcore.get_gateway(gatewayIdentifier=gateway_id)
    if gw.get("status") == "READY":
        break
    time.sleep(5)
print(f"Status: {gw['status']}")
print(f"URL: {gw['gatewayUrl']}")
```

## Step 3: Create OAuth2 credential provider (SP for tool sync)

```python
token_endpoint = f"{DATABRICKS_HOST}/oidc/v1/token"

try:
    cp = agentcore.create_oauth2_credential_provider(
        name="databricks-per-user-sp",
        credentialProviderVendor="CustomOauth2",
        oauth2ProviderConfigInput={
            "customOauth2ProviderConfig": {
                "oauthDiscovery": {
                    "authorizationServerMetadata": {
                        "issuer": DATABRICKS_HOST,
                        "tokenEndpoint": token_endpoint,
                        "authorizationEndpoint": token_endpoint,
                    }
                },
                "clientId": DATABRICKS_SP_CLIENT_ID,
                "clientSecret": DATABRICKS_SP_CLIENT_SECRET,
            }
        },
    )
except agentcore.exceptions.ConflictException:
    cp = agentcore.get_oauth2_credential_provider(name="databricks-per-user-sp")

provider_arn = cp["credentialProviderArn"]
secret_arn = cp.get("clientSecretArn", {}).get("secretArn", "")
print(f"Credential provider: {provider_arn}")
```

## Step 4: Deploy interceptor Lambda

```python
import io
import zipfile

INTERCEPTOR_CODE = """
import json, urllib.request, urllib.parse, os, base64, time

DATABRICKS_HOST = os.environ.get("DATABRICKS_HOST")

def decode_jwt_claims(token):
    try:
        payload = token.split(".")[1]
        payload += "=" * (4 - len(payload) % 4)
        return json.loads(base64.urlsafe_b64decode(payload))
    except: return {}

def handler(event, context):
    mcp = event.get("mcp", {})
    headers = mcp.get("gatewayRequest", {}).get("headers", {})
    body = mcp.get("gatewayRequest", {}).get("body", {})

    auth = headers.get("Authorization", "")
    entra_jwt = auth.replace("Bearer ", "") if auth else ""

    # Pass through for tools/list or if no token
    if body.get("method") == "tools/list" or not entra_jwt:
        return {"interceptorOutputVersion": "1.0",
                "mcp": {"transformedGatewayRequest": {"body": body}}}

    # Log inbound identity
    claims = decode_jwt_claims(entra_jwt)
    print(f"[STEP 3] Entra JWT | email={claims.get(\\"email\\")} name={claims.get(\\"name\\")}")

    # RFC 8693 token exchange
    print(f"[STEP 4] Token exchange | endpoint={DATABRICKS_HOST}/oidc/v1/token")
    start = time.time()
    try:
        data = urllib.parse.urlencode({
            "grant_type": "urn:ietf:params:oauth:grant-type:token-exchange",
            "subject_token": entra_jwt,
            "subject_token_type": "urn:ietf:params:oauth:token-type:jwt",
            "scope": "all-apis",
        }).encode()
        req = urllib.request.Request(f"{DATABRICKS_HOST}/oidc/v1/token",
            data=data, headers={"Content-Type": "application/x-www-form-urlencoded"}, method="POST")
        db_token = json.loads(urllib.request.urlopen(req, timeout=10).read())["access_token"]
        print(f"[STEP 5] Token received | elapsed={int((time.time()-start)*1000)}ms")
        print(f"[STEP 6] Overriding Authorization header")
        return {"interceptorOutputVersion": "1.0",
                "mcp": {"transformedGatewayRequest": {
                    "headers": {"Authorization": f"Bearer {db_token}"}, "body": body}}}
    except Exception as e:
        print(f"[STEP 4] Exchange FAILED: {e}")
        return {"interceptorOutputVersion": "1.0",
                "mcp": {"transformedGatewayRequest": {"body": body}}}
"""

# Package Lambda
buf = io.BytesIO()
with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
    zf.writestr("lambda_function.py", INTERCEPTOR_CODE)
buf.seek(0)

lambda_client = boto3.client("lambda", region_name=REGION)
fn_name = "databricks-per-user-interceptor"

# Create or update Lambda
try:
    role_arn = iam.get_role(RoleName="GatewayInterceptorRole")["Role"]["Arn"]
except:
    role = iam.create_role(
        RoleName="GatewayInterceptorRole",
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
    iam.attach_role_policy(
        RoleName="GatewayInterceptorRole",
        PolicyArn="arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
    )
    role_arn = role["Role"]["Arn"]
    time.sleep(10)

try:
    resp = lambda_client.create_function(
        FunctionName=fn_name,
        Runtime="python3.12",
        Role=role_arn,
        Handler="lambda_function.handler",
        Code={"ZipFile": buf.read()},
        Timeout=30,
        Environment={"Variables": {"DATABRICKS_HOST": DATABRICKS_HOST}},
    )
    fn_arn = resp["FunctionArn"]
except lambda_client.exceptions.ResourceConflictException:
    buf.seek(0)
    lambda_client.update_function_code(FunctionName=fn_name, ZipFile=buf.read())
    lambda_client.update_function_configuration(
        FunctionName=fn_name,
        Environment={"Variables": {"DATABRICKS_HOST": DATABRICKS_HOST}},
    )
    fn_arn = lambda_client.get_function(FunctionName=fn_name)["Configuration"]["FunctionArn"]

try:
    lambda_client.add_permission(
        FunctionName=fn_name,
        StatementId="AllowGatewayInvoke",
        Action="lambda:InvokeFunction",
        Principal="bedrock-agentcore.amazonaws.com",
    )
except:
    pass

print(f"Interceptor Lambda: {fn_arn}")
```

## Step 5: Configure Gateway IAM + attach interceptor

```python
# IAM permissions for credential provider + interceptor
gw = agentcore.get_gateway(gatewayIdentifier=gateway_id)
role_name = gw["roleArn"].split("/")[-1]

iam.put_role_policy(
    RoleName=role_name,
    PolicyName="DatabricksPerUserAccess",
    PolicyDocument=json.dumps(
        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": "bedrock-agentcore:GetWorkloadAccessToken",
                    "Resource": [
                        f"arn:aws:bedrock-agentcore:{REGION}:*:workload-identity-directory/default",
                        f"arn:aws:bedrock-agentcore:{REGION}:*:workload-identity-directory/default/workload-identity/*",
                    ],
                },
                {
                    "Effect": "Allow",
                    "Action": "bedrock-agentcore:GetResourceOauth2Token",
                    "Resource": provider_arn,
                },
                {
                    "Effect": "Allow",
                    "Action": "secretsmanager:GetSecretValue",
                    "Resource": secret_arn,
                },
                {
                    "Effect": "Allow",
                    "Action": "lambda:InvokeFunction",
                    "Resource": fn_arn,
                },
            ],
        }
    ),
)
time.sleep(10)

# Attach interceptor
agentcore.update_gateway(
    gatewayIdentifier=gateway_id,
    name=gw["name"],
    roleArn=gw["roleArn"],
    protocolType="MCP",
    authorizerType="CUSTOM_JWT",
    authorizerConfiguration=gw["authorizerConfiguration"],
    interceptorConfigurations=[
        {
            "interceptor": {"lambda": {"arn": fn_arn}},
            "interceptionPoints": ["REQUEST"],
            "inputConfiguration": {"passRequestHeaders": True},
        }
    ],
)

for _ in range(12):
    g = agentcore.get_gateway(gatewayIdentifier=gateway_id)
    if g.get("status") == "READY":
        break
    time.sleep(5)
print(f"Gateway: {g['status']} with interceptor")
```

## Step 6: Add Databricks DBSQL MCP server target

```python
mcp_url = f"{DATABRICKS_HOST}/api/2.0/mcp/sql"

target = agentcore.create_gateway_target(
    gatewayIdentifier=gateway_id,
    name="databricks-sql",
    description="Databricks SQL MCP — per-user via interceptor",
    targetConfiguration={"mcp": {"mcpServer": {"endpoint": mcp_url}}},
    credentialProviderConfigurations=[
        {
            "credentialProviderType": "OAUTH",
            "credentialProvider": {
                "oauthCredentialProvider": {
                    "providerArn": provider_arn,
                    "grantType": "CLIENT_CREDENTIALS",
                    "scopes": ["all-apis"],
                }
            },
        }
    ],
)
target_id = target["targetId"]

# Wait + sync
for _ in range(24):
    t = agentcore.get_gateway_target(gatewayIdentifier=gateway_id, targetId=target_id)
    if t.get("status") not in ("Creating", "Updating", "CREATING"):
        break
    time.sleep(5)

agentcore.synchronize_gateway_targets(gatewayIdentifier=gateway_id, targetIdList=[target_id])
print(f"Target: {target_id} ({t.get('status')}) — tools synced")
```

## Step 7: Test — per-user delegation

This uses the Entra device code flow to get a user token, then calls the Gateway.
The interceptor exchanges the Entra JWT for a Databricks user token via RFC 8693.

```python
import httpx
import base64

# Device code flow — get user token
resp = httpx.post(
    f"https://login.microsoftonline.com/{ENTRA_TENANT_ID}/oauth2/v2.0/devicecode",
    data={
        "client_id": ENTRA_APP_CLIENT_ID,
        "scope": f"{ENTRA_APP_CLIENT_ID}/.default openid profile",
    },
)
data = resp.json()
print("🔐 Go to: https://microsoft.com/devicelogin")
print(f"   Code:  {data['user_code']}")
input("\nPress Enter after you've signed in...")

resp = httpx.post(
    f"https://login.microsoftonline.com/{ENTRA_TENANT_ID}/oauth2/v2.0/token",
    data={
        "client_id": ENTRA_APP_CLIENT_ID,
        "grant_type": "urn:ietf:params:oauth:grant-type:device_code",
        "device_code": data["device_code"],
    },
)
entra_token = resp.json()["access_token"]

# Decode and show user identity
payload = entra_token.split(".")[1]
payload += "=" * (4 - len(payload) % 4)
claims = json.loads(base64.urlsafe_b64decode(payload))
print(f"\n✅ Entra user: {claims.get('name')} ({claims.get('email')})")
print(f"   Issuer: {claims.get('iss')}")
print(f"   Audience: {claims.get('aud')}")
```

```python
gateway_url = gw["gatewayUrl"]
headers = {"Authorization": f"Bearer {entra_token}", "Content-Type": "application/json"}

# List tools
resp = httpx.post(
    gateway_url,
    headers=headers,
    json={"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}},
    timeout=30,
)
tools = resp.json().get("result", {}).get("tools", [])
print(f"Tools: {[t['name'] for t in tools]}")

# Query as user
print("\nQuerying Databricks as YOU...")
resp = httpx.post(
    gateway_url,
    headers=headers,
    json={
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {
            "name": "databricks-sql___execute_sql_read_only",
            "arguments": {"query": "SELECT current_user() as who_am_i"},
        },
    },
    timeout=120,
)

body = resp.json()
text = body.get("result", {}).get("content", [{}])[0].get("text", "")
if text and text.startswith("{"):
    parsed = json.loads(text)
    if parsed.get("status", {}).get("state") == "SUCCEEDED":
        rows = parsed.get("result", {}).get("data_array", [])
        print(f"\n✅ current_user(): {rows}")
        if "@" in str(rows):
            print("\n🎉 PER-USER DELEGATION WORKS!")
            print("   The Entra JWT was exchanged for a Databricks user token.")
            print("   Unity Catalog enforces YOUR permissions on this query.")
elif "error" in body:
    print(f"Error: {body['error']}")
```

## Step 8: Verify via CloudWatch logs

In a separate terminal, tail the interceptor logs to see the token exchange steps:

```bash
aws logs tail /aws/lambda/databricks-per-user-interceptor --follow --region us-east-1
```

Expected output:
```
[STEP 3] Entra JWT | email=user@company.com name=User Name
[STEP 4] Token exchange | endpoint=https://<workspace>/oidc/v1/token
[STEP 5] Token received | elapsed=517ms
[STEP 6] Overriding Authorization header
```

## Cleanup

```python
# Uncomment to clean up all resources
# agentcore.delete_gateway_target(gatewayIdentifier=gateway_id, targetId=target_id)
# time.sleep(10)
# agentcore.delete_gateway(gatewayIdentifier=gateway_id)
# lambda_client.delete_function(FunctionName=fn_name)
# agentcore.delete_oauth2_credential_provider(name="databricks-per-user-sp")
# print("Cleaned up.")
```
