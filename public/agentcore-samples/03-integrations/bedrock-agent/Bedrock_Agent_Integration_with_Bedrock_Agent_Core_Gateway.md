# Bedrock Agent Integration with Bedrock AgentCore Gateway

This notebook demonstrates end-to-end integration of Amazon Bedrock Agents with Bedrock AgentCore Gateway for a Fruit Stand Backend API that is built on AWS Lambda and DynamoDB

## Architecture Overview
```
User Query → Bedrock Agent → Bridge Lambda → Bedrock AgentCore Gateway → Target Lambda → DynamoDB
```

## Step 1: Install Dependencies & Setup

```python
# Install boto3
!pip3 install botocore--quiet
!pip3 install boto3 --quiet

import boto3
import json
import zipfile
import os
import urllib.request
import urllib.parse
import time

print("✅ Dependencies installed successfully")
```

## Step 2: Create IAM Role with necessary permissions

```python
def create_iam_role():
    """Create IAM role that can be used for Bedrock Core Gateway, Bedrock Agent, Lambda"""
    iam = boto3.client("iam")

    trust_policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {"Service": "lambda.amazonaws.com"},
                "Action": "sts:AssumeRole",
            },
            {
                "Effect": "Allow",
                "Principal": {"Service": "bedrock.amazonaws.com"},
                "Action": "sts:AssumeRole",
            },
            {
                "Effect": "Allow",
                "Principal": {"Service": "bedrock-agentcore.amazonaws.com"},
                "Action": "sts:AssumeRole",
            },
        ],
    }

    try:
        role_response = iam.create_role(
            RoleName="BedrockAgentCoreGatewayLambdaRole",
            AssumeRolePolicyDocument=json.dumps(trust_policy),
            Description="Role for Bedrock Gateway with DynamoDB access",
        )

        # Create and attach inline policy
        permissions_policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        "bedrock-agentcore:*",
                        "iam:PassRole",
                        "lambda:InvokeFunction",
                    ],
                    "Resource": "*",
                }
            ],
        }

        iam.put_role_policy(
            RoleName="BedrockAgentCoreGatewayLambdaRole",
            PolicyName="BedrockAgentCoreInlinePolicy",
            PolicyDocument=json.dumps(permissions_policy),
        )

        # Attach managed policies
        iam.attach_role_policy(
            RoleName="BedrockAgentCoreGatewayLambdaRole",
            PolicyArn="arn:aws:iam::aws:policy/AdministratorAccess",
        )

        role_arn = role_response["Role"]["Arn"]
        print(f"✅ Created IAM role: {role_arn}")
        return role_arn

    except Exception as e:
        if "already exists" in str(e):
            # Ensure existing role has all required permissions
            try:
                iam.attach_role_policy(
                    RoleName="BedrockAgentCoreGatewayLambdaRole",
                    PolicyArn="arn:aws:iam::aws:policy/AdministratorAccess",
                )
            except:
                pass  # Policy may already be attached

            account_id = boto3.client("sts").get_caller_identity()["Account"]
            role_arn = f"arn:aws:iam::{account_id}:role/BedrockAgentCoreGatewayLambdaRole"
            print(f"✅ Using existing IAM role: {role_arn}")
            return role_arn
        else:
            print(f"❌ Error creating role: {e}")
            return None


gateway_role_arn = create_iam_role()
print(f"Gateway Role ARN: {gateway_role_arn}")
```

## Step 3: Create DynamoDB Tables

Create DynamoDB tables for orders and inventory tracking.

```python
def create_dynamodb_tables():
    """Create DynamoDB tables for orders and inventory"""
    dynamodb = boto3.client("dynamodb", region_name="us-east-1")

    # Create Orders table
    try:
        dynamodb.create_table(
            TableName="FruitOrders",
            KeySchema=[{"AttributeName": "order_id", "KeyType": "HASH"}],
            AttributeDefinitions=[{"AttributeName": "order_id", "AttributeType": "S"}],
            BillingMode="PAY_PER_REQUEST",
        )
        print("✅ Created Orders table")
    except Exception as e:
        if "already exists" in str(e):
            print("✅ Orders table already exists")
        else:
            print(f"❌ Error creating Orders table: {e}")

    # Create Inventory table
    try:
        dynamodb.create_table(
            TableName="FruitInventory",
            KeySchema=[{"AttributeName": "fruit_name", "KeyType": "HASH"}],
            AttributeDefinitions=[{"AttributeName": "fruit_name", "AttributeType": "S"}],
            BillingMode="PAY_PER_REQUEST",
        )
        print("✅ Created Inventory table")

        # Initialize inventory data
        # Wait for table to be active
        waiter = dynamodb.get_waiter("table_exists")
        waiter.wait(TableName="FruitInventory", WaiterConfig={"Delay": 2, "MaxAttempts": 30})
        print("✅ Table is active")

        fruits_data = [
            {"fruit_name": "apple", "price": 1.20, "unit": "each", "stock": 100},
            {"fruit_name": "banana", "price": 0.50, "unit": "each", "stock": 150},
            {"fruit_name": "orange", "price": 0.75, "unit": "each", "stock": 80},
            {"fruit_name": "strawberry", "price": 3.99, "unit": "pound", "stock": 25},
            {"fruit_name": "blueberry", "price": 4.50, "unit": "pint", "stock": 30},
        ]

        for fruit in fruits_data:
            dynamodb.put_item(
                TableName="FruitInventory",
                Item={
                    "fruit_name": {"S": fruit["fruit_name"]},
                    "price": {"N": str(fruit["price"])},
                    "unit": {"S": fruit["unit"]},
                    "stock": {"N": str(fruit["stock"])},
                },
            )
        print("✅ Initialized inventory data")

    except Exception as e:
        if "already exists" in str(e):
            print("✅ Inventory table already exists")
        else:
            print(f"❌ Error creating Inventory table: {e}")


# Create DynamoDB tables
create_dynamodb_tables()
```

