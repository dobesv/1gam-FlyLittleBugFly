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
      }
    });

