-- ============================================================
-- Cloud IDE: Projects Tables Migration
-- ============================================================

-- projects: one row per user project
CREATE TABLE IF NOT EXISTS projects (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name             TEXT        NOT NULL,
  description      TEXT        NOT NULL DEFAULT '',
  github_repo      TEXT        NOT NULL DEFAULT '',
  github_branch    TEXT        NOT NULL DEFAULT 'main',
  github_owner     TEXT        NOT NULL DEFAULT '',
  default_language TEXT        NOT NULL DEFAULT 'python',
  env_vars         JSONB       NOT NULL DEFAULT '{}',
  build_command    TEXT        NOT NULL DEFAULT '',
  run_command      TEXT        NOT NULL DEFAULT '',
  file_count       INT         NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- project_files: individual files and folders within a project
CREATE TABLE IF NOT EXISTS project_files (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID        REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  parent_folder TEXT        NOT NULL DEFAULT '/',
  filename      TEXT        NOT NULL,
  file_path     TEXT        NOT NULL,
  file_type     TEXT        NOT NULL DEFAULT 'file',
  content       TEXT        NOT NULL DEFAULT '',
  storage_path  TEXT        NOT NULL DEFAULT '',
  language      TEXT        NOT NULL DEFAULT 'plaintext',
  version       INT         NOT NULL DEFAULT 1,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, file_path)
);

-- file_versions: snapshot history per file
CREATE TABLE IF NOT EXISTS file_versions (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id    UUID        REFERENCES project_files(id) ON DELETE CASCADE NOT NULL,
  content    TEXT,
  version    INT         NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE projects      ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own projects"
  ON projects FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage files of their projects"
  ON project_files FOR ALL
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()))
  WITH CHECK (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "Users manage versions of their files"
  ON file_versions FOR ALL
  USING (file_id IN (
    SELECT pf.id FROM project_files pf
    JOIN projects p ON p.id = pf.project_id
    WHERE p.user_id = auth.uid()
  ))
  WITH CHECK (file_id IN (
    SELECT pf.id FROM project_files pf
    JOIN projects p ON p.id = pf.project_id
    WHERE p.user_id = auth.uid()
  ));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id       ON projects (user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_files_project  ON project_files (project_id, file_path);
CREATE INDEX IF NOT EXISTS idx_file_versions_file_id  ON file_versions (file_id, version DESC);

-- Grant permissions to PostgREST roles so the API can access the tables
GRANT ALL ON TABLE projects TO anon, authenticated, service_role;
GRANT ALL ON TABLE project_files TO anon, authenticated, service_role;
GRANT ALL ON TABLE file_versions TO anon, authenticated, service_role;
