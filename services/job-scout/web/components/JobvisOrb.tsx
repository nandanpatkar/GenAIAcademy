"use client";

/**
 * The orb, full-bleed: it is the room, not a widget in it.
 *
 * The level comes from `getOutputByteFrequencyData()` — the WebRTC analyser in
 * this tab — read once per frame. That is the whole reason the voice moved into
 * the browser: the old console polled a Python meter once a second, and an orb
 * that updates at 1fps does not breathe with anybody.
 *
 * Gesture STATE lives in the page (the toggle sits in the HUD); this component
 * only owns the camera stream that state implies.
 */

import { useEffect, useRef } from "react";

import { startHandTracking, type HandTracker } from "@/lib/handTracker";
import { createOrbScene, type OrbHandle, type OrbMode } from "@/lib/orbScene";

type Props = {
  mode: OrbMode;
  /** Returns the current output spectrum, or null when no session is live. */
  getFrequencies: () => Uint8Array | null;
  gesturesOn: boolean;
  onGestureReady: (live: boolean) => void;
  onGestureError: (message: string) => void;
};

/** Mean of the low half of the spectrum: where a human voice actually lives. */
function levelFrom(bytes: Uint8Array | null): number {
  if (!bytes || bytes.length === 0) return 0;
  const half = Math.max(1, Math.floor(bytes.length / 2));
  let total = 0;
  for (let i = 0; i < half; i++) total += bytes[i];
  return total / half / 255;
}

export default function JobvisOrb({ mode, getFrequencies, gesturesOn, onGestureReady, onGestureError }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const orbRef = useRef<OrbHandle | null>(null);
  // Read by the pump below without re-creating the scene on every mode change.
  const modeRef = useRef(mode);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const orb = createOrbScene(canvas);
    orbRef.current = orb;

    let raf = 0;
    let smoothed = 0;
    let published = -1;
    const root = document.documentElement;

    const pump = () => {
      const level = levelFrom(getFrequencies());
      orb.setLevel(level);

      // The room reacts too, not just the orb: --level drives a faint
      // full-screen radiance and --heat warms it at peaks. Eased here rather
      // than in CSS so the glow cannot strobe on a single loud frame, and
      // quantised so we are not writing a custom property 60 times a second
      // for changes nobody can see.
      smoothed += (level - smoothed) * 0.12;
      const rounded = Math.round(smoothed * 40) / 40;
      if (rounded !== published) {
        published = rounded;
        root.style.setProperty("--level", rounded.toFixed(3));
        // Warmth belongs to Jobvis speaking, same rule as the heart: your own
        // voice drives this analyser too, and red should mean HE is talking.
        const heat = modeRef.current === "speaking" ? Math.max(0, Math.min(1, (smoothed - 0.34) / 0.44)) : 0;
        root.style.setProperty("--heat", heat.toFixed(3));
      }
      raf = requestAnimationFrame(pump);
    };
    raf = requestAnimationFrame(pump);

    return () => {
      cancelAnimationFrame(raf);
      root.style.setProperty("--level", "0");
      root.style.setProperty("--heat", "0");
      orb.dispose();
      orbRef.current = null;
    };
  }, [getFrequencies]);

  useEffect(() => {
    modeRef.current = mode;
    orbRef.current?.setMode(mode);
  }, [mode]);

  // Drag, wheel and keys work anywhere on the stage — the orb IS the page now.
  useEffect(() => {
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const interactive = (target: EventTarget | null) => !(target instanceof Element && target.closest(".no-drag"));

    const down = (event: PointerEvent) => {
      if (!interactive(event.target)) return;
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
    };
    const move = (event: PointerEvent) => {
      if (!dragging) return;
      orbRef.current?.spinBy((event.clientX - lastX) * 0.0018, (event.clientY - lastY) * 0.0018);
      lastX = event.clientX;
      lastY = event.clientY;
    };
    const up = () => {
      dragging = false;
    };
    const wheel = (event: WheelEvent) => {
      if (!interactive(event.target)) return;
      orbRef.current?.zoomBy(event.deltaY > 0 ? 1.06 : 0.94);
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "r" || event.key === "R") orbRef.current?.reset();
      if (event.key === "+" || event.key === "=") orbRef.current?.zoomBy(0.9);
      if (event.key === "-" || event.key === "_") orbRef.current?.zoomBy(1.1);
    };

    window.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("wheel", wheel, { passive: true });
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("keydown", key);
    };
  }, []);

  // Callbacks live in refs so the effect below depends on `gesturesOn` ALONE.
  // An inline handler from the parent is a new function every render, and with
  // it in the dep array the tracker tore down and restarted on every state
  // change — which is exactly the "play() interrupted by a new load request"
  // the console reported.
  const readyRef = useRef(onGestureReady);
  const errorRef = useRef(onGestureError);
  useEffect(() => {
    readyRef.current = onGestureReady;
    errorRef.current = onGestureError;
  });

  // The webcam only opens once the HUD toggle flips on, and closes when it flips off.
  useEffect(() => {
    if (!gesturesOn || !videoRef.current) return;
    let tracker: HandTracker | null = null;
    let cancelled = false;

    startHandTracking(videoRef.current, {
      spinBy: (dx, dy) => orbRef.current?.spinBy(dx, dy),
      zoomBy: (factor) => orbRef.current?.zoomBy(factor),
    })
      .then((started) => {
        if (cancelled) {
          started.stop();
          return;
        }
        tracker = started;
        readyRef.current(true);
      })
      .catch((error: Error) => errorRef.current(error.message || "hand tracking unavailable"));

    return () => {
      cancelled = true;
      readyRef.current(false);
      tracker?.stop();
    };
  }, [gesturesOn]);

  return (
    <>
      <canvas ref={canvasRef} className="orb-canvas" aria-hidden="true" />
      <video ref={videoRef} className="orb-video" playsInline muted />
    </>
  );
}
