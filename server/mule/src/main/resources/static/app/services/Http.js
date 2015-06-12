
var Http = angular.module('ageascope.services.Http',[]);

Http.run([function() {
}]);

Http.service('HttpService',['$http','$q','ConfigService','growl',function($http,$q,ConfigService,growl){
  
  var Service = { promise : null };

  Service.nodePost = function(options,data) { 
    var http = require('http');
    var deferred = $q.defer();

    setTimeout(function () {
      deferred.reject({code : "TIMEOUT", message: "Peer request timed out!"}); 
    }, (ConfigService.http.TIMEOUT));


    var req = http.request(options, function (response) {
      var body = "";
      response.on('data',function(d) {
        body += d;
      });
      response.on('end',function() {
        response.data = body; 
        deferred.resolve(response);
      })
    });

    req.on('error', function(e) {
      deferred.reject(e);
    });

    if (options.method === 'POST' || options.method === 'post') {
      req.write(JSON.stringify(data));
    }
    req.end();

    Service.promise = deferred.promise;
    return deferred.promise;
  }


  Service.call = function (req) {
    var timeout = $q.defer(),
        result = $q.defer(),
        timedOut = false,
        httpRequest;

    setTimeout(function () {
      timedOut = true;
      timeout.resolve();
    }, (ConfigService.http.TIMEOUT));

    req.timeout = timeout.promise
    httpRequest = $http(req);

    httpRequest.success(function(data, status, headers, config) {
      var response = { data: data, status: status, headers: headers, config: config}
      result.resolve(response);
    });

    httpRequest.error(function(data, status, headers, config) {
      var response = { data: data, status: status, headers: headers, config: config}
      if (timedOut) {
        var errorMsg = 'Request took longer than ' + ConfigService.http.TIMEOUT/1000 + ' seconds.';
        if (data == null ) {
          var data = { error:"timeout", errorMessage: errorMsg }; 
        } else {
          data.error = "timeout";
          data.errorMessage = errorMsg;
        }
        response.data = data;
        result.reject(response);
        growl.error('A server timeout has been detected.');
      } else {
        result.reject(response);
      }
    });
    Service.promise = result.promise;
    return result.promise; 
  };

  Service.postPromise = function (data) {
    var req = {
      method: "post"
      ,url: "/ageascope" + data.path
      ,cache: false
      ,data: data.data
    }
    return Service.call(req);
  }

  Service.getPromise = function(path) {
    var req = {
      method: "get"
      ,url: "/ageascope" + path
      ,cache: false
    }
    return Service.call(req);
  };

  return Service;

}]);


