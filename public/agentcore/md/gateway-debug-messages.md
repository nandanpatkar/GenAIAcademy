# Turn on debugging messages - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-debug-messages.html

---

# Turn on debugging messages

While your gateway is in development, you can turn on debugging messages to return details on target configuration issues, including lambda function errors, egress authorizer errors, target specification parameter validation errors. After turning on debugging messages, if an issue occurs when you invoke your gateway, the response will return messages to help you debug.

**To turn on debugging messages, do one of the following:**

  * If you use the AgentCore CLI to create a gateway, debugging is automatically turned on.

  * If you use the AWS Management Console to create a gateway, debugging is turned on by default. The option is under **Additional configurations** in the **Gateway details** section.

  * If you use the AWS CLI or an AWS SDK, set the `exceptionLevel` value as `DEBUG` when you make a [CreateGateway](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateGateway.html>) or [UpdateGateway](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_UpdateGateway.html>) request.


When you’re done debugging your gateway, you can update the gateway to turn off debugging messages, such that the message to the end user only shows an unspecified internal error.

**To turn off debugging messages, do one of the following:**

  * In the AWS Management Console, expand **Additional configurations** in the **Gateway details** section when you create or edit a gateway and uncheck the checkbox next to **Exception level debug**.

  * In the AWS CLI or an AWS SDK, omit the `exceptionLevel` field when you make a `CreateGateway` or `UpdateGateway` request to turn off debugging.


## Example gateway responses with debugging turned on and off

As an example, suppose that the user doesn’t have permissions to invoke a Lambda function that is targeted by the gateway. A request that calls this function would return a different message depending on whether debugging is on or off:

  * **Debugging on** – A detailed error message would be returned in the content’s `text` field and also in the `_meta` field in the response, as in the following example:

```json
{
  "jsonrpc": "2.0",
  "id": 24,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Access denied while invoking Lambda function arn:aws:lambda:us-west-2:123456789012:function:TestGatewayLambda. Check the permissions on the Lambda function and Gateway execution role, and retry the request."
      }
    ],
    "_meta": {
      "debug": {
        "type": "text",
        "text": "Access denied while invoking Lambda function arn:aws:lambda:us-west-2:123456789012:function:TestGatewayLambda. Check the permissions on the Lambda function and Gateway execution role, and retry the request."
      }
    },
    "isError": true
  }
}
```
  * **Debugging off** – A generic error message would be returned in the content’s `text` field in the response, as in the following example:

```json
{
  "jsonrpc": "2.0",
  "id": 24,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "An internal error occurred. Please retry later."
      }
    ],
    "isError": true
  }
}
```
