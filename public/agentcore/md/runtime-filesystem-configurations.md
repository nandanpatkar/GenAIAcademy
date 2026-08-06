# File system configurations for AgentCore Runtime - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-filesystem-configurations.html

---

# File system configurations for AgentCore Runtime

AgentCore Runtime supports persistent file systems through the `filesystemConfigurations` parameter. Each configuration mounts storage at a path you specify. You don’t need custom mount code, privileged containers, or download orchestration.

AgentCore Runtime supports two categories of file system configurations:

  * **Managed session storage (Preview)** – Service-managed per-session storage that persists across stop/resume cycles. Isolated per session. No VPC required.

  * **Bring-your-own file system** – Attach your own Amazon S3 Files or Amazon EFS access points directly to your agent runtime. Shared across sessions and agents. VPC required.


You can combine both categories on a single agent runtime (up to 5 total configurations).

## Storage options at a glance

The following table compares the available file system configuration types.

Category | Type | Isolation | Persistence | VPC required | Best for  
---|---|---|---|---|---  
Managed |  Session storage (Preview) |  Per-session |  Survives stop/resume; 14-day idle expiry; resets on version update |  No |  Scratch space, installed packages, code, project files, agent state  
BYO |  Amazon S3 Files |  Shared – multiple sessions and agents access the same data |  Customer-managed (permanent, syncs to S3 bucket) |  Yes |  Datasets accessible through both standard file operations and S3 APIs  
BYO |  Amazon EFS |  Shared – multiple sessions and agents access the same data |  Customer-managed (permanent until you delete it) |  Yes |  Shared tool libraries, model weights, read-write multi-agent collaboration  
  
## Quick start

The following checklists provide condensed steps for configuring each file system type.

### Managed session storage (Preview)

  1. No VPC or additional IAM permissions required.

  2. Add `--filesystem-configurations '[{"sessionStorage": {"mountPath": "/mnt/workspace"}}]'` to your `create-agent-runtime` or `update-agent-runtime` call.

  3. Invoke the agent with a `--runtime-session-id`.

  4. Stop the session, then resume with the same `--runtime-session-id`. Verify `/mnt/workspace` retains your data.


### Bring-your-own file system

#### Amazon S3 Files access point

  1. Add `s3files:ClientMount`, `s3files:ClientWrite`, and `s3files:GetAccessPoint` to your execution role with an `s3files:AccessPointArn` condition.

  2. Allow TCP port 2049 outbound from your agent runtime security group to your S3 Files mount target security group.

  3. Confirm the S3 Files mount target is in the same VPC and Availability Zone as your agent runtime subnets.

  4. Add `--filesystem-configurations '[{"s3FilesAccessPoint": {"accessPointArn": "<your-access-point-arn>", "mountPath": "/mnt/s3data"}}]'` to your `create-agent-runtime` or `update-agent-runtime` call.

  5. Invoke the agent. Files at `/mnt/s3data` sync bidirectionally with the backing S3 bucket.


#### Amazon EFS access point

  1. Add `elasticfilesystem:ClientMount` and `elasticfilesystem:ClientWrite` to your execution role with an `elasticfilesystem:AccessPointArn` condition.

  2. Allow TCP port 2049 outbound from your agent runtime security group to your EFS mount target security group.

  3. Confirm the EFS mount target is in the same Availability Zone as at least one of your agent runtime subnets.

  4. Add `--filesystem-configurations '[{"efsAccessPoint": {"accessPointArn": "<your-access-point-arn>", "mountPath": "/mnt/efs"}}]'` to your `create-agent-runtime` or `update-agent-runtime` call.

  5. Invoke the agent. Your files are available at `/mnt/efs`.


Both S3 Files and EFS require VPC connectivity on the agent runtime.

## How each type works

The following sections describe how each file system type operates within AgentCore Runtime.

### Bring-your-own file systems