## Step 4: Setup Cognito Authentication

```python
def setup_cognito_auth():
    """Set up Cognito authentication for Bedrock AgentCore Gateway"""
    cognito = boto3.client("cognito-idp", region_name="us-east-1")

    try:
        user_pool_response = cognito.create_user_pool(PoolName="bedrock-agentcore-gateway-dynamo-pool")
        user_pool_id = user_pool_response["UserPool"]["Id"]

        import random
        import string

        domain_name = f"bedrock-agentcore-dynamo-{''.join(random.choices(string.ascii_lowercase + string.digits, k=8))}"

        try:
            cognito.create_user_pool_domain(Domain=domain_name, UserPoolId=user_pool_id)
        except:
            pass

        cognito.create_resource_server(
            UserPoolId=user_pool_id,
            Identifier="bedrock-agentcore-server",
            Name="BedrockCoreGatewayServer",
            Scopes=[
                {"ScopeName": "read", "ScopeDescription": "Read access"},
                {"ScopeName": "write", "ScopeDescription": "Write access"},
            ],
        )

        client_response = cognito.create_user_pool_client(
            UserPoolId=user_pool_id,
            ClientName="bedrock-agentcore-client",
            GenerateSecret=True,
            AllowedOAuthFlows=["client_credentials"],
            AllowedOAuthScopes=[
                "bedrock-agentcore-server/read",
                "bedrock-agentcore-server/write",
            ],
            AllowedOAuthFlowsUserPoolClient=True,
            SupportedIdentityProviders=["COGNITO"],
        )

        client_id = client_response["UserPoolClient"]["ClientId"]
        client_secret = client_response["UserPoolClient"]["ClientSecret"]

        auth_config = {
            "user_pool_id": user_pool_id,
            "client_id": client_id,
            "client_secret": client_secret,
            "discovery_url": f"https://cognito-idp.us-east-1.amazonaws.com/{user_pool_id}/.well-known/openid-configuration",
            "token_endpoint": f"https://{domain_name}.auth.us-east-1.amazoncognito.com/oauth2/token",
            "domain_name": domain_name,
        }

        print("✅ Created Cognito configuration")
        return auth_config

    except Exception as e:
        print(f"❌ Error setting up Cognito: {e}")


auth_config = setup_cognito_auth()
print(f"Auth Configuration: {json.dumps(auth_config, indent=2)}")
```

## Step 5: Create Backend API Lambda Function with DynamoDB

