-- Per-user attempts at the AWS MLA-C01 practice exams.
--
-- One row per attempt, in either mode. A row stays `in_progress` while the
-- learner is working (the runner writes back answers, flags, the cursor and —
-- in exam mode — the remaining clock, so an attempt can be resumed on any
-- device), and flips to `completed` when the test is submitted or the timer
-- runs out. Completed rows are never reused, so they double as the score
-- history the landing screen shows.

CREATE TABLE IF NOT EXISTS public.mla_exam_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_slug TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('practice', 'exam')),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),

  -- { "<question id>": ["A", "C"] } — option letters, so the shape is the same
  -- for single- and multi-select questions.
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Question ids the learner flagged for review.
  flagged JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Question ids already revealed in practice mode; an answer stays checkable
  -- exactly once, and the reveal survives a reload.
  revealed JSONB NOT NULL DEFAULT '[]'::jsonb,
  current_index INTEGER NOT NULL DEFAULT 0,
  -- Exam mode only: what was left on the 210-minute clock at the last save.
  seconds_remaining INTEGER,

  -- Set on completion.
  score INTEGER,
  correct_count INTEGER,
  passed BOOLEAN,
  domain_breakdown JSONB,

  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.mla_exam_attempts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'mla_exam_attempts'
      AND policyname = 'Users manage their own MLA exam attempts'
  ) THEN
    CREATE POLICY "Users manage their own MLA exam attempts"
      ON public.mla_exam_attempts FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Resume looks up the newest unfinished attempt for one exam in one mode.
CREATE INDEX IF NOT EXISTS mla_exam_attempts_resume_idx
  ON public.mla_exam_attempts (user_id, exam_slug, mode, status, updated_at DESC);

-- The landing screen lists the learner's finished attempts, newest first.
CREATE INDEX IF NOT EXISTS mla_exam_attempts_history_idx
  ON public.mla_exam_attempts (user_id, completed_at DESC);
