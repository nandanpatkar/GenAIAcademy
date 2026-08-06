# Security best practices for AgentCore Runtime - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-security-best-practices.html

---

# Security best practices for AgentCore Runtime

This topic consolidates security best practices for Amazon Bedrock AgentCore Runtime. Use these recommendations to secure your agent deployments, protect data, and follow the principle of least privilege.

###### Topics

  * Session isolation and data protection

  * IAM and least privilege

  * Resource-based policies and cross-account access

  * Confused deputy prevention

  * Input validation

  * Front your runtime with an AgentCore Gateway

  * Authentication best practices

  * Credential and secret management

  * Network security

  * Encryption

  * Auditing and monitoring

  * Shared responsibility model

  * Command execution security

  * VM platform server


## Session isolation and data protection

Amazon Bedrock AgentCore Runtime provides strong isolation boundaries through dedicated microVMs. Follow these practices to maintain data protection:

  * **Understand the isolation boundary** — Each user session runs in a dedicated microVM with isolated CPU, memory, and filesystem. Commands and agent code cannot access other customers' workloads or escape the VM boundary. After session completion, the entire microVM is terminated and memory is sanitized.

  * **Enforce session-to-user mappings in your backend** — AgentCore does not enforce session-to-user mappings. Your client backend must maintain the relationship between users and their session IDs, and implement lifecycle management such as maximum number of sessions per user.

  * **Be aware of filesystem permission behavior** — When using [persistent file systems](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-filesystem-configurations.html>), permissions are stored but not enforced within the session. `chmod` and `stat` work correctly, but access checks always succeed because the agent runs as the only user in the microVM.

  * **Understand credential exposure within the VM** — Any code or actor running inside the microVM can access execution role credentials by calling the metadata endpoint (MMDS). Scope your execution role permissions carefully. For more information, see [Credentials Management](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./security-credentials-management.html>).


## IAM and least privilege

Apply the principle of least privilege to all IAM policies associated with your AgentCore Runtime resources:

  * **Do not use CLI-generated policies in production** — The IAM policies created by the AgentCore CLI are designed for development and testing purposes. These permissions grant broad access and are not suitable for production. Create custom IAM policies that restrict permissions to only the specific resources and actions required. For the full reference, see [IAM Permissions for AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-permissions.html>).

  * **Scope permissions to specific runtime ARNs** — Avoid wildcard resource statements. Use the full ARN of your runtime resources in IAM policy `Resource` fields.

  * **Restrict`InvokeAgentRuntimeForUser` ** — Only trusted principals should have this permission. Scope it to specific runtime resources using IAM resource conditions.

  * **Deny user-id delegation where not needed** — For runtimes where user-id delegation is not required, explicitly deny the action:

```json
{
   "Statement": [
      {
         "Sid": "DenyUserIdDelegation",
         "Effect": "Deny",
         "Action": "bedrock-agentcore:InvokeAgentRuntimeForUser",
         "Resource": "arn:aws:bedrock-agentcore:REGION:ACCOUNT_ID:runtime/*"
      }
   ]
}
```
  * **Prevent privilege escalation** — Ensure that the execution role associated with your runtime has equal or fewer privileges than the principals who can invoke it. For more information, see [Credentials Management](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./security-credentials-management.html>).

  * **Use IAM condition keys to enforce VPC deployments** — Use `bedrock-agentcore:subnets` and `bedrock-agentcore:securityGroups` condition keys to require that all runtimes are deployed in approved VPCs. For examples, see [Use VPC condition keys with AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./security-vpc-condition.html>).

  * **Use IAM Access Analyzer** — Validate your IAM policies to ensure they adhere to best practices and least-privilege principles.


## Resource-based policies and cross-account access

Resource-based policies provide fine-grained access control directly on your runtime resources:

  * **Understand hierarchical authorization** — For runtime API operations such as `InvokeAgentRuntime`, `InvokeAgentRuntimeCommand`, and `InvokeAgentRuntimeCommandShell`, AWS evaluates policies on both the agent runtime and the agent endpoint. Both must allow the action.

  * **Configure both resources for cross-account access** — To grant cross-account access, create resource-based policies on both the agent runtime and the agent endpoint. If either resource lacks an explicit allow, the request is denied.

  * **Remember that explicit deny always wins** — If any policy (identity-based or resource-based) explicitly denies an action, access is denied regardless of other policies.


For complete details, see [Resource-based policies for Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./resource-based-policies.html>).

## Confused deputy prevention

