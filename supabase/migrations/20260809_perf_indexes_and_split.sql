-- 20260809_perf_indexes_and_split.sql
--
-- Two independent changes, both from SUPABASE_PERFORMANCE_PLAN.md:
--
--   1. (D5.4) Split `appearance` out of the user_curriculum.paths_data blob.
--   2. (D5.6) Add indexes for the tables the main app reads on load. These tables
--      were created through the dashboard and have never been in version control,
--      so their index state was unknown. Everything here is IF NOT EXISTS and
--      safe to re-run.
--
-- Applying this is backward compatible: the client reads the new `appearance`
-- column and falls back to paths_data->'appearance' when it is null, so old and
-- new clients both keep working during a rollout.


-- ── 1. Appearance column ────────────────────────────────────────────────────
--
-- Previously, changing the theme meant: download the entire curriculum blob,
-- spread it in JS, upload the entire blob back. Two serial round-trips and two
-- full transfers to change one string — and it raced App.jsx's own debounced
-- write of the same blob, so concurrent edits silently overwrote each other.

alter table if exists public.user_curriculum
  add column if not exists appearance jsonb;

-- Backfill from the blob so existing users keep their saved theme.
update public.user_curriculum
   set appearance = paths_data -> 'appearance'
 where appearance is null
   and paths_data ? 'appearance';

-- NOTE: `paths_data->'appearance'` is intentionally left in place. Removing it is
-- a separate migration to run only once every client is reading the new column.


-- ── 2. Indexes ──────────────────────────────────────────────────────────────

-- Community.jsx:233 — filters on channel_id, orders by created_at desc.
create index if not exists messages_channel_created_idx
  on public.messages (channel_id, created_at desc);

-- Community.jsx:511 — looks a user up by email.
create index if not exists messages_user_email_idx
  on public.messages (user_email)
  where user_email is not null;

-- Community.jsx:199 — channels for the active group, ordered by created_at.
create index if not exists channels_group_created_idx
  on public.channels (group_id, created_at);

-- community_members is read by both access paths: "which groups is this user in"
-- (Community.jsx:107) and "who is in this group" (Community.jsx:214).
create index if not exists community_members_user_idx
  on public.community_members (user_id);
create index if not exists community_members_group_idx
  on public.community_members (group_id);

-- Community.jsx:99 — public group list, ordered by created_at.
create index if not exists community_groups_public_created_idx
  on public.community_groups (is_private, created_at);

-- QuizApp.jsx:74 — this user's metrics, newest first.
create index if not exists quiz_metrics_user_created_idx
  on public.quiz_metrics (user_id, created_at desc);

-- AdminManagement.jsx — the directory orders every row by updated_at desc.
create index if not exists user_curriculum_updated_at_idx
  on public.user_curriculum (updated_at desc);

-- `user_curriculum` and `profiles` are read by primary key elsewhere, which the
-- PK index already covers — their cost was payload size, not lookup, and that is
-- addressed by the projections in the client and by section 1 above.

-- Supports the bounded fallback query in Community.jsx when the RPC below is
-- unavailable, and the DISTINCT ON ordering inside it.
create index if not exists messages_email_created_idx
  on public.messages (user_email, created_at desc)
  where user_email is not null;


-- ── 3. active_chat_users() ──────────────────────────────────────────────────
--
-- Community.jsx built its DM suggestion list by downloading every message ever
-- sent and running a Set() over it in the browser. This does the DISTINCT in
-- Postgres and returns at most `limit_n` rows.
--
-- SECURITY INVOKER (the default, stated explicitly for clarity) means RLS on
-- `messages` still applies to the calling user — this function grants no access
-- the caller did not already have.

create or replace function public.active_chat_users(limit_n int default 200)
returns table (user_email text, user_id uuid)
language sql
stable
security invoker
set search_path = public
as $$
  select distinct on (m.user_email) m.user_email, m.user_id
    from public.messages m
   where m.user_email is not null
   order by m.user_email, m.created_at desc
   limit limit_n;
$$;

grant execute on function public.active_chat_users(int) to authenticated;
