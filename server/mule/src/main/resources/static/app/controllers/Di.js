var di = angular.module('ageascope.controllers.Di', []);

di.controller('DiController',['$scope','HttpService','AgeascopeService'
  ,'SystemService',function($scope,HttpService,AgeascopeService,SystemService) {

  $scope.username =  SystemService.getUsername();
  $scope.msg = "Click button to invoke the service...";
  $scope.disabled = false;

  $scope.runBatch = function() {
    if($scope.diBatchForm.$invalid) { return; };
    var request = AgeascopeService.makeRequest('/di/batch',{});
    HttpService.postPromise(request).then(function(response) { 
      $scope.disabled = false;
      console.log('Response:',response);
      if(response.data.errorMessage === "") {
         $scope.msg = "Service invoked successfully - RID: " 
           + response.data.rid + " PID: " 
           + response.data.pid + " CID: " 
           + response.data.cid;
      } else {
         $scope.msg = "There was an error: " + response.data.errorMessage;
      }
    },function(response){
      console.log('Response:',response);
       $scope.disabled = false;
       if(response.data.errorMessage === "") {
      } else {
         $scope.msg = "There was an error: " + response.data.errorMessage;
      }
    
    });
    $scope.disabled = true;
  };

}]);

