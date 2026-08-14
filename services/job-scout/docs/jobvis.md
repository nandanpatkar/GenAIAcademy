# Jobvis — a voice concierge over an observable agent

*The Phase 2 grounding lesson, applied to a new modality: a voice agent that can
only speak what the graph's checkpoint returns.*

Ask **"what jobs are available?"** and Jobvis — a calm, dry English butler —
reads your top three matches with fit scores and honest gaps. Ask it to
**"tailor an application for the second one"** and a minute later the finished
pack appears on screen, cover letter and PDF included, while Jobvis offers you
the highlights. The voice is the remote control; the screen stays the canvas.

---

## Architecture

The conversation lives in the **browser**, over WebRTC. Everything the agent may
*know* stays in Python, next to the LangGraph checkpoint. The browser forwards
tool calls; it never answers them.

```mermaid
flowchart LR
    mic([your mic]) --> WEB[web/ console\nWebRTC · Three.js orb]
    WEB <-- "WebRTC" --> EL[ElevenLabs Agents\nSTT · turn-taking · LLM · TTS]
    WEB -- "POST /api/tools/get_top_jobs" --> API[api.py]
    API --> T[voice/tools.py]
    T --> B[voice/bridge.py\nwizard registry + run manager]
    B -- read --> CP[(LangGraph\nMemorySaver checkpoint)]
    B -- "start_search / start_tailoring\n(background thread)" --> R[runner.py]
    R --> CP
    R -.traced.-> OPIK[(Opik)]
    B -- "run_finished / screen" --> SSE[/api/events]
    SSE --> WEB
    UI[app.py wizard · gr.Timer 1s] -- polls --> B
```

Why this shape: the ElevenLabs key never leaves the Python process — the browser
asks `/api/voice/token` for a short-lived conversation token, and that is the
only credential it ever holds.

**Both servers run in one process** (`make app` starts the API on a daemon
thread, then hands the main thread to Gradio). That is a correctness
requirement, not a convenience: the bridge and the LangGraph `MemorySaver` are
both process-wide, so two processes would mean two sessions wearing the same
name — the wizard would find jobs the console could not see, and Jobvis would
truthfully report an empty checkpoint. `make jobvis-api` runs the API alone for
frontend work, and its session is empty by design.

| Where | Job | Talks to ElevenLabs? |
|-------|-----|----------------------|
| `voice/bridge.py` | Thread-safe registry of the active wizard session (thread_id, profile, CV text), run manager, and the per-consumer event feed | no |
| `voice/tools.py` | The seven client tools; every payload built from bridge/checkpoint data, trimmed to be *spoken* | no |
| `voice/persona.py` | System prompt, greeting, tool schemas, preferred voices — agent config as code | no |
| `voice/announce.py` | The "System note" text for a finished run | no |
| `api.py` | Token minting, tool dispatch, `/api/state`, the SSE stream, pack downloads, and serving the built console | mints tokens only |
| `web/` | The console: WebRTC session, orb, panels | yes — this is the only place a conversation exists |

No Python module imports an audio SDK any more, and there is no `voice` extra to
install: **`is_voice_available()` is purely a question of credentials.**

## The grounding story

Phase 2's thesis was that **generation must be grounded**: the fabrication
validator checks every CV claim against the corpus. Jobvis extends the same
contract to conversation. The persona's house rule is *"every fact must come
from a tool result"*, and the tools can only return what the checkpoint holds —
`RankedJob.fit_score`, `.matched_skills`, `.gaps`, the tailored pack, the
fabrication verdict. Open the **transcript panel** during a session: every
`⚙ get_top_jobs` line is a grounding event you can watch happen. If Jobvis says
"87 out of 100", there is a tool call above it that returned 87.

Moving the conversation into the browser did not weaken this. The tool
*implementations* never moved: `web/lib/tools.ts` registers handlers under the
same names `TOOL_SPECS` declares, and each one POSTs to `/api/tools/{name}`,
which calls the same Python function it always did. The browser is a courier.

### Persistence: remember the candidate, refetch the jobs

