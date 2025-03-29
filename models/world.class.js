/*************************************************************
 * Class World
 * Central object that bundles game logic, level data, audio,
 * rendering, and game loops.
 *************************************************************/
class World {
  /** @type {HTMLCanvasElement} */ canvas;
  /** @type {CanvasRenderingContext2D} */ ctx;
  /** @type {Keyboard} */ keyboard;
  /** @type {Character} */ character = new Character();
  /** @type {Level|null} */ level = null;
  /** @type {number} */ currentLevelNumber;
  /** @type {number} */ camera_x = 0;
  /** @type {StatusBar} */ statusBar = new HealthStatusBar();
  /** @type {BossStatusBar} */ endBossBar = new EndbossStatusBar();
  /** @type {CoinBar} */ coinBar = new CoinStatusBar();
  /** @type {BottleBar} */ bottleBar = new BottleStatusBar();
  /** @type {number} */ coinsCollected = 0;
  /** @type {number} */ bottlesCollected = 0;
  /** @type {ThrowableObject[]} */ throwableObjects = [];
  /** @type {boolean} */ paused = false;
  /** @type {boolean} */ levelComplete = false;
  /** @type {boolean} */ gameOverShown = false;
  /** @type {number|undefined} */ runInterval;
  /** @type {number|undefined} */ animationFrameId;
  soundManager;

