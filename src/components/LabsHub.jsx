import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2 } from "lucide-react";
import AgentBottlenecksLab from "../../artifact-5.jsx";
import EvalForgeLab from "../../artifact-6.jsx";
import ContextArchitectLab from "../../artifact-7.jsx";
import AgentSecurityArenaLab from "../../artifact-8.jsx";
import MemoryGardenLab from "../../artifact-9.jsx";
import ToolCallingFlightSchoolLab from "../../artifact-10.jsx";
import HumanControlRoomLab from "../../artifact-11.jsx";
import MultiAgentMissionControlLab from "../../artifact-12.jsx";
import McpPermissionWorkshopLab from "../../artifact-13.jsx";
import TraceDetectiveLab from "../../artifact-14.jsx";
import StructuredOutputRepairLab from "../../artifact-15.jsx";
import ModelRouterLab from "../../artifact-16.jsx";
import GroundingCourtLab from "../../artifact-17.jsx";
import AgentUncertaintyLab from "../../artifact-18.jsx";
import PromptCacheWorkshopLab from "../../artifact-19.jsx";
import TechniqueChooserLab from "../../artifact-20.jsx";
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
    component: AgentBottlenecksLab,
  },
  {
    id: "lab_eval_forge",
    title: "Eval Forge — Stop Vibe Testing",
    kind: "react",
    component: EvalForgeLab,
  },
  { id: "lab_context_architect", title: "Context Architect — Pack the Perfect Context", kind: "react", component: ContextArchitectLab },
  { id: "lab_security_arena", title: "Agent Security Arena — Defend the Toolchain", kind: "react", component: AgentSecurityArenaLab },
  { id: "lab_memory_garden", title: "Memory Garden — What Should the Agent Remember?", kind: "react", component: MemoryGardenLab },
  { id: "lab_tool_flight_school", title: "Tool Calling Flight School", kind: "react", component: ToolCallingFlightSchoolLab },
  { id: "lab_human_control", title: "Human-in-the-Loop Control Room", kind: "react", component: HumanControlRoomLab },
  { id: "lab_multi_agent", title: "Multi-Agent Mission Control", kind: "react", component: MultiAgentMissionControlLab },
  { id: "lab_mcp_permissions", title: "MCP Permission Workshop", kind: "react", component: McpPermissionWorkshopLab },
  { id: "lab_trace_detective", title: "Trace Detective — Debug an Agent Run", kind: "react", component: TraceDetectiveLab },
  { id: "lab_structured_repair", title: "Structured Output Repair Shop", kind: "react", component: StructuredOutputRepairLab },
  { id: "lab_model_router", title: "Model Router — Right Model, Right Task", kind: "react", component: ModelRouterLab },
  { id: "lab_grounding_court", title: "Grounding Court — Claim, Evidence, Verdict", kind: "react", component: GroundingCourtLab },
  { id: "lab_uncertainty", title: "Agent Uncertainty Lab", kind: "react", component: AgentUncertaintyLab },
  { id: "lab_prompt_cache", title: "Prompt Cache Workshop", kind: "react", component: PromptCacheWorkshopLab },
  { id: "lab_technique_chooser", title: "Fine-Tune, RAG, Prompt, or Tool?", kind: "react", component: TechniqueChooserLab },
];

function ReactLabFrame({ title, component: LabComponent, onReady }) {
  const frameRef = useRef(null);
  const [mountNode, setMountNode] = useState(null);

  return (
    <iframe
      ref={frameRef}
      className="labs-hub-frame"
      title={title}
      srcDoc="<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><style>html,body,#lab-root{margin:0;width:100%;min-height:100%;background:#fafaf9}body{overflow:auto}</style></head><body><div id='lab-root'></div></body></html>"
      onLoad={() => {
        const frameDocument = frameRef.current?.contentDocument;
        setMountNode(frameDocument?.getElementById("lab-root") || null);
        onReady?.();
      }}
    >
      {mountNode ? createPortal(<LabComponent />, mountNode) : null}
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
          <ReactLabFrame
            key={activeLab.id}
            title={activeLab.title}
            component={activeLab.component}
            onReady={() => setIsLoading(false)}
          />
        )}
      </div>
    </section>
  );
}
