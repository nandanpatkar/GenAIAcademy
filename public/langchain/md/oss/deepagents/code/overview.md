Deep Agents Code (`dcode`) is an open source coding agent built on the [Deep Agents SDK](lc:oss/python/deepagents/quickstart).
It works with any large language model and supports switching providers or models.
Persistent memory carries context across conversations, customizable skills shape behavior, and approval controls gate code execution.

## Get started

Run the following command to install Deep Agents Code and launch an interactive session:

```bash
curl -LsSf https://langch.in/dcode | bash
dcode
```

See the [Quickstart](lc:oss/deepagents/code/quickstart) to add provider credentials, run your first task, and learn interactive mode.

    <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full aspect-video rounded-xl"
        src="/oss/images/deepagents/dcode-small.mp4"
        aria-label="Deep Agents Code terminal demo"
    >
        Your browser does not support the video tag.
    </video>

## Capabilities

    ### [Remote sandboxes](#)
Run agent tools remotely instead of on your local machine.

    ### [Goals and rubrics](#)
Define measurable objectives or grading criteria so the agent can check whether work is done.

    ### [Subagents](#)
Delegate work to task-specific subagents for parallel execution.

    ### [Memory](#)
Store and retrieve information across sessions, including project conventions and learned patterns.

    ### [Context compaction](#)
Summarize older messages and offload originals to storage.

    ### [Human-in-the-loop](#)
Require human approval for sensitive tool operations.

    ### [Skills](#)
Extend agent capabilities with custom expertise and instructions.

    ### [MCP tools](#)
Load external tools from Model Context Protocol servers.

    ### [Tracing](#)
Trace agent operations in LangSmith for observability and debugging.

## Next steps

    ### [Quickstart](#)
Install Deep Agents Code, run your first task, and use interactive or non-interactive modes.

    ### [Configuration](#)
Set up credentials, `config.toml`, environment variables, hooks, and CLI flags.
