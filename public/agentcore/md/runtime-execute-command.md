# Execute shell commands in AgentCore Runtime sessions - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-execute-command.html

---

# Execute shell commands in AgentCore Runtime sessions

The [InvokeAgentRuntimeCommand](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_InvokeAgentRuntimeCommand.html>) operation lets you execute shell commands directly inside a running AgentCore Runtime session and stream the output back over HTTP/2. Commands run in the same container, filesystem, and environment as your agent - the same session used by `InvokeAgentRuntime` . This enables workflows where your application uses the agent for reasoning tasks and commands for deterministic operations like running tests, git operations, or environment setup.

To call `InvokeAgentRuntimeCommand` , you need `bedrock-agentcore:InvokeAgentRuntimeCommand` permissions.

## How it works

`InvokeAgentRuntimeCommand` runs a shell command inside the container of an active AgentCore Runtime session and streams the output back.

**Same agent, same session**

`InvokeAgentRuntimeCommand` operates on the same agent runtime and session as `InvokeAgentRuntime` . You don’t create separate resources. The agent you deployed with `CreateAgentRuntime` accepts both agent invocations and command execution on any active session.

###### Note

The AgentCore Runtime microVM does not include developer tools like `git` , `npm` , or language runtimes by default. Any tools your commands depend on must be included in your container image (via your Dockerfile) or installed dynamically at runtime.

The response is a stream of three event types:

Event | When | Contains  
---|---|---  
`contentStart` |  First chunk |  Confirms the command started  
`contentDelta` |  During execution |  `stdout` and/or `stderr` output  
`contentStop` |  Last chunk |  `exitCode` and `status` ( `COMPLETED` or `TIMED_OUT` )  
  
Output streams in real time. You see results as they run, not after they finish.

## Prerequisites

  * `bedrock-agentcore:InvokeAgentRuntimeCommand` IAM permission

  * A valid AgentCore Runtime endpoint ARN


###### Note

Agents created after March 17, 2026 support command execution automatically. If you deployed your agent before this date, you must redeploy it to update the agent runtime.

## Execute a command

###### Example

Python
    

  1. The following example shows how to use boto3 to execute a command in a AgentCore Runtime session.

```python
import boto3
import sys

client = boto3.client('bedrock-agentcore', region_name='us-west-2')

response = client.invoke_agent_runtime_command(
    agentRuntimeArn='arn:aws:bedrock-agentcore:us-west-2:account-id:runtime/my-agent',
    runtimeSessionId='session-id-at-least-33-characters-long',
    qualifier='DEFAULT',
    contentType='application/json',
    accept='application/vnd.amazon.eventstream',
    body={
        'command': '/bin/bash -c "npm test"',
        'timeout': 60
    }
)

# Process the streaming response
for event in response.get('stream', []):
    if 'chunk' in event:
        chunk = event['chunk']

        if 'contentStart' in chunk:
            print("Command execution started")

        if 'contentDelta' in chunk:
            delta = chunk['contentDelta']
            if delta.get('stdout'):
                print(delta['stdout'], end='')
            if delta.get('stderr'):
                print(delta['stderr'], end='', file=sys.stderr)

        if 'contentStop' in chunk:
            stop = chunk['contentStop']
            print(f"\nExit code: {stop.get('exitCode')}, Status: {stop.get('status')}")
```
Java
    

  1. The following example shows how to use the AWS SDK for Java to execute a command in a AgentCore Runtime session.

