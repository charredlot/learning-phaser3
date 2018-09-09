function _initEnemies() {
    let enemies = [];
    let cloud = 'assets/weird_cloud.png';
    let projectile = 'assets/red_ball18.png';
    let pulsatingPrefix = cloud + "pulsating";
    let chargingPrefix = cloud + "charging";
    
    let preload = function(scene) {
        scene.load.spritesheet(cloud, cloud,
                               {frameWidth: 64, frameHeight: 64});
        scene.load.image(projectile, projectile);
    };
    
    for (let i = 0; i < 3; i++) {
        let newEnemy = new Enemy({
                displayName: 'weirdcloud' + i,
                preload: preload,
                create: function(scene) {
                    let ball = scene.add.sprite(0, 0, projectile);
                    let sprite = scene.physics.add.sprite(0,
                                                          0,
                                                          cloud);
                    let container = scene.add.container(200,
                                                        100 * (i + 1),
                                                        [sprite]);
                    
                    /* sprite origin is center, container is top left*/
                    sprite.x = sprite.displayWidth / 2;
                    sprite.y = sprite.displayHeight / 2;
                    
                    ball.setVisible(false);
                    ball.setActive(false);
                    
                    /*
                     * eh kind of wasteful, but annoying when the animations
                     * sync up
                     */
                    scene.anims.create({
                        key: pulsatingPrefix + i,
                        frames: [
                            {key: cloud, frame: i % 4},
                            {key: cloud, frame: (i + 1) % 4},
                            {key: cloud, frame: (i + 2) % 4},
                            {key: cloud, frame: (i + 3) % 4},
                        ],
                        frameRate: 12,
                        repeat: -1,
                    });
                    
                    scene.anims.create({
                        key: chargingPrefix + i,
                        frames: [
                            {key: cloud, frame: 1},
                            {key: cloud, frame: 2},
                            {key: cloud, frame: 1},
                            {key: cloud, frame: 2},
                        ],
                        frameRate: 1,
                    });
            
                    sprite.anims.play(pulsatingPrefix + i);
                    
                    let scope = this;
                    sprite.on(
                        "animationcomplete",
                        function(anim, frame) {
                            if (anim.key !== chargingPrefix + i) {
                                return;
                            }
                            
                            scope.state = Enemy.prototype.STATE_IDLE;
                            sprite.anims.play(pulsatingPrefix + i);
                        }
                    );
                    this.createCommon(scene, container, sprite);
                },
                attack: function(scene) {
                    this.container.body.setVelocity(0, 0);
                    this.sprite.anims.play(chargingPrefix + i);
                },
                moveSpeed: 30,
        });
        enemies.push(newEnemy);
    }
    
    return enemies;
}
 
function getSceneSetup() {   
    return new SceneSetup({
    units: [
        new PlayerUnit(
            "Clover",
            "assets/ferretything.png",
            "assets/green_target18.png",
            [
                new Skill({
                    displayName: "Entangle",
                    preload: function(scene) {
                        /* TODO: clean up */
                        scene.load.image('entangle_target',
                                         'assets/entangle_target_green.png');
                        scene.load.image('entangle_effect',
                                         'assets/entangle_effect.png');
                    },
                    create: function(scene) {
                        let target = scene.add.sprite(0, 0, 'entangle_target');
                        let effect = scene.add.sprite(0, 0, 'entangle_effect');
                     
                        target.setVisible(false);
                        effect.setVisible(false);
                        effect.setActive(false);
                     
                        this.cursor_target = target;
                        this.effect = effect;
                    },
                    select: function(unit, select) {
                        this.cursor_target.setVisible(select);
                    },
                    updateCursor: function(state, unit, ap) {
                        this.cursor_target.x = ap.position.x;
                        this.cursor_target.y = ap.position.y;
                    },
                    finishCasting: function(state) {
                        this.effect.x = this.cursor_target.x;
                        this.effect.y = this.cursor_target.y;
                        this.effect.setVisible(true);
                        this.effect.setActive(true);
                        
                        state.scene.time.addEvent({
                            delay: 3000,
                            callback: function () {
                                this.effect.setVisible(false);
                                this.effect.setActive(false);
                            },
                            callbackScope: this,
                        });
                    },
                }),
                new Skill({
                    displayName: "Vine Pull",
                    preload: function(scene) {},
                    create: function(scene) {},
                    select: function(unit, select) {},
                    updateCursor: function(state, unit, ap) {},
                    finishCasting: function(state) {},
                }),
                new Skill({
                    displayName: "Leaf Burst",
                    preload: function(scene) {},
                    create: function(scene) {},
                    select: function(unit, select) {},
                    updateCursor: function(state, unit, ap) {},
                    finishCasting: function(state) {},
                }),
            ]
        ),
    ],
    
    enemies: _initEnemies(),
    });
}