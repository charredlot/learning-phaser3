function getSceneSetup() {
    let enemies = [];
    
    for (let i = 0; i < 3; i++) {
        let newEnemy = new Enemy({
                displayName: 'weirdcloud' + i,
                assetPath: 'assets/weird_cloud.png',
                assetFrame: {frameWidth: 64, frameHeight: 64},
                create: function(scene) {
                    let sprite = scene.physics.add.sprite(0,
                                                          0,
                                                          this.assetPath);
                    let container = scene.add.container(200,
                                                        100 * (i + 1),
                                                        [sprite]);
                    
                    /* sprite origin is center, container is top left*/
                    sprite.x = sprite.displayWidth / 2;
                    sprite.y = sprite.displayHeight / 2;
                    
                    /*
                     * eh kind of wasteful, but annoying when the animations
                     * sync up
                     */
                    scene.anims.create({
                        key: "pulsating" + i,
                        frames: [
                            {key: this.assetPath, frame: i % 4},
                            {key: this.assetPath, frame: (i + 1) % 4},
                            {key: this.assetPath, frame: (i + 2) % 4},
                            {key: this.assetPath, frame: (i + 3) % 4},
                        ],
                        frameRate: 12,
                        repeat: -1,
                    });
            
                    sprite.anims.play("pulsating" + i);
                    
                    this.createCommon(scene, container, sprite);
                },
                moveSpeed: 30,
        });
        enemies.push(newEnemy);
    }
    
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
                     
                        target.visible = false;
                        effect.visible = false;
                     
                        this.cursor_target = target;
                        this.effect = effect;
                    },
                    select: function(unit, select) {
                        this.cursor_target.visible = select;
                    },
                    updateCursor: function(state, unit, ap) {
                        this.cursor_target.x = ap.position.x;
                        this.cursor_target.y = ap.position.y;
                    },
                    finishCasting: function(state) {
                        this.effect.x = this.cursor_target.x;
                        this.effect.y = this.cursor_target.y;
                        this.effect.visible = true;
                        
                        state.scene.time.addEvent({
                            delay: 3000,
                            callback: function () {
                                this.effect.visible = false;
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
    
    enemies: enemies,
    });
}