```python
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.bedrockagentcore.BedrockAgentCoreAsyncClient;
import software.amazon.awssdk.services.bedrockagentcore.model.*;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

public class ExecuteCommandExample {
    public static void main(String[] args) throws Exception {
        String agentArn = "arn:aws:bedrock-agentcore:us-west-2:account-id:runtime/my-agent";
        String sessionId = UUID.randomUUID().toString();

        BedrockAgentCoreAsyncClient client = BedrockAgentCoreAsyncClient.builder()
                .region(Region.US_WEST_2)
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();

        InvokeAgentRuntimeCommandRequest request = InvokeAgentRuntimeCommandRequest.builder()
                .agentRuntimeArn(agentArn)
                .runtimeSessionId(sessionId)
                .qualifier("DEFAULT")
                .contentType("application/json")
                .accept("application/vnd.amazon.eventstream")
                .body(InvokeAgentRuntimeCommandRequestBody.builder()
                        .command("/bin/bash -c \"npm test\"")
                        .timeout(60)
                        .build())
                .build();

        InvokeAgentRuntimeCommandResponseHandler handler = InvokeAgentRuntimeCommandResponseHandler.builder()
                .subscriber(InvokeAgentRuntimeCommandResponseHandler.Visitor.builder()
                        .onChunk(chunk -> {
                            if (chunk.contentStart() != null) {
                                System.out.println("Command execution started");
                            }
                            if (chunk.contentDelta() != null) {
                                ContentDeltaEvent delta = chunk.contentDelta();
                                if (delta.stdout() != null) System.out.print(delta.stdout());
                                if (delta.stderr() != null) System.err.print(delta.stderr());
                            }
                            if (chunk.contentStop() != null) {
                                ContentStopEvent stop = chunk.contentStop();
                                System.out.println("\nExit code: " + stop.exitCode() +
                                    ", Status: " + stop.statusAsString());
                            }
                        })
                        .build())
                .build();

        CompletableFuture<Void> future = client.invokeAgentRuntimeCommand(request, handler);
        future.get();
        client.close();
    }
}
```
JavaScript
    

  1. The following example shows how to use the AWS SDK for JavaScript v3 to execute a command in a AgentCore Runtime session.

```python
import {
    BedrockAgentCoreClient,
    InvokeAgentRuntimeCommandCommand
} from "@aws-sdk/client-bedrock-agentcore";
import { randomUUID } from "crypto";

const client = new BedrockAgentCoreClient({ region: "us-west-2" });

const request = {
    agentRuntimeArn: "arn:aws:bedrock-agentcore:us-west-2:account-id:runtime/my-agent",
    runtimeSessionId: randomUUID(),
    qualifier: "DEFAULT",
    contentType: "application/json",
    accept: "application/vnd.amazon.eventstream",
    body: {
        command: '/bin/bash -c "npm test"',
        timeout: 60,
    },
};

const command = new InvokeAgentRuntimeCommandCommand(request);
const response = await client.send(command);

// Process the event stream
for await (const event of response.stream) {
    if (event.chunk) {
        const chunk = event.chunk;

        if (chunk.contentStart) {
            console.log("Command execution started");
        }

        if (chunk.contentDelta) {
            if (chunk.contentDelta.stdout) process.stdout.write(chunk.contentDelta.stdout);
            if (chunk.contentDelta.stderr) process.stderr.write(chunk.contentDelta.stderr);
        }

        if (chunk.contentStop) {
            console.log(`\nExit code: ${chunk.contentStop.exitCode}, ` +
                `Status: ${chunk.contentStop.status}`);
        }
    }
}

client.destroy();
```
## Coding agent workflow example

A common pattern is to use `InvokeAgentRuntime` for reasoning and `InvokeAgentRuntimeCommand` for deterministic operations in the same session.

**Example End-to-end coding agent workflow**

