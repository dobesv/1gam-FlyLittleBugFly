FollowPath = pc.components.Component.extend('FollowPath',
    {
      create:function (options)
      {
        var n = this._super();
        n.config(options);
        return n;
      }
    },
    {
      path:null,
      pathPosition:0,

      init: function(opts)
      {
        this._super('followpath');
        if(pc.valid(opts))
          this.config(opts);
      },

      config: function(opts)
      {
        var path = opts.path;
        this.path = opts.path;
        if(! pc.valid(this.path.points)) {
          this.path.points = [[0,0]];
        }
        //console.log("New follow path; path is ", path, path.x, path.y, path.points);
      }

    });

