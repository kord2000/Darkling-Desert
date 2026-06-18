/*
Enemies class - Used to create/manage enemy sprites in fightRounds.
*/

import { gameState } from "../gameState.js";

export class Enemies {
  /*
  Enemies Manager Constructor. 
  enemyGroup for controlling enemies. 

  keysGroup are used to drop random keys for player to collect to open chests.
  */
  constructor(q) {
    this.enemyGroup = new q.Group();
    this.enemyGroup.w = 16;
    this.enemyGroup.h = 16;
    this.enemyGroup.color = "red";
    this.enemyGroup.stroke = "white";
    this.enemyGroup.speed = 2;

    this.keysGroup = new q.Group();
    this.keysGroup.d = 8;
    this.keysGroup.color = "gray";
    this.keysGroup.stroke = "black";
    this.keysGroup.physics = "dynamic";
  }

  update = (q, target) => {
    this.spawnEnemies(q);
    this.movement(target);
  }

  // Spawns Enemies at each of the spawn points designated by the cardinal directions.
  spawnEnemies = (q) => {
    if (q.frameCount % 120 == 0 && gameState.roundTime > 0) {
      let enemyAmount = q.random([1, 2, 3]);
      let location = q.random(["NORTH", "SOUTH", "EAST", "WEST"]);

      for (let i = 0; i < enemyAmount; i++) {
        let x, y;

        switch (location) {
          case "NORTH":
            x = Math.round(
              q.random(q.width / 2 - q.width / 6, q.width / 2 + q.width / 12),
            );
            y = Math.round(q.random(-5, 5));
            break;

          case "SOUTH":
            x = Math.round(
              q.random(q.width / 2 - q.width / 6, q.width / 2 + q.width / 12),
            );
            y = Math.round(q.random(q.height - 5, q.height + 5));
            break;

          case "EAST":
            x = Math.round(q.random(q.width - 5, q.width + 5));
            y = Math.round(
              q.random(
                q.height / 2 - q.height / 6,
                q.height / 2 + q.height / 12,
              ),
            );
            break;

          case "WEST":
            x = Math.round(q.random(-5, 5));
            y = Math.round(
              q.random(
                q.height / 2 - q.height / 6,
                q.height / 2 + q.height / 12,
              ),
            );
            break;
        }

        let e = new this.enemyGroup.Sprite(x, y);
      }
    }
  };

  // Controls enemy behavior for the game.
  movement = (target) => {
    for (let e of this.enemyGroup) {
      e.direction = e.angleTo(target);
    }
  };
}
