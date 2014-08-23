GameObject = function(game) {
  gameObjects.push(this);
  this.game = game;
}

GameObject.prototype.create  = function() {}

GameObject.prototype.preload = function() {}

GameObject.prototype.update  = function() {}
var game = new Phaser.Game(400, 300, Phaser.AUTO, 'game', { preload: preload, create: create, update: update});

gameObject = [];

function preload() {
  gameObject.map(function(e) {
    e.preload();
  });
}

function create() {
  gameObject.map(function(e) {
    e.create();
  });
}

function update() {
  gameObject.map(function(e) {
    e.update();
  });
}
