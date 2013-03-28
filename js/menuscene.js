/**
 * MenuScene
 * A template menu scene
 */
MenuScene = pc.Scene.extend('MenuScene',
    { },
    {
      menuLayer:null,
      menuItems:null,
      currentMenuSelection: 0,
      titleButtons:[
        {
          action:'startGame',
          x:517, y:288, w:null, h:null,
          imageId:'menu_button_start',
          image:null,
          entity:null
        }
      ],

      init:function ()
      {
        this._super();

        this.menuItems = [];
        this.currentMenuSelection = 0;

        var bgLayer= this.bgLayer = this.addLayer(new ImageLayer('title_screen', 0));
        bgLayer.fitTo(pc.device.canvasWidth, pc.device.canvasHeight);

        //-----------------------------------------------------------------------------
        // menu layer
        //-----------------------------------------------------------------------------
        var menuLayer = this.menuLayer = this.addLayer(new pc.EntityLayer('menu layer', 10000, 10000));

        // render system to draw text etc
        this.menuLayer.addSystem(new pc.systems.Render());
        this.menuLayer.addSystem(new pc.systems.Input());

        this.titleButtons.forEach(function(but) {
          var ent = but.entity = pc.Entity.create(menuLayer);
          var img = but.image = getImage(but.imageId);
          but.w = img.width;
          but.h = img.height;
          ent.addComponent(pc.components.Spatial.create(but));
          ent.addComponent(pc.components.Input.create({
            actions: [[but.action, ['MOUSE_BUTTON_LEFT_DOWN', 'TOUCH'], true]],
            target: this
          }));
          var ss = new pc.SpriteSheet({image:img});
          ent.addComponent(pc.components.Sprite.create({spriteSheet:ss}));
        }, this);
      },

      changeMenuSelection: function(newSelection)
      {
      },

      // handle menu actions
      onAction:function (actionName, event, pos, uiTarget)
      {
        console.log('Action: '+actionName);
        this.titleButtons.forEach(function(but) {
          if(but.action == actionName) {
            var sp = but.entity.getComponent('spatial');
            sp.pos.x += 2;
            sp.pos.y += 2;
          }
        }, this);
        this.process();
        pc.device.game.onAction(actionName);
      },

      process:function ()
      {
        // clear the background
        // pc.device.ctx.clearRect(0, 0, pc.device.canvasWidth, pc.device.canvasHeight);
        // always call the super
        this._super();
      }

    });
