# Using browser profiles - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-profiles.html

---

# Using browser profiles

Browser profiles enable you to persist and reuse browser profile data across multiple browser sessions. A browser profile stores session information including cookies and local storage.

For example, you can authenticate to a website once in a browser session and save the profile data to browser profile resource. When you start a new browser session with that saved profile, your authentication state is preserved, and you remain logged in. This enables agents to perform tasks on authenticated websites without requiring manual intervention.

## Overview

Browser profiles in Amazon Bedrock AgentCore work as follows:

  1. Create a browser profile resource that will be reuse across browser sessions

  2. Start a browser session and perform actions (such as login a website or put item in shopping cart) that populate cookies and localstorage

  3. Save the profile data from current browser session to the browser profile resource

  4. Start new browser sessions using the saved profile to restore the previous state


## Prerequisites

Before using browser profiles, ensure you have:

  * Completed the general Browser [Prerequisites](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-quickstart.html#browser-prerequisites>)

  * IAM permissions to manage profile resources. Add the following permissions to your IAM policy:

```json
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "BedrockAgentCoreBrowserProfileManagementAccess",
            "Effect": "Allow",
            "Action": [
                "bedrock-agentcore:CreateBrowserProfile",
                "bedrock-agentcore:ListBrowserProfiles",
                "bedrock-agentcore:GetBrowserProfile",
                "bedrock-agentcore:DeleteBrowserProfile"
            ],
            "Resource": "arn:aws:bedrock-agentcore:<Region>:<account_id>:browser-profile/*"
        }
    ]
}
```
  * IAM permissions to save and load profiles. Add the following permissions to your IAM policy:

```json
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "BedrockAgentCoreBrowserProfileUsageAccess",
            "Effect": "Allow",
            "Action": [
                "bedrock-agentcore:StartBrowserSession",
                "bedrock-agentcore:SaveBrowserSessionProfile"
            ],
            "Resource": [
                "arn:aws:bedrock-agentcore:<Region>:<account_id>:browser-profile/*",
                "arn:aws:bedrock-agentcore:<Region>:<account_id>:browser-custom/*",
                "arn:aws:bedrock-agentcore:<Region>:<account_id>:browser/*"
            ]
        }
    ]
}
```
## Getting started with browser profiles

This section walks you through creating a browser profile, saving session data to it, and reusing the profile in subsequent sessions.

### Step 1: Create a browser profile

Create a browser profile resource to store session data.

###### Example

AWS CLI
    

  1. To create a browser profile using the AWS CLI:

```bash
aws bedrock-agentcore-control create-browser-profile \
  --region <Region> \
  --name "profile_demo" \
  --description "example profile"
```
Boto3
    

  1. To create a browser profile using the AWS SDK for Python (Boto3):

```python
import boto3

region = "us-west-2"
client = boto3.client('bedrock-agentcore-control', region_name=region)

response = client.create_browser_profile(
    name="profile_demo",
    description="example profile"
)

profile_id = response['profileId']
print(f"Created profile: {profile_id}")
```
API
    

  1. To create a browser profile using the API:

```text
awscurl -X PUT \
  "https://bedrock-agentcore-control.<Region>.amazonaws.com/browser-profiles" \
  -H "Content-Type: application/json" \
  --service bedrock-agentcore-control \
  --region <Region> \
  -d '{
    "name": "profile_demo",
    "description": "example profile",
    "clientToken": "FC21DD1F-FA7B-40EC-8D3A-12E029A1BFF3"
  }'
```
### Step 2: Start a browser session and perform actions

Start a browser session and perform actions such as login a website. The session state, including cookies and local storage, will be captured.

###### Example

AWS CLI
    

  1. To start a browser session using the AWS CLI:

```bash
aws bedrock-agentcore start-browser-session \
  --region <Region> \
  --browser-identifier "aws.browser.v1" \
  --name "my-session" \
  --session-timeout-seconds 3600
```
Use the returned session ID to interact with the browser and perform your desired actions (for example, login into a website).


Boto3
    

  1. To start a browser session using Boto3:

```python
import boto3

region = "us-west-2"
client = boto3.client('bedrock-agentcore', region_name=region)

response = client.start_browser_session(
    browserIdentifier="aws.browser.v1",
    name="my-session",
    sessionTimeoutSeconds=3600
)

session_id = response['sessionId']
print(f"Session ID: {session_id}")

# Use the session to perform actions (e.g., login to a website)
# ... your browser automation code here ...
```
API
    

  1. To start a browser session using the API:

```text
awscurl -X PUT \
  "https://bedrock-agentcore.<Region>.amazonaws.com/browsers/aws.browser.v1/sessions/start" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  --service bedrock-agentcore \
  --region <Region> \
  -d '{
    "name": "my-session",
    "sessionTimeoutSeconds": 3600
  }'
```
### Step 3: Save the session to a profile

After performing actions in the browser session, save the current state to your browser profile. This captures cookies, local storage, and other session data.

###### Example

AWS CLI
    

  1. To save a browser session to a profile using the AWS CLI:

```bash
aws bedrock-agentcore save-browser-session-profile \
  --region <Region> \
  --profile-identifier "<ProfileId>" \
  --browser-identifier "aws.browser.v1" \
  --session-id "<SessionId>"
```
Boto3
    

  1. To save a browser session to a profile using Boto3:

```python
import boto3

region = "us-west-2"
client = boto3.client('bedrock-agentcore', region_name=region)

response = client.save_browser_session_profile(
    profileIdentifier=profile_id,  # From Step 1
    browserIdentifier="aws.browser.v1",
    sessionId=session_id  # From Step 2
)

print(f"Profile saved successfully")
```
API
    

  1. To save a browser session to a profile using the API:

```text
awscurl -X PUT \
  "https://bedrock-agentcore.<Region>.amazonaws.com/browser-profiles/<ProfileId>/save" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  --service bedrock-agentcore \
  --region <Region> \
  -d '{
    "browserIdentifier": "aws.browser.v1",
    "sessionId": "<SessionId>",
    "clientToken": "52866F95-4468-4B6C-920C-09A00D36F04E"
  }'
```
### Step 4: Start a new session with the profile

Start a new browser session using the saved profile. The session will be initialized with the saved state, including authentication cookies and local storage.

###### Example

AWS CLI
    

  1. To start a browser session with a profile using the AWS CLI:

```bash
aws bedrock-agentcore start-browser-session \
  --region <Region> \
  --browser-identifier "aws.browser.v1" \
  --name "session-with-profile" \
  --session-timeout-seconds 3600 \
  --profile-configuration '{
    "profileIdentifier":"<ProfileId>"
  }'
```
Boto3
    

  1. To start a browser session with a profile using Boto3:

```python
import boto3

region = "us-west-2"
client = boto3.client('bedrock-agentcore', region_name=region)

response = client.start_browser_session(
    browserIdentifier="aws.browser.v1",
    name="session-with-profile",
    sessionTimeoutSeconds=3600,
    profileConfiguration={
        "profileIdentifier": profile_id  # From Step 1
    }
)

new_session_id = response['sessionId']
print(f"New session started with profile: {new_session_id}")
print("Session is now authenticated with saved cookies and state")
```
API
    

  1. To start a browser session with a profile using the API:

```text
awscurl -X PUT \
  "https://bedrock-agentcore.<Region>.amazonaws.com/browsers/aws.browser.v1/sessions/start" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  --service bedrock-agentcore \
  --region <Region> \
  -d '{
    "name": "session-with-profile",
    "sessionTimeoutSeconds": 3600,
    "profileConfiguration": {
      "profileIdentifier": "<ProfileId>"
    },
    "clientToken": "8FAAFF7F-7803-4C40-A7BD-139C6D008646"
  }'
```
## Browser profile operations

This section describes additional operations for managing browser profiles.

### Listing browser profiles

You can list all browser profiles in your account.

###### Example

AWS CLI
    

  1. To list browser profiles using the AWS CLI:

```bash
aws bedrock-agentcore-control list-browser-profiles \
  --region <Region>
```
Boto3
    

  1. To list browser profiles using Boto3:

```python
import boto3

region = "us-west-2"
client = boto3.client('bedrock-agentcore-control', region_name=region)

response = client.list_browser_profiles()

for profile in response.get('items', []):
    print(f"Profile ID: {profile['profileId']}")
    print(f"Name: {profile['name']}")
    print(f"Status: {profile['status']}")
    print("---")
```
API
    

  1. To list browser profiles using the API:

```text
awscurl -X POST \
  "https://bedrock-agentcore-control.<Region>.amazonaws.com/browser-profiles/list" \
  -H "Content-Type: application/json" \
  --service bedrock-agentcore-control \
  --region <Region>
```
### Getting browser profile details

You can retrieve details about a specific browser profile.

###### Example

AWS CLI
    

  1. To get browser profile details using the AWS CLI:

```bash
aws bedrock-agentcore-control get-browser-profile \
  --region <Region> \
  --profile-id "<ProfileId>"
```
Boto3
    

  1. To get browser profile details using Boto3:

```python
import boto3

region = "us-west-2"
client = boto3.client('bedrock-agentcore-control', region_name=region)

response = client.get_browser_profile(
    profileId=profile_id
)

print(f"Profile ID: {response['profileId']}")
print(f"Name: {response['name']}")
print(f"Description: {response.get('description', 'N/A')}")
print(f"Status: {response['status']}")
print(f"Created: {response['createdAt']}")
```
API
    

  1. To get browser profile details using the API:

```text
awscurl -X GET \
  "https://bedrock-agentcore-control.<Region>.amazonaws.com/browser-profiles/<ProfileId>" \
  -H "Content-Type: application/json" \
  --service bedrock-agentcore-control \
  --region <Region>
```
### Deleting a browser profile

When you no longer need a browser profile, you can delete it to free up resources.

###### Example

AWS CLI
    

  1. To delete a browser profile using the AWS CLI:

```bash
aws bedrock-agentcore-control delete-browser-profile \
  --region <Region> \
  --profile-id "<ProfileId>"
```
Boto3
    

  1. To delete a browser profile using Boto3:

```python
import boto3

region = "us-west-2"
client = boto3.client('bedrock-agentcore-control', region_name=region)

response = client.delete_browser_profile(
    profileId=profile_id
)

print(f"Profile deleted successfully")
```
API
    

  1. To delete a browser profile using the API:

```text
awscurl -X DELETE \
  "https://bedrock-agentcore-control.<Region>.amazonaws.com/browser-profiles/<ProfileId>" \
  -H "Content-Type: application/json" \
  --service bedrock-agentcore-control \
  --region <Region>
```
## Use cases

Browser profiles are useful for:

  * **Persistent authentication** : Maintain login sessions across multiple browser invocations without re-authenticating each time

  * **Multi-step workflows** : Execute complex workflows that span multiple sessions while preserving state and context (in cookies or localstorage)

  * **Automated tasks** : Enable AI agents to perform tasks on authenticated websites without manual intervention


## Considerations

  * **Profile Persistence** : Profile data is saved when you explicitly call the save operation. Ensure you save the profile before terminating the session to preserve the state.

  * **Session Isolation** : Each browser session using a profile operates independently. Changes made in one session are not visible in other concurrent sessions.

  * **Profile Loading** : Saved profile changes only apply to new sessions. Active sessions continue using the profile state from when they were started and will not reflect updates made to the profile after session starts.

  * **Security** : Browser profiles may contain sensitive data such as authentication cookies. Ensure proper IAM policies are in place to restrict access to profile resources.

  * **Profile Updates** : When you save a session to a profile, it overwrites the previous profile data. Consider your workflow carefully to avoid losing important state information.

  * **Cookie Expiration** : Cookies have their own expiration times set by websites. Browser profiles preserve cookies, but expired cookies are automatically removed by the browser according to their expiration dates.