```python
# Enhanced Lambda function code with DynamoDB integration
lambda_code = """
import json
import uuid
import boto3
from datetime import datetime
from decimal import Decimal

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
orders_table = dynamodb.Table('FruitOrders')
inventory_table = dynamodb.Table('FruitInventory')

def determine_tool_from_arguments(event):
    if not event:
        return "list_fruits_tool"
    if "customer_name" in event or "items" in event:
        return "create_order_tool"
    elif "order_id" in event:
        return "get_order_tool"
    return "list_fruits_tool"

def list_fruits_tool(arguments):
    try:
        response = inventory_table.scan()
        fruits = []
        for item in response['Items']:
            fruits.append({
                "name": item['fruit_name'],
                "price": float(item['price']),
                "unit": item['unit'],
                "stock": int(item['stock'])
            })
        return {"fruits": fruits, "status": "success"}
    except Exception as e:
        return {"error": str(e), "status": "error"}

def create_order_tool(arguments):
    try:
        items = arguments.get('items', [])
        customer_name = arguments.get('customer_name', 'Anonymous')
        
        if not items:
            return {"error": "No items provided", "status": "error"}
        
        order_id = str(uuid.uuid4())[:8]
        total_cost = Decimal('0')
        order_items = []
        
        for item in items:
            fruit_name = item.get('name', '').lower()
            quantity = item.get('quantity', 1)
            
            try:
                fruit_response = inventory_table.get_item(
                    Key={'fruit_name': fruit_name}
                )
                if 'Item' not in fruit_response:
                    return {"error": f"Fruit '{fruit_name}' not found", "status": "error"}
                
                fruit = fruit_response['Item']
                if int(fruit['stock']) < quantity:
                    return {"error": f"Insufficient stock for {fruit_name}. Available: {fruit['stock']}", "status": "error"}
                
                unit_price = Decimal(str(fruit['price']))
                item_cost = unit_price * Decimal(str(quantity))
                total_cost += item_cost
                
                order_items.append({
                    "name": fruit['fruit_name'],
                    "quantity": quantity,
                    "unit_price": unit_price,
                    "unit": fruit['unit'],
                    "total_price": item_cost
                })
                
                inventory_table.update_item(
                    Key={'fruit_name': fruit_name},
                    UpdateExpression='SET stock = stock - :qty',
                    ExpressionAttributeValues={':qty': quantity}
                )
                
            except Exception as e:
                return {"error": f"Error processing {fruit_name}: {str(e)}", "status": "error"}
        
        orders_table.put_item(Item={
            'order_id': order_id,
            'customer_name': customer_name,
            'items': order_items,
            'total_cost': total_cost,
            'status': 'pending',
            'created_at': datetime.now().isoformat()
        })
        
        order = {
            "order_id": order_id,
            "customer_name": customer_name,
            "items": [
                {
                    "name": item["name"],
                    "quantity": item["quantity"],
                    "unit_price": float(item["unit_price"]),
                    "unit": item["unit"],
                    "total_price": float(item["total_price"])
                }
                for item in order_items
            ],
            "total_cost": float(total_cost),
            "status": "pending",
            "created_at": datetime.now().isoformat()
        }
        
        return {"order": order, "status": "success"}
        
    except Exception as e:
        return {"error": str(e), "status": "error"}

def get_order_tool(arguments):
    try:
        order_id = arguments.get('order_id')
        if not order_id:
            return {"error": "Order ID is required", "status": "error"}
        
        response = orders_table.get_item(Key={'order_id': order_id})
        if 'Item' not in response:
            return {"error": f"Order {order_id} not found", "status": "error"}
        
        order = response['Item']
        order['total_cost'] = float(order['total_cost'])
        for item in order.get('items', []):
            if 'unit_price' in item:
                item['unit_price'] = float(item['unit_price'])
            if 'total_price' in item:
                item['total_price'] = float(item['total_price'])
        
        return {"order": order, "status": "success"}
        
    except Exception as e:
        return {"error": str(e), "status": "error"}

def lambda_handler(event, context):
    try:
        tool_name = determine_tool_from_arguments(event)
        
        tools = {
            'list_fruits_tool': list_fruits_tool,
            'create_order_tool': create_order_tool,
            'get_order_tool': get_order_tool
        }
        
        tool_function = tools.get(tool_name)
        if not tool_function:
            return {"error": f"Unknown tool: {tool_name}", "status": "error"}
        
        return tool_function(event)
        
    except Exception as e:
        return {"error": str(e), "status": "error"}
"""


def create_enhanced_lambda():
    lambda_client = boto3.client("lambda", region_name="us-east-1")

    with open("enhanced_lambda_function.py", "w") as f:
        f.write(lambda_code)

    with zipfile.ZipFile("enhanced_fruit_orders_lambda.zip", "w") as zip_file:
        zip_file.write("enhanced_lambda_function.py", "lambda_function.py")

    try:
        with open("enhanced_fruit_orders_lambda.zip", "rb") as zip_file:
            response = lambda_client.create_function(
                FunctionName="enhanced-fruit-order-dynamo",
                Runtime="python3.13",
                Role=gateway_role_arn,
                Handler="lambda_function.lambda_handler",
                Code={"ZipFile": zip_file.read()},
                Description="Enhanced fruit ordering system with DynamoDB",
                Timeout=30,
            )

        print(f"✅ Created Enhanced Lambda: {response['FunctionArn']}")
        return response["FunctionArn"]

    except Exception as e:
        if "already exists" in str(e):
            account_id = boto3.client("sts").get_caller_identity()["Account"]
            lambda_arn = f"arn:aws:lambda:us-east-1:{account_id}:function:enhanced-fruit-order-dynamo"
            print(f"✅ Lambda function already exists: {lambda_arn}")
            return lambda_arn
        else:
            print(f"❌ Error: {e}")
            return None
    finally:
        if os.path.exists("enhanced_lambda_function.py"):
            os.remove("enhanced_lambda_function.py")
        if os.path.exists("enhanced_fruit_orders_lambda.zip"):
            os.remove("enhanced_fruit_orders_lambda.zip")


enhanced_lambda_arn = create_enhanced_lambda()
print(f"Enhanced Lambda ARN: {enhanced_lambda_arn}")
```

## Step 6: Create Bedrock AgentCore Gateway

