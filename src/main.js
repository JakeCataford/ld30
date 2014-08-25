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