  /**
   * Creates a new World instance. Initializes audio, draws the canvas, and starts the update loop.
   * @param {HTMLCanvasElement} canvas - The game canvas.
   * @param {Keyboard} keyboard - The keyboard input handler.
   */
  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.keyboard = keyboard;
    this.soundManager = new SoundManager();
    this.soundManager.initAudio();
    if (!this.soundManager.musicMuted) {
      this.soundManager.playSound(this.soundManager.backgroundMusic, true);
    }
    this.lastBottleThrow = 0; // Merkt sich den Zeitpunkt
    this.throwCooldown = 1000; // 1 Sekunde Cooldown
    this.setWorld();
    this.draw();
    this.run();
  }

  /**
   * Main drawing loop. Clears the canvas, renders all objects, and requests the next animation frame.
   */
  draw() {
    this.clearCanvas();
    this.drawScene();
    this.animationFrameId = requestAnimationFrame(() => this.draw());
  }

  /**
   * Clears the entire canvas.
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws the game scene in the correct order.
   */
  drawScene() {
    if (!this.level) return;
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.drawLevelObjects();
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.addToMap(this.coinBar);
    this.addToMap(this.bottleBar);
    this.ctx.translate(this.camera_x, 0);
    this.ifVisibleBossBar();
    this.ctx.translate(-this.camera_x, 0);
  }

  drawLevelObjects() {
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addToMap(this.character);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
  }

  /**
   * Iterates through an array of objects and calls addToMap for each.
   * @param {DrawableObject[]} objects - The array of objects to draw.
   */
  addObjectsToMap(objects) {
    objects.forEach((obj) => this.addToMap(obj));
  }

  /**
   * Draws a single object. Flips the canvas if the object is facing the other direction.
   * @param {DrawableObject} mo - The object to draw.
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Flips the canvas horizontally for objects facing left.
   * @param {MovableObject} mo - The movable object.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = -mo.x;
  }

  /**
   * Restores the canvas context after flipping.
   * @param {MovableObject} mo - The movable object.
   */
  flipImageBack(mo) {
    mo.x = -mo.x;
    this.ctx.restore();
  }

  /**
   * If an end boss exists, resets the camera for proper rendering of the boss bar.
   */
  ifVisibleBossBar() {
    let endBoss = this.findEndBoss();
    if (endBoss) {
      this.ctx.save();
      this.ctx.translate(-this.camera_x, 0);
      this.addToMap(this.endBossBar);
      this.ctx.restore();
    }
  }

  /**
   * Searches for an Endboss in the enemies list.
   * @returns {Endboss|null} The found end boss, or null if not present.
   */
  findEndBoss() {
    if (!this.level) return null;
    return this.level.enemies.find((enemy) => enemy instanceof Endboss) || null;
  }

  /**
   * Registers the world in the character.
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Loads new level data, resets the camera and character positions, and clears throwable objects.
   * @param {Level} newLevel - The new level data.
   * @param {number} levelNumber - The level number.
   */
  loadLevelData(newLevel, levelNumber) {
    this.level = newLevel;
    this.currentLevelNumber = levelNumber;
    this.levelComplete = false;
    this.throwableObjects = [];
    this.character.x = 0;
    this.character.y = 80;
    this.camera_x = 0;
  }

  /**
   * Main game loop that checks collisions and events.
   */
  run() {
    this.runInterval = setInterval(() => {
      if (!this.paused && this.level) {
        detectEnemyCollisions(this);
        detectThrowableCollisions(this);
        detectCoinCollisions(this);
        detectBottleItemCollisions(this);
        this.checkThrowObjects();
        this.levelEndCheck();
      }
    }, 100);
  }

  /**
   * Pauses the game, stopping intervals and enemy processes.
   */
  pauseGame() {
    this.paused = true;
    if (this.runInterval) {
      clearInterval(this.runInterval);
      this.runInterval = null;
    }
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.character?.stopIntervals && this.character.stopIntervals();
    this.stopEnemies();
  }

  /**
   * Resumes the game, reactivating intervals and enemy animations.
   */
  resumeGame() {
    this.paused = false;
    this.character?.resumeIntervals && this.character.resumeIntervals();
    this.level?.enemies?.forEach(
      (enemy) => enemy.resumeIntervals && enemy.resumeIntervals()
    );
    if (!this.animationFrameId) {
      this.animationFrameId = requestAnimationFrame(() => this.draw());
    }
    if (!this.runInterval) {
      this.runInterval = setInterval(() => {
        this.run();
      }, 200);
    }
  }

  /**
   * Stops the game, intervals, and resets the background music.
   */
  stopGame() {
    if (this.runInterval !== undefined) {
      clearInterval(this.runInterval);
    }
    if (this.animationFrameId !== undefined) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.character?.stopIntervals && this.character.stopIntervals();
    this.stopEnemies();
    if (this.soundManager.backgroundMusic) {
      this.soundManager.backgroundMusic.pause();
      this.soundManager.backgroundMusic.currentTime = 0;
    }
  }

  /**
   * Stops all enemy intervals.
   */
  stopEnemies() {
    if (this.level?.enemies) {
      this.level.enemies.forEach((enemy) => {
        enemy.stopIntervals && enemy.stopIntervals();
      });
    }
  }

  /**
   * Checks if the throw key is pressed and if bottles are available to throw.
   */
  checkThrowObjects() {
    if (this.level && this.keyboard.D && this.bottlesCollected > 0) {
      this.throwBottle();
    }
  }

  /**
   * Creates and throws a bottle, updating the bottle status.
   */
  throwBottle() {
    if (this.isOnCooldown()) return;
    if (this.character.otherDirection) return;
    this.lastBottleThrow = Date.now();
    let bottle = this.createRightBottle();
    this.throwableObjects.push(bottle);
    this.bottlesCollected--;
    let perc = this.bottlesCollected * 20;
    if (perc < 0) perc = 0;
    this.bottleBar.setPercentage(perc);
  }

  /**
   * Checks whether the bottle throw is still on cooldown.
   *
   * @returns {boolean} True if the cooldown period has not yet elapsed, false otherwise.
   */
  isOnCooldown() {
    return Date.now() - this.lastBottleThrow < this.throwCooldown;
  }

  /**
   * Creates a new bottle object that is thrown to the right.
   * The initial position is set relative to the character's position, and its horizontal speed is set.
   *
   * @returns {ThrowableObject} The newly created bottle object.
   */
  createRightBottle() {
    let bottle = new ThrowableObject(
      this.character.x + 50,
      this.character.y + 100,
      this
    );
    bottle.speedX = 10;
    return bottle;
  }

  /**
   * Removes a thrown bottle from the throwable objects array.
   * @param {ThrowableObject} bottle - The bottle to remove.
   */
  removeThrowableObject(bottle) {
    let index = this.throwableObjects.indexOf(bottle);
    if (index > -1) {
      this.throwableObjects.splice(index, 1);
    }
  }

  /**
   * Handles collision with a chicken enemy, playing the death sound and animation.
   * @param {chicken|SmallChicken} chicken - The chicken enemy to kill.
   */
  killChicken(chicken) {
    this.soundManager.playSound(this.soundManager.chickenDeathSound, false);
    chicken.isDeadChicken = true;
    chicken.playDeadAnimation();
    setTimeout(() => {
      let index = this.level.enemies.indexOf(chicken);
      if (index >= 0) {
        this.level.enemies.splice(index, 1);
      }
    }, 250);
  }

  /**
   * Handles collision with the end boss, playing death sounds and animations, and ending the game.
   * @param {Endboss} endBoss - The end boss to kill.
   */
  killEndboss(endBoss) {
    this.soundManager.playSound(this.soundManager.endbossDeathSound, false);
    endBoss.playDeadAnimation();
    setTimeout(() => {
      endBoss.sinkEndboss();
      setTimeout(() => {
        let index = this.level.enemies.indexOf(endBoss);
        if (index >= 0) {
          this.level.enemies.splice(index, 1);
        }
        this.stopGame();
        this.showWinScreen();
      }, 2000);
    }, 500);
  }

  /**
   * Checks if the current level is complete. If the character reaches
   * the level end, plays the level complete sound, marks the level complete,
   * and shows the overlay before moving to the next level.
   *
   * @returns {void}
   */
  levelEndCheck() {
    if (!this.level || this.levelComplete) return;
    if (this.character.x >= this.level.level_end_x) {
      this.soundManager.levelCompleteSound.currentTime = 0;
      this.soundManager.playSound(this.soundManager.levelCompleteSound, false);
      this.levelComplete = true;
      this.handleLevelCompleteOverlay();
    }
  }

  /**
   * Displays the level complete overlay with a message, then hides it
   * after 1 second and proceeds to the next level.
   *
   * @returns {void}
   */
  handleLevelCompleteOverlay() {
    let overlayLC = document.getElementById("overlay-levelcomplete");
    if (overlayLC) {
      overlayLC.innerHTML = `<h1>Level ${this.currentLevelNumber} Completed!</h1>`;
      overlayLC.classList.remove("hidden");
    }
    setTimeout(() => {
      if (overlayLC) overlayLC.classList.add("hidden");
      nextLevel();
    }, 1000);
  }

  /**
   * Displays the game over overlay and stops the background music.
   */
  showGameOver() {
    this.soundManager.backgroundMusic.pause();
    let goScreen = document.getElementById("overlay-gameover");
    goScreen?.classList.remove("hidden");
  }

  /**
   * Displays the win screen overlay, plays the win sound, and stops the game.
   */
  showWinScreen() {
    this.soundManager.backgroundMusic.pause();
    this.soundManager.playSound(this.soundManager.winSound, false);
    document.getElementById("overlay-win")?.classList.remove("hidden");
    this.stopGame();
  }
}
