animConfigs = {
  bug:{
    image:'bug_anim.png',
    frameWidth: 52, // Width of each frame, assuming an even grid of frames
    frameHeight: 62, // Height of each frame, assuming an even grid of frames
    anims:{
      // Starts with the animation mode - 'fly', 'float', 'die', etc..
      // frameCount is the number of frames of animation
      // frameX/frameY specify the starting frame location on the grid (default 0 if not specified)
      // fps: frames per second
      fly:{frameCount:2, fps:24, frameX: 1},
      float:{framCount:1, fps:1, frameX: 0}
    }
  },
  bee:{
    image:'bee_anim.png',
    frameWidth:136,
    frameHeight:148,
    anims:{
      fly:{frameCount:14, fps:24}
    }
  },
  mosquito:{
    image:'mosquito.png',
    frameWidth: 148,
    frameHeight: 109,
    anims: {
      fly:{frameCount:1, fps:1}
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
          if('fps' in anim) anim.time = 1000 * anim.frameCount / anim.fps;
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