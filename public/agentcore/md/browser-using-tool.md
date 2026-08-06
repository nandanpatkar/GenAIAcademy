# Using Browser Tool - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-using-tool.html

---

# Using Browser Tool

## Creating an AgentCore Browser

You can create a Browser Tool using the Amazon Bedrock AgentCore console, AWS CLI, or AWS SDK.

###### Example

Console
    

  1. **To create a Browser Tool using the console**

  2. Open the AgentCore console at [https://console.aws.amazon.com/bedrock-agentcore/home#](<https://console.aws.amazon.com/bedrock-agentcore/home#>).

  3. In the navigation pane, choose **Built-in tools**.

  4. Choose **Create browser tool**.

  5. Provide a unique **Tool name** and optional **Description**.

  6. Under **Network settings** , choose **Public network** which allows access to public internet resources.

  7. Under **Session recording** , you can enable recording of browser sessions to an S3 bucket for later review.

  8. Under **Permissions** , specify an IAM execution role that defines what AWS resources the Browser Tool can access.

  9. Choose **Create**.


AWS CLI
    

  1. To create a Browser Tool using the AWS CLI, use the `create-browser` command:

```bash
aws bedrock-agentcore-control create-browser \
  --region <Region> \
  --name "my-browser" \
  --description "My browser for web interaction" \
  --network-configuration '{
    "networkMode": "PUBLIC"
  }' \
  --recording '{
    "enabled": true,
    "s3Location": {
      "bucket": "my-bucket-name",
      "prefix": "sessionreplay"
    }
  }' \
  --execution-role-arn "arn:aws:iam::123456789012:role/my-execution-role"
```
Boto3
    

  1. To create a Browser Tool using the AWS SDK for Python (Boto3), use the `create_browser` method:

**Request Syntax**

The following shows the request syntax:

```text
response = cp_client.create_browser(
    name="my_custom_browser",
    description="Test browser for development",
    networkConfiguration={
        "networkMode": "PUBLIC"
    },
    executionRoleArn="arn:aws:iam::123456789012:role/Sessionreplay",
    clientToken=str(uuid.uuid4()),
    recording={
    "enabled": True,
    "s3Location": {
        "bucket": "session-record-123456789012",
        "prefix": "replay-data"
      }
    }
)
```
API
    

  1. To create a new browser instance using the API, use the following call:

```bash
# Using awscurl
awscurl -X PUT \
  "https://bedrock-agentcore-control.<Region>.amazonaws.com/browsers" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  --service bedrock-agentcore \
  --region <Region> \
  -d '{
    "name": "test_browser_1",
    "description": "Test sandbox for development",
    "networkConfiguration": {
      "networkMode": "PUBLIC"
    },
    "recording": {
      "enabled": true,
      "s3Location": {
        "bucket": "<your-bucket-name>",
        "prefix": "sessionreplay"
      }
    },
    "executionRoleArn": "arn:aws:iam::123456789012:role/my-execution-role"
  }'
```
## Get AgentCore Browser tool

You can get information about the Browser tool in your account and view their details, status, and configurations.

###### Example

Console
    

  1. **To get information about the Browser tool using the console**

  2. Open the AgentCore console at [https://console.aws.amazon.com/bedrock-agentcore/home#](<https://console.aws.amazon.com/bedrock-agentcore/home#>).

  3. In the navigation pane, choose **Built-in tools**.

  4. The browser tools are listed in the **Browser tools** section.

  5. You can choose a tool that you created to view it’s details such as name, ID, status, and creation date for each browser tool.


AWS CLI
    

  1. To get information about a Browser tool using the AWS CLI, use the `get-browser` command:

```bash
aws bedrock-agentcore-control get-browser \
  --region <Region> \
  --browser-id "<your-browser-id>"
```
Boto3
    

  1. To get information about the Browser tool using the AWS SDK for Python (Boto3), use the `get_browser` method:

**Request Syntax**

The following shows the request syntax:

```text
response = cp_client.get_browser(
    browserId="<your-browser-id>"
)
```
API
    

  1. To get the browser tool using the API, use the following call:

```bash
# Using awscurl
awscurl -X GET \
  "https://bedrock-agentcore-control.<Region>.amazonaws.com/browsers/<your-browser-id>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  --service bedrock-agentcore \
  --region <Region>
```
## Listing AgentCore Browser tools

You can list all browser tools in your account to view their details, status, and configurations.

###### Example

Console
    

  1. **To list browser tools using the console**

  2. Open the AgentCore console at [https://console.aws.amazon.com/bedrock-agentcore/home#](<https://console.aws.amazon.com/bedrock-agentcore/home#>).

  3. In the navigation pane, choose **Built-in tools**.

  4. The browser tools are listed in the **Browser tools** section.

  5. You can view details such as name, ID, status, and creation date for each browser tool.


AWS CLI
    

  1. To list browser tools using the AWS CLI, use the `list-browsers` command:

```bash
aws bedrock-agentcore-control list-browsers \
  --region <Region>
```
You can filter the results by type:

```bash
aws bedrock-agentcore-control list-browsers \
  --region <Region> \
  --type SYSTEM
```
You can also limit the number of results and use pagination:

```bash
aws bedrock-agentcore-control list-browsers \
  --region <Region> \
  --max-results 10 \
  --next-token "<your-pagination-token>"
```
Boto3
    

  1. To list browser tools using the AWS SDK for Python (Boto3), use the `list_browsers` method:

**Request Syntax**

The following shows the request syntax:

```text
response = cp_client.list_browsers(type="CUSTOM")
```
API
    

  1. To list browser tools using the API, use the following call:

```bash
# Using awscurl
awscurl -X POST \
  "https://bedrock-agentcore-control.<Region>.amazonaws.com/browsers" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  --service bedrock-agentcore \
  --region <Region>
```
You can filter the results by type:

```text
awscurl -X POST \
  "https://bedrock-agentcore-control.<Region>.amazonaws.com/browsers?type=SYSTEM" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  --service bedrock-agentcore \
  --region <Region>
```
You can also limit the number of results and use pagination:

```text
awscurl -X POST \
  "https://bedrock-agentcore-control.<Region>.amazonaws.com/browsers?maxResults=1&nextToken=<your-pagination-token>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  --service bedrock-agentcore \
  --region <Region>
```
## Deleting an AgentCore Browser

When you no longer need a browser tool, you can delete it to free up resources. Before deleting a browser tool, make sure to stop all active sessions associated with it.

###### Example

Console
    

  1. **To delete a Browser tool using the console**

  2. Open the AgentCore console at [https://console.aws.amazon.com/bedrock-agentcore/home#](<https://console.aws.amazon.com/bedrock-agentcore/home#>).

  3. Navigate to **Built-in tools** and select your browser tool.

  4. Choose **Delete** from the **Actions** menu.

  5. Confirm the deletion by typing the browser tool name in the confirmation dialog.

  6. Choose **Delete**.

###### Note

You cannot delete a browser tool that has active sessions. Stop all sessions before attempting to delete the tool.


AWS CLI
    

  1. To delete a Browser tool using the AWS CLI, use the `delete-browser` command:

```bash
aws bedrock-agentcore-control delete-browser \
  --region <Region> \
  --browser-id "<your-browser-id>"
```
Boto3
    

  1. To delete a Browser tool using the AWS SDK for Python (Boto3), use the `delete_browser` method:

**Request Syntax**

The following shows the request syntax:

```text
response = cp_client.delete_browser(
    browserId="<your-browser-id>"
    )
```
API
    

  1. To delete a browser tool using the API, use the following call:

```bash
# Using awscurl
awscurl -X DELETE \
  "https://bedrock-agentcore-control.<Region>.amazonaws.com/browsers/<your-browser-id>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  --service bedrock-agentcore-control \
  --region <Region>
```
