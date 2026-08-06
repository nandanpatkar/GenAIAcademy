/* Module 4 — Workflow Integration & Solution Design. From MODULE 4.txt. */

const disclaimer = {
  type: 'callout',
  variant: 'disclaimer',
  title: 'Disclaimer / Notice for Educational Content',
  body: [
    "We built this Associate course Module 4: Workflow Integration & Solution Design to help you get real work done with Claude. Treat it as educational content. It doesn't constitute legal, financial, or other professional advice, so adapt what you learn to your own situation. Our products and services evolve quickly, so certain content may contain errors or be outdated; remember to verify on Anthropic's website or docs. Examples and scenarios used in the course are illustrative and often fictitious. If the course material mentions a company or product, it doesn't mean Anthropic endorses them, they endorse Anthropic, or that we're affiliated. Also note your use of Anthropic products and services is covered by our terms, policies and documentation; if anything in this course conflicts with them, they control.",
  ],
};

export const module4 = {
  id: 'module-4',
  number: 4,
  title: 'Workflow Integration & Solution Design',
  shortTitle: 'Workflow Integration',
  summary: 'Map a workflow against Delegation criteria and redesign it safely.',
  duration: '~55 min',
  lede: 'Workflow value comes from deciding which steps to delegate, not from automating everything.',
  objectives: [
    'Apply Claude to analyze requirements and use cases.',
    'Leverage Claude for research, planning, and process optimization.',
    'Use Claude to support solution design, development, and iteration.',
    'Integrate Claude into existing workflows to augment or redesign them.',
    "Communicate Claude's value and limitations to stakeholders accurately.",
  ],

  sections: [
    {
      id: 'm4-toc',
      eyebrow: 'Associate Certification · Module 4',
      title: 'Table of contents',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'There is a difference between "I use Claude" and "our workflow uses Claude." The first is a personal habit. The second is a repeatable process, run by a team, where Claude performs specific steps every time. The value compounds only when you make that shift deliberately, and it can go awry when teams automate the wrong steps. This module teaches you to make that choice well.',
        },
        {
          type: 'table',
          headers: ['Screen', 'Length'],
          rows: [
            ['Module Introduction', '1 screen'],
            ['Analyzing Requirements & Use Cases', '1 screen'],
            ['Research, Planning & Process Optimization', '1 screen'],
            ['Solution Design, Development & Iteration', '1 screen'],
            ['Delegation Mapping', '1 screen'],
            ['Communicating Value & Limitations', '1 screen'],
            ['Exercise: Redesign a Workflow', '1 screen'],
            ['Module 4 Quiz', '2 screens'],
            ['Module Complete', '—'],
          ],
        },
      ],
    },

    {
      id: 'm4-intro',
      eyebrow: 'Introduction',
      duration: '4 min',
      title: 'Workflow Integration & Solution Design',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'There is a difference between "I use Claude" and "our workflow uses Claude."',
        },
        {
          type: 'p',
          text: 'The first is a personal productivity habit. The second is a repeatable process, run by a team, where Claude performs specific steps every time. The value compounds only when you make that shift deliberately, and the shift can go awry when teams automate the wrong steps.',
        },
        { type: 'h', level: 3, text: 'Two teams, same tool, different outcomes' },
        {
          type: 'p',
          text: 'Consider two teams that adopted Claude for the same contract-review process. The first mapped the work and let Claude draft the redline while a lawyer owned every final decision; review time dropped by half and quality held. The second pointed Claude at the whole process and let it approve low-risk clauses unsupervised; within a month an approved clause created an obligation no one caught, and the team pulled the tool entirely.',
        },
        {
          type: 'p',
          text: 'Same product, same process. The difference was which steps each team chose to delegate.',
        },
        {
          type: 'p',
          text: 'This module is about making that choice well. The anchoring competency from the AI Fluency Framework is Delegation: deciding, for each step, whether the work is AI-appropriate, human-retained, or collaborative. Delegation done deliberately is what turns individual wins into workflow value.',
        },
        { type: 'h', level: 3, text: 'The deal in this module' },
        {
          type: 'p',
          text: 'Workflow value comes from deciding which steps to delegate, not from automating everything. Learn to analyze requirements with Claude, build plans on verified analysis, iterate on solutions, map a workflow against Delegation criteria, and describe the result to stakeholders without overstating what the tool can do.',
        },
        disclaimer,
      ],
    },

    {
      id: 'm4-requirements',
      eyebrow: 'Teaching · Requirements Analysis',
      duration: '9 min',
      title: 'Analyzing Requirements and Use Cases with Claude',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Most real work starts from messy inputs: a long document, a thread of half-formed emails, a verbal ask. Before you can build anything, the requirements have to be extracted, structured, and pressure-tested.',
        },
        {
          type: 'p',
          text: 'Claude is a strong partner for exactly that translation, turning raw inputs into testable requirements others can act on. Claude can take unstructured material and return structure by pulling the requirements out of a document, organizing them, and flagging what is ambiguous or missing. Upload raw inputs and ask Claude for a structured analysis, rather than a narrative summary.',
        },
        {
          type: 'h',
          level: 3,
          text: 'Translating business needs into task definitions',
        },
        {
          type: 'p',
          text: 'A business need stated as "we need better reporting" is not actionable. Claude can help convert that business need into specific task definitions: what report, for whom, how often, drawn from what data, and in what format. Each becomes a requirement you can build against and check completion on.',
        },
        { type: 'h', level: 3, text: 'Worked example: an RFP response workflow' },
        {
          type: 'p',
          text: '**The workflow.** A proposal team responds to client RFPs. The inputs are a 40-page RFP document and a scattered email thread of internal answers. The recurring task: turn that into a structured list of answerable requirements.',
        },
        {
          type: 'quote',
          label: 'The prompt',
          text: '"From the attached RFP and the email thread, extract every distinct requirement the client is asking us to address. For each, give a short label, the exact RFP section it comes from, whether our thread already has an answer, and any requirement that is ambiguous and needs clarification. Return it as a table."',
        },
        {
          type: 'p',
          text: '**The output:** A requirements table the whole team can work from: each row a requirement, traced to its RFP section, marked answered or open, with ambiguities flagged for a clarifying question to the client.',
        },
        {
          type: 'p',
          text: "This is a Project, not a one-off Chat. Past winning proposals live in the knowledge base, the Skills carry the formatting steps, and the standing instructions hold the extraction format. No technical build is required. The standing instructions and knowledge base live in the Project's configuration; the Skills live at the account level and apply everywhere, this Project included. Module 5 covers the configuration in depth.",
        },
        { type: 'h', level: 3, text: 'Pressure-testing the requirements' },
        {
          type: 'p',
          text: 'Extraction is the first pass; pressure-testing is what makes the output trustworthy. Ask Claude to challenge its own list:',
        },
        {
          type: 'quote',
          label: 'Pressure-test prompt',
          text: '"Review the requirements you extracted. Which are ambiguous as written? Which could be interpreted two ways by our proposal team? Which imply a requirement the RFP states only indirectly?"',
        },
        {
          type: 'p',
          text: 'This surfaces the hidden requirements, the ones buried in a subordinate clause or implied by an evaluation criterion, that cost teams the bid when missed. The structured list plus a pressure-test pass is a far stronger foundation than either alone, and it is the Discernment habit from Module 3 applied at the requirements stage.',
        },
      ],
    },

    {
      id: 'm4-planning',
      eyebrow: 'Teaching · Research & Planning',
      duration: '10 min',
      title: 'Research, Planning & Process Optimization',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Planning work usually mixes two things Claude handles differently: synthesis, where it excels, and calculation, where it must be verified.',
        },
        {
          type: 'p',
          text: "The strongest planning workflows pair Claude's synthesis with code-executed analysis, so the plan rests on numbers that were computed, not generated.",
        },
        { type: 'h', level: 3, text: 'Research and synthesis' },
        {
          type: 'p',
          text: 'Claude can synthesize across sources to develop a plan: gather the considerations, structure the options, and lay out the trade-offs. For current information that post-dates training, web search in chat covers quick lookups and Research supplies the deeper up-to-date inputs. The synthesis is useful, and it is where unverified claims can enter, so the verification discipline from Module 3 applies throughout.',
        },
        { type: 'h', level: 3, text: 'Code execution for verified analysis' },
        {
          type: 'p',
          text: 'When a plan depends on numbers, have Claude compute them. Upload the dataset and use code execution to run the calculations, produce trend charts, and process the files. A staffing plan built on a guessed utilization rate is a guess; one built on a code-executed analysis of the actual timesheet data is a plan.',
        },
        { type: 'h', level: 3, text: 'Worked example: a capacity plan' },
        {
          type: 'p',
          text: '**The workflow.** An operations lead is planning headcount for next quarter. The workflow: upload the last four quarters of ticket-volume data, use code execution to compute the trend and the per-analyst throughput, then have Claude synthesize a staffing recommendation from the verified figures.',
        },
        {
          type: 'quote',
          label: 'The prompt',
          text: '"Using code execution on the attached ticket data, calculate quarterly volume growth and average tickets resolved per analyst. Then, from those figures, recommend the headcount needed to hold our current resolution time next quarter, and show the assumptions."',
        },
        {
          type: 'p',
          text: 'The recommendation is only as trustworthy as the figures under it. Because the figures came from code execution rather than prose, the plan can be defended line by line. Identifying which steps of a plan are built on a number is how you decide where AI insight impacts the answer.',
        },
        { type: 'h', level: 3, text: 'Where AI insight changes the plan' },
        {
          type: 'p',
          text: 'Not every step of a planning workflow benefits equally from Claude. The synthesis steps, where many considerations have to be weighed and structured, are where it adds the most. The judgment steps, where a person weighs risk appetite or political reality, stay human. A quick scan of a workflow for its synthesis-heavy steps tells you where to apply Claude and where to leave the call to a person.',
        },
        {
          type: 'p',
          text: "For the capacity plan, Claude's leverage is in turning four quarters of data into a defensible recommendation; the decision to hire, against budget and hiring-freeze realities Claude cannot see, remains up to the operations lead.",
        },
      ],
    },

    {
      id: 'm4-solution-design',
      eyebrow: 'Teaching · Solution Design & Iteration',
      duration: '8 min',
      title: 'Solution Design, Development & Iteration',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Claude is a design collaborator, not a vending machine. The value shows up in an explicit loop: ideate, prototype, gather feedback, refine.',
        },
        {
          type: 'p',
          text: 'Treating it as a loop, and keeping the design context stable across iterations, is what produces a solution rather than a pile of one-off drafts.',
        },
        { type: 'h', level: 3, text: 'The iteration loop' },
        {
          type: 'p',
          text: 'Ideation produces options; a prototype makes one concrete; feedback exposes what is wrong; refinement fixes it; and the loop repeats until the solution holds. Running this inside a Project keeps the context, constraints, and prior decisions stable, so each iteration builds on the last instead of restarting.',
        },
        {
          type: 'h',
          level: 3,
          text: 'Worked example: an internal process tool — three iterations, no code written',
        },
        {
          type: 'p',
          text: 'A business analytics team needed a small internal tool to track and visualize a maintained set of metrics. Rather than commission a build, they had Claude produce it as a web artifact and iterated by asking.',
        },
        {
          type: 'steps',
          items: [
            {
              title: 'Cycle 1 · Build',
              text: '"Build a simple dashboard artifact that shows these five metrics from the attached data, with a chart for each." Claude produces a working artifact.',
            },
            {
              title: 'Cycle 2 · Filter & totals',
              text: '"Add a filter by region and a summary row at the top with the totals." The team refines by describing the change, not by coding it.',
            },
            {
              title: 'Cycle 3 · Color & print',
              text: '"The month-over-month deltas should be color-coded, green for improvement, and the layout should print cleanly." Three cycles, no code written by the team.',
            },
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Knowing when to escalate',
          body: [
            "The artifact worked because it served a small team's internal need. When a solution becomes a system others depend on, with uptime, security, or integration requirements, it has outgrown Associate scope and belongs with Developer or Architect expertise.",
            'That dependency is the escalation signal: the moment people rely on it as infrastructure, the build is no longer a prompt-and-iterate exercise.',
          ],
        },
      ],
    },

    {
      id: 'm4-delegation-mapping',
      eyebrow: 'Teaching · Delegation Mapping',
      duration: '12 min',
      title: 'Delegation Mapping: Redesigning Workflows with Claude Inside',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'This is the core skill of the module. Before you redesign a workflow around Claude, map it step by step and decide, for each step, who owns it: AI, a human, or both together.',
        },
        {
          type: 'p',
          text: 'The mapping is judged on three criteria, and getting it right determines whether the workflow compounds value or quietly accumulates risk.',
        },
        { type: 'h', level: 3, text: 'Three steps, three criteria' },
        {
          type: 'p',
          text: 'For each step in a workflow, classify it as AI-appropriate, human-retained, or collaborative, judged against:',
        },
        {
          type: 'cards',
          items: [
            {
              eyebrow: 'Criterion',
              title: 'Reversibility',
              body: 'Can the step be undone if Claude gets it wrong? Reversible steps tolerate more delegation; irreversible ones demand human involvement.',
            },
            {
              eyebrow: 'Criterion',
              title: 'Stakes',
              body: 'What is the cost of an error at this step? High-cost steps stay human-owned or human-reviewed.',
            },
            {
              eyebrow: 'Criterion',
              title: 'Accountability',
              body: "Who is answerable for this step's outcome? Accountability does not delegate, even when the drafting does.",
            },
          ],
        },
        { type: 'h', level: 3, text: 'Building the redesign' },
        {
          type: 'p',
          text: 'Once mapped, embed the right feature at each AI step: a Skill for repeatable procedure steps, code execution for data steps. Consistency from a configured Skill beats heroic prompting that depends on remembering the right wording every time. The human-retained steps become explicit review gates, not afterthoughts.',
        },
        {
          type: 'p',
          text: 'Contract review is a common first-win workflow for business teams, so it is worth mapping fully.',
        },
        {
          type: 'table',
          caption: 'Worked map · contract review',
          headers: ['Workflow step', 'Delegation', 'Why'],
          rows: [
            [
              'Extract clauses from the contract',
              'AI-appropriate',
              'Reversible, low stakes, mechanical',
            ],
            [
              'Flag departures from the company playbook',
              'AI-appropriate',
              'Reversible; a Skill carries the playbook rules',
            ],
            [
              'Draft the redline and rationale',
              'Collaborative',
              'AI drafts, human judges each edit',
            ],
            [
              'Approve or reject each change',
              'Human-retained',
              'High stakes, accountability does not delegate',
            ],
            [
              'Compute financial exposure of a penalty clause',
              'AI-appropriate (code execution)',
              'Numeric; must be computed, not estimated',
            ],
            ['Sign and send', 'Human-retained', 'Irreversible, external, legally binding'],
          ],
        },
        {
          type: 'p',
          text: 'Note that the AI does real work here, including the redline draft, not just a summary. The human owns the decisions and the irreversible steps. That split is the redesign.',
        },
        { type: 'h', level: 3, text: 'Recognizing over-delegation' },
        {
          type: 'p',
          text: 'It is an incorrect approach to give AI more than the risk profile justifies: letting Claude approve clauses, or send the contract, because it drafted them well. Drafting quality is not a license to delegate the decision. When the map gives an irreversible or high-accountability step to AI, that is over-delegation, and it is exactly where the second team in the introduction went wrong.',
        },
        { type: 'h', level: 3, text: 'Common mapping errors' },
        {
          type: 'ul',
          items: [
            '**Halo delegation.** A step gets handed to AI because the previous step went well. Each step is judged on its own.',
            '**Collapsing collaborative into automate.** "AI drafts, human reviews" quietly becomes "AI drafts" when the review gate is never actually staffed. A collaborative step with no real reviewer is an automated step.',
            '**Mapping the tool, as opposed to the work.** Teams sometimes map around the features they like (a Skill they built) rather than the actual workflow steps. Map the work first, then adjust the features.',
          ],
        },
      ],
    },

    {
      id: 'm4-communicating',
      eyebrow: 'Teaching · Communicating Value',
      duration: '8 min',
      title: 'Communicating Value and Limitations to Stakeholders',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Integrating Claude into a team workflow means describing it to people who did not build it: a manager, a client, a risk function.',
        },
        {
          type: 'p',
          text: 'Credibility comes from accurate claims, which means communicating the limits as clearly as the value. Overstating capability is how teams lose stakeholder trust on the first visible miss.',
        },
        { type: 'h', level: 3, text: 'Describe capability accurately' },
        {
          type: 'p',
          text: 'State what Claude can reliably do for the use case and what it cannot, without inflation or false modesty. "Claude drafts the first pass redline, which a lawyer reviews" is accurate and credible. "Claude handles contract review" overstates and invites the question your first error will answer badly.',
        },
        { type: 'h', level: 3, text: 'The same workflow, different audiences' },
        {
          type: 'p',
          text: 'Consider the contract-review workflow, interpreted from varied perspectives:',
        },
        {
          type: 'cards',
          items: [
            {
              eyebrow: 'Legal lead',
              title: 'High literacy',
              body: '"Claude extracts clauses, flags playbook departures, and drafts the redline. It does not approve changes, that gate stays with you. Known failure mode: it can miss obligations implied indirectly, so the playbook-departure flags are a prompt for your read, not a substitute."',
            },
            {
              eyebrow: 'Practice executive',
              title: 'Outcome-focused',
              body: '"Review time is down about half at the same approval standard. Every change is still approved by a lawyer before it leaves the building."',
            },
            {
              eyebrow: 'Client risk function',
              title: 'Assurance-focused',
              body: '"AI assists drafting; qualified human reviews and approves every term. No contract is sent without human sign-off."',
            },
          ],
        },
        {
          type: 'p',
          text: 'This is the same workflow and the same human gate. What changes is the detail each audience needs to trust it at.',
        },
        { type: 'h', level: 3, text: 'Calibrate to the audience' },
        {
          type: 'p',
          text: "Match the message to the audience's AI literacy. A technical stakeholder wants the feature detail and the failure modes; an executive wants the outcome, the oversight in place, and the risk posture. The expectation you set should match the capability boundary, so no one is surprised later. This is the Description competency from Module 2 applied outward: the same precise specification of what the tool can and cannot do, now directed at stakeholders rather than at Claude.",
        },
        { type: 'h', level: 3, text: 'Document the human oversight' },
        {
          type: 'p',
          text: 'Name the review gates that stay in place. "Every output destined for a client passes human review" is the control that makes the workflow defensible. Stakeholders trust an AI workflow more, not less, when the human checkpoints are explicit.',
        },
        {
          type: 'compare',
          items: [
            {
              tone: 'negative',
              label: 'Overstated',
              title: '"Our new AI system reviews contracts automatically."',
              body: 'Sets an expectation the workflow does not meet and hides the human gate.',
            },
            {
              tone: 'positive',
              label: 'Accurate',
              title:
                '"Claude drafts the redline and flags playbook departures; our legal lead reviews and approves every change before anything is sent."',
              body: "The team's review time is down about half, with the same approval standard. Value and limits in one breath.",
            },
          ],
        },
        { type: 'h', level: 3, text: 'Phrases that quietly overstate' },
        {
          type: 'p',
          text: '"Fully automated" is almost never true, and the first visible error exposes it. "Claude handles X" collapses the human gate out of the sentence. "It\'s basically as good as a person at Y" sets a standard that the tool will eventually miss publicly. Each replaces a defensible, bounded claim with an inflated one. The fix is the same every time: state what the tool does, then identify the human checkpoint.',
        },
      ],
    },

    {
      id: 'm4-takeaways',
      eyebrow: 'Key Takeaways',
      duration: '5 min',
      title: 'Five things that hold across this module',
      blocks: [
        {
          type: 'takeaways',
          items: [
            {
              title: 'Delegate deliberately, do not automate indiscriminately.',
              text: 'Workflow value comes from choosing which steps Claude does, not from handing Claude everything.',
            },
            {
              title: 'Claude is a requirements-analysis partner.',
              text: 'Feed it messy inputs, get structured, traceable, testable needs others can act on.',
            },
            {
              title: 'Build plans on verified numbers.',
              text: "Pair Claude's synthesis with code execution so the figures under a plan are computed, not generated.",
            },
            {
              title: 'Map every step against three criteria.',
              text: 'Reversibility, stakes, and accountability decide whether a step is AI-appropriate, human-retained, or collaborative.',
            },
            {
              title: 'Communicate limits as clearly as value.',
              text: 'Accurate capability claims with the human review gates named are what earn and keep stakeholder trust.',
            },
          ],
        },
      ],
    },

    {
      id: 'm4-sources',
      eyebrow: 'Sources',
      title: 'Sources',
      blocks: [
        {
          type: 'p',
          text: 'All product behavior descriptions are based on claude.ai features as of June 2026. Feature availability and behavior should be verified against current Anthropic documentation at publish:',
        },
        {
          type: 'ul',
          items: [
            'AI Fluency Framework: Delegation competency',
            'Claude Help Center: Projects, Skills, code execution, and artifacts in workflows, support.claude.com',
            'Anthropic docs: building with Claude for analysis and planning, platform.claude.com/docs',
          ],
        },
      ],
    },
  ],

  reviewQuestions: [
    {
      id: 'm4-rq-1',
      question:
        "A business analyst used Claude to extract requirements from a vendor's product-integration brief. Claude returned the four requirement statements below. Which one is most ambiguous as written, the one that would lead two engineers to build different things?",
      options: [
        { id: 'A', text: 'The system must export reports in both PDF and CSV formats.' },
        { id: 'B', text: 'The system should handle a large number of concurrent users.' },
        {
          id: 'C',
          text: "The login page must support single sign-on through the company's existing identity provider.",
        },
        {
          id: 'D',
          text: 'Password-reset emails must be sent within five minutes of a request.',
        },
      ],
      correctOptionId: 'B',
      rationale:
        "'A large number' is unquantified: 100, 10,000, and 1,000,000 concurrent users imply different architectures, so two engineers would build different systems. A, C, and D each state a concrete, testable condition (named formats, a named SSO provider, a five-minute bound). Analyzing requirements means spotting the one that is not yet decidable as written.",
    },
    {
      id: 'm4-rq-2',
      question:
        'A capacity plan depends on growth and throughput figures from an uploaded dataset. How should those figures be produced?',
      options: [
        { id: 'A', text: 'Ask Claude to estimate them from the data in prose' },
        {
          id: 'B',
          text: 'Use code execution to compute them, then have Claude synthesize the plan from the verified numbers',
        },
        { id: 'C', text: 'Use Research to find industry averages instead' },
        { id: 'D', text: 'Have Claude recall typical figures from training data' },
      ],
      correctOptionId: 'B',
      rationale:
        'Figures a plan rests on must be computed with code execution, not estimated in prose; synthesis comes after the numbers are verified.',
    },
    {
      id: 'm4-rq-3',
      question:
        'A Claude-built dashboard artifact that started as an internal helper is now relied on daily by three departments for reporting. What does this signal?',
      options: [
        { id: 'A', text: 'Nothing; keep iterating by prompt as before' },
        {
          id: 'B',
          text: 'It has become a system others depend on and should be escalated toward Developer or Architect expertise',
        },
        { id: 'C', text: 'Switch to a more capable model and continue' },
        { id: 'D', text: 'Move it into Incognito mode for safety' },
      ],
      correctOptionId: 'B',
      rationale:
        'Dependency by others is the escalation signal; a helper that becomes infrastructure has outgrown Associate scope.',
    },
    {
      id: 'm4-rq-4',
      question:
        'In a contract-review redesign, which step should remain human-retained?',
      options: [
        { id: 'A', text: 'Extracting clauses from the document' },
        { id: 'B', text: 'Flagging departures from the playbook' },
        { id: 'C', text: 'Approving or rejecting each change and signing the contract' },
        { id: 'D', text: 'Computing the financial exposure of a penalty clause' },
      ],
      correctOptionId: 'C',
      rationale:
        'Approval and signing carry accountability and are irreversible; both stay human-retained regardless of how well the AI drafted.',
    },
    {
      id: 'm4-rq-5',
      question:
        'Which description of an AI-assisted contract workflow best builds stakeholder trust?',
      options: [
        { id: 'A', text: '"Our AI reviews contracts automatically."' },
        {
          id: 'B',
          text: '"Claude drafts the redline and flags playbook departures; our legal lead reviews and approves every change before sending."',
        },
        { id: 'C', text: '"Claude handles all the legal work now."' },
        {
          id: 'D',
          text: '"The AI is fully autonomous, so we no longer need legal review."',
        },
      ],
      correctOptionId: 'B',
      rationale:
        'Accurate value-plus-limits with the human gate named builds trust; the others overstate capability and hide oversight.',
    },
  ],
};
