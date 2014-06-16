function Pokemon( attributes ) {
  this.name = attributes.name;
  this.maxHealth = attributes.health;
  this.health = this.maxHealth;
  this.attackStat = attributes.attackStat;
}

Pokemon.prototype = {
  pokemonList: [{
    name: "Bulbasaur",
    health: 40,
    attackStat: 15
  },
  {
    name: "Charmander",
    health: 50,
    attackStat: 12
  },
  {
    name: "Pikachu",
    health: 45,
    attackStat: 15
  },
  {
    name: "Richurtle",
    health: 80,
    attackStat: 5
  }],
  attack: function() {
    var hitRoll = Math.random();

    // If the roll is too low, the attack is a miss
    if ( hitRoll < 0.05 ) {
      return 0;
    // Most rolls will do between 75% - 100% damage.
    } else if ( hitRoll < 0.95 ) {
      return Math.floor( this.attackStat * (0.75 + Math.random() * 0.25) );
    // If the roll is high, the attack does double damage.
    } else {
      return this.attackStat * 2;
    }
  },
  receiveDamage: function( damage ) {
    this.health -= damage > this.health ? this.health : damage;
  }
};
