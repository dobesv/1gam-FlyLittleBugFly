
var rainDropColor = "186,210,255";

RainBgLayer = pc.Layer.extend("RainBgLayer",
    {},
    {
      points:[],

      init:function(zIndex, count) {
        this._super("rain layer z"+zIndex, zIndex);
        this.image = getImage("bg_drop");
        var canvasWidth = pc.device.canvasWidth;
        var canvasHeight = pc.device.canvasHeight;
        count = count || 25;
        //console.log("ImageLayer.init", zIndex, count, canvasWidth, canvasHeight);
        for(var x = 1; x < count; x++) {
          this.points.push({
            x:Math.floor((Math.random()*canvasWidth)+1),
            y:Math.floor((Math.random()*500)+1),
            size:Math.floor((Math.random()*25)+25),
            speed:(Math.random())+0.25
          });
        }
      },
      process:function() {
        this._super();
        var canvasWidth = pc.device.canvasWidth;
        var canvasHeight = pc.device.canvasHeight;
        var leftX = -this.screenX(-this.image.width);
        var bottomY = -this.screenY(canvasHeight);
        var topY = this.screenY(0);
        this.points.forEach(function(pt) {
          pt.y += pt.speed*pc.device.elapsed;
          if(this.screenY(pt.y) > canvasHeight) {
            pt.x = leftX + Math.round(Math.random()*canvasWidth);
            pt.y = topY - pt.size - (Math.random()*50);
          } else if(this.screenX(pt.x) < -pt.size) {
            pt.x += canvasWidth;
          }
        }, this);
      },

      draw:function() {
        var ctx = pc.device.ctx;
        this.points.forEach(function(pt) {
          if(pt.size == 0) return;
          var canvasWidth = pc.device.canvasWidth;
          var canvasHeight = pc.device.canvasHeight;
          var x = this.screenX(pt.x);
          var y = this.screenY(pt.y);
          this.image.setScale(pt.size / this.image.width, pt.size / this.image.width);
          this.image.alpha = 0.25;
          this.image.draw(ctx, x, y)
          //this.image.alpha = 1;
          //this.image.setScale(1,1);
          //console.log('drawing rain at', pt.x, pt.y, pt.size);
        }, this);
      }
    });