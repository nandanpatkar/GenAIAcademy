# Using browser enterprise policies - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-enterprise-policies.html

---

# Using browser enterprise policies  
  
Enterprise policies allow you to control browser behavior using the [Chromium enterprise policy](<https://www.chromium.org/administrators/linux-quick-start/>) mechanism. You provide policy files as JSON in your Amazon S3 bucket, and the service applies them to browser sessions automatically.

## Overview

Chromium enterprise policies can be applied at two enforcement levels:

  * **Managed** – Required and mandated by an administrator. These cannot be overridden. Managed policies are written to `/etc/chromium/policies/managed/`.

  * **Recommended** – Set at user level and take lower precedence to managed policies in the event of a conflict. Recommended policies are written to `/etc/chromium/policies/recommended/`.


For more details about Chrome policy types and precedence, see the [Chromium Linux Quick Start](<https://www.chromium.org/administrators/linux-quick-start/>).

Managed policies can be set using the `CreateBrowser` API and apply to all sessions created with that custom browser. Recommended policies are set at session level using the `StartBrowserSession` API and apply only to that specific session. They need to be re-applied to every new session.

You create JSON policy files following the [Chrome Enterprise Policy List](<https://chromeenterprise.google/policies/>) , upload them to your Amazon S3 bucket, and reference them when creating a browser or starting a session.

## Prerequisites

Before using enterprise policies, ensure you have:

  * Completed the general Browser [Prerequisites](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-quickstart.html#browser-prerequisites>)

  * An Amazon S3 bucket in the same region as your browser to store policy JSON files

  * IAM permissions to access the Amazon S3 bucket containing your policy files. Add the following permissions to your IAM policy:

```json
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "EnterprisePolicyS3Access",
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:GetObjectVersion"
            ],
            "Resource": [
                "arn:aws:s3:::<S3Bucket>/<path_to_policies>/*"
            ]
        }
    ]
}
```
  * Policy JSON files following the Chromium enterprise policy format. Each file must contain valid policy keys from the [Chrome Enterprise Policy List](<https://chromeenterprise.google/policies/>).


## Preparing policy files

Create JSON files containing the policies you want to apply. Each file should contain a flat JSON object with policy keys and values.

**Example managed policy file**

This file disables autofill and password saving:

```json
{
    "AutofillAddressEnabled": false,
    "AutofillCreditCardEnabled": false,
    "PasswordManagerEnabled": false
}
```
**Example recommended policy file**

This file is used to set policies at session level:

```json
{
    "BookmarkBarEnabled": true,
    "SpellCheckServiceEnabled": false,
    "TranslateEnabled": false
}
```
Upload the policy files to your Amazon S3 bucket:

```bash
aws s3 cp managed-policies.json s3://my-policy-bucket/policies/managed-policies.json
aws s3 cp recommended-policies.json s3://my-policy-bucket/policies/recommended-policies.json
```
###### Note

You can specify up to 10 enterprise policy files. The Amazon S3 bucket must be in the same region as the browser.

## Creating a custom browser with managed policies

To enforce enterprise policies that cannot be overridden, create a custom browser with managed policies. Managed policies are applied to every session created with this browser.

###### Example

AWS CLI
    

  1. 
```bash
aws bedrock-agentcore-control create-browser \
  --region <Region> \
  --name "my-managed-browser" \
  --enterprise-policies '[
    {
      "type": "MANAGED",
      "location": {
        "s3": {
          "bucket": "my-policy-bucket",
          "prefix": "policies/managed-policies.json"
        }
      }
    }
  ]'
```
 


Boto3
    

  1. 
```python
import boto3

region = "us-west-2"
client = boto3.client('bedrock-agentcore-control', region_name=region)

response = client.create_browser(
    name="my-managed-browser",
    enterprisePolicies=[
        {
            "type": "MANAGED",
            "location": {
                "s3": {
                    "bucket": "my-policy-bucket",
                    "prefix": "policies/managed-policies.json"
                }
            }
        }
    ]
)

browser_id = response['browserId']
print(f"Created browser: {browser_id}")
```
 


API
    

  1. 
```text
awscurl -X PUT \
  "https://bedrock-agentcore-control.<Region>.amazonaws.com/browsers" \
  -H "Content-Type: application/json" \
  --service bedrock-agentcore-control \
  --region <Region> \
  -d '{
    "name": "my-managed-browser",
    "enterprisePolicies": [
      {
        "type": "MANAGED",
        "location": {
          "s3": {
            "bucket": "my-policy-bucket",
            "prefix": "policies/managed-policies.json"
          }
        }
      }
    ]
  }'
```
 


## Starting a session with recommended policies

Recommended policies can be applied to sessions using the default browser ( `aws.browser.v1` ) as well as custom browsers that may already include managed policies.

###### Tip

For the default browser, set `browserIdentifier` to `aws.browser.v1`.

###### Example

AWS CLI
    

  1. 
```bash
aws bedrock-agentcore start-browser-session \
  --region <Region> \
  --browser-identifier "<BrowserId>" \
  --name "my-session-with-policies" \
  --session-timeout-seconds 1800 \
  --enterprise-policies '[
    {
      "type": "RECOMMENDED",
      "location": {
        "s3": {
          "bucket": "my-policy-bucket",
          "prefix": "policies/recommended-policies.json"
        }
      }
    }
  ]'
```
 


Boto3
    

  1. 
```python
import boto3

region = "us-west-2"
client = boto3.client('bedrock-agentcore', region_name=region)

response = client.start_browser_session(
    browserIdentifier="<BrowserId>",
    name="my-session-with-policies",
    sessionTimeoutSeconds=1800,
    enterprisePolicies=[
        {
            "type": "RECOMMENDED",
            "location": {
                "s3": {
                    "bucket": "my-policy-bucket",
                    "prefix": "policies/recommended-policies.json"
                }
            }
        }
    ]
)

print(f"Session ID: {response['sessionId']}")
```
 


API
    

  1. 
```text
awscurl -X PUT \
  "https://bedrock-agentcore.<Region>.amazonaws.com/browsers/<BrowserId>/sessions/start" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  --service bedrock-agentcore \
  --region <Region> \
  -d '{
    "name": "my-session-with-policies",
    "sessionTimeoutSeconds": 1800,
    "enterprisePolicies": [
      {
        "type": "RECOMMENDED",
        "location": {
          "s3": {
            "bucket": "my-policy-bucket",
            "prefix": "policies/recommended-policies.json"
          }
        }
      }
    ]
  }'
```
 


## Considerations

  * You can specify up to 10 enterprise policy files.

  * Each policy file must have a `.json` extension and cannot exceed 5 MB in size.

  * The Amazon S3 bucket must be in the same region as the browser.

  * Policy files are read from Amazon S3 at the time of the API call. Changes to policy files in Amazon S3 after calling `CreateBrowser` or `StartBrowserSession` are not reflected.

  * Policy JSON files must contain valid keys from the [Chrome Enterprise Policy List](<https://chromeenterprise.google/policies/>).



