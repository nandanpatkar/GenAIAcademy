# ApiBeam on a new laptop — simple setup guide

Use this guide when your GenAI Academy + Oracle ApiBeam relay are already deployed and you want to use Atlas from a **different laptop**.

## What you need

- Google Chrome (use a normal Chrome profile, not Incognito).
- An account that can sign in to the AI website you want ApiBeam to use, such as ChatGPT.
- Internet access to the deployed Academy and relay.

You do **not** need to install Node.js, clone this repository, start a local server, or log in to Oracle just to chat from the new laptop.

## Your production addresses

| Item | Address |
| --- | --- |
| GenAI Academy | `https://learn-genaiacademy.in/` |
| ApiBeam relay health check | `https://130-210-8-149.sslip.io/healthz` |
| ApiBeam relay base URL | `https://130-210-8-149.sslip.io/` |
| ApiBeam Chrome extension | `https://chromewebstore.google.com/detail/apibeam/lppnphjckpnmekbjlciagcebgjempohh` |

> The `sslip.io` address is a temporary testing address that points at the Oracle VM's current public IP. If the VM public IP changes, this address will also need to change in the extension settings and Oracle Caddy configuration. Use a custom domain before sharing the service with other people.

---

## Part A — set up the new laptop for normal use

### Step 1: Confirm the relay is online

On the new laptop, open this link in Chrome:

<https://130-210-8-149.sslip.io/healthz>

You should see:

```json
{"status":"ok"}
```

If it does not open or does not show `ok`, stop here and use the troubleshooting section below. The browser extension cannot connect until this check works.

### Step 2: Install the ApiBeam Chrome extension

