/*
Enemies class - Used to create/manage enemy sprites in fightRounds.
*/

import { gameState } from "../gameState.js";

export class Enemies {
  /*
  Enemies Manager Constructor. 
  q - Stores the Q5 instance the player is being used in.
  enemyGroup - q5play Group class used to keep track of enemies.
  enemyGroup.w - width of each enemy sprite. 
  enemyGroup.h - height of each enemy sprite.
  enemyGroup.color - Color for each enemy. 
  enemyGroup.stroke  - Border color for each enemy. 
  enemyGroup.speed - Sets the speed for each enemy.  


  keysGroup - used to drop random keys for player to collect to open chests.
  */
  constructor(q) {
    this.q = q;
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

  update = (target) => {
    this.spawnEnemies();
    this.movement(target);
  };

  // Spawns Enemies at each of the spawn points designated by the cardinal directions.
  spawnEnemies = () => {
    if (this.q.frameCount % 120 == 0 && gameState.roundTime > 0) {
      let enemyAmount = this.q.random([1, 2, 3]);
      let location = this.q.random(["NORTH", "SOUTH", "EAST", "WEST"]);

      for (let i = 0; i < enemyAmount; i++) {
        let x, y;

        switch (location) {
          case "NORTH":
            x = Math.round(
              this.randomLocation(
                this.q.width / 2 - this.q.width / 6,
                this.q.width / 2 + this.q.width / 12,
              ),
            );
            y = Math.round(this.randomLocation(-5, 5));
            break;

          case "SOUTH":
            x = Math.round(
              this.randomLocation(
                this.q.width / 2 - this.q.width / 6,
                this.q.width / 2 + this.q.width / 12,
              ),
            );
            y = Math.round(
              this.randomLocation(this.q.height - 5, this.q.height + 5),
            );
            break;

          case "EAST":
            x = Math.round(
              this.randomLocation(this.q.width - 5, this.q.width + 5),
            );
            y = Math.round(
              this.randomLocation(
                this.q.height / 2 - this.q.height / 6,
                this.q.height / 2 + this.q.height / 12,
              ),
            );
            break;

          case "WEST":
            x = Math.round(this.randomLocation(-5, 5));
            y = Math.round(
              this.randomLocation(
                this.q.height / 2 - this.q.height / 6,
                this.q.height / 2 + this.q.height / 12,
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

  randomLocation = (min, max) => {
    return Math.random() * (max - min) + min;
  };
}
