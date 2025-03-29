/**
 * Repräsentiert den spielbaren Charakter, der von MovableObject erbt.
 * Der Charakter kann sich bewegen, jump, im Leerlauf verweilen und mit Gegnern oder Items interagieren.
 * @extends MovableObject
 */
class Character extends MovableObject {
  /**
   * Höhe des Charakters in Pixeln.
   * @type {number}
   */
  height = 250;

  /**
   * Startposition auf der Y-Achse.
   * @type {number}
   */
  y = 95;

  /**
   * Horizontale Geschwindigkeit des Charakters.
   * @type {number}
   */
  speed = 10;

  /**
   * Bilder für die Geh-Animation.
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
   * Bilder für die Sprung-Animation.
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
   * Bilder für die Todesanimation.
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
   * Bilder für die Verletzungsanimation.
   * @type {string[]}
   */
  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  /**
   * Bilder für die kurze Idle-Animation.
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
   * Bilder für die lange Idle-Animation.
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
   * Referenz auf die aktuelle Spielwelt.
   * @type {World}
   */
  world;

  /**
   * Zählt die verstrichene Zeit (in ms) seit der letzten Bewegung,
   * zur Steuerung der Idle-Animation.
   * @type {number}
   */
  idleTimeCounter = 0;

  /**
   * Intervall für den Bewegungszyklus.
   * @type {number|undefined}
   */
  movementInterval;

  /**
   * Intervall für den Animationszyklus.
   * @type {number|undefined}
   */
  animationInterval;

  /**
   * Zähler zum Überspringen von Idle-Frames.
   * @type {number}
   */
  idleFrameCount = 0;

  /**
   * Erstellt eine neue Character-Instanz, lädt die Bilder, aktiviert Gravity und startet die Zyklen.
   */
  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.offset = { top: 100, bottom: -5, left: 20, right: 20 };
    this.applyGravity();
    this.startAnimationCycle();
  }

  /**
   * Startet die Bewegungs- und Animationszyklen.
   */
  startAnimationCycle() {
    this.movement();
    this.animate();
  }

  /**
   * Initialisiert den Bewegungszyklus zur Auswertung der Tastatureingaben.
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
   * Verarbeitet horizontale Eingaben (rechts/links) und bewegt den Charakter.
   * @returns {boolean} true, wenn keine horizontale Taste gedrückt wurde, sonst false.
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
   * Prüft, ob die Sprungtasten (SPACE oder UP) aktiviert sind, und führt einen jump aus.
   * @param {boolean} noInput - Status, ob bisher keine Taste gedrückt wurde.
   * @returns {boolean} Aktualisierter Eingabestatus.
   */
  processJump(noInput) {
    if (
      (this.world.keyboard.SPACE || this.world.keyboard.UP) &&
      !this.isAboveGround()
    ) {
      this.jump();
      noInput = false;
    }
    return noInput;
  }

  /**
   * Prüft, ob die Wurftaste (D) gedrückt wird.
   * @param {boolean} noInput - Status, ob bisher keine Taste gedrückt wurde.
   * @returns {boolean} Aktualisierter Eingabestatus.
   */
  processThrow(noInput) {
    if (this.world.keyboard.D) {
      noInput = false;
    }
    return noInput;
  }

  /**
   * Aktualisiert den Idle-Zähler basierend auf der Eingabe.
   * @param {boolean} noInput - true, wenn keine Taste gedrückt wurde.
   */
  trackIdleTime(noInput) {
    if (noInput) {
      this.idleTimeCounter += 1000 / 60;
    } else {
      this.idleTimeCounter = 0;
    }
  }

  /**
   * Passt die Kameraposition an, sodass der Charakter im Fokus bleibt.
   */
  adjustCamera() {
    this.world.camera_x = -this.x + 100;
  }

  /**
   * Initialisiert den Animationszyklus zur Aktualisierung der Bildsequenzen.
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
    }, 50);
  }

  /**
   * Entscheidet, ob die Geh- oder Idle-Animation abgespielt wird,
   * und wählt zwischen kurzer und langer Idle-Sequenz.
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
   * Spielt die Idle-Animation langsamer ab, indem Frames übersprungen werden.
   * @param {string[]} images - Array der Bildpfade für die Animation.
   * @param {number} skipFrames - Anzahl der zu überspringenden Frames.
   */
  animateIdleSlowly(images, skipFrames) {
    this.idleFrameCount++;
    if (this.idleFrameCount >= skipFrames) {
      this.idleFrameCount = 0;
      this.playAnimation(images);
    }
  }

  /**
   * Führt einen jump aus, sofern der Charakter den Boden berührt.
   * Setzt die Sprunggeschwindigkeit und spielt den jump-Sound.
   */
  jump() {
    if (!this.isAboveGround()) {
      this.speedY = 23;
      world.soundManager.jumpSound.currentTime = 0;
      world.soundManager.playSound(world.soundManager.jumpSound, false);
    }
  }
}
