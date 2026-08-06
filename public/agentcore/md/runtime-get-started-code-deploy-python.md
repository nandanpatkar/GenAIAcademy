# Direct code deployment for Python - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-get-started-code-deploy-python.html

---

# Direct code deployment for Python

Direct code deployment enables you to bring your Python-based agent to Amazon Bedrock AgentCore Runtime simply by packaging agent code and its dependencies in a .zip file archive. Your agent still needs to follow [AgentCore Runtime requirements](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-service-contract.html>) : have an entrypoint .py file that either uses the `@app.entrypoint` annotation from [Amazon Bedrock AgentCore Python SDK](<https://github.com/aws/bedrock-agentcore-sdk-python>) or implements `/invocations` POST and `/ping` GET server endpoints.

## Prerequisites

Before you begin, ensure you have:

  * **AWS Account** with credentials configured. To configure your AWS credentials, see [Configuration and credential file settings in the AWS CLI.](<https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html>)

  * [Uv](<https://docs.astral.sh/uv/getting-started/installation/>) **installed** and [Python 3.10+](<https://docs.astral.sh/uv/guides/install-python/>) installed

  * **AWS Permissions** : To create and deploy an agent with the AgentCore CLI, you must have appropriate permissions. For more information, see [Use the AgentCore CLI](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-permissions.html#runtime-permissions-cli>).

  * **Model access** : Anthropic Claude Sonnet 4.0 [enabled](<https://docs.aws.amazon.com/bedrock/latest/userguide/model-access-modify.html>) in the Amazon Bedrock console. For information about using a different model with the Strands Agents see the _Model Providers_ section in the [Strands Agents SDK](<https://strandsagents.com/latest/documentation/docs/>) documentation.


## Step 1: Set up project and install dependencies

Initialize your project with the following commands:

```bash
uv init agentcore_runtime_direct_deploy --python 3.13
cd agentcore_runtime_direct_deploy
```
Add core packages:

```bash
uv add bedrock-agentcore strands-agents
```
Install the AgentCore CLI (required for the steps that follow):

```bash
npm install -g @aws/agentcore
```
Package descriptions:

  * **bedrock-agentcore** \- The Amazon Bedrock AgentCore SDK for building AI agents

  * **strands-agents** \- The [Strands Agents](<https://strandsagents.com/latest/>) SDK

  * **@aws/agentcore** \- The AgentCore CLI


Optionally, run `uv add aws-opentelemetry-distro` to enable [Amazon Bedrock AgentCore observability traces](<https://docs.aws.amazon.com/xray/latest/devguide/xray-services-adot.html>).

Uv will automatically create a `pyproject.toml` file with dependencies, `uv.lock` file with dependency closure and `.venv` directory.

## Step 2: Create your agent project

Use the `agentcore create` command to set up a skeleton agent project with the framework of your choice:

```bash
agentcore create
```
The command will prompt you to:

  * Choose a framework (choose Strands Agents for this tutorial)

  * Provide a project name

  * Choose a template (basic or production)

  * Choose model provider and other options


This command generates:

  * Agent code with your selected framework

  * A `pyproject.toml` file with necessary dependencies

  * An `agentcore/agentcore.json` configuration file

  * Infrastructure as Code (IaC) files if production template is selected


## Step 3: Test locally

Make sure port 8080 is free before starting. See _Port 8080 in use (local only)_ in [Common issues and solutions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-get-started-cli.html#common-issues>).

Open a terminal window and start your agent with the following command:

```bash
agentcore dev --no-browser
```
Test your agent by opening another terminal window and enter the following command:

```bash
curl -X POST http://localhost:8080/invocations \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello!"}'
```
**Success:** You should see a response like `{"result": "Hello! I’m here to help…​"}` . In the terminal window that’s running the agent, enter `Ctrl+C` to stop the agent.

## Step 4: Enable observability for your agent

[Amazon Bedrock AgentCore Observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability.html>) helps you trace, debug, and monitor agents that you host in AgentCore Runtime. First enable CloudWatch Transaction Search by following the instructions at [Enabling Amazon Bedrock AgentCore runtime observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html#observability-configure-builtin>) . To observe your agent, see [View observability data for your Amazon Bedrock AgentCore agents](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-view.html>).

## Step 5: Deploy to AgentCore Runtime and invoke

Deploy your agent using one of the following methods:

###### Example

AgentCore CLI
    

  1. The following steps will be required to deploy an agent to AgentCore Runtime. For more information, see [Get started with the AgentCore CLI](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-get-started-cli.html>) . If Uv is available, the AgentCore CLI will recommend direct code deployment. Otherwise it will default to container deployment type.

Once you have your agent set up using `agentcore create` , use the `deploy` command to create a zip deployment package, upload it to the specified bucket, and deploy the agent.

```bash
agentcore deploy
```
Let’s prompt the agent to tell a joke!

```bash
agentcore invoke "Tell me a joke"
```
The first deployment takes time to install dependencies but subsequent updates to the agent optimizes this by re-using zipped dependencies

**Configuration management**

You can modify your agent configuration at any time using the `agentcore add` commands or by editing the `agentcore/agentcore.json` configuration file directly.

The configuration file allows you to update deployment parameters such as your VPC configuration, execution roles, session timeouts, and OAuth authorizer settings.


Interactive
    

  1. Run `agentcore` to open the TUI, then select **deploy** . The deploy screen shows real-time progress as it validates your project, synthesizes CloudFormation, and provisions AWS resources:

![AgentCore deploy progress showing CloudFormation stack updates](/agentcore/images/code-deploy-progress.png)

After deployment completes, use `agentcore invoke` to test your agent.


Custom zip + boto3
    

  1. To download a wheel that’s compatible with AgentCore Runtime, you use the uv pip `--python-platform` option. AgentCore Runtime only supports **arm64** instruction set architecture, run the following command. Replace `--python 3.x` with the version of the Python runtime you are using.

```bash
uv pip install \
--python-platform aarch64-manylinux2014 \
--python-version 3.13 \
--target=deployment_package \
--only-binary=:all: \
-r pyproject.toml
```
Create a .zip file with the installed libraries at the project root.

```bash
cd deployment_package
zip -r ../deployment_package.zip .
```
Add the `main.py` file and other files in your package to the root of the .zip file.

```bash
cd ..
zip deployment_package.zip main.py
```
After you have created your .zip deployment package, you can use it to create a new AgentCore Runtime or update an existing one. You can deploy your .zip package using AgentCore Runtime API, AgentCore Runtime console and AWS Command Line Interface. The AgentCore CLI will take care of above steps to create .zip.

###### Note

. The maximum size for a .zip deployment package for AgentCore Runtime is 250 MB (zipped) and 750 MB (unzipped). Note that this limit applies to the combined size of all the files you upload. . The AgentCore Runtime needs permission to read the files in your deployment package. In Linux permissions octal notation, AgentCore Runtime needs 644 permissions for non-executable files (rw-r—r--) and 755 permissions (rwxr-xr-x) for directories and executable files. . In Linux and MacOS, use the `chmod` command to change file permissions on files and directories in your deployment package. For example, to give a non-executable file the correct permissions, run the following command, `chmod 644 <filepath>` . To change file permissions in Windows, see [Set, View, Change, or Remove Permissions on an Object](<https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc731667\(v=ws.10\)>) in the Microsoft Windows documentation. + .. If you don’t grant AgentCore Runtime the permissions it needs to access directories in your deployment package, AgentCore Runtime sets the permissions for those directories to 755 (rwxr-xr-x).

A ZIP archive containing Linux **arm64** dependencies needs to be uploaded to S3 as a pre-requisite to Create Agent Runtime. The below code requires the specified S3 bucket to already exist. Please follow the AWS documentation [here](<https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3/client/create_bucket.html>) to create an bucket using boto3. Following boto3 code will upload .zip file archive to a s3 and create Amazon Bedrock AgentCore runtime.

```python
import boto3

account_id = "your aws account id"
agent_name = "strands_10_23"

s3_client = boto3.client('s3', region_name='us-west-2')
print("Uploading deployment.zip to S3...")
s3_client.upload_file(
    'deployment_package.zip', # archive on file system
    f"bedrock-agentcore-code-{account_id}-us-west-2", # bucket name
    f"{agent_name}/deployment_package.zip", # prefix
    ExtraArgs={'ExpectedBucketOwner': account_id} # ownership check
)
print("Upload completed successfully!")
print(f"S3 Location: s3://bedrock-agentcore-code-{account_id}-us-west-2/{agent_name}/deployment_package.zip")

agentcore_client = boto3.client('bedrock-agentcore-control', region_name='us-west-2')
response = agentcore_client.create_agent_runtime(
    agentRuntimeName=agent_name,
    agentRuntimeArtifact={
        'codeConfiguration': {
            'code': {
                's3': {
                    'bucket': f"bedrock-agentcore-code-{account_id}-us-west-2",
                    'prefix': f"{agent_name}/deployment_package.zip"
                }
            },
            'runtime': 'PYTHON_3_13',
            'entryPoint': ['opentelemetry-instrument', 'main.py']
        } # if not adding otel dependency, remove opentelemetry-instrument from entrypoint array
    },
    networkConfiguration={"networkMode": "PUBLIC"},
    roleArn=f"arn:aws:iam::{account_id}:role/AmazonBedrockAgentCoreSDKRuntime-us-west-2",
    lifecycleConfiguration={
        'idleRuntimeSessionTimeout': 300,  # 5 min, configurable
        'maxLifetime': 1800                # 30 minutes, configurable
    },
)
print(f"Agent Runtime created successfully!")
print(f"Agent Runtime ARN: {response['agentRuntimeArn']}")
print(f"Status: {response['status']}")
```
For more information about invoking an agent programmatically, see [Invoke an agent programmatically](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-get-started-cli.html#invoke-programmatically>).


console
    

  1. You can deploy your agent using the Amazon Bedrock AgentCore console with managed runtime support. The console provides an intuitive interface for uploading ZIP files and configuring agent settings.

To deploy using the console, first create your deployment package following the steps in the _Custom zip + boto3_ tab above.

**Create agent through console**

To create your agent:

  2. From the Agents home page, choose **Host Agent**

  3. Choose your source selection:

     * **S3 Source** \- Upload from S3 bucket

     * **Local Upload** \- Upload ZIP file from your computer

     * **Templates** \- Use pre-built agent templates

  4. Configure your agent settings:

     * Agent name

     * Runtime version (Python 3.13 recommended)

     * Entry point (e.g., `main.py` )

     * Execution role (create new or use existing)

  5. Choose **Create Agent** to deploy

**Create endpoint**

Choose **Create Endpoint** to create a new endpoint for your agent. The endpoint name and associated version will be pre-filled.

**Test endpoint**

Select an endpoint and choose **Test Endpoint** to navigate to the Playground/Sandbox for testing.

**Execution role requirements**

Your agent requires an execution role with appropriate permissions. For detailed information about execution roles and permissions, see [AgentCore Runtime permissions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-permissions.html>) . The execution role must include basic Amazon Bedrock AgentCore runtime permissions, S3 access permissions for your deployment package, and CloudWatch Logs permissions for observability.


## Step 6: Stop session, update, or cleanup

Stop your runtime session, update, or cleanup your agent using one of the following methods:

###### Example

AgentCore CLI
    

  1. To update previously deployed AgentCore Runtime, execute:

```bash
agentcore deploy
```
To stop a running session before the configurable `IdleRuntimeSessionTimeout` (defaulted at 15 minutes) and save on any potential runaway costs, use the [StopRuntimeSession](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_StopRuntimeSession.html>) API operation. The AgentCore CLI does not currently support stopping sessions directly.

To delete all resources related to a AgentCore Runtime, first remove all resources and then deploy to tear down AWS resources:

```bash
agentcore remove all
agentcore deploy
```
boto3
    

  1. Following boto3 code will update an AgentCore Runtime.

```python
import boto3

account_id = "your aws account id"
agent_name = "strands_10_23"

s3_client = boto3.client('s3', region_name='us-west-2')
print("Uploading deployment.zip to S3...")
s3_client.upload_file(
    'deployment_package.zip', # archive on file system
    f"bedrock-agentcore-code-{account_id}-us-west-2", # bucket name
    f"{agent_name}/deployment_package.zip", # prefix
    ExtraArgs={'ExpectedBucketOwner': account_id} # ownership check
)
print("Upload completed successfully!")
print(f"S3 Location: s3://bedrock-agentcore-code-{account_id}-us-west-2/{agent_name}/deployment_package.zip")

bedrock_agentcore_client = boto3.client('bedrock-agentcore-control', region_name='us-west-2')
response = bedrock_agentcore_client.update_agent_runtime(
    agentRuntimeId='<your-agent-id>',
    agentRuntimeArtifact={
        'codeConfiguration': {
            'code': {
                's3': {
                    'bucket': f"bedrock-agentcore-code-{account_id}-us-west-2",
                    'prefix': f"{agent_name}/deployment_package.zip"
                }
            },
            'runtime': 'PYTHON_3_13',
            'entryPoint': ['opentelemetry-instrument', 'main.py']
        } # if not adding otel dependency, remove opentelemetry-instrument from entrypoint array
    },
    networkConfiguration={"networkMode": "PUBLIC"},
    roleArn=f"arn:aws:iam::{account_id}:role/AmazonBedrockAgentCoreSDKRuntime-us-west-2"
)

print(f"Agent Runtime updated successfully!")
print(f"Agent Runtime ARN: {response['agentRuntimeArn']}")
print(f"Status: {response['status']}")
```
To stop the running session before the configurable `IdleRuntimeSessionTimeout` (defaulted at 15 minutes) and save on any potential runaway costs, use the following boto3 code:

```python
import boto3

agent_core_client = boto3.client('bedrock-agentcore', region_name='us-west-2')
response = agent_core_client.stop_runtime_session(
    agentRuntimeArn='arn:aws:bedrock-agentcore:us-west-2:account-id:runtime/agent-name-suffix',
    runtimeSessionId='your-session-id',
    qualifier="DEFAULT"
)
```
Following boto3 code will delete Amazon Bedrock AgentCore runtime and .zip archive file in s3.

```python
import boto3

account_id = "your aws account id"
agent_name = "strands_10_23"

bedrock_agentcore_client = boto3.client('bedrock-agentcore-control', region_name='us-west-2')
print("Deleting Agent from Amazon Bedrock AgentCore Runtime!")
response = bedrock_agentcore_client.delete_agent_runtime(
    agentRuntimeId='<agent-id>'
)
print(f"Agent Runtime delete successfully!")
print(f"Status: {response['status']}")

s3_client = boto3.client('s3', region_name='us-west-2')
print("Deleting deployment archive from S3...")
s3_client.delete_object(
    Bucket=f"bedrock-agentcore-code-{account_id}-us-west-2",
    Key=f"{agent_name}/deployment_package.zip",
    ExpectedBucketOwner=account_id
)
print("Archive deleted successfully from S3!")
```
console
    

  1. ====== Update agent

From the Agent details page, choose **Update hosting** to create a new version with updated code or configuration.

**Update endpoint**

Select an endpoint from the Endpoints table and choose **Edit** to update the description or associated version.

**Delete endpoint**

Select an endpoint and choose **Delete** . You’ll need to type "delete" to confirm the deletion.

**Delete agent**

From the agent list or details page, select your agent and choose **Delete** to remove the agent and all associated resources.


## Python-specific concepts for direct code deployment

Learn about Python-specific concepts when using direct code deployment with Amazon Bedrock AgentCore Runtime.

###### Topics


When you use an `import` statement in your code, the Python runtime searches the directories in its search path until it finds the module or package. By default, the first location the runtime searches is the directory into which your .zip deployment package is decompressed and mounted ( `/var/task` ).

You can see the full search path for your AgentCore Runtime agent by adding the following code snippet.

```python
import sys
search_path = sys.path
print(search_path)
```
You can also add dependencies in a separate folder inside your .zip package. For example, you might add a version of the Boto3 SDK to a folder in your .zip package called `common` . When your .zip package is decompressed and mounted, this folder is placed inside the `/var/task` directory. To use a dependency from a folder in your .zip deployment package in your code, use an `import from` statement. For example, to use a version of Boto3 from a folder named `common` in your .zip package, use the following statement.

```python
from common import boto3
```
We recommend that you don’t include ` _pycache_ ` folders in your agent’s deployment package. Python bytecode that’s compiled on a build machine with a different architecture or operating system might not be compatible with the AgentCore Runtime execution environment.

If your function uses only pure Python packages and modules, you can use the `uv pip install` command to install your dependencies on any local build machine and create your .zip file. Many popular Python libraries, including NumPy and Pandas, are not pure Python and contain code written in C or C. When you add libraries containing C/C code to your deployment package, you must build your package correctly to make it compatible with the AgentCore Runtime execution environment.

Most packages available on the Python Package Index ( [PyPI](<https://pypi.org/>) ) are available as "wheels" (.whl files). A .whl file is a type of ZIP file which contains a built distribution with pre-compiled binaries for a particular operating system and instruction set architecture. To make your deployment package compatible with Amazon Bedrock AgentCore AgentCore Runtime, you install the wheel for Linux operating systems and **arm64** instruction set architecture.

Some packages may only be available as source distributions. For these packages, you need to compile and build the C/C++ components yourself.

To see what distributions are available for your required package, do the following:

  1. Search for the name of the package on the [Python Package Index main page](<https://pypi.org/>).

  2. Choose the version of the package you want to use.

  3. Choose **Download files**.


If your package is only available as a source distribution, you need to build the C/C++ libraries yourself. To make your package compatible with the Amazon Bedrock AgentCore AgentCore Runtime execution environment, you need to build it in an environment that uses the same Amazon Linux operating system with **arm64** instruction set. You can do this by building your package in an Amazon Elastic Compute Cloud (Amazon EC2) Linux instance.

To learn how to launch and connect to an Amazon EC2 Linux instance, see [Get started with Amazon EC2](<https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html>) in the _Amazon EC2 User Guide_.

