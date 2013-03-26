
UILayer = pc.Layer.extend('UILayer', {}, {

  hudImages:{
    energyBarOutline:null,
  },
  buttonImages:{
    failed:null,
    playAgain:null,
    mainMenu:null
  },

  init:function(zIndex) {
    this._super('ui layer', 100);
    this.hudImages.energyBarOutline = getImage('energy_bar');
    this.buttonImages.failed = getImage('button_you_failed');
    this.buttonImages.playAgain = getImage('button_play_again');
    this.buttonImages.mainMenu = getImage('button_main_menu');
  },
  process:function() {

  },
  draw:function() {

  }

});

