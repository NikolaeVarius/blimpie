var express = require('express');
var app = express();
var port = process.env.PORT || 8080;


var arDrone = require('ar-drone');
var client  = arDrone.createClient();
client.createRepl();


app.get('/api/users', function(req, res) {
  var user_id = req.param('id');
  var token = req.param('token');
  var geo = req.param('geo');

  res.send(user_id + ' ' + token + ' ' + geo);
});


// POST http://localhost:8080/api/users
// parameters sent with
app.post('/drone/blink', function(req, res) {
  client.animateLeds('blinkRed', 5, 2)
  console.log('in here');
});



app.listen(port);
console.log('Server started! At http://localhost:' + port);