1. Open the [ApiBeam Chrome Web Store page](https://chromewebstore.google.com/detail/apibeam/lppnphjckpnmekbjlciagcebgjempohh).
2. Click **Add to Chrome**.
3. Click the puzzle-piece icon in Chrome's toolbar.
4. Pin **ApiBeam** so it is easy to find.

The extension ID should be:

```text
lppnphjckpnmekbjlciagcebgjempohh
```

To verify it, open `chrome://extensions`, enable **Developer mode**, and check the ApiBeam card.

### Step 3: Sign in to the AI provider in the same Chrome profile

1. In the same Chrome profile where you installed ApiBeam, open <https://chatgpt.com/>.
2. Sign in to the ChatGPT account you want to use.
3. Make sure you can start a normal ChatGPT conversation yourself.

ApiBeam uses the active browser session. A sign-in in a different Chrome profile, another browser, or an Incognito window does not help the extension.

### Step 4: Point ApiBeam at your Oracle relay

1. Click the **ApiBeam** extension icon.
2. Open **Settings**.
3. Find **Custom API Base URL**.
4. Enter exactly:

   ```text
   https://130-210-8-149.sslip.io/
   ```

5. Save the setting if ApiBeam shows a save button.
6. Select **ChatGPT** as the provider.
7. Click **Connect**.

Wait for the extension to show that it is connected. Keep the ChatGPT tab open while testing.

### Step 5: Copy your private ApiBeam API URL

After connecting, ApiBeam shows **Your API URL**. It has this shape:

```text
https://130-210-8-149.sslip.io/app/<your-private-room-id>
```

Copy the **complete** URL.

Important:

- This URL is unique to this browser connection.
- Treat it like a password. Do not put it in GitHub, a screenshot, or a message to someone else.
- A new laptop usually creates a new room URL. That is expected.

### Step 6: Connect Atlas to this laptop's ApiBeam room

1. Open [GenAI Academy](https://learn-genaiacademy.in/).
2. Open **Atlas**.
3. Choose **ApiBeam** from the **Model** dropdown.
4. Click **Credentials**.
5. Paste the full private API URL copied in Step 5 into **ApiBeam API URL**.
6. Click **Save & use provider**.

The URL is stored in that browser profile only. Repeat this step on every new laptop or Chrome profile.

### Step 7: Test it safely

1. Confirm the Atlas button says **Context off**. This is the default.
2. Ask a short question, such as:

   ```text
   Explain RAG in two sentences.
   ```

3. You should see the request appear in the connected ChatGPT tab and then see its answer in Atlas.

If you deliberately want Atlas to include your roadmap and workspace data, click **Context off** once. It changes to **Context on**. Leave it off for normal testing.

---

## Quick checklist for every new laptop

- [ ] `https://130-210-8-149.sslip.io/healthz` shows `{"status":"ok"}`.
- [ ] ApiBeam is installed in the Chrome profile you are using.
- [ ] ChatGPT is signed in in the same Chrome profile.
- [ ] ApiBeam custom base URL is `https://130-210-8-149.sslip.io/`.
- [ ] ApiBeam says connected.
- [ ] A fresh full `/app/<room-id>` URL is copied into Atlas → Credentials → ApiBeam.
- [ ] Atlas is set to ApiBeam and **Context off** unless you explicitly want workspace context.
- [ ] A short test prompt receives an answer.

---

## Troubleshooting

### The health-check URL does not show `{"status":"ok"}`

The Oracle relay is unavailable. This is a server-side issue, not a new-laptop issue. If you have administrator access, follow [Part B](#part-b--only-if-you-administer-the-oracle-server). Otherwise, do not keep retrying the extension—the relay needs to be repaired first.

### ApiBeam cannot connect

Check these in order:

1. The health-check link works.
2. The base URL is exactly `https://130-210-8-149.sslip.io/` including the trailing `/`.
3. You are using normal Chrome, not Incognito.
4. The extension is enabled at `chrome://extensions`.
5. Refresh the ChatGPT tab and sign in again.
6. Disconnect, then connect the extension again.

### Atlas says “ApiBeam connection required”

Open **Credentials** in Atlas and paste the full URL from the extension. The relay base URL alone is not enough; it must include `/app/<room-id>`.

### Atlas waits forever or returns no answer

1. Open the connected ChatGPT tab.
2. Make sure ChatGPT itself is usable and does not show a login, CAPTCHA, or provider error.
3. Disconnect and reconnect ApiBeam.
4. Copy the newly generated full API URL into Atlas credentials again.
5. Send a short question first.

### The extension works, but production Atlas cannot reach it

Hard-refresh the Academy page (`Cmd + Shift + R` on macOS or `Ctrl + Shift + R` on Windows/Linux), then choose ApiBeam again. The production integration is available at <https://learn-genaiacademy.in/>.

### You accidentally turned context on

Click the context button beside the model selector until it reads **Context off**. With context off, Atlas sends no roadmap, workspace, or screen metadata—only its generic instructions, the conversation, and your new question.

---

## Part B — only if you administer the Oracle server

Normal users do not need this section. Use it only when the relay health check fails or you are maintaining the server.

### B1. Do not copy the old laptop's private SSH key

For a new administrator laptop, make a new key pair instead:

```bash
ssh-keygen -t ed25519 -a 64 -f ~/.ssh/genai-apibeam-oracle -C "genai-apibeam-new-laptop"
```

Keep the private file (`genai-apibeam-oracle`) only on the new laptop. Add the matching `.pub` key to the `opc` user's `~/.ssh/authorized_keys` using an existing administrator session or Oracle Console access.

Then connect:

```bash
ssh -i ~/.ssh/genai-apibeam-oracle opc@130.210.8.149
```

### B2. Check relay and proxy health

Run on the Oracle VM:

```bash
sudo systemctl status apibeam-relay --no-pager
sudo systemctl status caddy --no-pager
curl -i http://127.0.0.1:3000/healthz
curl -i https://130-210-8-149.sslip.io/healthz
```

The relay and Caddy should both be `active (running)`, and both health endpoints should return a `200` response.

### B3. Restart after a temporary outage

Run on the Oracle VM:

```bash
sudo systemctl restart apibeam-relay
sudo systemctl restart caddy
sudo systemctl status apibeam-relay --no-pager
sudo systemctl status caddy --no-pager
```

If it still fails, inspect recent logs:

```bash
sudo journalctl -u apibeam-relay -n 100 --no-pager
sudo journalctl -u caddy -n 100 --no-pager
```

### B4. Confirm the allowed website and extension

Run on the Oracle VM:

```bash
sudo grep -E '^(ALLOWED_ORIGINS|EXTENSION_ID)=' /etc/genai-apibeam/relay.env
```

Expected values:

```text
ALLOWED_ORIGINS=https://learn-genaiacademy.in,https://gen-ai-academy-umber.vercel.app
EXTENSION_ID=lppnphjckpnmekbjlciagcebgjempohh
```

If you change either value, restart the relay:

```bash
sudo systemctl restart apibeam-relay
```

---

## Security notes

- The current Oracle relay is for your personal testing. It is not yet a multi-user public API.
- Never share the full ApiBeam room URL.
- Keep Atlas context off unless you actively want to send workspace context.
- For a public launch, move from `sslip.io` to a custom domain and implement authenticated user-to-extension pairing, per-request authorization, rate limits, and request isolation. See [the Oracle + Vercel production plan](./API_BEAM_ORACLE_VERCEL_IMPLEMENTATION_PLAN.md).

## Review result

This setup has been reviewed against the deployed configuration:

- Atlas production URL: verified.
- ApiBeam provider: verified on production.
- Workspace context: defaults to off.
- Oracle relay HTTPS health endpoint: configured as shown above.
- New laptop requirement: Chrome extension + same-profile provider sign-in + new private room URL.
