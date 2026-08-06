# Direct code deployment for Node.js - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-get-started-code-deploy-node.html

---

# Direct code deployment for Node.js

Direct code deployment enables you to bring your Node.js-based agent to Amazon Bedrock AgentCore Runtime simply by packaging agent code and its dependencies in a .zip file archive. Your agent still needs to follow [AgentCore Runtime requirements](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-service-contract.html>) : have an entrypoint `.js` file that implements `/invocations` POST and `/ping` GET server endpoints.

You can include dependencies either as vendored `node_modules/` in your ZIP or as an esbuild-bundled single `.js` file.

## Prerequisites

Before you begin, ensure you have:

  * **AWS Account** with credentials configured. To configure your AWS credentials, see [Configuration and credential file settings in the AWS CLI.](<https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html>)

  * [**Node.js**](<https://nodejs.org/>) and **npm** installed. We recommend installing the same major version you plan to deploy on AgentCore Runtime (for example, Node.js 22 for the `NODE_22` runtime). For supported versions, see [Supported language runtimes](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-code-deploy-supported-runtimes.html>).

  * **AWS Permissions** : To create and deploy an agent, you must have appropriate permissions. For more information, see [AgentCore Runtime permissions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-permissions.html>).

  * **Model access** : Anthropic Claude Sonnet 4.0 [enabled](<https://docs.aws.amazon.com/bedrock/latest/userguide/model-access-modify.html>) in the Amazon Bedrock console. For information about using a different model with the Strands Agents see the _Model Providers_ section in the [Strands Agents SDK](<https://strandsagents.com/latest/documentation/docs/>) documentation.


## Step 1: Set up project and install dependencies

Initialize your project with the following commands:

```bash
mkdir agentcore_runtime_node_deploy
cd agentcore_runtime_node_deploy
npm init -y
```
Optionally, run `npm install @aws/aws-distro-opentelemetry-node-autoinstrumentation` to enable [Amazon Bedrock AgentCore observability traces](<https://docs.aws.amazon.com/xray/latest/devguide/xray-services-adot.html>).

## Step 2: Create your agent code

Create your agent entry point. Your agent must implement the AgentCore Runtime HTTP contract with a `/ping` GET health endpoint and `/invocations` POST handler.

###### Example

Strands Agents SDK
    

Install the [Strands Agents SDK](<https://strandsagents.com/latest/>) and its dependencies:

```bash
npm install @strands-agents/sdk express zod
npm install -D @types/express @types/node typescript
```
Create a file named `src/app.ts` :

```python
import express, { Request, Response } from "express";
import { Agent, tool } from "@strands-agents/sdk";
import z from "zod";

const PORT = 8080;
const app = express();

app.use(express.json());

const currentTime = tool({
    name: "current_time",
    description: "Returns the current date and time",
    inputSchema: z.object({}),
    callback: () => {
        return new Date().toISOString();
    },
});

const agent = new Agent({
    tools: [currentTime],
    printer: false,
});

app.get("/ping", (_req: Request, res: Response) => {
    res.json({ status: "Healthy" });
});

app.post("/invocations", async (req: Request, res: Response) => {
    const prompt = req.body?.prompt || "No prompt provided";

    try {
        const result = await agent.invoke(prompt);
        res.json({ result: result.lastMessage });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: message });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log("Strands agent listening on port " + PORT);
});
```
Compile the TypeScript to JavaScript:

```bash
npx tsc --init --target ES2022 --module commonjs --outDir ./dist
npx tsc
```
The compiled output in `dist/app.js` is what you deploy. When creating the agent, use `"entryPoint": ["dist/app.js"]` — the compiled JavaScript output, not the `.ts` source.

HTTP (no framework)
    

This example uses the built-in `node:http` module with no external dependencies.

Create a file named `app.js` :

```typescript
const http = require("node:http");
const PORT = 8080;

const server = http.createServer((req, res) => {
    if (req.url === "/ping" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "Healthy" }));
    } else if (req.url === "/invocations" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => { body += chunk; });
        req.on("end", () => {
            try {
                const input = JSON.parse(body);
                const prompt = input.prompt || input.command || "No prompt provided";
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    result: "Hello from Node.js managed runtime! You said: " + prompt,
                    runtime: "NODE_22",
                    nodeVersion: process.version,
                    timestamp: new Date().toISOString()
                }));
            } catch (e) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    result: "Hello from Node.js managed runtime!",
                    runtime: "NODE_22",
                    nodeVersion: process.version,
                    input: body,
                    timestamp: new Date().toISOString()
                }));
            }
        });
    } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Node.js managed runtime agent is running" }));
    }
});

server.listen(PORT, "0.0.0.0", () => {
    console.log("Node.js agent listening on port " + PORT);
});
```
## Step 3: Test locally

Make sure port 8080 is free before starting. See _Port 8080 in use (local only)_ in [Common issues and solutions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-get-started-cli.html#common-issues>).

Open a terminal window and start your agent:

###### Example

Strands Agents SDK
     ```text
     node dist/app.js
     ```
Open another terminal window and invoke the agent:

```bash
curl -X POST http://localhost:8080/invocations \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What time is it right now?"}'
```
**Success:** You should see a response containing the current time returned by the agent’s `current_time` tool. In the terminal window that’s running the agent, enter `Ctrl+C` to stop the agent.

HTTP (no framework)
     ```text
     node app.js
     ```
Open another terminal window and invoke the agent:

```bash
curl -X POST http://localhost:8080/invocations \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello!"}'
```
**Success:** You should see a response like `{"result": "Hello from Node.js managed runtime! You said: Hello!","runtime":"NODE_22",…​}` . In the terminal window that’s running the agent, enter `Ctrl+C` to stop the agent.

## Step 4: Enable observability for your agent

[Amazon Bedrock AgentCore Observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability.html>) helps you trace, debug, and monitor agents that you host in AgentCore Runtime. First enable CloudWatch Transaction Search by following the instructions at [Enabling Amazon Bedrock AgentCore runtime observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html#observability-configure-builtin>) . To observe your agent, see [View observability data for your Amazon Bedrock AgentCore agents](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-view.html>).

To enable auto-instrumentation for your Node.js agent, add the ADOT package:

```bash
npm install @aws/aws-distro-opentelemetry-node-autoinstrumentation
```
###### Important

ADOT auto-instrumentation works by patching Node.js `require()` calls at runtime. This means it is only compatible with CommonJS module output. If you compile TypeScript with `--module nodenext` or `--module esnext` (producing ESM `import` statements), ADOT instrumentation silently fails and no traces are emitted. To use ADOT, compile with `--module commonjs` or use esbuild with `--platform=node` (which preserves `require()` calls for Node.js built-in modules).

When deploying, include `node_modules/` in your ZIP and use the `opentelemetry-instrument` prefix in your entry point (see Step 5).

## Step 5: Deploy to AgentCore Runtime and invoke

###### Note

AgentCore Runtime does not run TypeScript (`.ts`) files natively. You must transpile TypeScript to JavaScript before deploying. For details, see Working with TypeScript .

Create a .zip file with your agent code and dependencies. AgentCore Runtime only supports **arm64** instruction set architecture — ensure any native modules (`.node` files) are compiled for arm64.

###### Example

Strands Agents SDK
    

Package the compiled output and vendored dependencies:

```bash
npm install --production
zip -r deployment_package.zip dist/ node_modules/ package.json
```
When creating the agent, use `"entryPoint": ["dist/app.js"]` — the compiled JavaScript output, not the `.ts` source.

HTTP (no framework)
    

Since this example has no external dependencies, only the entry point file is needed:

```text
zip deployment_package.zip app.js
```
When creating the agent, use `"entryPoint": ["app.js"]` .

###### Note

. The maximum size for a .zip deployment package for AgentCore Runtime is 250 MB (zipped) and 750 MB (unzipped). Note that this limit applies to the combined size of all the files you upload. . The AgentCore Runtime needs permission to read the files in your deployment package. In Linux permissions octal notation, AgentCore Runtime needs 644 permissions for non-executable files (rw-r—r--) and 755 permissions (rwxr-xr-x) for directories and executable files. . In Linux and MacOS, use the `chmod` command to change file permissions on files and directories in your deployment package. For example, to give a non-executable file the correct permissions, run the following command, `chmod 644 <filepath>` . To change file permissions in Windows, see [Set, View, Change, or Remove Permissions on an Object](<https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc731667\(v=ws.10\)>) in the Microsoft Windows documentation. + .. If you don’t grant AgentCore Runtime the permissions it needs to access directories in your deployment package, AgentCore Runtime sets the permissions for those directories to 755 (rwxr-xr-x).

A ZIP archive containing Linux **arm64** dependencies needs to be uploaded to S3 as a pre-requisite to Create Agent Runtime. The below code requires the specified S3 bucket to already exist. Please follow the AWS documentation [here](<https://docs.aws.amazon.com/AmazonS3/latest/userguide/creating-bucket-s3.html>) to create a bucket. The following TypeScript code will upload the .zip file archive to S3 and create an Amazon Bedrock AgentCore runtime.

```python
import { readFileSync } from "node:fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
    BedrockAgentCoreControlClient,
    CreateAgentRuntimeCommand,
} from "@aws-sdk/client-bedrock-agentcore-control";

const accountId = "your-aws-account-id";
const agentName = "nodejs_agent";
const region = "us-west-2";
const bucketName = `bedrock-agentcore-code-${accountId}-${region}`;

const s3Client = new S3Client({ region });
console.log("Uploading deployment_package.zip to S3...");
await s3Client.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: `${agentName}/deployment_package.zip`,
    Body: readFileSync("deployment_package.zip"),
    ExpectedBucketOwner: accountId,
}));
console.log(`Upload completed. S3 location: s3://${bucketName}/${agentName}/deployment_package.zip`);

const controlClient = new BedrockAgentCoreControlClient({ region });
const response = await controlClient.send(new CreateAgentRuntimeCommand({
    agentRuntimeName: agentName,
    agentRuntimeArtifact: {
        codeConfiguration: {
            code: {
                s3: {
                    bucket: bucketName,
                    prefix: `${agentName}/deployment_package.zip`,
                },
            },
            runtime: "NODE_22",
            entryPoint: ["dist/app.js"],
        },
    },
    networkConfiguration: { networkMode: "PUBLIC" },
    roleArn: `arn:aws:iam::${accountId}:role/AmazonBedrockAgentCoreSDKRuntime-${region}`,
    lifecycleConfiguration: {
        idleRuntimeSessionTimeout: 300,
        maxLifetime: 1800,
    },
}));
console.log(`Agent Runtime created successfully!`);
console.log(`Agent Runtime ARN: ${response.agentRuntimeArn}`);
console.log(`Status: ${response.status}`);
```
To enable OTEL auto-instrumentation, include `node_modules/@aws/aws-distro-opentelemetry-node-autoinstrumentation/` in your ZIP and use the `opentelemetry-instrument` prefix in the entry point:

```yaml
entryPoint: ["opentelemetry-instrument", "dist/app.js"],
```
To invoke an agent on Amazon Bedrock AgentCore runtime programmatically, refer: [Invoke an agent programmatically](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-get-started-cli.html#invoke-programmatically>)

## Step 6: Stop session, update, or cleanup

Following TypeScript code will update an AgentCore Runtime. Upload the new deployment package to S3, then call `UpdateAgentRuntimeCommand` :

```python
import { readFileSync } from "node:fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
    BedrockAgentCoreControlClient,
    UpdateAgentRuntimeCommand,
} from "@aws-sdk/client-bedrock-agentcore-control";

const accountId = "your-aws-account-id";
const agentName = "nodejs_agent";
const region = "us-west-2";
const bucketName = `bedrock-agentcore-code-${accountId}-${region}`;

const s3Client = new S3Client({ region });
console.log("Uploading deployment_package.zip to S3...");
await s3Client.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: `${agentName}/deployment_package.zip`,
    Body: readFileSync("deployment_package.zip"),
    ExpectedBucketOwner: accountId,
}));
console.log("Upload completed successfully!");

const controlClient = new BedrockAgentCoreControlClient({ region });
const response = await controlClient.send(new UpdateAgentRuntimeCommand({
    agentRuntimeId: "<your-agent-runtime-id>",
    agentRuntimeArtifact: {
        codeConfiguration: {
            code: {
                s3: {
                    bucket: bucketName,
                    prefix: `${agentName}/deployment_package.zip`,
                },
            },
            runtime: "NODE_22",
            entryPoint: ["dist/app.js"],
        },
    },
    networkConfiguration: { networkMode: "PUBLIC" },
    roleArn: `arn:aws:iam::${accountId}:role/AmazonBedrockAgentCoreSDKRuntime-${region}`,
}));
console.log(`Agent Runtime updated successfully!`);
console.log(`Agent Runtime ARN: ${response.agentRuntimeArn}`);
console.log(`Status: ${response.status}`);
```
To stop the running session before the configurable `IdleRuntimeSessionTimeout` (defaulted at 15 minutes) and save on any potential runaway costs, use the following code:

```python
import {
    BedrockAgentCoreClient,
    StopRuntimeSessionCommand,
} from "@aws-sdk/client-bedrock-agentcore";

const region = "us-west-2";
const dataClient = new BedrockAgentCoreClient({ region });
const response = await dataClient.send(new StopRuntimeSessionCommand({
    agentRuntimeArn: "arn:aws:bedrock-agentcore:us-west-2:<account-id>:runtime/<agent-runtime-id>",
    runtimeSessionId: "<your-session-id>",
    qualifier: "DEFAULT",
}));
console.log("Session stopped successfully!");
```
Following TypeScript code will delete an Amazon Bedrock AgentCore runtime and the .zip archive file in S3.

```python
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import {
    BedrockAgentCoreControlClient,
    DeleteAgentRuntimeCommand,
} from "@aws-sdk/client-bedrock-agentcore-control";

const accountId = "your-aws-account-id";
const agentName = "nodejs_agent";
const region = "us-west-2";
const bucketName = `bedrock-agentcore-code-${accountId}-${region}`;

const controlClient = new BedrockAgentCoreControlClient({ region });
console.log("Deleting Agent from Amazon Bedrock AgentCore Runtime!");
const response = await controlClient.send(new DeleteAgentRuntimeCommand({
    agentRuntimeId: "<your-agent-runtime-id>",
}));
console.log(`Agent Runtime deleted successfully!`);
console.log(`Status: ${response.status}`);

const s3Client = new S3Client({ region });
console.log("Deleting deployment archive from S3...");
await s3Client.send(new DeleteObjectCommand({
    Bucket: bucketName,
    Key: `${agentName}/deployment_package.zip`,
    ExpectedBucketOwner: accountId,
}));
console.log("Archive deleted successfully from S3!");
```
## Node.js-specific concepts for direct code deployment

Learn about Node.js-specific concepts when using direct code deployment with Amazon Bedrock AgentCore Runtime.

###### Topics


AgentCore Runtime for Node.js only accepts `.js` entry points. TypeScript files (`.ts`) are not accepted directly — you must transpile them to JavaScript before packaging. We recommend using [esbuild](<https://esbuild.github.io/>) to transpile and bundle in a single step. Add esbuild as a development dependency with `npm install -D esbuild` .

Entry points can be in subdirectories. For example, `src/app.js` or `dist/index.js` are valid entry points. Node.js module resolution walks up the directory tree from the entry point’s location, so dependencies in `node_modules/` at the root of your ZIP are found automatically — no `NODE_PATH` configuration is needed.

When you specify a subdirectory entry point, ensure the path in your `entryPoint` configuration matches the path within the ZIP file.

There are two approaches to packaging dependencies for Node.js agents:

**Vendored dependencies (simplest):**

Include `node_modules/` directly in your ZIP alongside your entry point:

```bash
npm install --production
zip -r my-agent.zip app.js node_modules/ package.json
```
This produces a ZIP with the following structure:

```text
my-agent.zip
├── app.js
├── package.json
└── node_modules/
```
**Bundled with esbuild (smallest ZIP):**

Use [esbuild](<https://esbuild.github.io/>) to bundle all dependencies into a single file:

```bash
npx esbuild app.js --bundle --platform=node --target=node22 --outfile=bundle.js
zip my-agent.zip bundle.js
```
This produces a minimal ZIP:

```text
my-agent.zip
└── bundle.js
```
Both approaches work. Bundled deployments are typically under 10 MB and deploy faster. Vendored deployments are simpler and don’t require a build step but can be larger.

AgentCore Runtime only supports the **arm64** instruction set architecture. If your agent uses npm packages that include native modules (compiled `.node` or `.so` files), those binaries must be compiled for Linux arm64.

AgentCore Runtime validates the architecture of all `.node` and `.so` files in your deployment package by reading their ELF headers. If any binary is compiled for a different architecture (such as x86_64 or macOS), your agent creation will fail with status `CREATE_FAILED` .

To install arm64-compatible native modules:

  * Install dependencies on an arm64 machine (such as an AWS Graviton-based Amazon EC2 instance)

  * Use npm’s `--arch` and `--platform` flags:

```bash
npm install --arch=arm64 --platform=linux
```
  * Use esbuild to bundle your code if the native module can be avoided at runtime


Most popular npm packages (Express, Axios, Fastify, Hono, ws) are pure JavaScript and do not contain native modules.

AgentCore Runtime does not run TypeScript files directly. You must compile your TypeScript source code to JavaScript before deploying. This is the same pattern used by AWS Lambda.

**Using the TypeScript compiler (tsc):**

```bash
npm install -g typescript
npx tsc --init --target ES2022 --module commonjs --outDir ./dist
npx tsc
```
Then package the compiled output:

```bash
cd dist
zip -r ../deployment_package.zip .
```
When creating the agent, set the entry point to the compiled `.js` file (for example, `app.js` or `dist/app.js` depending on your ZIP structure).

**Using esbuild (recommended for simpler packaging):**

```bash
npx esbuild app.ts --bundle --platform=node --target=node22 --outfile=app.js
zip deployment_package.zip app.js
```
esbuild compiles TypeScript and bundles dependencies in a single step, producing a small, self-contained `.js` file.

If your `package.json` includes an `engines.node` field, AgentCore Runtime validates that the specified range is compatible with the Node.js version you selected (for example, Node.js 22 when using the `NODE_22` runtime). If the range excludes that version, your agent creation will fail with status `CREATE_FAILED` .

For example, the following `engines` declarations are compatible with Node.js 22:

```json
{ "engines": { "node": ">=18" } }
{ "engines": { "node": ">=14 <18 || >=20" } }
{ "engines": { "node": "22" } }
```
The following declarations are incompatible and will cause agent creation to fail:

```json
{ "engines": { "node": "<18" } }
{ "engines": { "node": ">=14 <18" } }
```
AgentCore Runtime also checks the `engines.node` field for common dependencies in your `node_modules/` . If any of these declare a Node.js version range that excludes the target runtime version, agent creation will fail.

If you encounter an `engines.node` incompatibility, update the package to a version that supports your target Node.js version or remove the `engines` field from your `package.json` . For supported Node.js versions, see [Supported language runtimes](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-code-deploy-supported-runtimes.html>).

