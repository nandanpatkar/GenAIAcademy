import React, { useMemo, useState } from "react";
import { AlertCircle, ExternalLink, RefreshCw, Workflow } from "lucide-react";
import "../styles/LangFlowEmbed.css";

const getLangflowUrl = () => {
  const value = import.meta.env.VITE_LANGFLOW_URL?.trim();
  if (!value) return null;

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
};

export default function LangFlowEmbed() {
  const langflowUrl = useMemo(getLangflowUrl, []);
  const [frameKey, setFrameKey] = useState(0);
  const [isLoading, setIsLoading] = useState(Boolean(langflowUrl));

  const reload = () => {
    setIsLoading(true);
    setFrameKey((key) => key + 1);
  };

  if (!langflowUrl) {
    return (
      <section className="langflow-embed langflow-embed--setup" aria-labelledby="langflow-setup-title">
        <div className="langflow-setup-card">
          <span className="langflow-setup-icon" aria-hidden="true"><Workflow size={24} /></span>
          <p className="langflow-eyebrow">Admin workspace</p>
          <h1 id="langflow-setup-title">Connect your LangFlow service</h1>
          <p>
            Deploy Langflow separately, then add its public HTTPS URL as <code>VITE_LANGFLOW_URL</code>
            in the Academy environment. No API key belongs in this browser setting.
          </p>
          <ol>
            <li>Deploy the supplied Render Blueprint from <code>langflow-deploy/</code> in your separate Render account.</li>
            <li>Set <code>VITE_LANGFLOW_URL=https://your-langflow-domain</code> in Vercel and redeploy this app.</li>
            <li>Return here to sign in and build flows.</li>
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section className="langflow-embed" aria-label="LangFlow workspace">
      <header className="langflow-toolbar">
        <div className="langflow-toolbar__identity">
          <span className="langflow-toolbar__icon" aria-hidden="true"><Workflow size={18} /></span>
          <div>
            <p className="langflow-eyebrow">Admin workspace</p>
            <h1>LangFlow</h1>
          </div>
        </div>
        <div className="langflow-toolbar__actions">
          <span className="langflow-status"><i aria-hidden="true" /> Flow builder</span>
          <button type="button" className="langflow-action" onClick={reload} title="Reload LangFlow" aria-label="Reload LangFlow">
            <RefreshCw size={16} />
            <span>Reload</span>
          </button>
          <a className="langflow-action langflow-action--primary" href={langflowUrl} target="_blank" rel="noreferrer">
            <ExternalLink size={16} />
            <span>Open in new tab</span>
          </a>
        </div>
      </header>

      <div className="langflow-frame-wrap" aria-busy={isLoading}>
        {isLoading && (
          <div className="langflow-loading" role="status" aria-live="polite">
            <Workflow size={22} aria-hidden="true" />
            <span>Connecting to LangFlow…</span>
          </div>
        )}
        <iframe
          key={frameKey}
          src={langflowUrl}
          className="langflow-frame"
          title="LangFlow agent flow builder"
          onLoad={() => setIsLoading(false)}
          allow="clipboard-read; clipboard-write"
        />
      </div>

      <p className="langflow-frame-note">
        <AlertCircle size={14} aria-hidden="true" />
        If sign-in is blocked in the embedded view, use “Open in new tab”.
      </p>
    </section>
  );
}
