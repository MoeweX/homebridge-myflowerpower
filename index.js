var Service, Characteristic;

module.exports = function(homebridge){
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    // registration of each accessory
    homebridge.registerAccessory(
        "homebridge-myflowerpower",
        "FlowerPower",
        FlowerPower);
}

//****************************************************************************************
// General Functions
//****************************************************************************************

function logValue(value) {
    console.log(value);
}

//****************************************************************************************
// FlowerPower
//****************************************************************************************

function FlowerPower(log, config) {
  this.log = log;

  // parse config
  this.name = config["name"];

  log.info("Initialized FlowerPower" + this.name);
}

FlowerPower.prototype = {

}
