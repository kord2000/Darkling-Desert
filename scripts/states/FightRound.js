import { Player } from "../gamePieces/Player.js";
import { Enemies } from "../gamePieces/Enemies.js";
import { Border } from "../gamePieces/Border.js";
import { gameState } from "../gameState.js";
import { RewardRound } from "./RewardRound.js";

export class FightRound {
  constructor(q) {
    this.q = q;
    this.player = new Player(this.q);

    this.bullets = this.player.bullets;
    this.enemiesManager = new Enemies(this.q);
    this.keys = this.enemiesManager.keysGroup;

    this.border = new Border(this.q);
  }

  setup() {
    this.player.setup();
    this.border.setup();

    this.bullets.overlaps(this.border.borderGroup);
    this.bullets.overlaps(this.keys);
    this.enemiesManager.enemyGroup.overlaps(this.border.entrances);
  }

  draw() {
    this.q.background(255);

    this.player.draw();

    this.enemiesManager.update(this.player.sprite);

    // Physics
    this.checkCollisions();
  }

  checkCollisions = () => {
    this.bullets.collides(this.enemiesManager.enemyGroup, this.hitEnemy);
    this.enemiesManager.enemyGroup.collides(this.player.sprite, this.loseLife);
    this.player.sprite.overlaps(this.keys, this.collectKey);
  };

  // Deletes enemy and bullets.
  hitEnemy = (b, e) => {
    // Chance to spawn a key.
    if (Math.random() < 0.25) {
      let k = new this.enemiesManager.keysGroup.Sprite(e.x, e.y);
    }
    b.delete();
    e.delete();
  };

  // Player loses a life and the level resets.
  loseLife = (e, p) => {
    gameState.lives--;
    this.enemiesManager.enemyGroup.deleteAll();
    this.enemiesManager.keysGroup.deleteAll();
    this.player.resetSprite();
  };

  collectKey = (p, k) => {
    gameState.keyCount++;
    k.delete();
  };
}
