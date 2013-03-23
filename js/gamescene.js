
var COLLIDE_PLAYER=1;
var COLLIDE_WALL=2;
var COLLIDE_DROPS=4;
var COLLIDE_ENEMY=8;
var COLLIDE_PICKUP=16;

/**
 * GameScene
 * A template game scene
 */
GameScene = pc.Scene.extend('GameScene',
    { },
    {
      gameLayer:null,
      bgLayer:null,
      rainLayer:null,

      player:null,
      playerControlSystem:null,
      pickupSystem:null,

      input:null,

      rain:null,
      physics:null,


      init:function () {
        this._super();

        this.emitters = [];

        this.rain = new Rain();

        this.loadFromTMX(getTileMap('level1'), this);

        //-----------------------------------------------------------------------------
        // game layer
        //-----------------------------------------------------------------------------
        var gameLayer = this.gameLayer = this.get('entity');
        var wh = this.worldHeight = this.gameLayer.worldSize.y;
        var ww = this.worldWidth = this.gameLayer.worldSize.x;
        //console.log('World size', this.worldWidth, this.worldHeight);
        this.gameLayer.addSystem(new pc.systems.Render());
        this.gameLayer.addSystem(new pc.systems.Effects());
        var physics = this.physics = new pc.systems.Physics({
          gravity:{x:0,y:10}
        });
        this.gameLayer.addSystem(physics);
        this.gameLayer.addSystem(this.rain);
        this.gameLayer.addSystem(new FollowPathSystem());
        this.gameLayer.addSystem(new SelfRightingSystem());
        this.gameLayer.addSystem(new pc.systems.Activation());
        this.gameLayer.addSystem(new pc.systems.Expiration());
        var playerControlSystem = this.playerControlSystem = new PlayerControlSystem();
        this.gameLayer.addSystem(playerControlSystem);
        this.gameLayer.addSystem(this.pickupSystem = new PickupSystem());

        for(var n=1; n <= 3; n++) {
          var bgLayer = new ImageLayer('bglayer'+n, 3-n);
          bgLayer.fitTo(this.worldWidth, this.worldHeight);
          var ratio = 1 / (n * n);
          bgLayer.setOriginTrack(this.gameLayer, ratio, ratio);
          this.addLayer(bgLayer);
          var rainRatio = ratio + 0.1;
          var rainBgLayer = new RainBgLayer(3-n+0.1, 10/rainRatio, rainRatio*20);
          rainBgLayer.setOriginTrack(this.gameLayer, ratio, ratio);
          this.addLayer(rainBgLayer);
        }
        var riverLayer = new ImageLayer('river', 3);
        riverLayer.moveToBottom(this.worldHeight);
        riverLayer.setOriginTrack(this.gameLayer);
        this.addLayer(riverLayer);

        ['scenery_close', 'scenery_far', 'scenery_front'].forEach(function(layerName, n) {
          var layer = this.get(layerName);
          layer.setOriginTrack(this.gameLayer);
        }, this);

        var rainLayer = this.rainLayer = this.get('rain');
        var rainTileMap = rainLayer.tileMap;
        var tilesHigh = rainTileMap.tilesHigh;
        for(var aty = 0; aty < rainTileMap.tilesHigh; aty++) {
          rainTileMap.tiles[aty+tilesHigh] = rainTileMap.tiles[aty];
        }
        rainTileMap.tilesHigh = tilesHigh*2;
        //physics.addTileCollisionMap(rainTileMap, 0, COLLIDE_DROPS, COLLIDE_PLAYER|COLLIDE_PLAYER);

        physics.createStaticBody(   0,   0,  ww, 1,  0, COLLIDE_WALL, COLLIDE_PLAYER); // top
        physics.createStaticBody(   0,wh-1,  ww, 1,  0, COLLIDE_WALL, COLLIDE_PLAYER); // bottom
        physics.createStaticBody(   0,   0,   1,wh,  0, COLLIDE_WALL, COLLIDE_PLAYER); // left
        physics.createStaticBody(ww-1,   0,   1,wh,  0, COLLIDE_WALL, COLLIDE_PLAYER); // right

        var input = this.input = playerControlSystem.input = new pc.systems.Input();
        input.onAction = this.onAction.bind(this);
        this.gameLayer.addSystem(input);
        var bgLayer = this.bgLayer = this.get('background');
        bgLayer.setOriginTrack(gameLayer, 0.1, 0.1);
        bgLayer.setZIndex(0);

        physics.onCollisionStart = this.onCollisionStart.bind(this);

      },
      /**
       * Called when an entity first collides with a tile or another entity. Use the fixture types to differentiate
       * collisions with different fixtures.
       * @param {pc.BodyType} aType Type of the collision body (pc.BodyType.TILE or pc.BodyType.ENTITY)
       * @param {pc.BodyType} bType Type of the collision body (pc.BodyType.TILE or pc.BodyType.ENTITY)
       * @param {pc.Entity} entityA If an entity, a reference to the entity that was the first part of the collision
       * @param {pc.Entity} entityB If an entity, a reference to the entity that was the second part of the collision
       * @param {Number} fixtureAType User type provided when fixture was created of the first fixture
       * @param {Number} fixtureBType User type provided when fixture was created of the second fixture
       * @param {b2Contact} contact Additional contact information
       */
      onCollisionStart:function (aType, bType, entityA, entityB, fixtureAType, fixtureBType, contact)
      {
        if (aType == pc.BodyType.ENTITY && bType == pc.BodyType.ENTITY) {
          if(entityA.hasTag('player')) {
            if(entityB.hasComponentOfType('pickup')) {
              this.pickupSystem.onTouch(entityA, entityB);
            } else {
              this.playerControlSystem.onTouchPlayer(entityA, entityB);
            }
          } else if(entityB.hasTag('player')) {
            if(entityA.hasComponentOfType('pickup')) {
              this.pickupSystem.onTouch(entityB, entityA);
            } else {
              this.playerControlSystem.onTouchPlayer(entityB, entityA);
            }
          }
        }
      },

      onAction:function(actionName) {
        console.log('scene onAction: '+actionName);
        var ent = uiTarget.getEntity();
        if(ent.hasTag('player')) {
          this.playerControlSystem.onAction(this.player, actionName, event, pos, uiTarget);
        }
      },

      createEntity:function (layer, type, x, y, dir, shape, options)
      {
        //console.log('Create entity', type, x, y, dir, shape, options);
        var ent = pc.Entity.create(layer);
        var sprite = null;
        var ss = getAnim(type);
        if(ss) {
          ent.addComponent(sprite = pc.components.Sprite.create({spriteSheet:ss}));
          ent.addComponent(pc.components.Spatial.create({
            x:x-ss.frameWidth/2, y:y-ss.frameHeight/2,  w:ss.frameWidth, h:ss.frameHeight
          }));
          if(type == 'player') {
            if(this.player) {
              ent.remove();
              console.log('Extra player start defined!', x, y);
              return;
            }
            this.player = ent;
            ent.addComponent(PlayerComponent.create());
          } else if(type == 'bee' || type == 'mosquito') {
            ent.addComponent(pc.components.Physics.create({
              linearDamping:1,
              mass:10,
              shapes:getAnimShapes(type),
              collisionGroup:COLLIDE_ENEMY,
              collisionCategory:COLLIDE_ENEMY,
              collisionMask:COLLIDE_PLAYER
            }));
            sprite.sprite.setAnimation('fly');
            ent.addComponent(FollowPath.create({path:shape}));
            ent.addComponent(pc.components.Activator.create({
              tag:'player', range:900
            }));
            ent.addComponent(SelfRighting.create());
            ent.addTag('predator');
          } else if(type == 'orb1') {
            ent.addComponent(pc.components.Physics.create({
              gravity:{x:0,y:0},
              sensorOnly:true,
              shapes:getAnimShapes(type),
              collisionGroup:COLLIDE_PICKUP,
              collisionCategory:COLLIDE_PICKUP,
              collisionMask:COLLIDE_PLAYER
            }));
            sprite.sprite.setAnimation('float');
            ent.addComponent(pc.components.Activator.create({
              tag:'player', range:900
            }));
            ent.addComponent(PickupComponent.create({}));
          }
        }

        ent.addTag(type);
      },

      // handle menu actions
      onAction:function (actionName, event, pos, uiTarget)
      {
      },

      process:function ()
      {

        var playerPos = this.player.getComponent('spatial').getCenterPos();

        // Follow the player
        var targetOriginX = Math.max(0, Math.min(this.worldWidth - this.viewPort.w, playerPos.x - this.viewPort.w/3));
        var targetOriginY = Math.max(0, Math.min(this.worldHeight - this.viewPort.h, playerPos.y - this.viewPort.h/2));
        var currentOriginX = this.gameLayer.origin.x;
        var currentOriginY = this.gameLayer.origin.y;
        var originDeltaX = Math.round(Math.max(-20, Math.min(20, (targetOriginX-currentOriginX)*0.5)));
        var originDeltaY = Math.round(Math.max(-20, Math.min(20, (targetOriginY-currentOriginY)*0.5)));
        var originX = currentOriginX + originDeltaX;
        var originY = currentOriginY + originDeltaY;
        this.gameLayer.setOrigin(originX,  originY);

        // Make the "rain layer" fall down
        var rainLayer = this.rainLayer;
        var rainOriginY = originY + (this.worldHeight - ((Date.now()/2) % this.worldHeight));
        rainLayer.setOrigin(originX, rainOriginY);

        if(pc.device.canvasHeight > this.worldHeight) {
          pc.device.ctx.clearRect(0, this.worldHeight, pc.device.canvasWidth, pc.device.canvasHeight-this.worldHeight);
        }

        // always call the super
        this._super();

        if(playerPos.x > this.worldWidth - 120 || playerPos.y > this.worldHeight) {
          // Game over
          pc.device.game.pause();
        }

        this.physics.setDebug(window.location.hash.indexOf('debug') > 0);
      }
    });
