# Troubleshooting AgentCore payments - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-troubleshooting.html

---

# Troubleshooting AgentCore payments

This section provides solutions to common errors when using AWS Amazon Bedrock AgentCore payments.

## Validation errors

When creating or updating payment resources, the service returns a `ValidationException`. The following table lists common validation errors and their resolutions.

Error message | Resolution  
---|---  
`roleArn must contain a valid account ID` |  The `roleArn` must be a valid IAM role ARN with a 12-digit account ID. Verify the format: `arn:aws:iam::<accountId>:role/<roleName>`.  
`roleArn must belong to your account` |  The account ID in `roleArn` must match the caller’s account. Cross-account roles are not supported.  
`Invalid role ARN: {roleArn}` |  The `roleArn` could not be parsed. Verify the ARN format.  
`credentialProviderConfigurations list cannot be empty` |  Provide at least one credential provider configuration when creating or updating a payment connector.  
`credentialProviderArn is required but not found in the request` |  Each credential provider configuration must include a `credentialProviderArn`. Create one first using [Create a Credential Provider](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./resource-providers.html>).  
`Connector type '{type}' does not match the provided credentialProviderConfiguration` |  The credential provider configuration variant must match the connector type. For example, a `CoinbaseCDP` connector requires the `coinbaseCDP` configuration, not `stripePrivy`.  
  
Field naming constraints are also enforced:

  * Payment manager names must start with a letter and contain only alphanumeric characters (max 48 characters).

  * Payment connector names follow the same rules but also allow underscores.

  * Descriptions allow alphanumeric characters and spaces (max 4096 characters).


## Permission errors

Error message | Resolution  
---|---  
`Access denied due to account security restrictions. Contact AWS Support for assistance.` |  Your account has been restricted. Contact AWS Support to resolve.  
`Access denied for {CREATE|UPDATE} due to account security restrictions. Contact AWS Support for assistance.` |  Your account is in a limited access state. Read and list operations are allowed, but create and update operations are restricted until the restriction is resolved.  
IAM SigV4 authorization failures |  Ensure the calling principal has the appropriate `bedrock-agentcore:` permissions. The service uses SigV4 signing with the `bedrock-agentcore` signing name.  
PassRole failures |  When providing a `roleArn`, the caller must have `iam:PassRole` permission for the role. The role’s trust policy must allow `bedrock-agentcore.amazonaws.com` as a service principal.  
  
## Resource not found errors

Error message | Resolution  
---|---  
`Payment manager not found: {managerId}` |  The specified payment manager does not exist. Verify the ID by calling `ListPaymentManagers`.  
`Payment connector not found: connectorId={connectorId}, managerId={managerId}` |  The specified connector does not exist under the given manager. Verify both IDs using `ListPaymentConnectors`.  
Resource not found during `CreatePaymentConnector` |  The parent payment manager does not exist. Create the payment manager first.  
  
## Conflict errors

The service returns a `ConflictException` when two requests modify the same resource at the same time, or when creating a resource that already exists. Retry the request. Create and update operations support a `clientToken` for safe retries.

## Service quota errors

The service returns `"{limitType} limit exceeded for account {accountId}"` when you reach the maximum number of payment managers or connectors for your account. Delete unused resources or contact AWS Support to request a limit increase.

## Throttling errors

The service returns `"Rate exceeded"` when the request rate exceeds the allowed limit. Implement exponential backoff with jitter in your retry logic. If you consistently hit limits, contact AWS Support.

## Payment processing errors

If an external payment provider rejects the signing request, the service returns an `AccessDeniedException` or `ValidationException`. The following table lists common errors and their resolutions.

Error message | Resolution  
---|---  
`Delegated signing grant is not active for the end user wallet. Please redirect end user to the WalletHub to grant the permissions.` |  You haven’t granted the delegation permission that allows your agent to sign transactions on your behalf, or you previously revoked it. To resolve:

  1. Retrieve the WalletHub URL from the `CreatePaymentInstrument` or `GetPaymentInstrument` response body (`paymentInstrumentDetails.redirectUrl`).
  2. Redirect the user to the WalletHub.
  3. Sign in and grant signing permissions to the agent.

For more information about a frontend implementation that handles the delegation grant flow, see the [Coinbase AgentCore template](<https://github.com/coinbase/cdp-agentcore-template>) on the GitHub website. For more information about funding the wallet, see [Funding the wallet](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-how-it-works.html#payments-how-it-works-funding-wallet>).  
`Delegated signing is not enabled for your Coinbase project. Please enable delegated signing in your Coinbase project policies.` |  Your Coinbase Developer Platform project does not have delegated signing configured. To resolve:

  1. Sign in to the [Coinbase Developer Platform](<https://docs.cdp.coinbase.com/api-reference/v2/authentication>) on the Coinbase website.
  2. Navigate to your project’s **Policies** settings.
  3. Enable the **Delegated Signing** toggle.

You must complete this step before your agent can sign transactions on behalf of users.  
`Privy credentials are invalid. Please verify the credential configuration.` |  Your credential provider has invalid or expired Privy wallet authorization keys. To resolve:

  1. Sign in to the [Privy Dashboard](<https://docs.privy.io/authentication/overview#api-authentication>) on the Privy website.
  2. Navigate to your app’s settings and verify the authorization keys are active.
  3. Update the credential provider in AgentCore Identity with the current keys. To do this, call `UpdatePaymentConnector` or update the secret in AWS Secrets Manager.

For more information about credential configuration, see the [Privy AgentCore SDK](<https://github.com/privy-io/aws-agentcore-sdk>) on the GitHub website.  
  
## Server errors

The service returns `"Something went wrong in processing your request"` for internal errors. Retry the request after a brief delay. If the error persists, contact AWS Support with the request ID from the `x-amzn-requestid` response header.

