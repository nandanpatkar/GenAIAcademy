-- ============================================================
-- Exam Bank: cached scraped questions
-- ============================================================
-- Written to by api/exam-scrape.js / api/exam-export.js using the
-- SUPABASE_SERVICE_ROLE_KEY (server-side only, bypasses RLS).
-- Read publicly so the client could in theory read cache state directly,
-- though in practice the app reads through the API routes.

CREATE TABLE IF NOT EXISTS cached_exam_questions (
  exam_slug   TEXT        PRIMARY KEY,
  exam_name   TEXT        NOT NULL DEFAULT '',
  questions   JSONB       NOT NULL DEFAULT '[]',
  scraped_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE cached_exam_questions ENABLE ROW LEVEL SECURITY;

-- Public read (cached exam questions are not user-specific or sensitive)
CREATE POLICY "Public can read cached exam questions"
  ON cached_exam_questions FOR SELECT
  USING (true);

-- No insert/update/delete policy for anon/authenticated — writes only
-- happen server-side via the service role key, which bypasses RLS.
