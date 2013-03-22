
PlayerControlSystem = pc.systems.EntitySystem.extend('PlayerControlSystem',
    {},
    {
      emitters:[],
      init: function()
      {
        this._super(['player']);
      },


      process: function(player)
      {
        var c = player.getComponent('player');
        if (!c.active) return;
        var playerSpatial = player.getComponent('spatial');
        var playerPhysics = player.getComponent('physics');
        var input = this.systemManager.getByComponentType('input').first.object();
        var isOn = function(s) {
          return input.isInputState(player, s);
        };

        // Check if the player is touching a drop
        // this.rainLayer.tileMap.tileHasProperty()

        var flyX = 0;
        var flyY = 0;
        if(isOn('lmb')) {
          var pos = pc.device.input.mousePos;
          var playerPos = playerSpatial.getPos();
          var pX = this.layer.screenX(playerPos.x);
          var pY = this.layer.screenY(playerPos.y);

          if(pos.y < pY-50) { flyY -= 1; }
          if(pos.y > pY+50) { flyY += 0.5; }
          if(pos.x < pX-50) { flyX -= 1; }
          if(pos.x > pX+50) { flyX += 3; }
        } else {
          if(isOn('up')) { flyY -= 1; };
          if(isOn('down')) { flyY += 0.5; };
          if(isOn('left')) { flyX -= 1; };
          if(isOn('right')) { flyX += 3; };
        }
        var flying = (flyX || flyY);
        var pushX = flyX+1;
        var pushY = flyY+0.1;
        if(pushX) { playerPhysics.applyForce(pushX,0); }
        if(pushY) { playerPhysics.applyForce(pushY,90); }

        var targetAngle = Math.max(-15, Math.min(90, playerPhysics.getVelocityAngle()-90));
        player.getComponent('selfrighting').targetDir = targetAngle;
        player.getComponent('sprite').sprite.setAnimation(flying?'fly':'float');
      }

    });