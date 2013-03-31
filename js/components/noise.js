//
// Play a sound - alter the volume based on the position of the entity relative to the screen
//
NoiseMaker = pc.components.Component.extend('NoiseMaker',
    {
      create:function (opts)
      {
        var c = this._super();
        c.config(opts);
        return  c;
      }
    },
    {
      sounds: [],
      loops: [],
      volume: 0,

      init: function()
      {
        this._super('noise');
      },

      config:function(opts) {
        this.loops.length = 0;
        this.sounds.length = 0;
        this.volume = pc.checked(opts.volume, 1);
        if(opts.drone) {
          var drone = typeof opts.drone === 'string' ? pc.device.loader.get(opts.drone).resource : opts.drone;
          this.loops.push(drone);
        }
      },

      play:function(sound,loop) {
        if (!pc.device.soundEnabled) return;
        if(typeof sound === 'string') {
          sound = pc.device.loader.get(sound).resource;
        }
        if(loop) {
          // Don't play the same loop multiple times per entity ...
          for(var i=0; i < this.loops.length; i++) {
            if(this.loops[i] == sound)
              return;
          }
          this.loops.push(sound);
        }
        if(this.volume < 0.01) {
          // Don't start sounds that are too quiet to hear
          return;
        }
        var s = sound.play(loop || false);
        if(s) {
          s.volume = this.volume;
          this.sounds.push(s);
        }
        return s;
      },

      stop:function() {
        this.sounds.forEach(function(s) {
          s.pause();
        });
        this.sounds.length = 0;
        this.loops.length = 0;
      },

      /**
       * Update volume of all playing sounds for this entity
       * @param vol New volume level (0.0-1.0)
       */
      setVolume:function(vol) {
        if(vol != this.volume) {
          if(this.sounds.length != 0 || this.loops.length != 0)
            console.log("Adjusting volume on "+this._entity+" to "+vol);
          // If the volume is increased from silence, restart any loops
          var restartLoops = this.volume < 0.01 && vol >= 0.01;
          this.volume = vol;
          if(restartLoops) {
            console.log('Restarting loops ...');
            this.loops.forEach(function(loop) {
              var s = loop.play(true);
              if(s) {
                s.volume = vol;
                this.sounds.push(s);
              }
            }, this);
          }
          this.sounds.forEach(function(s) {
            // If the volume is super low, just stop playing the sound
            if(!s.ended && !s.paused) {
              console.log('Set volume on sound '+ s.src+' to '+vol);
              s.volume = vol;
              if(vol < 0.01)
                s.pause();
            }
          });
        }
      },

      onBeforeRemoved:function() {
        this.stop();
      },

      /**
       * Remove any sounds that have finished playing from our list of sounds
       */
      cleanup:function() {
        for(var i=0; i < this.sounds.length; i++) {
          if(this.sounds[i].ended) {
            this.sounds.splice(i,1);
            i--;
          }
        }
      }

    });

