ImageLayer = pc.Layer.extend('ImageLayer',
    {},
    {
        image: null,

        init:function(resourceName, zIndex) {
            this._super(name+" image layer", zIndex);
            this.image = pc.device.loader.get(resourceName).resource;
            //console.log("ImageLayer.init", resourceName, name, zIndex, this.image);
        },

        draw:function() {
            var x = this.screenX(0);
            var y = this.screenY(0);
            this.image.draw(pc.device.ctx, x, y);
        }
    }
);
