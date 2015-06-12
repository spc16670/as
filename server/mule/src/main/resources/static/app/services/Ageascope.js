var AgeascopeService = angular.module('ageascope.services.Ageascope',[]);


AgeascopeService.service('AgeascopeService',['HttpService','AuthService',function(HttpService,AuthService){
  var Service = {};
  
  Service.makeRequest = function(url,data) {
    return { 
      'timestamp' : new Date().getTime(),
      'path' : url,
      'user' : AuthService.getUser(),
      'data' : data
    };
  };

  Service.publishClientInfo = function (data) {
    var request = Service.makeRequest('/client/log',data);
    HttpService.postPromise(request).then(function(response) { 
      if(response.status == 200) {
        AuthService.setServices(response.data.services);
        AuthService.setExtension(response.data.hid);
      } else { 
        // Shut down the app?!
      }
      console.log('CLIENT INFO Response:',response);
    });
  };

  Service.refreshClientInfo = function (data) {
    var request = Service.makeRequest('/client/info',data);
    HttpService.postPromise(request).then(function(response) { 
      if(response.status == 200) {
        AuthService.setServices(response.data.services);
        AuthService.setExtension(response.data.hid);
      } else { 
        // Shut down the app?!
      }
      console.log('CLIENT Refresh Response:',response);
    });
  };

  return Service;
}]);
