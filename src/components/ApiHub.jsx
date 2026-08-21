import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { NinjaEye } from "./NinjaEye";
import {
  Search, X, ChevronRight, ChevronDown, Copy, Check, Play, Loader2,
  BookOpen, FlaskConical, Lock, Unlock, ShieldCheck, Activity, Users,
  MessageSquare, Database, AlertTriangle, ShoppingCart, CheckSquare,
  KeyRound, Trash2, PanelLeft, ArrowRight, Home as HomeIcon,
} from "lucide-react";
import {
  APIHUB_BASE_URL, APIHUB_GROUPS, APIHUB_ENDPOINTS, APIHUB_ENDPOINT_BY_ID,
} from "../data/apiHubData";
import "../styles/ApiHub.css";

/* Learn API — an endpoint reference over a live playground.
 *
 * The index in ../data/apiHubData.js is generated from the apihub OpenAPI
 * document (see scripts/build_apihub_docs.py). Every endpoint here is real and
 * reachable: the host sends `Access-Control-Allow-Origin: *`, so requests go
 * straight from the browser with no proxy in between.
 *
 * Two things the raw spec cannot tell a reader, and this viewer supplies:
 *
 *   Which calls need a token. The spec declares no security schemes at all, so
 *   the build derives it from the Express middleware and stores it per
 *   endpoint as none / optional / jwt / admin. 71 of the 168 need one.
 *
 *   How to get that token. Reading "401 Unauthorized" and being left to work
 *   out the login dance is where this kind of exploration usually stalls, so
 *   the rail carries a session panel that logs in, captures the accessToken,
 *   and attaches it to every later request.
 *
 * Note the upstream host resets its database roughly every two hours, so
 * anything written through the playground is expected to disappear.
 */

const LS_TOKEN = "apihub_token";
const LS_USER = "apihub_user";
const LS_OPEN = "apihub_open_groups";

const GLYPHS = {
  book: BookOpen, flask: FlaskConical, lock: KeyRound, cart: ShoppingCart,
  check: CheckSquare, users: Users, message: MessageSquare, database: Database,
  alert: AlertTriangle, activity: Activity,
};

const AUTH_LABEL = {
  none: { text: "Public", icon: Unlock, tone: "ok" },
  optional: { text: "Token optional", icon: Unlock, tone: "soft" },
  jwt: { text: "Token required", icon: Lock, tone: "warn" },
  admin: { text: "Admin only", icon: ShieldCheck, tone: "danger" },
};

/* Path templates carry {braces}; the playground fills them from inputs. */
const pathParamNames = (path) =>
  Array.from(path.matchAll(/\{(\w+)\}/g), (match) => match[1]);

const prettyJson = (value) => {
  try { return JSON.stringify(JSON.parse(value), null, 2); }
  catch { return value; }
};

/* Seed a body editor from the spec example, falling back to the schema so a
   reader always gets a filled-in starting point rather than an empty box. */
function seedBody(endpoint) {
  if (!endpoint.body) return "";
  if (endpoint.body.example) return prettyJson(endpoint.body.example);
  const fields = endpoint.body.schema?.fields;
  if (!fields) return "";
  const shape = {};
  fields.forEach((field) => {
    shape[field.name] = field.example ?? (field.type === "number" ? 0 : field.type === "boolean" ? false : "");
  });
  return JSON.stringify(shape, null, 2);
}

function CopyButton({ value, label = "Copy" }) {
  const [done, setDone] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = () => {
    navigator.clipboard?.writeText(value).then(() => {
      setDone(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setDone(false), 1400);
    }).catch(() => {});
  };
  return (
    <button className="ah-copy" onClick={copy} title={label} type="button">
      {done ? <Check size={13} /> : <Copy size={13} />}
      <span>{done ? "Copied" : label}</span>
    </button>
  );
}

function AuthBadge({ auth }) {
  const meta = AUTH_LABEL[auth] || AUTH_LABEL.none;
  const Icon = meta.icon;
  return (
    <span className={`ah-auth ah-auth-${meta.tone}`}>
      <Icon size={11} />{meta.text}
    </span>
  );
}

/* ── schema table ──────────────────────────────────────────────────────── */

function SchemaFields({ fields, depth = 0 }) {
  if (!fields?.length) return null;
  return (
    <ul className={`ah-fields ah-fields-d${Math.min(depth, 2)}`}>
      {fields.map((field) => (
        <li key={field.name}>
          <div className="ah-field-head">
            <code className="ah-field-name">{field.name}</code>
            <span className="ah-field-type">{field.type}</span>
            {field.required && <span className="ah-field-req">required</span>}
          </div>
          {field.description && <p className="ah-field-desc">{field.description}</p>}
          {field.example !== undefined && field.example !== null && !field.fields && (
            <div className="ah-field-example">
              e.g. <code>{typeof field.example === "object" ? JSON.stringify(field.example) : String(field.example)}</code>
            </div>
          )}
          {field.fields && <SchemaFields fields={field.fields} depth={depth + 1} />}
          {field.items?.fields && <SchemaFields fields={field.items.fields} depth={depth + 1} />}
        </li>
      ))}
    </ul>
  );
}

