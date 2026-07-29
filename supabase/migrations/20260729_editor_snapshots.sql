-- Cloud backup for the embedded AFFiNE Workspace Notes editor.
-- The editor remains local-first; this table stores each user's latest binary
-- snapshot for every document and is restored on a fresh browser/device.

CREATE TABLE IF NOT EXISTS public.editor_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doc_id TEXT NOT NULL,
  bin TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, doc_id)
);

-- Older deployments may already have the table but lack the conflict target
-- used by the application's upsert.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.editor_snapshots'::regclass
      AND contype = 'u'
      AND conkey = ARRAY[
        (SELECT attnum FROM pg_attribute WHERE attrelid = 'public.editor_snapshots'::regclass AND attname = 'user_id' AND NOT attisdropped),
        (SELECT attnum FROM pg_attribute WHERE attrelid = 'public.editor_snapshots'::regclass AND attname = 'doc_id' AND NOT attisdropped)
      ]
  ) THEN
    ALTER TABLE public.editor_snapshots
      ADD CONSTRAINT editor_snapshots_user_id_doc_id_key UNIQUE (user_id, doc_id);
  END IF;
END $$;

ALTER TABLE public.editor_snapshots ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'editor_snapshots'
      AND policyname = 'Users manage their own editor snapshots'
  ) THEN
    CREATE POLICY "Users manage their own editor snapshots"
      ON public.editor_snapshots FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS editor_snapshots_user_updated_at_idx
  ON public.editor_snapshots (user_id, updated_at DESC);
