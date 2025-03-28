/*************************************************************
 * Main script for UI control, level switching, etc.
 *************************************************************/

// Global Variables
let canvas;
let world;
let keyboard = new Keyboard();
let currentLevel = 1;
let musicMuted = false;
let sfxMuted = false;

// Initialization Functions

/**
 * Initializes the game, references the canvas,
 * and creates a World instance.
 */
function init() {
  let gameCanvas = document.getElementById("canvas");
  world = new World(gameCanvas, keyboard);
}

/**
 * Starts the game, hides the menu overlay,
 * shows the canvas and title, and loads the first level.
 */
function startGame() {
  document.getElementById("overlay-menu").classList.add("hidden");
  document.getElementById("canvas").style.display = "block";
  let title = document.querySelector("h1");
  if (title) title.style.display = "block";

  canvas = document.getElementById("canvas");
  currentLevel = 3;
  world = new World(canvas, keyboard);
  setupAllAudio();
  let levelData = loadCurrentLevel();
  world.loadLevelData(levelData, currentLevel);

  if (!musicMuted && world.soundManager) {
    world.soundManager.playSound(world.soundManager.backgroundMusic, true);
  }
}

/**
 * Starts again from Level 1. Stops the old World instance,
 * hides Game Over overlays, shows canvas and title,
 * and reloads Level 1.
 */
function restartGame() {
  if (world) {
    world.stopGame();
  }
  document.getElementById("overlay-gameover").classList.add("hidden");
  document.getElementById("overlay-win").classList.add("hidden");
  document.getElementById("canvas").style.display = "block";
  let title = document.querySelector("h1");
  if (title) {
    title.style.display = "block";
  }

  currentLevel = 1;
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  setupAllAudio();
  let levelData = loadCurrentLevel();
  world.loadLevelData(levelData, currentLevel);
}

// Level Management Functions

/**
 * Loads level data depending on the current level index.
 * @returns {Level} - The appropriate level object
 */
function loadCurrentLevel() {
  if (currentLevel === 1) {
    return createLevel1();
  } else if (currentLevel === 2) {
    return createLevel2();
  }
  return createLevel3();
}

/**
 * Moves on to the next level after the current one is completed,
 * temporarily stores stats, shows an overlay, and switches.
 */
function nextLevel() {
  let stats = saveCurrentStats();
  showLevelCompleteOverlay(currentLevel);
  setTimeout(() => {
    hideLevelCompleteOverlay();
    currentLevel++;
    if (currentLevel > 3) return;
    playLevelCompleteSound();
    world.loadLevelData(loadCurrentLevel(), currentLevel);
    restoreStats(stats);
  }, 1000);
}

/**
 * Saves energy, coins, and bottles in an object,
 * so we can restore them after switching levels.
 */
function saveCurrentStats() {
  return {
    oldEnergy: world.character.energy,
    oldCoins: world.coinsCollected,
    oldBottles: world.bottlesCollected,
  };
}

/**
 * Restores the saved values (e.g., after a level switch)
 * and updates the status bars.
 */
function restoreStats(stats) {
  world.character.energy = stats.oldEnergy;
  world.coinsCollected = stats.oldCoins;
  world.bottlesCollected = stats.oldBottles;
  world.statusBar.setPercentage(stats.oldEnergy);
  world.coinBar.setPercentage(calcCoinPercentage(stats.oldCoins));
  world.bottleBar.setPercentage(calcBottlePercentage(stats.oldBottles));
}

// Overlay Functions

/** Opens the settings overlay. */
function openSettings() {
  document.getElementById("overlay-settings").classList.remove("hidden");
}

/** Closes the settings overlay. */
function closeSettings() {
  document.getElementById("overlay-settings").classList.add("hidden");
}

/** Opens the help overlay with info about controls and rules. */
function openHelp() {
  document.getElementById("overlay-help").classList.remove("hidden");
}

/** Closes the help overlay. */
function closeHelp() {
  document.getElementById("overlay-help").classList.add("hidden");
}

/** Opens the impressum overlay. */
function openImpressum() {
  document.getElementById("overlay-impressum").classList.remove("hidden");
}

/** Closes the impressum overlay. */
function closeImpressum() {
  document.getElementById("overlay-impressum").classList.add("hidden");
}

/**
 * Displays an overlay informing that a level has been successfully completed.
 * @param {number} levelNumber
 */
function showLevelCompleteOverlay(levelNumber) {
  let overlay = document.getElementById("overlay-levelcomplete");
  if (!overlay) {
    console.warn("No #overlay-levelcomplete found in HTML!");
    return;
  }
  overlay.innerHTML = `<h1>Level ${levelNumber} Completed!</h1>`;
  overlay.classList.remove("hidden");
}

/** Hides the "Level Complete" overlay. */
function hideLevelCompleteOverlay() {
  let overlay = document.getElementById("overlay-levelcomplete");
  if (overlay) {
    overlay.classList.add("hidden");
  }
}

/**
 * Ends the current game, stops music and intervals,
 * and returns to the main menu.
 */
