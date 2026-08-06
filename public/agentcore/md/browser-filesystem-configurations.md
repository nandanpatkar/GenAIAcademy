# File system configurations for AgentCore Browser - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-filesystem-configurations.html

---

# File system configurations for AgentCore Browser

AgentCore Browser supports mounting your own file systems into browser sessions through the `filesystemConfigurations` parameter. Each configuration mounts an Amazon S3 Files or Amazon EFS access point at a path you specify. You don’t need custom mount code, privileged containers, or download orchestration — AgentCore performs all mount operations inside the session sandbox.

Bring-your-own file systems are shared storage: multiple sessions, multiple browsers, or external applications can access the same access point simultaneously. The data is persisted and managed in your own AWS account.

You can provide `filesystemConfigurations` when you create a browser with [CreateBrowser](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateBrowser.html>) (every session started from that browser inherits the mounts), or when you start a session with [StartBrowserSession](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_StartBrowserSession.html>) (the mounts apply to that session). The parameter and shape are identical in both places.

###### Note

Unlike AgentCore Runtime, AgentCore Browser does not offer a managed session-storage option. Browser supports bring-your-own Amazon S3 Files and Amazon EFS access points only.

## Storage options at a glance

The following table compares the available file system types.

Type | Isolation | Persistence | VPC required | Best for  
---|---|---|---|---  
Amazon S3 Files |  Shared – multiple sessions and browsers access the same data |  Customer-managed (permanent, syncs to the backing S3 bucket) |  Yes |  Datasets and artifacts accessible through both standard file operations and S3 APIs  
Amazon EFS |  Shared – multiple sessions and browsers access the same data |  Customer-managed (permanent until you delete it) |  Yes |  Shared reference data, downloads, read-write collaboration across sessions  
  
## Quick start

The following checklists provide condensed steps for configuring each file system type.

### Amazon S3 Files access point

  1. Add `s3files:ClientMount`, `s3files:ClientWrite`, and `s3files:GetAccessPoint` to your browser execution role with an `s3files:AccessPointArn` condition.

  2. Allow TCP port 2049 outbound from your browser security group to your S3 Files mount target security group.

  3. Confirm the S3 Files mount target is in the same VPC and Availability Zone as your browser subnets.

  4. Add `filesystemConfigurations` with an `s3FilesConfiguration` entry to your `CreateBrowser` or `StartBrowserSession` call.

  5. Start a session. Files at your mount path (for example, `/mnt/s3data`) sync bidirectionally with the backing S3 bucket.


### Amazon EFS access point

  1. Add `elasticfilesystem:ClientMount` and `elasticfilesystem:ClientWrite` to your browser execution role with an `elasticfilesystem:AccessPointArn` condition.

  2. Allow TCP port 2049 outbound from your browser security group to your EFS mount target security group.

  3. Confirm the EFS mount target is in the same Availability Zone as at least one of your browser subnets.

  4. Add `filesystemConfigurations` with an `efsConfiguration` entry to your `CreateBrowser` or `StartBrowserSession` call.

  5. Start a session. Your files are available at your mount path (for example, `/mnt/efs`).


Both S3 Files and EFS require VPC connectivity on the browser.

## How it works

When you configure a bring-your-own file system, AgentCore Browser mounts the specified access point into the session sandbox at the path you configure. Data is shared – multiple sessions, multiple browsers, or external applications can access the same file system simultaneously.

AgentCore handles all mount operations automatically. You don’t need to install mount helpers, manage TLS certificates, or write mount code.

###### Note

When you create an access point (S3 Files or EFS), you specify a POSIX user ID (UID) and group ID (GID). All file operations through the access point run as this identity.

### Amazon S3 Files mount flow

  1. You create an S3 Files file system (backed by an S3 bucket) and mount targets in your VPC.

  2. You create an S3 Files access point specifying the POSIX UID/GID and root directory.

  3. You configure the browser (or session) with the access point ARN, file system ARN, and mount path.

  4. On session start, AgentCore provisions a sandbox with network access to your VPC.

  5. The sandbox mounts the file system through NFSv4.2 over TLS with IAM authentication (port 2049) via your VPC.

  6. Your agent reads and writes files at the mount path. Changes automatically sync to the backing S3 bucket.


