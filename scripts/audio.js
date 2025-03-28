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
