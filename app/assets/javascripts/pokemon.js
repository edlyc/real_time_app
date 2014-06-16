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


  $("legend").closest(".1").find("legend").text(pokemon1.name);
  $("legend").closest(".1").find("#name").val(pokemon1.name);
  $("legend").closest(".1").find("#health").val(pokemon1.health);
  $("legend").closest(".1").find("#attack").val(pokemon1.stats);

  $("legend").closest(".2").find("legend").text(pokemon2.name);
  $("legend").closest(".2").find("#name").val(pokemon2.name);
  $("legend").closest(".2").find("#health").val(pokemon2.health);
  $("legend").closest(".2").find("#attack").val(pokemon2.stats);

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
