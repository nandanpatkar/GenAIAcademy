/**
 * What sets one certification's practice bank apart from another's.
 *
 * The landing screen, the runner, the score report and the scoring helpers
 * read these fields instead of one certification's constants, so the same
 * components serve every bank. MLA-C01 is the default. The AIP-C01 papers
 * pass their own config (components/quiz/aip/AipPracticeExams.jsx).
 *
 *   certification  { code, name } for the hero and the domain hint
 *   exams, sets    the generated manifest: papers and the sets that group them
 *   minutes        exam-mode clock
 *   scoreMin/Max   the reported AWS scale
 *   passingScore   pass mark on that scale
 */

import {
  MLA_PRACTICE_EXAMS, MLA_EXAM_SETS, MLA_EXAM_MINUTES, MLA_SCORE_MIN,
  MLA_SCORE_MAX, MLA_PASSING_SCORE, MLA_CERTIFICATION,
} from "../../../data/mlaPracticeExams";

export const MLA_EXAM_CONFIG = {
  certification: MLA_CERTIFICATION,
  exams: MLA_PRACTICE_EXAMS,
  sets: MLA_EXAM_SETS,
  minutes: MLA_EXAM_MINUTES,
  scoreMin: MLA_SCORE_MIN,
  scoreMax: MLA_SCORE_MAX,
  passingScore: MLA_PASSING_SCORE,
};
