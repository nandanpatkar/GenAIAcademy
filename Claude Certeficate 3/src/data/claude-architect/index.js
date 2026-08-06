/*
 * Course: Claude Architect — Practice Set
 *
 * Unlike the other hand-written courses, this one has no teaching modules —
 * it started life as a single 500-question practice dump with its own answer
 * key, not a course export with checkpoints per module. So `modules` is
 * empty and the course is quiz-only; CourseHome, CourseCard, and App already
 * branch on that (see the "quiz-only" comments in those files).
 *
 * The dump is not organised into named, weighted exam domains the way the
 * CCAO-F blueprint is — questions carry ad hoc scenario labels (218 distinct
 * ones) that are too fine-grained to use as a domain scope, so every
 * question is filed under one umbrella domain instead.
 */

import { claudeArchitectQuestions } from './questions.js';

const domains = [
  {
    id: 'claude-architect-practice',
    title: 'Claude Architect practice set',
  },
];

export const claudeArchitect = {
  id: 'claude-architect-practice-set',
  code: 'ARCH',
  title: 'Claude Architect — Practice Set',
  provider: 'Unofficial practice set',
  level: 'Architect',
  category: 'Practice question bank',
  description:
    'Five hundred scenario-based practice questions on building with Claude: project memory and skills, MCP server and tool design, multi-agent orchestration, structured output, prompt engineering, context management, and production reliability. No teaching modules — pure practice, drawn from one large question dump with its own answer key.',
  examFormat: '500 practice questions · no official exam format published',
  /*
   * The source dump states no pass mark. This mirrors the Associate exam's
   * 72% as a study target, same convention used for CCDV-F — not a
   * confirmed threshold for any real exam.
   */
  passMarkPercent: 72,

  modules: [],

  quiz: {
    domains,
    questions: claudeArchitectQuestions,
  },
};
