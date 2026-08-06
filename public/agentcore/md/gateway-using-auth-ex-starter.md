# Example: Authorization for the default gateway and target created by the AgentCore CLI - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-using-auth-ex-starter.html

---

# Example: Authorization for the default gateway and target created by the AgentCore CLI

If you used the AgentCore CLI to create a gateway and a Lambda target, the CLI configures JWT-based inbound authorization and IAM-based outbound authorization for you automatically.

###### Note

If you invoke your gateway using `agentcore invoke` , the CLI handles authentication automatically. The steps below are only needed if you want to invoke the gateway programmatically (for example, using the AWS SDK or `curl` ).

For programmatic access, you’ll authorize with the following:

  * **Inbound authorization using JWT** – Obtain the access token from the Amazon Cognito authorization that was automatically set up for you and include it in the authorization header. See the example below to learn how to obtain the token.

  * **Outbound authorization using IAM** – The AgentCore CLI configures the following permissions for you, so you don’t need any additional setup:

    * Your gateway service role has permissions to invoke all functions in Lambda (provided by the [BedrockAgentCoreFullAccess](<https://docs.aws.amazon.com/aws-managed-policy/latest/reference/BedrockAgentCoreFullAccess.html>) managed policy).

    * The created Lambda function is configured with your gateway service role as a `Principal` that can invoke it.


You can obtain the access token created for your gateway by the AgentCore CLI with the help of Amazon Cognito by collecting the following information:

  * **Token endpoint** – Find at the **Discovery URL** in the authorizer configuration for the gateway. If you use the API, you can find the discovery URL by sending a [ListGateways](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_ListGateways.html>) request or a [GetGateway](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_GetGateway.html>) request for your gateway.

  * **Client ID** – Find in the Amazon Cognito user pool information. If you use the API, you can send a [ListUserPools](<https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_ListUserPools.html>) request or a [DescribeUserPool](<https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_DescribeUserPool.html>) request for the user pool associated with your gateway.

  * **Client secret** – Find in the Amazon Cognito user pool app client information. If you use the API, you can send a [DescribeUserPoolClient](<https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_DescribeUserPoolClient.html>) request, specifying the client ID and user pool ID associated with your gateway.


First, collect these values with one of the following methods. Select one of the following methods:

###### Example

Console
    

  1. Get the **token endpoint** :

     1. Open the AgentCore console at [https://console.aws.amazon.com/bedrock-agentcore/home#](<https://console.aws.amazon.com/bedrock-agentcore/home#>).

     2. From the left navigation pane, choose **Gateways**.

     3. In the **Gateways** section, select your gateway.

     4. In the **Inbound Identity** section, note the following values:

        * **Allowed clients** – The client IDs that can access the gateway.

        * **Discovery URL** – The format should be `https://cognito-idp.${Region}.amazonaws.com/${UserPoolId}/.well-known/openid-configuration` . Store the following values:

          * `${UserPoolId}` – Extract from the Discovery URL.

          * **Token endpoint** – Select the Discovery URL link and find the value in the `token_endpoint` field.

  2. Get the **client ID** and **client secret** :

     1. Open the Amazon Cognito console at [https://console.aws.amazon.com/cognito](<https://console.aws.amazon.com/cognito>).

     2. From the left navigation pane, select **User pools**.

     3. Select the user pool ID associated with your gateway.

     4. From the left navigation pane, choose **App clients**.

     5. Select an app client whose **Client ID** matches the allowed clients for your token endpoint. Store the ID value.

     6. Under **Client secret** , select **Show client secret** and store that value.


AWS CLI
    

  1. Run the AgentCore `get-gateway` command in a terminal and specify your gateway ID in the `--gateway-identifier` argument, as in the following example:

```bash
aws bedrock-agentcore-control get-gateway --gateway-identifier my-gateway-id
```
  2. From the response, note the `discoveryUrl` from the `authorizerConfiguration` field:

     * Store the `${UserPoolId}` from the URL. The format should be `https://cognito-idp.${Region}.amazonaws.com/${UserPoolId}/.well-known/openid-configuration`.

     * Store the `allowedClients` values. These are the client IDs that can access the token endpoint.

     * Navigate to the `discoveryUrl` in a browser and store the `token_endpoint` value.

  3. Run the Amazon Cognito `describe-user-pool-client` command in a terminal and specify the user pool ID in the `--user-pool-id` argument and an allowed client ID in the `--client-id` field, as in the following example:

```bash
aws cognito-idp describe-user-pool-client --user-pool-id my-user-pool-id --client-id my-client-id
```
  4. Store the `ClientSecret` value.


AWS Python SDK (Boto3)
    

  1. Run the following Python code to store the token endpoint, client ID, and client secret as variables:

```python
import requests
  import boto3

  # Initialize AWS clients
  agentcore_client = boto3.client("bedrock-agentcore-control")
  cognito_client = boto3.client("cognito-idp")

  # Replace with your actual gateway ID
  gateway_id = "my-gateway-id"

  # Get discovery URL and first allowed client
  auth_config = agentcore_client.get_gateway(gatewayIdentifier=gateway_id)["authorizerConfiguration"]["customJWTAuthorizer"]
  discovery_url, client_id = auth_config["discoveryUrl"], auth_config["allowedClients"][0]

  # Get token endpoint from discovery URL
  discovery_url_json = requests.get(discovery_url).json()
  token_endpoint, user_pool_id = discovery_url_json["token_endpoint"], discovery_url_json["issuer"].split("/")[-1]

  # Get client secret
  client_secret = cognito_client.describe_user_pool_client(
      UserPoolId=user_pool_id,
      ClientId=client_id
  )["UserPoolClient"]["ClientSecret"]
```
Second, use the values you gathered to access the token from the token endpoint. Select one of the following methods:

###### Example

curl
    

  1. Run the following command in a terminal, replacing the token endpoint, client ID, and client secret values.

```bash
curl --http1.1 -X POST ${TokenEndpoint} \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "grant_type=client_credentials&client_id=${ClientId}&client_secret=${ClientSecret}"
```
The token is in the `access_token` field of the response, while the `token_type` field should specify `Bearer`.


Python requests package
    

  1. Run the following Python code to obtain your access token. The code assumes that you stored the `token_endpoint` , `client_id` , and `client_secret` values from the previous step:

```python
import requests
  import json

  def get_access_token(token_endpoint, client_id, client_secret):
      headers={
          "Content-Type": "application/x-www-form-urlencoded"
      }

      payload={
          "grant_type": "client_credentials",
          "client_id": client_id,
          "client_secret": client_secret
      }

      response = requests.post(token_endpoint, headers=headers, data=payload)
      return response.json()

  # Replace the argument values as necessary, if you didn't previously store them as these variables
  access_token_response = get_access_token(
      token_endpoint=token_endpoint,
      client_id=client_id,
      client_secret=client_secret
  )

  access_token = access_token_response["access_token"]
```
