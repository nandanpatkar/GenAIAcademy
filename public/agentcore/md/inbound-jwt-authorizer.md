# Configure inbound JWT authorizer - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/inbound-jwt-authorizer.html

---

# Configure inbound JWT authorizer

The inbound authorizer authenticates and authorizes incoming OAuth 2.0 API requests to AgentCore Runtime and AgentCore Gateway. It validates JSON Web Tokens (JWTs) before allowing access to agents or gateways. The authorizer is Identity Provider (IdP) agnostic and works with any OAuth 2.0 compatible identity provider. When AgentCore Runtime or AgentCore Gateway receives an inbound request, the authorizer will use the configured discovery URL to fetch the public keys and authorization server endpoint to perform the JWT validation. You can configure the authorizer based on your IdP and allowed authorization scopes or claims.

## Configure an Inbound Authorizer

You can configure your agent runtime (see [CreateAgentRuntime](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateAgentRuntime.html>) ) or gateway (see [CreateGateway](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateGateway.html>) ) to accept JWT bearer tokens by providing an authorizer configuration during agent or gateway creation. The authorization configuration (see [CustomJWTAuthorizerConfiguration](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CustomJWTAuthorizerConfiguration.html>) ) is the same for either AgentCore Runtime or AgentCore Gateway.

  * **Discovery URL** : A string that must match the pattern `^.+/\.well-known/openid-configuration$` for OpenID Connect (OIDC) discovery URLs. You can find your discovery URL from your identity provider. A discovery URL is a specific web address that AgentCore Identity can use to find information about the authentication endpoint details. It allows AgentCore Identity to dynamically accept tokens issued by your OIDC identity provider without explicit onboarding.

  * **Allowed audiences** : A list of permitted audiences that AgentCore Identity will validate against the `aud` claim in the JWT token. An audience claim ( `aud` ) in OAuth 2.0 specifies which resource server (API) the token is intended for. The resource server validates the `aud` claim to ensure it is the correct recipient before processing the request, preventing a token from being reused at a different API it was not issued for.

  * **Allowed clients** : A list of permitted client identifiers that AgentCore Identity will validate against the `client_id` claim in the JWT token. A `client_id` in OAuth 2.0 is a public, unique identifier for an application that is requesting access tokens to access AgentCore Runtime or AgentCore Gateway. It acts like a username for the application, distinguishing it from other clients (applications) registered with the authorizer.

  * **Allowed scopes** : A list of permitted permissions, defined as scopes, allowed to invoke the runtime or gateway. If configured, at least one scope value in the incoming token must match one of the configured values. An OAuth 2.0 scope is a string that defines a specific level of access that is defined in the JWT. Scopes act as permissions to limit what an application can do.

  * **Required custom claims (see CustomClaimValidationType)** : A set of rules to match specific claims in the incoming token against predefined values for validating JWT tokens. You can create a rule by specifying the following:

    * **InboundTokenClaimName** : Name of the custom claim.

    * **InboundTokenClaimValueType** : Either `STRING` or `STRING_ARRAY`.

    * **AuthorizingClaimMatchValue** : Required value and comparison operator of the custom claim.

      * **ClaimMatchValue** : Required value of the custom claim.

      * **ClaimMatchOperator** : If `InboundTokenClaimValueType` equals `STRING` , this must be `EQUALS` . If `InboundTokenClaimValueType` equals `STRING_ARRAY` , this can be `CONTAINS` or `CONTAINS_ANY`.

      * **Example** : You can define a rule that enforces: `Group must equal Developer`.

  * **Note** : At least one of the fields is required for the configuration: allowed audiences, allowed clients, allowed scopes, or required custom claims. If more than one is used, the authorizer will verify them all.