When you configure a bring-your-own file system, AgentCore Runtime mounts the specified access point into every session at the path you configure. Data is shared – multiple sessions, multiple agents, or external applications can access the same file system simultaneously.

AgentCore handles all mount operations automatically. You don’t need to install mount helpers, manage TLS certificates, or write mount code in your agent.

###### Note

When you create an access point (S3 Files or EFS), you specify a POSIX user ID (UID) and group ID (GID). All file operations through the access point run as this identity. Set the UID/GID to match the user your container process runs as (typically 1000:1000 for non-root containers, or 0:0 for root).

#### Amazon S3 Files mount flow

When you configure an S3 Files access point, the following sequence occurs:

  1. You create an S3 Files file system (backed by an S3 bucket) and mount targets in your VPC.

  2. You create an S3 Files access point specifying the POSIX UID/GID and root directory.

  3. You configure the agent runtime with the access point ARN and mount path.

  4. On invocation with a new session ID, AgentCore provisions a microVM with network access to your VPC.

  5. The microVM mounts the file system through NFSv4.2 over TLS with IAM authentication (port 2049) via your VPC.

  6. Your agent reads and writes files at the mount path. Changes automatically sync to the backing S3 bucket.


**S3 Files semantics**

  * Bidirectional sync between file system and backing S3 bucket

  * Close-to-open consistency for NFS clients; S3 eventual consistency for bucket-side access

  * Max file size: 48 TiB; max directory depth: 1,000 levels

  * Not supported: Hard links, S3 archival storage classes (Glacier), custom S3 object metadata, pNFS


#### Amazon EFS mount flow

When you configure an EFS access point, the following sequence occurs:

  1. You create an EFS file system and mount targets in your VPC (one per Availability Zone).

  2. You create an EFS access point specifying the POSIX UID/GID and root directory.

  3. You configure the agent runtime with the access point ARN and mount path.

  4. On invocation with a new session ID, AgentCore provisions a microVM with network access to your VPC.

  5. The microVM mounts the file system through NFSv4.1 over TLS (port 2049) via the mount target in the same Availability Zone.

  6. Your agent reads and writes files at the mount path using standard file operations.


**EFS semantics**

  * Full POSIX: hard links, symbolic links, advisory file locking

  * Concurrent read-write access from multiple sessions and agents

  * Close-to-open consistency

  * Max file size: 47.9 TiB; max directory depth: 1,000 levels


### Managed session storage (Preview)

Persist session state across stop/resume with a filesystem configuration using managed session storage. AgentCore Runtime managed session storage is a fully service-managed capability where AgentCore Runtime handles all storage operations. Your agent reads and writes to a local file system mount and the runtime environment transparently replicates data to service storage throughout the session duration.

Session storage is isolated per session – each session can only access its own storage and cannot read or write data from other sessions of the same agent runtime or sessions of different agent runtimes.

When you configure session storage on an agent runtime, each session gets a persistent directory at the mount path you specify. The lifecycle works as follows:

  1. **First invoke on a session** – A new isolated compute is provisioned. Your agent sees an empty directory at the mount path.

  2. **Agent writes files** – All file operations (read, write, mkdir, rename) work as normal, similar to a local file system, and data is asynchronously replicated to durable storage.

  3. **Session stops** – The compute is terminated. Any data not yet persisted is flushed to durable storage during graceful shutdown.

  4. **Resume with same session** – A new compute is provisioned and the file system state is restored from durable storage. The agent can continue from where it left off.


#### Filesystem semantics

Session storage provides a standard Linux file system at your configured mount path. Standard tools and operations work without modification – `ls`, `cat`, `mkdir`, `git`, `npm`, `pip`, and `cargo` all work as expected.

**Supported operations**

Regular files, directories, and symlinks. Read, write, rename, delete, `chmod`, `chown`, `stat`, and `readdir` – standard POSIX file operations used by common development tools.

**Limits**

