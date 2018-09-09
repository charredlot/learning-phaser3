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
            if ((this.ui_state === SceneState.prototype.UI_STATE_UNSELECTED) ||
                (this.ui_state === SceneState.prototype.UI_STATE_SELECTED)) {
                $('.skillsui').removeClass('skillselected');
                this.selected_unit = ctx;
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