### Amazon EFS mount flow

  1. You create an EFS file system and mount targets in your VPC (one per Availability Zone).

  2. You create an EFS access point specifying the POSIX UID/GID and root directory.

  3. You configure the browser (or session) with the access point ARN, file system ARN, and mount path.

  4. On session start, AgentCore provisions a sandbox with network access to your VPC.

  5. The sandbox mounts the file system through NFSv4.1 over TLS (port 2049) via the mount target in the same Availability Zone.

  6. Your agent reads and writes files at the mount path using standard file operations.


## Prerequisites

Before you configure a bring-your-own file system, complete the following prerequisites.

### VPC configuration

Your browser must use `VPC` network mode. The subnets you specify must overlap with the file system mount target Availability Zones.

### IAM permissions

Your browser execution role must include permissions to mount the file system.

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
Omit `ClientWrite` if your agent only needs read access.

### Security groups

Allow outbound TCP on port 2049 from your browser security group to the mount target security group. Allow inbound TCP on port 2049 on the mount target security group from the browser security group.

## Configure file systems

Specify each file system in `filesystemConfigurations` as either an `s3FilesConfiguration` or an `efsConfiguration`. Both require three fields:

  * `accessPointArn` – The ARN of the S3 Files or EFS access point to mount.

  * `fileSystemArn` – The ARN of the file system that owns the access point. This field is **required**.

  * `mountPath` – The absolute path within the session at which the access point is mounted (for example, `/mnt/s3data`).


You can supply `filesystemConfigurations` in two places, using the same shape:

  * **Control plane –`CreateBrowser` ** – The mounts are inherited by every session started from the browser. The browser must use VPC network mode.

  * **Data plane –`StartBrowserSession` ** – The mounts apply to that specific session.


###### Note

You can supply file system configurations at the control plane (`CreateBrowser`), the data plane (`StartBrowserSession`), or both — as long as the browser uses VPC network mode and the S3 Files or EFS access point is configured correctly (mount targets, IAM permissions, and security groups). Configurations from `CreateBrowser` are inherited by every session; configurations from `StartBrowserSession` apply to that session. When both are supplied, they are combined for the session, and each mount path must be unique across the combined set.

The following sections show both API calls for each file system type.

### Configure an Amazon S3 Files access point

**Control plane:`CreateBrowser` **

###### Example

AWS CLI
    

  1. 
```bash
aws bedrock-agentcore-control create-browser \
  --name "data-browser" \
  --execution-role-arn "arn:aws:iam::<account-id>:role/BrowserExecutionRole" \
  --network-configuration '{
    "networkMode": "VPC",
    "vpcConfig": {
      "subnets": ["<subnet-id-1>", "<subnet-id-2>"],
      "securityGroups": ["<security-group-id>"]
    }
  }' \
  --filesystem-configurations '[{
    "s3FilesConfiguration": {
      "accessPointArn": "arn:aws:s3files:<region>:<account-id>:file-system/<file-system-id>/access-point/<access-point-id>",
      "fileSystemArn": "arn:aws:s3files:<region>:<account-id>:file-system/<file-system-id>",
      "mountPath": "/mnt/s3data"
    }
  }]'
```
 


AWS SDK
    

  1. Python example using boto3 to create a browser with an S3 Files access point.

```python
import boto3

cp = boto3.client("bedrock-agentcore-control", region_name="us-west-2")

response = cp.create_browser(
    name="data-browser",
    executionRoleArn="arn:aws:iam::<account-id>:role/BrowserExecutionRole",
    networkConfiguration={
        "networkMode": "VPC",
        "vpcConfig": {
            "subnets": ["<subnet-id-1>", "<subnet-id-2>"],
            "securityGroups": ["<security-group-id>"]
        }
    },
    filesystemConfigurations=[
        {
            "s3FilesConfiguration": {
                "accessPointArn": "arn:aws:s3files:<region>:<account-id>:file-system/<file-system-id>/access-point/<access-point-id>",
                "fileSystemArn": "arn:aws:s3files:<region>:<account-id>:file-system/<file-system-id>",
                "mountPath": "/mnt/s3data"
            }
        }
    ]
)
```
**Data plane:`StartBrowserSession` **

