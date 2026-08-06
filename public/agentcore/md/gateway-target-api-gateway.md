# Amazon API Gateway REST API stages as targets - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-api-gateway.html

---

# Amazon API Gateway REST API stages as targets

An API Gateway REST API target connects your gateway to a [stage](<https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-stages.html>) of your REST API. The gateway translates incoming MCP requests into HTTP requests to your REST API and handles response formatting. When you add or update an API Gateway target, AgentCore Gateway calls API Gateway’s [GetExport](<https://docs.aws.amazon.com/apigateway/latest/api/API_GetExport.html>) API on your behalf.

You can specify tool filters and tool overrides in your target configuration. Tool filters let you make specific resource path and HTTP method combinations available as tools on your gateway. These filters create an allow list that exposes only the operations you specify as tools.

You can also configure your API Gateway REST API stage as a gateway target from the API Gateway console. To learn more, see [Add a stage to an AgentCore gateway](<https://docs.aws.amazon.com/apigateway/latest/developerguide/mcp-server.html>) in the Amazon API Gateway documentation.

###### Topics

  * Key considerations and limitations

  * API Gateway Tool Configuration

  * API Gateway export

  * Supported outbound authorization methods for an API Gateway API


## Key considerations and limitations

When using an API Gateway REST API stage as a target, keep in mind the following requirements and limitations:

  * Your API must be in the same account as your AgentCore Gateway.

  * Your API must be in the same Region as your AgentCore Gateway.

  * Your API must be an API Gateway REST API. We do not support API Gateway [HTTP APIs](<https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html>) or [WebSocket APIs.](<https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api.html>)

  * Your API must be configured with a public [endpoint type](<https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.htm>) . Private endpoints are not supported. To create a Gateway Target that can access resources in your VPC, you should use a public endpoint and an [API Gateway private integration](<https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-private-integration.html>).

  * If your REST API has a method that uses `AWS_IAM` authorization and requires an [API key](<https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html>) , AgentCore Gateway won’t support this method. It will be excluded from processing.

  * If your API uses a proxy resources, such as `/pets/{proxy+}` , AgentCore Gateway won’t support this method.

  * To set up your API Gateway Target, AgentCore Gateway calls API Gateway’s [GetExport](<https://docs.aws.amazon.com/apigateway/latest/api/API_GetExport.html>) API on your behalf to get an OpenAPI 3.0 formatted export of your REST API Definition. For more details on this and how it might affect your Target configuration, see API Gateway Export.


## API Gateway Tool Configuration

When you add an API Gateway REST API as a gateway target you need to provide an API Gateway tool configuration. The API Gateway tool configuration defines which operations from your REST API are exposed as tools. It requires a list of tool filters to select operations to expose, and optionally accepts tool overrides to customize tool metadata like tool names and descriptions.

### Tool Filters

Tool filters allow you to select REST API operations using path and method combinations. Each filter supports 2 path matching strategies:

  * **Explicit paths** – Matches a single specific path, such as `/pets/{petId}`

  * **Wildcard paths** – Matches all paths starting with the specified prefix, such as /pets/*


Each filter specifies both a path and a list of HTTP methods. The filter resolves to matching combinations that exist in your API. Multiple filters can overlap and duplicates are automatically de-duplicated.

### Tool Overrides

By default, the MCP tool name is taken from the `operationId` for each path and method combination that matches your filters. If there isn’t an `operationId` for a filter match, you’ll need a corresponding tool override that provides a name. If both the `operationId` and the override name are missing, target creation and updates will fail validation. For more information on tool names in AgentCore Gateway, see [Understand how AgentCore Gateway tools are named](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-tool-naming.html>).

Tool overrides are optional. They allow you to customize the tool name or description for specific operations after filtering. Each override must specify an explicit path and a single HTTP method. Wildcards are not supported. The override must match an operation that exists in your API and must correspond to one of the operations resolved by your filters. You cannot override operations that weren’t selected. If you are experiencing errors with imports from operations with out an `operationId` you can use a tool override instead.

### Example API Gateway tool configurations

The following example API Gateway tool configurations show how to use filters and overrides. All examples use an API with the following paths and methods:

```text
/pets/{petId} - GET
/pets/{petId}  - POST
/pets/{petId}  - OPTIONS
/pets          - GET
/pets          - OPTIONS
/              - GET
```
**Wild card path and list of methods**

Tool Configuration:

```json
{
  "filterPath": "/pets/*",
  "methods": ["GET", "POST"]
}
```
**Result**

  * `GET /pets/{petId}`

  * `POST /pets/{petId}`


**Explicit path and list of methods**

Tool Configuration:

```json
{
  "filterPath": "/pets/{petId}",
  "methods": ["GET", "POST"]
}
```
**Result**

  * `GET /pets/{petId}`

  * `POST /pets/{petId}`


**Explicit path and list of explicit method (most specific)**

Tool Configuration:

```json
{
  [
    {
        "filterPath": "/pets/{petId}",
        "methods": ["POST"]
    },
    {
        "filterPath": "/pets/{petId}",
        "methods": ["GET"]
    }
  ]
}
```
**Result**

  * `GET /pets/{petId}`

  * `POST /pets/{petId}`


**Mix and match an explicit and wildcard path:**

Tool Configuration:

```json
{
  [
    {
        "filterPath": "/pets/{petId}",
        "methods": ["GET"]
    },
    {
        "filterPath": "/*",
        "methods": ["GET"]
    }
  ]
}
```
**Result**

  * `GET /pets/{petId}`

  * `GET /pets/`


**Tool filter and tool override**

You can provide a tool filter and add an override. The override specifies a resource path in the REST API, such as /pets, and an HTTP method to expose for the specified path. The override must explicitly match an existing path in the REST API.

Tool Configuration

```json
{
  "toolFilters": [
    {
      "filterPath": "/pets/*",
      "methods": ["GET", "POST"]
    },
    {
      "filterPath": "/",
      "methods": ["GET"]
    }
  ],
  "toolOverrides": [
    {
      "path": "/pets/{petId}",
      "method": "GET",
      "name": "GetPetById",
      "description": "Retrieve a specific pet by its ID"
    }
  ]
}
```
**Result**

  * `GET /pets/{petId}` – matched by the first `toolFilter` , but the name and description will be overridden based on the entry in `toolOverrides`

  * `POST /pets/{petId}` – matched by the first `toolFilter` but will use the `operationId` and `description` from the exported OpenAPI spec for tool name and description

  * `GET /` – matched by the second, explicit tool filter that names a path and a single method


## API Gateway export

To set up your API Gateway target, AgentCore Gateway calls the [GetExport](<https://docs.aws.amazon.com/apigateway/latest/api/API_GetExport.html>) operation for API Gateway on your behalf to get an OpenAPI 3.0 formatted export of your API definition. This helps the gateway properly translate incoming MCP requests into HTTP requests and handle the response. The following are considerations for when AgentCore Gateway calls the GetExport operation:

  * The GetExport request is made with using a [Forward Access Session](<https://docs.aws.amazon.com/IAM/latest/UserGuide/access_forward_access_sessions.html>) and uses the caller’s credentials.

    * The caller creating the target must have permissions to call [GetExport](<https://docs.aws.amazon.com/apigateway/latest/api/API_GetExport.html>) on the API in API Gateway.

    * The `GetExport` request will be logged in CloudTrail.

  * The exported API is subject to the same [considerations and limitations](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-schema-openapi.html#gateway-schema-openapi-considerations>) as the OpenAPI target type.

  * The maximum size of an OpenAPI spec exported from API Gateway is 50 MB.


### Updating operationId on your REST API

###### Important

The exported OpenAPI specification must include `operationId` fields for all operations that you want to expose as tools. The `operationId` is used as the tool name in the MCP interface.

You can update your REST API to ensure that the OpenAPI definition returned by [GetExport](<https://docs.aws.amazon.com/apigateway/latest/api/API_GetExport.html>) has `operationId` set. This is an alternative to providing a tool override. The following explains 2 ways to set the `operationId`.

#### Set the operationID by updating your OpenAPI definition

Export the OpenAPI definition from your deployed API stage by calling [GetExport](<https://docs.aws.amazon.com/apigateway/latest/api/API_GetExport.html>) , updating the operations that are missing `operationId` , and reimporting your API.

  1. Export the OpenAPI definition from your deployed API stage by calling [GetExport](<https://docs.aws.amazon.com/apigateway/latest/api/API_GetExport.html>) . You can do this with the CLI:

```bash
aws apigateway get-export \
    --rest-api-id rest-api-id \
    --stage-name api-stage \
    --export-type oas30 \
    --parameters 'extensions=apigateway' \
    '/path/to/api_oas30_template.json'
```
  2. Edit the OpenAPI definition manually to add the `operationId` to operations that are missing the property.

  3. Import your updated OpenAPI definition with [PutRestApi](<https://docs.aws.amazon.com/apigateway/latest/api/API_PutRestApi.html>) . You can do this with the AWS CLI:

```bash
aws apigateway put-rest-api \
    --rest-api-id rest-api-id \
    --mode merge \
    --body 'fileb:///path/to/api_oas30_template.json'
```
  4. Redeploy your API to your stage with the AWS CLI:

```bash
aws apigateway create-deployment \
    --rest-api-id rest-api-id \
    --stage-name api-stage \
    --description 'deployment-description'
```
#### Set the `operationId` by updating your REST API’s method

You can configure your API Gateway [Method](<https://docs.aws.amazon.com/apigateway/latest/api/API_Method.html>) to add an `operationName` using the [UpdateMethod](<https://docs.aws.amazon.com/apigateway/latest/api/API_UpdateMethod.html>) command. When your API is exported, the `operationName` turns into the `operationId`.

  1. Call [UpdateMethod](<https://docs.aws.amazon.com/apigateway/latest/api/API_UpdateMethod.html>) with the AWS CLI:

```bash
aws apigateway update-method \
    --rest-api-id rest-api-id \
    --resource-id resource-id \
    --http-method http-method \
    --patch-operations '[
        {
          "op": "replace",
          "path": "/operationName",
          "value": operation-id
        }
      ]'
```
  2. Redeploy your API to your stage with the AWS CLI:

```bash
aws apigateway create-deployment \
    --rest-api-id rest-api-id \
    --stage-name api-stage \
    --description 'deployment-description'
```
## Supported outbound authorization methods for an API Gateway API

You can configure your AgentCore Gateway target to make calls to your API with outbound authentication.

**AgentCore Gateway supports the following types of outbound authorization for API Gateway Targets:**

  * **IAM-based outbound authorization** – Use the [gateway service role](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-prerequisites-permissions.html#gateway-service-role-permissions>) to authenticate access to the gateway target with [Signature Version 4 (SigV4 or SigV4a)](<https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv.html>) . Requires your API Gateway API to have IAM authorization enabled.

  * **API key** – call your API with an API key managed by AgentCore Gateway. This is not the same as [API keys](<https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html>) in API Gateway.

  * **No authorization (not recommended)** – Some target types provide you the option to bypass outbound authorization.


To learn more, see [Set up outbound authorization for your gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-outbound-auth.html>).

### IAM outbound authorization

API Gateway allows you to secure your REST API with IAM. When IAM authorization is enabled, clients must use [Signature Version 4 (SigV4 or SigV4a)](<https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv.html>) to sign their requests with AWS credentials.

**To set up IAM outbound authorization**

  1. Create an IAM role with the correct trust permissions according to [AgentCore Gateway service role permissions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-prerequisites-permissions.html#gateway-service-role-permissions>).

  2. Add a policy to your role to allow the action `execute-api:Invoke` along with a resource that corresponds to the REST API Id and Stage you used to set up your target, such as the following policy:

```json
{
"Version": "2012-10-17",
  "Statement": [
    {
        "Action": [
            "execute-api:Invoke"
        ],
        "Resource": "arn:aws:execute-api:aws-region:account-id:rest-api-id/api-stage/*/*",
        "Effect": "Allow"
    }
  ]
}
```
#### API Gateway resource policies

API Gateway resource policies are JSON policy documents that you attach to an API Gateway REST API to control whether a specified principal can invoke the API. In order for AgentCore Gateway to call your REST API with a resource policy you must do the following:

  * Set the method authorization type to `AWS_IAM` for any REST API method you make available as a tool.

  * Configure your resource policy to allow the `bedrock-agentcore.amazonaws.com` principal to call your service. You can add additional principals to the policy.


The following is an example of an API resource policy that grants AgentCore Gateway access to your REST API.

```json
{
"Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "bedrock-agentcore.amazonaws.com"
      },
      "Action": "execute-api:Invoke",
      "Resource": "arn:aws:execute-api:us-west-2:111122223333:abcd123/*/*/*",
      "Condition": {
        "ArnEquals": {
          "aws:SourceArn": "arn:aws:bedrock-agentcore:us-west-2:111122223333:gateway/my-gateway-d4jrgkaske"
        }
      }
    }
  ]
}
```
### API key outbound authorization

To set up outbound authorization with an API key, you use the AgentCore Identity service to create a credential provider and with an API key that you have configured for through API Gateway.

**To set up API key outbound authorization**

  1. Create an API Key in API Gateway according to [Set up API keys for REST APIs in API Gateway](<https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-setup-api-keys.html>).

  2. Follow the steps to [Set up outbound authorization with an API key](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-outbound-auth.html>) , providing the API key that you created through API Gateway.