```python
import boto3
import json

client = boto3.client('bedrock-agentcore', region_name='us-west-2')

AGENT_ARN = 'arn:aws:bedrock-agentcore:us-west-2:account-id:runtime/my-agent'
SESSION_ID = 'session-id-at-least-33-characters-long'

def run_command(command, timeout=60):
    """Helper to run a command and return the exit code."""
    response = client.invoke_agent_runtime_command(
        agentRuntimeArn=AGENT_ARN,
        runtimeSessionId=SESSION_ID,
        contentType='application/json',
        accept='application/vnd.amazon.eventstream',
        body={'command': command, 'timeout': timeout}
    )
    for event in response.get('stream', []):
        if 'chunk' in event and 'contentStop' in event['chunk']:
            return event['chunk']['contentStop'].get('exitCode')
    return None

# Step 1: Invoke the agent to analyze and write a fix
response = client.invoke_agent_runtime(
    agentRuntimeArn=AGENT_ARN,
    runtimeSessionId=SESSION_ID,
    payload=json.dumps({"prompt": "Read JIRA-1234 and implement the fix in /workspace"}).encode()
)
# Process agent response...

# Step 2: Run tests deterministically
exit_code = run_command('/bin/bash -c "cd /workspace && npm test"', timeout=300)

# Step 3: If tests pass, commit and push
if exit_code == 0:
    run_command('/bin/bash -c "cd /workspace && git checkout -b fix/JIRA-1234"')
    run_command('/bin/bash -c "cd /workspace && git add -A && git commit -m \'Fix JIRA-1234\'"')
    run_command('/bin/bash -c "cd /workspace && git push origin fix/JIRA-1234"')
```
The agent writes the code. The platform runs the commands. Each does what it’s best at.

## Common use cases

Running test suites
    

After the agent writes code, run the project’s test suite as a command. The streaming response lets you detect failures early and feed specific error output back to the agent for iteration.

```text
/bin/bash -c "cd /workspace && npm test 2>&1"
```
Git operations
    

Branching, committing, and pushing are deterministic operations. Run them as commands after the agent completes its work, keeping version control logic out of the LLM.

```text
/bin/bash -c "cd /workspace && git add -A && git commit -m 'Fix issue'"
```
Dependency installation
    

Bootstrap the environment before invoking the agent -clone repos, install packages, set up build tooling. This preparation runs faster and more reliably as direct commands.

```text
/bin/bash -c "pip install -r requirements.txt"
```
Build and compile
    

Compile steps and asset generation -anything with a known command that should run exactly as specified.

```text
/bin/bash -c "cd /workspace && cargo build --release"
```
Linting and validation
    

Run code quality checks as a validation gate after the agent writes code, before committing.

```text
/bin/bash -c "cd /workspace && npx eslint src/ --format json"
```
Environment inspection
    

Check runtime state, installed packages, available tools -useful for debugging agent failures.

```text
/bin/bash -c "python --version && node --version && git --version"
```
Data operations
    

Fetch datasets, upload results, run data transformations -network and compute operations that run faster as direct commands.

```text
/bin/bash -c "aws s3 cp s3://my-bucket/data.csv /workspace/"
```
## Key design choices

One-shot, non-interactive execution
    

Each command spawns a new bash process, runs to completion (or timeout), and returns. There is no persistent shell session between commands. This matches how agent frameworks use command execution -craft a command, run it, read the output, decide what to do next.

Streaming response over HTTP/2
    

Output arrives as it’s produced, not buffered until completion. A `npm test` that takes two minutes streams results in real time. Your application can detect a failure in the first few seconds and cancel early rather than waiting for the full run.

Container isolation
    

Commands execute inside the same container as your agent code. They see the same filesystem, environment variables, and installed packages. A file the agent wrote at `/workspace/fix.py` is immediately visible to a command running `cat /workspace/fix.py`.

Non-blocking to the runtime
    

Command execution doesn’t block agent invocations. You can invoke the agent and run commands concurrently on the same session. The platform handles the concurrency.

Stateless between commands
    

Each command starts fresh -no shell history, no environment variable changes from previous commands carry over. If you need state, encode it in the command itself: `cd /workspace && export NODE_ENV=test && npm test`.

## Security considerations

###### Tip

For a consolidated view of all Runtime security recommendations, see [Security best practices for AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-security-best-practices.html>).

###### Important

