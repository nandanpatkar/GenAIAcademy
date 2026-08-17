#!/usr/bin/env python3
"""Build the Learn API endpoint index from the apihub OpenAPI spec.

Source: https://github.com/hiteshchoudhary/apihub (ISC). The repo ships a
complete OpenAPI 3.0.3 document at `src/swagger.yaml` describing the 168
operations its public server exposes at https://api.freeapi.app/api/v1, and
that document is the whole input for the reference half of the viewer.

The spec declares no `securitySchemes` and no per-operation `security`, so
which endpoints need a bearer token is not recoverable from it. That fact
lives in the Express layer instead, as `verifyJWT` / `verifyPermission`
middleware, so this script also reads `src/app.js` (to learn each router's
mount prefix) and `src/routes/**` (to learn each route's middleware) and joins
the two by method + path.

Middleware is position-sensitive: several routers call `router.use(verifyJWT)`
partway down the file, which protects only the routes declared *below* it. The
route parser therefore tracks source offsets rather than treating a file as
uniformly protected.

Branding is stripped on the way through — the upstream spec's marketing
preamble, the repo/issue links, and the chaicode/YouTube footer marks are
dropped in favour of a short neutral blurb per group. See STRIP_PATTERNS.

Emits:
  src/data/apiHubData.js   groups + endpoint index consumed by ApiHub.jsx

Run:  python3 scripts/build_apihub_docs.py
"""
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DATA = os.path.join(ROOT, "src", "data", "apiHubData.js")

REPO_URL = "https://github.com/hiteshchoudhary/apihub.git"
BASE_URL = "https://api.freeapi.app/api/v1"

# Response examples are illustrative only — the viewer's playground shows the
# real response — so a cap keeps the bundled module reasonable. One endpoint
# (/kitchen-sink/redirect/to) carries a 317KB HTML dump on its own.
MAX_EXAMPLE_CHARS = 2600

HTTP_METHODS = ("get", "post", "put", "patch", "delete", "head", "options")

# ── group presentation ──────────────────────────────────────────────────────
# The spec's tags are emoji-prefixed display strings. Each maps to a stable id
# plus a blurb written here rather than lifted from the upstream marketing copy.
GROUPS = [
    ("public", "📢 Public APIs", "Public Data", "book",
     "Read-only endpoints returning ready-made datasets — users, products, books, quotes, meals, jokes, cats, dogs, stocks. No account needed, so this is the place to start.",
     "#38bdf8"),
    ("kitchen_sink", "🚰 Kitchen Sink", "Kitchen Sink", "flask",
     "A playground for HTTP itself: every method, every status code, redirects, cookies, images, and request/response inspection. Built for learning how HTTP behaves.",
     "#a78bfa"),
    ("auth", "🔐 Authentication", "Authentication", "lock",
     "Register, log in, refresh tokens, reset passwords, and manage avatars. Log in here to get the bearer token the protected endpoints below need.",
     "#f59e0b"),
    ("ecommerce", "🛒 Ecommerce", "Ecommerce", "cart",
     "A complete storefront API: categories, products, cart, addresses, coupons, and orders. Most of it requires a token, and some of it requires an admin role.",
     "#34d399"),
    ("todo", "📝 Todo list", "Todo List", "check",
     "The classic CRUD surface — create, list, update, toggle, and delete todos. The smallest complete app in the collection.",
     "#60a5fa"),
    ("social", "📸 Social Media", "Social Media", "users",
     "Posts, comments, likes, bookmarks, follows, and profiles. Enough surface area to build a full social client against.",
     "#f472b6"),
    ("chat", "💬 Chat App", "Chat App", "message",
     "One-to-one and group chats with messages and attachments. Pairs with the socket layer for a realtime client.",
     "#22d3ee"),
    ("seed", "💉 Database Seeding", "Database Seeding", "database",
     "Populate the server with realistic fake data so the other sections have something to return, and fetch the generated logins.",
     "#c084fc"),
    ("danger", "🚫 Danger Zone", "Danger Zone", "alert",
     "Destructive maintenance endpoints. Read the description before running anything here.",
     "#fb7185"),
    ("health", None, "Health", "activity",
     "A single liveness probe. Useful as a first request to confirm the server is reachable.",
     "#94a3b8"),
]

GROUP_BY_TAG = {tag: gid for gid, tag, _, _, _, _ in GROUPS if tag}

