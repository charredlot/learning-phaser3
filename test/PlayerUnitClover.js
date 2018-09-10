function createPlayerUnitClover() {
    let charAssetPath = "assets/ferretything.png";
    let moveTargetPath = "assets/green_target18.png";
    let cursorPath = 'assets/pink_cursor.png';
    
    return new PlayerUnit({
        displayName: "Clover",
        portraitURL: "/assets/ferretything_portrait.png",
        preload: function(scene) {
            scene.load.spritesheet(charAssetPath,
                                   charAssetPath,
                                   {frameWidth: 64, frameHeight: 64});
            scene.load.image(moveTargetPath, moveTargetPath);
            scene.load.image(cursorPath, cursorPath);
        },
        create: function(scene) {
            let sprite = scene.physics.add.sprite(0, 0, charAssetPath);
            let cursor = scene.add.sprite(0, 0, cursorPath);
            let move_target = scene.add.sprite(0, 0, moveTargetPath);
            let container = scene.add.container(0, 0, [sprite, cursor]);
            
            /*
             * sprite origin is at the center, but the container origin is at
             * the top left. set the cursor and sprite's relative position
             * properly
             */
            sprite.x = sprite.displayWidth / 2;
            sprite.y = sprite.displayHeight / 2;
            cursor.x = cursor.displayWidth / 2;
            cursor.y = cursor.displayHeight / 2;
            
            /*
             * this is how container gets a velocity...took a hell of a time to
             * find this >:O
             * http://labs.phaser.io/index.html
             * not ideal but we can't set a velocity on container without
             * doing this. this also means the physics engine doesn't handle
             * collisions with the sprite and other things for some reason.
             * maybe related to the sprite body relative velocity being 0?
             * it's unclear
             */
            scene.physics.world.enable([container, sprite]);
            
            /*
             * set the body size for collisions based on the sprite
             * XXX: not sure how to do this for non rectangular things
             */
            let boundingBox = sprite.getBounds();
            container.body.setSize(boundingBox.width, boundingBox.height);
            
            /* immovable doesn't work properly to avoid getting pushed */
            sprite.body.moves = false;
            sprite.setInteractive();
            sprite.setCollideWorldBounds(true);
            
            // XXX: maybe make this more flexible
            scene.anims.create({
                key: "casting",
                frames: [
                    {key: charAssetPath, frame: 4},
                    {key: charAssetPath, frame: 5},
                    {key: charAssetPath, frame: 6},
                    {key: charAssetPath, frame: 5},
                    {key: charAssetPath, frame: 6},
                    {key: charAssetPath, frame: 7},
                    {key: charAssetPath, frame: 0},
                ],
                frameRate: 3,
            });
            
            // XXX: not sure if this is correct, not well documented yet
            sprite.on("animationcomplete",
                 function(anim, frame) {
                    if (anim.key == "casting") {
                        /*
                         * XXX: would be nice to pass the skill with the event
                         * but seems like globals are the only way
                         */
                        let skill = scene.scene_state.selected_skill;
                                    
                        /*
                         * not the clearest, but selectSkill should happen last
                         * since it causes a ui_state transition
                         */
                        skill.finishCasting(scene.scene_state);
                        skill.selectSkill(scene.scene_state.selected_unit, false);
                    }
                 },
            );

            cursor.setVisible(false);
            move_target.setVisible(false);

            /* useful to have back pointers from the phaser objects */
            container.__player_unit = this;
            sprite.__player_unit = this;
            
            this.container = container;
            this.sprite = sprite;
            this.cursor = cursor;
            this.move_target = move_target;
        },
        maxShield: 150,
        skills: [
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
    });
}