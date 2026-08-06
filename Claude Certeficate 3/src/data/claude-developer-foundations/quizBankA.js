/*
 * CCDV-F quiz bank, part A — Modules 1 and 2 (44 questions).
 *
 * Question text and options transcribed from CCDV-F_Question_Dump.md.
 * Correct answers come from that file's ANSWER KEY.
 *
 * The dump states its questions are "original write-ups testing the concepts
 * from your course material — not verbatim reproductions of the course's own
 * checkpoint text", so unlike the Associate course these do NOT duplicate the
 * modules' own checkpoints (which live in each module's `reviewQuestions`).
 *
 * The dump supplies an answer key without per-question rationales, so each
 * `rationale` below is derived from the matching module's teaching content and
 * flagged with `rationaleSource: 'derived'`. The UI labels those. No answer
 * letter was inferred — every one is taken from the key.
 */

const derived = 'derived';

export const quizBankA = [
  /* ================= MODULE 1 — MSO Foundations (12) ================= */
  {
    id: 'D-Q1.1',
    ref: 'Q1.1',
    source: 'original',
    moduleId: 'dev-module-1',
    domainId: 'mso-foundations',
    question:
      "A request's input tokens + conversation history + tool definitions already exceed the context window before generation starts. What happens?",
    options: [
      { id: 'A', text: 'The response is silently truncated' },
      { id: 'B', text: 'The request is rejected with a validation error before generation begins' },
      { id: 'C', text: 'The oldest messages are automatically dropped' },
      { id: 'D', text: 'The model summarizes automatically' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'A request whose input is already larger than the window is rejected with a validation error before generation begins. The oldest content is never silently dropped — managing history is the application’s job.',
  },
  {
    id: 'D-Q1.2',
    ref: 'Q1.2',
    source: 'original',
    moduleId: 'dev-module-1',
    domainId: 'mso-foundations',
    question:
      'A request fits within the context window, but generation hits the ceiling mid-response. What stop_reason do you see?',
    options: [
      { id: 'A', text: '`end_turn`' },
      { id: 'B', text: '`max_tokens`' },
      { id: 'C', text: '`model_context_window_exceeded`' },
      { id: 'D', text: '`refusal`' },
    ],
    correctOptionId: 'C',
    rationaleSource: derived,
    rationale:
      'This is the second of the two distinct edge behaviors: a request that fits on input but reaches the ceiling during generation stops and returns the output generated so far with a `model_context_window_exceeded` stop reason.',
  },
  {
    id: 'D-Q1.3',
    ref: 'Q1.3',
    source: 'original',
    moduleId: 'dev-module-1',
    domainId: 'mso-foundations',
    question:
      'True or False: At temperature 0, two identical requests are guaranteed to return identical output on every Claude model generation.',
    options: [
      { id: 'A', text: 'True' },
      { id: 'B', text: 'False' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Temperature 0 makes outputs more repeatable but does not guarantee identical outputs across calls. It concentrates probability on the most likely tokens; it does not fix or disable sampling.',
  },
  {
    id: 'D-Q1.4',
    ref: 'Q1.4',
    source: 'original',
    moduleId: 'dev-module-1',
    domainId: 'mso-foundations',
    question:
      'On the newest Claude models, what happens if you set a non-default temperature/top_p/top_k?',
    options: [
      { id: 'A', text: "It's silently ignored" },
      { id: 'B', text: "It returns a 400 error — non-default sampling parameters aren't accepted" },
      { id: 'C', text: 'It works exactly as before' },
      { id: 'D', text: 'It only works with extended thinking off' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'The newest Claude models do not accept non-default sampling parameters. Behavior on those models is steered through prompting instead.',
  },
  {
    id: 'D-Q1.5',
    ref: 'Q1.5',
    source: 'original',
    moduleId: 'dev-module-1',
    domainId: 'mso-foundations',
    question:
      "You need repeatable behavior on the newest models but can't set temperature. What's the correct lever instead?",
    options: [
      { id: 'A', text: 'Lower max_tokens' },
      { id: 'B', text: 'Manage repeatability through prompting' },
      { id: 'C', text: 'Switch to a smaller model' },
      { id: 'D', text: 'Use structured outputs only' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Where sampling parameters are omitted entirely, repeatability is managed through prompt design. max_tokens caps length, not variability, and model tier does not control sampling.',
  },
  {
    id: 'D-Q1.6',
    ref: 'Q1.6',
    source: 'original',
    moduleId: 'dev-module-1',
    domainId: 'mso-foundations',
    question: "What's the difference between model tier selection and reasoning mode (effort)?",
    options: [
      { id: 'A', text: "They're the same setting" },
      {
        id: 'B',
        text: 'Model tier picks which model runs; reasoning mode is a separate per-request setting for how much a model thinks',
      },
      { id: 'C', text: 'Reasoning mode only exists on Haiku' },
      { id: 'D', text: 'Model tier controls thinking, reasoning mode controls output length' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'The two levers are independent and compose: model choice picks the family member, while the reasoning mode is configured per request.',
  },
  {
    id: 'D-Q1.7',
    ref: 'Q1.7',
    source: 'original',
    moduleId: 'dev-module-1',
    domainId: 'mso-foundations',
    question: 'The `budget_tokens` parameter for extended thinking is:',
    options: [
      { id: 'A', text: 'Still the primary way to control thinking depth' },
      {
        id: 'B',
        text: 'Deprecated — returns a 400 error on newest model generations; effort setting is used instead',
      },
      { id: 'C', text: 'Required for all thinking-enabled requests' },
      { id: 'D', text: 'Only used with Haiku' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'On current models reasoning is adaptive: you tune depth with an effort setting rather than a fixed token budget. The older budget_tokens control is deprecated.',
  },
  {
    id: 'D-Q1.8',
    ref: 'Q1.8',
    source: 'original',
    moduleId: 'dev-module-1',
    domainId: 'mso-foundations',
    question:
      "Why shouldn't you test LLM output correctness by checking for an exact string match?",
    options: [
      { id: 'A', text: 'String matching is too fast' },
      {
        id: 'B',
        text: 'Output is non-deterministic, so test on properties/structure or use a model-graded eval instead',
      },
      { id: 'C', text: 'String matches always fail on JSON' },
      { id: 'D', text: "It's not allowed by the API" },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'A test that asserts the exact text of a response will be inconsistent, because the model can express the same correct answer many ways. Assert on the property that must hold, or use a model-graded judge.',
  },
  {
    id: 'D-Q1.9',
    ref: 'Q1.9',
    source: 'original',
    moduleId: 'dev-module-1',
    domainId: 'mso-foundations',
    question:
      'When should you reach for multi-shot (few-shot) prompting instead of writing more instructions?',
    options: [
      { id: 'A', text: 'When the model needs to be told to be more polite' },
      {
        id: 'B',
        text: 'When the problem is about output *structure* — wrong format, wrong casing, a missed edge case — not more description',
      },
      { id: 'C', text: 'Never — zero-shot is always better' },
      { id: 'D', text: 'Only for classification tasks' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Move to one-shot or multi-shot when the output has a specific structure, casing, or edge case that a description keeps missing. One or two correct examples usually fix the issue faster than another paragraph of instructions.',
  },
  {
    id: 'D-Q1.10',
    ref: 'Q1.10',
    source: 'original',
    moduleId: 'dev-module-1',
    domainId: 'mso-foundations',
    question:
      'What is the key difference between the Message Batches API and calling `AsyncAnthropic`/an async client in a loop?',
    options: [
      { id: 'A', text: "They're functionally identical" },
      {
        id: 'B',
        text: 'Async client calls still return in real time; Batches API is a bulk offline submission with up to 24h turnaround at lower per-token cost',
      },
      { id: 'C', text: 'Batches API is faster' },
      { id: 'D', text: 'Async is only for streaming' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'The async client solves concurrency without blocking; the request still returns in real time. The Batches API is a separate submission model for bulk offline workloads.',
  },
  {
    id: 'D-Q1.11',
    ref: 'Q1.11',
    source: 'original',
    moduleId: 'dev-module-1',
    domainId: 'mso-foundations',
    question:
      'Your team builds a pipeline that classifies 50,000 support tickets overnight, with no one waiting on the result. Which mechanism is correct?',
    options: [
      { id: 'A', text: 'Synchronous calls in a tight loop' },
      { id: 'B', text: 'AsyncAnthropic with high concurrency' },
      { id: 'C', text: 'The Message Batches API' },
      { id: 'D', text: 'Streaming responses' },
    ],
    correctOptionId: 'C',
    rationaleSource: derived,
    rationale:
      'With no user watching and tens of thousands of inputs, batch is the fit: submit in one call, poll for completion, and accept longer latency for a lower per-token cost. A synchronous loop hits rate limits at this volume, and streaming buys nothing when nobody is watching.',
  },
  {
    id: 'D-Q1.12',
    ref: 'Q1.12',
    source: 'original',
    moduleId: 'dev-module-1',
    domainId: 'mso-foundations',
    question: "SDK vs. raw REST calls to the Claude API — what's the actual functional difference?",
    options: [
      { id: 'A', text: "SDKs can do things REST can't" },
      {
        id: 'B',
        text: 'None functionally — the SDK is a convenience layer (auth, retries, parsing) over the same underlying API',
      },
      { id: 'C', text: 'REST is faster' },
      { id: 'D', text: "SDKs don't support tool use" },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'The SDK and raw REST reach the same API and the same model. The SDK handles authentication, request construction, retries, and response parsing so you write less boilerplate.',
  },

  /* ===== MODULE 2 — Production-Grade Prompting, Agents & Tool-Use (32) ===== */
  {
    id: 'D-Q2.1',
    ref: 'Q2.1',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question:
      'A classification prompt returns "Billing" sometimes, "billing" other times, and full sentences occasionally. What\'s missing?',
    options: [
      { id: 'A', text: 'A system prompt' },
      { id: 'B', text: 'An output constraint' },
      { id: 'C', text: 'Extended thinking' },
      { id: 'D', text: 'A larger model' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'The result comes back in the wrong shape, which points at a missing output constraint: the prompt never specified the form, field names, or stopping point of the response.',
  },
  {
    id: 'D-Q2.2',
    ref: 'Q2.2',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question:
      "Content in a prompt keeps drifting off-topic and getting worse across turns. What's the fix?",
    options: [
      { id: 'A', text: 'A more specific/sharper system prompt' },
      { id: 'B', text: 'Few-shot examples' },
      { id: 'C', text: 'XML tags' },
      { id: 'D', text: 'A larger max_tokens' },
    ],
    correctOptionId: 'A',
    rationaleSource: derived,
    rationale:
      'Scope drift that worsens across turns points at an underspecified system prompt. The system prompt sets the rules that apply to every response regardless of the user turn.',
  },
  {
    id: 'D-Q2.3',
    ref: 'Q2.3',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question:
      "The task is understood correctly but Claude invents a structure you never specified. What's missing?",
    options: [
      { id: 'A', text: 'Output constraint' },
      { id: 'B', text: 'System prompt' },
      { id: 'C', text: 'Few-shot examples' },
      { id: 'D', text: 'Extended thinking' },
    ],
    correctOptionId: 'C',
    rationaleSource: derived,
    rationale:
      'The task is right but the structure is invented, which is the signature of missing few-shot examples. Claude cannot infer an exact structure from a description alone.',
  },
  {
    id: 'D-Q2.4',
    ref: 'Q2.4',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question:
      "You've reworded the same prompt five times and the output is still wrong. What should you do?",
    options: [
      { id: 'A', text: 'Reword it a sixth time with more detail' },
      {
        id: 'B',
        text: 'Stop and diagnose which specific technique (constraint, system prompt, examples) is actually missing',
      },
      { id: 'C', text: 'Switch to a bigger model automatically' },
      { id: 'D', text: 'Enable extended thinking' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'A prompt that keeps getting longer with every pass is the sign you are skipping the diagnosis step. If three re-prompts in a row have not worked, stop adding text and name which technique is absent.',
  },
  {
    id: 'D-Q2.5',
    ref: 'Q2.5',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question:
      'What\'s the difference between prompt-level "return only JSON" instructions and the API\'s structured outputs (`output_config.format`, `json_schema`)?',
    options: [
      { id: 'A', text: 'No difference' },
      {
        id: 'B',
        text: "Structured outputs use constrained decoding — invalid tokens can't be generated at all — vs. a prompt instruction the model can still slip on for untested inputs",
      },
      { id: 'C', text: 'Structured outputs are always faster' },
      { id: 'D', text: 'Structured outputs replace the need for a system prompt' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'A prompt-level instruction holds on the cases you tried and then slips on an edge case you did not. A schema constraint does not slip, because the API enforces it on every token.',
  },
  {
    id: 'D-Q2.6',
    ref: 'Q2.6',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question: 'Which of these does a schema-guaranteed JSON response NOT protect against?',
    options: [
      { id: 'A', text: 'Wrong field names' },
      {
        id: 'B',
        text: "A refusal (stop_reason: refusal) or truncation (stop_reason: max_tokens) that still doesn't parse",
      },
      { id: 'C', text: 'Malformed JSON syntax' },
      { id: 'D', text: 'Inconsistent casing' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'A guaranteed schema is not a guaranteed success. Your code still checks stop_reason rather than assuming every response parses.',
  },
  {
    id: 'D-Q2.7',
    ref: 'Q2.7',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question: 'Structured outputs (JSON schema) and message prefilling —',
    options: [
      { id: 'A', text: 'Combine seamlessly' },
      { id: 'B', text: 'Are incompatible on the same request — pick one' },
      { id: 'C', text: 'Both require extended thinking' },
      { id: 'D', text: 'Only work with Opus' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'A pattern that starts the response for Claude and a pattern that constrains the whole response to a schema cannot run on the same request.',
  },
  {
    id: 'D-Q2.8',
    ref: 'Q2.8',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question: 'When should extended thinking be left OFF?',
    options: [
      { id: 'A', text: 'Multi-step dependent planning' },
      { id: 'B', text: 'Mechanical/lookup tasks like classification or field extraction' },
      { id: 'C', text: 'Agentic loops with several tool calls' },
      { id: 'D', text: 'Complex math derivations' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Extended thinking will not improve a mechanical answer, and you will be paying more tokens for something you did not need. A bare prompt with an output constraint is the right tool.',
  },
  {
    id: 'D-Q2.9',
    ref: 'Q2.9',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question:
      'What happens if you strip the thinking block out of history before the next tool-use turn to save context?',
    options: [
      { id: 'A', text: "Nothing — it's optional" },
      { id: 'B', text: 'The signature no longer matches and the API rejects the next request' },
      { id: 'C', text: 'It saves money with no downside' },
      { id: 'D', text: 'It only affects Opus' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Each thinking block carries a signature confirming the reasoning was not tampered with. Stripping it to save context is the most common slip-up and breaks the next request.',
  },
  {
    id: 'D-Q2.10',
    ref: 'Q2.10',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question: 'In a tool-use loop, who actually executes the tool?',
    options: [
      { id: 'A', text: 'Claude executes it directly' },
      { id: 'B', text: 'Your application code executes it after Claude issues a tool_use block' },
      { id: 'C', text: 'The Anthropic API executes it server-side automatically' },
      { id: 'D', text: 'The MCP server always executes it' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'The most common misconception is that Claude runs the tools. Claude decides which one fits and tells your application what to call; your code executes it and returns the result.',
  },
  {
    id: 'D-Q2.11',
    ref: 'Q2.11',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question: 'Every `tool_use` block must be answered by a `tool_result` block:',
    options: [
      { id: 'A', text: 'Anywhere later in the conversation' },
      { id: 'B', text: 'In the immediately following user turn, with a matching ID' },
      { id: 'C', text: 'Only if `is_error` is false' },
      { id: 'D', text: 'Only when extended thinking is off' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'This is the critical invariant. Missing tool_result blocks, or ones that appear in a later turn, cause an API validation error.',
  },
  {
    id: 'D-Q2.12',
    ref: 'Q2.12',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question:
      'Two tools both say "use this to find information" in their descriptions. What\'s the most likely production symptom?',
    options: [
      { id: 'A', text: 'Faster responses' },
      { id: 'B', text: 'Wrong-tool selection, since Claude routes primarily on name + description' },
      { id: 'C', text: 'A validation error' },
      { id: 'D', text: 'Automatic tool merging' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'When two descriptions look similar, Claude has no reliable signal to distinguish them and picks based on small surface differences that may not match the distinction you intended.',
  },
  {
    id: 'D-Q2.13',
    ref: 'Q2.13',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question: "What's the fix for two tools with overlapping descriptions?",
    options: [
      { id: 'A', text: 'Rename both tools' },
      { id: 'B', text: 'Add an exclusion condition to each description naming when NOT to use it' },
      { id: 'C', text: 'Delete one of the tools always' },
      { id: 'D', text: 'Increase max_tokens' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'One sentence saying when not to call the tool gives Claude a decision boundary. Both tools need it, not just one. If they still cannot be separated, merge them into one tool with a type parameter.',
  },
  {
    id: 'D-Q2.14',
    ref: 'Q2.14',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question: 'When should you reach for an MCP server instead of writing a tool schema by hand?',
    options: [
      { id: 'A', text: 'Always — MCP is strictly superior' },
      {
        id: 'B',
        text: 'When a well-maintained MCP server already exists and covers your exact needed operations',
      },
      { id: 'C', text: 'Only for read-only tools' },
      { id: 'D', text: 'Never — manual schemas are always better' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Check that the server covers the specific operations you require and is actively maintained. Writing and owning those schemas yourself adds implementation overhead for no additional capability.',
  },
  {
    id: 'D-Q2.15',
    ref: 'Q2.15',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question: "What's a cost implication of connecting multiple MCP servers?",
    options: [
      { id: 'A', text: "None — it's free until a tool is called" },
      {
        id: 'B',
        text: "Each server's tool definitions add to the context window even when unused this turn",
      },
      { id: 'C', text: 'Only the first server counts against context' },
      { id: 'D', text: 'MCP servers reduce token cost automatically' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'If you connect several servers at once, the tool definitions themselves consume budget before the first message arrives. Register only the servers you are actively using.',
  },
  {
    id: 'D-Q2.16',
    ref: 'Q2.16',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question:
      "In a streamed response, when is it safe to parse a `tool_use` block's JSON input?",
    options: [
      { id: 'A', text: 'As soon as the first delta arrives' },
      { id: 'B', text: 'Only after `content_block_stop` for that block' },
      { id: 'C', text: 'After `message_start`' },
      { id: 'D', text: 'Anytime, since JSON.parse handles partial strings' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Tool-call inputs arrive as a partial JSON string spread across several deltas and are not valid JSON until the block closes. Acting earlier either chokes on malformed JSON or runs with half the arguments missing.',
  },
  {
    id: 'D-Q2.17',
    ref: 'Q2.17',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question:
      'A stream is interrupted mid-response before `message_stop`. What should your handler do?',
    options: [
      { id: 'A', text: 'Save whatever was collected so far to history' },
      { id: 'B', text: 'Discard the partial turn and retry the request' },
      { id: 'C', text: 'Continue building on the partial tool_use block' },
      { id: 'D', text: 'Immediately switch models' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Committing a half-built turn is exactly what breaks the following request. Throw away the partial assistant turn instead of saving it to history, then retry from the last complete turn.',
  },
  {
    id: 'D-Q2.18',
    ref: 'Q2.18',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question:
      'What\'s the correct interpretation of "a stream ending is not the same as a message completing"?',
    options: [
      { id: 'A', text: "They're always the same" },
      {
        id: 'B',
        text: 'A read loop can end without `message_stop` ever arriving — only `message_stop` means the message is whole',
      },
      { id: 'C', text: 'It refers only to network errors' },
      { id: 'D', text: "It's about batch processing, not streaming" },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'If your handler commits a turn whenever its read loop exits, an interrupted stream writes a half-built block into history, and the failure shows up on the next request rather than the one that caused it.',
  },
  {
    id: 'D-Q2.19',
    ref: 'Q2.19',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question:
      "Development test fixtures show a session completing cleanly in 20 turns. In production it fails at turn 8. What's the most likely cause?",
    options: [
      { id: 'A', text: 'A schema description problem' },
      {
        id: 'B',
        text: 'Tool outputs are 3-5x longer in production, filling the context window faster than development fixtures suggested',
      },
      { id: 'C', text: 'The model got worse' },
      { id: 'D', text: 'A network issue' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Production tool outputs run three to five times longer than development fixtures. The symptom of context overflow is often misread as a tool selection failure.',
  },
  {
    id: 'D-Q2.20',
    ref: 'Q2.20',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question:
      "Which context management strategy removes visibility into HOW a subtask's answer was reached, in exchange for keeping the main context clean?",
    options: [
      { id: 'A', text: 'Pruning' },
      { id: 'B', text: 'Compaction' },
      { id: 'C', text: 'Subagent handoff' },
      { id: 'D', text: 'Clearing' },
    ],
    correctOptionId: 'C',
    rationaleSource: derived,
    rationale:
      'A subagent works in its own isolated context and returns a summary. What you lose is visibility into how it reached its conclusion — the intermediate steps are discarded with the subagent’s context.',
  },
  {
    id: 'D-Q2.21',
    ref: 'Q2.21',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question:
      'What\'s the risk of an under-specified summarizer prompt during compaction (e.g., "summarize the conversation so far")?',
    options: [
      { id: 'A', text: 'It costs more tokens' },
      {
        id: 'B',
        text: 'Task-critical state (file paths, decisions, errors+resolutions) can be silently dropped — one of the most common causes of multi-session agent failures',
      },
      { id: 'C', text: 'It always fails outright' },
      { id: 'D', text: 'It disables tool use' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'The summarizer prompt determines what the agent will know in subsequent turns. Compare it against "preserving all file paths modified, all decisions made, and any errors encountered and their resolutions."',
  },
  {
    id: 'D-Q2.22',
    ref: 'Q2.22',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question: 'Choose a workflow over an agent when:',
    options: [
      { id: 'A', text: "The path through the task can't be enumerated in advance" },
      { id: 'B', text: 'You can write the exact steps in code and inputs are well-constrained' },
      { id: 'C', text: 'User inputs vary unpredictably' },
      { id: 'D', text: 'The task requires creative sequencing of tools' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Using an agent when a workflow is sufficient adds behavioral complexity without adding capability. The other three options are the conditions that call for an agent.',
  },
  {
    id: 'D-Q2.23',
    ref: 'Q2.23',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question:
      "What's the defining constraint that rules out Claude Managed Agents for PHI/ZDR workloads?",
    options: [
      { id: 'A', text: "They're too slow" },
      {
        id: 'B',
        text: 'Managed Agent sessions are stateful and stored server-side — not currently eligible for ZDR or a HIPAA BAA',
      },
      { id: 'C', text: "They don't support tool use" },
      { id: 'D', text: 'They require Opus specifically' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'That server-side storage rules the path out no matter how well it fits operationally; you route to the Agent SDK or a raw loop on a covered configuration instead. The governing constraint picks the path before convenience gets a say.',
  },
  {
    id: 'D-Q2.24',
    ref: 'Q2.24',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question:
      'The single most important question for placing a human-in-the-loop (HITL) checkpoint is:',
    options: [
      { id: 'A', text: 'How long will the task take?' },
      { id: 'B', text: 'What is the worst possible outcome if this step runs without a human check?' },
      { id: 'C', text: 'Is the user watching?' },
      { id: 'D', text: 'Does the tool return JSON?' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'The answer to that question determines whether a checkpoint is required before the tool can execute. It is the same worst-case question that places a review gate anywhere else.',
  },
  {
    id: 'D-Q2.25',
    ref: 'Q2.25',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question:
      'An agent\'s tool validated a config change as "in range" and committed it — but the change broke a downstream system that depended on the old value. What was the actual failure?',
    options: [
      { id: 'A', text: 'The validation logic was buggy' },
      {
        id: 'B',
        text: 'There was no checkpoint between "validation passed" and "write committed" — the exit condition didn\'t account for downstream blast radius',
      },
      { id: 'C', text: 'The model hallucinated' },
      { id: 'D', text: 'The tool schema was too vague' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'The loop did exactly what it was asked to do. The exit condition was scoped to the file the agent was editing, with no branch between "proposed change ready" and "write committed."',
  },
  {
    id: 'D-Q2.26',
    ref: 'Q2.26',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question: 'Over-tooling in agent design typically causes:',
    options: [
      { id: 'A', text: 'Faster responses' },
      { id: 'B', text: 'Erratic/degraded tool selection as the tool surface grows' },
      { id: 'C', text: 'Lower token costs' },
      { id: 'D', text: 'Better routing' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Over-tooling is the more common problem in production agents. Start with the minimum set required for the task and add tools only when a specific gap in capability is confirmed.',
  },
  {
    id: 'D-Q2.27',
    ref: 'Q2.27',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question:
      'Match the memory scope to the use case: a document formatter that receives a file, transforms it, and terminates, with no continuity between jobs.',
    options: [
      { id: 'A', text: 'In-context memory' },
      { id: 'B', text: 'External storage' },
      { id: 'C', text: 'Stateless (no persistent memory)' },
      { id: 'D', text: 'Summarized memory' },
    ],
    correctOptionId: 'C',
    rationaleSource: derived,
    rationale:
      'External storage adds read and write calls to a job that has no continuity requirement. Every run would pay a latency and implementation cost for state the agent will never reuse.',
  },
  {
    id: 'D-Q2.28',
    ref: 'Q2.28',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question:
      'Match the memory scope: a customer support agent that continues the same conversation thread with a user across two weeks of daily check-ins.',
    options: [
      { id: 'A', text: 'In-context memory' },
      { id: 'B', text: 'External storage' },
      { id: 'C', text: 'Stateless' },
      { id: 'D', text: 'Summarized memory only, no storage' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'In-context state resets when the session ends, so on day two the agent has no record of yesterday. State that has to survive across sessions belongs in external storage.',
  },
  {
    id: 'D-Q2.29',
    ref: 'Q2.29',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question: 'Do subagents automatically inherit Skills from a parent session?',
    options: [
      { id: 'A', text: 'Yes, always' },
      {
        id: 'B',
        text: 'No — a subagent starts clean; needed Skills must be explicitly listed in its configuration',
      },
      { id: 'C', text: 'Only built-in subagents do' },
      { id: 'D', text: 'Only if CLAUDE.md says so' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'A subagent starts with a clean context. Note that while Skills and conversation history do not carry over, subagents do inherit the permission context from the parent session.',
  },
  {
    id: 'D-Q2.30',
    ref: 'Q2.30',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question: "What's the formula for image token cost?",
    options: [
      { id: 'A', text: 'file size in KB × 10' },
      { id: 'B', text: '⌈width/28⌉ × ⌈height/28⌉ visual tokens' },
      { id: 'C', text: 'A fixed 1,000 tokens per image regardless of size' },
      { id: 'D', text: 'width × height ÷ 100' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Claude views images in patches: each 28×28-pixel block is one visual token. A 1,000 × 1,000 image is about 1,296 visual tokens. Images over the per-model limit are downscaled first, so the formula runs on the scaled dimensions.',
  },
  {
    id: 'D-Q2.31',
    ref: 'Q2.31',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question:
      "A pipeline reuses the same reference product diagram in every request. What's the correct encoding method?",
    options: [
      { id: 'A', text: 'Inline base64 every time' },
      { id: 'B', text: 'Files API — upload once, reference file_id' },
      { id: 'C', text: 'Message Batches API' },
      { id: 'D', text: 'URL reference only' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Inline base64 would resend the full payload with every request, inflating request size and latency. The Files API fits assets reused across requests.',
  },
  {
    id: 'D-Q2.32',
    ref: 'Q2.32',
    source: 'original',
    moduleId: 'dev-module-2',
    domainId: 'prompting-agents-tools',
    question:
      '"I chunked my list into smaller groups and looped calling the synchronous API for each chunk" — is this batching?',
    options: [
      { id: 'A', text: 'Yes, this is exactly what batching means' },
      {
        id: 'B',
        text: 'No — it\'s still one synchronous request per item and hits the same rate limits; true batching is a different submission model via the Batches API',
      },
      { id: 'C', text: 'Yes, as long as chunks are under 100' },
      { id: 'D', text: 'Only if run overnight' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Chunking a list and looping is serialization with extra steps. It produces the same number of API calls as the un-chunked version and runs into the same rate limits.',
  },
];
