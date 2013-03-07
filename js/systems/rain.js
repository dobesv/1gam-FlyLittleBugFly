
Rain = pc.systems.EntitySystem.extend('Rain',
    {},
    {
        emitters:[],
        init: function()
        {
            this._super(['rain', 'droplet']);
        },


        process: function(entity)
        {
            var c = entity.getComponent('droplet');
            if (!c.active) return;

            var spatial = entity.getComponent('spatial');
            if(this.layer.screenX(spatial.pos.x) < 0
                || this.layer.screenY(spatial.pos.y) > pc.device.canvasHeight) {
                entity.remove();
            }
        },

        spawnDrop:function(x, y, size) {
            var drop = pc.Entity.create(this.layer);
            var waterDropImage = getImage('water_drop');
            drop.addComponent(pc.components.Physics.create({
                gravity:{x:0,y:1},
                linearDamping:0,
                angularDamping:0,
                faceVel:false,
                maxSpeed:{x:100,y:100},
                bounce:0,
                mass:100,
                collisionGroup:0,
                collisionCategory:COLLIDE_DROPS,
                collisionMask:COLLIDE_PLAYER|COLLIDE_PLAYER,
                shape:pc.CollisionShape.CIRCLE,
                linearVelocity:{x:50,y:50}
            }));
            drop.addComponent(pc.components.Sprite.create({
                spriteSheet:new pc.SpriteSheet({
                    image:waterDropImage
                })
            }));
//            drop.addComponent(pc.components.Expiry.create({
//                lifetime: 5000
//            }));
            drop.addComponent(pc.components.Spatial.create({
                x:x, y:1-waterDropImage.height, w:waterDropImage.width, h:waterDropImage.height
            }));
            drop.addComponent(Droplet.create());
            drop.addTag('drop');
        },


        addEmitter:function(options) {
            this.emitters.push(options);
        },

        processAll:function() {
            this._super();
            this.emitters.forEach(function(emitter) {
                var now = (new Date()).getTime();
                var timeSinceLastDrop = now - emitter.lastDrop;
                if(this.layer.screenX(emitter.x) + this.layer.screenY(0) < 0) {
                    // Don't drop water below to the left of the screen, we're not going back there
                    return;
                }
                if(timeSinceLastDrop > emitter.interval) {
                    //console.log("Emit drop at", emitter.x, emitter.y);
                    this.spawnDrop(emitter.x, emitter.y, emitter.size);
                    emitter.lastDrop = now + pc.device.elapsed;
                    //console.log('Time since last drop', timeSinceLastDrop, emitter.interval)
                }
            }, this);
        }

    });