Protect your execution roles from the confused deputy problem by using global condition context keys in trust policies:

  * **Use`aws:SourceArn` and `aws:SourceAccount` ** — Add these conditions to your execution role trust policy to limit which AgentCore resources can assume the role:

```json
{
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "bedrock-agentcore.amazonaws.com"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "aws:SourceAccount": "123456789012"
        },
        "ArnLike": {
          "aws:SourceArn": "arn:aws:bedrock-agentcore:us-east-1:123456789012:*"
        }
      }
    }
  ]
}
```
  * **Use the full ARN when possible** — If you know the specific runtime resource, use its full ARN in `aws:SourceArn` instead of wildcards.


For more information, see [Cross-service confused deputy prevention](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./cross-service-confused-deputy-prevention.html>).

## Input validation

Validate all input that your agent entrypoint receives before passing it to an agent framework:

  * **Enforce string type on the prompt field** —The `payload` your entrypoint receives is parsed from arbitrary JSON. A caller can send a non-string value (such as a list or object) in the `prompt` field. If your agent framework accepts non-string content blocks—particularly `toolUse` blocks—the framework might dispatch a tool directly. This bypasses model reasoning, guardrails, and system prompt enforcement. Always validate that the prompt is a string before passing it to the agent:

```python
@app.entrypoint
def invoke(payload, context):
    user_message = payload.get("prompt", "")
    if not isinstance(user_message, str) or not user_message.strip():
        return {"error": "Invalid input: 'prompt' must be a non-empty string"}
    result = agent(user_message)
    return {"response": result.message}
```
  * **Reject or strip`toolUse` content blocks**—If your agent accepts structured message arrays (for multi-turn conversation), filter out any `toolUse` content blocks from user-supplied messages. A `toolUse` block in the message history can cause the agent framework’s event loop to execute the named tool immediately without model evaluation.

  * **Validate payload structure with a schema** —Use Pydantic, Zod, or an equivalent schema library to enforce that the request body conforms to your expected structure. Define `prompt` as `str` (not `Any`) in your schema:

```python
from pydantic import BaseModel

class InvocationRequest(BaseModel):
    prompt: str  # Enforces string type at the schema level
```
  * **Do not rely on default values as validation** —A pattern like `payload.get("prompt", "Hello")` provides a default but does not reject non-string input. The value returned is whatever the caller sent, which might be a dict or list containing content blocks.


## Front your runtime with an AgentCore Gateway

A common pattern is to front your AgentCore Runtime with an AgentCore Gateway so that the gateway becomes the single, governed entry point to the runtime. Placing a gateway in front lets you apply controls **outside** of the agent’s own environment:

  * **Policy-based authorization** — Use the gateway’s policy engine to control which callers can invoke which targets and under what conditions. For more information, see [Use policies to control access to gateway targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./policy.html>).

  * **Guardrails** — Apply Amazon Bedrock Guardrails through the policy engine to screen requests and responses. For more information, see [Use guardrails in policies](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./policy-guardrails-in-policies.html>).

  * **Request and response interceptors** — Inspect or transform traffic with interceptor Lambda functions configured on the gateway.


