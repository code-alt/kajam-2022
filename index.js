var express = require('express');
var app = express();
const port = 3000;
app.use(express.static(__dirname + '/'));
// random kind messages lol :)
var messages = [
    'Thanks for playing!',
    "You're a winner!",
    "You're very cool!",
    "You're the best :)",
    "You're a beautiful person <3",
    "You're a great person :)",
];
var message = messages[Math.floor(Math.random() * messages.length)];
var server = app.listen(port, function() {
    console.log('listening on port '+port+' :) - http://localhost:'+port+'/ - random kind message: ' + message);
});