Session state splits by lifetime. The **candidate** (extracted CV text + typed
profile) changes rarely, so it persists across restarts in `data/candidate/`
(gitignored — personal data): the app reopens on step 2, the bridge is
pre-seeded, and Jobvis knows you from the first greeting with zero LLM cost.
**Jobs** go stale daily, so search results are deliberately *never* persisted —
each session fetches fresh, either with the Find jobs button or by telling
Jobvis "find me jobs" (on demand rather than auto-on-startup, to protect your
JSearch quota and LLM budget). "Start over" is the explicit forget-me: it clears
the stored candidate as well as the wizard.

Three design choices keep the long-running parts honest — and make the butler
*proactive*:

- **Fire-and-forget runs.** `start_search`/`start_tailoring` return in
  milliseconds while the real run streams on a background thread — tool timeouts
  never bite, and Jobvis stays conversational during the wait ("ask me how it's
  going"). `get_run_status` relays the runner's live status lines.
- **The pop.** A finished run reaches every listener exactly once, through
  `bridge.subscribe()`. The console repaints from the `state` event; the
  wizard's 1-second `gr.Timer` still pops step 3 or step 4 with the PDF, using
  the *same* renderers the buttons use. (This is why the bridge grew per-consumer
  feeds: `pop_finished_run` hands a run to whoever asks first, which was fine
  with one listener and wrong with two.)
- **The announcement.** The SSE stream carries two kinds of event, because
  ElevenLabs treats them differently and so should we. `run_finished` is replayed
  as a **user message** — the one client event that triggers a full spoken
  response — so Jobvis breaks the silence himself: *"The search is complete —
  twelve matches, the best is ML Engineer at Acme, 87 out of 100."* A `context`
  event becomes a **contextual update**, which is silent by design: the wizard
  whispers screen events (CV uploaded, button-triggered runs) so Jobvis never
  contradicts what you can see, without interrupting to say so.

Smaller touches: the greeting is personalized through dynamic variables ("Good
evening, Shantanu" — from the persisted profile); the agent runs
`eleven_flash_v2` TTS with eager turn-taking and a spoken "One moment." filler
instead of dead air; ASR keyword boosting stops "Jobvis" and "CV" being
mis-heard.

## The console

**http://localhost:8000** — full-dark, voice-directed, and the reason the voice
moved into the browser at all.

The orb is Three.js: a core that swells with the voice, a spiral threaded
through it, three counter-rotating wireframe shells, orbiting debris and
sweeping scan rings, under bloom and a whisper of chromatic aberration. Ice
azure (`#BFE6FF` core, `#3AA9FF` shells) — the wizard stays green on purpose,
so the click path and voice mode are tellable apart at a glance.

It breathes with Jobvis because `getOutputByteFrequencyData()` gives the tab the
actual output spectrum, read once per frame. The previous console polled a
Python audio meter once a second; an orb that updates at 1fps does not breathe
with anybody. That is the honest argument for the browser port, and it came with
two more: **real barge-in** and the browser's own **echo cancellation**, which
together retire the echo gate that used to mute your mic whenever Jobvis spoke.

Drag to spin, scroll to zoom, `R` to reset. **Hand control** is opt-in twice
over — `NEXT_PUBLIC_JOBVIS_GESTURES=1` *and* a click on the toggle — because a
page that reaches for a webcam on load is a page nobody trusts. Pinch to spin,
two pinching hands to zoom, `G` to toggle. MediaPipe runs on WASM in the tab: no
frame is uploaded, and nothing about it is traced.

## Observability

Voice-*triggered* runs go through `runner.py` like every other run, so they are
fully traced in Opik under the tags `["phase-2", "voice"]` — same span tree,
same cost accounting. What is **not** traced is Jobvis's own conversational
brain: that LLM runs on ElevenLabs' side. The boundary is visible and honest —
tool calls are logged locally and shown in the transcript; the agent's reasoning
lives in the ElevenLabs dashboard's conversation history. (Pointing the agent at
your own LLM via their custom-LLM passthrough would close that gap; deliberately
out of scope here.)

## Setup

1. **Sign up** at elevenlabs.io — the free tier includes ~15 conversation
   minutes/month (enough to build and film a short demo; the ~$5 Starter tier
   buys ~75).
2. **Configure**: put `ELEVENLABS_API_KEY=...` in `.env`. The key must have the
   **Agents Platform (Conversational AI) read + write scopes** — an unrestricted
   key works; a restricted one returns 401 on the agent endpoints.
3. **Create the agent** (idempotent — safe to re-run after editing the persona):
   ```bash
   make jobvis-agent
   # → prints ELEVENLABS_AGENT_ID=agent_... ; paste it into .env
   ```
4. **Build and serve the console**:
   ```bash
   make web-build      # npm ci && next build → web/out
   make app            # wizard on :7860 AND the console on :8000
   ```
5. **Optional — hand control**:
   ```bash
   make web-assets     # vendors the MediaPipe wasm + model (~43MB, gitignored)
   echo "NEXT_PUBLIC_JOBVIS_GESTURES=1" > web/.env.local
   make web-build
   ```

No `brew install portaudio`, no `voice` extra, and the microphone prompt now
comes from **your browser** rather than from your terminal app — which is where
people expect to be asked.

Working on the console itself? `make web-dev` runs Next on :3000 against the API
on :8000 (CORS is already allowed for that origin), with hot reload.

## The demo script (60–90 seconds)

Film the screen with audio; the transcript panel open on the side sells the
grounding.

| Beat | You say | What happens |
|------|---------|--------------|
| 1 | *(click Engage Jobvis)* | "Good evening, Shantanu. Jobvis at your service — shall we see what the market offers today?" (it knows you from the persisted profile) |
| 2 | "Yes — find me jobs." | "Very good — I've started. About a minute." The orb settles; you say nothing. |
| 3 | *(stay silent — this is the money moment)* | **Jobvis breaks the silence himself:** "The search is complete — twelve matches. The best: ML Engineer at Acme, 87 out of 100. Shall I run through the top three?" The panels are already filled. |
| 4 | "Go on." | Three titles, companies, scores and gaps — every number visible in the `⚙ get_top_jobs` transcript line. |
| 5 | "Tailor an application for the second one." | "On it." A minute later Jobvis **announces the pack unprompted** and the download buttons appear. |
| 6 | *(interrupt him mid-sentence)* | He stops. Barge-in is the browser's, not ours — and it is new. |
| 7 | "Give me the highlights." | Target job, letter length, CV headline, and the fabrication verdict: "every claim checked against your CV — no flags." |

Rehearse by **text** in the ElevenLabs dashboard (agent → Test) — it exercises
the same prompt without spending conversation minutes.

## Limits & troubleshooting

| Symptom | Cause / fix |
|---------|-------------|
| Console says "Jobvis is off — …" | The hint names the missing piece: API key or agent id. |
| The page loads but says the API is unreachable | `make app` is not running, or you opened :3000 (dev) without it. |
| `/api/voice/token` returns 502 with a 401 inside | The API key lacks Agents-platform scopes. Dashboard → Developers → API Keys → your key → enable Agents Platform (Conversational AI) read + write, or use an unrestricted key. |
| The log says "no built console" | Run `make web-build` first; the API works without it, but there is no page to open. |
| Session starts, hears nothing | Browser mic permission — the padlock in the address bar. |
| Session drops mid-conversation | Likely free-tier minutes exhausted — check the ElevenLabs dashboard usage page. Minutes are a separate pool from TTS characters. |
| Jobvis says there are no results but the page shows some | The app was restarted: the in-process `MemorySaver` is empty, and Jobvis answers from the checkpoint — truthfully. Re-run the search. |
| "I'm still busy with the current search…" | One voice-triggered run at a time, by design. |
| Gesture toggle says "starting camera…" and stays there | The browser's permission prompt is waiting for an answer. |
| Two browser tabs | One bridge — the last loaded tab wins. Single-user app. |
| App restarts on step 2 with a profile you don't want | That's the persisted candidate — click "Start over" (or delete `data/candidate/`). |

## What this chapter deliberately leaves out

A wake word ("Hey Jobvis" — openWakeWord ships a pretrained *hey jarvis* model),
custom-LLM passthrough for full-trace observability, and a fully local stack
(Pipecat + local Whisper + Kokoro TTS would slot in where ElevenLabs sits, at the
cost of voice quality and turn-taking). The WebRTC migration that used to be on
this list is done — it is the console described above.
