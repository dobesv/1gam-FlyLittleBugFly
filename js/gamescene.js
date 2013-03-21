
var COLLIDE_PLAYER=1;
var COLLIDE_WALL=2;
var COLLIDE_DROPS=4;

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
      playerPhysics:null,
      playerSpatial:null,

      input:null,

      rain:null,

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
        var physics = new pc.systems.Physics({
          gravity:{x:0,y:10}
        });
        this.gameLayer.addSystem(physics);
        this.gameLayer.addSystem(this.rain);
        this.gameLayer.addSystem(new SelfRightingSystem());

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

        physics.createStaticBody(   0,   0,  ww, 1,  1, COLLIDE_WALL, COLLIDE_WALL|COLLIDE_PLAYER); // top
        physics.createStaticBody(   0,wh-1,  ww, 1,  1, COLLIDE_WALL, COLLIDE_WALL|COLLIDE_PLAYER); // bottom
        physics.createStaticBody(   0,   0,   1,wh,  1, COLLIDE_WALL, COLLIDE_WALL|COLLIDE_PLAYER); // left
        physics.createStaticBody(ww-1,   0,   1,wh,  1, COLLIDE_WALL, COLLIDE_WALL|COLLIDE_PLAYER); // right

        this.gameLayer.addSystem(this.input = new pc.systems.Input());
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
        if (aType == pc.BodyType.ENTITY && bType == pc.BodyType.ENTITY)
        {
          if(entityA.hasTag('drop')) {

          }
        }
      },

      createEntity:function (layer, type, x, y, dir, shape, options)
      {
        //console.log('Create entity', type, x, y, dir, shape, options);
        if(type == 'player') {
          if(this.player) {
            console.log('Extra player start defined!', x, y);
            return;
          }
          var playerImage = getImage('bug_float');
          var player = this.player = pc.Entity.create(layer);
          var playerPhysics = this.playerPhysics = pc.components.Physics.create({
            gravity:{x:10,y:1},
            linearDamping:1,
            angularDamping:3,
            mass:0.1,
            faceVel:true,
            maxSpeed:{x:100,y:100},
            bounce:3,
            collisionGroup:1,
            collisionCategory:COLLIDE_PLAYER,
            collisionMask:COLLIDE_DROPS|COLLIDE_WALL
          });
          var playerSpatial = this.playerSpatial = pc.components.Spatial.create({
            x:x,y:y,w:playerImage.width, h:playerImage.height
          });
          player.addComponent(this.playerSpatial);
          player.addComponent(this.playerPhysics);
          player.addComponent(SelfRighting.create());
          player.addComponent(pc.components.Sprite.create({
            spriteSheet:new pc.SpriteSheet({
              image:playerImage
            })
          }));
          player.addComponent(pc.components.Input.create({
            states: [
              ['left', ['A', 'LEFT']],
              ['right', ['D', 'RIGHT']],
              ['up', ['W', 'UP']],
              ['down', ['S', 'DOWN']],
              ['lmb', ['TOUCH', 'MOUSE_BUTTON_LEFT_DOWN', 'MOUSE_BUTTON_RIGHT_DOWN'], false],
              ['rmb', ['MOUSE_BUTTON_RIGHT_DOWN'], false]
            ]
          }));
          player.addTag('player');
        } else if(type == 'dropEmitter') {
          var delay = 1000 * parseFloat(options.delay || "0") + x + y;
          var now = (new Date()).getTime();
          this.rain.addEmitter({
            lastDrop:now + delay,
            interval:1000.0 / parseFloat(options.rate || "1"), // In milliseconds
            size:parseFloat(options.size || "1"),
            x:x,
            y:y});
        }
      },

      // handle menu actions
      onAction:function (actionName, event, pos, uiTarget)
      {
      },

      process:function ()
      {

        var playerPos = this.playerSpatial.getCenterPos();

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

        // always call the super
        this._super();

        var player = this.player;
        var input = this.input;
        var playerPhysics = this.playerPhysics;
        var isOn = function(s) {
          return input.isInputState(player, s);
        };

        if(playerPos.x > this.worldWidth - 120) {
          // Game over
          pc.device.game.pause();
        }

        // Check if the player is touching a drop
        // this.rainLayer.tileMap.tileHasProperty()

        if(isOn('lmb')) {
          var pos = pc.device.input.mousePos;
          var pX = this.gameLayer.screenX(playerPos.x);
          var pY = this.gameLayer.screenY(playerPos.y);
          if(pos.y < pY-50) playerPhysics.applyForce(1,-90);
          if(pos.y > pY+50) playerPhysics.applyForce(1,90);
          if(pos.x < pX-50) playerPhysics.applyForce(1,180);
          if(pos.x > pX+50) playerPhysics.applyForce(3,0);
        } else {
          if(isOn('up')) { playerPhysics.applyForce(1,-90); };
          if(isOn('down')) { playerPhysics.applyForce(1,90); };
          if(isOn('left')) { playerPhysics.applyForce(1,180); };
          if(isOn('right')) { playerPhysics.applyForce(3,0); };
        }

        var targetAngle = this.playerPhysics.getVelocityAngle();
        player.getComponent('selfrighting').targetDir = targetAngle;

        if(pc.device.canvasHeight > this.worldHeight) {
          pc.device.ctx.clearRect(0, this.worldHeight, pc.device.canvasWidth, pc.device.canvasHeight-this.worldHeight);
        }

      }
    });