For session storage limits including maximum storage size, file count, and directory depth, see [Session storage limits](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./bedrock-agentcore-limits.html#session-storage-limits>).

**Unsupported operations**

The following file system operations are not supported:

  * **Hard links** – Use symlinks instead.

  * **Device files, FIFOs, or UNIX sockets** – `mknod` is not supported.

  * **Extended attributes (xattr)** – Tools that depend on xattr metadata are not supported.

  * **fallocate** – Sparse file preallocation is not supported.

  * **File locking across sessions** – Advisory locks work within a running session but are not persisted across stop/resume. Tools that use file-based locking (such as `git`) are unaffected.


###### Note

Permissions are stored but not enforced within the session. `chmod` and `stat` work correctly, but access checks always succeed because the agent runs as the only user in the microVM.

#### Session storage lifecycle

Session data is deleted (reset to a clean state) in the following scenarios:

  * The session is not invoked for **14 days.**

  * The agent runtime version is updated. Invoking a session after a version update provisions a fresh file system.


Use [DeleteAgentRuntime](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_DeleteAgentRuntime.html>) or [DeleteAgentRuntimeEndpoint](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_DeleteAgentRuntimeEndpoint.html>) to delete all session storage data associated with the runtime or endpoint.

## Prerequisites for bring-your-own file systems

Before you configure a bring-your-own file system, complete the following prerequisites.

### VPC configuration

Your agent runtime must use `networkMode: VPC`. The subnets you specify must overlap with the file system mount target Availability Zones.

### IAM permissions

Your agent runtime execution role must include permissions to mount the file system.

**IAM permissions for S3 Files**

```json
{
  "Effect": "Allow",
  "Action": [
    "s3files:ClientMount",
    "s3files:ClientWrite",
    "s3files:GetAccessPoint"
  ],
  "Resource": "arn:aws:s3files:<region>:<account-id>:file-system/<file-system-id>",
  "Condition": {
    "ArnEquals": {
      "s3files:AccessPointArn": "arn:aws:s3files:<region>:<account-id>:file-system/<file-system-id>/access-point/<access-point-id>"
    }
  }
}
```
**IAM permissions for EFS**

```json
{
  "Effect": "Allow",
  "Action": [
    "elasticfilesystem:ClientMount",
    "elasticfilesystem:ClientWrite"
  ],
  "Resource": "arn:aws:elasticfilesystem:<region>:<account-id>:file-system/<file-system-id>",
  "Condition": {
    "ArnEquals": {
      "elasticfilesystem:AccessPointArn": "arn:aws:elasticfilesystem:<region>:<account-id>:access-point/<access-point-id>"
    }
  }
}
```
Omit `ClientWrite` if your agent only needs read access. The `s3files:GetAccessPoint` permission is required for S3 Files access point validation during agent runtime creation.

### Security groups

Allow outbound TCP on port 2049 from your agent runtime security group to the mount target security group. Allow inbound TCP on port 2049 on the mount target security group from the agent runtime security group.

## Configure file systems

The following sections show how to configure each file system type.

### Configure an Amazon S3 Files access point

To configure an S3 Files access point, specify the access point ARN and mount path in `filesystemConfigurations`. Your agent runtime must use VPC network mode.

###### Example

AWS CLI
    

  1. 
```bash
aws bedrock-agentcore-control create-agent-runtime \
  --agent-runtime-name "data-agent" \
  --role-arn "arn:aws:iam::<account-id>:role/AgentExecutionRole" \
  --network-configuration '{
    "networkMode": "VPC",
    "networkModeConfig": {
      "subnets": ["<subnet-id-1>", "<subnet-id-2>"],
      "securityGroups": ["<security-group-id>"]
    }
  }' \
  --agent-runtime-artifact '{
    "containerConfiguration": {
      "containerUri": "<account-id>.dkr.ecr.<region>.amazonaws.com/my-agent:latest"
    }
  }' \
  --filesystem-configurations '[{
    "s3FilesAccessPoint": {
      "accessPointArn": "arn:aws:s3files:<region>:<account-id>:file-system/<file-system-id>/access-point/<access-point-id>",
      "mountPath": "/mnt/datasets"
    }
  }]'
```
 


AWS SDK
    

  1. Python example using boto3 to create an AgentCore Runtime with an S3 Files access point.

```python
import boto3

client = boto3.client("bedrock-agentcore-control", region_name="us-west-2")

response = client.create_agent_runtime(
    agentRuntimeName="data-agent",
    roleArn="arn:aws:iam::<account-id>:role/AgentExecutionRole",
    networkConfiguration={
        "networkMode": "VPC",
        "networkModeConfig": {
            "subnets": ["<subnet-id-1>", "<subnet-id-2>"],
            "securityGroups": ["<security-group-id>"]
        }
    },
    agentRuntimeArtifact={
        "containerConfiguration": {
            "containerUri": "<account-id>.dkr.ecr.<region>.amazonaws.com/my-agent:latest"
        }
    },
    filesystemConfigurations=[
        {
            "s3FilesAccessPoint": {
                "accessPointArn": "arn:aws:s3files:<region>:<account-id>:file-system/<file-system-id>/access-point/<access-point-id>",
                "mountPath": "/mnt/datasets"
            }
        }
    ]
)
```
### Configure an Amazon EFS access point

To configure an EFS access point, specify the access point ARN and mount path in `filesystemConfigurations`. Your agent runtime must use VPC network mode.

###### Example

AWS CLI
    

  1. 
```bash
aws bedrock-agentcore-control create-agent-runtime \
  --agent-runtime-name "shared-tools-agent" \
  --role-arn "arn:aws:iam::<account-id>:role/AgentExecutionRole" \
  --network-configuration '{
    "networkMode": "VPC",
    "networkModeConfig": {
      "subnets": ["<subnet-id-1>", "<subnet-id-2>"],
      "securityGroups": ["<security-group-id>"]
    }
  }' \
  --agent-runtime-artifact '{
    "containerConfiguration": {
      "containerUri": "<account-id>.dkr.ecr.<region>.amazonaws.com/my-agent:latest"
    }
  }' \
  --filesystem-configurations '[{
    "efsAccessPoint": {
      "accessPointArn": "arn:aws:elasticfilesystem:<region>:<account-id>:access-point/<access-point-id>",
      "mountPath": "/mnt/tools"
    }
  }]'
```
 


AWS SDK
    

  1. Python example using boto3 to create an AgentCore Runtime with an EFS access point.

```python
import boto3

client = boto3.client("bedrock-agentcore-control", region_name="us-west-2")

response = client.create_agent_runtime(
    agentRuntimeName="shared-tools-agent",
    roleArn="arn:aws:iam::<account-id>:role/AgentExecutionRole",
    networkConfiguration={
        "networkMode": "VPC",
        "networkModeConfig": {
            "subnets": ["<subnet-id-1>", "<subnet-id-2>"],
            "securityGroups": ["<security-group-id>"]
        }
    },
    agentRuntimeArtifact={
        "containerConfiguration": {
            "containerUri": "<account-id>.dkr.ecr.<region>.amazonaws.com/my-agent:latest"
        }
    },
    filesystemConfigurations=[
        {
            "efsAccessPoint": {
                "accessPointArn": "arn:aws:elasticfilesystem:<region>:<account-id>:access-point/<access-point-id>",
                "mountPath": "/mnt/tools"
            }
        }
    ]
)
```
### Configure managed session storage

Add `filesystemConfigurations` with a `sessionStorage` entry when creating or updating an agent runtime.

###### Example

AWS CLI
    

  1. 
```bash
aws bedrock-agentcore-control create-agent-runtime \
  --agent-runtime-name "coding-agent" \
  --role-arn "arn:aws:iam::111122223333:role/AgentExecutionRole" \
  --agent-runtime-artifact '{
    "containerConfiguration": {
      "containerUri": "123456789012.dkr.ecr.us-west-2.amazonaws.com/my-agent:latest"
    }
  }' \
  --filesystem-configurations '[{
    "sessionStorage": {
      "mountPath": "/mnt/workspace"
    }
  }]'
```
 


AWS SDK
    

  1. Python example using boto3 to create an AgentCore Runtime with session storage.

```python
import boto3

client = boto3.client("bedrock-agentcore-control", region_name="us-west-2")

response = client.create_agent_runtime(
    agentRuntimeName="coding-agent",
    roleArn="arn:aws:iam::111122223333:role/AgentExecutionRole",
    agentRuntimeArtifact={
        "containerConfiguration": {
            "containerUri": "123456789012.dkr.ecr.us-west-2.amazonaws.com/my-agent:latest"
        }
    },
    filesystemConfigurations=[
        {
            "sessionStorage": {
                "mountPath": "/mnt/workspace"
            }
        }
    ]
)
```
You can also add session storage to an existing agent runtime using [UpdateAgentRuntime](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_UpdateAgentRuntime.html>) with the same `filesystemConfigurations` parameter.

### Combine file systems

You can combine managed session storage with bring-your-own file systems on a single agent runtime. The following example configures all three types.

```python
import boto3

client = boto3.client("bedrock-agentcore-control", region_name="us-west-2")

response = client.create_agent_runtime(
    agentRuntimeName="full-stack-agent",
    roleArn="arn:aws:iam::<account-id>:role/AgentExecutionRole",
    networkConfiguration={
        "networkMode": "VPC",
        "networkModeConfig": {
            "subnets": ["<subnet-id-1>", "<subnet-id-2>"],
            "securityGroups": ["<security-group-id>"]
        }
    },
    agentRuntimeArtifact={
        "containerConfiguration": {
            "containerUri": "<account-id>.dkr.ecr.<region>.amazonaws.com/my-agent:latest"
        }
    },
    filesystemConfigurations=[
        {
            "s3FilesAccessPoint": {
                "accessPointArn": "arn:aws:s3files:<region>:<account-id>:file-system/<file-system-id>/access-point/<access-point-id>",
                "mountPath": "/mnt/datasets"
            }
        },
        {
            "efsAccessPoint": {
                "accessPointArn": "arn:aws:elasticfilesystem:<region>:<account-id>:access-point/<access-point-id>",
                "mountPath": "/mnt/tools"
            }
        },
        {
            "sessionStorage": {
                "mountPath": "/mnt/workspace"
            }
        }
    ]
)
```
## Invoke and use persistent storage

All configured file systems are available at their mount paths when your agent is invoked. Bring-your-own file systems (S3 Files, EFS) are accessible immediately on every invocation. Managed session storage persists data across stop/resume cycles using the same `runtimeSessionId`.

**Example: Using session storage across stop/resume cycles**

```bash
# First invocation — agent sets up the project
aws bedrock-agentcore invoke-agent-runtime \
  --agent-runtime-arn "arn:aws:bedrock-agentcore:us-west-2:111122223333:agent-runtime/coding-agent" \
  --runtime-session-id "session-001" \
  --payload '{"prompt": "Set up the project and install dependencies in /mnt/workspace"}'

# Stop the session
aws bedrock-agentcore stop-runtime-session \
  --agent-runtime-arn "arn:aws:bedrock-agentcore:us-west-2:111122223333:agent-runtime/coding-agent" \
  --runtime-session-id "session-001"

# Resume later — the project is exactly where the agent left it
aws bedrock-agentcore invoke-agent-runtime \
  --agent-runtime-arn "arn:aws:bedrock-agentcore:us-west-2:111122223333:agent-runtime/coding-agent" \
  --runtime-session-id "session-001" \
  --payload '{"prompt": "Run the tests and fix any failures"}'
```
The agent sees `/mnt/workspace` exactly as it left it – source files, installed packages, build artifacts, and .git history are all intact. When you resume a session, the new compute environment mounts the persisted storage. Your agent can continue working without reinstalling packages or regenerating files.

###### Note

When explicitly calling `StopRuntimeSession` always wait for it to complete before resuming the session. This ensures all data is flushed to durable storage.

###### Note

The mounted path is available only at the time of agent invocation, not during initialization.

## Limits

The following table lists the limits for file system configurations.

Resource | Limit  
---|---  
Total file system configurations per agent runtime |  5  
Maximum S3 Files access point configurations |  2  
Maximum EFS access point configurations |  2  
Maximum managed session storage configurations |  1  
  
### Mount path constraints

All file system configurations must follow these mount path rules:

  * Must be under `/mnt/` with exactly one subdirectory level (for example, `/mnt/data`, `/mnt/workspace`).

  * Pattern: `/mnt/[a-zA-Z0-9._-]+/?`

  * Length: 6–200 characters.

  * Each mount path must be unique across all configurations.

  * Mount paths cannot be subdirectories of each other.


## Lifecycle behavior

The following table compares lifecycle behavior between managed session storage and bring-your-own file systems.

Behavior | Managed session storage (Preview) | Bring-your-own (S3 Files, EFS)  
---|---|---  
Idle expiry |  14 days without invocation – data reset |  None – customer-managed  
On runtime version update |  Data wiped – fresh file system on next invoke |  No effect – data persists  
On DeleteAgentRuntime |  All session data deleted |  File system unmounted; data preserved in your account  
Concurrent access |  Isolated per session |  Shared across sessions and agents  
Ownership |  Service-managed by AgentCore |  Customer-managed in your AWS account  
  
###### Important

For bring-your-own file systems, ensure your agent handles concurrent access appropriately. Use file-per-session naming patterns or advisory file locks to avoid conflicts.

## Use cases

The following table lists common patterns and the recommended file system configuration for each.

Pattern | Recommended configuration  
---|---  
Coding agent with persistent project files |  Managed session storage (Preview) at `/mnt/workspace`  
Reference datasets accessible from both agents and S3 pipelines |  S3 Files access point at `/mnt/datasets`  
Shared tool libraries across all agents |  S3 Files or EFS access point at `/mnt/tools`  
Multi-agent collaboration on shared workspace |  S3 Files or EFS access point at `/mnt/shared`  
Long-running analysis with checkpoints |  Session storage for checkpoints + S3 Files for input data  
Full-stack agent (both categories combined) |  Session storage + S3 Files + EFS (3 mounts)  
  
## Example: Coding agent with persistent workspace

This example shows a coding agent using Strands Agents with `FileSessionManager` for conversation history and session storage for project files. Both persist across stop/resume cycles.

**Coding agent with session storage**

```python
import os

# Enable non-interactive mode for strands tools
os.environ["BYPASS_TOOL_CONSENT"] = "true"

from strands import Agent
from strands.session import FileSessionManager
from strands.models import BedrockModel
from strands_tools import file_read, file_write, shell
from bedrock_agentcore.runtime import BedrockAgentCoreApp

app = BedrockAgentCoreApp()
WORKSPACE = "/mnt/workspace"

model = BedrockModel(model_id="us.anthropic.claude-sonnet-4-20250514-v1:0")
tools = [file_read, file_write, shell]

@app.entrypoint
def handle_request(payload):
    session_id = payload.get("session_id", "default")

    # Persist conversation history alongside project files
    session_manager = FileSessionManager(
        session_id=session_id,
        storage_dir=f"{WORKSPACE}/.sessions"
    )

    agent = Agent(
        model=model,
        tools=tools,
        session_manager=session_manager,
        system_prompt="You are a coding assistant. Project files are in /mnt/workspace."
    )

    response = agent(str(payload.get("prompt", "")))
    return {"response": response.message["content"][0]["text"]}

if __name__ == "__main__":
    app.run()
```
**requirements.txt**

```text
strands-agents
strands-agents-tools
bedrock-agentcore
boto3
```
Invoke the agent, stop the session, then resume. Both project files and conversation context persist.

**Invoke, stop, and resume cycle**

```python
import boto3, json

client = boto3.client("bedrock-agentcore")
agent_arn = "arn:aws:bedrock-agentcore:us-west-2:111122223333:agent-runtime/coding-agent"
session_id = "project-xyz-001"

def invoke(prompt):
    resp = client.invoke_agent_runtime(
        agentRuntimeArn=agent_arn,
        runtimeSessionId=session_id,
        payload=json.dumps({"prompt": prompt, "session_id": "conv-001"}).encode()
    )
    return json.loads(b"".join(resp["response"]))["response"]

# First invoke: Create a simple script
invoke("Write a Python script called calculator.py with add and subtract functions.")

# Stop session — compute terminates, storage persists
client.stop_runtime_session(agentRuntimeArn=agent_arn, runtimeSessionId=session_id)

# Resume same session — new compute, but files and conversation history restored
invoke("Add a multiply function to the script you created.")
# Agent knows it created calculator.py (conversation history)
# AND finds existing file (file persistence)
```
The `FileSessionManager` stores conversation history to `/mnt/workspace/.sessions/`, enabling the agent to remember context across stop/resume cycles.

## Networking requirements

This section covers networking requirements for both managed session storage and bring-your-own file systems.

### Managed session storage networking

If your agent runtime uses VPC mode with session storage, the agent needs network access to sync with remote storage. Session data is stored in AgentCore S3, so your VPC must allow outbound connectivity to S3. If you are using an S3 Gateway endpoint with a custom policy, you can scope access to your regional session storage bucket as follows:

```text
"Action": [
    "s3:GetObject",
    "s3:PutObject",
    "s3:ListBucket"
],
"Resource": [
    "arn:aws:s3:::acr-storage-*-region-an",
    "arn:aws:s3:::acr-storage-*-region-an/*"
],
"Condition": {
    "StringEquals": {
        "aws:PrincipalServiceName": "bedrock-agentcore.amazonaws.com"
    }
}
```
Replace `region` with your AWS Region (for example, `us-west-2`).

### Bring-your-own file system networking

Bring-your-own file systems require your VPC networking to meet the following requirements for successful mounts.

#### Amazon EFS

  * **Mount targets** – Your EFS file system must have mount targets in at least one of the Availability Zones where your agent runtime subnets are located. Mount targets in all configured subnet Availability Zones is recommended for high availability.

  * **One VPC at a time** – EFS file systems can have mount targets in only one VPC at a time. Cross-account VPC mounting is not supported for AgentCore.

  * **Availability Zone alignment** – Agent runtime subnets and EFS mount targets must share at least one common Availability Zone. Cross-AZ NFS traffic works but adds latency and data transfer costs.

  * **DNS resolution** – Your VPC must have DNS hostnames and DNS resolution enabled. The agent resolves the mount target hostname `<az-id>.<file-system-id>.efs.<region>.amazonaws.com` at mount time.


To check your EFS mount targets:

```bash
aws efs describe-mount-targets --file-system-id fs-0123456789abcdef0 --region us-west-2
```
For complete information on EFS mount targets, see [How Amazon EFS works](<https://docs.aws.amazon.com/efs/latest/ug/how-it-works.html>).

#### Amazon S3 Files

  * **Mount targets** – Your S3 Files file system must have mount targets in the same VPC as the agent runtime. Mount targets must be in at least one of the same Availability Zones as your agent runtime subnets.

  * **One mount target per AZ** – Each Availability Zone can have at most one S3 Files mount target.

  * **Same VPC** – S3 Files mount targets must be in the same VPC as the agent runtime. Cross-VPC file system access is not supported.

  * **DNS resolution** – Your VPC must resolve the S3 Files mount target hostname `<az-id>.<file-system-id>.s3files.<region>.on.aws` at mount time. Ensure DNS resolution is enabled in your VPC settings.


To check your S3 Files mount targets:

```bash
aws s3files list-mount-targets --file-system-id fs-0123456789abcdef0 --region us-west-2
```
For complete information on S3 Files mounting, see [Mounting S3 file systems](<https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-files-mounting.html>).

#### Shared requirements

Requirement | EFS | S3 Files  
---|---|---  
VPC mode required |  ✓ |  ✓  
NFS port 2049 (TCP) |  ✓ |  ✓  
Mount targets in same AZ |  ✓ (recommended) |  ✓ (required)  
Same VPC |  ✓ |  ✓  
Same AWS account |  ✓ |  ✓  
DNS resolution enabled |  ✓ |  ✓  
Cross-account VPC |  ✗ Not supported |  ✗ Not supported  
  
###### Important

Cross-account VPC configurations are not supported. The file system resources (file system, access points, mount targets) and the agent runtime must be in the same AWS account and VPC.

#### How AgentCore mounts file systems

AgentCore handles the NFS mount operation inside the microVM automatically:

  * **EFS** – Mounted via NFSv4.1 over TLS (port 2049). IAM authentication is used when the execution role has `elasticfilesystem:ClientMount` permission with an `AccessPointArn` condition.

  * **S3 Files** – Mounted via NFSv4.2 over TLS with mandatory IAM authentication. TLS and IAM are always enabled and cannot be disabled for S3 Files.


You do not need to install `amazon-efs-utils`, configure `/etc/fstab`, or manage TLS certificates. The microVM runtime handles all mount operations, credential rotation, and health monitoring.

#### Subnet and Availability Zone selection

When you configure both VPC subnets and file system configurations on an agent runtime, select subnets that overlap with your file system mount target Availability Zones.

To identify the Availability Zone ID of your subnets:

```bash
aws ec2 describe-subnets \
  --subnet-ids subnet-0123456789abcdef0 \
  --query 'Subnets[0].AvailabilityZoneId'
```
To identify the Availability Zone of your EFS mount targets:

```bash
aws efs describe-mount-targets \
  --file-system-id fs-0123456789abcdef0 \
  --query 'MountTargets[*].[AvailabilityZoneId, LifeCycleState]' \
  --output table
```
Ensure your agent runtime subnets are in Availability Zones where your file system has mount targets.

For supported Availability Zones by region, see the [Supported Availability Zones](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./agentcore-vpc.html#agentcore-supported-azs>) in the VPC configuration topic. For security group configuration, see [Example: Connecting to Amazon EFS or Amazon S3 Files](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./agentcore-vpc.html#agentcore-security-groups-filesystem>).

## Troubleshoot bring-your-own file system mounts

When a bring-your-own file system mount fails, `InvokeAgentRuntime` returns HTTP 424 (Failed Dependency).

Symptom | Likely cause | Quick fix  
---|---|---  
"Access denied" |  Execution role missing `ClientMount` or `ClientWrite` |  Add IAM permissions with `AccessPointArn` condition  
"ResourceNotFound" or "Failed to resolve" |  Access point or mount target deleted or unavailable |  Verify ARN exists and mount targets are Available  
Mount hangs then fails (~30s) |  Security group blocking port 2049 or no mount target in agent’s Availability Zone |  Allow TCP 2049; verify Availability Zone overlap  
"Permission denied" on writes |  Missing `ClientWrite` or POSIX UID/GID mismatch |  Add write permission or align access point POSIX user  
  
Each mount has a 30-second timeout. All configured file systems mount in parallel – a single failure causes the entire invocation to fail.

For more information, see [Troubleshoot BYO storage](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-troubleshooting.html#troubleshoot-byo-storage-access-denied>).

