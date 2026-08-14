import React, { useCallback, useEffect, useRef, useState } from "react";
import { Briefcase, X, PanelLeft, ExternalLink, RefreshCw, AlertTriangle, Mic } from "lucide-react";

// Always same-origin: /jobscout/ is proxied to the Python service by the rewrite
// in vercel.json (production) and by server.proxy in vite.config.js (dev). Going
// direct to the container's URL instead would trip the CORS allowlist in
// job_scout/api.py, which only permits localhost:3000.
const BASE = "/jobscout/";
const PROBE = `${BASE}api/config`;

// The wizard and the voice console are two surfaces of the same process, so
// switching between them here keeps the LangGraph checkpoint and the voice
// bridge intact — that shared session is the whole point of the agent running
// as one process.
const SURFACES = {
  wizard: `${BASE}`,
  jobvis: `${BASE}jobvis`,
};

// The two surfaces cross-link by hardcoded loopback port: app.py:846 emits
// `<a class="jv-link" href="http://localhost:8000" target="_blank">Talk to
// Jobvis</a>`, and the console links back to http://localhost:7860. Both
// addresses live inside the container and are unreachable from the browser, and
// both would open a new window. The iframe is same-origin, so these are caught
// here and turned into in-app surface switches rather than edited upstream.
const PORT_TO_SURFACE = [
  [/(?:localhost|127\.0\.0\.1):8000/, "jobvis"],
  [/(?:localhost|127\.0\.0\.1):7860/, "wizard"],
];

// The service is a container that sleeps when idle. Keep probing across a cold
// start rather than showing a failure the user only has to retry by hand.
//
// Back off rather than polling at a fixed interval: when the agent simply isn't
// running, a fixed 2.5s retry buries the dev server's console in proxy errors
// for the whole window. Doubling covers the window in ~20 requests, not ~130.
//
// The budget is sized for the slowest real cold start, which is production, not
// development: on Render's free instance (0.1 CPU) this image took a measured
// 286s to answer. That only happens after a deploy — jobscout-keepwarm-worker
// keeps the service from ever sleeping otherwise — but 90s here would have shown
// a failure during every deploy while the container was still booting normally.
const PROBE_TIMEOUT_MS = 330000;
const PROBE_FIRST_DELAY_MS = 1000;
const PROBE_MAX_DELAY_MS = 15000;
// Nothing listening locally is a definitive answer, not a cold start. Cover a
// container that is still booting (~15s) and then stop.
const NOT_LISTENING_BUDGET_MS = 25000;

/**
 * Confirm Job Scout is really answering on /jobscout/.
 *
 * The important failure this catches: when nothing is proxying that path, a dev
 * server or SPA host answers with index.html instead of 404. Iframing that
 * loads this app inside itself, recursively. A JSON body with the keys
 * api.py:config() returns is the proof that we reached the agent.
 */
