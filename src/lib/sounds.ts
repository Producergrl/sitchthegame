/**
 * Lightweight Web Audio API sound effects.
 * No external files — pure synthesised audio for instant, zero-latency playback.
 */

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  // Resume if suspended (browser autoplay policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
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
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;

    // Three ascending bell tones (C6 → E6 → G6)
    playTone(ctx, 1047, t, 0.35, 'sine', 0.14);         // C6
    playTone(ctx, 1047, t, 0.35, 'triangle', 0.06);      // shimmer layer
    playTone(ctx, 1319, t + 0.12, 0.35, 'sine', 0.14);   // E6
    playTone(ctx, 1319, t + 0.12, 0.35, 'triangle', 0.06);
    playTone(ctx, 1568, t + 0.24, 0.5, 'sine', 0.16);    // G6 (longer ring)
    playTone(ctx, 1568, t + 0.24, 0.5, 'triangle', 0.07);

    // Subtle sparkle on top
    playTone(ctx, 3136, t + 0.28, 0.3, 'sine', 0.03);    // G7 whisper
  } catch {
    // Audio not available — silent fallback
  }
}

/**
 * Triumphant fanfare — plays when a custom "wow" answer is approved.
 * Brass-like square-wave trumpet motif with a heroic feel.
 */
export function playWowFanfare() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;

    const brass = (freq: number, start: number, dur: number, vol = 0.12) => {
      // Square + sawtooth blend for brass timbre
      playTone(ctx, freq, start, dur, 'square', vol * 0.6);
      playTone(ctx, freq, start, dur, 'sawtooth', vol * 0.4);
      // Subtle octave overtone
      playTone(ctx, freq * 2, start, dur * 0.7, 'sine', vol * 0.08);
    };

    // Heroic trumpet motif: G5 → B5 → D6 → G6 (G major arpeggio)
    brass(784, t, 0.18, 0.13);           // G5  — short pickup
    brass(988, t + 0.15, 0.18, 0.14);    // B5
    brass(1175, t + 0.30, 0.22, 0.15);   // D6
    brass(1568, t + 0.48, 0.55, 0.16);   // G6  — triumphant hold

    // Second trumpet harmony (a third below) on the final note
    brass(1319, t + 0.50, 0.50, 0.10);   // E6 harmony

    // Little sparkle flourish at the end
    playTone(ctx, 2093, t + 0.65, 0.25, 'sine', 0.04);  // C7 shimmer
    playTone(ctx, 2637, t + 0.72, 0.20, 'sine', 0.03);  // E7 sparkle
  } catch {
    // Audio not available — silent fallback
  }
}
