var module = angular.module('ageascope.controllers.Main', []);

module.controller('MainController',['$scope','$modal','AuthService','GuiService'
  ,'HttpService',function($scope,$modal,AuthService,GuiService,HttpService) {

  $scope.user = "";
  $scope.userAvatar = "";
  $spinnerBusy = null;
  $scope.services = [];

  $scope.$watch(function() {return HttpService},function() {
    $scope.spinnerBusy = HttpService.promise;
  },true);

  $scope.$watch(function() {return AuthService},function() {
    $scope.services = AuthService.services;
    $scope.user = AuthService.user;
    $scope.userAvatar = AuthService.avatar;
  },true);

  $scope.toggler = {
    'showHome':true
  };

  $scope.visible = function(view) {
    for (var key in $scope.toggler) {
      if ($scope.toggler.hasOwnProperty(key)) {
        if (key !== view) {
          if ($scope.toggler[key] == true) {
            $scope.toggler[key] = false;
          }
        } else {
          $scope.toggler[key] = true;
        }
      }
    }
  };

  $scope.close = function() {
    GuiService.close();
  };

  $scope.send = function() {
  };

}]);
