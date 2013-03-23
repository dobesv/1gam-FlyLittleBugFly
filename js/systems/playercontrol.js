
PlayerControlSystem = pc.systems.EntitySystem.extend('PlayerControlSystem',
    {},
    {
      input:null,
      godmode:false,

      init: function()
      {
        this._super(['player']);
        this.godmode = location.hash.indexOf('god') >= 0;
      },

      onEntityAdded:function(player) {
        var input = pc.components.Input.create({
          states: [
            ['left', ['A', 'LEFT']],
            ['right', ['D', 'RIGHT']],
            ['up', ['W', 'UP']],
            ['down', ['S', 'DOWN']],
            ['lmb', ['TOUCH', 'MOUSE_BUTTON_LEFT_DOWN', 'MOUSE_BUTTON_RIGHT_DOWN'], false],
            ['rmb', ['MOUSE_BUTTON_RIGHT_DOWN'], false]
          ]
        });

        player.addComponent(input);
        player.addComponent(pc.components.Physics.create({
          //gravity:{x:0,y:1},
          linearDamping:1,
          mass:0.1,
          faceVel:true,
          maxSpeed:{x:100,y:100},
          bounce:3,
          shapes:getAnimShapes('player'),
          collisionGroup:COLLIDE_PLAYER,
          collisionCategory:COLLIDE_PLAYER,
          collisionMask:COLLIDE_DROPS|COLLIDE_WALL|COLLIDE_ENEMY|COLLIDE_PICKUP
        }));
        player.addComponent(SelfRighting.create());

        pc.device.input.bindAction(this, 'godmode', 'G');
        pc.device.input.bindAction(this, 'kill', 'K');
      },

      onAction: function(actionName) {
        console.log("Action: "+actionName);
        if(actionName == 'godmode') {
          this.godmode = !this.godmode;
          window.location.hash = this.godmode ? "#god" : "";
        } else if(actionName == 'kill') {
          var next = this.entities.first;
          while (next)
          {
            next.obj.getComponent('player').die();
            next = next.next();
          }
        }
      },

      onTouchPlayer: function(player, what) {
        if(what.hasTag('predator')) {
          // Touched a predator
          if(!this.godmode) {
            player.getComponent('player').die();
          }
        } else if(what.hasTag('pickup')) {
          // Touched a pickup
          what.remove(); // TODO: Play a pickup animation
        }
      },

      process: function(player)
      {
        var c = player.getComponent('player');
        if (!c.active) return;

        var playerSpatial = player.getComponent('spatial');
        var playerPhysics = player.getComponent('physics');
        var playerPos = playerSpatial.getPos();
        if(c.dead) {
          playerPhysics.setCollisionMask(0);
          playerPhysics.setGravity(0, playerPhysics.mass * 200);
          playerPhysics.applyTurn(360);
          player.getComponent('sprite').sprite.setAnimation('float');
          return;
        }

        var isOn = function isOn(s) {
          return this.input.isInputState(player, s);
        }.bind(this);

        // Check if the player is touching a drop
        // this.rainLayer.tileMap.tileHasProperty()

        var flyX = 0;
        var flyY = 0;
        if(isOn('lmb')) {
          var pos = pc.device.input.mousePos;
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

        var targetAngle = Math.max(-15, Math.min(45, playerPhysics.getVelocityAngle()-90));
        player.getComponent('selfrighting').targetDir = flying ? targetAngle : 0;
        player.getComponent('sprite').sprite.setAnimation(flying?'fly':'float');

        var text = player.getComponent('text');
        if(this.godmode) {
          if(pc.valid(text)) {
            text.text = "GOD";
            text.active = true;
          } else {
            text = pc.components.Text.create({
              color:'#000000',
              offset:{x:-20,y:-50},
              fontHeight:10,
              font:'sans-serif'
            });
            player.addComponent(text);
          }
        } else {
          if(pc.valid(text)) text.active = false;
        }
      }

    });