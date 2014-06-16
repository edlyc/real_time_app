function Pokemon(name, health, stats) {
  this.name = name;
  this.health = health;
  this.stats = stats;
}

Pokemon.prototype = {
  attack: function(opponent) {
    if (this.health >= 0 && opponent.health >= 0) {

      // If damage would take opponent below 0, only take the opponent's health to 0.
      opponent.health -= this.stats > opponent.health ? opponent.health : this.stats;
    }
  }
};

var pokemon1 = new Pokemon("Bulbasaur", 40, 15);
var pokemon2 = new Pokemon("Charmander", 50, 12);
var pokemon3 = new Pokemon("Pikachu", 45, 15);
var pokemon4 = new Pokemon("Richurtle", 80, 5);


// function check() {

//   if (pokemon1.health <= 0) {
//     alert(pokemon2.name + ' wins!');
//   } else if (pokemon2.health <= 0) {
//     alert(pokemon1.name + ' wins!');
//   }
// };

// function update() {
//   $("legend").closest(".1").find("#health").val(pokemon1.health);
//   $("legend").closest(".2").find("#health").val(pokemon2.health);
// };

$(document).ready(function() {

  var pokemonList = [pokemon1, pokemon2];

  for ( var i = 0; i < 2; i++ ) {
    var pokemon = pokemonList[i];

    $("#pokemon-" + (i + 1) + "-legend").text(pokemon.name);
    $("#pokemon-" + (i + 1) + "-name").val(pokemon.name);
    $("#pokemon-" + (i + 1) + "-health").val(pokemon.health);
    $("#pokemon-" + (i + 1) + "-attack").val(pokemon.stats);
  }

  $(".1").on("click", ".submit", function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    pokemon1.attack(pokemon2);
  });

  $(".2").on("click", ".submit", function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    pokemon2.attack(pokemon1);
  });
});
