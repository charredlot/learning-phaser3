let sceneSetup = new SceneSetup({
    units: [
        new PlayerUnit(
            "Clover",
            "assets/ferretything.png",
            "assets/green_target18.png",
            [
                new Skill(
                    "Entangle",
                    function(scene) {
                        /* TODO: clean up */
                        scene.load.image('entangle_target',
                                         'assets/entangle_target_green.png');
                        scene.load.image('entangle_effect',
                                         'assets/entangle_effect.png');
                    },
                    function(scene) {
                        let target = scene.add.sprite(0, 0, 'entangle_target');
                        let effect = scene.add.sprite(0, 0, 'entangle_effect');
                     
                        target.visible = false;
                        effect.visible = false;
                     
                        this.cursor_target = target;
                        this.effect = effect;
                    },
                    function(unit, select) {
                        this.cursor_target.visible = select;
                    },
                    function(state, unit, ap) {
                        this.cursor_target.x = ap.position.x;
                        this.cursor_target.y = ap.position.y;
                    },
                    function(state) {
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
                ),
                new Skill(
                    "Vine Pull",
                    function(scene) {},
                    function(scene) {},
                    function(unit, select) {},
                    function(state, unit, ap) {},
                    function(state) {},
                ),
                new Skill(
                    "Leaf Burst",
                    function(scene) {},
                    function(scene) {},
                    function(unit, select) {},
                    function(state, unit, ap) {},
                    function(state) {},
                ),
            ]
        ),
    ],
});