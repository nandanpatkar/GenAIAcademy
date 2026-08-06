# Lab 3: Creating Agents with Amazon AgentCore Identity 

## Overview

In this lab, you will enhance your existing customer support agent by integrating Amazon Bedrock AgentCore Identity functionality. This enables your agent to securely authenticate with external services like Google Calendar using OAuth2 flows, while maintaining proper credential management through AgentCore's identity providers.

Calendar integration enables your support agent to schedule events like product demonstrations and technical support appointments directly within customer conversations, streamlining the support workflow and enhancing the overall customer experience.



**Based on**: [Official Customer Support Assistant](https://github.com/awslabs/amazon-bedrock-agentcore-samples/tree/main/02-use-cases/customer-support-assistant)


### Lab Details

| Information        | Details                                                                        |
| :----------------- |:-------------------------------------------------------------------------------|
| Lab type           | Incremental Enhancement                                                        |
| Agent type         | Single                                                                         |
| Agentic Framework  | Strands Agents                                                                 |
| LLM model          | Amazon Nova 2 Lite                                                             |
| Lab components     | AgentCore Identity, OAuth2 providers, Google Calendar API, Cognito integration |
| Lab vertical       | Customer Support                                                               |
| Example complexity | Moderate                                                                       |
| SDK used           | Amazon BedrockAgentCore Python SDK, Strands Agents, Google API Client          |

### Lab Architecture

In this lab, you will extend your customer support agent with identity management capabilities. The agent will authenticate users through AgentCore Identity providers and access external services like Google Calendar on behalf of authenticated users.

Your agent will integrate:
- **AgentCore Identity**: Secure credential management and OAuth2 flows
- **Google OAuth2 Provider**: Authentication with Google services
- **Calendar Tools**: Create events and retrieve calendar information
- **Cognito Provider** (Optional): Custom identity provider integration


### Lab Key Features

- Secure OAuth2 authentication flows
- External service integration with proper credential management
- Google Calendar API integration
- Custom identity provider configuration

## Prerequisites

To execute this tutorial you will need:

- Python 3.10+
- AWS credentials configured
- Amazon Bedrock AgentCore SDK
- Strands Agents
- **Previously completed Labs 1 & 2** - This lab builds directly on your existing agent
- **Google Developer Console access** - For creating OAuth2 credentials
- **AgentCore Identity permissions** - IAM role with AgentCore Identity access

**Note**: Ensure your basic agent from Labs 1 & 2 is working correctly before proceeding.

## Step 1: Install Dependencies and Import Libraries

We'll install the required packages for AgentCore Identity integration, Google API access, and OAuth2 authentication flows. We'll also create some helper functions for later.

```python
# Install required packages
%pip install strands-agents strands-agents-tools "boto3>=1.39.15" python-dotenv utils google-auth google-api-python-client ddgs -q
```

```python
# Import libraries
import boto3
import click
import sys
import json
import os
from botocore.exceptions import ClientError

from bedrock_agentcore.identity.auth import requires_access_token
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from datetime import datetime, timedelta
from strands import tool
from strands import Agent
from strands.models import BedrockModel
import webbrowser

from lab_helpers.utils import get_ssm_parameter

session = boto3.session.Session()
region = session.region_name

identity_client = boto3.client(
    "bedrock-agentcore-control",
    region_name=region,
)
cognito = boto3.client("cognito-idp")
ssm = boto3.client("ssm", region_name=region)

print("✅ Libraries imported successfully!")
```

```python
# Helper functions to save, retrieve, and delete provider names from SSM


def store_provider_name_in_ssm(provider_name: str):
    """Store credential provider name in SSM parameter."""
    param_name = "/app/customersupport/agentcore/google_provider"
    try:
        ssm.put_parameter(Name=param_name, Value=provider_name, Type="String", Overwrite=True)
        click.echo(f"🔐 Stored provider name in SSM: {param_name}")
    except ClientError as e:
        click.echo(f"⚠️ Failed to store provider name in SSM: {e}")


def get_provider_name_from_ssm() -> str:
    """Get credential provider name from SSM parameter."""
    param_name = "/app/customersupport/agentcore/google_provider"
    try:
        response = ssm.get_parameter(Name=param_name)
        return response["Parameter"]["Value"]
    except ClientError:
        return None


def delete_ssm_param():
    """Delete SSM parameter for provider."""
    param_name = "/app/customersupport/agentcore/google_provider"
    try:
        ssm.delete_parameter(Name=param_name)
        click.echo(f"🧹 Deleted SSM parameter: {param_name}")
    except ClientError as e:
        click.echo(f"⚠️ Failed to delete SSM parameter: {e}")
```

## Step 2: Import Customer Support Tools

We'll reuse the customer support tools from Lab 1 to maintain our agent's core functionality.

## Step 3: Configure AgentCore Identity Clients

In this step, we'll integrate Google Calendar API functionality into our customer support agent. To securely access external services like Google Calendar on behalf of users, we need to implement proper authentication mechanisms.

Amazon Bedrock AgentCore Identity provides a streamlined approach to managing OAuth2 authentication flows, eliminating the complexity of manual token management, refresh handling, and credential storage. This service acts as a secure intermediary between your agent and external service providers.

To create a Google OAuth client, follow the steps below:

#### ✅ 1. Create a Project in Google Developer Console

1. Go to the [Google Developer Console](https://console.developers.google.com/).
2. In the top navigation bar, click on “Create Project”.
3. Enter a Project Name.
4. Choose an Organization or leave as “No organization” if not applicable.
5. Click Create.

Your new project will appear in the project list.

#### 📦 2. Enable Google Calendar API

1. With your project selected, open the left-hand menu and go to APIs & Services > Library.
2. In the search bar, type Google Calendar API.
3. Click on Google Calendar API from the results.
4. Click Enable.

#### 🛡️ 3. Configure OAuth Consent Screen

1. In the left-hand menu, go to APIs & Services > OAuth consent screen.

2. Click “Get started”.

3. Fill in the required fields: App Name, and User Support Email
4. Click Next, then: Select the User Type (Internal or External). If selecting External, add the tester email addresses. Provide Developer Contact Information (your email).
5. Accept terms and click Finish.
6. Click Create to finalize the consent screen.

#### 🔧 4. Create OAuth 2.0 Credentials

1. Navigate to APIs & Services > Credentials from the left-hand menu.
2. Click Create Credentials > OAuth client ID.
3. Choose Web application as the application type.
4. Enter a name for the credentials.
5. Under Authorized redirect URIs, add your following redirect URI:
   - `https://bedrock-agentcore.us-east-1.amazonaws.com/identities/oauth2/callback`
6. Click Create.

#### 🔑 5. Obtain Client ID and Client Secret

After creation, a dialog will display your Client ID and Client Secret. Download JSON to save the credentials to a file. Save this file to your project in `credentials.json`. (You may have to rename the file to match this) 

#### 🔍 6. Update the Data Access Scopes

1. Go to APIs & Services > Credentials.
2. Click on the OAuth 2.0 client ID you created.
3. In the left-hand menu, select Data access.
4. Click “Add or remove scopes”.
5. Under Manually add scopes, enter scope: `https://www.googleapis.com/auth/calendar`
6. Click Update, then click Save to confirm the configuration.

```python
credentials_file = "credentials.json"

# Verify credentials file looks as expected, and extract credentials

if not os.path.isfile(credentials_file):
    print(f"❌ Error: '{credentials_file}' file not found")
    sys.exit(1)

print(f"📄 Reading credentials from {credentials_file}...")
try:
    with open(credentials_file, "r") as f:
        data = json.load(f)
except json.JSONDecodeError as e:
    print(f"❌ Error parsing JSON: {e}")
    sys.exit(1)

web_config = data.get("web")
if not web_config:
    print("❌ Error: 'web' section missing in credentials.json")
    sys.exit(1)

client_id = web_config.get("client_id")
client_secret = web_config.get("client_secret")

if not client_id:
    print("❌ Error: 'client_id' not found in credentials.json")
    sys.exit(1)

if not client_secret:
    print("❌ Error: 'client_secret' not found in credentials.json")
    sys.exit(1)

print("✅ Client ID and Secret loaded from credentials.json")
```

```python
google_provider_name = "customersupport-google-calendar"

try:
    print("🔧 Creating Google OAuth2 credential provider...")
    google_provider = identity_client.create_oauth2_credential_provider(
        name=google_provider_name,
        credentialProviderVendor="GoogleOauth2",
        oauth2ProviderConfigInput={
            "googleOauth2ProviderConfig": {
                "clientId": client_id,
                "clientSecret": client_secret,
            }
        },
    )

    print("✅ Google OAuth2 credential provider created successfully")
    google_provider_arn = google_provider["credentialProviderArn"]
    print(f"   Provider ARN: {google_provider_arn}")
    print(f"   Provider Name: {google_provider['name']}")

    # Store provider name in SSM
    store_provider_name_in_ssm(google_provider_name)
except Exception as e:
    print(f"❌ Error creating Google credential provider: {str(e)}")
```

```python
# List all OAuth2 credential providers.
try:
    response = identity_client.list_oauth2_credential_providers(maxResults=20)
    providers = response.get("credentialProviders", [])
    print(providers)
except Exception as e:
    print(f"❌ Error listing credential providers: {str(e)}", err=True)
```

Now we'll create tools that use AgentCore Identity to authenticate with Google Calendar and perform calendar operations on behalf of users.

First, let's configure the OAuth2 authentication flow:

```python
async def on_auth_url(url: str):
    webbrowser.open(url)


SCOPES = ["https://www.googleapis.com/auth/calendar"]

google_access_token = None


@requires_access_token(
    provider_name=google_provider_name,
    scopes=["https://www.googleapis.com/auth/calendar"],  # Google OAuth2 scopes
    auth_flow="USER_FEDERATION",  # On-behalf-of user (3LO) flow
    on_auth_url=on_auth_url,  # prints authorization URL to console
    force_authentication=True,
    into="access_token",
)
def get_google_access_token(access_token: str):
    return access_token
```

Now let's create the calendar management tools:

```python
@tool(
    name="Create_calendar_event",
    description="Creates a new event on your Google Calendar",
)
def create_calendar_event() -> str:
    google_access_token = ""
    try:
        google_access_token = get_google_access_token(access_token=google_access_token)
        if not google_access_token:
            raise Exception("requires_access_token did not provide tokens")
    except Exception as e:
        return "Error Authentication with Google: " + str(e)

    creds = Credentials(token=google_access_token, scopes=SCOPES)

    try:
        service = build("calendar", "v3", credentials=creds)

        # Define event details
        start_time = datetime.now() + timedelta(hours=1)
        end_time = start_time + timedelta(hours=1)

        event = {
            "summary": "Test Event from API",
            "location": "Virtual",
            "description": "This event was created using the Google Calendar API.",
            "start": {
                "dateTime": start_time.isoformat() + "Z",  # UTC time
                "timeZone": "UTC",
            },
            "end": {
                "dateTime": end_time.isoformat() + "Z",
                "timeZone": "UTC",
            },
        }

        created_event = service.events().insert(calendarId="primary", body=event).execute()

        return json.dumps(
            {
                "event_created": True,
                "event_id": created_event.get("id"),
                "htmlLink": created_event.get("htmlLink"),
            }
        )

    except HttpError as error:
        return json.dumps({"error": str(error), "event_created": False})
    except Exception as e:
        return json.dumps({"error": str(e), "event_created": False})
```

```python
@tool(
    name="Get_calendar_events_today",
    description="Retrieves the calendar events for the day from your Google Calendar",
)
def get_calendar_events_today() -> str:
    google_access_token = ""
    try:
        google_access_token = get_google_access_token(access_token=google_access_token)

        if not google_access_token:
            raise Exception("requires_access_token did not provide tokens")
    except Exception as e:
        return "Error Authentication with Google: " + str(e)

    # Create credentials from the provided access token
    creds = Credentials(token=google_access_token, scopes=SCOPES)
    try:
        service = build("calendar", "v3", credentials=creds)
        # Call the Calendar API
        today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        today_end = today_start.replace(hour=23, minute=59, second=59)

        # Format with CDT timezone (-05:00)
        timeMin = today_start.strftime("%Y-%m-%dT00:00:00-05:00")
        timeMax = today_end.strftime("%Y-%m-%dT23:59:59-05:00")

        events_result = (
            service.events()
            .list(
                calendarId="primary",
                timeMin=timeMin,
                timeMax=timeMax,
                singleEvents=True,
                orderBy="startTime",
            )
            .execute()
        )
        events = events_result.get("items", [])
        if not events:
            return json.dumps({"events": []})  # Return empty events array as JSON

        return json.dumps({"events": events})  # Return events wrapped in an object
    except HttpError as error:
        error_message = str(error)
        return json.dumps({"error": error_message, "events": []})
    except Exception as e:
        error_message = str(e)
        return json.dumps({"error": error_message, "events": []})
```

Let's create our customer support agent with the new calendar functionality:

```python
model_id = "global.amazon.nova-2-lite-v1:0"
model = BedrockModel(
    model_id=model_id,
)
system_prompt = """
    You are a helpful and professional customer support assistant for an electronics e-commerce company.
Your role is to:
- Provide accurate information using the tools available to you
- Support the customer with technical information and product specifications.
- Be friendly, patient, and understanding with customers
- Always offer additional help after answering questions
- If you can't help with something, direct customers to the appropriate contact

You have access to the following tools:
1. get_return_policy() - For warranty and return policy questions
2. get_product_info() - To get information about a specific product
3. web_search() - To access current technical documentation, or for updated information. 
4. create_calendar_event() - To create a new calendar event
5. get_calendar_events_today() - To find events on the calendar today
Always use the appropriate tool to get accurate, up-to-date information rather than making assumptions about electronic products or specifications.
    """
agent = Agent(
    model=model,
    system_prompt=system_prompt,
    tools=[create_calendar_event, get_calendar_events_today],
    callback_handler=None,
)
```

It's time to test our agent now! You will see a message that says ```Polling for token for authorization url```, followed by a URL. Click on this URL to sign into your Google account, and give the agent the permissions to access your Google calendar.

```python
print(str(agent("Can you create a new event on my cal? You can call the create_calendar_event directly.")))
```

```python
print(str(agent("Whats my agenda for today?")))
```

## Congratulations! 🎉

You have successfully completed **Creating Agents with Amazon AgentCore Identity Functionality**!

### What You Accomplished:

✅ **Configured AgentCore Identity**: Set up OAuth2 credential providers for secure authentication  
✅ **Google Calendar Integration**: Created tools for calendar event management and viewing  
✅ **Enhanced Customer Support**: Extended your agent with scheduling and calendar capabilities  

### Key Learnings:
- **Identity Management**: Using AgentCore Identity for secure credential management
- **OAuth2 Flows**: Implementing user federation and token-based authentication
- **External API Integration**: Securely connecting to third-party services like Google Calendar
- **Tool Enhancement**: Adding identity-aware capabilities to existing agent tools

## Next Steps

Ready to enhance your agent? Continue with:

- **Lab 4**: Leverage Gateway to securely connect tools and other resources
- **Lab 5**: Implement observability and guardrails for production monitoring
- **Lab 6**: Deploy to AgentCore Runtime for scalable production hosting

## Resources

- [AgentCore Identity Documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/agentcore-identity.html)
- [Google Calendar API Documentation](https://developers.google.com/calendar/api)
- [Strands Agents Documentation](https://github.com/strands-agents/sdk-python)
- [Amazon Bedrock Models](https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html)
- [Official Customer Support Sample](https://github.com/awslabs/amazon-bedrock-agentcore-samples/tree/main/02-use-cases/customer-support-assistant)

---

**Excellent work! Your customer support agent now has secure identity management and calendar integration capabilities! 🚀**

## (Optional): Create an Identity Provider with Cognito

For additional identity management capabilities, you can also configure a Cognito-based identity provider. This section demonstrates how to create a custom OAuth2 provider using Amazon Cognito:

```python
cognito_provider_name = "customersupport-gateways-cognito"

try:
    print("📥 Fetching Cognito configuration from SSM...")

    client_id = get_ssm_parameter("/app/customersupport/agentcore/client_id")
    print(f"✅ Retrieved client ID: {client_id}")

    client_secret = get_ssm_parameter("/app/customersupport/agentcore/cognito_secret")
    print(f"✅ Retrieved client secret: {client_secret[:4]}***")

    issuer = get_ssm_parameter("/app/customersupport/agentcore/cognito_discovery_url")
    auth_url = get_ssm_parameter("/app/customersupport/agentcore/cognito_auth_url")
    token_url = get_ssm_parameter("/app/customersupport/agentcore/cognito_token_url")

    print(f"✅ Issuer: {issuer}")
    print(f"✅ Authorization Endpoint: {auth_url}")
    print(f"✅ Token Endpoint: {token_url}")

    print("⚙️  Creating OAuth2 credential provider...")

    cognito_provider = identity_client.create_oauth2_credential_provider(
        name=cognito_provider_name,
        credentialProviderVendor="CustomOauth2",
        oauth2ProviderConfigInput={
            "customOauth2ProviderConfig": {
                "clientId": client_id,
                "clientSecret": client_secret,
                "oauthDiscovery": {
                    "authorizationServerMetadata": {
                        "issuer": issuer,
                        "authorizationEndpoint": auth_url,
                        "tokenEndpoint": token_url,
                        "responseTypes": ["code", "token"],
                    }
                },
            }
        },
    )

    provider_arn = cognito_provider["credentialProviderArn"]
    print(provider_arn)
except Exception as e:
    print(f"❌ Error creating Cognito credential provider: {str(e)}")
```

```python
response = identity_client.list_oauth2_credential_providers(maxResults=20)
providers = response.get("credentialProviders", [])
print(providers)
```

## Cleanup

```python
#  try:
#     print(f"🗑️  Deleting Google OAuth2 credential provider: {google_provider_name}")
#     identity_client.delete_oauth2_credential_provider(name=google_provider_name)
#     print("✅ Google OAuth2 credential provider deleted successfully")
# except Exception as e:
#     print(f"❌ Error deleting credential provider: {str(e)}")
```

```python
#  try:
#     print(f"🗑️  Deleting Cognito OAuth2 credential provider: {cognito_provider_name}")
#     identity_client.delete_oauth2_credential_provider(name=cognito_provider_name)
#     print("✅ Cognito credential provider deleted successfully")
# except Exception as e:
#     print(f"❌ Error deleting credential provider: {str(e)}")
```
