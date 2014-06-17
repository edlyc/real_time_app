//the opponent's pokemon attacks
  $( '.attacked' ).on( 'click', function() {
    $( '.poke' ).html('<%= image_tag("bulbasaur/bulba_bounce.gif") %><% audio_tag("music/menusound.wav", "music/tackle.wav"), autoplay: true %>');
    setTimeout(function(){
      $( '.otherpoke' ).html( '<img src="bulba_back_blink.gif" alt=""> ');
      var pokehealth = $('.pokehealthbar');
      pokehealth.val(pokehealth.val() - 15);
    }, 700);
  });

  //our pokemon attacks and does
  $( '.attack' ).on( 'click', function() {
    $( '.otherpoke' ).html( '<img src="bulba_tackle2.gif" alt=""><audio src="menusound.wav" autoplay="autoplay"></audio>');

    setTimeout(function(){
      $( '.poke' ).html( '<img src="bulba_blink.gif" alt=""> ');
      var otherhealth = $('.otherhealthbar');
      otherhealth.val(otherhealth.val() - 15);
    }, 500);
  });
