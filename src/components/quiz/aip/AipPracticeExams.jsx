import React from "react";
import MlaPracticeExams from "../mla/MlaPracticeExams";
import {
  AIP_PRACTICE_EXAMS, AIP_EXAM_SETS, AIP_EXAM_MINUTES, AIP_SCORE_MIN,
  AIP_SCORE_MAX, AIP_PASSING_SCORE, AIP_CERTIFICATION,
} from "../../../data/aipPracticeExams";

/* AWS AIP-C01 practice exams — the five 75-question papers that ship with the
 * Generative AI Developer – Professional study guide.
 *
 * Same landing, runner and score report as the MLA-C01 papers, fed this bank's
 * config: a 180-minute clock and 750 of 1000 to pass. Attempts share the
 * mla_exam_attempts table, told apart by their `aip-c01-practice-<n>` slugs.
 */

export const AIP_EXAM_CONFIG = {
  certification: AIP_CERTIFICATION,
  exams: AIP_PRACTICE_EXAMS,
  sets: AIP_EXAM_SETS,
  minutes: AIP_EXAM_MINUTES,
  scoreMin: AIP_SCORE_MIN,
  scoreMax: AIP_SCORE_MAX,
  passingScore: AIP_PASSING_SCORE,
};

export default function AipPracticeExams({ onClose }) {
  return <MlaPracticeExams config={AIP_EXAM_CONFIG} onClose={onClose} />;
}
