
var Strata = angular.module('ageascope.services.Strata',[]);

Strata.run([function() {
}]);

Strata.service('StrataService',['HttpService','growl','AgeascopeService'
  ,function(HttpService,growl,AgeascopeService){
  
  var Service = { 
    searchResults : [] 
    ,selectedSearchResult : null
  };

  Service.setSelectedSearchResult = function(result) {
    Service.selectedSearchResult = result;
  }

  Service.search = function(client) {
    var req = {};
    for (var key in client) {
      if (client.hasOwnProperty(key)) {
        if (client[key] !== "" && client[key] != null) {
          req[key] = client[key];
        }
      }
    } 
    var request = AgeascopeService.makeRequest('/strata/search',req);
    HttpService.postPromise(request).then(function(response) { 
      if(response.status == 200) {
        if (response.data.length != 0) {
          Service.searchResults = response.data;
        } else {
          growl.info("No results");
        }
      } else if (response.status == 204) {
        growl.info("No results");
      } else {
        growl.error("There has been a error: " + response.status);
      }
      console.log('Strata Response:',response);
    }),function(error){
      growl.error(error.data.errorMessage);  
    };
  }


  return Service;

}]);


