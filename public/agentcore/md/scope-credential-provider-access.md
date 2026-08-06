# Scope down access to credential providers by workload identity - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/scope-credential-provider-access.html

---

# Scope down access to credential providers by workload identity

You can use IAM policies to control which workload identities have access to specific credential providers. This enables fine-grained access control, ensuring that only authorized agents can retrieve credentials for particular services.

###### Note

The IAM role you assign to an agent controls which credential providers the agent can call. The service does not enforce additional binding between workload identities and credential providers in the same account. To follow least-privilege practices, scope your IAM policy `Resource` blocks to specific workload identity and credential provider ARNs rather than using `*`.

A successful call to a credential provider does not mean credentials are automatically returned. The credentials a workload retrieves are scoped to the user identity in its workload access token. For OAuth2 (3LO) providers, the end user must have completed authorization before any credentials exist to retrieve for that workload identity and user combination.

**Access control mechanisms**

  * **Workload identity-based restrictions** – Limit credential provider access to specific workload identities

  * **Resource-level permissions** – Control access to individual credential providers using ARN-based policies

  * **Directory-level controls** – Manage access at the workload identity directory level

  * **Credential provider scoping** – Restrict which credential providers a workload identity can access by including credential provider ARNs in the policy `Resource` block


###### Topics

  * IAM policy examples

  * Deny access to a specific credential provider

  * Use separate workload identities for different credential providers

  * Implementation steps


## IAM policy examples

The following examples demonstrate how to create IAM policies that restrict credential provider access based on workload identity and credential provider.

**Restrict access to a specific API key credential provider**

This policy allows a workload identity to retrieve API keys only from a specific credential provider. The credential provider ARN in the `Resource` block restricts access to that provider.

```json
{
"Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "GetResourceApiKey",
      "Effect": "Allow",
      "Action": [
        "bedrock-agentcore:GetResourceApiKey"
      ],
      "Resource": [
        "arn:aws:bedrock-agentcore:us-east-1:<account_id>:workload-identity-directory/default",
        "arn:aws:bedrock-agentcore:us-east-1:<account_id>:workload-identity-directory/default/workload-identity/<workload-identity-name>",
        "arn:aws:bedrock-agentcore:us-east-1:<account_id>:token-vault/default",
        "arn:aws:bedrock-agentcore:us-east-1:<account_id>:token-vault/default/api-key/<provider-name>"
      ]
    }
  ]
}
```
**Restrict access to a specific OAuth2 credential provider**

This policy allows a workload identity to retrieve OAuth2 tokens only from a specific OAuth2 credential provider.

```json
{
"Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "GetResourceOauth2Token",
      "Effect": "Allow",
      "Action": [
        "bedrock-agentcore:GetResourceOauth2Token"
      ],
      "Resource": [
        "arn:aws:bedrock-agentcore:us-east-1:<account_id>:workload-identity-directory/default",
        "arn:aws:bedrock-agentcore:us-east-1:<account_id>:workload-identity-directory/default/workload-identity/<workload-identity-name>",
        "arn:aws:bedrock-agentcore:us-east-1:<account_id>:token-vault/default",
        "arn:aws:bedrock-agentcore:us-east-1:<account_id>:token-vault/default/oauth2-credential-provider/<provider-name>"
      ]
    }
  ]
}
```
**Allow multiple workload identities access to a credential provider**

This policy allows multiple workload identities to retrieve API keys from the same credential provider.

```json
{
"Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "GetResourceApiKeyMultipleIdentities",
      "Effect": "Allow",
      "Action": [
        "bedrock-agentcore:GetResourceApiKey"
      ],
      "Resource": [
        "arn:aws:bedrock-agentcore:us-east-1:<account_id>:workload-identity-directory/default",
        "arn:aws:bedrock-agentcore:us-east-1:<account_id>:workload-identity-directory/default/workload-identity/agent-1",
        "arn:aws:bedrock-agentcore:us-east-1:<account_id>:workload-identity-directory/default/workload-identity/agent-2",
        "arn:aws:bedrock-agentcore:us-east-1:<account_id>:workload-identity-directory/default/workload-identity/agent-3",
        "arn:aws:bedrock-agentcore:us-east-1:<account_id>:token-vault/default",
        "arn:aws:bedrock-agentcore:us-east-1:<account_id>:token-vault/default/api-key/<provider-name>"
      ]
    }
  ]
}
```
## Deny access to a specific credential provider

