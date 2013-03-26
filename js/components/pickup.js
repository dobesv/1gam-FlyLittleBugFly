PickupComponent = pc.components.Component.extend('PickupComponent',
    {
    },
    {
      energyValue: 0,

      init: function()
      {
        this._super('pickup');
        this.energyValue = Parameters.smallOrbEnergyValue;
      }

    });
