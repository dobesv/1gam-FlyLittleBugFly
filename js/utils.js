function loadSound(id, maxPlaying) {
    var path = 'sounds/'+id;
    if (pc.device.soundEnabled)
        pc.device.loader.add(new pc.Sound(path, path, ['ogg','mp3'], maxPlaying || 1));
};
function playSound(id, volume, loop) {
    if (!pc.device.soundEnabled) return;
    var sound = pc.device.loader.get('sounds/'+id).resource;
    sound.setVolume(volume || 1);
    sound.play(loop || false);
};
function loadImage(name) {
    var path = 'images/'+name;
    var id = ('images/'+name.replace(/\....$/, "")).toLowerCase();
    pc.device.loader.add(new pc.Image(id, path));
};
function getImage(name) {
    var id = name.replace(/\....$/, "");
    return pc.device.loader.get('images/'+id).resource;
}
function loadTileMap(name) {
    var id = name.replace(/\.tmx$/, "");
    pc.device.loader.add(new pc.DataResource('tilemaps/'+id, 'data/'+id+'.tmx'));
}
function getTileMap(name) {
    var id = name.replace(/\.tmx$/, "");
    return pc.device.loader.get('tilemaps/'+id).resource;
}

HashState = {
  _clear:function(h, k) {
    var result = h.replace(new RegExp('#'+k+'(=[^,]*)?,*'), "#");
    if(result != h) return result;
    return h.replace(new RegExp(','+k+'(=[^,]*)?'), "");
  },

  _set:function(h, k, v) {
    var h = this._clear(h, k);
    if(h.length > 1) h += ',';
    h = h + k;
    if(typeof v !== 'undefined') { h += '='+v; }
    console.log('Set '+k+' to '+v+' : '+h);
    return h;
  },

  set:function(k,v) {
    window.location.hash = this._set(window.location.hash, k, v);
  },

  clear:function(k) {
    window.location.hash = this._clear(window.location.hash, k);
  },

  get:function(k, def) {
    var h = window.location.hash;
    if(h && h.length > 1) {
      h = h.replace(/^#?,*/, ',').replace(/,*$/,','); // delimit with commas to make separator processing simpler
      var pos = 0;
      while((pos = h.indexOf(','+k, pos)) >= 0) {
        var endOfKey = pos + k.length + 1;
        var termChar = h.charAt(endOfKey);
        if(termChar == ',')
          return true;
        if(termChar == '=') {
          var endOfValue = h.indexOf(',', endOfKey+1) || h.length;
          var value = h.substring(endOfKey + 1, endOfValue);
          if(value == 'false')
            return false;
          if(value == 'true')
            return true;
          return  value;
        }
      }
    }
    return def;
  },

  has:function(k) {
    return pc.valid(this.get(k));
  },

  toggle:function(k, b) {
    if(arguments.length < 2) {
      b = this.has(k);
    }
    if(!b) {
      this.clear(k);
      return false;
    } else {
      this.set(k);
      return true;
    }
  }
}