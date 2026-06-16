/*
Player class contains the player sprite and methods for player behavior in the game. 
*/

export class Player {
    /*
    Player constructor. 
    sprite - instantiates a q5play sprite. 
    sprite.color - sets the color of the sprite. 
    sprite.stroke - sets the border color of the sprite.
    sprite.rotationLock - sets the sprite to not rotate when colliding with other sprites. 
    */
  constructor(q) {
    this.sprite = new q.Sprite(q.width / 2, (2 * q.height) / 3, 16);
    this.sprite.color = "blue";
    this.sprite.stroke = "black";
    this.sprite.rotationLock = true;

    this.fireRate = 60;

    // Create bullets group for player.
    this.bullets = new q.Group();
    this.bullets.d = 5;
    this.bullets.color = "black";
    this.bullets.stroke = "silver";
    this.bullets.speed = 6;
  }


    // Allow player to move around on the screen using WASD.
    movement(q) {
    this.sprite.speed = 0;
    // Up
    if (q.kb.pressing("w")) this.sprite.y = this.sprite.y - 3;
    // Left
    if (q.kb.pressing("a")) this.sprite.x = this.sprite.x - 3;
    // Down
    if (q.kb.pressing("s")) this.sprite.y = this.sprite.y + 3;
    // Right
    if (q.kb.pressing("d")) this.sprite.x = this.sprite.x + 3;
  }

  // Allows the player to shoot using arrow keys. shootBullet function is used to help with firing bullets in certain directions. 
  shoot(q) {
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
