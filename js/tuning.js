Parameters = {
  smallOrbEnergyValue: 10,
  flyingEnergyConsumption:function(e) { return e < 10 ? 0.025 : e < 50 ? 0.03 : 0.04; },
  restingEnergyRechargeRate:function(e) { return e < 10 ? 0.03 : e < 50 ? 0.025 : 0.015; },
  flyStrength:function(e) { return 0.2 + e/100; },
  restStateExitLevel: 25,
  maxOvercharge: 110, // Maximum % energy from energy pickups
  waterLevel: 650,

  // Player physics
  windSpeed:0.8,
  fallSpeed:0.1,
  playerMaxSpeed:100,
  playerBounce:3,
  playerLinearDamping:1,
  playerMass:0.1

}