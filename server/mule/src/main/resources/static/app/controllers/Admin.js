var admin = angular.module('ageascope.controllers.Admin', []);

admin.controller('AdminController',['$scope','growl','HttpService','AgeascopeService'
  ,function($scope,growl,HttpService,AgeascopeService) {

  $scope.users = [];
  $scope.message = "";
  $scope.editing = false;
  $scope.btnEditLabel = "Edit";
 
  $scope.toggler = {
    'showMessage':true
    ,'showUsers':false
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


  $scope.removeUser = function(index) {
    console.log('removeUser-index: ',index);
  }

  $scope.checkExtension = function(input,val) {
    console.log('checkExtension-input: ',input);
    console.log('checkExtension-val: ',val);
  }

  $scope.checkDiallerUsername = function(input,val) {
    console.log('checkDiallerUsername-input: ',input);
    console.log('checkDiallerUsername-val: ',val);
  }

  $scope.edit = function(input,val) {
    console.log('edit-input: ',input);
    console.log('edit-val: ',val);
  }


  if ($scope.users.length == 0) {
    HttpService.getPromise('/admin/users').then(function(response) { 
      if(response.status == 200) {
        if (response.data.users.constructor === Array) {
          $scope.users = response.data.users;
        }
      } else {
        growl.error("There was an error while fetching the list of users"); 
      }
    });
  }

  $scope.msg = function() {
    var user = $scope.selectedUser;
    var request = AgeascopeService.makeRequest('/admin/user',{ 
      'recipient' : user
    });

    HttpService.postPromise(request).then(function(response) { 
      if(response.status == 200) {
        var options = {};
        options.host = response.data[0].IP; 
        options.port = response.data[0].PORT;
        options.method = 'POST';
        options.path = '/rest/msg';
        options.headers = {'Content-Type': 'application/json'};
        var data = {};
        data.msg = $scope.message;
        HttpService.nodePost(options,data).then(function(resp){
          console.log('Node response: ',resp);
          if(resp.statusCode == 200) {
            growl.success("Message sent.")
          } else {
            growl.error("There has been an error.")
          }
        },function(error) {
          if (error.code === "ECONNREFUSED") { 
            growl.error("Ageascope is not running on agent PC");
          } else {
            growl.error(e.message);
          }
        }); 
      } else {
        growl.error("There was an error while fetching the list of users"); 
      }
      $scope.selectedUser = null;
      $scope.message = "";
    });
  }
}]);

