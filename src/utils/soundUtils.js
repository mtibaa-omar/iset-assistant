const audioCache = {};

function getAudio(soundFile) {
  if (!audioCache[soundFile]) {
    audioCache[soundFile] = new Audio(`/${soundFile}`);
    audioCache[soundFile].volume = 1.0;
  }
  return audioCache[soundFile];
}

export const SOUNDS = {
  MESSAGE_SENT: "message_sent.mp3",
  MESSAGE_GET: "message_get.mp3",
};

let preloaded = false;
if (typeof window !== "undefined") {
  const enable = () => {
    if (preloaded) return;
    preloaded = true;
    Object.values(SOUNDS).forEach((s) => {
      try { getAudio(s).load(); } catch { /* ignore */ }
    });
    window.removeEventListener("click", enable);
    window.removeEventListener("keydown", enable);
    window.removeEventListener("touchstart", enable);
  };
  window.addEventListener("click", enable);
  window.addEventListener("keydown", enable);
  window.addEventListener("touchstart", enable);
}

const lastPlayTimes = {};
const DEBOUNCE_MS = 800;

export function playSound(soundFile) {
  try {
    const now = Date.now();
    if (now - (lastPlayTimes[soundFile] || 0) < DEBOUNCE_MS) return;
    lastPlayTimes[soundFile] = now;

    const audio = getAudio(soundFile);
    audio.currentTime = 0;
    audio.play().catch((error) => {
      console.debug("Sound playback failed:", error);
    });
  } catch (error) {
    console.debug("Error playing sound:", error);
  }
}
