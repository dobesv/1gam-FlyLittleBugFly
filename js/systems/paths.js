
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
          targetPt.x = targetCoord[0] + path.x;
          targetPt.y = targetCoord[1] + path.y;
        } else {
          if(this.layer.screenX(spatial.pos.x) < -spatial.dim.x) {
            entity.remove();
            console.log('Flew off the right side ...')
            return;
          }
          targetPt.x = 0;
          targetPt.y = 0;
        }
        var distance = targetPt.distance(spatial.pos);
        var targetDir = spatial.pos.dirTo(targetPt);
        physics.applyForce(1, targetDir);
        if(distance <= 10) {
          c.pathPosition++;
          console.log('Next path position ...', c.pathPosition);
        }
        //entity.getComponent('sprite').sprite.scaleX = targetPt.x < spatial.pos.x ? 1 : -1;
        // spatial.setDir(targetPt.x < spatial.pos.x ? 0 : 180);
      }
    });