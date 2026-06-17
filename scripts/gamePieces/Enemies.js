/*
Enemies class - Used to create enemies.
*/


export class Enemies {
  constructor(q) {
    this.group = new q.Group();
    this.group.w = 16;
    this.group.h = 16;
    this.group.color = "red";
    this.group.stroke = "white";
    this.group.speed = 2;
  } 

  // Spawns Enemies at each of the spawn points designated by the cardinal directions.
  spawnEnemies = (q) => {
    if (q.frameCount % 120 == 0) {
    let enemyAmount = q.random([1, 2, 3]);
    let location = q.random(["NORTH", "SOUTH", "EAST", "WEST"]);
        for (let i = 0; i < enemyAmount; i++) {
            let x, y;
            if (location == "NORTH") {
              x = Math.round(
                q.random(q.width / 2 - q.width / 6, q.width / 2 + q.width / 12),
              );
              y = Math.round(q.random(-5, 5));
            } else if (location == "SOUTH") {
              x = Math.round(
                q.random(q.width / 2 - q.width / 6, q.width / 2 + q.width / 12),
              );
              y = Math.round(q.random(q.height - 5, q.height + 5));
            } else if (location == "EAST") {
              x = Math.round(q.random(795, 805));
              y = Math.round(
                q.random(q.height / 2 - q.height / 6, q.height / 2 + q.height / 12),
              );
            } else {
              x = Math.round(q.random(-5, 5));
              y = Math.round(
                q.random(q.height / 2 - q.height / 6, q.height / 2 + q.height / 12),
              );
            }
            let e = new this.group.Sprite(x, y);
            console.log("Enemy spawned: ", e.x, e.y);
        }
    }
    };

    // Controls enemy behavior for the game.
      movement = (target) => {
        for (let e of this.group) {
            e.direction = e.angleTo(target);
        }
      };

}
