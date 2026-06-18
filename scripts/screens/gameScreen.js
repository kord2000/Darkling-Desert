import { gameState, resetGameState } from "../gameState.js";
import { Player } from "../gamePieces/Player.js";
import { Boundary } from "../gamePieces/Boundary.js";
import { Enemies } from "../gamePieces/Enemies.js";
import { Chest } from "../gamePieces/Chest.js";

/*======================== Gameplay Screen ========================*/
export const gameSketch = (q) => {
  let boundaryManager, boundary;

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
    chests = new Chest(q);

    // Create Boundaries
    boundary = new Boundary(q);
    boundary.setup(q);

    bullets.overlaps(boundary.group);
    bullets.overlaps(keys);
    bullets.collides(chests.group, (b, c) => b.delete());
    boundary.group.overlaps(boundary.group);
  };
  q.draw = () => {
    console.log(`Current Game State: ${gameState.currentState}`);

    switch (gameState.currentState) {
      case "fightRound":
        q.background(255);
        player.draw(q);
        playRound();
        break;
      case "rewardRound":
        q.background(255);
        player.draw(q);
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
      boundary.setup(q);
      resetGameState();
    }
  };

  let playRound = () => {
    if (gameState.roundTime <= 0 && enemies.length == 0) {
      gameState.roundTime = 0;
      gameState.currentState = "rewardRound";
    } else if (gameState.lives == 0) {
      gameState.currentState = "gameOver";
      q.allSprites.deleteAll();
    }

    // Enemy AI.
    enemiesManager.update(q, player.sprite);

    // Physics
    checkCollisions();
    // checkBoundaries();
  };

  let rewardRound = () => {
    if (!chests.initialized) chests.rewardSetup(q);

    player.sprite.collides(chests.group, openChest);

    chests.ui(q);
  };

  /* ===================================== Game Mechanic Functions =========================================== */

  let openChest = (p, c) => {
    if (gameState.keyCount >= c.cost) {
      gameState.keyCount -= c.cost;
      c.cost = "";
      c.color = "black";
    }
  };
  let checkCollisions = () => {
    bullets.collides(enemies, hitEnemy);
    enemies.collides(player.sprite, loseLife);
    player.sprite.overlaps(keys, collectKey);
  };

  let checkBoundaries = () => {
    player.sprite.x = q.constrain(player.sprite.x, 10, q.width - 5);
    player.sprite.y = q.constrain(player.sprite.y, 10, q.height - 5);
    for (let k in keys) {
      q.constrain(k.x, 10, q.width - 10);
      q.constrain(k.y, 10, q.height - 10);
    }
  };

  /* ============================= Callback Functions ================================================= */

  // Deletes enemy and bullets.
  let hitEnemy = (b, e) => {
    // Chance to spawn a key.
    if (q.random() < 0.25) {
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
    p.x = q.width / 2;
    p.y = q.height / 2;
  };

  let collectKey = (p, k) => {
    gameState.keyCount++;
    k.delete();
  };
};
