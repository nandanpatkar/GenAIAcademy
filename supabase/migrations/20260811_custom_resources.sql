-- Account-scoped "My Folders" custom resource library (Resources sidebar).
-- Previously lived only in localStorage under `genai_custom_resources`; this
-- syncs it across devices the same way `user_curriculum` does for the main
-- roadmap data. One row per user holding the whole {folders, assets} blob,
-- since the client already treats it as a single unit (see
-- src/store/customResourcesStore.js).

CREATE TABLE IF NOT EXISTS public.user_custom_resources (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{"folders": [], "assets": []}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_custom_resources ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_custom_resources'
      AND policyname = 'Users manage their own custom resources'
  ) THEN
    CREATE POLICY "Users manage their own custom resources"
      ON public.user_custom_resources FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS user_custom_resources_updated_at_idx
  ON public.user_custom_resources (updated_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_custom_resources TO authenticated;
