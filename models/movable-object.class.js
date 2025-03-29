/**
 * A movable object that extends DrawableObject.
 * It supports physics, collision detection, and health management.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  /**
   * The base horizontal movement speed.
   * @type {number}
   */
  speed = 0.15;

  /**
   * Indicates whether the object is facing left (true) or right (false).
   * @type {boolean}
   */
  otherDirection = false;

  /**
   * The vertical velocity, used for jumping or falling.
   * @type {number}
   */
  speedY = 0;

  /**
   * The acceleration factor applied for gravity.
   * @type {number}
   */
  acceleration = 2.5;

  /**
   * The current energy or health of the object (0 signifies dead).
   * @type {number}
   */
  energy = 100;

  /**
   * Timestamp of the most recent hit, used to manage the temporary hurt state.
   * @type {number}
   */
  lastHit = 0;

  /**
   * Identifier for the interval applying gravity.
   * @type {number|null}
   */
  gravityInterval;

  /**
   * Applies gravity by updating the vertical position (y) and velocity (speedY).
   * When the object is no longer above the ground, it is set to y=185 and its vertical speed resets.
   */
  applyGravity() {
    this.gravityInterval = setInterval(() => {
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
      if (!this.isAboveGround()) {
        this.y = 185;
        this.speedY = 0;
        if (this instanceof ThrowableObject) {
          this.handleGroundCollision();
          clearInterval(this.gravityInterval);
        }
      }
    }, 1000 / 25);
  }

  /**
   * Determines whether the object is above the ground level.
   * Special cases:
   * - ThrowableObject: above ground if y < 360.
   * - Endboss: above ground if y < 85.
   * - Character: above ground if y < 185.
   * @returns {boolean} True if the object is above ground; otherwise, false.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) return this.y < 360;
    if (this instanceof Endboss) return this.y < 85;
    return this.y < 185;
  }

  /**
   * Reduces the object's energy by a specified damage amount.
   * If energy falls below zero, it is reset to zero.
   * The last hit timestamp is updated unless the energy is already zero.
   * @param {number} [damage=5] - The damage to apply.
   */
  hit(damage = 5) {
    this.energy -= damage;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Determines if the object is still in a 'hurt' state,
   * which lasts for 1 second after the last hit.
   * @returns {boolean} True if the object is still hurt; otherwise, false.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  /**
   * Checks if the object's energy has reached zero.
   * @returns {boolean} True if energy is zero; otherwise, false.
   */
  isDead() {
    return this.energy === 0;
  }

  /**
   * Moves the object to the right by adding its speed to the x-coordinate.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left by subtracting its speed from the x-coordinate.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Cycles through the provided image array to play an animation.
   * @param {string[]} images - The array of image paths for the animation.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Initiates a jump by setting the vertical speed.
   */
  jump() {
    this.speedY = 23;
  }
}
