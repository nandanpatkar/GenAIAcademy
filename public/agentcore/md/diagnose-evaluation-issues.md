# Diagnose AgentCore Evaluation issues with an AI coding assistant - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/diagnose-evaluation-issues.html

---

# Diagnose AgentCore Evaluation issues with an AI coding assistant

If your AgentCore Evaluation configuration isn’t producing results — or if you’re seeing errors like `LogEventMissingException`, `AgentSpanMappingException`, or empty evaluation scores — you can use the **AgentCore Evaluation Diagnostic Skill** to troubleshoot the issue yourself.

The skill is a markdown file that works with any AI coding assistant. You load it into your assistant, provide your AWS Region, deployment type, and optionally a session ID, and the assistant walks you through a step-by-step diagnosis. The skill works with agents deployed on AgentCore Runtime and agents hosted on third-party infrastructure (Amazon ECS, Amazon EKS, AWS Lambda, or any other environment). The assistant queries your own Amazon CloudWatch log groups to identify the root cause and recommend a fix.

## What the skill diagnoses

The skill covers the most common evaluation issues:

  * **Empty evaluation results** — no scores appear despite the evaluation configuration being enabled.

  * **`LogEventMissingException` ** — the evaluation reports that a span is missing its corresponding log event.

  * **`AgentSpanMappingException` ** or **`ToolSpanMappingException` ** — the evaluation can’t extract the user query or tool output from a span.

  * **`SpanEventParsingException` ** — the evaluation can’t parse an event’s body.

  * **`Gateway Timeout (504)` ** — the evaluation times out.

  * **`ValidationException` ** on `evaluatorId` — the evaluator ID format is incorrect.

  * **Multi-agent evaluation scoping issues** — evaluators target the wrong agent in a multi-agent trace.


