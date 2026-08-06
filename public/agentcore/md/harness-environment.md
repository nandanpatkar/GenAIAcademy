# Environment and filesystem - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-environment.html

---

# Environment and filesystem

Every harness session runs in an isolated microVM with its own filesystem and shell. This page covers configuring the execution environment (default or custom container), running commands directly on the VM, setting environment variables, and mounting persistent filesystems.

## Run commands on the environment

Not everything needs to go through the agent loop. `InvokeAgentRuntimeCommand` gives you direct shell access to the harness microVM: deterministic command execution with no model reasoning, no token cost, no ambiguity.

Use it to:

  * Run deterministic pre-invocation or post-invocation scripts.

  * Prepare the environment before an invocation: clone a repo, install dependencies, copy input files.

  * Act on what the agent produced: run tests, commit and push, extract build artifacts.

  * Inspect the VM during development: `ls`, `cat`, `env`, `python --version` without a round trip through the model.


###### Example

AWS CLI/boto3
     ```python
     response = client.invoke_agent_runtime_command(
         agentRuntimeArn=HARNESS_ARN,
         runtimeSessionId=SESSION_ID,
         body={"command": "ls -la /workspace"},
     )

     for event in response["stream"]:
         chunk = event.get("chunk", {})
         if "contentDelta" in chunk:
             delta = chunk["contentDelta"]
             if "stdout" in delta:
                 print(delta["stdout"], end="", flush=True)
             if "stderr" in delta:
                 print(delta["stderr"], end="", flush=True)
         elif "contentStop" in chunk:
             print(f"\n[exit code: {chunk['contentStop']['exitCode']}]")
     ```
AgentCore CLI
     ```bash
     # Install dependencies before the agent starts
     agentcore invoke --exec --harness my-agent --session-id "$(uuidgen)" \
       "pip install pandas matplotlib"

     # After the agent finishes, inspect what it created
     agentcore invoke --exec --harness my-agent --session-id "$(uuidgen)" \
       "ls -la /tmp && cat /tmp/results.csv"
     ```
###### Note

The base environment includes Python and bash. For tools like `git`, `node`, or other runtimes, install them at session start (e.g. `apt-get install -y git`) or use a custom environment.

In the TUI, press `!` to enter exec mode and run commands inline.

See [InvokeAgentRuntimeCommand API](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_InvokeAgentRuntimeCommand.html>) for details.

###### Note

Commands run as root (uid 0) within the microVM. This is analogous to root on your own EC2 instance - the IAM permission is the access gate, not the in-VM privilege level. If your Dockerfile includes a `USER` directive, it applies to the agent process only (the container’s main entrypoint). `InvokeAgentRuntimeCommand` runs at a higher privilege level for operational purposes, similar to how `docker exec` defaults to root even when the container runs as a non-root user. See [Execute shell commands in AgentCore Runtime sessions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-execute-command.html>) for full details on security, error handling, and best practices.

## Custom environment (container images)

The base environment includes Python and bash, enough for most tasks. When you need more, package your source code, dependencies, runtimes, and tools into a container image, push it to ECR, and reference it on the harness. Your agent runs in that exact environment. Pair custom images with `InvokeAgentRuntimeCommand` for session-specific setup that varies per invocation.

Container images must be built for the `linux/arm64` platform.

The harness overrides your container’s `ENTRYPOINT` and `CMD` to keep it running as an environment. Your installed software, filesystem, and environment variables are available to the agent; your container’s startup command is not executed. If you need a background process (such as a dev server), start it via `InvokeAgentRuntimeCommand` after the session begins.

###### Example

AWS CLI/boto3
     ```bash
     aws bedrock-agentcore-control create-harness \
       --harness-name "CodingAgent" \
       --execution-role-arn "arn:aws:iam::123456789012:role/MyHarnessRole" \
       --environment-artifact '{"containerConfiguration": {"containerUri": "123456789012.dkr.ecr.us-west-2.amazonaws.com/my-dev-env:latest"}}' \
       --system-prompt '[{"text": "You are an expert TypeScript developer."}]'
     ```
