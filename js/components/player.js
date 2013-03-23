PlayerComponent = pc.components.Component.extend('PlayerComponent',
    {
    },
    {
      dead:false,

      init: function() {
        this._super('player');
      },

      die:function() {
        this.dead = true;
        var ent = this.getEntity();
        ent.active = false;
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
//        seed.addComponent(pc.components.Physics.create({
//          gravity: {x: 1, y: 1}, linearVelocity: linearVelocity
//        }));


      }
    });

