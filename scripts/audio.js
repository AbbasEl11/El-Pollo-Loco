/**
 * Plays the level-complete sound from the beginning using SoundManager.
 */
function playLevelCompleteSound() {
  if (window.world && world.soundManager) {
    world.soundManager.levelCompleteSound.currentTime = 0;
    world.soundManager.playSound(world.soundManager.levelCompleteSound, false);
  }
}

// Audio & Toggle Functions

/**
 * Toggles background music on/off, updates the icon,
 * and persists the setting.
 */
function toggleMusic() {
  musicMuted = !musicMuted;
  localStorage.setItem("musicMuted", musicMuted);
  let musicIcon = document.getElementById("music-image");
  if (musicMuted) {
    musicIcon.src = "./img/SquareButtons/MUTEDMusicSquareButton.png";
  } else {
    musicIcon.src = "./img/SquareButtons/MusicSquareButton.png";
    toggleMutedSound();
  }
  if (window.world && world.soundManager) {
    world.soundManager.musicMuted = musicMuted;
    world.soundManager.updateMuteStates();
  }
}

/**
 * Toggles SFX on/off, updates the icon,
 * and synchronizes that with the World instance.
 */
function toggleSfx() {
  sfxMuted = !sfxMuted;
  localStorage.setItem("sfxMuted", sfxMuted);
  updateSfxImage();
  if (window.world && world.soundManager) {
    world.soundManager.sfxMuted = sfxMuted;
    world.soundManager.updateMuteStates();
  }
}

/** Updates the SFX icon in the DOM. */
function updateSfxImage() {
  let sfxIcon = document.getElementById("sfx-image");
  if (sfxMuted) {
    sfxIcon.src = "./img/SquareButtons/MUTEDAudioSquareButton.png";
  } else {
    sfxIcon.src = "./img/SquareButtons/AudioSquareButton.png";
    toggleMutedSound();
  }
}

/**
 * Synchronizes the SFX mute state for all audio objects via SoundManager.
 */
function updateSfx() {
  if (window.world && world.soundManager) {
    world.soundManager.sfxMuted = sfxMuted;
    world.soundManager.updateMuteStates();
  }
}

/**
 * Plays a brief click sound for button interactions.
 */
function toggleMutedSound() {
  let clickSound = new Audio("audio/button-click.mp3");
  clickSound.volume = 0.5;
  clickSound.play();
}

/**
 * Ensures the World instance uses the same audio mute settings
 * as the UI by delegating to the SoundManager.
 */
function setupAllAudio() {
  if (window.world && world.soundManager) {
    world.soundManager.musicMuted = musicMuted;
    world.soundManager.sfxMuted = sfxMuted;
    world.soundManager.updateMuteStates();
  }
}

/**
 * Retrieves a boolean mute state from localStorage by the specified key.
 * If no value is found, returns false.
 * @param {string} key - The localStorage key to retrieve the mute state from.
 * @returns {boolean} - True if the stored value is "true", otherwise false.
 */
function getMutedFromLS(key) {
  let stored = localStorage.getItem(key);
  return stored !== null ? stored === "true" : false;
}

/**
 * Updates an image element's `src` based on the given condition.
 * @param {string} id - The ID of the image element in the DOM.
 * @param {boolean} condition - If true, use `srcMuted`; otherwise `srcUnmuted`.
 * @param {string} srcMuted - The image source for the muted state.
 * @param {string} srcUnmuted - The image source for the unmuted state.
 */
function updateIcon(id, condition, srcMuted, srcUnmuted) {
  let icon = document.getElementById(id);
  if (icon) icon.src = condition ? srcMuted : srcUnmuted;
}

/**
 * Loads mute states from localStorage, updates icons, and syncs with SoundManager.
 */
function initAudioUI() {
  musicMuted = getMutedFromLS("musicMuted");
  sfxMuted = getMutedFromLS("sfxMuted");
  updateIcon(
    "music-image",
    musicMuted,
    "./img/SquareButtons/MUTEDMusicSquareButton.png",
    "./img/SquareButtons/MusicSquareButton.png"
  );
  updateIcon(
    "sfx-image",
    sfxMuted,
    "./img/SquareButtons/MUTEDAudioSquareButton.png",
    "./img/SquareButtons/AudioSquareButton.png"
  );
  setupAllAudio();
}

window.addEventListener("DOMContentLoaded", initAudioUI);
