/**
 * Lightweight Web Audio API sound effects.
 * No external files — pure synthesised audio for instant, zero-latency playback.
 */

let audioCtx: AudioContext | null = null;

function getOrCreateCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function withReadyContext(playback: (ctx: AudioContext, startTime: number) => void) {
  try {
    const ctx = getOrCreateCtx();
    const startPlayback = () => playback(ctx, ctx.currentTime);

    if (ctx.state === 'running') {
      startPlayback();
      return;
    }

    void ctx.resume().then(() => {
      startPlayback();
    }).catch(() => {
      // Audio not available — silent fallback
    });
  } catch {
    // Audio not available — silent fallback
  }
}

export function primeSoundEffects() {
  try {
    const ctx = getOrCreateCtx();

    const warmUp = () => {
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();

      source.buffer = buffer;
      gain.gain.value = 0.0001;

      source.connect(gain);
      gain.connect(ctx.destination);

      source.start();
      source.stop(ctx.currentTime + 0.001);
    };

    if (ctx.state === 'running') {
      warmUp();
      return;
    }

    void ctx.resume().then(() => {
      warmUp();
    }).catch(() => {
      // Audio not available — silent fallback
    });
  } catch {
    // Audio not available — silent fallback
  }
}

/* ── Helper: play a note ── */
function playTone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.15,
  detune = 0,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  osc.connect(gain);
  gain.connect(ctx.destination);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

/* ═══════════════════════════════════════════
   Public sound effects
   ═══════════════════════════════════════════ */

/**
 * Pleasant ascending chime — plays on correct answer.
 * Three bright bell-like tones rising in pitch.
 */
export function playCorrectChime() {
  withReadyContext((ctx, t) => {
    playTone(ctx, 1047, t, 0.35, 'sine', 0.14);
    playTone(ctx, 1047, t, 0.35, 'triangle', 0.06);
    playTone(ctx, 1319, t + 0.12, 0.35, 'sine', 0.14);
    playTone(ctx, 1319, t + 0.12, 0.35, 'triangle', 0.06);
    playTone(ctx, 1568, t + 0.24, 0.5, 'sine', 0.16);
    playTone(ctx, 1568, t + 0.24, 0.5, 'triangle', 0.07);
    playTone(ctx, 3136, t + 0.28, 0.3, 'sine', 0.03);
  });
}

/**
 * Buzzer + descending "oops" tone — plays on wrong answer.
 * Short harsh buzz followed by a sad descending slide.
 */
export function playWrongBuzzer() {
  withReadyContext((ctx, t) => {
    playTone(ctx, 110, t, 0.18, 'square', 0.16);
    playTone(ctx, 110, t, 0.18, 'sawtooth', 0.08);
    playTone(ctx, 330, t + 0.20, 0.22, 'sine', 0.12);
    playTone(ctx, 262, t + 0.36, 0.22, 'sine', 0.12);
    playTone(ctx, 220, t + 0.52, 0.35, 'sine', 0.10);
    playTone(ctx, 220, t + 0.52, 0.35, 'triangle', 0.05);
  });
}

export function playWowFanfare() {
  withReadyContext((ctx, t) => {
    const brass = (freq: number, start: number, dur: number, vol = 0.12) => {
      playTone(ctx, freq, start, dur, 'square', vol * 0.6);
      playTone(ctx, freq, start, dur, 'sawtooth', vol * 0.4);
      playTone(ctx, freq * 2, start, dur * 0.7, 'sine', vol * 0.08);
    };

    brass(784, t, 0.18, 0.13);
    brass(988, t + 0.15, 0.18, 0.14);
    brass(1175, t + 0.30, 0.22, 0.15);
    brass(1568, t + 0.48, 0.55, 0.16);
    brass(1319, t + 0.50, 0.50, 0.10);
    playTone(ctx, 2093, t + 0.65, 0.25, 'sine', 0.04);
    playTone(ctx, 2637, t + 0.72, 0.20, 'sine', 0.03);
  });
}
