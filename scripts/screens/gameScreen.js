/*
TODO: Having items appear outside of chest.
*/
import { gameState } from "../gameState.js";
import { Player } from "../spritesAndGroups/Player.js"

/*======================== Gameplay Screen ========================*/
export const gameSketch = (q) => {
  let bullets;
  let enemies;
  let keys;
  let chests;
  let player;

  let chestSetup = false;

  let spawns = ["NORTH", "SOUTH", "WEST", "EAST"];
  let enemyAmount = [1, 2, 3];

  let boundary;

  q.setup = () => {
    const game = q.createCanvas(1200, 900);

    // Create player.
    player = new Player(q);

    // Create bullets. 
    bullets = player.bullets;

    // Create enemies group.
    enemies = new q.Group();
    enemies.w = 16;
    enemies.h = 16;
    enemies.color = "red";
    enemies.stroke = "white";
    enemies.speed = 2;

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
    boundary = new q.Group();
    boundary.color = "purple";
    boundary.stroke = "purple";
    boundary.physics = "static";
    boundary.h = 10;

    // Top
    let boundaryTWR = new boundary.Sprite(q.width / 6, 5);
    let boundaryTWL = new boundary.Sprite((5 * q.width) / 6, 5);
    boundaryTWR.w = q.width / 3;
    boundaryTWL.w = q.width / 3;
    // Bottom
    let boundaryBWR = new boundary.Sprite(q.width / 6, q.height - 5);
    let boundaryBWL = new boundary.Sprite((5 * q.width) / 6, q.height - 5);
    boundaryBWR.w = q.width / 3;
    boundaryBWL.w = q.width / 3;
    // Left
    let boundaryTHL = new boundary.Sprite(5, q.height / 6);
    let boundaryBHL = new boundary.Sprite(5, (5 * q.height) / 6);
    boundaryTHL.w = q.height / 3;
    boundaryTHL.rotation = 90;
    boundaryBHL.w = q.height / 3;
    boundaryBHL.rotation = 90;
    // Right
    let boundaryTHR = new boundary.Sprite(q.width - 5, q.height / 6);
    let boundaryBHR = new boundary.Sprite(q.width - 5, (5 * q.height) / 6);
    boundaryTHR.w = q.height / 3;
    boundaryTHR.rotation = 90;
    boundaryBHR.w = q.height / 3;
    boundaryBHR.rotation = 90;

    player.sprite.overlaps(bullets);
    bullets.overlaps(boundary);
    bullets.overlaps(keys);
    bullets.collides(chests, (b, c) => b.delete());
    boundary.overlaps(boundary);
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
    enemyMovement();
    if (q.frameCount % 120 == 0) {
      spawnEnemies(Math.floor(q.random(enemyAmount)), q.random(spawns));
    }

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
  

  // Spawns Enemies at each of the spawn points designated by the cardinal directions.
  let spawnEnemies = (amount, location) => {
    for (let i = 0; i < amount; i++) {
      let e = new enemies.Sprite();
      if (location == "NORTH") {
        e.x = Math.round(
          q.random(q.width / 2 - q.width / 6, q.width / 2 + q.width / 12),
        );
        e.y = Math.round(q.random(-5, 5));
      } else if (location == "SOUTH") {
        e.x = Math.round(
          q.random(q.width / 2 - q.width / 6, q.width / 2 + q.width / 12),
        );
        e.y = Math.round(q.random(595, 605));
      } else if (location == "EAST") {
        e.x = Math.round(q.random(795, 805));
        e.y = Math.round(
          q.random(q.height / 2 - q.height / 6, q.height / 2 + q.height / 12),
        );
      } else {
        e.x = Math.round(q.random(-5, 5));
        e.y = Math.round(
          q.random(q.height / 2 - q.height / 6, q.height / 2 + q.height / 12),
        );
      }
    }
  };

  // Controls enemy behavior for the game.
  let enemyMovement = () => {
    for (let e of enemies) {
      e.direction = e.angleTo(player.sprite);
      e.speed = 2;
    }
  };

  let openChest = (p, c) => {
    if (gamestate.keyCount >= c.cost) {
      gamestate.keyCount -= c.cost;
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
      q.constrain(k.x, 10, q.width);
      q.constrain(k.y, 10, q.height);
    }
  };

  /* ============================= Callback Functions ================================================= */

  // Controls key presses based on gamestate.
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
    gamestate.lives--;
    p.delete();
    enemies.deleteAll();
    keys.deleteAll();
    makePlayer();
  };

  let collectKey = (p, k) => {
    gamestate.keyCount++;
    k.delete();
  };
};