Under the AWS shared responsibility model, you are responsible for the security of the commands you execute in your AgentCore Runtime sessions. AWS provides the secure infrastructure and isolation at the microVM level. You are responsible for the commands you run, the data you process, and the access controls you configure.

The security boundary for command execution is the microVM. Each AgentCore Runtime session runs in an isolated microVM with its own kernel, memory, and filesystem. Commands you execute cannot access other customers' workloads or escape the VM boundary. However, within your VM, commands have full access to the container filesystem and any credentials or secrets you have configured.

**Auditing with CloudWatch Logs**

AgentCore Runtime sends the request ID and the input command to your agent’s Amazon CloudWatch Logs log group. You can use these logs to monitor command activity and maintain an audit trail of what commands were executed in your sessions. The command execution output (stdout and stderr) is streamed back to your application and is not logged by the service.

**Auditing with CloudTrail**

AWS CloudTrail records `InvokeAgentRuntimeCommand` API calls in your account. Each record includes metadata such as the caller identity, timestamp, source IP address, and response status. CloudTrail does not log the request or response payload. Use CloudTrail to audit who executed commands and when, then correlate with CloudWatch Logs logs using the request ID to see what command was executed.

For sensitive workloads, consider implementing additional controls such as:

  * Using IAM policies to restrict which principals can call `InvokeAgentRuntimeCommand`

  * Configuring VPC endpoints to keep traffic within your network

  * Setting up CloudWatch Logs metric filters and alarms to detect unexpected command patterns

  * Reviewing CloudTrail logs regularly for unauthorized access attempts


## Error handling

When using the `InvokeAgentRuntimeCommand` operation, you might encounter the following errors:

**ValidationException**
    

Occurs when the request parameters are invalid. Check that your agent ARN, session ID, and command are correctly formatted. The command must be between 1 byte and 64 KB, the timeout must be between 1 and 3600 seconds, and the session ID must be at least 33 characters.

**ResourceNotFoundException**
    

Occurs when the specified agent runtime or session cannot be found. Verify that the agent ARN is correct and that the session is active.

**AccessDeniedException**
    

Occurs when you don’t have the necessary permissions. Ensure that your IAM policy includes the `bedrock-agentcore:InvokeAgentRuntimeCommand` permission.

**ThrottlingException**
    

Occurs when you exceed the request rate limit of 25 TPS. Implement exponential backoff and retry logic in your application.

**RetryableConflictException**
    

Occurs (HTTP 409) when an `InvokeAgentRuntimeCommand` operation targets a session that the service is provisioning or tearing down. The message is `Session operation in progress, please retry`. This condition is transient and retryable. Retry with short exponential backoff instead of treating it as terminal. The AWS SDKs auto-retry this exception when default retries are enabled. If you disabled retries or call the API directly without an AWS SDK, retry it yourself.

A command that completes with a non-zero exit code is not an API error. Check the `exitCode` in the `contentStop` event to determine if the command itself succeeded. A `status` of `TIMED_OUT` indicates the command exceeded the specified timeout.

## Best practices

Follow these best practices when using the `InvokeAgentRuntimeCommand` operation:

  * Use `InvokeAgentRuntimeCommand` for deterministic operations (tests, git, builds) and `InvokeAgentRuntime` for reasoning tasks. Don’t route deterministic operations through the LLM.

  * Include any developer tools your commands depend on (such as `git` , `npm` , or language runtimes) in your container image via your Dockerfile.

  * Always check the `exitCode` in the `contentStop` event to determine if the command succeeded.

  * Set appropriate timeouts. A test suite might need 5 minutes, while a `git push` might only need 30 seconds.

  * Process streaming output incrementally to detect failures early. You can cancel a long-running command rather than waiting for it to complete.

  * Encode state in the command itself using `&&` chaining (for example, `cd /workspace && export NODE_ENV=test && npm test` ), since each command starts a fresh bash process.

  * Use UUIDs for session IDs to meet the 33-character minimum requirement (for example, `12345678-1234-1234-1234-123456789012` ).



