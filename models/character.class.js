/**
 * Represents the playable character, which inherits from MovableObject.
 * The character can move, jump, remain idle, and interact with enemies or items.
 * @extends MovableObject
 */
class Character extends MovableObject {
  /**
   * Height of the character in pixels.
   * @type {number}
   */
  height = 250;

  /**
   * Initial position on the Y-axis.
   * @type {number}
   */
  y = 95;

  /**
   * Horizontal speed of the character.
   * @type {number}
   */
  speed = 10;

  /**
   * Images for the walking animation.
   * @type {string[]}
   */
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  /**
   * Images for the jumping animation.
   * @type {string[]}
   */
  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  /**
   * Images for the death animation.
   * @type {string[]}
   */
  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  /**
   * Images for the hurt animation.
   * @type {string[]}
   */
  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  /**
   * Images for the short idle animation.
   * @type {string[]}
   */
  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  /**
   * Images for the long idle animation.
   * @type {string[]}
   */
  IMAGES_LONG_IDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  /**
   * Reference to the current game world.
   * @type {World}
   */
  world;

  /**
   * Counts the elapsed time (in ms) since the last movement,
   * for controlling the idle animation.
   * @type {number}
   */
  idleTimeCounter = 0;

  /**
   * Interval for the movement cycle.
   * @type {number|undefined}
   */
  movementInterval;

  /**
   * Interval for the animation cycle.
   * @type {number|undefined}
   */
  animationInterval;

  /**
   * Counter for skipping idle frames.
   * @type {number}
   */
  idleFrameCount = 0;

  /**
   * Creates a new Character instance, loads images, activates gravity, and starts cycles.
   */
  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.offset = { top: 120, bottom: -5, left: 40, right: 40 };
    this.applyGravity();
    this.startAnimationCycle();
  }

  /**
   * Starts the movement and animation cycles.
   */
  startAnimationCycle() {
    this.movement();
    this.animate();
  }

  /**
   * Initializes the movement cycle to process keyboard inputs.
   */
  movement() {
    this.movementInterval = setInterval(() => {
      let noInput = this.processHorizontalMovement();
      noInput = this.processJump(noInput);
      noInput = this.processThrow(noInput);
      this.trackIdleTime(noInput);
      this.adjustCamera();
    }, 1000 / 60);
  }

  /**
   * Processes horizontal inputs (left/right) and moves the character.
   * @returns {boolean} true if no horizontal key is pressed, otherwise false.
   */
  processHorizontalMovement() {
    let noInput = true;
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      noInput = false;
    }
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      noInput = false;
    }
    return noInput;
  }

  /**
   * Checks if the jump keys (SPACE or UP) are activated and performs a jump.
   * @param {boolean} noInput - Status indicating whether no key has been pressed yet.
   * @returns {boolean} Updated input status.
   */
  processJump(noInput) {
    if (this.world.keyboard.SPACE || this.world.keyboard.UP) {
      this.jump();
      noInput = false;
    }
    return noInput;
  }

  /**
   * Checks if the throw key (D) is pressed.
   * @param {boolean} noInput - Status indicating whether no key has been pressed yet.
   * @returns {boolean} Updated input status.
   */
  processThrow(noInput) {
    if (this.world.keyboard.D) {
      noInput = false;
    }
    return noInput;
  }

  /**
   * Updates the idle counter based on input.
   * @param {boolean} noInput - true if no key is pressed.
   */
  trackIdleTime(noInput) {
    if (noInput) {
      this.idleTimeCounter += 1000 / 60;
    } else {
      this.idleTimeCounter = 0;
    }
  }

  /**
   * Adjusts the camera position so that the character remains in focus.
   */
  adjustCamera() {
    this.world.camera_x = -this.x + 100;
  }

  /**
   * Initializes the animation cycle to update the image sequences.
   */
  animate() {
    this.animationInterval = setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else {
        this.animateIdleOrWalk();
      }
    }, 70);
  }

  /**
   * Decides whether to play the walking or idle animation,
   * and chooses between short and long idle sequences.
   */
  animateIdleOrWalk() {
    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
      this.idleFrameCount = 0;
    } else {
      let elapsed = this.idleTimeCounter;
      if (elapsed > 10000) {
        this.animateIdleSlowly(this.IMAGES_LONG_IDLE, 5);
      } else if (elapsed > 5000) {
        this.animateIdleSlowly(this.IMAGES_IDLE, 4);
      } else {
        this.animateIdleSlowly(this.IMAGES_IDLE, 3);
      }
    }
  }

  /**
   * Plays the idle animation more slowly by skipping frames.
   * @param {string[]} images - Array of image paths for the animation.
   * @param {number} skipFrames - Number of frames to skip.
   */
  animateIdleSlowly(images, skipFrames) {
    this.idleFrameCount++;
    if (this.idleFrameCount >= skipFrames) {
      this.idleFrameCount = 0;
      this.playAnimation(images);
    }
  }

  /**
   * Executes a jump if the character is on the ground.
   * Sets the jump speed and plays the jump sound.
   */
  jump() {
    if (!this.isAboveGround()) {
      this.speedY = 23;
      world.soundManager.jumpSound.currentTime = 0;
      world.soundManager.playSound(world.soundManager.jumpSound, false);
    }
  }
}
