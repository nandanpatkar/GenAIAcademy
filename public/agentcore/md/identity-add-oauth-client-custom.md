# Add OAuth client using custom provider - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-add-oauth-client-custom.html

---

# Add OAuth client using custom provider

Custom providers enable you to connect to any OAuth2-compatible resource server beyond the built-in provider options. You can configure custom providers by having the system retrieve configuration details automatically, or by providing the server information manually.

**To add an OAuth client using a custom provider**

  1. Open the [AgentCore Identity](<https://console.aws.amazon.com/bedrock-agentcore/identity>) console.

  2. In the **Outbound Auth** section, choose **Add OAuth client / API key** , and then select **Add OAuth client**.

  3. For **Name** , you can either use the auto-generated name or enter your own descriptive name to help you identify this OAuth client in your account. Use alphanumeric characters, hyphens, and underscores only, with a maximum length of 50 characters.

  4. For **Provider** , choose **Custom provider**.

  5. In the **Provider configurations** section, depending on your provider requirements, choose one of the following options:

     1. **Discovery URL** (recommended) – Choose this option to have AgentCore Identity automatically retrieve configuration details from your provider. You provide the discovery URL where your provider publishes its OpenID Connect configuration, and AgentCore Identity handles the endpoint discovery process. This is the recommended approach when available as it reduces manual configuration.

        1. For **Client authentication method** , choose the client authentication method used to authenticate with identity provider token endpoint. For more information, see [Client authentication methods](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./client-auth-methods.html>).

        2. For **Discovery URL** , enter the URL where your provider publishes its OpenID Connect configuration. Discovery URLs must end with `.well-known/openid-configuration` . For example, https:// `example.com` /.well-known/openid-configuration.

        3. For **Client ID** , enter the unique identifier you received when registering your application with the identity provider.

        4. If **Client authentication method** is `PRIVATE_KEY_JWT`, no client secret is required. For other methods, choose one of the following options for **Client secret selection method** :

           1. **Provide Client secret** – Enter the client secret value directly.

              1. For **Client secret** , enter the confidential key associated with your client ID that AgentCore Identity securely stores for authentication.

           2. **Provide Client secret via Secrets Manager** – Reference a secret stored in AWS Secrets Manager instead of entering the value directly.

              1. For **Secrets Manager** , enter or select the ARN of the Secrets Manager secret that contains your client secret.

              2. For **JSON key** , enter the JSON key in your Secrets Manager secret that contains the client secret value for your OAuth client.

     2. **Manual config** – Choose this option to specify server information directly when your provider doesn’t support automatic discovery. You’ll define each endpoint URL individually, giving you complete control over the configuration details.

        1. For **Client authentication method** , choose the client authentication method used to authenticate with identity provider token endpoint. For more information, see [Client authentication methods](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./client-auth-methods.html>).

        2. For **Issuer** , enter the base URL that identifies your authorization server. This value appears in the `iss` claim of issued tokens and helps verify token authenticity.

        3. For **Authorization endpoint** , enter the URL where users will be directed to grant permission to your application. This is the entry point for the OAuth authorization flow.

        4. For **Token endpoint** , enter the URL where your agent exchanges authorization codes for access tokens. This endpoint handles the credential exchange process.

        5. (Optional) In the **Response types** section, configure how your OAuth client receives authentication responses by choosing **Add response type** and selecting the token formats your provider should return. Common types include `code` for authorization code flow or `token` for implicit flow.

        6. For **Client ID** , enter the unique identifier you received when registering your application with the identity provider.

        7. If **Client authentication method** is `PRIVATE_KEY_JWT`, no client secret is required. For other methods, choose one of the following options for **Client secret selection method** :

           1. **Provide Client secret** – Enter the client secret value directly.

              1. For **Client secret** , enter the confidential key associated with your client ID that AgentCore Identity securely stores for authentication.

           2. **Provide Client secret via Secrets Manager** – Reference a secret stored in AWS Secrets Manager instead of entering the value directly.

              1. For **Secrets Manager** , enter or select the ARN of the Secrets Manager secret that contains your client secret.

              2. For **JSON key** , enter the JSON key in your Secrets Manager secret that contains the client secret value for your OAuth client.

  6. (Optional) Expand **Additional configurations** to configure on-behalf-of token exchange. Choose one of the following Grant type modes:

     1. **None** : On-behalf-of token exchange is not supported

     2. **JWT authorization grant** : perform on-behalf-of token exchange using RFC 7523 syntax. Inbound identity is used as authorization grant to obtain access token

     3. **Token exchange** : perform on-behalf-of token exchange using RFC 8693 syntax. It is the most recent standard to capture the delegation relationship. You can customize the actor token using the following modes:

        1. **None** : Actor token will not be provided in the request

        2. **AWS IAM ID Token JWT** : Authenticate using a signed JWT issued by AWS IAM that represents calling AWS identity as actor token

        3. **Machine to Machine (M2M)** : Authenticate using [machine-to-machine (M2M)](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./common-use-cases.html#machine-to-machine-auth>) access token as actor token

           1. (Optional) Provide **Actor token scopes** to use as scope parameters when authenticating

  7. (Optional) Expand **Additional configurations** to configure a private endpoint for connecting to an identity provider hosted inside your VPC. Choose one of the following modes:

     1. **Managed VPC** : AgentCore creates and manages the VPC resources on your behalf. This is the simpler option for in-account VPC connectivity.

        1. For **VPC** , select your VPC identifier.

        2. For **Subnets** , select one or more subnets that have network access to your IdP.

        3. For **IP address type** , choose `IPV4` or `IPV6`.

        4. (Optional) For **Security groups** , select security groups that allow traffic to your IdP.

     2. **Self-managed Lattice** : You create and manage the VPC Lattice resource gateway and resource configuration yourself. This option supports cross-account connectivity via AWS RAM and provides full governance visibility.

        1. For **Resource configuration ARN** , select the ARN of your VPC Lattice resource configuration.

        2. (Optional) For **Domain overrides** , enter additional domains that should be routed through the private endpoint. Use this when your identity provider endpoints (such as token or authorization endpoints) are hosted on different domains than the primary IdP domain configured in your resource configuration.

  8. Choose **Add OAuth Client**.


For a detailed comparison of managed vs self-managed Lattice modes, see [Supported VPC egress modes](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./vpc-egress-private-endpoints.html#lattice-vpc-egress-compare-modes>).

After completing either configuration, AgentCore Identity securely stores your OAuth settings and provides an ARN you can reference in your agent code, enabling token requests without embedding sensitive credentials in your application. You can find this ARN in the properties page of the OAuth client (Choose the client name in the **Outbound Auth** section).

