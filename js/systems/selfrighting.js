
SelfRightingSystem = pc.systems.EntitySystem.extend('SelfRightingSystem', {},
    {
        init: function()
        {
            this._super(['selfrighting']);
        },

        process: function(entity)
        {
            var c = entity.getComponent('selfrighting');
            if (!c.active) return;

            var physics = entity.getComponent('physics');
            if(physics) {
                var dir = physics.getDir();
                if(dir != c.targetDir) {
                    var delta = c.targetDir - dir;
                    while(delta > 180) delta -= 360;
                    while(delta < -180) delta += 360;
                    physics.applyTurn(Math.max(-20, Math.min(20, delta/5)));
                }
            }
        }

    });