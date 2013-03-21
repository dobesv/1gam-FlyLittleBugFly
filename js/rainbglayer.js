
var rainDropColor = "186,210,255";

RainBgLayer = pc.Layer.extend("RainBgLayer",
    {},
    {
      points:[],
      pointSize:0,
      worldHeight:0,

      init:function(zIndex, count, size, worldHeight) {
        this._super("rain layer z"+zIndex, zIndex);
        this.image = getImage("bg_drop");
        var canvasWidth = pc.device.canvasWidth;
        count = count || 25;
        this.pointSize = pc.checked(size, 25);
        this.worldHeight = pc.checked(worldHeight, pc.device.canvasHeight);
        //console.log("ImageLayer.init", zIndex, count, canvasWidth, canvasHeight);
        for(var x = 1; x < count; x++) {
          this.points.push(this.resetPoint({ x:0, y:0, size:0, speed:0 }));
        }
      },

      resetPoint: function(pt, y) {
        pt.x = this.origin.x + Math.floor((Math.random()*pc.device.canvasWidth*2)+1);
        pt.y = pc.valid(y) ? y : Math.floor((Math.random()*this.worldHeight*0.75)+1);
        pt.size = Math.ceil(((Math.random()*0.2)+0.9)*this.pointSize);
        pt.speed = (Math.random()+0.25)*20;
        return pt;
      },

      process:function() {
        this._super();
        var topY = this.screenY(0);
        this.points.forEach(function(pt) {
          pt.y += pt.size * pt.speed * pc.device.elapsed * 0.001;
          if(this.screenY(pt.y) > this.worldHeight || this.screenX(pt.x) < -pt.size) {
            this.resetPoint(pt, topY - pt.size);
          }
        }, this);
      },

      draw:function() {
        var ctx = pc.device.ctx;
        this.points.forEach(function(pt) {
          if(pt.size == 0) return;
          var x = this.screenX(pt.x);
          var y = this.screenY(pt.y);
          var wobbleAngle = (Date.now() + x)*0.02;
          var wobbleX = 1+0.1*Math.sin(wobbleAngle);
          var wobbleY = 1+0.1*Math.sin(wobbleAngle + Math.PI);
          this.image.setScale(wobbleX * pt.size / this.image.width, wobbleY * pt.size / this.image.width);
          this.image.alpha = 0.25;
          this.image.draw(ctx, x, y)
          //this.image.alpha = 1;
          //this.image.setScale(1,1);
          //console.log('drawing rain at', pt.x, pt.y, pt.size);
        }, this);
      }
    });