function PlayerUnit({displayName,
                     portraitURL,
                     preload,
                     create,
                     maxShield,
                     skills}) {
    /* html IDs can't have spaces */
    this.name = displayName.replace(/\s/g, '');
    this.displayName = displayName;
    this.portraitURL = portraitURL;
    this.preload = preload;
    this.create = create;
    
    this.container = null;
    this.sprite = null;
    this.cursor = null;
    this.move_target = null;
    this.has_move_target = false;
    this.move_speed = 50;
    this.maxShield = maxShield;
    this.currentShield = maxShield;
    this.skills = skills;
}
PlayerUnit.prototype.UNIT_SELECTED_IMG = "pink_cursor";
PlayerUnit.prototype.statusDomID = function () {
    return 'unitstatus_' + this.name;
}
PlayerUnit.prototype.shieldDomID = function () {
    return 'unitshield_' + this.name;
}
PlayerUnit.prototype.shieldAnimKey = function() {
    return this.displayName + "_shield";
}
PlayerUnit.prototype.shieldAnimPlay = function() {
    this.shield.setVisible(true);
    this.shield.anims.play(this.shieldAnimKey());
}
PlayerUnit.prototype.setMoveTarget = function (pos) {
    this.move_target.x = Math.round(pos.x);
    this.move_target.y = Math.round(pos.y);
    this.move_target.setVisible(true);
    this.has_move_target = true;
}
PlayerUnit.prototype.initSkillsUI = function(state) {
    let skill_list_id = "skilllist_" + this.name;
    let skill_list = $('#skilllisttemplate').clone();
    
    skill_list.attr('id', skill_list_id);
    skill_list.css('display', 'none');
    skill_list.empty();
        
    for (let i in this.skills) {
        let skill = this.skills[i];
        let skill_id = skill.dom_id(this);
        let skill_obj = $('#skilltemplate').clone();
        
        skill_obj.attr('id', skill_id);
        skill_obj.attr('value', skill.display_name);
        skill_obj.css('display', 'inline');
        skill_obj.css('visibility', 'visible');
        
        /* XXX: this is a bit janky, fix later */
        skill_obj.click(function() {
            let is_selected = (state.selected_skill === skill);
            skill.selectSkill(this, !is_selected);
        });
        
        skill_list.append(skill_obj);
    }
        
    $('#skills').append(skill_list);
}
PlayerUnit.prototype.showSkillsUI = function() {
    /* TODO: hide the old skill list (by class?) or remove children */
    let skill_list_id = "skilllist_" + this.name;
    
    $('#' + skill_list_id).css('display', 'block');
    $('#' + skill_list_id).css('visibility', 'visible');
    
    /* TODO: do this stuff exactly once */    
    $('#skilltemplate').css('display', 'none');
    $('#skilllisttemplate').css('display', 'none');
    $('#skills').css('visibility', 'visible');    
}
PlayerUnit.prototype.updateShieldDom = function() {
    let meter = $('#' + this.shieldDomID());
    let percent = Math.round(this.currentShield * 100.0 / this.maxShield);
    meter.find('.unit-shield-text').text(
        this.currentShield + " / " + this.maxShield
    );
    meter.find('.unit-shield-curr').css('width', percent + '%');
}
PlayerUnit.prototype.takeDamage = function(damage) {
    this.shieldAnimPlay();
    this.currentShield -= damage;
    this.updateShieldDom();
}