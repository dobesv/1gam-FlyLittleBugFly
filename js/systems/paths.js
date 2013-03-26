
FollowPathSystem = pc.systems.EntitySystem.extend('FollowPathSystem',
    {},
    {
      targetPt:new pc.Point(),

      init: function()
      {
        this._super(['followpath']);
      },


      process: function(entity)
      {
        if(!entity.active) return;
        var c = entity.getComponent('followpath');
        if (!c.active) return;

        var spatial = entity.getComponent('spatial');
        var physics = entity.getComponent('physics');

        //console.log('follow path', entity, c.path, c.pathPosition);

        // If we've gone off the right side, remove

        var path = c.path;
        var targetPt = this.targetPt;
        if(c.pathPosition < path.points.length) {
          var targetCoord = path.points[c.pathPosition]; // [x,y]
          targetPt.x = targetCoord[0] + path.x - spatial.dim.x*0.5;
          targetPt.y = targetCoord[1] + path.y - spatial.dim.y*0.5;
        } else {
          if(this.layer.screenX(spatial.pos.x) < 0) {
            entity.remove();
            console.log('Flew off the right side ...')
            return;
          }
          targetPt.x = 0;
          targetPt.y = 0;
        }
        var distance = targetPt.distance(spatial.pos);
        var targetDir = spatial.pos.dirTo(targetPt);
        physics.applyForce(10*physics.mass, targetDir);
        if(distance <= 10) {
          c.pathPosition++;
        }
        //entity.getComponent('sprite').sprite.scaleX = targetPt.x < spatial.pos.x ? 1 : -1;
        // spatial.setDir(targetPt.x < spatial.pos.x ? 0 : 180);
      }
    });