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

  setup(q) {
    // Top
    let boundaryTWR = new this.group.Sprite(q.width / 6, 5);
    let boundaryTWL = new this.group.Sprite((5 * q.width) / 6, 5);
    boundaryTWR.w = q.width / 3;
    boundaryTWL.w = q.width / 3;
    // Bottom
    let boundaryBWR = new this.group.Sprite(q.width / 6, q.height - 5);
    let boundaryBWL = new this.group.Sprite((5 * q.width) / 6, q.height - 5);
    boundaryBWR.w = q.width / 3;
    boundaryBWL.w = q.width / 3;
    // Left
    let boundaryTHL = new this.group.Sprite(5, q.height / 6);
    let boundaryBHL = new this.group.Sprite(5, (5 * q.height) / 6);
    boundaryTHL.w = q.height / 3;
    boundaryTHL.rotation = 90;
    boundaryBHL.w = q.height / 3;
    boundaryBHL.rotation = 90;
    // Right
    let boundaryTHR = new this.group.Sprite(q.width - 5, q.height / 6);
    let boundaryBHR = new this.group.Sprite(q.width - 5, (5 * q.height) / 6);
    boundaryTHR.w = q.height / 3;
    boundaryTHR.rotation = 90;
    boundaryBHR.w = q.height / 3;
    boundaryBHR.rotation = 90;
  }
}
