# Troubleshoot AgentCore Runtime - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-troubleshooting.html

---

# Troubleshoot AgentCore Runtime

This troubleshooting topic helps you identify and resolve common issues when working with AgentCore Runtime. By following these solutions, you can quickly diagnose and fix problems with your agent runtimes.

###### Topics

  * My agent invocations fail with "This runtime is not MMDSv2-enabled" ValidationException

  * My agent invocations fail with 504 Gateway Timeout errors

  * My Docker build fails with "403 Forbidden" when pulling Python base images

  * I get "Unknown service: 'bedrock-agent-core-runtime'" error when using boto3

  * I get "AccessDeniedException" when trying to create an Amazon Bedrock AgentCore Runtime

  * My Docker build fails with "exec /bin/sh: exec format error"

  * What are the requirements for Docker containers used with Amazon Bedrock AgentCore Runtime?

  * My long-running tool gets interrupted after 15 minutes

  * My idle sessions are not being released and I am exhausting my session quota

  * How do I access the runtimeSessionId in my agent code for tagging or grouping resources?

  * I have RuntimeClientError (403) issues

  * I have missing or empty CloudWatch Logs

  * I have payload format issues

  * I need help understanding HTTP error codes

  * I need recommendations for testing my agent

  * I need help debugging container issues

  * I need help troubleshooting MCP protocol agents

  * I need help troubleshooting bidirectional streaming using WebSocket

  * My code changes aren’t reflected in existing sessions

  * Spans are missing when my runtime is invoked from a Lambda function

  * My S3 Files or EFS mount fails with "Access denied"

  * My S3 Files or EFS mount fails with "ResourceNotFound"

  * My S3 Files or EFS mount times out

  * I get "Permission Denied" when writing to my mounted filesystem

  * My container fails to start with HTTP 424 error on high-layer images

  * Best practices


## My agent invocations fail with "This runtime is not MMDSv2-enabled" ValidationException

**When this occurs:** When invoking an agent runtime via `InvokeAgentRuntime`, `ExecuteCommand`, `InvokeAgentRuntimeWithWebSocketStream`, `InvokeAgentRuntimeCommandShell`, or `GetAgentCard`

**Why this happens:** Starting June 30, 2026, Amazon Bedrock AgentCore Runtime requires all agent runtimes to use MMDSv2 (MicroVM Metadata Service Version 2). The service rejects invocations targeting runtimes without `metadataConfiguration` set, or with `requireMMDSV2` set to `false` or `null`.

**Solution:** Call [UpdateAgentRuntime](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_UpdateAgentRuntime.html>) with `requireMMDSV2` set to `true` in `metadataConfiguration`:

```python
import boto3

client = boto3.client('bedrock-agentcore-control', region_name='us-west-2')

try:
    client.update_agent_runtime(
        agentRuntimeId='your-agent-runtime-id',
        metadataConfiguration={
            'requireMMDSV2': True
        }
    )
    print("MMDSv2 enabled successfully.")
except client.exceptions.ResourceNotFoundException as e:
    print(f"Runtime not found: {e}")
except Exception as e:
    print(f"Error enabling MMDSv2: {e}")
```
After you update, new invocations will succeed. Existing sessions are not affected.

## My agent invocations fail with 504 Gateway Timeout errors

**When this occurs:** During agent invocation via SDK or console

**Why this happens:** Multiple factors can prevent your agent from responding within the timeout period

Several factors can cause this:

  * **Container Issues:** Make sure your Docker image exposes port 8080 and has the `/invocations` path

  * **ARM64 Compatibility:** Currently your container must be ARM64 compatible

  * **Retry Logic:** Review retry mechanisms for handling transient issues


## My Docker build fails with "403 Forbidden" when pulling Python base images

**When this occurs:** During `docker build` or `docker run` when using `public.ecr.aws` base images

**Why this happens:** ECR Public authentication issues — expired or missing authentication is a common issue.