async function probeOnce(signal) {
  const res = await fetch(PROBE, { signal, cache: "no-store" });
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`);
    err.kind = "unreachable";
    // The dev proxy tags its own 503 (vite.config.js). That means the container
    // is not listening at all — no amount of waiting fixes it, so stop soon
    // instead of spending the full cold-start budget.
    if (res.status === 503) {
      err.notListening = await res
        .json()
        .then(b => b?.source === "vite-dev-proxy")
        .catch(() => false);
    }
    throw err;
  }
  if (!(res.headers.get("content-type") || "").includes("application/json")) {
    const err = new Error("path is not proxied to Job Scout");
    err.kind = "misrouted";
    throw err;
  }
  const data = await res.json();
  if (!("wizard_url" in data) && !("voice_ok" in data)) {
    const err = new Error("unexpected response");
    err.kind = "misrouted";
    throw err;
  }
  return data;
}

export default function JobScoutPage({ onClose, isSidebarCollapsed, setIsSidebarCollapsed }) {
  // Theme colors matching the main app
  const BG = "#0a0c10";
  const BG2 = "#12151c";
  const BG3 = "#1a1e2a";
  const BORDER = "#252a38";
  const TEXT = "#e2e8f0";
  const TEXT2 = "#8b93a7";
  const TEXT3 = "#3e4556";
  const ACCENT = "#0E9C68"; // Job Scout's own emerald

  const [status, setStatus] = useState("connecting"); // connecting | ready | failed
  const [failure, setFailure] = useState(null);
  const [slow, setSlow] = useState(false);
  // Seconds spent waiting. A production cold start runs to ~5 minutes, and a
  // spinner with no moving number over that long reads as a hung page.
  const [waited, setWaited] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [surface, setSurface] = useState("wizard"); // wizard | jobvis
  const [voiceOk, setVoiceOk] = useState(false);
  const abortRef = useRef(null);
  const iframeRef = useRef(null);

  // Keep the cross-links between the wizard and the console inside the app.
  // Delegated in the capture phase because Gradio re-renders its DOM constantly,
  // so patching the anchors once would not survive the next update.
  const captureCrossLinks = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return; // cross-origin would land here too; nothing to do then
    doc.addEventListener("click", (event) => {
      const anchor = event.target?.closest?.("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      const match = PORT_TO_SURFACE.find(([pattern]) => pattern.test(href));
      if (!match) return;
      event.preventDefault();
      event.stopPropagation();
      setSurface(match[1]);
    }, true);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;
    let cancelled = false;
    const startedAt = Date.now();

    (async () => {
      let last = null;
      let delay = PROBE_FIRST_DELAY_MS;
      let budget = PROBE_TIMEOUT_MS;
      while (!cancelled && Date.now() - startedAt < budget) {
        try {
          const config = await probeOnce(controller.signal);
          if (!cancelled) {
            setVoiceOk(Boolean(config?.voice_ok));
            setStatus("ready");
          }
          return;
        } catch (err) {
          if (controller.signal.aborted) return;
          last = err;
          // A misrouted path will never fix itself by waiting.
          if (err.kind === "misrouted") break;
          if (err.notListening) budget = NOT_LISTENING_BUDGET_MS;
          if (Date.now() - startedAt > 5000) setSlow(true);
          await new Promise(r => setTimeout(r, delay));
          delay = Math.min(delay * 2, PROBE_MAX_DELAY_MS);
        }
      }
      if (!cancelled) {
        setFailure(last || new Error("timed out"));
        setStatus("failed");
      }
    })();

    return () => { cancelled = true; controller.abort(); };
  }, [attempt]);

  // Ticks independently of the probe loop, which backs off to 15s between
  // attempts and would make the counter jump in visible steps.
  useEffect(() => {
    if (status !== "connecting") return undefined;
    const startedAt = Date.now();
    setWaited(0);
    const id = setInterval(() => setWaited(Math.round((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(id);
  }, [status, attempt]);

  const retry = useCallback(() => {
    setStatus("connecting");
    setFailure(null);
    setSlow(false);
    setAttempt(a => a + 1);
  }, []);

  const misrouted = failure?.kind === "misrouted";

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, height: "100%", overflow: "hidden", background: BG, fontFamily: "var(--font)" }}>
      {/* ══ TOP BAR ══════════════════════════════════════════════════════════════ */}
      <div style={{ height: 62, background: BG2, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", padding: "0 20px", gap: 14, flexShrink: 0 }}>
        {setIsSidebarCollapsed && (
          <button
            onClick={() => setIsSidebarCollapsed(p => !p)}
            title="Toggle Sidebar"
            style={{
              background: !isSidebarCollapsed ? BG3 : "transparent",
              border: `1px solid ${!isSidebarCollapsed ? BORDER : "transparent"}`,
              color: !isSidebarCollapsed ? TEXT : TEXT3,
              cursor: "pointer", borderRadius: 7, width: 30, height: 30,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "all .15s",
            }}
          >
            <PanelLeft size={15} />
          </button>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: `linear-gradient(135deg,#34d399,${ACCENT})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 18px rgba(14,156,104,0.35)" }}>
            <Briefcase size={19} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: TEXT, letterSpacing: "-0.5px", lineHeight: 1.1 }}>Job Scout</div>
            <div style={{ fontSize: 10, color: TEXT3, fontWeight: 600 }}>Upload CV · Rank real openings · Tailor an application</div>
          </div>
        </div>

        {/* Both surfaces share one process and one checkpoint, so this switches
            the view without losing the session. */}
        {status === "ready" && voiceOk && (
          <div style={{ display: "flex", gap: 2, background: BG3, border: `1px solid ${BORDER}`, borderRadius: 9, padding: 3, marginLeft: 8 }}>
            {[
              { id: "wizard", label: "Wizard", Icon: Briefcase },
              { id: "jobvis", label: "Jobvis", Icon: Mic },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setSurface(id)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: surface === id ? ACCENT : "transparent",
                  color: surface === id ? "#fff" : TEXT3,
                  border: "none", borderRadius: 7, cursor: "pointer",
                  fontSize: 12, fontWeight: 600, padding: "5px 11px",
                  transition: "all .15s",
                }}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
        )}

        <div style={{ flex: 1 }} />

        {/* The agent prepares applications and never submits them — worth stating. */}
        <div style={{ fontSize: 10, color: TEXT3, fontWeight: 600, letterSpacing: "0.3px", display: "flex", alignItems: "center" }}>
          PREPARES APPLICATIONS — NEVER SUBMITS
        </div>

        <a
          href={SURFACES[surface]}
          target="_blank"
          rel="noreferrer"
          title="Open in a new tab"
          style={{ color: TEXT3, display: "flex", alignItems: "center", padding: "4px 8px" }}
        >
          <ExternalLink size={15} />
        </a>

        {onClose && (
          <button onClick={onClose} style={{ background: "none", border: "none", color: TEXT3, cursor: "pointer", padding: "4px 8px", lineHeight: 1 }}>
            <X size={18} />
          </button>
        )}
      </div>

      <div style={{ flex: 1, position: "relative" }}>
        {status === "connecting" && (
          <div style={{ position: "absolute", inset: 0, background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              border: "2px solid rgba(14,156,104,0.25)", borderTopColor: ACCENT,
              animation: "jobscout-spin 0.9s linear infinite",
            }} />
            <div style={{ fontSize: 13, color: TEXT3, fontWeight: 600 }}>
              {slow
                ? `Waking the agent — a first start after deploy takes a few minutes (${waited}s)`
                : "Connecting to Job Scout"}
            </div>
          </div>
        )}

        {status === "failed" && (
          <div style={{ position: "absolute", inset: 0, background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div style={{ maxWidth: 560, background: BG2, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "26px 28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <AlertTriangle size={18} color="#f59e0b" />
                <div style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>
                  {misrouted ? "/jobscout/ isn’t pointing at Job Scout" : "Job Scout isn’t reachable"}
                </div>
              </div>

              <p style={{ fontSize: 13, color: TEXT2, lineHeight: 1.65, margin: "0 0 14px" }}>
                {misrouted
                  ? "That path returned this app instead of the agent, so the proxy isn’t in place. In production, set the /jobscout/ rewrite destination in vercel.json to your deployed container."
                  : "The Python service isn’t answering. Start it, then retry:"}
              </p>

              {!misrouted && (
                <pre style={{
                  background: BG, border: `1px solid ${BORDER}`, borderRadius: 9,
                  padding: "12px 14px", fontSize: 12, color: TEXT2, overflowX: "auto", margin: "0 0 14px",
                }}>
{`docker run --rm -p 8080:8080 \\
  -v "$PWD/services/job-scout/.env:/app/.env:ro" \\
  job-scout:local`}
                </pre>
              )}

              <p style={{ fontSize: 11.5, color: TEXT3, lineHeight: 1.6, margin: "0 0 18px" }}>
                Dev proxies /jobscout/ to <code>{"http://localhost:8080"}</code>; override with{" "}
                <code>JOBSCOUT_TARGET</code>. See JOB_AGENT_PLAN.md.
                {failure?.message ? ` (${failure.message})` : ""}
              </p>

              <button
                onClick={retry}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: ACCENT, border: "none", color: "#fff",
                  fontSize: 13, fontWeight: 600, padding: "9px 16px",
                  borderRadius: 9, cursor: "pointer",
                }}
              >
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          </div>
        )}

        {status === "ready" && (
          <iframe
            ref={iframeRef}
            key={surface}
            src={SURFACES[surface]}
            onLoad={captureCrossLinks}
            style={{ width: "100%", height: "100%", border: "none" }}
            title={surface === "jobvis" ? "Jobvis voice console" : "Job Scout"}
            allow="microphone; camera"
          />
        )}
      </div>

      <style>{`
        @keyframes jobscout-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
