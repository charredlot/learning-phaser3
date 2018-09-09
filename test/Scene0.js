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
    });
}