/*
 * Module 8 — Course Summary & Next Steps. From MODULE 8.txt.
 * This module has no quiz in the source material, so `reviewQuestions` is empty.
 */

export const module8 = {
  id: 'module-8',
  number: 8,
  title: 'Course Summary & Next Steps',
  shortTitle: 'Course Summary',
  summary:
    'Recap the journey, prepare for the exam, and recognize escalation boundaries to the Developer and Architect tracks.',
  duration: '8 min',
  lede: 'You started this course using Claude and you finish it operating Claude with increased discipline: structured prompts in, validated outputs out, governed workflows throughout.',
  objectives: [],

  sections: [
    {
      id: 'm8-closing',
      eyebrow: 'Course Closing',
      duration: '8 min',
      title: 'Course Summary & Next Steps',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'You started this course using Claude and you finish it operating Claude with increased discipline: structured prompts in, validated outputs out, governed workflows throughout.',
        },
        {
          type: 'p',
          text: 'That shift is what this course was for, and it is built from seven connected skills.',
        },
        { type: 'h', level: 3, text: 'The journey, end to end' },
        {
          type: 'p',
          text: 'The modules followed the arc of a real piece of work: select the right product, model, and features; prompt them with structure; evaluate and validate what comes back; integrate Claude into a team workflow; configure the environment so it holds; govern the use responsibly; and troubleshoot and optimize when results fall short.',
        },
        {
          type: 'p',
          text: 'Each skill assumes the one before it: selection decides what you are prompting, prompting shapes what you evaluate, evaluation is what makes integration and configuration safe to trust, and governance and troubleshooting are how you keep the whole thing reliable. Working together, they form a single practitioner capability for operating Claude with discipline, and the order they build matters as much as the content itself.',
        },
        {
          type: 'cards',
          items: [
            {
              eyebrow: 'Module 1',
              title: 'Product & Model Selection',
              body: 'Choose the right entry point, model, and features for a task.',
            },
            {
              eyebrow: 'Module 2',
              title: 'Prompting',
              body: 'Build structured prompts and adapt them to the task type.',
            },
            {
              eyebrow: 'Module 3',
              title: 'Output Evaluation',
              body: 'Validate output and know when human review is mandatory.',
            },
            {
              eyebrow: 'Module 4',
              title: 'Workflow Integration',
              body: 'Map a workflow against Delegation criteria and redesign it safely.',
            },
            {
              eyebrow: 'Module 5',
              title: 'Configuration',
              body: 'Configure and maintain Projects, instructions, and knowledge.',
            },
            {
              eyebrow: 'Module 6',
              title: 'Governance',
              body: 'Apply use-case, data, policy, and ethics judgment.',
            },
            {
              eyebrow: 'Module 7',
              title: 'Troubleshooting',
              body: 'Diagnose underperformance and optimize workflows.',
            },
          ],
        },
        { type: 'h', level: 3, text: 'The AI Fluency thread' },
        {
          type: 'p',
          text: 'Four competencies ran through every module and are worth carrying forward as a single mental model: Description, Discernment, Diligence, Delegation.',
        },
        {
          type: 'p',
          text: '**Description** — telling Claude precisely what you want. This is the prompting discipline you built when you learned to structure a request and adapt it to the task.',
        },
        { type: 'h', level: 3, text: 'Preparing for the exam' },
        {
          type: 'p',
          text: 'The certification exam is scenario-style: its 60 questions ask you to apply a skill or make a judgment rather than recall a fact. The exam mirrors the seven content modules you just worked through, so the highest-leverage preparation is to find your weakest module and study it against the matching part of the blueprint. Work back through that module\'s decision frameworks rather than rereading the prose. The exam tests whether you can apply them under a new scenario.',
        },
        { type: 'h', level: 3, text: 'Knowing your boundary' },
        {
          type: 'p',
          text: 'Part of operating Claude well is knowing what not to attempt alone. When a solution needs API integration, agent building, or tool development, it belongs with a Claude Developer. When it needs enterprise architecture, integration design, or governance at scale, it belongs with a Claude Architect. Recognizing that boundary, and escalating across it, is itself an Associate-level skill.',
        },
        { type: 'h', level: 3, text: 'Continued learning' },
        {
          type: 'p',
          text: 'Keep practicing in your own real work, where the skills consolidate fastest. For those moving toward building on Claude, the Developer path covers APIs, SDKs, and agents; the Architect path covers enterprise solution design. The AI Fluency vocabulary you learned here carries directly into both.',
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'The closing message',
          body: [
            'You now operate Claude with professional discipline. The habits this course built, structured prompts, validated outputs, deliberate delegation, maintained configurations, and governed use, are the same habits that distinguish reliable AI-assisted professionals from people who simply have access to the tool.',
          ],
        },
      ],
    },

    {
      id: 'm8-sources',
      eyebrow: 'Sources',
      title: 'Sources',
      blocks: [
        {
          type: 'p',
          text: 'All product and exam descriptions are based on the Anthropic Claude Associate blueprint (v1.3) and claude.ai features as of June 2026. Verify against current Anthropic documentation and the current Pearson exam specification at publish:',
        },
        {
          type: 'ul',
          items: [
            'Anthropic Claude Associate certification blueprint and exam specification: confirm question count, section weights, and format before finalizing',
            'AI Fluency Framework: Description, Discernment, Diligence, Delegation',
            'Certification family: Claude Developer and Claude Architect path scope, confirm current boundary descriptions',
          ],
        },
        {
          type: 'callout',
          variant: 'disclaimer',
          title: 'Disclaimer / Notice for Educational Content',
          body: [
            "We built this Associate course Module 8: Course Summary & Next Steps to help you get real work done with Claude. Treat it as educational content. It doesn't constitute legal, financial, or other professional advice, so adapt what you learn to your own situation. Our products and services evolve quickly, so certain content may contain errors or be outdated; remember to verify on Anthropic's website or docs. Examples and scenarios used in the course are illustrative and often fictitious. If the course material mentions a company or product, it doesn't mean Anthropic endorses them, they endorse Anthropic, or that we're affiliated. Also note your use of Anthropic products and services is covered by our terms, policies and documentation; if anything in this course conflicts with them, they control.",
          ],
        },
      ],
    },
  ],

  /* No quiz in Module 8 of the source course. */
  reviewQuestions: [],
};