function quitGame() {
  if (world) {
    finishGame();
  }
  resetPauseIcons();
  clearAllIntervals();
  document.getElementById("canvas").style.display = "none";
  document.getElementById("overlay-menu").classList.remove("hidden");
}

/**
 * Stops music and intervals, sets the world to null,
 * and removes the pause overlay.
 */
function finishGame() {
  world.stopGame();
  if (world.soundManager && world.soundManager.backgroundMusic) {
    world.soundManager.backgroundMusic.pause();
    world.soundManager.backgroundMusic.currentTime = 0;
    world.soundManager.backgroundMusic.loop = false;
  }
  world = null;
  window.paused = false;
  pauseOverlay(false);
}

/**
 * Goes back to the main menu, hides overlays, and
 * conceals the canvas.
 */
function goToMenu() {
  document.getElementById("overlay-gameover").classList.add("hidden");
  document.getElementById("overlay-win").classList.add("hidden");
  document.getElementById("canvas").style.display = "none";
  let title = document.querySelector("h1");
  if (title) {
    title.style.display = "none";
  }
  document.getElementById("overlay-menu").classList.remove("hidden");
}

/**
 * Toggles fullscreen mode on or off.
 * If fullscreen is not active, it calls requestFullscreen();
 * otherwise, it calls exitFullscreen(). Also blurs the fullscreen button.
 */
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    requestFullscreen();
  } else {
    exitFullscreen();
  }
  document.getElementById("btn-fullscreen").blur();
}

/**
 * Requests fullscreen mode for the document element.
 * Updates the canvas styling upon success.
 * @returns {Promise<void>}
 */
function requestFullscreen() {
  return document.documentElement
    .requestFullscreen()
    .then(() => {
      document.getElementById("canvas").classList.add("canvas-fullscreen");
      document.getElementById("canvas").classList.remove("canvas");
    })
    .catch(() => {});
}

/**
 * Exits fullscreen mode.
 * Updates the canvas styling upon exit.
 * @returns {Promise<void>}
 */
function exitFullscreen() {
  return document
    .exitFullscreen()
    .then(() => {
      document.getElementById("canvas").classList.add("canvas");
      document.getElementById("canvas").classList.remove("canvas-fullscreen");
    })
    .catch(() => {});
}

// Add an event listener to update the canvas classes if the user exits fullscreen using the ESC key.
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    document.getElementById("canvas").classList.add("canvas");
    document.getElementById("canvas").classList.remove("canvas-fullscreen");
  }
});

/**
 * Activates or deactivates game pause.
 * Also updates button display accordingly.
 */
function togglePause() {
  let pauseBtn = document.getElementById("btn-pause");
  let pauseContent = document.getElementById("pause-content");
  let playContent = document.getElementById("play-content");
  window.paused = !window.paused;
  world.paused = window.paused;
  managePauseState(pauseBtn, pauseContent, playContent);
}

/**
 * Places or removes a pause overlay depending on the current pause state.
 * @param {boolean} isPaused
 */
function pauseOverlay(isPaused) {
  let cContainer = document.querySelector(".canvas-container");
  if (!cContainer) return;
  if (isPaused) {
    cContainer.classList.add("paused-overlay");
  } else {
    cContainer.classList.remove("paused-overlay");
  }
}

/**
 * Adjusts the overlay and button states depending on whether the game is paused.
 * @param {HTMLElement} pauseBtn
 * @param {HTMLElement} pauseContent
 * @param {HTMLElement} playContent
 */
function managePauseState(pauseBtn, pauseContent, playContent) {
  if (window.paused) {
    setPauseOverlay(pauseBtn, pauseContent, playContent);
  } else {
    resumGameinPause(pauseBtn, pauseContent, playContent);
  }
}

function resumGameinPause(pauseBtn, pauseContent, playContent) {
  world.resumeGame();
  pauseOverlay(false);
  playContent.style.display = "none";
  pauseContent.style.display = "inline-flex";
  pauseBtn.blur();
}

function setPauseOverlay(pauseBtn, pauseContent, playContent) {
  world.pauseGame();
  pauseOverlay(true);
  pauseContent.style.display = "none";
  playContent.style.display = "inline-flex";
  pauseBtn.blur();
}
/**
 * Resets the pause/play icons to default.
 */
function resetPauseIcons() {
  let pauseContent = document.getElementById("pause-content");
  let playContent = document.getElementById("play-content");
  if (pauseContent && playContent) {
    pauseContent.style.display = "inline-flex";
    playContent.style.display = "none";
  }
}

/**
 * Clears all active intervals in a large range
 * to avoid conflicts on restarts.
 */
function clearAllIntervals() {
  for (let i = 1; i < 9999; i++) {
    clearInterval(i);
  }
}

/**
 * Checks the screen orientation and displays a "Rotate Device" overlay
 * if the device is in portrait mode.
 */
function rotateCanvas() {
  let overlay = document.getElementById("overlay-rotate");
  if (!overlay) return;
  if (window.innerWidth > window.innerHeight) {
    overlay.classList.add("hidden");
  } else {
    overlay.classList.remove("hidden");
  }
}

window.addEventListener("load", rotateCanvas);
window.addEventListener("resize", rotateCanvas);
