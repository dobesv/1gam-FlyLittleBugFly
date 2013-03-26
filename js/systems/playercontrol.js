
PlayerControlSystem = pc.systems.EntitySystem.extend('PlayerControlSystem',
    {},
    {
      input:null,
      godmode:false,
      windSpeed:0.8,
      fallSpeed:0.1,

      init: function()
      {
        this._super(['player']);
        this.godmode = pc.device.game.hasHashState('god');
        this.windSpeed = parseFloat(pc.device.game.getHashState('windSpeed', '0')) || this.windSpeed;
        this.fallSpeed = parseFloat(pc.device.game.getHashState('fallSpeed', '0')) || this.fallSpeed;
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
        pc.device.input.bindAction(this, 'wind+', 'NUM_6');
        pc.device.input.bindAction(this, 'wind-', 'NUM_4');
        pc.device.input.bindAction(this, 'gravity+', 'NUM_2');
        pc.device.input.bindAction(this, 'gravity-', 'NUM_8');
      },

      onAction: function(actionName) {
        console.log("Action: "+actionName);
        if(actionName == 'godmode') {
          this.godmode = pc.device.game.toggleHashState('god');
        } else if(actionName == 'kill') {
          var next = this.entities.first;
          while (next)
          {
            next.obj.getComponent('player').die();
            next = next.next();
          }
        } else if(actionName == 'wind+') {
          pc.device.game.setHashState('windSpeed', this.windSpeed += 0.1);
        } else if(actionName == 'wind-') {
          pc.device.game.setHashState('windSpeed', this.windSpeed -= 0.1);
        } else if(actionName == 'gravity+') {
          pc.device.game.setHashState('fallSpeed', this.fallSpeed += 0.05);
        } else if(actionName == 'gravity-') {
          pc.device.game.setHashState('fallSpeed', this.fallSpeed -= 0.05);
        }
      },

      onTouchPlayer: function(player, what) {
        if(what.hasTag('predator')) {
          // Touched a predator
          if(!this.godmode) {
            player.getComponent('player').die();
          }
        }
      },

      process: function(player)
      {
        var c = player.getComponent('player');
        if (!c.active || c.dead) return;

        var playerSpatial = player.getComponent('spatial');
        var playerPhysics = player.getComponent('physics');
        var playerPos = playerSpatial.getPos();

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
          if(pos.y > pY+50) { flyY += 1; }
          if(pos.x < pX-50) { flyX -= 1; }
          if(pos.x > pX+50) { flyX += 1; }
        } else {
          if(isOn('up')) { flyY -= 1; };
          if(isOn('down')) { flyY += 1; };
          if(isOn('left')) { flyX -= 1; };
          if(isOn('right')) { flyX += 1; };
        }
        var flying = (flyX || flyY);
        var pushX = flyX+this.windSpeed;
        var pushY = flyY+this.fallSpeed;
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