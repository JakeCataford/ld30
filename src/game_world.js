GameWorld = function(key) {
  this.key = key;
}

GameWorld.prototype.preload = function(tilesetImage) {
  this.tilesetImage = game.load.image('tileset', 'assets/tileset.png');
}

GameWorld.prototype.create = function(group) {
  game.stage.smoothed = false;
  this.tilemap = game.add.tilemap();
  this.tilemap.addTilesetImage('tileset')
  this.layer1 = this.tilemap.create('level', 40, 30, 32, 32);
  this.layer1.resizeWorld();
  this.layer1.debug = true;
    this.complexity = 1;
  this.generate();
}

GameWorld.prototype.generate = function() {
  this.tilemap.fill(0,0,0,100,100);
  this.recursivelyGenerate(50, 5, 6);
  this.recursivelyGenerate(50, 6, 5);
  //this.recursivelyGenerate(30, 6, 5);
  this.prettify();
  this.tilemap.setCollision([0], true, this.layer1);
  this.tilemap.setCollision([1,2], false, this.layer1);
}

GameWorld.prototype.prettify = function() {
  for(var i = 0; i < this.tilemap.width; i++) {
    for(var j = 1; j < this.tilemap.height; j++) {
      tile_above = this.tilemap.getTile(i,j-1);
      tile = this.tilemap.getTile(i,j);
      if(tile_above.index === 0 && tile.index === 1) {
        this.tilemap.putTile(2,i,j);
      }
    }
  }
}

GameWorld.prototype.recursivelyGenerate = function(stepsLeft, currentX, currentY) {
  stepsLeft --;
  this.tilemap.fill(1, currentX, currentY, currentX + 1, currentY + 1);

  if(Math.random() < 0.5) {
    currentX += Math.random() < 0.5 ? 1 : -1;
  } else {
    currentY += Math.random() < 0.5 ? 1 : -1;
  }
  if(currentX < 1) currentX = 1;
  if(currentY < 1) currentY = 1;
  if(currentX > 37) currentX = 37;
  if(currentY > 27) currentY = 27;
  if(stepsLeft > 0) this.recursivelyGenerate(stepsLeft, currentX, currentY);
}
