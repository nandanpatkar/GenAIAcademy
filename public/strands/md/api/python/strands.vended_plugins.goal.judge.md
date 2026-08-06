Judge primitives for the goal plugin’s natural-language validator.

Re-exported from **init**.py so users can build a custom judge through a function validator while reusing the same outcome schema, system prompt, or transcript format.

## JudgeOutcome

```python
class JudgeOutcome(BaseModel)
```

Defined in: [src/strands/vended\_plugins/goal/judge.py:52](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/vended_plugins/goal/judge.py#L52)

Structured outcome the judge agent fills via structured output.

#### build\_judge\_prompt

```python
def build_judge_prompt(description: str, transcript: Messages) -> str
```

Defined in: [src/strands/vended\_plugins/goal/judge.py:66](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/vended_plugins/goal/judge.py#L66)

Build the judge’s input prompt.

Combines the goal description with a serialised transcript of the working agent’s conversation, so the judge can evaluate against context, not just the last assistant turn.

Tool calls and results are summarised inline so the judge can grade goals that depend on tool behaviour.

**Arguments**:

-   `description` - Natural-language goal the judge evaluates against.
-   `transcript` - Working agent’s conversation messages.

**Returns**:

Composed input prompt string ready to feed to a judge Agent.
