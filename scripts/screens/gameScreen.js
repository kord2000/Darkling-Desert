import { gameState } from "../gameState.js";
import { Player } from "../gamePieces/Player.js";
import { Boundary } from "../gamePieces/Boundary.js";
import { Enemies } from "../gamePieces/Enemies.js";

/*======================== Gameplay Screen ========================*/
export const gameSketch = (q) => {
  let bullets;
  let enemiesManager;
  let enemies;
  let keys;
  let chests;
  let player;

  let chestSetup = false;

  let boundary;

  q.setup = () => {
    const game = q.createCanvas(1200, 900);

    // Create player.
    player = new Player(q);

    // Assign bullets to player bullets.
    bullets = player.bullets;

    // Create enemies manager.
    enemiesManager = new Enemies(q);
    enemies = enemiesManager.group;

    // Create keys group.
    keys = new q.Group();
    keys.d = 8;
    keys.color = "gray";
    keys.stroke = "black";
    keys.physics = "dynamic";
    // Create chests group;
    chests = new q.Group();
    chests.w = 16;
    chests.h = 16;
    chests.color = "#954535";

    // Create Boundaries
    boundary = new Boundary(q);

    boundary.setup(q);

    player.sprite.overlaps(bullets);
    bullets.overlaps(boundary.group);
    bullets.overlaps(keys);
    bullets.collides(chests, (b, c) => b.delete());
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
    player.sprite.debug = true;
  };

  /* ===================================== Setup Functions ===================================== */

  // Creates three chests the player can open using keys.
  let rewardSetup = () => {
    // Helps generate a random item for the chest
    // based on the cost of the item.
    let itemGenerate = (cost) => {
      let randomItem = q.random();
      switch (cost) {
        case 1:
          if (randomItem < 0.5) {
            return "health";
          } else {
            return "revolver";
          }
          break;
        case 2:
          if (randomItem < 0.25) {
            return "bigHealth";
          } else {
            return "autoPistol";
          }
          break;
        case 3:
          if (randomItem < 0.5) {
            return "rifle";
          } else {
            return "shotgun";
          }
      }
    };
    for (let i = 0; i < 3; i++) {
      let c = new chests.Sprite(q.width / 3 + (i * q.width) / 6, q.height / 2);
      c.cost = Math.round(q.random(1, 3));
      c.reward = itemGenerate(c.cost);
      console.log(c.reward);
    }
    chestSetup = true;
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
    if (!chestSetup) rewardSetup();

    player.sprite.collides(chests, openChest);

    // chest UI
    q.fill(0);
    q.stroke(0);
    q.textAlign(q.CENTER, q.CENTER);
    for (let chest of chests) {
      q.text(chest.cost, chest.x, chest.y - chest.h / 2 - 10);
    }
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
    enemiesManager.group.collides(player.sprite, loseLife);
    player.sprite.overlaps(keys, collectKey);
  };

  let checkBoundaries = () => {
    player.sprite.x = q.constrain(player.sprite.x, 10, q.width - 5);
    player.sprite.y = q.constrain(player.sprite.y, 10, q.height - 5);
    for (let k in keys) {
      q.constrain(k.x, 10, q.width);
      q.constrain(k.y, 10, q.height);
    }
  };

  /* ============================= Callback Functions ================================================= */

  let keyPressed = () => {
    player.shoot();
  };

  // Deletes enemy and bullets.
  let hitEnemy = (b, e) => {
    // Chance to spawn a key.
    if (q.random() < 0.1) {
      let k = new keys.Sprite(e.x, e.y);
    }
    b.delete();
    e.delete();
  };

  // Player loses a life and the level resets.
  let loseLife = (e, p) => {
    console.log("COLLISION")
    console.log("Player Position: ", p.x, p.y);
    console.log("Enemy position: ", e.x, e.y);
    gameState.lives--;
    p.delete();
    enemiesManager.group.deleteAll();
    keys.deleteAll();
    player = new Player(q);
  };

  let collectKey = (p, k) => {
    gameState.keyCount++;
    k.delete();
  };
};
