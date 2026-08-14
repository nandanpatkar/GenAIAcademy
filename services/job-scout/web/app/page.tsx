"use client";

/**
 * The Jobvis console.
 *
 * The orb is the room: a full-bleed WebGL scene you can drag and spin anywhere
 * on the page. Over it floats one frosted slab carrying the live state — you
 * can see the orb move THROUGH the glass, which is the whole composition.
 * Controls retreat to a HUD in the top right so nothing competes with it.
 *
 * Three wires meet here:
 *   1. the WebRTC conversation (@elevenlabs/react), which owns the microphone,
 *      the speaker and the client-tool calls;
 *   2. /api/events, the server's push channel — a finished run arrives here and
 *      gets replayed as a user message, which is the only thing that makes the
 *      agent speak unprompted;
 *   3. /api/state, the checkpoint, which fills the slab.
 */

import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import JobvisOrb from "@/components/JobvisOrb";
import { ActivityPanel, JobsPanel, NextPanel, PackPanel, nextStep } from "@/components/Panels";
import { eventsUrl, getConfig, getLastVoiceError, getSessionStart, getState, type Config, type State } from "@/lib/api";
import { GESTURES_ENABLED } from "@/lib/handTracker";
import type { OrbMode } from "@/lib/orbScene";
import { buildClientTools } from "@/lib/tools";

const EMPTY_STATE: State = {
  step: "start",
  thread_id: "",
  candidate: null,
  jobs: [],
  pack: null,
  run: { running: false },
};

type Line = { role: string; text: string };

const STATUS_LABEL: Record<OrbMode, string> = {
  idle: "standing by",
  connecting: "coming online",
  listening: "listening",
  speaking: "speaking",
  error: "fault",
};

