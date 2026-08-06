# AWS Lambda function targets - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-add-target-lambda.html

---

# AWS Lambda function targets

Lambda targets allow you to connect your gateway to AWS Lambda functions that implement your tools. This is useful when you want to execute custom code in response to tool invocations.

You create a Lambda function using the AWS Lambda service. In order to create the function, you should do the following:

  * Create a tool schema that defines the tools that your Lambda function can call.

  * Understand the Lambda input format. You can then follow the steps in the [AWS Lambda Developer Guide](<https://docs.aws.amazon.com/lambda/latest/dg/>) for **Building with** the language of your choice.


After you create the function, you configure permissions for the gateway to be able to access it.

Review the key considerations and limitations to help you decide whether a Lambda target is applicable to your use case. If it is, you can create the tool schema and the Lambda function and then set up permissions for the gateway to be able to access the target. Select a topic to learn more:

###### Topics

  * Key considerations and limitations

  * Lambda function tool schema

  * Lambda function input format


## Key considerations and limitations

When working with Lambda targets, be aware of the following limitations and considerations:

  * Tool name prefixes will need to be manually stripped off from the toolname in your AWS Lambda function. For more information, see [Understand how AgentCore Gateway tools are named](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-tool-naming.html>).

  * If you are using an existing AWS Lambda function and import it as a tool into the gateway, you will need to change the function code to account for a schema change for event and context objects

  * The Lambda function must return a valid JSON response that can be parsed by the gateway

  * Lambda function timeouts should be configured appropriately to handle the expected processing time of your tools

  * Consider implementing error handling in your LLambda function to provide meaningful error messages to the client


## Lambda function tool schema

This section explains the structure of the tool schema that defines a tool that your Lambda function can return. After you define your tool schema, you can do one of the following:

  * Upload it to an Amazon S3 bucket and refer to the S3 location when you add the target to your gateway.

  * Paste the definition inline when you add the target to your gateway.


Select a topic to learn more about the details of the tool schema or to see examples:

###### Topics

  * Tool definition

  * Top level schema definition for input and output schemas

  * Property schema definition

  * Example Lambda tool definitions


### Tool definition

When you add a Lambda function as a gateway target, you provide a [ToolDefinition](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_ToolDefinition.html>) when providing the target configuration. The structure of the tool definition is as follows:

```json
{
    "name": "string",
    "description": "string",
    "inputSchema": {
        "type": "object",
        "description" "string",
        "properties": {
            "string": SchemaDefinition
        },
        "required": ["string"]
    },
    "outputSchema": {
        "type": "object",
        "description" "string",
        "properties": {
            "string": SchemaDefinition
        },
        "required": ["string"]
    }
}
```
The tool definition contains the following fields:

  * **name** (required) – The name of the tool.

  * **description** (required) – A description of the tool and its purpose and usage.

  * **inputSchema** (required) – A JSON object that defines the structure of the input that the tool accepts.

  * **outputSchema** (optional) – A JSON object that defines the structure of the output that the tool produces.


The `inputSchema` and `outputSchema` fields both map to an object-type [SchemaDefinition](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_SchemaDefinition.html>) , described in the following section.

### Top level schema definition for input and output schemas

The `inputSchema` and `outputSchema` fields at the top level of the tool definition both map to an object-type [SchemaDefinition](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_SchemaDefinition.html>) that contains the following fields:

```json
{
    "type": "object",
    "description": "string",
    "properties": {
        "string": SchemaDefinition
    },
    "required": ["string"]
}
```
  * **type** (required) – Must be `object`.

  * **description** (optional) – A description of the schema and its purpose and usage.

  * **properties** (optional) – A JSON object that defines the properties or arguments of the tool. Each key is a name of a property and maps to a [SchemaDefinition](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_SchemaDefinition.html>) object that defines the property.

  * **required** (optional) – An array that enumerates the properties that are required in the `properties` object.


If you include a `properties` field to define arguments for the tool, you provide a schema definition for each argument. The different types of schema definitions are outlined in the next section.

### Property schema definition

Each property in the top level `SchemaDefinition` maps to a [SchemaDefinition](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_SchemaDefinition.html>) object that has slightly different requirements from the top level schema definition. The available fields depend on the `type` for the property. To see the shape of the `SchemaDefinition` for a type, select from the following tabs:

###### Example

String
    

  1. The `SchemaDefinition` for a string property has the following structure:

```json
{
    "type": "string",
    "description": "string"
}
```
Number
    

  1. The `SchemaDefinition` for a number property has the following structure:

```json
{
    "type": "number",
    "description": "string"
}
```
Integer
    

  1. The `SchemaDefinition` for a integer property has the following structure:

```json
{
    "type": "integer",
    "description": "string"
}
```
Boolean
    

  1. The `SchemaDefinition` for a boolean property has the following structure:

```json
{
    "type": "boolean",
    "description": "string"
}
```
Array
    

  1. The `SchemaDefinition` for an array property has the following structure:

```json
{
    "type": "array",
    "description": "string",
    "items": SchemaDefinition
}
```
The value of the `items` field is a `SchemaDefinition` that defines the structure of each item in the array.


Object
    

  1. The `SchemaDefinition` for an object property has the following structure and matches the top level property schema definition.

```json
{
    "type": "object",
    "description": "string",
    "properties": {
        "string": SchemaDefinition
    },
    "required": ["string"]
}
```
If you include another object-type property, you will recursively add another `SchemaDefinition`.

### Example Lambda tool definitions

Select a tab to see example tool definitions that you can include in your Lambda function.

###### Example

Weather tool
    

  1. The following `get_weather` tool requires a `location` string argument and can be used to return the weather for that location:

```json
{
    "name": "get_weather",
    "description": "Get weather for a location",
    "inputSchema": {
        "type": "object",
        "properties": {
            "location": {
                "type": "string",
                "description": "the location e.g. seattle, wa"
            }
        },
        "required": [
            "location"
        ]
    }
}
```
Time tool
    

  1. The following `get_time` tool requires a `timezone` string argument and can be used to return the time for that timezone:

```json
{
    "name": "get_time",
    "description": "Get time for a timezone",
    "inputSchema": {
        "type": "object",
        "properties": {
            "timezone": {
                "type": "string"
            }
        },
        "required": [
            "timezone"
        ]
    }
}
```
## Lambda function input format

When an Amazon Bedrock AgentCore gateway invokes a Lambda function, it passes an `event` object and a `context` object to the function. The Lambda event handler that you write can access values in these objects.

**Event object**

A map of `properties` from the `inputSchema` to their values, as returned by the tool. For example, if your input schema contains the properties `keywords` and `category` , the event object could be the following:

```json
{
  "keywords": "wireless headphones",
  "category": "electronics"
}
```
**Context object**

Contains the following metadata:

  * bedrockAgentCoreMessageVersion – The version of the message.

  * bedrockAgentCoreAwsRequestId – The ID of the request made to the Amazon Bedrock AgentCore service.

  * bedrockAgentCoreMcpMessageId – The ID of the message sent to the MCP server.

  * bedrockAgentCoreGatewayId – The ID of the gateway that was invoked.

  * bedrockAgentCoreTargetId – The ID of the gateway target that was invoked.

  * bedrockAgentCoreToolName– The name of the tool that was called. The tool name is in the format `${target_name}` ___ `${tool_name}`.


The format of the context object is as follows:

```json
{
  "bedrockAgentCoreMessageVersion": "1.0",
  "bedrockAgentCoreAwsRequestId": "string",
  "bedrockAgentCoreMcpMessageId": "string",
  "bedrockAgentCoreGatewayId": "string",
  "bedrockAgentCoreTargetId": "string",
  "bedrockAgentCoreToolName": "string"
}
```
The Lambda function that you write can access the properties of the event and context object. You can use the following boilerplate code to get started:

```bash
# Access context properties in your Lambda function
def lambda_handler(event, context):
    # Since the visible tool name includes the target name as a prefix, we can use this delimiter to strip the prefix
    delimiter = "___"

    # Get the tool name from the context
    originalToolName = context.client_context.custom['bedrockAgentCoreToolName']
    toolName = originalToolName[originalToolName.index(delimiter) + len(delimiter):]

    # Get other context properties
    message_version = context.client_context.custom['bedrockAgentCoreMessageVersion']
    aws_request_id = context.client_context.custom['bedrockAgentCoreAwsRequestId']
    mcp_message_id = context.client_context.custom['bedrockAgentCoreMcpMessageId']
    gateway_id = context.client_context.custom['bedrockAgentCoreGatewayId']
    target_id = context.client_context.custom['bedrockAgentCoreTargetId']

    # Process the request based on the tool name
    if tool_name == 'searchProducts':
        # Handle searchProducts tool
        pass
    elif tool_name == 'getProductDetails':
        # Handle getProductDetails tool
        pass
    else:
        # Handle unknown tool
        pass
```
