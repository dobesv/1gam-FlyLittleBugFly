animConfigs = {
  player:{
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
    },
    shapes:[
      {shape:pc.CollisionShape.POLY, points: [[-19, 25],[-17, 1],[6, -8]]}  ,
      {shape:pc.CollisionShape.POLY, points: [[4, -6],[-13, -29],[23, -19]]}
    ]
  },
  bee:{
    image:'bee_anim.png',
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
    image:'mosquito.png',
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
    image:"orb1.png",
    frameWidth: 42,
    frameHeight: 42,

    anims: {
      float:{frameCount:24, fps:24, framesWide: 6, framesHigh: 5}
    },
    shapes:[
      {shape:pc.CollisionShape.CIRCLE}
    ]
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
function getAnimShapes(k) {
  if(animConfigs.hasOwnProperty(k)) {
    return animConfigs[k].shapes;
  }
  throw new Error("No animation '"+k+"'");
}