var arDrone = require('ar-drone');
var client  = arDrone.createClient();

console.log('Preparing for take off');
client.takeoff();

client
  .after(5000, function() {
    console.log('Preparing to turn clockwise by .5');
    this.clockwise(0.5);
  })
  .after(3000, function() {
    console.log('Preparing to go up by a speed of 1');
    this.up(1);
  })
  .after(2000, function() {
    console.log('Preparing to flipAhead by 500ms');
    this.animate('flipAhead',500);
  })
  .after(4000, function() {
    console.log('Preparing to flipBehind by 500ms');
    this.animate('flipBehind', 500);
  })
  .after(4000, function() {
    console.log('Preparing to flipLeft by 500ms');
    this.animate('flipLeft',500);
  })
  .after(4000, function() {
    console.log('Preparing to flipRight by 500ms');
    this.animate('flipRight', 500);
  })
  .after(5000, function() {
    console.log('Preparing to move front by 1');
    this.front(1.0);
  })
  .after(5000, function() {
    console.log('Preparing to turnaroundGodown');
    this.animate('turnaroundGodown', 900);
    this.back(0.8);
  })
  .after(4000, function() {
    console.log('Preparing to yawnShake');
    this.animate('yawShake', 900);
  })
  .after(5000, function(){
    console.log('Preparing to theta20degYawM200deg');
    this.animate('theta20degYawM200deg', 900);
  })
  .after(5000, function(){
    console.log('Preparing to thetaDance');
    this.animate('thetaDance', 900);
  })
  .after(5000, function() {
    console.log('Preparing to return back');
    this.back(0.8);
  })
  .after(5000, function() {
    console.log('Preparing to land');
    this.land();
  });
