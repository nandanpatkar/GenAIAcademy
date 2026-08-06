# Skills - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-skills.html

---

# Skills

[Agent Skills](<https://strandsagents.com/docs/user-guide/concepts/plugins/skills/>) are bundles of markdown and scripts that give the agent domain knowledge on demand. Each skill follows the open [AgentSkills.io](<https://agentskills.io/specification>) standard: a `SKILL.md` file with YAML frontmatter (name, description) and markdown instructions, plus optional `scripts/`, `references/`, and `assets/` directories.

Skills use progressive disclosure: metadata is injected into the system prompt upfront (~100 tokens), and full instructions are loaded on demand via a tool call. This avoids flooding the context window with instructions the agent may not need.

The harness supports four skill sources:

Source | Description | When to use  
---|---|---  
**AWS Skills** |  Pre-built skills for AWS services from the [AWS Agent Toolkit](<https://github.com/aws/agent-toolkit-for-aws/tree/main/skills>). Enable with glob patterns. |  You want ready-made AWS expertise with zero setup.  
**Git (HTTPS)** |  Clone a skill from any public or private Git repository. Supports subdirectories. |  You want to reference skills from GitHub, GitLab, or any git host without uploading to S3.  
**Amazon S3** |  Fetch a skill from a customer-owned S3 bucket using the execution role. |  You want full control over versioning, encryption, and access governance.  
**Path (filesystem)** |  Reference a skill already present on the harness filesystem (baked into the container image or installed via `InvokeAgentRuntimeCommand`). |  The skill is part of your container image or was installed at session start.  
  
Skills are fetched once per session on the first invocation. Within a session, skills persist on disk across multiple invocations. When the VM expires and a new session starts, skills are re-fetched to guarantee freshness.

You can set `skills` as a default on the harness (via `CreateHarness` or `UpdateHarness`), or override per invocation. Invoke-time skills are appended after create-time skills; if both define a skill with the same name, the invoke-time version wins.

###### Note

To add a skill to a harness interactively, run `agentcore` to open the TUI, select **add** , choose **Harness** , advance to **Advanced settings** , and enable **Skills** . The wizard then prompts for the skill source. See the **Interactive** tab under Git and Amazon S3 below for the per-source steps.

## AWS Skills

AWS skills are pre-built skills that enable your agents to interact with AWS services. They are organized hierarchically and selected via glob patterns. View their source on [GitHub](<https://github.com/aws/agent-toolkit-for-aws/tree/main/skills>).

Category | Pattern | Typical skills  
---|---|---  
Core skills |  `core-skills/*` |  EC2, S3, Lambda, DynamoDB, CloudWatch, IAM operations.  
Analytics skills |  `specialized-skills/analytics-skills/*` |  Athena, Glue, QuickSight, data lake operations.  
Operations skills |  `specialized-skills/operations-skills/*` |  Troubleshooting, diagnostics, log analysis.  
Storage skills |  `specialized-skills/storage-skills/*` |  S3, EFS, FSx, Backup operations.  
  
### Enable all AWS skills

###### Example

AWS CLI/boto3
     ```bash
     aws bedrock-agentcore-control create-harness \
       --harness-name "MyHarness" \
       --execution-role-arn "${ROLE_ARN}" \
       --skills '[{"awsSkills": {}}]'
     ```
Or at invoke time:

```text
response = client.invoke_harness(
    harnessArn=HARNESS_ARN,
    runtimeSessionId=SESSION_ID,
    skills=[{"awsSkills": {}}],
    messages=[{"role": "user", "content": [{"text": "List my EC2 instances and their status."}]}],
)
```
### Enable skills by category

Use glob patterns to enable specific skill categories:

###### Example

AWS CLI/boto3
     ```bash
     aws bedrock-agentcore-control create-harness \
       --harness-name "MyHarness" \
       --execution-role-arn "${ROLE_ARN}" \
       --skills '[{"awsSkills": {"paths": ["core-skills/*", "specialized-skills/operations-skills/*"]}}]'
     ```
### Enable a single specific skill

```text
response = client.invoke_harness(
    harnessArn=HARNESS_ARN,
    runtimeSessionId=SESSION_ID,
    skills=[{"awsSkills": {"paths": ["core-skills/aws-cdk"]}}],
    messages=[{"role": "user", "content": [{"text": "Create a CDK stack for a Lambda function."}]}],
)
```
### Combine multiple patterns

```text
skills=[{"awsSkills": {"paths": ["core-skills/aws-cdk", "core-skills/aws-serverless", "specialized-skills/storage-skills/*"]}}]
```
###### Note

  * Paths must be relative (no leading `/` or `..`). Absolute paths and path traversal are rejected.

  * If a glob pattern matches no skills, the invocation fails with a descriptive error.

  * Multiple `awsSkills` entries in the same payload are merged.


## Git (HTTPS) skills

Clone a skill from any public or private Git repository. Supports subdirectories within monorepos using sparse checkout.

###### Example

AWS CLI/boto3
    

Public repository:

```text
response = client.invoke_harness(
    harnessArn=HARNESS_ARN,
    runtimeSessionId=SESSION_ID,
    skills=[
        {"git": {"url": "https://github.com/anthropics/skills", "path": "skills/docx"}},
    ],
    messages=[{"role": "user", "content": [{"text": "Summarize the attached DOCX file."}]}],
)
```
Private repository (requires a personal access token stored in [AgentCore Identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity.html>)):

```text
skills=[
    {
        "git": {
            "url": "https://github.com/my-org/internal-skills",
            "path": "excel",
            "auth": {
                "credentialArn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:token-vault/default/apikeycredentialprovider/my-github-pat"
            },
        }
    }
]
```
AgentCore CLI
    

Attach a skill from a public Git repository with `agentcore add skill`. Use `--git-path` to pull a single skill from a subdirectory:

```bash
agentcore add skill --harness my-harness \
  --git https://github.com/anthropics/skills \
  --git-path skills/docx
agentcore deploy
```
For a private repository, pass `--credential` with the name of an API key credential in your project that holds a personal access token (`--username` is optional, default `oauth2`):

```bash
agentcore add skill --harness my-harness \
  --git https://github.com/my-org/internal-skills \
  --git-path excel \
  --credential my-github-pat
agentcore deploy
```
###### Note

Remove a skill with `agentcore remove skill` using the same source flags. To override skills for a single call without changing the harness, use `agentcore invoke --skills <sources>` (comma-separated paths, `s3://` URIs, or `https://` Git URLs); Git authentication is not supported on the invoke override.

Interactive
    

In the TUI, add a Git skill to a harness through the **add** → **Harness** wizard.

  1. Advance to **Advanced settings** , move to **Skills** , and press **Space** to enable it, then press **Enter** .

![Advanced settings with Skills enabled](/agentcore/images/harness-skills-01-advanced.png)

  2. Select **Git** as the skill source.

![Skill source type: Path, S3, or Git](/agentcore/images/harness-skills-02-source-type.png)

  3. Enter the HTTPS repository URL. The wizard then prompts for an optional subdirectory path, an optional credential for private repositories, and an optional username.

![Enter the Git repository URL](/agentcore/images/harness-skills-05-git-url.png)


Confirm the wizard, then run `agentcore deploy` to apply.

  * `url` (required) - HTTPS URL of the Git repository.

  * `path` (optional) - subdirectory within the repo containing the skill. If omitted, the repository root is used.

  * `auth.credentialArn` (optional) - ARN of an API key credential provider holding a personal access token for private repos.

  * `auth.username` (optional) - git username, defaults to `oauth2`.


Git fetch must complete within 60 seconds. If the repository requires internet egress, ensure your VPC has a NAT gateway (same requirement as remote MCP servers and custom container pulls).

## Amazon S3 skills

Fetch a skill from a customer-owned S3 bucket. Uses the harness execution role credentials.

###### Example

AWS CLI/boto3
     ```text
     response = client.invoke_harness(
         harnessArn=HARNESS_ARN,
         runtimeSessionId=SESSION_ID,
         skills=[
             {"s3": {"uri": "s3://my-skills-bucket/skills/company-style/"}},
         ],
         messages=[{"role": "user", "content": [{"text": "Draft a summary following our style guide."}]}],
     )
     ```
AgentCore CLI
    

Attach a skill from S3 with `agentcore add skill --s3`:

```bash
agentcore add skill --harness my-harness \
  --s3 s3://my-skills-bucket/skills/company-style/
agentcore deploy
```
The execution role needs `s3:GetObject` and `s3:ListBucket` on the bucket. See [Security and access controls](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-security.html>).

Interactive
    

In the TUI, add an S3 skill to a harness through the **add** → **Harness** wizard. Advance to **Advanced settings** , enable **Skills** with **Space** , and choose **S3** as the source (see the Git Interactive tab for those shared steps).

  1. Enter the S3 URI of the skill directory.

![Enter the S3 URI for the skill](/agentcore/images/harness-skills-04-s3-uri.png)


Confirm the wizard, then run `agentcore deploy` to apply.

  * `uri` (required) - S3 URI pointing to the skill directory (e.g., `s3://bucket/prefix/`).

  * The execution role must have `s3:GetObject` and `s3:ListBucket` permissions on the bucket. See [Security and access controls](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-security.html>).

  * Each S3 skill must be 1 GB or smaller.

  * S3 sources work with S3 VPC endpoints (no NAT gateway required).


## Filesystem path skills

Reference a skill already on the harness filesystem - baked into the container image or installed at session start via `InvokeAgentRuntimeCommand`.

###### Example

AWS CLI/boto3
     ```text
     response = client.invoke_harness(
         harnessArn=HARNESS_ARN,
         runtimeSessionId=SESSION_ID,
         skills=[{"path": ".agents/skills/xlsx"}],
         messages=[{"role": "user", "content": [{"text": "Find errors in the Excel files."}]}],
     )
     ```
### Bake into the container image

Include the skill directory in your custom image:

```text
COPY skills/xlsx .agents/skills/xlsx
```
### Install at session start

Use `InvokeAgentRuntimeCommand` before the first agent invocation:

```bash
agentcore invoke --exec --harness my-agent --session-id "$SESSION" \
  "git clone --depth 1 https://github.com/anthropics/skills /tmp/skills && cp -r /tmp/skills/skills/xlsx .agents/skills/xlsx"
```
## Combine multiple skill sources

All four source types can coexist in a single payload:

```text
response = client.invoke_harness(
    harnessArn=HARNESS_ARN,
    runtimeSessionId=SESSION_ID,
    skills=[
        {"awsSkills": {"paths": ["core-skills/aws-cdk"]}},
        {"git": {"url": "https://github.com/anthropics/skills", "path": "skills/docx"}},
        {"s3": {"uri": "s3://my-bucket/skills/company-style/"}},
        {"path": ".agents/skills/xlsx"},
    ],
    messages=[{"role": "user", "content": [{"text": "Help me with this project."}]}],
)
```
## Error handling

All fetch failures fail the invocation with a descriptive error. Skills are never silently skipped.

Failure | Error message  
---|---  
S3 access denied |  `Failed to fetch skill: AccessDeniedException. Ensure execution role has s3:GetObject permission.`  
S3 object not found |  `Skill source not found: s3://…​`  
Git clone fails (network) |  `Failed to clone skill: could not resolve host`  
Git auth denied |  `Failed to clone skill: authentication failed`  
Git path not found in repo |  `Skill path 'x' not found in repository`  
Git timeout (60s) |  `Failed to clone skill: operation timed out after 60s`  
Skill exceeds 1 GB limit |  `Skill exceeds 1GB size limit`  
AWS skill path matches nothing |  `AWS skill path 'x' matched no skills`  
Path traversal (`..`) |  `Invalid AWS skill path: must be a relative path without '..'`  
AWS skills bundle missing |  `AWS Skills are not available in this runtime (missing directory: /opt/amazon/skills)`  
  
### Related topics

  * [Tools](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-tools.html>) \- connect MCP servers, Gateway, Browser, and Code Interpreter

  * [Environment and filesystem](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-environment.html>) \- custom container images and environment configuration

  * [Memory](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-memory.html>) \- persist conversations across sessions

  * [Security and access controls](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-security.html>) \- execution role policies for skill sources

  * [API Documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-get-started.html#api-documentation>)



