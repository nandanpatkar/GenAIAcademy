# ApiBeam Oracle relay — troubleshooting and recovery

Use this guide when Atlas shows a timeout, the ApiBeam extension shows a WebSocket error, or the relay health check does not work.

This runbook is for the currently deployed personal relay:

```text
Public relay: https://130-210-8-149.sslip.io/
Health check:  https://130-210-8-149.sslip.io/healthz
Oracle user:   opc
Services:      caddy + apibeam-relay
```

> Do not paste an ApiBeam `/app/<room-id>` URL into logs, GitHub, screenshots, or chat. It is private.

## Fast recovery — use this first

SSH to the Oracle VM, then run this exact block:

```bash
sudo systemctl restart caddy apibeam-relay
sleep 5

curl -i http://127.0.0.1:3000/healthz
curl -i https://130-210-8-149.sslip.io/healthz
```

Expected final result for both health checks:

```text
HTTP/1.1 200 OK
```

or:

```text
HTTP/2 200
{"status":"ok"}
```

Why wait five seconds? The Node/NestJS relay takes a few seconds to finish starting after `systemctl restart`. Testing too early can temporarily show `Connection refused` even though the service is still starting.

After the health check works:

1. Open ApiBeam extension settings.
2. Confirm the base URL is exactly `https://130-210-8-149.sslip.io/`.
3. Click **Disconnect**, wait two seconds, then click **Connect**.
4. Copy the current full `/app/<room-id>` URL into Atlas → **Credentials** → **ApiBeam**.
5. Send a short test prompt.

---

## Symptom → meaning → fix

| Symptom | Meaning | First fix |
| --- | --- | --- |
| Extension says **WebSocket error** | The extension cannot establish `wss://` to the relay, often because the relay/Caddy is stalled or the extension origin is not allowed. | Run the fast recovery block, then check extension ID below. |
| Atlas waits about one minute, then says timeout | Atlas reached the relay, but the extension did not send a response. | Reconnect the extension, open the provider tab, and use the live log command. |
| `curl http://127.0.0.1:3000/healthz` says **Connection refused** | `apibeam-relay` is stopped or still starting. | Wait five seconds after restart, then check its service status and logs. |
| Public health URL gives **502** | Caddy is working, but it cannot reach Node on port 3000. | Restart `apibeam-relay`; inspect its status/logs. |
| Public health URL hangs or times out | The small VM or Caddy is stalled. | Restart both services; if SSH is also unresponsive, reboot the VM in OCI. |
| Public health URL returns **200**, but extension fails on only one laptop | Usually a different unpacked-extension ID or a wrong saved base URL. | Use the Chrome Web Store extension or allow the new extension ID. |

---

## Check the service state

Run on the Oracle VM:

```bash
sudo systemctl status apibeam-relay --no-pager -l
sudo systemctl status caddy --no-pager -l
```

Both services should show:

```text
Active: active (running)
```

The relay normally listens only on `127.0.0.1:3000`. This is correct: Caddy is responsible for exposing it safely through HTTPS/WSS on ports 80 and 443.

## Read the logs

Use the last 120 lines:

```bash
sudo journalctl -u apibeam-relay -n 120 --no-pager
sudo journalctl -u caddy -n 120 --no-pager
```

For a live diagnosis while you press **Connect** in the extension or send an Atlas prompt:

```bash
sudo journalctl -u apibeam-relay -f
```

Press `Ctrl + C` to stop following the log.

Healthy extension activity produces messages similar to:

```text
Client connected: <socket-id>
Client <socket-id> joined room: <room-id>
```

If those lines never appear after clicking **Connect**, the issue is between the extension and relay (base URL, relay availability, or extension CORS origin).

---

## Extension WebSocket/CORS check

The production relay allows a comma-separated list that mixes site origins,
local development origins, and any unpacked-extension origin — it is longer than
just the production site. Its current shape is:

```text
ALLOWED_ORIGINS=https://learn-genaiacademy.in,https://gen-ai-academy-umber.vercel.app,http://localhost:5173,http://127.0.0.1:5173,chrome-extension://<dev-extension-id>
EXTENSION_ID=lppnphjckpnmekbjlciagcebgjempohh
```