# ── branding strip ──────────────────────────────────────────────────────────
# Applied to every description string carried through from the spec. The
# upstream copy threads repo links, issue links, and project promotion into
# otherwise useful endpoint prose, so links are unwrapped to their text rather
# than dropped wholesale (which would leave dangling sentences).
STRIP_PATTERNS = [
    # Markdown links pointing at the upstream project, its socials, or its host.
    (re.compile(r"\[([^\]]*)\]\(\s*https?://(?:www\.)?(?:github\.com/hiteshchoudhary|freeapi\.app|chaicode\.com|youtube\.com|youtu\.be)[^)]*\)", re.I), r"\1"),
    # Bare URLs to the same.
    (re.compile(r"https?://(?:www\.)?(?:github\.com/hiteshchoudhary|freeapi\.app|chaicode\.com|youtube\.com|youtu\.be)\S*", re.I), ""),
    # Whole sentences that only exist to point at the upstream repo.
    (re.compile(r"(?im)^.*\b(?:report(?:ing)? issues?|create an issue|assign it to a member|follow these instructions for the installation)\b.*$"), ""),
    (re.compile(r"(?i)\bfreeapi(?:\.app)?\b"), "the API"),
    (re.compile(r"(?i)\bchai\s*(?:aur)?\s*code\b|\bchaicode\b"), ""),
    (re.compile(r"made with\s*[♥❤️💛]+\s*by\s*\S+", re.I), ""),
]


def clean_text(text):
    """Strip upstream branding and normalize whitespace in spec prose."""
    if not text:
        return ""
    out = str(text)
    for pattern, repl in STRIP_PATTERNS:
        out = pattern.sub(repl, out)
    out = re.sub(r"[ \t]+", " ", out)
    out = re.sub(r"\n{3,}", "\n\n", out)
    out = re.sub(r"(?m)^[ \t]+", "", out)
    return out.strip()


# ── source checkout ─────────────────────────────────────────────────────────

