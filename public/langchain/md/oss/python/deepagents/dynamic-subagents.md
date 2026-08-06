Dynamic subagents let an agent dispatch [subagents](lc:oss/python/deepagents/subagents) from interpreter code. Instead of asking the model to choose one subagent call at a time, the agent can use JavaScript loops, branches, and parallel batches to route work across configured subagents and synthesize the results.

Use this pattern when work spans many independent units, needs multiple perspectives, or benefits from recursive analysis. For general interpreter setup, see [Interpreters](lc:oss/python/deepagents/interpreters).


> [!WARNING]
>
> Dynamic subagents use the interpreter runtime, which is in [**beta**](lc:oss/python/versioning). APIs and lifecycle behavior may change between releases.


> [!NOTE]
>
> Interpreters require `langchain-quickjs>=0.2.0` and Python `>=3.11`.


## Quickstart

Dynamic subagents require [interpreter](lc:oss/python/deepagents/interpreters) middleware. Install and wire up the interpreter first. The built-in [general-purpose subagent](lc:oss/python/deepagents/subagents#default-subagent) handles basic fan-out without extra configuration.


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    subagents=[{\n        \"name\": \"reviewer\",\n        \"description\": \"Reviews code for security issues, citing lines and severity\",\n        \"system_prompt\": \"You are a security-focused code reviewer. Report issues with line numbers and severity.\",\n    }],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    subagents=[{\n        \"name\": \"reviewer\",\n        \"description\": \"Reviews code for security issues, citing lines and severity\",\n        \"system_prompt\": \"You are a security-focused code reviewer. Report issues with line numbers and severity.\",\n    }],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    subagents=[{\n        \"name\": \"reviewer\",\n        \"description\": \"Reviews code for security issues, citing lines and severity\",\n        \"system_prompt\": \"You are a security-focused code reviewer. Report issues with line numbers and severity.\",\n    }],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    subagents=[{\n        \"name\": \"reviewer\",\n        \"description\": \"Reviews code for security issues, citing lines and severity\",\n        \"system_prompt\": \"You are a security-focused code reviewer. Report issues with line numbers and severity.\",\n    }],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    subagents=[{\n        \"name\": \"reviewer\",\n        \"description\": \"Reviews code for security issues, citing lines and severity\",\n        \"system_prompt\": \"You are a security-focused code reviewer. Report issues with line numbers and severity.\",\n    }],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    subagents=[{\n        \"name\": \"reviewer\",\n        \"description\": \"Reviews code for security issues, citing lines and severity\",\n        \"system_prompt\": \"You are a security-focused code reviewer. Report issues with line numbers and severity.\",\n    }],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    subagents=[{\n        \"name\": \"reviewer\",\n        \"description\": \"Reviews code for security issues, citing lines and severity\",\n        \"system_prompt\": \"You are a security-focused code reviewer. Report issues with line numbers and severity.\",\n    }],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 }
]
```


For install steps and interpreter setup, see [Interpreters](lc:oss/python/deepagents/interpreters#quickstart).

For specialized work, configure custom [subagents](lc:oss/python/deepagents/subagents) with their own names, descriptions, and system prompts. The subagents' names and descriptions serve as information for the agent to evaluate which role to reach for.

To trigger dynamic subagents, prompt the agent with the word "workflow":


```python
result = agent.invoke({
    "messages": [{"role": "user", "content": "Run a workflow that reviews every file in src/routes/ and summarizes the top risks."}]
})
```


> [!TIP]
>
> **The word "workflow" is a useful trigger.** The interpreter system prompt treats "workflow" as a signal to organize work through the interpreter, dispatching subagents with `task()` from code rather than grinding through items one model-chosen tool call at a time. Phrasing a request as a "workflow" is a deliberate lever you can pull to opt into dynamic orchestration. For a single, direct delegation, phrase the request plainly instead.


> [!NOTE]
>
> Using dynamic subagents with `dcode`, the LangChain terminal coding agent? `dcode` ships with the code interpreter enabled, so dynamic subagents work out of the box. See the [dcode subagents page](lc:oss/deepagents/code/subagents) for setup and usage details.


## How it works

When an agent has [subagents](lc:oss/python/deepagents/subagents) and interpreter middleware, the interpreter exposes a built-in `task()` global that dispatches subagents from code. A task spanning many independent units (reviewing every file in a directory, triaging a batch of tickets) becomes a loop that fans the work out, so it runs deterministically instead of one model-chosen tool call at a time.

Subagent orchestration also supports recursive language model (RLM) workflows, the approach described in the [Recursive Language Models paper](https://arxiv.org/abs/2512.24601): keep the working set in interpreter variables, select slices, call subagents with `task()`, and synthesize the results.

Many orchestration workflows combine dynamic subagents with [programmatic tool calling (PTC)](lc:oss/python/deepagents/interpreters#programmatic-tool-calling-ptc): use `tools.*` from interpreter code to discover or filter inputs, then dispatch subagents with `task()`. PTC is off by default; enable it with an explicit allowlist on interpreter middleware.

`task()` is a capability bridge into subagent execution, similar to PTC for tools. For isolation defaults, approval boundaries, and middleware options, see [Security](lc:oss/python/deepagents/interpreters#security) and [Configuration](lc:oss/python/deepagents/interpreters#configuration).


> [!NOTE]
>
> Multi-turn orchestration can persist interpreter variables across agent turns when using `mode="thread"` (the default). See [Persistence](lc:oss/python/deepagents/interpreters#persistence) on the interpreters page.


`task()` takes the following inputs:

- `description`: The prompt for the subagent
- `subagentType`: Which configured subagent to run
- `responseSchema` (optional): Structured output

A `task()` runs a full agentic loop and resolves to the subagent's result:


When you pass `responseSchema`, the resolved value is already a typed JavaScript object; only call `JSON.parse` if a subagent intentionally returned a JSON string.

## Patterns

The agent picks a strategy from the shape of the task; these emerge from how it writes interpreter code, not from configuration, and the subagents you make available determine what it can do. Every pattern shares the same orchestration approach: hold work in JS variables, dispatch subagents with `task()`, and combine results in code. The diagrams below show the common shapes, each with a runnable example.

### Classify and act

Items are classified first, then each item is handled by a specialized subagent based on its classification. This lets you process mixed inputs where different items need different expertise.

```mermaid
graph LR
    Task[Task] --> Classify{Classifier}
    Classify --> |bug| A[Agent A]
    Classify --> |feature| B[Agent B]
    Classify --> |question| C[Agent C]
```

**Use cases:** Triaging support tickets, error logs, user feedback, or any batch of items that need different handling depending on their type.

### Example: classify and act

**What you configure**


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    subagents=[\n        {\n            \"name\": \"bug-fixer\",\n            \"description\": \"Investigates bug reports and provides reproduction steps\",\n            \"system_prompt\": \"You are a bug triage specialist. Investigate each bug report and provide clear reproduction steps.\",\n        },\n        {\n            \"name\": \"feature-analyst\",\n            \"description\": \"Evaluates feature requests for feasibility and effort\",\n            \"system_prompt\": \"You are a product analyst. Evaluate each feature request for technical feasibility, estimated effort, and potential impact.\",\n        },\n        {\n            \"name\": \"support-agent\",\n            \"description\": \"Answers user questions based on documentation\",\n            \"system_prompt\": \"You are a support specialist. Answer user questions clearly based on the available documentation.\",\n        },\n    ],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    subagents=[\n        {\n            \"name\": \"bug-fixer\",\n            \"description\": \"Investigates bug reports and provides reproduction steps\",\n            \"system_prompt\": \"You are a bug triage specialist. Investigate each bug report and provide clear reproduction steps.\",\n        },\n        {\n            \"name\": \"feature-analyst\",\n            \"description\": \"Evaluates feature requests for feasibility and effort\",\n            \"system_prompt\": \"You are a product analyst. Evaluate each feature request for technical feasibility, estimated effort, and potential impact.\",\n        },\n        {\n            \"name\": \"support-agent\",\n            \"description\": \"Answers user questions based on documentation\",\n            \"system_prompt\": \"You are a support specialist. Answer user questions clearly based on the available documentation.\",\n        },\n    ],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    subagents=[\n        {\n            \"name\": \"bug-fixer\",\n            \"description\": \"Investigates bug reports and provides reproduction steps\",\n            \"system_prompt\": \"You are a bug triage specialist. Investigate each bug report and provide clear reproduction steps.\",\n        },\n        {\n            \"name\": \"feature-analyst\",\n            \"description\": \"Evaluates feature requests for feasibility and effort\",\n            \"system_prompt\": \"You are a product analyst. Evaluate each feature request for technical feasibility, estimated effort, and potential impact.\",\n        },\n        {\n            \"name\": \"support-agent\",\n            \"description\": \"Answers user questions based on documentation\",\n            \"system_prompt\": \"You are a support specialist. Answer user questions clearly based on the available documentation.\",\n        },\n    ],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    subagents=[\n        {\n            \"name\": \"bug-fixer\",\n            \"description\": \"Investigates bug reports and provides reproduction steps\",\n            \"system_prompt\": \"You are a bug triage specialist. Investigate each bug report and provide clear reproduction steps.\",\n        },\n        {\n            \"name\": \"feature-analyst\",\n            \"description\": \"Evaluates feature requests for feasibility and effort\",\n            \"system_prompt\": \"You are a product analyst. Evaluate each feature request for technical feasibility, estimated effort, and potential impact.\",\n        },\n        {\n            \"name\": \"support-agent\",\n            \"description\": \"Answers user questions based on documentation\",\n            \"system_prompt\": \"You are a support specialist. Answer user questions clearly based on the available documentation.\",\n        },\n    ],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    subagents=[\n        {\n            \"name\": \"bug-fixer\",\n            \"description\": \"Investigates bug reports and provides reproduction steps\",\n            \"system_prompt\": \"You are a bug triage specialist. Investigate each bug report and provide clear reproduction steps.\",\n        },\n        {\n            \"name\": \"feature-analyst\",\n            \"description\": \"Evaluates feature requests for feasibility and effort\",\n            \"system_prompt\": \"You are a product analyst. Evaluate each feature request for technical feasibility, estimated effort, and potential impact.\",\n        },\n        {\n            \"name\": \"support-agent\",\n            \"description\": \"Answers user questions based on documentation\",\n            \"system_prompt\": \"You are a support specialist. Answer user questions clearly based on the available documentation.\",\n        },\n    ],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    subagents=[\n        {\n            \"name\": \"bug-fixer\",\n            \"description\": \"Investigates bug reports and provides reproduction steps\",\n            \"system_prompt\": \"You are a bug triage specialist. Investigate each bug report and provide clear reproduction steps.\",\n        },\n        {\n            \"name\": \"feature-analyst\",\n            \"description\": \"Evaluates feature requests for feasibility and effort\",\n            \"system_prompt\": \"You are a product analyst. Evaluate each feature request for technical feasibility, estimated effort, and potential impact.\",\n        },\n        {\n            \"name\": \"support-agent\",\n            \"description\": \"Answers user questions based on documentation\",\n            \"system_prompt\": \"You are a support specialist. Answer user questions clearly based on the available documentation.\",\n        },\n    ],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    subagents=[\n        {\n            \"name\": \"bug-fixer\",\n            \"description\": \"Investigates bug reports and provides reproduction steps\",\n            \"system_prompt\": \"You are a bug triage specialist. Investigate each bug report and provide clear reproduction steps.\",\n        },\n        {\n            \"name\": \"feature-analyst\",\n            \"description\": \"Evaluates feature requests for feasibility and effort\",\n            \"system_prompt\": \"You are a product analyst. Evaluate each feature request for technical feasibility, estimated effort, and potential impact.\",\n        },\n        {\n            \"name\": \"support-agent\",\n            \"description\": \"Answers user questions based on documentation\",\n            \"system_prompt\": \"You are a support specialist. Answer user questions clearly based on the available documentation.\",\n        },\n    ],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 }
]
```


**What the agent writes**


### Fan-out and synthesize

The agent dispatches the same kind of work across many items in parallel, then combines the results.

```mermaid
graph LR
    Items[Items] --> W1[Worker]
    Items --> W2[Worker]
    Items --> W3[Worker]
    W1 --> Collect[Collect]
    W2 --> Collect
    W3 --> Collect
    Collect --> Synth[Synthesize]
```

**Use cases:** Code review across a directory, analyzing a batch of documents, processing log files, running the same check across many services.

Discovering files from interpreter code requires [programmatic tool calling (PTC)](lc:oss/python/deepagents/interpreters#programmatic-tool-calling-ptc). Enable `glob` in the PTC allowlist on interpreter middleware.

### Example: fan-out and synthesize

**What you configure**


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    subagents=[{\n        \"name\": \"reviewer\",\n        \"description\": \"Reviews code for security issues, citing lines and severity\",\n        \"system_prompt\": \"You are a security-focused code reviewer. Read the file carefully and report any authentication or authorization issues with line numbers and severity.\",\n    }],\n    middleware=[CodeInterpreterMiddleware(ptc=[\"glob\"])],\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    subagents=[{\n        \"name\": \"reviewer\",\n        \"description\": \"Reviews code for security issues, citing lines and severity\",\n        \"system_prompt\": \"You are a security-focused code reviewer. Read the file carefully and report any authentication or authorization issues with line numbers and severity.\",\n    }],\n    middleware=[CodeInterpreterMiddleware(ptc=[\"glob\"])],\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    subagents=[{\n        \"name\": \"reviewer\",\n        \"description\": \"Reviews code for security issues, citing lines and severity\",\n        \"system_prompt\": \"You are a security-focused code reviewer. Read the file carefully and report any authentication or authorization issues with line numbers and severity.\",\n    }],\n    middleware=[CodeInterpreterMiddleware(ptc=[\"glob\"])],\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    subagents=[{\n        \"name\": \"reviewer\",\n        \"description\": \"Reviews code for security issues, citing lines and severity\",\n        \"system_prompt\": \"You are a security-focused code reviewer. Read the file carefully and report any authentication or authorization issues with line numbers and severity.\",\n    }],\n    middleware=[CodeInterpreterMiddleware(ptc=[\"glob\"])],\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    subagents=[{\n        \"name\": \"reviewer\",\n        \"description\": \"Reviews code for security issues, citing lines and severity\",\n        \"system_prompt\": \"You are a security-focused code reviewer. Read the file carefully and report any authentication or authorization issues with line numbers and severity.\",\n    }],\n    middleware=[CodeInterpreterMiddleware(ptc=[\"glob\"])],\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    subagents=[{\n        \"name\": \"reviewer\",\n        \"description\": \"Reviews code for security issues, citing lines and severity\",\n        \"system_prompt\": \"You are a security-focused code reviewer. Read the file carefully and report any authentication or authorization issues with line numbers and severity.\",\n    }],\n    middleware=[CodeInterpreterMiddleware(ptc=[\"glob\"])],\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    subagents=[{\n        \"name\": \"reviewer\",\n        \"description\": \"Reviews code for security issues, citing lines and severity\",\n        \"system_prompt\": \"You are a security-focused code reviewer. Read the file carefully and report any authentication or authorization issues with line numbers and severity.\",\n    }],\n    middleware=[CodeInterpreterMiddleware(ptc=[\"glob\"])],\n)"
 }
]
```


**What the agent writes**


### Adversarial verification

A two-pass pattern. The first pass produces findings. The second pass sends each finding to independent verifiers, and only findings that survive agreement are kept. This reduces false positives when confidence matters more than speed.

```mermaid
graph LR
    Items[Items] --> Workers[Workers]
    Workers --> Findings[Findings]
    Findings --> V1[Verifier]
    Findings --> V2[Verifier]
    Findings --> V3[Verifier]
    V1 --> Vote[Majority vote]
    V2 --> Vote
    V3 --> Vote
    Vote --> Confirmed[Confirmed]
```

**Use cases:** Security audits where false positives are costly, compliance checks, any review where you need high confidence in findings.

### Example: adversarial verification

**What you configure**


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    subagents=[\n        {\n            \"name\": \"reviewer\",\n            \"description\": \"Finds potential security vulnerabilities in code\",\n            \"system_prompt\": \"You are a security auditor. Find potential vulnerabilities and report each with file, line, and description.\",\n        },\n        {\n            \"name\": \"verifier\",\n            \"description\": \"Independently verifies whether a reported vulnerability is real\",\n            \"system_prompt\": \"You are a security verification specialist. Given a reported vulnerability, independently verify whether it is exploitable. Be skeptical. Only confirm real issues.\",\n        },\n    ],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    subagents=[\n        {\n            \"name\": \"reviewer\",\n            \"description\": \"Finds potential security vulnerabilities in code\",\n            \"system_prompt\": \"You are a security auditor. Find potential vulnerabilities and report each with file, line, and description.\",\n        },\n        {\n            \"name\": \"verifier\",\n            \"description\": \"Independently verifies whether a reported vulnerability is real\",\n            \"system_prompt\": \"You are a security verification specialist. Given a reported vulnerability, independently verify whether it is exploitable. Be skeptical. Only confirm real issues.\",\n        },\n    ],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    subagents=[\n        {\n            \"name\": \"reviewer\",\n            \"description\": \"Finds potential security vulnerabilities in code\",\n            \"system_prompt\": \"You are a security auditor. Find potential vulnerabilities and report each with file, line, and description.\",\n        },\n        {\n            \"name\": \"verifier\",\n            \"description\": \"Independently verifies whether a reported vulnerability is real\",\n            \"system_prompt\": \"You are a security verification specialist. Given a reported vulnerability, independently verify whether it is exploitable. Be skeptical. Only confirm real issues.\",\n        },\n    ],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    subagents=[\n        {\n            \"name\": \"reviewer\",\n            \"description\": \"Finds potential security vulnerabilities in code\",\n            \"system_prompt\": \"You are a security auditor. Find potential vulnerabilities and report each with file, line, and description.\",\n        },\n        {\n            \"name\": \"verifier\",\n            \"description\": \"Independently verifies whether a reported vulnerability is real\",\n            \"system_prompt\": \"You are a security verification specialist. Given a reported vulnerability, independently verify whether it is exploitable. Be skeptical. Only confirm real issues.\",\n        },\n    ],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    subagents=[\n        {\n            \"name\": \"reviewer\",\n            \"description\": \"Finds potential security vulnerabilities in code\",\n            \"system_prompt\": \"You are a security auditor. Find potential vulnerabilities and report each with file, line, and description.\",\n        },\n        {\n            \"name\": \"verifier\",\n            \"description\": \"Independently verifies whether a reported vulnerability is real\",\n            \"system_prompt\": \"You are a security verification specialist. Given a reported vulnerability, independently verify whether it is exploitable. Be skeptical. Only confirm real issues.\",\n        },\n    ],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    subagents=[\n        {\n            \"name\": \"reviewer\",\n            \"description\": \"Finds potential security vulnerabilities in code\",\n            \"system_prompt\": \"You are a security auditor. Find potential vulnerabilities and report each with file, line, and description.\",\n        },\n        {\n            \"name\": \"verifier\",\n            \"description\": \"Independently verifies whether a reported vulnerability is real\",\n            \"system_prompt\": \"You are a security verification specialist. Given a reported vulnerability, independently verify whether it is exploitable. Be skeptical. Only confirm real issues.\",\n        },\n    ],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    subagents=[\n        {\n            \"name\": \"reviewer\",\n            \"description\": \"Finds potential security vulnerabilities in code\",\n            \"system_prompt\": \"You are a security auditor. Find potential vulnerabilities and report each with file, line, and description.\",\n        },\n        {\n            \"name\": \"verifier\",\n            \"description\": \"Independently verifies whether a reported vulnerability is real\",\n            \"system_prompt\": \"You are a security verification specialist. Given a reported vulnerability, independently verify whether it is exploitable. Be skeptical. Only confirm real issues.\",\n        },\n    ],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 }
]
```


**What the agent writes**


### Generate and filter

Multiple subagents generate independent solutions to the same problem. The agent compares, scores, and filters the results in code, keeping only the best.

```mermaid
graph LR
    Prompt[Prompt] --> G1[Generator]
    Prompt --> G2[Generator]
    Prompt --> G3[Generator]
    G1 --> Filter[Filter + rank]
    G2 --> Filter
    G3 --> Filter
    Filter --> Best[Best result]
```

**Use cases:** Architecture proposals, refactoring strategies, content variations, any task where exploring multiple options before committing produces a better outcome.

### Example: generate and filter

**What you configure**


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    subagents=[{\n        \"name\": \"architect\",\n        \"description\": \"Proposes a database schema design with tradeoff analysis\",\n        \"system_prompt\": \"You are a database architect. Propose a schema design for the given requirements. Include tradeoffs, migration considerations, and a clear rationale.\",\n    }],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    subagents=[{\n        \"name\": \"architect\",\n        \"description\": \"Proposes a database schema design with tradeoff analysis\",\n        \"system_prompt\": \"You are a database architect. Propose a schema design for the given requirements. Include tradeoffs, migration considerations, and a clear rationale.\",\n    }],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    subagents=[{\n        \"name\": \"architect\",\n        \"description\": \"Proposes a database schema design with tradeoff analysis\",\n        \"system_prompt\": \"You are a database architect. Propose a schema design for the given requirements. Include tradeoffs, migration considerations, and a clear rationale.\",\n    }],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    subagents=[{\n        \"name\": \"architect\",\n        \"description\": \"Proposes a database schema design with tradeoff analysis\",\n        \"system_prompt\": \"You are a database architect. Propose a schema design for the given requirements. Include tradeoffs, migration considerations, and a clear rationale.\",\n    }],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    subagents=[{\n        \"name\": \"architect\",\n        \"description\": \"Proposes a database schema design with tradeoff analysis\",\n        \"system_prompt\": \"You are a database architect. Propose a schema design for the given requirements. Include tradeoffs, migration considerations, and a clear rationale.\",\n    }],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    subagents=[{\n        \"name\": \"architect\",\n        \"description\": \"Proposes a database schema design with tradeoff analysis\",\n        \"system_prompt\": \"You are a database architect. Propose a schema design for the given requirements. Include tradeoffs, migration considerations, and a clear rationale.\",\n    }],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    subagents=[{\n        \"name\": \"architect\",\n        \"description\": \"Proposes a database schema design with tradeoff analysis\",\n        \"system_prompt\": \"You are a database architect. Propose a schema design for the given requirements. Include tradeoffs, migration considerations, and a clear rationale.\",\n    }],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 }
]
```


**What the agent writes**


### Tournament

Variations are compared head-to-head by a judge subagent, with winners advancing through elimination rounds.

```mermaid
graph LR
    A1[Attempt] --> J1{Judge}
    A2[Attempt] --> J1
    A3[Attempt] --> J2{Judge}
    A4[Attempt] --> J2
    J1 --> JF{Final}
    J2 --> JF
    JF --> Winner[Winner]
```

**Use cases:** Optimization under subjective criteria, style selection, choosing between competing implementations.

### Example: tournament

**What you configure**


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    subagents=[\n        {\n            \"name\": \"writer\",\n            \"description\": \"Rewrites a function with a focus on readability and clarity\",\n            \"system_prompt\": \"You are an expert programmer focused on clean code. Rewrite the given function to maximize readability. Explain your choices.\",\n        },\n        {\n            \"name\": \"judge\",\n            \"description\": \"Compares two code implementations and picks the more readable one\",\n            \"system_prompt\": \"You are a code quality judge. Compare two implementations and pick the more readable one. Justify your choice with specific criteria.\",\n        },\n    ],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    subagents=[\n        {\n            \"name\": \"writer\",\n            \"description\": \"Rewrites a function with a focus on readability and clarity\",\n            \"system_prompt\": \"You are an expert programmer focused on clean code. Rewrite the given function to maximize readability. Explain your choices.\",\n        },\n        {\n            \"name\": \"judge\",\n            \"description\": \"Compares two code implementations and picks the more readable one\",\n            \"system_prompt\": \"You are a code quality judge. Compare two implementations and pick the more readable one. Justify your choice with specific criteria.\",\n        },\n    ],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    subagents=[\n        {\n            \"name\": \"writer\",\n            \"description\": \"Rewrites a function with a focus on readability and clarity\",\n            \"system_prompt\": \"You are an expert programmer focused on clean code. Rewrite the given function to maximize readability. Explain your choices.\",\n        },\n        {\n            \"name\": \"judge\",\n            \"description\": \"Compares two code implementations and picks the more readable one\",\n            \"system_prompt\": \"You are a code quality judge. Compare two implementations and pick the more readable one. Justify your choice with specific criteria.\",\n        },\n    ],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    subagents=[\n        {\n            \"name\": \"writer\",\n            \"description\": \"Rewrites a function with a focus on readability and clarity\",\n            \"system_prompt\": \"You are an expert programmer focused on clean code. Rewrite the given function to maximize readability. Explain your choices.\",\n        },\n        {\n            \"name\": \"judge\",\n            \"description\": \"Compares two code implementations and picks the more readable one\",\n            \"system_prompt\": \"You are a code quality judge. Compare two implementations and pick the more readable one. Justify your choice with specific criteria.\",\n        },\n    ],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    subagents=[\n        {\n            \"name\": \"writer\",\n            \"description\": \"Rewrites a function with a focus on readability and clarity\",\n            \"system_prompt\": \"You are an expert programmer focused on clean code. Rewrite the given function to maximize readability. Explain your choices.\",\n        },\n        {\n            \"name\": \"judge\",\n            \"description\": \"Compares two code implementations and picks the more readable one\",\n            \"system_prompt\": \"You are a code quality judge. Compare two implementations and pick the more readable one. Justify your choice with specific criteria.\",\n        },\n    ],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    subagents=[\n        {\n            \"name\": \"writer\",\n            \"description\": \"Rewrites a function with a focus on readability and clarity\",\n            \"system_prompt\": \"You are an expert programmer focused on clean code. Rewrite the given function to maximize readability. Explain your choices.\",\n        },\n        {\n            \"name\": \"judge\",\n            \"description\": \"Compares two code implementations and picks the more readable one\",\n            \"system_prompt\": \"You are a code quality judge. Compare two implementations and pick the more readable one. Justify your choice with specific criteria.\",\n        },\n    ],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    subagents=[\n        {\n            \"name\": \"writer\",\n            \"description\": \"Rewrites a function with a focus on readability and clarity\",\n            \"system_prompt\": \"You are an expert programmer focused on clean code. Rewrite the given function to maximize readability. Explain your choices.\",\n        },\n        {\n            \"name\": \"judge\",\n            \"description\": \"Compares two code implementations and picks the more readable one\",\n            \"system_prompt\": \"You are a code quality judge. Compare two implementations and pick the more readable one. Justify your choice with specific criteria.\",\n        },\n    ],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 }
]
```


**What the agent writes**


### Loop until done

The agent runs a discovery loop, deduplicating against what it has already found, until no new results appear. Useful when the scope of the work is not known upfront.

```mermaid
graph LR
    Agent[Agent] --> Check{New findings?}
    Check --> |yes| Agent
    Check --> |no| Done[Done]
```

**Use cases:** Exhaustive search, dead code detection, dependency audits, any sweep where you want completeness rather than a fixed number of results.

### Example: loop until done

**What you configure**


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    subagents=[{\n        \"name\": \"analyzer\",\n        \"description\": \"Analyzes code for unused exports, functions, and dead code paths\",\n        \"system_prompt\": \"You are a code analyst specializing in dead code detection. Find unused exports, unreachable functions, and orphaned modules. Report each with file path and evidence.\",\n    }],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    subagents=[{\n        \"name\": \"analyzer\",\n        \"description\": \"Analyzes code for unused exports, functions, and dead code paths\",\n        \"system_prompt\": \"You are a code analyst specializing in dead code detection. Find unused exports, unreachable functions, and orphaned modules. Report each with file path and evidence.\",\n    }],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    subagents=[{\n        \"name\": \"analyzer\",\n        \"description\": \"Analyzes code for unused exports, functions, and dead code paths\",\n        \"system_prompt\": \"You are a code analyst specializing in dead code detection. Find unused exports, unreachable functions, and orphaned modules. Report each with file path and evidence.\",\n    }],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    subagents=[{\n        \"name\": \"analyzer\",\n        \"description\": \"Analyzes code for unused exports, functions, and dead code paths\",\n        \"system_prompt\": \"You are a code analyst specializing in dead code detection. Find unused exports, unreachable functions, and orphaned modules. Report each with file path and evidence.\",\n    }],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    subagents=[{\n        \"name\": \"analyzer\",\n        \"description\": \"Analyzes code for unused exports, functions, and dead code paths\",\n        \"system_prompt\": \"You are a code analyst specializing in dead code detection. Find unused exports, unreachable functions, and orphaned modules. Report each with file path and evidence.\",\n    }],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    subagents=[{\n        \"name\": \"analyzer\",\n        \"description\": \"Analyzes code for unused exports, functions, and dead code paths\",\n        \"system_prompt\": \"You are a code analyst specializing in dead code detection. Find unused exports, unreachable functions, and orphaned modules. Report each with file path and evidence.\",\n    }],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    subagents=[{\n        \"name\": \"analyzer\",\n        \"description\": \"Analyzes code for unused exports, functions, and dead code paths\",\n        \"system_prompt\": \"You are a code analyst specializing in dead code detection. Find unused exports, unreachable functions, and orphaned modules. Report each with file path and evidence.\",\n    }],\n    middleware=[CodeInterpreterMiddleware()],\n)"
 }
]
```


**What the agent writes**


> [!WARNING]
>
> `task()` dispatches from inside an already-running `eval` call. It does not go through the normal tool calling path, so `interrupt_on` approval workflows on the parent agent are not enforced per dispatch. Gate the `eval` tool itself if you need approval before subagent orchestration runs.


## Disable dynamic subagents

Subagent dispatch is on by default whenever the agent has subagents. Disable it if you want subagents to be available only through the normal `task` tool path. For other middleware options, see [Configuration](lc:oss/python/deepagents/interpreters#configuration) on the interpreters page.


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    subagents=[{\"name\": \"reviewer\", \"description\": \"Reviews code\", \"system_prompt\": \"Review code.\"}],\n    middleware=[CodeInterpreterMiddleware(subagents=False)],\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    subagents=[{\"name\": \"reviewer\", \"description\": \"Reviews code\", \"system_prompt\": \"Review code.\"}],\n    middleware=[CodeInterpreterMiddleware(subagents=False)],\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    subagents=[{\"name\": \"reviewer\", \"description\": \"Reviews code\", \"system_prompt\": \"Review code.\"}],\n    middleware=[CodeInterpreterMiddleware(subagents=False)],\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    subagents=[{\"name\": \"reviewer\", \"description\": \"Reviews code\", \"system_prompt\": \"Review code.\"}],\n    middleware=[CodeInterpreterMiddleware(subagents=False)],\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    subagents=[{\"name\": \"reviewer\", \"description\": \"Reviews code\", \"system_prompt\": \"Review code.\"}],\n    middleware=[CodeInterpreterMiddleware(subagents=False)],\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    subagents=[{\"name\": \"reviewer\", \"description\": \"Reviews code\", \"system_prompt\": \"Review code.\"}],\n    middleware=[CodeInterpreterMiddleware(subagents=False)],\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    subagents=[{\"name\": \"reviewer\", \"description\": \"Reviews code\", \"system_prompt\": \"Review code.\"}],\n    middleware=[CodeInterpreterMiddleware(subagents=False)],\n)"
 }
]
```


## See also

- [Interpreters](lc:oss/python/deepagents/interpreters): QuickJS setup, programmatic tool calling, persistence, security, and middleware configuration
- [Subagents](lc:oss/python/deepagents/subagents): Configure subagent names, descriptions, and system prompts
- [Event streaming](lc:oss/python/deepagents/event-streaming): Stream updates from the coordinator and delegated subagents
