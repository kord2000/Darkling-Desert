import { gameState, resetGameState } from "../gameState.js";
import { FightRound } from "../states/FightRound.js";
import { RewardRound } from "../states/RewardRound.js";

/*======================== Gameplay Screen ========================*/
export const gameSketch = (q) => {
  let fightRound;

  q.setup = () => {
    q.createCanvas(1200, 900);

    fightRound = new FightRound(q);
    rewardRound = new RewardRound(q);
    fightRound.setup();
  };

  q.draw = () => {
    console.log(`Current Game State: ${gameState.currentState}`);

    switch (gameState.currentState) {
      case "fightRound":
        fightRound.draw();

        if (
          gameState.roundTime <= 0 &&
          fightRound.enemiesManager.enemyGroup.length == 0
        ) {
          gameState.roundTime = 0;
          q.allSprites.deleteAll();
          gameState.currentState = "rewardRound";
          rewardRound.setup()
        } else if (gameState.lives == 0) {
          gameState.currentState = "gameOver";
          this.q.allSprites.deleteAll();
        }

        break;
      case "rewardRound":
        q.background(255);
        rewardRound.draw();
        
        break;
      case "gameOver":
        q.background(0);
        gameOver();
        break;
    }
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

  let rewardRound = () => {
    if (!chests.initialized) chests.rewardSetup();

    player.sprite.collides(chests.group, openChest);

    chests.ui();
  };

};
