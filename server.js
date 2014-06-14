var express = require( 'express' );
var http = require( 'http' );

var app = express();
http.createServer( app );

// Listen on port 8080
app.listen( 8080 );

// Set the root path to index.html
app.get( '/', function( request, response ) {
  response.sendfile( __dirname + "/index.html" );
});
