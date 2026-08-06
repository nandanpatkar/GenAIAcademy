# Test your agent from a Python Notebook

This interactive notebook provides an alternative way to test your deployed agent, besides the Streamlit UI app.

## Kernel selection and prerequisites

You can use the `cx-agent-backend/.venv` as a kernel. If this is not set up already, run the following from your terminal:

```bash
cd cx-agent-backend
uv venv
uv sync --all-extras --frozen
```

This notebook assumes:
1. You've already deployed the main solution as described in [README.md](./README.md)
2. Your Python kernel is already configured with AWS credentials and target AWS Region (for example via environment variables, potentially set via a `.env` file as documented [here for VSCode](https://code.visualstudio.com/docs/python/environments#_environment-variables)).
    - Note that the AWS SDK for Python, `boto3`, [expects](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/configuration.html#using-environment-variables) an `AWS_DEFAULT_REGION` environment variable rather than `AWS_REGION`.

## Dependencies and setup

First we'll import the necessary libraries, and initialize clients for AWS Services, and define some utility functions that'll be used later:

```python
# Python Built-Ins:
import base64
import json
import getpass
import hashlib
import hmac
import os
import uuid
import urllib.parse

# External Libraries:
import boto3  # AWS SDK for Python
import requests  # For making raw HTTP(S) API calls

# AWS Service Clients:
botosess = boto3.Session()  # You could set `region_name` here explicitly if wanted
cognito_client = botosess.client("cognito-idp")  # Cognito (Identity Provider)


def _set_if_undefined(var: str, name: str | None = None) -> str:
    """Utility to prompt user once for a value, and cache it in environment variable"""
    if not os.environ.get(var):
        os.environ[var] = getpass.getpass(f"Please provide your {name or var}:")
    return os.environ[var]


def calculate_secret_hash(username, client_id, client_secret):
    """Utility to hash a username + client ID + client secret for Cognito login"""
    message = username + client_id
    return base64.b64encode(
        hmac.new(client_secret.encode("utf-8"), message.encode("utf-8"), hashlib.sha256).digest()
    ).decode("utf-8")


def invoke_agent(
    message,
    agent_arn,
    auth_token,
    session_id,
    qualifier="DEFAULT",
    region=botosess.region_name,
):
    """Invoke Bedrock AgentCore runtime with a message."""
    escaped_agent_arn = urllib.parse.quote(agent_arn, safe="")
    response = requests.post(
        f"https://bedrock-agentcore.{region}.amazonaws.com/runtimes/{escaped_agent_arn}/invocations?qualifier={qualifier}",
        headers={
            "Authorization": f"Bearer {auth_token}",
            "Content-Type": "application/json",
            "X-Amzn-Bedrock-AgentCore-Runtime-Session-Id": session_id,
        },
        data=json.dumps({"input": {"prompt": message, "conversation_id": session_id}}),
        timeout=61,
    )

    print(f"Status Code: {response.status_code}")

    if response.status_code == 200:
        return response.json()
    else:
        raise ValueError(f"HTTP {response.status_code}: {response.text}")
```

## Fetch access token from Amazon Cognito

To talk to the AgentCore-deployed agent, we'll need to log in to Amazon Cognito to fetch a session token.

You'll need to fetch your Cognito user_pool_id and client_id in the cell below, which you can view by running the `terraform output` command in your terminal:

```python
user_pool_id = "TODO"  # E.g. run `terraform output -raw user_pool_id`
client_id = "TODO"  # E.g. run `terraform output -raw client_id`

# From these we should be able to look up the client secret automatically:
client_secret = cognito_client.describe_user_pool_client(UserPoolId=user_pool_id, ClientId=client_id)["UserPoolClient"][
    "ClientSecret"
]
```

The next cell will prompt you for your Cognito username (email address) and password, or re-use the existing one if you run the cell again without restarting the notebook:

```python
username = _set_if_undefined("COGNITO_USERNAME", "Cognito user name (email address)")
password = _set_if_undefined("COGNITO_PASSWORD", "Cognito password")
```

The deployment steps in [README.md](./README.md) guide you through setting up your Cognito user from the AWS CLI, but you could instead un-comment and run the below to achieve the same effect from Python:

```python
## Create a user (with temporary password)
# create_user_resp = cognito_client.admin_create_user(
#     UserPoolId=user_pool_id,
#     Username=username,
#     # Temp password is randomized here because we'll never use it:
#     TemporaryPassword="".join((
#         secrets.choice(
#             string.ascii_uppercase + string.ascii_lowercase + string.digits +
#             "^$*.[]{}()?-'\"!@#%&/\\,><':;|_~`+="
#         ) for i in range(20)
#     )),
#     MessageAction="SUPPRESS"
# )
# print(f"User created: {create_user_resp['User']['Username']}")

## Override the password to the given value (permanently)
# set_password_resp = cognito_client.admin_set_user_password(
#     UserPoolId=user_pool_id,
#     Username=username,
#     Password=password,
#     Permanent=True,
# )
# print("Password set successfully")
```

With the configuration set up, we're ready to request an access token from Cognito:

```python
auth_resp = cognito_client.initiate_auth(
    ClientId=client_id,
    AuthFlow="USER_PASSWORD_AUTH",
    AuthParameters={
        "USERNAME": username,
        "PASSWORD": password,
        "SECRET_HASH": calculate_secret_hash(username, client_id, client_secret),
    },
)

access_token = auth_resp["AuthenticationResult"]["AccessToken"]
print("Access token fetched")
```

## Invoke the agent

With the access token ready, we're almost ready to invoke our AgentCore Agent. First though, you'll need to:
1. Look up the deployed AgentRuntime ARN from the terraform, and
2. Choose a session ID (we'll randomize this automatically)

```python
agent_arn = "TODO"  # E.g. run `terraform output -raw agent_runtime_arn`

session_id = str(uuid.uuid4())  # Can auto-generate this
```

```python
result = invoke_agent("Hello, can you help me resetting my router?", agent_arn, access_token, session_id)
if result:
    print(json.dumps(result, indent=2))
```

### Testing math functionality

```python
math_test = "What is 25 + 17?"
print(f"Testing math with: {math_test}")
result = invoke_agent(math_test, agent_arn, access_token, session_id)
if result:
    print(json.dumps(result, indent=2))
print("\n" + "=" * 50 + "\n")
```

### Testing memory persistence

```python
message = "Add 10 to the result"
print(message)
result = invoke_agent(message, agent_arn, access_token, session_id)
if result:
    print(json.dumps(result, indent=2))
print("\n" + "=" * 50 + "\n")
```

```python
result = invoke_agent("What device did I want to reset?", agent_arn, access_token, session_id)
if result:
    print(json.dumps(result, indent=2))
```
