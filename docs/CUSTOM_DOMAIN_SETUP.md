# Custom domain: `learn-genaiacademy.in`

The app moved from the Vercel alias `gen-ai-academy-umber.vercel.app` to the
GoDaddy-registered domain `learn-genaiacademy.in`. Vercel serves the domain the
moment DNS resolves, but four things outside Vercel are pinned to the *origin*
the browser reports and break silently until they are updated too. This is the
whole list, in the order it should be done.

## 1. Attach the domain in Vercel

**Project → Settings → Domains → Add Domain**. Add both `learn-genaiacademy.in`
and `www.learn-genaiacademy.in`; Vercel offers to redirect one to the other —
take the `www` → apex redirect so there is a single canonical origin.

Vercel then shows the exact DNS values for *this* project. Do not copy values
from a blog post: the apex `A` record IP and the subdomain `CNAME` target are
both project-specific now (the CNAME looks like
`d1d4fc829fe7bc7c.vercel-dns-017.com`, not the old shared `cname.vercel-dns.com`).

In **GoDaddy → My Products → Domain → DNS → Manage Zones**:

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| `A` | `@` | the IP Vercel shows | 600 |
| `CNAME` | `www` | the target Vercel shows | 600 |

Delete GoDaddy's default parking records first — the `A @` pointing at a
`Parked` IP and the `CNAME www` pointing at `@`. Leave `MX` and any mail
records alone. `.in` domains propagate in minutes, but allow up to an hour;
Vercel issues the TLS certificate automatically once it sees the records.

Alternative: point GoDaddy's nameservers at Vercel instead. Only do that if no
email or other service depends on the current zone — it moves *all* DNS to
Vercel, not just the web records.

## 2. AV archive CDN — CORS allowlist (in this repo)

`src/services/avArchiveService.js` fetches article markdown cross-origin from
`av-cdn.gen-ai-academy.workers.dev`, and the Worker only echoes
`Access-Control-Allow-Origin` for origins on its allowlist. The suffix rule in
that Worker matches `.vercel.app` only, so a `.in` origin gets nothing back and
every Analytics Vidhya article fails to load.

`av-cdn-worker/wrangler.jsonc` now lists the new domain. Deploy it:

```bash
npm run deploy:av-cdn
```

Images are unaffected either way — `<img>` loads are not CORS-checked.

## 3. Supabase auth redirect allowlist (dashboard)

`src/contexts/AuthContext.jsx` calls `signInWithOAuth` with
`redirectTo: window.location.origin`. Supabase rejects any redirect target not
on its allowlist, so Google sign-in fails on the new domain until it is added.

**Supabase → Authentication → URL Configuration**:

- **Site URL**: `https://learn-genaiacademy.in`
- **Redirect URLs**: add `https://learn-genaiacademy.in/**` (keep the existing
  `localhost` and `.vercel.app` entries so local dev and previews still work)

Nothing changes in Google Cloud Console — Google redirects to Supabase's own
`*.supabase.co/auth/v1/callback`, which is unchanged.

## 4. Job Scout embed — `GRADIO_ROOT_PATH` (Render dashboard)

`/jobscout/*` is a Vercel rewrite to the Render service. Gradio derives the
absolute API root it hands the browser from the `Host` header, which Vercel's
external rewrite replaces with the destination's — so without an explicit
override the embed advertises `onrender.com`, leaves the app's origin, and hits
the `localhost:3000`-only CORS rule at
`services/job-scout/src/job_scout/api.py:239`.

**Render → job-scout → Environment**:

```
GRADIO_ROOT_PATH = https://learn-genaiacademy.in/jobscout
```

Verify after redeploy (the `root` must be the new domain, not `onrender.com`):

```bash
curl -s https://learn-genaiacademy.in/jobscout/ | grep -o '"root":"[^"]*"'
```

## 5. ApiBeam relay — `ALLOWED_ORIGINS` (Oracle VM)

The self-hosted relay allowlists the app origin explicitly. On the VM, edit
`/etc/genai-apibeam/relay.env`:

```
ALLOWED_ORIGINS=https://learn-genaiacademy.in,https://gen-ai-academy-umber.vercel.app
```

Then restart the relay. Keep `EXTENSION_ID` unchanged. Note that CORS
allowlists cannot use wildcard subdomains — each origin has to be listed in
full. See `README/documentation/API_BEAM_RELAY_TROUBLESHOOTING.md`.

## Deliberately unchanged

- **`vercel.json`** — every rewrite is origin-relative (`/langchain/(.*)`,
  `/jobscout/(.*)`, `/api/...`). They follow whatever hostname serves them.
- **`docs-cdn-worker`** — reached only through a Vercel rewrite, so the browser
  sees it as same-origin and no CORS allowlist applies.
- **`api/*.js`** — all send `Access-Control-Allow-Origin: *`.
- **`jobscout-keepwarm-worker`** — pings the `onrender.com` hostname directly by
  design, never the site domain.
- **Sub-app `robots.txt` / `sitemap.xml`** under `public/git-visualizer/`,
  `public/flow-design/`, `public/editor/`, `public/aws-simulator/` — vendored
  third-party artifacts naming their upstream projects' own domains. They are
  not this site's SEO surface.
- **The Chrome extension manifest** — its content scripts match ChatGPT, Claude
  and Z.ai, never this site.

## Worth doing, not required

The root `index.html` has no canonical URL, no Open Graph tags and there is no
root `robots.txt` or `sitemap.xml`. Now that the site has a real domain, adding
`<link rel="canonical" href="https://learn-genaiacademy.in/">` plus `og:url` /
`og:image` is what makes shared links render a preview card and keeps search
engines from indexing the `.vercel.app` alias as a duplicate.
