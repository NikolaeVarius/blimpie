var express = require('express');
var app = express();
var port = process.env.PORT || 8100;
//var sleep = require('sleep');
var fs = require('fs');
var path = require('path');

var arDrone = require('ar-drone');
var client  = arDrone.createClient();
var JSFtp = require("jsftp");
var PubNub = require('pubnub')

// Start FTP on Start because I'm Lazy
var ftp = new JSFtp({
  host: "192.168.1.1",
  user: 'root',
  port: '5551'
});

// Initialize Pub nub
var pubnub = new PubNub({
    subscribeKey: "sub-c-b05c954e-3857-11e7-9843-0619f8945a4f",
    publishKey: "pub-c-449ab48d-546c-4ff5-887e-21ff713cd73d",
    logVerbosity: true,
    ssl: true,
    presenceTimeout: 130
})


ftp.on('jsftp_debug', function(eventType, data) {
  console.log('DEBUG: ', eventType);
  console.log(JSON.stringify(data, null, 2));
});
//client.createRepl();
// app.get('/api/users', function(req, res) {
//   var user_id = req.param('id');
//   var token = req.param('token');
//   var geo = req.param('geo');

//   res.send(user_id + ' ' + token + ' ' + geo);
// });

// Random Fun Shit

// Get Drone Status
app.get('/drone/status', function(req,res) {
    client.on('navdata', res.send());
})


// Fun Shit
app.post('/drone/flightdemo', function(req, res) {
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

//Movement


// Transmit Data Functions

// Take Arbitrary String and send as data via binary
app.post('/drone/transmit', function(req, res) {
    var string  = 'Hello World';
    var raw = utf8ToBin(string);

    for (var i = 0, len = raw.length; i < len; i++) {
        var bit = raw[i];
        var led_color = bitColor(bit)
        console.log('Blinking ' + led_color + ' for ' + bit)
        client.animateLeds(led_color, 1, 1)
        //sleep(1)
    }
});


// Convert a 'bit' into LED color
function bitColor(bit) {
    if (bit === '1') {
        return 'blinkGreen'
    } else if (bit === '0') {
        return 'blinkRed'
    } else {
        return 'blank'
    }
}

// Convert String to Binary
var utf8ToBin = function( s ){
    s = unescape( encodeURIComponent( s ) );
    var chr, i = 0, l = s.length, out = '';
    for( ; i < l; i ++ ){
        chr = s.charCodeAt( i ).toString( 2 );
        while( chr.length % 8 != 0 ){ chr = '0' + chr; }
        out += chr;
    }
    return out;
};

// Convert Binary to String
var binToUtf8 = function( s ){
    var i = 0, l = s.length, chr, out = '';
    for( ; i < l; i += 8 ){
        chr = parseInt( s.substr( i, 8 ), 2 ).toString( 16 );
        out += '%' + ( ( chr.length % 2 == 0 ) ? chr : '0' + chr );
    }
    return decodeURIComponent( out );
};

// FTP Functions

// Test FTP FUn
// var data = {"config":{}, "cpu":{}, "mem":{}};
// loadFtpData("/data/config.ini", DELIMITER_EQUALS, data.config);
// loadFtpData("/proc/cpuinfo", DELIMITER_COMMA, data.cpu);
// loadFtpData("/proc/meminfo", DELIMITER_COMMA, data.mem);
// function loadFtpData(path, delimiter, target ) {
//     var str = ""; // Will store the contents of the file.
//     ftp.get(path, function(err, socket) {
//         if (err) return;
//             socket.on("data", function(d) { str += d.toString(); })
//             socket.on("close", function(hadErr) {
//             if (hadErr) { console.error("Failed to retrieving the file: " + path); }
//             else { nvp2Json(str, delimiter, target); }
//         });
//         socket.resume();
//     });
// }


app.post('/drone/ftp/upload', function(req, res) {
    var dirString = path.dirname(fs.realpathSync(__filename));
    console.log('directory to start walking...', dirString);

    ftp.put('./uploads/upload_test', '/data/video/txt', function(hadError) {
      if (!hadError) {
        console.log("File transferred successfully!");
      } else {
        console.log(hadError)
      }
    });
});

app.get('/drone/ftp/download/filename', function(req, res) {
    var filename = 'test'
  ftp.get('/data/video' + filename, './downloads/' + filename, function(hadErr) {
    if (hadErr)
      console.error('There was an error retrieving the file.');
    else
      console.log('File copied successfully!');
  });
})

app.publishStatus('/drone/status/publish', function(req,res)) {
    pubnub.publish(
        {
            message: {
                such: 'object'
            },
            channel: 'drone_status',
            sendByPost: false, // true to send via post
            storeInHistory: false, //override default storage options
            meta: {
                "cool": "meta"
            }   // publish extra meta with the request
        },
        function (status, response) {
            if (status.error) {
                // handle error
                console.log(status)
            } else {
                console.log("message Published w/ timetoken", response.timetoken)
            }
        }
    );
}

app.subscribe('', function(req,res) {
    pubnub.subscribe({
        channels: ['drone_statusl'],
        withPresence: true // also subscribe to presence instances.
    })
})
// Flight "Control"
app.post('/drone/fly/up', function(req, res) {
    client.up('1')
});

app.post('/drone/fly/down', function(req, res) {
    client.down('1')
});


// Set Home Base to fly back to
app.post('/drone/setHome', functop() {

})


//Testing Functions
// Test LED
app.post('/drone/blinkdemo', function(req, res) {
  client.animateLeds('blinkRed', 5, 2)
  console.log('in here');
});

// Start Dumping NavData

app.post('/drone/demodata', function(req, res) {
    client.config('general:navdata_demo', 'FALSE');
}




// TODO. Handle Raw TCP/UDP Packets

// Listen to everything ever considered harmful
app.listen(port, '0.0.0.0');
console.log('Server started! At http://localhost:' + port);

