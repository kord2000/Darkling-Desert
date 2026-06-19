/*
Boundary Class: Contains the player, enemies, chests, etc. 
*/

export class Boundary {
  /*
  Boundary Constructor - Initializes the q5play group class for boundary sprites. 
  group: Initializes the q5play group class creating a boundaries group. 
  group.color: Sets the color for the group. 
  group.stroke: Sets the color for the groups border. 
  group.physics: Sets the physics for the broundary group. 
  group.h: Sets the height of each boundary. 
  */
  constructor(q) {
    this.group = new q.Group();
    this.group.color = "purple";
    this.group.stroke = "purple";
    this.group.physics = "static";
    this.group.h = 10;
  }
  /*
  setup - creates the barriers for the game screen. Creates openings for enemies to spawn from. 
  */
  setup = (q) => {
    let thirdWidth = q.width / 3;
    let sixthWidth = q.width / 6;

    let thirdHeight = q.height / 3;
    let sixthHeight = q.height / 6;

    // Top
    let boundaryTWR = this.createBoundary(sixthWidth, 5, thirdWidth, 0);
    let boundaryTWL = this.createBoundary(5 * sixthWidth, 5, thirdWidth, 0);

    // Bottom
    let boundaryBWR = this.createBoundary(sixthWidth, q.height - 5, thirdWidth, 0);
    let boundaryBWL = this.createBoundary(5 * sixthWidth, q.height - 5, thirdWidth, 0);

    // Left
    let boundaryTHL = this.createBoundary(5, sixthHeight, thirdHeight, 90);
    let boundaryBHL = this.createBoundary(5, 5 * sixthHeight, thirdHeight, 90);
    // Right
    let boundaryTHR = this.createBoundary(q.width - 5, sixthHeight, thirdHeight, 90);
    let boundaryBHR = this.createBoundary(q.width - 5, 5 * sixthHeight, thirdHeight, 90);
  };

  /*
  createBoundary - Helper function for creating the boundary sprite. 
  x - Define the sprites x-position. 
  y - Define the sprites y-position. 
  width - Define the sprites width. 
  rotation - Define the sprites rotation. 
  */
  createBoundary = (x, y, width, rotation) => {
    let boundary = new this.group.Sprite(x, y);
    boundary.w = width;
    boundary.rotation = rotation;
    return boundary;
  };
}
