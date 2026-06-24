/*
Boundary Class: Contains the player, enemies, chests, etc. 
*/

export class Border {
  /*
  Boundary Constructor - Initializes the q5play group class for boundary sprites. 
  q - Stores the Q5 instance the player is being used in.
  group - Initializes the q5play group class creating a boundaries group. 
  group.color - Sets the color for the group. 
  group.stroke - Sets the color for the groups border. 
  group.physics - Sets the physics for the broundary group. 
  group.h - Sets the height of each boundary. 
  */
  constructor(q) {
    this.q = q;

    this.borderGroup = new q.Group();
    this.borderGroup.h = 10;

    this.boundary = new this.borderGroup.Group();
    this.boundary.color = "purple";
    this.boundary.stroke = "purple";
    this.boundary.physics = "static";

    this.entrances = new this.borderGroup.Group();
    this.entrances.color = 'red';
    this.entrances.stroke = 'black';
    this.entrances.physics = 'static';
  }
  /*
  setup - creates the barriers for the game screen. Creates openings for enemies to spawn from. 
  */
  setup = () => {

    let halfWidth = this.q.width/2;
    let thirdWidth = this.q.width / 3;
    let sixthWidth = this.q.width / 6;

    let halfHeight = this.q.height/2;
    let thirdHeight = this.q.height / 3;
    let sixthHeight = this.q.height / 6;
    


    // Top
    let boundaryTWR = this.createBoundary(sixthWidth, 5, thirdWidth, 0);
    let boundaryTWL = this.createBoundary(5 * sixthWidth, 5, thirdWidth, 0);
    let northEntrance = this.createEntrance(halfWidth, 5, thirdWidth, 0);

    // Bottom
    let boundaryBWR = this.createBoundary(sixthWidth, this.q.height - 5, thirdWidth, 0);
    let boundaryBWL = this.createBoundary(5 * sixthWidth, this.q.height - 5, thirdWidth, 0);
    let southEntrance = this.createEntrance(halfWidth, this.q.height - 5, thirdWidth, 0);

    // Left
    let boundaryTHL = this.createBoundary(5, sixthHeight, thirdHeight, 90);
    let boundaryBHL = this.createBoundary(5, 5 * sixthHeight, thirdHeight, 90);
    let westEntrance = this.createEntrance(5, halfHeight, thirdHeight, 90);

    // Right
    let boundaryTHR = this.createBoundary(this.q.width - 5, sixthHeight, thirdHeight, 90);
    let boundaryBHR = this.createBoundary(this.q.width - 5, 5 * sixthHeight, thirdHeight, 90);
    let eastEntrance = this.createEntrance(this.q.width - 5, halfHeight, thirdHeight, 90);
    
    this.boundary.overlaps(this.boundary);
  };

  /*
  createBoundary - Helper function for creating the boundary sprite. 
  x - Define the sprites x-position. 
  y - Define the sprites y-position. 
  width - Define the sprites width. 
  rotation - Define the sprites rotation. 
  */
  createBoundary = (x, y, width, rotation) => {
    let boundary = new this.boundary.Sprite(x, y);
    boundary.w = width;
    boundary.rotation = rotation;
    return boundary;
  };

  /*
  createEntrance - Helper function for creating entrances. 
  x - Define the sprites x-position. 
  y - Define the sprites y-position. 
  width - Define the sprites width. 
  rotation - Define the sprites rotation. 
  */

  createEntrance = (x, y, width, rotation) => {
    let entrance = new this.entrances.Sprite(x, y);
    entrance.w = width;
    entrance.rotation = rotation;
  }
}
