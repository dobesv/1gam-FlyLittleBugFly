animConfigs = {
  player:{
    imagePath:'bug_fly.png',
    frameWidth: 44, // Width of each frame, assuming an even grid of frames
    frameHeight: 54, // Height of each frame, assuming an even grid of frames
    anims:{
      // Starts with the animation mode - 'fly', 'float', 'die', etc..
      // frameCount is the number of frames of animation
      // frameX/frameY specify the starting frame location on the grid (default 0 if not specified)
      // fps: frames per second
      fly:{frameCount:16, fps:24, frameX: 0},
      float:{frameCount:1, fps:1, frameX: 0}
    },
    shapes:[
      {shape:pc.CollisionShape.POLY, points: [[-6, 4],[0, 8],[-12, 17],[-21, 4]]},
      {shape:pc.CollisionShape.POLY, points: [[3, -7],[0, -8],[-1, -14],[0, -19],[22, -12]]},
      {shape:pc.CollisionShape.POLY, points: [[-1, -14],[-12, -26],[-1, -20]]},
      {shape:pc.CollisionShape.POLY, points: [[-1, -14],[0, -8],[-12, -26]]},
      {shape:pc.CollisionShape.POLY, points: [[3, -7],[0, 8],[-6, 4],[0, -8]]},
      {shape:pc.CollisionShape.POLY, points: [[-12, 17],[0, 8],[-18, 26]]}
    ]
  },
  player_tumble:{
    imagePath:'bug_tumble.png',
    frameWidth: 27,
    frameHeight: 28,
    anims:{
      tumble:{offsetX:-3, offsetY:26, frameCount:16, fps:24}
    }
  },
  seed_fall:{
    imagePath:'seed_hit.png',
    frameWidth: 107,
    frameHeight: 87,
    anims:{
      fall:{offsetX:-63, offsetY:0, frameCount:16, frameWidth:4, fps:24, loops:1, holdOnEnd:true}
    }
  },
  bug_splash:{
    imagePath:'bug_splash.png',
    frameWidth: 131,
    frameHeight: 66,
    anims:{
      splash:{frameCount:28, loops: 1, fps:30, holdOnEnd: true}
    }
  },
  bee:{
    imagePath:'bee_anim.png',
    frameWidth:136,
    frameHeight:148,
    anims:{
      fly:{frameCount:14, fps:24}
    },
    shapes: [
      {shape:pc.CollisionShape.POLY, points: [[-50.5, 32.5],[-50.5, -29.5],[-12.5, 5.5]]}  ,
      {shape:pc.CollisionShape.POLY, points: [[-14.5, 5.5],[-12.5, -57.5],[35.5, -35.5]]}  ,
      {shape:pc.CollisionShape.POLY, points: [[16.5, 58.5],[-47.5, 32.5],[11.5, -16.5]]}  ,
      {shape:pc.CollisionShape.POLY, points: [[17.5, 54.5],[13.5, -14.5],[52.5, 15.5]]}
    ]

  },
  mosquito:{
    imagePath:'mosquito.png',
    frameWidth: 215,
    frameHeight: 215,
    anims: {
      fly:{frameCount:14, fps:24, framesWide:4, framesHigh:4}
    },
    shapes:[
      {shape:pc.CollisionShape.POLY, points: [[21, 24.5],[6, -2.5],[63, 27.5]]} ,
      {shape:pc.CollisionShape.POLY, points: [[69, -26.5],[6, -2.5],[41, -53.5],[69, -40.5]]} ,
      {shape:pc.CollisionShape.POLY, points: [[6, -2.5],[-69, 31.5],[41, -53.5]]} ,
      {shape:pc.CollisionShape.POLY, points: [[6, -2.5],[-11, 24.5],[-69, 31.5]]} ,
      {shape:pc.CollisionShape.POLY, points: [[21, 24.5],[-11, 24.5],[6, -2.5]]} ,
      {shape:pc.CollisionShape.POLY, points: [[-11, 24.5],[21, 24.5],[58, 46.5]]}
    ]
  },
  orb1:{
    imagePath:"orb1.png",
    frameWidth: 130,
    frameHeight: 131,
    framesWide: 15,
    framesHigh: 3,
    anims: {
      float:{frameCount:28, fps:24},
      burst:{frameCount:15, fps:30, frameY: 1, frameX: 13, stopAtEnd:true, loops:1}
    },
    shapes:[
      {shape:pc.CollisionShape.CIRCLE, offset:{w:-100,h:-100}}
    ]
  }
};

anims = {};

function loadAnims() {
  for(var k in animConfigs) {
    if(animConfigs.hasOwnProperty(k)) {
      loadImage(animConfigs[k].imagePath);
    }
  }
}
function setupAnims() {
  for(var k in animConfigs) {
    if(animConfigs.hasOwnProperty(k) && !(k in anims)) {
      var config = animConfigs[k];
      config.image = getImage(config.imagePath);
      var ss = anims[k] = new pc.SpriteSheet(config);
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
function getAnimShapes(k) {
  if(animConfigs.hasOwnProperty(k)) {
    return animConfigs[k].shapes;
  }
  throw new Error("No animation '"+k+"'");
}