```python
def create_bedrock_agentcore_gateway(role_arn, auth_config):
    """Create Bedrock AgentCore Gateway"""
    client = boto3.client(
        "bedrock-agentcore-control",
        region_name="us-east-1",
        endpoint_url="https://bedrock-agentcore-control.us-east-1.amazonaws.com",
    )

    gateway_auth_config = {
        "customJWTAuthorizer": {
            "allowedClients": [auth_config["client_id"]],
            "discoveryUrl": auth_config["discovery_url"],
        }
    }

    try:
        response = client.create_gateway(
            name=f"fruit-orders-dynamo-gateway-{int(time.time()) % 1000000}",
            roleArn=role_arn,
            protocolType="MCP",
            authorizerType="CUSTOM_JWT",
            authorizerConfiguration=gateway_auth_config,
            description="Enhanced Bedrock Core Agent Gateway with Lambda integration",
        )

        gateway_id = response.get("gatewayId")
        print(f"✅ Created Gateway: {gateway_id}")
        return gateway_id

    except Exception as e:
        print(f"❌ Error creating gateway: {e}")
        return None


if gateway_role_arn and auth_config:
    gateway_id = create_bedrock_agentcore_gateway(gateway_role_arn, auth_config)
    print(f"Gateway ID: {gateway_id}")
else:
    print("⚠️ Gateway role ARN and auth config required")
    gateway_id = None
```

## Step 7: Create Gateway Lambda Target with Enhanced Schema

```python
def create_enhanced_gateway_target(gateway_id, lambda_arn):
    client = boto3.client(
        "bedrock-agentcore-control",
        region_name="us-east-1",
        endpoint_url="https://bedrock-agentcore-control.us-east-1.amazonaws.com",
    )

    lambda_target_config = {
        "mcp": {
            "lambda": {
                "lambdaArn": lambda_arn,
                "toolSchema": {
                    "inlinePayload": [
                        {
                            "name": "list_fruits_tool",
                            "description": "Lists all available fruits with prices and stock levels",
                            "inputSchema": {
                                "type": "object",
                                "properties": {},
                                "required": [],
                            },
                        },
                        {
                            "name": "create_order_tool",
                            "description": "Creates a new fruit order and updates inventory",
                            "inputSchema": {
                                "type": "object",
                                "properties": {
                                    "customer_name": {
                                        "type": "string",
                                    },
                                    "items": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "name": {
                                                    "type": "string",
                                                },
                                                "quantity": {
                                                    "type": "number",
                                                },
                                            },
                                            "required": ["name", "quantity"],
                                        },
                                    },
                                },
                                "required": ["customer_name", "items"],
                            },
                        },
                        {
                            "name": "get_order_tool",
                            "description": "Gets order details by ID from DynamoDB",
                            "inputSchema": {
                                "type": "object",
                                "properties": {
                                    "order_id": {
                                        "type": "string",
                                    }
                                },
                                "required": ["order_id"],
                            },
                        },
                    ]
                },
            }
        }
    }

    try:
        response = client.create_gateway_target(
            gatewayIdentifier=gateway_id,
            name="EnhancedFruitOrdersTarget",
            description="Enhanced Lambda target with DynamoDB integration",
            targetConfiguration=lambda_target_config,
            credentialProviderConfigurations=[{"credentialProviderType": "GATEWAY_IAM_ROLE"}],
        )

        target_id = response["targetId"]
        print(f"✅ Created Target: {target_id}")
        return target_id

    except Exception as e:
        print(f"❌ Error creating target: {e}")
        return None


if gateway_id and enhanced_lambda_arn:
    target_id = create_enhanced_gateway_target(gateway_id, enhanced_lambda_arn)
    print(f"Target ID: {target_id}")
else:
    print("⚠️ Gateway ID and Lambda ARN required")
    target_id = None
```

## Step 8: Test Gateway with List and Ivoke

