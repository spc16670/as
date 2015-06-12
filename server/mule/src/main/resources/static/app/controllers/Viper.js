var module = angular.module('ageascope.controllers.Viper', []);

module.controller('ViperController',['$scope','growl','HttpService','AgeascopeService'
  ,'SystemService',function($scope,growl,HttpService,AgeascopeService,SystemService) {

  $scope.username =  SystemService.getUsername();
  $scope.emailMsg = "Please enter email address";
  $scope.regMsg = "Please enter vehicle registration";

  //================================ EMAIL ====================================
  //EMAIL ADD
  $scope.addEmail = function(viper) {
    console.log('viperAdd',viper);
    $scope.$broadcast('show-errors-check-validity');
    if($scope.viperEmailForm.$invalid) { return undefined }; 
    var request = AgeascopeService.makeRequest('/viper/email',{ 
      'email' : viper.email
      ,'action' : 'add'
    });
    HttpService.postPromise(request).then(function(response) { 
      if(response.status == 200) {
        if (response.data.msg === "exists") {
          $scope.emailMsg = "Email address already exists.";
        } else if ( response.data.msg === "ok" ) {
          $scope.emailMsg = "Email address has been blocked";
          growl.success($scope.emailMsg);
          $scope.viper.email = "";
        } else if ( response.data.msg === "error" ) {
          $scope.emailMsg = "There was an error"; 
          $scope.viper.email = "";
        }; 
      } else {
        $scope.emailMsg = "There was an error"; 
      }
      console.log('EMAIL Response:',response);
    });
  }

  //EMAIL REMOVE
  $scope.removeEmail = function(viper) {
    console.log('viperRemove',viper);
    $scope.$broadcast('show-errors-check-validity');
    if($scope.viperEmailForm.$invalid) { return undefined }; 
    var request = AgeascopeService.makeRequest('/viper/email',{ 
      'email' : viper.email
      ,'action' : 'remove'
    });
    HttpService.postPromise(request).then(function(response) { 
      if(response.status == 200) {
        if (response.data.msg === "notexists") {
          $scope.emailMsg = "Email address is not blocked.";
        } else if ( response.data.msg === "ok" ) {
          $scope.emailMsg = "Email address has been unblocked.";
          $scope.viper.email = "";
        } else if ( response.data.msg === "error" ) {
          $scope.emailMsg = "There was an error"; 
          $scope.viper.email = "";
        }; 
      } else {
        $scope.emailMsg = "There was an error"; 
      }
      console.log('EMAIL Response:',response);
    });
  }

  //EMAIL SEARCH
  $scope.searchEmail = function(viper) {
    console.log('viperSearch',viper);
    $scope.$broadcast('show-errors-check-validity');
    if($scope.viperEmailForm.$invalid) { return undefined }; 
    var request = AgeascopeService.makeRequest('/viper/email',{ 
      'email' : viper.email
      ,'action' : 'search'
    });
    HttpService.postPromise(request).then(function(response) { 
      if(response.status == 200) {
        $scope.emailMsg = "Thank you";
        var results = response.data.results;
        if (results == undefined || results[0] == undefined) {
          $scope.emailMsg = "Email not found"; 
        } else {
          var emails = "";
          for (var i=0;i<results.length;i++) {
            emails += " " + results[i].EMAIL;
          } 
          $scope.emailMsg = "Found: " + emails;
        }
      } else {
        $scope.emailMsg = "There was an error"; 
      }
      console.log('SEARCH Response:',response);
    });
  }

  //============================= REGISTRATION ================================
  // REGISTRATION ADD
  
  $scope.addReg = function(viper) {
    console.log('addReg',viper);
    if($scope.viperRegForm.$invalid) { return undefined }; 
    var request = AgeascopeService.makeRequest('/viper/reg',{ 
      'reg' : viper.reg
      ,'action' : 'add'
    });
    HttpService.postPromise(request).then(function(response) { 
      if(response.status == 200) {
        if (response.data.msg === "exists") {
          $scope.regMsg = "Registration already exists.";
        } else if ( response.data.msg === "ok" ) {
          $scope.regMsg = "Registration has been blocked";
          growl.success($scope.regMsg);
          $scope.viper.reg = "";
        } else if ( response.data.msg === "error" ) {
          $scope.regMsg = "There was an error"; 
          $scope.viper.reg = "";
        }; 
      } else {
        $scope.regMsg = "There was an error"; 
      }
      console.log('Registration Response:',response);
    });
  }

  //REGISTRATION REMOVE
  $scope.removeReg = function(viper) {
    console.log('removeReg',viper);
    if($scope.viperRegForm.$invalid) { return undefined }; 
    var request = AgeascopeService.makeRequest('/viper/reg',{ 
      'reg' : viper.reg
      ,'action' : 'remove'
    });
    HttpService.postPromise(request).then(function(response) { 
      if(response.status == 200) {
        if (response.data.msg === "notexists") {
          $scope.regMsg = "Registration is not blocked.";
        } else if ( response.data.msg === "ok" ) {
          $scope.regMsg = "Registration has been unblocked.";
          $scope.viper.reg = "";
        } else if ( response.data.msg === "error" ) {
          $scope.regMsg = "There was an error"; 
          $scope.viper.reg = "";
        }; 
      } else {
        $scope.regMsg = "There was an error"; 
      }
      console.log('Registration Response:',response);
    });
  }

  //REGISTRATION SEARCH
  $scope.searchReg = function(viper) {
    console.log('searchReg',viper);
    if($scope.viperRegForm.$invalid) { return undefined }; 
    var request = AgeascopeService.makeRequest('/viper/reg',{ 
      'reg' : viper.reg
      ,'action' : 'search'
    });
    HttpService.postPromise(request).then(function(response) { 
      if(response.status == 200) {
        $scope.regMsg = "Thank you";
        var results = response.data.results;
        if (results == undefined || results[0] == undefined) {
          $scope.regMsg = "Registration not found"; 
        } else {
          var regs = "";
          for (var i=0;i<results.length;i++) {
            regs += " " + results[i].REGISTRATION;
          } 
          $scope.regMsg = "Found: " + regs;
        }
      } else {
        $scope.regMsg = "There was an error"; 
      }
      console.log('REG SEARCH Response:',response);
    });
  }

}]);

