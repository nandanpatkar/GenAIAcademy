-- Account-scoped saved blog articles. The article snapshot supports both
-- archive markdown and CMS notes without a cross-table dependency.

CREATE TABLE IF NOT EXISTS public.blog_favorites (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_key TEXT NOT NULL,
  article JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, article_key)
);

ALTER TABLE public.blog_favorites ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'blog_favorites'
      AND policyname = 'Users manage their own blog favorites'
  ) THEN
    CREATE POLICY "Users manage their own blog favorites"
      ON public.blog_favorites FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS blog_favorites_user_created_at_idx
  ON public.blog_favorites (user_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.blog_favorites TO authenticated;