```python
def generate_bearer_token(auth_config):
    data = urllib.parse.urlencode(
        {
            "grant_type": "client_credentials",
            "client_id": auth_config["client_id"],
            "client_secret": auth_config["client_secret"],
        }
    ).encode("utf-8")

    try:
        req = urllib.request.Request(
            auth_config["token_endpoint"],
            data=data,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )

        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status == 200:
                result = json.loads(response.read().decode("utf-8"))
                return result.get("access_token")
    except Exception as e:
        print(f"Error generating token: {e}")
    return None


def test_enhanced_gateway(gateway_id, target_id, auth_config):
    bearer_token = generate_bearer_token(auth_config)
    if not bearer_token:
        print("❌ Failed to generate token")
        return

    mcp_endpoint = f"https://{gateway_id}.gateway.bedrock-agentcore.us-east-1.amazonaws.com/mcp"

    # Test 1: List fruits with stock levels
    print("\n🧪 Test 1: List fruits with stock levels")
    mcp_request = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {
            "name": "EnhancedFruitOrdersTarget___list_fruits_tool",
            "arguments": {},
        },
    }

    try:
        req = urllib.request.Request(
            mcp_endpoint,
            data=json.dumps(mcp_request).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {bearer_token}",
            },
        )

        with urllib.request.urlopen(req, timeout=30) as response:
            if response.status == 200:
                result = json.loads(response.read().decode("utf-8"))
                print("✅ List fruits successful!")
                print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"❌ Error: {e}")

    # Test 2: Create order with inventory update
    print("\n🧪 Test 2: Create order with inventory update")
    create_order_request = {
        "jsonrpc": "2.0",
        "id": 2,
        "method": "tools/call",
        "params": {
            "name": "EnhancedFruitOrdersTarget___create_order_tool",
            "arguments": {
                "customer_name": "Alice Johnson",
                "items": [
                    {"name": "apple", "quantity": 3},
                    {"name": "banana", "quantity": 2},
                ],
            },
        },
    }

    try:
        req = urllib.request.Request(
            mcp_endpoint,
            data=json.dumps(create_order_request).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {bearer_token}",
            },
        )

        with urllib.request.urlopen(req, timeout=30) as response:
            if response.status == 200:
                result = json.loads(response.read().decode("utf-8"))
                print("✅ Create order successful!")
                print(json.dumps(result, indent=2))

                # Extract order ID for next test
                if "result" in result and "content" in result["result"]:
                    content = result["result"]["content"][0]["text"]
                    order_data = json.loads(content)
                    if "order" in order_data:
                        order_id = order_data["order"]["order_id"]
                        print(f"\n📝 Order ID for testing: {order_id}")
                        return order_id
    except Exception as e:
        print(f"❌ Error: {e}")

    return None


# Test the enhanced gateway
if gateway_id and target_id and auth_config:
    test_order_id = test_enhanced_gateway(gateway_id, target_id, auth_config)
else:
    print("⚠️ Gateway ID, Target ID, and auth config required for testing")
    test_order_id = None
```

## Step 9: Create Bedrock Agent that acts as MCP Client

```python
def create_enhanced_bedrock_agent():
    bedrock = boto3.client("bedrock-agent", region_name="us-east-1")

    try:
        agent_response = bedrock.create_agent(
            agentName="enhanced-fruit-ordering-dynamo-agent",
            description="Enhanced AI agent for fruit ordering with DynamoDB persistence",
            foundationModel="global.anthropic.claude-haiku-4-5-20251001-v1:0",
            instruction="""You are an advanced fruit ordering assistant with access to a persistent inventory system. You can:

1. **List Available Fruits**: Show all fruits with current prices and stock levels
2. **Create Orders**: Process customer orders and automatically update inventory
3. **Track Orders**: Retrieve order details using order IDs
4. **Inventory Management**: Check stock levels and prevent overselling

Key Features:
- Real-time inventory tracking with DynamoDB
- Automatic stock deduction when orders are placed
- Persistent order storage with customer information
- Stock validation to prevent overselling

Always be helpful, provide clear information about availability, and confirm order details including total cost.""",
            agentResourceRoleArn=gateway_role_arn,
            idleSessionTTLInSeconds=1800,
        )

        agent_id = agent_response["agent"]["agentId"]
        print(f"✅ Created Enhanced Agent: {agent_id}")
        return agent_id

    except Exception as e:
        print(f"❌ Error creating agent: {e}")
        return None


enhanced_agent_id = create_enhanced_bedrock_agent()
print(f"Enhanced Agent ID: {enhanced_agent_id}")
```

## Step 10: Create Bridge Lambda for Bedrock Agent

Create a Lambda function that bridges Bedrock Agent calls to the Bedrock AgentCore Gateway.

