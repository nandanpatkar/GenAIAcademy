# Job Scout, unmodified, behind an nginx sidecar.
#
# Python is pinned >=3.12,<3.13 in pyproject.toml, so 3.12 is not a preference.
#
# tectonic (the real PDF path in renderer.py) is deliberately NOT installed. The
# target is Render's free instance at 0.1 CPU, where a LaTeX compile takes
# minutes and tectonic's ~300 MB TeX bundle would be re-downloaded after every
# deploy onto a filesystem that does not persist. Without it renderer.py still
# works — it degrades every tailoring run to ".tex + compile it on Overleaf",
# which is exactly what happens on the development Mac, since tectonic is not
# installed there either. See JOB_AGENT_DEPLOY.md; re-add on a paid instance:
#
#   ARG TECTONIC_VERSION=0.17.0
#   RUN set -eux; \
#       case "$(dpkg --print-architecture)" in \
#         amd64) target="x86_64-unknown-linux-musl" ;; \
#         arm64) target="aarch64-unknown-linux-musl" ;; \
#         *) echo "unsupported architecture" >&2; exit 1 ;; \
#       esac; \
#       curl -fsSL "https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%40${TECTONIC_VERSION}/tectonic-${TECTONIC_VERSION}-${target}.tar.gz" \
#         | tar -xz -C /usr/local/bin tectonic
#
# (that block also needs `curl` back in the apt install below).

# ── Jobvis console ───────────────────────────────────────────────────────────
# web/ is a Next.js static export, gitignored upstream as a build artifact, so
# it is built here rather than vendored. NEXT_PUBLIC_API_BASE is baked in at
# build time (web/lib/api.ts:6 reads it) and must match the public mount point,
# or the console's fetches land on the host app's /api instead of the agent's.
FROM node:22-slim AS console
WORKDIR /web
COPY web/package.json web/package-lock.json ./
RUN npm ci
COPY web/ ./
ENV NEXT_PUBLIC_API_BASE=/jobscout
RUN npm run build

# ── The agent ────────────────────────────────────────────────────────────────
FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
      nginx \
      ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

WORKDIR /app
COPY . .

RUN uv sync --no-dev --frozen

# api.py only mounts the console when this directory exists, so voice stays off
# until the stage above has produced it.
COPY --from=console /web/out ./web/out

COPY deploy/nginx.conf /etc/nginx/sites-available/default

# The app is mounted under /jobscout/ by the caller's proxy (vite.config.js in
# dev, vercel.json in production), so Gradio has to prefix the URLs it hands the
# browser or they resolve against the host root and 404.
#
# app.py:main() never passes root_path to launch(), and Gradio falls back to this
# environment variable when it is None — so the prefix is configurable without
# touching a line of the agent. Override with -e for a different mount point.
ENV GRADIO_ROOT_PATH=/jobscout

# The only port that leaves the container. 7860 and 8000 stay on loopback.
EXPOSE 8080

# Run the venv's interpreter directly, NOT `uv run`: uv re-resolves and would
# re-download the dev group (jupyter, ruff, debugpy) on every container start,
# undoing the --no-dev install above and delaying boot by minutes.
#
# nginx daemonises; the Python process stays in the foreground as PID 1 so the
# container dies with it rather than lingering as a healthy-looking husk.
CMD ["sh", "-c", "nginx && exec /app/.venv/bin/python -m job_scout.app"]
