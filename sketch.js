/*
TODO: Adding keys and chests for items.
*/

/*======================== GLOBAL VARIABLES ========================*/
let lives = 3;
let keyCount = 6;
let rounds = 1;
let maxRoundTime = 0;
let roundTime = maxRoundTime;

/*======================== Gameplay Screen ========================*/
const gameSketch = (q) => {
  let player;
  let bullets;
  let enemies;
  let keys;
  let chests;
  let fireRate = 60;

  let chestSetup = false;
  let gameState = "rewardRound";

  let spawns = ["NORTH", "SOUTH", "WEST", "EAST"];
  let enemyAmount = [1, 2, 3];

  let boundary;

  q.setup = () => {
    q.createCanvas(800, 600);

    // Create player.
    makePlayer();

    // Create bullets group for player.
    bullets = new q.Group();
    bullets.d = 5;
    bullets.color = "black";
    bullets.stroke = "silver";
    bullets.speed = 6;

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

    player.overlaps(bullets);
    bullets.overlaps(boundary);
    bullets.overlaps(keys);
    bullets.collides(chests, (b, c) => b.delete());
    boundary.overlaps(boundary);
  };
  q.draw = () => {
    q.background(255);

    switch (gameState) {
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

  // Makes the player character.
  let makePlayer = () => {
    player = new q.Sprite(q.width / 2, (2 * q.height) / 3, 16);
    player.color = "blue";
    player.stroke = "black";
    player.rotationLock = true;
    player.weapon = "startPistol";
    player.fireRate = fireRate;
  };

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
    // player mechanics.
    playerMovement();
    playerShoot();

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

    // player mechanics.
    playerMovement();
    playerShoot();

    player.collides(chests, openChest);

    // chest UI
    q.fill(0);
    q.stroke(0);
    q.textAlign(q.CENTER, q.CENTER);
    for (let chest of chests) {
      q.text(chest.cost, chest.x, chest.y - chest.h / 2 - 10);
    }
  };

  /* ===================================== Game Mechanic Functions =========================================== */
  // Allow player to move around on the screen.
  let playerMovement = () => {
    player.speed = 0;

    // Up
    if (q.kb.pressing("w")) player.y = player.y - 3;
    // Left
    if (q.kb.pressing("a")) player.x = player.x - 3;
    // Down
    if (q.kb.pressing("s")) player.y = player.y + 3;
    // Right
    if (q.kb.pressing("d")) player.x = player.x + 3;
  };

  // Allows player to shoot, uses a helper function to help determine
  // direction of the bullets.
  let playerShoot = () => {
    if (q.frameCount % fireRate == 0) {
      // NorthEast
      if (q.keyIsDown(39) && q.keyIsDown(38)) shootBullet(315);
      // SouthEast
      else if (q.keyIsDown(39) && q.keyIsDown(40)) shootBullet(45);
      // North West
      else if (q.keyIsDown(37) && q.keyIsDown(38)) shootBullet(225);
      // South West
      else if (q.keyIsDown(37) && q.keyIsDown(40)) shootBullet(135);
      else {
        // East
        if (q.keyIsDown(39)) shootBullet(0);
        // West
        else if (q.keyIsDown(37)) shootBullet(180);
        // North
        if (q.keyIsDown(38)) shootBullet(270);
        // South
        else if (q.keyIsDown(40)) shootBullet(90);
      }
    }
  };

  // Spawns Enemies at each of the spawn points designated by the cardinal directions.
  let spawnEnemies = (amount, location) => {
    for (let i = 0; i < amount; i++) {
      let e = new enemies.Sprite();
      if (location == "NORTH") {
        e.x = Math.round(
          q.random(q.width / 2 - q.width / 6, q.width / 2 + q.width / 12)
        );
        e.y = Math.round(q.random(-5, 5));
      } else if (location == "SOUTH") {
        e.x = Math.round(
          q.random(q.width / 2 - q.width / 6, q.width / 2 + q.width / 12)
        );
        e.y = Math.round(q.random(595, 605));
      } else if (location == "EAST") {
        e.x = Math.round(q.random(795, 805));
        e.y = Math.round(
          q.random(q.height / 2 - q.height / 6, q.height / 2 + q.height / 12)
        );
      } else {
        e.x = Math.round(q.random(-5, 5));
        e.y = Math.round(
          q.random(q.height / 2 - q.height / 6, q.height / 2 + q.height / 12)
        );
      }
    }
  };

  // Controls enemy behavior for the game.
  let enemyMovement = () => {
    for (let e of enemies) {
      e.direction = e.angleTo(player);
      e.speed = 2;
    }
  };

  // Helper function to create individual bullets
  // and determine their direction.
  let shootBullet = (directionBullet) => {
    let b = new bullets.Sprite(player.x, player.y);
    b.direction = directionBullet;
  };

  let openChest = (p, c) => {
    if (keyCount >= c.cost) {
      keyCount -= c.cost;
      c.cost = "";
      c.color = "black";
    }
  };
  let checkCollisions = () => {
    bullets.collides(enemies, hitEnemy);
    enemies.collides(player, loseLife);
    player.overlaps(keys, collectKey);
  };

  let checkBoundaries = () => {
    player.x = q.constrain(player.x, 10, q.width - 5);
    player.y = q.constrain(player.y, 10, q.height - 5);
    for (let k in keys) {
      q.constrain(k.x, 10, q.width);
      q.constrain(k.y, 10, q.height);
    }
  };

  /* ============================= Callback Functions ================================================= */

  // Controls key presses based on gamestate.
  let keyPressed = () => {
    playerShoot();
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
    lives--;
    p.delete();
    enemies.deleteAll();
    keys.deleteAll();
    makePlayer();
  };

  let collectKey = (p, k) => {
    keyCount++;
    k.delete();
  };
};
/* ======================== GUI Screen ==================================== */
const guiSketch = (q) => {
  let timePassed = 0;
  let t = 0;
  q.setup = () => {
    q.createCanvas(800, 30);
  };

  q.draw = () => {
    q.background(0);
    q.textAlign(q.CENTER, q.CENTER);
    timer();
    gui();
  };

  let gui = () => {
    q.fill(255);
    q.stroke(0);
    q.textSize(12);
    q.text("Lives: " + lives, 25, 15);
    q.text("Keys: " + keyCount, 100, 15);
    q.text("Round: " + rounds, 400, 15);
    q.text("Round Time: " + roundTime, 500, 15);
  };

  let timer = () => {
    if (roundTime == 0) {
      t = 0;
    } else {
      t++;
      if (t % 60 == 0) {
        roundTime--;
      }
    }
  };
};

let myQ5GUI = new Q5(guiSketch, "guiScreen");
let myQ5Game = new Q5(gameSketch, "playScreen");
