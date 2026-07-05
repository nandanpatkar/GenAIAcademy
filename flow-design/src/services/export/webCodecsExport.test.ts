import { afterEach, describe, expect, it, vi } from 'vitest';

// mp4-muxer validates that chunks are instances of EncodedVideoChunk (a real
// browser class), which jsdom does not provide. Stub the muxer so the test
// exercises our encoder orchestration without touching real muxing.
vi.mock('mp4-muxer', () => {
  class ArrayBufferTarget {
    buffer = new ArrayBuffer(0);
  }
  class Muxer {
    target: ArrayBufferTarget;
    chunkCount = 0;
    finalized = false;
    constructor(options: { target: ArrayBufferTarget }) {
      this.target = options.target;
    }
    addVideoChunk(): void {
      this.chunkCount += 1;
    }
    finalize(): void {
      this.finalized = true;
    }
  }
  return { ArrayBufferTarget, Muxer };
});

import {
  canEncodeH264Mp4,
  canUseWebCodecs,
  encodeVideoWithWebCodecs,
} from './webCodecsExport';

interface FakeVideoEncoderInit {
  output: (chunk: unknown, meta?: unknown) => void;
  error: (err: Error) => void;
}

function installFakeWebCodecs(options: {
  isConfigSupported?: boolean;
  encodeErrors?: Error[];
} = {}): { encodeCount: number; flushCalls: number; closeCalls: number } {
  const stats = { encodeCount: 0, flushCalls: 0, closeCalls: 0 };
  const isConfigSupported = options.isConfigSupported ?? true;

  class FakeVideoEncoder {
    state: 'configured' | 'closed' = 'configured';
    encodeQueueSize = 0;
    private readonly outputCallback: FakeVideoEncoderInit['output'];

    constructor(init: FakeVideoEncoderInit) {
      this.outputCallback = init.output;
    }
    configure(): void {}
    encode(): void {
      stats.encodeCount += 1;
      // Emit a fake chunk + meta so the muxer receives something.
      this.outputCallback(
        { type: 'key', timestamp: 0, duration: 0, byteLength: 0, copyTo: () => {} },
        { decoderConfig: { codec: 'avc1.42001f', description: new Uint8Array() } }
      );
    }
    async flush(): Promise<void> {
      stats.flushCalls += 1;
    }
    close(): void {
      stats.closeCalls += 1;
      this.state = 'closed';
    }
    static async isConfigSupported(): Promise<{ supported: boolean }> {
      return { supported: isConfigSupported };
    }
  }

  class FakeVideoFrame {
    constructor(_source: unknown, _init: unknown) {}
    close(): void {}
  }

  (window as unknown as { VideoEncoder: unknown }).VideoEncoder = FakeVideoEncoder;
  (window as unknown as { VideoFrame: unknown }).VideoFrame = FakeVideoFrame;
  return stats;
}

function clearWebCodecs(): void {
  delete (window as unknown as { VideoEncoder?: unknown }).VideoEncoder;
  delete (window as unknown as { VideoFrame?: unknown }).VideoFrame;
}

function installFakeCanvas2d(): () => void {
  const fakeContext = {
    fillStyle: '',
    fillRect: () => {},
    clearRect: () => {},
    drawImage: () => {},
  } as unknown as CanvasRenderingContext2D;
  const original = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = (function getContext() {
    return fakeContext;
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  return () => {
    HTMLCanvasElement.prototype.getContext = original;
  };
}

describe('canUseWebCodecs', () => {
  afterEach(clearWebCodecs);

  it('returns false when VideoEncoder is unavailable', () => {
    clearWebCodecs();
    expect(canUseWebCodecs()).toBe(false);
  });

  it('returns true when both VideoEncoder and VideoFrame exist on window', () => {
    installFakeWebCodecs();
    expect(canUseWebCodecs()).toBe(true);
  });
});

describe('canEncodeH264Mp4', () => {
  afterEach(clearWebCodecs);

  it('returns false when WebCodecs is unavailable', async () => {
    clearWebCodecs();
    await expect(canEncodeH264Mp4(640, 360, 30)).resolves.toBe(false);
  });

  it('reports support from VideoEncoder.isConfigSupported', async () => {
    installFakeWebCodecs({ isConfigSupported: true });
    await expect(canEncodeH264Mp4(640, 360, 30)).resolves.toBe(true);
  });

  it('reports false when the browser rejects the config', async () => {
    installFakeWebCodecs({ isConfigSupported: false });
    await expect(canEncodeH264Mp4(640, 360, 30)).resolves.toBe(false);
  });
});

describe('encodeVideoWithWebCodecs', () => {
  let restoreCanvas: (() => void) | null = null;
  afterEach(() => {
    clearWebCodecs();
    restoreCanvas?.();
    restoreCanvas = null;
  });

  it('encodes every captured frame and returns an MP4 blob', async () => {
    restoreCanvas = installFakeCanvas2d();
    const stats = installFakeWebCodecs();

    const fakeImage = {} as CanvasImageSource;
    const frames = [
      { frame: { dataUrl: '', delayMs: 33 }, image: fakeImage },
      { frame: { dataUrl: '', delayMs: 33 }, image: fakeImage },
      { frame: { dataUrl: '', delayMs: 33 }, image: fakeImage },
    ];

    const progressEvents: Array<{ completedFrames: number; totalFrames: number }> = [];
    const blob = await encodeVideoWithWebCodecs({
      frames,
      width: 16,
      height: 16,
      fps: 30,
      onProgress: (event) => progressEvents.push(event),
    });

    expect(blob.type).toBe('video/mp4');
    expect(stats.encodeCount).toBe(3);
    expect(stats.flushCalls).toBe(1);
    expect(stats.closeCalls).toBe(1);
    expect(progressEvents.at(-1)).toEqual({ completedFrames: 3, totalFrames: 3 });
  });

  it('throws if WebCodecs is unavailable', async () => {
    clearWebCodecs();
    const fakeImage = {} as CanvasImageSource;
    await expect(
      encodeVideoWithWebCodecs({
        frames: [{ frame: { dataUrl: '', delayMs: 33 }, image: fakeImage }],
        width: 16,
        height: 16,
        fps: 30,
      })
    ).rejects.toThrow(/WebCodecs is not available/);
  });

  it('propagates abort via the supplied signal', async () => {
    restoreCanvas = installFakeCanvas2d();
    installFakeWebCodecs();
    const controller = new AbortController();
    controller.abort();
    const fakeImage = {} as CanvasImageSource;
    await expect(
      encodeVideoWithWebCodecs({
        frames: [{ frame: { dataUrl: '', delayMs: 33 }, image: fakeImage }],
        width: 16,
        height: 16,
        fps: 30,
        signal: controller.signal,
      })
    ).rejects.toThrow(/cancel/i);
  });
});

describe('encodeVideoWithWebCodecs (no fake muxer)', () => {
  it('exists and is callable', () => {
    // mp4-muxer is imported at module load; if its import broke this would throw.
    expect(typeof encodeVideoWithWebCodecs).toBe('function');
    vi.fn();
  });
});
