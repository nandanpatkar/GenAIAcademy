Use the LangSmith [Python](lc:langsmith/smith-python-sdk) and [TypeScript](lc:langsmith/smith-js-ts-sdk) SDKs to manage **agent repos** and **skill repos** in the [Context Hub](lc:langsmith/use-the-context-hub) programmatically. [Push](#push-an-agent) new versions from CI, [pull](#pull-an-agent) the latest or a pinned commit at runtime to inject context into your agent, and use additional methods to [check existence](#check-whether-a-repo-exists), [list and search](#list-agents-and-skills) repos, and [delete](#delete-an-agent-or-skill) what you no longer need.


> [!NOTE]
>
> Context Hub methods require `langsmith>=0.7.35` (Python) and `langsmith>=0.5.23` (TypeScript).


## Setup

1. Install packages:

    
    ```lc-tabs
    [
     {
      "label": "pip",
      "lang": "bash",
      "code": "pip install -U langsmith"
     },
     {
      "label": "uv",
      "lang": "bash",
      "code": "uv add langsmith"
     },
     {
      "label": "TypeScript",
      "lang": "bash",
      "code": "yarn add langsmith"
     }
    ]
    ```
    

1. Configure environment variables. If you already have [`LANGSMITH_API_KEY`](lc:langsmith/create-account-api-key) set in your environment, skip this step. Otherwise, create one in **Settings > API Keys > Create API Key** in LangSmith, then set it as an environment variable:

    ```bash
    export LANGSMITH_API_KEY="lsv2_..."
    ```


> [!NOTE]
>
> **Python async:** All methods shown on this page are also available on `AsyncClient` (imported from `langsmith`) with identical signatures—just `await` each call. The TypeScript SDK is async by default; there is no separate async client.


## Push an agent

Create a new agent repo or commit a new version of an existing one. If
the repo doesn't exist yet, it is created with the metadata you provide
(`description`, `readme`, `tags`, `is_public`). If it already exists,
those fields are patched only when explicitly passed.

The method returns a URL pointing to the new commit in the [LangSmith UI](https://smith.langchain.com):

```python Python
from langsmith import Client
from langsmith.schemas import FileEntry

client = Client()

url = client.push_agent(
    "email-assistant",
    files={
        "AGENTS.md": FileEntry(
            content="You are an email triage assistant.",
        ),
        "tools.json": FileEntry(content='{"tools": []}'),
    },
    description="Triages and drafts replies to incoming email.",
    tags=["email", "productivity"],
    is_public=False,
)
print(url)
```

## Push a skill

Identical surface to `push_agent`, but commits to a skill repo. Use
this for reusable capabilities that other agents can depend on:

```python Python
from langsmith import Client
from langsmith.schemas import FileEntry

client = Client()

url = client.push_skill(
    "deep-research",
    files={
        "SKILL.md": FileEntry(content="Conduct deep multi-step research."),
    },
    description="Multi-step web research with citations.",
    tags=["research"],
)
print(url)
```

### Link to other repos

Instead of inlining file content, an entry in `files` can be a link to
another agent or skill repo, which lets you compose contexts without duplicating
content across repos. For example, an agent that delegates to a shared skill.

If you omit `commit_id`, LangSmith links to the latest commit of that repo when you push this commit. If the linked repo updates later, LangSmith propagates that update to parent repos that reference it.

```python Python
from langsmith import Client
from langsmith.schemas import AgentEntry, FileEntry, SkillEntry

client = Client()

url = client.push_agent(
    "email-assistant",
    files={
        "AGENTS.md": FileEntry(content="You are an email triage assistant."),
        # Link to the deep-research skill repo. Omit commit_id to always
        # resolve to the latest version, or pin it for reproducibility.
        "skills/research": SkillEntry(repo_handle="deep-research"),
        # Link to another agent repo.
        "agents/scheduler": AgentEntry(repo_handle="calendar-agent"),
    },
)
print(url)
```

## Push parameters

Both `push_agent` / `pushAgent` and `push_skill` / `pushSkill` accept the following parameters:

| Parameter                          | Type                                        | Description                                                                                  |
| ---------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `identifier`                       | `string`                                    | The repo's identifier.                                                                       |
| `files`                            | `dict[str, Entry \| None]`                  | Map of file path to `Entry`. Pass `None` / `null` to delete a path in this commit.           |
| `parent_commit` / `parentCommit`   | `string` (optional)                         | Parent commit hash prefix for optimistic concurrency. Must be 8–64 characters when provided. If it doesn't match the latest commit, the API returns a 409 conflict. |
| `description`                      | `string` (optional)                         | Repo description. Set on creation or patched on update.                                      |
| `readme`                           | `string` (optional)                         | Repo readme content.                                                                         |
| `tags`                             | `string[]` (optional)                       | Repo tags.                                                                                   |
| `is_public` / `isPublic`           | `boolean` (optional)                        | Whether the repo is publicly discoverable.                                                   |

## Pull an agent

Pull a snapshot of an agent repo. By default the latest commit is returned; pass a commit hash or tag via `version` (or embed it in the identifier as `owner/name:version`) to pull a specific version:


> [!NOTE]
>
> **Identifier formats**: the `identifier` argument accepts three forms:
> - `name`: resolves against the current workspace owner.
> - `owner/name`: fully qualified.
> - `owner/name:version`: pinned to a specific commit hash or tag.
>
> The optional `version` argument overrides any version embedded in the
> identifier. If neither is provided, the latest commit is returned.


```python Python
from langsmith import Client

client = Client()

agent = client.pull_agent("email-assistant")
print(agent.commit_hash)
print(list(agent.files))

# Pull a specific commit.
pinned = client.pull_agent("email-assistant", version="7ca95573")

# Pull a tagged commit (for example, the production tag).
prod = client.pull_agent("email-assistant:production")
```

## Pull a skill

Pull a snapshot of a skill repo. Works identically to `pull_agent` but returns a `SkillContext`:

```python Python
from langsmith import Client

client = Client()

skill = client.pull_skill("deep-research")
print(skill.files["SKILL.md"].content)
```

## Pull parameters

Both `pull_agent` / `pullAgent` and `pull_skill` / `pullSkill` accept the following parameters:

| Parameter    | Type                | Description                                                                       |
| ------------ | ------------------- | --------------------------------------------------------------------------------- |
| `identifier` | `string`            | The repo's identifier. May include an inline version: `owner/name:version`.       |
| `version`    | `string` (optional) | Commit hash or tag to pull. Overrides any version embedded in the identifier.     |

`pull_agent` returns an `AgentContext`; `pull_skill` returns a `SkillContext`.

## Check whether a repo exists

Use these methods to check whether an agent or skill repo exists in your
workspace before pushing or pulling:

```python Python
from langsmith import Client

client = Client()

if client.agent_exists("email-assistant"):
    print("agent already exists")

if not client.skill_exists("deep-research"):
    print("skill not found")
```

## List agents and skills

List repos of either type, with optional filters for visibility, archived state, and a search query:

```python Python
from langsmith import Client

client = Client()

# Python returns a paginated response.
result = client.list_agents(limit=20, query="email")
for repo in result.repos:
    print(repo.repo_handle)

skills = client.list_skills(is_public=True)
```

| Parameter                | Type                  | Description                                                  |
| ------------------------ | --------------------- | ------------------------------------------------------------ |
| `limit`                  | `int` (Python only)   | Maximum number of repos to return per page. Defaults to 100. |
| `offset`                 | `int` (Python only)   | Number of repos to skip. Defaults to 0.                      |
| `is_public` / `isPublic` | `boolean` (optional)  | Filter to only public (or only private) repos.               |
| `is_archived` / `isArchived` | `boolean` (optional) | Filter by archived state. Defaults to `False`.            |
| `query`                  | `string` (optional)   | Search query across repo handle, owner handle, description, and tags. |


> [!NOTE]
>
> Python's `list_agents` / `list_skills` return a paginated response object with explicit
> `limit` and `offset` for manual pagination. TypeScript's `listAgents` / `listSkills`
> return an `AsyncIterableIterator` that handles pagination automatically as you
> consume it.


## Delete an agent or skill


> [!WARNING]
>
> This operation is permanent and cannot be undone. Deleting a repo also
> removes its owned child file repos.


Delete an agent or skill repo from your workspace:

```python Python
from langsmith import Client

client = Client()

client.delete_agent("email-assistant")
client.delete_skill("deep-research")
```
