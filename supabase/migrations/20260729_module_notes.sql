-- Per-module learner notes.  This is the backing store used by ModuleNotes.
-- The unique key is required for the application's user_id,module_id upsert.

CREATE TABLE IF NOT EXISTS public.module_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{"type":"doc","content":[]}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, module_id)
);

-- Support projects where the table predates this migration but was created
-- without the conflict target required by upsert(..., onConflict).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.module_notes'::regclass
      AND contype = 'u'
      AND conkey = ARRAY[
        (SELECT attnum FROM pg_attribute WHERE attrelid = 'public.module_notes'::regclass AND attname = 'user_id' AND NOT attisdropped),
        (SELECT attnum FROM pg_attribute WHERE attrelid = 'public.module_notes'::regclass AND attname = 'module_id' AND NOT attisdropped)
      ]
  ) THEN
    ALTER TABLE public.module_notes
      ADD CONSTRAINT module_notes_user_id_module_id_key UNIQUE (user_id, module_id);
  END IF;
END $$;

ALTER TABLE public.module_notes ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'module_notes'
      AND policyname = 'Users manage their own module notes'
  ) THEN
    CREATE POLICY "Users manage their own module notes"
      ON public.module_notes FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS module_notes_user_updated_at_idx
  ON public.module_notes (user_id, updated_at DESC);
