/**
 * Represents a throwable bottle object. It extends MovableObject,
 * can be thrown, rotates in the air, and may either splash or break on impact.
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
  /**
   * Array of image paths for the bottle's rotation animation.
   * @type {string[]}
   */
  IMAGES_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  /**
   * Array of image paths for the bottle when it lies on the ground (unbroken).
   * @type {string[]}
   */
  IMAGES_ON_GROUND = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  /**
   * Array of image paths for the splash animation (e.g., shattering).
   * @type {string[]}
   */
  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /**
   * Indicates whether the bottle has crashed (landed or impacted).
   * @type {boolean}
   */
  hasCrashed = false;

  /**
   * Interval ID for the bottle's rotation animation.
   * @type {number|undefined}
   */
  rotationInterval;

  /**
   * Interval ID for the bottle's forward movement.
   * @type {number|undefined}
   */
  movementInterval;

  /**
   * Interval ID for the splash animation.
   * @type {number|undefined}
   */
  splashInterval;

  /**
   * Interval ID for the on-ground (broken bottle) animation.
   * @type {number|undefined}
   */
  breakInterval;

  /**
   * Creates a new ThrowableObject with a starting position, loads images,
   * sets dimensions, and initiates the throw.
   * @param {number} x - The initial x-position.
   * @param {number} y - The initial y-position.
   * @param {World} world - Reference to the game world.
   */
  constructor(x, y, world) {
    super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_ON_GROUND);
    this.loadImages(this.IMAGES_SPLASH);

    this.world = world;
    this.width = 50;
    this.height = 60;

    this.throw(x, y);
  }

  /**
   * Throws the bottle by setting its position, vertical speed,
   * and starting the rotation and movement intervals.
   * @param {number} x - The starting x-position.
   * @param {number} y - The starting y-position.
   */
  throw(x, y) {
    this.speedY = 30;
    this.animateThrow(x, y);
    this.applyGravity();
  }

  animateThrow(x, y) {
    this.x = x;
    this.y = y;
    this.rotationInterval = setInterval(() => {
      if (!this.hasCrashed) {
        this.playAnimation(this.IMAGES_ROTATION);
      }
    }, 80);

    this.movementInterval = setInterval(() => {
      if (!this.hasCrashed) {
        this.x += 10;
      }
    }, 25);
  }

  /**
   * Initiates the splash sequence when the bottle collides with an enemy.
   * Stops motion, plays a shattering sound, and begins the splash animation.
   */
  initiateSplash() {
    this.hasCrashed = true;
    this.startInterval();
    this.playSplashSound();
    this.startSplashAnimation();
  }

  /**
   * Halts the bottle's rotation and forward movement.
   */
  startInterval() {
    clearInterval(this.rotationInterval);
    clearInterval(this.movementInterval);
  }

  /**
   * Plays the bottle's shattering sound effect from the beginning.
   */
  playSplashSound() {
    world.soundManager.bottleCrackSound.currentTime = 0;
    world.soundManager.playSound(world.soundManager.bottleCrackSound, false);
  }

  /**
   * Begins the splash animation and, upon completion, removes the bottle from the world.
   */
  startSplashAnimation() {
    this.currentImage = 0;
    this.splashInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_SPLASH);
    }, 80);

    setTimeout(() => {
      clearInterval(this.splashInterval);
      this.detachBottle();
    }, 700);
  }

  /**
   * Handles the bottle's collision with the ground.
   * Stops motion, sets the bottle on the ground, and plays a brief ground animation.
   */
  handleGroundCollision() {
    this.hasCrashed = true;
    this.y = 360;
    this.startInterval();
    this.currentImage = 0;

    this.breakInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_ON_GROUND);
    }, 200);

    setTimeout(() => {
      clearInterval(this.breakInterval);
      this.detachBottle();
    }, 300);
  }

  /**
   * Removes this bottle from the game's array of throwable objects.
   */
  detachBottle() {
    const i = this.world.throwableObjects.indexOf(this);
    if (i > -1) {
      this.world.throwableObjects.splice(i, 1);
    }
  }
}
