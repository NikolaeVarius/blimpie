var arDrone = require('ar-drone');
var client  = arDrone.createClient();
var express = require('express');
var app = express();
var path = require('path');
var cv = require('opencv');
var pngStream = client.getPngStream(); //Fetch real-time video feed from quad
var http = require('http'); //Allows video to be displayed to browser


var lastPng; // Holding the latest still frame
pngStream.on('data', function(imageData) {
lastPng = imageData;
});

app.get('/getFace', function(req, res){ //getFace will be our route to an image that the drone will hone in on
  res.sendfile('views/index.html');
  client
  //add some more flight moves here...
  .after(5000, function() {
    cv.readImage(imageStream, function(err, im){
      im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
        console.log("faces " + faces);
        if (faces.length > 0){
          for(i=0; i<faces.length; i++){
            var x = faces[i];
            im.elipse(// finds a face and will draw a red circle around the face
              x.x + x.width/2,
              x.y + x.height/2,
              x.width/2 + x.height/2
            );
          }
          im.save('/views/detectedFace.jpg'); // saves the image
        }
        else {
          im.save('/views/detectedFace.jpg');
        }
      });
    });
  });
  //more flight commands here
});
var server = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'image/png'});
  res.end(lastPng);
});
require('ar-drone-png-stream')(client, { port: 8000 }); //npm install ar-drone-png-stream
