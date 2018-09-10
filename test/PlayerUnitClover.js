function _createShield(scene, unit, shieldPath) {
    let shield = scene.add.sprite(0, 0, shieldPath);
    
    scene.anims.create({
        key: unit.shieldAnimKey(),
        frames: [
            {key: shieldPath, frame: 0},
            {key: shieldPath, frame: 1},
            {key: shieldPath, frame: 2},
            {key: shieldPath, frame: 3},
        ],
        frameRate: 8,
        hideOnComplete: true,
    });
    
    shield.setVisible(false);
    
    return shield;
}

function createPlayerUnitClover() {
    let displayName = "Clover";
    let charAssetPath = "assets/ferretything.png";
    let moveTargetPath = "assets/green_target18.png";
    let cursorPath = 'assets/pink_cursor.png';
    let shieldPath = 'assets/green_shield.png';
    
    return new PlayerUnit({
        displayName: displayName,
        portraitURL: "/assets/ferretything_portrait.png",
        preload: function(scene) {
            scene.load.spritesheet(charAssetPath,
                                   charAssetPath,
                                   {frameWidth: 64, frameHeight: 64});
            scene.load.image(moveTargetPath, moveTargetPath);
            scene.load.image(cursorPath, cursorPath);
            scene.load.spritesheet(shieldPath, shieldPath,
                                   {frameWidth: 72, frameHeight: 72});
        },
        create: function(scene) {
            let sprite = scene.physics.add.sprite(0, 0, charAssetPath);
            let cursor = scene.add.sprite(0, 0, cursorPath);
            let move_target = scene.add.sprite(0, 0, moveTargetPath);
            let shield = _createShield(scene, this, shieldPath);
            let container = scene.add.container(0, 0, [sprite, cursor, shield]);
            
            /*
             * WARNING: adding things to a group apparentl wipes some settings,
             * e.g. setCollideWorldBounds, so make sure to do it first.
             * there might be other implications as well
             */
            scene.scene_state.units.add(container);
            
            /*
             * sprite origin is at the center, but the container origin is at
             * the top left. since sprite is the "main" thing, set everything
             * based on its center
             */
            sprite.x = sprite.displayWidth / 2;
            sprite.y = sprite.displayHeight / 2;
            cursor.x = sprite.displayWidth / 2;
            cursor.y = sprite.displayHeight / 2;
            shield.x = sprite.displayWidth / 2;
            shield.y = sprite.displayHeight / 2;
            
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
            container.body.setCollideWorldBounds(true);
            
            /* immovable doesn't work properly to avoid getting pushed */
            sprite.body.moves = false;
            sprite.setInteractive();
            
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
            this.shield = shield;
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