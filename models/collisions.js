/*************************************************************
 * Global helper functions for collisions and general game logic
 *************************************************************/

function getHitBox(obj) {
  let offset = obj.offset || { top: 0, left: 0, right: 0, bottom: 0 };
  return {
    left: obj.x + offset.left,
    right: obj.x + obj.width - offset.right,
    top: obj.y + offset.top,
    bottom: obj.y + obj.height - offset.bottom,
  };
}
/**
 * Checks if two objects overlap, considering an offset
 * for fine-tuning the collision area.
 * @param {Object} a - The first object.
 * @param {Object} b - The second object.
 * @param {number} offset - The offset to apply.
 * @returns {boolean} True if colliding, false otherwise.
 */
function isColliding(a, b) {
  let boxA = getHitBox(a);
  let boxB = getHitBox(b);
  return (
    boxA.right > boxB.left &&
    boxA.left < boxB.right &&
    boxA.bottom > boxB.top &&
    boxA.top < boxB.bottom
  );
}

/**
 * Prüft, ob der Charakter das Huhn wirklich "von oben" trifft.
 * @param {World} world - Das Spielwelt-Objekt.
 * @param {Object} chickenEnemy - Das Huhn.
 * @returns {boolean} true, wenn ein Stomp (Sprung von oben) vorliegt.
 */
function checkStompCondition(world, chickenEnemy) {
  let characterBox = getHitBox(world.character);
  let enemyBox = getHitBox(chickenEnemy);

  let enemyHeight = enemyBox.bottom - enemyBox.top;
  let overlapFromTop = characterBox.bottom - enemyBox.top;
  let stompThreshold = enemyHeight;

  return (
    overlapFromTop > 0 &&
    overlapFromTop < stompThreshold &&
    world.character.speedY < 0
  );
}

/**
 * Checks if the character actually stomps the chicken from above.
 * @param {World} world - The game world object.
 * @param {Object} chickenEnemy - The chicken enemy object.
 * @returns {boolean} Returns true if it's a valid stomp from above.
 */
function isChickenStomped(world, chickenEnemy) {
  let characterBox = getHitBox(world.character);
  let enemyBox = getHitBox(chickenEnemy);

  let enemyHeight = enemyBox.bottom - enemyBox.top;
  let overlapFromTop = characterBox.bottom - enemyBox.top;
  let stompThreshold = enemyHeight; // You can adjust to e.g. enemyHeight * 0.4

  // IMPORTANT: In many engines, speedY < 0 means moving upward,
  // so make sure this is correct for your physics.
  return (
    overlapFromTop > 0 &&
    overlapFromTop < stompThreshold &&
    world.character.speedY < 0
  );
}

/**
 * Handles the collision with a chicken enemy:
 * if it's a stomp from above, the chicken is killed;
 * otherwise, the character takes damage.
 * @param {World} world - The game world object.
 * @param {Object} chickenEnemy - The chicken enemy object.
 */
function handleChickenCollision(world, chickenEnemy) {
  if (isChickenStomped(world, chickenEnemy)) {
    world.killChicken(chickenEnemy);
    world.character.speedY = 20;
  } else {
    world.character.hit(chickenEnemy.damage);
    world.statusBar.setPercentage(world.character.energy);
    world.soundManager.playSound(world.soundManager.characterHurtSound, false);
  }
}

/**
 * Checks collision against a single enemy and decides whether
 * it's a Chicken or the Endboss.
 * @param {World} world - The game world instance.
 * @param {Object} enemy - The enemy object.
 */
function processEnemyCollision(world, enemy) {
  if (world.gameOverShown) return;
  let isChickenType = enemy instanceof chicken || enemy instanceof SmallChicken;
  let isEndBoss = enemy instanceof Endboss;

  if (
    isChickenType &&
    !enemy.isDeadChicken &&
    isColliding(world.character, enemy, 5)
  ) {
    handleChickenCollision(world, enemy);
  }
  if (isEndBoss && isColliding(world.character, enemy, 0)) {
    handleBossCollision(world, enemy);
  }
}

/**
 * Iterates through all enemies in the current level and checks collision
 * with the character. If the character's health <= 0, triggers Game Over.
 * @param {World} world - The game world instance.
 */
function detectEnemyCollisions(world) {
  if (!world.level) return;
  world.level.enemies.forEach((enemy) => processEnemyCollision(world, enemy));

  if (world.character.energy <= 0 && !world.gameOverShown) {
    triggerGameOver(world);
  }
}

/**
 * Initiates the game-over sequence: plays death sound,
 * stops the game, and shows the overlay.
 * @param {World} world - The game world instance.
 */
function triggerGameOver(world) {
  world.gameOverShown = true;
  world.soundManager.playSound(world.soundManager.characterDiesSound, false);
  world.stopGame();
  world.showGameOver();
}

/**
 * Checks if a thrown bottle collides with an enemy (Chicken or Endboss)
 * and applies the respective action.
 * @param {World} world - The game world instance.
 * @param {Object} bottle - The thrown bottle object.
 * @param {Object} enemy - The enemy object.
 */
