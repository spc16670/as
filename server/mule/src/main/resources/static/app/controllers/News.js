var module = angular.module('ageascope.controllers.News', []);

module.controller('NewsController',['$scope','$modal','NewsService',
  function($scope,$modal,NewsService) {

  $scope.$watch(function() {return NewsService},function() {
  },true);

  $scope.open = function(size) {

  }

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

}]);

module.controller('NewsInstanceController',['$scope','$modalInstance',
  function($scope,$modalInstance) {
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  }; 
}]);
