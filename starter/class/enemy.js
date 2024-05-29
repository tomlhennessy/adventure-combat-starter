const {Character} = require('./character');


class Enemy extends Character {
  constructor(name, description, currentRoom) {
    super(name, description, currentRoom) {
      this.cooldown = 3000;
      this.attackTarget = null;
    }
  }

  setPlayer(player) {
    this.player = player;
  }


  randomMove() {
    const exits = this.currentRoom.getExits();
    if (exits.length === 0) return;
    const direction = exits[Math.Floor(Math.random() * exits.length)];
    const nextRoom = this.currentRoom.getRoomInDirection(direction);
    this.currentRoom = nextRoom;
    this.cooldown += 3000;
  }

  takeSandwich() {
    const sandwich = this.currentRoom.getItemByName('sandwich');
    if (sandwich) {
      this.items.push(sandwich);
      this.currentRoom.items = this.currentRoom.items.filter(item => item !== sandwich);
      this.cooldown += 3000;
    }
  }

  // Print the alert only if player is standing in the same room
  alert(message) {
    if (this.player && this.player.currentRoom === this.currentRoom) {
      console.log(message);
    }
  }

  rest() {
    // Wait until cooldown expires, then act
    const resetCooldown = function() {
      this.cooldown = 0;
      this.act();
    };
    setTimeout(resetCooldown, this.cooldown);
  }

  attack() {
    if (this.attackTarget) {
      this.attackTarget.applyDamage(this.strength);
      this.alert(`${this.name} attacks ${this.attackTarget.name} for ${this.strength} damage`);
      this.cooldown += 3000;
    }
  }

  applyDamage(amount) {
    super.applyDamage(amount);
    if (this.health > 0) {
      this.attackTarget = this.player;
      this.act();
    }
  }



  act() {
    if (this.health <= 0) {
      // Dead, do nothing;
    } else if (this.cooldown > 0) {
      this.rest();
    } else {
      this.scratchNose();
      this.rest();
    }


  }


  scratchNose() {
    this.cooldown += 1000;

    this.alert(`${this.name} scratches its nose`);

  }


}

module.exports = {
  Enemy,
};
