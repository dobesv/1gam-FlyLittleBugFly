
UILayer = pc.Layer.extend('UILayer', {}, {

  hudImages:{
    energyBarOutline:null,
  },
  buttonImages:{
    failed:null,
    playAgain:null,
    mainMenu:null
  },
  showFailure:false,
  failureMenuPos:0,
  energyLevel:1,

  levelCompleteImage:null,
  levelCompletePos:0,
  showLevelComplete:false,

  init:function(zIndex) {
    this._super('ui layer', 100);
    this.hudImages.energyBarOutline = getImage('energy_bar');
    this.buttonImages.failed = getImage('button_you_failed');
    this.buttonImages.playAgain = getImage('button_play_again');
    this.buttonImages.mainMenu = getImage('button_main_menu');
    this.levelCompleteImage = getImage('end_screen');
    pc.device.input.bindAction(this, 'click', 'MOUSE_BUTTON_LEFT_DOWN');
    pc.device.input.bindAction(this, 'click', 'TOUCH');
  },
  onAction:function(actionName, event, pos) {
    console.log('action!')
    if(actionName == 'click') {
      var x = pos.x;
      var y = pos.y;
      if(this.showFailure) {
        if(this.hitButton(this.buttonImages.playAgain, x, y)) {
          pc.device.game.onAction('restart');
        }
      }
    }
  },
  hitButton:function(but, x, y) {
    console.log('Check hit '+x+','+y+' against '+but.x+','+but.y+' '+but.width+'x'+but.height);
    var dx = x - but.x;
    if(dx < 0 || dx > but.width)
      return false;
    var dy = y - but.y;
    if(dy <0 || dy > but.height)
      return false;
    return true;
  },
  process:function() {
    var player = pc.device.game.getPlayer();
    var playerControl = player.getComponent('player');
    if(playerControl.dead) {
      // Show "you're dead!"
      if(!this.showFailure) {
        this.showFailure = true;
        this.failureMenuPos = pc.device.canvasHeight*2;
      }
      this.energyLevel = 0;
    } else {
      this.showFailure = false;
      this.energyLevel = Math.max(0, Math.min(1, playerControl.energy/100));
    }
    if(pc.device.game.gameScene.levelComplete) {
      if(!this.showLevelComplete) {
        this.showLevelComplete = true;
        this.levelCompletePos = pc.device.canvasHeight;
      }
      this.energyLevel = 100;
    } else {
      this.showLevelComplete = false;
    }


    if(this.showLevelComplete) {
      if(this.levelCompletePos > 0) {
        this.levelCompletePos = Math.max(0, this.levelCompletePos - pc.device.elapsed);
      }
    } else if(this.showFailure) {
      if(this.failureMenuPos > 0) {
        this.failureMenuPos = Math.max(0, this.failureMenuPos - pc.device.elapsed);
      }
    }

  },
  wobble:function(image,x) {
    var wobbleAngle = (Date.now() + x)*0.005;
    var wobbleX = 1+0.01*Math.sin(wobbleAngle);
    var wobbleY = 1+0.01*Math.sin(wobbleAngle + Math.PI);
    image.setScale(wobbleX, wobbleY);
  },
  draw:function() {
    if(this.showLevelComplete) {
      var levelCompleteX = pc.device.canvasWidth/2 - this.levelCompleteImage.width/2;
      var levelCompleteY = pc.device.canvasHeight/2 - this.levelCompleteImage.height/2;
      this.levelCompleteImage.draw(pc.device.ctx, levelCompleteX, levelCompleteY + this.levelCompletePos);
      var orbs = pc.device.game.gameScene.player.getComponent('player').orbsCollected;
      var orbsX = 190;
      var orbsY = 580;
      pc.device.ctx.textAlign='right';
      pc.device.ctx.font = 'bold 68px Calibri';
      pc.device.ctx.fillStyle = '#C4401B';
      pc.device.ctx.fillText(''+orbs, orbsX + 2, orbsY + this.levelCompletePos + 2);
      pc.device.ctx.font = '62px Calibri';
      pc.device.ctx.fillStyle = '#FFCE38';
      pc.device.ctx.fillText(''+orbs, orbsX, orbsY + this.levelCompletePos);
    } else if(this.showFailure) {
      var failedY = pc.device.canvasHeight/2 - this.buttonImages.failed.height/2;
      var failedX = pc.device.canvasWidth/2 - this.buttonImages.failed.width;
      this.wobble(this.buttonImages.failed, failedX);
      this.buttonImages.failed.draw(pc.device.ctx, failedX, failedY + this.failureMenuPos);

      var tryAgainY = this.buttonImages.playAgain.y = pc.device.canvasHeight/2;
      var tryAgainX = this.buttonImages.playAgain.x = failedX + this.buttonImages.failed.width;
      this.wobble(this.buttonImages.playAgain, tryAgainX);
      this.buttonImages.playAgain.draw(pc.device.ctx, tryAgainX, tryAgainY + this.failureMenuPos);
    } else {
      var frameX = 10;
      var frameY = 10;
      var ebX = 12;
      var ebY = 10;
      var e = this.energyLevel;
      var ebW = 266 * e;
      var ebH = 25;
      pc.device.ctx.fillStyle = e > 0.5 ? '#00FF00' : e > 0.2 ? '#FFFF00' : "#FF0000";
      pc.device.ctx.fillRect(ebX + frameX,ebY + frameY,ebW,ebH);
      this.hudImages.energyBarOutline.draw(pc.device.ctx, frameX, frameY);
    }

  }

});

