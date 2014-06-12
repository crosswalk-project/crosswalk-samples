/*
Copyright (c) 2014 Intel Corporation. All rights reserved.
Use of this source code is governed by a MIT-style license that can be
found in the LICENSE file. 
*/
document.addEventListener('DOMContentLoaded', function () {
    var output = document.getElementById("output");
    
    function handle(button, callback) {
      var b = document.getElementById(button);
      b.addEventListener("click", callback);
    }
    
    function onErrorCallback(error) {
      output.value += '\n An error occurred: ' + error.message + '\n';
      output.scrollTop = output.scrollHeight;
    }
    
    handle("capability_btn", function() {
      try { 
        var cap = tizen.systeminfo.getCapabilities();
        output.value += '\n getCapabilities() returned.';
        for (property in cap) {
          output.value += '\n\t' + property + ': ' + cap[property];
        }
      }
      catch (err) {
        output.value += '\n getCapabilities() get exception:' + err.name;
      }
    
      output.scrollTop = output.scrollHeight;
    });
    
    handle("battery_btn", function() {
      var count = 0;
      var id = tizen.systeminfo.addPropertyValueChangeListener(
                   "BATTERY",
                   function(battery) {
                     output.value += '\n Property BATTERY changed.';
                     output.value += '\n\t level : ' + battery.level;
                     output.value += '\n\t isCharging : ' + battery.isCharging;
                     output.scrollTop = output.scrollHeight;
                     count += 1;
                     if (count == 3) {
                       output.value += '\n Maximum listen times(3) reached. Remove listener with id = ' + id;
                       output.scrollTop = output.scrollHeight;
                       count = 0;
                       tizen.systeminfo.removePropertyValueChangeListener(id);
                     }
                  });
    
      tizen.systeminfo.getPropertyValue(
        "BATTERY",
        function(battery) {
          output.value += '\n Get property BATTERY returned.';
          output.value += '\n\t level : ' + battery.level;
          output.value += '\n\t isCharging : ' + battery.isCharging;
          output.scrollTop = output.scrollHeight;
        },
        onErrorCallback);
    });
    
    handle("cpu_btn", function() {
      var count = 0;
      var id = tizen.systeminfo.addPropertyValueChangeListener(
                   "CPU",
                   function(cpu) {
                     output.value += '\n Property CPU changed with no option.';
                     output.value += '\n\t load : ' + parseFloat(cpu.load) * 100 + '%';
                     output.scrollTop = output.scrollHeight;
                     count += 1;
                     if (count == 3) {
                       output.value += '\n Maximum listen times(3) reached. Remove listener with id = ' + id;
                       output.scrollTop = output.scrollHeight;
                       count = 0;
                       tizen.systeminfo.removePropertyValueChangeListener(id);
                     }
                  });
      var id1 = tizen.systeminfo.addPropertyValueChangeListener(
                   "CPU",
                   function(cpu) {
                     output.value += '\n Property CPU changed with highThreshold 0.2.';
                     output.value += '\n\t load : ' + parseFloat(cpu.load) * 100 + '%';
                     output.scrollTop = output.scrollHeight;
                     output.scrollTop = output.scrollHeight;
                     },
                   {'highThreshold':0.2});
    
      var id2 = tizen.systeminfo.addPropertyValueChangeListener(
                   "CPU",
                   function(cpu) {
                     output.value += '\n Property CPU changed with lowThreshold 1.0.';
                     output.value += '\n\t load : ' + parseFloat(cpu.load) * 100 + '%';
                     output.scrollTop = output.scrollHeight;
                     output.scrollTop = output.scrollHeight;
                     },
                   {'lowThreshold':1.0});
    
      var id3 = tizen.systeminfo.addPropertyValueChangeListener(
                   "CPU",
                   function(cpu) {
                     output.value += '\n Property CPU changed with highThreshold 1.00, lowThreshold 1.10.';
                     output.value += '\n\t load : ' + parseFloat(cpu.load) * 100 + '%';
                     output.scrollTop = output.scrollHeight;
                     output.scrollTop = output.scrollHeight;
                     },
                   {'highThreshold':1.00, 'lowThreshold':1.10});
    
      var id4 = tizen.systeminfo.addPropertyValueChangeListener(
                   "CPU",
                   function(cpu) {
                     output.value += '\n Property CPU changed with timeout:6 seconds';
                     output.value += '\n\t load : ' + parseFloat(cpu.load) * 100 + '%';
                     output.scrollTop = output.scrollHeight;
                     output.scrollTop = output.scrollHeight;
                     },
                   {'timeout':6000});
    
      tizen.systeminfo.getPropertyValue(
        "CPU",
        function(cpu) {
          output.value += '\n Get property CPU returned.';
          output.value += '\n\t load : ' + parseFloat(cpu.load) * 100 + '%';
          output.scrollTop = output.scrollHeight;
        },
        onErrorCallback);
    });
    
    handle("storage_btn", function() {
      var count = 0;
      var id = tizen.systeminfo.addPropertyValueChangeListener(
                   "STORAGE",
                   function(storage) {
                     output.value += '\n Get property STORAGE returned.';
                     output.value += '\n\t There are ' + storage.units.length + ' storage units.\n';
                     for (i=0; i< storage.units.length; i++) {
                       output.value += '\n\t storage[' + i + ']:';
                       output.value += '\n\t\t type: ' + storage.units[i].type;
                       output.value += '\n\t\t capacity: ' + storage.units[i].capacity + ' bytes';
                       output.value += '\n\t\t availableCapacity: ' + storage.units[i].availableCapacity + ' bytes';
                       output.value += '\n\t\t isRemovable: ' + storage.units[i].isRemovable;
                       output.value += '\n\t\t isRemoveable: ' + storage.units[i].isRemoveable + '\n';
                       output.scrollTop = output.scrollHeight;
                     }
                     count += 1;
                     if (count == 3) {
                       output.value += '\n Maximum listen times(3) reached. Remove listener with id = ' + id;
                       output.scrollTop = output.scrollHeight;
                       count = 0;
                       tizen.systeminfo.removePropertyValueChangeListener(id);
                     }
                  });
      tizen.systeminfo.getPropertyValue(
        "STORAGE",
        function(storage) {
          output.value += '\n Get property STORAGE returned.';
          output.value += '\n\t There are ' + storage.units.length + ' storage units.\n';
          for (i=0; i< storage.units.length; i++) {
            output.value += '\n\t storage[' + i + ']:';
            output.value += '\n\t\t type: ' + storage.units[i].type;
            output.value += '\n\t\t capacity: ' + storage.units[i].capacity + ' bytes';
            output.value += '\n\t\t availableCapacity: ' + storage.units[i].availableCapacity + ' bytes';
            output.value += '\n\t\t isRemovable: ' + storage.units[i].isRemovable;
            output.value += '\n\t\t isRemoveable: ' + storage.units[i].isRemoveable + '\n';
            output.scrollTop = output.scrollHeight;
          }
        },
        onErrorCallback);
    });
    
    handle("display_btn", function() {
      var count = 0;
      var id = tizen.systeminfo.addPropertyValueChangeListener(
                   "DISPLAY",
                   function(display) {
                     output.value += '\n Property DISPLAY changed.';
                     output.value += '\n\t resolutionWidth: ' + display.resolutionWidth;
                     output.value += '\n\t resolutionHeight: ' + display.resolutionHeight;
                     output.value += '\n\t dotsPerInchWidth: ' + display.dotsPerInchWidth;
                     output.value += '\n\t dotsPerInchHeight: ' + display.dotsPerInchHeight;
                     output.value += '\n\t physicalWidth: ' + display.physicalWidth;
                     output.value += '\n\t physicalHeight: ' + display.physicalHeight;
                     output.value += '\n\t brightness: ' + display.brightness;
                     output.scrollTop = output.scrollHeight;
                     count += 1;
                     if (count == 3) {
                       output.value += '\n Maximum listen times(3) reached. Remove listener with id = ' + id;
                       output.scrollTop = output.scrollHeight;
                       count = 0;
                       tizen.systeminfo.removePropertyValueChangeListener(id);
                     }
                  });
    
      tizen.systeminfo.getPropertyValue(
        "DISPLAY",
        function(display) {
          output.value += '\n Get property DISPLAY returned.';
          output.value += '\n\t resolutionWidth: ' + display.resolutionWidth;
          output.value += '\n\t resolutionHeight: ' + display.resolutionHeight;
          output.value += '\n\t dotsPerInchWidth: ' + display.dotsPerInchWidth;
          output.value += '\n\t dotsPerInchHeight: ' + display.dotsPerInchHeight;
          output.value += '\n\t physicalWidth: ' + display.physicalWidth;
          output.value += '\n\t physicalHeight: ' + display.physicalHeight;
          output.value += '\n\t brightness: ' + display.brightness;
          output.scrollTop = output.scrollHeight;
        },
        onErrorCallback);
    });
    
    handle("device_orientation_btn", function() {
      var id = tizen.systeminfo.addPropertyValueChangeListener(
                   "DEVICE_ORIENTATION",
                   function(orientation) {
                     output.value += '\n Property DEVICE_ORIENTATION changed.';
                     output.value += '\n\t status: ' + orientation.status;
                     output.value += '\n\t isAutoRotation: ' + orientation.isAutoRotation;
                     output.scrollTop = output.scrollHeight;
                  });
      tizen.systeminfo.getPropertyValue(
        "DEVICE_ORIENTATION",
        function(orientation) {
          output.value += '\n Get property DEVICE_ORIENTATION returned.';
          output.value += '\n\t status: ' + orientation.status;
          output.value += '\n\t isAutoRotation: ' + orientation.isAutoRotation;
        },
        onErrorCallback);
    });
    
    handle("build_btn", function() {
      var count = 0;
      var id = tizen.systeminfo.addPropertyValueChangeListener(
                   "BUILD",
                   function(build) {
                     output.value += '\n Property BUILD changed.';
                     output.value += '\n\t model: ' + build.model;
                     output.value += '\n\t manufacturer: ' + build.manufacturer;
                     output.value += '\n\t buildVersion: ' + build.buildVersion;
                     count += 1;
                     if (count == 3) {
                       output.value += '\n Maximum listen times(3) reached. Remove listener with id = ' + id;
                       output.scrollTop = output.scrollHeight;
                       count = 0;
                       tizen.systeminfo.removePropertyValueChangeListener(id);
                     }
                  });
    
      tizen.systeminfo.getPropertyValue(
        "BUILD",
        function(build) {
          output.value += '\n Get property BUILD returned.';
          output.value += '\n\t model: ' + build.model;
          output.value += '\n\t manufacturer: ' + build.manufacturer;
          output.value += '\n\t buildVersion: ' + build.buildVersion;
          output.scrollTop = output.scrollHeight;
        },
        onErrorCallback);
    });
    
    handle("locale_btn", function() {
      var count = 0;
      var id = tizen.systeminfo.addPropertyValueChangeListener(
                   "LOCALE",
                   function(locale) {
                     output.value += '\n Property Locale changed.';
                     output.value += '\n\t language: ' + locale.language;
                     output.value += '\n\t country: ' + locale.country;
                     count += 1;
                     if (count == 3) {
                       output.value += '\n Maximum listen times(3) reached. Remove listener with id = ' + id;
                       output.scrollTop = output.scrollHeight;
                       count = 0;
                       tizen.systeminfo.removePropertyValueChangeListener(id);
                     }
                  });
    
      tizen.systeminfo.getPropertyValue(
        "LOCALE",
        function(locale) {
          output.value += '\n Get property LOCALE returned.';
          output.value += '\n\t language: ' + locale.language;
          output.value += '\n\t country: ' + locale.country;
          output.scrollTop = output.scrollHeight;
        },
        onErrorCallback);
    });
    
    handle("network_btn", function() {
      var count = 0;
      var id = tizen.systeminfo.addPropertyValueChangeListener(
                   "NETWORK",
                   function(network) {
                     output.value += '\n Property NETWORK changed.';
                     output.value += '\n\t networkType: ' + network.networkType;
                     output.scrollTop = output.scrollHeight;
                     count += 1;
                     if (count == 3) {
                       output.value += '\n Maximum listen times(3) reached. Remove listener with id = ' + id;
                       output.scrollTop = output.scrollHeight;
                       count = 0;
                       tizen.systeminfo.removePropertyValueChangeListener(id);
                     }
                  });
    
      tizen.systeminfo.getPropertyValue(
        "NETWORK",
        function(network) {
          output.value += '\n Get property NETWORK returned.';
          output.value += '\n\t networkType: ' + network.networkType;
          output.scrollTop = output.scrollHeight;
        },
        onErrorCallback);
    });
    
    handle("wifi_network_btn", function() {
      var count = 0;
      var id = tizen.systeminfo.addPropertyValueChangeListener(
                   "WIFI_NETWORK",
                   function(wifi) {
                     output.value += '\n Property WIFI_NETWORK changed.';
                     output.value += '\n\t status: ' + wifi.status;
                     output.value += '\n\t ssid: ' + wifi.ssid;
                     output.value += '\n\t ipAddress: ' + wifi.ipAddress;
                     output.value += '\n\t ipv6Address: ' + wifi.ipv6Address;
                     output.value += '\n\t signalStrength: ' + wifi.signalStrength;
                     output.scrollTop = output.scrollHeight;
                     count += 1;
                     if (count == 3) {
                       output.value += '\n Maximum listen times(3) reached. Remove listener with id = ' + id;
                       output.scrollTop = output.scrollHeight;
                       count = 0;
                       tizen.systeminfo.removePropertyValueChangeListener(id);
                     }
                  });
      tizen.systeminfo.getPropertyValue(
        "WIFI_NETWORK",
        function(wifi) {
          output.value += '\n Get property WIFI_NETWORK returned.';
          output.value += '\n\t status: ' + wifi.status;
          output.value += '\n\t ssid: ' + wifi.ssid;
          output.value += '\n\t ipAddress: ' + wifi.ipAddress;
          output.value += '\n\t ipv6Address: ' + wifi.ipv6Address;
          output.value += '\n\t signalStrength: ' + wifi.signalStrength;
          output.scrollTop = output.scrollHeight;
        },
        onErrorCallback);
    });
    
    handle("cellular_network_btn", function() {
      var id = tizen.systeminfo.addPropertyValueChangeListener(
                   "CELLULAR_NETWORK",
                   function(cellular) {
                     output.value += '\n Property CELLULAR_NETWORK changed.';
                     output.value += '\n\t status: ' + cellular.status;
                     output.value += '\n\t apn: ' + cellular.apn;
                     output.value += '\n\t ipAddress: ' + cellular.ipAddress;
                     output.value += '\n\t ipv6Address: ' + cellular.ipv6Address;
                     output.value += '\n\t mcc: ' + cellular.mcc;
                     output.value += '\n\t mnc: ' + cellular.mnc;
                     output.value += '\n\t cellId: ' + cellular.cellId;
                     output.value += '\n\t lac: ' + cellular.lac;
                     output.value += '\n\t isRoaming: ' + cellular.isRoaming;
                     output.value += '\n\t isFlightMode: ' + cellular.isFlightMode;
                     output.value += '\n\t imei: ' + cellular.imei;
                     output.scrollTop = output.scrollHeight;
                  });
    
      tizen.systeminfo.getPropertyValue(
        "CELLULAR_NETWORK",
        function(cellular) {
          output.value += '\n Get property CELLULAR_NETWORK returned.';
          output.value += '\n\t status: ' + cellular.status;
          output.value += '\n\t apn: ' + cellular.apn;
          output.value += '\n\t ipAddress: ' + cellular.ipAddress;
          output.value += '\n\t ipv6Address: ' + cellular.ipv6Address;
          output.value += '\n\t mcc: ' + cellular.mcc;
          output.value += '\n\t mnc: ' + cellular.mnc;
          output.value += '\n\t cellId: ' + cellular.cellId;
          output.value += '\n\t lac: ' + cellular.lac;
          output.value += '\n\t isRoaming: ' + cellular.isRoaming;
          output.value += '\n\t isFlightMode: ' + cellular.isFlightMode;
          output.value += '\n\t imei: ' + cellular.imei;
          output.scrollTop = output.scrollHeight;
        },
        onErrorCallback);
    });
    
    handle("sim_btn", function() {
      var id = tizen.systeminfo.addPropertyValueChangeListener(
                   "SIM",
                   function(sim) {
                     output.value += '\n Property SIM changed.';
                     output.value += '\n\t state: ' + sim.state;
                     output.value += '\n\t operatorName: ' + sim.operatorName;
                     output.value += '\n\t msisdn: ' + sim.msisdn;
                     output.value += '\n\t iccid: ' + sim.iccid;
                     output.value += '\n\t mcc: ' + sim.mcc;
                     output.value += '\n\t mnc: ' + sim.mnc;
                     output.value += '\n\t msin: ' + sim.msin;
                     output.value += '\n\t spn: ' + sim.spn;
                     output.scrollTop = output.scrollHeight;
                  });
    
      tizen.systeminfo.getPropertyValue(
        "SIM",
        function(sim) {
          output.value += '\n Get property SIM returned.';
          output.value += '\n\t state: ' + sim.state;
          output.value += '\n\t operatorName: ' + sim.operatorName;
          output.value += '\n\t msisdn: ' + sim.msisdn;
          output.value += '\n\t iccid: ' + sim.iccid;
          output.value += '\n\t mcc: ' + sim.mcc;
          output.value += '\n\t mnc: ' + sim.mnc;
          output.value += '\n\t msin: ' + sim.msin;
          output.value += '\n\t spn: ' + sim.spn;
          output.scrollTop = output.scrollHeight;
        },
        onErrorCallback);
    });
    
    handle("peripheral_btn", function() {
      tizen.systeminfo.getPropertyValue(
        "PERIPHERAL",
        function(peripheral) {
          output.value += '\n Get property PERIPHERAL returned.';
          output.value += '\n\t isVideoOutputOn: ' + peripheral.isVideoOutputOn;
          output.scrollTop = output.scrollHeight;
        },
        onErrorCallback);
    });
});