```python
def create_bridge_lambda(gateway_id, target_id, auth_config):
    bridge_code = f'''
import json
import urllib.request
import urllib.parse

def generate_bearer_token():
    data = urllib.parse.urlencode({{
        "grant_type": "client_credentials",
        "client_id": "{auth_config["client_id"]}",
        "client_secret": "{auth_config["client_secret"]}"
    }}).encode('utf-8')
    
    try:
        req = urllib.request.Request(
            "{auth_config["token_endpoint"]}",
            data=data,
            headers={{"Content-Type": "application/x-www-form-urlencoded"}}
        )
        
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status == 200:
                result = json.loads(response.read().decode('utf-8'))
                return result.get('access_token')
    except Exception as e:
        print(f"Error generating token: {{e}}")
    return None

def lambda_handler(event, context):
    gateway_endpoint = "https://{gateway_id}.gateway.bedrock-agentcore.us-east-1.amazonaws.com/mcp"
    
    bearer_token = generate_bearer_token()
    if not bearer_token:
        return {{
            "messageVersion": "1.0",
            "response": {{
                "actionGroup": event.get('actionGroup', ''),
                "function": event.get('function', ''),
                "functionResponse": {{
                    "responseBody": {{"TEXT": {{"body": "Failed to generate token"}}}}
                }}
            }}
        }}
    
    function_name = event.get('function')
    parameters = event.get('parameters', [])
    
    param_dict = {{}}
    for param in parameters:
        param_dict[param['name']] = param['value']
    
    tool_mapping = {{
        'list_fruits': 'EnhancedFruitOrdersTarget___list_fruits_tool',
        'create_order': 'EnhancedFruitOrdersTarget___create_order_tool',
        'get_order': 'EnhancedFruitOrdersTarget___get_order_tool'
    }}
    
    gateway_tool = tool_mapping.get(function_name)
    if not gateway_tool:
        return {{
            "messageVersion": "1.0",
            "response": {{
                "actionGroup": event.get('actionGroup', ''),
                "function": function_name,
                "functionResponse": {{
                    "responseBody": {{"TEXT": {{"body": f"Unknown function: {{function_name}}"}}}}
                }}
            }}
        }}
    
    arguments = {{}}
    if function_name == 'create_order':
        arguments = {{
            'customer_name': param_dict.get('customer_name', 'Customer'),
            'items': json.loads(param_dict.get('items', '[]'))
        }}
    elif function_name == 'get_order':
        arguments = {{'order_id': param_dict.get('order_id')}}
    
    mcp_request = {{
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {{"name": gateway_tool, "arguments": arguments}}
    }}
    
    try:
        req = urllib.request.Request(
            gateway_endpoint,
            data=json.dumps(mcp_request).encode('utf-8'),
            headers={{
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {{bearer_token}}'
            }}
        )
        
        with urllib.request.urlopen(req, timeout=30) as response:
            if response.status == 200:
                result = json.loads(response.read().decode('utf-8'))
                if 'result' in result and 'content' in result['result']:
                    content_text = result['result']['content'][0].get('text', '')
                    try:
                        parsed_result = json.loads(content_text)['response']['payload']
                        response_text = json.dumps(parsed_result, indent=2)
                    except:
                        response_text = content_text
                else:
                    response_text = json.dumps(result, indent=2)
            else:
                response_text = f"Gateway error: {{response.status}}"
    except Exception as e:
        response_text = f"Error: {{str(e)}}"
    
    return {{
        "messageVersion": "1.0",
        "response": {{
            "actionGroup": event.get('actionGroup', ''),
            "function": function_name,
            "functionResponse": {{
                "responseBody": {{"TEXT": {{"body": response_text}}}}
            }}
        }}
    }}
'''

    lambda_client = boto3.client("lambda", region_name="us-east-1")

    with open("bridge_function.py", "w") as f:
        f.write(bridge_code)

    with zipfile.ZipFile("bridge_lambda.zip", "w") as zip_file:
        zip_file.write("bridge_function.py", "lambda_function.py")

    try:
        with open("bridge_lambda.zip", "rb") as zip_file:
            response = lambda_client.create_function(
                FunctionName="enhanced-bedrock-gateway-bridge",
                Runtime="python3.13",
                Role=gateway_role_arn,
                Handler="lambda_function.lambda_handler",
                Code={"ZipFile": zip_file.read()},
                Description="Bridge between Bedrock Agent and Bedrock AgentCore Gateway",
                Timeout=30,
            )

        bridge_arn = response["FunctionArn"]
        print(f"✅ Created Bridge Lambda: {bridge_arn}")

        # Add permission for Bedrock
        lambda_client.add_permission(
            FunctionName="enhanced-bedrock-gateway-bridge",
            StatementId="bedrock-agent-invoke",
            Action="lambda:InvokeFunction",
            Principal="bedrock.amazonaws.com",
        )

        return bridge_arn

    except Exception as e:
        if "already exists" in str(e):
            account_id = boto3.client("sts").get_caller_identity()["Account"]
            bridge_arn = f"arn:aws:lambda:us-east-1:{account_id}:function:enhanced-bedrock-gateway-bridge"
            print(f"✅ Bridge Lambda already exists: {bridge_arn}")
            return bridge_arn
        else:
            print(f"❌ Error: {e}")
            return None
    finally:
        if os.path.exists("bridge_function.py"):
            os.remove("bridge_function.py")
        if os.path.exists("bridge_lambda.zip"):
            os.remove("bridge_lambda.zip")


# Create Bridge Lambda
if gateway_id and target_id and auth_config:
    bridge_arn = create_bridge_lambda(gateway_id, target_id, auth_config)
    print(f"Bridge Lambda ARN: {bridge_arn}")
else:
    print("⚠️ Gateway ID, Target ID, and auth config required")
    bridge_arn = None
```

## Step 11: Wait and Verify Agent Creation

Wait for the agent to be created and verify its status.

