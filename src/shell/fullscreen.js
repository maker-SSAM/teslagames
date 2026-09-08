/**
 * Best-effort fullscreen request. Must be called synchronously from within
 * a user gesture handler (click/tap) — browsers silently reject fullscreen
 * requests made outside one. Failures (unsupported, not permitted in an
 * iframe, no gesture, etc.) are swallowed since fullscreen is a nice-to-have.
 */
export function enterFullscreen(target = document.documentElement) {
  const request =
    target.requestFullscreen ||
    target.webkitRequestFullscreen ||
    target.msRequestFullscreen;
  if (!request) return;
  try {
    const result = request.call(target);
    if (result && typeof result.catch === "function") {
      result.catch(() => {});
    }
  } catch {
    // ignore
  }
}

/**
 * Fullscreen requires a user gesture, and browsers drop fullscreen state on
 * a full page navigation — so arriving at a game page (linked from the hub)
 * can never auto-enter fullscreen. Instead, show a tap-to-start overlay so
 * the tap itself is the gesture that unlocks fullscreen for this page.
 * No-op if the page somehow arrived already fullscreen.
 */
export function mountFullscreenGate({ label = "▶ 시작하기" } = {}) {
  if (document.fullscreenElement) return;

  const overlay = document.createElement("div");
  overlay.className = "fullscreen-gate";

  const button = document.createElement("button");
  button.className = "fullscreen-gate__button";
  button.textContent = label;
  button.addEventListener("click", () => {
    enterFullscreen();
    overlay.remove();
  });

  overlay.appendChild(button);
  document.body.appendChild(overlay);
}
