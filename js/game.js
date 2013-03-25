/**
 * A sample game.js for you to work from
 */

TheGame = pc.Game.extend('TheGame',
    { },
    {
      gameScene:null,
      menuScene:null,

      onReady:function ()
      {
        this._super();

        // disable caching when developing
        if(pc.device.devMode)
          pc.device.loader.setDisableCache();

        // no resources are loaded in this template, so this is all commented out
        ['water_drop.png',
          'bg_drop.png',
          'tiles.png',
          'Tree_layer_1.png',
          'Tree_layer_2.png',
          'bglayer1.png',
          'bglayer2.png',
          'bglayer3.jpg',
          'river.jpg',
          'object_tiles.png'].forEach(loadImage);

        loadTileMap('level1');
        loadAnims();

        ['rain1', 'music1'].forEach(loadSound);

        // fire up the loader
        pc.device.loader.start(this.onLoading.bind(this), this.onLoaded.bind(this));
      },

      onLoading:function (percentageComplete)
      {
        // display progress, such as a loading bar
        var ctx = pc.device.ctx;
        ctx.clearRect(0, 0, pc.device.canvasWidth, pc.device.canvasHeight);
        ctx.font = "normal 50px Verdana";
        ctx.fillStyle = "#8f8";
        ctx.fillText('Fly, Little Bug, Fly!', 40, (pc.device.canvasHeight / 2) - 50);
        ctx.font = "normal 18px Verdana";
        ctx.fillStyle = "#777";

        ctx.fillText('Loading: ' + percentageComplete + '%', 40, pc.device.canvasHeight / 2);
      },

      onLoaded:function ()
      {
        // Erase loading screen
        var ctx = pc.device.ctx;
        ctx.clearRect(0, 0, pc.device.canvasWidth, pc.device.canvasHeight);


        setupAnims();
        // create the game scene (notice we do it here AFTER the resources are loaded)
        this.gameScene = new GameScene();
        this.addScene(this.gameScene);

        // create the menu scene (but don't make it active)
        this.menuScene = new MenuScene();
        this.addScene(this.menuScene, false);

        // resources are all ready, start the main game scene
        // (or a menu if you have one of those)
        this.activateScene(this.gameScene);

        playSound('rain1', 1, true);
        playSound('music1', 1, true);

        pc.device.input.bindAction(this, 'pause', 'P');
        pc.device.input.bindAction(this, 'pause', 'PAUSE');
      },

      onAction:function(actionName) {
        console.log('Game action', actionName);
        if(actionName == 'pause') {
          if(this.gameScene.paused)
            this.gameScene.resume();
          else
            this.gameScene.pause();
        }
      },

      activateMenu:function()
      {
        this.deactivateScene(this.gameScene);
        this.activateScene(this.menuScene);
      },

      deactivateMenu:function()
      {
        this.deactivateScene(this.menuScene);
        this.activateScene(this.gameScene);
      },

      setHashState:function(k,v) {
        var h = window.location.hash;
        h = h.replace(new RegExp(k+"(=[^,]*)?(,|$)"), "");
        h = h + k;
        if(pc.valid(v)) { h += '='+v; }
        window.location.hash = h;
      },

      clearHashState:function(k) {
        var h = window.location.hash;
        h = h.replace(new RegExp(k+"=[^,]*"), "");
        window.location.hash = h;
      },

      getHashState:function(k, def) {
        var h = window.location.hash;
        if(h && h.length > 1) {
          h = h.replace(/^#?,*/, ',').replace(/,*$/,','); // delimit with commas to make separator processing simpler
          var pos = 0;
          while((pos = h.indexOf(','+k, pos)) >= 0) {
            var endOfKey = pos + k.length + 1;
            var termChar = h.charAt(endOfKey);
            if(termChar == ',')
              return true;
            if(termChar == '=') {
              var endOfValue = h.indexOf(',', endOfKey+1) || h.length;
              var value = h.substring(endOfKey + 1, endOfValue);
              if(value == 'false')
                return false;
              if(value == 'true')
                return true;
              return  value;
            }
          }
        }
        return def;
      },

      hasHashState:function(k) {
        return pc.valid(this.getHashState(k));
      }

    });


