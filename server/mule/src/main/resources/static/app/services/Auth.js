
var Auth = angular.module('ageascope.services.Auth',[]);

Auth.service('AuthService',['HttpService',function(HttpService){
  var Service = {
    user : ""
    ,avatar : "/ageascope/static/img/avatars/default.png"
    ,services : []
    ,extension : null
  };

  Service.setExtension = function (e) {
    Service.extension = parseInt(e);
  };
  
  Service.setUser = function (u) {
    Service.user = u;
    // try getting base64 avatar image
    var promise = HttpService.getPromise('/static/img/avatars/'+ u +'.png');
    promise.then(function(response) { 
      if(response.status == 200 && response.data != "") {
        Service.avatar = "/ageascope/static/img/avatars/"+ u +".png";
      } else { 
        Service.avatar = "/ageascope/static/img/avatars/default.png";
      }
    })
    .catch(function(error){
        console.log('AVATAR ERROR: ',error);
    }); 
  };

  Service.getExtension = function () {
    return Service.extension;
  };

  Service.getUser = function () {
    return Service.user;
  };

  Service.setServices = function(data) {
    Service.services = data
  };
  Service.getServices = function(data) {
    return Service.servives;
  };

  return Service;
}]);
