import { getVolume, setVolume, isMuted, setMuted, getEffectiveVolume } from "./soundStore.js";

/**
 * Mounts the shared top bar (sound toggle, volume settings, optional exit-to-hub button)
 * used consistently across the hub page and every game page.
 *
 * @param {Object} options
 * @param {boolean} [options.showExit] - show the "back to hub" button (games only)
 * @param {string} [options.exitHref] - where the exit button navigates to
 * @param {(volume:number)=>void} [options.onVolumeChange] - called with effective volume (0..1)
 *   whenever mute/volume changes, so a game can update its own audio in real time.
 */
export function mountShellTopbar({ showExit = false, exitHref = "/", onVolumeChange } = {}) {
  const bar = document.createElement("div");
  bar.className = "shell-topbar";

  const settingsBtn = document.createElement("button");
  settingsBtn.className = "shell-btn";
  settingsBtn.textContent = "⚙️";
  settingsBtn.setAttribute("aria-label", "설정");

  const soundBtn = document.createElement("button");
  soundBtn.className = "shell-btn";
  soundBtn.setAttribute("aria-label", "소리 켜기/끄기");

  bar.appendChild(settingsBtn);
  bar.appendChild(soundBtn);

  if (showExit) {
    const exitBtn = document.createElement("button");
    exitBtn.className = "shell-btn shell-btn--exit";
    exitBtn.textContent = "🏠";
    exitBtn.setAttribute("aria-label", "홈으로 나가기");
    exitBtn.addEventListener("click", () => {
      window.location.href = exitHref;
    });
    bar.appendChild(exitBtn);
  }

  const panel = document.createElement("div");
  panel.className = "shell-settings-panel";

  const label = document.createElement("label");
  label.textContent = "소리 크기";

  const range = document.createElement("input");
  range.type = "range";
  range.min = "0";
  range.max = "100";
  range.value = String(getVolume());

  panel.appendChild(label);
  panel.appendChild(range);

  document.body.appendChild(bar);
  document.body.appendChild(panel);

  function refreshSoundIcon() {
    soundBtn.textContent = isMuted() ? "🔇" : "🔊";
  }

  function notifyVolumeChange() {
    if (typeof onVolumeChange === "function") {
      onVolumeChange(getEffectiveVolume());
    }
  }

  refreshSoundIcon();

  settingsBtn.addEventListener("click", () => {
    panel.classList.toggle("open");
  });

  soundBtn.addEventListener("click", () => {
    setMuted(!isMuted());
    refreshSoundIcon();
    notifyVolumeChange();
  });

  range.addEventListener("input", () => {
    const value = parseInt(range.value, 10);
    setVolume(value);
    if (value > 0 && isMuted()) {
      setMuted(false);
      refreshSoundIcon();
    }
    notifyVolumeChange();
  });

  return { refreshSoundIcon };
}
