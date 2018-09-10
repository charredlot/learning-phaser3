function createEnemyCloud(i) {
    let cloud = 'assets/weird_cloud.png';
    let projectile = 'assets/red_ball18.png';
    let pulsatingPrefix = cloud + "pulsating";
    let chargingPrefix = cloud + "charging";
    
    return new Enemy({
        displayName: 'weirdcloud' + i,
        preload: function(scene) {
            scene.load.spritesheet(cloud, cloud,
            {frameWidth: 64, frameHeight: 64});
            scene.load.image(projectile, projectile);
        },
        create: function(scene) {
            let ball = scene.physics.add.sprite(100, 100, projectile);
            let sprite = scene.physics.add.sprite(0,
                                                  0,
                                                  cloud);
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
            
            let scope = this;
            sprite.on(
                "animationcomplete",
                function(anim, frame) {
                    if (anim.key !== chargingPrefix + i) {
                        return;
                    }
                    
                    let target = scene.scene_state.randomUnit();
                    if (target === null) {
                        scope.state = Enemy.prototype.STATE_IDLE;
                        sprite.anims.play(pulsatingPrefix + i);
                        return;
                    }
                    
                    let dx = target.sprite.body.x - scope.sprite.body.x;
                    let dy = target.sprite.body.y - scope.sprite.body.y;
                    let dist = Math.sqrt((dx * dx) + (dy * dy));

                    scope.ball.setActive(true);
                    scope.ball.setVisible(true);
                    scope.ball.enableBody(true,
                                          scope.container.x + scope.sprite.x,
                                          scope.container.y + scope.sprite.y,
                                          true,
                                          true);
                    scope.ball.body.setVelocity(dx * 60 / dist, dy * 60 / dist);
                    scope.ball.body.setAngularVelocity(360);
                    
                    scope.state = Enemy.prototype.STATE_IDLE;
                    sprite.anims.play(pulsatingPrefix + i);
                }
            );
            
            scene.physics.world.enable(ball);
            ball.setActive(false);
            ball.setVisible(false);
            ball.disableBody(true, true);
            this.ball = ball;
            
            this.createCommon(scene, container, sprite);
            
            sprite.anims.play(pulsatingPrefix + i);
        },
        postCreate: function(scene, sceneState) {
            scene.physics.add.overlap(
                this.ball,
                sceneState.units,
                function(ball, unitObj) {
                    ball.setActive(false);
                    ball.setVisible(false);
                    ball.disableBody(true, true);
                    
                    unitObj.__player_unit.takeDamage(10);
                }
            );
        },
        attack: function(scene) {
            this.container.body.setVelocity(0, 0);
            this.sprite.anims.play(chargingPrefix + i);
        },
        moveSpeed: 30,
});
}