The GitHub connector prepares repositories, the GitHub CLI (`gh`), and credentials inside a [managed sandbox](lc:langsmith/managed-deep-agents-deploy#configure-a-sandbox), so an agent can inspect a repository or open a pull request against it. It requires `managed-deepagents>=0.4.0`.


> [!NOTE]
>
> Managed Deep Agents is in **private [beta](lc:langsmith/release-stages)**, available on [LangSmith Cloud](lc:langsmith/cloud) in the US region only. [Join the waitlist](https://www.langchain.com/langsmith-managed-deep-agents-waitlist) to request access.


This connector is separate from the [GitHub channel](lc:langsmith/managed-deep-agents-channels/github), which receives App webhooks, and Connect-with-GitHub under [identity](lc:langsmith/managed-deep-agents-identity).

## Add the connector

Create `connectors/github.py` or `connectors/github.ts`. Export the connector as `connector` in Python or as the module default in TypeScript.

```python connectors/github.py
from managed_deepagents.connectors import github

connector = github.connector(
    repositories=[
        {
            "repo": "acme/api",
            "path": "workspace/api",
            "ref": "main",
            "depth": 1,
            "on_reuse": "fetch",
        }
    ],
)
```

The connector clones each repository when the sandbox is created. When a thread reuses an existing sandbox, `on_reuse` / `onReuse` controls the checkout (see [Configure options](#configure-options)).

## Configure options

| Option (Python / TypeScript) | Default | Purpose |
| --- | --- | --- |
| `repositories` | `[]` | Repository checkouts and their sandbox paths. |
| `install_cli` / `installCLI` | `true` | Install the GitHub CLI in the sandbox. |
| `inject_credentials` / `injectCredentials` | `true` | Expose resolved GitHub credentials to `git` and `gh`. |

Each entry in `repositories` accepts these fields:

| Field (Python / TypeScript) | Default | Purpose |
| --- | --- | --- |
| `repo` | — | Static repository to checkout, as `owner/repo`. |
| `path` | — | Relative sandbox path where the repository appears. Must be relative and unique. |
| `ref` | — | Git ref (branch, tag, or SHA) to checkout. |
| `depth` | — | Shallow clone depth. Must be an integer of `1` or greater. |
| `sparse_paths` / `sparsePaths` | — | Sparse checkout paths, relative to the repository root. |
| `submodules` | `false` | Initialize submodules. |
| `write` | — | Use write credentials instead of read credentials for this checkout. |
| `on_reuse` / `onReuse` | `fetch` | Reuse behavior for an existing checkout: `keep`, `reset`, or `fetch`. |

Set `write` to `true` only on checkouts the agent must push to, since it grants write credentials for the repository. Leave it unset for read-only work.

For private repositories, configure GitHub credentials through [identity](lc:langsmith/managed-deep-agents-identity#custom-downstream-credentials). The runtime resolves the credential, injects it into the sandbox as `GH_TOKEN`, and configures Git credentials for the run. The token is never stored in thread state.

## Test and deploy


Test the project locally with [`mda dev`](lc:langsmith/managed-deep-agents-cli#develop-locally), then deploy it with [`mda deploy`](lc:langsmith/managed-deep-agents-deploy). Open deployment traces in LangSmith to inspect model calls, tool calls, errors, and latency.


The connector runs only when the project declares a managed sandbox; without one, it does not run. After startup, confirm the checkout by asking the agent to list the files at the configured path, and confirm credentials by asking it to run `gh auth status` in the sandbox. For deploy symptoms and fixes, see [Troubleshooting](lc:langsmith/managed-deep-agents-cli#troubleshooting).

## Next steps

  ### [Connectors](#)
Compare connector types.

  ### [GitHub channel](#)
Receive GitHub App webhooks.

  ### [Identity](#)
Scope callers and resolve credentials.

  ### [Configure a sandbox](#)
Configure sandbox scope and lifecycle.