###### Example

AWS CLI
    

  1. 
```bash
aws bedrock-agentcore start-browser-session \
  --browser-identifier "<browser-id>" \
  --name "byos-session" \
  --session-timeout-seconds 3600 \
  --filesystem-configurations '[{
    "s3FilesConfiguration": {
      "accessPointArn": "arn:aws:s3files:<region>:<account-id>:file-system/<file-system-id>/access-point/<access-point-id>",
      "fileSystemArn": "arn:aws:s3files:<region>:<account-id>:file-system/<file-system-id>",
      "mountPath": "/mnt/s3data"
    }
  }]'
```
 


AWS SDK
    

  1. Python example using boto3 to start a browser session with an S3 Files access point.

```python
import boto3

dp = boto3.client("bedrock-agentcore", region_name="us-west-2")

response = dp.start_browser_session(
    browserIdentifier="<browser-id>",
    name="byos-session",
    sessionTimeoutSeconds=3600,
    filesystemConfigurations=[
        {
            "s3FilesConfiguration": {
                "accessPointArn": "arn:aws:s3files:<region>:<account-id>:file-system/<file-system-id>/access-point/<access-point-id>",
                "fileSystemArn": "arn:aws:s3files:<region>:<account-id>:file-system/<file-system-id>",
                "mountPath": "/mnt/s3data"
            }
        }
    ]
)

session_id = response["sessionId"]
```
### Configure an Amazon EFS access point

**Control plane:`CreateBrowser` **

###### Example

AWS CLI
    

  1. 
```bash
aws bedrock-agentcore-control create-browser \
  --name "shared-tools-browser" \
  --execution-role-arn "arn:aws:iam::<account-id>:role/BrowserExecutionRole" \
  --network-configuration '{
    "networkMode": "VPC",
    "vpcConfig": {
      "subnets": ["<subnet-id-1>", "<subnet-id-2>"],
      "securityGroups": ["<security-group-id>"]
    }
  }' \
  --filesystem-configurations '[{
    "efsConfiguration": {
      "accessPointArn": "arn:aws:elasticfilesystem:<region>:<account-id>:access-point/<access-point-id>",
      "fileSystemArn": "arn:aws:elasticfilesystem:<region>:<account-id>:file-system/<file-system-id>",
      "mountPath": "/mnt/efs"
    }
  }]'
```
 


AWS SDK
    

  1. Python example using boto3 to create a browser with an EFS access point.

```python
import boto3

cp = boto3.client("bedrock-agentcore-control", region_name="us-west-2")

response = cp.create_browser(
    name="shared-tools-browser",
    executionRoleArn="arn:aws:iam::<account-id>:role/BrowserExecutionRole",
    networkConfiguration={
        "networkMode": "VPC",
        "vpcConfig": {
            "subnets": ["<subnet-id-1>", "<subnet-id-2>"],
            "securityGroups": ["<security-group-id>"]
        }
    },
    filesystemConfigurations=[
        {
            "efsConfiguration": {
                "accessPointArn": "arn:aws:elasticfilesystem:<region>:<account-id>:access-point/<access-point-id>",
                "fileSystemArn": "arn:aws:elasticfilesystem:<region>:<account-id>:file-system/<file-system-id>",
                "mountPath": "/mnt/efs"
            }
        }
    ]
)
```
**Data plane:`StartBrowserSession` **

###### Example

AWS CLI
    

  1. 
```bash
aws bedrock-agentcore start-browser-session \
  --browser-identifier "<browser-id>" \
  --name "byos-session" \
  --session-timeout-seconds 3600 \
  --filesystem-configurations '[{
    "efsConfiguration": {
      "accessPointArn": "arn:aws:elasticfilesystem:<region>:<account-id>:access-point/<access-point-id>",
      "fileSystemArn": "arn:aws:elasticfilesystem:<region>:<account-id>:file-system/<file-system-id>",
      "mountPath": "/mnt/efs"
    }
  }]'
```
 


