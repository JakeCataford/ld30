GameObject = function(game) {
  gameObjects.push(this);
  this.game = game;
}

GameObject.prototype.create  = function() {}

GameObject.prototype.preload = function() {}

GameObject.prototype.update  = function() {}
