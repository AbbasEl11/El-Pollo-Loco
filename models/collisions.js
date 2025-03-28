/*************************************************************
 * Global helper functions for collisions and general game logic
 *************************************************************/

/**
 * Checks if two objects overlap, considering an offset
 * for fine-tuning the collision area.
 * @param {Object} a - The first object.
 * @param {Object} b - The second object.
 * @param {number} offset - The offset to apply.
 * @returns {boolean} True if colliding, false otherwise.
 */
function isColliding(a, b, offset) {
  return (
    a.x + a.width - offset > b.x + offset &&
    a.y + a.height - offset > b.y + offset &&
    a.x + offset < b.x + b.width - offset &&
    a.y + offset < b.y + b.height - offset
  );
}

/**
 * Determines what happens if the character stomps a chicken from above
 * or collides with it from the side.
 * @param {World} world - The game world instance.
 * @param {Object} chickenEnemy - The chicken enemy.
 */
function handleChickenCollision(world, chickenEnemy) {
  let characterBottom = world.character.y + world.character.height * 0.9;
  let enemyTop = chickenEnemy.y + chickenEnemy.height * 0.6;

  if (characterBottom < enemyTop) {
    world.killChicken(chickenEnemy);
    world.character.speedY = 20;
  } else {
    world.character.hit(chickenEnemy.damage);
    world.statusBar.setPercentage(world.character.energy);
    world.soundManager.playSound(world.soundManager.characterHurtSound, false);
  }
}

/**
 * Handles collision with the end boss. The character takes
 * additional damage and may be repositioned.
 * @param {World} world - The game world instance.
 * @param {Object} endBoss - The end boss enemy.
 */
function handleBossCollision(world, endBoss) {
  world.character.hit(endBoss.damage * 2);
  world.statusBar.setPercentage(world.character.energy);
  world.soundManager.playSound(world.soundManager.characterHurtSound, false);

  if (world.character.x + world.character.width > endBoss.x) {
    world.character.x = endBoss.x - world.character.width;
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
    enemy.hit(20);
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
      world.level.coins.splice(i, 1);
      world.coinsCollected++;
      let percentage = calcCoinPercentage(world.coinsCollected);
      if (percentage > 100) percentage = 100;
      world.coinBar.setPercentage(percentage);
      if (percentage >= 100) {
        boostCharacterEnergy(world);
      }
      world.soundManager.coinSound.currentTime = 0;
      world.soundManager.playSound(world.soundManager.coinSound, false);
    }
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
