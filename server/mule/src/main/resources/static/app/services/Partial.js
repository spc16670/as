
var Partial = angular.module('ageascope.services.Partial',[]);

Partial.run([function() {
}]);

Partial.service('PartialService',['HttpService',function(HttpService){
  
  var Service = {
    partialsPath : '/static/app/partials/'
    ,partial : ""
    ,promise : null
  };   

  Service.fetch = function(name) {
    var fetchReq = { 'type': name, 'action' : "fetch" };
    var promise = HttpService.getPromise(Service.partialsPath + name + '.tpl');
    Service.promise = promise;
    promise.then(function(response) {
      if (response.status == 200) {
        Service.partial = response.data;
      } else {
        Service.partial = "Content could not be rendered";
      }
    });
  };

  return Service;

}]);