## Prerequisites

  * AWS CLI configured with credentials for the account where the agent runs. The credentials need the following permissions:

    * `logs:DescribeLogGroups`, `logs:DescribeLogStreams`, `logs:StartQuery`, `logs:GetQueryResults` — to query CloudWatch Logs

    * `bedrock-agentcore:GetOnlineEvaluationConfig`, `bedrock-agentcore:ListOnlineEvaluationConfigs` — to read evaluation configurations (online evaluation only)

  * Python 3.9 or later with the `boto3` library is recommended but not strictly required — the diagnostic queries can also be run via the AWS CLI directly.

  * An AI coding assistant that supports the [Agent Skills](<https://agentskills.io>) standard or that can accept markdown instructions.

  * An agent that has been invoked at least once with observability enabled.


## Copy the skill

The skill source is available in [Diagnostic skill source](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./diagnose-evaluation-skill-source.html>). Copy the entire code block from that topic and save it as `SKILL.md` inside a new folder named `agentcore-eval-diagnostic/` on your machine.

The skill is a plain markdown file. It contains only public information and runs only against your own account — no service-side access is required.

## Load the skill into your AI coding assistant

Save the skill source from [Diagnostic skill source](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./diagnose-evaluation-skill-source.html>) as `SKILL.md` inside a folder named `agentcore-eval-diagnostic/` on your machine, then move or copy that folder into the skills directory for your AI coding assistant. The skill follows the open [Agent Skills](<https://agentskills.io>) standard, so each tool discovers it from its own dedicated skills folder — do not append the skill contents to generic instruction files such as `AGENTS.md`, `CLAUDE.md`, or `GEMINI.md`.

### Kiro CLI

Place the skill folder at `.kiro/skills/agentcore-eval-diagnostic/` in your project, or at `~/.kiro/skills/agentcore-eval-diagnostic/` to make it available across all workspaces. For setup details, see the [Kiro CLI skills documentation](<https://kiro.dev/docs/skills>).

### Claude Code

Place the skill folder at `.claude/skills/agentcore-eval-diagnostic/` in your project, or at `~/.claude/skills/agentcore-eval-diagnostic/` to make it available across all projects. For setup details, see the [Claude Code skills documentation](<https://docs.anthropic.com/en/docs/claude-code/skills>).

### OpenAI Codex CLI

Place the skill folder at `.agents/skills/agentcore-eval-diagnostic/` in your repository, or at `~/.agents/skills/agentcore-eval-diagnostic/` to make it available across all repositories. For setup details, see the [Codex CLI skills documentation](<https://developers.openai.com/codex/skills>).

### Cursor

Cursor uses Rules instead of skills. Save the skill contents as a project rule in `.cursor/rules/agentcore-eval-diagnostic.md`. For setup details, see the [Cursor Rules documentation](<https://cursor.com/docs/context/rules>).

### Gemini CLI

Place the skill folder at `~/.gemini/skills/agentcore-eval-diagnostic/` to make it available across all workspaces, or in your project’s skills directory for project-scoped use. For setup details, see the [Gemini CLI skills documentation](<https://geminicli.com/docs/cli/skills/>).

### Any other AI assistant

If your assistant supports the [Agent Skills](<https://agentskills.io>) standard, place the skill folder in the directory your assistant uses to discover skills. If your assistant does not support Agent Skills, load the skill by pasting the contents of `SKILL.md` into a system prompt, user message, or context file. The skill is self-contained and does not depend on any tool-specific features.

## Run a diagnosis

After loading the skill, start a new chat with your AI assistant and provide:

  1. Your AWS Region (for example, `us-west-2`).

  2. Your deployment type — `agentcore-runtime` if your agent is deployed on AgentCore Runtime, or `3p-managed` if your agent is hosted on Amazon ECS, Amazon EKS, AWS Lambda, or any other non-AgentCore environment.

  3. Your evaluation type — `online` (uses an evaluation configuration with sampling) or `on-demand` (direct Evaluate API call).

  4. Optionally, a session ID from your agent traces (the `session.id` attribute). If you don’t have one, the assistant can auto-discover recent sessions from your log groups.


The assistant queries your CloudWatch log groups, identifies the root cause of the failure, and produces a structured diagnostic report. The report includes:

  * A summary of the root cause.

  * A findings table showing which diagnostic checks passed or failed.

  * A list of affected spans and events.

  * Links to relevant AWS documentation.

  * Recommended next steps.


The assistant runs all queries in your own AWS account against your own CloudWatch log groups. It does not access any AWS service-side logs or internal data.

## Example interaction

**You:** My Region is `us-west-2`, I’m using AgentCore Runtime with online evaluation, and my session ID is `my-session-abc123`. My evaluation isn’t producing results. Can you diagnose it?

**AI assistant:**

```text
## AgentCore Evaluation Diagnostic Report

Session: my-session-abc123
Region: us-west-2

Summary: Service name mismatch — spans are emitted under
'my_agent.DEFAULT' but the evaluation configuration expects
'wrong_name.DEFAULT'.

Findings:
| Check                | Status | Details |
| -------------------- | ------ | ------- |
| Eval config status   | OK     | ENABLED, 100% sampling |
| Spans found          | OK     | 15 spans for this session |
| Scope support        | OK     | strands.telemetry.tracer found |
| Service name match   | FAIL   | Config expects wrong_name.DEFAULT |

Recommended fix: Update the evaluation configuration's serviceNames to
match 'my_agent.DEFAULT'.
```
## Troubleshooting the skill itself

If the assistant can’t query your log groups, check that:

  * Your AWS credentials have the required permissions.

  * The Region you provided matches where your agent is deployed.

  * The session ID is correct (copy it from your agent traces).

  * The agent has been invoked within the last 24 hours.


## Related documentation

  * [Understanding input spans](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./understanding-input-spans.html>)

  * [Create online evaluation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./create-online-evaluations.html>)

  * [Getting started with on-demand evaluation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./getting-started-on-demand.html>)


###### Topics



