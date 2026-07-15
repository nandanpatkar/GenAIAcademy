-- ============================================================
-- Exam Bank: generic resource cache
-- ============================================================
-- Backs flashcards, videos, study-guide TOC/articles, and the
-- per-exam resource-availability check. Written to by the exam-*
-- API routes using SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
--
-- resource_type: 'flashcards' | 'videos' | 'studyguide_toc'
--              | 'studyguide_article' | 'availability'
-- resource_key: '' for singleton resources; the study-guide topic
--   path (e.g. 'cloud-concepts/what-is-cloud-computing') for
--   'studyguide_article', since there's one row per topic.

CREATE TABLE IF NOT EXISTS cached_exam_resources (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_slug     TEXT        NOT NULL,
  resource_type TEXT        NOT NULL,
  resource_key  TEXT        NOT NULL DEFAULT '',
  data          JSONB       NOT NULL DEFAULT '{}',
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (exam_slug, resource_type, resource_key)
);

ALTER TABLE cached_exam_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read cached exam resources"
  ON cached_exam_resources FOR SELECT
  USING (true);

-- No insert/update/delete policy for anon/authenticated — writes only
-- happen server-side via the service role key, which bypasses RLS.
