/**
 * Strips markdown code fences from AI output. Models sometimes return DSL
 * wrapped in ```openflow / ```yaml / ``` blocks even when told not to;
 * this normalises the output so downstream consumers see clean DSL.
 */
const CODE_FENCE_HEAD = /^\s*```[^\n]*\n?/;
const CODE_FENCE_TAIL = /\n?```\s*$/;

export function stripCodeFences(input: string): string {
  let text = input.trim();
  // Strip a leading fence if present.
  text = text.replace(CODE_FENCE_HEAD, '');
  text = text.replace(CODE_FENCE_TAIL, '');
  // Some models emit bare ``` lines mid-output; remove them too.
  text = text
    .split('\n')
    .filter((line) => !/^\s*```/.test(line))
    .join('\n')
    .trim();
  return text;
}
