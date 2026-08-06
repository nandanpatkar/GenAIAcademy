# Using browser extensions - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-extensions.html

---

# Using browser extensions

Browser Extensions allow you to install custom extensions into browser sessions at session creation time. This enables you to customize browser behavior with your own extensions for automation tasks, web scraping, testing, and more.

## Overview

Browser Extensions in Amazon Bedrock AgentCore work as follows:

  1. You provide a list of browser extension ZIP files stored in your own Amazon S3 buckets

  2. The service validates that you have access to these Amazon S3 objects using your credentials

  3. During browser session startup, extensions are downloaded from your Amazon S3 bucket and installed to the browser session


## Prerequisites

Before using browser extensions, ensure you have:

  * Completed the general Browser [Prerequisites](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-quickstart.html#browser-prerequisites>)

  * An Amazon Amazon S3 bucket to store your extension ZIP files

  * IAM permissions to access the Amazon S3 bucket containing your extensions. Add the following permissions to your IAM policy:

```json
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ExtensionS3Access",
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:GetObjectVersion"
            ],
            "Resource": [
                "arn:aws:s3:::<S3Bucket>/<path_to_extensions>/*"
            ]
        }
    ]
}
```
###### Note

The Amazon S3 bucket must be in the same AWS account as the browser session. Extensions have a 10 MB file size limit and a maximum of 10 extensions per session.


## Preparing Extension Files

To prepare an extension for use with Browser Tool:

  1. **Create a Chrome Extension**

Your extension should follow the standard Chromium extension format and adhere to [Chromium extension guidelines](<https://www.chromium.org/developers/design-documents/extensions/>) . Each extension must include a valid `manifest.json` file.

  2. **Create a ZIP File**

Zip the extension directory contents (not the parent folder):

```bash
cd my-extension
zip -r ../my-extension.zip.
```
  3. **Upload to S3**

Upload the ZIP file to your Amazon S3 bucket:

```bash
aws s3 cp my-extension.zip s3://my-extensions-bucket/extensions/my-extension.zip
```
## Creating a browser session with extensions

You can create a browser session with extensions using the AWS CLI, SDK, or API.

###### Example

AWS CLI
    

  1. To start a browser session with extensions using the AWS CLI:

```bash
aws bedrock-agentcore start-browser-session \
  --region <Region> \
  --browser-identifier "aws.browser.v1" \
  --name "my-session-with-extensions" \
  --session-timeout-seconds 1800 \
  --extensions '[
    {
      "location": {
        "s3": {
          "bucket": "my-extensions-bucket",
          "prefix": "extensions/my-extension.zip"
        }
      }
    }
  ]'
```
Boto3
    

  1. To start a browser session with extensions using the AWS SDK for Python (Boto3):

```python
import boto3

region = "us-west-2"
client = boto3.client('bedrock-agentcore', region_name=region)

response = client.start_browser_session(
    browserIdentifier="aws.browser.v1",
    name="my-session-with-extensions",
    sessionTimeoutSeconds=1800,
    viewPort={
        'height': 1080,
        'width': 1920
    },
    extensions=[
        {
            "location": {
                "s3": {
                    "bucket": "my-extensions-bucket",
                    "prefix": "extensions/my-extension.zip"
                }
            }
        },
        {
            "location": {
                "s3": {
                    "bucket": "my-extensions-bucket",
                    "prefix": "extensions/another-extension.zip",
                    "versionId": "abc123"  # Optional - for versioned S3 buckets
                }
            }
        }
    ]
)

print(f"Session ID: {response['sessionId']}")
print(f"Status: {response['status']}")
print(f"Automation Stream: {response['streams']['automationStream']['streamEndpoint']}")
```
API
    

  1. To start a browser session with extensions using the API:

```bash
# Using awscurl
awscurl -X PUT \
  "https://bedrock-agentcore.<Region>.amazonaws.com/browsers/aws.browser.v1/sessions/start" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  --service bedrock-agentcore \
  --region <Region> \
  -d '{
    "name": "my-session-with-extensions",
    "sessionTimeoutSeconds": 1800,
    "viewPort": {
      "height": 1080,
      "width": 1920
    },
    "extensions": [
      {
        "location": {
          "s3": {
            "bucket": "my-extensions-bucket",
            "prefix": "extensions/my-extension.zip"
          }
        }
      },
      {
        "location": {
          "s3": {
            "bucket": "my-extensions-bucket",
            "prefix": "extensions/another-extension.zip"
          }
        }
      }
    ]
  }'
```
