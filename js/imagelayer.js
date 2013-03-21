ImageLayer = pc.Layer.extend('ImageLayer',
    {},
    {
      image: null,
      x: 0,
      y: 0,
      repeatX: true,
      repeatY: false,

      init:function(resourceName, zIndex) {
        this._super(resourceName+" image layer", zIndex);
        this.image = getImage(resourceName);
        //console.log("ImageLayer.init", resourceName, name, zIndex, this.image);
      },

      draw:function() {
        var x = this.screenX(this.x);
        var y = this.screenY(this.y);
        var w = this.image.width*this.image.scaleX;
        var h = this.image.height*this.image.scaleY;
        var adjustX = (w-this.image.width)/2;
        var adjustY = (h-this.image.height)/2;
        var cw = pc.device.canvasWidth;
        var ch = pc.device.canvasHeight;
        var drawnTimes = 0;
        var ctx = pc.device.ctx;
        //ctx.clearRect(0,0,cw,ch);
        for(var yy = y; yy < ch; yy += h) {
          if(yy > -h) {
            for(var xx = x; xx < cw; xx += w) {
              if(xx > -w) {
                var dx = Math.max(0, xx);
                var dy = Math.max(0, yy);
                var sx = -xx/this.image.scaleX;
                var sy = -yy/this.image.scaleY;
                var sw = cw; //this.image.width*this.image.scaleX; //(Math.min(cw/this.image.scaleX,this.image.width) - sx)*this.image.scaleX;
                var sh = ch; // this.image.height*this.image.scaleX; //(Math.min(ch/this.image.scaleY,this.image.height) - sy)*this.image.scaleY;
                //this.image.draw(ctx, sx, sy, dx, dy, sw, sh);
                this.image.draw(ctx,xx+adjustX,yy+adjustY);
                //console.log('Drawing bg', "xxyy", xx, yy, "sxy", sx, sy, 'dxy', dx, dy, 'iwh', w, h, 'swh', sw, sh, 'cwh', cw, ch, drawnTimes, 'player', pc.device.game.gameScene.playerSpatial.pos.x, pc.device.game.gameScene.playerSpatial.pos.y, 'scale', this.image.scaleX, this.image.scaleY);
                drawnTimes++;
              }
              if(!this.repeatX)
                break;
            }
          }
          if(!this.repeatY)
            break;
        }
        //console.log('Done drawing bg at ', drawnTimes, xx, yy, cw, ch);

      },

      /**
       * Scale the image so that it will always fill the screen.
       *
       * @param width Screen width to use
       * @param height Screen height to use
       */
      fitTo:function(width,height) {
        var scale = Math.min(width/this.image.width, height/this.image.height);
        this.image.setScale(scale,scale);
      },

      moveToBottom:function(height) {
        this.repeatY = false;
        this.y = height - (this.image.height / this.image.scaleY);
        console.log('move to bottom', this.y, this.image.height, this.image.scaleY, height);
      }
    }
);
