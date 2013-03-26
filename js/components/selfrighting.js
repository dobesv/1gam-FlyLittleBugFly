SelfRighting = pc.components.Component.extend('SelfRighting',
    {
      create:function ()
      {
        var c = this._super();
        c.targetDir = 0;
        return  c;
      }
    },
    {
        targetDir: 0,
        init: function()
        {
            this._super('selfrighting');
        }

    });

