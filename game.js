GameObject = function(game) {
  gameObjects.push(this);
  this.game = game;
}

GameObject.prototype.create  = function() {}

GameObject.prototype.preload = function() {}

GameObject.prototype.update  = function() {}
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
var game = new Phaser.Game(400, 300, Phaser.AUTO, 'game', { preload: preload, create: create, update: update});


var worldGroup, player, cursors, space, objects;
var clones = [];
var world = new GameWorld('game_world');

function preload() {
  //  This sets a limit on the up-scale
  game.scale.maxWidth = 800;
  game.scale.maxHeight = 600;

  //  Then we tell Phaser that we want it to scale up to whatever the browser can handle, but to do it proportionally
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.setScreenSize();

  // load tilemap assets
  game.load.spritesheet('player', 'assets/player.png', 32, 32);
  game.load.spritesheet('clone_1', 'assets/clone_1.png', 32, 32);
  game.load.spritesheet('clone_2', 'assets/clone_2.png', 32, 32);
  game.load.spritesheet('clone_3', 'assets/clone_3.png', 32, 32);
  game.load.spritesheet('clone_4', 'assets/clone_4.png', 32, 32);
  game.load.image('tileset', 'assets/tileset.png');
}

function create() {
  cursors = game.input.keyboard.createCursorKeys();
  space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = '#333';
  worldGroup = game.add.group(game, null, 'world_group', false, true, Phaser.Physics.ARCADE);
  objects = game.add.group(game, null, 'objects', false, true, Phaser.Physics.ARCADE);
  objects.enableBody = true;
  world.create(worldGroup);
  player = new Player('player', false);
  game.camera.follow(player.sprite);
}

function update() {
  game.physics.arcade.collide(objects, world.layer1);
  player.update();
  if(space.justPressed()) {
    console.log("BOING");
    clones.push(player.clone());
  }

  clones.map(function(clone) {
    clone.update();
  });

  objects.sort('y', Phaser.Group.SORT_ASCENDING);
}
Player = function(imageName, isClone) {
  this.imageName = imageName;
  this.sprite = game.add.sprite(0, 0, imageName);
  objects.add(this.sprite);
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.isClone = isClone;
  this.sprite.animations.add('still', [0,1], 2, true);
  this.sprite.animations.add('walking', [2,3], 8, true);
  this.sprite.body.drag = new Phaser.Point(100,100);
  this.sprite.body.maxVelocity = new Phaser.Point(100,100);
}

Player.prototype.update = function() {
  if(this.sprite.body.velocity.getMagnitudeSq() > 0.1) {
    this.sprite.animations.play('walking');
  } else {
    this.sprite.animations.play('still');
  }
  if(this.isClone) {
    this.follow();
  } else {
    this.control();
  }
}

Player.prototype.control = function() {
    var speed = 10;
    if (cursors.left.isDown) this.sprite.body.velocity.x += -speed;
    if (cursors.right.isDown) this.sprite.body.velocity.x += speed;
    if (cursors.up.isDown) this.sprite.body.velocity.y += -speed;
    if (cursors.down.isDown) this.sprite.body.velocity.y += speed;
}

Player.prototype.follow = function() {
  var velocity = this.sprite.body.velocity;
  if(Phaser.Point.distance(player.sprite.position, this.sprite.position) > 32) {
    vectorToPlayer = Phaser.Point.subtract(player.sprite.position, this.sprite.position);
    vectorToPlayer.normalize();
    velocity = new Phaser.Point.add(velocity, vectorToPlayer.multiply(10,10));
  }

  var self = this; //Context passing to map function

  clones.map(function(e) {
    if(e !== this) {
      if(Phaser.Point.distance(self.sprite.position, e.sprite.position) < 32) {
        vectorAwayFromClone = Phaser.Point.subtract(self.sprite.position, e.sprite.position);
        vectorAwayFromClone.normalize();
        vectorAwayFromClone.multiply(7,7);
        velocity = Phaser.Point.add(velocity, vectorAwayFromClone);
      }
    }
  });

  this.sprite.body.velocity = velocity;
}

Player.prototype.clone = function() {
  clone = new Player(['clone_1', 'clone_2', 'clone_3', 'clone_4'][Math.floor(Math.random()*4)], true);
  clone.sprite.position = Phaser.Point.add(player.sprite.position, new Phaser.Point(Math.random()*5 - 2.5, Math.random()*5 - 2.5));
  return clone;
}
