
/**
 * The postal object is received from the ageascope.js
 * The modules exports methods that either return immidiately
 * or post async results to the main ageascope.node.in queue
 * created in the ageascope.js.
 */
var System = angular.module('ageascope.services.System',[]);

System.run(['$rootScope','SystemService','AuthService',function($rootScope,SystemService,AuthService) {
  AuthService.setUser(SystemService.getUsername());
  require('getmac').getMac(function(err,macAddress) {
    if (err) {
    } else {
      SystemService.setMac(macAddress);
    }
    SystemService.publishClientInfo();
  }); 
}]);

System.service('SystemService',['$rootScope','AgeascopeService',function($rootScope,AgeascopeService){

  var Service = {
    port : null
    ,mac :null
  };

  Service.getUsername = function () {
    return process.env.USERNAME.toLowerCase();
  },

  Service.setPort = function (p) {
    Service.port = p;
  };

  Service.setMac = function (m) {
    Service.mac = m;
  };


  Service.getSystemInfo = function () {
    var os = require('os');
    var interfaces = os.networkInterfaces();
    var hostname = os.hostname();
    var release = os.release();
    var username = process.env.USERNAME.toLowerCase();
    var ipAddress = '';
    for (k in interfaces) {
      for (k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (k == 'Local Area Connection' && address.family == 'IPv4' && !address.internal) {
          ipAddress = address.address;
        }		
      }
    }
    var response = {
      user: username,
      release: release,
      hostname: hostname,
      port: Service.port,
      mac: Service.mac,
      timestamp: new Date().getTime(),
      ip: ipAddress
    };
    return response;
  };

  Service.publishClientInfo = function() {
    AgeascopeService.publishClientInfo(Service.getSystemInfo());
  };

  return Service;

}]);
