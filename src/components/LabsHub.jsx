import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2 } from "lucide-react";
import AgentBottlenecksLab from "../../artifact-5.jsx";
import "../styles/LabsHub.css";

const LABS = [
  {
    id: "lab_enterprise_ai_agents",
    title: "Enterprise AI Agent Problems",
    kind: "html",
    src: "/labs/enterprise-ai-agent-problems.html",
  },
  {
    id: "lab_chunking_bench",
    title: "Chunking Bench — How RAG Cuts, Embeds and Retrieves a Document",
    kind: "html",
    src: "/labs/chunking-bench.html",
  },
  {
    id: "lab_token_cost",
    title: "Token Cost Lab — Beat the Bill",
    kind: "html",
    src: "/labs/token-cost-lab.html",
  },
  {
    id: "lab_agent_anatomy",
    title: "Agent Anatomy Lab",
    kind: "html",
    src: "/labs/agent-anatomy-lab.html",
  },
  {
    id: "lab_agent_bottlenecks",
    title: "20 AI Agent Bottlenecks, Live",
    kind: "react",
  },
];

function ReactLabFrame({ title, onReady }) {
  const frameRef = useRef(null);
  const [mountNode, setMountNode] = useState(null);

  useEffect(() => {
    setMountNode(null);
  }, [title]);

  useEffect(() => {
    if (mountNode) onReady?.();
  }, [mountNode, onReady]);

  return (
    <iframe
      ref={frameRef}
      className="labs-hub-frame"
      title={title}
      srcDoc="<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><style>html,body,#lab-root{margin:0;width:100%;min-height:100%;background:#fafaf9}body{overflow:auto}</style></head><body><div id='lab-root'></div></body></html>"
      onLoad={() => {
        const frameDocument = frameRef.current?.contentDocument;
        setMountNode(frameDocument?.getElementById("lab-root") || null);
      }}
    >
      {mountNode ? createPortal(<AgentBottlenecksLab />, mountNode) : null}
    </iframe>
  );
}

export default function LabsHub({ activeLabId }) {
  const [isLoading, setIsLoading] = useState(true);
  const activeLab = LABS.find((lab) => lab.id === activeLabId) || LABS[0];

  useEffect(() => {
    setIsLoading(true);
  }, [activeLab.id]);

  return (
    <section className="labs-hub" aria-label={activeLab.title}>
      <div className="labs-hub-canvas">
        {isLoading && (
          <div className="labs-hub-loading" role="status" aria-live="polite">
            <Loader2 size={22} aria-hidden="true" />
            <span>Loading {activeLab.title}</span>
          </div>
        )}

        {activeLab.kind === "html" ? (
          <iframe
            key={activeLab.id}
            className="labs-hub-frame"
            src={activeLab.src}
            title={activeLab.title}
            sandbox="allow-scripts allow-forms allow-modals allow-downloads allow-popups"
            allow="clipboard-write"
            onLoad={() => setIsLoading(false)}
          />
        ) : (
          <ReactLabFrame title={activeLab.title} onReady={() => setIsLoading(false)} />
        )}
      </div>
    </section>
  );
}
