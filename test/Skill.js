function Skill({displayName,
                preload,
                create,
                select,
                updateCursor,
                finishCasting}) {
    /* html IDs can't have spaces */
    this.name = displayName.replace(/\s/g, '');
    this.display_name = displayName;
    
    this.preload = preload;
    this.create = create;
    this._select = select;
    this.updateCursor = updateCursor;
    this.finishCasting = finishCasting;
}
Skill.prototype.dom_id = function(unit) {
    return "skill_" + unit.name + "_" + this.name;
}
Skill.prototype.dom = function(unit) {
    /* XXX: memoizeable? */
    return $('#' + this.dom_id(unit));
}
Skill.prototype.selectSkill = function(unit, select) {
    if (select) {
        $('.skillsui').removeClass('skillselected');
        this.dom(unit).addClass('skillselected');
    }
    else {
        this.dom(unit).removeClass('skillselected');
    }
    this._select(unit, select);
    
    /* XXX: pass sceneState instead of accessing global later */
    if (select) {
        sceneState.transition(SceneState.prototype.UI_STATE_TARGET_SKILL, this);
    }
    else {
        sceneState.transition(SceneState.prototype.UI_STATE_SELECTED);
    }
}