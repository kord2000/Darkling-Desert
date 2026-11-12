import { gameState, resetGameState } from "../gameState.js";
import { Player } from "../gamePieces/Player.js";
import { Boundary } from "../gamePieces/Boundary.js";
import { Enemies } from "../gamePieces/Enemies.js";
import { Chests } from "../gamePieces/Chest.js";

/*======================== Gameplay Screen ========================*/
export const gameSketch = (q) => {
  let boundary;

  let enemiesManager, enemies;

  let chests, keys;

  let player, bullets;

  q.setup = () => {
    const game = q.createCanvas(1200, 900);

    // Create player.
    player = new Player(q);
    player.setup(q);

    // Assign bullets to player bullets.
    bullets = player.bullets;

    // Create enemies manager.
    enemiesManager = new Enemies(q);
    enemies = enemiesManager.enemyGroup;
    keys = enemiesManager.keysGroup;

    // Create chests.
    chests = new Chests(q);

    // Create Boundaries
    boundary = new Boundary(q);
    boundary.setup(q);

    bullets.overlaps(boundary.group);
    bullets.overlaps(keys);
    bullets.collides(chests.chestGroup, (b, c) => b.delete());
    boundary.group.overlaps(boundary.group);
  };
  q.draw = () => {
    console.log(`Current Game State: ${gameState.currentState}`);

    switch (gameState.currentState) {
      case "fightRound":
        q.background(255);

        // Checks updates to gameState.
        playRound();

        break;
      case "rewardRound":
        q.background(255);

        rewardRound();
        break;
      case "gameOver":
        q.background(0);
        gameOver();
        break;
    }

    // // Debug Zone
    // q.fill(0);
    // q.stroke(0);
    // q.text(Math.round(player.y), 15, 20);
  };

  /* ===================================== Game State Functions =========================================== */

  // Displays the game over screen and allows the player to restart the game, occurs when the player has 0 lives.
  let gameOver = () => {
    q.textFill(255);
    q.textSize(64);
    q.textAlign(q.CENTER, q.CENTER);
    q.text("GAME OVER", q.width / 2, q.height / 2);
    q.textSize(48);
    q.text("Press ENTER to Restart!", q.width / 2, (3 * q.height) / 4);

    if (q.kb.presses("enter")) {
      q.clear();
      player.setup(q);
      console.log(player.sprite.toString());
      boundary.setup(q);
      resetGameState();
    }
  };

  // Controls the fight round of the game, where the player fights enemies and collects keys to open chests.
  let playRound = () => {
    if (gameState.lives == 0) {
      console.log(player.sprite.toString());
      q.allSprites.deleteAll();
      gameState.currentState = "gameOver";
    } else if (gameState.roundTime <= 0 && enemies.length == 0) {
      gameState.roundTime = 0;
      gameState.currentState = "rewardRound";
    } else {
      // Physics
      checkFightCollisions(q);

      // Checks for player updates every frame.
      player.draw(q);

      // Enemy AI - Updates every frame.
      enemiesManager.update(q, player.sprite);
    }
  };

  // Controls the reward round of the game, where the player can open chests using keys collected during the fight round.
  let rewardRound = () => {
    if (!chests.initialized) chests.rewardSetup(q);

    chests.ui(q);

    checkRewardCollisions(q);

    player.draw(q);
  };

  /* ===================================== Game Collision Functions =========================================== */
  let checkFightCollisions = (q) => {
    bullets.collides(enemies, hitEnemy);
    enemies.collides(player.sprite, loseLife);
    player.sprite.overlaps(keys, collectKey);

    if (keys.length > 0) {
      for (let k of keys) {
        k.x = q.constrain(k.x, 10, q.width - 10);
        k.y = q.constrain(k.y, 10, q.height - 10);
      }
    }
  };

  let checkRewardCollisions = (q) => {
    player.sprite.collides(chests.chestGroup, openChest);

    if (chests.itemGroup.length > 0) {
      for (let i of chests.itemGroup) {
        i.x = q.constrain(i.x, 10, q.width - 10);
        i.y = q.constrain(i.y, 10, q.height - 10);
      }
    }
  };

  /* ===================================== Game Mechanic Functions =========================================== */

  // Allow the player to open a chest if they have enough keys.
  // Deducts the cost of the chest from the player's key count and spawns the item inside the chest.
  let openChest = (p, c) => {
    if (gameState.keyCount >= c.cost && !c.open) {
      gameState.keyCount -= c.cost;

      c.cost = "";
      c.color = "black";
      c.open = true;

      let i = new chests.itemGroup.Sprite(c.x, c.y);
      i.direction = Math.random() * 360;
      i.item = c.reward;
      console.log(`Chest Opened: ${c.reward}`);

      if (q.dist(i, c) < 50) {
        i.speed = 2;
      } else {
        i.speed = 0;
      }
    }
    console.log("Chest Opened: ", c.open);
  };

  // Deletes enemy and bullet that collide. Chance to spawn a key when an enemy is hit.
  let hitEnemy = (b, e) => {
    // Chance to spawn a key.
    if (q.random() < 0.33) {
      let k = new keys.Sprite(e.x, e.y);
    }
    b.delete();
    e.delete();
  };

  // Player loses a life and the level resets.
  let loseLife = (e, p) => {
    gameState.lives--;
    enemies.deleteAll();
    keys.deleteAll();
    bullets.deleteAll();
    p.x = q.width / 2;
    p.y = q.height / 2;
  };

  let collectKey = (p, k) => {
    gameState.keyCount++;
    k.delete();
  };
};
