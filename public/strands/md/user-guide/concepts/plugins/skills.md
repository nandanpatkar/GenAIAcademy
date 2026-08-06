Skills give your agent on-demand access to specialized instructions without bloating the system prompt. Instead of front-loading every possible instruction into a single prompt, you define modular skill packages that the agent discovers and activates only when relevant.

The `AgentSkills` plugin follows the [Agent Skills specification](https://agentskills.io/specification) and uses progressive disclosure: lightweight metadata (name and description) is injected into the system prompt, and full instructions are loaded on-demand when the agent activates a skill through a tool call. This keeps the context window lean while giving the agent access to deep, specialized knowledge.

## What are skills?

As agents take on more complex tasks, their system prompts grow. A single agent handling PDF processing, data analysis, code review, and email drafting can end up with a massive prompt containing instructions for every capability. This leads to several problems:

-   **Context window bloat** — Large prompts consume tokens that could be used for reasoning and conversation
-   **Instruction confusion** — Models struggle to follow dozens of unrelated instructions packed into one prompt
-   **Maintenance burden** — Monolithic prompts are hard to update, version, and share across teams

Skills solve this by breaking instructions into self-contained packages. The agent sees a menu of available skills and loads the full instructions only when it needs them — similar to how a developer opens a reference manual only when working on a specific task.

## How skills work

The `AgentSkills` plugin operates in three phases:

```mermaid
sequenceDiagram
    participant D as Developer
    participant P as AgentSkills Plugin
    participant A as Agent
    participant S as Skills Tool

    D->>P: AgentSkills(skills=["./skills/pdf-processing"])
    P->>P: Load skill metadata (name + description)
    D->>A: Agent(plugins=[plugin])
    P->>A: Inject metadata XML into system prompt

    Note over A: Agent sees available skills<br/>in system prompt

    A->>S: skills(skill_name="pdf-processing")
    S->>A: Return full instructions + resource listing
    Note over A: Agent follows skill instructions
```

1.  **Discovery** — On initialization, the plugin reads skill metadata (name and description) and injects it as an XML block into the agent’s system prompt. The agent can see what skills are available without loading their full instructions.
    
2.  **Activation** — When the agent determines it needs a skill, it calls the `skills` tool with the skill name. The tool returns the complete instructions, metadata, and a listing of any available resource files.
    
3.  **Execution** — The agent follows the loaded instructions. If the skill includes resource files (scripts, reference documents, assets), the agent can access them through whatever tools you’ve provided.
    

The injected system prompt metadata looks like this:

```xml
<available_skills>
<skill>
<name>pdf-processing</name>
<description>Extract text and tables from PDF files.</description>
<location>/path/to/pdf-processing/SKILL.md</location>
</skill>
</available_skills>
```

This XML block is refreshed before each invocation, so changes to available skills (through `set_available_skills``setAvailableSkills`) take effect immediately. Activated skills are tracked in [agent state](lc:user-guide/concepts/agents/state) for session persistence.

## Usage

The `AgentSkills` plugin accepts skill sources in several forms — filesystem paths, parent directories, HTTPS URLs, or programmatic `Skill` instances. In Python you can pass a single source or a list; in TypeScript the `skills` parameter is always an array.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent, AgentSkills, Skill\n\n# Single skill directory \u2014 no list needed\nplugin = AgentSkills(skills=\"./skills/pdf-processing\")\n\n# Parent directory \u2014 loads all child directories containing SKILL.md\nplugin = AgentSkills(skills=\"./skills/\")\n\n# Mixed sources\nplugin = AgentSkills(skills=[\n    \"./skills/pdf-processing\",     # Single skill directory\n    \"./skills/\",                   # Parent directory (loads all children)\n    Skill(                         # Programmatic skill\n        name=\"custom-greeting\",\n        description=\"Generate custom greetings\",\n        instructions=\"Always greet the user by name with enthusiasm.\",\n    ),\n])\n\nagent = Agent(plugins=[plugin])\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { AgentSkills, Skill } from '@strands-agents/sdk/vended-plugins/skills'\n\n// Single skill directory\nconst plugin = new AgentSkills({\n  skills: ['./skills/pdf-processing'],\n})\n\n// Parent directory \u2014 loads all child directories\n// containing SKILL.md\nconst pluginFromDir = new AgentSkills({\n  skills: ['./skills/'],\n})\n\n// Mixed sources\nconst pluginMixed = new AgentSkills({\n  skills: [\n    './skills/pdf-processing',\n    './skills/',\n    new Skill({\n      name: 'custom-greeting',\n      description: 'Generate custom greetings',\n      instructions: 'Always greet the user by name with enthusiasm.',\n    }),\n  ],\n})\n\nconst agent = new Agent({\n  model,\n  plugins: [pluginMixed],\n})\n```"
 }
]
```

### Providing tools for resource access

The `AgentSkills` plugin handles only skill discovery and activation. It does not bundle tools for reading files or executing scripts. This is deliberate — it keeps the plugin decoupled from any assumptions about where skills live or how resources are accessed.

When a skill is activated, the tool response includes a listing of available resource files (from `scripts/`, `references/`, and `assets/` subdirectories), but to actually read those files or run scripts, you provide your own tools. This gives you full control over what the agent can access.

```sa-tabs
[
 {
  "label": "Python",
  "body": "For filesystem-based skills, `file_read` and `shell` from `strands-agents-tools` are the easiest way to get started:\n\n```python\nfrom strands import Agent, AgentSkills\nfrom strands_tools import file_read, shell\n\nplugin = AgentSkills(skills=\"./skills/\")\n\nagent = Agent(\n    plugins=[plugin],\n    tools=[file_read, shell],\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "For filesystem-based skills, the vended `bash` and `fileEditor` tools are the easiest way to get started:\n\n```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { AgentSkills } from '@strands-agents/sdk/vended-plugins/skills'\nimport { bash } from '@strands-agents/sdk/vended-tools/bash'\nimport { fileEditor } from '@strands-agents/sdk/vended-tools/file-editor'\n\nconst plugin = new AgentSkills({\n  skills: ['./skills/'],\n})\n\nconst agent = new Agent({\n  model,\n  plugins: [plugin],\n  tools: [bash, fileEditor],\n})\n```"
 }
]
```

You can also use other tools depending on your environment. For example, an HTTP request tool for skills with remote resources, or a code interpreter tool for executing scripts in a sandboxed environment. Choose tools that match your skill’s resource access patterns and your security requirements.

### Programmatic skill creation

Use the `Skill` class to create skills in code without filesystem directories:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Skill\n\n# Create directly\nskill = Skill(\n    name=\"code-review\",\n    description=\"Review code for best practices and bugs\",\n    instructions=\"Review the provided code. Check for...\",\n)\n\n# Parse from SKILL.md content\nskill = Skill.from_content(\"\"\"---\nname: code-review\ndescription: Review code for best practices and bugs\n---\nReview the provided code. Check for...\n\"\"\")\n\n# Load from a specific directory\nskill = Skill.from_file(\"./skills/code-review\")\n\n# Load all skills from a parent directory\nskills = Skill.from_directory(\"./skills/\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Skill } from '@strands-agents/sdk/vended-plugins/skills'\n\n// Create directly\nconst skill = new Skill({\n  name: 'code-review',\n  description: 'Review code for best practices and bugs',\n  instructions: 'Review the provided code. Check for...',\n})\n\n// Parse from SKILL.md content\nconst parsed = Skill.fromContent(\n  '---\\n' +\n    'name: code-review\\n' +\n    'description: Review code for best practices\\n' +\n    '---\\n' +\n    'Review the provided code. Check for...\\n'\n)\n\n// Load from a specific directory\nconst loaded = Skill.fromFile('./skills/code-review')\n\n// Load all skills from a parent directory\nconst skills = Skill.fromDirectory('./skills/')\n```"
 }
]
```

### Managing skills at runtime

You can add, replace, or inspect skills after the plugin is created. Changes take effect on the next agent invocation because the plugin refreshes the system prompt XML before each call.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent, AgentSkills, Skill\n\nplugin = AgentSkills(skills=\"./skills/pdf-processing\")\nagent = Agent(plugins=[plugin])\n\n# View available skills\nfor skill in plugin.get_available_skills():\n    print(f\"{skill.name}: {skill.description}\")\n\n# Add a new skill at runtime\nnew_skill = Skill(\n    name=\"summarize\",\n    description=\"Summarize long documents\",\n    instructions=\"Read the document and produce a concise summary...\",\n)\nplugin.set_available_skills(\n    plugin.get_available_skills() + [new_skill]\n)\n\n# Replace all skills\nplugin.set_available_skills([\"./skills/new-set/\"])\n\n# Check which skills the agent has activated\nactivated = plugin.get_activated_skills(agent)\nprint(f\"Activated skills: {activated}\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { AgentSkills, Skill } from '@strands-agents/sdk/vended-plugins/skills'\n\nconst plugin = new AgentSkills({\n  skills: ['./skills/pdf-processing'],\n})\nconst agent = new Agent({ model, plugins: [plugin] })\n\n// View available skills\nconst available = await plugin.getAvailableSkills()\nfor (const skill of available) {\n  console.log(`${skill.name}: ${skill.description}`)\n}\n\n// Add a new skill at runtime\nconst newSkill = new Skill({\n  name: 'summarize',\n  description: 'Summarize long documents',\n  instructions: 'Read the document and produce a concise summary...',\n})\nplugin.setAvailableSkills([...available, newSkill])\n\n// Replace all skills\nplugin.setAvailableSkills(['./skills/new-set/'])\n\n// Check which skills the agent has activated\nconst activated = plugin.getActivatedSkills(agent)\nconsole.log(`Activated skills: ${activated}`)\n```"
 }
]
```

## SKILL.md format

Skills follow the [Agent Skills specification](https://agentskills.io/specification). A skill is a directory containing a `SKILL.md` file with YAML frontmatter and markdown instructions. See the specification for full details on authoring skills.

```markdown
---
name: pdf-processing
description: Extract text and tables from PDF files
allowed-tools: file_read shell
---
# PDF processing