AWS SDK
    

  1. Python example using boto3 to start a browser session with an EFS access point.

```python
import boto3

dp = boto3.client("bedrock-agentcore", region_name="us-west-2")

response = dp.start_browser_session(
    browserIdentifier="<browser-id>",
    name="byos-session",
    sessionTimeoutSeconds=3600,
    filesystemConfigurations=[
        {
            "efsConfiguration": {
                "accessPointArn": "arn:aws:elasticfilesystem:<region>:<account-id>:access-point/<access-point-id>",
                "fileSystemArn": "arn:aws:elasticfilesystem:<region>:<account-id>:file-system/<file-system-id>",
                "mountPath": "/mnt/efs"
            }
        }
    ]
)

session_id = response["sessionId"]
```
### Combine file systems

You can attach multiple access points (up to the limits below) in a single call by adding more entries to `filesystemConfigurations`. Each entry must use a unique mount path.

```text
filesystemConfigurations=[
    {
        "s3FilesConfiguration": {
            "accessPointArn": "arn:aws:s3files:<region>:<account-id>:file-system/<file-system-id>/access-point/<access-point-id>",
            "fileSystemArn": "arn:aws:s3files:<region>:<account-id>:file-system/<file-system-id>",
            "mountPath": "/mnt/s3data"
        }
    },
    {
        "efsConfiguration": {
            "accessPointArn": "arn:aws:elasticfilesystem:<region>:<account-id>:access-point/<access-point-id>",
            "fileSystemArn": "arn:aws:elasticfilesystem:<region>:<account-id>:file-system/<file-system-id>",
            "mountPath": "/mnt/efs"
        }
    }
]
```
### Confirm the mounted file systems

Use [GetBrowser](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_GetBrowser.html>) to confirm the `filesystemConfigurations` on a browser, and [GetBrowserSession](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_GetBrowserSession.html>) to confirm the effective configurations on a running session. Configurations set at browser creation and at session start both appear in the session response.

## Limits

File system configuration limits are enforced per request. `CreateBrowser` configurations are inherited by every session, and `StartBrowserSession` configurations apply to that session. A session’s effective mounts are the combination of both.

Configuration type | Per CreateBrowser | Per StartBrowserSession | Combined per session  
---|---|---|---  
Amazon S3 Files access points |  2 |  2 |  4  
Amazon EFS access points |  2 |  2 |  4  
Total file system configurations |  4 |  4 |  8  
  
For example, you can configure 1 S3 Files access point and 1 EFS access point on `CreateBrowser`, then add 1 S3 Files access point and 1 EFS access point on `StartBrowserSession`, for 4 mounts total in the session. Each mount path must be unique across the combined set.

### Mount path constraints

All file system configurations must follow these mount path rules:

  * Must be under `/mnt/` with exactly one subdirectory level (for example, `/mnt/data`, `/mnt/s3data`).

  * Pattern: `/mnt/[a-zA-Z0-9._-]+/?`

  * Each mount path must be unique across all configurations.

  * Mount paths cannot be subdirectories of each other.


## Troubleshoot file system mounts

When a bring-your-own file system mount fails, `StartBrowserSession` returns an error and the session does not become `READY`.

Symptom | Likely cause | Quick fix  
---|---|---  
"Access denied" |  Execution role missing `ClientMount` or `ClientWrite` |  Add IAM permissions with the `AccessPointArn` condition  
"ResourceNotFound" or "Failed to resolve" |  Access point or mount target deleted or unavailable |  Verify the ARN exists and mount targets are Available  
Mount hangs then fails |  Security group blocking port 2049, or no mount target in the session’s Availability Zone |  Allow TCP 2049; verify Availability Zone overlap  
"Permission denied" on writes |  Missing `ClientWrite` or POSIX UID/GID mismatch |  Add write permission or align the access point POSIX user  
  
All configured file systems mount in parallel at session start – a single mount failure causes the session start to fail.

