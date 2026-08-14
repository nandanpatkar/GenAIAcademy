/**
 * Optional hand control: pinch to spin the orb, two-hand pinch to zoom.
 *
 * Off unless NEXT_PUBLIC_JOBVIS_GESTURES is on AND the user clicks the toggle,
 * because a page that reaches for a webcam on load is a page nobody trusts.
 * Every landmark stays in this tab: MediaPipe runs on WASM in the browser, no
 * frame is uploaded, and nothing here is ever traced.
 *
 * The wasm and the model are vendored under public/mediapipe so the console
 * still works with no network — see `make web-assets`.
 */

import { FilesetResolver, HandLandmarker, type HandLandmarkerResult } from "@mediapipe/tasks-vision";

export const GESTURES_ENABLED = process.env.NEXT_PUBLIC_JOBVIS_GESTURES === "1";

const WASM_PATH = "/mediapipe/wasm";
const MODEL_PATH = "/mediapipe/hand_landmarker.task";

const PINCH_ON = 0.055; // normalized thumb-tip to index-tip distance
const PINCH_OFF = 0.085; // hysteresis, so a trembling hand does not flicker

export type HandActions = {
  spinBy: (dx: number, dy: number) => void;
  zoomBy: (factor: number) => void;
};

export type HandTracker = {
  stop: () => void;
};

type Point = { x: number; y: number };

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

/** Thumb tip (4) to index tip (8), in normalized image space. */
const pinchGap = (landmarks: Point[]) => distance(landmarks[4], landmarks[8]);

const midpoint = (landmarks: Point[]): Point => ({
  x: (landmarks[4].x + landmarks[8].x) / 2,
  y: (landmarks[4].y + landmarks[8].y) / 2,
});

/**
 * Start tracking. Resolves once the camera is live; rejects if the user denies
 * permission or the model cannot load, so the caller can put the toggle back.
 */
export async function startHandTracking(video: HTMLVideoElement, actions: HandActions): Promise<HandTracker> {
  const vision = await FilesetResolver.forVisionTasks(WASM_PATH);
  const landmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: MODEL_PATH, delegate: "GPU" },
    runningMode: "VIDEO",
    numHands: 2,
  });

  const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false });
  video.srcObject = stream;
  try {
    await video.play();
  } catch (error) {
    // "The play() request was interrupted by a new load request" — the element
    // was re-pointed while play() was pending. Not a tracking failure, and it
    // must not surface as one; the loop below reads whatever frames arrive.
    if (!(error instanceof DOMException) || error.name !== "AbortError") throw error;
  }

  let running = true;
  let pinching = false;
  let last: Point | null = null;
  let lastTwoHandGap: number | null = null;
  let lastVideoTime = -1;

  function handle(result: HandLandmarkerResult) {
    const hands = result.landmarks ?? [];

    // Two hands pinching: the distance between the pinches is the zoom.
    if (hands.length === 2 && hands.every((hand) => pinchGap(hand) < PINCH_ON)) {
      const gap = distance(midpoint(hands[0]), midpoint(hands[1]));
      if (lastTwoHandGap !== null && gap > 0.01) actions.zoomBy(lastTwoHandGap / gap);
      lastTwoHandGap = gap;
      pinching = false;
      last = null;
      return;
    }
    lastTwoHandGap = null;

    if (hands.length === 0) {
      pinching = false;
      last = null;
      return;
    }

    const hand = hands[0];
    const gap = pinchGap(hand);
    pinching = pinching ? gap < PINCH_OFF : gap < PINCH_ON;
    if (!pinching) {
      last = null;
      return;
    }

    const point = midpoint(hand);
    if (last) {
      // The webcam is mirrored, so a rightward hand should spin the orb right.
      actions.spinBy(-(point.x - last.x) * 4.2, (point.y - last.y) * 4.2);
    }
    last = point;
  }

  function loop() {
    if (!running) return;
    if (video.currentTime !== lastVideoTime && video.readyState >= 2) {
      lastVideoTime = video.currentTime;
      try {
        handle(landmarker.detectForVideo(video, performance.now()));
      } catch {
        // A dropped frame is not worth killing the session over.
      }
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  return {
    stop: () => {
      running = false;
      stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
      landmarker.close();
    },
  };
}