```python
def wait_for_agent_creation(agent_id, max_wait=300):
    """Wait for agent to be created and ready"""
    if not agent_id:
        print("⚠️ No agent ID provided")
        return False

    bedrock = boto3.client("bedrock-agent", region_name="us-east-1")

    print(f"⏳ Waiting for agent {agent_id} to be ready...")

    start_time = time.time()
    while time.time() - start_time < max_wait:
        try:
            response = bedrock.get_agent(agentId=agent_id)
            status = response["agent"]["agentStatus"]

            print(f"Agent status: {status}")

            if status == "NOT_PREPARED":
                print("✅ Agent created successfully and ready for action groups")
                return True
            elif status == "FAILED":
                print("❌ Agent creation failed")
                return False

            time.sleep(10)

        except Exception as e:
            print(f"Error checking agent status: {e}")
            time.sleep(10)

    print("⚠️ Timeout waiting for agent creation")
    return False


# Wait for agent creation
agent_ready = wait_for_agent_creation(enhanced_agent_id)
print(f"Agent ready: {agent_ready}")
```

## Step 12: Associate Action Group

Create and associate the action group with the Bedrock Agent.

```python
def create_action_group(agent_id, bridge_lambda_arn):
    if not agent_id or not bridge_lambda_arn:
        print("⚠️ Agent ID and Bridge Lambda ARN required")
        return None

    bedrock = boto3.client("bedrock-agent", region_name="us-east-1")

    try:
        action_group_response = bedrock.create_agent_action_group(
            agentId=agent_id,
            agentVersion="DRAFT",
            actionGroupName="EnhancedFruitOrdersActions",
            description="Enhanced actions for fruit ordering with DynamoDB",
            actionGroupExecutor={"lambda": bridge_lambda_arn},
            functionSchema={
                "functions": [
                    {
                        "name": "list_fruits",
                        "description": "List available fruits with prices and stock levels",
                    },
                    {
                        "name": "create_order",
                        "description": "Create a new fruit order with inventory update",
                        "parameters": {
                            "customer_name": {
                                "type": "string",
                                "description": "Customer name",
                            },
                            "items": {
                                "type": "string",
                                "description": "JSON array of items with name and quantity",
                            },
                        },
                    },
                    {
                        "name": "get_order",
                        "description": "Get order details by ID from DynamoDB",
                        "parameters": {"order_id": {"type": "string", "description": "Order ID"}},
                    },
                ]
            },
        )

        action_group_id = action_group_response["agentActionGroup"]["actionGroupId"]
        print(f"✅ Created Action Group: {action_group_id}")

        # Prepare agent
        bedrock.prepare_agent(agentId=agent_id)
        print("✅ Agent prepared with action group")

        return action_group_id

    except Exception as e:
        print(f"❌ Error creating action group: {e}")
        return None


# Create Action Group
if agent_ready and bridge_arn:
    action_group_id = create_action_group(enhanced_agent_id, bridge_arn)
    print(f"Action Group ID: {action_group_id}")
else:
    print("⚠️ Agent must be ready and Bridge Lambda ARN required")
    action_group_id = None
```

## Step 13: Test Bedrock Agent End-to-End flow with Bedrock AgentCore Gateway with Lambda as target

Test the complete integration by invoking the Bedrock Agent.

```python
def test_enhanced_bedrock_agent(agent_id):
    bedrock_runtime = boto3.client("bedrock-agent-runtime", region_name="us-east-1")

    # Check agent status first
    bedrock = boto3.client("bedrock-agent", region_name="us-east-1")
    try:
        agent_info = bedrock.get_agent(agentId=agent_id)
        agent_status = agent_info["agent"]["agentStatus"]
        print(f"🔍 Agent status: {agent_status}")

        if agent_status != "PREPARED":
            print(f"⚠️ Agent not prepared. Current status: {agent_status}")
            return
    except Exception as e:
        print(f"❌ Error checking agent: {e}")
        return

    test_queries = [
        "What fruits are available?",
        "Create an order for Bob with fruit as apple and quantity as 2",
    ]

    for query in test_queries:
        print(f"\n🤔 User: {query}")

        try:
            response = bedrock_runtime.invoke_agent(
                agentId=agent_id,
                agentAliasId="TSTALIASID",
                sessionId=f"test-session-{int(time.time())}",
                inputText=query,
            )

            full_response = ""
            for event in response["completion"]:
                if "chunk" in event:
                    chunk = event["chunk"]
                    if "bytes" in chunk:
                        full_response += chunk["bytes"].decode("utf-8")

            print(f"🤖 Enhanced Agent: {full_response}")

        except Exception as e:
            print(f"❌ Error: {e}")


# Test the Enhanced Bedrock Agent
if enhanced_agent_id:
    print("Testing Enhanced Bedrock Agent with DynamoDB integration...")
    test_enhanced_bedrock_agent(enhanced_agent_id)
else:
    print("⚠️ Agent ID required for testing")
```

## 🎉 Summary

### Architecture:
```
User Query → Bedrock Agent → Bridge Lambda → Bedrock AgentCore Gateway → Enhanced Lambda → DynamoDB
```

### Database Schema:
- **FruitOrders**: order_id, customer_name, items, total_cost, status, created_at
- **FruitInventory**: fruit_name, price, unit, stock

## 🧹 Cleanup Resources

