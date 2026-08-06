AgentSkills plugin for integrating Agent Skills into Strands agents.

This module provides the AgentSkills class that extends the Plugin base class to add Agent Skills support. The plugin registers a tool for activating skills, and injects skill metadata into the system prompt.

Filesystem skill sources are loaded through the agent’s sandbox (host or container) at `init_agent` time, not at construction, so each agent sees the skills present on its own filesystem. Skill instances and `https://` URLs are sandbox-independent and resolve eagerly at construction.

:meth:`Skill.from_url` is synchronous, so URLs resolve at construction and no readiness barrier is needed. The observable effect is benign: URL skills are

#### SkillSource

A single skill source: path string, Path object, or Skill instance.

#### SkillSources

One or more skill sources.

## AgentSkills

```python
class AgentSkills(Plugin)
```

Defined in: [src/strands/vended\_plugins/skills/agent\_skills.py:74](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/vended_plugins/skills/agent_skills.py#L74)

Plugin that integrates Agent Skills into a Strands agent.

The AgentSkills plugin extends the Plugin base class and provides:

1.  A `skills` tool that allows the agent to activate skills on demand
2.  System prompt injection of available skill metadata before each invocation
3.  Session persistence of active skill state via `agent.state`

Skills can be provided as filesystem paths (to individual skill directories or parent directories containing multiple skills), `https://` URLs pointing to raw SKILL.md content, or as pre-built `Skill` instances.

Filesystem paths are read through the agent’s sandbox at `init_agent` time, so each agent loads the skills present on its own filesystem (host or container). Skill instances and URLs are sandbox-independent and resolve at construction. As a result, `get_available_skills` returns filesystem skills only when passed the agent they were loaded for.

**Example**:

```python
from strands import Agent
from strands.vended_plugins.skills import Skill, AgentSkills

# Load from filesystem
plugin = AgentSkills(skills=["./skills/pdf-processing", "./skills/"])

# Or provide Skill instances directly
skill = Skill(name="my-skill", description="A custom skill", instructions="Do the thing")
plugin = AgentSkills(skills=[skill])

agent = Agent(plugins=[plugin])
```

#### \_\_init\_\_

```python
def __init__(skills: SkillSources,
             state_key: str = _DEFAULT_STATE_KEY,
             max_resource_files: int = _DEFAULT_MAX_RESOURCE_FILES,
             strict: bool = False) -> None
```

Defined in: [src/strands/vended\_plugins/skills/agent\_skills.py:111](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/vended_plugins/skills/agent_skills.py#L111)

Initialize the AgentSkills plugin.

**Arguments**:

-   `skills` - One or more skill sources. Can be a single value or a list. Each element can be:
    
    -   A `str` or `Path` to a skill directory (containing SKILL.md)
    -   A `str` or `Path` to a parent directory (containing skill subdirectories)
    -   A `Skill` dataclass instance
    -   An `https://` URL pointing directly to raw SKILL.md content
-   `state_key` - Key used to store plugin state in `agent.state`.
    
-   `max_resource_files` - Maximum number of resource files to list in skill responses.
    
-   `strict` - If True, raise on skill validation issues. If False (default), warn and load anyway.
    

#### init\_agent

```python
async def init_agent(agent: Agent) -> None
```

Defined in: [src/strands/vended\_plugins/skills/agent\_skills.py:144](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/vended_plugins/skills/agent_skills.py#L144)

Initialize the plugin with an agent instance.

Loads any deferred filesystem skill paths through the agent’s sandbox, building the agent’s full skill set. Decorated hooks and tools are auto-registered by the plugin registry.

**Arguments**:

-   `agent` - The agent instance to extend with skills support.

#### skills

```python
@tool(context=True)
async def skills(skill_name: str, tool_context: ToolContext) -> str
```

Defined in: [src/strands/vended\_plugins/skills/agent\_skills.py:161](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/vended_plugins/skills/agent_skills.py#L161)

Activate a skill to load its full instructions.

Use this tool to load the complete instructions for a skill listed in the available\_skills section of your system prompt.

**Arguments**:

-   `skill_name` - Name of the skill to activate.
-   `tool_context` - Injected by the framework. Not user-facing.

#### get\_available\_skills

```python
def get_available_skills(agent: Agent | None = None) -> list[Skill]
```

Defined in: [src/strands/vended\_plugins/skills/agent\_skills.py:245](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/vended_plugins/skills/agent_skills.py#L245)

Get the list of available skills.

**Arguments**:

-   `agent` - When provided, returns that agent’s full skill set (base skills plus filesystem skills loaded from its sandbox). When omitted, returns only the sandbox-independent base skills (Skill instances and URLs); filesystem skills are excluded because they are loaded per-agent at `init_agent` time.

**Returns**:

A copy of the resolved skills list.

#### set\_available\_skills

```python
def set_available_skills(skills: SkillSources) -> None
```

Defined in: [src/strands/vended\_plugins/skills/agent\_skills.py:261](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/vended_plugins/skills/agent_skills.py#L261)

Set the available skills, replacing any existing ones.

Each element can be a `Skill` instance, a `str` or `Path` to a skill directory (containing SKILL.md), a `str` or `Path` to a parent directory containing skill subdirectories, or an `https://` URL pointing directly to raw SKILL.md content.

Filesystem paths are re-loaded per-agent on the next invocation. Note: this does not persist state or deactivate skills on any agent. Active skill state is managed per-agent and will be reconciled on the next tool call or invocation.

**Arguments**:

-   `skills` - One or more skill sources to resolve and set.

#### get\_activated\_skills

```python
def get_activated_skills(agent: Agent) -> list[str]
```

Defined in: [src/strands/vended\_plugins/skills/agent\_skills.py:563](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/vended_plugins/skills/agent_skills.py#L563)

Get the list of skills activated by this agent.

Returns skill names in activation order (most recent last).

**Arguments**:

-   `agent` - The agent to query.

**Returns**:

List of activated skill names.
