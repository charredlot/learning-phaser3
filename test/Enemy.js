'use strict';

function Enemy({displayName,
                preload,
                create,
                postCreate,
                attack,
                moveSpeed}) {
    this.displayName = displayName;
    this.preload = preload;
    this.create = create;
    this.postCreate = postCreate;
    this.attack = attack;
    
    this.moveTarget = {x: 0, y: 0};
    this.state = Enemy.prototype.STATE_IDLE;
    
    this.container = null;
    this.sprite = null;
    this.debugTarget = null;
    this.moveSpeed = moveSpeed;
}
Enemy.prototype.STATE_IDLE = 0;
Enemy.prototype.STATE_MOVING = 1;
Enemy.prototype.STATE_CASTING = 2;
Enemy.prototype.DEBUG_TARGET_PATH = 'assets/debug_target.png';
Enemy.prototype.preloadCommon = function(scene) {
    scene.load.image(Enemy.prototype.DEBUG_TARGET_PATH,
                     Enemy.prototype.DEBUG_TARGET_PATH);
}
Enemy.prototype.createCommon = function(scene, container, sprite) {
    /*
     * WARNING: adding things to a group apparently wipes some settings,
     * e.g. setCollideWorldBounds, so make sure to do it first.
     * there might be other implications as well
     */
    scene.scene_state.enemies.add(container);
    
    scene.physics.world.enable([container, sprite]);
    
    let boundingBox = sprite.getBounds();
    container.body.setSize(boundingBox.width, boundingBox.height);
    container.body.setCollideWorldBounds(true);
    /*
     * immovable in physics.add.group makes physics
     * interactions fail completely, this seems to do what
     * we want. alternatively may want to set mass to infinity
     */
    sprite.body.moves = false;

    this.debugTarget = scene.add.sprite(0, 0,
                                        Enemy.prototype.DEBUG_TARGET_PATH);
    this.debugTarget.setVisible(false);
    
    container.__enemy = this;
    sprite.__enemy = this;
    this.container = container;
    this.sprite = sprite;
    
}