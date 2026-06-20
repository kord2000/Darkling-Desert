import { gameState, resetGameState } from "../gameState.js";
import { Player } from "../gamePieces/Player.js";
import { Boundary } from "../gamePieces/Boundary.js";
import { Enemies } from "../gamePieces/Enemies.js";
import { Chests } from "../gamePieces/Chest.js";
import { FightRound } from "../states/FightRound.js";

/*======================== Gameplay Screen ========================*/
export const gameSketch = (q) => {

  let fightRound;

  q.setup = () => {
  q.createCanvas(1200, 900);

  fightRound = new FightRound(q);

  fightRound.setup();
  }
  // // Create player.
  // player = new Player(q);
  // player.setup(q);

  // // Assign bullets to player bullets.
  // bullets = player.bullets;

  // // Create enemies manager.
  // enemiesManager = new Enemies(q);
  // enemies = enemiesManager.enemyGroup;
  // keys = enemiesManager.keysGroup;

  // // Create chests.
  // chests = new Chests(q);

  // // Create Boundaries
  // boundary = new Boundary(q);
  // boundary.setup(q);

  // bullets.overlaps(boundary.group);
  // bullets.overlaps(keys);
  // bullets.collides(chests.group, (b, c) => b.delete());
  // boundary.group.overlaps(boundary.group);

  q.draw = () => {
    console.log(`Current Game State: ${gameState.currentState}`);

    switch (gameState.currentState) {
      case "fightRound":
        fightRound.draw();
        // q.background(255);

        // // Checks updates to gameState.
        // playRound();

        // // Checks for player updates every frame.
        // player.draw(q);

        // // Enemy AI - Updates every frame.
        // enemiesManager.update(q, player.sprite);
        break;
      case "rewardRound":
        q.background(255);
        player.draw();
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
      resetGameState();
      fightRound.setup();
    }
  };

  let playRound = () => {
    // if (gameState.roundTime <= 0 && enemies.length == 0) {
    //   gameState.roundTime = 0;
    //   gameState.currentState = "rewardRound";
    // } else if (gameState.lives == 0) {
    //   gameState.currentState = "gameOver";
    //   q.allSprites.deleteAll();
    // }
    // Physics
    // checkCollisions();
    // checkBoundaries();
  };

  let rewardRound = () => {
    if (!chests.initialized) chests.rewardSetup();

    player.sprite.collides(chests.group, openChest);

    chests.ui();
  };

  /* ===================================== Game Mechanic Functions =========================================== */

  let openChest = (p, c) => {
    if (gameState.keyCount >= c.cost) {
      gameState.keyCount -= c.cost;
      c.cost = "";
      c.color = "black";
    }
  };
};
