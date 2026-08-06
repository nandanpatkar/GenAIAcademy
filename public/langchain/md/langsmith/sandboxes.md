Sandboxes are isolated environments that allow agents to safely execute potentially risky operations, like running arbitrary code or interacting with the filesystem, without affecting your main infrastructure.

From the [LangSmith homepage](https://smith.langchain.com), select **Sandboxes** to manage all your sandbox resources.

![Sandboxes overview page](/langchain/images/images/langsmith/sandboxes/sb-overview.png)

## Environment availability

| Environment | Status |
|-------------|--------|
| GCP US (`smith.langchain.com`) | Generally available |
| GCP EU (`eu.smith.langchain.com`) | Generally available |
| GCP APAC (`apac.smith.langchain.com`) | Generally available |
| AWS US (`aws.smith.langchain.com`) | Generally available |

For self-hosted LangSmith deployments, see [Enable Sandboxes on self-hosted deployments](lc:langsmith/deploy-self-hosted-full-platform#enable-sandboxes).

## Get started

### 1. Install the SDK

```lc-tabs
[
 {
  "label": "Python",
  "lang": "bash",
  "code": "# uv\nuv add \"langsmith[sandbox]\"\n\n# pip\npip install \"langsmith[sandbox]\""
 },
 {
  "label": "TypeScript",
  "lang": "bash",
  "code": "npm install langsmith"
 }
]
```

### 2. Set your API key

```bash
export LANGSMITH_API_KEY="<your-api-key>"
```

### 3. Create and run a sandbox

```python Python
from langsmith.sandbox import SandboxClient

client = SandboxClient()

with client.sandbox() as sb:
    result = sb.run("python -c 'print(2 + 2)'")
    print(result.stdout)  # "4\n"
```


> [!TIP]
>
> Prefer the command line? The [Sandbox CLI](lc:langsmith/sandbox-cli) lets you create sandboxes, run commands, and open interactive shells without writing any code.


### 4. Use sandboxes with your agents

To wire sandboxes into agent code, see the Open Source docs:

- **Deep Agents**: [Use `LangSmithSandbox` as a backend](lc:oss/python/integrations/sandboxes/langsmith), covering installation, backend creation, and cleanup.
- **Sandboxes as agent backends**: [Configure any sandbox as the execution backend](lc:oss/python/deepagents/sandboxes) to give your agent `execute` and filesystem tools automatically.
- **LangChain / LangGraph integrations**: Use LangSmith sandboxes as a first-party option, or [connect third-party providers](lc:oss/python/integrations/sandboxes/index) such as AgentCore, Daytona, E2B, Modal, Runloop, and Vercel.

## Resources

### [Snapshots](#)
Build filesystem images from Docker images or capture a running sandbox, then boot sandboxes from them.

### [Service URLs](#)
Access HTTP services running inside sandboxes via authenticated URLs.

### [Auth proxy](#)
Inject credentials into outbound API requests without hardcoding secrets.

### [Mounts](#)
Attach S3 buckets, GCS buckets, and public Git repositories to a sandbox filesystem.

### [Permissions](#)
Control which workspace members can interact with a sandbox after it is created.

### [CLI](#)
Build snapshots, manage sandboxes, open consoles, and tunnel TCP ports from the command line.

### [SDK usage](#)
Create and manage sandboxes programmatically with the Python or TypeScript SDK.

### [Self-hosted setup](#)
Enable Sandboxes on self-hosted LangSmith deployments with Helm or Terraform.

### [Harbor](#)
Run Harbor evaluations and rollouts on LangSmith sandboxes.