def resolve_checkout():
    """Return a path to an apihub checkout, cloning a shallow copy if needed.

    An explicit path wins so the script can run offline against a local clone.
    """
    override = os.environ.get("APIHUB_SRC")
    if override:
        if not os.path.isfile(os.path.join(override, "src", "swagger.yaml")):
            sys.exit(f"APIHUB_SRC={override} has no src/swagger.yaml")
        return override, None

    tmp = tempfile.mkdtemp(prefix="apihub-")
    print(f"cloning {REPO_URL} …")
    result = subprocess.run(
        ["git", "clone", "--depth", "1", "--quiet", REPO_URL, tmp],
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        shutil.rmtree(tmp, ignore_errors=True)
        sys.exit(f"clone failed: {result.stderr.strip()}")
    return tmp, tmp


# ── auth detection ──────────────────────────────────────────────────────────

MOUNT_RE = re.compile(r'app\.use\(\s*"(/api/v1[^"]*)"\s*,\s*(\w+)\s*\)')
IMPORT_RE = re.compile(r'import\s+(\w+)\s+from\s+"(\./routes/[^"]+)"')
ROUTE_RE = re.compile(r'router\s*\.\s*route\(\s*"([^"]*)"\s*\)')
USE_RE = re.compile(r'router\s*\.\s*use\(\s*([^)]*)\)')
METHOD_RE = re.compile(r'\.\s*(get|post|put|patch|delete|head|options)\s*\(', re.I)


def normalize_path(path):
    """`/:todoId` and `/{todoId}` are the same route; compare on one form."""
    path = re.sub(r":(\w+)", r"{\1}", path)
    path = re.sub(r"/+", "/", path)
    if len(path) > 1 and path.endswith("/"):
        path = path[:-1]
    return path or "/"


def slice_args(text, open_index):
    """Return the argument text of a call whose '(' sits at open_index."""
    depth = 0
    for i in range(open_index, len(text)):
        ch = text[i]
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
            if depth == 0:
                return text[open_index + 1:i]
    return text[open_index + 1:]


def parse_route_file(source):
    """Map (METHOD, subpath) -> auth level for one Express router file.

    Auth is one of: none, optional (getLoggedInUserOrIgnore), jwt, admin.
    `router.use(...)` applies only to routes declared after its offset, which
    matters — several routers deliberately register public routes above it.
    """
    guards = []  # (offset, level)
    for match in USE_RE.finditer(source):
        args = match.group(1)
        if "verifyPermission" in args and "ADMIN" in args:
            guards.append((match.start(), "admin"))
        elif "verifyJWT" in args:
            guards.append((match.start(), "jwt"))

    def guard_at(offset):
        level = "none"
        for start, lvl in guards:
            if start < offset:
                level = lvl
        return level

    routes = {}
    blocks = list(ROUTE_RE.finditer(source))
    for index, match in enumerate(blocks):
        subpath = match.group(1)
        end = blocks[index + 1].start() if index + 1 < len(blocks) else len(source)
        chain = source[match.end():end]
        # Stop at the next statement so a following `router.route` chain or a
        # bare export never bleeds into this one.
        for method_match in METHOD_RE.finditer(chain):
            method = method_match.group(1).upper()
            args = slice_args(chain, method_match.end() - 1)
            if "verifyPermission" in args and "ADMIN" in args:
                level = "admin"
            elif "verifyJWT" in args:
                level = "jwt"
            elif "getLoggedInUserOrIgnore" in args:
                level = "optional"
            else:
                level = guard_at(match.start())
            routes[(method, normalize_path(subpath))] = level
    return routes


def parse_app_seed_routes(app_source):
    """The seeding and danger-zone routes are registered inline in app.js."""
    out = {}
    pattern = re.compile(
        r'app\.(get|post|put|patch|delete)\(\s*\n?\s*"(/api/v1[^"]*)"([^;]*?)\);',
        re.S,
    )
    for match in pattern.finditer(app_source):
        method = match.group(1).upper()
        path = match.group(2)[len("/api/v1"):]
        args = match.group(3)
        if "verifyPermission" in args and "ADMIN" in args:
            level = "admin"
        elif "verifyJWT" in args:
            level = "jwt"
        else:
            level = "none"
        out[(method, normalize_path(path))] = level
    return out


def build_auth_map(repo):
    app_path = os.path.join(repo, "src", "app.js")
    app_source = open(app_path, encoding="utf-8").read()

    router_files = {var: rel for var, rel in IMPORT_RE.findall(app_source)}
    auth = {}
    for prefix, var in MOUNT_RE.findall(app_source):
        rel = router_files.get(var)
        if not rel:
            continue
        route_path = os.path.join(repo, "src", rel.lstrip("./"))
        if not os.path.isfile(route_path):
            continue
        base = normalize_path(prefix[len("/api/v1"):]) or "/"
        for (method, subpath), level in parse_route_file(
            open(route_path, encoding="utf-8").read()
        ).items():
            joined = "/" if base == "/" and subpath == "/" else (
                base if subpath == "/" else base.rstrip("/") + subpath
            )
            auth[(method, normalize_path(joined))] = level

    auth.update(parse_app_seed_routes(app_source))
    return auth


# ── spec lowering ───────────────────────────────────────────────────────────

def schema_summary(schema, depth=0):
    """Flatten a JSON Schema into the small shape the viewer renders.

    Only what a reader needs to fill in a request: name, type, whether it is
    required, an example, and one level of nesting for object fields.
    """
    if not isinstance(schema, dict) or depth > 2:
        return None
    kind = schema.get("type")
    node = {"type": kind or ("object" if "properties" in schema else "string")}
    if schema.get("example") is not None:
        node["example"] = schema["example"]
    if schema.get("description"):
        node["description"] = clean_text(schema["description"])
    if schema.get("enum"):
        node["enum"] = schema["enum"]
    if kind == "array" and isinstance(schema.get("items"), dict):
        child = schema_summary(schema["items"], depth + 1)
        if child:
            node["items"] = child
    props = schema.get("properties")
    if isinstance(props, dict):
        required = set(schema.get("required") or [])
        fields = []
        for name, sub in props.items():
            child = schema_summary(sub, depth + 1) or {"type": "string"}
            child["name"] = name
            child["required"] = name in required
            fields.append(child)
        if fields:
            node["fields"] = fields
    return node


def cap_example(value):
    """Serialize an example, truncating the runaway ones."""
    if value is None:
        return None
    if isinstance(value, str):
        text = value
    else:
        text = json.dumps(value, indent=2, ensure_ascii=False)
    if len(text) > MAX_EXAMPLE_CHARS:
        return text[:MAX_EXAMPLE_CHARS].rstrip() + "\n\n… truncated. Run the request to see the full response."
    return text


def first_example(content_entry):
    """Prefer a named `examples` entry, fall back to inline `example`."""
    if not isinstance(content_entry, dict):
        return None
    examples = content_entry.get("examples")
    if isinstance(examples, dict):
        for entry in examples.values():
            if isinstance(entry, dict) and "value" in entry:
                return entry["value"]
    return content_entry.get("example")


def make_id(method, path):
    slug = re.sub(r"[^a-z0-9]+", "_", f"{method}_{path}".lower()).strip("_")
    return slug


def build_endpoint(method, path, op, path_params, auth_map):
    params = []
    for raw in list(path_params) + list(op.get("parameters") or []):
        schema = raw.get("schema") or {}
        params.append({
            "name": raw.get("name"),
            "in": raw.get("in"),
            "required": bool(raw.get("required")) or raw.get("in") == "path",
            "type": schema.get("type", "string"),
            "example": schema.get("example"),
            "description": clean_text(raw.get("description")),
        })

    body = None
    request_body = op.get("requestBody")
    if isinstance(request_body, dict):
        content = request_body.get("content") or {}
        # JSON first — it is what the playground can actually send.
        content_type = "application/json" if "application/json" in content else next(iter(content), None)
        if content_type:
            entry = content[content_type] or {}
            body = {
                "contentType": content_type,
                "required": bool(request_body.get("required")),
                "schema": schema_summary(entry.get("schema") or {}),
                "example": cap_example(first_example(entry)),
            }

    responses = []
    for status, response in (op.get("responses") or {}).items():
        if not isinstance(response, dict):
            continue
        content = response.get("content") or {}
        entry = content.get("application/json") or (content[next(iter(content))] if content else {})
        responses.append({
            "status": str(status),
            "description": clean_text(response.get("description")),
            "example": cap_example(first_example(entry)),
        })
    responses.sort(key=lambda r: r["status"])

    tag = (op.get("tags") or [None])[0]
    group = GROUP_BY_TAG.get(tag, "health" if path == "/healthcheck" else "public")

    return {
        "id": make_id(method, path),
        "group": group,
        "method": method.upper(),
        "path": path,
        "summary": clean_text(op.get("summary")) or f"{method.upper()} {path}",
        "description": clean_text(op.get("description")),
        "auth": auth_map.get((method.upper(), normalize_path(path)), "none"),
        "params": params,
        "body": body,
        "responses": responses,
    }


def main():
    repo, cleanup = resolve_checkout()
    try:
        spec = yaml.safe_load(open(os.path.join(repo, "src", "swagger.yaml"), encoding="utf-8"))
        auth_map = build_auth_map(repo)

        endpoints = []
        for path, operations in (spec.get("paths") or {}).items():
            path_params = operations.get("parameters") or []
            for method, op in operations.items():
                if method not in HTTP_METHODS or not isinstance(op, dict):
                    continue
                endpoints.append(build_endpoint(method, path, op, path_params, auth_map))

        by_group = {}
        for endpoint in endpoints:
            by_group.setdefault(endpoint["group"], []).append(endpoint)

        groups = []
        for gid, _tag, label, glyph, blurb, accent in GROUPS:
            items = by_group.get(gid) or []
            if not items:
                continue
            items.sort(key=lambda e: (e["path"], e["method"]))
            groups.append({
                "id": gid, "label": label, "glyph": glyph,
                "blurb": blurb, "accent": accent,
                "endpointIds": [e["id"] for e in items],
            })

        ordered = [e for group in groups for e in by_group[group["id"]]]

        protected = sum(1 for e in ordered if e["auth"] in ("jwt", "admin"))
        print(f"{len(ordered)} endpoints across {len(groups)} groups "
              f"({protected} require a token)")

        header = (
            "// GENERATED by scripts/build_apihub_docs.py — do not edit by hand.\n"
            "//\n"
            "// Endpoint index for the Learn API viewer, lowered from the OpenAPI 3.0.3\n"
            "// document published by the apihub project (ISC licensed), joined with the\n"
            "// auth middleware read out of its Express routes. Descriptions are carried\n"
            "// through with the upstream project's branding and repo links stripped.\n"
            "//\n"
            "// Re-run the script to refresh against the live spec.\n\n"
        )
        payload = (
            header
            + f"export const APIHUB_BASE_URL = {json.dumps(BASE_URL)};\n\n"
            + f"export const APIHUB_GROUPS = {json.dumps(groups, indent=2, ensure_ascii=False)};\n\n"
            + f"export const APIHUB_ENDPOINTS = {json.dumps(ordered, indent=2, ensure_ascii=False)};\n\n"
            + "export const APIHUB_ENDPOINT_BY_ID = APIHUB_ENDPOINTS.reduce((acc, endpoint) => {\n"
            + "  acc[endpoint.id] = endpoint;\n"
            + "  return acc;\n"
            + "}, {});\n"
        )
        os.makedirs(os.path.dirname(OUT_DATA), exist_ok=True)
        with open(OUT_DATA, "w", encoding="utf-8") as handle:
            handle.write(payload)
        print(f"wrote {OUT_DATA} ({len(payload) / 1024:.0f} KB)")
    finally:
        if cleanup:
            shutil.rmtree(cleanup, ignore_errors=True)


if __name__ == "__main__":
    main()
