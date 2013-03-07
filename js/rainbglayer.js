
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
            var canvasWidth = pc.device.canvasWidth;
            var canvasHeight = pc.device.canvasHeight;
            this.points.forEach(function(pt) {
                if(pt.y > canvasHeight) {
                    pt.x = Math.floor((Math.random()*canvasWidth)+1);
                    pt.y = -pt.size - (Math.random()*50);
                } else {
                    pt.y += pt.speed*pc.device.elapsed;
                    //pt.x += *pc.device.elapsed;
                }
            }, this);
        },

        draw:function() {
            var ctx = pc.device.ctx;
            this.points.forEach(function(pt) {
                if(pt.size == 0) return;
                var x = pt.x;
                var y = pt.y;
                var canvasWidth = pc.device.canvasWidth;
                var canvasHeight = pc.device.canvasHeight;
                if(this.origin) {
                    x = (x + this.origin.x) % canvasWidth;
                    y = (y + this.origin.y) % canvasHeight;
                }
//                var gradient = ctx.createRadialGradient(pt.x, pt.y, pt.size/2, pt.x, pt.y, pt.size);
//                gradient.addColorStop(0,"rgba("+rainDropColor+",0.1)");
//                gradient.addColorStop(0.25,"rgba("+rainDropColor+",0.2)");
//                gradient.addColorStop(0.5,"rgba("+rainDropColor+",0.2)");
//                gradient.addColorStop(0.75,"rgba("+rainDropColor+",0.1)");
//                gradient.addColorStop(1,"rgba("+rainDropColor+",0)");
//                ctx.fillStyle = gradient;
//                ctx.fillRect(pt.x-pt.size,pt.y-pt.size,pt.size*2,pt.size*2);
                this.image.setScale(pt.size / this.image.width, pt.size / this.image.width);
                this.image.alpha = 0.25;
                this.image.draw(ctx, x, y)
                //this.image.alpha = 1;
                //this.image.setScale(1,1);
                //console.log('drawing rain at', pt.x, pt.y, pt.size);
            }, this);
        }
    });