/* ── the reference tab ─────────────────────────────────────────────────── */

function Reference({ endpoint }) {
  const [openResponse, setOpenResponse] = useState(
    endpoint.responses.find((r) => r.status.startsWith("2"))?.status || endpoint.responses[0]?.status
  );
  useEffect(() => {
    setOpenResponse(
      endpoint.responses.find((r) => r.status.startsWith("2"))?.status || endpoint.responses[0]?.status
    );
  }, [endpoint.id]);

  const pathParams = endpoint.params.filter((p) => p.in === "path");
  const queryParams = endpoint.params.filter((p) => p.in === "query");

  return (
    <div className="ah-ref">
      {endpoint.description && (
        <div className="ah-prose">
          {endpoint.description.split("\n\n").map((para, index) => (
            <p key={index}>{para}</p>
          ))}
        </div>
      )}

      {pathParams.length > 0 && (
        <section className="ah-section">
          <h3 className="ah-h3">Path parameters</h3>
          <ParamTable params={pathParams} />
        </section>
      )}

      {queryParams.length > 0 && (
        <section className="ah-section">
          <h3 className="ah-h3">Query parameters</h3>
          <ParamTable params={queryParams} />
        </section>
      )}

      {endpoint.body && (
        <section className="ah-section">
          <h3 className="ah-h3">
            Request body
            <span className="ah-ct">{endpoint.body.contentType}</span>
          </h3>
          {endpoint.body.schema?.fields && <SchemaFields fields={endpoint.body.schema.fields} />}
          {endpoint.body.example && (
            <div className="ah-code-block">
              <div className="ah-code-bar">
                <span>Example</span>
                <CopyButton value={endpoint.body.example} />
              </div>
              <pre><code>{endpoint.body.example}</code></pre>
            </div>
          )}
        </section>
      )}

      {endpoint.responses.length > 0 && (
        <section className="ah-section">
          <h3 className="ah-h3">Responses</h3>
          <div className="ah-responses">
            {endpoint.responses.map((response) => {
              const open = openResponse === response.status;
              const tone = response.status.startsWith("2") ? "ok"
                : response.status.startsWith("4") ? "warn" : "danger";
              return (
                <div key={response.status} className={`ah-response ${open ? "is-open" : ""}`}>
                  <button
                    className="ah-response-head"
                    onClick={() => setOpenResponse(open ? null : response.status)}
                    type="button"
                  >
                    {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                    <span className={`ah-status ah-status-${tone}`}>{response.status}</span>
                    <span className="ah-response-desc">{response.description}</span>
                  </button>
                  {open && response.example && (
                    <div className="ah-code-block ah-code-nested">
                      <div className="ah-code-bar">
                        <span>Example response</span>
                        <CopyButton value={response.example} />
                      </div>
                      <pre><code>{response.example}</code></pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function ParamTable({ params }) {
  return (
    <div className="ah-table-wrap">
      <table className="ah-table">
        <thead>
          <tr><th>Name</th><th>Type</th><th>Required</th><th>Description</th></tr>
        </thead>
        <tbody>
          {params.map((param) => (
            <tr key={`${param.in}-${param.name}`}>
              <td><code>{param.name}</code></td>
              <td><span className="ah-field-type">{param.type}</span></td>
              <td>{param.required ? <span className="ah-field-req">yes</span> : <span className="ah-dim">no</span>}</td>
              <td>
                {param.description || <span className="ah-dim">—</span>}
                {param.example !== undefined && param.example !== null && (
                  <div className="ah-field-example">e.g. <code>{String(param.example)}</code></div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── the playground tab ────────────────────────────────────────────────── */

function Playground({ endpoint, token, onToken }) {
  const [pathValues, setPathValues] = useState({});
  const [queryValues, setQueryValues] = useState({});
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [useToken, setUseToken] = useState(true);

  const pathNames = useMemo(() => pathParamNames(endpoint.path), [endpoint.path]);
  const queryParams = useMemo(
    () => endpoint.params.filter((p) => p.in === "query"), [endpoint.id]
  );

  /* Reset the form whenever the reader moves to another endpoint — carrying a
     previous body or id over would silently send the wrong request. */
  useEffect(() => {
    const seededPath = {};
    endpoint.params.filter((p) => p.in === "path").forEach((param) => {
      if (param.example != null) seededPath[param.name] = String(param.example);
    });
    setPathValues(seededPath);
    setQueryValues({});
    setBody(seedBody(endpoint));
    setResult(null);
  }, [endpoint.id]);

  const needsToken = endpoint.auth === "jwt" || endpoint.auth === "admin";
  const isMultipart = endpoint.body?.contentType === "multipart/form-data";

  const url = useMemo(() => {
    let path = endpoint.path;
    pathNames.forEach((name) => {
      path = path.replace(`{${name}}`, encodeURIComponent(pathValues[name] || `{${name}}`));
    });
    const search = new URLSearchParams();
    Object.entries(queryValues).forEach(([key, value]) => {
      if (value !== "" && value != null) search.append(key, value);
    });
    const qs = search.toString();
    return `${APIHUB_BASE_URL}${path}${qs ? `?${qs}` : ""}`;
  }, [endpoint.path, pathNames, pathValues, queryValues]);

  const missingPath = pathNames.filter((name) => !pathValues[name]);

  const send = useCallback(async () => {
    setSending(true);
    setResult(null);
    const started = performance.now();
    try {
      const headers = {};
      if (useToken && token) headers.Authorization = `Bearer ${token}`;

      let payload;
      if (endpoint.body && !isMultipart && body.trim() && endpoint.method !== "GET") {
        headers["Content-Type"] = "application/json";
        payload = body;
      }

      const response = await fetch(url, {
        method: endpoint.method,
        headers,
        body: payload,
        // The upstream sets ACAO:* — sending cookies would make that header
        // illegal and the browser would reject every response.
        credentials: "omit",
      });

      const elapsed = Math.round(performance.now() - started);
      const contentType = response.headers.get("content-type") || "";
      let text;
      let image = null;
      if (contentType.startsWith("image/")) {
        const blob = await response.blob();
        image = URL.createObjectURL(blob);
        text = `[${blob.type}, ${(blob.size / 1024).toFixed(1)} KB]`;
      } else {
        text = await response.text();
        if (contentType.includes("json")) text = prettyJson(text);
      }

      /* Logging in anywhere in the collection hands back a token; capture it so
         the reader never has to copy it across by hand. */
      if (response.ok && contentType.includes("json")) {
        try {
          const parsed = JSON.parse(text);
          const found = parsed?.data?.accessToken;
          if (found) onToken(found, parsed?.data?.user?.username || null);
        } catch { /* not a login response */ }
      }

      setResult({
        status: response.status,
        statusText: response.statusText,
        elapsed,
        size: new Blob([text]).size,
        contentType,
        body: text,
        image,
      });
    } catch (error) {
      setResult({
        status: 0,
        statusText: "Request failed",
        elapsed: Math.round(performance.now() - started),
        error: error.message || String(error),
      });
    } finally {
      setSending(false);
    }
  }, [url, endpoint, body, token, useToken, isMultipart, onToken]);

  /* Object URLs for image responses are revoked when they go out of scope. */
  useEffect(() => () => { if (result?.image) URL.revokeObjectURL(result.image); }, [result]);

  const curl = useMemo(() => {
    const parts = [`curl -X ${endpoint.method} '${url}'`];
    if (useToken && token) parts.push(`  -H 'Authorization: Bearer <token>'`);
    if (endpoint.body && !isMultipart && body.trim() && endpoint.method !== "GET") {
      parts.push(`  -H 'Content-Type: application/json'`);
      parts.push(`  -d '${body.replace(/\n\s*/g, "")}'`);
    }
    return parts.join(" \\\n");
  }, [url, endpoint, body, token, useToken, isMultipart]);

  return (
    <div className="ah-play">
      <div className="ah-url-bar">
        <span className={`ah-method ah-method-${endpoint.method.toLowerCase()}`}>{endpoint.method}</span>
        <code className="ah-url">{url}</code>
        <button
          className="ah-send"
          onClick={send}
          disabled={sending || missingPath.length > 0}
          type="button"
          title={missingPath.length ? `Fill in: ${missingPath.join(", ")}` : "Send the request"}
        >
          {sending ? <NinjaEye size={16} labelled={false} /> : <Play size={13} />}
          {sending ? "Sending" : "Send"}
        </button>
      </div>

      {needsToken && !token && (
        <div className="ah-note ah-note-warn">
          <Lock size={13} />
          <span>
            This endpoint needs a bearer token. There is no sign-up — open <strong>Session</strong> in
            the left rail, load the published demo accounts, and click one. The token is captured
            and attached from then on.
          </span>
        </div>
      )}
      {endpoint.auth === "admin" && (
        <div className="ah-note">
          <ShieldCheck size={13} />
          <span>Requires an account with the ADMIN role. Open <strong>Session</strong> in the left rail and pick an account marked ADMIN.</span>
        </div>
      )}
      {isMultipart && (
        <div className="ah-note ah-note-warn">
          <AlertTriangle size={13} />
          <span>This endpoint takes a file upload (<code>multipart/form-data</code>), which this playground does not send. Use the curl snippet below as a starting point.</span>
        </div>
      )}

      {pathNames.length > 0 && (
        <section className="ah-play-section">
          <h4 className="ah-h4">Path parameters</h4>
          {pathNames.map((name) => {
            const meta = endpoint.params.find((p) => p.in === "path" && p.name === name);
            return (
              <label className="ah-input-row" key={name}>
                <span className="ah-input-label">
                  {name}<em className="ah-req-dot">*</em>
                </span>
                <input
                  className="ah-input"
                  value={pathValues[name] || ""}
                  placeholder={meta?.example != null ? String(meta.example) : name}
                  onChange={(event) => setPathValues((prev) => ({ ...prev, [name]: event.target.value }))}
                />
              </label>
            );
          })}
        </section>
      )}

      {queryParams.length > 0 && (
        <section className="ah-play-section">
          <h4 className="ah-h4">Query parameters</h4>
          {queryParams.map((param) => (
            <label className="ah-input-row" key={param.name}>
              <span className="ah-input-label">{param.name}</span>
              <input
                className="ah-input"
                value={queryValues[param.name] || ""}
                placeholder={param.example != null ? String(param.example) : param.type}
                onChange={(event) => setQueryValues((prev) => ({ ...prev, [param.name]: event.target.value }))}
              />
            </label>
          ))}
        </section>
      )}

      {endpoint.body && !isMultipart && (
        <section className="ah-play-section">
          <h4 className="ah-h4">
            Request body
            <button className="ah-mini" type="button" onClick={() => setBody(seedBody(endpoint))}>Reset</button>
          </h4>
          <textarea
            className="ah-body-input"
            value={body}
            spellCheck={false}
            rows={Math.min(16, Math.max(5, body.split("\n").length + 1))}
            onChange={(event) => setBody(event.target.value)}
          />
        </section>
      )}

      {token && (
        <label className="ah-check">
          <input type="checkbox" checked={useToken} onChange={(event) => setUseToken(event.target.checked)} />
          <span>Send <code>Authorization: Bearer …</code> with this request</span>
        </label>
      )}

      {result && (
        <section className="ah-play-section ah-result">
          <h4 className="ah-h4">Response</h4>
          <div className="ah-result-bar">
            <span className={`ah-status ah-status-${
              result.status === 0 ? "danger"
                : result.status < 300 ? "ok"
                  : result.status < 400 ? "soft"
                    : result.status < 500 ? "warn" : "danger"
            }`}>
              {result.status || "ERR"} {result.statusText}
            </span>
            <span className="ah-dim">{result.elapsed} ms</span>
            {result.size != null && <span className="ah-dim">{(result.size / 1024).toFixed(1)} KB</span>}
            {result.contentType && <span className="ah-dim ah-ct-inline">{result.contentType.split(";")[0]}</span>}
            {result.body && <CopyButton value={result.body} />}
          </div>
          {result.error ? (
            <div className="ah-note ah-note-warn">
              <AlertTriangle size={13} />
              <span>
                {result.error}. The upstream server restarts on a schedule — if this persists, try again in a minute.
              </span>
            </div>
          ) : result.image ? (
            <img className="ah-result-image" src={result.image} alt="Response" />
          ) : (
            <div className="ah-code-block">
              <pre><code>{result.body}</code></pre>
            </div>
          )}
        </section>
      )}

      <section className="ah-play-section">
        <h4 className="ah-h4">As curl</h4>
        <div className="ah-code-block">
          <div className="ah-code-bar">
            <span>Shell</span>
            <CopyButton value={curl} />
          </div>
          <pre><code>{curl}</code></pre>
        </div>
      </section>
    </div>
  );
}

/* ── home ──────────────────────────────────────────────────────────────────
   The landing view, shown until the reader picks an endpoint. Same beats as
   the source project's own home page — hero, a marquee of live routes, the
   category grid, the response-envelope explainer, a stats band — carrying its
   design language, with every piece of upstream promotion (star counts, forks,
   socials, the footer lockup) left out.

   Section eyebrows are set as code comments (`/explore`, `// how it flows`),
   which is the source design's own device for them. */

/* One representative route per lane, for the marquee. Picked from real data so
   the strip can never drift out of sync with the index. */
const MARQUEE = APIHUB_GROUPS.flatMap((group) =>
  group.endpointIds.slice(0, 3).map((id) => APIHUB_ENDPOINT_BY_ID[id])
).filter(Boolean);

const ENVELOPE = `{
  "statusCode": 200,
  "data": { … },
  "message": "Books fetched successfully",
  "success": true
}`;

function Home({ onPick, onOpenGroup }) {
  const stats = useMemo(() => {
    const byAuth = APIHUB_ENDPOINTS.reduce((acc, endpoint) => {
      acc[endpoint.auth] = (acc[endpoint.auth] || 0) + 1;
      return acc;
    }, {});
    const byMethod = new Set(APIHUB_ENDPOINTS.map((endpoint) => endpoint.method));
    return {
      total: APIHUB_ENDPOINTS.length,
      groups: APIHUB_GROUPS.length,
      open: (byAuth.none || 0) + (byAuth.optional || 0),
      methods: byMethod.size,
    };
  }, []);

  return (
    <div className="ah-home">
      <section className="ah-hero">
        <p className="ah-eyebrow"><span className="ah-eyebrow-dot" />live · no key required</p>
        <h1 className="ah-hero-title">
          Real APIs to <em className="ah-gold-word">practice</em>,<br />
          build, and <em className="ah-italic-word">ship</em>.
        </h1>
        <p className="ah-hero-lead">
          {stats.total} production-style endpoints — auth, e-commerce, social, chat, todos and more —
          so you learn API integration on the same patterns you ship to production.
          No keys. No quotas. Send a real request and read a real response.
        </p>
        <div className="ah-hero-actions">
          <button className="ah-cta" type="button" onClick={() => onPick(APIHUB_ENDPOINTS[0]?.id)}>
            Browse endpoints <ArrowRight size={13} />
          </button>
          <button className="ah-cta ah-cta-ghost" type="button" onClick={() => onPick(APIHUB_ENDPOINTS[0]?.id, "try")}>
            <Play size={12} /> Open the playground
          </button>
        </div>
        <p className="ah-hero-stats">
          {stats.open} public · {stats.total - stats.open} token-gated · {stats.methods} HTTP verbs
        </p>
      </section>

      {/* Duplicated once so the translate loop has an identical second copy to
          slide into; `aria-hidden` keeps the repeat out of the a11y tree. */}
      <div className="ah-marquee">
        <div className="ah-marquee-track">
          {[0, 1].map((copy) => (
            <div className="ah-marquee-run" key={copy} aria-hidden={copy === 1}>
              {MARQUEE.map((endpoint) => (
                <button
                  className="ah-chip"
                  key={`${copy}-${endpoint.id}`}
                  type="button"
                  tabIndex={copy === 1 ? -1 : 0}
                  onClick={() => onPick(endpoint.id)}
                >
                  <span className={`ah-method ah-method-${endpoint.method.toLowerCase()}`}>{endpoint.method}</span>
                  <span className="ah-chip-path">{endpoint.path}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="ah-home-section">
        <p className="ah-eyebrow ah-eyebrow-code">/explore the surface area</p>
        <h2 className="ah-home-h2">
          {stats.groups} lanes.<br />
          <span className="ah-dim-title">{stats.total} endpoints.</span>
        </h2>
        <p className="ah-home-lead">
          Each lane mirrors a real backend you might build — so the skills carry over
          the moment you start your own project.
        </p>
        <div className="ah-cards">
          {APIHUB_GROUPS.map((group) => {
            const Glyph = GLYPHS[group.glyph] || BookOpen;
            const samples = group.endpointIds.slice(0, 3).map((id) => APIHUB_ENDPOINT_BY_ID[id]).filter(Boolean);
            return (
              <button
                className="ah-card"
                key={group.id}
                style={{ "--gc": group.accent }}
                type="button"
                onClick={() => onOpenGroup(group.id)}
              >
                <div className="ah-card-top">
                  <span className="ah-card-glyph"><Glyph size={14} /></span>
                  <span className="ah-card-count">{group.endpointIds.length} endpoints</span>
                </div>
                <h3 className="ah-card-title">{group.label}</h3>
                <p className="ah-card-blurb">{group.blurb}</p>
                <ul className="ah-card-routes">
                  {samples.map((endpoint) => (
                    <li key={endpoint.id}>
                      <ChevronRight size={11} />
                      <span className="ah-card-method">{endpoint.method}</span>
                      <code>{endpoint.path}</code>
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </section>

      <section className="ah-home-section">
        <p className="ah-eyebrow ah-eyebrow-code">// how it flows</p>
        <h2 className="ah-home-h2">
          From <em className="ah-gold-word">fetch</em> to render —<br />
          <span className="ah-dim-title">the same shape as production.</span>
        </h2>
        <div className="ah-anatomy">
          <div>
            <p className="ah-home-lead">
              Every endpoint returns the same envelope: a status code, a human-readable
              message, and a typed <code>data</code> payload. When you move to your own
              backend, the contract you learned still holds.
            </p>
            <ul className="ah-ticks">
              <li><Check size={12} />Predictable response envelope across all routes</li>
              <li><Check size={12} />Pagination metadata where it matters</li>
              <li><Check size={12} />Real error shapes — 400s, 401s, 404s, 422s</li>
              <li><Check size={12} />Bearer auth, captured for you once you log in</li>
            </ul>
          </div>
          <div className="ah-code-block">
            <div className="ah-code-bar"><span>200 OK · application/json</span></div>
            <pre><code>{ENVELOPE}</code></pre>
          </div>
        </div>
      </section>

      <section className="ah-home-section">
        <p className="ah-eyebrow ah-eyebrow-code">/* what you get */</p>
        <div className="ah-stats">
          <div><strong>{stats.total}</strong><span>Endpoints</span></div>
          <div><strong>{stats.groups}</strong><span>Categories</span></div>
          <div><strong>{stats.open}</strong><span>No auth needed</span></div>
          <div><strong>0</strong><span>API keys required</span></div>
        </div>
      </section>

      <section className="ah-home-cta">
        <h2 className="ah-home-h2">
          Build the project<br />
          <span className="ah-dim-title">you’ve been putting off.</span>
        </h2>
        <p className="ah-home-lead">
          Pick a lane, read a page of reference, and send your first request from the tab next door.
        </p>
        <button className="ah-cta" type="button" onClick={() => onPick(APIHUB_ENDPOINTS[0]?.id, "try")}>
          Send your first request <ArrowRight size={13} />
        </button>
      </section>
    </div>
  );
}

/* ── session panel ─────────────────────────────────────────────────────── */

/* There is no sign-up step for this API, which is the single most confusing
   thing about it. Seeding the server generates a batch of throwaway accounts
   and publishes them at GET /seed/generated-credentials — that endpoint is the
   front door, and the panel below drives the whole chain so nobody has to
   reverse-engineer it:

     GET  /seed/generated-credentials   the published logins, or 404 if the
                                        server has not been seeded since its
                                        last wipe
     POST /seed/social-media            runs seedUsers as a dependency, which
                                        is what actually mints the accounts
     POST /users/login                  exchange one for an accessToken

   The host resets its database every couple of hours, so the batch rotates and
   a 404 here is routine rather than a fault. */

function SessionPanel({ token, user, onToken, onClear }) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [needsSeed, setNeedsSeed] = useState(false);

  const loginWith = useCallback(async (name, secret) => {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`${APIHUB_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify({ username: name, password: secret }),
      });
      const data = await response.json();
      if (!response.ok || !data?.data?.accessToken) {
        setError(data?.message || `Login failed (${response.status})`);
      } else {
        onToken(data.data.accessToken, data.data.user?.username || name);
        setPassword("");
      }
    } catch (caught) {
      setError(caught.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }, [onToken]);

  const loadAccounts = useCallback(async () => {
    setLoadingAccounts(true);
    setError(null);
    setNeedsSeed(false);
    try {
      const response = await fetch(`${APIHUB_BASE_URL}/seed/generated-credentials`, { credentials: "omit" });
      const data = await response.json();
      if (response.status === 404 || !Array.isArray(data?.data) || data.data.length === 0) {
        // Expected whenever the host has wiped since anyone last seeded it.
        setNeedsSeed(true);
        setAccounts([]);
      } else {
        setAccounts(data.data);
      }
    } catch (caught) {
      setError(caught.message || "Could not reach the server");
    } finally {
      setLoadingAccounts(false);
    }
  }, []);

  /* Seeding social media is the cheapest route to a user batch — seedUsers runs
     ahead of it as a dependency. Todos deliberately does not create users. */
  const seedAccounts = useCallback(async () => {
    setLoadingAccounts(true);
    setError(null);
    try {
      await fetch(`${APIHUB_BASE_URL}/seed/social-media`, { method: "POST", credentials: "omit" });
    } catch (caught) {
      setError(caught.message || "Seeding failed");
      setLoadingAccounts(false);
      return;
    }
    await loadAccounts();
  }, [loadAccounts]);

  return (
    <div className="ah-session">
      <button className="ah-session-head" onClick={() => setOpen(!open)} type="button">
        {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        <KeyRound size={13} />
        <span>Session</span>
        <span className={`ah-session-dot ${token ? "is-on" : ""}`} />
      </button>
      {open && (
        <div className="ah-session-body">
          {token ? (
            <>
              <p className="ah-session-msg">
                Signed in{user ? <> as <strong>{user}</strong></> : null}. The token is attached to
                every request that needs one.
              </p>
              <button className="ah-mini ah-mini-danger" onClick={onClear} type="button">
                <Trash2 size={12} /> Clear token
              </button>
            </>
          ) : (
            <>
              <p className="ah-session-msg">
                There is no sign-up. 71 endpoints need a bearer token, and the server
                publishes throwaway accounts to log in with — load a batch and pick one.
              </p>

              {accounts === null && (
                <button
                  className="ah-mini ah-mini-go"
                  onClick={loadAccounts}
                  disabled={loadingAccounts}
                  type="button"
                >
                  {loadingAccounts ? <NinjaEye size={14} labelled={false} /> : <Users size={12} />}
                  Load demo accounts
                </button>
              )}

              {needsSeed && (
                <>
                  <p className="ah-session-msg">
                    The server has no accounts right now — it wipes its database every couple
                    of hours. Generate a fresh batch:
                  </p>
                  <button
                    className="ah-mini ah-mini-go"
                    onClick={seedAccounts}
                    disabled={loadingAccounts}
                    type="button"
                  >
                    {loadingAccounts ? <NinjaEye size={14} labelled={false} /> : <Database size={12} />}
                    Generate accounts
                  </button>
                </>
              )}

              {accounts?.length > 0 && (
                <>
                  <p className="ah-session-msg">
                    {accounts.length} accounts available. Click one to log in — pick an
                    <strong> ADMIN</strong> for the admin-only endpoints.
                  </p>
                  <ul className="ah-accounts">
                    {accounts.map((account) => (
                      <li key={account.username}>
                        <button
                          className="ah-account"
                          type="button"
                          disabled={busy}
                          onClick={() => loginWith(account.username, account.password)}
                        >
                          <span className="ah-account-name">{account.username}</span>
                          <span className={`ah-account-role ah-role-${(account.role || "user").toLowerCase()}`}>
                            {account.role}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button className="ah-mini" onClick={loadAccounts} disabled={loadingAccounts} type="button">
                    {loadingAccounts ? <NinjaEye size={14} labelled={false} /> : null} Refresh list
                  </button>
                </>
              )}

              <details className="ah-manual">
                <summary>Use your own account</summary>
                <p className="ah-session-msg">
                  Registered one with <code>POST /users/register</code>? Sign in here.
                </p>
                <input
                  className="ah-input"
                  placeholder="username"
                  value={username}
                  autoComplete="off"
                  onChange={(event) => setUsername(event.target.value)}
                />
                <input
                  className="ah-input"
                  placeholder="password"
                  type="password"
                  value={password}
                  autoComplete="off"
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyDown={(event) => { if (event.key === "Enter" && username && password) loginWith(username, password); }}
                />
                <button
                  className="ah-mini ah-mini-go"
                  onClick={() => loginWith(username, password)}
                  disabled={busy || !username || !password}
                  type="button"
                >
                  {busy ? <NinjaEye size={14} labelled={false} /> : <Play size={12} />} Log in
                </button>
              </details>

              {error && <p className="ah-session-err">{error}</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ── shell ─────────────────────────────────────────────────────────────── */

export default function ApiHub({ onClose }) {
  /* null is the home view — the section opens on the landing page rather than
     dropping the reader straight into whichever endpoint happens to sort first. */
  const [activeId, setActiveId] = useState(null);
  const [tab, setTab] = useState("reference");
  const [query, setQuery] = useState("");
  const [railOpen, setRailOpen] = useState(true);
  const [token, setTokenState] = useState(() => {
    try { return localStorage.getItem(LS_TOKEN) || ""; } catch { return ""; }
  });
  const [user, setUser] = useState(() => {
    try { return localStorage.getItem(LS_USER) || ""; } catch { return ""; }
  });
  const [openGroups, setOpenGroups] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_OPEN) || "null");
      if (Array.isArray(saved)) return new Set(saved);
    } catch { /* first visit */ }
    return new Set([APIHUB_GROUPS[0]?.id]);
  });

  const bodyRef = useRef(null);

  const setToken = useCallback((next, nextUser) => {
    setTokenState(next);
    try { localStorage.setItem(LS_TOKEN, next); } catch { /* private mode */ }
    if (nextUser) {
      setUser(nextUser);
      try { localStorage.setItem(LS_USER, nextUser); } catch { /* private mode */ }
    }
  }, []);

  const clearToken = useCallback(() => {
    setTokenState("");
    setUser("");
    try { localStorage.removeItem(LS_TOKEN); localStorage.removeItem(LS_USER); } catch { /* private mode */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(LS_OPEN, JSON.stringify([...openGroups])); } catch { /* private mode */ }
  }, [openGroups]);

  /* Scroll the reading pane back to the top on navigation — otherwise a short
     endpoint opens halfway down after a long one. */
  useEffect(() => { bodyRef.current?.scrollTo({ top: 0 }); }, [activeId, tab]);

  const endpoint = activeId ? APIHUB_ENDPOINT_BY_ID[activeId] : null;

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return null;
    return new Set(
      APIHUB_ENDPOINTS
        .filter((item) =>
          item.path.toLowerCase().includes(needle)
          || item.summary.toLowerCase().includes(needle)
          || item.method.toLowerCase() === needle)
        .map((item) => item.id)
    );
  }, [query]);

  const groups = useMemo(() => APIHUB_GROUPS.map((group) => ({
    ...group,
    endpoints: group.endpointIds
      .map((id) => APIHUB_ENDPOINT_BY_ID[id])
      .filter((item) => !matches || matches.has(item.id)),
  })).filter((group) => group.endpoints.length > 0), [matches]);

  const toggleGroup = (id) => setOpenGroups((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  /* The home page's playground CTAs land on the "Try it" tab directly. */
  const pick = (id, nextTab = "reference") => {
    setActiveId(id);
    setTab(nextTab);
  };

  /* A card on the home page opens its lane in the rail and enters at its first
     endpoint, so the click both navigates and reveals where it went. */
  const openGroup = (groupId) => {
    const group = APIHUB_GROUPS.find((item) => item.id === groupId);
    if (!group) return;
    setOpenGroups((prev) => new Set(prev).add(groupId));
    pick(group.endpointIds[0]);
  };

  const group = APIHUB_GROUPS.find((item) => item.id === endpoint?.group);

  return (
    <div className="ah-panel">
      <aside className={`ah-rail ${railOpen ? "" : "is-collapsed"}`}>
        <div className="ah-rail-head">
          <button className="ah-brand" type="button" onClick={() => setActiveId(null)} title="Back to the overview">
            <span className="ah-brand-mark"><FlaskConical size={15} /></span>
            <div>
              {/* Two-tone lockup, the way the source site sets its own wordmark. */}
              <div className="ah-brand-title">Learn<span>API</span></div>
              <div className="ah-brand-sub">{APIHUB_ENDPOINTS.length} live endpoints</div>
            </div>
          </button>
          <div className="ah-search">
            <Search size={13} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search paths and methods"
              aria-label="Search endpoints"
            />
            {query && (
              <button onClick={() => setQuery("")} type="button" aria-label="Clear search">
                <X size={12} />
              </button>
            )}
          </div>
          <SessionPanel token={token} user={user} onToken={setToken} onClear={clearToken} />
        </div>

        <nav className="ah-rail-body">
          <button
            className={`ah-item ah-overview ${activeId === null ? "is-active" : ""}`}
            onClick={() => setActiveId(null)}
            type="button"
          >
            <HomeIcon size={13} />
            <span className="ah-item-path">Overview</span>
          </button>
          {groups.length === 0 && <p className="ah-empty">No endpoint matches “{query}”.</p>}
          {groups.map((item) => {
            const Glyph = GLYPHS[item.glyph] || BookOpen;
            const open = matches ? true : openGroups.has(item.id);
            return (
              <div className="ah-group" key={item.id} style={{ "--gc": item.accent }}>
                <button className="ah-group-head" onClick={() => toggleGroup(item.id)} type="button">
                  {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  <Glyph size={13} />
                  <span className="ah-group-label">{item.label}</span>
                  <span className="ah-group-count">{item.endpoints.length}</span>
                </button>
                {open && (
                  <ul className="ah-list">
                    {item.endpoints.map((child) => (
                      <li key={child.id}>
                        <button
                          className={`ah-item ${child.id === activeId ? "is-active" : ""}`}
                          onClick={() => pick(child.id)}
                          type="button"
                        >
                          <span className={`ah-method ah-method-${child.method.toLowerCase()}`}>
                            {child.method}
                          </span>
                          <span className="ah-item-path">{child.path}</span>
                          {(child.auth === "jwt" || child.auth === "admin") && (
                            <Lock size={10} className="ah-item-lock" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      <main className="ah-main">
        <header className="ah-top">
          <button
            className="ah-icon-btn"
            onClick={() => setRailOpen(!railOpen)}
            title={railOpen ? "Hide the endpoint list" : "Show the endpoint list"}
            type="button"
          >
            <PanelLeft size={15} />
          </button>
          {endpoint ? (
            <>
              <span className={`ah-method ah-method-${endpoint.method.toLowerCase()}`}>{endpoint.method}</span>
              <code className="ah-top-path">{endpoint.path}</code>
              <AuthBadge auth={endpoint.auth} />
              <CopyButton value={`${APIHUB_BASE_URL}${endpoint.path}`} label="Copy URL" />
            </>
          ) : (
            <code className="ah-top-path ah-top-base">{APIHUB_BASE_URL}</code>
          )}
          <div className="ah-spacer" />
          {onClose && (
            <button className="ah-icon-btn" onClick={onClose} title="Close" type="button">
              <X size={16} />
            </button>
          )}
        </header>

        {!endpoint && (
          <div className="ah-body" ref={bodyRef}>
            <Home onPick={pick} onOpenGroup={openGroup} />
          </div>
        )}

        {endpoint && (
          <>
            <div className="ah-tabs">
              <button
                className={tab === "reference" ? "is-on" : ""}
                onClick={() => setTab("reference")}
                type="button"
              >
                <BookOpen size={13} /> Reference
              </button>
              <button
                className={tab === "try" ? "is-on" : ""}
                onClick={() => setTab("try")}
                type="button"
              >
                <Play size={13} /> Try it
              </button>
            </div>

            <div className="ah-body" ref={bodyRef}>
              <div className="ah-column">
                <div className="ah-title-row">
                  <h1 className="ah-h1">{endpoint.summary}</h1>
                  {group && <span className="ah-group-tag" style={{ "--gc": group.accent }}>{group.label}</span>}
                </div>
                {tab === "reference"
                  ? <Reference endpoint={endpoint} />
                  : <Playground endpoint={endpoint} token={token} onToken={setToken} />}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
