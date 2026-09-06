import { getEffectiveVolume } from "./soundStore.js";

let sharedCtx = null;

function getCtx() {
  if (!sharedCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    sharedCtx = new AudioCtx();
  }
  if (sharedCtx.state === "suspended") {
    sharedCtx.resume();
  }
  return sharedCtx;
}

// Simple synthesized sound effect, so games don't need external audio files.
export function beep({ freq = 880, duration = 0.15, type = "sine" } = {}) {
  const vol = getEffectiveVolume();
  if (vol <= 0) return;

  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = vol * 0.3;

  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;
  osc.start(now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.stop(now + duration);
}

export function playCollectSound() {
  beep({ freq: 1046, duration: 0.12, type: "triangle" });
}

export function playWinSound() {
  beep({ freq: 784, duration: 0.15, type: "triangle" });
  setTimeout(() => beep({ freq: 988, duration: 0.15, type: "triangle" }), 120);
  setTimeout(() => beep({ freq: 1318, duration: 0.25, type: "triangle" }), 240);
}