The execution role needs ECR pull permissions. See the [execution role policy](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-security.html#harness-execution-role-policy>) for details.

AgentCore CLI
    

Scaffold a harness with a Dockerfile:

```bash
agentcore create --name coding-agent --container ./Dockerfile
agentcore deploy
```
At deploy, the CLI builds the image, pushes to ECR, and attaches it to the harness.

Or reference a pre-built image:

```bash
agentcore create --name node-agent \
  --container public.ecr.aws/docker/library/node:slim
agentcore deploy
```
## Environment variables

Set environment variables that are passed to the runtime container. Environment variables are available to the agent and any custom container running in the session.

###### Example

AWS CLI/boto3
     ```bash
     aws bedrock-agentcore-control create-harness \
       --harness-name "MyHarness" \
       --execution-role-arn "arn:aws:iam::123456789012:role/MyHarnessRole" \
       --environment-variables '{"MY_API_URL": "https://api.example.com", "LOG_LEVEL": "debug"}'
     ```
AgentCore CLI
    

Set environment variables in `harness.json`:

```json
{
  "environmentVariables": {
    "MY_API_URL": "https://api.example.com",
    "LOG_LEVEL": "debug"
  }
}
```
Run `agentcore deploy` to apply.

## Filesystem

The harness mounts persistent storage at paths you specify. Files written to these mounts survive session termination and are visible to later invocations.

A harness supports three filesystem types:

  * **Session storage** \- service-managed, per-session storage that persists across stop/resume cycles for the same `runtimeSessionId`. No VPC required.

  * **Amazon EFS access point** \- bring-your-own EFS file system, shared across sessions and agents. VPC required.

  * **Amazon S3 Files access point** \- bring-your-own S3 Files file system that syncs bidirectionally with an S3 bucket. VPC required.


For prerequisites (VPC networking, IAM permissions, security groups), type comparison, limits, and lifecycle behavior, see [File system configurations for AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-filesystem-configurations.html>). The same requirements apply to harnesses.

### Configure the environment and filesystem in the AgentCore CLI

###### Example

Interactive
    

Run `agentcore` in a project directory to open the TUI, select **add** , then choose **Harness** . The wizard walks you through the execution environment and, in **Advanced settings** , the persistent filesystem.

  1. On the **Custom environment** step, keep the default environment or choose a pre-built container image (ECR URI) or a Dockerfile.

![Add Harness wizard: custom environment](/agentcore/images/harness-env-01-custom-environment.png)

  2. Filesystem mounts require VPC mode, so on **Advanced settings** enable both **Network** and **Filesystem Storage** with **Space** , then press **Enter** .

![Advanced settings with Network and Filesystem Storage enabled](/agentcore/images/harness-env-02-advanced.png)

  3. Choose **VPC** network mode, then provide the subnets and security groups for the harness.

![Select VPC network mode](/agentcore/images/harness-env-03-network.png)

  4. Set the session storage mount path (under `/mnt`).

![Enter the session storage mount path](/agentcore/images/harness-env-04-fs-type.png)

  5. To attach an Amazon EFS file system, enter the EFS access point ARN (and its mount path on the next step).

![Enter the EFS access point ARN](/agentcore/images/harness-env-05-efs.png)

  6. To attach Amazon S3 Files, enter the S3 Files access point ARN (and its mount path).

![Enter the S3 Files access point ARN](/agentcore/images/harness-env-06-s3.png)


Confirm the wizard, then run `agentcore deploy` to apply.

### Session storage

Files written to the mount path persist across stop/resume cycles when you invoke with the same `runtimeSessionId`.

###### Example

AWS CLI/boto3
     ```bash
     aws bedrock-agentcore-control update-harness \
       --harness-id "MyHarness-UuFdkQoXSL" \
       --environment '{"agentCoreRuntimeEnvironment": {"filesystemConfigurations": [{"sessionStorage": {"mountPath": "/mnt/data/"}}]}}'
     ```
AgentCore CLI
     ```bash
     # At create time
     agentcore create --name myagent --session-storage-mount-path /mnt/data/

     # Or add to an existing harness
     agentcore add harness --name my-agent --session-storage /mnt/data/
     agentcore deploy
     ```
### Amazon EFS access point

Attach an EFS access point ARN at a mount path under `/mnt`. Data persists in your account and can be shared with other harnesses or agent runtimes that mount the same access point.

###### Example

AWS CLI/boto3
     ```bash
     aws bedrock-agentcore-control create-harness \
       --harness-name "SharedToolsAgent" \
       --execution-role-arn "arn:aws:iam::123456789012:role/MyHarnessRole" \
       --environment '{
         "agentCoreRuntimeEnvironment": {
           "networkConfiguration": {
             "networkMode": "VPC",
             "networkModeConfig": {
               "subnets": ["subnet-abc123", "subnet-def456"],
               "securityGroups": ["sg-abc123"]
             }
           },
           "filesystemConfigurations": [
             {
               "efsAccessPoint": {
                 "accessPointArn": "arn:aws:elasticfilesystem:us-west-2:123456789012:access-point/fsap-0123456789abcdef0",
                 "mountPath": "/mnt/efs"
               }
             }
           ]
         }
       }'
     ```
AgentCore CLI
    

Attach an EFS access point with `--efs-access-point` as `<accessPointArn>:<mountPath>`. EFS requires VPC network mode:

```bash
agentcore add harness --name shared-tools-agent \
  --network-mode VPC \
  --subnets subnet-abc123,subnet-def456 \
  --security-groups sg-abc123 \
  --efs-access-point arn:aws:elasticfilesystem:us-west-2:123456789012:access-point/fsap-0123456789abcdef0:/mnt/efs
agentcore deploy
```
###### Note

The mount path must be under `/mnt`. The flag is repeatable (up to 2 EFS mounts); `--network-mode VPC` with `--subnets` and `--security-groups` is required for EFS and S3 Files mounts.

### Amazon S3 Files access point

Attach an S3 Files access point ARN at a mount path under `/mnt`. Files at the mount path sync bidirectionally with the backing S3 bucket.

###### Example

AWS CLI/boto3
     ```bash
     aws bedrock-agentcore-control create-harness \
       --harness-name "DataAgent" \
       --execution-role-arn "arn:aws:iam::123456789012:role/MyHarnessRole" \
       --environment '{
         "agentCoreRuntimeEnvironment": {
           "networkConfiguration": {
             "networkMode": "VPC",
             "networkModeConfig": {
               "subnets": ["subnet-abc123", "subnet-def456"],
               "securityGroups": ["sg-abc123"]
             }
           },
           "filesystemConfigurations": [
             {
               "s3FilesAccessPoint": {
                 "accessPointArn": "arn:aws:s3files:us-west-2:123456789012:file-system/fs-0123456789abcdef0/access-point/fsap-0123456789abcdef0",
                 "mountPath": "/mnt/s3data"
               }
             }
           ]
         }
       }'
     ```
AgentCore CLI
    

Attach an S3 Files access point with `--s3-access-point` as `<accessPointArn>:<mountPath>`. S3 Files requires VPC network mode:

```bash
agentcore add harness --name data-agent \
  --network-mode VPC \
  --subnets subnet-abc123,subnet-def456 \
  --security-groups sg-abc123 \
  --s3-access-point arn:aws:s3files:us-west-2:123456789012:file-system/fs-0123456789abcdef0/access-point/fsap-0123456789abcdef0:/mnt/s3data
agentcore deploy
```
###### Note

The access point ARN itself contains colons; the mount path is taken from the segment after the final colon. The flag is repeatable (up to 2 S3 Files mounts).

###### Important

`UpdateHarness` replaces the entire `filesystemConfigurations` list. To add a new mount to a harness that already has filesystems configured, call `GetHarness` first, then send the full desired list (existing entries plus the new one) in `UpdateHarness`.

Learn more: [File system configurations for AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-filesystem-configurations.html>).

#### Related topics

  * [Skills](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-skills.html>) \- attach skills from Git, S3, or AWS Skills

  * [Memory](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-memory.html>) \- persist conversations across sessions

  * [Tools](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-tools.html>) \- connect tools to your harness

  * [Security and access controls](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-security.html>) \- execution role policies and VPC configuration

  * [API Documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-get-started.html#api-documentation>)



