export function playSound(soundFile) {
  try {
    const audio = new Audio(`/${soundFile}`);
    audio.volume = 1.0;
    audio.play().catch((error) => {
      console.debug("Sound playback failed:", error);
    });
  } catch (error) {
    console.debug("Error playing sound:", error);
  }
}

export const SOUNDS = {
  MESSAGE_SENT: "message_sent.mp3",
  MESSAGE_GET: "message_get.mp3",
};
