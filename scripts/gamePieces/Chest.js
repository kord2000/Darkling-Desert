/* 
Chests class - Vendor to purchase items!
*/

export class Chests {
  constructor(q) {
    this.chestGroup = new q.Group();
    this.chestGroup.w = 16;
    this.chestGroup.h = 16;
    this.chestGroup.color = "#954535";

    this.itemGroup = new q.Group();
    this.itemGroup.d = 8;
    this.itemGroup.color = "green";
    this.itemGroup.stroke = "black";

    this.initialized = false;
  }

  // Creates three chests the player can open using keys.
  rewardSetup = (q) => {
    for (let i = 0; i < 3; i++) {
      let c = new this.chestGroup.Sprite(
        q.width / 3 + (i * q.width) / 6,
        q.height / 2,
      );
      c.cost = this.generateCost();
      c.reward = this.itemGenerate(q, c.cost);
      c.open = false;
      console.log(`Chest # ${i + 1}: ${c.reward} Cost: ${c.cost}`);
    }
    

    this.initialized = true;
  };

  // generateCost - Helps generate a random cost for a chest between 1 and 3.
  generateCost = () => {
    const minCeiled = 1;
    const maxFloored = 3;
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
  };

  // Helps generate a random item for the chest
  // based on the cost of the item.
  itemGenerate = (q, cost) => {
    let randomItem = Math.random();
    switch (cost) {
      case 1:
        if (randomItem < 0.5) {
          return "health";
        } else {
          return "revolver";
        }
        break;
      case 2:
        if (randomItem < 0.75) {
          return "health";
        } else {
          return "autoPistol";
        }
        break;
      case 3:
        if (randomItem < 0.5) {
          return "rifle";
        } else {
          return "shotgun";
        }
    }
  };

  ui(q) {
    // chest UI - displays values.
    console.log("Chest UI");
    q.fill(0);
    q.stroke(0);
    q.textAlign(q.CENTER, q.CENTER);
    q.textSize(12);
    for (let chest of this.chestGroup) {
      q.text(chest.cost, chest.x, chest.y - chest.h / 2 - 10);
    }
  }
}
