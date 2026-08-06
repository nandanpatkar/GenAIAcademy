# Get started with the AgentCore CLI in TypeScript - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-get-started-cli-typescript.html

---

# Get started with the AgentCore CLI in TypeScript

This tutorial shows you how to use the [AgentCore CLI](<https://github.com/aws/agentcore-cli>) to create, deploy, and invoke a TypeScript agent on Amazon Bedrock AgentCore Runtime. This tutorial takes approximately 20 minutes to complete.

The AgentCore CLI is a command-line tool that scaffolds agent projects, deploys them to Amazon Bedrock AgentCore Runtime, and invokes them. This tutorial uses the [Strands Agents](<https://strandsagents.com/latest/>) framework with TypeScript and direct code deployment (CodeZip).

The AWS resources created in this tutorial might result in charges to your AWS account. When you finish the tutorial, you can remove resources by following the steps in Step 7: Clean up.

For information about the HTTP protocol that the agent uses, see [HTTP protocol contract](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-http-protocol-contract.html>).

###### Topics

  * Prerequisites

  * Step 1: Install the AgentCore CLI

  * Step 2: Create your agent project

  * Step 3: Test your agent locally

  * Step 4: Deploy to Amazon Bedrock AgentCore Runtime

  * Step 5: Test your deployed agent

  * Step 6: Invoke your deployed agent programmatically

  * Step 7: Clean up

  * Find your resources

  * Common issues and solutions


## Prerequisites

Before you start, make sure you have:

  * **AWS Account** with credentials configured. To configure your AWS credentials, see [Configuration and credential file settings in the AWS CLI.](<https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html>)

  * **Node.js 22+** installed. The AgentCore CLI is distributed as an npm package, and the generated agent code is TypeScript. We recommend installing the same major version you plan to deploy on AgentCore Runtime. For supported versions, see [Supported language runtimes](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-code-deploy-supported-runtimes.html>).

  * **AWS CDK** installed. The CLI uses the AWS CDK to deploy resources. To install the AWS CDK, see [Getting started with the AWS CDK](<https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html>).

  * **AWS Permissions** : To create and deploy an agent with the AgentCore CLI, you must have appropriate permissions. For information, see [Use the AgentCore CLI](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-permissions.html#runtime-permissions-cli>).

  * **Model access** : Anthropic Claude Sonnet 4 [enabled](<https://docs.aws.amazon.com/bedrock/latest/userguide/model-access-modify.html>) in the Amazon Bedrock console (if using Bedrock as the model provider). For information about using a different model with Strands Agents, see the _Model Providers_ section in the [Strands Agents SDK](<https://strandsagents.com/latest/documentation/docs/>) documentation.


## Step 1: Install the AgentCore CLI

Install the AgentCore CLI globally:

```bash
npm install -g @aws/agentcore
```
Verify the installation:

```bash
agentcore --help
```
## Step 2: Create your agent project

Use the `agentcore create` command to scaffold a new TypeScript agent project:

###### Example

AgentCore CLI
    

  1. Create a project without an agent, then add a TypeScript agent:

```bash
agentcore create --name MyTsAgent --no-agent
cd MyTsAgent
agentcore add agent --name TsAgent --type create --build CodeZip --language TypeScript --framework Strands --model-provider Bedrock --memory none
```
Interactive
    

  1. Run `agentcore create` without flags to launch the interactive wizard:

```bash
agentcore create
```
  2. Enter your project name.

  3. When prompted, add an agent and select **TypeScript** as the language, **Strands** as the framework, and **CodeZip** as the build type.

  4. Review your configuration and confirm.


The command generates a project directory with the following structure:

```text
MyTsAgent/
  agentcore/
    agentcore.json        # Project and agent configuration
    aws-targets.json      # AWS account and region targets
  app/
    TsAgent/
      main.ts             # Agent entrypoint
      model/load.ts       # Model configuration
      mcp_client/client.ts # Example MCP client
      package.json        # Dependencies
      tsconfig.json       # TypeScript configuration
```
The `agentcore/agentcore.json` file contains your project and agent configuration. The `app/TsAgent/main.ts` file contains starter agent code using the Strands Agents framework.

## Step 3: Test your agent locally

Before deploying to AWS, test your agent locally using the development server:

###### Example

AgentCore CLI
    

  1. 
```bash
agentcore dev
```
 


Interactive
    

  1. Run `agentcore` to open the TUI home screen, then select **dev** to start the local development server:

```text
agentcore
```
The `agentcore dev` command:

  * Opens agent inspector in your web browser

  * Automatically installs dependencies and compiles TypeScript

  * Starts a local server that mimics the AgentCore Runtime environment

  * Runs on `http://localhost:8080` by default (use `-p` to change the port)


To view server logs in real time (non-interactive mode), use the `--logs` flag:

```bash
agentcore dev --logs
```
In a separate terminal, invoke your local agent:

```bash
agentcore dev "Hello, tell me a joke"
```
Passing a prompt sends it to the running local development server. Use `--stream` to see the response streamed in real time.

## Step 4: Deploy to Amazon Bedrock AgentCore Runtime

Deploy your agent to Amazon Bedrock AgentCore Runtime:

###### Example

AgentCore CLI
    

  1. 
```bash
agentcore deploy
```
 


Interactive
    

  1. Run `agentcore deploy` to start deployment. The CLI shows the deployment progress as it builds and deploys your project:

```bash
agentcore deploy
```
To preview the deployment without making changes, use the `--dry-run` flag:

```bash
agentcore deploy --dry-run
```
The `agentcore deploy` command:

  * Reads your `agentcore/agentcore.json` and `agentcore/aws-targets.json` configuration

  * Compiles TypeScript to JavaScript and packages your agent code as a CodeZip archive

  * Uses the AWS CDK to synthesize and deploy CloudFormation resources

  * Creates the necessary AWS resources (IAM roles, Amazon Bedrock AgentCore Runtime, etc.)


Use `-v` for verbose output that shows resource-level deployment events. Use `-y` to auto-confirm the deployment without a prompt.

If the deployment fails, check for common issues.

## Step 5: Test your deployed agent

After deployment completes, invoke your deployed agent:

###### Example

AgentCore CLI
    

  1. 
```bash
agentcore invoke "Tell me a joke"
```
 

You can also pass the prompt with the `--prompt` flag, specify a runtime with `--runtime` , or stream the response in real time with `--stream` :

```bash
agentcore invoke --prompt "Tell me a joke" --stream
```
To maintain a conversation across multiple invocations, use the `--session-id` flag:

```bash
agentcore invoke --session-id my-session "What else can you tell me?"
```
Interactive
    

  1. Run `agentcore` to open the TUI home screen, then select the invoke option to chat with your deployed agent:

```text
agentcore
```
If you see a joke in the response, your agent is running in Amazon Bedrock AgentCore Runtime and can be invoked. If not, check for common issues.

## Step 6: Invoke your deployed agent programmatically

###### Example

AgentCore CLI
    

  1. Invoke your deployed agent with a prompt:

```bash
agentcore invoke --runtime TsAgent "Hello, what can you do?"
```
Stream the response in real time:

```bash
agentcore invoke --runtime TsAgent "Tell me a joke" --stream
```
Run `agentcore invoke` without a prompt to open the interactive chat TUI, which streams responses by default and maintains your session automatically.


AWS SDK for JavaScript
    

  1. You can also invoke the agent using the AWS SDK [InvokeAgentRuntime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_InvokeAgentRuntime.html>) operation. To get the ARN of your deployed agent, use the `agentcore status` command:

```bash
agentcore status
```
Use the following TypeScript code to invoke your agent. Replace `Agent ARN` with the ARN of your agent. Make sure that you have `bedrock-agentcore:InvokeAgentRuntime` permissions. Create a file named `invoke-agent.ts` and add the following code:

```python
import {
  BedrockAgentCoreClient,
  InvokeAgentRuntimeCommand
} from '@aws-sdk/client-bedrock-agentcore';
import { randomUUID } from 'crypto';

const agentArn = 'Agent ARN';
const prompt = 'Tell me a joke';

// Initialize the Amazon Bedrock AgentCore client
const client = new BedrockAgentCoreClient({ region: 'us-west-2' });

// Invoke the agent
const command = new InvokeAgentRuntimeCommand({
  agentRuntimeArn: agentArn,
  runtimeSessionId: randomUUID(),
  payload: JSON.stringify({ prompt }),
  contentType: 'application/json',
  qualifier: 'DEFAULT',
});

const response = await client.send(command);
const textResponse = await response.response?.transformToString();

console.log('Response:', textResponse);
```
Open a terminal window and run the code with the following command:

```bash
npx tsx invoke-agent.ts
```
If successful, you should see a joke in the response. If the call fails, check the logs using `agentcore logs` or view them in Amazon CloudWatch.

###### Note

If you plan on integrating your agent with OAuth, you can’t use the AWS SDK to call `InvokeAgentRuntime` . Instead, make a HTTPS request to `InvokeAgentRuntime` . For more information, see [Authenticate and authorize with Inbound Auth and Outbound Auth](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-oauth.html>).


## Step 7: Clean up

If you no longer want to host the agent in Amazon Bedrock AgentCore Runtime, remove the deployed AWS resources. First, remove all resources from your local configuration:

###### Example

AgentCore CLI
    

  1. 
```bash
agentcore remove all
```
 


Interactive
    

  1. Run `agentcore` to open the TUI home screen, then select the remove option to choose which resources to remove:

```text
agentcore
```
Then deploy again to tear down the AWS resources:

###### Example

AgentCore CLI
    

  1. 
```bash
agentcore deploy
```
 


Interactive
    

  1. From the AgentCore CLI home screen, select `deploy` to apply the removal and tear down AWS resources.


The `remove all` command resets the `agentcore/agentcore.json` configuration file while preserving `agentcore/aws-targets.json` and deployment state. The subsequent `deploy` detects the removed resources and tears down the corresponding AWS resources.

## Find your resources

After deployment, you can check the status of your resources by using the AgentCore CLI:

###### Example

AgentCore CLI
    

  1. 
```bash
agentcore status
```
 


Interactive
    

  1. Run `agentcore` and select `status` to view a live dashboard of all deployed resources:

```text
agentcore
```
You can also view your resources in the AWS Console:

Resource | Location  
---|---  
**Agent Logs** |  CloudWatch → Log groups → `/aws/bedrock-agentcore/runtimes/{agent-id}-DEFAULT`  
**CloudFormation Stack** |  CloudFormation → Stacks → search for your project name  
**IAM Role** |  IAM → Roles → Search for "BedrockAgentCore"  
**S3 Assets (CodeZip)** |  S3 → Buckets → CDK staging bucket  
  
## Common issues and solutions

Common issues and solutions when getting started with the AgentCore CLI for TypeScript. For more troubleshooting information, see [Troubleshoot Amazon Bedrock AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-troubleshooting.html>).

**Permission denied errors**
    

Verify your AWS credentials and permissions:

  * Verify AWS credentials: `aws sts get-caller-identity`

  * Check you have the required policies attached

  * Review caller permissions policy for detailed requirements


**Model access denied**
    

Enable model access in the Bedrock console:

  * Enable Anthropic Claude Sonnet 4 in the Bedrock console

  * Make sure you’re in the correct AWS Region (us-west-2 by default)


**CDK deployment errors**
    

Check CDK setup and permissions:

  * Make sure you have bootstrapped your AWS account for CDK: `cdk bootstrap`

  * Verify your caller permissions include CloudFormation and CDK access

  * Use `agentcore deploy -v` for verbose output to identify the failing resource


**TypeScript compilation errors**
    

Ensure your TypeScript configuration is correct:

  * Run `npm run build` locally in the agent directory to check for errors

  * Verify `tsconfig.json` exists and has correct settings

  * Ensure `"type": "module"` is set in `package.json`


**Deployment package too large**
    

The maximum size for a .zip deployment package is 250 MB (zipped) and 750 MB (unzipped). To reduce package size:

  * The CLI uses esbuild bundling automatically to produce a smaller artifact

  * Remove unnecessary dependencies from `package.json`


**Native module architecture mismatch**
    

AgentCore Runtime only supports **arm64** architecture. If your agent uses npm packages with native modules (`.node` or `.so` files), ensure they are compiled for Linux arm64:

  * Install dependencies on an arm64 machine or use `npm install --arch=arm64 --platform=linux`

  * Most popular npm packages are pure JavaScript and do not require native modules


**Port 8080 in use (local only)**
    

Find and stop processes that are using port 8080:

Use `lsof -ti:8080` to get a list of processes using port 8080.

Use `kill -9 PID` to stop the process. Replace `PID` with the process ID.

Alternatively, start the dev server on a different port: `agentcore dev -p 3000`

**Region mismatch**
    

Verify the AWS Region with `aws configure get region` and make sure the region in `agentcore/aws-targets.json` matches where your resources should be deployed.

**Configuration validation errors**
    

Validate your configuration files:

Use `agentcore validate` to check for syntax or schema errors in `agentcore/agentcore.json` and related configuration files.