function Console() {
  const [config, setConfig] = useState<Config | null>(null);
  const [state, setState] = useState<State>(EMPTY_STATE);
  const [lines, setLines] = useState<Line[]>([]);
  const [error, setError] = useState("");
  const [engaging, setEngaging] = useState(false);
  const [gesturesOn, setGesturesOn] = useState(false);
  const [gesturesLive, setGesturesLive] = useState(false);
  // Kept apart from `error` on purpose: a camera problem is a HUD footnote, not
  // a fault in the conversation. It must not turn the orb amber.
  const [gestureError, setGestureError] = useState("");

  const onGestureError = useCallback((message: string) => {
    setGestureError(message);
    setGesturesOn(false);
  }, []);

  const addLine = useCallback((line: Line) => setLines((all) => [...all, line]), []);

  const explainFailure = useCallback(async () => {
    const { reason, quota } = await getLastVoiceError();
    if (!reason) return;
    setError(
      quota
        ? `${reason} The ElevenLabs free tier includes about 15 conversation minutes a month, and they are a separate pool from TTS characters — check Usage on elevenlabs.io.`
        : reason,
    );
  }, []);

  const clientTools = useMemo(() => buildClientTools(({ name }) => addLine({ role: "tool", text: name })), [addLine]);

  const conversation = useConversation({
    clientTools,
    onConnect: () => setError(""),
    onError: (message: unknown) => {
      setError(String(message));
      // The SDK says "Server error: Unknown error" for everything, including
      // running out of free minutes. Ask ElevenLabs what actually happened.
      void explainFailure();
    },
    onMessage: ({ message, source }: { message: string; source: string }) =>
      addLine({ role: source === "user" ? "you" : "jobvis", text: message }),
  });

  // `useConversation` returns a fresh object every render; the SSE handler needs
  // the live one, so park it in a ref rather than resubscribing on every change.
  const conversationRef = useRef(conversation);
  useEffect(() => {
    conversationRef.current = conversation;
  });

  const connected = conversation.status === "connected";
  // The SSE stream fires whether or not anybody is talking to Jobvis: the
  // wizard's click path emits screen events, and a background run finishes on
  // its own schedule. Both SDK calls below throw "No active conversation" when
  // no session is up, so the handlers check this ref rather than assuming one.
  const connectedRef = useRef(connected);
  useEffect(() => {
    connectedRef.current = connected;
  }, [connected]);

  useEffect(() => {
    getConfig().then(setConfig).catch(() => setError("The Jobvis API is not reachable. Is `make app` running?"));
    getState().then(setState).catch(() => undefined);
  }, []);

  // The push channel. State frames repaint the slab; run_finished makes the
  // agent talk; context tells it what happened on screen without interrupting.
  useEffect(() => {
    const source = new EventSource(eventsUrl());
    source.addEventListener("state", (event) => setState(JSON.parse((event as MessageEvent).data) as State));
    source.addEventListener("run_finished", (event) => {
      const payload = JSON.parse((event as MessageEvent).data) as { text: string };
      addLine({ role: "system", text: payload.text });
      // Replaying it as a user message is what makes the agent SPEAK. With no
      // session there is nobody to speak to; the panel still repaints.
      if (connectedRef.current) conversationRef.current.sendUserMessage(payload.text);
    });
    source.addEventListener("context", (event) => {
      const payload = JSON.parse((event as MessageEvent).data) as { text: string };
      if (connectedRef.current) conversationRef.current.sendContextualUpdate(payload.text);
    });
    return () => source.close();
  }, [addLine]);

  const getFrequencies = useCallback(() => {
    try {
      return connected ? conversationRef.current.getOutputByteFrequencyData() : null;
    } catch {
      return null; // between connect and the first audio frame there is no analyser yet
    }
  }, [connected]);

  const mode: OrbMode = error
    ? "error"
    : engaging || conversation.status === "connecting"
      ? "connecting"
      : connected
        ? conversation.isSpeaking
          ? "speaking"
          : "listening"
        : "idle";

  const step = nextStep(state, mode);

  async function toggle() {
    if (connected) {
      conversation.endSession();
      return;
    }
    setEngaging(true);
    setError("");
    try {
      const { token, dynamicVariables } = await getSessionStart();
      conversation.startSession({ conversationToken: token, connectionType: "webrtc", dynamicVariables });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setEngaging(false);
    }
  }

  const voiceOff = config !== null && !config.voice_ok;

  return (
    <div className="stage">
      <JobvisOrb
        mode={mode}
        getFrequencies={getFrequencies}
        gesturesOn={gesturesOn}
        onGestureReady={setGesturesLive}
        onGestureError={onGestureError}
      />
      <div className="radiance" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <header className="brand">
        <h1>Jobvis</h1>
        <p>voice-directed job scout</p>
      </header>

      <div className="hud no-drag">
        <button type="button" className={`pill solid ${connected ? "live" : ""}`} onClick={toggle} disabled={engaging || voiceOff}>
          <span className={`dot ${mode}`} />
          {connected ? "Stand down" : "Engage"}
        </button>
        {GESTURES_ENABLED && (
          <button
            type="button"
            className={`pill ${gesturesLive ? "live" : ""}`}
            onClick={() => {
              setGestureError("");
              setGesturesOn((on) => !on);
            }}
            title={gestureError || "Pinch to spin the orb, two hands to zoom"}
          >
            {gestureError ? "hands ✕" : gesturesOn ? (gesturesLive ? "hands on" : "starting camera…") : "hands"}
          </button>
        )}
        <a className="pill quiet" href={config?.wizard_url ?? "http://localhost:7860"} target="_blank" rel="noopener">
          wizard ↗
        </a>
      </div>

      <main className="console">
        <div className="console-top">
          <span className={`status ${mode}`}>
            <span className={`dot ${mode}`} />
            {STATUS_LABEL[mode]}
          </span>
          {state.candidate && <span className="who-line">{state.candidate.role || state.candidate.seniority}</span>}
        </div>

        {error ? (
          <section className="block fault">
            <p className="label">Fault</p>
            <p className="next-line">{error}</p>
          </section>
        ) : voiceOff ? (
          <section className="block fault">
            <p className="label">Jobvis is off</p>
            <p className="next-line">{config?.voice_hint}</p>
          </section>
        ) : (
          <NextPanel step={step} />
        )}

        <JobsPanel state={state} />
        <PackPanel state={state} />
        <ActivityPanel lines={lines} />
      </main>

      <p className="hint">drag to spin · scroll to zoom · R to reset</p>
    </div>
  );
}

export default function Page() {
  return (
    <ConversationProvider>
      <Console />
    </ConversationProvider>
  );
}
