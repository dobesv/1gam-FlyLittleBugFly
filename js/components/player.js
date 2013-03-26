PlayerComponent = pc.components.Component.extend('PlayerComponent',
    {
      create:function (options)
      {
        var c = this._super();
        c.config(options);
        return  c;
      }
    },
    {
      energy:100,
      dead:false,

      init: function(options) {
        this._super('player');
        if(pc.valid(options))
          this.config(options);
      },

      config:function(options) {
        this.energy = pc.checked(options.energy, 100);
        this.dead = false;
      },

      die:function() {
        if(this.dead)
          return;
        this.dead = true;
        var ent = this.getEntity();
        // Spawn dead bug and dandelion

        var playerSpatial = ent.getComponent('spatial');
        var playerPhysics = ent.getComponent('physics');
        var linearVelocity = playerPhysics.getLinearVelocity();
        var tumbler = pc.Entity.create(ent.layer);
        var tumbleAnim = getAnim('player_tumble');
        tumbler.addComponent(pc.components.Sprite.create({spriteSheet: tumbleAnim, animationStart:'tumble'}));
        tumbler.addComponent(pc.components.Spatial.create({
          x: playerSpatial.pos.x, y: playerSpatial.pos.y, w: tumbleAnim.frameWidth, h: tumbleAnim.frameHeight
        }));
        tumbler.addComponent(pc.components.Physics.create({
          gravity: {x: 0, y: 5},
          linearVelocity: linearVelocity,
          collisionGroup:-1,
          collisionCategory:COLLIDE_PLAYER,
          collisionMask:COLLIDE_ENEMY
        }));
        tumbler.addComponent(pc.components.Expiry.create({lifetime:5000}))

        var seed = pc.Entity.create(ent.layer);
        var seedAnim = getAnim('seed_fall');
        seed.addComponent(pc.components.Sprite.create({spriteSheet: seedAnim, animationStart:'fall'}));
        seed.addComponent(pc.components.Spatial.create({
          x: playerSpatial.pos.x, y: playerSpatial.pos.y, w: seedAnim.frameWidth, h: seedAnim.frameHeight
        }));
        seed.addComponent(pc.components.Expiry.create({lifetime:5000}))

        playerPhysics.setGravity(0,0);
        playerPhysics.setCollisionMask(0);
        playerPhysics.setCollisionGroup(0);
        ent.active = false;
      }
    });

