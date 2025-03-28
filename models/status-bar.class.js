/**
 * A health status bar displaying the player's current health.
 * @extends DrawableObject
 */
class HealthStatusBar extends DrawableObject {
  /**
   * An array of image paths representing health levels from 0% to 100%.
   * @type {string[]}
   */
  IMAGES_HEALTH = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
  ];

  /**
   * The current health percentage (0–100).
   * @type {number}
   */
  percentage = 100;

  /**
   * Creates a new HealthStatusBar, loads images, and sets its initial position and size.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_HEALTH);
    this.x = 30;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
  }

  /**
   * Updates the health bar to reflect the given percentage.
   * @param {number} percentage - The current health percentage.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const path = this.IMAGES_HEALTH[this.getHealthImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the correct image index for the current health percentage.
   * @returns {number} The index in the IMAGES_HEALTH array.
   */
  getHealthImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}

/**
 * A status bar displaying the end boss's health.
 * @extends DrawableObject
 */
class EndbossStatusBar extends DrawableObject {
  /**
   * An array of image paths representing the end boss's health levels (0–100%).
   * @type {string[]}
   */
  IMAGES_ENDBOSS = [
    "img/7_statusbars/2_statusbar_endboss/blue/0.png",
    "img/7_statusbars/2_statusbar_endboss/blue/20.png",
    "img/7_statusbars/2_statusbar_endboss/blue/40.png",
    "img/7_statusbars/2_statusbar_endboss/blue/60.png",
    "img/7_statusbars/2_statusbar_endboss/blue/80.png",
    "img/7_statusbars/2_statusbar_endboss/blue/100.png",
  ];

  /**
   * The current end boss health percentage (0–100).
   * @type {number}
   */
  percentage = 100;

  /**
   * Creates a new EndbossStatusBar, loads its images, and sets its position and size.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_ENDBOSS);
    this.x = 470;
    this.y = 50;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
  }

  /**
   * Updates the end boss health bar to reflect the given percentage.
   * @param {number} percentage - The current health percentage of the end boss.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const path = this.IMAGES_ENDBOSS[this.getEndbossImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the appropriate image index based on the end boss's health.
   * @returns {number} The index in the IMAGES_ENDBOSS array.
   */
  getEndbossImageIndex() {
    if (this.percentage == 100) return 5;
    else if (this.percentage > 80) return 4;
    else if (this.percentage > 60) return 3;
    else if (this.percentage > 40) return 2;
    else if (this.percentage > 20) return 1;
    else return 0;
  }
}

/**
 * A status bar to display the player's collected coins.
 * @extends DrawableObject
 */
class CoinStatusBar extends DrawableObject {
  /**
   * The current coin collection percentage (0–100).
   * @type {number}
   */
  percentage = 0;

  /**
   * Creates a new CoinStatusBar, loads its images, and sets its initial position and size.
   */
  constructor() {
    super();
    this.IMAGES_COINS = [
      "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png",
      "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png",
      "img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png",
      "img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png",
      "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
      "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
    ];
    this.loadImages(this.IMAGES_COINS);
    this.x = 230;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    this.setPercentage(0);
  }

  /**
   * Updates the coin status bar based on the current coin collection percentage.
   * @param {number} percentage - The current coin collection percentage.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const path = this.getCoinImagePath(percentage);
    this.img = this.imageCache[path];
  }

  /**
   * Determines the appropriate coin image based on the given percentage.
   * @param {number} percentage - The current coin collection percentage.
   * @returns {string} The path to the corresponding coin image.
   */
  getCoinImagePath(percentage) {
    if (percentage >= 100) {
      return this.IMAGES_COINS[5];
    } else if (percentage >= 80) {
      return this.IMAGES_COINS[4];
    } else if (percentage >= 60) {
      return this.IMAGES_COINS[3];
    } else if (percentage >= 40) {
      return this.IMAGES_COINS[2];
    } else if (percentage >= 20) {
      return this.IMAGES_COINS[1];
    } else {
      return this.IMAGES_COINS[0];
    }
  }
}

/**
 * A status bar to display the player's collected bottles.
 * @extends DrawableObject
 */
class BottleStatusBar extends DrawableObject {
  /**
   * The current bottle collection percentage (0–100).
   * @type {number}
   */
  percentage = 0;

  /**
   * Creates a new BottleStatusBar, loads its images, and sets its initial position and size.
   */
  constructor() {
    super();
    this.IMAGES_BOTTLES = [
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png",
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png",
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
    ];
    this.loadImages(this.IMAGES_BOTTLES);
    this.x = 430;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    this.setPercentage(0);
  }

  /**
   * Updates the bottle status bar to reflect the given bottle collection percentage.
   * @param {number} percentage - The current bottle collection percentage.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const path = this.getBottleImagePath(percentage);
    this.img = this.imageCache[path];
  }

  /**
   * Determines the appropriate bottle image based on the current percentage.
   * @param {number} percentage - The current bottle collection percentage.
   * @returns {string} The path to the corresponding bottle image.
   */
  getBottleImagePath(percentage) {
    if (percentage >= 100) {
      return this.IMAGES_BOTTLES[5];
    } else if (percentage >= 80) {
      return this.IMAGES_BOTTLES[4];
    } else if (percentage >= 60) {
      return this.IMAGES_BOTTLES[3];
    } else if (percentage >= 40) {
      return this.IMAGES_BOTTLES[2];
    } else if (percentage >= 20) {
      return this.IMAGES_BOTTLES[1];
    } else {
      return this.IMAGES_BOTTLES[0];
    }
  }
}
