# LangFlow sidebar and deployment plan

## Outcome

The Academy exposes an **admin-only LangFlow** item in the Agents sidebar group. It opens the
separately deployed Langflow IDE inside the Academy, with a new-tab fallback for browsers that
block embedded sign-in. The browser only receives the public Langflow URL; it never receives a
Langflow execution API key.

## What is implemented in this repository

1. `src/components/LangFlowEmbed.jsx` renders the Langflow IDE once `VITE_LANGFLOW_URL` is set.
   It shows a clear setup state until then and preserves an explicit new-tab escape route.
2. The sidebar and navigation state treat `langflow` as an admin-only destination in the Agents
   group. This applies to both sidebar variants and carries over for saved sidebar layouts.
3. `langflow-deploy/` supplies a pinned Langflow 1.11.1 Docker image and a Render Blueprint for
   a **separate** Free Render account.
4. The existing Cloudflare keep-warm Worker is extended to accept an optional `LANGFLOW_TARGET`,
   so one Worker can keep the separate Render service awake at `/health`.

## Deployment procedure

### 1. Deploy Langflow in the separate Render account

1. Create a new Render Blueprint, selecting `langflow-deploy/render.yaml` in this repository.
2. Leave the service plan as `free` for a personal, single-user proof of concept.
3. In Render's secret prompt, set a private `LANGFLOW_SUPERUSER` and a strong
   `LANGFLOW_SUPERUSER_PASSWORD`. Render generates `LANGFLOW_SECRET_KEY`; do not rotate it after
   storing model credentials, or Langflow cannot decrypt the existing values.
4. Wait for the deploy and open `https://<render-service>.onrender.com/health`; it must return
   success before using the UI.
5. Sign in to Langflow, create a small cloud-model flow, run it, and export the flow JSON to a
   private repository as the source of truth.

The Free database expires after 30 days and the Free service has no persistent disk. This is
appropriate only for experimenting. Before the database expires, export flows and upgrade or
recreate the database. Do not put user data, long-lived document uploads, or production API keys
into this deployment.

### 2. Keep the separate service warm (optional but recommended for the Free demo)

1. In `jobscout-keepwarm-worker/wrangler.jsonc`, set `LANGFLOW_TARGET` to
   `https://<render-service>.onrender.com/health` before deploying the Worker.
2. Deploy the Worker. It sends the existing ten-minute health ping to both Job Scout and
   Langflow when the optional target is configured.
3. Check the Worker logs after the first scheduled tick. Both targets should report HTTP 200.

Do not deploy Langflow on the existing Render account: Job Scout is deliberately kept awake and
already uses nearly all of that account's 750 Free instance-hours each month.

### 3. Connect the Academy deployment

1. Add this Vercel production environment variable:

   ```env
   VITE_LANGFLOW_URL=https://<render-service>.onrender.com
   ```

2. Redeploy the Academy. `VITE_LANGFLOW_URL` is intentionally public: it is only the browser URL
   of the embedded IDE, not a credential.
3. Sign in as an Academy admin. Open **Agents → LangFlow**. Non-admins cannot see the item.
4. If an embedded login is blocked by browser privacy policy, choose **Open in new tab**. Keep
   Langflow on a same-parent-domain subdomain later (for example, `flows.example.com`) to reduce
   cookie-framing friction.

### 4. Production follow-up (not enabled by this change)

When an approved Langflow flow should serve Academy learners, create a dedicated Vercel server
endpoint such as `/api/langflow-run`. It must authenticate the Academy user, enforce a per-flow
allowlist and rate limit, and call Langflow with a server-only execution API key. Never call a
private Langflow execution endpoint from the browser or send user model keys through the iframe.

## Acceptance checklist

- [ ] Render `/health` returns HTTP 200 after deploy and after a keep-warm tick.
- [ ] Langflow sign-in, flow save, and a cloud-model run work for the admin account.
- [ ] The Academy admin sees Agents → LangFlow and the iframe loads.
- [ ] A non-admin cannot see or open the LangFlow sidebar destination.
- [ ] The new-tab fallback works.
- [ ] Flow JSON has been exported before the Free Postgres expiry date.
