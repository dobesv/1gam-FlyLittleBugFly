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
          'object_tiles.png',
          'button_main_menu.png',
          'button_play_again.png',
          'button_you_failed.png',
          'energy_bar.png',
          'menu_button_about.png',
          'menu_button_start.png',
          'title_screen.jpg'].forEach(loadImage);

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

      onLoaded:function () {
        // Erase loading screen
        var ctx = pc.device.ctx;
        ctx.clearRect(0, 0, pc.device.canvasWidth, pc.device.canvasHeight);


        setupAnims();
        // create the game scene (notice we do it here AFTER the resources are loaded)
        //this.gameScene = new GameScene();
        //this.addScene(this.gameScene, false);

        // create the menu scene (but don't make it active)
        this.menuScene = new MenuScene();
        this.addScene(this.menuScene, true);

        playSound('rain1', 1, true);
        playSound('music1', 1, true);

        pc.device.input.bindAction(this, 'pause', 'P');
        pc.device.input.bindAction(this, 'pause', 'PAUSE');
        pc.device.input.bindAction(this, 'restart', 'R');
        pc.device.input.bindAction(this, 'toggleDebug', 'D');
      },

      onAction:function(actionName) {
        console.log('Game action', actionName);
        switch(actionName) {
          case 'pause':
            if(this.gameScene.paused)
              this.gameScene.resume();
            else
              this.gameScene.pause();
            break;
          case 'startGame':
          case 'restart':
            if(this.gameScene) {
              this.deactivateScene(this.gameScene);
              console.log('old scene: '+this.gameScene+"  ... "+this.gameScene.gameLayer+"   "+this.gameScene.player);
            }
            this.addScene(this.gameScene = new GameScene());
            console.log('new scene: '+this.gameScene+"  ... "+this.gameScene.gameLayer+"   "+this.gameScene.player);
            break;
          case 'toggleDebug':
            this.gameScene.physics.setDebug(this.toggleHashState('debug'));
            break;
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

      getPlayer:function() {
        return this.gameScene.player;
      },

      setHashState:HashState.set.bind(HashState),
      clearHashState:HashState.clear.bind(HashState),
      getHashState:HashState.get.bind(HashState),
      hasHashState:HashState.has.bind(HashState),
      toggleHashState:HashState.toggle.bind(HashState)

    });


