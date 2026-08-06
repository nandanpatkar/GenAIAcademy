/*
 * Course: Claude Certified Associate – Foundations (CCAO-F)
 *
 * Assembles the modules and the quiz bank into one course object. To add a new
 * module, create a file under ./modules/ and register it in the `modules`
 * array below — nothing else needs to change.
 */

import { module1 } from './modules/module1.js';
import { module2 } from './modules/module2.js';
import { module3 } from './modules/module3.js';
import { module4 } from './modules/module4.js';
import { module5 } from './modules/module5.js';
import { module6 } from './modules/module6.js';
import { module7 } from './modules/module7.js';
import { module8 } from './modules/module8.js';
import { partA } from './quizPartA.js';
import { partB } from './quizPartB.js';

/*
 * Exam domains and their blueprint weights, from the header of the practice
 * question dump. `moduleId` links a domain to the module that teaches it, which
 * lets the quiz offer module-specific practice.
 *
 * To add a domain for a new course, define it in that course's own file.
 */
const domains = [
  {
    id: 'output-evaluation',
    title: 'Output Evaluation & Validation',
    weight: 21,
    moduleId: 'module-3',
  },
  {
    id: 'workflow-integration',
    title: 'Workflow Integration & Solution Design',
    weight: 16,
    moduleId: 'module-4',
  },
  {
    id: 'governance',
    title: 'Governance, Risk & Responsible Use',
    weight: 15,
    moduleId: 'module-6',
  },
  {
    id: 'prompting',
    title: 'Prompting & Task Execution',
    weight: 14,
    moduleId: 'module-2',
  },
  {
    id: 'product-model-selection',
    title: 'Product & Model Selection',
    weight: 12,
    moduleId: 'module-1',
  },
  {
    id: 'configuration',
    title: 'Configuration & Knowledge Management',
    weight: 12,
    moduleId: 'module-5',
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting & Optimization',
    weight: 10,
    moduleId: 'module-7',
  },
];

export const claudeAssociateFoundations = {
  id: 'claude-certified-associate-foundations',
  code: 'CCAO-F',
  title: 'Claude Certified Associate – Foundations',
  provider: 'Anthropic',
  level: 'Associate',
  description:
    'Operate Claude with professional discipline: structured prompts in, validated outputs out, governed workflows throughout. Eight modules covering platform selection, prompting, output evaluation, workflow integration, configuration, governance, and troubleshooting.',
  examFormat: '60 scenario-based MCQs · 120 minutes · pass mark 720/1000',
  passMarkPercent: 72,

  modules: [
    module1,
    module2,
    module3,
    module4,
    module5,
    module6,
    module7,
    module8,
    /* Add further modules here. */
  ],

  quiz: {
    domains,
    /* Part A duplicates the module quizzes; Part B is 50 original questions.
       Both are tagged via `source` so learners can choose either or both. */
    questions: [...partA, ...partB],
  },
};
