function _initEnemies() {
    let enemies = [];
    
    for (let i = 0; i < 3; i++) {
        enemies.push(createEnemyCloud(i));
    }
    
    return enemies;
}
 
function getSceneSetup() {   
    return new SceneSetup({
    units: [
        createPlayerUnitClover(),
    ],
    
    enemies: _initEnemies(),
    });
}