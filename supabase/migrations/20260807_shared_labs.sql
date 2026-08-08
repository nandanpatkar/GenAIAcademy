-- Shared Labs are intentionally collaborative: every authenticated learner can
-- add, edit, or remove a lab, and all signed-in users read the same catalog.
CREATE TABLE IF NOT EXISTS public.shared_labs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  description TEXT NOT NULL DEFAULT '' CHECK (char_length(description) <= 500),
  category TEXT NOT NULL DEFAULT 'Community lab' CHECK (char_length(category) BETWEEN 1 AND 60),
  html_code TEXT NOT NULL CHECK (char_length(html_code) BETWEEN 1 AND 1048576),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.shared_labs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users collaborate on shared labs" ON public.shared_labs;
CREATE POLICY "Authenticated users collaborate on shared labs"
  ON public.shared_labs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS shared_labs_updated_at_idx
  ON public.shared_labs (updated_at DESC);