These controls only protect you if all traffic actually flows through the gateway. If a caller can reach the runtime directly, it bypasses the gateway’s policies, guardrails, and interceptors entirely. To prevent this, restrict the runtime to accept invocations only when they originate from your gateway. How you do this depends on the runtime’s inbound authorization type:

  * **IAM (SigV4) runtimes** — Attach a resource-based policy that restricts invocation to the gateway’s execution role. See [Restrict IAM (SigV4) inbound invocation to your gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-oauth.html#runtime-restrict-iam-gateway>).

  * **OAuth (JWT) runtimes** — Configure `allowedWorkloadConfiguration` on the runtime’s authorizer. See [Restrict invocation to your gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-oauth.html#deploy-agent-allowed-workload>).


To set this up, you [create the gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-create.html>), [deploy your runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-oauth.html#deploy-agent>), and then [add the runtime as a gateway target](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-target-http-runtime.html>) on that gateway. For the target configuration, outbound authorization, and the invocation URL format, see [AgentCore Runtime targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-target-http-runtime.html>).

## Authentication best practices

AgentCore Runtime supports IAM SigV4 and JWT bearer token authentication. Follow these practices to secure access:

  * **Choose the right authentication method** — Use IAM SigV4 for service-to-service calls within AWS. Use JWT bearer token authentication when end users authenticate directly through an identity provider. A runtime can support one method at a time; create separate versions for different authentication types.

  * **Prefer JWT-based user identification for production** — When your agent retrieves OAuth tokens on behalf of end users, prefer the JWT bearer token path (`GetWorkloadAccessTokenForJWT`), which validates the token’s issuer, signature, and expiry. The UserId path (`GetWorkloadAccessTokenForUserId` / `X-Amzn-Bedrock-AgentCore-Runtime-User-Id` header) treats the user identifier as an opaque string without IdP verification — use it only for development, quickstart scenarios, or enterprise architectures that resolve user identity upstream. For more information, see [Get workload access token](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./get-workload-access-token.html>).

  * **Configure JWT authorizers completely** — When using JWT authentication, configure all available validation fields: discovery URL, allowed audiences, allowed clients, allowed scopes, and required custom claims.

  * **Never hardcode tokens in production code** — Use secure token retrieval mechanisms. Hardcoded tokens are a security risk in source control and deployed artifacts.

  * **Derive user-id from the authenticated principal** — If you use the `X-Amzn-Bedrock-AgentCore-Runtime-User-Id` header, the value should be derived from the authenticated principal’s context (IAM caller identity or user token claims), not from arbitrary client-supplied values. This prevents authenticated users from impersonating other users.

  * **Deny ForUserId where not needed** — For workloads that always have a JWT available, explicitly deny `bedrock-agentcore:GetWorkloadAccessTokenForUserId` and `bedrock-agentcore:InvokeAgentRuntimeForUser` in IAM policies. This ensures all user identification goes through the cryptographically verified JWT path.

  * **Configure VPC endpoint policies for your auth method** — VPC endpoint policies can only restrict callers based on IAM principals, not OAuth users. For OAuth-based requests, set `Principal` to `*` in the endpoint policy. For SigV4-based authentication, specify the allowed IAM identities.


For implementation details, see [Authenticate and authorize with Inbound Auth and Outbound Auth](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-oauth.html>).

## Credential and secret management

Protect credentials used by your agents and runtime environments:

  * **Use AgentCore Identity for outbound authentication** — AgentCore Identity manages OAuth credentials and API keys securely, preventing credential exposure in agent code or logs. Use it for all third-party service access (Slack, GitHub, Zoom).

  * **Understand MMDS credential exposure** — The MicroVM Metadata Service (MMDS) provides execution role credentials to any code running in the VM, similar to EC2’s IMDS. Scope execution role permissions to only what your agent requires.

  * **Enable MMDSv2** — Starting June 30, 2026, your agent runtimes must have MMDSv2 enabled. Runtimes without MMDSv2 enabled cannot be invoked and return a `ValidationException`. To enable, call `UpdateAgentRuntime` with `requireMMDSV2` set to `true` in `metadataConfiguration`. For more information about resolving this error, see [MMDSv2 ValidationException troubleshooting](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-troubleshooting.html#troubleshoot-runtime-mmdsv2-validation>).

  * **Run containers as non-root users** — When building custom container images, configure them to run as a non-root user. This limits the impact of potential code execution vulnerabilities.

  * **Separate user-delegated and autonomous credentials** — Use user-delegated authentication (Authorization Code Grant) when your agent acts on behalf of a specific user. Use autonomous authentication (Client Credentials Grant) when the agent operates independently.


For more information, see [Credentials Management](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./security-credentials-management.html>) and [AgentCore Identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity.html>).

## Network security

Secure network access to and from your AgentCore Runtime environments:

  * **Deploy runtimes in a VPC for private resource access** — Configure VPC connectivity to access private databases, internal APIs, and services without exposing them to the internet. For configuration details, see [Configure AgentCore Runtime for VPC](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./agentcore-vpc.html>).

  * **Use AWS PrivateLink for API access** — Create interface VPC endpoints for the AgentCore data plane (`com.amazonaws.region.bedrock-agentcore`) and control plane (`com.amazonaws.region.bedrock-agentcore-control`) to avoid internet traversal. For more information, see [Use AWS PrivateLink](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./vpc-interface-endpoints.html>).

  * **Apply least privilege to security groups** — Define outbound rules that allow only the minimum required traffic. Do not open broad outbound access unless necessary.

  * **Configure required VPC endpoints for container agents** — For VPC-mode container agents, configure VPC endpoints for ECR (`com.amazonaws.region.ecr.dkr`, `com.amazonaws.region.ecr.api`), S3 (`com.amazonaws.region.s3` gateway endpoint), and CloudWatch Logs (`com.amazonaws.region.logs`). The S3 gateway endpoint eliminates NAT gateway data processing charges for ECR image layer pulls.

  * **Scope the S3 gateway endpoint policy for container agents** — Restrict the S3 gateway endpoint policy to only the bucket that Amazon ECR uses for image layer storage:

```json
{
  "Statement": [
    {
      "Sid": "AllowECRLayerAccess",
      "Principal": "*",
      "Action": [
        "s3:GetObject"
      ],
      "Effect": "Allow",
      "Resource": ["arn:aws:s3:::prod-region-starport-layer-bucket/*"]
    }
  ]
}
```
Replace `region` with your AWS Region identifier (for example, `us-east-2`).

  * **Scope the S3 gateway endpoint policy for direct code deploy agents** — For zip-based deployments, restrict the policy to the internal service-owned code artifact bucket. Add an `aws:PrincipalServiceName` condition to ensure only the AgentCore service principal can access buckets through this endpoint policy:

```json
{
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": [
        "arn:aws:s3:::acr-code-*-region-an",
        "arn:aws:s3:::acr-code-*-region-an/*"
      ],
      "Condition": {
        "StringEquals": {
          "aws:PrincipalServiceName": "bedrock-agentcore.amazonaws.com"
        }
      }
    }
  ]
}
```
Replace `region` with your AWS Region identifier (for example, `us-west-2`). The AgentCore code artifact buckets are created in [Account regional namespace general purpose buckets](<https://docs.aws.amazon.com/AmazonS3/latest/userguide/gpbucketnamespaces.html#account-regional-gp-buckets>). Only AWS can own the actual bucket names used by the service. The `aws:PrincipalServiceName` condition ensures that only the AgentCore service principal can access buckets through this endpoint policy. If you also use [persistent file systems](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-filesystem-configurations.html>), add the session storage bucket to this policy. For more information, see [Configure AgentCore Runtime for VPC](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./agentcore-vpc.html>).

  * **Use private subnets with NAT gateways** — Public subnets do not provide internet access for AgentCore Runtime. Always place runtime ENIs in private subnets with a route to a NAT gateway for outbound internet access.

  * **Transport security** — All connections use TLS 1.2 or higher. WebSocket connections, including `InvokeAgentRuntimeCommandShell`, use WSS (WebSocket Secure) over HTTPS exclusively. Plaintext `ws://` connections are not supported.

  * **Enforce header limits** — Custom headers are limited to 4KB per value and 20 headers per runtime. The `Authorization` header is reserved for agents with OAuth inbound access.


## Encryption

AgentCore Runtime protects data with encryption at rest and in transit:

  * **Encryption in transit** — All communication between clients and AgentCore Runtime, and between AgentCore Runtime and its dependencies, is protected using TLS 1.2 or higher. This is configured by default and requires no additional setup.

  * **Encryption at rest** — Data at rest is encrypted using AWS owned encryption keys from AWS Key Management Service (AWS KMS) by default.

  * **Use TLS 1.3 where possible** — While TLS 1.2 is the minimum, AWS recommends TLS 1.3 for improved security and performance.


For more information, see [Data encryption](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./data-encryption.html>).

## Auditing and monitoring

Implement comprehensive auditing to detect and investigate security events:

  * **Enable CloudTrail logging** — AWS CloudTrail records API calls including `InvokeAgentRuntime`, `InvokeAgentRuntimeCommand`, `InvokeAgentRuntimeCommandShell`, and control plane operations. Each record includes caller identity, timestamp, source IP address, and response status.

  * **Use CloudWatch Logs for command auditing** — AgentCore Runtime sends the request ID and input command to your agent’s CloudWatch Logs log group. Use these logs to maintain an audit trail of commands executed in your sessions.

  * **Correlate logs using request IDs** — Use the request ID to correlate CloudTrail records (who called the API) with CloudWatch Logs (what command was executed).

  * **Set up metric filters and alarms** — Configure CloudWatch Logs metric filters to detect unexpected command patterns or unauthorized access attempts. Create alarms to notify your team of anomalies.

  * **Log user-id delegation relationships** — When using the `X-Amzn-Bedrock-AgentCore-Runtime-User-Id` header, log the relationship between the authenticated IAM principal and the user-id value for audit purposes.

  * **Enable VPC Flow Logs** — For VPC-connected runtimes, enable VPC Flow Logs to audit network-level traffic and identify unexpected communication patterns.

  * **Review CloudTrail logs regularly** — Periodically review logs for unauthorized access attempts, especially for sensitive workloads.


## Shared responsibility model

Understand the division of security responsibilities between AWS and you:

###### AWS responsibilities:

  * Secure infrastructure and microVM isolation at the hardware level

  * OS kernel patching for all deployment modes

  * Language runtime patching for direct code deployments

  * Network infrastructure security

  * Service availability and resilience


###### Your responsibilities:

  * Agent code security and dependency management

  * IAM access controls and resource policies

  * Security of commands executed in runtime sessions

  * Session-to-user mapping enforcement

  * Container image updates (for container deployments) — rebuild with the latest secure base image regularly

  * Input validation and prompt injection prevention — including validating `InvokeHarness` input when using the managed harness (see Harness shares the AgentCore Runtime trust boundary)

  * Network configuration (security groups, VPC endpoints, route tables)


###### Important

For direct code deployments, AgentCore Runtime applies security patches to the runtime OS automatically. AgentCore Runtime does not apply security patches to programming language runtimes after they reach their end of support date. Deprecated runtimes are provided as-is and may contain unpatched vulnerabilities. For supported runtimes, see [Supported runtimes for code deployment](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-code-deploy-supported-runtimes.html>).

###### Note

Security patches can expose issues with existing code that relies on previous insecure behavior. If this risk is not acceptable, use container images to deploy your agent.

### Harness shares the AgentCore Runtime trust boundary

The managed harness is built on AgentCore Runtime. It does not add a security layer between the caller and the microVM. The security boundary is the same as AgentCore Runtime: IAM or JWT authentication combined with microVM isolation.

For the full harness security model, including trust boundary details, model configuration parameter risks, and input validation guidance, see [Harness shared responsibility model](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-security.html#harness-shared-responsibility>).

## Command execution security

AgentCore Runtime provides two command execution APIs:

  * `InvokeAgentRuntimeCommand` — One-shot, non-interactive command execution over HTTP/2. IAM action: `bedrock-agentcore:InvokeAgentRuntimeCommand`.

  * `InvokeAgentRuntimeCommandShell` — Interactive WebSocket shell session with persistent PTY access. IAM action: `bedrock-agentcore:InvokeAgentRuntimeCommandShell`.


Both APIs operate within the same microVM isolation boundary and share the same security model. Apply these practices to both:

  * **Understand the security boundary** — Commands have full access to the container filesystem and any configured credentials or secrets within the microVM. The isolation boundary is the microVM itself. Under the shared responsibility model, you are responsible for the security of any code executed in your runtime container.

  * **Use deterministic operations for deterministic tasks** — Use `InvokeAgentRuntimeCommand` or `InvokeAgentRuntimeCommandShell` for operations like tests, git, and builds. Don’t route deterministic operations through the LLM via `InvokeAgentRuntime`.

  * **Restrict who can execute commands** — Use IAM policies to limit which principals can call `InvokeAgentRuntimeCommand` or `InvokeAgentRuntimeCommandShell`. Not all users who can invoke an agent should be able to execute arbitrary commands. Example resource ARN: `arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/my-agent`.

  * **WebSocket shell uses wss:// only** — `InvokeAgentRuntimeCommandShell` connections are established exclusively over WSS (WebSocket Secure). Plaintext `ws://` connections are not supported. Callers authenticate via SigV4 at WebSocket upgrade.

  * **Keep traffic within your network** — Configure VPC endpoints to avoid internet traversal for command execution API calls.

  * **Set appropriate timeouts** — Configure command timeouts based on expected execution duration to prevent resource waste from runaway processes.


For complete details, see [Execute commands in runtime sessions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-execute-command.html>).

## VM platform server

Each AgentCore Runtime microVM includes a platform server running on localhost. This server manages VM session lifecycle, storage operations, and provides shell access to support runtime operations. The platform server runs entirely within the agent’s microVM, which is the isolation boundary — it contains no service-critical infrastructure code and has no access to other sessions or customers' workloads.

###### Important

Everything running within the microVM, including interactions with the platform server, is your responsibility under the shared responsibility model. If agent code or tools interact with the platform server, the impact is limited to the current VM session — it cannot affect other sessions or cross isolation boundaries. However, unauthorized access can disrupt the session’s VM lifecycle or provide shell access within that session.

Follow these practices to limit unnecessary access to the platform server:

  * **Restrict localhost access in agent code** — Configure your agent and any networking tools to prevent unrestricted access to localhost. Agent code should not make arbitrary HTTP calls to localhost unless required for a specific integration.

  * **Allowlist only required ports for sidecar setups** — If your architecture uses a container-in-container or sidecar pattern on localhost, explicitly allowlist only the specific ports your sidecar services use. Do not open broad localhost access.

  * **Audit network tools for localhost reach** — Review any tools you provide to your agent (such as HTTP request tools or general networking utilities) to ensure they cannot make unintended requests to localhost endpoints. Apply URL filtering or allowlisting at the tool level.