Run each section below to clean up specific resources. Execute in order to avoid dependency issues.

### Step 1: Delete Bedrock Agent

```python
bedrock = boto3.client("bedrock-agent", region_name="us-east-1")

try:
    if "enhanced_agent_id" in globals() and enhanced_agent_id:
        bedrock.delete_agent(agentId=enhanced_agent_id, skipResourceInUseCheck=True)
        print(f"✅ Deleted Enhanced Bedrock Agent: {enhanced_agent_id}")
    else:
        print("⚠️ No enhanced_agent_id found")
except Exception as e:
    print(f"⚠️ Enhanced Agent cleanup error: {e}")
```

### Step 2: Delete Bridge Lambda

```python
lambda_client = boto3.client("lambda", region_name="us-east-1")

try:
    lambda_client.delete_function(FunctionName="enhanced-bedrock-gateway-bridge")
    print("✅ Deleted Bridge Lambda")
except Exception as e:
    print(f"⚠️ Bridge Lambda cleanup error: {e}")
```

### Step 3: Delete Enhanced Lambda Function

```python
lambda_client = boto3.client("lambda", region_name="us-east-1")

try:
    lambda_client.delete_function(FunctionName="enhanced-fruit-order-dynamo")
    print("✅ Deleted Enhanced Lambda")
except Exception as e:
    print(f"⚠️ Enhanced Lambda cleanup error: {e}")
```

### Step 4: Delete Gateway Target

```python
bedrock_agentcore_client = boto3.client(
    "bedrock-agentcore-control",
    region_name="us-east-1",
    endpoint_url="https://bedrock-agentcore-control.us-east-1.amazonaws.com",
)

try:
    if "gateway_id" in globals() and gateway_id and "target_id" in globals() and target_id:
        bedrock_agentcore_client.delete_gateway_target(gatewayIdentifier=gateway_id, targetId=target_id)
        print(f"✅ Deleted Gateway Target: {target_id}")
    else:
        print("⚠️ No gateway_id or target_id found")
except Exception as e:
    print(f"⚠️ Gateway Target cleanup error: {e}")
```

### Step 5: Delete Bedrock AgentCore Gateway

```python
try:
    if "gateway_id" in globals() and gateway_id:
        bedrock_agentcore_client.delete_gateway(gatewayIdentifier=gateway_id)
        print(f"✅ Deleted Bedrock AgentCore Gateway: {gateway_id}")
    else:
        print("⚠️ No gateway_id found")
except Exception as e:
    print(f"⚠️ Gateway cleanup error: {e}")
```

### Step 6: Delete DynamoDB Tables

```python
dynamodb = boto3.client("dynamodb", region_name="us-east-1")

try:
    dynamodb.delete_table(TableName="FruitOrders")
    print("✅ Deleted FruitOrders table")
except Exception as e:
    print(f"⚠️ FruitOrders table cleanup error: {e}")

try:
    dynamodb.delete_table(TableName="FruitInventory")
    print("✅ Deleted FruitInventory table")
except Exception as e:
    print(f"⚠️ FruitInventory table cleanup error: {e}")
```

### Step 7: Delete Cognito Resources

```python
cognito = boto3.client("cognito-idp", region_name="us-east-1")

try:
    if "auth_config" in globals() and auth_config:
        user_pool_id = auth_config.get("user_pool_id")
        domain_name = auth_config.get("domain_name")

        if user_pool_id and user_pool_id != "us-east-1_0IalqBD2P":
            # Delete domain first
            try:
                cognito.delete_user_pool_domain(Domain=domain_name, UserPoolId=user_pool_id)
                print(f"✅ Deleted Cognito Domain: {domain_name}")
            except Exception as domain_error:
                print(f"⚠️ Domain deletion error: {domain_error}")

            # Delete user pool
            cognito.delete_user_pool(UserPoolId=user_pool_id)
            print(f"✅ Deleted Cognito User Pool: {user_pool_id}")
        else:
            print("⚠️ Using default user pool, skipping deletion")
    else:
        print("⚠️ No auth_config found")
except Exception as e:
    print(f"⚠️ Cognito cleanup error: {e}")
```

### Step 8: Delete IAM Role

```python
iam = boto3.client("iam")

try:
    # Detach policies first
    iam.detach_role_policy(
        RoleName="BedrockAgentCoreGatewayLambdaRole",
        PolicyArn="arn:aws:iam::aws:policy/AdministratorAccess",
    )
    print("✅ Detached AdministratorAccess policy")
    iam.delete_role_policy(
        RoleName="BedrockAgentCoreGatewayLambdaRole",
        PolicyName="BedrockAgentCoreInlinePolicy",
    )
    # Delete role
    iam.delete_role(RoleName="BedrockAgentCoreGatewayLambdaRole")
    print("✅ Deleted IAM Role: BedrockAgentCoreGatewayLambdaRole")

except Exception as e:
    print(f"⚠️ IAM Role cleanup error: {e}")
```
