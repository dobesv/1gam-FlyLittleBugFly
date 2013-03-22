animConfigs = {
  bug:{
    image:'bug_anim.png',
    frameWidth: 52,
    frameHeight: 62,
    anims:{
      fly:{frameCount:2, time:200, frameX: 0},
      float:{framCount:1, time:2000, frameX: 2}
    }
  },
  bee:{
    image:'bee_anim.png',
    frameWidth:136,
    frameHeight:148,
    anims:{
      fly:{frameCount:14, time:583}
    }
  },
  mosquito:{
    image:'mosquito.png',
    frameWidth: 148,
    frameHeight: 109,
    anims: {
      fly:{frameCount:1, time:2000}
    }
  }
};

anims = {};

function loadAnims() {
  for(var k in animConfigs) {
    if(animConfigs.hasOwnProperty(k)) {
      loadImage(animConfigs[k].image);
    }
  }
}
function setupAnims() {
  for(var k in animConfigs) {
    if(animConfigs.hasOwnProperty(k)) {
      var config = animConfigs[k];
      var image = getImage(config.image);
      var ss = anims[k] = new pc.SpriteSheet({image:image, frameWidth:config.frameWidth, frameHeight:config.frameHeight});
      var animDefs = config.anims;
      for(var animName in  animDefs) {
        if(animDefs.hasOwnProperty(animName)) {
          var anim = animDefs[animName];
          anim.name = animName;
          ss.addAnimation(anim);
        }
      }
    }
  }
}
function getAnim(k) {
  if(anims.hasOwnProperty(k))
    return anims[k];
  throw new Error("No animation '"+k+"'");
}