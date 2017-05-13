var express = require('express');
var app = express();
var port = process.env.PORT || 8080;


var arDrone = require('ar-drone');
var client  = arDrone.createClient();
client.createRepl();


// app.get('/api/users', function(req, res) {
//   var user_id = req.param('id');
//   var token = req.param('token');
//   var geo = req.param('geo');

//   res.send(user_id + ' ' + token + ' ' + geo);
// });

// Random Fun Shit




//
app.post('/drone/flightdemp', function(req, res) {
    console.log('Testing Flight Demo');
    client.takeoff();

    client
      .after(5000, function() {
        this.clockwise(0.5);
      })
      .after(3000, function() {
        this.stop();
        this.land();
      });
});


app.post('/drone/blink', function(req, res) {
  client.animateLeds('blinkRed', 5, 2)
  console.log('in here');
});


// TODO. Handle Raw TCP/UDP Packets

app.listen(port);
console.log('Server started! At http://localhost:' + port);