Read the live value before changing it, and edit by *inserting* rather than
replacing the line. A `sed 's|^ALLOWED_ORIGINS=.*|...|'` silently drops the
localhost and extension entries, which breaks local development and the
Connector without any error at the time. To add an origin, match the prefix
only:

```bash
sudo cp /etc/genai-apibeam/relay.env /etc/genai-apibeam/relay.env.bak
sudo sed -i 's|^ALLOWED_ORIGINS=|ALLOWED_ORIGINS=https://new-origin.example,|' \
  /etc/genai-apibeam/relay.env
```

Confirm it on Oracle:

```bash
sudo grep -E '^(ALLOWED_ORIGINS|EXTENSION_ID)=' /etc/genai-apibeam/relay.env
```

For a limited unpacked-extension beta, you can instead set `ALLOW_ANY_CHROME_EXTENSION_ORIGIN=true`. This avoids adding each Chrome extension ID, but weakens the extension-origin restriction and should not be the long-term public configuration.

### Chrome Web Store installation

The Chrome Web Store ApiBeam extension uses this stable ID:

```text
lppnphjckpnmekbjlciagcebgjempohh
```

Install that version on every laptop whenever possible. No Oracle configuration change is needed.

### Unpacked extension on another laptop

An unpacked extension can receive a different ID on each computer. That new ID is rejected by the relay until you allow it.

1. Open `chrome://extensions` on the new laptop.
2. Enable **Developer mode**.
3. Copy only the ApiBeam **extension ID**. Do not copy or share the room URL.
4. On Oracle, add the new ID to the allowed origins while keeping the existing production site:

   ```bash
   sudo nano /etc/genai-apibeam/relay.env
   ```

   Change `ALLOWED_ORIGINS` to this form:

   ```text
   ALLOWED_ORIGINS=<the existing list>,chrome-extension://<new-extension-id>
   ```

   Append to what is already there — do not retype the line from this document.

   Leave `EXTENSION_ID=lppnphjckpnmekbjlciagcebgjempohh` unchanged.

5. Save, then restart the relay:

   ```bash
   sudo systemctl restart apibeam-relay
   sleep 5
   curl -i https://130-210-8-149.sslip.io/healthz
   ```

---

## VM is extremely slow or SSH commands hang

The current E2 Micro VM is very small. Avoid running large updates, builds, or package installs while the relay is needed.

After you regain a prompt, check resources:

```bash
free -h
uptime
ps -eo pid,comm,%cpu,%mem --sort=-%cpu | head -15
```

If SSH itself stops responding, use Oracle Cloud Console:

1. Go to **Compute** → **Instances**.
2. Open the relay instance.
3. Choose **Actions** → **Reboot**.
4. Wait two to three minutes.
5. SSH back in and run the [fast recovery](#fast-recovery--use-this-first) block.

Do not terminate the instance for a normal outage. A reboot preserves the VM, its public IP, installed relay, and configuration.

If this happens repeatedly, migrate the relay to an Always Free `VM.Standard.A1.Flex` instance when capacity becomes available. Create the A1 VM alongside this one, deploy and test it, then change the extension base URL only after the new relay is healthy.

---

## Final verification checklist

- [ ] Local health check at `127.0.0.1:3000` returns `200`.
- [ ] Public HTTPS health check returns `200` and `{"status":"ok"}`.
- [ ] `caddy` and `apibeam-relay` both show `active (running)`.
- [ ] Extension base URL ends with `/` and uses HTTPS.
- [ ] Extension says connected.
- [ ] Atlas credentials contain the complete current `/app/<room-id>` URL.
- [ ] Atlas test prompt receives an answer.

## If you need help

Collect and share only these safe outputs:

```bash
sudo systemctl status apibeam-relay --no-pager -l
sudo systemctl status caddy --no-pager -l
sudo journalctl -u apibeam-relay -n 120 --no-pager
curl -i https://130-210-8-149.sslip.io/healthz
```

Before sharing, remove any room IDs, API URLs, browser cookies, tokens, or private SSH-key material.
