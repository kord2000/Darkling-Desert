/* 
Chests class - Vendor to purchase items!
*/

export class Chests {
  constructor(q) {
    this.group = new q.Group();
    this.group.w = 16;
    this.group.h = 16;
    this.group.color = "#954535";

    

    this.initialized = false;
  }

  

  // Creates three chests the player can open using keys.
  rewardSetup = (q) => {
    for (let i = 0; i < 3; i++) {
      let c = new this.group.Sprite(
        q.width / 3 + (i * q.width) / 6,
        q.height / 2,
      );
      c.cost = generateCost();
      c.reward = this.itemGenerate(q, c.cost);
      console.log(`Chest # ${i + 1}: ${c.reward}`);
    }
    this.initialized = true;
  };


  // generateCost - Helps generate a random cost for teh chest between 1 and 3.
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
    // chest UI - dsiplays values.
    q.fill(0);
    q.stroke(0);
    q.textAlign(q.CENTER, q.CENTER);
    for (let chest of this.group) {
      q.text(chest.cost, chest.x, chest.y - chest.h / 2 - 10);
    }
  }
}
