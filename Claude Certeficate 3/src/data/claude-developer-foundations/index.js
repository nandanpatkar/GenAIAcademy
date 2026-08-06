/*
 * Course: Claude Certified Developer – Foundations (CCDV-F)
 *
 * Assembles the modules and the quiz bank. To add a module, create a file
 * under ./modules/ and register it in the `modules` array below.
 */

import { module1 } from './modules/module1.js';
import { module2 } from './modules/module2.js';
import { module3 } from './modules/module3.js';
import { module4 } from './modules/module4.js';
import { module5 } from './modules/module5.js';
import { crossModule } from './modules/crossModule.js';
import { quizBankA } from './quizBankA.js';
import { quizBankB } from './quizBankB.js';

/*
 * The CCDV-F question dump organises questions by module rather than by named
 * exam domains, and publishes no blueprint weights, so each domain here maps
 * 1:1 to a module and carries no `weight`. The UI shows a question count
 * instead of a percentage when `weight` is absent.
 */
const domains = [
  {
    id: 'mso-foundations',
    title: 'MSO Foundations',
    moduleId: 'dev-module-1',
  },
  {
    id: 'prompting-agents-tools',
    title: 'Production-Grade Prompting, Agents & Tool-Use',
    moduleId: 'dev-module-2',
  },
  {
    id: 'claude-code-mcp',
    title: 'Claude Code, MCP & Integration',
    moduleId: 'dev-module-3',
  },
  {
    id: 'production-evals-security',
    title: 'Production Engineering, Evals & Security',
    moduleId: 'dev-module-4',
  },
  {
    id: 'accelerators-ip',
    title: 'Accelerators and IP Contribution',
    moduleId: 'dev-module-5',
  },
];

export const claudeDeveloperFoundations = {
  id: 'claude-certified-developer-foundations',
  code: 'CCDV-F',
  title: 'Claude Certified Developer – Foundations',
  provider: 'Anthropic',
  level: 'Developer',
  description:
    'Take a Claude prototype into production: model and context fundamentals, tool schemas and agent loops, Claude Code and MCP integration, evals and security hardening, then packaging the result as a reusable, deployable asset.',
  examFormat: '109 practice questions across 5 modules · scenario-style',
  /*
   * The CCDV-F dump does not state a pass mark. This mirrors the Associate
   * exam's 720/1000 as a study target and is labelled as such in the UI —
   * confirm the real threshold against the current exam specification.
   */
  passMarkPercent: 72,

  modules: [
    module1,
    module2,
    module3,
    module4,
    module5,
    crossModule,
    /* Add further modules here. */
  ],

  quiz: {
    domains,
    questions: [...quizBankA, ...quizBankB],
  },
};
