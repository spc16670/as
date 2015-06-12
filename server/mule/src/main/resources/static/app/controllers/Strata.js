var Strata = angular.module('ageascope.controllers.Strata', []);

Strata.controller('StrataController',['$scope','growl','StrataService'
  ,function($scope,growl,StrataService) {

  $scope.client = {}; 
  $scope.results = []; 
  $scope.selectedResult = null;
  //{"clientReference", "webReference", "policyNumber", "surname", "postcode", "dateOfBirth", "clientStatus", "subagentCode", "searchAggregatorData", "clientSource", "policySource", "email", "context"})

  $scope.$watch(function() { return StrataService },function() {
    $scope.results = StrataService.searchResults;
    $scope.selectedResult = StrataService.selectedSearchResult;
  },true);


  $scope.toggler = {
    'showSearch':true
    ,'showDetail':false
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

  $scope.setSelected = function(r) {
    var dob = new Date(r.dateOfBirth);
    r.dateOfBirth = formatDate(dob);
    StrataService.setSelectedSearchResult(r);
  }

  function formatDate(d) {
    var dd = d.getDate();
    if ( dd < 10 ) dd = '0' + dd;
    var mm = d.getMonth()+1;
    if ( mm < 10 ) mm = '0' + mm;
    var yy = d.getFullYear() % 100;
    if ( yy < 10 ) yy = '0' + yy;
    return dd+'/'+mm+'/'+yy;
  }

  $scope.reset = function () {
    $scope.client = {};
  }

  $scope.search = function() {
    StrataService.search($scope.client);
  }

}]);

