var Service, Characteristic;
var request = require('request');
var time = require('time');

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
// FlowerPower
//****************************************************************************************

function FlowerPower(log, config) {
  this.log = log;

  // parse config
  this.name = config["name"];
  this.location = config["location"];
  this.username = config["username"];
  this.password = config["password"];
  this.client_id = config["client_id"];
  this.client_secret = config["client_secret"];

  this.access_token = null; // use getAccessToken instead of accessing directly

  this.getAccessToken(true, function(token){
      this.access_token = token;
  }.bind(this));
  log.info("Initialized FlowerPower " + this.name);

}

FlowerPower.prototype = {

    getServices: function() {

        var informationService = new Service.AccessoryInformation();
        informationService
            .setCharacteristic(Characteristic.Manufacturer, "Parrot")
            .setCharacteristic(Characteristic.Model, "FlowerPower");

        var temperaturService = new Service.TemperatureSensor();
        temperaturService
            .getCharacteristic(Characteristic.CurrentTemperature)
            .on('get', function(callback) {
                this.getSensorData(false, function(value) {
                    if (value != null) {
                        var temperatur = value["air_temperature_celsius"];
                        if (typeof temperatur !== "undefined") {
                            callback(null, temperatur);
                        } else {
                            this.log("No temperatur available.")
                            callback("", null);
                        }
                    } else {
                        this.log("The sensor data was null.")
                        callback("", null);
                    }
                }.bind(this));
            }.bind(this));

        var humidityService = new Service.HumiditySensor();
        humidityService
            .getCharacteristic(Characteristic.CurrentRelativeHumidity)
            .on('get', function(callback) {
                this.getSensorData(false, function(value) {
                    if (value != null) {
                        var humidity = value["vwc_percent"];
                        if (typeof humidity !== "undefined") {
                            callback(null, humidity);
                        } else {
                            this.log("No humidity available.")
                            callback("", null);
                        }
                    } else {
                        this.log("The sensor data was null.")
                        callback("", null);
                    }
                }.bind(this));
            }.bind(this));

        return [informationService, temperaturService, humidityService];
    },

    /*
        Returns an access token related to the configured profile. If no access token was
        returned before or getNew is true, a new access token is requested from the server.
    */
    getAccessToken(getNew, callback) {
        if (this.access_token == null || getNew) {
            this.log("Requesting new token.")
            var parameter = "?grant_type=password&username=" + this.username + "&password=" + this.password + "&client_id=" + this.client_id + "&client_secret=" + this.client_secret;
            request(
                "https://apiflowerpower.parrot.com/user/v1/authenticate" + parameter,
                function(error, response, body) {
                    if (response.statusCode == 200) {
                        callback(JSON.parse(body)["access_token"]);
                    } else {
                        this.log("Error: the server responded with " + request.responseText);
                        callback(null);
                    }
                }.bind(this));
        } else {
            callback(this.access_token);
        }
    },

    /*
        Returns the last sensor data entry that is stored in the cloud.
    */
    getSensorData(newToken, callback) {
        this.getAccessToken(newToken, function(token){
            // Check if the token is not valid anymore
            if (typeof token === "undefined") {
                this.getSensorData(true, callback);
                return;
            }
            var date = new time.Date();
            // Only get items of last 12 hours, the server runs with GMT time
            date.setTimezone("GMT");
            date.setHours(date.getHours() - 12);
            var parameter = "?from_datetime_utc=" + date.toISOString();
            request(
                {
                    url: "https://apiflowerpower.parrot.com/sensor_data/v2/sample/location/" + this.location + parameter,
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                },
                function(error, response, body) {
                    if (response.statusCode == 200) {
                        var json = JSON.parse(body)
                        if (typeof json["samples"] !== "undefined") {
                            // Return only the last item
                            callback(json["samples"][json["samples"].length - 1]);
                        } else {
                            this.log("Error: the server responded with " + body);
                            callback(null);
                        }
                    } else {
                        this.log("Error: the server responded with " + body);
                        callback(null);
                    }
                }.bind(this));
        }.bind(this));
    }
}