You can explicitly deny a workload identity access to a specific credential provider using a `Deny` statement. Deny statements take precedence over Allow statements, making them useful for creating guardrails.

```json
{
"Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyAccessToSensitiveProvider",
      "Effect": "Deny",
      "Action": [
        "bedrock-agentcore:GetResourceApiKey",
        "bedrock-agentcore:GetResourceOauth2Token"
      ],
      "Resource": [
        "arn:aws:bedrock-agentcore:us-east-1:<account_id>:token-vault/default/api-key/<sensitive-provider-name>",
        "arn:aws:bedrock-agentcore:us-east-1:<account_id>:token-vault/default/oauth2-credential-provider/<sensitive-provider-name>"
      ]
    }
  ]
}
```
## Use separate workload identities for different credential providers

If you need different agents to access different credential providers, create separate workload identities with separate IAM roles. Each IAM role is scoped to only the credential providers that the agent needs.

For example, if Agent A should access only Provider X and Agent B should access only Provider Y:

  1. Create workload identity `agent-a` and workload identity `agent-b`

  2. Create IAM role `AgentARole` with a policy that allows access only to Provider X

  3. Create IAM role `AgentBRole` with a policy that allows access only to Provider Y

  4. Associate each workload identity with its corresponding IAM role


**IAM policy for Agent A (access to Provider X only)**

```json
{
"Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AgentAAccessProviderX",
      "Effect": "Allow",
      "Action": [
        "bedrock-agentcore:GetResourceApiKey"
      ],
      "Resource": [
        "arn:aws:bedrock-agentcore:us-east-1:<account_id>:workload-identity-directory/default",
        "arn:aws:bedrock-agentcore:us-east-1:<account_id>:workload-identity-directory/default/workload-identity/agent-a",
        "arn:aws:bedrock-agentcore:us-east-1:<account_id>:token-vault/default",
        "arn:aws:bedrock-agentcore:us-east-1:<account_id>:token-vault/default/api-key/provider-x"
      ]
    }
  ]
}
```
**IAM policy for Agent B (access to Provider Y only)**

```json
{
"Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AgentBAccessProviderY",
      "Effect": "Allow",
      "Action": [
        "bedrock-agentcore:GetResourceApiKey"
      ],
      "Resource": [
        "arn:aws:bedrock-agentcore:us-east-1:<account_id>:workload-identity-directory/default",
        "arn:aws:bedrock-agentcore:us-east-1:<account_id>:workload-identity-directory/default/workload-identity/agent-b",
        "arn:aws:bedrock-agentcore:us-east-1:<account_id>:token-vault/default",
        "arn:aws:bedrock-agentcore:us-east-1:<account_id>:token-vault/default/api-key/provider-y"
      ]
    }
  ]
}
```
## Implementation steps

To implement workload identity-based access control for credential providers:

  1. **Identify your workload identities** – Use `aws bedrock-agentcore-control list-workload-identities` to list all workload identities in your account. For information about creating and managing workload identities, see [Manage workload identities with AgentCore Identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-manage-agent-ids.html>).

  2. **Determine credential provider ARNs** – Identify the specific credential providers you want to control access to. Credential provider ARNs follow these formats:

     * `arn:aws:bedrock-agentcore:<region>:<account_id>:token-vault/default/api-key/<provider-name>`

     * `arn:aws:bedrock-agentcore:<region>:<account_id>:token-vault/default/oauth2-credential-provider/<provider-name>`

  3. **Create IAM policies** – Write IAM policies that specify which workload identities can access which credential providers

  4. **Attach policies to roles** – Attach the policies to the IAM roles used by your agents or applications

  5. **Test access controls** – Verify that only authorized workload identities can access the specified credential providers


**Best practices**

  * Use descriptive names for workload identities to make policy management easier

  * Include credential provider ARNs in the `Resource` block to scope access to specific providers, rather than granting access to all providers in the account

  * Use separate workload identities and IAM roles when different agents need access to different credential providers

  * Use explicit `Deny` statements to create guardrails that prevent access to sensitive credential providers regardless of other policies

  * Regularly audit and review access policies to ensure they align with your security requirements

  * Consider using IAM policy conditions for additional access controls based on time, IP address, or other factors

  * Test policies in a development environment before applying them to production workloads



