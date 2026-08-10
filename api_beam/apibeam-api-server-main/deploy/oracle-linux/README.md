# Oracle Linux 9 deployment (E2 Micro / systemd)

This deployment target deliberately avoids Docker. The Always Free E2 Micro VM has 1 GB RAM, and running Node directly under `systemd` leaves more memory for the ApiBeam relay.

## Prerequisites

- A running Oracle Linux 9 instance with a public IPv4 address.
- OCI network security-list ingress for TCP 22 (admin IP only), TCP 80, and TCP 443.
- A DNS A record such as `relay.example.com` pointing to the VM public IP.
- A maintained Node.js LTS installation (Node 24 at the time of writing) and Caddy on the VM.

## Files installed on the VM

```text
/opt/genai-apibeam/app                 # relay source and compiled dist/
/etc/genai-apibeam/relay.env           # production settings, mode 600
/etc/systemd/system/apibeam-relay.service
/etc/caddy/Caddyfile
```

## First-time server commands

Run these after logging in as `opc`:

```bash
sudo dnf update -y
sudo dnf install -y git curl firewalld
sudo systemctl enable --now firewalld
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

Install a maintained Node.js LTS release and Caddy using their current official Oracle Linux installation instructions. Confirm both before proceeding:

```bash
node --version
caddy version
```

## Application install

Copy this repository to the VM using a private Git repository or `rsync`; do not copy `node_modules`, `.env`, SSH keys, or browser credentials.

```bash
sudo useradd --system --home /opt/genai-apibeam --shell /sbin/nologin apibeam
sudo install -d -o apibeam -g apibeam /opt/genai-apibeam/app /etc/genai-apibeam
sudo rsync -a --delete --exclude node_modules --exclude .env \
  /path/to/api_beam/apibeam-api-server-main/ /opt/genai-apibeam/app/
sudo chown -R apibeam:apibeam /opt/genai-apibeam/app
cd /opt/genai-apibeam/app
sudo -u apibeam corepack enable
sudo -u apibeam yarn install --frozen-lockfile
sudo -u apibeam yarn build
```

Create `/etc/genai-apibeam/relay.env` from `relay.env.example`, replace every placeholder, then secure it:

```bash
sudo install -m 600 -o root -g apibeam relay.env.example /etc/genai-apibeam/relay.env
sudo vi /etc/genai-apibeam/relay.env
```

## Caddy and service enablement

1. Copy `Caddyfile` to `/etc/caddy/Caddyfile` and replace `relay.example.com`.
2. Copy `apibeam-relay.service` to `/etc/systemd/system/apibeam-relay.service`.
3. Validate and enable:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl daemon-reload
sudo systemctl enable --now apibeam-relay
sudo systemctl enable --now caddy
sudo systemctl status apibeam-relay --no-pager
sudo systemctl status caddy --no-pager
curl -i http://127.0.0.1:3000/healthz
curl -i https://relay.example.com/healthz
```

Do not expose port 3000 in OCI or `firewalld`; Caddy is the public HTTPS/WSS endpoint.

## Operations

```bash
sudo journalctl -u apibeam-relay -f
sudo journalctl -u caddy -f
sudo systemctl restart apibeam-relay
sudo systemctl restart caddy
```

The service intentionally binds Node to `127.0.0.1` when `NODE_ENV=production`. A relay should never be made public until its extension pairing and authenticated user routing are completed.
