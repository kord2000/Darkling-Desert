import { gameState } from "../gameState.js";
import { Border } from "../gamePieces/Border.js";
import { Chests } from "../gamePieces/Chest.js";
import { Player } from "../gamePieces/Player.js";

export class RewardRound {
  constructor(q) {
    this.q = q;

    this.player = new Player(q);
    this.chests = new Chests(q);
    this.border = new Border(q);
  }

  setup = () => {
    this.chests.rewardSetup();
    this.border.setup();
    this.player.setup();
  };

  draw = () => {
    this.q.background(255);
    this.player.draw();

    this.player.sprite.collides(this.chests.group, this.openChest);
    this.border.entrances.color = "green";
    this.border.entrances.physics = "none";
    this.chests.ui();
  };

  openChest = (p, c) => {
    if (gameState.keyCount >= c.cost) {
      gameState.keyCount -= c.cost;
      c.cost = "";
      c.color = "black";
    }
  };
}
