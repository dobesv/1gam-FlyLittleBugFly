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
            ['bee.png',
             'bug_float.png',
             'mosquito.png',
             'water_drop.png',
             'tiles.gif'].forEach(loadImage);

            loadTileMap('level1');

            //if (pc.device.soundEnabled)
            //   pc.device.loader.add(new pc.Sound('fire', 'sounds/fire', ['ogg', 'mp3'], 15));

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

            // create the game scene (notice we do it here AFTER the resources are loaded)
            this.gameScene = new GameScene();
            this.addScene(this.gameScene);

            // create the menu scene (but don't make it active)
            this.menuScene = new MenuScene();
            this.addScene(this.menuScene, false);

            // resources are all ready, start the main game scene
            // (or a menu if you have one of those)
            this.activateScene(this.gameScene);

            pc.device.input.bindAction(this, 'pause', 'P');
            pc.device.input.bindAction(this, 'pause', 'PAUSE');
        },

        onAction:function(actionName) {
            console.log('Game action', actionName);
            if(actionName == 'pause') {
                this.togglePauseResume();
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
        }
    });


