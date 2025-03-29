/**
 * Represents a normal chicken enemy in the game, extending MovableObject.
 * Chickens can walk, be killed, and animate between walking and dead states.
 * @extends MovableObject
 */
class chicken extends MovableObject {
  /**
   * The amount of damage this chicken inflicts on the character.
   * @type {number}
   */
  damage = 10;

  /**
   * The Y-position of the chicken on the canvas.
   * @type {number}
   */
  y = 370;

  /**
   * The height of the chicken in pixels.
   * @type {number}
   */
  height = 55;

  /**
   * The width of the chicken in pixels.
   * @type {number}
   */
  width = 70;

  /**
   * Array of image paths for the walking animation.
   * @type {string[]}
   */
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  /**
   * Array of image paths for the dead animation.
   * @type {string[]}
   */
  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  /**
   * Interval ID for movement.
   * @type {number|null}
   */
  movementInterval;

  /**
   * Interval ID for the walking animation.
   * @type {number|null}
   */
  animationInterval;

  /**
   * Interval ID for the dead animation.
   * @type {number|null}
   */
  deathAnimationInterval;

  /**
   * Creates a new chicken instance with a random X-position and speed,
   * loads its images, and starts the animation.
   */
  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 200 + Math.random() * 5000;
    this.speed = 0.2 + Math.random() * 0.5;
    this.offset = { top: 5, right: -10, bottom: 0, left: -10 };
    this.animate();
  }

  /**
   * Starts intervals for moving left and playing the walking animation.
   */
  animate() {
    this.movementInterval = setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);

    this.animationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }

  /**
   * Plays the dead animation by clearing movement and walking intervals
   * and continuously displaying the dead image.
   */
  playDeadAnimation() {
    clearInterval(this.movementInterval);
    clearInterval(this.animationInterval);
    this.currentImage = 0;
    this.deathAnimationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_DEAD);
    }, 10);
  }

  /**
   * Stops all animation intervals (movement, walking, and dead animations).
   */
  stopIntervals() {
    if (this.movementInterval) {
      clearInterval(this.movementInterval);
      this.movementInterval = null;
    }
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
    if (this.deathAnimationInterval) {
      clearInterval(this.deathAnimationInterval);
      this.deathAnimationInterval = null;
    }
  }

  /**
   * Resumes the walking and moving animations after they have been stopped.
   */
  resumeIntervals() {
    this.animate();
  }
}
