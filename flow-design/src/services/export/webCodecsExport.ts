import { ArrayBufferTarget, Muxer } from 'mp4-muxer';
import type { DecodedFrame, FrameBackgroundPainter } from '@/hooks/flow-export/exportCapture';
import { renderDecodedFrame } from '@/hooks/flow-export/exportCapture';

interface WebCodecsExportParams {
  frames: DecodedFrame[];
  width: number;
  height: number;
  fps: number;
  videoBitsPerSecond?: number;
  backgroundColor?: string;
  backgroundPainter?: FrameBackgroundPainter;
  signal?: AbortSignal;
  onProgress?: (progress: { completedFrames: number; totalFrames: number }) => void;
}

// H.264 baseline 3.1 is the most universally hardware-accelerated profile
// across Chrome/Edge/Safari/Firefox 130+ desktop and mobile.
const H264_CODEC_STRING = 'avc1.42001f';
const KEYFRAME_INTERVAL_FRAMES = 30;

/**
 * Returns true if the runtime exposes a working WebCodecs VideoEncoder.
 * jsdom and unsupported browsers fail the check, falling back to MediaRecorder.
 */
export function canUseWebCodecs(): boolean {
  if (typeof window === 'undefined') return false;
  if (typeof window.VideoEncoder !== 'function') return false;
  if (typeof window.VideoFrame !== 'function') return false;
  return true;
}

/**
 * Probes whether the browser can hardware-encode H.264 at the requested resolution.
 * Returns true only if VideoEncoder.isConfigSupported reports a viable config.
 */
export async function canEncodeH264Mp4(width: number, height: number, fps: number): Promise<boolean> {
  if (!canUseWebCodecs()) return false;
  try {
    const result = await window.VideoEncoder.isConfigSupported({
      codec: H264_CODEC_STRING,
      width,
      height,
      framerate: fps,
      bitrate: 4_000_000,
    });
    return Boolean(result.supported);
  } catch {
    return false;
  }
}

function createOffscreenCanvas(width: number, height: number): {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
} {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { alpha: false });
  if (!context) {
    throw new Error('Canvas 2D context is unavailable.');
  }
  return { canvas, context };
}

function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw new DOMException('The export was cancelled.', 'AbortError');
  }
}

/**
 * Deterministically encodes a video using WebCodecs + an MP4 muxer.
 *
 * Unlike MediaRecorder, this runs faster-than-realtime: each frame is encoded
 * as soon as the encoder is ready to accept it, rather than waiting in
 * wall-clock time. Frame timestamps are calculated from the requested fps and
 * each captured frame's `delayMs`.
 */
export async function encodeVideoWithWebCodecs(params: WebCodecsExportParams): Promise<Blob> {
  const {
    frames,
    width,
    height,
    fps,
    videoBitsPerSecond,
    backgroundColor,
    backgroundPainter,
    signal,
    onProgress,
  } = params;

  if (!canUseWebCodecs()) {
    throw new Error('WebCodecs is not available in this runtime.');
  }

  const { canvas, context } = createOffscreenCanvas(width, height);
  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: {
      codec: 'avc',
      width,
      height,
      frameRate: fps,
    },
    fastStart: 'in-memory',
  });

  const encoderErrors: Error[] = [];
  const encoder = new window.VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
    error: (error) => encoderErrors.push(error),
  });

  encoder.configure({
    codec: H264_CODEC_STRING,
    width,
    height,
    framerate: fps,
    bitrate: videoBitsPerSecond ?? 4_000_000,
    // Browsers default to AnnexB which mp4-muxer can't ingest; AVCC is required.
    avc: { format: 'avc' },
  });

  const frameDurationMs = Math.max(1, Math.round(1000 / fps));
  const totalFrames = frames.reduce(
    (sum, entry) => sum + Math.max(1, Math.round(entry.frame.delayMs / frameDurationMs)),
    0
  );

  let emittedFrameIndex = 0;
  let completedFrames = 0;

  try {
    for (const { frame, image } of frames) {
      const repeatCount = Math.max(1, Math.round(frame.delayMs / frameDurationMs));
      for (let repeat = 0; repeat < repeatCount; repeat += 1) {
        throwIfAborted(signal);

        renderDecodedFrame(context, width, height, image, backgroundColor, backgroundPainter);

        const timestampUs = Math.round((emittedFrameIndex * 1_000_000) / fps);
        const durationUs = Math.round(1_000_000 / fps);
        const videoFrame = new window.VideoFrame(canvas, {
          timestamp: timestampUs,
          duration: durationUs,
        });

        encoder.encode(videoFrame, {
          keyFrame: emittedFrameIndex % KEYFRAME_INTERVAL_FRAMES === 0,
        });
        videoFrame.close();

        emittedFrameIndex += 1;
        completedFrames += 1;
        onProgress?.({ completedFrames, totalFrames });

        // Yield to the encoder when its queue grows so we don't pin a CPU core
        // and starve the encoder thread.
        if (encoder.encodeQueueSize > 8) {
          await new Promise<void>((resolve) => setTimeout(resolve, 0));
        }
      }
    }

    await encoder.flush();
  } finally {
    if (encoder.state !== 'closed') {
      encoder.close();
    }
  }

  if (encoderErrors.length > 0) {
    throw new Error(`WebCodecs encoder error: ${encoderErrors[0].message}`);
  }

  muxer.finalize();
  const { buffer } = muxer.target as ArrayBufferTarget;
  return new Blob([buffer], { type: 'video/mp4' });
}
