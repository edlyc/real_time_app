// the opponent's pokemon attacks
//   $( '#poo' ).on( 'click', function() {
//     $( '#pooke' ).html('<%= image_tag("bulbasaur/bulba_bounce.gif") %><% audio_tag("music/menusound.wav", "music/tackle.wav"), autoplay: true %>');
//     setTimeout(function(){
//       $( '#otherpoke' ).html( '<img src="bulba_back_blink.gif" alt=""> ');
//       var pookehealth = $('#pookehealthbar');
//       pookehealth.val(pookehealth.val() - 15);
//     }, 700);
//   });
//   //our pokemon attacks and does
//   $( '#poo3' ).on( 'click', function() {
//     $( '#otherpoke' ).html( '<img src="bulba_tackle2.gif" alt=""><audio src="menusound.wav" autoplay="autoplay"></audio>');

//     setTimeout(function(){
//       $( '#pooke' ).html( '<img src="bulba_blink.gif" alt=""> ');
//       var otherhealth = $('#otherhealthbar');
//       otherhealth.val(otherhealth.val() - 15);
//     }, 500);
//   });
// });

//animations
function BattleView() {}

BattleView.prototype = {
  updateView: function( data ) {
    this.updateHealthBar( data );

    // Attack animations have a naming convention
    // For an attack called 'foobar'
    // The method will be 'foobarAnimate'
    // convention over configuration
    var attackMethod = this[data.attackType + 'Animate'];
    attackMethod();
  },
  myPokemonFaints: function(){
    var $mypokemon = $('.my-pokemon img');
    $mypokemon.toggleClass('animated fadeOutDown');
  },
  theirPokemonFaints: function(){
    var $theirpokemon = $('.their-pokemon img');
    $theirpokemon.toggleClass('animated rollOut');
  },
  updateHealthBar: function(data){
    var updateTarget = data.targetIsSelf ? ".my-healthbar" : ".their-healthbar";
    $( updateTarget ).val( data.health / data.maxHealth * 100 );
  },
  tackleAnimate: function(){

  }
};
