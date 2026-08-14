-- Make the global admin config row readable and writable.
--
-- The Admin Panel keeps workspace-wide settings — the admin list, locked users,
-- sidebar item visibility, study-path visibility — in one sentinel row of
-- `user_curriculum` whose id is the all-zero UUID. Every other row in that
-- table belongs to the user whose id it carries, and the policies created from
-- the dashboard match on exactly that: `auth.uid() = id`.
--
-- The sentinel row matches no one's uid, so under those policies:
--
--   * `persistSidebarConfig`'s upsert fails with 42501 (new row violates
--     row-level security policy), which the client logged and swallowed — so a
--     visibility toggle looked saved until the next refresh, and
--   * `fetchGlobalConfig`'s select returned zero rows rather than an error, so
--     every client fell back to its built-in defaults. That is why a setting
--     made on one machine was invisible on another.
--
-- RLS policies are OR'd together, so the three below only widen access for the
-- one sentinel row. The existing per-user policies are untouched, and no other
-- row becomes reachable.
--
-- Run this in the Supabase SQL editor (or `supabase db push`).

-- ── who may administer the workspace ────────────────────────────────────────
--
-- Admin-ness has lived only in the client (an email compared against a list
-- that itself lives in the unreadable row). A write policy needs a source of
-- truth the database can check, so it gets its own small table.

create table if not exists public.app_admins (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.app_admins enable row level security;

-- Seed with the owner. Add further admins with:
--   insert into public.app_admins (email) values ('someone@example.com');
insert into public.app_admins (email)
values ('nandanpatkar14114@gmail.com')
on conflict (email) do nothing;

drop policy if exists "app_admins readable by signed-in users" on public.app_admins;
create policy "app_admins readable by signed-in users"
  on public.app_admins for select
  to authenticated
  using (true);

-- ── the global config row ───────────────────────────────────────────────────

-- Readable by any signed-in user: the sidebar and roadmap have to know what an
-- admin hid before they can hide it. Kept to `authenticated` rather than
-- `anon` because the blob also carries the admin list and locked user ids.
drop policy if exists "global config row is readable" on public.user_curriculum;
create policy "global config row is readable"
  on public.user_curriculum for select
  to authenticated
  using (id = '00000000-0000-0000-0000-000000000000'::uuid);

-- Writable only by an admin, and only this row.
drop policy if exists "global config row is insertable by admins" on public.user_curriculum;
create policy "global config row is insertable by admins"
  on public.user_curriculum for insert
  to authenticated
  with check (
    id = '00000000-0000-0000-0000-000000000000'::uuid
    and (auth.jwt() ->> 'email') in (select email from public.app_admins)
  );

drop policy if exists "global config row is updatable by admins" on public.user_curriculum;
create policy "global config row is updatable by admins"
  on public.user_curriculum for update
  to authenticated
  using (
    id = '00000000-0000-0000-0000-000000000000'::uuid
    and (auth.jwt() ->> 'email') in (select email from public.app_admins)
  )
  with check (
    id = '00000000-0000-0000-0000-000000000000'::uuid
    and (auth.jwt() ->> 'email') in (select email from public.app_admins)
  );

-- Create the row if this workspace has never managed to write it, so the first
-- read after deploying returns a row rather than nothing. Wrapped so that a
-- column this migration cannot know about (the table predates version control)
-- cannot roll back the policies above — the Admin Panel will simply create the
-- row itself on the first save.
do $$
begin
  insert into public.user_curriculum (id, paths_data)
  values ('00000000-0000-0000-0000-000000000000'::uuid, '{}'::jsonb)
  on conflict (id) do nothing;
exception when others then
  raise notice 'Skipped seeding the global config row: %', sqlerrm;
end $$;