**Solution:** Either login to ECR Public or logout completely:

```bash
# Option 1: Login to ECR Public
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws

# Option 2: Logout (recommended for avoiding token expiration)
docker logout public.ecr.aws

# Option 3: Use Docker Hub directly in Dockerfile
FROM python:3.10-slim
# instead of public.ecr.aws/docker/library/python:3.10-slim
```
## I get "Unknown service: 'bedrock-agent-core-runtime'" error when using boto3

**When this occurs:** When invoking Amazon Bedrock AgentCore APIs using boto3 SDK

**Why this happens:** Outdated boto3 library — common issue as most installations don’t have latest SDK

**Solution:** Update to latest boto3 and botocore versions:

```bash
pip install --upgrade boto3 botocore

# Minimum versions: boto3 1.39.8+, botocore 1.33.8+
```
## I get "AccessDeniedException" when trying to create an Amazon Bedrock AgentCore Runtime

**When this occurs:** During agent creation via console, SDK, or CLI

**Why this happens:** Either your user lacks permissions, or the execution role isn’t properly configured for Amazon Bedrock AgentCore

**Solution:** Several factors can cause this:

  * **Missing permissions for the caller.** Make sure that the caller’s credentials has `bedrock-agentcore:CreateAgentRuntime`.

  * **Execution Role cannot be assumed by Bedrock Amazon Bedrock AgentCore.** Make sure that the execution role follows this guidance on [permissions for Amazon Bedrock AgentCore Runtime execution role](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-permissions.html>).


## My Docker build fails with "exec /bin/sh: exec format error"

**When this occurs:** When building containers for Amazon Bedrock AgentCore deployment

**Why this happens:** Building ARM64 containers on x86 systems without proper cross-platform setup

