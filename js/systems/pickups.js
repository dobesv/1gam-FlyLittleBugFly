
PickupSystem = pc.systems.EntitySystem.extend('PickupSystem',
    {},
    {
      init: function()
      {
        this._super(['pickup']);
      },


      process: function(player)
      {

      },

      onTouch:function(player, pickup) {
        var c = pickup.getComponent('pickup');
        if(!c.active)
          return;
        c.active = false;
        pickup.getComponent('sprite').sprite.setAnimation('burst');
        pickup.addComponent(pc.components.Expiry.create({lifetime:1000}));
        var physics = pickup.getComponent('physics');
        physics.setCollisionMask(0);
        physics.active = false;
      }

    });