You are a PDF processing expert. When asked to extract content from a PDF:

1. Use `shell` to run the extraction script at `scripts/extract.py`
2. Use `file_read` to review the output
3. Summarize the extracted content for the user
```

The frontmatter fields are as follows.

| Field | Required | Description |
| --- | --- | --- |
| `name` | Yes | Unique identifier. Lowercase alphanumeric and hyphens, 1–64 characters. |
| `description` | Yes | What the skill does. This text appears in the system prompt. |
| `allowed-tools` | No | Space-delimited list of tool names the skill uses. |
| `metadata` | No | Additional key-value pairs for custom data. |
| `license` | No | License identifier (for example, `Apache-2.0`). |
| `compatibility` | No | Compatibility information string. |

> [!NOTE] `allowed-tools` behavior
>
> The `allowed-tools` field is currently informational. When a skill is activated, the listed tool names are included in the instructions returned to the agent, but tool access is not enforced or restricted at runtime. This field is still experimental in the Agent Skills specification.

> [!NOTE] Name validation
>
> Skill names must match the parent directory name. By default, validation issues produce warnings rather than errors. Pass `strict=True``strict: true` to raise exceptions instead.

### Resource directories

Skills can include resource files organized in three standard subdirectories:

```plaintext
my-skill/
├── SKILL.md
├── scripts/       # Executable scripts the agent can run
│   └── process.py
├── references/    # Reference documents and guides
│   └── API.md
└── assets/        # Static files (templates, configs, data)
    └── template.json
