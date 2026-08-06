# AWS Bedrock AgentCore - Managed Session Storage via a Filesystem Configuration

This notebook demonstrates how to:
1. Create and deploy a Bedrock AgentCore agent w/ filesystem configuration
2. Invoke the agent with standard prompts to generate session related info into filesystem
3. Execute system commands directly in the agent runtime using [`invoke_agent_runtime_command`](https://docs.aws.amazon.com/boto3/latest/reference/services/bedrock-agentcore/client/invoke_agent_runtime_command.html) to check those info from filesystem
4. Execute command again from other session to show session isolation.

### Tutorial Details

| Information         | Details                                                   |
|:--------------------|:----------------------------------------------------------|
| Tutorial type       | Managed Session storage on Runtime                        |
| Tool type           | HTTP server                                               |
| Tutorial components | Hosting on AgentCore Runtime                              |
| Tutorial vertical   | Cross-vertical                                            |
| Example complexity  | Medium                                                    |
| SDK used            | Amazon BedrockAgentCore Python SDK and boto3              |


### Tutorial Architecture
In this tutorial notebook, you are going to build one agent. First you will deploy the agent on AgentCore Runtime with claude skill from `persistent-notes` folder. Then you will invoke it to generate local notes and check local files. Finally you will see session isolation in action.

So let's get started!

## Step 1: Install Dependencies

First, we install the required Python packages including boto3 and the Bedrock AgentCore SDK.

```python
!uv pip install -qU -r requirements.txt
```

```python
!uv pip freeze | grep boto3
```

**Restart your kernel before continue.**

## Step 2: Create IAM Execution Role

Create an IAM role with the necessary permissions for AgentCore Runtime:
- ECR access to pull container images
- CloudWatch Logs for logging
- Bedrock model invocation

```python
# Create IAM ROLE
from helpers.utils import create_agentcore_runtime_execution_role, SAMPLE_ROLE_NAME

execution_role_arn = create_agentcore_runtime_execution_role(SAMPLE_ROLE_NAME)
execution_role_arn
```

---

## Step 3: Deployment

We're using Docker deployment for better dependency management and consistency.

### Make deployment (Build Docker and Push to ECR)

Now, let's build a docker image and push it to ECR, but firstly, let's check if repo exists, otherwise create it.

#### Setup AWS Clients

Initialize boto3 clients and get AWS account information needed for ECR operations.

```python
import json
import boto3
import subprocess
import base64
from boto3.session import Session

boto_session = Session()
sts = boto3.client("sts")

account_id = sts.get_caller_identity()["Account"]
region = boto_session.region_name
region
```

```python
repo_name = "managed-session-agent-demo"
ecr = boto3.client("ecr", region_name=region)

try:
    response = ecr.create_repository(repositoryName=repo_name)
    repo_uri = response["repository"]["repositoryUri"]
    repo_arn = response["repository"]["repositoryArn"]
    print(f"✅ Created repository: {repo_uri}")
except ecr.exceptions.RepositoryAlreadyExistsException:
    print("ℹ️ Repository already exists")
    response = ecr.describe_repositories(repositoryNames=[repo_name])
    repo_uri = response["repositories"][0]["repositoryUri"]
    repo_arn = response["repositories"][0]["repositoryArn"]

print(f"Repository URI: {repo_uri}")
print(f"Repository ARN: {repo_arn}")
```

#### ECR Authentication

Get authorization token from ECR and login to Docker. This allows us to push images to our private ECR repository.

```python
auth = ecr.get_authorization_token()
token = base64.b64decode(auth["authorizationData"][0]["authorizationToken"]).decode().split(":")[1]
subprocess.run(
    f"echo {token} | docker login --username AWS --password-stdin {account_id}.dkr.ecr.{region}.amazonaws.com",
    shell=True,
)
```

#### Build Docker Image

Build the Docker image locally using the Dockerfile in the current directory. This packages our agent code and dependencies.

```python
docker_build = subprocess.run(["docker", "build", "-t", f"{repo_name}:latest", "."])
```

#### Tag Docker Image

Tag the local image with the ECR repository URI so it can be pushed to ECR.

```python
subprocess.run(["docker", "tag", f"{repo_name}:latest", f"{repo_uri}:latest"])
```

#### Push to ECR

Push the tagged image to ECR. This makes it available for AgentCore Runtime to pull and deploy.

Docker push

```python
subprocess.run(["docker", "push", f"{repo_uri}:latest"])

print(f"✅ Pushed to: {repo_uri}:latest")
```

---

## Step 4: Create AgentCore Runtime

Now we create the agent runtime with:
- Container configuration pointing to our ECR image
- IAM role for permissions
- **Filesystem configuration** with `sessionStorage` mounted at `/mnt/workspace`

This filesystem configuration enables session isolation - each session gets its own isolated storage.

### Create agent

Let's create our agent supporting new managed session storage feature

```python
acc_runtime = boto3.client(
    "bedrock-agentcore-control",
    region_name=region,
)

ac_name = "managed_session_agent_demo"
```

```python
response = acc_runtime.create_agent_runtime(
    agentRuntimeName=ac_name,
    agentRuntimeArtifact={"containerConfiguration": {"containerUri": f"{repo_uri}:latest"}},
    roleArn=execution_role_arn,
    protocolConfiguration={"serverProtocol": "HTTP"},
    networkConfiguration={"networkMode": "PUBLIC"},
    filesystemConfigurations=[{"sessionStorage": {"mountPath": "/mnt/workspace"}}],
)
```

Uncomment following cell if you want to update your Runtime, if it's already created.

```python
# response = acc_runtime.update_agent_runtime(
#     agentRuntimeId=agent_id,
#     agentRuntimeArtifact={
#         'containerConfiguration': {
#             'containerUri': f'{repo_uri}:latest'
#         }
#     },
#     roleArn=execution_role_arn,
#     protocolConfiguration={
#         'serverProtocol': 'HTTP'
#     },
#     networkConfiguration={
#         'networkMode': 'PUBLIC'
#     },
#     filesystemConfigurations=[{
#         'sessionStorage':{
#             "mountPath": "/mnt/workspace"
#         }
#     }]
# )
```

```python
agent_arn = response["agentRuntimeArn"]
agent_id = response["agentRuntimeId"]
agent_arn, agent_id
```

#### Verify Agent Status

Check that the agent runtime was created successfully and is in READY state.

```python
response = acc_runtime.get_agent_runtime(agentRuntimeId=agent_id)
response["status"]
```

### Testing our agent

Firstly, let's create an AgentCore client to invoke the agent.

```python
agentcore_client = boto3.client(
    "bedrock-agentcore",
    region_name=region,
)
```

#### First Agent Invocation

Invoke the agent to save a reminder. The agent will:
1. Use the `persistent-notes` skill
2. Save the note to `/mnt/workspace/notes.json`
3. Return a `runtimeSessionId` that identifies this session

```python
response = agentcore_client.invoke_agent_runtime(
    agentRuntimeArn=agent_arn,
    qualifier="DEFAULT",
    payload=json.dumps({"prompt": "save a reminder for tmr 9am to call my brother."}),
)

# Stream the command output
for event in response["response"].iter_lines():
    if event:
        line = event.decode("utf-8")
        if line.startswith("data: "):
            data = json.loads(line[6:])
            if "content" in data:
                for item in data["content"]:
                    if "text" in item:
                        print(item["text"])
```

```python
# Capture the runtime session ID for lifecycle management
runtime_session_id = response.get("runtimeSessionId")
print(f"Runtime Session ID: {runtime_session_id}")
```

Now let's stop this session, to make sure it was ended.

```python
response = agentcore_client.stop_runtime_session(runtimeSessionId=runtime_session_id, agentRuntimeArn=agent_arn)
response
```

Now, let's start a new session, with same session ID and ask for a new note. The `.json` file should now have 2 notes.

```python
response = agentcore_client.invoke_agent_runtime(
    agentRuntimeArn=agent_arn,
    runtimeSessionId=runtime_session_id,
    qualifier="DEFAULT",
    payload=json.dumps({"prompt": "save a reminder for sunday 11am to have family lunch."}),
)

# Stream the command output
for event in response["response"].iter_lines():
    if event:
        line = event.decode("utf-8")
        if line.startswith("data: "):
            data = json.loads(line[6:])
            if "content" in data:
                for item in data["content"]:
                    if "text" in item:
                        print(item["text"])

# Capture the runtime session ID for lifecycle management
runtime_session_id = response.get("runtimeSessionId")
print(f"Runtime Session ID: {runtime_session_id}")
```

#### Inspect Session Storage

Use `invoke_agent_runtime_command` to execute a shell command directly in the agent runtime container.

This command reads the notes file from the `/mnt/workspace` session storage, showing that the note was persisted.

```python
# Execute a system command in the agent runtime
# Command: cat /mnt/workspace/notes.json file that was generated by the skill
response = agentcore_client.invoke_agent_runtime_command(
    agentRuntimeArn=agent_arn,
    runtimeSessionId=runtime_session_id,
    body={
        "command": '/bin/bash -c "cat /mnt/workspace/notes.json"',  # Shell command to execute
        "timeout": 300,  # Timeout in seconds (5 minutes)
    },
)

# Stream the command output
for event in response["stream"]:
    if "chunk" in event:
        chunk = event["chunk"]
        print(chunk)
```

#### Create Second Session

Invoke the agent again with a different prompt. This creates a **new session** with its own isolated storage.
This also demonstrates **session isolation feature**.

```python
response = agentcore_client.invoke_agent_runtime(
    agentRuntimeArn=agent_arn,
    qualifier="DEFAULT",
    payload=json.dumps({"prompt": "remind me to wash my car on saturday."}),
)

for event in response["response"].iter_lines():
    if event:
        line = event.decode("utf-8")
        if line.startswith("data: "):
            data = json.loads(line[6:])
            if "content" in data:
                for item in data["content"]:
                    if "text" in item:
                        print(item["text"])

# Capture the runtime session ID for lifecycle management
runtime_session_id = response.get("runtimeSessionId")
print(f"Runtime Session ID: {runtime_session_id}")
```

#### Verify Session Isolation

Execute the same command in the second session. Notice that:
- Each session has its own `/mnt/workspace/notes.json`
- The notes are isolated between sessions
- Session 1 only sees its reminder about calling brother
- Session 2 only sees its reminder about washing the car

This demonstrates **managed session storage** - AgentCore automatically isolates storage per session.

```python
# Execute a system command in the agent runtime
# Command: cat /mnt/workspace/notes.json file that was generated by the skill
response = agentcore_client.invoke_agent_runtime_command(
    agentRuntimeArn=agent_arn,
    runtimeSessionId=runtime_session_id,
    body={
        "command": '/bin/bash -c "cat /mnt/workspace/notes.json"',  # Shell command to execute
        "timeout": 300,  # Timeout in seconds (5 minutes)
    },
)

# Stream the command output
for event in response["stream"]:
    if "chunk" in event:
        chunk = event["chunk"]
        print(chunk)
```

As you can see, we use `runtimeSessionId` in both calls, and you can see that the events recorded are isolated and related with respective session.

---

## Step 5: Clean Up (optional)

Delete Runtime

```python
acc_runtime.delete_agent_runtime(agentRuntimeId=agent_id)
```

```python
from helpers.utils import delete_agentcore_runtime_execution_role, SAMPLE_ROLE_NAME

delete_agentcore_runtime_execution_role(SAMPLE_ROLE_NAME)
```