function checkBottleEnemyCollision(world, bottle, enemy) {
  killChichenWithBottle(bottle, enemy, world);
  killEndBossWithBottle(bottle, enemy, world);
  if (enemy.isDead()) {
    world.killEndboss(enemy);
  }
}

/**
 * Checks if a thrown bottle collides with a chicken enemy and, if so, kills it.
 * @param {Object} bottle - The thrown bottle object.
 * @param {Object} enemy - The chicken enemy object.
 * @param {World} world - The game world instance.
 */
function killChichenWithBottle(bottle, enemy, world) {
  let isChickenEnemy =
    enemy instanceof chicken || enemy instanceof SmallChicken;

  if (isChickenEnemy && !enemy.isDeadChicken && isColliding(bottle, enemy, 0)) {
    world.killChicken(enemy);
    bottle.initiateSplash();
  }
}

/**
 * Checks if a thrown bottle collides with the Endboss and applies damage.
 * @param {Object} bottle - The thrown bottle object.
 * @param {Object} enemy - The enemy object, expected to be an Endboss.
 * @param {World} world - The game world instance.
 */
function killEndBossWithBottle(bottle, enemy, world) {
  let isBossEnemy = enemy instanceof Endboss;
  if (isBossEnemy && isColliding(bottle, enemy, 0)) {
    enemy.hit(10);
    world.endBossBar.setPercentage(enemy.energy);
    bottle.initiateSplash();
    world.throwableObjects.splice(bottle, 1);
  }
}

/**
 * Checks all thrown bottles for collisions with enemies.
 * @param {World} world - The game world instance.
 * @param {Object} bottle - A thrown bottle object.
 */
function processBottleCollisions(world, bottle) {
  world.level.enemies.forEach((enemy) => {
    checkBottleEnemyCollision(world, bottle, enemy);
  });
}

/**
 * Iterates through all throwable objects in the World and
 * triggers the collision detection logic.
 * @param {World} world - The game world instance.
 */
function detectThrowableCollisions(world) {
  if (!world.level) return;
  world.throwableObjects.forEach((bottle) => {
    processBottleCollisions(world, bottle);
  });
}

/**
 * Checks collisions with coins and removes the coin if collected.
 * Increases the coin counter and updates the display.
 * @param {World} world - The game world instance.
 */
function detectCoinCollisions(world) {
  if (!world.level) return;
  for (let i = world.level.coins.length - 1; i >= 0; i--) {
    let coin = world.level.coins[i];
    if (
      isColliding(world.character, coin, 20) &&
      world.character.isAboveGround()
    ) {
      setCollectedCoins(i);
      world.soundManager.coinSound.currentTime = 0;
      world.soundManager.playSound(world.soundManager.coinSound, false);
    }
  }
}

function setCollectedCoins(i) {
  world.level.coins.splice(i, 1);
  world.coinsCollected++;
  let percentage = calcCoinPercentage(world.coinsCollected);
  if (percentage > 100) percentage = 100;
  world.coinBar.setPercentage(percentage);
  if (percentage >= 100) {
    boostCharacterEnergy(world);
  }
}

/**
 * Increases the character's energy and resets the coin count if needed.
 * @param {World} world - The game world instance.
 */
function boostCharacterEnergy(world) {
  world.coinsCollected = 0;
  world.coinBar.setPercentage(0);
  world.character.energy += 20;
  if (world.character.energy > 100) {
    world.character.energy = 100;
  }
  world.statusBar.setPercentage(world.character.energy);
}

/**
 * Checks collisions with bottle items on the ground.
 * Removes the item and increases the number of collected bottles.
 * @param {World} world - The game world instance.
 */
function detectBottleItemCollisions(world) {
  if (!world.level) return;
  for (let i = world.level.bottles.length - 1; i >= 0; i--) {
    let bottleItem = world.level.bottles[i];
    if (isColliding(world.character, bottleItem, 20)) {
      world.level.bottles.splice(i, 1);
      world.bottlesCollected++;
      let bottlePercentage = world.bottlesCollected * 20;
      if (bottlePercentage > 100) bottlePercentage = 100;
      world.bottleBar.setPercentage(bottlePercentage);
      world.soundManager.bottleSound.currentTime = 0;
      world.soundManager.playSound(world.soundManager.bottleSound, false);
    }
  }
}

/**
 * Calculates the percentage from the number of collected coins.
 * @param {number} coinCount - The number of coins collected.
 * @returns {number} The corresponding percentage (max 100).
 */
function calcCoinPercentage(coinCount) {
  let percentage = coinCount * 10;
  return percentage > 100 ? 100 : percentage;
}

/**
 * Calculates the percentage from the number of collected bottles.
 * @param {number} bottleCount - The number of bottles collected.
 * @returns {number} The corresponding percentage (max 100).
 */
function calcBottlePercentage(bottleCount) {
  let percentage = bottleCount * 20;
  return percentage > 100 ? 100 : percentage;
}
