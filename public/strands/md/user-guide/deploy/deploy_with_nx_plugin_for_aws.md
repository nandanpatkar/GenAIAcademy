[Nx](https://nx.dev/) is a build system and monorepo tool for managing multi-project workspaces. The [Nx Plugin for AWS](https://awslabs.github.io/nx-plugin-for-aws/) extends Nx with generators that scaffold Strands agents, APIs, React websites, MCP servers, and more with infrastructure as code, packaging, and deployment configuration out of the box. It supports both Python and TypeScript, with a choice of [AWS CDK](https://docs.aws.amazon.com/cdk/) or [Terraform](https://developer.hashicorp.com/terraform) for infrastructure management.

Using the Nx Plugin for AWS means you don’t need to manually configure Dockerfiles, infrastructure definitions, or deployment pipelines — the generators handle this for you, but give you flexibility to modify the generated code to suit your needs.

## Prerequisites

-   [Node.js](https://nodejs.org/) (v22 or later)
-   A package manager: [pnpm](https://pnpm.io/), [yarn](https://yarnpkg.com/), [npm](https://www.npmjs.com/), or [bun](https://bun.sh/)
-   [UV](https://docs.astral.sh/uv/) (for Python agents)
-   [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) configured with credentials
-   [Terraform CLI](https://developer.hashicorp.com/terraform/install) (if using Terraform as your IaC provider)

Note

> [!NOTE]
>
> The examples below use [pnpm](https://pnpm.io/), but npm, yarn, and bun are also supported. See the [Quick Start Guide](https://awslabs.github.io/nx-plugin-for-aws/en/get_started/quick-start/) for commands using other package managers.

## Step 1: Create an Nx Workspace

Create a new Nx workspace using the `@aws/nx-plugin` preset:

```bash
pnpm create @aws/nx-workspace my-agent-project
```

You will be prompted to choose an infrastructure as code (IaC) provider — either **CDK** or **Terraform**. This choice is the default for all infrastructure generated within the workspace. See the [Quick Start Guide](https://awslabs.github.io/nx-plugin-for-aws/en/get_started/quick-start/) for more details.

## Step 2: Add a Strands Agent

```sa-tabs
[
 {
  "label": "Python",
  "body": "First, generate a Python project to host your agent:\n\n```bash\npnpm nx g @aws/nx-plugin:py#project\n```\n\nThen add a Strands agent to the project:\n\n```bash\npnpm nx g @aws/nx-plugin:py#agent\n```\n\nFollow the prompts to select your project, agent name, authentication method, and compute type. For full details on the generator options and output, see the [Python Strands Agent guide](https://awslabs.github.io/nx-plugin-for-aws/en/guides/py-agent/)."
 },
 {
  "label": "TypeScript",
  "body": "First, generate a TypeScript project to host your agent:\n\n```bash\npnpm nx g @aws/nx-plugin:ts#project\n```\n\nThen add a Strands agent to the project:\n\n```bash\npnpm nx g @aws/nx-plugin:ts#agent\n```\n\nFollow the prompts to select your project, agent name, authentication method, and compute type. For full details on the generator options and output, see the [TypeScript Strands Agent guide](https://awslabs.github.io/nx-plugin-for-aws/en/guides/ts-agent/)."
 }
]
```

The generator scaffolds your agent code, infrastructure definitions, a Dockerfile, and deployment configuration targeting [Amazon Bedrock AgentCore Runtime](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/).

## Step 3: Add Infrastructure

Generate an infrastructure project for your chosen IaC provider:

```sa-tabs
[
 {
  "label": "CDK",
  "body": "```bash\npnpm nx g @aws/nx-plugin:ts#infra --name infra\n```\n\nThen open `packages/infra/src/stacks/application-stack.ts` and instantiate the generated construct for your agent:\n\n```typescript\nimport { Stack, StackProps } from 'aws-cdk-lib';\nimport { MyAgent } from ':my-agent-project/common-constructs';\nimport { Construct } from 'constructs';\n\nexport class ApplicationStack extends Stack {\n  constructor(scope: Construct, id: string, props?: StackProps) {\n    super(scope, id, props);\n\n    new MyAgent(this, 'MyAgent');\n  }\n}\n```\n\nReplace `MyAgent` with the construct name generated for your agent (based on the name you chose in Step 2)."
 },
 {
  "label": "Terraform",
  "body": "```bash\npnpm nx g @aws/nx-plugin:terraform#project --name infra\n```\n\nThen open `packages/infra/src/main.tf` and add the generated module for your agent:\n\n```hcl\nmodule \"my_agent\" {\n  source = \"../../common/terraform/src/app/agents/my-agent\"\n}\n```\n\nReplace `my-agent` with the module name generated for your agent (based on the name you chose in Step 2)."
 }
]
```

## Step 4: Build and Deploy

Build all projects in the workspace:

```bash
pnpm build
```

Then deploy:

```bash
pnpm nx deploy infra
```

The Nx Plugin handles containerizing your agent, provisioning the required AWS resources, and deploying to [Amazon Bedrock AgentCore Runtime](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/). Follow the [Quick Start Guide](https://awslabs.github.io/nx-plugin-for-aws/en/get_started/quick-start/) for a full walkthrough of the build and deploy workflow.

> [!TIP] Beyond Agents
>
> The Nx Plugin for AWS can also generate APIs (tRPC, FastAPI, Smithy), React websites, and MCP servers. Use the [connection generator](https://awslabs.github.io/nx-plugin-for-aws/en/guides/connection/) to wire these components together — for example, connecting a React frontend to your Strands agent, or linking an agent to an MCP server. The plugin also supports local development with hot reload via a `nx serve-local` command that spins up all connected components (websites, APIs, agents, MCP servers) locally.
>
> The Nx Plugin for AWS also ships with an [MCP server](https://awslabs.github.io/nx-plugin-for-aws/en/get_started/building-with-ai/) that you can use with your favourite AI assistant to accelerate scaffolding and development.

## Additional Resources

-   [Nx Plugin for AWS Documentation](https://awslabs.github.io/nx-plugin-for-aws/)
-   [Python Strands Agent Guide](https://awslabs.github.io/nx-plugin-for-aws/en/guides/py-agent/)
-   [TypeScript Strands Agent Guide](https://awslabs.github.io/nx-plugin-for-aws/en/guides/ts-agent/)
-   [Nx Plugin for AWS Quick Start](https://awslabs.github.io/nx-plugin-for-aws/en/get_started/quick-start/)

## Related pages

- [Deploy to Kubernetes](lc:user-guide/deploy/deploy_to_kubernetes) (1 shared tag)
- [Deploy to Terraform](lc:user-guide/deploy/deploy_to_terraform) (1 shared tag)
- [Deploying Strands Agents to Docker](lc:user-guide/deploy/deploy_to_docker) (1 shared tag)
- [Python Deployment to Docker](lc:user-guide/deploy/deploy_to_docker/python) (1 shared tag)
- [TypeScript Deployment to Docker](https://strandsagents.com/docs/user-guide/deploy/deploy_to_docker/typescript/) (1 shared tag)
- [Deploying Strands Agents SDK Agents to Amazon EC2](lc:user-guide/deploy/deploy_to_amazon_ec2) (1 shared tag)
- [Deploying Strands Agents SDK Agents to Amazon EKS](lc:user-guide/deploy/deploy_to_amazon_eks) (1 shared tag)
- [Deploying Strands Agents SDK Agents to AWS App Runner](lc:user-guide/deploy/deploy_to_aws_apprunner) (1 shared tag)
- [Deploying Strands Agents SDK Agents to AWS Fargate](lc:user-guide/deploy/deploy_to_aws_fargate) (1 shared tag)
- [Deploying Strands Agents SDK Agents to AWS Lambda](lc:user-guide/deploy/deploy_to_aws_lambda) (1 shared tag)
