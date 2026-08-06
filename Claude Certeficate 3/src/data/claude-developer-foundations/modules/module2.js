/*
 * Developer Module 2 — Production-Grade Prompting, Agents & Tool-use.
 * Content transcribed from "MODULE 2_DEV.txt".
 *
 * This module uses checkpoints rather than a single end-of-module quiz. The
 * multiple-choice checkpoints are carried into `reviewQuestions`; the
 * open-ended ones (fix the prompt, repair the handler, complete the wiring,
 * the cumulative debug task) are preserved inline as worked examples with
 * their model answers, since they have no option set to grade.
 */

const disclaimer = {
  type: 'callout',
  variant: 'disclaimer',
  title: 'Disclaimer / Notice for Educational Content',
  body: [
    "We built this Developer course Module 2: Production-Grade Prompting, Agents & Tool-use to help you get real work done with Claude. Treat it as educational content. It doesn't constitute legal, financial, or other professional advice, so adapt what you learn to your own situation. Our products and services evolve quickly, so certain content may contain errors or be outdated; remember to verify on Anthropic's website or docs. Examples and scenarios used in the course are illustrative and often fictitious. If the course material mentions a company or product, it doesn't mean Anthropic endorses them, they endorse Anthropic, or that we're affiliated. Also note your use of Anthropic products and services is covered by our terms, policies and documentation; if anything in this course conflicts with them, they control.",
  ],
};

