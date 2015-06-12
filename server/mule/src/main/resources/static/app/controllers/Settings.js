var Settings = angular.module('ageascope.controllers.Settings', []);

Settings.controller('SettingsController',['$scope','growl','HttpService','AuthService','AgeascopeService'
  ,function($scope,growl,HttpService,AuthService,AgeascopeService) {

  $scope.user = {
    windows_username : ""
    ,avatar : ""
    ,extension : null
  };

  $scope.$watch(function() {return AuthService},function() {
    $scope.user.windows_username = AuthService.user;
    $scope.user.extension = AuthService.extension; 
  },true);

  $scope.$watch(function() {return AuthService},function() {
    $scope.user.avatar = AuthService.avatar;
    if ($scope.user.avatar.includes("default")) {
      growl.info("Please let helpdesk know if your picture is not showing.");
    }
  },true);

  $scope.checkExtension = function(data) {
    if (isNaN(data)) {
      return "Extension should be a 4 or 5 digit number."
    }
    if (data.length < 4 || data.length > 5) {
      return "Extension should be a 4 or 5 digit number." 
    }
  }

  $scope.cancel = function() {
  }

  $scope.saveSettings = function() {
    var request = AgeascopeService.makeRequest('/user/extension',{ 
      'windows_username' : $scope.user.windows_username
      ,'extension' : $scope.user.extension
    });
    HttpService.postPromise(request).then(function(response) { 
      if(response.status == 200) {
        AgeascopeService.refreshClientInfo({});
      } else {
        growl.error('There has been an error while saving settings...');
        $scope.user.extension = null;
      }
    },function(error) {
      $scope.user.extension = null;
      growl.error('There has been an error while saving settings...');
    });
  }

}]);

