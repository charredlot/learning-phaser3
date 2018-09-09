'use strict';

function Enemy({displayName,
                assetPath,
                assetFrame,
                create,
                moveSpeed}) {
    this.displayName = displayName;
    this.assetPath = assetPath;
    this.assetFrame = assetFrame;
    this.create = create;
    
    this.moveTarget = {x: 0, y: 0};
    this.state = Enemy.prototype.STATE_IDLE;
    
    this.container = null;
    this.sprite = null;
    this.moveSpeed = moveSpeed;
}
Enemy.prototype.STATE_IDLE = 0;
Enemy.prototype.STATE_MOVING = 1;
Enemy.prototype.STATE_CASTING = 2;
Enemy.prototype.createCommon = function(scene, container, sprite) {
    scene.physics.world.enable([container, sprite]);
    
    let boundingBox = sprite.getBounds();
    container.body.setSize(boundingBox.width, boundingBox.height);
    
    /*
     * immovable in physics.add.group makes physics
     * interactions fail completely, this seems to do what
     * we want. alternatively may want to set mass to infinity
     */
    sprite.body.moves = false;
    sprite.setCollideWorldBounds(true);

    container.__enemy = this;
    sprite.__enemy = this;
    this.container = container;
    this.sprite = sprite;
}