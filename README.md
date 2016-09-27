# homebridge-myflowerpower

Plugin to access [My Flower Power API](http://developer.parrot.com/docs/FlowerPower/) and publish data using the [HomeBridge Platform](https://github.com/nfarina/homebridge).

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install homebridge-tinkerforge using: npm install -g homebridge-myflowerpower
3. Update your configuration file. See sample-config.json in this repository for a sample.

# Currently Supported Sensor Information

Below, find a list of currently supported sensors and the options available to configure them. If a parameter is optional, a standard value is given in square brackets.

* Temperatur Sensor
* Humidity Sensor

TODO fill in options

# How to contribute

Add more sensors and improve existing ones. Also solve issues. No maximum line length.

# Notes for implementation

## Possible Characteristics and Services
Description of characteristics (available methods and how to build listener) can be found [here]( https://github.com/KhaosT/HAP-NodeJS/blob/master/lib/Characteristic.js). Characteristics hava a setValue() and a getValue() method.

Overview of all available characteristics and services can be found [here](https://github.com/KhaosT/HAP-NodeJS/blob/master/lib/gen/HomeKitTypes.js).

When adding characteristics:
* getCharacteristic: Searches for characteristic in service and returns it. If non existent but optional -> create one and return it
* setCharacteristic: getCharacteristic + setValue()

## Start in Developer Mode

To start the plugin in developer mode run `homebridge -D -P . -U ~/.homebridge-dev/` while beeing in the root directory. A sample config has to be saved at `~/.homebridge-dev/`.