```

When the agent activates a skill, the tool response includes a listing of all resource files found in these directories. The agent can then use the tools you’ve provided to access them.

## Configuration

The `AgentSkills` constructor accepts the following parameters.

```sa-tabs
[
 {
  "label": "Python",
  "body": "| Parameter | Type | Default | Description |\n| --- | --- | --- | --- |\n| `skills` | `SkillSources` | Required | One or more skill sources (paths, HTTPS URLs, `Skill` instances, or a mix). Accepts a single value or a list. |\n| `state_key` | `str` | `\"agent_skills\"` | Key for storing plugin state in `agent.state`. |\n| `max_resource_files` | `int` | `20` | Maximum number of resource files listed in skill activation responses. |\n| `strict` | `bool` | `False` | If `True`, raise exceptions on validation issues instead of logging warnings. |"
 },
 {
  "label": "TypeScript",
  "body": "| Parameter | Type | Default | Description |\n| --- | --- | --- | --- |\n| `skills` | `SkillSource[]` | Required | Array of skill sources (paths, `Skill` instances, or HTTPS URLs). |\n| `stateKey` | `string` | `'agent_skills'` | Key for storing plugin state in `agent.appState`. |\n| `maxResourceFiles` | `number` | `20` | Maximum number of resource files listed in skill activation responses. |\n| `strict` | `boolean` | `false` | If `true`, throw on validation issues instead of logging warnings. |"
 }
]
```

Activated skills are tracked in [agent state](lc:user-guide/concepts/agents/state) under the configured state key. This means activated skills persist across invocations within the same session and can be serialized for [session management](lc:user-guide/concepts/agents/session-management).

## Comparison with other approaches

Skills work best when your agent needs to handle **multiple specialized domains** but doesn’t need all instructions loaded at once. Consider the following comparison.

| Approach | Best for | Trade-off |
| --- | --- | --- |
| System prompt | Small, always-relevant instructions | Grows unwieldy with many capabilities |
| [Steering](lc:user-guide/concepts/plugins/steering) | Dynamic, context-aware guidance and validation | More complex to set up |
| Skills | Modular, domain-specific instruction sets | Requires a tool call to activate |
| Multi-agent | Fundamentally different roles or models | Higher complexity and latency |

Use skills when you want a single agent that can handle a wide range of tasks by loading the right instructions at the right time, without the overhead of a multi-agent architecture.

## Related topics

-   [Plugins](lc:user-guide/concepts/plugins) — The plugin system that powers skills
-   [Steering](lc:user-guide/concepts/plugins/steering) — Context-aware guidance for complex tasks
-   [Agent state](lc:user-guide/concepts/agents/state) — How activated skills are persisted
-   [Session management](lc:user-guide/concepts/agents/session-management) — Persist skills across sessions
-   [Agent Skills specification](https://agentskills.io/specification) — The open specification skills are built on

## Related pages

- [Context Injector](lc:user-guide/concepts/plugins/context-injector) (1 shared tag)
- [Context Management](lc:user-guide/concepts/context-management) (1 shared tag)
- [Instruction Following Evaluator](lc:user-guide/evals-sdk/evaluators/instruction_following_evaluator) (1 shared tag)
- [Prompt Engineering](lc:user-guide/safety-security/prompt-engineering) (1 shared tag)
- [Prompts](lc:user-guide/concepts/agents/prompts) (1 shared tag)
- [Context Offloader](lc:user-guide/concepts/plugins/context-offloader) (1 shared tag)
- [Conversation Management](lc:user-guide/concepts/agents/conversation-management) (1 shared tag)
- [Steering (Plugins)](lc:user-guide/concepts/plugins/steering) (1 shared tag)
- [GoalLoop](lc:user-guide/concepts/plugins/goal-loop) (1 shared tag)
- [Agent Configuration](lc:user-guide/concepts/experimental/agent-config) (1 shared tag)


## Implementation

### Python

- [harness-sdk/strands-py/src/strands/vended_plugins/skills/agent_skills.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/vended_plugins/skills/agent_skills.py)
- [harness-sdk/strands-py/src/strands/vended_plugins/skills/skill.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/vended_plugins/skills/skill.py)

### TypeScript

- [harness-sdk/strands-ts/src/vended-plugins/skills/agent-skills.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/vended-plugins/skills/agent-skills.ts)
- [harness-sdk/strands-ts/src/vended-plugins/skills/skill.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/vended-plugins/skills/skill.ts)
