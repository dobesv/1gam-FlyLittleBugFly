
PlayerControlSystem = pc.systems.EntitySystem.extend('PlayerControlSystem',
    {},
    {
      input:null,
      godmode:false,
      windSpeed:Parameters.windSpeed,
      fallSpeed:Parameters.fallSpeed,
      waterLevel: Parameters.waterLevel,
      recoveryRateAdjust: 0,
      drainRateAdjust:0,

      init: function()
      {
        this._super(['player']);
        this.godmode = pc.device.game.hasHashState('god');
        this.windSpeed = parseFloat(pc.device.game.getHashState('windSpeed', '0')) || this.windSpeed;
        this.fallSpeed = parseFloat(pc.device.game.getHashState('fallSpeed', '0')) || this.fallSpeed;
        this.recoveryRateAdjust = parseFloat(pc.device.game.getHashState('recoveryRateAdjust', '0')) || this.recoveryRateAdjust;
        this.drainRateAdjust = parseFloat(pc.device.game.getHashState('drainRateAdjust', '0')) || this.drainRateAdjust;
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
          linearDamping:Parameters.playerLinearDamping,
          mass:Parameters.playerMass,
          faceVel:true,
          maxSpeed:{x:Parameters.playerMaxSpeed,y:Parameters.playerMaxSpeed},
          bounce:Parameters.playerBounce,
          shapes:getAnimShapes('player'),
          collisionGroup:COLLIDE_PLAYER,
          collisionCategory:COLLIDE_PLAYER,
          collisionMask:COLLIDE_DROPS|COLLIDE_WALL|COLLIDE_ENEMY|COLLIDE_PICKUP|COLLIDE_RIVER
        }));
        player.addComponent(SelfRighting.create());

        pc.device.input.bindAction(this, 'godmode', 'G');
        pc.device.input.bindAction(this, 'kill', 'K');
        pc.device.input.bindAction(this, 'wind+', 'NUM_6');
        pc.device.input.bindAction(this, 'wind-', 'NUM_4');
        pc.device.input.bindAction(this, 'gravity+', 'NUM_2');
        pc.device.input.bindAction(this, 'gravity-', 'NUM_8');
        pc.device.input.bindAction(this, 'drainRate+', 'NUM_9');
        pc.device.input.bindAction(this, 'drainRate-', 'NUM_7');
        pc.device.input.bindAction(this, 'recoveryRate+', 'NUM_3');
        pc.device.input.bindAction(this, 'recoveryRate-', 'NUM_1');
        pc.device.input.bindAction(this, 'J1', '1');
        pc.device.input.bindAction(this, 'J2', '2');
        pc.device.input.bindAction(this, 'J3', '3');
        pc.device.input.bindAction(this, 'J4', '4');
        pc.device.input.bindAction(this, 'J5', '5');
        pc.device.input.bindAction(this, 'J6', '6');
        pc.device.input.bindAction(this, 'J7', '7');
        pc.device.input.bindAction(this, 'J8', '8');
        pc.device.input.bindAction(this, 'J9', '9');
        pc.device.input.bindAction(this, 'J0', '0');
      },

      onAction: function(actionName) {
        this.info("Action: "+actionName);
        switch(actionName) {
          case 'godmode': pc.device.game.toggleHashState('god', this.godmode = !this.godmode); break;
          case 'kill':  getPlayer().getComponent('player').die(); break;
          case 'wind+': pc.device.game.setHashState('windSpeed', this.windSpeed += 0.1); break;
          case 'wind-': pc.device.game.setHashState('windSpeed', this.windSpeed -= 0.1); break;
          case 'gravity+': pc.device.game.setHashState('fallSpeed', this.fallSpeed += 0.05); break;
          case 'gravity-': pc.device.game.setHashState('fallSpeed', this.fallSpeed -= 0.05); break;
          case 'drainRate+': pc.device.game.setHashState('drainRateAdjust', this.drainRateAdjust += 0.005); break;
          case 'drainRate-': pc.device.game.setHashState('drainRateAdjust', this.drainRateAdjust -= 0.005); break;
          case 'recoveryRate+': pc.device.game.setHashState('recoveryRateAdjust', this.recoveryRateAdjust += 0.005); break;
          case 'recoveryRate-': pc.device.game.setHashState('recoveryRateAdjust', this.recoveryRateAdjust -= 0.005); break;
          case 'J1': this.jumpTo(0.1); break;
          case 'J2': this.jumpTo(0.2); break;
          case 'J3': this.jumpTo(0.3); break;
          case 'J4': this.jumpTo(0.4); break;
          case 'J5': this.jumpTo(0.5); break;
          case 'J6': this.jumpTo(0.6); break;
          case 'J7': this.jumpTo(0.7); break;
          case 'J8': this.jumpTo(0.8); break;
          case 'J9': this.jumpTo(0.9); break;
          case 'J0': this.jumpTo(1.0); break;
        }
      },

      getPlayer: function() {
        return this.entities.first ? this.entities.first.obj : null;
      },

      jumpTo: function(levelFraction) {
        var player = this.getPlayer();
        player.getComponent('spatial').pos.x = (player.layer.worldSize.x - 1024) * levelFraction;
      },

      onTouchPlayer: function(player, what) {
        if(what.hasTag('predator')) {
          // Touched a predator
          if(!this.godmode) {
            player.getComponent('player').die();
          }
        }
      },

      process: function(player) {
        var c = player.getComponent('player');
        if (!c.active) return;

        var playerSpatial = player.getComponent('spatial');
        var playerPhysics = player.getComponent('physics');
        var playerPos = playerSpatial.getPos();

        if(playerPos.y >= this.waterLevel && !this.godmode) {
          c.die(true);
          return;
        }

        var isOn = function isOn(s) {
          return this.input.isInputState(player, s);
        }.bind(this);

        // Check if the player is touching a drop
        // this.rainLayer.tileMap.tileHasProperty()

        var flyX = 0;
        var flyY = 0;
        var strength = Parameters.flyStrength(c.energy);
        if(!c.resting || this.godmode) {
          if(isOn('lmb')) {
            var pos = pc.device.input.mousePos;
            var pX = this.layer.screenX(playerPos.x);
            var pY = this.layer.screenY(playerPos.y);

            if(pos.y < pY-50) { flyY -= strength; }
            if(pos.y > pY+50) { flyY += strength; }
            if(pos.x < pX-50) { flyX -= strength; }
            if(pos.x > pX+50) { flyX += strength; }
          } else {
            if(isOn('up')) { flyY -= strength; };
            if(isOn('down')) { flyY += strength; };
            if(isOn('left')) { flyX -= strength; };
            if(isOn('right')) { flyX += strength; };
          }
        }
        var flying = (flyX || flyY);
        var pushX = flyX+this.windSpeed;
        var pushY = flyY+this.fallSpeed;
        if(pushX) { playerPhysics.applyForce(pushX,0); }
        if(pushY) { playerPhysics.applyForce(pushY,90); }

        var targetAngle = Math.max(-15, Math.min(45, playerPhysics.getVelocityAngle()-90));
        player.getComponent('selfrighting').targetDir = flying ? targetAngle : 0;
        player.getComponent('sprite').sprite.setAnimation(flying?'fly':'float');

        if(flying && !this.godmode) {
          if(c.energy > 0)
            c.energy -= pc.device.elapsed * (Parameters.flyingEnergyConsumption(c.energy) + this.drainRateAdjust);
          if(c.energy < 1) c.resting = true;
        } else {
          if(c.energy < 100)
            c.energy += pc.device.elapsed * (Parameters.restingEnergyRechargeRate(c.energy) + this.recoveryRateAdjust);
          if(c.energy >= Parameters.restStateExitLevel) {
            c.resting = false;
            if(c.energy >= Parameters.maxOvercharge) {
              c.energy = Parameters.maxOvercharge;
            }
          }
        }

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
      },

      createSplash: function (ent, spatial) {
        var splash = pc.Entity.create(ent.layer);
        var splashAnim = getAnim('bug_splash');
        splash.addComponent(pc.components.Sprite.create({spriteSheet: splashAnim, animationStart: 'splash'}));
        splash.addComponent(pc.components.Spatial.create({
          x: spatial.pos.x + spatial.dim.x / 2 - splashAnim.frameWidth / 2,
          y: spatial.pos.y + spatial.dim.y / 2 - splashAnim.frameHeight / 2,
          w: splashAnim.frameWidth,
          h: splashAnim.frameHeight
        }));
        splash.addComponent(pc.components.Expiry.create({lifetime: 5000}));
        return {splash: splash, splashAnim: splashAnim};
      },

      processAll:function() {
      this._super();
        var debrisList = this.layer.getEntityManager().getTagged('debris');
        if(debrisList) {
          for(var next = debrisList.first; next; next = next.next()) {
            var ent = next.obj;
            var sp = ent.getComponent('spatial');
            if(sp.pos.y >= this.waterLevel) {
              this.createSplash(ent, sp);
              ent.remove();
            }
          }
        }
      }
    });