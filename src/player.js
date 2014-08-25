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
