/**
 * @class SoundManager
 * Manages music and sound effects preferences and handles audio creation/playback.
 */
class SoundManager {
  /**
   * Creates a new SoundManager instance.
   */
  constructor() {
    const storedSound = localStorage.getItem("soundEnabled");
    this.soundEnabled = storedSound !== null ? storedSound === "true" : true;
    const storedMusicMuted = localStorage.getItem("musicMuted");
    this.musicMuted =
      storedMusicMuted !== null ? storedMusicMuted === "true" : false;
    const storedSfxMuted = localStorage.getItem("sfxMuted");
    this.sfxMuted = storedSfxMuted !== null ? storedSfxMuted === "true" : false;

    // Audio objects will be initialized via initAudio()
    this.backgroundMusic = null;
    this.characterHurtSound = null;
    this.characterDiesSound = null;
    this.jumpSound = null;
    this.chickenDeathSound = null;
    this.endbossDeathSound = null;
    this.winSound = null;
    this.coinSound = null;
    this.bottleSound = null;
    this.levelCompleteSound = null;
    this.bottleCrackSound = null;
  }

  /**
   * Initializes all audio objects required for the game.
   */
  initAudio() {
    this.backgroundMusic = this.createAudio(
      "audio/backgroundmusic.mp3",
      0.05,
      true
    );
    this.characterHurtSound = this.createAudio("audio/hit.wav", 0.05);
    this.characterDiesSound = this.createAudio(
      "audio/character-dies.mp3",
      0.05
    );
    this.jumpSound = this.createAudio("audio/jump.wav", 0.05);
    this.chickenDeathSound = this.createAudio("audio/chicken-cries.mp3", 0.05);
    this.endbossDeathSound = this.createAudio("audio/endboss-cries.mp3", 0.05);
    this.winSound = this.createAudio("audio/win-game.mp3", 0.02);
    this.coinSound = this.createAudio("audio/coin.mp3", 0.05);
    this.bottleSound = this.createAudio("audio/bottle.wav", 0.05);
    this.levelCompleteSound = this.createAudio(
      "audio/level-complete.mp3",
      0.05
    );
    this.bottleCrackSound = this.createAudio("audio/explosion.mp3", 0.05);
    this.updateMuteStates();
  }

  /**
   * Updates the muted property of all audio objects based on current settings.
   */
  updateMuteStates() {
    if (this.backgroundMusic) this.backgroundMusic.muted = this.musicMuted;
    if (this.characterHurtSound) this.characterHurtSound.muted = this.sfxMuted;
    if (this.characterDiesSound) this.characterDiesSound.muted = this.sfxMuted;
    if (this.jumpSound) this.jumpSound.muted = this.sfxMuted;
    if (this.chickenDeathSound) this.chickenDeathSound.muted = this.sfxMuted;
    if (this.endbossDeathSound) this.endbossDeathSound.muted = this.sfxMuted;
    if (this.winSound) this.winSound.muted = this.sfxMuted;
    if (this.coinSound) this.coinSound.muted = this.sfxMuted;
    if (this.bottleSound) this.bottleSound.muted = this.sfxMuted;
    if (this.levelCompleteSound) this.levelCompleteSound.muted = this.sfxMuted;
    if (this.bottleCrackSound) this.bottleCrackSound.muted = this.sfxMuted;
  }

  /**
   * Toggles the global sound setting.
   */
  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem("soundEnabled", this.soundEnabled);
    console.log(`Sound is now: ${this.soundEnabled ? "ON" : "OFF"}`);
  }

  /**
   * Toggles the music mute setting and updates audio objects.
   */
  toggleMusic() {
    this.musicMuted = !this.musicMuted;
    localStorage.setItem("musicMuted", this.musicMuted);
    console.log(`Music is now: ${this.musicMuted ? "MUTED" : "UNMUTED"}`);
    this.updateMuteStates();
  }

  /**
   * Toggles the sound effects mute setting and updates audio objects.
   */
  toggleSfx() {
    this.sfxMuted = !this.sfxMuted;
    localStorage.setItem("sfxMuted", this.sfxMuted);
    console.log(`SFX is now: ${this.sfxMuted ? "MUTED" : "UNMUTED"}`);
    this.updateMuteStates();
  }

  /**
   * Checks if sound playback is allowed.
   * @returns {boolean} True if sound is enabled, false otherwise.
   */
  isSoundAllowed() {
    return this.soundEnabled;
  }

  /**
   * Plays the specified audio if conditions are met.
   * @param {HTMLAudioElement} audio - The audio element to play.
   * @param {boolean} isMusic - Indicates if the audio is music.
   */
  playSound(audio, isMusic = false) {
    if (!this.soundEnabled) return;
    if (isMusic && this.musicMuted) return;
    if (!isMusic && this.sfxMuted) return;
    audio.currentTime = 0;
    audio.play();
  }

  /**
   * Creates a new audio element with the given source, volume, and loop setting.
   * @param {string} src - The source path of the audio file.
   * @param {number} volume - The volume level.
   * @param {boolean} loop - Whether the audio should loop.
   * @returns {HTMLAudioElement} The created audio element.
   */
  createAudio(src, volume = 1, loop = false) {
    let audioObj = new Audio(src);
    audioObj.volume = volume;
    audioObj.loop = loop;
    audioObj.preload = "auto";
    audioObj.load();
    return audioObj;
  }
}
