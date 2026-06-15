import { gameState } from "../gameState.js";

export const guiSketch = (q) => {
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
    q.text("lives: " + gameState.lives, 25, 15);
    q.text("Keys: " + gameState.keyCount, 100, 15);
    q.text("Round: " + gameState.rounds, 400, 15);
    q.text("Round Time: " + gameState.roundTime, 500, 15);
  };

  let timer = () => {
    if (gameState.roundTime == 0) {
      t = 0;
    } else {
      t++;
      if (t % 60 == 0) {
        gameState.roundTime--;
      }
    }
  };
};