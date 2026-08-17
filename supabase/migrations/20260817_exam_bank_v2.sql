-- ============================================================
-- Exam Bank: Quiz 2.0 test-build cache (isolated from v1)
-- ============================================================
-- Mirrors cached_exam_questions / cached_exam_resources exactly, but under
-- separate table names so api/_lib/examScraper2.js (used only by
-- api/exam2.js / Quiz 2.0) can never read or write the same rows as the
-- shipped v1 scraper. Written to by api/exam2.js using
-- SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).

CREATE TABLE IF NOT EXISTS cached_exam_questions_v2 (
  exam_slug   TEXT        PRIMARY KEY,
  exam_name   TEXT        NOT NULL DEFAULT '',
  questions   JSONB       NOT NULL DEFAULT '[]',
  scraped_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE cached_exam_questions_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read cached exam questions v2"
  ON cached_exam_questions_v2 FOR SELECT
  USING (true);

-- No insert/update/delete policy for anon/authenticated — writes only
-- happen server-side via the service role key, which bypasses RLS.

-- resource_type: 'flashcards' | 'videos' | 'studyguide_toc'
--              | 'studyguide_article' | 'availability'
-- resource_key: '' for singleton resources; the study-guide topic path
--   for 'studyguide_article', since there's one row per topic.
CREATE TABLE IF NOT EXISTS cached_exam_resources_v2 (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_slug     TEXT        NOT NULL,
  resource_type TEXT        NOT NULL,
  resource_key  TEXT        NOT NULL DEFAULT '',
  data          JSONB       NOT NULL DEFAULT '{}',
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (exam_slug, resource_type, resource_key)
);

ALTER TABLE cached_exam_resources_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read cached exam resources v2"
  ON cached_exam_resources_v2 FOR SELECT
  USING (true);

-- No insert/update/delete policy for anon/authenticated — writes only
-- happen server-side via the service role key, which bypasses RLS.