**Solution:** Build ARM64 compatible containers. You can consider using [buildx](<https://github.com/docker/buildx>) for cross-platform builds. Alternatively, you can use CodeBuild. For example code, see the [Amazon Bedrock AgentCore Samples](<https://github.com/awslabs/amazon-bedrock-agentcore-samples/>).

## What are the requirements for Docker containers used with Amazon Bedrock AgentCore Runtime?

Review [Amazon Bedrock AgentCore Runtime requirements](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-service-contract.html>) for full details.

In summary, your Docker container must meet these requirements:

  * **Port:** Expose port 8080 (additional ports will be supported soon)

  * **Endpoint:** Must have `/invocations` path available

  * **Architecture:** Must be ARM64 compatible

  * **Response:** Should handle the expected payload format


## My long-running tool gets interrupted after 15 minutes

For information, see [Handle asynchronous and long running agents with Amazon Bedrock Amazon Bedrock AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-long-run.html>) for full details.

**When this occurs:** During long-running agent operations or complex workflows

**Why this happens:** Amazon Bedrock AgentCore automatically terminates sessions after 15 minutes of inactivity. The platform determines activity from the `/ping` response: a session reporting `HealthyBusy` is kept alive, while a session reporting `Healthy` is treated as idle-eligible and its idle time is measured from when the `status` last changed (see the `time_of_last_update` field below).

**Solution:** Ensure your `/ping` endpoint returns `HealthyBusy` while background work is in progress:

```json
{"status": "HealthyBusy"}
```
If you are using the Bedrock AgentCore SDK, the ping response is handled automatically. For custom implementations, ensure your ping handler returns `HealthyBusy` while processing.

## My idle sessions are not being released and I am exhausting my session quota

**When this occurs:** Session count climbs continuously under load and sessions are not released after the idle timeout (for example, `ServiceQuotaExceededException` / `maxVms` errors during a burst of invocations), even though each session is idle.

**Why this happens:** When a session reports `Healthy`, the platform measures how long it has been idle from the `time_of_last_update` field in your `/ping` response, which must reflect when the `status` last changed. If your ping handler sets `time_of_last_update` to the current time on **every** ping, the reported idle time keeps resetting, which prevents the idle timeout from firing. Sessions then live until `MaxLifetime` and can exhaust your session quota.

**Solution:** Update `time_of_last_update` only when the `status` actually changes, or omit it entirely so the platform tracks status changes on its own:

```json
{"status": "Healthy"}
```
If you are using the Bedrock AgentCore SDK, upgrade to the latest version, where the ping response is handled correctly. As a stopgap, calling `StopRuntimeSession` releases stuck sessions.

## How do I access the runtimeSessionId in my agent code for tagging or grouping resources?

**When this applies:** You want to group, tag, or trace resources (e.g., S3 objects, logs) by the current agent runtime session.

**Solutions:**

  * If you’re using the Bedrock Agents SDK, use `context.session_id`.

  * If you’re building a custom runtime server, extract it from the `X-Amzn-Bedrock-AgentCore-Runtime-Session-Id` HTTP header.


**Solution 1:** For agents using the Bedrock Amazon Bedrock AgentCore SDK, use `context.session_id` from your agent entrypoint

```python
@app.entrypoint
def my_agent(payload, context):
    session_id = context.session_id

    # Use session_id for S3 object tagging/organization
    s3_client = boto3.client('s3')
    s3_client.put_object(
        Bucket='my-bucket',
        Key=f'agent-outputs/{session_id}/output.json',
        Body=json.dumps(result),
        Tagging=f'SessionId={session_id}'
    )
    return result
```
**Solution 2:** For custom runtime HTTP servers

The runtime session ID is passed in this HTTP header. Parse it from the incoming request and use it for tagging, correlation, or downstream propagation.

```yaml
X-Amzn-Bedrock-AgentCore-Runtime-Session-Id: <value>
```
## I have RuntimeClientError (403) issues

**Problem**

You receive a 403 "RuntimeClientError" when attempting to invoke your agent runtime.

**Causes**

This error typically occurs due to:

  * Container startup failures

  * Permissions issues with execution role

  * Authentication issues with bearer token


**Resolution**

Follow these steps to resolve the issue:

  1. **Check CloudWatch Logs** : Any issues with starting up the container will reflect as a 403 - RuntimeClientError. Navigate to the following CloudWatch log group to check for startup errors:

```text
/aws/bedrock-agentcore/runtimes/<agent_id>-<endpoint_name>/[runtime-logs]
```
  2. **Verify Execution Role** : Ensure your agent’s execution role has the necessary permissions. For more information, see [AgentCore Runtime execution role](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-permissions.html#runtime-permissions-execution-role>).

  3. **Validate Authentication** : For MCP protocol agents, ensure your bearer token is valid and not expired.


## I have missing or empty CloudWatch Logs

**Problem**

You encounter errors but don’t see any relevant logs in CloudWatch.

**Solution**

Try these approaches to diagnose the issue:

  1. **Check Correct Log Group** : Ensure you’re looking in the right CloudWatch log group. The standard pattern is:

```text
/aws/bedrock-agentcore/runtimes/<agent_id>-<endpoint_name>/runtime-logs
```
  2. **Run Locally for Diagnostics** : If there are no CloudWatch Logs, try running the agent container locally using the exact same payload you used for invocation in AgentCore Runtime. This can help identify issues that might not be visible in the logs.

  3. **Enable Verbose Logging** : Update your agent code to include more detailed logging, especially around the entry points and any error handling logic.


## I have payload format issues

**Problem**

Your agent runtime invocation fails even though the container starts successfully.

**Resolution**

Follow these steps to resolve payload format issues:

  1. **Verify Payload Structure** : Ensure your payload structure matches what your agent expects. Pay special attention to:

     * If your agent code expects `input` keyword in the payload, make sure to include it:

```json
{
    "input": {
        "prompt": "Your question here"
    }
}
```
     * Not just:

```json
{
     "prompt": "Your question here"
}
```
  2. **Check Documentation** : Review the expected input format in the documentation.


## I need help understanding HTTP error codes

**Problem**

Your agent returns HTTP error codes that are difficult to interpret.

**Example error message**

You may see an error like:

```text
An error occurred (RuntimeClientError) when calling the InvokeAgentRuntime operation: Received error (<HTTP Status Code>) from runtime. Please check your CloudWatch logs for more information
```
**Resolution**

Here are the most common error codes and their meanings:

**422 Unprocessable Entity**
    

This happens when the container encounters validation issues with the input payload.

Common causes:

  * Missing required fields in the payload (e.g., missing "input" field)

  * Incorrect data types for fields

  * Invalid format for the payload


**403 Forbidden**
    

Authentication or authorization issues.

Check your bearer token or IAM permissions.

**409 RetryableConflictException**
    

A second operation reached a session while it was still being provisioned or torn down. You see the message `Session operation in progress, please retry`.

**What it means:** This is a transient, retryable conflict — not a terminal error. The window is brief. Already-running sessions are not affected.

**How to fix:** Retry the operation with short exponential backoff. For HTTP-based APIs (such as `InvokeAgentRuntime`, `InvokeAgentRuntimeCommand`, and `StopRuntimeSession`), the AWS SDKs auto-retry this when default retries are enabled. If you disabled retries or call the API directly without an AWS SDK, add the retry yourself. For WebSocket-based APIs (such as `InvokeAgentRuntimeWithWebSocketStream` and `InvokeAgentRuntimeCommandShell`), the AWS SDKs do not auto-retry. Always retry these yourself.

**500 Internal Server Error**
    

Runtime exceptions in your agent code.

Check CloudWatch logs for detailed stack traces.

## I need recommendations for testing my agent

To systematically debug agent runtime issues:

**Test locally first**

Before deploying to AgentCore Runtime:

  * Run your agent container locally using the same Docker image

  * Verify it works with the exact same payload


**Compare payloads**

Ensure consistency between environments:

  * Ensure the payload structure between local testing and AgentCore Runtime invocation is identical

  * Pay special attention to nesting of fields like "input" and "prompt"


## I need help debugging container issues

If you suspect container-related issues:

**Pull and run locally**

Test your container image on your local machine:

```bash
docker pull <your-ecr-repo-uri>
docker run -p 8080:8080 <your-ecr-repo-uri>
```
**Test with curl**

Send test requests to your local container:

```bash
curl -X POST http://localhost:8080/invocations \
     -H "Content-Type: application/json" \
     -d '{"input": {"prompt": "Hello world!"}}'
```
**Check container logs**

Examine the container’s output for errors:

```bash
docker logs <container-id>
```
## I need help troubleshooting MCP protocol agents

For MCP protocol agents, follow these specific troubleshooting steps:

**Verify endpoint path**

MCP servers should listen on `0.0.0.0:8000/mcp/`

**Use MCP Inspector**

Test with the MCP Inspector tool:

  1. Install and run the MCP Inspector: `npx @modelcontextprotocol/inspector`

  2. Connect to your local server at `http://localhost:8000/mcp`

  3. For deployed agents, use the properly URL-encoded endpoint


**Authentication issues**

Check authentication configuration:

  * Ensure bearer token is correctly set in the headers

  * Verify your Cognito user pool is correctly set up


## I need help troubleshooting bidirectional streaming using WebSocket

For bidirectional streaming using WebSocket agents, follow these specific troubleshooting steps:

**Verify endpoint configuration**

WebSocket agents must run on port 8080 and serve WebSocket connections at `/ws` path

**Test locally with incremental complexity**

Start with simple local testing before deploying:

  1. Test basic connection: Verify your agent accepts WebSocket connections at `ws://localhost:8080/ws`

  2. Test message handling: Send simple text messages and verify responses

  3. Test session management: Verify persistent conversations work as expected

  4. Test error handling: Ensure your agent gracefully handles connection drops and malformed messages


**Authentication issues**

Check authentication configuration for deployed agents:

  * For OAuth: Ensure bearer token is valid and not expired

  * For SigV4: Make sure input to the signing algorithm is correct, including the WebSocket URL, headers, and request method

  * Use the correct authentication method that matches your agent’s configuration


**Common connection issues**

Address common WebSocket connection problems:

  * Verify message format compatibility between your agent and client expectations

  * Configure message frame fragmentation or implement chunking to stay within message frame size (64 KB) and message frame rate (250 frames per second) limits to prevent connection closure


## My code changes aren’t reflected in existing sessions

**Problem**

You’ve updated your agent runtime with new code, but existing sessions continue to use the old version.

**Why this happens**

Each microVM session is created with the code assets ( `agentRuntimeArtifact` ) that were deployed at the time of session creation. Once a session is established, it continues using that version of the code until the session terminates, even when code assets are updated as part of performing the [UpdateAgentRuntime](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_UpdateAgentRuntime.html>) operation.

**Solution**

To access your updated code, use a new session ID.

## Spans are missing when my runtime is invoked from a Lambda function

**When this occurs:** When invoking AgentCore Runtime from a Lambda function

**Why this happens:** Lambda generates its own `X-Amzn-Trace-Id` header. If the Lambda trace has `Sampled=0` , this unsampled context propagates to AgentCore Runtime and the runtime skips span generation for that invocation.

**Solution:**

  * **Enable Lambda active tracing:** Turn on X-Ray active tracing on your Lambda function so that it produces sampled traces ( `Sampled=1` ).

  * **Verify CloudWatch Transaction Search:** Ensure you have completed the setup in [Configure observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html>) and that your trace segment destination is set to CloudWatch Logs.

  * **Check the sampling decision:** Log the `_X_AMZN_TRACE_ID` environment variable inside your Lambda function. If it shows `Sampled=0` , active tracing is not enabled or an upstream caller is making the sampling decision.


## My S3 Files or EFS mount fails with "Access denied"

**When this occurs:** During invocation of an agent with S3 Files or EFS storage configured

**Why this happens:** The execution role is missing required filesystem permissions. For more information about configuring persistent storage, see [File system configurations for AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-filesystem-configurations.html>).

**Solution:**

For S3 Files, ensure your execution role has:

```json
{
  "Effect": "Allow",
  "Action": [
    "s3files:ClientMount",
    "s3files:ClientWrite"
  ],
  "Resource": "arn:aws:s3files:<region>:<account>:file-system/*",
  "Condition": {
    "StringEquals": {
      "s3files:AccessPointArn": "<your-access-point-arn>"
    }
  }
}
```
For EFS, ensure your execution role has:

```json
{
  "Effect": "Allow",
  "Action": [
    "elasticfilesystem:ClientMount",
    "elasticfilesystem:ClientWrite"
  ],
  "Resource": "arn:aws:elasticfilesystem:<region>:<account>:file-system/<fs-id>",
  "Condition": {
    "StringEquals": {
      "elasticfilesystem:AccessPointArn": "<your-access-point-arn>"
    }
  }
}
```
Omit `s3files:ClientWrite` or `elasticfilesystem:ClientWrite` if your agent only needs read access.

## My S3 Files or EFS mount fails with "ResourceNotFound"

**When this occurs:** During invocation of an agent with S3 Files or EFS storage configured

**Why this happens:** The filesystem or access point was deleted after the agent was created, or the IDs are incorrect.

**Solution:**

  * Verify the filesystem exists:

    * S3 Files: `aws s3files list-file-systems --region <region>`

    * EFS: `aws efs describe-file-systems --region <region>`

  * Verify the access point exists:

    * S3 Files: `aws s3files list-access-points --file-system-id <fs-id> --region <region>`

    * EFS: `aws efs describe-access-points --file-system-id <fs-id> --region <region>`

  * Verify mount targets exist in all required availability zones:

    * S3 Files: `aws s3files list-mount-targets --file-system-id <fs-id> --region <region>`

    * EFS: `aws efs describe-mount-targets --file-system-id <fs-id> --region <region>`

    * Ensure each mount target shows Available status and is in the same VPC as the agent runtime.

  * If the resource was deleted, recreate it and update the agent runtime with the new access point ARN


## My S3 Files or EFS mount times out

**When this occurs:** During invocation of an agent with S3 Files or EFS storage configured. The invocation may take longer than usual before failing.

**Why this happens:** The VPC network configuration is blocking NFS traffic (port 2049) between the agent’s compute and the filesystem mount targets.

**Solution:**

  * **Check security groups on mount targets:** Verify the security group attached to your mount targets allows **inbound TCP on port 2049** from the security group used by your agent runtime

  * **Check security groups on agent runtime:** Verify the security group used by your agent runtime allows **outbound TCP on port 2049** to the mount target security group

  * **Verify mount targets exist in the correct availability zones:** Mount targets must exist in the same availability zones as the subnets configured on your agent runtime:

    * S3 Files: `aws s3files list-mount-targets --file-system-id <fs-id> --region <region>`

    * EFS: `aws efs describe-mount-targets --file-system-id <fs-id> --region <region>`

  * **Verify subnet routing:** Ensure your subnets have proper routing (local VPC route for the CIDR range)


## I get "Permission Denied" when writing to my mounted filesystem

**When this occurs:** Agent invocation succeeds and the agent can read files from the mount, but writing fails with "Permission denied"

**Why this happens:** Either the IAM role is missing write permissions, or the POSIX permissions on the directory set during access point creation don’t allow writes for the agent’s user.

**Solution:**

  * **Check IAM permissions:** Ensure your execution role includes `s3files:ClientWrite` (S3 Files) or `elasticfilesystem:ClientWrite` (EFS). Without write permissions, the mount is read-only. For more information, see [permissions for Amazon Bedrock AgentCore Runtime execution role](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-permissions.html>).

  * **Check POSIX permissions:** If the directory is owned by a different user than your container process, writes will be denied. Either:

    * Set your access point’s posixUser to match the uid/gid your container runs as, so all operations are performed as that user.

    * Set directory permissions to 777 to allow all users to write.


## My container fails to start with HTTP 424 error on high-layer images

**When this occurs:** Your `InvokeAgentRuntime` calls return HTTP 424 (Failed Dependency) and your agent logs show `Failed to mount overlay: No such file or directory`. This occurs when your container image has more than 53 layers AND uses a non-numeric USER directive (e.g., `USER myuser` instead of `USER 1000`).

**Why this happens:** Container images with many layers combined with non-numeric USER directives can cause initialization failures.

**Solution:** Use one of these workarounds:

  * **Use a numeric USER directive:** In your Dockerfile, replace `USER myuser` with the numeric UID (e.g., `USER 1000`). You can find your user’s UID by running `id myuser` inside the container. This avoids the filesystem mount entirely.

  * **Reduce image layers:** Use multi-stage Docker builds to reduce your image to fewer than 53 layers. You can check your image’s layer count with:


```bash
docker inspect <image> | jq '.[0].RootFS.Layers | length'
```
  * **Squash layers:** Use `docker build --squash` or a tool like `docker-squash` to flatten your image layers.


## Best practices

**Enable comprehensive logging**

Implement thorough logging in your agent:

  * Include request/response logging in your agent

  * Log critical paths and error conditions


**Use structured error handling**

Implement clear error reporting:

  * Return clear error messages with specific codes

  * Include actionable information in error responses


**Test incremental changes**

Follow a methodical testing approach:

  * When modifying your agent, test locally before deployment

  * Validate payload compatibility with both local and deployed environments


**Monitor performance**

Set up monitoring for your agent:

  * Use CloudWatch metrics to track invocation patterns

  * Set up alarms for error rates and latency



