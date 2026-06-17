import { gameState } from "../gameState.js";
import { Player } from "../gamePieces/Player.js";
import { Boundary } from "../gamePieces/Boundary.js";
import { Enemies } from "../gamePieces/Enemies.js";
import { Chest } from "../gamePieces/Chest.js";

/*======================== Gameplay Screen ========================*/
export const gameSketch = (q) => {
  let bullets;
  let enemiesManager;
  let enemies;
  let keys;
  let chests;
  let player;

  let boundary;

  q.setup = () => {
    const game = q.createCanvas(1200, 900);

    // Create player.
    player = new Player(q);

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

    player.sprite.overlaps(bullets);
    bullets.overlaps(boundary.group);
    bullets.overlaps(keys);
    bullets.collides(chests.group, (b, c) => b.delete());
    boundary.group.overlaps(boundary.group);
  };
  q.draw = () => {
    q.background(255);
    player.movement(q);
    player.shoot(q);

    switch (gameState.currentState) {
      case "fightRound":
        playRound();
        break;
      case "rewardRound":
        rewardRound();
        break;
    }

    // // Debug Zone
    // q.fill(0);
    // q.stroke(0);
    // q.text(Math.round(player.y), 15, 20);
  };

  /* ===================================== Game State Functions =========================================== */
  let playRound = () => {
    // Enemy AI.
    enemiesManager.movement(player.sprite);
    enemiesManager.spawnEnemies(q);

    // Physics
    checkCollisions();
    checkBoundaries();
  };

  let rewardRound = () => {
    if (!chests.initialized) chests.rewardSetup(q);

    player.sprite.collides(chests.group, openChest);

    
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

  let keyPressed = () => {
    player.shoot();
  };

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
    console.log("COLLISION");
    console.log("Player Position: ", p.x, p.y);
    console.log("Enemy position: ", e.x, e.y);
    gameState.lives--;
    p.delete();
    enemies.deleteAll();
    keys.deleteAll();
    player = new Player(q);
  };

  let collectKey = (p, k) => {
    gameState.keyCount++;
    k.delete();
  };
};
