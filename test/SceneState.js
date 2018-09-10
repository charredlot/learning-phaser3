function SceneState() {
    this.units = null;
    this.enemies = null;
    this.selected_unit = null;
    this.selected_skill = null;
    this.ui_state = SceneState.prototype.UI_STATE_UNSELECTED;
    this.skill_keys = {};
}
SceneState.prototype.UI_STATE_UNSELECTED = 0;
SceneState.prototype.UI_STATE_SELECTED = 1;
SceneState.prototype.UI_STATE_TARGET_SKILL = 2;
SceneState.prototype.UI_STATE_CASTING = 3;
SceneState.prototype.transition = function(new_state, ctx) {
    switch (new_state) {
        case SceneState.prototype.UI_STATE_UNSELECTED:
            break;
        case SceneState.prototype.UI_STATE_SELECTED:
            let newUnit = ctx;
            if ((this.ui_state === SceneState.prototype.UI_STATE_UNSELECTED) ||
                (this.ui_state === SceneState.prototype.UI_STATE_SELECTED)) {
                $('.skillsui').removeClass('skillselected');
                $('.unitstatus').removeClass('unitselected');
                $('#' + newUnit.statusDomID()).addClass('unitselected');
                this.selected_unit = newUnit;
            }
            else if (this.ui_state === SceneState.prototype.UI_STATE_CASTING) {
                $('.skillsui').removeClass('skillcasting');
            }
            this.selected_skill = null;
            break;
        case SceneState.prototype.UI_STATE_TARGET_SKILL:
            this.selected_skill = ctx;
            break;
        case SceneState.prototype.UI_STATE_CASTING:
            break;
        default:
            console.log("ERROR: bad state", new_state);
            break;
    }
    console.log("ui_state transitioning from",
                this.ui_state,
                "to",
                new_state);
    this.ui_state = new_state;
}
SceneState.prototype.randomUnit = function () {
    let numUnits = this.units.getLength();
    let unitIndex = 0;
    let target = Math.random() * numUnits;
    
    for (unitIndex = 0; unitIndex < numUnits; unitIndex++) {
        if ((unitIndex <= target) && (target <= unitIndex + 1)) {
            break;
        }
    }
    
    if (unitIndex >= numUnits) {
        /* shouldn't happen unless it's game over but */
         return null;
    }
    
    return this.units.children.entries[unitIndex].__player_unit;
}