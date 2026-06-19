/*
Player class contains the player sprite and methods for player behavior in the game. 
*/

export class Player {
  /*
    Player constructor. What the user controls in the game.
    sprite - instantiates a q5play sprite. 
    sprite.color - sets the color of the sprite. 
    sprite.stroke - sets the border color of the sprite.
    sprite.rotationLock - sets the sprite to not rotate when colliding with other sprites. 
    fireRate - controls the rate at which bullets are fired.
    bullets - instantiates a q5play group to create projectiles for the player. 
    bullets.d - sets the diameter of the bullets. 
    bullets.color - sets the color of each sprite in the group. 
    bullets.stroke - sets the border color for each sprite in the group. 
    bullets.speed - sets the speed for each bullet. 
    */
  constructor(q) {
    this.sprite = null;

    this.fireRate = 60;

    this.bullets = new q.Group();
    this.bullets.d = 5;
    this.bullets.color = "black";
    this.bullets.stroke = "silver";
    this.bullets.speed = 6;
  }
  /* -------------------------- Methods --------------------------------------------- */
  /*
  setup - creates the player sprite. 
  */
  setup = (q) => {
    this.sprite = new q.Sprite(q.width / 2, (2 * q.height) / 3, 16);
    this.sprite.color = "blue";
    this.sprite.stroke = "black";
    this.sprite.rotationLock = true;

    this.sprite.overlaps(this.bullets);
  }

  /*
  draw - controls the sprites behavior. Allows movement with WASD and shooting with arrow keys. 
  */
  draw = (q) => {
    this.movement(q);
    this.shoot(q);
  }

  /*
    movement - Allows the player to move around the arena using WASD.
    */
  movement = (q) => {
    this.sprite.speed = 0;
    // Up
    if (q.keyIsDown("w")) this.sprite.y = this.sprite.y - 3;
    // Left
    if (q.keyIsDown("a")) this.sprite.x = this.sprite.x - 3;
    // Down
    if (q.keyIsDown("s")) this.sprite.y = this.sprite.y + 3;
    // Right
    if (q.keyIsDown("d")) this.sprite.x = this.sprite.x + 3;
  }

  /*
  shoot - Allows the player to shoot using arrow keys. shootBullet function is used to help with firing bullets in certain directions. 
  */
  shoot = (q) => {
    if (q.frameCount % this.fireRate == 0) {
      // NorthEast
      if (q.keyIsDown(39) && q.keyIsDown(38)) this.shootBullet(315);
      // SouthEast
      else if (q.keyIsDown(39) && q.keyIsDown(40)) this.shootBullet(45);
      // North West
      else if (q.keyIsDown(37) && q.keyIsDown(38)) this.shootBullet(225);
      // South West
      else if (q.keyIsDown(37) && q.keyIsDown(40)) this.shootBullet(135);
      else {
        // East
        if (q.keyIsDown(39)) this.shootBullet(0);
        // West
        else if (q.keyIsDown(37)) this.shootBullet(180);
        // North
        if (q.keyIsDown(38)) this.shootBullet(270);
        // South
        else if (q.keyIsDown(40)) this.shootBullet(90);
      }
    }
  }

  // Helper function to create individual bullets
  // and determine their direction.
  shootBullet = (directionBullet) => {
    let b = new this.bullets.Sprite(this.sprite.x, this.sprite.y);
    b.direction = directionBullet;
  };
}
