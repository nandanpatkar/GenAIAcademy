const LIVE_ENDPOINT = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained";
const MODEL = "gemini-3.1-flash-live-preview";

const bytesToBase64 = (bytes) => {
  let binary = "";
  const view = new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  for (let i = 0; i < view.length; i += 0x8000) binary += String.fromCharCode(...view.subarray(i, i + 0x8000));
  return btoa(binary);
};

const base64ToBytes = (base64) => {
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

function downsampleTo16k(input, inputRate) {
  const ratio = inputRate / 16000;
  const output = new Int16Array(Math.round(input.length / ratio));
  for (let i = 0; i < output.length; i += 1) {
    const start = Math.floor(i * ratio);
    const end = Math.min(Math.floor((i + 1) * ratio), input.length);
    let sum = 0;
    for (let sample = start; sample < end; sample += 1) sum += input[sample];
    const value = sum / Math.max(1, end - start);
    output[i] = Math.max(-1, Math.min(1, value)) * 0x7fff;
  }
  return output;
}

// Approximate autocorrelation-based fundamental-frequency estimator. Good enough
// for driving a visualizer, not lab-grade pitch tracking. `sampleRate` should
// already reflect any decimation applied to `buffer` by the caller.
function estimatePitch(buffer, sampleRate) {
  const size = buffer.length;
  let rms = 0;
  for (let i = 0; i < size; i += 1) rms += buffer[i] * buffer[i];
  rms = Math.sqrt(rms / size);
  if (rms < 0.01) return 0;

  const threshold = 0.2;
  let start = 0;
  while (start < size / 2 && Math.abs(buffer[start]) < threshold) start += 1;
  let end = size - 1;
  while (end > size / 2 && Math.abs(buffer[end]) < threshold) end -= 1;
  const trimmed = buffer.subarray(start, end);
  const trimmedSize = trimmed.length;
  if (trimmedSize < 8) return 0;

  const correlation = new Float32Array(trimmedSize);
  for (let lag = 0; lag < trimmedSize; lag += 1) {
    let sum = 0;
    for (let i = 0; i < trimmedSize - lag; i += 1) sum += trimmed[i] * trimmed[i + lag];
    correlation[lag] = sum;
  }

  let d = 0;
  while (d + 1 < trimmedSize && correlation[d] > correlation[d + 1]) d += 1;
  let maxValue = -1;
  let maxLag = -1;
  for (let lag = d; lag < trimmedSize; lag += 1) {
    if (correlation[lag] > maxValue) { maxValue = correlation[lag]; maxLag = lag; }
  }
  if (maxLag <= 0) return 0;

  let period = maxLag;
  const before = correlation[maxLag - 1] ?? correlation[maxLag];
  const at = correlation[maxLag];
  const after = correlation[maxLag + 1] ?? correlation[maxLag];
  const a = (before + after - 2 * at) / 2;
  const b = (after - before) / 2;
  if (a) period -= b / (2 * a);

  const hz = sampleRate / period;
  return hz > 60 && hz < 1000 ? Math.round(hz) : 0;
}

export class GeminiLiveSession {
  constructor({ systemInstruction, initialMessage = "Begin the interview now. Introduce yourself briefly and ask the first question.", transcriptRoles = { assistant: "interviewer", user: "candidate" }, languageCode, onStatus, onTranscript, onError, onVolume, onPitch, onAiVolume, onAiPitch, onInterruption }) {
    this.systemInstruction = systemInstruction;
    this.initialMessage = initialMessage;
    this.transcriptRoles = transcriptRoles;
    this.languageCode = languageCode;
    this.onStatus = onStatus;
    this.onTranscript = onTranscript;
    this.onError = onError;
    this.onVolume = onVolume;
    this.onPitch = onPitch;
    this.onAiVolume = onAiVolume;
    this.onAiPitch = onAiPitch;
    this.onInterruption = onInterruption;
    this.socket = null;
    this.inputContext = null;
    this.outputContext = null;
    this.outputAnalyser = null;
    this.outputMeterFrame = null;
    this.stream = null;
    this.processor = null;
    this.nextPlaybackTime = 0;
    this.playbackSources = new Set();
    this.speechFrames = 0;
    this.lastInterruptionAt = 0;
    this.candidateSpeechUntil = 0;
    this.pitchFrameCount = 0;
  }

  async start() {
    this.onStatus?.("Requesting secure session…");
    // Create this while the Start button's user gesture is still active. Browsers
    // otherwise may suspend playback when Gemini's first audio arrives later.
    this.outputContext = new AudioContext({ sampleRate: 24000 });
    this.outputAnalyser = this.outputContext.createAnalyser();
    this.outputAnalyser.fftSize = 1024;
    this.startOutputMeter();
    const tokenResponse = await fetch("/api/gemini-live-token", { method: "POST" });
    const { token, error } = await tokenResponse.json();
    if (!tokenResponse.ok || !token) throw new Error(error || "Could not create a Live session.");

    this.socket = new WebSocket(`${LIVE_ENDPOINT}?access_token=${encodeURIComponent(token)}`);
    this.socket.onopen = () => {
      this.socket.send(JSON.stringify({
        setup: {
          model: `models/${MODEL}`,
          // In the raw WebSocket protocol this belongs in generationConfig
          // (the JavaScript SDK promotes it to the top-level config object).
          generationConfig: {
            responseModalities: ["AUDIO"],
            ...(this.languageCode ? { speechConfig: { languageCode: this.languageCode } } : {}),
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: { parts: [{ text: this.systemInstruction }] },
        },
      }));
      this.onStatus?.("Configuring Gemini Live…");
    };
    this.socket.onmessage = async (event) => {
      try {
        await this.handleMessage(event);
      } catch (error) {
        console.error("Unable to process Gemini Live message", error);
        this.onError?.(new Error("Received an unreadable response from Gemini Live."));
      }
    };
    this.socket.onerror = () => this.onError?.(new Error("Gemini Live connection failed."));
    this.socket.onclose = () => this.onStatus?.("Session ended");
  }

  async startMicrophone() {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    this.inputContext = new AudioContext();
    const source = this.inputContext.createMediaStreamSource(this.stream);
    this.processor = this.inputContext.createScriptProcessor(4096, 1, 1);
    this.processor.onaudioprocess = ({ inputBuffer }) => {
      if (this.socket?.readyState !== WebSocket.OPEN) return;
      const samples = inputBuffer.getChannelData(0);
      let sum = 0;
      for (let index = 0; index < samples.length; index += 1) sum += samples[index] ** 2;
      const level = Math.min(1, Math.sqrt(sum / samples.length) * 5);
      this.onVolume?.(level);
      // Pitch detection is O(n^2) in buffer length; decimate and throttle it so
      // it stays cheap on the main-thread audio callback (~10Hz is plenty for a visualizer).
      this.pitchFrameCount += 1;
      if (this.onPitch && this.pitchFrameCount % 4 === 0) {
        const decimated = new Float32Array(Math.floor(samples.length / 4));
        for (let i = 0; i < decimated.length; i += 1) decimated[i] = samples[i * 4];
        this.onPitch(estimatePitch(decimated, this.inputContext.sampleRate / 4));
      }
      if (level > 0.13) this.candidateSpeechUntil = performance.now() + 500;
      // Gemini continues receiving the candidate's audio. Locally clearing PCM
      // sources makes barge-in immediate instead of waiting for server turn logic.
      if (this.playbackSources.size && level > 0.13) this.speechFrames += 1;
      else this.speechFrames = 0;
      if (this.speechFrames >= 3 && performance.now() - this.lastInterruptionAt > 700) {
        this.interruptPlayback();
        this.lastInterruptionAt = performance.now();
        this.onInterruption?.();
      }
      const pcm16 = downsampleTo16k(samples, this.inputContext.sampleRate);
      this.socket.send(JSON.stringify({ realtimeInput: { audio: { data: bytesToBase64(pcm16), mimeType: "audio/pcm;rate=16000" } } }));
    };
    source.connect(this.processor);
    this.processor.connect(this.inputContext.destination);
  }

  async handleMessage(event) {
    const payload = event.data instanceof Blob
      ? await event.data.text()
      : event.data instanceof ArrayBuffer
        ? new TextDecoder().decode(event.data)
        : event.data;
    const message = JSON.parse(payload);
    // Gemini requires setupComplete before any realtime input (text or audio).
    if (message.setupComplete) {
      this.onStatus?.("Connected — microphone is live");
      this.socket.send(JSON.stringify({ realtimeInput: { text: this.initialMessage } }));
      this.startMicrophone().catch((error) => this.onError?.(error));
      return;
    }
    const content = message.serverContent;
    if (!content) return;
    const text = content.outputTranscription?.text;
    if (text) this.onTranscript?.({ role: this.transcriptRoles.assistant, text });
    const candidateText = content.inputTranscription?.text;
    if (candidateText) this.onTranscript?.({ role: this.transcriptRoles.user, text: candidateText });
    for (const part of content.modelTurn?.parts || []) {
      if (part.inlineData?.mimeType?.startsWith("audio/pcm") && part.inlineData.data) this.playAudio(part.inlineData.data);
    }
  }

  playAudio(base64) {
    // Ignore model chunks that arrive while the candidate is still speaking.
    // This closes the race between locally stopping sources and Gemini ending
    // its already-in-flight server turn.
    if (performance.now() < this.candidateSpeechUntil) return;
    if (!this.outputContext) this.outputContext = new AudioContext({ sampleRate: 24000 });
    if (!this.outputAnalyser) {
      this.outputAnalyser = this.outputContext.createAnalyser();
      this.outputAnalyser.fftSize = 1024;
      this.startOutputMeter();
    }
    if (this.outputContext.state === "suspended") this.outputContext.resume();
    const bytes = base64ToBytes(base64);
    const pcm = new Int16Array(bytes.buffer, bytes.byteOffset, Math.floor(bytes.byteLength / 2));
    const audio = this.outputContext.createBuffer(1, pcm.length, 24000);
    const channel = audio.getChannelData(0);
    for (let i = 0; i < pcm.length; i += 1) channel[i] = pcm[i] / 0x8000;
    const source = this.outputContext.createBufferSource();
    source.buffer = audio;
    source.connect(this.outputContext.destination);
    source.connect(this.outputAnalyser);
    this.playbackSources.add(source);
    source.onended = () => this.playbackSources.delete(source);
    this.nextPlaybackTime = Math.max(this.outputContext.currentTime, this.nextPlaybackTime);
    source.start(this.nextPlaybackTime);
    this.nextPlaybackTime += audio.duration;
  }

  interruptPlayback() {
    for (const source of this.playbackSources) {
      try { source.stop(); } catch { /* Source may have ended between audio frames. */ }
    }
    this.playbackSources.clear();
    this.nextPlaybackTime = this.outputContext?.currentTime || 0;
  }

  // Polls the AI-voice analyser on a rAF cadence (naturally throttled to
  // display refresh) so the orb can react to Gemini's speech, not just the mic.
  startOutputMeter() {
    const timeDomain = new Float32Array(this.outputAnalyser.fftSize);
    const tick = () => {
      if (!this.outputAnalyser) return;
      this.outputAnalyser.getFloatTimeDomainData(timeDomain);
      let sum = 0;
      for (let i = 0; i < timeDomain.length; i += 1) sum += timeDomain[i] * timeDomain[i];
      const level = Math.min(1, Math.sqrt(sum / timeDomain.length) * 4);
      this.onAiVolume?.(level);
      this.onAiPitch?.(estimatePitch(timeDomain, this.outputContext.sampleRate));
      this.outputMeterFrame = requestAnimationFrame(tick);
    };
    this.outputMeterFrame = requestAnimationFrame(tick);
  }

  stop() {
    this.onVolume?.(0);
    this.onAiVolume?.(0);
    if (this.outputMeterFrame) cancelAnimationFrame(this.outputMeterFrame);
    this.outputMeterFrame = null;
    this.outputAnalyser = null;
    this.interruptPlayback();
    this.processor?.disconnect();
    this.stream?.getTracks().forEach((track) => track.stop());
    this.inputContext?.close();
    this.outputContext?.close();
    this.socket?.close();
  }

  sendText(text) {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      throw new Error("The Gemini Live session is not connected.");
    }
    this.socket.send(JSON.stringify({ realtimeInput: { text } }));
  }
}
