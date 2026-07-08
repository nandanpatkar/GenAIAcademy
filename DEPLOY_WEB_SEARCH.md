# Deploying Web Search + Course Notes AI Tutor context

## 1. Set the Tavily key as a Supabase secret (NOT in code)

Run this in your own terminal (needs Supabase CLI logged in and linked to
your project) — replace `YOUR_KEY_HERE` with your actual key, and run it
directly in your terminal, not by pasting it into any file:

```bash
supabase secrets set TAVILY_API_KEY=YOUR_KEY_HERE
```

This stores it server-side only, in your Supabase project's secrets vault —
never in git, never in the client bundle. This doc intentionally doesn't
contain the real key value, since this file itself gets committed to your
repo.

**Please rotate the key you shared with me in chat.** Since it appeared in
plaintext in our conversation, treat it as compromised regardless of where
it ends up. Generate a fresh one at https://app.tavily.com and use that
value in the command above instead.

## 2. Deploy the edge function

```bash
supabase functions deploy web-search
```

That's the whole deploy — no other config needed. The function reads
`TAVILY_API_KEY` from the secret you just set via `Deno.env.get()`.

## 3. Verify it works

From your browser console on the deployed app (while logged in):

```js
const { data, error } = await supabase.functions.invoke('web-search', {
  body: { query: 'latest RAG techniques 2026' }
});
console.log(data, error);
```

You should get back `{ results: [{ title, url, content }, ...] }`.

## 4. Nothing else to migrate

The "Course Notes" toggle reuses your existing `module_notes` table as-is
(no schema changes) — it fetches all of the current user's notes once per
session (lazily, only when the toggle is first switched on) and does
client-side keyword matching against whichever question is open, so there's
no new table, no new Supabase migration, and no extra AI calls just to find
relevant notes.

## How the two toggles behave

- **Web Search** (off by default): when on, every message you send in that
  chat first calls the `web-search` edge function with
  `"{question title} {your message}"` as the query, gets back up to 5
  results (title/url/short snippet), and passes them to the AI as
  additional context it's told to use only when it adds real value over the
  reference answer.
- **Course Notes** (off by default): when on, your notes across the whole
  curriculum are fetched once (cached for the session), keyword-matched
  against the current question + course + chapter, and the top 2 matches
  (by keyword overlap) get passed in as context, labeled with which module
  they're from.
- Both are independent — you can have neither, either, or both on at once.
  Both add latency to each message (web search adds a network round-trip;
  notes are instant once cached), so the loading indicator now says
  "Searching the web..." / "Checking your notes..." / "Thinking..."
  depending on what's happening.
- Neither toggle affects Gemini/Azure OpenAI usage directly — they only
  change what's stuffed into the context sent to whichever provider you've
  already got configured. Longer context = more input tokens, which is
  worth knowing if you're close to Gemini's free-tier limits with search
  enabled on every message in a long session.
