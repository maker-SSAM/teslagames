const VOLUME_KEY = "teslagame:volume";
const MUTED_KEY = "teslagame:muted";

export function getVolume() {
  const raw = localStorage.getItem(VOLUME_KEY);
  const value = raw === null ? 80 : parseInt(raw, 10);
  return Number.isFinite(value) ? value : 80;
}

export function setVolume(value) {
  localStorage.setItem(VOLUME_KEY, String(Math.max(0, Math.min(100, value))));
}

export function isMuted() {
  return localStorage.getItem(MUTED_KEY) === "1";
}

export function setMuted(muted) {
  localStorage.setItem(MUTED_KEY, muted ? "1" : "0");
}

export function getEffectiveVolume() {
  return isMuted() ? 0 : getVolume() / 100;
}