export const module2 = {
  id: 'dev-module-2',
  number: 2,
  title: 'Production-Grade Prompting, Agents & Tool-use',
  shortTitle: 'Prompting, Agents & Tools',
  summary:
    'Tool schemas, streaming, context engineering, agent loops, memory scope, and multimodal ingestion.',
  duration: '~2h 20min',
  lede: 'Writing code that uses Claude is different from using Claude to write code. Each topic addresses a specific failure mode that is frequently overlooked during development but requires significant time and effort to resolve after development is underway.',
  objectives: [
    'Write production-ready prompts using system prompts, XML tags, few-shot examples, and output constraints, and diagnose why a prompt underperforms when first-pass results miss the mark.',
    'Decide when to enable extended thinking, calibrate its effort setting, and handle thinking blocks correctly across tool-use turns.',
    'Define and implement a tool schema that Claude selects correctly, construct the tool-use loop, handle multi-turn message blocks, and distinguish when to use a single tool call versus multiple parallel calls.',
    'Consume a streamed response, assemble streamed events into complete content blocks, and recover cleanly when a stream is interrupted partway through.',
    'Apply context engineering techniques including managing the context window, compacting, clearing history between tasks, and subagent handoffs, to keep multi-turn agent sessions within budget without losing task continuity.',
    'Build a production agent by choosing between workflow and agent patterns, wiring tools and context into a working loop, selecting a wiring path that fits your deployment constraints, and adding Human-in-the-loop (HITL) checkpoints where actions are irreversible.',
    'Manage agent memory across sessions using persistent storage patterns and choosing the right memory scope so that agent state survives across turns without inflating context cost.',
    'Send images and PDFs to Claude using the correct message block structure, apply the Files API for reusable assets, and submit high-volume workloads using the Message Batches API so they complete asynchronously.',
  ],

  sections: [
    {
      id: 'dev-m2-orientation',
      eyebrow: 'Orientation',
      duration: '2 min',
      title: 'What you will be able to do by the end',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Writing code that uses Claude is different from using Claude to write code.',
        },
        {
          type: 'p',
          text: 'You have probably used Claude interactively when you’ve typed a prompt, read the response, and adjusted it as needed. This module addresses all subsequent aspects of using Claude beyond this basic level, including tool schemas, context management, and agent loops. This module builds upon your ability to shape Claude’s outputs. As an engineer, you are responsible for programmatically integrating Claude, ensuring reliable output handling, and successfully deploying a robust production solution.',
        },
        {
          type: 'p',
          text: 'Each topic in this module addresses a specific failure mode that is frequently overlooked during development but requires significant time and effort to identify and resolve after development is underway. When you learn to identify and avoid these failure modes, you’ll be positioned to effectively and efficiently integrate Claude into your development processes.',
        },
        {
          type: 'p',
          text: 'This module is for the Developer who is ready to use Claude to take a prototype and turn it into a full production system that holds up during real usage. You are practical, code-forward, and pattern-oriented. This module assumes you are already comfortable writing code; it does not teach programming fundamentals, and it is not about using Claude casually in a chat window. It teaches the engineering decisions around the model: how to structure prompts, define tools, handle streaming safely, manage context and memory, and build agent loops that stay reliable, affordable, and controllable once deployed.',
        },
        {
          type: 'callout',
          variant: 'key',
          title: '“The build” in this module',
          body: [
            'Everything in this module is built around one recurring engineering problem: a Claude integration that worked well during development but now has to hold up in production. In development, the prompt looked solid, the tool call worked, the session stayed short, and the test inputs were manageable. However, in production, that same system has to survive longer sessions, larger tool outputs, interrupted streams, tighter cost and latency constraints, memory across turns, and actions that may be irreversible.',
            'This module teaches you which implementation decision prevents which production failure.',
          ],
        },
        disclaimer,
      ],
    },

    {
      id: 'dev-m2-prompting-craft',
      eyebrow: 'Teaching · Prompting Craft',
      duration: '20 min',
      title: 'System prompts, XML, few-shot, and output constraints',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'A prompt that works once in interactive use often breaks when it runs in production against untested inputs. The fix for this isn’t just adding more words, it is identifying which structural piece is missing from the prompt and adding that one piece.',
        },
        {
          type: 'h',
          level: 3,
          text: 'Four techniques that give Claude a reliable output shape',
        },
        {
          type: 'p',
          text: 'When a first-pass response misses, the instinct is often to add more words to the prompt and run it again. However, that instinct can make the problem harder to isolate and rarely fixes it. Rewording changes how you say something but does not add to the structural piece of the prompt that’s missing. For example, if Claude is crossing the boundary between your instructions and your input data, clearer phrasing will not fix it, and if the output format keeps drifting, "please format this correctly" will not fix it either.',
        },
        {
          type: 'p',
          text: 'The failure mode tells you which of the four techniques is absent. Diagnose how your prompt is failing first, then add the specific technique that addresses that failure.',
        },
        {
          type: 'table',
          caption: 'Failure mode → missing technique',
          headers: ['What you observed', 'What the prompt is missing', 'Why this technique is the fix'],
          rows: [
            [
              'The result comes back in the wrong shape: a sentence where you expected a label, prose where you expected JSON.',
              'An output constraint. The prompt never specified the form, field names, or stopping point of the response.',
              'An output constraint controls the form of the response independent of its content. Without one, Claude returns plausible text that the downstream parser was not built to accept.',
            ],
            [
              'The content is off: scope drifts, tone shifts, or Claude answers a wider question than you asked, and it gets worse deeper into the conversation.',
              'A system prompt, or a more specific one. The behavioral contract was too vague to hold across turns.',
              'The system prompt sets the rules that apply to every response regardless of the user turn. When it is underspecified, there is nothing holding role, scope, and format steady as the conversation runs on.',
            ],
            [
              'The task is right, but the structure is invented: Claude understood what to do and produced output in a shape you never asked for.',
              'Few-shot examples. Claude cannot infer an exact structure from a description alone.',
              'Few-shot examples show the pattern rather than describe it. One correct input-output pair gives Claude the exact shape to match, which a written instruction often fails to pin down.',
            ],
            [
              'Output is clean on the inputs you tested but breaks on a variant: an edge case, an unusual field, an input you did not anticipate.',
              'A constraint covering the variant. The prompt handles the happy path and has no rule for the case the parser breaks on.',
              'The prompt was validated against a narrow set of inputs. Naming the variant in the constraint, or adding an example that covers it, closes the gap the test inputs never exposed.',
            ],
          ],
        },
        {
          type: 'p',
          text: 'The rule is simple: name the failure, add the one technique that matches it, and re-run it. If it still fails, diagnose again. When a prompt keeps getting longer with every pass, that’s the sign you’re skipping the diagnosis step and just adding words.',
        },
        {
          type: 'h',
          level: 3,
          text: 'Worked example: a classification prompt before and after',
        },
        {
          type: 'p',
          text: 'A developer needs Claude to classify support tickets into three categories: billing, technical, and escalation. The first prompt is a bare instruction with no constraint on the output:',
        },
        {
          type: 'quote',
          label: 'Before',
          text: 'System: "You are a support classifier. Classify the ticket."\n\nUser: <ticket>I was charged twice for the same month.</ticket>',
        },
        {
          type: 'p',
          text: 'Claude returns "Billing" on some runs, "billing" on others, and occasionally a full sentence like "This looks like a billing issue." The downstream router expects one of a fixed set of labels and breaks on the inconsistency.',
        },
        {
          type: 'quote',
          label: 'After',
          text: 'System: "You are a support classifier. Classify each ticket into exactly one of: BILLING, TECHNICAL, ESCALATION. Return only the label. No other text."\n\n<sample_input>My account shows two charges for April.</sample_input>\n<ideal_output>BILLING</ideal_output>\n\n<sample_input>The API keeps returning a 429 error.</sample_input>\n<ideal_output>TECHNICAL</ideal_output>\n\nUser: <ticket>I was charged twice for the same month.</ticket>',
        },
        {
          type: 'p',
          text: 'Three techniques are doing distinct work here. The system prompt sets the output contract: exactly one label from a fixed set, nothing else. The XML tags mark where each example ends and the next begins, so Claude does not read the examples as part of the instruction. The few-shot pairs show the exact casing and format rather than describing it. Together they produce a result consistent enough to route programmatically.',
        },
        {
          type: 'table',
          caption: 'How far to stack the techniques',
          headers: ['Move', 'When it applies'],
          rows: [
            [
              'Stack all four techniques',
              'Stacking all four techniques against a clearly defined output contract. Tasks with well-specified formats and edge cases that can be covered by examples.',
            ],
            [
              'Simplify the prompt',
              'Adding all four techniques to a simple task that only needs one. A "summarize this paragraph" prompt does not need few-shot examples and an output schema.',
            ],
            [
              'Diagnose before adding more',
              'Prompts that are growing longer with each iteration rather than more precise. If you have re-prompted five times and the output is still wrong, diagnose the failure type before adding more text.',
            ],
          ],
        },
        { type: 'h', level: 3, text: 'When to reach for each technique' },
        {
          type: 'cards',
          items: [
            {
              eyebrow: 'Technique',
              title: 'System prompts',
              body: 'Carry the behavioral contract for the whole session. Write them once and treat them as your persistent instruction layer. They define Claude’s role, the output format, and any rules that must not change between conversations.',
            },
            {
              eyebrow: 'Technique',
              title: 'XML tags',
              body: 'Used when the prompt mixes inputs with instructions. A prompt that asks Claude to debug code using provided documentation is a good example; without tags, the code and the documentation look the same to Claude. Wrap them with descriptive tag names like <my_code> and <docs>. You do not need official XML tag names; descriptive names that match your content work best.',
            },
            {
              eyebrow: 'Technique',
              title: 'Few-shot examples',
              body: 'Useful because they show rather than just tell. Instead of describing the exact format you want, provide one correct input-output pair and let Claude infer the pattern. Wrap examples using consistent XML structure, for instance <sample_input> and <ideal_output>. You can use examples from your highest-scoring evaluation outputs rather than writing them from scratch.',
            },
            {
              eyebrow: 'Technique',
              title: 'Output constraints',
              body: 'The last line of defense before Claude’s response reaches your parser. Specify exactly what you need, including field names, types, length limits, whether to include preamble, and what to do when data is absent. Use structured output features when the format must be machine-readable.',
            },
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Moving output control from the prompt into the API with structured outputs',
        },
        {
          type: 'p',
          text: 'Everything up to this point shapes the output by writing instructions into the prompt and hoping Claude follows them. That works most of the time, but the prompt is a request, so a model can still return a stray sentence, a wrong field name, or malformed JSON that breaks the parser downstream.',
        },
        {
          type: 'p',
          text: 'The Claude API has a separate mechanism that removes that gap for production code. It is called structured outputs, and instead of asking for a shape in words, you hand the API a JSON schema, and the model is constrained at generation time to produce output that matches it. This technique is constrained decoding: as Claude generates each token, the API only allows tokens that keep the output valid against your schema, so a response that violates the schema cannot be produced in the first place.',
        },
        {
          type: 'ul',
          items: [
            '**JSON outputs constrain the final response.** You set the `output_config.format` parameter with type `json_schema` and your schema, and Claude returns valid JSON in the response text that matches that schema every time. Reach for this when the model itself is producing the structured payload your code consumes, like extracting fields from a support ticket or formatting an API response, because it removes the parse-and-retry code you would otherwise write around every call.',
            '**Strict tool use constrains the inputs Claude passes to your tools.** You set `strict` to true on a tool definition, and the arguments Claude sends to that tool are validated against the input schema before your code runs. Reach for this in agentic loops where a malformed tool argument would crash the function or trigger a wrong action.',
          ],
        },
        {
          type: 'p',
          text: 'The reason this belongs in the production code and not just in the prompt is because of reliability under inputs you did not test. A prompt-level instruction to return only JSON holds on the cases you tried and then slips on an edge case you did not. A schema constraint does not slip, because the API enforces it on every token rather than trusting the model to remember the instruction.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Four costs of constraining generation',
          body: [
            '**The first request on a new schema is slower.** The API compiles your schema into a grammar before it can constrain output. Compiled grammars are cached for 24 hours from last use, so steady traffic on a stable schema pays the cost once, but a workload that changes schemas constantly pays it repeatedly.',
            '**Your input token count rises.** When structured outputs are on, the API adds a system prompt describing the expected format, and that injected prompt is billed like any other input token.',
            '**A guaranteed schema is not a guaranteed success.** Two cases still return output that does not match: a refusal (`stop_reason: refusal`) and a truncation (`stop_reason: max_tokens`). Your code still checks `stop_reason` rather than assuming every response parses.',
            '**It does not combine with message prefilling.** JSON outputs and prefilling the assistant message are incompatible. Pick the one that fits the task.',
          ],
        },
      ],
    },

    {
      id: 'dev-m2-prompt-watchout',
      eyebrow: 'Watch Out · Prompting Craft',
      duration: '5 min',
      title: 'The prompt that grew longer instead of better',
      blocks: [
        {
          type: 'p',
          text: 'Even though a prompt looks ready for production, it can still produce quiet failures. Sometimes edge cases cause fields to go missing or constraints to be ignored; when this happens, it’s often because constraints weren’t specified precisely enough.',
        },
        {
          type: 'table',
          caption: 'Six revision passes, each one longer than the last',
          headers: ['Pass', 'What was added', 'Output behavior'],
          rows: [
            [
              '1',
              '"Classify this ticket as billing, technical, or escalation."',
              'Returns full sentences: "This appears to be a billing issue." Parser breaks.',
            ],
            [
              '2',
              'Added "Be concise." and "Use only the category name."',
              'Returns "Billing" capitalized sometimes, "billing" lowercase other times. Router breaks on case mismatch.',
            ],
            [
              '3',
              'Added three paragraphs describing each category in detail.',
              "Output correct on simple tickets. For ambiguous tickets, returns 'billing/technical' instead of a single label. Parser breaks on the slash.",
            ],
            [
              '4',
              'Added "Never return two categories." and "If ambiguous, choose the most likely one."',
              "Works on 80% of tickets. Fails on tickets that could reasonably fit two categories (e.g., 'I was charged but the feature also stopped working'). Here it returns a full explanation instead of a label.",
            ],
            [
              '5',
              'Added two more paragraphs about edge cases and a reminder to be precise.',
              'The verbose prompt is now producing verbose output, over 2,000 characters per call, as long, unfocused prompts tend to produce long, unfocused outputs. Latency has increased significantly due to output length, but accuracy has not improved.',
            ],
            [
              '6',
              'Replaced all instructions with a JSON schema and two few-shot examples showing exact input/output pairs',
              'Returns {"category": "billing"} on every ticket. Parser works. Latency drops. Accuracy on ambiguous tickets matches Pass 4.',
            ],
          ],
        },
        {
          type: 'p',
          text: 'Two things went wrong across these six passes and they are worth identifying separately. **Pass 4 is the diagnostic failure:** the developer identified the wrong problem, added description instead of a constraint, and the output stayed broken. **Pass 5 is the engineering failure:** the prompt became verbose enough to induce a latency regression, and the model calibrates response length to match the input, generating over 2,000 characters per call, with no accuracy gain.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'What to watch out for',
          body: [
            'Every pass made the prompt longer and none of them added the missing output constraint. The developer was describing the problem more precisely with each iteration, but Claude does not need a detailed description of what a billing ticket looks like, instead it needs to know that the only acceptable response is one word in all capital letters.',
            'The fix is two lines: an output constraint specifying the exact format and a few-shot example covering the ambiguous case. The six-pass trace is a pattern to recognize early: if three re-prompts in a row have not worked, stop adding text and diagnose which technique is missing.',
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Checkpoint 1 · Fix the broken prompt',
        },
        {
          type: 'p',
          text: 'The prompt below extracts a JSON object from a support ticket with three fields: category, urgency, and a one-sentence summary. It contains one defect. Write the corrected system prompt that fixes it.',
        },
        {
          type: 'quote',
          label: 'Broken prompt',
          text: 'System: "You are a support ticket processor. Extract the key information from the ticket below."\n\nUser: <ticket>My API key stopped working after I rotated it last night. I have a production deployment that is failing. This needs to be fixed immediately.</ticket>',
        },
        {
          type: 'quote',
          label: 'Model answer',
          text: 'System: "You are a support ticket processor. Extract the key information from each ticket and return only a JSON object with exactly these three fields: category (one of: billing, technical, escalation), urgency (one of: low, medium, high, critical), and summary (a single sentence describing the issue). Return only the JSON object. No other text."\n\nExpected output: {"category": "technical", "urgency": "critical", "summary": "Developer\'s API key stopped working after rotation, causing a production deployment failure that needs immediate resolution."}',
        },
        {
          type: 'p',
          text: 'The defect was a missing output constraint. The original system prompt never specified the JSON structure, the exact field names, their allowed values, or the instruction to return nothing else. Without that contract, Claude returns plausible but inconsistent output that breaks any downstream parser expecting a specific schema.',
        },
      ],
    },

    {
      id: 'dev-m2-extended-thinking',
      eyebrow: 'Teaching · Extended Thinking',
      duration: '12 min',
      title: 'Turning reasoning on, calibrating effort, and reading it back correctly',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'The prompting techniques shape what Claude produces. Extended thinking shapes how much work Claude does before it answers. Turn it on, and the model writes out its step-by-step reasoning first, then gives you the final answer. Your job is to decide when that extra work is worth the cost and to handle the reasoning it sends back.',
        },
        { type: 'h', level: 3, text: 'What extended thinking does' },
        {
          type: 'p',
          text: 'When you turn on extended thinking, the model "thinks out loud" before it responds. You’ll see this reasoning come back as its own thinking block in the API response, positioned just ahead of the block that holds the actual answer. On the newest models, the thinking block’s content is omitted by default; you must request a readable summary through the display setting to see it.',
        },
        {
          type: 'p',
          text: 'On current models reasoning is adaptive: you enable it with the thinking parameter where it is not already on by default, and the model decides how much reasoning each request needs. You tune depth with the effort setting rather than a fixed token budget. The older `budget_tokens` control is deprecated and, on the newest model generations, returns a 400 error.',
        },
        {
          type: 'p',
          text: 'That reasoning isn’t free; thinking tokens cost the same as output tokens, so running a simple task at high effort means paying for accuracy you don’t need. Don’t reach for extended thinking by default, apply it strategically where needed.',
        },
        {
          type: 'table',
          caption: 'When to use extended thinking',
          headers: ['Task shape', 'Extended thinking call', 'Reason'],
          rows: [
            [
              'Multi-step reasoning where the model has to hold several constraints at once: a math derivation, a multi-hop logic problem, planning a sequence of dependent actions.',
              'Enable it, with the effort level matched to the depth of the problem.',
              'The reasoning pass is where the model works through dependencies it would otherwise skip.',
            ],
            [
              'Mechanical or lookup tasks: classification, format conversion, extracting a field, short factual answers.',
              'Leave it off.',
              'Extended thinking will not improve the answer, and you will be paying more tokens for something you didn’t need. A bare prompt with an output constraint is the right tool.',
            ],
            [
              'Agentic loops where the model plans across several tool calls.',
              'Enable it and budget for the planning step rather than per call.',
              'Reasoning before a plan reduces wrong-tool selection downstream. Note the carry-back rule, which applies in every tool-use loop.',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'The carry-back rule: thinking blocks must return to the API unchanged',
          body: [
            'When extended thinking is on and your conversation uses tools, every thinking block you get back has to go back to the API exactly as it arrived on the next turn. Each block comes with a signature that confirms the reasoning wasn’t tampered with. If you edit it, summarize it, or drop it, the signature stops matching and the API rejects the request.',
            'Redacted thinking blocks work the same way. Their contents are encrypted and not meant to be read by humans, but they still have to be returned untouched.',
            'This is a structural requirement, not a prompting choice. The most common slip-up is stripping out the thinking block to save context, which ends up breaking your next request. If the real worry is accumulated reasoning, the fix is context engineering.',
          ],
        },
        {
          type: 'compare',
          items: [
            {
              tone: 'positive',
              label: 'Handles well',
              title: 'Hard reasoning and planning',
              body: 'Tasks where a wrong answer is expensive and the extra tokens buy accuracy.',
            },
            {
              tone: 'negative',
              label: 'Use a different approach',
              title: 'Classification, extraction, format tasks',
              body: 'A well-constrained prompt is cheaper and just as accurate. Adds cost or complexity: the carry-back requirement in tool-use loops, and an effort setting you now must calibrate.',
            },
          ],
        },
      ],
    },

    {
      id: 'dev-m2-tool-use',
      eyebrow: 'Teaching · Tool-use and Schema Design',
      duration: '20 min',
      title: 'Tool schemas Claude selects correctly: definition, loop, and calling patterns',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'With tool-use, you’re not steering language toward a good answer anymore, you’re handing Claude a set of actions and trusting it to pick the right one; that pick is driven almost entirely by what you wrote in the schema.',
        },
        { type: 'h', level: 3, text: 'How the tool-use loop works' },
        {
          type: 'p',
          text: 'The most common misconception about tool-use is that Claude runs the tools. Instead, Claude reads your tool definitions, decides which one fits the situation, and tells your application what to call it along with the required inputs. Your application executes the tool, gets the result, and sends it back; then Claude uses that result to continue.',
        },
        {
          type: 'steps',
          items: [
            {
              title: 'Define schema',
              text: 'You define a schema with a name, a description, and an input schema. Claude reads this to decide whether and when to call the tool.',
            },
            {
              title: 'Send message',
              text: "Your code sends a message to Claude including the tool definitions and the user's input.",
            },
            {
              title: 'tool_use block',
              text: 'Claude issues a tool-use block containing the tool name, a unique ID, and the input arguments it wants to pass. The API response comes back with `stop_reason: tool_use`.',
            },
            {
              title: 'Execute tool',
              text: 'Your code executes the tool using those arguments. Note that the assistant turn has already ended (Claude is not holding a connection open or waiting on your server). The model is stateless between calls. To continue, your code makes a fresh API request containing the prior messages plus the tool result.',
            },
            {
              title: 'Return result',
              text: 'You return the result in a tool-result block that references the original tool-use ID.',
            },
            {
              title: 'Claude continues',
              text: 'Claude continues using the tool result as context for its next response, either another tool-use block or a final end turn.',
            },
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Message block structure in a tool-use conversation',
        },
        {
          type: 'p',
          text: 'A tool-use conversation is built out of structured blocks, not plain text. Each assistant turn and user turn is a list of blocks, and four block types do the work in a tool-use session.',
        },
        {
          type: 'table',
          headers: ['Block type', 'Role', 'Contains', 'Critical rule'],
          rows: [
            [
              'text block',
              'Assistant/Claude',
              'Claude’s prose output',
              'Claude may return a text block alongside a tool_use block in the same turn. When it does, your code must preserve the full content array, including the text block, when appending that turn to conversation history. Dropping the text block corrupts the context Claude relies on for follow-up turns.',
            ],
            [
              'tool_use block',
              'Assistant/Claude',
              'The tool name, a unique ID, and the input arguments Claude wants passed to your function',
              'Every tool_use block must be answered by a tool_result block in the immediately following user turn. The tool_result must carry the same ID. Without that pairing, the API rejects the next request.',
            ],
            [
              'tool_result block',
              'User',
              'Matching tool_use ID, the result content, and an optional is_error flag set to true when the tool call fails',
              'The tool_use_id value must match the original tool_use block exactly. Claude uses this ID to connect each result back to the call that produced it, which matters when a single assistant turn issues multiple tool calls and the results arrive in a different order.',
            ],
            [
              'thinking block',
              'Assistant (extended thinking only)',
              'Claude’s internal reasoning, visible only when extended thinking is enabled',
              'The block must be passed back to the API unchanged in subsequent turns. The signature verifies the reasoning hasn’t been modified, so any edit or summary breaks the signature and the API rejects the message. Redacted thinking blocks follow the same rule.',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'The critical invariant',
          body: [
            'Every tool_use block from an assistant turn must have a corresponding tool_result block in the immediately following user turn. Missing tool_result blocks, or tool_result blocks that appear in a later turn rather than the immediately following user turn, cause an API validation error.',
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Schema anatomy: what Claude reads to make a tool selection decision',
        },
        {
          type: 'p',
          text: 'A tool schema has three parts, including name, description, and input_schema. The description determines whether Claude selects the tool correctly or not.',
        },
        {
          type: 'ul',
          items: [
            '**Name:** A short identifier that should be specific. For example, `get_account_balance` is more useful to Claude than `get_data`.',
            '**Description:** A critical part that Claude reads to decide whether a tool is required or not. Always write the description in two parts, including when to and when not to use the tool. A description that says "use this to find information" will cause wrong selections. A description that says "use this to retrieve the current balance for a specific account ID and do not use this for transaction history" gives Claude an exclusion condition to work with.',
            '**input_schema:** Defines the parameters using JSON Schema. Mark parameters as required when Claude requires them to call the tool correctly, and optional when the tool can operate without them. Overlapping parameter types between tools is the most common source of wrong-tool calls.',
          ],
        },
        {
          type: 'table',
          caption: 'Decision table: schema design choices',
          headers: ['Decision', 'How to handle it', 'Why it matters'],
          rows: [
            [
              'Subtask dependency',
              'When one tool’s output feeds the next, the calls have to run in sequence because the second call cannot be built until the first result comes back. When the subtasks are independent, structure the tool set so Claude issues multiple tool_use blocks in a single turn and your code runs them concurrently.',
              'This is the one decision that changes how you design the schema. Current Claude models default to parallel calls when calls are independent. Where a real dependency exists, model it as separate turns. Use `disable_parallel_tool_use` to force one tool call per turn if needed.',
            ],
            [
              'Required fields',
              'Mark a field as required only when the call doesn’t make sense without it. Place these in the required array of the input schema.',
              'Marking everything required forces Claude to fabricate values for fields it has no basis to fill in. The required array is how you tell Claude which inputs are non-negotiable.',
            ],
            [
              'Optional fields',
              'Use optional fields for parameters with sensible defaults or where absence carries meaning. Leave them out of the required array and give them defaults in the function signature.',
              'Optional fields let Claude omit information it doesn’t have, instead of guessing. If a field is optional but marked required, every call must invent a value, which can cause bad inputs.',
            ],
            [
              'Description length',
              'Write three to four sentences per tool covering what it does, when Claude should reach for it, and what it returns. Include examples of valid inputs where format matters.',
              'If the description is too short, Claude guesses. If it is too long, the trigger conditions get buried under detail Claude doesn’t reference at decision time.',
            ],
            [
              'Overlapping parameter types',
              'When two tools accept the same parameter shape, add disambiguating language to each description that names the domain or trigger the tool is meant for.',
              'Claude routes on name plus description, with parameter types as a secondary signal. When signatures are identical, routing collapses to description alone.',
            ],
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Worked example: a schema that causes wrong-tool selection and the fix',
        },
        {
          type: 'p',
          text: 'A developer registers two tools, `search_knowledge_base` and `get_cached_result`. The tool names are distinct, but Claude’s tool selection weighs descriptions heavily; when descriptions overlap, name alone is not sufficient to disambiguate. Both have descriptions that start with "use this to find information." Without exclusion conditions, Claude frequently selected the wrong tool on ambiguous inputs during development testing.',
        },
        {
          type: 'quote',
          label: 'The fix: one exclusion sentence per description',
          text: 'search_knowledge_base: "Use this to search the knowledge base when the user asks a question that requires looking up current information. Do not use this if the result of a prior search in this session already covers the question."\n\nget_cached_result: "Use this to retrieve a result that was already fetched during this session. Only use this if search_knowledge_base was called earlier in this conversation for the same query."',
        },
        {
          type: 'p',
          text: 'The exclusion conditions give Claude a decision rule rather than two identical-looking options. These conditions rely on complete conversation history being passed in each request. If prior turns are truncated or dropped, Claude cannot evaluate them and the exclusion logic silently fails.',
        },
        {
          type: 'compare',
          items: [
            {
              tone: 'positive',
              label: 'Handles well',
              title: 'Reliable routing',
              body: 'Routing Claude to the right tool reliably when descriptions are specific and exclusion conditions are stated.',
            },
            {
              tone: 'negative',
              label: 'Poor fit',
              title: 'Two tools that do similar things',
              body: 'When they need ever-longer descriptions to keep apart: at that point, merge them into one tool with a type parameter instead.',
            },
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'MCP as an alternative to manual schema authoring',
        },
        {
          type: 'p',
          text: 'The Model Context Protocol, MCP, is a standardized communication layer that moves tool definitions and execution out of your application code and into dedicated servers. When an MCP server exists for the service you want to reach, you can connect directly to the MCP server rather than building the integration yourself.',
        },
        {
          type: 'p',
          text: 'The loop you built earlier does not change when you introduce MCP. Claude still issues a tool_use block, your application still executes the tool and returns a tool_result, and the message block pairing rules still apply. The difference is in the setup step. Instead of registering schemas you wrote, your MCP client sends a ListToolsRequest to the MCP server, receives the full tool list back, and passes those definitions to Claude. From Claude’s perspective, those tools are indistinguishable from ones you authored manually.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'MCP servers cost context even when unused',
          body: [
            'MCP servers add tool definitions to the context window even when the tools are not being used in the current turn. If you connect several servers at once, the tool definitions themselves consume budget before the first message arrives. Register only the servers you are actively using.',
            'If you are using the API MCP Connector, you control loading cost through an `mcp_toolset` object in the tools array. The `defer_loading` boolean delays loading a tool definition until the model needs it. The `enabled` boolean turns individual tools on or off. The MCP Connector requires the `mcp-client-2025-11-20` beta header to be set on the request.',
          ],
        },
        {
          type: 'p',
          text: 'MCP runs over one of two transports. Local servers use stdio and your application spawns the server as a subprocess and communicates over standard input and output. Remote servers use Streamable HTTP, using POST for client-to-server messages and an optional GET-based SSE stream for server-initiated messages. An older SSE-only transport exists but is deprecated. Only HTTP-exposed servers are supported through Anthropic’s MCP connector; stdio servers require managing the MCP client connection yourself via the SDK.',
        },
        {
          type: 'cards',
          items: [
            {
              eyebrow: 'Use MCP when',
              title: 'A maintained server already exists',
              body: 'Check that it covers the specific operations you require and is actively maintained against the service’s current API. Note that the Claude API MCP Connector only supports remote servers. Local stdio servers require Claude Desktop or Claude Code as the client.',
            },
            {
              eyebrow: 'Write schemas manually when',
              title: 'No server covers your case',
              body: 'Or when you need precise control over tool scope and description quality. Note the API MCP Connector supports allowlisting and denylisting specific tools per server via MCPToolset configuration, so manual authoring may be warranted for description quality but not always for scope.',
            },
            {
              eyebrow: 'Use both when',
              title: 'Breadth plus precision',
              body: 'Connect to an MCP server for breadth then apply description-tuning discipline to the specific tools you are actively routing to. Narrowing the tool set and sharpening the descriptions are two separate levers, and you should use both.',
            },
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Watch out: the description that sent Claude to the wrong tool',
        },
        {
          type: 'p',
          text: 'A schema can look correct and still fail. Typed parameters and passing happy-path tests tell you the structure is valid, but they do not tell you whether Claude can reliably choose between your tools when an input sits near the boundary of two overlapping descriptions.',
        },
        {
          type: 'quote',
          label: 'The diagnostic exchange',
          text: 'Developer: "Why does Claude keep calling search_docs when the answer is already in the context? I\'ve re-run this four times, and it keeps going to the wrong tool."\n\nSenior Developer: "What does the description for search_docs say?"\n\nDeveloper: "\'Use this to find information about the product.\'"\n\nSenior Developer: "And what does get_context_summary say?"\n\nDeveloper: "\'Use this to retrieve relevant information from the current session.\'"\n\nSenior Developer: "Those descriptions are the same thing from Claude\'s perspective. Both say, \'find information.\' One of them needs to say when not to call it."\n\nDeveloper: "That\'s two sentences."\n\nSenior Developer: "Right. One to say when to use it, one to say when not to. That\'s the whole fix."',
        },
        {
          type: 'p',
          text: 'Claude selects a tool by reasoning over all registered descriptions in the context of the full conversation. When two descriptions look similar, that reasoning has no reliable signal to distinguish them so Claude picks based on small surface differences that may not correspond to the distinction you intended. If the descriptions cannot be cleanly separated even with exclusion conditions, the tools may need to be merged into one with a type parameter instead.',
        },
      ],
    },

    {
      id: 'dev-m2-streaming',
      eyebrow: 'Teaching · Streaming Responses',
      duration: '16 min',
      title: 'Streaming responses and handling partial output without corrupting state',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Streaming sends the response in pieces as the model generates them. That makes things feel faster, but it also gives your code a new job: you are tasked with assembling the final content yourself, and you need to be prepared if the series stops early.',
        },
        { type: 'h', level: 3, text: 'What streaming changes about the response' },
        {
          type: 'p',
          text: 'In a non-streamed request, the API hands you one complete message with every content block, fully formed. In a streamed request, the API instead sends a series of events that describe the message as it’s being built. Your code listens to that series and reassembles the blocks. The message you end up with is identical to what a non-streamed call would have given you, but the difference is that you have to assemble the pieces, and you decide what to do if the events stop before the message is finished.',
        },
        {
          type: 'p',
          text: 'It helps to know what’s not happening: the model isn’t holding some live object open for you. Each event is its own small message describing a single change, a block started, some text or input got added to it, a block finished, the whole message finished. Your handler takes each event and applies it to the partial state it’s been building up.',
        },
        {
          type: 'table',
          caption: 'The event sequence, and what your handler does with each',
          headers: ['Event', 'What it signals', 'What your handler does'],
          rows: [
            [
              'message_start',
              'A new message is beginning. Carries the message shell with empty content and initial usage.',
              'Set up an empty content array to collect blocks in.',
            ],
            [
              'content_block_start',
              'A new content block is opening, with its type (text, tool_use, or thinking) and index.',
              'Make a slot at that index for the named block type. A tool_use block opens with its name and id, but no input yet.',
            ],
            [
              'content_block_delta',
              'An incremental piece of one block: a text fragment, a fragment of JSON input for a tool call, or a thinking fragment.',
              'Append the fragment to the block at that index. Tool-call inputs arrive as a partial JSON string spread across several deltas, you can’t parse them until the block closes.',
            ],
            [
              'content_block_stop',
              'The block at this index is complete.',
              'Finalize the block. For a tool_use block, this is the first moment the accumulated JSON input is complete enough to parse.',
            ],
            [
              'message_delta',
              'Top-level changes to the message: the stop_reason and final usage counts.',
              'Record the stop_reason. It tells you whether the model finished or stopped for some other reason.',
            ],
            [
              'message_stop',
              'The stream is complete.',
              'The assembled content array is now the finished message. From here, treat it exactly like a non-streamed response.',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'The rule that keeps your state from getting corrupted: don’t act on a partial block',
          body: [
            'The tool_use block is the one to watch. Its input shows up as a partial JSON string spread across many content_block_delta events, and that string isn’t valid JSON until content_block_stop closes the block. If your code tries to parse the input or run the tool before the block closes, it either chokes on malformed JSON or runs with half the arguments missing. Collect the deltas, and act only after content_block_stop for that block.',
            'The same discipline applies when you add a streamed assistant turn to your conversation history. Add it only after message_stop, with every block fully assembled.',
          ],
        },
        { type: 'h', level: 3, text: 'When the stream stops early' },
        {
          type: 'ul',
          items: [
            'Track completion on purpose. A turn is usable only once `message_stop` has arrived. Until then, treat what you’ve accumulated as provisional.',
            'On an interrupted stream, throw away the partial assistant turn instead of saving it to history, then retry the request. Committing a half-built turn is exactly what breaks the following request.',
            'Check the `stop_reason` from `message_delta` before you continue a loop. A stop_reason of `tool_use` means your assembled tool calls are ready to run; any other value means you’re on a different path.',
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Watch out: the stream that left a half-written tool call in the history',
        },
        {
          type: 'p',
          text: 'An agent used streaming so its operators could watch responses generate in real time. The handler accumulated content_block_delta events and appended the assistant turn to history when its read loop ended. In testing on a fast local connection, streams always ran to completion, so the loop always ended at message_stop and the stored turns were always complete.',
        },
        {
          type: 'p',
          text: 'In production, a network blip ended one stream after the tool_use block had opened and received part of its JSON input, but before content_block_stop. The read loop ended the same way it always had, so the handler appended the turn: an assistant turn containing a tool_use block whose input string was truncated JSON. The operator saw a partial answer and retried. The retry request included that corrupted turn in history, and the API rejected it with a validation error pointing at the malformed tool_use block.',
        },
        {
          type: 'p',
          text: 'The team spent an afternoon inspecting the schema and the retry logic, because the error surfaced on the retry request. However, the actual cause was upstream: the handler treated ‘the read loop ended’ as equivalent to ‘the message is complete,’ and those are not the same.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'What to watch out for',
          body: [
            'A stream ending is not the same as a message completing. Only `message_stop` means the message is whole. Gate the history append on message_stop, discard the partial turn on interruption, and retry from the last complete turn. When a tool-use error appears on a retry, check whether the prior turn was assembled from a stream before you touch the schema.',
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Checkpoint 4 · Repair the broken stream handler',
        },
        {
          type: 'quote',
          label: 'Broken handler',
          text: 'blocks = {}\nstop_seen = False\nwith client.messages.stream(model=model, max_tokens=4096, messages=messages, tools=tools) as stream:\n    for event in stream:\n        if event.type == "content_block_start":\n            blocks[event.index] = init_block(event)\n        elif event.type == "content_block_delta":\n            apply_delta(blocks[event.index], event.delta)\n        elif event.type == "message_stop":\n            stop_seen = True\nmessages.append({"role": "assistant", "content": assemble(blocks)})',
        },
        {
          type: 'quote',
          label: 'Model answer',
          text: '# Only append the assistant message if the stream completed successfully.\nif stop_seen:\n    messages.append({\n        "role": "assistant",\n        "content": assemble(blocks)\n    })',
        },
      ],
    },

    {
      id: 'dev-m2-context-engineering',
      eyebrow: 'Teaching · Context Engineering',
      duration: '16 min',
      title: 'Model selection and keeping multi-turn sessions in budget',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Every tool result Claude returns gets appended to the context window and stays there for the rest of the session. In a single-turn prompt, that’s invisible. In a multi-step agent session running ten or twenty tool calls, the window fills up fast, and once it fills, the agent either compacts (losing detail) or stalls before the task is done.',
        },
        {
          type: 'p',
          text: 'So, the question for any agent workflow is whether you’ve decided in advance what goes into the context window, what comes back out as a summary, and what never enters at all. That set of choices is context engineering.',
        },
        {
          type: 'h',
          level: 3,
          text: 'Model selection: start with Sonnet, move deliberately',
        },
        {
          type: 'p',
          text: 'The Claude model family currently spans four tiers: Fable, Opus, Sonnet, and Haiku. Sonnet is the balanced default for most production workloads. Haiku is built for speed and cost efficiency. Opus handles demanding work above the Sonnet envelope, and Fable is Anthropic’s most capable model. Move up to Opus only when an eval set tells you Sonnet isn’t meeting your quality bar. Move down to Haiku only when an eval set tells you the quality regression is acceptable at your task, not just to save costs. Your decision to move models should always be a measured decision.',
        },
        { type: 'h', level: 3, text: 'The context window is not a free resource' },
        {
          type: 'p',
          text: 'If a request is already larger than the context window, the Messages API rejects it with a validation error before generation; if a request fits but generation reaches the ceiling partway, current models return the output generated so far with a `model_context_window_exceeded` stop reason. Neither path silently truncates your oldest content. If you want a session to keep running past the window limit, your application must manage that itself by trimming or summarizing history before the next request goes out.',
        },
        {
          type: 'p',
          text: 'In development, the window rarely fills because test inputs are small and sessions are short. In production, tool outputs are often three to five times longer than test fixtures, sessions run for more turns, and the window fills at turn eight rather than turn fifty. The cost of not planning for this is a production outage.',
        },
        {
          type: 'table',
          caption: 'Four strategies for staying in budget',
          headers: ['Strategy', 'What it does', 'When to apply', 'What continuity you lose'],
          rows: [
            [
              'Pruning',
              'Lets you jump back to an earlier message and continue from there, removing the conversation that came after.',
              'After Claude has gone down an unproductive path or accumulated debugging back-and-forth that won’t help the next task.',
              'The work done after the rewind point is gone. If Claude learned something useful in that stretch, it has to relearn it.',
            ],
            [
              'Compaction',
              'Summarizes the conversation history into a condensed version that preserves the key information Claude has learned. The summary costs fewer tokens than the original turns. (`/compact` in Claude Code; server-side compaction in the API is a beta strategy, with manual summarization as the client-side alternative.)',
              'When the session is approaching the context ceiling but you want to keep working on the same feature with the knowledge Claude has built up.',
              'Details can be lost in the summarization. Anything not captured in the summary will not be available to Claude going forward.',
            ],
            [
              'Clearing',
              'Starts a new conversation with empty context. Nothing from the previous session carries forward. (`/clear` in Claude Code; new session in API.)',
              'When the next task is completely different from the current one, and previous context would only introduce bias or confusion.',
              'All session context is gone. Anything Claude needs to remember across sessions has to be put somewhere persistent, like a CLAUDE.md file.',
            ],
            [
              'Subagent handoffs',
              'Spawns a subagent in its own isolated context window with only the task description and system prompt it needs. The subagent does the work and returns a summary.',
              'When a subtask is self-contained enough to delegate, especially exploration work where the journey clutters the main context but the answer is short.',
              'Visibility into how the subagent reached its conclusion. The intermediate steps are discarded with the subagent’s context.',
            ],
          ],
        },
        { type: 'h', level: 3, text: 'Two more levers: prompt caching and token counting' },
        {
          type: 'p',
          text: 'Prompt caching stores the processing work done on a stable prefix of your request so follow-up requests can reuse it instead of reprocessing the same tokens. The strongest candidates are parts of the request that rarely change across turns: a long system prompt, a large tool definition set, or a reference document you query repeatedly. You enable caching by marking a cache breakpoint with a `cache_control` field of type ephemeral on the last block you want cached. You can place up to four breakpoints.',
        },
        {
          type: 'p',
          text: 'Token counting lets you measure context pressure before a request goes out rather than after it fails. The `count_tokens` endpoint takes the same request body as a messages call and returns the token count without running inference. Use it during development to verify your context budget assumptions hold against real tool outputs, not just test fixtures.',
        },
        { type: 'h', level: 3, text: 'The three places a RAG path can break' },
        {
          type: 'ul',
          items: [
            '**Chunking** decides what a unit of retrievable context is. Split too small and a single chunk lacks the surrounding context to be useful. Split too large and one chunk dilutes the match with unrelated text. Sentence-based or section-based chunking with a little overlap is a reasonable default.',
            '**The embedding match** decides which chunks are returned. It uses a similarity search, so it retrieves content that is semantically close. This is not always what contains the exact term you need. This is why a lexical match is sometimes run alongside the semantic one.',
            '**The assembly step** is where retrieved chunks must reach the model in the structure the prompt expects, otherwise the model answers from memory instead of from the retrieved text.',
          ],
        },
        {
          type: 'p',
          text: 'For a stable reference corpus queried with simple lookups, the index is worth owning. For a changing corpus or multi-step questions, the iterative search is usually the simpler system despite costing more per query.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Under-specified summarizers drop task-critical state',
          body: [
            'When you implement manual compaction in an API session, you write the summarizer prompt yourself, and that prompt determines what the agent will know in subsequent turns.',
            'Compare "summarize the conversation so far" against "summarize the conversation, preserving all file paths modified, all decisions made, and any errors encountered and their resolutions."',
            'This is not an edge case; task-critical state loss from an under-specified summarizer is one of the most common sources of multi-session agent failures.',
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Watch out: the session that ran fine in development, then hit a ceiling in production',
        },
        {
          type: 'p',
          text: 'An agent was built to process sales receipts under a 40k context window token budget, a cap the team set as a cost control rather than the model’s ceiling. Current Claude API models carry at least a 200k-token context window, and the newest flagship models serve 1M tokens by default. Development used twenty receipts, each returning roughly 800 tokens. The full twenty-turn session consumed about 18,000 tokens.',
        },
        {
          type: 'p',
          text: 'In production, receipts contained supporting documentation. Average tool output grew to approximately 3,200 tokens per call. Eight turns of tool output alone added up to roughly 25,600 tokens, and the running total reached the 40k cap at turn eight. The failure looked like degraded tool selection, but the underlying cause was different: the system prompt and early instructions had been crowded out by accumulated tool outputs that were never pruned after use.',
        },
        {
          type: 'table',
          headers: ['', 'Development', 'Production'],
          rows: [
            ['Team budget cap', '40k tokens', '40k tokens'],
            ['Avg. tool output', '~800 tokens per call', '~3,200 tokens per call'],
            ['Turns before window fills', 'Sessions completed without reaching the cap', 'Cap reached at turn 8'],
            [
              'Observed symptom',
              'None. Sessions complete cleanly',
              'Wrong tool selections and incomplete outputs starting turn 8',
            ],
            [
              'Fix',
              'Not applicable',
              'Prune tool outputs after use, and apply compaction proactively before the cap is reached',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'What to watch out for',
          body: [
            'The development test fixtures were shorter than production data. This is true for almost every agent built against a fixture set. Measure the actual token cost of a tool result against the largest input you can find in your target data before the agent ships.',
            'The symptom of context overflow is often misread as a tool selection failure. If you see tool selection degrade after a fixed number of turns, check whether the context window is filling before you start debugging the schema.',
          ],
        },
      ],
    },

    {
      id: 'dev-m2-agent-construction',
      eyebrow: 'Teaching · Agent Construction',
      duration: '22 min',
      title: 'Building a production agent: the loop, wiring paths, orchestration, and HITL',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'An agent is a multi-step tool-use loop with managed context and a defined goal. When components run together across multiple turns, new failure modes appear that isolated testing does not catch. The question that should precede every agent build is: does this problem require an agent?',
        },
        {
          type: 'table',
          caption: 'Workflow or agent: make this decision before you write the first line',
          headers: ['Choose a workflow when…', 'Choose an agent when…'],
          rows: [
            [
              'You can enumerate the exact steps in code.',
              'You can specify the goal and the tools but not the exact path.',
            ],
            [
              'Error cost is real and step-level guardrails matter.',
              'The path through work cannot be enumerated in advance.',
            ],
            [
              'Observability with standard tooling is required.',
              "Non-determinism is acceptable and the agent's possible actions are constrained by its registered toolset.",
            ],
            [
              'The inputs are well-constrained to a known set.',
              'User inputs vary unpredictably in content and structure.',
            ],
            [
              'Every execution of the task follows the same sequence.',
              'The task requires creative sequencing of available tools.',
            ],
          ],
        },
        {
          type: 'p',
          text: 'The most critical mistake in agent development is choosing the wrong pattern at the start. Using an agent when a workflow is sufficient adds behavioral complexity without adding capability. Using a workflow when an agent is needed produces a system that breaks whenever user input deviates from the predetermined path.',
        },
        { type: 'h', level: 3, text: 'Wiring paths: who runs the loop, and what you take on' },
        {
          type: 'p',
          text: 'There are three wiring paths, and they sit on a spectrum of how much infrastructure you own. Choose based on your deployment and compliance constraints; don’t be tempted to choose the path that is just fastest to prototype.',
        },
        {
          type: 'cards',
          items: [
            {
              eyebrow: 'Path 1',
              title: 'Raw Messages API loop',
              body: 'Your code runs every iteration. You own the full loop, tool execution, context management, retries, and exit conditions. Choose this when you need full control, have constraints a library does not accommodate, or are teaching yourself how the loop works. The maintenance cost is yours.',
            },
            {
              eyebrow: 'Path 2',
              title: 'Agent SDK',
              body: 'Runs the same loop inside your own process and hands you tool execution, context management, and the iteration structure already built. Your code still handles tool execution.',
            },
            {
              eyebrow: 'Path 3',
              title: 'Claude Managed Agents (public beta)',
              body: 'Anthropic runs the loop and the sandbox. Your application defines the agent once (model, system prompt, tools, MCP servers, skills), refers to it by ID, sends user events, and streams results back over server-sent events.',
            },
          ],
        },
        {
          type: 'table',
          caption: 'Managed Agents: what you stop owning, and what you take on instead',
          headers: ['Category', 'What you stop owning', 'What you take on instead'],
          rows: [
            [
              'Execution & infrastructure',
              'The iteration loop, the execution sandbox, the retries inside the loop, and the tool-execution runtime. Anthropic runs all of it server-side.',
              'An agent definition managed as a versioned API resource, plus an application layer that sends events and consumes the streamed results.',
            ],
            [
              'Session duration & state',
              'Long-running execution management. Sessions can run for minutes or hours without your process holding the loop open.',
              'Server-side session state. Sessions are stateful and stored by Anthropic, and are subject to its data handling policies and constraints.',
            ],
            [
              'Sandbox lifecycle',
              'Sandbox provisioning and teardown for tool execution.',
              "A dependency on the managed sandbox's available tools and its execution model, rather than your own environment.",
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'The constraint that decides it for regulated work',
          body: [
            'Managed Agent sessions are stateful and stored server-side. That storage is the reason these sessions aren’t currently eligible for Zero Data Retention or a HIPAA Business Associate Agreement. If your workload carries PHI or falls under a ZDR requirement, this path is ruled out no matter how well it fits operationally, and you route to the Agent SDK or a raw loop on a covered configuration instead. The governing constraint picks the path before convenience gets a say.',
          ],
        },
        {
          type: 'p',
          text: 'A common progression is to prototype on the Agent SDK locally, then move to Managed Agents for production. The core agent definition carries over conceptually. What changes is the format: the Agent SDK uses code-level and filesystem configuration, while Managed Agents defines the agent as a versioned API resource. Expect a re-expression step, not a direct export.',
        },
        {
          type: 'h',
          level: 3,
          text: 'Wiring the loop: the four steps that hold across every path',
        },
        {
          type: 'steps',
          items: [
            {
              title: 'Register tools',
              text: 'Each tool follows the same schema structure. The SDK registers them against the agent, so Claude knows what is available.',
            },
            {
              title: 'Set the system prompt',
              text: "Scope it to the agent's task. A broad system prompt produces broader, less reliable tool routing. A system prompt that names the specific task and the tools available for it produces more consistent behavior.",
            },
            {
              title: 'Handle the tool-use loop',
              text: 'Whether you iterate the loop yourself or the SDK iterates it for you, your code handles execution. Every tool call Claude issues must be executed by your code and returned in a tool-result block.',
            },
            {
              title: 'Define exit conditions',
              text: 'The agent loop runs until it receives a stop condition. Without explicit exit conditions, the agent will continue requesting tool calls beyond what the task requires. Define when done means done.',
            },
          ],
        },
        {
          type: 'table',
          caption: 'Loop wiring checklist: verify these regardless of path',
          headers: ['#', 'Item', 'What to verify'],
          rows: [
            [
              '1',
              'Tools registered',
              'Every tool the agent may need is in the registration list. No unregistered tools are referenced in the system prompt.',
            ],
            [
              '2',
              'System prompt scoped',
              'The system prompt names the task and the available tools. It does not describe tools the agent does not have.',
            ],
            [
              '3',
              'Tool-use loop implemented',
              'Your code handles every tool-use block Claude issues and returns a tool-result block for each one before the next assistant turn. All tool-use blocks from a single assistant turn must be resolved together.',
            ],
            [
              '4',
              'HITL insertion point defined',
              'At least one point in the loop has a human-in-the-loop check.',
            ],
            [
              '5',
              'Exit conditions defined',
              'The loop has a clear stopping criterion that does not depend on Claude volunteering to stop.',
            ],
          ],
        },
        {
          type: 'table',
          caption: 'Human-in-the-loop: insertion points and when each applies',
          headers: ['Insertion point', 'What triggers the check', 'Risk level it addresses'],
          rows: [
            [
              'Before a destructive tool call',
              'The agent is about to execute a write, delete, or send operation.',
              'High: irreversible actions where a wrong call cannot be undone',
            ],
            [
              'After a planning step',
              'The agent has generated a plan and is about to begin executing it.',
              'Medium: incorrect plans that would produce the wrong outcome even if all steps execute correctly',
            ],
            [
              'On unexpected output',
              'The tool result contains an error flag, an empty result, or a value outside expected bounds.',
              'Variable: catches failure modes that retry logic alone will not resolve',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'The governing HITL question',
          body: [
            'What is the worst possible outcome if this step runs without a human check? The answer determines whether a checkpoint is required before the tool can execute.',
          ],
        },
        { type: 'h', level: 3, text: 'Tool orchestration: over-tooling and under-tooling' },
        {
          type: 'p',
          text: 'The agent’s routing behavior is shaped by how tools are described and how many tools are registered. Too many tools with overlapping descriptions produce erratic routing. Too few tools force the agent to either hallucinate a path or return an incomplete result.',
        },
        {
          type: 'p',
          text: 'Over-tooling is the more common problem in production agents. Teams register every tool they might need "just in case" and discover that Claude’s selection quality degrades as the tool surface grows. Start with the minimum set required for the task and add tools only when a specific gap in capability is confirmed.',
        },
        {
          type: 'h',
          level: 3,
          text: 'Regulated data constraints set your delivery route before you write the wiring',
        },
        {
          type: 'p',
          text: 'If your data needs to be handled with specific constraints (e.g., attorney-client privilege, HIPAA, GDPR, FedRAMP, or an internal data-residency policy), that constraint decides which endpoint your code calls, which credentials it carries, and where its logs land before you make a single design choice about prompts, tools, or memory.',
        },
        {
          type: 'table',
          headers: ['Constraint', 'What it tends to rule out in code', 'What usually survives a code review'],
          rows: [
            [
              'Attorney-client privilege',
              'Calls from a consumer-grade Claude.ai surface that the firm cannot audit end-to-end. Code paths that send privileged document content to any endpoint the firm has not approved.',
              "Direct API or SDK calls from inside the firm's own application, authenticated via SSO, routed through a firm-approved LLM gateway with full request and response logging. Conversation content is not captured by Anthropic by default on direct API traffic, so the organization must implement conversation logging in the application layer.",
            ],
            [
              'HIPAA (PHI handling)',
              'Code that sends Protected Health Information to any endpoint or delivery route not covered by a Business Associate Agreement for the specific configuration in use, including logging or retention paths.',
              'Direct API or SDK calls on a BAA-covered configuration, arranged with Anthropic, which provisions a dedicated HIPAA-enabled organization. An alternative is a cloud-mediated route via AWS Bedrock or GCP Vertex. The BAA does not cover Console, Workbench, beta features, or consumer plans.',
            ],
            [
              'GDPR and data residency',
              'Delivery routes where the region of model execution cannot be pinned in code. Defaulting to a global endpoint without specifying region is the common pattern that breaks here.',
              'A cloud-mediated route such as Bedrock or Vertex, with the region pinned in the client configuration. The direct Anthropic API does not currently provide EU data residency, so partners with EU residency requirements should route through Bedrock or Vertex.',
            ],
            [
              'FedRAMP and government',
              'Any code path that calls an endpoint not on an authorized cloud environment at the required impact level, including development and test paths that hit the commercial endpoint.',
              'Three authorized routes exist as of publish time: Claude for Government (C4G) via PFCS-SS (FedRAMP High), Claude via Amazon Bedrock GovCloud (FedRAMP High, DoD IL4/5), and Claude via Vertex AI Assured Workloads. Claude Enterprise on AWS Marketplace is not FedRAMP authorized.',
            ],
            [
              'Internal data-residency policy',
              "Calls from any SDK client configured against a cloud vendor outside the partner's approved list, regardless of technical capability.",
              'The delivery route on the partner’s approved cloud vendor — whichever SDK client and endpoint configuration their CIO has already cleared.',
            ],
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Watch out: the agent that edited a production file',
        },
        {
          type: 'p',
          text: 'A developer built an agent that could read, modify, and write configuration files, with three tools: read_file, write_file, and validate_config. After each write it re-ran validate_config, adjusting up to a cap of ten iterations. Tested against a scratch directory, it worked correctly on every test case.',
        },
        {
          type: 'p',
          text: 'When deployed to a customer environment, the agent correctly identified that a configuration parameter was out of range, proposed a correction, called write_file, re-ran validate_config, and got back a pass. The loop terminated cleanly after a single iteration, exactly as designed. The parameter it corrected was a rate limit the customer’s application relied on. validate_config checked the value was within the schema’s allowed range, which it now was. What it did not check was whether downstream systems depended on the old value. Within minutes, the customer’s application started failing.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'What to watch out for',
          body: [
            'The failure was not in the loop. The loop’s exit condition (validate_config returns pass) was scoped to the file the agent was editing, and there was no checkpoint between "validation passed on this file" and "write committed to the customer environment."',
            'The design question that was never asked: "What is the worst outcome if write_file runs without a human check?" If a tool can take an irreversible action in production, it needs a checkpoint before it runs. Register that constraint during design, not after the first incident.',
          ],
        },
        {
          type: 'quote',
          label: 'Checkpoint 6 · Model answer — the HITL checkpoint',
          text: 'if block.type == "tool_use":\n    if block.name == "update_record":\n        print(f"Proposed update, customer_id: {block.input[\'customer_id\']}, "\n              f"field: {block.input[\'field\']}, new_value: {block.input[\'new_value\']}")\n        approval = input("Approve this update? (yes/no): ").strip().lower()\n        if approval != "yes":\n            tool_results.append({\n                "type": "tool_result",\n                "tool_use_id": block.id,\n                "content": "Update rejected by operator."\n            })\n            continue\n    result = execute_tool(block.name, block.input)',
        },
        {
          type: 'p',
          text: 'The checkpoint sits inside the loop and gates on the tool name, so read_record calls pass through unchanged and update_record calls pause for explicit approval. A single up-front approval cannot gate a specific update the model has not yet proposed. Approving after execute_tool has run means the irreversible work is already done.',
        },
      ],
    },

    {
      id: 'dev-m2-agent-memory',
      eyebrow: 'Teaching · Agent Memory',
      duration: '8 min',
      title: 'Choosing the right scope for state that survives sessions',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'The agent from the previous section runs correctly within a single session. What it cannot do is remember anything when that session ends. Memory scope is how you decide what the agent should know at the start of the next session, and how much it costs to carry that knowledge forward.',
        },
        {
          type: 'p',
          text: 'Making the wrong choice has two failure modes, and they pull in opposite directions. Too much state in-context inflates every API call, because the model re-reads the full conversation on every turn and the bill scales with session length. Too little state in persistent storage strips the agent of memory across sessions, because anything not written down disappears the moment the conversation ends.',
        },
        {
          type: 'table',
          caption: 'Memory scopes',
          headers: ['Scope', 'What persists', 'Cost', 'When to use', 'What you lose'],
          rows: [
            [
              'In-context memory',
              'State lives in the active conversation and survives turns within a single session.',
              'Zero retrieval overhead; inflates token cost as conversation grows',
              'Short sessions where all the state the agent needs fits inside the context window and nothing has to carry across restarts.',
              'Everything once the session ends. A clear command or a new session wipes the state.',
            ],
            [
              'External storage',
              'State is written to a database and read back at session start or on demand.',
              'Each database call adds retrieval latency, and you take on the engineering work of read and write logic.',
              'State that has to survive across sessions, move between users, or be shared across multiple agent instances.',
              'Nothing on the persistence side. The cost shows up as latency on every call and ongoing implementation complexity.',
            ],
            [
              'Summarized memory',
              'A condensed version of prior conversation is generated and injected at the start of the next session.',
              'Lower token cost per session than replaying full history, but the summarization step drops detail.',
              'Long-running conversational agents where the full history would outgrow the context budget before the conversation is done.',
              'Any detail the summarizer did not preserve. The agent only sees what the summarization prompt chose to keep.',
            ],
            [
              'No persistent memory (stateless)',
              'Nothing. Each session is independent.',
              'No overhead at all, since there is nothing to retrieve or store.',
              'Task-execution agents that finish and close out, or pipelines where every session is fully independent by design.',
              'All prior context. If a follow-up depends on something from an earlier session, the agent has no way to reach it.',
            ],
          ],
        },
        {
          type: 'p',
          text: 'The default path looks reasonable at first. You store the full conversation history in the messages array, send it on every API call, and the prototype works. The trouble starts further in, when token cost scales with every additional turn and eventually a long session hits the hard limit. The refactor itself is mechanical, a few hundred lines of code and a database the team already has. What it costs is timing. Making the call during design phase is cheap; doing it when it’s time to refactor is more expensive.',
        },
        {
          type: 'h',
          level: 3,
          text: 'Skills: reusable instruction sets that load on demand',
        },
        {
          type: 'p',
          text: 'There is a related but distinct problem: how you carry repeatable instructions across tasks without paying to inject them into every session. The pattern for that is a Skill, a reusable markdown file that teaches Claude how to handle a specific kind of task once. A Skill lives in a SKILL.md file with a frontmatter block carrying a name and a description, and the instructions below it. The description is the matching criterion. If the instructions are not relevant to the current request, they never enter the context window.',
        },
        {
          type: 'table',
          caption: 'Skills vs. CLAUDE.md vs. in-context instructions',
          headers: ['Pattern', 'When it loads', 'Context cost', 'Best for'],
          rows: [
            [
              'Skill (SKILL.md)',
              "On demand when request matches skill's description",
              'Low. Only the name and description load at startup; full content loads only on match',
              'Task-specific expertise that should not inflate sessions where it is not needed: domain-specific output formats, specialized review checklists, workflows that apply to a subset of tasks.',
            ],
            [
              'CLAUDE.md',
              'Every session, unconditionally',
              'Fixed overhead per session regardless of task',
              'Always-on project standards that apply to everything: coding conventions, output format rules, constraints that hold across all tasks in the codebase.',
            ],
            [
              'In-context instructions',
              'Present for every turn within that session',
              'Grows with session length; does not survive session end',
              'Short sessions where the full history fits within the window and nothing needs to persist.',
            ],
          ],
        },
        {
          type: 'p',
          text: 'CLAUDE.md behavior depends on where you are running Claude Code. In the Claude Code CLI, a CLAUDE.md file loads into every session regardless of what task is running. In the Agent SDK, whether filesystem settings including CLAUDE.md load is controlled by the `settingSources` configuration. Do not rely on a default: set it explicitly.',
        },
        {
          type: 'p',
          text: 'Skills are available on the Messages API today, but the integration is in beta. Two beta headers are required: `code-execution-2025-08-25` and `skills-2025-10-02`. Skills invoked this way run inside the code execution container rather than in the calling application’s environment.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Subagents do not inherit Skills',
          body: [
            'When you delegate a task to a subagent, it starts with a clean context. If the subagent needs a Skill, you must explicitly list it in the subagent’s configuration.',
            'Note that while Skills and conversation history do not carry over, subagents **do** inherit the permission context from the parent session; permission scope is not reset at delegation.',
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Watch out: the agent that filled the window on session four',
        },
        {
          type: 'p',
          text: 'An agent was built to assist a support engineer with ongoing escalation cases. Development ran continuous sessions of 10 to 15 turns and in-context state held the full history correctly. In production, each session was shorter, but the state accumulated across sessions. By session four, the injected in-context history exceeded 40,000 tokens before the agent had processed a single tool call. Combined with the system prompt and registered tool schemas, over 45,000 tokens were consumed before the first productive turn.',
        },
        {
          type: 'p',
          text: 'The fix was a one-hour refactor to external storage. The refactor under production pressure took significantly longer than it would have at design time. Development used a single long session; production used many short sessions with accumulated state. Those are different shapes, and in-context memory handles them differently.',
        },
      ],
    },

    {
      id: 'dev-m2-cumulative-debug',
      eyebrow: 'Cumulative · Debug Task',
      duration: '18 min',
      title: 'Cumulative debug task: four planted bugs, four layers',
      blocks: [
        {
          type: 'p',
          text: 'The agent implementation below has four planted bugs, one in each of four layers: the schema layer, the streaming layer where the response is assembled and committed, the context layer where the message structure is built, and the memory layer.',
        },
        {
          type: 'quote',
          label: 'Buggy implementation',
          text: '# --- TOOL DEFINITIONS ---\ntools = [\n  {\n    "name": "get_customer_data",\n    "description": "Gets data.",\n    "input_schema": { "type": "object", "properties": { "id": {"type":"string"} }, "required": ["id"] }\n  }\n]\n\n# --- AGENT LOOP ---\ndef run_agent(user_request, session_history):\n  messages = session_history + [{"role":"user","content":user_request}]\n  while True:\n    blocks = {}\n    stop_seen = False\n    with client.messages.stream(\n        model=model, max_tokens=4096, tools=tools, messages=messages,\n        thinking={"type": "adaptive"}\n    ) as stream:\n      for event in stream:\n        if event.type == "content_block_start":\n          blocks[event.index] = init_block(event)\n        elif event.type == "content_block_delta":\n          apply_delta(blocks[event.index], event.delta)\n        elif event.type == "message_stop":\n          stop_seen = True\n    assistant_content = [b for b in assemble(blocks) if b["type"] != "thinking"]\n    messages.append({"role": "assistant", "content": assistant_content})\n    response = finalize(blocks)\n    if response.stop_reason == "end_turn":\n      return response\n    for block in response.content:\n      if block.type == "tool_use":\n        result = execute_tool(block.name, block.input)\n        messages.append({"role":"user","content":[{"type":"tool_result",\n                         "tool_use_id":block.id,"content":result}]})\n\n# --- MEMORY ---\ndef build_session_history(prior_sessions):\n  full_history = []\n  for session in prior_sessions:\n    full_history.extend(session["messages"])\n  return full_history',
        },
        { type: 'h', level: 3, text: 'Stage 1 · Identify each bug' },
        {
          type: 'table',
          headers: ['Layer', 'Bug', 'What it causes at runtime'],
          rows: [
            [
              'Schema',
              'Vague tool description ("Gets data.")',
              'Claude cannot distinguish this tool from any other retrieval tool and selects on surface-level matching rather than intent.',
            ],
            [
              'Streaming',
              'Turn committed before message_stop; thinking block stripped',
              'An interrupted stream writes a partial, possibly half-built tool_use block into history; the stripped thinking block breaks the carry-back rule and the API rejects the next request because the signature no longer matches.',
            ],
            [
              'Context',
              'Only tool_result appended; no preceding assistant tool_use turn',
              'The API sees a tool_result referencing a tool_use block it never received as a complete assistant turn and rejects the request.',
            ],
            [
              'Memory',
              'All prior session transcripts concatenated in-context',
              'The context window grows with every session and fills before the agent can process the current request by session four or five.',
            ],
          ],
        },
        { type: 'h', level: 3, text: 'Stage 2 · Write the corrected version' },
        {
          type: 'table',
          headers: ['Layer', 'Fix', 'Result'],
          rows: [
            [
              'Schema',
              'Write a specific tool description explaining when/not to use the tool.',
              'Improves tool selection accuracy.',
            ],
            [
              'Streaming',
              'Append assistant message only after `message_stop` is received.',
              'Prevents partial responses from entering history.',
            ],
            [
              'Context',
              'Keep the `thinking` blocks instead of filtering them out.',
              'Preserves valid extended-thinking conversation state.',
            ],
            [
              'Memory',
              'Store long-term state externally and reload only necessary information for new sessions.',
              'Prevents context window overflow and scales across sessions.',
            ],
          ],
        },
        {
          type: 'quote',
          label: 'Bug 2 fix — streaming layer',
          text: 'assistant_content = assemble(blocks)   # keep all blocks including thinking\nif stop_seen:\n    messages.append({"role": "assistant", "content": assistant_content})\nelse:\n    raise StreamInterruptedError(\n        "Discarding partial turn; retry from last complete turn."\n    )',
        },
        {
          type: 'p',
          text: '**Bug 3 fix.** Bug 3 is resolved once Bug 2 is fixed. The full assistant turn, including the tool_use block, is now appended before the tool_result, satisfying the pairing rule.',
        },
        {
          type: 'quote',
          label: 'Bug 4 fix — memory layer',
          text: 'def build_session_history(prior_sessions):\n    if not prior_sessions:\n        return []\n    summary = load_session_summary(prior_sessions[-1]["id"])   # from external store\n    return [{"role": "user", "content": f"Session context: {summary}"}]',
        },
      ],
    },

    {
      id: 'dev-m2-multimodal',
      eyebrow: 'Teaching · Multimodal and Batch Ingestion',
      duration: '13 min',
      title: 'Images, PDFs, and high-volume processing',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Every image and PDF consumes context budget before Claude reads a single character of your prompt, which changes how you structure requests and what you can fit in one.',
        },
        { type: 'h', level: 3, text: 'Image token cost: calculate before you commit' },
        {
          type: 'p',
          text: 'Images are not free in terms of context budget. Claude views images in patches: each 28×28-pixel block of the image is one visual token, so an image costs ⌈width / 28⌉ × ⌈height / 28⌉ visual tokens. A 1,000 × 1,000 pixel image is ⌈1000/28⌉ × ⌈1000/28⌉ = 36 × 36 patches, about 1,296 visual tokens. At that rate, ten high-resolution screenshots consume as much context as a detailed system prompt.',
        },
        {
          type: 'p',
          text: 'Each model also has a maximum native image resolution, expressed as a long-edge limit and a visual-token limit, and these limits differ by model tier. Images larger than either limit are downscaled before processing, so the formula runs on the scaled dimensions. Confirm the current per-tier limits against the Vision page at build time.',
        },
        {
          type: 'p',
          text: 'The calculation matters at design time. If you are building a pipeline that processes images, measure the token cost of a typical production image against your model’s context limit before you write the ingestion code. The fix for an over-budget pipeline is often a ten-minute image resize step.',
        },
        {
          type: 'cards',
          items: [
            {
              eyebrow: 'Encoding',
              title: 'Inline base64',
              body: 'Encode the image bytes as a base64 string and include the data directly in the message block. The full encoded payload travels with every request, which inflates request size and counts against latency on large images. Best for one-off images.',
            },
            {
              eyebrow: 'Encoding',
              title: 'URL reference',
              body: 'Reference the image by URL in the message block source.',
            },
            {
              eyebrow: 'Encoding',
              title: 'Files API',
              body: 'Upload once and reference the file_id in each request. The right choice for an asset reused across many requests.',
            },
          ],
        },
        { type: 'h', level: 3, text: 'Sending PDFs: the document block' },
        {
          type: 'p',
          text: 'For PDFs, the block type is `document` rather than `image`. The source structure follows the same pattern as images, which means it can be base64, a URL, or a Files API file_id. There is no required name field on a document block. The block accepts an optional `title` field and an optional `context` field, but neither is required.',
        },
        {
          type: 'quote',
          label: 'A document block',
          text: '{\n  "type": "document",\n  "source": {\n    "type": "base64",\n    "media_type": "application/pdf",\n    "data": "<base64-encoded-pdf-bytes>"\n  },\n  "title": "contract_review.pdf"\n}',
        },
        {
          type: 'p',
          text: 'The same prompting techniques apply to image and PDF analysis. A bare "describe this image" prompt produces shallow output for the same reason a bare text prompt does. The difference is that images carry ambiguity that text cannot: overlapping objects, depth and spatial relationships, and partial occlusion. "If objects overlap, describe each separately and note the overlap" is a concrete constraint that a text-only prompt would never need.',
        },
        {
          type: 'h',
          level: 3,
          text: 'The Message Batches API: high-volume asynchronous processing',
        },
        {
          type: 'p',
          text: 'The Message Batches API accepts up to 100,000 or 256 MB requests (whichever comes first) in a single batch call. You submit the batch, receive a `batch_id`, and poll for completion. The per-token cost for batch requests is lower than for synchronous ones. The tradeoff is latency: batch processing is non-deterministic and can take up to 24 hours, often much faster.',
        },
        {
          type: 'table',
          headers: ['Use case', 'Right API pattern', 'Why'],
          rows: [
            [
              'A user uploads a photo and expects an immediate classification',
              'Synchronous API',
              'Real-time response is required. Batch latency is unacceptable for interactive use.',
            ],
            [
              'A nightly pipeline classifies 5,000 customer records',
              'Message Batches API',
              'Latency is not a constraint. Batch cost reduction and asynchronous processing are both valuable.',
            ],
            [
              'An evaluation run tests a new prompt against 2,000 examples',
              'Message Batches API',
              'Offline task with no real-time requirement.',
            ],
            [
              "A chatbot generates a reply to a user's message",
              'Synchronous API',
              'User is waiting; batch would introduce unacceptable delay.',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Chunking a list and looping is not batching',
          body: [
            'Splitting a job into chunks and processing them one after another is serialization with extra steps. It produces the same number of API calls as the un-chunked version and runs into the same rate limits. The Message Batches API is a different submission model, not a smaller batch size.',
            'Results return in arbitrary order, not the order requests were submitted in. Use the `custom_id` field on each request to match results back to inputs.',
          ],
        },
        {
          type: 'p',
          text: 'Two failure modes break the fit between multimodal and batch. The first is misreading latency: reaching for batch in any user-facing flow with an image produces a system that passes tests and fails in production, because the user is waiting and the batch isn’t. The second is underestimating context cost: images and PDFs consume budget before Claude processes any text.',
        },
      ],
    },

    {
      id: 'dev-m2-recap',
      eyebrow: 'Recap · Eight takeaways',
      duration: '3 min',
      title: 'Eight takeaways, one per enabling objective',
      blocks: [
        {
          type: 'takeaways',
          items: [
            {
              title: 'When a prompt fails, the failure type tells you which technique is missing.',
              text: 'Output in the wrong shape points to a missing output constraint, drift across turns points to an underspecified system prompt, and a hallucinated structure points to the absence of few-shot examples. Diagnose the failure type first, then add the technique that addresses it. When prompt-level instructions are not enough, move output control into the API with structured outputs.',
            },
            {
              title: 'Match the reasoning depth to the task before you tune the prompt.',
              text: 'Enable reasoning only where a reasoning pass changes the answer and calibrate the effort setting to the problem rather than raising it on every call. Remember that thinking blocks return to the API unchanged or the next request fails.',
            },
            {
              title: 'A stream ending is not a message completing.',
              text: 'Act on a block only after it closes, commit a turn to history only after message_stop, and on an interrupted stream discard the partial turn and retry. The failure mode to recognize is a tool-use error on a retry that traces back to a half-built block from a dropped stream, not to the schema.',
            },
            {
              title: 'Every wrong-tool selection traces back to the schema, and most of the time to the description.',
              text: 'Two tools that both say "use this to find information" are indistinguishable from Claude’s side even when the input schemas look nothing alike. The one sentence that resolves most wrong-tool bugs is the exclusion condition. When someone else has already written the tools, MCP lets you connect a maintained server, but each connected server adds its tool definitions to the context window whether the tools are used.',
            },
            {
              title: 'Context is a fixed budget, and tool outputs spend it faster than anything else in the loop.',
              text: 'Production tool outputs run three to five times longer than the fixtures used in development, so a session that holds together cleanly across fifty turns in testing can hit the ceiling at turn eight once it ships. When tool selection starts degrading after a fixed number of turns, the window is the first place to look, not the schema.',
            },
            {
              title: 'The workflow-or-agent decision sets the cost of everything that follows.',
              text: 'A workflow is the right call when you can write the exact steps in code, and an agent is the right call when you can specify the goal and the tools but not the path between them. If a tool can take an irreversible action, the human-in-the-loop checkpoint goes in before the loop is wired, not after the first write reaches a customer environment.',
            },
            {
              title: 'Memory scope is decided by the shape of the session, not by what is easiest to implement.',
              text: 'In-context memory is the simplest pattern to write, which is why it also fails earliest when production sessions turn out to be shorter and more numerous than development’s long continuous sessions. Carrying repeatable instructions across tasks is a separate problem from carrying state, and the pattern for it is a Skill.',
            },
            {
              title: 'Calculate the cost of a multimodal input before you write the ingestion code.',
              text: 'An image costs ⌈width / 28⌉ × ⌈height / 28⌉ visual tokens, and the per-image ceiling differs by model tier. Inline base64 fits one-off images, the Files API fits assets reused across requests, and the Message Batches API handles offline work at lower per-token cost. The mistake worth avoiding is calling the synchronous API in a loop and treating that as batching.',
            },
          ],
        },
      ],
    },

    {
      id: 'dev-m2-glossary',
      eyebrow: 'Glossary · Key Terms',
      duration: '3 min',
      title: 'Key terms from this module',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              eyebrow: 'Term',
              title: 'Claude Agent SDK',
              body: 'A managed agent runtime distributed as @anthropic-ai/claude-agent-sdk (TypeScript) / claude-agent-sdk (Python). It gives a partner programmatic access to the same agent loop that powers Claude Code: iteration, tool execution, observation, termination. Distinct from the Anthropic SDK, which is a thin convenience wrapper over the API and does not run an agent loop.',
            },
            {
              eyebrow: 'Term',
              title: 'Context Window',
              body: "The total number of tokens a model can process in a single request, including the system prompt, conversation history, tool definitions, tool results, and the model's own output. When the running total reaches the limit, earlier content must be removed or summarized before new content can be added.",
            },
            {
              eyebrow: 'Term',
              title: 'Function signature',
              body: 'A programming term that means the declaration of a function: its name plus the list of parameters it accepts, including their names, types, and any default values.',
            },
            {
              eyebrow: 'Term',
              title: 'HITL',
              body: 'Human-in-the-loop refers to inserting a human review or approval step into an automated process before consequential action is taken.',
            },
            {
              eyebrow: 'Term',
              title: 'Refactor',
              body: 'Changing the internal structure of code without changing what it does from the outside. You reorganize, rename, or rewrite the implementation to make it cleaner, faster, easier to test, or easier to extend, but the behavior the rest of the system sees stays the same.',
            },
            {
              eyebrow: 'Term',
              title: 'SOC 2',
              body: 'Service Organization Control 2 is an audit framework developed by the AICPA for evaluating how a service organization handles customer data. It is the standard most commonly cited when a SaaS vendor or cloud service provider is asked to demonstrate that their security practices meet a recognized bar.',
            },
            {
              eyebrow: 'Term',
              title: 'State',
              body: 'The information an agent carries between turns: the conversation so far, what the user asked for, results from earlier tool calls.',
            },
            {
              eyebrow: 'Term',
              title: 'Stop_reason',
              body: 'A field in the API response that tells your code why the model stopped generating. The two values most relevant to agentic loops are `end_turn`, which means Claude has finished, and `tool_use`, which means Claude has issued one or more tool_use blocks and is waiting for results.',
            },
            {
              eyebrow: 'Term',
              title: 'Subagent',
              body: 'A separate agent instance spun up by an orchestrating agent to handle a discrete subtask. Subagents do not inherit conversation history, skills, or context from the parent session; each starts clean and must be configured explicitly with the instructions and tools it needs.',
            },
            {
              eyebrow: 'Term',
              title: 'Token',
              body: 'The unit Claude uses to measure and process text. The characters-per-token average depends on the tokenizer of the model at hand and differs between model generations. Tokens are consumed by everything in the context window: prompts, responses, tool schemas, and tool results.',
            },
            {
              eyebrow: 'Term',
              title: 'Tool_use_block',
              body: 'A content block returned by the assistant when Claude wants to call a function. Contains the tool name, a unique ID, and the input arguments. Every tool_use block must be answered by a matching tool_result block in the immediately following user turn, with the same ID preserved exactly.',
            },
          ],
        },
      ],
    },

    {
      id: 'dev-m2-sources',
      eyebrow: 'Sources',
      title: 'Sources',
      blocks: [
        {
          type: 'ul',
          items: [
            '**Claude 101 (Skilljar):** Prompting foundations, tool-use basics, agents and workflows overview, context window concepts.',
            '**Claude Code 101 In Action (Skilljar):** Context management (/compact, /clear), Claude Code agent loop, production agent patterns.',
            '**AI Fluency Framework Foundations (Skilljar):** Prompting techniques, few-shot examples, constraint specification.',
            '**Building with the Claude API (Skilljar):** Tool schemas, message block structure, streaming, structured outputs, Files API, batch API, agent construction.',
            '**platform.claude.com:** Canonical reference for tool-use, agents, context, MCP, API mechanics. Pull at publish and re-verify.',
            '**Anthropic Blog, "Building Effective Agents":** Workflow sub-patterns (chaining, routing, parallelization, evaluator-optimizer), agent design guidance.',
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'You can now take a Claude prototype into production.',
          body: [
            'Production-ready prompts, tool-use loops, streaming, context and memory management, and checkpointed agent loops now hold up under real usage.',
          ],
        },
      ],
    },
  ],

  /* Multiple-choice checkpoints from across the module. */
  reviewQuestions: [
    {
      id: 'dev-m2-rq-1',
      question:
        'Checkpoint 2 · Classify 50,000 support tickets into three labels overnight. What is the correct extended-thinking call?',
      options: [
        { id: 'A', text: 'Never do this.' },
        { id: 'B', text: 'Leave it off.' },
        { id: 'C', text: 'Enable it, budget for the planning step.' },
      ],
      correctOptionId: 'B',
      rationale:
        'A one-word label needs no reasoning pass. Reasoning tokens on every ticket multiply output cost across 50,000 calls with no accuracy gain.',
    },
    {
      id: 'dev-m2-rq-2',
      question:
        'Checkpoint 2 · Plan a multi-step refactor where each step depends on the previous one. What is the correct extended-thinking call?',
      options: [
        { id: 'A', text: 'Never do this.' },
        { id: 'B', text: 'Leave it off.' },
        { id: 'C', text: 'Enable it, budget for the planning step.' },
      ],
      correctOptionId: 'C',
      rationale:
        'Without the reasoning pass the model commits to a plan before working through the dependencies, and the first dependent step fails.',
    },
    {
      id: 'dev-m2-rq-3',
      question:
        'Checkpoint 2 · Strip the thinking block out of conversation history to save context before the next tool call. What is the correct call?',
      options: [
        { id: 'A', text: 'Never do this.' },
        { id: 'B', text: 'Leave it off.' },
        { id: 'C', text: 'Enable it, budget for the planning step.' },
      ],
      correctOptionId: 'A',
      rationale:
        'The signature no longer matches and the next request is rejected. Manage accumulated reasoning with context engineering, not by editing the blocks.',
    },
    {
      id: 'dev-m2-rq-4',
      question:
        'Checkpoint 3 · A trace shows an assistant turn issuing tool_use id="toolu_01", then a user turn returning tool_result with tool_use_id="toolu_02". The API responds: "tool_result block references unknown tool_use_id". Which is the targeted fix?',
      options: [
        {
          id: 'A',
          text: 'Update the description on get_account_balance to add an exclusion condition.',
        },
        {
          id: 'B',
          text: 'Correct the tool_use_id on the tool_result block so it matches the id issued in the assistant turn.',
        },
        {
          id: 'C',
          text: 'Add a required array to the tool’s input_schema so account_id cannot be omitted.',
        },
      ],
      correctOptionId: 'B',
      rationale:
        'The API matches tool_use and tool_result blocks by id, not by position, so a mismatched id is treated as a reference to a tool_use block that does not exist in the conversation. The fix is to return the result with tool_use_id="toolu_01".',
    },
    {
      id: 'dev-m2-rq-5',
      question:
        'Checkpoint 5 · A session makes four correct tool selections (2,400 tokens each), then at turn 5 starts selecting the wrong tool repeatedly and ends without a result. Which one-line fix addresses the cause?',
      options: [
        { id: 'A', text: 'Add a clearer description to the apply_coverage_rule tool schema.' },
        {
          id: 'B',
          text: 'Prune fetch_policy_document results after each turn so that accumulated outputs do not crowd out current instructions, and apply compaction before turn 5.',
        },
        { id: 'C', text: 'Increase max_tokens in the API call to give Claude more room to respond.' },
      ],
      correctOptionId: 'B',
      rationale:
        'The failure triggered at turn 5, not turn 1. Correct tool selections at turns 1-4 rule out a schema description problem. The turn-5 shift points to accumulated context, which included four large tool results filling the window and pushing current instructions toward the edge.',
    },
    {
      id: 'dev-m2-rq-6',
      question:
        'Checkpoint 7 · A customer support agent assists the same user across daily check-ins over two weeks. Each session starts where the previous one left off. Which memory scope?',
      options: [
        { id: 'A', text: 'In-context memory: all state lives in the active conversation.' },
        {
          id: 'B',
          text: 'External storage: write state to a database at session end, then read it back at session start.',
        },
        { id: 'C', text: 'No persistent memory (stateless): each session starts fresh.' },
      ],
      correctOptionId: 'B',
      rationale:
        "In-context state resets when the session ends, so on day two the agent has no record of yesterday's check-in. Every session would open as a first contact, and the user has to re-explain their situation from scratch.",
    },
    {
      id: 'dev-m2-rq-7',
      question:
        'Checkpoint 7 · A document formatter receives a file, applies a transformation, returns the output, and terminates. Each job is fully independent. Which memory scope?',
      options: [
        { id: 'A', text: 'In-context memory: all state lives in the active conversation.' },
        {
          id: 'B',
          text: 'External storage: write state to a database at session end, then read it back at session start.',
        },
        { id: 'C', text: 'No persistent memory (stateless): each session starts fresh.' },
      ],
      correctOptionId: 'C',
      rationale:
        'External storage adds read and write calls to a job that has no continuity requirement. Nothing breaks, but every run pays a latency and implementation cost for state the agent will never reuse.',
    },
    {
      id: 'dev-m2-rq-8',
      question:
        'Checkpoint 7 · A coding assistant works with a developer across a multi-hour session. The session will not continue after it ends. Which memory scope?',
      options: [
        { id: 'A', text: 'In-context memory: all state lives in the active conversation.' },
        {
          id: 'B',
          text: 'External storage: write state to a database at session end, then read it back at session start.',
        },
        { id: 'C', text: 'No persistent memory (stateless): each session starts fresh.' },
      ],
      correctOptionId: 'A',
      rationale:
        'External storage is unnecessary overhead for a session that ends when the developer logs off. A summarized memory layer would compress out the exact code-level detail the developer still needs to reference later in the same session.',
    },
    {
      id: 'dev-m2-rq-9',
      question:
        'Checkpoint 8 · A reference product diagram used in every request your pipeline makes. Which encoding method?',
      options: [
        {
          id: 'A',
          text: 'Message Batches API: submit all requests in one batch call, poll for completion',
        },
        { id: 'B', text: 'Files API: upload once, reference file_id in each request' },
        { id: 'C', text: 'Inline base64: encode and include directly in the message block' },
      ],
      correctOptionId: 'B',
      rationale:
        'Inline base64 would resend the full payload with every request, adding transfer overhead and latency on every call.',
    },
    {
      id: 'dev-m2-rq-10',
      question:
        'Checkpoint 8 · A one-off screenshot of a UI bug, submitted by a support engineer in a single request. Which encoding method?',
      options: [
        {
          id: 'A',
          text: 'Message Batches API: submit all requests in one batch call, poll for completion',
        },
        { id: 'B', text: 'Files API: upload once, reference file_id in each request' },
        { id: 'C', text: 'Inline base64: encode and include directly in the message block' },
      ],
      correctOptionId: 'C',
      rationale:
        'Files uploaded to the Files API add a round-trip step for an asset that will only ever be used once.',
    },
    {
      id: 'dev-m2-rq-11',
      question:
        'Checkpoint 8 · A job classifying 5,000 customer feedback responses. Which encoding method?',
      options: [
        {
          id: 'A',
          text: 'Message Batches API: submit all requests in one batch call, poll for completion',
        },
        { id: 'B', text: 'Files API: upload once, reference file_id in each request' },
        { id: 'C', text: 'Inline base64: encode and include directly in the message block' },
      ],
      correctOptionId: 'A',
      rationale:
        'The synchronous API would process requests sequentially or require managing thousands of concurrent connections against rate limits.',
    },
  ],
};
