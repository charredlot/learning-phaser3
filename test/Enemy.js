'use strict';

function Enemy({displayName,
                assetPath,
                assetFrame,
                create}) {
    this.displayName = displayName;
    this.assetPath = assetPath;
    this.assetFrame = assetFrame;
    this.create = create;
    
    this.moveTarget = null;
    
    this.container = null;
    this.sprite = null;
}
Enemy.prototype.createCommon = function(scene, container, sprite) {
    scene.physics.world.enable([container, sprite]);
    
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